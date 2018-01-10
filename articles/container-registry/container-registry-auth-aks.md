---
title: Authenticate with Azure Container Registry from Azure Container Service
description: Learn how to provide access to images in your private container registry from Azure Container Service by using an Azure Active Directory service principal.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 1/10/2018
ms.author: nepeters
---

# Authenticate with Azure Container Registry from Azure Container Service

Authentication between a Microsoft Azure Container Service (AKS) cluster and Microsoft Azure Container Registry (ACR) registry can be configured in a few different ways.

## Shared service principal scope

When you create an AKS cluster, an Azure Active Directory service principal is configured to work with the cluster. If the scope of this service principal also includes the ACR resource, authentication can occur with no further configuration. 

There are three ways to achieve this configuration.

1. Use the Azure CLI to create an AKS cluster without specifying a service principal. A service principal is generated with subscription scope, which includes the ACR registry.
2. Place the ACR resource in the same resource group as the AKS cluster resources.
3. Create a new role assignment for the AKS service principal with a scope of the ACR resource.

The following script can be used to complete method three as describe in the preceding text.

```bash
#!/bin/bash

# Modify for your environment.
AKS_RESOURCE_GROUP=myAKSCluster
AKS_CLUSTER_NAME=myAKSCluster
ACR_RESOURCE_GROUP=myACRInstance
ACR_NAME=myACRInstance

# Get the id of the service principal configured for AKS.
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "properties.servicePrincipalProfile.clientId" --output tsv)

# Get the ACR resource id.
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $ACR_RESOURCE_GROUP --query "id" --output tsv)

# Create a contributor role assignment for the AKS service principal, with a scope of the ACR resource. 
# The contributor role can be replaces with Owner or Read depending access requirements. 
az role assignment create --assignee $CLIENT_ID --role Contributor --scope $ACR_ID
```

## Access with Kubernetes secret

In many instances, the service principal being used by AKS is not scoped to the ACR registry. For these cases, you can create a unique service principal and scope it to only the ACR registry.

The following script can be used to create the service principal. 

```bash
#!/bin/bash

# Modify for your environment.
ACR_NAME=myacrinstance
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Populate the ACR login server and resource id. 
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create a contributor role assignment for the service principal, with a scope of the ACR resource. 
# The contributor role can be replaces with Owner or Read depending access requirements.
SP_PASSWD=$(az ad sp create-for-rbac --name $SERVICE_PRINCIPAL_NAME --role contributor --scopes $ACR_REGISTRY_ID --query password --output tsv)

# Get the service principle client id. This is used when creating the Kubernetes secret.
SP_APP_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)
```

The service principal credentials can now be stored in a Kubernetes [image pull secret][image-pull-secret]. The following example assumes that the previous script was used to create the service principal.

```bash
kubectl create secret docker-registry acr-auth --docker-server=https://$ACR_LOGIN_SERVER --docker-username=$SP_APP_ID --docker-password=$SP_PASSWD --docker-email=user@contoso.com
```

The Kubernetes secret can be used in a pod deployment using the `ImagePullSecrets` parameter. 

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata
  name: acr-auth-example
spec:
  template:
    metadata:
      labels:
        app: acr-auth-example
    spec:
      containers:
      - name: acr-auth-example
        image: mycontainerregistry.azurecr.io/acr-auth-example
      imagePullSecrets:
      - name: acr-auth
```

<!-- LINKS - external -->
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[image-pull-secret]: https://kubernetes.io/docs/concepts/configuration/secret/#using-imagepullsecrets