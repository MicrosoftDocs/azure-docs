---
title: 'Tutorial: Connect to an Azure SQL server using an Azure Private Endpoint - Azure portal'
description: Get started with this tutorial to learn how to connect to a storage account privately via Azure Private Endpoint using the Azure portal.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: tutorial
ms.date: 08/30/2023
ms.author: allensu
ms.custom: template-tutorial, fasttrack-edit, template-tutorial
# Customer intent: As someone with a basic network background, but is new to Azure, I want to create a private endpoint on a SQL server so that I can securely connect to it.
---

# Tutorial: Connect to an Azure SQL server using an Azure Private Endpoint using the Azure portal

Azure Private endpoint is the fundamental building block for Private Link in Azure. It enables Azure resources, like virtual machines (VMs), to privately and securely communicate with Private Link resources such as Azure SQL server.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host.
> * Create a virtual machine.
> * Create an Azure SQL server and private endpoint.
> * Test connectivity to the SQL server private endpoint.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* An Azure subscription

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [create-test-virtual-machine-linux.md](../../includes/create-test-virtual-machine-linux.md)]

## <a name ="create-a-private-endpoint"></a>Create an Azure SQL server and private endpoint

In this section, you create a SQL server in Azure. 

1. In the search box at the top of the portal, enter **SQL**. Select **SQL databases** in the search results.

1. In **SQL databases**, select **+ Create**.

1. In the **Basics** tab of **Create SQL Database**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Database details** |  |
    | Database name | Enter **sql-db**. |
    | Server | Select **Create new**. </br> Enter **sql-server-1** in **Server name** (Server names must be unique, replace **sql-server-1** with a unique value). </br> Select **(US) East US 2** in **Location**. </br> Select **Use SQL authentication**. </br> Enter a server admin sign-in and password. </br> Select **OK**. |
    | Want to use SQL elastic pool? | Select **No**. |
    | Workload environment | Leave the default of **Production**. |
    | **Backup storage redundancy** |  |
    | Backup storage redundancy | Select **Locally redundant backup storage**. |

1. Select **Next: Networking**.

1. In the **Networking** tab of **Create SQL Database**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Network connectivity** |  |
    | Connectivity method | Select **Private endpoint**. |
    | **Private endpoints** |  |
    | Select **+Add private endpoint**. |   |
    | **Create private endpoint** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | Location | Select **East US 2**. |
    | Name | Enter **private-endpoint-sql**. |
    | Target subresource | Select **SqlServer**. |
    | **Networking** |  |
    | Virtual network | Select **vnet-1**. |
    | Subnet | Select **subnet-1**. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Select **Yes**. |
    | Private DNS zone | Leave the default of **privatelink.database.windows.net**. |

1. Select **OK**.

1. Select **Review + create**.

1. Select **Create**.

> [!IMPORTANT]
> When adding a Private endpoint connection, public routing to your Azure SQL server is not blocked by default. The setting "Deny public network access" under the "Firewall and virtual networks" blade is left unchecked by default. To disable public network access ensure this is checked.
 
## Disable public access to Azure SQL logical server

For this scenario, assume you would like to disable all public access to your Azure SQL server, and only allow connections from your virtual network.
 
1. In the search box at the top of the portal, enter **SQL server**. Select **SQL servers** in the search results.

1. Select **sql-server-1**.

1. On the **Networking** page, select **Public access** tab, then select **Disable** for **Public network access**.
    
1. Select **Save**.

## Test connectivity to private endpoint

In this section, you use the virtual machine you created in the previous steps to connect to the SQL server across the private endpoint.

1. In the search box at the top of the portal, enter **Virtual machine**. Select **Virtual machines** in the search results.

1. Select **vm-1**.

1. In **Operations** select **Bastion**.

1. Enter the username and password for the virtual machine.

1. Select **Connect**.

1. To verify name resolution of the private endpoint, enter the following command in the terminal window:

    ```bash
    nslookup sql-server-1.database.windows.net
    ```

    You receive a message similar to the following example. The IP address returned is the private IP address of the private endpoint.

    ```output
    Server:    127.0.0.53
    Address:   127.0.0.53#53

    Non-authoritative answer:
    sql-server-8675.database.windows.netcanonical name = sql-server-8675.privatelink.database.windows.net.
    Name:sql-server-8675.privatelink.database.windows.net
    Address: 10.1.0.4
    ```

1. Install the SQL server command line tools from [Install the SQL Server command-line tools sqlcmd and bcp on Linux](/sql/linux/sql-server-linux-setup-tools). Proceed with the next steps after the installation is complete.

1. Use the following commands to connect to the SQL server you created in the previous steps.

    * Replace **\<server-admin>** with the admin username you entered during the SQL server creation.

    * Replace **\<admin-password>** with the admin password you entered during SQL server creation.

    * Replace **sql-server-1** with the name of your SQL server.

    ```bash
    sqlcmd -S sql-server-1.database.windows.net -U '<server-admin>' -P '<admin-password>'
    ```

1. A SQL command prompt is displayed on successful sign in. Enter **exit** to exit the **sqlcmd** tool.


[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

In this tutorial, you learned how to create:

* Virtual network and bastion host.

* Virtual machine.

* Azure SQL server with private endpoint.

You used the virtual machine to test connectivity privately and securely to the SQL server across the private endpoint.

As a next step, you may also be interested in the **Web app with private connectivity to Azure SQL Database** architecture scenario, which connects a web application outside of the virtual network to the private endpoint of a database.
> [!div class="nextstepaction"]
> [Web app with private connectivity to Azure SQL Database](/azure/architecture/example-scenario/private-web-app/private-web-app)
