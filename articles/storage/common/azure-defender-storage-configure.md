---
title: Protect your Azure storage accounts using Microsoft Defender for Cloud
titleSuffix: Azure Storage
description: Configure Microsoft Defender for Storage to detect anomalies in account activity and be notified of potentially harmful attempts to access the storage accounts in your subscription.
services: storage
author: bmansheim

ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.date: 01/18/2023
ms.author: benmansheim
ms.reviewer: ozgun
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Enable and configure Microsoft Defender for Storage

**Microsoft Defender for Storage** is an Azure-native solution offering an advanced layer of intelligence for threat detection and mitigation in storage accounts, powered by Microsoft Threat Intelligence, Microsoft Defender Antimalware technologies, and Sensitive Data Discovery. With protection for Azure Blob Storage, Azure Files, and Azure Data Lake Storage services, it provides a comprehensive alert suite, near real-time Malware Scanning (add-on), and sensitive data threat detection (no extra cost), allowing quick detection, triage, and response to potential security threats with contextual information.

With Microsoft Defender for Storage, organizations can customize their protection and enforce consistent security policies by enabling it on subscriptions and storage accounts with granular control and flexibility.

Learn more about Microsoft Defender for Storage [capabilities](../../defender-for-cloud/defender-for-storage-introduction.md) and [security threats and alerts](../../defender-for-cloud/defender-for-storage-threats-alerts.md).

> [!TIP]
> If you're currently using Microsoft Defender for Storage classic, consider upgrading to the new plan, which offers several benefits over the classic plan. Learn more about [migrating to the new plan](../../defender-for-cloud/defender-for-storage-classic-migrate.md).

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Feature availability:|- Activity monitoring (security alerts) - General availability (GA)<br>- Malware Scanning – Preview<br>- Sensitive data threat detection (Sensitive Data Discovery) – Preview|
|Pricing:|- Defender for Storage: $10/storage accounts/month\*<br>- Malware Scanning (add-on): Free during public preview\*\*<br><br>Above pricing applies to commercial clouds. Visit the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/) to learn more.<br><br>\* Storage accounts that exceed 73 million monthly transactions will be charged $0.1492 for every 1 million transactions that exceed the threshold.<br>\*\* In the future, Malware Scanning will be priced at $0.15/GB of data ingested. Billing for Malware Scanning is not enabled during public preview and advanced notice will be given before billing starts.|
| Supported storage types:|[Blob Storage](https://azure.microsoft.com/products/storage/blobs/) (Standard/Premium StorageV2, including Data Lake Gen2): Activity monitoring, Malware Scanning, Sensitive Data Discovery<br>Azure Files (over REST API and SMB): Activity monitoring |
|Required roles and permissions:|For Malware Scanning and sensitive data threat detection at subscription and storage account levels, you need Owner roles (subscription owner/storage account owner) or specific roles with corresponding data actions. To enable Activity Monitoring, you need 'Security Admin' permissions. Read more about the required permissions.|
|Clouds:|:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Commercial clouds\*<br>:::image type="icon" source="../../defender-for-cloud/media/icons/yes-icon.png"::: Azure Government (Only for activity monitoring)<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Azure China 21Vianet<br>:::image type="icon" source="../../defender-for-cloud/media/icons/no-icon.png"::: Connected AWS accounts|

\* Azure DNS Zone is not supported for Malware Scanning and sensitive data threat detection.

## Prerequisites for Malware Scanning

### Networking configuration

Malware Scanning supports storage accounts with “Networking” > “Public network access” enabled, either from all networks or from selected virtual networks. 
Malware Scanning is not supported for storage accounts with “Public network access” set to disabled.

:::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/networking.png" alt-text="Screenshot showing where to configure Public network access.":::

### Permissions

To enable and configure Malware Scanning, you must have Owner roles (such as Subscription Owner or Storage Account Owner) or specific roles with the necessary data actions. Learn more about the [required permissions](../../defender-for-cloud/support-matrix-defender-for-storage.md).

### Event Grid resource provider

Event Grid resource provider must be registered to be able to create the Event Grid System Topic used for detect upload triggers.
Follow [these steps](../../event-grid/blob-event-quickstart-portal.md#register-the-event-grid-resource-provider) to verify Event Grid is registered on your subscription.

:::image type="content" source="media/azure-defender-storage-configure/register-event-grid-resource-provider.png" alt-text="Diagram showing how to register Event Grid as a resource provider." lightbox="media/azure-defender-storage-configure/register-event-grid-resource-provider.png":::

You must have permission to the `/register/action` operation for the resource provider. This permission is included in the Contributor and Owner roles.

## Set up Microsoft Defender for Storage

To enable and configure Microsoft Defender for Storage to ensure maximum protection and cost optimization, the following configuration options are available:

- Enable/disable Microsoft Defender for Storage.
- Enable/disable the Malware Scanning or sensitive data threat detection configurable features.
- Set a monthly cap on the Malware Scanning per storage account to control costs (Default value is 5000GB per storage account per month).
- Configure additional methods for saving malware scanning results and logging.

    > [!TIP]
    > The Malware Scanning features has [advanced configurations](../../defender-for-cloud/defender-for-storage-configure-malware-scan.md) to help security teams support different workflows and requirements.

- Override subscription-level settings to configure specific storage accounts with custom configurations that differ from the settings configured at the subscription level.

You can enable and configure Microsoft Defender for Storage from the Azure portal, built-in Azure policies, programmatically using IaC templates (Bicep and ARM) or directly with REST API.

> [!NOTE]
> To prevent migrating back to the legacy classic plan, make sure to disable the old Defender for Storage policies. Look for and disable policies named **Configure Azure Defender for Storage to be enabled**, **Azure Defender for Storage should be enabled**, or **Configure Microsoft Defender for Storage to be enabled (per-storage account plan)**.

## [Enable on a subscription](#tab/enable-subscription/)

We recommend that you enable Defender for Storage on the subscription level. Doing so ensures all storage accounts in the subscription will be protected, including future ones.

There are several ways to enable Defender for Storage on subscriptions:

- [Azure portal](#azure-portal)
- [Azure built-in policy](#enable-and-configure-at-scale-with-an-azure-built-in-policy)
- IaC templates, including [Bicep](#bicep-template) and [ARM](#arm-template)
- [REST API](#rest-api)

> [!TIP]
> You can [override or set custom configuration settings](#override-defender-for-storage-subscription-level-settings) for specific storage accounts within protected subscriptions.

### Azure portal

To enable Defender for Storage at the subscription level using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.
1. Select the subscription for which you want to enable Defender for Storage.

    :::image type="content" source="media/azure-defender-storage-configure/defender-for-cloud-select-subscription.png" alt-text="Screenshot showing how to select a subscription in Defender for Cloud." lightbox="media/azure-defender-storage-configure/defender-for-cloud-select-subscription.png":::

1. On the **Defender plans** page, locate **Storage** in the list and select **On** and **Save**.

    If you currently have Defender for Storage enabled with per-transaction pricing, select the **New pricing plan available** link and confirm the pricing change.

    :::image type="content" source="media/azure-defender-storage-configure/enable-azure-defender-security-center.png" alt-text="Screenshot showing how to enable Defender for Storage in Defender for Cloud." lightbox="media/azure-defender-storage-configure/enable-azure-defender-security-center.png":::

Microsoft Defender for Storage is now enabled for this subscription, and is fully protected, including on-upload malware scanning and sensitive data threat detection.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection**, you can select **Settings** and change the status of the relevant feature to Off.

If you want to change the malware scanning size cap per storage account per month for malware, change the settings in **Edit configuration**.

:::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/defender-for-storage-configuration.png" alt-text="Screenshot showing where to enable Malware Scanning and Sensitive data threat protection.":::

If you want to disable the plan, toggle the status button to **Off** for the Storage plan on the Defender plans page.

### Enable and configure at scale with an Azure built-in policy 

To enable and configure Defender for Storage at scale with an Azure built-in policy to ensure that consistent security policies are applied across all existing and new storage accounts within the subscriptions, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to the Policy dashboard.
1. In the Policy dashboard, select **Definitions** from the left-side menu.
1. In the “Security Center” category, search for and then select the **Configure Microsoft Defender for Storage to be enabled**. This policy will enable all Defender for Storage capabilities: Activity Monitoring, Malware Scanning and Sensitive Data Threat Detection. You can also get it here: [List of built-in policy definitions](../../governance/policy/samples/built-in-policies.md#security-center)
    If you want to enable a policy without the configurable features, use **Configure basic Microsoft Defender for Storage to be enabled (Activity Monitoring only)**.
1. Choose the policy and review it.
1. Select **Assign** and edit the policy details. You can fine-tune, edit, and add custom rules to the policy.
1. Once you have completed reviewing, select **Review + create**.
1. Select **Create** to assign the policy.

### Enable and configure with IaC templates

#### Bicep template

To enable and configure Microsoft Defender for Storage at the subscription level using [Bicep](../../azure-resource-manager/bicep/overview.md), make sure your [target scope is set to `subscription`](../../azure-resource-manager/bicep/deploy-to-subscription.md#scope-to-subscription), and add the following to your Bicep template:

```bicep
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

To modify the monthly cap for malware scanning per storage account, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `False` under Sensitive data discovery.

To disable the entire Defender for Storage plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.
Learn more about the [Bicep template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-bicep&source=docs).

#### ARM template

To enable and configure Microsoft Defender for Storage at the subscription level using an ARM template, add this JSON snippet to the resources section of your ARM template:

```json
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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `False` under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

### Enable and configure with REST API 

To enable and configure Microsoft Defender for Storage at the subscription level using REST API, create a PUT request with this endpoint (replace the `subscriptionId` in the endpoint URL with your own Azure subscription ID):

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2023-01-01
```

And add the following request body:

```json
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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `False` under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update) in HTTP, Java, Go and JavaScript.

## [Enable on a storage account](#tab/enable-storage-account/)

You can enable and configure Microsoft Defender for Storage on specific storage accounts in several ways:

- [Azure portal](#azure-portal-1)
- IaC templates, including [Bicep](#bicep-template-1) and [ARM](#arm-template-1)
- [REST API](#rest-api-1)

The steps below include instructions on how to set up logging and an Event Grid for the Malware Scanning.

### Azure portal

To enable and configure Microsoft Defender for Storage for a specific account using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your storage account.
1. In the storage account menu, in the **Security + networking** section, select **Microsoft Defender for Cloud**.
1. **On-upload Malware Scanning** and **Sensitive data threat detection** are enabled by default. You can disable the features by unselecting them.
1. Select **Enable on storage account**.

:::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/storage-account-enablement.png" alt-text="Screenshot showing where to enable On-upload malware scanning and Sensitive data threat detection for a specific storage account.":::

Microsoft Defender for Storage is now enabled on this storage account.

> [!TIP]
> To configure **On-upload malware scanning** settings, such as monthly cap, select **Settings** after Defender for Storage was enabled.
> :::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/malware-scan-capping.png" alt-text="Screenshot showing where to configure a monthly cap for Malware Scanning.":::

If you want to disable Defender for Storage on the storage account or disable one of the features (On-upload malware scanning or Sensitive data threat detection), select **Settings**, edit the settings, and select **Save**.

### Enable and configure with IaC templates

#### ARM template

To enable and configure Microsoft Defender for Storage at the storage account level using an ARM template, add this JSON snippet to the resources section of your ARM template:

```json
{
    "type": "Microsoft.Storage/storageAccounts/providers/DefenderForStorageSettings",
    "apiVersion": "2022-12-01-preview",
    "name": "[concat(parameters('accountName'), '/Microsoft.Security/current')]",
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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `false` under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.

Learn more about the [ARM template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-arm-template).

#### Bicep template

To enable and configure Microsoft Defender for Storage at the subscription level with per-transaction pricing using [Bicep](../../azure-resource-manager/bicep/overview.md), add the following to your Bicep template:

```bicep
param accountName string

resource accountName_current 'Microsoft.Storage/storageAccounts/providers/DefenderForStorageSettings@2022-12-01-preview' = {
  name: '${accountName}/Microsoft.Security/current'
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

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `false` under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.

Learn more about the [Bicep template AzAPI reference](/azure/templates/microsoft.security/pricings?pivots=deployment-language-bicep&source=docs).

### REST API

To enable and configure Microsoft Defender for Storage at the subscription level using REST API, create a PUT request with this endpoint. Replace the `subscriptionId` , `resourceGroupName`, and `accountName` in the endpoint URL with your own Azure subscription ID, resource group and storage account names accordingly.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/pricings/StorageAccounts?api-version=2023-01-01
```

And add the following request body:

```json
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
        "overrideSubscriptionLevelSettings": false
    }
}
```

To modify the monthly threshold for malware scanning in your storage accounts, simply adjust the `CapGBPerMonthPerStorageAccount` parameter to your preferred value. This parameter sets a cap on the maximum data that can be scanned for malware each month, per storage account. If you want to permit unlimited scanning, assign the value `-1`. The default limit is set at 5,000 GB.

If you want to turn off the **On-upload malware scanning** or **Sensitive data threat detection** features, you can change the `isEnabled` value to `false` under Sensitive data discovery.

To disable the entire Defender plan, set the `pricingTier` property value to `Free` and remove the `subPlan` and `extensions` properties.

Learn more about the [updating Defender plans with the REST API](/rest/api/defenderforcloud/pricings/update) in HTTP, Java, Go and JavaScript.

### Configure Malware Scanning

#### Setting Up Logging for Malware Scanning

For each storage account enabled with Malware Scanning, you can define a Log Analytics workspace destination to store every scan result in a centralized log repository that is easy to query.

:::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/log-analytics-settings.png" alt-text="Screenshot showing where to configure a Log Analytics destination for scan logs.":::

1. Before sending scan results to Log Analytics, [create a Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md) or use an existing one.

1. To configure the Log Analytics destination, navigate to the relevant storage account, open the "Microsoft Defender for Cloud" tab, and select the settings to configure.

This configuration can be performed using REST API as well:

Request URL:

```http
PUT
https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>
/providers/Microsoft.Security/antiMalwareSettings/current/providers/Microsoft.Insights/
diagnosticSettings/service?api-version=2021-05-01-preview
```

Request Body:

```json
{
    "properties": {
        "workspaceId": "/subscriptions/704601a1-0ac4-4d5d-aecd-322835fbde2f/resourcegroups/demorg/providers/microsoft.operationalinsights/workspaces/malwarescanningscanresultworkspace",
        "logs": [
            {
                "categoryGroup": "allLogs",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": true,
                    "days": 180
                }
            }
        ]
    }
}
```

### Setting Up Event Grid for Malware Scanning

For each storage account enabled with Malware Scanning, you can configure to send every scan result using Event Grid event for automation purposes.

1. To configure Event Grid for sending scan results, you'll first need to create a custom topic in advance. Refer to the Event Grid documentation on creating custom topics for guidance. Ensure that the destination Event Grid custom topic is created in the same region as the storage account from which you want to send scan results.

1. To configure the Event Grid custom topic destination, go to the relevant storage account, open the "Microsoft Defender for Cloud" tab, and select the settings to configure.

> [!NOTE]
> When you set a Event Grid custom topic, you should set “**Override Defender for Storage subscription-level settings**” to “**ON**” to make sure it overrides the subscription-level settings.

:::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/event-grid-settings.png" alt-text="Screenshot showing where to enable an Event Grid destination for scan logs.":::

This configuration can be performed using REST API as well:

Request URL:

```http
PUT
https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resourcegroup-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name> 
/providers/Microsoft.Security/DefenderForStorageSettings/current?api-version=2022-12-01-preview
```

Request Body:

```json
{ 
    "properties": { 
        "isEnabled": true, 
        "malwareScanning": { 
            "onUpload": { 
                "isEnabled": true, 
                "capGBPerMonth": 5000 
            }, 
            "scanResultsEventGridTopicResourceId": "/subscriptions/704601a1-0ac4-4d5d-aecd-322835fbde2f/resourceGroups/DemoRG/providers/Microsoft.EventGrid/topics/ScanResultsEGCustomTopic" 
        }, 
        "sensitiveDataDiscovery": { 
            "isEnabled": true 
        }, 
        "overrideSubscriptionLevelSettings": true 
    } 
}
```

---

### Override Defender for Storage subscription-level settings

Defender for Storage settings on each storage account is inherited by the subscription-level settings. Use Override Defender for Storage subscription-level settings to configure settings that are different from the settings that are configured on the subscription-level.

The override setting is usually used for the following scenarios:

1. Enable the malware scanning or the data sensitivity threat detection features.

1. Configure custom settings for Malware Scanning.

1. Disable Microsoft Defender for Storage on specific storage accounts.

> [!NOTE]
> We recommend that you enable Defender for Storage on the entire subscription to protect all existing and future storage accounts in it. However, there are some cases where you would want to exclude specific storage accounts from Defender protection. If you've decided to exclude, follow the steps below to use the override setting and then disable the relevant storage account.
>
> If you are using the Defender for Storage (classic), you can also [exclude storage accounts](../../defender-for-cloud/defender-for-storage-classic-enable.md).

#### Azure portal

To override Defender for Storage subscription-level settings to configure settings that are different from the settings that are configured on the subscription-level using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/)

1. Navigate to your storage account that you want to configure custom settings.

1. In the storage account menu, in the **Security + networking** section, select **Microsoft Defender for Cloud**.

1. Select **Settings** in Microsoft Defender for Storage.

1. Set the status of **Override Defender for Storage subscription-level settings** (under Advanced settings) to **On**. This ensures that the settings are saved only for this storage account and will not be overrun by the subscription settings.

1. Configure the settings you want to change:

    1. To enable malware scanning or sensitive data threat detection, set the status to **On**.

    1. To modify the settings of malware scanning:

        1. Switch the "**On-upload malware scanning**" to **On** if it’s not already enabled.

        1. Check the relevant boxes underneath and change the settings. If you wish to permit unlimited scanning, assign the value `-1`.

    Learn more about [malware scanning settings](../../defender-for-cloud/defender-for-storage-configure-malware-scan.md).

1. To disable Defender for Storage on this storage accounts, set the status of Microsoft Defender for Storage to **Off**.

    :::image type="content" source="../../defender-for-cloud/media/azure-defender-storage-configure/defender-for-storage-settings.png" alt-text="Screenshot showing where to turn off Defender for Storage in the Azure portal.":::

1. Select **Save**.

#### REST API

To override Defender for Storage subscription-level settings to configure settings that are different from the settings that are configured on the subscription-level using the REST API:

1. Create a PUT request with this endpoint. Replace the `subscriptionId`, `resourceGroupName`, and `accountName` in the endpoint URL with your own Azure subscription ID, resource group and storage account names accordingly.

    Request URL:
    
    ```http
    PUT
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{accountName}/providers/Microsoft.Security/DefenderForStorageSettings/current?api-version=2022-12-01-preview
    ```
    
    Request Body:
    
    ```json
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

    1. To enable malware scanning or sensitive data threat detection, set the value of `isEnabled` to `true` under the relevant features.
    
    1. To modify the settings of malware scanning, edit the relevant fields under “onUpload”, make sure the value of isEnabled is true. If you wish to permit unlimited scanning, assign the value -1 to the capGBPerMonth parameter.
    
        Learn more about [malware scanning settings](../../defender-for-cloud/defender-for-storage-malware-scan.md).
    
    1. To disable Defender for Storage on this storage accounts, use the following request body:
    
    ```json
    {
        "properties": {
            "isEnabled": false,
            "overrideSubscriptionLevelSettings": true
        }
    }

1. Make sure you add the parameter `overrideSubscriptionLevelSettings` and its value is set to `true`. This ensures that the settings are saved only for this storage account and will not be overrun by the subscription settings.
