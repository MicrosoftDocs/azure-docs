---
title: Deploy a Java application with Azure Database for PostgreSQL server to Open Liberty/WebSphere Liberty on an Azure Kubernetes Service(AKS) cluster
recommendations: false
description: Deploy a Java application with Azure Database for PostgreSQL server to Open Liberty/WebSphere Liberty on an Azure Kubernetes Service(AKS) cluster
author: zhengchang907
ms.author: zhengchang
ms.service: container-service
ms.topic: how-to
ms.date: 11/19/2021
keywords: java, jakartaee, javaee, microprofile, open-liberty, websphere-liberty, aks, kubernetes
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks
---

PENDING: Read this guide for how to write how-to guides.  https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-write-howto?branch=master .  Make this conform to https://review.docs.microsoft.com/en-us/help/contribute/global-how-to-template?branch=master I suggest saving the existing document aside with a different file name, deleting the contents of this file, pasting in the template, and then copying the content over from the saved aside file.


# Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:  
* **Fill in step abstraction**  

The Open Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With Open Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps. 

For more details on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more details on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires the latest version of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* If running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
  * Install a Java SE implementation (for example, [AdoptOpenJDK OpenJDK 8 LTS/OpenJ9](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=openj9)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.

## Create IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service using our offer
### step guide to use the offer
### save the server.xml and deployment.yaml

## Create an Azure Database for PostgreSQL server

### Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.  

Create a resource group called *java-liberty-project-postgresql* using the [az group create](/cli/azure/group#az_group_create) command  in the *eastus* location. This resource group will be used later for creating the Azure Container Registry (ACR) instance and the AKS cluster. 

```azurecli-interactive
RESOURCE_GROUP_NAME=java-liberty-project-postgresql
az group create --name $RESOURCE_GROUP_NAME --location eastus
```

### Create the PostgreSQL server

Use the [az postgres server create](cli/azure/postgres/server#az_postgres_server_create) command to create the DB server. The following example creates an DB server named *youruniquedbname*. Make sure *youruniqueacrname* is unique within Azure.

```azurecli-interactive
export DB_NAME=youruniquedbname
export DB_ADMIN_USERNAME=myadmin
export DB_ADMIN_PASSWORD=<server_admin_password>
az postgres server create --resource-group $RESOURCE_GROUP_NAME --name $DB_NAME  --location eastus --admin-user $DB_ADMIN_USERNAME --admin-password $DB_ADMIN_PASSWORD --sku-name GP_Gen5_2
```

Alternatively, use the Azure portal by following the steps in [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal).



## Prepare your application with PostgreSQL DB connection
### Assumes your application is:
* Managed using Maven
* Using liberty-maven-plugin to configure DB connection

edburns: I agree with the use of `liberty-maven-plugin` here.  Given that you are assuming the user uses that plugin, I suggest you have a first step where you use the `liberty:devc` to run and test it locally before even asking the user to deal with any Azure complexity. See the [docs](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).  I added this in below.

### Build project
### dockerfile with JDBC driver
### Build image

### edburns: run with liberty:devc
## Prepare deployment files
### server.xml
### deployment yaml file

### Upload image to ACR

## Apply the changes
### Watch the pods to be restarted

## Verify the results
### Test the applications

## Clean up resources
To avoid Azure charges, you should clean up unnecessary resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

## Next steps
* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
