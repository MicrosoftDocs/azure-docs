## Public IP address
A public IP address resource provides either a reserved or dynamic Internet facing IP address. Although you can create a public IP address as a stand alone object, you need to associate it to another object to actually use the address. You can associate a public IP address to a load balancer, application  gateway, or a NIC to provide Internet access to those resources.  

|Property|Description|Sample values|
|---|---|---|
|**publicIPAllocationMethod**|Defines if the IP address is *static* or *dynamic*.|static, dynamic|
|**idleTimeoutInMinutes**|Defines the idle time out, with a default value of 4 minutes. If no more packets for a given session is received within this time, the session is terminated.|any value between 4 and 30|
|**ipAddress**|IP address assigned to object. This is a read-only property.|104.42.233.77|

### DNS settings
Public IP addresses have a child object named **dnsSettings** containing the following properties:

|Property|Description|Sample values|
|---|---|---|
|**domainNameLabel**|Host named used for name resolution.|www, ftp, vm1|
|**fqdn**|Fully qualified name for the public IP.|www.westus.cloudapp.azure.com|
|**reverseFqdn**|Fully qualified domain name that resolves to the IP address and is registered in DNS as a PTR record.|www.contoso.com.|

Sample public IP address in JSON format:

	{
	   "name": "PIP01",
	   "location": "North US",
	   "tags": { "key": "value" },
	   "properties": {
	      "publicIPAllocationMethod": "Static",
	      "idleTimeoutInMinutes": 4,
		  "ipAddress": "104.42.233.77",
	      "dnsSettings": {
	         "domainNameLabel": "mylabel",
			 "fqdn": "mylabel.westus.cloudapp.azure.com",
	         "reverseFqdn": "contoso.com."
	      }
	   }
	} 

### Additional resources

- Get more information about [public IP addresses](../articles/virtual-network/virtual-networks-reserved-public-ip.md).
- Learn about [instance level public IP addresses](../articles/virtual-network/virtual-networks-instance-level-public-ip.md).
- Read the [REST API reference documentation](https://msdn.microsoft.com/library/azure/mt163638.aspx) for public IP addresses.