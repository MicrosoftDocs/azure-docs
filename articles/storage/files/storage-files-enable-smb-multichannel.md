---
title: Enable SMB multichannel
description: Example text
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 09/04/2020
ms.author: rogarana
ms.subservice: files
---

# Enable SMB multichannel on Azure premium file shares (preview) 

SMB multichannel (preview) increases the performance from an SMB client by establishing multiple network connection to your file shares.  This article provides step-by-step guidance to enable SMB multichannel on an existing storage account. For conceptual information on SMB multichannel, see SMB Multichannel performance.

## Restrictions

- Only available for SMB shares in FileStorage accounts.
- Must be SMB 3.x or higher.

### Regional availability

SMB Multichannel for premium file shares is in public preview and is available in a subset of Azure regions. Please check region availability section in SMB Multichannel performance article.

## Prerequisites

[Create a FileStorage account](storage-how-to-create-premium-fileshare.md).

## Getting started

Open a shell and sign into your Azure subscription. From there, you can register register for the SMB Multichannel preview with the following commands.

> [!NOTE]
> Registration may take up to an hour.

```azurepowershell
Connect-AzAccount
# Setting your active subscription to the one you want to register for the preview. 
# Replace the <subscription-id> placeholder with your subscription id. 
$context = Get-AzSubscription -SubscriptionId <your-subscription-id> 
Set-AzContext $context

Register-AzProviderFeature -FeatureName AllowSMBMultichannel -ProviderNamespace Microsoft.Storage 
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage 
```

### Verify that feature registration is complete

Since it may take up to an hour to enable the feature on your storage account, you may want to use the following command to validate that it is registered for your subscription:

```azurepowershell
Get-AzProviderFeature -FeatureName AllowSMBMultichannel -ProviderNamespace Microsoft.Storage
```


## Enable SMB Multichannel 

1. Sign into the Azure portal and navigate to the FileStorage storage account you want to enable SMB multichannel on.
1. Select **File shares** then select **File share settings**.
1. Toggle **SMB Multichannel** to on and select **save**.

Enabling SMB multichannel will apply the affect to every file share inside the storage account. You will need to remount the share on your client for the changes to take effect, though.

:::image type="content" source="media/storage-files-enable-smb-multichannel/enable-smb-multichannel-on-storage-account.png" alt-text="Screenshot of storage account, smb multichannel is toggled on.":::

## Next steps 

To take advantage of SMB multichannel, [mount your file share again](storage-how-to-use-files-windows.md).