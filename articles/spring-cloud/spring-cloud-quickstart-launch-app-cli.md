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
	
## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI with the following command

```Azure CLI
az extension add -y --source https://github.com/VSChina/azure-cli-extensions/releases/download/0.4/spring_cloud-0.4.0-py2.py3-none-any.whl
```


## Provision a service instance on the Azure CLI

1. Login to the Azure CLI and choose your active subscription. Be sure to choose the active subscription that is whitelisted for Azure Spring Cloud

```Azure CLI
az login
az account list -o table
az account set --subscription
```

1. First, be ready with resource name and resource group. The following is a brief explanation of each.

- Resource Name: Specify the name of your service instance.
- Resource group: Creating new resource groups for new resources is generally considered the best practice.

2. Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud. Note that we also tell Azure Spring Cloud to assign a public domain here.

```azurecli
az spring-cloud create -n <resource name> -g <resource group name> --is-public true
```
The service instance will take around five minutes to be fully deployed.

3. Set your default resource group name and cluster name using the following commands:

```Azure CLI
az configure --defaults group=<service group name>
az configure --defaults spring-cloud=<service instance name>
```

## Setup your configuration server

1. Get a copy of the already created config server files using the following command.

```git
git clone https://github.com/xscript/piggymetrics-config
```

2.	Then use the following command for each of the yaml files you cloned in the previous step.

```azurecli
az spring-cloud config-sever set --config-file -n
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
az spring-cloud app create --name gateway
```

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)

2. Repeat step 1 with the **auth-service** application and **account-service** application. These three microservice applications will comprise our Azure Spring Cloud service

```Azure CLI
az spring-cloud app create -n account-service
az spring-cloud app create -n auth-service
```


>[!NOTE]
> Application names have to be exactly "account-service" and "auth-service" for the provided configuration server to work properly.
> 


## Deploy applications and set environment variables

1. Finally, we need to actually deploy our applications to Azure. Use the following commands to deploy all three applications:

```azurecli
az spring-cloud app deploy -n gateway --jar-path ./gateway/target/gateway.jar
az spring-cloud app deploy -n account-service --jar-path ./account-service/target/account-service.jar
az spring-cloud app deploy -n auth-service --jar-path ./auth-service/target/auth-service.jar
```

![Application Screenshot](./media/spring-cloud-quickstart-launch-app-portal/application-screenshot.png)

## Assign public IP to gateway

Finally, we need a way to access the application via a web browser. Our gateway application needs a public facing IP, which can be assigned using the following command:

```Azure CLI
az spring-cloud app update -n gateway --is-public true
```
Now you can go to the assigned IP address and see the running application.

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
