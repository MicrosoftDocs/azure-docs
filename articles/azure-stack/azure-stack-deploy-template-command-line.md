---
title: Deploy templates with the command line in Azure Stack | Microsoft Docs
description: Learn how to use the cross-platform command line interface (CLI) to deploy templates from inside the ClientVM or after using the VPN to connect to Azure Stack.
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: 9584177f-4af3-4834-864d-930b09ae0995
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/16/2017
ms.author: helaw

---
# Deploy templates in Azure Stack using the command line
Use the command line to deploy Azure Resource Manager templates to the Azure Stack POC. Azure Resource Manager templates deploy and provision all the resources for your application in a single, coordinated operation.

## Before you begin
 - [Install and connect](azure-stack-connect-cli.md) to Azure Stack with Azure CLI
 - Download the files *azuredeploy.json* and *azuredeploy.parameters.json* from the [create storage account example template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/101-create-storage-account).
 
## Deploy template
Navigate to the folder where these files were downloaded and run the following command to deploy the template:

    azure group create "cliRG" "local" –f azuredeploy.json –d "testDeploy" –e azuredeploy.parameters.json

This command deploys the template to the resource group **cliRG** in the Azure Stack POC’s default location.

## Validate template deployment
To see this resource group and storage account, use the following commands:

    azure group list

    azure storage account list

## Next steps
[Manage user permissions](azure-stack-manage-permissions.md)

