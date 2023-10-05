---
title: Use dynamic configuration in Python (preview)
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for Python
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: tutorial
ms.date: 10/05/2023
ms.custom: devx-track-python, devx-track-extended-python
ms.author: mametcal
#Customer intent: As a Python developer, I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in Python (preview)

This tutorial shows how you can enable dynamic configuration updates in Python. It builds a script to use the App Configuration provider library for its built-in configuration caching and refreshing capabilities.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up your app to update its configuration in response to changes in an App Configuration store.

> [!NOTE]
> Requires [azure-appconfiguration-provider](https://pypi.org/project/azure-appconfiguration-provider/1.1.0b2/) package version 1.1.0b2 or later.

## Prerequisites

Finish the quickstart: [Create a Python app with Azure App Configuration](./quickstart-python-provider.md).

## Sentinel key

A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

The suggested usage of a sentinel key is to create a key with a value that either increments or use a timestamp.

Add the following key-value to the App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value             | Label       | Content type       |
|----------------|-------------------|-------------|--------------------|
| *Sentinel*     | *1*               | Leave empty | Leave empty        |

## Reload data from App Configuration

1. Add the following key-values to the App Configuration store.

    | Key            | Value             | Label       | Content type       |
    |----------------|-------------------|-------------|--------------------|
    | *message*      | *Hello*           | Leave empty | Leave empty        |

1. Create a new Python file named *app.py* and add the following code:

    ```python
    from azure.appconfiguration.provider import load, SentinelKey
    import os
    import time

    connection_string = os.environ.get("APPCONFIGURATION_CONNECTION_STRING")

    # Connecting to Azure App Configuration using connection string, and refreshing when the configuration setting message changes
    config = load(
        connection_string=connection_string,
        refresh_on=[SentinelKey("Sentinel")],
        refresh_interval=10, # Default value is 30 seconds, shorted for this sample
    )

    # Printing the initial value
    print("Starting configuration values:")
    print(config["message"])

    print("Update the configuration setting values now! First update message value, then update the sentinel key value.")

    # Waiting for the refresh interval to pass
    time.sleep(120)

    # Refreshing the configuration setting
    config.refresh()

    # Printing the updated value
    print("Updated configuration values:")
    print(config["message"])
    ```

1. Run your script:

    ```console
    python app.py
    ```

1. Verify Output:

    ```console
    Starting configuration values:
    Hello World!
    ```

1. Update the following key-values to the App Configuration store.

    | Key            | Value                     | Label       | Content type       |
    |----------------|---------------------------|-------------|--------------------|
    | *message*      | *Hello World Refreshed!*  | Leave empty | Leave empty        |
    | *Sentinel*     | *2*                       | Leave empty | Leave empty        |

1. Wait for the refresh interval to pass the refresh to be called, the configuration settings will print again with new values.

    ```console
    Updated configuration values:
    Hello World Refreshed!
    ```

## Web applications

The following examples show how to update an existing flask app to use refreshable configuration values.

### [Flask](#tab/flask)

Update your view endpoints to check for updated configuration values.

```python
@app.route('/')
 def index():
    # Refresh the configuration from App Configuration service.
    azure_app_config.refresh()
    # Update Flask config mapping with loaded values in the App Configuration provider.
    app.config.update(azure_app_config)
```

You can find a full sample project [here](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-flask-webapp-sample).

### [Django](#tab/django)

Update your view endpoints to check for updated configuration values.

```python
from django.conf import settings

def index(request):
    settings.AZURE_APPCONFIGURATION.refresh()
    # Once this returns AZURE_APPCONFIGURATION will be updated with the latest values
    ...
```

You can find a full sample project [here](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-django-webapp-sample).

---

Now whenever those endpoints are triggered, a refresh check can be made to ensure the latest configuration values are being used. This check can returns immediately if the refresh interval hasn't passed, or it something else is currently checking for or triggering a refresh.

When a refresh is complete all values are updated at once, so the configuration is always consistent within the object.

NOTE: If the refresh interval hasn't passed, then the refresh won't be attempted and returned right away.

## Next steps

In this tutorial, you enabled your Python app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
