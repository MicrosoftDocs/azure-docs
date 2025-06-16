---
title: Tutorial to assess web apps for migration
description: Learn how to create assessment for web apps in Azure Migrate
author: ankitsurkar06
ms.author: ankitsurkar
ms.topic: tutorial
ms.date: 05/08/2025
ms.service: azure-migrate
ms.custom: engagement-fy24
monikerRange: migrate
---
# Tutorial: Create web app assessment for modernization 

This article describes how to create a web app assessment for modernization to [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) or Azure App Service using Azure Migrate. Creating an assessment for your web apps provides the recommended targets for them and key insights such as app-readiness, target right-sizing, and cost to host, and run these apps month over month. 

In this article, you learn how to: 

- Set up your Azure Migrate environment to assess web apps. 
- Choose a set of related web applications discovered using the Azure Migrate appliance. 
- Provide assessment configurations such as preferred Azure targets, target region, Azure reserved Instances. 
- Create web app assessment with a recommended modernization path. 

## Prerequisites 

- Deploy and configure the Azure Migrate appliance in your [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [physical](tutorial-discover-physical.md) environments. 
- Check the [appliance requirements](migrate-appliance.md#appliance---vmware) and [URL access](migrate-appliance.md#url-access) to be provided. 
- Follow [these steps](how-to-discover-sql-existing-project.md) to discover web apps running on your environment. 

## Create a workload assessment for web apps

To create an assessment, follow these steps.

1. On the Azure Migrate project **Overview** page, under **Decide and Plan**, select **Assessments**.  

    :::image type="content" source="./media/create-web-app-assessment/create-workload-assessment.png" alt-text="Screenshot shows how to create web app assessment." lightbox="./media/create-web-app-assessment/create-workload-assessment.png" :::

1. Select **Create assessment**.
1. Provide a suitable name for the assessment and select **Add workloads**. 
1. Using the filters, select **web apps**, and select **Add**. 
1. Review the selected workloads and select **Next**. 
1. On the **General settings** tab, modify the assessment settings that are applicable across all Azure targets. 
 
    | **Setting**  | **Possible Values**  | **Description**  |
    |----------|-------|---|
    | Default target location | All locations supported by Azure targets | Used to generate regional cost for Azure targets.   |
    | Default Environment  | Production <br> Dev/Test  | Allows you to toggle between pay-as-you-go and pay-as-you-go Dev/Test offers.  |
    | Currency  | All common currencies such as USD, INR, GBP, Euro | Generates the cost in the currency selected here.  |
    | Program/offer  | Pay-as-you-go <br> Enterprise Agreement           | Allows you to toggle between [pay-as-you-go and Enterprise Agreement](https://azure.microsoft.com/support/legal/offer-details/) offers.|
    | Default savings option | 1 year reserved  <br>  3 years reserved <br> 1 year savings plan <br> 3 years savings plan  <br> None  | Select a savings option if you opted for Reserved Instances or Savings Plan. | 
    | Discount Percentage          | Numeric decimal value                             | Used to factor in any custom discount agreements with Microsoft. This setting is disabled if Savings options are selected. |
    | EA subscription              | Subscription ID                                   | Select the subscription ID for which you have an Enterprise Agreement.                                                 |
    | Microsoft Defender for Cloud | -                                                 | Includes Microsoft Defender for App Service cost in the month over month cost estimate.                                |
 
1. On the **Advanced settings** tab, select **Edit defaults** to choose the preferred Azure targets and target-specific settings. 

   **AKS Settings**

    | **Setting** | **Possible Values**  | **Description** |
    |------------------|--------------------------|------------|
    | Category         | All <br> Compute optimized <br> General purpose <br> GPU <br> High performance compute  <br> Isolated  <br> Memory optimized <br> Storage optimized | Selecting a particular SKU category ensures we recommend the best AKS Node SKUs from that category. |
    | AKS pricing tier | Standard  | Pricing tier for AKS |
    | Consolidation    | Full Consolidation | Maximize the number of web apps to be packed per node. |

 
    **App Service Settings** 

    | **Setting** | **Possible Values** | **Description** |
    |--------------------|-----------------|-----------|
    | Isolation required | No   <br> Yes   | The Isolated plan allows you to run your apps in a private, dedicated environment in an Azure datacenter using Dv2-series VMs with faster processors, SSD storage, and double the memory-to-core ratio compared to Standard.|

1. Review and create the assessment. 
 
## Next steps 

- Understand the [assessment insights](https://microsoftapc.sharepoint.com/:w:/t/AzureCoreIDC/EQ8jF5QuAeJDqoYwJ8Y_k1IBOH8E2zjyGIChYANVLUxRdw?e=WIsw26) to make data-driven decisions for web app modernization. 
- [Optimize](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) Windows Dockerfiles. 
- Review and implement [best practices](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) to build and manage apps on AKS. 

 