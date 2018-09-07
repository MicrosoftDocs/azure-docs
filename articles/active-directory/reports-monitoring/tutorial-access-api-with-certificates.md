---
title: Get data using the Azure AD Reporting API with certificates | Microsoft Docs
description: Explains how to use the Azure AD Reporting API with certificate credentials to get data from directories without user intervention. 
services: active-directory
documentationcenter: ''
author: priyamohanram
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.workload: infrastructure-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.component: report-monitor
ms.date: 05/07/2018
ms.author: priyamo
ms.reviewer: dhanyahk 

---
# Get data using the Azure Active Directory reporting API with certificates

The [Azure Active Directory (Azure AD) reporting APIs](concept-reporting-api.md) provide you with programmatic access to the data through a set of REST-based APIs. You can call these APIs from a variety of programming languages and tools. If you want to access the Azure AD Reporting API without user intervention, you can configure your access to use certificates.

This involves the following steps:

1. [Install the prerequisites](#install-prerequisites)
2. [Register the certificate in your app](#register-the-certificate-in-your-app)
3. [Get an access token for MS Graph API](#get-an-access-token-for-ms-graph-api)
4. [Query the MS Graph API endpoints](#query-the-ms-graph-api-endpoints)


## Install prerequisites

1. First, make sure that you have completed the [prerequisites to access the Azure Active Directory reporting API](howto-configure-prerequisites-for-reporting-api.md). 

2. Download and install Azure AD Powershell V2, following the instructions at [Azure Active Directory PowerShell(https://github.com/Azure/azure-docs-powershell-azuread/blob/master/docs-conceptual/azureadps-2.0/install-adv2.md)

3. Install the MSCloudIDUtils from the [PowerShellGallery - MSCloudIdUtils](https://www.powershellgallery.com/packages/MSCloudIdUtils/). This module provides several utility cmdlets including:
    - The ADAL libraries needed for authentication
    - Access tokens from user, application keys, and certificates using ADAL
    - Graph API handling paged results

4. If it's your first time using the module run **Install-MSCloudIdUtilsModule** to complete setup, otherwise you can simply import it using the **Import-Module** Powershell command.

Your session should look similar to this screen:

  ![Windows Powershell](./media/tutorial-access-api-with-certificates/module-install.png)

## Register the certificate in your app

1. First, go to your application registration page. You can do this by navigating to the [Azure portal](https://portal.azure.com), clicking **Azure Active Directory**, then clicking **App registrations** and choosing your application from the list. 

2. Then, follow the steps to [register your certificate with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-certificate-credentials#register-your-certificate-with-azure-ad) for the application. 

3. Note the Application ID, and the thumbprint of the certificate you just registered with your application. To find the thumbprint, from your application page in the portal, go to **Settings** and click **Keys**. The thumbprint will be under the **Public Keys** list.

  
## Get an access token for MS Graph API

To get an access token for the MS Graph API, use the **Get-MSCloudIdMSGraphAccessTokenFromCert** cmdlet from the MSCloudIdUtils PowerShell module. 

>[!NOTE]
>You need to use the Application ID (also known as ClientID), and the certificate thumbprint of the certificate with the private key installed in your computer's certificate store (CurrentUser or LocalMachine certificate store).
>

 ![Azure portal](./media/tutorial-access-api-with-certificates/getaccesstoken.png)

## Use the access token to call the Graph API

Now, you can use the access token in your Powershell script to query the Graph API. Below is an example using the **Invoke-MSCloudIdMSGraphQuery** cmdlet from the MSCloudIDUtils to enumerate the signins or diectoryAudits endpoint. This cmdlet handles multi-paged results, and then sends those results to the PowerShell pipeline.

### Query the DirectoryAudits endpoint
 ![Azure portal](./media/tutorial-access-api-with-certificates/query-directoryAudits.png)

 ### Query the SignIns endpoint
 ![Azure portal](./media/tutorial-access-api-with-certificates/query-signins.png)

You can now choose to export this data to a CSV and save to a SIEM system. You can also wrap your script in a scheduled task to get Azure AD data from your tenant periodically without having to store application keys in the source code. 


## Next steps

* [Get a first impression of the reporting APIs](concept-reporting-api.md)
* [Audit API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/directoryaudit) 
* [Sign-in activity report API reference](https://developer.microsoft.com/graph/docs/api-reference/beta/resources/signin)



