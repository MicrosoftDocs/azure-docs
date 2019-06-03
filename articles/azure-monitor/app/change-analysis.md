---
title: Use Azure Monitor Application Change Analysis to find web-app issues | Microsoft Docs
description: Use Azure Monitor Application Change Analysis to troubleshoot application issues on live sites  on Azure App Service.
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

When a live site issue or outage occurs, quickly determining the root cause is critical. Standard monitoring solutions might alert you to a problem. They might even indicate which component is failing. But this alert won't always immediately explain the failure's cause. You know your site worked five minutes ago, and now it's broken. What changed in the last five minutes? This is the question that Application Change Analysis is designed to answer in Azure Monitor. 

Building on the power of [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview), Application Change Analysis provides insights into your Azure application changes to increase observability and reduce MTTR (mean time to repair).

> [!IMPORTANT]
> Application Change Analysis is currently in preview. This preview version is provided without a service-level agreement. This version is not recommended for production workloads. Some features might not be supported or might have constrained capabilities. For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Overview

The Change Analysis service detects various types of changes, from the infrastructure layer all the way to application deployment. It's a subscription-level Azure resource provider that checks resource changes in the subscription. The Change Analysis service provides data for various diagnostic tools to help users understand what changes might have caused issues.

The following diagram illustrates the architecture of the Change Analysis service:

![Architecture diagram of how the Change Analysis service gets change data and provides it to client tools](./media/change-analysis/overview.png)

Currently the Change Analysis tool is integrated into the **Diagnose and solve problems** experience in the App Service web app. To enable change detection and view changes in the web app, see the *Change Analysis for the Web Apps feature* section later in this article.

### Azure Resource Manager deployment changes

Using [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview), the Change Analysis tool provides a historical record of how the Azure resources that host your application have changed over time. For example, if a tag is added to a web app, the Change Analysis tool reflects the change. This information is available as long as the `Microsoft.ChangeAnalysis` resource provider is enabled in the Azure subscription.

### Changes in web app deployment and configuration

The Change Analysis tool captures the deployment and configuration state of an application every 4 hours. It computes the differences and presents what has changed. The Change Analysis service can detect, for example, changes in the application environment variables, IP configuration rules, managed identities, and SSL settings. IP configuration rules, managed identities, and SSL settings are Azure Resource Manager deployment changes.

Unlike Resource Manager changes, this type of change information might not be available immediately in the tool. To view the latest changes in Change Analysis, select **Scan changes now**.

![Screenshot of the "Scan changes now" button](./media/change-analysis/scan-changes.png)

### Dependency changes

Changes to resource dependencies can also cause issues in a web app. For example, if a web app calls into a Redis cache, the Redis cache SKU could affect the web app performance. To detect changes in dependencies, the Change Analysis service checks the web app's DNS record. In this way, it identifies changes in all app components that could cause issues.

## Change Analysis for the Web Apps feature

In Azure Monitor, Application Change Analysis is currently built into the self-service **Diagnose and solve problems** experience. Access this experience from the **Overview** page of your App Service application.

![Screenshot of the "Overview" button and the "Diagnose and solve problems" button](./media/change-analysis/change-analysis.png)

### Enable Change Analysis in the Diagnose and solve problems tool

1. Select **Availability and Performance**.

    ![Screenshot of the "Availability and Performance" troubleshooting options](./media/change-analysis/availability-and-performance.png)

1. Select **Application Crashes**.

   ![Screenshot of the "Application Crashes" button](./media/change-analysis/application-crashes-tile.png)

1. To enable the Change Analysis service, select **Enable now**.

   ![Screenshot of "Application Crashes" options](./media/change-analysis/application-crashes.png)

1. To take advantage of the full Change Analysis functionality, turn on **Change Analysis**, **Scan for code changes**, and **Always on**. Then select **Save**.

    ![Screenshot of the "Enable Change Analysis" user interface](./media/change-analysis/change-analysis-on.png)

    - Enable **Change Analysis** to detect resource-level changes. 
    - Enable **Scan for code changes** to see deployment files and site configuration changes. 
    - Enable **Always on** to optimize the performance of change scanning. But keep in mind that this setting might result in additional billing charges.

1. To access the Change Analysis experience, select **Diagnose and solve problems** > **Availability and Performance** > **Application Crashes**. You'll see a graph that summarizes the type of changes over time along with details on those changes:

     ![Screenshot of the change diff view](./media/change-analysis/change-view.png)


### Enable the Change Analysis service at scale

If your subscription includes numerous web apps, enabling the service at the level of the web app would be inefficient. In this case, follow these alternative instructions.

### Register the Change Analysis resource provider for your subscription

1. Register the Change Analysis feature flag (preview). Because the feature flag is in preview, you need to register it to make it visible to your subscription:

   1. Open [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/).

      ![Screenshot of change Cloud Shell](./media/change-analysis/cloud-shell.png)

   1. Change the shell type to **PowerShell**.

      ![Screenshot of change Cloud Shell](./media/change-analysis/choose-powershell.png)

   1. Run the following PowerShell command:

        ``` PowerShell
        Set-AzContext -Subscription <your_subscription_id> #set script execution context to the subscription you are trying to enable
        Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.ChangeAnalysis" -ListAvailable #Check for feature flag availability
        Register-AzureRmProviderFeature -FeatureName PreviewAccess -ProviderNamespace Microsoft.ChangeAnalysis #Register feature flag
        ```
    
1. Register the Change Analysis resource provider for the subscription.

   - Go to **Subscriptions**, and select the subscription you want to enable in the change service. Then select resource providers:

        ![Screenshot showing how to register the Change Analysis resource provider](./media/change-analysis/register-rp.png)

       - Select **Microsoft.ChangeAnalysis**. Then at the top of the page, select **Register**.

       - After the resource provider is enabled, you can set a hidden tag on the web app to detect changes at the level of deployment. To set a hidden tag, follow the instructions under **Unable to fetch Change Analysis information**.

   - Alternatively, you can use a PowerShell script to register the resource provider:

        ```PowerShell
        Get-AzureRmResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState #Check if RP is ready for registration
    
        Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.ChangeAnalysis" #Register the Change Analysis RP
        ```

        To use PowerShell to set a hidden tag on a web app, run the following command:
    
            ```powershell
            $webapp=Get-AzWebApp -Name <name_of_your_webapp>
            $tags = $webapp.Tags
            $tags[“hidden-related:diagnostics/changeAnalysisScanEnabled”]=$true
            Set-AzResource -ResourceId <your_webapp_resourceid> -Tag $tag
            ```

> [!NOTE]
> After you add the hidden tag, you might still need to wait up to 4 hours before you start seeing changes. Results are delayed because the Change Analysis service scans your web app only every 4 hours. The 4-hour schedule limits the scan's performance impact.

## Next steps

- Monitor App Service more effectively by [enabling Application Insights features](azure-web-apps.md) in Azure Monitor.
- Learn more about [Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview), which helps power Application Change Analysis.
