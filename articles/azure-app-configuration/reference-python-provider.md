---
title: Python Configuration Provider
titleSuffix: Azure App Configuration
description: Learn to load configurations and feature flags from the Azure App Configuration service in Python.
services: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.service: azure-app-configuration
ms.devlang: python
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 12/11/2025
#Customer intent: I want to learn how to use Azure App Configuration Python client library.
---

# Python configuration provider

:::image type="content" border="true" source="https://img.shields.io/pypi/v/azure-appconfiguration-provider.svg" alt-text="Python package":::

Azure App Configuration is a managed service that helps developers centralize their application configurations simply and securely. The Python configuration provider library enables loading configuration from an Azure App Configuration store in a managed way. This client library adds additional [functionality](./configuration-provider-overview.md#feature-development-status) on top of the Azure SDK for Python.

## Install the package

Install the Azure App Configuration Provider package with pip:

```bash
pip install azure-appconfiguration-provider
```

To use Microsoft Entra ID, Azure Identity is also needed.

```bash
pip install azure-identity
```


## Load configuration

The `load` function in the `azure-appconfiguration-provider` package is used to load configuration from Azure App Configuration. The `load` function allows you to either use Microsoft Entra ID (recommended) or a connection string to connect to the App Configuration store.

> [!NOTE]
> `azure-appconfiguration-provider` has both synchronous `from azure.appconfiguration.provider import load` and asynchronous `from azure.appconfiguration.provider.aio import load` versions. When using the async version, the async credential, `from azure.identity.aio import DefaultAzureCredential`, needs to be used.

### [Microsoft Entra ID](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

endpoint = "your-endpoint"
credential = DefaultAzureCredential()

# Connect to Azure App Configuration using a token credential and load all key-values with no label.
config = load(endpoint=endpoint, credential=credential)
print(config["message"]) # value of the key "message" from the App Configuration store
```

### [Connection string](#tab/connection-string)

```python
from azure.appconfiguration.provider import load

connection_string = "your-connection-string"

# Connect to Azure App Configuration using a connection string and load all key-values with no label.
config = load(connection_string=connection_string)
print(config["message"]) # value of the key "message" from the App Configuration store
```

---

The `load` function returns an instance of `AzureAppConfigurationProvider`, which is a dictionary-like object, contains all the configuration values loaded from the App Configuration store. By default, the provider loads all configuration values with no label from the store.

### JSON content type handling

You can [create JSON key-values](./howto-leverage-json-content-type.md#create-json-key-values-in-app-configuration) in App Configuration. When loading key-values from Azure App Configuration, the configuration provider automatically converts the key-values of valid JSON content type (for example application/json) into a deserialized Python object.

```json
{
    "key": "font",
    "label": null,
    "value": "{\r\n\t\"size\": 12,\r\n\t\"color\": \"red\"\r\n}",
    "content_type": "application/json"
}
```

This JSON content results in the key-value to be loaded as `{ size: 12, color: "red" }`.

```python
appConfig = load(endpoint, credential)
size = appConfig["font"]["size"]
color = appConfig["font"]["color"]
```

### Load specific key-values using selectors

By default, the `load` method loads all configurations with no label from the configuration store. You can configure the behavior of the `load` method through the optional parameter of `selects`, which is a list of `SettingSelector`s.


```python
from azure.appconfiguration.provider import load, SettingSelector
from azure.identity import DefaultAzureCredential

selects = [
    SettingSelector(key_filter="*", label_filter="\0"),  # Empty label
    SettingSelector(key_filter="*", label_filter="dev")  # 'dev' label
]
config = load(endpoint=endpoint, credential=DefaultAzureCredential(), selects=selects)
```

> [!NOTE]
> Key-values are loaded in the order in which the selectors are listed. If multiple selectors retrieve key-values with the same key, the value from the last one overrides any previously loaded value.

### Load configuration from snapshots

You can load configuration settings from [snapshots](./concept-snapshots.md) by using the `snapshot_name` parameter in `SettingSelector`. When you specify a snapshot name, all configuration settings from that snapshot are loaded. The `snapshot_name` parameter can't be used with `key_filter`, `label_filter`, or `tag_filters`.

```python
from azure.appconfiguration.provider import load, SettingSelector
from azure.identity import DefaultAzureCredential

snapshot_selects = [SettingSelector(snapshot_name="SnapshotName")]
config = load(endpoint=endpoint, credential=DefaultAzureCredential(), selects=snapshot_selects)
```

> [!NOTE]
> Snapshot support is available if you use version **2.3.0** or later of the `azure-appconfiguration-provider` package.
> Only snapshots created with composition type `Key` can be loaded using the configuration provider.

### Trimming keys

You can trim the prefix off of keys by providing a list of trimmed key prefixes to the `load` function, via the `trim_prefixes` parameter.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

trim_prefixes = ["App1/"]
config = load(endpoint=endpoint, credential=DefaultAzureCredential(), trim_prefixes=trim_prefixes)
print(config["message"])  # Access the key "message" instead of "/application/message"
```

## Configuration refresh

The provider can be configured to pull the latest settings from the App Configuration store without having to restart the application. You can use the `refresh_on` parameter to enable this behavior. The `refresh_on` parameter is a `List[WatchKey]`, which specifies the one or more key/labels to watch for changes. The loaded configuration is updated when any change of selected key-values is detected on the server. By default, a refresh interval of 30 seconds is used, but you can override it with the `refresh_interval` parameter.

The `on_refresh_success` callback is called only if a change is detected and no error happens. The `on_refresh_error` callback is called when a refresh fails.

```python
from azure.appconfiguration.provider import load, WatchKey
from azure.identity import DefaultAzureCredential

def my_callback_on_success():
    # Do something on success
    pass

def my_callback_on_fail(error):
    # Do something on fail
    pass

config = load(
    endpoint=endpoint,
    credential=DefaultAzureCredential(),
    refresh_on=[WatchKey("Sentinel")],
    refresh_interval=60,
    on_refresh_success=my_callback_on_success,
    on_refresh_error=my_callback_on_fail
)
```

Setting up `refresh_on` alone doesn't automatically refresh the configuration. You need to call the `refresh` method on `AzureAppConfigurationProvider` instance returned by the `load` method to trigger a refresh. 

```python
config.refresh()
```

This design prevents unnecessary requests to App Configuration when your application is idle. You should include the `refresh` call where your application activity occurs. This process is known as **activity-driven configuration refresh**. For example, you can call `refresh` when processing an incoming request or inside an iteration where you perform a complex task. If the refresh fails, an error is thrown, unless a `on_refresh_error` is provided. The `refresh` method is a no-op if the refresh interval has not elapsed. In addition, only one refresh check can happen at a time, returning as a no-op if a refresh is already in progress.

## Feature flag

You can [create feature flags](./manage-feature-flags.md#create-a-feature-flag) in Azure App Configuration. By default, the configuration provider doesn't load feature flags. You can enable loading and refreshing feature flags through the `feature_flags_enabled` parameter.

```python
config = load(endpoint=endpoint, credential=DefaultAzureCredential(), feature_flags_enabled=True)
alpha = config["feature_management"]["feature_flags"]["Alpha"]
print(alpha["enabled"])
```

By default, all feature flags with no label are loaded when `feature_flags_enabled` is set to `True`. If you want to load feature flags with a specific label, you can use the `feature_flag_selectors` parameter to filter the feature flags, which takes in a list of `SettingSelector` objects.

```python
from azure.appconfiguration.provider import load, SettingSelector

config = load(
    endpoint=endpoint, 
    credential=DefaultAzureCredential(), 
    feature_flags_enabled=True, 
    feature_flag_selectors=[SettingSelector(key_filter="*", label_filter="dev")]
)
alpha = config["feature_management"]["feature_flags"]["Alpha"]
print(alpha["enabled"])
```

> [!NOTE]
> To effectively consume and manage feature flags loaded from Azure App Configuration, install and use the [`featuremanagement`](https://pypi.org/project/featuremanagement/) library. This library provides a structured way to control feature behavior in your application.

### Feature management

The feature management library provides a way to develop and expose application functionality based on feature flags. The feature management library is designed to work together with the configuration provider library. The configuration provider loads all selected feature flags into the configuration under the `feature_flags` list of the `feature_management` section. The feature management library consumes and manages the loaded feature flags for your application.

The following example demonstrates how to integrate the `featuremanagement` library with the configuration provider to dynamically control API accessibility in an Express application based on the status of the `Beta` feature flag.

```python
from azure.appconfiguration.provider import load
from featuremanagement import FeatureManager


config = load(endpoint=endpoint, credential=DefaultAzureCredential(), feature_flags_enabled=True)
feature_manager = FeatureManager(config)

print(f"Beta is: {feature_manager.is_enabled("Beta")}")
```

For more information about how to use the Python feature management library, go to the [feature flag quickstart](./quickstart-feature-flag-python.md).

### Feature flag refresh

To enable refresh for feature flags, you need to set `feature_flag_refresh_enabled=True`. This parameter allows the provider to refresh feature flags the same way it refreshes configurations. Unlike configurations, all loaded feature flags are monitored for changes and cause a refresh. Refresh of configuration settings and feature flags are independent of each other. Both configuration settings and feature flags are updated by the `refresh` method, but a feature flag changing doesn't cause a refresh of configurations and vice versa. Also, if refresh for configuration settings isn't enabled, feature flags can still be enabled for refresh.

```python
config = load(
    endpoint=endpoint, 
    credential=DefaultAzureCredential(), 
    feature_flags_enabled=True, 
    feature_flag_refresh_enabled=True
)

# Later in your code
config.refresh()
```

## Key Vault reference

Azure App Configuration supports referencing secrets stored in Azure Key Vault. In App Configuration, you can create keys that map to secrets stored in Key Vault. The secrets are securely stored in Key Vault, but can be accessed like any other configuration once loaded.

The configuration provider library retrieves Key Vault references, just as it does for any other keys stored in App Configuration. Because the client recognizes the keys as Key Vault references, they have a unique content-type, and the client connects to Key Vault to retrieve their values for your application. You need to configure a way to connect to the Key Vault, either by providing a credential or by providing clients.

### With credentials

You can set the argument `keyvault_credential` with a credential, and all key vault references are resolved with it. The provider attempts to connect to any key vault referenced with the credential provided.

```python
from azure.appconfiguration.provider import load, AzureAppConfigurationKeyVaultOptions
from azure.identity import DefaultAzureCredential


config = load(endpoint=endpoint, credential=DefaultAzureCredential(), keyvault_credential=DefaultAzureCredential())
```

### With clients

You can set the argument `keyvault_client_configs` with a dictionary of client configurations.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

secret_clients = {
    key_vault_uri: {
        'credential': DefaultAzureCredential()
    }
}

config = load(endpoint=endpoint, credential=DefaultAzureCredential(), keyvault_client_configs=secret_clients)
```

> [!NOTE]
> Any extra properties provided are passed into the creation of the `SecretClient`.

### Secret resolver

If no credentials or clients are provided, a secret resolver can be used. Secret resolver provides a way to return any value you want to a key vault reference.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

def secret_resolver(uri):
    return "From Secret Resolver"

config = load(endpoint=endpoint, credential=DefaultAzureCredential(), secret_resolver=secret_resolver)
```

## Geo-replication

The Azure App Configuration Provider library automatically discovers the provided configuration store's replicas and uses the replicas if any issue arises. For more information, see [geo-replication](./howto-geo-replication.md).

Replica discovery is enabled by default. If you want to disable it, you can set `replica_discovery_enabled` to `False`.

```python
from azure.appconfiguration.provider import load
from azure.identity import DefaultAzureCredential

config = load(
    endpoint=endpoint, 
    credential=DefaultAzureCredential(), 
    replica_discovery_enabled=False
)
```

## Next steps

To learn how to use the Python configuration provider, continue to the following tutorial.

> [!div class="nextstepaction"]
> [Use dynamic configuration in Python](./enable-dynamic-configuration-python.md)

To see how to use the provider in a web application, check out our Django and Flask examples.

> [!div class="nextstepaction"]
> [Django example](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-django-webapp-sample)

> [!div class="nextstepaction"]
> [Flask example](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-flask-webapp-sample)