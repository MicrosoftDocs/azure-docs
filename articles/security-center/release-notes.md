---
title: Release notes for Azure Security Center
description: A description of what's new and changed in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/22/2020
ms.author: memildin

---

# What's new in Azure Security Center?

Security Center is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often. 

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).


## October 2020

### Vulnerability assessment for on-premise and multi-cloud machines (Preview)

[Azure Defender for servers](defender-for-servers-introduction.md)' integrated vulnerability assessment scanner (powered by Qualys) now scans Azure Arc enabled servers.

When you've enabled Azure Arc on your non-Azure machines, Security Center will offer to deploy the integrated vulnerability scanner on them - manually and at-scale.

With this update, you can unleash the power of **Azure Defender for servers** to consolidate your vulnerability management program across all of your Azure and non-Azure assets.

Main capabilities:

- Monitoring the VA (vulnerability assessment) scanner provisioning state on Azure Arc machines
- Provisioning the integrated VA agent to unprotected Windows and Linux Azure Arc machines (manually and at-scale)
- Receiving and analyzing detected vulnerabilities from deployed agents (manually and at-scale)
- Unified experience for Azure VMs and Azure Arc machines

[Learn more about deploying the integrated vulnerability scanner to your hybrid machines](https://docs.microsoft.com/azure/security-center/deploy-vulnerability-assessment-vm#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines).

[Learn more about Azure Arc enabled servers](https://docs.microsoft.com/azure/azure-arc/servers/).



## September 2020

Updates in September include:
- [Security Center gets a new look!](#security-center-gets-a-new-look)
- [Azure Defender released](#azure-defender-released)
- [Azure Defender for Key Vault is generally available](#azure-defender-for-key-vault-is-generally-available)
- [Azure Defender for Storage protection for Files and ADLS Gen2 is generally available](#azure-defender-for-storage-protection-for-files-and-adls-gen2-is-generally-available)
- [Asset inventory tools are now generally available](#asset-inventory-tools-are-now-generally-available)
- [Disable a specific vulnerability finding for scans of container registries and virtual machines](#disable-a-specific-vulnerability-finding-for-scans-of-container-registries-and-virtual-machines)
- [Exempt a resource from a recommendation](#exempt-a-resource-from-a-recommendation)
- [AWS and GCP connectors in Security Center bring a multi-cloud experience](#aws-and-gcp-connectors-in-security-center-bring-a-multi-cloud-experience)
- [Kubernetes workload protection recommendation bundle](#kubernetes-workload-protection-recommendation-bundle)
- [IoT threat protection enhancements in Azure Defender for IoT](#iot-threat-protection-enhancements-in-azure-defender-for-iot)
- [Vulnerability assessment findings are now available in continuous export](#vulnerability-assessment-findings-are-now-available-in-continuous-export)
- [Prevent security misconfigurations by enforcing recommendations when creating new resources](#prevent-security-misconfigurations-by-enforcing-recommendations-when-creating-new-resources)
- [Network security group recommendations improved](#network-security-group-recommendations-improved)
- [Deprecated preview AKS recommendation "Pod Security Policies should be defined on Kubernetes Services"](#deprecated-preview-aks-recommendation-pod-security-policies-should-be-defined-on-kubernetes-services)
- [Email notifications from Azure Security Center improved](#email-notifications-from-azure-security-center-improved)
- [Secure score doesn't include preview recommendations](#secure-score-doesnt-include-preview-recommendations)
- [Recommendations now include a severity indicator and the freshness interval](#recommendations-now-include-a-severity-indicator-and-the-freshness-interval)


### Security Center gets a new look!

We've released a refreshed UI for Security Center's portal pages. The new pages include a new overview page as well as dashboards for secure score, asset inventory, and Azure Defender.

The redesigned overview page now has a tile for accessing the secure score, asset inventory, and Azure Defender dashboards. It also has a tile linking to the regulatory compliance dashboard.

Learn more about the [overview page](overview-page.md).


### Azure Defender released

**Azure Defender** is the cloud workload protection platform (CWPP) integrated within Security Center for advanced, intelligent, protection of your Azure and hybrid workloads. It replaces Security Center's standard pricing tier option. 

When you enable Azure Defender from the **Pricing and settings** area of Azure Security Center, the following Defender plans are all enabled simultaneously and provide comprehensive defenses for the compute, data, and service layers of your environment:

- [Azure Defender for servers](defender-for-servers-introduction.md)
- [Azure Defender for App Service](defender-for-app-service-introduction.md)
- [Azure Defender for Storage](defender-for-storage-introduction.md)
- [Azure Defender for SQL](defender-for-sql-introduction.md)
- [Azure Defender for IoT](defender-for-iot-introduction.md)
- [Azure Defender for Key Vault](defender-for-key-vault-introduction.md)
- [Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Azure Defender for container registries](defender-for-container-registries-introduction.md)

Each of these plans is explained separately in the Security Center documentation.

With its dedicated dashboard, Azure Defender provides security alerts and advanced threat protection for virtual machines, SQL databases, containers, web applications, your network, and more.

[Learn more about Azure Defender](azure-defender.md)

### Azure Defender for Key Vault is generally available

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. 

**Azure Defender for Key Vault** provides Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence. By extension, Azure Defender for Key Vault is consequently protecting many of the resources dependent upon your Key Vault accounts.

The optional plan is now GA. This feature was in preview as "advanced threat protection for Azure Key Vault".

Also, the Key Vault pages in the Azure portal now include a dedicated **Security** page for **Security Center** recommendations and alerts.

Learn more in [Azure Defender for Key Vault](defender-for-key-vault-introduction.md).


### Azure Defender for Storage protection for Files and ADLS Gen2 is generally available 

**Azure Defender for Storage** detects potentially harmful activity on your Azure Storage accounts. Your data can be protected whether it's stored as blob containers, file shares, or data lakes.

Support for [Azure Files](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and [Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-introduction) is now generally available.

From 1st October 2020, we'll begin charging for protecting resources on these services.

Learn more in [Azure Defender for Storage](defender-for-storage-introduction.md).


### Asset inventory tools are now generally available

The asset inventory page of Azure Security Center provides a single page for viewing the security posture of the resources you've connected to Security Center.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

When any resource has outstanding recommendations, they'll appear in the inventory.

Learn more in [Explore and manage your resources with asset inventory and management tools](asset-inventory.md).



### Disable a specific vulnerability finding for scans of container registries and virtual machines

Azure Defender includes vulnerability scanners to scan images in your Azure Container Registry and your virtual machines.

If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

When a finding matches the criteria you've defined in your disable rules, it won't appear in the list of findings.

This option is available from the recommendations details pages for:

- **Vulnerabilities in Azure Container Registry images should be remediated**
- **Vulnerabilities in your virtual machines should be remediated**

Learn more in [Disable specific findings for your container images](defender-for-container-registries-usage.md#disable-specific-findings-preview) and [Disable specific findings for your virtual machines](remediate-vulnerability-findings-vm.md#disable-specific-findings-preview).


### Exempt a resource from a recommendation

Occasionally, a resource will be listed as unhealthy regarding a specific recommendation (and therefore lowering your secure score) even though you feel it shouldn't be. It might have been remediated by a process not tracked by Security Center. Or perhaps your organization has decided to accept the risk for that specific resource. 

In such cases, you can create an exemption rule and ensure that resource isn't listed amongst the unhealthy resources in the future. These rules can include documented justifications as described below.

Learn more in [Exempt a resource from recommendations and secure score](exempt-resource.md).


### AWS and GCP connectors in Security Center bring a multi-cloud experience

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Azure Security Center now protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

Onboarding your AWS and GCP accounts into Security Center, integrates AWS Security Hub, GCP Security Command and Azure Security Center. 

Learn more in [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md) and [Connect your GCP accounts to Azure Security Center](quickstart-onboard-gcp.md).


### Kubernetes workload protection recommendation bundle

To ensure that Kubernetes workloads are secure by default, Security Center is adding Kubernetes level hardening recommendations, including enforcement options with Kubernetes admission control.

When you've installed the Azure Policy add-on for Kubernetes on your AKS cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices before being persisted to the cluster. You can then configure to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Workload protection best-practices using Kubernetes admission control](container-security.md#workload-protection-best-practices-using-kubernetes-admission-control).


### IoT threat protection enhancements in Azure Defender for IoT

Azure Defender for IoT brings more threat protection capabilities thanks to the inclusion of CyberX Agentless Technology. This brings security protections for unmanaged brownfield devices used in Operational Technology (OT) environments such as manufacturing, building management systems (BMS), life sciences, energy and water utilities, oil & gas, and logistics.

Learn more in [Introduction to Azure Defender for IoT](defender-for-iot-introduction.md).


### Vulnerability assessment findings are now available in continuous export

Use continuous export to stream your alerts and recommendations in real time to Azure Event Hubs, Log Analytics workspaces, or Azure Monitor. From there, you can integrate this data with SIEMs (such as Azure Sentinel, Power BI, Azure Data Explorer, and more.

Security Center's integrated vulnerability assessment tools return findings about your resources as actionable recommendations within a 'parent' recommendation such as "Vulnerabilities in your virtual machines should be remediated". 

The security findings are now available for export through continuous export when you select recommendations and enable the **include security findings** option.

:::image type="content" source="./media/continuous-export/include-security-findings-toggle.png" alt-text="Include security findings toggle in continuous export configuration" :::

Related pages:

- [Security Center's integrated vulnerability assessment solution for Azure virtual machines](deploy-vulnerability-assessment-vm.md)
- [Security Center's integrated vulnerability assessment solution for Azure Container Registry images](defender-for-container-registries-usage.md)
- [Continuous export](continuous-export.md)

### Prevent security misconfigurations by enforcing recommendations when creating new resources

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regards to specific recommendations. 

This feature can help keep your workloads secure and stabilize your secure score.

Enforcing a secure configuration, based on a specific recommendation, is offered in two modes:

- Using the **Deny** effect of Azure Policy, you can stop unhealthy resources from being created

- Using the **Enforce** option, you can take advantage of Azure policy's **DeployIfNotExist** effect and automatically remediate non-compliant resources upon creation
 
This is available for selected security recommendations and can be found at the top of the resource details page.

Learn more in [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).

###  Network security group recommendations improved

The following security recommendations related to network security groups have been improved to reduce some instances of false positives.

- All network ports should be restricted on NSG associated to your VM
- Management ports should be closed on your virtual machines
- Internet-facing virtual machines should be protected with Network Security Groups
- Subnets should be associated with a Network Security Group


### Deprecated preview AKS recommendation "Pod Security Policies should be defined on Kubernetes Services"

The preview recommendation "Pod Security Policies should be defined on Kubernetes Services" is being deprecated as described in the [Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/use-pod-security-policies) documentation.

The pod security policy (preview) feature, is set for deprecation and will no longer be available after October 15th, 2020 in favor of Azure Policy for AKS.

After pod security policy (preview) is deprecated, you must disable the feature on any existing clusters using the deprecated feature to perform future cluster upgrades and stay within Azure support.


### Email notifications from Azure Security Center improved

The following areas of the emails regarding security alerts have been improved: 

- Added the ability to send email notifications about alerts for all severity levels
- Added the ability to notify users with different RBAC roles on the subscription
- We're proactively notifying subscription owners by default on high-severity alerts (which have a high-probability of being genuine breaches)
- We've removed the phone number field from the email notifications configuration page

Learn more in [Set up email notifications for security alerts](security-center-provide-security-contact-details.md).


### Secure score doesn't include preview recommendations 

Security Center continually assesses your resources, subscriptions, and organization for security issues. It then aggregates all the findings into a single score so that you can tell, at a glance, your current security situation: the higher the score, the lower the identified risk level.

As new threats are discovered, new security advice is made available in Security Center through new recommendations. To avoid surprise changes your secure score, and to provide a grace period in which you can explore new recommendations before they impact your scores, recommendations flagged as **Preview** are no longer included in the calculations of your secure score. They should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

Also, **Preview** recommendations don't render a resource "Unhealthy".

An example of a preview recommendation:

:::image type="content" source="./media/secure-score-security-controls/example-of-preview-recommendation.png" alt-text="Recommendation with the preview flag":::

[Learn more about secure score](secure-score-security-controls.md).


### Recommendations now include a severity indicator and the freshness interval

The details page for recommendations now includes a freshness interval indicator (whenever relevant) and a clear display of the severity of the recommendation.

:::image type="content" source="./media/release-notes/recommendations-severity-freshness-indicators.png" alt-text="Recommendation page showing freshness and severity":::



## August 2020

Updates in August include:

- [Asset inventory - powerful new view of the security posture of your assets](#asset-inventory---powerful-new-view-of-the-security-posture-of-your-assets)
- [Added support for Azure Active Directory security defaults (for multi-factor authentication)](#added-support-for-azure-active-directory-security-defaults-for-multi-factor-authentication)
- [Service principals recommendation added](#service-principals-recommendation-added)
- [Vulnerability assessment on VMs - recommendations and policies consolidated](#vulnerability-assessment-on-vms---recommendations-and-policies-consolidated)
- [New AKS security policies added to ASC_default initiative – for use by private preview customers only](#new-aks-security-policies-added-to-asc_default-initiative--for-use-by-private-preview-customers-only)


### Asset inventory - powerful new view of the security posture of your assets

Security Center's asset inventory (currently in preview) provides a way to view the security posture of the resources you've connected to Security Center.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities. When any resource has outstanding recommendations, they'll appear in the inventory.

You can use the view and its filters to explore your security posture data and take further actions based on your findings.

Learn more about [asset inventory](asset-inventory.md).


### Added support for Azure Active Directory security defaults (for multi-factor authentication)

Security Center has added full support for [security defaults](https://docs.microsoft.com/azure/active-directory/fundamentals/concept-fundamentals-security-defaults), Microsoft’s free identity security protections.

Security defaults provide preconfigured identity security settings to defend your organization from common identity-related attacks. Security defaults already protecting more than 5 million tenants overall; 50,000 tenants are also protected by Security Center.

Security Center now provides a security recommendation whenever it identifies an Azure subscription without security defaults enabled. Until now, Security Center recommended enabling multi-factor authentication using conditional access, which is part of the Azure Active Directory (AD) premium license. For customers using Azure AD free, we now recommend enabling security defaults. 

Our goal is to encourage more customers to secure their cloud environments with MFA, and mitigate one of the highest risks that is also the most impactful to your [secure score](secure-score-security-controls.md).

Learn more about [security defaults](https://docs.microsoft.com/azure/active-directory/fundamentals/concept-fundamentals-security-defaults).


### Service principals recommendation added

A new recommendation has been added to recommend that Security Center customers using management certificates to manage their subscriptions switch to service principals.

The recommendation, **Service principals should be used to protect your subscriptions instead of Management Certificates** advises you to use Service Principals or Azure Resource Manager to more securely manage your subscriptions. 

Learn more about [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).


### Vulnerability assessment on VMs - recommendations and policies consolidated

Security Center inspects your VMs to detect whether they're running a vulnerability assessment solution. If no vulnerability assessment solution is found, Security Center provides a recommendation to simplify the deployment.

When vulnerabilities are found, Security Center provides a recommendation summarizing the findings for you to investigate and remediate as necessary.

To ensure a consistent experience for all users, regardless of the scanner type they're using, we've unified four recommendations into the following two:

|Unified recommendation|Change description|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**|Replaces the following two recommendations:<br> **•** Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys (now deprecated) (Included with standard tier)<br> **•** Vulnerability assessment solution should be installed on your virtual machines (now deprecated) (Standard and free tiers)|
|**Vulnerabilities in your virtual machines should be remediated**|Replaces the following two recommendations:<br>**•** Remediate vulnerabilities found on your virtual machines (powered by Qualys) (now deprecated)<br>**•** Vulnerabilities should be remediated by a Vulnerability Assessment solution (now deprecated)|
|||

Now you'll use the same recommendation to deploy Security Center's vulnerability assessment extension or a  privately licensed solution ("BYOL") from a partner such as Qualys or Rapid7.

Also, when vulnerabilities are found and reported to Security Center, a single recommendation will alert you to the findings regardless of the vulnerability assessment solution that identified them.

#### Updating dependencies

If you have scripts, queries, or automations referring to the previous recommendations or policy keys/names, use the tables below to update the references:

##### Before August 2020

|Recommendation|Scope|
|----|:----|
|**Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys)**<br>Key: 550e890b-e652-4d22-8274-60b3bdb24c63|Built-in|
|**Remediate vulnerabilities found on your virtual machines (powered by Qualys)**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in|
|**Vulnerability assessment solution should be installed on your virtual machines**<br>Key: 01b1ed4c-b733-4fee-b145-f23236e70cf3|BYOL|
|**Vulnerabilities should be remediated by a Vulnerability Assessment solution**<br>Key: 71992a2a-d168-42e0-b10e-6b45fa2ecddb|BYOL|
||||


|Policy|Scope|
|----|:----|
|**Vulnerability assessment should be enabled on virtual machines**<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9|Built-in|
|**Vulnerabilities should be remediated by a vulnerability assessment solution**<br>Policy ID: 760a85ff-6162-42b3-8d70-698e268f648c|BYOL|
||||


##### From August 2020

|Recommendation|Scope|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**<br>Key: ffff0522-1e88-47fc-8382-2a80ba848f5d|Built-in + BYOL|
|**Vulnerabilities in your virtual machines should be remediated**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in + BYOL|
||||

|Policy|Scope|
|----|:----|
|[**Vulnerability assessment should be enabled on virtual machines**](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f501541f7-f7e7-4cd6-868c-4190fdad3ac9)<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9 |Built-in + BYOL|
||||


### New AKS security policies added to ASC_default initiative – for use by private preview customers only

To ensure that Kubernetes workloads are secure by default, Security Center is adding Kubernetes level policies and  hardening recommendations, including enforcement options with Kubernetes admission control.

The early phase of this project includes a private preview and the addition of new (disabled by default) policies to the ASC_default initiative.

You can safely ignore these policies and there will be no impact on your environment. If you'd like to enable them, sign up for the preview at https://aka.ms/SecurityPrP and select from the following options:

1. **Single Preview** – To join only this private preview. Explicitly mention “ASC Continuous Scan” as the preview you would like to join.
1. **Ongoing Program** – To be added to this and future private previews. You will need to complete a profile and privacy agreement.


## July 2020

Updates in July include:
- [Vulnerability assessment for virtual machines is now available for non-marketplace images](#vulnerability-assessment-for-virtual-machines-is-now-available-for-non-marketplace-images)
- [Threat protection for Azure Storage expanded to include Azure Files and Azure Data Lake Storage Gen2 (preview)](#threat-protection-for-azure-storage-expanded-to-include-azure-files-and-azure-data-lake-storage-gen2-preview)
- [Eight new recommendations to enable threat protection features](#eight-new-recommendations-to-enable-threat-protection-features)
- [Container security improvements - faster registry scanning and refreshed documentation](#container-security-improvements---faster-registry-scanning-and-refreshed-documentation)
- [Adaptive application controls updated with a new recommendation and support for wildcards in path rules](#adaptive-application-controls-updated-with-a-new-recommendation-and-support-for-wildcards-in-path-rules)
- [Six policies for SQL advanced data security deprecated](#six-policies-for-sql-advanced-data-security-deprecated)




### Vulnerability assessment for virtual machines is now available for non-marketplace images

When deploying a vulnerability assessment solution, Security Center previously performed a validation check before deploying. The check was to confirm a marketplace SKU of the destination virtual machine. 

From this update, the check has been removed and you can now deploy vulnerability assessment tools to 'custom' Windows and Linux machines. Custom images are ones that you've modified from the marketplace defaults.

Although you can now deploy the integrated vulnerability assessment extension (powered by Qualys) on many more machines, support is only available if you're using an OS listed in [Deploy the integrated vulnerability scanner to standard tier VMs](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines)

Learn more about the [integrated vulnerability scanner for virtual machines (requires Azure Defender)](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner).

Learn more about using your own privately-licensed vulnerability assessment solution from Qualys or Rapid7 in [Deploying a partner vulnerability scanning solution](deploy-vulnerability-assessment-vm.md).


### Threat protection for Azure Storage expanded to include Azure Files and Azure Data Lake Storage Gen2 (preview)

Threat protection for Azure Storage detects potentially harmful activity on your Azure Storage accounts. Security Center displays alerts when it detects attempts to access or exploit your storage accounts. 

Your data can be protected whether it's stored as blob containers, file shares, or data lakes.




### Eight new recommendations to enable threat protection features

Eight new recommendations have been added to provide a simple way to enable Azure Security Center's threat protection features for the following resource types: virtual machines, App Service plans, Azure SQL Database servers, SQL servers on machines, Azure Storage accounts, Azure Kubernetes Service clusters, Azure Container Registry registries, and Azure Key Vault vaults.

The new recommendations are:

- **Advanced data security should be enabled on Azure SQL Database servers**
- **Advanced data security should be enabled on SQL servers on machines**
- **Advanced threat protection should be enabled on Azure App Service plans**
- **Advanced threat protection should be enabled on Azure Container Registry registries**
- **Advanced threat protection should be enabled on Azure Key Vault vaults**
- **Advanced threat protection should be enabled on Azure Kubernetes Service clusters**
- **Advanced threat protection should be enabled on Azure Storage accounts**
- **Advanced threat protection should be enabled on virtual machines**

These new recommendations belong to the **Enable Advanced Threat Protection** security control.

The recommendations also include the quick fix capability. 

> [!IMPORTANT]
> Remediating any of these recommendations will result in charges for protecting the relevant resources. These charges will begin immediately if you have related resources in the current subscription. Or in the future, if you add them at a later date.
> 
> For example, if you don't have any Azure Kubernetes Service clusters in your subscription and you enable the threat protection, no charges will be incurred. If, in the future, you add a cluster on the same subscription, it will automatically be protected and charges will begin at that time.

Learn more about each of these in the [security recommendations reference page](recommendations-reference.md).

Learn more about [threat protection in Azure Security Center](azure-defender.md).




### Container security improvements - faster registry scanning and refreshed documentation

As part of the continuous investments in the container security domain, we are happy to share a significant performance improvement in Security Center's dynamic scans of container images stored in Azure Container Registry. Scans now typically complete in approximately two minutes. In some cases, they might take up to 15 minutes.

To improve the clarity and guidance regarding Azure Security Center's container security capabilities, we've also refreshed the container security documentation pages. 

Learn more about Security Center's container security in the following articles:

- [Overview of Security Center's container security features](container-security.md)
- [Details of the integration with Azure Container Registry](defender-for-container-registries-introduction.md)
- [Details of the integration with Azure Kubernetes Service](defender-for-kubernetes-introduction.md)
- [How-to scan your registries and harden your Docker hosts](container-security.md)
- [Security alerts from the threat protection features for Azure Kubernetes Service clusters](alerts-reference.md#alerts-akscluster)
- [Security alerts from the threat protection features for Azure Kubernetes Service hosts](alerts-reference.md#alerts-containerhost)
- [Security recommendations for containers](recommendations-reference.md#recs-containers)



### Adaptive application controls updated with a new recommendation and support for wildcards in path rules

The adaptive application controls feature has received two significant updates:

* A new recommendation identifies potentially legitimate behavior that hasn't previously been allowed. The new recommendation, **Allowlist rules in your adaptive application control policy should be updated**, prompts you to add new rules to the existing policy to reduce the number of false positives in adaptive application controls violation alerts.

* Path rules now support wildcards. From this update, you can configure allowed path rules using wildcards. There are two supported scenarios:

    * Using a wildcard at the end of a path to allow all executables within this folder and sub-folders

    * Using a wildcard in the middle of a path to enable a known executable name with a changing folder name (e.g. personal user folders with an known executable, automatically generated folder names, etc.).


[Learn more about adaptive application controls](security-center-adaptive-application.md).



### Six policies for SQL advanced data security deprecated

Six policies related to advanced data security for SQL machines are being deprecated:

- Advanced threat protection types should be set to 'All' in SQL managed instance advanced data security settings
- Advanced threat protection types should be set to 'All' in SQL server advanced data security settings
- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings

Learn more about [built-in policies](security-center-policy-definitions.md).





## June 2020

Updates in June include:
- [Secure score API (preview)](#secure-score-api-preview)
- [Advanced data security for SQL machines (Azure, other clouds, and on-prem) (preview)](#advanced-data-security-for-sql-machines-azure-other-clouds-and-on-prem-preview)
- [Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)](#two-new-recommendations-to-deploy-the-log-analytics-agent-to-azure-arc-machines-preview)
- [New policies to create continuous export and workflow automation configurations at scale](#new-policies-to-create-continuous-export-and-workflow-automation-configurations-at-scale)
- [New recommendation for using NSGs to protect non-internet-facing virtual machines](#new-recommendation-for-using-nsgs-to-protect-non-internet-facing-virtual-machines)
- [New policies for enabling threat protection and advanced data security](#new-policies-for-enabling-threat-protection-and-advanced-data-security)



### Secure score API (preview)

You can now access your score via the [secure score API](https://docs.microsoft.com/rest/api/securitycenter/securescores/) (currently in preview). The API methods provide the flexibility to query the data and build your own reporting mechanism of your secure scores over time. For example, you can use the **Secure Scores** API to get the score for a specific subscription. In addition, you can use the **Secure Score Controls** API to list the security controls and the current score of your subscriptions.

For examples of external tools made possible with the secure score API, see [the secure score area of our GitHub community](https://github.com/Azure/Azure-Security-Center/tree/master/Secure%20Score).

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).



### Advanced data security for SQL machines (Azure, other clouds, and on-prem) (preview)

Azure Security Center's advanced data security for SQL machines now protects SQL Servers hosted in Azure, on other cloud environments, and even on-premises machines. This extends the protections for your Azure-native SQL Servers to fully support hybrid environments.

Advanced data security provides vulnerability assessment and advanced threat protection for your SQL machines wherever they're located.

Set up involves two steps:

1. Deploying the Log Analytics agent to your SQL Server's host machine to provide the connection to Azure account.

1. Enabling the optional bundle in Security Center's pricing and settings page.

Learn more about [advanced data security for SQL machines](defender-for-sql-usage.md).



### Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)

Two new recommendations have been added to help deploy the [Log Analytics Agent](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent) to your Azure Arc machines and ensure they're protected by Azure Security Center:

- **Log Analytics agent should be installed on your Windows-based Azure Arc machines (Preview)**
- **Log Analytics agent should be installed on your Linux-based Azure Arc machines (Preview)**

These new recommendations will appear in the same four security controls as the existing (related) recommendation, **Monitoring agent should be installed on your machines**: remediate security configurations, apply adaptive application control, apply system updates, and enable endpoint protection.

The recommendations also include the Quick fix capability to help speed up the deployment process. 

Learn more about these two new recommendations in the [Compute and app recommendations](recommendations-reference.md#recs-computeapp) table.

Learn more about how Azure Security Center uses the agent in [What is the Log Analytics agent?](faq-data-collection-agents.md#what-is-the-log-analytics-agent).

Learn more about [extensions for Azure Arc machines](../azure-arc/servers/manage-vm-extensions.md#enable-extensions-from-the-portal).


### New policies to create continuous export and workflow automation configurations at scale

Automating your organization's monitoring and incident response processes can greatly improve the time it takes to investigate and mitigate security incidents.

To deploy your automation configurations across your organization, use these built-in 'DeployIfdNotExist' Azure policies to create and configure [continuous export](continuous-export.md) and [workflow automation](workflow-automation.md) procedures:

The policies can be found in Azure policy:


|Goal  |Policy  |Policy ID  |
|---------|---------|---------|
|Continuous export to event hub|[Deploy export to Event Hub for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcdfcce10-4578-4ecd-9703-530938e4abcb)|cdfcce10-4578-4ecd-9703-530938e4abcb|
|Continuous export to Log Analytics workspace|[Deploy export to Log Analytics workspace for Azure Security Center alerts and recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fffb6f416-7bd2-4488-8828-56585fef2be9)|ffb6f416-7bd2-4488-8828-56585fef2be9|
|Workflow automation for security alerts|[Deploy Workflow Automation for Azure Security Center alerts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff1525828-9a90-4fcf-be48-268cdd02361e)|f1525828-9a90-4fcf-be48-268cdd02361e|
|Workflow automation for security recommendations|[Deploy Workflow Automation for Azure Security Center recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-2475-4850-afd6-43795f3492ef)|73d6ab6c-2475-4850-afd6-43795f3492ef|
||||

Get started with [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).

Learn more about using the two export policies in [Continuously Export Azure Security Center Alerts and Recommendations via Policy](https://techcommunity.microsoft.com/t5/azure-security-center/continuously-export-azure-security-center-alerts-and/ba-p/1440745).


### New recommendation for using NSGs to protect non-internet-facing virtual machines

The "implement security best practices" security control now includes the following new recommendation:

- **Non-internet-facing virtual machines should be protected with network security groups**

An existing recommendation, **Internet-facing virtual machines should be protected with network security groups**, didn't distinguish between internet-facing and non-internet facing VMs. For both, a high-severity recommendation was generated if a VM wasn't assigned to a network security group. This new recommendation separates the non-internet-facing machines to reduce the false positives and avoid unnecessary high-severity alerts.

Learn more in the [Network recommendations](recommendations-reference.md#recs-network) table.




### New policies for enabling threat protection and advanced data security

The new policies below were added to the ASC Default initiative and are designed to assist with enabling threat protection or advanced data security for the relevant resource types.

The policies can be found in Azure policy:


| Policy                                                                                                                                                                                                                                                                | Policy ID                            |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| [Advanced data security should be enabled on Azure SQL Database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7fe3b40f-802b-4cdd-8bd4-fd799c948cc2)     | 7fe3b40f-802b-4cdd-8bd4-fd799c948cc2 |
| [Advanced data security should be enabled on SQL servers on machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6581d072-105e-4418-827f-bd446d56421b) | 6581d072-105e-4418-827f-bd446d56421b |
| [Advanced threat protection should be enabled on Azure Storage accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f308fbb08-4ab8-4e67-9b29-592e93fb94fa)           | 308fbb08-4ab8-4e67-9b29-592e93fb94fa |
| [Advanced threat protection should be enabled on Azure Key Vault vaults](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0e6763cc-5078-4e64-889d-ff4d9a839047)           | 0e6763cc-5078-4e64-889d-ff4d9a839047 |
| [Advanced threat protection should be enabled on Azure App Service plans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2913021d-f2fd-4f3d-b958-22354e2bdbcb)                | 2913021d-f2fd-4f3d-b958-22354e2bdbcb |
| [Advanced threat protection should be enabled on Azure Container Registry registries](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc25d9a16-bc35-4e15-a7e5-9db606bf9ed4)   | c25d9a16-bc35-4e15-a7e5-9db606bf9ed4 |
| [Advanced threat protection should be enabled on Azure Kubernetes Service clusters](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f523b5cd1-3e23-492f-a539-13118b6d1e3a)   | 523b5cd1-3e23-492f-a539-13118b6d1e3a |
| [Advanced threat protection should be enabled on Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f4da35fc9-c9e7-4960-aec9-797fe7d9051d)           | 4da35fc9-c9e7-4960-aec9-797fe7d9051d |
|                                                                                                                                                                                                                                                                       |                                      |

Learn more about [Threat protection in Azure Security Center](azure-defender.md).





## May 2020

Updates in May include:
- [Alert suppression rules (preview)](#alert-suppression-rules-preview)
- [Virtual machine vulnerability assessment is now generally available](#virtual-machine-vulnerability-assessment-is-now-generally-available)
- [Changes to just-in-time (JIT) virtual machine (VM) access](#changes-to-just-in-time-jit-virtual-machine-vm-access)
- [Custom recommendations have been moved to a separate security control](#custom-recommendations-have-been-moved-to-a-separate-security-control)
- [Toggle added to view recommendations in controls or as a flat list](#toggle-added-to-view-recommendations-in-controls-or-as-a-flat-list)
- [Expanded security control "Implement security best practices"](#expanded-security-control-implement-security-best-practices)
- [Custom policies with custom metadata are now generally available](#custom-policies-with-custom-metadata-are-now-generally-available)
- [Crash dump analysis capabilities migrating to fileless attack detection](#crash-dump-analysis-capabilities-migrating-to-fileless-attack-detection)


### Alert suppression rules (preview)

This new feature (currently in preview) helps reduce alert fatigue. Use rules to automatically hide alerts that are known to be innocuous or related to normal activities in your organization. This lets you focus on the most relevant threats. 

Alerts that match your enabled suppression rules will still be generated, but their state will be set to dismissed. You can see the state in the Azure portal or however you access your Security Center security alerts.

Suppression rules define the criteria for which alerts should be automatically dismissed. Typically, you'd use a suppression rule to:

- suppress alerts that you've identified as false positives

- suppress alerts that are being triggered too often to be useful

Learn more about [suppressing alerts from Azure Security Center's threat protection](alerts-suppression-rules.md).


### Virtual machine vulnerability assessment is now generally available

Security Center's standard tier now includes an integrated vulnerability assessment for virtual machines for no additional fee. This extension is powered by Qualys but reports its findings directly back to Security Center. You don't need a Qualys license or even a Qualys account - everything's handled seamlessly inside Security Center.

The new solution can continuously scan your virtual machines to find vulnerabilities and present the findings in Security Center. 

To deploy the solution, use the new security recommendation:

"Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys)"

Learn more about [Security Center's integrated vulnerability assessment for virtual machines](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner).



### Changes to just-in-time (JIT) virtual machine (VM) access

Security Center includes an optional feature to protect the management ports of your VMs. This provides a defense against the most common form of brute force attacks.

This update brings the following changes to this feature:

- The recommendation that advises you to enable JIT on a VM has been renamed. Formerly, "Just-in-time network access control should be applied on virtual machines" it's now: "Management ports of virtual machines should be protected with just-in-time network access control".

- The recommendation is triggered only if there are open management ports.

Learn more about [the JIT access feature](security-center-just-in-time.md).


### Custom recommendations have been moved to a separate security control

One security control introduced with the enhanced secure score was "Implement security best practices". Any custom recommendations created for your subscriptions were automatically placed in that control. 

To make it easier to find your custom recommendations, we've moved them into a dedicated security control, "Custom recommendations". This control has no impact on your secure score.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).


### Toggle added to view recommendations in controls or as a flat list

Security controls are logical groups of related security recommendations. They reflect your vulnerable attack surfaces. A control is a set of security recommendations, with instructions that help you implement those recommendations.

To immediately see how well your organization is securing each individual attack surface, review the scores for each security control.

By default, your recommendations are shown in the security controls. From this update, you can also display them as a list. To view them as simple list sorted by the health status of the affected resources, use the new toggle 'Group by controls'. The toggle is above the list in the portal.

The security controls - and this toggle - are part of the new secure score experience. Remember to send us your feedback from within the portal.

Learn more about security controls in [Enhanced secure score (preview) in Azure Security Center](secure-score-security-controls.md).

:::image type="content" source="./media/secure-score-security-controls/recommendations-group-by-toggle.gif" alt-text="Group by controls toggle for recommendations":::

### Expanded security control "Implement security best practices" 

One security control introduced with the enhanced secure score is "Implement security best practices". When a recommendation is in this control, it doesn't impact the secure score. 

With this update, three recommendations have moved out of the controls in which they were originally placed, and into this best practices control. We've taken this step because we've determined that the risk of these three recommendations is lower than was initially thought.

In addition, two new recommendations have been introduced and added to this control.

The three recommendations that moved are:

- **MFA should be enabled on accounts with read permissions on your subscription** (originally in the "Enable MFA" control)
- **External accounts with read permissions should be removed from your subscription** (originally in the "Manage access and permissions" control)
- **A maximum of 3 owners should be designated for your subscription** (originally in the "Manage access and permissions" control)

The two new recommendations added to the control are:

- **Guest configuration extension should be installed on Windows virtual machines (Preview)** - Using [Azure Policy Guest Configuration](https://docs.microsoft.com/azure/governance/policy/concepts/guest-configuration) provides visibility inside virtual machines to server and application settings (Windows only).

- **Windows Defender Exploit Guard should be enabled on your machines (Preview)** - Windows Defender Exploit Guard leverages the Azure Policy Guest Configuration agent. Exploit Guard has four components that are designed to lock down devices against a wide variety of attack vectors and block behaviors commonly used in malware attacks while enabling enterprises to balance their security risk and productivity requirements  (Windows only).

Learn more about Windows Defender Exploit Guard in [Create and deploy an Exploit Guard policy](https://docs.microsoft.com/mem/configmgr/protect/deploy-use/create-deploy-exploit-guard-policy).

Learn more about security controls in [Enhanced secure score (preview)](secure-score-security-controls.md).



### Custom policies with custom metadata are now generally available

Custom policies are now part of the Security Center recommendations experience, secure score, and the regulatory compliance standards dashboard. This feature is now generally available and allows you to extend your organization's security assessment coverage in Security Center. 

Create a custom initiative in Azure policy, add policies to it and onboard it to Azure Security Center, and visualize it as recommendations.

We've now also added the option to edit the custom recommendation metadata. Metadata options include severity, remediation steps, threats information, and more.  

Learn more about [enhancing your custom recommendations with detailed information](custom-security-policies.md#enhance-your-custom-recommendations-with-detailed-information).



### Crash dump analysis capabilities migrating to fileless attack detection 

We are integrating the Windows crash dump analysis (CDA) detection capabilities into [fileless attack detection](defender-for-servers-introduction.md#what-are-the-benefits-of-azure-defender-for-servers). Fileless attack detection analytics brings improved versions of the following security alerts for Windows machines: Code injection discovered, Masquerading Windows Module Detected, Shellcode discovered, and Suspicious code segment detected.

Some of the benefits of this transition:

- **Proactive and timely malware detection** - The CDA approach involved waiting for a crash to occur and then running analysis to find malicious artifacts. Using fileless attack detection brings proactive identification of in-memory threats while they are running. 

- **Enriched alerts** - The security alerts from fileless attack detection include enrichments that aren't available from CDA, such as the active network connections information. 

- **Alert aggregation** - When CDA detected multiple attack patterns within a single crash dump, it triggered multiple security alerts. Fileless attack detection combines all of the identified attack patterns from the same process into a single alert, removing the need to correlate multiple alerts.

- **Reduced requirements on your Log Analytics workspace** - Crash dumps containing potentially sensitive data will no longer be uploaded to your Log Analytics workspace.