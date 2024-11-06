---
title:  Use telemetry in python with feature flags (preview)
titleSuffix: Azure App Configuration
description: Learn how to use telemetry in python for feature flags in Azure App Configuration.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 11/06/2024
---

# Tutorial: Use telemetry in python with feature flags (preview)

Feature flag can use telemetry (preview) to provide insights into how your feature flags are used. Telemetry allows you to make informed decisions about your feature management strategy.

In this tutorial, you:

> [!div class="checklist"]
> - Add telemetry to your python application (preview)

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An App Configuration store. If you don't have an App Configuration store, see [Create an App Configuration store](./quickstart-azure-app-configuration-create.md).
- A variant feature flag with telemetry enabled. If you don't have a feature flag, see [Enable telemetry for feature flags](./howto-telemetry.md).
- An Application Insights resource. If you don't have an Application Insights resource, see [Create an Application Insights resource](/azure/azure-monitor/app/create-workspace-resource).

## Adding telemetry to your python application

1. Install the `azure-appconfiguration-provider` and the `featuremanagement` packages using pip:

    ```bash
    pip install azure-appconfiguration-provider==2.0.0b2 featuremanagement["AzureMonitor"]==2.0.0b2
    ```

1. Install the `azure-monitor-opentelemetry` package using pip:

    ```bash
    pip install azure-monitor-opentelemetry
    ```

1. Configure your code to connect to Application Insights to publish telemetry.

    ```python
    import os
    from azure.monitor.opentelemetry import configure_azure_monitor

    # Configure Azure Monitor
    configure_azure_monitor(connection_string=os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING"))
    ```
    
1. Load your feature flags from App Configuration and load them into feature management.

    ```python
    from azure.appconfiguration.provider import load
    from azure.identity import DefaultAzureCredential
    from azure.featuremanagement import FeatureManager
    from featuremanagement.azuremonitor import publish_telemetry

    config = load(endpoint=os.getenv("APPCONFIGURATION_ENDPOINT")), credential=DefaultAzureCredential(),feature_flag_refresh_enabled=True)

    feature_manager = FeatureManager(config, on_feature_evaluated=publish_telemetry)
    ```

1. Use the feature variant in your application. When `get_variant` is called, telemetry is published to Azure Monitor using the callback function `publish_telemetry`.

    ```python
    from featuremanagement import TargetingContext

    if feature_manager.get_variant("Greeting", TargetingContext(user=user, groups=groups)).configuration:
        print("True Variant!")
    else:
        print("False Variant!")
    ```

1. Track your own events in your application. When `track_event` is called, a custom event is published to Azure Monitor with the provided user.

    ```python
    from featuremanagement import track_event

    # Something has happened in your application
    track_event("my_event", user)
    ```

## Setup Environment Variables

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

1. App Configuration requires an endpoint to connect to your App Configuration store. Set the `APPCONFIGURATION_ENDPOINT` environment variable to the endpoint of your App Configuration store.

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