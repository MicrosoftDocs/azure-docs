---
title: Reset deployment tokens in Azure Static Web Apps
description: Reset tokens in an Azure Static Web Apps site
services: static-web-apps
author: v1212
ms.author: wujia
ms.service: azure-static-web-apps
ms.topic:  conceptual
ms.date: 10/02/2024
---

# Reset deployment tokens in Azure Static Web Apps

When you create a new Azure Static Web Apps site, Azure generates a token used to identify the application during deployment. During provisioning, this token is stored as a secret in the GitHub repository. This article explains how to use and manage this token.

Normally, you don't need to worry about the deployment token, but the following are some reasons you might need to retrieve or reset the token.

* **Token compromise**: Reset your token if it is exposed to an outside party.

* **Deploying from a separate GitHub repository**: If you are manually deploying from a separate GitHub repository, then you need to set the deployment token in the new repository.

## Prerequisites

- An existing GitHub repository configured with Azure Static Web Apps.
- See [Building your first static app](getting-started.md) if you don't have one.

## Reset a deployment token

1. Select **Manage deployment token** on the _Overview_ page of your Azure Static Web Apps site.

    :::image type="content" source="./media/deployment-token-management/manage-deployment-token-button.png" alt-text="Managing deployment token":::

2. Select **Reset token**.

3. After displaying a new token in the _Deployment token_ field, copy the token by selecting **Copy to clipboard**.

## Update a secret in the GitHub repository

To keep automated deployment running, after resetting a token you need to set the new value in the corresponding GitHub repository.

1. Go to your project's repository on GitHub, and select the **Settings** tab.

1. Under the *Security* section, select **Actions**.  

1. Find a secret generated during Static Web App provisioning named _AZURE_STATIC_WEB_APPS_API_TOKEN_... in the _Repository secrets_ section.

    > [!NOTE]
    > If you created the Azure Static Web Apps site against multiple branches of this repository, you see multiple _AZURE_STATIC_WEB_APPS_API_TOKEN_... secrets in this list. Select the correct one by matching the file name listed in the _Edit workflow_ field on the _Overview_ tab of the Static Web Apps site.

1. Select pen icon button to update the value.

1. **Paste the value** of the deployment token to the _Value_ field.

1. Select **Update secret**.

## Next steps

> [!div class="nextstepaction"]
> [Publish from a static site generator](publish-gatsby.md)
