---
title: Integrate with Azure managed identities | Microsoft Docs
description: Learn how to use Azure managed identities to authenticate with and gain access to Azure App Configuration
ms.service: azure-app-configuration
author: lisaguthrie

ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 12/29/2019
ms.author: lcozzens

---
# Integrate with Azure Managed Identities

Azure Active Directory [managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) help simplify secrets management for your cloud application. With a managed identity, you can set up your code to use the service principal that was created for the Azure service it runs on. You use a managed identity instead of a separate credential stored in Azure Key Vault or a local connection string. 

Azure App Configuration and its .NET Core, .NET Framework, and Java Spring client libraries have managed identity support built into them. Although you aren't required to use it, the managed identity eliminates the need for an access token that contains secrets. Your code can access the App Configuration store using only the service endpoint. You can embed this URL in your code directly without the concern of exposing any secret.

This tutorial shows how you can take advantage of the managed identity to access App Configuration. It builds on the web app introduced in the quickstarts. Before you continue, finish [Create an ASP.NET Core app with App Configuration](./quickstart-aspnet-core-app.md) first.

In addition, this tutorial optionally shows how you can use the managed identity in conjunction with App Configuration's Key Vault references. This allows you to seamlessly access secrets stored in Key Vault as well as configuration values in App Configuration. If you wish to explore this capability, finish [Use Key Vault References with ASP.NET Core](./use-key-vault-references-dotnet-core.md) first.

You can use any code editor to do the steps in this tutorial. [Visual Studio Code](https://code.visualstudio.com/) is an excellent option available on the Windows, macOS, and Linux platforms.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Grant a managed identity access to App Configuration.
> * Configure your app to use a managed identity when you connect to App Configuration.
> * Optionally, configure your app to use a managed identity when you connect to Key Vault through an App Configuration Key Vault reference.

## Prerequisites

To complete this tutorial, you must have:

* [.NET Core SDK](https://www.microsoft.com/net/download/windows).
* [Azure Cloud Shell configured](https://docs.microsoft.com/azure/cloud-shell/quickstart).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Add a managed identity

To set up a managed identity in the portal, you first create an application and then enable the feature.

1. Create an App Services instance in the [Azure portal](https://portal.azure.com) as you normally do. Go to it in the portal.

2. Scroll down to the **Settings** group in the left pane, and select **Identity**.

3. On the **System assigned** tab, switch **Status** to **On** and select **Save**.

4. Answer **Yes** when prompted to enable system assigned managed identity.

    ![Set managed identity in App Service](./media/set-managed-identity-app-service.png)

## Grant access to App Configuration

1. In the [Azure portal](https://portal.azure.com), select **All resources** and select the App Configuration store that you created in the quickstart.

1. Select **Access control (IAM)**.

1. On the **Check access** tab, select **Add** in the **Add role assignment** card UI.

1. Under **Role**, select **App Configuration Data Reader**. Under **Assign access to**, select **App Service** under **System assigned managed identity**.

1. Under **Subscription**, select your Azure subscription. Select the App Service resource for your app.

1. Select **Save**.

    ![Add a managed identity](./media/add-managed-identity.png)

1. Optional: If you wish to grant access to Key Vault as well, follow the directions in [Provide Key Vault authentication with a managed identity](https://docs.microsoft.com/azure/key-vault/managed-identity).

## Use a managed identity

 > [!IMPORTANT]
 > `CreateHostBuilder` replaces `CreateWebHostBuilder` in .NET Core 3.0.  Select the correct syntax based on your environment.

1. Add a reference to the *Azure.Identity* package:

    ```cli
    dotnet add package Azure.Identity --version 1.1.0
    ```

1. Find the URL to your App Configuration store by going into its configuration screen in the Azure portal, then clicking on the **Access Keys** tab.

1. Open *appsettings.json*, and add the following script. Replace *\<service_endpoint>*, including the brackets, with the URL to your App Configuration store. 

    ```json
    "AppConfig": {
        "Endpoint": "<service_endpoint>"
    }
    ```

1. Open *Program.cs*, and add a reference to the `Azure.Identity` namespace:

    ```csharp-interactive
    using Azure.Identity;
    ```

1. If you wish to access only values stored directly in App Configuration, update the `CreateWebHostBuilder` method by replacing the `config.AddAzureAppConfiguration()` method.

### Update CreateWebHostBuilder for .NET Core 2.x

 ```csharp-interactive
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();
                config.AddAzureAppConfiguration(options =>
                    options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential()));
            })
            .UseStartup<Startup>();
 ```

### Update CreateHostBuilder for .NET Core 3.x

```csharp-interactive
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
        {
            var settings = config.Build();
                config.AddAzureAppConfiguration(options =>
                    options.Connect(new Uri(settings["AppConfig:Endpoint"]), new ManagedIdentityCredential()));
            })
            .UseStartup<Startup>());
```


4. If you wish to use App Configuration values as well as Key Vault references, open *Program.cs*, and update the `CreateWebHostBuilder` method as shown below. This creates a new `KeyVaultClient` using an `AzureServiceTokenProvider` and passes this reference to a call to the `UseAzureKeyVault` method.

### Update CreateWebHostBuilder with Azure Key Vault for .NET Core 2.x

```csharp-interactive
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var settings = config.Build();
                    AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
                    KeyVaultClient kvClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
                    
                    config.AddAzureAppConfiguration(options => options.ConnectWithManagedIdentity(settings["AppConfig:Endpoint"])).UseAzureKeyVault(kvClient));
                })
                .UseStartup<Startup>();
```

### Update CreateHostBuilder with Azure Key Vault for .NET Core 3.x

```csharp-interactive
    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
        {
            var settings = config.Build();
                    AzureServiceTokenProvider azureServiceTokenProvider = new AzureServiceTokenProvider();
                    KeyVaultClient kvClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider.KeyVaultTokenCallback));
                    
                    config.AddAzureAppConfiguration(options => options.ConnectWithManagedIdentity(settings["AppConfig:Endpoint"])).UseAzureKeyVault(kvClient));
                })
                .UseStartup<Startup>());
```

You can now access Key Vault references just like any other App Configuration key. The config provider will use the `KeyVaultClient` that you configured to authenticate to Key Vault and retrieve the value.

[!INCLUDE [Prepare repository](../../includes/app-service-deploy-prepare-repo.md)]

## Deploy from local Git

The easiest way to enable local Git deployment for your app with the Kudu build server is to use [Azure Cloud Shell](https://shell.azure.com).

### Configure a deployment user

[!INCLUDE [Configure a deployment user](../../includes/configure-deployment-user-no-h.md)]

### Enable local Git with Kudu
If you don't have a local git repository for your app, you'll need to initialize one. To do this, run the following commands from your app's project directory:

```cmd
git init
git add .
git commit -m "Initial version"
```

To enable local Git deployment for your app with the Kudu build server, run [`az webapp deployment source config-local-git`](/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-config-local-git) in Cloud Shell.

```azurecli-interactive
az webapp deployment source config-local-git --name <app_name> --resource-group <group_name>
```

This command gives you something similar to the following output:

```json
{
  "url": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git"
}
```

### Deploy your project

Back in the _local terminal window_, add an Azure remote to your local Git repository. Replace _\<url>_ with the URL of the Git remote that you got from [Enable local Git with Kudu](#enable-local-git-with-kudu).

```bash
git remote add azure <url>
```

Push to the Azure remote to deploy your app with the following command. When you're prompted for a password, enter the password you created in [Configure a deployment user](#configure-a-deployment-user). Don't use the password you use to sign in to the Azure portal.

```bash
git push azure master
```

You might see runtime-specific automation in the output, such as MSBuild for ASP.NET, `npm install` for Node.js, and `pip install` for Python.

### Browse to the Azure web app

Browse to your web app by using a browser to verify that the content is deployed.

```bash
http://<app_name>.azurewebsites.net
```

![App running in App Service](../app-service/media/app-service-web-tutorial-dotnetcore-sqldb/azure-app-in-browser.png)

## Use managed identity in other languages

App Configuration providers for .NET Framework and Java Spring also have built-in support for managed identity. In these cases, use your App Configuration store's URL endpoint instead of its full connection string when you configure a provider. For example, for the .NET Framework console app created in the quickstart, specify the following settings in the *App.config* file:

```xml
    <configSections>
        <section name="configBuilders" type="System.Configuration.ConfigurationBuildersSection, System.Configuration, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" restartOnExternalChanges="false" requirePermission="false" />
    </configSections>

    <configBuilders>
        <builders>
            <add name="MyConfigStore" mode="Greedy" endpoint="${Endpoint}" type="Microsoft.Configuration.ConfigurationBuilders.AzureAppConfigurationBuilder, Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration" />
            <add name="Environment" mode="Greedy" type="Microsoft.Configuration.ConfigurationBuilders.EnvironmentConfigBuilder, Microsoft.Configuration.ConfigurationBuilders.Environment" />
        </builders>
    </configBuilders>

    <appSettings configBuilders="Environment,MyConfigStore">
        <add key="AppName" value="Console App Demo" />
        <add key="Endpoint" value ="Set via an environment variable - for example, dev, test, staging, or production endpoint." />
    </appSettings>
```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps
In this tutorial, you added an Azure managed identity to streamline access to App Configuration and improve credential management for your app. To learn more about how to use App Configuration, continue to the Azure CLI samples.

> [!div class="nextstepaction"]
> [CLI samples](./cli-samples.md)