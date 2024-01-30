---
title: End-user authentication - .NET with Data Lake Storage Gen1 - Azure
description: Learn how to achieve end-user authentication with Azure Data Lake Storage Gen1 using Microsoft Entra ID with .NET SDK

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 09/22/2022
ms.author: normesta
ms.custom: devx-track-csharp, devx-track-dotnet
---
# End-user authentication with Azure Data Lake Storage Gen1 using .NET SDK
> [!div class="op_single_selector"]
> * [Using Java](data-lake-store-end-user-authenticate-java-sdk.md)
> * [Using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md)
> * [Using Python](data-lake-store-end-user-authenticate-python.md)
> * [Using REST API](data-lake-store-end-user-authenticate-rest-api.md)
> 
>  

In this article, you learn about how to use the .NET SDK to do end-user authentication with Azure Data Lake Storage Gen1. For service-to-service authentication with Data Lake Storage Gen1 using .NET SDK, see [Service-to-service authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md).

## Prerequisites
* **Visual Studio 2013 or above**. The instructions below use Visual Studio 2019.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Create a Microsoft Entra ID "Native" Application**. You must have completed the steps in [End-user authentication with Data Lake Storage Gen1 using Microsoft Entra ID](data-lake-store-end-user-authenticate-using-active-directory.md).

## Create a .NET application
1. In Visual Studio, select the **File** menu, **New**, and then **Project**.
2. Choose **Console App (.NET Framework)**, and then select **Next**.
3. In **Project name**, enter `CreateADLApplication`, and then select **Create**.

4. Add the NuGet packages to your project.

   1. Right-click the project name in the Solution Explorer and click **Manage NuGet Packages**.
   2. In the **NuGet Package Manager** tab, make sure that **Package source** is set to **nuget.org** and that **Include prerelease** check box is selected.
   3. Search for and install the following NuGet packages:

      * `Microsoft.Azure.Management.DataLake.Store` - This tutorial uses v2.1.3-preview.
      * `Microsoft.Rest.ClientRuntime.Azure.Authentication` - This tutorial uses v2.2.12.

        ![Add a NuGet source](./media/data-lake-store-get-started-net-sdk/data-lake-store-install-nuget-package.png "Create a new Azure Data Lake account")
   4. Close the **NuGet Package Manager**.

5. Open **Program.cs**
6. Replace the using statements with the following lines:

    ```csharp
    using System;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading;
    using System.Collections.Generic;
            
    using Microsoft.Rest;
    using Microsoft.Rest.Azure.Authentication;
    using Microsoft.Azure.Management.DataLake.Store;
    using Microsoft.Azure.Management.DataLake.Store.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```		

## End-user authentication
Add this snippet in your .NET client application. Replace the placeholder values with the values retrieved from a Microsoft Entra native application (listed as prerequisite). This snippet lets you authenticate your application **interactively** with Data Lake Storage Gen1, which means you are prompted to enter your Azure credentials.

For ease of use, the following snippet uses default values for client ID and redirect URI that are valid for any Azure subscription. In the following snippet, you only need to provide the value for your tenant ID. You can retrieve the Tenant ID using the instructions provided at [Get the tenant ID](../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application).
    
- Replace the Main() function with the following code:

    ```csharp
    private static void Main(string[] args)
    {
        //User login via interactive popup
        string TENANT = "<AAD-directory-domain>";
        string CLIENTID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
        System.Uri ARM_TOKEN_AUDIENCE = new System.Uri(@"https://management.core.windows.net/");
        System.Uri ADL_TOKEN_AUDIENCE = new System.Uri(@"https://datalake.azure.net/");
        string MY_DOCUMENTS = System.Environment.GetFolderPath(System.Environment.SpecialFolder.MyDocuments);
        string TOKEN_CACHE_PATH = System.IO.Path.Combine(MY_DOCUMENTS, "my.tokencache");
        var tokenCache = GetTokenCache(TOKEN_CACHE_PATH);
        var armCreds = GetCreds_User_Popup(TENANT, ARM_TOKEN_AUDIENCE, CLIENTID, tokenCache);
        var adlCreds = GetCreds_User_Popup(TENANT, ADL_TOKEN_AUDIENCE, CLIENTID, tokenCache);
    }
    ```

A couple of things to know about the preceding snippet:

* The preceding snippet uses a helper functions `GetTokenCache` and `GetCreds_User_Popup`. The code for these helper functions is available [here on GitHub](https://github.com/Azure-Samples/data-lake-analytics-dotnet-auth-options#gettokencache).
* To help you complete the tutorial faster, the snippet uses a native application client ID that is available by default for all Azure subscriptions. So, you can **use this snippet as-is in your application**.
* However, if you do want to use your own Microsoft Entra domain and application client ID, you must create a Microsoft Entra native application and then use the Microsoft Entra tenant ID, client ID, and redirect URI for the application you created. See [Create an Active Directory Application for end-user authentication with Data Lake Storage Gen1](data-lake-store-end-user-authenticate-using-active-directory.md) for instructions.

  
## Next steps
In this article, you learned how to use end-user authentication to authenticate with Azure Data Lake Storage Gen1 using .NET SDK. You can now look at the following articles that talk about how to use the .NET SDK to work with Azure Data Lake Storage Gen1.

* [Account management operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Data operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-data-operations-net-sdk.md)
