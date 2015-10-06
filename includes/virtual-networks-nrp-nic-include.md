## NIC
A network interface card (NIC) resource provides network connectivity to an existing subnet in a VNet resource. Although you can create a NIC as a stand alone object, you need to associate it to another object to actually provide connectivity. You can associate a NIC to a load balancer back end pool, application  gateway backend pool, and a VM.  

|Property|Description|Sample values|
|---|---|---|
|**publicIPAllocationMethod**|Defines if the IP address is *static* or *dynamic*.|static, dynamic|
|**idleTimeoutInMinutes**|Defines the idle time out, with a default value of 4 minutes. If no more packets for a given session is received within this time, the session is terminated.|any value between 4 and 30|
|**ipAddress**|IP address assigned to object. This is a read-only property.|104.42.233.77|

A Network Interface Card, or NIC, represents a network interface that can be associated to a virtual machine (VM). A VM can have one or more NICs.

![NIC's on a single VM](./media/resource-groups-networking/Figure3.png)

Key properties of a NIC resource include:

- IP settings
- Internal DNS name
- DNS servers

A NIC can also be associated with the following network resources:

- Network Security Group (NSG) 
- Load balancer