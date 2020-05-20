---
title: Authentication - Data Lake Storage Gen1 with Azure AD
description: Learn how to authenticate with Azure Data Lake Storage Gen1 using Azure Active Directory.

author: twooley
ms.service: data-lake-store
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: twooley

---
# Authentication with Azure Data Lake Storage Gen1 using Azure Active Directory

Azure Data Lake Storage Gen1 uses Azure Active Directory for authentication. Before authoring an application that works with Data Lake Storage Gen1, you must decide how to authenticate your application with Azure Active Directory (Azure AD).

## Authentication options

* **End-user authentication** - An end user's Azure credentials are used to authenticate with Data Lake Storage Gen1. The application you create to work with Data Lake Storage Gen1 prompts for these user credentials. As a result, this authentication mechanism is *interactive* and the application runs in the logged in user's context. For more information and instructions, see [End-user authentication for Data Lake Storage Gen1](data-lake-store-end-user-authenticate-using-active-directory.md).

* **Service-to-service authentication** - Use this option if you want an application to authenticate itself with Data Lake Storage Gen1. In such cases, you create an Azure Active Directory (AD) application and use the key from the Azure AD application to authenticate with Data Lake Storage Gen1. As a result, this authentication mechanism is *non-interactive*. For more information and instructions, see [Service-to-service authentication for Data Lake Storage Gen1](data-lake-store-service-to-service-authenticate-using-active-directory.md).

The following table illustrates how end-user and service-to-service authentication mechanisms are supported for Data Lake Storage Gen1. Here's how you read the table.

* The ✔* symbol denotes that authentication option is supported and links to an article that demonstrates how to use the authentication option. 
* The ✔ symbol denotes that the authentication option is supported. 
* The empty cells denote that the authentication option is not supported.


|Use this authentication option with...                   |.NET         |Java     |PowerShell |Azure CLI | Python   |REST     |
|:---------------------------------------------|:------------|:--------|:----------|:-------------|:---------|:--------|
|End-user (without MFA**)                        |   ✔ |    ✔    |    ✔      |       ✔      |    **[✔*](data-lake-store-end-user-authenticate-python.md#end-user-authentication-without-multi-factor-authentication)**(deprecated)     |    **[✔*](data-lake-store-end-user-authenticate-rest-api.md)**    |
|End-user (with MFA)                           |    **[✔*](data-lake-store-end-user-authenticate-net-sdk.md)**        |    **[✔*](data-lake-store-end-user-authenticate-java-sdk.md)**     |    ✔      |       **[✔*](data-lake-store-get-started-cli-2.0.md)**      |    **[✔*](data-lake-store-end-user-authenticate-python.md#end-user-authentication-with-multi-factor-authentication)**     |    ✔    |
|Service-to-service (using client key)         |    **[✔*](data-lake-store-service-to-service-authenticate-net-sdk.md#service-to-service-authentication-with-client-secret)** |    **[✔*](data-lake-store-service-to-service-authenticate-java.md)**    |    ✔      |       ✔      |    **[✔*](data-lake-store-service-to-service-authenticate-python.md#service-to-service-authentication-with-client-secret-for-account-management)**     |    **[✔*](data-lake-store-service-to-service-authenticate-rest-api.md)**    |
|Service-to-service (using client certificate) |    **[✔*](data-lake-store-service-to-service-authenticate-net-sdk.md#service-to-service-authentication-with-certificate)**        |    ✔    |    ✔      |       ✔      |    ✔     |    ✔    |

<i>* Click the <b>✔\*</b> symbol. It's a link.</i><br>
<i>** MFA stands for multi-factor authentication</i>

See  [Authentication Scenarios for Azure Active Directory](../active-directory/develop/authentication-scenarios.md) for more information on how to use Azure Active Directory for authentication.

## Next steps

* [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
* [Service-to-service authentication](data-lake-store-service-to-service-authenticate-using-active-directory.md)


