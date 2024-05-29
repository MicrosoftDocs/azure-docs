---
title: Quickstart for adding feature flags to Python with Azure App Configuration (Preview)
description: Add feature flags to Python apps and manage them using Azure App Configuration.
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: python
ms.topic: quickstart
ms.date: 05/29/2024
ms.author: mametcal
ms.custom: devx-track-python, mode-other
#Customer intent: As an Python developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to a Python app (preview)

In this quickstart, you incorporate Azure App Configuration into a Python web app to create an end-to-end implementation of feature management. You can use the App Configuration service to centrally store all your feature flags and control their states.

These libraries do **not** have a dependency on any Azure libraries. They seamlessly integrate with App Configuration through its Python configuration provider.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Python 3.8 or later - for information on setting up Python on Windows, see the [Python on Windows documentation](/windows/python/).
- [azure-appconfiguration-provider library](https://pypi.org/project/azure-appconfiguration-provider/) 1.2.0 or later.

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./quickstart-azure-app-configuration-create.md#create-a-feature-flag).

> [!div class="mx-imgBorder"]
> ![Enable feature flag named Beta](media/add-beta-feature-flag.png)

## Console applications

1. Install Feature Management by using the `pip install` command.

    ```console
    pip install featuremanagement
    ```


1. Create a new python file called `app.py` and add the following code:

    ```python
    from featuremanagement import FeatureManager
    from azure.appconfiguration.provider import load
    import os
    from time import sleep
    
    connection_string = os.environ["APPCONFIGURATION_CONNECTION_STRING"]
    
    # Connecting to Azure App Configuration using Microsoft Entra ID
    config = load(connection_string=connection_string, feature_flag_enabled=True, feature_flag_refresh_enabled=True)
    
    feature_manager = FeatureManager(config)
    
    # Is always false
    print("Beta is ", feature_manager.is_enabled("Beta"))
    
    while not feature_manager.is_enabled("Beta"):
        sleep(5)
        config.refresh()
    
    print("Beta is ", feature_manager.is_enabled("Beta"))
    ```

1. Set an environment variable named **APP_CONFIGURATION_CONNECTION_STRING**, and set it to the connection string to your App Configuration store. At the command line, run the following command and restart the command prompt to allow the change to take effect:

    ### [Windows command prompt](#tab/windowscommandprompt)

    To build and run the app locally using the Windows command prompt, run the following command:

    ```console
    setx APP_CONFIGURATION_CONNECTION_STRING "connection-string-of-your-app-configuration-store"
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command:

    ```azurepowershell
    $Env:APP_CONFIGURATION_CONNECTION_STRING = "connection-string-of-your-app-configuration-store"
    ```

    ### [macOS](#tab/unix)

    If you use macOS, run the following command:

    ```console
    export APP_CONFIGURATION_CONNECTION_STRING='connection-string-of-your-app-configuration-store'
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ### [Linux](#tab/linux)

    If you use Linux, run the following command:

    ```console
    export APP_CONFIGURATION_CONNECTION_STRING='connection-string-of-your-app-configuration-store'
    ```

    Restart the command prompt to allow the change to take effect. Validate that it's set properly by printing the value of the environment variable.

    ---

1. Run the python application.

    ```shell
    python app.py
    ```

1. In the App Configuration portal select **Feature Manager**, and change the state of the **Beta** key to **On**.

    | Key | State |
    |---|---|
    | Beta | On |

1. After about 30s, which is the refresh interval for the provider, the application will print the following:

    ```console
    Beta is True
    ```

## Web applications

The following example shows how to update an existing web application, using Azure App Configuration with refresh to also use feature flags. See [Python Dynamic Configuration](./enable-dynamic-configuration-python.md) for a more detailed example of how to use refreshable configuration values.

### [Flask](#tab/flask)

In `app.py`, set up Azure App Configuration update your load method to also load feature flags.

```python
from featuremanagement import FeatureManager

...

global azure_app_config, feature_manager
azure_app_config = load(connection_string=os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING")
                        refresh_on=[WatchKey("sentinel")],
                        on_refresh_success=on_refresh_success,
                        refresh_interval=10, # Default value is 30 seconds, shortened for this sample
                        feature_flag_enabled=True,
                        feature_flag_refresh_enabled=True,
                    )
feature_manager = FeatureManager(config)
```

Also update your routes to check for updated feature flags.

```python
@app.route("/")
def index():
    ...
    context["beta"] = feature_manager.is_enabled("Beta")
    ...
```

Update your template `index.html` to use the new feature flags.

```html
...

<body>
  <main>
    <div>
      <h1>{{message}}</h1>
      {% if beta %}
      <h2>Beta is enabled</h2>
      {% endif %}
    </div>
  </main>
</body>
```

You can find a full sample project [here](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-flask-webapp-sample).

### [Django](#tab/django)

Set up Azure App Configuration in your Django settings file, `settings.py` to load feature flags.

```python
from featuremanagement import FeatureManager

...

AZURE_APPCONFIGURATION = load(
        connection_string=os.environ.get("AZURE_APPCONFIG_CONNECTION_STRING"),
        refresh_on=[WatchKey("sentinel")],
        on_refresh_success=on_refresh_success,
        refresh_interval=10, # Default value is 30 seconds, shortened for this sample
        feature_flag_enabled=True,
        feature_flag_refresh_enabled=True,
    )
FEATURE_MANAGER = FeatureManager(config)
```

You can access your feature flags to add them to the context. For example, in views.py:

```python
def index(request):
    ...

    context = {
      "message": settings.AZURE_APPCONFIGURATION.get('message'),
      "beta": settings.FEATURE_MANAGER.is_enabled('Beta')
    }
    return render(request, 'hello_azure/index.html', context)
```

Update your template `index.html` to use the new configuration values.

```html
<body>
  <main>
    <div>
      <h1>{{message}}</h1>
      {% if beta %}
      <h2>Beta is enabled</h2>
      {% endif %}
    </div>
  </main>
</body>
```

You can find a full sample project [here](https://github.com/Azure/AppConfiguration/tree/main/examples/Python/python-django-webapp-sample).

---

Whenever these endpoints are triggered, a refresh check can be performed to ensure the latest configuration values are used. The check can return immediately if the refresh interval has yet to pass or a refresh is already in progress.

When a refresh is complete all values are updated at once, so the configuration is always consistent within the object.

NOTE: If the refresh interval has yet to pass, then the refresh won't be attempted and the function will return right away.

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and used it to manage features in a Spring Boot web app via the [Feature Management libraries](https://azure.github.io/azure-sdk-for-java/springboot.html).

* See library [reference documentation](https://go.microsoft.com/fwlink/?linkid=2180917).
* Learn more about [feature management](./concept-feature-management.md).
* [Manage feature flags](./manage-feature-flags.md).
* [Use feature flags in a Spring Boot Core app](./use-feature-flags-spring-boot.md).
