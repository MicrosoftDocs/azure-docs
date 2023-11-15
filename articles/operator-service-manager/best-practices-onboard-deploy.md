---
title: Best practices for Azure Operator Service Manager
description: Understand Best Practices for Azure Operator Service Manager to onboard and deploy a Network Function (NF).
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: best-practice
ms.service: azure-operator-service-manager
---

# Azure Operator Service Manager Best Practices to onboard and deploy a Network Function (NF)

Microsoft has developed many proven practices for managing Network Functions (NFs) using Azure Operator Service Manager (AOSM). This article provides guidelines that NF vendors, telco operators and their System Integrators (SIs) can follow to optimize the design. Keep these practices in mind when onboarding and deploying your NFs.

## Technical overview

- Onboard an MVP first.

- You can add config detail in subsequent versions.

- Structure your artifacts to align with planned use if possible.
- Separate globally defaulted artifacts from those artifacts you want to vary by site.

-  Achieve maximum benefit from Azure Operator Service Manager (AOSM) by considering service composition of multiple NFs with a reduced, templated config set that matches the needs of your network vs exposing hundreds of config settings you don't use.

-  Think early on about how you want to separate infrastructure (for example, clusters) or artifact stores and access between suppliers, in particular within a single service.  Make your set of publisher resources match to this model

-  Sites are a logical concept.  It's natural that many users equate them to a physical edge site. There are use cases where multiple sites share a physical location (canary vs prod resources).

-  Remember that Azure Operator Service Manager (AOSM) provides various APIs making it simple to combine with ADO or other pipeline tools, if desired.

## Publisher recommendations and considerations

- We recommend you create a single publisher per NF supplier. 

- Consider relying on the versionState (Active/Preview) of NFDVs and NSDVs to distinguish between those used in production vs the ones used for testing/development purposes. You can query the versionState on the NFDV and NSDV resources to determine which ones are Active and so immutable. For more information, see [Publisher Tenants, subscriptions, regions and preview management](publisher-resource-preview-management.md).

- Consider using agreed upon naming convention and governance techniques to help address any remaining gaps.

## Network Function Definition Group and Version considerations

The Network Function Definition Version (NFDV) is the smallest component you're able to reuse independently across multiple services. All components of an NFDV are always deployed together.  These components are called networkFunctionApplications. 

For Containerized Network Function Definition Versions (CNF NFDVs), the networkFunctionApplications list can only contain helm packages. It's reasonable to include multiple helm packages if they're always deployed and deleted together.

For Virtualized Network Function Definition Versions (VNF NFDVs), the networkFunctionApplications list must contain one VhdImageFile and one ARM template.  It's unusual to include more than one VhdImageFile and more than one ARM template. Unless you have a strong reason not to, the ARM template should deploy a single VM. The Service Designer should include numerous copies of the Network Function Definition (NFD) within the Network Service Design (NSD) if you want to deploy multiple VMs.  The ARM template (for both AzureCore and Nexus) can only deploy ARM resources from the following Resource Providers:

- Microsoft.Compute

- Microsoft.Network

- Microsoft.NetworkCloud

- Microsoft.Storage

- Microsoft.NetworkFabric

- Microsoft.Authorization

- Microsoft.ManagedIdentity

Single Network Function Definition Group (NFDGs) can have multiple NFDVs.

NFDVs should reference fixed images and charts. An update to an image version or chart means an update to the NFDV major or minor version. For a Containerized Network Function (CNF) each helm chart should contain fixed image repositories and tags that aren't customizable by deployParameters. 

### Common use cases that trigger Network Function Design Version (NFDV) minor or major version update

- Updating CGS / CGV for an existing release that triggers changing the deployParametersMappingRuleProfile.

- Updating values that are hard coded in the NFDV.  

- Marking components inactive to prevent them from being deployed via ‘applicationEnablement: 'Disabled.'

- New NF release (charts, images, etc.)

## Network Service Design Group and Version considerations

An NSD is a composite of one or more NFD and any infrastructure components deployed at the same time. An SNS refers to a single NSD. It's recommended that the NSD includes any infrastructure required (NAKS/AKS clusters, virtual machines, etc.) and then deploys the NFs required on top. Such design guarantees consistent and repeatable deployment of entire site from a single SNS PUT.

An example of an NSD is:

- Authentication Server Function (AUSF) NF
- Unified Data Management (UDM) NF
- Admin VM supporting AUSF/UDM
- Unity Cloud (UC) Session Management Function (SMF) NF
- Nexus Azure Kubernetes Service (NAKS) cluster which AUSF, UDM, and SMF are deployed to

These five components form a single NSD. Single NSDs can have multiple NSDVs. The collection of all NSDVs for a given NSD is known as an NSDG.

### Common use cases that trigger Network Service Design Version (NSDV) minor or major version update

- Create or delete CGS.

- Changes in the NF ARM template associated with one of the NFs being deployed.

* Changes in the infrastructure ARM template, for example, AKS/NAKS or VM.

Changes in NFDV shouldn't trigger an NSDV update. The versions of an NFD should be exposed within the CGS, so operator's can control them using CGVs.

## Azure Operator Service Manager (AOSM) CLI extension and Network Service Design considerations

The Azure Operator Service Manager (AOSM) CLI extension assists publishing of NFDs and NSDs. Use this tool as the starting point for creating new NFD and NSD. 

Currently NSDs created by the Azure Operator Service Manager (AOSM) CLI extension don't include infrastructure components. Best practice is to use the CLI to create the initial files and then edit them to incorporate infrastructure components before publishing.

### Use the Azure Operator Service Manager (AOSM) CLI extension

The Azure Operator Service Manager (AOSM) CLI extension assists publishing of Network Function Definitions (NFD) and Network Service Designs (NSD). Use this tool as the starting point for creating new NFD and NSD. 

## Configuration Group Schema (CGS) considerations

It’s recommended to always start with a single CGS for the entire NF. If there are site-specific or instance-specific parameters, it’s still recommended to keep them in a single CGS. Splitting into multiple CGS is recommended when there are multiple components (rarely NFs, more commonly, infrastructure) or configurations that are shared across multiple NFs. The number of CGS defines the number of CGVs.

### Scenario

- FluentD, Kibana, Splunk (common 3rd-party components) are always deployed for all NFs within an NSD. We recommend these components are grouped into a single NFDG.

- NSD has multiple NFs that all share a few configurations (deployment location, publisher name, and a few chart configurations).

In this scenario, we recommend that a single global CGS is used to expose the common NFs’ and third party components’ configurations. NF-specific CGS can be defined as needed.

### Choose exposed parameters

General recommendations when it comes to exposing parameters via CGS: 

- CGS should only have parameters that are used by NFs (day 0/N configuration) or shared components.

- Parameters that are rarely configured should have default values defined.

- When multiple CGSs are used, we recommend there's little to no overlap between the parameters. If overlap is required, make sure the parameters names are clearly distinguishable between the CGSs.

- What can be defined via API (AKS, Azure Operator Nexus, Azure Operator Service Manager (AOSM)) should be considered for CGS. As opposed to, defining those configuration values via CloudInit files.

- A single User Assigned Managed Identity should be used in all the Network Function ARM templates and should be exposed via CGS.

## Site Network Service (SNS)

It's recommended to have a single SNS for the entire site, including the infrastructure.

It's recommended that every SNS is deployed with a User Assigned Managed Identity (UAMI) rather than a System Assigned Managed Identity. This UAMI should have permissions to access the NFDV, and needs to have the role of Managed Identity Operator on itself. It's usual for Network Service Designs to also require this UAMI to be provided as a Configuration Group Value, which is ultimately passed through and used to deploy the Network Function. For more information, see [Create and assign a User Assigned Managed Identity](how-to-create-user-assigned-managed-identity.md).

## Azure Operator Service Manager (AOSM) resource mapping per use case

### Scenario - single Network Function (NF)

An NF with one or two application components deployed to a K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

- NFDG: If components can be used independently then two NFDGs, one per component. If components are always deployed together, then a single NFDG.

- NFDV: As needed based on the use cases mentioned in Common use cases that trigger NFDV minor or major version update.

- NSDG: Single; combines the NFs and the K8s cluster definitions.

- NSDV: As needed based on the use cases mentioned in Common use cases that trigger NSDV minor or major version update.

- CGS: Single; we recommend that CGS has subsections for each component and infrastructure being deployed for easier management, and includes the versions for NFDs.

- CGV: Single; based on the number of CGS.

- SNS: Single per NSDV.

### Scenario - multiple Network Functions (NFs)

Multiple NFs with some shared and independent components deployed to a shared K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

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

## Next steps

- [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md)

- [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)
