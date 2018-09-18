---
title: Azure Policy sample - Require encryption for Data Lake Store
description: This sample policy requires encryption for Data Lake Store.
services: azure-policy
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 09/18/2018
ms.author: dacoulte
ms.custom: mvc
---
# Require Data Lake Store encryption

This built-in policy denies any Data Lake Store accounts that don't have encryption enabled.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample template

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.DataLakeStore/accounts"
      },
      {
        "field": "Microsoft.DataLakeStore/accounts/encryptionState",
        "equals": "Disabled"
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

You can deploy this template using the [Azure portal](#deploy-with-the-portal), with [PowerShell](#deploy-with-powershell) or with the [Azure CLI](#deploy-with-azure-cli). To get the built-in policy, use the ID `a7ff3161-0087-490a-9ad9-ad6217f4f43a`.

## Deploy with the portal

When assigning a policy, select **Enforce encryption on DataLakeStore accounts** from the available built-in definitions.

## Deploy with PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh.md)]

```azurepowershell-interactive
$definition = Get-AzureRmPolicyDefinition -Id /providers/Microsoft.Authorization/policyDefinitions/a7ff3161-0087-490a-9ad9-ad6217f4f43a

New-AzureRmPolicyAssignment -name "Data Lake Store encryption" -PolicyDefinition $definition -Scope <scope>
```

### Clean up PowerShell deployment

Run the following command to remove the policy assignment.

```azurepowershell-interactive
Remove-AzureRmPolicyAssignment -Name "Data Lake Store encryption" -Scope <scope>
```

## Deploy with Azure CLI

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

```azurecli-interactive
az policy assignment create --scope <scope> --name "Data Lake Store encryption" --policy a7ff3161-0087-490a-9ad9-ad6217f4f43a
```

### Clean up Azure CLI deployment

Run the following command to remove the policy assignment.

```azurecli-interactive
az policy assignment delete --name "Data Lake Store encryption" --resource-group myResourceGroup
```

## Next steps

- Review more samples at [Azure Policy samples](index.md)