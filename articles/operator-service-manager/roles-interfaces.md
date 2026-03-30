---
title: Roles and Interfaces for Azure Operator Service Manager
description: Learn about the various roles and interfaces for Azure Operator Service Manager.
author: sherryg
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Roles and interfaces for Azure Operator Service Manager

Azure Operator Service Manager provides three distinct interfaces that cater to three roles:

- Network function (NF) publisher
- Service designer
- Service operator

In practice, the same person can perform more than one of these roles if necessary.

:::image type="content" source="media/roles-interfaces-diagram.png" alt-text="Diagram that shows three interfaces catering to three roles: publisher, designer, and operator." lightbox="media/roles-interfaces-diagram.png":::

## NF publisher

The NF publisher creates and publishes network functions to Azure Operator Service Manager. NF publisher responsibilities include:

- Create the network function.
- Encode the network function in a network function definition (NFD).
- Determine the deployment parameters to expose to the service designer.
- Onboard the NFD to Azure Operator Service Manager.
- Upload the associated artifacts.
- Validate the NFD.

The NF publisher is responsible for creating and updating these Azure Operator Service Manager resources:

- Publisher
- Artifact store
- Artifact manifest
- Network function definition group (NFDG)
- Network function definition version (NFDV)

## Service designer

The service designer is responsible for building a network service design (NSD). The service designer collects NFDs from various NF publishers. When collection of the NFDs is complete, the service designer combines them with the Azure infrastructure to create a cohesive service.

The service designer determines how to parametrize the service by defining one or more configuration group schemas (CGSs). The CGSs define the inputs that the service operator must supply in the configuration group values (CGVs).

The service designer determines how inputs from the service operator map to parameters that the NF publishers and the Azure infrastructure require.

As part of creating the network service design, the service designer must consider the upgrade and scaling requirements of the service.

The service designer is responsible for creating and updating the following Azure Operator Service Manager objects:

- Publisher
- Artifact store
- Artifact manifest
- Network service design group (NSDG)
- Network service design version (NSDV)
- CGS

## Service operator

The service operator is the person who runs the service on a day-to-day basis. The service operator's duties include creating, modifying, and monitoring these objects:

- Site
- Site network service (SNS)
- CGVs

The process to create an SNS consists of:

- Selecting an NFDV for the new service.
- Applying parameters by using inputs in the form of a site and one or more CGSs.

The service designer determines the exact format of these inputs.

A service operator is responsible for creating and updating the following Azure Operator Service Manager objects:

- Site
- CGVs
- SNS
