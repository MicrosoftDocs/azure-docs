---
title: Security Update Management for Azure Kubernetes Service
titleSuffix: Azure Kubernetes Service
description: Learn about our best practices for security updates for your Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: conceptual
ms.date: 11/21/2022
 
---

# Security Update Management for Azure Kubernetes Service (AKS)

This article describes how Microsoft manages security vulnerabilities and security updates (also refereed to as patches), for Azure Kubernetes Service (AKS) clusters.

## Responsibilities

Managing security updates is a shared responsibility between Microsoft and you, the customer. Different platforms have different shared responsibilities. See the following topics on each platform for more details:

* Blah
* Blah

## How we discover vulnerabilities

Microsoft has made large investments in proactive security design and hardening, but even the best designed software systems can have vulnerabilities. To find those vulnerabilities and update them before they can be exploited, Microsoft has made significant investments on multiple fronts.

For updating purposes, Kubernetes is an Operating System (OS) layer with containers running on top. The operating systems, Container-Optimized OS or Ubuntu, are hardened and contain the minimum amount of software required to run containers. AKS features run as containers on top of the base images.

Microsoft identifies and fixes vulnerabilities and missing security updates in the following ways:

- Container-Optimized OS: Microsoft scans images to identify potential vulnerabilities and missing updates. The AKS team reviews and resolves issues.

- Ubuntu: Canonical provides Microsoft with OS builds that have all available security updaets applied.

Microsoft scans containers using <What tool or method is used> to discover vulnerabilities and missing updates in Kubernetes and Microsoft-managed containers. If fixes are available, the scanner automatically begins the updating and release process.

In addition to automated scanning, Microsoft discovers and updates vulnerabilities unknown to scanners in the following ways.

* Microsoft performs its own audits, penetration testing, and vulnerability discovery across all AKS platforms. Specialized teams inside Microsoft and trusted third-party security vendors conduct their own attack research. Microsoft has also worked with the [Cloud Native Computing Foundation][[cloud-native-computing-foundation]] (CNCF) to provide much of the organization and technical consulting expertise for the Kubernetes security audit <Is this valid or do we need to rephrase to represent our participation or contributions to the CNCF>.

* Microsoft actively engages with the security research community through multiple vulnerability reward programs. A dedicated [Microsoft Azure Bounty program][azure-bounty-program-overview] provides significant bounties for the best cloud vulnerability found each year.

* Microsoft collaborates with other industry and open source software partners who share vulnerabilities, security research, and updates before the public release of the vulnerability. The goal of this collaboration is to update large pieces of Internet infrastructure before the vulnerability is announced to the public. In some cases, Microsoft contributes vulnerabilities found to this community <Is this acurate or should we rephrase>.

* Microsoft's security collaboration happens on many levels. Sometimes it occurs formally through programs where organizations sign up to receive pre-release notifications about software vulnerabilities for products such as Kubernetes and Docker. Collaboration also happens informally due to our engagement with many open source projects such as the Linux kernel, container runtimes, virtualization technology, and others.

* For Kubernetes, Microsoft is an active member of the [Security Response Committee][kubernetes-security-response-committee] (SRC). Microsoft is a member of the Kubernetes Distributors List that receives prior notification of vulnerabilities and has been involved in the triage, updating, mitigation development, and communication of nearly every serious Kubernetes security vulnerability.

While less severe vulnerabilities are discovered and updated outside of these processes, most critical security vulnerabilities are reported privately through one of the channels previously listed. Early reporting gives Microsoft time before the vulnerability becomes public to research how it affects AKS, develop updates or mitigation's, and prepare advice and communications for customers. When possible, Microsoft updates all clusters before the public release of the vulnerability.

## How vulnerabilities are classified

Microsoft makes large investments in security hardening the entire stack, including the OS, container, Kubernetes, and network layers, in addition to setting good defaults, security-hardened configurations, and managed components. Combined, these efforts help to reduce the impact and likelihood of vulnerabilities.

The AKS team classifies vulnerabilities according to the Kubernetes vulnerability scoring system. Classifications consider many factors including AKS configuration and security hardening. Because of these factors and the investments AKS makes in security, AKS vulnerability classifications might differ from other classification sources.

The following table describes vulnerability severity categories:

|Severity |Description |
|---------|------------|
|Critical |A vulnerability easily exploitable in all clusters by an unauthenticated remote attacker that leads to full system compromise. |
|High |A vulnerability easily exploitable for many clusters that leads to loss of confidentiality, integrity, or availability. |
|Medium |A vulnerability exploitable for some clusters where loss of confidentiality, integrity, or availability is limited by common configurations, difficulty of the exploit itself, required access, or user interaction. |
|Low |All other vulnerabilities. Exploitation is unlikely or consequences of exploitation are limited. |

## How vulnerabilities are updated

AKS updates CVE's that have a *vendor fix* every week. CVE's without a fix are waiting on a *vendor fix* before it can be remediated. The fixed container images are cached in the next corresponding VHD build, which also contains Ubuntu updated CVE's. As long as you are running the updated VHDs, you should not be running any container image CVE's with a vendor fix that is over 30 days old. For the OS-based vulnerabilities in the VHD, AKS uses **Unattended Update** by default, so any security updates should be applied to the existing VHD's daily. If **Unattended Update** is disabled, then it is a recommended best practice that you apply a Node Image update on a regular cadence to ensure the latest OS and Image security updates are applied.

## Update release timelines

Microsoft's goal is to mitigate detected vulnerabilities within a time period appropriate for the risks they represent. AKS is included within [Microsoft Azure FedRAMP High][microsoft-azure-fedramp-high] Provisional Authorization to Operate (P-ATO), which requires that known vulnerabilities to be remediated within a specific time period according to their severity level as specified in FedRAMP RA-5d.

## How vulnerabilities and updates are communicated

In general, Microsoft does not broadly communicate the release of new patch versions for AKS. However, Microsoft constantly monitors and validates available CVE patches to support them in AKS in a timely manner. If a critical patch is found or user action is required, Microsoft will notify you to upgrade to the newly available patch.

<Why don't we publish the security update CVEs relesed on AKS for that month? Kubernetes shares this information.>

## Next steps

See the overview about [Upgrading Azure Kubernetes Service clusters and node pools][upgrade-aks-clusters-nodes]

<!-- LINKS - internal -->
[upgrade-aks-clusters-nodes]: upgrade.md
[microsoft-azure-fedramp-high]: /azure/azure-government/compliance/azure-services-in-fedramp-auditscope#azure-government-services-by-audit-scope

<!-- LINKS - external -->
[azure-bounty-program-overview]: https://www.microsoft.com/en-us/msrc/bounty-microsoft-azure
[kubernetes-security-response-committee]: https://github.com/kubernetes/committee-security-response
[cloud-native-computing-foundation]: https://www.cncf.io/
[kubernetes-cve-feed]: https://kubernetes.io/docs/reference/issues-security/official-cve-feed/