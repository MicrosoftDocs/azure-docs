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
> Requires [azure-appconfiguration-provider](https://pypi.org/project/azure-appconfiguration-provider/1.1.0b1/) package version 1.1.0b1 or later.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free)
- We assume you already have an App Configuration store. To create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

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

    # Creating a configuration setting to be refreshed
    configuration_setting = ConfigurationSetting(key="message", value="Hello World!")

    # Creating a Sentinel key to monitor
    sentinel_setting = ConfigurationSetting(key="Sentinel", value="1")

    # Setting the configuration setting in Azure App Configuration
    client.set_configuration_setting(configuration_setting=configuration_setting)
    client.set_configuration_setting(configuration_setting=sentinel_setting)

    # Connecting to Azure App Configuration using connection string, and refreshing when the configuration setting message changes
    config = load(
        connection_string=connection_string,
        refresh_on=[SentinelKey("Sentinel")],
        refresh_interval=1, # Default value is 30 seconds, shorted for this sample
    )

    # Printing the initial value
    print(config["message"])
    print(config["Sentinel"])

    # Updating the configuration setting to a new value
    configuration_setting.value = "Hello World Updated!"

    # Updating the sentinel key to a new value, only after this is changed can a refresh happen
    sentinel_setting.value = "2"

    # Setting the updated configuration setting in Azure App Configuration
    client.set_configuration_setting(configuration_setting=configuration_setting)
    client.set_configuration_setting(configuration_setting=sentinel_setting) # Should always be done last to make sure all other keys included in the refresh

    # Waiting for the refresh interval to pass
    time.sleep(2)

    # Refreshing the configuration setting
    config.refresh()

    # Printing the updated value
    print(config["message"])
    print(config["Sentinel"])
    ```

1. Run your script:

    ```cli
    python app.py
    ```

1. Verify Output:

:::image type="content" source="./media/enable-dynamic-configuration-python.png" alt-text="Screenshot of the CLI, with the results; Hello World!, 1, Hello World Updated!, 2.":::


## Next steps

In this tutorial, you enabled your Python app to dynamically refresh configuration settings from App Configuration. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
