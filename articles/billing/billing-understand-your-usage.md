---
title: Understand your Azure detailed usage | Microsoft Docs
description: Learn how to read and understand the sections of your detailed usage CSV for your Azure subscription
services: ''
documentationcenter: ''
author: tonguyen10
manager: tonguyen
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/31/2017
ms.author: cwatson

---
# Understand terms on your Microsoft Azure detailed usage charges 

The detailed usage charges CSV file contains daily and meter level usage charges for the current billing period. 

To get your detailed usage file,
see [How to get your Azure billing invoice and daily usage
data](billing-download-azure-invoice-daily-usage-date.md).
It’s available in a comma-separated values (.csv) file format that you
can open in a spreadsheet application. If you see two versions
available, download version 2. That's the most current file format.

Usage charges are the total **monthly** charges on a subscription. The
usage charges don’t take into account any credits or discounts.

>[!VIDEO https://www.youtube.com/embed/p13S350M2Vk]

## Detailed terms and descriptions of your detailed usage file

The following sections describe the important terms shown in version 2
of the detailed usage file.

### Statement

The top section of the detailed usage CSV file shows the services that
you used during the month's billing period. The following table lists
the terms and descriptions shown in this section.

| Term | Description |
| --- | --- |
|Billing Period |The billing period when the meters were used |
|Meter Category |Identifies the top-level service for the usage |
|Meter Sub-Category |Defines the type of Azure service that can affect the rate |
|Meter Name |Identifies the unit of measure for the meter being consumed |
|Meter Region |Identifies the location of the datacenter for certain services that are priced based on datacenter location |
|SKU |Identifies the unique system identifier for each Azure meter |
|Unit |Identifies the Unit that the service is charged in. For example, GB, hours, 10,000 s. |
|Consumed Quantity |The amount of the meter used during the billing period |
|Included Quantity |The amount of the meter that is included at no charge in your current billing period |
|Overage Quantity |Shows the difference between the Consumed Quantity and the Included Quantity. You're billed for this amount. For Pay-As-You-Go offers with no Included Quantity with the offer, this total is the same as the Consumed Quantity. |
|Within Commitment |Shows the meter charges that are subtracted from your commitment amount associated with your 6 or 12-month offer. Meter charges are subtracted in chronological order. |
|Currency |The currency used in your current billing period |
|Overage |Shows the meter charges that exceed your commitment amount associated with your 6 or 12-month offer |
|Commitment Rate |Shows the commitment rate based on the total commitment amount associated with your 6 or 12-month offer |
|Rate |The rate you're charged per billable unit |
|Value |Shows the result of multiplying the Overage Quantity column by the Rate column. If the Consumed Quantity doesn't exceed the Included Quantity, there is no charge in this column. |

### Daily usage

The Daily usage section of the CSV file shows usage details that affect
the billing rates. The following table lists the terms and descriptions
shown in this section.

| Term | Description |
| --- | --- |
|Usage Date |The date when the meter was used |
|Meter Category |Identifies the top-level service for which this usage belongs |
|Meter ID |The billed meter identifier that's used to price billing usage |
|Meter Sub-Category |Defines the Azure service type that can affect the rate |
|Meter Name |Identifies the unit of measure for the meter being consumed |
|Meter Region |Identifies the location of the datacenter for certain services that are priced based on datacenter location |
|Unit |Identifies the unit that the meter is charged in. For example, GB, hours, 10,000 s. |
|Consumed Quantity |The amount of the meter that has been consumed for that day |
|Resource Location |Identifies the datacenter where the meter is running |
|Consumed Service |The Azure platform service that you used |
|Resource Group |The resource group in which the deployed meter is running in. <br/><br/>For more information, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview). |
|Instance ID | The identifier for the meter. <br/><br/> The identifier contains the name you specify for the meter when it was created. It's either the name of the resource or the fully qualified Resource ID. For more information, see [Azure Resource Manager API](https://docs.microsoft.com/rest/api/resources/resources). |
|Tags | Tag you assign to the meter. Use tags to group billing records.<br/><br/>For example, you can use tags to distribute costs by the department that uses the meter. Services that support emitting tags are virtual machines, storage, and networking services provisioned by using the [Azure Resource Manager API](https://docs.microsoft.com/rest/api/resources/resources). For more information, see [Organize your Azure resources with tags](http://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/). |
|Additional Info |Service-specific metadata. For example, an image type for a virtual machine. |
|Service Info 1 |The project name that the service belongs to on your subscription |
|Service Info 2 |Legacy field that captures optional service-specific metadata |

## How do I make sure that the charges in my detailed usage file are correct?
If there is a charge on your detailed usage file that you would like
more details on, see [Understand your bill for Microsoft Azure.](./billing-understand-your-bill.md)

## <a name="external"></a>What about external service charges?
External services (also known as Marketplace orders) are provided by independent service vendors and are billed separately. The charges don't show up on the Azure invoice. To learn more, see [Understand your Azure external service charges](billing-understand-your-azure-marketplace-charges.md).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?) to
get your issue resolved quickly.
