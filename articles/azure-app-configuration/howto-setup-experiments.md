---
title: How to set up experiments in App Configuration (preview)
titleSuffix: Azure App configuration
description: Learn how to set up experiments in an App Configuration store using Split Experimentation Workspace.
#customerintent: As a user of Azure App Configuration, I want to learn how I can set up experiments to test different variants of a feature.
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration 
ms.topic: how-to
ms.date: 04/23/2024
---

# How to set up experiments (preview) in Azure App Configuration

Running A/B testing experiments can help you make informed decisions to improve your app’s performance and user experience. In this guide, you learn how to set up and execute experimentations within an App Configuration store. You learn how to collect and measure data, leveraging the capabilities of App Configuration, Application Insights and Split Experimentation Workspace (preview). By doing so, you can make data-driven decisions to improve your application.

## Prerequisites

- An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. If you don’t have one, [create an App Configuration store](./quickstart-azure-app-configuration-create.md).
- A Split Experimentation Workspace resource connected to your App Configuration store. <!--Add link to Split Experimentation Workspace quickstart>
- A variant feature flag with at least two variants. <!--Add link to Split Experimentation Workspace quickstart>

## Add an Application Insights resource to your App Configuration store

To run an experiment, you first need to connect a workspace-based Application Insights resource to your App Configuration store. Adding this resource to your App Configuration store enables Application Insights to collect your application’s monitoring, telemetry and application data, and send it to Log Analytics for analysis.

1. In your App Configuration store, select **Telemetry > Application Insights (preview)**.

    :::image type="content" source="./media/set-up-experiments/select-application-insights.png" alt-text="Screenshot of the Azure portal, adding an Application Insights to a store.":::

1. Select the Application Insights resource you want to use as the data source for your experiment and select **Save**. If you don't have an Application Insights resource, create one by selecting **Create new**. For more information about how to proceed, go to [Create a worskpace-based resource](../azure-monitor/app/create-workspace-resource.md#create-a-workspace-based-resource). Then, back in **Application Insights (preview)**, reload the list of available Application Insights resources and select your new Application Insights resource.
1. A notification indicates that the Application Insights resource was updated successfully for the App Configuration store.

## Make changes to application code or create a new application

Now that you’ve connected the Application Insights resource to the App Configuration store, set up an app to run your experiment.

- If you don’t have an ASP.NET application to run an experiment on already, use this Quickstart to create a Quote of the day app. <!-- Add link to QOTD quickstart --> This guide walks you through the following steps: create an application, connect it to your App Configuration store, connect it to your Application Insights resource, publish the evaluation events from your application code to Application Insights using the Application Insights Telemetry Publisher, define an `ITargetingContextAccessor`, add `FeatureManagement` with Targeting and Telemetry Publisher, add Telemetry Initializer and Middleware, grab the variant and emit an event you’d like to track.

- If you already have an ASP.NET application, the steps outlined in the quickstart describe the changes you must make to your existing code.

## Set up an experimentation in App Configuration

### Create experimentation metrics

Metrics are quantitative measures that help evaluate the impact of feature flags on user behavior and outcomes. Metrics can be defined to count the occurrence of events, measure event values, or measure event properties. Metrics can be used to compare the performance of different treatments (variations) of a feature flag and assess the statistical significance of the results.

Navigate to your Split Experimentation Workspace resource. Under **Configuration** > **Experimentation Metrics**, select **Create**.  

:::image type="content" source="./media/set-up-experiments/create-metrics.png" alt-text="Screenshot of the Azure portal, select experimentation metrics.":::

### Events and measuring metrics

A *metric* in Split Experimentation Workspace measures an event sent to Application Insights. Earlier, you added `TrackEvent` to your application code, which is an event that represents user actions such as button selections.

In the Quote of the day app, the event we're tracking is when a user selects the heart-shaped like button, for which we entered `_telemetryClient.TrackEvent("Like")`, where `Like` is the name of the telemetry event sent to Application Insights, which you will connect to the metric you're about to create using the blade that appears when you select **Create**. The quickstart only specifies one event, but you may have multiple events that take in user actions.

The event allows you to measure how many users are clicking on that button as an action, and creating a metric for an experiment means you're interested in collecting data on how users are interacting with the given action being tracked as an event and be able to derive results from that data. At this step, creating a metric requires you to specify how you want to measure the user action (i.e the Application Insights event).

If you're creating an application from scratch using the quickstart listed above, at this stage, create a metric with *Heart Vote Button* as the metric name and enter *Like* as the Application Insights event name to match the event specified in the QuickStart application code.

> [!NOTE]
> When filling out the **Create an Experimentation Metric** form, make sure the **Name** and **Application Insights Event Name** match the code added in your application for this event. In the Quickstart, we used *Heart Vote Button* and *Like*.

For this experiment, the tutorial is based on the hypothesis that more users click on the heart-shaped like button when there is a special message next to the Quote of the Day. The application code takes in this click as an event named *Like*. The application sends the Like event as telemetry to Application Insights and the **Desired Impact** for this experiment is to see an **Increase** in the number of user clicks (Measured as: **Count**) on the *Heart Vote Button*, to be able to validate the given hypothesis. If there is a decrease in the number of clicks on the button despite the special message being shown to the allocated audience, then the hypothesis is invalidated for this experiment.

Fill out the **Create an Experimentation Metric** form and save with **Create**.

:::image type="content" source="./media/set-up-experiments/create-metric.png" alt-text="Screenshot of the Azure portal, creating a new experimentation metrics.":::

- **Name**: Enter a unique name for the new metric.
- **Description**: optionally add a description for this metric.
- **Application Insights Event Name**: Enter an event name to map the Application Insights event to the metric specified in your application code.
- **Measure as**: Select **Count** to quantify this metric. The following options are available:
  - **Count**: Counts the number of times the event is triggered by your users.
  - **Average**: Averages the value of the event for your users.
  - **Sum**: Adds up the values of the event for your users. Shows the average summed value.
  - **Percent**: Calculates the percentage of users that triggered the event.

  While the Quickstart uses **Count** as the measure, your application may have events with user actions that are too large to be measured as Count, for which you may opt for any of the above measurements instead.
- **Desired Impact:** Select **Increase**. This allows results to be shown in context of positive and negative outcomes, as it represents the ultimate goal or purpose behind measuring your created metric.

Once created, the new metric is displayed in the portal. You can edit it or delete it by selecting the ellipsis (**...**) button on the right side of the screen.

:::image type="content" source="./media/set-up-experiments/created-metric.png" alt-text="Screenshot of the Azure portal showing an experimentation metric.":::

> [!NOTE]
> Application Insights sampling is enabled by default and it may impact your experimentation results. For this tutorial, you are recommended to turn off sampling in Application Insights as directed in the quickstart application. Learn more about [Sampling in Application Insights](../azure-monitor/app/sampling-classic-api.md).

## Next step

<!--
> [!div class="nextstepaction"]
> [Use cases for experimentation](./linktbd.md) -->