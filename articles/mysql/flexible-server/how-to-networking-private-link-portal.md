---
title: Private Link using the Azure portal - Azure Database for MySQL
description: Learn how to configure private link for Azure Database for MySQL - Flexible Server from the Azure portal
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 05/23/2023
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Create and manage Private Link for Azure Database for MySQL - Flexible Server using the portal 

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This tutorial provides step-by-step instructions on configuring a connection to a MySQL flexible server through a private endpoint and establishing a connection from a VM located within a VNet.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

### Create the virtual network

In this section, you create a Virtual Network and the subnet to host the VM used to access your Private Link resource.

1. On the upper-left side of the screen, select **Create a resource** > **Networking** > **Virtual network**.
1. In **Create virtual network**, then select this information:

    | Setting | Value |
    | --- | --- |
    | Name | Enter *MyVirtualNetwork*. |
    | Address space | Enter *10.1.0.0/16*. |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**, enter *myResourceGroup*, then select **OK**. |
    | Location | Select **West Europe**. |
    | Subnet - Name | Enter *mySubnet*. |
    | Subnet - Address range | Enter *10.1.0.0/24*. |
    | | |
1. Leave the rest as default and select **Create**.

### Create a Virtual Machine

1. On the upper-left side of the screen in the Azure portal, select **Create a resource** > **Compute** > **Virtual Machine**.

1. In **Create a virtual machine - Basics**, then select this information:

    | Setting | Value |
    | --- | --- |
    | **PROJECT DETAILS** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section. |
    | **INSTANCE DETAILS** | |
    | Virtual machine name | Enter *myVm*. |
    | Region | Select **West Europe**. |
    | Availability options | Leave the default **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter**. |
    | Size | Leave the default **Standard DS1 v2**. |
    | **ADMINISTRATOR ACCOUNT** | |
    | Username | Enter a username of your choosing. |
    | Password | Enter a password of your choosing. The password must be at least 12 characters long and meet the [defined complexity requirements](../../virtual-machines/windows/faq.yml?toc=%2fazure%2fvirtual-network%2ftoc.json#what-are-the-password-requirements-when-creating-a-vm-). |
    | Confirm Password | Reenter password. |
    | **INBOUND PORT RULES** | |
    | Public inbound ports | Leave the default **None**. |
    | **SAVE MONEY** | |
    | Already have a Windows license? | Leave the default **No**. |

1. Select **Next: Disks**.

1. In **Create a virtual machine - Disks**, leave the defaults and select **Next: Networking**.

1. In **Create a virtual machine - Networking**, select this information:

    | Setting | Value |
    | --- | --- |
    | Virtual network | Leave the default **MyVirtualNetwork**. |
    | Address space | Leave the default **10.1.0.0/24**. |
    | Subnet | Leave the default **mySubnet (10.1.0.0/24)**. |
    | Public IP | Leave the default **(new) myVm-ip**. |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Select **HTTP** and **RDP**. |

1. Select **Review + create**. You're taken to the **Review + create** page, where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

### Create an Azure Database for MySQL flexible server with a Private endpoint

- Create an [Azure Database for MySQL flexible server](quickstart-create-server-portal.md) with **Public access (allowed IP addresses) and Private endpoint** as the connectivity method.

- Select **Add Private endpoint** to create private endpoint:

    | Setting | Value |
    | --- | --- |
    | **Project details** | |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section. |
    | **Instance Details** | |
    | Name | Enter *myPrivateEndpoint*. If this name is taken, create a unique name. |
    | Location | Select **West Europe**. |
    | Virtual network | Select *MyVirtualNetwork*. |
    | Subnet | Select *mySubnet*. |
    | **PRIVATE DNS INTEGRATION** | |
    | Integrate with private DNS zone | Select **Yes**. |
    | Private DNS Zone | Select *(New)privatelink.mysql.database.Azure.com* |

- Select on **OK** to save the Private endpoint configuration.

- After entering the remaining information in the other tabs, select on **Review + create** to deploy the MySQL flexible server.

> [!NOTE]  
> In some cases, the Azure Database for MySQL flexible server and the VNet-subnet are in different subscriptions. In these cases, you must ensure the following configurations:
>
> - Make sure that both subscriptions have the **Microsoft.DBforMySQL/flexibleServer** resource provider registered. For more information refer [resource-manager-registration](../../azure-resource-manager/management/resource-providers-and-types.md).

## Manage private endpoints on MySQL - Flexible Server via the Networking tab

1. Navigate to your Azure Database for MySQL flexible server resources in the Azure portal.

1. Go to the **Networking** section under **Settings**.

1. In the **Private endpoint** section, you can manage your private endpoints (Add, Approve, Reject, or Delete).

    :::image type="content" source="media/how-to-networking-private-link-portal-mysql/networking-private-link-portal-mysql.png" alt-text="Screenshot of networking private link portal page.":::

### Connect to a VM using Remote Desktop (RDP)

After you've created **myVm**, connect to it from the internet as follows:

1. In the portal's search bar, enter *myVm*.

1. Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

1. Select **Download RDP File**. Azure creates a Remote Desktop Protocol (*.rdp*) file and downloads it to your computer.

1. Open the *downloaded.rdp* file.

    1. If prompted, select **Connect**.

    1. Enter the username and password you specified when creating the VM.

      > [!NOTE]  
      > You may need to select **More choices** > **Use a different account** to specify the credentials you entered when you created the VM.

1. Select **OK**.

1. You may receive a certificate warning during the sign-in process. Select **Yes** or **Continue** if you receive a certificate warning.

1. Once the VM desktop appears, minimize it to go back to your local desktop.

### Access the MySQL flexible server privately from the VM

1. In the Remote Desktop of *myVM*, open PowerShell.

1. Enter `nslookup  myServer.privatelink.mysql.database.azure.com`.

    You receive a message similar to this:

    ```azurepowershell
    Server: UnKnown
    Address: 168.63.129.16
    Non-authoritative answer:
    Name: myServer.privatelink.mysql.database.azure.com
    Address: 10.x.x.x
    ```

    > [!NOTE]  
    > Regardless of the firewall settings or public access being disabled, the ping and telnet tests will successfully verify network connectivity.

1. Test the private link connection for the MySQL flexible server using any available client. In the example below, I have used [MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-installing-windows.html) to do the operation.

1. In **New connection**, then select this information:

    | Setting | Value |
    | --- | --- |
    | Server type | Select **MySQL**. |
    | Server name | Select *myServer.privatelink.mysql.database.Azure.com* |
    | User name | Enter username as username@servername, provided during the MySQL flexible server creation. |
    | Password | Enter a password provided during the MySQL flexible server creation. |
    | SSL | Select **Required**. |

1. Select Connect.

1. Browse databases from the left menu.

1. (Optionally) Create or query information from the MySQL flexible server.

1. Close the remote desktop connection to *myVm*.

### Clean up resources

When you're done using the private endpoint, MySQL flexible server, and the VM, delete the resource group and all of the resources it contains:

1. Enter *myResourceGroup* in the **Search** box at the top of the portal and select *myResourceGroup* from the search results.
 
1. Select **Delete resource group**.

1. Enter myResourceGroup for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Create a private endpoint via Private Link Center

In this section, you learn how to add a private endpoint to the MySQL flexible server that you have already created.

1. In the Azure portal, select **Create a resource** > **Networking** > **Private Link**.

1. In **Private Link Center - Overview**, select the option to **Create private endpoint**.

    :::image type="content" source="media/how-to-networking-private-link-portal-mysql/networking-private-link-center portal-mysql.png" alt-text="Screenshot of private link center portal page.":::

1. In **Create a private endpoint - Basics**, then select the **Project details** information:

    | Setting | Value |
    | --- | --- |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. You created this in the previous section. |
    | **Instance Details** | |
    | Name | Enter *myPrivateEndpoint*. If this name is taken, create a unique name. |
    | Location | Select **West Europe**. |

1. Select **Next: Resource**, then select this information:

    | Setting | Value |
    | --- | --- |
    | Connection method | Select connect to an Azure resource in my directory. |
    | Subscription | Select your subscription. |
    | Resource type | Select **Microsoft.DBforMySQL/flexibleServers**. |
    | Resource | Select *myServer* |
    | Target subresource | Select *mysqlServer* |

1. Select **Next: Virtual Network**, then select the **Networking** information:

    | Setting | Value |
    | --- | --- |
    | Virtual network | Select *MyVirtualNetwork*. |
    | Subnet | Select *mySubnet*. |

1. Select **Next: DNS**, then select the **PRIVATE DNS INTEGRATION** information:

    | Setting | Value |
    | --- | --- |
    | Integrate with private DNS zone | Select **Yes**. |
    | Private DNS Zone | Select *(New)privatelink.mysql.database.Azure.com* |

  > [!NOTE]  
  > Use your service's predefined private DNS zone or provide your preferred DNS zone name. For details, refer to the [[Azure services DNS zone configuration](../../private-link/private-endpoint-dns.md).

1. Select **Review + create**. You're taken to the **Review + create** page, where Azure validates your configuration.

1. When you see the **Validation passed** message, select **Create**.

> [!NOTE]  
> The FQDN in the customer's DNS setting does not resolve the private IP configured. You must set up a DNS zone for the configured FQDN as shown [here](../../dns/dns-operations-recordsets-portal.md).

## Next steps

- Learn how to configure private link for Azure Database for MySQL flexible server from [Azure CLI](how-to-networking-private-link-azure-cli.md).
- Learn how to [manage connectivity](concepts-networking.md) to your Azure Database for MySQL flexible Server.
- Learn how to [add another layer of encryption to your Azure Database for MySQL flexible server using [Customer Managed Keys](concepts-customer-managed-key.md).
- Learn how to configure and use [Azure AD authentication](concepts-azure-ad-authentication.md) on your Azure Database for MySQL flexible server.