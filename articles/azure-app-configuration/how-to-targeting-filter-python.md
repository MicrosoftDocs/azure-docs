---
title: Roll out features to targeted audiences in a Python app
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences in a Python application.
ms.service: azure-app-configuration
ms.devlang: python
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 10/07/2025
---

# Roll out features to targeted audiences in a Python application

In this guide, you use a targeting filter to roll out a feature to targeted audiences for your Python application. For more information about this targeting filter, see [Roll out features to targeted audiences](./howto-targetingfilter.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store, as shown in the [tutorial for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A _Beta_ feature flag with targeting filter. [Create the feature flag](./howto-targetingfilter.md).
- [Python 3.8 or later](https://www.python.org/downloads/).

## Create a web application with a feature flag

In this section, you create a web application that uses the [_Beta_ feature flag](./howto-targetingfilter.md) to control the access to the beta version of a web page.

### Set up a Python Flask project

1. Create a folder called `targeting-filter-tutorial` and navigate to it.

    ```bash
    mkdir targeting-filter-tutorial
    cd targeting-filter-tutorial
    ```

1. Create a virtual environment and activate it.

    ```bash
    # For Windows
    python -m venv venv
    venv\Scripts\activate

    # For macOS/Linux
    python -m venv venv
    source venv/bin/activate
    ```

1. Install the following packages.

    ```bash
    pip install azure-appconfiguration-provider
    pip install azure-identity
    pip install featuremanagement
    pip install flask
    ```

1. Create a new file named _app.py_ and add the following code.

    ```python
    from flask import Flask

    app = Flask(__name__)

    if __name__ == "__main__":
        app.run(debug=True)
    ```

### Connect to Azure App Configuration

1. Update _app.py_ and add the following code.

    ```python
    from flask import Flask
    import os
    from azure.identity import DefaultAzureCredential
    from azure.appconfiguration.provider import load
    from featuremanagement import FeatureManager

    app = Flask(__name__)

    # Get the App Configuration endpoint from environment variables
    app_config_endpoint = os.environ.get("AZURE_APPCONFIG_ENDPOINT")

    # Declare App Configuration and feature manager variables
    azure_app_config = None
    feature_manager = None
    
    def initialize_config():
        global azure_app_config, feature_manager
        # Load feature flags from App Configuration
        azure_app_config = load(
            endpoint=app_config_endpoint,
            credential=DefaultAzureCredential(),
            feature_flag_enabled=True,
            feature_flag_refresh_enabled=True
        )
        
        # Create a feature manager with the loaded configuration
        feature_manager = FeatureManager(azure_app_config)
    
    # Flask route before the request to refresh configuration
    @app.before_request
    def refresh_config():
        if azure_app_config:
            azure_app_config.refresh()

    if __name__ == "__main__":
        # Initialize configuration before starting the app
        initialize_config()
        
        app.run(debug=True)
    ```

    You connect to Azure App Configuration to load feature flags, enable automatic refresh, and create a `FeatureManager` object for accessing feature flags later. The `app.before_request` decorator ensures that configuration is refreshed before each request.

### Use the feature flag

Add the following code to the _app.py_ file to create a route handler for the Flask application. The application will serve different contents based on whether the **Beta** feature flag is enabled.

```python
@app.route("/")
def home():
    is_beta_enabled = feature_manager.is_enabled("Beta")

    title = "Home Page"
    message = "Welcome."

    if is_beta_enabled:
        title = "Beta Page"
        message = "This is a beta page."
    
    return f"""
    <!DOCTYPE html>
    <html>
        <head><title>{title}</title></head>
        <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
            <h1 style="text-align: center; font-size: 5rem;">{message}</h1>
        </body>
    </html>
    """
```

## Enable targeting for the web application

A targeting context is required when evaluating features with targeting enabled. In Python, you need to create a `TargetingContext` object and pass it to the `is_enabled` method of the feature manager.

Update the _app.py_ file to import the `TargetingContext` class and use it in the home route:

```python
from flask import Flask, request
from featuremanagement import FeatureManager, TargetingContext

...

@app.route("/")
def home():
    # Get targeting context from query parameters
    user_id = request.args.get("userId", "")
    groups_param = request.args.get("groups", "")
    groups = groups_param.split(",") if groups_param else []

    targeting_context = TargetingContext(user_id=user_id, groups=groups)
    is_beta_enabled = feature_manager.is_enabled("Beta", targeting_context)
    

    title = "Home Page"
    message = "Welcome."

    if is_beta_enabled:
        title = "Beta Page"
        message = "This is a beta page."

    
    return f"""
    <!DOCTYPE html>
    <html>
        <head><title>{title}</title></head>
        <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0;">
            <h1 style="text-align: center; font-size: 5rem;">{message}</h1>
        </body>
    </html>
    """
```


## Targeting filter in action

1. Set the environment variable named _AZURE_APPCONFIG_ENDPOINT_ to the endpoint of your App Configuration store found under the _Overview_ of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

1. Run the application.

    ```bash
    python app.py
    ```

1. Open your browser and navigate to the address displayed in your terminal (by default, http://127.0.0.1:5000). You should see the default view of the app.

    :::image type="content" source="media/how-to-targeting-filter-python/beta-disabled.png" alt-text="Screenshot of the app, showing the default greeting message.":::

1. Add `userId` as a query parameter in the URL to specify the user ID. Visit `localhost:5000/?userId=test@contoso.com`. You see the beta page, because `test@contoso.com` is specified as a targeted user.

    :::image type="content" source="media/how-to-targeting-filter-python/beta-enabled.png" alt-text="Screenshot of the app, showing the beta page.":::

1. Visit `localhost:5000/?userId=testuser@contoso.com`. You cannot see the beta page, because `testuser@contoso.com` is specified as an excluded user.

    :::image type="content" source="media/how-to-targeting-filter-python/beta-not-targeted.png" alt-text="Screenshot of the app, showing the default content.":::

## Next steps

To learn more about feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter-aspnet-core.md)

For more information about the Python Feature Management library, continue to the following document.

> [!div class="nextstepaction"]
> [Feature Management for Python](https://github.com/microsoft/FeatureManagement-Python)