
Each endpoint has a *public port* and a *private port*:

* The public port is used by the Azure load balancer to listen for incoming traffic to the virtual machine from the Internet.
* The private port is used by the virtual machine to listen for incoming traffic, typically destined to an application or service running on the virtual machine.

Default values for the IP protocol and TCP or UDP ports for well-known network protocols are provided when you create endpoints with the Azure portal. For custom endpoints, you'll need to specify the correct IP protocol (TCP or UDP) and the public and private ports. To distribute incoming traffic randomly across multiple virtual machines, you'll need to create a load-balanced set consisting of multiple endpoints.

After you create an endpoint, you can use an access control list (ACL) to define rules that permit or deny the incoming traffic to the public port of the endpoint based on its source IP address. However, if the virtual machine is in an Azure virtual network, you should use network security groups instead. For details, see [About network security groups](../articles/virtual-network/virtual-networks-nsg.md).

> [!NOTE]
> Firewall configuration for Azure virtual machines is done automatically for ports associated with remote connectivity endpoints that Azure sets up automatically. For ports specified for all other endpoints, no configuration is done automatically to the firewall of the virtual machine. When you create an endpoint for the virtual machine, you'll need to ensure that the firewall of the virtual machine also allows the traffic for the protocol and private port corresponding to the endpoint configuration. To configure the firewall, see the documentation or on-line help for the operating system running on the virtual machine.
>
>

## Create an endpoint
1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).
2. Click **Virtual Machines**, and then click the name of the virtual machine that you want to configure.
3. Click **Endpoints** in the **Settings** group. The **Endpoints** page lists all the current endpoints for the virtual machine. (This example is a Windows VM. A Linux VM will by default show an endpoint for SSH.)

   <!-- ![Endpoints](./media/virtual-machines-common-classic-setup-endpoints/endpointswindows.png) -->
   ![Endpoints](./media/virtual-machines-common-classic-setup-endpoints/endpointsblade.png)

4. In the command bar above the endpoint entries, click **Add**.
5. On the **Add endpoint** page, type a name for the endpoint in **Name**.
6. In **Protocol**, choose either **TCP** or **UDP**.
7. In **Public Port**, type the port number for the incoming traffic from the Internet. In **Private Port**, type the port number on which the virtual machine is listening. These port numbers can be different. Ensure that the firewall on the virtual machine has been configured to allow the traffic corresponding to the protocol (in step 6) and private port.
10. Click **Ok**.

The new endpoint will be listed on the **Endpoints** page.

![Endpoint creation successful](./media/virtual-machines-common-classic-setup-endpoints/endpointcreated.png)

## Manage the ACL on an endpoint
To define the set of computers that can send traffic, the ACL on an endpoint can restrict traffic based upon source IP address. Follow these steps to add, modify, or remove an ACL on an endpoint.

> [!NOTE]
> If the endpoint is part of a load-balanced set, any changes you make to the ACL on an endpoint are applied to all endpoints in the set.
>
>

If the virtual machine is in an Azure virtual network, we recommend network security groups instead of ACLs. For details, see [About network security groups](../articles/virtual-network/virtual-networks-nsg.md).

1. If you haven't already done so, sign in to the Azure portal.
2. Click **Virtual Machines**, and then click the name of the virtual machine that you want to configure.
3. Click **Endpoints**. From the list, select the appropriate endpoint. The ACL list is at the bottom of the page.

   ![Specify ACL details](./media/virtual-machines-common-classic-setup-endpoints/aclpreentry.png)

4. Use rows in the list to add, delete, or edit rules for an ACL and change their order. The **Remote Subnet** value is an IP address range for incoming traffic from the Internet that the Azure load balancer uses to permit or deny the traffic based on its source IP address. Be sure to specify the IP address range in CIDR format, also known as address prefix format. An example is `10.1.0.0/8`.

 ![New ACL entry](./media/virtual-machines-common-classic-setup-endpoints/newaclentry.png)


You can use rules to allow only traffic from specific computers corresponding to your computers on the Internet or to deny traffic from specific, known address ranges.

The rules are evaluated in order starting with the first rule and ending with the last rule. This means that rules should be ordered from least restrictive to most restrictive. For examples and more information, see [What is a Network Access Control List](../articles/virtual-network/virtual-networks-acl.md).
