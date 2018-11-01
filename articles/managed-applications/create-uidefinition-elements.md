---
title: Azure create UI definition element | Microsoft Docs
description: Describes the elements to use when constructing UI definitions for Azure portal.
services: managed-applications
documentationcenter: na
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/19/2018
ms.author: tomfitz

---
# CreateUiDefinition elements
This article describes the schema and properties for all supported elements of a CreateUiDefinition. 

## Schema

The schema for most elements is as follows:

```json
{
  "name": "element1",
  "type": "Microsoft.Common.TextBox",
  "label": "Some text box",
  "defaultValue": "my value",
  "toolTip": "Provide a descriptive name.",
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
| visible | No | Indicates whether the element is displayed. If `true`, the element and applicable child elements are displayed. The default value is `true`. Use [logical functions](create-uidefinition-functions.md#logical-functions) to dynamically control this property's value.

## Elements

The documentation for each element contains a UI sample, schema, remarks on the behavior of the element (usually concerning validation and supported customization), and sample output.

- [Microsoft.Common.DropDown](microsoft-common-dropdown.md)
- [Microsoft.Common.FileUpload](microsoft-common-fileupload.md)
- [Microsoft.Common.InfoBox](microsoft-common-infobox.md)
- [Microsoft.Common.OptionsGroup](microsoft-common-optionsgroup.md)
- [Microsoft.Common.PasswordBox](microsoft-common-passwordbox.md)
- [Microsoft.Common.Section](microsoft-common-section.md)
- [Microsoft.Common.TextBlock](microsoft-common-textblock.md)
- [Microsoft.Common.TextBox](microsoft-common-textbox.md)
- [Microsoft.Compute.CredentialsCombo](microsoft-compute-credentialscombo.md)
- [Microsoft.Compute.SizeSelector](microsoft-compute-sizeselector.md)
- [Microsoft.Compute.UserNameTextBox](microsoft-compute-usernametextbox.md)
- [Microsoft.Network.PublicIpAddressCombo](microsoft-network-publicipaddresscombo.md)
- [Microsoft.Network.VirtualNetworkCombo](microsoft-network-virtualnetworkcombo.md)
- [Microsoft.Storage.MultiStorageAccountCombo](microsoft-storage-multistorageaccountcombo.md)
- [Microsoft.Storage.StorageAccountSelector](microsoft-storage-storageaccountselector.md)

## Next steps
For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
