---
title: Grant access to Azure resources on a Service Fabric cluster
description: Learn how to grant a managed-identity-enabled Service Fabric application access to other Azure resources that support Microsoft Entra authentication.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Grant a Service Fabric application access to Azure resources on a Service Fabric cluster

Before an application can use its managed identity to access other resources, grant permissions to that identity on the protected Azure resource being accessed. Granting permissions is typically a management action on the *control plane* of the Azure service that owns the protected resource routed by Azure Resource Manager. That service enforces any applicable role-based access checking.

The exact sequence of steps depends on the type of Azure resource being accessed and the language and client used to grant permissions. This article assumes a user-assigned identity assigned to the application and includes several examples. Consult the documentation of the respective Azure services for up-to-date instructions on granting permissions.

## Grant access to Azure Storage

You can use the Service Fabric application's managed identity, which is user-assigned in this case, to get the data from an Azure storage blob. Grant the identity the required permissions in the [Azure portal](https://portal.azure.com/) by using the following steps:

1. Navigate to the storage account.
1. Select the Access Control (IAM) link in the left panel.
1. (Optional) Check existing access: select **System-assigned** or **User-assigned** managed identity in the **Find** control. Select the appropriate identity from the ensuing result list.
1. Select **Add** > **Add role assignment** on top of the page to add a new role assignment for the application's identity.
1. Under **Role**, from the dropdown list, select **Storage Blob Data Reader**.
1. In the next dropdown list, under **Assign access to**, choose **User assigned managed identity**.
1. Next, ensure the proper subscription is listed in **Subscription** dropdown list and then set **Resource Group** to **All resource groups**.
1. Under **Select**, choose the UAI corresponding to the Service Fabric application and then select **Save**.

Support for system-assigned Service Fabric managed identities doesn't include integration in the Azure portal. If your application uses a system-assigned identity, find the client ID of the application's identity, and then repeat the steps above but selecting the **Microsoft Entra user, group, or service principal** option in the **Find** control.

## Grant access to Azure Key Vault

Similarly to accessing storage, you can use the managed identity of a Service Fabric application to access an Azure Key Vault. The steps for granting access in the Azure portal are similar to the steps listed above. Refer to the image below for differences.

![Screenshot shows the Key Vault with Access policies selected.](../key-vault/media/vs-secure-secret-appsettings/add-keyvault-access-policy.png)

The following example illustrates granting access to a vault by using a template deployment. Add the snippets below as another entry under the `resources` element of the template. The sample demonstrates access granting for both user-assigned and system-assigned identity types, respectively. Choose the applicable one.

```json
    # under 'variables':
  "variables": {
        "userAssignedIdentityResourceId" : "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/', parameters('userAssignedIdentityName'))]",
    }
    # under 'resources':
    {
        "type": "Microsoft.KeyVault/vaults/accessPolicies",
        "name": "[concat(parameters('keyVaultName'), '/add')]",
        "apiVersion": "2018-02-14",
        "properties": {
            "accessPolicies": [
                {
                    "tenantId": "[reference(variables('userAssignedIdentityResourceId'), '2018-11-30').tenantId]",
                    "objectId": "[reference(variables('userAssignedIdentityResourceId'), '2018-11-30').principalId]",
                    "dependsOn": [
                        "[variables('userAssignedIdentityResourceId')]"
                    ],
                    "permissions": {
                        "keys":         ["get", "list"],
                        "secrets":      ["get", "list"],
                        "certificates": ["get", "list"]
                    }
                }
            ]
        }
    },
```

For system-assigned managed identities:

```json
    # under 'variables':
  "variables": {
        "sfAppSystemAssignedIdentityResourceId": "[concat(resourceId('Microsoft.ServiceFabric/managedClusters/applications/', parameters('clusterName'), parameters('applicationName')), '/providers/Microsoft.ManagedIdentity/Identities/default')]"
    }
    # under 'resources':
    {
        "type": "Microsoft.KeyVault/vaults/accessPolicies",
        "name": "[concat(parameters('keyVaultName'), '/add')]",
        "apiVersion": "2018-02-14",
        "properties": {
            "accessPolicies": [
            {
                    "name": "[concat(parameters('clusterName'), '/', parameters('applicationName'))]",
                    "tenantId": "[reference(variables('sfAppSystemAssignedIdentityResourceId'), '2018-11-30').tenantId]",
                    "objectId": "[reference(variables('sfAppSystemAssignedIdentityResourceId'), '2018-11-30').principalId]",
                    "dependsOn": [
                        "[variables('sfAppSystemAssignedIdentityResourceId')]"
                    ],
                    "permissions": {
                        "secrets": [
                            "get",
                            "list"
                        ],
                        "certificates": 
                        [
                            "get", 
                            "list"
                        ]
                    }
            },
        ]
        }
    }
```

For more information, see [Vaults - Update Access Policy](/rest/api/keyvault/keyvault/vaults/update-access-policy).

## Next steps

* [Deploy an application with Managed Identity to a Service Fabric managed cluster](how-to-managed-cluster-application-managed-identity.md)
