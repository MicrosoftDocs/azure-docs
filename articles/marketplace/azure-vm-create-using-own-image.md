---
title: Create an Azure virtual machine offer on Azure Marketplace using your own image
description: Publish a virtual machine offer to Azure Marketplace using your own image.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: krsh
ms.author: krsh
ms.date: 07/22/2021
---

# Create a virtual machine using your own image

This article describes how to publish a virtual machine (VM) image that you built on your premises.

## Bring your image into Azure

Upload your VHD to an Azure shared image gallery.

1. On the Azure portal, search for **Shared image galleries**.
2. Create or use an existing shared image gallery. We suggest you create a separate Shared image gallery for images being published to Marketplace.
3. Create or use an existing image definition.
4. Select **Create a version**.
5. Choose the region and image version.
6. If your VHD is not yet uploaded to Azure portal, choose **Storage blobs (VHDs)** as the **Source**, then **Browse**. You can create a **storage account** and **storage container** if you haven’t created one before. Upload your VHD.
7. Select **Review + create**. Once validation finishes, select **Create**.

> [!TIP]
> Publisher account must have “Owner” access to publish the SIG Image. If required, follow the steps in the following section, **Set the right permissions**, to grant access.

## Set the right permissions

If your Partner Center account is the owner of the subscription hosting Shared Image Gallery, nothing further is needed for permissions.

If you only have read access to the subscription, use one of the following two options.

### Option one – Ask the owner to grant owner permission

Steps for the owner to grant owner permission:

1. Go to the Shared Image Gallery (SIG).
2. Select **Access control** (IAM) on the left panel.
3. Select **Add**, then **Add role assignment**.<br>
    :::image type="content" source="media/create-vm/add-role-assignment.png" alt-text="The add role assignment window is shown.":::
1. For **Role**, select **Owner**.
1. For **Assign access to**, select **User, group, or service principal**.
1. For **Select**, enter the Azure email of the person who will publish the image.
1. Select **Save**.

### Option Two – Run a command

Ask the owner to run either one of these commands (in either case, use the SusbscriptionId of the subscription where you created the Shared image gallery).

```azurecli
az login
az provider register --namespace Microsoft.PartnerCenterIngestion --subscription {subscriptionId}
```

```powershell
Connect-AzAccount
Select-AzSubscription -SubscriptionId {subscriptionId}
Register-AzResourceProvider -ProviderNamespace Microsoft.PartnerCenterIngestion
```

> [!NOTE]
> You don’t need to generate SAS URIs as you can now publish a Shared image gallery (SIG) Image on Partner  Center, without using APIs. <br/> <br/>If you *are* publishing using APIs, you would need to generate SAS URIs instead of using a SIG, see [How to generate a SAS URI for a VM image](azure-vm-get-sas-uri.md).

## Next steps

- [Test your VM image](azure-vm-image-test.md) to ensure it meets Azure Marketplace publishing requirements (optional).
- If you don't want to test your VM image, sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165935) and publish the SIG Image.
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-create-faq.yml).
