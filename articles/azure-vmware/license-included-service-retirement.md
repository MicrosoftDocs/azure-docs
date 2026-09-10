---
title: Azure VMware Solution license-included service retirement, using portable VCF and other options
ms.author: jobingeorge
description: Learn about Azure VMware Solution license-included service retirement, using portable VCF and other options.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 08/25/2026
---

# Azure VMware Solution license-included service retirement, using portable VCF and other options

>[!NOTE]
>AVS is not ending, only the SKU that includes the license is changing.

In November 2025, Broadcom changed its VMware licensing policies across all hyperscaler platforms to require customers to bring your own portable license for VMware Cloud Foundation (VCF). Azure VMware Solution continues to provide customers with a proven, fully managed service for running VMware workloads in Azure leveraging portable VCF licenses from Broadcom.

## What’s changing?

On 30 August 2027, as a result of the latest Broadcom VCF licensing change, the Azure VMware Solution license-included SKUs will be retired.  Customers currently using license-included Reserved Instance (RI) SKUs for their SDDC will be required to transition to an Azure VMware Solution VCF BYOL SKU prior to August 30, 2027, to avoid service disruption on 31 August 2027.

## What this means for customers

Azure VMware Solution customers that are impacted by this licensing change have a spectrum of options to transition with minimal disruption. These options involve key decisions around license portability for VCF, strategic platform choices, and future operational planning.

## Continue with Azure VMware Solution using VCF BYOL

Using Azure VMware Solution VCF BYOL is the least disruptive path as customers would purchase VCF from Broadcom. Customers can then leverage the [self-service exchange process](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations) to exchange existing Azure VMware Solution License-included RIs for Azure VMware Solution VCF BYOL RIs, then add the VCF license key to the Azure portal.

## Switch private clouds

For organizations looking for alternative Private Cloud offerings, Microsoft offers [Nutanix Cloud Clusters on Azure](/azure/nutanix), a Nutanix platform running on Azure bare-metal infrastructure.

## Modernize with other Azure services
For organizations looking to accelerate application modernization, Azure offers a variety of destinations including Azure native infrastructure, Azure Red Hat OpenShift, Azure App Services, and many other Azure services. Explore the variety of [VMware destinations in Azure](https://azure.microsoft.com/solutions/migrate-and-modernize-vmware-in-azure).

## Take action today

Allow plenty of time to purchase VCF licenses from Broadcom and complete the transition to AVS VCF BYOL. For customers evaluating modernization opportunities, start assessing current AVS environments immediately, and develop a transition roadmap to ensure you have time to evaluate all options and avoid service disruption on August 31, 2027. Reach out to your Microsoft account team so we can help you start this transition.

## Key dates and transition details

- 30 August 2027: Last day of Azure VMware Solution license-included services.
- To avoid service disruption on 31 August 2027, customers need to be fully transitioned to a new Azure VMware Solution VCF BYOL service or be fully migrated to a new Azure destination.
- Azure VMware Solution license-included RIs: Microsoft allows for the exchange of reservations with expiration dates beyond 30 August 2027.
- UPDATE AV36 SKU retirement was aligned to Broadcom’s end of support for vSphere 8 on 30 September 2027, but now it will be 30 August 2027 to align with the Azure VMware Solution license-included end of service.

>[!NOTE]
> Azure VMware Solution license-included PayGo SKUs retire on 31 October 2026.


## Related content
- [How to use portable VCF subscriptions with Azure VMware Solution](/azure/azure-vmware/vmware-cloud-foundations-license-portability)
- [Self-service exchanges and refunds for Azure Reservations](/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations)
- [Explore VMware destinations in Azure](https://azure.microsoft.com/solutions/migrate-and-modernize-vmware-in-azure)
- Leverage [Azure Migrate](https://portal.azure.com/#view/Microsoft_Azure_Migrate/AmhResourceMenuBlade/~/getStarted) to assess your current Azure VMware Solution environment.
- To purchase portable VCF subscriptions contact Broadcom or leverage one of the [Broadcom channel partners here](https://www.broadcom.com/how-to-buy/partner-distributor-lookup).
