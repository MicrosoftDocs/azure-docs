## Network Security Group
An NSG resource enables the creation of security boundary for workloads, by implementing allow and deny rules. Such rules can be applied to a VM, a NIC, or a subnet.

|Property|Description|Sample values|
|---|---|---|
|**subnets**|List of subnet ids the NSG is applied to.|/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd|
|**securityRules**|List of security rules that make up the NSG|See [Security rule](#Security-rule) below|
|**defaultSecurityRules**|List of default security rules present in every NSG|See [Default security rules](#Default-security-rules) below|

- **Security rule** - An NSG can have multiple security rules defined. Each rule can allow or deny different types of traffic.

### Security rule
A security rule is a child resource of an NSG containing the properties below.

|Property|Description|Sample values|
|---|---|---|
|**description**|Description for the rule|Allow inbound traffic for all VMs in subnet X|
|**protocol**|Protocol to match for the rule|TCP, UDP, or *|
|**sourcePortRange**|Source port range to match for the rule|80, 100-200, *|
|**destinationPortRange**|Destination port range to match for the rule|80, 100-200, *|
|**sourceAddressPrefix**|Source address prefix to match for the rule|10.10.10.1, 10.10.10.0/24, VirtualNetwork|
|**destinationAddressPrefix**|Destination address prefix to match for the rule|10.10.10.1, 10.10.10.0/24, VirtualNetwork|
|**direction**|Direction of traffic to match for the rule|inbound or outbound|
|**priority**|Priority for the rule. Rules are checked int he order of priority, once a rule applies, no more rules are tested for matching.|10, 100, 65000|
|**access**|Type of access to apply if the rule matches|allow or deny|

Sample NSG in JSON format:

	{
	    "name": "NSG-BackEnd",
	    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BackEnd",
	    "etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	    "type": "Microsoft.Network/networkSecurityGroups",
	    "location": "westus",
	    "tags": {
	        "displayName": "NSG - Front End"
	    },
	    "properties": {
	        "provisioningState": "Succeeded",
	        "resourceGuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	        "securityRules": [
	            {
	                "name": "rdp-rule",
	                "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/networkSecurityGroups/NSG-BackEnd/securityRules/rdp-rule",
	                "etag": "W/\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\"",
	                "properties": {
	                    "provisioningState": "Succeeded",
	                    "description": "Allow RDP",
	                    "protocol": "Tcp",
	                    "sourcePortRange": "*",
	                    "destinationPortRange": "3389",
	                    "sourceAddressPrefix": "Internet",
	                    "destinationAddressPrefix": "*",
	                    "access": "Allow",
	                    "priority": 100,
	                    "direction": "Inbound"
	                }
	            }
	        ],
	        "defaultSecurityRules": [
	            { [...],
	        "subnets": [
	            {
	                "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
	            }
	        ]
	    }
	}

### Default security rules
Default security rules have the same properties available in security rules. They exist to provide basic connectivity between resources that have NSGs applied to them. Make sure you know which [default security rules](./virtual-networks-nsg.md#Default-Rules) exist. 

### Additional resources

- Get more information about [NSGs](virtual-networks-nsg.md).
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt163615.aspx) for NSGs.
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt163580.aspx) for security rules.