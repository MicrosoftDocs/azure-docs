---
title: Enterprise Agreement onboarding guide
description: Review our self-serve walkthrough for EA onboarding.
author: bandersmsft
ms.reviewer: baolcsva
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 09/23/2020
ms.author: banders
ms.custom: contperfq1
---

# Enterprise Agreement onboarding guide

This article helps direct and indirect Azure Enterprise Agreement (Azure EA) customers start to use the [Azure Enterprise portal](https://ea.azure.com).

## Get started with EA onboarding 

For an Azure EA onboarding guide, see [Azure EA Onboarding Guide (PDF)](https://ea.azure.com/api/v3Help/v2AzureEAOnboardingGuide).

View this video to watch a full Azure Enterprise portal onboarding session:

> [!VIDEO https://www.youtube.com/embed/OiZ1GdBpo-I]

## Azure EA term glossary

- **Account**: An organizational unit on the Azure Enterprise portal. It is used to administer subscriptions and for reporting.
- **Account owner**: The person who manages subscriptions and service administrators on Azure. They can view usage data on this account and its associated subscriptions.
- **Amendment subscription**: A one-year, or coterminous subscription under the enrollment amendment.
- **Prepayment**: Prepayment of an annual monetary amount for Azure services at a discounted Prepayment rate for usage against this prepayment.
- **Department administrator**: The person who manages departments, creates new accounts and account owners, views usage details for the departments they manage, and can view costs when granted permissions.
- **Enrollment number**: A unique identifier supplied by Microsoft to identify the specific enrollment associated with an Enterprise Agreement.
- **Enterprise administrator**: The person who manages departments, department owners, accounts, and account owners on Azure. They have the ability to manage enterprise administrators as well as view usage data, billed quantities, and unbilled charges across all accounts and subscriptions associated with the enterprise enrollment.
- **Enterprise agreement**: A Microsoft licensing agreement for customers with centralized purchasing who want to standardize their entire organization on Microsoft technology and maintain an information technology infrastructure on a standard of Microsoft software.
- **Enterprise agreement enrollment**: An enrollment in the Enterprise Agreement program providing Microsoft products in volume at discounted rates.
- **Microsoft account**: A web-based service that enables participating sites to authenticate a user with a single set of credentials.
- **Microsoft Azure Enterprise Enrollment Amendment (enrollment amendment)**: An amendment signed by an enterprise, which provides them access to Azure as part of their enterprise enrollment.
- **Azure Enterprise portal**: The portal used by our enterprise customers to manage their Azure accounts and their related subscriptions.
- **Resource quantity consumed**: The quantity of an individual Azure service that was used in a month.
- **Service administrator**: The person who accesses and manages subscriptions and development projects on the Azure Enterprise portal.
- **Subscription**: Represents an Azure Enterprise portal subscription and is a container of Azure services managed by the same service administrator.
- **Work or school account**: For organizations that have set up active directory with federation to the cloud and all accounts are on a single tenant.

### Enrollment statuses

- **New**: This status is assigned to an enrollment that was created within 24 hours and will be updated to a Pending status within 24 hours.
- **Pending**: The enrollment administrator needs to sign in to the Azure Enterprise portal. Once signed in, the enrollment will switch to an Active status.
- **Active**: The enrollment is Active and accounts and subscriptions can be created in the Azure Enterprise portal. The enrollment will remain active until the Enterprise Agreement end date.
- **Indefinite extended term**: An indefinite extended term takes place after the Enterprise Agreement end date has passed. It enables Azure EA customers who are opted in to the extended term to continue to use Azure services indefinitely at the end of their Enterprise Agreement.

   Before the Azure EA enrollment reaches the Enterprise Agreement end date, the enrollment administrator should decide which of the following options to take:

  - Renew the enrollment by adding additional Azure Prepayment.
  - Transfer to a new enrollment.
  - Migrate to the Microsoft Online Subscription Program (MOSP).
  - Confirm disablement of all services associated with the enrollment.
- **Expired**: The Azure EA customer is opted out of the extended term, and the Azure EA enrollment has reached the Enterprise Agreement end date. The enrollment will expire, and all associated services will be disabled.
- **Transferred**: Enrollments where all associated accounts and services have been transferred to a new enrollment appear with a transferred status.
  >[!NOTE]
  > Enrollments don't automatically transfer if a new enrollment number is generated at renewal. You must include your prior enrollment number in your renewal paperwork to facilitate an automatic transfer.

## Get started on Azure EA - FAQ

This section provides details on typical questions asked by customers during the onboarding process.  

### I accidentally associated my existing Azure account with Azure EA enrollment. As a result, I lost my monthly credit. Can I get my monthly credit back?

If you've signed in as an Azure EA account owner with the same credentials as your Visual Studio subscription, you can recover your individual Visual Studio subscription Azure benefit by performing one of the following actions:

- Delete your account owner from the Azure Enterprise portal, after removing or moving any associated Azure subscriptions. Then, sign up for individual Visual Studio Azure benefits anew.
- Delete the Visual Studio subscriber from the administration site in VLSC, and reassign the subscription to an account with different credentials this time. Then, sign up for individual Visual Studio Azure benefits anew.

### What type of subscription should I create?

The Azure Enterprise portal offers two types of subscriptions for enterprise customers:

- Microsoft Azure Enterprise, which is ideal for:
  - All production usage
  - Best prices based on infrastructure spend

  For more information, [contact Azure sales](https://azure.microsoft.com/pricing/enterprise-agreement/).

- Enterprise Dev/Test, which is ideal for:
  - All team dev/test workloads
  - Medium-to-heavy individual dev/test workloads
  - Access to special MSDN images and preferential service rates

  For more information, see [Enterprise Dev/Test offer](https://azure.microsoft.com/offers/ms-azr-0148p/).

### My subscription name is the same as the offer name. Should I change the subscription name to something meaningful to my organization?

When you create a subscription, the name defaults to the offer type you choose. We recommend that you change the subscription name to something that makes it easy for you to track the subscription.

To change the name:

1. Sign in to [https://account.windowsazure.com](https://account.windowsazure.com).
1. Select the subscription list.
1. Select the subscription you want to edit.
1. Select the **Manage Subscription** icon.
1. Edit subscription details.

### How can I track costs incurred by a cost center?

To track cost by cost center, you need to define the cost center at one of the following levels:

- Department
- Account
- Subscription

Based on your needs, you can use the same cost center to track usage and costs associated with a particular cost center.

For example, to track costs for a special project where multiple departments are involved, you might want to define the cost center at a subscription level to track the usage and costs.

You can't define a cost center at the service level. If you want to track usage at the service level, you can use the _Tag_ feature available at the service level.

### How do I track usage and spend by different departments in my organization?

You can create as many departments as you need under your Azure EA enrollment. In order to track the usage correctly, ensure that you're not sharing subscriptions across departments.

After you have created departments and subscriptions, you can see data in the usage report. This information can help you track usage and manage cost and spend at the department level.

You can also access usage data via the reporting API. For detailed information and sample code, see [Azure Enterprise REST APIs](https://docs.microsoft.com/azure/cost-management-billing/manage/ea-portal-rest-apis).

### Can I set a spending quota and get alerts as I approach my limit?

You can set a spending quota at department level and the system will automatically notify you as your spending limits meet 50%, 75%, 90%, and 100% of the quota you define.

To define your spending quota, select a department and then select the edit icon. After you edit the spending limit details, select **Save**.

### I used resource groups to implement RBAC and track usage. How can I view the associated usage details?

If you use _resource groups_ and _tags_, this information is tracked at service level, and you can access it in the detailed usage download (CSV) file. See the [download usage report](https://ea.azure.com/report/downloadusage) in the Azure Enterprise portal.

You can also access usage via API. For detailed information and sample code, see [Azure Enterprise REST APIs](https://docs.microsoft.com/azure/cost-management-billing/manage/ea-portal-rest-apis).

> [!NOTE]
> You can only apply tags to resources that support Azure Resource Manager operations. If you created a virtual machine, virtual network, or storage through the classic deployment model (such as through the classic portal), you cannot apply a tag to that resource. You must re-deploy these resources through the Resource Manager to support tagging. All other resources support tagging.

### Can I perform analyses using Power BI?

Yes. With the Microsoft Azure Enterprise content pack for Power BI, you can:

- Quickly import and analyze Azure consumption for your enterprise enrollment.
- Find out which department, account, or subscription consumed the most usage.
- Learn which service your organization used most.
- Track spending and usage trends.

To use Power BI:

1. Go to the Power BI website.
1. Sign in with a valid work or school account.

   The work or school account can be the same or different than what is used to access the enrollment through the Azure Enterprise portal.
1. On the dashboard of services, choose the Microsoft Azure Enterprise tile, and select **Connect**.
1. On the **Connect to Azure Enterprise** screen, enter:
    - Azure Environment URL: [https://ea.azure.com](https://ea.azure.com)
    - Number of Months: between 1 and 36
    - Enrollment Number: your enrollment number
1. Select **Next**.
1. Enter the API Key in the **Account Key** box.

   You can find the API key in the Azure Enterprise portal. Look under the **Download Usage** tab, and then select **API Access Key**. Copy it, and then paste the key into **Account Key** box in Power BI.

Depending on the size of the data set, it can take between five and 30 minutes for the data to load in Power BI.

Power BI reporting is available for Azure EA direct, partner, and indirect customers who are able to view billing information.

## Next steps

- Azure Enterprise portal administrators should read [Azure Enterprise portal administration](ea-portal-administration.md) to learn about common administrative tasks.
- If you need help with troubleshooting Azure Enterprise portal issues, see [Troubleshoot Azure Enterprise portal access](ea-portal-troubleshoot.md).