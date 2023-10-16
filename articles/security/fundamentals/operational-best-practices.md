---

title: Security best practices for your Azure assets
titleSuffix: Azure security
description: This article provides a set of operational best practices for protecting your data, applications, and other assets in Azure.
services: security
documentationcenter: na
author: TerryLanfear
manager: rkarlin

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/18/2023
ms.author: terrylan

---

# Azure Operational Security best practices
This article provides a set of operational best practices for protecting your data, applications, and other assets in Azure.

The best practices are based on a consensus of opinion, and they work with current Azure platform capabilities and feature sets. Opinions and technologies change over time and this article is updated on a regular basis to reflect those changes.

## Define and deploy strong operational security practices
Azure operational security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Azure. Azure operational security is built on a framework that incorporates the knowledge gained through capabilities that are unique to Microsoft, including the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl), the [Microsoft Security Response Center](https://www.microsoft.com/msrc?rtc=1) program, and deep awareness of the cybersecurity threat landscape.

<a name='enforce-multi-factor-verification-for-users'></a>

## Enforce multifactor verification for users

We recommend that you require two-step verification for all of your users. This includes administrators and others in your organization who can have a significant impact if their account is compromised (for example, financial officers).

There are multiple options for requiring two-step verification. The best option for you depends on your goals, the Microsoft Entra edition you're running, and your licensing program. See [How to require two-step verification for a user](../../active-directory/authentication/howto-mfa-userstates.md) to determine the best option for you. See the [Microsoft Entra ID](https://azure.microsoft.com/pricing/details/active-directory/) and [Microsoft Entra multifactor Authentication](https://azure.microsoft.com/pricing/details/multi-factor-authentication/) pricing pages for more information about licenses and pricing.

Following are options and benefits for enabling two-step verification:

**Option 1**: Enable MFA for all users and login methods with Microsoft Entra Security Defaults
**Benefit**: This option enables you to easily and quickly enforce MFA for all users in your environment with a stringent policy to:

* Challenge administrative accounts and administrative logon mechanisms
* Require MFA challenge via Microsoft Authenticator for all users
* Restrict legacy authentication protocols.

This method is available to all licensing tiers but is not able to be mixed with existing Conditional Access policies. You can find more information in [Microsoft Entra Security Defaults](../../active-directory/fundamentals/concept-fundamentals-security-defaults.md)

**Option 2**: [Enable multifactor authentication by changing user state](../../active-directory/authentication/howto-mfa-userstates.md).   
**Benefit**: This is the traditional method for requiring two-step verification. It works with both [Microsoft Entra multifactor authentication in the cloud and Azure Multi-Factor Authentication Server](../../active-directory/authentication/concept-mfa-howitworks.md). Using this method requires users to perform two-step verification every time they sign in and overrides Conditional Access policies.

To determine where multifactor authentication needs to be enabled, see [Which version of Microsoft Entra multifactor authentication is right for my organization?](../../active-directory/authentication/concept-mfa-howitworks.md).

**Option 3**: [Enable multifactor authentication with Conditional Access policy](../../active-directory/authentication/howto-mfa-getstarted.md).
**Benefit**: This option allows you to prompt for two-step verification under specific conditions by using [Conditional Access](../../active-directory/conditional-access/concept-conditional-access-policy-common.md). Specific conditions can be user sign-in from different locations, untrusted devices, or applications that you consider risky. Defining specific conditions where you require two-step verification enables you to avoid constant prompting for your users, which can be an unpleasant user experience.

This is the most flexible way to enable two-step verification for your users. Enabling a Conditional Access policy works only for Microsoft Entra multifactor authentication in the cloud and is a premium feature of Microsoft Entra ID. You can find more information on this method in [Deploy cloud-based Microsoft Entra multifactor authentication](../../active-directory/authentication/howto-mfa-getstarted.md).

**Option 4**: Enable multifactor authentication with Conditional Access policies by evaluating [Risk-based Conditional Access policies](../../active-directory/conditional-access/howto-conditional-access-policy-risk.md).   
**Benefit**: This option enables you to:

* Detect potential vulnerabilities that affect your organization's identities.
* Configure automated responses to detected suspicious actions that are related to your organization's identities.
* Investigate suspicious incidents and take appropriate action to resolve them.

This method uses the Microsoft Entra ID Protection risk evaluation to determine if two-step verification is required based on user and sign-in risk for all cloud applications. This method requires Microsoft Entra ID P2 licensing. You can find more information on this method in [Microsoft Entra ID Protection](../../active-directory/identity-protection/overview-identity-protection.md).

> [!Note]
> Option 2, enabling multifactor authentication by changing the user state, overrides Conditional Access policies. Because options 3 and 4 use Conditional Access policies, you cannot use option 2 with them.

Organizations that don't add extra layers of identity protection, such as two-step verification, are more susceptible for credential theft attack. A credential theft attack can lead to data compromise.

## Manage and monitor user passwords
The following table lists some best practices related to managing user passwords:

**Best practice**: Ensure you have the proper level of password protection in the cloud.   
**Detail**: Follow the guidance in [Microsoft Password Guidance](https://www.microsoft.com/research/publication/password-guidance/), which is scoped to users of the Microsoft identity platforms (Microsoft Entra ID, Active Directory, and Microsoft account).

**Best practice**: Monitor for suspicious actions related to your user accounts.   
**Detail**: Monitor for [users at risk](../../active-directory/identity-protection/overview-identity-protection.md) and [risky sign-ins](../../active-directory/identity-protection/overview-identity-protection.md) by using Microsoft Entra security reports.

**Best practice**: Automatically detect and remediate high-risk passwords.   
**Detail**: [Microsoft Entra ID Protection](../../active-directory/identity-protection/overview-identity-protection.md) is a feature of the Microsoft Entra ID P2 edition that enables you to:

- Detect potential vulnerabilities that affect your organization’s identities
- Configure automated responses to detected suspicious actions that are related to your organization’s identities
- Investigate suspicious incidents and take appropriate actions to resolve them

## Receive incident notifications from Microsoft
Be sure your security operations team receives Azure incident notifications from Microsoft. An incident notification lets your security team know you have compromised Azure resources so they can quickly respond to and remediate potential security risks.

In the Azure enrollment portal, you can ensure admin contact information includes details that notify security operations. Contact information is an email address and phone number.

## Organize Azure subscriptions into management groups
If your organization has many subscriptions, you might need a way to efficiently manage access, policies, and compliance for those subscriptions. [Azure management groups](../../governance/management-groups/create-management-group-portal.md) provide a level of scope that’s above subscriptions. You organize subscriptions into containers called management groups and apply your governance conditions to the management groups. All subscriptions within a management group automatically inherit the conditions applied to the management group.

You can build a flexible structure of management groups and subscriptions into a directory. Each directory is given a single top-level management group called the root management group. This root management group is built into the hierarchy to have all management groups and subscriptions fold up to it. The root management group allows global policies and Azure role assignments to be applied at the directory level.

Here are some best practices for using management groups:

**Best practice**: Ensure that new subscriptions apply governance elements like policies and permissions as they are added.   
**Detail**: Use the root management group to assign enterprise-wide security elements that apply to all Azure assets. Policies and permissions are examples of elements.

**Best practice**: Align the top levels of management groups with segmentation strategy to provide a point for control and policy consistency within each segment.   
**Detail**: Create a single management group for each segment under the root management group. Don’t create any other management groups under the root.

**Best practice**: Limit management group depth to avoid confusion that hampers both operations and security.   
**Detail**: Limit your hierarchy to three levels, including the root.

**Best practice**: Carefully select which items to apply to the entire enterprise with the root management group.   
**Detail**: Ensure root management group elements have a clear need to be applied across every resource and that they’re low impact.

Good candidates include:

- Regulatory requirements that have a clear business impact (for example, restrictions related to data sovereignty)
- Requirements with near-zero potential negative effect on operations, like policy with audit effect or Azure RBAC permission assignments that have been carefully reviewed

**Best practice**: Carefully plan and test all enterprise-wide changes on the root management group before applying them (policy, Azure RBAC model, and so on).   
**Detail**: Changes in the root management group can affect every resource on Azure. While they provide a powerful way to ensure consistency across the enterprise, errors or incorrect usage can negatively affect production operations. Test all changes to the root management group in a test lab or production pilot.

## Streamline environment creation with blueprints
[The Azure Blueprints](../../governance/blueprints/overview.md) service enables cloud architects and central information technology groups to define a repeatable set of Azure resources that implements and adheres to an organization's standards, patterns, and requirements. Azure Blueprints makes it possible for development teams to rapidly build and stand up new environments with a set of built-in components and the confidence that they're creating those environments within organizational compliance.

## Monitor storage services for unexpected changes in behavior
Diagnosing and troubleshooting issues in a distributed application hosted in a cloud environment can be more complex than it is in traditional environments. Applications can be deployed in a PaaS or IaaS infrastructure, on-premises, on a mobile device, or in some combination of these environments. Your application's network traffic might traverse public and private networks, and your application might use multiple storage technologies.

You should continuously monitor the storage services that your application uses for any unexpected changes in behavior (such as slower response times). Use logging to collect more detailed data and to analyze a problem in depth. The diagnostics information that you obtain from both monitoring and logging helps you to determine the root cause of the issue that your application encountered. Then you can troubleshoot the issue and determine the appropriate steps to remediate it.

[Azure Storage Analytics](../../storage/common/storage-analytics.md) performs logging and provides metrics data for an Azure storage account. We recommend that you use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

## Prevent, detect, and respond to threats
[Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md) helps you prevent, detect, and respond to threats by providing increased visibility into (and control over) the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with various security solutions.

The Free tier of Defender for Cloud offers limited security for your resources in Azure as well as Arc-enabled resources outside of Azure. The Enahanced Security Features extend these capabilities to include threat and vulnerability management, as well as regulatory compliance reporting. Defender for Cloud Plans help you find and fix security vulnerabilities, apply access and application controls to block malicious activity, detect threats by using analytics and intelligence, and respond quickly when under attack. You can try Defender for Cloud Standard at no cost for the first 30 days. We recommend that you [enable enhanced security features on your Azure subscriptions in Defender for Cloud](../../defender-for-cloud/enable-enhanced-security.md).

Use Defender for Cloud to get a central view of the security state of all your resources in your own data centers, Azure and other clouds. At a glance, verify that the appropriate security controls are in place and configured correctly, and quickly identify any resources that need attention.

Defender for Cloud also integrates with [Microsoft Defender for Endpoint](../../defender-for-cloud/integration-defender-for-endpoint.md), which provides comprehensive Endpoint Detection and Response (EDR) capabilities. With Microsoft Defender for Endpoint integration, you can spot abnormalities and detect vulnerabilities. You can also detect and respond to advanced attacks on server endpoints monitored by Defender for Cloud.

Almost all enterprise organizations have a security information and event management (SIEM) system to help identify emerging threats by consolidating log information from diverse signal gathering devices. The logs are then analyzed by a data analytics system to help identify what’s “interesting” from the noise that is inevitable in all log gathering and analytics solutions.

[Microsoft Sentinel](../../sentinel/overview.md) is a scalable, cloud-native, security information and event management (SIEM) and security orchestration automated response (SOAR) solution. Microsoft Sentinel provides intelligent security analytics and threat intelligence via alert detection, threat visibility, proactive hunting, and automated threat response.

Here are some best practices for preventing, detecting, and responding to threats:

**Best practice**: Increase the speed and scalability of your SIEM solution by using a cloud-based SIEM.   
**Detail**: Investigate the features and capabilities of [Microsoft Sentinel](../../sentinel/overview.md) and compare them with the capabilities of what you’re currently using on-premises. Consider adopting Microsoft Sentinel if it meets your organization’s SIEM requirements.

**Best practice**: Find the most serious security vulnerabilities so you can prioritize investigation.   
**Detail**: Review your [Azure secure score](../../security-center/secure-score-security-controls.md) to see the recommendations resulting from the Azure policies and initiatives built into Microsoft Defender for Cloud. These recommendations help address top risks like security updates, endpoint protection, encryption, security configurations, missing WAF, internet-connected VMs, and many more.

The secure score, which is based on Center for Internet Security (CIS) controls, lets you benchmark your organization’s Azure security against external sources. External validation helps validate and enrich your team’s security strategy.

**Best practice**: Monitor the security posture of machines, networks, storage and data services, and applications to discover and prioritize potential security issues.  
**Detail**: Follow the [security recommendations](../../security-center/security-center-recommendations.md) in Defender for Cloud starting, with the highest priority items.

**Best practice**: Integrate Defender for Cloud alerts into your security information and event management (SIEM) solution.   
**Detail**: Most organizations with a SIEM use it as a central clearinghouse for security alerts that require an analyst response. Processed events produced by Defender for Cloud are published to the Azure Activity Log, one of the logs available through Azure Monitor. Azure Monitor offers a consolidated pipeline for routing any of your monitoring data into a SIEM tool. See [Stream alerts to a SIEM, SOAR, or IT Service Management solution](../../security-center/export-to-siem.md) for instructions. If you’re using Microsoft Sentinel, see [Connect Microsoft Defender for Cloud](../../sentinel/connect-azure-security-center.md).

**Best practice**: Integrate Azure logs with your SIEM.   
**Detail**: Use [Azure Monitor to gather and export data](../../azure-monitor/overview.md#integrate). This practice is critical for enabling security incident investigation, and online log retention is limited. If you’re using Microsoft Sentinel, see [Connect data sources](../../sentinel/connect-data-sources.md).

**Best practice**: Speed up your investigation and hunting processes and reduce false positives by integrating Endpoint Detection and Response (EDR) capabilities into your attack investigation.   
**Detail**: [Enable the Microsoft Defender for Endpoint integration](../../security-center/security-center-wdatp.md#enable-the-microsoft-defender-for-endpoint-integration) via your Defender for Cloud security policy. Consider using Microsoft Sentinel for threat hunting and incident response.

## Monitor end-to-end scenario-based network monitoring
Customers build an end-to-end network in Azure by combining network resources like a virtual network, ExpressRoute, Application Gateway, and load balancers. Monitoring is available on each of the network resources.

[Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is a regional service. Use its diagnostic and visualization tools to monitor and diagnose conditions at a network scenario level in, to, and from Azure.

The following are best practices for network monitoring and available tools.

**Best practice**: Automate remote network monitoring with packet capture.  
**Detail**: Monitor and diagnose networking issues without logging in to your VMs by using Network Watcher. Trigger [packet capture](../../network-watcher/network-watcher-alert-triggered-packet-capture.md) by setting alerts and gain access to real-time performance information at the packet level. When you see an issue, you can investigate in detail for better diagnoses.

**Best practice**: Gain insight into your network traffic by using flow logs.  
**Detail**: Build a deeper understanding of your network traffic patterns by using [network security group flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md). Information in flow logs helps you gather data for compliance, auditing, and monitoring your network security profile.

**Best practice**: Diagnose VPN connectivity issues.  
**Detail**: Use Network Watcher to [diagnose your most common VPN Gateway and connection issues](../../network-watcher/network-watcher-diagnose-on-premises-connectivity.md). You can not only identify the issue but also use detailed logs to further investigate.

## Secure deployment by using proven DevOps tools
Use the following DevOps best practices to ensure that your enterprise and teams are productive and efficient.

**Best practice**: Automate the build and deployment of services.  
**Detail**: [Infrastructure as code](/devops/deliver/what-is-infrastructure-as-code) is a set of techniques and practices that help IT pros remove the burden of day-to-day build and management of modular infrastructure. It enables IT pros to build and maintain their modern server environment in a way that’s like how software developers build and maintain application code.

You can use [Azure Resource Manager](../../azure-resource-manager/templates/syntax.md) to provision your applications by using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application in every stage of the application lifecycle.

**Best practice**: Automatically build and deploy to Azure web apps or cloud services.  
**Detail**: You can configure your Azure DevOps Projects to  [automatically build and deploy](/azure/devops/pipelines/index) to Azure web apps or cloud services. Azure DevOps automatically deploys the binaries after doing a build to Azure after every code check-in. The package build process is equivalent to the Package command in Visual Studio, and the publishing steps are equivalent to the Publish command in Visual Studio.

**Best practice**: Automate release management.  
**Detail**: [Azure Pipelines](/azure/devops/pipelines/index) is a solution for automating multiple-stage deployment and managing the release process. Create managed continuous deployment pipelines to release quickly, easily, and often. With Azure Pipelines, you can automate your release process, and you can have predefined approval workflows. Deploy on-premises and to the cloud, extend, and customize as required.

**Best practice**: Check your app's performance before you launch it or deploy updates to production.  
**Detail**: Run cloud-based [load tests](../../load-testing/index.yml) to:

- Find performance problems in your app.
- Improve deployment quality.
- Make sure that your app is always available.
- Make sure that your app can handle traffic for your next launch or marketing campaign.

[Apache JMeter](https://jmeter.apache.org/) is a free, popular open source tool with a strong community backing.

**Best practice**: Monitor application performance.  
**Detail**: [Azure Application Insights](../../azure-monitor/app/app-insights-overview.md) is an extensible application performance management (APM) service for web developers on multiple platforms. Use Application Insights to monitor your live web application. It automatically detects performance anomalies. It includes analytics tools to help you diagnose issues and to understand what users actually do with your app. It's designed to help you continuously improve performance and usability.

## Mitigate and protect against DDoS
Distributed denial of service (DDoS) is a type of attack that tries to exhaust application resources. The goal is to affect the application’s availability and its ability to handle legitimate requests. These attacks are becoming more sophisticated and larger in size and impact. They can be targeted at any endpoint that is publicly reachable through the internet.

Designing and building for DDoS resiliency requires planning and designing for a variety of failure modes. Following are best practices for building DDoS-resilient services on Azure.

**Best practice**: Ensure that security is a priority throughout the entire lifecycle of an application, from design and implementation to deployment and operations. Applications can have bugs that allow a relatively low volume of requests to use a lot of resources, resulting in a service outage.  
**Detail**: To help protect a service running on Microsoft Azure, you should have a good understanding of your application architecture and focus on the [five pillars of software quality](/azure/architecture/guide/pillars). You should know typical traffic volumes, the connectivity model between the application and other applications, and the service endpoints that are exposed to the public internet.

Ensuring that an application is resilient enough to handle a denial of service that's targeted at the application itself is most important. Security and privacy are built into the Azure platform, beginning with the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl). The SDL addresses security at every development phase and ensures that Azure is continually updated to make it even more secure.

**Best practice**: Design your applications to [scale horizontally](/azure/architecture/guide/design-principles/scale-out) to meet the demand of an amplified load, specifically in the event of a DDoS attack. If your application depends on a single instance of a service, it creates a single point of failure. Provisioning multiple instances makes your system more resilient and more scalable.  
**Detail**: For [Azure App Service](../../app-service/overview.md), select an [App Service plan](../../app-service/overview-hosting-plans.md) that offers multiple instances.

For Azure Cloud Services, configure each of your roles to use [multiple instances](../../cloud-services/cloud-services-choose-me.md).

For [Azure Virtual Machines](../../virtual-machines/windows/overview.md), ensure that your VM architecture includes more than one VM and that each VM is included in an [availability set](../../virtual-machines/windows/tutorial-availability-sets.md). We recommend using Virtual Machine Scale Sets for autoscaling capabilities.

**Best practice**: Layering security defenses in an application reduces the chance of a successful attack. Implement secure designs for your applications by using the built-in capabilities of the Azure platform.  
**Detail**: The risk of attack increases with the size (surface area) of the application. You can reduce the surface area by using an approval list to close down the exposed IP address space and listening ports that are not needed on the load balancers ([Azure Load Balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md) and [Azure Application Gateway](../../application-gateway/application-gateway-create-probe-portal.md)).

[Network security groups](../../virtual-network/network-security-groups-overview.md) are another way to reduce the attack surface. You can use [service tags](../../virtual-network/network-security-groups-overview.md#service-tags) and [application security groups](../../virtual-network/network-security-groups-overview.md#application-security-groups) to minimize complexity for creating security rules and configuring network security, as a natural extension of an application’s structure.

You should deploy Azure services in a [virtual network](../../virtual-network/virtual-networks-overview.md) whenever possible. This practice allows service resources to communicate through private IP addresses. Azure service traffic from a virtual network uses public IP addresses as source IP addresses by default.

Using [service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) switches service traffic to use virtual network private addresses as the source IP addresses when they're accessing the Azure service from a virtual network.

We often see customers' on-premises resources getting attacked along with their resources in Azure. If you're connecting an on-premises environment to Azure, minimize exposure of on-premises resources to the public internet.

Azure has two DDoS [service offerings](../../ddos-protection/ddos-protection-overview.md) that provide protection from network attacks:

- Basic protection is integrated into Azure by default at no additional cost. The scale and capacity of the globally deployed Azure network provides defense against common network-layer attacks through always-on traffic monitoring and real-time mitigation. Basic requires no user configuration or application changes and helps protect all Azure services, including PaaS services like Azure DNS.
- Standard protection provides advanced DDoS mitigation capabilities against network attacks. It's automatically tuned to protect your specific Azure resources. Protection is simple to enable during the creation of virtual networks. It can also be done after creation and requires no application or resource changes.

## Enable Azure Policy
[Azure Policy](../../governance/policy/overview.md) is a service in Azure that you use to create, assign, and manage policies. These policies enforce rules and effects over your resources, so those resources stay compliant with your corporate standards and service-level agreements. Azure Policy meets this need by evaluating your resources for non-compliance with assigned policies.

Enable Azure Policy to monitor and enforce your organization’s written policy. This will ensure compliance with your company or regulatory security requirements by centrally managing security policies across your hybrid cloud workloads. Learn how to [create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md). See [Azure Policy definition structure](../../governance/policy/concepts/definition-structure.md) for an overview of the elements of a policy.

Here are some security best practices to follow after you adopt Azure Policy:

**Best practice**: Policy supports several types of effects. You can read about them in [Azure Policy definition structure](../../governance/policy/concepts/definition-structure.md#policy-rule). Business operations can be negatively affected by the **deny** effect and the **remediate** effect, so start with the **audit** effect to limit the risk of negative impact from policy.   
**Detail**: [Start policy deployments in audit mode](../../governance/policy/concepts/definition-structure.md#policy-rule) and then later progress to **deny** or **remediate**. Test and review the results of the audit effect before you move to **deny** or **remediate**.

For more information, see [Create and manage policies to enforce compliance](../../governance/policy/tutorials/create-and-manage.md).

**Best practice**: Identify the roles responsible for monitoring for policy violations and ensuring the right remediation action is taken quickly.   
**Detail**: Have the assigned role monitor compliance through the [Azure portal](../../governance/policy/how-to/get-compliance-data.md#portal) or via the [command line](../../governance/policy/how-to/get-compliance-data.md#command-line).

**Best practice**: Azure Policy is a technical representation of an organization's written policies. Map all Azure Policy definitions to organizational policies to reduce confusion and increase consistency.   
**Detail**: Document mapping in your organization's documentation or in the Azure Policy definition itself by adding a reference to the organizational policy in the [policy definition](../../governance/policy/concepts/definition-structure.md#display-name-and-description) or the [initiative definition](../../governance/policy/concepts/initiative-definition-structure.md#metadata) description.

<a name='monitor-azure-ad-risk-reports'></a>

## Monitor Microsoft Entra risk reports
The vast majority of security breaches take place when attackers gain access to an environment by stealing a user’s identity. Discovering compromised identities is no easy task. Microsoft Entra ID uses adaptive machine learning algorithms and heuristics to detect suspicious actions that are related to your user accounts. Each detected suspicious action is stored in a record called a [risk detection](../../active-directory/identity-protection/overview-identity-protection.md). Risk detections are recorded in Microsoft Entra security reports. For more information, read about the [users at risk security report](../../active-directory/identity-protection/overview-identity-protection.md) and the [risky sign-ins security report](../../active-directory/identity-protection/overview-identity-protection.md).

## Next steps
See [Azure security best practices and patterns](best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:
* [Azure Security Team Blog](/archive/blogs/azuresecurity/) - for up to date information on the latest in Azure Security
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com
