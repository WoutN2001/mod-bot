local dss = game:GetService("DataStoreService")
local http = game:GetService("HttpService")
local ds = dss:GetDataStore("DTR")
local dsKey = "DTR_test333"

local url = "http://localhost:3000"


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
			if game.Players:FindFirstChild(name) then
				if method == "kick" then
					game.Players:FindFirstChild(name):Kick(reason)
					completed(id)
				end
				if method == "ban" then
					local plr = game.Players:FindFirstChild(name)
					local userid = plr.UserId
					ds:SetAsync(""..dsKey..userid, reason)
					plr:Kick(reason)
					completed(id)
				end
				if method == "unban" then
					local ps = game:GetService("Players")
					local userid = ps:GetUserIdFromNameAsync(name)
					ds:RemoveAsync(""..dsKey..userid.."")
					completed(id)
				end
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
