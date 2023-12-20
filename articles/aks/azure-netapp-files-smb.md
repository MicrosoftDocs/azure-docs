---
title: Provision Azure NetApp Files SMB volumes for Azure Kubernetes Service
description: Describes how to statically and dynamically provision Azure NetApp Files SMB volumes for Azure Kubernetes Service.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 05/08/2023
---

# Provision Azure NetApp Files SMB volumes for Azure Kubernetes Service

After you [configure Azure NetApp Files for Azure Kubernetes Service](azure-netapp-files.md), you can provision Azure NetApp Files volumes for Azure Kubernetes Service. 

Azure NetApp Files supports volumes using [NFS](azure-netapp-files-nfs.md) (NFSv3 or NFSv4.1), SMB, and [dual-protocol](azure-netapp-files-dual-protocol.md) (NFSv3 and SMB, or NFSv4.1 and SMB). 
* This article describes details for provisioning SMB volumes statically or dynamically. 
* For information about provisioning NFS volumes statically or dynamically, see [Provision Azure NetApp Files NFS volumes for Azure Kubernetes Service](azure-netapp-files-nfs.md).
* For information about provisioning dual-protocol volumes statically, see [Provision Azure NetApp Files dual-protocol volumes for Azure Kubernetes Service](azure-netapp-files-dual-protocol.md)

## Statically configure for applications that use SMB volumes 

This section describes how to create an SMB volume on Azure NetApp Files and expose the volume statically to Kubernetes for a containerized application to consume.

### Create an SMB Volume

1. Define variables for later usage. Replace *myresourcegroup*, *mylocation*, *myaccountname*, *mypool1*, *premium*, *myfilepath*, *myvolsize*, *myvolname*, and *virtnetid* with an appropriate value for your environment. The filepath must be unique within all ANF accounts.

    ```azurecli-interactive
    RESOURCE_GROUP="myresourcegroup"
    LOCATION="mylocation"
    ANF_ACCOUNT_NAME="myaccountname"
    POOL_NAME="mypool1"
    SERVICE_LEVEL="premium" # Valid values are standard, premium, and ultra
    UNIQUE_FILE_PATH="myfilepath"
    VOLUME_SIZE_GIB="myvolsize"
    VOLUME_NAME="myvolname"
    VNET_ID="vnetId"
    SUBNET_ID="anfSubnetId"
    ```

1. Create a volume using the [`az netappfiles volume create`](/cli/azure/netappfiles/volume#az-netappfiles-volume-create) command. 

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

### Create a secret with the domain credentials

1. Create a secret on your AKS cluster to access the Active Directory (AD) server using the [`kubectl create secret`](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/) command. This secret will be used by the Kubernetes persistent volume to access the Azure NetApp Files SMB volume. Use the following command to create the secret, replacing `USERNAME` with your username, `PASSWORD` with your password, and `DOMAIN_NAME` with your domain name for your AD.

    ```bash
        kubectl create secret generic smbcreds --from-literal=username=USERNAME --from-literal=password="PASSWORD" --from-literal=domain='DOMAIN_NAME'
    ```

2. Check the secret has been created.

    ```bash
       kubectl get secret
       NAME       TYPE     DATA   AGE
       smbcreds   Opaque   2      20h
    ```

### Install an SMB CSI driver

You must install a Container Storage Interface (CSI) driver to create a Kubernetes SMB `PersistentVolume`. 

1.	Install the SMB CSI driver on your cluster using helm. Be sure to set the `windows.enabled` option to `true`:

    ```bash
    helm repo add csi-driver-smb https://raw.githubusercontent.com/kubernetes-csi/csi-driver-smb/master/charts   
    helm install csi-driver-smb csi-driver-smb/csi-driver-smb --namespace kube-system --version v1.10.0 –-set windows.enabled=true
    ```

    For other methods of installing the SMB CSI Driver, see [Install SMB CSI driver master version on a Kubernetes cluster](https://github.com/kubernetes-csi/csi-driver-smb/blob/master/docs/install-csi-driver-master.md). 

2.	Verify that the `csi-smb` controller pod is running and each worker node has a pod running using the [`kubectl get pods`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:   

    ```bash
    kubectl get pods -n kube-system | grep csi-smb
    
    csi-smb-controller-68df7b4758-xf2m9   3/3     Running   0          3m46s
    csi-smb-node-s6clj                    3/3     Running   0          3m47s
    csi-smb-node-win-tfxvk                3/3     Running   0          3m47s
    ```

### Create the persistent volume

1. List the details of your volume using [`az netappfiles volume show`](/cli/azure/netappfiles/volume#az-netappfiles-volume-show). Replace the variables with appropriate values from your Azure NetApp Files account and environment if not defined in a previous step.

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

2. Create a file named `pv-smb.yaml` and copy in the following YAML. If necessary, replace `myvolname` with the `creationToken` and replace `ANF-1be3.contoso.com\myvolname` with the value of `smbServerFqdn` from the previous step. Be sure to include your AD credentials secret along with the namespace where the secret is located that you created in a prior step.

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

4. Verify the status of the persistent volume is *Available* using the [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:

    ```bash
    kubectl describe pv pv-smb
    ```

### Create a persistent volume claim

1. Create a file name `pvc-smb.yaml` and copy in the following YAML. 

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: anf-pvc-smb
    spec:
      accessModes:
        - ReadWriteMany
      volumeName: anf-pv-smb
      storageClassName: ""
      resources:
        requests:
          storage: 100Gi
    ```

2.	Create the persistent volume claim using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command: 

    ```bash
    kubectl apply -f pvc-smb.yaml
    ```

    Verify the status of the persistent volume claim is *Bound* by using the [kubectl describe][kubectl-describe] command:   

    ```bash
    kubectl describe pvc pvc-smb
    ```

### Mount with a pod 

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

2. Create the pod using the [kubectl apply](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:

    ```bash
    kubectl apply -f iis-smb.yaml
    ```

3. Verify the pod is *Running* and `/inetpub/wwwroot` is mounted from SMB by using the [kubectl describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:

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

4. Verify your volume has been mounted on the pod by using the [kubectl exec](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec) command to connect to the pod, and then use `dir` command in the correct directory to check if the volume is mounted and the size matches the size of the volume you provisioned. 

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

## Dynamically configure for applications that use SMB volumes 

This section covers how to use Astra Trident to dynamically create an SMB volume on Azure NetApp Files and automatically mount it to a containerized windows application.  

### Install Astra Trident 

To dynamically provision SMB volumes, you need to install Astra Trident version 22.10 or later. Dynamically provisioning SMB volumes requires windows worker nodes. 

Astra Trident is NetApp's dynamic storage provisioner that is purpose-built for Kubernetes. Simplify the consumption of storage for Kubernetes applications using Astra Trident's industry-standard [Container Storage Interface (CSI)](https://kubernetes-csi.github.io/docs/) driver. Astra Trident deploys on Kubernetes clusters as pods and provides dynamic storage orchestration services for your Kubernetes workloads.

Trident can be installed using the Trident operator (manually or using [Helm](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-operator.html)) or [`tridentctl`](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy-tridentctl.html). To learn more about these installation methods and how they work, see the [Install Guide](https://docs.netapp.com/us-en/trident/trident-get-started/kubernetes-deploy.html).


#### Install Astra Trident using Helm   

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

### Create a backend 

A backend must be created to instruct Astra Trident about the Azure NetApp Files subscription and where it needs to create volumes. For more information about backends, see [Azure NetApp Files backend configuration options and examples](https://docs.netapp.com/us-en/trident/trident-use/anf-examples.html).

1. Create a file named `backend-secret-smb.yaml` and copy in the following YAML. Change the `Client ID` and `clientSecret` to the correct values for your environment.

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

2. Create a file named `backend-anf-smb.yaml` and copy in the following YAML. Change the `ClientID`, `clientSecret`, `subscriptionID`, `tenantID`, `location`, and `serviceLevel` to the correct values for your environment.  The `tenantID`, `clientID`, and `clientSecret` can be found from an application registration in Microsoft Entra ID with sufficient permissions for the Azure NetApp Files service. The application registration includes the Owner or Contributor role predefined by Azure. The Azure location must contain at least one delegated subnet. The `serviceLevel` must match the `serviceLevel` configured for the capacity pool in [Configure Azure NetApp Files for AKS workloads](azure-netapp-files.md#configure-azure-netapp-files-for-aks-workloads).

    ```yaml
    apiVersion: trident.netapp.io/v1
    kind: TridentBackendConfig
    metadata:
      name: backend-tbc-anf-smb
    spec:
      version: 1
      storageDriverName: azure-netapp-files
      subscriptionID: 12abc678-4774-fake-a1b2-a7abcde39312
      tenantID: a7abcde3-edc1-fake-b111-a7abcde356cf
      location: eastus
      serviceLevel: Premium
      credentials:
        name: backend-tbc-anf-secret
      nasType: smb
    ```
3. Create the secret and backend using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command.

   Create the secret: 

    ```bash
    kubectl apply -f backend-secret.yaml -n trident
    ```


    The output of the command resembles the following example:   

    ```output    
    secret/backend-tbc-anf-secret created
    ``` 
   
   
   Create the backend:
    
    ```bash
    kubectl apply -f backend-anf.yaml -n trident
    ```


    The output of the command resembles the following example:   

    ```output   
    tridentbackendconfig.trident.netapp.io/backend-tbc-anf created
    ``` 

4. Verify the backend was created by running the following command:   

    ```bash
    kubectl get tridentbackends -n trident
    ``` 

    The output of the command resembles the following example: 

    ```output   
    NAME        BACKEND               BACKEND UUID
    tbe-9shfq   backend-tbc-anf-smb   09cc2d43-8197-475f-8356-da7707bae203
    ``` 

### Create a secret with the domain credentials for SMB

1. Create a secret on your AKS cluster to access the AD server using the [`kubectl create secret`](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/) command. This information will be used by the Kubernetes persistent volume to access the Azure NetApp Files SMB volume. Use the following command, replacing `DOMAIN_NAME\USERNAME` with your domain name and username and `PASSWORD` with your password. 

    ```bash
    kubectl create secret generic smbcreds --from-literal=username=DOMAIN_NAME\USERNAME –from-literal=password="PASSWORD" 
    ```

2. Verify that the secret has been created.   

    ```bash
    kubectl get secret
    ```

    The output resembles the following example:

    ```output 
    NAME       TYPE     DATA   AGE
    smbcreds   Opaque   2      2h
    ```

### Create a storage class

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. To consume Azure NetApp Files volumes, a storage class must be created.  

1. Create a file named `anf-storageclass-smb.yaml` and copy in the following YAML. 

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: anf-sc-smb
    provisioner: csi.trident.netapp.io
    allowVolumeExpansion: true
    parameters:
      backendType: "azure-netapp-files"
      trident.netapp.io/nasType: "smb"
      csi.storage.k8s.io/node-stage-secret-name: "smbcreds"
      csi.storage.k8s.io/node-stage-secret-namespace: "default"
    ```

2. Create the storage class using the  [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:   

    ```bash
    kubectl apply -f anf-storageclass-smb.yaml
    ```

    The output of the command resembles the following example:

    ```output
    storageclass/anf-sc-smb created
    ``` 

3.  Run the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to view the status of the storage class:   

    ```bash
    kubectl get sc anf-sc-smb
    NAME         PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
    anf-sc-smb   csi.trident.netapp.io   Delete          Immediate           true                   13s
    ```

### Create a PVC

A persistent volume claim (PVC) is a request for storage by a user. Upon the creation of a persistent volume claim, Astra Trident automatically creates an Azure NetApp Files SMB share and makes it available for Kubernetes workloads to consume.

1. Create a file named `anf-pvc-smb.yaml` and copy the following YAML. In this example, a 100-GiB volume is created with `ReadWriteMany` access and uses the storage class created in [Create a storage class](#create-a-storage-class).

    ```yaml
    kind: PersistentVolumeClaim
    apiVersion: v1
    metadata:
      name: anf-pvc-smb
    spec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 100Gi
      storageClassName: anf-sc-smb
    ```

2. Create the persistent volume claim with the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:  

    ```bash
    kubectl apply -f anf-pvc-smb.yaml
    ```

    The output of the command resembles the following example: 

    ```output
    persistentvolumeclaim/anf-pvc-smb created
    ```

3. To view information about the persistent volume claim, run the [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command:  

    ```bash
    kubectl get pvc
    ```

    The output of the command resembles the following example:

    ```output
    NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
    anf-pvc-smb   Bound    pvc-209268f5-c175-4a23-b61b-e34faf5b6239   100Gi      RWX            anf-sc-smb     5m38s
    ```

4. To view the persistent volume created by Astra Trident, run the following [`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command: 

    ```bash
    kubectl get pv
    NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                 STORAGECLASS   REASON   AGE
    pvc-209268f5-c175-4a23-b61b-e34faf5b6239   100Gi      RWX            Delete           Bound    default/anf-pvc-smb   anf-sc-smb              5m52s
    ```

### Use the persistent volume

After the PVC is created, a pod can be spun up to access the Azure NetApp Files volume. The following manifest can be used to define an Internet Information Services (IIS) pod that mounts the Azure NetApp Files SMB share created in the previous step. In this example, the volume is mounted at `/inetpub/wwwroot`.

1. Create a file named `anf-iis-pod.yaml` and copy in the following YAML:

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

2. Create the deployment using the [`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply) command:  

    ```bash
    kubectl apply -f anf-iis-deploy-pod.yaml
    ```

    The output of the command resembles the following example:

    ```output
    pod/iis-pod created
    ```
    
    Verify that the pod is running and is mounted via SMB to `/inetpub/wwwroot` by using the [`kubectl describe`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) command:   

    ```bash
    kubectl describe pod iis-pod
    ```

    The output of the command resembles the following example:   

    ```output    
    Name:         iis-pod
    Namespace:    default
    Priority:     0
    Node:         akswin000001/10.225.5.246
    Start Time:   Fri, 05 May 2023 15:16:36 -0400
    Labels:       app=web
    Annotations:  <none>
    Status:       Running
    IP:           10.225.5.252
    IPs:
      IP:  10.225.5.252
    Containers:
      web:
        Container ID:   containerd://1e4959f2b49e7ad842b0ec774488a6142ac9152ca380c7ba4d814ae739d5ed3e
        Image:          mcr.microsoft.com/windows/servercore/iis:windowsservercore
        Image ID:       mcr.microsoft.com/windows/servercore/iis@sha256:0f0114d0f6c6ee569e1494953efdecb76465998df5eba951dc760ac5812c7409
        Port:           80/TCP
        Host Port:      0/TCP
        State:          Running
          Started:      Fri, 05 May 2023 15:16:44 -0400
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
          /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-zznzs (ro)
    ```

3. Verify that your volume has been mounted on the pod by using [kubectl exec][kubectl-exec] to connect to the pod. And then use the `dir` command in the correct directory to check if the volume is mounted and the size matches the size of the volume you provisioned.

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
    
    05/05/2023  01:38 AM    <DIR>          .
    05/05/2023  01:38 AM    <DIR>          ..
               0 File(s)              0 bytes
               2 Dir(s)  107,373,862,912 bytes free
    
    C:\inetpub\wwwroot>exit
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
