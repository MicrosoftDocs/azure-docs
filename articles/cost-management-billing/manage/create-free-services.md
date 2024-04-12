---
title: Create free services with Azure free account
description: Learn how to create services included with Azure free account. You can create these services in any region where they're available.
author: bandersmsft
ms.reviewer: amberrb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Create services included with Azure free account

During the first 30 days after you've created an Azure free account, you have $200 credit in your billing currency to use on any service, except for third-party Marketplace purchases. You can experiment with different tiers and types of Azure services using the free credit to try out Azure. If you use services or Azure resources that aren’t free during that time, charges are deducted against your credit.

If you don’t use all of your credit by the end of the first 30 days, it's lost. After the first 30 days and up to 12 months after sign-up, you can only use a limited quantity of *some services*—not all Azure services are free. If you upgrade before 30 days and have remaining credit, you can use the rest of your credit with a pay-as-you-go subscription for the remaining days. For example, if you sign up for the free account on November 1 and upgrade on November 5, you have until November 30 to use your credit in the new pay-as-you-go subscription. 

Your Azure free account includes a *specified quantity* of free services for 12 months and a set of services that are always free. Only some tiers of services are available for free within certain quantities. For example, Azure has many virtual machines intended for different needs. The free account includes access to three types of VMs for free—the B1S, B2pts v2 (ARM-based), and B2ats v2 (AMD-based) burstable VMs that are usable for up to 750 hours per month. By staying in the free account limits, you can use the free services in various configurations. For more information about the Azure free account and the products that are available for free, see [Azure free account FAQ](https://azure.microsoft.com/free/free-account-faq/).

## Create free services in the Azure portal

We recommend that use the [Free service page](https://go.microsoft.com/fwlink/?linkid=859151) in the Azure portal to create free services. Or you can sign in to the [Azure portal](https://portal.azure.com), and search for **free services**. If you create resources outside of the Free services pages, free tiers or free resource configuration options aren’t always selected by default. To avoid charges, ensure that you create resources from the Free services page. And then when you create a resource, be sure to the select the tier that's free.

:::image type="content" source="./media/create-free-services/billing-freeservices-grid.png" alt-text="Screenshot that shows free services page." lightbox="./media/create-free-services/billing-freeservices-grid.png" :::

## Services can be created in any region

As long as you are within the limits, you can create services for free in any region where services are available. For example, you get 750 hours of a B1S Windows virtual machine free each month with the Azure free account. You can create the virtual machine in any region where B-series virtual machines are available. Azure doesn't charge you unless you exceed 750 hours. For example, a customer in the U.S. can provision a B1S Windows virtual machine in West Europe and use it for 750 hours for free.

To learn about Azure service availability by region, see [Products available by region](https://azure.microsoft.com/regions/services/).

## Create multiple service instances in allowed limits

You can create multiple instances of services for free if your total usage is within the usage limit. For example, you get 750 hours of a B1S Windows virtual machine free each month with your Azure free account. Use 750 hours in any combination you want. You can create 5 B1S Windows virtual machines and use them for 150 hours each.

## Next steps

- Learn how to [Check usage of free services included with your Azure free account](check-free-service-usage.md).
- Learn how to [Avoid getting charged for your Azure free account](avoid-charges-free-account.md).
