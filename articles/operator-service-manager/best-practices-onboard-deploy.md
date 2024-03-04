---
title: Best practices for Azure Operator Service Manager
description: Understand best practices for Azure Operator Service Manager to onboard and deploy a network function (NF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Azure Operator Service Manager best practices to onboard and deploy network functions

Microsoft has developed many proven practices for managing network functions (NFs) by using Azure Operator Service Manager. This article provides guidelines that NF vendors, telco operators, and their partners can follow to optimize the design. Keep these practices in mind when you onboard and deploy your NFs.

## General considerations

We recommend that you first onboard and deploy your simplest NFs (one or two charts) by using the quickstarts to familiarize yourself with the overall flow. You can add necessary configuration details in subsequent iterations. As you go through the quickstarts, consider the following points:

- Structure your artifacts to align with planned use. Consider separating global artifacts from the artifacts you want to vary by site or instance.
- Ensure service composition of multiple NFs with a set of parameters that matches the needs of your network. For example, you might have a chart that has 1,000 values and you only customize 100 of them. Make sure in the Configuration Group Schema (CGS) layer (covered more extensively in sections that follow) that you only expose 100.
- Think early on about how you want to separate infrastructure (for example, clusters) or artifact stores and access between suppliers, in particular within a single service. Make your set of publisher resources match this model.
- Azure Operator Service Manager site is a logical concept, a representation of a deployment destination. Examples are a Kubernetes cluster for Containerized Network Functions (CNFs) or an Azure Operator Nexus extended custom location for Virtualized Network Functions (VNFs). It isn't a representation of a physical edge site, so you have use cases where multiple sites share the same physical location.
- Azure Operator Service Manager provides various APIs making it simple to combine with ADO or other pipeline tools.

## Publisher considerations

- We recommend that you create a single publisher per NF supplier. This practice provides optimal support, maintenance, and governance experience across all suppliers and simplifies your network service design when composed of multiple NFs from multiple vendors.
- After the desired set of Azure Operator Service Manager publisher resources and artifacts is tested and approved for production use, we recommend marking the entire set as immutable to prevent accidental changes and ensure a consistent deployment experience. Consider relying on immutability capabilities to distinguish between resources and artifacts used in production versus the ones used for testing and development purposes. You can query the state of the publisher resources and the artifact manifests to determine which ones are marked as immutable. For more information, see [Publisher tenants, subscriptions, regions, and preview management](publisher-resource-preview-management.md).

   Keep in mind the following logic:
    - If Network Service Design Function (NSDV) is marked as immutable, CGS has to be marked as immutable too. Otherwise, the deployment call fails.
    - If Network Function Design Version (NFDV) is marked as immutable, the artifact manifest must be marked as immutable too. Otherwise, the deployment call fails.
    - If only artifact manifest or CGS is marked immutable, the deployment call succeeds regardless of whether NFDV and NSDV are marked as immutable.
    - Marking an artifact manifest as immutable ensures that all artifacts listed in that manifest (typically, charts, images, and Azure Resource Manager templates [ARM templates]) are marked immutable too by enforcing necessary permissions on the artifact store.
- Consider using agreed-upon naming conventions and governance techniques to help address any remaining gaps.

## Network Function Definition Group and Version considerations

Network Function Definition Group (NFDG) represents the smallest component that you plan to reuse independently across multiple services. All parts of an NFDG are always deployed together. These parts are called `networkFunctionApplications`. For example, it's natural to onboard a single NF composed of multiple Helm charts and images as a single NFDG if you always deploy those components together. In cases when multiple NFs are always deployed together, it's reasonable to have a single NFDG for all of them. Single NFDGs can have multiple NFDVs.

For Containerized Network Function Definition Versions (CNF NFDVs), the `networkFunctionApplications` list can only contain helm packages. It's reasonable to include multiple helm packages if they're always deployed and deleted together.

For Virtualized Network Function Definition Versions (VNF NFDVs), the `networkFunctionApplications` list must contain at least one `VhdImageFile` and one ARM template. The ARM template should deploy a single virtual machine (VM). To deploy multiple VMs for a single VNF, make sure to use separate ARM templates for each VM.

The ARM template can only deploy Resource Manager resources from the following resource providers:

- Microsoft.Compute
- Microsoft.Network
- Microsoft.NetworkCloud
- Microsoft.Storage
- Microsoft.NetworkFabric
- Microsoft.Authorization
- Microsoft.ManagedIdentity

>[!NOTE]
> For ARM templates containing anything beyond the preceding list, all PUT calls and Re-PUT on the VNF result in a validation error.

### Common use cases that trigger Network Function Design Version minor or major version update

- Updating CGS/Configuration Group Values (CGVs) for an existing release that triggers changing the `deployParametersMappingRuleProfile`.
- Updating values that are hard coded in the NFDV.
- Marking components inactive to prevent them from being deployed via `applicationEnablement: Disabled`.
- New NF release, such as charts and images.

> [!NOTE]
> Minimum number of changes required every time the payload of a given NF changes. A minor or major NF release without exposing new CGS parameters only requires updating the artifact manifest, pushing new images and charts, and bumping the NFDV version.

## Network Service Design Group and Version considerations

Network Service Design Group (NSDG) is a composite of one or more NFDGs and any infrastructure components (such as Nexus Azure Kubernetes Service [NAKS]/Azure Kubernetes Service [AKS] clusters and virtual machines) deployed at the same time. A site network service (SNS) refers to a single NSDV. Such design guarantees consistent and repeatable deployment of the network service to a given site from a single SNS PUT.

An example of an NSDG is:

- Authentication Server Function (AUSF) NF
- Unified Data Management (UDM) NF
- Admin VM supporting AUSF/UDM
- Unity Cloud (UC) Session Management Function (SMF) NF
- NAKS cluster, to which AUSF, UDM, and SMF are deployed

These five components form a single NSDG. A single NSDG can have multiple NSDVs.

### Common use cases that trigger Network Service Design Version minor or major version update

- Creating or deleting CGSs.
- Changes in the NF ARM template associated with one of the NFs being deployed.
- Changes in the infrastructure ARM template, for example, AKS/NAKS or VM.

> [!NOTE]
> Changes in NFDV shouldn't trigger an NSDV update. The NFDV value should be exposed as a parameter within the CGS, so operators can control what to deploy by using CGVs.

## Configuration Group Schema considerations

We recommend that you always start with a single CGS for the entire NF. If there are site-specific or instance-specific parameters, we still recommend that you keep them in a single CGS. We recommend splitting into multiple CGSs when there are multiple components (rarely NFs, more commonly, infrastructure) or configurations that are shared across multiple NFs. The number of CGSs defines the number of CGVs.

### Scenario

- FluentD, Kibana, and Splunk (common third-party components) are always deployed for all NFs within an NSD. We recommend grouping these components into a single NFDG.
- NSD has multiple NFs that all share a few configurations (deployment location, publisher name, and a few chart configurations).

In this scenario, we recommend that you use a single global CGS to expose the common NF and third-party component configurations. You can define NF-specific CGS as needed.

### Choose parameters to expose

- CGS should only have parameters that are used by NFs (day 0/N configuration) or shared components.
- Parameters that are rarely configured should have default values defined.
- If multiple CGSs are used, we recommend little to no overlap between the parameters. If overlap is required, make sure the parameter names are clearly distinguishable between the CGSs.
- What can be defined via API (Azure Operator Nexus, Azure Operator Service Manager) should be considered for CGS. As opposed to, for example, defining those configuration values via CloudInit files.
- When unsure, a good starting point is to expose the parameter and have a reasonable default specified in the CGS. The following example shows the sample CGS and corresponding CGV payloads.
- A single user-assigned managed identity should be used in all the NF ARM templates and should be exposed via CGS.

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

Before you submit the CGV resource creation, you can validate that the schema and values of the underlying YAML or JSON file match what the corresponding CGS expects. To accomplish that, one option is to use the YAML extension for Visual Studio Code.

## CLI considerations

The Azure Operator Service Manager CLI extension assists with the publishing of NFDs and NSDs. Use this tool as the starting point for creating new NFDs and NSDs. Consider using the CLI to create the initial files. Then edit them to incorporate infrastructure components before you publish.

## Site network service considerations

We recommend that you have a single SNS for the entire site, including the infrastructure. The SNS should deploy any infrastructure required (for example, NAKS/AKS clusters and virtual machines), and then deploy the NFs required on top. Such design guarantees consistent and repeatable deployment of the network service to a given site from a single SNS PUT.

We recommend that every SNS is deployed with a user-assigned managed identity rather than a system-assigned managed identity. This user-assigned managed identity must have permissions to access the NFDV and needs to have the role of Managed Identity Operator on itself. For more information, see [Create and assign a user-assigned managed identity](how-to-create-user-assigned-managed-identity.md).

## Azure Operator Service Manager resource mapping per use case

The following two scenarios illustrate Azure Operator Service Manager resource mapping.

### Scenario: Single network function

An NF with one or two application components is deployed to a NAKS cluster.

Resources breakdown:

- **NFDG**: If components can be used independently, two NFDGs, one per component. If components are always deployed together, then a single NFDG.
- **NFDV**: As needed based on the use cases mentioned in the preceding "Common use cases" sections that trigger NFDV minor or major version updates.
- **NSDG**: Single. Combines the NFs and the Kubernetes cluster definitions.
- **NSDV**: As needed based on the use cases mentioned in the preceding "Common use cases" sections that trigger NSDV minor or major version updates.
- **CGS**: Single. We recommend that CGS has subsections for each component and infrastructure being deployed for easier management, and includes the versions for NFDs.
- **CGV**: Single based on the number of CGSs.
- **SNS**: Single per NSDV.

### Scenario: Multiple network functions

Multiple NFs with some shared and independent components are deployed to a NAKS cluster.

Resources breakdown:

- **NFDG**:
    - NFDG for all shared components.
    - NFDG for every independent component or NF.
- **NFDV**: Multiple per each NFDG per use case mentioned in the preceding "Common use cases" sections that trigger NFDV minor or major version updates.
- **NSDG**: Single. Combines all NFs, shared and independent components, and infrastructure (Kubernetes cluster or any supporting VMs).
- **NSDV**: As needed based on the use cases mentioned in the preceding "Common use cases" sections that trigger NSDV minor or major version updates.
- **CGS**:
  - Single. Global for all components that have shared configuration values.
  - NF CGS per NF, including the version of the NFD.
  - Depending on the total number of parameters, consider combining all the CGSs into a single CGS.
- **CGV**: Equal to the number of CGSs.
- **SNS**: Single per NSDV.

## Software upgrade considerations

Assuming NFs support in-place/in-service upgrades, for CNFs:

- If new charts and images are added, Azure Operator Service Manager installs the new charts.
- If some charts and images are removed, Azure Operator Service Manager deletes the charts that are no longer declared in the NFDV.
- Azure Operator Service Manager validates that the NFDV/NSDV originated from the same NFDG/NSDG and hence the same publisher. Cross-publisher upgrades aren't supported.

For VNFs:

- In-place upgrades are currently not supported. You need to instantiate a new VNF with an updated image side by side. Then delete the older VNF by deleting the SNS.
- If VNF is deployed as a pair of VMs for high availability, you can design the network service in such a way that you can delete and upgrade VMs one by one. We recommend the following design to allow the deletion and upgrade of individual VMs:
    - Each VM is deployed by using a dedicated ARM template.
    - From the ARM template, two parameters need to be exposed via CGS: VM name, to allow indicating which instance is primary/secondary, and deployment policy, controlling whether VM deployment is allowed or not.
    - In the NFDV, `deployParameters` and `templateParameters` need to be parametrized in such a way that you can supply the unique values by using CGVs for each.

## High availability and disaster recovery considerations

Azure Operator Service Manager is a regional service deployed across availability zones in regions that support them. For all regions where Azure Operator Service Manager is available, see [Azure products by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=operator-service-manager,azure-network-function-manager&regions=all). For the list of Azure regions that have availability zones, see [Choose the right Azure region for you](https://azure.microsoft.com/explore/global-infrastructure/geographies/#geographies).

Consider the following high-availability and disaster recovery requirements:

- To provide geo-redundancy, make sure you have a publisher in every region where you're planning to deploy NFs. Consider using pipelines to make sure publisher artifacts and resources are kept in sync across the regions.
- The publisher name must be unique per region per Microsoft Entra tenant.

> [!NOTE]
> If a region becomes unavailable, you can deploy (but not upgrade) an NF by using publisher resources in another region. Assuming that artifacts and resources are identical between the publishers, you only need to change the `networkServiceDesignVersionOfferingLocation` value in the SNS resource payload.
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

During installation and upgrade by default, atomic and wait options are set to `true`, and the operation timeout is set to `27 minutes`. During onboarding, we recommend that you set the atomic flag to `false` to prevent the Helm rollback upon failure. The optimal way to accomplish that is in the ARM template of the NF.

In the ARM template, add the following section:

<pre>
"roleOverrideValues": [
    "{\"name\":\"<b>NF_component_name></b>\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"options\":{\"installOptions\":{\"atomic\":\"false\",\"wait\":\"true\",\"timeout\":\"100\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"4\"}}}}}"
]
</pre>

The component name is defined in the NFDV:

<pre>
     networkFunctionTemplate: {
      nfviType: 'AzureArcKubernetes'
      networkFunctionApplications: [
        {
          artifactType: 'HelmPackage'
          <b>name: 'fed-crds'</b>
          dependsOnProfile: null
          artifactProfile: {
            artifactStore: {
              id: acrArtifactStore.id
            }
</pre>

## Cleanup considerations

Delete operator resources in the following order to make sure no orphaned resources are left behind:

- SNS
- Site
- CGV

> [!IMPORTANT]
> Make sure SNS is deleted before you delete the NFDV.

Delete publisher resources in the following order to make sure no orphaned resources are left behind:

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
