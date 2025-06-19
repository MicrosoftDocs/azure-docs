---
title: Feature flag telemetry reference
titleSuffix: Azure App Configuration
description: Learn how App Configuration allows for telemetry viewing for feature flags.
ms.service: azure-app-configuration
author: mrm9084
ms.author: mametcal
ms.topic: reference
ms.date: 06/19/2025
---

# Document: Feature flag telemetry reference

Having telemetry data on your feature flags can be a powerful tool for understanding how your feature flags are used. Telemetry allows you to make informed decisions about your feature management strategy.

In this document, you:

> [!div class="checklist"]
> - Learn what telemetry data is available using the Azure App Configuration provider libraries
> - Learn what telemetry data is available using the Feature Management libraries

## Evaluation Event

Telemetry for feature flags is available when using the Feature Management libraries.

### Basic fields

The feature management libraries provide the following properties to telemetry data:

- **FeatureName**: The name of the feature flag.
- **Enabled**: A boolean value indicating if the feature flag is enabled.
- **Variant**: The variant that was selected for the feature flag.
- **VariantAssignmentReason**: The reason the variant was assigned to the user; DefaultWhenDisabled, DefaultWhenEnabled, User, Group, Percentile, None.
- **TargetingId**: The ID of the user that was assigned to the variant.
- **DefaultWhenEnabled**: The default variant of the feature flag when it's enabled.
- **Version**: The version of this schema.
- **VariantAssignmentPercentage**: Specifies the percentage of the user base the assigned variant is allocated for. This field is only present for percentile-based assignments.

The full schema can be found in the [Feature Evaluation Event schema definition](https://github.com/microsoft/FeatureManagement/blob/main/Schema/FeatureEvaluationEvent/FeatureEvaluationEvent.v1.0.0.schema.json).

This data can then be sent to locations to be viewed, such as Azure Monitor. When using our provided connections to Azure Monitor, a **custom_event** is published with the following properties whenever a telemetry enabled feature flag is evaluated.

### App Configuration custom fields

When the Azure App Configuration provider libraries are used, additional properties are added to the telemetry data. These properties provide more context about the feature flag and its evaluation:

- **AllocationID**: A unique identifier representing the state of the feature flag's allocation.
- **ETag**: The current ETag for the feature flag.
- **FeatureFlagReference**: A reference to the feature flag in the format of `<your_store_endpoint>kv/<feature_flag_key>`. When a label is present, the reference includes it as a query parameter: `<your_store_endpoint>kv/<feature_flag_key>?label=<feature_flag_label>`.```

The full schema can be found in the [App Configuration Feature Evaluation Event schema definition](https://github.com/microsoft/FeatureManagement/blob/main/Schema/AppConfigurationFeatureEvaluationEvent/FeatureEvaluationEvent.v1.0.0.schema.json).

## Next steps

In this document, you learned about the telemetry data available for feature flags. To learn about how to use the telemetry data in your applications, continue to the following document for your language or platform.