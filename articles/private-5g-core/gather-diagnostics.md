---
title: Gather remote diagnostics
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to gather remote diagnostics for a site using the Azure portal. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/09/2022
ms.custom: template-how-to
---

# Gather diagnostics using the Azure portal

> [!IMPORTANT]
> Diagnostics packages may contain information from your site which may, depending on use, include data such as personal data, customer data, and system-generated logs. During this procedure, when providing the diagnostics package's *shared access signature* (SAS) URL to Azure support, you are explicitly giving Azure support permission to access the diagnostics package and any information that it contains. You should confirm that this is acceptable under your company's privacy policies and agreements.

In this how-to guide, you'll learn how to gather a remote diagnostics package for an Azure Private 5G Core (AP5GC) site using the Azure portal. The diagnostics package can be provided, as a shared access signature (SAS) URL, to AP5GC support to assist you with issues.

You should always collect diagnostics as soon as possible after encountering an issue and submit them with any support request. [How to open a support request for Azure Private 5G Core](open-support-request.md).

## Prerequisites

You must already have an AP5GC site deployed to collect diagnostics.

## Collect values for diagnostics package gathering

1. [Create a storage account](../storage/common/storage-account-create.md) for diagnostics with the following additional configuration:
    1. In the **Advanced** tab, select **Enable storage account key access**. This will allow your support representative to download traces stored in this account using the URLs you share with them.
    1. In the **Data protection** tab, under **Access control**, select **Enable version-level immutability support**. This will allow you to specify a time-based retention policy for the account in the next step.
    1. If you would like the content of your storage account to be automatically deleted after a period of time, [configure a default time-based retention policy](../storage/blobs/immutable-policy-configure-version-scope.md#configure-a-default-time-based-retention-policy) for your storage account.
    1. [Create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) for your diagnostics.
    1. Make a note of the **Container blob** URL. For example:  
    `https://storageaccountname.blob.core.windows.net/diagscontainername`  
        1. Navigate to your **Storage account**.
        1. Select the **...** symbol on the right side of the container blob that you want to use for diagnostics collection.
        1. Select **Container properties** in the context menu.
        1. Copy the contents of the **URL** field in the **Container properties** view.
1. Create a [User-assigned identity](../active-directory/managed-identities-azure-resources/overview.md) and assign it to the storage account created above with the **Storage Blob Data Contributor** role.  
    > [!TIP]
    > Make sure the same User-assigned identity is used during site creation.
1. Navigate to the **Packet core control plane** resource for the site.
1. Select **Identity** under **Settings** on the left side menu.
1. Toggle **Modify user assigned managed identity?** to **Yes** and select **+ Add**.
1. In the **Add user assigned managed identity** select the user-signed managed identity you created.
1. Select **Add**.
1. Select **Next**.
1. Select **Create**.

## Gather diagnostics for a site

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to the **Packet Core Control Pane** overview page of the site you want to gather diagnostics for.
1. Select **Diagnostics Collection** under the **Support + Troubleshooting** section on the left side. This will open a **Diagnostics Collection** view.
1. Enter the **Container URL** that was configured for diagnostics storage and append the file name that you want to give the diagnostics. For example:  
    `https://storageaccountname.blob.core.windows.net/diagscontainername/diagsPackageName.zip`  
    > [!TIP]
    > The **Container URL** should have been noted during creation. If it wasn't:
    >
    >    1. Navigate to your **Storage account**.
    >    1. Select the **...** symbol on the right side of the container blob that you want to use for diagnostics collection.
    >    1. Select **Container properties** in the context menu.
    >    1. Copy the contents of the **URL** field in the **Container properties** view.

1. Select **Diagnostics collection**.
1. AP5GC online service will generate a package and upload it to the provided storage account URL. Once AP5GC reports that the upload has succeeded, report the SAS URL to Azure support.
    1. Generate a SAS URL by selecting **Generate SAS** on the blob details blade.
    1. Copy the contents of the **Blob SAS URL** field and share the URL with your support representative. See [How to open a support request for Azure Private 5G Core](open-support-request.md).
1. Azure support will access the diagnostics using the provided SAS URL and provide support based on the information.

## Troubleshooting

- If diagnostics file collection fails, an activity log will appear in the portal allowing you to troubleshoot via ARM:
  - If an invalid container URL was passed, the request will be rejected and report **400 Bad Request**. Repeat the process with the correct container URL.
  - If the asynchronous part of the operation fails, the asynchronous operation resource is set to **Failed** and reports a failure reason.
- Additionally, check that the same user-assigned identity was added to both the site and storage account.
- If this does not resolve the issue, share the correlation ID of the failed request with AP5GC support for investigation. See [How to open a support request for Azure Private 5G Core](open-support-request.md).

## Next steps

To continue to monitor your 5G core:

- [Monitor Azure Private 5G Core with Azure Monitor platform metrics](monitor-private-5g-core-with-platform-metrics.md)
- [Monitor Azure Private 5G Core with packet core dashboards](packet-core-dashboards.md)