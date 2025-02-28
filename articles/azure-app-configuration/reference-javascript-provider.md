---
title: JavaScript Configuration Provider
titleSuffix: Azure App Configuration
description: Learn to load configurations and feature flags from the Azure App Configuration service in JavaScript.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.devlang: javascript
ms.custom: devx-track-javascript
ms.topic: tutorial
ms.date: 02/02/2025
#Customer intent: I want to learn how to use Azure App Configuration JavaScript client library.
---

# JavaScript Configuration Provider

[![configuration-provider-npm-package](https://img.shields.io/npm/v/@azure/app-configuration-provider?label=@azure/app-configuration-provider)](https://www.npmjs.com/package/@azure/app-configuration-provider)

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely. The JavaScript configuration provider library enables loading configuration from an Azure App Configuration store in a managed way. This client library adds additional functionality above the Azure SDK for JavaScript.

## Load configuration

The `load` method exported in the `@azure/app-configuration-provider` package is used to load configuration from the Azure App Configuration. The `load` method allows you to either use Microsoft Entra ID or connection string to connect to the App Configuration store.

### [Microsoft Entra ID](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role.

```javascript
const { load } = require("@azure/app-configuration-provider");
const { DefaultAzureCredential } = require("@azure/identity");
const endpoint = process.env.AZURE_APPCONFIG_ENDPOINT;
const credential = new DefaultAzureCredential(); // For more information, see https://learn.microsoft.com/azure/developer/javascript/sdk/credential-chains#use-defaultazurecredential-for-flexibility

async function run() {
    // Connect to Azure App Configuration using a token credential and load all key-values with no label.
    const settings = await load(endpoint, credential);
    console.log('settings.get("message"):', settings.get("message"));
}

run();
```

### [Connection string](#tab/connection-string)

```javascript
const { load } = require("@azure/app-configuration-provider");
const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

async function run() {
    // Connect to Azure App Configuration using a connection string and load all key-values with no label.
    const settings = await load(connectionString);
    console.log('settings.get("message"):', settings.get("message"));
}

run();
```

---

The `load` method returns an instance of `AzureAppConfiguration` type which is defined as follows:

```typescript
type AzureAppConfiguration = {
    refresh(): Promise<void>;
    onRefresh(listener: () => any, thisArg?: any): Disposable;
} & IGettable & ReadonlyMap<string, any> & IConfigurationObject;
```

For more information about `refresh` and `onRefresh` methods, see the [Configuration refresh](#configuration-refresh) section.

### Consume configuration

The `AzureAppConfiguration` type extends the following interfaces:

- `IGettable`

    ```typescript
    interface IGettable {
        get<T>(key: string): T | undefined;
    }
    ```

    The `IGettable` interface provides `get` method to retrieve the value of a key-value from the Map-styled data structure.

    ```typescript
    const settings = await load(endpoint, credential);
    const fontSize = settings.get("app:font:size"); // value of the key "app:font:size" from the App Configuration store
    ```

- `ReadonlyMap`

    The `AzureAppConfiguration` type also extends the [`ReadonlyMap`](https://typestrong.org/typedoc-auto-docs/typedoc/interfaces/TypeScript.ReadonlyMap.html) interface, providing read-only access to key-value pairs.

- `IConfigurationObject`

    ```typescript
    interface IConfigurationObject {
        constructConfigurationObject(options?: ConfigurationObjectConstructionOptions): Record<string, any>;
    }
    ```

    The `IConfigurationObject` interface provides `constructConfigurationObject` method to construct a configuration object based on a Map-styled data structure and hierarchical keys. The optional `ConfigurationObjectConstructionOptions` parameter can be used to specify the separator for converting hierarchical keys to object properties. By default, the separator is `"."`.

    ```typescript
    interface ConfigurationObjectConstructionOptions {
        separator?: "." | "," | ";" | "-" | "_" | "__" | "/" | ":"; // supported separators
    }
    ```

   In JavaScript, objects or maps are commonly used as the primary data structures to represent configurations. The JavaScript configuration provider library supports both of the configuration approaches, providing developers with the flexibility to choose the option that best fits their needs.

    ```typescript
    const settings = await load(endpoint, credential);
    const settingsObj = settings.constructConfigurationObject({separator: ":"});
    const fontSize1 = settings.get("app:font:size"); // map-style configuration representation
    const fontSize2 = settingsObj.app.font.size; // object-style configuration representation
    ```

### Load specific key-values using selectors

By default, the `load` method will load all configurations with no label from the configuration store. You can configure the behavior of the `load` method through the optional parameter of [`AzureAppConfigurationOptions`](https://github.com/Azure/AppConfiguration-JavaScriptProvider/blob/main/src/AzureAppConfigurationOptions.ts) type.

To refine or expand the configurations loaded from the App Configuration store, you can specify the key or label selectors under the `AzureAppConfigurationOptions.selectors` property.

```typescript
const settings = await load(endpoint, credential, {
    selectors: [
        { // load the subset of keys starting with "app1." prefix and "test" label
            keyFilter: "app1.*",
            labelFilter: "test"
        },
        { // load the subset of keys starting with "dev" label"
            labelFilter: "dev*"
        }
    ]
});
```

> [!NOTE]
> Key-values are loaded in the order in which the selectors are listed. If multiple selectors retrieve key-values with the same key, the value from the last one will override any previously loaded value.

### Trim prefix from keys

You can trim the prefix off of keys by providing a list of trimmed key prefixes to the `AzureAppConfigurationOptions.trimKeyPrefixes` property.

```typescript
const settings = await load(endpoint, credential, {
    selectors: [{
        keyFilter: "app.*"
    }],
    trimKeyPrefixes: ["app."]
});
```

## Key Vault reference

Azure App Configuration supports referencing secrets stored in Azure Key Vault. In App Configuration, you can create keys that map to secrets stored in Key Vault. The secrets are securely stored in Key Vault, but can be accessed like any other configuration once loaded.

The configuration provider library retrieves Key Vault references, just as it does for any other keys stored in App Configuration. Because the client recognizes the keys as Key Vault references, they have a unique content-type, and the client will connect to Key Vault to retrieve their values for your application. You need to configure `AzureAppConfigurationOptions.KeyVaultOptions` property with the proper credential to allow the configuration provider to connect to Azure Key Vault.

```typescript
const credential = new DefaultAzureCredential();
const settings = await load(endpoint, credential, {
    keyVaultOptions: {
        credential: credential
    }
});
```

You can also provide `SecretClient` instance directly to `KeyVaultOptions`. In this way, you can customize the options while creating `SecretClient`.

```typescript
const { SecretClient } = require("@azure/keyvault-secrets");

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(keyVaultUrl, credential, {
    serviceVersion: "7.0",
});
const settings = await load(endpoint, credential, {
    keyVaultOptions: {
        secretClients: [ secretClient ]
    }
});
```

You can also set `secretResolver` property to locally resolve secrets that don’t have a Key Vault associated with them.

```typescript
const resolveSecret = (url) => "From Secret Resolver";
const settings = await load(endpoint, credential, {
    keyVaultOptions: {
        secretResolver: resolveSecret
    }
});
```

## Configuration refresh

Dynamic refresh for the configurations lets you pull their latest values from the App Configuration store without having to restart the application. You can set `AzureAppConfigurationOptions.refreshOptions` to enable the refresh and configure refresh options. The loaded configuration will be updated when any change of selected key-values is detected on the server. By default, a refresh interval of 30 seconds is used, but you can override it with the `refreshIntervalInMs` property.

```typescript
const settings = await load(endpoint, credential, {
    refreshOptions: {
        enabled: true,
        refreshIntervalInMs: 15_000
    }
});
```

Setting up `refreshOptions` alone won't automatically refresh the configuration. You need to call the `refresh` method on `AzureAppConfiguration` instance returned by the `load` method to trigger a refresh. 

```typescript
// this call is not blocking, the configuration will be updated asynchronously
settings.refresh();
```

This design prevents unnecessary requests to App Configuration when your application is idle. You should include the `refresh` call where your application activity occurs. This is known as **activity-driven configuration refresh**. For example, you can call `refresh` when processing an incoming request or inside an iteration where you perform a complex task.

```typescript
const server = express();
// Use an express middleware to refresh configuration whenever a request comes in
server.use((req, res, next) => {
    settings.refresh();
    next();
})
```

Even if the refresh call fails for any reason, your application will continue to use the cached configuration. Another attempt will be made when the configured refresh interval has passed and the refresh call is triggered by your application activity. Calling `refresh` is a no-op before the configured refresh interval elapses, so its performance impact is minimal even if it's called frequently.

### Custom refresh callback

The `onRefresh` method lets you custom callback functions that will be invoked each time the local configuration is successfully updated with changes from the Azure App Configuration store. It returns a Disposable object, which you can use to remove the registered callback

```typescript
const settings = await load(endpoint, credential, {
    refreshOptions: {
        enabled: true
    }
});
const disposer = settings.onRefresh(() => {
    console.log("Config refreshed.");
});

settings.refresh();
// Once the refresh is successful, the callback function you registered will be executed.
// In this example, the message "Config refreshed" will be printed.

disposer.dispose();
```

### Refresh on sentinel key (Legacy)

A sentinel key is a key that you update after you complete the change of all other keys. The configuration provider will monitor the sentinel key instead of all selected key-values. When a change is detected, your app refreshes all configuration values.

```typescript
const settings = await load(endpoint, credential, {
    refreshOptions: {
        enabled: true,
        watchedSettings: [
            { key: "sentinel" }
        ]
    }
});
```

For more information about refresh configuration, go to [Use dynamic configuration in JavaScript](./enable-dynamic-configuration-javascript.md).

## Feature flag

You can [create feature flags](./manage-feature-flags.md#create-a-feature-flag) in Azure App Configuration. By default, the feature flags will not be loaded by configuration provider. You can enable loading and refreshing feature flags through `AzureAppConfigurationOptions.featureFlagOptions` property when calling the `load` method.

```typescript
const settings = await load(endpoint, credential, {
    featureFlagOptions: {
        enabled: true,
        selectors: [ { keyFilter: "*", labelFilter: "Prod" } ],
        refresh: {
            enabled: true, // the refresh for feature flags need to be enbaled in addition to key-values
            refreshIntervalInMs: 10_000
        }
    }
});
```

> [!NOTE]
> If `featureFlagOptions` is enabled and no selector is specified, the configuration provider will load all feature flags with no label from the App Configuration store.

### Feature management

Feature management library provides a way to develop and expose application functionality based on feature flags. The feature management library is designed to work in conjunction with the configuration provider library. The configuration provider will load all selected feature flags into the configuration under the `feature_flags` list of the `feature_management` section. The feature management library will consume and manage the loaded feature flags for your application. 

For more information about how to use the JavaScript feature management library, go to the [feature flag quickstart](./quickstart-feature-flag-javascript.md).

## Geo-replication

For information about using geo-replication, go to [Enable geo-replication](./howto-geo-replication.md).

## Next steps

To learn how to use the JavaScript configuration provider, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Use dynamic configuration in JavaScript](./enable-dynamic-configuration-javascript.md)
