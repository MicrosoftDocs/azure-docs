---
title: Certificate-based authentication with federation
description: Learn how to configure certificate-based authentication with federation in your environment

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 05/04/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: annaba

ms.collection: M365-identity-device-management
---
# Get started with certificate-based authentication in Microsoft Entra ID with federation

Certificate-based authentication (CBA) with federation enables you to be authenticated by Microsoft Entra ID with a client certificate on a Windows, Android, or iOS device when connecting your Exchange online account to:

- Microsoft mobile applications such as Microsoft Outlook and Microsoft Word
- Exchange ActiveSync (EAS) clients

Configuring this feature eliminates the need to enter a username and password combination into certain mail and Microsoft Office applications on your mobile device.

>[!NOTE]
>As an alternative, organizations can deploy Microsoft Entra CBA without needing federation. For more information, see [Overview of Microsoft Entra certificate-based authentication against Microsoft Entra ID](concept-certificate-based-authentication.md).

This topic:

- Provides you with the steps to configure and utilize CBA for users of tenants in Office 365 Enterprise, Business, Education, and US Government plans. 
- Assumes that you already have a [public key infrastructure (PKI)](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831740(v=ws.11)) and [AD FS](../hybrid/connect/how-to-connect-fed-whatis.md) configured.

## Requirements

To configure CBA with federation, the following statements must be true:

- CBA with federation is only supported for Federated environments for browser applications, native clients using modern authentication, or MSAL libraries. The one exception is Exchange Active Sync (EAS) for Exchange Online (EXO), which can be used for federated and managed accounts. To configure Microsoft Entra CBA without needing federation, see [How to configure Microsoft Entra certificate-based authentication](how-to-certificate-based-authentication.md).
- The root certificate authority and any intermediate certificate authorities must be configured in Microsoft Entra ID.
- Each certificate authority must have a certificate revocation list (CRL) that can be referenced via an internet-facing URL.
- You must have at least one certificate authority configured in Microsoft Entra ID. You can find related steps in the [Configure the certificate authorities](#step-2-configure-the-certificate-authorities) section.
- For Exchange ActiveSync clients, the client certificate must have the user's routable email address in Exchange online in either the Principal Name or the RFC822 Name value of the Subject Alternative Name field. Microsoft Entra ID maps the RFC822 value to the Proxy Address attribute in the directory.
- Your client device must have access to at least one certificate authority that issues client certificates.
- A client certificate for client authentication must have been issued to your client.

>[!IMPORTANT]
>The maximum size of a CRL for Microsoft Entra ID to successfully download and cache is 20MB, and the time required to download the CRL must not exceed 10 seconds.  If Microsoft Entra ID can't download a CRL, certificate based authentications using certificates issued by the corresponding CA will fail. Best practices to ensure CRL files are within size constraints are to keep certificate lifetimes to within reasonable limits and to clean up expired certificates.

## Step 1: Select your device platform

As a first step, for the device platform you care about, you need to review the following:

- The Office mobile applications support
- The specific implementation requirements

The related information exists for the following device platforms:

- [Android](./certificate-based-authentication-federation-android.md)
- [iOS](./certificate-based-authentication-federation-ios.md)

## Step 2: Configure the certificate authorities

[!INCLUDE [Configure certificate authorities](../../../includes/active-directory-authentication-configure-certificate-authorities.md)]

### Connect

[!INCLUDE [Connect-AzureAD](../../../includes/active-directory-authentication-connect-azuread.md)]


### Retrieve

[!INCLUDE [Get-AzureAD](../../../includes/active-directory-authentication-get-trusted-azuread.md)]


### Add

[!INCLUDE [New-AzureAD](../../../includes/active-directory-authentication-new-trusted-azuread.md)]

### Remove

[!INCLUDE [Remove-AzureAD](../../../includes/active-directory-authentication-remove-trusted-azuread.md)]


### Modify

[!INCLUDE [Set-AzureAD](../../../includes/active-directory-authentication-set-trusted-azuread.md)]

## Step 3: Configure revocation

[!INCLUDE [Configure revocation](../../../includes/active-directory-authentication-configure-revocation.md)]


## Step 4: Test your configuration

### Testing your certificate

As a first configuration test, you should try to sign in to [Outlook Web Access](https://outlook.office365.com) or [SharePoint Online](https://microsoft.sharepoint.com) using your **on-device browser**.

If your sign-in is successful, then you know that:

- The user certificate has been provisioned to your test device
- AD FS is configured correctly

### Testing Office mobile applications

1. On your test device, install an Office mobile application (for example, OneDrive).
1. Launch the application.
1. Enter your username, and then select the user certificate you want to use.

You should be successfully signed in.

### Testing Exchange ActiveSync client applications

To access Exchange ActiveSync (EAS) via certificate-based authentication, an EAS profile containing the client certificate must be available to the application.

The EAS profile must contain the following information:

- The user certificate to be used for authentication

- The EAS endpoint (for example, outlook.office365.com)

An EAS profile can be configured and placed on the device through the utilization of Mobile device management (MDM) such as Microsoft Intune or by manually placing the certificate in the EAS profile on the device.

### Testing EAS client applications on Android

1. Configure an EAS profile in the application that satisfies the requirements in the prior section.
2. Open the application, and verify that mail is synchronizing.

## Next steps

[Additional information about certificate-based authentication on Android devices.](./certificate-based-authentication-federation-android.md)

[Additional information about certificate-based authentication on iOS devices.](./certificate-based-authentication-federation-ios.md)
