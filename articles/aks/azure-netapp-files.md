---
title: Provision Azure NetApp Files volumes on Azure Kubernetes Service
description: Learn how to provision Azure NetApp Files volumes on an Azure Kubernetes Service cluster.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 05/08/2023
---

# Provision Azure NetApp Files volumes on Azure Kubernetes Service

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be statically or dynamically provisioned. This article shows you how to create [Azure NetApp Files][anf] volumes to be used by pods on an Azure Kubernetes Service (AKS) cluster.

[Azure NetApp Files][anf] is an enterprise-class, high-performance, metered file storage service running on Azure and supports both the NFS and SMB protocols. Kubernetes users have two options for using Azure NetApp Files volumes for Kubernetes workloads:

* Create Azure NetApp Files volumes **dynamically**. In this scenario, the creation of volumes is external to AKS. Volumes are created using the Azure CLI or from the Azure portal, and are then exposed to Kubernetes by the creation of a `PersistentVolume`. Statically created Azure NetApp Files volumes have many limitations (for example, inability to be expanded, needing to be over-provisioned, and so on). Statically created volumes are not recommended for most use cases.
* Create Azure NetApp Files volumes **on-demand**, orchestrating through Kubernetes. This method is the **preferred** way to create multiple volumes directly through Kubernetes, and is achieved using [Astra Trident][astra-trident]. Astra Trident is a CSI-compliant dynamic storage orchestrator that helps provision volumes natively through Kubernetes.

Using a CSI driver to directly consume Azure NetApp Files volumes from AKS workloads is the recommended configuration for most use cases. This requirement is accomplished using Astra Trident, an open-source dynamic storage orchestrator for Kubernetes. Astra Trident is an enterprise-grade storage orchestrator purpose-built for Kubernetes, and fully supported by NetApp. It simplifies access to storage from Kubernetes clusters by automating storage provisioning.

You can take advantage of Astra Trident's Container Storage Interface (CSI) driver for Azure NetApp Files to abstract underlying details and create, expand, and snapshot volumes on-demand. Also, using Astra Trident enables you to use [Astra Control Service][astra-control-service] built on top of Astra Trident. Using the Astra Control Service, you can backup, recover, move, and manage the application-data lifecycle of your AKS workloads across clusters within and across Azure regions to meet your business and service continuity needs.

## Before you begin

The following considerations apply when you use Azure NetApp Files:

* Your AKS cluster must be [in a region that supports Azure NetApp Files][anf-regions].
* The Azure CLI version 2.0.59 or higher installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* After the initial deployment of an AKS cluster, you can choose to provision Azure NetApp Files volumes statically or dynamically.
* To use dynamic provisioning with Azure NetApp Files with Network File System (NFS), install and configure [Astra Trident][astra-trident] version 19.07 or higher. To use dynamic provisioning with Azure NetApp Files with Secure Message Block (SMB), install and configure Astra Trident version 22.10 or higher. Dynamic provisioning for SMB shares is only supported on windows worker nodes.
* Before you deploy Azure NetApp Files SMB volumes, you must identify the AD DS integration requirements for Azure NetApp Files to ensure that Azure NetApp Files is well connected to AD DS. For more information, see [Understand guidelines for Active Directory Domain Services site design and planning](../azure-netapp-files/understand-guidelines-active-directory-domain-service-site.md). Both the AKS cluster and Azure NetApp Files must have connectivity to the same AD. 

## Configure Azure NetApp Files

This section describes how to set up Azure NetApp Files for AKS workloads. It is applicable for all scenarios within this article. 

1. Define variables for later usage. Replace *myresourcegroup*, *mylocation*, *myaccountname*, *mypool1*, *poolsize*, *premium*, *myvnett*, *myANFSubnet*, and *myprefix* with appropriate values for your environment.

    ```azurecli-interactive
    RESOURCE_GROUP="myresourcegroup"
    LOCATION="mylocation"
    ANF_ACCOUNT_NAME="myaccountname"
    POOL_NAME="mypool1"
    SIZE="poolsize" # Size in Azure CLI needs to be in TiB unit (minimum of 4TiB)
    SERVICE_LEVEL="premium" # Valid values are Standard, Premium and Ultra
    VNET_NAME="myvnet"
    SUBNET_NAME="myANFSubnet"
    ADDRESS_PREFIX="myprefix"
    ```
    
1. Register the *Microsoft.NetApp* resource provider by running the following command:

    ```azurecli-interactive
    az provider register --namespace Microsoft.NetApp --wait
    ```

    > [!NOTE]
    > This operation can take several minutes to complete.

2. Create a new account by using command [`az netappfiles account create`](/cli/azure/netappfiles/account?view=azure-cli-latest#az-netappfiles-account-create). When you create an Azure NetApp account for use with AKS, you can create the account in an existing resource group or create a new one in the same region as the AKS cluster.

    ```azurecli-interactive
    az netappfiles account create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME
    ```

3. Create a new capacity pool by using [az netappfiles pool create][az-netappfiles-pool-create]. Replace the variables shown in the command with your Azure NetApp Files information. The `account_name` should be the same as created in the step above.

    ```azurecli-interactive
    az netappfiles pool create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --size $SIZE \
        --service-level $SERVICE_LEVEL
    ```

4. Create a subnet to [delegate to Azure NetApp Files][anf-delegate-subnet] using [az network vnet subnet create][az-network-vnet-subnet-create]. Specify the resource group hosting the existing virtual network for your AKS cluster. Replace the variables shown in the command with your Azure NetApp Files information. 

    > [!NOTE]
    > This subnet must be in the same virtual network as your AKS cluster.

    ```azurecli-interactive
    az network vnet subnet create \
        --resource-group $RESOURCE_GROUP \
        --vnet-name $VNET_NAME \
        --name $SUBNET_NAME \
        --delegations "Microsoft.NetApp/volumes" \
        --address-prefixes $ADDRESS_PREFIX
    ```

   Volumes within the capacity pool can either be provisioned statically or dynamically. Both options are covered further in the next sections.

## Provision Azure NetApp Files volumes statically

Azure NetApp Files supports both the NFS and the SMB protocol types. For details about provisioning the volumes statically for NFS, see the [Configure statically for applications that use NFS](#configure-statically-for-applications-that-use-nfs) section. For details about provisioning the volumes statically for SMB, see the [Configure statically for applications that use SMB](#configure-statically-for-applications-that-use-smb-volumes) section.  

### Configure statically for applications that use NFS

This section describes how to create a NFS volume on Azure NetApp Files and expose the volume statically to Kubernetes. It also describes how to use the volume with a containerized application.

#### Create an NFS volume

1. Define variables for later usage. Replace *myfilepath*, *myvolsize*, *myvolname*, abd *virtnetid* with an appropriate value for your environment. Note that the filepath must be unique within all ANF accounts.

    ```azurecli-interactive
    UNIQUE_FILE_PATH="myfilepath"
    VOLUME_SIZE_GIB="myvolsize"
    VOLUME_NAME="myvolname"
    VNET_ID="vnetId"
    SUBNET_ID="anfSubnetId"
    ```

1. Create a volume using the `az netappfiles volume create`(/cli/azure/netappfiles/volume?view=azure-cli-latest#az-netappfiles-volume-create) command. For more information, see [Create an NFS volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes.md). 

    ```azurecli-interactive
    az netappfiles volume create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --name "$VOLUME_NAME" \
        --service-level $SERVICE_LEVEL \
        --vnet $VNET_ID \
        --subnet $SUBNET_ID \
        --usage-threshold $VOLUME_SIZE_GIB \
        --file-path $UNIQUE_FILE_PATH \
        --protocol-types NFSv3
    ```

#### Create the persistent volume (NFS)

1. List the details of your volume using [az netappfiles volume show][az-netappfiles-volume-show]. Replace the variables with appropriate values from your Azure NetApp Files account and environment. 

    ```azurecli-interactive
    az netappfiles volume show \
        --resource-group $RESOURCE_GROUP \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --volume-name "$VOLUME_NAME -o JSON
    ```

    The following output is an example of the above command executed with real values. 

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

2. Create a file named `pv-nfs.yaml` and copy in the following YAML. Make sure the server matches the output IP address from the step above, and the path matches the output from `creationToken` above. The capacity must also match the volume size from the step above.

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

4. Verify the *Status* of the `PersistentVolume` is *Available* by using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pv pv-nfs
    ```

#### Create a persistent volume claim (NFS)

1. Create a file named `pvc-nfs.yaml` and copy in the following YAML. This manifest creates a PVC named `pvc-nfs` for 100Gi Storage and `ReadWriteMany` access mode, matching the PV created above.

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
          storage: 100Gi
    ```

2. Create the persistent volume claim using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f pvc-nfs.yaml
    ```

3. Verify the *Status* of the persistent volume claim is *Bound* by using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pvc pvc-nfs
    ```

#### Mount with a pod (NFS)

1. Create a file named `nginx-nfs.yaml` and copy in the following YAML. This manifest defines a `nginx` pod that uses the persistent volume claim. 

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

3. Verify the pod is *Running* by using the [kubectl describe][kubectl-describe] command:

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

### Configure statically for applications that use SMB volumes 

This section describes how to create a SMB volume on Azure NetApp Files and expose the volume statically to Kubernetes for a containerized application to consume.

#### Create an SMB Volume

1. Define variables for later usage. Replace *myfilepath*, *myvolsize*, *myvolname*, and *virtnetid* with an appropriate value for your environment. The filepath must be unique within all ANF accounts.

    ```azurecli-interactive
    Azure CLICopy
    UNIQUE_FILE_PATH="myfilepath"
    VOLUME_SIZE_GIB="myvolsize"
    VOLUME_NAME="myvolname"
    VNET_ID="vnetId"
    SUBNET_ID="anfSubnetId"
    ```

1. Create a volume using the [`az netappfiles volume create`](cli/azure/netappfiles/volume?view=azure-cli-latest#az-netappfiles-volume-create) command. 

    ```azurecli-interactive
    az netappfiles volume create \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --name "$VOLUME_NAME" \
        --service-level $SERVICE_LEVEL \
        --vnet $VNET_ID \
        --subnet $SUBNET_ID \
        --usage-threshold $VOLUME_SIZE_GIB \
        --file-path $UNIQUE_FILE_PATH \
        --protocol-types CIFS
    ```

#### Create a secret with the domain credentials

1. Create a secret on your AKS cluster to access the AD server using the [`kubectl create secret`](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/) command. This secret will be used by the Kubernetes persistent volume to access the Azure NetApp Files SMB volume. Use the following command to create the secret, replacing `USERNAME` with your username, `PASSWORD` with your password, and `DOMAIN_NAME` with your domain name for your Active Directory.

    ```bash
        kubectl create secret generic smbcreds --from-literal=username=USERNAME --from-literal=password="PASSWORD" --from-literal=domain='DOMAIN_NAME'
    ```

2. Check the secret has been created.

    ```bash
       kubectl get secret
       NAME       TYPE     DATA   AGE
       smbcreds   Opaque   2      20h
    ```

#### Install an SMB CSI driver

You must install a Container Storage Interface (CSI) driver to create a Kubernetes SMB `PersistentVolume`. 

1.	Install the SMB CSI driver on your cluster using helm. Be sure to set the `windows.enabled` option to `true`:

    ```bash
    helm repo add csi-driver-smb https://raw.githubusercontent.com/kubernetes-csi/csi-driver-smb/master/charts   
    helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.10.0 –-set windows.enabled=true
    ```

    For other methods of installing the SMB CSI Driver, see [Install SMB CSI driver master version on a Kubernetes cluster](https://github.com/kubernetes-csi/csi-driver-smb/blob/master/docs/install-csi-driver-master.md). 

2.	Verify that the csi-smb controller pod is running and each worker node has a pod running using the kubectl get pods command:   

    ```bash
    kubectl get pods -n kube-system | grep csi-smb
    
    csi-smb-controller-68df7b4758-xf2m9   3/3     Running   0          3m46s
    csi-smb-node-s6clj                    3/3     Running   0          3m47s
    csi-smb-node-win-tfxvk                3/3     Running   0          3m47s
    ```

#### Create the persistent volume (SMB)

1. List the details of your volume using [`az netappfiles volume show`](/cli/azure/netappfiles/volume?view=azure-cli-latest#az-netappfiles-volume-show). Replace the variables with appropriate values from your Azure NetApp Files account and environment. 

    ```azurecli-interactive
    az netappfiles volume show \
        --resource-group $RESOURCE_GROUP \
        --account-name $ANF_ACCOUNT_NAME \
        --pool-name $POOL_NAME \
        --volume-name "$VOLUME_NAME -o JSON
    ```

    The following output is an example of the above command executed with real values. 

    ```bash
    {
      ...
      "creationToken": "myvolname",
      ...
      "mountTargets": [
        {
          ...
          "
             "smbServerFqdn": "ANF-1be3.contoso.com",
          ...
        }
      ],
      ...
    }
    ```

2. Create a file named `pv-smb.yaml` and copy in the following YAML. If necessary, replace `myvolname` with the `creationToken` and replace `ANF-1be3.contoso.com\myvolname` with the value of `smbServerFqdn` from the previous step. Be sure to include your AD credentials secret along with the namespace where it is located that you created in a prior step.

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: anf-pv-smb
    spec:
      storageClassName: ""
      capacity:
        storage: 100Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain
      mountOptions:
        - dir_mode=0777
        - file_mode=0777
        - vers=3.0
      csi:
        driver: smb.csi.k8s.io
        readOnly: false
        volumeHandle: myvolname  # make sure it's a unique name in the cluster
        volumeAttributes:
          source: \\ANF-1be3.contoso.com\myvolname
        nodeStageSecretRef:
          name: smbcreds
          namespace: default
    ```

3. Create the persistent volume using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:  

    ```bash
    kubectl apply -f pv-smb.yaml
    ```

4. Verify the Status of the PersistentVolume is Available using the [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:

    ```bash
    kubectl describe pv pv-smb
    ```

#### Create a persistent volume claim (SMB)

1. Create a file name `pvc-smb.yaml` and copy in the following YAML. 

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: anf-pvc-smb
    spec:
      accessModes:
        - ReadWriteMany
      volumeName: pv-smb
      storageClassName: ""
      resources:
        requests:
          storage: 100Gi
    ```

2.	Create the persistent volume claim using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command: 

    ```bash
    kubectl apply -f pvc-smb.yaml
    ```

    Verify the Status of the persistent volume claim is Bound using the kubectl describe command:   

    ```bash
    kubectl describe pvc pvc-smb
    ```

#### Mount with a pod (SMB)

1. Create a file named `iis-smb.yaml` and copy in the following YAML. This file will be used to create an Internet Information Services pod to mount the volume to path `/inetpub/wwwroot`.

    ```yaml
    apiVersion: v1
    kind: Pod 
    metadata:
      name: iis-pod
      labels:
         app: web
    spec:
      nodeSelector:
        "kubernetes.io/os": windows
      volumes:
      - name: smb
        persistentVolumeClaim:
          claimName: anf-pvc-smb 
      containers:
      - name: web
        image: mcr.microsoft.com/windows/servercore/iis:windowsservercore 
        resources:
          limits:
            cpu: 1
            memory: 800M
        ports:
          - containerPort: 80
        volumeMounts:
        - name: smb
          mountPath: "/inetpub/wwwroot"
          readOnly: false
    ```

2. Create the pod using the [kubectl apply][kubectl-apply] command:

    ```bash
    kubectl apply -f iis-smb.yaml
    ```

3. Verify the pod is *Running* and `/inetpub/wwwroot` is mounted from SMB by using the [kubectl describe][kubectl-describe] command:

    ```bash
    kubectl describe pod iis-pod
    ```

    The output of the command resembles the following example:   

    ```output
    Name:         iis-pod
    Namespace:    default
    Priority:     0
    Node:         akswin000001/10.225.5.246
    Start Time:   Fri, 05 May 2023 09:34:41 -0400
    Labels:       app=web
    Annotations:  <none>
    Status:       Running
    IP:           10.225.5.248
    IPs:
      IP:  10.225.5.248
    Containers:
      web:
        Container ID:   containerd://39a1659b6a2b6db298df630237b2b7d959d1b1722edc81ce9b1bc7f06237850c
        Image:          mcr.microsoft.com/windows/servercore/iis:windowsservercore
        Image ID:       mcr.microsoft.com/windows/servercore/iis@sha256:0f0114d0f6c6ee569e1494953efdecb76465998df5eba951dc760ac5812c7409
        Port:           80/TCP
        Host Port:      0/TCP
        State:          Running
          Started:      Fri, 05 May 2023 09:34:55 -0400
        Ready:          True
        Restart Count:  0
        Limits:
          cpu:     1
          memory:  800M
        Requests:
          cpu:        1
          memory:     800M
        Environment:  <none>
        Mounts:
          /inetpub/wwwroot from smb (rw)
          /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-mbnv8 (ro)
    ...
    ```

4. Verify your volume has been mounted on the pod by using [kubectl exec][kubectl-exec] to connect to the pod, and then use `df -h` command in the correct directory to check if the volume is mounted and the size matches the size of the volume you provisioned. 

    ```bash
    kubectl exec -it iis-pod –- cmd.exe
    ```
    The output of the command resembles the following example:   

    ```output
    Microsoft Windows [Version 10.0.20348.1668]
    (c) Microsoft Corporation. All rights reserved.
    
    C:\>cd /inetpub/wwwroot
    
    C:\inetpub\wwwroot>dir
     Volume in drive C has no label.
     Volume Serial Number is 86BB-AA55
    
     Directory of C:\inetpub\wwwroot
    
    05/04/2023  08:15 PM    <DIR>          .
    05/04/2023  08:15 PM    <DIR>          ..
               0 File(s)              0 bytes
               2 Dir(s)  107,373,838,336 bytes free
    ```

## Provision Azure NetApp Files volumes dynamically

Astra Trident may be used to dynamically provision NFS or SMB files on Azure NetApp Files. Dynamically provisioned SMB volumes are only supported with windows worker nodes.

### Configure dynamically for applications that use NFS 

This section describes how to use Astra Trident to dynamically create a NFS volume on Azure NetApp Files and automatically mount it to a containerized application. 

#### Install Astra Trident (NFS) 

To dynamically provision NFS volumes, you need to install Astra Trident. Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) driver. Astra Trident deploys on Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.   

Trident can be installed using the Trident operator (manually or using [Helm](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html)) or [`tridentctl`](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html). The instructions provided later in this article explain how Astra Trident can be installed using Helm. To learn more about these installation methods and how they work, see the [Astra Trident Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).

##### Install Astra Trident using Helm (NFS)

[Helm](https://helm.sh/) must be installed on your workstation to install Astra Trident using this method. For other methods of installing Astra Trident, see the [Astra Trident Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).

To install Astra Trident using Helm for a cluster with only linux worker nodes, run the following commands:   

    ```bash
    helm repo add netapp-trident https://netapp.github.io/trident-helm-chart   

    helm install trident netapp-trident/trident-operator --version 23.04.0  --create-namespace --namespace trident
    ``` 
The output of the command resembles the following example:   

    ```output
    NAME: trident
    LAST DEPLOYED: Fri May  5 13:55:36 2023
    NAMESPACE: trident
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    Thank you for installing trident-operator, which will deploy and manage NetApp's Trident CSI
    storage provisioner for Kubernetes.
    
    Your release is named 'trident' and is installed into the 'trident' namespace.
    Please note that there must be only one instance of Trident (and trident-operator) in a Kubernetes cluster.
    
    To configure Trident to manage storage resources, you will need a copy of tridentctl, which is available in pre-packaged Trident releases.  You may find all Trident releases and source code online at https://github.com/NetApp/trident. 
    
    To learn more about the release, try:
    
      $ helm status trident
      $ helm get all trident
    ``` 

3.	To confirm Astra Trident was installed successfully, run the following [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:

    ```bash
    kubectl describe torc trident
    ```

    The output of the command resembles the following example:   

    ```output 
    Name:         trident
    Namespace:    
    Labels:       app.kubernetes.io/managed-by=Helm
    Annotations:  meta.helm.sh/release-name: trident
                  meta.helm.sh/release-namespace: trident
    API Version:  trident.netapp.io/v1
    Kind:         TridentOrchestrator
    Metadata:
        ...
    Spec:
      IPv6:                  false
      Autosupport Image:     docker.io/netapp/trident-autosupport:23.04
      Autosupport Proxy:     <nil>
      Disable Audit Log:     true
      Enable Force Detach:   false
      Http Request Timeout:  90s
      Image Pull Policy:     IfNotPresent
      k8sTimeout:            0
      Kubelet Dir:           <nil>
      Log Format:            text
      Log Layers:            <nil>
      Log Workflows:         <nil>
      Namespace:             trident
      Probe Port:            17546
      Silence Autosupport:   false
      Trident Image:         docker.io/netapp/trident:23.04.0
      Windows:               false
    Status:
      Current Installation Params:
        IPv6:                       false
        Autosupport Hostname:       
        Autosupport Image:          docker.io/netapp/trident-autosupport:23.04
        Autosupport Proxy:          
        Autosupport Serial Number:  
        Debug:                      false
        Disable Audit Log:          true
        Enable Force Detach:        false
        Http Request Timeout:       90s
        Image Pull Policy:          IfNotPresent
        Image Pull Secrets:
        Image Registry:       
        k8sTimeout:           30
        Kubelet Dir:          /var/lib/kubelet
        Log Format:           text
        Log Layers:           
        Log Level:            info
        Log Workflows:        
        Probe Port:           17546
        Silence Autosupport:  false
        Trident Image:        docker.io/netapp/trident:23.04.0
      Message:                Trident installed
      Namespace:              trident
      Status:                 Installed
      Version:                v23.04.0
    Events:
      Type    Reason      Age    From                        Message
      ----    ------      ----   ----                        -------
      Normal  Installing  2m59s  trident-operator.netapp.io  Installing Trident
      Normal  Installed   2m31s  trident-operator.netapp.io  Trident installed
    ``` 

#### Create a backend (NFS)  

To instruct Astra Trident about the Azure NetApp Files subscription and where it needs to create volumes, a backend is created. This step requires details about the account that was created in a previous step. 

1. Create a file named `backend-secret.yaml` and copy in the following YAML. Change the `Client ID` and `clientSecret` to the correct values for your environment.

    ```yaml    
    kind: Secret
    metadata:
      name: backend-tbc-anf-secret
    type: Opaque
    stringData:
      clientID: abcde356-bf8e-fake-c111-abcde35613aa
      clientSecret: rR0rUmWXfNioN1KhtHisiSAnoTherboGuskey6pU
    ```

2. Create a file named `backend-anf.yaml` and copy in the following YAML. Change the `subscriptionID`, `tenantID`, `location`, and `serviceLevel` to the correct values for your environment. Use the `subscriptionID` for the Azure subscription where Azure NetApp Files is enabled. Obtain the `tenantID`, `clientID`, and `clientSecret` from an App Registration in Azure Active Directory (AD) with sufficient permissions for the Azure NetApp Files service. The App Registration includes the Owner or Contributor role that's predefined by Azure. The location must be an Azure location that contains at least one delegated subnet created in a previous step. The serviceLevel must match the service level configured for the capacity pool in a previous step in the [Configure Azure NetApp Files](#configure-azure-netapp-files) section.

    ```yaml
    apiVersion: trident.netapp.io/v1
    kind: TridentBackendConfig
    metadata:
      name: backend-tbc-anf
    spec:
      version: 1
      storageDriverName: azure-netapp-files
      subscriptionID: 12abc678-4774-fake-a1b2-a7abcde39312
      tenantID: a7abcde3-edc1-fake-b111-a7abcde356cf
      location: eastus
      serviceLevel: Premium
      credentials:
        name: backend-tbc-anf-secret
    ```

    For more information about backends, see [Azure NetApp Files backend configuration options and examples](https://docs.netapp.com/us-en/trident/trident-use/anf-examples.html). 

3. Create the secret and backend using the kubectl apply command:

    ```bash
    kubectl apply -f backend-secret.yaml -n trident
    ```

    The output of the command resembles the following:   

    ```output 
    secret/backend-tbc-anf-secret created
    ```

    ```bash
    kubectl apply -f backend-anf.yaml -n trident
    ```

    The output of the command resembles the following:   

    ```output 
    tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
    ```

4. Confirm the backend was created by using the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:

    ```bash
     Kubectl get tridentbackends -n trident
    ```

    The output of the command resembles the following example:   

    ```output
    NAME        BACKEND               BACKEND UUID
    tbe-kfrdh   backend-tbc-anf   8da4e926-9dd4-4a40-8d6a-375aab28c566
    ```

#### Create a StorageClass (NFS)

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume Azure NetApp Files volumes, a storage class must be created. 

1.	Create a file named `anf-storageclass.yaml` and copy in the following YAML:

    ```yml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: azure-netapp-files
    provisioner: csi.trident.netapp.io
    parameters:
      backendType: "azure-netapp-files"
      fsType: "nfs"
    ```

2. Create the storage class using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:   

    ```bash
    kubectl apply -f anf-storageclass.yaml
    ```

    The output of the command resembles the following example:   

    ```output
    storageclass/azure-netapp-files created
    ```

3.	Run the kubectl get command to view the status of the storage class: 

    ```bash
    kubectl get sc
    NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
    azure-netapp-files   csi.trident.netapp.io   Delete          Immediate           false                  
    ```

#### Create a persistent volume claim (NFS)

A persistent volume claim (PVC) is a request for storage by a user. Upon the creation of a persistent volume claim, Astra Trident automatically creates an Azure NetApp Files volume and makes it available for Kubernetes workloads to consume. 

1.	Create a file named `anf-pvc.yaml` and copy in the following YAML. In this example, a 1-TiB volume is needed with ReadWriteMany access.

    ```yml
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

2. Create the persistent volume claim with the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:

    ```bash
    kubectl apply -f anf-pvc.yaml
    ```

  The output of the command resembles the following example:   

    ```output    
    persistentvolumeclaim/anf-pvc created
    ```

3. To view information about the persistent volume claim, run the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:   

    ```bash
    kubectl get pvc
    ```
    The output of the command resembles the following example:   

    ```output  
    kubectl get pvc -n trident
    NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS         AGE
    anf-pvc   Bound    pvc-bffa315d-3f44-4770-86eb-c922f567a075   1Ti        RWO            azure-netapp-files   62s
    ```  

#### Use the persistent volume (NFS) 

After the PVC is created, Astra Trident creates the persistent volume. A pod can be spun up to mount and access the Azure NetApp Files volume. 

The following manifest can be used to define an NGINX pod that mounts the Azure NetApp Files volume created in the previous step. In this example, the volume is mounted at `/mnt/data`.

1. Create a file named anf-nginx-pod.yaml and copy in the following YAML:   

    ```yml
    ymlCopy
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

2.	Create the pod using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:  

    ```bash
    kubectl apply -f anf-nginx-pod.yaml
    ```

    The output of the command resembles the following example:   

    ```output
    pod/nginx-pod created
    ``` 

    Kubernetes has created a pod with the volume mounted and accessible within the nginx container at `/mnt/data`. You can confirm by checking the event logs for the pod using [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:   

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

### Configure dynamically for applications that use SMB 

This section covers how to use Astra Trident to dynamically create a SMB volume on Azure NetApp Files and automatically mount it to a containerized windows application.  

#### Install Astra Trident (SMB)

To dynamically provision SMB volumes, you need to install Astra Trident version 22.10 or later. Dynamically provisioning SMB volumes requires windows worker nodes. 

Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) driver. Astra Trident deploys on Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.

Trident can be installed using the Trident operator (manually or using [Helm](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html)) or [`tridentctl`](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html). The instructions provided later in this article explain how Astra Trident can be installed using Helm. To learn more about these installation methods and how they work, see the [Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).


#### Install Astra Trident using Helm (SMB)  

[Helm](https://helm.sh/) must be installed on your workstation to install Astra Trident using this method. For other methods of installing Astra Trident, see the [Astra Trident Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html). If you have windows worker nodes in the cluster, ensure to enable windows with any installation method. 

1. To install Astra Trident using Helm for a cluster with windows worker nodes, run the following commands:  

    ```bash
    helm repo add netapp-trident https://netapp.github.io/trident-helm-chart

    helm install trident netapp-trident/trident-operator --version 23.04.0  --create-namespace --namespace trident –-set windows=true
    ```

    The output of the command resembles the following example:   

    ```output
    NAME: trident
    LAST DEPLOYED: Fri May  5 14:23:05 2023
    NAMESPACE: trident
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    Thank you for installing trident-operator, which will deploy and manage NetApp's Trident CSI
    storage provisioner for Kubernetes.
    

    Your release is named 'trident' and is installed into the 'trident' namespace.
    Please note that there must be only one instance of Trident (and trident-operator) in a Kubernetes cluster.
    
    To configure Trident to manage storage resources, you will need a copy of tridentctl, which is available in pre-packaged Trident releases.  You may find all Trident releases and source code online at https://github.com/NetApp/trident.
    
    To learn more about the release, try:
    
      $ helm status trident
      $ helm get all trident
    ```     

2.  To confirm Astra Trident was installed successfully, run the following kubectl describe command:   

    ```bash
    kubectl describe torc trident
    ```

    The output of the command resembles the following example:

    ```output
    Name:         trident
	    Namespace:    
	    Labels:       app.kubernetes.io/managed-by=Helm
    Annotations:  meta.helm.sh/release-name: trident
                  meta.helm.sh/release-namespace: trident
    API Version:  trident.netapp.io/v1
    Kind:         TridentOrchestrator
    Metadata:
        ...
    Spec:
      IPv6:                  false
      Autosupport Image:     docker.io/netapp/trident-autosupport:23.04
      Autosupport Proxy:     <nil>
      Disable Audit Log:     true
      Enable Force Detach:   false
      Http Request Timeout:  90s
      Image Pull Policy:     IfNotPresent
      k8sTimeout:            0
      Kubelet Dir:           <nil>
      Log Format:            text
      Log Layers:            <nil>
      Log Workflows:         <nil>
      Namespace:             trident
      Probe Port:            17546
      Silence Autosupport:   false
      Trident Image:         docker.io/netapp/trident:23.04.0
      Windows:               true
    Status:
      Current Installation Params:
        IPv6:                       false
        Autosupport Hostname:       
        Autosupport Image:          docker.io/netapp/trident-autosupport:23.04
        Autosupport Proxy:          
        Autosupport Serial Number:  
        Debug:                      false
        Disable Audit Log:          true
        Enable Force Detach:        false
        Http Request Timeout:       90s
        Image Pull Policy:          IfNotPresent
        Image Pull Secrets:
        Image Registry:       
        k8sTimeout:           30
        Kubelet Dir:          /var/lib/kubelet
        Log Format:           text
        Log Layers:           
        Log Level:            info
        Log Workflows:        
        Probe Port:           17546
        Silence Autosupport:  false
        Trident Image:        docker.io/netapp/trident:23.04.0
      Message:                Trident installed
      Namespace:              trident
      Status:                 Installed
      Version:                v23.04.0
    Events:
      Type    Reason      Age   From                        Message
      ----    ------      ----  ----                        -------
      Normal  Installing  74s   trident-operator.netapp.io  Installing Trident
      Normal  Installed   46s   trident-operator.netapp.io  Trident installed
    ```

#### Create a backend (SMB)


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


#### Install and configure Astra Trident

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
    
 3. To confirm backend was set with correct credentials and sufficient permissions, run the following [kubectl describe][kubectl-describe] command: 
    ```bash
    kubectl describe tridentbackendconfig.trident.netapp.io/backend-tbc-anf -n trident
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
