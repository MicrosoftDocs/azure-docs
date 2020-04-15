---
title: Azure Multi-Factor Auth Providers - Azure Active Directory
description: When should you use an Auth Provider with Azure MFA?

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/21/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# When to use an Azure Multi-Factor Authentication Provider

> [!IMPORTANT]
> Effective September 1st, 2018 new auth providers may no longer be created. Existing auth providers may continue to be used and updated, but migration is no longer possible. Multi-factor authentication will continue to be available as a feature in Azure AD Premium licenses.

Two-step verification is available by default for global administrators who have Azure Active Directory, and Office 365 users. However, if you wish to take advantage of [advanced features](howto-mfa-mfasettings.md) then you should purchase the full version of Azure Multi-Factor Authentication (MFA).

An Azure Multi-Factor Auth Provider is used to take advantage of features provided by Azure Multi-Factor Authentication for users who **do not have licenses**.

## Caveats related to the Azure MFA SDK

Note the SDK has been deprecated and will only continue to work until November 14, 2018. After that time, calls to the SDK will fail.

## What is an MFA Provider?

There are two types of Auth providers, and the distinction is around how your Azure subscription is charged. The per-authentication option calculates the number of authentications performed against your tenant in a month. This option is best if you have a number of users authenticating only occasionally. The per-user option calculates the number of individuals in your tenant who perform two-step verification in a month. This option is best if you have some users with licenses but need to extend MFA to more users beyond your licensing limits.

## Manage your MFA Provider

You cannot change the usage model (per enabled user or per authentication) after an MFA provider is created.

If you purchased enough licenses to cover all users that are enabled for MFA, you can delete the MFA provider altogether.

If your MFA provider is not linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings and configuration options are not transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the MFA Provider.

### Removing an authentication provider

> [!CAUTION]
> There is no confirmation when deleting an authentication provider. Selecting **Delete** is a permanent process.

Authentication providers can be found in the **Azure portal** > **Azure Active Directory** > **Security** > **MFA** > **Providers**. Click on listed providers to see details and configurations associated with that provider.

Before removing an authentication provider, take note of any customized settings configured in your provider. Decide what settings need to be migrated to general MFA settings from your provider and complete the migration of those settings. 

Azure MFA Servers linked to providers will need to be reactivated using credentials generated under **Azure portal** > **Azure Active Directory** > **Security** > **MFA** > **Server settings**. Before reactivating, the following files must be deleted from the `\Program Files\Multi-Factor Authentication Server\Data\` directory on Azure MFA Servers in your environment:

- caCert
- cert
- groupCACert
- groupKey
- groupName
- licenseKey
- pkey

![Delete an auth provider from the Azure portal](./media/concept-mfa-authprovider/authentication-provider-removal.png)

When you have confirmed that all settings have been migrated, you can browse to the **Azure portal** > **Azure Active Directory** > **Security** > **MFA** > **Providers** and select the ellipses **...** and select **Delete**.

> [!WARNING]
> Deleting an authentication provider will delete any reporting information associated with that provider. You may want to save activity reports before deleting your provider.

> [!NOTE]
> Users with older versions of the Microsoft Authenticator app and Azure MFA Server may need to re-register their app.

## Next steps

[Configure Multi-Factor Authentication settings](howto-mfa-mfasettings.md)
