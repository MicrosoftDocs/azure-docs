## Service principal

Azure Active Directory *service principals* provide access to Azure resources within your subscription. Think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs access to the resources.

You can configure a service principal with access rights scoped only to those resources you specify. Then, you can configure your application or service to use the service principal's credentials to access those resources.

## Create a service principal

In the context of Azure Container Registry, you can create an Azure AD service principal with pull, push and pull, or owner permissions to your private Docker registry in Azure.

You can use the following script to create a service principal with access to your container registry. Update the `ACR_NAME` variable with the name of your container registry, and optionally the `--role` value in the last command to specify different permissions. By default, the script configures the service principal for both *push* and *pull* permissions.

```bash
#!/bin/bash

# Modify for your environment. The ACR_NAME is the name of your Azure Container
# Registry, and the SERVICE_PRINCIPAL_NAME can be any unique name within your
# subscription (you can use the default below).
ACR_NAME=myregistryname
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Available role assignments for the service principal, and the permissions they
# provide to the registry.
PUSH_AND_PULL=contributor
PULL_ONLY=reader
OWNER=owner

# Populate some values required for subsequent command args
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create the service principal with rights scoped to the registry.
# Default permissions are for both docker push and pull access. Modify the
# '--role' argument value as desired.
SP_PASSWD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --role $PUSH_AND_PULL --scopes $ACR_REGISTRY_ID --query password --output tsv)
SP_APP_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output the service principal's credentials; use these in your services and
# applications to authenticate to the container registry.
echo "Service principal ID: $SP_APP_ID"
echo "Service principal password: $SP_PASSWD"
```

Now that you have the service principal's credentials, you can use them in your applications and services to interact with your container registry.