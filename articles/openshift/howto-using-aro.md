---
title: using `az aro` | Microsoft Docs
description: Create a private cluster with Azure Red Hat OpenShift 3.11
author: klamenzo 
ms.author: b-lejaku
ms.service: container-service
ms.topic: conceptual
ms.date: 03/02/2020
keywords: aro, openshift, az aro, red hat, cli
#Customer intent: As a customer, I want to create an ARO custer using the command line.
---

# Using `az aro`

The `az aro` extension allows you to create, access, and delete Azure Red Hat OpenShift clusters directly from the command line using the Azure CLI.

The `az aro` extension can be used with a whitelisted subscription against the pre-GA Azure Red Hat OpenShift v4 service, or it can be used against a development resource provider running at https://localhost:8443/ by setting `RP_MODE=development`.

## Installing the extension

1. Install the [`az`](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) client, if you have not already. You will need `az` version 2.0.72 or greater, as this version includes the `az network vnet subnet update --disable-private-link-service-network-policies` flag.

2. Log in to Azure.

```
az login
```

3. Run the following command to install the `az aro` extension.

```
az extension add --source https://arosvc.blob.core.windows.net/az-preview/aro-0.1.0-py2.py3-none-any.whl
```

4. Add the ARO extension path to your `az` configuration.

```
cat >>~/.azure/config <<EOF
[extension]
dev_sources = $PWD/python
EOF
```

5. Verify the ARO extension is registered.

```
az -v
...
Extensions:
aro                                0.1.0 (dev) /path/to/rp/python/az/aro
...
Development extension sources:
    /path/to/rp/python
...
```


## Registering the resource provider

If using the pre-GA Azure Red Hat OpenShift v4 service, ensure that the
`Microsoft.RedHatOpenShift` resource provider is registered.

```
az provider register -n Microsoft.RedHatOpenShift --wait
```


## Prerequisites to create an Azure Red Hat OpenShift v4 cluster

You will need the following in order to create an Azure Red Hat OpenShift v4
cluster:

- A vnet containing two empty subnets, each with no network security group attached.  Your cluster will be deployed into these subnets.

- A cluster AAD application (client ID and secret) and service principal, or sufficient AAD permissions for `az aro create` to create these for you automatically.

- The RP service principal and cluster service principal must each have the Contributor role on the cluster vnet.  If you have the "User Access Administrator" role on the vnet, `az aro create` will set up the role assignments for you automatically.


## Using the extension

After installing the `az aro` extension you can use it to create, access and delete clusters.
 
### Create a cluster:

Run the following command to create a cluster.

```
az aro create \
  -g "$RESOURCEGROUP" \
  -n "$CLUSTER" \
  --vnet dev-vnet \
  --master-subnet "$CLUSTER-master" \
  --worker-subnet "$CLUSTER-worker"
```

>[!NOTE]
> It normally takes about 35 minutes to create a cluster.

### Access the cluster console

You can find the cluster console URL (of the form `https://console-openshift-console.apps.<random>.<location>.aroapp.io/`) in the Azure Red Hat OpenShift v4 cluster resource. Run the following command to view the resource:

```
az aro list -o table
```
   
You can log into the cluster using the `kubeadmin` user.  Run the following command to find the password for the `kubeadmin` user:

```
az aro list-credentials -g "$RESOURCEGROUP" -n "$CLUSTER"
```

### Delete a cluster

Run the following command to delete a cluster.

```
az aro delete -g "$RESOURCEGROUP" -n "$CLUSTER"

# (optional)
for subnet in "$CLUSTER-master" "$CLUSTER-worker"; do
  az network vnet subnet delete -g "$RESOURCEGROUP" --vnet-name dev-vnet -n "$subnet"
done
```
