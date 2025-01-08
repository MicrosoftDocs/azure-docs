---
title: Supportability and retirement policy guide for Azure Guest OS | Microsoft Docs
description: Provides information about what Microsoft supports regarding the Azure Guest OS used by Cloud Services.
services: cloud-services
ms.subservice: guest-os-patching
author: raiye
manager: timlt
ms.assetid: 919dd781-4dc6-4e50-bda8-9632966c5458
ms.service: azure-cloud-services-classic
ms.topic: article
ms.date: 07/23/2024
ms.author: raiye
ms.custom: compute-evergreen
---
# Azure Guest OS supportability and retirement policy
The information on this page relates to the Azure Guest operating system ([Guest OS](cloud-services-guestos-update-matrix.md)) for Cloud Services worker and web roles (PaaS). It doesn't apply to Virtual Machines (IaaS).

Microsoft has a published [support policy for the Guest OS](https://support.microsoft.com/gp/azure-cloud-lifecycle-faq). This page describes how the policy is implemented.

The policy is:

* Microsoft supports **at least the latest two families of the Guest OS**. When a family is retired, customers have 12 months from the official retirement date to update to a newer supported Guest OS family.
* Microsoft supports **at least the latest two versions of the supported Guest OS families**.
* Microsoft supports **at least the latest two versions of the Azure SDK**. When a version of the SDK is retired, customers have 12 months from the official retirement date to update to a newer version.

At times, more than two families or releases may be supported. Official Guest OS support information appears on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

## When a Guest OS version is retired
New Guest OS **versions** are introduced about every month to incorporate the latest Microsoft Security Response Center (MSRC) updates. Because of the regular monthly updates, a Guest OS version is normally disabled around 60 days after its release. This activity keeps at least two Guest OS versions for each family available for use.

### Process during a Guest OS family retirement
Once the retirement is announced, customers have a 12 month "transition" period before the older family is officially removed from service. This transition time may be extended at the discretion of Microsoft. Microsoft posts updates on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

A gradual retirement process begins six (6) months into the transition period. During this time:

* Microsoft notifies customers of the retirement.
* The newer version of the Azure SDK doesn't support the retired Guest OS family.
* New deployments and redeployments of Cloud Services are prohibited on the retired family

Microsoft continues to introduce new Guest OS version incorporating the latest MSRC updates until the last day of the transition period, known as the "expiration date." On the expiration date, cloud services still running are unsupported under the Azure Service Level Agreement (SLA). Microsoft has the discretion to force upgrade, delete or stop those services after that date.

### Process during a Guest OS Version retirement
If customers set their Guest OS to automatically update, they never have to worry about dealing with Guest OS versions. They're always using the latest Guest OS version.

Guest OS Versions are released every month. Because of the rate of regular releases, each version has a fixed lifespan.

At 60 days into the lifespan, a version is "*disabled*." "Disabled" means that the version is removed from the portal. The version can no longer be set from the CSCFG configuration file. Existing deployments are left running, but new deployments and code and configuration updates to existing deployments are prohibited.

Sometime after the Guest OS version becomes "disabled," it "expires," and any installations still running that expired version are exposed to security and vulnerability issues. Generally, expiration is done in batches, so the period from disablement to expiration can vary.

Customers who configure their services to update the Guest OS manually, should ensure that their services are running on a supported Guest OS. If a service is configured to update the Guest OS automatically, the underlying platform ensures compliance and upgrades to the latest Guest OS.

These periods may be made longer at Microsoft's discretion to ease customer transitions. Microsoft communicates any changes on the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).

### Notifications during retirement
* **Family retirement** <br>Microsoft uses blog posts and portal notification. Microsoft informs customers who are still using a retired Guest OS family through direct communication (email, portal messages, phone call) to assigned service administrators. Microsoft posts all changes to the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md).
* **Version Retirement** <br>Microsoft posts all changes and the dates they occur to the [Azure Guest OS Releases and SDK Compatibility Matrix](cloud-services-guestos-update-matrix.md), including release, disabled, and expiration. Services admins receive emails if they have deployments running on a disabled Guest OS version or family. The timing of these emails can vary. Generally they are at least a month before disablement, though this timing isn't an official SLA.

## Frequently asked questions
**How can I mitigate the impacts of migration?**

We recommend that you use latest Guest OS family for designing your Cloud Services.

* Start planning your migration to a newer family early.
* Set up temporary test deployments to test your Cloud Service running on the new family.
* Set your Guest OS version to **Automatic** (osVersion=* in the [.cscfg](cloud-services-model-and-package.md#cscfg) file) so the migration to new Guest OS versions occurs automatically.

**What if my web application requires deeper integration with the OS?**

If your web application architecture depends on underlying features of the operating system, use platform supported capabilities such as [startup tasks](cloud-services-startup-tasks.md) or other extensibility mechanisms. Alternatively, you can also use [Azure Virtual Machines](https://azure.microsoft.com/documentation/scenarios/virtual-machines/) (IaaS – Infrastructure as a Service), where you're responsible for maintaining the underlying operating system.

## Next steps
Review the latest [Guest OS releases](cloud-services-guestos-update-matrix.md).
