---
title: Create an Azure Red Hat OpenShift 4.3 Cluster | Microsoft Docs
description: Create a cluster with Azure Red Hat OpenShift 4.3
author: lamek
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 03/06/2020
keywords: aro, openshift, az aro, red hat, cli
#Customer intent: As a customer, I want to create an ARO custer using the command line.
---

# Create, access, and manage an Azure Red Hat OpenShift 4.3 Cluster

> [!IMPORTANT]
> Please note that Azure Red Hat OpenShift 4.3 is currently only available in private preview in East US. Private preview acceptance is by invitation only. Please be sure to register your subscription before attempting to enable this feature: [Azure Red Hat OpenShift Private Preview Registration](https://aka.ms/aro-preview-register)

> [!NOTE]
> Preview features are self-service and are provided as is and as available and are excluded from the service-level agreement (SLA) and limited warranty. Therefore, the features aren't meant for production use.

## Prerequisites

You'll need the following to create an Azure Red Hat OpenShift 4.3 cluster:

- Azure CLI version 2.0.72 or greater
  
- The 'az aro' extension

- A virtual network containing two empty subnets, each with no network security group attached.  Your cluster will be deployed into these subnets.

- A cluster AAD application (client ID and secret) and service principal, or sufficient AAD permissions for `az aro create` to create an AAD application and service principal for you automatically.

- The RP service principal and cluster service principal must each have the Contributor role on the cluster virtual network.  If you have the "User Access Administrator" role on the virtual network, `az aro create` will set up the role assignments for you automatically.

### Install the 'az aro' extension
The `az aro` extension allows you to create, access, and delete Azure Red Hat OpenShift clusters directly from the command line using the Azure CLI.

> [!Note] 
> The `az aro` extension is currenty in preview. It may be changed or removed in a future release.
> To opt-in for the `az aro` extension preview you need to register the `Microsoft.RedHatOpenShift` resource provider.
> 
>    ```console
>    az provider register -n Microsoft.RedHatOpenShift --wait
>    ```

1. Log in to Azure.

   ```console
   az login
   ```

2. Run the following command to install the `az aro` extension:

   ```console
   az extension add -n aro --index https://az.aroapp.io/preview
   ```

3. Verify the ARO extension is registered.

   ```console
   az -v
   ...
   Extensions:
   aro                                0.1.0
   ...
   ```
  
### Create a virtual network containing two empty subnets

Follow these steps to create a virtual network containing two empty subnets.

1. Set the following variables.

   ```console
   LOCATION=eastus        #the location of your cluster
   RESOURCEGROUP="v4-$LOCATION"    #the name of the resource group where you want to create your cluster
   CLUSTER=cluster        #the name of your cluster
   PULL_SECRET="<optional-pull-secret>"
   ```
   >[!NOTE]
   > The optional pull secret enables your cluster to access Red Hat container registries along with additional content.
   >
   > Access your pull secret by navigating to https://cloud.redhat.com/openshift/install/azure/installer-provisioned and clicking *Copy Pull Secret*.
   >
   > You will need to log in to your Red Hat account, or create a new Red Hat account with your business email and accept the terms and conditions.
 

2. Create a resource group for your cluster.

   ```console
   az group create -g "$RESOURCEGROUP" -l $LOCATION
   ```

3. Create the virtual network.

   ```console
   az network vnet create \
     -g "$RESOURCEGROUP" \
     -n vnet \
     --address-prefixes 10.0.0.0/9 \
     >/dev/null
   ```

4. Add two empty subnets to your virtual network.

   ```console
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

5. Disable network policies for Private Link Service on your virtual network and subnets. This is a requirement for the ARO service to access and manage the cluster.

   ```console
   az network vnet subnet update \
     -g "$RESOURCEGROUP" \
     --vnet-name vnet \
     -n "$CLUSTER-master" \
     --disable-private-link-service-network-policies true \
     >/dev/null
   ```

## Create a cluster

Run the following command to create a cluster.

```console
az aro create \
  -g "$RESOURCEGROUP" \
  -n "$CLUSTER" \
  --vnet vnet \
  --master-subnet "$CLUSTER-master" \
  --worker-subnet "$CLUSTER-worker" \
  --pull-secret "$PULL_SECRET"
```

>[!NOTE]
> It normally takes about 35 minutes to create a cluster.

## Access the cluster console

You can find the cluster console URL (of the form `https://console-openshift-console.apps.<random>.<location>.aroapp.io/`) under the Azure Red Hat OpenShift 4.3 cluster resource. Run the following command to view the resource:

```console
az aro list -o table
```

You can log into the cluster using the `kubeadmin` user.  Run the following command to find the password for the `kubeadmin` user:

```dotnetcli
az aro list-credentials -g "$RESOURCEGROUP" -n "$CLUSTER"
```

## Delete a cluster

Run the following command to delete a cluster.

```console
az aro delete -g "$RESOURCEGROUP" -n "$CLUSTER"

# (optional)
for subnet in "$CLUSTER-master" "$CLUSTER-worker"; do
  az network vnet subnet delete -g "$RESOURCEGROUP" --vnet-name vnet -n "$subnet"
done
```
