---
title: Authenticate with Azure Container Registry from Azure Kubernetes Service
description: Learn how to provide access to images in your private container registry from Azure Kubernetes Service by using an Azure Active Directory service principal.
services: container-service
author: dlepow

ms.service: container-service
ms.topic: article
ms.date: 08/08/2018
ms.author: danlep
---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. This article details the recommended configurations for authentication between these two Azure services.

## Grant AKS access to ACR

When you create an AKS cluster, Azure also creates a service principal to support cluster operability with other Azure resources. You can use this auto-generated service principal for authentication with an ACR registry. To do so, you need to create an Azure AD [role assignment](../role-based-access-control/overview.md#role-assignments) that grants the cluster's service principal access to the container registry.

Use the following script to grant the AKS-generated service principal access to an Azure container registry. Modify the `AKS_*` and `ACR_*` variables for your environment before running the script.

```bash
#!/bin/bash

AKS_RESOURCE_GROUP=myAKSResourceGroup
AKS_CLUSTER_NAME=myAKSCluster
ACR_RESOURCE_GROUP=myACRResourceGroup
ACR_NAME=myACRRegistry

# Get the id of the service principal configured for AKS
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "servicePrincipalProfile.clientId" --output tsv)

# Get the ACR registry resource id
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $ACR_RESOURCE_GROUP --query "id" --output tsv)

# Create role assignment
az role assignment create --assignee $CLIENT_ID --role Reader --scope $ACR_ID
```

## Access with Kubernetes secret

In some instances, you might not be able to assign the required role to the auto-generated AKS service principal granting it access to ACR. For example, due to your organization's security model, you might not have sufficient permission in your Azure AD directory to assign a role to the AKS-generated service principal. In such a case, you can create a new service principal, then grant it access to the container registry using a Kubernetes image pull secret.

Use the following script to create a new service principal (you'll use its credentials for the Kubernetes image pull secret). Modify the `ACR_NAME` variable for your environment before running the script.

```bash
#!/bin/bash

ACR_NAME=myacrinstance
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Populate the ACR login server and resource id.
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create a 'Reader' role assignment with a scope of the ACR resource.
SP_PASSWD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --role Reader --scopes $ACR_REGISTRY_ID --query password --output tsv)

# Get the service principal client id.
CLIENT_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output used when creating Kubernetes secret.
echo "Service principal ID: $CLIENT_ID"
echo "Service principal password: $SP_PASSWD"
```

You can now store the service principal's credentials in a Kubernetes [image pull secret][image-pull-secret], which your AKS cluster will reference when running containers.

Use the following **kubectl** command to create the Kubernetes secret. Replace `<acr-login-server>` with the fully qualified name of your Azure container registry (it's in the format "acrname.azurecr.io"). Replace `<service-principal-ID>` and `<service-principal-password>` with the values you obtained by running the previous script. Replace `<email-address>` with any well-formed email address.

```bash
kubectl create secret docker-registry acr-auth --docker-server <acr-login-server> --docker-username <service-principal-ID> --docker-password <service-principal-password> --docker-email <email-address>
```

You can now use the Kubernetes secret in pod deployments by specifying its name (in this case, "acr-auth") in the `imagePullSecrets` parameter:

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: acr-auth-example
spec:
  template:
    metadata:
      labels:
        app: acr-auth-example
    spec:
      containers:
      - name: acr-auth-example
        image: myacrregistry.azurecr.io/acr-auth-example
      imagePullSecrets:
      - name: acr-auth
```

<!-- LINKS - external -->
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[image-pull-secret]: https://kubernetes.io/docs/concepts/configuration/secret/#using-imagepullsecrets
