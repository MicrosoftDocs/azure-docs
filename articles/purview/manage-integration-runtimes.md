---
title: Create and manage Integration Runtimes
description: This article explains the steps to create and manage Integration Runtimes in Azure Purview.
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 02/03/2021
---

# Create and manage a self-hosted integration runtime

This article describes how to create and manage a self-hosted integration runtime (SHIR) that let's you scan data sources in Azure Purview.

> [!NOTE]
> The Purview Integration Runtime cannot be shared with an Azure Synapse Analytics or Azure Data Factory Integration Runtime on the same machine. It needs to be installed on a separated machine.

> [!IMPORTANT]
> If you have created your Azure Purview account after 18th August 2021, make sure you download and install the latest version of self-hosted integration runtime from [Microsoft download center](https://www.microsoft.com/download/details.aspx?id=39717).

## Create a self-hosted integration runtime

1. On the home page of Purview Studio, select **Management Center** from the left navigation pane.

2. Under **Sources and scanning** on the left pane, select **Integration runtimes**, and then select **+ New**.

   :::image type="content" source="media/manage-integration-runtimes/select-integration-runtimes.png" alt-text="Click on IR.":::

3. On the **Integration runtime setup** page, select **Self-Hosted** to create a Self-Hosted IR, and then select **Continue**.

   :::image type="content" source="media/manage-integration-runtimes/select-self-hosted-ir.png" alt-text="Create new SHIR.":::

4. Enter a name for your IR, and select Create.

5. On the **Integration Runtime settings** page, follow the steps under the **Manual setup** section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.

   :::image type="content" source="media/manage-integration-runtimes/integration-runtime-settings.png" alt-text="get key":::

   - Copy and paste the authentication key.

   - Download the self-hosted integration runtime from [Microsoft Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer. Self-hosted integration runtime versions such as 5.4.7803.1 and 5.6.7795.1 are supported. 

   - On the **Register Integration Runtime (Self-hosted)** page, paste one of the two keys you saved earlier, and select **Register**.

     :::image type="content" source="media/manage-integration-runtimes/register-integration-runtime.png" alt-text="input key.":::

   - On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**.

6. After the Self-hosted integration runtime is registered successfully, you see the following window:

   :::image type="content" source="media/manage-integration-runtimes/successfully-registered.png" alt-text="successfully registered.":::

## Networking requirements

Your self-hosted integration runtime machine will need to connect to several resources to work correctly:

* The sources you want to scan using the self-hosted integration runtime.
* Any Azure Key Vault used to store credentials for the Purview resource.
* The managed Storage account and Event Hub resources created by Purview.

The managed Storage and Event Hub resources can be found in your subscription under a resource group containing the name of your Purview resource. Azure Purview uses these resources to ingest the results of the scan, among many other things, so the self-hosted integration runtime will need to be able to connect directly with these resources.

Here are the domains and ports that will need to be allowed through corporate and machine firewalls.

> [!NOTE]
> For domains listed with '\<managed Purview storage account>', you will add the name of the managed storage account associated with your Purview resource. You can find this resource in the Portal. Search your Resource Groups for a group named: managed-rg-\<your Purview Resource name>. For example: managed-rg-contosoPurview. You will use the name of the storage account in this resource group.
> 
> For domains listed with '\<managed Event Hub resource>', you will add the name of the managed Event Hub associated with your Purview resource. You can find this in the same Resource Group as the managed storage account.

| Domain names                  | Outbound ports | Description                              |
| ----------------------------- | -------------- | ---------------------------------------- |
| `*.servicebus.windows.net` | 443            | Global infrastructure Purview uses to run its scans. Wildcard required as there is no dedicated resource. |
| `<managed Event Hub resource>.servicebus.windows.net` | 443            | Purview uses this to connect with the associated service bus. It will be covered by allowing the above domain, but if you are using Private Endpoints, you will need to test access to this single domain.|
| `*.frontend.clouddatahub.net` | 443            | Global infrastructure Purview uses to run its scans. Wildcard required as there is no dedicated resource. |
| `<managed Purview storage account>.core.windows.net`          | 443            | Used by the self-hosted integration runtime to connect to the managed Azure storage account.|
| `<managed Purview storage account>.queue.core.windows.net` | 443            | Queues used by purview to run the scan process. |
| `<your Key Vault Name>.vault.azure.net` | 443           | Required if any credentials are stored in Azure Key Vault. |
| `download.microsoft.com` | 443           | Optional for SHIR updates. |
| Various Domains | Dependant          | Domains for any other sources the SHIR will connect to. |
  
  
> [!IMPORTANT]
> In most environments, you will also need to confirm that your DNS is correctly configured. To confirm you can use **nslookup** from your SHIR machine to check connectivity to each of the above domains. Each nslookup should return the the IP of the resource. If you are using [Private Endpoints](catalog-private-link.md), the private IP should be returned and not the Public IP. If no IP is returned, or if when using Private Endpoints the public IP is returned, you will need to address your DNS/VNET association, or your Private Endpoint/VNET peering.

## Manage a self-hosted integration runtime

You can edit a self-hosted integration runtime by navigating to **Integration runtimes** in the **Management center**, selecting the IR and then clicking on edit. You can now update the description, copy the key, or regenerate new keys.

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime.png" alt-text="edit IR.":::

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime-settings.png" alt-text="edit IR details.":::

You can delete a self-hosted integration runtime by navigating to **Integration runtimes** in the Management center, selecting the IR and then clicking on **Delete**. Once an IR is deleted, any ongoing scans relying on it will fail.

## Next steps

[How scans detect deleted assets](concept-detect-deleted-assets.md)
