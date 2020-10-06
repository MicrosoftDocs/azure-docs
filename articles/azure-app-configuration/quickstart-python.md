---
title: Quickstart for using Azure App Configuration with Python apps | Microsoft Docs
description: In this quickstart, use Python with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: drewbatgit
ms.service: azure-app-configuration
ms.topic: quickstart
ms.custom: devx-track-python
ms.date: 9/17/2020
ms.author: drewbat

#Customer intent: As a Python developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Python app with Azure App Configuration

In this quickstart, you will use Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Python 2.7, or 3.5 or later - For information on setting up Python on Windows, see the [Python on Windows documentation]( https://docs.microsoft.com/windows/python/)

## Create an App Configuration store

[!INCLUDE [azure-app-configuration-create](../../includes/azure-app-configuration-create.md)]

7. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

8. Select **Apply**.



## Setting up

1. In this tutorial, you'll create a new directory for the project named *app-configuration-quickstart*.

    ```console
    mkdir app-configuration-quickstart
    ```

1. Switch to the newly created *app-configuration-quickstart* directory.

    ```console
    cd app-configuration-quickstart
    ```

1. Install the Azure App Configuration client library by using the `pip install` command.

    ```console
    pip install azure-appconfiguration
    ```

1. Create a new file called *app-configuration-quickstart.py* in the *app-configuration-quickstart* directory and add the following code:

    ```python
    import os
    from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting
    
    try:
        print("Azure App Configuration - Python Quickstart")
        # Quickstart code goes here
    except Exception as ex:
        print('Exception:')
        print(ex)
    ```





## Configure your App Configuration connection string


1. Set an environment variable named **AZURE_APP_CONFIG_CONNECTION_STRING**, and set it to the access key to your App Configuration store. At the command line, run the following command:

    ```cmd
    setx AZURE_APP_CONFIG_CONNECTION_STRING "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:AZURE_APP_CONFIG_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```console
    export AZURE_APP_CONFIG_CONNECTION_STRING='connection-string-of-your-app-configuration-store'
    ```

2. Restart the command prompt to allow the change to take effect. Print out the value of the environment variable to validate that it is set properly.

## Code samples

The sample code snippets in this section show you how to perform common operations with the Azure App Configuration client library for Python. Add these snippets to the `try` block in *app-configuration-quickstart.py* file you created earlier.

* [Connect to an App Configuration store](#connect-to-an-app-configuration-store)
* [Get a configuration setting](#get-a-configuration-setting)
* [Set a configuration setting](#set-a-configuration-setting)
* [Get a list of configuration settings](#get-a-list-of-configuration-settings)
* [Lock a configuration setting](#lock-a-configuration-setting)
* [Unlock a configuration setting](#unlock-a-configuration-setting)
* [Update a configuration setting](#update-a-configuration-setting)
* [Delete a configuration setting](#delete-a-configuration-setting)


### Connect to an App Configuration store

The following code snippet creates an instance of **AzureAppConfigurationClient** using the connection string stored in your environment variables.

```python
    connection_string = os.getenv('AZURE_APP_CONFIG_CONNECTION_STRING')
    app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)
```

### Get a configuration setting

The following code snippet retrieves the configuration setting by `key` name.

```python
    retrieved_config_setting = app_config_client.get_configuration_setting(key = 'TestApp:Settings:Message')
    print("Retrieved configuration setting:")
    print("Key: " + retrieved_config_setting.key + ", Value: " + retrieved_config_setting.value)
```


### Set a configuration setting

Previously in this quickstart, you added a configuration key and value using the Azure portal. You can also add configuration settings using the Python client library. The following code snippet initialzies a **ConfigurationSetting** object with a key and value. Next, the configuration setting is added to the remote store by calling **add_configuration_setting** and passing in the **ConfigruationSetting** object. Add this code to the end of the `try` block.

```python
    config_setting = ConfigurationSetting(
        key='TestApp:Settings:NewSetting',
        value='New setting value'
    )

    added_config_setting = app_config_client.add_configuration_setting(config_setting)
```


### Get a list of configuration settings

The following code snippet retrieves a list of configuration settings. The `key_filter` and `label_filter` arguments can be provided to filter key-values based on `key` and `label` respectively. For more information on filtering, see how to [query configuration settings](./concept-key-value.md#query-key-values).

```python
    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)
```

### Lock a configuration setting

The following code snippet shows how to lock a configuration setting by calling the `set_read_only` method and providing the `ConfigurationSetting` object to be locked.

```python
    locked_config_setting = app_config_client.set_read_only(config_setting)
    print("Read-only status: ", locked_config_setting.read_only)
```

### Unlock a configuration setting

The following code snippet shows how to lock a configuration setting by calling the `set_read_only` method and providing the `ConfigurationSetting` object and specifying **False** for the optional parameter to indicate that the state of the setting should be set to unlocked.

```python
    unlocked_config_setting = app_config_client.set_read_only(config_setting, False)
    print("Read-only status: ", unlocked_config_setting.read_only)
```

### Update a configuration setting

The following code snippet updates an existing setting by calling **set_configuration_settings** and passing in the **ConfigurationSetting** object for which the value was updated in the previous step. You can use **set_configuration_settings** to update an existing setting or create a new setting. Add this code to the end of the `try` block.

```python
    updated_config_setting = app_config_client.set_configuration_setting(config_setting)
    
    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)
```

### Delete a configuration setting

The following code snippet deletes a configuration setting by calling the **delete_configuration_settings** method.

```python
    deleted_config_setting = app_config_client.delete_configuration_setting(
        key="TestApp:Settings:NewSetting"
    )
    
    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)
```

## Run the app

This app retrieves an configuration setting created through the Azure portal. Next, using the Azure App Configuration client library for Python, the app creates a new setting, retrieves a list of existing settings, locks and unlocks a setting, updates a setting, and finally deletes a setting.

The following is the full code listing.

```python
import os
from azure.appconfiguration import AzureAppConfigurationClient, ConfigurationSetting


try:
    print("Azure App Configuration - Python quickstart sample")
    # Quick start code goes here

    # Retrieve the connection string for use with the application. The app configuration
    # connection string is stored in an environment variable on the machine
    # running the application called AZURE_APP_CONFIG_CONNECTION_STRING. If the
    # environment variable is created after the application is launched in a
    # console or with Visual Studio, the shell or application needs to be
    # closed and reloaded to take the environment variable into account.
    connection_string = os.getenv('AZURE_APP_CONFIG_CONNECTION_STRING')

    app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)

    retrieved_config_setting = app_config_client.get_configuration_setting(key = 'TestApp:Settings:Message')
    print("Retrieved configuration setting:")
    print("Key: " + retrieved_config_setting.key + ", Value: " + retrieved_config_setting.value)

    config_setting = ConfigurationSetting(
        key='TestApp:Settings:NewSetting',
        value='New setting value'
    )

    added_config_setting = app_config_client.add_configuration_setting(config_setting)

    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)

    
    locked_config_setting = app_config_client.set_read_only(config_setting)
    print("Read-only status: ", locked_config_setting.read_only)

    # try:
    #     config_setting.value = "Updated value"
    #     app_config_client.set_configuration_setting(config_setting)
    # except Exception as ex:
    #     print('Exception:')
    #     print(ex)

    unlocked_config_setting = app_config_client.set_read_only(config_setting, False)
    print("Read-only status: ", unlocked_config_setting.read_only)

    updated_config_setting = app_config_client.set_configuration_setting(config_setting)
    
    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)


    deleted_config_setting = app_config_client.delete_configuration_setting(
        key="TestApp:Settings:NewSetting"
    )
    
    filtered_settings_list = app_config_client.list_configuration_settings( key_filter="TestApp*")
    print("Retrieved configuration settings:")
    for item in filtered_settings_list:
        print("Key: ", item.key, ", Value: ", item.value)

except Exception as ex:
    print('Exception:')
    print(ex)
```
## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and accessed it from Python. 

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for Python Developers](https://docs.microsoft.com/azure/python/)

* To learn more, see the [Azure App Configuration client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration).
