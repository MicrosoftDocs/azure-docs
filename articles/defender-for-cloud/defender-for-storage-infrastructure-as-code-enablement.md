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

To modify the monthly cap for malware scanning per storage account, adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the `isEnabled` value to **False** under Sensitive data discovery.

To disable the entire Defender for Storage plan, set the `pricingTier` property value to **Free** and remove the subPlan and extensions properties.

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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the on-upload malware scanning or Sensitive data threat detection features, you can change the `isEnabled` value to **False** under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to **Free** and remove the subPlan and extensions properties.

Learn more about the ARM template in the Microsoft.Security/Pricings documentation.

## [Enable on a storage account](#tab/enable-storage-account/)

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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the capGBPerMonth parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the `isEnabled` value to **false** under the `malwareScanning` or `sensitiveDataDiscovery` properties sections.

To disable the entire Defender plan for the storage account, set the `isEnabled` property value to **false** and remove the `malwareScanning` and `sensitiveDataDiscovery` sections from the properties.

Learn more about the [Microsoft.Security/DefenderForStorageSettings API](/rest/api/defenderforcloud/defender-for-storage/create) documentation.

> [!TIP]
> Malware Scanning can be configured to send scanning results to the following: <br>  **Event Grid custom topic** - for near-real time automatic response based on every scanning result. Learn more how to [configure malware scanning to send scanning events to an Event Grid custom topic](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-event-grid-for-malware-scanning). <br> **Log Analytics workspace** - for storing every scan result in a centralized log repository for compliance and audit. Learn more how to [configure malware scanning to send scanning results to a Log Analytics workspace](/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-logging-for-malware-scanning).

Learn more on how to set up response for malware scanning results.

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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the capGBPerMonth parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the isEnabled value to false under the malwareScanning or sensitiveDataDiscovery properties sections.

To disable the entire Defender plan for the storage account, set the isEnabled property value to false and remove the malwareScanning and sensitiveDataDiscovery sections from the properties.

---

## Next steps

Learn more about the [Microsoft.Security/DefenderForStorageSettings](/rest/api/defenderforcloud/defender-for-storage/create) API documentation.