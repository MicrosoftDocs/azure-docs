---
title: Sharepoint files - QnA Maker
titleSuffix: Azure Cognitive Services
description: Add secured Sharepoint data sources to your knowledge base to enrich the knowledge base with questions and answers that may be secured with Active Directory.
services: cognitive-services
author: tulasim88
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: article
ms.date: 04/05/2019
ms.author: tulasim
---

# Add a secured Sharepoint data source to your knowledge base

Add secured Sharepoint data sources to your knowledge base to enrich the knowledge base with questions and answers that may be secured with Active Directory. 

When you add a secured Sharepoint document to your knowledge base, as the QnA Maker manager, you must request Active Directory permission for QnA Maker. Once this permission is given from the Active Directory manager to QnA Maker for access to Sharepoint, it doesn't have to be given again. Each subsequent document addition to the knowledge base will not need authorization if it is in the same Sharepoint resource. 

If the QnA Maker knowledge base manager is not the Active Directory manager, you will need to communicate with the Active Directory manager to finish this process.

## Add supported file types to knowledge base

You can add all QnA Maker-supported [file types](../Concepts/data-sources-supported.md) from a Sharepoint server to your knowledge base. You may have to grant [permissions](#permissions) if the file resource is secured.

1. From the Sharepoint server, select the file's ellipsis menu, `...`.
1. Copy the file's URL.

    ![Get the Sharepoint file URL by selecting the file's ellipsis menu then copying the URL.](../media/add-sharepoint-datasources/get-sharepoint-file-url.png)

1. In the QnA Maker portal, on the **Settings** page, [add the URL](edit-knowledge-base.md#add-datasource) to the knowledge base. 

## Permissions

Granting permissions happens when a secured file from a Sharepoint server is added to a knowledge base. Depending on how the Sharepoint is set up and the permissions of the person adding the file, this could require:

* no additional steps - the person adding the file has all the permissions needed.
* steps by both [knowledge base manager](#knowledge-base-manager-add-sharepoint-data-source-in-qna-maker-portal) and [Active Directory manager](#active-directory-manager-grant-file-read-access-to-qna-maker).

See the steps listed below. 

### Knowledge base manager: add Sharepoint data source in QnA Maker portal

When the **QnA Maker manager** adds a secured Sharepoint document to a knowledge base, the knowledge base manager initiates a request for permission that the Active Directory manager needs to complete.

The request begins with a pop-up to authenticate to an Active Directory account. 

![Authenticate User Account](../media/add-sharepoint-datasources/authenticate-user-account.png)

Once the QnA Maker manager selects the account, the Active Directory administrator will receive a notice that he needs to allow the QnA Maker app (not the QnA Maker manager) access to the Sharepoint resource. The Active Directory manager will need to do this for every Sharepoint resource, but not every document in that resource. 

### Active directory manager: grant file read access to QnA Maker

The Active Directory manager (not the QnA Maker manager) needs to grant access to QnA Maker to access the Sharepoint resource by selecting [this link](https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=id_token&scope=Files.Read%20Files.Read.All%20Sites.Read.All%20User.Read%20User.ReadBasic.All%20profile%20openid%20email&client_id=c2c11949-e9bb-4035-bda8-59542eb907a6&redirect_uri=https%3A%2F%2Fwww.qnamaker.ai%3A%2FCreate&state=68) to authorize the QnA Maker Portal Sharepoint enterprise app to have file read permissions. 

![Azure Active Directory manager grants permission interactively](../media/add-sharepoint-datasources/aad-manager-grants-permission-interactively.png)

<!--
The Active Directory manager must grant QnA Maker access either by application name, `QnAMakerPortalSharepoint`, or by application ID, `c2c11949-e9bb-4035-bda8-59542eb907a6`. 
-->
<!--
### Grant access from the interactive pop-up window 

The Active Directory manager will get a pop-up window requesting permissions to the `QnAMakerPortalSharepoint` app. The pop-up window includes the QnA Maker Manager email address that initiated the request, an `App Info` link to learn more about **QnAMakerPortalSharepoint**, and a list of permissions requested. Select **Accept** to provide those permissions. 

![Azure Active Directory manager grants permission interactively](../media/add-sharepoint-datasources/aad-manager-grants-permission-interactively.png)
-->
<!--

### Grant access from the App Registrations list

1. The Active Directory manager signs in to the Azure portal and opens **[App registrations list](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ApplicationsListBlade)**. 

1. Search for and select the **QnAMakerPortalSharepoint** app. Change the second filter box from **My apps** to **All apps**. The app information will open on the right side.

    ![Select QnA Maker app in App registrations list](../media/add-sharepoint-datasources/select-qna-maker-app-in-app-registrations.png)

1. Select **Settings**.

    [![Select Settings in the right-side blade](../media/add-sharepoint-datasources/select-settings-for-qna-maker-app-registration.png)](../media/add-sharepoint-datasources/select-settings-for-qna-maker-app-registration.png#lightbox)

1. Under **API access**, select **Required permissions**. 

    ![Select 'Settings', then under 'API access', select 'Required permission'](../media/add-sharepoint-datasources/select-required-permissions-in-settings-blade.png)

1. Do not change any settings in the **Enable Access** window. Select **Grant Permission**. 

    [![Under 'Grant Permission', select 'Yes'](../media/add-sharepoint-datasources/grant-app-required-permissions.png)](../media/add-sharepoint-datasources/grant-app-required-permissions.png#lightbox)

1. Select **YES** in the pop-up confirmation windows. 

    ![Grant required permissions](../media/add-sharepoint-datasources/grant-required-permissions.png)
-->
### Grant access from the Azure Active Directory admin center

1. The Active Directory manager signs in to the Azure portal and opens **[Enterprise applications](https://aad.portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps)**. 

1. Search for `QnAMakerPortalSharepoint` the select the QnA Maker app. 

    [![Search for QnAMakerPortalSharepoint in Enterprise apps list](../media/add-sharepoint-datasources/search-enterprise-apps-for-qna-maker.png)](../media/add-sharepoint-datasources/search-enterprise-apps-for-qna-maker.png#lightbox)

1. Under **Security**, go to **Permissions**. Select **Grant admin consent for Organization**. 

    [![Select authenticated user for Active Directory Admin](../media/add-sharepoint-datasources/grant-aad-permissions-to-enterprise-app.png)](../media/add-sharepoint-datasources/grant-aad-permissions-to-enterprise-app.png#lightbox)

1. Select a Sign-On account with permissions to grant permissions for the Active Directory. 


  
<!--

## Add Sharepoint data source with APIs

You need to get the Sharepoint file's URI before adding it to QnA Maker. 

## Get Sharepoint File URI

Use the following steps to transform the Sharepoint URL into a sharing token.

1. Encode the URL using [base64](https://en.wikipedia.org/wiki/Base64). 

1. Convert the base64-encoded result to an unpadded base64url format with the following character changes. 

    * Remove the equal character, `=` from the end of the value. 
    * Replace `/` with `_`. 
    * Replace `+` with `-`. 
    * Append `u!` to be beginning of the string. 

1. Sign in to Graph explorer and run the following query, where `sharedURL` is ...:

    ```
    https://graph.microsoft.com/v1.0/shares/<sharedURL>/driveitem
    ```

    Get the **@microsoft.graph.downloadUrl** and use this as `fileuri` in the QnA Maker APIs.

### Add or update a Sharepoint File URI to your knowledge base

Use the **@microsoft.graph.downloadUrl** from the previous section as the `fileuri` in the QnA Maker API for [adding a knowledge base](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff) or [updating a knowledge base](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600). The following fields are mandatory: name, fileuri, filename, source.

```
{
    "name": "Knowledge base name",
    "files": [
        {
            "fileUri": "<@microsoft.graph.downloadURL>",
            "fileName": "filename.xlsx",
            "source": "<sharepoint link>"
        }
    ],
    "urls": [],
    "users": [],
    "hostUrl": "",
    "qnaList": []
}
```



## Remove QnA Maker app from Sharepoint authorization

1. Use the steps in the previous section to find the Qna Maker app in the Active Directory admin center. 
1. When you select the **QnAMakerPortalSharepoint**, select **Overview**. 
1. Select **Delete** to remove permissions. 

-->

## Next steps

> [!div class="nextstepaction"]
> [Collaborate on your knowledge base](collaborate-knowledge-base.md)