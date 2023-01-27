---
title: 'Tutorial: Deploy Django on AKS cluster with PostgreSQL Flexible Server by using Azure CLI'
description: Learn how to quickly build and deploy Django  on AKS with Azure Database for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: tutorial
ms.date: 11/30/2021
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Deploy Django app on AKS with Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this quickstart, you deploy a Django application on Azure Kubernetes Service (AKS) cluster with Azure Database for PostgreSQL - Flexible Server  using the Azure CLI.

**[AKS](../../aks/intro-kubernetes.md)** is a managed Kubernetes service that lets you quickly deploy and manage clusters. **[Azure Database for PostgreSQL - Flexible Server ](overview.md)** is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings.

> [!NOTE]
> This quickstart assumes a basic understanding of Kubernetes concepts, Django and PostgreSQL.

## Pre-requisites


[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

- Launch [Azure Cloud Shell](https://shell.azure.com) in new browser window. You can [install Azure CLI](/cli/azure/install-azure-cli#install) on your local machine too. If you're using a local install, login with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal. 
- Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade). This article requires the latest version of Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Let's create a resource group, *django-project* using the [az-group-create](/cli/azure/group#az-group-create) command  in the *eastus* location.

```azurecli-interactive
az group create --name django-project --location eastus
```

> [!NOTE]
> The location for the resource group is where resource group metadata is stored. It is also where your resources run in Azure if you don't specify another region during resource creation.

The following example output shows the resource group created successfully:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/django-project",
  "location": "eastus",
  "managedBy": null,
  
  "name": "django-project",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create AKS cluster

Use the [az aks create](/cli/azure/aks#az-aks-create) command to create an AKS cluster. The following example creates a cluster named *djangoappcluster* with one node. This will take several minutes to complete.

```azurecli-interactive
az aks create --resource-group django-project --name djangoappcluster --node-count 1 --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When creating an AKS cluster a second resource group is automatically created to store the AKS resources. See [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. 

> [!NOTE] 
> If running Azure CLI locally , please run the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command to install `kubectl`.

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group django-project --name djangoappcluster
```

To verify the connection to your cluster, use the [kubectl get]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*:

```output
NAME                       STATUS   ROLES   AGE     VERSION
aks-nodepool1-31718369-0   Ready    agent   6m44s   v1.12.8
```

## Create an Azure Database for PostgreSQL - Flexible Server

Create a flexible server with the [az postgreSQL flexible-server create](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-create) command. The following command creates a server using service defaults and values from your Azure CLI's local context:

```azurecli-interactive
az postgres flexible-server create --public-access all
```

The server created has the below attributes:
- A new empty database, ```postgres``` is created when the server is first provisioned. In this quickstart we will use this database.
- Autogenerated server name, admin username, admin password, resource group name (if not already specified in local context), and in the same location as your resource group
- Using public-access argument allow you to create a server with public access to any client with correct username and password.
- Since the command is using local context it will create the server in the resource group ```django-project``` and in the region ```eastus```.

## Build your Django docker image

Create a new [Django application](https://docs.djangoproject.com/en/3.1/intro/) or use your existing Django project. Make sure your code is in this folder structure. 

```python
└───my-djangoapp
    └───views.py
    └───models.py
    └───forms.py
    ├───templates
          . . . . . . .
    ├───static
         . . . . . . .
└───my-django-project
    └───settings.py
    └───urls.py
    └───wsgi.py
        . . . . . . .
    └─── Dockerfile
    └─── requirements.txt
    └─── manage.py
```

Update ```ALLOWED_HOSTS``` in ```settings.py``` to make sure the Django application uses the external IP that gets assigned to kubernetes app.

```python
ALLOWED_HOSTS = ['*']
```

Update ```DATABASES={ }``` section in the ```settings.py```  file. The code snippet below is reading the database host, username and password from the Kubernetes manifest file.

```python
DATABASES={
   'default':{
      'ENGINE':'django.db.backends.postgresql_psycopg2',
      'NAME':os.getenv('DATABASE_NAME'),
      'USER':os.getenv('DATABASE_USER'),
      'PASSWORD':os.getenv('DATABASE_PASSWORD'),
      'HOST':os.getenv('DATABASE_HOST'),
      'PORT':'5432',
      'OPTIONS': {'sslmode': 'require'}
   }
}
```

### Generate a requirements.txt file

Create a ```requirements.txt``` file to list out the dependencies for the Django Application. Here is an example ```requirements.txt``` file. You can use [``` pip freeze > requirements.txt```](https://pip.pypa.io/en/stable/reference/pip_freeze/) to generate a requirements.txt file for your existing application.

``` text
Django==2.2.17
postgres==3.0.0
psycopg2-binary==2.8.6
psycopg2-pool==1.1
pytz==2020.4
```

### Create a Dockerfile

Create a new file named ```Dockerfile``` and copy the code snippet below. This Dockerfile in setting up Python 3.8 and installing all the requirements listed in requirements.txt file.

```docker
# Use the official Python image from the Docker Hub

FROM python:3.8.2

# Make a new directory to put our code in.

RUN mkdir /code

# Change the working directory.

WORKDIR /code

# Copy to code folder

COPY . /code/

# Install the requirements.

RUN pip install -r requirements.txt

# Run the application:

CMD python manage.py runserver 0.0.0.0:8000
```

### Build your image

Make sure you're in the directory ```my-django-app``` in a terminal using the ```cd``` command. Run the following command to build your bulletin board image:

```bash
docker build --tag myblog:latest .
```

Deploy your image to [Docker hub](https://docs.docker.com/get-started/part3/#create-a-docker-hub-repository-and-push-your-image) or [Azure Container registry](../../container-registry/container-registry-get-started-azure-cli.md).

> [!IMPORTANT]
> If you are using Azure container registry (ACR), then run the ```az aks update``` command to attach ACR account with the AKS cluster.
>
> ```azurecli-interactive
> az aks update -n djangoappcluster -g django-project --attach-acr <your-acr-name>
> ```

## Create Kubernetes manifest file

A Kubernetes manifest file defines a desired state for the cluster, such as what container images to run. Let's create a manifest file named ```djangoapp.yaml``` and copy in the following YAML definition. 

> [!IMPORTANT]
> Update ```env``` section below with your ```SERVERNAME```, ```YOUR-DATABASE-USERNAME```, ```YOUR-DATABASE-PASSWORD``` of your postgres flexible server.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: django-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: django-app
  template:
    metadata:
      labels:
        app: django-app
    spec:
      containers:
      - name: django-app
        image: [DOCKER-HUB-USER-OR-ACR-ACCOUNT]/[YOUR-IMAGE-NAME]:[TAG]
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_HOST
          value: "SERVERNAME.postgres.database.azure.com"
        - name: DATABASE_USER
          value: "YOUR-DATABASE-USERNAME"
        - name: DATABASE_PASSWORD
          value: "YOUR-DATABASE-PASSWORD"
        - name: DATABASE_NAME
          value: "postgres"
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchExpressions:
                  - key: "app"
                    operator: In
                    values:
                    - django-app
              topologyKey: "kubernetes.io/hostname"
---
apiVersion: v1
kind: Service
metadata:
  name: python-svc
spec:
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  selector:
    app: django-app
```

## Deploy Django to AKS cluster

Deploy the application using the [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command and specify the name of your YAML manifest:

```console
kubectl apply -f djangoapp.yaml
```

The following example output shows the Deployments and Services created successfully:

```output
deployment "django-app" created
service "python-svc" created
```

A deployment ```django-app``` allows you to describes details on of your deployment such as which images to use for the app, the number of pods and pod configuration. A service ```python-svc``` is created to expose the application through an external IP.

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

```azurecli-interactive
kubectl get service python-svc --watch
```

Initially the *EXTERNAL-IP* for the *django-app* service is shown as *pending*.

```output
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
django-app   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
django-app  LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

Now open a web browser to the external IP address of your service (http://\<service-external-ip-address\>) and view the Django application.  

> [!NOTE]
> - Currently the Django site is not using HTTPS. It is recommended to [ENABLE TLS with your own certificates](../../aks/ingress-own-tls.md).
> - You can enable [HTTP routing](../../aks/http-application-routing.md) for your cluster. When http routing is enabled, it configures an Ingress controller in your AKS cluster. As > > applications are deployed, the solution also creates publicly accessible DNS names for application endpoints.

## Run database migrations

For any django application, you would need to run database migration or collect static files. You can run these django shell commands using `$ kubectl exec <pod-name> -- [COMMAND]`.  Before running the command you need to find the pod name using `kubectl get pods`. 

```bash
$ kubectl get pods
```

You will see an output like this:

```output
NAME                             READY   STATUS          RESTARTS   AGE
django-app-5d9cd6cd8-l6x4b     1/1     Running              0       2m
```

Once the pod name has been found you can run django database migrations with the command ```$ kubectl exec <pod-name> -- [COMMAND]```. Note ```/code/``` is the working directory for the project define in ```Dockerfile``` above.

```bash
$ kubectl exec django-app-5d9cd6cd8-l6x4b -- python /code/manage.py migrate
```

The output would look like 
```output 
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  . . . . . . 
```

If you run into issues, please run ```kubectl logs <pod-name>```  to see what exception is thrown by your application. If the application is working successfully you would see an output like this when running ```kubectl logs```.

```output
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 17 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
December 08, 2020 - 23:24:14
Django version 2.2.17, using settings 'django_postgres_app.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

## Clean up the resources

To avoid Azure charges, you should clean up unneeded resources.  When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name django-project --yes --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion](../../aks/kubernetes-service-principal.md#other-considerations). If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

- Learn how to [access the Kubernetes web dashboard](../../aks/kubernetes-dashboard.md) for your AKS cluster
- Learn how to [enable continuous deployment](../../aks/deployment-center-launcher.md)
- Learn how to [scale your cluster](../../aks/tutorial-kubernetes-scale.md)
- Learn how to manage your [postgres flexible server](./quickstart-create-server-cli.md)
- Learn how to [configure server parameters](./howto-configure-server-parameters-using-cli.md) for your database server.
