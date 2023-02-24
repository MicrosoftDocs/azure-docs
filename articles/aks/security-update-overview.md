---
title: Security Update Management for Azure Kubernetes Service
titleSuffix: Azure Kubernetes Service
description: Learn about our best practices for security updates for your Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: conceptual
ms.date: 02/23/2023
 
---

# Security Patch Management for Azure Kubernetes Service (AKS)

This article describes how Microsoft manages security vulnerabilities and security updates (also referred to as patches), for Azure Kubernetes Service (AKS) clusters.

# How vulnerabilities are discovered

Microsoft identifies and patches vulnerabilities and missing security updates for the following components:

- AKS Container Images: 

- Ubuntu OS 18.04 & 22.04 Worker Nodes: Canonical provides Microsoft with OS builds that have all available security updates applied.

- Windows 2022 OS Worker Nodes:  The Windows OS is patched every month (second Tuesday of each month). SLAs should be the same as per their support contract and severity.

- Mariner OS Nodes: Mariner provides AKS with OS builds that have all available security updates applied.

## AKS Container Images

While the bulk of the code running in AKS is owned and maintained by CNCF, the Azure Container Upstream team takes responsibility for building the open-source packages that we deploy on AKS. This provides complete ownership of the build, scan, sign, validate, and hotfix process and control over the binaries in container images which enables us to both establish a software supply chain over the binary as well as patch the software as needed.  

Microsoft has invested in engineers (the Azure Container Upstream team) and infrastructure in the broader Kubernetes ecosystem to help build the future of cloud-native compute in the wider CNCF community. A notable example of this is the donation of engineering time to help manage Kubernetes releases. This work not only ensures the quality of every Kubernetes release for the world, but also enabled AKS to be the fastest to get new Kubernetes releases out into production for several years. In some cases, ahead of other clouds by multiple months. Microsoft collaborates with other industry partners in the Kubernetes security organization (the Security Response Committee (SRC)), receiving, triaging, and patching embargoed security vulnerabilities before they are announced to the public. This commitment helps ensure that Kubernetes is secure for the entire world, but also enables AKS to patch and respond to vulnerabilities faster to keep our customers safe as it is part of the Kubernetes Distributors List. In addition to Kubernetes, Microsoft has signed up to receive pre-release notifications for software vulnerabilities for products such as Envoy, container runtimes, and many other open-source projects. 

Microsoft scans container images using static analysis to discover vulnerabilities and missing updates in Kubernetes and Microsoft-managed containers. If fixes are available, the scanner automatically begins the updating and release process.

In addition to automated scanning, Microsoft discovers and updates vulnerabilities unknown to scanners in the following ways.

* Microsoft performs its own audits, penetration testing, and vulnerability discovery across all AKS platforms. Specialized teams inside Microsoft and trusted third-party security vendors conduct their own attack research.

* Microsoft actively engages with the security research community through multiple vulnerability reward programs. A dedicated [Microsoft Azure Bounty program][azure-bounty-program-overview] provides significant bounties for the best cloud vulnerability found each year.

* Microsoft collaborates with other industry and open source software partners who share vulnerabilities, security research, and updates before the public release of the vulnerability. The goal of this collaboration is to update large pieces of Internet infrastructure before the vulnerability is announced to the public. In some cases, Microsoft contributes vulnerabilities found to this community.

* Microsoft's security collaboration happens on many levels. Sometimes it occurs formally through programs where organizations sign up to receive pre-release notifications about software vulnerabilities for products such as Kubernetes and Docker. Collaboration also happens informally due to our engagement with many open source projects such as the Linux kernel, container runtimes, virtualization technology, and others.

## Worker Nodes

### Linux nodes
Each evening, Linux nodes in AKS get security patches through their distro security update channel. This behavior is automatically configured as the nodes are deployed in an AKS cluster. To minimize disruption and potential impact to running workloads, nodes are not automatically rebooted if a security patch or kernel update requires it. For more information about how to handle node reboots, see Apply security and kernel updates to nodes in AKS.

Nightly updates apply security updates to the OS on the node, but the node image used to create nodes for your cluster remains unchanged. If a new Linux node is added to your cluster, the original image is used to create the node. This new node will receive all the security and kernel updates available during the automatic check every night but will remain unpatched until all checks and restarts are complete. You can use node image upgrade to check for and update node images used by your cluster. For more details on node image upgrade, see Azure Kubernetes Service (AKS) node image upgrade.

For AKS clusters on auto upgrade channel "node-image" will not pull security updates through unattended upgrade. They will get security updates through the weekly node image upgrade.

### Windows Server nodes
For Windows Server nodes, Windows Update doesn't automatically run and apply the latest updates. Schedule Windows Server node pool upgrades in your AKS cluster around the regular Windows Update release cycle and your own validation process. This upgrade process creates nodes that run the latest Windows Server image and patches, then removes the older nodes. For more information on this process, see Upgrade a node pool in AKS.

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

AKS patches CVE's that have a *vendor fix* every week. CVE's without a fix are waiting on a *vendor fix* before it can be remediated. The fixed container images are cached in the next corresponding VHD build, which also contains the updated Ubuntu/Mariner/Windows patched CVE's. As long as you are running the updated VHD, you should not be running any container image CVE's with a vendor fix that is over 30 days old.  

For the OS-based vulnerabilities in the VHD, AKS uses **Unattended Update** by default, so any security updates should be applied to the existing VHD's daily. If **Unattended Update** is disabled, then it is a recommended best practice that you apply a Node Image update on a regular cadence to ensure the latest OS and Image security updates are applied.

## Update release timelines

Microsoft's goal is to mitigate detected vulnerabilities within a time period appropriate for the risks they represent. AKS is included within [Microsoft Azure FedRAMP High][microsoft-azure-fedramp-high] Provisional Authorization to Operate (P-ATO), which requires that known vulnerabilities to be remediated within a specific time period according to their severity level as specified in FedRAMP RA-5d.

## How vulnerabilities and updates are communicated

In general, Microsoft does not broadly communicate the release of new patch versions for AKS. However, Microsoft constantly monitors and validates available CVE patches to support them in AKS in a timely manner. If a critical patch is found or user action is required, Microsoft will [notify you to upgrade to the newly available patch][aks-cve-feed].

## Security Reporting

Please report Security issues to the Microsoft Security Response Center (MSRC) at [https://msrc.microsoft.com/create-report](https://aka.ms/opensource/security/create-report).

If you prefer to submit without logging in, send email to [secure@microsoft.com](mailto:secure@microsoft.com).  If possible, encrypt your message with our PGP key; please download it from the [Microsoft Security Response Center PGP Key page](https://aka.ms/opensource/security/pgpkey).

You should receive a response within 24 hours. If for some reason you do not, please follow up via email to ensure we received your original message. Additional information can be found at [microsoft.com/msrc](https://aka.ms/opensource/security/msrc). 

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

  * Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
  * Full paths of source file(s) related to the manifestation of the issue
  * The location of the affected source code (tag/branch/commit or direct URL)
  * Any special configuration required to reproduce the issue
  * Step-by-step instructions to reproduce the issue
  * Proof-of-concept or exploit code (if possible)
  * Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

If you are reporting for a bug bounty, more complete reports can contribute to a higher bounty award. Please visit our [Microsoft Bug Bounty Program](https://aka.ms/opensource/security/bounty) page for more details about our active programs.

### Policy

Microsoft follows the principle of [Coordinated Vulnerability Disclosure](https://aka.ms/opensource/security/cvd).


## Next steps

See the overview about [Upgrading Azure Kubernetes Service clusters and node pools][upgrade-aks-clusters-nodes]

<!-- LINKS - internal -->
[upgrade-aks-clusters-nodes]: upgrade.md
[microsoft-azure-fedramp-high]: /azure/azure-government/compliance/azure-services-in-fedramp-auditscope#azure-government-services-by-audit-scope

<!-- LINKS - external -->
[azure-bounty-program-overview]: https://www.microsoft.com/en-us/msrc/bounty-microsoft-azure
[kubernetes-security-response-committee]: https://github.com/kubernetes/committee-security-response
[cloud-native-computing-foundation]: https://www.cncf.io/
[aks-cve-feed]: https://github.com/Azure/AKS/issues?q=is%3Aissue+is%3Aopen+cve
