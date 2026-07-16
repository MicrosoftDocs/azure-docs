---
title: Enable additional data collection for Arc-enabled servers
description: Learn how to enable additional data collection on Arc-enabled servers using the Azure Migrate Collector VM extension for right-sized assessments and comprehensive migration planning.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: how-to
ms.date: 10/23/2025
ms.custom: engagement-fy25
monikerRange: migrate
---

# Enable additional data collection for Arc-enabled servers

This article describes how to enable additional data collection from Arc-enabled servers to enhance Azure Migrate assessments and business case recommendations.

By default, Azure Migrate projects for Arc resources collect basic configuration metadata from Arc-enabled servers. To provide right-sized recommendations and comprehensive migration insights comparable to appliance-based discovery, you can enable additional data collection using the Azure Migrate Collector VM extension.

## What additional data can be collected?

The Azure Migrate Collector VM extension enhances your migration assessments by collecting additional data beyond basic configuration:

### Currently available

The following data is collected in the current preview:
- **Performance metrics**: 
  - CPU utilization percentage over time
  - Memory utilization percentage over time
  - Disk IOPS (read and write operations per second)
  - Disk throughput (MB/s read and write)
  - Network utilization

### Preview limitations
The following data is not collected in the current preview:
- **Software inventory**: Installed applications, packages, and versions
- **Web applications**: Information about .NET and Java web apps
- **Dependencies**: Network connections and service dependencies between servers
- **Databases**: Information about MySQL and PostgreSQL databases.

> [!NOTE]
> This article describes the data collection capabilities that are currently available data. The documentation will be updated, as new features become available.

## Benefits of additional data collection

Enabling additional data collection provides:

- **Right-sized recommendations**: Azure VM SKU recommendations based on actual resource utilization rather than just current configuration.
- **Accurate cost estimates**: Cost projections based on real-world usage patterns.
- **Improved business case**: More accurate savings calculations for migration planning.


## Prerequisites

- An existing Azure Migrate project created for Arc resources. If you don't have one, see [Create a migrate project for Arc resources](quickstart-evaluate-readiness-savings-for-arc-resources.md).
- Arc-enabled servers running the connected machine agent version [1.46 (September 2024 release)](/azure/azure-arc/servers/agent-release-notes-archive#version-146---september-2024) or higher.
- **Hybrid Server Resource Administrator** role on the Arc-enabled server resources where you want to enable data collection.
- Network connectivity from Arc-enabled servers to the Azure Migrate endpoint - ```https://*.migration.windowsazure.com```

## How additional data collection works

Additional data collection is enabled through the Azure Migrate Collector VM extension:

1. **Extension deployment and configuration**:  Install the VM extension on Arc-enabled servers (Windows or Linux). Configure the extension with your Azure Migrate project information during installation. 
2. **Data collection**: The extension collects performance metrics and other data at regular intervals.
3. **Data transmission**: The collected data is securely transmitted to your Azure Migrate project.
4. **Assessment enhancement**: Azure Migrate uses the additional data to provide enhanced recommendations.

## Enable additional data collection

You can enable additional data collection on individual servers or at scale across multiple servers.

### Enable for a single server

Choose your preferred method to enable additional data collection on a single Arc-enabled server.

#### [Portal](#tab/portal)

1. In the Azure portal, navigate to your Arc-enabled server.

2. In the left menu, under **Settings**, select **Extensions**.

3. Select **+ Add**.

4. Search for **Azure Migrate Collector for Windows** or **Azure Migrate Collector for Linux**, based on your server's operating system, and select it. 

5. Select **Next**.

6. On the **Configure** tab, provide the following settings:

   | Setting | Value |
   |---------|-------|
   | Migrate Projects | Paste the JSON array containing your project information (see format below) |

   Use the following JSON format for the **Migrate Projects** setting:
   
   ```json
   [{"id":"/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Migrate/migrateProjects/<project-name>","location":"<project-region>"}]
   ```

   Replace the placeholders:
   - `<subscription-id>`: Your Azure Migrate project's subscription ID
   - `<resource-group>`: Your Azure Migrate project's resource group name
   - `<project-name>`: Your Azure Migrate project name
   - `<project-region>`: Your Azure Migrate project region (e.g., eastus, westeurope)

7. Select **Review + create**.

8. Review the settings and select **Create**.

The extension installation takes a few minutes. After installation, additional data collection starts automatically.

#### [Azure CLI](#tab/cli)

Use the following Azure CLI commands to enable additional data collection on a single Arc-enabled server.

**For Windows Arc-enabled servers:**

```azurecli
az connectedmachine extension create \
  --resource-group "<arc-server-resource-group>" \
  --machine-name "<arc-server-name>" \
  --location "<arc-server-location>" \
  --name "AzureMigrateCollectorForWindows" \
  --publisher "Microsoft.Azure.Migrate" \
  --type "AzureMigrateCollectorForWindows" \
  --settings '{"migrateProjects":[{"id":"/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Migrate/migrateProjects/<project-name>","location":"<project-region>"}]}'
```

**For Linux Arc-enabled servers:**

```azurecli
az connectedmachine extension create \
  --resource-group "<arc-server-resource-group>" \
  --machine-name "<arc-server-name>" \
  --location "<arc-server-location>" \
  --name "AzureMigrateCollectorForLinux" \
  --publisher "Microsoft.Azure.Migrate" \
  --type "AzureMigrateCollectorForLinux" \
  --settings '{"migrateProjects":[{"id":"/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Migrate/migrateProjects/<project-name>","location":"<project-region>"}]}'
```

Replace the placeholders in the commands:
- `<arc-server-resource-group>`: Resource group containing the Arc-enabled server
- `<arc-server-name>`: Name of the Arc-enabled server
- `<arc-server-location>`: Azure region of the Arc-enabled server
- `<subscription-id>`: Your Azure Migrate project's subscription ID
- `<resource-group>`: Your Azure Migrate project's resource group name
- `<project-name>`: Your Azure Migrate project name
- `<project-region>`: Your Azure Migrate project region

---

### Enable at scale using Azure Policy

To enable additional data collection across multiple Arc-enabled servers, use Azure Policy. This approach is recommended for large environments or when you want to ensure consistent data collection across your estate.

> [!IMPORTANT]
> You must have **Owner** role on all subscriptions with Arc resources that you included in the Azure Migrate project scope.

#### Step 1: Create custom policy for Linux machines

1. In the Azure portal, navigate to **Policy** > **Definitions** > **+ Policy definition**.

2. For **Definition location**, select the subscription where you want to store the policy definition.

3. Provide the following details:
   - **Name**: `Enable Azure Migrate data collection on Arc-enabled Linux machines`
   - **Description**: `Automatically deploy Azure Migrate Collector extension on Arc-enabled Linux machines to enable additional data collection for migration assessments.`
   - **Category**: Select **Use existing** and choose **Migrate** from the dropdown.

4. For **Policy rule**, replace the contents with the following JSON:

   ```json
   {
     "mode": "Indexed",
     "parameters": {
       "extensionName": {
         "type": "String",
         "metadata": {
           "description": "Name of the extension to deploy"
         },
         "defaultValue": "AzureMigrateCollectorForLinux"
       },
       "migrateProjects": {
         "type": "Array",
         "metadata": {
           "description": "List of migrate projects with armId and location"
         }
       }
     },
     "policyRule": {
       "if": {
         "allOf": [
           {
             "field": "type",
             "equals": "Microsoft.HybridCompute/machines"
           },
           {
             "field": "Microsoft.HybridCompute/machines/osType",
             "equals": "Linux"
           }
         ]
       },
       "then": {
         "effect": "deployIfNotExists",
         "details": {
           "type": "Microsoft.HybridCompute/machines/extensions",
           "existenceCondition": {
             "allOf": [
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/type",
                 "equals": "[parameters('extensionName')]"
               },
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/publisher",
                 "equals": "Microsoft.Azure.Migrate"
               },
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/provisioningState",
                 "equals": "Succeeded"
               }
             ]
           },
           "roleDefinitionIds": [
             "/providers/Microsoft.Authorization/roleDefinitions/cd570a14-e51a-42ad-bac8-bafd67325302"
           ],
           "deployment": {
             "properties": {
               "mode": "incremental",
               "template": {
                 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                 "contentVersion": "1.0.0.0",
                 "parameters": {
                   "machineName": {
                     "type": "string"
                   },
                   "location": {
                     "type": "string"
                   },
                   "extensionName": {
                     "type": "string"
                   },
                   "migrateProjects": {
                     "type": "array"
                   }
                 },
                 "resources": [
                   {
                     "type": "Microsoft.HybridCompute/machines/extensions",
                     "name": "[concat(parameters('machineName'), '/', parameters('extensionName'))]",
                     "apiVersion": "2023-06-20-preview",
                     "location": "[parameters('location')]",
                     "properties": {
                       "publisher": "Microsoft.Azure.Migrate",
                       "type": "[parameters('extensionName')]",
                       "autoUpgradeMinorVersion": true,
                       "settings": {
                         "migrateProjects": "[parameters('migrateProjects')]"
                       }
                     }
                   }
                 ]
               },
               "parameters": {
                 "machineName": {
                   "value": "[field('name')]"
                 },
                 "location": {
                   "value": "[field('location')]"
                 },
                 "extensionName": {
                   "value": "[parameters('extensionName')]"
                 },
                 "migrateProjects": {
                   "value": "[parameters('migrateProjects')]"
                 }
               }
             }
           }
         }
       }
     }
   }
   ```

5. Select **Save**.

#### Step 2: Create custom policy for Windows machines

1. In the Azure portal, navigate to **Policy** > **Definitions** > **+ Policy definition**.

2. For **Definition location**, select the same subscription you used for the Linux policy.

3. Provide the following details:
   - **Name**: `Enable Azure Migrate data collection on Arc-enabled Windows machines`
   - **Description**: `Automatically deploy Azure Migrate Collector extension on Arc-enabled Windows machines to enable additional data collection for migration assessments.`
   - **Category**: Select **Use existing** and choose **Migrate** from the dropdown.

4. For **Policy rule**, replace the contents with the following JSON:

   ```json
   {
     "mode": "Indexed",
     "parameters": {
       "extensionName": {
         "type": "String",
         "metadata": {
           "description": "Name of the extension to deploy"
         },
         "defaultValue": "AzureMigrateCollectorForWindows"
       },
       "migrateProjects": {
         "type": "Array",
         "metadata": {
           "description": "List of migrate projects with armId and location"
         }
       }
     },
     "policyRule": {
       "if": {
         "allOf": [
           {
             "field": "type",
             "equals": "Microsoft.HybridCompute/machines"
           },
           {
             "field": "Microsoft.HybridCompute/machines/osType",
             "equals": "Windows"
           }
         ]
       },
       "then": {
         "effect": "deployIfNotExists",
         "details": {
           "type": "Microsoft.HybridCompute/machines/extensions",
           "existenceCondition": {
             "allOf": [
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/type",
                 "equals": "[parameters('extensionName')]"
               },
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/publisher",
                 "equals": "Microsoft.Azure.Migrate"
               },
               {
                 "field": "Microsoft.HybridCompute/machines/extensions/provisioningState",
                 "equals": "Succeeded"
               }
             ]
           },
           "roleDefinitionIds": [
             "/providers/Microsoft.Authorization/roleDefinitions/cd570a14-e51a-42ad-bac8-bafd67325302"
           ],
           "deployment": {
             "properties": {
               "mode": "incremental",
               "template": {
                 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                 "contentVersion": "1.0.0.0",
                 "parameters": {
                   "machineName": {
                     "type": "string"
                   },
                   "location": {
                     "type": "string"
                   },
                   "extensionName": {
                     "type": "string"
                   },
                   "migrateProjects": {
                     "type": "array"
                   }
                 },
                 "resources": [
                   {
                     "type": "Microsoft.HybridCompute/machines/extensions",
                     "name": "[concat(parameters('machineName'), '/', parameters('extensionName'))]",
                     "apiVersion": "2023-06-20-preview",
                     "location": "[parameters('location')]",
                     "properties": {
                       "publisher": "Microsoft.Azure.Migrate",
                       "type": "[parameters('extensionName')]",
                       "autoUpgradeMinorVersion": true,
                       "settings": {
                         "migrateProjects": "[parameters('migrateProjects')]"
                       }
                     }
                   }
                 ]
               },
               "parameters": {
                 "machineName": {
                   "value": "[field('name')]"
                 },
                 "location": {
                   "value": "[field('location')]"
                 },
                 "extensionName": {
                   "value": "[parameters('extensionName')]"
                 },
                 "migrateProjects": {
                   "value": "[parameters('migrateProjects')]"
                 }
               }
             }
           }
         }
       }
     }
   }
   ```

5. Select **Save**.

#### Step 3: Assign the policies

Complete the following steps for both the Linux and Windows policies you created.

1. In the Azure portal, navigate to **Policy** > **Definitions**.

2. In the search bar, search for `Enable Azure Migrate data collection`.

3. Select one of the policies you created (start with either Linux or Windows).

4. Select **Assign policy**.

5. On the **Basics** tab:
   - **Scope**: Select all subscriptions that contain Arc included in your Azure Migrate project scope.
   - **Policy enforcement**: Ensure this is set to **Enabled**.

6. Select **Next**.

7. On the **Parameters** tab:
   - For **migrateProjects**, provide the JSON array with your Azure Migrate project information:
   
     ```json
     [{"id":"/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Migrate/migrateProjects/<project-name>","location":"<project-region>"}]
     ```

8. Select **Next**.

9. On the **Remediation** tab:
   - Select **Create a remediation task** (required to enable data collection on existing Arc-enabled servers).
   - For **Type of Managed Identity**, select **System assigned managed identity**.
   - For **System assigned identity location**, select a region for the managed identity.

10. Select **Next**.

11. (Optional) On the **Non-compliance messages** tab, add a custom message to display when resources are non-compliant.

12. Select **Review + create**.

13. Review the settings and select **Create**.

14. Repeat steps 3-13 for the other policy (Windows if you started with Linux, or vice versa).

#### Step 4: Monitor policy compliance

1. In the Azure portal, navigate to **Policy** > **Compliance**.

2. Find your policy assignments in the list.

3. Monitor the **Compliance state** to see how many Arc-enabled servers have additional data collection enabled.

4. If servers show as **Non-compliant**, check the **Remediation** tasks to see progress or any errors.

> [!NOTE]
> Policy evaluation and remediation can take up to 30 minutes after assignment. The extension installation itself takes several minutes per server.

## Verify data collection status

After enabling additional data collection, verify that it's working correctly:

1. In the Azure portal, navigate to your Arc-enabled server.

2. Under **Settings**, select **Extensions**.

3. Locate **AzureMigrateCollectorForWindows** or **AzureMigrateCollectorForLinux** in the list.

4. Verify that the **Status** shows **Succeeded**.

5. Wait 15-30 minutes for the extension to begin collecting and transmitting data.

6. Navigate to your Azure Migrate project and create or refresh an assessment to see enhanced recommendations based on collected data.

## View enhanced assessment data

After you enable additional data collection and sufficient performance data is collected:

1. Navigate to your Azure Migrate project.

2. Select **Assessments** to view existing assessments or create a new one.

3. In the assessment settings, ensure **Sizing criteria** is set to **Performance-based** to leverage the collected performance data.

4. Review the assessment report to see:
   - Right-sized Azure VM recommendations based on actual utilization
   - More accurate cost estimates
   - Utilization patterns and trends
   - Cost optimization opportunities

## Disable additional data collection

To stop collecting additional data from specific servers:

1. Navigate to the Arc-enabled server in the Azure portal.

2. Under **Settings**, select **Extensions**.

3. Select the **AzureMigrateCollectorForWindows** or **AzureMigrateCollectorForLinux** extension.

4. Select **Uninstall**.

> [!NOTE]
> Previously collected data remains in your Azure Migrate project and continues to be used for assessments until you sync new data or remove the servers from the project.

## Next steps

- [Manage sync of Arc resources to Azure Migrate project](how-to-manage-arc-resource-sync.md)
- [Create performance-based assessments](how-to-create-assessment.md)
- [View business case reports](how-to-view-a-business-case.md)
- [Azure Migrate Collector extension reference](migrate-virtual-machine-extension-reference.md)