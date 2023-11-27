---
title: Troubleshoot the SharePoint Online list connector
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot issues with the SharePoint Online list connector in Azure Data Factory and Azure Synapse Analytics. 
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.topic: troubleshooting
ms.date: 02/08/2023
ms.author: jianleishen
ms.custom: has-adal-ref, synapse
---

# Troubleshoot the SharePoint Online list connector in Azure Data Factory and Azure Synapse

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides suggestions to troubleshoot common problems with the SharePoint Online list connector in Azure Data Factory and Azure Synapse.

## Error code: SharePointOnlineAuthFailed

- **Message**: `The access token generated failed, status code: %code;, error message: %message;.`

- **Cause**: The service principal ID and key might not be set correctly.

- **Recommendation**:  Check your registered application (service principal ID) and key to see whether they're set correctly.

## Connection failed after granting permission in SharePoint Online List 

### Symptoms 

You granted permission to your data factory in SharePoint Online List, but you still fail with the following error message:

`Failed to get metadata of odata service, please check if service url and credential is correct and your application has permission to the resource. Expected status code: 200, actual status code: Unauthorized, response is : {"error":"invalid_request","error_description":"Token type is not allowed."}.`

### Cause 

The SharePoint Online List uses Azure Access Control Service to acquire the access token to grant access to other applications. But for the tenant built after November 7, 2018, Access Control Service is disabled by default. 

### Recommendation

You need to enable Access Control Service to acquire the access token. Take the following steps:  

1. Download [SharePoint Online Management Shell](https://www.microsoft.com/download/details.aspx?id=35588#:~:text=The%20SharePoint%20Online%20Management%20Shell%20has%20a%20new,and%20saving%20the%20file%20to%20your%20hard%20disk.), and ensure that you have a tenant admin account. 
1. Run the following command in the SharePoint Online Management Shell. Replace `<tenant name>` with your tenant name and add `-admin` after it.  

   ```powershell
   Connect-SPOService -Url https://<tenant name>-admin.sharepoint.com/ 
   ```
1. Enter your tenant admin information in the pop-up authentication window. 
1. Run the following command:

   ```powershell
   Set-SPOTenant -DisableCustomAppAuthentication $false 
   ```
    :::image type="content" source="./media/connector-troubleshoot-guide/sharepoint-online-management-shell-command.png" alt-text="Diagram of Azure Data Lake Storage Gen1 connections for troubleshooting issues.":::

1. Use Access Control Service to get the access token. 


## Next steps

For more troubleshooting help, try these resources:

- [Connector troubleshooting guide](connector-troubleshoot-guide.md)
- [Data Factory blog](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/bg-p/AzureDataFactoryBlog)
- [Data Factory feature requests](/answers/topics/azure-data-factory.html)
- [Azure videos](https://azure.microsoft.com/resources/videos/index/?sort=newest&services=data-factory)
- [Microsoft Q&A page](/answers/topics/azure-data-factory.html)
- [Stack Overflow forum for Data Factory](https://stackoverflow.com/questions/tagged/azure-data-factory)
- [Twitter information about Data Factory](https://twitter.com/hashtag/DataFactory)
