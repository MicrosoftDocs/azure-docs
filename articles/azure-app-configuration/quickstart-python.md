--- 
title: Using Azure App Configuration in Python apps with the Azure SDK for Python
description: This document shows examples of how to use the Azure SDK for Python to access your data in Azure App Configuration.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: sample
ms.custom: devx-track-python, mode-other, engagement-fy23, py-fresh-zinc
ms.date: 02/03/2025
ms.author: malev
#Customer intent: As a Python developer, I want to use the Azure SDK for Python to access my data in Azure App Configuration.
---
# Create a Python app with the Azure SDK for Python

This document shows examples of how to use the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration) to access your data in Azure App Configuration.

>[!TIP]
> App Configuration offers a Python provider library that is built on top of the Python SDK and is designed to be easier to use with richer features. It enables configuration settings to be used like a dictionary, and offers other features like configuration composition from multiple labels, key name trimming, and automatic resolution of Key Vault references. Go to the [Python quickstart](./quickstart-python-provider.md) to learn more.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).

## Create a key-value

Add the following key-value to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                        | Value                               |
|----------------------------|-------------------------------------|
| *TestApp:Settings:Message* | *Data from Azure App Configuration* |


## Set up the Python app

1. Create a new directory for the project named *app-configuration-example*.

    ```console
    mkdir app-configuration-example
    ```

1. Switch to the newly created *app-configuration-example* directory.

    ```console
    cd app-configuration-example
    ```

1. Install the Azure App Configuration client library by using the `pip install` command.

    ```console
    pip install azure-appconfiguration
    ```

1. Create a new file called *app-configuration-example.py* in the *app-configuration-example* directory and add the following code:

    ```python
    import os
    from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting
    
    try:
        print("Azure App Configuration - Python example")
        # Example code goes here
    except Exception as ex:
        print('Exception:')
        print(ex)
    ```

> [!NOTE]
> The code snippets in this example will help you get started with the App Configuration client library for Python. For your application, you should also consider handling exceptions according to your needs. To learn more about exception handling, please refer to our [Python SDK documentation](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration).

## Code samples

The sample code snippets in this section show you how to perform common operations with the App Configuration client library for Python. Add these code snippets to the `try` block in *app-configuration-example.py* file you created earlier.

> [!NOTE]
> The App Configuration client library refers to a key-value object as `ConfigurationSetting`. Therefore, in this article, the **key-values** in App Configuration store will be referred to as **configuration settings**.

Learn below how to:

- [Connect to an App Configuration store](#connect-to-an-app-configuration-store)
- [Get a configuration setting](#get-a-configuration-setting)
- [Add a configuration setting](#add-a-configuration-setting)
- [Get a list of configuration settings](#get-a-list-of-configuration-settings)
- [Lock a configuration setting](#lock-a-configuration-setting)
- [Unlock a configuration setting](#unlock-a-configuration-setting)
- [Update a configuration setting](#update-a-configuration-setting)
- [Delete a configuration setting](#delete-a-configuration-setting)

### Connect to an App Configuration store

The following code snippet creates an instance of **AzureAppConfigurationClient**. You can connect to your App Configuration store using Microsoft Entra ID (recommended), or a connection string.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()

endpoint = os.getenv('AZURE_APPCONFIG_ENDPOINT')
app_config_client = AzureAppConfigurationClient(base_url=endpoint, credential=credential)
```

### [Connection string](#tab/connection-string)

```python
connection_string = os.getenv('AZURE_APPCONFIG_CONNECTION_STRING')
app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)
```
---

### Get a configuration setting

The following code snippet retrieves a configuration setting by `key` name.

```python
retrieved_config_setting = app_config_client.get_configuration_setting(key='TestApp:Settings:Message')
print("\nRetrieved configuration setting:")
print("Key: " + retrieved_config_setting.key + ", Value: " + retrieved_config_setting.value)
```

### Add a configuration setting

The following code snippet creates a `ConfigurationSetting` object with `key` and `value` fields and invokes the `add_configuration_setting` method.
This method will throw an exception if you try to add a configuration setting that already exists in your store. If you want to avoid this exception, the [set_configuration_setting](#update-a-configuration-setting) method can be used instead.

```python
config_setting = ConfigurationSetting(
    key='TestApp:Settings:NewSetting',
    value='New setting value'
)
added_config_setting = app_config_client.add_configuration_setting(config_setting)
print("\nAdded configuration setting:")
print("Key: " + added_config_setting.key + ", Value: " + added_config_setting.value)
```

### Get a list of configuration settings

The following code snippet retrieves a list of configuration settings. The `key_filter` and `label_filter` arguments can be provided to filter key-values based on `key` and `label` respectively. For more information on filtering, see how to [query configuration settings](./concept-key-value.md#query-key-values).

```python
filtered_settings_list = app_config_client.list_configuration_settings(key_filter="TestApp*")
print("\nRetrieved list of configuration settings:")
for item in filtered_settings_list:
    print("Key: " + item.key + ", Value: " + item.value)
```

### Lock a configuration setting

The lock status of a key-value in App Configuration is denoted by the `read_only` attribute of the `ConfigurationSetting` object. If `read_only` is `True`, the setting is locked. The `set_read_only` method can be invoked with `read_only=True` argument to lock the configuration setting.

```python
locked_config_setting = app_config_client.set_read_only(added_config_setting, read_only=True)
print("\nRead-only status for " + locked_config_setting.key + ": " + str(locked_config_setting.read_only))
```

### Unlock a configuration setting

If the `read_only` attribute of a `ConfigurationSetting` is `False`, the setting is unlocked. The `set_read_only` method can be invoked with `read_only=False` argument to unlock the configuration setting.

```python
unlocked_config_setting = app_config_client.set_read_only(locked_config_setting, read_only=False)
print("\nRead-only status for " + unlocked_config_setting.key + ": " + str(unlocked_config_setting.read_only))
```

### Update a configuration setting

The `set_configuration_setting` method can be used to update an existing setting or create a new setting. The following code snippet changes the value of an existing configuration setting.

```python
added_config_setting.value = "Value has been updated!"
updated_config_setting = app_config_client.set_configuration_setting(added_config_setting)
print("\nUpdated configuration setting:")
print("Key: " + updated_config_setting.key + ", Value: " + updated_config_setting.value)
```

### Delete a configuration setting

The following code snippet deletes a configuration setting by `key` name.

```python
deleted_config_setting = app_config_client.delete_configuration_setting(key="TestApp:Settings:NewSetting")
print("\nDeleted configuration setting:")
print("Key: " + deleted_config_setting.key + ", Value: " + deleted_config_setting.value)
```

## Run the app

In this example, you created a Python app that uses the Azure App Configuration client library to retrieve a configuration setting created through the Azure portal, add a new setting, retrieve a list of existing settings, lock and unlock a setting, update a setting, and finally delete a setting.

At this point, your *app-configuration-example.py* file should have the following code:

### [Microsoft Entra ID (recommended)](#tab/entra-id)

```python
import os
from azure.identity import DefaultAzureCredential
from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting

try:
    print("Azure App Configuration - Python example")
    # Example code goes here

    credential = DefaultAzureCredential()
    endpoint = os.getenv('AZURE_APPCONFIG_ENDPOINT')
    app_config_client = AzureAppConfigurationClient(base_url=endpoint, credential=credential)

    retrieved_config_setting = app_config_client.get_configuration_setting(key='TestApp:Settings:Message')
    print("\nRetrieved configuration setting:")
    print("Key: " + retrieved_config_setting.key + ", Value: " + retrieved_config_setting.value)

    config_setting = ConfigurationSetting(
        key='TestApp:Settings:NewSetting',
        value='New setting value'
    )
    added_config_setting = app_config_client.add_configuration_setting(config_setting)
    print("\nAdded configuration setting:")
    print("Key: " + added_config_setting.key + ", Value: " + added_config_setting.value)

    filtered_settings_list = app_config_client.list_configuration_settings(key_filter="TestApp*")
    print("\nRetrieved list of configuration settings:")
    for item in filtered_settings_list:
        print("Key: " + item.key + ", Value: " + item.value)

    locked_config_setting = app_config_client.set_read_only(added_config_setting, read_only=True)
    print("\nRead-only status for " + locked_config_setting.key + ": " + str(locked_config_setting.read_only))

    unlocked_config_setting = app_config_client.set_read_only(locked_config_setting, read_only=False)
    print("\nRead-only status for " + unlocked_config_setting.key + ": " + str(unlocked_config_setting.read_only))

    added_config_setting.value = "Value has been updated!"
    updated_config_setting = app_config_client.set_configuration_setting(added_config_setting)
    print("\nUpdated configuration setting:")
    print("Key: " + updated_config_setting.key + ", Value: " + updated_config_setting.value)

    deleted_config_setting = app_config_client.delete_configuration_setting(key="TestApp:Settings:NewSetting")
    print("\nDeleted configuration setting:")
    print("Key: " + deleted_config_setting.key + ", Value: " + deleted_config_setting.value)

except Exception as ex:
    print('Exception:')
    print(ex)
```

### [Connection string](#tab/connection-string)

```python
import os
from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting

try:
    print("Azure App Configuration - Python example")
    # Example code goes here

    connection_string = os.getenv('AZURE_APPCONFIG_CONNECTION_STRING')
    app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)

    retrieved_config_setting = app_config_client.get_configuration_setting(key='TestApp:Settings:Message')
    print("\nRetrieved configuration setting:")
    print("Key: " + retrieved_config_setting.key + ", Value: " + retrieved_config_setting.value)

    config_setting = ConfigurationSetting(
        key='TestApp:Settings:NewSetting',
        value='New setting value'
    )
    added_config_setting = app_config_client.add_configuration_setting(config_setting)
    print("\nAdded configuration setting:")
    print("Key: " + added_config_setting.key + ", Value: " + added_config_setting.value)

    filtered_settings_list = app_config_client.list_configuration_settings(key_filter="TestApp*")
    print("\nRetrieved list of configuration settings:")
    for item in filtered_settings_list:
        print("Key: " + item.key + ", Value: " + item.value)

    locked_config_setting = app_config_client.set_read_only(added_config_setting, read_only=True)
    print("\nRead-only status for " + locked_config_setting.key + ": " + str(locked_config_setting.read_only))

    unlocked_config_setting = app_config_client.set_read_only(locked_config_setting, read_only=False)
    print("\nRead-only status for " + unlocked_config_setting.key + ": " + str(unlocked_config_setting.read_only))

    added_config_setting.value = "Value has been updated!"
    updated_config_setting = app_config_client.set_configuration_setting(added_config_setting)
    print("\nUpdated configuration setting:")
    print("Key: " + updated_config_setting.key + ", Value: " + updated_config_setting.value)

    deleted_config_setting = app_config_client.delete_configuration_setting(key="TestApp:Settings:NewSetting")
    print("\nDeleted configuration setting:")
    print("Key: " + deleted_config_setting.key + ", Value: " + deleted_config_setting.value)

except Exception as ex:
    print('Exception:')
    print(ex)
```

---

1. Configure an environment variable
    
    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    
    Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.
    
    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:
    
    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "endpoint-of-your-app-configuration-store"
    ```
    
    If you use PowerShell, run the following command:
    
    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "endpoint-of-your-app-configuration-store"
    ```
    
    If you use macOS or Linux, run the following command:
    
    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```
    
    ### [Connection string](#tab/connection-string)
    
    Set the environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access keys* of your store in the Azure portal.
    
    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:
    
    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```
    
    If you use PowerShell, run the following command:
    
    ```powershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```
    
    If you use macOS or Linux, run the following command:
    
    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```
    ---

1. After the environment variable is properly set, in your console window, navigate to the directory containing the *app-configuration-example.py* file and execute the following Python command to run the app:
    
    ```console
    python app-configuration-example.py
    ```
    
    You should see the following output:
    
    ```output
    Azure App Configuration - Python example
    
    Retrieved configuration setting:
    Key: TestApp:Settings:Message, Value: Data from Azure App Configuration
    
    Added configuration setting:
    Key: TestApp:Settings:NewSetting, Value: New setting value
    
    Retrieved list of configuration settings:
    Key: TestApp:Settings:Message, Value: Data from Azure App Configuration
    Key: TestApp:Settings:NewSetting, Value: New setting value
    
    Read-only status for TestApp:Settings:NewSetting: True
    
    Read-only status for TestApp:Settings:NewSetting: False
    
    Updated configuration setting:
    Key: TestApp:Settings:NewSetting, Value: Value has been updated!
    
    Deleted configuration setting:
    Key: TestApp:Settings:NewSetting, Value: Value has been updated!
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

This guide showed you how to use the Azure SDK for Python to access your data in Azure App Configuration.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration client library samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration/samples)

To learn how to use Azure App Configuration with Python apps, go to:

> [!div class="nextstepaction"]
> [Create a Python app with Azure App Configuration](./quickstart-python-provider.md)
