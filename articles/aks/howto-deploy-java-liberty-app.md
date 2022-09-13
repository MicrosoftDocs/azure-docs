---
title: Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster
recommendations: false
description: Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster
author: zhengchang907
ms.author: zhengchang
ms.service: container-service
ms.topic: how-to
ms.date: 09/13/2022
keywords: java, jakartaee, javaee, microprofile, open-liberty, websphere-liberty, aks, kubernetes
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-azurecli
---

# Deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article demonstrates how to:

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime.
* Build the application Docker image using Open Liberty or WebSphere Liberty container images.
* Deploy the containerized application to an AKS cluster using the Open Liberty Operator.

The Open Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With the Open Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

This article uses the Azure Marketplace offer for Open/WebSphere Liberty to accelerate your journey to AKS. The offer automatically provisions a number of Azure resources including an Azure Container Registry (ACR) instance, an AKS cluster, an Azure App Gateway Ingress Controller (AGIC) instance, the Liberty Operator and optionally a container image including Liberty and your application. To see the offer visit the [portal](https://aka.ms/liberty-aks). If you prefer manual step-by-step guidance for running Liberty on AKS that doesn't utilize the automations enabled by the offer, see [Manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/developer/java/ee/howto-deploy-java-liberty-app-manual).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

* This article requires at least version 2.31.0 of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* If running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
  ### RR: AdoptOpenJDK is done. We should reference another JDK here, ideally OpenJ9.
  * Install a Java SE implementation (for example, [AdoptOpenJDK OpenJDK 8 LTS/OpenJ9](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=openj9)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.
  * Make sure you have been assigned either `Owner` role or `Contributor` and `User Access Administrator` roles in the subscription. You can verify it by following steps in [List role assignments for a user or group](../role-based-access-control/role-assignments-list-portal.md#list-role-assignments-for-a-user-or-group) 

## Create a Liberty on AKS deployment using the portal

The steps in this section guide you to create a Liberty runtime on AKS. After completing these steps, you'll have an Azure Container Registry and an Azure Kubernetes Service cluster for the sample application.

## RR: We should show the use of the App Gateway.

1. Visit the [Azure portal](https://portal.azure.com/). In the search box at the top of the page, type *IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service*. When the suggestions start appearing, select the one and only match that appears in the **Marketplace** section.
1. Select **Create** to start.
1. In the **Basics** tab, create a new resource group called *java-liberty-project-rg*.
1. Select *East US* as **Region**.
1. Leave all other values at the defaults and start creating the cluster by selecting **Review + create**.
1. When the validation completes, select **Create**. The validation may take up to 10 minutes.
1. After the deployment is complete, select the resource group into which you deployed the resources.
   1. In the list of resources in the resource group, select the resource with **Type** of **Container registry**.
   ### RR: Where do I find these values? That's not clear.
   3. Save aside the values for **Registry name**, **Login server**, **Username**, and **password**. You may use the copy icon at the right of each field to copy the value of that field to the system clipboard.
1. Navigate again to the resource group into which you deployed the resources.
1. In the **Settings** section, select **Deployments**.
1. Select the bottom-most deployment. The **Deployment name** will match the publisher ID of the offer. It will contain the string **ibm**.
1. In the left pane, select **Outputs**.
1. Using the same copy technique as with the preceding values, save aside the values for the following outputs:

   - **appDeploymentTemplateYamlEncoded**
   - **cmdToConnectToCluster**

   These values will be used later in this article. Note that several other useful commands are listed in the outputs.

## Create an Azure SQL Database

The steps in this section guide you through creating an Azure SQL Database single database for use with your app.

1. Create a single database in Azure SQL Database by following the steps in: [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart), carefully noting the differences below. Return to this document after creating and configuring the database server.
    > [!NOTE]
    >
    > * At the **Basics** step, write down **Database name**, ***Server name**.database.windows.net*, **Server admin login** and **Password**.
    > * At the **Networking** step, set **Connectivity method** to **Public endpoint**, **Allow Azure services and resources to access this server** to **Yes**, and **Add current client IP address** to **Yes**.
    >
    >   ![Screenshot of configuring SQL database networking](./media/howto-deploy-java-liberty-app/create-sql-database-networking.png)

### RR: What is this referring to? I can't find it? There is a setting in the create UI. Why didn't we just use that?

2. Once your database is created, open **your SQL server** > **Firewalls and virtual networks**. Set **Minimal TLS Version** to **> 1.0** and select **Save**.

    ![Screenshot of configuring SQL database minimum TLS version](./media/howto-deploy-java-liberty-app/sql-database-minimum-TLS-version.png)
    
### RR: Why do we need this? The port is always 1433.

3. Open **your SQL database** > **Connection strings** > Select **JDBC**. Write down the **Port number** following sql server address. For example, **1433** is the port number in the example below.

   ![Screenshot of getting SQL server jdbc connection string](./media/howto-deploy-java-liberty-app/sql-server-jdbc-connection-string.png)

## Configure and deploy the sample application

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven and the `liberty-maven-plugin`.  To learn more about the `liberty-maven-plugin` see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

### Check out the application

Clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aks).
There are a few samples in the repository. We'll use *java-app/*. Here's the file structure of the application.

```
java-app
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

After the offer is successfully deployed, an AKS cluster will be generated automatically. The AKS cluster is configured to connect to a generated ACR instance. Before we get started with the application, we need to extract the namespace configured for AKS.

1. Run the following command to print the current deployment file, using the `appDeploymentTemplateYamlEncoded` you saved above. The output contains all the variables we need.

   ```bash
   echo <appDeploymentTemplateYamlEncoded> | base64 -d
   ```

1. Save the `metadata.namespace` from this yaml output aside for later use in this article.

### Build the project

Now that you've gathered the necessary properties, you can build the application. The POM file for the project reads many properties from the environment.

### RR: We are doing quite a bit of file and parameter manipulation in the Maven build, which is fine but not explained anywhere and not necessarily appropriate for a legacy project. We need to explain what we are doing either here or in the Maven POM as comments (and make a reference here).

```bash
cd <path-to-your-repo>/java-app

# The following variables will be used for deployment file generation
export LOGIN_SERVER=<Azure_Container_Registery_Login_Server_URL>
export REGISTRY_NAME=<Azure_Container_Registery_Name>
export USER_NAME=<Azure_Container_Registery_Username>
export PASSWORD=<Azure_Container_Registery_Password>
export DB_SERVER_NAME=<Server name>.database.windows.net
export DB_PORT_NUMBER=1433
export DB_NAME=<Database name>
export DB_USER=<Server admin login>@<Server name>
export DB_PASSWORD=<Server admin password>
export NAMESPACE=<metadata.namespace>

mvn clean install
```

### Test your project locally

Use the `liberty:devc` command to run and test the project locally before deploying to Azure. For more information on `liberty:devc`, see the [Liberty Plugin documentation](https://github.com/OpenLiberty/ci.maven/blob/main/docs/dev.md#devc-container-mode).
In the sample application, we've prepared *Dockerfile-local* and *Dockerfile-wlp-local* for use with `liberty:devc`.

1. Start your local docker environment if you haven't done so already. The instructions for doing this vary depending on the host operating system.

1. Start the application in `liberty:devc` mode

   ```bash
   cd <path-to-your-repo>/java-app
   
   # If you are running with Open Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_NAME} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -Ddockerfile=target/Dockerfile-local
  
   # If you are running with WebSphere Liberty
   mvn liberty:devc -Ddb.server.name=${DB_SERVER_NAME} -Ddb.port.number=${DB_PORT_NUMBER} -Ddb.name=${DB_NAME} -Ddb.user=${DB_USER} -Ddb.password=${DB_PASSWORD} -Ddockerfile=target/Dockerfile-wlp-local
   ```

1. Verify the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `http://localhost:9080/` in your browser and verify the application is accessible and all functions are working.

1. Press `Ctrl+C` to stop `liberty:devc` mode.

### Build image for AKS deployment

After successfully running the app in the Liberty Docker container, you can run the `docker build` command to build the image.

```bash
cd <path-to-your-repo>/java-app

# Fetch maven artifactId as image name, maven build version as image version
export IMAGE_NAME=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.artifactId}' --non-recursive exec:exec)
export IMAGE_VERSION=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)

cd <path-to-your-repo>/java-app/target

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
   kubectl apply -f <path-to-your-repo>/java-app/target/db-secret.yaml
   ```

   You'll see the output `secret/db-secret-postgres created`.

1. Apply the deployment file

   ```bash
   kubectl apply -f <path-to-your-repo>/java-app/target/openlibertyapplication.yaml
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

   1. Go to `http://EXTERNAL-IP` to test the application.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name <RESOURCE_GROUP_NAME> --yes --no-wait
```

## Next steps

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
