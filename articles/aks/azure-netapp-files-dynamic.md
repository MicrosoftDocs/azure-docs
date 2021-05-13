---
title: Dynamically create and use a persistent volume with Azure NetApp Files in Azure Kubernetes Service (AKS)
description: Learn how to provision ANF volumes on-demand with Azure Kubernetes Service
services: container-service
ms.topic: article
ms.date: 05/10/2021

#Customer intent: As a cluster operator or developer, I want to learn how to create on-demand ANF volumes that must be used as Kubernetes persistent volumes in an Azure Kubernetes Service (AKS) cluster
---

# Dynamically create and use a persistent volume with Azure NetApp Files in Azure Kubernetes Service (AKS)

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This article shows you how to dynamically create an [Azure NetApp Files][anf] volume to be used by pods in an Azure Kubernetes Service (AKS) cluster.

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure. Kubernetes users have two options when it comes to using ANF volumes for Kubernetes workloads:

* Create ANF volumes statically. In this scenario, the creation of ANF volumes is achieved external to AKS; ANF volumes are created using `az`/Azure UI and are then exposed to the Kubernetes plane by the creation of a `PersistentVolume`.
* Create ANF volumes on-demand, orchestrating through Kubernetes. This is the preferred mode of operation for creating multiple ANF volumes directly through Kubernetes, and is achieved using [Trident](https://netapp-trident.readthedocs.io/).

If you would like to provision ANF volumes statically, read [Manually create and use a volume with Azure NetApp Files in Azure Kubernetes Service (AKS)][az-netappfiles-static].

## Before you begin
This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> Your AKS cluster must also be [in a region that supports Azure NetApp Files][anf-regions].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Prerequisites

The following considerations apply when you use Azure NetApp Files:

* Azure NetApp Files is only available [in selected Azure regions][anf-regions].
* Before you can use Azure NetApp Files, you must be granted access to the Azure NetApp Files service. To apply for access, you can use the [Azure NetApp Files waitlist submission form][anf-waitlist] or go to https://azure.microsoft.com/services/netapp/#getting-started. You can't access the Azure NetApp Files service until you receive the official confirmation email from the Azure NetApp Files team.
* After the initial deployment of an AKS cluster, users can choose to provision ANF volumes statically or dynamically. This articles covers the former workflow.
* To use dynamic provisioning with Azure NetApp Files, install and configure [NetApp Trident](https://netapp-trident.readthedocs.io/) version 19.07 or later.

## Configure Azure NetApp Files

> [!IMPORTANT]
> Before you can register the  *Microsoft.NetApp* resource provider, you must complete the [Azure NetApp Files waitlist submission form][anf-waitlist] or go to https://azure.microsoft.com/services/netapp/#getting-started for your subscription. You can't register the resource provide until you receive the official confirmation email from the Azure NetApp Files team.

Register the *Microsoft.NetApp* resource provider:

```azurecli
az provider register --namespace Microsoft.NetApp --wait
```

> [!NOTE]
> This can take some time to complete.

When you create an Azure NetApp account for use with AKS, you need to create the account in the **node** resource group. First, get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster named *myAKSCluster* in the resource group name *myResourceGroup*:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
```

```output
MC_myResourceGroup_myAKSCluster_eastus
```

Create an Azure NetApp Files account in the **node** resource group and same region as your AKS cluster using [az netappfiles account create][az-netappfiles-account-create]. The following example creates an account named *myaccount1* in the *MC_myResourceGroup_myAKSCluster_eastus* resource group and *eastus* region:

```azurecli
az netappfiles account create \
    --resource-group MC_myResourceGroup_myAKSCluster_eastus \
    --location eastus \
    --account-name myaccount1
```

Create a new capacity pool by using [az netappfiles pool create][az-netappfiles-pool-create]. The following example creates a new capacity pool named *mypool1* with 4 TB in size and *Premium* service level:

```azurecli
az netappfiles pool create \
    --resource-group MC_myResourceGroup_myAKSCluster_eastus \
    --location eastus \
    --account-name myaccount1 \
    --pool-name mypool1 \
    --size 4 \
    --service-level Premium
```

Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using [az network vnet subnet create][az-network-vnet-subnet-create]. *This subnet must be in the same virtual network as your AKS cluster.*

```azurecli
RESOURCE_GROUP=MC_myResourceGroup_myAKSCluster_eastus
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyNetAppSubnet
az network vnet subnet create \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --name $SUBNET_NAME \
    --delegations "Microsoft.NetApp/volumes" \
    --address-prefixes 10.0.0.0/28
```

## Install and configure Trident

To dynamically provision volumes, you will need to install Trident. Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) drivers. Trident deploys in Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.

You can learn more about Trident from the [documentation](https://netapp-trident.readthedocs.io/en/latest/index.html).

Before proceeding to the next step, you will need to:

1. **Install Trident**. This can be achieved using the Trident operator/Trident Helm chart/`tridentctl`. The instructions provided below explain how Trident can be installed using the operator. To learn how the other install methods work, please take a look at the [Trident Install Guide](https://netapp-trident.readthedocs.io/en/latest/kubernetes/deploying/deploying.html).

2. **Create a Trident Backend**. To instruct Trident about the ANF subscription and where it needs to create ANF volumes, a backend is created. This step requires details about the ANF account that was created in the previous step.

### Install Trident using the Trident operator

This step walks you through the installation of Trident using the operator. You can also choose to install Trident using one of its other methods:

* [Helm chart](https://netapp-trident.readthedocs.io/en/latest/kubernetes/deploying/operator-deploy.html#deploy-trident-operator-by-using-helm).
* [`tridentctl`](https://netapp-trident.readthedocs.io/en/latest/kubernetes/deploying/tridentctl-deploy.html).

Refer to the Trident [documentation](https://netapp-trident.readthedocs.io/en/latest/kubernetes/deploying/deploying.html) to understand how each option works and identify the one that works best for you.

Download Trident from its [GitHub repository](https://github.com/NetApp/trident/releases). Choose from the desired version and download the installer bundle.

```console
#Download Trident v21.04.0

$  wget https://github.com/NetApp/trident/releases/download/v21.04.0/trident-installer-21.04.0.tar.gz
$  tar xzvf trident-installer-21.04.0.tar.gz
```
Deploy the operator using `deploy/bundle.yaml`.

```console
$  kubectl create ns trident

namespace/trident created

$  kubectl apply -f trident-installer/deploy/bundle.yaml -n trident

serviceaccount/trident-operator created
clusterrole.rbac.authorization.k8s.io/trident-operator created
clusterrolebinding.rbac.authorization.k8s.io/trident-operator created
deployment.apps/trident-operator created
podsecuritypolicy.policy/tridentoperatorpods created
```

Create a `TridentOrchestrator` to install Trident.

```console
$  kubectl apply -f trident-installer/deploy/crds/tridentorchestrator_cr.yaml

tridentorchestrator.trident.netapp.io/trident created 
```

This instructs the operator to install Trident using the parameters provided in the `TridentOrchestrator` spec. You can learn about the configuration parameters and example backends from Trident's extensive [installation](https://netapp-trident.readthedocs.io/en/latest/kubernetes/deploying/deploying.html) and [backend guides](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/backends/index.html).

Confirm Trident was installed. Once you are done with this, you will need to create a backend.

```console
$  kubectl describe torc trident
Name:         trident
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  trident.netapp.io/v1
Kind:         TridentOrchestrator
...
Spec:
  Debug:      true
  Namespace:  trident
Status:
  Current Installation Params:
    IPv6:                       false
    Autosupport Hostname:
    Autosupport Image:          netapp/trident-autosupport:21.01
    Autosupport Proxy:
    Autosupport Serial Number:
    Debug:                      true
    Enable Node Prep:           false
    Image Pull Secrets:
    Image Registry:
    k8sTimeout:           30
    Kubelet Dir:          /var/lib/kubelet
    Log Format:           text
    Silence Autosupport:  false
    Trident Image:        netapp/trident:21.04.0
  Message:                Trident installed
  Namespace:              trident
  Status:                 Installed
  Version:                v21.04.0
Events:
  Type    Reason      Age   From                        Message
  ----    ------      ----  ----                        -------
  Normal  Installing  74s   trident-operator.netapp.io  Installing Trident
  Normal  Installed   67s   trident-operator.netapp.io  Trident installed
```

### Create a backend.

```console
$  kubectl apply -f trident-installer/sample-input/backends-samples/azure-netapp-files/backend-anf.yaml -n trident

secret/backend-tbc-anf-secret created
tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
```

Before running the command, you will need to update `backend-anf.yaml` to include details about the ANF subscription, such as:

* `subscriptionID` for the Azure subscription with Azure NetApp Files enabled. The 
* `tenantID`, `clientID`, and `clientSecret` from an [App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) in Azure Active Directory (AD) with sufficient permissions for the Azure NetApp Files service. The App Registration must carry the `Owner` or `Contributor` role that’s predefined by Azure.
* Azure location that contains at least one delegated subnet.

In addition, you can choose to provide a different service level. Azure NetApp Files provides three [service levels](https://docs.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-service-levels): Standard, Premium, and Ultra.

## Create a StorageClass

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume ANF volumes, a storage class must be created. Create a file named `anf-storageclass.yaml` and copy in the manifest provided below.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azure-netapp-files
provisioner: csi.trident.netapp.io
parameters:
  backendType: "azure-netapp-files"
  fsType: "nfs"
```

Create the storage class using [kubectl apply][kubectl-apply] command:

```console
$  kubectl apply -f anf-storageclass.yaml

storageclass/azure-netapp-files created

$  kubectl get sc
NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
azure-netapp-files   csi.trident.netapp.io   Delete          Immediate           false                  3s
```

## Create a PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request for storage by a user. Upon the creation of a PersistentVolumeClaim, Trident automatically creates an ANF volume and makes it available for Kubernetes workloads to consume.

Create a file named `anf-pvc.yaml` and provide the following manifest. In this example, a 1-TiB volume is created that is *ReadWriteMany*.

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: anf-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 1Ti
  storageClassName: azure-netapp-files
```

Create the persistent volume claim with the [kubectl apply][kubectl-apply] command:

```console
$  kubectl apply -f anf-pvc.yaml

persistentvolumeclaim/anf-pvc created

$  kubectl get pvc
kubectl get pvc -n trident
NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS         AGE
anf-pvc   Bound    pvc-bffa315d-3f44-4770-86eb-c922f567a075   1Ti        RWO            azure-netapp-files   62s
```

## Use the persistent volume

After the PVC is created, a pod can be spun up to access the ANF volume. The manifest below can be used to define a NGINX pod that mounts the ANF volume that was created in the previous step. In this example, the volume is mounted at `/mnt/data`.

Create a file named `anf-nginx-pod.yaml` which contains the following manifest:

```yml
kind: Pod
apiVersion: v1
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: mcr.microsoft.com/oss/nginx/nginx:latest1.15.5-alpine
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
    volumeMounts:
    - mountPath: "/mnt/data"
      name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: anf-pvc
```

Create the pod with the [kubectl apply][kubectl-apply] command:

```console
$  kubectl apply -f anf-nginx-pod.yaml

pod/nginx-pod created
```

Kubernetes has now created a pod with the ANF volume mounted and accessible within the `nginx` container at `/mnt/data`. This can be confirmed by looking at the event logs for the pod using `kubectl describe`:

```console
$  kubectl describe pod nginx-pod

[...]
Volumes:
  volume:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  anf-pvc
    ReadOnly:   false
  default-token-k7952:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-k7952
    Optional:    false
[...]
Events:
  Type    Reason                  Age   From                     Message
  ----    ------                  ----  ----                     -------
  Normal  Scheduled               15s   default-scheduler        Successfully assigned trident/nginx-pod to brameshb-non-root-test
  Normal  SuccessfulAttachVolume  15s   attachdetach-controller  AttachVolume.Attach succeeded for volume "pvc-bffa315d-3f44-4770-86eb-c922f567a075"
  Normal  Pulled                  12s   kubelet                  Container image "mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine" already present on machine
  Normal  Created                 11s   kubelet                  Created container nginx
  Normal  Started                 10s   kubelet                  Started container nginx
```

Trident supports a number of features with ANF, such as:

* [Expanding volumes](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/volumes/vol-expansion.html)
* [On-demand volume snapshots](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/volumes/snapshots.html)
* [Importing volumes](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/volumes/import.html)

## Next steps

For more information on Azure NetApp Files, see [What is Azure NetApp Files][anf]. You can also learn more about Trident and how Azure NetApp Files can be configured to work with Trident from the detailed [Backend Configuration Guide](https://netapp-trident.readthedocs.io/en/latest/kubernetes/operations/tasks/backends/anf.html).


[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[aks-nfs]: azure-nfs-volume.md
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[anf-delegate-subnet]: ../azure-netapp-files/azure-netapp-files-delegate-subnet.md
[anf-quickstart]: ../azure-netapp-files/
[anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all
[anf-waitlist]: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8cq17Xv9yVBtRCSlcD_gdVUNUpUWEpLNERIM1NOVzA5MzczQ0dQR1ZTSS4u
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-netappfiles-account-create]: /cli/azure/netappfiles/account#az_netappfiles_account_create
[az-netappfiles-static]: azure-netapp-files.md
[az-netappfiles-pool-create]: /cli/azure/netappfiles/pool#az_netappfiles_pool_create
[az-netappfiles-volume-create]: /cli/azure/netappfiles/volume#az_netappfiles_volume_create
[az-netappfiles-volume-show]: /cli/azure/netappfiles/volume#az_netappfiles_volume_show
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[install-azure-cli]: /cli/azure/install-azure-cli
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
