---
title: Private endpoints for Azure Backup - Overview
description: This article explains about the concept of private endpoints for Azure Backup that helps to perform backups while maintaining the security of your resources.
ms.topic: conceptual
ms.service: backup
ms.date: 05/24/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Overview and concepts of private endpoints (v2 experience) for Azure Backup

Azure Backup allows you to securely perform the backup and restore operations of your data from the Recovery Services vaults using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your Azure Virtual Network (VNet), effectively bringing the service into your VNet.

Azure Backup now provides an enhanced experience in creation and use of private endpoints compared to the [classic experience](private-endpoints-overview.md) (v1).

This article describes how the [enhanced capabilities of private endpoints](#key-enhancements) for Azure Backup function and help perform backups while maintaining the security of your resources.

## Key enhancements

- Create private endpoints without managed identities.
- No private endpoints are created for the blob and queue services.
- Use of fewer private IPs.

## Before you start

- While a Recovery Services vault is used by (both) Azure Backup and Azure Site Recovery, this article discusses the use of private endpoints for Azure Backup only.

- You can create private endpoints for new Recovery Services vaults that don't have any items registered/protected to the vault, only.

  >[!Note]
  >You can't create private endpoints using static IP.

- You can't upgrade vaults (that contains private endpoints) created using the classic experience to the new experience. You can delete all existing private endpoints, and then create new private endpoints with the v2 experience. 

- One virtual network can contain private endpoints for multiple Recovery Services vaults. Also, one Recovery Services vault can have private endpoints for it in multiple virtual networks. However, you can create a maximum of 12 private endpoints for a vault.

- A private endpoint for a vault uses 10 private IPs, and the count may increase over time. Ensure that you've enough IPs available while creating private endpoints. 

- Private endpoints for Azure Backup don’t include access to Azure Active Directory (Azure AD). Ensure that you enable the access so that IPs and FQDNs required for Azure AD to work in a region have outbound access in allowed state in the secured network when performing backup of databases in Azure VMs and backup using the MARS agent. You can also use NSG tags and Azure Firewall tags for allowing access to Azure AD, as applicable.

- You need to re-register the Recovery Services resource provider with the subscription, if you've registered it before *May 1, 2020*. To re-register the provider, go to *your subscription* in the Azure portal > **Resource provider**, and then select **Microsoft.RecoveryServices** > **Re-register**.

- [Cross-region restore](backup-create-rs-vault.md#set-cross-region-restore) for SQL and SAP HANA database backups aren't supported, if the vault has private endpoints enabled.

- You can create DNS across subscriptions.

## Recommended and supported scenarios

While private endpoints are enabled for the vault, they're used for backup and restore of SQL and SAP HANA workloads in an Azure VM, MARS agent backup and DPM only. You can use the vault for backup of other workloads as well (they won't require private endpoints though). In addition to backup of SQL and SAP HANA workloads and backup using the MARS agent, private endpoints are also used to perform file recovery for Azure VM backup.

The following table lists the scenarios and recommendations:

| Scenario | Recommendation |
| --- | --- |
| Backup of workloads in Azure VM (SQL, SAP HANA), Backup using MARS Agent, DPM server. | Use of private endpoints is recommended to allow backup and restore without needing to add to an allowlist any IPs/FQDNs for Azure Backup or Azure Storage from your virtual networks. In that scenario, ensure that VMs that host SQL databases can reach Azure AD IPs or FQDNs. |
| Azure VM backup | VM backup doesn't require you to allow access to any IPs or FQDNs. So, it doesn't require private endpoints for backup and restore of disks. <br><br> However, file recovery from a vault containing private endpoints would be restricted to virtual networks that contain a private endpoint for the vault. <br><br> When using ACL’ed unmanaged disks, ensure the storage account containing the disks allows access to trusted Microsoft services if it's ACL'ed.  |
| Azure Files backup | Azure Files backups are stored in the local storage account. So it doesn't require private endpoints for backup and restore. |

>[!Note]
>Private endpoints are supported with only DPM server 2022, MABS v4, and later.

## Difference in network connections for private endpoints


As mentioned above, private endpoints are especially useful for backup of workloads (SQL, SAP HANA) in Azure VMs and MARS agent backups.

In all the scenarios (with or without private endpoints), both the workload extensions (for backup of SQL and SAP HANA instances running inside Azure VMs) and the MARS agent make connection calls to Azure AD (to FQDNs mentioned under sections 56 and 59 in [Microsoft 365 Common and Office Online](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online)).

In addition to these connections, when the workload extension or MARS agent is installed for Recovery Services vault without private endpoints, connectivity to the following domains is also required:

| Service | Domain name | Port |
| --- | --- | --- |
| Azure Backup | `*.backup.windowsazure.com` | 443 |
| Azure Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Azure Active Directory |  `*.australiacentral.r.login.microsoft.com` <br><br> Allow access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). |  443 <br><br> As applicable   |

When the workload extension or MARS agent is installed for Recovery Services vault with private endpoint, the following endpoints are communicated:

| Service | Domain name | Port |
| --- | --- | --- |
| Azure Backup | `*.privatelink.<geo>.backup.windowsazure.com` | 443 |
| Azure Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Azure Active Directory |  `*.australiacentral.r.login.microsoft.com` <br><br> Allow access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). | 443 <br><br> As applicable |

>[!Note]
>In the above text, `<geo>` refers to the region code (for example, **eus** for East US and **ne** for North Europe). Refer to the following lists for regions codes:
>- [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
>- [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
>- [Germany](../germany/germany-developer-guide.md#endpoint-mapping)
>- [US Gov](../azure-government/documentation-government-developer-guide.md)

For a Recovery Services vault with private endpoint setup, the name resolution for the FQDNs (`privatelink.<geo>.backup.windowsazure.com`, `*.blob.core.windows.net`, `*.queue.core.windows.net`, `*.blob.storage.azure.net`) should return a private IP address. This can be achieved by using: 

- Azure Private DNS zones
- Custom DNS
- DNS entries in host files
- Conditional forwarders to Azure DNS / Azure Private DNS zones.
 
The private IP mappings for the storage account are listed in the private endpoint created for the Recovery Services vault. We recommend using Azure Private DNS zones, as the DNS records for blobs and queues can then be managed by Azure. When new storage accounts are allocated for the vault, the DNS record for their private IP is added automatically in the blob or queue Azure Private DNS zones.

If you've configured a DNS proxy server, using third-party proxy servers or firewalls, the above domain names must be allowed and redirected to a custom DNS (which has DNS records for the above FQDNs) or to *168.63.129.16* on the Azure virtual network which has  private DNS zones linked to it.

The following example shows Azure firewall used as DNS proxy to redirect the domain name queries for Recovery Services vault, blob, queues and Azure AD to 168.63.129.16.

:::image type="content" source="./media/backup-azure-private-endpoints-concept/private-endpoint-setup-with-microsoft-azure-recovery-service-diagram-inline.png" alt-text="Diagram shows the private endpoint setup with MARS." lightbox="./media/backup-azure-private-endpoints-concept/private-endpoint-setup-with-microsoft-azure-recovery-service-diagram-expanded.png":::

For more information, see [Creating and using private endpoints](private-endpoints.md).

## Network connectivity for vault with private endpoints

The private endpoint for Recovery Services is associated with a network interface (NIC). For private endpoint connections to work, all the traffic for the Azure service must be redirected to the network interface. You can achieve this by adding DNS mapping for private IP associated with the network interface against the service/blob/queue URL.

When the workload backup extensions are installed on the virtual machine registered to a Recovery Services vault with a private endpoint, the extension attempts connection on the private URL of the Azure Backup services `<vault_id>.<azure_backup_svc>.privatelink.<geo>.backup.windowsazure.com`.

If the private URL doesn't resolve, it tries the public URL `<azure_backup_svc>.<geo>.backup.windowsazure.com`. If the public network access for Recovery Services vault is configured to *Allow from all networks*, the Recovery Services vault allows the requests coming from the extension over public URLs. If the public network access for Recovery Services vault is configured to *Deny*, the recovery services vault denies the requests coming from the extension over public URLs.

>[!Note]
>In the above domain names, `<geo>` determines the region code (for example, eus for East US and ne for North Europe). For more information on the region codes, see the following list:
>
>- [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
>- [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
>- [Germany](/azure/germany/germany-developer-guide#endpoint-mapping)
>- [US Gov](../azure-government/documentation-government-developer-guide.md)

These private URLs are specific for the vault. Only extensions and agents registered to the vault can communicate with the Azure Backup service over these endpoints. If the public network access for Recovery Services vault is configured to *Deny*, this restricts the clients that aren't running in the VNet from requesting the backup and restore operations on the vault. We recommend that public network access is set to *Deny* along with private endpoint setup. As the extension and agent attempt the private URL first, the `*.privatelink.<geo>.backup.windowsazure.com` DNS resolution of the URL should return the corresponding private IP associated with the private endpoint.

There are multiple solutions for DNS resolution:

- Azure Private DNS zones
- Custom DNS
- DNS entries in host files
- Conditional forwarders to Azure DNS / Azure Private DNS zones.

When the private endpoint for Recovery Services vaults is created via the Azure portal with the *Integrate with private DNS zone* option, the required DNS entries for private IP addresses for the Azure Backup services (`*.privatelink.<geo>backup.windowsazure.com`) are created automatically when the resource is allocated. In other solutions, you need to create the DNS entries manually for these FQDNs in the custom DNS or in the host files.

For the manual management of DNS records after the VM discovery for communication channel - blob or queue, see [DNS records for blobs and queues (only for custom DNS servers/host files) after the first registration](backup-azure-private-endpoints-configure-manage.md#dns-records-for-blobs-and-queues-only-for-custom-dns-servershost-files-after-the-first-registration). For the manual management of DNS records after the first backup for backup storage account blob, see [DNS records for blobs (only for custom DNS servers/host files) after the first backup](backup-azure-private-endpoints-configure-manage.md#dns-records-for-blobs-only-for-custom-dns-servershost-files-after-the-first-backup).

The private IP addresses for the FQDNs can be found in **DNS configuration** pane for the private endpoint created for the Recovery Services vault.

The following diagram shows how the resolution works when using a private DNS zone to resolve these private service FQDNs.

:::image type="content" source="./media/private-endpoints-overview/use-private-dns-zone-to-resolve-modified-service-fqdns-inline.png" alt-text="Diagram showing how the resolution works using a private DNS zone to resolve modified service FQDNs." lightbox="./media/private-endpoints-overview/use-private-dns-zone-to-resolve-modified-service-fqdns-expanded.png":::

The workload extension running on Azure VM requires connection to at least two storage accounts endpoints - the first one is used as communication channel (via queue messages) and second one for storing backup data. The MARS agent requires access to at least one storage account endpoint that is used for storing backup data.

For a private endpoint enabled vault, the Azure Backup service creates private endpoint for these storage accounts. This prevents any network traffic related to Azure Backup (control plane traffic to service and backup data to storage blob) from leaving the virtual network.
In addition to the Azure Backup cloud services, the workload extension and agent require connectivity to the Azure Storage accounts and Azure Active Directory (Azure AD).

The following diagram shows how the name resolution works for storage accounts using a private DNS zone.

:::image type="content" source="./media/private-endpoints-overview/name-resolution-works-for-storage-accounts-using-private-dns-zone-inline.png" alt-text="Diagram showing how the name resolution works for storage accounts using a private DNS zone." lightbox="./media/private-endpoints-overview/name-resolution-works-for-storage-accounts-using-private-dns-zone-expanded.png":::

## Next steps

- Learn [how to configure and manage private endpoints for Azure Backup](backup-azure-private-endpoints-configure-manage.md).