---
title: Launch your First Java Application in Azure Container Apps Using a GitHub Repository
description: Learn how to deploy a Java project in Azure Container Apps using a GitHub Repository.
services: container-apps
author: KarlErickson
ms.author: karler
ms.reviewer: hangwan
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 03/05/2025
---

# Quickstart: Launch your first Java application in Azure Container Apps using a GitHub Repository

This article shows you how to deploy the Spring PetClinic sample application to Azure Container Apps using a GitHub repository.

[!INCLUDE [java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension](includes/java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension.md)]

## Prepare the project

Use the **Fork** button on the [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples.git) repo page to fork the repo to your personal GitHub account. When the fork is complete, copy the fork's URL for use in the next section.

## Deploy the project

Deploy the project by using the following steps:

1. Set the necessary environment variables by using the following commands:

    ```bash
    export RESOURCE_GROUP="pet-clinic-container-apps"
    export LOCATION="canadacentral"
    export ENVIRONMENT="env-pet-clinic-container-apps"
    export CONTAINER_APP_NAME="pet-clinic"
    export REPO_URL="<URL-of-your-GitHub-repo-fork>"
    ```

1. Sign in to Azure from the CLI if you aren't already signed in. For more information, see the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Quickstart: Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md).

1. Build and deploy your Spring Boot app by using the following command:

    ```azurecli
    az containerapp up \
        --resource-group $RESOURCE_GROUP \
        --name $CONTAINER_APP_NAME \
        --location $LOCATION \
        --environment $ENVIRONMENT \
        --context-path ./spring-petclinic \
        --repo $REPO_URL
    ```

    This command performs the following tasks:

    - Creates the resource group.
    - Creates an Azure container registry.
    - Builds the container image and pushes it to the registry.
    - Creates the Container Apps environment with a Log Analytics workspace.
    - Creates and deploys the container app by using the built container image.

The project is now deployed. When you push new code to the repository, a GitHub Action performs the following tasks:

- Builds the container image and pushes it to the Azure container registry.
- Deploys the container image to the created container app.

[!INCLUDE [java-get-started-verify-app-status-and-cleanup-and-next-steps](includes/java-get-started-verify-app-status-and-cleanup-and-next-steps.md)]
