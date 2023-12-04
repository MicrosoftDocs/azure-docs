---
title: Best practices for Azure Operator Service Manager
description: Understand Best Practices for Azure Operator Service Manager to onboard and deploy a Network Function (NF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Azure Operator Service Manager Best Practices to onboard and deploy Network Functions

Microsoft has developed many proven practices for managing Network Functions (NFs) using Azure Operator Service Manager. This article provides guidelines that NF vendors, telco operators, and their System Integrators (SIs) can follow to optimize the design. Keep these practices in mind when onboarding and deploying your NFs.

## General considerations

We recommend that you first onboard and deploy your simplest NFs (one or two charts) using the quick starts to familiarize yourself with the overall flow. Necessary configuration details can be added in subsequent iterations. As you go through the quick starts, consider the following:

- Structure your artifacts to align with planned use. Consider separating global artifacts from those you want to vary by site or instance.
- Ensure service composition of multiple NFs with a set of parameters that matches the needs of your network. For example, if your chart has a thousand values and you only customize a hundred of them, make sure in the CGS layer (covered more extensively below) you only expose that hundred.
- Think early on about how you want to separate infrastructure (for example, clusters) or artifact stores and access between suppliers, in particular within a single service.  Make your set of publisher resources match this model.
- Azure Operator Service Manager Site is a logical concept, a representation of a deployment destination. For example, Kubernetes cluster for CNFs or Azure Operator Nexus extended custom location for VNFs. It is not a representation of a physical edge site, so you will have use cases where multiple sites share the same physical location.
- Azure Operator Service Manager provides a variety of APIs making it simple to combine with ADO or other pipeline tools.

## Publisher considerations

- We recommend you create a single publisher per NF supplier. This will provide optimal support, maintenance, and governance experience across all suppliers as well as simplify your network service design when comprised of multiple NFs from multiple vendors.
- Once the desired set of Azure Operator Service Manager publisher resources and artifacts has been tested and approved for production use, we recommend the entire set is marked immutable to prevent accidental changes and ensure a consistent deployment experience. Consider relying on immutability capabilities to distinguish between resources/artifacts used in production vs the ones used for testing/development purposes. You can query the state of the publisher resources and the artifact manifests to determine which ones are marked as immutable. For more information, see [Publisher Tenants, subscriptions, regions and preview management](publisher-resource-preview-management.md). Keep in mind the following logic:
    - If NSDV is marked as immutable, CGS has to be marked as immutable as well otherwise the deployment call will fail.
    - If NFDV is marked as immutable, the artifact manifest has to be marked as immutable as well otherwise the deployment call will fail.
    - If only artifact manifest or CGS are marked immutable, the deployment call will succeed regardless of whether NFDV/NSDV are marked as immutable.
    - Marking artifact manifest as immutable ensures all artifacts listed in that manifest (typically, charts, images, ARM templates) are marked immutable as well by enforcing necessary permissions on the artifact store.
- Consider using agreed-upon naming conventions and governance techniques to help address any remaining gaps.

## Network Function Definition Group and Version considerations

NFDG represents the smallest component that you plan to reuse independently across multiple services. All parts of an NFDG are always deployed together. These parts are called networkFunctionApplications. For example, it is natural to onboard a single NF comprised of multiple Helm charts and images as a single NFDG if you will always deploy those components together. In cases when multiple network functions are always deployed together, it’s reasonable to have a single NFDG for all of them. Single Network Function Definition Group (NFDGs) can have multiple NFDVs.

For Containerized Network Function Definition Versions (CNF NFDVs), the networkFunctionApplications list can only contain helm packages. It's reasonable to include multiple helm packages if they're always deployed and deleted together.

For Virtualized Network Function Definition Versions (VNF NFDVs), the networkFunctionApplications list must contain one VhdImageFile and one ARM template. The ARM template should deploy a single VM. To deploy multiple VMs for a single VNF, make sure to use separate ARM templates for each VM. 

The ARM template can only deploy ARM resources from the following Resource Providers:

- Microsoft.Compute
- Microsoft.Network
- Microsoft.NetworkCloud
- Microsoft.Storage
- Microsoft.NetworkFabric
- Microsoft.Authorization
- Microsoft.ManagedIdentity

### Common use cases that trigger Network Function Design Version minor or major version update

- Updating CGS / CGV for an existing release that triggers changing the deployParametersMappingRuleProfile.
- Updating values that are hard coded in the NFDV.  
- Marking components inactive to prevent them from being deployed via ‘applicationEnablement: 'Disabled.'
- New NF release (charts, images, etc.).

> [!NOTE]
> Minimum number of changes required every time the payload of a given NF changes: minor or major NF release without exposing new CGS parameters will only require updating the artifact manifest, pushing new images and charts, and bumping the NFDV version. 

## Network Service Design Group and Version considerations

NSDG is a composite of one or more NFDG and any infrastructure components (NAKS/AKS clusters, virtual machines, etc.) deployed at the same time. An SNS refers to a single NSDV. Such design guarantees consistent and repeatable deployment of the network service to a given site from a single SNS PUT.

An example of an NSDG is:
- Authentication Server Function (AUSF) NF
- Unified Data Management (UDM) NF
- Admin VM supporting AUSF/UDM
- Unity Cloud (UC) Session Management Function (SMF) NF
- Nexus Azure Kubernetes Service (NAKS) cluster which AUSF, UDM, and SMF are deployed to

These five components form a single NSDG. A single NSDG can have multiple NSDVs.

### Common use cases that trigger Network Service Design Version minor or major version update

- Create or delete CGS.
- Changes in the NF ARM template associated with one of the NFs being deployed.
- Changes in the infrastructure ARM template, for example, AKS/NAKS or VM.

> [!NOTE]
> Changes in NFDV shouldn't trigger an NSDV update. The NFDV value should be exposed as a parameter within the CGS, so operators can control what to deploy using CGVs.

## Configuration Group Schema considerations

It’s recommended to always start with a single CGS for the entire NF. If there are site-specific or instance-specific parameters, it’s still recommended to keep them in a single CGS. Splitting into multiple CGS is recommended when there are multiple components (rarely NFs, more commonly, infrastructure) or configurations that are shared across multiple NFs. The number of CGS' defines the number of CGVs.

### Scenario

- FluentD, Kibana, Splunk (common 3rd-party components) are always deployed for all NFs within an NSD. We recommend these components be grouped into a single NFDG.
- NSD has multiple NFs that all share a few configurations (deployment location, publisher name, and a few chart configurations).

In this scenario, we recommend that a single global CGS is used to expose the common NFs’ and third-party components’ configurations. NF-specific CGS can be defined as needed.

### Choose parameters to expose

- CGS should only have parameters that are used by NFs (day 0/N configuration) or shared components.
- Parameters that are rarely configured should have default values defined.
- If multiple CGS are used, we recommend there is little to no overlap between the parameters. If overlap is required, make sure the parameter names are clearly distinguishable between the CGS’.
- What can be defined via API (Azure Operator Nexus, Azure Operator Service Manager) should be considered for CGS. As opposed to, for example, defining those configuration values via CloudInit files.
- When unsure, a good starting point is to expose the parameter and have a reasonable default specified in the CGS. Below is the sample CGS and corresponding CGV payloads.
- A single User Assigned Managed Identity should be used in all the Network Function ARM templates and should be exposed via CGS.

CGS payload:
<pre>
{ 
  "type": "object", 
  "properties": { 
    "abc": { 
    "type": "integer", 
    <b>"default": 30</b>
    }, 
    "xyz": { 
    "type": "integer", 
    <b>"default": 40</b>
    },
    "qwe": {
    "type": "integer" //doesn't have defaults
    }
  }
  "required": "qwe"
}
</pre>

Corresponding CGV payload passed by the operator:

<pre>
{
"qwe": 20
}
</pre>

Resulting CGV payload generated by Azure Operator Service Manager:
<pre>
{
"abc": 30,
"xyz": 40,
"qwe": 20
}
</pre>

## Configuration Group Values considerations

Before submitting the CGV resource creation, you can validate that the schema and values of the underlying YAML or JSON file match what the corresponding CGS expects. To accomplish that, one option is to use the YAML extension for Visual Studio Code.

## CLI considerations

The Azure Operator Service Manager CLI extension assists with the publishing of NFDs and NSDs. Use this tool as the starting point for creating new NFD and NSD. Consider using the CLI to create the initial files and then edit them to incorporate infrastructure components before publishing.

## Site Network Service considerations

It is recommended to have a single SNS for the entire site, including the infrastructure. The SNS should deploy any infrastructure required (e.g., NAKS/AKS clusters, virtual machines, etc.), and then deploy the network functions required on top. Such design guarantees consistent and repeatable deployment of the network service to a given site from a single SNS PUT.

It's recommended that every SNS is deployed with a User Assigned Managed Identity (UAMI) rather than a System Assigned Managed Identity. This UAMI must have permissions to access the NFDV and needs to have the role of Managed Identity Operator on itself. For more information, see [Create and assign a User Assigned Managed Identity](how-to-create-user-assigned-managed-identity.md).

## Azure Operator Service Manager resource mapping per use case

### Scenario - single Network Function

An NF with one or two application components deployed to a NAKS cluster.

Resources breakdown:

- NFDG: If components can be used independently then two NFDGs, one per component. If components are always deployed together, then a single NFDG.
- NFDV: As needed based on the use cases mentioned in Common use cases that trigger NFDV minor or major version update.
- NSDG: Single; combines the NFs and the K8s cluster definitions.
- NSDV: As needed based on the use cases mentioned in Common use cases that trigger NSDV minor or major version update.
- CGS: Single; we recommend that CGS has subsections for each component and infrastructure being deployed for easier management, and includes the versions for NFDs.
- CGV: Single; based on the number of CGS.
- SNS: Single per NSDV.

### Scenario - multiple Network Functions

Multiple NFs with some shared and independent components deployed to a NAKS cluster.

Resources breakdown:

- NFDG:
    - NFDG for all shared components.
    - NFDG for every independent component and/or NF.
- NFDV: Multiple per each NFDG per use cases mentioned in Common use cases that trigger NFDV minor or major version update.
- NSDG: Single combining all NFs, shared and independent components, and infrastructure (K8s cluster and/or any supporting VMs).
- NSDV: As needed based on use cases mentioned in Common use cases that trigger NSDV minor or major version update.
- CGS:
  - Single global for all components that have shared configuration values.
  - NF CGS per NF including the version of the NFD.
  - Depending on the total number of parameters, you can consider combining all the CGSs into a single CGS.
- CGV: Equal to the number of CGS.
- SNS: Single per NSDV.

## Software upgrade considerations

Assuming NFs support in-place/in-service upgrades, for CNFs:
- If new charts and images are added, Azure Operator Service Manager will install the new charts.
- If some charts and images are removed, Azure Operator Service Manager will delete the charts that are no longer declared in the NFDV.
- Azure Operator Service Manager validates that the NFDV/NSDV originated from the same NFDG/NSDG and hence the same publisher. Cross-publisher upgrades are not supported.

For VNFs
- In-place upgrades are currently not supported. You’ll need to instantiate a new VNF with an updated image side-by-side, and then delete the older VNF by deleting the SNS.
- In case VNF is deployed as a pair of VMs for high availability, you can design the network service such that VMs can be deleted and upgraded one by one. The following design is recommended to allow the deletion and upgrade of individual VMs:
    - Each VM is deployed using a dedicated ARM template.
    - From the ARM template two parameters need to be exposed via CGS: VM name, to allow indicating which instance is primary/secondary, and deployment policy, controlling whether VM deployment is allowed or not.
    - In the NFDV deployParameters and templateParameters will need to be parametrized such that the unique values can be supplied using CGVs for each.
 
## High availability and disaster recovery considerations

Azure Operator Service Manager is a regional service deployed across availability zones in regions that support them. For all regions where Azure Operator Service Manager is available please refer to  [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=operator-service-manager,azure-network-function-manager&regions=all). For the list of Azure regions which have availability zones please refer to [Choose the Right Azure Region for You](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies).
- To provide geo redundancy make sure you have a publisher in every region where you’re planning to deploy network functions. Consider using pipelines to make sure publisher artifacts and resources are kept in sync across the regions.
- Keep in mind that the publisher name must be unique per region per Azure AD tenant.

> [!NOTE]
> In case a region becomes unavailable, you can deploy (but not upgrade) an NF using publisher resources in another region. Assuming artifacts and resources are identical between the publishers, you only need to change the networkServiceDesignVersionOfferingLocation value in the SNS resource payload.
> <pre>
> resource sns 'Microsoft.HybridNetwork/sitenetworkservices@2023-09-01’ = {
>  name: snsName
>  location: location
>  identity: {
>   type: 'SystemAssigned'
>  }
>  properties: {
>    publisherName: publisherName
>    publisherScope: 'Private'
>    networkServiceDesignGroupName: nsdGroup
>    networkServiceDesignVersionName: nsdvName
>    <b>networkServiceDesignVersionOfferingLocation: location</b>
> </pre>

## Troubleshooting considerations

During installation and upgrade by default, atomic and wait options are set to true, and the operation timeout is set to 27 minutes. During onboarding, we recommend that you set the atomic flag to false to prevent the helm rollback upon failure. The optimal way to accomplish that is in the ARM template of the network function.
In the ARM template add the following section:
<pre>
"roleOverrideValues": [
"{\"name\":\"<<b>chart_name></b>\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"options\":{\"installOptions\":{\"atomic\":\"false\",\"wait\":\"true\",\"timeout\":\"100\"}}}}}}"
]
</pre>

The chart name is defined in the NFDV.

## Clean up considerations

Recommended order of deleting operator resources to make sure no orphaned resources are left behind:
- SNS
- Site
- CGV

> [!IMPORTANT]
> Make sure SNS is deleted before you delete the NFDV.

Recommended order of deleting publisher resources to make sure no orphaned resources are left behind:
- CGS
- NSDV
- NSDG
- NFDV
- NFDG
- Artifact Manifest
- Artifact Store
- Publisher

## Next steps

- [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md)
- [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)
