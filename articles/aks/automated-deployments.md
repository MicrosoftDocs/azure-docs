---
title: Automated deployments for Azure Kubernetes Service (Preview)
description: Learn how to use automated deployments to simplify the process of adding GitHub Actions to your Azure Kubernetes Service (AKS) project
ms.author: qpetraroia
ms.topic: tutorial
ms.date: 7/21/2022
author: qpetraroia
---

# Automated Deployments for Azure Kubernetes Service (Preview)

Automated deployments simplify the process of setting up a GitHub Action and creating an automated pipeline for your code releases to your Azure Kubernetes Service (AKS) cluster. Once connected, every new commit will kick off the pipeline, resulting in your application being updated.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

> [!NOTE]
> This feature is not yet available in all regions.

## Prerequisites

* A GitHub account.
* An AKS cluster.
* An Azure Container Registry (ACR)

## Deploy an application to your AKS cluster

1. In the Azure portal, navigate to the resource group containing the AKS cluster you want to deploy the application to.

1. Select your AKS cluster, and then select **Automated deployments (preview)** on the left blade. Select **Create an automated deployment**.

    :::image type="content" source="media/automated-deployments/ad-homescreen.png" alt-text="The automated deployments screen in the Azure portal."  lightbox="media/automated-deployments/ad-homescreen-expanded.png":::

1. Name your workflow and click **Authorize** to connect your Azure account with your GitHub account. After your accounts are linked, choose which repository and branch you would like to create the GitHub Action for.

    - **GitHub**: Authorize and select the repository for your GitHub account.

        :::image type="content" source="media/automated-deployments/ad-ghactivate-repo.png" alt-text="The authorize and repository selection screen." lightbox="media/automated-deployments/ad-ghactivate-repo-expanded.png":::

1. Pick your dockerfile and your ACR and image.

    :::image type="content" source="media/automated-deployments/ad-image.png" alt-text="The image selection screen." lightbox="media/automated-deployments/ad-image-expanded.png":::

1. Determine whether you'll deploy with Helm or regular Kubernetes manifests. Once decided, pick the appropriate deployment files from your repository and decide which namespace you want to deploy into.

    :::image type="content" source="media/automated-deployments/ad-deployment-details.png" alt-text="The deployment details screen." lightbox="media/automated-deployments/ad-deployment-details-expanded.png":::

1. Review your deployment before creating the pull request.

1. Click **view pull request** to see your GitHub Action.

    :::image type="content" source="media/automated-deployments/ad-view-pr.png" alt-text="The final screen of the deployment process. The view pull request button is highlighted." lightbox="media/automated-deployments/ad-view-pr-expanded.png" :::

1. Merge the pull request to kick off the GitHub Action and deploy your application.

    :::image type="content" source="media/automated-deployments/ad-accept-pr.png" alt-text="The pull request page in GitHub. The merge pull request button is highlighted." lightbox="media/automated-deployments/ad-accept-pr-expanded.png" :::

1. Once your application is deployed, go back to automated deployments to see your history.

    :::image type="content" source="media/automated-deployments/ad-view-history.png" alt-text="The history screen in Azure portal, showing all the previous automated deployments." lightbox="media/automated-deployments/ad-view-history-expanded.png" :::

## Clean up resources

You can remove any related resources that you created when you don't need them anymore individually or by deleting the resource group to which they belong. To delete your automated deployment, navigate to the automated deployment dashboard and select **...**, then select **delete** and confirm your action.

## Next steps

You can modify these GitHub Actions to meet the needs of your team by opening them up in an editor like Visual Studio Code and changing them as you see fit.

Learn more about [GitHub Actions for Kubernetes][kubernetes-action].

<!-- LINKS -->
[kubernetes-action]: kubernetes-action.md
