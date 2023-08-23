---
title: How to create and manage private endpoints (with v2 experience) for Azure Backup
description: This article explains how to configure and manage private endpoints for Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 07/27/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create and use private endpoints (v2 experience) for Azure Backup

Azure Backup allows you to securely perform the backup and restore operations of your data from the Recovery Services vaults using [private endpoints](../private-link/private-endpoint-overview.md). Private endpoints use one or more private IP addresses from your Azure Virtual Network (VNet), effectively bringing the service into your VNet.

Azure Backup now provides an enhanced experience in creation and use of private endpoints compared to the [classic experience](private-endpoints-overview.md) (v1).

This article describes how to create and manage private endpoints for Azure Backup in the Recovery Services vault.

## Create a Recovery Services vault

You can create private endpoints for Azure Backup only for Recovery Services vaults that don't have any items protected to  it (or haven't had any items attempted to be protected or registered to them in the past). So, we recommend you create a new vault for private endpoint configuration. 

For more information on creating a new vault, see [Create and configure a Recovery Services vault](backup-create-rs-vault.md). However, if you have existing vaults that already have private endpoints created, you can recreate private endpoints for them using the enhanced experience. 

## Deny public network access to the vault

You can configure your vaults to deny access from public networks.

Follow these steps:

1. Go to the *vault* > **Networking**.

2. On the **Public access** tab, select **Deny** to prevent access from public networks.

   :::image type="content" source="./media/backup-azure-private-endpoints/deny-public-network.png" alt-text="Screenshot showing how to select the Deny option.":::

   >[!Note]
   >- Once you deny access, you can still access the vault, but you can't move data to/from networks that don't contain private endpoints. For more information, see [Create private endpoints for Azure Backup](#create-private-endpoints-for-azure-backup).
   >- Denial of public access is currently not supported for vaults that have *Cross Region Restore* enabled.

3. Select **Apply** to save the changes. 

## Create private endpoints for Azure Backup

To create private endpoints for Azure Backup, follow these steps:

1. Go to the **\vault* for which you want to create private endpoints >  **Networking**.
2. Go to the **Private access** tab and select **+Private endpoint** to start creating a new private endpoint.

   :::image type="content" source="./media/backup-azure-private-endpoints/start-new-private-endpoint-creation.png" alt-text="Screenshot showing how to start creating a new private endpoint.":::

3. On **Create a private endpoint**, provide the required details:

   a. **Basics**: Provide the basic details for your private endpoints. The region should be the same as the vault and the resource to be backed-up.
  
      :::image type="content" source="./media/backup-azure-private-endpoints/create-a-private-endpoint.png" alt-text="Screenshot showing the Create a private endpoint page to enter details for endpoint creation.":::

   b. **Resource**: On this tab, select the PaaS resource for which you want to create your connection, and then select **Microsoft.RecoveryServices/vaults** from the resource type for your required subscription. Once done, choose the name of your Recovery Services vault as the **Resource** and **AzureBackup** as the Target subresource.

   c. **Virtual network**: On this tab, specify the virtual network and subnet where you want the private endpoint to be created. This is the VNet where the VM is present.

   d. **DNS**: To connect privately, you need the required DNS records. Based on your network setup, you can choose one of the following:
      - Integrate your private endpoint with a private DNS zone: Select Yes if you want to integrate.
      - Use your custom DNS server: Select No if you want to use your own DNS server.
   e. **Tags**: Optionally, you can add *Tags* for your private endpoint.
4. Select **Review + create**.
5. When the validation is complete, select **Create** to create the private endpoint.

## Approve private endpoints

If you're creating the private endpoint as the owner of the Recovery Services vault, the private endpoint you created is auto-approved. Otherwise, the owner of the vault must approve the private endpoint before using it. 

To manually approve private endpoints via the Azure portal, follow these steps:

1. In your **Recovery Services vault**, go to **Private endpoint connections** on the left pane.
2. Select the *private endpoint connection* that you want to approve.
3. Select **Approve**.

   :::image type="content" source="./media/backup-azure-private-endpoints/select-private-endpoint-connection-for-approval.png" alt-text="Screenshot showing how to select and approve a private endpoint.":::

   You can also select Reject or Remove if you want to reject or delete the endpoint connection.

Learn how to [manually approve private endpoints using the Azure Resource Manager Client](private-endpoints.md#manual-approval-of-private-endpoints-using-the-azure-resource-manager-client) to use the Azure Resource Manager client for approving private endpoints.

## Manage DNS records

You need the required DNS records in your private DNS zones or servers to connect privately. You can either integrate your private endpoint directly with Azure private DNS zones, or use your custom DNS servers to achieve this, based on your network preferences. This needs to be done for all three services - Azure Backup, Azure Blobs, and Queues.

### When you integrate private endpoints with Azure private DNS zones

If you choose to integrate your private endpoint with private DNS zones, Azure Backup will add the required DNS records. You can view the private DNS zones used under DNS configuration of the private endpoint. If these DNS zones aren't present, they'll be created automatically during the creation of the private endpoint. 

However, you must verify that your virtual network (which contains the resources to be backed-up) is properly linked to all three private DNS zones, as described below.

>[!Note]
>If you're using proxy servers, you can choose to bypass the proxy server or perform your backups through the proxy server. To bypass a proxy server, continue to the following sections. To use the proxy server for performing your backups, see [proxy server setup details for Recovery Services vault](private-endpoints.md#set-up-proxy-server-for-recovery-services-vault-with-private-endpoint).

### Validate virtual network links in private DNS zones

For each private DNS zone listed (for Azure Backup, Blobs and Queues), go to the respective **Virtual network links**.

You'll see an entry for the virtual network for which you've created the private endpoint. If you don't see an entry, add a virtual network link to all those DNS zones that don't have them.

### When using custom DNS server or host files

- If you're using a custom DNS server, you can use conditional forwarder for backup service, blob, and queue FQDNs to redirect the DNS requests to Azure DNS (168.63.129.16). Azure DNS redirects it to Azure Private DNS zone. In such setup, ensure that a virtual network link for Azure Private DNS zone exists as mentioned in [this article](private-endpoints.md#when-using-custom-dns-server-or-host-files).

  The following table lists the Azure Private DNS zones required by Azure Backup:

  |Zone |Service |
  |--- |--- |
  |`*.privatelink.<geo>.backup.windowsazure.com` |Backup  |
  |`*.blob.core.windows.net`                     |Blob    |
  |`*.queue.core.windows.net`                    |Queue   |
  |`*.storage.azure.net`                         |Blob    |

  >[!NOTE]
  > In the above text, `<geo>` refers to the region code (for example *eus* and *ne* for East US and North Europe respectively). Refer to the following lists for regions codes:
  >
  > - [All public clouds](https://download.microsoft.com/download/1/2/6/126a410b-0e06-45ed-b2df-84f353034fa1/AzureRegionCodesList.docx)
  > - [China](/azure/china/resources-developer-guide#check-endpoints-in-azure)
  > - [Germany](../germany/germany-developer-guide.md#endpoint-mapping)
  > - [US Gov](../azure-government/documentation-government-developer-guide.md)
  > - [Geo-code list - sample XML](scripts/geo-code-list.md)

- If you're using custom DNS servers or host files and don't have the Azure Private DNS zone setup, you need to add the DNS records required by the private endpoints to your DNS servers or in the host file.

  Navigate to the private endpoint you created, and then go to **DNS configuration**. Then add an entry for each FQDN and IP displayed as *Type A* records in your DNS.
  
    If you're using a host file for name resolution, make corresponding entries in the host file for each IP and FQDN according to the format - `<private ip><space><FQDN>`.

>[!Note]
>Azure Backup may allocate new storage account for your vault for the backup data, and the extension or agent needs to access the respective endpoints. For more about how to add more DNS records after registration and backup, see [how to use private endpoints for backup](#use-private-endpoints-for-backup).

## Use private endpoints for backup

Once the private endpoints created for the vault in your VNet have been approved, you can start using them for performing your backups and restores.

>[!IMPORTANT]
>Ensure that you've completed all the steps mentioned above in the document successfully before proceeding. To recap, you must have completed the steps in the following checklist:
>
>1. Created a (new) Recovery Services vault
>2. Enabled the vault to use system assigned Managed Identity
>3. Assigned relevant permissions to the Managed Identity of the vault
>4. Created a Private Endpoint for your vault
>5. Approved the Private Endpoint (if not auto approved)
>6. Ensured all DNS records are appropriately added (except blob and queue records for custom servers, which will be discussed in the following sections)

### Check VM connectivity

In the VM, in the locked down network, ensure the following:

1. The VM should have access to Azure AD.
2. Execute **nslookup** on the backup URL (`xxxxxxxx.privatelink.<geo>.backup.windowsazure.com`) from your VM, to ensure connectivity. This should return the private IP assigned in your virtual network.

### Configure backup

Once you ensure the above checklist and access to have been successfully completed, you can continue to configure backup of workloads to the vault. If you're using a custom DNS server, you'll need to add DNS entries for blobs and queues that are available after configuring the first backup.

#### DNS records for blobs and queues (only for custom DNS servers/host files) after the first registration

After you have configured backup for at least one resource on a private endpoint enabled vault, add the required DNS records for blobs and queues as described below.

1. Navigate to each of these private endpoints created for the vault and go to **DNS configuration**.
1. Add an entry for each FQDN and IP displayed as *Type A* records in your DNS.

   If you're using a host file for name resolution, make corresponding entries in the host file for each IP and FQDN according to the format - `<private ip><space><FQDN>`.

   In addition to the above, there's another entry needed after the first backup, which is [discussed here](private-endpoints.md#dns-records-for-blobs-only-for-custom-dns-servershost-files-after-the-first-backup).

### Backup and restore of workloads in Azure VM (SQL and SAP HANA)

Once the private endpoint is created and approved, no other changes are required from the client side to use the private endpoint (unless you're using SQL Availability Groups, which we discuss later in this section). All communication and data transfer from your secured network to the vault will be performed through the private endpoint. However, if you remove private endpoints for the vault after a server (SQL or SAP HANA) has been registered to it, you'll need to re-register the container with the vault. You don't need to stop protection for them.

#### DNS records for blobs (only for custom DNS servers/host files) after the first backup

After you run the first backup and you're using a custom DNS server (without conditional forwarding), it's likely that your backup will fail. If that happens:

1. Navigate to the private endpoint created for the vault and go to **DNS configuration**.
1. Add an entry for each FQDN and IP displayed as *Type A* records in your DNS. 

   If you're using a host file for name resolution, make corresponding entries in the host file for each IP and FQDN according to the format - `<private ip><space><FQDN>`.

>[!NOTE]
>At this point, you should be able to run **nslookup** from the VM and resolve to private IP addresses when done on the vault’s Backup and Storage URLs.

### When using SQL Availability Groups

When using SQL Availability Groups (AG), you'll need to provision conditional forwarding in the custom AG DNS as described below:

1. Sign in to your domain controller.
1. Under the DNS application, add conditional forwarders for all three DNS zones (Backup, Blobs, and Queues) to the host IP 168.63.129.16 or  the custom DNS server IP address, as necessary. The following screenshots show when you're forwarding to the Azure host IP. If you're using your own DNS server, replace with the IP of your DNS server.

### Back up and restore through MARS agent and DPM server

When using the MARS Agent to back up your on-premises resources, make sure your on-premises network (containing your resources to be backed up) is peered with the Azure VNet that contains a private endpoint for the vault, so you can use it. You can then continue to install the MARS agent and configure backup as detailed here. However, you must ensure all communication for backup happens through the peered network only.

But if you remove private endpoints for the vault after a MARS agent has been registered to it, you'll need to re-register the container with the vault. You don't need to stop protection for them.

>[!NOTE]
> - Private endpoints are supported with only DPM server 2022 and later.
> - Private endpoints are not yet supported with MABS.

## Deleting private endpoints

To delete private endpoints using REST API, see [this section](/rest/api/virtualnetwork/privateendpoints/delete).

## Next steps

- Learn [about private endpoint for Azure Backup](backup-azure-private-endpoints-concept.md).