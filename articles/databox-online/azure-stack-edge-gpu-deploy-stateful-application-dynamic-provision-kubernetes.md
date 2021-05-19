---
title: Use kubectl to deploy Kubernetes stateful app via dynamically provisioned share on Azure Stack Edge Pro GPU device| Microsoft Docs
description: Describes how to create and manage a Kubernetes stateful application deployment via a dynamically provisioned share using kubectl on a Microsoft Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/22/2021
ms.author: alkohli
---

# Use kubectl to run a Kubernetes stateful application with StorageClass on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article shows you how to deploy a single-instance stateful application in Kubernetes using a StorageClass to dynamically provision storage and a deployment. The deployment uses `kubectl` commands on an existing Kubernetes cluster and deploys the MySQL application. 

This procedure is intended for those who have reviewed the [Kubernetes storage on Azure Stack Edge Pro device](azure-stack-edge-gpu-kubernetes-storage.md) and are familiar with the concepts of [Kubernetes storage](https://kubernetes.io/docs/concepts/storage/).


## Prerequisites

Before you can deploy the stateful application, complete the following prerequisites on your device and the client that you will use to access the device:

### For device

- You have sign-in credentials to a 1-node Azure Stack Edge Pro device.
    - The device is activated. See [Activate the device](azure-stack-edge-gpu-deploy-activate.md).
    - The device has the compute role configured via Azure portal and has a Kubernetes cluster. See [Configure compute](azure-stack-edge-gpu-deploy-configure-compute.md).

### For client accessing the device

- You have a  Windows client system that will be used to access the Azure Stack Edge Pro device.
    - The client is running Windows PowerShell 5.0 or later. To download the latest version of Windows PowerShell, go to [Install Windows PowerShell](/powershell/scripting/install/installing-windows-powershell).
    
    - You can have any other client with a [Supported operating system](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device) as well. This article describes the procedure when using a Windows client. 
    
    - You have completed the procedure described in [Access the Kubernetes cluster on Azure Stack Edge Pro device](azure-stack-edge-gpu-create-kubernetes-cluster.md). You have:
      - Created a `userns1` namespace via the `New-HcsKubernetesNamespace` command. 
      - Created a user `user1` via the `New-HcsKubernetesUser` command. 
      - Granted the `user1` access to `userns1` via the `Grant-HcsKubernetesNamespaceAccess` command.       
      - Installed `kubectl` on the client  and saved the `kubeconfig` file with the user configuration to C:\\Users\\&lt;username&gt;\\.kube. 
    
    - Make sure that the `kubectl` client version is skewed no more than one version from the Kubernetes master version running on your Azure Stack Edge Pro device. 
        - Use `kubectl version` to check the version of kubectl running on the client. Make a note of the full version.
        - In the local UI of your Azure Stack Edge Pro device, go to **Overview** and note the Kubernetes software number. 
        - Verify these two versions for compatibility from the mapping provided in the Supported Kubernetes version<!-- insert link-->. 


You are ready to deploy a stateful application on your Azure Stack Edge Pro device. 


## Deploy MySQL

You will now run a stateful application by creating a Kubernetes Deployment and connecting it to the built-in StorageClass using a PersistentVolumeClaim (PVC). 

All `kubectl` commands you use to create and manage stateful application deployments need to specify the namespace associated with the configuration. To specify the namespace in a kubectl command, use `kubectl <command> -n <your-namespace>`.

1. Get a list of the pods running on your Kubernetes cluster in your namespace. A pod is an application container, or process, running on your Kubernetes cluster.

   ```powershell
   kubectl get pods -n <your-namespace>
   ```
    
   Here's an example of command usage:
    
   ```powershell
    C:\Users\user>kubectl get pods -n "userns1"
    No resources found in userns1 namespace.    
    C:\Users\user>
   ```
    
   The output should state that no resources (pods) are found because there are no applications running on your cluster.

1. You will use the following YAML files. The `mysql-deployment.yml` file describes a deployment that runs MySQL and references the PVC. The file defines a volume mount for `/var/lib/mysql`, and then creates a PVC that looks for a 20-GB volume. A dynamic PV is provisioned and the PVC is bound to this PV.

    Copy and save the following `mysql-deployment.yml` file to a folder on the Windows client that you are using to access the Azure Stack Edge Pro device.
    
    ```yml
    apiVersion: v1
    kind: Service
    metadata:
      name: mysql
    spec:
      ports:
      - port: 3306
      selector:
        app: mysql
      clusterIP: None
    ---
    apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
    kind: Deployment
    metadata:
      name: mysql
    spec:
      selector:
        matchLabels:
          app: mysql
      strategy:
        type: Recreate
      template:
        metadata:
          labels:
            app: mysql
        spec:
          containers:
          - image: mysql:5.6
            name: mysql
            env:
              # Use secret in real usage
            - name: MYSQL_ROOT_PASSWORD
              value: password
            ports:
            - containerPort: 3306
              name: mysql
            volumeMounts:
            - name: mysql-persistent-storage
              mountPath: /var/lib/mysql
          volumes:
          - name: mysql-persistent-storage
            persistentVolumeClaim:
              claimName: mysql-pv-claim-sc
    ```
    
2. Copy and save as a `mysql-pvc.yml` file to the same folder where you saved the `mysql-deployment.yml`. To use the builtin StorageClass that Azure Stack Edge Pro device on an attached data disk, set the `storageClassName` field in the PVC object to `ase-node-local` and accessModes should be `ReadWriteOnce`. 

    > [!NOTE] 
    > Make sure that the YAML files have correct indentation. You can check with [YAML lint](http://www.yamllint.com/) to validate and then save.
   
    ```yml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: mysql-pv-claim-sc
    spec:
      storageClassName: ase-node-local
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 20Gi
    ```

3. Deploy the `mysql-pvc.yaml` file.

    `kubectl apply -f <URI path to the mysql-pv.yml file> -n <your-user-namespace>`
    
    Here's a sample output of the deployment.

    
    ```powershell
    C:\Users\user>kubectl apply -f "C:\stateful-application\mysql-pvc.yml" -n userns1
    persistentvolumeclaim/mysql-pv-claim-sc created
    C:\Users\user>
    ```
   Note the name of the PVC created - in this example, `mysql-pv-claim-sc`. You will use it in a later step.

4. Deploy the contents of the `mysql-deployment.yml` file.

    `kubectl apply -f <URI path to mysql-deployment.yml file> -n <your-user-namespace>`

    Here's a sample output of the deployment.
    
    ```powershell
    C:\Users\user>kubectl apply -f "C:\stateful-application\mysql-deployment.yml" -n userns1
    service/mysql created
    deployment.apps/mysql created
    C:\Users\user>
    ```
    
5. Display information about the deployment.

    `kubectl describe deployment <app-label> -n <your-user-namespace>`
    
    ```powershell
    C:\Users\user>kubectl describe deployment mysql -n userns1
    Name:               mysql
    Namespace:          userns1
    CreationTimestamp:  Thu, 20 Aug 2020 11:14:25 -0700
    Labels:             <none>
    Annotations:        deployment.kubernetes.io/revision: 1
                        kubectl.kubernetes.io/last-applied-configuration:
                          {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"mysql","namespace":"userns1"},"spec":{"selector":{"matchL...
    Selector:           app=mysql
    Replicas:           1 desired | 1 updated | 1 total | 1 available | 0 unavailable
    StrategyType:       Recreate
    MinReadySeconds:    0
    Pod Template:
      Labels:  app=mysql
      Containers:
       mysql:
        Image:      mysql:5.6
        Port:       3306/TCP
        Host Port:  0/TCP
        Environment:
          MYSQL_ROOT_PASSWORD:  password
        Mounts:
          /var/lib/mysql from mysql-persistent-storage (rw)
      Volumes:
       mysql-persistent-storage:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  mysql-pv-claim-sc
        ReadOnly:   false
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   mysql-695c4d9dcd (1/1 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set mysql-695c4d9dcd to 1
    C:\Users\user>
    ```
    

6. List the pods created by the deployment.

    `kubectl get pods -l <app=label> -n <your-user-namespace>`

    Here's a sample output.

    
    ```powershell
    C:\Users\user>kubectl get pods -l app=mysql -n userns1
    NAME                     READY   STATUS    RESTARTS   AGE
    mysql-695c4d9dcd-rvzff   1/1     Running   0          40s
    C:\Users\user>
    ```
    
7. Inspect the PersistentVolumeClaim.

    `kubectl describe pvc <your-pvc-name>`

    Here's a sample output.

    
    ```powershell
    C:\Users\user>kubectl describe pvc mysql-pv-claim-sc -n userns1
    Name:          mysql-pv-claim-sc
    Namespace:     userns1
    StorageClass:  ase-node-local
    Status:        Bound
    Volume:        pvc-dc48253c-82dc-42a4-a7c6-aaddc97c9b8a
    Labels:        <none>
    Annotations:   kubectl.kubernetes.io/last-applied-configuration:
                     {"apiVersion":"v1","kind":"PersistentVolumeClaim","metadata":{"annotations":{},"name":"mysql-pv-claim-sc","namespace":"userns1"},"spec":{"...
                   pv.kubernetes.io/bind-completed: yes
                   pv.kubernetes.io/bound-by-controller: yes
                   volume.beta.kubernetes.io/storage-provisioner: rancher.io/local-path
                   volume.kubernetes.io/selected-node: k8s-3q7lhq2cl-3q7lhq2
    Finalizers:    [kubernetes.io/pvc-protection]
    Capacity:      20Gi
    Access Modes:  RWO
    VolumeMode:    Filesystem
    Mounted By:    mysql-695c4d9dcd-rvzff
    Events:
      Type    Reason                 Age                From                                                                                                Message
      ----    ------                 ----               ----                                                                                                -------
      Normal  WaitForFirstConsumer   71s (x2 over 77s)  persistentvolume-controller                                                                         waiting for first consumer to be created before binding
      Normal  ExternalProvisioning   62s                persistentvolume-controller                                                                         waiting for a volume to be created, either by external provisioner "rancher.io/local-path" or manually created by system administrator
      Normal  Provisioning           62s                rancher.io/local-path_local-path-provisioner-6b84988bf9-tx8mz_1896d824-f862-4cbf-912a-c8cc0ca05574  External provisioner is provisioning volume for claim "userns1/mysql-pv-claim-sc"
      Normal  ProvisioningSucceeded  60s                rancher.io/local-path_local-path-provisioner-6b84988bf9-tx8mz_1896d824-f862-4cbf-912a-c8cc0ca05574  Successfully provisioned volume pvc-dc48253c-82dc-42a4-a7c6-aaddc97c9b8a
    C:\Users\user>
    ```
    

## Verify MySQL is running

To verify that the application is running, type:

`kubectl exec <your-pod-with-the-app> -i -t -n <your-namespace> -- mysql -p`

When prompted, provide the password. The password is in your `mysql-deployment` file.

Here's a sample output.

```powershell
C:\Users\user>kubectl exec mysql-695c4d9dcd-rvzff -i -t -n userns1 -- mysql -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.6.49 MySQL Community Server (GPL)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
mysql>
```

## Delete a deployment

To delete the deployment, delete the deployed objects by name. These objects include deployment, service, and PVC.
 
```powershell
kubectl delete deployment <deployment-name>,svc <service-name> -n <your-namespace>
kubectl delete pvc <your-pvc-name> -n <your-namespace>
```

Here's sample output of when you delete the deployment and the service.

```powershell
C:\Users\user>kubectl delete deployment,svc mysql -n userns1
deployment.apps "mysql" deleted
service "mysql" deleted
C:\Users\user>
```
Here's sample output of when you delete the PVC.

```powershell
C:\Users\user>kubectl delete pvc mysql-pv-claim-sc -n userns1
persistentvolumeclaim "mysql-pv-claim-sc" deleted
C:\Users\user>
```                                                                                         


## Next steps

To understand how to configure networking via kubectl, see 
[Deploy a stateless application on an Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-stateless-application-iot-edge-module.md)