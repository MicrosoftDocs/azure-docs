---
title: What to consider when migrating from Windows to Linux on App Service 
description: Learn key considerations when migrating apps from Windows to Linux on Azure App Service.
keywords: azure app service, web app, python, windows, linux, migration
author: jefmarti

ms.topic: overview
ms.date: 03/25/2025
ms.author: jefmarti
---
# What to consider when migrating from Windows to Linux on App Service

Azure App Service supports both Windows and Linux. The supported OS depends on your apps runtime of choice. If a given runtime is no longer supported on an OS, you may need to migrate your application to a supported OS. 

If you received a notification that you need to migrate your Python on Windows apps to Linux, consider the following topics when migrating. 

### Code dependencies and compatibility 

Ensure that any dependencies or components that your application uses are also available on Linux. If Windows specific dependencies are not available on Linux, you may have to find an equivalent Linux option. 

### Deployment tools 

If you use continuous deployment tools like GitHub Actions or Azure Pipelines, you need to make sure the build agent is using the correct operating system. For Windows to Linux, the build agent should be changed from using Windows to Ubuntu. 

### App Service features 

While most App Service features will have parity between Windows and Linux, some Windows specific features like the Console are replaced with SSH tools on Linux. 

### Domain name 

Deploying a new Linux application requires a new name for your app. Keep in mind any connected custom domains need to be updated to route to the new name as well. 

### Networking 

When redeploying your application to Linux, your inbound IP address changes. See the documentation for more information on inbound IP addresses. 

### Managed Identity 

If you managed identity is configured with your applications, be sure to update your granted permissions to use the deployed Linux application. 

 