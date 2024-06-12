---
title: Connect to an Azure Red Hat OpenShift 4 cluster
description: Learn how to connect a Microsoft Azure Red Hat OpenShift cluster
author: johnmarco
ms.author: johnmarc
ms.topic: article
ms.service: azure-redhat-openshift
ms.date: 06/12/2024
#Customer intent: As a developer, I want learn how to create an Azure Red Hat OpenShift cluster, scale it, and then clean up resources so that I am not charged for what I'm not using.
---

# Connect to an Azure Red Hat OpenShift 4 cluster

This article shows you how to connect to an Azure Red Hat OpenShift cluster running OpenShift 4 as the kubeadmin user through the OpenShift web console.

## Before you begin

This article requires Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Connect to the cluster

You can log into the cluster using the `kubeadmin` user. Run the following command to find the password for the `kubeadmin` user.

```azurecli-interactive
az aro list-credentials \
  --name $CLUSTER \
  --resource-group $RESOURCEGROUP
```

The following example output shows the password in `kubeadminPassword`.

```json
{
  "kubeadminPassword": "<generated password>",
  "kubeadminUsername": "kubeadmin"
}
```

You can find the cluster console URL by running the following command, which will look like `https://console-openshift-console.apps.<random>.<region>.aroapp.io/`.

```azurecli-interactive
 az aro show \
    --name $CLUSTER \
    --resource-group $RESOURCEGROUP \
    --query "consoleProfile.url" -o tsv
```

Launch the console URL in a browser and login using the `kubeadmin` credentials.

![Azure Red Hat OpenShift login screen](media/aro4-login.png)

## Install the OpenShift CLI

Once you're logged into the OpenShift Web Console, select the **?** at the top right and then on **Command Line Tools**. Download the release appropriate to your machine.

![Screenshot that highlights the Command Line Tools option in the list when you select the ? icon.](media/aro4-download-cli.png)

You can also download the [latest release of the CLI](https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/) appropriate to your machine.

If you're running the commands on the Azure Cloud Shell, download the latest OpenShift 4 CLI for Linux.

```azurecli-interactive
cd ~
wget https://mirror.openshift.com/pub/openshift-v4/clients/ocp/latest/openshift-client-linux.tar.gz

mkdir openshift
tar -zxvf openshift-client-linux.tar.gz -C openshift
echo 'export PATH=$PATH:~/openshift' >> ~/.bashrc && source ~/.bashrc
```

## Connect using the OpenShift CLI

Retrieve the API server's address.

```azurecli-interactive
apiServer=$(az aro show -g $RESOURCEGROUP -n $CLUSTER --query apiserverProfile.url -o tsv)
```

Login to the OpenShift cluster's API server using the following command. Replace **\<kubeadmin password>** with the password you retrieved.

```azurecli-interactive
oc login $apiServer -u kubeadmin -p <kubeadmin password>
```

## Next steps

Learn how to [delete an Azure Red Hat OpenShift cluster](delete-cluster.md).