---
title:  Enable telemetry for feature flags in a Python application (preview)
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in python for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 03/05/2025
---

# Tutorial: Enable telemetry for feature flags in a Python application (preview)

In this tutorial, you use telemetry in your Python application to track feature flag evaluations and custom events. Telemetry allows you to make informed decisions about your feature management strategy. You utilize the feature flag with telemetry enabled created in [Enable telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature flag named *Greeting* in your Configuration store with telemetry enabled.

## Prerequisites

- The variant feature flag with telemetry enabled from [Enable telemetry for feature flags](./howto-telemetry.md). 

## Add telemetry to your python application

1. Install the required packages using pip:

    ```bash
    pip install azure-appconfiguration-provider
    pip install featuremanagement["AzureMonitor"]
    pip install azure-monitor-opentelemetry
    ```

1. Open `app.py` and configure your code to connect to Application Insights to publish telemetry.

    ```python
    import os
    from azure.monitor.opentelemetry import configure_azure_monitor

    # Configure Azure Monitor
    configure_azure_monitor(connection_string=os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"))
    ```
    
1. Also in `app.py` load your feature flags from App Configuration and load them into feature management. `FeatureManager` uses the `publish_telemetry` callback function to publish telemetry to Azure Monitor.

    ```python
    from featuremanagement.azuremonitor import publish_telemetry

    feature_manager = FeatureManager(config, on_feature_evaluated=publish_telemetry)
    ```

1. Open `routes.py` and update your code to track your own events in your application. When `track_event` is called, a custom event is published to Azure Monitor with the provided user.

    ```python
    from featuremanagement import track_event
    
    @bp.route("/", methods=["GET", "POST"])
    def index():
        context = {}
        user = ""
        if current_user.is_authenticated:
            user = current_user.username
            context["user"] = user
        else:
            context["user"] = "Guest"
        if request.method == "POST":
            # Update the post request to track liked events
            track_event("Liked", user)
            return redirect(url_for("pages.index"))
    ```

## Build and run the app

1. Application insights requires a connection string to connect to your Application Insights resource. Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable to the connection string for your Application Insights resource.

    ```cmd
    setx APPLICATIONINSIGHTS_CONNECTION_STRING "applicationinsights-connection-string"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:APPLICATIONINSIGHTS_CONNECTION_STRING = "applicationinsights-connection-string"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export APPLICATIONINSIGHTS_CONNECTION_STRING='applicationinsights-connection-string'
    ```

1. If your environment variable for your App Configuration store endpoint isn't setup. Set the `AzureAppConfigurationEndpoint` environment variable to the endpoint of your App Configuration store.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AzureAppConfigurationEndpoint "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AzureAppConfigurationEndpoint = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AzureAppConfigurationEndpoint='<endpoint-of-your-app-configuration-store'
    ```

1. In the command prompt, in the *QuoteOfTheDay* folder, run: `flask run`.
1. Wait for the app to start, and then open a browser and navigate to `http://localhost:5000/`.
1. Create 10 different users and log into the application. As you log in with each user, you get a different message variant for some of them. ~50% of the time you get no message. 25% of the time you get the message "Hello!" and 25% of the time you get "I hope this makes your day!".
1. With some of the users select the **Like** button to trigger the telemetry event.
1. Open your Application Insights resource in the Azure portal and select **Logs** under **Monitoring**. In the query window, run the following query to see the telemetry events:

    ```kusto
    customEvents
    | where name == "FeatureEvaluation" or name == "Liked"
    | order by timestamp desc
    ```

You see one "FeatureEvaluation" for each time the quote page was loaded and one "Liked" event for each time the like button was clicked. The "FeatureEvaluation" event have a custom property called `FeatureName` with the name of the feature flag that was evaluated. Both events have a custom property called `TargetingId` with the name of the user that liked the quote.

## Additional resources
- [Flask Quote of the Day sample](https://github.com/Azure-Samples/quote-of-the-day-python)
