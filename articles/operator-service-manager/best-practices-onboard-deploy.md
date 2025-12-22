---
title: Basic Concepts for Azure Operator Service Manager
description: Understand Azure Operator Service Manager basic concepts behind onboarding and deploying a network function.
author: msftadam
ms.author: adamdor
ms.date: 10/06/2025
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Basic concepts for Azure Operator Service Manager
This article captures best practice recommendations to onboard and deploy network functions (NFs) with Azure Operator Service Manager. Following these basic guidelines, vendors, operators, and their partners can optimize network services deployed to Azure Operator Nexus. Consider these concepts at the beginning of any network function onboarding planning process.

## General considerations
We recommend that you first onboard and deploy your simplest NFs (one or two charts) by using the quickstarts to familiarize yourself with the overall flow. You can add necessary configuration details in subsequent iterations. As you go through the quickstarts, consider the following points:
- Structure your artifacts to align with planned use. Consider separating global artifacts from the artifacts that you want to vary by site or instance.
- Ensure service composition of multiple NFs with a set of parameters that matches the needs of your network. For example, you might customize 100 values in a chart that has 1,000 values. Make sure that in the configuration group schema (CGS) layer (covered more extensively in sections that follow), you expose only 100.
- Think early on about how you want to separate infrastructure (for example, clusters) or artifact stores and access between suppliers, in particular within a single service. Make your set of publisher resources match this model.
- The Azure Operator Service Manager site is a logical concept, a representation of a deployment destination. Examples include a Kubernetes cluster for containerized network functions (CNFs) or an Azure Operator Nexus extended custom location for virtualized network functions (VNFs). It isn't a representation of a physical edge site, so you have use cases where multiple sites share the same physical location.
- Azure Operator Service Manager provides various APIs that help you combine it with Azure DevOps or other pipeline tools.
- The Azure Operator Service Manager command-line interface (CLI) extension assists with the publishing of network function definitions (NFDs) and NSDs. Use this tool as the starting point for creating new NFDs and NSDs. Consider using the CLI to create the initial files. Then edit them to incorporate infrastructure components before you publish.
  
## Publisher considerations
- We recommend that you create a single publisher per NF supplier, or per NF type per NF supplier, where the NF supplier may provide more than one NF type. This practice;
  - Provides for the most optimal support, maintenance, and governance experience, by preventing proliferation of publishers. Especially during upgrade activities where the same action is often executed across many NFs. 
  - Lowers total operating costs by reducing the number of publisher backing resources, like Azure Container Registry (ACR) or Storage Accounts.
  - Simplifies the network service design (NSD), where it may consist of multiple NFs from multiple vendors.
- After you test and approve the desired set of Azure Operator Service Manager publisher resources for production use, we recommend marking the entire set as immutable. Marking the set as immutable helps prevent accidental changes and ensures a consistent deployment experience. Immutability markings help distinguish between:
  - Resources and artifacts used in production
  - Resources and artifacts used for testing and development

You can query the state of the publisher resources and the artifact manifests to determine which ones are marked as immutable. For more information, see [Publisher Resource Preview Management feature](publisher-resource-preview-management.md). 

Keep in mind the following logic:  
- If the network service design version (NSDV) is marked as immutable, the CGS also must be marked as immutable. Otherwise, the deployment call fails.
- If the network function definition version (NFDV) is marked as immutable, the artifact manifest also must be marked as immutable. Otherwise, the deployment call fails.
- If only the artifact manifest or the CGS is marked as immutable, the deployment call succeeds regardless of whether the NFDV and NSDV are marked as immutable.
- Marking an artifact manifest as immutable ensures that all artifacts listed in that manifest are also marked as immutable by enforcing necessary permissions on the artifact store. Listed artifacts typically include charts, images, and Azure Resource Manager templates (ARM templates).
- Consider using agreed-upon naming conventions and governance techniques to help address any remaining gaps.

### Publisher high availability and disaster recovery
The Azure Operator Service Manager publisher is a regional service deployed across local availability zones in supported regions only. Consider the following requirements for publisher high availability and disaster recovery:
- To provide geo-redundancy, make sure you have a publisher in every region where you're planning to deploy NFs. Consider using pipelines to keep publisher artifacts and resources in sync across the regions.
- The publisher name must be unique for each Microsoft Entra tenant in each region.

## NFDG and NFDV considerations
The network function definition group (NFDG) represents the smallest component that you plan to reuse independently across multiple services. All parts of an NFDG are always deployed together. These parts are called `networkFunctionApplications` items. For example, it's natural to onboard a single NF that consists of multiple Helm charts and images as a single NFDG if you always deploy those components together. In cases where multiple NFs are always deployed together, it's reasonable to have a single NFDG for all of them. Single NFDGs can have multiple NFDVs.

* For CNF NFDVs, the `networkFunctionApplications` list can contain only Helm packages.
  * It's reasonable to include multiple Helm packages if they're always deployed and deleted together.
* For VNF NFDVs, the `networkFunctionApplications` list must contain at least one `VhdImageFile` value and one ARM template.
  * To deploy multiple virtual machines (VMs) for a single VNF, make sure to use a separate ARM template for each VM.

The ARM template can deploy only Resource Manager resources from the following resource providers:
- `Microsoft.Compute`
- `Microsoft.Network`
- `Microsoft.NetworkCloud`
- `Microsoft.Storage`
- `Microsoft.NetworkFabric`
- `Microsoft.Authorization`
- `Microsoft.ManagedIdentity`

For ARM templates that contain anything beyond the preceding list, all `PUT` calls on the VNF result in a validation error.

### NFDV minor or major updates
The NFDV represents a release of the base NFDG and is associated to a unique version. As the NF changes overtime, many NFDVs are use to capture capabilities, at any given point in time. Typical changes that trigger a new NFDV may include: 
- Updating NF artifacts, such as new charts or image versions.
- Updating CGSs or configuration group values (CGVs) that change `deployParametersMappingRuleProfile`.
- Updating any default values hard-coded into the NFDV.
- Updating component enablement, to prevent them from being deployed via `applicationEnablement: Disabled`.

> [!NOTE]
> A NF release which doesn't expose new CGS parameters requires only updating the artifact manifest, pushing new images and charts, and bumping the NFDV.

## NSDG and NSDV considerations
A network service design group (NSDG) is a composite of one or more NFDGs and any infrastructure components deployed at the same time. These components might include clusters and VMs in Nexus Kubernetes or Azure Kubernetes Service (AKS). A site network service (SNS) refers to a single NSDV. Such a design provides a consistent and repeatable deployment of the network service to a site from a single SNS `PUT` call.

An example NSDG might consist of:
- Authentication Server Function (AUSF) NF
- Unified data management (UDM) NF
- Admin VM that supports AUSF or UDM
- Unity Cloud Session Management Function (SMF) NF
- Nexus Kubernetes cluster to which AUSF, UDM, and SMF are deployed

These five components form a single NSDG. A single NSDG can have multiple NSDVs.

### NSDV minor or major update
The NSDV represents a release of the base NSD and is associated to a unique version. NSDV changes are less frequent than NFDV changes, and in some cases, a single NSDV supports the entire lifecycle of a site network service. However, the following service changes do require new a NSDV: 
- Creating, deleting, or adding values in CGSs.
- Changing the NF ARM template used by a deployed site network service resource.
- Changing the infrastructure ARM template used by a deploy site resource.

> [!NOTE]
> Expose the NFDV as a parameter within the CGS, so operators can control what to deploy using CGVs, further reducing NSDV change frequency.

## SNS considerations
We recommend that you have a single SNS for the entire site, including the infrastructure. The SNS should deploy any required infrastructure (for example, clusters and VMs in Nexus Kubernetes or AKS), and then deploy the required NFs on top. Such a design provides a consistent and repeatable deployment of the network service to a site from a single SNS `PUT` call.

We recommend that you deploy every SNS with a user-assigned managed identity rather than a system-assigned managed identity. This user-assigned managed identity must have permissions to access the NFDV and must have the role of Managed Identity Operator on itself. For more information, see [Create and assign a user-assigned managed identity](how-to-create-user-assigned-managed-identity.md).

## Resource scheme considerations 
The following two scenarios illustrate Azure Operator Service Manager resource mapping.

### Scenario: Single network function
An NF with one or two application components is deployed to a Nexus Kubernetes cluster. Here's the breakdown of resources:
- **NFDG**: If components can be used independently, two NFDGs with one per component. If components are always deployed together, then a single NFDG.
- **NFDV**: As needed based on use cases that trigger NFDV minor or major version updates.
- **NSDG**: Single. Combines the NFs and the Kubernetes cluster definitions.
- **NSDV**: As needed based on the use cases that trigger NSDV minor or major version updates.
- **CGS**: Single. For easier management, we recommend that the CGS has subsections for each component and infrastructure that you're deploying. We also recommend that the CGS includes the versions for NFDs.
- **CGV**: Single based on the number of CGSs.
- **SNS**: Single per NSDV.

### Scenario: Multiple network functions
Multiple NFs with some shared and independent components are deployed to a Nexus Kubernetes cluster. Here's the breakdown of resources:
- **NFDG**:
  - Single for all shared components.
  - Single for every independent component or NF.
- **NFDV**: Multiple for each NFDG per use case that triggers NFDV minor or major version updates.
- **NSDG**: Single. Combines all NFs, shared and independent components, and infrastructure (Kubernetes cluster or any supporting VMs).
- **NSDV**: As needed based on the use cases that trigger NSDV minor or major version updates.
- **CGS**:
  - Single. Global for all components.
  - Single per NF, including the version of the NFD.
  - Depending on the total number of parameters, consider combining all the CGSs into a single CGS.
- **CGV**: Equal to the number of CGSs.
- **SNS**: Single per NSDV.

## Upgrade considerations
Assuming that NFs support in-place and in-service upgrades, the following considerations apply for CNFs:
- If you add new charts and images, Azure Operator Service Manager installs the new charts.
- If you remove some charts and images, Azure Operator Service Manager deletes the charts that are no longer declared in the NFDV.
- Azure Operator Service Manager validates that the NFDV/NSDV originated from the same NFDG/NSDG and hence the same publisher. Cross-publisher upgrades aren't supported.

The following considerations apply for VNFs:
- In-place upgrades are currently not supported. You need to instantiate a new VNF with an updated image side by side. Then delete the older VNF by deleting the SNS.
- If a VNF is deployed as a pair of VMs for high availability, you can design the network service in such a way that you can delete and upgrade VMs one by one. We recommend the following design to allow the deletion and upgrade of individual VMs:
  - Deploy each VM by using a dedicated ARM template.
  - From the ARM template, you need to expose two parameters via CGS:
    - VM name, to allow indicating which instance is primary or secondary
    - Deployment policy, to control whether VM deployment is allowed or not
  - In the NFDV, you need to parameterize `deployParameters` and `templateParameters` in such a way that you can supply the unique values by using CGVs for each.

## Troubleshooting considerations
During installation and upgrade, by default:
- The `atomic` and `wait` options are set to `true`.
- The operation timeout is set to `27 minutes`.

During initial onboarding, only while you're still debugging and developing artifacts, we recommend that you set the `atomic` flag to `false`. This setting prevents a Helm rollback upon failure and retains any logs or errors that might otherwise be lost. The optimal way to accomplish it is in the ARM template of the NF. In the ARM template, add the following section:

```
<pre>
"roleOverrideValues": [
    "{\"name\":\"<b>NF_component_name></b>\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"options\":{\"installOptions\":{\"atomic\":\"false\",\"wait\":\"true\",\"timeout\":\"100\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"4\"}}}}}"
]
</pre>
```

The component name is defined in the NFDV:

```
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
```

> [!IMPORTANT]
> Be sure to set `atomic` and `wait` back to `true` after initial onboarding is complete.

## Cleanup considerations
When you're cleaning up resources, the order is important. Deleting resources out of order can result in orphaned resources left behind.

### Operator resources
As the first step toward cleaning up a deployed environment, delete operator resources in the following order:
1. SNS
1. Site
1. CGV

You can proceed to delete other environment resources, such as the Nexus Kubernetes cluster, only after you successfully delete these operator resources.

### Publisher resources
As the first step toward cleaning up an onboarded environment, delete publisher resources in the following order:
1. NSDV
1. NSDG
1. NFDV
1. NFDG
1. Artifact manifest
1. Artifact store
1. Publisher

> [!IMPORTANT]
> Be sure to delete the SNS before you delete the NFDV.

Azure Operator Service Manager doesn't delete namespaces as part of any deletion operation. As such, after all resources are deleted, some artifacts might remain on the cluster. To remove any remaining artifacts, you should delete any workload namespaces created on the cluster. Including the namespace deletion operation as part of the workflow pipeline is a recommendation to automate the action.
