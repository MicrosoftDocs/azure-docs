---
title: Resilience in identity and access management with Microsoft Entra ID
description: Learn how to build resilience into identity and access management. Resilience helps endure disruption to system components and recover with minimal effort.
services: active-directory
author: janicericketts
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: overview
ms.date: 08/26/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom:
  - it-pro
  - seodec18
  - kr2b-contr-experiment
ms.collection: M365-identity-device-management
---

# Building resilience into identity and access management with Microsoft Entra ID

Identity and access management (IAM) is a framework of processes, policies, and technologies. IAM facilitates the management of identities and what they access. It includes the many components supporting the authentication and authorization of user and other accounts in your system.

IAM resilience is the ability to endure disruption to system components and recover with minimal impact to your business, users, customers, and operations. Reducing dependencies, complexity, and single-points-of-failure, while ensuring comprehensive error handling, increases your resilience.

Disruption can come from any component of your IAM systems. To build a resilient IAM system, assume disruptions will occur and plan for them.

When planning the resilience of your IAM solution, consider the following elements:

* Your applications that rely on your IAM system
* The public infrastructures your authentication calls use, including telecom companies, Internet service providers, and public key providers
* Your cloud and on-premises identity providers
* Other services that rely on your IAM, and the APIs that connect them
* Any other on-premises components in your system

Whatever the source, recognizing and planning for the contingencies is important. However, adding other identity systems, and their resultant dependencies and complexity, may reduce your resilience rather than increase it.

To build more resilience in your systems, review the following articles:

* [Build resilience in your IAM infrastructure](resilience-in-infrastructure.md)
* [Build IAM resilience in your applications](resilience-app-development-overview.md)
* [Build resilience in your Customer Identity and Access Management (CIAM) systems](resilience-b2c.md)
