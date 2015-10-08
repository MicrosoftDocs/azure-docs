## Virtual Network
Virtual Networks (VNET) and subnets resources help define a security boundary for workloads running in Azure. A VNet is characterized by a collection of address spaces, defined as CIDR blocks. 

>[AZURE.NOTE] Network administrators are familiar with CIDR notation. If you are not familiar with CIDR, [learn more about it](http://whatismyipaddress.com/cidr).

![VNet with multiple subnets](./media/resource-groups-networking/Figure4.png)

VNets contain the following properties.

|Property|Description|Sample values|
|---|---|---|
|**addressSpace**|Collection of address prefixes that make up the VNet in CIDR notation|192.168.0.0/16|
|**subnets**|Collection of subnets that make up the VNet|see [subnets](#Subnets) below.|
|**ipAddress**|IP address assigned to object. This is a read-only property.|104.42.233.77|

### Subnets
A subnet is a child resource of a VNet, and helps define segments of address spaces within a CIDR block, using IP address prefixes. NICs can be added to subnets, and connected to VMs, providing connectivity for various workloads.

Subnets contain the following properties. 

|Property|Description|Sample values|
|---|---|---|
|**addressPrefix**|Single address prefix that make up the subnet in CIDR notation|192.168.1.0/24|
|**networkSecurityGroup**|NSG applied to the subnet|see [NSGs](#Network-Security-Group)|
|**routeTable**|Route table applied to the subnet|see [UDR](#Route-table)|
|**ipConfigurations**|Collection of IP configruation objects used by NICs connected to the subnet|see [UDR](#Route-table)|


Sample VNet in JSON format:

	{
	    "name": "TestVNet",
	    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet",
	    "etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	    "type": "Microsoft.Network/virtualNetworks",
	    "location": "westus",
	    "tags": {
	        "displayName": "VNet"
	    },
	    "properties": {
	        "provisioningState": "Succeeded",
	        "resourceGuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	        "addressSpace": {
	            "addressPrefixes": [
	                "192.168.0.0/16"
	            ]
	        },
	        "subnets": [
	            {
	                "name": "FrontEnd",
	                "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd",
	                "etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	                "properties": {
	                    "provisioningState": "Succeeded",
	                    "addressPrefix": "192.168.1.0/24",
	                    "networkSecurityGroup": {
	                        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BackEnd"
	                    },
	                    "routeTable": {
	                        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/routeTables/UDR-FrontEnd"
	                    },
	                    "ipConfigurations": [
	                        {
	                            "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/NICWEB1/ipConfigurations/ipconfig1"
	                        },
	                        ...]
	                }
	            },
	            ...]
	    }
	}

### Additional resources

- Get more information about [VNet](virtual-networks-overview.md).
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt163650.aspx) for VNets.
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt163618.aspx) for Subnets.