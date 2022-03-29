---
title: 'Tutorial: Connect a web app to Azure App Configuration with Service Connector'
description: Learn how you can connect an ASP.NET Core application hosted in Azure Web Apps to App Configuration using Service Connector'
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 03/31/2022
---

# Tutorial: Connect a web app to Azure App Configuration with Service Connector

Learn how to connect an ASP.NET Core app running on Azure App Service, to Azure App Configuration, using the following methods:

- System-assigned managed identity (SMI)
- User-assigned managed identity (UMI)
- Service principal
- Connection string
  
In this tutorial, use the Azure CLI to complete the following tasks:

> [!div class="checklist"]
> - Set up Azure resources
> - Create a connection between a web app and App Configuration
> - Build and deploy your app to Azure App Service

## Prerequisites

- An Azure account with an active subscription. Your access role within the subscription must be "Contributor" or "Owner". [Create an account for free](https://azure.microsoft.com/free/dotnet).
- The Azure CLI. You can use it in [Azure Cloud Shell](https://shell.azure.com/) or [install it locally](/cli/azure/install-azure-cli).
- Git
- A code editor. For example, [Visual Studio](https://visualstudio.microsoft.com/downloads/) or [Visual Studio Code](https://code.visualstudio.com/download).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Set up Azure resources

Start by creating your Azure resources using a system-assigned managed identity (SMI), a user-assigned managed identity (UMI), a service principal or a connection string.

1. Create an ASP.NET Core application.

    ### [SMI](#tab/smi)

    Create an ASP.NET Core app using a system-assigned managed identity.

    ```azurecli
    # Login to the Azure CLI. Skip if you're using Cloud Shell.
    az login

    # Switch to a subscription where you have Subscription Contributor role.
    az account set -s <myTestSubsId>

    # Create a resource group
    az group create -n <myResourceGroupName> -l eastus
    
    # Create an App Service plan
    az appservice plan create -g <myResourceGroupName> -n <myPlanName> --is-linux --sku B1

    # Create a web app
    az webapp create -g <myResourceGroupName> -n <myWebAppName> --runtime "DOTNETCORE|3.1" --plan <myPlanName>
    ```

    ### [UMI](#tab/umi)

    Create an ASP.NET Core app using a user-assigned managed identity.

    ```azurecli
    # Login to the Azure CLI. Skip if you're using Cloud Shell.
    az login

    # Switch to a subscription where you have Subscription Contributor role.
    az account set -s <myTestSubsId>

    # Create a resource group
    az group create -n <myResourceGroupName> -l eastus

    # Create an App Service plan
    az appservice plan create -g <myResourceGroupName> -n <myPlanName> --is-linux --sku B1

    # Create a web app
    az webapp create -g <myResourceGroupName> -n <myWebAppName> --runtime '"DOTNETCORE|3.1"' --plan <myPlanName>

    # [Optional]: skip this step if you already have a managed identity. Create a user-assigned managed identity.
    az identity create -g <myResourceGroupName> -n <myIdentityName>
    ```

    ### [Service principal](#tab/serviceprincipal)

    Create an ASP.NET Core app using a service principal.

    ```azurecli
    # Login to the Azure CLI. Skip if you're using Cloud Shell.
    az login

    # Switch to a subscription where you have Subscription Contributor role.
    az account set -s <myTestSubsId>

    # Create a resource group
    az group create -n <myResourceGroupName> -l eastus

    # Create an App Service plan
    az appservice plan create -g <myResourceGroupName> -n <myPlanName> --is-linux --sku B1

    # Create a web app
    az webapp create -g <myResourceGroupName> -n <myWebAppName> --runtime '"DOTNETCORE|3.1"' --plan <myPlanName>

    # [Optional]: skip this step if you already have a managed identity. Create a user-assigned managed identity.
    az identity create -g <myResourceGroupName> -n <myIdentityName>
    ```

    ### [Connection string](#tab/connectionstring)

    Create an ASP.NET Core app using a connection string.

    ```azurecli
    # Login to the Azure CLI. Skip if you're using Cloud Shell.
    az login

    # Switch to a subscription where you have Subscription Contributor role.
    az account set -s <myTestSubsId>

    # Create a resource group
    az group create -n <myResourceGroupName> -l eastus

    # Create an App Service plan
    az appservice plan create -g <myResourceGroupName> -n <myPlanName> --is-linux --sku B1

    # Create a web app
    az webapp create -g <myResourceGroupName> -n <myWebAppName> --runtime '"DOTNETCORE|3.1"' --plan <myPlanName>
    ```

    ---

1. Create an Azure App Configuration store

   ```azurecli
    az appconfig create -g <myResourceGroupName> -n <myAppConfigStoreName> --sku Free -l eastus
    ```

1. Clone the following sample repo:

    ```bash
    git clone https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet.git
    ```

1. Import the test configuration file to Azure App Configuration.

    ### [SMI](#tab/smi)

    Import the test configuration file to Azure App Configuration using a system-assigned managed identity.

    1. Cd into the folder `serviceconnector-webapp-appconfig-dotnet\system-managed-identity\Microsoft.Azure.ServiceConnector.Sample`
    1. Import the [./sampleconfigs.json](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/system-managed-identity/Microsoft.Azure.ServiceConnector.Sample/sampleconfigs.json) test configuration file into the App Configuration store. If you're using Cloud Shell, upload [sampleconfigs.json](../cloud-shell/persisting-shell-storage.md) before running the command.

        ```azurecli
        az appconfig kv import -n <myAppConfigStoreName> --source file --format json --path ./sampleconfigs.json --separator : --yes
        ```

    ### [UMI](#tab/umi)

    Import the test configuration file to Azure App Configuration using a user-assigned managed identity.

    1. Cd into the folder `serviceconnector-webapp-appconfig-dotnet\user-assigned-managed-identity\Microsoft.Azure.ServiceConnector.Sample`
    1. Import the [./sampleconfigs.json](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/user-assigned-managed-identity/Microsoft.Azure.ServiceConnector.Sample/sampleconfigs.json) test configuration file into the App Configuration store. If you're using Cloud Shell, upload [sampleconfigs.json](../cloud-shell/persisting-shell-storage.md) before running the command.

        ```azurecli
        az appconfig kv import -n <myAppConfigStoreName> --source file --format json --path ./sampleconfigs.json --separator : --yes
        ```

    ### [Service principal](#tab/serviceprincipal)

    Import the test configuration file to Azure App Configuration using service principal.

    1. Cd into the folder `serviceconnector-webapp-appconfig-dotnet\service-principal\Microsoft.Azure.ServiceConnector.Sample`
    1. Import the [./sampleconfigs.json](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/service-principal/Microsoft.Azure.ServiceConnector.Sample/sampleconfigs.json) test configuration file into the App Configuration store. If you're using Cloud Shell, upload [sampleconfigs.json](../cloud-shell/persisting-shell-storage.md) before running the command.

        ```azurecli
        az appconfig kv import -n <myAppConfigStoreName> --source file --format json --path ./sampleconfigs.json --separator : --yes
        ```

    ### [Connection string](#tab/connectionstring)

    Import the test configuration file to Azure App Configuration using a connection string.

    1. Cd into the folder `serviceconnector-webapp-appconfig-dotnet\connection-string\Microsoft.Azure.ServiceConnector.Sample`
    1. Import the [./sampleconfigs.json](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/connection-string/Microsoft.Azure.ServiceConnector.Sample/sampleconfigs.json) test configuration file into the App Configuration store. If you're using Cloud Shell, upload [sampleconfigs.json](../cloud-shell/persisting-shell-storage.md) before running the command.

        ```azurecli
        az appconfig kv import -n <myAppConfigStoreName> --source file --format json --path ./sampleconfigs.json --separator : --yes
        ```

    ---

## Connect the web app to App Configuration

Create a connection between your web application and your App Configuration store.

### [SMI](#tab/smi)

Create a connection between your web application and your App Configuration store, using a system-assigned managed identity authentication. This connection is done through Service Connector.

```azurecli
az webapp connection create appconfig -g <myResourceGroupName> -n <myWebAppName> --app-config <myAppConfigStoreName> --tg <myResourceGroupName> --connection <myConnectionName> --system-identity
```

`system-identity` refers to the system-assigned managed identity (SMI) authentication type. Service Connector also supports the following authentications: user-assigned managed identity (UMI), connection string (secret) and service principal.

### [UMI](#tab/umi)

Create a connection between your web application and your App Configuration store, using a user-assigned managed identity authentication. This connection is done through Service Connector.

```azurecli
az webapp connection create appconfig -g <myResourceGroupName> -n <myWebAppName> --app-config <myAppConfigStoreName> --tg <myResourceGroupName> --connection <myConnectionName> --user-identity client-id=<myIdentityClientId> subs-id=<myTestSubsId>
```

`user-identity` refers to the user-assigned managed identity authentication type. Service Connector also supports the following authentications: system-assigned managed identity, connection string (secret) and service principal.

### [Service principal](#tab/serviceprincipal)

Create a connection between your web application and your App Configuration store, using a service principal. This is done through Service Connector.

```azurecli
az webapp connection create appconfig -g <myResourceGroupName> -n <myWebAppName> --app-config <myAppConfigStoreName> --tg <myResourceGroupName> --connection <myConnectionName> --service-principal client-id=<mySPClientId>  secret=<mySPSecret>
```

`service-principal` refers to the service principal authentication type. Service Connector also supports the following authentications: system-assigned managed identity (UMI), user-assigned managed identity (UMI) and connection string (secret).

### [Connection string](#tab/connectionstring)

Create a connection between your web application and your App Configuration store, using a connection string. This connection is done through Service Connector.

```azurecli
az webapp connection create appconfig -g <myResourceGroupName> -n <myWebAppName> --app-config <myAppConfigStoreName> --tg <myResourceGroupName> --connection <myConnectionName> --secret
```

`secret` refers to the connection-string authentication type. Service Connector also supports the following authentications: system-assigned managed identity, user-assigned managed identity, and service principal.

---

## Build and deploy to Azure

Use the following steps or any other approach you're familiar with to build and deploy the ASP.NET Core app to Azure.

1. Launch the build:

    ```bash
    dotnet publish .\Microsoft.Azure.ServiceConnector.Sample.csproj -c Release
    ```

1. Deploy the Azure web app.

    ### [SMI](#tab/smi)

    Deploy your Azure web app with SMI using one of the following tools:
    1. Visual Studio: open the sample solution in Visual Studio, right click on the project name, select Publish, and follow the wizard to publish to Azure. For more details:[deploy using Visual Studio](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visualstudio-deploy).
    1. Visual Studio Code, install the code editor's [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). Open the sample folder with Visual Studio Code, right click on the project name, select **Deploy to WebApp**, and follow the wizard to publish to Azure. For more details: [deploy using Visual Studio Code](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visual-studio-code-deploy).
    1. Azure CLI:

        ```azurecli
        # Set up the deployment of the web app in Microsoft Azure App Service
        az webapp config appsettings set -g <myResourceGroupName> -n <myWebAppName> --settings PROJECT=system-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Microsoft.Azure.ServiceConnector.Sample.csproj

        # Config the deployment source to the local git repo
        az webapp deployment source config-local-git -g <myResourceGroupName> -n <myWebAppName>

        # Get the publish credentials
        az webapp deployment list-publishing-credentials -g <myResourceGroupName> -n <myWebAppName>  --query "{Username:publishingUserName, Password:publishingPassword}"
        git remote add azure https://<myWebAppName>.scm.azurewebsites.net/<myWebAppName>.git
        
        # Push local main to the remote main branch. The command will prompt for a username and a password, which are in output of the above list-publishing-credentials command.
        git push azure main:main
        ```

    ### [UMI](#tab/umi)

    Deploy your Azure web app with UMI using one of the following tools:
    Deploy your Azure web app with SMI using one of the following tools:
    1. Visual Studio: open the sample solution in Visual Studio, right click on the project name, select Publish, and follow the wizard to publish to Azure. For more details:[deploy using Visual Studio](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visualstudio-deploy).
    1. Visual Studio Code, install the code editor's [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). Open the sample folder with Visual Studio Code, right click on the project name, select **Deploy to WebApp**, and follow the wizard to publish to Azure. For more details: [deploy using Visual Studio Code](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visual-studio-code-deploy).
    1. Azure CLI:

        ```azurecli
        # Set up the deployment of the web app in Microsoft Azure App Service
        az webapp config appsettings set -g <myResourceGroupName> -n <myWebAppName> --settings PROJECT=user-assigned-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Microsoft.Azure.ServiceConnector.Sample.csproj

        # Set up the deployment source to the local git repo
        az webapp deployment source config-local-git -g <myResourceGroupName> -n <myWebAppName>

        # Get the publish credentials
        az webapp deployment list-publishing-credentials -g <myResourceGroupName> -n <myWebAppName>  --query "{Username:publishingUserName, Password:publishingPassword}"
        git remote add azure https://<myWebAppName>.scm.azurewebsites.net/<myWebAppName>.git
        
        # Push local main to the remote main branch. The command will prompt for a username and a password, which are in output of the above list-publishing-credentials command.
        git push azure main:main
        ```

    ### [Service principal](#tab/serviceprincipal)

    Deploy your Azure web app with a service principal using one of the following tools:
    Deploy your Azure web app with SMI using one of the following tools:
    1. Visual Studio: open the sample solution in Visual Studio, right click on the project name, select Publish, and follow the wizard to publish to Azure. For more details:[deploy using Visual Studio](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visualstudio-deploy).
    1. Visual Studio Code, install the code editor's [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). Open the sample folder with Visual Studio Code, right click on the project name, select **Deploy to WebApp**, and follow the wizard to publish to Azure. For more details: [deploy using Visual Studio Code](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visual-studio-code-deploy).
    1. Azure CLI:

        ```azurecli
        # Set up the deployment of the web app in Microsoft Azure App Service
        az webapp config appsettings set -g <myResourceGroupName> -n <myWebAppName> --settings PROJECT=service-principal/Microsoft.Azure.ServiceConnector.Sample/Microsoft.Azure.ServiceConnector.Sample.csproj

        # Set up the deployment source to the local git repo
        az webapp deployment source config-local-git -g <myResourceGroupName> -n <myWebAppName>

        # Get the publish credentials
        az webapp deployment list-publishing-credentials -g <myResourceGroupName> -n <myWebAppName>  --query "{Username:publishingUserName, Password:publishingPassword}"
        git remote add azure https://<myWebAppName>.scm.azurewebsites.net/<myWebAppName>.git
        
        # Push local main to the remote main branch. The command will prompt for a username and a password, which are in output of the above list-publishing-credentials command.
        git push azure main:main
        ```

    ### [Connection string](#tab/connectionstring)

    Deploy your Azure web app with a connection string using one of the following tools:
    Deploy your Azure web app with SMI using one of the following tools:
    1. Visual Studio: open the sample solution in Visual Studio, right click on the project name, select Publish, and follow the wizard to publish to Azure. For more details:[deploy using Visual Studio](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visualstudio-deploy).
    1. Visual Studio Code, install the code editor's [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice). Open the sample folder with Visual Studio Code, right click on the project name, select **Deploy to WebApp**, and follow the wizard to publish to Azure. For more details: [deploy using Visual Studio Code](../app-service/tutorial-dotnetcore-sqldb-app.md#4---deploy-to-the-app-service#tabpanel/visual-studio-code-deploy).
    1. Azure CLI:

        ```azurecli
        # Set up the deployment of the web app in Microsoft Azure App Service
        az webapp config appsettings set -g <myResourceGroupName> -n <myWebAppName> --settings PROJECT=connection-string/Microsoft.Azure.ServiceConnector.Sample/Microsoft.Azure.ServiceConnector.Sample.csproj

        # Set up the deployment source to the local git repo
        az webapp deployment source config-local-git -g <myResourceGroupName> -n <myWebAppName>

        # Get the publish credentials
        az webapp deployment list-publishing-credentials -g <myResourceGroupName> -n <myWebAppName>  --query "{Username:publishingUserName, Password:publishingPassword}"
        git remote add azure https://<myWebAppName>.scm.azurewebsites.net/<myWebAppName>.git
        
        # Push local main to the remote main branch. The command will prompt for a username and a password, which are in output of the above list-publishing-credentials command.
        git push azure main:main
        ```

---

To check if the connection is working, navigate to your web app at `https://<myWebAppName>.azurewebsites.net/` from your browser. Once the website is up, you'll see it displaying "Hello. Your Azure WebApp is connected to App Configuration by ServiceConnector now".

## How it works

Find below what Service Connector manages behind the scenes for each authentication type.

### [SMI](#tab/smi)

Service Connector manages the connection configuration for you:

- Set up the web app's `AZURE_APPCONFIGURATION_ENDPOINT` to let the application access it and get the App Configuration endpoint. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/system-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L37).
- Activate the web app's system-assigned managed authentication and grant App Configuration a Data Reader role to let the application authenticate to the App Configuration using DefaultAzureCredential from Azure.Identity. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/system-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L43).

### [UMI](#tab/umi)

Service Connector manages the connection configuration for you:

- Set up the web app's `AZURE_APPCONFIGURATION_ENDPOINT` to let the application access it and get the App Configuration endpoint. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/user-assigned-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L37).
- Activate the web app's system-assigned managed authentication and grant App Configuration a Data Reader role to let the application authenticate to the App Configuration using DefaultAzureCredential from Azure.Identity. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/user-assigned-managed-identity/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L43).

### [Service principal](#tab/serviceprincipal)

Service Connector manages the connection configuration for you:

- Set up the web app's `AZURE_APPCONFIGURATION_ENDPOINT` to let the application access it and get the App Configuration endpoint. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/service-principal/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L37).
- Activate the web app's system-assigned managed authentication and grant App Configuration a Data Reader role to let the application authenticate to the App Configuration using DefaultAzureCredential from Azure.Identity. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/service-principal/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L43).

### [Connection string](#tab/connectionstring)

Service Connector manages the connection configuration for you:

- Set up the web app's `AZURE_APPCONFIGURATION_ENDPOINT` to let the application access it and get the App Configuration endpoint. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/connection-string/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L37).
- Activate the web app's system-assigned managed authentication and grant App Configuration a Data Reader role to let the application authenticate to the App Configuration using DefaultAzureCredential from Azure.Identity. Access [sample code](https://github.com/Azure-Samples/serviceconnector-webapp-appconfig-dotnet/blob/main/connection-string/Microsoft.Azure.ServiceConnector.Sample/Program.cs#L43).

---

For more information, go to [Service Connector internals.](concept-service-connector-internals.md)

## Test (optional)

Optionally, do the following tests:

1. Update the value of the key `SampleApplication:Settings:Messages` in the App Configuration Store.

    ```azurecli
    az appconfig kv set -n <myAppConfigStoreName> --key SampleApplication:Settings:Messages --value hello --yes
    ```

1. Navigate to your Azure web app by going to `https://<myWebAppName>.azurewebsites.net/` and refresh the page. You'll see that the message is updated to "hello".

## Cleanup

Once you're done, delete the Azure resources you created.

`az group delete -n <myResourceGroupName> --yes`

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
