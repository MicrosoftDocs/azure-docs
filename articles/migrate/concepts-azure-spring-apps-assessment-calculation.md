---
title: Azure Spring Apps assessments in Azure Migrate Discovery and assessment tool
description: Learn about Azure Spring Apps assessments in Azure Migrate Discovery and assessment tool
author: yangyizhe90
ms.author: yangtony
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 09/05/2023
ms.custom: engagement-fy23
---

# Assessment overview (migrate to Azure Spring Apps)

This article provides an overview of assessments for migrating on-premises Spring Boot apps to Azure Spring Apps using the [Azure Migrate: Discovery and assessment tool](./migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool).

## What's an assessment?
An assessment with the Discovery and assessment tool is a point in time snapshot of data and measures the readiness and provides cost details to host on-premises servers, databases, and web apps to Azure.

## Types of assessments

There are four types of assessments you can create using the Azure Migrate: Discovery and assessment tool.

**Assessment Type** | **Details**
--- | ---
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises servers in [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Web apps on Azure** | Assessments to migrate your on-premises Spring Boot apps to Azure Spring Apps or ASP.NET web apps to Azure App Service.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

An Azure Spring Apps assessment provides one sizing criteria:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessment that makes recommendations based on collected resource consumption data | The Azure Spring Apps assessment is calculated based on the memory consumption of your discovered workload, and an estimated consumption of CPU cores.

## How do I assess my on-premises Spring Boot apps?

You can assess your on-premises Spring Boot apps by using the configuration data collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises Spring Boot apps and sends the configuration data to Azure Migrate. [Learn More](how-to-set-up-appliance-vmware.md)

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
2. For your first assessment, create an Azure Migrate project. Azure Migrate: Discovery and assessment tool gets added to the project by default.
3. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends configuration and performance data to Azure Migrate. Deploy the appliance as a VM or a physical server. You don't need to install anything on servers that you want to assess.

After the appliance begins discovery, you can gather servers (hosting Spring Boot apps) you want to assess into a group and run an assessment for the group with assessment type **Web apps on Azure**.

Follow our guide for assessing [Spring Boot apps](how-to-create-azure-spring-apps-assessment.md) to try out these steps.

## What properties are used to customize the assessment?

Here's what's included in Azure Spring Apps assessment properties:

| **Setting** | **Details** |
| --- | --- |
| **Target location** | The Azure region to which you want to migrate. Azure Spring Apps configuration and cost recommendations are based on the location that you specify. |
| **Environment type** | Specifies the environment to apply pricing applicable to Production or Dev/Test. |
| **Offer/Licensing program** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer. |
| **Currency** | The billing currency for your account. |
| **Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%. |
| **EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Leave the settings for reserved instances, and discount (%) properties with their default settings. |
| **Savings options (compute)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide more flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. <br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' setting isn't applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.|

[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate.

## Calculate readiness

### Azure Spring Apps readiness

Azure Spring Apps readiness for Spring Boot apps is based on feature compatibility checks between on-premises configuration of Spring Boot apps and Azure Spring Apps:

1. The Azure Spring Apps assessment considers the Spring Boot apps configuration data to identify compatibility issues.
1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type.
1. If there are non-critical compatibility issues, such as degraded or unsupported features that don't block the migration to a specific target deployment type, the readiness is marked as **Ready with conditions** (hyperlinked) with **warning** details and recommended remediation guidance. You may migrate such apps first and optimize later.
1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
1. If the discovery is still in progress or there are any discovery issues for a Spring Boot app, the readiness is marked as **Unknown** as the assessment couldn't compute the readiness for that Spring Boot app.

## Calculate sizing

### Azure Spring Apps cost details

The assessment summary shows the estimated monthly costs for hosting you apps in Spring Apps. In Azure Spring Apps, you pay charges per Azure Spring Apps service instance and not per app. One or more apps can be configured to run on the same service instance. Whatever apps you put into this Azure Spring Apps service instance are all up to you.

For the purpose of cost estimation, we assume you would put all your accessed apps into the same Azure Spring Apps service instance. Learn more about the details of Azure Spring Apps pricing from the [pricing page](https://azure.microsoft.com/pricing/details/spring-apps/) and [pricing calculator](https://azure.microsoft.com/pricing/calculator/), note that the monthly cost on this card assumes each month has 744 hours instead of 730 hours.

The estimated cost applies for both Azure Spring Apps Standard Tier and Enterprise Tier. For Enterprise Tier, there will be additional cost on [software IP](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/vmware-inc.azure-spring-cloud-vmware-tanzu-2?tab=PlansAndPrice) and resource consumption for Tanzu components, which are not included in cost estimation.

## Next steps
- [Review](best-practices-assessment.md) best practices for creating assessments.
- Learn how to run an [Azure Spring Apps assessment](how-to-create-azure-spring-apps-assessment.md).