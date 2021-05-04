---
title: Configure Azure Storage firewalls and virtual networks | Microsoft Docs
description: Configure layered network security for your storage account using Azure Storage firewalls and Azure Virtual Network.
services: storage
author: normesta
ms.service: storage
ms.topic: how-to
ms.date: 03/16/2021
ms.author: normesta
ms.reviewer: santoshc
ms.subservice: common
---

# Configure Azure Storage firewalls and virtual networks

Azure Storage provides a layered security model. This model enables you to secure and control the level of access to your storage accounts that your applications and enterprise environments demand, based on the type and subset of networks or resources​ used. When network rules are configured, only applications requesting data over the specified set of networks or through the specified set of Azure resources can access a storage account. You can limit access to your storage account to requests originating from specified IP addresses, IP ranges, subnets in an Azure Virtual Network (VNet), or resource instances of some Azure services.

Storage accounts have a public endpoint that is accessible through the internet. You can also create [Private Endpoints for your storage account](storage-private-endpoints.md), which assigns a private IP address from your VNet to the storage account, and secures all traffic between your VNet and the storage account over a private link. The Azure storage firewall provides access control for the public endpoint of your storage account. You can also use the firewall to block all access through the public endpoint when using private endpoints. Your storage firewall configuration also enables select trusted Azure platform services to access the storage account securely.

An application that accesses a storage account when network rules are in effect still requires proper authorization for the request. Authorization is supported with Azure Active Directory (Azure AD) credentials for blobs and queues, with a valid account access key, or with an SAS token.

> [!IMPORTANT]
> Turning on firewall rules for your storage account blocks incoming requests for data by default, unless the requests originate from a service operating within an Azure Virtual Network (VNet) or from allowed public IP addresses. Requests that are blocked include those from other Azure services, from the Azure portal, from logging and metrics services, and so on.
>
> You can grant access to Azure services that operate from within a VNet by allowing traffic from the subnet hosting the service instance. You can also enable a limited number of scenarios through the exceptions mechanism described below. To access data from the storage account through the Azure portal, you would need to be on a machine within the trusted boundary (either IP or VNet) that you set up.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Scenarios

To secure your storage account, you should first configure a rule to deny access to traffic from all networks (including internet traffic) on the public endpoint, by default. Then, you should configure rules that grant access to traffic from specific VNets. You can also configure rules to grant access to traffic from selected public internet IP address ranges, enabling connections from specific internet or on-premises clients. This configuration enables you to build a secure network boundary for your applications.

You can combine firewall rules that allow access from specific virtual networks and from public IP address ranges on the same storage account. Storage firewall rules can be applied to existing storage accounts, or when creating new storage accounts.

Storage firewall rules apply to the public endpoint of a storage account. You don't need any firewall access rules to allow traffic for private endpoints of a storage account. The process of approving the creation of a private endpoint grants implicit access to traffic from the subnet that hosts the private endpoint.

Network rules are enforced on all network protocols for Azure storage, including REST and SMB. To access data using tools such as the Azure portal, Storage Explorer, and AZCopy, explicit network rules must be configured.

Once network rules are applied, they're enforced for all requests. SAS tokens that grant access to a specific IP address serve to limit the access of the token holder, but don't grant new access beyond configured network rules.

Virtual machine disk traffic (including mount and unmount operations, and disk IO) is not affected by network rules. REST access to page blobs is protected by network rules.

Classic storage accounts do not support firewalls and virtual networks.

You can use unmanaged disks in storage accounts with network rules applied to back up and restore VMs by creating an exception. This process is documented in the [Manage Exceptions](#manage-exceptions) section of this article. Firewall exceptions aren't applicable with managed disks as they're already managed by Azure.

## Change the default network access rule

By default, storage accounts accept connections from clients on any network. To limit access to selected networks, you must first change the default action.

> [!WARNING]
> Making changes to network rules can impact your applications' ability to connect to Azure Storage. Setting the default network rule to **deny** blocks all access to the data unless specific network rules that **grant** access are also applied. Be sure to grant access to any allowed networks using network rules before you change the default rule to deny access.

### Managing default network access rules

You can manage default network access rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### [Portal](#tab/azure-portal)

1. Go to the storage account you want to secure.

2. Select on the settings menu called **Networking**.

3. To deny access by default, choose to allow access from **Selected networks**. To allow traffic from all networks, choose to allow access from **All networks**.

4. Select **Save** to apply your changes.

<a id="powershell"></a>

#### [PowerShell](#tab/azure-powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

2. Display the status of the default rule for the storage account.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").DefaultAction
    ```

3. Set the default rule to deny network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Deny
    ```

4. Set the default rule to allow network access by default.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -DefaultAction Allow
    ```

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. Display the status of the default rule for the storage account.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.defaultAction
    ```

3. Set the default rule to deny network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Deny
    ```

4. Set the default rule to allow network access by default.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --default-action Allow
    ```
---

## Grant access from a virtual network

You can configure storage accounts to allow access only from specific subnets. The allowed subnets may belong to a VNet in the same subscription, or those in a different subscription, including subscriptions belonging to a different Azure Active Directory tenant.

Enable a [Service endpoint](../../virtual-network/virtual-network-service-endpoints-overview.md) for Azure Storage within the VNet. The service endpoint routes traffic from the VNet through an optimal path to the Azure Storage service. The identities of the subnet and the virtual network are also transmitted with each request. Administrators can then configure network rules for the storage account that allow requests to be received from specific subnets in a VNet. Clients granted access via these network rules must continue to meet the authorization requirements of the storage account to access the data.

Each storage account supports up to 200 virtual network rules, which may be combined with [IP network rules](#grant-access-from-an-internet-ip-range).

### Available virtual network regions

In general, service endpoints work between virtual networks and service instances in the same Azure region. When using service endpoints with Azure Storage, this scope grows to include the [paired region](../../best-practices-availability-paired-regions.md). Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, you should create the VNets in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

> [!NOTE]
> Service endpoints don't apply to traffic outside the region of the virtual network and the designated region pair. You can only apply network rules granting access from virtual networks to storage accounts in the primary region of a storage account or in the designated paired region.

### Required permissions

To apply a virtual network rule to a storage account, the user must have the appropriate permissions for the subnets being added. Applying a rule can be performed by a [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) or a user that has been given permission to the `Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action` [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role.

Storage account and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through Powershell, CLI and REST APIs. Such rules cannot be configured through the Azure portal, though they may be viewed in the portal.

### Managing virtual network rules

You can manage virtual network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### [Portal](#tab/azure-portal)

1. Go to the storage account you want to secure.

2. Select on the settings menu called **Networking**.

3. Check that you've selected to allow access from **Selected networks**.

4. To grant access to a virtual network with a new network rule, under **Virtual networks**, select **Add existing virtual network**, select **Virtual networks** and **Subnets** options, and then select **Add**. To create a new virtual network and grant it access, select **Add new virtual network**. Provide the information necessary to create the new virtual network, and then select **Create**.

    > [!NOTE]
    > If a service endpoint for Azure Storage wasn't previously configured for the selected virtual network and subnets, you can configure it as part of this operation.
    >
    > Presently, only virtual networks belonging to the same Azure Active Directory tenant are shown for selection during rule creation. To grant access to a subnet in a virtual network belonging to another tenant, please use Powershell, CLI or REST APIs.

5. To remove a virtual network or subnet rule, select **...** to open the context menu for the virtual network or subnet, and select **Remove**.

6. select **Save** to apply your changes.

#### [PowerShell](#tab/azure-powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

2. List virtual network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").VirtualNetworkRules
    ```

3. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```powershell
    Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Set-AzVirtualNetworkSubnetConfig -Name "mysubnet" -AddressPrefix "10.0.0.0/24" -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
    ```

4. Add a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

    > [!TIP]
    > To add a network rule for a subnet in a VNet belonging to another Azure AD tenant, use a fully-qualified **VirtualNetworkResourceId** parameter in the form "/subscriptions/subscription-ID/resourceGroups/resourceGroup-Name/providers/Microsoft.Network/virtualNetworks/vNet-name/subnets/subnet-name".

5. Remove a network rule for a virtual network and subnet.

    ```powershell
    $subnet = Get-AzVirtualNetwork -ResourceGroupName "myresourcegroup" -Name "myvnet" | Get-AzVirtualNetworkSubnetConfig -Name "mysubnet"
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -VirtualNetworkResourceId $subnet.Id
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. List virtual network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query virtualNetworkRules
    ```

3. Enable service endpoint for Azure Storage on an existing virtual network and subnet.

    ```azurecli
    az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
    ```

4. Add a network rule for a virtual network and subnet.

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

    > [!TIP]
    > To add a rule for a subnet in a VNet belonging to another Azure AD tenant, use a fully-qualified subnet ID in the form "/subscriptions/\<subscription-ID\>/resourceGroups/\<resourceGroup-Name\>/providers/Microsoft.Network/virtualNetworks/\<vNet-name\>/subnets/\<subnet-name\>".
    >
    > You can use the **subscription** parameter to retrieve the subnet ID for a VNet belonging to another Azure AD tenant.

5. Remove a network rule for a virtual network and subnet.

    ```azurecli
    subnetid=$(az network vnet subnet show --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --query id --output tsv)
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --subnet $subnetid
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

---

## Grant access from an internet IP range

You can use IP network rules to allow access from specific public internet IP address ranges by creating IP network rules. Each storage account supports up to 200 rules. These rules grant access to specific internet-based services and on-premises networks and blocks general internet traffic.

The following restrictions apply to IP address ranges.

- IP network rules are allowed only for **public internet** IP addresses. 

  IP address ranges reserved for private networks (as defined in [RFC 1918](https://tools.ietf.org/html/rfc1918#section-3)) aren't allowed in IP rules. Private networks include addresses that start with _10.*_, _172.16.*_ - _172.31.*_, and _192.168.*_.

- You must provide allowed internet address ranges using [CIDR notation](https://tools.ietf.org/html/rfc4632) in the form *16.17.18.0/24* or as individual IP addresses like *16.17.18.19*. 

- Small address ranges using "/31" or "/32" prefix sizes are not supported. These ranges should be configured using individual IP address rules. 

- Only IPV4 addresses are supported for configuration of storage firewall rules.

IP network rules can't be used in the following cases:

- To restrict access to clients in same Azure region as the storage account.
  
  IP network rules have no effect on requests originating from the same Azure region as the storage account. Use [Virtual network rules](#grant-access-from-a-virtual-network) to allow same-region requests. 

- To restrict access to clients in a [paired region](../../best-practices-availability-paired-regions.md) which are in a VNet that has a service endpoint.

- To restrict access to Azure services deployed in the same region as the storage account.

  Services deployed in the same region as the storage account use private Azure IP addresses for communication. Thus, you can't restrict access to specific Azure services based on their public outbound IP address range.

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account with an IP network rule, you must identify the internet facing IP addresses used by your network. Contact your network administrator for help.

If you are using [ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, for public peering or Microsoft peering, you will need to identify the NAT IP addresses that are used. For public peering, each ExpressRoute circuit by default uses two NAT IP addresses applied to Azure service traffic when the traffic enters the Microsoft Azure network backbone. For Microsoft peering, the NAT IP addresses used are either customer provided or are provided by the service provider. To allow access to your service resources, you must allow these public IP addresses in the resource IP firewall setting. To find your public peering ExpressRoute circuit IP addresses, [open a support ticket with ExpressRoute](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) via the Azure portal. Learn more about [NAT for ExpressRoute public and Microsoft peering.](../../expressroute/expressroute-nat.md#nat-requirements-for-azure-public-peering)

### Managing IP network rules

You can manage IP network rules for storage accounts through the Azure portal, PowerShell, or CLIv2.

#### [Portal](#tab/azure-portal)

1. Go to the storage account you want to secure.

2. Select on the settings menu called **Networking**.

3. Check that you've selected to allow access from **Selected networks**.

4. To grant access to an internet IP range, enter the IP address or address range (in CIDR format) under **Firewall** > **Address Range**.

5. To remove an IP network rule, select the trash can icon next to the address range.

6. Select **Save** to apply your changes.

#### [PowerShell](#tab/azure-powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

2. List IP network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount").IPRules
    ```

3. Add a network rule for an individual IP address.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

4. Add a network rule for an IP address range.

    ```powershell
    Add-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

5. Remove a network rule for an individual IP address.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.19"
    ```

6. Remove a network rule for an IP address range.

    ```powershell
    Remove-AzStorageAccountNetworkRule -ResourceGroupName "myresourcegroup" -AccountName "mystorageaccount" -IPAddressOrRange "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

1. List IP network rules.

    ```azurecli
    az storage account network-rule list --resource-group "myresourcegroup" --account-name "mystorageaccount" --query ipRules
    ```

2. Add a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

3. Add a network rule for an IP address range.

    ```azurecli
    az storage account network-rule add --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

4. Remove a network rule for an individual IP address.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.19"
    ```

5. Remove a network rule for an IP address range.

    ```azurecli
    az storage account network-rule remove --resource-group "myresourcegroup" --account-name "mystorageaccount" --ip-address "16.17.18.0/24"
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

---

<a id="grant-access-specific-instances"></a>

## Grant access from Azure resource instances (preview)

In some cases, an application might depend on Azure resources that cannot be isolated through a virtual network or an IP address rule. However, you'd still like to secure and restrict storage account access to only your application's Azure resources. You can configure storage accounts to allow access to specific resource instances of some Azure services by creating a resource instance rule. 

The types of operations that a resource instance can perform on storage account data is determined by the [Azure role assignments](storage-auth-aad.md#assign-azure-roles-for-access-rights) of the resource instance. Resource instances must be from the same tenant as your storage account, but they can belong to any subscription in the tenant.

> [!NOTE]
> This feature is in public preview and is available in all public cloud regions.

> [!NOTE]
> Resource instance rules are currently only supported for Azure Synapse. Support for other Azure services listed in the [Trusted access based on system-assigned managed identity](#trusted-access-system-assigned-managed-identity) section of this article will be available in the coming weeks.


### [Portal](#tab/azure-portal)

You can add or remove resource network rules in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/) to get started.

2. Locate your storage account and display the account overview.

3. Select **Networking** to display the configuration page for networking.

4. In the **Resource type** drop-down list, choose the resource type of your resource instance. 

5. In the **Instance name** drop-down list, choose the resource instance. You can also choose to include all resource instances in the active tenant, subscription, or resource group.

6. Select **Save** to apply your changes. The resource instance appears in the **Resource instances** section of the network settings page. 

To remove the resource instance, select the delete icon (:::image type="icon" source="media/storage-network-security/delete-icon.png":::) next to the resource instance.

### [PowerShell](#tab/azure-powershell)

You can use PowerShell commands to add or remove resource network rules.

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or network rules have no effect.

#### Install the preview module

Install the latest version of the PowershellGet module. Then, close and reopen the PowerShell console.

```powershell
install-Module PowerShellGet –Repository PSGallery –Force  
```

Install **Az. Storage** preview module.

```powershell
Install-Module Az.Storage -Repository PsGallery -RequiredVersion 3.0.1-preview -AllowClobber -AllowPrerelease -Force 
```

For more information about how to install PowerShell modules, see [Install the Azure PowerShell module](/powershell/azure/install-az-ps)

#### Grant access

Add a network rule that grants access from a resource instance.

```powershell
$resourceId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Add-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $accountName -TenantId $tenantId -ResourceId $resourceId

```

Specify multiple resource instances at once by modifying the network rule set.

```powershell
$resourceId1 = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$resourceId2 = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Sql/servers/mySQLServer"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Update-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName -ResourceAccessRule (@{ResourceId=$resourceId1;TenantId=$tenantId},@{ResourceId=$resourceId2;TenantId=$tenantId}) 
```

#### Remove access

Remove a network rule that grants access from a resource instance.

```powershell
$resourceId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.DataFactory/factories/myDataFactory"
$tenantId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Remove-AzStorageAccountNetworkRule -ResourceGroupName $resourceGroupName -Name $accountName -TenantId $tenantId -ResourceId $resourceId  
```

Remove all network rules that grant access from resource instances.

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

Update-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName -ResourceAccessRule @()  
```

#### View a list of allowed resource instances

View a complete list of resource instances that have been granted access to the storage account.

```powershell
$resourceGroupName = "myResourceGroup"
$accountName = "mystorageaccount"

$rule = Get-AzStorageAccountNetworkRuleSet -ResourceGroupName $resourceGroupName -Name $accountName
$rule.ResourceAccessRules 
```

### [Azure CLI](#tab/azure-cli)

You can use Azure CLI commands to add or remove resource network rules.

#### Install the preview extension

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Then, verify that the version of Azure CLI that you have installed is `2.13.0` or higher by using the following command.

   ```azurecli
   az --version
   ```

   If your version of Azure CLI is lower than `2.13.0`, then install a later version. See [Install the Azure CLI](/cli/azure/install-azure-cli).

3. Type the following command to install the preview extension.

   ```azurecli
   az extension add -n storage-preview
   ```

#### Grant access

Add a network rule that grants access from a resource instance.

```azurecli
az storage account network-rule add \
    --resource-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Synapse/workspaces/testworkspace \
    --tenant-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -g myResourceGroup \
    --account-name mystorageaccount
```

#### Remove access

Remove a network rule that grants access from a resource instance.

```azurecli
az storage account network-rule remove \
    --resource-id /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myResourceGroup/providers/Microsoft.Synapse/workspaces/testworkspace \
    --tenant-id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    -g myResourceGroup \
    --account-name mystorageaccount
```

#### View a list of allowed resource instances

View a complete list of resource instances that have been granted access to the storage account.

```azurecli
az storage account network-rule list \
    -g myResourceGroup \
    --account-name mystorageaccount
```

---

<a id="exceptions"></a>
<a id="trusted-microsoft-services"></a>

## Grant access to trusted Azure services 

Some Azure services operate from networks that can't be included in your network rules. You can grant a subset of such trusted Azure services access to the storage account, while maintaining network rules for other apps. These trusted services will then use strong authentication to securely connect to your storage account.

You can grant access to trusted Azure services by creating a network rule exception. For step-by-step guidance, see the [Manage exceptions](#manage-exceptions) section of this article.

When you grant access to trusted Azure services, you grant the following types of access:

- Trusted access for select operations to resources that are registered in your subscription.
- Trusted access to resources based on system-assigned managed identity.

<a id="trusted-access-resources-in-subscription"></a>

### Trusted access for resources registered in your subscription

Resources of some services, **when registered in your subscription**, can access your storage account **in the same subscription** for select operations, such as writing logs or backup.  The following table describes each service and the operations allowed. 

| Service                  | Resource Provider Name     | Operations allowed                 |
|:------------------------ |:-------------------------- |:---------------------------------- |
| Azure Backup             | Microsoft.RecoveryServices | Run backups and restores of unmanaged disks in IAAS virtual machines. (not required for managed disks). [Learn more](../../backup/backup-overview.md). |
| Azure Data Box           | Microsoft.DataBox          | Enables import of data to Azure using Data Box. [Learn more](../../databox/data-box-overview.md). |
| Azure DevTest Labs       | Microsoft.DevTestLab       | Custom image creation and artifact installation. [Learn more](../../devtest-labs/devtest-lab-overview.md). |
| Azure Event Grid         | Microsoft.EventGrid        | Enable Blob Storage event publishing and allow Event Grid to publish to storage queues. Learn about [blob storage events](../../event-grid/overview.md#event-sources) and [publishing to queues](../../event-grid/event-handlers.md). |
| Azure Event Hubs         | Microsoft.EventHub         | Archive data with Event Hubs Capture. [Learn More](../../event-hubs/event-hubs-capture-overview.md). |
| Azure File Sync          | Microsoft.StorageSync      | Enables you to transform your on-prem file server to a cache for Azure File shares. Allowing for multi-site sync, fast disaster-recovery, and cloud-side backup. [Learn more](../file-sync/file-sync-planning.md) |
| Azure HDInsight          | Microsoft.HDInsight        | Provision the initial contents of the default file system for a new HDInsight cluster. [Learn more](../../hdinsight/hdinsight-hadoop-use-blob-storage.md). |
| Azure Import Export      | Microsoft.ImportExport     | Enables import of data to Azure Storage or export of data from Azure Storage using the Azure Storage Import/Export service. [Learn more](../../import-export/storage-import-export-service.md).  |
| Azure Monitor            | Microsoft.Insights         | Allows writing of monitoring data to a secured storage account, including resource logs, Azure Active Directory sign-in and audit logs, and Microsoft Intune logs. [Learn more](../../azure-monitor/roles-permissions-security.md). |
| Azure Networking         | Microsoft.Network          | Store and analyze network traffic logs, including through the Network Watcher and Traffic Analytics services. [Learn more](../../network-watcher/network-watcher-nsg-flow-logging-overview.md). |
| Azure Site Recovery      | Microsoft.SiteRecovery     | Enable replication for disaster-recovery of Azure IaaS virtual machines when using firewall-enabled cache, source, or target storage accounts.  [Learn more](../../site-recovery/azure-to-azure-tutorial-enable-replication.md). |

<a id="trusted-access-system-assigned-managed-identity"></a>

### Trusted access based on system-assigned managed identity

The following table lists services that can have access to your storage account data if the resource instances of those services are given the appropriate permission. To grant permission, you must explicitly [assign an Azure role](storage-auth-aad.md#assign-azure-roles-for-access-rights) to the [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for each resource instance. In this case, the scope of access for the instance corresponds to the Azure role assigned to the managed identity. 

> [!TIP]
> The recommended way to grant access to specific resources is to use resource instance rules. To grant access to specific resource instances, see the [Grant access from Azure resource instances (preview)](#grant-access-specific-instances) section of this article.


| Service                        | Resource Provider Name                 | Purpose            |
| :----------------------------- | :------------------------------------- | :----------------- |
| Azure API Management           | Microsoft.ApiManagement/service        | Enables Api Management service access to storage accounts behind firewall using policies. [Learn more](../../api-management/api-management-authentication-policies.md#use-managed-identity-in-send-request-policy). |
| Azure Cognitive Search         | Microsoft.Search/searchServices        | Enables Cognitive Search services to access storage accounts for indexing, processing and querying. |
| Azure Cognitive Services       | Microsoft.CognitiveService/accounts    | Enables Cognitive Services to access storage accounts. |
| Azure Container Registry Tasks | Microsoft.ContainerRegistry/registries | ACR Tasks can access storage accounts when building container images. |
| Azure Data Factory             | Microsoft.DataFactory/factories        | Allows access to storage accounts through the ADF runtime. |
| Azure Data Share               | Microsoft.DataShare/accounts           | Allows access to storage accounts through Data Share. |
| Azure DevTest Labs             | Microsoft.DevTestLab/labs              | Allows access to storage accounts through DevTest Labs. |
| Azure IoT Hub                  | Microsoft.Devices/IotHubs              | Allows data from an IoT hub to be written to Blob storage. [Learn more](../../iot-hub/virtual-network-support.md#egress-connectivity-to-storage-account-endpoints-for-routing) |
| Azure Logic Apps               | Microsoft.Logic/workflows              | Enables logic apps to access storage accounts. [Learn more](../../logic-apps/create-managed-service-identity.md#authenticate-access-with-managed-identity). |
| Azure Machine Learning Service | Microsoft.MachineLearningServices      | Authorized Azure Machine Learning workspaces write experiment output, models, and logs to Blob storage and read the data. [Learn more](../../machine-learning/how-to-network-security-overview.md#secure-the-workspace-and-associated-resources). |
| Azure Media Services           | Microsoft.Media/mediaservices          | Allows access to storage accounts through Media Services. |
| Azure Migrate                  | Microsoft.Migrate/migrateprojects      | Allows access to storage accounts through Azure Migrate. |
| Azure Purview                  | Microsoft.Purview/accounts             | Allows Purview to access storage accounts. |
| Azure Remote Rendering         | Microsoft.MixedReality/remoteRenderingAccounts | Allows access to storage accounts through Remote Rendering. |
| Azure Site Recovery            | Microsoft.RecoveryServices/vaults      | Allows access to storage accounts through Site Recovery. |
| Azure SQL Database             | Microsoft.Sql                          | Allows [writing](../../azure-sql/database/audit-write-storage-account-behind-vnet-firewall.md) audit data to storage accounts behind firewall. |
| Azure Synapse Analytics        | Microsoft.Sql                          | Allows import and export of data from specific SQL databases using the COPY statement or PolyBase (in dedicated pool), or the `openrowset` function and external tables in serverless pool. [Learn more](../../azure-sql/database/vnet-service-endpoint-rule-overview.md). |
| Azure Stream Analytics         | Microsoft.StreamAnalytics              | Allows data from a streaming job to be written to Blob storage. [Learn more](../../stream-analytics/blob-output-managed-identity.md). |
| Azure Synapse Analytics        | Microsoft.Synapse/workspaces           | Enables access to data in Azure Storage from Azure Synapse Analytics. |

## Grant access to storage analytics

In some cases, access to read resource logs and metrics is required from outside the network boundary. When configuring trusted services access to the storage account, you can allow read-access for the log files, metrics tables, or both by creating a network rule exception. For step-by-step guidance, see the **Manage exceptions** section below. To learn more about working with storage analytics, see [Use Azure Storage analytics to collect logs and metrics data](./storage-analytics.md). 

<a id="manage-exceptions"></a>

## Manage exceptions

You can manage network rule exceptions through the Azure portal, PowerShell, or Azure CLI v2.

#### [Portal](#tab/azure-portal)

1. Go to the storage account you want to secure.

2. Select on the settings menu called **Networking**.

3. Check that you've selected to allow access from **Selected networks**.

4. Under **Exceptions**, select the exceptions you wish to grant.

5. Select **Save** to apply your changes.

#### [PowerShell](#tab/azure-powershell)

1. Install the [Azure PowerShell](/powershell/azure/install-Az-ps) and [sign in](/powershell/azure/authenticate-azureps).

2. Display the exceptions for the storage account network rules.

    ```powershell
    (Get-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount").Bypass
    ```

3. Configure the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass AzureServices,Metrics,Logging
    ```

4. Remove the exceptions to the storage account network rules.

    ```powershell
    Update-AzStorageAccountNetworkRuleSet -ResourceGroupName "myresourcegroup" -Name "mystorageaccount" -Bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

#### [Azure CLI](#tab/azure-cli)

1. Install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in](/cli/azure/authenticate-azure-cli).

2. Display the exceptions for the storage account network rules.

    ```azurecli
    az storage account show --resource-group "myresourcegroup" --name "mystorageaccount" --query networkRuleSet.bypass
    ```

3. Configure the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass Logging Metrics AzureServices
    ```

4. Remove the exceptions to the storage account network rules.

    ```azurecli
    az storage account update --resource-group "myresourcegroup" --name "mystorageaccount" --bypass None
    ```

> [!IMPORTANT]
> Be sure to [set the default rule](#change-the-default-network-access-rule) to **deny**, or removing exceptions have no effect.

---

## Next steps

Learn more about Azure Network service endpoints in [Service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

Dig deeper into Azure Storage security in [Azure Storage security guide](../blobs/security-recommendations.md).