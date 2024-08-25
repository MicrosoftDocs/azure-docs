---
title: "Add redirect URIs: Azure Modeling and Simulation Workbench"
description: Add redirect URIs for Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As a administrator, I want to add authentication URI from the Azure Modeling and Simulation Workbench to the Entra Id application registration.
---
# Add redirect URIs for Modeling and Simulation Workbench

A redirect URI (Uniform Resource Identifier) is the location where the Microsoft identity platform redirects a user's client and sends security tokens after authentication. The Azure Modeling and Simulation Workbench provides two redirect URIs for each connector that must be registered in Microsoft Entra Id. A single Application Registration handles all the redirects and security tokens for a single workbench.  

## Prerequisites

* An application registration in Microsoft Entra Id for the Azure Modeling and Simulation Workbench
* A Workbench instance with a Chamber and Connector created.

## Add redirect URIs for the application in Microsoft Entra ID

[!INCLUDE [add-redirect-uris](includes/add-redirect-uris.md)]
