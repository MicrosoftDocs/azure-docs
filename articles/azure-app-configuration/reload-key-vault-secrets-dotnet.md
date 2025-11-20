---
title: Reload Secrets and Certificates Automatically
titleSuffix: Azure App Configuration
description: Find out how to use Azure App Configuration in your ASP.NET Core app to automatically reload secrets and certificates from Azure Key Vault.
services: azure-app-configuration
author: avanigupta
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/17/2025
ms.author: avgupta
ms.custom: sfi-ropc-nochange

# customer intent: As a developer, I want to use Azure App Configuration in my ASP.NET Core app to automatically reload Azure Key Vault secrets and certificates so that I don't have to restart my app to get the latest values from Key Vault.
---

# Reload secrets and certificates from Key Vault automatically

Azure App Configuration and Azure Key Vault are complementary services used side by side in many applications. App Configuration helps you use the services together by creating keys in your App Configuration store that reference secrets or certificates stored in Key Vault. Because Key Vault stores the public and private key pair of a certificate as a secret, your application can retrieve any certificate as a secret from Key Vault.

When secrets and certificates are rotated in Key Vault, your application should pick up the latest values. This article shows you how to automate the process of reloading Key Vault secrets and certificates without restarting your application.

## Prerequisites

- The ASP.NET Core web app that you update when you complete the steps in [Tutorial: Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md). This article shows you how to set up your application to automatically reload secrets and certificates from Key Vault. It builds on the tutorial for implementing Key Vault references in your code.
- The key vault that you create when you complete the steps in [Tutorial: Use Key Vault references in an ASP.NET Core app](./use-key-vault-references-dotnet-core.md).
- The [Microsoft.Azure.AppConfiguration.AspNetCore](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore) package, version 4.4.0 or later.

## Overview

As a good security practice, secrets and certificates should be rotated periodically. For more information, see [Automate the rotation of a secret for resources that use one set of authentication credentials](/azure/key-vault/secrets/tutorial-rotation) and [Tutorial: Configure certificate autorotation in Key Vault](/azure/key-vault/certificates/tutorial-rotate-certificates). After secrets and certificates are rotated in Key Vault, there are two ways to load these values without restarting your application:

- Update the value of a sentinel key to trigger the refresh of your entire configuration. This process reloads all Key Vault secrets and certificates. For more information, see [Monitoring a sentinel key](howto-best-practices.md#monitoring-a-sentinel-key) and [Azure App Configuration dynamic settings sample](/samples/dotnet/samples/azure-app-config-dynamic-settings/).
- Periodically reload some or all secrets and certificates from Key Vault.

When you use the first option, you need to update the value of the sentinel key in App Configuration whenever you rotate secrets and certificates in Key Vault. This approach works well when you want to force an immediate reload of secrets and certificates in your application. However, when secrets and certificates are rotated automatically in Key Vault, your application can experience errors if you don't update the value of the sentinel key in time.

The second option provides a way to automate this process. You can configure your application to reload secrets and certificates from Key Vault within your acceptable delay from the time of rotation. This article walks you through the second option.

## Add an automatically rotating certificate to Key Vault

To add an automatically rotating certificate to a key vault, follow the steps in [Tutorial: Configure certificate autorotation in Key Vault](/azure/key-vault/certificates/tutorial-rotate-certificates).

- Use the key vault that you create in the tutorial listed in [Prerequisites](#prerequisites).
- Name the certificate **ExampleCertificate**.

## Add a reference to the Key Vault certificate in App Configuration

1. Go to the [Azure portal](https://portal.azure.com), select **All resources**, and then select the App Configuration store that you use in the tutorial listed in [Prerequisites](#prerequisites).

1. Select **Configuration explorer**.

1. Select **Create** > **Key Vault reference**, and then enter the following values:
   - For **Key**: Enter **TestApp:Settings:KeyVaultCertificate**.
   - For **Label**: Leave the value blank.
   - For **Subscription**, **Resource group**, and **Key vault**: Enter the values you use when you create the key vault in the tutorial listed in [Prerequisites](#prerequisites).
   - For **Secret**: Select the secret named **ExampleCertificate** that you create in the previous section.
   - For **Secret Version**: Select **Latest version**.

> [!NOTE]
> If you reference a specific version, reloading the secret or certificate from Key Vault always returns the same value.

## Update code to reload Key Vault secrets and certificates

Go to the folder that contains the ASP.NET Core web app project that you update in the tutorial listed in [Prerequisites](#prerequisites).

Open *Program.cs*, and replace the call to the `AddAzureAppConfiguration` method with the call in the following code. The updated call uses the `SetSecretRefreshInterval` method to set up a refresh interval for your Key Vault certificate. With this change, your application reloads the public-private key pair for **ExampleCertificate** every 12 hours.

```csharp
string endpoint = builder.Configuration.GetValue<string>("Endpoints:AppConfiguration");

builder.Configuration.AddAzureAppConfiguration(options =>
{
    options.Connect(new Uri(endpoint), new DefaultAzureCredential());

    options.ConfigureKeyVault(keyVaultOptions =>
    {
        keyVaultOptions.SetCredential(new DefaultAzureCredential());
        keyVaultOptions.SetSecretRefreshInterval("TestApp:Settings:KeyVaultCertificate", TimeSpan.FromHours(12));
    });
});
```

The first argument in the `SetSecretRefreshInterval` method is the key of the Key Vault reference in App Configuration. This argument is optional. If you omit it, the specified refresh interval is applied to all secrets and certificates that don't have individual refresh intervals.

The second argument is the refresh interval. Its value specifies the frequency at which to reload your secrets and certificates from Key Vault, regardless of any changes to their values in Key Vault or App Configuration. If you want to reload secrets and certificates when their values change in App Configuration, you can use the `ConfigureRefresh` method to monitor them. For more information, see [Use dynamic configuration in an ASP.NET Core app](./enable-dynamic-configuration-aspnet-core.md).

Choose the refresh interval according to your acceptable delay after your secrets and certificates are updated in Key Vault. It's also important to consider the [Key Vault service limits](/azure/key-vault/general/service-limits) to avoid throttling.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next step

> [!div class="nextstepaction"]
> [Use managed identities to streamline access to App Configuration and Key Vault](./howto-integrate-azure-managed-service-identity.md)
