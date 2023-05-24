---
title: Agentless Container Posture for Microsoft Defender for Cloud
description: Learn how Agentless Container Posture offers discovery, visibility, and vulnerability assessment for Containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 05/16/2023
ms.custom: template-concept, build-2023
---

# Agentless Container Posture (Preview)

Agentless Container Posture provides a holistic approach to improving your container posture within Defender CSPM (Cloud Security Posture Management). You can visualize and hunt for risks and threats to Kubernetes environments with attack path analysis and the cloud security explorer, and leverage agentless discovery and visibility within Kubernetes components.

Learn more about [CSPM](concept-cloud-security-posture-management.md).

## Capabilities

Agentless Container Posture provides the following capabilities:

- Using Kubernetes [attack path analysis](concept-attack-path.md) to visualize risks and threats to Kubernetes environments.

- Using [cloud security explorer](how-to-manage-cloud-security-explorer.md) for risk hunting by querying various risk scenarios. 

- Viewing security insights, such as internet exposure, and other predefined security scenarios. For more information, search for Kubernetes in the [list of Insights](attack-path-reference.md#cloud-security-graph-components-list).

- [Agentless discovery and visibility within Kubernetes components](#agentless-discovery-and-visibility-within-kubernetes-components)

- [Container registry vulnerability assessment](#container-registry-vulnerability-assessment)

## Agentless discovery and visibility within Kubernetes components

Agentless discovery for Kubernetes provides API-based discovery of information about Kubernetes cluster architecture, workload objects, and setup.

### How does Agentless Discovery for Kubernetes work?

The discovery process is based on snapshots taken at intervals: 

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

By enabling the Agentless discovery for Kubernetes extension, the following process occurs:

- **Create**: MDC (Microsoft Defender for Cloud) creates an identity in customer environments called CloudPosture/securityOperator/DefenderCSPMSecurityOperator.

- **Assign**: MDC assigns 1 built-in role called **Kubernetes Agentless Operator** to that identity on subscription scope.

    The role contains the following permissions:
    - AKS read (Microsoft.ContainerService/managedClusters/read)
    - AKS Trusted Access with the following permissions:
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read
        - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete

        Learn more about [AKS Trusted Access](/azure/aks/trusted-access-feature).

- **Discover**: Using the system assigned identity, MDC performs a discovery of the AKS clusters in your environment using API calls to the API server of AKS.

- **Bind**: Upon discovery of an AKS cluster, MDC performs an AKS bind operation between the created identity and the Kubernetes role “Microsoft.Security/pricings/microsoft-defender-operator”. The role is visible via API and gives MDC data plane read permission inside the cluster.


## Container registry vulnerability assessment

- Container registry vulnerability assessment scans images in your Azure Container Registry (ACR) to provide recommendations for improving your posture by remediating vulnerabilities.

- Vulnerability assessment for Containers in Defender Cloud Security Posture Management (CSPM) gives you frictionless, wide, and instant visibility on actionable posture issues without the need for installed agents, network connectivity requirements, or container performance impact.

Container registries vulnerability assessment, powered by Microsoft Defender Vulnerability Management (MDVM), is an out-of-box solution that empowers security teams to discover vulnerabilities in your Azure  Container images by providing frictionless native coverage in Azure for vulnerability scanning of container images.   
   
Azure Container Vulnerability Assessment provides automatic coverage for all registries and images in Azure, for each subscription where the CSPM plan is enabled, without any extra configuration of users or registries. New images are automatically scanned once a day and vulnerability reports for previously scanned images are refreshed daily.     

Container vulnerability assessment powered by MDVM (Microsoft Defender Vulnerability Management) has the following capabilities:  

- **Scanning OS packages** - container vulnerability assessment has the ability to scan vulnerabilities in packages installed by the OS package manager in Linux. See the [full list of the supported OS and their versions](support-agentless-containers-posture.md#registries-and-images).   
- **Language specific packages** – support for language specific packages and files, and their dependencies installed or copied without the OS package manager. See the [complete list of supported languages](support-agentless-containers-posture.md#registries-and-images).  
- **Image scanning in Azure Private Link** - Azure container vulnerability assessment provides the ability to scan images in container registries that are accessible via Azure Private Links. This capability requires access to trusted services and authentication with the registry. Learn how to [connect privately to an Azure container registry using Azure Private Link](/azure/container-registry/container-registry-private-link#set-up-private-endpoint---portal-recommended).   
- **Gaining intel for existing exploits of a vulnerability** - While vulnerability reporting tools can report the ever growing volume of vulnerabilities, the capacity to efficiently remediate them remains a challenge;teams. These tools typically prioritize their remediation processes according to the severity of the vulnerability. MDVM provides additional context on the risk related with each vulnerability, leveraging intelligent assessment and risk-based prioritization  against industry security benchmarks, based on three data sources: [exploit DB](https://www.exploit-db.com/), [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog), and [MSRC](https://www.microsoft.com/msrc?SilentAuth=1&wa=wsignin1.0)
- **Reporting** - Defender for Containers powered by Microsoft Defender Vulnerability Management (MDVM)  reports the vulnerabilities as the following recommendation: 
 
    | Recommendation | Description |
    |--|--|       
    | Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessment scans your registry for security vulnerabilities and exposes detailed findings for each image. Resolving the vulnerabilities can greatly improve your containers' security posture and protect them from attacks. |

- **Query vulnerability information via the Azure Resource Graph** - Ability to query vulnerability information via the [Azure Resource Graph](/azure/governance/resource-graph/overview#how-resource-graph-complements-azure-resource-manager). Learn how to [query recommendations via the ARG](review-security-recommendations.md#review-recommendation-data-in-azure-resource-graph-arg). 
- **Query vulnerability information via sub-assessment API** - You can get scan results via REST API. See the [sub-assessment list](/rest/api/defenderforcloud/sub-assessments/get?tabs=HTTP).   
   
### Scan Triggers 

The triggers for an image scan are: 

- **One-time triggering** – each image added to a container registry is scanned within 24 hours.
- **Continuous rescan triggering** – Continuous rescan is required to ensure images that have been previously scanned for vulnerabilities are rescanned to update their vulnerability reports in case a new vulnerability is published.   
    - **Re-scan** is performed once a day for:  
        - images pushed in the last 90 days.  
        - images currently running on the Kubernetes clusters monitored by Defender for Cloud (either via agentless discovery and visibility for Kubernetes or Defender for Containers agent). 

### How does image scanning work? 

Container registry vulnerability assessment scans container images stored in your Azure Container Registry (ACR) as part of the protections provided within Microsoft Defender CSPM. A detailed description of the process is as follows: 

1. When you enable the vulnerability assessment extension in Defender CSPM, you authorize Defender CSPM to scan container images in your Azure Container registries.  
1. Defender CSPM automatically discovers all containers registries, repositories and images (created before or after enabling the plan).  
1. Once a day, all discovered images are pulled and an inventory is created for each image that is discovered.  
1. Vulnerability reports for known vulnerabilities (CVEs) are generated for each software that is present on an image inventory. 
6. Vulnerability reports are refreshed daily for any image pushed during the last 90 days to a registry or currently running on a Kubernetes cluster monitored by Defender CSPM Agentless discovery and visibility for Kubernetes, or monitored by the Defender for Containers agent (profile or extension).


## Next steps
- Learn about [support and prerequisites for agentless containers posture](support-agentless-containers-posture.md)
- Learn how to [enable agentless containers](how-to-enable-agentless-containers.md)
