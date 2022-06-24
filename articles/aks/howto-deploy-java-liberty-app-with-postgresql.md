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
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-azurecli
---

# Deploy a Java application with Azure Database for PostgreSQL server to Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:  

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime with a PostgreSQL DB connection.
* Build the application Docker image using Open Liberty or WebSphere Liberty container images.
* Deploy the containerized application to an AKS cluster using the Open Liberty Operator.

The Open Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With Open Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires at least version 2.31.0 of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* If running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
  * Install a Java SE implementation (for example, [AdoptOpenJDK OpenJDK 8 LTS/OpenJ9](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=openj9)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.
  * Create a user-assigned managed identity and assign `Owner` role or `Contributor` and `User Access Administrator` roles to that identity by following the steps in [Manage user-assigned managed identities](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). Assign `Directory readers` role to the identity in Azure AD by following [Assign Azure AD roles to users](../active-directory/roles/manage-roles-portal.md). Return to this document after creating the identity and assigning it the necessary roles.

## Create a Jakarta EE runtime using the portal

The steps in this section guide you to create a Jakarta EE runtime on AKS. After completing these steps, you will have an Azure Container Registry and an Azure Kubernetes Service cluster for the sample application.

1. Visit the [Azure portal](https://portal.azure.com/). In the search box at the top of the page, type **IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service**. When the suggestions start appearing, select the one and only match that appears in the **Marketplace** section.
1. Select **Create** to start.
1. In the **Basics** tab, create a new resource group called *java-liberty-project-rg*.
1. Select *East US* as **Region**.
1. Select the user-assigned managed identity you created above.
1. Leave all other values at the defaults and start creating the cluster by selecting **Review + create**.
1. When the validation completes, select **Create**. This may take up to ten minutes.
1. After the deployment is complete, select the resource group into which you deployed the resources.
   1. In the list of resources in the resource group, select the resource with **Type** of **Container registry**.
   1. Save aside the values for **Registry name**, **Login server**, **Username**, and **password**. You may use the copy icon at the right of each field to copy the value of that field to the system clipboard.
1. Navigate again to the resource group into which you deployed the resources.
1. In the **Settings** section, select **Deployments**.
1. Select the bottom most deployment. The **Deployment name** will match the publisher ID of the offer. It will contain the string **ibm**.
1. In the left pane, select **Outputs**.
1. Using the same copy technique as with the preceding values, save aside the values for the following outputs:

   - **clusterName**
   - **appDeploymentTemplateYamlEncoded**
   - **cmdToConnectToCluster**

   These values will be used later in this article. Note that several other useful commands are listed in the outputs.

## Create an Azure Database for PostgreSQL server

The steps in this section guide you through creating an Azure Database for PostgreSQL server using the Azure CLI for use with your app.

1. Create a resource group

   An Azure resource group is a logical group in which Azure resources are deployed and managed.  

   Create a resource group called *java-liberty-project-postgresql* using the [az group create](/cli/azure/group#az-group-create) command in the *eastus* location.

   ```bash
   RESOURCE_GROUP_NAME=java-liberty-project-postgresql
   az group create --name $RESOURCE_GROUP_NAME --location eastus
   ```

1. Create the PostgreSQL server

   Use the [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) command to create the DB server. The following example creates a DB server named *youruniquedbname*. Make sure *youruniqueacrname* is unique within Azure.
   
   > [!TIP]
   > To help ensure a globally unique name, prepend a disambiguation string such as your initials and the MMDD of today's date.


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

1. Allow your local IP address to access the Azure PostgreSQL server. This is necessary to allow the `liberty:devc` to access the database.

   ```bash
   az postgres server firewall-rule create --resource-group $RESOURCE_GROUP_NAME \
                                           --server-name $DB_NAME   \
                                           --name "AllowMyIp" \
                                           --start-ip-address YOUR_IP_ADDRESS \
                                           --end-ip-address YOUR_IP_ADDRESS
   ```

If you don't want to use the CLI, you may use the Azure portal by following the steps in [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](../postgresql/quickstart-create-server-database-portal.md). You must also grant access to Azure services by following the steps in [Firewall rules in Azure Database for PostgreSQL - Single Server](../postgresql/concepts-firewall-rules.md#connecting-from-azure). Return to this document after creating and configuring the database server.

## Configure and deploy the sample application

Follow the steps in this section to deploy the sample application on the Jakarta EE runtime. These steps use Maven and the `liberty-maven-plugin`.  To learn more about the `liberty-maven-plugin` see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

### Check out the application

Clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aks).
There are three samples in the repository. We will use *javaee-app-db-using-actions/postgres*. Here is the file structure of the application.

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

In the *aks* directory, we placed two deployment files. *db-secret.xml* is used to create [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with DB connection credentials. The file *openlibertyapplication.yaml* is used to deploy the application image.

In the *docker* directory, we placed four Dockerfiles. *Dockerfile-local* is used for local debugging, and *Dockerfile* is used to build the image for an AKS deployment. These two files work with Open Liberty. *Dockerfile-wlp-local* and *Dockerfile-wlp* are also used for local debugging and to build the image for an AKS deployment respectively, but instead work with WebSphere Liberty.

In directory *liberty/config*, the *server.xml* is used to configure the DB connection for the Open Liberty and WebSphere Liberty cluster.

### Acquire necessary variables from AKS deployment

After the offer is successfully deployed, an AKS cluster will be generated automatically. The AKS cluster is configured to connect to the ACR. Before we get started with the application, we need to extract the namespace configured for the AKS.

1. Run the following command to print the current deployment file, using the `appDeploymentTemplateYamlEncoded` you saved above. The output contains all the variables we need.

   ```bash
   echo <appDeploymentTemplateYamlEncoded> | base64 -d
   ```

1. Save the `metadata.namespace` from this yaml output aside for later use in this article.

### Build the project

Now that you have gathered the necessary properties, you can build the application. The POM file for the project reads many properties from the environment.

```bash
cd <path-to-your-repo>/javaee-app-db-using-actions/postgres

# The following variables will be used for deployment file generation
export LOGIN_SERVER=<Azure_Container_Registery_Login_Server_URL>
export REGISTRY_NAME=<Azure_Container_Registery_Name>
export USER_NAME=<Azure_Container_Registery_Username>
export PASSWORD=<Azure_Container_Registery_Password>
export DB_SERVER_NAME=${DB_NAME}.postgres.database.azure.com
export DB_PORT_NUMBER=5432
export DB_TYPE=postgres
export DB_USER=${DB_ADMIN_USERNAME}@${DB_NAME}
export DB_PASSWORD=${DB_ADMIN_PASSWORD}
export NAMESPACE=<metadata.namespace>

mvn clean install
```

### Test your project locally

Use the `liberty:devc` command to run and test the project locally before dealing with any Azure complexity. For more information on `liberty:devc`, see the [Liberty Plugin documentation](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).
In the sample application, we've prepared *Dockerfile-local* and *Dockerfile-wlp-local* for use with `liberty:devc`.

1. Start your local docker environment if you haven't done so already. The instructions for doing this vary depending on the host operating system.

1. Start the application in `liberty:devc` mode

   ```bash
   cd <path-to-your-repo>/javaee-app-db-using-actions/postgres

   # If you are running with Open Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_TYPE} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -Ddockerfile=target/Dockerfile-local

   # If you are running with WebSphere Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_TYPE} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -Ddockerfile=target/Dockerfile-wlp-local
   ```

1. Verify the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `http://localhost:9080/` in your browser and verify the application is accessible and all functions are working.

1. Press `Ctrl+C` to stop `liberty:devc` mode.

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

   Paste the value of **cmdToConnectToCluster** into a bash shell.

1. Apply the DB secret

   ```bash
   kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/postgres/target/db-secret.yaml
   ```

   You will see the output `secret/db-secret-postgres created`.

1. Apply the deployment file

   ```bash
   kubectl apply -f <path-to-your-repo>/javaee-app-db-using-actions/postgres/target/openlibertyapplication.yaml
   ```

1. Wait for the pods to be restarted

   Wait until all pods are restarted successfully using the following command.

   ```bash
   kubectl get pods -n $NAMESPACE --watch
   ```

   You should see output similar to the following to indicate that all the pods are running.

   ```bash
   NAME                                  READY   STATUS    RESTARTS   AGE
   javaee-cafe-cluster-67cdc95bc-2j2gr   1/1     Running   0          29s
   javaee-cafe-cluster-67cdc95bc-fgtt8   1/1     Running   0          29s
   javaee-cafe-cluster-67cdc95bc-h47qm   1/1     Running   0          29s
   ```

1. Verify the results

   1. Get endpoint of the deployed service

      ```bash
      kubectl get service -n $NAMESPACE
      ```

   1. Go to `EXTERNAL-IP:9080` to test the application.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name <RESOURCE_GROUP_NAME> --yes --no-wait
```

## Next steps

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Azure Database for PostgreSQL](https://azure.microsoft.com/services/postgresql/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
