---
title: How to set up experiments in App Configuration (preview)
titleSuffix: Azure App configuration
description: Learn how to set up experiments in an App Configuration store using Split Experimentation Workspace.
#customerintent: As a user of Azure App Configuration, I want to learn how I can set up experiments to test different variants of a feature.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration 
ms.topic: how-to
ms.date: 04/30/2024
---

# How to set up experiments (preview) in Azure App Configuration

Running A/B testing experiments can help you make informed decisions to improve your app’s performance and user experience. In this guide, you learn how to set up and execute experimentations within an App Configuration store. You learn how to collect and measure data, using the capabilities of App Configuration, Application Insights, and Split Experimentation Workspace (preview). By doing so, you can make data-driven decisions to improve your application.

## Prerequisites

- An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
- An App Configuration store with a variant feature flag having at least two variants.
- A Split Experimentation Workspace resource
- An App Insights resource.

## Add an Application Insights resource to your App Configuration store

To run an experiment, you first need to connect a workspace-based Application Insights resource to your App Configuration store. Adding this resource to your App Configuration store enables Application Insights to collect your application’s monitoring, telemetry and application data, and send it to Log Analytics for analysis.

1. In your App Configuration store, select **Telemetry > Application Insights (preview)**.

    :::image type="content" source="./media/set-up-experiments/select-application-insights.png" alt-text="Screenshot of the Azure portal, adding an Application Insights to a store.":::

1. Select the Application Insights resource you want to use as the telemetry provider for your variant feature flags and application, and select **Save**. If you don't have an Application Insights resource, create one by selecting **Create new**. For more information about how to proceed, go to [Create a worskpace-based resource](../azure-monitor/app/create-workspace-resource.md#create-a-workspace-based-resource). Then, back in **Application Insights (preview)**, reload the list of available Application Insights resources and select your new Application Insights resource.
1. A notification indicates that the Application Insights resource was updated successfully for the App Configuration store.

## Add a Split Experimentation Workspace to your App Configuration store

To run experiments in Azure App Configuration, we're going to use Split Experimentation Workspace. Follow the steps below to add a Split Experimentation Workspace to your store.

1. In your App Configuration store, select **Experimentation** > **Split Experimentation Workspace (preview)** from the left menu.

    :::image type="content" source="./media/set-up-experiments/find-in-app-configuration-store.png" alt-text="Screenshot of the Azure portal, finding Split Experimentation Workspace from the App Configuration store left menu.":::

1. Select a **Split Experimentation Workspace**, then **Save**. If you don't have a Split Experimentation Workspace, follow the Split Experimentation Workspace quickstart to create one<!--link to Split Experimentation workspace quickstart-->.

    :::image type="content" source="./media/set-up-experiments/add-split-experimentation-workspace.png" alt-text="Screenshot of the Azure portal, adding a Split Experimentation Workspace to the App Configuration store.":::

1. A notification indicates that the operation was successful.

## Set up experiments for you application

Now that you’ve connected the Application Insights resource to the App Configuration store, set up an app to run your experiment. Go to the Quote of the Day quickstart to learn about the code changes required to set up experimentation for an ASP.Net application.

## Enable telemetry and experiments in your variant feature flag

Enable telemetry and experiments in your variant feature flag by following the steps below:

1. In your App Configuration store, go to **Operations** > **Feature manager**.
1. Select the **...** context menu all the way to the right of your feature flag and select **Edit**.

    :::image type="content" source="./media/set-up-experiments/edit-variant-feature-flag.png" alt-text="Screenshot of the Azure portal, editing a variant feature flag.":::

1. Go to the **Telemetry** tab and check the box **Enable Telemetry**.
1. Go to the **Experiment** tab, check the box **Create Experiment** and give a name to your experiment.
1. **Select Review + update**, then **Update**.
1. A notification indicates that the operation was successful. In **Feature manager**, the variant feature flag now has the word **Active** under **Experiment**.

## Create metrics for your experiment

A *metric* in Split Experimentation Workspace is a quantitative measure of an event sent to Application Insights. This metric  helps evaluate the impact of a feature flag on user behavior and outcomes.

When updating your app earlier, you added `_telemetryClient.TrackEvent("<Event-Name>")` to your application code. `<Event-Name>` is a telemetry event that represents a user action, such as a button selection. This event is sent to the Application Insights resource, which you'll connect to the metric you're about to create.
You may have multiple events that take in user actions, in which case you would create several metrics.

1. Navigate to your Split Experimentation Workspace resource. Under **Configuration** > **Experimentation Metrics**, select **Create**.

1. Select or enter the following information under **Create an Experimentation Metric** and save with **Create**.

    :::image type="content" source="./media/set-up-experiments/create-metric.png" alt-text="Screenshot of the Azure portal, creating a new experimentation metrics.":::

    | Setting                             | Example value       | Description                                                                                                                                                                                                                                                                                                                                                                                    |
    |-------------------------------------|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Name**                            | *Heart Vote Button* | The name of the experimentation metric.                                                                                                                                                                                                                                                                                                                                                        |
    | **Description**                     | *Count number of people who select the heart button when they see a special message, vs. when they don't.*               | Optional description for the metric.                                                                                                                                                                                                                                                                                                                                                           |
    | **Application Insights Event Name** | *Like*              | The name of the Application Insights event. This is the name specified in your code with `_telemetryClient.TrackEvent("<Event-Name>")`.                                                                                                                                                                                                                                                        |
    | **Measure as**                      | **Count**           | The following options are available: <br><ul><li>**Count**: counts the number of times the event is triggered by your users.</li><li>**Average**: averages the value of the event for your users.</li><li>**Sum**: adds up the values of the event for your users. Shows the average summed value.</li><li>**Percent**: calculates the percentage of users that triggered the event.</li></ul> |
    | **Desired Impact**                  | **Increase**        | This setting represents the ultimate goal or purpose behind measuring your created metric. |

    In the quickstart shared above, our hypothesis is that more users click on the heart-shaped like button when there is a special message next to the Quote of the Day. The application code takes in this click as an event named *Like*. The application sends the Like event as telemetry to Application Insights and the **Desired Impact** for this experiment is to see an **Increase** in the number of user clicks (measured as **Count**) on the *Heart Vote Button*, to be able to validate the given hypothesis. If there is a decrease in the number of clicks on the button despite the special message being shown to the allocated audience, then the hypothesis is invalidated for this experiment.

1. Once created, the new metric is displayed in the portal. You can edit it or delete it by selecting the (**...**) context menu on the right side of the screen.

    :::image type="content" source="./media/set-up-experiments/created-metric.png" alt-text="Screenshot of the Azure portal showing an experimentation metric.":::

> [!NOTE]
> Application Insights sampling is enabled by default and it may impact your experimentation results. For this tutorial, you are recommended to turn off sampling in Application Insights as directed in the quickstart application. Learn more about [Sampling in Application Insights](../azure-monitor/app/sampling-classic-api.md).

## Get Experimentation results

To put your newly setup experiment to the test and generate results for you to analyze, simulate some traffic to your application and wait a few minutes.

To view the results of your experiment, navigate to **Feature Manager** and on the list of Feature Variants, click on **...** > **Experiment** or select the **Active** link under the Experiment label in the grid view.

On the results page, select the **Version** of the Experiment you would like to view (at this stage, there should be only one version), the **Baseline** you want to compare the results against, and the **Comparison** variant.

The more traffic and event data is generated by your application, the more your experiment is likely to produce reliable results and conclusions.

If you edit a variant feature flag and make changes to the experiment title, the allocation, variant names or values, then a new version of your experiment will be created. You can then select this version and view its results.

## Next step

> [!div class="nextstepaction"]
> [Manage feature flags](./manage-feature-flags.md)

<!-- update to following next step when doc is published
> [!div class="nextstepaction"]
> [Use cases for experimentation](./linktbd.md) -->