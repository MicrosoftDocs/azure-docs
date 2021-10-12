---
title: Azure App Configuration best practices | Microsoft Docs
description: Learn best practices while using Azure App Configuration. Topics covered include key groupings, key-value compositions, App Configuration bootstrap, and more.
services: azure-app-configuration
documentationcenter: ''
author: AlexandraKemperMS
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: alkemper
ms.custom: "devx-track-csharp, mvc"
---

# Azure App Configuration best practices

This article discusses common patterns and best practices when you're using Azure App Configuration.

## Key groupings

App Configuration provides two options for organizing keys:

* Key prefixes
* Labels

You can use either one or both options to group your keys.

*Key prefixes* are the beginning parts of keys. You can logically group a set of keys by using the same prefix in their names. Prefixes can contain multiple components connected by a delimiter, such as `/`, similar to a URL path, to form a namespace. Such hierarchies are useful when you're storing keys for many applications and microservices in one App Configuration store.

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

## References to external data

App Configuration is designed to store any configuration data that you would normally save in configuration files or environment variables. However, some types of data may better live in other sources. For example, you would store secrets in Key Vault, files in Azure Storage, membership information in Azure AD groups, or customer lists in a database. You can still take advantage of App Configuration by saving a reference to external data in a key-value. When your application reads a reference, it loads the data from the referenced source. The App Configuration [Key Vault reference](use-key-vault-references-dotnet-core.md) feature is an example in this case. When you need to change to a new version of a secret or even a secret from a different Key Vault, you only need to update the Key Vault reference in App Configuration instead of updating and redeploying your entire application. Your application always refers to the secret in the name you configured in App Configuration with proper namespaces regardless of how the secret is named in Key Vault.

## App Configuration bootstrap

To access an App Configuration store, you can use its connection string, which is available in the Azure portal. Because connection strings contain credential information, they're considered secrets. These secrets need to be stored in Azure Key Vault, and your code must authenticate to Key Vault to retrieve them.

A better option is to use the managed identities feature in Azure Active Directory. With managed identities, you need only the App Configuration endpoint URL to bootstrap access to your App Configuration store. You can embed the URL in your application code (for example, in the *appsettings.json* file). See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for details.

## App or function access to App Configuration

You can provide access to App Configuration for Web Apps or Azure Functions by using any of the following methods:

* Through the Azure portal, enter the connection string to your App Configuration store in the Application settings of App Service.
* Store the connection string to your App Configuration store in Key Vault and [reference it from App Service](../app-service/app-service-key-vault-references.md).
* Use Azure managed identities to access the App Configuration store. For more information, see [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md).
* Push configuration from App Configuration to App Service. App Configuration provides an export function (in Azure portal and the Azure CLI) that sends data directly into App Service. With this method, you don't need to change the application code at all.

## Reduce requests made to App Configuration

Excessive requests to App Configuration can result in throttling or overage charges. To reduce the number of requests made:

* Increase the refresh timeout, especially if your configuration values do not change frequently. Specify a new refresh timeout using the [`SetCacheExpiration` method](/dotnet/api/microsoft.extensions.configuration.azureappconfiguration.azureappconfigurationrefreshoptions.setcacheexpiration).

* Watch a single *sentinel key*, rather than watching individual keys. Refresh all configuration only if the sentinel key changes. See [Use dynamic configuration in an ASP.NET Core app](enable-dynamic-configuration-aspnet-core.md) for an example.

* Use Azure Event Grid to receive notifications when configuration changes, rather than constantly polling for any changes. For more information, see [Route Azure App Configuration events to a web endpoint](./howto-app-configuration-event.md)

## Importing configuration data into App Configuration

App Configuration offers the option to bulk [import](./howto-import-export-data.md) your configuration settings from your current configuration files using either the Azure portal or CLI. You can also use the same options to export key-values from App Configuration, for example between related stores. If you’d like to set up an ongoing sync with your repo in GitHub or Azure DevOps, you can use our [GitHub Action](./concept-github-action.md) or [Azure Pipeline Push Task](./push-kv-devops-pipeline.md) so that you can continue using your existing source control practices while getting the benefits of App Configuration.

## Multi-region deployment in App Configuration

App Configuration is regional service. For applications with different configurations per region, storing these configurations in one instance can create a single point of failure. Deploying one App Configuration instances per region across multiple regions may be a better option. It can help with regional disaster recovery, performance, and security siloing. Configuring by region also improves latency and uses separated throttling quotas, since throttling is per instance. To apply disaster recovery mitigation, you can use [multiple configuration stores](./concept-disaster-recovery.md). 

## Client applications in App Configuration 

When you use App Configuration in client applications, ensure that you consider two major factors. First, if you're using the connection string in a client application, you risk exposing the access key of your App Configuration store to the public. Second, the typical scale of a client application might cause excessive requests to your App Configuration store, which can result in overage charges or throttling. For more information about throttling, see the [FAQ](./faq.yml#are-there-any-limits-on-the-number-of-requests-made-to-app-configuration).

To address these concerns, we recommend that you use a proxy service between your client applications and your App Configuration store. The proxy service can securely authenticate with your App Configuration store without a security issue of leaking authentication information. You can build a proxy service by using one of the App Configuration provider libraries, so you can take advantage of built-in caching and refresh capabilities for optimizing the volume of requests sent to App Configuration. For more information about using App Configuration providers, see articles in Quickstarts and Tutorials. The proxy service serves the configuration from its cache to your client applications, and you avoid the two potential issues that are discussed in this section.

## Next steps

* [Keys and values](./concept-key-value.md) 
