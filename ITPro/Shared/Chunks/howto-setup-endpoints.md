<properties writer="kathydav" editor="tysonn" manager="jeffreyg" />

#How to Set Up Communication with a Virtual Machine

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network. However, you need to add endpoints to a virtual machine for other resources on the Internet or other virtual networks to communicate with it. 

When you create a virtual machine in the Management Portal, you can create these endpoints, such as for Remote Desktop, Windows PowerShell Remoting, or Secure Shell (SSH). To create additional endpoints after you create the virtual machine, follow the steps in this article.

**Note**: If you want to connect to your virtual machines directly by hostname or set up cross-premises connections, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

Each endpoint has a public port and a private port:

- The private port is used internally by the virtual machine to listen for traffic on that endpoint.

- The public port is used by the Windows Azure load balancer to communicate with the virtual machine from external resources. After you create an endpoint, you can use the network access control list (ACL) to define rules that help isolate and control the incoming traffic on the public port. For more information, see [About Network Access Control Lists](http://go.microsoft.com/fwlink/p/?LinkId=303816).

Default values for the ports and protocol for these endpoints are provided when the endpoints are created through the Management Portal. For all other endpoints, you specify the ports and protocol when you create the endpoint. Resources can connect to an endpoint by using either the TCP or UDP protocol. The TCP protocol includes HTTP and HTTPS communication.  

###Create an Endpoint###


1. If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the virtual machine that you want to configure.

3. Click **Endpoints**. The Endpoints page lists all endpoints for the virtual machine.

	![Endpoints] (../media/endpointswindows.png)

4.	Click **Add**.

	The **Add Endpoint** dialog box appears.

	![Add endpoint] (../media/Endpointwizardadddetails.png)

5. Accept the default selection of **Add Endpoint**, and then click the arrow to continue.

	![Specify endpoint details] (../media/EndpointWizardAddDetails.PNG)

6. In **Name**, enter a name for the endpoint.

7. In **Public Port** and **Private Port**, type 80. These port numbers can be different. The public port is the entry point for communication from outside of Windows Azure and is used by the Windows Azure load balancer. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application.

8.	Click the check mark to create the endpoint.

	You will now see the endpoint listed on the **Endpoints** page.

	![Endpoint creation successful] (../media/endpointwindowsnew.png)




