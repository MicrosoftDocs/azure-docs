---
title: Azure Linux Container Host for AKS support lifecycle
description: Learn about the support lifecycle for the Azure Linux Container Host for AKS.
ms.service: microsoft-linux
author: htaubenfeld
ms.author: htaubenfeld
ms.topic: overview
ms.date: 09/29/2023
---

# Azure Linux Container Host support lifecycle

This article describes the support lifecycle for the Azure Linux Container Host for AKS.

> [!IMPORTANT]
> Microsoft is committed to meeting this support lifecycle and reserves the right to make changes to the support agreement and new scenarios that require modifications at any time with proper notice to customers and partners.

## Image releases

### Minor releases

At the beginning of each month, Mariner releases a minor image version containing medium, high, and critical package updates from the previous month. This release also includes minor kernel updates and bug fixes.

For more information on the CVE service level agreement (SLA), see [CVE infrastructure](./concepts-core.md#cve-infrastructure).

### Major releases

About every two years, Azure Linux releases a major image version containing new packages and package versions, an updated kernel, and enhancements to security, tooling, performance, and developer experience. Azure Linux releases a beta version of the major release about three months before the general availability (GA) release.

Azure Linux supports previous releases for six months following the GA release of the major image version. This support window enables a smooth migration between major releases while providing stable security and support.

> [!NOTE]
> The preview version of Azure Linux 3.0 is expected to release in March 2024.

## Next steps

- Learn more about [Azure Linux Container Host support](./support-help.md).
