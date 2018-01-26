---
title: Azure CLI Script Sample - Add an Application in Batch | Microsoft Docs
description: Azure CLI Script Sample - Add an Application in Batch
services: batch
documentationcenter: ''
author: annatisch
manager: daryls
editor: tysonn

ms.assetid:
ms.service: batch
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 01/25/2018
ms.author: danlep
---

# Adding applications to Azure Batch with Azure CLI

This script demonstrates how to set up an application for use with an Azure Batch
pool or task. To set up an application, package your executable, together with any dependencies,
into a .zip file. In this example the executable zip file is called 'my-application-exe.zip'. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/batch/add-application/add-application.sh "Add Application")]

## Clean up deployment

Run the following command to remove the
resource group and all resources associated with it.

## Script explanation

This script uses the following commands to create an application and upload an application package.
Each command in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [az batch application create](/cli/azure/batch/application#az_batch_application_create) | Creates an application.  |
| [az batch application set](/cli/azure/batch/application#az_batch_application_set) | Updates properties of an application.  |
| [az batch application package create](/cli/azure/batch/application/package#az_batch_application_package_create) | Adds an application package to the specified application.  |
| [az group delete](/cli/azure/group#az_group_delete) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure/overview).
