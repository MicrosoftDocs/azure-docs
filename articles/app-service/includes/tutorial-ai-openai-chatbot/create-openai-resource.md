---
author: cephalin
ms.service: azure-app-service
ms.topic: include
ms.date: 05/17/2025
ms.author: cephalin
ms.custom:
  - build-2025
---


In this section, you'll use GitHub Codespaces to create an Azure OpenAI resource with the Azure CLI.

1. Go to [GitHub Codespaces](https://github.com/codespaces) and sign in with your GitHub account.
2. Find the **Blank** template by GitHub and select **Use this template** to create a new blank Codespace.
3. In the Codespace terminal, install the Azure CLI:

    ```bash
    curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
    ```
  
4. Sign in to your Azure account:

    ```azurecli
    az login
    ```
  
    Follow the instructions in the terminal to authenticate.

5. Set environment variables for your resource group name, Azure OpenAI service name, and location:

    ```azurecli
    export RESOURCE_GROUP="<group-name>"
    export OPENAI_SERVICE_NAME="<azure-openai-name>"
    export APPSERVICE_NAME="<app-name>"
    export LOCATION="eastus2"
    ```

    > [!IMPORTANT]
    > The region is critical as it's tied to the regional availability of the chosen model. Model availability and [deployment type availability](/azure/ai-services/openai/how-to/deployment-types) vary from region to region. This tutorial uses `gpt-4o-mini`, which is available in `eastus2` under the Standard deployment type. If you deploy to a different region, this model might not be available or might require a different tier. Before changing regions, consult the [Model summary table and region availability](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability) to verify model support in your preferred region.
    > 

6. Create a resource group and an Azure OpenAI resource with a custom domain, then add a gpt-4o-mini model:

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
    # Cognitive Services OpenAI User role that lets the signed in Azure user to read models from Azure OpenAI
    az role assignment create \
      --assignee $(az ad signed-in-user show --query id -o tsv) \
      --role "Cognitive Services OpenAI User" \
      --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$OPENAI_SERVICE_NAME
    ```

Now that you have an Azure OpenAI resource, you'll create a web application to interact with it.
