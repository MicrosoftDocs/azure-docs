---
title: Azure Managed Application create UI definition functions | Microsoft Docs
description: Describes the functions to use when constructing UI definitions for Azure Managed Applications
services: azure-resource-manager
documentationcenter: na
author: tabrezm
manager: timlt
editor: tysonn

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/12/2017
ms.author: tabrezm;tomfitz

---
# CreateUiDefinition elements
This article describes the schema and properties for all supported elements of a CreateUiDefinition. You use these elements when [creating an Azure Managed Application](managed-application-publishing.md). The schema for most elements is as follows:

```json
{
  "name": "element1",
  "type": "Microsoft.Common.TextBox",
  "label": "Some text box",
  "defaultValue": "foobar",
  "toolTip": "Keep calm and visit the [Azure Portal](portal.azure.com).",
  "constraints": {},
  "options": {},
  "visible": true
}
```
| Property | Required | Description |
| -------- | -------- | ----------- |
| name | Yes | An internal identifier to reference a specific instance of an element. The most common usage of the element name is in `outputs`, where the output values of the specified elements are mapped to the parameters of the template. You can also use it to bind the output value of an element to the `defaultValue` of another element. |
| type | Yes | The UI control to render for the element. For a list of supported types, see [Elements](#elements). |
| label | Yes | The display text of the element. Some element types contain multiple labels, so the value could be an object containing multiple strings. |
| defaultValue | No | The default value of the element. Some element types support complex default values, so the value could be an object. |
| toolTip | No | The text to display in the tool tip of the element. Similar to `label`, some elements support multiple tool tip strings. Inline links can be embedded using Markdown syntax.
| constraints | No | One or more properties that are used to customize the validation behavior of the element. The supported properties for constraints vary by element type. Some element types do not support customization of the validation behavior, and thus have no constraints property. |
| options | No | Additional properties that customize the behavior of the element. Similar to `constraints`, the supported properties vary by element type. |
| visible | No | Indicates whether the element is displayed. If `true`, the element and applicable child elements are displayed. The default value is `true`. Use [logical functions](managed-application-createuidefinition-functions.md#logical-functions) to dynamically control this property's value.

## Elements

The documentation for each element contains a UI sample, schema, remarks on the behavior of the element (usually concerning validation and supported customization), and sample output.

- [Microsoft.Common.DropDown](managed-application-microsoft-common-dropdown.md)
- [Microsoft.Common.FileUpload](managed-application-microsoft-common-fileupload.md)
- [Microsoft.Common.OptionsGroup](managed-application-microsoft-common-optionsgroup.md)
- [Microsoft.Common.PasswordBox](managed-application-microsoft-common-passwordbox.md)
- [Microsoft.Common.Section](managed-application-microsoft-common-section.md)
- [Microsoft.Common.TextBox](managed-application-microsoft-common-textbox.md)
- [Microsoft.Compute.CredentialsCombo](managed-application-microsoft-compute-credentialscombo.md)
- [Microsoft.Compute.SizeSelector](managed-application-microsoft-compute-sizeselector.md)
- [Microsoft.Compute.UserNameTextBox](managed-application-microsoft-compute-usernametextbox.md)
- [Microsoft.Network.PublicIpAddressCombo](managed-application-microsoft-network-publicipaddresscombo.md)
- [Microsoft.Network.VirtualNetworkCombo](managed-application-microsoft-network-virtualnetworkcombo.md)
- [Microsoft.Storage.MultiStorageAccountCombo](managed-application-microsoft-storage-multistorageaccountcombo.md)
- [Microsoft.Storage.StorageAccountSelector](managed-application-microsoft-storage-storageaccountselector.md)

## Next steps
* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
