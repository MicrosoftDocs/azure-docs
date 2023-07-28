---
title: Planning multicloud security determining business needs guidance
description: Learn about determining business needs to meet business goals in multicloud environment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Determine business needs

This article is part of a series to provide guidance as you design a cloud security posture management (CSPM) and cloud workload protection platform (CWPP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Identify how Defender for Cloud’s multicloud capabilities can help your organization to meet its business goals and protect AWS/GCP resources.

## Get started

The first step in designing a multicloud security solution is to determine your business needs. Every company, even if in the same industry, has different requirements. Best practices can provide general guidance, but specific requirements are determined by your unique business needs.
As you start defining requirements, answer these questions:

- Does your company need to assess and strengthen the security configuration of its cloud resources?
- Does your company want to manage the security posture of multicloud resources from a single point (single pane of glass)?
- What boundaries do you want to put in place to ensure that your entire organization is covered, and no areas are missed?
- Does your company need to comply with industry and regulatory standards? If so, which standards?
- What are your goals for protecting critical workloads, including containers and servers, against malicious attacks?
- Do you need a solution only in a specific cloud environment, or a cross-cloud solution?
- How will the company respond to alerts and recommendations, and remediate non-compliant resources?
- Will workload owners be expected to remediate issues?

## Mapping Defender for Cloud to business requirements

Defender for Cloud provides a single management point for protecting Azure, on-premises, and multicloud resources. Defender for Cloud can meet your business requirements by:

- Securing and protecting your GCP, AWS, and Azure environments.
- Assessing and strengthening the security configuration of your cloud workloads.
- Managing compliance against critical industry and regulatory standards.
- Providing vulnerability management solutions for servers and containers.
- Protecting critical workloads, including containers, servers, and databases, against malicious attacks.

The diagram below shows the Defender for Cloud architecture. Defender for Cloud can:

- Provide unified visibility and recommendations across multicloud environments. There’s no need to switch between different portals to see the status of your resources.
- Compare your resource configuration against industry standards, regulations, and benchmarks. [Learn more](./update-regulatory-compliance-packages.md) about standards.
- Help security analysts to triage alerts based on threats/suspicious activities. Workload protection capabilities can be applied to critical workloads for threat detection and advanced defenses.

:::image type="content" source="media/planning-multicloud-security/architecture.png" alt-text="Diagram that shows multicloud architecture." lightbox="media/planning-multicloud-security/architecture.png":::

## Next steps

In this article, you've learned how to determine your business needs when designing a multicloud security solution. Continue with the next step to [determine an adoption strategy](plan-multicloud-security-define-adoption-strategy.md).