---
title: Optimization for Container Storage Interface (CSI) driver v2 (preview) for Azure disk
description: Learn how to optimize performance of the Container Storage Interface (CSI) driver v2 (preview) for Azure disk in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 05/13/2022
author: mgoedtel

---

# Performance optimization for Container Storage Interface (CSI) driver v2 (preview) for Azure disk

Azure storage publishes [guidelines](../virtual-machines/premium-storage-performance.md)
to help decision makers, developers, or system engineers, with guidelines for building high
performance applications at the storage layer to drive maximum IOPS and bandwidth.

Azure disk CSI driver v2 (preview) enables you to tweak the guest OS device settings using the **perfProfile**
feature for your Azure Kubernetes Services (AKS) cluster. You can chose from a list of options to
tweak the IO behavior of block devices in accordance with their workloads.

`perfProfile` can be set at the `StorageClass` level and applies to all the disks created using the `StorageClass`

## Perf Profiles

With this release, you can chose from three options:

* **None** there are no optimizations for persistent volumes (PVs) created using this `StorageClass`.
* **Basic** offers a pre-defined configuration to tune the device settings for balanced throughput and optimized Transactions per second (TPS).
* **Advanced** provides the ultimate flexibility to adjust any device setting you desire to optimize the disk IO for the workload.

### Basic

`Basic` `perfProfile` 

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sc-kubestone-perf-optimized-premium-ssd-csi
provisioner: disk.csi.azure.com
parameters:
  skuName: Premium_LRS
  perfProfile: Basic # available values: "None" (default) and "Basic". The V2 driver adds "Advanced". These values are case insensitive.
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

### Advanced

Device settings can be controlled by providing overrides in the `parameters` section of the
`StorageClass`, using a prefix `device-setting/`. If `perfProfile` is set to `Advanced`, driver
treats any parameter that starts with the prefix `device-setting/` as a device setting override.

Device setting overrides can be provided in format `<deviceSettingPrefix><deviceSetting>: "<deviceSettingValue>"`.

A valid device setting override starts with `device-setting/` and the `deviceSetting` has to be a
valid block device setting in the kernel used. Relative paths to the device setting are not allowed.

For example, to set `deviceSetting` /sys/block/sda/queue/scheduler (here, `/sys/block/sda` is an
example block device) to `mq-deadline`, you should specify the following override in `parameters`
section of `StorageClass`.

```yaml
  device-setting/queue/scheduler: "mq-deadline"
```

There are no limitations to how many settings you can specify using this `perfProfile`.

If `perfProfile` is set to **Advanced**, at least one device setting override should be provided in
the `parameters`.

If you do not specify a device setting override and the `perfProfile` is set to `Advanced`,
the CSI driver fails during disk creation using this `StorageClass`.

Any incorrect `deviceSetting` overrides specified in the `parameters` section results in failure of
disk staging on the node and results in pod scheduling failure.

The following is an examples of an invalid device setting override. This override is invalid
because `deviceSetting` uses a relative path (`..`). This results in disk staging failure and causes
the pod to be stuck.

```yaml
  device-setting/../queue/scheduler: "mq-deadline"
```

Care should be taken when using the **Advanced** option with `perfProfile`. Be sure to test all the
`deviceSetting` overrides in Linux kernel that you plan to use before implementing them in a production
cluster.

The following is an example YAML file with `StorageClass` that includes some well known block device settings
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

Consider `StorageClass` `sc-test-postgresql-p20-optimized` in below example, which can optimize a p20 azure disk to get increased combined throughput, IOPS and better IO latency for a PostresSQL inspired fio workload.

To try the optimizations, follow below step:

- Create an aks cluster with `Standard_D4s_v4` VM SKU nodepool.

- Install azuredisk CSI driver v2 using instructions [here](https://github.com/kubernetes-sigs/azuredisk-csi-driver/tree/main_v2/charts).

- Install kubestone.

```console
kustomize build github.com/xridge/kubestone/config/default?ref=v0.5.0 | sed "s/kubestone:latest/kubestone:v0.5.0/" | kubectl create -f -

kubectl create namespace kubestone
```

- To run fio workload with optimized disks

```console
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

- To run same fio workload with un-optimized disk

```console
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

- To uninstall kubestone

```console
kubectl delete namespace kubestone --ignore-not-found

kustomize build github.com/xridge/kubestone/config/default?ref=v0.5.0 | sed "s/kubestone:latest/kubestone:v0.5.0/" | kubectl delete --ignore-not-found -f -
```

- To delete StorageClass

```console
kubectl delete sc sc-test-postgresql-p20 --ignore-not-found

kubectl delete sc sc-test-postgresql-p20-optimized --ignore-not-found
```

- To uninstall azuredisk CSI driver v2 use instructions [here](https://github.com/kubernetes-sigs/azuredisk-csi-driver/tree/main_v2/charts)

## Limitations

- This feature is not supported for HDD or UltraDisk right now.
- This feature only optimizes data disks (PVs). Local/temp disks on the VM are not optimized by this feature.
- The current implementation only optimizes the disks which use the storVsc linux disk driver.

## Caution

- This feature is currently in `alpha` and customers are advised to not use this feature in their production workloads.
- Device tuned using the `Basic` and `Advanced` `perfProfile` options can show variance in performance due to several factors including (but not limited to) disk size, VM SKU, disk caching mode, linux distribution and kernel version, workload type. Customers are advised to test the `perfProfile` they chose in the controlled environment to ascertain the performance benefits, before using them.