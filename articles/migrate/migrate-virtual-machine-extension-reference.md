---
title: Azure Migrate Collector virtual machine extension reference
description: Technical reference for the Azure Migrate Collector VM extension including settings schema, endpoints, and configuration options.
author: snehithm
ms.author: snmuvva
ms.service: azure-migrate
ms.topic: reference
ms.date: 10/23/2025
ms.custom: engagement-fy25
monikerRange: migrate
---

# Azure Migrate Collector virtual machine extension reference

This article provides technical reference information for the Azure Migrate Collector Virtual Machine (VM) extension used with Arc-enabled servers.

## Overview

The Azure Migrate Collector VM extension is an optional component that collects additional data from Arc-enabled servers to enhance Azure Migrate assessments and business case recommendations. The extension is available for both Windows and Linux operating systems.

## Extension properties

### Windows extension

| Property | Value |
|----------|-------|
| **Publisher** | Microsoft.Azure.Migrate |
| **Type** | AzureMigrateCollectorForWindows |
| **Supported OS** | All Windows operating systems supported by Arc-enabled Servers |

### Linux extension

| Property | Value |
|----------|-------|
| **Publisher** | Microsoft.Azure.Migrate |
| **Type** | AzureMigrateCollectorForLinux |
| **Supported OS** | All Linux operating systems supported by Arc-enabled Servers |

## Extension settings schema

The extension requires configuration through the `settings` parameter:

```json
{
  "migrateProjects": [
    {
      "id": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Migrate/migrateProjects/{project-name}",
      "location": "{project-region}"
    }
  ]
}
```

### Settings parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `migrateProjects` | Array | Yes | Array of Azure Migrate project configurations |
| `migrateProjects[].id` | String | Yes | Full Azure Resource Manager ID of the Azure Migrate project |
| `migrateProjects[].location` | String | Yes | Azure region where the Azure Migrate project is located |

### Example configuration

**Single project:**

```json
{
  "migrateProjects": [
    {
      "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MigrateRG/providers/Microsoft.Migrate/migrateProjects/MyMigrateProject",
      "location": "eastus"
    }
  ]
}
```

**Multiple projects:**

```json
{
  "migrateProjects": [
    {
      "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/MigrateRG/providers/Microsoft.Migrate/migrateProjects/Project1",
      "location": "eastus"
    },
    {
      "id": "/subscriptions/bbbb1b1b-cc2c-dd3d-ee4e-ffffff5f5f5f/resourceGroups/MigrateRG2/providers/Microsoft.Migrate/migrateProjects/Project2",
      "location": "westeurope"
    }
  ]
}
```

## Azure Migrate endpoint

The Azure Migrate Collector VM extension communicates with Azure Migrate services using Azure Migrate endpoints. Ensure the following URL is accessible from your Arc-enabled servers. 

```
https://*.migration.windowsazure.com
```

### Network requirements

- **Protocol**: HTTPS (Transport Layer Security (TLS) 1.2 or higher)
- **Port**: 443
- **Direction**: Outbound from Arc-enabled server
- **Proxy support**: Honors Arc-enabled server proxy configuration

## Installation using Azure CLI

### Windows servers

```azurecli
az connectedmachine extension create \
  --resource-group "{resource-group}" \
  --machine-name "{machine-name}" \
  --location "{location}" \
  --name "AzureMigrateCollectorForWindows" \
  --publisher "Microsoft.Azure.Migrate" \
  --type "AzureMigrateCollectorForWindows" \
  --settings '{"migrateProjects":[{"id":"/subscriptions/{subscription-id}/resourceGroups/{migrate-rg}/providers/Microsoft.Migrate/migrateProjects/{project-name}","location":"{project-region}"}]}'
```

### Linux servers

```azurecli
az connectedmachine extension create \
  --resource-group "{resource-group}" \
  --machine-name "{machine-name}" \
  --location "{location}" \
  --name "AzureMigrateCollectorForLinux" \
  --publisher "Microsoft.Azure.Migrate" \
  --type "AzureMigrateCollectorForLinux" \
  --settings '{"migrateProjects":[{"id":"/subscriptions/{subscription-id}/resourceGroups/{migrate-rg}/providers/Microsoft.Migrate/migrateProjects/{project-name}","location":"{project-region}"}]}'
```

## Installation using Azure PowerShell

### Windows servers

```azurepowershell
New-AzConnectedMachineExtension `
  -ResourceGroupName "{resource-group}" `
  -MachineName "{machine-name}" `
  -Location "{location}" `
  -Name "AzureMigrateCollectorForWindows" `
  -Publisher "Microsoft.Azure.Migrate" `
  -ExtensionType "AzureMigrateCollectorForWindows" `
  -Settings @{"migrateProjects" = @(@{"id"="/subscriptions/{subscription-id}/resourceGroups/{migrate-rg}/providers/Microsoft.Migrate/migrateProjects/{project-name}";"location"="{project-region}"})}
```

### Linux servers

```azurepowershell
New-AzConnectedMachineExtension `
  -ResourceGroupName "{resource-group}" `
  -MachineName "{machine-name}" `
  -Location "{location}" `
  -Name "AzureMigrateCollectorForLinux" `
  -Publisher "Microsoft.Azure.Migrate" `
  -ExtensionType "AzureMigrateCollectorForLinux" `
  -Settings @{"migrateProjects" = @(@{"id"="/subscriptions/{subscription-id}/resourceGroups/{migrate-rg}/providers/Microsoft.Migrate/migrateProjects/{project-name}";"location"="{project-region}"})}
```

## Required permissions

### To install the extension

- **Hybrid Server Resource Administrator** role on the Arc-enabled server resource

### For the extension to function

The extension uses the Arc-enabled server's managed identity to authenticate with Azure Migrate. No other permissions are required on the Azure Migrate project; the project automatically accepts data from Arc-enabled servers within its configured scope.

## Extension status and health

### View extension status

**Azure portal:**
1. Navigate to the Arc-enabled server
2. Select **Extensions** under **Settings**
3. Check the status of the Azure Migrate Collector extension

**Azure CLI:**

```azurecli
az connectedmachine extension show \
  --resource-group "{resource-group}" \
  --machine-name "{machine-name}" \
  --name "AzureMigrateCollectorForWindows"
```

### Status values

| Status | Description |
|--------|-------------|
| Succeeded | Extension installed and running successfully |
| Failed | Extension installation or operation failed |
| Creating | Extension installation in progress |
| Updating | Extension update in progress |
| Deleting | Extension removal in progress |

## Troubleshooting

### Check extension logs

**Windows:**
- Extension logs: `C:\ProgramData\GuestConfig\extension_logs\Microsoft.Azure.Migrate.AzureMigrateCollectorForWindows\`
- Agent logs: `C:\ProgramData\AzureConnectedMachineAgent\Log\`

**Linux:**
- Extension logs: `/var/lib/GuestConfig/extension_logs/Microsoft.Azure.Migrate.AzureMigrateCollectorForLinux/`
- Agent logs: `/var/opt/azcmagent/log/`

### Common issues

| Issue | Possible cause | Resolution |
|-------|----------------|------------|
| Extension installation fails | Insufficient permissions | Verify you have **Hybrid Server Resource Administrator** role |
| Extension shows Failed status | Network connectivity issue | Verify connectivity to regional endpoint |
| Extension installed but data not appearing in project | Project configuration incorrect | Verify project ID and region in extension settings |

## Update and removal

### Update extension

The extension support [automatic upgrades](/azure/azure-arc/servers/manage-automatic-vm-extension-upgrade) to the latest minor version. To manually trigger an update:

```azurecli
az connectedmachine extension update \
  --resource-group "{resource-group}" \
  --machine-name "{machine-name}" \
  --name "AzureMigrateCollectorForWindows"
```

### Remove extension

```azurecli
az connectedmachine extension delete \
  --resource-group "{resource-group}" \
  --machine-name "{machine-name}" \
  --name "AzureMigrateCollectorForWindows"
```


## Next steps

- [Enable additional data collection for Arc-enabled servers](how-to-enable-additional-data-collection-for-arc-servers.md)
- [Create a migrate project for Arc resources](quickstart-evaluate-readiness-savings-for-arc-resources.md)
- [Manage sync of Arc resources to Azure Migrate project](how-to-manage-arc-resource-sync.md)
- [Create assessments](how-to-create-assessment.md)