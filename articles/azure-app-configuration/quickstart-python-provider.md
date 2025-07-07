---
title: Quickstart for using Azure App Configuration with Python apps | Microsoft Learn
description: In this quickstart, create a Python app with the Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: quickstart
ms.custom: devx-track-python, mode-other, engagement-fy23
ms.date: 12/03/2024
ms.author: mametcal
#Customer intent: As a Python developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Python app with Azure App Configuration

In this quickstart, you will use the Python provider for Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration Python provider client library](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider).

The Python App Configuration provider is a library running on top of the [Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration), helping Python developers easily consume the App Configuration service. It enables configuration settings to be used like a dictionary.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)

## Add key-values

Add the following key-values to the App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value             | Label       | Content type       |
|----------------|-------------------|-------------|--------------------|
| *message*      | *Hello*           | Leave empty | Leave empty        |
| *test.message* | *Hello test*      | Leave empty | Leave empty        |
| *my_json*      | *{"key":"value"}* | Leave empty | *application/json* |

## Console applications
In this section, you will create a console application and load data from your App Configuration store.

### Connect to App Configuration
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
    pip install azure-appconfiguration-provider
    ```

1. Create a new file called *app-configuration-quickstart.py* in the *app-configuration-quickstart* directory and add the following code:

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    You use the `DefaultAzureCredential` to authenticate to your App Configuration store. Follow the [instructions](./concept-enable-rbac.md#authentication-with-token-credentials) to assign your credential the **App Configuration Data Reader** role. Be sure to allow sufficient time for the permission to propagate before running your application.

    ```python
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    from azure.identity import DefaultAzureCredential
    import os

    endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT")

    # Connect to Azure App Configuration using Microsoft Entra ID.
    config = load(endpoint=endpoint, credential=credential)
    credential = DefaultAzureCredential()

    # Find the key "message" and print its value.
    print(config["message"])
    # Find the key "my_json" and print the value for "key" from the dictionary.
    print(config["my_json"]["key"])

    # Connect to Azure App Configuration using Entra ID and trimmed key prefixes.
    trimmed = {"test."}
    config = load(endpoint=endpoint, credential=credential, trim_prefixes=trimmed)
    # From the keys with trimmed prefixes, find a key with "message" and print its value.
    print(config["message"])

    # Connect to Azure App Configuration using SettingSelector.
    selects = {SettingSelector(key_filter="message*", label_filter="\0")}
    config = load(endpoint=endpoint, credential=credential, selects=selects)

    # Print True or False to indicate if "message" is found in Azure App Configuration.
    print("message found: " + str("message" in config))
    print("test.message found: " + str("test.message" in config))
    ```

    ### [Connection string](#tab/connection-string)
    ```python
    from azure.appconfiguration.provider import (
        load,
        SettingSelector
    )
    import os

    connection_string = os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING")

    # Connect to Azure App Configuration using a connection string.
    config = load(connection_string=connection_string)

    # Find the key "message" and print its value.
    print(config["message"])
    # Find the key "my_json" and print the value for "key" from the dictionary.
    print(config["my_json"]["key"])

    # Connect to Azure App Configuration using a connection string and trimmed key prefixes.
    trimmed = {"test."}
    config = load(connection_string=connection_string, trim_prefixes=trimmed)
    # From the keys with trimmed prefixes, find a key with "message" and print its value.
    print(config["message"])

    # Connect to Azure App Configuration using SettingSelector.
    selects = {SettingSelector(key_filter="message*", label_filter="\0")}
    config = load(connection_string=connection_string, selects=selects)

    # Print True or False to indicate if "message" is found in Azure App Configuration.
    print("message found: " + str("message" in config))
    print("test.message found: " + str("test.message" in config))
    ```
    ---

### Run the application

1. Set an environment variable.

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

1. After the environment variable is properly set, run the following command to run the app locally:

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

## Web applications
The App Configuration provider loads data into a `Mapping` object, accessible as a dictionary, which can be used in combination with the existing configuration of various Python frameworks. This section shows how to use the App Configuration provider in popular web frameworks like Flask and Django.

### [Flask](#tab/flask)
You can use Azure App Configuration in your existing Flask web apps by updating its in-built configuration. You can do this by passing your App Configuration provider object to the `update` function of your Flask app instance in `app.py`:

```python
azure_app_config = load(endpoint=os.environ.get("AZURE_APPCONFIG_ENDPOINT"), credential=credential)

# NOTE: This will override all existing configuration settings with the same key name.
app.config.update(azure_app_config)

# Access a configuration setting directly from within Flask configuration
message = app.config.get("message")
```

### [Django](#tab/django)
You can use Azure App Configuration in your existing Django web apps by adding the following lines of code into your `settings.py` file

```python
AZURE_APPCONFIGURATION = load(endpoint=os.environ.get("AZURE_APPCONFIG_ENDPOINT"), credential=credential)
```

To access individual configuration settings in the Django views, you can reference them from the provider object created in Django settings. For example, in `views.py`:
```python
# Import Django settings
from django.conf import settings

# Access a configuration setting from Django settings instance.
MESSAGE = settings.AZURE_APPCONFIGURATION.get("message")
```
---

Full code samples on how to use Azure App Configuration in Python web applications can be found in the [Azure App Configuration](https://github.com/Azure/AppConfiguration/tree/main/examples/Python) GitHub repo.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values from a Python app.

For additional code samples, visit:

> [!div class="nextstepaction"]
> [Django Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-django-webapp-sample)
> [Flask Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-flask-webapp-sample)
> [Azure App Configuration Python provider](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider)
