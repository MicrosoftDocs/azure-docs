---
title: 'Tutorial: Inspect private endpoint traffic with Azure Firewall'
description: Learn how to inspect private endpoint traffic with Azure Firewall.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.custom: mvc
ms.date: 10/13/2023

---
# Tutorial: Inspect private endpoint traffic with Azure Firewall

Azure Private Endpoint is the fundamental building block for Azure Private Link. Private endpoints enable Azure resources deployed in a virtual network to communicate privately with private link resources.

Private endpoints allow resources access to the private link service deployed in a virtual network. Access to the private endpoint through virtual network peering and on-premises network connections extend the connectivity.

You may need to inspect or block traffic from clients to the services exposed via private endpoints. Complete this inspection by using [Azure Firewall](../firewall/overview.md) or a third-party network virtual appliance.

For more information and scenarios that involve private endpoints and Azure Firewall, see [Azure Firewall scenarios to inspect traffic destined to a private endpoint](inspect-traffic-with-azure-firewall.md).

:::image type="content" source="./media/tutorial-inspect-traffic-azure-firewall/resources-diagram.png" alt-text="Diagram of Azure resources created in tutorial." lightbox="./media/tutorial-inspect-traffic-azure-firewall/resources-diagram.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host for the test virtual machine.
> * Create the private endpoint virtual network.
> * Create a test virtual machine.
> * Deploy Azure Firewall.
> * Create an Azure SQL database.
> * Create a private endpoint for Azure SQL.
> * Create a network peer between the private endpoint virtual network and the test virtual machine virtual network.
> * Link the virtual networks to a private DNS zone.
> * Configure application rules in Azure Firewall for Azure SQL.
> * Route traffic between the test virtual machine and Azure SQL through Azure Firewall.
> * Test the connection to Azure SQL and validate in Azure Firewall logs.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- An Azure account with an active subscription.

- A Log Analytics workspace. For more information about the creation of a log analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

[!INCLUDE [virtual-network-create-with-bastion.md](../../includes/virtual-network-create-with-bastion.md)]

[!INCLUDE [virtual-network-create-private-endpoint.md](../../includes/virtual-network-create-private-endpoint.md)]

[!INCLUDE [create-test-virtual-machine-linux.md](../../includes/create-test-virtual-machine-linux.md)]

## Deploy Azure Firewall

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

1. In **Firewalls**, select **+ Create**.

1. Enter or select the following information in the **Basics** tab of **Create a firewall**:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Name | Enter **firewall**. |
    | Region | Select **East US 2**. |
    | Availability zone | Select **None**. |
    | Firewall SKU | Select **Standard**. |
    | Firewall management | Select **Use a Firewall Policy to manage this firewall**. |
    | Firewall policy | Select **Add new**. </br> Enter **firewall-policy** in **Policy name**. </br> Select **East US 2** in region. </br> Select **OK**. |
    | Choose a virtual network | Select **Create new**. |
    | Virtual network name | Enter **vnet-firewall**. |
    | Address space | Enter **10.2.0.0/16**. |
    | Subnet address space | Enter **10.2.1.0/26**. |
    | Public IP address | Select **Add new**. </br> Enter **public-ip-firewall** in **Name**. </br> Select **OK**. |

1. Select **Review + create**.

1. Select **Create**.

Wait for the firewall deployment to complete before you continue.

## Enable firewall logs

In this section, you enable the firewall logs and send them to the log analytics workspace.

> [!NOTE]
> You must have a log analytics workspace in your subscription before you can enable firewall logs. For more information, see [Prerequisites](#prerequisites).

1. In the search box at the top of the portal, enter **Firewall**. Select **Firewalls** in the search results.

1. Select **firewall**.

1. In **Monitoring** select **Diagnostic settings**.

1. Select **+ Add diagnostic setting**.

1. In **Diagnostic setting** enter or select the following information:

    | Setting | Value |
    |---|---|
    | Diagnostic setting name | Enter **diagnostic-setting-firewall**. |
    | **Logs** |  |
    | Categories | Select **Azure Firewall Application Rule (Legacy Azure Diagnostics)** and **Azure Firewall Network Rule (Legacy Azure Diagnostics)**. |
    | **Destination details** |  |
    | Destination | Select **Send to Log Analytics workspace**. |
    | Subscription | Select your subscription. |
    | Log Analytics workspace | Select your log analytics workspace. |

1. Select **Save**.

## Create an Azure SQL database

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
    | Virtual network | Select **vnet-private-endpoint**. |
    | Subnet | Select **subnet-private-endpoint**. |
    | **Private DNS integration** |  |
    | Integrate with private DNS zone | Select **Yes**. |
    | Private DNS zone | Leave the default of **privatelink.database.windows.net**. |

1. Select **OK**.

1. Select **Review + create**.

1. Select **Create**.

## Connect virtual networks with virtual network peering

In this section, you connect the virtual networks with virtual network peering. The networks **vnet-1** and **vnet-private-endpoint** are connected to **vnet-firewall**. There isn't direct connectivity between **vnet-1** and **vnet-private-endpoint**.

1. In the search box at the top of the portal, enter **Virtual networks**. Select **Virtual networks** in the search results.

1. Select **vnet-firewall**.

1. In **Settings** select **Peerings**.

1. In **Peerings** select **+ Add**.

1. In **Add peering**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **This virtual network** |  |
    | Peering link name | Enter **vnet-firewall-to-vnet-1**. |
    | Traffic to remote virtual network | Select **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Select **Allow (default)**. |
    | Virtual network gateway or Route Server | Select **None (default)**. |
    | **Remote virtual network** |  |
    | Peering link name | Enter **vnet-1-to-vnet-firewall**. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-1**. |
    | Traffic to remote virtual network | Select **Allow (default)**. |
    | Traffic forwarded from remote virtual network | Select **Allow (default)**. |
    | Virtual network gateway or Route Server | Select **None (default)**. |

1. Select **Add**.

1. In **Peerings** select **+ Add**.

1. In **Add peering**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **This virtual network** |  |
    | Peering link name | Enter **vnet-firewall-to-vnet-private-endpoint**. |
    | Allow 'vnet-1' to access 'vnet-private-endpoint' | Leave the default of selected.  |
    | Allow 'vnet-1' to receive forwarded traffic from 'vnet-private-endpoint' | Select the checkbox. |
    | Allow gateway in 'vnet-1' to forward traffic to 'vnet-private-endpoint' | Leave the default of cleared. |
    | Enable 'vnet-1' to use 'vnet-private-endpoint' remote gateway | Leave the default of cleared. |
    | **Remote virtual network** |  |
    | Peering link name | Enter **vnet-private-endpoint-to-vnet-firewall**. |
    | Virtual network deployment model | Select **Resource manager**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-private-endpoint**. |
    | Allow 'vnet-private-endpoint' to access 'vnet-1' | Leave the default of selected.  |
    | Allow 'vnet-private-endpoint' to receive forwarded traffic from 'vnet-1' | Select the checkbox. |
    | Allow gateway in 'vnet-private-endpoint' to forward traffic to 'vnet-1' | Leave the default of cleared. |
    | Enable 'vnet-private-endpoint' to use 'vnet-1's' remote gateway | Leave the default of cleared. |

1. Select **Add**.

1. Verify the **Peering status** displays **Connected** for both network peers.

## Link the virtual networks to the private DNS zone

The private DNS zone created during the private endpoint creation in the previous section must be linked to the **vnet-1** and **vnet-firewall** virtual networks.

1. In the search box at the top of the portal, enter **Private DNS zone**. Select **Private DNS zones** in the search results.

1. Select **privatelink.database.windows.net**.

1. In **Settings** select **Virtual network links**.

1. Select **+ Add**.

1. In **Add virtual network link**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Virtual network link** |  |
    | Virtual network link name | Enter **link-to-vnet-1**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-1 (test-rg)**. |
    | Configuration | Leave the default of unchecked for **Enable auto registration**. |

1. Select **OK**.

1. Select **+ Add**.

1. In **Add virtual network link**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Virtual network link** |  |
    | Virtual network link name | Enter **link-to-vnet-firewall**. |
    | Subscription | Select your subscription. |
    | Virtual network | Select **vnet-firewall (test-rg)**. |
    | Configuration | Leave the default of unchecked for **Enable auto registration**. |

1. Select **OK**.

## Create route between vnet-1 and vnet-private-endpoint

A network link between **vnet-1** and **vnet-private-endpoint** doesn't exist. You must create a route to allow traffic to flow between the virtual networks through Azure Firewall.

The route sends traffic from **vnet-1** to the address space of virtual network **vnet-private-endpoint**, through the Azure Firewall.

1. In the search box at the top of the portal, enter **Route tables**. Select **Route tables** in the search results.

1. Select **+ Create**.

1. In the **Basics** tab of **Create Route table**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **test-rg**. |
    | **Instance details** |  |
    | Region | Select **East US 2**. |
    | Name | Enter **vnet-1-to-vnet-firewall**. |
    | Propagate gateway routes | Leave the default of **Yes**. |

1. Select **Review + create**.

1. Select **Create**.

1. In the search box at the top of the portal, enter **Route tables**. Select **Route tables** in the search results.

1. Select **vnet-1-to-vnet-firewall**.

1. In **Settings** select **Routes**.

1. Select **+ Add**.

1. In **Add route**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Route name | Enter **subnet-1-to-subnet-private-endpoint**. |
    | Destination type | Select **IP Addresses**. |
    | Destination IP addresses/CIDR ranges | Enter **10.1.0.0/16**. |
    | Next hop type | Select **Virtual appliance**. |
    | Next hop address | Enter **10.2.1.4**. |

1. Select **Add**.

1. In **Settings**, select **Subnets**.

1. Select **+ Associate**.

1. In **Associate subnet**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Virtual network | Select **vnet-1(test-rg)**. |
    | Subnet | Select **subnet-1**. |

1. Select **OK**.

## Configure an application rule in Azure Firewall

Create an application rule to allow communication from **vnet-1** to the private endpoint of the Azure SQL server **sql-server-1.database.windows.net**. Replace **sql-server-1** with the name of your Azure SQL server.
  
1. In the search box at the top of the portal, enter **Firewall**. Select **Firewall Policies** in the search results.

1. In **Firewall Policies**, select **firewall-policy**.

1. In **Settings** select **Application rules**.

1. Select **+ Add a rule collection**.

1. In **Add a rule collection**, enter or select the following information:

    | Setting | Value |
    |---|---|
    | Name | Enter **rule-collection-sql**. |
    | Rule collection type | Leave the selection of **Application**. |
    | Priority | Enter **100**. |
    | Rule collection action | Select **Allow**. |
    | Rule collection group | Leave the default of **DefaultApplicationRuleCollectionGroup**. |
    | **Rules** |  |
    | **Rule 1** |  |
    | Name | Enter **SQLPrivateEndpoint**. |
    | Source type | Select **IP Address**. |
    | Source | Enter **10.0.0.0/16** |
    | Protocol | Enter **mssql:1433** |
    | Destination type | Select **FQDN**. |
    | Destination | Enter **sql-server-1.database.windows.net**. |

1. Select **Add**.

## Test connection to Azure SQL from virtual machine

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

## Validate traffic in the Azure Firewall logs

1. In the search box at the top of the portal, enter **Log Analytics**. Select **Log Analytics** in the search results.

1. Select your log analytics workspace. In this example, the workspace is named **log-analytics-workspace**.

1. In the General settings, select **Logs**.

1. In the example **Queries** in the search box, enter **Application rule**. In the returned results in **Network**, select the **Run** button for **Application rule log data**.

1. In the log query output, verify **sql-server-1.database.windows.net** is listed under **FQDN** and **SQLPrivateEndpoint** is listed under **Rule**.

[!INCLUDE [portal-clean-up.md](../../includes/portal-clean-up.md)]

## Next steps

Advance to the next article to learn how to use a private endpoint with Azure Private Resolver:
> [!div class="nextstepaction"]
> [Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload](tutorial-dns-on-premises-private-resolver.md)
