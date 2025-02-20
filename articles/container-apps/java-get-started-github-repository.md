---
title: Launch your First Java Application in Azure Container Apps by Using a GitHub Repository
description: Learn how to deploy a java project in Azure Container Apps by using a GitHub Repository.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 02/18/2025
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps by using a GitHub Repository

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps by using a Github Repository.

[!INCLUDE [introduction-to-pet-clinic-deployment](includes/introduction-to-pet-clinic-deployment.md)]

## Prerequisites

[!INCLUDE [pet-clinic-prerequisites](includes/pet-clinic-prerequisites.md)]

## Install the Container Apps CLI extension

[!INCLUDE [pet-clinic-install-azure-container-apps-cli-extension](includes/pet-clinic-install-azure-container-apps-cli-extension.md)]

## Prepare the project

In a browser window, go to the GitHub repository for [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples.git), and fork the repository.

Select the `Fork` button at the top of the repo to fork the repo to your account. Then copy the repo URL to use it in the next step.

## Deploy the project

[!INCLUDE [Deploy-pet-clinic-app](includes/Deploy-pet-clinic-app.md)]

 ```azurecli
az containerapp up \
    --resource-group $RESOURCE_GROUP \
    --name $CONTAINER_APP_NAME \
    --location $LOCATION \
    --environment $ENVIRONMENT \
    --context-path ./spring-petclinic \
    --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

When you push new code to the repository, the GitHub Action does the following things:

- Builds the container image and pushes it to the Azure Container Registry.
- Deploys the container image to the created container app.

## Verify the app status

[!INCLUDE [pet-clinic-verify-app-status](includes/pet-clinic-verify-app-status.md)]

## Clean up resources

[!INCLUDE [pet-clinic-clean-up-resources](includes/pet-clinic-clean-up-resources.md)]

## Next steps

[!INCLUDE [java-app-quickstart-deployment-next-steps](includes/java-app-quickstart-deployment-next-steps.md)]