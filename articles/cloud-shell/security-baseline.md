---
title: Azure security baseline for Cloud Shell
description: The Cloud Shell security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Cloud Shell

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../security/benchmarks/overview-v1.md) to Cloud Shell. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Cloud Shell. **Controls** not applicable to Cloud Shell have been excluded.

 
To see how Cloud Shell completely maps to the Azure
Security Benchmark, see the [full Cloud Shell security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: Customers may deploy Azure Cloud Shell into a customer owned Virtual Network.

When you deploy Azure Cloud Shell into a customer owned Virtual Network, you must create or use an existing virtual network. Ensure that the chosen virtual network has a network security group applied to its subnets and network access controls configured specific to your application's trusted ports and sources.

- [Deploy Cloud Shell into an Azure virtual network](private-vnet.md)

- [How to create a network security group with security rules](../virtual-network/tutorial-filter-network-traffic.md)

- [How to deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that uses the same authorization that is used to access the Azure portal, in this case an SSO into the Azure portal will also authenticate you with Cloud Shell.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that uses the same authorization that is used to access the Azure portal, in this case any multifactor authentication that is required to connect to the Azure portal will also be required for Cloud Shell.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images are monitored and updated by the Cloud Shell team.

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to run automated vulnerability scanning tools against software that are running in the environment.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy an automated patch management solution for third-party software titles

**Guidance**: Not applicable; Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images are monitored and updated by the Cloud Shell team.

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible for software patch management running in their environment.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images are monitored and updated by the Cloud Shell team.

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to remediate vulnerabilities that are discovered through their software vulnerability scans. Export scan results at consistent intervals and compare the results with previous scans to verify that vulnerabilities have been remediated. When using vulnerability management recommendations suggested by Azure Security Center, you can pivot into the selected solution's portal to view historical scan data.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images are monitored and updated by the Cloud Shell team.

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to remediate vulnerabilities that are discovered through their software vulnerability scans.  Use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool. 

- [NIST Publication--Common Vulnerability Scoring System](https://www.nist.gov/publications/common-vulnerability-scoring-system)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images and tools are monitored and updated by the Cloud Shell team.  The customer is able to install their own tools in their own image per their organizational needs and the tools does not require `sudo` permissions during install.

Customers are recommended to create an inventory of approved software that is installed through Azure Cloud Shell as per your organizational needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Azure Cloud Shell is a free service with no customer owned assets.  The container images and tools are monitored and updated by the Cloud Shell team. 

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to monitor software applications running in the environment to make sure they are approved per organization policy.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Azure Cloud Shell is a free service with no customer owned assets.  The container images and tools are monitored and updated by the Cloud Shell team. 

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to monitor software applications running in the environment to make sure unapproved software are managed per organization policy.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Azure Cloud Shell is a free service with no customer owned assets.  The container images and tools are monitored and updated by the Cloud Shell team.  Specific tools may not be removed by the customer.

Azure Cloud Shell allows customers to install their own tools or applications in their own image per their organizational needs.

Customers are responsible to monitor applications running in the environment to make sure they are approved per organization policy.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Not applicable; Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images are monitored and updated by the Cloud Shell team.

Azure Cloud Shell allows customers to install their own tools or software in their own image per their organizational needs.

Customers are responsible to maintain an inventory of approved software running in the environment to make sure they are approved software per organization policy.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Actions that are taken within Cloud Shell function the same as actions taken from the same tools or languages run in a local environment.  Actions from individual tools and languages should be restricted, customers cannot restrict access to Cloud Shell or restrict what is available to a user.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Azure Cloud Shell can be isolated in a customer virtual network.

- [Deploy Cloud Shell into an Azure virtual network](private-vnet.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.13: Eliminate unintended credential exposure

**Guidance**: Cloud Shell allows for scripts to be run in, authored in, and uploaded to the Cloud Shell environment.  Moving credentials into Azure Key Vault is our recommendation.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images and tools are monitored and updated by the Cloud Shell team.  The customer is able to install their own tools in their own image per their organizational needs and the tools does not require `sudo` permissions during install.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

**Guidance**: Azure Cloud Shell is a browser-based command-line experience that is used for interactive management of cloud resources.  Each customer container is ephemeral a new container is used for each session.  The container images and tools are monitored and updated by the Cloud Shell team.  The customer is able to install their own tools in their own image per their organizational needs and the tools does not require `sudo` permissions during install.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md) 

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/) 

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytically used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md) 

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

- [Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts to Azure Sentinel.

- [How to configure continuous export](../security-center/continuous-export.md) 

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
