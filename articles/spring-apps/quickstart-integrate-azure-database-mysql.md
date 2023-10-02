---
title: "Quickstart - Integrate with Azure Database for MySQL"
description: Explains how to provision and prepare an Azure Database for MySQL instance, and then configure Pet Clinic on Azure Spring Apps to use it as a persistent database with only one command.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: quickstart
ms.date: 08/28/2022
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, service-connector
---

# Quickstart: Integrate Azure Spring Apps with Azure Database for MySQL

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ❌ Enterprise

Pet Clinic, as deployed in the default configuration [Quickstart: Build and deploy apps to Azure Spring Apps](./quickstart-deploy-apps.md), uses an in-memory database (HSQLDB) that is populated with data at startup. This quickstart explains how to provision and prepare an Azure Database for MySQL instance and then configure Pet Clinic on Azure Spring Apps to use it as a persistent database.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create an Azure Database for MySQL instance

Create an Azure Database for MySQL flexible server using the [az mysql flexible-server create](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-create) command. Replace the placeholders `<database-name>`, `<resource-group-name>`, `<MySQL-flexible-server-name>`, `<admin-username>`, and `<admin-password>` with a name for your new database, the name of your resource group, a name for your new server, and an admin username and password. Use single quotes around the value for `admin-password`.

```azurecli-interactive
az mysql flexible-server create \
    --resource-group <resource-group-name> \
    --name <MySQL-flexible-server-name> \
    --database-name <database-name> \
    --public-access 0.0.0.0 \
    --admin-user <admin-username> \
    --admin-password '<admin-password>'
```

> [!NOTE]
> The `Standard_B1ms` SKU is used by default. For pricing details, see [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/).

> [!TIP]
> The password should be at least eight characters long and contain at least one English uppercase letter, one English lowercase letter, one number, and one non-alphanumeric character (!, $, #, %, and so on.).

## Connect your application to the MySQL database

Use [Service Connector](../service-connector/overview.md) to connect the app hosted in Azure Spring Apps to your MySQL database.

> [!NOTE]
> The service binding feature in Azure Spring Apps is being deprecated in favor of Service Connector.

### [Azure CLI](#tab/azure-cli)

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli-interactive
   az provider register --namespace Microsoft.ServiceLinker
   ```

1. Run the `az spring connection create` command to create a service connection between the `customers-service` app and the Azure MySQL database. Replace the placeholders for the following settings with your own information. Use single quotes around the value for MySQL server `secret`.

   | Setting                   | Description                                                                                    |
   |---------------------------|------------------------------------------------------------------------------------------------|
   | `--connection`            | The name of the connection that identifies the connection between your app and target service. |
   | `--resource-group`        | The name of the resource group that contains the app hosted by Azure Spring Apps.              |
   | `--service`               | The name of the Azure Spring Apps resource.                                                    |
   | `--app`                   | The name of the application hosted by Azure Spring Apps that connects to the target service.   |
   | `--target-resource-group` | The name of the resource group with the storage account.                                       |
   | `--server`                | The MySQL server you want to connect to                                                        |
   | `--database`              | The name of the database you created earlier.                                                  |
   | `--secret name= secret=`  | The MySQL server username and password.                                                        |

   ```azurecli-interactive
   az spring connection create mysql-flexible \
       --resource-group <Azure-Spring-Apps-resource-group-name> \
       --service <Azure-Spring-Apps-resource-name> \
       --app customers-service \
       --connection <mysql-connection-name-for-app> \
       --target-resource-group <mySQL-server-resource-group> \
       --server <server-name> \
       --database <database-name> \
       --secret name=<username> secret='<secret>'
   ```

   > [!TIP]
   > If the `az spring` command isn't recognized by the system, check that you have installed the Azure Spring Apps extension by running `az extension add --name spring`.

### [Azure portal](#tab/azure-portal)

1. In the Azure portal, type the name of your Azure Spring Apps instance in the search box at the top of the screen and select your instance.
1. Under **Settings**, select **Apps**, and then select the `customers-service` application from the list.
1. Select **Service Connector** from the left table of contents and select **Create**.

   :::image type="content" source="./media\quickstart-integrate-azure-database-mysql\create-service-connection.png" alt-text="Screenshot of the Azure portal, in the Azure Spring Apps instance, create a connection with Service Connector.":::

1. Select or enter the following settings in the table.

   | Setting                   | Example                        | Description                                                                                                                                                                      |
   |---------------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | **Service type**          | *DB for MySQL flexible server* | Select DB for MySQL flexible server as your target service                                                                                                                       |
   | **Connection name**       | *mysql_9e8af*                  | The connection name that identifies the connection between your app and target service. Use the connection name provided by Service Connector or enter your own connection name. |
   | **Subscription**          | *My Subscription*              | The subscription that contains your target service. The default value is the subscription that contains the app deployed to Azure Spring Apps.                                   |
   | **MySQL flexible server** | *MySQL80*                      | Select the MySQL flexible server you want to connect to.                                                                                                                         |
   | **MySQL database**        | *petclinic*                    | Select the database you created earlier.                                                                                                                                         |
   | **Client type**           | *SpringBoot*                   | Select the application stack that works with the target service you selected.                                                                                                    |

   :::image type="content" source="./media\quickstart-integrate-azure-database-mysql\basics-tab.png" alt-text="Screenshot of the Azure portal, filling out the basics tab in Service Connector.":::

1. Select **Next: Authentication** to select the authentication type. Then select **Connection string > Database credentials** and enter your database username and password.

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service**. Enter your username and password so that your app can reach the database.

1. Select **Next: Review + Create** to review the provided information. Wait a few seconds for Service Connector to validate the information and select **Create** to create the service connection.

---

Repeat these steps to create connections for the `customers-service`, `vets-service`, and `visits-service` applications.

## Check connection to MySQL database

### [Azure CLI](#tab/azure-cli)

Run the `az spring connection validate` command to show the status of the connection between the `customers-service` app and the Azure MySQL database. Replace the placeholders with your own information.

```azurecli-interactive
az spring connection validate \
    --resource-group <Azure-Spring-Apps-resource-group-name> \
    --service <Azure-Spring-Apps-resource-name> \
    --app customers-service \
    --connection <mysql-connection-name-for-app> \
    --output table
```

The following output is displayed:

```Output
Name                                  Result    Description
------------------------------------  --------  -------------
Target resource existence validated.  success
Target service firewall validated.    success
Username and password validated.      success
```

> [!TIP]
> To get more details about the connection between your services, remove `--output table` from the above command.

### [Azure portal](#tab/azure-portal)

Azure Spring Apps connections are displayed under **Settings > Service Connector**. Select **Validate** to check your connection status, and select **Learn more** to review the connection validation details.

:::image type="content" source="./media\quickstart-integrate-azure-database-mysql\check-connection.png" alt-text="Screenshot of the Azure portal, in the Azure Spring Apps instance, check connection to MySQL database.":::

---

Repeat these instructions to validate the connections for the `customers-service`, `vets-service`, and `visits-service` applications.

## Update apps to use MySQL profile

The following section explains how to update the apps to connect to the MySQL database.

### [Azure CLI](#tab/azure-cli)

Use the following command to set an environment variable to activate the `mysql` profile for the `customers-service` app:

```azurecli
az spring app update \
    --resource-group <Azure-Spring-Apps-resource-group-name> \
    --service <Azure-Spring-Apps-resource-name> \
    --name customers-service \
    --env SPRING_PROFILES_ACTIVE=mysql
```

### [Azure portal](#tab/azure-portal)

Use the following steps to set an environment variable to activate the `mysql` profile for the `customers-service` app:

1. Go to the Azure Spring Apps instance overview page, select **Apps** from the navigation menu, and then select the **customers-service** application from the list.

1. On the **customers-service Overview** page, select **Configuration** from the navigation menu.

1. On the **Configuration** page, select **Environment variables**. Enter `SPRING_PROFILES_ACTIVE` for **Key**, enter `mysql` for **Value**, and then select **Save**.

   :::image type="content" source="media/quickstart-integrate-azure-database-mysql/customers-service-app-configuration.png" alt-text="Screenshot of the Azure portal showing the configuration settings for the customers-service app." lightbox="media/quickstart-integrate-azure-database-mysql/customers-service-app-configuration.png":::

---

Repeat these instructions to update app configuration for the `customers-service`, `vets-service`, and `visits-service` applications.

## Validate the apps

To validate the Pet Clinic service and to query records from the MySQL database to confirm the database connection, follow the instructions in the [Verify the services](./quickstart-deploy-apps.md?pivots=programming-language-java#verify-the-services) section of [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md).

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command, which deletes the resources in the resource group. Replace `<resource-group>` with the name of your resource group.

```azurecli
az group delete --name <resource-group>
```

## Next steps

* [Bind an Azure Database for MySQL instance to your application in Azure Spring Apps](./how-to-bind-mysql.md)
* [Use a managed identity to connect Azure SQL Database to an app in Azure Spring Apps](./connect-managed-identity-to-azure-sql.md)
