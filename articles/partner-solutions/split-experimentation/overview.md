---
title: Split Experimentation Workspace (preview) overview
description: Learn about using Split Experimentation Workspace in Azure.
ms.topic: conceptual
ms.date: 04/30/2024
author: maud-lv
ms.author: malev
---

# What is Split Experimentation Workspace (preview)?

Split Experimentation for Azure App Configuration (preview) allows developers to test different variants of a feature and monitor the impact at the feature-level. Once configured, users will be able to analyze each individual feature, compare different variants, and promptly assess relevant metrics for new product changes. This capability empowers development teams with measurable insights, facilitating quicker and safer product deployments.  

This functionality is facilitated through the integration of [Azure App Configuration](/azure/azure-app-configuration/), [Application Insights](/azure/azure-monitor/app/app-insights-overview/), and the Split Experimentation Workspace.

## Experimentation in Azure App Configuration

This new feature experimentation in Azure App Configuration is built by integrating App Configuration with Application Insights and Split. As you go about setting up your first experiment, the key steps include creating and configuring the Azure resource setup for the experimentation flow.  

The below diagram depicts the Azure resources for experimentation and the high-level data flow for experiments.

   :::image type="content" source="media/overview/diagram.png" alt-text="Diagram that shows how Split Experimentation Workspace interacts with other Azure resources." lightbox="media/overview/diagram.png":::

To get started, follow the quickstart to create a Split Experimentation Workspace, and then set up the experiments for your application in App Configuration store using this tutorial. <!-- add link to /azure/azure-app-configuration/set-up-experiments.aspnet)-->  

## Next step

> [!div class="nextstepaction"]
> [Create a Split Experimentation Workspace](./create.md)
