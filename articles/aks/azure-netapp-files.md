---
title: Integrate Azure NetApp Files with Azure Kubernetes Service | Microsoft Docs
description: Learn how to provision Azure NetApp Files with Azure Kubernetes Service.
services: container-service
ms.topic: article
ms.date: 10/18/2021

#Customer intent: As a cluster operator or developer, I want to learn how to use Azure NetApp Files to provision volumes for Kubernetes environments.
---

# Integrate Azure NetApp Files with Azure Kubernetes Service

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods and can be dynamically or statically provisioned. This article shows you how to create [Azure NetApp Files][anf] volumes to be used by pods in an Azure Kubernetes Service (AKS) cluster.

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure. Kubernetes users have two options when it comes to using Azure NetApp Files volumes for Kubernetes workloads:

* Create Azure NetApp Files volumes **statically**: In this scenario, the creation of volumes is achieved external to AKS; volumes are created using `az`/Azure UI and are then exposed to Kubernetes by the creation of a `PersistentVolume`. Statically created Azure NetApp Files volumes have lots of limitations (for example, inability to be expanded, needing to be over-provisioned, and so on) and are not recommended for most use cases.
* Create Azure NetApp Files volumes **on-demand**, orchestrating through Kubernetes: This method is the **preferred** mode of operation for creating multiple volumes directly through Kubernetes and is achieved using [Astra Trident](https://docs.netapp.com/us-en/trident/index.html). Astra Trident is a CSI-compliant dynamic storage orchestrator that helps provision volumes natively through Kubernetes.

Using a CSI driver to directly consume Azure NetApp Files volumes from AKS workloads is **highly recommended** for most use cases. This requirement is fulfilled using Astra Trident, an open-source dynamic storage orchestrator for Kubernetes. Astra Trident is an enterprise-grade storage orchestrator purpose-built for Kubernetes, fully supported by NetApp. It simplifies access to storage from Kubernetes clusters by automating storage provisioning. You can take advantage of Astra Trident's Container Storage Interface (CSI) driver for Azure NetApp Files to abstract underlying details and create, expand, and snapshot volumes on-demand. Also, using Astra Trident enables you to use [Astra Control Service](https://cloud.netapp.com/astra-control) built on top of Astra Trident to backup, recover, move, and manage the application-data lifecycle of your AKS workloads across clusters within and across Azure regions to meet your business and service continuity needs.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

> [!IMPORTANT]
> Your AKS cluster must also be [in a region that supports Azure NetApp Files][anf-regions].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Prerequisites

The following considerations apply when you use Azure NetApp Files:

* Azure NetApp Files is only available [in selected Azure regions][anf-regions].
* After the initial deployment of an AKS cluster, you can choose to provision Azure NetApp Files volumes statically or dynamically.
* To use dynamic provisioning with Azure NetApp Files, install and configure [Astra Trident](https://docs.netapp.com/us-en/trident/index.html) version 19.07 or later.

## Configure Azure NetApp Files

Register the *Microsoft.NetApp* resource provider:

```azurecli
az provider register --namespace Microsoft.NetApp --wait
```

> [!NOTE]
> This can take some time to complete.

When you create an Azure NetApp account for use with AKS, you can create the account in an existing resource group or create a new one in the same region as the AKS cluster.
The following example creates an account named *myaccount1* in the *myResourceGroup* resource group and *eastus* region:

```azurecli
az netappfiles account create \
    --resource-group myResourceGroup \
    --location eastus \
    --account-name myaccount1
```

Create a new capacity pool by using [az netappfiles pool create][az-netappfiles-pool-create]. The following example creates a new capacity pool named *mypool1* with 4 TB in size and *Premium* service level:

```azurecli
az netappfiles pool create \
    --resource-group myResourceGroup \
    --location eastus \
    --account-name myaccount1 \
    --pool-name mypool1 \
    --size 4 \
    --service-level Premium
```

Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using [az network vnet subnet create][az-network-vnet-subnet-create]. *This subnet must be in the same virtual network as your AKS cluster.*

```azurecli
RESOURCE_GROUP=myResourceGroup
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

Volumes can either be provisioned statically or dynamically. Both options are covered in detail below.

## Provision Azure NetApp Files volumes statically

Create a volume by using [az netappfiles volume create][az-netappfiles-volume-create].

```azurecli
RESOURCE_GROUP=myResourceGroup
LOCATION=eastus
ANF_ACCOUNT_NAME=myaccount1
POOL_NAME=mypool1
SERVICE_LEVEL=Premium
VNET_NAME=$(az network vnet list --resource-group $RESOURCE_GROUP --query [].name -o tsv)
VNET_ID=$(az network vnet show --resource-group $RESOURCE_GROUP --name $VNET_NAME --query "id" -o tsv)
SUBNET_NAME=MyNetAppSubnet
SUBNET_ID=$(az network vnet subnet show --resource-group $RESOURCE_GROUP --vnet-name $VNET_NAME --name $SUBNET_NAME --query "id" -o tsv)
VOLUME_SIZE_GiB=100 # 100 GiB
UNIQUE_FILE_PATH="myfilepath2" # Note that file path needs to be unique within all ANF Accounts

az netappfiles volume create \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --account-name $ANF_ACCOUNT_NAME \
    --pool-name $POOL_NAME \
    --name "myvol1" \
    --service-level $SERVICE_LEVEL \
    --vnet $VNET_ID \
    --subnet $SUBNET_ID \
    --usage-threshold $VOLUME_SIZE_GiB \
    --file-path $UNIQUE_FILE_PATH \
    --protocol-types "NFSv3"
```

### Create the PersistentVolume

List the details of your volume using [az netappfiles volume show][az-netappfiles-volume-show]

```azurecli
az netappfiles volume show \
    --resource-group $RESOURCE_GROUP \
    --account-name $ANF_ACCOUNT_NAME \
    --pool-name $POOL_NAME \
    --volume-name "myvol1" -o JSON
```

```output
{
  ...
  "creationToken": "myfilepath2",
  ...
  "mountTargets": [
    {
      ...
      "ipAddress": "10.0.0.4",
      ...
    }
  ],
  ...
}
```

Create a `pv-nfs.yaml` defining a PersistentVolume. Replace `path` with the *creationToken* and `server` with *ipAddress* from the previous command. For example:

```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nfs
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteMany
  mountOptions:
    - vers=3
  nfs:
    server: 10.0.0.4
    path: /myfilepath2
```

Update the *server* and *path* to the values of your NFS (Network File System) volume you created in the previous step. Create the PersistentVolume with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f pv-nfs.yaml
```

Verify the *Status* of the PersistentVolume is *Available* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pv pv-nfs
```

### Create the PersistentVolumeClaim

Create a `pvc-nfs.yaml` defining a PersistentVolume. For example:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-nfs
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: ""
  resources:
    requests:
      storage: 1Gi
```

Create the PersistentVolumeClaim with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f pvc-nfs.yaml
```

Verify the *Status* of the PersistentVolumeClaim is *Bound* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pvc pvc-nfs
```

### Mount with a pod

Create a `nginx-nfs.yaml` defining a pod that uses the PersistentVolumeClaim. For example:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx-nfs
spec:
  containers:
  - image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    name: nginx-nfs
    command:
    - "/bin/sh"
    - "-c"
    - while true; do echo $(date) >> /mnt/azure/outfile; sleep 1; done
    volumeMounts:
    - name: disk01
      mountPath: /mnt/azure
  volumes:
  - name: disk01
    persistentVolumeClaim:
      claimName: pvc-nfs
```

Create the pod with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f nginx-nfs.yaml
```

Verify the pod is *Running* using the [kubectl describe][kubectl-describe] command:

```console
kubectl describe pod nginx-nfs
```

Verify your volume has been mounted in the pod by using [kubectl exec][kubectl-exec] to connect to the pod then `df -h` to check if the volume is mounted.

```console
$ kubectl exec -it nginx-nfs -- sh
```

```output
/ # df -h
Filesystem             Size  Used Avail Use% Mounted on
...
10.0.0.4:/myfilepath2  100T  384K  100T   1% /mnt/azure
...
```

## Provision Azure NetApp Files volumes dynamically

### Install and configure Astra Trident

To dynamically provision volumes, you need to install Astra Trident. Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) drivers. Astra Trident deploys in Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.

You can learn more from the [documentation]https://docs.netapp.com/us-en/trident/index.html).

Before proceeding to the next step, you will need to:

1. **Install Astra Trident**. Trident can be installed using the operator/Helm chart/`tridentctl`. The instructions provided below explain how Astra Trident can be installed using the operator. To learn how the other install methods work, see the [Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).

2. **Create a backend**. To instruct Astra Trident about the Azure NetApp Files subscription and where it needs to create volumes, a backend is created. This step requires details about the account that was created in the previous step.

#### Install Astra Trident using the operator

This section walks you through the installation of Astra Trident using the operator. You can also choose to install using one of its other methods:

* [Helm chart](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html).
* [`tridentctl`](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html).

See to [Deploying Trident](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html) to understand how each option works and identify the one that works best for you.

Download Astra Trident from its [GitHub repository](https://github.com/NetApp/trident/releases). Choose from the desired version and download the installer bundle.

```console
#Download Astra Trident

$  wget https://github.com/NetApp/trident/releases/download/v21.07.1/trident-installer-21.07.1.tar.gz
$  tar xzvf trident-installer-21.07.1.tar.gz
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

Create a `TridentOrchestrator` to install Astra Trident.

```console
$ kubectl apply -f trident-installer/deploy/crds/tridentorchestrator_cr.yaml

tridentorchestrator.trident.netapp.io/trident created 
```

The operator installs by using the parameters provided in the `TridentOrchestrator` spec. You can learn about the configuration parameters and example backends from the extensive [installation](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html) and [backend guides](https://docs.netapp.com/us-en/trident/trident-use/backends.html).

Confirm Astra Trident was installed. 

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
    Trident Image:        netapp/trident:21.07.1
  Message:                Trident installed
  Namespace:              trident
  Status:                 Installed
  Version:                v21.07.1
Events:
  Type    Reason      Age   From                        Message
  ----    ------      ----  ----                        -------
  Normal  Installing  74s   trident-operator.netapp.io  Installing Trident
  Normal  Installed   67s   trident-operator.netapp.io  Trident installed
```

### Create a backend

After Astra Trident is installed, create a backend that points to your Azure NetApp Files subscription.

```console
$  kubectl apply -f trident-installer/sample-input/backends-samples/azure-netapp-files/backend-anf.yaml -n trident

secret/backend-tbc-anf-secret created
tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
```

Before running the command, you need to update `backend-anf.yaml` to include details about the Azure NetApp Files subscription, such as:

* `subscriptionID` for the Azure subscription with Azure NetApp Files enabled. The 
* `tenantID`, `clientID`, and `clientSecret` from an [App Registration](../active-directory/develop/howto-create-service-principal-portal.md) in Azure Active Directory (AD) with sufficient permissions for the Azure NetApp Files service. The App Registration must carry the `Owner` or `Contributor` role that’s predefined by Azure.
* Azure location that contains at least one delegated subnet.

In addition, you can choose to provide a different service level. Azure NetApp Files provides three [service levels](../azure-netapp-files/azure-netapp-files-service-levels.md): Standard, Premium, and Ultra.

### Create a StorageClass

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume Azure NetApp Files volumes, a storage class must be created. Create a file named `anf-storageclass.yaml` and copy in the manifest provided below.

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

### Create a PersistentVolumeClaim

A PersistentVolumeClaim (PVC) is a request for storage by a user. Upon the creation of a PersistentVolumeClaim, Astra Trident automatically creates an Azure NetApp Files volume and makes it available for Kubernetes workloads to consume.

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

### Use the persistent volume

After the PVC is created, a pod can be spun up to access the Azure NetApp Files volume. The manifest below can be used to define an NGINX pod that mounts the Azure NetApp Files volume that was created in the previous step. In this example, the volume is mounted at `/mnt/data`.

Create a file named `anf-nginx-pod.yaml`, which contains the following manifest:

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

Kubernetes has now created a pod with the volume mounted and accessible within the `nginx` container at `/mnt/data`. Confirm by checking the event logs for the pod using `kubectl describe`:

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

Astra Trident supports many features with Azure NetApp Files, such as:

* [Expanding volumes](https://docs.netapp.com/us-en/trident/trident-use/vol-expansion.html)
* [On-demand volume snapshots](https://docs.netapp.com/us-en/trident/trident-use/vol-snapshots.html)
* [Importing volumes](https://docs.netapp.com/us-en/trident/trident-use/vol-import.html)

## Using Azure tags

For more details on using Azure tags, see [Use Azure tags in Azure Kubernetes Service (AKS)][use-tags].

## Next steps

* For more information on Azure NetApp Files, see [What is Azure NetApp Files][anf].

[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-nfs]: azure-nfs-volume.md
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[anf-delegate-subnet]: ../azure-netapp-files/azure-netapp-files-delegate-subnet.md
[anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all
[anf-waitlist]: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8cq17Xv9yVBtRCSlcD_gdVUNUpUWEpLNERIM1NOVzA5MzczQ0dQR1ZTSS4u
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-netappfiles-account-create]: /cli/azure/netappfiles/account#az_netappfiles_account_create
[az-netapp-files-dynamic]: azure-netapp-files-dynamic.md
[az-netappfiles-pool-create]: /cli/azure/netappfiles/pool#az_netappfiles_pool_create
[az-netappfiles-volume-create]: /cli/azure/netappfiles/volume#az_netappfiles_volume_create
[az-netappfiles-volume-show]: /cli/azure/netappfiles/volume#az_netappfiles_volume_show
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[install-azure-cli]: /cli/azure/install-azure-cli
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[use-tags]: use-tags.md