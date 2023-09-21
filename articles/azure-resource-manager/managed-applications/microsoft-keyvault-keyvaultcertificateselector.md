---
title: KeyVaultCertificateSelector UI element
description: Describes the Microsoft.KeyVault.KeyVaultCertificateSelector UI element for Azure portal.
ms.topic: conceptual
ms.date: 10/27/2020
---

# Microsoft.KeyVault.KeyVaultCertificateSelector UI element

A control for selecting a key vault certificate.

## UI sample

The user is presented with the option to select an available certificate.

:::image type="content" source="./media/managed-application-elements/microsoft-keyvault-keyvaultcertificateselector-select.png" alt-text="Microsoft.KeyVault.KeyVaultCertificateSelector":::

After selecting **Select a certificate**, the user can specify a key vault and certificate from the key vault.

:::image type="content" source="./media/managed-application-elements/microsoft-keyvault-keyvaultcertificateselector-certificate.png" alt-text="Microsoft.KeyVault.KeyVaultCertificateSelector select certificate":::

The control is updated to display the selected key vault and certificate name.

:::image type="content" source="./media/managed-application-elements/microsoft-keyvault-keyvaultcertificateselector-result.png" alt-text="Microsoft.KeyVault.KeyVaultCertificateSelector show selected certificate":::

## Schema

```json
{
  "name": "keyVaultCertificateSelection",
  "type": "Microsoft.KeyVault.KeyVaultCertificateSelector",
  "visible": true,
  "toolTip": "Select certificate",
  "label": "KeyVault certificates selection"
}
```

## Sample output

```json
{
  "keyVaultName": "azuretestkeyvault1",
  "keyVaultId": "/subscriptions/{subscription-id}/resourceGroups/resourcegroup1/providers/Microsoft.KeyVault/vaults/azuretestkeyvault1",
  "certificateName": "certificate1",
  "certificateUrl": "https://azuretestkeyvault1.vault.azure.net/secrets/certificate1/{id}",
  "certificateThumbprint": "1B721E84DDDD1BB69282B4A54F18C6ADB1C174F2"
}
```

## Next steps

* For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md).
* For a description of common properties in UI elements, see [CreateUiDefinition elements](create-uidefinition-elements.md).
