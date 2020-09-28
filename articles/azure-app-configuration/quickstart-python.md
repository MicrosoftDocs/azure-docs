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

6. Select **Configuration Explorer** > **Create** > **Key-value** to add the following key-value pairs:

    | Key | Value |
    |---|---|
    | TestApp:Settings:Message | Data from Azure App Configuration |

    Leave **Label** and **Content Type** empty for now.

7. Select **Apply**.

## Configure your environment

1. Use pip to install the Azure App Configuration client library for Python:

    ```python
    pip install azure-appconfiguration
    ```

2. Set an environment variable named **ConnectionString**, and set it to the access key to your App Configuration store. At the command line, run the following command:

    ```cmd
    setx ConnectionString "connection-string-of-your-app-configuration-store"
    ```

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:ConnectionString = "connection-string-of-your-app-configuration-store"
    ```

    If you use macOS or Linux, run the following command:

    ```console
    export ConnectionString='connection-string-of-your-app-configuration-store'
    ```

    Restart the command prompt to allow the change to take effect. Print out the value of the environment variable to validate that it is set properly.

## Connect to an App Configuration store

1. From the Python command line, import the environment variable dictionary from the **os** namespace.

    ```python
    from os import environ
    ```

2. Import the Azure App Configuration client object into the current namespace.

    ```python
    from azure.appconfiguration import AzureAppConfigurationClient
    ```

3. Get the connection string from the environment variable.

    ```python
    connection_string = environ['ConnectionString']
    ```

4. Create the client object using the connection string.

    ```python
    client = AzureAppConfigurationClient.from_connection_string(connection_string)
    ```

## Retrieve the configuration value

Retrieve the configuration value by calling **get_configuration_setting** and setting the **key** parameter to the key you configured in the Azure portal.

```python
fetched_config_setting = client.get_configuration_setting(key = 'TestApp:Settings:Message')
```

You can print out the **value** property of the retrieved setting to see that it contains the value you set for the key in the Azure portal. 

```python
print(fetched_config_setting.value)
```

> Output:
> ```python
> Data from Azure App Configuration
> ```



## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and accessed it from Python. 

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for Python Developers](https://docs.microsoft.com/azure/python/)

* To learn more, see the [Azure App Configuration client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/appconfiguration/azure-appconfiguration).
