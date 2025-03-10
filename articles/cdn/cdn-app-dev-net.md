---
title: Get started with the Azure CDN Library for .NET
description: Learn how to write .NET applications to manage Azure CDN using Visual Studio.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
ms.custom: has-adal-ref, devx-track-csharp, devx-track-dotnet
---

# Get started with the Azure CDN Library for .NET

[!INCLUDE [Azure CDN from Microsoft (classic) retirement notice](../../includes/cdn-classic-retirement.md)]


> [!div class="op_single_selector"]
> - [Node.js](cdn-app-dev-node.md)
> - [.NET](cdn-app-dev-net.md)
>
>

You can use the [Azure CDN Library for .NET](/dotnet/api/overview/azure/cdn) to automate creation and management of CDN profiles and endpoints. This tutorial walks through the creation of a simple .NET console application that demonstrates several of the available operations. This tutorial isn't intended to describe all aspects of the Azure CDN Library for .NET in detail.

You need Visual Studio 2015 to complete this tutorial.  [Visual Studio Community 2015](https://www.visualstudio.com/products/visual-studio-community-vs.aspx) is freely available for download.

> [!TIP]
> The [completed project from this tutorial](https://code.msdn.microsoft.com/Azure-CDN-Management-1f2fba2c) is available for download on MSDN.
>
>

[!INCLUDE [cdn-app-dev-prep](../../includes/cdn-app-dev-prep.md)]

## Create your project and add NuGet packages

Now that we've created a resource group for our CDN profiles and given our Microsoft Entra application permission to manage CDN profiles and endpoints within that group, we can start creating our application.

> [!IMPORTANT]
> The [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package and Azure AD Authentication Library (ADAL) have been deprecated. No new features have been added since June 30, 2020. We strongly encourage you to upgrade. For more information, see the [migration guide](../active-directory/develop/msal-migration.md).

From within Visual Studio 2015, select **File**, **New**, **Project...** to open the new project dialog. Expand **Visual C#**, then select **Windows** in the pane on the left. Select **Console Application** in the center pane. Name your project, then select **OK**.

![New Project](./media/cdn-app-dev-net/cdn-new-project.png)

Our project is going to use some Azure libraries contained in NuGet packages. Let's add those libraries to the project.

1. Select the **Tools** menu, **Nuget Package Manager**, then **Package Manager Console**.

    ![Manage Nuget Packages](./media/cdn-app-dev-net/cdn-manage-nuget.png)
2. In the Package Manager Console, execute the following command to install the **Active Directory Authentication Library (ADAL)**:

    `Install-Package Microsoft.Identity.Client`
3. Execute the following to install the **Azure CDN Management Library**:

    `Install-Package Microsoft.Azure.Management.Cdn`

## Directives, constants, main method, and helper methods

Let's get the basic structure of our program written.

1. Back in the Program.cs tab, replace the `using` directives at the top with the following command:

    ```csharp
    using System;
    using System.Collections.Generic;
    using Microsoft.Azure.Management.Cdn;
    using Microsoft.Azure.Management.Cdn.Models;
    using Microsoft.Azure.Management.Resources;
    using Microsoft.Azure.Management.Resources.Models;
    using Microsoft.Identity.Client;
    using Microsoft.Rest;
    ```

2. We need to define some constants our methods use. In the `Program` class, but before the `Main` method, add the following code blocks. Be sure to replace the placeholders, including the **&lt;angle brackets&gt;**, with your own values as needed.

    ```csharp
    //Tenant app constants
    private const string clientID = "<YOUR CLIENT ID>";
    private const string clientSecret = "<YOUR CLIENT AUTHENTICATION KEY>"; //Only for service principals
    private const string authority = "https://login.microsoftonline.com/<YOUR TENANT ID>/<YOUR TENANT DOMAIN NAME>";

    //Application constants
    private const string subscriptionId = "<YOUR SUBSCRIPTION ID>";
    private const string profileName = "CdnConsoleApp";
    private const string endpointName = "<A UNIQUE NAME FOR YOUR CDN ENDPOINT>";
    private const string resourceGroupName = "CdnConsoleTutorial";
    private const string resourceLocation = "<YOUR PREFERRED AZURE LOCATION, SUCH AS Central US>";
    ```

3. Also at the class level, define these two variables. We use these variables later to determine whether our profile and endpoint already exist.

    ```csharp
    static bool profileAlreadyExists = false;
    static bool endpointAlreadyExists = false;
    ```

4. Replace the `Main` method as follows:

   ```csharp
   static void Main(string[] args)
   {
       //Get a token
       AuthenticationResult authResult = GetAccessToken();

       // Create CDN client
       CdnManagementClient cdn = new CdnManagementClient(new TokenCredentials(authResult.AccessToken))
           { SubscriptionId = subscriptionId };

       ListProfilesAndEndpoints(cdn);

       // Create CDN Profile
       CreateCdnProfile(cdn);

       // Create CDN Endpoint
       CreateCdnEndpoint(cdn);

       Console.WriteLine();

       // Purge CDN Endpoint
       PromptPurgeCdnEndpoint(cdn);

       // Delete CDN Endpoint
       PromptDeleteCdnEndpoint(cdn);

       // Delete CDN Profile
       PromptDeleteCdnProfile(cdn);

       Console.WriteLine("Press Enter to end program.");
       Console.ReadLine();
   }
   ```

5. Some of our other methods are going to prompt the user with "Yes/No" questions. Add the following method to make that a little easier:

    ```csharp
    private static bool PromptUser(string Question)
    {
        Console.Write(Question + " (Y/N): ");
        var response = Console.ReadKey();
        Console.WriteLine();
        if (response.Key == ConsoleKey.Y)
        {
            return true;
        }
        else if (response.Key == ConsoleKey.N)
        {
            return false;
        }
        else
        {
            // They pressed something other than Y or N.  Let's ask them again.
            return PromptUser(Question);
        }
    }
    ```

Now that the basic structure of our program is written, we should create the methods called by the `Main` method.

## Authentication

Before we can use the Azure CDN Management Library, we need to authenticate our service principal and obtain an authentication token. This method uses Active Directory Authentication Library to retrieve the token.

```csharp
private static AuthenticationResult GetAccessToken()
{
    AuthenticationContext authContext = new AuthenticationContext(authority);
    ClientCredential credential = new ClientCredential(clientID, clientSecret);
    AuthenticationResult authResult =
        authContext.AcquireTokenAsync("https://management.core.windows.net/", credential).Result;

    return authResult;
}
```

If you're using individual user authentication, the `GetAccessToken` method looks slightly different.

> [!IMPORTANT]
> Only use this code sample if you are choosing to have individual user authentication instead of a service principal.
>
>

```csharp
private static AuthenticationResult GetAccessToken()
{
    AuthenticationContext authContext = new AuthenticationContext(authority);
    AuthenticationResult authResult = authContext.AcquireTokenAsync("https://management.core.windows.net/",
        clientID, new Uri("http://<redirect URI>"), new PlatformParameters(PromptBehavior.RefreshSession)).Result;

    return authResult;
}
```

Be sure to replace `<redirect URI>` with the redirect URI you entered when you registered the application in Microsoft Entra ID.

## List CDN profiles and endpoints

Now we're ready to perform CDN operations. The first thing our method does is list all the profiles and endpoints in our resource group, and if it finds a match for the profile and endpoint names specified in our constants, makes a note for later so we don't try to create duplicates.

```csharp
private static void ListProfilesAndEndpoints(CdnManagementClient cdn)
{
    // List all the CDN profiles in this resource group
    var profileList = cdn.Profiles.ListByResourceGroup(resourceGroupName);
    foreach (Profile p in profileList)
    {
        Console.WriteLine("CDN profile {0}", p.Name);
        if (p.Name.Equals(profileName, StringComparison.OrdinalIgnoreCase))
        {
            // Hey, that's the name of the CDN profile we want to create!
            profileAlreadyExists = true;
        }

        //List all the CDN endpoints on this CDN profile
        Console.WriteLine("Endpoints:");
        var endpointList = cdn.Endpoints.ListByProfile(p.Name, resourceGroupName);
        foreach (Endpoint e in endpointList)
        {
            Console.WriteLine("-{0} ({1})", e.Name, e.HostName);
            if (e.Name.Equals(endpointName, StringComparison.OrdinalIgnoreCase))
            {
                // The unique endpoint name already exists.
                endpointAlreadyExists = true;
            }
        }
        Console.WriteLine();
    }
}
```

## Create CDN profiles and endpoints

Next, we create a profile.

```csharp
private static void CreateCdnProfile(CdnManagementClient cdn)
{
    if (profileAlreadyExists)
    {
        Console.WriteLine("Profile {0} already exists.", profileName);
    }
    else
    {
        Console.WriteLine("Creating profile {0}.", profileName);
        ProfileCreateParameters profileParms =
            new ProfileCreateParameters() { Location = resourceLocation, Sku = new Sku(SkuName.StandardVerizon) };
        cdn.Profiles.Create(profileName, profileParms, resourceGroupName);
    }
}
```

Once the profile is created, we create an endpoint.

```csharp
private static void CreateCdnEndpoint(CdnManagementClient cdn)
{
    if (endpointAlreadyExists)
    {
        Console.WriteLine("Profile {0} already exists.", profileName);
    }
    else
    {
        Console.WriteLine("Creating endpoint {0} on profile {1}.", endpointName, profileName);
        EndpointCreateParameters endpointParms =
            new EndpointCreateParameters()
            {
                Origins = new List<DeepCreatedOrigin>() { new DeepCreatedOrigin("Contoso", "www.contoso.com") },
                IsHttpAllowed = true,
                IsHttpsAllowed = true,
                Location = resourceLocation
            };
        cdn.Endpoints.Create(endpointName, endpointParms, profileName, resourceGroupName);
    }
}
```

> [!NOTE]
> The example above assigns the endpoint an origin named *Contoso* with a hostname `www.contoso.com`. You should change this to point to your own origin's hostname.
>
>

## Purge an endpoint

Assuming the endpoint has been created, one common task that we might want to perform in our program is purging the content in our endpoint.

```csharp
private static void PromptPurgeCdnEndpoint(CdnManagementClient cdn)
{
    if (PromptUser(String.Format("Purge CDN endpoint {0}?", endpointName)))
    {
        Console.WriteLine("Purging endpoint. Please wait...");
        cdn.Endpoints.PurgeContent(resourceGroupName, profileName, endpointName, new List<string>() { "/*" });
        Console.WriteLine("Done.");
        Console.WriteLine();
    }
}
```

> [!NOTE]
> In the example previously, the string `/*` denotes that I want to purge everything in the root of the endpoint path. This is equivalent to checking **Purge All** in the Azure portal's "purge" dialog.
>

## Delete CDN profiles and endpoints

The last methods delete our endpoint and profile.

```csharp
private static void PromptDeleteCdnEndpoint(CdnManagementClient cdn)
{
    if(PromptUser(String.Format("Delete CDN endpoint {0} on profile {1}?", endpointName, profileName)))
    {
        Console.WriteLine("Deleting endpoint. Please wait...");
        cdn.Endpoints.DeleteIfExists(endpointName, profileName, resourceGroupName);
        Console.WriteLine("Done.");
        Console.WriteLine();
    }
}

private static void PromptDeleteCdnProfile(CdnManagementClient cdn)
{
    if(PromptUser(String.Format("Delete CDN profile {0}?", profileName)))
    {
        Console.WriteLine("Deleting profile. Please wait...");
        cdn.Profiles.DeleteIfExists(profileName, resourceGroupName);
        Console.WriteLine("Done.");
        Console.WriteLine();
    }
}
```

## Running the program

We can now compile and run the program by clicking the **Start** button in Visual Studio.

![Program running](./media/cdn-app-dev-net/cdn-program-running-1.png)

When the program reaches the above prompt, you should be able to return to your resource group in the Azure portal and see that the profile has been created.

![Success!](./media/cdn-app-dev-net/cdn-success.png)

We can then confirm the prompts to run the rest of the program.

![Program completing](./media/cdn-app-dev-net/cdn-program-running-2.png)

## Next Steps

To find more documentation on the Azure CDN Management Library for .NET, view the [reference on MSDN](/dotnet/api/overview/azure/cdn).

Manage your CDN resources with [PowerShell](cdn-manage-powershell.md).
