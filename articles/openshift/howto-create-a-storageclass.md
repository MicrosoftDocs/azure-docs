---
title: Create an Azure Files StorageClass on Azure Red Hat OpenShift 4
description: Learn how to create an Azure Files StorageClass on Azure Red Hat OpenShift
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 08/28/2023
author: johnmarco
ms.author: johnmarc
keywords: aro, openshift, az aro, red hat, cli, azure file
ms.custom: mvc, devx-track-azurecli
#Customer intent: As an operator, I need to create a StorageClass on Azure Red Hat OpenShift using Azure File dynamic provisioner
---

# Create an Azure Files StorageClass on Azure Red Hat OpenShift 4

In this article, you’ll create a StorageClass for Azure Red Hat OpenShift 4 that dynamically provisions ReadWriteMany (RWX) storage using Azure Files. You’ll learn how to:

> [!div class="checklist"]
> * Setup the prerequisites and install the necessary tools
> * Create an Azure Red Hat OpenShift 4 StorageClass with the Azure File provisioner

If you choose to install and use the CLI locally, this tutorial requires that you're running the Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Before you begin

Deploy an Azure Red Hat OpenShift 4 cluster into your subscription, see [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md)


### Set up Azure storage account

This step creates a resource group outside of the Azure Red Hat OpenShift (ARO) cluster’s resource group. This resource group contains the Azure Files shares that created Azure Red Hat OpenShift’s dynamic provisioner.

```azurecli
AZURE_FILES_RESOURCE_GROUP=aro_azure_files
LOCATION=eastus

az group create -l $LOCATION -n $AZURE_FILES_RESOURCE_GROUP

AZURE_STORAGE_ACCOUNT_NAME=aroazurefilessa

az storage account create \
	--name $AZURE_STORAGE_ACCOUNT_NAME \
	--resource-group $AZURE_FILES_RESOURCE_GROUP \
	--kind StorageV2 \
	--sku Standard_LRS
```

## Set permissions
### Set resource group permissions

The ARO service principal requires 'listKeys' permission on the new Azure storage account resource group. Assign the ‘Contributor’ role to achieve this.

```azurecli
ARO_RESOURCE_GROUP=aro-rg
CLUSTER=cluster
ARO_SERVICE_PRINCIPAL_ID=$(az aro show -g $ARO_RESOURCE_GROUP -n $CLUSTER --query servicePrincipalProfile.clientId -o tsv)

az role assignment create --role Contributor --scope /subscriptions/mySubscriptionID/resourceGroups/myResourceGroupName --assignee $ARO_SERVICE_PRINCIPAL_ID -g $AZURE_FILES_RESOURCE_GROUP
```

### Set ARO cluster permissions

The OpenShift persistent volume binder service account requires the ability to read secrets. Create and assign an OpenShift cluster role to achieve this.
```azurecli
ARO_API_SERVER=$(az aro list --query "[?contains(name,'$CLUSTER')].[apiserverProfile.url]" -o tsv)

oc login -u kubeadmin -p $(az aro list-credentials -g $ARO_RESOURCE_GROUP -n $CLUSTER --query=kubeadminPassword -o tsv) $ARO_API_SERVER

oc create clusterrole azure-secret-reader \
	--verb=create,get \
	--resource=secrets

oc adm policy add-cluster-role-to-user azure-secret-reader system:serviceaccount:kube-system:persistent-volume-binder
```

## Create StorageClass with Azure Files provisioner

This step creates a StorageClass with an Azure Files provisioner. Within the StorageClass manifest, the details of the storage account are required so that the ARO cluster knows to look at a storage account outside of the current resource group.

During storage provisioning, a secret named by secretName is created for the mounting credentials. In a multi-tenancy context, it's strongly recommended to set the value for secretNamespace explicitly, otherwise the storage account credentials may be read by other users.

```bash
cat << EOF >> azure-storageclass-azure-file.yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azure-file
provisioner: file.csi.azure.com
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict
  - actimeo=30
  - noperm
parameters:
  location: $LOCATION
  secretNamespace: kube-system
  skuName: Standard_LRS
  storageAccount: $AZURE_STORAGE_ACCOUNT_NAME
  resourceGroup: $AZURE_FILES_RESOURCE_GROUP
reclaimPolicy: Delete
volumeBindingMode: Immediate
EOF

oc create -f azure-storageclass-azure-file.yaml
```

Mount options for Azure Files will generally be dependent on the workload that you're deploying and the requirements of the application. Specifically for Azure files, there are other parameters that you should consider using.

Mandatory parameters: 
- "mfsymlinks" to map symlinks to a form the client can use
- "noperm" to disable permission checks on the client side

Recommended parameters: 
- "nossharesock" to disable reusing sockets if the client is already connected via an existing mount point
- "actimeo=30" (or higher) to increase the time the CIFS client caches file and directory attributes
- "nobrl" to disable sending byte range lock requests to the server and for applications which have challenges with posix locks

## Change the default StorageClass (optional)

The default StorageClass on ARO is called managed-premium and uses the azure-disk provisioner. Change this by issuing patch commands against the StorageClass manifests.

```bash
oc patch storageclass managed-premium -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'

oc patch storageclass azure-file -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

## Verify Azure File StorageClass (optional)

Create a new application and assign storage to it.

> [!NOTE]
> To use the `httpd-example` template, you must deploy your ARO cluster with the pull secret enabled. For more information, see [Get a Red Hat pull secret](tutorial-create-cluster.md#get-a-red-hat-pull-secret-optional).

```bash
oc new-project azfiletest
oc new-app httpd-example

#Wait for the pod to become Ready
curl $(oc get route httpd-example -n azfiletest -o jsonpath={.spec.host})

#If you have set the storage class by default, you can omit the --claim-class parameter
oc set volume dc/httpd-example --add --name=v1 -t pvc --claim-size=1G -m /data --claim-class='azure-file'

#Wait for the new deployment to rollout
export POD=$(oc get pods --field-selector=status.phase==Running -o jsonpath={.items[].metadata.name})
oc exec $POD -- bash -c "echo 'azure file storage' >> /data/test.txt"

oc exec $POD -- bash -c "cat /data/test.txt"
azure file storage
```
The test.txt file will also be visible via the Storage Explorer in the Azure portal.

## Next steps

In this article, you created dynamic persistent storage using Microsoft Azure Files and Azure Red Hat OpenShift 4. You learned how to:

> [!div class="checklist"]
> * Create a Storage Account
> * Configure a StorageClass on an Azure Red Hat OpenShift 4 cluster using the Azure Files provisioner

Advance to the next article to learn about Azure Red Hat OpenShift 4 supported resources.

* [Azure Red Hat OpenShift support policy](support-policies-v4.md)
