---
title: Connect an AKS app to Azure SQL Database
titlesuffix: Service Connector
description: Learn how to connect an app hosted on Azure Kubernetes Service (AKS) to Microsoft Azure SQL Database.
#customer intent: As a developer, I want to connect my application hosted on AKS to Azure SQL Database.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 01/28/2025
zone_pivot_group_filename: service-connector/zone-pivot-groups.json
zone_pivot_groups: aks-authtype
---

# Tutorial: Connect an AKS app to Azure SQL Database

In this tutorial, you learn how to connect an application deployed to AKS, to an Azure SQL Database, using service connector. You complete the following tasks:

> [!div class="checklist"]
> * Create an Azure SQL Database resource
> * Create a connection between the AKS cluster and the database with Service Connector.
> * Update your container
> * Update your application code
> * Clean up Azure resources.


## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* An application deployed to AKS.
* [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create an Azure SQL Database

1. Create a resource group to store the Azure resources you create in this tutorial using the [`az group create`](/cli/azure/group#az_group_create) command.

    ```azurecli-interactive
    az group create \
        --name $RESOURCE_GROUP \
        --location eastus
    ```

1. Follow the instructions to [create an Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart) in the resource group you created in the previous step. Make note of the server name, database name, and the database credentials for use throughout this tutorial.

## Create a service connection in AKS with Service Connector

### Register the Service Connector and Kubernetes Configuration resource providers

Register the Service Connector and Kubernetes Configuration resource providers using the [`az provider register`](/cli/azure/provider#az-provider-register) command.

```azurecli-interactive
az provider register --namespace Microsoft.ServiceLinker
```

```azurecli-interactive
az provider register --namespace Microsoft.KubernetesConfiguration
```

> [!TIP]
> You can check if these resource providers are already registered using the `az provider show --namespace "Microsoft.ServiceLinker" --query registrationState` and `az provider show --namespace "Microsoft.KubernetesConfiguration" --query registrationState` commands. If the output is `Registered`, then the service provider is already registered.


### Create a new connection

::: zone pivot="workload-id"

Create a service connection between your AKS cluster and your SQL database using Microsoft Entra Workload ID

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), navigate to your AKS cluster resource.
2. Select **Settings** > **Service Connector** > **Create**.
3. On the **Basics** tab, configure the following settings:

    * **Kubernetes namespace**: Select **default**.
    * **Service type**: Select **SQL Database**.
    * **Connection name**: Use the connection name provided by Service Connector or enter your own connection name.
    * **Subscription**: Select the subscription that includes the Azure SQL Database service.
    * **SQL server**: Select your SQL server.
    * **SQL database**: Select your SQL database.
    * **Client type**: The code language or framework you use to connect to the target service, such as **Python**.
    
    :::image type="content" source="media/tutorial-ask-sql/create-connection.png" alt-text="Screenshot of the Azure portal showing the form to create a new connection to a SQL database in AKS.":::

4. Select **Next: Authentication**.  On the **Authentication** tab, select **Workload Identity** and choose one **User assigned managed identity**.
5. Select **Next: Networking** > **Next: Review + create** >**Create On Cloud Shell**.
6. The Cloud Shell will be launched and execute the commands to create a connection. You may need to confirm some configuration changes during the command processing. Once command runs successfully, it will show connection information, and you can click refresh button in **Service Connector** pane to show the latest result.

### [Azure CLI](#tab/azure-cli)

Create a service connection to the SQL database using the [`az aks connection create sql`](/cli/azure/aks/connection/create#az-aks-connection-create-sql) command. You can run this command in two different ways:
    
   * generate the new connection step by step.
     
       ```azurecli-interactive
       az aks connection create sql
       ```
 
   * generate the new connection at once. Make sure you replace the following placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<cluster>`, `<target-subscription>`, `<target_resource_group>`, `<server>`, `<database>`, and `<***>`.
    
       ```azurecli-interactive
       az aks connection create sql \
          --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.ContainerService/managedClusters/<cluster> \
          --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Sql/servers/<server>/databases/<database> \
          --workload-identity /subscriptions/<identity-subscription>/resourcegroups/<resource_group>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity_name>
       ```

---

::: zone-end

::: zone pivot="connection-string"

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable. Select the authentication method *[Workload ID (Recommended)](tutorial-python-aks-sql-database-connection-string.md?pivots=workload-id#create-a-new-connection)*.

Create a service connection between your AKS cluster and your SQL database using a connection string

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com/), navigate to your AKS cluster resource.
2. Select **Settings** > **Service Connector** > **Create**.
3. On the **Basics** tab, configure the following settings:

    * **Kubernetes namespace**: Select **default**.
    * **Service type**: Select **SQL Database**.
    * **Connection name**: Use the connection name provided by Service Connector or enter your own connection name.
    * **Subscription**: Select the subscription that includes the Azure SQL Database service.
    * **SQL server**: Select your SQL server.
    * **SQL database**: Select your SQL database.
    * **Client type**: The code language or framework you use to connect to the target service, such as **Python**.
    
    :::image type="content" source="media/tutorial-ask-sql/create-connection.png" alt-text="Screenshot of the Azure portal showing the form to create a new connection to a SQL database in AKS.":::

4. Select **Next: Authentication**.  On the **Authentication** tab, enter your database username and password.
5. Select **Next: Networking** > **Next: Review + create** >**Create**.
6. Once the deployment is successful, you can view information about the new connection in the **Service Connector** pane.

### [Azure CLI](#tab/azure-cli)

Create a service connection to the SQL database using the [`az aks connection create sql`](/cli/azure/aks/connection/create#az-aks-connection-create-sql) command. You can run this command in two different ways:
    
   * generate the new connection step by step.
     
       ```azurecli-interactive
       az aks connection create sql
       ```
 
   * generate the new connection at once. Make sure you replace the following placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<cluster>`, `<target-subscription>`, `<target_resource_group>`, `<server>`, `<database>`, and `<***>`.
    
       ```azurecli-interactive
       az aks connection create sql \
          --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.ContainerService/managedClusters/<cluster> \
          --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Sql/servers/<server>/databases/<database> \
          --secret name=<secret-name> secret=<secret>
       ```

---

::: zone-end

## Update your container

Now that you created a connection between your AKS cluster and the database, you need to retrieve the connection secrets and deploy them in your container.

1. In the [Azure portal](https://portal.azure.com/), navigate to your AKS cluster resource. Under **Settings**, select **Service Connector**.
1. Select the newly created connection, and then select **YAML snippet**. This action opens a panel displaying a sample YAML file generated by Service Connector.
1. To set the connection secrets as environment variables in your container, you have two options:
    
    * Directly create a deployment using the YAML sample code snippet provided. The snippet includes highlighted sections showing the secret object that will be injected as the environment variables. Select **Apply** to proceed with this method.

        :::image type="content" source="media/tutorial-ask-sql/sample-yaml-snippet.png" alt-text="Screenshot of the Azure portal showing the sample YAML snippet to create a new connection to a SQL database in AKS.":::

   * Alternatively, under **Resource Type**, select **Kubernetes Workload**, and then select an existing Kubernetes workload. This action sets the secret object of your new connection as the environment variables for the selected workload. After selecting the workload, select **Apply**.

        :::image type="content" source="media/tutorial-ask-sql/kubernetes-snippet.png" alt-text="Screenshot of the Azure portal showing the Kubernetes snippet to create a new connection to a SQL database in AKS.":::

## Update your application code

As a final step, update your application code to use your environment variables, by [following these instructions](how-to-integrate-sql-database.md#connection-string).

## Clean up resources

If you no longer need the resources you created when following this tutorial, you can remove them by deleting the Azure resource group.

Delete your resource group using the [`az group delete`](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

Read the following articles to learn more about Service Connector concepts and how it helps AKS connect to Azure services:

* [Use Service Connector to connect AKS clusters to other cloud services](./how-to-use-service-connector-in-aks.md)
* [Learn about Service Connector concepts](./concept-service-connector-internals.md)
