---
title: Azure Security Benchmark overview
description: Security Benchmark overview
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-baselines

---

# Overview of Azure Security Baselines

Azure Security Baselines help you strengthen the security of our products through improved tooling, tracking, and security features and provide you a consistent experience when securing your environment.

Azure Service Security Baselines focus on cloud-centric control areas. These controls are consistent with well-known security benchmarks, such as those described by the Center for Internet Security (CIS). Our baselines provide guidance for the control areas listed in the [Azure Security Benchmark](overview.md).

Each recommendation includes the following information:
- **Azure ID**: The Azure Security Benchmark ID that corresponds to the recommendation.
- **Recommendation**: Following directly after the Azure ID, the recommendation provides a high-level description of the control.
- **Guidance**: The rationale for the recommendation and links to guidance on how to implement it. If the recommendation is supported by Azure Security Center, that information will also be listed.
- **Responsibility**: Who is responsible for implementing the control. Possible scenarios are customer responsibility, Microsoft responsibility, or shared responsibility.
- **Azure Security Center monitoring**: Whether the control is monitored by Azure Security Center, with link to reference.

All recommendations, including recommendations that are not applicable to this specific service, are included in the baseline to provide you a complete picture of how the Azure Security Benchmark relates to each service. There may occasionally be controls that are not applicable for various reasons—for example, IaaS/compute-centric controls (such as controls specific to OS configuration management) may not be applicable to PaaS services.
