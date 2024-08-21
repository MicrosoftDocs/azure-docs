---
title: Red Hat Enterprise Linux Extended Life Cycle Support
description: Learn about adding Red Hat Enterprise Extended Life Cycle Support Add-on
author: arukum
ms.service: azure-virtual-machines
ms.subservice: redhat
ms.custom: linux-related-content, references_regions
ms.collection: linux
ms.topic: article
ms.date: 06/12/2024
ms.author: arukum

---

# Red Hat Enterprise Linux (RHEL) Extended Life Cycle Support

**Applies to:** :heavy_check_mark: Linux VMs

This article provides information on Extended Life Cycle Support for the Red Hat Enterprise images:
* General Extended Update Support policy
* Red Hat Enterprise Linux 6
* Red Hat Enterprise Linux 7 

## Red Hat Enterprise Linux Extended Update Support

Microsoft Azure follows the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata/#:~:text=Red%20Hat%20Enterprise%20Linux%20Version%208%20and%209,Support%20Phases%20followed%20by%20an%20Extended%20Life%20Phase.). If you have a valid Extended Update Support agreement from Red Hat or a Red Hat Partner you continue to receive support on Azure, including our integrated customer support  (subject to our [support terms](/troubleshoot/azure/cloud-services/support-linux-open-source-technology)).

## Red Hat Enterprise Linux 6 Life Cycle
Red Hat Enterprise Linux 6 will reach permanent end of maintenance (including extended support) on June 30, 2024. Upgrading to Red Hat Enterprise Linux 7 with Extended Life Cycle Support (ELS), 8 or 9. Check [FAQ: Red Hat Enterprise Linux 6 reaches End of Maintenance Phase and transitions to Extended Life Phase](https://access.redhat.com/articles/4665701) for more details on RHEL6 ELS.

## Red Hat Enterprise Linux 7 Life Cycle
Starting June 30, 2024, Red Hat Enterprise Linux 7 will reach the end of maintenance support 2 phase. The maintenance phase is followed by the Extended Life Phase. As Red Hat Enterprise Linux 7 transitions out of the Full/Maintenance Phases, upgrading to Red Hat Enterprise Linux 8 or 9. If customers must stay on Red Hat Enterprise Linux 7, it's recommended to add the Red Hat Enterprise Linux Extended Life Cycle Support (ELS) Add-On.

## Steps to add Extended Life Cycle Support (ELS) through Azure Marketplace
1. "ELS" can be purchased thru the following Azure Marketplace offers: 
    - For customers outside of EMEA Regions - [Red Hat Enterprise Linux 7 Extended Life Cycle Support (ELS) by Red Hat Inc](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rh-rhel-els-7?tab=Overview) 
    - For customers in EMEA Regions - [Red Hat Enterprise Linux 7 Extended Life Cycle Support (ELS) by Red Hat Limited](https://azuremarketplace.microsoft.com/marketplace/apps/redhat-limited.rh-rhel-els-7?tab=Overview) 
1. "After" purchasing the SaaS offer from Marketplace, implement the steps outlined in [Enabling Red Hat Enterprise Linux 7 Extended Life-cycle Support via Cloud Marketplaces](https://access.redhat.com/articles/rhel-7-els-on-cloud) to configure the ELS add-on repos in Azure RHEL Virtual Machine.

> [!Note]
> In Japan ELS is available thru the Azure Marketplace via private offer. Please contact Red Hat support directly to request the private offer, alternatively open a support ticket through Microsoft support.
>
> For other countries where this SaaS offer is not available, please contact Red Hat for options to purchase ELS [Contact Red Hat](https://www.redhat.com/en/contact) 

## Frequently Asked Questions
> [FAQ: Red Hat Enterprise Linux 7 reaches End of Maintenance Phase and transitions to Extended Life Phase](https://access.redhat.com/articles/7005471)

#### In what regions/countries is the SaaS offer available as of June 2024*?
| Red Hat Inc. (Global)  | Red Hat Limited (EMEA)  |
  | ---------------------- | ----------------------- |
  | Australia<br>Brazil<br>Canada<br>Hong Kong SAR<br>India<br>Korea<br>Malaysia<br>New Zealand<br>Puerto Rico<br>Singapore<br>United States | Armenia<br>Austria<br>Belgium<br>Bulgaria<br>Croatia<br>Cyprus<br>Czechia<br>Denmark<br>Estonia<br>Finland<br>France<br>Germany<br>Greece<br>Hungary<br>Iceland<br>Ireland<br>Italy<br>Kenya<br>Latvia<br>Liechtenstein<br>Lithuania<br>Luxembourg<br>Malta<br>Monaco<br>Netherlands<br>Nigeria<br>Norway<br>Poland<br>Portugal<br>Romania<br>Saudi Arabia<br>Serbia<br>Slovakia<br>Slovenia<br>South Africa<br>Spain<br>Sweden<br>Switzerland<br>Türkiye<br>United Arab Emirates<br>United Kingdom

#### Can I purchase Reserved Instance for this offer? 
RIs (Reserved Instances) are not available.

#### What if I don’t have a Red Hat account?
An account is linked and created if necessary, during the purchasing and provisioning process. 

#### I am running Red Hat Enterprise Linux 7 and can’t migrate to a later version now. What options do I have?
Continue to run Red Hat Enterprise Linux 7 and purchase the Extended Life Cycle Support (ELS) Add-On to continue to receive limited software maintenance and technical support. Migrate to Red Hat Enterprise Linux 8 or 9 as soon as you can.

#### Where is the ELS content pulled from
Content comes from the Red Hat CDN.

#### Is the offer available through Cloud Service Provider(CSP)?
Select CSPs may be enabled for this offer per request / validation of Red Hat partner program membership. CSP customers can purchase ELS directly from Red Hat as well. Contact Red Hat directly.[Contact Red Hat](https://www.redhat.com/en/contact) 

#### Is the RHEL 7 ELS offer available in GovCloud?
SaaS offers are not available in GovCloud. Contact Red Hat directly [Contact Red Hat](https://www.redhat.com/en/contact). 

#### Is this offer Microsoft Azure Consumption Commitment (MACC) eligible?
Yes.

#### Can I use this offer for any RHEL offer / image deployed in marketplace? (For example, custom image, CIS image, subscription through reseller, etc.) 
Yes.

#### What about RHEL 7 systems without ELS. Will they stop functioning? 
They continue to run but will no longer receive security updates and support, leaving customers at risk. Azure customer support will still assist customers with Azure specific issues but may not be able to assist customers further or refer them to Red Hat without active ELS add-on.
[FAQ: Red Hat Enterprise Linux 7 reaches End of Maintenance Phase and transitions to Extended Life Phase - Red Hat Customer Portal] (https://access.redhat.com/articles/7005471)

#### Why is the SaaS offer asking for Resource Group (RG) information when purchasing? 
Azure provides four levels of management: management groups, subscriptions, resource groups, and resources. Resource Groups are used to organize your Azure resources more effectively. If you are applying the RHEL 7 ELS offer to VMs within a Resource Group, Azure prompts you for the name of the Resource Group. The offer is applied to each of the RHEL 7 ELS VMs within it.

## Next steps

* To view the full list of RHEL images in Azure, see [Red Hat Enterprise Linux (RHEL) images available in Azure](./redhat-imagelist.md).
* To learn more about the Azure Red Hat Update Infrastructure, see [Red Hat Update Infrastructure for on-demand RHEL VMs in Azure](./redhat-rhui.md).
* To learn more about the RHEL BYOS offer, see [Red Hat Enterprise Linux bring-your-own-subscription Gold Images in Azure](./byos.md).
* For information on Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata).


