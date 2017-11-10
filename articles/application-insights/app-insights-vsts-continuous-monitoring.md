---
title: Continuious Monitoring of your DevOps release pipeline with VSTS and Application Insights  | Microsoft Docs
description: Provides instructions to quickly setup a Node.js Web App for monitoring with Application Insights
services: application-insights
keywords:
author: mrbullwinkle
ms.author: mbullwin
ms.date: 09/10/2017
ms.service: application-insights
ms.topic: article
manager: carmonm
---

# Continuous Monitoring of the VSTS Release Pipeline

Visual Studio Team Services (VSTS) integrates with Azure Application Insights to allow continuous monitoring of your DevOps release pipeline throughout the software deployment lifecycle. Historically, users have configured wait times coupled with manual approvals to guard against deployment issues.

VSTS now supports continuous monitoring whereby release pipelines can incorporate monitoring data from Application Insights and other Azure resources. When a monitoring alert is detected, the deployment can remain gated or be rolled back until the alert is resolved. If all checks pass, deployments can proceed automatically from test all the way to production without the need for manual intervention. 

## Configure Continuous Monitoring

1. Select an existing VSTS Project that you are monitoring with Application Insights.

2. Hover over **Build and Release** > Select **Releases** > Click the **plus sign** followed by      **Create release definition** > Search for **Monitoring** > **Azure App Service Deployment with Continuous Monitoring**

   ![New VSTS Release Definition](.\media\app-insights-continuous-monitoring\001.png)

3. Click **Apply**

4. Next to the red exclamation point select the text in blue to **View environment tasks**

   ![View environment tasks](.\media\app-insights-continuous-monitoring\002.png)

   A configuration box will appear, use the table below to fill out the input fields.

    | Parameter        | Value |
   | ------------- |:-----|
   | **Environment name**      | Name that describes the release definition environment |
   | **Azure subscription** | Drop-down populates with any Azure subscriptions linked to the VSTS account|
   | **App Service name** | Manual entry of a new value may be required for this field depending on other selections |
   | **Resource Group**    | Drop-down populates with available Resource Groups |
   | **Application Insights resource name** | Drop-down populates with all Application Insights resources that correspond to the previously selected resource group.

5. Select **Configure Application Insights Alerts**

6. For default alert rules, select **Save** > Enter a descriptive comment > Click **OK**

## Modify Alert Rules

1. To modify the predefined Alert settings, click the box with **ellipses ...** to the right of **Alert rules**

   (Out-of-box four alert rules are present: Availability, Failed requests, Server response time, Server exceptions.)

2. Click the drop-down symbol next to **Availability**

3. Modify the availability **Threshold** to meet your service level requirements.

   ![Modify Alert](.\media\app-insights-continuous-monitoring\003.png)

4. Select **OK** > **Save** > Enter a descriptive comment > Click **OK**

## Add Pre/Post-deployment conditions

1. Click **Pipeline** > Select the **Post-deployment conditions** symbol

   ![Pre-Deployment Conditions](.\media\app-insights-continuous-monitoring\004.png)

2. Set **Gates** to  **Enabled** > **Approval gates**>  Click **Add**

3. Select **Azure Monitor** (This option gives you the ability to access alerts both from Azure Monitor and Application Insights)

    ![Azure Monitor](.\media\app-insights-continuous-monitoring\005.png)

4. Enter a **Gates timeout** value

5. Enter a **Sampling Interval**

## Deployment Gate Logs

Once you add continuous monitoring-based deployment gates an alert in Application Insights that exceeds your previously defined Alert Rule protects your deployment before promoting the release. Once the alert is resolved, the deployment can proceed automatically.

To observe this behavior, Select **Releases** > Right-click Release name **open** > **Logs**

![Logs](.\media\app-insights-continuous-monitoring\006.png)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about VSTS Build and Release](https://docs.microsoft.com/en-us/vsts/build-release/)
