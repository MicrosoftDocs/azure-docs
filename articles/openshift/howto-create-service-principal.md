---
title: Creating and using a service principal with an Azure Red Hat OpenShift cluster
description: In this how-to article, learn how to create and use a service principal with an Azure Red Hat OpenShift cluster using Azure CLI or the Azure portal.
author: johnmarco
ms.service: azure-redhat-openshift
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: johnmarc
ms.date: 10/18/2022
topic: how-to
keywords: azure, openshift, aro, red hat, azure CLI, azure portal
zone_pivot_groups: azure-red-hat-openshift-service-principal
#Customer intent: I need to create and use an Azure service principal to restrict permissions to my Azure Red Hat OpenShift cluster.
---

# Create and use a service principal to deploy an Azure Red Hat OpenShift cluster

To interact with Azure APIs, an Azure Red Hat OpenShift cluster requires an Azure Active Directory (AD) service principal. This service principal is used to dynamically create, manage, or access other Azure resources, such as an Azure load balancer or an Azure Container Registry (ACR). For more information, see [Application and service principal objects in Azure Active Directory](../active-directory/develop/app-objects-and-service-principals.md).

This article explains how to create and use a service principal to deploy your Azure Red Hat OpenShift clusters using the Azure command-line interface (Azure CLI) or the Azure portal.  

> [!NOTE]
> Service principals expire in one year unless configured for longer periods. For information on extending your service principal expiration period, see [Rotate service principal credentials for your Azure Red Hat OpenShift (ARO) Cluster](howto-service-principal-credential-rotation.md).

::: zone pivot="aro-azurecli"

## Create and use a service principal

The following sections explain how to create and use a service principal to deploy an Azure Red Hat OpenShift cluster. 

## Prerequisites - Azure CLI

If you’re using the Azure CLI, you’ll need Azure CLI version 2.30.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Create a resource group - Azure CLI

Run the following Azure CLI command to create a resource group in which your Azure Red Hat OpenShift cluster will reside.

```azurecli-interactive
AZ_RG=$(az group create -n test-aro-rg -l eastus2 --query name -o tsv)
```

## Create a service principal and assign role-based access control (RBAC) - Azure CLI

 To assign the contributor role and scope the service principal to the Azure Red Hat OpenShift resource group, run the following command.

```azurecli-interactive
# Get Azure subscription ID
AZ_SUB_ID=$(az account show --query id -o tsv) 
# Create a service principal with contributor role and scoped to the Azure Red Hat OpenShift resource group 
az ad sp create-for-rbac -n "test-aro-SP" --role contributor --scopes "/subscriptions/${AZ_SUB_ID}/resourceGroups/${AZ_RG}"
```

> [!NOTE]
> 
> Service principals must be unique per Azure RedHat OpenShift (ARO) Cluster.

The output is similar to the following example:

```
{ 

  "appId": "", 

  "displayName": "myAROClusterServicePrincipal", 

  "name": "http://myAROClusterServicePrincipal", 

  "password": "yourpassword", 

  "tenant": "yourtenantname"

}
``` 
 
> [!IMPORTANT]
> This service principal only allows a contributor over the resource group the Azure Red Hat OpenShift cluster is located in. If your VNet is in another resource group, you need to assign the service principal contributor role to that resource group as well. You also need to create your Azure Red Hat OpenShift cluster in the resource group you created above.

To grant permissions to an existing service principal with the Azure portal, see [Create an Azure AD app and service principal in the portal](../active-directory/develop/howto-create-service-principal-portal.md#configure-access-policies-on-resources).

::: zone-end

::: zone pivot="aro-azureportal"

## Create a service principal with the Azure portal

To create a service principal for your Azure Red Hat OpenShift cluster via the Azure portal, see [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md). **Be sure to save the Application (client) ID and the secret.**



::: zone-end
