---
author: KarlErickson
ms.author: karler
ms.service: azure-container-apps
ms.topic: include
ms.date: 02/18/2025
---

Deploy the project by using the following steps:

1. Define the environment variables that are used throughout this article by using the following commands:

    ```bash
    export RESOURCE_GROUP="petclinic-containerapps"
    export LOCATION="canadacentral"
    export ENVIRONMENT="env-petclinic-containerapps"
    export CONTAINER_APP_NAME="petclinic"
    ```

1. If you haven't done so, sign in to Azure from the CLI. For more information, see the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md).

1. Build and deploy your first Spring Boot app using the following command, where the `..` (dot dot) tells the command to use the Dockerfile in the folder one level up in the folder structure:

    > [!NOTE] This command does the following things:
    >
    > - Creates the resource group.
    > - Creates an Azure Container Registry.
    > - Builds the container image and pushes it to the registry.
    > - Creates the Container Apps environment with a Log Analytics workspace.
    > - Creates and deploys the container app using the built container image.
