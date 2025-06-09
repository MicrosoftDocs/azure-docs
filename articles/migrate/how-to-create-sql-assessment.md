---
title: Create an SQL assessment with Azure Migrate | Microsoft Docs
description: Describes how to create SQL Azure assessment with the Azure Migrate 
author: rashi-ms
ms.author: v-uhabiba
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 05/08/2025
ms.custom: engagement-fy23
monikerRange: migrate
---

# Create SQL assessment

This article to create SQL assessments for migration to Azure, targeting different Azure PaaS and laaS options using Azure Migrate. By creating as assessment for your SQL instances, you'll receive recommended target environments and key insights, such as **readiness**, **target right-sizing**, and monthly **costs** for hosting and running these applications.

## Prerequisites

* Deploy and configure the Azure Migrate appliance in your [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or physical environment.
* Check the appliance requirement [Azure Migrate appliance](migrate-appliance.md#appliance---vmware) [URL access](migrate-appliance.md#url-access)
* [Migration to App Service Environment v3 using the in-place migration feature](../app-service/environment/migrate.md) to discover web applications running in your environment.

## Create a workload assessment for webapps

1. On the **Azure Migrate** project overview page, under **Decide and plan**, select **Assessments**.

    :::image type="content" source="./media/how-to-create-sql-assessment/assessment.png" alt-text=" Screenshot of assessment page on how to sql create an assessment.":::

1. In **Assessments** page, select **Create assessment**.

    :::image type="content" source="./media/how-to-create-sql-assessment/create-assessment.png" alt-text="Screenshot of assessment page on how to create an assessment.":::

1. Provide a suitable name for the assessment, then select **Add workloads**.

    :::image type="content" source="./media/how-to-create-sql-assessment/add-workloads.png" alt-text="Screenshot of sql assessment page on how to add the workloads.":::

1. Use the appropriate filters, select the webapp and then select **Add**.

    :::image type="content" source="./media/how-to-create-sql-assessment/select-add.png" alt-text="Screenshot of sql assessment page on how to select webapp and add.":::

1. Select **Review the selected workloads** and then select **Next**.

    :::image type="content" source="./media/how-to-create-sql-assessment/review-selected-workloads.png" alt-text="Screenshot of sql assessment page on how to review the selected workloads.":::

1. On the **General** tab, modify the assessment settings that apply to all Azure targets.

    :::image type="content" source="./media/how-to-create-sql-assessment/general-settings.png" alt-text=" Screenshot that explains on how to modify assessment settings.":::

    Settings | Possible values | Comments
    --- | --- | ---
    Default target location  | All locations supported by Azure targets  | Used to generate regional cost for Azure targets. 
    Default Environment  | Production <br/> Dev/Test | Allows you to toggle between pay-as-you-go and pay-as-you-go Dev/Test offers. 
    Currency  | All common currencies such as USD, INR, GBP, Euro  | We generate the cost in the currency selected here.
    Program/offer  |Pay-as-you-go <br/> Enterprise Agreement  | Allows you to toggle between pay-as-you-go and Enterprise Agreement offers. 
    Default savings option  | One year reserved <br/> Three years reserved <br/> One year savings plan <br/> Three years savings plan <br/> None | Select a savings option if you've opted for Reserved Instances or Savings Plan.
    Discount Percentage  | Numeric decimal value  | Use this option to factor in any custom discount agreements with Microsoft. It's disabled if Savings options are selected. 
    EA subscription  | Subscription ID  | Select the subscription ID for which you have an Enterprise Agreement. 
    Default savings options  | One year reserved <br/> Three years reserved <br/> One year savings plan <br/> Three years savings plan <br/>None  | Select a savings option if you've opted for Reserved Instances or Savings Plan. 
    Microsoft Defender for Cloud  | - | Includes Microsoft Defender for App Service costs in the month-over-month cost estimate. 

1. On the **Advanced** tab, select **Edit defaults** and then select the preferred Azure targets and configure target-specific settings.  

    :::image type="content" source="./media/how-to-create-sql-assessment/edit-defaults.png" alt-text="Screenshot of sql assessment that shows how to edit defaults.":::

**AKS settings**: The following table details about the AKS settings.

 Settings | Possible values | Comments
 --- | --- | ---
 Category   | All <br/>Compute optimized <br/> General purpose <br/> GPU <br/> High performance compute <br/> Isolated <br/> Memory optimized <br/> Storage optimized   | Selecting a specific SKU category ensures that we recommend the best AKS node SKUs from that category. 
 AKS pricing tier   | Standard  | Pricing tier for AKS 
 Consolidation   | Full Consolidation   | Maximize the number of webapps to be packed per node. 

**App service settings**: The following table details the App service settings

  Settings | Possible values | Comments
  --- | --- | ---
  Isolation required    | No <br/> Yes   | The isolated plan enables customers to run their apps in a private, dedicated environment within an Azure data center, using Dv2-series VMs with faster processors, SSD storage, and double the memory-to-core ratio compared to Standard VMs.

Now, review and create the assessment. 

:::image type="content" source="./media/how-to-create-sql-assessment/review-create-assessment.png" alt-text="Screenshot of sql assessment page on how to review and create assessment.":::

## Next steps

- Understand the [assessment insights](create-web-app-assessment.md) to make data-driven decisions for web app modernization
- Optimize [Windows Dockerfiles](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context). 
- Review and implement [best practices](/virtualization/windowscontainers/manage-docker/optimize-windows-dockerfile?context=%2Fazure%2Faks%2Fcontext%2Faks-context) to build and manage apps on AKS. 