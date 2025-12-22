---
title: 'Private Endpoints Overview: Version 2 Experience'
description: This article explains the concept of private endpoints for Azure Backup, which can help you perform backups while maintaining the security of your resources.
ms.topic: overview
ms.service: azure-backup
ms.date: 09/09/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.custom: sfi-image-nochange
# Customer intent: As an IT administrator, I want to implement private endpoints for Azure Backup so that I can secure backup and restore operations within my virtual network and enhance the protection of sensitive data.
---

# Private endpoints for Azure Backup: Version 2 experience

With Azure Backup, you can back up and restore your data from your Recovery Services vaults by using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your Azure virtual network to effectively bring the service into your virtual network.

Azure Backup now provides a version 2 experience for the creation and use of private endpoints, compared to the [version 1 experience](private-endpoints-overview.md).

This article describes how the version 2 capabilities of private endpoints for Azure Backup function and help you perform backups while maintaining the security of your resources.

## Key enhancements

- Create private endpoints without managed identities.
- No private endpoints are created for the blob and queue services.
- Use fewer private IPs.

## Considerations before you start

- Although both Azure Backup and Azure Site Recovery use a Recovery Services vault, this article discusses use of private endpoints for Azure Backup only.

- Customer-managed keys (CMKs) with a network-restricted key vault aren't supported with a vault that's enabled for private endpoints.

- You can create private endpoints for new Recovery Services vaults only, if no items are registered to the vault. However, private endpoints are currently not supported for Backup vaults.

  Private endpoints with static IPs are unsupported in the version 2 experience due to dynamic IP expansion. Although creation succeeds, registration might fail for vaults that have existing protected items.
  
  Creation of multiple private endpoints with the same name under Recovery Services vaults is unsupported.

- You can't upgrade vaults (that contain private endpoints) created via the version 1 experience to the version 2 experience. You can delete all existing private endpoints, and then create new private endpoints with the version 2 experience.

- One virtual network can contain private endpoints for multiple Recovery Services vaults. Also, one Recovery Services vault can have private endpoints in multiple virtual networks. You can create a maximum of 12 private endpoints for a vault.

- A private endpoint for a vault uses 10 private IPs, and the count might increase over time. We recommend that you have enough private IPs (/25) available when you try to create private endpoints for Azure Backup.

- Private endpoints for Azure Backup don't include access to Microsoft Entra ID. Ensure that you enable the access so that IPs and fully qualified domain names (FQDNs) that are required for Microsoft Entra ID to work in a region have outbound access in an allowed state in the secured network when you're performing:

  - A backup of databases in Azure virtual machines (VMs).
  - A backup that uses the Microsoft Azure Recovery Services (MARS) agent.
  
  You can also use network security group (NSG) tags and Azure Firewall tags for allowing access to Microsoft Entra ID, as applicable.

- You need to re-register the Recovery Services resource provider with the subscription if you registered it before May 1, 2020. To re-register the provider, go to your subscription in the Azure portal, go to **Resource provider** on the left menu, and then select **Microsoft.RecoveryServices** > **Re-register**.

- You can create DNS across subscriptions.

- You can create a secondary private endpoint before or after you have protected items in the vault. [Learn how to do cross-region restore for a private endpoint-enabled vault](backup-azure-private-endpoints-configure-manage.md#cross-region-restore-to-a-private-endpoint-enabled-vault).

## Recommended and supported scenarios

While private endpoints are enabled for the vault, they're used for backup and restore of SQL Server and SAP HANA workloads in an Azure VM, MARS agent backup, and System Center Data Protection Manager (DPM) only. You can also use the vault for the backup of other workloads, though they don't require private endpoints. In addition to backups of SQL Server and SAP HANA workloads and backups via the MARS agent, private endpoints are used to perform file recovery for Azure VM backups.

The following table lists the scenarios and recommendations:

| Scenario | Recommendation |
| --- | --- |
| Backup of workloads in an Azure VM (SQL Server, SAP HANA), backup via MARS agent, DPM server | We recommend the use of private endpoints to allow backup and restore without needing to add to an allow list any IPs or FQDNs for Azure Backup or Azure Storage from your virtual networks. In that scenario, ensure that VMs that host SQL databases can reach Microsoft Entra IPs or FQDNs. |
| Azure VM backup | A VM backup doesn't require you to allow access to any IPs or FQDNs. So, it doesn't require private endpoints for backup and restore of disks.  <br><br>   However, file recovery from a vault that contains private endpoints would be restricted to virtual networks that contain a private endpoint for the vault. <br><br> When you're using unmanaged disks in an access control list (ACL), ensure that the storage account that contains the disks allows access to trusted Microsoft services if it's in an ACL. |
| Azure Files backup | An Azure Files backup is stored in the local storage account. So it doesn't require private endpoints for backup and restore. |
| Changed virtual network for a private endpoint in the vault and virtual machine | Stop backup protection and configure backup protection in a new vault with private endpoints enabled. |

> [!NOTE]
> Private endpoints are supported only with DPM 2022, Microsoft Azure Backup Server (MABS) v4, and later.

## Unsupported scenario

For backup and restore operations, a private endpoint-enabled Recovery Services vault is not compatible with a private endpoint-enabled Azure key vault to store CMKs in a Recovery Services vault.

## Difference in network connections for private endpoints

As mentioned earlier, private endpoints are especially useful for backups of workloads (SQL Server and SAP HANA) in Azure VMs and backups of MARS agents.

In all the scenarios (with or without private endpoints), both the workload extensions (for backup of SQL Server and SAP HANA instances running inside Azure VMs) and the MARS agent make connection calls to Microsoft Entra ID. They make the calls to FQDNs mentioned under sections 56 and 59 in [Microsoft 365 Common and Office Online](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

In addition to these connections, when the workload extension or MARS agent is installed for a Recovery Services vault without private endpoints, connectivity to the following domains is required:

| Service | Domain name | Port |
| --- | --- | --- |
| Azure Backup | `*.backup.windowsazure.com` | 443 |
| Azure Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Microsoft Entra ID |  `*.login.microsoft.com` <br><br> Allow access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). |  443 <br><br> As applicable   |

When the workload extension or MARS agent is installed for a Recovery Services vault with a private endpoint, the following endpoints are involved:

| Service | Domain name | Port |
| --- | --- | --- |
| Azure Backup | `*.privatelink.<geo>.backup.windowsazure.com` | 443 |
| Azure Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Microsoft Entra ID |  `*.login.microsoft.com` <br><br> Allow access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online). | 443 <br><br> As applicable |

> [!NOTE]
> In the preceding text, `<geo>` refers to the region code (for example, `eus` for East US and `ne` for North Europe). For more information on the region codes, see the following list:
>
> - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
> - [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
> - [Germany](../germany/germany-developer-guide.md#endpoint-mapping)
> - [US government](../azure-government/documentation-government-developer-guide.md)

To automatically update the MARS agent, allow access to `download.microsoft.com/download/MARSagent/*`.

For a Recovery Services vault with private endpoint setup, the name resolution for the FQDNs (`privatelink.<geo>.backup.windowsazure.com`, `*.blob.core.windows.net`, `*.queue.core.windows.net`, `*.blob.storage.azure.net`) should return a private IP address. You can achieve this by using:

- Azure Private DNS zones.
- Custom DNS.
- DNS entries in host files.
- Conditional forwarders to Azure DNS or Azure Private DNS zones.

The private IP mappings for the storage account are listed in the private endpoint created for the Recovery Services vault. We recommend using Azure Private DNS zones, because Azure can then manage the DNS records for blobs and queues. When new storage accounts are allocated for the vault, the DNS record for their private IP is added automatically in the Azure Private DNS zones for the blob or queue.

If you configured a DNS proxy server by using third-party proxy servers or firewalls, the preceding domain names must be allowed and redirected to one of these choices:

- Custom DNS that has DNS records for the preceding FQDNs
- 168.63.129.16 on the Azure virtual network that has private DNS zones linked to it

The following example shows Azure Firewall used as a DNS proxy to redirect the domain name queries for a Recovery Services vault, blob, queues, and Microsoft Entra ID to 168.63.129.16.

:::image type="content" source="./media/backup-azure-private-endpoints-concept/private-endpoint-setup-with-microsoft-azure-recovery-service-diagram.png" alt-text="Diagram that shows a private endpoint setup with MARS." lightbox="./media/backup-azure-private-endpoints-concept/private-endpoint-setup-with-microsoft-azure-recovery-service-diagram.png":::

For more information, see [Create and use private endpoints](private-endpoints.md).

## Network connectivity setup for a vault with private endpoints

The private endpoint for Recovery Services is associated with a network interface (NIC). For private endpoint connections to work, all traffic for the Azure service must be redirected to the network interface. You can achieve this redirection by adding DNS mapping for private IPs associated with the network interface against the service, blob, or queue URL.

When workload backup extensions are installed on the virtual machine registered to a Recovery Services vault with a private endpoint, the extension attempts a connection on the private URL of the Azure Backup services: `<vault_id>.<azure_backup_svc>.privatelink.<geo>.backup.windowsazure.com`.

If the private URL doesn't work, the extension tries the public URL: `<azure_backup_svc>.<geo>.backup.windowsazure.com`. If the public network access for the Recovery Services vault is configured as **Allow from all networks**, the Recovery Services vault allows the requests coming from the extension over public URLs. If the public network access for Recovery Services vault is configured as **Deny**, the Recovery Services vault denies the requests coming from the extension over public URLs.

> [!NOTE]
> In the preceding domain names, `<geo>` determines the region code (for example, `eus` for East US and `ne` for North Europe). For more information on the region codes, see the following list:
>
> - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
> - [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
> - [Germany](/azure/germany/germany-developer-guide#endpoint-mapping)
> - [US government](../azure-government/documentation-government-developer-guide.md)

These private URLs are specific for the vault. Only extensions and agents that are registered to the vault can communicate with Azure Backup over these endpoints. If the public network access for the Recovery Services vault is configured as **Deny**, this setting restricts the clients that aren't running in the virtual network from requesting backup and restore operations on the vault.

We recommend setting the public network access to **Deny**, along with private endpoint setup. As the extension and agent try to use the private URL initially, the  `*.privatelink.<geo>.backup.windowsazure.com` DNS resolution of the URL should return the corresponding private IP associated with the private endpoint.

The solutions for DNS resolution are:

- Azure Private DNS zones
- Custom DNS
- DNS entries in host files
- Conditional forwarders to Azure DNS or Azure Private DNS zones

When you create the private endpoint for Recovery Services via the Azure portal with the **Integrate with private DNS zone** option, the required DNS entries for private IP addresses for Azure Backup services (`*.privatelink.<geo>backup.windowsazure.com`) are created automatically whenever the resource is allocated. In other solutions, you need to create the DNS entries manually for these FQDNs in the custom DNS or in the host files.

For the manual management of DNS records for blobs and queues after the VM discovery for the communication channel, see [DNS records for blobs and queues (only for custom DNS servers/host files) after the first registration](./private-endpoints.md#dns-records-for-blobs-and-queues-only-for-custom-dns-servershost-files-after-the-first-registration). For the manual management of DNS records after the first backup for backup storage account blobs, see [DNS records for blobs (only for custom DNS servers/host files) after the first backup](./private-endpoints.md#dns-records-for-blobs-only-for-custom-dns-servershost-files-after-the-first-backup).

You can find the private IP addresses for the FQDNs on the **DNS configuration** pane for the private endpoint that you created for the Recovery Services vault.

The following diagram shows how the resolution works when you use a private DNS zone to resolve these private service FQDNs.

:::image type="content" source="./media/private-endpoints-overview/use-private-dns-zone-to-resolve-modified-service-fqdns.png" alt-text="Diagram that shows the use of a private DNS zone to resolve modified service FQDNs." lightbox="./media/private-endpoints-overview/use-private-dns-zone-to-resolve-modified-service-fqdns.png":::

The workload extension running on an Azure VM requires a connection to at least two storage accounts. The first one is used as communication channel, via queue messages. The second one is for storing backup data. The MARS agent requires access to one storage account used for storing backup data.

For a private endpoint-enabled vault, the Azure Backup service creates a private endpoint for these storage accounts. This action prevents any network traffic related to Azure Backup (control plane traffic to the service, and backup data to the storage blob) from leaving the virtual network. In addition to Azure Backup cloud services, the workload extension and agent require connectivity to Azure Storage accounts and Microsoft Entra ID.

The following diagram shows how the name resolution works for storage accounts that use a private DNS zone.

:::image type="content" source="./media/private-endpoints-overview/name-resolution-works-for-storage-accounts-using-private-dns-zone.png" alt-text="Diagram that shows name resolution for storage accounts that use a private DNS zone." lightbox="./media/private-endpoints-overview/name-resolution-works-for-storage-accounts-using-private-dns-zone.png":::

The following diagram shows how you can do cross-region restore over a private endpoint by replicating the private endpoint in a secondary region. [Learn how to do cross-region restore to a private endpoint-enabled vault](backup-azure-private-endpoints-configure-manage.md#cross-region-restore-to-a-private-endpoint-enabled-vault).

:::image type="content" source="./media/backup-azure-private-endpoints-concept/cross-region-restore-over-private-endpoint.png" alt-text="Diagram that shows cross-region restore over a private endpoint." lightbox="./media/backup-azure-private-endpoints-concept/cross-region-restore-over-private-endpoint.png":::

## Related content

- Learn [how to configure and manage private endpoints for Azure Backup](backup-azure-private-endpoints-configure-manage.md).
