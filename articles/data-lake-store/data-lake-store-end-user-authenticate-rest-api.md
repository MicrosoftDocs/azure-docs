---
title: End-user authentication - REST with Data Lake Storage Gen1 - Azure
description: Learn how to achieve end-user authentication with Azure Data Lake Storage Gen1 using Azure Active Directory using REST API

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.author: normesta

---
# End-user authentication with Azure Data Lake Storage Gen1 using REST API
> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-end-user-authenticate-java-sdk.md)
> * [Using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-end-user-authenticate-python.md)
> * [Using REST API](data-lake-store-end-user-authenticate-rest-api.md)
> 
>  

In this article, you learn about how to use the REST API to do end-user authentication with Azure Data Lake Storage Gen1. For service-to-service authentication with Data Lake Storage Gen1 using REST API, see [Service-to-service authentication with Data Lake Storage Gen1 using REST API](data-lake-store-service-to-service-authenticate-rest-api.md).

## Prerequisites

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Native" Application**. You must have completed the steps in [End-user authentication with Data Lake Storage Gen1 using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

* **[cURL](https://curl.haxx.se/)**. This article uses cURL to demonstrate how to make REST API calls against a Data Lake Storage Gen1 account.

## End-user authentication
End-user authentication is the recommended approach if you want a user to log in to your application using Azure AD. Your application is able to access Azure resources with the same level of access as the logged-in user. The user needs to provide their credentials periodically in order for your application to maintain access.

The result of having the end-user login is that your application is given an access token and a refresh token. The access token gets attached to each request made to Data Lake Storage Gen1 or Data Lake Analytics, and it is valid for one hour by default. The refresh token can be used to obtain a new access token, and it is valid for up to two weeks by default, if used regularly. You can use two different approaches for end-user login.

In this scenario, the application prompts the user to log in and all the operations are performed in the context of the user. Perform the following steps:

1. Through your application, redirect the user to the following URL:

    `https://login.microsoftonline.com/<TENANT-ID>/oauth2/authorize?client_id=<APPLICATION-ID>&response_type=code&redirect_uri=<REDIRECT-URI>`

   > [!NOTE]
   > \<REDIRECT-URI> needs to be encoded for use in a URL. So, for https://localhost, use `https%3A%2F%2Flocalhost`)

    For the purpose of this tutorial, you can replace the placeholder values in the URL above and paste it in a web browser's address bar. You will be redirected to authenticate using your Azure login. Once you successfully log in, the response is displayed in the browser's address bar. The response will be in the following format:

    `http://localhost/?code=<AUTHORIZATION-CODE>&session_state=<GUID>`

2. Capture the authorization code from the response. For this tutorial, you can copy the authorization code from the address bar of the web browser and pass it in the POST request to the token endpoint, as shown in the following snippet:

    ```console
    curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token \
    -F redirect_uri=<REDIRECT-URI> \
    -F grant_type=authorization_code \
    -F resource=https://management.core.windows.net/ \
    -F client_id=<APPLICATION-ID> \
    -F code=<AUTHORIZATION-CODE>
    ```

   > [!NOTE]
   > In this case, the \<REDIRECT-URI> need not be encoded.
   > 
   > 

3. The response is a JSON object that contains an access token (for example, `"access_token": "<ACCESS_TOKEN>"`) and a refresh token (for example, `"refresh_token": "<REFRESH_TOKEN>"`). Your application uses the access token when accessing Azure Data Lake Storage Gen1 and the refresh token to get another access token when an access token expires.

    ```json
    {"token_type":"Bearer","scope":"user_impersonation","expires_in":"3599","expires_on":"1461865782","not_before":    "1461861882","resource":"https://management.core.windows.net/","access_token":"<REDACTED>","refresh_token":"<REDACTED>","id_token":"<REDACTED>"}
    ```

4. When the access token expires, you can request a new access token using the refresh token, as shown in the following snippet:

    ```console
    curl -X POST https://login.microsoftonline.com/<TENANT-ID>/oauth2/token  \
         -F grant_type=refresh_token \
         -F resource=https://management.core.windows.net/ \
         -F client_id=<APPLICATION-ID> \
         -F refresh_token=<REFRESH-TOKEN>
    ```

For more information on interactive user authentication, see [Authorization code grant flow](/previous-versions/azure/dn645542(v=azure.100)).

## Next steps
In this article, you learned how to use service-to-service authentication to authenticate with Azure Data Lake Storage Gen1 using REST API. You can now look at the following articles that talk about how to use the REST API to work with Azure Data Lake Storage Gen1.

* [Account management operations on Data Lake Storage Gen1 using REST API](data-lake-store-get-started-rest-api.md)
* [Data operations on Data Lake Storage Gen1 using REST API](data-lake-store-data-operations-rest-api.md)