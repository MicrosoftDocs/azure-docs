---
title: Reload secrets and certificates automatically
titleSuffix: Azure App Configuration
description: Learn how to set up your application to automatically reload secrets and certificates from Key Vault.
services: azure-app-configuration
author: avanigupta
ms.assetid: 
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 05/25/2021
ms.author: avgupta


#Customer intent: I want my app to reload secrets or certificates from Key Vault without restarting my app.
---

# Reload secrets and certificates from Key Vault automatically

App Configuration and Key Vault are complementary services used side by side in many applications. App Configuration helps you use the services together by creating keys in your App Configuration store that reference secrets or certificates stored in Key Vault. Since Key Vault stores the public and private key pair of a certificate as a secret, your application can retrieve any certificate as a secret from Key Vault.

As a good security practice, [secrets](../key-vault/secrets/tutorial-rotation.md) and [certificates](../key-vault/certificates/tutorial-rotate-certificates.md) should be rotated periodically. Once they have been rotated in Key Vault, you would want your application to pick up the latest secret and certificate values. There are two ways to achieve this without restarting your application:
- Update a sentinel key-value to trigger the refresh of your entire configuration, thereby reloading all Key Vault secrets and certificates. For more information, see how to [use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).
- Periodically reload some or all secrets and certificates from Key Vault.

In the first option, you will have to update the sentinel key-value in App Configuration whenever you rotate secrets and certificates in Key Vault. This approach works well when you want to force an immediate reload of secrets and certificates in your application. However, when secrets and certificates are rotated automatically in Key Vault, your application may experience errors if you don't update the sentinel key-value in time. The second option allows you to completely automate this process. You can configure your application to reload secrets and certificates from Key Vault within your acceptable delay from the time of rotation. This tutorial will walk you through the second option.

## Prerequisites

- This tutorial shows you how to set up your application to automatically reload secrets and certificates from Key Vault. It builds on the tutorial for implementing Key Vault references in your code. Before you continue, finish [Tutorial: Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md) first.

- [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) package v4.4.0 or later.


## Add an auto-rotating certificate to Key Vault

 Follow the [Tutorial: Configure certificate auto-rotation in Key Vault](../key-vault/certificates/tutorial-rotate-certificates.md) to add an auto-rotating certificate called **ExampleCertificate** to the Key Vault created in the previous tutorial.


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
> If you reference a specific version, reloading the secret or certificate from Key Vault will always return the same value.


## Update code to reload Key Vault secrets and certificates

In your *Program.cs* file, update the `AddAzureAppConfiguration` method to set up a refresh interval for your Key Vault certificate using the `SetSecretRefreshInterval` method. With this change, your application will reload the public-private key pair for **ExampleCertificate** every 12 hours.

```csharp
config.AddAzureAppConfiguration(options =>
{
    options.Connect(settings["ConnectionStrings:AppConfig"])
            .ConfigureKeyVault(kv =>
            {
                kv.SetCredential(new DefaultAzureCredential());
                kv.SetSecretRefreshInterval("TestApp:Settings:KeyVaultCertificate", TimeSpan.FromHours(12));
            });
});
```

The first argument in `SetSecretRefreshInterval` method is the key of the Key Vault reference in App Configuration. This argument is optional. If the key parameter is omitted, the refresh interval will apply to all those secrets and certificates which do not have individual refresh intervals.

Refresh interval defines the frequency at which your secrets and certificates will be reloaded from Key Vault, regardless of any changes to their values in Key Vault or App Configuration. If you want to reload secrets and certificates when their value changes in App Configuration, you can monitor them using the `ConfigureRefresh` method. For more information, see how to [use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).

Choose the refresh interval according to your acceptable delay after your secrets and certificates have been updated in Key Vault. It's also important to consider the [Key Vault service limits](../key-vault/general/service-limits.md) to avoid being throttled.


## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]


## Next steps

In this tutorial, you learned how to set up your application to automatically reload secrets and certificates from Key Vault. To learn how to use Managed Identity to streamline access to App Configuration and Key Vault, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
