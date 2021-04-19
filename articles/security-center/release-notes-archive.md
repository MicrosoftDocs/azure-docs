---
title: Archive of what's new in Azure Security Center
description: A description of what's new and changed in Azure Security Center from six months ago and earlier.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: reference
ms.date: 04/04/2021
ms.author: memildin

---

# Archive for what's new in Azure Security Center?

The primary [What's new in Azure Security Center?](release-notes.md) release notes page contains updates for the last six months, while this page contains older items.

This page provides you with information about:

- New features
- Bug fixes
- Deprecated functionality


## October 2020

Updates in October include:
- [Vulnerability assessment for on-premise and multi-cloud machines (preview)](#vulnerability-assessment-for-on-premise-and-multi-cloud-machines-preview)
- [Azure Firewall recommendation added (preview)](#azure-firewall-recommendation-added-preview)
- [Authorized IP ranges should be defined on Kubernetes Services recommendation updated with quick fix](#authorized-ip-ranges-should-be-defined-on-kubernetes-services-recommendation-updated-with-quick-fix)
- [Regulatory compliance dashboard now includes option to remove standards](#regulatory-compliance-dashboard-now-includes-option-to-remove-standards)
- [Microsoft.Security/securityStatuses table removed from Azure Resource Graph (ARG)](#microsoftsecuritysecuritystatuses-table-removed-from-azure-resource-graph-arg)

### Vulnerability assessment for on-premise and multi-cloud machines (preview)

[Azure Defender for servers](defender-for-servers-introduction.md)' integrated vulnerability assessment scanner (powered by Qualys) now scans Azure Arc enabled servers.

When you've enabled Azure Arc on your non-Azure machines, Security Center will offer to deploy the integrated vulnerability scanner on them - manually and at-scale.

With this update, you can unleash the power of **Azure Defender for servers** to consolidate your vulnerability management program across all of your Azure and non-Azure assets.

Main capabilities:

- Monitoring the VA (vulnerability assessment) scanner provisioning state on Azure Arc machines
- Provisioning the integrated VA agent to unprotected Windows and Linux Azure Arc machines (manually and at-scale)
- Receiving and analyzing detected vulnerabilities from deployed agents (manually and at-scale)
- Unified experience for Azure VMs and Azure Arc machines

[Learn more about deploying the integrated vulnerability scanner to your hybrid machines](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines).

[Learn more about Azure Arc enabled servers](../azure-arc/servers/index.yml).


### Azure Firewall recommendation added (preview)

A new recommendation has been added to protect all your virtual networks with Azure Firewall.

The recommendation, **Virtual networks should be protected by Azure Firewall** advises you to restrict access to your virtual networks and prevent potential threats by using Azure Firewall.

Learn more about [Azure Firewall](https://azure.microsoft.com/services/azure-firewall/).


### Authorized IP ranges should be defined on Kubernetes Services recommendation updated with quick fix

The recommendation **Authorized IP ranges should be defined on Kubernetes Services** now has a quick fix option.

For more information about this recommendation and all other Security Center recommendations, see [Security recommendations - a reference guide](recommendations-reference.md).

:::image type="content" source="./media/release-notes/authorized-ip-ranges-recommendation.png" alt-text="The authorized IP ranges should be defined on Kubernetes Services recommendation with the quick fix option":::


### Regulatory compliance dashboard now includes option to remove standards

Security Center's regulatory compliance dashboard provides insights into your compliance posture based on how you're meeting specific compliance controls and requirements.

The dashboard includes a default set of regulatory standards. If any of the supplied standards isn't relevant to your organization, it's now a simple process to remove them from the UI for a subscription. Standards can be removed only at the *subscription* level; not the management group scope.

Learn more in [Remove a standard from your dashboard](update-regulatory-compliance-packages.md#remove-a-standard-from-your-dashboard).


### Microsoft.Security/securityStatuses table removed from Azure Resource Graph (ARG)

Azure Resource Graph is a service in Azure that is designed to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data. For example:

- Asset inventory utilizes (ARG)
- We have documented a sample ARG query for how to [Identify accounts without multi-factor authentication (MFA) enabled](security-center-identity-access.md#identify-accounts-without-multi-factor-authentication-mfa-enabled)

Within ARG, there are tables of data for you to use in your queries.

:::image type="content" source="./media/release-notes/azure-resource-graph-tables.png" alt-text="Azure Resource Graph Explorer and the available tables":::

> [!TIP]
> The ARG documentation lists all the available tables in [Azure Resource Graph table and resource type reference](../governance/resource-graph/reference/supported-tables-resources.md).

From this update, the **Microsoft.Security/securityStatuses** table has been removed. The securityStatuses API is still available.

Data replacement can be used by Microsoft.Security/Assessments table.

The major difference between Microsoft.Security/securityStatuses and Microsoft.Security/Assessments is that while the first shows aggregation of assessments, the seconds holds a single record for each.

For example, Microsoft.Security/securityStatuses would return a result with an array of two policyAssessments:

```
{
id: "/subscriptions/449bcidd-3470-4804-ab56-2752595 felab/resourceGroups/mico-rg/providers/Microsoft.Network/virtualNetworks/mico-rg-vnet/providers/Microsoft.Security/securityStatuses/mico-rg-vnet",
name: "mico-rg-vnet",
type: "Microsoft.Security/securityStatuses",
properties:  {
    policyAssessments: [
        {assessmentKey: "e3deicce-f4dd-3b34-e496-8b5381bazd7e", category: "Networking", policyName: "Azure DDOS Protection Standard should be enabled",...},
        {assessmentKey: "sefac66a-1ec5-b063-a824-eb28671dc527", category: "Compute", policyName: "",...}
    ],
    securitystateByCategory: [{category: "Networking", securityState: "None" }, {category: "Compute",...],
    name: "GenericResourceHealthProperties",
    type: "VirtualNetwork",
    securitystate: "High"
}
```
Whereas, Microsoft.Security/Assessments will hold a record for each such policy assessment as follows:

```
{
type: "Microsoft.Security/assessments",
id:  "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourceGroups/mico-rg/providers/Microsoft. Network/virtualNetworks/mico-rg-vnet/providers/Microsoft.Security/assessments/e3delcce-f4dd-3b34-e496-8b5381ba2d70",
name: "e3deicce-f4dd-3b34-e496-8b5381ba2d70",
properties:  {
    resourceDetails: {Source: "Azure", Id: "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourceGroups/mico-rg/providers/Microsoft.Network/virtualNetworks/mico-rg-vnet"...},
    displayName: "Azure DDOS Protection Standard should be enabled",
    status: (code: "NotApplicable", cause: "VnetHasNOAppGateways", description: "There are no Application Gateway resources attached to this Virtual Network"...}
}

{
type: "Microsoft.Security/assessments",
id:  "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourcegroups/mico-rg/providers/microsoft.network/virtualnetworks/mico-rg-vnet/providers/Microsoft.Security/assessments/80fac66a-1ec5-be63-a824-eb28671dc527",
name: "8efac66a-1ec5-be63-a824-eb28671dc527",
properties: {
    resourceDetails: (Source: "Azure", Id: "/subscriptions/449bc1dd-3470-4804-ab56-2752595f01ab/resourcegroups/mico-rg/providers/microsoft.network/virtualnetworks/mico-rg-vnet"...),
    displayName: "Audit diagnostic setting",
    status:  {code: "Unhealthy"}
}
```

**Example of converting an existing ARG query using securityStatuses to now use the assessments table:**

Query that references SecurityStatuses:

```kusto
SecurityResources 
| where type == 'microsoft.security/securitystatuses' and properties.type == 'virtualMachine'
| where name in ({vmnames}) 
| project name, resourceGroup, policyAssesments = properties.policyAssessments, resourceRegion = location, id, resourceDetails = properties.resourceDetails
```

Replacement query for the Assessments table:

```kusto
securityresources
| where type == "microsoft.security/assessments" and id contains "virtualMachine"
| extend resourceName = extract(@"(?i)/([^/]*)/providers/Microsoft.Security/assessments", 1, id)
| extend source = tostring(properties.resourceDetails.Source)
| extend resourceId = trim(" ", tolower(tostring(case(source =~ "azure", properties.resourceDetails.Id,
source =~ "aws", properties.additionalData.AzureResourceId,
source =~ "gcp", properties.additionalData.AzureResourceId,
extract("^(.+)/providers/Microsoft.Security/assessments/.+$",1,id)))))
| extend resourceGroup = tolower(tostring(split(resourceId, "/")[4]))
| where resourceName in ({vmnames}) 
| project resourceName, resourceGroup, resourceRegion = location, id, resourceDetails = properties.additionalData
```

Learn more at the following links:
- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)
- [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/)


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
- [Vulnerability assessment findings are now available in continuous export](#vulnerability-assessment-findings-are-now-available-in-continuous-export)
- [Prevent security misconfigurations by enforcing recommendations when creating new resources](#prevent-security-misconfigurations-by-enforcing-recommendations-when-creating-new-resources)
- [Network security group recommendations improved](#network-security-group-recommendations-improved)
- [Deprecated preview AKS recommendation "Pod Security Policies should be defined on Kubernetes Services"](#deprecated-preview-aks-recommendation-pod-security-policies-should-be-defined-on-kubernetes-services)
- [Email notifications from Azure Security Center improved](#email-notifications-from-azure-security-center-improved)
- [Secure score doesn't include preview recommendations](#secure-score-doesnt-include-preview-recommendations)
- [Recommendations now include a severity indicator and the freshness interval](#recommendations-now-include-a-severity-indicator-and-the-freshness-interval)


### Security Center gets a new look!

We've released a refreshed UI for Security Center's portal pages. The new pages include a new overview page and dashboards for secure score, asset inventory, and Azure Defender.

The redesigned overview page now has a tile for accessing the secure score, asset inventory, and Azure Defender dashboards. It also has a tile linking to the regulatory compliance dashboard.

Learn more about the [overview page](overview-page.md).


### Azure Defender released

**Azure Defender** is the cloud workload protection platform (CWPP) integrated within Security Center for advanced, intelligent, protection of your Azure and hybrid workloads. It replaces Security Center's standard pricing tier option. 

When you enable Azure Defender from the **Pricing and settings** area of Azure Security Center, the following Defender plans are all enabled simultaneously and provide comprehensive defenses for the compute, data, and service layers of your environment:

- [Azure Defender for servers](defender-for-servers-introduction.md)
- [Azure Defender for App Service](defender-for-app-service-introduction.md)
- [Azure Defender for Storage](defender-for-storage-introduction.md)
- [Azure Defender for SQL](defender-for-sql-introduction.md)
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

Support for [Azure Files](../storage/files/storage-files-introduction.md) and [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) is now generally available.

From 1 October 2020, we'll begin charging for protecting resources on these services.

Learn more in [Azure Defender for Storage](defender-for-storage-introduction.md).


### Asset inventory tools are now generally available

The asset inventory page of Azure Security Center provides a single page for viewing the security posture of the resources you've connected to Security Center.

Security Center periodically analyzes the security state of your Azure resources to identify potential security vulnerabilities. It then provides you with recommendations on how to remediate those vulnerabilities.

When any resource has outstanding recommendations, they'll appear in the inventory.

Learn more in [Explore and manage your resources with asset inventory](asset-inventory.md).



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

Security misconfigurations are a major cause of security incidents. Security Center now has the ability to help *prevent* misconfigurations of new resources with regard to specific recommendations. 

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

The preview recommendation "Pod Security Policies should be defined on Kubernetes Services" is being deprecated as described in the [Azure Kubernetes Service](../aks/use-pod-security-policies.md) documentation.

The pod security policy (preview) feature, is set for deprecation and will no longer be available after October 15, 2020 in favor of Azure Policy for AKS.

After pod security policy (preview) is deprecated, you must disable the feature on any existing clusters using the deprecated feature to perform future cluster upgrades and stay within Azure support.


### Email notifications from Azure Security Center improved

The following areas of the emails regarding security alerts have been improved: 

- Added the ability to send email notifications about alerts for all severity levels
- Added the ability to notify users with different Azure roles on the subscription
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

Security Center has added full support for [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md), Microsoft's free identity security protections.

Security defaults provide preconfigured identity security settings to defend your organization from common identity-related attacks. Security defaults already protecting more than 5 million tenants overall; 50,000 tenants are also protected by Security Center.

Security Center now provides a security recommendation whenever it identifies an Azure subscription without security defaults enabled. Until now, Security Center recommended enabling multi-factor authentication using conditional access, which is part of the Azure Active Directory (AD) premium license. For customers using Azure AD free, we now recommend enabling security defaults. 

Our goal is to encourage more customers to secure their cloud environments with MFA, and mitigate one of the highest risks that is also the most impactful to your [secure score](secure-score-security-controls.md).

Learn more about [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md).


### Service principals recommendation added

A new recommendation has been added to recommend that Security Center customers using management certificates to manage their subscriptions switch to service principals.

The recommendation, **Service principals should be used to protect your subscriptions instead of Management Certificates** advises you to use Service Principals or Azure Resource Manager to more securely manage your subscriptions. 

Learn more about [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md#service-principal-object).


### Vulnerability assessment on VMs - recommendations and policies consolidated

Security Center inspects your VMs to detect whether they're running a vulnerability assessment solution. If no vulnerability assessment solution is found, Security Center provides a recommendation to simplify the deployment.

When vulnerabilities are found, Security Center provides a recommendation summarizing the findings for you to investigate and remediate as necessary.

To ensure a consistent experience for all users, regardless of the scanner type they're using, we've unified four recommendations into the following two:

|Unified recommendation|Change description|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**|Replaces the following two recommendations:<br> ***** Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys (now deprecated) (Included with standard tier)<br> ***** Vulnerability assessment solution should be installed on your virtual machines (now deprecated) (Standard and free tiers)|
|**Vulnerabilities in your virtual machines should be remediated**|Replaces the following two recommendations:<br>***** Remediate vulnerabilities found on your virtual machines (powered by Qualys) (now deprecated)<br>***** Vulnerabilities should be remediated by a Vulnerability Assessment solution (now deprecated)|
|||

Now you'll use the same recommendation to deploy Security Center's vulnerability assessment extension or a  privately licensed solution ("BYOL") from a partner such as Qualys or Rapid7.

Also, when vulnerabilities are found and reported to Security Center, a single recommendation will alert you to the findings regardless of the vulnerability assessment solution that identified them.

#### Updating dependencies

If you have scripts, queries, or automations referring to the previous recommendations or policy keys/names, use the tables below to update the references:

##### Before August 2020

| Recommendation|Scope|
|----|:----|
|**Enable the built-in vulnerability assessment solution on virtual machines (powered by Qualys)**<br>Key: 550e890b-e652-4d22-8274-60b3bdb24c63|Built-in|
|**Remediate vulnerabilities found on your virtual machines (powered by Qualys)**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in|
|**Vulnerability assessment solution should be installed on your virtual machines**<br>Key: 01b1ed4c-b733-4fee-b145-f23236e70cf3|BYOL|
|**Vulnerabilities should be remediated by a Vulnerability Assessment solution**<br>Key: 71992a2a-d168-42e0-b10e-6b45fa2ecddb|BYOL|
|||


|Policy|Scope|
|----|:----|
|**Vulnerability assessment should be enabled on virtual machines**<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9|Built-in|
|**Vulnerabilities should be remediated by a vulnerability assessment solution**<br>Policy ID: 760a85ff-6162-42b3-8d70-698e268f648c|BYOL|
|||


##### From August 2020

|Recommendation|Scope|
|----|:----|
|**A vulnerability assessment solution should be enabled on your virtual machines**<br>Key: ffff0522-1e88-47fc-8382-2a80ba848f5d|Built-in + BYOL|
|**Vulnerabilities in your virtual machines should be remediated**<br>Key: 1195afff-c881-495e-9bc5-1486211ae03f|Built-in + BYOL|
|||

|Policy|Scope|
|----|:----|
|[**Vulnerability assessment should be enabled on virtual machines**](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f501541f7-f7e7-4cd6-868c-4190fdad3ac9)<br>Policy ID: 501541f7-f7e7-4cd6-868c-4190fdad3ac9 |Built-in + BYOL|
|||


### New AKS security policies added to ASC_default initiative – for use by private preview customers only

To ensure that Kubernetes workloads are secure by default, Security Center is adding Kubernetes level policies and  hardening recommendations, including enforcement options with Kubernetes admission control.

The early phase of this project includes a private preview and the addition of new (disabled by default) policies to the ASC_default initiative.

You can safely ignore these policies and there will be no impact on your environment. If you'd like to enable them, sign up for the preview at https://aka.ms/SecurityPrP and select from the following options:

1. **Single Preview** – To join only this private preview. Explicitly mention "ASC Continuous Scan" as the preview you would like to join.
1. **Ongoing Program** – To be added to this and future private previews. You'll need to complete a profile and privacy agreement.


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

These new recommendations belong to the **Enable Azure Defender** security control.

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
- [Security recommendations for containers](recommendations-reference.md#recs-compute)



### Adaptive application controls updated with a new recommendation and support for wildcards in path rules

The adaptive application controls feature has received two significant updates:

* A new recommendation identifies potentially legitimate behavior that hasn't previously been allowed. The new recommendation, **Allowlist rules in your adaptive application control policy should be updated**, prompts you to add new rules to the existing policy to reduce the number of false positives in adaptive application controls violation alerts.

* Path rules now support wildcards. From this update, you can configure allowed path rules using wildcards. There are two supported scenarios:

    * Using a wildcard at the end of a path to allow all executables within this folder and sub-folders

    * Using a wildcard in the middle of a path to enable a known executable name with a changing folder name (e.g. personal user folders with a known executable, automatically generated folder names, etc.).


[Learn more about adaptive application controls](security-center-adaptive-application.md).



### Six policies for SQL advanced data security deprecated

Six policies related to advanced data security for SQL machines are being deprecated:

- Advanced threat protection types should be set to 'All' in SQL managed instance advanced data security settings
- Advanced threat protection types should be set to 'All' in SQL server advanced data security settings
- Advanced data security settings for SQL managed instance should contain an email address to receive security alerts
- Advanced data security settings for SQL server should contain an email address to receive security alerts
- Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings
- Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings

Learn more about [built-in policies](./policy-reference.md).



## June 2020

Updates in June include:

- [Secure score API (preview)](#secure-score-api-preview)
- [Advanced data security for SQL machines (Azure, other clouds, and on-premises) (preview)](#advanced-data-security-for-sql-machines-azure-other-clouds-and-on-premises-preview)
- [Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)](#two-new-recommendations-to-deploy-the-log-analytics-agent-to-azure-arc-machines-preview)
- [New policies to create continuous export and workflow automation configurations at scale](#new-policies-to-create-continuous-export-and-workflow-automation-configurations-at-scale)
- [New recommendation for using NSGs to protect non-internet-facing virtual machines](#new-recommendation-for-using-nsgs-to-protect-non-internet-facing-virtual-machines)
- [New policies for enabling threat protection and advanced data security](#new-policies-for-enabling-threat-protection-and-advanced-data-security)



### Secure score API (preview)

You can now access your score via the [secure score API](/rest/api/securitycenter/securescores/) (currently in preview). The API methods provide the flexibility to query the data and build your own reporting mechanism of your secure scores over time. For example, you can use the **Secure Scores** API to get the score for a specific subscription. In addition, you can use the **Secure Score Controls** API to list the security controls and the current score of your subscriptions.

For examples of external tools made possible with the secure score API, see [the secure score area of our GitHub community](https://github.com/Azure/Azure-Security-Center/tree/master/Secure%20Score).

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).



### Advanced data security for SQL machines (Azure, other clouds, and on-premises) (preview)

Azure Security Center's advanced data security for SQL machines now protects SQL Servers hosted in Azure, on other cloud environments, and even on-premises machines. This extends the protections for your Azure-native SQL Servers to fully support hybrid environments.

Advanced data security provides vulnerability assessment and advanced threat protection for your SQL machines wherever they're located.

Set up involves two steps:

1. Deploying the Log Analytics agent to your SQL Server's host machine to provide the connection to Azure account.

1. Enabling the optional bundle in Security Center's pricing and settings page.

Learn more about [advanced data security for SQL machines](defender-for-sql-usage.md).



### Two new recommendations to deploy the Log Analytics agent to Azure Arc machines (preview)

Two new recommendations have been added to help deploy the [Log Analytics Agent](../azure-monitor/agents/log-analytics-agent.md) to your Azure Arc machines and ensure they're protected by Azure Security Center:

- **Log Analytics agent should be installed on your Windows-based Azure Arc machines (Preview)**
- **Log Analytics agent should be installed on your Linux-based Azure Arc machines (Preview)**

These new recommendations will appear in the same four security controls as the existing (related) recommendation, **Monitoring agent should be installed on your machines**: remediate security configurations, apply adaptive application control, apply system updates, and enable endpoint protection.

The recommendations also include the Quick fix capability to help speed up the deployment process. 

Learn more about these two new recommendations in the [Compute and app recommendations](recommendations-reference.md#recs-compute) table.

Learn more about how Azure Security Center uses the agent in [What is the Log Analytics agent?](faq-data-collection-agents.md#what-is-the-log-analytics-agent).

Learn more about [extensions for Azure Arc machines](../azure-arc/servers/manage-vm-extensions.md).


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

Learn more about using the two export policies in [Configure workflow automation at scale using the supplied policies](workflow-automation.md#configure-workflow-automation-at-scale-using-the-supplied-policies) and [Set up a continuous export](continuous-export.md#set-up-a-continuous-export).


### New recommendation for using NSGs to protect non-internet-facing virtual machines

The "implement security best practices" security control now includes the following new recommendation:

- **Non-internet-facing virtual machines should be protected with network security groups**

An existing recommendation, **Internet-facing virtual machines should be protected with network security groups**, didn't distinguish between internet-facing and non-internet facing VMs. For both, a high-severity recommendation was generated if a VM wasn't assigned to a network security group. This new recommendation separates the non-internet-facing machines to reduce the false positives and avoid unnecessary high-severity alerts.

Learn more in the [Network recommendations](recommendations-reference.md#recs-networking) table.




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

- **Guest configuration extension should be installed on Windows virtual machines (Preview)** - Using [Azure Policy Guest Configuration](../governance/policy/concepts/guest-configuration.md) provides visibility inside virtual machines to server and application settings (Windows only).

- **Windows Defender Exploit Guard should be enabled on your machines (Preview)** - Windows Defender Exploit Guard leverages the Azure Policy Guest Configuration agent. Exploit Guard has four components that are designed to lock down devices against a wide variety of attack vectors and block behaviors commonly used in malware attacks while enabling enterprises to balance their security risk and productivity requirements  (Windows only).

Learn more about Windows Defender Exploit Guard in [Create and deploy an Exploit Guard policy](/mem/configmgr/protect/deploy-use/create-deploy-exploit-guard-policy).

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






## April 2020

Updates in April include:
- [Dynamic compliance packages are now generally available](#dynamic-compliance-packages-are-now-generally-available)
- [Identity recommendations now included in Azure Security Center free tier](#identity-recommendations-now-included-in-azure-security-center-free-tier)


### Dynamic compliance packages are now generally available

The Azure Security Center regulatory compliance dashboard now includes **dynamic compliance packages** (now generally available) to track additional industry and regulatory standards.

Dynamic compliance packages can be added to your subscription or management group from the Security Center security policy page. When you've onboarded a standard or benchmark, the standard appears in your regulatory compliance dashboard with all associated compliance data mapped as assessments. A summary report for any of the standards that have been onboarded will be available to download.

Now, you can add standards such as:

- **NIST SP 800-53 R4**
- **SWIFT CSP CSCF-v2020**
- **UK Official and UK NHS**
- **Canada Federal PBMM**
- **Azure CIS 1.1.0 (new)** (which is a more complete representation of Azure CIS 1.1.0)

In addition, we've recently added the [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction), the Microsoft-authored Azure-specific guidelines for security and compliance best practices based on common compliance frameworks. Additional standards will be supported in the dashboard as they become available.  
 
Learn more about [customizing the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).


### Identity recommendations now included in Azure Security Center free tier

Security recommendations for identity and access on the Azure Security Center free tier are now generally available. This is part of the effort to make the cloud security posture management (CSPM) features free. Until now, these recommendations were only available on the standard pricing tier.

Examples of identity and access recommendations include:

- "Multifactor authentication should be enabled on accounts with owner permissions on your subscription."
- "A maximum of three owners should be designated for your subscription."
- "Deprecated accounts should be removed from your subscription."

If you have subscriptions on the free pricing tier, their secure scores will be impacted by this change because they were never assessed for their identity and access security.

Learn more about [identity and access recommendations](recommendations-reference.md#recs-identityandaccess).

Learn more about [Managing multi-factor authentication (MFA) enforcement on your subscriptions](security-center-identity-access.md).



## March 2020

Updates in March include:

- [Workflow automation is now generally available](#workflow-automation-is-now-generally-available)
- [Integration of Azure Security Center with Windows Admin Center](#integration-of-azure-security-center-with-windows-admin-center)
- [Protection for Azure Kubernetes Service](#protection-for-azure-kubernetes-service)
- [Improved just-in-time experience](#improved-just-in-time-experience)
- [Two security recommendations for web applications deprecated](#two-security-recommendations-for-web-applications-deprecated)


### Workflow automation is now generally available

The workflow automation feature of Azure Security Center is now generally available. Use it to automatically trigger Logic Apps on security alerts and recommendations. In addition, manual triggers are available for alerts and all recommendations that have the quick fix option available.

Every security program includes multiple workflows for incident response. These processes might include notifying relevant stakeholders, launching a change management process, and applying specific remediation steps. Security experts recommend that you automate as many steps of those procedures as you can. Automation reduces overhead and can improve your security by ensuring the process steps are done quickly, consistently, and according to your predefined requirements.

For more information about the automatic and manual Security Center capabilities for running your workflows, see [workflow automation](workflow-automation.md).

Learn more about [creating Logic Apps](../logic-apps/logic-apps-overview.md).


### Integration of Azure Security Center with Windows Admin Center

It's now possible to move your on-premises Windows servers from the Windows Admin Center directly to the Azure Security Center. Security Center then becomes your single pane of glass to view security information for all your Windows Admin Center resources, including on-premises servers, virtual machines, and additional PaaS workloads.

After moving a server from Windows Admin Center to Azure Security Center, you'll be able to:

- View security alerts and recommendations in the Security Center extension of the Windows Admin Center.
- View the security posture and retrieve additional detailed information of your Windows Admin Center managed servers in the Security Center within the Azure portal (or via an API).

Learn more about [how to integrate Azure Security Center with Windows Admin Center](windows-admin-center-integration.md).


### Protection for Azure Kubernetes Service

Azure Security Center is expanding its container security features to protect Azure Kubernetes Service (AKS).

The popular, open-source platform Kubernetes has been adopted so widely that it's now an industry standard for container orchestration. Despite this widespread implementation, there's still a lack of understanding regarding how to secure a Kubernetes environment. Defending the attack surfaces of a containerized application requires expertise to ensuring the infrastructure is configured securely and constantly monitored for potential threats.

The Security Center defense includes:

- **Discovery and visibility** - Continuous discovery of managed AKS instances within the subscriptions registered to Security Center.
- **Security recommendations** - Actionable recommendations to help you comply with security best-practices for AKS. These recommendations are included in your secure score to ensure they're viewed as a part of your organization's security posture. An example of an AKS-related recommendation you might see is "Role-based access control should be used to restrict access to a Kubernetes service cluster".
- **Threat protection** - Through continuous analysis of your AKS deployment, Security Center alerts you to threats and malicious activity detected at the host and AKS cluster level.

Learn more about [Azure Kubernetes Services' integration with Security Center](defender-for-kubernetes-introduction.md).

Learn more about [the container security features in Security Center](container-security.md).


### Improved just-in-time experience

The features, operation, and UI for Azure Security Center's just-in-time tools that secure your management ports have been enhanced as follows: 

- **Justification field** - When requesting access to a virtual machine (VM) through the just-in-time page of the Azure portal, a new optional field is available to enter a justification for the request. Information entered into this field can be tracked in the activity log. 
- **Automatic cleanup of redundant just-in-time (JIT) rules** - Whenever you update a JIT policy, a cleanup tool automatically runs to check the validity of your entire ruleset. The tool looks for mismatches between rules in your policy and rules in the NSG. If the cleanup tool finds a mismatch, it determines the cause and, when it's safe to do so, removes built-in rules that aren't needed anymore. The cleaner never deletes rules that you've created. 

Learn more about [the JIT access feature](security-center-just-in-time.md).


### Two security recommendations for web applications deprecated

Two security recommendations related to web applications are being deprecated: 

- The rules for web applications on IaaS NSGs should be hardened.
    (Related policy: The NSGs rules for web applications on IaaS should be hardened)

- Access to App Services should be restricted.
    (Related policy: Access to App Services should be restricted [preview])

These recommendations will no longer appear in the Security Center list of recommendations. The related policies will no longer be included in the initiative named "Security Center Default".

Learn more about [security recommendations](recommendations-reference.md).




## February 2020

### Fileless attack detection for Linux (preview)

As attackers increasing employ stealthier methods to avoid detection, Azure Security Center is extending fileless attack detection for Linux, in addition to Windows. Fileless attacks exploit software vulnerabilities, inject malicious payloads into benign system processes, and hide in memory. These techniques:

- minimize or eliminate traces of malware on disk
- greatly reduce the chances of detection by disk-based malware scanning solutions

To counter this threat, Azure Security Center released fileless attack detection for Windows in October 2018, and has now extended fileless attack detection on Linux as well. 



## January 2020

### Enhanced secure score (preview)

An enhanced version of the secure score feature of Azure Security Center is now available in preview. In this version, multiple recommendations are grouped into Security Controls that better reflect your vulnerable attack surfaces (for example, restrict access to management ports).

Familiarize yourself with the secure score changes during the preview phase and determine other remediations that will help you to further secure your environment.

Learn more about [enhanced secure score (preview)](secure-score-security-controls.md).



## November 2019

Updates in November include:
 - [Threat Protection for Azure Key Vault in North America regions (preview)](#threat-protection-for-azure-key-vault-in-north-america-regions-preview)
 - [Threat Protection for Azure Storage includes Malware Reputation Screening](#threat-protection-for-azure-storage-includes-malware-reputation-screening)
 - [Workflow automation with Logic Apps (preview)](#workflow-automation-with-logic-apps-preview)
 - [Quick Fix for bulk resources generally available](#quick-fix-for-bulk-resources-generally-available)
 - [Scan container images for vulnerabilities (preview)](#scan-container-images-for-vulnerabilities-preview)
 - [Additional regulatory compliance standards (preview)](#additional-regulatory-compliance-standards-preview)
 - [Threat Protection for Azure Kubernetes Service (preview)](#threat-protection-for-azure-kubernetes-service-preview)
 - [Virtual machine vulnerability assessment (preview)](#virtual-machine-vulnerability-assessment-preview)
 - [Advanced data security for SQL servers on Azure Virtual Machines (preview)](#advanced-data-security-for-sql-servers-on-azure-virtual-machines-preview)
 - [Support for custom policies (preview)](#support-for-custom-policies-preview)
 - [Extending Azure Security Center coverage with platform for community and partners](#extending-azure-security-center-coverage-with-platform-for-community-and-partners)
 - [Advanced integrations with export of recommendations and alerts (preview)](#advanced-integrations-with-export-of-recommendations-and-alerts-preview)
 - [Onboard on-prem servers to Security Center from Windows Admin Center (preview)](#onboard-on-prem-servers-to-security-center-from-windows-admin-center-preview)

### Threat Protection for Azure Key Vault in North America Regions (preview)

Azure Key Vault is an essential service for protecting data and improving performance of cloud applications by offering the ability to centrally manage keys, secrets, cryptographic keys and policies in the cloud. Since Azure Key Vault stores sensitive and business critical data, it requires maximum security for the key vaults and the data stored in them.

Azure Security Center's support for Threat Protection for Azure Key Vault provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit key vaults. This new layer of protection allows customers to address threats against their key vaults without being a security expert or manage security monitoring systems. The feature is in public preview in North America Regions.


### Threat Protection for Azure Storage includes Malware Reputation Screening

Threat protection for Azure Storage offers new detections powered by Microsoft Threat Intelligence for detecting malware uploads to Azure Storage using hash reputation analysis and suspicious access from an active Tor exit node (an anonymizing proxy). You can now view detected malware across storage accounts using Azure Security Center.


### Workflow automation with Logic Apps (preview)

Organizations with centrally managed security and IT/operations implement internal workflow processes to drive required action within the organization when discrepancies are discovered in their environments. In many cases, these workflows are repeatable processes and automation can greatly streamline processes within the organization.

Today we are introducing a new capability in Security Center that allows customers to create automation configurations leveraging Azure Logic Apps and to create policies that will automatically trigger them based on specific ASC findings such as Recommendations or Alerts. Azure Logic App can be configured to do any custom action supported by the vast community of Logic App connectors, or use one of the templates provided by Security Center such as sending an email or opening a ServiceNow&trade; ticket.

For more information about the automatic and manual Security Center capabilities for running your workflows, see [workflow automation](workflow-automation.md).

To learn about creating Logic Apps, see [Azure Logic Apps](../logic-apps/logic-apps-overview.md).


### Quick Fix for bulk resources generally available

With the many tasks that a user is given as part of Secure Score, the ability to effectively remediate issues across a large fleet can become challenging.

To simplify remediation of security misconfigurations and to be able to quickly remediate recommendations on a bulk of resources and improve your secure score, use Quick Fix remediation.

This operation will allow you to select the resources you want to apply the remediation to and launch a remediation action that will configure the setting on your behalf.

Quick fix is generally available today customers as part of the Security Center recommendations page.

See which recommendations have quick fix enabled in the [reference guide to security recommendations](recommendations-reference.md).


### Scan container images for vulnerabilities (preview)

Azure Security Center can now scan container images in Azure Container Registry for vulnerabilities.

The image scanning works by parsing the container image file, then checking to see whether there are any known vulnerabilities (powered by Qualys).

The scan itself is automatically triggered when pushing new container images to Azure Container Registry. Found vulnerabilities will surface as Security Center recommendations and included in the Azure Secure Score together with information on how to patch them to reduce the attack surface they allowed.


### Additional regulatory compliance standards (preview)

The Regulatory Compliance dashboard provides insights into your compliance posture based on Security Center assessments. The dashboard shows how your environment complies with controls and requirements designated by specific regulatory standards and industry benchmarks and provides prescriptive recommendations for how to address these requirements.

The regulatory compliance dashboard has thus far supported four built-in standards:  Azure CIS 1.1.0, PCI-DSS, ISO 27001, and SOC-TSP. We are now announcing the public preview release of additional supported standards: NIST SP 800-53 R4, SWIFT CSP CSCF v2020, Canada Federal PBMM and UK Official together with UK NHS. We are also releasing an updated version of Azure CIS 1.1.0, covering more controls from the standard and enhancing extensibility.

[Learn more about customizing the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).


### Threat Protection for Azure Kubernetes Service (preview)

Kubernetes is quickly becoming the new standard for deploying and managing software in the cloud. Few people have extensive experience with Kubernetes and many only focuses on general engineering and administration and overlook the security aspect. Kubernetes environment needs to be configured carefully to be secure, making sure no container focused attack surface doors are not left open is exposed for attackers. Security Center is expanding its support in the container space to one of the fastest growing services in Azure - Azure Kubernetes Service (AKS).

The new capabilities in this public preview release include:

- **Discovery & Visibility** - Continuous discovery of managed AKS instances within Security Center's registered subscriptions.
- **Secure Score recommendations** - Actionable items to help customers comply with security best practices for AKS, and increase their secure score. Recommendations include items such as "Role-based access control should be used to restrict access to a Kubernetes Service Cluster".
- **Threat Detection** - Host and cluster-based analytics, such as "A privileged container detected".


### Virtual machine vulnerability assessment (preview)

Applications that are installed in virtual machines could often have vulnerabilities that could lead to a breach of the virtual machine. We are announcing that the Security Center standard tier includes built-in vulnerability assessment for virtual machines for no additional fee. The vulnerability assessment, powered by Qualys in the public preview, will allow you to continuously scan all the installed applications on a virtual machine to find vulnerable applications and present the findings in the Security Center portal's experience. Security Center takes care of all deployment operations so that no extra work is required from the user. Going forward we are planning to provide vulnerability assessment options to support our customers' unique business needs.

[Learn more about vulnerability assessments for your Azure Virtual Machines](deploy-vulnerability-assessment-vm.md).


### Advanced data security for SQL servers on Azure Virtual Machines (preview)

Azure Security Center's support for threat protection and vulnerability assessment for SQL DBs running on IaaS VMs is now in preview.

[Vulnerability assessment](../azure-sql/database/sql-vulnerability-assessment.md) is an easy to configure service that can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security posture as part of Azure secure score and includes the steps to resolve security issues and enhance your database fortifications.

[Advanced threat protection](../azure-sql/database/threat-detection-overview.md) detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your SQL server. It continuously monitors your database for suspicious activities and provides action-oriented security alerts on anomalous database access patterns. These alerts provide the suspicious activity details and recommended actions to investigate and mitigate the threat.


### Support for custom policies (preview)

Azure Security Center now supports custom policies (in preview).

Our customers have been wanting to extend their current security assessments coverage in Security Center with their own security assessments based on policies that they create in Azure Policy. With support for custom policies, this is now possible.

These new policies will be part of the Security Center recommendations experience, Secure Score, and the regulatory compliance standards dashboard. With the support for custom policies, you're now able to create a custom initiative in Azure Policy, then add it as a policy in Security Center and visualize it as a recommendation.


### Extending Azure Security Center coverage with platform for community and partners

Use Security Center to receive recommendations not only from Microsoft but also from existing solutions from partners such as Check Point, Tenable, and CyberArk with many more integrations coming.  Security Center's simple onboarding flow can connect your existing solutions to Security Center, enabling you to view your security posture recommendations in a single place, run unified reports and leverage all of Security Center's capabilities against both built-in and partner recommendations. You can also export Security Center recommendations to partner products.

[Learn more about Microsoft Intelligent Security Association](https://www.microsoft.com/security/partnerships/intelligent-security-association).



### Advanced integrations with export of recommendations and alerts (preview)

In order to enable enterprise level scenarios on top of Security Center, it's now possible to consume Security Center alerts and recommendations in additional places except the Azure portal or API. These can be directly exported to an Event Hub and to Log Analytics workspaces. Here are a few workflows you can create around these new capabilities:

- With export to Log Analytics workspace, you can create custom dashboards with Power BI.
- With export to Event Hub, you'll be able to export Security Center alerts and recommendations to your third-party SIEMs, to a third-party solution in real time, or Azure Data Explorer.


### Onboard on-prem servers to Security Center from Windows Admin Center (preview)

Windows Admin Center is a management portal for Windows Servers who are not deployed in Azure offering them several Azure management capabilities such as backup and system updates. We have recently added an ability to onboard these non-Azure servers to be protected by ASC directly from the Windows Admin Center experience.

With this new experience users will be to onboard a WAC server to Azure Security Center and enable viewing its security alerts and recommendations directly in the Windows Admin Center experience.


## September 2019

Updates in September include:

 - [Managing rules with adaptive application controls improvements](#managing-rules-with-adaptive-application-controls-improvements)
 - [Control container security recommendation using Azure Policy](#control-container-security-recommendation-using-azure-policy)

### Managing rules with adaptive application controls improvements

The experience of managing rules for virtual machines using adaptive application controls has improved. Azure Security Center's adaptive application controls help you control which applications can run on your virtual machines. In addition to a general improvement to rule management, a new benefit enables you to control which file types will be protected when you add a new rule.

[Learn more about adaptive application controls](security-center-adaptive-application.md).


### Control container security recommendation using Azure Policy

Azure Security Center's recommendation to remediate vulnerabilities in container security can now be enabled or disabled via Azure Policy.

To view your enabled security policies, from Security Center open the Security Policy page.


## August 2019

Updates in August include:

 - [Just-in-time (JIT) VM access for Azure Firewall](#just-in-time-jit-vm-access-for-azure-firewall)
 - [Single click remediation to boost your security posture (preview)](#single-click-remediation-to-boost-your-security-posture-preview)
 - [Cross-tenant management](#cross-tenant-management)

### Just-in-time (JIT) VM access for Azure Firewall 

Just-in-time (JIT) VM access for Azure Firewall is now generally available. Use it to secure your Azure Firewall protected environments  in addition to your NSG protected environments.

JIT VM access reduces exposure to network volumetric attacks by providing controlled access to VMs only when needed, using your NSG and Azure Firewall rules.

When you enable JIT for your VMs, you create a policy that determines the ports to be protected, how long the ports are to remain open, and approved IP addresses from where these ports can be accessed. This policy helps you stay in control of what users can do when they request access.

Requests are logged in the Azure Activity Log, so you can easily monitor and audit access. The just-in-time page also helps you quickly identify existing VMs that have JIT enabled and VMs where JIT is recommended.

[Learn more about Azure Firewall](../firewall/overview.md).


### Single click remediation to boost your security posture (preview)

Secure score is a tool that helps you assess your workload security posture. It reviews your security recommendations and prioritizes them for you, so you know which recommendations to perform first. This helps you find the most serious security vulnerabilities to prioritize investigation.

In order to simplify remediation of security misconfigurations and help you to quickly improve your secure score, we've added a new capability that allows you to remediate a recommendation on a bulk of resources in a single click.

This operation will allow you to select the resources you want to apply the remediation to and launch a remediation action that will configure the setting on your behalf.

See which recommendations have quick fix enabled in the [reference guide to security recommendations](recommendations-reference.md).


### Cross-tenant management

Security Center now supports cross-tenant management scenarios as part of Azure Lighthouse. This enables you to gain visibility and manage the security posture of multiple tenants in Security Center. 

[Learn more about cross-tenant management experiences](security-center-cross-tenant-management.md).


## July 2019

### Updates to network recommendations

Azure Security Center (ASC) has launched new networking recommendations and improved some existing ones. Now, using Security Center ensures even greater networking protection for your resources. 

[Learn more about network recommendations](recommendations-reference.md#recs-networking).


## June 2019

### Adaptive Network Hardening - generally available

One of the biggest attack surfaces for workloads running in the public cloud are connections to and from the public Internet. Our customers find it hard to know which Network Security Group (NSG) rules should be in place to make sure that Azure workloads are only available to required source ranges. With this feature, Security Center learns the network traffic and connectivity patterns of Azure workloads and provides NSG rule recommendations, for Internet facing virtual machines. This helps our customer better configure their network access policies and limit their exposure to attacks. 

[Learn more about adaptive network hardening](security-center-adaptive-network-hardening.md).