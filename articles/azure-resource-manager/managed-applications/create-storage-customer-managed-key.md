---
title: Create Azure Managed Application that deploys storage account encrypted with customer-managed key
description: This article describes how to create an Azure Managed Application that deploys a storage account encrypted with a customer-managed key.
ms.author: jojok
author: jojokoshy
ms.topic: how-to
ms.date: 05/01/2023
---

# Create Azure Managed Application that deploys storage account encrypted with customer-managed key

This article describes how to create an Azure Managed Application that deploys a storage account encrypted using a customer-managed key. Storage account, Cosmos DB, and Azure Database for Postgres support data encryption at rest using customer-managed keys or Microsoft-managed keys. You can use your own encryption key to protect the data in your storage account. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Customer-managed keys offer greater flexibility to manage access controls.

## Prerequisites

- An Azure account with an active subscription and permissions to Azure Active Directory resources like users, groups, or service principals. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).
- Be familiar with how to [create](publish-service-catalog-app.md) and [deploy](deploy-service-catalog-quickstart.md) a service catalog definition.

## Managed identities

Configuring a customer-managed key for a storage account deployed by the managed application as a resource within the managed resource group requires a user-assigned managed identity. This user-assigned managed identity can be used to grant the managed application access to other existing resources. To learn how to configure your managed application with a user-assigned managed identity go to [Azure Managed Application with managed identity](publish-managed-identity.md).

Your application can be granted two types of identities:

- A **system-assigned managed identity** is assigned to your application and is deleted if your app is deleted. An app can only have one system-assigned managed identity.
- A **user-assigned managed identity** is a standalone Azure resource that can be assigned to your app. An app can have multiple user-assigned managed identities.

To deploy a storage account in your managed application's managed resource group that's encrypted with customer keys from existing key vault, more configuration is required. The managed identity configured with your managed application needs the built-in Azure role-based access control _Managed Identity Operator_ over the managed identity that has access to the key vault. For more details, go to [Managed Identity Operator role](../../role-based-access-control/built-in-roles.md#managed-identity-operator).

## Create a key vault with purge protection

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. From the Azure portal menu, or from the Home page, select **Create a resource**.
1. In the Search box, enter _Key Vault_.
1. From the results list, select **Key Vault**.
1. On the **Key Vault** section, select **Create**.
1. On the Create key vault section, provide the following information:
   - **Subscription**: Select your subscription.
   - **Resource Group**: Select **Create new** and enter a name like _demo-cmek-rg_.
   - **Name**: A unique name is required, like _demo-keyvault-cmek_.
   - **Region**: Select a location like East US.
   - **Pricing tier**: Select _Standard_ from the drop-down list.
   - **Purge protection**: Select _Enable purge protection_.
1. Select **Next** and go to the **Access Policy** tab.
   - **Access configuration**: Select _Azure role-based access control_.
   - Accept the defaults for all the other options.
1. Select **Review + create**.
1. Confirm the settings are correct and select **Create**.

After the successful deployment, select **Go to resource**. On the **Overview** tab, make note of the following properties:

- **Vault Name**: In the example, the vault name is _demo-keyvault-cmek_. You use this name for other steps.
- **Vault URI**: In the example, the vault URI is `https://demo-keyvault-cmek.vault.azure.net/`.

## Create a user-assigned managed identity

To create a user-assigned managed identity, your account needs the managed identity Contributor role assignment.

1. In the search box, enter _managed identities_.
1. Under Services, select **Managed Identities**.
1. Select **Create** and enter the following values on the **Basics** tab:
   - **Subscription**: Select your subscription.
   - **Resource group**: Select the resource group _demo-cmek-rg_ that you created in the previous steps.
   - **Region**: Select a region like East US.
   - **Name**: Enter the name for your user-assigned managed identity, like _demokeyvaultmi_.
1. Select **Review + create**.
1. After **Validation Passed** is displayed, select **Create**.

After a successful deployment, select **Go to resource**.

## Create role assignments

You need to create two role assignments for your key vault. For details, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

### Grant key permission on key vault to the managed identity

Create a role assignment for the key vault managed identity _demokeyvaultmi_ to wrap and unwrap keys.

1. Go to your key vault _demo-cmek-keyvault_.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. Assign the following role:
   - **Role**: Key Vault Crypto Service Encryption User
   - **Assign Access to**:  Managed identity
   - **Member**: _demokeyvaultmi_
1. Select **Review + assign** to view your settings.
1. Select **Review + assign** to create the role assignment.

### Create a role assignment for your account

Create another role assignment so that your account can create a new key in your key vault.

1. Assign the following role:
   - **Role**: Key Vault Crypto Officer
   - **Assign Access to**: User, group, or service principal
   - **Member**: Your Azure Active Directory account
1. Select **Review + assign** to view your settings.
1. Select **Review + assign** to create the role assignment.

You can verify the key vault's role assignments in **Access control (IAM)** > **Role assignments**.

## Create a key

You need to create a key that your key vault uses to encrypt a storage account.

1. Go to your key vault, _demo-cmek-keyvault_.
1. Select **Keys**.
1. Select **Generate/Import**.
1. On the **Create a key** page, select the following values:
   - **Options**: Generate
   - **Name**: _demo-cmek-key_
1. Accept the defaults for the other options.
1. Select **Create**.

Make a note of the key name. You use it when you deploy the managed application.

### Create a user-assigned managed identity for the managed application

Create a user-assigned managed identity to be used as the managed identity for the managed application.

1. In the search box, enter _Managed Identities_.
1. Under Services, select **Managed Identities**.
1. Select **Create**.
   - **Subscription**: Select your subscription.
   - **Resource group**: Select the resource group _demo-cmek-rg_.
   - **Region**: Select a region like East US.
   - **Name**: Enter the name for your user-assigned managed identity, like _demomanagedappmi_.
1. Select **Review + create**.
1. After **Validation Passed** is displayed, select **Create**.

After a successful deployment, select **Go to resource**.

## Assign role permission to managed identity

Assign the _Managed Identity Operator_ role to the managed identity at the scope of the user-assigned managed identity named _demokeyvaultmi_.

1. Go to the user-assigned managed identity named _demokeyvaultmi_.
1. Select **Access control (IAM**).
1. Select **Add** > **Add role assignment** to open the Add role assignment page.
1. Assign the following role.
   - **Role**: Managed Identity Operator
   - **Assign Access to**: Managed Identity
   - **Member**: _demomanagedappmi_
1. Select **Review + assign** to view your settings.
1. Select **Review + assign** to create the role assignment.

You can verify the role assignment for _demokeyvaultmi_ in **Access control (IAM)** > **Role assignments**.

## Sample managed application template

Create a managed application that deploys a storage account in a managed resource group and use a pre-existing key vault's key to encrypt the data in the storage account.

To publish a managed application to your service catalog, do the following tasks:

1. Create the [creatUIDefinition.json](#create-template-createuidefinitionjson) file from the sample in this article. The template defines the portal's user interface elements when deploying the managed application.
1. Create an Azure Resource Manager template named [mainTemplate.json](#create-template-maintemplatejson) by converting the Bicep file in this article to JSON. The template defines the resources to deploy with the managed application.
1. Create a _.zip_ package that contains the required JSON files: _createUiDefinition.json_ and _mainTemplate.json_.
1. Publish the managed application definition so it's available in your service catalog. For more information, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).

### Create template createUiDefinition.json

 The following template creates a user-assigned managed identity for the managed application. In this example, we disable the system-assigned managed identity because we need our user-assigned managed identity to be configured in advance with the _Managed Identity Operator_ permissions over the key vault's managed identity.

1. Create a new file in Visual Studio Code named _creatUIDefinition.json_.
1. Copy and paste the following code into the file.
1. Save the file.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [],
    "steps": [
      {
        "name": "managedApplicationSetting",
        "label": "Application Settings",
        "subLabel": {
          "preValidation": "Configure your application settings and Managed Identity for the application",
          "postValidation": "Done"
        },
        "bladeTitle": "Application Settings - Config",
        "elements": [
          {
            "name": "appIdentity",
            "type": "Microsoft.ManagedIdentity.IdentitySelector",
            "label": "Managed Identity Configuration for the Application (Needs Managed Identity Operator permissions over KV Managed Identity).",
            "toolTip": {
              "systemAssignedIdentity": "Enable system assigned identity to grant the managed application access to additional existing resources.",
              "userAssignedIdentity": "Add user assigned identities to grant the managed application access to additional existing resources."
            },
            "defaultValue": {
              "systemAssignedIdentity": "Off"
            },
            "options": {
              "hideSystemAssignedIdentity": true,
              "hideUserAssignedIdentity": false,
              "readOnlySystemAssignedIdentity": true
            },
            "visible": true
          }
        ]
      },
      {
        "name": "configuration",
        "type": "Microsoft.Common.Section",
        "label": "Configuration",
        "elements": [
          {
            "name": "cmek",
            "type": "Microsoft.Common.Section",
            "label": "Customer Managed Encryption Key (CMEK)",
            "elements": [
              {
                "name": "cmekEnable",
                "type": "Microsoft.Common.CheckBox",
                "label": "Enable CMEK",
                "toolTip": "Enable to provide a CMEK",
                "constraints": {
                  "required": false
                }
              },
              {
                "name": "cmekKeyVaultUrl",
                "type": "Microsoft.Common.TextBox",
                "label": "Key Vault URL",
                "toolTip": "Specify the CMEK Key Vault URL",
                "defaultValue": "",
                "constraints": {
                  "required": "[steps('configuration').cmek.cmekEnable]",
                  "regex": ".*",
                  "validationMessage": "The value must not be empty."
                },
                "visible": "[steps('configuration').cmek.cmekEnable]"
              },
              {
                "name": "cmekKeyName",
                "type": "Microsoft.Common.TextBox",
                "label": "Key Name",
                "toolTip": "Specify the key name from your key vault.",
                "defaultValue": "",
                "constraints": {
                  "required": "[steps('configuration').cmek.cmekEnable]",
                  "regex": ".*",
                  "validationMessage": "The value must not be empty."
                },
                "visible": "[steps('configuration').cmek.cmekEnable]"
              },
              {
                "name": "cmekKeyIdentity",
                "type": "Microsoft.ManagedIdentity.IdentitySelector",
                "label": "Managed Identity Configuration for Key Vault Access",
                "toolTip": {
                  "systemAssignedIdentity": "Enable system assigned identity to grant the managed application access to additional existing resources.",
                  "userAssignedIdentity": "Add user assigned identities to grant the managed application access to additional existing resources."
                },
                "defaultValue": {
                  "systemAssignedIdentity": "Off"
                },
                "options": {
                  "hideSystemAssignedIdentity": true,
                  "hideUserAssignedIdentity": false,
                  "readOnlySystemAssignedIdentity": true
                },
                "visible": "[steps('configuration').cmek.cmekEnable]"
              }
            ],
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "location": "[location()]",
      "managedIdentity": "[steps('managedApplicationSetting').appIdentity]",
      "cmekConfig": {
        "kvUrl": "[if(empty(steps('configuration').cmek.cmekKeyVaultUrl), '', steps('configuration').cmek.cmekKeyVaultUrl)]",
        "keyName": "[if(empty(steps('configuration').cmek.cmekKeyName), '', steps('configuration').cmek.cmekKeyName)]",
        "identityId": "[if(empty(steps('configuration').cmek.cmekKeyIdentity), '', steps('configuration').cmek.cmekKeyIdentity)]"
      }
    }
  }
}
```

### Create template mainTemplate.json

The following Bicep file is the source code for your _mainTemplate.json_. The template uses the user-assigned managed identity defined in the _createUiDefinition.json_ file.

1. Create a new file in Visual Studio Code named _mainTemplate.bicep_.
1. Copy and paste the following code into the file.
1. Save the file.

```bicep
param cmekConfig object = {
  kvUrl: ''
  keyName: ''
  identityId: {}
}
@description('Specify the Azure region to place the application definition.')
param location string = resourceGroup().location
/////////////////////////////////
// Common Resources Configuration
/////////////////////////////////
var commonproperties = {
  name: 'cmekdemo'
  displayName: 'Common Resources'
  storage: {
    sku: 'Standard_LRS'
    kind: 'StorageV2'
    accessTier: 'Hot'
    minimumTlsVersion: 'TLS1_2'

  }
}
var identity = items(cmekConfig.identityId.userAssignedIdentities)[0].key

resource storage 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: '${commonproperties.name}${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: commonproperties.storage.sku
  }
  kind: commonproperties.storage.kind
  identity: cmekConfig.identityId
  properties: {
    accessTier: commonproperties.storage.accessTier
    minimumTlsVersion: commonproperties.storage.minimumTlsVersion
    encryption: {
      identity: {
        userAssignedIdentity: identity
      }
      services: {
        blob: {
          enabled: true
        }
        table: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Keyvault'
      keyvaultproperties: {
        keyname: '${cmekConfig.keyName}'
        keyvaulturi: '${cmekConfig.kvUrl}'
      }
    }
  }
}
```

Use PowerShell or Azure CLI to build the _mainTemplate.json_ file. Go to the directory where you saved your Bicep file and run the `build` command.

# [PowerShell](#tab/azure-powershell)

```powershell
bicep build mainTemplate.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file mainTemplate.bicep
```

---

After the Bicep file is converted to JSON, your _mainTemplate.json_ file should match the following example. You might have different values in the `metadata` properties for `version` and `templateHash`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.16.2.56959",
      "templateHash": "1234567891234567890"
    }
  },
  "parameters": {
    "cmekConfig": {
      "type": "object",
      "defaultValue": {
        "kvUrl": "",
        "keyName": "",
        "identityId": {}
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify the Azure region to place the application definition."
      }
    }
  },
  "variables": {
    "commonproperties": {
      "name": "cmekdemo",
      "displayName": "Common Resources",
      "storage": {
        "sku": "Standard_LRS",
        "kind": "StorageV2",
        "accessTier": "Hot",
        "minimumTlsVersion": "TLS1_2"
      }
    },
    "identity": "[items(parameters('cmekConfig').identityId.userAssignedIdentities)[0].key]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-05-01",
      "name": "[format('{0}{1}', variables('commonproperties').name, uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[variables('commonproperties').storage.sku]"
      },
      "kind": "[variables('commonproperties').storage.kind]",
      "identity": "[parameters('cmekConfig').identityId]",
      "properties": {
        "accessTier": "[variables('commonproperties').storage.accessTier]",
        "minimumTlsVersion": "[variables('commonproperties').storage.minimumTlsVersion]",
        "encryption": {
          "identity": {
            "userAssignedIdentity": "[variables('identity')]"
          },
          "services": {
            "blob": {
              "enabled": true
            },
            "table": {
              "enabled": true
            },
            "file": {
              "enabled": true
            }
          },
          "keySource": "Microsoft.Keyvault",
          "keyvaultproperties": {
            "keyname": "[format('{0}', parameters('cmekConfig').keyName)]",
            "keyvaulturi": "[format('{0}', parameters('cmekConfig').kvUrl)]"
          }
        }
      }
    }
  ]
}
```

## Deploy the managed application

After the service catalog definition is created, you can deploy the managed application. For more information, go to [Quickstart: Deploy a service catalog managed application](deploy-service-catalog-quickstart.md).

During the deployment, you use your user-assigned managed identities, key vault name, key vault URL, key vault's key name. The _createUiDefinition.json_ file creates the use interface.

For example, in a portal deployment, on the **Application Settings** tab, you add the _demomanagedappmi_.

:::image type="content" source="./media/create-storage-customer-managed-key/application-settings.png" alt-text="Screenshot of the Application Settings tab to add a user-assigned managed identity.":::

On the **Configuration** tab, you enable the customer-managed key and add the user-assigned managed identity for the key vault, _demokeyvaultmi_. You also specify the key vault's URL and the key vault's key name that you created.

:::image type="content" source="./media/create-storage-customer-managed-key/configuration-settings.png" alt-text="Screenshot of the Configuration to enable the customer-managed key, add key vault URL and key name, and add a user-assigned managed identity.":::

## Verify the deployment

After the deployment is complete, you can verify the managed application's identity assignment. The user-assigned managed identity _demomanagedappmi_ is assigned to the managed application.

1. Go to the resource group where you deployed the managed application.
1. Under **Settings** > **Identity** select **User assigned (preview)**.

You can also verify the storage account that the managed application deployed. The **Encryption** tab shows the key _demo-cmek-key_ and the resource ID for the user-assigned managed identity.

1. Go to the managed resource group where the managed application's storage account is deployed.
1. Under **Security + networking** select **Encryption**.

## Next steps

- For more information about storage encryption, go to [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md).
- For more information about user-assigned managed identity with permissions to access the key in the key vault, go to [Configure customer-managed keys in the same tenant for an existing storage account](../../storage/common/customer-managed-keys-configure-existing-account.md).
