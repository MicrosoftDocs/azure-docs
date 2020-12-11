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
ms.date: 12/07/2020
ms.author: memildin

---

# What's new in Azure Security Center?

Security Center is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often. 

To learn about *planned* changes that are coming soon to Security Center, see [Important upcoming changes to Azure Security Center](upcoming-changes.md). 

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).


## December 2020

Updates in December include:

- [Azure Defender for SQL servers on machines is generally available](#azure-defender-for-sql-servers-on-machines-is-generally-available)
- [Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available](#azure-defender-for-sql-support-for-azure-synapse-analytics-dedicated-sql-pool-is-generally-available)
- [Global Administrators can now grant themselves tenant-level permissions](#global-administrators-can-now-grant-themselves-tenant-level-permissions)
- [Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)](#two-new-azure-defender-plans-azure-defender-for-dns-and-azure-defender-for-resource-manager-in-preview)

### Azure Defender for SQL servers on machines is generally available

Azure Security Center offers two Azure Defender plans for SQL Servers:

- **Azure Defender for Azure SQL database servers** - defends your Azure-native SQL Servers 
- **Azure Defender for SQL servers on machines** - extends the same protections to your SQL servers in hybrid, multicloud, and on-premises environments

With this announcement, **Azure Defender for SQL** now protects your databases and their data wherever they're located.

Azure Defender for SQL includes vulnerability assessment capabilities. The vulnerability assessment tool includes the following advanced features:

- **Baseline configuration** (New!) to intelligently refine the results of vulnerability scans to those that might represent real security issues. After you've established your baseline security state, the vulnerability assessment tool only reports deviations from that baseline state. Results that match the baseline are considered as passing subsequent scans. This lets you and your analysts focus your attention where it matters.
- **Detailed benchmark information** to help you *understand* the discovered findings, and why they relate to your resources.
- **Remediation scripts** to help you mitigate identified risks.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).


### Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available

Azure Synapse Analytics (formerly SQL DW) is an analytics service that combines enterprise data warehousing and big data analytics. Dedicated SQL pools are the enterprise data warehousing features of Azure Synapse. Learn more in [What is Azure Synapse Analytics (formerly SQL DW)?](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

Azure Defender for SQL protects your dedicated SQL pools with:

- **Advanced threat protection** to detect threats and attacks 
- **Vulnerability assessment capabilities** to identify and remediate security misconfigurations

Azure Defender for SQL's support for Azure Synapse Analytics SQL pools is automatically added to Azure SQL databases bundle in Azure Security Center. You'll find a new “Azure Defender for SQL” tab in your Synapse workspace page in the Azure portal.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).


### Global Administrators can now grant themselves tenant-level permissions

A user with the Azure Active Directory role of **Global Administrator** might have tenant-wide responsibilities, but lack the Azure permissions to view that organization-wide information in Azure Security Center. 

To assign yourself tenant-level permissions, follow the instructions in [Grant tenant-wide permissions to yourself](security-center-management-groups.md#grant-tenant-wide-permissions-to-yourself).


### Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)

We've added two new cloud-native breadth threat protection capabilities for your Azure environment.

These new protections greatly enhance your resiliency against attacks from threat actors, and significantly increase the number of Azure resources protected by Azure Defender.

- **Azure Defender for Resource Manager** - automatically monitors all resource management operations performed in your organization. For more information, see:
    - [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
    - [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
    - [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

- **Azure Defender for DNS** - continuously monitors all DNS queries from your Azure resources. For more information, see:
    - [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
    - [Respond to Azure Defender for DNS alerts](defender-for-dns-usage.md)
    - [List of alerts provided by Azure Defender for DNS](alerts-reference.md#alerts-dns)


## November 2020

Updates in November include:

- [29 preview recommendations added to increase coverage of Azure Security Benchmark](#29-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)
- [NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard](#nist-sp-800-171-r2-added-to-security-centers-regulatory-compliance-dashboard)
- [Recommendations list now includes filters](#recommendations-list-now-includes-filters)
- [Auto provisioning experience improved and expanded](#auto-provisioning-experience-improved-and-expanded)
- [Secure score is now available in continuous export (preview)](#secure-score-is-now-available-in-continuous-export-preview)
- ["System updates should be installed on your machines" recommendation now includes sub-recommendations](#system-updates-should-be-installed-on-your-machines-recommendation-now-includes-sub-recommendations)
- [Policy management page in the Azure portal now shows status of default policy assignments](#policy-management-page-in-the-azure-portal-now-shows-status-of-default-policy-assignments)

### 29 preview recommendations added to increase coverage of Azure Security Benchmark

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md).

The following 29 preview recommendations have been added to Security Center to increase the coverage of this benchmark.

Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Encrypt data in transit              | - Enforce SSL connection should be enabled for PostgreSQL database servers<br>- Enforce SSL connection should be enabled for MySQL database servers<br>- TLS should be updated to the latest version for your API app<br>- TLS should be updated to the latest version for your function app<br>- TLS should be updated to the latest version for your web app<br>- FTPS should be required in your API App<br>- FTPS should be required in your function App<br>- FTPS should be required in your web App                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Manage access and permissions        | - Web apps should request an SSL certificate for all incoming requests<br>- Managed identity should be used in your API App<br>- Managed identity should be used in your function App<br>- Managed identity should be used in your web App                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Restrict unauthorized network access | - Private endpoint should be enabled for PostgreSQL servers<br>- Private endpoint should be enabled for MariaDB servers<br>- Private endpoint should be enabled for MySQL servers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Enable auditing and logging          | - Diagnostic logs in App Services should be enabled                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Implement security best practices    | - Azure Backup should be enabled for virtual machines<br>- Geo-redundant backup should be enabled for Azure Database for MariaDB<br>- Geo-redundant backup should be enabled for Azure Database for MySQL<br>- Geo-redundant backup should be enabled for Azure Database for PostgreSQL<br>- PHP should be updated to the latest version for your API app<br>- PHP should be updated to the latest version for your web app<br>- Java should be updated to the latest version for your API app<br>- Java should be updated to the latest version for your function app<br>- Java should be updated to the latest version for your web app<br>- Python should be updated to the latest version for your API app<br>- Python should be updated to the latest version for your function app<br>- Python should be updated to the latest version for your web app<br>- Audit retention for SQL servers should be set to at least 90 days |
|                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

Related links:

- [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md)
- [Learn more about Azure API apps](../app-service/app-service-web-tutorial-rest-api.md)
- [Learn more about Azure function apps](../azure-functions/functions-overview.md)
- [Learn more about Azure web apps](../app-service/overview.md)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)


### NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard

The NIST SP 800-171 R2 standard is now available as a built-in initiative for use with Azure Security Center's regulatory compliance dashboard. The mappings for the controls are described in [Details of the NIST SP 800-171 R2 Regulatory Compliance built-in initiative](../governance/policy/samples/nist-sp-800-171-r2.md). 

To apply the standard to your subscriptions and continuously monitor your compliance status, use the instructions in [Customizing the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/nist-sp-800-171-r2-standard.png" alt-text="The NIST SP 800 171 R2 standard in Security Center's regulatory compliance dashboard":::

For more information about this compliance standard, see [NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).


### Recommendations list now includes filters

You can now filter the list of security recommendations according to a range of criteria. In the following example, the recommendations list has been filtered to show recommendations that:

- are **generally available** (that is, not preview)
- are for **storage accounts**
- support **quick fix** remediation

:::image type="content" source="media/release-notes/recommendations-filters.png" alt-text="Filters for the recommendations list":::


### Auto provisioning experience improved and expanded

The auto provisioning feature helps reduce management overhead by installing the required extensions on new - and existing - Azure VMs so they can benefit from Security Center's protections. 

As Azure Security Center grows, more extensions have been developed and Security Center can monitor a larger list of resource types. The auto provisioning tools have now been expanded to support additional extensions and resource types by leveraging the capabilities of Azure Policy.

You can now configure the auto provisioning of:

- Log Analytics agent
- (New) Azure Policy Add-on for Kubernetes
- (New) Microsoft Dependency agent

Learn more in [Auto provisioning agents and extensions from Azure Security Center](security-center-enable-data-collection.md).


### Secure score is now available in continuous export (preview)

With continuous export of secure score, you can stream changes to your score in real time to Azure Event Hubs or a Log Analytics workspace. Use this capability to:

- track your secure score over time with dynamic reports
- export secure score data to Azure Sentinel (or any other SIEM)
- integrate this data with any processes you might already be using to monitor secure score in your organization

Learn more about how to [Continuously export Security Center data](continuous-export.md).


### "System updates should be installed on your machines" recommendation now includes sub-recommendations

The **System updates should be installed on your machines** recommendation has been enhanced. The new version includes sub-recommendations for each missing update and brings the following improvements:

- A redesigned experience in the Azure Security Center pages of the Azure portal. The recommendation details page for **System updates should be installed on your machines** includes the list of findings as shown below. When you select a single finding, the details pane opens with a link to the remediation information and a list of affected resources.

    :::image type="content" source="./media/upcoming-changes/system-updates-should-be-installed-subassessment.png" alt-text="Opening one of the sub-recommendations in the portal experience for the updated recommendation":::

- Enriched data for the recommendation from Azure Resource Graph (ARG). ARG is an Azure service that's designed to provide efficient resource exploration. You can use ARG to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

    For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data.

    Previously, if you queried this recommendation in ARG, the only available information was that the recommendation needs to be remediated on a machine. The following query of the enhanced version  will return each missing system updates grouped by machine.

    ```kusto
    securityresources
    | where type =~ "microsoft.security/assessments/subassessments"
    | where extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id) == "4ab6e3c5-74dd-8b35-9ab9-f61b30875b27"
    | where properties.status.code == "Unhealthy"
    ```

### Policy management page in the Azure portal now shows status of default policy assignments

You can now see whether or not your subscriptions have the default Security Center policy assigned, in the Security Center's **security policy** page of the Azure portal.

:::image type="content" source="media/release-notes/policy-assignment-info-per-subscription.png" alt-text="The policy management page of Azure Security Center showing the default policy assignments":::

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

The dashboard includes a default set of regulatory standards. If any of the supplied standards isn't relevant to your organization, it's now a simple process to simply remove them from the UI for a subscription. Standards can be removed only at the *subscription* level; not the management group scope.

Learn more in [Removing a standard from your dashboard](update-regulatory-compliance-packages.md#removing-a-standard-from-your-dashboard).


### Microsoft.Security/securityStatuses table removed from Azure Resource Graph (ARG)

Azure Resource Graph is a service in Azure that is designed to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data. For example:

- Asset inventory utilizes (ARG)
- We have documented a sample ARG query for how to [Identify accounts without multi-factor authentication (MFA) enabled](security-center-identity-access.md#identify-accounts-without-multi-factor-authentication-mfa-enabled)

Within ARG there are tables of data for you to use in your queries.

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

The preview recommendation "Pod Security Policies should be defined on Kubernetes Services" is being deprecated as described in the [Azure Kubernetes Service](../aks/use-pod-security-policies.md) documentation.

The pod security policy (preview) feature, is set for deprecation and will no longer be available after October 15th, 2020 in favor of Azure Policy for AKS.

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

Security Center has added full support for [security defaults](../active-directory/fundamentals/concept-fundamentals-security-defaults.md), Microsoft’s free identity security protections.

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

Learn more about [built-in policies](./policy-reference.md).
