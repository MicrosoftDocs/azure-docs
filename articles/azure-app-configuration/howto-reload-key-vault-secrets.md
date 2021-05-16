---
title: Automatically reload secrets from Key Vault
titleSuffix: Azure App Configuration
description: Learn how to set up your application to automatically reload secrets from Key Vault.
services: azure-app-configuration
author: avanigupta
ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 05/17/2021
ms.author: avgupta


#Customer intent: I want my app to reload secrets or certificates from Key Vault without restarting my app.
---

# Automatically reload secrets from Key Vault

App Configuration and Key Vault are complementary services used side by side in most application deployments. App Configuration helps you use the services together by creating keys in your App Config store that reference secrets or certificates stored in Key Vault. Since Key Vault stores the public and private key pair of a certificate as a secret, your application can retrieve any certificate as a secret from Key Vault.

By using short-lived secrets or by increasing the frequency of secret rotation, you can prevent unauthorized access to your applications. Therefore, any secrets or certificates stored in Key Vault could be rotated automatically or on-demand (if there is a breach). This means that any legitimate application dependent on Key Vault secrets must start reading the new value of secrets to avoid running into access issue.

If you're using App Configuration client provider, there are two ways to update secret values in your application without restarting your application:
1. Update a sentinel key-value to trigger the refresh of your entire configuration, thereby reloading all Key Vault secrets. For more information, see how to [use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).
2. Periodically reload some/all secrets from Key Vault.

This tutorial focuses on the second option.

> [!Note]
> Currently, this functionality is only available in .NET configuration provider version 4.4.0 (or later). 


## Prerequisites

- This tutorial shows you how to set up your application to automatically reload secrets from Key Vault. It builds on the tutorial for implementing Key Vault references in your code. Before you continue, finish [Tutorial: Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md) first.

- [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) package v4.4.0 or later.


## Add an auto-rotating certificate to Key Vault

 Follow this tutorial to add an auto-rotating certificate called **ExampleCertificate** to the same vault from the previous tutorial: [Tutorial: Configure certificate auto-rotation in Key Vault](../key-vault/certificates/tutorial-rotate-certificates.md)


## Add a reference to the Key Vault certificate in App Configuration

1. In the Azure portal, select **All resources**, and then select the App Configuration store instance that you created in the previous tutorial.

1. Select **Configuration Explorer**.

1. Select **+ Create** > **Key vault reference**, and then specify the following values:
    - **Key**: Select **TestApp:Settings:KeyVaultCertificate**.
    - **Label**: Leave this value blank.
    - **Subscription**, **Resource group**, and **Key vault**: Enter the values corresponding to the Key Vault you created in the previous tutorial.
    - **Secret**: Select the secret named **ExampleCertificate** that you created in the previous section.
    - **Secret Version**: **Latest version**.

> [!Note]
> Reloading secrets only makes sense if you are referencing the latest version of a secret. If you reference a specific version, reloading the secret from Key Vault will always return the same value.


## Update code to reload Key Vault secrets and certificates

1. Update the `ConfigureKeyVault` method to set up refresh intervals for your Key Vault references using the `SetSecretRefreshInterval` method.

    #### [.NET 5.x](#tab/core5x)

    ```csharp
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();

                config.AddAzureAppConfiguration(options =>
                {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                            .ConfigureKeyVault(kv =>
                            {
                                kv.SetCredential(new DefaultAzureCredential());
                                kv.SetSecretRefreshInterval("TestApp:Settings:KeyVaultCertificate", TimeSpan.FromHours(12));
                                kv.SetSecretRefreshInterval(TimeSpan.FromDays(1));
                            });
                });
            })
            .UseStartup<Startup>());
    ```

    #### [.NET Core 3.x](#tab/core3x)

    ```csharp
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            webBuilder.ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();

                config.AddAzureAppConfiguration(options =>
                {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                            .ConfigureKeyVault(kv =>
                            {
                                kv.SetCredential(new DefaultAzureCredential());
                                kv.SetSecretRefreshInterval("TestApp:Settings:KeyVaultCertificate", TimeSpan.FromHours(12));
                                kv.SetSecretRefreshInterval(TimeSpan.FromDays(1));
                            });
                });
            })
            .UseStartup<Startup>());
    ```

    #### [.NET Core 2.x](#tab/core2x)

    ```csharp
    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, config) =>
            {
                var settings = config.Build();

                config.AddAzureAppConfiguration(options =>
                {
                    options.Connect(settings["ConnectionStrings:AppConfig"])
                            .ConfigureKeyVault(kv =>
                            {
                                kv.SetCredential(new DefaultAzureCredential());
                                kv.SetSecretRefreshInterval("TestApp:Settings:KeyVaultCertificate", TimeSpan.FromHours(12));
                                kv.SetSecretRefreshInterval(TimeSpan.FromDays(1));
                            });
                });
            })
            .UseStartup<Startup>();
    ```

    With these changes, your application will reload the public-private key pair for **ExampleCertificate** every 12 hours. All other Key Vault secrets loaded by your application will be reloaded every 24 hours (including the secret called **Message** created in the previous tutorial).


## Important notes

- `SetSecretRefreshInterval` method doesn't monitor the value of a key in App Configuration. For monitoring the value in App Configuration, use the `ConfigureRefresh` method to register keys for refresh. For more information, see how to [use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).
- The frequency of reloading secrets from Key Vault should be chosen appropriately based on your needs. If the refresh interval is too low, there's a risk of being throttled by Key Vault. For more information, refer to the [service limits for Key Vault](../key-vault/general/service-limits.md).


## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]


## Next steps

In this tutorial, you learned how to set up your application to automatically reload secrets from Key Vault. To learn how to add an Azure-managed service identity that streamlines access to App Configuration and Key Vault, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
