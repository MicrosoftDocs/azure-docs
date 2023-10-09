---
title: "Azure Operator Nexus: Security concepts"
description: Security overview for Azure Operator Nexus 
author: rgendreau
ms.author: rgendreau
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 08/14/2023
ms.custom: template-concept
---

# Azure Operator Nexus security

Azure Operator Nexus is designed and built to both detect and defend against 
the latest security threats and comply with the strict requirements of government 
and industry security standards. Two cornerstones form the foundation of its 
security architecture:

* **Security by default** - Security resiliency is an inherent part of the platform with little to no configuration changes needed to use it securely.
* **Assume breach** - The underlying assumption is that any system can be compromised, and as such the goal is to minimize the impact of a security breach if one occurs. 

Azure Operator Nexus realizes the above by leveraging Microsoft cloud-native security tools that give you the ability to improve your cloud security posture while allowing you to protect your operator workloads.

## Platform-wide protection via Microsoft Defender for Cloud

[Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md) is a cloud-native application protection platform (CNAPP) that provides the security capabilities needed to harden your resources, manage your security posture, protect against cyberattacks, and streamline security management. These are some of the key features of Defender for Cloud that apply to the Azure Operator Nexus platform:

* **Vulnerability assessment for virtual machines and container registries** - Easily enable vulnerability assessment solutions to discover, manage, and resolve vulnerabilities. View, investigate, and remediate the findings directly from within Defender for Cloud.
* **Hybrid cloud security** – Get a unified view of security across all your on-premises and cloud workloads. Apply security policies and continuously assess the security of your hybrid cloud workloads to ensure compliance with security standards. Collect, search, and analyze security data from multiple sources, including firewalls and other partner solutions.
* **Threat protection alerts** - Advanced behavioral analytics and the Microsoft Intelligent Security Graph provide an edge over evolving cyberattacks. Built-in behavioral analytics and machine learning can identify attacks and zero-day exploits. Monitor networks, machines, Azure Storage and cloud services for incoming attacks and post-breach activity. Streamline investigation with interactive tools and contextual threat intelligence.
* **Compliance assessment against a variety of security standards** - Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in Azure Security Benchmark. When you enable the advanced security features, you can apply a range of other industry standards, regulatory standards, and benchmarks according to your organization’s needs. Add standards and track your compliance with them from the regulatory compliance dashboard.
* **Container security features** - Benefit from vulnerability management and real-time threat protection on your containerized environments.

There are enhanced security options that let you protect your on-premises host servers as well as the Kubernetes clusters that run your operator workloads. These options are described below.

## Bare metal machine host operating system protection via Microsoft Defender for Endpoint

Azure Operator Nexus bare-metal machines (BMMs), which host the on-premises infrastructure compute servers, are protected when you elect to enable the [Microsoft Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) solution. Microsoft Defender for Endpoint provides preventative antivirus (AV), endpoint detection and response (EDR), and vulnerability management capabilities.

You have the option to enable Microsoft Defender for Endpoint protection once you have selected and activated a [Microsoft Defender for Servers](../defender-for-cloud/tutorial-enable-servers-plan.md) plan, as Defender for Servers plan activation is a prerequisite for Microsoft Defender for Endpoint. Once enabled, the Microsoft Defender for Endpoint configuration is managed by the platform to ensure optimal security and performance, and to reduce the risk of misconfigurations.

## Kubernetes cluster workload protection via Microsoft Defender for Containers

On-premises Kubernetes clusters that run your operator workloads are protected when you elect to enable the Microsoft Defender for Containers solution. [Microsoft Defender for Containers](../defender-for-cloud/defender-for-containers-introduction.md) provides run-time threat protection for clusters and Linux nodes as well as cluster environment hardening against misconfigurations.

You have the option to enable Defender for Containers protection within Defender for Cloud by activating the Defender for Containers plan.

## Cloud security is a shared responsibility

It is important to understand that in a cloud environment, security is a [shared responsibility](../security/fundamentals/shared-responsibility.md) between you and the cloud provider. The responsibilities vary depending on the type of cloud service your workloads run on, whether it is Software as a Service (SaaS), Platform as a Service (PaaS), or Infrastructure as a Service (IaaS), as well as where the workloads are hosted – within the cloud provider’s or your own on-premises datacenters.

Azure Operator Nexus workloads run on servers in your datacenters, so you are in control of changes to your on-premises environment. Microsoft periodically makes new platform releases available that contain security and other updates. You must then decide when to apply these releases to your environment as appropriate for your organization’s business needs.
