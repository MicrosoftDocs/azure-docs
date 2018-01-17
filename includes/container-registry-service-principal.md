## Create a service principal

In the context of Azure Container Registry, you can create an Azure AD service principal with pull, push and pull, or owner permissions to your private Docker registry in Azure.

You can use the following script to create a service principal with access to your container registry. Update the `ACR_NAME` variable with the name of your container registry, and optionally the `--role` value in the [az ad sp create-for-rbac][az-ad-sp-create-for-rbac] command to specify different permissions. By default, the script configures the service principal for both *push* and *pull* permissions.

```bash
#!/bin/bash

# Modify for your environment. The ACR_NAME is the name of your Azure Container
# Registry, and the SERVICE_PRINCIPAL_NAME can be any unique name within your
# subscription (you can use the default below).
ACR_NAME=myregistryname
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Populate some values required for subsequent command args
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create the service principal with rights scoped to the registry.
# Default permissions are for both docker push and pull access. Modify the
# '--role' argument value as desired:
# reader:      pull only
# contributor: push and pull
# owner:       push, pull, and assign roles
SP_PASSWD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --role contributor --scopes $ACR_REGISTRY_ID --query password --output tsv)
SP_APP_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output the service principal's credentials; use these in your services and
# applications to authenticate to the container registry.
echo "Service principal ID: $SP_APP_ID"
echo "Service principal password: $SP_PASSWD"
```

After you run the script, take note of the service principal's **ID** and **password**. Now that you have its credentials, you can configure your applications and services to authenticate to your container registry as the service principal.

## Use an existing service principal

In addition to creating a new service principal with rights to your registry, you can grant rights to an existing service principal. For example, you might want to grant rights to a service principal created for you when you created an AKS cluster.



<!-- LINKS - Internal -->
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac