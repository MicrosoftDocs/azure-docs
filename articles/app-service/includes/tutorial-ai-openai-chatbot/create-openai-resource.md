---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 03/03/2026
ms.author: cephalin
ms.custom:
  - build-2025
---


In this section, you use Azure CLI in GitHub Codespaces to create an Azure OpenAI resource.

1. Sign in to [GitHub Codespaces](https://github.com/codespaces) with your GitHub account.
1. Select **Use this template** in the **Blank** tile to create a new blank codespace.
1. In the Codespace terminal, install the Azure CLI.

   ```bash
   curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
   ```

1. Sign in to your Azure account.

   ```azurecli
   az login
   ```

   Follow the instructions in the terminal to authenticate.

1. Set environment variables by providing names for your resource group and Azure OpenAI service and setting an appropriate Azure region as your location.

   ```azurecli
   export RESOURCE_GROUP="<group-name>"
   export OPENAI_SERVICE_NAME="<azure-openai-name>"
   export APPSERVICE_NAME="<app-name>"
   export LOCATION="<azure-region>"
   ```

   > [!IMPORTANT]
   > The location is tied to the regional availability of the chosen model. Model and [deployment type](/azure/ai-foundry/foundry-models/concepts/deployment-types) availability vary among Azure regions and billing tiers. This tutorial uses `gpt-4o-mini`, which is available in several regions under the Standard deployment type.
   >
   > Before selecting a location, consult the [Model summary and region availability table](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability) to verify model support in your preferred region.

1. Create a resource group and an Azure OpenAI resource with a custom domain, and then add a `gpt-4o-mini` model:

   ```azurecli
   # Resource group
   az group create --name $RESOURCE_GROUP --location $LOCATION
   # Azure OpenAI resource
   az cognitiveservices account create \
     --name $OPENAI_SERVICE_NAME \
     --resource-group $RESOURCE_GROUP \
     --location $LOCATION \
     --custom-domain $OPENAI_SERVICE_NAME \
     --kind OpenAI \
     --sku s0
   # gpt-4o-mini model
   az cognitiveservices account deployment create \
     --name $OPENAI_SERVICE_NAME \
     --resource-group $RESOURCE_GROUP \
     --deployment-name gpt-4o-mini \
     --model-name gpt-4o-mini \
     --model-version 2024-07-18 \
     --model-format OpenAI \
     --sku-name Standard \
     --sku-capacity 1
   # Cognitive Services OpenAI User role that lets the signed in Azure user read models from Azure OpenAI
   az role assignment create \
     --assignee $(az ad signed-in-user show --query id -o tsv) \
     --role "Cognitive Services OpenAI User" \
     --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$OPENAI_SERVICE_NAME
   ```

Now that you have an Azure OpenAI resource, you can create a web application to interact with it.
