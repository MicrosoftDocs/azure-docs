---
title: "Quickstart - Integrate with Azure Database for MySQL"
description: Explains how to provision and prepare an Azure Database for MySQL instance, and then configure Pet Clinic on Azure Spring Apps to use it as a persistent database with only one command.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/15/2021
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

1. Allow access from Azure resources.

   ```azcli
   az mysql server firewall-rule create --name allAzureIPs \
    --server ${MYSQL_SERVER_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
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

1. Create database in the MySQL server and set corresponding settings.

   ```sql
   // SUBSTITUTE values
   mysql -u ${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
    -h ${MYSQL_SERVER_FULL_NAME} -P 3306 -p

   Enter password:
   Welcome to the MySQL monitor.  Commands end with ; or \g.
   Your MySQL connection id is 64379
   Server version: 5.6.39.0 MySQL Community Server (GPL)

   Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

   Oracle is a registered trademark of Oracle Corporation and/or its
   affiliates. Other names may be trademarks of their respective
   owners.

   Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

   mysql> CREATE DATABASE petclinic;
   Query OK, 1 row affected (0.10 sec)

   mysql> CREATE USER 'root' IDENTIFIED BY 'petclinic';
   Query OK, 0 rows affected (0.11 sec)

   mysql> GRANT ALL PRIVILEGES ON petclinic.* TO 'root';
   Query OK, 0 rows affected (1.29 sec)

   mysql> CALL mysql.az_load_timezone();
   Query OK, 3179 rows affected, 1 warning (6.34 sec)

   mysql> SELECT name FROM mysql.time_zone_name;
   ...

   mysql> quit
   Bye
   ```

1. Set timezone.

   ```azcli
   az mysql server configuration set \
       --resource-group ${RESOURCE_GROUP} \
       --name time_zone \
       --server ${MYSQL_SERVER_NAME} \
       --value "US/Pacific"
   ```

## Update Apps to use MySQL database

To enable MySQL as database for the sample app, simply update the *customer-service* app with active profile MySQL and database credentials as environment variables.

```azcli
az spring app update \
    --name customers-service \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql" \
    --env \
        MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
        MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
        MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
        MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
```

## Update extra apps

```azcli
az spring app update --name api-gateway \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql"
az spring app update --name admin-server \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql"
az spring app update --name customers-service \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql" \
    --env \
        MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
        MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
        MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
        MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
az spring app update --name vets-service \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql" \
    --env \
        MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
        MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
        MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
        MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
az spring app update --name visits-service \
    --jvm-options="-Xms2048m -Xmx2048m -Dspring.profiles.active=mysql" \
    --env \
        MYSQL_SERVER_FULL_NAME=${MYSQL_SERVER_FULL_NAME} \
        MYSQL_DATABASE_NAME=${MYSQL_DATABASE_NAME} \
        MYSQL_SERVER_ADMIN_LOGIN_NAME=${MYSQL_SERVER_ADMIN_LOGIN_NAME} \
        MYSQL_SERVER_ADMIN_PASSWORD=${MYSQL_SERVER_ADMIN_PASSWORD}
```

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
