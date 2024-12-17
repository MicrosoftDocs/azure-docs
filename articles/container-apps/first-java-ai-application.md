---
title: Launch your first Java AI application to Azure Container Apps
description: Use the azd automation tool to deploy a sample AI application to Azure Container Apps.
services: container-apps
author: KarlErickson
ms.author: sonwan
ms.service: azure-container-apps
ms.topic: quickstart
ms.date: 12/17/2024
ms.custom:
#customer intent: As a developer, I want to see a simple example of an AI application deployed to Azure Container Apps.
---

# Launch your first Java AI application to Azure Container Apps

In this quickstart, you deploy your first Java AI application to Azure Container Apps. The application is a sample AI chat assistant based on the Spring PetClinic application, and it uses the [Azure OpenAI Service](/azure/ai-services/openai/overview). The quickstart also demonstrates how to automate deployment using the Azure Developer CLI (azd). The following screenshot shows the AI assistant:

:::image type="content" source="media/first-ai-application/home-with-chatbot.png"  alt-text="Screenshot of home." lightbox="media/first-ai-application/home-with-chatbot.png":::

## Prerequisites

- Azure account. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). To perform this quickstart, you need the **Contributor** and **User Access Administrator** roles, or the **Owner** role. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current).

- GitHub account. Get one for [free](https://github.com/join).

- [git](https://git-scm.com/downloads).

- [Azure CLI](/cli/azure/install-azure-cli).

- The [Microsoft Build of Open JDK](/java/openjdk/install). We recommend version 17.

- [Maven](https://maven.apache.org/download.cgi).

- [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/install-azd).

## Install the Azure CLI extensions

Install the Azure CLI extensions by using the following command:

```bash
   az extension add -n containerapp --upgrade
```

## Prepare the project

To prepare the project, clone the [spring-petclinic-ai](https://github.com/Azure-Samples/spring-petclinic-ai) repository by using the following command:

```bash
   git clone https://github.com/Azure-Samples/spring-petclinic-ai.git
```

## Deploy your application

> [!NOTE]
> This template uses [Azure OpenAI Service](/azure/ai-services/openai/overview) deployment modules **gpt-4o** and **text-embedding-ada-002**, which may not be available in all Azure regions. Check for [up-to-date region availability](/azure/ai-services/openai/concepts/models#standard-deployment-model-availability) and select a region during deployment accordingly. We recommend using the following regions: **East US**, **East US 2**, **North Central US**, **South Central US**, **Sweden Central**, **West US**, or **West US 3**.

To deploy your application, use the following steps:

1. Log in to azd by using the following command:

    ```azurecli
    azd auth login
    ```

1. Auto deploy by using the following command:

   ```azurecli
   azd up
   ```

1. When the system prompts you, enter `first-ai` for the environment name. After that, enter values for your Azure Subscription and Azure location, substituting your actual values for the placeholders in the following prompts:

    ```azurecli
    ? Enter a new environment name: first-ai
    ? Select an Azure Subscription to use: <SUBSCRIPTION>
    ? Select an Azure location to use: <REGION>
    ```

It takes about 15 minutes to get your first AI application ready. The following output is typical of what the system generates after a successful deployment:

```azurecli
(✓) Done: Resource group: rg-first-ai (5.977s)
(✓) Done: Virtual Network: vnet-first-ai (7.357s)
(✓) Done: Container Registry: crb36onby7z5ooc (25.742s)
(✓) Done: Azure OpenAI: openai-first-ai (25.324s)
(✓) Done: Azure AI Services Model Deployment: openai-first-ai/text-embedding-ada-002 (42.909s)
(✓) Done: Azure AI Services Model Deployment: openai-first-ai/gpt-4o (44.21s)
(✓) Done: Container Apps Environment: aca-env-first-ai (3m1.361s)
(✓) Done: Container App: petclinic-ai (22.701s)

INFO: Deploy finish succeed!
INFO: App url: petclinic-ai.<cluster>.<region>.azurecontainerapps.io

Packaging services (azd package)

(✓) Done: Packaging service petclinic-ai

Deploying services (azd deploy)

(✓) Done: Deploying service petclinic-ai
- Endpoint: https://petclinic-ai.<cluster>.<region>.azurecontainerapps.io/

SUCCESS: Your up workflow to provision and deploy to Azure completed in 17 minutes 40 seconds.
```

## Try your application

Now you can start using your application. Open the app by selecting the URL from the deploy output:

```azurecli
   INFO: Deploy finish succeed!
   INFO: App url: https://petclinic-ai.<cluster>.<region>.azurecontainerapps.io
```

The PetClinic page and AI assistant appear. You can get help by having a natural language chat with the AI assistant, which can assist you with the following tasks:

- Querying the registered pet owners
- Adding a new pet owner
- Updating a pet owner's information
- Adding a new pet
- Querying a vet's information

The following image shows a chat where the user asks the AI assistant to register a new owner with a pet to the PetClinic. The AI assistant then performs these tasks:

:::image type="content" source="media/first-ai-application/add-new-item.png" alt-text="Screenshot of AI chat assistant adding new item.":::

The capabilities of the AI assistant depend on the model you deploy in Azure OpenAI and the implementation of the defined functions.

## Clean up resources

If you plan to continue working with subsequent tutorials, you might want to retain these resources. When you no longer need the resources, delete the resource group, which also deletes its resources.

### [Azure portal](#tab/azure-portal)

To delete the resources, use the [Azure portal](https://portal.azure.com?azure-portal=true) to find the resource group of this sample, and delete it.

### [Azure CLI](#tab/azure-cli)

To delete the resource group, use following command:

```azurecli
   az group delete --name rg-first-ai
```

---

## Related content

- [Java on Azure Container Apps overview](java-ai-in-container-apps-conceptual-overview.md)
