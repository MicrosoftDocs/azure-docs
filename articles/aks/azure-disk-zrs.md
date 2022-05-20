---
title: Tutorial: Configure zone-redundant storage with Azure Kubernetes Service (AKS)
description: Learn how to configure zone-redundant storage with Azure disks for use with a pod in Azure Kubernetes Service (AKS) to increase its availability.
services: container-service
ms.topic: tutorial
ms.custom: template-tutorial
ms.date: 05/20/2022

---

# Tutorial: Configure zone-redundant storage with Azure Kubernetes Service (AKS)

The Azure disk CSI driver v2 (preview) enhances the Azure disk CSI driver to improve scalability and reduce pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. It is beneficial for both a single zone and multi-zone scenario using [Zone Redundant Disks](../virtual-machines/disks-redundancy.md#zone-redundant-storage-for-managed-disks).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a three node AKS cluster replicated across three availability zones
> * Deploy a single Mysql pod
> * Insert test data into the Mysql database
> * Simulate a failure and observe pod failover

## Before you begin

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* [Azure CLI installed](/cli/azure/install-azure-cli).

## Create an AKS cluster

Perform the following steps to create a test three node AKS cluster to test the zone-redundant storage failover scenario.

1. Create a resource group named *myResourceGroup* in the *eastus* location using the [az group create][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```
    
    The following output example resembles successful creation of the resource group:
    
    ```json
    {
      "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
      "location": "eastus",
      "managedBy": null,
      "name": "myResourceGroup",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ```

2. Create an AKS cluster using the [az aks create][az-aks-create] command with the *--name*, *--zones*, *--resource-group*, **--kubernetes-version*, and *--generate-ssh-keys* parameters. The following example creates a cluster named *myAKSCluster* with three nodes:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myAKSCluster --location <region> --kubernetes-version 1.23 --generate-ssh-keys --zones 1 2 3
    ```

3. Get the credential for the AKS cluster using the [az aks get-credential][az-aks-get-credentials] command.

    ````azurecli
    az aks get-credentials -n $AKS_CLUSTER_NAME -g $RG
    ```

4. Confirm access to the cluster by running the following `kubectl` command:

    ```bash
    kubectl get nodes  

    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-20996793-vmss000000   Ready    agent   77s   v1.21.2
    aks-nodepool1-20996793-vmss000001   Ready    agent   72s   v1.21.2
    aks-nodepool1-20996793-vmss000002   Ready    agent   79s   v1.21.2
    ```

## Configure storage

By default the Azure CSI driver is installed with your AKS cluster if it is running version 1.21 or higher. For this tutorial, the Azure disk CSI driver (v2) preview is going to be installed side-by-side with the v1 driver.

1. Install the Azure disk CSI driver v2 (preview) using Helm.  

    ```bash
    helm repo add azuredisk-csi-driver https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts
    
    helm install azuredisk-csi-driver-v2 azuredisk-csi-driver/azuredisk-csi-driver \
      --namespace kube-system \
      --version v2.0.0-alpha.1 \
      --values=https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts/v2.0.0-alpha.1/azuredisk-csi-driver/side-by-side-values.yaml
    ```

2. Verify the new storage classes were created by running the following `kubectl` command:

    ```bash
    
    kubectl get storageclasses.storage.k8s.io
    ```

    The following output example resembles successful creation of the storage classes:  

    ```output
    NAME                    PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
    azuredisk-premium-ssd-lrs      disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-premium-ssd-zrs      disk2.csi.azure.com        Delete          Immediate              true                   2m20s
    azuredisk-standard-hdd-lrs     disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-standard-ssd-lrs     disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-standard-ssd-zrs     disk2.csi.azure.com        Delete          Immediate              true                   2m20s
    azurefile                      kubernetes.io/azure-file   Delete          Immediate              true                   2m30s
    azurefile-csi                  file.csi.azure.com         Delete          Immediate              true                   2m30s
    azurefile-csi-premium          file.csi.azure.com         Delete          Immediate              true                   2m30s
    azurefile-premium              kubernetes.io/azure-file   Delete          Immediate              true                   2m30s
    default (default)              disk.csi.azure.com         Delete          WaitForFirstConsumer   true                   2m30s
    managed                        kubernetes.io/azure-disk   Delete          WaitForFirstConsumer   true                   2m30s
    managed-csi-premium            disk.csi.azure.com         Delete          WaitForFirstConsumer   true                   2m30s
    managed-premium                kubernetes.io/azure-disk   Delete          WaitForFirstConsumer   true                   2m30s
    ```

3. To achieve faster pod failover and benefit from the replica mount feature of the Azure disk CSI driver v2 (preview), you'll create a new storage class that sets the parameter for `maxShares` **> 1**. Create a YAML configuration file named *zrs-replicas-storageclass.yaml*. For example:

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: azuredisk-standard-ssd-zrs-replicas
    parameters:
      cachingmode: None
      skuName: StandardSSD_ZRS
      maxShares: "2"
    provisioner: disk2.csi.azure.com
    reclaimPolicy: Delete
    volumeBindingMode: Immediate
    allowVolumeExpansion: true
    ```

4. Run the following `kubectl` command to create the zone-redundant storage class and then verify it was created. You'll reference the YAML configuration file created in the previous step:

    ```bash
    ## Create ZRS storage class 
    kubectl apply -f zrs-replicas-storageclass.yaml
    ##validate that it was created
    kubectl get sc | grep azuredisk
    ```

## Configure the statfulset

Create a Mysql statefulset using volumes provisioned by the Azure disk CSI driver v2 (preview). The statefulset modified to use the azuredisk-standard-ssd-zrs-replicas StorageClass and Azure disk CSI driver V2 scheduler extender. This deployment example is based on the example published in the [Kubernetes](https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/) documentation.

1. Create a YAML configuration file named *mysql-statefulset.yaml*. For example:

    ```yaml
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
        name: mysql
    spec:
        selector:
        matchLabels:
            app: mysql
        serviceName: mysql
        replicas: 1
        template:
        metadata:
            labels:
            app: mysql
        spec:
            # Use the scheduler extender to ensure the pod is placed on a node with an attachment replica on failover.
            schedulerName: csi-azuredisk-scheduler-extender
            initContainers:
            - name: init-mysql
            image: mysql:5.7
            command:
            - bash
            - "-c"
            - |
                set -ex
                # Generate mysql server-id from pod ordinal index.
                [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
                ordinal=${BASH_REMATCH[1]}
                echo [mysqld] > /mnt/conf.d/server-id.cnf
                # Add an offset to avoid reserved server-id=0 value.
                echo server-id=$((100 + $ordinal)) >> /mnt/conf.d/server-id.cnf
                # Copy appropriate conf.d files from config-map to emptyDir.
                if [[ $ordinal -eq 0 ]]; then
                cp /mnt/config-map/primary.cnf /mnt/conf.d/
                else
                cp /mnt/config-map/replica.cnf /mnt/conf.d/
                fi          
            volumeMounts:
            - name: conf
                mountPath: /mnt/conf.d
            - name: config-map
                mountPath: /mnt/config-map
            - name: clone-mysql
            image: gcr.io/google-samples/xtrabackup:1.0
            command:
            - bash
            - "-c"
            - |
                set -ex
                # Skip the clone if data already exists.
                [[ -d /var/lib/mysql/mysql ]] && exit 0
                # Skip the clone on primary (ordinal index 0).
                [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
                ordinal=${BASH_REMATCH[1]}
                [[ $ordinal -eq 0 ]] && exit 0
                # Clone data from previous peer.
                ncat --recv-only mysql-$(($ordinal-1)).mysql 3307 | xbstream -x -C /var/lib/mysql
                # Prepare the backup.
                xtrabackup --prepare --target-dir=/var/lib/mysql          
            volumeMounts:
            - name: data
                mountPath: /var/lib/mysql
                subPath: mysql
            - name: conf
                mountPath: /etc/mysql/conf.d
            containers:
            - name: mysql
            image: mysql:5.7
            env:
            - name: MYSQL_ALLOW_EMPTY_PASSWORD
                value: "1"
            ports:
            - name: mysql
                containerPort: 3306
            volumeMounts:
            - name: data
                mountPath: /var/lib/mysql
                subPath: mysql
            - name: conf
                mountPath: /etc/mysql/conf.d
            resources:
                requests:
                cpu: 500m
                memory: 1Gi
            livenessProbe:
                exec:
                command: ["mysqladmin", "ping"]
                initialDelaySeconds: 30
                periodSeconds: 10
                timeoutSeconds: 5
            readinessProbe:
                exec:
                # Check we can execute queries over TCP (skip-networking is off).
                command: ["mysql", "-h", "127.0.0.1", "-e", "SELECT 1"]
                initialDelaySeconds: 5
                periodSeconds: 2
                timeoutSeconds: 1
            - name: xtrabackup
            image: gcr.io/google-samples/xtrabackup:1.0
            ports:
            - name: xtrabackup
                containerPort: 3307
            command:
            - bash
            - "-c"
            - |
                set -ex
                cd /var/lib/mysql
    
                # Determine binlog position of cloned data, if any.
                if [[ -f xtrabackup_slave_info && "x$(<xtrabackup_slave_info)" != "x" ]]; then
                # XtraBackup already generated a partial "CHANGE MASTER TO" query
                # because we're cloning from an existing replica. (Need to remove the tailing semicolon!)
                cat xtrabackup_slave_info | sed -E 's/;$//g' > change_master_to.sql.in
                # Ignore xtrabackup_binlog_info in this case (it's useless).
                rm -f xtrabackup_slave_info xtrabackup_binlog_info
                elif [[ -f xtrabackup_binlog_info ]]; then
                # We're cloning directly from primary. Parse binlog position.
                [[ `cat xtrabackup_binlog_info` =~ ^(.*?)[[:space:]]+(.*?)$ ]] || exit 1
                rm -f xtrabackup_binlog_info xtrabackup_slave_info
                echo "CHANGE MASTER TO MASTER_LOG_FILE='${BASH_REMATCH[1]}',\
                        MASTER_LOG_POS=${BASH_REMATCH[2]}" > change_master_to.sql.in
                fi
    
                # Check if we need to complete a clone by starting replication.
                if [[ -f change_master_to.sql.in ]]; then
                echo "Waiting for mysqld to be ready (accepting connections)"
                until mysql -h 127.0.0.1 -e "SELECT 1"; do sleep 1; done
    
                echo "Initializing replication from clone position"
                mysql -h 127.0.0.1 \
                        -e "$(<change_master_to.sql.in), \
                                MASTER_HOST='mysql-0.mysql', \
                                MASTER_USER='root', \
                                MASTER_PASSWORD='', \
                                MASTER_CONNECT_RETRY=10; \
                            START SLAVE;" || exit 1
                # In case of container restart, attempt this at-most-once.
                mv change_master_to.sql.in change_master_to.sql.orig
                fi
    
                # Start a server to send backups when requested by peers.
                exec ncat --listen --keep-open --send-only --max-conns=1 3307 -c \
                "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root"          
            volumeMounts:
            - name: data
                mountPath: /var/lib/mysql
                subPath: mysql
            - name: conf
                mountPath: /etc/mysql/conf.d
            resources:
                requests:
                cpu: 100m
                memory: 100Mi
            volumes:
            - name: conf
            emptyDir: {}
            - name: config-map
            configMap:
                name: mysql
        volumeClaimTemplates:
        - metadata:
            name: data
        spec:
            accessModes: ["ReadWriteOnce"]
            storageClassName: azuredisk-standard-ssd-zrs-replicas
            resources:
            requests:
                storage: 256Gi
    ```

2. Create a YAML configuration file named *mysql-configmap.yaml*. For example:

    ```yml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: mysql
      labels:
        app: mysql
    data:
      primary.cnf: |
        # Apply this config only on the primary.
        [mysqld]
        log-bin
        datadir=/var/lib/mysql/mysql    
      replica.cnf: |
        # Apply this config only on replicas.
        [mysqld]
        super-read-only
        datadir=/var/lib/mysql/mysql    
    ```

3. Create a YAML configuration file named *mysql-services.yaml*. For example:

    ```yml
    # Headless service for stable DNS entries of StatefulSet members.
    apiVersion: v1
    kind: Service
    metadata:
      name: mysql
      labels:
        app: mysql
    spec:
      ports:
      - name: mysql
        port: 3306
      clusterIP: None
      selector:
        app: mysql
    ---
    # Client service for connecting to any MySQL instance for reads.
    # For writes, you must instead connect to the primary: mysql-0.mysql.
    apiVersion: v1
    kind: Service
    metadata:
      name: mysql-read
      labels:
        app: mysql
    spec:
      ports:
      - name: mysql
        port: 3306
      selector:
        app: mysql
    ```

4. Use the `kubectl` command to apply the statefulset.

    ```bash
    kubectl apply -f mysql-statefulset.yaml
    ```

5. To monitor the progress, run the following command:

    ```bash
    kubectl get pods -l app=mysql --watch
    ```

    After several minutes, the following output example resembles the pods running status:

    ```output
    NAME      READY     STATUS    RESTARTS   AGE
    mysql-0   2/2       Running   0          3m
    mysql-1   2/2       Running   0          1m
    mysql-2   2/2       Running   0          1m
    ```

6. Use the `kubectl` command to create the configmap.

    ```bash
    kubectl apply -f mysql-configmap.yaml
    ```

7. Use the `kubectl` command to create the headless service.

    ```bash
    kubectl apply -f mysql-services.yaml
    ```

8. Use the `kubectl` command to create the statefulset.

    ```bash
    kubectl apply -f mysql_statefulset.yaml
    ```

9. Verify the two services were created (headless one for the statefulset and mysql-read for the reads) using the `kubectl` command:

    ```bash
    kubectl get svc -l app=mysql  
    ```

    After several minutes, the following output example resembles the status of the two services:

    ```output
    NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
    mysql        ClusterIP   None           <none>        3306/TCP   5h43m
    mysql-read   ClusterIP   10.0.205.191   <none>        3306/TCP   5h43m
    ```

10. Use the `kubectl` command to check the deployment.

    ```bash
    kubectl get pods -l app=mysql --watch
    ```

    After several minutes, the following output example resembles the running status of the deployment.

    ```output
    NAME      READY   STATUS    RESTARTS   AGE
    mysql-0   2/2     Running   0          6m34s
    ```

## Insert data into database

With the Mysql application installed and running, we need to create a database and then we can insert some data to simulate a failure.

1. Use the `kubectl` command to create a database called **v2test** and a table called **messages**.

    ```bash
    kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
    mysql -h mysql-0.mysql <<EOF
    CREATE DATABASE v2test;
    CREATE TABLE v2test.messages (message VARCHAR(250));
    INSERT INTO v2test.messages VALUES ('Hello from V2');
    EOF
    ```

2. Use the `kubectl` command and specify the hostname **mysql-read** to send test queries to any server that reports being **Ready**:

    ```bash
    kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
    mysql -h mysql-read -e "SELECT * FROM v2test.messages"
    ```

    The following example resembles the output of the query:

    ```output  
    +----------------+
    | message        |
    +----------------+
    | Hello from V2  |
    +----------------+
    pod "mysql-client" deleted
    ```

## Simulate a failure and notice failover

1. Use the `kubectl` command to simulate a failure by cordoning and draining a node in the pool. When you created our cluster earlier, you activated the availability zones feature and created three nodes. You should see that they are equally split across all availability zones. 

    ```bash
    kubectl get nodes --output=custom-columns=NAME:.metadata.name,ZONE:".metadata.labels.topology\.kubernetes\.io/zone"
    ```

    The following example resembles the output of the command:

    ```output
    NAME                                ZONE   
    aks-nodepool1-20996793-vmss000000   northeurope-1 
    aks-nodepool1-20996793-vmss000001   northeurope-2 
    aks-nodepool1-20996793-vmss000002   northeurope-3
    ```

2. Use the `kubectl` command to identify on which node your pods are running on:

    ```bash
    kubectl get pods -l app=mysql -o wide
    ```

    ```output
    NAME      READY   STATUS    RESTARTS   AGE   IP           NODE                                NOMINATED NODE   READINESS GATES
    mysql-0   2/2     Running   0          17m   10.244.2.4   aks-nodepool1-20996793-vmss000001   <none>           <none>
    ```

    You see that the pod is running in "aks-nodepool1-20996793-vmss000001". Through cordoning and draining the node, it will trigger the pod to failover to a new node.

3. Use the `kubectl` command to trigger failover to a new node:

    ```bash
    kubectl cordon aks-nodepool1-20996793-vmss000001
    ```

    The following output example resembles the actions of the command:

    ```output
    node/aks-nodepool1-20996793-vmss000001 cordoned
    ```

    Run the following command to drain the node:

    ```bash
    kubectl drain aks-nodepool1-20996793-vmss000001
    ```

4. The statefulset should try to restart in a different node in a new zone. With the Azure disk CSI driver v2 (preview), the pod should be up a few minutes. Run the following command to observe the pod status.

    ```bash
    kubectl get pods -l app=mysql --watch -o wide
    ```

    ```output
    NAME      READY   STATUS    RESTARTS   AGE   IP           NODE                                NOMINATED NODE   READINESS GATES
    mysql-0   2/2     Running   0          10m   10.244.0.7   aks-nodepool1-20996793-vmss000002   <none>           <none>
    ```

5. With the pod failover complete, you can validate that the client can access the server. Run the following `kubelet` command to see the data written earlier to the database.

    ```bash
    kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
    mysql -h mysql-read -e "SELECT * FROM v2test.messages"
    ```

    ```output
    +----------------+
    | message        |
    +----------------+
    | Hello from V2  |
    +----------------+
    pod "mysql-client" deleted
    ```

