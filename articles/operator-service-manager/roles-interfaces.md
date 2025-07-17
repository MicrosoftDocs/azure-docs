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

- Network Function (NF) Publisher
- Service Designer
- Service Operator

In practice, the same person can perform more than one of these roles if necessary.

:::image type="content" source="media/roles-interfaces-diagram.png" alt-text="Diagram that shows three interfaces catering to three roles: Publisher, Designer, and Operator." lightbox="media/roles-interfaces-diagram.png":::

## NF Publisher

The NF Publisher creates and publishes network functions to Azure Operator Service Manager. NF Publisher responsibilities include:

- Create the network function.
- Encode the network function in a network function definition (NFD).
- Determine the deployment parameters to expose to the Service Designer.
- Onboard the NFD to Azure Operator Service Manager.
- Upload the associated artifacts.
- Validate the NFD.

The NF Publisher is responsible for creating and updating these Azure Operator Service Manager resources:

- Publisher
- Artifact store
- Artifact manifest
- Network function definition group (NFDG)
- Network function definition version (NFDV)

## Service Designer

The Service Designer is responsible for building a network service design (NSD). The Service Designer collects network function definitions from various NF Publishers. When collection of the network function definitions is complete, the Service Designer combines them with the Azure infrastructure to create a cohesive service.

The Service Designer determines how to parametrize the service by defining one or more configuration group schemas (CGSs). The CGSs define the inputs that the Service Operator must supply in the configuration group values (CGVs).

The Service Designer determines how inputs from the Service Operator map to parameters that the NF Publishers and the Azure infrastructure require.

As part of creating the network service design, the Service Designer must consider the upgrade and scaling requirements of the service.

The Service Designer is responsible for creating and updating the following Azure Operator Service Manager objects:

- Publisher
- Artifact store
- Artifact manifest
- Network service design group (NSDG)
- Network service design version (NSDV)
- Configuration group schema

## Service Operator

The Service Operator is the person who runs the service on a day-to-day basis. The Service Operator's duties include creating, modifying, and monitoring these objects:

- Site
- Site network service (SNS)
- CGVs

The process to create an SNS consists of:

- Selecting an NFDV for the new service.
- Applying parameters by using inputs in the form of a site and one or more configuration group schemas.

The Service Designer determines the exact format of these inputs.

A Service Operator is responsible for creating and updating the following Azure Operator Service Manager objects:

- Site
- CGVs
- SNS
