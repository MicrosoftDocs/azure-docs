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
> Requires azure-appconfiguration-provider package version 1.1.0b1 or later.

## Sentinel key

A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

## Reload data from App Configuration

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

    # Setting up a configuration setting with a known value
    client = AzureAppConfigurationClient.from_connection_string(connection_string)

    # Adding a configuration setting to be refreshed
    configuration_setting = ConfigurationSetting(key="message", value="Hello World!")

    # Adding a Sentinel key to monitor
    sentinel_setting = ConfigurationSetting(key="Sentinel", value="1")

    client.set_configuration_setting(configuration_setting=configuration_setting)
    client.set_configuration_setting(configuration_setting=sentinel_setting)

    # Connecting to Azure App Configuration using connection string, and refreshing when the configuration setting message changes
    config = load(
        connection_string=connection_string,
        refresh_on=[SentinelKey("Sentinel")],
        refresh_interval=1, # Default value is 30 seconds, shorted for this sample
    )

    print(config["message"])
    print(config["Sentinel"])

    # Updating the configuration setting
    configuration_setting.value = "Hello World Updated!"

    sentinel_setting.value = "2"

    client.set_configuration_setting(configuration_setting=configuration_setting)
    client.set_configuration_setting(configuration_setting=sentinel_setting) # Unless this value is updated, the configuration will not be refreshed

    # Waiting for the refresh interval to pass
    time.sleep(2)

    # Refreshing the configuration setting
    config.refresh()

    # Printing the updated value
    print(config["message"])
    print(config["Sentinel"])
    ```


## Next steps

In this tutorial, you enabled your Python app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
