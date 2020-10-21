---
title: Create an Azure Files StorageClass on Azure Red Hat OpenShift 4
description: Learn how to create an Azure Files StorageClass on Azure Red Hat OpenShift
ms.service: container-service
ms.topic: article
ms.date: 10/16/2020
author: grantomation
ms.author: b-grodel
keywords: aro, openshift, az aro, red hat, cli, azure file
ms.custom: mvc
#Customer intent: As an operator, I need to create a StorageClass on Azure Red Hat OpenShift using Azure File dynamic provisioner
---

# Create an Azure Files StorageClass on Azure Red Hat OpenShift 4

In this article, you’ll create a StorageClass for Azure Red Hat OpenShift 4 that dynamically provisions ReadWriteMany (RWX) storage using Azure Files. You’ll learn how to:

> [!div class="checklist"]
> * Setup the prerequisites and install the necessary tools
> * Create an Azure Red Hat OpenShift 4 StorageClass with the Azure File provisioner

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.6.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/articles/openshift/).

## Before you begin

Deploy an Azure Red Hat OpenShift 4 cluster into your subscription, see [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md)


### Set up Azure storage account

This step will create a resource group outside of the ARO cluster’s resource group. This resource group will contain the Azure Files shares that are created by ARO’s dynamic provisioner.

```bash
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

## Set Permissions
### Set Resource Group Permissions

The ARO service principal requires 'listKeys' permission on the new Azure storage account resource group. Assign the ‘Contributor’ role to achieve this. 

```bash
ARO_RESOURCE_GROUP=aro-rg
CLUSTER=cluster
ARO_SERVICE_PRINCIPAL_ID=$(az aro show -g $ARO_RESOURCE_GROUP -n $CLUSTER –-query servicePrincipalProfile.clientId -o tsv)

az role assignment create –-role Contributor -–assignee $ARO_SERVICE_PRINCIPAL_ID -g $AZURE_FILES_RESOURCE_GROUP
```

### Set ARO cluster permissions

The OpenShift persistent volume binder service account will require the ability to read secrets. Create and assign an OpenShift clusterrole to achieve this.
```bash
ARO_API_SERVER=$(az aro list --query "[?contains(name,'$CLUSTER')].[apiserverProfile.url]" -o tsv)

oc login -u kubeadmin -p $(az aro list-credentials -g $ARO_RESOURCE_GROUP -n $CLUSTER --query=kubeadminPassword -o tsv) $APISERVER

oc create clusterrole azure-secret-reader \
	--verb=create,get \
	--resource=secrets

oc adm policy add-cluster-role-to-user azure-secret-reader system:serviceaccount:kube-system:persistent-volume-binder
```

## Create StorageClass with Azure Files Provisioner

This step will create a StorageClass with an Azure Files provisioner. Within the StorageClass manifest, the details of the storage account are required so that the ARO cluster knows to look at a storage account outside of the current resource group.

```bash
cat << EOF >> azure-storageclass-azure-file.yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azure-file
provisioner: kubernetes.io/azure-file
parameters:
  location: $LOCATION
  skuName: Standard_LRS 
  storageAccount: $AZURE_STORAGE_ACCOUNT_NAME
  resourceGroup: $AZURE_FILES_RESOURCE_GROUP
reclaimPolicy: Delete
volumeBindingMode: Immediate
EOF

oc create -f azure-storageclass-azure-file.yaml
```

## Change the default StorageClass (optional)

The default StorageClass on ARO is called managed-premium and uses the azure-disk provisioner. Change this by issuing patch commands against the StorageClass manifests.

```bash
oc patch storageclass managed-premium -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'

oc patch storageclass azure-file -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

## Verify Azure File StorageClass (optional)

Create a new application and assign storage to it.

```bash
oc new-project azfiletest
oc new-app –template httpd-example

#Wait for the pod to become Ready
curl $(oc get route httpd-example -n azfiletest -o jsonpath={.spec.host})

oc set volume dc/httpd-example --add --name=v1 -t pvc --claim-size=1G -m /data

#Wait for the new deployment to rollout
export POD=$(oc get pods --field-selector=status.phase==Running -o jsonpath={.items[].metadata.name})
oc exec $POD -- bash -c "mkdir ./data"
oc exec $POD -- bash -c "echo 'azure file storage' >> /data/test.txt"

oc exec $POD -- bash -c "cat /data/test.txt"
azure file storage
```
The test.txt file will also be visible via the Storage Explorer in the Azure Portal. 

## Next steps

In this article, you created dynamic persistent storage using Microsoft Azure Files and Azure Red Hat OpenShift 4. You learned how to:

> [!div class="checklist"]
> * Create a Storage Account
> * Configure a StorageClass on an Azure Red Hat OpenShift 4 cluster using the Azure Files provisioner

Advance to the next article to learn about Azure Red Hat OpenShift 4 supported resources.

* [Azure Red Hat OpenShift support policy](support-policies-v4.md)
