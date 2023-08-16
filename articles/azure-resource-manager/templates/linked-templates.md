---
title: Link templates for deployment
description: Describes how to use linked templates in an Azure Resource Manager template (ARM template) to create a modular template solution. Shows how to pass parameters values, specify a parameter file, and dynamically created URLs.
ms.topic: conceptual
ms.date: 04/26/2023
ms.custom: devx-track-azurepowershell, devx-track-arm-template
---

# Using linked and nested templates when deploying Azure resources

To deploy complex solutions, you can break your Azure Resource Manager template (ARM template) into many related templates, and then deploy them together through a main template. The related templates can be separate files or template syntax that is embedded within the main template. This article uses the term **linked template** to refer to a separate template file that is referenced via a link from the main template. It uses the term **nested template** to refer to embedded template syntax within the main template.

For small to medium solutions, a single template is easier to understand and maintain. You can see all the resources and values in a single file. For advanced scenarios, linked templates enable you to break down the solution into targeted components. You can easily reuse these templates for other scenarios.

For a tutorial, see [Tutorial: Deploy a linked template](./deployment-tutorial-linked-template.md).

> [!NOTE]
> For linked or nested templates, you can only set the deployment mode to [Incremental](deployment-modes.md). However, the main template can be deployed in complete mode. If you deploy the main template in the complete mode, and the linked or nested template targets the same resource group, the resources deployed in the linked or nested template are included in the evaluation for complete mode deployment. The combined collection of resources deployed in the main template and linked or nested templates is compared against the existing resources in the resource group. Any resources not included in this combined collection are deleted.
>
> If the linked or nested template targets a different resource group, that deployment uses incremental mode. For more information, see [Deployment Scope](./deploy-to-resource-group.md#deployment-scopes).
>

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [modules](../bicep/modules.md).

## Nested template

To nest a template, add a [deployments resource](/azure/templates/microsoft.resources/deployments) to your main template. In the `template` property, specify the template syntax.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedTemplate1",
      "properties": {
        "mode": "Incremental",
        "template": {
          <nested-template-syntax>
        }
      }
    }
  ],
  "outputs": {
  }
}
```

The following example deploys a storage account through a nested template.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedTemplate1",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2021-04-01",
              "name": "[parameters('storageAccountName')]",
              "location": "West US",
              "sku": {
                "name": "Standard_LRS"
              },
              "kind": "StorageV2"
            }
          ]
        }
      }
    }
  ],
  "outputs": {
  }
}
```

### Expression evaluation scope in nested templates

When using a nested template, you can specify whether template expressions are evaluated within the scope of the parent template or the nested template. The scope determines how parameters, variables, and functions like [resourceGroup](template-functions-resource.md#resourcegroup) and [subscription](template-functions-resource.md#subscription) are resolved.

You set the scope through the `expressionEvaluationOptions` property. By default, the `expressionEvaluationOptions` property is set to `outer`, which means it uses the parent template scope. Set the value to `inner` to cause expressions to be evaluated within the scope of the nested template.

```json
{
  "type": "Microsoft.Resources/deployments",
  "apiVersion": "2021-04-01",
  "name": "nestedTemplate1",
  "properties": {
    "expressionEvaluationOptions": {
      "scope": "inner"
    },
  ...
```

> [!NOTE]
>
> When scope is set to `outer`, you can't use the `reference` function in the outputs section of a nested template for a resource you have deployed in the nested template. To return the values for a deployed resource in a nested template, either use `inner` scope or convert your nested template to a linked template.

The following template demonstrates how template expressions are resolved according to the scope. It contains a variable named `exampleVar` that is defined in both the parent template and the nested template. It returns the value of the variable.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
  },
  "variables": {
    "exampleVar": "from parent template"
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedTemplate1",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "variables": {
            "exampleVar": "from nested template"
          },
          "resources": [
          ],
          "outputs": {
            "testVar": {
              "type": "string",
              "value": "[variables('exampleVar')]"
            }
          }
        }
      }
    }
  ],
  "outputs": {
    "messageFromLinkedTemplate": {
      "type": "string",
      "value": "[reference('nestedTemplate1').outputs.testVar.value]"
    }
  }
}
```

The value of `exampleVar` changes depending on the value of the `scope` property in `expressionEvaluationOptions`. The following table shows the results for both scopes.

| Evaluation scope | Output |
| ----- | ------ |
| inner | from nested template |
| outer (or default) | from parent template |

The following example deploys a SQL server and retrieves a key vault secret to use for the password. The scope is set to `inner` because it dynamically creates the key vault ID (see `adminPassword.reference.keyVault` in the outer templates `parameters`) and passes it as a parameter to the nested template.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location where the resources will be deployed."
      }
    },
    "vaultName": {
      "type": "string",
      "metadata": {
        "description": "The name of the keyvault that contains the secret."
      }
    },
    "secretName": {
      "type": "string",
      "metadata": {
        "description": "The name of the secret."
      }
    },
    "vaultResourceGroupName": {
      "type": "string",
      "metadata": {
        "description": "The name of the resource group that contains the keyvault."
      }
    },
    "vaultSubscription": {
      "type": "string",
      "defaultValue": "[subscription().subscriptionId]",
      "metadata": {
        "description": "The name of the subscription that contains the keyvault."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "dynamicSecret",
      "properties": {
        "mode": "Incremental",
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "parameters": {
          "location": {
            "value": "[parameters('location')]"
          },
          "adminLogin": {
            "value": "ghuser"
          },
          "adminPassword": {
            "reference": {
              "keyVault": {
                "id": "[resourceId(parameters('vaultSubscription'), parameters('vaultResourceGroupName'), 'Microsoft.KeyVault/vaults', parameters('vaultName'))]"
              },
              "secretName": "[parameters('secretName')]"
            }
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminLogin": {
              "type": "string"
            },
            "adminPassword": {
              "type": "securestring"
            },
            "location": {
              "type": "string"
            }
          },
          "variables": {
            "sqlServerName": "[concat('sql-', uniqueString(resourceGroup().id, 'sql'))]"
          },
          "resources": [
            {
              "type": "Microsoft.Sql/servers",
              "apiVersion": "2021-02-01-preview",
              "name": "[variables('sqlServerName')]",
              "location": "[parameters('location')]",
              "properties": {
                "administratorLogin": "[parameters('adminLogin')]",
                "administratorLoginPassword": "[parameters('adminPassword')]"
              }
            }
          ],
          "outputs": {
            "sqlFQDN": {
              "type": "string",
              "value": "[reference(variables('sqlServerName')).fullyQualifiedDomainName]"
            }
          }
        }
      }
    }
  ],
  "outputs": {
  }
}
```

Be careful when using secure parameter values in a nested template. If you set the scope to outer, the secure values are stored as plain text in the deployment history. A user viewing the template in the deployment history could see the secure values. Instead use the inner scope or add to the parent template the resources that need secure values.

The following excerpt shows which values are secure and which aren't secure.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "Username for the Virtual Machine."
      }
    },
    "adminPasswordOrKey": {
      "type": "securestring",
      "metadata": {
        "description": "SSH Key or password for the Virtual Machine. SSH key is recommended."
      }
    }
  },
  ...
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-04-01",
      "name": "mainTemplate",
      "properties": {
        ...
        "osProfile": {
          "computerName": "mainTemplate",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPasswordOrKey')]" // Yes, secure because resource is in parent template
        }
      }
    },
    {
      "name": "outer",
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "outer"
        },
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Compute/virtualMachines",
              "apiVersion": "2021-04-01",
              "name": "outer",
              "properties": {
                ...
                "osProfile": {
                  "computerName": "outer",
                  "adminUsername": "[parameters('adminUsername')]",
                  "adminPassword": "[parameters('adminPasswordOrKey')]" // No, not secure because resource is in nested template with outer scope
                }
              }
            }
          ]
        }
      }
    },
    {
      "name": "inner",
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "parameters": {
          "adminPasswordOrKey": {
              "value": "[parameters('adminPasswordOrKey')]"
          },
          "adminUsername": {
              "value": "[parameters('adminUsername')]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminUsername": {
              "type": "string",
              "metadata": {
                "description": "Username for the Virtual Machine."
              }
            },
            "adminPasswordOrKey": {
              "type": "securestring",
              "metadata": {
                "description": "SSH Key or password for the Virtual Machine. SSH key is recommended."
              }
            }
          },
          "resources": [
            {
              "type": "Microsoft.Compute/virtualMachines",
              "apiVersion": "2021-04-01",
              "name": "inner",
              "properties": {
                ...
                "osProfile": {
                  "computerName": "inner",
                  "adminUsername": "[parameters('adminUsername')]",
                  "adminPassword": "[parameters('adminPasswordOrKey')]" // Yes, secure because resource is in nested template and scope is inner
                }
              }
            }
          ]
        }
      }
    }
  ]
}
```

## Linked template

To link a template, add a [deployments resource](/azure/templates/microsoft.resources/deployments) to your main template. In the `templateLink` property, specify the URI of the template to include. The following example links to a template that is in a storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "linkedTemplate",
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "uri":"https://mystorageaccount.blob.core.windows.net/AzureTemplates/newStorageAccount.json",
          "contentVersion":"1.0.0.0"
        }
      }
    }
  ],
  "outputs": {
  }
}
```

When referencing a linked template, the value of `uri` can't be a local file or a file that is only available on your local network. Azure Resource Manager must be able to access the template. Provide a URI value that downloadable as HTTP or HTTPS.

You may reference templates using parameters that include HTTP or HTTPS. For example, a common pattern is to use the `_artifactsLocation` parameter. You can set the linked template with an expression like:

```json
"uri": "[concat(parameters('_artifactsLocation'), '/shared/os-disk-parts-md.json', parameters('_artifactsLocationSasToken'))]"
```

If you're linking to a template in GitHub, use the raw URL. The link has the format: `https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-with-templates/quickstart-template/azuredeploy.json`. To get the raw link, select **Raw**.

:::image type="content" source="./media/linked-templates/select-raw.png" alt-text="Screenshot of selecting raw URL in GitHub.":::

[!INCLUDE [Deploy templates in private GitHub repo](../../../includes/resource-manager-private-github-repo-templates.md)]

### Parameters for linked template

You can provide the parameters for your linked template either in an external file or inline. When providing an external parameter file, use the `parametersLink` property:

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "linkedTemplate",
    "properties": {
      "mode": "Incremental",
      "templateLink": {
        "uri": "https://mystorageaccount.blob.core.windows.net/AzureTemplates/newStorageAccount.json",
        "contentVersion": "1.0.0.0"
      },
      "parametersLink": {
        "uri": "https://mystorageaccount.blob.core.windows.net/AzureTemplates/newStorageAccount.parameters.json",
        "contentVersion": "1.0.0.0"
      }
    }
  }
]
```

To pass parameter values inline, use the `parameters` property.

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "linkedTemplate",
    "properties": {
      "mode": "Incremental",
      "templateLink": {
        "uri": "https://mystorageaccount.blob.core.windows.net/AzureTemplates/newStorageAccount.json",
        "contentVersion": "1.0.0.0"
      },
      "parameters": {
        "storageAccountName": {
          "value": "[parameters('storageAccountName')]"
        }
      }
    }
  }
]
```

You can't use both inline parameters and a link to a parameter file. The deployment fails with an error when both `parametersLink` and `parameters` are specified.

### Use relative path for linked templates

The `relativePath` property of `Microsoft.Resources/deployments` makes it easier to author linked templates. This property can be used to deploy a remote linked template at a location relative to the parent. This feature requires all template files to be staged and available at a remote URI, such as GitHub or Azure storage account. When the main template is called by using a URI from Azure PowerShell or Azure CLI, the child deployment URI is a combination of the parent and relativePath.

> [!NOTE]
> When creating a templateSpec, any templates referenced by the `relativePath` property is packaged in the templateSpec resource by Azure PowerShell or Azure CLI. It do not require the files to be staged. For more information, see [Create a template spec with linked templates](./template-specs.md#create-a-template-spec-with-linked-templates).

Assume a folder structure like this:

:::image type="content" source="./media/linked-templates/resource-manager-linked-templates-relative-path.png" alt-text="Diagram showing folder structure for Resource Manager linked template relative path.":::

The following template shows how *mainTemplate.json* deploys *nestedChild.json* illustrated in the preceding image.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "functions": [],
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "childLinked",
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "relativePath": "children/nestedChild.json"
        }
      }
    }
  ],
  "outputs": {}
}
```

In the following deployment, the URI of the linked template in the preceding template is **https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/linked-template-relpath/children/nestedChild.json**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name linkedTemplateWithRelativePath `
  -ResourceGroupName "myResourceGroup" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/linked-template-relpath/mainTemplate.json"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name linkedTemplateWithRelativePath \
  --resource-group myResourceGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/linked-template-relpath/mainTemplate.json"
```

---

To deploy linked templates with relative path stored in an Azure storage account, use the `QueryString`/`query-string` parameter to specify the SAS token to be used with the TemplateUri parameter. This parameter is only supported by Azure CLI version 2.18 or later and Azure PowerShell version 5.4 or later.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name linkedTemplateWithRelativePath `
  -ResourceGroupName "myResourceGroup" `
  -TemplateUri "https://stage20210126.blob.core.windows.net/template-staging/mainTemplate.json" `
  -QueryString $sasToken
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name linkedTemplateWithRelativePath \
  --resource-group myResourceGroup \
  --template-uri "https://stage20210126.blob.core.windows.net/template-staging/mainTemplate.json" \
  --query-string $sasToken
```

---

Make sure there is no leading "?" in QueryString. The deployment adds one when assembling the URI for the deployments.

## Template specs

Instead of maintaining your linked templates at an accessible endpoint, you can create a [template spec](template-specs.md) that packages the main template and its linked templates into a single entity you can deploy. The template spec is a resource in your Azure subscription. It makes it easy to securely share the template with users in your organization. You use Azure role-based access control (Azure RBAC) to grant access to the template spec. This feature is currently in preview.

For more information, see:

- [Tutorial: Create a template spec with linked templates](./template-specs-create-linked.md).
- [Tutorial: Deploy a template spec as a linked template](./template-specs-deploy-linked-template.md).

## Dependencies

As with other resource types, you can set dependencies between the nested/linked templates. If the resources in one nested/linked template must be deployed before resources in a second nested/linked template, set the second template dependent on the first.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/linkedtemplates/linked-dependency.json" highlight="10,22,24":::

## contentVersion

You don't have to provide the `contentVersion` property for the `templateLink` or `parametersLink` property. If you don't provide a `contentVersion`, the current version of the template is deployed. If you provide a value for content version, it must match the version in the linked template; otherwise, the deployment fails with an error.

## Using variables to link templates

The previous examples showed hard-coded URL values for the template links. This approach might work for a simple template, but it doesn't work well for a large set of modular templates. Instead, you can create a static variable that stores a base URL for the main template and then dynamically create URLs for the linked templates from that base URL. The benefit of this approach is that you can easily move or fork the template because you need to change only the static variable in the main template. The main template passes the correct URIs throughout the decomposed template.

The following example shows how to use a base URL to create two URLs for linked templates (`sharedTemplateUrl` and `vmTemplateUrl`).

```json
"variables": {
  "templateBaseUrl": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/application-workloads/postgre/postgresql-on-ubuntu/",
  "sharedTemplateUrl": "[uri(variables('templateBaseUrl'), 'shared-resources.json')]",
  "vmTemplateUrl": "[uri(variables('templateBaseUrl'), 'database-2disk-resources.json')]"
}
```

You can also use [deployment()](template-functions-deployment.md#deployment) to get the base URL for the current template, and use that to get the URL for other templates in the same location. This approach is useful if your template location changes or you want to avoid hard coding URLs in the template file. The `templateLink` property is only returned when linking to a remote template with a URL. If you're using a local template, that property isn't available.

```json
"variables": {
  "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"
}
```

Ultimately, you would use the variable in the `uri` property of a `templateLink` property.

```json
"templateLink": {
 "uri": "[variables('sharedTemplateUrl')]",
 "contentVersion":"1.0.0.0"
}
```

## Using copy

To create multiple instances of a resource with a nested template, add the `copy` element at the level of the `Microsoft.Resources/deployments` resource. Or, if the scope is `inner`, you can add the copy within the nested template.

The following example template shows how to use `copy` with a nested template.

```json
"resources": [
  {
    "type": "Microsoft.Resources/deployments",
    "apiVersion": "2021-04-01",
    "name": "[concat('nestedTemplate', copyIndex())]",
    // yes, copy works here
    "copy": {
      "name": "storagecopy",
      "count": 2
    },
    "properties": {
      "mode": "Incremental",
      "expressionEvaluationOptions": {
        "scope": "inner"
      },
      "template": {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "resources": [
          {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2021-04-01",
            "name": "[concat(variables('storageName'), copyIndex())]",
            "location": "West US",
            "sku": {
              "name": "Standard_LRS"
            },
            "kind": "StorageV2"
            // Copy works here when scope is inner
            // But, when scope is default or outer, you get an error
            // "copy": {
            //   "name": "storagecopy",
            //   "count": 2
            // }
          }
        ]
      }
    }
  }
]
```

## Get values from linked template

To get an output value from a linked template, retrieve the property value with syntax like: `"[reference('deploymentName').outputs.propertyName.value]"`.

When getting an output property from a linked template, the property name must not include a dash.

The following examples demonstrate how to reference a linked template and retrieve an output value. The linked template returns a simple message. First, the linked template:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/linkedtemplates/helloworld.json":::

The main template deploys the linked template and gets the returned value. Notice that it references the deployment resource by name, and it uses the name of the property returned by the linked template.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/linkedtemplates/helloworldparent.json" highlight="10,23":::

The following example shows a template that deploys a public IP address and returns the resource ID of the Azure resource for that public IP:

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/linkedtemplates/public-ip.json" highlight="27":::

To use the public IP address from the preceding template when deploying a load balancer, link to the template and declare a dependency on the `Microsoft.Resources/deployments` resource. The public IP address on the load balancer is set to the output value from the linked template.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json" highlight="28,41":::

## Deployment history

Resource Manager processes each template as a separate deployment in the deployment history. A main template with three linked or nested templates appears in the deployment history as:

:::image type="content" source="./media/linked-templates/deployment-history.png" alt-text="Screenshot of deployment history in Azure portal.":::

You can use these separate entries in the history to retrieve output values after the deployment. The following template creates a public IP address and outputs the IP address:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "publicIPAddresses_name": {
      "type": "string"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Network/publicIPAddresses",
      "apiVersion": "2021-02-01",
      "name": "[parameters('publicIPAddresses_name')]",
      "location": "southcentralus",
      "properties": {
        "publicIPAddressVersion": "IPv4",
        "publicIPAllocationMethod": "Static",
        "idleTimeoutInMinutes": 4,
        "dnsSettings": {
          "domainNameLabel": "[concat(parameters('publicIPAddresses_name'), uniqueString(resourceGroup().id))]"
        }
      },
      "dependsOn": []
    }
  ],
  "outputs": {
    "returnedIPAddress": {
      "type": "string",
      "value": "[reference(parameters('publicIPAddresses_name')).ipAddress]"
    }
  }
}
```

The following template links to the preceding template. It creates three public IP addresses.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "[concat('linkedTemplate', copyIndex())]",
      "copy": {
        "count": 3,
        "name": "ip-loop"
      },
      "properties": {
        "mode": "Incremental",
        "templateLink": {
        "uri": "[uri(deployment().properties.templateLink.uri, 'static-public-ip.json')]",
        "contentVersion": "1.0.0.0"
        },
        "parameters":{
          "publicIPAddresses_name":{"value": "[concat('myip-', copyIndex())]"}
        }
      }
    }
  ]
}
```

After the deployment, you can retrieve the output values with the following PowerShell script:

```azurepowershell-interactive
$loopCount = 3
for ($i = 0; $i -lt $loopCount; $i++)
{
  $name = 'linkedTemplate' + $i;
  $deployment = Get-AzResourceGroupDeployment -ResourceGroupName examplegroup -Name $name
  Write-Output "deployment $($deployment.DeploymentName) returned $($deployment.Outputs.returnedIPAddress.value)"
}
```

Or, Azure CLI script in a Bash shell:

```azurecli-interactive
#!/bin/bash

for i in 0 1 2;
do
  name="linkedTemplate$i";
  deployment=$(az deployment group show -g examplegroup -n $name);
  ip=$(echo $deployment | jq .properties.outputs.returnedIPAddress.value);
  echo "deployment $name returned $ip";
done
```

## Securing an external template

Although the linked template must be externally available, it doesn't need to be generally available to the public. You can add your template to a private storage account that is accessible to only the storage account owner. Then, you create a shared access signature (SAS) token to enable access during deployment. You add that SAS token to the URI for the linked template. Even though the token is passed in as a secure string, the URI of the linked template, including the SAS token, is logged in the deployment operations. To limit exposure, set an expiration for the token.

The parameter file can also be limited to access through a SAS token.

Currently, you can't link to a template in a storage account that is behind an [Azure Storage firewall](../../storage/common/storage-network-security.md).

> [!IMPORTANT]
> Instead of securing your linked template with a SAS token, consider creating a [template spec](template-specs.md). The template spec securely stores the main template and its linked templates as a resource in your Azure subscription. You use Azure RBAC to grant access to users who need to deploy the template.

The following example shows how to pass a SAS token when linking to a template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "containerSasToken": { "type": "securestring" }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "linkedTemplate",
      "properties": {
        "mode": "Incremental",
        "templateLink": {
          "uri": "[concat(uri(deployment().properties.templateLink.uri, 'helloworld.json'), parameters('containerSasToken'))]",
          "contentVersion": "1.0.0.0"
        }
      }
    }
  ],
  "outputs": {
  }
}
```

In PowerShell, you get a token for the container and deploy the templates with the following commands. Notice that the `containerSasToken` parameter is defined in the template. It isn't a parameter in the `New-AzResourceGroupDeployment` command.

```azurepowershell-interactive
Set-AzCurrentStorageAccount -ResourceGroupName ManageGroup -Name storagecontosotemplates
$token = New-AzStorageContainerSASToken -Name templates -Permission r -ExpiryTime (Get-Date).AddMinutes(30.0)
$url = (Get-AzStorageBlob -Container templates -Blob parent.json).ICloudBlob.uri.AbsoluteUri
New-AzResourceGroupDeployment -ResourceGroupName ExampleGroup -TemplateUri ($url + $token) -containerSasToken $token
```

For Azure CLI in a Bash shell, you get a token for the container and deploy the templates with the following code:

```azurecli-interactive
#!/bin/bash

expiretime=$(date -u -d '30 minutes' +%Y-%m-%dT%H:%MZ)
connection=$(az storage account show-connection-string \
  --resource-group ManageGroup \
  --name storagecontosotemplates \
  --query connectionString)
token=$(az storage container generate-sas \
  --name templates \
  --expiry $expiretime \
  --permissions r \
  --output tsv \
  --connection-string $connection)
url=$(az storage blob url \
  --container-name templates \
  --name parent.json \
  --output tsv \
  --connection-string $connection)
parameter='{"containerSasToken":{"value":"?'$token'"}}'
az deployment group create --resource-group ExampleGroup --template-uri $url?$token --parameters $parameter
```

## Example templates

The following examples show common uses of linked templates.

|Main template  |Linked template |Description  |
|---------|---------| ---------|
|[Hello World](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/helloworldparent.json) |[linked template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/helloworld.json) | Returns string from linked template. |
|[Load Balancer with public IP address](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) |[linked template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) |Returns public IP address from linked template and sets that value in load balancer. |
|[Multiple IP addresses](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/static-public-ip-parent.json) | [linked template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/static-public-ip.json) |Creates several public IP addresses in linked template.  |

## Next steps

- To go through a tutorial, see [Tutorial: Deploy a linked template](./deployment-tutorial-linked-template.md).
- To learn about the defining the deployment order for your resources, see [Define the order for deploying resources in ARM templates](./resource-dependency.md).
- To learn how to define one resource but create many instances of it, see [Resource iteration in ARM templates](copy-resources.md).
- For steps on setting up a template in a storage account and generating a SAS token, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md) or [Deploy resources with ARM templates and Azure CLI](deploy-cli.md).
