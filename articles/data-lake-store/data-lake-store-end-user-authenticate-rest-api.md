---
title: 'End-user authentication: Data Lake Store with Azure Active Directory | Microsoft Docs'
description: Learn how to achieve end-user authentication with Data Lake Store using Azure Active Directory
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: ec586ecd-1b42-459e-b600-fadbb7b80a9b
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/21/2017
ms.author: nitinme

---
# End-user authentication with Data Lake Store using Azure Active Directory
> [!div class="op_single_selector"]
> * [Service-to-service authentication](data-lake-store-authenticate-using-active-directory.md)
> * [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
> 
> 

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* End-user authentication (this article)
* Service-to-service authentication

Both these options result in your application being provided with an OAuth 2.0 token, which gets attached to each request made to Azure Data Lake Store or Azure Data Lake Analytics.

This article talks about how create an **Azure AD native application for end-user authentication**. For instructions on Azure AD application configuration for service-to-service authentication see [Service-to-service authentication with Data Lake Store using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

## Prerequisites
* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* Your subscription ID. You can retrieve it from the Azure Portal. For example, it is available from the Data Lake Store account blade.
  
    ![Get subscription ID](./media/data-lake-store-end-user-authenticate-using-active-directory/get-subscription-id.png)

* Your Azure AD domain name. You can retrieve it by hovering the mouse in the top-right corner of the Azure Portal. From the screenshot below, the domain name is **contoso.onmicrosoft.com**, and the GUID within brackets is the tenant ID. 
  
    ![Get AAD domain](./media/data-lake-store-end-user-authenticate-using-active-directory/get-aad-domain.png)

## End-user authentication
This is the recommended approach if you want an end-user to log in to your application via Azure AD. Your application will be able to access Azure resources with the same level of access as the end-user that logged in. Your end-user will need to provide their credentials periodically in order for your application to maintain access.

The result of having the end-user log in is that your application is given an access token and a refresh token. The access token gets attached to each request made to Data Lake Store or Data Lake Analytics, and it is valid for one hour by default. The refresh token can be used to obtain a new access token, and it is valid for up to two weeks by default, if used regularly. You can use two different approaches for end-user log in.

### End-user authentication (interactive)
In this scenario, the application prompts the user to log in and all the operations are performed in the context of the user. Perform the following steps for interactive authentication.

1. Through your application, redirect the user to the following URL:
   
        https://login.microsoftonline.com/<TENANT-ID>/oauth2/authorize?client_id=<APPLICATION-ID>&response_type=code&redirect_uri=<REDIRECT-URI>
   
   > [!NOTE]
   > \<REDIRECT-URI> needs to be encoded for use in a URL. So, for https://localhost, use `https%3A%2F%2Flocalhost`)
   > 
   > 
   
    For the purpose of this tutorial, you can replace the placeholder values in the URL above and paste it in a web browser's address bar. You will be redirected to authenticate using your Azure login. Once you successfully log in, the response is displayed in the browser's address bar. The response will be in the following format:
   
        http://localhost/?code=<AUTHORIZATION-CODE>&session_state=<GUID>
2. Capture the authorization code from the response. For this tutorial, you can copy the authorization code from the address bar of the web browser and pass it in the POST request to the token endpoint, as shown below:
   
        curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token \
        -F redirect_uri=<REDIRECT-URI> \
        -F grant_type=authorization_code \
        -F resource=https://management.core.windows.net/ \
        -F client_id=<APPLICATION-ID> \
        -F code=<AUTHORIZATION-CODE>
   
   > [!NOTE]
   > In this case, the \<REDIRECT-URI> need not be encoded.
   > 
   > 
3. The response is a JSON object that contains an access token (e.g., `"access_token": "<ACCESS_TOKEN>"`) and a refresh token (e.g., `"refresh_token": "<REFRESH_TOKEN>"`). Your application uses the access token when accessing Azure Data Lake Store and the refresh token to get another access token when an access token expires.
   
        {"token_type":"Bearer","scope":"user_impersonation","expires_in":"3599","expires_on":"1461865782","not_before":    "1461861882","resource":"https://management.core.windows.net/","access_token":"<REDACTED>","refresh_token":"<REDACTED>","id_token":"<REDACTED>"}
4. When the access token expires, you can request a new access token using the refresh token, as shown below:
   
        curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token  \
             -F grant_type=refresh_token \
             -F resource=https://management.core.windows.net/ \
             -F client_id=<APPLICATION-ID> \
             -F refresh_token=<REFRESH-TOKEN>

For more information on interactive user authentication, see [Authorization code grant flow](https://msdn.microsoft.com/library/azure/dn645542.aspx).
   
## Next steps
In this article you created an Azure AD native application and gathered the information you need in your client applications that you author using .NET SDK, Java SDK, REST API, etc. You can now proceed to the following articles that talk about how to use the Azure AD web application to first authenticate with Data Lake Store and then perform other operations on the store.

* [Get started with Azure Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Get started with Azure Data Lake Store using Java SDK](data-lake-store-get-started-java-sdk.md)
* [Get started with Azure Data Lake Store using REST API](data-lake-store-get-started-rest-api.md)

