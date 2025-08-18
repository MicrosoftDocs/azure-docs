---
title: Deploy an AI-Enabled Instance of the Spring PetClinic on Azure Container Apps
description: Use the azd automation tool to deploy a sample AI application to Azure Container Apps.
services: container-apps
author: KarlErickson
ms.author: karler
ms.reviewer: sonwan
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 02/12/2025
ms.custom: devx-track-java
#customer intent: As a developer, I want to see a simple example of an AI application deployed to Azure Container Apps.
---

# Deploy an AI-enabled instance of the Spring PetClinic on Azure Container Apps

In this article, you learn how to use [Azure OpenAI Service](/azure/ai-services/openai/overview) and Azure Container Apps to create a natural language interface for the Spring PetClinic sample application.

:::image type="content" source="media/java-ai-application/home-with-chatbot.png"  alt-text="Screenshot of the home page of PetClinic." lightbox="media/java-ai-application/home-with-chatbot.png":::

For information on the architectural details of this application, see [Java PetClinic AI sample in Container Apps overview](./java-petclinic-ai-overview.md).

## Considerations

- Deployment time: The AI-enable application deployed in this article requires a series of connected services to operate. Deployment times can take upwards of 15 minutes to complete. Plan your time accordingly as you work through this tutorial.
- Model availability: The sample application uses [Azure OpenAI Service](/azure/ai-services/openai/overview) deployment modules `gpt-4o` and `text-embedding-ada-002`, which might not be available in all Azure regions.

    For more information on availability, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models?tabs=global-standard,standard-chat-completions) and select your desired deployment region. For best results, consider using one of the following regions: East US, East US 2, North Central US, South Central US, Sweden Central, West US, or West US 3.

## Prerequisites

- An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/).
- `Contributor` and `User Access Administrator` roles, or the `Owner` role. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current).
- [A GitHub account](https://github.com/join).
- The latest version of [git](https://git-scm.com/downloads).
- The [Microsoft Build of Open JDK](/java/openjdk/install), version 17 or higher.
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
- [Azure CLI](/cli/azure/install-azure-cli).
- [Maven](https://maven.apache.org/download.cgi).

## Setup

1. Clone the sample application to your machine by using the following command:

    ```bash
    git clone https://github.com/Azure-Samples/spring-petclinic-ai.git
    ```

1. Navigate to the **spring-petclinic-ai** folder by using the following command:

    ```bash
    cd spring-petclinic-ai
    ```

1. If you don't already have it, install the `containerapp` extension for the Azure CLI by using the following command:

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

1. Securely log in to your Azure account by using the following command:

    ```azurecli
    az auth login  
    ```

    This command opens a web page where you can enter your Azure credentials to authenticate.

## Deploy

1. Automatically deploy the application by using the following command:

    ```azdeveloper
    azd up
    ```

1. When you're prompted, enter **my-first-ai** for the environment name.

    After that, enter values for `Azure Subscription` and `Azure location`, substituting your actual values for the `<..>` placeholders in the following prompts:

    ```bash
    ? Enter a new environment name: my-first-ai
    ? Select an Azure Subscription to use: <SUBSCRIPTION>
    ? Select an Azure location to use: <REGION>
    ```

    Once you provide all the required values, you might need to wait upwards of 15 minutes for the application to deploy.

    When deployment is complete, you see output similar to the following to notify you of a successful deployment:

    ```output
    (✓) Done: Resource group: rg-my-first-ai (5.977s)
    (✓) Done: Virtual Network: vnet-my-first-ai (7.357s)
    (✓) Done: Container Registry: crb36onby7z5ooc (25.742s)
    (✓) Done: Azure OpenAI: openai-my-first-ai (25.324s)
    (✓) Done: Azure AI Services Model Deployment: openai-my-first-ai/text-embedding-ada-002 (42.909s)
    (✓) Done: Azure AI Services Model Deployment: openai-my-first-ai/gpt-4o (44.21s)
    (✓) Done: Container Apps Environment: aca-env-my-first-ai (3m1.361s)
    (✓) Done: Container App: petclinic-ai (22.701s)
    
    INFO: Deploy finish succeed!
    INFO: App url: petclinic-ai.<CLUSTER>.<REGION>.azurecontainerapps.io
    
    Packaging services (azd package)
    
    (✓) Done: Packaging service petclinic-ai
    
    Deploying services (azd deploy)
    
    (✓) Done: Deploying service petclinic-ai
    - Endpoint: https://petclinic-ai.<CLUSTER>.<REGION>.azurecontainerapps.io/
    
    SUCCESS: Your up workflow to provision and deploy to Azure completed in 17 minutes 40 seconds.
    ```

1. Locate the application URL.

    Inspect the output and find the deployment success message and copy the URL to the clipboard.

    The success message resembles the following output:

    ```output
    INFO: Deploy finish succeed!
    INFO: App url: https://petclinic-ai.<CLUSTER>.<REGION>.azurecontainerapps.io
    ```

## Try your application

1. View the application in a web browser using the URL you copied at the end of the last section.

1. You can interact with the chatbot via prompts like the following:

    - List all registered pet owners.
    - Add a new pet owner named Steve.
    - Change Steve's name to Steven.
    - Add a pet named Spot.
    - List all vets in your system.

The following image shows the result of asking the application to add a new pet owner to the system:

:::image type="content" source="media/java-ai-application/add-new-item.png" alt-text="Screenshot of AI chat assistant adding a new owner, complete with address and other information, and information about a pet." lightbox="media/java-ai-application/add-new-item.png":::

## Updates

As you experiment with the sample, if you want to deploy any changes to the application, you can use the following commands to publish your changes:

```azdeveloper
azd package
azd deploy
```

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to retain these resources. When you no longer need the resources, delete the resource group, which also deletes its resources.

### [Azure portal](#tab/azure-portal)

To delete the resources, use the Azure portal to find the resource group of this sample, and then delete it.

### [Azure CLI](#tab/azure-cli)

To delete the resource group, use the following command:

```azurecli
az group delete --name rg-first-ai
```

---
