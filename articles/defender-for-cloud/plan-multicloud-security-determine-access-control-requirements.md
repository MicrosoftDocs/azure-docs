---
title: Planning multicloud security determine access control requirements guidance
description: Learn about determining access control requirements to meet business goals in multicloud environment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Determine access control requirements

This article is part of a series to provide guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Figure out what permissions and access controls you need on your multicloud deployment.

## Get started

As part of your multicloud solution design you should review access requirements for multicloud resources that will be available to users. As you plan, answer the following questions, take notes, and be clear about the reasons for the answer.

- Who should have access to recommendations and alerts for multicloud resources?
- Are your multicloud resources and environments owned by different teams? If so, does each team need the same level of access?
- Do you need to limit access to specific resources for specific users and groups? If so, how can you limit access for Azure, AWS, and GCP resources?
- Does your organization need identity and access management (IAM permissions) to be inherited to the resource group level?
- Do you need to determine any IAM requirements for people who:
  - Implement JIT attack surface reduction VMs and AWS EC2?  
  - Define Adaptive Application Controls (access defined by application owner)?
  - Security operations?

With clear answers available, you can figure out your Defender for Cloud access requirements. Other things to consider:

- Defender for Cloud multicloud capabilities support inheritance of IAM permissions.
- Whatever permissions the user has for the resource group level where the AWS/GCP connectors reside, are inherited automatically for multicloud recommendations and security alerts.

## Next steps

In this article, you've learned how to determine access control requirements needs when designing a multicloud security solution. Continue with the next step to [determine multicloud dependencies](plan-multicloud-security-determine-multicloud-dependencies.md).
