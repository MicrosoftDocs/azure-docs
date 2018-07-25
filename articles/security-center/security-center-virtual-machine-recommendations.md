---
title: Protecting your machines and applications in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Security Center that help you protect your virtual machines and computers and your web apps and App Service environments.
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
ms.date: 06/14/2018
ms.author: terrylan

---
# Protecting your machines and applications in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls. Recommendations apply to Azure resource types: virtual machines (VMs) and computers, applications, networking, SQL, and Identity and Access.

This article addresses recommendations that apply to machines and applications.

## Monitoring security health
You can monitor the security state of your resources on the **Security Center – Overview** dashboard. The **Resources** section provides the number of issues identified and the security state for each resource type.

You can view a list of all issues by selecting **Recommendations**. For more information about how to apply recommendations, see [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

For a complete list of Compute and App services recommendations, see [Recommendations](security-center-virtual-machine-recommendations.md#recommendations).

To continue, select **Compute & apps** under **Resources** or the Security Center main menu.
![Security Center dashboard][1]

## Monitor Compute and App services
Under **Compute**, there are four tabs:

- **Overview**: monitoring and recommendations identified by Security Center.
- **VMs and computers**: list of your VMs, computers, and current security state of each.
- **Cloud Services**: list of your web and worker roles monitored by Security Center.
- **App services (Preview)**: list of your App service environments and current security state of each.
To continue, select **Compute & apps** under **Resources** or the Security Center main menu.

![Compute][2]

In each tab you can have multiple sections, and in each section, you can select an individual option to see more details about the recommended steps to address that particular issue.

### Monitoring recommendations
This section shows the total number of VMs and computers that were initialized for automatic provisioning and their current statuses. In this example there is one recommendation, **Monitoring agent health issues**. Select this recommendation.

![Monitor agent health issues][3]

**Monitoring agent health issues** opens. VMs and computers that Security Center is unable to successfully monitor are listed. Select a VM or computer for detailed information. **MONITORING STATE** provides a reason why Security Center is unable to monitor. See the [Security Center troubleshooting guide](security-center-troubleshooting-guide.md) for a list of **MONITORING STATE** values, descriptions, and resolution steps.

### Unmonitored VMs and computers
A VM or computer is unmonitored by Security Center if the machine is not running the Microsoft Monitoring Agent extension. A machine may have a local agent already installed, for example the OMS direct agent or the SCOM agent. Machines with these agents are identified as unmonitored because these agents are not fully supported in Security Center. To fully benefit from all of Security Center’s capabilities, the Microsoft Monitoring Agent extension is required.

You can install the extension on the unmonitored VM or computer in addition to the already installed local agent. Configure both agents the same, connecting them to the same workspace. This enables Security Center to interact with the Microsoft Monitoring Agent extension and collect data. See [Enable the VM extension](../log-analytics/log-analytics-quick-collect-azurevm.md) for instructions on how to install the Microsoft Monitoring Agent extension.

See [Monitoring agent health issues](security-center-troubleshooting-guide.md#monitoring-agent-health-issues) to learn more about the reasons Security Center is unable to successfully monitor VMs and computers initialized for automatic provisioning.

### Recommendations
This section has a set of recommendations for each VM and computer, web and worker roles, Azure App Service Web Apps, and Azure App Service Environment that Security Center monitors. The first column lists the recommendation. The second column shows the total number of resources that are affected by that recommendation. The third column shows the severity of the issue as illustrated in the following screenshot:

![Recommendations][4]

Each recommendation has a set of actions that you can perform after you select it. For example, if you select **Missing system updates**, the number of VMs and computers that are missing patches, and the severity of the missing update appears, as shown in the following screenshot:

![Apply system updates][5]

**Apply system updates** has a summary of critical updates in a graph format, one for Windows, and one for Linux. The second part has a table with the following information:

- **NAME**: Name of the missing update.
- **NO. OF VMs & COMPUTERS**: Total number of VMs and computers that are missing this update.
- **UPDATE SEVERITY**: Describes the severity of that particular recommendation:

    - **Critical**: A vulnerability exists with a meaningful resource (application, virtual machine, or network security group) and requires attention.
    - **Important**: Non-critical or additional steps are required to complete a process or eliminate a vulnerability.
    - **Moderate**: A vulnerability should be addressed but does not require immediate attention. (By default, low recommendations are not presented, but you can filter on low recommendations if you want to view them.)


- **STATE**: The current state of the recommendation:

    - **Open**: The recommendation has not been addressed yet.
    - **In Progress**: The recommendation is currently being applied to those resources, and no action is required by you.
    - **Resolved**: The recommendation was already finished. (When the issue has been resolved, the entry is dimmed).

To view the recommendation details, click the name of the missing update from the list.

![Recommendation details][6]

> [!NOTE]
> The security recommendations here are the same as those under the **Recommendations** tile. See [Implementing security recommendations in Azure Security Center](security-center-recommendations.md) for more information about how to resolve recommendations.
>
>

### VMs and computers
The VMs and computers section gives you an overview of all VM and computer recommendations. Each column represents one set of recommendations as shown in the following screenshot:

![VM and computer recommendations][7]

There are four types of icons represented in this list:

![Non-Azure computer][8] Non-Azure computer.

![Azure Resource Manager VM][9] Azure Resource Manager VM.

![Azure Classic VM][10] Azure Classic VM.

![VMs identified from the workspace][11] VMs that are identified only from the workspace that is part of the viewed subscription. This includes VMs from other subscriptions that report to the workspace in this subscription, and VMs that were installed with SCOM direct agent, and have no resource ID.

The icon that appears under each recommendation helps you to quickly identify the VM and computer that needs attention, and the type of recommendation. You can also use the Filter option to select which options you will see on this screen.

![Filter][12]

In the previous example, one VM has a critical recommendation regarding endpoint protection. Select the VM to get more information about it:

![Critical recommendation][13]

Here you see the security details for the VM or computer. At the bottom you can see the recommended action and the severity of each issue.

### Cloud services
For cloud services, a recommendation is created when the operating system version is out of date as shown in the following screenshot:

![Cloud services][14]

In a scenario where you do have a recommendation (which is not the case for the previous example), you need to follow the steps in the recommendation to update the operating system version. When an update is available, you will have an alert (red or orange - depends on the severity of the issue). When you select this alert in the WebRole1 (runs Windows Server with your web app automatically deployed to IIS) or WorkerRole1 (runs Windows Server with your web app automatically deployed to IIS) rows, you see more details about this recommendation as shown in the following screenshot:

![WorkerRole1][15]

To see a more prescriptive explanation about this recommendation, click **Update OS version** under the **DESCRIPTION** column.

![Update OS version][16]

### App services (Preview)

> [!NOTE]
> Monitoring App Service is in preview and available only on the Standard tier of Security Center. See [Pricing](security-center-pricing.md) to learn more about Security Center's pricing tiers.
>
>

Under **App services**, you find a list of your App service environments and the health summary based on the assessment Security Center performed.

![App services][17]

There are three types of icons represented in this list:

![App services environment][18] App services environment.

![Web application][19] Web application.

![Function application][24] Function application.

1. Select a web application. A summary view opens with three tabs:

  - **Recommendations**:  based on assessments performed by Security Center that failed.
  - **Passed assessments**: list of assessments performed by Security Center that passed.
  - **Unavailable assessments**: list of assessments that failed to run due to an error or the recommendation is not relevant for the specific App service

  Under **Recommendations** is a list of the recommendations for the selected web application and severity of each recommendation.

  ![Summary view][20]

2. Select a recommendation for a description of the recommendation and a list of unhealthy resources, healthy resources, and unscanned resources.

  ![Recommendation description][21]

  Under **Passed assessments** is a list of passed assessments.  Severity of these assessments is always green.

  ![Passed assessments][22]

3. Select a passed assessment from the list for a description of the assessment, a list of unhealthy and healthy resources, and a list of unscanned resources. There is a tab for unhealthy resources but that list is always empty since the assessment passed.

    ![Healthy resources][23]

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
