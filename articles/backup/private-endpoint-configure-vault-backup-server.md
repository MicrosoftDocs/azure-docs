---
title: Private Endpoint Setup for MABS in Azure Backup
description: Learn how to configure private endpoints for Azure Backup when using Microsoft Azure Backup Server (MABS) to back up on-premises data securely.
#customer intent: As a MABS user, I want to register my server with a Recovery Services vault using private endpoints so that I can back up on-premises data securely.
author: AbhishekMallick-MS
ms.author: v-mallicka
ms.reviewer: v-mallicka
ms.date: 12/01/2025
ms.topic: how-to
ms.service: azure-backup
---

# Configure private endpoint in Recovery Services vaults for backup using MABS server

This article describes how to configure private endpoints for Azure Backup when using Microsoft Azure Backup Server (MABS) to back up on-premises data securely.

Azure Backup allows you to back up and restore your data securely from your Recovery Services vaults using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your Azure Virtual Network, effectively bringing the service into your virtual network.

This feature enables private endpoints for Azure Backup to maintain the security of your resources.

Azure Backup now provides an enhanced experience in creation and use of private endpoints compared to the [classic experience ](private-endpoints-overview.md)(v1).

[Learn more about the enhanced capabilities of private endpoints](backup-azure-private-endpoints-concept.md#key-enhancements) (v2 Experience).

>[!Note]
>Private endpoints work only with MABS v4 (14.0.30.0) or later.

## Considerations

Before you configure private endpoints for Azure Backup, ensure that you review the following considerations:

- A Recovery Services vault works with both Azure Backup and Azure Site Recovery. This article focuses on using private endpoints for Azure Backup only.
- Create private endpoints only for new Recovery Services vaults without any registered or protected items.
- You can't upgrade vaults that include private endpoints created in the classic experience to the new experience. Delete all existing private endpoints and then create new ones using the v2 experience.
- A single virtual network can host private endpoints for multiple Recovery Services vaults. Likewise, one Recovery Services vault can have private endpoints across multiple virtual networks.
- A private endpoint for a vault uses up to 10 private IPs, which might vary by location. When you use private endpoints for Azure Backup, ensure you have `10 + n` IPs available (where n equals the number of data sources protected on Azure Backup Server).
- MABS configured with a private endpoint can protect up to 80 data sources on a Recovery Services vault under the current configuration.
- Private endpoints for Azure Backup don't include access to Microsoft Entra ID. Enable outbound access for IPs and Fully Qualified Domain Names (FQDNs) required for Microsoft Entra ID in the secured network when you back up using the MARS agent. You can also use Network Security Group (NSG) tags and Azure Firewall tags to allow access to Microsoft Entra ID.
- If your Recovery Services vault uses a private endpoint, all backup data travels through a private IP in your Azure virtual network. In this case, ExpressRoute Private Peering is required to carry backup traffic between on-premises and Azure.
- You can create DNS across subscriptions.

## Supported network connections for private endpoints

Private endpoints are essential when you back up workloads in MABS using the MARS agent. Irrespective of the private endpoint configuration, MARS agent connects to Microsoft Entra ID through the FQDNs listed in sections 56 and 59 in [Microsoft 365 Common and Office Online](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online).

When MARS agent is installed for Recovery Services vault with private endpoint, the following endpoints are communicated:

| Service    | Domain  names                             | Ports|
| -------------- | ------------------------------------------------------------ | --- |
| Azure  Backup  | `*.privatelink.<geo>.backup.windowsazure.com`                             | 443 |
| Azure  Storage | `*.blob.core.windows.net` <br><br> `*.queue.core.windows.net` <br><br> `*.blob.storage.azure.net` | 443 |
| Microsoft Entra ID      | `*.login.microsoft.com` <br><br> Allow  access to FQDNs under sections 56 and 59 according to [this article](/office365/enterprise/urls-and-ip-address-ranges#microsoft-365-common-and-office-online) | 443 <br><br> As applicable |

 In the domain name, `\<geo\>` refers to the region code (for example, **`eus`** for East US and **ne** for North Europe). Learn about the supported geography for the following regions:

- [**All public clouds**](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)

- [**China**](/azure/china/resources-developer-guide#check-endpoints-in-azure)

- [**Germany**](/azure/germany/germany-developer-guide#endpoint-mapping)

- [**US Gov**](/azure/azure-government/documentation-government-developer-guide)

For a Recovery Services vault with private endpoint setup, the name resolution for the FQDNs (privatelink.\<geo\>.backup.windowsazure.com, \*.blob.core.windows.net, \*.queue.core.windows.net, \*.blob.storage.azure.net) should fetch a private IP address. You can fetch the IP address using the following parameters:

- Azure Private DNS zones
- Custom DNS
- DNS entries in host files
- Conditional forwarders to Azure DNS / Azure Private DNS zones.

## Create a Recovery Service vault and disable public access to the vault

To create a Recovery Services vault with private endpoints and disable the public access, follow these steps:

1. [Create a vault in the resource group same as the datasource you want to back up](backup-create-recovery-services-vault.md#create-a-recovery-services-vault).

   :::image type="content" source="media/private-endpoint-vault-backup-server/create-vault.png" alt-text="Screenshot shows Recovery Services vault creation interface in Azure portal.":::

1. After the vault creates successfully, go to the **vault** > **Networking**.

1. To prevent access from public networks, on the **Networking** pane, on the **Public access** tab, select **Deny**.

   :::image type="content" source="media/private-endpoint-vault-backup-server/public-access-deny.png" alt-text="Screenshot shows how to deny public access to a vault." lightbox="media/private-endpoint-vault-backup-server/public-access-deny.png":::

## Create private endpoints for Azure Backup

To create private endpoints for Azure Backup, follow these steps:

1. Go to the **Recovery Services vault** where you disabled public access > **Networking** > **Private access**, and then select **+ Private endpoint**.

1. On the **Create a private endpoint** pane, specify the required details for creating your private endpoint connection by following these steps.

   1. On the **Basics** tab, enter the basic details for your private endpoints. The region should be the same as the vault and the resource for backup.

      :::image type="content" source="media/private-endpoint-vault-backup-server/basic-private-endpoint-configuration.png" alt-text="Screenshot shows the private endpoint basics configuration page.":::

   1. On the **Resource** tab, select the PaaS resource for which you want to create your connection, **Resource type** as `Microsoft.RecoveryServices/vaults`. Then, choose the name of your Recovery Services vault as the **Resource** and **AzureBackup** as the **Target sub-resource**.

      :::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-resource-details.png" alt-text="Screenshot shows the private endpoint resource selection configuration." lightbox="media/private-endpoint-vault-backup-server/private-endpoint-resource-details.png":::

   1. On the **Virtual Network** tab, specify the virtual network and subnet where you want the private endpoint to be created (the virtual network where the Virtual Machine (VM) is located).

      :::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-virtual-network-configuration.png" alt-text="Screenshot shows the private endpoint configuration settings for virtual network and subnet.":::

   1. On the **DNS** tab, configure a DNS record to connect privately through your private endpoint. We recommend integrating the private endpoint with a private DNS zone. Alternatively, you can use your own DNS servers or create DNS records in the host files on your virtual machines.

      The following screenshot shows that the private endpoint is integrated with Private DNS Zone.

      :::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-dns-configuration.png" alt-text="Screenshot shows the DNS configuration settings for private endpoint integration." lightbox="media/private-endpoint-vault-backup-server/private-endpoint-dns-configuration.png":::

   1. (Optional) On the **Tags** tab, add tags for your private endpoint.

   1. On the **Review + create** tab, review your settings. When the validation completes, select **Create** to create the private endpoint.

## Approve private endpoints for the Recovery Services vault

Private endpoints are auto approved when created by the vault owner. If you're not the owner, private endpoints require manual approval in the Azure portal.

This section describes the manual approval process of private endpoints through the Azure portal.

 The following screenshot shows an auto approved private endpoint that the owner creates.

:::image type="content" source="media/private-endpoint-vault-backup-server/private-endpoint-approval-status.png" alt-text="Screenshot shows the private endpoint approval status in Azure portal." lightbox="media/private-endpoint-vault-backup-server/private-endpoint-approval-status.png":::

To manually approve private endpoints via the Azure portal, follow these steps:

1. On the **Recovery Services vault** with private endpoint created, go to **Settings** > **Networking**.

1. On the **Networking** pane, select **Private access** > the **private endpoint connection** from the list that you want to approve.

1. Select **Approve**.

## Manage DNS records for private endpoints

Private connectivity requires DNS records in private DNS zones or servers. You can integrate the private endpoint to Azure private DNS zones or configure custom DNS servers, depending on your network design. This configuration is required for all three services - Azure Backup, Azure Blobs, and Queues.

### Integrate private endpoints with Azure private DNS zones

If you choose to integrate your private endpoint with private DNS zones, Azure Backup adds the required DNS records. You can view the private DNS zones that's used under **DNS configuration** of the private endpoint. If these DNS zones aren't present, they're created automatically when creating the private endpoint.

However, you must verify that your virtual network (which contains the resources to be backed up) is properly linked with all three private DNS zones.

:::image type="content" source="media/private-endpoint-vault-backup-server/virtual-network-links.png" alt-text="Screenshot shows the DNS configuration details for private endpoint zones." lightbox="media/private-endpoint-vault-backup-server/virtual-network-links.png":::

If you're using proxy servers, you can bypass the proxy server or perform your backups through the proxy server. To bypass a proxy server, continue to the following sections. To use the proxy server for performing your backups, see [proxy server setup details for Recovery Services vault](../backup/private-endpoints.md#set-up-proxy-server-for-recovery-services-vault-with-private-endpoint).

To validate and  integrate virtual network links for the preceding  **private DNS** zone  (for Backup, Blobs and Queues), follow these steps:

1. On the **Recovery Services vault** where you configured private endpoints, go to **Networking** > **Private access**, and then select the private endpoint from the list.

1. On the selected **private endpoint** pane, select **Settings** > **DNS configuration**.

1. On the **DNS configuration** pane, select the **Private DNS zone** link.

1. On the selected **private DNS zone** pane, select **Virtual Network Links**

1. On the selected **virtual network link** pane, select **Virtual Network Links**

   A virtual network link entry appears for which you created the private endpoint. The following screenshot shows an example of virtual network links for all three DNS zones.

   :::image type="content" source="media/private-endpoint-vault-backup-server/virtual-network-links-domain-name-server-zones.png" alt-text="Screenshot shows the virtual network links configuration in private DNS zones." lightbox="media/private-endpoint-vault-backup-server/virtual-network-links-domain-name-server-zones.png":::

1. If no entry appears, select **+ Add** and link the virtual network to the required DNS zones.

   The following screenshot shows the **Add virtual network link** pane for linking the virtual network to the DNS zone.

   :::image type="content" source="media/private-endpoint-vault-backup-server/add-virtual-network-link.png" alt-text="Screenshot shows how to add virtual network links to DNS zones configuration.":::

### Configure custom DNS servers or host files

- If you're using a custom DNS server, you can use conditional forwarder for backup service, blob, and queue FQDNs to redirect the DNS requests to Azure DNS (168.63.129.16). Azure DNS redirects it to Azure Private DNS zone. In such setup, ensure that a virtual network link for Azure Private DNS zone exists as mentioned in [this article](/azure/backup/private-endpoints#when-using-custom-dns-server-or-host-files).

The following table lists the Azure Private DNS zones required by Azure Backup:

| Service | Zone name |
|---------|-----------|
| Azure Backup | privatelink.\<geo\>.backup.windowsazure.com |
| Azure Blobs | privatelink.blob.core.windows.net |
| Azure Queues | privatelink.queue.core.windows.net |

 In the zone name, `\<geo\>` refers to the region code (for example, **`eus`** for East US and **`ne`** for North Europe). Learn about the supported geography for the following regions:

- [**All public clouds**](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)

- [**China**](/azure/china/resources-developer-guide#check-endpoints-in-azure)

- [**Germany**](/azure/germany/germany-developer-guide#endpoint-mapping)

- [**US Gov**](/azure/azure-government/documentation-government-developer-guide)

- [**Geo-code list - sample XML**](./scripts/geo-code-list.md)


For custom DNS servers, [add the private endpoint DNS records to your DNS servers or host file ](/microsoft-365/admin/dns/create-dns-records-using-windows-based-dns?view=o365-worldwide&preserve-view=true)if Azure Private DNS zone isn’t configured. If you're using a host file for name resolution, make corresponding entries in the host file for each IP and FQDN according to the format - `\<private ip\>\<space\>\<FQDN\>`.

 Azure Backup allocates new storage account for the vault you created with private endpoint to store the backup data. The MARS agent accesses the respective endpoints to perform backup and restore operations. Learn [how to use private endpoints for backup](/azure/backup/backup-azure-private-endpoints-configure-manage#use-private-endpoints-for-backup) to add more DNS records after registration and backup.

## Back up on-premises resources using MABS with private endpoints

When you use the MARS Agent for backup, ensure your on-premises network is peered with the Azure virtual network that hosts the vault’s private endpoint. You can then continue to install the MARS agent and configure backup that allows  the MARS agent to  store backup data in the vault through private endpoints. However, you must ensure all communication for backup happens through the peered network only.

1. [Register your MABS Server to the vault](register-public-access-vault-backup-server.md#register-the-mabs-server-with-vault) you created with private endpoints.

1. [Enable backup on MABS Server for disk and online](back-up-file-data.md#back-up-file-data-with-mabs-1).

   :::image type="content" source="media/private-endpoint-vault-backup-server/backup-configuration-backup-server-protection.png" alt-text="Screenshot shows the backup configuration on MABS server for disk and online protection." lightbox="media/private-endpoint-vault-backup-server/backup-configuration-backup-server-protection.png":::

   After the registration, wait for the Initial Replica to complete. The online backup operation starts as per the schedule, or you can manually trigger backups for your data sources.

   :::image type="content" source="media/private-endpoint-vault-backup-server/online-backup-schedule-manual-options.png" alt-text="Screenshot shows the online backup schedule and manual backup options for data sources." lightbox="media/private-endpoint-vault-backup-server/online-backup-schedule-manual-options.png":::

   :::image type="content" source="media/private-endpoint-vault-backup-server/online-backup-completion-status.png" alt-text="Screenshot shows the online backup completion status and progress information." lightbox="media/private-endpoint-vault-backup-server/online-backup-completion-status.png":::

   The storage account starts creating a Blob container for each protected data source in the Azure portal. This container allows the MABS server to connect to the vault through private endpoints and perform backups.

   :::image type="content" source="media/private-endpoint-vault-backup-server/storage-accounts-created.png" alt-text="Screenshot shows the created storage accounts in Azure portal for protected data sources." lightbox="media/private-endpoint-vault-backup-server/storage-accounts-created.png":::

## Next steps

- [Reregister the MABS server with Recovery Services vault using public access](register-public-access-vault-backup-server.md).

## Related content

- [About private endpoints (v1 experience) for Azure Backup](private-endpoints-overview.md).
- [About private endpoints (v2 experience) for Azure Backup](backup-azure-private-endpoints-concept.md).
- [Configure private endpoint in Azure Backup vaults for backup using DPM server](/system-center/dpm/private-endpoint-configure-vault-backup-server?view=sc-dpm-2025&preserve-view=true).
- [Reregister the DPM server with Recovery Services vault using public access](/system-center/dpm/register-public-access-vault-backup-server?view=sc-dpm-2025&preserve-view=true).
