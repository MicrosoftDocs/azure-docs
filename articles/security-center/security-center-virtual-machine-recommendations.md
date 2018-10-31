---
title: Virtual machine recommendations in Azure Security Center  | Microsoft Docs
description: This document explains the Azure Security Center recommendations for how to help protect your virtual machines and computers and your web apps and App Service environments.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: f5ce7f62-7b12-4bc0-b418-4a2f9ec49ca1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/18/2018
ms.author: rkarlin

---
# Understand Azure Security Center resource recommendations


## Recommendations
Use the tables below as a reference to help you understand the available Compute and App services recommendations and what each one does if you apply it.

### Computers
| Recommendation | Description |
| --- | --- |
| [Enable data collection for subscriptions](security-center-enable-data-collection.md) |Recommends that you turn on data collection in the security policy for each of your subscriptions and all virtual machines (VMs) in your subscriptions. |
| [Enable encryption for Azure Storage Account](security-center-enable-encryption-for-storage-account.md) | Recommends that you enable Azure Storage Service Encryption for data at rest. Storage Service Encryption (SSE) works by encrypting the data when it is written to Azure storage and decrypts before retrieval. SSE is currently available only for the Azure Blob service and can be used for block blobs, page blobs, and append blobs. To learn more, see [Storage Service Encryption for data at rest](../storage/common/storage-service-encryption.md).</br>SSE is only supported on Resource Manager storage accounts. Classic storage accounts are currently not supported. To understand the classic and Resource Manager deployment models, see [Azure deployment models](../azure-classic-rm.md). |
| [Remediate security configurations](security-center-remediate-os-vulnerabilities.md) |Recommends that you align your OS configurations with the recommended security configuration rules, e.g. do not allow passwords to be saved. |
| [Apply system updates](security-center-apply-system-updates.md) |Recommends that you deploy missing system security and critical updates to VMs. |
| [Apply a Just-In-Time network access control](security-center-just-in-time.md) | Recommends that you apply just in time VM access. The just in time feature is in preview and available on the Standard tier of Security Center. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers. |
| [Reboot after system updates](security-center-apply-system-updates.md#reboot-after-system-updates) |Recommends that you reboot a VM to complete the process of applying system updates. |
| [Install Endpoint Protection](security-center-install-endpoint-protection.md) |Recommends that you provision antimalware programs to VMs (Windows VMs only). |
| [Enable VM Agent](security-center-enable-vm-agent.md) |Enables you to see which VMs require the VM Agent. The VM Agent must be installed on VMs in order to provision patch scanning, baseline scanning, and antimalware programs. The VM Agent is installed by default for VMs that are deployed from the Azure Marketplace. The article [VM Agent and Extensions – Part 2](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/) provides information on how to install the VM Agent. |
| [Apply disk encryption](security-center-apply-disk-encryption.md) |Recommends that you encrypt your VM disks using Azure Disk Encryption (Windows and Linux VMs). Encryption is recommended for both the OS and data volumes on your VM. |
| [Update OS version](security-center-update-os-version.md) |Recommends that you update the operating system (OS) version for your Cloud Service to the most recent version available for your OS family.  To learn more about Cloud Services, see the [Cloud Services overview](../cloud-services/cloud-services-choose-me.md). |
| [Vulnerability assessment not installed](security-center-vulnerability-assessment-recommendations.md) |Recommends that you install a vulnerability assessment solution on your VM. |
| [Remediate vulnerabilities](security-center-vulnerability-assessment-recommendations.md#review-the-recommendation) |Enables you to see system and application vulnerabilities detected by the vulnerability assessment solution installed on your VM. |

### App services
| Recommendation | Description |
| --- | --- |
| App Service should only be accessible over HTTPS | Recommends that you limit access of App Service over HTTPS only. |
| Web Sockets should be disabled for Web Application| Recommends that you carefully review the use of Web Sockets within web applications.  The Web Sockets protocol is vulnerable to different types of security threats. |
| Use custom domains for your Web Application | Recommends that you use custom domains to protect a web application from common attacks such as phishing and other DNS-related attacks. |
| Configure IP restrictions for Web Application | Recommends that you define a list of IP addresses that are allowed to access your application.  Use of IP restrictions protects a web application from common attacks. |
| Do not allow all ('*') resources to access your application | Recommends that you do not set WEBSITE_LOAD_CERTIFICATES parameter to ‘*’. Setting the parameter to ‘*’ means that all certificates will be loaded to your web applications personal certificate store.  This can lead to abuse of the principle of least privilege as it is unlikely that the site needs access to all certificates at runtime. |
| CORS should not allow every resource to access your application | Recommends that you allow only required domains to interact with your web application. Cross origin resource sharing (CORS) should not allow all domains to access your web application. |
| Use the latest supported .NET Framework for Web Application | Recommends that you use the latest .NET Framework version for the latest security classes. Using older classes and types can make your application vulnerable. |
| Use the latest supported Java version for Web Application | Recommends that you use the latest Java version for the latest security classes. Using older classes and types can make your application vulnerable. |
| Use the latest supported PHP version for Web Application | Recommends that you use the latest PHP version for the latest security classes. Using older classes and types can make your application vulnerable. |
| [Add a web application firewall](security-center-add-web-application-firewall.md) |Recommends that you deploy a web application firewall (WAF) for web endpoints. A WAF recommendation is shown for any public facing IP (either Instance Level IP or Load Balanced IP) that has an associated network security group with open inbound web ports (80,443).</br></br>Security Center recommends that you provision a WAF to help defend against attacks targeting your web applications on virtual machines and on App Service Environment. An App Service Environment (ASE) is a [Premium](https://azure.microsoft.com/pricing/details/app-service/) service plan option of Azure App Service that provides a fully isolated and dedicated environment for securely running Azure App Service apps. To learn more about ASE, see the [App Service Environment Documentation](../app-service/environment/intro.md).</br></br>You can protect multiple web applications in Security Center by adding these applications to your existing WAF deployments. |
| [Finalize application protection](security-center-add-web-application-firewall.md#finalize-application-protection) |To complete the configuration of a WAF, traffic must be rerouted to the WAF appliance. Following this recommendation completes the necessary setup changes. |
| Use the latest supported Node.js version for Web Application | Recommends that you use the latest Node.js version for the latest security classes. Using older classes and types can make your application vulnerable. |
| CORS should not allow every resource to access your Function App | Recommends that you allow only required domains to interact with your web application. Cross origin resource sharing (CORS) should not allow all domains to access your function application. |
| Use custom domains for Function App | Recommends that you use custom domains to protect a function app from common attacks such as phishing and other DNS-related attacks. |
| Configure IP restrictions for Function App | Recommends that you define a list of IP addresses that are allowed to access your application. Use of IP restrictions protects a function app from common attacks. |
| Function App should only be accessible over HTTPS | Recommends that you limit access of Function apps over HTTPS only. |
| Remote debugging should be turned off for Function App | Recommends that you turn off debugging for Function App if you no longer need to use it. Remote debugging requires inbound ports to be opened on a Function App. |
| Web Sockets should be disabled for Function App | Recommends that you carefully review the use of Web Sockets within Function Apps. The Web Sockets protocol is vulnerable to different types of security threats. |


## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following:

* [Monitor identity and access in Azure Security Center](security-center-identity-access.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

* [Protecting your machines and applications in Azure Security Center](security-center-virtual-machine-protection.md)
* [Setting security policies in Azure Security Center](security-center-policies.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) -- Learn how to manage and respond to security alerts.
* [Azure Security Center FAQ](security-center-faq.md) -- Find frequently asked questions about using the service.

<!--Image references-->
[1]: ./media/security-center-virtual-machine-recommendations/overview.png
[2]: ./media/security-center-virtual-machine-recommendations/compute.png
[3]: ./media/security-center-virtual-machine-recommendations/monitoring-agent-health-issues.png
[4]: ./media/security-center-virtual-machine-recommendations/compute-recommendations.png
[5]: ./media/security-center-virtual-machine-recommendations/apply-system-updates.png
[6]: ./media/security-center-virtual-machine-recommendations/missing-update-details.png
[7]: ./media/security-center-virtual-machine-recommendations/vm-computers.png
[8]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon1.png
[9]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon2.png
[10]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon3.png
[11]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-icon4.png
[12]: ./media/security-center-virtual-machine-recommendations/filter.png
[13]: ./media/security-center-virtual-machine-recommendations/vm-detail.png
[14]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-fig1-new006-2017.png
[15]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-fig8-new3.png
[16]: ./media/security-center-virtual-machine-recommendations/security-center-monitoring-fig8-new4.png
[17]: ./media/security-center-virtual-machine-recommendations/app-services.png
[18]: ./media/security-center-virtual-machine-recommendations/ase.png
[19]: ./media/security-center-virtual-machine-recommendations/web-app.png
[20]: ./media/security-center-virtual-machine-recommendations/recommendation.png
[21]: ./media/security-center-virtual-machine-recommendations/recommendation-desc.png
[22]: ./media/security-center-virtual-machine-recommendations/passed-assessment.png
[23]: ./media/security-center-virtual-machine-recommendations/healthy-resources.png
[24]: ./media/security-center-virtual-machine-recommendations/function-app.png
