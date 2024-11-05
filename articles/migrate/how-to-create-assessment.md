---
title: Create an Azure VM assessment with Azure Migrate Discovery and assessment tool | Microsoft Docs
description: Describes how to create an Azure VM assessment with the Azure Migrate Discovery and assessment tool
author: rashi-ms
ms.author: rajosh
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 11/05/2024
ms.custom: engagement-fy23
---

# Create an Azure VM assessment

This article explains how to create Azure VM assessments. For more on general Azure Migrate assessment concepts, refer to the assessment overview. To quickly migrate your on-premises or public cloud servers to Azure using lift and shift, create an Azure VM assessment to check readiness, cost, and get migration advice for your workloads. 

> [!Note]
> All assessments you create with Azure Migrate are a point-in-time snapshot of data. The assessment results are subject to change based on aggregated server performance data collected or change in the source configuration.  

## Prerequisites 

Before you start creating assessments, ensure you have discovered the inventory of your on-premises servers, and you can view all the servers in the **Infrastructure** tab. For more details about prerequisites, see [Prerequisites for assessments](assessment-prerequisites.md). 

You can discover your on-premises servers using wither of the following: 

- [Discover servers using the Azure Migrate appliance](tutorial-discover-hyper-v.md)
- [Discover the servers using an import](tutorial-discover-import.md) 

Once you have discovered your servers, identify if you want to create an As-is on-premises assessment or Performance-based assessment. Check [Performance vs. As-is on-premises assessments](target-right-sizing.md) for more details.  

## Create an assessment 

1. To create an Azure VM assessment, go to **Infrastructure** tab and select all the VMs you would like to assess.
1. You can apply column based or custom tags-based filters to identify and add VMs to the scope of your assessment. 
1. After you have selected all the servers, select **Create assessment**.  
1. Provide a friendly name for the assessment. You see a query that you used to select the servers on the previous screen. Review the number of servers added and the query used before moving ahead. If you want to add more servers to the assessment, select **Add workloads**. Once you have added all the servers to the assessment scope, select **Next**. 
1. You can customize the assessment properties to fit your requirements. Specify the general properties for **Target region**, **Default environment**, **Pricing options**, **Saving options**, and **Sizing criteria**. [Learn more](assessment-report.md). 
1. Select **Next** to navigate to the Azure VM specific assessment properties.  
1. Select **Edit defaults** to review and customize server-specific settings.  
1. Select **Edit defaults** for Azure VM to review the settings for Azure VM assessment. [Learn more](assessment-properties.md).
1. Select **Save** if you customized any property.
1. In **Review + create assessment**, review the assessment details, and select **Create Assessment** to run the assessment. 
1. After the assessment is created, view the assessment in **Decide and plan** > **Assessments** > **Workloads**.  

## Next steps

- Learn how to use [dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
