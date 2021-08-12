---
title: Private endpoints overview
description: Understand the use of private endpoints for Azure Backup and the scenarios where using private endpoints helps maintain the security of your resources.
ms.topic: conceptual
ms.date: 08/13/2021 
ms.custom: devx-track-azurepowershell
---

# Overview and concepts of private endpoints for Azure Backup

Azure Backup allows you to securely back up and restore your data from your Recovery Services vaults using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your VNet, effectively bringing the service into your VNet.

This article will help you understand how private endpoints for Azure Backup work and the scenarios where using private endpoints helps maintain the security of your resources.

## Before you start

- Private endpoints can be created for new Recovery Services vaults only (that don't have any items registered to the vault). So private endpoints must be created before you attempt to protect any items to the vault.
- One virtual network can contain private endpoints for multiple Recovery Services vaults. Also, one Recovery Services vault can have private endpoints for it in multiple virtual networks. However, the maximum number of private endpoints that can be created for a vault is 12.
- Once a private endpoint is created for a vault, the vault will be locked down. It won't be accessible (for backups and restores) from networks apart from ones that contain a private endpoint for the vault. If all private endpoints for the vault are removed, the vault will be accessible from all networks.
- A private endpoint connection for Backup uses a total of 11 private IPs in your subnet, including those used by Azure Backup for storage. This number may be higher (up to 25) for certain Azure regions. So we suggest that you have enough private IPs available when you attempt to create private endpoints for Backup.
- While a Recovery Services vault is used by (both) Azure Backup and Azure Site Recovery, this article discusses use of private endpoints for Azure Backup only.
- Private endpoints for Backup don’t include access to Azure Active Directory (Azure AD) and the same needs to be ensured separately. So, IPs and FQDNs required for Azure AD to work in a region will need outbound access to be allowed from the secured network when performing backup of databases in Azure VMs and backup using the MARS agent. You can also use NSG tags and Azure Firewall tags for allowing access to Azure AD, as applicable.
- Virtual networks with Network Policies aren't supported for Private Endpoints. You'll need to [disable Network Polices](../private-link/disable-private-endpoint-network-policy.md) before continuing.
- You need to re-register the Recovery Services resource provider with the subscription if you registered it before May 1 2020. To re-register the provider, go to your subscription in the Azure portal, navigate to **Resource provider** on the left navigation bar, then select **Microsoft.RecoveryServices** and select **Re-register**.
- [Cross-region restore](backup-create-rs-vault.md#set-cross-region-restore) for SQL and SAP HANA database backups aren't supported if the vault has private endpoints enabled.
- When you move a Recovery Services vault already using private endpoints to a new tenant, you'll need to update the Recovery Services vault to recreate and reconfigure the vault’s managed identity and create new private endpoints as needed (which should be in the new tenant). If this isn't done, the backup and restore operations will start failing. Also, any role-based access control (RBAC) permissions set up within the subscription will need to be reconfigured.

## Recommended and supported scenarios

While private endpoints are enabled for the vault, they're used for backup and restore of SQL and SAP HANA workloads in an Azure VM and MARS agent backup only. You can use the vault for backup of other workloads as well (they won't require private endpoints though). In addition to backup of SQL and SAP HANA workloads and backup using the MARS agent, private endpoints are also used to perform file recovery for Azure VM backup. For more information, see the following table:

| Backup of workloads in Azure VM (SQL, SAP HANA), Backup using MARS Agent | Use of private endpoints is recommended to allow backup and restore without needing to add to an allowlist any IPs/FQDNs for Azure Backup or Azure Storage from your virtual networks. In that scenario, ensure that VMs that host SQL databases can reach Azure AD IPs or FQDNs. |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Azure  VM backup**                                         | VM backup doesn't require you to allow access to any IPs or FQDNs. So it doesn't require private endpoints for backup and restore  of disks.  <br><br>   However, file recovery from a vault containing private endpoints would be restricted to virtual networks that contain a private endpoint for the vault. <br><br>    When using ACL’ed unmanaged disks, ensure the  storage account containing the disks allows access to **trusted Microsoft services** if it's ACL’ed. |
| **Azure  Files backup**                                      | Azure Files backups are stored in the local  storage account. So it doesn't require private endpoints for backup and  restore. |

>[!Note]
>Private endpoints aren't supported with DPM and MABS servers. 

## Difference in network connections due to private endpoints

As mentioned above, private endpoints are especially useful for backup of workloads (SQL, SAP HANA) in Azure VMs and MARS agent backups. 
In all the scenarios (with or without private endpoints), both the workload extensions (for backup of SQL and SAP HANA instances running inside Azure VMs) and the MARS agent make connection calls to AAD (to FQDNs mentioned under sections 56 and 59 in [Microsoft 365 Common and Office Online](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online)).

In addition to these connections when the workload extension or MARS agent is installed for recovery services vault _without private endpoints_, connectivity to the following domains are also required:

| Service | Domain names |
| ------- | ------------ |
| Azure Backup  | *.backup.windowsazure.com |
| Azure Storage | *.blob.core.windows.net <br> *.queue.core.windows.net <br> *.blob.storage.azure.net |

When the workload extension or MARS agent is installed for Recovery Services vault with private endpoint, the following endpoints are hit:

| Service | Domain names |
| ------- | ------------ |
| Azure Backup  | *. privatelink.<geo>.backup.windowsazure.com |
| Azure Storage | *.blob.core.windows.net <br> *.queue.core.windows.net <br> *.blob.storage.azure.net |

>[!Note]
>In the above text, **<geo>** refers to the region code (for example, eus and ne for East US and North Europe respectively). Refer to the following lists for regions codes:
>- [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
>- [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
>- [Germany](/azure/germany/germany-developer-guide#endpoint-mapping)
>- [US Gov](/azure/azure-government/documentation-government-developer-guide)

The storage FQDNs hit in both the scenarios are same. However, for a Recovery Services vault with private endpoint setup, the name resolution for these should result in a private IP  address. This can be achieved by using private DNS zones, by creating DNS entries for storage account in host files, or by using conditional forwarders to custom DNS with the respective DNS entries. The private IP mappings for the storage account are listed in the private endpoint blade for the storage account ion the portal.

>The private endpoints for blobs and queues follow a standard naming pattern, they start with **\<the name of the private endpoint>_ecs** or **\<the name of the private endpoint>_prot**, and are suffixed with **\_blob** and **\_queue** respectively.

The endpoints for the Azure Backup service are modified for private endpoint enabled vaults.  
If you have configured a DNS proxy server, using  third-party proxy servers and firewalls, the above domain names must be allowed and redirected to a custom DNS (with private IP addresses mappings) or to 169.63.129.16 with a virtual network link to a private DNS zone with these private IP addresses mappings.

The following example shows Azure firewall used as DNS proxy to redirect the domain name queries for Recovery Services vault, blob, queues and AAD to 169.63.129.16.

:::image type="content" source="./media/private-endpoints-overview/azure-firewall-used-as-dns-proxy.png" alt-text="Diagram showing the use of Azure firewall as DNS proxy to redirect the domain name queries.":::

For more information, see [Creating and using private endpoints](private-endpoints.md).

## How Azure Backup sets up network connectivity for vaults with private endpoints?

The private endpoint for recovery services is associated with a network interface (NIC) that has a private IP. For private endpoint connections to work (routing all the traffic to the service via Azure backbone and restricting service access to clients within your VNET), it’s required that all the communication traffic for the service is redirected to that network interface. This can be achieved by using DNS linked to the VNET or host file entries on the machine where extension/agent is running.

The workload backup extension and MARS agent run on Azure VM in a VNET or on-premises VM peered with VNET. When registered to a Recovery Services vault with a private endpoint joined with this VNET, the service URL of the Azure Backup cloud services for the extension and agent change from **\<azure_backup_svc >.<geo>.backup.windowsazure.com**  to **\<vault_id>.<azure_backup_svc>.privatelink.<geo>.backup.windowsazure.com**.

>[!Note]
>In the above text, **<geo>** refers to the region code (for example, eus and ne for East US and North Europe respectively). Refer to the following lists for regions codes:
>- [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
>- [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
>- [Germany](/azure/germany/germany-developer-guide#endpoint-mapping)
>- [US Gov](/azure/azure-government/documentation-government-developer-guide)

The modified URLs are specific for a vault.  See **\<vault_id>** in the URL name. Only extensions and agents registered to this vault can communicate with Azure Backup via these endpoints. This restricts the access to the clients within this VNET. The extension/agent will communicate via **\*. privatelink.<geo>.backup.windowsazure.com** that need to resolve to corresponding private IP in the NIC.

When the private endpoint for Recovery Services vaults is created via Azure portal with the **integrate with private DNS zone** option, the required DNS entries for private IP addresses for Azure Backup services (*.privatelink.<geo>backup.windowsazure.com) are created automatically whenever the resource is allocated. Otherwise, you need to create the DNS entries manually for these FQDNs in the custom DNS or in the host files.

For the manual management of DNS records after the VM discovery for communication channel - blob/queue, see [DNS records for blobs and queues (only for custom DNS servers/host files) after the first registration](/azure/backup/private-endpoints#dns-records-for-blobs-and-queues-only-for-custom-dns-servershost-files-after-the-first-registration). For the manual management of DNS records after the first backup for backup storage account blob, see [DNS records for blobs (only for custom DNS servers/host files) after the first backup](/azure/backup/private-endpoints#dns-records-for-blobs-only-for-custom-dns-servershost-files-after-the-first-backup).

>The private IP addresses for the FQDNs can be found in the private endpoint blade for the private endpoint created for the Recovery Services vault.

The following diagram shows how the resolution works when using a private DNS zone to resolve these modified service FQDNs. 

:::image type="content" source="./media/private-endpoints-overview/use-private-dns-zone-to-resolve-modified-service-fqdns.png" alt-text="Diagram showing how the resolution works using a private DNS zone to resolve modified service FQDNs.":::

In addition to the connection to Azure Backup cloud services, the workload extension and agent require connection to Azure storage accounts and Azure Active Directory. The workload extension running on Azure VM requires connection to a minimum of two storage accounts - the first one is used as communication channel (via queue messages) and second one for storing backup data. The MARS agent requires access to one storage account used for storing backup data.

For a private endpoint enabled vault, Azure Backup creates private endpoint for these storage accounts that is routing the traffic for communication channel and backup data via the Azure backbone network. This prevents any network traffic related to Azure Backup from leaving the virtual network.

As a pre-requisite, Recovery Services vault requires permissions for creating additional private endpoints in the same Resource Group. We also recommend to provide the Recovery Services vault the permissions to create DNS entries in the private DNS zones (privatelink.blob.core.windows.net, privatelink.queue.core.windows.net). Recovery Services vault searches for private DNS zones in the Resource Groups where VNET and private endpoint are created. If it has the permissions to add DNS entries in these zones, they’ll be created by the vault, otherwise you must create them manually by the user in their custom DNS or in private DNS zone linked with the VNET.

>The private IP mappings are available in the private endpoint blade for the blobs and queues on the portal.

The following diagram shows how the name resolution works for storage accounts using a private DNS zone.

:::image type="content" source="./media/private-endpoints-overview/name-resolution-works-for-storage-accounts-using-private-dns-zone.png" alt-text="Diagram showing how the name resolution works for storage accounts using a private DNS zone.":::

## Next steps

[Creating and using private endpoints](private-endpoints.md)
