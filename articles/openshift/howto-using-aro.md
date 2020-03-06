---
title: Create an Azure Red Hat OpenShift 4.3 Cluster | Microsoft Docs
description: Create a cluster with Azure Red Hat OpenShift 3.11
author: lamek
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 03/06/2020
keywords: aro, openshift, az aro, red hat, cli
#Customer intent: As a customer, I want to create an ARO custer using the command line.
---

# Create an Azure Red Hat OpenShift 4.3 Cluster

> [!IMPORTANT]
> Azure Red Hat OpenShift (ARO) 4.3 is offered in preview. Preview features are self-service and are provided as is and as available and are excluded from the service-level agreement (SLA) and limited warranty. Therefore, the features aren't meant for production use.

## Prerequisites

You'll need the following to create an Azure Red Hat OpenShift 4.3 cluster:

- Azure CLI version 2.0.72 or greater
  
- The 'az aro' extension

- A virtual network containing two empty subnets, each with no network security group attached.  Your cluster will be deployed into these subnets.

- A cluster AAD application (client ID and secret) and service principal, or sufficient AAD permissions for `az aro create` to create an AAD application and service principal for you automatically.

- The RP service principal and cluster service principal must each have the Contributor role on the cluster virtual network.  If you have the "User Access Administrator" role on the virtual network, `az aro create` will set up the role assignments for you automatically.

## Installing the 'az aro' extension
The `az aro` extension allows you to create, access, and delete Azure Red Hat OpenShift (ARO) clusters directly from the command line using the Azure CLI. The `az aro` extension can be used with a subscription  registered with the preview Azure Red Hat OpenShift 4.3 service.

1. Log in to Azure.

```bash
az login
```

2. Run the following command to install the `az aro` extension.

```bash
az extension add --source https://arosvc.blob.core.windows.net/az-preview/aro-0.1.0-py2.py3-none-any.whl
```

3. Add the ARO extension path to your `az` configuration.

```bash
cat >>~/.azure/config <<EOF
[extension]
dev_sources = $PWD/python
EOF
```

4. Verify the ARO extension is registered.

```console
az -v

Extensions:
aro                                0.1.0 (dev) /path/to/rp/python/az/aro
Development extension sources:
    /path/to/rp/python
```

5. To opt into the preview of Azure Red Hat OpenShift v4, register the
`Microsoft.RedHatOpenShift` resource provider.

```console
az provider register -n Microsoft.RedHatOpenShift --wait
```
 
## Create a cluster

With your extension installed, run the following command to create a cluster.

```console
az aro create \
  -g "$RESOURCEGROUP" \
  -n "$CLUSTER" \
  --vnet dev-vnet \
  --master-subnet "$CLUSTER-master" \
  --worker-subnet "$CLUSTER-worker"
```

>[!NOTE]
> It normally takes about 35 minutes to create a cluster.

## Access the cluster console

You can find the cluster console URL (of the form `https://console-openshift-console.apps.<random>.<location>.aroapp.io/`) under the Azure Red Hat OpenShift 4.3 cluster resource. Run the following command to view the resource:

```console
az aro list -o table
```

You can log into the cluster using the `kubeadmin` user.  Run the following command to find the password for the `kubeadmin` user:

``` console
az aro list-credentials -g "$RESOURCEGROUP" -n "$CLUSTER"
```

## Delete a cluster

Run the following command to delete a cluster.

```console
az aro delete -g "$RESOURCEGROUP" -n "$CLUSTER"

# (optional)
for subnet in "$CLUSTER-master" "$CLUSTER-worker"; do
  az network vnet subnet delete -g "$RESOURCEGROUP" --vnet-name dev-vnet -n "$subnet"
done
```
