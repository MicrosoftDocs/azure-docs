---
title: Create portal forms for template spec
description: Learn how to create forms that are displayed in the Azure portal forms. Use the form to deploying a template spec
ms.topic: tutorial
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 03/20/2024
---

# Tutorial: Create Azure portal forms for a template spec

You can create a form that appears in the Azure portal to assist users in deploying a [template spec](template-specs.md). The form allows users to enter values that are passed as parameters to the template spec.

When you create the template spec, you package the form and Azure Resource Manager template (ARM template) together. Deploying the template spec through the portal automatically launches the form.

The following screenshot shows a form opened in the Azure portal.

:::image type="content" source="./media/template-specs-create-portal-forms/view-portal.png" alt-text="Screenshot of Azure portal form for providing values to a template spec.":::

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

For Azure PowerShell, use [version 6.0.0 or later](/powershell/azure/install-azure-powershell). For Azure CLI, use [version 2.24.0 or later](/cli/azure/install-azure-cli).

## Create template

To show the different portal elements that are available in a form, you'll use an ARM template with several parameters. The following template creates a key vault, configures permissions to key vault for a user, and adds a secret.

Copy this file and save it locally. This tutorial assumes you've named it **keyvault.json** but you can give it any name.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "keyVaultName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the key vault."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specifies the Azure location where the key vault should be created."
      }
    },
    "enabledForDeployment": {
      "type": "bool",
      "defaultValue": false,
      "allowedValues": [
        true,
        false
      ],
      "metadata": {
        "description": "Specifies whether Azure Virtual Machines are permitted to retrieve certificates stored as secrets from the key vault."
      }
    },
    "enabledForDiskEncryption": {
      "type": "bool",
      "defaultValue": false,
      "allowedValues": [
        true,
        false
      ],
      "metadata": {
        "description": "Specifies whether Azure Disk Encryption is permitted to retrieve secrets from the vault and unwrap keys."
      }
    },
    "enabledForTemplateDeployment": {
      "type": "bool",
      "defaultValue": false,
      "allowedValues": [
        true,
        false
      ],
      "metadata": {
        "description": "Specifies whether Azure Resource Manager is permitted to retrieve secrets from the key vault."
      }
    },
    "tenantId": {
      "type": "string",
      "defaultValue": "[subscription().tenantId]",
      "metadata": {
        "description": "Specifies the Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. Get it by using Get-AzSubscription cmdlet."
      }
    },
    "objectId": {
      "type": "string",
      "metadata": {
        "description": "Specifies the object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets."
      }
    },
    "keysPermissions": {
      "type": "array",
      "defaultValue": [
        "list"
      ],
      "metadata": {
        "description": "Specifies the permissions to keys in the vault. Valid values are: all, encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, backup, restore, recover, and purge."
      }
    },
    "secretsPermissions": {
      "type": "array",
      "defaultValue": [
        "list"
      ],
      "metadata": {
        "description": "Specifies the permissions to secrets in the vault. Valid values are: all, get, list, set, delete, backup, restore, recover, and purge."
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "standard",
      "allowedValues": [
        "standard",
        "premium"
      ],
      "metadata": {
        "description": "Specifies whether the key vault is a standard vault or a premium vault."
      }
    },
    "secretName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the secret that you want to create."
      }
    },
    "secretValue": {
      "type": "secureString",
      "metadata": {
        "description": "Specifies the value of the secret that you want to create."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2022-07-01",
      "name": "[parameters('keyVaultName')]",
      "location": "[parameters('location')]",
      "properties": {
        "enabledForDeployment": "[parameters('enabledForDeployment')]",
        "enabledForDiskEncryption": "[parameters('enabledForDiskEncryption')]",
        "enabledForTemplateDeployment": "[parameters('enabledForTemplateDeployment')]",
        "tenantId": "[parameters('tenantId')]",
        "accessPolicies": [
          {
            "objectId": "[parameters('objectId')]",
            "tenantId": "[parameters('tenantId')]",
            "permissions": {
              "keys": "[parameters('keysPermissions')]",
              "secrets": "[parameters('secretsPermissions')]"
            }
          }
        ],
        "sku": {
          "name": "[parameters('skuName')]",
          "family": "A"
        },
        "networkAcls": {
          "defaultAction": "Allow",
          "bypass": "AzureServices"
        }
      }
    },
    {
      "type": "Microsoft.KeyVault/vaults/secrets",
      "apiVersion": "2022-07-01",
      "name": "[format('{0}/{1}', parameters('keyVaultName'), parameters('secretName'))]",
      "dependsOn": [
        "[resourceId('Microsoft.KeyVault/vaults', parameters('keyVaultName'))]"
      ],
      "properties": {
        "value": "[parameters('secretValue')]"
      }
    }
  ]
}
```

## Create default form

The Azure portal provides a sandbox for creating and previewing forms. This sandbox can render a form from an existing ARM template. You'll use this default form to get started with creating a form for your template spec. For more information about the form structure, see [FormViewType](https://github.com/Azure/portaldocs/blob/main/portal-sdk/generated/dx-view-formViewType.md).

1. Open the [Form view sandbox](https://aka.ms/form/sandbox).

    :::image type="content" source="./media/template-specs-create-portal-forms/deploy-template-spec-config.png" alt-text="Screenshot of Azure portal form view sandbox interface.":::

1. In **Package Type**, select **CustomTemplate**. Make sure you select the package type before specify deployment template.
1. In **Deployment template (optional)**, select the key vault template you saved locally. When prompted if you want to overwrite current changes, select **Yes**. The autogenerated form is displayed in the code window. The form is editable from the portal. To customize the form, see [customize form](#customize-form).
    If you look closely into the autogenerated form, the default title is called **Test Form View**, and there's only one step called **basics** defined.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json",
      "view": {
        "kind": "Form",
        "properties": {
          "title": "Test Form View",
          "steps": [
            {
              "name": "basics",
              "label": "Basics",
              "elements": [
                ...
              ]
            }
          ]
        },
        "outputs": {
          ...
        }
      }
    }
    ```

1. To see that works it without any modifications, select **Preview**.

    :::image type="content" source="./media/template-specs-create-portal-forms/view-portal-basic.png" alt-text="Screenshot of the generated basic Azure portal form.":::

    The sandbox displays the form. It has fields for selecting a subscription, resource group, and region. It also fields for all of the parameters from the template.

    Most of the fields are text boxes, but some fields are specific for the type of parameter. When your template includes allowed values for a parameter, the autogenerated form uses a drop-down element. The drop-down element is pre-populated with the allowed values.

    In between the title and **Project details**, there are no tabs because the default form only has one step defined.  In the **Customize form** section, you'll break the parameters into multiple tabs.

    > [!WARNING]
    > Don't select **Create** as it will launch a real deployment. You'll have a chance to deploy the template spec later in this tutorial.

1. To exit from the preview, select **Cancel**.

## Customize form

The default form is a good starting point for understanding forms but usually you'll want to customize it. You can edit it in the sandbox or in Visual Studio Code. The preview option is only available in the sandbox.

1. Give the form a **title** that describes its use.

    ::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform.json" range="1-6" highlight="6" :::

1. Your default form had all of the fields for your template combined into one step called **Basics**. To help users to understand the values they're providing, divide the form into steps. Each step contains fields related to a logical part of the solution to deploy.

    Find the step labeled **Basics**. You'll keep this step but add steps below it. The new steps will focus on configuring the key vault, setting user permissions, and specifying the secret. Make sure you add a comma after the basics step.

    ::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/steps.json" highlight="15-32" :::

    > [!IMPORTANT]
    > Properties in the form are case-sensitive. Make sure you use the casing shown in the examples.

1. Select **Preview**. You'll see the steps, but most of them don't have any elements.

    :::image type="content" source="./media/template-specs-create-portal-forms/view-steps.png" alt-text="Screenshot of Azure portal form with multiple steps.":::

1. Now, move elements to the appropriate steps. Start with the elements labeled **Secret Name** and **Secret Value**. Remove these elements from the **Basics** step and add them to the **Secret** step.

    ```json
    {
      "name": "secret",
      "label": "Secret",
      "elements": [
      {
          "name": "secretName",
          "type": "Microsoft.Common.TextBox",
          "label": "Secret Name",
          "defaultValue": "",
          "toolTip": "Specifies the name of the secret that you want to create.",
          "constraints": {
            "required": true,
            "regex": "",
            "validationMessage": ""
          },
          "visible": true
        },
        {
          "name": "secretValue",
          "type": "Microsoft.Common.PasswordBox",
          "label": {
            "password": "Secret Value",
            "confirmPassword": "Confirm password"
          },
          "toolTip": "Specifies the value of the secret that you want to create.",
          "constraints": {
            "required": true,
            "regex": "",
            "validationMessage": ""
          },
          "options": {
            "hideConfirmation": true
          },
          "visible": true
        }
      ]
    }
    ```

1. When you move elements, you need to fix the `outputs` section. Currently, the outputs section references those elements as if they were still in the basics step. Fix the syntax so it references the elements in the `secret` step.

    ```json
    "outputs": {
      "parameters": {
        ...
        "secretName": "[steps('secret').secretName]",
        "secretValue": "[steps('secret').secretValue]"
      }
    ```

1. Continue moving elements to the appropriate steps. Rather than go through each one, take a look at the updated form.

    ::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform.json" :::

1. Save this file locally with the name **keyvaultform.json**.

## Create template spec

When you create the template spec, provide both files.

For PowerShell, use [New-AzTemplateSpec](/powershell/module/az.resources/new-aztemplatespec) and provide the form in the `-UIFormDefinitionFile` parameter.

```azurepowershell
New-AzTemplateSpec `
  -name keyvaultspec `
  -version 1 `
  -ResourceGroupName templateSpecRG `
  -location westus2 `
  -templatefile keyvault.json `
  -UIFormDefinitionFile keyvaultform.json
```

For Azure CLI, use [az ts create](/cli/azure/ts#az-ts-create) and provide the form in the `--ui-form-definition` parameter.

```azurecli
az ts create \
  --name keyvaultspec \
  --version 1 \
  --resource-group templatespecRG \
  --location westus2 \
  --template-file keyvault.json \
  --ui-form-definition keyvaultform.json
```

## Deploy through portal

To test the form, go to the portal and navigate to your template spec. Select **Deploy**.

:::image type="content" source="./media/template-specs-create-portal-forms/deploy-template-spec.png" alt-text="Screenshot of Azure template spec overview with deploy option highlighted.":::

You'll see the form you created. Go through the steps and provide values for the fields.

On the **Basics** step, you'll see a field for **Region**. This field is used for the location of the resource group. On the **Key Vault** step, you'll see a field for **Location**. This field is used for the location of the key vault.

On the **Permissions** step, you can provide your own user ID for the object ID. Use the default value (`["list"]`) for key and secret permissions. You'll improve that option in the next section.

When you have finished providing values, select **Create** to deploy the template spec.

## Improve the form

In the previous section, you added steps and moved elements, but you didn't change any of the default behaviors. In this section, you'll make changes that improve the experience for users of your template spec.

Previously, the two permissions fields were text boxes. Now, you'll use a drop-down. Set the type to `Microsoft.Common.DropDown`.

Update `keysPermissions`:

::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform2.json" range="169-171" highlight="3" :::

And `secretsPermissions`:

::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform2.json" range="253-255" highlight="3" :::

These fields need to pass an array to the template. A regular drop-down won't work because it only lets you select one value. To select more than one value and pass them as an array, add the `multiselect` field and set to `true`.

::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform2.json" range="169-173" highlight="5" :::

::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform2.json" range="253-257" highlight="5" :::

Finally, you must specify the allowed values for the drop-down and a default value.

::: code language="json" source="~/azure-docs-json-samples/azure-resource-manager/ui-forms/keyvaultform2.json" range="169-304" highlight="6-8,12-81,90-92,96-133" :::

Create a new version of template spec.

With PowerShell:

```azurepowershell
New-AzTemplateSpec `
  -name keyvaultspec `
  -version 2 `
  -ResourceGroupName templateSpecRG `
  -location westus2 `
  -templatefile keyvault.json `
  -UIFormDefinitionFile keyvaultform.json
```

Or Azure CLI:

```azurecli
az ts create \
  --name keyvaultspec \
  --version 2 \
  --resource-group templatespecRG \
  --location westus2 \
  --template-file keyvault.json \
  --ui-form-definition keyvaultform.json
```

Redeploy your template spec with the improved portal form.

:::image type="content" source="./media/template-specs-create-portal-forms/view-portal.png" alt-text="Screenshot of Azure portal form for providing values to a template spec.":::

Notice that your permission fields are now drop-down that allow multiple values.

## Next steps

To learn about deploying a template spec as a linked template, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).
