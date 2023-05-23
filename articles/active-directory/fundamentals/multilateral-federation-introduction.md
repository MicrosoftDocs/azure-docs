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

Universities face many challenges. For example, one university might use one identity management system and a set of protocols while other universities use a  different set of technologies, depending on their requirements. In general, universities can:

* Use different identity management systems

* Use different protocols

* Use customized solutions

* Require support for a long history of legacy functionality

* Need to support solutions that are built in different IT generations

Many universities are also adopting the Microsoft 365 suite of productivity and collaboration tools. These tools rely on Azure Active Directory (Azure AD) for identity management, which enables universities to configure:

* Single sign-on (SSO) across multiple applications

* Modern security controls, including passwordless authentication, MFA, adaptive conditional access, and Identity Protection

* Enhanced reporting and monitoring

Because Azure AD doesn't natively support multilateral federation, this content describes three solutions for federating authentication and access between universities with typical research university architecture. In these scenarios, non-Microsoft products are mentioned for illustrative purposes only and represent the broader class of product. For example, Shibboleth is used as an example of a federation provider.

## Next steps

See these other multilateral federation articles:

[Multilateral federation  baseline design](multilateral-federation-baseline.md)

[Multilateral federation solution one -  Azure AD with Cirrus Bridge](multilateral-federation-solution-one.md)

[Multilateral federation solution two - Azure AD to Shibboleth as SP Proxy](multilateral-federation-solution-two.md)

[Multilateral federation solution three - Azure AD with ADFS and Shibboleth](multilateral-federation-solution-three.md)

[Multilateral federation decision tree](multilateral-federation-decision-tree.md)
