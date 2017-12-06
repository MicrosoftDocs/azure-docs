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

Together with the [Kubernetes Service Catalog](https://github.com/kubernetes-incubator/service-catalog), Open Service Broker for Azure (OSBA) allows developers to utilize Azure-managed services in Kubernetes. This guide focuses on deploying Kubernetes Service Catalog, Open Service Broker for Azure (OSBA), and applications that use Azure-managed services using Kubernetes.

## Prerequisites
* An Azure subscription

* Azure CLI 2.0: You can [install it locally](cli/azure/install-azure-cli), or use it in the [Azure Cloud Shell](../cloud-shell/overview.md).

* Helm CLI 2.7+: You can [install it locally](kubernetes-helm.md#install-helm-cli), or use it in the [Azure Cloud Shell](../cloud-shell/overview.md).

* Permissions to create a service principal with the Contributor role on your Azure subscription

* An existing Azure Container Service (AKS) cluster. If you need an AKS cluster, follow the [Create an AKS cluster](kubernetes-walkthrough.md) quickstart.

## Install Service Catalog

The first step is to install Service Catalog in your Kubernetes cluster using a Helm chart. Upgrade your Tiller (Helm server) installation in your cluster with:

```Bash
helm init --upgrade
```

Now, add the Service Catalog chart to the Helm repository:

```Bash
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

Finally, install Service Catalog with the Helm chart:

```Bash
helm install svc-cat/catalog --name catalog --namespace catalog --set rbacEnable=false
```

After the Helm chart has been run, verify that `servicecatalog` appears in the output of the following command:

```Bash
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

The next step is to install [Open Service Broker for Azure](https://github.com/Azure/open-service-broker-azure), which includes the catalog for the Azure-managed services. Examples of available Azure services are Azure Database for PostgreSQL, Azure Redis Cache, Azure Database for MySQL, Azure Cosmos DB, Azure SQL Database, and others.

Let's start by adding the Open Service Broker for Azure Helm repository:

```Bash
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure
```

Create a [Service Principal](kubernetes-service-principal.md) with the following Azure CLI command:

```azurecli-interactive
az ad sp create-for-rbac --skip-assignment
```

Output should be similar to the following. Take note of the `appId`, `password`, and `tenant` values, which you use in the next step.

```JSON
{
  "appId": "7248f250-0000-0000-0000-dbdeb8400d85",
  "displayName": "azure-cli-2017-10-15-02-20-15",
  "name": "http://azure-cli-2017-10-15-02-20-15",
  "password": "77851d2c-0000-0000-0000-cb3ebc97975a",
  "tenant": "72f988bf-0000-0000-0000-2d7cd011db47"
}
```

Set the following environment variables with the preceding values:

```Bash
AZURE_CLIENT_ID=<appId>
AZURE_CLIENT_SECRET=<password>
AZURE_TENANT_ID=<tenant>
```

Now, get your Azure subscription ID:

```azurecli-interactive
az account show --query id --output tsv
```

Again, set the following environment variable with the preceding value:

```Bash
AZURE_SUBSCRIPTION_ID=[your Azure subscription ID from above]
```

Now that you've populated these environment variables, execute the following command to install the Open Service Broker for Azure using the Helm chart:

```Bash
helm install azure/open-service-broker-azure --name osba --namespace osba \
    --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID \
    --set azure.tenantId=$AZURE_TENANT_ID \
    --set azure.clientId=$AZURE_CLIENT_ID \
    --set azure.clientSecret=$AZURE_CLIENT_SECRET
```

Once the OSBA deployment is complete, install the [Service Catalog CLI](https://github.com/Azure/service-catalog-cli), an easy-to-use command-line interface for querying service brokers, service classes, service plans, and more.

Execute the following commands to install the Service Catalog CLI binary:

```Bash
curl -sLO https://servicecatalogcli.blob.core.windows.net/cli/latest/$(uname -s)/$(uname -m)/svcat
chmod +x ./svcat
```

Now, list installed service brokers:

```Bash
./svcat get brokers
```

You should see output similar to the following:

```
  NAME                               URL                                STATUS
+------+--------------------------------------------------------------+--------+
  osba   http://osba-open-service-broker-azure.osba.svc.cluster.local   Ready
```

Next, list the available service classes. The displayed service classes are the available Azure-managed services that can be provisioned through Open Service Broker for Azure.

```Bash
./svcat get classes
```

Finally, list all available service plans. Service plans are the service tiers for the Azure-managed services. For example, for Azure Database for MySQL, plans range from `basic50` for Basic tier with 50 Database Transaction Units (DTUs), to `standard800` for Standard tier with 800 DTUs.

```Bash
./svcat get plans
```

## Install WordPress from Helm chart using Azure Database for MySQL

In this step, you use Helm to install an updated Helm chart for WordPress. The chart provisions an external Azure Database for MySQL instance that WordPress can use. This process can take a few minutes.

```Bash
helm install azure/wordpress --name wordpress --namespace wordpress
```

In order to verify the installation has provisioned the right resources, list the installed service instances and bindings:

```Bash
./svcat get instances -n wordpress
./svcat get bindings -n wordpress
```

List installed secrets:

```Bash
kubectl get secrets -n wordpress -o yaml
```

## Next steps

By following this article, you deployed Service Catalog to an Azure Container Service (AKS) cluster. You used Open Service Broker for Azure to deploy a WordPress installation that uses Azure-managed services, in this case Azure Database for MySQL.

Refer to the [Azure/helm-charts](https://github.com/Azure/helm-charts) repository to access other updated OSBA-based Helm charts. If you're interested in creating your own charts that work with OSBA, refer to [Creating a New Chart](https://github.com/Azure/helm-charts#creating-a-new-chart).
