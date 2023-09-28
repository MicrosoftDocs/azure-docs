---
title: Set up App Insights for a Chaos Studio Agent-Based Experiments
description: Understand the steps to connect App Insights to your Chaos Studio Agent-Based Experiment
services: chaos-studio
author: nikhilkaul-microsoft
ms.topic: howto
ms.date: 09/27/2023
ms.author: nikhilkaul
ms.service: chaos-studio
ms.custom: ignite-fall-2023
---
# How-to: Configure your experiment to emit Experiment Fault Events to App Insights
In this guide, we will show you the steps needed to configure a Chaos Studio **Agent-based** Experiment to emit telemetry to App Insights. These events will show the start and stop of each fault as well as the type of fault executed and the resource the fault was executed against. This is the recommended logging solution for **Agent-based** experiements in Chaos Studio

## Prerequisites
- An Azure subscription
- An existing Chaos Studio **Agent-based** Experiment [How to create your first Chaos Experiment](chaos-studio-quickstart-azure-portal.md)
- An existing Log Analytics Workspace (required for Application Insights Resource as well) [How to Create a Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal)
- An existing Application Insights Resource [How to Create an Application Insights Resource](https://learn.microsoft.com/en-us/azure/azure-monitor/app/create-workspace-resource)
- A User-Assigned Managed Identity (Required for Agent-based Chaos Experiments) [How to create a User-Assigned Managed Identity](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)

## Step 1: Copy the Instrumentation Key from your Application Insights Resource
Once you have met all the pre-requisite steps, copy the **Instrumentation Key** found in the overview page of your Application Insights Resource (see red arrow in the screenshot below)

<br/>

![Screenshot that shows Instrumentation Key in App Insights](images/Step1A_appins.png)

## Step 2: Enable the Target Platform for your Agent-Based Fault with Application Insights
Navigate to the Chaos Studio overview page and click on the **Targets** blade under the "Experiments Management" section. Find the target platform, ensure it is enabled for agent-based faults, and select "Manage Actions" in the right-most column. See screenshot below for an example:
<br/>

<br/>

![Screenshot that shows the Chaos Targets Page](images/Step2A_appins.png)

## Step 3: Add your Application Insights account and Instrumentation key
Once you have clicked "Manage Actions" in Step 2, you will see the page in the below screenshot. After configuring your managed identity, make sure Application Insights is "Enabled" and then select your desired Application Insights Account and enter the Instrumentation Key you copied in Step 1. Once this is complete, you can click "Review+Create" to deploy your resource. 

<br/>

![Screenshot of Targets Deployment Page](images/Step3A_appins.png)
