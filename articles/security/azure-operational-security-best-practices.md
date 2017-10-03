---

title: Azure Operational Security best practices| Microsoft Docs
description: This article provides a set of best practices for Azure Operational Security.
services: security
documentationcenter: na
author: unifycloud
manager: swadhwa
editor: tomsh

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/04/2017
ms.author: tomsh

---

# Azure Operational Security best practices
Azure Operational Security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure. Azure Operational Security is built on a framework that incorporates the knowledge gained through various capabilities that are unique to Microsoft, including the Microsoft Security Development Lifecycle (SDL), the Microsoft Security Response Center program, and deep awareness of the cybersecurity threat landscape.

In this article, we discuss a collection of Azure database security best practices. These best practices are derived from our experience with Azure database security and the experiences of customers like yourself.

For each best practice, we explain:
-	What the best practice is
-	Why you want to enable that best practice
-	What might be the result if you fail to enable the best practice
- How you can learn to enable the best practice

This Azure Operational Security Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure Operational Security best practices discussed in this article include:

-	Monitor, manage, and protect cloud infrastructure
-	Manage identity and implement single sign-on (SSO)
-	Trace requests, analyze usage trends, and diagnose issues
-	Monitoring services with a centralized monitoring solution
-	Prevent, detect, and respond to threats
-	End-to-end scenario-based network monitoring
-	Secure deployment using proven DevOps tools

## Monitor, manage, and protect cloud infrastructure
IT Operations is responsible for managing datacenter infrastructure, applications, and data, including the stability and security of these systems. However, gaining security insights across increasing complex IT environments often requires organizations to cobble together data from multiple security and management systems.

[Microsoft Operations Management Suite (OMS)](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview) is Microsoft's cloud-based IT management solution that helps you manage and protect your on-premises and cloud infrastructure.

[OMS Security and Audit solution](https://docs.microsoft.com/azure/operations-management-suite/oms-security-monitoring-resources) enables IT to actively monitor all resources, which can help minimize the impact of security incidents. OMS Security and Audit have security domains that can be used for monitoring resources.

For more information about OMS, read the article [Operations Management Suite](https://technet.microsoft.com/library/mt484091.aspx).

To help you prevent, detect, and respond to threats, [Operations Management Suite (OMS) Security and Audit Solution](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started) collects and processes data about your resources, which includes:

-	Security event log
-	Event Tracing for Windows (ETW) events
-	AppLocker auditing events
-	Windows Firewall log
-	Advanced Threat Analytics events
-	Results of baseline assessment
-	Results of antimalware assessment
-	Results of update/patch assessment
-	Syslog streams that are explicitly enabled on the agent


## Manage identity and implement single sign-on
[Azure Active Directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/active-directory-whatis) is Microsoft’s multi-tenant cloud based directory and identity management service.

[Azure AD](https://azure.microsoft.com/services/active-directory/) also includes a full suite of [identity management](https://docs.microsoft.com/azure/security/security-identity-management-overview) capabilities including [multi-factor authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication), device registration, self-service password management, self-service group management, privileged account management, role-based access control, application usage monitoring, rich auditing and, security monitoring and alerting.

The following capabilities can help secure cloud-based applications, streamline IT processes, cut costs and help ensure that corporate compliance goals are met:

-	Identity and access management for the cloud
-	Simplify user access to any cloud app
-	Protect sensitive data and applications
-	Enable self-service for your employees
-	Integrate with Azure Active Directory

### Identity and access management for the cloud
Azure Active Directory (Azure AD) is a comprehensive [identity and access management cloud solution](https://www.microsoft.com/cloud-platform/identity-management), which gives you a robust set of capabilities to manage users and groups. It helps secure access to on-premises and cloud applications, including Microsoft web services like Office 365 and much non-Microsoft software as a service (SaaS) applications.
To learn more how to enable identity protection in Azure AD, see [Enabling Azure Active Directory Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-enable).

### Simplify user access to any cloud app
[Enable single sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-sso-integrate-saas-apps) to simplify user access to thousands of cloud applications from Windows, Mac, Android, and iOS devices. Users can launch applications from a personalized web-based access panel or mobile app using their company credentials. Use the Azure AD Application Proxy module to go beyond SaaS applications and publish on-premises web applications to provide highly secure remote access and single sign-on.

### Protect sensitive data and applications
Enable [Azure Multi-Factor Authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication) to prevent unauthorized access to on-premises and cloud applications by providing an additional level of authentication. Protect your business and mitigate potential threats with security monitoring, alerts, and machine learning-based reports that identify inconsistent access patterns.

### Enable self-service for your employees
Delegate important tasks to your employees, such as resetting passwords and creating and managing groups. [Enable self-service password change](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-update-your-own-password), reset, and self-service group management with Azure AD.

### Integrate with Azure Active Directory
Extend [Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-to-integrate) and any other on-premises directories to Azure AD to enable single sign-on for all cloud-based applications. User attributes can be automatically synchronized to your cloud directory from all kinds of on-premises directories.

To learn more about integration of Azure Active Directory and how to enable it, please read the article [integrate your on-premises directories with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).

## Trace requests, analyze usage trends, and diagnose issues
[Azure Storage Analytics](https://docs.microsoft.com/azure/storage/storage-analytics) performs logging and provides metrics data for a storage account. You can use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

Storage Analytics metrics are enabled by default for new storage accounts. You can enable logging and configure both metrics and logging in the Azure portal; for details, see [Monitor a storage account in the Azure portal](https://docs.microsoft.com/azure/storage/storage-monitor-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Set Service Properties operation to enable Storage Analytics individually for each service.

For an in-depth guide on using Storage Analytics and other tools to identify, diagnose, and troubleshoot Azure Storage-related issues, see [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](https://docs.microsoft.com/azure/storage/storage-monitoring-diagnosing-troubleshooting).

To learn more about integration of Azure Active Directory and how to enable it, read the article [Enabling and Configuring Storage Analytics](https://docs.microsoft.com/rest/api/storageservices/Enabling-and-Configuring-Storage-Analytics?redirectedfrom=MSDN).

## Monitoring services
Cloud applications are complex with many moving parts. Monitoring provides data to ensure that your application stays up and running in a healthy state. It also helps you to stave off potential problems or troubleshoot past ones. In addition, you can use monitoring data to gain deep insights about your application. That knowledge can help you to improve application performance or maintainability, or automate actions that would otherwise require manual intervention.

### Monitor Azure resources
[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-get-started) is the platform service that provides a single source for monitoring Azure resources. With Azure Monitor, you can visualize, query, route, archive, and take action on the metrics and logs coming from resources in Azure. You can work with this data using the Monitor portal blade, [Monitor PowerShell Cmdlets](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-powershell-samples), [Cross-Platform CLI](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-cli-samples), or [Azure Monitor REST APIs](https://msdn.microsoft.com/library/dn931943.aspx).

### Enable Autoscale with Azure monitor
Enable [Azure Monitor Autoscale](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-autoscale-get-started) applies only to virtual machine scale sets (VMSS), cloud services, app service plans, and app service environments.

### Manage Roles Permissions and Security
Many teams need to strictly [regulate access to monitoring](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-roles-permissions-security) data and settings. For example, if you have team members who work exclusively on monitoring (support engineers, devops engineers) or if you use a managed service provider, you may want to grant them access to only monitoring data while restricting their ability to create, modify, or delete resources.

This shows how to quickly apply a built-in monitoring RBAC role to a user in Azure or build your own custom role for a user who needs limited monitoring permissions. It then discusses security considerations for your Azure Monitor-related resources and how you can limit access to the data they contain.

## Prevent, detect, and respond to threats
Security Center threat detection works by automatically collecting security information from Azure resources, the network, and connected partner solutions. It analyses this information, often correlating information from multiple sources, to identify threats. Security alerts are prioritized in Security Center along with recommendations on how to remediate the threat.

-	[Configure a security policy](https://docs.microsoft.com/azure/security-center/security-center-policies) for your Azure subscription.
-	Use the [recommendations in Security Center](https://docs.microsoft.com/azure/security-center/security-center-recommendations) to help you protect your Azure resources.
-	Review and manage your current [security alerts](https://docs.microsoft.com/azure/security-center/security-center-managing-and-responding-alerts).

[Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-intro) helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

Security Center delivers easy-to-use and effective threat prevention, detection, and response capabilities that are built in to Azure. Key capabilities are:

-	Understand cloud security state
-	Take control of cloud security
-	Easily deploy integrated cloud security solutions
-	Detect threats and respond fast

### Understand cloud security state
Use Azure Security Center to get a central view of the security state of all of your Azure resources. At a glance, verify that the appropriate security controls are in place and configured correctly and quickly identify any resources, which require attention.

### Take control of cloud security
Define [security policies](https://docs.microsoft.com/azure/security-center/security-center-policies) for your Azure subscriptions according to your company’s cloud security needs, tailored to the type of applications or sensitivity of the data in each subscription. Use policy-driven recommendations to guide resource owners through the process of implementing required controls—take the guesswork out of cloud security.

### Easily deploy integrated cloud security solutions
[Enable security solutions](https://docs.microsoft.com/azure/security-center/security-center-partner-integration) from Microsoft and its partners, including industry-leading firewalls and antimalware. Use streamlined provisioning to deploy security solutions—even networking changes are configured for you. Your security events from partner solutions are automatically collected for analysis and alerting.

### Detect threats and respond fast
Stay ahead of current and emerging cloud threats with an integrated, analytics-driven approach. By combining Microsoft global [threat intelligence](https://docs.microsoft.com/azure/security-center/security-center-detection-capabilities) and expertise, with insights into cloud security-related events across your Azure deployments, Security Center helps you detect actual threats early and reduce false positives. Cloud security alerts give you insights into the attack campaign, including related events and impacted resources and suggest ways to remediate issues and recover quickly.

## End-to-end scenario-based network monitoring
Customers build an end-to-end network in Azure by orchestrating and composing various individual network resources such as VNet, ExpressRoute, Application Gateway, Load balancers, and more. Monitoring is available on each of the network resources.

[Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Network diagnostic and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure.

### Automate remote network monitoring with packet capture
Monitor and diagnose networking issues without logging in to your virtual machines (VMs) using Network Watcher. Trigger [packet capture](https://docs.microsoft.com/azure/network-watcher/network-watcher-alert-triggered-packet-capture) by setting alerts and gain access to real-time performance information at the packet level. When you see an issue, you can investigate in detail for better diagnoses.

### Gain insight into your network traffic using flow logs
Build a deeper understanding of your network traffic pattern using [Network Security Group flow logs](https://docs.microsoft.com/en-us/azure/network-watcher/network-watcher-nsg-flow-logging-overview). Information provided by flow logs helps you gather data for compliance, auditing and monitoring your network security profile.

### Diagnose VPN connectivity issues
Network Watcher provides you the ability to [diagnose your most common VPN Gateway and Connections issues](https://docs.microsoft.com/azure/network-watcher/network-watcher-diagnose-on-premises-connectivity). Allowing you not only to identify the issue but also to use the detailed logs created to help further investigate.

To learn more about how to configure Network watcher and how to enable it, please read the article [configure Network watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create).

## Secure deployment using proven DevOps tools
These are some of the List of Azure DevOps Practices in this Microsoft Cloud space, which makes enterprises and teams productive and efficient.

-	**Infrastructure as Code (IaC):** Infrastructure as Code is a set of techniques and practices, which help IT Pros remove the burden associated with the day to day build and management of modular infrastructure. It allows IT Pros to build and maintain their modern server environment in a way that is like how software developers build and maintain application code. For Azure, we have [Azure Resource Manager]( https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/) allows you to provision your applications using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application during every stage of the application lifecycle.
-	**Continuous Integration and Deployment:** You can configure your Visual Studio Online team projects to [automatically build and deploy](https://www.visualstudio.com/docs/build/overview) to Azure web apps or cloud services. VSO automatically deploys the binaries after doing a build to Azure after every code check-in. The package build process described here is equivalent to the Package command in Visual Studio, and the publishing steps are equivalent to the Publish command in Visual Studio.
-	**Release Management:** Visual Studio [Release Management](https://msdn.microsoft.com/library/vs/alm/release/overview) is a great solution for automating multi-stage deployment and managing the release process. Create managed continuous deployment pipelines to release quickly, easily, and often. With Release Management, we can much automate our release process, and we can have predefined approval workflows. Deploy on-premises and to the cloud, extend, and customize as required.
-	**App Performance Monitoring:** Detect issues, solve problems, and continuously improve your applications. Quickly diagnose any problems in your live application. Understand what your users do with it. Configuration is easy matter of adding JS code and a webconfig entry, and you see results within minutes in the portal with all the details.[App insights](https://azure.microsoft.com/documentation/articles/app-insights-start-monitoring-app-health-usage/) helps enterprises for faster detection of issues & remediation.
-	**Load Testing & Autoscale:** We can find performance problems in our app to improve deployment quality and to make sure our app is always up or available to cater to the business needs. Make sure your app can handle traffic for your next launch or marketing campaign. Start running cloud-based [load tests](https://www.visualstudio.com/docs/test/performance-testing/getting-started/getting-started-with-performance-testing) in almost no time with Visual Studio Online.

## Next steps
- Learn more about [Azure Operational Security](https://docs.microsoft.com/azure/security/azure-operational-security).
- To Learn more  [Operations Management Suite | Security & Compliance](https://www.microsoft.com/cloud-platform/security-and-compliance).
- [Getting started with Operations Management Suite Security and Audit Solution](https://docs.microsoft.com/azure/operations-management-suite/oms-security-getting-started).
