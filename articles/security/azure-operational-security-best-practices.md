---

title: Azure Operational Security best practices| Microsoft Docs
description: This article provides a set of best practices for Azure Operational Security.
services: security
documentationcenter: na
author: TerryLanfear
manager: mbaldwin
editor: tomsh

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/20/2018
ms.author: terrylan

---

# Azure Operational Security best practices
Azure operational security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Azure. Azure operational security is built on a framework that incorporates the knowledge gained through capabilities that are unique to Microsoft, including the [Security Development Lifecycle (SDL)](https://www.microsoft.com/sdl), the [Microsoft Security Response Center](https://www.microsoft.com/msrc?rtc=1) program, and deep awareness of the cybersecurity threat landscape.

In this article, we discuss a collection of security best practices. These best practices are derived from our experience with Azure database security and the experiences of customers like yourself.

For each best practice, we explain:
-	What the best practice is
-	Why you want to enable that best practice
-	What might be the result if you fail to enable the best practice
- How you can learn to enable the best practice

This Azure Operational Security Best Practices article is based on a consensus opinion, and Azure platform capabilities and feature sets, as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

## Monitor storage services for unexpected changes in behavior
Diagnosing and troubleshooting issues in a distributed application hosted in a cloud environment can be more complex than it is in traditional environments. Applications can be deployed in a PaaS or IaaS infrastructure, on-premises, on a mobile device, or in some combination of these environments. Your application's network traffic might traverse public and private networks, and your application might use multiple storage technologies.

You should continuously monitor the storage services that your application uses for any unexpected changes in behavior (such as slower response times). Use logging to collect more detailed data and to analyze a problem in depth. The diagnostics information that you obtain from both monitoring and logging helps you to determine the root cause of the issue that your application encountered. Then you can troubleshoot the issue and determine the appropriate steps to remediate it.

[Azure Storage Analytics](../storage/storage-analytics.md) performs logging and provides metrics data for an Azure storage account. We recommend that you use this data to trace requests, analyze usage trends, and diagnose issues with your storage account.

## Prevent, detect, and respond to threats
[Azure Security Center](../security-center/security-center-intro.md) helps you prevent, detect, and respond to threats with increased visibility into (and control over) the security of your Azure resources. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with various security solutions.

Security Center’s Free tier offers limited security for your Azure resources only. The Standard tier extends these capabilities to on-premises and other clouds. Security Center Standard helps you find and fix security vulnerabilities, apply access and application controls to block malicious activity, detect threats using analytics and intelligence, and respond quickly when under attack. You can try Security Center Standard at no cost for the first 60 days. We recommend that you [onboard your Azure subscription to Security Center Standard](../security-center/security-center-get-started.md).

Use Security Center to get a central view of the security state of all of your Azure resources. At a glance, verify that the appropriate security controls are in place and configured correctly, and quickly identify any resources that need attention.

## Monitor end-to-end scenario-based network monitoring
Customers build an end-to-end network in Azure by combining network resources like a virtual network, ExpressRoute, Application Gateway, and load balancers. Monitoring is available on each of the network resources.

[Azure Network Watcher](../network-watcher/network-watcher-monitoring-overview.md) is a regional service. Use its diagnostic and visualization tools to monitor and diagnose conditions at a network scenario level in, to, and from Azure.

The following are best practices for network monitoring and available tools.

**Best practice**: Automate remote network monitoring with packet capture.   
**Detail**: Monitor and diagnose networking issues without logging in to your VMs by using Network Watcher. Trigger [packet capture](../network-watcher/network-watcher-alert-triggered-packet-capture.md) by setting alerts and gain access to real-time performance information at the packet level. When you see an issue, you can investigate in detail for better diagnoses.

**Best practice**: Gain insight into your network traffic by using flow logs.   
**Detail**: Build a deeper understanding of your network traffic patterns by using [network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-overview.md). Information in flow logs helps you gather data for compliance, auditing, and monitoring your network security profile.

**Best practice**: Diagnose VPN connectivity issues.   
**Detail**: Use Network Watcher to [diagnose your most common VPN Gateway and connection issues](../network-watcher/network-watcher-diagnose-on-premises-connectivity.md). You can not only identify the issue but also use detailed logs to further investigate.

## Secure deployment by using proven DevOps tools
Use the following DevOps best practices to ensure that your enterprise and teams are productive and efficient.

**Best practice**: Automate the build and deployment of services.   
**Detail**: [Infrastructure as code](https://en.wikipedia.org/wiki/Infrastructure_as_Code) is a set of techniques and practices that help IT pros remove the burden of day-to-day build and management of modular infrastructure. It enables IT pros to build and maintain their modern server environment in a way that’s like how software developers build and maintain application code.

You can use [Azure Resource Manager](https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/) to provision your applications by using a declarative template. In a single template, you can deploy multiple services along with their dependencies. You use the same template to repeatedly deploy your application in every stage of the application lifecycle.

**Best practice**: Automatically build and deploy to Azure web apps or cloud services.   
**Detail**: You can configure your Visual Studio Team Services (VSTS) team projects to [automatically build and deploy](https://www.visualstudio.com/docs/build/overview) to Azure web apps or cloud services. VSTS automatically deploys the binaries after doing a build to Azure after every code check-in. The package build process is equivalent to the Package command in Visual Studio, and the publishing steps are equivalent to the Publish command in Visual Studio.

**Best practice**: Automate release management.   
**Detail**: Visual Studio [Release Management](https://msdn.microsoft.com/library/vs/alm/release/overview) is a solution for automating multiple-stage deployment and managing the release process. Create managed continuous deployment pipelines to release quickly, easily, and often. With Release Management, you can automate your release process, and you can have predefined approval workflows. Deploy on-premises and to the cloud, extend, and customize as required.

**Best practice**: Check your app's performance before you launch it or deploy updates to production.   
**Detail**: Run cloud-based [load tests](https://www.visualstudio.com/docs/test/performance-testing/getting-started/getting-started-with-performance-testing) by using VSTS to:

- Find performance problems in your app.
- Improve deployment quality.
- Make sure that your app is always available.
- Make sure that your app can handle traffic for your next launch or marketing campaign.

**Best practice**: Monitor application performance.   
**Detail**: [Azure Application Insights](../application-insights/app-insights-overview.md) is an extensible application performance management (APM) service for web developers on multiple platforms. Use Application Insights to monitor your live web application. It automatically detects performance anomalies. It includes analytics tools to help you diagnose issues and to understand what users actually do with your app. It's designed to help you continuously improve performance and usability.

## Mitigate and protect against DDoS
Distributed denial of service (DDoS) is a type of attack that tries to exhaust application resources. The goal is to affect the application’s availability and its ability to handle legitimate requests. These attacks are becoming more sophisticated and larger in size and impact. They can be targeted at any endpoint that is publicly reachable through the internet.

Designing and building for DDoS resiliency requires planning and designing for a variety of failure modes.

Following are best practices for building DDoS-resilient services on Azure.

**Best practice**: Ensure that security is a priority throughout the entire lifecycle of an application, from design and implementation to deployment and operations. Applications can have bugs that allow a relatively low volume of requests to use a lot of resources, resulting in a service outage.    
**Detail**: To help protect a service running on Microsoft Azure, you should have a good understanding of your application architecture and focus on the [five pillars of software quality](https://docs.microsoft.com/azure/architecture/guide/pillars). You should know typical traffic volumes, the connectivity model between the application and other applications, and the service endpoints that are exposed to the public internet.

Ensuring that an application is resilient enough to handle a denial of service that's targeted at the application itself is most important. Security and privacy are built into the Azure platform, beginning with the [Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/sdl). The SDL addresses security at every development phase and ensures that Azure is continually updated to make it even more secure.

**Best practice**: Design your applications to [scale horizontally](https://docs.microsoft.com/azure/architecture/guide/design-principles/scale-out) to meet the demand of an amplified load, specifically in the event of a DDoS attack. If your application depends on a single instance of a service, it creates a single point of failure. Provisioning multiple instances makes your system more resilient and more scalable.   
**Detail**: For [Azure App Service](../app-service/app-service-value-prop-what-is.md), select an [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md) that offers multiple instances.

For Azure Cloud Services, configure each of your roles to use [multiple instances](../cloud-services/cloud-services-choose-me.md).

For [Azure Virtual Machines](../virtual-machines/windows/overview.md), ensure that your VM architecture includes more than one VM and that each VM is included in an [availability set](../virtual-machines/virtual-machines-windows-manage-availability.md). We recommend using virtual machine scale sets for autoscaling capabilities.

**Best practice**: Layering security defenses in an application reduces the chance of a successful attack. Implement secure designs for your applications by using the built-in capabilities of the Azure platform.   
**Detail**: The risk of attack increases with the size (surface area) of the application. You can reduce the surface area by using whitelisting to close down the exposed IP address space and listening ports that are not needed on the load balancers ([Azure Load Balancer](../load-balancer/load-balancer-get-started-internet-portal.md) and [Azure Application Gateway](../application-gateway/application-gateway-create-probe-portal.md)).

[Network security groups](../virtual-network/security-overview.md) are another way to reduce the attack surface. You can use [service tags](../virtual-network/security-overview.md#service-tags) and [application security groups](../virtual-network/security-overview.md#application-security-groups) to minimize complexity for creating security rules and configuring network security, as a natural extension of an application’s structure.

You should deploy Azure services in a [virtual network](../virtual-network/virtual-networks-overview.md) whenever possible. This practice allows service resources to communicate through private IP addresses. Azure service traffic from a virtual network uses public IP addresses as source IP addresses by default.

Using [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) switches service traffic to use virtual network private addresses as the source IP addresses when they're accessing the Azure service from a virtual network.

We often see customers' on-premises resources getting attacked along with their resources in Azure. If you're connecting an on-premises environment to Azure, minimize exposure of on-premises resources to the public internet.

Azure has two DDoS [service offerings](../virtual-network/ddos-protection-overview.md) that provide protection from network attacks:

- Basic protection is integrated into Azure by default at no additional cost. The scale and capacity of the globally deployed Azure network provides defense against common network-layer attacks through always-on traffic monitoring and real-time mitigation. Basic requires no user configuration or application changes and helps protect all Azure services, including PaaS services like Azure DNS.
- Standard protection provides advanced DDoS mitigation capabilities against network attacks. It's automatically tuned to protect your specific Azure resources. Protection is simple to enable during the creation of virtual networks. It can also be done after creation and requires no application or resource changes.

## Next steps
See [Azure security best practices and patterns](security-best-practices-and-patterns.md) for more security best practices to use when you’re designing, deploying, and managing your cloud solutions by using Azure.

The following resources are available to provide more general information about Azure security and related Microsoft services:
* [Azure Security Team Blog](https://blogs.msdn.microsoft.com/azuresecurity/) - for up to date information on the latest in Azure Security
* [Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx) - where Microsoft security vulnerabilities, including issues with Azure, can be reported or via email to secure@microsoft.com
