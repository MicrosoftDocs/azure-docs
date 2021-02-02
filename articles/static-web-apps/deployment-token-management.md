---
title: Deployment token management in Azure Static Web Apps
description: Manage tokens in an Azure Static Web Apps site
services: static-web-apps
author: webmaxru
ms.author: masalnik
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 1/31/2021
---

# Deployment token management in Azure Static Web Apps

When you create a new Azure Static Web App resource, Azure generates a deployment token to authenticate when making a deployment and to identify which Static Web App resource you're deploying to. As a part of provisioning, the corresponding secret is automatically created in the linked GitHub repository and its value is set to the Static Web App's deployment token. This article details the way to manage and use this token.

Normally, you don't need to worry about the deployment token. Some reasons you might need to retrieve or reset the token are:

* You want to deploy to the Static Web App resource from another GitHub repository. Then in addition to setting up your GitHub workflow in the new repository, you also need to retrieve the deployment token and create a secret there.
* Your token has been compromised. You need to reset your token. The guide below will demonstrate how to do it.

## Prerequisites

- An existing GitHub repository configured with Azure Static Web Apps. See [Building your first static app](getting-started.md) if you don't have one.

## Reset a deployment token

1. Click on **Manage deployment token** link on the _Overview_ page of your Azure Static Web App resource.

    :::image type="content" source="./media/deployment-token-management/manage-deployment-token-button.png" alt-text="Managing deployment token":::

1. Click on the **Reset token** button.

    :::image type="content" source="./media/deployment-token-management/manage-deployment-token.png" alt-text="Resetting deployment token":::

1. After displaying a new token in the _Deployment token_ field, copy the token by clicking **Copy to clipboard** icon.


## Update a secret in the GitHub repository

To keep automated deployment running, after resetting a token you need to set its new value in the corresponding GitHub repository.

1. Navigate to your project's repository on GitHub, then click on the **Settings** tab and **Secrets** menu item. You will find a secret generated during Static Web App provisioning named _AZURE_STATIC_WEB_APPS_API_TOKEN_... in the _Repository secrets_ section.

    :::image type="content" source="./media/deployment-token-management/github-repo-secrets.png" alt-text="Listing repository secrets":::

    > [!NOTE]
    > If you created Azure Static Web App resources against multiple branches of this repository, you will see multiple _AZURE_STATIC_WEB_APPS_API_TOKEN_... secrets in this list . To pick the right one, check the file name listed in the _Edit workflow_ field on the _Overview_ tab of the Azure Static Web App resource.

1. Click on the **Update** button, paste the value of the deployment token to the _Value_ field and click **Update secret**.

    :::image type="content" source="./media/deployment-token-management/github-update-secret.png" alt-text="Updating repository secret":::

## Next steps

> [!div class="nextstepaction"]
> [Setup local development](local-development.md)