---
title: Enable and Configure the Microsoft Defender for Storage plan at scale using REST API
description: Learn how to enable the Defender for Storage on your Azure subscription for Microsoft Defender for Cloud using REST API.
ms.topic: install-set-up-deploy
ms.date: 08/01/2023
---

# Enable and configure with REST API

We recommend that you enable Defender for Storage on the subscription level. Doing so ensures all storage accounts in the subscription will be protected, including future ones.

> [!TIP]
> You can always [configure specific storage accounts](https://learn.microsoft.com/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-subscription#override-defender-for-storage-subscription-level-settings) with custom configurations that differ from the settings configured at the subscription level (override subscription-level settings).

## Use REST API to enable on a subscription (recommended)

To enable and configure Microsoft Defender for Storage at the subscription level using REST API, create a PUT request with this endpoint (replace the subscriptionId in the endpoint URL with your own Azure subscription ID):

PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2023-01-01
And add the following request body:

```
{
    "properties": {
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
        ],
        "subPlan": "DefenderForStorageV2",
        "pricingTier": "Standard"
    }
}
```
To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the CapGBPerMonthPerStorageAccount parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the isEnabled value to False under Sensitive data discovery.

To disable the entire Defender plan, set the pricingTier property value to Free and remove the subPlan and extensions properties.

Learn more about [updating Defender plans with the REST API](https://learn.microsoft.com/rest/api/defenderforcloud/pricings/update?tabs=HTTP) in HTTP, Java, Go and JavaScript.

## Use REST API to enable on a storage account

To enable and configure Microsoft Defender for Storage at the storage account level using REST API, create a PUT request with this endpoint. Replace the subscriptionId , resourceGroupName, and accountName in the endpoint URL with your own Azure subscription ID, resource group and storage account names accordingly.

**PUT**
```
https://management.azure.com/{resourceId}/providers/Microsoft.Security/defenderForStorageSettings/current?api-version=2022-12-01-preview

```
And add the following request body:

```
{
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
    }
}
```

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the capGBPerMonth parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value -1. The default limit is set at 5,000 GB.

If you want to turn off the On-upload malware scanning or Sensitive data threat detection features, you can change the isEnabled value to false under the malwareScanning or sensitiveDataDiscovery properties sections.

To disable the entire Defender plan for the storage account, set the isEnabled property value to false and remove the malwareScanning and sensitiveDataDiscovery sections from the properties.

Learn more about the [Microsoft.Security/DefenderForStorageSettings API](https://learn.microsoft.com/rest/api/defenderforcloud/defender-for-storage/create?tabs=HTTP) documentation.

> [!TIP]
> Malware Scanning can be configured to send scanning results to the following: - **Event Grid custom topic** - for near-real time automatic response based on every scanning result. Learn more how to [configure Malware Scanning to send scanning events to an Event Grid custom topic](https://learn.microsoft.com/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-event-grid-for-malware-scanning); **Log Analytics workspace** - for storing every scan result in a centralized log repository for compliance and audit. Learn more how to [configure Malware Scanning to send scanning results to a Log Analytics workspace](https://learn.microsoft.com/azure/storage/common/azure-defender-storage-configure?toc=%2Fazure%2Fdefender-for-cloud%2Ftoc.json&tabs=enable-storage-account#setting-up-logging-for-malware-scanning).

Learn more on how to [set up response for malware scanning](https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-configure-malware-scan) results.

## Next Steps

- Learn how to [enable and Configure the Defender for Storage plan at scale with an Azure built-in policy](defender-for-storage-policy-enablement.md).