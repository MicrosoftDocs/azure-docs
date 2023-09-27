---
title: Red Hat Enterprise Linux Extended Lifecycle Support 
description: Learn about adding Red Hat Enterprise Extended Lifecycle support add on
author: mathapli
ms.service: virtual-machines
ms.subservice: redhat
ms.custom: devx-track-linux
ms.collection: linux
ms.topic: article
ms.date: 04/16/2020
ms.author: mathapli
---

# Red Hat Enterprise Linux (RHEL) Extended Lifecycle Support

**Applies to:** :heavy_check_mark: Linux VMs 

This article provides information on Extended Lifecycle Support for the Red Hat Enterprise images:
* General Extended Update Support policy
* Red Hat Enterprise Linux 6 

## Red Hat Enterprise Linux Extended Update Support

Microsoft Azure follows the [Red Hat Enterprise Linux Lifecycle](https://access.redhat.com/support/policy/updates/errata/#:~:text=Red%20Hat%20Enterprise%20Linux%20Version%208%20and%209,Support%20Phases%20followed%20by%20an%20Extended%20Life%20Phase.). If you have valid Extend Update Support agreement from Red Hat or a Red Hat Partner you will continue to receive support on Azure, including our integrated customer support (subject to our [support terms](/troubleshoot/azure/cloud-services/support-linux-open-source-technology)).

For Red Hat Enterprise 6 you also have the option to purchase Extended Update Support directly from Microsoft (see below).

## Red Hat Enterprise Linux 6 Lifecycle
Starting on 30 November 2020, Red Hat Enterprise Linux 6 will reach end of maintenance phase. The maintenance phase is followed by the Extended Life Phase. As Red Hat Enterprise Linux 6 transitions out of the Full/Maintenance Phases, it's strongly recommended upgrading to Red Hat Enterprise Linux 7, 8 or 9. If customers must stay on Red Hat Enterprise Linux 6, it's recommended to add the Red Hat Enterprise Linux Extended Life Cycle Support (ELS) Add-On.

## Steps to add Extended Lifecycle Support on Marketplace Pay-As-You-Go VMs
1. Fill the [ELS form available here](https://aka.ms/els-form) with your contact details and subscription information of VMs you want to add ELS support for. The add-on pricing  details are available in the form as well.
1. Azure Red Hat Enterprise Linux team will reach out to you with list of VMs for ELS support add-on within 1-2 business days. Please review the list and respond agreeing to the add-on pricing.
1. Azure Red Hat Enterprise Linux team will share the steps to add the ELS client package to the VMs. Follow the steps, which will be provided in the email, to continue to receive software maintenance (bug and security fixes) and  support for Red Hat Enterprise Linux 6.

> [!Note]
> Do not share the steps for using RHEL ELS add-on with anyone outside your organization. Reach out to AzureRedHatELS@microsoft.com to get support or for any additional questions.

## Frequently Asked Questions

#### I'm running Red Hat Enterprise Linux 6 and can’t migrate to a later version at this time. What options do I have?
* Continue to run Red Hat Enterprise Linux 6 and purchase the Extended Life Cycle Support (ELS) Add-On repositories to continue to receive limited software maintenance and technical support (See process to upgrade and pricing details below).
* Migrate to Red Hat Enterprise Linux 7, 8 or 9 as soon as you can.

#### What is the additional charge for using Red Hat Enterprise Linux Extended Life Cycle Support (ELS) Add-On?
The costs related to Extended Lifecycle support can be found with the [ELS form](https://aka.ms/els-form)

#### I've deployed a VM by using custom image. How can I add Extended Lifecycle support to this VM?
You need to contact Red Hat directly and get support directly from them.

#### I've deployed a VM by using custom image. Can I convert this VM to a PAYG VM?
No, you can't. The conversion isn't supported on Azure currently.


## Next steps

* To view the full list of RHEL images in Azure, see [Red Hat Enterprise Linux (RHEL) images available in Azure](./redhat-imagelist.md).
* To learn more about the Azure Red Hat Update Infrastructure, see [Red Hat Update Infrastructure for on-demand RHEL VMs in Azure](./redhat-rhui.md).
* To learn more about the RHEL BYOS offer, see [Red Hat Enterprise Linux bring-your-own-subscription Gold Images in Azure](./byos.md).
* For information on Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata).


