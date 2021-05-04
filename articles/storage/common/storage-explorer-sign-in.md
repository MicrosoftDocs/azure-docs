---
title: Sign in to Azure Storage Explorer | Microsoft Docs
description: Documentation on signing into Azure Storage Explorer
services: storage
author: MRayermannMSFT
ms.service: storage
ms.topic: article
ms.date: 04/01/2021
ms.author: chuye
---

# Sign in to Storage Explorer

Sign-in is the recommended way to access your Azure storage resources with Storage Explorer. By signing in you take advantage of Azure AD backed permissions, such as RBAC and Gen2 POSIX ACLs. 

## How to sign in

To sign in to Storage Explorer, open the **Connect dialog**. You can open the **Connect dialog** either from the left-hand vertical toolbar, or by clicking on **Add account...** on the **Account Panel**.

Once you have the dialog open, choose **Subscription** as the type of resource you want to connect to and click **Next**.

You now need to choose what Azure environment you want to sign into. You can pick from any of the known environments, such as Azure or Azure China, or you can add your own environment. Once you have your environment selected, click **Next**.

At this point, your OS' **default web browser** will launch and a sign-in page will be opened. For best results, leave this browser window open as long as you're using Storage Explorer or at least until you've performed all expected MFA. When you have finished signing in, you can return to Storage Explorer.

## Managing accounts

You can manage and remove Azure accounts that you've signed into from the **Account Panel**. You can open the **Account Panel** by clicking on the **Manage Accounts** button on the left-hand vertical toolbar.

In the **Account Panel** you'll see any accounts that you have signed into. Under each account will be:
- The tenants the account belongs to
- For each tenant, the subscriptions you have access to

By default, Storage Explorer only signs you into your home tenant. If you want to view subscriptions and resources from another tenant, you'll need to activate that tenant. To activate a tenant, check the checkbox next to it. Once you're done working with a tenant, you can uncheck its checkbox to deactivate it. You cannot deactivate your home tenant.

After activating a tenant, you may need to reenter your credentials before Storage Explorer can load subscriptions or access resources from the tenant. Having to reenter your credentials usually happens because of a conditional access (CA) policy such as multi-factor authentication (MFA). And even though you may have already performed MFA for another tenant, you might still have to do it again. To reenter your credentials, simply click on **Reenter credentials...**. You can also click on **Error details...** to see exactly why subscriptions failed to load.

Once your subscriptions have loaded, you can choose which ones you want to filter in/out by checking or unchecking their checkboxes.

If you want to remove your entire Azure account, then click on the **Remove** next to the account.

## Changing where sign-in happens

By default sign-in will happen in your OS' **default web browser**. Signing-in with your default web browser streamlines how you access resources secured via CA policies, such as MFA. If for some reason signing in with your OS' **default web browser** isn't working, you can change where or how Storage Explorer performs sign-in.

Under **Settings (gear icon on the left)** > **Application** > **Sign-in**, look for the **Sign in with** setting. There are three options:
- **Default Web Browser**: sign-in will happen in your OS' **default web browser**. This option is recommended.
- **Integrated Sign-In**: sign-in will happen in a Storage Explorer window. This option may be useful if you're trying to log in with multiple Microsoft accounts (MSAs) at once. You may have issues with some CA policies if you choose this option.
- **Device Code Flow**: Storage Explorer will give you a code to enter into a browser window. This option isn't recommended. Device code flow isn't compatible with many CA policies.

## Troubleshooting sign-in issues

If you're having trouble signing in, or are having issues with an Azure account after signing in, refer to the [sign in section of the Storage Explorer troubleshooting guide](./storage-explorer-troubleshooting.md#sign-in-issues).

## Next steps

* [Manage Azure Blob storage resources with Storage Explorer](../../vs-azure-tools-storage-explorer-blobs.md)
* [Troubleshoot sign in issues](./storage-explorer-troubleshooting.md#sign-in-issues)
