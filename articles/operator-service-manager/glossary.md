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
The Artifact Manifest verifies if all the artifacts referenced by NSDVersions or NFDVersions have been uploaded. It handles credential generation for push access to the Artifact Store. The Artifact Manifest also controls push access credentials to the Artifact Store.

### Artifact Store
The Artifact Store resource manages images and artifacts (for example, Azure Resource Manager (ARM) templates and Helm charts) in Azure Operator Service Manager. It ensures proper storage and prevents accidental mismanagement, like deleting images still in use by operators.

## C

### Configuration Groups
Config Groups are partitions of the Site Network Service configuration defined by each Network Service Design. They're instantiated as Config Group Values, which are JSON configurations matching specific JSON schemas called Config Group Schemas.


### Containerized Network Function (CNF)
A Containerized Network Function (CNF) is a way to provide network functionality with the help of containers. In Azure Operator Service Manager, CNF is a network function described by Helm charts and delivered as container images. Azure Operator Service Manager supports CNFs on Arc-enabled Kubernetes clusters and Azure Kubernetes Service (AKS).

## N

### Network Function (NF)
A Network Function (NF) is a functional building block within a network infrastructure. In Azure Operator Service Manager the NF represents an individual network function that provides a self-contained function. It can be as simple as a Virtual Machine or as complex as a multi-component configuration. NFs are always associated with a single site.

### Network Function Definition (NFD) / Network Function Definition Version (NFDV)
Network Function Definition represents the definition of a specific Network Function, created and uploaded by the Publisher. NFDs have multiple versions known as NFDVersions.

### Network Function Virtualization Infrastructure (NFVI)
NFVI is a key component in Network Functions Virtualization (NFV), a network architecture concept that uses IT virtualization technologies to virtualize entire classes of network node functions into building blocks that may connect or chain together to create communication services. NFVI is represented as the location where a particular network function can be instantiated, and it can include different environments like a Kubernetes cluster, Azure Stack Edge (ASE) or a specific cloud region like Azure. This provides a flexible, scalable, and more efficient way to deploy network services, as compared to traditional hardware-based network functions.

### Network Service Design (NSD)
Network Service Design describes a network service of a specific type, created and uploaded by the Designer. NSDs have multiple versions (NSDVersions), which include mapping rules, references to Config Group Schemas, resource element templates, and Site information.

## P

### Publisher
The Publisher resource enables the onboarding of Network Functions (NFs) to the Azure Operator Service Manager and the definition of Network Services composed from those Network Functions. It includes child resources like NFDVersions, NSDVersions, Config Group Schemas and an Artifact Store. You can upload container images and Virtual Hard Disks to the Artifact Store through the Publisher.

## S

### Site
A Site is the collection of assets that represent one or more instances of nodes in a network service. 
You could choose to use it to represent any of the following, for example:
- A physical location such as DC or rack(s).
- A node in the network that needs to be upgraded separately (early or late) vs other nodes.
- Resources serving particular class of customer.
 Sites can be within a single Azure region or an on-premises location. If colocated, they can span multiple NFVIs (for example multiple K8s clusters in a single Azure region).

### Site Network Service (SNS)
A Site Network Service is part of a Network Service Instance and is restricted on a single site. Each SNS references a specific version of a Network Service Design.

## V

### Virtualized Network Function (VNF)
Network Virtual Function (NVF) refers to a virtualized network function that can be deployed on a virtual machine or container. In Azure Operator Service Manager the VNF is a network function described by an ARM template and delivered as a Virtual Hard Drive. Azure Operator Service Manager supports VNFs deployed on Azure Core and Operator Nexus.
