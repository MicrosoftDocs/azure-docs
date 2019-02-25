---
title: Use an Open Service Broker for Azure database with an application on Pivotal Cloud Foundry
author: zr-msft
manager: jeconnoc
#temporary service name
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.author: zarhoads
ms.date: 01/11/2019
ms.topic: tutorial
description: Explains how to configure a Pivotal Cloud Foundry application to use an Open Service Broker for Azure database
keywords: "Pivotal Cloud Foundry, Cloud Foundry, Open Service Broker, Open Service Broker for Azure"
tags: Cloud-Foundry
---

# Tutorial: Use an Open Service Broker for Azure database with an application on Pivotal Cloud Foundry

Using Open Service Broker for Azure with a Pivotal Cloud Foundry instance allows you to provision services, such as databases, in Azure directly from the Cloud Foundry CLI and your Pivotal Cloud Foundry instance. You can also bind those services to an application running in your Pivotal Cloud Foundry instance. When you bind an application to a service in this manner, you do not have to update any code or configuration within your application. This article explains how to use an Open Service Broker for Azure service for a database with an application in Pivotal Cloud Foundry.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare your application space in Pivotal Cloud Foundry.
> * Clone a sample application source from GitHub.
> * Prepare the application for deployment.
> * Deploy the application.
> * Create a database using Open Service Broker for Azure.
> * Bind the database to your application.

## Prerequisites

Before you can proceed, you must:

* [Have Pivotal Cloud Foundry installed and configured](create-cloud-foundry-on-azure.md)
* [Have Open Service Broker for Azure installed and configured](https://network.pivotal.io/products/azure-open-service-broker-pcf) with your Cloud Foundry instance

Here is an example of the Pivotal Cloud Foundry Ops Manager screen with the Open Service Broker for Azure tile installed and configured:

![Pivotal Cloud Foundry with Open Service Broker for Azure installed](media/pcf-ops-manager.png)

## Prepare your application space in Pivotal Cloud Foundry

In order to deploy your application to your Pivotal Cloud Foundry instance, you need to be logged in with the `cf` command-line tool. You also must have your desired organization and space targeted.

To verify you're logged in and display the space you're targeting, use `cf target`. The below example shows the user already logged in as *admin*, using the *myorg* organization, and targeting the *dev* space:

```cmd
$ cf target

api endpoint:   https://api.system.40.85.111.222.cf.pcfazure.com
api version:    2.120.0
user:           admin
org:            myorg
space:          dev
```

To sign in, use `cf login`:

```cmd
cf login -a https://api.SYSTEMDOMAINURL --skip-ssl-validation
```

To create a new organization and space, use `cf create-org` and `cf create-space`:

```cmd 
cf create-org myorg
cf create-space dev -o myorg
```

To target a space, use `cf target`:

```cmd
cf target -o myorg -s dev
```

## Get application code

In order for an application to use Open Service Broker for Azure, the application needs to use as datasource, such as a database. In this article, we will use the [spring music sample application from Cloud Foundry](https://github.com/cloudfoundry-samples/spring-music) to demonstrate an application that uses a datasource.

Clone the application from GitHub and navigate into its directory:

```cmd
git clone https://github.com/cloudfoundry-samples/spring-music
cd spring music
```

> [!TIP]
> To view the datasources for this application, open the [src/main/resources/application.yml](https://github.com/cloudfoundry-samples/spring-music/blob/master/src/main/resources/application.yml) file.


## Prepare the application for deployment

Before you can deploy the application to your Pivotal Cloud Foundry instance, you need to build it. For demonstrative purpose, we are also enabling some *DEBUG* logging that will log the datasource connection information.

To enable the *DEBUG* logging for database connection details, add the below yaml property to the end of *application.yml*:

```yaml
---
logging:
  level:
    com.zaxxer.hikari: DEBUG
```

The sample application uses gradle to build the application into a Spring Boot runnable jar. The runnable jar will be deployed to your Pivotal Cloud Foundry instance. To build the application:

```cmd
./gradlew clean assemble

Starting a Gradle Daemon (subsequent builds will be faster)

BUILD SUCCESSFUL in 10s
4 actionable tasks: 4 executed
```


## Deploy your application

Use the `cf push` command to deploy the application to your Pivotal Cloud Foundry instance:

```cmd
cf push

Pushing from manifest to org myorg / space dev as admin...
Using manifest file /path/to/spring-music/manifest.yml
Getting app info...
Creating app with these attributes...
+ name:       spring-music
...
Waiting for app to start...

name:              spring-music
requested state:   started
routes:            spring-music-wacky-oribi.app.40.85.111.222.cf.pcfazure.com
...
     state     since                  cpu    memory         disk           details
#0   running   2018-12-06T21:24:06Z   0.0%   313.3M of 1G   170.7M of 1G
```

Copy the value from *routes* displayed in the out from `cf push`. The route is the URL you will use to access the running application. For example:

```cmd
...
routes:            spring-music-wacky-oribi.app.40.85.111.222.cf.pcfazure.com
...
```


Once your application is deployed, you can view the application's logs to see the connection URL used by the application. The below command displays the application's logs and uses `grep` to search for the *jdbcUrl* configuration.

```cmd
cf logs spring-music --recent | grep jdbcUrl

2018-12-07T14:44:30.57-0600 [APP/PROC/WEB/0] OUT 2018-12-07 20:44:30.574 DEBUG 24 --- [           main] com.zaxxer.hikari.HikariConfig           : jdbcUrl.........................jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

Notice the application is using *h2:mem:testdb*, which is the in-memory database. A Spring application is automatically configured to use an in-memory database when an in-memory database dependency is on the classpath and [auto-configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/using-boot-auto-configuration.html) is enabled. The sample application has the [h2 in-memory database dependency configured](https://github.com/cloudfoundry-samples/spring-music/blob/master/build.gradle#L49) and auto-configuration enabled in [src/main/java/org/cloudfoundry/samples/music/Application.java](https://github.com/cloudfoundry-samples/spring-music/blob/master/src/main/java/org/cloudfoundry/samples/music/Application.java#L8).

Use the application's route to navigate to it in a browser. The route, or URL, is displayed in the output from the `cf push` command.

> [!TIP]
> You can also display the application's URL by running `cf apps`.

Once you navigate to the application using your browser, interact with it by deleting a few existing albums and creating a few new ones. The sample application is using the in-memory database to save your changes. You will also notice the application has been populated with some [default data](https://github.com/cloudfoundry-samples/spring-music/blob/master/src/main/resources/albums.json). 

![Spring Music app with default data](media/music-app.png)

Since your application is using an in-memory database, your changes will not be persisted if your application is restarted or redeployed. To show that changes are not persisted, after you have made some changes, restage your application using `cf restage`:

```cmd
cf restage spring-music
```

After the application has been restaged, navigate to it in a browser using the same URL. Notice the changes you made are gone and the default data is displayed.

![Spring Music app with default data](media/music-app.png)

## Create a database

To create a persistent database on Azure using Open Service Broker, use the `cf create-service` command. The below command provisions a PostgreSQL database in Azure in the resource group *MyResourceGroup* in the *eastus* region. More information on *resourceGroup*, *location*, and other Azure-specific JSON parameters is available in the [PostgreSQL module reference documentation](https://github.com/Azure/open-service-broker-azure/blob/master/docs/modules/postgresql.md#provision):

```cmd
cf create-service azure-postgresql-9-6 general-purpose mypgsql -c '{"resourceGroup":"MyResourceGroup", "location":"eastus"}'
```

The database is exposed in your Pivotal Cloud Foundry instance as a service named *mypgsql*. Once your database has completed provisioning, which should take a few minutes, you can bind it your application. To verify your database has completed provisioning, use the `cf services` command:

```cmd
cf services

Getting services in org myorg / space dev as admin...

name      service                plan              bound apps     last operation
mypgsql   azure-postgresql-9-6   general-purpose                  create succeeded
```

The *last operation* value for your service will be *create succeeded* when it has completed provisioning.

## Bind the database to your application

Use the `bind-service` command to bind the service to your application.

```cmd
cf bind-service spring-music mypgsql
```

After you bind the service to your application, you have to restage the application for the changes to take effect.

```cmd
cf restage spring-music
```

The application is [configured to use Spring Cloud Connectors](https://github.com/cloudfoundry-samples/spring-music/blob/master/build.gradle#L45...L46), which allows your Pivotal Cloud Foundry instance to use [auto-reconfiguration](https://docs.cloudfoundry.org/buildpacks/java/configuring-service-connections/spring-service-bindings.html#auto) on your application's datasource. In this case, your Pivotal Cloud Foundry instance will automatically reconfigure your application to use a service its bound to for a datasource when your application is restaged.

Once your application has been restaged, it will use *mypgsql* for storing data instead of the in-memory database.

Any changes you make will now be persisted across restarts and redeploys. You can also see the connection URL the application is using by viewing the application's logs again.

```cmd
cf logs spring-music --recent | grep jdbcUrl

2018-12-07T14:44:30.57-0600 [APP/PROC/WEB/0] OUT 2018-12-07 20:44:30.574 DEBUG 24 --- [           main] com.zaxxer.hikari.HikariConfig           : jdbcUrl.........................jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
2018-12-07T14:48:58.10-0600 [APP/PROC/WEB/0] OUT 2018-12-07 20:48:58.107 DEBUG 16 --- [           main] com.zaxxer.hikari.HikariConfig           : jdbcUrl.........................jdbc:postgresql://12345678-aaaa-bbbb-cccc-1234567890ab.postgres.database.azure.com:5432/123456789?user=aabbcc1122@12345678-aaaa-bbbb-cccc-1234567890ab&password=<masked>&&sslmode=require
```

Notice there are two entries:

* The original value of *h2:mem:testdb*.
* The updated value for your PostgreSQL database when your application was restaged.

To verify data is being persisted to the PostgreSQL database, navigate to the application in your browser, make some changes, then restage your application:

```cmd
cf restage spring-music
```

After the application has been restaged, navigate to it in a browser using the same URL. Notice the changes you made are still there.

## Cleanup

If you want to disconnect your application from the database, you can unbind it using the `cf unbind-service` command.

```cmd
cf unbind-service spring-music mypgsql
```

Similar to binding your application to a service, you must restage your application for these changes to take effect. This action will leave both *mypgsql* and your application intact, but your application will begin using the in-memory database instead of *mypgsql*.

To delete your database, you can use the `cf delete-service` command. *You cannot undo this action so be sure you want to delete your database before proceeding.*

```cmd
cf delete-service mypgsql
```

To remove your application from your Pivotal Cloud Foundry instance:
 
```cmd
cf delete spring-music
```

## Next steps

This tutorial covered deploying an application to Pivotal Cloud Foundry as well as creating a database using Open Service Broker for Azure. It also covered binding your database to your application within your Pivotal Cloud Foundry instance. For more information about deploying applications to Cloud Foundry on Azure, see:

* [Cloud Foundry on Azure](../virtual-machines/linux/cloudfoundry-get-started.md)
* [Deploy your first app to Cloud Foundry on Microsoft Azure](../virtual-machines/linux/cloudfoundry-deploy-your-first-app.md)