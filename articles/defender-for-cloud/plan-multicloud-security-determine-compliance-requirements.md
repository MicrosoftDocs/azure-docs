---
title: Planning multicloud security compliance requirements guidance AWS standards GCP standards
description: Learn about determining compliance requirements in multicloud environment with Microsoft Defender for Cloud.
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 10/03/2022
---

# Determine compliance requirements

This article is part of a series to provide guidance as you design a cloud security posture management (CSPM) and cloud workload protection (CWP) solution across multicloud resources with Microsoft Defender for Cloud.

## Goal

Identify compliance requirements in your organization as you design your multicloud solution.

## Get started

Defender for Cloud continually assesses the configuration of your resources against compliance controls and best practices in the standards and benchmarks you’ve applied in your subscriptions.

- By default every subscription has the [Azure Security Benchmark](/security/benchmark/azure/introduction) assigned. This benchmark contains Microsoft Azure security and compliance best practices, based on common compliance frameworks.
- AWS standards include AWS Foundational Best Practices, CIS 1.2.0, and PCI DSS 3.2.1.

- GCP standards include GCP Default, GCP CIS 1.1.0/1.2.0, GCP ISO 27001, GCP NIST 800 53, and PCI DSS 3.2.1.
- By default, every subscription that contains the AWS connector has the AWS Foundational Security Best Practices assigned.
- Every subscription with the GCP connector has the GCP Default benchmark assigned.
- For AWS and GCP, the compliance monitoring freshness interval is 4 hours.

After you enable enhanced security features, you can add other compliance standards to the dashboard. Regulatory compliance is available when you enable at least one Defender plan on the subscription in which the multicloud connector is located, or on the connector.

Additionally, you can also create your own custom standards and assessments for [AWS](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/custom-assessments-and-standards-in-microsoft-defender-for-cloud/ba-p/3066575) and [GCP](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/custom-assessments-and-standards-in-microsoft-defender-for-cloud/ba-p/3251252) to align to your organizational requirements.

## Next steps

In this article, you've learned how to determine your compliance requirements when designing a multicloud security solution. Continue with the next step to [determine ownership requirements](plan-multicloud-security-determine-ownership-requirements.md).
