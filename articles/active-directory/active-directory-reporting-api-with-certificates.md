---
title: Get data using the Azure AD Reporting API with certificates | Microsoft Docs
description: Explains how to use the Azure AD Reporting API with certificate credentials to get data from directories without user intervention. 
services: active-directory
documentationcenter: ''
author: ramical
writer: v-lorisc
manager: kannar

ms.assetid: 
ms.service: active-directory
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.component: compliance-reports
ms.date: 05/07/2018
ms.author: ramical

---
# Get data using the Azure Active Directory reporting API with certificates

The [Azure Active Directory (Azure AD) reporting APIs](https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-reports-and-events-preview) provide you with programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools.

If you want to access the Azure AD Reporting API  without user intervention, you can configure your access to use certificates

This article:

- Provides you with the required steps to access the Azure AD reporting API using certificates.
- Assumes that you have completed the [prerequisites to access the Azure Active Directory reporting API](active-directory-reporting-api-prerequisites-azure-portal.md). 


To access the reporting API with certificates, you need to:

1. Install the prerequisites
2. Set the certificate in your app 
3. Grant permissions
4. Get an access token




For information about source code, see [Leverage Report API Module](https://github.com/AzureAD/azure-activedirectory-powershell/tree/gh-pages/Modules/AzureADUtils). 

## Install prerequisites

You need to have Azure AD PowerShell V2 and AzureADUtils module installed.

1. Download and install Azure AD Powershell V2, following the instructions at [Azure Active Directory PowerShell](https://github.com/Azure/azure-docs-powershell-azuread/blob/master/Azure AD Cmdlets/AzureAD/index.md).

2. Download the Azure AD Utils module from [AzureAD/azure-activedirectory-powershell](https://github.com/AzureAD/azure-activedirectory-powershell/blob/gh-pages/Modules/AzureADUtils/AzureADUtils.psm1). 
  This module provides several utility cmdlets including:
    - The latest version of ADAL using Nuget
    - Access tokens from user, application keys, and certificates using ADAL
    - Graph API handling paged results

**To install the Azure AD Utils module:**

1. Create a directory to save the utilities module (for example, c:\azureAD) and download the module from GitHub.
2. Open a PowerShell session, and go to the directory you just created. 
3. Import the module, and install it in the PowerShell module path using the Install-AzureADUtilsModule cmdlet. 

The session should look similar to this screen:

  ![Windows Powershell](./media/active-directory-report-api-with-certificates/windows-powershell.png)

## Set the certificate in your app

**To set the certificate in your app:**

1. [Get the Object ID](active-directory-reporting-api-prerequisites-azure-portal.md#get-your-applications-client-id) of your app from the Azure Portal. 

  ![Azure portal](./media/active-directory-report-api-with-certificates/azure-portal.png)

2. Open a PowerShell session and connect to Azure AD using the Connect-AzureAD cmdlet.

  ![Azure portal](./media/active-directory-report-api-with-certificates/connect-azuaread-cmdlet.png)

3. Use the New-AzureADApplicationCertificateCredential cmdlet from AzureADUtils to add a certificate credential to it. 

>[!Note]
>You need to provide the application Object ID that you captured earlier, as well as the certificate object (get this using the Cert: drive).
>


  ![Azure portal](./media/active-directory-report-api-with-certificates/add-certificate-credential.png)
  
## Get an access token

To get an access token, use the **Get-AzureADGraphAPIAccessTokenFromCert** cmdlet from AzureADUtils. 

>[!NOTE]
>You need to use the Application ID instead of the Object ID that you used in the last section.
>

 ![Azure portal](./media/active-directory-report-api-with-certificates/application-id.png)

## Use the access token to call the Graph API

Now, you can create the script. Below is an example using the **Invoke-AzureADGraphAPIQuery** cmdlet from the AzureADUtils. This cmdlet handles multi-paged results, and then sends those results to the PowerShell pipeline. 

 ![Azure portal](./media/active-directory-report-api-with-certificates/script-completed.png)

You are now ready to export to a CSV and save to a SIEM system. You can also wrap your script in a scheduled task to get Azure AD data from your tenant periodically without having to store application keys in the source code. 

## Next steps

- [Get a first impression of the reporting APIs](active-directory-reporting-api-getting-started-azure-portal.md#explore)

- [Create your own solution](active-directory-reporting-api-getting-started-azure-portal.md#customize)




