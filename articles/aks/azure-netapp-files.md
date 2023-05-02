---
title: Provision Azure NetApp Files volumes on Azure Kubernetes Service
description: Learn how to provision Azure NetApp Files volumes on an Azure Kubernetes Service cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/18/2023
---

# Provision Azure NetApp Files volumes on Azure Kubernetes Service

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. This article shows you how to create [Azure NetApp Files][anf] volumes to be used by pods on an Azure Kubernetes Service (AKS) cluster.

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure. Kubernetes users have two options for using Azure NetApp Files volumes for Kubernetes workloads:

* Create Azure NetApp Files volumes **statically**. In this scenario, the creation of volumes is external to AKS. Volumes are created using the Azure CLI or from the Azure portal, and are then exposed to Kubernetes by the creation of a `PersistentVolume`. Statically created Azure NetApp Files volumes have many limitations (for example, inability to be expanded, needing to be over-provisioned, and so on). Statically created volumes are not recommended for most use cases.
* Create Azure NetApp Files volumes **on-demand**, orchestrating through Kubernetes. This method is the **preferred** way to create multiple volumes directly through Kubernetes, and is achieved using [Astra Trident][astra-trident]. Astra Trident is a CSI-compliant dynamic storage orchestrator that helps provision volumes natively through Kubernetes.

Using a CSI driver to directly consume Azure NetApp Files volumes from AKS workloads is the recommended configuration for most use cases. This requirement is accomplished using Astra Trident, an open-source dynamic storage orchestrator for Kubernetes. Astra Trident is an enterprise-grade storage orchestrator purpose-built for Kubernetes, and fully supported by NetApp. It simplifies access to storage from Kubernetes clusters by automating storage provisioning.

You can take advantage of Astra Trident's Container Storage Interface (CSI) driver for Azure NetApp Files to abstract underlying details and create, expand, and snapshot volumes on-demand. Also, using Astra Trident enables you to use [Astra Control Service][astra-control-service] built on top of Astra Trident. Using the Astra Control Service, you can backup, recover, move, and manage the application-data lifecycle of your AKS workloads across clusters within and across Azure regions to meet your business and service continuity needs.

## Before you begin

The following considerations apply when you use Azure NetApp Files:

* Your AKS cluster must be [in a region that supports Azure NetApp Files][anf-regions].
* The Azure CLI version 2.0.59 or higher installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* After the initial deployment of an AKS cluster, you can choose to provision Azure NetApp Files volumes statically or dynamically.
* To use dynamic provisioning with Azure NetApp Files, install and configure [Astra Trident][astra-trident] version 19.07 or higher.

## Configure Azure NetApp Files

1. Register the *Microsoft.NetApp* resource provider by running the following command:

    ```azurecli-interactive
    az provider register --namespace Microsoft.NetApp --wait
    ```

    > [!NOTE]
    > This operation can take several minutes to complete.

2. When you create an Azure NetApp account for use with AKS, you can create the account in an existing resource group or create a new one in the same region as the AKS cluster.
The following command creates an account named *myaccount1* in the *myResourceGroup* resource group and *eastus* region:

    ```azurecli-interactive
    az netappfiles account create \
        --resource-group myResourceGroup \
        --location eastus \
        --account-name myaccount1
    ```

3. Create a new capacity pool by using [az netappfiles pool create][az-netappfiles-pool-create]. The following example creates a new capacity pool named *mypool1* with 4 TB in size and *Premium* service level:

    ```azurecli-interactive
    az netappfiles pool create \
        --resource-group myResourceGroup \
        --location eastus \
        --account-name myaccount1 \
        --pool-name mypool1 \
        --size 4 \
        --service-level Premium
    ```

4. Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using [az network vnet subnet create][az-network-vnet-subnet-create]. Specify the resource group hosting the existing virtual network for your AKS cluster.

    > [!NOTE]
    > This subnet must be in the same virtual network as your AKS cluster.

    ```azurecli-interactive
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

   Volumes can either be provisioned statically or dynamically. Both options are covered further in the next sections.

## Provision Azure NetApp Files volumes statically

1. Create a volume using the [az netappfiles volume create][az-netappfiles-volume-create] command. Update  `RESOURCE_GROUP`, `LOCATION`, `ANF_ACCOUNT_NAME` (Azure NetApp account name), `POOL_NAME`, and `SERVICE_LEVEL` with the correct values.  

    ```azurecli-interactive
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

### Create the persistent volume

1. List the details of your volume using [az netappfiles volume show][az-netappfiles-volume-show]

    ```azurecli-interactive
    az netappfiles volume show \
        --resource-group $RESOURCE_GROUP \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --volume-name "myvol1" -o JSON
    ```

    The following output resembles the output of the previous command:

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

2. Create a `pv-nfs.yaml` defining a persistent volume by copying the following manifest. Replace `path` with the *creationToken* and `server` with *ipAddress* from the previous step.

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

3. Create the persistent volume using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f pv-nfs.yaml
    ```

4. Verify the *Status* of the PersistentVolume is *Available* using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pv pv-nfs
    ```

### Create a persistent volume claim

1. Create a `pvc-nfs.yaml` defining a PersistentVolume by copying the following manifest:

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

2. Create the persistent volume claim using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f pvc-nfs.yaml
    ```

3. Verify the *Status* of the persistent volume claim is *Bound* using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pvc pvc-nfs
    ```

### Mount with a pod

1. Create a `nginx-nfs.yaml` defining a pod that uses the persistent volume claim by using the following manifest:

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

2. Create the pod using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f nginx-nfs.yaml
    ```

3. Verify the pod is *Running* using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pod nginx-nfs
    ```

4. Verify your volume has been mounted on the pod by using [kubectl exec][kubectl-exec] to connect to the pod, and then use `df -h` to check if the volume is mounted.

    ```bash
    kubectl exec -it nginx-nfs -- sh
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

To dynamically provision volumes, you need to install Astra Trident. Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)][kubernetes-csi-driver] driver. Astra Trident deploys on Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.

Before proceeding to the next section, you need to:

1. **Install Astra Trident**. Trident can be installed using the Trident operator (manually or using [Helm][trident-helm-chart]) or [`tridentctl`][tridentctl]. The instructions provided later in this article explain how Astra Trident can be installed using the operator. To learn more about these installation methods and how they work, see the [Install Guide][trident-install-guide].

2. **Create a backend**. To instruct Astra Trident about the Azure NetApp Files subscription and where it needs to create volumes, a backend is created. This step requires details about the account that was created in the previous step.

#### Install Astra Trident using the operator

This section walks you through the installation of Astra Trident using the operator.

1. Run the [kubectl create][kubectl-create] command to create the *trident* namespace:

    ```bash
    kubectl create ns trident
    ```

   The output of the command resembles the following example:

    ```output
    namespace/trident created
    ```

2. Run the [kubectl apply][kubectl-apply] command to deploy the Trident operator using the bundle file:

 - For AKS cluster version less than 1.25, run following command:
    ```bash
    kubectl apply -f https://raw.githubusercontent.com/NetApp/trident/v23.01.1/deploy/bundle_pre_1_25.yaml -n trident
    ```
 - For AKS cluster 1.25+ version, run following command:
    ```bash
    kubectl apply -f https://raw.githubusercontent.com/NetApp/trident/v23.01.1/deploy/bundle_post_1_25.yaml -n trident
    ```

   The output of the command resembles the following example:

    ```output
    serviceaccount/trident-operator created
    clusterrole.rbac.authorization.k8s.io/trident-operator created
    clusterrolebinding.rbac.authorization.k8s.io/trident-operator created
    deployment.apps/trident-operator created
    podsecuritypolicy.policy/tridentoperatorpods created
    ```

3. Run the following command to create a `TridentOrchestrator` to install Astra Trident.

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/NetApp/trident/v23.01.1/deploy/crds/tridentorchestrator_cr.yaml
    ```

   The output of the command resembles the following example:

    ```output
    tridentorchestrator.trident.netapp.io/trident created 
    ```

    The operator installs by using the parameters provided in the `TridentOrchestrator` spec. You can learn about the configuration parameters and example backends from the [Trident install guide][trident-install-guide] and [backend guide][trident-backend-install-guide].

4. To confirm Astra Trident was installed successfully, run the following [kubectl describe][kubectl-describe] command: 

    ```bash
    kubectl describe torc trident
    ```

   The output of the command resembles the following example:

    ```output
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
        Autosupport Image:          netapp/trident-autosupport:23.01
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
        Trident Image:        netapp/trident:23.01.1
      Message:                Trident installed
      Namespace:              trident
      Status:                 Installed
      Version:                v23.01.1
    Events:
      Type    Reason      Age   From                        Message
      ----    ------      ----  ----                        -------
      Normal  Installing  74s   trident-operator.netapp.io  Installing Trident
      Normal  Installed   67s   trident-operator.netapp.io  Trident installed
    ```

### Create a backend

1. Before creating a backend, you need to update [backend-anf.yaml][backend-anf.yaml] to include details about the Azure NetApp Files subscription, such as:

    * `subscriptionID` for the Azure subscription where Azure NetApp Files will be enabled.
    * `tenantID`, `clientID`, and `clientSecret` from an [App Registration][azure-ad-app-registration] in Azure Active Directory (AD) with sufficient permissions for the Azure NetApp Files service. The App Registration includes the `Owner` or `Contributor` role that's predefined by Azure.
    * An Azure location that contains at least one delegated subnet.

    In addition, you can choose to provide a different service level. Azure NetApp Files provides three [service levels](../azure-netapp-files/azure-netapp-files-service-levels.md): Standard, Premium, and Ultra.

2. After Astra Trident is installed, create a backend that points to your Azure NetApp Files subscription by running the following command.

    ```bash
    kubectl apply -f backend-anf.yaml -n trident
    ```

   The output of the command resembles the following example:

    ```output
    secret/backend-tbc-anf-secret created
    tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
    ```

### Create a StorageClass

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume Azure NetApp Files volumes, a storage class must be created.

1. Create a file named `anf-storageclass.yaml` and copy in the following manifest:

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

2. Create the storage class using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f anf-storageclass.yaml
    ```

   The output of the command resembles the following example:

    ```output
    storageclass/azure-netapp-files created
    ```

3. Run the [kubectl get][kubectl-get] command to view the status of the storage class:

    ```bash
    kubectl get sc
    NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
    azure-netapp-files   csi.trident.netapp.io   Delete          Immediate           false                  3s
    ```

### Create a persistent volume claim

A persistent volume claim (PVC) is a request for storage by a user. Upon the creation of a persistent volume claim, Astra Trident automatically creates an Azure NetApp Files volume and makes it available for Kubernetes workloads to consume.

1. Create a file named `anf-pvc.yaml` and copy the following manifest. In this example, a 1-TiB volume is created that with *ReadWriteMany* access.

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

2. Create the persistent volume claim with the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f anf-pvc.yaml
    ```

   The output of the command resembles the following example:

    ```output
    persistentvolumeclaim/anf-pvc created
    ```

3. To view information about the persistent volume claim, run the [kubectl get][kubectl-get] command:

    ```bash
    kubectl get pvc
    ```

   The output of the command resembles the following example:

    ```bash
    kubectl get pvc -n trident
    NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS         AGE
    anf-pvc   Bound    pvc-bffa315d-3f44-4770-86eb-c922f567a075   1Ti        RWO            azure-netapp-files   62s
    ```

### Use the persistent volume

After the PVC is created, a pod can be spun up to access the Azure NetApp Files volume. The following manifest can be used to define an NGINX pod that mounts the Azure NetApp Files volume created in the previous step. In this example, the volume is mounted at `/mnt/data`.

1. Create a file named `anf-nginx-pod.yaml` and copy the following manifest:

    ```yml
    kind: Pod
    apiVersion: v1
    metadata:
      name: nginx-pod
    spec:
      containers:
      - name: nginx
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
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

2. Create the pod using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f anf-nginx-pod.yaml
    ```

   The output of the command resembles the following example:

    ```output
    pod/nginx-pod created
    ```

   Kubernetes has created a pod with the volume mounted and accessible within the `nginx` container at `/mnt/data`. You can confirm by checking the event logs for the pod using [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pod nginx-pod
    ```

    The output of the command resembles the following example:

    ```output
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

## Next steps

Astra Trident supports many features with Azure NetApp Files. For more information, see:

* [Expanding volumes][expand-trident-volumes]
* [On-demand volume snapshots][on-demand-trident-volume-snapshots]
* [Importing volumes][importing-trident-volumes]

<!-- EXTERNAL LINKS -->
[astra-trident]: https://docs.netapp.com/us-en/trident/index.html
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[astra-control-service]: https://cloud.netapp.com/astra-control
[kubernetes-csi-driver]: https://kubernetes-csi.github.io/docs/
[trident-install-guide]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html
[trident-helm-chart]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html
[tridentctl]: https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html
[trident-backend-install-guide]: https://docs.netapp.com/us-en/trident/trident-use/backends.html
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[expand-trident-volumes]: https://docs.netapp.com/us-en/trident/trident-use/vol-expansion.html
[on-demand-trident-volume-snapshots]: https://docs.netapp.com/us-en/trident/trident-use/vol-snapshots.html
[importing-trident-volumes]: https://docs.netapp.com/us-en/trident/trident-use/vol-import.html
[backend-anf.yaml]: https://raw.githubusercontent.com/NetApp/trident/v23.01.1/trident-installer/sample-input/backends-samples/azure-netapp-files/backend-anf.yaml

<!-- INTERNAL LINKS -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[anf]: ../azure-netapp-files/azure-netapp-files-introduction.md
[anf-delegate-subnet]: ../azure-netapp-files/azure-netapp-files-delegate-subnet.md
[anf-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-netappfiles-account-create]: /cli/azure/netappfiles/account#az_netappfiles_account_create
[az-netapp-files-dynamic]: azure-netapp-files-dynamic.md
[az-netappfiles-pool-create]: /cli/azure/netappfiles/pool#az_netappfiles_pool_create
[az-netappfiles-volume-create]: /cli/azure/netappfiles/volume#az_netappfiles_volume_create
[az-netappfiles-volume-show]: /cli/azure/netappfiles/volume#az_netappfiles_volume_show
[az-network-vnet-subnet-create]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_create
[install-azure-cli]: /cli/azure/install-azure-cli
[use-tags]: use-tags.md
[azure-ad-app-registration]: ../active-directory/develop/howto-create-service-principal-portal.md
