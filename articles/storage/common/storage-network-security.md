---
title: Configure Azure Storage firewalls and virtual networks | Microsoft Docs
description: Configure layered network security for your storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: tamram
ms.reviewer: santoshc
ms.subservice: common
---

# Configure Azure Storage firewalls and virtual networks

Azure Storage provides a layered security model. This model enables you to secure and control the level of access to your storage accounts that your applications and enterprise environments demand, based on the type and subset of networks​ used. When network rules are configured, only applications requesting data over the specified set of networks can access a storage account. You can limit access to your storage account to requests originating from specified IP addresses, IP ranges or from a list of subnets in an Azure Virtual Network (VNet).

Storage accounts have a public endpoint that is accessible through the internet. You can also create [Private Endpoints for your storage account](storage-private-endpoints.md), which assigns a private IP address from your VNet to the storage account, and secures all traffic between your VNet and the storage account over a private link. The Azure storage firewall provides access control access for the public endpoint of your storage account. You can also use the firewall to block all access through the public endpoint when using private endpoints. Your storage firewall configuration also enables select trusted Azure platform services to access the storage account securely.

An application that accesses a storage account when network rules are in effect still requires proper authorization for the request. Authorization is supported with Azure Active Directory (Azure AD) credentials for blobs and queues, with a valid account access key, or with an SAS token.

> [!IMPORTANT]
> Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests originate from a service operating within an Azure Virtual Network (VNet) or from allowed public IP addresses. Requests that are blocked include those from other Azure services, from the Azure portal, from logging and metrics services, and so on.
>
> You can grant access to Azure services that operate from within a VNet by allowing traffic from the subnet hosting the service instance. You can also enable a limited number of scenarios through the [Exceptions](#exceptions) mechanism described below. To access data from the storage account through the Azure portal, you would need to be on a machine within the trusted boundary (either IP or VNet) that you set up.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Scenarios

To secure your storage account, you should first configure a rule to deny access to traffic from all networks (including internet traffic) on the public endpoint, by default. Then, you should configure rules that grant access to traffic from specific VNets. You can also configure rules to grant access to traffic from select public internet IP address ranges, enabling connections from specific internet or on-premises clients. This configuration enables you to build a secure network boundary for your applications.

You can combine firewall rules that allow access from specific virtual networks and from public IP address ranges on the same storage account. Storage firewall rules can be applied to existing storage accounts, or when creating new storage accounts.

Storage firewall rules apply to the public endpoint of a storage account. You don't need any firewall access rules to allow traffic for private endpoints of a storage account. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint.

Network rules are enforced on all network protocols to Azure storage, including REST and SMB. To access data using tools such as the Azure portal, Storage Explorer, and AZCopy, explicit network rules must be configured.

Once network rules are applied, they're enforced for all requests. SAS tokens that grant access to a specific IP address serve to limit the access of the token holder, but don't grant new access beyond configured network rules.

Virtual machine disk traffic (including mount and unmount operations, and disk IO) is not affected by network rules. REST access to page blobs is protected by network rules.

Classic storage accounts do not support firewalls and virtual networks.

You can use unmanaged disks in storage accounts with network rules applied to backup and restore VMs by creating an exception. This process is documented in the [Exceptions](#exceptions) section of this article. Firewall exceptions aren't applicable with managed disks as they're already managed by Azure.

## Change the default network access rule

By default, storage accounts accept connections from clients on any network. To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure Storage. Setting the default network rule to **deny** blocks all access to the data unless specific network rules that **grant** access are also applied. Be sure to grant access to any allowed networks using network rules before you change the default rule to deny access.

### Managing default network access rules

You can manage default network access rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. To deny access by default, choose to allow access from **Selected networks**. To allow traffic from all networks, choose to allow access from **All networks**.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the status of the default rule for the storage account.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").DefaultAction
    ```

1. Set the default rule to deny network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
    ```

1. Set the default rule to allow network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
    ```

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. Display the status of the default rule for the storage account.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.defaultAction
    ```

1. Set the default rule to deny network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
    ```

1. Set the default rule to allow network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Allow
    ```

## Grant access from a virtual network

You can configure storage accounts to allow access only from specific subnets. The allowed subnets may belong to a VNet in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant.

Enable a [Service endpoint](/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage within the VNet. The service endpoint routes traffic from the VNet through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the storage account that allow requests to be received from specific subnets in a VNet. Clients granted access via these network rules must continue to meet the authorization requirements of the storage account to access the data.

Each storage account supports up to 100 virtual network rules, which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available virtual network regions

In general, service endpoints work between virtual networks and service instances in the same Azure region. When using service endpoints with Azure Storage, this scope grows to include the [paired region](/azure/best-practices-availability-paired-regions). Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should create the VNets in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

> [!NOTE]
> Service endpoints don't apply to traffic outside the region of the virtual network and the designated region pair. You can only apply network rules granting access from virtual networks to storage accounts in the primary region of a storage account or in the designated paired region.

### Required permissions

To apply a virtual network rule to a storage account, the user must have the appropriate permissions for the subnets being added. The permission needed is *Join Service to a Subnet* and is included in the *Storage Account Contributor* built-in role. It can also be added to custom role definitions.

Storage account and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through Powershell, CLI and REST APIs. Such rules cannot be configured through the Azure portal, though they may be viewed in the portal.

### Managing virtual network rules

You can manage virtual network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. To grant access to a virtual network with a new network rule, under **Virtual networks**, click **Add existing virtual network**, select **Virtual networks** and **Subnets** options, and then click **Add**. To create a new virtual network and grant it access, click **Add new virtual network**. Provide the information necessary to create the new virtual network, and then click **Create**.

    > [!NOTE]
    > If a service endpoint for Azure Storage wasn't previously configured for the selected virtual network and subnets, you can configure it as part of this operation.
    >
    > Presently, only virtual networks belonging to the same Azure Active Directory tenant are shown for selection during rule creation. To grant access to a subnet in a virtual network belonging to another tenant, please use Powershell, CLI or REST APIs.

1. To remove a virtual network or subnet rule, click **...** to open the context menu for the virtual network or subnet, and click **Remove**.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List virtual network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

1. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```powershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
    ```

1. Add a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

    > [!TIP]
    > To add a network rule for a subnet in a VNet belonging to another Azure AD tenant, use a fully-qualified **VirtualNetworkResourceId** parameter in the form "/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name".

1. Remove a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List virtual network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

1. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
    ```

1. Add a network rule for a virtual network and subnet.

    ```azurecli
    $subnetid=(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

    > [!TIP]
    > To add a rule for a subnet in a VNet belonging to another Azure AD tenant, use a fully-qualified subnet ID in the form "/subscriptions/\<subscription-ID\>/resourceGroups/\<resourceGroup-Name\>/providers/Microsoft.Network/virtualNetworks/\<vNet-name\>/subnets/\<subnet-name\>".
    >
    > You can use the **subscription** parameter to retrieve the subnet ID for a VNet belonging to another Azure AD tenant.

1. Remove a network rule for a virtual network and subnet.

    ```azurecli
    $subnetid=(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

## Grant access from an internet IP range

You can configure storage accounts to allow access from specific public internet IP address ranges. This configuration grants access to specific internet-based services and on-premises networks and blocks general internet traffic.

Provide allowed internet address ranges using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form *16.17.18.0/24* or as individual IP addresses like *16.17.18.19*.

   > [!NOTE]
   > Small address ranges using "/31" or "/32" prefix sizes are not supported. These ranges should be configured using individual IP address rules.

IP network rules are only allowed for **public internet** IP addresses. IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with _10.*_, _172.16.*_ - _172.31.*_, and _192.168.*_.

   > [!NOTE]
   > IP network rules have no effect on requests originating from the same Azure region as the storage account. Use [Virtual network rules](#grant-access-from-a-virtual-network) to allow same-region requests.

  > [!NOTE]
  > Services deployed in the same region as the storage account use private Azure IP addresses for communication. Thus, you cannot restrict access to specific Azure services based on their public inbound IP address range.

Only IPV4 addresses are supported for configuration of storage firewall rules.

Each storage account supports up to 100 IP network rules.

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account with an IP network rule, you must identify the internet facing IP addresses used by your network. Contact your network administrator for help.

If you are using [ExpressRoute](/azure/expressroute/expressroute-introduction) from your premises, for public peering or Microsoft peering, you will need to identify the NAT IP addresses that are used. For public peering, each ExpressRoute circuit by default uses two NAT IP addresses applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP addresses used are either customer provided or are provided by the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting. To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal. Learn more about [NAT for ExpressRoute public and Microsoft peering.](/azure/expressroute/expressroute-nat#nat-requirements-for-azure-public-peering)

### Managing IP network rules

You can manage IP network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under **Firewall** > **Address Range**.

1. To remove an IP network rule, click the trash can icon next to the address range.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. List IP network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

1. Add a network rule for an individual IP address.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Add a network rule for an IP address range.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

1. Remove a network rule for an IP address range.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List IP network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
    ```

1. Add a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Add a network rule for an IP address range.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

1. Remove a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

1. Remove a network rule for an IP address range.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

## Exceptions

Network rules help to create a secure environment for connections between your applications and your data for most scenarios. However, some applications depend on Azure services that cannot be uniquely isolated through virtual network or IP address rules. But such services must be granted to storage to enable full application functionality. In such situations, you can use the ***Allow trusted Microsoft services...*** setting to enable such services to access your data, logs, or analytics.

### Trusted Microsoft services

Some Microsoft services operate from networks that can't be included in your network rules. You can grant a subset of such trusted Microsoft services access to the storage account, while maintaining network rules for other apps. These trusted services will then use strong authentication to connect to your storage account securely. We've enabled two modes of trusted access for Microsoft services.

- Resources of some services, **when registered in your subscription**, can access your storage account **in the same subscription** for select operations, such as writing logs or backup.
- Resources of some services can be granted explicit access to your storage account by **assigning an RBAC role** to its system-assigned managed identity.


When you enable the **Allow trusted Microsoft services...** setting, resources of the following services that are registered in the same subscription as your storage account are granted access for a limited set of operations as described:

| Service                  | Resource Provider Name     | Operations allowed                 |
|:------------------------ |:-------------------------- |:---------------------------------- |
| Azure Backup             | Microsoft.RecoveryServices | Run backups and restores of unmanaged disks in IAAS virtual machines. (not required for managed disks). [Learn more](/azure/backup/backup-introduction-to-azure-backup). |
| Azure Data Box           | Microsoft.DataBox          | Enables import of data to Azure using Data Box. [Learn more](/azure/databox/data-box-overview). |
| Azure DevTest Labs       | Microsoft.DevTestLab       | Custom image creation and artifact installation. [Learn more](/azure/devtest-lab/devtest-lab-overview). |
| Azure Event Grid         | Microsoft.EventGrid        | Enable Blob Storage event publishing and allow Event Grid to publish to storage queues. Learn about [blob storage events](/azure/event-grid/event-sources) and [publishing to queues](/azure/event-grid/event-handlers). |
| Azure Event Hubs         | Microsoft.EventHub         | Archive data with Event Hubs Capture. [Learn More](/azure/event-hubs/event-hubs-capture-overview). |
| Azure File Sync          | Microsoft.StorageSync      | Enables you to transform your on-prem file server to a cache for Azure File shares. Allowing for multi-site sync, fast disaster-recovery, and cloud-side backup. [Learn more](../files/storage-sync-files-planning.md) |
| Azure HDInsight          | Microsoft.HDInsight        | Provision the initial contents of the default file system for a new HDInsight cluster. [Learn more](/azure/hdinsight/hdinsight-hadoop-use-blob-storage). |
| Azure Import Export      | Microsoft.ImportExport     | Enables import of data to Azure and export of data from Azure using Import/Export service. [Learn more](/azure/storage/common/storage-import-export-service).  |
| Azure Monitor            | Microsoft.Insights         | Allows writing of monitoring data to a secured storage account, including resource diagnostic logs, Azure Active Directory sign-in and audit logs, and Microsoft Intune logs. [Learn more](/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security). |
| Azure Networking         | Microsoft.Network          | Store and analyze network traffic logs. [Learn more](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview). |
| Azure Site Recovery      | Microsoft.SiteRecovery     | Enable replication for disaster-recovery of Azure IaaS virtual machines when using firewall-enabled cache, source, or target storage accounts.  [Learn more](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication). |

The **Allow trusted Microsoft services...** setting also allows a particular instance of the below services to access the storage account, if you explicitly [assign an RBAC role](storage-auth-aad.md#assign-rbac-roles-for-access-rights) to the [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for that resource instance. In this case, the scope of access for the instance corresponds to the RBAC role assigned to the managed identity.

| Service                        | Resource Provider Name          | Purpose            |
| :----------------------------- | :------------------------------------- | :---------- |
| Azure Container Registry Tasks | Microsoft.ContainerRegistry/registries | ACR Tasks can access storage accounts when building container images. |
| Azure Data Factory             | Microsoft.DataFactory/factories        | Allows access to storage accounts through the ADF runtime. |
| Azure Logic Apps               | Microsoft.Logic/workflows              | Enables logic apps to access storage accounts. [Learn more](../../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). |
| Azure Machine Learning | Microsoft.MachineLearningServices      | Authorized Azure Machine Learning workspaces write experiment output, models, and logs to Blob storage. [Learn more](/azure/machine-learning/service/how-to-enable-virtual-network#use-a-storage-account-for-your-workspace). |
| Azure SQL Data Warehouse       | Microsoft.Sql                          | Allows import and export of data from specific SQL Database instances using PolyBase. [Learn more](/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview). |
| Azure Stream Analytics         | Microsoft.StreamAnalytics             | Allows data from a streaming job to be written to Blob storage. This feature is currently in preview. [Learn more](/azure/stream-analytics/blob-output-managed-identity). |
| Azure Synapse Analytics        | Microsoft.Synapse/workspaces          | Enables access to data in Azure Storage from Synapse Analytics. |


### Storage analytics data access

In some cases, access to read diagnostic logs and metrics is required from outside the network boundary. When configuring trusted services access to the storage account, you can allow read-access for the log files, metrics tables, or both. [Learn more about working with storage analytics.](/azure/storage/storage-analytics)

### Managing exceptions

You can manage network rule exceptions through the Azure portal, PowerShell, or Azure CLI v2.

#### Azure portal

1. Go to the storage account you want to secure.

1. Click on the settings menu called **Firewalls and virtual networks**.

1. Check that you've selected to allow access from **Selected networks**.

1. Under **Exceptions**, select the exceptions you wish to grant.

1. Click **Save** to apply your changes.

#### PowerShell

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

1. Display the exceptions for the storage account network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
    ```

1. Configure the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass AzureServices,Metrics,Logging
    ```

1. Remove the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

#### CLIv2

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. Display the exceptions for the storage account network rules.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.bypass
    ```

1. Configure the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass Logging Metrics AzureServices
    ```

1. Remove the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

## Next steps

Learn more about Azure Network service endpoints in [Service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

Dig deeper into Azure Storage security in [Azure Storage security guide](../blobs/security-recommendations.md).
