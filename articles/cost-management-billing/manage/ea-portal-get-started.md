---
title: Get started with the Azure Enterprise portal
description: This article explains how Azure Enterprise Agreement (Azure EA) customers use the Azure Enterprise portal.
author: bandersmsft
ms.reviewer: baolcsva
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 10/28/2020
ms.author: banders
ms.custom: contperf-fy21q1
---

# Get started with the Azure Enterprise portal

This article helps direct and indirect Azure Enterprise Agreement (Azure EA) customers start to use the [Azure Enterprise portal](https://ea.azure.com). Get basic information about:

- The structure of the Azure Enterprise portal.
- Roles used in the Azure Enterprise portal.
- Subscription creation.
- Cost analysis in the Azure Enterprise portal and the Azure portal.

## Get started with EA onboarding

For an Azure EA onboarding guide, see [Azure EA Onboarding Guide (PDF)](https://ea.azure.com/api/v3Help/v2AzureEAOnboardingGuide).

View this video to watch a full Azure Enterprise portal onboarding session:

> [!VIDEO https://www.youtube.com/embed/OiZ1GdBpo-I]

## Understanding EA user roles and introduction to user hierarchy

To help manage your organization's usage and spend, Azure customers with an Enterprise Agreement (EA) can assign five distinct administrative roles:

- Enterprise Administrator
- Enterprise Administrator (read only)
- Department Administrator
- Department Administrator (read only)
- Account Owner

Each role has a varying degree of user limits and permissions. For more information, see [Organization structure and permissions by role](./understand-ea-roles.md#organization-structure-and-permissions-by-role).

## Activate your enrollment, create a subscription, and other administrative tasks

For more information regarding activating your enrollment, creating a department or subscription, adding administrators and account owners, and other administrative tasks, see [Azure EA portal administration](./ea-portal-administration.md).

If you’d like to know more about transferring an Enterprise subscription to a Pay-As-You-Go subscription, see [Azure Enterprise transfers](./ea-transfers.md).

## View usage summary and download reports

You can manage and act on your Azure EA invoice. Your invoice is a representation of your bill and should be reviewed for accuracy.

To view usage summary, download reports, and manage enrollment invoices, see [Azure Enterprise enrollment invoices](./ea-portal-enrollment-invoices.md).

## Now that you're familiar with the basics, here are some additional links to help you get onboarded

[Azure EA pricing](./ea-pricing-overview.md) provides details on how usage is calculated and goes over charges for various Azure services in the Enterprise Agreement where the calculations are more complex.

If you'd like to know about how Azure reservations for VM reserved instances can help you save money with your enterprise enrollment, see [Azure EA VM reserved instances](./ea-portal-vm-reservations.md).

For information on which REST APIs to use with your Azure enterprise enrollment and an explanation for how to resolve common issues with REST APIs, see [Azure Enterprise REST APIs](./ea-portal-rest-apis.md).

[Azure EA agreements and amendments](./ea-portal-agreements.md) describes how Azure EA agreements and amendments might affect your access, use, and payments for Azure services.

[Azure Marketplace](./ea-azure-marketplace.md) explains how EA customers and partners can view marketplace charges and enable Azure Marketplace purchases.

For explanations regarding the common tasks that a partner EA administrator accomplishes in the Azure EA portal, see [Azure EA portal administration for partners](./ea-partner-portal-administration.md).

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

You can also access usage data via the reporting API. For detailed information and sample code, see [Azure Enterprise REST APIs](./ea-portal-rest-apis.md).

### Can I set a spending quota and get alerts as I approach my limit?

You can set a spending quota at department level and the system will automatically notify you as your spending limits meet 50%, 75%, 90%, and 100% of the quota you define.

To define your spending quota, select a department and then select the edit icon. After you edit the spending limit details, select **Save**.

### I used resource groups to implement RBAC and track usage. How can I view the associated usage details?

If you use _resource groups_ and _tags_, this information is tracked at service level, and you can access it in the detailed usage download (CSV) file. See the [download usage report](https://ea.azure.com/report/downloadusage) in the Azure Enterprise portal.

You can also access usage via API. For detailed information and sample code, see [Azure Enterprise REST APIs](./ea-portal-rest-apis.md).

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