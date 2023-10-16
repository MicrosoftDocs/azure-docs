---
title: Glossary for Azure Operator Service Manager
description: Learn about terminology specific to Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 08/15/2023
ms.topic: glossary
ms.service: azure-operator-service-manager
---

# Glossary: Azure Operator Service Manager
The following article contains terms used throughout the Azure Operator Service Manager documentation.

## A

### Artifact Manifest
The Artifact Manifest contains a dictionary of artifacts, in a given artifact store, together with type and version. A Publisher only uploads artifacts that are listed in the manifest.  The Artifact Manifest also handles credential generation for push access to the Artifact Store. The Artifact Manifest controls push access credentials to the Artifact Store.

### Artifact Store
The Artifact Store serves as the Azure Resource Manager (ARM) resource responsible for housing all the resources needed to create Network Functions and Network Services. The Artifact Store acts as a centralized repository for various components, including:
- Helm charts.
- Docker images for Containerized Network Functions (CNF).
- Virtual Machine (VM) images for Virtualized Network Functions (VNF).
- Other assets like ARM templates required throughout the Network Function creation process.

Artifact Store comes in two flavors:
1. Azure Storage Account for storing VM images.
1. Azure Container Registry for storing all other artifact types.

## C

### Configuration Group Schema (CGS)
A json schema, defining inputs required by a Network Service Design Version (NSDV).  The Service Designer creates one or more Configuration Group Schemas (CSGs) in the process of creating a Network Service Design Version (NSDV).

### Configuration Group Values

Configuration Group Values are json blobs that define the inputs parameters for the Site Network Service (SNS).  There are one or more Configuration Group Values (CGVs) associated with each Site Network Service (SNS).  The contents of a Configuration Group Value (CGV) must adhere to the Configuration Group Schema (CGS) associated with the Network Service Design Version (NSDV) selected for the Site Network Service (SNS). 

### Containerized Network Function (CNF)
A Containerized Network Function (CNF) is a network function described by Helm charts and delivered as container images. Azure Operator Service Manager (AOSM) supports CNFs on Arc-enabled Kubernetes clusters and AKS.

## N

### Network Function (NF)
Network Functions (NFs) come in two flavors: Containerized Network Function (CNFs) and Virtualized Network Functions (VNFs).  Network Functions are units of function that can be combined together into a service.

### Network Function Definition (NFD) / Network Function Definition Version (NFDV)
A Network Function Definition Group (NFDG) is a collection of all the versions of a Network Function Definitions (NFDs). Network Function Definitions (NFDs) have multiple versions known as NFDVersions. A NetworkFunctionDefinitionVersion resource is an immutable instance solution definition once it's set to *Active*. The Publisher on-boards a NetworkFunctionDefinitionVersion resource by providing binaries, configuration, and mapping rules. 

A Network Function Definition Version (NFDV) is a template for deploying a Network Function (NF) on a particular version.  The collection of all Network Function Definition Version (NFDVs) for a given Network Function (NF) is known as a Network Function Definition Group (NFDG).

### Network Function Virtualization Infrastructure (NFVI)
A Network Function Virtualization Infrastructure (NFVI) represents a location where a Network Function (NF) can be instantiated, such as a Custom location of an Arc-enabled Kubernetes cluster or an Azure region.

### Network Service Design (NSD)
A Network Service Design (NSD) describes a network service of a specific type, created and uploaded by the designer. Network Service Designs (NSDs) have multiple versions (NSDVersions). The NSDVersions include mapping rules, references to Config Group Schemas and resource element templates.

## P

### Publisher
The Publisher resource enables the onboarding of Network Functions (NFs) to Azure Operator Service Manager (AOSM) and the definition of Network Services composed from those Network Functions (NFs). The Publisher includes child resources:
- NSDVersions
- NFDVersions
- Config Group Schemas
- Artifact Store

You can upload container images and VHDs to the Artifact Store through the Publisher.

## S

### Site
A *Site* refers to a specific location, which can be either a single Azure region (a data center location within the Azure cloud) or an on-premises facility, associated with the instantiation and management of network services. A *Site* serves as the fundamental unit for making updates, where all changes are independently applied to individual sites. 

A *Site* encompasses the concept of global changes, wherein multiple independent operations are sequentially deployed across multiple sites, typically following safe deployment practices.

A *Site* is a collection of Network Function Virtualization Infrastructure (NFVIs) that are grouped together to form the platform on which a Site Network Service (SNS) runs.  Typically all the Network Function Virtualization Infrastructure (NFVIs) within a site are grouped together geographically (for example all within the same Azure Region or Nexus cluster), but there can be exceptions to this rule.

### Site Network Service (SNS)
A Site Network Service (SNS) consists of a collection of Network Functions (NFs) along with Azure infrastructure all working together to deliver a cohesive unit of service. A Site Network Service (SNS) is instantiated by selecting a Network Service Design Version (NSDV) and supplying parameters in the form or Configuration Group Values (CGVs) and a Site.

## V

### Virtualized Network Function (VNF)
A Virtualized Network Function (VNF) is a Network Function (NF) described by an Azure Resource Manager (ARM) template and delivered as a VHD. Azure Operator Service Manager (AOSM) supports Virtualized Network Functions (VNFs) deployed on Azure Core and Operator Nexus.
