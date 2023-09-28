---
title: Set up Azure Monitor for a Chaos Studio Experiment
description: Understand the steps to connect Azure Monitor to your Chaos Studio Experiment
services: chaos-studio
author: nikhilkaul-msft
ms.topic: how-to
ms.date: 09/27/2023
ms.author: nikhilkaul
ms.service: chaos-studio
ms.custom: ignite-fall-2023
---
# How-to: Configure your experiment to emit Experiment Fault Events to Azure Monitor
In this guide, we will show you the steps needed to integrate an Experiment to emit telemetry to Azure Monitor. These events will show the start and stop of each fault as well as the type of fault executed and the resource the fault was executed against. You should be able to overlay this data on top of your existing Azure Monitor or external monitoring dashboards.

## Prerequisites
- An Azure subscription
- An existing Chaos Studio Experiment [How to create your first Chaos Experiment](chaos-studio-quickstart-azure-portal.md)
- An existing Log Analytics Workspace [How to Create a Log Analytics Workspace](../azure-monitor/logs/quick-create-workspace.md)

## Step 1: Navigate to Diagnostic Settings tab in your Chaos Experiment
Navigate to the Chaos Experiment you want to emit telemetry to Azure Monitor and open it. Then navigate to the "Diagnostic settings" tab under the "Monitoring" section as shown in the below screenshot:

<br/>

![Screenshot that shows Diagnostic Settings in Chaos Experiment](images/Step1A.png)

## Step 2: Connect your Chaos Experiment to your desired Log Analytics Workspace
Once you are in the "Diagostic Settings" tab within your Chaos Experiment, select "Add Diagnostic Setting."
Here you will see a page like the screenshot below which will ask for the following details:
1. **Diagnostic Setting Name**: You can define this as any String you want, much like a Resource Group Name
2. **Category Groups**: Here you will choose which category of logging you want to output to the log analytics workspace. 
3. **Subscription**: This is the subscription which includes the Log Analytics Workspace you would like to use
4. **Log Analytics Workspace**: This is where you will select your desired Log Analytics Workspace
<br/>
All the other settings are optional
<br/>

<br/>

![Screenshot that shows the Diagnostic Settings blade and required information](images/Step2A.png)

## Step 3: Run the chaos experiment
Once you have completed Step 2, your experiment is now configured to emit telemetry to Azure Monitor upon the next Chaos Experiment execution!  It typically takes time (20 minutes) for the logs to populate. Once populated you can view the log events from the logs tab. Events include experiment start and stop as well as details about the faults executed. You can even turn the logs into chart visualizations or overlay your existing livesite visualizations with chaos metadata.

<br/>

To query your logs, navigate to the "Logs" tab in your Chaos Experiment Resource to get your desired logging information your desired format.

<br/>

![Screenshot of Logs tab in Chaos Experiment Resource](images/Step3A.png)
