---
title: App Configuration and Telemetry (preview)
titleSuffix: Azure App Configuration
description: Learn how App Configuration allows for telemetry viewing for feature flags.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 10/31/2024
---

# Tutorial: Azure App Configuration and Telemetry (preview)

Having telemetry data on your feature flags can be a powerful tool for understanding how your feature flags are used. Telemetry allows you to make informed decisions about your feature management strategy. In this guide, you learn how to add telemetry (preview) to your Azure App Configuration feature flags and what data you can get from them.

In this tutorial, you:

> [!div class="checklist"]
> - Add telemetry to a feature flag (preview)
> - Learn which telemetry data is viewable using the Azure App Configuration provider libraries (preview)
> - Learn which telemetry data is viewable using the Feature Management libraries (preview)

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- An App Configuration store. If you don't have an App Configuration store, see [Create an App Configuration store](./quickstart-azure-app-configuration-create.md).
- A feature flag. If you don't have a feature flag, see [Create a feature flag](./manage-feature-flags.md).

## Add telemetry to a feature flag (preview)

1. Open your App Configuration store in the Azure portal.
1. In the **Operations** section, select the **Feature manager** page.
1. When viewing the list of feature flags, you should see a column labeled **Telemetry** (preview), it should show as **Disabled**. Right click on the feature flag you want to enable telemetry for and select **Edit**.
1. In the new view, select the **Telemetry** tab.
1. Select the **Enable Telemetry** checkbox and then the **Review + update** button at the bottom of the page.
1. On the **Review + update** page, select the **Update** button.

## Viewing telemetry data (Preview)

With telemetry (preview) enabled no other properties are added to the feature flag besides the setting enabling telemetry. Use of an Azure App Configuration provider library that supports telemetry is required to start collecting telemetry data.

When telemetry is enabled, the Azure App Configuration provider libraries add more properties to the feature flags when they're retrieved. A new object is added to the **telemetry** section of the feature flag called **metadata**. The **metadata** object contains the following properties:

- **AllocationID**: A unique identifier for the feature flag in its current state.
- **ETag**: The current ETag for the feature flag.
- **FeatureFlagReference**: A reference to the feature flag in the format of `<your-store-endpoint>kv/<feature_flag_key>`, it also includes the label if one is present, `<your-store-endpoint>kv/<feature_flag_key>?label=<feature_flag_label>`.
- **FeatureFlagId**: A unique identifier for the feature flag.

The full schema can be found [here](https://github.com/microsoft/FeatureManagement/tree/main/Schema/FeatureEvaluationEvent/FeatureEvaluationEventWithAzureAppConfiguration.v1.0.0.schema.json).

When feature flags with telemetry enabled are used with the Feature Management libraries, more properties are added to the telemetry data and be sent to location to be viewed, such as Azure Monitor. When using our provided connections to Azure Monitor a **custom_event** is published to Open Telemetry with the following properties whenever a telemetry enabled feature flag is evaluated:

- **Feature_Name**: The name of the feature flag.
- **Enabled**: A boolean value indicating if the feature flag is enabled.
- **Version**: The version of this schema.
- **Reason**: The reason the feature flag was enabled or disabled.
- **Variant**: The variant that was selected for the feature flag.
- **VariantAssignmentPercentage**: If a variant wasn't targeted specifically at the user, or one of the user's groups, this number is the Percentage chance of the user being assigned to the variant.
- **DefaultWhenEnabled**: The default variant of the feature flag when it's enabled.
- **AllocationID**: A unique identifier for the feature flag in its current state.
- **ETag**: The current ETag for the feature flag.
- **FeatureFlagReference**: A reference to the feature flag in the format of `<your-store-endpoint>kv/<feature_flag_key>`, it also includes the label if one is present, `<your-store-endpoint>kv/<feature_flag_key>?label=<feature_flag_label>`.
- **FeatureFlagId**: A unique identifier for the feature flag.
- **TargetingId**: The ID of the user that was assigned to the variant.

The full schema can be found [here](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureEvaluationEvent/FeatureEvaluationEvent.v1.0.0.schema.json).

## Next steps (Preview)

In this tutorial, you learned about how to enable telemetry for feature flags in Azure App Configuration. To learn about how to use the telemetry data in your applications, continue to the following tutorial for your language or platform.