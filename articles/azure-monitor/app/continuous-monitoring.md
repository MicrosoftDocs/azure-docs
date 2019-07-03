---
title:  Continuous monitoring of your DevOps release pipeline with Azure Pipelines and Azure Application Insights  | Microsoft Docs
description: Provides instructions to quickly set up continuous monitoring with Application Insights
services: application-insights
keywords:
author: mrbullwinkle
ms.author: mbullwin
ms.date: 07/02/2017
ms.service: application-insights
ms.topic: conceptual
manager: carmonm
---

# Add continuous monitoring to your release pipeline

Azure Pipelines integrates with Azure Application Insights to allow continuous monitoring of your DevOps release pipeline throughout the software development lifecycle. 

With continuous monitoring, release pipelines can incorporate monitoring data from Application Insights and other Azure resources. When the release pipeline detects an Application Insights alert, the pipeline can gate or roll back the deployment until the alert is resolved. If all checks pass, deployments can proceed automatically from test all the way to production, without the need for manual intervention. 

## Configure continuous monitoring

1. Select an existing Azure DevOps project.
   
1. On the left menu, select **Pipelines**, and then select **Releases**. 
   
1. Select **New pipeline**.
   
1. On the **Select a template** pane, search for and select **Azure App Service deployment with continuous monitoring**, and then select **Apply**. 

   ![New Azure Pipelines release pipeline](media/continuous-monitoring/001.png)

1. Next to the red exclamation point, select the blue text to **View stage tasks.**

   ![View stage tasks](media/continuous-monitoring/002.png)

1. In the **Stage 1** configuration pane, complete the following fields: 

    | Parameter        | Value |
   | ------------- |:-----|
   | **Stage name**      | Provide a stage name, or leave it at **Stage 1**. |
   | **Azure subscription** | Drop down and select the linked Azure subscription you want to use.|
   | **App type** | Drop down and select your app type. |
   | **App Service name** | Enter the name of your Azure App Service. |
   | **Resource Group name for Application Insights**    | Drop down and select the resource group you want to use. |
   | **Application Insights resource name** | Drop down and select the Application Insights resource for the resource group you selected .

1. In the left pane, select **Configure Application Insights Alerts**.

1. To keep the default alert rule settings, select **Save** at upper right. Enter a descriptive comment, and then select **OK**.

## Modify alert rules

Out of box, there are four alert rules: **Availability**, **Failed requests**, **Server response time**, and **Server exceptions**. You can change the alert rule settings to meet your service level needs. 
   
1. To modify alert rule settings, in the **Azure Monitor Alerts** pane, select the ellipsis **...** next to **Alert rules**.
   
1. In the **Alert rules** dialog, select the drop-down symbol next to an alert rule. 
   
1. Modify the **Threshold**, **Condition**, and **Period** to meet your requirements.
   
   ![Modify alert](media/continuous-monitoring/003.png)
   
1. Select **OK**, and then select **Save** at upper right. Enter a descriptive comment, and then select **OK**.

## Add deployment conditions

When you add deployment gates, an Application Insights alert that exceeds the thresholds you set guards your deployment against unwanted release promotion. When you resolve the alert, the deployment can proceed automatically. 
To add deployment gates:

1. On the main pipeline page, under **Stages**, select the **Pre-deployment conditions** or **Post-deployment conditions** symbol, depending on which stage needs a continuous monitoring gate.
   
   ![Pre-deployment conditions](media/continuous-monitoring/004.png)
   
1. In the **Pre-deployment conditions** configuration pane, set **Gates** to **Enabled**.
   
1. Next to **Deployment gates**, select **Add**.
   
1. Select **Query Azure Monitor alerts** from the dropdown menu. This option lets you access alerts from both Azure Monitor and Application Insights.
   
   ![Azure Monitor](media/continuous-monitoring/005.png)
   
1. Under **Evaluation options**, change the values for **The time between re-evaluation of gates**, **The timeout after which gates faile**, and other options as desired. 

## Deployment gate status logs

You can see deployment gate behavior and other release steps in the release logs. To open the logs:

1. Select **Releases** from the left menu of the main pipeline page. 
   
1. Select any release. 
   
1. Under **Stages**, select any stage to view a release summary. 
   
1. To view logs, select **View logs** in the release summary, select the **Succeeded** or **Failed** result text in any stage, or hover over any stage and select **Logs**. 
   
   ![Logs](media/continuous-monitoring/006.png)

## Next steps

To learn more about Azure Pipelines try these [quickstarts.](https://docs.microsoft.com/azure/devops/pipelines)
