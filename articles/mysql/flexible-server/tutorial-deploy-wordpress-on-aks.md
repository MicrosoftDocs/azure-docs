---
title: 'Tutorial: Deploy WordPress on AKS cluster by using Azure CLI'
description: Learn how to quickly build and deploy WordPress on AKS with Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
author: mksuni
ms.author: sumuth
ms.topic: tutorial
ms.date: 3/20/2024
ms.custom: vc, devx-track-azurecli, innovation-engine, linux-related-content
---

# Tutorial: Deploy WordPress app on AKS with Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://go.microsoft.com/fwlink/?linkid=2262843)

In this tutorial, you deploy a scalable WordPress application secured via HTTPS on an Azure Kubernetes Service (AKS) cluster with Azure Database for MySQL flexible server using the Azure CLI.
**[AKS](../../aks/intro-kubernetes.md)** is a managed Kubernetes service that lets you quickly deploy and manage clusters. **[Azure Database for MySQL flexible server](overview.md)** is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings.

> [!NOTE]
> This tutorial assumes a basic understanding of Kubernetes concepts, WordPress, and MySQL.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Prerequisites 

Before you get started, make sure you're logged into Azure CLI and have selected a subscription to use with the CLI. Ensure you have [Helm installed](https://helm.sh/docs/intro/install/).

> [!NOTE]
> If you're running the commands in this tutorial locally instead of Azure Cloud Shell, run the commands as administrator.

## Define Environment Variables

The first step in this tutorial is to define environment variables.

```bash
export SSL_EMAIL_ADDRESS="$(az account show --query user.name --output tsv)"
export NETWORK_PREFIX="$(($RANDOM % 253 + 1))"
export RANDOM_ID="$(openssl rand -hex 3)"
export MY_RESOURCE_GROUP_NAME="myWordPressAKSResourceGroup$RANDOM_ID"
export REGION="westeurope"
export MY_AKS_CLUSTER_NAME="myAKSCluster$RANDOM_ID"
export MY_PUBLIC_IP_NAME="myPublicIP$RANDOM_ID"
export MY_DNS_LABEL="mydnslabel$RANDOM_ID"
export MY_VNET_NAME="myVNet$RANDOM_ID"
export MY_VNET_PREFIX="10.$NETWORK_PREFIX.0.0/16"
export MY_SN_NAME="mySN$RANDOM_ID"
export MY_SN_PREFIX="10.$NETWORK_PREFIX.0.0/22"
export MY_MYSQL_DB_NAME="mydb$RANDOM_ID"
export MY_MYSQL_ADMIN_USERNAME="dbadmin$RANDOM_ID"
export MY_MYSQL_ADMIN_PW="$(openssl rand -base64 32)"
export MY_MYSQL_SN_NAME="myMySQLSN$RANDOM_ID"
export MY_MYSQL_HOSTNAME="$MY_MYSQL_DB_NAME.mysql.database.azure.com"
export MY_WP_ADMIN_PW="$(openssl rand -base64 32)"
export MY_WP_ADMIN_USER="wpcliadmin"
export FQDN="${MY_DNS_LABEL}.${REGION}.cloudapp.azure.com"
```

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. All resources must be placed in a resource group. The following command creates a resource group with the previously defined `$MY_RESOURCE_GROUP_NAME` and `$REGION` parameters.

```bash
az group create \
    --name $MY_RESOURCE_GROUP_NAME \
    --location $REGION
```

Results:
<!-- expected_similarity=0.3 -->
```json
{
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myWordPressAKSResourceGroupXXX",
  "location": "eastus",
  "managedBy": null,
  "name": "testResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

> [!NOTE]
> The location for the resource group is where resource group metadata is stored. It's also where your resources run in Azure if you don't specify another region during resource creation.

## Create a virtual network and subnet

A virtual network is the fundamental building block for private networks in Azure. Azure Virtual Network enables Azure resources like VMs to securely communicate with each other and the internet.

```bash
az network vnet create \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --location $REGION \
    --name $MY_VNET_NAME \
    --address-prefix $MY_VNET_PREFIX \
    --subnet-name $MY_SN_NAME \
    --subnet-prefixes $MY_SN_PREFIX
```

Results:
<!-- expected_similarity=0.3 -->
```json
{
  "newVNet": {
    "addressSpace": {
      "addressPrefixes": [
        "10.210.0.0/16"
      ]
    },
    "enableDdosProtection": false,
    "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/myWordPressAKSResourceGroupXXX/providers/Microsoft.Network/virtualNetworks/myVNetXXX",
    "location": "eastus",
    "name": "myVNet210",
    "provisioningState": "Succeeded",
    "resourceGroup": "myWordPressAKSResourceGroupXXX",
    "subnets": [
      {
        "addressPrefix": "10.210.0.0/22",
        "delegations": [],
        "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/myWordPressAKSResourceGroupXXX/providers/Microsoft.Network/virtualNetworks/myVNetXXX/subnets/mySNXXX",
        "name": "mySN210",
        "privateEndpointNetworkPolicies": "Disabled",
        "privateLinkServiceNetworkPolicies": "Enabled",
        "provisioningState": "Succeeded",
        "resourceGroup": "myWordPressAKSResourceGroupXXX",
        "type": "Microsoft.Network/virtualNetworks/subnets"
      }
    ],
    "type": "Microsoft.Network/virtualNetworks",
    "virtualNetworkPeerings": []
  }
}
```

## Create an Azure Database for MySQL flexible server instance

Azure Database for MySQL flexible server is a managed service that you can use to run, manage, and scale highly available MySQL servers in the cloud. Create an Azure Database for MySQL flexible server instance with the [az mysql flexible-server create](/cli/azure/mysql/flexible-server) command. A server can contain multiple databases. The following command creates a server using service defaults and variable values from your Azure CLI's local context:

```bash
echo "Your MySQL user $MY_MYSQL_ADMIN_USERNAME password is: $MY_WP_ADMIN_PW" 
```

```bash
az mysql flexible-server create \
    --admin-password $MY_MYSQL_ADMIN_PW \
    --admin-user $MY_MYSQL_ADMIN_USERNAME \
    --auto-scale-iops Disabled \
    --high-availability Disabled \
    --iops 500 \
    --location $REGION \
    --name $MY_MYSQL_DB_NAME \
    --database-name wordpress \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --sku-name Standard_B2s \
    --storage-auto-grow Disabled \
    --storage-size 20 \
    --subnet $MY_MYSQL_SN_NAME \
    --private-dns-zone $MY_DNS_LABEL.private.mysql.database.azure.com \
    --tier Burstable \
    --version 8.0.21 \
    --vnet $MY_VNET_NAME \
    --yes -o JSON
```

Results:
<!-- expected_similarity=0.3 -->
```json
{
  "databaseName": "wordpress",
  "host": "mydbxxx.mysql.database.azure.com",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myWordPressAKSResourceGroupXXX/providers/Microsoft.DBforMySQL/flexibleServers/mydbXXX",
  "location": "East US",
  "resourceGroup": "myWordPressAKSResourceGroupXXX",
  "skuname": "Standard_B2s",
  "subnetId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myWordPressAKSResourceGroupXXX/providers/Microsoft.Network/virtualNetworks/myVNetXXX/subnets/myMySQLSNXXX",
  "username": "dbadminxxx",
  "version": "8.0.21"
}
```

The server created has the following attributes:

- A new empty database is created when the server is first provisioned.
- The server name, admin username, admin password, resource group name, and location are already specified in the local context environment of the cloud shell and are in the same location as your resource group and other Azure components.
- The service defaults for the remaining server configurations are compute tier (Burstable), compute size/SKU (Standard_B2s), backup retention period (seven days), and MySQL version (8.0.21).
- The default connectivity method is Private access (virtual network integration) with a linked virtual network and an auto generated subnet.

> [!NOTE]
> The connectivity method cannot be changed after creating the server. For example, if you selected `Private access (VNet Integration)` during creation, then you cannot change to `Public access (allowed IP addresses)` after creation. We highly recommend creating a server with Private access to securely access your server using VNet Integration. Learn more about Private access in the [concepts article](./concepts-networking-vnet.md).

If you'd like to change any defaults, refer to the Azure CLI [reference documentation](/cli/azure//mysql/flexible-server) for the complete list of configurable CLI parameters.

## Check the Azure Database for MySQL - Flexible Server status

It takes a few minutes to create the Azure Database for MySQL - Flexible Server and supporting resources.

```bash
runtime="10 minute"; endtime=$(date -ud "$runtime" +%s); while [[ $(date -u +%s) -le $endtime ]]; do STATUS=$(az mysql flexible-server show -g $MY_RESOURCE_GROUP_NAME -n $MY_MYSQL_DB_NAME --query state -o tsv); echo $STATUS; if [ "$STATUS" = 'Ready' ]; then break; else sleep 10; fi; done
```

## Configure server parameters in Azure Database for MySQL - Flexible Server

You can manage Azure Database for MySQL - Flexible Server configuration using server parameters. The server parameters are configured with the default and recommended value when you create the server.

To show details about a particular parameter for a server, run the [az mysql flexible-server parameter show](/cli/azure/mysql/flexible-server/parameter) command.

### Disable Azure Database for MySQL - Flexible Server SSL connection parameter for WordPress integration

You can also modify the value of certain server parameters to update the underlying configuration values for the MySQL server engine. To update the server parameter, use the [az mysql flexible-server parameter set](/cli/azure/mysql/flexible-server/parameter#az-mysql-flexible-server-parameter-set) command.

```bash
az mysql flexible-server parameter set \
    -g $MY_RESOURCE_GROUP_NAME \
    -s $MY_MYSQL_DB_NAME \
    -n require_secure_transport -v "OFF" -o JSON
```

Results:
<!-- expected_similarity=0.3 -->
```json
{
  "allowedValues": "ON,OFF",
  "currentValue": "OFF",
  "dataType": "Enumeration",
  "defaultValue": "ON",
  "id": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myWordPressAKSResourceGroupXXX/providers/Microsoft.DBforMySQL/flexibleServers/mydbXXX/configurations/require_secure_transport",
  "isConfigPendingRestart": "False",
  "isDynamicConfig": "True",
  "isReadOnly": "False",
  "name": "require_secure_transport",
  "resourceGroup": "myWordPressAKSResourceGroupXXX",
  "source": "user-override",
  "systemData": null,
  "type": "Microsoft.DBforMySQL/flexibleServers/configurations",
  "value": "OFF"
}
```

## Create AKS cluster

To create an AKS cluster with Container Insights, use the [az aks create](/cli/azure/aks#az-aks-create) command with the **--enable-addons** monitoring parameter. The following example creates an autoscaling, availability zone-enabled cluster named **myAKSCluster**:

This action takes a few minutes.

```bash
export MY_SN_ID=$(az network vnet subnet list --resource-group $MY_RESOURCE_GROUP_NAME --vnet-name $MY_VNET_NAME --query "[0].id" --output tsv)

az aks create \
    --resource-group $MY_RESOURCE_GROUP_NAME \
    --name $MY_AKS_CLUSTER_NAME \
    --auto-upgrade-channel stable \
    --enable-cluster-autoscaler \
    --enable-addons monitoring \
    --location $REGION \
    --node-count 1 \
    --min-count 1 \
    --max-count 3 \
    --network-plugin azure \
    --network-policy azure \
    --vnet-subnet-id $MY_SN_ID \
    --no-ssh-key \
    --node-vm-size Standard_DS2_v2 \
    --service-cidr 10.255.0.0/24 \
    --dns-service-ip 10.255.0.10 \
    --zones 1 2 3
```
> [!NOTE]
> When creating an AKS cluster, a second resource group is automatically created to store the AKS resources. See [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks)

## Connect to the cluster

To manage a Kubernetes cluster, use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. The following example installs `kubectl` locally using the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command. 

 ```bash
    if ! [ -x "$(command -v kubectl)" ]; then az aks install-cli; fi
```

Next, configure `kubectl` to connect to your Kubernetes cluster using the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them. The command uses `~/.kube/config`, the default location for the [Kubernetes configuration file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). You can specify a different location for your Kubernetes configuration file using the **--file** argument.

> [!WARNING]
> This command will overwrite any existing credentials with the same entry.

```bash
az aks get-credentials --resource-group $MY_RESOURCE_GROUP_NAME --name $MY_AKS_CLUSTER_NAME --overwrite-existing
```

To verify the connection to your cluster, use the [kubectl get]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

```bash
kubectl get nodes
```

## Install NGINX ingress controller

You can configure your ingress controller with a static public IP address. The static public IP address remains if you delete your ingress controller. The IP address doesn't remain if you delete your AKS cluster.
When you upgrade your ingress controller, you must pass a parameter to the Helm release to ensure the ingress controller service is made aware of the load balancer that will be allocated to it. For the HTTPS certificates to work correctly, use a DNS label to configure a fully qualified domain name (FQDN) for the ingress controller IP address. Your FQDN should follow this form: $MY_DNS_LABEL.AZURE_REGION_NAME.cloudapp.azure.com.

```bash
export MY_STATIC_IP=$(az network public-ip create --resource-group MC_${MY_RESOURCE_GROUP_NAME}_${MY_AKS_CLUSTER_NAME}_${REGION} --location ${REGION} --name ${MY_PUBLIC_IP_NAME} --dns-name ${MY_DNS_LABEL} --sku Standard --allocation-method static --version IPv4 --zone 1 2 3 --query publicIp.ipAddress -o tsv)
```

Next, you add the ingress-nginx Helm repository, update the local Helm Chart repository cache, and install ingress-nginx addon via Helm. You can set the DNS label with the **--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"="<DNS_LABEL>"** parameter either when you first deploy the ingress controller or later. In this example, you specify your own public IP address that you created in the previous step with the **--set controller.service.loadBalancerIP="<STATIC_IP>" parameter**.

```bash
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm upgrade --install --cleanup-on-fail --atomic ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-dns-label-name"=$MY_DNS_LABEL \
        --set controller.service.loadBalancerIP=$MY_STATIC_IP \
        --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
        --wait --timeout 10m0s
```

## Add HTTPS termination to custom domain

At this point in the tutorial, you have an AKS web app with NGINX as the ingress controller and a custom domain you can use to access your application. The next step is to add an SSL certificate to the domain so that users can reach your application securely via https.

### Set Up Cert Manager

To add HTTPS, we're going to use Cert Manager. Cert Manager is an open source tool for obtaining and managing SSL certificates for Kubernetes deployments. Cert Manager obtains certificates from popular public issuers and private issuers, ensures the certificates are valid and up-to-date, and attempts to renew certificates at a configured time before they expire.

1. In order to install cert-manager, we must first create a namespace to run it in. This tutorial installs cert-manager into the cert-manager namespace. You can run cert-manager in a different namespace, but you must make modifications to the deployment manifests.

    ```bash
    kubectl create namespace cert-manager
    ```

2. We can now install cert-manager. All resources are included in a single YAML manifest file. Install the manifest file with the following command:

    ```bash
    kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.0/cert-manager.crds.yaml
    ```

3. Add the `certmanager.k8s.io/disable-validation: "true"` label to the cert-manager namespace by running the following. This allows the system resources that cert-manager requires to bootstrap TLS to be created in its own namespace.

    ```bash
    kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true
    ```

## Obtain certificate via Helm Charts

Helm is a Kubernetes deployment tool for automating the creation, packaging, configuration, and deployment of applications and services to Kubernetes clusters.

Cert-manager provides Helm charts as a first-class method of installation on Kubernetes.

1. Add the Jetstack Helm repository. This repository is the only supported source of cert-manager charts. There are other mirrors and copies across the internet, but those are unofficial and could present a security risk.

    ```bash
    helm repo add jetstack https://charts.jetstack.io
    ```

2. Update local Helm Chart repository cache.

    ```bash
    helm repo update
    ```

3. Install Cert-Manager addon via Helm.

    ```bash
    helm upgrade --install --cleanup-on-fail --atomic \
        --namespace cert-manager \
        --version v1.7.0 \
        --wait --timeout 10m0s \
        cert-manager jetstack/cert-manager
    ```

4. Apply the certificate issuer YAML file. ClusterIssuers are Kubernetes resources that represent certificate authorities (CAs) that can generate signed certificates by honoring certificate signing requests. All cert-manager certificates require a referenced issuer that is in a ready condition to attempt to honor the request. You can find the issuer we're in the `cluster-issuer-prod.yml file`.

    ```bash
    cluster_issuer_variables=$(<cluster-issuer-prod.yaml)
    echo "${cluster_issuer_variables//\$SSL_EMAIL_ADDRESS/$SSL_EMAIL_ADDRESS}" | kubectl apply -f -
    ```

## Create a custom storage class

The default storage classes suit the most common scenarios, but not all. For some cases, you might want to have your own storage class customized with your own parameters. For example, use the following manifest to configure the **mountOptions** of the file share.
The default value for **fileMode** and **dirMode** is **0755** for Kubernetes mounted file shares. You can specify the different mount options on the storage class object.

```bash
kubectl apply -f wp-azurefiles-sc.yaml
```

## Deploy WordPress to AKS cluster

For this tutorial, we're using an existing Helm chart for WordPress built by Bitnami. The Bitnami Helm chart uses a local MariaDB as the database, so we need to override these values to use the app with Azure Database for MySQL. You can override the values and the custom settings the `helm-wp-aks-values.yaml` file.

1. Add the Wordpress Bitnami Helm repository.

    ```bash
    helm repo add bitnami https://charts.bitnami.com/bitnami
    ```

2. Update local Helm chart repository cache.

    ```bash
    helm repo update
    ```

3. Install Wordpress workload via Helm.

    ```bash
    helm upgrade --install --cleanup-on-fail \
        --wait --timeout 10m0s \
        --namespace wordpress \
        --create-namespace \
        --set wordpressUsername="$MY_WP_ADMIN_USER" \
        --set wordpressPassword="$MY_WP_ADMIN_PW" \
        --set wordpressEmail="$SSL_EMAIL_ADDRESS" \
        --set externalDatabase.host="$MY_MYSQL_HOSTNAME" \
        --set externalDatabase.user="$MY_MYSQL_ADMIN_USERNAME" \
        --set externalDatabase.password="$MY_MYSQL_ADMIN_PW" \
        --set ingress.hostname="$FQDN" \
        --values helm-wp-aks-values.yaml \
        wordpress bitnami/wordpress
    ```

Results:
<!-- expected_similarity=0.3 -->
```text
Release "wordpress" does not exist. Installing it now.
NAME: wordpress
LAST DEPLOYED: Tue Oct 24 16:19:35 2023
NAMESPACE: wordpress
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
CHART NAME: wordpress
CHART VERSION: 18.0.8
APP VERSION: 6.3.2

** Please be patient while the chart is being deployed **

Your WordPress site can be accessed through the following DNS name from within your cluster:

    wordpress.wordpress.svc.cluster.local (port 80)

To access your WordPress site from outside the cluster follow the steps below:

1. Get the WordPress URL and associate WordPress hostname to your cluster external IP:

   export CLUSTER_IP=$(minikube ip) # On Minikube. Use: `kubectl cluster-info` on others K8s clusters
   echo "WordPress URL: https://mydnslabelxxx.eastus.cloudapp.azure.com/"
   echo "$CLUSTER_IP  mydnslabelxxx.eastus.cloudapp.azure.com" | sudo tee -a /etc/hosts
    export CLUSTER_IP=$(minikube ip) # On Minikube. Use: `kubectl cluster-info` on others K8s clusters
    echo "WordPress URL: https://mydnslabelxxx.eastus.cloudapp.azure.com/"
    echo "$CLUSTER_IP  mydnslabelxxx.eastus.cloudapp.azure.com" | sudo tee -a /etc/hosts

2. Open a browser and access WordPress using the obtained URL.

3. Login with the following credentials below to see your blog:

    echo Username: wpcliadmin
    echo Password: $(kubectl get secret --namespace wordpress wordpress -o jsonpath="{.data.wordpress-password}" | base64 -d)
```

## Browse your AKS deployment secured via HTTPS

Run the following command to get the HTTPS endpoint for your application:

> [!NOTE]
> It often takes 2-3 minutes for the SSL certificate to propagate and about 5 minutes to have all WordPress POD replicas ready and the site to be fully reachable via https.

```bash
runtime="5 minute"
endtime=$(date -ud "$runtime" +%s)
while [[ $(date -u +%s) -le $endtime ]]; do
    export DEPLOYMENT_REPLICAS=$(kubectl -n wordpress get deployment wordpress -o=jsonpath='{.status.availableReplicas}');
    echo Current number of replicas "$DEPLOYMENT_REPLICAS/3";
    if [ "$DEPLOYMENT_REPLICAS" = "3" ]; then
        break;
    else
        sleep 10;
    fi;
done
```

Check that WordPress content is delivered correctly using the following command:

```bash
if curl -I -s -f https://$FQDN > /dev/null ; then 
    curl -L -s -f https://$FQDN 2> /dev/null | head -n 9
else 
    exit 1
fi;
```

Results:
<!-- expected_similarity=0.3 -->
```HTML
{
<!DOCTYPE html>
<html lang="en-US">
<head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name='robots' content='max-image-preview:large' />
<title>WordPress on AKS</title>
<link rel="alternate" type="application/rss+xml" title="WordPress on AKS &raquo; Feed" href="https://mydnslabelxxx.eastus.cloudapp.azure.com/feed/" />
<link rel="alternate" type="application/rss+xml" title="WordPress on AKS &raquo; Comments Feed" href="https://mydnslabelxxx.eastus.cloudapp.azure.com/comments/feed/" />
}
```

Visit the website through the following URL:

```bash
echo "You can now visit your web server at https://$FQDN"
```

## Clean up the resources (optional)

To avoid Azure charges, you should clean up unneeded resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, and all related resources. 

> [!NOTE]
> When you delete the cluster, the Microsoft Entra service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion](../../aks/kubernetes-service-principal.md#other-considerations). If you used a managed identity, the identity is managed by the platform and does not require removal.

## Next steps

- Learn how to [access the Kubernetes web dashboard](../../aks/kubernetes-dashboard.md) for your AKS cluster
- Learn how to [scale your cluster](../../aks/tutorial-kubernetes-scale.md)
- Learn how to manage your [Azure Database for MySQL flexible server instance](./quickstart-create-server-cli.md)
- Learn how to [configure server parameters](./how-to-configure-server-parameters-cli.md) for your database server
