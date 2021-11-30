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


# Deploy a Java application with Azure Database for PostgreSQL server to Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:  
* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime with PostgreSQL DB connection.
* Build the application Docker image using Open Liberty container images.
* Deploy the containerized application to an AKS cluster using the Open Liberty Operator.   

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

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 
- A user-assigned managed identity that has a **Contributor** role in this subscription. If you do not have a user-assigned managed identity, you can [follow these steps to create one](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). If your user-assigned managed identity is not assigned with the required role, you can [follow these steps](../role-based-access-control/role-assignments-portal-managed-identity.md#user-assigned-managed-identity).

## Create IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service using our offer
With the following configuration, this offer will create a Azure Container Registry and a Azure Kubernetes Service cluster for the sample application.
* Go to [Azure Marketplace](https://ms.portal.azure.com/), search for **IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service** and click **Create** to start.
* In **Basics** tab, create new Resource Group called *java-liberty-project-rg*.
* Select *East US* as Region.
* Select the user-assigned managed identity you created above.
* Leave all other values to default and start create the cluster.
* Go to the Azure Container Registry Access Keys page, save the *Login server*, *Username*, *password* somewhere for future use.
* Go to the deployment output page, click on the deployment named like *ibm-usa-ny-armonk-hq-**, save *clusterName* and *appDeploymentTemplateYamlEncoded* for later use.

## Create an Azure Database for PostgreSQL server
### Create via Azure CLI
* Create a resource group

  An Azure resource group is a logical group in which Azure resources are deployed and managed.  

  Create a resource group called *java-liberty-project-postgresql* using the [az group create](/cli/azure/group#az_group_create) command  in the *eastus* location. This resource group will be used later for creating the Azure Container Registry (ACR) instance and the AKS cluster. 

  ```bash
  RESOURCE_GROUP_NAME=java-liberty-project-postgresql
  az group create --name $RESOURCE_GROUP_NAME --location eastus
  ```

* Create the PostgreSQL server

  Use the [az postgres server create](cli/azure/postgres/server#az_postgres_server_create) command to create the DB server. The following example creates an DB server named *youruniquedbname*. Make sure *youruniqueacrname* is unique within Azure.

  ```bash
  export DB_NAME=youruniquedbname
  export DB_ADMIN_USERNAME=myadmin
  export DB_ADMIN_PASSWORD=<server_admin_password>
  az postgres server create --resource-group $RESOURCE_GROUP_NAME --name $DB_NAME  --location eastus --admin-user $DB_ADMIN_USERNAME --admin-password $DB_ADMIN_PASSWORD --sku-name GP_Gen5_2
  ```
### Create through the Azure portal
Alternatively, use the Azure portal by following the steps in [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](../postgresql/quickstart-create-server-database-portal).

### Allow access to Azure Service 
* Via Azure CLI
  ```bash
  az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                          --server-name $DB_NAME   \
                                          --name "AllowAllWindowsAzureIps" \
                                          --start-ip-address "0.0.0.0" \
                                          --end-ip-address "0.0.0.0"
  ```
* Via Azure portal
Alternatively, use the Azure portal by following the steps in [Firewall rules in Azure Database for PostgreSQL - Single Server](../postgresql/concepts-firewall-rules#connecting-from-azure)

## Configure and deploy sample application
### We assumes the application is:
* Managed using Maven
* Using liberty-maven-plugin to configure DB connection

### Checkout the application
You can find the sample project used in the documentation [here](https://github.com/Azure-Samples/open-liberty-on-aks). Checkout the repository using following command:
```bash
cd <path-to-your-repo>
git clone git@github.com:Azure-Samples/open-liberty-on-aks.git
```
There are three sample in the repository, and we will use *javaee-app-db-using-actions*. The file structure is as follows:
```

javaee-app-db-using-actions/
├─ src/main/
│  ├─ aks/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-local
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
```
* Directory *java*, *resources* and *webapp* are source code of the sample application, it declared and used a data source named `jdbc/JavaEECafeDB`.

* In Directory *aks* we placed two deployment files, *db-secret.xml* is used to create [Kubernets Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with DB connection credentials. And *openlibertyapplication.yaml* is used to deploy the application image.

* In Directory *docker*, we place two Dockerfiles. *Dockerfile-local* is used for local debug and *Dockerfile* is used to build image for AKS deployment.

* In Directory *liberty/config*, the *server.xml* is used to configure the DB connection for OpenLiberty cluster.

### Acquire necessary variables from AKS deployment
Once the offer is successfully deployed, an AKS cluster with a namespace will be generated automatically. Besides, the AKS is wired up with ACR by pre-created a secret under the generated namespace. So before we get started with the application, we need to extract the namespace and the pull-secret name of the ACR configured for the AKS.

* Run following command to print out the current deployment file, it contains all variables we need.
  ```bash
  echo <appDeploymentTemplateYamlEncoded> | base64 -d
  ```
* Save the `metadata#namespace` and `spec#pullSecret` somewhere for later use.

### Build project
Build your application.
```bash
cd <path-to-your-repo>/javaee-app-db-using-actions

# The following varaibles will be used for deployment file generation
export LOGIN_SERVER=<Azure_Container_Registery_Login_Server_URL>
export REGISTRY_NAME=<Azure_Container_Registery_Name>
export USER_NAME=<Azure_Container_Registery_Username>
export PASSWORD=<Azure_Container_Registery_Password>
export DB_SERVER_NAME=<DB_NAME>.postgres.database.azure.com
export DB_PORT_NUMBER=5432
export DB_TYPE=postgres
export DB_USER=<DB_ADMIN_USER_NAME>@<DB_NAME>
export DB_PASSWORD=<DB_ADMIN_PASSWORD>
export NAMESPACE=<NAMESPACE>
export PULL_SECRET=<PULL_SECRET>

mvn clean install
```
### Test your project locally
Use the `liberty:devc` to run and test it locally before dealing with any Azure complexity. See the [related docs](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).
We've prepared the *Dockerfile-local* for it in the sample application.

* Start your local docker environment if not
  ```bash
  sudo dockerd
  ```
* Start the application in `liberty:devc` mode
  ```bash
  cd <path-to-your-repo>/javaee-app-db-using-actions

  mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_TYPE} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -DdockerRunOpts="--net=host" -Ddockerfile=target/Dockerfile-local
  ```
* Verify the application works as expected
Go to `http://localhost:9080/` and verify the application is accessible and all functions are working.
* Press `Ctrl+C` to stop local debug.

### Build image for AKS deployment
Run docker command to build the image
```bash
cd <path-to-your-repo>/javaee-app-db-using-actions

# Fetch maven artifactId as image name, maven build version as image version
IMAGE_NAME=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.artifactId}' --non-recursive exec:exec)
IMAGE_VERSION=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)

cd <path-to-your-repo>/javaee-app-db-using-actions/target

docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} --pull --file=Dockerfile .
```

### Upload image to ACR
Now, we upload the built image to the ACR created in the offer.
```bash
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${LOGIN_SERVER}/${IMAGE_NAME}:${IMAGE_VERSION}
docker login -u ${USER_NAME} -p ${PASSWORD} ${LOGIN_SERVER}
docker push ${LOGIN_SERVER}/${IMAGE_NAME}:${IMAGE_VERSION}
```

### Connect to the AKS cluster
```bash
az aks get-credentials --resource-group java-liberty-project-rg --name <AKS_CLUSTER_NAME>
```
### Apply DB secret
```bash
kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/target/db-secret.yaml
```
### Apply deployment file
```bash
kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/target/openlibertyapplication.yaml
```
### Watch the pods to be restarted
Watch all pods are restarted successfully using the following command
```bash
kubectl get pods -n $NAMESPACE --watch
```
### Verify the results
* Get endpoint of the deployed service
```bash
kubectl get service -n $NAMESPACE
```
Save the `EXTERNAL-IP` for later use.
* Go to `EXTERNAL-IP:9080` to test the application.

## Clean up resources
To avoid Azure charges, you should clean up unnecessary resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name <RESOURCE_GROUP_NAME> --yes --no-wait
```

## Next steps
* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/services/postgresql/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
