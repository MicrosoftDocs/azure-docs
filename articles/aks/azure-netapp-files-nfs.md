---
title: Provision Azure NetApp Files NFS volumes for Azure Kubernetes Service
description: Describes how to statically and dynamically provision Azure NetApp Files NFS volumes for Azure Kubernetes Service.
ms.topic: article
ms.custom: devx-track-azurecli
ms.subservice: aks-storage
ms.date: 05/08/2023
---

# Provision Azure NetApp Files NFS volumes for Azure Kubernetes Service

After you [configure Azure NetApp Files for Azure Kubernetes Service](azure-netapp-files.md), you can provision Azure NetApp Files volumes for Azure Kubernetes Service. 

Azure NetApp Files supports volumes using NFS (NFSv3 or NFSv4.1), [SMB](azure-netapp-files-smb.md), or [dual-protocol](azure-netapp-files-dual-protocol.md) (NFSv3 and SMB, or NFSv4.1 and SMB). 
* This article describes details for provisioning NFS volumes statically or dynamically. 
* For information about provisioning SMB volumes statically or dynamically, see [Provision Azure NetApp Files SMB volumes for Azure Kubernetes Service](azure-netapp-files-smb.md).
* For information about provisioning dual-protocol volumes statically, see [Provision Azure NetApp Files dual-protocol volumes for Azure Kubernetes Service](azure-netapp-files-dual-protocol.md)

## Statically configure for applications that use NFS volumes

This section describes how to create an NFS volume on Azure NetApp Files and expose the volume statically to Kubernetes. It also describes how to use the volume with a containerized application.

### Create an NFS volume

1. Define variables for later usage. Replace *myresourcegroup*, *mylocation*, *myaccountname*, *mypool1*, *premium*, *myfilepath*, *myvolsize*, *myvolname*, *vnetid*, and *anfSubnetID* with an appropriate value from your account and environment. The *filepath* must be unique within all ANF accounts.

    ```azurecli-interactive
    RESOURCE_GROUP="myresourcegroup"
    LOCATION="mylocation"
    ANF_ACCOUNT_NAME="myaccountname"
    POOL_NAME="mypool1"
    SERVICE_LEVEL="premium" # Valid values are Standard, Premium, and Ultra
    UNIQUE_FILE_PATH="myfilepath"
    VOLUME_SIZE_GIB="myvolsize"
    VOLUME_NAME="myvolname"
    VNET_ID="vnetId"
    SUBNET_ID="anfSubnetId"
    ```

1. Create a volume using the [`az netappfiles volume create`](/cli/azure/netappfiles/volume#az-netappfiles-volume-create) command. For more information, see [Create an NFS volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes.md). 

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

### Create the persistent volume

1. List the details of your volume using [`az netappfiles volume show`](/cli/azure/netappfiles/volume#az-netappfiles-volume-show) command. Replace the variables with appropriate values from your Azure NetApp Files account and environment if not defined in a previous step.

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

2. Create a file named `pv-nfs.yaml` and copy in the following YAML. Make sure the server matches the output IP address from Step 1, and the path matches the output from `creationToken` above. The capacity must also match the volume size from the step above.

    ```yaml
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

3. Create the persistent volume using the [`kubectl apply`][kubectl-apply] command:

    ```bash
    kubectl apply -f pv-nfs.yaml
    ```

4. Verify the status of the persistent volume is *Available* by using the [`kubectl describe`][kubectl-describe] command:

    ```bash
    kubectl describe pv pv-nfs
    ```

### Create a persistent volume claim

1. Create a file named `pvc-nfs.yaml` and copy in the following YAML. This manifest creates a PVC named `pvc-nfs` for 100Gi storage and `ReadWriteMany` access mode, matching the PV you created.

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

2. Create the persistent volume claim using the [`kubectl apply`][kubectl-apply] command:

    ```bash
    kubectl apply -f pvc-nfs.yaml
    ```

3. Verify the *Status* of the persistent volume claim is *Bound* by using the [`kubectl describe`][kubectl-describe] command:

    ```bash
    kubectl describe pvc pvc-nfs
    ```

### Mount with a pod

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

2. Create the pod using the [`kubectl apply`][kubectl-apply] command:

    ```bash
    kubectl apply -f nginx-nfs.yaml
    ```

3. Verify the pod is *Running* by using the [`kubectl describe`][kubectl-describe] command:

    ```bash
    kubectl describe pod nginx-nfs
    ```

4. Verify your volume has been mounted on the pod by using [`kubectl exec`][kubectl-exec] to connect to the pod, and then use `df -h` to check if the volume is mounted.

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

## Dynamically configure for applications that use NFS volumes

Astra Trident may be used to dynamically provision NFS or SMB files on Azure NetApp Files. Dynamically provisioned SMB volumes are only supported with windows worker nodes.

This section describes how to use Astra Trident to dynamically create an NFS volume on Azure NetApp Files and automatically mount it to a containerized application. 

### Install Astra Trident

To dynamically provision NFS volumes, you need to install Astra Trident. Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) driver. Astra Trident deploys on Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.   

Trident can be installed using the Trident operator (manually or using [Helm](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html)) or [`tridentctl`](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html). To learn more about these installation methods and how they work, see the [Astra Trident Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).

#### Install Astra Trident using Helm

[Helm](https://helm.sh/) must be installed on your workstation to install Astra Trident using this method. For other methods of installing Astra Trident, see the [Astra Trident Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).

1. To install Astra Trident using Helm for a cluster with only Linux worker nodes, run the following commands:   

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
    Thank you for installing trident-operator, which will deploy and manage NetApp's Trident CSI storage provisioner for Kubernetes.
    
    Your release is named 'trident' and is installed into the 'trident' namespace.
    Please note that there must be only one instance of Trident (and trident-operator) in a Kubernetes cluster.
    
    To configure Trident to manage storage resources, you will need a copy of tridentctl, which is available in pre-packaged Trident releases.  You may find all Trident releases and source code online at https://github.com/NetApp/trident. 
    
    To learn more about the release, try:
    
        $ helm status trident
          $ helm get all trident
    ``` 

2. To confirm Astra Trident was installed successfully, run the following [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:

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

### Create a backend

To instruct Astra Trident about the Azure NetApp Files subscription and where it needs to create volumes, a backend is created. This step requires details about the account that was created in a previous step. 

1. Create a file named `backend-secret.yaml` and copy in the following YAML. Change the `Client ID` and `clientSecret` to the correct values for your environment.

    ```yaml    
    apiVersion: v1
    kind: Secret
    metadata:
      name: backend-tbc-anf-secret
    type: Opaque
    stringData:
      clientID: abcde356-bf8e-fake-c111-abcde35613aa
      clientSecret: rR0rUmWXfNioN1KhtHisiSAnoTherboGuskey6pU
    ```

2. Create a file named `backend-anf.yaml` and copy in the following YAML. Change the `subscriptionID`, `tenantID`, `location`, and `serviceLevel` to the correct values for your environment. Use the `subscriptionID` for the Azure subscription where Azure NetApp Files is enabled. Obtain the `tenantID`, `clientID`, and `clientSecret` from an [application registration](../active-directory/develop/howto-create-service-principal-portal.md) in Microsoft Entra ID with sufficient permissions for the Azure NetApp Files service. The application registration includes the Owner or Contributor role predefined by Azure. The location must be an Azure location that contains at least one delegated subnet created in a previous step. The `serviceLevel` must match the `serviceLevel` configured for the capacity pool in [Configure Azure NetApp Files for AKS workloads](azure-netapp-files.md#configure-azure-netapp-files-for-aks-workloads).

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

3. Apply the secret and backend using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command. First apply the secret:

    ```bash
    kubectl apply -f backend-secret.yaml -n trident
    ```

    The output of the command resembles the following example:   

    ```output 
    secret/backend-tbc-anf-secret created
    ```
   Apply the backend: 

    ```bash
    kubectl apply -f backend-anf.yaml -n trident
    ```

    The output of the command resembles the following example:   

    ```output 
    tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
    ```

4. Confirm the backend was created by using the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:

    ```bash
     kubectl get tridentbackends -n trident
    ```

    The output of the command resembles the following example:   

    ```output
    NAME        BACKEND               BACKEND UUID
    tbe-kfrdh   backend-tbc-anf   8da4e926-9dd4-4a40-8d6a-375aab28c566
    ```

### Create a storage class

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume Azure NetApp Files volumes, a storage class must be created. 

1.	Create a file named `anf-storageclass.yaml` and copy in the following YAML:

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

2. Create the storage class using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:   

    ```bash
    kubectl apply -f anf-storageclass.yaml
    ```

    The output of the command resembles the following example:   

    ```output
    storageclass/azure-netapp-files created
    ```

3.	Run the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to view the status of the storage class: 

    ```bash
    kubectl get sc
    NAME                 PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
    azure-netapp-files   csi.trident.netapp.io   Delete          Immediate           false                  
    ```

### Create a PVC

A persistent volume claim (PVC) is a request for storage by a user. Upon the creation of a persistent volume claim, Astra Trident automatically creates an Azure NetApp Files volume and makes it available for Kubernetes workloads to consume. 

1.	Create a file named `anf-pvc.yaml` and copy in the following YAML. In this example, a 1-TiB volume is needed with ReadWriteMany access.

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

### Use the persistent volume

After the PVC is created, Astra Trident creates the persistent volume. A pod can be spun up to mount and access the Azure NetApp Files volume. 

The following manifest can be used to define an NGINX pod that mounts the Azure NetApp Files volume created in the previous step. In this example, the volume is mounted at `/mnt/data`.

1. Create a file named `anf-nginx-pod.yaml` and copy in the following YAML:   

    ```yaml
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

    Kubernetes has created a pod with the volume mounted and accessible within the `nginx` container at `/mnt/data`. You can confirm by checking the event logs for the pod using [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:   

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
