local dss = game:GetService("DataStoreService")
local http = game:GetService("HttpService")
local ds = dss:GetDataStore("DTR")
local dsKey = "DTR_"

local url = ""


local function completed(id)
	pcall(function()
		local data = {["method"] = "done", ["commandId"] = id}
		local dataJson = http:JSONEncode(data)
		http:PostAsync(url, dataJson, Enum.HttpContentType.ApplicationJson, false)
	end)
end

local function getQueue()
	local res
	local data

	pcall(function()
		res = http:GetAsync(""..url.."/queue")
		data = http:JSONDecode(res)
	end)

	if not data then
		return false
	end

	for i,v in pairs(data) do
		local id = i
		local name = v['name']
		local method = v['method']
		local reason = v['reason']

		if id and name and method then
			
				if method == "kick" then
					for i,v in pairs(game.Players:GetChildren()) do
						if (string.lower(name) == string.lower(v.Name)) then
							v:Kick(reason)
						end
					end
					completed(id)
				end
				if method == "ban" then
					local userid = game.Players:GetUserIdFromNameAsync(name)
					ds:SetAsync(""..dsKey..userid, reason)
					completed(id)
					for i,v in pairs(game.Players:GetChildren()) do
						if (string.lower(name) == string.lower(v.Name)) then
							v:Kick(reason)
						end
					end
				end
				if method == "unban" then
					local userid = game.Players:GetUserIdFromNameAsync(name)
					ds:RemoveAsync(""..dsKey..userid.."")
					completed(id)
				end
		end
	end
	return true
end

getQueue()

game.Players.PlayerAdded:Connect(function(plr)
	local banned = ds:GetAsync(""..dsKey..plr.UserId.."")
	if banned then
		plr:Kick(banned)
	end
end)

while true do
	getQueue()
	wait(5)
end
