---
title: How to deploy OPC Twin cloud dependencies in Azure | Microsoft Docs
description: How to deploy OPC Twin Azure dependencies.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Deploying dependencies for local development

This article explains how to deploy only the Azure Platform Services need to do local development and debugging.   At the end, you will have a resource group deployed that contains everything you need for local development and debugging.

## Deploy Azure platform services

1. Make sure you have PowerShell and [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-1.1.0) extensions installed.  Open a command prompt or terminal and run:

   ```bash
   git clone https://github.com/Azure/azure-iiot-components
   cd azure-iiot-components
   ```

   ```bash
   deploy -type local
   ```

2. Follow the prompts to assign a name to the resource group for your deployment.  The script deploys only the dependencies to this resource group in your Azure subscription, but not the micro services.  The script also registers an Application in Azure Active Directory.  This is needed to support OAUTH-based authentication.  Deployment can take several minutes.

3. Once the script completes, you can select to save the .env file.  The .env environment file is the configuration file of all services and tools you want to run on your development machine.  

## Troubleshooting deployment failures

### Resource group name

Ensure you use a short and simple resource group name.  The name is used also to name resources as such it must comply with resource naming requirements.  

### Azure Active Directory (AAD) registration

The deployment script tries to register AAD applications in Azure Active Directory.  Depending on your rights to the selected AAD tenant, this might fail.   There are 3 options:

1. If you chose a AAD tenant from a list of tenants, restart the script and choose a different one from the list.
2. Alternatively, deploy a private AAD tenant, restart the script and select to use it.
3. Continue without Authentication.  Since you are running your micro services locally, this is acceptable, but does not mimic production environments.  

## Next steps

Now that you have successfully deployed OPC Twin services to an existing project, here is the suggested next step:

> [!div class="nextstepaction"]
> [Learn about how to deploy OPC Twin modules](howto-opc-twin-deploy-modules.md)
