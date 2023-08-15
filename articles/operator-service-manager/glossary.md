---
title: Glossary for Azure Operator Service Manager
description: Learn about terminology specific to Azure Operator Service Manager.
author: sherrygonz
ms.author: sherrygonz
ms.date: 08/15/2023
ms.topic: Glossary
ms.service: azure-operator-service-manager
---

# Glossary: Azure Operator Service Manager
The following article contains terms used throughout the Azure Operator Service Manager documentation.

The following diagram shows the resource relationships amongst the AOSM components.

:::image type="content" source=".\media\resource-relationships.png" alt-text="Screenshot of the resource relationships that show how the Publisher resource interacts with the other resources including Artifact Store and Artifact Manifest.  Site and Site Network Service feed into Network Function Definition Groups and Versions. Configuration Group Values feed into Network Service Design Service Groups and Versions. Lastly,  the Network Function associated with the Configuration Group Schema." border="false":::

## Publisher
The Publisher resource enables the onboarding of Network Functions (NFs) to AOSM and the definition of Network Services composed from those NFs. It includes child resources like NFDVersions, NSDVersions, Config Group Schemas and an Artifact Store. You can upload container images and VHDs to the Artifact Store through the Publisher.

## Artifact Store
The Artifact Store resource manages images and artifacts (for example, ARM templates and Helm charts) in AOSM. It ensures proper storage and prevents accidental mismanagement, like deleting images still in use by operators. 

## Artifact Manifest
The Artifact Manifest verifies if all the artifacts referenced by NSDVersions or NFDVersions have been uploaded. It handles credential generation for push access to the Artifact Store. The Artifact Manifest also controls push access credentials to the Artifact Store.

## NFVI
NFVI represents a location where a Network Function can be instantiated, such as a Kubernetes cluster, ASE box, or an Azure region.

## Site
A Site is the collection of assets that represent one or more instances of nodes in a network service. 
You could choose to use it to represent any of the following, for example:
- A physical location such as DC or rack(s).
- A node in the network that needs to be upgraded separately (early or late) vs other nodes.
- Resources serving particular class of customer.
The Site resource allows you to collect NFVIs and instantiate a Site Network Service. Sites can be within a single Azure region or an on-premises location. If colocated, they can span multiple NFVIs (for example multiple K8s clusters in a single Azure region).

## Network Service Design (NSD)
NSD describes a network service of a specific type, created and uploaded by the designer. NSDs have multiple versions (NSDVersions), which include mapping rules, references to Config Group Schemas, resource element templates, and Site information.

## Site Network Service (SNS)
SNS is a part of a Network Service Instance and is restricted on a single site. Each SNS references a specific version of a Network Service Design.

## Network Function (NF)
NF represents an individual network function that provides a self-contained function. It can be as simple as a VM or as complex as a multi-component configuration. NFs are always associated with a single site.

## Network Function Definition (NFD) / Network Function Definition Version (NFDV)
NFD represents the definition of a specific network function, created and uploaded by the publisher. NFDs have multiple versions known as NFDVersions.

## Containerized Network Function (CNF)
CNF is a network function described by Helm charts and delivered as container images. AOSM supports CNFs on Arc-enabled Kubernetes clusters and AKS.

## Virtualized Network Function (VNF)
VNF is a network function described by an ARM template and delivered as a VHD. AOSM supports VNFs deployed on Azure Core and Operator Nexus.

## Config Groups
Config Groups are partitions of the Site Network Service configuration defined by each NSD. They're instantiated as Config Group Values, which are JSON configurations matching specific JSON schemas called Config Group Schemas.
