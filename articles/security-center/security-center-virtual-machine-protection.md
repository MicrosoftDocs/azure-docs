---
title: Protecting your machines and applications in Azure Security Center  | Microsoft Docs
description: This document addresses recommendations in Security Center that help you protect your virtual machines and computers and your web apps and App Service environments.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 47fa1f76-683d-4230-b4ed-d123fef9a3e8
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/28/2018
ms.author: rkarlin

---
# Protecting your machines and applications in Azure Security Center
Azure Security Center analyzes the security state of your Azure resources. When Security Center identifies potential security vulnerabilities, it creates recommendations that guide you through the process of configuring the needed controls. Recommendations apply to Azure resource types: virtual machines (VMs) and computers, applications, networking, SQL, and Identity and Access.

This article addresses recommendations that apply to machines and applications.

## Monitoring security health
You can monitor the security state of your resources on the **Security Center – Overview** dashboard. The **Resources** section provides the number of issues identified and the security state for each resource type.

You can view a list of all issues by selecting **Recommendations**. For more information about how to apply recommendations, see [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

For a complete list of Compute and App services recommendations, see [Recommendations](security-center-virtual-machine-recommendations.md).

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

### Unmonitored VMs and computers <a name="unmonitored-vms-and-computers"></a>
A VM or computer is unmonitored by Security Center if the machine is not running the Microsoft Monitoring Agent extension. A machine may have a local agent already installed, for example the OMS direct agent or the SCOM agent. Machines with these agents are identified as unmonitored because these agents are not fully supported in Security Center. To fully benefit from all of Security Center’s capabilities, the Microsoft Monitoring Agent extension is required.

You can install the extension on the unmonitored VM or computer in addition to the already installed local agent. Configure both agents the same, connecting them to the same workspace. This enables Security Center to interact with the Microsoft Monitoring Agent extension and collect data. See [Enable the VM extension](../azure-monitor/learn/quick-collect-azurevm.md) for instructions on how to install the Microsoft Monitoring Agent extension.

See [Monitoring agent health issues](security-center-troubleshooting-guide.md#mon-agent) to learn more about the reasons Security Center is unable to successfully monitor VMs and computers initialized for automatic provisioning.

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

## Compute and app recommendations
|Resource type|Secure score|Recommendation|Description|
|----|----|----|----|
|Machine|50|Install monitoring agent on your machines|Install the Monitoring agent to enable data collection, updates scanning, baseline scanning, and endpoint protection on each machine.|
|Machine|50|Enable automatic provisioning and data collection for your subscriptions |Enable automatic provisioning and data collection for machines in your subscriptions to enable data collection, updates scanning, baseline scanning, and endpoint protection on each machine added to your subscriptions.|
|Machine|40|Resolve monitoring agent health issues on your machines|For full Security Center protection, resolve monitoring agent issues on your machines by following the instructions in the Troubleshooting guide| 
|Machine|40|Resolve endpoint protection health issues on your machines|For full Security Center protection, resolve monitoring agent issues on your machines by following the instructions in the Troubleshooting guide.|
|Machine|40|Troubleshoot missing scan data on your machines|Troubleshoot missing scan data on virtual machines and computers. Missing scan data on your machines results in missing security assessments such as update scanning, baseline scanning, and missing endpoint protection solution scanning.|
|Machine|40|Install system updates on your machines|Install missing system security and critical updates to secure your Windows and Linux virtual machines and computers
|Machine|40|Update OS version for your cloud service roles|Update the operating system (OS) version for your cloud service roles to the most recent version available for your OS family.|
|Machine|35|Remediate vulnerabilities in security configuration on your machines|Remediate vulnerabilities in security configuration on your machines to protect them from attacks. |
|Machine|35|Remediate vulnerabilities in security configuration on your containers|Remediate vulnerabilities in security configuration on machines with Docker installed to protect them from attacks.|
|Machine|25|Enable Adaptive Application Controls|Enable application control to control which applications can run on your VMs located in Azure. This will help harden your VMs against malware. Security Center uses machine learning to analyze the applications running on each VM and helps you apply allow rules using this intelligence. This capability simplifies the process of configuring and maintaining application allow rules.|
|Machine|20|Install endpoint protection solution on your machines|Install an endpoint protection solution on your virtual machines, to protect them from threats and vulnerabilities.|
|Machine|20|Restart your machines to apply system updates|Restart your machines to apply the system updates and secure the machine from vulnerabilities.|
|App service|20|Web Application should only be accessible over HTTPS|Limit access of Web Applications over HTTPS only.|
|App service|20|Function App should only be accessible over HTTPS|Limit access of Function Apps over HTTPS only.|
|Machine|15|Apply Disk Encryption on your virtual machines|Encrypt your virtual machine disks using Azure Disk Encryption both for Windows and Linux virtual machines. Azure Disk Encryption (ADE) leverages the industry standard BitLocker feature of Windows and the DM-Crypt feature of Linux to provide OS and data disk encryption to help protect and safeguard your data and help meet your organizational security and compliance commitments in customer Azure key vault. When your compliance and security requirement requires you to encrypt the data end to end using your encryption keys, including encryption of the ephemeral (locally attached temporary) disk, use Azure disk encryption. Alternatively, by default, Managed Disks are encrypted at rest by default using Azure Storage Service Encryption where the encryption keys are Microsoft managed keys in Azure. If this meets your compliance and security requirements, you can leverage the default Managed disk encryption to meet your requirements.|
|Compute resources (service fabric)|10|Use Azure Active Directory for client authentication in Service Fabric|Perform Client authentication only via Azure Active Directory in Service Fabric.|
|Compute resources (automation account)|5| Enable encryption of Automation account|Enable encryption of Automation account variable assets when storing sensitive data.|
|App service|5|Enable diagnostics logs in App service|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (Load balancer)|5|Enable diagnostic logs in Load Balancer|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (search)|5|Enable diagnostics logs in Search service|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (service bus)|5|Enable diagnostics logs in Service Bus|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (stream analytics)|5|Enable diagnostics logs in Azure Stream Analytics|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (service fabric)|5|Enable diagnostics logs in Service Fabric|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (batch)|5|Enable diagnostic logs in Batch accounts|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (event hub)|5|Enable diagnostics logs in Event Hub|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Compute resources (logic apps)|5|Enable diagnostics logs in Logic Apps|Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. |
|Machine|30|Install a vulnerability assessment solution on your virtual machines|Install a vulnerability assessment solution on your virtual machines|
|Machine|15|Add a web application firewall| Deploy a web application firewall (WAF) solution to secure your web applications. |
|Machine|30|Remediate Vulnerabilities- by a vulnerability assessment solution|Virtual machines for which a vulnerability assessment 3rd party solution is deployed are being continuously assessed against application and OS vulnerabilities. Whenever such vulnerabilities are found, these are available for more information as part of the recommendation.|
|Compute resources (service fabric)|15|Set the ClusterProtectionLevel property to EncryptAndSign in Service Fabric|Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate.  Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed. |
|App service|10|Remote debugging should be turned off for Web Application|Turn off debugging for Web Applications if you no longer need to use it. Remote debugging requires inbound ports to be opened on a Function App.|
|App service|10|Remote debugging should be turned off for Function Application|Turn off debugging for Function App if you no longer need to use it. Remote debugging requires inbound ports to be opened on a Function App.|
|App service|10|Configure IP restrictions for Web Application|Define a list of IP addresses that are allowed to access your application. Use of IP restrictions protects a web application from common attacks.|
|App service|10|Configure IP restrictions for Function App| Define a list of IP addresses that are allowed to access your application. Use of IP restrictions protects a function app from common attacks.|
|App service|10|Do not allow all ('*') resources to access your application| Do not allow set of WEBSITE_LOAD_CERTIFICATES parameter to "". Setting the parameter to ‘’ means that all certificates are loaded to your web applications personal certificate store. This can lead to abuse of the principle of least privilege as it is unlikely that the site needs access to all certificates at runtime.|
|App service|5|Web Sockets should be disabled for Web Application|Review the use of Web Sockets within web applications. The Web Sockets protocol is vulnerable to different types of security threats.|
|App service|5|Web Sockets should be disabled for Function App|Review the use of Web Sockets within Function Apps. The Web Sockets protocol is vulnerable to different types of security threats.|
|App service|5|Use custom domains for your Web Application|Use custom domains to protect a web application from common attacks such as phishing and other DNS-related attacks.|
|App service|5|Use custom domains for Function App|Use custom domains to protect a function app from common attacks such as phishing and other DNS-related attacks.|
|Compute resources (batch)|1|Configure metric alert rules on Batch account|Configure metric alert rules on Batch account and enable the metrics Pool Delete Complete Events and Pool Delete Start Events|
|Compute resources (service bus)|1|Remove all authorization rules except RootManageSharedAccessKey from Service Bus namespace |Service Bus clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you shoud create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Compute resources (event hub)|1|Remove all authorization rules except RootManageSharedAccessKey from Event Hub namespace |Event Hub clients should not use a namespace level access policy that provides access to all queues and topics in a namespace. To align with the least privilege security model, you shoud create access policies at the entity level for queues and topics to provide access to only the specific entity.|
|Compute resources (event hub)|5|Define authorization rules on the Event Hub entity|Audit authorization rules on the Event Hub entity to grant least-privileged access.|
|Machine|30|Install a vulnerability assessment solution on your virtual machines|Install a vulnerability assessment solution on your virtual machines|
|App service|20|CORS should not allow every resource to access your Web applications|Allow only required domains to interact with your web application. Cross origin resource sharing (CORS) should not allow all domains to access your web application.|
|App service|20|CORS should not allow every resource to access your Function App| Allow only required domains to interact with your function application. Cross origin resource sharing (CORS) should not allow all domains to access your function application.|
|Machine|15|Add a web application firewall| Deploy a web application firewall (WAF) solution to secure your web applications. |
|App service|10|Use the latest supported .NET Framework for Web Application|Use the latest .NET Framework version for the latest security classes. Using older classes and types can make your application vulnerable.|
|App service|10|Use the latest supported Java version for Web Application|Use the latest Java version for the latest security classes. Using older classes and types can make your application vulnerable.|
|App service|10|Use the latest supported PHP version for Web Application|Use the latest PHP version for the latest security classes. Using older classes and types can make your application vulnerable.|
|App service|10|Use the latest supported Node.js version for Web Application|Use the latest Node.js version for the latest security classes. Using older classes and types can make your application vulnerable.|
|App service|10|Use the latest supported Python version for Web Application|Use the latest Python version for the latest security classes. Using older classes and types can make your application vulnerable.|
|VMs and computers|1|Migrate virtual machines to new AzureRM resources|Use new Azure Resource Manager v2 for your virutal machines to provide security enhancements such as: stronger access control (RBAC), better auditing, ARM-based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management. |
|Machine|30|Remediate Vulnerabilities- by a vulnerability assessment solution|Virtual machines for which a vulnerability assessment 3rd party solution is deployed are being continuously assessed against application and OS vulnerabilities. Whenever such vulnerabilities are found, these are available for more information as part of the recommendation.|




## Next steps
To learn more about recommendations that apply to other Azure resource types, see the following:


* [Understanding Azure Security Center recommendations for virtual machines](security-center-virtual-machine-recommendations.md)
* [Monitor identity and access in Azure Security Center](security-center-identity-access.md)
* [Protecting your network in Azure Security Center](security-center-network-recommendations.md)
* [Protecting your Azure SQL service in Azure Security Center](security-center-sql-service-recommendations.md)

To learn more about Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-azure-policy.md) -- Learn how to configure security policies for your Azure subscriptions and resource groups.
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
