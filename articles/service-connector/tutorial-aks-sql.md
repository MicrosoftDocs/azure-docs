---
title: Connect an AKS app to Azure SQL Database
titlesuffix: Service Connector
description: Learn how to connect an app hosted on Azure Kubernetes Service (AKS) to Microsoft Azure SQL Database.
#customer intent: As a developer, I want to connect my application hosted on AKS to Azure SQL Database.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 07/04/2024
---

# Tutorial: Connect an app deployed to AKS to Azure SQL Database (preview)

In this tutorial, you learn how to connect an application deployed to AKS, to an Azure SQL Database, using service connector (preview). You complete the following tasks:

> [!div class="checklist"]
> * Create an Azure SQL Database resource
> * Create a connection between the AKS cluster and the database with Service Connector.
> * Update your container
> * Update your application code
> * Clean up Azure resources.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* An application deployed to Azure Kubernetes Service.
* [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create an Azure SQL Database

1. Create a resource group for this tutorial, where you'll store your Azure resources.

    ```azurecli-interactive
    az group create \
        --name MyResourceGroup \
        --location eastus
    ```

1. Follow these instructions to [create an Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) in the resource group you created. Note your server name, database name, and the database credentials. You will need them later on.

## Create a service connection in AKS with Service Connector (preview)

### Register the Service Connector resource provider

If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command  `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

<!-- check if registering RP is still necessary-->

### Create a new connection

Create a service connection between your AKS cluster and your SQL database in the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

Open your AKS cluster in the Azure portal, and select **Settings** > **Service Connector (Preview)** in the left menu. Select **Create** and select or enter information following the instructions and examples below. Leave all other settings with their default values.

   1. Basics tab:

    | Setting                  | Example value     | Description                                                                              |
    |--------------------------|-------------------|------------------------------------------------------------------------------------------|
    | **Kubernetes namespace** | *default*         | The Kubernetes service namespace.                                                        |
    | **Service type**         | *SQL Database*    | Select the target service type you want to connect your.                                 |
    | **Connection name**      | *sql_connection*  | Use the connection name provided by Service Connector or enter your own connection name. |
    | **Subscription**         | *My Subscription* | Select the subscription that includes the Azure SQL Database service.                    |
    | **SQL server**           | *sql_server*      | Select your SQL server.                                                                  |
    | **SQL database**         | *sql_db*          | Select your SQL database.                                                                |
    | **Client type**          | *Python*          | The code language or framework you use to connect to the target service.                 |
    
    :::image type="content" source="media/tutorial-ask-sql/create-connection.png" alt-text="Screenshot of the Azure portal showing the form to create a new connection to a SQL database in AKS.":::

1. In the authentication tab, the connection string authentication method is selected by default, as it's the only method currently supported. Enter your database username and password.

1. Select **Next** until you reach the **Review + Create** tab that lists a summary of the configuration entered for the connection. If you're satisfied with the configuration, select **Create**.

1. Once the deployment is successful, you can view information about the new connection in the **Service Connector** pane.

## [Azure CLI](#tab/azure-cli)

1. Get access credentials for your AKS cluster using the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command.

    ```azurecli-interactive
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Use the Azure CLI command [az aks connection create sql](/cli/azure/aks/connection/create#az-aks-connection-create-sql) to create a service connection to the SQL database. There are several ways you can construct this command. For example:
    
    -  run the following interactive command to generate the new connection step by step.
    
    ```azurecli
    az aks connection create sql
    ```
    
    - or run a command following the example below. Replace the placeholders `<source-subscription>`, `<source_resource_group>`, `<cluster>`, `<target-subscription>`, `<target_resource_group>`, `<server>`, `<database>`, and `<***>` with your own information.
    
    ```azurecli
    az aks connection create sql \
        --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.ContainerService/managedClusters/<cluster> \
        --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Sql/servers/<server>/databases/<database> --secret name=<secret-name> secret=<secret>
    ```

---

### Update your container

Now that the connection between your AKS cluster and the database is created, retrieve the connection secrets and deploy them in your container.

1. In the **Service Connector (Preview)** menu, select the newly created connection using the checkbox. Then, select **Yaml snippet**. This action opens a panel displaying a sample YAML file generated by Service Connector.
1. To set the connection secrets as environment variables in your container, you have two options:
   - Directly create a deployment using the YAML sample code snippet provided. The snippet includes highlighted sections showing the secret object that will be injected as the environment variables. Select **Apply** to proceed with this method.

        :::image type="content" source="media/tutorial-ask-sql/sample-yaml-snippet.png" alt-text="Screenshot of the Azure portal showing the sample YAML snippet to create a new connection to a SQL database in AKS.":::

   - Alternatively, under **Resource Type**, select **Kubernetes Workload** and select an existing Kubernetes workload. This action sets the secret object of your new connection as the environment variables for the selected workload. After selecting the workload, select **Apply** to use this method.

        :::image type="content" source="media/tutorial-ask-sql/kubernetes-snippet.png" alt-text="Screenshot of the Azure portal showing the Kubernetes snippet to create a new connection to a SQL database in AKS.":::

### Update your application code

As a final step, update your application code to use your environment variables, [following these instructions](how-to-integrate-sql-database.md#connection-string).

## Clean up resources

If you no longer need the resources you created when following this tutorial, remove them by deleting the resource group.

```azurecli-interactive
az group delete \
    --resource-group MyResourceGroup
```

## Related content

Read the following articles to learn more about Service Connector concepts and how it helps AKS connect to Azure services:

* [Use Service Connector to connect AKS clusters to other cloud services](./how-to-use-service-connector-in-aks.md)
* [Learn about Service Connector concepts](./concept-service-connector-internals.md)
