---
title: Virtual Network Service Endpoints and Rules
titleSuffix: Azure Synapse Analytics
description: Mark a subnet as a virtual network service endpoint, and then add the endpoint as a virtual network rule for an Azure Synapse Analytics dedicated SQL pool.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/06/2026
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: how-to
ms.custom:
  - subject-rbac-steps
---
# Use virtual network service endpoints and rules for Azure Synapse Analytics

[!INCLUDE [synapse-fabric-migration](../includes/synapse-fabric-migration.md)]

**Applies to:** Azure Synapse Analytics dedicated SQL pools

*Virtual network rules* are a firewall security feature that controls whether the [logical server](logical-servers.md) for your [dedicated SQL pool (formerly SQL DW) databases in Azure Synapse Analytics](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is) accepts communications sent from particular subnets in virtual networks. This article explains why virtual network rules are sometimes your best option for securely allowing communication to your dedicated SQL pool.

To create a virtual network rule, there must first be a [virtual network service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for the rule to reference.

## Create a virtual network rule

If you want to only create a virtual network rule, you can skip ahead to the steps and explanation [later in this article](#anchor-how-to-by-using-firewall-portal-59j).

## Details about virtual network rules

This section describes several details about virtual network rules.

### Only one geographic region

Each virtual network service endpoint applies to only one Azure region. The endpoint doesn't enable other regions to accept communication from the subnet.

Any virtual network rule is limited to the region that its underlying endpoint applies to.

### Server level, not database level

Each virtual network rule applies to your whole server, not just to one particular database on the server. In other words, virtual network rules apply at the server level, not at the database level.

### Security administration roles

There's a separation of security roles in the administration of virtual network service endpoints. Action is required from each of the following roles:

- **Network Admin ([Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role):** &nbsp;Turn on the endpoint.
- **Database Admin ([SQL Server Contributor](/azure/role-based-access-control/built-in-roles#sql-server-contributor) role):** &nbsp;Update the access control list (ACL) to add the given subnet to the server.

#### Azure RBAC alternative

The roles of Network Admin and Database Admin have more capabilities than are needed to manage virtual network rules. Only a subset of their capabilities is needed.

You have the option of using [role-based access control (RBAC)](/azure/role-based-access-control/overview) in Azure to create a single custom role that has only the necessary subset of capabilities. The custom role could be used instead of involving either the Network Admin or the Database Admin. The surface area of your security exposure is lower if you add a user to a custom role versus adding the user to the other two major administrator roles.

> [!NOTE]  
> In some cases, the dedicated SQL pool and the virtual network subnet are in different subscriptions. In these cases, you must ensure the following configurations:
>
> - The user has the required permissions to initiate operations, such as enabling service endpoints and adding a virtual network subnet to the given server.
> - Both subscriptions must have the `Microsoft.Sql` provider registered.

## Limitations

For standalone dedicated SQL pools, the virtual network rules feature has the following limitations:

- In the firewall for your logical server, each virtual network rule references a subnet. All referenced subnets must be hosted in the same geographic region as the dedicated SQL pool.
- Each server can have up to 128 ACL entries for any virtual network.
- Virtual network rules apply only to Azure Resource Manager virtual networks and not to [classic deployment model](/azure/azure-resource-manager/management/deployment-models) networks.
- On the firewall, IP address ranges do apply to the following networking items, but virtual network rules don't:
  - [Site-to-site (S2S) virtual private network (VPN)](/azure/vpn-gateway/index)
  - On-premises via [Azure ExpressRoute](/azure/expressroute/index)
- Both subscriptions must be in the same Microsoft Entra tenant.

### Considerations when you use service endpoints

When you use service endpoints for a dedicated SQL pool, review the following consideration:

- **Outbound access to Azure Synapse Analytics public IPs is required.** Network security groups (NSGs) must allow connectivity to the service IPs. You can use the `Sql` NSG [service tag](/azure/virtual-network/network-security-groups-overview#service-tags).

### ExpressRoute

If you use [ExpressRoute](/azure/expressroute/expressroute-introduction?toc=%2fazure%2fvirtual-network%2ftoc.json) from your premises, for public peering or Microsoft peering, you'll need to identify the NAT IP addresses that are used. For public peering, each ExpressRoute circuit by default uses two NAT IP addresses applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP addresses that are used are provided by either the customer or the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting. To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal. To learn more about NAT for ExpressRoute public and Microsoft peering, see [NAT requirements for Azure public peering](/azure/expressroute/expressroute-nat?toc=%2fazure%2fvirtual-network%2ftoc.json#nat-requirements-for-azure-public-peering).

To allow communication from your circuit to Azure Synapse Analytics, you must create IP network rules for the public IP addresses of your NAT.

## Impact of using virtual network service endpoints with Azure Storage

Azure Storage has implemented the same feature that allows you to limit connectivity to your Azure Storage account. If you use this feature with an Azure Storage account that Azure Synapse Analytics uses, you can run into issues. 

The following sections discuss the affected Azure Synapse Analytics features.

### Azure Synapse Analytics PolyBase and COPY statement

PolyBase and the COPY statement are commonly used to load data into Azure Synapse Analytics from Azure Storage accounts for high throughput data ingestion. If the Azure Storage account that you're loading data from limits accesses only to a set of virtual network subnets, connectivity when you use PolyBase and the COPY statement to the storage account will break. For enabling import and export scenarios by using COPY and PolyBase with Azure Synapse Analytics connecting to Azure Storage that's secured to a virtual network, follow the steps in this section.

#### Prerequisites

- Install Azure PowerShell. For more information, see [Install the Azure Az PowerShell module](/powershell/azure/install-az-ps).
- If you have a general-purpose v1 or Azure Blob Storage account, you must first upgrade to general-purpose v2 by following the steps in [Upgrade to a general-purpose v2 storage account](/azure/storage/common/storage-account-upgrade).
- You must have **Allow trusted Microsoft services to access this storage account** turned on under the Azure Storage account **Firewalls and Virtual networks** settings menu. Enabling this configuration will allow PolyBase and the COPY statement to connect to the storage account by using strong authentication where network traffic remains on the Azure backbone. For more information, see [this guide](/azure/storage/common/storage-network-security#exceptions).

> [!IMPORTANT]
> The PowerShell Azure Resource Manager (AzureRM) module was deprecated on February 29, 2024. All future development should use the Az.Sql module. Users are advised to migrate from AzureRM to the Az PowerShell module to ensure continued support and updates. The AzureRM module is no longer maintained or supported. The arguments for the commands in the Az PowerShell module and in the AzureRM modules are substantially identical. For more about their compatibility, see [Introducing the new Az PowerShell module](/powershell/azure/new-azureps-module-az).

#### Steps

1. If you have a standalone dedicated SQL pool (formerly SQL DW), register your SQL server with Microsoft Entra ID by using PowerShell:

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-SQL-servername -AssignIdentity
   ```

   This step isn't required for the dedicated SQL pools within an Azure Synapse Analytics workspace. The system assigned managed identity (SA-MI) of the workspace is a member of the Synapse Administrator role and thus has elevated privileges on the dedicated SQL pools of the workspace.

1. Create a **general-purpose v2 Storage Account** by following the steps in [Create a storage account](/azure/storage/common/storage-account-create).

    - If you have a general-purpose v1 or Blob Storage account, you must *first upgrade to v2* by following the steps in [Upgrade to a general-purpose v2 storage account](/azure/storage/common/storage-account-upgrade).
    - For known issues with Azure Data Lake Storage Gen2, see [Known issues with Azure Data Lake Storage Gen2](/azure/storage/blobs/data-lake-storage-known-issues).

1. On your storage account page, select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

    | Setting | Value |
    | --- | --- |
    | Role | Storage Blob Data Contributor |
    | Assign access to | User, group, or service principal |
    | Members | Server or workspace hosting your dedicated SQL pool that you've registered with Microsoft Entra ID |

    :::image type="content" source="~/reusable-content/ce-skilling/azure/media/role-based-access-control/add-role-assignment-page.png" alt-text="Screenshot that shows Add role assignment page in Azure portal.":::

   > [!NOTE]  
   > Only members with Owner privilege on the storage account can perform this step. For various Azure built-in roles, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

1. To enable PolyBase connectivity to the Azure Storage account:

   1. Create a database [master key](/sql/t-sql/statements/create-master-key-transact-sql) if you haven't created one earlier.

       ```sql
       CREATE MASTER KEY [ENCRYPTION BY PASSWORD = '<password>'];
       ```

   1. Create a database-scoped credential with **IDENTITY = 'Managed Service Identity'**.

       ```sql
       CREATE DATABASE SCOPED CREDENTIAL msi_cred WITH IDENTITY = 'Managed Service Identity';
       ```

       - There's no need to specify SECRET with an Azure Storage access key because this mechanism uses [Managed Identity](/azure/active-directory/managed-identities-azure-resources/overview) under the covers. This step isn't required for the dedicated SQL pools within an Azure Synapse Analytics workspace. The system assigned managed identity (SA-MI) of the workspace is a member of the Synapse Administrator role and thus has elevated privileges on the dedicated SQL pools of the workspace.

       - The IDENTITY name must be **'Managed Service Identity'** for PolyBase connectivity to work with an Azure Storage account secured to a virtual network.

   1. Create an external data source with the `abfss://` scheme for connecting to your general-purpose v2 storage account using PolyBase.

       ```SQL
       CREATE EXTERNAL DATA SOURCE ext_datasource_with_abfss WITH (TYPE = hadoop, LOCATION = 'abfss://myfile@mystorageaccount.dfs.core.windows.net', CREDENTIAL = msi_cred);
       ```

       - If you already have external tables associated with a general-purpose v1 or Blob Storage account, you should first drop those external tables. Then drop the corresponding external data source. Next, create an external data source with the `abfss://` scheme that connects to a general-purpose v2 storage account, as previously shown. Then re-create all the external tables by using this new external data source. You could use the [Generate and Publish Scripts Wizard](/sql/ssms/scripting/generate-and-publish-scripts-wizard) to generate create-scripts for all the external tables for ease.
       - For more information on the `abfss://` scheme, see [Use the Azure Data Lake Storage Gen2 URI](/azure/storage/blobs/data-lake-storage-introduction-abfs-uri).
       - For more information on the T-SQL commands, see [CREATE EXTERNAL DATA SOURCE](/sql/t-sql/statements/create-external-data-source-transact-sql).

   1. Query as normal by using [external tables](/sql/t-sql/statements/create-external-table-transact-sql).

### Azure Synapse Analytics auditing to blob storage

Azure Synapse Analytics auditing can write SQL audit logs to your own storage account. If this storage account uses the virtual network service endpoints feature, see how to [write audit to a storage account behind VNet and firewall](audit-write-storage-account-behind-vnet-firewall.md).

## Add a virtual network firewall rule to your dedicated SQL pool SQL server

Long ago, before this feature was enhanced, you were required to turn on virtual network service endpoints before you could implement a live virtual network rule in the firewall. The endpoints relate a given virtual network subnet to a dedicated SQL pool. As of January 2018, you can circumvent this requirement by setting the **IgnoreMissingVNetServiceEndpoint** flag. Now, you can add a virtual network firewall rule to your server without turning on virtual network service endpoints.

Merely setting a firewall rule doesn't help secure the server. You must also turn on virtual network service endpoints for the security to take effect. When you turn on service endpoints, your virtual network subnet experiences downtime until it completes the transition from turned off to on. This period of downtime is especially true in the context of large virtual networks. You can use the **IgnoreMissingVNetServiceEndpoint** flag to reduce or eliminate the downtime during transition.

You can set the `IgnoreMissingVNetServiceEndpoint` flag by using PowerShell. For more information, see [New-AzSqlServerVirtualNetworkRule](/powershell/module/az.sql/new-azsqlservervirtualnetworkrule).

<a id="anchor-how-to-by-using-firewall-portal-59j"></a>

## Use Azure portal to create a virtual network rule

> [!NOTE]  
> These virtual network rule instructions apply to standalone dedicated SQL pools. For workspace network configuration, see [Azure Synapse Analytics IP firewall rules](../security/synapse-workspace-ip-firewall.md).

In this section, learn how you can use the [Azure portal](https://portal.azure.com/) to create a *virtual network rule* for a standalone dedicated SQL pool. The rule tells the logical server to accept communication from a particular subnet that's been tagged as a *virtual network service endpoint*.

> [!NOTE]  
> If you intend to add a service endpoint to the virtual network firewall rules of your server, first ensure that service endpoints are turned on for the subnet.
>
> If service endpoints aren't turned on for the subnet, the portal asks you to enable them. Select the **Enable** button on the same pane on which you add the rule.

### Prerequisites

You must already have a subnet that's tagged with the virtual network service endpoint *type name* used by Azure Synapse Analytics.

- The relevant endpoint type name is `Microsoft.Sql`.
- If your subnet might not be tagged with the type name, see [Verify that the service endpoint is enabled](/azure/virtual-network/virtual-network-service-endpoints-overview#configuration).

<a id="a-portal-steps-for-vnet-rule-200"></a>

### Azure portal steps

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for and select **SQL servers**, and then select your server. Under **Security**, select **Networking**.
1. Under the **Public access** tab, ensure **Public network access** is set to **Select networks**, otherwise the **Virtual networks** settings are hidden. Select **+ Add existing virtual network** in the **Virtual networks** section.

1. In the new **Create/Update** pane, fill in the boxes with the names of your Azure resources.

    > [!TIP]  
    > You must include the correct address prefix for your subnet. You can find the **Address prefix** value in the portal. Go to **All resources** &gt; **All types** &gt; **Virtual networks**. The filter displays your virtual networks. Select your virtual network, and then select **Subnets**. The **ADDRESS RANGE** column has the address prefix you need.

1. See the resulting virtual network rule on the **Firewall** pane.

1. Set **Allow Azure services and resources to access this server** to **No**.

    > [!IMPORTANT]  
    > If you leave **Allow Azure services and resources to access this server** checked, your server accepts communication from any subnet inside the Azure boundary. That is communication that originates from one of the IP addresses that's recognized as those within ranges defined for Azure datacenters. Leaving the control enabled might be excessive access from a security point of view. The Microsoft Azure Virtual Network service endpoint feature, together with Azure Synapse Analytics virtual network rules, can reduce your security surface area.

1. Select the **OK** button near the bottom of the pane.

> [!NOTE]  
> The following statuses or states apply to the rules:
>
> - **Ready**: Indicates that the operation you initiated has succeeded.
> - **Failed**: Indicates that the operation you initiated has failed.
> - **Deleted**: Only applies to the `Delete` operation and indicates that the rule has been deleted and no longer applies.
> - **InProgress**: Indicates that the operation is in progress. The old rule applies while the operation is in this state.

## Use PowerShell to create a virtual network rule

A script can also create virtual network rules by using the PowerShell cmdlet `New-AzSqlServerVirtualNetworkRule` or [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). For more information, see [New-AzSqlServerVirtualNetworkRule](/powershell/module/az.sql/new-azsqlservervirtualnetworkrule).

## Use REST API to create a virtual network rule

Internally, the PowerShell cmdlets for Synapse SQL virtual network actions call REST APIs. You can call the REST APIs directly. For more information, see [Virtual network rules: Operations](/rest/api/sql/virtual-network-rules).

<a id="errors-40914-and-40615"></a>

## Troubleshoot errors 40914 and 40615

Connection error 40914 relates to *virtual network rules*, as specified on the **Firewall** pane in the Azure portal.  
Error 40615 is similar, except it relates to *IP address rules* on the firewall.

### Error 40914

**Message text:** "Cannot open server '*[server-name]*' requested by the login. Client is not allowed to access the server."

**Error description:** The client is in a subnet that has virtual network server endpoints. But the server has no virtual network rule that grants to the subnet the right to communicate with the database.

**Error resolution:** On the **Firewall** pane of the Azure portal, use the virtual network rules control to [add a virtual network rule](#anchor-how-to-by-using-firewall-portal-59j) for the subnet.

### Error 40615

**Message text:** "Cannot open server '{0}' requested by the login. Client with IP address '{1}' is not allowed to access the server."

**Error description:** The client is trying to connect from an IP address that isn't authorized to connect to the server. The server firewall has no IP address rule that allows a client to communicate from the given IP address to the database.

**Error resolution:** Enter the client's IP address as an IP rule. Use the **Firewall** pane in the Azure portal to do this step.

## Related content

- [Azure virtual network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview)
- [Azure Synapse IP firewall rules](firewall-configure.md)
- [Use `New-AzSqlServerVirtualNetworkRule` to create a virtual network rule](/powershell/module/az.sql/new-azsqlservervirtualnetworkrule)
- [Virtual network rules: Operations](/rest/api/sql/virtual-network-rules)
