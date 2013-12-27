<properties writer="kathydav" editor="tysonn" manager="jeffreyg" />

#Load Balancing Virtual Machines#

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a virtual machine for other resources on the Internet or other virtual networks to communicate with it. 

Endpoints can be used for different purposes, such as to balance the load of network traffic among them, to maintain high availability, or for direct virtual machine connectivity through protocols such as RDP or SSH. You define endpoints that are associated to specific ports and are assigned a specific communication protocol. 

An endpoint can be assigned a protocol of TCP or UDP (the TCP protocol includes HTTP and HTTPS traffic). Each endpoint defined for a virtual machine is assigned a public and private port for communication. The private port is defined for setting up communication rules on the virtual machine and the public port is used by Windows Azure to communicate with the virtual machine from external resources.


**Note**: If you want to learn about connecting to virtual machines directly by hostname or set up cross-premises connections, see [Windows Azure Virtual Network Overview].

If you configure load balancing, Windows Azure provides round-robin load balancing of network traffic to publicly defined ports of a cloud service. A load-balanced endpoint is a specific TCP or UDP endpoint used by all members of a cloud service.

For a cloud service that contains instances of web roles or worker roles, you can define a public endpoint in the service definition. For a cloud service that contains virtual machines, you group the new virtual machines in the same cloud service when you create them. You can add an endpoint to a virtual machine when you create it, or you can add it later.

The following image shows a load-balanced endpoint that is shared among three virtual machines and uses a public and private port of 80.

![loadbalancing](./media/load-balancing-vms/LoadBalancing.png)

This task includes the following steps:

- [Step 1: Create the first virtual machine and an endpoint] []
- [Step 2: Create additional virtual machines in the same cloud service] []
- [Step 3: Set up load balancing of the virtual machines] []
- [Step 4: Add virtual machines to the load-balanced set] []

## <a id="firstmachine"> </a>Step 1: Create the first virtual machine ##

You can create the first virtual machine by using either the **From Gallery** or the **Quick Create** method. 

- **From Gallery** - The **From Gallery** method allows you to create an endpoint when you create the virtual machine, and it allows you to specify a name for the cloud service that is created when you create the virtual machine. For instructions, see [Create a Virtual Machine Running Linux] or [Create a Virtual Machine Running Windows Server].

- **Quick Create** - Create a virtual machine by choosing an image from the Image Gallery and providing basic information. When you use this method, you will need to add the endpoint after you create the virtual machine. This method also creates a cloud service using a default name. For more information, see [How to quickly create a virtual machine] []. 

**Note**: After the virtual machine is created, the **Cloud Services** page of the Management Portal lists the name of the cloud service as well as other information about the service.

## <a id="addmachines"> </a>Step 2: Create additional virtual machines in the same cloud service ##

To add virtual machines to a cloud service so you can load balance them, add the virtual machines to the same cloud service when you create them. For more information about connecting virtual machines, see [How to connect virtual machines in a cloud service] [].

## <a id="loadbalance"> </a>Step 3: Set up load balancing of the virtual machines ##

After you create an endpoint on the first virtual machine and add the other virtual machines to the same cloud service, assign the endpoint to the new virtual machines for load balancing.

**To set up a load-balanced endpoint**

1. If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select one of the virtual machines in the same cloud service.
	
3. Click **Endpoints**.
	
4. Click **Add Endpoint** or select the endpoint and **Edit Endpoint**, depending on whether you added the endpoint when you created the virtual machine. Then do one of the following:

- If you're adding an endpoint, click **Add Standalone endpoint** and then click the arrow.

		- In **Name**, type a name for the endpoint.
		- 		In **Protocol**, select the protocol required by the type of endpoint, either TCP or UDP.
		- 		In **Public Port** and **Private Port**, type the port number that you want the virtual machine to use. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application. The public port is the same as the public port defined for the endpoint on the first virtual machine. The private port can be the same as the public port. For example, for an HTTP endpoint, you will likely want to assign port 80 to the public port and the private port for all virtual machines.
		- 		Click **Create a load-balanced set**.

- If you're editing an endpoint, click **Create a load-balanced set**.
	

5. On the **Configure the load-balanced set** page, specify a name for the load-balanced set and then assign the values for the load-balancing probe. 

6. Click the check mark to create the load-balanced endpoint. You will see **Yes** in the **Load-balanced set name** column of the Endpoints page for both virtual machines.

## <a id="addtoset"> </a>Step 4: Add virtual machines to the load-balanced set ##
After you create the load-balanced set, add the other virtual machines to the set.

1. Select one of the virtual machines in the same cloud service.
	
2. Click **Endpoints**.
	
3. Click **Add Endpoint**.

4. Click **Add endpoint to an existing load-balanced set** and then click the arrow.

5. Specify the name and protocol for the endpoint, and then click the check mark.

6. Repeat the process for the rest of the virtual machines in the cloud service.

[Step 1: Create the first virtual machine and an endpoint]: #firstmachine
[Step 2: Create additional virtual machines in the same cloud service]: #addmachines
[Step 3: Set up load balancing of the virtual machines]: #loadbalance
[Step 4: Add virtual machines to the load-balanced set]: #addtoset


<!-- LINKS -->

[Create a Virtual Machine Running Linux]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-linux-tutorial

[Create a Virtual Machine Running Windows Server]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-tutorial

[How to quickly create a virtual machine]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-quick-create

[Manage the availability of virtual machines]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-manage-availability

[How to set up communication with a virtual machine]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-how-to-setup-endpoints

[How to connect virtual machines in a cloud service]: http://windowsazure.com/en-us/documentation/articles/cloud-services-connect-virtual-machine

[Get Started with Windows Azure PowerShell]:http://msdn.microsoft.com/en-us/library/jj156055.aspx

[Windows Azure Virtual Network Overview]: http://go.microsoft.com/fwlink/p/?LinkID=294063