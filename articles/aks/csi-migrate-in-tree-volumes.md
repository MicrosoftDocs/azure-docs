---
title: Migrate from in-tree storage class to CSI drivers on Azure Kubernetes Service (AKS)
description: Learn how to migrate from in-tree persistent volume to the Container Storage Interface (CSI) driver in an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 03/23/2023
author: mgoedtel

---

# Migrate from in-tree storage class to CSI drivers on Azure Kubernetes Service (AKS)

The implementation of the [Container Storage Interface (CSI) driver][csi-driver-overview] was introduced in Azure Kubernetes Service (AKS) starting with version 1.21. By adopting and using CSI as the standard, your existing stateful workloads using in-tree Persistent Volumes (PVs) should be migrated or upgraded to use the CSI driver.

To make this process as simple as possible, and to ensure no data loss, this article provides different migration options. These options include scripts to help ensure a smooth migration from in-tree to Azure Disks and Azure Files CSI drivers.

## Before you begin

* The Azure CLI version 2.37.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Kubectl and cluster administrators have access to create, get, list, delete access to a PVC or PV, volume snapshot, or volume snapshot content. For an Azure Active Directory (Azure AD) RBAC enabled cluster, you're a member of the [Azure Kubernetes Service RBAC Cluster Admin][aks-rbac-cluster-admin-role] role.

## Migrate Disk volumes

Migration from in-tree to CSI is supported using two migration options:

* Create a static volume
* Create a dynamic volume

### Create a static volume

Using this option, you create a PV by statically assigning `claimRef` to a new PVC that you'll create later, and specify the `volumeName` for the *PersistentVolumeClaim*.

:::image type="content" source="media/csi-migrate-in-tree-volumes/csi-migration-static-pv-workflow.png" alt-text="Static volume workflow diagram.":::

The benefits of this approach are:

* It's simple and can be automated.
* No need to clean up original configuration using in-tree storage class.
* Low risk as you're only performing a logical deletion of Kubernetes PV/PVC, the actual physical data isn't deleted.
* No extra costs as the result of not having to create more objects such as disk, snapshots, etc.

The following are important considerations to evaluate:

* Transition to static volumes from original dynamic-style volumes requires constructing and managing PV objects manually for all options.
* Potential application downtime when redeploying the new application with reference to the new PVC object.

#### Migration

1. Update the existing PV `ReclaimPolicy` from **Delete** to **Retain** by running the following command:

   ```bash
   kubectl patch pv pvName -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

    Replace **pvName** with the name of your selected PersistentVolume. Alternatively, if you want to update the reclaimPolicy for multiple PVs, create a file named **patchReclaimPVs.sh** and copy in the following code.

    ```bash
    #!/bin/sh
    # Patch the Persistent Volume in case ReclaimPolicy is Delete
    namespace=$1
    i=1
    for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}'); do
      # Ignore first record as it contains header
      if [ $i -eq 1 ]; then
        i=$((i + 1))
      else
        pv="$(kubectl get pvc $pvc -n $namespace -o jsonpath='{.spec.volumeName}')"
        reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
        echo "Reclaim Policy for Persistent Volume $pv is $reclaimPolicy"
        if [[ $reclaimPolicy == "Delete" ]]; then
          echo "Updating ReclaimPolicy for $pv to Retain"
          kubectl patch pv $pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
        fi
      fi
    done
    ```

    Execute the script with the `namespace` parameter to specify the cluster namespace `./PatchReclaimPolicy.sh <namespace>`.

2. Get a list of all of the PVCs in namespace sorted by **creationTimestamp** by running the following command. Set the namespace using the `--namespace` argument along with the actual cluster namespace.

    ```bash
    kubectl get pvc -n <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    ```

    This step is helpful if you have a large number of PVs that need to be migrated, and you want to migrate a few at a time. Running this command enables you to identify which PVCs were created in a given time frame. When you run the *CreatePV.sh* script, two of the parameters are start time and end time that enable you to only migrate the PVCs during that period of time.

3. Create a file named **CreatePV.sh** and copy in the following code. The script does the following:

    * Creates a new PersistentVolume with name `existing-pv-csi` for all PersistentVolumes in namespaces for storage class `storageClassName`.
    * Configure new PVC name as `existing-pvc-csi`.
    * Updates the application (deployment/StatefulSet) to refer to new PVC.
    * Creates a new PVC with the PV name you specify.

    ```bash
    #!/bin/sh
    #kubectl get pvc -n <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    # TimeFormat 2022-04-20T13:19:56Z
    namespace=$1
    fileName=$(date +%Y%m%d%H%M)-$namespace
    existingStorageClass=$2
    storageClassNew=$3
    starttimestamp=$4
    endtimestamp=$5
    i=1
    for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}'); do
      # Ignore first record as it contains header
      if [ $i -eq 1 ]; then
        i=$((i + 1))
      else
        pvcCreationTime=$(kubectl get pvc  $pvc -n $namespace -o jsonpath='{.metadata.creationTimestamp}')
        if [[ $pvcCreationTime > $starttimestamp ]]; then
          if [[ $endtimestamp > $pvcCreationTime ]]; then
            pv="$(kubectl get pvc $pvc -n $namespace -o jsonpath='{.spec.volumeName}')"
            reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
            storageClass="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.storageClassName}')"
            echo $pvc
            reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
            if [[ $reclaimPolicy == "Retain" ]]; then
              if [[ $storageClass == $existingStorageClass ]]; then
                storageSize="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.capacity.storage}')"
                skuName="$(kubectl get storageClass $storageClass -o jsonpath='{.reclaimPolicy}')"
                diskURI="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.azureDisk.diskURI}')"
                persistentVolumeReclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
    
                cat >$pvc-csi.yaml <<EOF
        apiVersion: v1
        kind: PersistentVolume
        metadata:
          annotations:
            pv.kubernetes.io/provisioned-by: disk.csi.azure.com
          name: $pv-csi
        spec:
          accessModes:
          - ReadWriteOnce
          capacity:
            storage: $storageSize
          claimRef:
            apiVersion: v1
            kind: PersistentVolumeClaim
            name: $pvc-csi
            namespace: $namespace
          csi:
            driver: disk.csi.azure.com
            volumeAttributes:
              csi.storage.k8s.io/pv/name: $pv-csi
              csi.storage.k8s.io/pvc/name: $pvc-csi
              csi.storage.k8s.io/pvc/namespace: $namespace
              requestedsizegib: "$storageSize"
              skuname: $skuName
            volumeHandle: $diskURI
          persistentVolumeReclaimPolicy: $persistentVolumeReclaimPolicy
          storageClassName: $storageClassNew
    ---
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: $pvc-csi
      namespace: $namespace
    spec:
      accessModes:
        - ReadWriteOnce
      storageClassName: $storageClassNew
      resources:
        requests:
          storage: $storageSize
      volumeName: $pv-csi
    EOF
                kubectl apply -f $pvc-csi.yaml
                line="PVC:$pvc,PV:$pv,StorageClassTarget:$storageClassNew"
                printf '%s\n' "$line" >>$fileName
              fi
            fi
          fi
        fi
      fi
    done
    ```

4. To create a new PersistentVolume for all PersistentVolumes in the namespace, execute the script **CreatePV.sh** with the following parameters:

   * `namespace` - The cluster namespace
   * `sourceStorageClass` - The in-tree storage driver-based StorageClass
   * `targetCSIStorageClass` - The CSI storage driver-based StorageClass, which can be either one of the default storage classes that have the provisioner set to **disk.csi.azure.com** or **file.csi.azure.com**. Or you can create a custom storage class as long as it is set to either one of those two provisioners. 
   * `volumeSnapshotClass` - Name of the volume snapshot class. For example, `custom-disk-snapshot-sc`.
   * `startTimeStamp` - Provide a start time in the format **yyyy-mm-ddthh:mm:ssz**.
   * `endTimeStamp` - Provide an end time in the format **yyyy-mm-ddthh:mm:ssz**.

    ```bash
    ./CreatePV.sh <namespace> <sourceIntreeStorageClass> <targetCSIStorageClass> <startTimestamp> <endTimestamp>
    ```

5. Update your application to use the new PVC.

### Create a dynamic volume

Using this option, you dynamically create a Persistent Volume from a Persistent Volume Claim.

:::image type="content" source="media/csi-migrate-in-tree-volumes/csi-migration-dynamic-pv-workflow.png" alt-text="Dynamic volume workflow diagram.":::

The benefits of this approach are:

* It's less risky because all new objects are created while retaining other copies with snapshots.

* No need to construct PVs separately and add volume name in PVC manifest.

The following are important considerations to evaluate:

* While this approach is less risky, it does create multiple objects that will increase your storage costs.

* During creation of the new volume(s), your application is unavailable.

* Deletion steps should be performed with caution. Temporary [resource locks][azure-resource-locks] can be applied to your resource group until migration is completed and your application is successfully verified.

* Perform data validation/verification as new disks are created from snapshots.

#### Migration

Before proceeding, verify the following:

* For specific workloads where data is written to memory before being written to disk, the application should be stopped and to allow in-memory data to be flushed to disk.
* `VolumeSnapshot` class should exist as shown in the following example YAML:

    ```yml
    apiVersion: snapshot.storage.k8s.io/v1
    kind: VolumeSnapshotClass
    metadata:
      name: custom-disk-snapshot-sc
    driver: disk.csi.azure.com
    deletionPolicy: Delete
    parameters:
      incremental: "false"
    ```

1. Get list of all the PVCs in a specified namespace sorted by *creationTimestamp* by running the following command. Set the namespace using the `--namespace` argument along with the actual cluster namespace.

    ```bash
    kubectl get pvc --namespace <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    ```

    This step is helpful if you have a large number of PVs that need to be migrated, and you want to migrate a few at a time. Running this command enables you to identify which PVCs were created in a given time frame. When you run the *MigrateCSI.sh* script, two of the parameters are start time and end time that enable you to only migrate the PVCs during that period of time.

2. Create a file named **MigrateToCSI.sh** and copy in the following code. The script does the following:

    * Creates a full disk snapshot using the Azure CLI
    * Creates `VolumesnapshotContent`
    * Creates `VolumeSnapshot`
    * Creates a new PVC from `VolumeSnapshot`
    * Creates a new file with the filename `<namespace>-timestamp`, which contains a list of all old resources that needs to be cleaned up.

    ```bash
    #!/bin/sh
    #kubectl get pvc -n <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    # TimeFormat 2022-04-20T13:19:56Z
    namespace=$1
    fileName=$namespace-$(date +%Y%m%d%H%M)
    existingStorageClass=$2
    storageClassNew=$3
    volumestorageClass=$4
    starttimestamp=$5
    endtimestamp=$6
    i=1
    for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}'); do
      # Ignore first record as it contains header
      if [ $i -eq 1 ]; then
        i=$((i + 1))
      else
        pvcCreationTime=$(kubectl get pvc $pvc -n $namespace -o jsonpath='{.metadata.creationTimestamp}')
        if [[ $pvcCreationTime > $starttimestamp ]]; then
          if [[ $endtimestamp > $pvcCreationTime ]]; then
            pv="$(kubectl get pvc $pvc -n $namespace -o jsonpath='{.spec.volumeName}')"
            reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
            storageClass="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.storageClassName}')"
            echo $pvc
            reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
            if [[ $storageClass == $existingStorageClass ]]; then
              storageSize="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.capacity.storage}')"
              skuName="$(kubectl get storageClass $storageClass -o jsonpath='{.reclaimPolicy}')"
              diskURI="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.azureDisk.diskURI}')"
              targetResourceGroup="$(cut -d'/' -f5 <<<"$diskURI")"
              echo $diskURI
              echo $targetResourceGroup
              persistentVolumeReclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
              az snapshot create --resource-group $targetResourceGroup --name $pvc-$fileName --source "$diskURI"
              snapshotPath=$(az snapshot list --resource-group $targetResourceGroup --query "[?name == '$pvc-$fileName'].id | [0]")
              snapshotHandle=$(echo "$snapshotPath" | tr -d '"')
              echo $snapshotHandle
              sleep 10
              # Create Restore File
              cat <<EOF >$pvc-csi.yml
        apiVersion: snapshot.storage.k8s.io/v1
        kind: VolumeSnapshotContent
        metadata:
          name: $pvc-$fileName
        spec:
          deletionPolicy: 'Delete'
          driver: 'disk.csi.azure.com'
          volumeSnapshotClassName: $volumestorageClass
          source:
            snapshotHandle: $snapshotHandle
          volumeSnapshotRef:
            apiVersion: snapshot.storage.k8s.io/v1
            kind: VolumeSnapshot
            name: $pvc-$fileName
            namespace: $1
    ---
        apiVersion: snapshot.storage.k8s.io/v1
        kind: VolumeSnapshot
        metadata:
          name: $pvc-$fileName
          namespace: $1
        spec:
          volumeSnapshotClassName: $volumestorageClass
          source:
            volumeSnapshotContentName: $pvc-$fileName
    ---
        apiVersion: v1
        kind: PersistentVolumeClaim
        metadata:
          name: csi-$pvc
          namespace: $1
        spec:
          accessModes:
          - ReadWriteOnce
          storageClassName: $storageClassNew
          resources:
            requests:
              storage: $storageSize
          dataSource:
            name: $pvc-$fileName
            kind: VolumeSnapshot
            apiGroup: snapshot.storage.k8s.io
    
    EOF
              kubectl create -f $pvc-csi.yml
              line="OLDPVC:$pvc,OLDPV:$pv,VolumeSnapshotContent:volumeSnapshotContent-$fileName,VolumeSnapshot:volumesnapshot$fileName,OLDdisk:$diskURI"
              printf '%s\n' "$line" >>$fileName
            fi
          fi
        fi
      fi
    done
    ```

3. To migrate the disk volumes, execute the script **MigrateToCSI.sh** with the following parameters:

   * `namespace` - The cluster namespace
   * `sourceStorageClass` - The in-tree storage driver-based StorageClass
   * `targetCSIStorageClass` - The CSI storage driver-based StorageClass
   * `volumeSnapshotClass` - Name of the volume snapshot class. For example, `custom-disk-snapshot-sc`.
   * `startTimeStamp` - Provide a start time in the format **yyyy-mm-ddthh:mm:ssz**.
   * `endTimeStamp` - Provide an end time in the format **yyyy-mm-ddthh:mm:ssz**.

    ```bash
    ./MigrateToCSI.sh <namespace> <sourceStorageClass> <TargetCSIstorageClass> <VolumeSnapshotClass> <startTimestamp> <endTimestamp>
    ```

4. Update your application to use the new PVC.

5. Manually delete the older resources including in-tree PVC/PV, VolumeSnapshot, and VolumeSnapshotContent. Otherwise, maintaining the in-tree PVC/PC and snapshot objects will generate more cost.

## Migrate File share volumes

Migration from in-tree to CSI is supported by creating a static volume.

### Migration

1. Update the existing PV `ReclaimPolicy` from **Delete** to **Retain** by running the following command:

   ```bash
   kubectl patch pv pvName -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

    Replace **pvName** with the name of your selected PersistentVolume. Alternatively, if you want to update the reclaimPolicy for multiple PVs, create a file named **patchReclaimPVs.sh** and copy in the following code.

    ```bash
    #!/bin/sh
    # Patch the Persistent Volume in case ReclaimPolicy is Delete
    namespace=$1
    i=1
    for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}'); do
      # Ignore first record as it contains header
      if [ $i -eq 1 ]; then
        i=$((i + 1))
      else
        pv="$(kubectl get pvc $pvc -n $namespace -o jsonpath='{.spec.volumeName}')"
        reclaimPolicy="$(kubectl get pv $pv -n $namespace -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
        echo "Reclaim Policy for Persistent Volume $pv is $reclaimPolicy"
        if [[ $reclaimPolicy == "Delete" ]]; then
          echo "Updating ReclaimPolicy for $pv to Retain"
          kubectl patch pv $pv -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
        fi
      fi
    done
    ```

    Execute the script with the `namespace` parameter to specify the cluster namespace `./PatchReclaimPolicy.sh <namespace>`.

2. Create a new Storage Class with the provisioner set to `file.csi.azure.com`, or you can use one of the default StorageClasses with the CSI file provisioner.

3. Get the `secretName` and `shareName` from the existing *PersistentVolumes* by running the following command:

    ```bash
    kubectl describe pv pvName
    ```

4. Create a new PV using the new StorageClass, and the `shareName` and `secretName` from the in-tree PV. Create a file named *azurefile-mount-pv.yaml* and copy in the following code. Under `csi`, update `resourceGroup`, `volumeHandle`, and `shareName`. For mount options, the default value for *fileMode* and *dirMode* is *0777*.

   The default value for `fileMode` and `dirMode` is **0777**.

    ```yml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      annotations:
        pv.kubernetes.io/provisioned-by: file.csi.azure.com
      name: azurefile
    spec:
      capacity:
        storage: 5Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain
      storageClassName: azurefile-csi
      csi:
        driver: file.csi.azure.com
        readOnly: false
        volumeHandle: unique-volumeid  # make sure volumeid is unique for every identical share in the cluster
        volumeAttributes:
          resourceGroup: EXISTING_RESOURCE_GROUP_NAME  # optional, only set this when storage account is not in the same resource group as the cluster nodes
          shareName: aksshare
        nodeStageSecretRef:
          name: azure-secret
          namespace: default
      mountOptions:
        - dir_mode=0777
        - file_mode=0777
        - uid=0
        - gid=0
        - mfsymlinks
        - cache=strict
        - nosharesock
        - nobrl
    ```

5. Create a file named *azurefile-mount-pvc.yaml* file with a *PersistentVolumeClaim* that uses the *PersistentVolume* using the following code.

    ```yml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: azurefile
    spec:
      accessModes:
        - ReadWriteMany
      storageClassName: azurefile-csi
      volumeName: azurefile
      resources:
        requests:
          storage: 5Gi
    ```

6. Use the `kubectl` command to create the *PersistentVolume*.

    ```bash
    kubectl apply -f azurefile-mount-pv.yaml
    ```

7. Use the `kubectl` command to create the *PersistentVolumeClaim*.

    ```bash
    kubectl apply -f azurefile-mount-pvc.yaml
    ```

8. Verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume* by running the following command.

    ```bash
    kubectl get pvc azurefile
    ```

   The output resembles the following:

    ```output
    NAME        STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
    azurefile   Bound    azurefile   5Gi        RWX            azurefile      5s
    ```

9. Update your container spec to reference your *PersistentVolumeClaim* and update your pod. For example, copy the following code and create a file named *azure-files-pod.yaml*.

    ```yml
    ...
      volumes:
      - name: azure
        persistentVolumeClaim:
          claimName: azurefile
    ```

10. The pod spec can't be updated in place. Use the following `kubectl` commands to delete and then re-create the pod.

    ```bash
    kubectl delete pod mypod
    ```

    ```bash
    kubectl apply -f azure-files-pod.yaml
    ```

## Next steps

For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service][aks-storage-backups-best-practices].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-rbac-cluster-admin-role]: manage-azure-rbac.md#create-role-assignments-for-users-to-access-the-cluster
[azure-resource-locks]: ../azure-resource-manager/management/lock-resources.md
[csi-driver-overview]: csi-storage-drivers.md
[aks-storage-backups-best-practices]: operator-best-practices-storage.md
