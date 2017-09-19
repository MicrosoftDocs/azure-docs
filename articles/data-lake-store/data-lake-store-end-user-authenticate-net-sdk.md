---
title: 'End-user authentication: .NET SDK with Data Lake Store using Azure Active Directory | Microsoft Docs'
description: Learn how to achieve end-user authentication with Data Lake Store using Azure Active Directory with .NET SDK
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 09/30/2017
ms.author: nitinme

---
# End-user authentication with Data Lake Store using .NET SDK
> [!div class="op_single_selector"]
> * [Using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-end-user-authenticate-python.md)
> * [Using REST API](data-lake-store-end-user-authenticate-rest-api.md)
> 
> 

In this article, you learn about how to use the .NET SDK to do end-user authentication with Azure Data Lake Store. For service-to-service authentication with Data Lake Store using .NET SDK, see [Service-to-service authentication with Data Lake Store using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md).

## Prerequisites
* **Visual Studio 2013, 2015, or 2017**. The instructions below use Visual Studio 2015 Update 2.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create an Azure Active Directory "Native" Application**. You must have completed the steps in [End-user authentication with Data Lake Store using Azure Active Directory](data-lake-store-end-user-authenticate-using-active-directory.md).

## Create a .NET application
1. Open Visual Studio and create a console application.
2. From the **File** menu, click **New**, and then click **Project**.
3. From **New Project**, type or select the following values:

   | Property | Value |
   | --- | --- |
   | Category |Templates/Visual C#/Windows |
   | Template |Console Application |
   | Name |CreateADLApplication |

4. Click **OK** to create the project.

5. Add the Nuget packages to your project.

   1. Right-click the project name in the Solution Explorer and click **Manage NuGet Packages**.
   2. In the **Nuget Package Manager** tab, make sure that **Package source** is set to **nuget.org** and that **Include prerelease** check box is selected.
   3. Search for and install the following NuGet packages:

      * `Microsoft.Azure.Management.DataLake.Store` - This tutorial uses v2.1.3-preview.
      * `Microsoft.Rest.ClientRuntime.Azure.Authentication` - This tutorial uses v2.2.12.

        ![Add a Nuget source](./media/data-lake-store-get-started-net-sdk/data-lake-store-install-nuget-package.png "Create a new Azure Data Lake account")
   4. Close the **Nuget Package Manager**.

6. Open **Program.cs**, delete the existing code, and then include the following statements to add references to namespaces.

        using System;
        using System.IO;
		using System.Security.Cryptography.X509Certificates; // Required only if you are using an Azure AD application created with certificates
        using System.Threading;

        using Microsoft.Azure.Management.DataLake.Store;
		using Microsoft.Azure.Management.DataLake.Store.Models;
		using Microsoft.IdentityModel.Clients.ActiveDirectory;
		using Microsoft.Rest.Azure.Authentication;

## End-user authentication
Use this snippet in your .NET client application with an existing Azure AD native application to authenticate your application **interactively** with Data Lake Store, which means you will be prompted to enter your Azure credentials.

For ease of use, the following snippet uses default values for client ID and redirect URI that will work with any Azure subscription. In the snippet, just provide the value for your tenant ID. You can retrieve it using the instructions provided at [Create an Active Directory Application](data-lake-store-end-user-authenticate-using-active-directory.md).

    
    private static void Main(string[] args)
    {
        // User login via interactive popup
        // Use the client ID of an existing AAD native application.
        SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
        var tenant_id = "<AAD_tenant_id>"; // Replace this string with the user's Azure Active Directory tenant ID
        var nativeClientApp_applicationId = "1950a258-227b-4e31-a9cf-717495945fc2";
        var activeDirectoryClientSettings = ActiveDirectoryClientSettings.UsePromptOnly(nativeClientApp_applicationId, new Uri("urn:ietf:wg:oauth:2.0:oob"));
        var creds = UserTokenProvider.LoginWithPromptAsync(tenant_id, activeDirectoryClientSettings).Result;
    }

A couple of things to know about the preceding snippet:

* To help you complete the tutorial faster, the snippet uses an an Azure AD domain and client ID that is available by default for all Azure subscriptions. So, you can **use this snippet as-is in your application**.
* However, if you do want to use your own Azure AD domain and application client ID, you must create an Azure AD native application and then use the Azure AD tenant ID, client ID, and redirect URI for the application you created. See [Create an Active Directory Application for end-user authentication with Data Lake Store](data-lake-store-end-user-authenticate-using-active-directory.md) for instructions.

  
## Next steps
In this article you learned how to use end-user authentication to authenticate with Azure Data Lake Store using .NET SDK. You can now look at the following articles that talk about how to use the .NET SDK to work with Azure Data Lake Store.

* [Account management operations on Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Data operations on Data Lake Store using .NET SDK](data-lake-store-data-operations-net-sdk.md)

