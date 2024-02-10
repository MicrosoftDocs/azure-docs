---
title: Enable a token store in Azure Container Apps
description: Learn to secure authentication tokens independent of your application.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 02/07/2024
ms.author: cshoe
---

# Enable a token store in Azure Container Apps

Token stores are a repository for security tokens associated with your container app. When you use a store, your app is better able to achieve:

- **Portability**:  With authentication details stored independently of your application, you can easily switch the user security context as you move from development, to staging, to production.

- **Fault tolerance**: With your authentication data isolated from each container, your security profile is stable even if your container experiences problems.

- **Centralized security**: With your security stored together, you can maintain your app's security tokens in a single place.

## Create a token store

Use the following steps to create a token store for your container app.

### Prerequisites

Before you can create a token store for your container app, you first need the following items.

| Prerequisite | Details |
|---|---|
| Azure Storage account | Azure Storage account |
| Storage container | Private container with read, add, create, write, delete, list, and immutable storage permissions. |
| Storage account Share Access Signature (SAS) URL | keep it alive |

> [!IMPORTANT]
> Keep your SAS alive

### Link the token store to your container app

Use the `containerapp auth update` command to associate your Azure Storage account to your container app and create the token store.

In this example, you put your values in place of the placeholder tokens surrounded by `<>` brackets.

```azurecli
az containerapp auth update \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME> \
  --sas-url-secret-name <SAS_SECRET_NAME> \
  --token-store true
```

If you would like to create your store using an ARM template, use the following example.

```json
{}
```

## Next steps

> [!div class="nextstepaction"]
> [Customize sign in and sign out](authentication#customize-sign-in-and-sign-out.md)