---
title: What's CloudKnox Permissions Management?
description: An introduction to CloudKnox Permissions Management.
services: active-directory
author: kenwith
manager: rkarlin
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: overview
ms.date: 04/20/2022
ms.author: kenwith
---

# What's CloudKnox Permissions Management?


> [!IMPORTANT]
> CloudKnox Permissions Management (CloudKnox) is currently in PREVIEW.
> Some information relates to a prerelease product that may be substantially modified before it's released. Microsoft makes no warranties, express or implied, with respect to the information provided here.

> [!NOTE] 
> The CloudKnox Permissions Management (CloudKnox) PREVIEW is currently not available for tenants hosted in the European Union (EU).

## Overview

CloudKnox Permissions Management (CloudKnox) is a cloud infrastructure entitlement management (CIEM) solution that provides comprehensive visibility into permissions assigned to all identities. For example, over-privileged workload and user identities, actions, and resources across multi-cloud infrastructures in Microsoft Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP). 

CloudKnox  detects, automatically right-sizes, and continuously monitors unused and excessive permissions. 

Organizations have to consider permissions management as a central piece of their Zero Trust security to implement least privilege access across their entire infrastructure: 

- Organizations are increasingly adopting multi-cloud strategy and are struggling with the lack of visibility and the increasing complexity of managing access permissions.
- With the proliferation of identities and cloud services, the number of high-risk cloud permissions is exploding, expanding the attack surface for organizations.
- IT security teams are under increased pressure to ensure access to their expanding cloud estate is secure and compliant.
- The inconsistency of cloud providers’ native access management models makes it even more complex for Security and Identity to manage permissions and enforce least privilege access policies across their entire environment.

:::image type="content" source="media/cloudknox-overview/cloudknox-key-cases.png" alt-text="CloudKnox Permissions Management.":::

## Key use cases
 
CloudKnox  allows customers to address three key use cases: *discover*, *remediate*, and *monitor*.

### Discover

Customers can assess permission risks by evaluating the gap between permissions granted and permissions used.

- Cross-cloud permissions discovery: Granular and normalized metrics for key cloud platforms: AWS, Azure, and GCP.
- Permission Creep Index (PCI): An aggregated metric that periodically evaluates the level of risk associated with the number of unused or excessive permissions across your identities and resources. It measures how much damage identities can cause based on the permissions they have. 
- Permission usage analytics: Multi-dimensional view of permissions risk for all identities, actions, and resources.

### Remediate

Customers can right-size permissions based on usage, grant new permissions on-demand, and automate just-in-time access for cloud resources.

- Automated deletion of permissions unused for the past 90 days.
- Permissions on-demand: Grant identities permissions on-demand for a time-limited period or an as-needed basis.


### Monitor

Customers can detect anomalous activities with machine language-powered (ML-powered) alerts and generate detailed forensic reports.

- ML-powered anomaly detections.
- Context-rich forensic reports around identities, actions, and resources to support rapid investigation and remediation.

CloudKnox  deepens Zero Trust security strategies by augmenting the least privilege access principle, allowing customers to: 

- Get comprehensive visibility: Discover which identity is doing what, where, and when. 
- Automate least privilege access: Use access analytics to ensure identities have the right permissions, at the right time. 
- Unify access policies across infrastructure as a service (IaaS) platforms: Implement consistent security policies across your cloud infrastructure. 



## Next steps

- For information on how to onboard CloudKnox in your organization, see [Enable CloudKnox in your organization](cloudknox-onboard-enable-tenant.md).
- For a list of frequently asked questions (FAQs) about CloudKnox, see [FAQs](cloudknox-faqs.md).