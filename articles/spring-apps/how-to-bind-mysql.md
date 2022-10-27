---
title: How to bind an Azure Database for MySQL instance to your application in Azure Spring Apps
description: Learn how to bind an Azure Database for MySQL instance to your application in Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/26/2022
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022
---

# Bind an Azure Database for MySQL instance to your application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

With Azure Spring Apps, you can bind select Azure services to your applications automatically, instead of having to configure your Spring Boot application manually. This article shows you how to bind your application to your Azure Database for MySQL instance.

## Prerequisites

* An application deployed to Azure Spring Apps. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).
* An Azure Database for PostgreSQL Flexible Server instance.
* [Azure CLI](/cli/azure/install-azure-cli) version 2.41.0 or higher.

## Prepare your Java project

1. In your project's *pom.xml* file, add the following dependency:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-jpa</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-jdbc-mysql</artifactId>
   </dependency>
   ```

1. In the *application.properties* file, remove any `spring.datasource.*` properties.

1. Update the current app by running `az spring app deploy`, or create a new deployment for this change by running `az spring app deployment create`.

## Bind your app to the Azure Database for MySQL instance

#### [Service Binding](#tab/Service-Binding)

1. Note the admin username and password of your Azure Database for MySQL account.

1. Connect to the server, create a database named **testdb** from a MySQL client, and then create a new non-admin account.

1. In the Azure portal, on your **Azure Spring Apps** service page, look for the **Application Dashboard**, and then select the application to bind to your Azure Database for MySQL instance.  This is the same application that you updated or deployed in the previous step.

1. Select **Service binding**, and then select the **Create service binding** button.

1. Fill out the form, selecting **Azure MySQL** as the **Binding type**, using the same database name you used earlier, and using the same username and password you noted in the first step.

1. Restart the app, and this binding should now work.

1. To ensure that the service binding is correct, select the binding name, and then verify its detail. The `property` field should look like this:

   ```properties
   spring.datasource.url=jdbc:mysql://some-server.mysql.database.azure.com:3306/testdb?useSSL=true&requireSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC
   spring.datasource.username=admin@some-server
   spring.datasource.password=abc******
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
   ```

#### [Passwordless connection using a managed identity](#tab/Passwordless)

Configure your Spring app to connect to a MySQL Database Flexible Server with a system-assigned managed identity by using the `az spring connection create` command, as shown in the following example.

```azurecli
az spring connection create mysql-flexible \
    --resource-group $AZURE_SPRING_APPS_RESOURCE_GROUP \
    --service $AZURE_SPRING_APPS_SERVICE_INSTANCE_NAME \
    --app $APP_NAME \
    --deployment $DEPLOYMENT_NAME \
    --target-resource-group $MYSQL_RESOURCE_GROUP \
    --server $MYSQL_SERVER_NAME \
    --database $DATABASE_NAME \
    --system-assigned-identity
```

#### [Terraform](#tab/Terraform)

The following Terraform script shows how to set up an Azure Spring Apps app with Azure Database for MySQL.

```terraform
provider "azurerm" {
  features {}
}

variable "application_name" {
  type        = string
  description = "The name of your application"
  default     = "demo-abc"
}

variable "administrator_login" {
  type        = string
  description = "The MySQL administrator login"
  default     = "myadmin"
}

resource "azurerm_resource_group" "example" {
  name     = "example-resources"
  location = "West Europe"
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "_%@"
}

resource "azurerm_mysql_server" "database" {
  name                = "mysql-${var.application_name}-001"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location

  administrator_login          = var.administrator_login
  administrator_login_password = random_password.password.result

  sku_name                          = "B_Gen5_1"
  storage_mb                        = 5120
  version                           = "5.7"
  auto_grow_enabled                 = true
  backup_retention_days             = 7
  geo_redundant_backup_enabled      = false
  infrastructure_encryption_enabled = false
  public_network_access_enabled     = true
  ssl_enforcement_enabled           = true
  ssl_minimal_tls_version_enforced  = "TLS1_2"
}

resource "azurerm_mysql_database" "database" {
  name                = "mysqldb-${var.application_name}-001"
  resource_group_name = azurerm_resource_group.example.name
  server_name         = azurerm_mysql_server.database.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

# This rule is to enable the 'Allow access to Azure services' checkbox
resource "azurerm_mysql_firewall_rule" "database" {
  name                = "mysqlfw-${var.application_name}-001"
  resource_group_name = azurerm_resource_group.example.name
  server_name         = azurerm_mysql_server.database.name
  start_ip_address    = "0.0.0.0"
  end_ip_address      = "0.0.0.0"
}

resource "azurerm_spring_cloud_service" "example" {
  name                = "example-springcloud"
  resource_group_name = azurerm_resource_group.example.name
  location            = azurerm_resource_group.example.location
}

resource "azurerm_spring_cloud_app" "example" {
  name                = "example-springcloudapp"
  resource_group_name = azurerm_resource_group.example.name
  service_name        = azurerm_spring_cloud_service.example.name
  is_public           = true
  https_only          = true
}

resource "azurerm_spring_cloud_java_deployment" "example" {
  name                = "default"
  spring_cloud_app_id = azurerm_spring_cloud_app.example.id
  quota {
    cpu    = "2"
    memory = "4Gi"
  }
  instance_count      = 2
  jvm_options         = "-XX:+PrintGC"
  runtime_version     = "Java_11"

  environment_variables = {
    "spring.datasource.url" : "jdbc:mysql://${azurerm_mysql_server.database.fqdn}:3306/${azurerm_mysql_database.database.name}?useSSL=true&requireSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC"
    "spring.datasource.username" : "${var.administrator_login}@${azurerm_mysql_server.database.name}"
    "spring.datasource.password" : random_password.password.result
    "spring.jpa.properties.hibernate.dialect" : "org.hibernate.dialect.MySQL5InnoDBDialect"
  }
}

resource "azurerm_spring_cloud_active_deployment" "example" {
  spring_cloud_app_id = azurerm_spring_cloud_app.example.id
  deployment_name     = azurerm_spring_cloud_java_deployment.example.name
}
```

---

## Next steps

In this article, you learned how to bind an application in Azure Spring Apps to an Azure Database for MySQL instance. To learn more about binding services to an application, see [Bind an Azure Cosmos DB database to an application in Azure Spring Apps](./how-to-bind-cosmos.md).
