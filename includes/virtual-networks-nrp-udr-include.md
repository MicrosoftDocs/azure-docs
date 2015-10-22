## Route tables
Route table resources contains routes used to define how traffic flows within your Azure infrastructure. You can use user defined routes (UDR) to send all traffic from a given subnet to a virtual appliance, such as a firewall or intrusion detection system (IDS). You can associate a route table to subnets. 

Route tables contain the following properties.

|Property|Description|Sample values|
|---|---|---|
|**routes**|Collection of user defined routes in the route table|see [user defined routes](#User-defined-routes)|
|**subnets**|Collection of subnets the route table is applied to|see [subnets](#Subnets)|


### User defined routes
You can create UDRs to specify where traffic should be sent to, based on its destination address. You can think of a route as the default gateway definition based on the destination address of a network packet.

UDRs contain the following properties. 

|Property|Description|Sample values|
|---|---|---|
|**addressPrefix**|Address prefix, or full IP address for the destination|192.168.1.0/24, 192.168.1.101|
|**nextHopType**|Type of device the traffic will be sent to|VirtualAppliance, VPN Gateway, Internet|
|**nextHopIpAddress**|IP address for the next hop|192.168.1.4|


Sample route table in JSON format:

	{
	    "name": "UDR-BackEnd",
	    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-BackEnd",
	    "etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	    "type": "Microsoft.Network/routeTables",
	    "location": "westus",
	    "properties": {
	        "provisioningState": "Succeeded",
	        "routes": [
	            {
	                "name": "RouteToFrontEnd",
	                "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-BackEnd/routes/RouteToFrontEnd",
	                "etag": "W/\"v\"",
	                "properties": {
	                    "provisioningState": "Succeeded",
	                    "addressPrefix": "192.168.1.0/24",
	                    "nextHopType": "VirtualAppliance",
	                    "nextHopIpAddress": "192.168.0.4"
	                }
	            }
	        ],
	        "subnets": [
	            {
	                "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/BackEnd"
	            }
	        ]
	    }
	}

### Additional resources

- Get more information about [UDRs](virtual-networks-udr-overview.md).
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt502549.aspx) for route tables.
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt502539.aspx) for user defined routes (UDRs).