---
title: Virtual network endpoints and rules for databases in Azure SQL Database
description: "Mark a subnet as a virtual network service endpoint. Then add the endpoint as a virtual network rule to the ACL for your database. Your database then accepts communication from all virtual machines and other nodes on the subnet."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: rohitnayakmsft
ms.author: rohitna
ms.reviewer: vanto, genemi
ms.date: 11/14/2019
---
# Use virtual network service endpoints and rules for servers in Azure SQL Database

[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]

*Virtual network rules* are a firewall security feature that controls whether the server for your databases and elastic pools in [Azure SQL Database](sql-database-paas-overview.md) or for your dedicated SQL pool (formerly SQL DW) databases in [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) accepts communications that are sent from particular subnets in virtual networks. This article explains why virtual network rules are sometimes your best option for securely allowing communication to your database in SQL Database and Azure Synapse Analytics.

> [!NOTE]
> This article applies to both SQL Database and Azure Synapse Analytics. For simplicity, the term *database* refers to both databases in SQL Database and Azure Synapse Analytics. Likewise, any references to *server* refer to the [logical SQL server](logical-servers.md) that hosts SQL Database and Azure Synapse Analytics.

To create a virtual network rule, there must first be a [virtual network service endpoint][vm-virtual-network-service-endpoints-overview-649d] for the rule to reference.

## Create a virtual network rule

If you want to only create a virtual network rule, you can skip ahead to the steps and explanation [later in this article](#anchor-how-to-by-using-firewall-portal-59j).

## Details about virtual network rules

This section describes several details about virtual network rules.

### Only one geographic region

Each virtual network service endpoint applies to only one Azure region. The endpoint doesn't enable other regions to accept communication from the subnet.

Any virtual network rule is limited to the region that its underlying endpoint applies to.

### Server level, not database level

Each virtual network rule applies to your whole server, not just to one particular database on the server. In other words, virtual network rules apply at the server level, not at the database level.

In contrast, IP rules can apply at either level.

### Security administration roles

There's a separation of security roles in the administration of virtual network service endpoints. Action is required from each of the following roles:

- **Network Admin ([Network Contributor](../../role-based-access-control/built-in-roles.md#network-contributor) role):** &nbsp;Turn on the endpoint.
- **Database Admin ([SQL Server Contributor](../../role-based-access-control/built-in-roles.md#sql-server-contributor) role):** &nbsp;Update the access control list (ACL) to add the given subnet to the server.

#### Azure RBAC alternative

The roles of Network Admin and Database Admin have more capabilities than are needed to manage virtual network rules. Only a subset of their capabilities is needed.

You have the option of using [role-based access control (RBAC)][rbac-what-is-813s] in Azure to create a single custom role that has only the necessary subset of capabilities. The custom role could be used instead of involving either the Network Admin or the Database Admin. The surface area of your security exposure is lower if you add a user to a custom role versus adding the user to the other two major administrator roles.

> [!NOTE]
> In some cases, the database in SQL Database and the virtual network subnet are in different subscriptions. In these cases, you must ensure the following configurations:
>
> - Both subscriptions must be in the same Azure Active Directory (Azure AD) tenant.
> - The user has the required permissions to initiate operations, such as enabling service endpoints and adding a virtual network subnet to the given server.
> - Both subscriptions must have the Microsoft.Sql provider registered.

## Limitations

For SQL Database, the virtual network rules feature has the following limitations:

- In the firewall for your database in SQL Database, each virtual network rule references a subnet. All these referenced subnets must be hosted in the same geographic region that hosts the database.
- Each server can have up to 128 ACL entries for any virtual network.
- Virtual network rules apply only to Azure Resource Manager virtual networks and not to [classic deployment model][arm-deployment-model-568f] networks.
- Turning on virtual network service endpoints to SQL Database also enables the endpoints for Azure Database for MySQL and Azure Database for PostgreSQL. With endpoints set to **ON**, attempts to connect from the endpoints to your Azure Database for MySQL or Azure Database for PostgreSQL instances might fail.
  - The underlying reason is that Azure Database for MySQL and Azure Database for PostgreSQL likely don't have a virtual network rule configured. You must configure a virtual network rule for Azure Database for MySQL and Azure Database for PostgreSQL, and the connection will succeed.
  - To define virtual network firewall rules on a SQL logical server that's already configured with private endpoints, set **Deny public network access** to **No**.
- On the firewall, IP address ranges do apply to the following networking items, but virtual network rules don't:
  - [Site-to-site (S2S) virtual private network (VPN)][vpn-gateway-indexmd-608y]
  - On-premises via [Azure ExpressRoute](../../expressroute/index.yml)

### Considerations when you use service endpoints

When you use service endpoints for SQL Database, review the following considerations:

- **Outbound to Azure SQL Database public IPs is required.** Network security groups (NSGs) must be opened to SQL Database IPs to allow connectivity. You can do this by using NSG [service tags](../../virtual-network/network-security-groups-overview.md#service-tags) for SQL Database.

### ExpressRoute

If you use [ExpressRoute](../../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json) from your premises, for public peering or Microsoft peering, you'll need to identify the NAT IP addresses that are used. For public peering, each ExpressRoute circuit by default uses two NAT IP addresses applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP addresses that are used are provided by either the customer or the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting. To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal. To learn more about NAT for ExpressRoute public and Microsoft peering, see [NAT requirements for Azure public peering](../../expressroute/expressroute-nat.md?toc=%2fazure%2fvirtual-network%2ftoc.json#nat-requirements-for-azure-public-peering).

To allow communication from your circuit to SQL Database, you must create IP network rules for the public IP addresses of your NAT.

<!--
FYI: Re ARM, 'Azure Service Management (ASM)' was the old name of 'classic deployment model'.
When searching for blogs about ASM, you probably need to use this old and now-forbidden name.
-->

## Impact of using virtual network service endpoints with Azure Storage

Azure Storage has implemented the same feature that allows you to limit connectivity to your Azure Storage account. If you choose to use this feature with an Azure Storage account that SQL Database is using, you can run into issues. Next is a list and discussion of SQL Database and Azure Synapse Analytics features that are affected by this.

### Azure Synapse Analytics PolyBase and COPY statement

PolyBase and the COPY statement are commonly used to load data into Azure Synapse Analytics from Azure Storage accounts for high throughput data ingestion. If the Azure Storage account that you're loading data from limits accesses only to a set of virtual network subnets, connectivity when you use PolyBase and the COPY statement to the storage account will break. For enabling import and export scenarios by using COPY and PolyBase with Azure Synapse Analytics connecting to Azure Storage that's secured to a virtual network, follow the steps in this section.

#### Prerequisites

- Install Azure PowerShell by using [this guide](/powershell/azure/install-az-ps).
- If you have a general-purpose v1 or Azure Blob Storage account, you must first upgrade to general-purpose v2 by following the steps in [Upgrade to a general-purpose v2 storage account](../../storage/common/storage-account-upgrade.md).
- You must have **Allow trusted Microsoft services to access this storage account** turned on under the Azure Storage account **Firewalls and Virtual networks** settings menu. Enabling this configuration will allow PolyBase and the COPY statement to connect to the storage account by using strong authentication where network traffic remains on the Azure backbone. For more information, see [this guide](../../storage/common/storage-network-security.md#exceptions).

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by SQL Database, but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020. The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).

#### Steps

1. If you have a standalone dedicated SQL pool, register your SQL server with Azure AD by using PowerShell:

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-SQL-servername -AssignIdentity
   ```

   This step isn't required for dedicated SQL pools within an Azure Synapse Analytics workspace.

1. If you have an Azure Synapse Analytics workspace, register your workspace's system-managed identity:

   1. Go to your Azure Synapse Analytics workspace in the Azure portal.
   2. Go to the **Managed identities** pane.
   3. Make sure the **Allow Pipelines** option is enabled.
   
1. Create a **general-purpose v2 Storage Account** by following the steps in [Create a storage account](../../storage/common/storage-account-create.md).

   > [!NOTE]
   >
   > - If you have a general-purpose v1 or Blob Storage account, you must *first upgrade to v2* by following the steps in [Upgrade to a general-purpose v2 storage account](../../storage/common/storage-account-upgrade.md).
   > - For known issues with Azure Data Lake Storage Gen2, see [Known issues with Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-known-issues.md).

1. Under your storage account, go to **Access Control (IAM)**, and select **Add role assignment**. Assign the **Storage Blob Data Contributor** Azure role to the server or workspace hosting your dedicated SQL pool, which you've registered with Azure AD.

   > [!NOTE]
   > Only members with Owner privilege on the storage account can perform this step. For various Azure built-in roles, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).
  
1. To enable PolyBase connectivity to the Azure Storage account:

   1. Create a database [master key](/sql/t-sql/statements/create-master-key-transact-sql) if you haven't created one earlier.

       ```sql
       CREATE MASTER KEY [ENCRYPTION BY PASSWORD = 'somepassword'];
       ```

   1. Create a database-scoped credential with **IDENTITY = 'Managed Service Identity'**.

       ```sql
       CREATE DATABASE SCOPED CREDENTIAL msi_cred WITH IDENTITY = 'Managed Service Identity';
       ```

       > [!NOTE]
       >
       > - There's no need to specify SECRET with an Azure Storage access key because this mechanism uses [Managed Identity](../../active-directory/managed-identities-azure-resources/overview.md) under the covers.
       > - The IDENTITY name should be **'Managed Service Identity'** for PolyBase connectivity to work with an Azure Storage account secured to a virtual network.

   1. Create an external data source with the `abfss://` scheme for connecting to your general-purpose v2 storage account using PolyBase.

       ```SQL
       CREATE EXTERNAL DATA SOURCE ext_datasource_with_abfss WITH (TYPE = hadoop, LOCATION = 'abfss://myfile@mystorageaccount.dfs.core.windows.net', CREDENTIAL = msi_cred);
       ```

       > [!NOTE]
       >
       > - If you already have external tables associated with a general-purpose v1 or Blob Storage account, you should first drop those external tables. Then drop the corresponding external data source. Next, create an external data source with the `abfss://` scheme that connects to a general-purpose v2 storage account, as previously shown. Then re-create all the external tables by using this new external data source. You could use the [Generate and Publish Scripts Wizard](/sql/ssms/scripting/generate-and-publish-scripts-wizard) to generate create-scripts for all the external tables for ease.
       > - For more information on the `abfss://` scheme, see [Use the Azure Data Lake Storage Gen2 URI](../../storage/blobs/data-lake-storage-introduction-abfs-uri.md).
       > - For more information on CREATE EXTERNAL DATA SOURCE, see [this guide](/sql/t-sql/statements/create-external-data-source-transact-sql).

   1. Query as normal by using [external tables](/sql/t-sql/statements/create-external-table-transact-sql).

### SQL Database blob auditing

Blob auditing pushes audit logs to your own storage account. If this storage account uses the virtual network service endpoints feature, connectivity from SQL Database to the storage account will break.

## Add a virtual network firewall rule to your server

Long ago, before this feature was enhanced, you were required to turn on virtual network service endpoints before you could implement a live virtual network rule in the firewall. The endpoints related a given virtual network subnet to a database in SQL Database. As of January 2018, you can circumvent this requirement by setting the **IgnoreMissingVNetServiceEndpoint** flag. Now, you can add a virtual network firewall rule to your server without turning on virtual network service endpoints.

Merely setting a firewall rule doesn't help secure the server. You must also turn on virtual network service endpoints for the security to take effect. When you turn on service endpoints, your virtual network subnet experiences downtime until it completes the transition from turned off to on. This period of downtime is especially true in the context of large virtual networks. You can use the **IgnoreMissingVNetServiceEndpoint** flag to reduce or eliminate the downtime during transition.

You can set the **IgnoreMissingVNetServiceEndpoint** flag by using PowerShell. For more information, see [PowerShell to create a virtual network service endpoint and rule for SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d].

## Errors 40914 and 40615

Connection error 40914 relates to *virtual network rules*, as specified on the **Firewall** pane in the Azure portal. Error 40615 is similar, except it relates to *IP address rules* on the firewall.

### Error 40914

**Message text:** "Cannot open server '*[server-name]*' requested by the login. Client is not allowed to access the server."

**Error description:** The client is in a subnet that has virtual network server endpoints. But the server has no virtual network rule that grants to the subnet the right to communicate with the database.

**Error resolution:** On the **Firewall** pane of the Azure portal, use the virtual network rules control to [add a virtual network rule](#anchor-how-to-by-using-firewall-portal-59j) for the subnet.

### Error 40615

**Message text:** "Cannot open server '{0}' requested by the login. Client with IP address '{1}' is not allowed to access the server."

**Error description:** The client is trying to connect from an IP address that isn't authorized to connect to the server. The server firewall has no IP address rule that allows a client to communicate from the given IP address to the database.

**Error resolution:** Enter the client's IP address as an IP rule. Use the **Firewall** pane in the Azure portal to do this step.

<a name="anchor-how-to-by-using-firewall-portal-59j"></a>

## Use the portal to create a virtual network rule

This section illustrates how you can use the [Azure portal][http-azure-portal-link-ref-477t] to create a *virtual network rule* in your database in SQL Database. The rule tells your database to accept communication from a particular subnet that's been tagged as being a *virtual network service endpoint*.

> [!NOTE]
> If you intend to add a service endpoint to the virtual network firewall rules of your server, first ensure that service endpoints are turned on for the subnet.
>
> If service endpoints aren't turned on for the subnet, the portal asks you to enable them. Select the **Enable** button on the same pane on which you add the rule.

## PowerShell alternative

A script can also create virtual network rules by using the PowerShell cmdlet **New-AzSqlServerVirtualNetworkRule** or [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). If you're interested, see [PowerShell to create a virtual network service endpoint and rule for SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d].

## REST API alternative

Internally, the PowerShell cmdlets for SQL virtual network actions call REST APIs. You can call the REST APIs directly.

- [Virtual network rules: Operations][rest-api-virtual-network-rules-operations-862r]

## Prerequisites

You must already have a subnet that's tagged with the particular virtual network service endpoint *type name* relevant to SQL Database.

- The relevant endpoint type name is **Microsoft.Sql**.
- If your subnet might not be tagged with the type name, see [Verify your subnet is an endpoint][sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100].

<a name="a-portal-steps-for-vnet-rule-200"></a>

## Azure portal steps

1. Sign in to the [Azure portal][http-azure-portal-link-ref-477t].

1. Search for and select **SQL servers**, and then select your server. Under **Security**, select **Firewalls and virtual networks**.

1. Set **Allow access to Azure services** to **OFF**.

    > [!IMPORTANT]
    > If you leave the control set to **ON**, your server accepts communication from any subnet inside the Azure boundary. That is communication that originates from one of the IP addresses that's recognized as those within ranges defined for Azure datacenters. Leaving the control set to **ON** might be excessive access from a security point of view. The Microsoft Azure Virtual Network service endpoint feature in coordination with the virtual network rules feature of SQL Database together can reduce your security surface area.

1. Select **+ Add existing** in the **Virtual networks** section.

    ![Screenshot that shows selecting + Add existing (subnet endpoint, as a SQL rule).][image-portal-firewall-vnet-add-existing-10-png]

1. In the new **Create/Update** pane, fill in the boxes with the names of your Azure resources.

    > [!TIP]
    > You must include the correct address prefix for your subnet. You can find the **Address prefix** value in the portal. Go to **All resources** &gt; **All types** &gt; **Virtual networks**. The filter displays your virtual networks. Select your virtual network, and then select **Subnets**. The **ADDRESS RANGE** column has the address prefix you need.

    ![Screenshot that shows filling in boxes for the new rule.][image-portal-firewall-create-update-vnet-rule-20-png]

1. Select the **OK** button near the bottom of the pane.

1. See the resulting virtual network rule on the **Firewall** pane.

    ![Screenshot that shows the new rule on the Firewall pane.][image-portal-firewall-vnet-result-rule-30-png]

> [!NOTE]
> The following statuses or states apply to the rules:
>
> - **Ready**: Indicates that the operation you initiated has succeeded.
> - **Failed**: Indicates that the operation you initiated has failed.
> - **Deleted**: Only applies to the Delete operation and indicates that the rule has been deleted and no longer applies.
> - **InProgress**: Indicates that the operation is in progress. The old rule applies while the operation is in this state.

<a name="anchor-how-to-links-60h"></a>

## Related articles

- [Azure virtual network service endpoints][vm-virtual-network-service-endpoints-overview-649d]
- [Server-level and database-level firewall rules][sql-db-firewall-rules-config-715d]

## Next steps

- [Use PowerShell to create a virtual network service endpoint and then a virtual network rule for SQL Database][sql-db-vnet-service-endpoint-rule-powershell-md-52d]
- [Virtual network rules: Operations][rest-api-virtual-network-rules-operations-862r] with REST APIs

<!-- Link references, to images. -->
[image-portal-firewall-vnet-add-existing-10-png]: ../../sql-database/media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-add-existing-10.png
[image-portal-firewall-create-update-vnet-rule-20-png]: ../../sql-database/media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-create-update-vnet-rule-20.png
[image-portal-firewall-vnet-result-rule-30-png]: ../../sql-database/media/sql-database-vnet-service-endpoint-rule-overview/portal-firewall-vnet-result-rule-30.png

<!-- Link references, to text, Within this same GitHub repo. -->
[arm-deployment-model-568f]: ../../azure-resource-manager/management/deployment-models.md
[expressroute-indexmd-744v]:../index.yml
[rbac-what-is-813s]:../../role-based-access-control/overview.md
[sql-db-firewall-rules-config-715d]:firewall-configure.md
[sql-db-vnet-service-endpoint-rule-powershell-md-52d]:scripts/vnet-service-endpoint-rule-powershell-create.md
[sql-db-vnet-service-endpoint-rule-powershell-md-a-verify-subnet-is-endpoint-ps-100]:scripts/vnet-service-endpoint-rule-powershell-create.md#a-verify-subnet-is-endpoint-ps-100
[vm-configure-private-ip-addresses-for-a-virtual-machine-using-the-azure-portal-321w]: ../virtual-network/virtual-networks-static-private-ip-arm-pportal.md
[vm-virtual-network-service-endpoints-overview-649d]: ../../virtual-network/virtual-network-service-endpoints-overview.md
[vpn-gateway-indexmd-608y]: ../../vpn-gateway/index.yml

<!-- Link references, to text, Outside this GitHub repo (HTTP). -->
[http-azure-portal-link-ref-477t]: https://portal.azure.com/
[rest-api-virtual-network-rules-operations-862r]: /rest/api/sql/virtualnetworkrules

<!-- ??2
#### Syntax related articles
- REST API Reference, including JSON
- Azure CLI
- ARM templates
-->
