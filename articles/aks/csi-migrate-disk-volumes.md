---
title: Migrate from in-tree storage class to CSI drivers on Azure Kubernetes Service (AKS)
description: Learn how to migrate from in-tree persistent volume to the Container Storage Interface (CSI) driver in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 08/30/2022
author: mgoedtel

---

# Migrate from in-tree storage class to CSI drivers on Azure Kubernetes Service (AKS)

The implementation of the Container Storage Interface (CSI) driver was introduced in Azure Kubernetes Service (AKS) starting with version 1.21. By adopting and using CSI as the standard, existing stateful workloads using in-tree Persistent Volumes (PVs) should be migrated or upgraded to use CSI.

Automating this migration process isn't feasible because your application deployment code needs to be updated to repoint to either a new Persistent Volume Claim (PVC) or Persistent Volume. This process requires following a sequence of steps, which might be time consuming depending on the number of dynamic PVs presented. If retention policies are not set, meaning the *ReclaimPolicy* is set to **Delete** on your PVs, there is potential risk for data loss without warning based on the default behavior of Kubernetes.

To make this process as simple as possible, and to ensure no data loss, this article recommends different approaches and includes scripts to help ensure a smooth migration from in-tree to CSI drivers.

## Before you begin

* The Azure CLI version 2.37.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Kubectl and cluster administrators have access to create, get, list, delete access to a PVC or PV, volume snapshot, or volume snapshot content. In the case of an Azure Active Directory (Azure AD) RBAC enabled cluster, you are a member of the [Azure Kubernetes Service RBAC Cluster Admin][aks-rbac-cluster-admin-role] role.

## Migration options for disk volumes

Migration from in-tree to CSI is supported using two migration approaches:

* Create a static volume
* Create a dynamic volume

### Migrate by creating a static volume

Using this option, you create a PV by statically assigning `claimRef` to a new PVC that you'll create later and specify the `volumeName` for the *PersistentVolumeClaim*.

:::image type="content" source="media/csi-migrate-disk-volumes/csi-migration-static-pv-workflow.png" alt-text="Static volume workflow diagram.":::

The following are the high-level steps that need to be performed to successfully migrate a static volume:

1. Check the reclaim policy of PersistentVolume.

2. To avoid deletion of disk, the `ReclaimPolicy` is updated from **Delete** to **Retain**.

3. Gets all the PVs using the in-tree storage class.

4. Creates a new PersistentVolume with name `Existing PersistentVolume-csi` for all PV in namespaces for given storage class in step 3.

    * Configure new PVC name as `Existing PVC-csi`.

5. Creates a new PVC with PV name specified in step 4.

    * `volumeName: pvName`
    * `storageClassName: storageClassName`

6. Updates the application (deployment/StatefulSet) to refer to new PVC.

7. Verify the application and deletes the PVC and PV based on the in-tree storage class.

The benefits of this approach are:

* It is simple and can easily be automated.
* No need to clean up original configuration using in-tree storage class.
* Low risk as you are only performing a logical deletion of Kubernetes PV/PVC, the actual physical data is not deleted.
* No additional costs as the result of not having to create any additional objects such as disk, snapshots, etc.

The following are important considerations to evaluate:

* Transition to static volumes from original dynamic-style volumes require constructing and managing PV objects manually for all options.
* Potential application downtime when redeploying the new application with reference to the new PVC object.

### Migration steps

1. Patch the existing PV `ReclaimPolicy` from **Delete** to **Retain**.

2. Create new PV. First get a list of all of the PVCs in namespace sorted by **creationTimestamp**.  

    ```bash
    kubectl get pvc -n <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    ```

3. Create a file named `CreatePV.sh` and copy in the following Bash code:

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
        for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}')
        do
        # Ignore first record as it contains header
        if [ $i -eq 1 ]; then
          i=$((i+1))
        else
    pvcCreationTime=$(kubectl get pvc $pvc -o jsonpath='{.metadata.creationTimestamp}')
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
    
        cat > $pvc-csi.yaml <<EOF
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
          printf '%s\n' "$line" >> $fileName
          fi
          fi
          fi
        fi
        fi
          done
    ```

4. Execute the script **CreatePV.sh** by running the following command:

    ```bash
    ./CreatePV.sh <namespace> <sourceIntreeStorageClass> <targetCSIStorageClass> <startTimestamp> <endTimestamp>
    ```

5. Update your application to use the new PVC.

6. Create a file named **Cleanup.sh** and copy in the following Bash code:

    ```bash
    # Patch the Persistent Volume in case ReclaimPolicy is Delete

    #!/bin/sh
    namespace=$1
    while IFS= read -r line
    do
    echo "$line"
    pvc="$(cut -d',' -f1 <<<"$line")"
    pv="$(cut -d',' -f2 <<<"$line")"
    echo $pv
    reclaimPolicy="$(kubectl get pv "$(cut -d':' -f2 <<<"$pv")" -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')"
    if [[ $reclaimPolicy == "Retain" ]]; then
    echo $deleting $pvc
    kubectl delete pvc "$(cut -d':' -f2 <<<"$pvc")" -n $1
    echo $deleting $pv
    kubectl delete pv "$(cut -d':' -f2 <<<"$pv")"
    else
    echo "Update the reclaim policy before deleting PV $pv"
    fi
    done < "$2"
    ```

7. Execute the script **Cleanup.sh** to delete the original PVC and PV by running the following command:

    ```bash
    ./Cleanup.sh <namespace> <filename>
    ```  

## Migrate by creating a dynamic volume

Using this option, you dynamically create a Persistent Volume from a Persistent Volume Claim.

:::image type="content" source="media/csi-migrate-disk-volumes/csi-migration-dynamic-pv-workflow.png" alt-text="Dynamic volume workflow diagram.":::

The following are the high-level steps that need to be performed to successfully migrate a dynamic volume:

1. Check the PVs reclaim policy.

1. To avoid deletion of disk, the reclaim policy specified in the `reclaimPolicy` field of the StorageClass is updated from **Delete** to **Retain**.

1. Create VolumeSnapshotClass.

1. Create a disk snapshot using Azure CLI commands.

1. Create VolumeSnapshotContent with resourceID of snapshot created in step 1.

1. Create VolumeSnapshot, referring to VolumeSnapshotContent created in step 3.

1. Create new PVC using VolumeSnapshot.

1. Update the application to use new PVC.

1. Manually delete the older resources including In-tree PVC/PV, VolumeSnapshot, and VolumeSnapshotContent. Otherwise, maintaining the In-tree PVC/PC and snapshot objects will generate additional cost.  

The benefits of this approach are:

* It's less risky because all new objects are created while retaining additional copies with snapshots.

* No need to construct PV separately and add volume name in PVC manifest.

The following are important considerations to evaluate:

* While this approach is less risky, it does create multiple objects that will increase your storage costs.

* There is application downtime during creation of the new volume(s).

* Deletion steps should be performed with caution. Temporary [resource locks][azure-resource-locks] can be applied to your resource group until migration is completed and your application is successfully verified.

* Perform data validation/verification as new disks are created from snapshots.

### Migration steps

Before proceeding, verify the following:

* Application should be stopped and all in memory data should be flushed to disk.
* `VolumeSnapshot` class should exist with the default value set to `custom-azure-disk-snapshot-sc`, as shown in the following example YAML:

    ```yml
    apiVersion: snapshot.storage.k8s.io/v1
    kind: VolumeSnapshotClass
    metadata:
      name: custom-azure-disk-snapshot-sc
    driver: disk.csi.azure.com
    deletionPolicy: Delete
    parameters:
      incremental: "false"
    ```

1. Get list of all the PVCs in namespace sorted by *creationTimestamp* by running the following command:

    ```bash
    kubectl get pvc -n <namespace> --sort-by=.metadata.creationTimestamp -o custom-columns=NAME:.metadata.name,CreationTime:.metadata.creationTimestamp,StorageClass:.spec.storageClassName,Size:.spec.resources.requests.storage
    ```

2. Create a file named `MigrateToCSI.sh` and copy in the following Bash code:

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
        for pvc in $(kubectl get pvc -n $namespace | awk '{ print $1}')
        do
        # Ignore first record as it contains header
        if [ $i -eq 1 ]; then
          i=$((i+1))
        else
    pvcCreationTime=$(kubectl get pvc $pvc -o jsonpath='{.metadata.creationTimestamp}')
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
        cat << EOF > $pvc-csi.yml
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
          printf '%s\n' "$line" >> $fileName
          fi
          fi
      fi
      fi
    ```

3. Execute the script **MigrateToCSI.sh**, which does the following:

    * Creates a full disk snapshot using the Azure CLI
    * Creates `VolumesnapshotContent`
    * Creates `VolumeSnapshot`
    * Creates a new PVC from `VolumeSnapshot`
    * Creates a new file with the filename `<namespace>-timestamp`, which contains list of all old resources that needs to be cleaned up.

    ```bash
    ./MigrateToCSI.sh <namespace> <sourceStorageClass> <TargetCSIstorageClass> <VolumeSnapshotClass> <startTimestamp> <endTimestamp>
    ```

4. Update your application to use the new PVC.

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-rbac-cluster-admin-role]: manage-azure-rbac.md#create-role-assignments-for-users-to-access-cluster
[azure-resource-locks]: /azure/azure-resource-manager/management/lock-resources