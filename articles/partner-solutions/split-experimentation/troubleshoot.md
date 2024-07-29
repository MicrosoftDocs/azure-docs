---
title: Troubleshooting your Split Experimentation Workspace
description: This article provides information about getting support and troubleshooting a Split Experimentation Workspace.
ms.author: malev
author: maud-lv
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 05/08/2024
---

# Troubleshoot Split Experimentation Workspace

This document contains information about troubleshooting your Split Experimentation Workspace by initiating a new support request, and includes troubleshooting information for issues you might experience in creating and using a Split Experimentation Workspace.

## Getting support

To log a support request about a Split Experimentation Workspace, send an email to <exp_preview@microsoft.com>.

## Known issues

### Sampling in Application Insights

Application Insights samples telemetry events by default, so you may not see all the expected events in Application Insights or Split Experimentation Workspace. Results can be skewed because of the partial event data. You should choose appropriate sampling according to your needs.

### Failed to assign tags notification

The tags edit operation in the Split Experimentation Workspace Overview pane succeeds, but shows a notification with **Failed to assign tag** title. You can ignore this notification.

### Refresh needed to view recalculated results with updated data

If the data is more than 10 minutes old, requesting results will cause a recalculation on the experimentation results page that takes around 15 seconds to complete. You need to refresh results after the recalculation is completed in order to see the updated data.

## Troubleshooting

### Marketplace purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

### No data in the experimentation results page

1. Go to **App Configuration > Feature Manager**.
    1. Select the **...** context menu all the way to the right of a variant feature flag and select **History**.

      :::image type="content" source="media/troubleshoot/feature-manager-context-menu.png" alt-text="Screenshot of the Azure platform showing the variant feature flags menu.":::

    1. Take note of the timestamp and **Etag** of the newest variant feature flag version.
    1. Select **Experiment** from the same **...** context menu. The **Version** timestamp should match the timestamp seen in the previous step.

1. Open your Application Insights resource and go to **Monitoring** > **Logs**. Run the query `customEvents` and sort results by timestamp.

    - You should see events with name *FeatureEvaluation*. Under **customDimension**:
      - Ensure the **ETag** value matches the **Etag** in step 1.
      - Ensure that **TargetingId** has a value.

          :::image type="content" source="media/troubleshoot/logs-customdimensions.png" alt-text="Screenshot of the Azure platform showing customDimension field.":::

    - Under **Name**, you should see events with different names. These are the events you can build metrics from. Take note of these names. These strings were defined by your code in the `TrackEvent` calls to App Insights.

1. Go to **Split Experimentation Workspace > Experimentation Metrics**:
    1. Select **...** > **Edit** on the right side of your metric.
    1. Make sure the **Application Insights Event Name** exactly matches the **name** seen in Application Insights in step 2.

1. Open developer tools in your browser, then select the **Network** tab and the **metric-results** call to check the network traffic of the experiment results page and the response of the metric-results call.

      :::image type="content" source="media/troubleshoot/sample-size-received.png" alt-text="Screenshot of the Azure platform showing the sample size received in the developer tools.":::

    - If `SampleSizeReceived` is more than 0, your Split Experimentation Workspace is receiving events but the mapping of the resources on Azure to create your experiment may not have been correctly set up.
    - If `SampleSizeReceived` equals to 0, your Split Experimentation Workspace isn't seeing any of the data. This can be due to missing data in your storage account, implying an incorrect export rule, or incorrect permissions set up between your Split Experimentation Workspace and your storage account. Navigate to your Split Experimentation Workspace resource to review details of the linked Storage Account under "Data Source".

### Data plane authorization errors

When creating metrics, creating experiments, or getting experiment results, data plane authorization errors may occur if the access policy of the Split Experimentation Workspace isn't set up properly.

#### No preauthorization

- Example Error Message:
  - AADSTS65001: The user or administrator hasn't consented to use the application with ID `<application-ID>` named `<application-name>`. Send an interactive authorization request for this user and resource.

- The application selected in the access policy doesn't authorize Azure portal access for the Split Experimentation resource provider. To address this error, update the application's [authorized client applications](./how-to-set-up-data-access.md#allow-users-to-request-access-to-split-experimentation-from-azure-portal).

#### No assignment

- Example error message:
  - AADSTS50105: ...

- The application selected in the access policy requires direct assignment. To address this error, update the application's [user role assignments](./how-to-set-up-data-access.md#configure-user-and-role-assignments).

#### No authorization

- Example error message:
  - Failed to fetch results

- The application selected in the access policy doesn't grant a sufficient role to access the data plane. To address this error, update the application's [user role assignments](./how-to-set-up-data-access.md#configure-user-and-role-assignments).

#### Unknown error

- Example error message:
  - An unknown error occurred.

- There is an unknown server error. [Contact support](#getting-support).

## Related content

- Learn about [setting up data access control for Split Experimentation Workspace](./how-to-set-up-data-access.md).
