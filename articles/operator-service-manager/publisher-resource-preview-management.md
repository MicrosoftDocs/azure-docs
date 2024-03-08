---
title: Publisher resource preview management
description: Learn about publisher resource preview management.
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: concept-article
ms.service: azure-operator-service-manager
ms.custom:
---

# Publisher Tenants, subscriptions, regions and preview management

This article introduces the Publisher Resource Preview Management feature.

## Overview

The Azure Network Function Manager (NFM) Publisher API offers partners a seamless Azure Marketplace experience for onboarding Network Functions (NF) and Network Service Designs (NSDs).

The Publisher API introduces features that enable Network Function (NF) Publishers and Service Designers to manage Network Function Definition (NFD) and Network Service Design (NSD) in various modes. These modes empower partners to exercise control over Network Function Definition (NFD) and Network Service Design (NSD) usage. Control over the NFDs and NSDs allows partners to target specific subscriptions, all subscriptions, or deprecate an NFDVersion or NSDVersion if there are regressions. This article delves into the specifics of these different modes.

The Publisher Resource Preview Management feature in Azure Network Function Manager empowers partners to seamlessly manage Network Function Definitions and their versions. With the ability to control deployment states, access privileges, and version management, partners can ensure a smooth experience for their customers while maintaining the quality and stability of their offerings.

## Tenants, subscriptions and regions

Do my publisher and Site Network Service (SNS) resources need to be in the same tenant, subscription or region?

- Publisher Network Service Design Version (**NSDV**) and Network Function Definition Version (**NFDV**) resources must be in the same Azure tenant as Site Network Services (**SNS**) resources.

- Network Service Design Version (**NSDV**) and  Network Function Definition Version (**NFDV**) versionState are key for cross-subscription. 
  - Preview = Site Network Service (**SNS**) is deployable in the same subscription as the  Network Function Definition Version/Network Function Definition Version (**NSDV/NFDV**).
  - Active = Site Network Service (**SNS**) is deployable in any *subscription*.
- Publisher resources can be in different Azure Core or Nexus Regions to Site Network Service (**SNS**) resources. 

- Publisher names must be unique within a region.

- Site Network Service (**SNS**) can reference Configuration Group Values (**CGVs**) from any region, but can only reference Site resources from the same region.

- Configuration Group Values (**CGVs**) can reference a Configuration Group Schema (**CGS**) in any region.

- Network Functions:
  * Can reference NFDVersion from any region.
  * Must reference Azure Stack Edge from the same region, if hosted on Azure Stack Edge.
  * The ARM template within a Virtual Network Function must deploy resources to the same region as the Network Function.
  * CNFs can reference customLocation from any region.

## Network Function Definition and Network Service Design version states

The following table provides Network Function Definition (NFD) and Network Service Design (NSD) version state information.

|State  |Description  |Users  |Is Immutable  |
|---------|---------|---------|---------|
|**Preview**     |     Default state upon NFDVersion or NSDVersion creation; indicates pending testing.    |    Same subscription as Publisher.     |    No     |
|**Active**    |   Signifies readiness for customer usage. Artifacts must be immutable with artifactManifestState Uploaded.    |    Access based on RBS, any subscription in same tenant.     |      Yes   |
|**Deprecated**     |  Implies regression found; prevents new deployments from this version.       |    Can't be deployed.     |     Yes    |

## Artifact Manifest state machine

 - Uploading means the state is mutable and the artifacts within the manifest can be altered.
 
 - Uploaded means the state is immutable and the artifacts within the manifest can't be altered.
 
Immutable artifacts are tested artifacts that can't be modified or overwritten. Use of immutable artifacts with Azure Operator Service Manager ensures consistency, reliability and security of its artifacts across different environments and platforms. Network Function Definition Versions and Network Service Design Versions with versionState Active are enforced to deploy immutable artifacts.  

 
 ### Update Artifact Manifest state
 Use the following Azure CLI command to change the state of a artifact manifest resource.
 
```azurecli
  az aosm publisher artifact-manifest update-state \
    --resource-group <myResourceGroupName> \
    --publisher-name <myPublisherName> \
    --artifact-store-name <myArtifactStoreName> \
    --name <myArtifactManifestName> \
    --state Uploaded
```

## Network Function Definition and Network Service Design state machine

- Preview is the default state.
- Deprecated state is a terminal state but can be reversed.

## Update Network Function definition version state
Use the following Azure CLI command to change the state of a Network Function Definition Version resource.

```azurecli
  az aosm publisher network-function-definition version update-state \
    --resource-group <myResourceGroup> \
    --publisher-name <myPublisherName> \
    --group-name <myNetworkFunctionDefinitionGroupName> \
    --version-name <myNetworkFunctionDefinitionVersionName> \
    --version-state Active | Deprecated
```

## Update Network Service Design Version (NSDV) version state
Use the following Azure CLI command to change the state of a Network Service Design Version resource.

```azurecli
  az aosm publisher network-service-design version update-state \
    --resource-group <myResourceGroup> \
    --publisher-name <myPublisherName> \
    --group-name <myNetworkServiceDesignGroupName> \
    --version-name <myNetworkServiceDesignVersionName> \
    --version-state Active | Deprecated
```
