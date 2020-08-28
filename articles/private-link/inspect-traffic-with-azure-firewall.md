---
title: 'Use Azure Firewall to inspect traffic destined to a Private Endpoint'
titleSuffix: Azure Private Link
description: Learn how you can inspect traffic destined to a Private Endpoint using Azure Firewall.
services: private-link
author: jocortems
ms.service: private-link
ms.topic: how-to
ms.date: 09/02/2020
ms.author: jocorte

---
# Use Azure Firewall to inspect traffic destined to a Private Endpoint

Azure Private Endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources deployed in a virtual network, like virtual machines (VMs), to communicate privately with Private Link resources.

Unlike [Service Endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) which must be enabled in each subnet that requires access to Azure services, Private Endpoints allow any resource deployed in the virtual network as well as in any peered virtual networks and connected on-premises networks to access the Private Link services; depending on your security policy you might need to inspect or block communication from certain clients to the services exposed via Private Endpoints. Although you can achieve this by using [Azure Firewall](../firewall/overview.md) or a third party Network Virtual Appliance of your choice there are some limitations that can make it challenging to implement:

- Network Security Groups (NSG) do not apply to Private Endpoints

- User Defined Routes (UDR) don't apply to Private Endpoints

- A single route table can be attached to a subnet

- A route table supports up to 400 routes

Azure Firewall will be the focus of this article, it allows filtering traffic using [FQDN in network rules](../firewall/fqdn-filtering-network-rules.md) for any TCP/UDP protocols or [FQDN in application rules](../firewall/features.md#application-fqdn-filtering-rules) for HTTP/S and MSSQL. Because most of the services exposed over Private Endpoints use HTTPS and Azure SQL uses MSSQL the use of application rules over network rules is recommended.

> [!NOTE]
> SQL FQDN filtering is supported in [proxy-mode](../azure-sql/database/connectivity-architecture.md#connection-policy) only (port 1433). *proxy* mode can result in more latency compared to *redirect*. If you want to continue using redirect mode, which is the default for clients connecting within Azure, you can filter access using FQDN in firewall network rules.

## Scenario 1: Hub and Spoke Architecture - Dedicated Virtual Network for Private Endpoints

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/hubandspoke.png" alt-text="Dedicated Virtual Network for Private Endpoints" border="true":::

This is the most scalable architecture if there is a need to connect privately to multiple Azure services using Private Endpoints because only a single route pointing to the entire virtual network address space where the Private Endpoints are deployed is needed, this reduces administrative overhead and prevents running into the 400 routes limit.

The tradeoff with this architecture is that virtual network peering charges will be incurred from the virtual machine in the Client virtual network to the Azure Firewall in the hub virtual network; note however that there are no virtual network peering charges when connecting to Private Endpoints in a peered virtual network as documented in the FAQ section of the [pricing](https://azure.microsoft.com/pricing/details/private-link/) page.

>[!NOTE]
> This scenario can be implemented using any third party NVA or Azure Firewall network rules instead of application rules.

## Scenario 2: Hub and Spoke Architecture - Shared Virtual Network for Private Endpoints and Virtual Machines

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/sharedspoke.png" alt-text="Private Endpoints and Virtual Machines in same Virtual Network" border="true":::

This architecture can be implemented when it is not possible to have a dedicated virtual network for the Private Endpoints, or when only a few services will be exposed in the virtual network using Private Endpoints. Because the virtual machines will have /32 system routes pointing to each Private Endpoint one route per Private Endpoint must be configured in order to route traffic through Azure Firewall. As the number of services exposed in the virtual network using Private Endpoints increases so does the administrative overhead of maintaining the route table and, depending on your overall architecture, it is possible to run into the 400 routes limit. It is for these reasons that we recommend using Scenario 1 whenever possible.

As with Scenario 1, virtual network peering charges will be incurred from the virtual machine in the Client virtual network to the Azure Firewall in the hub virtual network; note however that there are no virtual network peering charges when connecting to Private Endpoints in a peered virtual network as documented in the FAQ section of the [pricing](https://azure.microsoft.com/pricing/details/private-link/) page.

>[!NOTE]
> This scenario can be implemented using any third party NVA or Azure Firewall network rules instead of application rules.

## Scenario 3: Single Virtual Network

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/singlevnet.png" alt-text="Single Virtual Network" border="true":::

This architecture can be implemented when all services have been deployed into a single virtual network and migrating to a hub and spoke architecture is not possible. The same considerations as in Scenario 2 above apply; however in this scenario there are no virtual network peering charges.

>[!NOTE]
> If you want to implement this scenario using a third party NVA or Azure Firewall network rules instead of application rules it is required to SNAT traffic destined to the Private Endpoints in order to maintain flow symmetry; otherwise communication between the virtual machines and Private Endpoints will break.

## Scenario 4: On-premises traffic to Private Endpoints

:::image type="content" source="./media/inspect-traffic-using-azure-firewall/onprem.png" alt-text="On-premises traffic to private endpoints" border="true":::

This architecture can be implemented if you have set up connectivity with your on-premises network either using [ExpressRoute](..\expressroute\expressroute-introduction.md) or [Site to Site VPN](..\vpn-gateway\vpn-gateway-howto-site-to-site-resource-manager-portal.md) and have a requirement for clients in your on-premises network accessing services exposed in a virtual network via Private Endpoints to be routed through a security appliance. The same considerations as in Scenario 2 above apply; however in this scenario there are no virtual network peering charges. For more information about how to configure your DNS servers to allow on-premises workloads to access Private Endpoints refer to [On-Premises workloads using a DNS forwarder](./private-endpoint-dns.md#on-premises-workloads-using-a-dns-forwarder).

>[!NOTE]
> If you want to implement this scenario using a third party NVA or Azure Firewall network rules instead of application rules it is required to SNAT traffic destined to the Private Endpoints in order to maintain flow symmetry; otherwise communication between the virtual machines and Private Endpoints will break.

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Create a VM

In this section, you will create virtual network and the subnet to host the VM that is used to access your Private Link Resource (an Azure SQL database in this example).

## Virtual networks and parameters

You will create three virtual networks and their corresponding subnets to host the VM that is used to access your Private Link resource, the Azure Firewall used to restrict communication between the VM and the Private Endpoint and the Private Endpoint respectively.

Replace the following parameters in the steps with the information below:

| Parameter                   | Value                |
|-----------------------------|----------------------|
| **\<resource-group-name>**  | myResourceGroup |
| **\<virtual-machine-virtual-network-name>** | VM-VNET          |
| **\<region-name>**          | South Central US      |
| **\<IPv4-address-space>**   | 10.1.0.0/16          |
| **\<subnet-name>**          | VMSubnet        |
| **\<subnet-address-range>** | 10.1.0.0/24          |
| **\<azure-firewall-virtual-network-name>** | AzFW-VNET          |
| **\<region-name>**          | South Central US      |
| **\<IPv4-address-space>**   | 10.0.0.0/16          |
| **\<subnet-name>**          | AzureFirewallSubnet        |
| **\<subnet-address-range>** | 10.0.0.0/24          |
| **\<private-endpoint-virtual-network-name>** | PrivateEndpoint-VNET          |
| **\<region-name>**          | South Central US      |
| **\<IPv4-address-space>**   | 10.2.0.0/16          |
| **\<subnet-name>**          | PrivateEndpointSubnet    |        |
| **\<subnet-address-range>** | 10.2.0.0/24          |

[!INCLUDE [virtual-networks-create-new](../../includes/virtual-networks-create-new.md)]

1. Repeat steps 1 to 9 to create the virtual networks for hosting the Azure Firewall and Private Endpoint resources.

### Create virtual machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual machine**.

1. In **Create a virtual machine - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.  |
    | **INSTANCE DETAILS** |  |
    | Virtual machine name | Enter **myVm**. |
    | Region | Select **(US) South Central US**. |
    | Availability options | Leave the default **No infrastructure redundancy required**. |
    | Image | Select **Ubuntu Server 18.04 LTS - Gen1**. |
    | Size | Select **Standard_B2s - 2 vcpus, 4 GiB memory**. |
    | **ADMINISTRATOR ACCOUNT** |  |
    | Authentication type | Select **Password**. |
    | Username | Enter a username of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../virtual-machines/linux/faq.md?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm).|
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** |  |
    | Public inbound ports | Select **None**. |
    |||

1. Select **Next: Disks**.

1. In **Create a virtual machine - Disks**, leave the defaults and select **Next: Networking**.

1. In **Create a virtual machine - Networking**, select this information:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **VM-VNET**.  |
    | Subnet | Select **VMSubnet (10.1.0.0/24)**.|
    | Public IP | Leave the default **(new) myVm-ip**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **SSH**.|
    ||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

## Deploy the Firewall

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.

1. Type **firewall** in the search box and press **Enter**.

1. Select **Firewall** and then select **Create**.

1. On the **Create a Firewall** page, use the following table to configure the firewall:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**.  |
    | **INSTANCE DETAILS** |  |
    | Name | Enter **Test-Fw-001**. |
    | Region | Select **South Central US**. |
    | Availability zone | Leave the default **None**. |
    | Choose a virtual network    |    Select **Use Existing**.    |
    | Virtual network    |    Select **AzureFirewallVNET**.    |
    | Public IP address    |    Select **Add new** and in Name enter **test-fw-001-vip**.    |
    | Forced tunneling    | Leave the default **Disabled**.    |
    |||
1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

## Create your Private Endpoint

In this section, you will create a private SQL Database using a Private Endpoint to securely connect to it.

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Databases** > **SQL Database**.

1. In **Create SQL Database - Basics**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    | **DATABASE DETAILS** |  |
    | Database name  | Enter **mypedatabase**.  |
    | Server | Select **Create new** and enter the information below.    |
    | Server name | Enter **mypedbserver**. If this name is taken enter a unique name    |
    | Server admin login | Enter a name of your choosing. |
    | Password    |    Enter a password of your choosing.    |
    | Confirm Password | Reenter password    |
    | Location    | Select **(US) South Central US**.    |
    | Want to use SQL elastic pool    | Leave the default **No**. |
    | Compute + storage | Leave the default **General Purpose Gen5, 2 vCores, 32 GB Storage**. |
    |||
  
1. Select **Next: Networking**.

1. In **Create SQL Database - Networking**, connectivity method, select **Private Endpoint**.

1. In **Create SQL Database - Networking**, select **Add Private Endpoint**.

1. In **Create Private Endpoint**, enter or select this information:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section.|
    |Location|Select **(US) South Central US**.|
    |Name|Enter **sqlPrivateEndpoint**.  |
    | **NETWORKING** |  |
    | Virtual network  | Select **PrivateEndpoint-VNET** from resource group **myResourceGroup**. |
    | Subnet | Select **PrivateEndpointSubnet**. |
    | **PRIVATE DNS INTEGRATION**|  |
    | Integrate with private DNS zone  | Leave the default **Yes**. |
    | Private DNS zone  | Leave the default **(New) privatelink.database.windows.net**. |
    |||

1. Select **OK**.

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

## Connect the virtual networks using virtual network peering

In this section we will connect VNETs **VM-VNET** and **PrivateEndpoint-VNET** to **AzFW-VNET** using VNET peering; there will not be direct connectivity between **VM-VNET** and **PrivateEndpoint-VNET**.

1. In the portal's search bar, enter **AzFW-VNET**.

1. Select **Peerings** under **Settings** menu and click on **Add** button.

1. In **Add Peering** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name of the peering from AzFW-VNET to remote virtual network | Enter **AzFW-VNET-to-VM-VNET**. |
    | **PEER DETAILS** |  |
    | Virtual network deployment model  | Leave the default **Resource manager**.  |
    | I know my resource ID | Leave unchecked.    |
    | Subscription | Select your subscription.    |
    | Virtual network | Select **VM-VNET**. |
    | Name of the peering from remote virtual network to AzFW-VNET    |    Enter **VM-VNET-to-AzFW-VNET**.    |
    | **CONFIGURATION** | |
    | **Configure virtual network access settings** | |
    | Allow virtual network access from AzFW-VNET to remote virtual network | Leave the default **Enabled**.    |
    | Allow virtual network access from remote virtual network to AzFW-VNET    | Leave the default **Enabled**.    |
    | **Configure forwarded traffic settings** | |
    | Allow forwarded traffic from remote virtual network to AzFW-VNET    | Select **Enabled**. |
    | Allow forwarded traffic from AzFW-VNET to remote virtual network | Select **Enabled**. |
    | **Configure gateway transit settings** | |
    | Allow gateway transit | Leave unchecked |
    |||

1. Click **OK**.

1. Repeat steps 2-4 to create a virtual network peering between virtual networks **AzFW-VNET** and **PrivateEndpoint-VNET**.

## Link the virtual networks to the private DNS zone

In this section we will link virtual networks **VM-VNET** and **AzFW-VNET** to the **privatelink.database.windows.net** private DNS zone that was automatically create when we created the Private Endpoint in the previous steps in order for the VM and Firewall to be able to resolve the FQDN of the SQL Database to its Private Endpoint VNET IP address. Note that virtual network **PrivateEndpoint-VNET** was automatically linked when the Private Endpoint was created.

>[!NOTE]
>If you don't link the VM and Firewall virtual networks to the private DNS zone both the VM and Firewall will still be able to resolve the SQL Server FQDN; however they will resolve to its public IP address, defeating the purpose of Private Endpoint.

1. In the portal's search bar, enter **privatelink.database**.

1. Select **Virtual network links** under **Settings** menu and click on **Add** button.

1. In **Add virtual network link** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Link name | Enter **Link-to-VM-VNET**. |
    | **VIRTUAL NETWORK DETAILS** |  |
    | I know the resource ID of virtual network  | Leave unchecked.  |
    | Subscription | Select your subscription.    |
    | Virtual network | Select **VM-VNET**. |
    | **CONFIGURATION** | |
    | Enable auto registration | Leave unchecked.    |
    |||

1. Click **OK**.

1. Repeat steps 2-4 to create a virtual network link between **privatelink.database.windows.net** private DNS zone and virtual network **AzFW-VNET**.

## Configure an application rule with SQL FQDN in Azure Firewall

In this section we will configure an application rule to allow communication between **myVM** and the Private Endpoint for SQL Server **mypedbserver.database.windows.net** through the Firewall that we created in the previous steps.

1. In the portal's search bar, enter **Test-Fw-001**.

1. Select **Rules** under **Settings** menu.

1. Select **Application rule collection** and click on **Add application rule collection**.

1. In **Add application rule collection** enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter **SQLPrivateEndpoint**. |
    | Priority | Enter **100**. |
    | Action | Enter **Allow**. |
    | **RULES** |  |
    | **FQDN tags** | |
    | Name  | Leave blank.  |
    | Source type | Leave the default **IP address**.    |
    | Source | Leave blank. |
    | FQDN tags | Leave the default **0 selected**. |
    | **Target FQDNs** | |
    | Name | Enter **SQLPrivateEndpoint**.    |
    | Source type | Leave the default **IP address**. |
    | Source | Enter **10.1.0.0/16**. |
    | Protocol:Port | Enter **Mssql:1433**. |
    | Target FQDNs | Enter **mypedbserver.database.windows.net**. |
    |||

1. Click **Save**.

## Route traffic between the virtual machine and Private Endpoint through Azure Firewall

Because we didn't create a virtual network peering directly between virtual networks **VM-VNET** and **PrivateEndpoint-VNET**, **myVM** doesn't have a route to the Private Endpoint we created. In this section we will create a route table with a custom route to send all traffic from the subnet where **myVM** resides destined for the address space of virtual network **PrivateEndpoint-VNET** through Azure Firewall.

1. On the Azure portal menu or from the **Home** page, select **Create a resource**.

1. Type **route table** in the search box and press **Enter**.

1. Select **Route table** and then select **Create**.

1. On the **Create Route table** page, use the following table to configure the route table:

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**.  |
    | **INSTANCE DETAILS** |  |
    | Region | Select **South Central US**. |
    | Name | Enter **VMsubnet-to-AzFW**. |
    | Propagate gateway routes | Select **No**. |
    |||

1. Select **Review + create**. You're taken to the **Review + create** page where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

1. Once the deployment completes select **Go to resource**, this will take you to the route table we just created.

1. Select **Routes** from the **Settings** menu and click **Add**.

1. On the **Add route** page, use the following table to configure the route:

    | Setting | Value |
    | ------- | ----- |
    | Route name | Enter **to-privateendpoint**. |
    | Address prefix | Enter **10.2.0.0/16**.  |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.0.0.4**. |
    |||

1. Select **OK**.

1. Select **Subnets** from the **Settings** menu and click **Associate**.

1. On the **Associate subnet** page, use the following table to associate the route table with **VMSubnet**:

    | Setting | Value |
    | ------- | ----- |
    | Virtual network | Select **VM-VNET**. |
    | Subnet | Select **VMSubnet**.  |
    |||

1. Select **OK**.

## Connect to the virtual machine from your client computer

Connect to the VM **myVm** from the internet as follows:

1. In the portal's search bar, enter **myVm**.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **SSH** and copy the example command in section **4. Run the example command below to connect to your VM**.

1. If you are using a Windows 10 client machine you can run the command using PowerShell, for other Windows client versions you will need to use an SSH client like [Putty](https://www.putty.org/)

1. Enter the password you defined when creating **myVm**

## Access SQL Server privately from the VM

In this section, you will connect privately to the SQL Database using the Private Endpoint.

1. Enter `nslookup mypedbserver.database.windows.net`
    You will receive a message similar to this:

    ```bash
    Server:         127.0.0.53
    Address:        127.0.0.53#53

    Non-authoritative answer:
    mypedbserver.database.windows.net       canonical name = mypedbserver.privatelink.database.windows.net.
    Name:   mypedbserver.privatelink.database.windows.net
    Address: 10.2.0.4
    ```

1. Install [SQL Server and SQL Server command-line tools](https://docs.microsoft.com/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver15).

1. Run the following command to connect to the SQL Server. Use the server admin and password you defined when you created the SQL Server in the previous steps.

    ```bash
    sqlcmd -S mypedbserver.database.windows.net -U '<ServerAdmin>' -P '<YourPassword>'
    ```

1. Validate that [Azure Firewall logs](..\Firewall\log-analytics-samples.md) show the traffic is allowed.

1. (Optionally) [Create a new database](https://docs.microsoft.com/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver15).

1. Close the connection to **myVM** by typing `exit`.

## Clean up resources

When you're done using the Private Endpoint, SQL database, Azure Firewall and the VM, delete the resource group and all of the resources it contains:

1. Enter **myResourceGroup** in the **Search** box at the top of the portal and select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this Tutorial, you explored different scenarios that you can use to restrict traffic between a virtual machine and a Private Endpoint using Azure Firewall. You connected to the VM from the internet and securely communicated to the SQL Database through Azure Firewall using Private Link. To learn more about Private Endpoint, see [What is Azure Private Endpoint?](private-endpoint-overview.md).
