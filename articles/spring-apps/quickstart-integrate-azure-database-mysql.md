---
title: "Quickstart - Integrate with Azure Database for MySQL"
description: Explains how to provision and prepare an Azure Database for MySQL instance, and then configure Pet Clinic on Azure Spring Apps to use it as a persistent database with only one command.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 08/26/2022
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022
---

# Quickstart: Integrate Azure Spring Apps with Azure Database for MySQL

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ❌ Enterprise tier

Pet Clinic, as deployed in the default configuration [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md), uses an in-memory database (HSQLDB) that is populated with data at startup. This quickstart explains how to provision and prepare an Azure Database for MySQL instance and then configure Pet Clinic on Azure Spring Apps to use it as a persistent database with only one command.

## Prerequisites

* [MySQL CLI is installed](http://dev.mysql.com/downloads/mysql/)

## Variables preparation

We will use the following values. Save them in a text file or environment variables to avoid errors. The password should be at least 8 characters long and contain at least one English uppercase letter, one English lowercase letter, one number, and one non-alphanumeric character (!, $, #, %, and so on.).

```bash
export RESOURCE_GROUP=<resource-group-name> # customize this
export MYSQL_SERVER_NAME=<mysql-server-name> # customize this
export MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_NAME}.mysql.database.azure.com
export MYSQL_SERVER_ADMIN_NAME=<admin-name> # customize this
export MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_NAME}\@${MYSQL_SERVER_NAME}
export MYSQL_SERVER_ADMIN_PASSWORD=<password> # customize this
export MYSQL_DATABASE_NAME=petclinic
```

## Prepare an Azure Database for MySQL instance

1. If you didn't run the following commands in the previous quickstarts, set the CLI defaults.

   ```azcli
   az configure --defaults group=<resource group name> spring-cloud=<service name>
   ```

1. Create an Azure Database for MySQL server.

   ```azcli
   az mysql server create --resource-group ${RESOURCE_GROUP} \
       --name ${MYSQL_SERVER_NAME} \
       --admin-user ${MYSQL_SERVER_ADMIN_NAME} \
       --admin-password ${MYSQL_SERVER_ADMIN_PASSWORD} \
       --sku-name GP_Gen5_2 \
       --ssl-enforcement Disabled \
       --version 5.7
   ```

1. Allow access from your dev machine for testing.

   ```azcli
   az mysql server firewall-rule create --name devMachine \
    --server ${MYSQL_SERVER_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --start-ip-address <ip-address-of-your-dev-machine> \
    --end-ip-address <ip-address-of-your-dev-machine>
   ```

1. Increase connection timeout.

   ```azcli
   az mysql server configuration set --name wait_timeout \
    --resource-group ${RESOURCE_GROUP} \
    --server ${MYSQL_SERVER_NAME} --value 2147483
   ```

## Create a MySQL database

Create a MySQL database in Azure with the [az msql db create](/cli/azure/mysql/db#az-mysql-db-create) command below. Replace the placeholders `<database-name>`, `<resource-group-name>` and `<server-name>` with a name for your new database, the name of a resource group, and a server name.

```azurecli-interactive
az mysql db create --name <database-name> --resource-group <resource-group-name> --server-name <server-name>
```

---

## Connect your application to the MySQL database

Use Service Connector to connect the app hosted in Azure Spring Apps to your MySQL database.

### [Azure CLI](#tab/azure-cli)

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

    ```azurecli-interactive
    az provider register -n Microsoft.ServiceLinker
    ```

1. Run the `az spring connection create` command to create a service connection between Azure Spring Apps and the Azure MySQL database. Replace the placeholders below by the your own information.

    | Setting                   | Description                                                                                  |
    |---------------------------|----------------------------------------------------------------------------------------------|
    | `--resource-group`        | The name of the resource group that contains the app hosted by Azure Spring Apps.            |
    | `--service`               | The name of the Azure Spring Apps resource.                                                  |
    | `--app`                  | The name of the application hosted by Azure Spring Apps that connects to the target service.  |
    | `--target-resource-group` | The name of the resource group with the storage account.                                     |
    | `--server`                | The MySQL server you want to connect to                                                      |
    | `--database`              | The name of the database you created earlier.                                                |
    | `--secret name`           | The MySQL server username.                                                                   |
    | `--secret`                | The MySQL server password.                                                                   |

    ```azurecli-interactive
    az spring connection create mysql --resource-group <Azure-Spring-Apps-resource-group-name> --service <Azure-Spring-Apps-resource-name> --app <app-name> --target-resource-group <mySQL-server-resource-group> --server <server-name> --database <database-name> --secret name=<username> secret=<secret>
    ```

    > [!TIP]
    > If the `az spring` command isn't recognized by the system, check that you have installed the Azure Spring Apps extension by running `az extension add --name spring`.

### [Portal](#tab/azure-portal)

1. In the Azure portal, type the name of your Azure Spring Apps instance in the search box at the top of the screen and select your instance.
1. Under **Settings**, select **Apps** and select the application from the list.
1. Select **Service Connector** from the left table of contents and select **Create**.

   :::image type="content" source="./media\quickstart-integrate-azure-database-mysql\create-service-connection.png" alt-text="Screenshot of the Azure portal, in the Azure Spring Apps instance, create a connection with Service Connector.":::

1. Select or enter the following settings in the table.

    | Setting             | Example                      | Description                                                                                                                                                                         |
    |---------------------|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *DB for MySQL single server* | Select the MySQL target service to connect the app to the MySQL database.                                                                                                           |
    | **Subscription**    | *my-subscription*            | The subscription that contains your target service (the service you want to connect to). The default value is the subscription that contains the app deployed to Azure Spring Apps. |
    | **Connection name** | *mysql_rk29a*                | The connection name that identifies the connection between your app and target service. Use the connection name provided by Service Connector or enter your own connection name.    |
    | **MySQL server**    | *MySQL80*                    | Select the MySQL server you want to connect to.                                                                                                                                     |
    | **MySQL database**  | *petclinic*                  | Select the database you created earlier.                                                                                                                                            |
    | **Client type**     | *.NET*                       | Select the application stack that works with the target service you selected.                                                                                                       |

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string > Database credentials** and enter your database username and password.

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service**. Enter your username and password so that your app can reach the database.

1. Select **Next: Review + Create** to review the provided information. Wait a few seconds for Service Connector to validate the information and select **Create** to create the service connection.

---

## Check connection to MySQL database

### [Azure CLI](#tab/azure-cli)

Run the `az spring connection show` command to show the status of the connection between Azure Spring Apps and the Azure MySQL database. Replace the placeholders below by the your own information.

```azurecli-interactive
az spring connection show --connection <connection-name> mysql --resource-group <Azure-Spring-Apps-resource-group-name> --service <Azure-Spring-Apps-resource-name> --app <app-name
```

The following output is displayed:

```Output
ClientType    Name         ProvisioningState    ResourceGroup
------------  -----------  -------------------  ---------------
none          mysql_rk29a  Succeeded            myspring
```

Provisioning state *Succeeded* means that the connection is valid.

> [!TIP]
> To get more details about the connection between your services, remove `--output table`from the above command.

### [Portal](#tab/azure-portal)

Azure Spring Apps connections are displayed under **Settings > Service Connector**. Select **Validate** to check your connection status, and select **Learn more** to review the connection validation details.

:::image type="content" source="./media\quickstart-integrate-azure-database-mysql\check-connection.png" alt-text="Screenshot of the Azure portal, in the Azure Spring Apps instance, check connection to MySQL database.":::

---

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

* [Bind an Azure Database for MySQL instance to your application in Azure Spring Apps](how-to-bind-mysql.md)
* [Use a managed identity to connect Azure SQL Database to an app in Azure Spring Apps](./connect-managed-identity-to-azure-sql.md)
