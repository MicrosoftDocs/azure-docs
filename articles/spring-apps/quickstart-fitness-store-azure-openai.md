---
title: "Quickstart - Integrate Azure OpenAI"
titleSuffix: Azure Spring Apps Enterprise plan
description: Explains how to integrate Azure OpenAI on the Azure Spring Apps Enterprise plan.
author: KarlErickson  # external contributor maly7
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 11/02/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Quickstart: Integrate Azure OpenAI

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This quickstart shows you how to integrate Azure OpenAI with applications deployed on the Azure Spring Apps Enterprise plan.

Azure OpenAI enables your applications to take advantage of large-scale, generative AI models with deep understandings of language and code to enable new reasoning and comprehension capabilities.

The following video shows how Azure Spring Apps uses Azure OpenAI to build intelligent applications:  

<br>

> [!VIDEO https://www.youtube.com/embed/wxgGoLohvsg]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Access granted to Azure OpenAI. For more information, see [Request Access to Azure OpenAI Service](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUOFA5Qk1UWDRBMjg0WFhPMkIzTzhKQ1dWNyQlQCN0PWcu).
- Understand and fulfill the [Requirements](how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md).
- [The Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli).
- [Git](https://git-scm.com/).
- [jq](https://stedolan.github.io/jq/download/)
- [!INCLUDE [install-enterprise-extension](includes/install-enterprise-extension.md)]
- Complete the steps in [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Provision Azure OpenAI

To add AI to the application, create an Azure OpenAI account and deploy language models. The following steps describe how to provision an Azure OpenAI account and deploy language models using the Azure CLI:

1. Use the following command to create an Azure OpenAI account:

   ```azurecli
   az cognitiveservices account create \
       --resource-group <resource-group-name> \
       --name <open-ai-service-name> \
       --location <region> \
       --kind OpenAI \
       --sku s0 \
       --custom-domain <open-ai-service-name>   
   ```

1. Use the following commands to create the model deployments for `text-embedding-ada-002` and `gpt-35-turbo-16k` in your Azure OpenAI service instance:

   ```azurecli
   az cognitiveservices account deployment create \
       --resource-group <resource-group-name> \
       --name <open-ai-service-name> \
       --deployment-name text-embedding-ada-002 \
       --model-name text-embedding-ada-002 \
       --model-version "2"  \
       --model-format OpenAI \
       --sku-name "Standard" \
       --sku-capacity 1

   az cognitiveservices account deployment create \
       --resource-group <resource-group-name> \
       --name <open-ai-service-name> \
       --deployment-name gpt-35-turbo-16k \
       --model-name gpt-35-turbo-16k \
       --model-version "0613"  \
       --model-format OpenAI \
       --sku-name "Standard" \
       --sku-capacity 1
   ```

### Deploy Assist Service to Azure Spring Apps

Use the following steps to create, configure, and deploy the Assist Service application to Azure Spring Apps.

1. Use the following command to create the new AI service, `assist-service`:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --name assist-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --instance-count 1 \
       --memory 1Gi
   ```

1. Use the following command to configure Spring Cloud Gateway with the Assist Service route:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --name assist-routes \
       --app-name assist-service \
       --routes-file azure-spring-apps-enterprise/resources/json/routes/assist-service.json
   ```

1. Use the following command to retrieve the REST API endpoint base URL for the Azure OpenAI service:

   ```azurecli
   export SPRING_AI_AZURE_OPENAI_ENDPOINT=$(az cognitiveservices account show \
       --name <open-ai-service-name> \
       --resource-group <resource-group-name> \
       | jq -r .properties.endpoint)
   ```

1. Use the following command to retrieve the primary API key:

   ```azurecli
   export SPRING_AI_AZURE_OPENAI_APIKEY=$(az cognitiveservices account keys list \
       --name <open-ai-service-name> \
       --resource-group <resource-group-name> \
       | jq -r .key1)
   ```

1. Use the following command to deploy the Assist Service application:

   ```azurecli
   az spring app deploy 
       --resource-group <resource-group-name> \
       --name assist-service \
       --service <Azure-Spring-Apps-service-instance-name> \
       --source-path apps/acme-assist \
       --build-env BP_JVM_VERSION=17 \
       --env \
           SPRING_AI_AZURE_OPENAI_ENDPOINT=${SPRING_AI_AZURE_OPENAI_ENDPOINT} \
           SPRING_AI_AZURE_OPENAI_APIKEY=${SPRING_AI_AZURE_OPENAI_APIKEY} \
           SPRING_AI_AZURE_OPENAI_MODEL=gpt-35-turbo-16k \
           SPRING_AI_AZURE_OPENAI_EMBEDDINGMODEL=text-embedding-ada-002
   ```

1. Now, test the Fitness Store application in the browser. Select **ASK TO FITASSIST** to converse with the Assist Service application.

   :::image type="content" source="media/quickstart-fitness-store-azure-openai/homepage.png" alt-text="Screenshot that shows the ASK TO FITASSIST button." lightbox="media/quickstart-fitness-store-azure-openai/homepage.png":::

1. In **FitAssist**, enter *I need a bike for a commute to work* and observe the output that was generated by the Assist Service application:

   :::image type="content" source="media/quickstart-fitness-store-azure-openai/fitassist-question.png" alt-text="Screenshot that shows the 'I need a bike for a commute to work' query and the response from the Fitness Store assistant." lightbox="media/quickstart-fitness-store-azure-openai/fitassist-question.png":::

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

Continue on to any of the following optional quickstarts:

- [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
- [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
- [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
- [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
- [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)
