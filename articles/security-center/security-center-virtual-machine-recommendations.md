---
title: Protecting your virtual machines in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Azure Security Center that help you protect your virtual machines and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 47fa1f76-683d-4230-b4ed-d123fef9a3e8
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/03/2017
ms.author: terrylan

---
# Protecting your virtual machines in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls.  Recommendations apply to Azure resource types: virtual machines (VMs), networking, SQL, and applications.

This article addresses recommendations that apply to VMs.  VM recommendations center around data collection, applying system updates, provisioning antimalware, encrypting your VM disks, and more.  Use the table below as a reference to help you understand the available VM recommendations and what each one will do if you apply it.

## Available VM recommendations
| Recommendation | Description |
| --- | --- |
| [Enable data collection for subscriptions](security-center-enable-data-collection.md) |Recommends that you turn on data collection in the security policy for each of your subscriptions and all virtual machines (VMs) in your subscriptions. |
| [Enable encryption for Azure Storage Account](security-center-enable-encryption-for-storage-account.md) | Recommends that you enable Azure Storage Service Encryption for data at rest. Storage Service Encryption (SSE) works by encrypting the data when it is written to Azure storage and decrypts before retrieval. SSE is currently available only for the Azure Blob service and can be used for block blobs, page blobs, and append blobs. To learn more, see [Storage Service Encryption for data at rest](../storage/storage-service-encryption.md).</br>SSE is only supported on Resource Manager storage accounts. Classic storage accounts are currently not supported. To understand the classic and Resource Manager deployment models, see [Azure deployment models](../azure-classic-rm.md). |
| [Remediate OS vulnerabilities](security-center-remediate-os-vulnerabilities.md) |Recommends that you align your OS configurations with the recommended configuration rules, e.g. do not allow passwords to be saved. |
| [Apply system updates](security-center-apply-system-updates.md) |Recommends that you deploy missing system security and critical updates to VMs. |
| [Reboot after system updates](security-center-apply-system-updates.md#reboot-after-system-updates) |Recommends that you reboot a VM to complete the process of applying system updates. |
| [Install Endpoint Protection](security-center-install-endpoint-protection.md) |Recommends that you provision antimalware programs to VMs (Windows VMs only). |
| [Resolve Endpoint Protection health alerts](security-center-resolve-endpoint-protection-health-alerts.md) |Recommends that you resolve endpoint protection failures. |
| [Enable VM Agent](security-center-enable-vm-agent.md) |Enables you to see which VMs require the VM Agent. The VM Agent must be installed on VMs in order to provision patch scanning, baseline scanning, and antimalware programs. The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. The article [VM Agent and Extensions – Part 2](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/) provides information on how to install the VM Agent. |
| [Apply disk encryption](security-center-apply-disk-encryption.md) |Recommends that you encrypt your VM disks using Azure Disk Encryption (Windows and Linux VMs). Encryption is recommended for both the OS and data volumes on your VM. |
| [Update OS version](security-center-update-os-version.md) |Recommends that you update the operating system (OS) version for your Cloud Service to the most recent version available for your OS family.  To learn more about Cloud Services, see the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md). |
| [Vulnerability assessment not installed](security-center-vulnerability-assessment-recommendations.md) |Recommends that you install a vulnerability assessment solution on your VM. |
| [Remediate vulnerabilities](security-center-vulnerability-assessment-recommendations.md#review-recommendation) |Enables you to see system and application vulnerabilities detected by the vulnerability assessment solution installed on your VM. |

## See also
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Protecting your applications in Azure Security Center](security-center-application-recommendations.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.
