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

Microsoft has developed many proven practices for managing Network Functions (NFs) using Azure Operator Service Manager (AOSM). This article provides guidelines that Network Function (NF) vendors, telco operators and their system integrators (SIs) can follow to optimize the design. Keep these practices in mind when onboarding and deploying your Network Functions (NFs).

## Technical overview

Onboard an MVP first.  You can add config detail in subsequent versions. Structure your artifacts to align with planned use if possible. Separate globally defaulted artifacts from those artifacts you want to vary by site.

-  Achieve maximum benefit from Azure Operator Service Manager (AOSM) by considering service composition of multiple Network Functions (NFs) with a reduced, templated config set that matches the needs of your network vs exposing hundreds of config settings you don't use.

-  Think early on about how you want to separate infrastructure (for example, clusters) or artifact stores and access between suppliers, in particular within a single service.  Make your set of publisher resources match to this model

-  Sites are a logical concept.  It's natural that many users equate them to a physical edge site. There are use cases where multiple sites share a physical location (canary vs prod resources).

-  Remember that Azure Operator Service Manager (AOSM) provides various APIs making it simple to combine with ADO or other pipeline tools, if desired.

## Publisher recommendations and considerations

- We recommend you create a single publisher per Network Function (NF) supplier. 

- Consider relying on the versionState (Active/Preview) of NFDVs and NSDVs to distinguish between those used in production vs the ones used for testing/development purposes. You can query the versionState on the NFDV and NSDV resources to determine which ones are Active and so immutable. For more information, see [Publisher Tenants, subscriptions, regions and preview management](publisher-resource-preview-management.md).

- Consider using agreed upon naming convention and governance techniques to help address any remaining gaps.

## Network Function Definition Group and Version considerations

The **Network Function Definition Version** (NFDV) is the smallest component you're able to reuse independently across multiple services. All components of a Network Function Definition Version (NFDV) are always deployed together.  These components are called networkFunctionApplications. 

For **Containerized Network Function Definition Versions** (CNF NFDVs), the networkFunctionApplications list can only contain helm packages. It's reasonable to include multiple helm packages if they're always deployed and deleted together.

For **Virtualized Network Function Definition Versions** (VNF NFDVs), the networkFunctionApplications list must contain one VhdImageFile and one ARM template.  It's unusual to include more than one VhdImageFile and more than one ARM template. Unless you have a strong reason not to, the ARM template should deploy a single VM. The Service Designer should include numerous copies of the **Network Function Definition** (NFD) with the **Network Service Design** (NSD) if you want to deploy multiple VMs.

Single **Network Function Definition Group** (NFDGs) can have multiple **Network Function Definition Version** (NFDVs).

**Network Function Definition Versions** (NFDVs) should reference fixed images and charts. An update to an image version or chart means an update to the NFDV major or minor version. For a containerized Network Function (CNF) each helm chart should contain fixed image repositories and tags that aren't customizable by deployParameters. 

### Common use cases that trigger Network Function Design Version (NFDV) minor or major version update

- Updating **Configuration Group Schema** (CGS) / **Configuration Group Value** (CGV) for an existing release that triggers changing the deployParametersMappingRuleProfile.

- Updating values that are hard coded in the **Network Function Design Version** (NFDV).  

- Marking components inactive to prevent them from being deployed via ‘applicationEnablement: 'Disabled.'

- New Network Function (NF) release (charts, images, etc.)

## Network Service Design Group and Version considerations

A **Network Service Design** (NSD) is a composite of one or more **Network Function Definitions** (NFD) and any infrastructure components deployed at the same time. A **Site Network Service** (SNS) refers to a single **Network Service Design**. It's recommended that the **Network Service Design** includes any infrastructure required (NAKS/AKS clusters, virtual machines, etc.) and then deploys the network functions required on top. Such design guarantees consistent and repeatable deployment of entire site from a single SNS PUT.

An example of a Network Service Design (NSD) is:

- (1) AUSF NF
- (2) UDM NF
- (3) admin VM supporting AUSF/UDM
- (4) UC SMF NF
- (5) NAKS cluster which AUSM, UDM, and SMF are deployed to

These five components form a single **Network Service Design** (NSD). Single **Network Service Designs** (NSDs) can have multiple **Network Service Design Versions** (NSDVs). The collection of all NSDVs for a given NSD is known as a **Network Service Design Group** (NSDG).

### Common use cases that trigger Network Service Design Version (NSDV) minor or major version update

- Create or delete **Configuration Group Schema** (CGS).

- Changes in the **Network Function** (NF) ARM template associated with one of the **Network Functions** (NFs) being deployed.

* Changes in the infrastructure ARM template, for example, AKS/NAKS or VM.

Changes in **Network Function Definition Version** (NFDV) shouldn't trigger a **Network Service Design Version** (NSDV) update. The versions of **Network Function Definitions** should be exposed within the **Configuration Group Schema**, so operators's can control them using **Configuration Group Values**.

## Azure Operator Service Manager (AOSM) CLI extension and Network Service Design considerations

The Azure Operator Service Manager (AOSM) CLI extension can build bicep templates that create Network Service Designs. Currently these don't include infrastructure components. Best practice is to use the CLI to build the files and then edit them to incorporate infrastructure components before publishing.

### Use the Azure Operator Service Manager (AOSM) CLI extension

The Azure Operator Service Manager (AOSM) CLI extension assists publishing of Network Function Definitions and Network Service Designs. Use this tool as the starting point for creating new Network Function Definitions and Network Service Designs. 

## Configuration Group Schema (CGS) considerations

It’s recommended to always start with a single **Configuration Group Schema** (CGS) for the entire Network Function (NF). If there are site-specific or instance-specific parameters, it’s still recommended to keep them in a single **Configuration Group Schema** (CGS). Splitting into multiple **Configuration Group Schema** (CGS) is recommended when there are multiple components (rarely, Network Functions (NFs), more commonly, infrastructure) or configurations that are shared across multiple Network Functions (NFs). The number of **Configuration Group Schema** (CGS) defines the number of **Configuration Group Values** (CGVs).

### Scenario

- FluentD, Kibana, Splunk (common 3rd-party components) are always deployed for all Network Functions (NFs) within a **Network Service Design** (NSD). We recommend these components are grouped into a single **Network Function Design Group** (NFDG).

- **Network Service Design** (NSD) has multiple Network Functions (NFs) that all share a few configurations (deployment location, publisher name, and a few chart configurations).

In this scenario, we recommend that a single global **Configuration Group Schema** (CGS) is used to expose the common NFs’ and third party components’ configurations. NF-specific **Configuration Group Schema** (CGS) can be defined as needed.

### Choose exposed parameters

General recommendations when it comes to exposing parameters via **Configuration Group Schema** (CGS): 

- Configuration Group Schema (CGS) should only have parameters that are used by Network Functions (NFs) (day 0/N configuration) or shared components.

- Parameters that are rarely configured should have default values defined.

- When multiple Configuration Group Schemas (CGS) are used, we recommend there's little to no overlap between the parameters. If overlap is required, make sure the parameters names are clearly distinguishable between the Configuration Group Schemas (CGSs).

- What can be defined via API (AKS, Azure Operator Nexus, Azure Operator Service Manager (AOSM)) should be considered for Configuration Group Schema (CGS). As opposed to, defining those configuration values via CloudInit files.

## Site Network Service (SNS)

It's recommended to have a single **Site Network Service** (SNS) for the entire site, including the infrastructure.

## Azure Operator Service Manager (AOSM) resource mapping per use case

### Scenario - single Network Function (NF)

A Network Function (NF) with one or two application components deployed to a K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

- **Network Function Definition Group** (NFDG): If components can be used independently then two Network Function Definition Groups (NFDGs), one per component. If components are always deployed together, then a single **Network Function Definition Group** (NFDG).

- **Network Function Definition Version** (NFDV): As needed based on the use cases mentioned in Common use cases that trigger **Network Function Definition Version**: (NFDV) minor or major version update.

- **Network Service Design Group** (NSDG): Single; combines the Network Function Definition(s) and the K8s cluster definitions.

- **Network Service Design Version** (NSDV): As needed based on the use cases mentioned in Common use cases that trigger **Network Service Design or Version** (NSDV) minor or major version update.

- **Configuration Group Schema** (CGS): Single; we recommend that **Configuration Group Schema** (CGS) has subsections for each component and infrastructure being deployed for easier management, and includes the versions for **Network Function Definitions**.

- **Configuration Group Value** (CGV): Single; based on the number of **Configuration Group Schema** (CGS).

- **Site Network Service** (SNS): Single per **Network Service Design Version** (NSDV).

### Scenario - multiple Network Functions (NFs)

Multiple Network Functions (NFs) with some shared and independent components deployed to a shared K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

- **Network Function Definition Group** (NFDG):
    - Single Network Function Definition Group (NFDG) for all shared components.
    - Single Network Function Definition Group (NFDG) for every independent component and/or Network Function (NF).
- **Network Function Definition Version** (NFDV): Multiple per each Network Function Definition Group (NFDG) per use cases mentioned in *Common use cases that trigger Network Function Definition Version (NFDV) minor or major version update.
- **Network Service Design Group** (NSDG): Single combining all Network Functions (NFs), shared and independent components, and infrastructure (K8s cluster and/or any supporting VMs).
- **Network Service Design Version** (NSDV): As needed based on use cases mentioned in *Common use cases that trigger Network Service Design Version (NSDV) minor or major version update*.
- **Configuration Group Schema** (CGS):
  - Single global for all components that have shared configuration values.
  - Network Function (NF) specific Configuration Group Schema (CGS) per Network Function including the version of the Network Function Definition.
  - Depending on the total number of parameters, you can consider combining all the Configuration Group Schemas (CGSs) into a single Configuration Group Schema (CGS).
- **Configuration Group Value** (CGV): Equal to the number of Configuration Group Schema (CGS).
- **Site Network Service** (SNS): Single per Network Service Design Version (NSDV).

## Software upgrade considerations

Content under development.

## Next steps

- [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md)

- [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)