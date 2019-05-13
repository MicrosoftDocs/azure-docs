---
title: Azure App Configuration best practices | Microsoft Docs
description: Learn how to best use Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: yegu
ms.custom: mvc
---

# Azure App Configuration best practices

This article discusses common patterns and practices when using Azure App Configuration.

## Key groupings

App Configuration provides two options for organizing keys: key prefixes or labels. You can use either one or both.

Key prefixes are the beginning parts of keys. You can logically group a set of keys by using the same prefix in their names. Prefixes can contain multiple components connected together by a delimiter such as `/`, similar to a URL path, to form a namespace. Such hierarchies are useful when you are storing keys for many applications, component services and environments in one App Configuration store. An important thing to keep in mind is that keys are what your application code references to retrieve the values of the corresponding settings. A key should not change or else you will have to modify code each time that happens.

Labels is an attribute on keys. They are used to create variants of a key. For example, you can assign labels to multiple versions of a key. A version can be an iteration, environment or some other contextual information. Your application can request an entirely different set of key-values just by specifying another label. All key references can stay unchanged.

## Key-value compositions

App Configuration treats all keys stored with it as independent entities. It does not attempt to infer any relationship between keys or inherit key values based on their hierarchy. You can aggregate multiple sets of keys, however, using labels coupled with proper configuration stacking in your application code.

Let's look at an example. You have a setting **Asset1** whose value may vary for the "Development" environment. You can create a key named "Asset1" with an empty label and a label called "Development". You put the default value for **Asset1** in the former and any specific value for "Development" in the latter. In your code, you first retrieve the key values without any label and then those with a "Development" label to overwrite any previous values of the same keys. If you use a modern programming framework such as .NET Core, you can get this stacking capability for free if you use a native configuration provider to access App Configuration. The following code snippet shows how you can implement stacking in an .NET Core application.

```csharp
// Augment the ConfigurationBuilder with Azure App Configuration
// Pull the connection string from an environment variable
configBuilder.AddAzureAppConfiguration(options => {
    options.Connect(configuration["connection_string"])
           .Use(KeyFilter.Any, LabelFilter.Null)
           .Use(KeyFilter.Any, "Development");
});
```

## App Configuration bootstrap

To access an App Configuration store, you can use its connection string, which is available in the Azure portal. Connection strings contain credential information and are considered as secrets. They need to be stored in a Key Vault. A better option is to use Azure managed identity. With this method, you only need App Configuration endpoint URL to bootstrap access to your configuration store. You can embed the URL in your application code (for example, in the *appsettings.json* file). See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for more details.

## Web App or Function access to App Configuration

You can enter the connection string to your App Configuration store into the Application settings of App Service through the Azure portal. You can also store it in Key Vault and [reference it from App Service](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references). You can also use Azure managed identity to access the configuration store. See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for more details.

Alternatively, you can push configuration from App Configuration to App Service. App Configuration provides an export function (in Azure portal and CLI) that sends data directly into App Service. With this method, you do not need to change the application code at all.

## Next steps

* [Keys and values](./concept-key-value.md)
