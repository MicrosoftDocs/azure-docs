---
title: Configure Linux ASP.NET Core apps
description: Learn how to configure a pre-built ASP.NET Core container for your app. This article shows the most common configuration tasks. 

ms.devlang: dotnet
ms.topic: article
ms.date: 08/13/2019

---

# Configure a Linux ASP.NET Core app for Azure App Service

ASP.NET Core apps must be deployed as compiled binaries. The Visual Studio publishing tool builds the solution and then deploys the compiled binaries directly, whereas the App Service deployment engine deploys the code repository first and then compiles the binaries.

This guide provides key concepts and instructions for ASP.NET Core developers who use a built-in Linux container in App Service. If you've never used Azure App Service, follow the [ASP.NET Core quickstart](quickstart-dotnetcore.md) and [ASP.NET Core with SQL Database tutorial](tutorial-dotnetcore-sqldb-app.md) first.

## Show .NET Core version

To show the current .NET Core version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported .NET Core versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --linux | grep DOTNETCORE
```

## Set .NET Core version

Run the following command in the [Cloud Shell](https://shell.azure.com) to set the .NET Core version to 2.1:

```azurecli-interactive
az webapp config set --name <app-name> --resource-group <resource-group-name> --linux-fx-version "DOTNETCORE|2.1"
```

## Customize build automation

If you deploy your app using Git or zip packages with build automation turned on, the App Service build automation steps through the following sequence:

1. Run custom script if specified by `PRE_BUILD_SCRIPT_PATH`.
1. Run `dotnet restore` to restore NuGet dependencies.
1. Run `dotnet publish` to build a binary for production.
1. Run custom script if specified by `POST_BUILD_SCRIPT_PATH`.

`PRE_BUILD_COMMAND` and `POST_BUILD_COMMAND` are environment variables that are empty by default. To run pre-build commands, define `PRE_BUILD_COMMAND`. To run post-build commands, define `POST_BUILD_COMMAND`.

The following example specifies the two variables to a series of commands, separated by commas.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PRE_BUILD_COMMAND="echo foo, scripts/prebuild.sh"
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings POST_BUILD_COMMAND="echo foo, scripts/postbuild.sh"
```

For additional environment variables to customize build automation, see [Oryx configuration](https://github.com/microsoft/Oryx/blob/master/doc/configuration.md).

For more information on how App Service runs and builds ASP.NET Core apps in Linux, see [Oryx documentation: How .NET Core apps are detected and built](https://github.com/microsoft/Oryx/blob/master/doc/runtimes/dotnetcore.md).

## Access environment variables

In App Service, you can [set app settings](../configure-common.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json#configure-app-settings) outside of your app code. Then you can access them in any class using the standard ASP.NET Core dependency injection pattern:

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
            // retrieve App Service app setting
            var myAppSetting = _configuration["MySetting"];
            // retrieve App Service connection string
            var myConnString = _configuration.GetConnectionString("MyDbConnection");
        }
    }
}
```

If you configure an app setting with the same name in App Service and in *appsettings.json*, for example, the App Service value takes precedence over the *appsettings.json* value. The local *appsettings.json* value lets you debug the app locally, but the App Service value lets your run the app in product with production settings. Connection strings work in the same way. This way, you can keep your application secrets outside of your code repository and access the appropriate values without changing your code.

## Get detailed exceptions page

When your ASP.NET app generates an exception in the Visual Studio debugger, the browser displays a detailed exception page, but in App Service that page is replaced by a generic **HTTP 500** error or **An error occurred while processing your request.** message. To display the detailed exception page in App Service, Add the `ASPNETCORE_ENVIRONMENT` app setting to your app by running the following command in the <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>.

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

## Deploy multi-project solutions

When you deploy an ASP.NET repository to the deployment engine with a *.csproj* file in the root directory, the engine deploys the project. When you deploy an ASP.NET repository with a *.sln* file in the root directory, the engine picks the first Web Site or Web Application Project it finds as the App Service app. It's possible for the engine not to pick the project you want.

To deploy a multi-project solution, you can specify the project to use in App Service in two different ways:

### Using .deployment file

Add a *.deployment* file to the repository root and add the following code:

```
[config]
project = <project-name>/<project-name>.csproj
```

### Using app settings

In the <a target="_blank" href="https://shell.azure.com">Azure Cloud Shell</a>, add an app setting to your App Service app by running the following CLI command. Replace *\<app-name>*, *\<resource-group-name>*, and *\<project-name>* with the appropriate values.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PROJECT="<project-name>/<project-name>.csproj"
```

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Open SSH session in browser

[!INCLUDE [Open SSH session in browser](../../../includes/app-service-web-ssh-connect-builtin-no-h.md)]

[!INCLUDE [robots933456](../../../includes/app-service-web-configure-robots933456.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: ASP.NET Core app with SQL Database](tutorial-dotnetcore-sqldb-app.md)

> [!div class="nextstepaction"]
> [App Service Linux FAQ](app-service-linux-faq.md)
