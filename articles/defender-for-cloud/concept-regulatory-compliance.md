---
title: The Microsoft cloud security benchmark in Microsoft Defender for Cloud
description: Learn about the Microsoft cloud security benchmark in Microsoft Defender for Cloud.
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 01/10/2023
---

# Microsoft cloud security benchmark in Defender for Cloud

Industry standards, regulatory standards, and benchmarks are represented in Microsoft Defender for Cloud as [security standards](security-policy-concept.md), and are assigned to scopes such as Azure subscriptions, AWS accounts, and GCP projects.

Defender for Cloud continuously assesses your hybrid cloud environment against these standards, and provides information about compliance in the **Regulatory compliance** dashboard.

When you onboard subscriptions and accounts to Defender for Cloud, the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) (MCSB) automatically starts to assess resources in scope.

This benchmark builds on the cloud security principles defined by the Azure Security Benchmark and applies these principles with detailed technical implementation guidance for Azure, for other cloud providers (such as AWS and GCP), and for other Microsoft clouds.

:::image type="content" source="media/concept-regulatory-compliance/microsoft-security-benchmark.png" alt-text="Image that shows the components that make up the Microsoft cloud security benchmark.":::

The compliance dashboard gives you a view of your overall compliance standing. Security for non-Azure platforms follows the same cloud-neutral security principles as Azure. Each control within the benchmark provides the same granularity and scope of technical guidance across Azure and other cloud resources. 

:::image type="content" source="media/concept-regulatory-compliance/compliance-dashboard.png" alt-text="Screenshot of a sample regulatory compliance page in Defender for Cloud." lightbox="media/concept-regulatory-compliance/compliance-dashboard.png":::

From the compliance dashboard, you're able to manage all of your compliance requirements for your cloud deployments, including automatic, manual and shared responsibilities.

> [!NOTE]
> Shared responsibilities is only compatible with Azure.

## Next steps

- [Improve your regulatory compliance](regulatory-compliance-dashboard.md)
- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md)
