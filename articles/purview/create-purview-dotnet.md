---
title: Create Purview Account using .NET SDK
description: Create an Azure Purview Account using .NET SDK.
author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 4/2/2021
ms.author: nayenama
---
# Quickstart: Create a Purview Account using .NET SDK

This quickstart describes how to use .NET SDK to create an Azure Purview account 

> [!IMPORTANT]
> Azure Purview is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your own [Azure Active Directory tenant](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

* Your account must have permission to create resources in the subscription

* If you have **Azure Policy** blocking all applications from creating **Storage account** and **EventHub namespace**, you need to make policy exception using tag, which can be entered during the process of creating a Purview account. The main reason is that for each Purview Account created, it needs to create a managed Resource Group and within this resource group, a Storage account and an EventHub namespace. For more information refer to [Create Catalog Portal](create-catalog-portal.md)

### Visual Studio

The walkthrough in this article uses Visual Studio 2019. The procedures for Visual Studio 2013, 2015, or 2017 differ slightly.

### Azure .NET SDK

Download and install [Azure .NET SDK](https://azure.microsoft.com/downloads/) on your machine.

## Create an application in Azure Active Directory

From the sections in *How to: Use the portal to create an Azure AD application and service principal that can access resources*, follow the instructions to do these tasks:

1. In [Create an Azure Active Directory application](../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal), create an application that represents the .NET application you are creating in this tutorial. For the sign-on URL, you can provide a dummy URL as shown in the article (`https://contoso.org/exampleapp`).
2. In [Get values for signing in](../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in), get the **application ID** and **tenant ID**, and note down these values that you use later in this tutorial. 
3. In [Certificates and secrets](../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options), get the **authentication key**, and note down this value that you use later in this tutorial.
4. In [Assign the application to a role](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application), assign the application to the **Contributor** role at the subscription level so that the application can create data factories in the subscription.

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

## Create a Purview client

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

2. Add the following code to the **Main** method that sets the variables. Replace the placeholders with your own values. For a list of Azure regions in which Purview is currently available, search on **Azure Purview** and select the regions that interest you on the following page: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

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

3. Add the following code to the **Main** method that creates an instance of **PurviewManagementClient** class. You use this object to create a Purview Account.

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

## Create a Purview Account

Add the following code to the **Main** method that creates a **Purview Account**. 

```csharp
	// Create a purview Account
    Console.WriteLine("Creating Purview Account " + purviewAccountName + "...");
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

The console prints the progress of creating Purview Account.

### Sample output

```json
Creating Purview Account testpurview...
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

Go to the **Purview accounts** page in the [Azure portal](https://portal.azure.com) and verify the account created using the above code. 

## Delete Purview account

To programmatically delete a Purview Account, add the following lines of code to the program: 

```csharp
	Console.WriteLine("Deleting the Purview Account");
	client.Accounts.Delete(resourceGroup, purviewAccountName);
```

## Check if Purview account name is available

To check availability of a purview account, use the following code: 

```csharp
	CheckNameAvailabilityRequest checkNameAvailabilityRequest = new CheckNameAvailabilityRequest()
	{
      Name = purviewAccountName,
      Type =  "Microsoft.Purview/accounts"
    };
	Console.WriteLine("Check Purview account name");
	Console.WriteLine(client.Accounts.CheckNameAvailability(checkNameAvailabilityRequest).NameAvailable);
```

The above code with print 'True' if the name is available and 'False' if the name is not available.


## Next steps

The code in this tutorial creates a purview account, deletes a purview account and checks for name availability of purview account. You can now download the .NET SDK and learn about other resource provider actions you can perform for a Purview account.

Advance to the next article to learn how to allow users to access your Azure Purview Account. 

> [!div class="nextstepaction"]
> [Add users to your Azure Purview Account](catalog-permissions.md)
