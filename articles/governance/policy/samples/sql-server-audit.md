---
title: Azure Policy sample - Audit SQL Server audit settings
description: This sample policy audits SQL server audit settings.
services: azure-policy
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: mvc
---
# Audit SQL server audit settings

This built-in policy audits SQL server based on whether the audit settings are enabled.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample template

```json
{
  "if": {
    "field": "type",
    "equals": "Microsoft.SQL/servers"
  },
  "then": {
    "effect": "auditIfNotExists",
    "details": {
      "type": "Microsoft.SQL/servers/auditingSettings",
      "name": "default",
      "existenceCondition": {
        "allOf": [
          {
            "field": "Microsoft.Sql/auditingSettings.state",
            "equals": "[parameters('setting')]"
          }
        ]
      }
    }
  }
}
```

You can deploy this template using the [Azure portal](#deploy-with-the-portal), with [PowerShell](#deploy-with-powershell) or with the [Azure CLI](#deploy-with-azure-cli). To get the built-in policy, use the ID `a6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9`.

## Parameters

To pass in the parameter value, use the following format:

```json
{"setting": {"value":"enabled"}}
```

## Deploy with the portal

When assigning a policy, select **Audit SQL Server Level Audit Setting** from the available built-in definitions.

## Deploy with PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh.md)]

```azurepowershell-interactive
$definition = Get-AzureRmPolicyDefinition -Id /providers/Microsoft.Authorization/policyDefinitions/a6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9

New-AzureRmPolicyAssignment -name "SQL Audit audit" -PolicyDefinition $definition -PolicyParameter '{"setting": {"value":"enabled"}}' -Scope <scope>
```

### Clean up PowerShell deployment

Run the following command to remove the policy assignment.

```azurepowershell-interactive
Remove-AzureRmPolicyAssignment -Name "SQL Audit audit" -Scope <scope>
```

## Deploy with Azure CLI

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

```azurecli-interactive
az policy assignment create --scope <scope> --name "SQL Audit audit" --policy a6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9 --params '{"setting": {"value":"enabled"}}'
```

### Clean up Azure CLI deployment

Run the following command to remove the policy assignment.

```azurecli-interactive
az policy assignment delete --name "SQL Audit audit" --resource-group myResourceGroup
```

## Next steps

- Review more samples at [Azure Policy samples](index.md)