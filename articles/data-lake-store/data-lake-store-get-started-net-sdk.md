---
title: Manage an Azure Data Lake Storage Gen1 account with .NET
description: Learn how to use the .NET SDK for Azure Data Lake Storage Gen1 account management operations.

author: normesta
ms.service: data-lake-store
ms.topic: how-to
ms.date: 05/29/2018
ms.author: normesta
ms.custom: devx-track-csharp, devx-track-dotnet
---
# Account management operations on Azure Data Lake Storage Gen1 using .NET SDK
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-get-started-net-sdk.md)
> * [REST API](data-lake-store-get-started-rest-api.md)
> * [Python](data-lake-store-get-started-python.md)
>
>

In this article, you learn how to perform account management operations on Azure Data Lake Storage Gen1 using .NET SDK. Account management operations include creating a Data Lake Storage Gen1 account, listing the accounts in an Azure subscription, deleting the accounts, etc.

For instructions on how to perform data management operations on Data Lake Storage Gen1 using .NET SDK, see [Filesystem operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-data-operations-net-sdk.md).

## Prerequisites
* **Visual Studio 2013 or above**. The instructions below use Visual Studio 2019.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

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
5. Open **Program.cs**, delete the existing code, and then include the following statements to add references to namespaces.

    ```csharp
    using System;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Threading;
    using System.Collections.Generic;
    using System.Security.Cryptography.X509Certificates; // Required only if you are using an Azure AD application created with certificates
                
    using Microsoft.Rest;
    using Microsoft.Rest.Azure.Authentication;
    using Microsoft.Azure.Management.DataLake.Store;
    using Microsoft.Azure.Management.DataLake.Store.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```

6. Declare the variables and provide the values for placeholders. Also, make sure the local path and file name you provide exist on the computer.

    ```csharp
    namespace SdkSample
    {
        class Program
        {
            private static DataLakeStoreAccountManagementClient _adlsClient;
                
            private static string _adlsAccountName;
            private static string _resourceGroupName;
            private static string _location;
            private static string _subId;

            private static void Main(string[] args)
            {
                _adlsAccountName = "<DATA-LAKE-STORAGE-GEN1-NAME>.azuredatalakestore.net"; 
                _resourceGroupName = "<RESOURCE-GROUP-NAME>"; 
                _location = "East US 2";
                _subId = "<SUBSCRIPTION-ID>";                    
            }
        }
    }
    ```

In the remaining sections of the article, you can see how to use the available .NET methods to perform operations such as authentication, file upload, etc.

## Authentication

* For end-user authentication for your application, see [End-user authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md).

## Create client object
The following snippet creates the Data Lake Storage Gen1 account client object, which is used to issue account management requests to the service, such as create account, delete account, etc.

```csharp
// Create client objects and set the subscription ID
_adlsClient = new DataLakeStoreAccountManagementClient(armCreds) { SubscriptionId = _subId };
```
    
## Create a Data Lake Storage Gen1 account
The following snippet creates a Data Lake Storage Gen1 account in the Azure subscription you provided while creating the Data Lake Storage Gen1 account client object.

```csharp
// Create Data Lake Storage Gen1 account
var adlsParameters = new DataLakeStoreAccount(location: _location);
_adlsClient.Account.Create(_resourceGroupName, _adlsAccountName, adlsParameters);
```

## List all Data Lake Storage Gen1 accounts within a subscription
Add the following method to your class definition. The following snippet lists all Data Lake Storage Gen1 accounts within a given Azure subscription.

```csharp
// List all Data Lake Storage Gen1 accounts within the subscription
public static List<DataLakeStoreAccountBasic> ListAdlStoreAccounts()
{
    var response = _adlsClient.Account.List(_adlsAccountName);
    var accounts = new List<DataLakeStoreAccountBasic>(response);

    while (response.NextPageLink != null)
    {
        response = _adlsClient.Account.ListNext(response.NextPageLink);
        accounts.AddRange(response);
    }

    return accounts;
}
```

## Delete a Data Lake Storage Gen1 account
The following snippet deletes the Data Lake Storage Gen1 account you created earlier.

```csharp
// Delete Data Lake Storage Gen1 account
_adlsClient.Account.Delete(_resourceGroupName, _adlsAccountName);
```

## See also
* [Filesystem operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-data-operations-net-sdk.md)
* [Data Lake Storage Gen1 .NET SDK Reference](/dotnet/api/overview/azure/data-lake-store)

## Next steps
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
