---
title: Sign in to Azure Storage Explorer
description: Documentation on signing into Azure Storage Explorer
services: storage
author: jinglouMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 04/01/2021
ms.author: jinglou
ms.reviewer: cralvord,richardgao
---

# Sign in to Storage Explorer

Sign-in is the recommended way to access your Azure storage resources with Storage Explorer. By signing in you take advantage of Microsoft Entra backed permissions, such as role based access control and Azure Data Lake Storage POSIX access control lists.

## How to sign in

To sign in to Storage Explorer, open the "Connect" dialog. You can open the dialog either from the left-hand vertical toolbar, or by clicking on **Add account...** on the **Account Panel**.

Once you have the dialog open, choose **Subscription** as the type of resource you want to connect to and select **Next**.

You now need to choose what Azure environment you want to sign into. You can pick from any of the known environments, such as Azure or Microsoft Azure operated by 21Vianet, or you can add your own environment. Once you have your environment selected, select **Next**.

At this point, your OS' **default web browser** launches and a sign-in page opens. For best results, leave this browser window open as long as you're using Storage Explorer or at least until completing all sign in steps. When you finish signing in, you can return to Storage Explorer.

## Managing accounts

You can manage and remove Azure accounts from the **Account Panel**. You can open the **Account Panel** by clicking on the **Manage Accounts** button on the left-hand vertical toolbar.

The **Account Panel** displays all accounts that you sign into. Each account has:
- The tenants the account belongs to
- The subscriptions under each tenant you have access to

By default, Storage Explorer only signs you into your home tenant. If you want to view subscriptions and resources from another tenant, you need to activate that tenant. To activate a tenant, check the checkbox next to it. Once you're done working with a tenant, you can uncheck its checkbox to deactivate it. You can't deactivate your home tenant.

After activating a tenant, you might need to reenter your credentials before Storage Explorer can load subscriptions or access resources from the tenant. Having to reenter your credentials usually happens because of a conditional access (CA) policy such as multifactor authentication (MFA). If you complete MFA for another tenant, you might still have to do it again. To reenter your credentials, select on **Reenter credentials...**. You can also select on **Error details...** to see exactly why subscriptions failed to load.

Once your subscriptions load, you can choose which ones you want to filter in/out by checking or unchecking their checkboxes.

If you want to remove your entire Azure account, then select on the **Remove** next to the account.

## Changing where sign-in happens

By default, sign-in occurs in the following ways:

- Windows: via your OS' **authentication broker**.
- macOS: via your OS' **default web browser**.
- Linux: via your OS' **default web browser**.

If the default doesn't work for you, then you can change where or how Storage Explorer performs sign-in.

Under **Settings** (gear icon in the vertical toolbar) > **Application** > **Sign-in**, look for the **Sign in with** setting. Options for sign in include:
- **Authentication Broker**: sign-in occurs via your OS' **authentication broker**. This option is recommended if you are on Windows.
- **Default Web Browser**: sign-in occurs via your OS' **default web browser**. This option is recommended if you are on macOS or Linux, or if you're having issues with the **authentication broker** option.
- **Integrated Sign-In**: sign-in occurs via a Storage Explorer window. This option can be useful if you're having issues using your **default web browser** to sign in.
- **Device Code Flow**: Storage Explorer provides a code to enter into a browser window. This option isn't recommended. Device code flow isn't compatible with many CA policies.

## Troubleshooting sign-in issues

If you're having trouble signing in, or are having issues with an Azure account after signing in, refer to the [sign in section of the Storage Explorer troubleshooting guide](./storage-explorer-troubleshooting.md#sign-in-issues).

## Next steps

- [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md)
- [Troubleshoot sign in issues](./storage-explorer-troubleshooting.md#sign-in-issues)
