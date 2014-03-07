<properties writer="josephd" editor="tysonn" manager="dongill" />

#Load Balancing Virtual Machines#

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network. All other inbound communication, such as traffic initiated from Internet hosts or virtual machines in other cloud services or virtual networks, requires an endpoint.

Endpoints can be used for different purposes. The default use and configuration of endpoints on a virtual machine that you create with the Windows Azure Management Portal are for the Remote Desktop Protocol (RDP) and remote Windows PowerShell session traffic. These endpoints allow you to remotely administer the virtual machine over the Internet. 

Another use of endpoints is the configuration of the Windows Azure Load Balancer to distribute a specific type of traffic between multiple virtual machines or services. For example, you can spread the load of web request traffic across multiple web servers or web roles.

Each endpoint defined for a virtual machine is assigned a public and private port, either TCP or UDP. Internet hosts send their incoming traffic to the public IP address of the cloud service and a public port. Virtual machines and services within the cloud service listen on their private IP address and private port. The Load Balancer maps the public IP address and port number of incoming traffic to the private IP address and port number of the virtual machine and vice versa for the response traffic from the virtual machine.

When you configure load balancing of traffic among multiple virtual machines or services, Windows Azure provides random distribution of the incoming traffic.

For a cloud service that contains instances of web roles or worker roles, you can define a public endpoint in the service definition. For a cloud service that contains virtual machines, you can add an endpoint to a virtual machine when you create it or you can add the endpoint later. 

The following figure shows a load-balanced endpoint for standard (unencrypted) web traffic that is shared among three virtual machines for the public and private TCP port of 80. These three virtual machines are in a load-balanced set.

![loadbalancing](./media/load-balancing-vms/LoadBalancing.png)

When Internet clients send web page requests to the public IP address of the cloud service and TCP port 80, the Load Balancer performs a random balancing of those requests between the three virtual machines in the load-balanced set.

To create a load-balanced set of Windows Azure virtual machines, use the following steps:


- [Step 1: Create the first virtual machine] []
- [Step 2: Create additional virtual machines in the same cloud service] []
- [Step 3: Create a load balanced set with the first virtual machine] []
- [Step 4: Add virtual machines to the load-balanced set] []

## <a id="firstmachine"> </a>Step 1: Create the first virtual machine ##

If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com). You can create the first virtual machine using either the From Gallery or the Quick Create method. 

- **From Gallery** - The **From Gallery** method allows you to create endpoints when you create the virtual machine, and it allows you to specify a name for the cloud service that is created when you create the virtual machine. For instructions, see [Create a Virtual Machine Running Linux] or [Create a Virtual Machine Running Windows Server].

- **Quick Create** - Create a virtual machine by choosing an image from the Image Gallery and providing basic information. When you use this method, you will need to add the endpoint after you create the virtual machine. This method also creates a cloud service using a default name. For more information, see [How to quickly create a virtual machine] []. 

**Note**: After the virtual machine is created with Quick Create, the Cloud Services page of the Management Portal lists the name of the new cloud service as well as other information about the service.

## <a id="addmachines"> </a>Step 2: Create additional virtual machines in the same cloud service ##

Create your additional virtual machines in the same cloud service as the first virtual machine using the From Gallery method.

## <a id="loadbalance"> </a>Step 3: Create a load balanced set with the first virtual machine ##

1. In the Windows Azure Management Portal, click **Virtual Machines**, and then click the name of the first virtual machine.
	
2. Click **Endpoints**, and then click **Add**.

3. On the Add an endpoint to a virtual machine page, click the right arrow.
	
4. On the Specify the details of the endpoint page:

	- In **Name**, type a name for the endpoint or select from the list of predefined endpoints for common protocols.
	- In **Protocol**, select the protocol required by the type of endpoint, either TCP or UDP, as needed.
	- In **Public Port** and **Private Port**, type the port numbers that you want the virtual machine to use, as needed. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application. The private port can be the same as the public port. For example, for an endpoint for web (HTTP) traffic, you could assign port 80 to both the public and private port.

5. Select **Create a load-balanced set**, and then click the right arrow. 

6. On the Configure the load-balanced set page, type a name for the load-balanced set and then assign the values for probe behavior of the Windows Azure Load Balancer. The Load Balancer uses probes to determine if the virtual machines in the load-balanced set are available to receive incoming traffic.

7. Click the check mark to create the load-balanced endpoint. You will see **Yes** in the **Load-balanced set name** column of the **Endpoints** page for the virtual machine.


## <a id="addtoset"> </a>Step 4: Add virtual machines to the load-balanced set ##
After you create the load-balanced set, add the other virtual machines to it. For each virtual machine in the same cloud service:

1. In the Management Portal, click **Virtual Machines**, click the name of the virtual machine, click **Endpoints**, and then click **Add**.
	
2. On the Add an endpoint to a virtual machine page, click **Add endpoint to an existing load-balanced set**, select the name of the load-balanced set, and then click the right arrow.
	
3. On the Specify the details of the endpoint page, type a name for the endpoint, and then click the check mark.

[Step 1: Create the first virtual machine]: #firstmachine
[Step 2: Create additional virtual machines in the same cloud service]: #addmachines
[Step 3: Create a load balanced set with the first virtual machine]: #loadbalance
[Step 4: Add virtual machines to the load-balanced set]: #addtoset


<!-- LINKS -->

[Create a Virtual Machine Running Linux]: ../virtual-machines-linux-tutorial

[Create a Virtual Machine Running Windows Server]: ../virtual-machines-windows-tutorial

[How to quickly create a virtual machine]: ../virtual-machines-quick-create

[How to connect virtual machines in a cloud service]: ../virtual-machines-connect-cloud-service

[Get Started with Windows Azure PowerShell]:http://msdn.microsoft.com/en-us/library/jj156055.aspx

[Windows Azure Virtual Network Overview]: http://go.microsoft.com/fwlink/p/?LinkID=294063