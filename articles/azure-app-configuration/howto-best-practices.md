---
title: Best practices for Azure App Configuration | Microsoft Docs
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

# Best practices for Azure App Configuration

### Key prefixes vs labels

Key prefixes offer a way to organize keys in Azure App Configuration by grouping them into a hierarchical namespace. This is useful when you are storing keys for many applications, component services and environments in one App Configuration store. An important thing to keep in mind is that keys are what your application code references to retrieve the values of the corresponding settings. Therefore, a key should not change or else you will have to modify code each time that happens.

Labels is an attribute on keys. They are used to create variants of a key. For example, you can apply labels to multiple versions of a key, where a version can represent an iteration, environment or some other contextual information. By leveraging labels, your application can request an entirely different set of key-values from App Configuration just by specifying another label. All key references can stay unchanged.

### Key value inheritance

App Configuration treats all keys stored with it as independent entities. It does not attempt to infer any relationship between keys or support inheritance of key values based on a namespace hierarchy. You can still realize inheritance using labels, coupled with configuration stacking in your application code.

Let's look at an example. You have a setting **Asset1** whose value may vary for the "Development" environment. You can create a key named "Asset1" with an empty label and wth a label called "Development". You put the default value for **Asset1** in the former and any specific value for "Development" in the latter. In your code, you first retrieve the values of keys without any label and then those with a "Development" label to overwrite any previous values of the same keys. If you use a modern programming framework such as .NET Core, you can get this stacking capability for free if you use a native configuration provider to access App Configuration. The following code snippet shows how you can implement stacking in an .NET Core application.

    ```csharp
    // Augment the ConfigurationBuilder with Azure App Configuration
    // Pull the connection string from an environment variable
    configBuilder.AddAzureAppConfiguration(options => {
        options.Connect(configuration["connection_string"])
               .Use(KeyFilter.Any, LabelFilter.Null)
               .Use(KeyFilter.Any, "Development");
    });
    ```

### Configuration data aggregation

Similar to *Key value inheritance* (above), you can use labels to achieve this. For example, you may have two versions of keys. You can label them as "v1" and "v2" and retrive them in order from your application.

### Bootstrapping to App Configuration

In order to connect to a App Configuration store, you can use its connection string. This is available in the Azure portal. Connection strings contain access credentials and are considered as secrets. They need to stored in a Key Vault. A better option is to use Azure Managed Identity. With this method, you only need to App Configuration endpoint URL to bootstrap access to your configuration store. You can embed the URL in your application code (e.g., in the *appsettings.json* file). See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for more details.

### Accessing App Configuration from App Service

You can enter the connection string to your App Configuration store into App Service through the Azure portal. You can also store it in Key Vault and [reference it from App Service](https://docs.microsoft.com/azure/app-service/app-service-key-vault-references). In addition, you can use Azure Managed Identity to access the configuration store if your application is hosted in the App Service or any one of [Azure services that support managed identities](http://aka.ms/AzureManagedIdentityStatus). See [Integrate with Azure managed identities](howto-integrate-azure-managed-service-identity.md) for more details.

Alternatively, you can push configuration data from App Configuration to App Service directly using the export function in either the Azure portal or CLI. Your application running in App Services does not need to be changed at all in this case.
