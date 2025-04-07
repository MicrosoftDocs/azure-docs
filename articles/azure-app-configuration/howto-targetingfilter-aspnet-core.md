---
title: Roll out features to targeted audiences in an ASP.NET Core app
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences in an ASP.NET Core application.
ms.service: azure-app-configuration
ms.devlang: csharp
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.topic: how-to
ms.date: 12/02/2024
---

# Roll out features to targeted audiences in an ASP.NET Core application

In this guide, you'll use the targeting filter to roll out a feature to targeted audiences for your ASP.NET Core application. For more information about the targeting filter, see [Roll out features to targeted audiences](./howto-targetingfilter.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A feature flag with targeting filter. [Create the feature flag](./howto-targetingfilter.md).
- [.NET SDK 6.0 or later](https://dotnet.microsoft.com/download).

## Create a web application with a feature flag

In this section, you create a web application that allows users to sign in and use the *Beta* feature flag you created before.

1. Create a web application that authenticates against a local database using the following command.

   ```dotnetcli
   dotnet new webapp --auth Individual -o TestFeatureFlags
   ```

1. Navigate to the newly created *TestFeatureFlags* directory and add references to the following NuGet packages.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    dotnet add package Azure.Identity
    ```

    ### [Connection string](#tab/connection-string)

    ```dotnetcli
    dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
    dotnet add package Microsoft.FeatureManagement.AspNetCore
    ```
    ---

1. Create a user secret for the application by running the following commands.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)

    The command uses [Secret Manager](/aspnet/core/security/app-secrets) to store a secret named `Endpoints:AppConfiguration`, which stores the endpoint for your App Configuration store. Replace the `<your-App-Configuration-endpoint>` placeholder with your App Configuration store's endpoint. You can find the endpoint in your App Configuration store's **Overview** blade in the Azure portal.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set Endpoints:AppConfiguration "<your-App-Configuration-endpoint>"
    ```

    ### [Connection string](#tab/connection-string)

    The command uses [Secret Manager](/aspnet/core/security/app-secrets) to store a secret named `ConnectionStrings:AppConfiguration`, which stores the connection string for your App Configuration store. Replace the `<your-App-Configuration-connection-string>` placeholder with your App Configuration store's read-only connection string. You can find the connection string in your App Configuration store's **Access settings** in the Azure portal.

    ```dotnetcli
    dotnet user-secrets init
    dotnet user-secrets set ConnectionStrings:AppConfiguration "<your-App-Configuration-connection-string>"
    ```
    ---

1. Add Azure App Configuration and feature management to your application.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    1. You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    1. Update the *Program.cs* file with the following code.
    
        ``` C#
        // Existing code in Program.cs
        // ... ...
    
        using Azure.Identity;
    
        var builder = WebApplication.CreateBuilder(args);
    
        // Retrieve the endpoint
        string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration") 
            ?? throw new InvalidOperationException("The setting `Endpoints:AppConfiguration` was not found.");
        
        // Connect to Azure App Configuration and load all feature flags with no label
        builder.Configuration.AddAzureAppConfiguration(options =>
        {
            options.Connect(new Uri(endpoint), new DefaultAzureCredential())
                   .UseFeatureFlags();
        });
    
        // Add Azure App Configuration middleware to the container of services
        builder.Services.AddAzureAppConfiguration();
    
        // Add feature management to the container of services
        builder.Services.AddFeatureManagement();
    
        // The rest of existing code in Program.cs
        // ... ...
        ```

    ### [Connection string](#tab/connection-string)
    
    Update the *Program.cs* file with the following code. 

    ``` C#
    // Existing code in Program.cs
    // ... ...

    var builder = WebApplication.CreateBuilder(args);

    // Retrieve the connection string
    string connectionString = builder.Configuration.GetConnectionString("AppConfiguration")
        ?? throw new InvalidOperationException("The connection string 'AppConfiguration' was not found.");

    // Connect to Azure App Configuration and load all feature flags with no label
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString)
               .UseFeatureFlags();
    });

    // Add Azure App Configuration middleware to the container of services
    builder.Services.AddAzureAppConfiguration();

    // Add feature management to the container of services
    builder.Services.AddFeatureManagement();

    // The rest of existing code in Program.cs
    // ... ...
    ```

    ---

1. Enable configuration and feature flag refresh from Azure App Configuration with the App Configuration middleware.

    Update Program.cs withe the following code.

    ``` C#
    // Existing code in Program.cs
    // ... ...
    
    var app = builder.Build();

    // Use Azure App Configuration middleware for dynamic configuration refresh
    app.UseAzureAppConfiguration();

    // The rest of existing code in Program.cs
    // ... ...
    ```

1. Add a new empty Razor page named **Beta** under the Pages directory. It includes two files *Beta.cshtml* and *Beta.cshtml.cs*.

    ``` cshtml
    @page
    @model TestFeatureFlags.Pages.BetaModel
    @{
        ViewData["Title"] = "Beta Page";
    }

    <h1>This is the beta website.</h1>
    ```

1. Open *Beta.cshtml.cs*, and add the `FeatureGate` attribute to the `BetaModel` class.

    ``` C#
    using Microsoft.AspNetCore.Mvc.RazorPages;
    using Microsoft.FeatureManagement.Mvc;

    namespace TestFeatureFlags.Pages
    {
        [FeatureGate("Beta")]
        public class BetaModel : PageModel
        {
            public void OnGet()
            {
            }
        }
    }
    ```

1. Open *Pages/_ViewImports.cshtml*, and register the feature manager Tag Helper using an `@addTagHelper` directive.

    ``` cshtml
    @addTagHelper *, Microsoft.FeatureManagement.AspNetCore
    ```

1. Open *_Layout.cshtml* in the *Pages/Shared* directory. Insert a new `<feature>` tag in between the *Home* and *Privacy* navbar items, as shown in the highlighted lines below.

    :::code language="html" source="../../includes/azure-app-configuration-navbar.md" range="15-38" highlight="13-17":::

## Enable targeting for the web application

A targeting context is required for feature evaluation with targeting. You can provide it as a parameter to the `featureManager.IsEnabledAsync` API explicitly. In ASP.NET Core, the targeting context can also be provided through the service collection as an ambient context by implementing the [ITargetingContextAccessor](./feature-management-dotnet-reference.md#itargetingcontextaccessor) interface.

### Targeting Context Accessor

To provide the targeting context, pass your implementation type of the `ITargetingContextAccessor` to the `WithTargeting<T>` method. If no type is provided, a default implementation is used, as shown in the following code snippet. The default targeting context accessor utilizes `HttpContext.User.Identity.Name` as `UserId` and `HttpContext.User.Claims` of type [`Role`](/dotnet/api/system.security.claims.claimtypes.role#system-security-claims-claimtypes-role) for `Groups`. You can reference the [DefaultHttpTargetingContextAccessor](https://github.com/microsoft/FeatureManagement-Dotnet/blob/main/src/Microsoft.FeatureManagement.AspNetCore/DefaultHttpTargetingContextAccessor.cs) to implement your own if customization is needed. To learn more about implementing the `ITargetingContextAccessor`, see the [feature reference for targeting](./feature-management-dotnet-reference.md#itargetingcontextaccessor).

``` C#
// Existing code in Program.cs
// ... ...

// Add feature management to the container of services
builder.Services.AddFeatureManagement()
                .WithTargeting();

// The rest of existing code in Program.cs
// ... ...
```

> [!NOTE]
> For Blazor applications, see [instructions](./faq.yml#how-to-enable-feature-management-in-blazor-applications-or-as-scoped-services-in--net-applications) for enabling feature management as scoped services.

## Targeting filter in action

1. Build and run the application. Initially, the **Beta** item doesn't appear on the toolbar, because the _Default percentage_ option is set to 0.

    > [!div class="mx-imgBorder"]
    > ![User not logged in and Beta item not displayed](./media/feature-filters/beta-not-targeted-by-default.png)

1. Select the **Register** link in the upper right corner to create a new user account. Use an email address of `test@contoso.com`. On the **Register Confirmation** screen, select **Click here to confirm your account**.

1. Sign in as `test@contoso.com`, using the password you set when registering the account. 

    The **Beta** item now appears on the toolbar, because `test@contoso.com` is specified as a targeted user.

    > [!div class="mx-imgBorder"]
    > ![User logged in and Beta item displayed](./media/feature-filters/beta-targeted-by-user.png)

    Now sign in as `testuser@contoso.com`, using the password you set when registering the account. The **Beta** item doesn't appear on the toolbar, because `testuser@contoso.com` is specified as an excluded user.

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter-aspnet-core.md)

For the full feature rundown of the .NET feature management library, continue to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
