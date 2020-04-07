---
title: Security hardening in AKS virtual machine hosts 
description: Learn about the security hardening in AKS VM host OS
services: container-service
author: mlearned
ms.topic: article
ms.date: 09/11/2019
ms.author: mlearned
ms.custom: mvc
---

# Security hardening for AKS agent node host OS

Azure Kubernetes Service (AKS) is a secure service compliant with SOC, ISO, PCI DSS, and HIPAA standards. This article covers the security hardening applied to AKS virtual machine hosts. For more information about AKS security, see [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/concepts-security).

> [!Note]
> This document is scoped to Linux agents in AKS only.

AKS clusters are deployed on host virtual machines, which run a security optimized OS which is utilized for containers running on AKS. This host OS is based on an **Ubuntu 16.04.LTS** image with additional security hardening and optimizations applied (see Security hardening details).

The goal of the security hardened host OS is to reduce the surface area of attack and optimize for the deployment of containers in a secure manner.

> [!Important]
> The security hardened OS is NOT CIS benchmarked. While there are overlaps with CIS benchmarks, the goal is not to be CIS-compliant. The goal for host OS hardening is to converge on a level of security consistent with Microsoft's own internal host security standards.

## Security hardening features

* AKS provides a security optimized host OS by default. There is no option to select an alternate operating system.

* Azure applies daily patches (including security patches) to AKS virtual machine hosts. Some of these patches will require a reboot, while others will not. You are responsible for scheduling AKS VM host reboots as needed. For guidance on how to automate AKS patching see [patching AKS nodes](https://docs.microsoft.com/azure/aks/node-updates-kured).

## What is configured

| CIS  | Audit description|
|---|---|
| 1.1.1.1 |Ensure mounting of cramfs filesystems is disabled|
| 1.1.1.2 |Ensure mounting of freevxfs filesystems is disabled|
| 1.1.1.3 |Ensure mounting of jffs2 filesystems is disabled|
| 1.1.1.4 |Ensure mounting of HFS filesystems is disabled|
| 1.1.1.5 |Ensure mounting of HFS Plus filesystems is disabled|
|1.4.3 |Ensure authentication required for single user mode |
|1.7.1.2 |Ensure local login warning banner is configured properly |
|1.7.1.3 |Ensure remote login warning banner is configured properly |
|1.7.1.5 |Ensure permissions on /etc/issue are configured |
|1.7.1.6 |Ensure permissions on /etc/issue.net are configured |
|2.1.5 |Ensure that --streaming-connection-idle-timeout is not set to 0 |
|3.1.2 |Ensure packet redirect sending is disabled |
|3.2.1 |Ensure source routed packages are not accepted |
|3.2.2 |Ensure ICMP redirects are not accepted |
|3.2.3 |Ensure secure ICMP redirects are not accepted |
|3.2.4 |Ensure suspicious packets are logged |
|3.3.1 |Ensure IPv6 router advertisements are not accepted |
|3.5.1 |Ensure DCCP is disabled |
|3.5.2 |Ensure SCTP is disabled |
|3.5.3 |Ensure RDS is disabled |
|3.5.4 |Ensure TIPC is disabled |
|4.2.1.2 |Ensure logging is configured |
|5.1.2 |Ensure permissions on /etc/crontab are configured |
|5.2.4 |Ensure SSH X11 forwarding is disabled |
|5.2.5 |Ensure SSH MaxAuthTries is set to 4 or less |
|5.2.8 |Ensure SSH root login is disabled |
|5.2.10 |Ensure SSH PermitUserEnvironment is disabled |
|5.2.11 |Ensure only approved MAX algorithms are used |
|5.2.12 |Ensure SSH Idle Timeout Interval is configured |
|5.2.13 |Ensure SSH LoginGraceTime is set to one minute or less |
|5.2.15 |Ensure SSH warning banner is configured |
|5.3.1 |Ensure password creation requirements are configured |
|5.4.1.1 |Ensure password expiration is 90 days or less |
|5.4.1.4 |Ensure inactive password lock is 30 days or less |
|5.4.4 |Ensure default user umask is 027 or more restrictive |
|5.6 |Ensure access to the su command is restricted|

## Additional notes
 
* To further reduce the attack surface area, some unnecessary kernel module drivers have been disabled in the OS.

* The security hardened OS is built and maintained specifically for AKS and is NOT supported outside of the AKS platform.

## Next steps  

See the following articles for more information about AKS security: 

[Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/intro-kubernetes)

[AKS security considerations ](https://docs.microsoft.com/azure/aks/concepts-security)

[AKS best practices ](https://docs.microsoft.com/azure/aks/best-practices)
