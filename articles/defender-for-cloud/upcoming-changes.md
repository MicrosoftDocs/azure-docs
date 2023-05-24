---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.custom: build-2023
ms.date: 05/11/2023
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you can learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might affect things like your secure score or workflows.

If you're looking for the latest release notes, you can find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Additional scopes added to existing Azure DevOps Connectors](#additional-scopes-added-to-existing-azure-devops-connectors) | May 2023 |
| [DevOps Resource Deduplication for Defender for DevOps](#devops-resource-deduplication-for-defender-for-devops) | June 2023 |
| [Replacing agent-based discovery with agentless discovery for containers capabilities in Defender CSPM](#replacing-agent-based-discovery-with-agentless-discovery-for-containers-capabilities-in-defender-cspm) | June 2023
| [Release of containers vulnerability assessment runtime recommendation powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM](#release-of-containers-vulnerability-assessment-runtime-recommendation-powered-by-microsoft-defender-vulnerability-management-mdvm-in-defender-cspm) | June 2023 |


### Additional scopes added to existing Azure DevOps Connectors 

**Estimated date for change: May 2023**

Defender for DevOps will be adding more scopes to the already existing Azure DevOps (ADO) application.

The scopes that are set to be added include:

- Advance Security management: `vso.advsec_manage`; Needed to enable, disable and manage, GitHub Advanced Security for ADO. 

- Container Mapping: `vso.extension_manage`, `vso.gallery_manager`; This is needed to share the decorator extension with the ADO organization.  

This change will only affect new Defender for DevOps customers that are trying to onboard ADO resources to Microsoft Defender for Cloud.

Customers may experience ADO authentication errors when they try to create a new ADO connector. GitHub and existing connector flow will continue to work. This change of scope will result in downtime for any ADO Connector creation experience in May 2023. After May, all new ADO Connectors will be created with new scopes.

### DevOps Resource Deduplication for Defender for DevOps

**Estimated date for change: June 2023**

To improve the Defender for DevOps user experience and enable further integration with Defender for Cloud's rich set of capabilities, Defender for DevOps will no longer support duplicate instances of a DevOps organization to be onboarded to an Azure tenant. 

If you don't have an instance of a DevOps organization onboarded more than once to your organization, no further action is required. If you do have more than one instance of a DevOps organization onboarded to your tenant, the subscription owner will be notified and will need to delete the DevOps Connector(s) they don't want to keep by navigating to Defender for Cloud Environment Settings. 

Customers will have until June 30, 2023 to resolve this issue. After this date, only the most recent DevOps Connector created where an instance of the DevOps organization exists will remain onboarded to Defender for DevOps. For example, if Organization Contoso exists in both connectorA and connectorB, and connectorB was created after connectorA, then connectorA will be removed from Defender for DevOps.

### Replacing agent-based discovery with agentless discovery for containers capabilities in Defender CSPM

**Estimated date for change: June 2023**

With Agentless Container Posture capabilities available in Defender CSPM, the agent-based discovery capabilities are set to be retired in June 2023. If you currently use container capabilities within Defender CSPM, please make sure that the [relevant extensions](how-to-enable-agentless-containers.md) are enabled before this date to continue receiving container-related value of the new agentless capabilities such as container-related attack paths, insights, and inventory.

### Release of containers vulnerability assessment runtime recommendation powered by Microsoft Defender Vulnerability Management (MDVM) in Defender CSPM

**Estimated date for change: June 2023**

 A new container recommendation in Defender CSPM powered by MDVM is set to be released:

|Recommendation | Description | Assessment Key|
|--|--|--| 
| Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessment scans container images running on your Kubernetes clusters for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5

This new recommendation is set to replace the current recommendation of the same name, powered by Qualys, only in Defender CSPM (replacing assessment key 41503391-efa5-47ee-9282-4eff6131462c).

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
