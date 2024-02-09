---
title: Azure App Service assessments in Azure Migrate Discovery and assessment tool
description: Learn about Azure App Service assessments in Azure Migrate Discovery and assessment tool
author: rashi-ms
ms.author: rajosh
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 08/02/2023
ms.custom: engagement-fy23
---

# Assessment overview (migrate to Azure App Service)

This article provides an overview of assessments for migrating on-premises ASP.NET web apps to Azure App Service using the [Azure Migrate: Discovery and assessment tool](./migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool).

## What's an assessment?
An assessment with the Discovery and assessment tool is a point in time snapshot of data and measures the readiness and provides cost details to host on-premises servers, databases, and web apps to Azure.

## Types of assessments

There are four types of assessments you can create using the Azure Migrate: Discovery and assessment tool.

**Assessment Type** | **Details**
--- | ---
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises servers in [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs using this assessment type.
**Azure SQL** | Assessments to migrate your on-premises SQL servers from your VMware environment to Azure SQL Database or Azure SQL Managed Instance.
**Azure App Service** | Assessments to migrate your on-premises ASP.NET web apps running on IIS web servers to Azure App Service.
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

An Azure App Service assessment provides one sizing criteria:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Configuration-based** | Assessments that make recommendations based on collected configuration data | The Azure App Service assessment takes only configuration data in to consideration for assessment calculation. Performance data for web apps isn't collected.

## How do I assess my on-premises ASP.NET web apps?

You can assess your on-premises web apps by using the configuration data collected by a lightweight Azure Migrate appliance. The appliance discovers on-premises web apps and sends the configuration data to Azure Migrate. [Learn More](how-to-set-up-appliance-vmware.md)

## How do I assess with the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
2. For your first assessment, create an Azure Migrate project. Azure Migrate: Discovery and assessment tool gets added to the project by default.
3. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends configuration and performance data to Azure Migrate. Deploy the appliance as a VM or a physical server. You don't need to install anything on servers that you want to assess.

After the appliance begins discovery, you can gather servers (hosting web apps) you want to assess into a group and run an assessment for the group with assessment type **Azure App Service**.

Follow our tutorial for assessing [ASP.NET web apps](tutorial-assess-webapps.md) to try out these steps.

## What properties are used to customize the assessment?

Here's what's included in Azure App Service assessment properties:

**Setting** | **Details**
--- | ---
**Target location** | The Azure region to which you want to migrate. Azure App Service configuration and cost recommendations are based on the location that you specify.
**Isolation required** | Select **yes** if you want your web apps to run in a private and dedicated environment in an Azure datacenter using Dv2-series VMs with faster processors, SSD storage, and double the memory to core ratio compared to Standard plans.
**Savings options (compute)** | Specify the savings option that you want the assessment to consider to help optimize your Azure compute cost. <br><br> [Azure reservations](../cost-management-billing/reservations/save-compute-costs-reservations.md) (1 year or 3 year reserved) are a good option for the most consistently running resources.<br><br> [Azure Savings Plan](../cost-management-billing/savings-plan/savings-plan-compute-overview.md) (1 year or 3 year savings plan) provide additional flexibility and automated cost optimization. Ideally post migration, you could use Azure reservation and savings plan at the same time (reservation is consumed first), but in the Azure Migrate assessments, you can only see cost estimates of 1 savings option at a time. <br><br> When you select 'None', the Azure compute cost is based on the Pay as you go rate or based on actual usage.<br><br> You need to select pay-as-you-go in offer/licensing program to be able to use Reserved Instances or Azure Savings Plan. When you select any savings option other than 'None', the 'Discount (%)' setting isn't applicable. The monthly cost estimates are calculated by multiplying 744 hours with the hourly price of the recommended SKU.
**Offer** | The [Azure offer](https://azure.microsoft.com/support/legal/offer-details/) in which you're enrolled. The assessment estimates the cost for that offer.
**Currency** | The billing currency for your account.
**Discount (%)** | Any subscription-specific discounts you receive on top of the Azure offer. The default setting is 0%.
**EA subscription** | Specifies that an Enterprise Agreement (EA) subscription is used for cost estimation. Takes into account the discount applicable to the subscription. <br/><br/> Leave the settings for reserved instances, discount (%) and VM uptime properties with their default settings.
**Security** | Specifies whether you want to assess readiness and cost for security tooling on Azure. If the setting has the default value **Yes, with Microsoft Defender for Cloud**, it will assess security readiness and costs for your Azure App Service deployment with Microsoft Defender for Cloud.  

[Review the best practices](best-practices-assessment.md) for creating an assessment with Azure Migrate.

## Calculate readiness

### Azure App Service readiness

Azure App Service readiness for web apps is based on feature compatibility checks between on-premises configuration of web apps and Azure App Service:

1. The Azure App Service assessment considers the web apps configuration data to identify compatibility issues.
1. If there are no compatibility issues found, the readiness is marked as **Ready** for the target deployment type.
1. If there are non-critical compatibility issues, such as degraded or unsupported features that don't block the migration to a specific target deployment type, the readiness is marked as **Ready with conditions** (hyperlinked) with **warning** details and recommended remediation guidance.
1. If there are any compatibility issues that may block the migration to a specific target deployment type, the readiness is marked as **Not ready** with **issue** details and recommended remediation guidance.
1. If the discovery is still in progress or there are any discovery issues for a web app, the readiness is marked as **Unknown** as the assessment couldn't compute the readiness for that web app.

### Security readiness
If the web app is marked as **Ready** or **Ready with conditions** for Azure App Service, it is marked as **Ready** for Microsoft Defender for App Service.


## Calculate sizing

### Azure App Service SKU

After the assessment determines the readiness based on configuration data, it determines the Azure App Service SKU that is suitable for running your apps in Azure App Service.
Premium plans are for production workloads and run on dedicated Virtual Machine instances. Each instance can support multiple applications and domains. The Isolated plans host your apps in a private, dedicated Azure environment and are ideal for apps that require secure connections with your on-premises network.

> [!NOTE]
> Currently, Azure Migrate only recommends I1, P1v2, and P1v3 SKUs. There are more SKUs available in Azure App service. [Learn more](https://azure.microsoft.com/pricing/details/app-service/windows/).

### Azure App Service Plan

In App Service, an app always runs in an [App Service plan](../app-service/overview-hosting-plans.md). An App Service plan defines a set of compute resources for a web app to run. At a high level, plan/SKU is determined as per below table.

**Isolation required** | **Reserved instance** | **App Service plan/ SKU**
--- | --- | ---
Yes  | Yes | I1
Yes  | No  | I1
No  | Yes | P1v3
No  | No | P1v2

### Azure App Service cost details

An [App Service plan](../app-service/overview-hosting-plans.md) carries a [charge](https://azure.microsoft.com/pricing/details/app-service/windows/) on the compute resources it uses. In App Service, you pay charges per App Service plans and not per web app. One or more apps can be configured to run on the same computing resources (or in the same App Service plan). Whatever apps you put into this App Service plan run on these compute resources as defined by your App Service plan.
To optimize cost, Azure Migrate assessment allocates multiple web apps to each recommended App Service plan. Number of web apps allocated to each plan instance is as per below table.

**App Service plan** | **Web apps per App Service plan**
--- | ---
I1  | 8
P1v2  | 8
P1v3  | 16

> [!NOTE]
> Your App Service plan can be scaled up and down at any time. [Learn more](../app-service/overview-hosting-plans.md#what-if-my-app-needs-more-capabilities-or-features).

### Security cost
For web apps that have been recommended to App Service plans, the security cost is calculated per App Service plan that has been recommended.


## Next steps
- [Review](best-practices-assessment.md) best practices for creating assessments.
- Learn how to run an [Azure App Service assessment](how-to-create-azure-app-service-assessment.md).