---
title: Create portal forms for template spec
description: Learn how to create forms that are displayed in the Azure portal forms. Use the form to deploying a template spec 
ms.topic: tutorial
ms.date: 10/22/2021 
---

# Tutorial: Create Azure portal forms for a template spec

To help users deploy a [template spec](template-specs.md), you can create a form that is displayed in the Azure portal. The form lets users provide values that are passed to the template spec as parameters.

When you create the template spec, you package the form and Azure Resource Manager template (ARM template) together. Deploying the template spec through the portal automatically launches the form.

:::image type="content" source="./media/template-specs-create-portal-forms/view-portal.png" alt-text="Screenshot of form to provide values for template spec":::

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

For Azure PowerShell, use [version 6.0.0 or later](/powershell/azure/install-az-ps). For Azure CLI, use [version 2.24.0 or later](/cli/azure/install-azure-cli).

## Create template

To show the different portal elements you can create in the form, you'll use an ARM template with several parameters. The following template creates a key vault, configures permissions to key vault for a user, and adds a secret. Copy this file and save it locally. This tutorial assumes you've named it **keyvault.json** but you can give it any name.

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
      "defaultValue": "Standard",
      "allowedValues": [
        "Standard",
        "Premium"
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
      "type": "securestring",
      "metadata": {
        "description": "Specifies the value of the secret that you want to create."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.KeyVault/vaults",
      "apiVersion": "2019-09-01",
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
      "apiVersion": "2019-09-01",
      "name": "[concat(parameters('keyVaultName'), '/', parameters('secretName'))]",
      "location": "[parameters('location')]",
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

The Azure portal provides a sandbox for creating and previewing forms. This sandbox can generate a form from an existing ARM template. You'll use this default form to get started with creating a form for your template spec.

1. Open the [Form view sandbox](https://aka.ms/form/sandbox).

1. Set **Package Type** to **CustomTemplate**.

   :::image type="content" source="./media/template-specs-create-portal-forms/package-type.png" alt-text="Screenshot of setting package type to custom template":::

1. Select the icon to open an existing template.

   :::image type="content" source="./media/template-specs-create-portal-forms/open-template.png" alt-text="Screenshot of icon to open file":::

1. Navigate to the key vault template you saved locally. Select it and select **Open**. When prompted if you want to overwrite current changes, select **Yes**.
1. The autogenerated form is displayed in the code window. To see that works without any modifications, select **Preview**.

   :::image type="content" source="./media/template-specs-create-portal-forms/preview-form.png" alt-text="Screenshot of selecting preview":::

1. The sandox displays the form. It has fields for selecting a subscription, resource group, and region. It also fields for all of the parameters from the template. 

   Most of the fields are text boxes, but some fields are specific for the type of parameter. When your template specifies allowed values for a parameter, the autogenerated form uses a drop-down element with the allowed values as options.

   You could create a template spec with the ARM template and default form, but the next sections will customize the default form.

   > [!WARNING]
   > Don't select **Create** as it will launch a real deployment. You will have a chance to deploy the template spec later in this tutorial.

## Customize form

The default form is a good starting point but you probably want to customize it. You can edit it in the sandbox or in Visual Studio Code. The preview option is only available in the sandbox.

1. Let's set the correct schema. Replace the placeholder text for the schema with:

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
   ```

1. Give the form a **title** that describes its use.

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
     "view": {
       "kind": "Form",
       "properties": {
         "title": "Key Vault and secret",
   ```

1. Your default form had all of the fields for your template combined into one step called **Basics**. To help users understand the values they are providing, divide the form into steps. Each step contains fields related to a logical part of the solution to deploy.

   Find the step labeled **Basics**. You'll keep this step but add steps below it. The new steps will focus on configuring the key vault, setting user permissions, and specifying the secret. Make sure you add a comma after the basics step.

   ```json
   {
     "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
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
           }, // add comma
           // new steps start here
           {
             "name": "keyvault",
             "label": "Key Vault",
             "elements": [
             ]
           },
           {
             "name": "permissions",
             "label": "Permissions",
             "elements": [
             ]
           },
           {
             "name": "secret",
             "label": "Secret",
             "elements": [
             ]
           }
         ]
       },
       "outputs": {
         // keep the same for now
       }
     }
   }
   ```

1. Select **Preview**. You'll see the steps, but most of them don't have any elements.

   :::image type="content" source="./media/template-specs-create-portal-forms/view-steps.png" alt-text="Screenshot of form steps":::

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

When you make this change, you must also fix the `outputs` section. Currently, the outputs section references those elements as if they were still in the basics step. Fix the syntax so it references the elements in the secret step.

```json
"secretName": "[steps('secret').secretName]",
"secretValue": "[steps('secret').secretValue]"
```

 The revised file is:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2021-09-09/uiFormDefinition.schema.json#",
    "view": {
        "kind": "Form",
        "properties": {
            "title": "Test Form View",
            "steps": [
                {
                    "name": "basics",
                    "label": "Basics",
                    "elements": [
                        {
                            "name": "resourceScope",
                            "type": "Microsoft.Common.ResourceScope",
                            "location": {
                                "resourceTypes": [
                                    "microsoft.resources/resourcegroups"
                                ]
                            }
                        },
                        {
                            "name": "location",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Location",
                            "defaultValue": "[[resourceGroup().location]",
                            "toolTip": "Specifies the Azure location where the key vault should be created.",
                            "constraints": {
                                "required": false,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        }
                    ]
                },
				{
                    "name": "keyvault",
                    "label": "Key Vault",
                    "elements": [
						{
                            "name": "keyVaultName",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Key Vault Name",
                            "defaultValue": "",
                            "toolTip": "Specifies the name of the key vault.",
                            "constraints": {
                                "required": true,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        },
						{
                            "name": "skuName",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Sku Name",
                            "defaultValue": "Standard",
                            "toolTip": "Specifies whether the key vault is a standard vault or a premium vault.",
                            "constraints": {
                                "required": false,
                                "allowedValues": [
                                    {
                                        "label": "Standard",
                                        "value": "Standard"
                                    },
                                    {
                                        "label": "Premium",
                                        "value": "Premium"
                                    }
                                ]
                            },
                            "visible": true
                        },
						{
                            "name": "enabledForDeployment",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Enabled For Deployment",
                            "defaultValue": "false",
                            "toolTip": "Specifies whether Azure Virtual Machines are permitted to retrieve certificates stored as secrets from the key vault.",
                            "constraints": {
                                "required": false,
                                "allowedValues": [
                                    {
                                        "label": "true",
                                        "value": true
                                    },
                                    {
                                        "label": "false",
                                        "value": false
                                    }
                                ]
                            },
                            "visible": true
                        },
                        {
                            "name": "enabledForDiskEncryption",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Enabled For Disk Encryption",
                            "defaultValue": "false",
                            "toolTip": "Specifies whether Azure Disk Encryption is permitted to retrieve secrets from the vault and unwrap keys.",
                            "constraints": {
                                "required": false,
                                "allowedValues": [
                                    {
                                        "label": "true",
                                        "value": true
                                    },
                                    {
                                        "label": "false",
                                        "value": false
                                    }
                                ]
                            },
                            "visible": true
                        },
                        {
                            "name": "enabledForTemplateDeployment",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Enabled For Template Deployment",
                            "defaultValue": "false",
                            "toolTip": "Specifies whether Azure Resource Manager is permitted to retrieve secrets from the key vault.",
                            "constraints": {
                                "required": false,
                                "allowedValues": [
                                    {
                                        "label": "true",
                                        "value": true
                                    },
                                    {
                                        "label": "false",
                                        "value": false
                                    }
                                ]
                            },
                            "visible": true
                        }
					]
				},
				{
                    "name": "permissions",
                    "label": "Permissions",
                    "elements": [
						{
                            "name": "tenantId",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Tenant Id",
                            "defaultValue": "[[subscription().tenantId]",
                            "toolTip": "Specifies the Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. Get it by using Get-AzSubscription cmdlet.",
                            "constraints": {
                                "required": false,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        },
                        {
                            "name": "objectId",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Object Id",
                            "defaultValue": "",
                            "toolTip": "Specifies the object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets.",
                            "constraints": {
                                "required": true,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        },
						{
                            "name": "keysPermissions",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Keys Permissions",
                            "defaultValue": "[[\"list\"]",
                            "toolTip": "Specifies the permissions to keys in the vault. Valid values are: all, encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, backup, restore, recover, and purge.",
                            "constraints": {
                                "required": false,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        },
                        {
                            "name": "secretsPermissions",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Secrets Permissions",
                            "defaultValue": "[[\"list\"]",
                            "toolTip": "Specifies the permissions to secrets in the vault. Valid values are: all, get, list, set, delete, backup, restore, recover, and purge.",
                            "constraints": {
                                "required": false,
                                "regex": "",
                                "validationMessage": ""
                            },
                            "visible": true
                        }
					]
				},
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
            ]
        },
        "outputs": {
            "parameters": {
                "keyVaultName": "[steps('keyvault').keyVaultName]",
                "location": "[steps('basics').location]",
                "enabledForDeployment": "[steps('keyvault').enabledForDeployment]",
                "enabledForDiskEncryption": "[steps('keyvault').enabledForDiskEncryption]",
                "enabledForTemplateDeployment": "[steps('keyvault').enabledForTemplateDeployment]",
                "tenantId": "[steps('permissions').tenantId]",
                "objectId": "[steps('permissions').objectId]",
                "keysPermissions": "[steps('permissions').keysPermissions]",
                "secretsPermissions": "[steps('permissions').secretsPermissions]",
                "skuName": "[steps('keyvault').skuName]",
                "secretName": "[steps('secret').secretName]",
                "secretValue": "[steps('secret').secretValue]"
            },
            "kind": "ResourceGroup",
            "location": "[steps('basics').resourceScope.location.name]",
            "resourceGroupId": "[steps('basics').resourceScope.resourceGroup.id]"
        }
    }
}
```

Save this file locally with the name **keyvaultform.json**.

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

For Azure CLI, use [az ts create](/cli/azure/ts#az_ts_create) and provide the form in the `--ui-form-definition` parameter.

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

You've created your template spec with a matching portal form. To test the form, go to the portal and navigate to your template spec. Select **Deploy**.

:::image type="content" source="./media/template-specs-create-portal-forms/deploy-template-spec.png" alt-text="Screenshot of template spec overview with deploy option":::

Go through the steps and provide values for the fields. 

On the **basics** step, you'll see fields for both **Region** and **Location**. The region field is used for the resource group. The location field is used for the key vault. In the next section, you'll fix this issue of having two fields for location.

On the **permissions** step, you can provide your own user ID for the object ID. Use the default value (`["list"]`) for key and secret permissions. You'll improve that option in the next section.

When you have finished providing values, select **Create** to deploy the template spec.

## Improve the form

The previous section noted some fields that aren't ideally configured. In this section, you'll improve the form.

First, let's not ask users to specify two fields for locations. By default, the basics step includes a region field. To avoid duplication, remove the element named `location`. This field was generated from your ARM template but is no longer needed.

Your basics step now only include the `resourceScope` element.

```json
{
    "name": "basics",
    "label": "Basics",
    "elements": [
        {
            "name": "resourceScope",
            "type": "Microsoft.Common.ResourceScope",
            "location": {
                "resourceTypes": [
                    "microsoft.resources/resourcegroups"
                ]
            }
        }
    ]
},
```

The location output value that is passed to your template must be updated to use the region field.

```json
"outputs": {
    "parameters": {
        "keyVaultName": "[steps('keyvault').keyVaultName]",
        "location": "[steps('basics').resourceScope.location.name]",
```

Previously, the two permissions fields were text boxes. Now, you'll use a drop-down, so change the type.

```json
{
    "name": "keysPermissions",
    "type": "Microsoft.Common.DropDown",
    ...
},
{
    "name": "secretsPermissions",
    "type": "Microsoft.Common.DropDown",
```

These fields need to pass an array to the template. A regular drop-down won't work because it only lets you select one value. To select more than one value and pass them as an array, add the `multiselect` field and set to `true`.

```json
{
    "name": "keysPermissions",
    "type": "Microsoft.Common.DropDown",
    "label": "Keys Permissions",
    "multiselect": true,
    ...
},
{
    "name": "secretsPermissions",
    "type": "Microsoft.Common.DropDown",
    "label": "Secrets Permissions",
    "multiselect": true,
```

Finally, you must specify the allowed values for the drop-down and a default value.

```json
{
    "name": "keysPermissions",
    "type": "Microsoft.Common.DropDown",
    "label": "Keys Permissions",
    "multiselect": true,
    "defaultValue":{
        "value": "list"
    },
    "toolTip": "Specifies the permissions to keys in the vault. Valid values are: all, encrypt, decrypt, wrapKey, unwrapKey, sign, verify, get, list, create, update, import, delete, backup, restore, recover, and purge.",
    "constraints": {
        "required": false,
        "allowedValues":[
            {
                "label": "all",
                "value": "all"
            },
            {
                "label": "encrypt",
                "value": "encrypt"
            },
            {
                "label": "decrypt",
                "value": "decrypt"
            },
            {
                "label": "list",
                "value": "list"
            },
            {
                "label": "delete",
                "value": "delete"
            },
            {
                "label": "backup",
                "value": "backup"
            },
            {
                "label": "restore",
                "value": "restore"
            },
            {
                "label": "recover",
                "value": "recover"
            },
            {
                "label": "purge",
                "value": "purge"
            },
            {
                "label": "wrapKey",
                "value": "wrapKey"
            },
            {
                "label": "unwrapKey",
                "value": "unwrapKey"
            },
            {
                "label": "sign",
                "value": "sign"
            },
            {
                "label": "verify",
                "value": "verify"
            },
            {
                "label": "get",
                "value": "get"
            },
            {
                "label": "create",
                "value": "create"
            },
            {
                "label": "update",
                "value": "update"
            },
            {
                "label": "import",
                "value": "import"
            }
        ]
    },
    "visible": true
},
{
    "name": "secretsPermissions",
    "type": "Microsoft.Common.DropDown",
    "label": "Secrets Permissions",
    "multiselect": true,
    "defaultValue":{
        "value": "list"
    },
    "toolTip": "Specifies the permissions to secrets in the vault. Valid values are: all, get, list, set, delete, backup, restore, recover, and purge.",
    "constraints": {
        "required": false,
        "allowedValues":[
            {
                "label": "all",
                "value": "all"
            },
            {
                "label": "get",
                "value": "get"
            },
            {
                "label": "list",
                "value": "list"
            },
            {
                "label": "set",
                "value": "set"
            },
            {
                "label": "delete",
                "value": "delete"
            },
            {
                "label": "backup",
                "value": "backup"
            },
            {
                "label": "restore",
                "value": "restore"
            },
            {
                "label": "recover",
                "value": "recover"
            },
            {
                "label": "purge",
                "value": "purge"
            }
        ]
    },
    "visible": true
}
```

## Next steps

To learn about deploying a template spec as a linked template, see [Tutorial: Deploy a template spec as a linked template](template-specs-deploy-linked-template.md).
