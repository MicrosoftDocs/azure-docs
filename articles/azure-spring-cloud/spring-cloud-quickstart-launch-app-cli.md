---
title: Launch a Java Spring application using the Azure CLI | Microsoft Docs
description: In this quickstart, you deploy a sample application to Azure Spring Cloud on the Azure CLI.
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# Quickstart: Launch a Java Spring application using the Azure CLI

Azure Spring Cloud enables you to easily run a Spring Boot based microservices application on Azure.

This quickstart shows you how to deploy an existing Java Spring Cloud application to Azure. When you're finished, you can continue to manage the application via the Azure CLI or switch to using the Azure portal.

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)

Using this application you learn how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Edit environment variables for applications
> * Assign public IP for your application gateway

## Prerequisites

To complete this quickstart:

1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
4. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
5. [Install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
	

## Provision a service instance on the Azure CLI

1. First, be ready with resource name, subscription ID, and resource group. The following is a brief explanation of each.

- Resource Name: Specify the name of your service instance.
- Subscription: Select the subscription you want to be billed for this resource.
- Resource group: Creating new resource groups for new resources is generally considered the best practice.

2. Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud. Note that we also tell Azure Spring Cloud to assign a public domain here. 

```azurecli
az asc create --name <resource name> --resource-group <resource group name> --is-public true
az configure --defaults asc=<resource name>
```

The service instance can take up to 10 minutes to be fully deployed.

## Setup your configuration server

1. Get a copy of the already created config server files using the following command.

```git
git clone https://github.com/xscript/piggymetrics-config
```

2.	Then use the following command for each of the yaml files you cloned in the previous step.

```azurecli
az asc config-sever set --config-file <yaml file path>
```

## Build the microservices applications locally

1. Run the following command to clone the sample app repository to your local machine.

```git
git clone https://github.com/xscript/PiggyMetrics
```

2.	Change directory and build the project by running below commands.

```git
cd PiggyMetrics
mvn clean package -D skipTests
```

You should now have individual JAR files for each service in their respective folders.

## Create the microservices applications in Azure

1. Using the Azure CLI, create a corresponding application in Azure for the JAR files we just built in the previous step. For our example service, the name of the first application is **gateway**.

```azurecli
az asc app create --name <app name> 
az configure --defaults ascapp=<app name>
```

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)

2. Repeat step 1 with the **auth-service** application and **account-service** application. These three microservice applications will comprise our Azure Spring Cloud service


>[!NOTE]
> Application names have to be exactly "account-service" and "auth-service" for the provided configuration server to work properly.
> 
> 


- Application Name: Use "gateway" as the application name.
- Artifact Type: Only JAR file is supported at this time.
- Select Artifact: Upload the JAR file from your local machine. Choose JAR file from PiggyMetrics\gateway\target\gateway.jar.
- Java Environment: The Java Runtime version. Only Java 8 is supported at this time.
-	Port: Specify the port number of your application. Use 80 here.
-	vCPU: Specify the maximum CPU resource for your application. Use 0.5 here.
-	Memory: Specify the maximum memory resource for your application. Use 1000 MB here.
-	App Instance Count: Specify the instance count of your application. You can specify more than 2 instances for more capacity and high availability. The instance count can be updated after creation. Use 1 here. 

## Deploy applications and set environment variables

1. Finally, we need to actually deploy our application files to Azure. Use the following command for the gateway application:

```azurecli
az asc app deploy --name gateway --jar-path PiggyMetrics\gateway\target\gateway.jar
```

2. Next is the account-service application. We will also set an environment variable here, which essential to run the application. Use the following command:

```azurecli
az asc app deploy --name account-service --jar-path PiggyMetrics\account-service\target\account-service.jar --env security.oauth2.client.client-secret=XUoJBrTtqXBonU5zMVzSUtrLPKRQztLUQE4poDoIR1QdcDfGgnGgJO5wbFC7xCEL
```

3. Finally, we'll deploy the auth-service application. Use the following command:

```azurecli
az asc app deploy --name auth-service --jar-path PiggyMetrics\auth-service\target\auth-service.jar --env ACCOUNT_SERVICE_PASSWORD=XUoJBrTtqXBonU5zMVzSUtrLPKRQztLUQE4poDoIR1QdcDfGgnGgJO5wbFC7xCEL
```

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)

## Assign public IP to gateway
???how to accesss application?

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)


## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Edit environment variables for applications
> * Assign public IP for your application gateway

To learn more about Service Fabric and .NET, take a look at this tutorial:
<!-- > [!div class="nextstepaction"]
> [.NET application on Service Fabric](service-fabric-tutorial-create-dotnet-app.md) -->
