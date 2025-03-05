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

In this tutorial, you use telemetry (preview) in your Python application to track feature flag evaluations and custom events. Telemetry allows you to make informed decisions about your feature management strategy. You utilize the feature flag with telemetry enabled created in [Enable telemetry for feature flags](./howto-telemetry.md). Before proceeding, ensure that you create a feature lag named *Greeting* in your Configuration store with telemetry enabled.

## Prerequisites

- A variant feature flag named *Greeting*. If you don't have one, follow the [instructions to create it](./manage-feature-flags.md).
- A variant feature flag named *Greeting* with telemetry enabled. If you don't have one, follow the [update it](./howto-telemetry.md). 

## Add telemetry to your python application

1. Install the `azure-appconfiguration-provider` and the `featuremanagement` packages using pip:

    ```bash
    pip install azure-appconfiguration-provider==2.0.0b2 featuremanagement["AzureMonitor"]==2.0.0b2
    ```

1. Install the `azure-monitor-opentelemetry` package using pip:

    ```bash
    pip install azure-monitor-opentelemetry
    ```

1. Configure your code to connect to Application Insights to publish telemetry. Add the following code to `app.py`.

    ```python
    import os
    from azure.monitor.opentelemetry import configure_azure_monitor

    # Configure Azure Monitor
    configure_azure_monitor(connection_string=os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"))
    ```
    
1. Load your feature flags from App Configuration and load them into feature management. Update your `app.py` with the following code, `FeatureManager` uses the `publish_telemetry` callback function to publish telemetry to Azure Monitor.

    ```python
    from featuremanagement.azuremonitor import publish_telemetry

    feature_manager = FeatureManager(config, on_feature_evaluated=publish_telemetry)
    ```

1. Track your own events in your application. When `track_event` is called, a custom event is published to Azure Monitor with the provided user. Updated `routes.py` to track an event whenever a POST request is made.

    ```python
    from featuremanagement import track_event

    # Something has happened in your application
    track_event("Liked", user)
    ```

## Build and run the app

1. Application insights requires a connection string to connect to your Application Insights resource. Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable to the connection string for your Application Insights resource.

    #### [Windows command prompt](#tab/windowscommandprompt)

    To run the app locally using the Windows command prompt, run the following command and replace `<applicationinsights-connection-string>` with the connection string of your app configuration store:

    ```cmd
    setx APPLICATIONINSIGHTS_CONNECTION_STRING "applicationinsights-configuration-store"
    ```

    #### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command and replace `<applicationinsights-connection-string>` with the connection string of your app configuration store:

    ```azurepowershell
    $Env:APPLICATIONINSIGHTS_CONNECTION_STRING = "<applicationinsights-connection-string>"
    ```

    #### [macOS](#tab/unix)

    If you use macOS, run the following command and replace `<applicationinsights-connection-string>` with the connection string of your app configuration store:

    ```console
    export APPLICATIONINSIGHTS_CONNECTION_STRING='applicationinsights-connection-string>'
    ```

    #### [Linux](#tab/linux)

    If you use Linux, run the following command and replace `<applicationinsights-connection-string>` with the connection string of your app configuration store:

    ```console
    export APPLICATIONINSIGHTS_CONNECTION_STRING='<applicationinsights-connection-string>'
    ```

1. If your environment variable for your App Configuration store endpoint is not setup. Set the `APPCONFIGURATION_ENDPOINT` environment variable to the endpoint of your App Configuration store.

    #### [Windows command prompt](#tab/windowscommandprompt)

    To run the app locally using the Windows command prompt, run the following command and replace `<app-configuration-store-endpoint>` with the endpoint of your app configuration store:

    ```cmd
    setx APPCONFIGURATION_ENDPOINT "app-configuration-store-endpoint"
    ```

    #### [PowerShell](#tab/powershell)

    If you use Windows PowerShell, run the following command and replace `<app-configuration-store-endpoint>` with the endpoint of your app configuration store:

    ```azurepowershell
    $Env:APPCONFIGURATION_ENDPOINT = "<app-configuration-store-endpoint>"
    ```

    #### [macOS](#tab/unix)

    If you use macOS, run the following command and replace `<app-configuration-store-endpoint>` with the endpoint of your app configuration store:

    ```console
    export APPCONFIGURATION_ENDPOINT='app-configuration-store-endpoint>'
    ```

    #### [Linux](#tab/linux)

    If you use Linux, run the following command and replace `<app-configuration-store-endpoint>` with the endpoint of your app configuration store:

    ```console
    export APPCONFIGURATION_ENDPOINT='<app-configuration-store-endpoint>'
    ```