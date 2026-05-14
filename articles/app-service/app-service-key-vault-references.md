---
title: Use Key Vault References as App Settings
description: Learn how to set up Azure App Service and Azure Functions to use Azure Key Vault references. Make Key Vault secrets available to your application code.
author: cephalin
ms.topic: how-to
ms.date: 04/09/2026
ms.author: cephalin
ms.service: azure-app-service
ms.custom:
  - AppServiceConnectivity
  - sfi-ropc-nochange
---

# Use Key Vault references as app settings in Azure App Service, Azure Functions, and Azure Logic Apps (Standard)

This article explains how to use secrets stored in Azure Key Vault as values for:

- App settings
- Connection strings

This applies to:

- Azure App Service
- Azure Functions
- Azure Logic Apps (Standard)

Azure Key Vault provides centralized secret management with:

- Access control
- Auditing
- Secure storage

Applications can consume Key Vault references exactly like normal environment variables without requiring code changes.

---

# Grant your app access to a key vault

To read secrets from Key Vault:

1. Create a Key Vault
2. Create a managed identity
3. Grant the identity access to secrets

## Step 1: Create a Key Vault

Follow the Azure Key Vault quickstart.

---

## Step 2: Create a managed identity

Enable either:

- System-assigned managed identity
- User-assigned managed identity

Key Vault references use the system-assigned identity by default.

---

## Step 3: Grant secret access

Depending on the permission model:

### Azure RBAC

Assign:

- **Key Vault Secrets User**

to the managed identity.

### Access Policy model

Grant:

- `Get` permission for secrets

---

# Access network-restricted vaults

If your vault uses network restrictions:

- Ensure your app has outbound virtual network connectivity
- Allow the app subnet in the vault firewall

Do not rely on public outbound IP addresses.

---

## Enable virtual network routing

### Azure CLI

```bash
az webapp config set \
  --resource-group <group-name> \
  --subscription <subscription> \
  --name <app-name> \
  --generic-configurations '{"vnetRouteAllEnabled": true}'
```

### Azure PowerShell

```powershell
Update-AzFunctionAppSetting `
  -Name <app-name> `
  -ResourceGroupName <group-name> `
  -AppSetting @{vnetRouteAllEnabled = $true}
```

---

# Access vaults with a user-assigned identity

Some scenarios require Key Vault access during app creation.

In these cases:

1. Create a user-assigned identity
2. Grant Key Vault access
3. Attach identity to the app

---

## Configure Key Vault reference identity

### Azure CLI

```bash
identityResourceId=$(az identity show \
  --resource-group <group-name> \
  --name <identity-name> \
  --query id -o tsv)

az webapp update \
  --resource-group <group-name> \
  --name <app-name> \
  --set keyVaultReferenceIdentity=${identityResourceId}
```

---

### Azure PowerShell

```powershell
$identityResourceId = Get-AzUserAssignedIdentity `
  -ResourceGroupName <group-name> `
  -Name <identity-name> | Select-Object -ExpandProperty Id

$appResourceId = Get-AzFunctionApp `
  -ResourceGroupName <group-name> `
  -Name <app-name> | Select-Object -ExpandProperty Id

$Path = "{0}?api-version=2021-01-01" -f $appResourceId

Invoke-AzRestMethod `
  -Method PATCH `
  -Path $Path `
  -Payload "{'properties':{'keyVaultReferenceIdentity':'$identityResourceId'}}"
```

> [!TIP]
> To switch back to the system-assigned identity, set:
>
> ```text
> SystemAssigned
> ```

---

# Understand rotation

If the secret version isn't specified:

- The app automatically uses the latest secret version

App Service caches Key Vault references for up to:

- 24 hours

A configuration change triggers immediate refresh.

---

## Force refresh manually

Send an authenticated POST request:

```text
https://management.azure.com/[Resource ID]/config/configreferences/appsettings/refresh?api-version=2022-03-01
```

---

# Use Key Vault references in app settings

Use the following syntax:

```text
@Microsoft.KeyVault({referenceString})
```

---

## Supported formats

### Secret URI format

```text
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)
```

Optional version:

```text
@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret/<version>)
```

---

### Vault name format

```text
@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret)
```

Optional version:

```text
@Microsoft.KeyVault(VaultName=myvault;SecretName=mysecret;SecretVersion=<version>)
```

---

# Considerations for Azure Files mounting

When using:

```text
WEBSITE_CONTENTAZUREFILECONNECTIONSTRING
```

with Key Vault references, validation may fail.

To bypass validation:

```text
WEBSITE_SKIP_CONTENTSHARE_VALIDATION=1
```

> [!CAUTION]
> If the content share or connection string is invalid, the application can fail with HTTP 500 errors.

---

# Considerations for Application Insights

Application Insights commonly uses:

- `APPINSIGHTS_INSTRUMENTATIONKEY`
- `APPLICATIONINSIGHTS_CONNECTION_STRING`

If stored in Key Vault:

- Azure portal telemetry integration won't function automatically

Since these values are not considered secrets, direct configuration is usually acceptable.

---

# Azure Resource Manager deployment

When using ARM templates:

- Create the app first
- Then configure app settings separately

This ensures:

- Managed identity exists
- Key Vault access policies can reference the identity

---

## Example ARM template structure

```json
{
  "type": "Microsoft.Web/sites",
  "name": "[variables('functionAppName')]",
  "identity": {
    "type": "SystemAssigned"
  }
}
```

---

## Example Key Vault reference in app settings

```json
"AzureWebJobsStorage":
"[concat('@Microsoft.KeyVault(SecretUri=', reference(variables('storageConnectionStringName')).secretUriWithVersion, ')')]"
```

---

## WEBSITE_ENABLE_SYNC_UPDATE_SITE

Use:

```json
"WEBSITE_ENABLE_SYNC_UPDATE_SITE": "true"
```

This makes application settings updates synchronous.

---

# Troubleshoot Key Vault references

If a reference cannot be resolved:

- The literal reference string is returned
- Example:

```text
@Microsoft.KeyVault(...)
```

This usually indicates:

- Incorrect permissions
- Missing secret
- Invalid syntax

---

# Diagnose issues in Azure portal

## App Service

1. Open the app
2. Select **Diagnose and solve problems**
3. Go to:
   - **Availability and Performance**
   - **Web app down**
4. Search:
   - **Key Vault Application Settings Diagnostics**

---

## Azure Functions

1. Open the function app
2. Select **Diagnose and solve problems**
3. Go to:
   - **Availability and Performance**
   - **Function app down or reporting errors**
4. Select:
   - **Key Vault Application Settings Diagnostics**

---

# Best practices

- Use separate vaults per environment
- Mark Key Vault-based settings as slot settings
- Prefer managed identities over secrets
- Avoid hardcoding credentials
- Use private networking for production vaults
- Enable secret rotation
- Monitor Key Vault audit logs

---

# Summary

Azure Key Vault references provide:

- Secure secret management
- Centralized credential storage
- Automatic secret rotation
- Managed identity integration
- No application code changes

They are recommended for:

- Production workloads
- Multi-environment deployments
- Enterprise security compliance
- Secret rotation automation
