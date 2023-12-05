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

The App Configuration Python provider includes built-in caching and refreshing capabilities. This tutorial shows how to enable dynamic configuration in Python applications.

> [!NOTE]
> Requires [azure-appconfiguration-provider](https://pypi.org/project/azure-appconfiguration-provider/1.1.0b2/) package version 1.1.0b2 or later.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Python 3.6 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/)

## Add key-values

Add the following key-value to your App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key            | Value             | Label       | Content type       |
|----------------|-------------------|-------------|--------------------|
| *message*      | *Hello World!*    | Leave empty | Leave empty        |
| *sentinel*     | *1*               | Leave empty | Leave empty        |

> [!NOTE]
> A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

## Console applications

1. Create a new Python file named *app.py* and add the following code:

    ```python
    from azure.appconfiguration.provider import load, SentinelKey
    import os
    import time

    connection_string = os.environ.get("APPCONFIGURATION_CONNECTION_STRING")

    # Connecting to Azure App Configuration using connection string
    # Setting up to refresh when the Sentinel key is changed.
    config = load(
        connection_string=connection_string,
        refresh_on=[SentinelKey("sentinel")],
        refresh_interval=10, # Default value is 30 seconds, shorted for this sample
    )

    print("Update the `message` in your App Configuration store using Azure portal or CLI.")
    print("First, update the `message` value, and then update the `sentinel` key value.")

    while (True):
        # Refreshing the configuration setting
        config.refresh()

        # Current value of message
        print(config["message"])

        # Waiting before the next refresh
        time.sleep(5)
    ```

1. Run your script:

    ```console
    python app.py
    ```

1. Verify Output:

    ```console
    Update the `message` in your App Configuration store using Azure portal or CLI.
    First, update the `message` value, and then update the `sentinel` key value.
    Hello World!
    ```

1. Update the following key-values to the App Configuration store.

    | Key            | Value                     | Label       | Content type       |
    |----------------|---------------------------|-------------|--------------------|
    | *message*      | *Hello World Refreshed!*  | Leave empty | Leave empty        |
    | *sentinel*     | *2*                       | Leave empty | Leave empty        |

1. Once the values have been updated the updated value will print out when the refresh interval has passed.

    ```console
    Hello World Refreshed!
    ```

## Web applications

The following example shows how to update an existing web application to use refreshable configuration values.

### [Django](#tab/django)

Set up App Configuration in your Django settings file, `settings.py`.

```python
AZURE_APPCONFIGURATION = load(connection_string=os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING"))
```

You can reference the App Configuration object created in Django settings from views. Call refresh() to check for configuration updates in each Django view before accessing configuration settings. For example, in views.py:

```python
from django.shortcuts import render
from django.conf import settings

def index(request):
    # Refresh the configuration from Azure App Configuration.
    settings.AZURE_APPCONFIGURATION.refresh()

    # Once this returns AZURE_APPCONFIGURATION will be updated with the latest values
    context = {
      "message": settings.AZURE_APPCONFIGURATION.get('message')
    }
    return render(request, 'hello_azure/index.html', context)
```

Update your template `index.html` to use the new configuration values.

```html
{% load static %}
<!doctype html>

<head>
  <title>Hello Azure - Python Django Example</title>
</head>
<html>

<body>
  <main>
    <div class="px-4 py-3 my-2 text-center">
      <h1>{{message}}</h1>
    </div>
  </main>
</body>

</html>

```

You can find a full sample project [here](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-django-webapp-sample).

---

Whenever these endpoints are triggered, a refresh check can be performed to ensure the latest configuration values are used. The check can return immediately if the refresh interval has not passed or a refresh is already in progress.

When a refresh is complete all values are updated at once, so the configuration is always consistent within the object.

NOTE: If the refresh interval hasn't passed, then the refresh won't be attempted and returned right away.

## Next steps

In this tutorial, you enabled your Python app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
