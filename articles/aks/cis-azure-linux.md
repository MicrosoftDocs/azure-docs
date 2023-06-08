---
title: Center for Internet Security (CIS) Azure Linux benchmark
description: Learn how AKS applies the CIS benchmark with an Azure Linux image
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: article
ms.date: 06/08/2023
---

# Center for Internet Security (CIS) Azure Linux benchmark

Azure Kubernetes Service (AKS) and the Microsoft Azure Linux image alignment with Center for Internet Security (CIS) benchmark

The security OS configuration applied to the Azure Linux Container Host for AKS image is based on the Azure Linux security baseline, which aligns with the CIS benchmark. As a secure service, AKS complies with SOC, ISO, PCI DSS, and HIPAA standards. For more information about the Azure Linux Container Host security, please refer to [Security concepts for clusters in AKS](../../articles/aks/concepts-security.md). To learn more about the CIS benchmark, see [Center for Internet Security (CIS) Benchmarks](/compliance/regulatory/offering-CIS-Benchmark). For more information on the Azure security baselines for Linux, see [Linux security baseline](../governance/policy/samples/guest-configuration-baseline-linux.md).

## Azure Linux 2.0

This Azure Linux Container Host operating system is based on the **Azure Linux 2.0** image with built-in security configurations applied.

As part of the security-optimized operating system:

* AKS and Azure Linux provide a security-optimized host OS by default with no option to select an alternate operating system.
* The security-optimized host OS is built and maintained specifically for AKS and is **not** supported outside of the AKS platform.
* Unnecessary kernel module drivers have been disabled in the OS to reduce the attack surface.

## Recommendations

The below table has four sections:

* **CIS ID:** The associated rule ID with each of the baseline rules.
* **Recommendation description:** A description of the recommendation issued by the CIS benchmark.
* **Level:** L1, or Level 1, recommends essential basic security requirements that can be configured on any system and should cause little or no interruption of service or reduced functionality.
* **Status:**
    * *Pass* - The recommendation has been applied.
    * *Fail* - The recommendation has not been applied.
    * *N/A* - The recommendation relates to manifest file permission requirements that are not relevant to AKS.
    * *Depends on Environment* - The recommendation is applied in the user's specific environment and is not controlled by AKS.
    * *Equivalent Control* - The recommendation has been implemented in a different equivalent manner.
* **Reason:**
    * *Potential Operation Impact* - The recommendation was not applied because it would have a negative effect on the service.
    * *Covered Elsewhere* - The recommendation is covered by another control in Azure cloud compute.

The following are the results from the [CIS Azure Linux 2.0 Benchmark v2.1.0](insert link here) recommendations based on the CIS rules:

| CIS ID | Recommendation description | Level | Status | Reason |
|---|---|---|---|---|---|

## Next steps

For more information about Azure Linux Container Host security, see the following articles:

* [Azure Linux Container Host for AKS](./intro-azure-linux.md)
* [Security concepts for clusters in AKS](../../articles/aks/concepts-security.md)