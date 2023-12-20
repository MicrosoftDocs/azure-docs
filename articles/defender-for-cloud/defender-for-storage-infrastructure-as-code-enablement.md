---
title: Infrastructure as Code enablement | Microsoft Defender for Storage
description: Learn how to enable and configure Microsoft Defender for Storage with IaC templates.
ms.date: 08/08/2023
author: AlizaBernstein
ms.author: v-bernsteina
ms.topic: how-to
---

# Enable and configure with Infrastructure as Code templates

We recommend that you enable Defender for Storage on the subscription level. Doing so ensures all storage accounts in the subscription will be protected, including future ones.

> [!TIP]
> You can always [configure specific storage accounts](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-subscription#override-defender-for-storage-subscription-level-settings) with custom configurations that differ from the settings configured at the subscription level (override subscription-level settings).

## [Enable on a subscription](#tab/enable-subscription/)

### Terraform template

To enable and configure Microsoft Defender for Storage at the subscription level using Terraform, you can use the following code snippet:

```
resource "azurerm_security_center_subscription_pricing" "DefenderForStorage" {
  tier          = "Standard"
  resource_type = "StorageAccounts"
  subplan       = "DefenderForStorageV2"
 
  extension {
    name = "OnUploadMalwareScanning"
    additional_extension_properties = {
      CapGBPerMonthPerStorageAccount = "5000"
    }
  }
 
  extension {
    name = "SensitiveDataDiscovery"
  }
}
```

**Modifying the monthly cap for malware scanning**

To modify the monthly cap for malware scanning per storage account, adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month per storage account. If you want to permit unlimited scanning, assign the value "-1". The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the on-upload malware scanning or sensitive data threat detection features, you can remove the corresponding extension block from the Terraform code.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender for Storage plan, set the `tier` property value to **"Free"** and remove the `subPlan` and `extension` properties.

Learn more about the `azurerm_security_center_subscription_pricing` resource by referring to the [azurerm_security_center_subscription_pricing documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/security_center_subscription_pricing). Additionally, you can find comprehensive details on the Terraform provider for Azure in the [Terraform AzureRM Provider documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).

### Bicep template

To enable and configure Microsoft Defender for Storage at the subscription level using [Bicep](/azure/azure-resource-manager/bicep/overview?tabs=bicep), make sure your [target scope is set to subscription](/azure/azure-resource-manager/bicep/deploy-to-subscription?tabs=azure-cli#scope-to-subscription), and add the following to your Bicep template:

```
resource StorageAccounts 'Microsoft.Security/pricings@2023-01-01' = {
  name: 'StorageAccounts'
  properties: {
    pricingTier: 'Standard'
    subPlan: 'DefenderForStorageV2'
    extensions: [
      {
        name: 'OnUploadMalwareScanning'
        isEnabled: 'True'
        additionalExtensionProperties: {
          CapGBPerMonthPerStorageAccount: '5000'
        }
      }
      {
        name: 'SensitiveDataDiscovery'
        isEnabled: 'True'
      }
    ]
  }
}
```

**Modifying the monthly cap for malware scanning**

To modify the monthly cap for malware scanning per storage account, adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the `isEnabled` value to **False** under sensitive data discovery.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender for Storage plan, set the `pricingTier` property value to **Free** and remove the `subPlan` and `extensions` properties.

Learn more about the [Bicep template in the Microsoft security/pricings documentation](/azure/templates/microsoft.security/pricings?pivots=deployment-language-bicep&source=docs).

### Azure Resource Manager template

To enable and configure Microsoft Defender for Storage at the subscription level using an ARM (Azure Resource Manager) template, add this JSON snippet to the resources section of your ARM template:

```
{
    "type": "Microsoft.Security/pricings",
    "apiVersion": "2023-01-01",
    "name": "StorageAccounts",
    "properties": {
        "pricingTier": "Standard",
        "subPlan": "DefenderForStorageV2",
        "extensions": [
            {
                "name": "OnUploadMalwareScanning",
                "isEnabled": "True",
                "additionalExtensionProperties": {
                    "CapGBPerMonthPerStorageAccount": "5000"
                }
            },
            {
                "name": "SensitiveDataDiscovery",
                "isEnabled": "True"
            }
        ]
    }
}
```

**Modifying the monthly cap for malware scanning**

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the on-upload malware scanning or sensitive data threat detection features, you can change the `isEnabled` value to **False** under sensitive data discovery.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender plan, set the `pricingTier` property value to **Free** and remove the `subPlan` and `extension` properties.

Learn more about the ARM template in the Microsoft.Security/Pricings documentation.

## [Enable on a storage account](#tab/enable-storage-account/)

### Terraform template - storage account

To enable and configure Microsoft Defender for Storage at the storage account level using Terraform, import the [AzAPI provider](https://registry.terraform.io/providers/Azure/azapi/latest/docs) and use the following code snippet:

```
resource "azurerm_storage_account" "example" { ... }

resource "azapi_resource_action" "enable_defender_for_Storage" {
  type        = "Microsoft.Security/defenderForStorageSettings@2022-12-01-preview"
  resource_id = "${azurerm_storage_account.example.id}/providers/Microsoft.Security/defenderForStorageSettings/current"
  method      = "PUT"

  body = jsonencode({
    properties = {
      isEnabled = true
      malwareScanning = {
        onUpload = {
          isEnabled     = true
          capGBPerMonth = 5000
        }
      }
      sensitiveDataDiscovery = {
        isEnabled = true
      }
      overrideSubscriptionLevelSettings = true
    }
  })
}
```

> [!NOTE]
> The `azapi_resource_action` used here is an action that is specific to the configuration of Microsoft Defender for Storage. It's different from the typical resource declarations in Terraform, and it's used to perform specific actions on the resource, such as enabling or disabling features.

**Modifying the monthly cap for malware scanning**

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `capGBPerMonth` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value "-1". The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the on-upload malware scanning or sensitive data threat detection features, you can change the `isEnabled` value to **False** under the `malwareScanning` or `sensitiveDataDiscovery` properties sections.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender for Storage plan for the storage account, you can use the following code snippet:


```
resource "azurerm_storage_account" "example" { ... }

resource "azapi_resource_action" "disable_defender_for_Storage" {
  type        = "Microsoft.Security/defenderForStorageSettings@2022-12-01-preview"
  resource_id = "${azurerm_storage_account.example.id}/providers/Microsoft.Security/defenderForStorageSettings/current"
  method      = "PUT"

  body = jsonencode({
    properties = {
      isEnabled = false
      overrideSubscriptionLevelSettings = false
    }
  })
}
```

You can change the value of `overrideSubscriptionLevelSettings` to **True** to disable Defender for Storage plan for the storage account under subscriptions with Defender for Storage enabled at the subscription level. If you want to keep some features enabled, you can modify the properties accordingly.
Learn more about the __[Microsoft.Security/defenderForStorageSettings](/rest/api/defenderforcloud/defender-for-storage/create)__ API documentation for further customization and control over your storage account's security settings. Additionally, you can find comprehensive details on the Terraform provider for Azure in the [Terraform AzureRM Provider documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).

### Bicep template - storage account

To enable and configure Microsoft Defender for Storage at the storage account level using Bicep, add the following to your Bicep template:

```
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' ...

resource defenderForStorageSettings 'Microsoft.Security/DefenderForStorageSettings@2022-12-01-preview' = {
  name: 'current'
  scope: storageAccount
  properties: {
    isEnabled: true
    malwareScanning: {
      onUpload: {
        isEnabled: true
        capGBPerMonth: 5000
      }
    }
    sensitiveDataDiscovery: {
      isEnabled: true
    }
    overrideSubscriptionLevelSettings: true
  }
}
```

**Modifying the monthly cap for malware scanning**

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `capGBPerMonth parameter` to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the On-upload malware scanning or sensitive data threat detection features, you can change the `isEnabled` value to **False** under the `malwareScanning` or `sensitiveDataDiscovery` properties sections.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender plan for the storage account, set the `isEnabled` property value to **False** and remove the `malwareScanning` and `sensitiveDataDiscovery` sections from the properties.

Learn more about the [Microsoft.Security/DefenderForStorageSettings API](/rest/api/defenderforcloud/defender-for-storage/create) documentation.

> [!TIP]
> Malware Scanning can be configured to send scanning results to the following: <br>  **Event Grid custom topic** - for near-real time automatic response based on every scanning result. Learn more how to [configure malware scanning to send scanning events to an Event Grid custom topic](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-event-grid-for-malware-scanning). <br> **Log Analytics workspace** - for storing every scan result in a centralized log repository for compliance and audit. Learn more how to [configure malware scanning to send scanning results to a Log Analytics workspace](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-logging-for-malware-scanning).

Learn more on how to [set up response for malware scanning results.](/azure/defender-for-cloud/defender-for-storage-configure-malware-scan)

### ARM template - storage account

To enable and configure Microsoft Defender for Storage at the storage account level using an ARM template, add this JSON snippet to the resources section of your ARM template:

```
{
    "type": "Microsoft.Security/DefenderForStorageSettings",
    "apiVersion": "2022-12-01-preview",
    "name": "current",
    "properties": {
        "isEnabled": true,
        "malwareScanning": {
            "onUpload": {
                "isEnabled": true,
                "capGBPerMonth": 5000
            }
        },
        "sensitiveDataDiscovery": {
            "isEnabled": true
        },
        "overrideSubscriptionLevelSettings": true
    },
    "scope": "[resourceId('Microsoft.Storage/storageAccounts', parameters('StorageAccountName'))]"
}
```

**Modifying the monthly cap for malware scanning**

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `capGBPerMonth` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value "-1". The default limit is set at 5,000 GB.

**Disabling features**

If you want to turn off the on-upload malware scanning or sensitive data threat detection features, you can change the `isEnabled` value to **False** under the `malwareScanning` or `sensitiveDataDiscovery` properties sections.

**Disabling the entire Defender for Storage plan**

To disable the entire Defender plan for the storage account, set the `isEnabled` property value to **False** and remove the `malwareScanning` and `sensitiveDataDiscovery` sections from the properties.

---

## Next steps

Learn more about the [Microsoft.Security/DefenderForStorageSettings](/rest/api/defenderforcloud/defender-for-storage/create) API documentation.

