---
title: Authentication in Data Lake Store using Azure Active Directory | Microsoft Docs
description: Learn how to authenticate with Data Lake Store using Azure Active Directory
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/15/2017
ms.author: nitinme

---
# Authentication with Data Lake Store using Azure Active Directory

Azure Data Lake Store uses Azure Active Directory for authentication. Before authoring an application that works with Azure Data Lake Store or Azure Data Lake Analytics, you must first decide how you would like to authenticate your application with Azure Active Directory (Azure AD). The two main options available are:

* **End-user authentication** - An end user's Azure credentials are used to authenticate with the Data Lake Store. The application you create to work with Data Lake Store prompts for these user credentials. As a result, this authentication mechanism is *interactive* and the application runs in the logged in user's context. For more information and instructions, see [End-user authentication for Data Lake Store](data-lake-store-end-user-authenticate-using-active-directory.md).

* **Service-to-service authentication** - Use this option if you want an application to authenticate itself with Data Lake Store. In such cases, you create an Azure Active Directory (AD) application and use the key from the Azure AD application to authenticate with Data Lake Store. As a result, this authentication mechanism is *non-interactive*. For more information and instructions, see [Service-to-service authentication for Data Lake Store](data-lake-store-service-to-service-authenticate-using-active-directory.md).

The following table illustrates how end-user and service-to-service authentication mechanisms are supported for Data Lake Store. The ( ✔ ) symbol denotes that authentication option is supported. The "Instructions" references the article that gives further description on how to set up this authentication with Data Lake Store. See  [Authentication Scenarios for Azure Active Directory](../active-directory/develop/active-directory-authentication-scenarios.md) for more information on how to use Azure Active Directory for authentication.

|Use this authentication option with...                   |.NET         |Java     |PowerShell |CLI 2.0 | Python   |REST     |
|:---------------------------------------------|:------------|:--------|:----------|:-------------|:---------|:--------|
|End-user (without MFA*)                        |   [Instructions](data-lake-store-end-user-authenticate-net-sdk.md) |    ✔    |    ✔      |       ✔      |    [Instructions](data-lake-store-end-user-authenticate-python.md#end-user-authentication-without-multi-factor-authentication)     |    [Instructions](data-lake-store-end-user-authenticate-rest-api.md)    |
|End-user (with MFA)                           |    ✔        |         |    ✔      |       [Instructions](data-lake-store-get-started-cli-2.0.md)      |    [Instructions](data-lake-store-end-user-authenticate-python.md#end-user-authentication-with-multi-factor-authentication)     |    ✔    |
|Service-to-service (using client key)         |    [Instructions](data-lake-store-service-to-service-authenticate-net-sdk.md) |    [Instructions](data-lake-store-service-to-service-authenticate-java.md)    |    ✔      |       ✔      |    [Instructions](data-lake-store-service-to-service-authenticate-python.md)     |    [Instructions](data-lake-store-service-to-service-authenticate-rest-api.md)    |
|Service-to-service (using client certificate) |    ✔        |    ✔    |    ✔      |       ✔      |    ✔     |    ✔    |

\* *MFA stands for multi-factor authentication*


## Next steps

* [End-user authentication](data-lake-store-end-user-authenticate-using-active-directory.md)
* [Service-to-service authentication](data-lake-store-service-to-service-authenticate-using-active-directory.md)


