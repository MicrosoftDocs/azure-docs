---
title: Managing security recommendations in Azure Security Center  | Microsoft Docs
description: This document walks you through how recommendations in Azure Security Center help you protect your Azure resources and stay in compliance with security policies.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: MBaldwin
editor: ''

ms.assetid: 86c50c9f-eb6b-4d97-acb3-6d599c06133e
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/21/2017
ms.author: terrylan

---
# Managing security recommendations in Azure Security Center
This document walks you through how to use recommendations in Azure Security Center to help you protect your Azure resources.

> [!NOTE]
> This document introduces the service by using an example deployment.  This document is not a step-by-step guide.
>
>

## What are security recommendations?
Security Center periodically analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations. The recommendations guide you through the process of configuring the needed controls.

## Implementing security recommendations
### Set recommendations
In [Setting security policies in Azure Security Center](security-center-policies.md), you learn to:

* Configure security policies.
* Turn on data collection.
* Choose which recommendations to see as part of your security policy.

Current policy recommendations center around system updates, baseline rules, antimalware programs, [network security groups](../virtual-network/virtual-networks-nsg.md) on subnets and network interfaces, SQL database auditing, SQL database transparent data encryption, and web application firewalls.  [Setting security policies](security-center-policies.md) provides a description of each recommendation option.

### Monitor recommendations
After setting a security policy, Security Center analyzes the security state of your resources to identify potential vulnerabilities. The **Recommendations** tile on the **Security Center** blade lets you know the total number of recommendations identified by Security Center.

![Recommendations tile][1]

To see the details of each recommendation:

Select the **Recommendations tile** on the **Security Center** blade. The **Recommendations** blade opens.

The recommendations are shown in a table format where each line represents one particular recommendation. The columns of this table are:

* **DESCRIPTION**: Explains the recommendation and what needs to be done to address it.
* **RESOURCE**: Lists the resources to which this recommendation applies.
* **STATE**: Describes the current state of the recommendation:
  * **Open**: The recommendation hasn't been addressed yet.
  * **In Progress**: The recommendation is currently being applied to the resources, and no action is required by you.
  * **Resolved**: The recommendation has already been completed (in this case, the line is grayed out).
* **SEVERITY**: Describes the severity of that particular recommendation:
  * **High**: A vulnerability exists with a meaningful resource (such as an application, a VM, or a network security group) and requires attention.
  * **Medium**: A vulnerability exists and non-critical or additional steps are required to eliminate it or to complete a process.
  * **Low**: A vulnerability exists that should be addressed but does not require immediate attention. (By default, low recommendations aren't presented, but you can filter on low recommendations if you want to see them.)

Use the table below as a reference to help you understand the available recommendations and what each one does if you apply it.

> [!NOTE]
> You will want to understand the [classic and Resource Manager deployment models](../azure-classic-rm.md) for Azure resources.
>
>

| Recommendation | Description |
| --- | --- |
| [Enable data collection for subscriptions](security-center-enable-data-collection.md) |Recommends that you turn on data collection in the security policy for each of your subscriptions and all virtual machines (VMs) in your subscriptions. |
| [Remediate OS vulnerabilities](security-center-remediate-os-vulnerabilities.md) |Recommends that you align your OS configurations with the recommended configuration rules, for example, do not allow passwords to be saved. |
| [Apply system updates](security-center-apply-system-updates.md) |Recommends that you deploy missing system security and critical updates to VMs. |
| [Reboot after system updates](security-center-apply-system-updates.md#reboot-after-system-updates) |Recommends that you reboot a VM to complete the process of applying system updates. |
| [Add a web application firewall](security-center-add-web-application-firewall.md) |Recommends that you deploy a web application firewall (WAF) for web endpoints. A WAF recommendation is shown for any public facing IP (either Instance Level IP or Load Balanced IP) that has an associated network security group with open inbound web ports (80,443). </br>Security Center recommends that you provision a WAF to help defend against attacks targeting your web applications on virtual machines and on App Service Environment. An App Service Environment (ASE) is a [Premium](https://azure.microsoft.com/pricing/details/app-service/) service plan option of Azure App Service that provides a fully isolated and dedicated environment for securely running Azure App Service apps. To learn more about ASE, see the [App Service Environment Documentation](../app-service/app-service-app-service-environments-readme.md).</br>You can protect multiple web applications in Security Center by adding these applications to your existing WAF deployments. |
| [Finalize application protection](security-center-add-web-application-firewall.md#finalize-application-protection) |To complete the configuration of a WAF, traffic must be rerouted to the WAF appliance. Following this recommendation completes the necessary setup changes. |
| [Add a Next Generation Firewall](security-center-add-next-generation-firewall.md) |Recommends that you add a Next Generation Firewall (NGFW) from a Microsoft partner to increase your security protections. |
| [Route traffic through NGFW only](security-center-add-next-generation-firewall.md#route-traffic-through-ngfw-only) |Recommends that you configure network security group (NSG) rules that force inbound traffic to your VM through your NGFW. |
| [Install Endpoint Protection](security-center-install-endpoint-protection.md) |Recommends that you provision antimalware programs to VMs (Windows VMs only). |
| [Resolve Endpoint Protection health alerts](security-center-resolve-endpoint-protection-health-alerts.md) |Recommends that you resolve endpoint protection failures. |
| [Enable Network Security Groups on subnets or virtual machines](security-center-enable-network-security-groups.md) |Recommends that you enable NSGs on subnets or VMs. |
| [Restrict access through Internet facing endpoint](security-center-restrict-access-through-internet-facing-endpoints.md) |Recommends that you configure inbound traffic rules for NSGs. |
| [Enable auditing and threat detection on SQL servers](security-center-enable-auditing-on-sql-servers.md) |Recommends that you turn on auditing and threat detection for Azure SQL servers. (Azure SQL service only. Doesn't include SQL running on your virtual machines.) |
| [Enable auditing and threat detection on SQL databases](security-center-enable-auditing-on-sql-databases.md) |Recommends that you turn on auditing and threat detection for Azure SQL databases. (Azure SQL service only. Doesn't include SQL running on your virtual machines.) |
| [Enable Transparent Data Encryption on SQL databases](security-center-enable-transparent-data-encryption.md) |Recommends that you enable encryption for SQL databases. (Azure SQL service only.) |
| [Enable VM Agent](security-center-enable-vm-agent.md) |Enables you to see which VMs require the VM Agent. The VM Agent must be installed on VMs to provision patch scanning, baseline scanning, and antimalware programs. The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. The article [VM Agent and Extensions – Part 2](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/) provides information on how to install the VM Agent. |
| [Apply disk encryption](security-center-apply-disk-encryption.md) |Recommends that you encrypt your VM disks using Azure Disk Encryption (Windows and Linux VMs). Encryption is recommended for both the OS and data volumes on your VM. |
| [Provide security contact details](security-center-provide-security-contact-details.md) |Recommends that you provide security contact information for each of your subscriptions. Contact information is an email address and phone number. The information is used to contact you if our security team finds that your resources are compromised. |
| [Update OS version](security-center-update-os-version.md) |Recommends that you update the operating system (OS) version for your Cloud Service to the most recent version available for your OS family.  To learn more about Cloud Services, see the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md). |
| [Vulnerability assessment not installed](security-center-vulnerability-assessment-recommendations.md) |Recommends that you install a vulnerability assessment solution on your VM. |
| [Remediate vulnerabilities](security-center-vulnerability-assessment-recommendations.md#review-recommendation) |Enables you to see system and application vulnerabilities detected by the vulnerability assessment solution installed on your VM. |
| [Enable encryption for Azure Storage Account](security-center-enable-encryption-for-storage-account.md) | Recommends that you enable Azure Storage Service Encryption for data at rest. Storage Service Encryption (SSE) works by encrypting the data when it is written to Azure storage and decrypts before retrieval. SSE is currently available only for the Azure Blob service and can be used for block blobs, page blobs, and append blobs. To learn more, see [Storage Service Encryption for data at rest](../storage/storage-service-encryption.md).</br>SSE is only supported on Resource Manager storage accounts. |

You can filter and dismiss recommendations.

1. Select **Filter** on the **Recommendations** blade. The **Filter** blade opens and you select the severity and state values you wish to see.

    ![Filter recommendations][2]
2. If you determine that a recommendation is not applicable, you can dismiss the recommendation and then filter it out of your view. There are two ways to dismiss a recommendation. One way is to right click an item, and then select **Dismiss**. The other is to hover over an item, click the three dots that appear to the right, and then select **Dismiss**. You can view dismissed recommendations by clicking **Filter**, and then selecting **Dismissed**.

    ![Dismiss recommendation][3]

### Apply recommendations
After reviewing all recommendations, decide which one you should apply first. We recommend that you use the severity rating as the main parameter to evaluate which recommendations should be applied first.

In the table of recommendations above, select a recommendation and walk through it as an example of how to apply a recommendation.

## See also
In this document, you were introduced to security recommendations in Security Center. To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance.

<!--Image references-->
[1]: ./media/security-center-recommendations/recommendations-tile.png
[2]: ./media/security-center-recommendations/filter-recommendations.png
[3]: ./media/security-center-recommendations/dismiss-recommendations.png
