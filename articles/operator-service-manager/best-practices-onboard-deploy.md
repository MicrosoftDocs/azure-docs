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

## Publisher considerations

We recommend you create a single publisher per Network Function (NF) supplier. Consider relying on immutability capabilities to distinguish between resources/artifacts used in production vs the ones used for testing/development purposes. You can query the status on the publisher resources and the artifact manifest to determine which ones are marked as immutable. Consider using agreed upon naming convention and governance techniques to help address any remaining gaps.

## Network Function Design Group and Version considerations

The **Network Function Design Group** (NFDG) is the smallest component you're able to reuse independently across multiple services. All components of a Network Function Design Group (NFDG) are always deployed together. It's reasonable to have a single Network Function Design Group (NFDG) per single Network Function (NF). In cases when multiple Network Functions (NFs) are always deployed together, it’s reasonable to have a single Network Function Design Group (NFDG) for all of them. Single Network Function Design Group (NFDGs) can have multiple **Network Function Design Version** (NFDVs).

### Common use cases which trigger Network Function Design Version (NFDV) minor or major version update

- Updating **Configuration Group Schema** (CGS) / **Configuration Group Value** (CGV) for an existing release which triggers changing the deployParametersMappingRuleProfile.

- Updating values that are hard coded in the **Network Function Design Version** (NFDV).  

- Marking components inactive to prevent them from being deployed via ‘applicationEnablement: 'Enabled.'

- New Network Function (NF) release (charts, images, etc.)

## Network Service Design Group and Version considerations

**Network Service Design Group** (NSDG) is the most common combination of Network Functions (NFs) and infrastructure components being deployed together regularly. Each combination can be referred to as Stock Keeping Unit. An example of a **Network Service Design Group** (NSDG) is:
- (1) HPE AUSF + 
- (2) HPE UDM +
- (3) admin VM supporting AUSF/UDM +
- (4) UC SMF +
- (5) NAKS cluster which AUSM, UDM, and SMF are deployed to

These five components form a single **Network Service Design Group** (NSDG). Single **Network Service Design Groups** (NSDGs) can have multiple **Network Service Design Versions** (NSDVs).

### Common use cases which trigger Network Service Design Version (NSDV) minor or major version update

- Create or delete **Configuration Group Schema** (CGS).

- Changes in the Network Function (NF) ARM template associated with one of the Network Functions (NFs) being deployed.
  
- Changes in the infrastructure ARM template, for example, AKS/NAKS or VM.

## Configuration Group Schema (CGS) considerations

It’s recommended to always start with a single **Configuration Group Schema** (CGS) for the entire Network Function (NF). If there are site-specific or instance-specific parameters, it’s still recommended to keep them in a single **Configuration Group Schema** (CGS). Splitting into multiple **Configuration Group Schema** (CGS) is recommended when there are multiple components (rarely, Network Functions (NFs), more commonly, infrastructure) or configurations that are shared across multiple Network Functions (NFs). The number of **Configuration Group Schema** (CGS) defines the number of **Configuration Group Values** (CGVs).

### Scenario

- FluentD, Kibana, Splunk (common 3rd-party components) are always deployed for all Network Functions (NFs) within a **Network Service Design** (NSD). We recommend these components are grouped into a single **Network Function Design Group** (NFDG).

- **Network Service Design** (NSD) has multiple Network Functions (NFs) that all share a few configurations (deployment location, publisher name, and a few chart configurations).

### Choose exposed parameters

General recommendations when it comes to exposing parameters via **Configuration Group Schema** (CGS): 

- Configuration Group Schema (CGS) should only have parameters that are used by Network Functions (NFs) (day 0/N configuration) or shared components.

- Parameters that are rarely configured should have default values defined.

- When multiple Configuration Group Schema (CGS) are used, we recommend there's little to no overlap between the parameters. If overlap is required, make sure the parameters names are clearly distinguishable between the Configuration Group Schemas (CGSs).

- What can be defined via API (AKS, Azure Operator Nexus, Azure Operator Service Manager (AOSM)) should be considered for Configuration Group Schema (CGS). As opposed to, defining those configuration values via CloudInit files.

## Site Network Service (SNS)

It's recommended to have a single **Site Network Service** (SNS) for the entire site, including the infrastructure. The **Site Network Service** (SNS) should deploy any infrastructure required (NAKS/AKS clusters, virtual machines, and so on) and then deploy the network functions required on top. Such design guarantees consistent and repeatable deployment of entire site from a single PUT command.

## Azure Operator Service Manager (AOSM) resource mapping per use case

### Scenario - single Network Function (NF)

A Network Function (NF) with one or two application components deployed to a K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

- **Network Function Design Group** (NFDG): If components can be used independently then two Network Function Design Groups (NFDGs), one per component. If components are always deployed together, then a single Network Function Design Group (NFDG).

- **Network Function Design Version** (NFDV): As needed based on the use cases mentioned in *Common use cases which trigger Network Function Design Version (NFDV) minor or major version update*. 

- **Network Service Design Group** (NSDG): Single; combines both application components and the K8s cluster definitions.

- **Network Service Design Version** (NSDV): As needed based on the use cases mentioned in *Common use cases which trigger Network Service Design or Version (NSDV) minor or major version update*.

- **Configuration Group Schema** (CGS): Single; we recommend that Configuration Group Schema (CGS) has subsections for each component and infrastructure being deployed for easier management.

- **Configuration Group Value** (CGV): Single; based on the number of Configuration Group Schema (CGS). 

- **Site Network Service** (SNS): Single per Network Service Design Version (NSDV).

### Scenario - multiple Network Functions (NFs)

Multiple Network Functions (NFs) with some shared and independent components deployed to a shared K8s cluster.

Azure Operator Service Manager (AOSM) resources breakdown:

- **Network Function Design Group** (NFDG):
    - Single Network Function Design Group (NFDG) for all shared components.
    - Single Network Function Design Group (NFDG) for every independent component and/or Network Function (NF).
- **Network Function Design Version** (NFDV): Multiple per each Network Function Design Group (NFDG) per use cases mentioned in *Common use cases which trigger Network Function Design Version (NFDV) minor or major version update.
- **Network Service Design Group** (NSDG): Single combining all Network Functions (NFs), shared and independent components, and infrastructure (K8s cluster and/or any supporting VMs).
- **Network Service Design Version** (NSDV): As needed based on use cases mentioned in *Common use cases which trigger Network Service Design Version (NSDV) minor or major version update*.
- **Configuration Group Schema** (CGS):
  - Single global for all components that have shared configuration values.
  - Network Function (NF) specific Configuration Group Schema (CGS) per Network Function.
  - Depending on the total number of parameters, you can consider combining all the Configuration Group Schemas (CGSs) into a single Configuration Group Schema (CGS).
- **Configuration Group Value** (CGV): Equal to the number of Configuration Group Schema (CGS).
- **Site Network Service** (SNS): Single per Network Service Design Version (NSDV).

## Software upgrade considerations

Content under development.

## Next steps

- [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md)

- [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)