---
title: Assessing on-premises MongoDB for Migration to Azure DocumentDB
description: Learn how to assess on-premises MongoDB workloads for Azure migration using Azure Migrate, including how to run configuration-based assessments and analyze readiness, risks, and cost estimates.
author: sandeepsnairms
ms.author: sandnair
ms.service: azure-migrate 
ms.topic: tutorial
ms.date:  04/28/2026
ms.custom: engagement-fy24 
# Customer intent: Customers want to assess on-premises MongoDB workloads using Azure Migrate to prepare for migration to Azure DocumentDB. They aim to evaluate cloud readiness, risks, and costs through configuration-based assessments.
---


# Tutorial: Assess on-premises MongoDB for migration to Azure DocumentDB using Azure Migrate (preview)

 This tutorial shows how to assess discovered MongoDB instances and databases by using Azure Migrate: Discovery and assessment. You can use the assessment results to understand readiness, identify potential issues, and estimate the target configuration and cost for Azure DocumentDB.

As you plan your migration to Azure, it's important to assess your on-premises MongoDB workloads to determine cloud readiness, identify potential risks, and estimate migration costs and complexity.

In this tutorial, you learn how to:

- Select related MongoDB workloads discovered using the Azure Migrate appliance. 

- Configure assessment settings, such as target Azure environment, region, reserved instances, and sizing criteria. 

- Create a MongoDB assessment and review the recommended modernization path. 

## Prerequisites

Before you begin, ensure to have the following prerequisites:

- An active Azure subscription and have completed discovery of your on-premises MongoDB instances using Azure Migrate.
- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- Before you assess your MongoDB instances for migration to Azure, ensure you discover the instances using the Azure Migrate appliance. For more information, follow the [discovery tutorial](tutorial-discover-vmware.md).

## Decide sizing strategy for assessment

Azure Migrate uses the configuration details and metadata it collects from your MongoDB instances to generate recommendations for Azure DocumentDB.

| Assessment | Details | Recommendation |
| --- | --- | --- |
| As on-premises | Assess based on MongoDB configuration data/metadata. | The recommended Azure DocumentDB configuration is based on the on-premises MongoDB configuration, which includes server parameters (`mongod.conf`), allocated memory, and connection settings. This assessment type is ideal for understanding configuration compatibility and planning migrations where performance baselines aren't yet available or when workload characteristics require a longer duration to capture comprehensive performance metrics. |

##  Create and run assessment

 Create an assessment to evaluate your MongoDB workloads and generate target recommendations for Azure DocumentDB.

To run an assessment, follow these steps:

1. On the Azure Migrate project overview page, select **Create assessment**.

    :::image type="content" source="./media/tutorial-assess-mongodb/create-assessment.png" alt-text="Screenshot shows how to create assessment." lightbox="./media/tutorial-assess-mongodb/create-assessment.png":::
2. Enter an assessment name, select the **MongoDB workloads**, and then select **Add workloads**.

    :::image type="content" source="./media/tutorial-assess-mongodb/assessment-name.png" alt-text="Screenshot shows how to add assessment name." lightbox="./media/tutorial-assess-mongodb/assessment-name.png":::

    :::image type="content" source="./media/tutorial-assess-mongodb/select-workloads.png" alt-text="Screenshot shows how to select workloads." lightbox="./media/tutorial-assess-mongodb/select-workloads.png":::
3. After adding the MongoDB workloads, select **Next** to proceed.

    :::image type="content" source="./media/tutorial-assess-mongodb/review-selected-workloads.png" alt-text="Screenshot shows how to review selected workloads." lightbox="./media/tutorial-assess-mongodb/review-selected-workloads.png":::
4. On the **General tab**, review the assessment settings. Change any values that you need, and then select **Next**.

    :::image type="content" source="./media/tutorial-assess-mongodb/review-created-assessment.png" alt-text="Screenshot shows review the created assessment." lightbox="./media/tutorial-assess-mongodb/review-created-assessment.png":::

    | Section | Setting | Details |
    | --- | --- | --- |
    | Target and pricing settings | Default target location | The Azure region to which you want to migrate. Azure DocumentDB configuration and cost recommendations are based on the location that you specify |
    | Target and pricing settings | Default environment | Choose the environment type (Production or Dev/Test) for MongoDB deployments to apply the appropriate pricing. |
    | Target and pricing settings | Currency | The billing currency for your account. |
    | Target and pricing settings | Program/Offer | Specify the Microsoft licensing program you would like to use for cost estimation. Select Enterprise Agreement if you have a negotiated Enterprise Agreement with Microsoft. Choose the Azure offer in which you're enrolled. By default, this field is set to pay-as-you-go, which provides retail Azure prices. You can apply another discount by using Reserved Capacity and Azure Hybrid Benefit on top of the pay-as-you-go offer. You can apply Azure Hybrid Benefit to both pay-as-you-go and Dev/Test environments. However, the assessment doesn't support applying Reserved Capacity to Dev/Test environments. If the offer is pay-as-you-go and Reserved Capacity is set to 'No reserved instances,' the monthly cost is calculated by multiplying the VM uptime hours by the hourly price of the recommended SKU. |
    | Target and pricing settings | Default Savings options - Azure DocumentDB (PaaS) | Specify the reserved capacity savings option that you want the assessment to consider, helping to optimize your Azure cost. Azure reservations (one or three years reserved) are a good option for the consistently running resources. When you select 'None', the Azure compute cost is based on the pay-as-you-go  rate or based on actual usage. |
    | Target and pricing settings | Discount (%) | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. |
    | Target and pricing settings | Uptime | Specify the duration (days per month/hour per day) that servers/VMs run. This is useful for computing cost estimates for MongoDB on Azure VM where you're aware that Azure VMs might not run continuously. |
    | Assessment criteria | Sizing criteria | You can change this to As on-premises to get recommendations based on just the on-premises MongoDB Server configuration without the performance metric-based optimizations. |
    | Assessment criteria | Performance history | Indicate the data duration on which you want to base the assessment. This setting isn't applicable for MongoDB instances as the sizing criteria is "Configuration-based". Performance history is relevant when performance-based assessments are available. |
    | Assessment criteria | Percentile utilization | Indicate the percentile value you want to use for the performance sample. This setting isn't applicable for MongoDB instances as the sizing criteria is "Configuration-based". Performance history is relevant when performance-based assessments are available. |
    | Assessment criteria | Comfort factor | Indicate the buffer you want to use during assessment. This accounts for factors like seasonal usage, short performance history, and likely increases in future usage. |
6. On the **Review + create assessment** page, verify the details, and then select **Create**.

    :::image type="content" source="./media/tutorial-assess-mongodb/review-create-assessment.png" alt-text="Screenshot shows users how to review and create assessment." lightbox="./media/tutorial-assess-mongodb/review-create-assessment.png":::
7. After the assessment is created, open **Assessments** (under **Decide and plan**) to view the assessment report.

    :::image type="content" source="./media/tutorial-assess-mongodb/assessments.png" alt-text="Screenshot shows users how to decide and plan the assessment." lightbox="./media/tutorial-assess-mongodb/assessments.png":::
8. Select the name of the assessment you want to view.

    :::image type="content" source="./media/tutorial-assess-mongodb/assessments-two.png" alt-text="Screenshot shows users how to select the required assessment." lightbox="./media/tutorial-assess-mongodb/assessments-two.png":::

> [!NOTE]
> This is a configuration-based assessment that analyses your MongoDB setup for compatibility with Azure DocumentDB.

## Next steps

- [Review MongoDB assessment](tutorial-review-mongodb-report.md).