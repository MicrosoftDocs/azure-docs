---
author: anthonychu
ms.service: container-apps
ms.topic:  include
ms.date: 05/08/2024
ms.author: antchu
---

## Optional: Deploy the sample app to Azure Container Apps

To deploy the FastAPI app to Azure Container Apps, you need to create a container image and push it to a container registry. Then you can deploy the image to Azure Container Apps. The `az containerapp up` command combines these steps into a single command.

You then need to configure managed identity for the app and assign it the proper roles to access Azure OpenAI and the session pool.

1. Set the variables for the Container Apps environment and app name:

    ```bash
    ENVIRONMENT_NAME=aca-sessions-tutorial-env
    CONTAINER_APP_NAME=chat-api
    ```

1. Build and deploy the app to Azure Container Apps:

    ```bash
    az containerapp up \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $SESSION_POOL_LOCATION \
        --environment $ENVIRONMENT_NAME \
        --env-vars "AZURE_OPENAI_ENDPOINT=<OPEN_AI_ENDPOINT>" "POOL_MANAGEMENT_ENDPOINT=<SESSION_POOL_MANAGMENT_ENDPOINT>" \
        --source .
    ```

    Replace `<OPEN_AI_ENDPOINT>` with the Azure OpenAI account endpoint and `<SESSION_POOL_MANAGMENT_ENDPOINT>` with the session pool management endpoint.

1. Enable the system-assigned managed identity for the app:

    ```bash
    az containerapp identity assign \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --system-assigned
    ```

1. For the app to access Azure OpenAI and the session pool, you need to assign the managed identity the proper roles.

    1. Retrieve the managed identity's principal ID:

        ```bash
        az containerapp show \
            --name $CONTAINER_APP_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query identity.principalId \
            --output tsv
        ```

    1. Retrieve the session pool resource ID:

        ```bash
        az containerapp sessionpool show \
            --name $SESSION_POOL_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query id \
            --output tsv
        ```

    1. Assign the managed identity the `Azure ContainerApps Session Executor` and `Contributor` roles on the session pool:

        Before you run the following command, replace `<PRINCIPAL_ID>` and `<SESSION_POOL_RESOURCE_ID>` with the values you retrieved in the previous steps.

        ```bash
        az role assignment create \
            --role "Azure ContainerApps Session Executor" \
            --assignee <PRINCIPAL_ID> \
            --scope <SESSION_POOL_RESOURCE_ID>

        az role assignment create \
            --role "Contributor" \
            --assignee <PRINCIPAL_ID> \
            --scope <SESSION_POOL_RESOURCE_ID>
        ```

    1. Retrieve the Azure OpenAI account resource ID:

        ```bash
        az cognitiveservices account show \
            --name $AZURE_OPENAI_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query id \
            --output tsv
        ```

    1. Assign the managed identity the `Cognitive Services OpenAI User` role on the Azure OpenAI account:

        Before you run the following command, replace `<PRINCIPAL_ID>` and `<AZURE_OPENAI_RESOURCE_ID>` with the values you retrieved in the previous steps.

        ```bash
        az role assignment create \
            --role "Cognitive Services OpenAI User" \
            --assignee <PRINCIPAL_ID> \
            --scope <AZURE_OPENAI_RESOURCE_ID>
        ```

1. Retrieve the app's fully qualified domain name (FQDN):

    ```bash
    az containerapp show \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query properties.configuration.ingress.fqdn \
        --output tsv
    ```

1. Open the browser to `https://<FQDN>/docs` to test the deployed app.
