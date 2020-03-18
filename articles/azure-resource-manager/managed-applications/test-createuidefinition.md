---
title: Test the UI definition file
description: Describes how to test the user experience for creating your Azure Managed Application through the portal.
author: tfitzmac
ms.topic: conceptual
ms.date: 08/06/2019
ms.author: tomfitz
---
# Test your portal interface for Azure Managed Applications

After [creating the createUiDefinition.json file](create-uidefinition-overview.md) for your managed application, you need to test the user experience. To simplify testing, use a sandbox environment that loads your file in the portal. You don't need to actually deploy your managed application. The sandbox presents your user interface in the current, full-screen portal experience. Or, you can use a script for testing the interface. Both approaches are shown in this article. The sandbox is the recommended way to preview the interface.

## Prerequisites

* A **createUiDefinition.json** file. If you don't have this file, copy the [sample file](https://github.com/Azure/azure-quickstart-templates/blob/master/100-marketplace-sample/createUiDefinition.json).

* An Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Use sandbox

1. Open the [Create UI Definition Sandbox](https://portal.azure.com/?feature.customPortal=false&#blade/Microsoft_Azure_CreateUIDef/SandboxBlade).

   ![Show sandbox](./media/test-createuidefinition/show-sandbox.png)

1. Replace the empty definition with the contents of your createUiDefinition.json file. Select **Preview**.

   ![Select preview](./media/test-createuidefinition/select-preview.png)

1. The form you created is displayed. You can step through the user experience and fill in the values.

   ![Show form](./media/test-createuidefinition/show-ui-form.png)

### Troubleshooting

If your form doesn't display after selecting **Preview**, you may have a syntax error. Look for the red indicator on the right scroll bar and navigate to it.

![Show syntax error](./media/test-createuidefinition/show-syntax-error.png)

If your form doesn't display, and instead you see an icon of a cloud with tear drop, your form has an error, such as a missing property. Open the Web Developer Tools in your browser. The **Console** displays important messages about your interface.

![Show error](./media/test-createuidefinition/show-error.png)

## Use test script

To test your interface in the portal, copy one of the following scripts to your local machine:

* [PowerShell side-load script - Az Module](https://github.com/Azure/azure-quickstart-templates/blob/master/SideLoad-AzCreateUIDefinition.ps1)
* [PowerShell side-load script - Azure Module](https://github.com/Azure/azure-quickstart-templates/blob/master/SideLoad-CreateUIDefinition.ps1)
* [Azure CLI side-load script](https://github.com/Azure/azure-quickstart-templates/blob/master/sideload-createuidef.sh)

To see your interface file in the portal, run your downloaded script. The script creates a storage account in your Azure subscription, and uploads your createUiDefinition.json file to the storage account. The storage account is created the first time you run the script or if the storage account has been deleted. If the storage account already exists in your Azure subscription, the script reuses it. The script opens the portal and loads your file from the storage account.

Provide a location for the storage account, and specify the folder that has your createUiDefinition.json file.

For PowerShell, use:

```powershell
.\SideLoad-AzCreateUIDefinition.ps1 `
  -StorageResourceGroupLocation southcentralus `
  -ArtifactsStagingDirectory .\100-Marketplace-Sample
```

For Azure CLI, use:

```bash
./sideload-createuidef.sh \
  -l southcentralus \
  -a .\100-Marketplace-Sample
```

If your createUiDefinition.json file is in the same folder as the script, and you've already created the storage account, you don't need to provide those parameters.

For PowerShell, use:

```powershell
.\SideLoad-AzCreateUIDefinition.ps1
```

For Azure CLI, use:

```bash
./sideload-createuidef.sh
```

The script opens a new tab in your browser. It displays the portal with your interface for creating the managed application.

Provide values for the fields. When finished, you see the values that are passed to the template which can be found in your browser's developer tools console.

![Show values](./media/test-createuidefinition/show-json.png)

You can use these values as the parameter file for testing your deployment template.

If the portal hangs at the summary screen, there might be a bug in the output section. For example, you may have referenced a control that doesn't exist. If a parameter in the output is empty, the parameter might be referencing a property that doesn't exist. For example, the reference to the control is valid, but the property reference isn't valid.

## Test your solution files

Now that you've verified your portal interface is working as expected, it's time to validate that your createUiDefinition file is properly integrated with your mainTemplate.json file. You can run a validation script test to test the content of your solution files, including the createUiDefinition file. The script validates the JSON syntax, checks for regex expressions on text fields, and makes sure the output values of the portal interface match the parameters of your template. For information on running this script, see [Run static validation checks for templates](https://github.com/Azure/azure-quickstart-templates/tree/master/test).

## Next steps

After validating your portal interface, learn about making your [Azure managed application available in the Marketplace](publish-marketplace-app.md).
