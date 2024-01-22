---
title: Configure Microsoft Entra ID OAuth2 login for Apache Superset
description: Learn how to configure Microsoft Entra ID OAuth2 login for Superset
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Configure Microsoft Entra ID OAuth2 login

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article describes how to allow users to use their Microsoft Entra account ("Microsoft work or school account") to log in to Apache Superset. 

The following configuration allows users to have Superset accounts automatically created when they use their Microsoft Entra login. Azure groups can be automatically mapped to Superset roles, which allow control over who can access Superset and what permissions are given.

1. Create a Microsoft Entra service principal. The steps to create Microsoft Entra ID are described [here](/azure/active-directory/develop/howto-create-service-principal-portal).

    For testing, set the redirect URL to: `http://localhost:8088/oauth-authorized/azure`

1. Create the following secrets in a key vault.

   |Secret name|Description|
   |-|-|
   |client-secret|Service principal/application secret used for user login.|

1. Allow your AKS managed identity (`$MANAGED_IDENTITY_RESOURCE`) to [get and list secrets from the Key Vault](/azure/key-vault/general/assign-access-policy?tabs=azure-portal).

1. Enable the Key Vault secret provider login for your cluster. For more information, see [here](/azure/aks/csi-secrets-store-driver#upgrade-an-existing-aks-cluster-with-azure-key-vault-provider-for-secrets-store-csi-driver-support).

   ```bash
   az aks enable-addons --addons azure-keyvault-secrets-provider --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP_NAME
   ```

1. Prepare a secret provider to allow your service principal secret to be accessible from the Superset machines. For more information, see [here](/azure/aks/csi-secrets-store-identity-access).

   Update in the yaml:
   * `{{MSI_CLIENT_ID}}` - The client ID of the managed identity assigned to the Superset cluster (`$MANAGED_IDENTITY_RESOURCE`). 
   * `{{KEY_VAULT_NAME}}` - The name of the Azure Key Vault containing the secrets.
   * `{{KEY_VAULT_TENANT_ID}}` - The identifier guid of the Azure tenant where the key vault is located.

   superset_secretproviderclass.yaml:
   
   ```yaml
   # This is a SecretProviderClass example using aad-pod-identity to access the key vault
   apiVersion: secrets-store.csi.x-k8s.io/v1
   kind: SecretProviderClass
   metadata:
    name: azure-secret-provider
   spec:
   provider: azure
   parameters:
    useVMManagedIdentity: "true" 
    userAssignedIdentityID: "{{MSI_CLIENT_ID}}"
    usePodIdentity: "false"               # Set to true for using aad-pod-identity to access your key vault
    keyvaultName: "{{KEY_VAULT_NAME}}"    # Set to the name of your key vault
    cloudName: ""                         # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
    objects: |
      array:
        - |
          objectName: client-secret
          objectType: secret
    tenantId: "{{KEY_VAULT_TENANT_ID}}"  # The tenant ID of the key vault
   secretObjects:                             
   - secretName: azure-kv-secrets
     type: Opaque
     data:
     - key: AZURE_SECRET
      objectName: client-secret
   ```

1. Apply the SecretProviderClass to your cluster.

   ```bash
   kubectl apply -f superset_secretproviderclass.yaml
   ```

1. Add to your Superset configuration.

    Update in the config:
      
    * `{{AZURE_TENANT}}` - The tenant the users log into. 
    * `{{SERVICE_PRINCIPAL_APPLICATION_ID}}` - The client/application ID of the service principal you created in step 1.
    * `{{VALID_DOMAINS}}` - An allowlist of domains for user email addresses.
  
    Refer to [sample code](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/superset-config.yml).
 
    
## Redeploy Superset

   ```bash
   helm repo update
   helm upgrade --install --values values.yaml superset superset/superset
   ```

## Next Steps

* [Role Based Access Control](./role-based-access-control.md)
