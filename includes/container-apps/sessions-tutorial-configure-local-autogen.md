---
author: anthonychu
ms.service: container-apps
ms.topic:  include
ms.date: 05/08/2024
ms.author: antchu
---

### Configure the app

1. Create a Python virtual environment and activate it:

    ```bash
    python3.11 -m venv .venv
    source .venv/bin/activate
    ```

    Change the Python version in the command if you're using a different version. It's recommended to use Python 3.10 or later.

    > [!NOTE]
    > If you're using Windows, replace `.venv/bin/activate` with `.venv\Scripts\activate`.

1. Install the required Python packages:

    ```bash
    python -m pip install -r requirements.txt
    ```

1. To run the app, you need to configure environment variables.

    1. Retrieve the Azure OpenAI account endpoint:

        ```bash
        az cognitiveservices account show \
            --name $AZURE_OPENAI_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query properties.endpoint \
            --output tsv
        ```

    1. Retrieve the Azure OpenAI API key:

        ```bash
        az cognitiveservices account keys list \
            --name $AZURE_OPENAI_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query key1 \
            --output tsv
        ```

    1. Retrieve the Azure Container Apps session pool management endpoint:

        ```bash
        az containerapp sessionpool show \
            --name $SESSION_POOL_NAME \
            --resource-group $RESOURCE_GROUP_NAME \
            --query properties.poolManagementEndpoint \
            --output tsv
        ```

    1. Create a `.env` file in the root of the sample app directory (same location as `main.py`). Add the following content to the file:

        ```text
        OAI_CONFIG_LIST=[{"model": "gpt-4", "api_key": "<AZURE_OPENAI_KEY>", "api_type": "azure", "base_url": "<AZURE_OPENAI_ENDPOINT>", "api_version": "2023-12-01-preview"}]
        POOL_MANAGEMENT_ENDPOINT=<SESSION_POOL_MANAGEMENT_ENDPOINT>
        ```

        Replace `<AZURE_OPENAI_ENDPOINT>` with the Azure OpenAI account endpoint, `<AZURE_OPENAI_KEY>` with the Azure OpenAI API key, and `<SESSION_POOL_MANAGEMENT_ENDPOINT>` with the session pool management endpoint.

1. The app uses `DefaultAzureCredential` to authenticate with Azure services. On your local machine, it uses your current Azure CLI login credentials. You must give yourself the *Azure ContainerApps Session Executor* role on the session pool for the app to access the session pool.

    1. Retrieve your Azure CLI user name:

        ```bash
        az account show --query user.name --output tsv
        ```

    1. Run the following commands to retrieve the session pool resource ID:

        ```bash
        az containerapp sessionpool show --name $SESSION_POOL_NAME --resource-group $RESOURCE_GROUP_NAME --query id --output tsv
        ```

    1. Assign the *Azure ContainerApps Session Executor* role to your Azure CLI user on the session pool:

        ```bash
        az role assignment create \
            --role "Azure ContainerApps Session Executor" \
            --assignee <CLI_USERNAME> \
            --scope <SESSION_POOL_RESOURCE_ID>
        ```

        Replace `<CLI_USERNAME>` with your Azure CLI user name and `<SESSION_POOL_RESOURCE_ID>` with the session pool resource ID.
