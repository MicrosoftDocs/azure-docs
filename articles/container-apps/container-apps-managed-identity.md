---
title: Managed identity in Container Apps
description: Using Managed identity in Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: quickstart
ms.date: 02/08/2022
ms.author: v-bcatherine

---

# Managed Identities in Azure Container Apps Preview

Azure Container Apps Preview supports Azure   Use [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) to run code in Azure Container Apps that interacts with other Azure services - without maintaining any secrets or credentials in code. 

Managed identities are applied to the container app.  You can configure a single system-assigned identity and multiple user-assigned identities to each container app.

??? Is there a used case for this in container apps?

## Why use a managed identity?

Use a managed identity in a running container app to authenticate to any [service that supports Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication) without managing credentials in your container code. For services that don't support AD authentication, you can store secrets in an Azure key vault and use the managed identity to access the key vault to retrieve credentials. For more information about using a managed identity, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)


## Limitations

There are a few current limitations that will be addressed in future releases.

* You can't use a managed identity to pull an image from Azure Container Registry when creating a container app. The identity is only available within a running container.
* Currently, you can't use managed identity in scaling rules.  For resources such as, storage queue that require a connection string, those will still need to be defined in the`secretref` of the scaling rule.


## How to use managed identities


There are different ways to configure managed identities.  

* You can add managed identities to your ARM template
* You can add and delete managed identities via the Azure portal
* You can add and delete managed identities via the Azure CLI

???What happens to the container when an identity is adding or deleted to a running app.  Will this cause a restart of the container app?


### Azure Portal

#### Adding a system-assigned identity

#### Adding a user-assigned identity

#### Deleting a managed identity


### Azure CLI

??? is there much difference between adding/deleting a user or system assigned identity.  Can we just say it's no difference, except that when you add a user assigned identity that already exists, your container app will not fail when it is first deployed.

#### Adding a managed identity

### ARM/Bicep template example

You can add managed identity to your container app ARM or Bicep template.

??? are we going to have a Bicep example as well?

#### Deleting a managed identity



#### Creating system-assigned managed identity

#### Deleting a system-assigned managed identity

#### Creating a user-assigned managed identity

#### Deleting a user

### ARM/Bicep Template



