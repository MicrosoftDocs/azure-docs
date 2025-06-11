---
title: Feature flag telemetry reference
titleSuffix: Azure App Configuration
description: Learn how App Configuration allows for telemetry viewing for feature flags.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: reference
ms.date: 11/06/2024
---

# Document: Feature flag telemetry reference

Having telemetry data on your feature flags can be a powerful tool for understanding how your feature flags are used. Telemetry allows you to make informed decisions about your feature management strategy.

In this document, you:

> [!div class="checklist"]
> - Learn what telemetry data is available using the Azure App Configuration provider libraries
> - Learn what telemetry data is available using the Feature Management libraries

## Viewing telemetry data

With telemetry enabled no other properties are added to the feature flag besides the setting enabling telemetry. The use of one of the Azure App Configuration provider libraries along with the Feature Management libraries is required to start collecting telemetry data.

### Azure App Configuration provider libraries

The use of an Azure App Configuration provider library that supports telemetry is required to start collecting telemetry data. When telemetry is enabled, the Azure App Configuration provider libraries add more properties to the feature flags when they're retrieved. A new object is added to the **telemetry** section of the feature flag called **metadata**. The **metadata** object contains the following properties:

- **AllocationID**: A unique identifier for the feature flag in its current state. (preview)
- **ETag**: The current ETag for the feature flag.
- **FeatureFlagReference**: A reference to the feature flag in the format of `<your_store_endpoint>kv/<feature_flag_key>`, it also includes the label if one is present, `<your_store_endpoint>kv/<feature_flag_key>?label=<feature_flag_label>`.

The full schema can be found [here](https://github.com/microsoft/FeatureManagement/tree/main/Schema/FeatureEvaluationEvent/FeatureEvaluationEventWithAzureAppConfiguration.v1.0.0.schema.json).

### Feature Management libraries

When the Feature Management libraries and the provider libraries are used together, more properties are added to the telemetry data. This data can then be sent to locations to be viewed, such as Azure Monitor. When using our provided connections to Azure Monitor, a **custom_event** is published to Open Telemetry with the following properties whenever a telemetry enabled feature flag is evaluated:

- **FeatureName**: The name of the feature flag.
- **Enabled**: A boolean value indicating if the feature flag is enabled.
- **Version**: The version of this schema.
- **Reason**: The reason the feature flag was enabled or disabled.
- **Variant**: The variant that was selected for the feature flag.
- **VariantAssignmentPercentage**: Specifies the percentage of the user base the assigned variant is allocated for. This field is only present for percentile-based assignments.
- **DefaultWhenEnabled**  (preview): The default variant of the feature flag when it's enabled.
- **AllocationID** (preview): A unique identifier for the feature flag in its current state.
- **ETag**: The current ETag for the feature flag.
- **FeatureFlagReference**: A reference to the feature flag in the format of `<your_store_endpoint>kv/<feature_flag_key>`, it also includes the label if one is present, `<your_store_endpoint>kv/<feature_flag_key>?label=<feature_flag_label>`.
- **FeatureFlagId**: A unique identifier for the feature flag.
- **TargetingId**: The ID of the user that was assigned to the variant.

The full schema can be found [here](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureEvaluationEvent/FeatureEvaluationEvent.v1.0.0.schema.json).

## Next steps

In this document, you learned about the telemetry data available for feature flags. To learn about how to use the telemetry data in your applications, continue to the following document for your language or platform.