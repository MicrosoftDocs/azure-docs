<properties
   pageTitle="Overview of how to Create and deploy an offer to the Marketplace | Microsoft Azure"
   description="Understand the steps required to become an approved Microsoft seller and create and deploy a virtual machine image, template, data service or developer service in the Azure Marketplace"
   services="marketplace-publishing"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/02/2015"
   ms.author="hascipio" />

# How to publish an offer to the Microsoft Azure Marketplace
This article is provided to help a seller create and deploy his/her solution e.g. single virtual machine image, solution template, developer service, or data service to the Azure Marketplace for other Azure customers and partners to purchase and utilize.

The first thing you would want to do as a publisher is to define what kind of solution your company is offering. Azure Marketplace supports multiple different types of solutions and each of them require a slightly different set of work from you in order to successfully publish into the Marketplace.

**Types of solutions:**
1. Data Services
2. Developer Services
3. Virtual Machines
4. Solution Templates

Some steps are shared between the different types of solutions. This provides a short overview of what steps you will need to complete for any type of solution.

<!--
Insert table/matrix of artifacts x (portals, identities, business)
-->

**Before you begin any work on the Azure Marketplace, you must be pre-approved. Not applicable for data service publishers.**

||Virtual Machine Image |Developer Service | Data Service | Solution Template |
|----|----|----|----|----|
| **Get Pre-Approval** | [Microsoft Azure Certified][link-certification] | [Microsoft Azure Certified][link-certification] | n/a | [Microsoft Azure Certified][link-certification] |
| **Step 1. Register Seller Account** | [Microsoft Seller Account Creation & Registration][link-accts] | [Microsoft Seller Account Creation & Registration][link-accts] | [Microsoft Seller Account Creation & Registration][link-accts] | [Microsoft Seller Account Creation & Registration][link-accts] |
|**Step 2. Create your offer**| [General Non-technical Pre-requisites](marketplace-publishing-pre-requisites.md)| [General Non-Technical Pre-requisites](marketplace-publishing-pre-requisites.md)| [General Non-technical Pre-requisites](marketplace-publishing-pre-requisites.md)| [General Non-technical Pre-requisites](marketplace-publishing-pre-requisites.md)|
|| [VM Technical Pre-requisites][link-single-vm-prereq] | Developer Service Technical Pre-requisites | Data Service Technical Pre-requisites | [Template Technical Pre-requisites][link-multi-vm-prereq] |
||[VM Image Publishing Guide][link-single-vm] | Developer Service Publishing Guide | Data Service Publishing Guide | [Solution Template Publishing Guide][link-multi-vm] |
|| [Azure Marketplace Marketing Content Guide][link-pushstaging] | [Azure Marketplace Marketing Content Guide][link-pushstaging] | [Azure Marketplace Marketing Content Guide][link-pushstaging] | [Azure Marketplace Marketing Content Guide][link-pushstaging] |
| **Step 3. Push your offer to Staging** | [Test your VM offer in Staging](marketplace-publishing-vm-image-test-in-staging.md) | Test your Developer Service offer in Staging | Test your Data Service offer in Staging | Test your Solution Template in Staging |
| **Step 4. Deploy your offer to Marketplace** | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] | [Deploy your offer to the Marketplace][link-pushprod] |

## Support
- [Get Support as a Publisher][suppt-general]
- [Understanding Seller Insights reporting][suppt-rpt-insights]
- [Understanding Payout reporting][suppt-rpt-payouts]
- [Troubleshooting Common Publishing Problems in the Marketplace][suppt-common]

## Additional Resources
**Virtual Machines**
- Setting up Azure PowerShell
- VM Single Image instructions for developing on-premises


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
