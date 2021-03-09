---
title: Microsoft Graph PowerShell SDK and Azure Active Directory Identity Protection
description: Learn how to query Microsoft Graph risk detections and associated information from Azure Active Directory

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 01/25/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahandle

ms.collection: M365-identity-device-management
---
# Azure Active Directory Identity Protection and the Microsoft Graph PowerShell SDK

Microsoft Graph is the Microsoft unified API endpoint and the home of [Azure Active Directory Identity Protection](./overview-identity-protection.md) APIs. This article will show you how to use the [Microsoft Graph PowerShell SDK](/graph/powershell/get-started) to get risky user details using PowerShell. Organizations that want to query the Microsoft Graph APIs directly can use the article, [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api) to begin that journey.


## Connect to Microsoft Graph

There are four steps to accessing Identity Protection data through Microsoft Graph:

- [Create a certificate](#create-a-certificate)
- [Create a new app registration](#create-a-new-app-registration)
- [Configure API permissions](#configure-api-permissions)
- [Configure a valid credential](#configure-a-valid-credential)

### Create a certificate

In a production environment you would use a certificate from your production Certificate Authority, but in this sample we will use a self-signed certificate. Create and export the certificate using the following PowerShell commands.

```powershell
$cert = New-SelfSignedCertificate -Subject "CN=MSGraph_ReportingAPI" -CertStoreLocation "Cert:\CurrentUser\My" -KeyExportPolicy Exportable -KeySpec Signature -KeyLength 2048 -KeyAlgorithm RSA -HashAlgorithm SHA256
Export-Certificate -Cert $cert -FilePath "C:\Reporting\MSGraph_ReportingAPI.cer"
```

### Create a new app registration

1. In the Azure portal, browse to **Azure Active Directory** > **App registrations**.
1. Select **New registration**.
1. On the **Create** page, perform the following steps:
   1. In the **Name** textbox, type a name for your application (for example: Azure AD Risk Detection API).
   1. Under **Supported account types**, select the type of accounts that will use the APIs.
   1. Select **Register**.
1. Take note of the **Application (client) ID** and **Directory (tenant) ID** as you will need these items later.

### Configure API permissions

In this example, we configure application permissions allowing this sample to be used unattended. If granting permissions to a user who will be logged on, choose delegated permissions instead. More information about different permission types can be found in the article, [Permissions and consent in the Microsoft identity platform](../develop/v2-permissions-and-consent.md#permission-types).

1. From the **Application** you created, select **API permissions**.
1. On the **Configured permissions** page, in the toolbar on the top, click **Add a permission**.
1. On the **Add API access** page, click **Select an API**.
1. On the **Select an API** page, select **Microsoft Graph**, and then click **Select**.
1. On the **Request API permissions** page: 
   1. Select **Application permissions**.
   1. Select the checkboxes next to `IdentityRiskEvent.Read.All` and `IdentityRiskyUser.Read.All`.
   1. Select **Add permissions**.
1. Select **Grant admin consent for domain** 

### Configure a valid credential

1. From the **Application** you created, select **Certificates & secrets**.
1. Under **certificates**, select **Upload certificate**.
   1. Select the previously exported certificate from the window that opens.
   1. Select **Add**.
1. Take note of the **Thumbprint** of the certificate as you will need this information in the next step.

## List risky users using PowerShell

To enable the ability to query Microsoft Graph, we need to install the `Microsoft.Graph` module in our PowerShell window, using the `Install-Module Microsoft.Graph` command.

Modify the following variables to include the information generated in the previous steps, then run them as a whole to get risky user details using PowerShell.

```powershell
$ClientID       = "<your client ID here>"        # Application (client) ID gathered when creating the app registration
$tenantdomain   = "<your tenant domain here>"    # Directory (tenant) ID gathered when creating the app registration
$Thumbprint     = "<your client secret here>"    # Certificate thumbprint gathered when configuring your credential

Select-MgProfile -Name "beta"
  
Connect-MgGraph -ClientId $ClientID -TenantId $tenantdomain -CertificateThumbprint $Thumbprint

Get-MgRiskyUser -All
```

## Next steps

- [Get started with the Microsoft Graph PowerShell SDK](/graph/powershell/get-started)
- [Tutorial: Identify and remediate risks using Microsoft Graph APIs](/graph/tutorial-riskdetection-api)
- [Overview of Microsoft Graph](https://developer.microsoft.com/graph/docs)
- [Get access without a user](/graph/auth-v2-service)
- [Azure AD Identity Protection Service Root](/graph/api/resources/identityprotectionroot)
- [Azure Active Directory Identity Protection](./overview-identity-protection.md)
