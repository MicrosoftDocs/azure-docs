---
title: 'Quickstart: Create Microsoft Purview (formerly Azure Purview) account using .NET SDK'
description: This article will guide you through creating a Microsoft Purview (formerly Azure Purview) account using .NET SDK.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.devlang: csharp
ms.topic: quickstart
ms.date: 06/17/2022
ms.custom: mode-api
---
# Quickstart: Create a Microsoft Purview (formerly Azure Purview) account using .NET SDK

In this quickstart, you'll use the [.NET SDK](/dotnet/api/overview/azure/purviewresourceprovider) to create a Microsoft Purview (formerly Azure Purview) account.

The Microsoft Purview governance portal surfaces tools like the Microsoft Purview Data Map and Microsoft Purview Data Catalog that help you manage and govern your data landscape. By connecting to data across your on-premises, multi-cloud, and software-as-a-service (SaaS) sources, the Microsoft Purview Data Map creates an up-to-date map of your information. It identifies and classifies sensitive data, and provides end-to-end linage. Data consumers are able to discover data across your organization, and data administrators are able to audit, secure, and ensure right use of your data.

For more information about the governance capabilities of Microsoft Purview, formerly Azure Purview, [see our overview page](overview.md). For more information about deploying Microsoft Purview across your organization, [see our deployment best practices](deployment-best-practices.md)

[!INCLUDE [purview-quickstart-prerequisites](includes/purview-quickstart-prerequisites.md)]

### Visual Studio

The walkthrough in this article uses Visual Studio 2019. The procedures for Visual Studio 2013, 2015, or 2017 may differ slightly.

### Azure .NET SDK

Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/) on your machine.

## Create an application in Azure Active Directory

1. In [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you're creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
1. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in), get the **application ID** and **tenant ID**, and note down these values that you use later in this tutorial.
1. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options), get the **authentication key**, and note down this value that you use later in this tutorial.
1. In [Assign the application to a role](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application), assign the application to the **Contributor** role at the subscription level so that the application can create data factories in the subscription.

## Create a Visual Studio project

Next, create a C# .NET console application in Visual Studio:

1. Launch **Visual Studio**.
2. In the Start window, select **Create a new project** > **Console App (.NET Framework)**. .NET version 4.5.2 or above is required.
3. In **Project name**, enter **PurviewQuickStart**.
4. Select **Create** to create the project.

## Install NuGet packages

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console**.
2. In the **Package Manager Console** pane, run the following commands to install packages. For more information, see the [Microsoft.Azure.Management.Purview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Purview/).

    ```powershell
    Install-Package Microsoft.Azure.Management.Purview
    Install-Package Microsoft.Azure.Management.ResourceManager -IncludePrerelease
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    ```
>[!TIP]
> If you are getting an error that reads:  **Package \<package name> is not found in the following primary sources(s):** and it is listing a local folder, you need to update your package sources in Visual Studio to include the nuget site as an online source.
> 1. Go to **Tools**
> 1. Select **NuGet Package Manager**
> 1. Select **Package Manage Settings**
> 1. Select **Package Sources**
> 1. Add https://nuget.org/api/v2/ as a source.

## Create a Microsoft Purview client

1. Open **Program.cs**, include the following statements to add references to namespaces.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Microsoft.Rest;
    using Microsoft.Rest.Serialization;
	  using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.Purview;
	  using Microsoft.Azure.Management.Purview.Models;
	  using Microsoft.IdentityModel.Clients.ActiveDirectory;
    ```

2. Add the following code to the **Main** method that sets the variables. Replace the placeholders with your own values. For a list of Azure regions in which Microsoft Purview is currently available, search on **Microsoft Purview** and select the regions that interest you on the following page: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

   ```csharp
   // Set variables
   string tenantID = "<your tenant ID>";
   string applicationId = "<your application ID>";
   string authenticationKey = "<your authentication key for the application>";
   string subscriptionId = "<your subscription ID where the data factory resides>";
   string resourceGroup = "<your resource group where the data factory resides>";
   string region = "<the location of your resource group>";
   string purviewAccountName = 
       "<specify the name of purview account to create. It must be globally unique.>";
   ```

3. Add the following code to the **Main** method that creates an instance of **PurviewManagementClient** class. You use this object to create a Microsoft Purview Account.

   ```csharp
   // Authenticate and create a purview management client
   var context = new AuthenticationContext("https://login.windows.net/" + tenantID);
   ClientCredential cc = new ClientCredential(applicationId, authenticationKey);
   AuthenticationResult result = context.AcquireTokenAsync(
   "https://management.azure.com/", cc).Result;
   ServiceClientCredentials cred = new TokenCredentials(result.AccessToken);
   var client = new PurviewManagementClient(cred)
   {
      SubscriptionId = subscriptionId           
   };
   ```

## Create an account

Add the following code to the **Main** method that will create the **Microsoft Purview Account**.

```csharp
// Create a purview Account
Console.WriteLine("Creating Microsoft Purview Account " + purviewAccountName + "...");
Account account = new Account()
{
Location = region,
Identity = new Identity(type: "SystemAssigned"),
Sku = new AccountSku(name: "Standard", capacity: 4)
};            
try
{
  client.Accounts.CreateOrUpdate(resourceGroup, purviewAccountName, account);
  Console.WriteLine(client.Accounts.Get(resourceGroup, purviewAccountName).ProvisioningState);                
}
catch (ErrorResponseModelException purviewException)
{
Console.WriteLine(purviewException.StackTrace);
  }
  Console.WriteLine(
    SafeJsonConvert.SerializeObject(account, client.SerializationSettings));
  while (client.Accounts.Get(resourceGroup, purviewAccountName).ProvisioningState ==
         "PendingCreation")
  {
    System.Threading.Thread.Sleep(1000);
  }
Console.WriteLine("\nPress any key to exit...");
Console.ReadKey();
```

## Run the code

Build and start the application, then verify the execution.

The console prints the progress of creating Microsoft Purview Account.

### Sample output

```json
Creating Microsoft Purview Account testpurview...
Succeeded
{
  "sku": {
    "capacity": 4,
    "name": "Standard"
  },
  "identity": {
    "type": "SystemAssigned"
  },
  "location": "southcentralus"
}

Press any key to exit...
```

## Verify the output

Go to the **Microsoft Purview accounts** page in the [Azure portal](https://portal.azure.com) and verify the account created using the above code.

## Delete Microsoft Purview account

To programmatically delete a Microsoft Purview account, add the following lines of code to the program:

```csharp
Console.WriteLine("Deleting the Microsoft Purview Account");
client.Accounts.Delete(resourceGroup, purviewAccountName);
```

## Check if Microsoft Purview account name is available

To check availability of a purview account, use the following code:

```csharp
CheckNameAvailabilityRequest checkNameAvailabilityRequest = newCheckNameAvailabilityRequest()
{
    Name = purviewAccountName,
    Type =  "Microsoft.Purview/accounts"
};
Console.WriteLine("Check Microsoft Purview account name");
Console.WriteLine(client.Accounts.CheckNameAvailability(checkNameAvailabilityRequest).NameAvailable);
```

The above code with print 'True' if the name is available and 'False' if the name isn't available.

## Next steps

In this quickstart, you learned how to create a Microsoft Purview (formerly Azure Purview) account, delete the account, and check for name availability. You can now download the .NET SDK and learn about other resource provider actions you can perform for a Microsoft Purview account.

Follow these next articles to learn how to navigate the Microsoft Purview governance portal, create a collection, and grant access to the Microsoft Purview governance portal.

* [How to use the Microsoft Purview governance portal](use-azure-purview-studio.md)
* [Grant users permissions to the governance portal](catalog-permissions.md)
* [Create a collection](quickstart-create-collection.md)
