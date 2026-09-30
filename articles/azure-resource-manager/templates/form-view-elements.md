---
title: Form view elements
description: Reference list of UI elements supported in the Form view (uiFormDefinition) authoring model used by Azure portal Create experiences and template spec portal forms.
ms.topic: reference
ms.date: 06/08/2026
---

# Elements supported in Form view

This article is the element support list for *Form view* (_uiFormDefinition.json_), which is used by template spec portal forms. For Azure Managed Applications, use [_createUiDefinition.json_ elements](../managed-applications/create-uidefinition-elements.md) instead.

Form view reuses the same baseline element contract as CreateUiDefinition: properties such as `name`, `type`, `label`, `defaultValue`, `toolTip`, `constraints`, `options`, and `visible` have the same meaning unless a Form view-specific article says otherwise. To avoid repeating shared schemas, the **Reference** column links to existing CreateUiDefinition element pages for controls that behave the same in both formats. Availability is determined by the support list on this page, not by the physical folder of the linked article.

## Supported elements

The element types listed below are supported in Form view.

| Element | Purpose | Reference |
| --- | --- | --- |
| `Microsoft.Common.CheckBox` | Boolean checkbox. | [Microsoft.Common.CheckBox](../managed-applications/microsoft-common-checkbox.md) |
| `Microsoft.Common.DropDown` | Single- or multi-select dropdown. | [Microsoft.Common.DropDown](../managed-applications/microsoft-common-dropdown.md) |
| `Microsoft.Common.EditableGrid` | Editable rows and columns. Outputs an array. | [Microsoft.Common.EditableGrid](../managed-applications/microsoft-common-editablegrid.md) |
| `Microsoft.Common.FileUpload` | Upload a local file (text content or blob URL). | [Microsoft.Common.FileUpload](../managed-applications/microsoft-common-fileupload.md) |
| `Microsoft.Common.Grid` | Read-only tabular display with add and edit blades. | [Microsoft.Common.Grid](form-view-microsoft-common-grid.md) |
| `Microsoft.Common.InfoBox` | Inline information, warning, or error banner. | [Microsoft.Common.InfoBox](../managed-applications/microsoft-common-infobox.md) |
| `Microsoft.Common.LocationSelector` | Standalone region picker. | [Microsoft.Common.LocationSelector](form-view-microsoft-common-locationselector.md) |
| `Microsoft.Common.ManagementGroupSelector` | Standalone management-group picker. | [Microsoft.Common.ManagementGroupSelector](form-view-microsoft-common-managementgroupselector.md) |
| `Microsoft.Common.OptionsGroup` | Pivot-style radio group. | [Microsoft.Common.OptionsGroup](../managed-applications/microsoft-common-optionsgroup.md) |
| `Microsoft.Common.PasswordBox` | Masked input with optional confirm field. | [Microsoft.Common.PasswordBox](../managed-applications/microsoft-common-passwordbox.md) |
| `Microsoft.Common.ResourceGroupSelector` | Standalone resource-group picker (existing or new). | [Microsoft.Common.ResourceGroupSelector](form-view-microsoft-common-resourcegroupselector.md) |
| `Microsoft.Common.ResourceScope` | Composite subscription, resource group, and location picker for the deployment scope. | [Microsoft.Common.ResourceScope](form-view-microsoft-common-resourcescope.md) |
| `Microsoft.Common.Section` | Groups child controls under a heading. Not nestable. | [Microsoft.Common.Section](../managed-applications/microsoft-common-section.md) |
| `Microsoft.Common.ServicePrincipalSelector` | Pick a Microsoft Entra service principal. | [Microsoft.Common.ServicePrincipalSelector](../managed-applications/microsoft-common-serviceprincipalselector.md) |
| `Microsoft.Common.Slider` | Numeric slider over a range. | [Microsoft.Common.Slider](../managed-applications/microsoft-common-slider.md) |
| `Microsoft.Common.SubscriptionSelector` | Standalone subscription picker. | [Microsoft.Common.SubscriptionSelector](form-view-microsoft-common-subscriptionselector.md) |
| `Microsoft.Common.TagsByResource` | Standard Tags control. | [Microsoft.Common.TagsByResource](../managed-applications/microsoft-common-tagsbyresource.md) |
| `Microsoft.Common.TenantSelector` | Read-only display of the current tenant. | [Microsoft.Common.TenantSelector](form-view-microsoft-common-tenantselector.md) |
| `Microsoft.Common.TextBlock` | Static descriptive text. | [Microsoft.Common.TextBlock](../managed-applications/microsoft-common-textblock.md) |
| `Microsoft.Common.TextBox` | Single- or multi-line text input. | [Microsoft.Common.TextBox](../managed-applications/microsoft-common-textbox.md) |
| `Microsoft.Compute.CredentialsCombo` | Username + (password or SSH key) for VM creation. Requires an `osPlatform` discriminator (`"Linux"` or `"Windows"`); see the note below. | [Microsoft.Compute.CredentialsCombo](../managed-applications/microsoft-compute-credentialscombo.md) |
| `Microsoft.Compute.SizeSelector` | VM SKU picker. | [Microsoft.Compute.SizeSelector](../managed-applications/microsoft-compute-sizeselector.md) |
| `Microsoft.Compute.UserNameTextBox` | Username text box with Azure VM-username validation. | [Microsoft.Compute.UserNameTextBox](../managed-applications/microsoft-compute-usernametextbox.md) |
| `Microsoft.KeyVault.KeyVaultCertificateSelector` | Pick a certificate from Key Vault. | [Microsoft.KeyVault.KeyVaultCertificateSelector](../managed-applications/microsoft-keyvault-keyvaultcertificateselector.md) |
| `Microsoft.ManagedIdentity.IdentitySelector` | System- and user-assigned managed identity. | [Microsoft.ManagedIdentity.IdentitySelector](../managed-applications/microsoft-managedidentity-identityselector.md) |
| `Microsoft.Network.PublicIpAddressCombo` | Existing-or-new public IP. | [Microsoft.Network.PublicIpAddressCombo](../managed-applications/microsoft-network-publicipaddresscombo.md) |
| `Microsoft.Network.VirtualNetworkCombo` | Existing-or-new virtual network and subnets. | [Microsoft.Network.VirtualNetworkCombo](../managed-applications/microsoft-network-virtualnetworkcombo.md) |
| `Microsoft.Solutions.ArmApiControl` | Issue an Azure Resource Manager call and bind the response into form state (no UI). | [Microsoft.Solutions.ArmApiControl](../managed-applications/microsoft-solutions-armapicontrol.md) |
| `Microsoft.Solutions.BladeInvokeControl` | Open an Azure portal blade and bind the returned data into form state (no UI). | [Microsoft.Solutions.BladeInvokeControl](form-view-microsoft-solutions-bladeinvokecontrol.md) |
| `Microsoft.Solutions.ResourceSelector` | Resource Graph-backed ARM resource picker. | [Microsoft.Solutions.ResourceSelector](../managed-applications/microsoft-solutions-resourceselector.md) |
| `Microsoft.Storage.MultiStorageAccountCombo` | Multiple storage accounts with replication choice. | [Microsoft.Storage.MultiStorageAccountCombo](../managed-applications/microsoft-storage-multistorageaccountcombo.md) |
| `Microsoft.Storage.StorageAccountSelector` | Existing-or-new storage account. | [Microsoft.Storage.StorageAccountSelector](../managed-applications/microsoft-storage-storageaccountselector.md) |
| `Microsoft.Storage.StorageBlobSelector` | Pick a blob inside a storage account. | [Microsoft.Storage.StorageBlobSelector](../managed-applications/microsoft-storage-storageblobselector.md) |

## Differences from CreateUiDefinition elements

The two formats overlap, but aren't interchangeable:

- **Form view has its own support list.** Don't assume an element is valid in _uiFormDefinition.json_ just because it appears in the CreateUiDefinition reference, or valid in _createUiDefinition.json_ just because it appears on this page.
- **No `basics()` function in Form view.** Form view has no implicit Basics step; the subscription, resource group, and location pickers are explicit elements (`Microsoft.Common.SubscriptionSelector`, `Microsoft.Common.ResourceGroupSelector`, `Microsoft.Common.LocationSelector`) placed in whichever step you choose, and their outputs are referenced via `steps(...)` like any other control.
- **Form view has explicit scope selector elements.** `Microsoft.Common.ResourceScope`, `Microsoft.Common.SubscriptionSelector`, `Microsoft.Common.ResourceGroupSelector`, `Microsoft.Common.LocationSelector`, `Microsoft.Common.ManagementGroupSelector`, and `Microsoft.Common.TenantSelector` are documented for Form view. In CreateUiDefinition, subscription, resource group, and location are provided by the implicit Basics step instead.
- **`Microsoft.Compute.CredentialsCombo` requires an `osPlatform` discriminator.** The `type` value is always the string `"Microsoft.Compute.CredentialsCombo"`; the Linux versus Windows variant is selected by setting `"osPlatform": "Linux"` or `"osPlatform": "Windows"` on the element. The two variants do **not** have identical schemas:

   - The Linux variant must include `label.authenticationType`, `label.password`, `label.confirmPassword`, and `label.sshPublicKey`, and supports the SSH-key authentication mode and an `options.hidePassword` flag.
   - The Windows variant only requires `label.password` and `label.confirmPassword`; it does not accept the SSH-related `label`, `toolTip`, or `options` fields.

   The internal schema definitions named `Microsoft.Compute.CredentialsCombo-Linux` and `Microsoft.Compute.CredentialsCombo-Windows` are JSON Schema definition names used to enforce these per-platform shapes — they're not values you place in `type`.

## Next steps

- [Form view overview](form-view-overview.md)
- [Create portal forms for template specs](template-specs-create-portal-forms.md)
- [CreateUiDefinition functions](../managed-applications/create-uidefinition-functions.md)
