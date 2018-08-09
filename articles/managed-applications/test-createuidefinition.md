---
title: Test the UI definition for Azure Managed Applications | Microsoft Docs
description: Describes how to test the user experience for creating your Azure Managed Application through the portal.
services: managed-applications
documentationcenter: na
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/09/2018
ms.author: tomfitz

---
# Test Azure portal interface for your managed application
After [creating the createUiDefinition.json file](create-uidefinition-overview.md) for your Azure Managed Application, you need to test the user experience. To simplify testing, use a script that loads your file in the portal. You don't need to actually deploy your managed application.

## Prerequisites

* A **createUiDefinition.json** file. If you don't have this file, copy the [sample file](https://github.com/Azure/azure-quickstart-templates/blob/master/test/template-validation-tests/sample-template/createUIDefinition.json) and save it locally.

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Download test script

To test your interface in the portal, copy one of the following scripts to your local machine:

* [PowerShell side load](https://github.com/Azure/azure-quickstart-templates/blob/master/Deploy-AzureResourceGroup.ps1)
* [Azure CLI side load](https://github.com/Azure/azure-quickstart-templates/blob/master/sideload-createuidef.sh)

## Run script

To see your interface file in the portal, run your downloaded script. The script creates a storage account in your Azure subscription, and uploads your createUiDefinition.json file to the storage account. Then, it opens the portal and loads your file from the storage account.

Provide a location for the storage account, and specify the folder that has your createUiDefinition.json file. You only need to provide the storage account location the first time you run the script or if the storage account has been deleted.

For PowerShell, use:

```powershell
.\SideLoad-CreateUIDefinition.ps1 -StorageResourceGroupLocation southcentralus -ArtifactsStagingDirectory <path-to-folder>
```

For Azure CLI, use:

```azurecli
./sideload-createuidef.sh -l southcentralus -a <path-to-folder>
```

## Test your interface

Your interface for creating the managed application is displayed in the portal.

![View portal](./media/test-createuidefinition/view-portal.png)

Before filling out the fields, open the developer tools in your browser. To see important messages about your interface, select **Console**.

![Select console](./media/test-createuidefinition/select-console.png)

Provide values for the fields. When finished, you see the values that are passed to the template.

![Show values](./media/test-createuidefinition/show-json.png)

If your interface definition has an error, you see the description in the console.

![Show error](./media/test-createuidefinition/show-error.png)

## Next steps
The createUiDefinition.json file itself has a simple schema. The real depth of it comes from all the supported elements and functions. Those items are described in greater detail at:

- [Elements](create-uidefinition-elements.md)
- [Functions](create-uidefinition-functions.md)

A current JSON schema for createUiDefinition is available here: https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json.
