---
title: Publish revisions with GitHub Actions in Azure Container Apps
description: Learn to automatically create new revisions using GitHub Actions in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 12/30/2021
ms.author: cshoe
---

# Publish revisions with GitHub Actions in Azure Container Apps

Azure Container Apps allows you to use GitHub Actions to publish [revisions](revisions.md) to your container app. As commits are pushed to your GitHub repository, a GitHub Actions is triggered which updates the [container](containers.md) image in the container registry. Once the container is updated in the registry, Azure Container Apps creates a new revision based on the updated container image.

:::image type="content" source="media/github-actions/azure-container-apps-github-actions.png" alt-text="Changes to a GitHub repo trigger an action to create a new revision.":::

The GitHub Actions is triggered by commits to a specific branch in your repository. When creating the integration link, you decide which branch triggers the action.

## Authentication

When adding or removing a GitHub Actions integration, you can authenticate by either passing in a GitHub [personal access token](https://docs.github.com/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token), or using the interactive GitHub login experience. The interactive experience opens a form in your web browser and gives you the opportunity to log in to GitHub. Once successfully authenticated, then a token is passed back to the CLI that is used by GitHub for the rest of the current session.

- To pass a personal access token, use the `--token` parameter and provide a token value.
- If you choose to use interactive login, use the `--login-with-github` parameter with no value.

> [!Note]
> Your GitHub personal access token needs to have the `workflow` scope selected.

## Add

The `containerapp github-action add` command creates a GitHub Actions integration with your container app.

> [!Note]
> Before you proceed with the example below, you must have your first container app already deployed.

The first time you attach GitHub Actions to your container app, you need to provide a service principal context. The following command shows you how to create a service principal.

# [Bash](#tab/bash)

```azurecli
az ad sp create-for-rbac \
  --name <SERVICE_PRINCIPAL_NAME> \
  --role "contributor" \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME> \
  --sdk-auth
```

# [PowerShell](#tab/powershell)

```azurecli
az ad sp create-for-rbac `
  --name <SERVICE_PRINCIPAL_NAME> `
  --role "contributor" `
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP_NAME> `
  --sdk-auth
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

The return value from this command is a JSON payload, which includes the service principal's `tenantId`, `clientId`, and `clientSecret`.

The following example shows you how to add an integration while using a personal access token.

# [Bash](#tab/bash)

```azurecli
az containerapp github-action add \
  --repo-url "https://github.com/<OWNER>/<REPOSITORY_NAME>" \
  --context-path "./dockerfile" \
  --branch <BRANCH_NAME> \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --registry-url <URL_TO_CONTAINER_REGISTRY> \
  --registry-username <REGISTRY_USER_NAME> \
  --registry-password <REGISTRY_PASSWORD> \
  --service-principal-client-id <CLIENT_ID> \
  --service-principal-client-secret <CLIENT_SECRET> \
  --service-principal-tenant-id <TENANT_ID> \
  --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp github-action add `
  --repo-url "https://github.com/<OWNER>/<REPOSITORY_NAME>" `
  --context-path "./dockerfile" `
  --branch <BRANCH_NAME> `
  --name <CONTAINER_APP_NAME> `
  --resource-group <RESOURCE_GROUP> `
  --registry-url <URL_TO_CONTAINER_REGISTRY> `
  --registry-username <REGISTRY_USER_NAME> `
  --registry-password <REGISTRY_PASSWORD> `
  --service-principal-client-id <CLIENT_ID> `
  --service-principal-client-secret <CLIENT_SECRET> `
  --service-principal-tenant-id <TENANT_ID> `
  --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Show

The `containerapp github-action show` command returns the  GitHub Actions configuration settings for a container app.

This example shows how to add an integration while using the personal access token.

# [Bash](#tab/bash)

```azurecli
az containerapp github-action show \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp github-action show `
  --resource-group <RESOURCE_GROUP_NAME> `
  --name <CONTAINER_APP_NAME>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

This command returns a JSON payload with the GitHub Actions integration configuration settings.

## Delete

The `containerapp github-action delete` command removes the GitHub Actions from the container app.

# [Bash](#tab/bash)

```azurecli
az containerapp github-action delete \
  --resource-group <RESOURCE_GROUP_NAME> \
  --name <CONTAINER_APP_NAME> \
  --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
```

# [PowerShell](#tab/powershell)

```azurecli
az containerapp github-action delete `
  --resource-group <RESOURCE_GROUP_NAME> `
  --name <CONTAINER_APP_NAME> `
  --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
```

---

As you interact with this example, replace the placeholders surrounded by `<>` with your values.
