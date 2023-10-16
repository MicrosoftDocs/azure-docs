---
title: Publisher resource preview management
description: Learn about publisher resource preview management.
author: sherrygonz
ms.author: sherryg
ms.date: 09/11/2023
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Publisher resource preview management

This article introduces the Publisher Resource Preview Management feature.

## Overview

The Azure Network Function Manager (NFM) Publisher API offers partners a seamless Azure Marketplace experience for onboarding Network Functions (NF) and Network Service Designs (NSDs).

The Publisher API introduces features that enable Network Function (NF) Publishers and Service Designers to manage Network Function Definition (NFD) and Network Service Design (NSD) in various modes. These modes empower partners to exercise control over Network Function Definition (NFD) and Network Service Design (NSD) usage. Control over the NFDs and NSDs allows partners to target specific subscriptions, all subscriptions, or deprecate an NFDVersion or NSDVersion if there are regressions. This article delves into the specifics of these different modes.

The Publisher Resource Preview Management feature in Azure Network Function Manager empowers partners to seamlessly manage Network Function Definitions and their versions. With the ability to control deployment states, access privileges, and version management, partners can ensure a smooth experience for their customers while maintaining the quality and stability of their offerings.

## Network Function and Network Service Design definition version states

The following table provides Network Function (NF) and Network Service Design (NSD) definition version state information.

|State  |Description  |Users  |Is Immutable  |
|---------|---------|---------|---------|
|**Preview**     |     Default state upon NFDVersion or NSDVersion creation; indicates pending testing.    |    Same subscription as Publisher.     |    No     |
|**Active**    |   Signifies readiness for customer usage.      |    Access based on RBS, any subscription in same tenant.     |      Yes   |
|**Deprecated**     |  Implies regression found; prevents new deployments from this version.       |    Can't be deployed.     |     Yes    |

## Network Function and Network Service Design definition state machine

- Preview is the default state.
- Deprecated state is a terminal state but can be reversed.

## NFDVersion state machine

1. Preview (Default)
1. Active
1. Deprecated (Terminal)


### Property explanation

The following table contains property information.


|Property  |Description |
|---------|---------|
|type    |      Enumeration of subscription or tenant.   |
|name     |    Name of the defined type, which can be a subscription ID or tenant ID.     |
|scope    |     Enumeration of the options shown here:
| | **All:** Allows private access to all specified publisher resources.
| |**NetworkFunctionDefinitionVersion:** Enables deployment of preview Network Function Definition Versions.
| |**NetworkServiceDesignVersion:** Enables deployment of preview Network Service Design Versions.
| | **Artifact:** Permits artifact download via the proxy API. An example use case is operator image scanning.

## Update Network Function definition version state

Use the following API to update the state of a Network Function (NF) and Network Service Design (NSD) definition version.

### HTTP Method: POST

### URL

```http
https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.HybridNetwork/publishers/{publisherName}/networkfunctiondefinitiongroups/{networkfunctiondefinitiongroups}/networkfunctiondefinitionversions/{networkfunctiondefinitionversions}/updateState?api-version=2023-09-01
```


### URI parameters

The following table describes the parameters used with the preceding URL.

|Name  |Description |
|---------|---------|
|subscriptionId     |  The subscription ID.
|resourceGroupName    |       The name of the resource group.  |
|publisherName    |      The name of the publisher.   |
|networkfunctiondefinitiongroups | The name of the network function definition groups.
|networkfunctiondefinitionversions | The network function definition version. |
|api-version | The API version to use for this operation. |


### Request body

```json
{
    "versionState": "Active | Deprecated"
}
``````

## Update Network Service Design Version (NSDV) definition version state

Use the following API to update the state of a Network Service Design Version (NSDV) definition version.

### HTTP Method: POST

### URL

```http
https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.HybridNetwork/publishers/{publisherName}/networkservicedesigngroups/{nsdName}/networkservicedesignversions/{nsdVersion}/updateState?api-version=2023-09-01
```


### URI parameters

The following table describes the parameters used with the preceding URL.

|Name  |Description |
|---------|---------|
|subscriptionId     |  The subscription ID.
|resourceGroupName    |       The name of the resource group.  |
|publisherName    |      The name of the publisher.   |
|networkfunctiondefinitiongroups | The name of the network function definition groups.
|networkfunctiondefinitionversions | The network function definition version. |
|api-version | The API version to use for this operation. |


### Request body

```json
{
    "versionState": "Active | Deprecated"
}
``````