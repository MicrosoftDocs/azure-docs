---
title: Authenticate with Azure Container Registry from Azure Kubernetes Service
description: Learn how to provide access to images in your private Azure container registry from Azure Kubernetes Service by using an Azure Active Directory service principal.
services: container-service
author: dlepow
manager: gwallace

ms.service: container-service
ms.topic: article
ms.date: 09/26/2019
ms.author: danlep
---

# Authenticate with Azure Container Registry from Azure Kubernetes Service

When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), an authentication mechanism needs to be established. This article details the recommended configurations for authentication between these two Azure services. Configure an authentication method suitable for your environment:

* [Grant access using the AKS service principal](#grant-aks-access-to-acr) - this method is most common
* [Grant access by configuring a Kubernetes secret](#access-with-kubernetes-secret)

This article assumes that you've already created an AKS cluster and you are able to access the cluster with the `kubectl` command-line client. If instead you want to create a cluster and configure access to a container registry at cluster creation time, see [Tutorial: Deploy an AKS cluster](../aks/tutorial-kubernetes-deploy-cluster.md) or [Authenticate with Azure Container Registry from Azure Kubernetes Service](../aks/cluster-container-registry-integration.md).

This article assumes that you've already created an AKS cluster and you are able to access the cluster with the `kubectl` command-line client. If instead you want to create a cluster and configure access to a container registry at cluster creation time, see [Tutorial: Deploy an AKS cluster](../aks/tutorial-kubernetes-deploy-cluster.md) or [Authenticate with Azure Container Registry from Azure Kubernetes Service](../aks/cluster-container-registry-integration.md).

## Grant AKS access to ACR

When you create an AKS cluster, Azure also creates a service principal to support cluster operability with other Azure resources. You can use this auto-generated service principal for authentication with an ACR registry. To do so, you need to create an Azure AD [role assignment](../role-based-access-control/overview.md#role-assignments) that grants the cluster's service principal access to the registry.

Use the following script to grant the AKS-generated service principal pull access to an Azure container registry. Modify the `AKS_*` and `ACR_*` variables for your environment before running the script.

> [!NOTE]
> Assigning a role to a service principal requires your Azure AD account to have write permission to your Azure AD tenant. See [Required permissions](../active-directory/develop/howto-create-service-principal-portal.md#required-permissions). In some instances, due to your organization's security model, you might not be able to assign the required role to the auto-generated AKS service principal granting it access to ACR. An alternative is to [Grant access by configuring a Kubernetes secret](#access-with-kubernetes-secret). 

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
az role assignment create --assignee $CLIENT_ID --role acrpull --scope $ACR_ID
```

## Access with Kubernetes secret

If you can't assign the required role to the AKS service principal, you might be able to create or use registry credentials to access the registry. Then, configure the credentials in a Kubernetes [image pull secret](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/). 

This section shows two options:

* [Create a service principal](#create-a-service-principal)
* [Use registry admin credentials](#use-registry admin-credentials)

### Create a service principal

If you have sufficient permissions, create a new Azure AD service principal and grant it pull access to an Azure container registry. For example, use the following Azure CLI script. Modify the `ACR_NAME` variable for your environment before running the script. For background, see [Azure Container Registry authentication with service principals](../container-registry/container-registry-auth-service-principal.md#create-a-service-principal)

> [!NOTE]
> To create an Azure AD service principal, you must have permissions to register an application with your Azure AD tenant, and to assign the application to a role in your subscription. If you don't have the necessary permissions, you might need to ask your Azure AD or subscription administrator to assign the necessary permissions, or pre-create a service principal for you to use.

```bash
#!/bin/bash

ACR_NAME=myacrinstance
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Populate the ACR login server and resource id.
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create acrpull role assignment with a scope of the ACR resource.
SP_PASSWD=$(az ad sp create-for-rbac --name http://$SERVICE_PRINCIPAL_NAME --role acrpull --scopes $ACR_REGISTRY_ID --query password --output tsv)

# Get the service principal client id.
CLIENT_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output used when creating Kubernetes secret.
echo "Service principal ID: $CLIENT_ID"
echo "Service principal password: $SP_PASSWD"
```

### Use registry admin credentials

Each container registry includes an [admin user account](../container-registry/container-registry-authentication#admin-account.md), which is disabled by default. 


### Store credentials in pull secret

You can now store the registry credentials in a Kubernetes [image pull secret][image-pull-secret], which your AKS cluster will reference when running containers.

Use the following **kubectl** command to create the Kubernetes secret. Replace `<acr-login-server>` with the fully qualified name of your Azure container registry (it's in the format "acrname.azurecr.io"). Replace `<service-principal-ID>` and `<service-principal-password>` with the values you obtained by running the previous script. Replace `<email-address>` with any well-formed email address.

```bash
kubectl create secret docker-registry acr-auth --docker-server <acr-login-server> --docker-username <service-principal-ID> --docker-password <service-principal-password> --docker-email <email-address>
```



### Use secret in pod deployments

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
