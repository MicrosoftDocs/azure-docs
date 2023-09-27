---
title: University multilateral federation solution design
description: Learn how to design a multilateral federation solution for universities.
services: active-directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 04/01/2023
ms.author: jricketts
ms.custom: "it-pro"
ms.collection: M365-identity-device-management
---

# Introduction to multilateral federation solutions

Research universities need to collaborate with one another. To accomplish collaboration, they require multilateral federation to enable authentication and access between universities globally.

## Challenges with multilateral federation solutions

Universities face many challenges. For example, a university might use one identity management system and a set of protocols. Other universities might use a different set of technologies, depending on their requirements. In general, universities can:

* Use different identity management systems.

* Use different protocols.

* Use customized solutions.

* Need support for a long history of legacy functionality.

* Need support for solutions that are built in different IT generations.

Many universities are also adopting the Microsoft 365 suite of productivity and collaboration tools. These tools rely on Microsoft Entra ID for identity management, which enables universities to configure:

* Single sign-on across multiple applications.

* Modern security controls, including passwordless authentication, multifactor authentication, adaptive Conditional Access, and identity protection.

* Enhanced reporting and monitoring.

Because Microsoft Entra ID doesn't natively support multilateral federation, this content describes three solutions for federating authentication and access between universities with a typical research university architecture. These scenarios mention non-Microsoft products for illustrative purposes only and to represent the broader class of products. For example, this content uses Shibboleth as an example of a federation provider.

## Next steps

See these related articles about multilateral federation:

[Multilateral federation baseline design](multilateral-federation-baseline.md)

[Multilateral federation Solution 1: Microsoft Entra ID with Cirrus Bridge](multilateral-federation-solution-one.md)

[Multilateral federation Solution 2: Microsoft Entra ID with Shibboleth as a SAML proxy](multilateral-federation-solution-two.md)

[Multilateral federation Solution 3: Microsoft Entra ID with AD FS and Shibboleth](multilateral-federation-solution-three.md)

[Multilateral federation decision tree](multilateral-federation-decision-tree.md)
