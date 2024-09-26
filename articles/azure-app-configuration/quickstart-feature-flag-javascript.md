---
title: Quickstart for adding feature flags to JavaScript apps
titleSuffix: Azure App Configuration
description: In this quickstart, add feature flags to a Node.js app and manage them using Azure App Configuration.
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: javascript
ms.topic: quickstart
ms.date: 09/26/2024
ms.author: zhiyuanliang
ms.custom: quickstart, mode-other, devx-track-js
#Customer intent: As an JavaScript developer, I want to use feature flags to control feature availability quickly and confidently.
---

# Quickstart: Add feature flags to a Python app

In this quickstart, you incorporate Azure App Configuration into a Node.js console app to create an end-to-end implementation of feature management. You can use App Configuration to centrally store all your feature flags and control their states.

The JavaScript Feature Management libraries extend the framework with feature flag support. They seamlessly integrate with App Configuration through its JavaScript configuration provider.

The example used in this tutorial is based on the Node.js application introduced in the [quickstart](./quickstart-javascript-provider.md).

## Prerequisites

- Finish the quickstart [Create a JavaScript app with Azure App Configuration](./quickstart-javascript-provider.md).

## Add a feature flag

Add a feature flag called *Beta* to the App Configuration store and leave **Label** and **Description** with their default values. For more information about how to add feature flags to a store using the Azure portal or the CLI, go to [Create a feature flag](./manage-feature-flags.md#create-a-feature-flag).

> [!div class="mx-imgBorder"]
> ![Enable feature flag named Beta](media/add-beta-feature-flag.png)

## Use the feature flag

1. Go to the *app-configuration-quickstart* directory that you created in the quickstart and install the Feature Management by using the `npm install` command.

    ``` console
    npm install @microsoft/feature-management
    ```

1. Open the file *app.js* and update it with the following code.

    ``` javascript
    const sleepInMs = require("util").promisify(setTimeout);
    const { load } = require("@azure/app-configuration-provider");
    const { FeatureManager, ConfigurationMapFeatureFlagProvider} = require("@microsoft/feature-management")
    const connectionString = process.env.AZURE_APPCONFIG_CONNECTION_STRING;

    async function run() {
        // Connecting to Azure App Configuration using connection string
        const settings = await load(connectionString, {
            featureFlagOptions: {
                enabled: true,
                // Note: selectors must be explicitly provided for feature flags.
                selectors: [{
                    keyFilter: "*"
                }],
                refresh: {
                    enabled: true,
                    refreshIntervalInMs: 10_000
                }
            }
        });

        // Creating a feature flag provider which uses a map as feature flag source
        const ffProvider = new ConfigurationMapFeatureFlagProvider(settings);
        // Creating a feature manager which will evaluate the feature flag
        const fm = new FeatureManager(ffProvider);

        while (true) {
            await settings.refresh(); // Refresh to get the latest feature flag settings
            const isEnabled = await fm.isEnabled("Beta"); // Evaluate the feature flag
            console.log(`Beta is enabled: ${isEnabled}`);
            await sleepInMs(5000);
        }
    }

    run().catch(console.error);
    ```

## Run the application

1. Run your script:

    ``` console
    node app.js
    ```

1. You will see the following console outputs because the *Beta feature flag is disabled.

    ``` console
    Beta is enabled: false
    ```

1. Sign in to the [Azure portal](https://portal.azure.com). Select **All resources**, and select the App Configuration store that you created previously. 

1. Select **Feature manager** and locate the *Beta* feature flag. Enable the flag by selecting the checkbox under **Enabled**.

1. Wait for a few seconds and you will see the console outputs change.

    ``` console
    Beta is enabled: true
    ```