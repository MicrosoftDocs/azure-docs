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

# Deploy a Java application with Azure Database for PostgreSQL server to Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:  

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime with PostgreSQL DB connection.
* Build the application Docker image using Open Liberty or WebSphere Liberty container images.
* Deploy the containerized application to an AKS cluster using the Open Liberty Operator.

The Open Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With Open Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires the latest version of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* If running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
  * Install a Java SE implementation (for example, [AdoptOpenJDK OpenJDK 8 LTS/OpenJ9](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=openj9)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.
  * Create a user-assigned managed identity and assign `Contributor` role to that identity by following the steps in [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

## Create a Jakarta EE runtime using the portal

The steps in this section guide you to create a Jakarta EE runtime on AKS. After completing these steps, you will have an Azure Container Registry and an Azure Kubernetes Service cluster for the sample application.

1. Visit the [Azure portal](https://aka.ms/publicportal), and search for **IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service** and select **Create** to start.
1. In **Basics** tab, create a new resource group called *java-liberty-project-rg*.
1. Select *East US* as **Region**.
1. Select the user-assigned managed identity you created above.
1. Leave all other values at the defaults and start creating the cluster. This may take over fifteen minutes.
1. After the deployment is complete, visit the Azure Container Registry Access Keys page, save the **Login server**, **Username**, and **Password** aside for later use in this article.

   **PENDING: Zheng, please add a screenshot here, as described in https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-create-screenshot?branch=master **

1. **PENDING: Zheng: enumerate the exact steps to get to the deployments page.  Also, include a screenshot using the same guidelines. Also, find a better way to direct them to the correct deployment.  I know ibm-usa-ny-armonk is correct, but that name may change if we fix the publisher ID, as Reza long ago requested.  Perhaps it is the first or last deployment?**  Go to the deployment output page, select on the deployment named like *ibm-usa-ny-armonk-hq-**, save *clusterName* and *appDeploymentTemplateYamlEncoded* aside for later use in this article.

## Create an Azure Database for PostgreSQL server

The steps in this section guide you through creating an Azure Database for PostgreSQL server using the Azure CLI for use with your app.

1. Create a resource group

   An Azure resource group is a logical group in which Azure resources are deployed and managed.  

   Create a resource group called *java-liberty-project-postgresql* using the [az group create](/cli/azure/group#az_group_create) command  in the *eastus* location. This resource group will be used later for creating the Azure Container Registry (ACR) instance and the AKS cluster. **PENDING: Zheng: I don't see how the resource group created here relates to the ACR. It looks to me like we are using the ACR created by the offer. If this is true, I think this statement should be deleted.**

   ```bash
   RESOURCE_GROUP_NAME=java-liberty-project-postgresql
   az group create --name $RESOURCE_GROUP_NAME --location eastus
   ```

1. Create the PostgreSQL server

   Use the [az postgres server create](/cli/azure/postgres/server#az_postgres_server_create) command to create the DB server. The following example creates a DB server named *youruniquedbname*. Make sure *youruniqueacrname* are unique within Azure. (Hint: prepend a disambiguation string, such as your initials and the MMDD of today's date.)

   ```bash
   export DB_NAME=youruniquedbname
   export DB_ADMIN_USERNAME=myadmin
   export DB_ADMIN_PASSWORD=<server_admin_password>
   az postgres server create --resource-group $RESOURCE_GROUP_NAME --name $DB_NAME  --location eastus --admin-user $DB_ADMIN_USERNAME --admin-password $DB_ADMIN_PASSWORD --sku-name GP_Gen5_2
   ```

1. Allow Azure Services, such as our Open Liberty and WebSphere Liberty application, to access the Azure PostgreSQL server.

   ```bash
   az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                           --server-name $DB_NAME   \
                                           --name "AllowAllWindowsAzureIps" \
                                           --start-ip-address "0.0.0.0" \
                                           --end-ip-address "0.0.0.0"
   ```

If you don't want to use the CLI, you may use the Azure portal by following the steps in [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal). You must also grant access to Azure services by following the steps in [Firewall rules in Azure Database for PostgreSQL - Single Server](/azure/postgresql/concepts-firewall-rules#connecting-from-azure). Return to this document after creating and configuring the database server.

## Configure and deploy the sample application

Follow the steps in this section to deploy the sample application on the Jakarta EE runtime. These steps use Maven and the `liberty-maven-plugin`.  To learn more about the `liberty-maven-plugin` see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

### Check out the application

Clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aks).
There are three samples in the repository.  We will use *javaee-app-db-using-actions/postgres*. Here is the file structure of the application.

```
javaee-app-db-using-actions/postgres
├─ src/main/
│  ├─ aks/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-local
│  │  ├─ Dockerfile-wlp
│  │  ├─ Dockerfile-wlp-local
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
```

The directories *java*, *resources*, and *webapp* contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In directory *aks* we placed two deployment files. *db-secret.xml* is used to create [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with DB connection credentials. The file *openlibertyapplication.yaml* is used to deploy the application image.

In directory *docker*, we place four Dockerfiles. *Dockerfile-local* is used for local debug and *Dockerfile* is used to build image for AKS deployment. They all work with Open Liberty. *Dockerfile-wlp-local* is used for local debug and *Dockerfile-wlp* is used to build image for AKS deployment, they all work with WebSphere Liberty.

In directory *liberty/config*, the *server.xml* is used to configure the DB connection for the Open Liberty and WebSphere Liberty cluster.

### Acquire necessary variables from AKS deployment

After the offer is successfully deployed, an AKS cluster with a namespace will be generated automatically. The AKS cluster is configured to connect to the ACR using a pre-created secret under the generated namespace. Before we get started with the application, we need to extract the namespace and the pull-secret name of the ACR configured for the AKS.

1. Run following command to print the current deployment file, using the `appDeploymentTemplateYamlEncoded` you saved above. The output contains all the variables we need.

   ```bash
   echo <appDeploymentTemplateYamlEncoded> | base64 -d
   ```

1. Save the `metadata.namespace` and `spec.pullSecret` from this yaml output aside for later use in this article.

### Build the project

Now that you have gathered the necessary properties, you can build the application.  The POM file for the project reads many properties from the environment.

```bash
cd <path-to-your-repo>/javaee-app-db-using-actions/postgres

# The following variables will be used for deployment file generation
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

Use the `liberty:devc` to run and test it locally before dealing with any Azure complexity. For more information on `liberty:devc`, see the [Liberty Plugin documentation](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).
We've prepared the *Dockerfile-local* and *Dockerfile-wlp-local* for it in the sample application.

1. Start your local docker environment if you haven't done so already.

   ```bash
   sudo dockerd
   ```

1. Start the application in `liberty:devc` mode

   ```bash
   cd <path-to-your-repo>/javaee-app-db-using-actions/postgres

   # If you are running with Open Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_TYPE} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -DdockerRunOpts="--net=host" -Ddockerfile=target/Dockerfile-local

   # If you are running with WebSphere Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_TYPE} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -DdockerRunOpts="--net=host" -Ddockerfile=target/Dockerfile-wlp-local
   ```

1. Verify the application works as expected. You should see `The defaultServer server is ready to run a smarter planet.` in the command output if successful. Go to the URL in this output and verify the application is accessible and all functions are working.

1. Press `Ctrl+C` to stop `liberty:devc` mode.  Alternatively, you could use the `jps` command to find the pid of the runner process and kill it with `kill -9`.

### Build image for AKS deployment

After successfully running the app in the Liberty Docker container, you can run the `docker build` command to build the image.

```bash
cd <path-to-your-repo>/javaee-app-db-using-actions/postgres

# Fetch maven artifactId as image name, maven build version as image version
IMAGE_NAME=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.artifactId}' --non-recursive exec:exec)
IMAGE_VERSION=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)

cd <path-to-your-repo>/javaee-app-db-using-actions/postgres/target

# If you are running with Open Liberty
docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} --pull --file=Dockerfile .

# If you are running with WebSphere Liberty
docker build -t ${IMAGE_NAME}:${IMAGE_VERSION} --pull --file=Dockerfile-wlp .
```

### Upload image to ACR

Now, we upload the built image to the ACR created in the offer.

```bash
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${LOGIN_SERVER}/${IMAGE_NAME}:${IMAGE_VERSION}
docker login -u ${USER_NAME} -p ${PASSWORD} ${LOGIN_SERVER}
docker push ${LOGIN_SERVER}/${IMAGE_NAME}:${IMAGE_VERSION}
```

### Deploy and test the application

The steps in this section deploy and test the application.

1. Connect to the AKS cluster

  ```bash
   az aks get-credentials --resource-group java-liberty-project-rg --name <AKS_CLUSTER_NAME>
   ```

1. Apply the DB secret

   ```bash
   kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/postgres/target/db-secret.yaml
   ```

1. Apply the deployment file

   ```bash
   kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/postgres/target/openlibertyapplication.yaml
   ```

1. Wait for the pods to be restarted

   Wait until all pods are restarted successfully using the following command.

   ```bash
   kubectl get pods -n $NAMESPACE --watch
   ```

1. Verify the results

   1. Get endpoint of the deployed service

      ```bash
      kubectl get service -n $NAMESPACE
      ```

   1. Go to `EXTERNAL-IP:9080` to test the application.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name <RESOURCE_GROUP_NAME> --yes --no-wait
```

## Next steps

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
