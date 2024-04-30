---
title: Split Experimentation Workspace overview
description: Learn about using Split Experimentation Workspace in Azure.
ms.topic: conceptual
ms.date: 04/30/2024
author: maud-lv
ms.author: malev
---

# What is Split Experimentation Workspace?

Split Experimentation for Azure App Configuration allows developers to test different variants of a feature and monitor the impact at the feature-level. Once configured, users will be able to analyze each individual feature, compare different variants, and promptly assess relevant metrics for new product changes. This capability empowers development teams with measurable insights, facilitating quicker and safer product deployments.  

This functionality is facilitated through the integration of [Azure App Configuration](/azure/azure-app-configuration/), [Application Insights](/azure/azure-app-configuration/), and the Split Experimentation Workspace.

## Experimentation in Azure App Configuration

This new feature experimentation in Azure App Configuration is built by integrating App configuration with App Insights and Split. As you go about setting up your first experiment, the key steps include creating and configuring the Azure resource setup for the experimentation flow.  

The below diagram depicts the Azure resources for experimentation and the high-level data flow for experiments.

   :::image type="content" source="media/overview/diagram.png" alt-text="Diagram that shows hos Split Experimentation Workspace interact with other Azure resources.":::

To get started, follow the quickStart for creating a Split Experimentation Workspace<!-- Add link--> which contains instructions on setting up an App Configuration Store, App Insights resource, Storage Account, Entra ID for authentication, and how to set up an experiment.

## Next steps

> [!div class="nextstepaction"]
> Create a Split Experimentation Workspace<!--To be added in a next PR-->
