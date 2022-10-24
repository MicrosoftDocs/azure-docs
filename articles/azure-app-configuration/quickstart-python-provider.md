---
title: Quickstart for using Azure App Configuration with Python apps using the Python provider | Microsoft Docs
description: In this quickstart, create a Python app with the Azure App Configuration Python provider to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: maud-lv
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: quickstart
ms.custom: devx-track-python, mode-other
ms.date: 10/21/2022
ms.author: malev
#Customer intent: As a Python developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Python app with Azure App Configuration Python provider

In this quickstart, you will use the Python provider for Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration Python provider client library](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider).

The Python App Configuration provider is a library running on top of the Python SDK helping Python developers easily consume the App Configuration service for the configuration settings, like a dictionary.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 2.7,  3.6, or later - For information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

9. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key          | Value           |
    |--------------|-----------------|
    | message      | Hello           |
    | test.message | Hello test      |
    | my_json      | {"key":"value"} |

    Leave **Label** and **Content Type** empty.

10. Select **Apply**.

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

    # Connect to Azure App Configuration using a connection string.
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string)

    # Find the key "message" and print its value.
    print(config["message"])
    # Find the key "my_json" and print the value for "key" from the dictionary.
    print(config["my_json"]["key"])

    # Connect to Azure App Configuration using a connection string and trimmed key prefixes.
    trimmed = {"test."}
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string, trimmed_key_prefixes=trimmed)
    # From the keys with trimmed prefixes, find a key with "message" and print its value.
    print(config["message"])

    # Connect to Azure App Configuration using SettingSelector.
    selects = {SettingSelector("message*", "\0")}
    config = AzureAppConfigurationProvider.load(
        connection_string=connection_string, selects=selects)

   # Print True or False to indicate if "message" is found in Azure App Configuration.
    print("message found: " + str("message" in config))
    print("test.message found: " + str("test.message" in config))
    ```

> [!NOTE]
> The code snippets in this quickstart will help you get started with the App Configuration client library for Python. For your application, you should also consider handling exceptions according to your needs. To learn more about exception handling, please refer to our [Python SDK documentation](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration).

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

    You should see the following output:

    ```Output
    Hello
    value
    Hello test
    message found: True
    test.message found: False
    ```

## Code samples

The sample code snippets in this section show how to perform common operations with the App Configuration client library for Python. Add these code snippets to the *app-configuration-quickstart.py* file you created earlier.

> [!NOTE]
> The App Configuration client library refers to a key-value object as `ConfigurationSetting`. Therefore, in this article, the **key-values** in App Configuration store will be referred to as **configuration settings**.

Learn below how to:

- [Connect to an App Configuration store](#connect-to-an-app-configuration-store)
- [Get a configuration setting](#get-a-configuration-setting)
- [Add a configuration setting](#add-a-configuration-setting)
- [Get a list of configuration settings](#get-a-list-of-configuration-settings)
- [Update a configuration setting](#update-a-configuration-setting)
- [Delete a configuration setting](#delete-a-configuration-setting)

### Connect to an App Configuration store

Add the following code to your python file to create an instance of **AzureAppConfigurationClient** using the connection string stored in your environment variables.

```python
    from azure.appconfiguration import AzureAppConfigurationClient

    connection_string = os.getenv('AZURE_APPCONFIG_CONNECTION_STRING')
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

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values from a Python app.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Azure App Configuration Python provider](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider)
