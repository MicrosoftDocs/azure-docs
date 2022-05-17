---
title: Optimization for Container Storage Interface (CSI) driver v2 (preview) for Azure disk
description: Learn how to optimize performance of the Container Storage Interface (CSI) driver v2 (preview) for Azure disk in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/17/2022
author: mgoedtel

---

# Performance optimization for Container Storage Interface (CSI) driver v2 (preview) for Azure disk

Azure storage publishes [guidelines](../virtual-machines/premium-storage-performance.md)
to help decision makers, developers, or system engineers, with guidelines for building high
performance applications at the storage layer to drive maximum IOPS and bandwidth.

Azure disk CSI driver v2 (preview) enables you to tweak the guest OS device settings using the **perfProfile**
feature for your Azure Kubernetes Services (AKS) cluster, by choosing from a list of options to
tweak the IO behavior of block devices in accordance with their workloads.

**perfProfile** can be set at the `StorageClass` level and applies to all the disks created using the `StorageClass`

## Limitations

- For this preview, HDD or UltraDisk aren't supported.
- This preview only optimizes data disks (PVs). Local or temporary disks assigned to the VM are not optimized.
- In this preview, it only optimizes the disks that use the storVsc Linux disk driver.
- Devices tuned using the **Basic** and **Advanced** `perfProfile` options can show variance in performance due to several factors, including but not limited to, disk size, VM SKU, disk caching mode, Linux distribution and kernel version, and workload type. It is recommended that you test the `perfProfile` in a dev or test environment to understand the performance benefits, before introducing to a production cluster.

## Perf Profiles

With `perProfile`, you can chose from three options:

* **None** there are no optimizations for persistent volumes (PVs) created using this `StorageClass`.
* **Basic** offers a pre-defined configuration to tune the device settings for balanced throughput and optimized Transactions per second (TPS).
* **Advanced** provides the ultimate flexibility to adjust device settings to optimize the disk IO for the workload.

### Basic

The **Basic** `perfProfile` option enables a pre-defined configuration as shown in the example below.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sc-kubestone-perf-optimized-premium-ssd-csi
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_LRS
  perfProfile: Basic
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

### Advanced

Device settings can be controlled by specifying overrides in the `parameters` section of the
`StorageClass`, using a prefix `device-setting/`. If `perfProfile` is set to **Advanced**, the driver
treats any parameter that starts with the prefix `device-setting/` as a device setting override.

Device setting overrides can be provided in format `<deviceSettingPrefix><deviceSetting>: "<deviceSettingValue>"`.

A valid device setting override starts with `device-setting/` and the `deviceSetting` has to be a
valid block device setting in the kernel used. Relative paths to the device setting aren't allowed.

For example, to set `deviceSetting` /sys/block/sda/queue/scheduler (here, `/sys/block/sda` is an
example block device) to `mq-deadline`, you should specify the following override in `parameters`
section of `StorageClass`.

```yaml
  device-setting/queue/scheduler: "mq-deadline"
```

There are no limitations as to how many settings you can specify using the **Advanced** option.

If `perfProfile` is set to `Advanced`, at least one device setting override should be provided in
the `parameters` section.

If you don't specify a device setting override and the `perfProfile` is set to `Advanced`,
the CSI driver fails during disk creation using this `StorageClass`.

Any incorrect `deviceSetting` overrides specified in the `parameters` section results in failure of
disk staging on the node and results in pod scheduling failure.

The example below shows an invalid device setting override. This override is invalid
because `deviceSetting` uses a relative path (`..`). This results in disk staging failure and causes
the pod to be stuck.

```yaml
  device-setting/../queue/scheduler: "mq-deadline"
```

>[!IMPORTANT]
>Care should be taken when using the **Advanced** option with `perfProfile`. Be sure to test all the
>`deviceSetting` overrides in Linux kernel that you plan to use before implementing them in a production
>cluster.

The example below is a YAML file with `StorageClass` that includes some well known block device settings
on Linux.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sc-kubestone-perf-optimized-premium-ssd-csi
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_LRS
  perfProfile: Advanced # available values: None(by default), Basic, Advanced. These are case insensitive.
  device-setting/queue/max_sectors_kb: "52"
  device-setting/queue/scheduler: "mq-deadline"
  device-setting/iosched/fifo_batch: "1"
  device-setting/iosched/writes_starved: "1"
  device-setting/device/queue_depth: "16"
  device-setting/queue/nr_requests: "16"
  device-setting/queue/read_ahead_kb: "8"
  device-setting/queue/wbt_lat_usec: "0"
  device-setting/queue/rotational: "0"
  device-setting/queue/nomerges: "0"
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

## Example

Consider `StorageClass` `sc-test-postgresql-p20-optimized` in below example, which can optimize an Azure P20 disk to get increased combined throughput, IOPS and better IO latency for a PostresSQL inspired [Flexible IO](https://fio.readthedocs.io/en/latest/fio_doc.html) (fio) workload.

To apply the optimizations, perform the following steps.

1. Create an AKS cluster with `Standard_D4s_v4` VM SKU nodepool.
2. Install Azure disk CSI driver v2 (preview) following instructions [here](https://github.com/kubernetes-sigs/azuredisk-csi-driver/tree/main_v2/charts).
3. Install kubestone by running the following commands:

    ```bash
    kustomize build github.com/xridge/kubestone/config/default?ref=v0.5.0 | sed "s/kubestone:latest/kubestone:v0.5.0/" | kubectl create -f -
    
    kubectl create namespace kubestone
    ```

4. To run a fio workload with optimized disks, run the following command:

    ```bash
    cat <<EOF | kubectl apply -f -
    ---
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: sc-test-postgresql-p20-optimized
    provisioner: disk.csi.azure.com
    parameters:
      skuname: Premium_LRS
      cachingmode: None
      perfProfile: Advanced
      device-setting/queue/max_sectors_kb: "211"
      device-setting/queue/scheduler: "none"
      device-setting/device/queue_depth: "17"
      device-setting/queue/nr_requests: "44"
      device-setting/queue/read_ahead_kb: "256"
      device-setting/queue/wbt_lat_usec: "0"
      device-setting/queue/rotational: "0"
    reclaimPolicy: Delete
    volumeBindingMode: WaitForFirstConsumer
    allowVolumeExpansion: true
    ---
    apiVersion: perf.kubestone.xridge.io/v1alpha1
    kind: Fio
    metadata:
      name: test-postgresql-p20-optimized
    spec:
      customJobFiles:
      - |
        [global]
        time_based=1
        ioengine=sync
        buffered=1
        runtime=120
        bs=8kiB
    
        [job1]
        name=checkpointer
        rw=write
        size=4GiB
        fsync_on_close=1
        sync_file_range=write:32
    
        [job2]
        name=wal
        rw=write
        size=2GiB
        fdatasync=1    
    
        [job3]
        name=large_read
        rw=read
        size=10GiB
      cmdLineArgs: --output-format=json
      podConfig:
        podLabels:
            app: kubestone
        podScheduling:
              affinity:
                podAntiAffinity:
                  requiredDuringSchedulingIgnoredDuringExecution:
                    - labelSelector:
                        matchExpressions:
                          - key: "app"
                            operator: In
                            values:
                            - kubestone
                      topologyKey: "kubernetes.io/hostname"
      image:
        name: xridge/fio:3.13
      volume:
        persistentVolumeClaimSpec:
          accessModes:
          - ReadWriteOnce
          resources:
            requests:
              storage: 512Gi
          storageClassName: sc-test-postgresql-p20-optimized
        volumeSource:
          persistentVolumeClaim:
            claimName: GENERATED
    ---
    EOF
    ```

   Or to run the same fio workload with unoptimized disk, run the following command:

    ```bash
    cat <<EOF | kubectl apply -f -
    ---
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: sc-test-postgresql-p20
    provisioner: disk.csi.azure.com
    parameters:
      cachingmode: None
      skuname: Premium_LRS
      perfProfile: None
    reclaimPolicy: Delete
    volumeBindingMode: WaitForFirstConsumer
    allowVolumeExpansion: true
    ---
    apiVersion: perf.kubestone.xridge.io/v1alpha1
    kind: Fio
    metadata:
      name: test-postgresql-p20
    spec:
      customJobFiles:
      - |
        [global]
        time_based=1
        ioengine=sync
        buffered=1
        runtime=120
        bs=8kiB
    
        [job1]
        name=checkpointer
        rw=write
        size=4GiB
        fsync_on_close=1
        sync_file_range=write:32
    
        [job2]
        name=wal
        rw=write
        size=2GiB
        fdatasync=1    
    
        [job3]
        name=large_read
        rw=read
        size=10GiB
      cmdLineArgs: --output-format=json
      podConfig:
        podLabels:
            app: kubestone
        podScheduling:
              affinity:
                podAntiAffinity:
                  requiredDuringSchedulingIgnoredDuringExecution:
                    - labelSelector:
                        matchExpressions:
                          - key: "app"
                            operator: In
                            values:
                            - kubestone
                      topologyKey: "kubernetes.io/hostname"
      image:
        name: xridge/fio:3.13
      volume:
        persistentVolumeClaimSpec:
          accessModes:
          - ReadWriteOnce
          resources:
            requests:
              storage: 512Gi
          storageClassName: sc-test-postgresql-p20
        volumeSource:
          persistentVolumeClaim:
            claimName: GENERATED
    ---
    EOF
    ```

5. After you have completed your testing, run the following commands to uninstall kubestone and delete `StorageClass`:

    ```bash
    kubectl delete namespace kubestone --ignore-not-found
    
    kustomize build github.com/xridge/kubestone/config/default?ref=v0.5.0 | sed "s/kubestone:latest/kubestone:v0.5.0/" | kubectl delete --ignore-not-found -f -
    ```

    ```bash
    kubectl delete sc sc-test-postgresql-p20 --ignore-not-found
    
    kubectl delete sc sc-test-postgresql-p20-optimized --ignore-not-found
    ```

## Next steps

- To uninstall Azure disk CSI driver v2 (preview), see [Uninstall Azure disk CSI driver v2 (preview)](https://github.com/kubernetes-sigs/azuredisk-csi-driver/tree/main_v2/charts).