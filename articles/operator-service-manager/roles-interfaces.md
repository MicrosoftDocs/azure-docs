---
title: Roles and Interfaces for Azure Operator Service Manager
description: Learn about the various roles and interfaces for Azure Operator Service Manager.
author: sherryg
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Roles and Interfaces

Azure Operator Service Manager (AOSM) provides three distinct interfaces catering to three roles:

- Network Function Publisher
- Network Service Designer
- Network Service Operator

In practice, multiple of these roles can be performed by the same person if necessary.

:::image type="content" source="media/roles-interfaces-diagram.png" alt-text="Diagram showing three interfaces catering to three roles: Publisher, Designer and Operator." lightbox="media/roles-interfaces-diagram.png":::

## Network Function (NF) Publisher - Role 1

The Network Function (NF) Publisher creates and publishes network functions to Azure Operator Service Manager (AOSM).  Publisher responsibilities include:
- Create the network function.
- Encode that in a Network Function Definition (NFD).
- Determine the deployment parameters to expose to the Service Designer.
- Onboard the Network Function Definition (NFD) to Azure Operator Service Manager (AOSM).
- Upload the associated artifacts.
- Validate the Network Function Definition (NFD).

The term *Publisher* is synonymous. The Network Function (NF) Publisher is responsible for creating/updating these Azure Operator Service Manager (AOSM) resources:
- Publisher
- Artifact Store
- Artifact Manifest
- Network Function Definition Group
- Network Function Definition Version

## Service Designer - Role 2

The Service Designer is responsible for building a Network Service Design (NSD). The Service Designer takes a collection of Network Function Definition (NFDs) from various Network Function (NF) Publishers. When collecting the Network Function Definitions (NFDs) is complete, the Service Designer combines them together along with Azure infrastructure to create a cohesive service.  The Service Designer determines how to parametrize the service by defining one or more Configuration Group Schemas (CGSs). The Configuration Group Schemas (CGSs) define the inputs that the Service Operator must supply in the Configuration Group Values (CGVs).

The Service Designer determines how inputs from the Service Operator map down to parameters required by the Network Function (NF) Publishers and the Azure infrastructure.

As part of creating the Network Service Design (NSD) the Service Designer must consider the upgrade and scaling requirements of the service.

The Service Designer is responsible for creating/updating the following Azure Operator Service Manager (AOSM) objects:

- Publisher
- Artifact Store
- Artifact Manifest
- Network Service Design Group
- Network Service Design Version
- Configuration Group Schema

## Service Operator - Role 3

The Service Operator is the person who runs the service on a day to day basis.  The Service Operator duties include creating, modifying and monitoring these objects:
- Site
- Site Network Service (SNS)
- Configuration Group Values (CGV)

The process to create a Site Network Service consists of:
- Selecting a Network Function Design Version (NSDV) for the new service.
- Applying parameters using inputs in the form of a Site and one or more Configuration Group Schemas (CGSs).

The Service Designer determines the exact format of these inputs.

A Service Operator is responsible for creating/updating the following Azure Operator Service Manager (AOSM) objects:
- Site
- Configuration Group Values
- Site Network Service
