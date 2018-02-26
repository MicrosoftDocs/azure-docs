---
title: Integrate with Azure-managed services using Open Service Broker for Azure (OSBA)
description: Integrate with Azure-managed services using Open Service Broker for Azure (OSBA)
services: container-service
author: sozercan
manager: timlt

ms.service: container-service
ms.topic: overview
ms.date: 12/05/2017
ms.author: seozerca
---
# Integrate with Azure-managed services using Open Service Broker for Azure (OSBA)

Together with the [Kubernetes Service Catalog][kubernetes-service-catalog], Open Service Broker for Azure (OSBA) allows developers to utilize Azure-managed services in Kubernetes. This guide focuses on deploying Kubernetes Service Catalog, Open Service Broker for Azure (OSBA), and applications that use Azure-managed services using Kubernetes.

## Prerequisites
* An Azure subscription

* Azure CLI 2.0: You can [install it locally][azure-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].

* Helm CLI 2.7+: You can [install it locally][helm-cli-install], or use it in the [Azure Cloud Shell][azure-cloud-shell].

* Permissions to create a service principal with the Contributor role on your Azure subscription

* An existing Azure Container Service (AKS) cluster. If you need an AKS cluster, follow the [Create an AKS cluster][create-aks-cluster] quickstart.

## Install Service Catalog

The first step is to install Service Catalog in your Kubernetes cluster using a Helm chart. Upgrade your Tiller (Helm server) installation in your cluster with:

```azurecli-interactive
helm init --upgrade
```

Now, add the Service Catalog chart to the Helm repository:

```azurecli-interactive
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

Finally, install Service Catalog with the Helm chart:

```azurecli-interactive
helm install svc-cat/catalog --name catalog --namespace catalog --set rbacEnable=false
```

After the Helm chart has been run, verify that `servicecatalog` appears in the output of the following command:

```azurecli-interactive
kubectl get apiservice
```

For example, you should see output similar to the following (show here truncated):

```
NAME                                 AGE
v1.                                  10m
v1.authentication.k8s.io             10m
...
v1beta1.servicecatalog.k8s.io        34s
v1beta1.storage.k8s.io               10
```

## Install Open Service Broker for Azure

The next step is to install [Open Service Broker for Azure][open-service-broker-azure], which includes the catalog for the Azure-managed services. Examples of available Azure services are Azure Database for PostgreSQL, Azure Redis Cache, Azure Database for MySQL, Azure Cosmos DB, Azure SQL Database, and others.

Start by adding the Open Service Broker for Azure Helm repository:

```azurecli-interactive
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure
```

Next, use the following script to create a [Service Principal][create-service-principal] and populate several variables. These variables are used when running the Helm chart to install the service broker.

```azurecli-interactive
SERVICE_PRINCIPAL=$(az ad sp create-for-rbac)
AZURE_CLIENT_ID=$(echo $SERVICE_PRINCIPAL | cut -d '"' -f 4)
AZURE_CLIENT_SECRET=$(echo $SERVICE_PRINCIPAL | cut -d '"' -f 16)
AZURE_TENANT_ID=$(echo $SERVICE_PRINCIPAL | cut -d '"' -f 20)
AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
```

Now that you've populated these environment variables, execute the following command to install the service broker.

```azurecli-interactive
helm install azure/open-service-broker-azure --name osba --namespace osba \
    --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID \
    --set azure.tenantId=$AZURE_TENANT_ID \
    --set azure.clientId=$AZURE_CLIENT_ID \
    --set azure.clientSecret=$AZURE_CLIENT_SECRET
```

Once the OSBA deployment is complete, install the [Service Catalog CLI][service-catalog-cli], an easy-to-use command-line interface for querying service brokers, service classes, service plans, and more.

Execute the following commands to install the Service Catalog CLI binary:

```azurecli-interactive
curl -sLO https://servicecatalogcli.blob.core.windows.net/cli/latest/$(uname -s)/$(uname -m)/svcat
chmod +x ./svcat
```

Now, list installed service brokers:

```azurecli-interactive
./svcat get brokers
```

You should see output similar to the following:

```
  NAME                               URL                                STATUS
+------+--------------------------------------------------------------+--------+
  osba   http://osba-open-service-broker-azure.osba.svc.cluster.local   Ready
```

Next, list the available service classes. The displayed service classes are the available Azure-managed services that can be provisioned through Open Service Broker for Azure.

```azurecli-interactive
./svcat get classes
```

Finally, list all available service plans. Service plans are the service tiers for the Azure-managed services. For example, for Azure Database for MySQL, plans range from `basic50` for Basic tier with 50 Database Transaction Units (DTUs), to `standard800` for Standard tier with 800 DTUs.

```azurecli-interactive
./svcat get plans
```

## Install WordPress from Helm chart using Azure Database for MySQL

In this step, you use Helm to install an updated Helm chart for WordPress. The chart provisions an external Azure Database for MySQL instance that WordPress can use. This process can take a few minutes.

```azurecli-interactive
helm install azure/wordpress --name wordpress --namespace wordpress --set resources.requests.cpu=0
```

In order to verify the installation has provisioned the right resources, list the installed service instances and bindings:

```azurecli-interactive
./svcat get instances -n wordpress
./svcat get bindings -n wordpress
```

List installed secrets:

```azurecli-interactive
kubectl get secrets -n wordpress -o yaml
```

## Next steps

By following this article, you deployed Service Catalog to an Azure Container Service (AKS) cluster. You used Open Service Broker for Azure to deploy a WordPress installation that uses Azure-managed services, in this case Azure Database for MySQL.

Refer to the [Azure/helm-charts][helm-charts] repository to access other updated OSBA-based Helm charts. If you're interested in creating your own charts that work with OSBA, refer to [Creating a New Chart][helm-create-new-chart].

<!-- LINKS - external -->
[helm-charts]: https://github.com/Azure/helm-charts
[helm-cli-install]: kubernetes-helm.md#install-helm-cli
[helm-create-new-chart]: https://github.com/Azure/helm-charts#creating-a-new-chart
[kubernetes-service-catalog]: https://github.com/kubernetes-incubator/service-catalog
[open-service-broker-azure]: https://github.com/Azure/open-service-broker-azure
[service-catalog-cli]: https://github.com/Azure/service-catalog-cli

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-cloud-shell]: ../cloud-shell/overview.md
[create-aks-cluster]: ./kubernetes-walkthrough.md
[create-service-principal]: ./kubernetes-service-principal.md
