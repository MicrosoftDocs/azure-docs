---
title: Creating and using a service principal with an Azure Red Hat OpenShift cluster
description: In this how-to article, learn how to create a service principal with an Azure Red Hat OpenShift cluster using Azure CLI or the Azure portal.
author: rahulm23
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: rahulmehta
ms.date: 03/21/2022
topic: how-to
keywords: azure, openshift, aro, red hat, azure CLI, azure portal
#Customer intent: I need to create and use an Azure service principal to restrict permissions to my Azure Red Hat OpenShift cluster.
zone_pivot_groups: azure-red-hat-openshift-service-principal
---

# Create and use a service principal with an Azure Red Hat OpenShift cluster

To interact with Azure APIs, an Azure Red Hat OpenShift cluster requires an Azure Active Directory (AD) service principal. This service principal is used to dynamically create, manage, or access other Azure resources, such as an Azure load balancer or an Azure Container Registry (ACR). For more information, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md).

This article explains how to create and use a service principal for your Azure Red Hat OpenShift clusters using the Azure command-line interface (Azure CLI) or the Azure portal.

## Before you begin  

The user creating an Azure AD service principal must have permissions to register an application with your Azure AD tenant and to assign the application to a role in your subscription. You need **User Access Administrator** and **Contributor** permissions at the resource-group level to create service principals.

Use the following Azure CLI command to add these permissions.

```azurecli-interactive
az role assignment create \
    --role 'User Access Administrator' \
    --assignee-object-id $SP_OBJECT_ID \ 
    --resource-group $RESOURCEGROUP \
    --assignee-principal-type 'ServicePrincipal'

az role assignment create \
    --role 'Contributor' \
    --assignee-object-id $SP_OBJECT_ID \
    --resource-group $RESOURCEGROUP \
    --assignee-principal-type 'ServicePrincipal'
```

If you don't have the required permissions, you can ask your Azure AD or subscription administrator to assign them. Alternatively, your Azure AD or subscription administrator can create a service principal in advance for you to use with the Azure Red Hat OpenShift cluster. 

If you're using a service principal from a different Azure AD tenant, there are more considerations regarding the permissions available when you deploy the cluster. For example, you may not have the appropriate permissions to read and write directory information. 

For more information on user roles and permissions, see [What are the default user permissions in Azure Active Directory?](../active-directory/fundamentals/users-default-permissions.md).

> [!NOTE]
> Service principals expire in one year unless configured for longer periods. For information on extending your service principal expiration period, see [Rotate service principal credentials for your Azure Red Hat OpenShift (ARO) Cluster](howto-service-principal-credential-rotation.md).

::: zone pivot="aro-azurecli"

## Create a service principal with Azure CLI

The following sections explain how to use the Azure CLI to create a service principal for your Azure Red Hat OpenShift cluster.

## Prerequisite

If you’re using the Azure CLI, you’ll need Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
 

## Create a service principal - Azure CLI

 To create a service principal with the Azure CLI, run the `az ad sp create-for-rbac` command. 

> [!NOTE]
> When using a service principal to create a new cluster, you may need to assign a Contributor role here. 

```azure-cli
az ad sp create-for-rbac --name myAROClusterServicePrincipal 
```

The output is similar to the following example.

```
{ 

  "appId": "", 

  "displayName": "myAROClusterServicePrincipal", 

  "name": "http://myAROClusterServicePrincipal", 

  "password": "", 

  "tenant": "" 

}
``` 

Retain your `appId` and `password`. These values are used when you create an Azure Red Hat OpenShift cluster below. 

## Grant permissions to the service principal - Azure CLI

Grant permissions to an existing service principal with Azure CLI, as shown in the following command.

```azurecli-interactive
az role assignment create \
    --role 'Contributor' \
    --assignee-object-id $SP_OBJECT_ID \ 
    --resource-group $RESOURCEGROUP \
    --assignee-principal-type 'ServicePrincipal'
```

## Use the service principal to create a cluster - Azure CLI

To use an existing service principal when you create an Azure Red Hat OpenShift cluster using the `az aro create` command, use the `--client-id` and `--client-secret` parameters to specify the appId and password from the output of the `az ad sp create-for-rbac` command: 

```azure-cli 
az aro create \ 

    --resource-group myResourceGroup \ 

    --name myAROCluster \ 

    --client-id <appID> \ 

    --client-secret <password> 
```

> [!IMPORTANT] 
> If you're using an existing service principal with a customized secret, ensure the secret doesn't exceed 190 bytes. 

::: zone-end

::: zone pivot="aro-azureportal"

## Create a service principal with the Azure portal

The following sections explain how to use the Azure portal to create a service principal for your Azure Red Hat OpenShift cluster.

## Create a service principal - Azure portal

To create a service principal using the Azure portal, see [Create an Azure AD app and service principal in the portal](../active-directory/develop/howto-create-service-principal-portal.md).

## Grant permissions to the service principal - Azure portal

To grant permissions to an existing service principal with the Azure portal, see [Create an Azure AD app and service principal in the portal](../active-directory/develop/howto-create-service-principal-portal.md#configure-access-policies-on-resources).

## Use the service principal - Azure portal

When deploying an Azure Red Hat OpenShift cluster using the Azure portal, configure the service principal on the **Authentication** page of the **Azure Red Hat OpenShift** dialog.

:::image type="content" source="./media/openshift-service-principal-portal.png" alt-text="Screenshot that shows how to use the Azure Red Hat service principal with Azure portal to create a cluster." lightbox="./media/openshift-service-principal-portal.png":::

Specify the following values, and then select **Review + Create**.

In the **Service principal information** section:

- **Service principal client ID** is your appId. 
- **Service principal client secret** is the service principal's decrypted Secret value.

In the **Cluster pull secret** section:

- **Pull secret** is your cluster's pull secret's decrypted value.
::: zone-end