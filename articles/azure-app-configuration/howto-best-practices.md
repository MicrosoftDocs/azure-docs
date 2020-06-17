---
title: Azure App Configuration best practices | Microsoft Docs
description: Learn how to best use Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: lisaguthrie
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: lcozzens
ms.custom: mvc
---

# Azure App Configuration best practices

This article discusses common patterns and best practices when you're using Azure App Configuration.

## Key groupings

App Configuration provides two options for organizing keys:

* Key prefixes
* Labels

You can use either one or both options to group your keys.

*Key prefixes* are the beginning parts of keys. You can logically group a set of keys by using the same prefix in their names. Prefixes can contain multiple components connected by a delimiter, such as `/`, similar to a URL path, to form a namespace. Such hierarchies are useful when you're storing keys for many applications, component services, and environments in one App Configuration store.

An important thing to keep in mind is that keys are what your application code references to retrieve the values of the corresponding settings. Keys shouldn't change, or else you'll have to modify your code each time that happens.

*Labels* are an attribute on keys. They're used to create variants of a key. For example, you can assign labels to multiple versions of a key. A version might be an iteration, an environment, or some other contextual information. Your application can request an entirely different set of key values by specifying another label. As a result, all key references remain unchanged in your code.

## Key-value compositions

App Configuration treats all keys stored with it as independent entities. App Configuration doesn't attempt to infer any relationship between keys or to inherit key values based on their hierarchy. You can aggregate multiple sets of keys, however, by using labels coupled with proper configuration stacking in your application code.

Let's look at an example. Suppose you have a setting named **Asset1**, whose value might vary based on the development environment. You create a key named "Asset1" with an empty label and a label named "Development". In the first label, you put the default value for **Asset1**, and you put a specific value for "Development" in the latter.

In your code, you first retrieve the key values without any labels, and then you retrieve the same set of key values a second time with the "Development" label. When you retrieve the values the second time, the previous values of the keys are overwritten. The .NET Core configuration system allows you to "stack" multiple sets of configuration data on top of each other. If a key exists in more than one set, the last set that contains it is used. With a modern programming framework, such as .NET Core, you get this stacking capability for free if you use a native configuration provider to access App Configuration. The following code snippet shows how you can implement stacking in a .NET Core application:

```csharp
// Augment the ConfigurationBuilder with Azure App Configuration
// Pull the connection string from an environment variable
configBuilder.AddAzureAppConfiguration(options => {
    options.Connect(configuration["connection_string"])
           .Select(KeyFilter.Any, LabelFilter.Null)
           .Select(KeyFilter.Any, "Development");
});
```

[Use labels to enable different configurations for different environments](./howto-labels-aspnet-core.md) provides a complete example.

## App Configuration bootstrap

To access an App Configuration store, you can use its connection string, which is available in the Azure portal. Because connection strings contain credential information, they're considered secrets. These secrets need to be stored in Azure Key Vault, and your code must authenticate to Key Vault to retrieve them.

A better option is to use the managed identities feature in Azure Active Directory. With managed identities, you need only the App Configuration endpoint URL to bootstrap access to your App Configuration store. You can embed the URL in your application code (for example, in the *appsettings.json* file). See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for details.

## App or function access to App Configuration

You can provide access to App Configuration for web apps or functions by using any of the following methods:

* Through the Azure portal, enter the connection string to your App Configuration store in the Application settings of App Service.
* Store the connection string to your App Configuration store in Key Vault and [reference it from App Service](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references).
* Use Azure managed identities to access the App Configuration store. For more information, see [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md).
* Push configuration from App Configuration to App Service. App Configuration provides an export function (in Azure portal and the Azure CLI) that sends data directly into App Service. With this method, you don't need to change the application code at all.

## Reduce requests made to App Configuration

Excessive requests to App Configuration can result in throttling or overage charges. To reduce the number of requests made:

* Increase the refresh timeout, especially if your configuration values do not change frequently. Specify a new refresh timeout using the [`SetCacheExpiration` method](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationrefreshoptions.setcacheexpiration).

* Watch a single *sentinel key*, rather than watching individual keys. Refresh all configuration only if the sentinel key changes. See [Use dynamic configuration in an ASP.NET Core app](enable-dynamic-configuration-aspnet-core.md) for an example.

* Use Azure Event Grid to receive notifications when configuration changes, rather than constantly polling for any changes. See [Route Azure App Configuration events to a web endpoint](./howto-app-configuration-event.md) for more information

## Importing configuration data into App Configuration

App Configuration offers the option to bulk [import](https://aka.ms/azconfig-importexport1) your configuration settings from your current configuration files using either the Azure portal or CLI. You can also use the same options to export values from App Configuration, for example between related stores. If you’d like to set up an ongoing sync with your GitHub repo, you can use our [GitHub Action](https://aka.ms/azconfig-gha2) so that you can continue using your existing source control practices while getting the benefits of App Configuration.

## Next steps

* [Keys and values](./concept-key-value.md)
