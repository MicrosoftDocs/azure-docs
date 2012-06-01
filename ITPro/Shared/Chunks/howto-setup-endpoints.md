#How to Set Up Communication with a Virtual Machine

To use this feature, please sign up for access to the preview at [https://account.windowsazure.com/PreviewFeatures](https://account.windowsazure.com/PreviewFeatures). 

All virtual machines that you create in Windows Azure can automatically communicate using a private network channel with other virtual machines in the same cloud service or virtual network. However, you need to add an endpoint to a machine for other resources on the Internet or other virtual networks to communicate with it. You can associate specific ports and a protocol to endpoints. Resources can connect to an endpoint by using a protocol of TCP or UDP. The TCP protocol includes HTTP and HTTPS communication. 

Each endpoint defined for a virtual machine is assigned a public and private port for communication. The private port is defined for setting up communication rules on the virtual machine and the public port is used by the Windows Azure load balancer to communicate with the virtual machine from external resources.

1. If you have not already done so, sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the virtual machine that you want to configure.

3. Click **Endpoints**.

	![Endpoints] (../media/endpointswindows.png)

4.	Click **Add Endpoint**.

	The **Add Endpoint** dialog box appears.

	![Add endpoints] (../media/addendpointwindows.png)

5. Accept the default selection of **Add Endpoint**, and then click the arrow to continue.

	![Enter endpoint details] (../media/endpointtcpwindows.png)

6. In **Name**, enter a name for the endpoint.

7. In **Public Port** and **Private Port**, type 80. These port numbers can be different. The public port is the entry point for communication from outside of Windows Azure and is used by the Windows Azure load balancer. You can use the private port and firewall rules on the virtual machine to redirect traffic in a way that is appropriate for your application.

8.	Click the check mark to create the endpoint.

	You will now see the endpoint listed on the **Endpoints** page.

	![Endpoint creation successful] (../media/endpointwindowsnew.png)


