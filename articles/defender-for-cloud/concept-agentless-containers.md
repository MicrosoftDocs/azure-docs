---
title: Agentless Container Posture for Microsoft Defender for Cloud
description: Learn how Agentless Container Posture offers discovery, visibility, and vulnerability assessment for Containers without installing an agent on your machines.
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 07/03/2023
ms.custom: template-concept
---

# Agentless Container Posture (Preview)

Agentless Container Posture provides a holistic approach to improving your container posture within Defender CSPM (Cloud Security Posture Management). You can visualize and hunt for risks and threats to Kubernetes environments with attack path analysis and the cloud security explorer, and leverage agentless discovery and visibility within Kubernetes components.

Learn more about [CSPM](concept-cloud-security-posture-management.md).

## Capabilities

Agentless Container Posture provides the following capabilities:

- Using Kubernetes [attack path analysis](concept-attack-path.md) to visualize risks and threats to Kubernetes environments.
- Using [cloud security explorer](how-to-manage-cloud-security-explorer.md) for risk hunting by querying various risk scenarios. 
- Viewing security insights, such as internet exposure, and other predefined security scenarios. For more information, search for `Kubernetes` in the [list of Insights](attack-path-reference.md#insights).
- [Agentless discovery and visibility](#agentless-discovery-and-visibility-within-kubernetes-components) within Kubernetes components.
- [Agentless container registry vulnerability assessment](#agentless-container-registry-vulnerability-assessment), using the image scanning results of your Azure Container Registry (ACR) with cloud security explorer.

All of these capabilities are available as part of the [Defender Cloud Security Posture Management](concept-cloud-security-posture-management.md) plan. 

## Agentless discovery and visibility within Kubernetes components

Agentless discovery for Kubernetes provides API-based discovery of information about Kubernetes cluster architecture, workload objects, and setup.

### How does Agentless Discovery for Kubernetes work?

The discovery process is based on snapshots taken at intervals:

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

When you enable the Agentless discovery for Kubernetes extension, the following process occurs:

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

### What's the refresh interval?

Agentless information in Defender CSPM is updated through a snapshot mechanism. It can take up to **24 hours** to see results in Cloud Security Explorer and Attack Path.

## Agentless Container registry vulnerability assessment

> [!NOTE]
> This feature supports scanning of images in the Azure Container Registry (ACR) only. If you want to find vulnerabilities stored in other container registries, you can import the images into ACR, after which the imported images are scanned by the built-in vulnerability assessment solution. Learn how to [import container images to a container registry](/azure/container-registry/container-registry-import-images).

- Container registry vulnerability assessment scans images in your Azure Container Registry (ACR) to provide recommendations for improving your posture by remediating vulnerabilities.

- Vulnerability assessment for Containers in Defender Cloud Security Posture Management (CSPM) gives you frictionless, wide, and instant visibility on actionable posture issues without the need for installed agents, network connectivity requirements, or container performance impact.

Container registries vulnerability assessment, powered by Microsoft Defender Vulnerability Management (MDVM), is an out-of-box solution that empowers security teams to discover vulnerabilities in your Azure  Container images by providing frictionless native coverage in Azure for vulnerability scanning of container images.   
   
Azure Container Vulnerability Assessment provides automatic coverage for all registries and images in Azure, for each subscription where the CSPM plan is enabled, without any extra configuration of users or registries. New images are automatically scanned once a day and vulnerability reports for previously scanned images are refreshed daily.     

Container vulnerability assessment powered by MDVM (Microsoft Defender Vulnerability Management) has the following capabilities:  

- **Scanning OS packages** - container vulnerability assessment has the ability to scan vulnerabilities in packages installed by the OS package manager in Linux. See the [full list of the supported OS and their versions](support-agentless-containers-posture.md#registries-and-images).   
- **Language specific packages** – support for language specific packages and files, and their dependencies installed or copied without the OS package manager. See the [complete list of supported languages](support-agentless-containers-posture.md#registries-and-images).  
- **Image scanning in Azure Private Link** - Azure container vulnerability assessment provides the ability to scan images in container registries that are accessible via Azure Private Links. This capability requires access to trusted services and authentication with the registry. Learn how to [connect privately to an Azure container registry using Azure Private Link](/azure/container-registry/container-registry-private-link#set-up-private-endpoint---portal-recommended).   
- **Exploitability information** - Each vulnerability report is searched through exploitability databases to assist our customers with determining actual risk associated with each reported vulnerability.  
- **Reporting** - Defender for Containers powered by Microsoft Defender Vulnerability Management (MDVM)  reports the vulnerabilities as the following recommendations: 
 
    | Recommendation | Description | Assessment Key
    |--|--|--|          
    | Container registry images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management)-Preview | Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. Resolving vulnerabilities can greatly improve your security posture, ensuring images are safe to use prior to deployment. | c0b7cfc6-3172-465a-b378-53c7ff2cc0d5 |
    | Running container images should have vulnerability findings resolved (powered by Microsoft Defender Vulnerability Management) | Container image vulnerability assessment scans your registry for commonly known vulnerabilities (CVEs) and provides a detailed vulnerability report for each image. This recommendation provides visibility to vulnerable images currently running in your Kubernetes clusters. Remediating vulnerabilities in container images that are currently running is key to improving your security posture, significantly reducing the attack surface for your containerized workloads. | c609cf0f-71ab-41e9-a3c6-9a1f7fe1b8d5 |

- **Query vulnerability information via the Azure Resource Graph** - Ability to query vulnerability information via the [Azure Resource Graph](/azure/governance/resource-graph/overview#how-resource-graph-complements-azure-resource-manager). Learn how to [query recommendations via the ARG](review-security-recommendations.md#review-recommendation-data-in-azure-resource-graph-arg). 
- **Query vulnerability information via sub-assessment API** - You can get scan results via REST API. See the [subassessment list](/rest/api/defenderforcloud/sub-assessments/get?tabs=HTTP).   
- **Support for exemptions** - Learn how to  [create exemption rules for a management group, resource group, or subscription](how-to-enable-agentless-containers.md#support-for-exemptions).
- **Support for disabling vulnerability findings** - Learn how to [disable vulnerability assessment findings on Container registry images](disable-vulnerability-findings-containers.md). 
   
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
1. Once a day:

   1. All newly discovered images are pulled, and an inventory is created for each image. Image inventory is kept to avoid further image pulls, unless required by new scanner capabilities.​

      1. Using the inventory, vulnerability reports are generated for new images, and updated for images previously scanned which were either pushed in the last 90 days to a registry, or are currently running. 

> [!NOTE]
> To determine if an image is currently running, Agentless Vulnerability Assessment uses [Agentless Discovery and Visibility within Kubernetes components](/azure/defender-for-cloud/concept-agentless-containers). 
### If I remove an image from my registry, how long before vulnerabilities reports on that image would be removed?

It currently takes 3 days to remove findings for a deleted image. We are working on providing quicker deletion for removed images.

## Next steps

- Learn about [support and prerequisites for agentless containers posture](support-agentless-containers-posture.md)

- Learn how to [enable agentless containers](how-to-enable-agentless-containers.md)


