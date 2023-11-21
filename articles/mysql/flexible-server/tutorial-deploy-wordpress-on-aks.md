---
title: 'Tutorial: Deploy WordPress on AKS cluster with MySQL Flexible Server by using Azure CLI'
description: Learn how to quickly build and deploy WordPress  on AKS with Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
author: mksuni
ms.author: sumuth
ms.topic: tutorial
ms.date: 11/25/2020
ms.custom: vc, devx-track-azurecli
---

# Tutorial: Deploy WordPress app on AKS with Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

In this quickstart, you deploy a WordPress application on Azure Kubernetes Service (AKS) cluster with Azure Database for MySQL - Flexible Server using the Azure CLI.
**[AKS](../../aks/intro-kubernetes.md)** is a managed Kubernetes service that lets you quickly deploy and manage clusters. **[Azure Database for MySQL - Flexible Server](overview.md)** is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings.

> [!NOTE]
> This quickstart assumes a basic understanding of Kubernetes concepts, WordPress and MySQL.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

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

Use the [az aks create](/cli/azure/aks#az-aks-create) command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. This will take several minutes to complete.

```azurecli-interactive
az aks create --resource-group wordpress-project --name myAKSCluster --node-count 1 --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. See [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command:

```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

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

Create a flexible server with the [az mysql flexible-server create](/cli/azure/mysql/flexible-server) command. The following command creates a server using service defaults and values from your Azure CLI's local context:

```azurecli-interactive
az mysql flexible-server create --public-access <YOUR-IP-ADDRESS>
```

The server created has the below attributes:

- A new empty database, ```flexibleserverdb``` is created when the server is first provisioned. In this quickstart we will use this database.
- Autogenerated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group
- Service defaults for remaining server configurations: compute tier (Burstable), compute size/SKU (B1MS), backup retention period (7 days), and MySQL version (5.7)
- Using public-access argument allow you to create a server with public access protected by firewall rules. By providing your IP address to add the firewall rule to allow access from your client machine.
- Since the command is using Local context it will create the server in the resource group ```wordpress-project``` and in the region ```eastus```.

## Container definitions

In the following example, we're creating two containers, a Nginx web server and a PHP FastCGI processor, based on official Docker images `nginx` and `wordpress` ( `fpm` version with FastCGI support), published on Docker Hub.

Alternatively you can build custom docker image(s) and deploy image(s) into [Docker hub](https://docs.docker.com/get-started/part3/#create-a-docker-hub-repository-and-push-your-image) or [Azure Container registry](../../container-registry/container-registry-get-started-azure-cli.md).

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
> - Update ```env``` section below with your ```SERVERNAME```, ```YOUR-DATABASE-USERNAME```, ```YOUR-DATABASE-PASSWORD``` of your MySQL flexible server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wp-blog
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wp-blog
  template:
    metadata:
      labels:
        app: wp-blog
    spec:
      containers:
      - name: wp-blog-nginx
        image: nginx
        ports:
        - containerPort: 80
        volumeMounts:
        - name: config
          mountPath: /etc/nginx/conf.d
        - name: wp-persistent-storage
          mountPath: /var/www/html

      - name: wp-blog-php
        image: wordpress:fpm
        ports:
        - containerPort: 9000
        volumeMounts:
        - name: wp-persistent-storage
          mountPath: /var/www/html
        env:
        - name: WORDPRESS_DB_HOST
          value: "<<SERVERNAME.mysql.database.azure.com>>" #Update here
        - name: WORDPRESS_DB_USER
          value: "<<YOUR-DATABASE-USERNAME>>"  #Update here
        - name: WORDPRESS_DB_PASSWORD
          value: "<<YOUR-DATABASE-PASSWORD>>"  #Update here
        - name: WORDPRESS_DB_NAME
          value: "<<flexibleserverdb>>"
        - name: WORDPRESS_CONFIG_EXTRA # enable SSL connection for MySQL
          value: | 
            define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
      volumes:
      - name: config
        configMap:
          name: wp-nginx-config
          items:
          - key: config
            path: site.conf

      - name: wp-persistent-storage
        persistentVolumeClaim:
          claimName: wp-pv-claim
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                    - wp-blog
              topologyKey: "kubernetes.io/hostname"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wp-blog
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: v1
kind: Service
metadata:
  name: blog-nginx-service
spec:
  type: LoadBalancer
  ports:
    - port: 80
  selector:
    app: wp-blog
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: wp-nginx-config
data:
  config : |
    server {
         listen       80;
         server_name  localhost;
         root         /var/www/html/;

         access_log /var/log/nginx/wp-blog-access.log;
         error_log  /var/log/nginx/wp-blog-error.log error;
         index index.html index.htm index.php;

         
        location ~* .(ogg|ogv|svg|svgz|eot|otf|woff|mp4|ttf|css|rss|atom|js|jpg|jpeg|gif|png|ico|zip|tgz|gz|rar|bz2|doc|xls|exe|ppt|tar|mid|midi|wav|bmp|rtf)$ {
           expires max;
           index index.php index.html index.htm;
           try_files $uri =404;
        }

        location / {
          index index.php index.html index.htm;
          
          if (-f $request_filename) {
            expires max;
            break;
          }
          
          if (!-e $request_filename) {
            rewrite ^(.+)$ /index.php?q=$1 last;
          }
        }

        location ~ \.php$ {
           fastcgi_split_path_info ^(.+\.php)(/.+)$;
           fastcgi_pass localhost:9000;
           fastcgi_index index.php;
           include fastcgi_params;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           fastcgi_param SCRIPT_NAME $fastcgi_script_name;
           fastcgi_param PATH_INFO $fastcgi_path_info;
        }
      }
```

## Deploy WordPress to AKS cluster

Deploy the application using the [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command and specify the name of your YAML manifest:

```console
kubectl apply -f mywordpress.yaml
```

The following example output shows the Deployments and Services created successfully:

```output
deployment "wordpress-blog" created
service "blog-nginx-service" created
```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

```azurecli-interactive
kubectl get service blog-nginx-service --watch
```

Initially the *EXTERNAL-IP* for the *wordpress-blog* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
blog-nginx-service  LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
 blog-nginx-service  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

### Browse WordPress

Open a web browser to the external IP address of your service to see your WordPress installation page.

   :::image type="content" source="./media/tutorial-deploy-wordpress-on-aks/wordpress-aks-installed-success.png" alt-text="Wordpress installation success on AKS and MySQL flexible server":::

> [!NOTE]
>
> - Currently the WordPress site is not using HTTPS. It is recommended to [ENABLE TLS with your own certificates](../../aks/ingress-own-tls.md).
> - You can enable [HTTP routing](../../aks/http-application-routing.md) for your cluster.

## Clean up the resources

To avoid Azure charges, you should clean up unneeded resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name wordpress-project --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Microsoft Entra service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion](../../aks/kubernetes-service-principal.md#other-considerations). If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

- Learn how to [access the Kubernetes web dashboard](../../aks/kubernetes-dashboard.md) for your AKS cluster
- Learn how to [scale your cluster](../../aks/tutorial-kubernetes-scale.md)
- Learn how to manage your [MySQL flexible server](./quickstart-create-server-cli.md)
- Learn how to [configure server parameters](./how-to-configure-server-parameters-cli.md) for your database server.
