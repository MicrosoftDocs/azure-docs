---
title: Enable automatic certificate rotation in a Batch pool
description: You can create a Batch pool with a managed identity and a certificate that will automatically be renewed.
ms.topic: conceptual
ms.custom: devx-track-linux
ms.date: 05/24/2023
---
# Enable automatic certificate rotation in a Batch pool

 You can create a Batch pool with a certificate that will automatically be renewed. To do so, your pool must be created with a [user-assigned managed identity](managed-identity-pools.md) that will have access to the certificate in [Azure Key Vault](../key-vault/general/overview.md).

## Create a user-assigned identity

First, [create your user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity) in the same tenant as your Batch account. This managed identity does not need to be in the same resource group or even in the same subscription.

Be sure to note the **Client ID** of the user-assigned managed identity. You'll need this value later.

:::image type="content" source="media/automatic-certificate-rotation/client-id.png" alt-text="Screenshot showing the client ID of a user-assigned managed identity in the Azure portal.":::

## Create your certificate

Next, you'll need to create a certificate and add it to Azure Key Vault. If you haven't already created a key vault, you'll need to do that first. For instructions, see [Quickstart: Set and retrieve a certificate from Azure Key Vault using the Azure portal](../key-vault/certificates/quick-create-portal.md).

When creating your certificate, be sure to set **Lifetime Action Type** to automatically renew, and specify the number of days after which the certificate should renew.

:::image type="content" source="media/automatic-certificate-rotation/certificate.png" alt-text="Screenshot of the certificate creation screen in the Azure portal.":::

After your certificate has been created, make note of its **Secret Identifier**. You'll need this value later.

:::image type="content" source="media/automatic-certificate-rotation/secret-identifier.png" alt-text="Screenshot showing the Secret Identifier of a certificate.":::

## Add an access policy in Azure Key Vault

In your key vault, assign a Key Vault access policy that allows your user-assigned managed identity to access secrets and certificates. For detailed instructions, see [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md).

## Create a Batch pool with a user-assigned managed identity

Create a Batch pool with your managed identity by using the [Batch .NET management library](/dotnet/api/overview/azure/batch#management-library). For more information, see [Configure managed identities in Batch pools](managed-identity-pools.md).

The following example uses the Batch Management REST API to create a pool. Be sure to use your certificate's **Secret Identifier** for `observedCertificates` and your managed identity's **Client ID** for `msiClientId`, replacing the example data below.

REST API URI

```http
PUT https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupName>/providers/Microsoft.Batch/batchAccounts/<batchaccountname>/pools/<poolname>?api-version=2021-01-01
```

Request Body

```json
{
    "name": "test2",
    "type": "Microsoft.Batch/batchAccounts/pools",
    "properties": {
        "vmSize": "STANDARD_DS2_V2",
        "taskSchedulingPolicy": {
            "nodeFillType": "Pack"
        },
        "deploymentConfiguration": {
            "virtualMachineConfiguration": {
                "imageReference": {
                    "publisher": "canonical",
                    "offer": "ubuntuserver",
                    "sku": "20.04-lts",
                    "version": "latest"
                },
                "nodeAgentSkuId": "batch.node.ubuntu 20.04",
                "extensions": [
                    {
                        "name": "KVExtensions",
                        "type": "KeyVaultForLinux",
                        "publisher": "Microsoft.Azure.KeyVault",
                        "typeHandlerVersion": "1.0",
                        "autoUpgradeMinorVersion": true,
                        "settings": {
                            "secretsManagementSettings": {
                                "pollingIntervalInS": "300",
                                "certificateStoreLocation": "/var/lib/waagent/Microsoft.Azure.KeyVault",
                                "requireInitialSync": true,
                                "observedCertificates": [
                                    "https://testkvwestus2s.vault.azure.net/secrets/authcertforumatesting/8f5f3f491afd48cb99286ba2aacd39af"
                                ]
                            },
                            "authenticationSettings": {
                                "msiEndpoint": "http://169.254.169.254/metadata/identity",
                                "msiClientId": "b9f6dd56-d2d6-4967-99d7-8062d56fd84c"
                            }  
                        },
                    }                
               ]            
            }
        },
        "scaleSettings": {
            "fixedScale": {
                "targetDedicatedNodes": 1,
                "resizeTimeout": "PT15M"
            }
        },
    },
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/042998e4-36dc-4b7d-8ce3-a7a2c4877d33/resourceGroups/ACR/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testumaforpools": {}
        }
    }
}

```

## Validate the certificate

To confirm that the certificate has been successfully deployed, log in to the compute node. You should see output similar to the following:

```
root@74773db5fe1b42ab9a4b6cf679d929da000000:/var/lib/waagent/Microsoft.Azure.KeyVault.KeyVaultForLinux-1.0.1363.13/status# cat 1.status
[{"status":{"code":0,"formattedMessage":{"lang":"en","message":"Successfully started Key Vault extension service. 2021-03-03T23:12:23Z"},"operation":"Service start.","status":"success"},"timestampUTC":"2021-03-03T23:12:23Z","version":"1.0"}]root@74773db5fe1b42ab9a4b6cf679d929da000000:/var/lib/waagent/Microsoft.Azure.KeyVault.KeyVaultForLinux-1.0.1363.13/status#
```

## Next steps

- Learn more about [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).
- Learn how to use [customer-managed keys with user-managed identities](batch-customer-managed-key.md).
