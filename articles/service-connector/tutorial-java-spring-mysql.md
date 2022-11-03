---
title: 'Tutorial: Deploy an application to Azure Spring Apps and connect it to Azure Database for MySQL Single Server using Service Connector'
description: Create a Spring Boot application connected to Azure Database for MySQL Single Server with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: tutorial
ms.date: 11/02/2022
ms.custom: devx-track-azurecli, event-tier1-build-2022, engagement-fy23
ms.devlang: azurecli
---

# Tutorial: Deploy an application to Azure Spring Apps and connect it to Azure Database for MySQL Single Server using Service Connector

In this tutorial, you'll complete the following tasks using the Azure portal or the Azure CLI. Both methods are explained in the following procedures.

> [!div class="checklist"]
> * Provision an instance of Azure Spring Apps
> * Build and deploy apps to Azure Spring Apps
> * Integrate Azure Spring Apps with Azure Database for MySQL with Service Connector

> [!NOTE]
> Azure Database for MySQL is set to be deprecated, in favor of Azure Database for MySQL Flexible Server. To view the tutorial for MySQL Flexible Server, go to [Deploy an application to Azure Spring Apps and connect it to Azure Database for MySQL Flexible Server](tutorial-java-spring-mysql-flexible.md).

## Prerequisites

* [Install JDK 8 or JDK 11](/azure/developer/java/fundamentals/java-jdk-install)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli) and install the Azure Spring Apps extension with the command: `az extension add --name spring`

## Provision an instance of Azure Spring Apps

The following procedure uses the Azure CLI extension to provision an instance of Azure Spring Apps.

1. Update Azure CLI with the Azure Spring Apps extension.

    ```azurecli
    az extension update --name spring
    ```

1. Sign in to the Azure CLI and choose your active subscription.

    ```azurecli
    az login
    az account list -o table
    az account set --subscription <Name or ID of subscription, skip if you only have 1 subscription>
    ```

1. Create a resource group to contain your app and an instance of the Azure Spring Apps service.

    ```azurecli
    az group create --name ServiceConnector-tutorial-rg
    ```

1. Create an instance of Azure Spring Apps.  Its name must be between 4 and 32 characters long and can only contain lowercase letters, numbers, and hyphens. The first character of the Azure Spring Apps instance name must be a letter and the last character must be either a letter or a number.

    ```azurecli
    az spring create -n <service instance name> -g ServiceConnector-tutorial-rg
    ```

## Create an Azure Database for MySQL

The following procedure uses the Azure CLI extension to provision an instance of Azure Database for MySQL.

1. Install the [db-up](/cli/azure/mysql) extension.

    ```azurecli
    az extension add --name db-up
    ```

1. Create an Azure Database for MySQL server using the following command:

    ```azurecli
    az mysql up --resource-group ServiceConnector-tutorial-rg --admin-user <admin-username> --admin-password <admin-password>
    ```

    For *`<admin-username>`* and *`<admin-password>`*, specify credentials to create an administrator user for this MySQL server. The admin username can't be *azure_superuser*, *azure_pg_admin*, *admin*, *administrator*, *root*, *guest*, or *public*. It can't start with *pg_*. The password must contain **8 to 128 characters** from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters (for example, `!`, `#`, `%`). The password can't contain username.

    The server is created with the following default values unless you manually override them:

| **Setting**          | **Default value** | **Description**                                                                                                                                                                                                                                                                       |
|----------------------|-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| server-name          | System generated  | A unique name that identifies your Azure Database for MySQL server.                                                                                                                                                                                                                   |
| sku-name             | GP_Gen5_2         | The name of the sku. Follows the convention {pricing tier}\_{compute generation}\_{vCores} in shorthand. The default is a General Purpose Gen5 server with 2 vCores. For more information about prices, go to our [pricing page](https://azure.microsoft.com/pricing/details/mysql/). |
| backup-retention     | 7                 | How long a backup should be retained. Unit is days.                                                                                                                                                                                                                                   |
| geo-redundant-backup | Disabled          | Whether geo-redundant backups should be enabled for this server or not.                                                                                                                                                                                                               |
| location             | westus2           | The Azure location for the server.                                                                                                                                                                                                                                                    |
| ssl-enforcement      | Enabled           | Whether SSL should be enabled or not for this server.                                                                                                                                                                                                                                 |
| storage-size         | 5120              | The storage capacity of the server (unit is megabytes).                                                                                                                                                                                                                               |
| version              | 5.7               | The MySQL major version.                                                                                                                                                                                                                                                              |

> [!NOTE]
> For more information about the `az mysql up` command and its additional parameters, see the [Azure CLI documentation](/cli/azure/mysql#az-mysql-up).

Once your server is created, it comes with the following settings:

* A firewall rule called "devbox" is created. The Azure CLI attempts to detect the IP address of the machine the `az mysql up` command is run from and allows that IP address.
* "Allow access to Azure services" is set to ON. This setting configures the server's firewall to accept connections from all Azure resources, including resources not in your subscription.
* The `wait_timeout` parameter is set to 8 hours
* An empty database named `sampledb` is created
* A new user named "root" with privileges to `sampledb` is created

## Build and deploy the app

1. Create the app with public endpoint assigned. If you selected Java version 11 when generating the Spring Spring Apps project, include the `--runtime-version=Java_11` switch.

    ```azurecli
    az spring app create -n hellospring -s <service instance name> -g ServiceConnector-tutorial-rg --assign-endpoint true
    ```

1. Create service connections between Azure Spring Apps and MySQL database.

    ```azurecli
    az spring connection create mysql-flexible
    ```

    > [!NOTE]
    > If you see the error message "The subscription is not registered to use Microsoft.ServiceLinker", please run `az provider register -n Microsoft.ServiceLinker` to register the Service Connector resource provider and run the connection command again.

1. Clone sample code

    ```bash
    git clone https://github.com/Azure-Samples/serviceconnector-springcloud-mysql-springboot.git
    ```

1. Build the project using Maven.

    ```bash
    cd serviceconnector-springcloud-mysql-springboot
    mvn clean package -DskipTests 
    ```

1. Deploy the JAR file for the app (`target/demo-0.0.1-SNAPSHOT.jar`).

    ```azurecli
    az spring app deploy -n hellospring -s <service instance name> -g ServiceConnector-tutorial-rg  --artifact-path target/demo-0.0.1-SNAPSHOT.jar
    ```

1. Query app status after deployment with the following command.

    ```azurecli
    az spring app list -o table
    ```

    You should see the following output:

    ```output
    Name               Location    ResourceGroup    Production Deployment    Public Url                                           Provisioning Status    CPU    Memory    Running Instance    Registered Instance    Persistent Storage
    -----------------  ----------  ---------------  -----------------------  ---------------------------------------------------  ---------------------  -----  --------  ------------------  ---------------------  --------------------
    hellospring         eastus    <resource group>   default                                                                       Succeeded              1      2         1/1                 0/1                    -
    ```

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
