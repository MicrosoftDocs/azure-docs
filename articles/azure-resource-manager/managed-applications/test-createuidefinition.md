---
title: Test the UI definition file
description: Describes how to test the user experience for creating your Azure Managed Application through the portal.
ms.topic: conceptual
ms.date: 06/04/2021
---

# Test your portal interface for Azure Managed Applications

After [creating the createUiDefinition.json file](create-uidefinition-overview.md) for your managed application, you need to test the user experience. To simplify testing, use a sandbox environment that loads your file in the portal. You don't need to actually deploy your managed application. The sandbox presents your user interface in the current, full-screen portal experience. The sandbox is the recommended way to preview the interface.

## Prerequisites

* A **createUiDefinition.json** file. If you don't have this file, copy the [sample file](https://github.com/Azure/azure-quickstart-templates/blob/master/demos/100-marketplace-sample/createUiDefinition.json).

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

## Test your solution files

Now that you've verified your portal interface is working as expected, it's time to validate that your createUiDefinition file is properly integrated with your mainTemplate.json file. You can run a validation script test to test the content of your solution files, including the createUiDefinition file. The script validates the JSON syntax, checks for regex expressions on text fields, and makes sure the output values of the portal interface match the parameters of your template. For information on running this script, see [Run static validation checks for templates](https://aka.ms/arm-ttk).

## Next steps

After validating your portal interface, learn about making your [Azure managed application available in the Marketplace](../../marketplace/azure-app-offer-setup.md).
