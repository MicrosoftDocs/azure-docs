---
title: Deploy templates with the command line in Azure Stack | Microsoft Docs
description: Learn how to use the cross-platform command line interface (CLI) to deploy templates to Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.assetid: 9584177f-4af3-4834-864d-930b09ae0995
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2018
ms.author: sethm
ms.reviewer:

---
# Deploy templates in Azure Stack using the command line

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Use the command line to deploy Azure Resource Manager templates in the Azure Stack Development Kit environment. Azure Resource Manager templates deploy and provision all the resources for your application in a single, coordinated operation.

## Before you begin

 - [Install and connect](azure-stack-version-profiles-azurecli2.md) to Azure Stack with Azure CLI.
 - Download the files *azuredeploy.json* and *azuredeploy.parameters.json* from the [create storage account example template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/101-create-storage-account).
 
## Deploy template

Navigate to the folder into which these files were downloaded, and run the following command to deploy the template:

```azurecli
az group create "cliRG" "local" –f azuredeploy.json –d "testDeploy" –e azuredeploy.parameters.json
```

This command deploys the template to the resource group **cliRG** in the Azure Stack POC default location.

## Validate template deployment

To see this resource group and storage account, use the following commands:

```azurecli
az group list

az storage account list
```

## Next steps

To learn more about deploying templates, see:

[Deploy templates with PowerShell](azure-stack-deploy-template-powershell.md)

