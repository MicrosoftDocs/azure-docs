---
title: Create UI definition elements
description: Describes the elements to use when constructing UI definitions for Azure portal.
ms.topic: reference
ms.date: 06/24/2024
---

# CreateUiDefinition elements

This article describes the schema and properties for all supported elements of a _createUiDefinition.json_ file.

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
| `name` | Yes | An internal identifier to reference a specific instance of an element. The most common usage of the element name is in `outputs`, where the output values of the specified elements are mapped to the parameters of the template. You can also use it to bind the output value of an element to the `defaultValue` of another element. |
| `type` | Yes | The UI control to render for the element. For a list of supported types, see [Elements](#elements). |
| `label` | Yes | The display text of the element. Some element types contain multiple labels, so the value could be an object containing multiple strings. |
| `defaultValue` | No | The default value of the element. Some element types support complex default values, so the value could be an object. |
| `toolTip` | No | The text to display in the tool tip of the element. Similar to `label`, some elements support multiple tool tip strings. Inline links can be embedded using Markdown syntax.
| `constraints` | No | One or more properties that are used to customize the validation behavior of the element. The supported properties for constraints vary by element type. Some element types don't support customization of the validation behavior, and thus have no constraints property. |
| `options` | No | More properties that customize the behavior of the element. Similar to `constraints`, the supported properties vary by element type. |
| `visible` | No | Indicates whether the element is displayed. If `true`, the element and applicable child elements are displayed. The default value is `true`. Use [logical functions](create-uidefinition-functions.md#logical-functions) to dynamically control this property's value. |

## Elements

The documentation for each element contains a UI sample, schema, remarks on the behavior of the element (usually concerning validation and supported customization), and sample output.

- [Microsoft.Common.CheckBox](microsoft-common-checkbox.md)
- [Microsoft.Common.DropDown](microsoft-common-dropdown.md)
- [Microsoft.Common.EditableGrid](microsoft-common-editablegrid.md)
- [Microsoft.Common.FileUpload](microsoft-common-fileupload.md)
- [Microsoft.Common.InfoBox](microsoft-common-infobox.md)
- [Microsoft.Common.OptionsGroup](microsoft-common-optionsgroup.md)
- [Microsoft.Common.PasswordBox](microsoft-common-passwordbox.md)
- [Microsoft.Common.Section](microsoft-common-section.md)
- [Microsoft.Common.ServicePrincipalSelector](microsoft-common-serviceprincipalselector.md)
- [Microsoft.Common.Slider](microsoft-common-slider.md)
- [Microsoft.Common.TagsByResource](microsoft-common-tagsbyresource.md)
- [Microsoft.Common.TextBlock](microsoft-common-textblock.md)
- [Microsoft.Common.TextBox](microsoft-common-textbox.md)
- [Microsoft.Compute.CredentialsCombo](microsoft-compute-credentialscombo.md)
- [Microsoft.Compute.SizeSelector](microsoft-compute-sizeselector.md)
- [Microsoft.Compute.UserNameTextBox](microsoft-compute-usernametextbox.md)
- [Microsoft.KeyVault.KeyVaultCertificateSelector](microsoft-keyvault-keyvaultcertificateselector.md)
- [Microsoft.ManagedIdentity.IdentitySelector](microsoft-managedidentity-identityselector.md)
- [Microsoft.Network.PublicIpAddressCombo](microsoft-network-publicipaddresscombo.md)
- [Microsoft.Network.VirtualNetworkCombo](microsoft-network-virtualnetworkcombo.md)
- [Microsoft.Solutions.ArmApiControl](microsoft-solutions-armapicontrol.md)
- [Microsoft.Solutions.ResourceSelector](microsoft-solutions-resourceselector.md)
- [Microsoft.Storage.MultiStorageAccountCombo](microsoft-storage-multistorageaccountcombo.md)
- [Microsoft.Storage.StorageAccountSelector](microsoft-storage-storageaccountselector.md)
- [Microsoft.Storage.StorageBlobSelector](microsoft-storage-storageblobselector.md)

## Next steps

For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
