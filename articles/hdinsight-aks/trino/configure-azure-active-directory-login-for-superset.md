---
title: Configure Azure Active Directory OAuth2 login for Apache Superset
description: Learn how to configure Azure Active Directory OAuth2 login for Superset
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Configure Azure Active Directory OAuth2 login

This article describes how to allow users to use their Azure Active Directory (Azure AD) account ("Microsoft work or school account") to log in to Apache Superset. 

The following configuration allows users to have Superset accounts automatically created when they use their Azure AD login. Azure groups can be automatically mapped to Superset roles, which allow control over who can access Superset and what permissions are given.

1. Create an Azure Active Directory service principal. The steps to create Azure Active Directory are described [here](/azure/active-directory/develop/howto-create-service-principal-portal).

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
     <br>
 
    ```yaml
    configOverrides:
    ...
    ****** Existing Oauth configuration goes here ******
    ...
    enable_oauth_login: |

     # Superset will not be aware of SSL termination. This will tell Superset to pay attention to fowarded headers:
     ENABLE_PROXY_FIX = True

     # Azure auth to allow users to login:
     from flask_appbuilder.security.manager import (AUTH_DB, AUTH_OAUTH)
     AUTH_TYPE = AUTH_OAUTH

     OAUTH_PROVIDERS = [
         {
             "name": "azure",
             "icon": "fa-windows",
             "allowlist": [ "{{VALID_DOMAINS}}" ], # this can be empty
             "token_key": "access_token",
             "remote_app": {
               "client_id": "{{SERVICE_PRINCIPAL_APPLICATION_ID}}",
               "client_secret": os.environ.get("AZURE_SECRET"),
               "api_base_url": "https://login.microsoftonline.com/{{AZURE_TENANT}}/oauth2/v2.0/",
               "client_kwargs": {
                   "scope": "User.read email profile openid",
                   "resource": "{{SERVICE_PRINCIPAL_APPLICATION_ID}}",
                   "user_info_mapping":
                   {
                     "name": ("name", ""),
                     "email": ("email", ""),
                     "first_name": ("given_name", ""),
                     "last_name": ("family_name", ""),
                     "id": ("oid", ""),
                     "username": ("preferred_username", ""),
                    "role_keys": ("roles", []),
                   }
               },
               "request_token_url": None,
               "access_token_url": "https://login.microsoftonline.com/{{AZURE_TENANT}}/oauth2/v2.0/token",
               "authorize_url": "https://login.microsoftonline.com/{{AZURE_TENANT}}/oauth2/v2.0/authorize",
               "jwks_uri": "https://login.microsoftonline.com/common/discovery/v2.0/keys"
           }
       }
     ]
     # **** Automatic registration of users
     # Map Authlib roles to superset roles 
     # Will allow user self-registration, allowing to create Flask users from Authorized User 
     AUTH_USER_REGISTRATION = True 
     # The default user self-registration role. If you want all authenticated users to access Superset, set this role to "Public" or "Admin" 
     AUTH_USER_REGISTRATION_ROLE = "Admin" 
     AUTH_ROLES_SYNC_AT_LOGIN = False
     # **** End automatic registration of users

     azure_oauth_provider: |
     import logging
     from superset.security import SupersetSecurityManager

     class AADSecurityManager(SupersetSecurityManager):

         def oauth_user_info(self, provider, response=None):
             logging.debug("Oauth2 provider: {0}.".format(provider))
             if provider == 'azure':
                 logging.debug("Azure response received : {0}".format(response))
                 id_token = response["id_token"]
                 me = self._azure_jwt_token_parse(id_token)
                 return {
                     "name": me.get("name", ""),
                     "email": me["email"],
                     "first_name": me.get("given_name", ""),
                     "last_name": me.get("family_name", ""),
                     "id": me["oid"],
                     "username": me["preferred_username"],
                     "role_keys": me.get("roles", []),
                 }

     CUSTOM_SECURITY_MANAGER = AADSecurityManager

    extraVolumes: 
    - name: azure-secrets-store
     csi:
       driver: secrets-store.csi.k8s.io
       readOnly: true
       volumeAttributes:
         secretProviderClass: azure-secret-provider
        
    extraVolumeMounts: 
    - mountPath: "/mnt/azure-secrets"
     name: azure-secrets-store
     readOnly: true

    extraEnvRaw:
    - name: AZURE_SECRET
     valueFrom:
       secretKeyRef:
         name: azure-kv-secrets
         key: AZURE_SECRET
    ```
## Redeploy Superset

   ```bash
   helm repo update
   helm upgrade --install --values values.yaml superset superset/superset
   ```

## Next Steps

* [Role Based Access Control](./role-based-access-control.md)
