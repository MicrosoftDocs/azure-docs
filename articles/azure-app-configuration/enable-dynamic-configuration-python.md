---
title: Use dynamic configuration in Python (preview)
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for Python
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 09/13/2023
ms.custom: devx-track-python, devx-track-extended-python
ms.author: mametcal
#Customer intent: As a Python developer, I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in Python (preview)

This tutorial shows how you can enable dynamic configuration updates in Python. It builds a script to leverage the App Configuration provider library for its built-in configuration caching and refreshing capabilities.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your app to update its configuration in response to changes in an App Configuration store.

> [!NOTE]
> Requires [azure-appconfiguration-provider](https://pypi.org/project/azure-appconfiguration-provider/1.1.0b2/) package version 1.1.0b2 or later.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free)
- We assume you already have an App Configuration store. To create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Sentinel key

A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

## Reload data from App Configuration

1. Create two configuration in your App Configuration store.

```cli
az appconfig kv set --name <app-configuration-store-name> --key message --value "Hello World!"
az appconfig kv set --name <app-configuration-store-name> --key Sentinel --value "1"
```

1. Create a new Python file named *app.py* and add the following code:

    ```python
    from azure.appconfiguration.provider import load, SentinelKey
    from azure.appconfiguration import (
        AzureAppConfigurationClient,
        ConfigurationSetting,
    )
    import os
    import time

    connection_string = os.environ.get("APPCONFIGURATION_CONNECTION_STRING")

    # Creating a Sentinel key to monitor
    sentinel_setting = ConfigurationSetting(key="Sentinel", value="1")


    # Connecting to Azure App Configuration using connection string, and refreshing when the configuration setting message changes
    config = load(
        connection_string=connection_string,
        refresh_on=[SentinelKey("Sentinel")],
        refresh_interval=1, # Default value is 30 seconds, shorted for this sample
    )

    # Printing the initial value
    print("Starting configuration values:")
    print(config["message"])
    print(config["Sentinel"])

    print("Updating configuration values now.")

    # Waiting for the refresh interval to pass
    time.sleep(60)

    # Refreshing the configuration setting
    config.refresh()

    # Printing the updated value
    print("Updated configuration values:")
    print(config["message"])
    print(config["Sentinel"])
    ```

1. Run your script:

    ```cli
    python app.py
    ```

1. Verify Output:

```cli
Starting configuration values:
Hello World!
1
```

1. Update the values in your App Configuration store, making sure to update the sentinel key last.

```cli
az appconfig kv set --name <app-configuration-store-name> --key message --value "Hello World Refreshed!"
az appconfig kv set --name <app-configuration-store-name> --key Sentinel --value "2"
```

1. Wait for the refresh interval to pass the refresh to be called, the configuration settings will print out again with new values.

```cli
Updated configuration values:
Hello World Refreshed!
2
```

## Web App Usage (Django/Flask)

The following examples show how to update an existing flask app to use refreshable configuration values.

### [Django](#tab/django)

Update a view endpoint to check for updated configuration values.

```python
from django.conf import settings

def index(request):
    settings.AZURE_APPCONFIGURATION.refresh()
    # Once this returns AZURE_APPCONFIGURATION will be updated with the latest values
    ...
```



### [Flask](#tab/flask)

Update a view endpoint to check for updated configuration values.

```python
@app.route('/')
 def index():
    # Refresh the configuration from App Configuration service.
    azure_app_config.refresh()
    # Update Flask config mapping with loaded values in the App Configuration provider.
    app.config.update(azure_app_config)
```

---

NOTE: If the refresh interval hasn't passed, then the refresh will not be attempted and returned right away.

## Next steps

In this tutorial, you enabled your Python app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
