---
title: Optimize Visual Studio for Azure Service Fabric Mesh 
description: This article shows you how to optimize Visual Studio performance for Service Fabric Mesh projects so that your first debugging run (F5) is much faster.
author: dkkapur
ms.author: dekapur
ms.date: 11/29/2018
ms.topic: conceptual
#Customer intent: As a developer, I want to use optimize my Visual Studio environment for faster debugging.
---

# Optimize Visual Studio performance for Service Fabric Mesh projects

This article shows you how to optimize Visual Studio performance for Service Fabric Mesh projects so that your first debugging run (F5) is much faster.  

## Change Visual Studio settings
 
In Visual Studio, under **Tools** > **Options**  > **Service Fabric Mesh Tools** > **General**, you can adjust the following settings:

- **Pull required Docker images on project open** makes your first debugging run (F5) faster by starting the image download process while the project is loading.  
- **Deploy application on project open** can make your first debugging run (F5) faster by starting the deploy process once the project is opened.  
- **Remove application on project close** reclaims resources (CPU, RAM) allocated to the app by removing the Mesh app when the project is closed.  

When you see messages in the Service Fabric Tools output window that Visual Studio is 'pulling images', 'warming up', or 'removing application', it is in reference to the settings above. You can turn off these settings.

## Next steps

Read through the [Debug a Mesh app tutorial](service-fabric-mesh-tutorial-debug-service-fabric-mesh-app.md)