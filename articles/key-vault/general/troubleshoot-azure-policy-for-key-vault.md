---
title: Troubleshoot issues with implementing Azure policy on Key Vault
description: Troubleshooting issues with implementing Azure policy on Key Vault
author: sebansal
ms.author: sebansal
ms.date: 01/17/2023
ms.service: key-vault
ms.subservice: general
ms.topic: how-to

---
# Troubleshoot issues with implementing Azure policy on Key Vault

This article guides you how to troubleshoot general errors that might occur when you set up the [Azure Policy for Key Vault](./azure-policy.md), and suggests ways to resolve them.

## About Azure policy for Key Vault

[Azure Policy](../../governance/policy/index.yml) is a governance tool that gives users the ability to audit and manage their Azure environment at scale. Azure Policy allows you to place guardrails on Azure resources to ensure they're compliant with assigned policy rules. It allows users to perform audit, real-time enforcement, and remediation of their Azure environment. The results of audits performed by policy will be available to users in a compliance dashboard where they will be able to see a drill-down of which resources and components are compliant and which are not.

### Logging

In order to monitor how policy evaluations are conducted, you can review the Key Vault logs. Enabling logging for Azure Key Vault, which saves information in an Azure storage account that you provide. For step by step guidance, see [How to enable Key Vault logging](howto-logging.md).

When you enable logging, a new container called **AzurePolicyEvaluationDetails** will be automatically created to collect policy related logging information in your specified storage account.

> [!NOTE]
> You should strictly regulate access to monitoring data, particularly log files, as they can contain sensitive information. Learn about applying [built-in monitoring Azure role](../../azure-monitor/roles-permissions-security.md) and limiting access.

Individual blobs are stored as text, formatted as a JSON blob.

Let's look at an example log entry for a Key policy: [Keys should have expiration date set](azure-policy.md). This policy evaluates all keys in your key vaults and flags keys that do not have an expiration date set as non-compliant.

```json
{
  "ObjectName": "example",
  "ObjectType": "Key",
  "IsComplianceCheck": false,
  "EvaluationDetails": [
    {
      "AssignmentId": "<subscription ID>",
      "AssignmentDisplayName": "[Preview]: Key Vault keys should have an expiration date",
      "DefinitionId": "<definition ID>",
      "DefinitionDisplayName": "[Preview]: Key Vault keys should have an expiration date",
      "Outcome": "NonCompliant",
      "ExpressionEvaluationDetails": [
        {
          "Result": "True",
          "Expression": "type",
          "ExpressionKind": "Field",
          "ExpressionValue": "Microsoft.KeyVault.Data/vaults/keys",
          "TargetValue": "Microsoft.KeyVault.Data/vaults/keys",
          "Operator": "Equals"
        },
        {
          "Result": "True",
          "Expression": "Microsoft.KeyVault.Data/vaults/keys/attributes.expiresOn",
          "ExpressionKind": "Field",
          "ExpressionValue": "******",
          "TargetValue": "False",
          "Operator": "Exists"
        }
      ]
    }
  ]
}
```

The following table lists the field names and descriptions:

| Field name | Description |
| --- | --- |
| **ObjectName** |Name of the object |
| **ObjectType** |Type of key vault object: certificate, secret or key |
| **IsComplianceCheck** |True if evaluation occurred during nightly audit, false if evaluation occurred during resource creation or update |
| **AssignmentId** | The ID of the policy assignment |
| **AssignmentDisplayName** | Friendly name of the policy assignment |
| **DefinitionId** | ID of the policy definition for the assignment |
| **DefinitionDisplayName** | Friendly name of the policy definition for the assignment |
| **Outcome** | Outcome of the policy evaluation |
| **ExpressionEvaluationDetails** | Details about the evaluations performed during policy evaluation |
| **ExpressionValue** | Actual value of the specified field during policy evaluation |
| **TargetValue** | Expected value of the specified field |


### Frequently asked questions

#### Key Vault recovery blocked by Azure policy

One of the reasons could be that your subscription (or management group) has a policy that is blocking the recovery. The fix is to adjust the policy so that it doesn't apply when a vault is being recovered.

If you see the error type ```RequestDisallowedByPolicy``` for recovery due to **built-in** policy, ensure that you're using the **most updated version**. 

If you created a **custom policy** with your own logic, here is an example of portion of a policy that can be used to require soft delete. The recovery of a soft deleted vault uses the same API as creating or updating a vault. However, instead of specifying the properties of the vault, it has a single "createMode" property with the value "recover". The vault will be restored with whatever properties it had when it was deleted. Policies that block requests unless they have specific properties configured will also block the recovery of soft deleted vaults. The fix is to include a clause that will cause the policy to ignore requests where "createMode" is "recover":

You'll see that it has a clause that causes the policy to only apply when "createMode" is not equal to "recover":

```

    "policyRule": { 
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.KeyVault/vaults"
          }, 
          {
            "not": {
              "field": "Microsoft.Keyvault/vaults/createMode",
              "equals": "recover"
            }
          },
          {
            "anyOf": [
              {
                "field": "Microsoft.KeyVault/vaults/enableSoftDelete",
                "exists": "false"
              },
              {
                "field": "Microsoft.KeyVault/vaults/enableSoftDelete",
                "equals": "false"
              }
            ]
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]"
      }
    }
```

#### Latency on Azure policy assignment delete on Key Vault 

Microsoft.KeyVault.Data: a deleted policy assignment can take up to 24 hours to stop being enforced. 

Mitigation: update the policy assignment's effect to 'Disabled'.

#### Secret creation via ARM template missing out policy evaluation

Data plane policies that evaluate secret creation wouldn't be applicable on [secrets created via ARM template](../secrets/quick-create-template.md?tabs=CLI) at the time of secret creation. After 24 hours, when the automated compliance check would occur, and the compliance results can be reviewed.

## Next steps

* Learn how to [Troubleshoot errors with using Azure Policy](../../governance/policy/troubleshoot/general.md)
* Learn about [Azure Policy known issues](https://github.com/azure/azure-policy#known-issues)
