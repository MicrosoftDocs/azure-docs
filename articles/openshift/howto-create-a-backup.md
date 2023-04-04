---
title: Create an Azure Red Hat OpenShift 4 cluster application backup using Velero
description: Learn how to create a backup of your Azure Red Hat OpenShift cluster applications using Velero
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 06/22/2020
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, az aro, red hat, cli
ms.custom: mvc, devx-track-azurecli
#Customer intent: As an operator, I need to create an Azure Red Hat OpenShift cluster application backup
---

# Create an Azure Red Hat OpenShift 4 cluster Application Backup

In this article, you'll prepare your environment to create an Azure Red Hat OpenShift 4 cluster application backup. You'll learn how to:

> [!div class="checklist"]
> * Setup the prerequisites and install the necessary tools
> * Create an Azure Red Hat OpenShift 4 application backup

If you choose to install and use the CLI locally, this tutorial requires that you're running the Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

### Install Velero

To [install](https://velero.io/docs/main/basic-install/) Velero on your system, follow the recommended process for your operating system.

### Set up Azure storage account and Blob container

This step will create a resource group outside of the ARO cluster's resource group.  This resource group will allow the backups to persist and can restore applications to new clusters.

```azurecli
AZURE_BACKUP_RESOURCE_GROUP=Velero_Backups
az group create -n $AZURE_BACKUP_RESOURCE_GROUP --location eastus

AZURE_STORAGE_ACCOUNT_ID="velero$(uuidgen | cut -d '-' -f5 | tr '[A-Z]' '[a-z]')"
az storage account create \
    --name $AZURE_STORAGE_ACCOUNT_ID \
    --resource-group $AZURE_BACKUP_RESOURCE_GROUP \
    --sku Standard_GRS \
    --encryption-services blob \
    --https-only true \
    --kind BlobStorage \
    --access-tier Hot

BLOB_CONTAINER=velero
az storage container create -n $BLOB_CONTAINER --public-access off --account-name $AZURE_STORAGE_ACCOUNT_ID
```

## Set permissions for Velero

### Create service principal

Velero needs permissions to do backups and restores. When you create a service principal, you're giving Velero permission to access the resource group you define in the previous step. This step will get the cluster's resource group:

```bash
export AZURE_RESOURCE_GROUP=$(az aro show --name <name of cluster> --resource-group <name of resource group> | jq -r .clusterProfile.resourceGroupId | cut -d '/' -f 5,5)
```


```azurecli
AZURE_SUBSCRIPTION_ID=$(az account list --query '[?isDefault].id' -o tsv)

AZURE_TENANT_ID=$(az account list --query '[?isDefault].tenantId' -o tsv)
```

```azurecli
AZURE_CLIENT_SECRET=$(az ad sp create-for-rbac --name "velero" --role "Contributor" --query 'password' -o tsv \
--scopes  /subscriptions/$AZURE_SUBSCRIPTION_ID)
AZURE_CLIENT_ID=$(az ad sp list --display-name "velero" --query '[0].appId' -o tsv)

```

```bash
cat << EOF  > ./credentials-velero.yaml
AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}
AZURE_TENANT_ID=${AZURE_TENANT_ID}
AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
AZURE_RESOURCE_GROUP=${AZURE_RESOURCE_GROUP}
AZURE_CLOUD_NAME=AzurePublicCloud
EOF
```

## Install Velero on Azure Red Hat OpenShift 4 cluster

This step will install Velero into its own project and the [custom resource definitions](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) necessary to do backups and restores with Velero. Make sure you're successfully logged in to an Azure Red Hat OpenShift v4 cluster.


```bash
velero install \
--provider azure \
--plugins velero/velero-plugin-for-microsoft-azure:v1.1.0 \
--bucket $BLOB_CONTAINER \
--secret-file ~/path/to/credentials-velero.yaml \
--backup-location-config resourceGroup=$AZURE_BACKUP_RESOURCE_GROUP,storageAccount=$AZURE_STORAGE_ACCOUNT_ID \
--snapshot-location-config apiTimeout=15m \
--velero-pod-cpu-limit="0" --velero-pod-mem-limit="0" \
--velero-pod-mem-request="0" --velero-pod-cpu-request="0"
```

## Create a backup with Velero

To create an application backup with Velero, you'll need to include the namespace that this application is in.  If you have a `nginx-example` namespace and want to include all the resources in that namespace in the backup, run the following command in the terminal:

```bash
velero create backup <name of backup> --include-namespaces=nginx-example
```
You can check the status of the backup by running:

```bash
oc get backups -n velero <name of backup> -o yaml
```

A successful backup will output `phase:Completed` and the objects will live in the container in the storage account.

## Create a backup with Velero to include snapshots

To create an application backup with Velero to include the persistent volumes of your application, you'll need to include the namespace that the application is in and include the `snapshot-volumes=true` flag when creating the backup.

```bash
velero backup create <name of backup> --include-namespaces=nginx-example --snapshot-volumes=true --include-cluster-resources=true
```

You can check the status of the backup by running:

```bash
oc get backups -n velero <name of backup> -o yaml
```

A successful backup with output `phase:Completed` and the objects will live in the container in the storage account.

For more information, see [Backup OpenShift resources the native way](https://www.openshift.com/blog/backup-openshift-resources-the-native-way)

## Next steps

In this article, an Azure Red Hat OpenShift 4 cluster application was backed up. You learned how to:

> [!div class="checklist"]
> * Create a OpenShift v4 cluster application backup using Velero
> * Create a OpenShift v4 cluster application backup with snapshots using Velero


Advance to the next article to learn how to create an Azure Red Hat OpenShift 4 cluster application restore.

* [Create a Azure Red Hat OpenShift 4 cluster application restore](howto-create-a-restore.md)
* [Create a Azure Red Hat OpenShift 4 cluster application restore including snapshots](howto-create-a-restore.md)
