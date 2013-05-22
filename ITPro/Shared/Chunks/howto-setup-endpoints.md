<properties writer="kathydav" editor="tysonn" manager="jeffreyg" />

#How to Set Up Communication with a Virtual Machine

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network.

Windows virtual machines that you create in the Management Portal automatically include an endpoint for Remote Desktop access. If you enable Windows PowerShell Remoting, another endpoint is automatically created for that purpose. However, you need to add endpoints to a virtual machine for other resources on the Internet or other virtual networks to communicate with it. 

The ports and protocol for Remote Desktop and Windows PowerShell Remoting endpoints are assigned automatically when created through the Management Portal. For all other endpoints, you specify the ports and protocol when you create the endpoint. Resources can connect to an endpoint by using either the TCP or UDP protocol. The TCP protocol includes HTTP and HTTPS communication.  

**Note**: If you want to connect to your virtual machines directly by hostname or set up cross-premises connections, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

Each endpoint has a public port and a private port:

- The private port is used internally by the virtual machine to listen for traffic on that endpoint.

- The public port is used by the Windows Azure load balancer to communicate with the virtual machine from external resources. After you create an endpoint, you can use the network access control list (ACL) to define rules that help isolate and control the incoming traffic on the public port. For more information, see [About Network Access Control Lists](http://go.microsoft.com/fwlink/p/?LinkId=303816).

The following tasks are covered in this article:

- Create an Endpoint
- Manage the ACL of an Endpoint

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

###Manage the ACL of an Endpoint###

1. If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the virtual machine that you want to configure.

3. Click **Endpoints**. The Endpoints page lists all endpoints for the virtual machine.

	![ACL list] (../media/EndpointsShowsDefaultEndpointsForVM.PNG)

4. Select the appropriate endpoint from the list. 

5. Click **Manage ACL**.

	The **Specify ACL details** dialog box appears.

	![Specify ACL details] (../media/EndpointACLdetails.PNG)

6. Use rows in the list to add, delete, or edit rules for an ACL. The Remote Subnet value corresponds to the IP address range that you can either allow or deny as a rule. The rules are evaluated in order starting with the first rule and ending with the last rule. This means that rules should be listed from least restrictive to most restrictive. For examples, see [About Network Access Control Lists](http://go.microsoft.com/fwlink/p/?LinkId=303816).


