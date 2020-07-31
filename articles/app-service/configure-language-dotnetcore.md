---
title: Configure Windows ASP.NET Core apps
description: Learn how to configure a ASP.NET Core app in the native Windows instances of App Service. This article shows the most common configuration tasks. 

ms.devlang: dotnet
ms.topic: article
ms.date: 06/02/2020

---

# Configure a Windows ASP.NET Core app for Azure App Service

> [!NOTE]
> For ASP.NET in .NET Framework, see [Configure an ASP.NET app for Azure App Service](configure-language-dotnet-framework.md)

ASP.NET Core apps must be deployed to Azure App Service as compiled binaries. The Visual Studio publishing tool builds the solution and then deploys the compiled binaries directly, whereas the App Service deployment engine deploys the code repository first and then compiles the binaries. For information about Linux apps, see [Configure a Linux ASP.NET Core app for Azure App Service](containers/configure-language-dotnetcore.md).

This guide provides key concepts and instructions for ASP.NET Core developers. If you've never used Azure App Service, follow the [ASP.NET quickstart](app-service-web-get-started-dotnet.md) and [ASP.NET Core with SQL Database tutorial](app-service-web-tutorial-dotnetcore-sqldb.md) first.

## Show supported .NET Core runtime versions

In App Service, the Windows instances already have all the supported .NET Core versions installed. To show the .NET Core runtime and SDK versions available to you, navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and run the following command in the browser-based console:

```azurecli-interactive
dotnet --info
```

## Set .NET Core version

Set the target framework in the project file for your ASP.NET Core project. For more information, see [Select the .NET Core version to use](https://docs.microsoft.com/dotnet/core/versions/selection) in .NET Core documentation.

## Access environment variables

In App Service, you can [set app settings](configure-common.md#configure-app-settings) outside of your app code. Then you can access them in any class using the standard ASP.NET Core dependency injection pattern:

```csharp
using Microsoft.Extensions.Configuration;

namespace SomeNamespace 
{
    public class SomeClass
    {
        private IConfiguration _configuration;
    
        public SomeClass(IConfiguration configuration)
        {
            _configuration = configuration;
        }
    
        public SomeMethod()
        {
            // retrieve nested App Service app setting
            var myHierarchicalConfig = _configuration["My:Hierarchical:Config:Data"];
            // retrieve App Service connection string
            var myConnString = _configuration.GetConnectionString("MyDbConnection");
        }
    }
}
```

If you configure an app setting with the same name in App Service and in *appsettings.json*, for example, the App Service value takes precedence over the *appsettings.json* value. The local *appsettings.json* value lets you debug the app locally, but the App Service value lets your run the app in product with production settings. Connection strings work in the same way. This way, you can keep your application secrets outside of your code repository and access the appropriate values without changing your code.

> [!NOTE]
> Note the [hierarchical configuration data](https://docs.microsoft.com/aspnet/core/fundamentals/configuration/#hierarchical-configuration-data) in *appsettings.json* is accessed using the `:` delimiter that's standard to .NET Core. To override a specific hierarchical configuration setting in App Service, set the app setting name with the same delimited format in the key. you can run the following example in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings My:Hierarchical:Config:Data="some value"
```

## Deploy multi-project solutions

When a Visual Studio solution includes multiple projects, the Visual Studio publish process already includes selecting the project to deploy. When you deploy to the App Service deployment engine, such as with Git or with ZIP deploy, with build automation turned on, the App Service deployment engine picks the first Web Site or Web Application Project it finds as the App Service app. You can specify which project App Service should use by specifying the `PROJECT` app setting. For example, run the following in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings PROJECT="<project-name>/<project-name>.csproj"
```

## Access diagnostic logs

ASP.NET Core provides a [built-in logging provider for App Service](https://docs.microsoft.com/aspnet/core/fundamentals/logging/#azure-app-service). In *Program.cs* of your project, add the provider to your application through the `ConfigureLogging` extension method, as shown in the following example:

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureLogging(logging =>
        {
            logging.AddAzureWebAppDiagnostics();
        })
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```

You can then configure and generate logs with the [standard .NET Core pattern](https://docs.microsoft.com/aspnet/core/fundamentals/logging).

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

For more information on troubleshooting ASP.NET Core apps in App Service, see [Troubleshoot ASP.NET Core on Azure App Service and IIS](https://docs.microsoft.com/aspnet/core/test/troubleshoot-azure-iis)

## Get detailed exceptions page

When your ASP.NET Core app generates an exception in the Visual Studio debugger, the browser displays a detailed exception page, but in App Service that page is replaced by a generic **HTTP 500** error or **An error occurred while processing your request.** message. To display the detailed exception page in App Service, Add the `ASPNETCORE_ENVIRONMENT` app setting to your app by running the following command in the <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings ASPNETCORE_ENVIRONMENT="Development"
```

## Detect HTTPS session

In App Service, [SSL termination](https://wikipedia.org/wiki/TLS_termination_proxy) happens at the network load balancers, so all HTTPS requests reach your app as unencrypted HTTP requests. If your app logic needs to know if the user requests are encrypted or not, configure the Forwarded Headers Middleware in *Startup.cs*:

- Configure the middleware with [ForwardedHeadersOptions](https://docs.microsoft.com/dotnet/api/microsoft.aspnetcore.builder.forwardedheadersoptions) to forward the `X-Forwarded-For` and `X-Forwarded-Proto` headers in `Startup.ConfigureServices`.
- Add private IP address ranges to the known networks, so that the middleware can trust the App Service load balancer.
- Invoke the [UseForwardedHeaders](https://docs.microsoft.com/dotnet/api/microsoft.aspnetcore.builder.forwardedheadersextensions.useforwardedheaders) method in `Startup.Configure` before calling other middlewares.

Putting all three elements together, your code looks like the following example:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();

    services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("::ffff:10.0.0.0"), 104));
        options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("::ffff:192.168.0.0"), 112));
        options.KnownNetworks.Add(new IPNetwork(IPAddress.Parse("::ffff:172.16.0.0"), 108));
    });
}

public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.UseForwardedHeaders();

    ...

    app.UseMvc();
}
```

For more information, see [Configure ASP.NET Core to work with proxy servers and load balancers](https://docs.microsoft.com/aspnet/core/host-and-deploy/proxy-load-balancer).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: ASP.NET Core app with SQL Database](app-service-web-tutorial-dotnetcore-sqldb.md)
