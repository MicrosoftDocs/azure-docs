---
title: "Deploy Quarkus on Azure Kubernetes Service"
description: Shows how to quickly stand up Quarkus on Azure Kubernetes Service.
author: danieloh30
ms.author: edburns
ms.service: azure-kubernetes-service
ms.topic: how-to 
ms.date: 07/16/2023
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus-aks, devx-track-extended-java
#CustomerIntent: As a developer, I want deploy a simple CRUD Quarkus App on AKS so that can start iterating it into a proper LOB app.
---

# Deploy a Java application with Quarkus on an Azure Kubernetes Service (AKS) cluster

This article shows you how to quickly deploy Red Hat Quarkus on Azure Kubernetes Service (AKS) with a simple CRUD application. The application is a to do list with a JavaScript front end and a REST endpoint. The app is backed by Azure Database for PostgreSQL. The article shows you how to test your app locally and deploy it to AKS.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Azure Cloud Shell has all of these prerequisites pre-installed. For more, see [Quickstart for Azure Cloud Shell](/azure/cloud-shell/quickstart).
- If running the commands in this guide locally (instead of Azure Cloud Shell):
   - Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
   - Install a Java SE implementation (for example, [Microsoft build of OpenJDK](/java/openjdk)).
   - Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
   - Install [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/docs/installation) for your OS.
   - Install [jq](https://jqlang.github.io/jq/download/).
   - Install [cURL](https://curl.se/download.html).
   - Install the [Quarkus CLI](https://quarkus.io/guides/cli-tooling).
- Azure CLI for Unix like environments. This article requires only the **Bash** variant below.
   - [!INCLUDE [azure-cli-login](../../includes/azure-cli-login.md)]
   - This article requires at least version 2.31.0 of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create the app project

Use the following command to clone the sample Java project for this article. The sample is on [GitHub](https://github.com/Azure-Samples/quarkus-azure).

```bash
git clone https://github.com/Azure-Samples/quarkus-azure
cd quarkus-azure
git checkout 2023-07-17
cd aks-quarkus
```

If you see a message about being in **detached HEAD** state, this message is safe to ignore. Because this article does not require any commits, detached HEAD state is appropriate.

## Test your Quarkus App locally.

Quarkus supports the automatic provisioning of unconfigured services in development and test mode. Quarkus refers to this capability as [Dev Services](https://quarkus.io/guides/dev-services#databases). If you include a quarkus feature, such as connecting to a database service, but haven't yet fully configured the connection, then Quarkus will automatically start a stub version of the relevant service and wire up your application to use it.

Make sure your container environment, Docker or Podman, is running and execute the following command to enter Quarkus dev mode.

```azurecli-interactive
quarkus dev
```

Instead of `quarkus dev`, you can accomplish the same thing with Maven by invoking `mvn quarkus:dev`.

You may be asked if you want to send telemetry of your usage of Quarkus dev mode. If so, answer as you like.

Quarkus dev mode enables live reload with background compilation. If you modify your app source code, Java files or your resource files, and refresh your browser, these changes will automatically take effect. If there are any issues with compilation or deployment an error page will let you know.  Quarkus dev mode will also listen for a debugger on port 5005. If you want to wait for the debugger to attach before running you can pass `-Dsuspend` on the command line. If you don’t want the debugger at all you can use `-Ddebug=false`.

The output should look like:

```bash
__  ____  __  _____   ___  __ ____  ______ 
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/ 
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \   
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/   
INFO  [io.quarkus] (Quarkus Main Thread) quarkus-todo-demo-app-aks 1.0.0-SNAPSHOT on JVM (powered by Quarkus 3.2.0.Final) started in 3.377s. Listening on: http://localhost:8080

INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [agroal, cdi, hibernate-orm, hibernate-orm-panache, hibernate-validator, jdbc-postgresql, narayana-jta, resteasy-reactive, resteasy-reactive-jackson, smallrye-context-propagation, vertx]

--
Tests paused
Press [e] to edit command line args (currently ''), [r] to resume testing, [o] Toggle test output, [:] for the terminal, [h] for more options>
```

Press the `w` key on the terminal where Quarkus dev mode is running. This opens your default web browser to show the **Todo** application. You can also access the application GUI at http://localhost:8080 directly.

:::image type="content" source="media/howto-deploy-java-quarkus-app/aks-demo-gui.png" alt-text="TODO app screen shot" lightbox="media/howto-deploy-java-quarkus-app/aks-demo-gui.png":::

Try selecting a few todo items in the todo list. The UI indicates selection with a strikethrough text style. You can also add a new todo item to the todo list by typing `Verify Todo apps` and pressing enter, as shown here.

:::image type="content" source="media/howto-deploy-java-quarkus-app/todo-local.png" alt-text="TOD app screen shot with new items added" lightbox="media/howto-deploy-java-quarkus-app/todo-local.png":::


Access the RESTful API (_/api_) to get all todo items that store in the local PostgreSQL database. 

```azurecli-interactive
curl --verbose http://localhost:8080/api | jq .
```

The output should look like:

```bash
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /api HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.88.1
> Accept: */*
>
< HTTP/1.1 200 OK
< content-length: 664
< Content-Type: application/json;charset=UTF-8
<
{ [664 bytes data]
100   664  100   664    0     0  13278      0 --:--:-- --:--:-- --:--:-- 15441
* Connection #0 to host localhost left intact
[
  {
    "id": 1,
    "title": "Introduction to Quarkus Todo App",
    "completed": false,
    "order": 0,
    "url": null
  },
  {
    "id": 2,
    "title": "Quarkus on Azure App Service",
    "completed": false,
    "order": 1,
    "url": "https://learn.microsoft.com/en-us/azure/developer/java/eclipse-microprofile/deploy-microprofile-quarkus-java-app-with-maven-plugin"
  },
  {
    "id": 3,
    "title": "Quarkus on Azure Container Apps",
    "completed": false,
    "order": 2,
    "url": "https://learn.microsoft.com/en-us/training/modules/deploy-java-quarkus-azure-container-app-postgres/"
  },
  {
    "id": 4,
    "title": "Quarkus on Azure Functions",
    "completed": false,
    "order": 3,
    "url": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-first-quarkus"
  },
  {
    "id": 5,
    "title": "Verify Todo apps",
    "completed": false,
    "order": 5,
    "url": null
  }
]
```

Press `q` to exit Quarkus dev mode.

## Deploy the Quarkus App to Azure Kubernetes Service (AKS)

The steps in this section direct you to create the Azure resources to run the Quarkus sample app.

- Azure Database for PostgreSQL
- Azure Conatiner Registry
- Azure Kubernetes Service (AKS)

Some of these resources must be unique within the scope of the Azure subscription. Let's ensure this uniqueness by adopting unique value for our resource names. One easy solution is to use the **initials, sequence, date, suffix** pattern. To apply this pattern name your resources by listing your initials, some sequence number, today's date, and some kind of resource specific suffix. For example, **rg** for "resource group". Let's define some environment variables now that we'll use later.

```azurecli-interactive
export UNIQUE_VALUE=<your unique value, such as ejb010717>
export RESOURCE_GROUP_NAME=${UNIQUE_VALUE}rg
export LOCATION=<your desired Azure region for deploying your resources. For example, eastus>
export REGISTRY_NAME=${UNIQUE_VALUE}reg
export DB_SERVER_NAME=${UNIQUE_VALUE}db
export CLUSTER_NAME=${UNIQUE_VALUE}aks
export AKS_NS=${UNIQUE_VALUE}ns
```

### Create an Azure Database for PostgreSQL

**Azure Database for PostgreSQL** is a managed service to run, manage, and scale highly available PostgreSQL databases in the Azure cloud. This section will reference a quickstart that shows you how to create a single Azure Database for PostgreSQL server and connect to it.  Before executing the steps in the quickstart, let's define some substitutions to customize the database deployment for the sample Quarkus app.

Now we can state the substitutions to use when following the database quickstart. Replace the environment variables with their actual values when filling out the fields in the portal.

|Setting|Value|Description|
|:---|:---|:---|
|Resource group|`${RESOURCE_GROUP_NAME}`| Select **Create new** . The deployment will create this new resource group.|
|Server name |`${DB_SERVER_NAME}`|This value will form part of the hostname for the database server.|
|Location|`${LOCATION}`| Select a location from the dropdown list. Take note of the location. You must use this same location for other Azure resources you create.|
|Admin username |*quarkus*|The sample code assumes this value.|
|Password |Secret123456|The sample code assumes this value.|

With these substitutions in mind, execute the steps in [Quickstart: Create an Azure Database for PostgreSQL server by using the Azure portal](/azure/postgresql/quickstart-create-server-database-portal).

> [!NOTE]
> In the section **Configure a firewall rule**, you must select **Yes** for **Allow access to Azure services**. Then **Save**. If you neglect to do this, your Quarkus app will not be able to access the database and will simply fail to ever start.

After completing the steps in the quickstart up to **Configure a firewall rule**, and allowing access to Azure services, return to this article.

### Create a **Todo** database in PostgreSQL

The PostgreSQL server that you created earlier is empty. It doesn't have any database that you can use with the Quarkus application. 

Create a new database called `todo` by using the following command:

```azurecli-interactive
az postgres db create \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --name todo \
  --server-name ${DB_SERVER_NAME}
```

You must use `todo` as the name of the database because the sample code assumes that database name.

If successful, the outpul will look similar to the following.

```bash
{
  "charset": "UTF8",
  "collation": "English_United States.1252",
  "id": "/subscriptions/REDACTED/resourceGroups/ejb010718rg/providers/Microsoft.DBforPostgreSQL/servers/ejb010718db/databases/todo",
  "name": "todo",
  "resourceGroup": "ejb010718rg",
  "type": "Microsoft.DBforPostgreSQL/servers/databases"
}
```

### Create a Microsoft Azure Container Registry instance

Because Quarkus is a cloud native technology, it has built-in support for creating containers that run in Kubernetes. Kubernetes is entirely dependent on having a container registry from which it finds the container images to run. AKS has built-in support for Azure Container Registry.

Use the [az acr create](/cli/azure/acr#az-acr-create) command to create the Azure Container Registry instance. The following example creates an Azure Container Registry instance named with the value of your environment variable `${REGISTRY_NAME}.

```azurecli-interactive
az acr create --resource-group $RESOURCE_GROUP_NAME --location ${LOCATION} \
   --name $REGISTRY_NAME --sku Basic --admin-enabled
```

After a short time, you should see a JSON output that contains:

```output
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "<YOUR_RESOURCE_GROUP>",
```

### Connect your docker to the Azure Container Registry instance

You'll need to sign in to the Azure Container Registry instance before you can push an image to it. Run the following commands to verify the connection:

```azurecli-interactive
export LOGIN_SERVER=$(az acr show -n $REGISTRY_NAME --query 'loginServer' -o tsv)
echo $LOGIN_SERVER
export USER_NAME=$(az acr credential show -n $REGISTRY_NAME --query 'username' -o tsv)
echo $USER_NAME
export PASSWORD=$(az acr credential show -n $REGISTRY_NAME --query 'passwords[0].value' -o tsv)
echo $PASSWORD
docker login $LOGIN_SERVER -u $USER_NAME -p $PASSWORD
```

If using Podman instead of Docker, make the necessary changes to the command.

You should see `Login Succeeded` at the end of command output if you've logged into the Azure Container Registry instance successfully.

### Create an AKS cluster

Use the [az aks create](/cli/azure/aks#az-aks-create) command to create an AKS cluster. The following example creates a cluster named with the value of your environment variable `${CLUSTER_NAME}` with one node. The cluster is connected to the Azure Container Registry created in a preceding step. This command will take several minutes to complete.

```azurecli-interactive
az aks create --resource-group $RESOURCE_GROUP_NAME --location ${LOCATION} \
  --name $CLUSTER_NAME --attach-acr $REGISTRY_NAME \
  --node-count 1 --generate-ssh-keys --enable-managed-identity
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster, including the following output:

```output
  "nodeResourceGroup": "MC_<your resource_group_name>_<your cluster name>_<your region>",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "<your resource group name>",
```

### Connect to the AKS cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command:

```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME --overwrite-existing --admin
```

Successful output will include text similar to the following.

```bash
Merged "ejb010718aks-admin" as current context in /Users/edburns/.kube/config
```

You might find it useful to alias `k` to `kubectl`. If so, use this command.

```azurecli-interactive
alias k=kubectl
```

To verify the connection to your cluster, use the [kubectl get]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*:

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-xxxxxxxx-yyyyyyyyyy   Ready    agent   76s     v1.23.8
```

### Create a new namespace in AKS

Create a new namespace in your Kubernetes service. This namespace will host 

```azurecli-interactive
kubectl create namespace ${AKS_NS}
```

The output should look like:

```azurecli-interactive
namespace/<your namespace> created
```

### Customize cloud native configuration

As a cloud native technology, Quarkus offers the ability to automatically configure resources for standard Kubernetes, Red Hat OpenShift, and Knative.  For more details see the [Quarkus Kubernetes guide](https://quarkus.io/guides/deploying-to-kubernetes#kubernetes), [Quarkus OpenShift guide](https://quarkus.io/guides/deploying-to-kubernetes#openshift) and [Quarkus Knative guide](https://quarkus.io/guides/deploying-to-kubernetes#knative). Developers can deploy the application to a target Kubernetes cluster by applying the generated manifests.

To generate the appropriate Kubernetes resources, add the `quarkus-kubernetes` and `container-image-jib` extensions in your local terminal:

```azurecli-interactive
quarkus ext add kubernetes container-image-jib
```

This will modify the POM to ensure these these extensions are listed as `<dependencies>`. If asked to install something called `JBang`, answer yes and allow it to be installed. 

The output should look like:

```azurecli-interactive
[SUCCESS] ✅  Extension io.quarkus:quarkus-kubernetes has been installed
[SUCCESS] ✅  Extension io.quarkus:quarkus-container-image-jib has been installed
```

To verify the extensions have successfully be added, you can run `git diff` and examine the output.

As a cloud native technology, Quarkus supports the notion of configuration profiles. Quarkus has three built-in profiles.

* **dev** - Activated when in development mode (i.e. _quarkus:dev_)
* **test** - Activated when running tests
* **prod** - The default profile when not running in development or test mode

Quarkus supports an arbirtary number of additional profiles, as needed.

The remaining steps in this section direct you to uncomment and customize values in the `src/main/resources/application.properties` file. Ensure all lines starting with `# %prod.` are un-commented by removing the leading `#`.

The `prod.` prefix indicates these properties are active when running in the `prod` profile. For more information on configuration profiles, see the [Quarkus documentation](https://access.redhat.com/search/?q=Quarkus+Using+configuration+profiles).

#### Database configuration

Add the following database configuration variables. Replace the values of `<DB_SERVER_NAME_VALUE>` with the actual values of the `${DB_SERVER_NAME}` environment variable.

```yaml
# Database configurations
%prod.quarkus.datasource.db-kind=postgresql
%prod.quarkus.datasource.jdbc.url=jdbc:postgresql://<DB_SERVER_NAME_VALUE>.postgres.database.azure.com:5432/todo
%prod.quarkus.datasource.jdbc.driver=org.postgresql.Driver
%prod.quarkus.datasource.username=quarkus@<DB_SERVER_NAME_VALUE>
%prod.quarkus.datasource.password=Secret123456
%prod.quarkus.hibernate-orm.database.generation=drop-and-create
```

#### Kubernetes configuration

Add the following Kubernetes configuration variables. Make sure to set `service-type` to `load-balancer` to access the app externally.

```yaml
# AKS configurations
%prod.quarkus.kubernetes.deployment-target=kubernetes
%prod.quarkus.kubernetes.service-type=load-balancer
```

#### Container image configuration

As a cloud native technology, Quarkus supports generating OCI container images compatible with Docker and Podman. Add the following container-image variables. Replace the values of `<LOGIN_SERVER_VALUE>` and `<USER_NAME_VALUE>` with the values of the actual values of the `${LOGIN_SERVER}` and `${USER_NAME}` environment variables, respectively.

```yaml
# Container Image Build
%prod.quarkus.container-image.build=true
%prod.quarkus.container-image.registry=<LOGIN_SERVER_VALUE>
%prod.quarkus.container-image.group=<USER_NAME_VALUE>
%prod.quarkus.container-image.name=todo-quarkus-aks
%prod.quarkus.container-image.tag=1.0
```

### Build the container image and push it to Azure Container Registry

Now that Now let’s build the application itself. Run the following *Quarkus CLI* which will build and deploy using the Kubernetes and Jib extensions:

```azurecli-interactive
quarkus build --no-tests
```

The output should end with `BUILD SUCCESS`. The Kubernetes manifest files are generated in `target/kubernetes`.

```azurecli-interactive
tree target/kubernetes 
target/kubernetes
├── kubernetes.json
└── kubernetes.yml

0 directories, 2 files
```

You can verify if the container image is generated as well using `docker` or `podman` command line (CLI). Output will look similar to the following.

```azurecli-interactive
docker images | grep todo
<LOGIN_SERVER_VALUE>/<USER_NAME_VALUE>/todo-quarkus-aks   1.0       b13c389896b7   18 minutes ago   420MB
```

Push the container images to ACR using the following command. 

```azurecli-interactive
TODO_QUARKUS_TAG=$(docker images | grep todo-quarkus-aks | head -n1 | cut -d " " -f1)
echo ${TODO_QUARKUS_TAG}
docker push ${TODO_QUARKUS_TAG}:1.0
```

The output should look similar to the following.

```azurecli-interactive
The push refers to repository [<LOGIN_SERVER_VALUE>/<USER_NAME_VALUE>/todo-quarkus-aks]
dfd615499b3a: Pushed 
56f5cf1aa271: Pushed 
4218d39b228e: Pushed 
b0538737ed64: Pushed 
d13845d85ee5: Pushed 
60609ec85f86: Pushed 
1.0: digest: sha256:0ffd70d6d5bb3a4621c030df0d22cf1aa13990ca1880664d08967bd5bab1f2b6 size: 1995
```

Now that you have pushed the app to Azure Container Registry, you can tell AKS to run the app.

### Deploy a Quarkus App to AKS

Deploy the Kubernetes resources using `kubectl` command line.

```azurecli-interactive
kubectl apply -f target/kubernetes/kubernetes.yml -n ${AKS_NS}
```

The output should look like:

```azurecli-interactive
deployment.apps/quarkus-todo-demo-app-aks created
```

Verify the app is running with the following commands.

```azurecli-interactive
kubectl -n $AKS_NS get pods
```

If the value of the `STATUS` field shows anything other than `Running`, trouble shoot and resolve the problem before continuing. It may help to examine the pod logs, using the following commands.

```azurecli-interactive
kubectl -n $AKS_NS logs $(kubectl -n $AKS_NS get pods | grep quarkus-todo-demo-app-aks | cut -d " " -f1)
```

Get the `EXTERNAL-IP` to access the Todo application using the following command.

```azurecli-interactive
kubectl get svc -n ${AKS_NS}
```

The output should look like:

```bash
NAME                        TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
quarkus-todo-demo-app-aks   LoadBalancer   10.0.236.101   20.12.126.200   80:30963/TCP   37s
```

You can use this command to save the value of `EXTERNAL-IP` to an environment variable as a fully qualified URL.

```azurecli-interactive
export QUARKUS_URL=http://$(kubectl get svc -n ${AKS_NS} | grep quarkus-todo-demo-app-aks | cut -d " " -f10)
echo $QUARKUS_URL
```

Open a new web browser to the value of `${QUARKUS_URL}`. Then, add a new todo item with the text `Deployed the Todo app to AKS`. Also, select the `Introduction to Quarkus Todo App` item as complete.

:::image type="content" source="media/howto-deploy-java-quarkus-app/aks-demo-gui-2.png" alt-text="TODO app running in AKS" lightbox="media/howto-deploy-java-quarkus-app/aks-demo-gui-2.png":::

Access the RESTful API (_/api_) to get all todo items that store in the **Azure PostgreSQL database**.

```azurecli-interactive
curl --verbose ${QUARKUS_URL}/api | jq .
```

The output should look like:

```azurecli-interactive
* Connected to 20.237.68.225 (20.237.68.225) port 80 (#0)
> GET /api HTTP/1.1
> Host: 20.237.68.225
> User-Agent: curl/7.88.1
> Accept: */*
> 
< HTTP/1.1 200 OK
< content-length: 828
< Content-Type: application/json;charset=UTF-8
< 
[
  {
    "id": 2,
    "title": "Quarkus on Azure App Service",
    "completed": false,
    "order": 1,
    "url": "https://learn.microsoft.com/en-us/azure/developer/java/eclipse-microprofile/deploy-microprofile-quarkus-java-app-with-maven-plugin"
  },
  {
    "id": 3,
    "title": "Quarkus on Azure Container Apps",
    "completed": false,
    "order": 2,
    "url": "https://learn.microsoft.com/en-us/training/modules/deploy-java-quarkus-azure-container-app-postgres/"
  },
  {
    "id": 4,
    "title": "Quarkus on Azure Functions",
    "completed": false,
    "order": 3,
    "url": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-first-quarkus"
  },
  {
    "id": 5,
    "title": "Deployed the Todo app to AKS",
    "completed": false,
    "order": 5,
    "url": null
  },
  {
    "id": 1,
    "title": "Introduction to Quarkus Todo App",
    "completed": true,
    "order": 0,
    "url": null
  }
]
```

### Verify the database has been updated using Azure Cloud Shell

Open Azure Cloud Shell in the Azure portal by selecting the icon on the upper-left side:

:::image type="content" source="media/howto-deploy-java-quarkus-app/azure-cli.png" alt-text="Azure Cloud Shell" lightbox="media/howto-deploy-java-quarkus-app/azure-cli.png":::

Run this command locally and paste the result into Azure Cloud Shell.

```azurecli-interactive
echo psql --host=${DB_SERVER_NAME}.postgres.database.azure.com --port=5432 --username=quarkus@${DB_SERVER_NAME} --dbname=todo
```

When asked for the password, use the value you used when you created the database.

Execute the following query to get all todo items:

```azurecli-interactive
select * from todo;
```

The output should be the **same** as the above _Todo App_ GUI:

:::image type="content" source="media/howto-deploy-java-quarkus-app/azure-cli-psql.png" alt-text="Database contents in ASCII table" lightbox="media/howto-deploy-java-quarkus-app/azure-cli-psql.png":::

If presented with `MORE` type `q` to exit the pager.

Enter `\q` to exit from the `psql` program and return to the Cloud Shell. 

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
git reset --hard
docker rmi ${TODO_QUARKUS_TAG}:1.0
docker rmi postgres
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

You may also want to use `docker rmi` to delete the container images for postgres and testcontainers generated by Quarkus dev mode.

## Next steps

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Deploy serverless Java apps with Quarkus on Azure Functions](/azure/azure-functions/functions-create-first-quarkus)
* [Quarkus](https://quarkus.io/)
* [Jakarta EE on AZure](/azure/developer/java/ee)
