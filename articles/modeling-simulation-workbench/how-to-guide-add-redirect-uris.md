---
title: "Add redirect URIs: Azure Modeling and Simulation Workbench"
description: Add redirect URIs for Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As a administrator, I want to add authentication URI from the Azure Modeling and Simulation Workbench to the Entra Id application registration.
---
# Add redirect URIs for Modeling and Simulation Workbench

A redirect Uniform Resource Identifier (URI) is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication. Each has two redirect URIs that must be registered in Microsoft Entra ID. A single Application Registration handles all the redirects and security tokens for a workbench.

## Prerequisites

* An application registration in Microsoft Entra ID for the Azure Modeling and Simulation Workbench
* A Workbench instance with a chamber and created.

## Add redirect URIs for the application in Microsoft Entra ID

[!INCLUDE [add-redirect-uris](includes/add-redirect-uris.md)]
