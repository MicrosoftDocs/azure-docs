<properties
   pageTitle="Overview of how to create and deploy an offer to the Marketplace | Microsoft Azure"
   description="Understand the steps required to become an approved Microsoft Developer and create and deploy a virtual machine image, template, data service, or developer service in the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/12/2016"
   ms.author="hascipio" />

# How to publish an offer to the Azure Marketplace
This article is provided to help a developer create and deploy a solution to the Azure Marketplace for other Azure customers and partners to purchase and utilize.

The first thing you would want to do as a publisher is to define what kind of solution your company is offering. The Azure Marketplace supports multiple solutions, and each of them requires a slightly different set of work from you in order to successfully publish into the Marketplace.

Types of solutions:

- Virtual machine image
- Developer service
- Data service
- Solution template

Some steps are shared between the different types of solutions. This article provides a short overview of what steps you will need to complete for any type of solution.

> [AZURE.NOTE] Before you begin any work on the Azure Marketplace, you must be pre-approved. This is not applicable for data service publishers.

||Virtual machine image |Developer service | Data service | Solution template |
|----|----|----|----|----|
| **Get pre-approval** | [Microsoft Azure Certified][link-certification] | [Microsoft Azure Certified][link-certification] | n/a | [Microsoft Azure Certified][link-certification] |
| **Step 1: Register your developer account** | [Microsoft Developer account: creation and registration][link-accts] | [Microsoft Developer account: creation and registration][link-accts] | [Microsoft Developer account: creation and registration][link-accts] | [Microsoft Developer account: creation and registration][link-accts] |
|**Step 2: Create your offer**| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)| [General non-technical prerequisites](marketplace-publishing-pre-requisites.md)|
|| [VM technical prerequisites][link-single-vm-prereq] | Developer service technical prerequisites | [Data service technical prerequisites](marketplace-publishing-data-service-creation-prerequisites.md) | [Solution template technical prerequisites](marketplace-publishing-solution-template-creation-prerequisites.md) |
||[VM image publishing guide][link-single-vm] | Developer service publishing guide | [Data service publishing guide](marketplace-publishing-data-service-creation.md) | [Solution template publishing guide](marketplace-publishing-solution-template-creation.md) |
|| [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] | [Azure Marketplace marketing content guide][link-pushstaging] |
| **Step 3: Push your offer to staging** | [Test your VM offer in staging](marketplace-publishing-vm-image-test-in-staging.md) | Test your developer service offer in staging | [Test your data service offer in staging](marketplace-publishing-data-service-test-in-staging.md) | [Test your solution template in staging](marketplace-publishing-solution-template-test-in-staging.md) |
| **Step 4: Deploy your offer to the Marketplace** | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] |

## Support
- [Get support as a publisher][suppt-general]
- [Understanding seller insights reporting][suppt-rpt-insights]
- [Understanding payout reporting][suppt-rpt-payouts]
- [How to change your Cloud Solution Provider reseller incentive](marketplace-publishing-csp-incentive.md)
- [Troubleshooting common publishing problems in the Marketplace][suppt-common]

## Additional resources
- To learn more about the portals used, see [Portals you will need](marketplace-publishing-portals.md).

**Virtual machines**

- [Setting up Azure PowerShell](marketplace-publishing-powershell-setup.md)
- [Creating a VM image on-premises](marketplace-publishing-vm-image-creation-on-premise.md)
- [Create a virtual machine running Windows in the Azure preview portal](../virtual-machines-windows-hero-tutorial/)

**Data Services**

- [Data Service OData Mapping](marketplace-publishing-data-service-creation-odata-mapping.md)
- [Data Service OData Mapping Nodes](marketplace-publishing-data-service-creation-odata-mapping-nodes.md)
- [Data Service OData Mapping Examples](marketplace-publishing-data-service-creation-odata-mapping-examples.md)

[suppt-general]:marketplace-publishing-get-publisher-support.md
[suppt-rpt-insights]:marketplace-publishing-report-seller-insights.md
[suppt-rpt-payouts]:marketplace-publishing-report-payout.md
[suppt-common]:marketplace-publishing-support-common-issues.md
[link-certification]:marketplace-publishing-azure-certification.md
[link-accts]:marketplace-publishing-accounts-creation-registration.md
[link-single-vm]:marketplace-publishing-vm-image-creation.md
[link-single-vm-prereq]:marketplace-publishing-vm-image-creation-prerequisites.md
[link-multi-vm]:marketplace-publishing-solution-template-creation.md
[link-multi-vm-prereq]:marketplace-publishing-solution-template-creation-prerequisites.md
[link-datasvc]:marketplace-publishing-data-service-creation.md
[link-datasvc-prereq]:marketplace-publishing-data-service-creation-prerequisites.md
[link-devsvc]:marketplace-publishing-dev-service-creation.md
[link-devsvc-prereq]:marketplace-publishing-dev-service-creation-prerequisites.md
[link-pushstaging]:marketplace-publishing-push-to-staging.md
[link-pushprod]:marketplace-publishing-push-to-production.md
