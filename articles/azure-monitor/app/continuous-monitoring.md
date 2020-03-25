---
title: Continuous monitoring of your DevOps release pipeline with Azure Pipelines and Azure Application Insights  | Microsoft Docs
description: Provides instructions to quickly set up continuous monitoring with Application Insights
ms.topic: conceptual
ms.date: 07/16/2019

---

# Add continuous monitoring to your release pipeline

Azure Pipelines integrates with Azure Application Insights to allow continuous monitoring of your DevOps release pipeline throughout the software development lifecycle. 

With continuous monitoring, release pipelines can incorporate monitoring data from Application Insights and other Azure resources. When the release pipeline detects an Application Insights alert, the pipeline can gate or roll back the deployment until the alert is resolved. If all checks pass, deployments can proceed automatically from test all the way to production, without the need for manual intervention. 

## Configure continuous monitoring

1. In [Azure DevOps](https://dev.azure.com), select an organization and project.
   
1. On the left menu of the project page, select **Pipelines** > **Releases**. 
   
1. Drop down the arrow next to **New** and select **New release pipeline**. Or, if you don't have a pipeline yet, select **New pipeline** on the page that appears.
   
1. On the **Select a template** pane, search for and select **Azure App Service deployment with continuous monitoring**, and then select **Apply**. 

   ![New Azure Pipelines release pipeline](media/continuous-monitoring/001.png)

1. In the **Stage 1** box, select the hyperlink to **View stage tasks.**

   ![View stage tasks](media/continuous-monitoring/002.png)

1. In the **Stage 1** configuration pane, complete the following fields: 

    | Parameter        | Value |
   | ------------- |:-----|
   | **Stage name**      | Provide a stage name, or leave it at **Stage 1**. |
   | **Azure subscription** | Drop down and select the linked Azure subscription you want to use.|
   | **App type** | Drop down and select your app type. |
   | **App Service name** | Enter the name of your Azure App Service. |
   | **Resource Group name for Application Insights**    | Drop down and select the resource group you want to use. |
   | **Application Insights resource name** | Drop down and select the Application Insights resource for the resource group you selected.

1. To save the pipeline with default alert rule settings, select **Save** at upper right in the Azure DevOps window. Enter a descriptive comment, and then select **OK**.

## Modify alert rules

Out of box, the **Azure App Service deployment with continuous monitoring** template has four alert rules: **Availability**, **Failed requests**, **Server response time**, and **Server exceptions**. You can add more rules, or change the rule settings to meet your service level needs. 

To modify alert rule settings:

1. In the left pane of the release pipeline page, select **Configure Application Insights Alerts**.

1. In the **Azure Monitor Alerts** pane, select the ellipsis **...** next to **Alert rules**.
   
1. In the **Alert rules** dialog, select the drop-down symbol next to an alert rule, such as **Availability**. 
   
1. Modify the **Threshold** and other settings to meet your requirements.
   
   ![Modify alert](media/continuous-monitoring/003.png)
   
1. Select **OK**, and then select **Save** at upper right in the Azure DevOps window. Enter a descriptive comment, and then select **OK**.

## Add deployment conditions

When you add deployment gates to your release pipeline, an alert that exceeds the thresholds you set prevents unwanted release promotion. Once you resolve the alert, the deployment can proceed automatically.

To add deployment gates:

1. On the main pipeline page, under **Stages**, select the **Pre-deployment conditions** or **Post-deployment conditions** symbol, depending on which stage needs a continuous monitoring gate.
   
   ![Pre-deployment conditions](media/continuous-monitoring/004.png)
   
1. In the **Pre-deployment conditions** configuration pane, set **Gates** to **Enabled**.
   
1. Next to **Deployment gates**, select **Add**.
   
1. Select **Query Azure Monitor alerts** from the dropdown menu. This option lets you access both Azure Monitor and Application Insights alerts.
   
   ![Query Azure Monitor alerts](media/continuous-monitoring/005.png)
   
1. Under **Evaluation options**, enter the values you want for settings like **The time between re-evaluation of gates** and **The timeout after which gates fail**. 

## View release logs

You can see deployment gate behavior and other release steps in the release logs. To open the logs:

1. Select **Releases** from the left menu of the pipeline page. 
   
1. Select any release. 
   
1. Under **Stages**, select any stage to view a release summary. 
   
1. To view logs, select **View logs** in the release summary, select the **Succeeded** or **Failed** hyperlink in any stage, or hover over any stage and select **Logs**. 
   
   ![View release logs](media/continuous-monitoring/006.png)

## Next steps

For more information about Azure Pipelines, see the [Azure Pipelines documentation](https://docs.microsoft.com/azure/devops/pipelines).
