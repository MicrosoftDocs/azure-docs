---
title: Use Azure Monitor Application Change Analysis to find issues that can affect live sites | Microsoft Docs
description: Use Azure Monitor Application Change Analysis to troubleshoot application live site issues on Azure App Service.
services: application-insights
author: cawams
manager: carmonm
ms.assetid: ea2a28ed-4cd9-4006-bd5a-d4c76f4ec20b
ms.service: application-insights
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: cawa
---

# Application Change Analysis (preview)

When a live site issue or outage occurs, determining the root cause quickly is critical. Standard monitoring solutions might alert you to a problem and might even indicate which component is failing. But this alert won't always immediately explain the failure's cause. Your site worked five minutes ago, and now it's broken. What changed in the last five minutes? In Azure Monitor, this is the question that Application Change Analysis is designed to answer. 

Building on the power of [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview), Application Change Analysis provides insight into your Azure application changes to increase observability and reduce MTTR (mean time to repair).

> [!IMPORTANT]
> Application Change Analysis is currently in preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Some features might not be supported or might have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Overview

The Change Analysis service detects various types of changes, from the infrastructure layer all the way to application deployment. It's a subscription-level Azure resource provider that checks resource changes in the subscription. It provides data for various diagnostic tools to help users understand what changes might have caused issues.

The following diagram illustrates the architecture of the Change Analysis service:

![Architecture diagram of how the Change Analysis service gets change data and provides it to client tools](./media/change-analysis/overview.png)

Currently the Change Analysis tool is integrated into the App Service web-app **Diagnose and solve problems** experience. To enable and view web-app changes, see the section called *Change Analysis service for the Web Apps feature* later in this article.

### Azure Resource Manager deployment changes

Using [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview), the Change Analysis tool provides a historical record of how the Azure resources that host your application have changed over time. For example, if a tag is added to a web app, the Change Analysis tool reflects the change. This information is available as long as the `Microsoft.ChangeAnalysis` resource provider is onboarded to the Azure subscription.

### Web Application deployment and configuration changes

The Change Analysis tool captures the deployment and configuration state of an application every 4 hours. It computes the differences and presents what has changed. It can detect, for example, changes in the application environment variables, IP configuration rules, managed identities, SSL settings, and so on.
Unlike Resource Manager changes, this type of change information might not be available immediately in the tool. To view the latest changes in Change Analysis, select **Scan changes now**.

![Screenshot of the "Scan changes now" button](./media/change-analysis/scan-changes.png)

### Dependency changes

Changes to resource dependencies can cause issues in a web app. For example, if a web app calls into a Redis cache, the Redis cache SKU could affect the web app performance. This is why Change Analysis service checks the web app DNS record. The service presents the dependencies' change information to identify changes in all app components that could cause issues.

## Change Analysis service for the Web Apps feature

In Azure Monitor, Application Change Analysis is currently built into the self-service **Diagnose and solve problems** experience, which you can access from the **Overview** page of your App Service application:

![Screenshot of the "Overview" button and the "Diagnose and solve problems" button](./media/change-analysis/change-analysis.png)

### Enable Change Analysis in the Diagnose and solve problems tool

1. Select **Availability and Performance**.

    ![Screenshot of the "Availability and Performance" troubleshooting options](./media/change-analysis/availability-and-performance.png)

1. Select **Application Crashes**.

   ![Screenshot of the "Application crashes" button](./media/change-analysis/application-crashes-tile.png)

1. To enable **Change Analysis** select **Enable now**.

   ![Screenshot of availability and performance troubleshooting options](./media/change-analysis/application-crashes.png)

1. To take advantage of the full Change Analysis functionality set **Change Analysis**, **Scan for code changes**, and **Always on** to **On** and select **Save**.

    ![Screenshot of the App Service enable Change Analysis user interface](./media/change-analysis/change-analysis-on.png)

    If **Change Analysis** is enabled, you will be able to detect resource level changes. If **Scan for code changes** is enabled, you will also see deployment files and site configuration changes. Enabling **Always on** will optimize the change scanning performance, but may incur additional costs from a billing perspective.

1.  After everything  is enabled, selecting **Diagnose and solve problems** > **Availability and Performance** > **Application Crashes** will allow you to access the Change Analysis experience. The graph will summarize the type of changes that happened over time along with details on those changes:

     ![Screenshot of change diff view](./media/change-analysis/change-view.png)


### Enable the Change Analysis service at scale
If your subscription includes a lot of web apps, enabling the service at the level of the web app would be inefficient. Here are some alternative onboarding instructions.

#### Register the Change Analysis resource provider for your subscription

1. Register the Change Analysis preview feature flag.

    Since this feature is in preview, you need to firstly register the feature flag for it to be visible to your subscription.
    - Open [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/).

    ![Screenshot of change Azure Cloud Shell](./media/change-analysis/cloud-shell.png)

    - Change the shell type to PowerShell:

    ![Screenshot of change Azure Cloud Shell](./media/change-analysis/choose-powershell.png)

    - Run the following PowerShell command:

    ``` PowerShell

    Set-AzContext -Subscription <your_subscription_id> #set script execution context to the subscription you are trying to onboard
    Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.ChangeAnalysis" -ListAvailable #Check for feature flag availability
    Register-AzureRmProviderFeature -FeatureName PreviewAccess -ProviderNamespace Microsoft.ChangeAnalysis #Register feature flag

    ```

1. Register the Change Analysis resource provider for the subscription.

    - Navigate to Subscriptions, select the subscription you want to onboard the change service, then click resource providers:

        ![Screenshot for registering Change Analysis RP from Subscriptions blade](./media/change-analysis/register-rp.png)

    - Select *Microsoft.ChangeAnalysis* and click *Register* on the top of the page.

    - Once the resource provider is onboarded, follow instructions from *Unable to fetch Change Analysis information* below to set hidden tag on the web app to enable deployment level change detection on the web app.

1. Alternatively to step 2 above, you can register for the resource provider by using PowerShell script:

    ```PowerShell
    Get-AzureRmResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState #Check if RP is ready for registration

    Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis" #Register the Change Analysis RP
    ```

1. To set a hidden tag on a web app using PowerShell, run the following command:

    ```powershell
    $webapp=Get-AzWebApp -Name <name_of_your_webapp>
    $tags = $webapp.Tags
    $tags[“hidden-related:diagnostics/changeAnalysisScanEnabled”]=$true
    Set-AzResource -ResourceId <your_webapp_resourceid> -Tag $tag
    ```

> [!NOTE]
> After the hidden tag is added, you might still need to initially wait up to 4 hours to be able to first view changes. This is due to the 4 hour frequency that the Change Analysis service uses to scan your web app while limiting the performance impact of the scan.

## Next steps

- Improve your monitoring of App Service [by enabling the Application Insights features](azure-web-apps.md) of Azure Monitor.
- Enhance your understanding of the [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview) which helps power Application Change Analysis.
