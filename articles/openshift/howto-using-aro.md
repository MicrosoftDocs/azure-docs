---
title: Using `az aro` | Microsoft Docs
description: Create, access, and delete clusters with `az aro` extension
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

> [!Note] 
> The `az aro` extension is currenty in preview. It may be changed or removed in a future release.
> To opt-in for the `az aro` extension preview you need to register the `Microsoft.RedHatOpenShift` resource provider.
> 
>    ```
>    az provider register -n Microsoft.RedHatOpenShift --wait
>    ```


## Installing the extension

1. Install the [`az`](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) client, if you have not already. You will need `az` version 2.0.72 or greater, as this version includes the `az network vnet subnet update --disable-private-link-service-network-policies` flag.

2. Log in to Azure.

   ```
   az login
   ```

3. Run the following command to install the `az aro` extension:

   ```
   az extension add --source https://arosvc.blob.core.windows.net/az-preview/aro-0.1.0-py2.py3-none-any.whl
   ```

4. Verify the ARO extension is registered.

   ```
   az -v
   ...
   Extensions:
   aro                                0.1.0
   ...
   ```


## Prerequisites to create an Azure Red Hat OpenShift v4 cluster

You need the following items to create an Azure Red Hat OpenShift v4 cluster.

* A cluster AAD application (client ID and secret) and service principal, or sufficient AAD permissions for `az aro` to create these for you automatically.
* The resource provider service principal and cluster service principal must each have the Contributor role on the cluster VNet. If you have the User Access Administrator role on the VNet, `az aro create` will set up the role assignments for you automatically.
* A VNet containing two empty subnets, each with no network security group attached. Your cluster will be deployed into these subnets. Follow the steps below to create your VNet.

### Create a VNet containing two empty subnets

Follow these steps to create a VNet containing two empty subnets.

1. Set the following variables.

   ```
   LOCATION=eastus		#the location of your cluster
   RESOURCEGROUP="v4-$LOCATION"	#the name of the resource group where you want to create your cluster
   CLUSTER=cluster		#the name of your cluster
   ```

2. Create a resource group for your cluster.

   ```
   az group create -g "$RESOURCEGROUP" -l $LOCATION
   ```

3. Create the VNet.

   ```
   az network vnet create \
     -g "$RESOURCEGROUP" \
     -n vnet \
     --address-prefixes 10.0.0.0/9 \
     >/dev/null
   ```

4. Add two empty subnets to your VNet.

   ```
    for subnet in "$CLUSTER-master" "$CLUSTER-worker"; do
     az network vnet subnet create \
       -g "$RESOURCEGROUP" \
       --vnet-name vnet \
       -n "$subnet" \
       --address-prefixes 10.$((RANDOM & 127)).$((RANDOM & 255)).0/24 \
       --service-endpoints Microsoft.ContainerRegistry \
       >/dev/null
   done
   ```

5. Disable network policies for private link service on your VNet and subnets. This is a requirement for the ARO service to access and manage the cluster.

   ```
   az network vnet subnet update \
     -g "$RESOURCEGROUP" \
     --vnet-name vnet \
     -n "$CLUSTER-master" \
     --disable-private-link-service-network-policies true \
     >/dev/null
   ```


## Using the extension

After installing the `az aro` extension you can use it to create, access, and delete clusters.
 
### Create a cluster

Run the following command to create a cluster.

```
az aro create \
  -g "$RESOURCEGROUP" \
  -n "$CLUSTER" \
  --vnet vnet \
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

Run the following command to delete a cluster:

```
az aro delete -g "$RESOURCEGROUP" -n "$CLUSTER"

# (optional)
for subnet in "$CLUSTER-master" "$CLUSTER-worker"; do
  az network vnet subnet delete -g "$RESOURCEGROUP" --vnet-name vnet -n "$subnet"
done
```
