---
title: Azure Linux Container Host for AKS basic core concepts
description: Learn the basic core concepts that make up the Azure Linux Container Host for AKS. 
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: conceptual 
ms.date: 09/29/2023
ms.custom: template-concept
---

# Core concepts for the Azure Linux Container Host for AKS

Microsoft Azure Linux is an open-sourced project maintained by Microsoft, which means that Microsoft is responsible for the entire Azure Linux Container Host stack, from the Linux kernel to the [Common Vulnerabilities and Exposures (CVEs)](https://cve.mitre.org/) infrastructure, support, and end-to-end validation. Microsoft makes it easy for you to create an AKS cluster with Azure Linux, without worrying about details such as verification and critical security vulnerability patches from a third party distribution.

## CVE infrastructure

One of the responsibilities of Microsoft in maintaining the Azure Linux Container Host is establishing a process for CVEs, such as identifying applicable CVEs and publishing CVE fixes, and adhering to defined Service Level Agreements (SLAs) for package fixes. The Azure Linux team builds and maintains the SLA for package fixes for production purposes. For more information, see the [Azure Linux package repo structure](https://github.com/microsoft/CBL-Mariner/blob/2.0/toolkit/docs/building/building.md#packagesmicrosoftcom-repository-structure). For the packages included in the Azure Linux Container Host, Azure Linux scans for security vulnerabilities twice a day via CVEs in the [National Vulnerability Database (NVD)](https://nvd.nist.gov/).

Azure Linux CVEs are published in the [Security Update Guide (SUG) Common Vulnerability Reporting Framework (CVRF) API](https://github.com/microsoft/MSRC-Microsoft-Security-Updates-API). This allows you to get detailed Microsoft security updates about security vulnerabilities that have been investigated by the [Microsoft Security Response Center (MSRC)](https://www.microsoft.com/msrc). By collaborating with MSRC, Azure Linux can quickly and consistently discover, evaluate, and patch CVEs, and contribute critical fixes back upstream.

High and critical CVEs are taken seriously and may be released out-of-band as a package update before a new AKS node image is available. Medium and low CVEs are included in the next image release.

> [!NOTE]
> At this time, the scan results aren't published publicly.

## Feature additions and upgrades

Given that Microsoft owns the entire Azure Linux Container Host stack, including the CVE infrastructure and other support streams, the process of submitting a feature request is streamlined. You can communicate directly with the Microsoft team that owns the Azure Linux Container Host, which ensures an accelerated process for submitting and implementing feature requests. If you have a feature request, please file an issue on the [AKS GitHub repository](https://github.com/Azure/AKS/issues).

## Testing

Before an Azure Linux node image is released for testing, it undergoes a series of Azure Linux and AKS specific tests to ensure that the image meets AKS's requirements. This approach to quality testing helps catch and mitigate issues before they're deployed to your production nodes. Part of these tests are performance related, testing CPU, network, storage, memory, and cluster metrics such as cluster creation and upgrade times. This ensures that the performance of the Azure Linux Container Host doesn't regress as we upgrade the image.

In addition, the Azure Linux packages published to [packages.microsoft.com](https://packages.microsoft.com/cbl-mariner/) are also given an extra degree of confidence and safety through our testing. Both the Azure Linux node image and packages are run through a suite of tests that simulate an Azure environment. This includes Build Verification Tests (BVTs) that validate [AKS extensions and add-ons](../../articles/aks/integrations.md) are supported on each release of the Azure Linux Container Host. Patches are also tested against the current Azure Linux node image before being released to ensure that there are no regressions, significantly reducing the likelihood of a corrupt package being rolled out to your production nodes.

## Next steps

This article covers some of the core Azure Linux Container Host concepts such as CVE infrastructure and testing. For more information on the Azure Linux Container Host concepts, see the following articles: 

- [Azure Linux Container Host overview](./intro-azure-linux.md)
- [Azure Linux Container Host for AKS packages](./concepts-packages.md)
