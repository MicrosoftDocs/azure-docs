---
title: Deploy OSDU Admin UI on top of Azure Data Manager for Energy
description: Learn how to deploy the OSDU Admin UI on top of your Azure Data Manager for Energy instance
ms.service: azure-data-manager-for-energy
ms.topic: how-to
ms.reviewer: shikhagarg
ms.author: shikhagarg
author: Shikha Garg
ms.date: 02/15/2024
---
# Deploy OSDU Admin UI on top of Azure Data Manager for Energy

This guide will show you how to deploy the OSDU Admin UI on top of your Azure Data Manager for Energy instance.

The OSDU Admin UI enables platform administrators to manage the Azure Data Manager for Energy data partition you connect it to. This includes entitlements (user & group management), legal tags, schemas, reference data, as well as view objects and visualize them on a map.

## Prerequisites
- [Visual Studio Code with Dev Containers](https://code.visualstudio.com/docs/devcontainers/tutorial). While it is possible to deploy the OSDU Admin UI from your local computer using either Linux or Windows WSL, we recommend using a Dev Container to eliminate potential conflicts (i.e. tooling versions, environments etc.). 
- Create an [App Registration](/entra/identity-platform/quickstart-register-app.md)
- Provision an [Azure Data Manager for Energy instance](quickstart-create-microsoft-energy-data-services-instance.md)


> [!IMPORTANT]
> The App Registration requires the following permissions to function properly:
> - [Application.Read.All](/graph/permissions-reference#applicationreadall)
> - [User.Read](/graph/permissions-reference#applicationreadall)
> - [User.Read.All](/graph/permissions-reference#userreadall)

## Set up your environment
We recommend using a devcontainer to deploy the OSDU Admin UI to eliminate conflicts from your local machine.

[![Open in Remote - Containers](https://img.shields.io/static/v1?style=for-the-badge&label=Remote%20-%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://community.opengroup.org/osdu/ui/admin-ui-group/admin-ui-totalenergies/admin-ui-totalenergies)

1. When prompted for a container configuration template, select [Ubuntu](https://github.com/devcontainers/templates/tree/main/src/ubuntu) and accept the default version.
1. Add the following feature(s):
    1. [Azure CLI](https://github.com/devcontainers/features/tree/main/src/azure-cli)
1. Once the devcontainer is running, execute the following command in the bash terminal to install NVM, Node.js, NPM and Angular CLI:
    
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 14.17.3 && \
    npm install -g @angular/cli@13.3.9
    ```

1. Log into Azure CLI by executing the following command:
    ```azurecli-interactive
    az login
    ```

1. Make sure the correct subscription is selected by running the following command:
    ```azurecli-interactive
    az account show
    ```

1. If you need to change subscription:
    ```azurecli-interactive
    az account set --subscription <subscription-id>
    ```
    
### Configure environment variables
Required environment variables:
```bash
export ADMINUI_CLIENT_ID="" ## App Registration to be used by OSDU Admin UI, usually the client ID used to provision ADME
export WEBSITE_NAME="" ## Unique name of the static web app or storage account that will be generated
export RESOURCE_GROUP="" ## Name of resource group
export LOCATION="" ## Azure region to deploy to, i.e. "westeurope"
```

### Deploy storage account
1. Create resource group. Skip this step if the resource group already exist.
    ```azurecli-interactive
    az group create \
        --name $RESOURCE_GROUP \
        --location $LOCATION
    ```
    
1. Create storage account.
    ```azurecli-interactive
    az storage account create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --name $WEBSITE_NAME \
        --sku Standard_LRS \
        --public-network-access Enabled \
        --allow-blob-public-access true
    ```

1. Configure the static website.
    ```azurecli-interactive
    az storage blob service-properties update \
        --account-name $WEBSITE_NAME \
        --static-website \
        --404-document index.html \
        --index-document index.html
    ```

1. Add the redirect URI to the App Registration.
    ```azurecli-interactive
    export REDIRECT_URI=$(az storage account show --resource-group $RESOURCE_GROUP --name $WEBSITE_NAME --query "primaryEndpoints.web") && \
    echo "Redirect URL: $REDIRECT_URI" && \
    echo "Add the redirect URI above to the following App Registration's Single-page Application (SPA) section: https://ms.portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Authentication/appId/$ADMINUI_CLIENT_ID/isMSAApp~/false 
    ```

    Example:
    ![Screenshot showing redirect URIs of an App Registration](./media/how-to-deploy-osdu-admin-ui/appregistration.png)

### Build and deploy the web app

1. Navigate to the `OSDUApp` folder.
    ```bash
    cd OSDUApp/
    ```
1. Install the dependencies.
    ```nodejs    
    npm install
    ```
1. Modify the parameters in the config file located at `/src/config/config.json`
    ```json
    {
        "mapboxKey": "key", // Optional. Access token from Mapbox.com. Used to visualize data on the map feature.
        ...
        "data_partition": "adme_data_partition", // ADME Data Partition ID (i.e. opendes)
      "idp": {
         ...
         "tenant_id": "tenant_id", // Entra ID tenant ID
         "client_id": "client_id", // App Registration ID to use for the admin UI, usually the same as the ADME App Registration ID, i.e. "6ee7e0d6-0641-4b29-a283-541c5d00655a"
         "redirect_uri": "https://storageaccount.zXX.web.core.windows.net/", // This is the website URL ($REDIRECT_URI)
         "scope": "client_id/.default" // Scope of the ADME instance, i.e. "6ee7e0d6-0641-4b29-a283-541c5d00655a/.default"
      },
      "api_endpoints": { // Replace contoso with your ADME instance name in all the API endpoints below.
         "entitlement_endpoint": "https://contoso.energy.azure.com/api/", 
         "storage_endpoint": "https://contoso.energy.azure.com/api/",
         "search_endpoint": "https://contoso.energy.azure.com/api/",
         "legal_endpoint": "https://contoso.energy.azure.com/api/",
         "schema_endpoint": "https://contoso.energy.azure.com/api/",
         "osdu_connector_api_endpoint":"osdu_connector", // Optional. API endpoint of the OSDU Connector API*
         "file_endpoint": "https://contoso.energy.azure.com/api/",
         "graphAPI_endpoint": "https://contoso.energy.azure.com/api/",
         "workflow_endpoint": "https://contoso.energy.azure.com/api/"
      }
      ...
    }
    ```

    \* [OSDU Connector API](https://community.opengroup.org/osdu/ui/admin-ui-group/admin-ui-totalenergies/connector-api-totalenergies) is built as an interface between consumers and OSDU APIs wrapping some API chain calls and objects. Currently, it manages all operations and actions on project and scenario objects.

1. Build the web UI.
    ```bash
    ng build
    ```

1. Upload the build to Storage Account
    ```azurecli-interactive
    az storage blob upload-batch \
        --account-name soheilstorage \
        --source ./dist/ \
        --destination '$web'
    ```
    
1. Validate that the Admin UI works by accessing the Website URL. This is the same as the redirect URI.
    
## References

For information about OSDU Admin UI, see [OSDU Gitlab](https://community.opengroup.org/osdu/ui/admin-ui-group/admin-ui-totalenergies/admin-ui-totalenergies)<br>
For other deployment methods (Terraform or Azure DevOps pipeline), see [OSDU Admin UI DevOps](https://community.opengroup.org/osdu/ui/admin-ui-group/admin-ui-totalenergies/admin-ui-totalenergies/-/tree/main/OSDUApp/devops/azure)
