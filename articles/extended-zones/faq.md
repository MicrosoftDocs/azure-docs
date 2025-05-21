---
title: Azure Extended Zones FAQ
description: This article provides answers to some of the frequently asked questions asked about Azure Extended Zones. 
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: concept-article
ms.date: 11/19/2024
---

# Azure Extended Zones frequently asked questions (FAQ)

This article provides answers to some of the frequently asked questions about Azure Extended Zones.

## How can I access Azure Extended Zones?

See [Request access to Azure Extended Zones](request-access.md) to learn how to request access to Extended Zones.

## What are the available Azure Extended Zones?

See [Request access to Azure Extended Zones](request-access.md) to learn how to request access to Extended Zones. A comprehensive list of Extended Zones will be listed in the process.

## Where is customer data stored and processed when deploying to an Azure Extended Zone?

An Azure Extended Zone might be associated with a parent region in the same or a different country/region. Customer Data will be stored and processed in the Extended Zone location, which may be outside of the associated geography and parent region. For Extended Zones with parent regions in the same country/region, customer Data will remain within the associated geography.

## Are all Azure services offered at the Azure Extended Zone?

No, given the size, hardware, and targeted use cases for the Azure Extended Zone, only a [subset of the Azure services](overview.md#service-offerings-for-azure-extended-zones) are offered at the Azure Extended Zone. Access to the complete set of Azure services is available in the parent region.

## Can I use the parent region network security groups (NSGs) or user defined routes (UDRs)?

Yes. In Azure Extended Zone, you can use network security groups and user defined routes that you created in the parent region.

## Are the Public IP addresses geo-located/tagged to the Extended Zone?

The public IP addresses use the same space as the parent Azure region but will be tagged as the Extended Zone if allocated to a resource inside it.

## How will I be charged for resources I create in an Azure Extended Zone?

The billing experience of Azure Extended Zones is consistent with the rest of Azure. Please reach out to your sales representative to get more detailed information on protocols and pricing.

## Are discount programs supported in Azure Extended Zones?

EA/ACD/ACO discounts will apply - agnostic to a region and specific to customer usage across Azure. 

## Are Reserved Instances and/or Cost Savings Plans supported in Azure Extended Zones?

No. Reserved Instances and Cost Savings Plans not currently supported. 

## Is there a program for partners that they can be aware of these launches and get ready as part of the launch?

There is no specific program as such, but partners can reach out to the team for early access and testing.

## Is the Extended Zone sharing the same marketplace for using third-party products?

Yes, the Extended Zone shares the same marketplace for using third-party products.


## Related content

- [What is Azure Extended Zones?](overview.md)
- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up a virtual machine](backup-virtual-machine.md)