---
title: Quickstart for using Azure App Configuration with Python apps | Microsoft Docs
description: In this quickstart, create a Python app with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: quickstart
ms.custom: devx-track-python, mode-other, 
ms.date: 9/19/2022
ms.author: malev
#Customer intent: As a Python developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Python app with Azure App Configuration

In this quickstart, you will use Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 2.7,  3.6, or later - For information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

7. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key          | Value               |
    |--------------|---------------------|
    | message      | Hi                  |
    | test.message | Hi with test prefix |
    | my_json      | {"key":"value"}     |

    Leave **Label** and **Content Type** empty.

8. Select **Apply**.

## Set up the Python app

1. Create a new directory for the project named *app-configuration-quickstart*.

    ```console
    mkdir app-configuration-quickstart
    ```

1. Switch to the newly created *app-configuration-quickstart* directory.

    ```console
    cd app-configuration-quickstart
    ```

1. Install the Azure App Configuration provider by using the `pip install` command.

    ```console
    pip install azure-appconfiguration.provider
    ```

1. Create a new file called *app-configuration-quickstart.py* in the *app-configuration-quickstart* directory and add the following code:

    ```python
    from azure.appconfiguration.provider import (
        AzureAppConfigurationProvider,
        SettingSelector
    )
    import os

    connection_string = os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING")

    # Connect to Azure App Configuration using a connection string
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string)

    # Find the key "message" and print its value
    print(config["message"])
    # Find the key "my_json" and print the value for "key" from the dictionary
    print(config["my_json"]["key"])

    # Connect to Azure App Configuration using a connection string and trimmed key prefixes
    trimmed = {"test."}
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string, trimmed_key_prefixes=trimmed)
    # From the keys with trimmed prefixes, find a key with "message" and print its value
    print(config["message"])

    # Connect to Azure App Configuration using SettingSelector
    selects = {SettingSelector("message*", "\0")}
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string, selects=selects)

    print("message found: " + str("message" in config))
    print("test.message found: " + str("test.message" in config))
    ```

> [!NOTE]
> The code snippets in this quickstart will help you get started with the App Configuration client library for Python. For your application, you should also consider handling exceptions according to your needs. To learn more about exception handling, please refer to our [Python SDK documentation](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration).

## Configure your App Configuration connection string

1. Set an environment variable named **AZURE_APP_CONFIG_CONNECTION_STRING**, and set it to the access key to your App Configuration store. At the command line, run the following command:

    ### [Windows command prompt](#tab/windowscommandprompt)

    To build and run the app locally using the Windows command prompt, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "connection-string-of-your-app-configuration-store"
    ```

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```azurepowershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "<app-configuration-store-connection-string>"
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```console
    export AZURE_APPCONFIG_CONNECTION_STRING='<app-configuration-store-connection-string>'
    ```

    ### [Linux](#tab/linux)

    If you use Linux, run the following command and replace `<app-configuration-store-connection-string>` with the connection string of your app configuration store:

    ```console
    export AZURE_APPCONFIG_CONNECTION_STRING='<app-configuration-store-connection-string>'
   ```

1. Restart the command prompt to allow the change to take effect. Print out the value of the environment variable to validate that it is set properly with the command below.

    ### [Windows command prompt](#tab/windowscommandprompt)

    Using the Windows command prompt, run the following command:

    ```cmd
    printenv AZURE_APPCONFIG_CONNECTION_STRING
    ```

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command:

    ```console
    echo "$AZURE_APPCONFIG_CONNECTION_STRING"
    ```

    ### [Linux](#tab/linux)

    If you use Linux, run the following command:

    ```console
    echo "$AZURE_APPCONFIG_CONNECTION_STRING"

1. After the build successfully completes, run the following command to run the app locally:

    ```python
    python app-configuration-quickstart.py
    ```

## Code samples

The sample code snippets in this section show you how to perform common operations with the App Configuration client library for Python. Add these code snippets to the `try` block in *app-configuration-quickstart.py* file you created earlier.

> [!NOTE]
> The App Configuration client library refers to a key-value object as `ConfigurationSetting`. Therefore, in this article, the **key-values** in App Configuration store will be referred to as **configuration settings**.

- [Quickstart: Create a Python app with Azure App Configuration](#quickstart-create-a-python-app-with-azure-app-configuration)
  - [Prerequisites](#prerequisites)
  - [Create an App Configuration store](#create-an-app-configuration-store)
  - [Setting up the Python app](#set-up-the-python-app)
  - [Configure your App Configuration connection string](#configure-your-app-configuration-connection-string)
  - [Code samples](#code-samples)
    - [Connect to an App Configuration store](#connect-to-an-app-configuration-store)
    - [Get a configuration setting](#get-a-configuration-setting)
    - [Add a configuration setting](#add-a-configuration-setting)
    - [Get a list of configuration settings](#get-a-list-of-configuration-settings)
    - [Lock a configuration setting](#lock-a-configuration-setting)
    - [Unlock a configuration setting](#unlock-a-configuration-setting)
    - [Update a configuration setting](#update-a-configuration-setting)
    - [Delete a configuration setting](#delete-a-configuration-setting)
  - [Run the app](#run-the-app)
  - [Clean up resources](#clean-up-resources)
  - [Next steps](#next-steps)

### Connect to an App Configuration store

The following code snippet creates an instance of **AzureAppConfigurationClient** using the connection string stored in your environment variables.

```python
    connection_string = os.getenv('AZURE_APP_CONFIG_CONNECTION_STRING')
    app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)
```

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

In this quickstart, you created a Python app that uses the Azure App Configuration client library to retrieve a configuration setting created through the Azure portal, add a new setting, retrieve a list of existing settings, lock and unlock a setting, update a setting, and finally delete a setting.

At this point, your *app-configuration-quickstart.py* file should have the following code:

```python
import os
from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting

try:
    print("Azure App Configuration - Python Quickstart")
    # Quickstart code goes here

    connection_string = os.getenv('AZURE_APP_CONFIG_CONNECTION_STRING')
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

In your console window, navigate to the directory containing the *app-configuration-quickstart.py* file and execute the following Python command to run the app:

```console
python app-configuration-quickstart.py
```

You should see the following output:

```output
Azure App Configuration - Python Quickstart

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

In this quickstart, you created a new App Configuration store and learned how to access key-values from a Python app.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration client library samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration/samples)
