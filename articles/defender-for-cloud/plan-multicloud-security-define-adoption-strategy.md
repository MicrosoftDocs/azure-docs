---
title: Planning multicloud security defining adoption strategy lifecycle strategy guidance
description: Learn about defining broad requirements for business needs and ownership in multicloud environment with Microsoft Defender for Cloud.
ms.topic: how-to
ms.custom: ignite-2022
author: dcurwin
ms.author: dacurwin
ms.date: 10/03/2022
---

# Define an adoption strategy

This article is part of a series to provide guidance as you design a cloud security posture management (CSPM) and cloud workload protection platform (CWPP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Consider your high-level business needs, the resource and process ownership model for your organization, and an iteration strategy as you continuously add resources to your solution.

## Get started

Think about your broad requirements:

- **Determine business needs**. Keep first steps simple, and then iterate to accommodate future change. Decide your goals for a successful adoption, and then the metrics you’ll use to define success.
- **Determine ownership**. Figure out where multicloud capabilities fall under your teams. Review the [determine ownership requirements](plan-multicloud-security-determine-ownership-requirements.md#determine-ownership-requirements) and [determine access control requirements](plan-multicloud-security-determine-access-control-requirements.md#determine-access-control-requirements) articles to answer these questions:

  - How will your organization use Defender for Cloud as a multicloud solution?
  - What [cloud security posture management (CSPM)](plan-multicloud-security-determine-multicloud-dependencies.md) and [cloud workload protection (CWP)](plan-multicloud-security-determine-multicloud-dependencies.md) capabilities do you want to adopt?
  - Which teams will own the different parts of Defender for Cloud?
  - What is your process for responding to security alerts and recommendations? Remember to consider Defender for Cloud’s governance feature when making decisions about recommendation processes.
  - How will security teams collaborate to prevent friction during remediation?

- **Plan a lifecycle strategy.** As new multicloud resources onboard into Defender for Cloud, you need a strategic plan in place for that onboarding. Remember that you can use [auto-provisioning](/azure/defender-for-cloud/enable-data-collection?tabs=autoprovision-defendpoint) for easier agent deployment.

## Next steps

In this article, you've learned how to determine your adoption strategy when designing a multicloud security solution. Continue with the next step to [determine data residency requirements](plan-multicloud-security-determine-data-residency-requirements.md).
