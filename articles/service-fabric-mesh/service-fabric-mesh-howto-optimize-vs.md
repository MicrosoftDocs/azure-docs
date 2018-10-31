---
title: Optimize Visual Studio performance for Azure Service Fabric Mesh projects | Microsoft Docs
description: Optimize Visual Studio performance for Azure Service Fabric Mesh apps
services: service-fabric-mesh
keywords:  
author: tylermsft
ms.author: twhitney
ms.date: 11/01/2018
ms.topic: get-started-article
ms.service: service-fabric-mesh
manager: jeconnoc  
#Customer intent: As a developer, I want to use environment variables when I debug to test different scenarios.
---

# Optimize Visual Studio performance for Service Fabric Mesh projects

This article shows you how to optimize Visual Studio performance for Service Fabric Mesh projects so that your first debugging run (F5) is much faster.  

## Change Visual Studio settings
 
In Visual Studio, under **Tools** > **Options**  > **Service Fabric Tools** > **General**, you can adjust the following settings:

- **Pull required Docker images on project open** makes your first debugging run (F5) faster by starting the image download process while the project is loading.  
- **Deploy application on project open** can make your first debugging run (F5) faster by starting the deploy process once the project is opened.  
- **Remove application on project close** reclaims resources (CPU, RAM) the app was allocated on startup by removing the Mesh app when the project is closed.  

When you see messages in the Service Fabric Tools output window that Visual Studio is 'pulling images', 'warming up', or 'removing application', it is in reference to the settings above. You can turn these settings off if you don't want Visual Studio to download dependent Docker images ahead of time, deploy the Mesh app when the project is opened, or remove the Mesh app when the project is closed.

## Next steps

Read through the [Debug a Mesh app tutorial](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)