---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 06/06/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you can learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

If you're looking for the latest release notes, you can find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Release of containers vulnerability assessment runtime recommendation powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM](#release-of-containers-vulnerability-assessment-runtime-recommendation-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-cspm) | June 2023 |
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) |  July 2023
| [Changes to the Defender for DevOps recommendations environment source and resource ID](#changes-to-the-defender-for-devops-recommendations-environment-source-and-resource-id) |  July 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | July 2023
| [General availability release of agentless container posture in Defender CSPM](#general-availability-ga-release-of-agentless-container-posture-in-defender-cspm) | July 2023

### Release of containers vulnerability assessment runtime recommendation powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM

**Estimated date for change: June 2023**

 A new container recommendation in Defender CSPM powered by MDVM is set to be released:

|Recommendation | Description | Assessment Key|
|--|--|--| 
| Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5

This new recommendation is set to replace the current recommendation of the same name, powered by Qualys, only in Defender CSPM (replacing assessment key 41503391-efa5-47ee-9282-4eff6131462c).

### Changes to the Defender for DevOps recommendations environment source and resource ID

**Estimated date for change: June 2023**

The Security DevOps recommendations will be updated to align with the overall Microsoft Defender for Cloud features and experience.  Affected recommendations will point to a new recommendation source environment and have an updated resource ID.


Security DevOps recommendations impacted:
-	Code repositories should have code scanning findings resolved (preview)
-	Code repositories should have secret scanning findings resolved (preview)
-	Code repositories should have dependency vulnerability scanning findings resolved (preview)
-	Code repositories should have infrastructure as code scanning findings resolved (preview)
-	GitHub repositories should have code scanning enabled (preview)
-	GitHub repositories should have Dependabot scanning enabled (preview)
-	GitHub repositories should have secret scanning enabled (preview)

The recommendation environment source will be updated from `Azure` to `AzureDevOps` or `GitHub`. 

The format for resource IDs will be changed from:

`Microsoft.SecurityDevOps/githubConnectors/owners/repos/`

To:

`Microsoft.Security/securityConnectors/devops/azureDevOpsOrgs/projects/repos`
`Microsoft.Security/securityConnectors/devops/gitHubOwners/repos`

As a part of the migration, source code management system specific recommendations will be created for security findings:
-	GitHub repositories should have code scanning findings resolved (preview)
-	GitHub repositories should have secret scanning findings resolved (preview)
-	GitHub repositories should have dependency vulnerability scanning findings resolved (preview)
-	GitHub repositories should have infrastructure as code scanning findings resolved (preview)
-	GitHub repositories should have code scanning enabled (preview)
-	GitHub repositories should have Dependabot scanning enabled (preview)
-	GitHub repositories should have secret scanning enabled (preview)
-	Azure DevOps repositories should have code scanning findings resolved (preview)
-	Azure DevOps repositories should have secret scanning findings resolved (preview)
-	Azure DevOps repositories should have infrastructure as code scanning findings resolved (preview)

Customers that rely on the `resourceID` to query DevOps recommendation data will be affected. For example, Azure Resource Graph queries, workbooks queries, API calls to Microsoft Defender for Cloud. 

Queries will need to be updated to include both the old and new `resourceID` to show both, for example, total over time.  

The recommendations page's experience will have minimal impact and deprecated assessments may continue to show for a maximum of 14 days if new scan results aren't submitted.  

### DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: July 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant. 

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings. 

Customers will have until July 31, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

### General Availability (GA) release of Agentless Container Posture in Defender CSPM

**Estimated date for change: July 2023**

The new Agentless Container Posture capabilities are set for General Availability (GA) as part of the Defender CSPM (Cloud Security Posture Management) plan.

With this release, the recommendation `Container registry images should have vulnerability findings resolved (powered by MDVM)` is set for General Availability (GA):

|Recommendation | Description | Assessment Key|
|--|--|--|
| Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)| Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to  improving your security posture, significantly reducing the attack surface for your containerized workloads. |dbd0cb49-b563-45e7-9724-889e799fa648 <br> is replaced by  c0b7cfc6-3172-465a-b378-53c7ff2cc0d5

Customers with both Defender for Containers plan and Defender CSPM plan should [disable the Qualys recommendation](tutorial-security-policy.md#disable-a-security-recommendation), to avoid multiple reports for the same images with potential impact on secure score. If you're currently using the sub-assesment API or Azure Resource Graph or continuous export, you should also update your requests to the new schema used by the MDVM recommendation prior to disabling the Qualys recommendation and using MDVM results instead.

Learn more about [Agentless Containers Posture in Defender CSPM](concept-agentless-containers.md).

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
