---
title: Using Azure Lockbox to manage customer data access
description: In this how-to article, learn how to use Azure Lockbox to review customer data access requests for Azure Red Hat Openshift.
author: johnmarco
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.author: johnmarc
ms.date: 10/26/2022
topic: how-to
keywords: azure, openshift, aro, red hat, lockbox
#Customer intent: I need to learn how to manage customer data requests for my Azure Red Hat Openshift installation.
---

# Manage customer data requests with Azure Lockbox

In some circumstances, a support agent at Microsoft or Red Hat may need access to a customer’s OpenShift clusters and Azure environment. The Azure Lockbox feature works with Azure Redhat OpenShift to provide customers a way to review and approve/reject customer data access requests. This ability can be particularly important for financial, government, or other regulatory industries where there is extra scrutiny regarding access to customer data.

With Azure Lockbox, whenever a support ticket is created, you have the ability to grant consent to Microsoft and Red Hat support agents to access your environment to troubleshoot and resolve issues. Azure Lockbox will tell you exactly what support agents are trying to access to help resolve your issues. 

## Access request process

1. The Azure Lockbox workflow consists of the following main steps:
1. A support ticket is opened from the Azure portal. The ticket is assigned to a customer support engineer at Microsoft or Red Hat.
1. The customer support engineer review the service request and determines the next steps to resolve the issue.
1. When the request requires direct access to customer data, a Customer Lockbox request is initiated. The request is now in a **Customer Notified** state, waiting for the customer's approval before granting access.
1. An email is sent from Microsoft to the customer, notifying them about the pending access request.
1. The customer signs in to the Azure portal to view the Lockbox request and can Approve or Deny the request.

As a result of the selection:

- Approve: Access is granted to the Microsoft engineer. The access is granted for a default period of eight hours.
- Deny: The elevated access request by the Microsoft engineer is rejected and no further action is taken.

See [Customer Lockbox--workflow](/azure/security/fundamentals/customer-lockbox-overview#workflow) for additional details about the access request process.

## Enable Lockbox for ARO

You can enable Customer Lockbox from the [Administration module](https://aka.ms/customerlockbox/administration) in the Customer Lockbox blade.

> [!NOTE]
> To enable Customer Lockbox, the user account needs to have the [Global Administrator role assigned](/azure/active-directory/roles/manage-roles-portal).







<!-->

Introduction

How it works

How to set it up

How to use it

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
-->
