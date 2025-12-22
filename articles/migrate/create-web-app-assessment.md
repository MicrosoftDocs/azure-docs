---
title: Tutorial to assess web apps for migration
description: Learn how to create assessment for web apps in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 10/22/2025
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.custom: engagement-fy24
# Customer intent: As a cloud architect, I want to create a comprehensive assessment for web applications, so that I can determine the best modernization path and resource allocation for deploying them on Azure efficiently.
---
# Tutorial: Create web app assessment for modernization 

This article describes how to create a web app assessment for modernization to [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) or [Azure App Service](/azure/app-service/overview) using Azure Migrate. Creating an assessment for your web apps provides the recommended targets for them and key insights such as app-readiness, target right-sizing, and cost to host, and run these apps month over month. 

In this article, you'll learn how to: 

- Set up your Azure Migrate environment to assess web apps. 
- Choose a set of related web applications discovered using the Azure Migrate appliance. 
- Provide assessment configurations such as preferred Azure targets, target region, Azure reserved Instances, sizing criteria and more. 
- Create web app assessment with a recommended modernization path. 

## Prerequisites 

- Deploy and configure the Azure Migrate appliance in your [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [physical](tutorial-discover-physical.md) environments. 
- Check the [appliance requirements](migrate-appliance.md#appliance---vmware) and [URL access](migrate-appliance.md#url-access) to be provided. 
- Follow [these steps](how-to-discover-sql-existing-project.md) to discover web apps running on your environment. Web app assessment is supported for appliance-based discovery only.

## Create a workload assessment for web apps

To create an assessment, follow these steps:

1. On the Azure Migrate project **Overview** page, under **Decide and Plan**, select **Assessments**.  

   :::image type="content" source="./media/create-web-app-assessment/create-workload-assessment.png" alt-text="Screenshot shows how to create web app assessment." lightbox="./media/create-web-app-assessment/create-workload-assessment.png" :::

2. Select **Create assessment**.
    
   :::image type="content" source="./media/create-web-app-assessment/select-create-assessment.png" alt-text="Screenshot shows how to select and create assessment." lightbox="./media/create-web-app-assessment/select-create-assessment.png" :::

3. Provide a suitable name for the assessment and select **Add workloads**. 

   :::image type="content" source="./media/create-web-app-assessment/add-workloads.png" alt-text="Screenshot shows how to add workloads." lightbox="./media/create-web-app-assessment/add-workloads.png" :::

4. Using the filters, select **web apps**, and select **Add**. 

    :::image type="content" source="./media/create-web-app-assessment/add-workloads-using-filters.png" alt-text="Screenshot shows how to use filters and add workloads." lightbox="./media/create-web-app-assessment/add-workloads-using-filters.png" :::

5. Review the selected workloads and select **Next**. 

   :::image type="content" source="./media/create-web-app-assessment/review-selected-workload.png" alt-text="Screenshot shows how to review selected workloads." lightbox="./media/create-web-app-assessment/review-selected-workload.png" :::
6. On the **General settings** tab, modify the assessment settings that are applicable across all Azure targets. 

   :::image type="content" source="./media/create-web-app-assessment/general-settings-tab.png" alt-text="Screenshot shows assessment settings that are applicable across all Azure targets." lightbox="./media/create-web-app-assessment/general-settings-tab.png" :::

   ::: moniker range="migrate-classic"
   | **Setting**  | **Description**  | **Possible Values**  | 
   |-|-|-|
   | Default target location | Used to generate regional cost for Azure targets.   | All locations supported by Azure targets | 
   | Default environment  | Allows you to toggle between pay-as-you-go and pay-as-you-go Dev/Test offers. | Production <br> Dev/Test |
   | Currency  | Generates the cost in the currency selected here.  | All common currencies such as USD, INR, GBP, Euro |
   | Program/offer    | Allows you to toggle between [pay-as-you-go and Enterprise Agreement](https://azure.microsoft.com/support/legal/offer-details/) offers. | Pay-as-you-go <br> Enterprise Agreement |       
   | Default savings option | Select a savings option if you opted for Reserved Instances or Savings Plan. | 1 year reserved  <br>  3 years reserved <br> 1 year savings plan <br> 3 years savings plan  <br> None |
   | Discount(%)         | Used to factor in any custom discount agreements with Microsoft. This setting is disabled if Savings options are selected.  | Numeric decimal value                             
   | EA subscription    | Select the subscription ID for which you have an Enterprise Agreement.         | Subscription ID         |
   | Microsoft Defender for cloud    | Includes Microsoft Defender for App Service cost in the month over month cost estimate. | -                       |
   ::: moniker-end

   ::: moniker range="migrate"
   | **Setting**  | **Description**  | **Possible Values**  |
   |-|-|-|
   | Default target location | Target Azure region to which you want to migrate your workloads. Target right-sizing and costing recommendations would be done based on the selected location.  | All locations supported by Azure targets |
   | Default environment  | Environment type for the workloads you intend to migrate. You can avail Azure discounts for Dev/Test workloads. | - Production (default)<br> -	Dev/Test |
   | Currency  | Currency in which you would like to get your cost estimates. | Multiple options, Default is US Dollar ($) |
   | Program/offer  | The Azure offer in which you're enrolled. Assessment estimates the cost for that offer. | - [Pay-as-you-go](https://azure.microsoft.com/pricing/offers/ms-azr-0003p/) (default)<br> - [Enterprise Agreement](https://azure.microsoft.com/pricing/offers/enterprise-agreement-support/)<br> - [Microsoft Customer Agreement](/azure/cost-management-billing/understand/mca-overview) |
   | Default savings option | Select applicable commitment-based savings option if you opted for Reserved Instances or Savings Plan. | - 1 year reservation<br> - 3 years reservation<br> - 1 year savings plan or 1 year reservation<br> - 3 year savings plan or 3 year reservation<br> - None |
   | Discount(%)          | Any subscription-specific discounts you receive on top of the Azure offer. This setting is disabled if Savings option is selected. | Numeric decimal value, Default is 0% |
   | Subscription              | Negotiated subscription ID for cost estimation | Only Negotiated subscription IDs are listed here |
   | Uptime | Time for which you expect the workloads to run |	Days per month and Hours per day |
   | Sizing criteria	|	Criteria for target Web app right-sizing | - Performance based  (default) – Select this option if you want assessment based on resource utilization (CPU and memory) and configuration data<br> -	As on-premises - Select this option if you want assessment based on configuration data of the on-premises workloads<br> In case of unavailability of performance data, assessment would be generated with As on-premises target sizing. |
   | Performance history |		Duration of performance history to generate assessment of the on-premises workloads | -	1 day (default)<br> - 1 week<br> -	1 month |
   | Percentile utilization |	Percentile value considered for the performance history of the on-premises workloads | - 50th<br> -	90th<br> -	95th (default)<br> - 99th |
   | Comfort factor |	Buffer added on top of utilization to account for scenarios like seasonal spikes in usage, insufficient performance data, likely increase in future usage, etc. As an example, normally, a 16-core VM with 20% utilization results in a 4-core VM. With a comfort factor of 2.0, it results in an 8-core VM as a match. | 	Multiple options. Default is 1. |
   | Azure Hybrid benefit		|  Azure Hybrid Benefit allows Microsoft customers with Windows Server Software Assurance or Windows Server subscriptions to bring their licenses to Azure. [Learn more](https://azure.microsoft.com/pricing/offers/hybrid-benefit/) | Specify whether you already have a Windows Server license. This setting is enabled by default. |
   | Microsoft Defender for cloud | Includes Microsoft Defender for Cloud to protect your Web apps on Azure. | Specify whether you want to include Microsoft Defender for Cloud in the cost estimate. Microsoft Defender for App service or Microsoft Defender for Containers cost would be selected based on the target workload. This setting is enabled by default. |
   ::: moniker-end
 
7. On the **Advanced settings** tab, select **Edit defaults** to choose the preferred Azure targets and target-specific settings to meet your migration requirements. 

   :::image type="content" source="./media/create-web-app-assessment/edit-defaults.png" alt-text="Screenshot shows how to edit defaults to choose the preferred target." lightbox="./media/create-web-app-assessment/edit-defaults.png" :::

   ::: moniker range="migrate"
   **Infrastructure - Azure VM settings**

   :::image type="content" source="./media/create-web-app-assessment/infrastructure-azure-vm-settings-section.png" alt-text="Screenshot shows possible values for Azure VM settings." lightbox="./media/create-web-app-assessment/infrastructure-azure-vm-settings-section.png" :::

   | **Setting** | **Description** | **Possible Values**  | 
   |-|-|-|
   | VM sizing | The Azure VM series that you want to consider for rightsizing. | All VM services are selected by default | 
   | Storage sizing | Specifies the type of target storage disk | - Premium managed disk<br> - Standard HDD managed disks<br> - Standard SSD managed disks<br> - Ultra disks |
   | Security settings | Security type of the VM | - Standard<br> - Trusted launch VM |
   ::: moniker-end

   **AKS settings**

   :::image type="content" source="./media/create-web-app-assessment/infrastructure-aks-settings-section.png" alt-text="Screenshot shows possible values for  Azure Kubernetes Service settings." lightbox="./media/create-web-app-assessment/infrastructure-aks-settings-section.png" :::
   
   | **Setting** | **Description** | **Possible Values**  | 
   |-|-|-|
   | Category | Selecting a particular SKU category ensures we recommend the best AKS Node SKUs from that category. | - All <br> - Compute optimized <br> - General purpose <br> - GPU <br> - High performance compute  <br> - Isolated  <br> - Memory optimized <br> - Storage optimized |
   | Pricing tier | Pricing tier for AKS | Standard  | 
   | Consolidation   | Maximize the number of web apps to be packed per node. | Full Consolidation(default) |

   **App Service settings**

   :::image type="content" source="./media/create-web-app-assessment/infrastructure-app-service-settings-section.png" alt-text="Screenshot shows possible values for App Service settings." lightbox="./media/create-web-app-assessment/infrastructure-app-service-settings-section.png" :::
    
   | **Setting** | **Description** | **Possible Values** |
   |-|-|-|
   | Isolation required | The Isolated plan allows you to run your apps in a private, dedicated environment in an Azure datacenter using Dv2-series VMs with faster processors, SSD storage, and double the memory-to-core ratio compared to Standard.| - No   <br> - Yes   |

8. Review and create the assessment. 

   :::image type="content" source="./media/create-web-app-assessment/review-and-create.png" alt-text="Screenshot shows how to review and create the assessment." lightbox="./media/create-web-app-assessment/review-and-create.png" :::

::: moniker range="migrate"
## Target right-sizing for Web apps

Azure Migrate supports two types of target sizing for Web app assessments:

#### Performance-based Sizing

This method provides target size recommendations based on gathered performance data. 

- For ASP.NET web apps, performance data is collected for the associated application pools.
    - When multiple web apps run under the same application pool, the percentage of resources allocated to every web app is a linear function of the number of apps in the application pool.
    - The more the number of web apps in a single application pool, the lesser the resource allocation per app.
    - The minimum utilization share for any web app is 60%.

- For Java Web Apps on Tomcat Server, performance data is collected for each Tomcat server instance. When multiple web apps are running on a single Tomcat server, resource distribution follows a similar pattern as with ASP.NET web apps.

- Performance data is collected every 15 minutes in both ASP.NET and Java web app scenarios and stored in a service-managed storage account.

> [!NOTE]
> For private endpoint scenarios, data is stored in a user-managed Storage account set up during Azure Migrate project creation.

#### As on-premises sizing: 
This method provides target size recommendations based on configuration data. Following values are considered for CPU and memory utilization per web app:
- ASP.NET web app: 0.15 cores, 0.25 GB memory
- Java web app: 0.15 cores, 0.15 GB memory. If static memory is configured for Tomcat server, it is considered instead of these values.

Besides the values estimated for performance-based and as on-premises sizing, following default resource utilization values for running the container image for each web app are added when Azure App Service containers and AKS are considered as migration targets:
- ASP.NET web app: 0.2 core, 0.65 GB memory
- Java web app: 0.1 core, 0.25 GB memory
::: moniker-end

## Next steps 

- Understand the [assessment insights](https://microsoftapc.sharepoint.com/:w:/t/AzureCoreIDC/EQ8jF5QuAeJDqoYwJ8Y_k1IBOH8E2zjyGIChYANVLUxRdw?e=WIsw26) to make data-driven decisions for web app modernization. 
- [Optimize](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) Windows Dockerfiles. 
- Review and implement [best practices](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) to build and manage apps on AKS.
 
