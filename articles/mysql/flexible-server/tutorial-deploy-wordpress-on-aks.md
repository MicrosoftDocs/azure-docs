---
title: 'Tutorial: Deploy WordPress on AKS cluster with MySQL Flexible Server by using Azure CLI'
description: Learn how to quickly build and deploy WordPress  on AKS with Azure Database for MySQL - Flexible Server.
ms.service: mysql
author: mksuni
ms.author: sumuth
ms.topic: tutorial
ms.date: 11/25/2020
ms.custom: vc, devx-track-azurecli
---

# Tutorial: Deploy WordPress app on AKS with Azure Database for MySQL - Flexible Server

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

In this quickstart, you deploy a WordPress application on Azure Kubernetes Service (AKS) cluster with Azure Database for MySQL - Flexible Server (Preview) using the Azure CLI. 
**[AKS](../../aks/intro-kubernetes.md)** is a managed Kubernetes service that lets you quickly deploy and manage clusters. **[Azure Database for MySQL - Flexible Server (Preview)](overview.md)** is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. Currently Flexible server is in Preview.

> [!NOTE]
>
> - Azure Database for MySQL Flexible Server is currently in public preview
> - This quickstart assumes a basic understanding of Kubernetes concepts, WordPress and MySQL.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

- This article requires the latest version of Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

> [!NOTE]
> If running the commands in this quickstart locally (instead of Azure Cloud Shell), ensure you run the commands as administrator.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Let's create a resource group, *wordpress-project* using the [az group create][az-group-create] command  in the *eastus* location.

```azurecli-interactive
az group create --name wordpress-project --location eastus
```

> [!NOTE]
> The location for the resource group is where resource group metadata is stored. It is also where your resources run in Azure if you don't specify another region during resource creation.

The following example output shows the resource group created successfully:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/wordpress-project",
  "location": "eastus",
  "managedBy": null,
  "name": "wordpress-project",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create AKS cluster

Use the [az aks create](/cli/azure/aks#az_aks_create) command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. This will take several minutes to complete.

```azurecli-interactive
az aks create --resource-group wordpress-project --name myAKSCluster --node-count 1 --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. See [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az_aks_install_cli) command:

```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az_aks_get_credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group wordpress-project --name myAKSCluster
```

> [!NOTE]
> The above command uses the default location for the [Kubernetes configuration file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/), which is `~/.kube/config`. You can specify a different location for your Kubernetes configuration file using *--file*.

To verify the connection to your cluster, use the [kubectl get]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*:

```output
NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.12.8
```

## Create an Azure Database for MySQL - Flexible Server

Create a flexible server with the [az mysql flexible-server create](/cli/azure/mysql/flexible-server)command. The following command creates a server using service defaults and values from your Azure CLI's local context:

```azurecli-interactive
az mysql flexible-server create --public-access <YOUR-IP-ADDRESS>
```

The server created has the below attributes:

- A new empty database, ```flexibleserverdb``` is created when the server is first provisioned. In this quickstart we will use this database.
- Autogenerated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group
- Service defaults for remaining server configurations: compute tier (Burstable), compute size/SKU (B1MS), backup retention period (7 days), and MySQL version (5.7)
- Using public-access argument allow you to create a server with public access protected by firewall rules. By providing your IP address to add the firewall rule to allow access from your client machine.
- Since the command is using Local context it will create the server in the resource group ```wordpress-project``` and in the region ```eastus```.

### Build your WordPress docker image

Download the [latest WordPress](https://wordpress.org/download/) version. Create new directory ```my-wordpress-app``` for your project and use this simple folder structure

```wordpress
└───my-wordpress-app
    └───public
        ├───wp-admin
        │   ├───css
      	. . . . . . .
        ├───wp-content
        │   ├───plugins
        . . . . . . .
        └───wp-includes
        . . . . . . .
        ├───wp-config-sample.php
        ├───index.php
        . . . . . . .
    └─── Dockerfile

```

Rename ```wp-config-sample.php```  to ```wp-config.php``` and replace lines 21 to 32 with this code snippet. The code snippet below is reading the database host , username and password from the Kubernetes manifest file.

```php
//Using environment variables for DB connection information

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */

$connectstr_dbhost = getenv('DATABASE_HOST');
$connectstr_dbusername = getenv('DATABASE_USERNAME');
$connectstr_dbpassword = getenv('DATABASE_PASSWORD');

/** MySQL database name */
define('DB_NAME', 'flexibleserverdb');

/** MySQL database username */
define('DB_USER', $connectstr_dbusername);

/** MySQL database password */
define('DB_PASSWORD',$connectstr_dbpassword);

/** MySQL hostname */
define('DB_HOST', $connectstr_dbhost);

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');


/** SSL*/
define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
```

### Create a Dockerfile

Create a new Dockerfile and copy this code snippet. This Dockerfile in setting up Apache web server with PHP and enabling mysqli extension.

```docker
FROM php:7.2-apache
COPY public/ /var/www/html/
RUN docker-php-ext-install mysqli
RUN docker-php-ext-enable mysqli
```

### Build your docker image

Make sure you're in the directory ```my-wordpress-app``` in a terminal using the ```cd``` command. Run the following command to build the image:

``` bash

docker build --tag myblog:latest .

```

Deploy your image to [Docker hub](https://docs.docker.com/get-started/part3/#create-a-docker-hub-repository-and-push-your-image) or [Azure Container registry](../../container-registry/container-registry-get-started-azure-cli.md).

> [!IMPORTANT]
> If you are using Azure container regdistry (ACR), then run the ```az aks update``` command to attach ACR account with the AKS cluster.
>
> ```azurecli-interactive
> az aks update -n myAKSCluster -g wordpress-project --attach-acr <your-acr-name>
> ```

## Create Kubernetes manifest file

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. Let's create a manifest file named `mywordpress.yaml` and copy in the following YAML definition.

> [!IMPORTANT]
>
> - Replace ```[DOCKER-HUB-USER/ACR ACCOUNT]/[YOUR-IMAGE-NAME]:[TAG]``` with your actual WordPress docker image name and tag, for example ```docker-hub-user/myblog:latest```.
> - Update ```env``` section below with your ```SERVERNAME```, ```YOUR-DATABASE-USERNAME```, ```YOUR-DATABASE-PASSWORD``` of your MySQL flexible server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-blog
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress-blog
  template:
    metadata:
      labels:
        app: wordpress-blog
    spec:
      containers:
      - name: wordpress-blog
        image: [DOCKER-HUB-USER-OR-ACR-ACCOUNT]/[YOUR-IMAGE-NAME]:[TAG]
        ports:
        - containerPort: 80
        env:
        - name: DATABASE_HOST
          value: "SERVERNAME.mysql.database.azure.com"
        - name: DATABASE_USERNAME
          value: "YOUR-DATABASE-USERNAME"
        - name: DATABASE_PASSWORD
          value: "YOUR-DATABASE-PASSWORD"
        - name: DATABASE_NAME
          value: "flexibleserverdb"
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                    - wordpress-blog
              topologyKey: "kubernetes.io/hostname"
---
apiVersion: v1
kind: Service
metadata:
  name: php-svc
spec:
  type: LoadBalancer
  ports:
    - port: 80
  selector:
    app: wordpress-blog
```

## Deploy WordPress to AKS cluster

Deploy the application using the [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command and specify the name of your YAML manifest:

```console
kubectl apply -f mywordpress.yaml
```

The following example output shows the Deployments and Services created successfully:

```output
deployment "wordpress-blog" created
service "php-svc" created
```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

```azurecli-interactive
kubectl get service wordpress-blog --watch
```

Initially the *EXTERNAL-IP* for the *wordpress-blog* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
wordpress-blog   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
wordpress-blog  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

### Browse WordPress

Open a web browser to the external IP address of your service to see your WordPress installation page.

   :::image type="content" source="./media/tutorial-deploy-wordpress-on-aks/wordpress-aks-installed-success.png" alt-text="Wordpress installation success on AKS and MySQL flexible server":::

> [!NOTE]
>
> - Currently the WordPress site is not using HTTPS. It is recommended to [ENABLE TLS with your own certificates](../../aks/ingress-own-tls.md).
> - You can enable [HTTP routing](../../aks/http-application-routing.md) for your cluster.

## Clean up the resources

To avoid Azure charges, you should clean up unneeded resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name wordpress-project --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion](../../aks/kubernetes-service-principal.md#additional-considerations). If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

- Learn how to [access the Kubernetes web dashboard](../../aks/kubernetes-dashboard.md) for your AKS cluster
- Learn how to [scale your cluster](../../aks/tutorial-kubernetes-scale.md)
- Learn how to manage your [MySQL flexible server](./quickstart-create-server-cli.md)
- Learn how to [configure server parameters](./how-to-configure-server-parameters-cli.md) for your database server.
