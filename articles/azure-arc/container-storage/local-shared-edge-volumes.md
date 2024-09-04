---
title: Local Shared Edge Volume configuration for Edge Volumes
description: Learn about Local Shared Edge Volume configuration for Edge Volumes.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
---

# Local Shared Edge Volumes

This article describes the configuration for Local Shared Edge Volumes (highly available, durable local storage).

## What is a Local Shared Edge Volume?

The *Local Shared Edge Volumes* feature provides highly available, failover-capable storage, local to your Kubernetes cluster. This shared storage type remains independent of cloud infrastructure, making it ideal for scratch space, temporary storage, and locally persistent data that might be unsuitable for cloud destinations.

## Create a Local Shared Edge Volumes Persistent Volume Claim (PVC) and configure a pod against the PVC

1. Create a file named `localSharedPVC.yaml` with the following contents. Modify the `metadata::name` value with a name for your Persistent Volume Claim. Then, in line 8, specify the namespace that matches your intended consuming pod. The `metadata::name` value is referenced on the last line of `deploymentExample.yaml` in the next step.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   kind: PersistentVolumeClaim
   apiVersion: v1
   metadata:
     ### Create a name for your PVC ###
     name: <create-a-pvc-name-here>
     ### Use a namespace that matches your intended consuming pod, or "default" ###
     namespace: <intended-consuming-pod-or-default-here>
   spec:
     accessModes:
       - ReadWriteMany
     resources:
       requests:
         storage: 2Gi
     storageClassName: unbacked-sc
   ```

1. Create a file named `deploymentExample.yaml` with the following contents. Add the values for `containers::name` and `volumes::persistentVolumeClaim::claimName`:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: localsharededgevol-deployment ### This will need to be unique for every volume you choose to create
   spec:
     replicas: 2
     selector:
       matchLabels:
         name: wyvern-testclientdeployment
     template:
       metadata:
         name: wyvern-testclientdeployment
         labels:
           name: wyvern-testclientdeployment
       spec:
         affinity:
           podAntiAffinity:
             requiredDuringSchedulingIgnoredDuringExecution:
               - labelSelector:
                   matchExpressions:
                     - key: app
                       operator: In
                       values:
                         - wyvern-testclientdeployment
                 topologyKey: kubernetes.io/hostname
         containers:
           ### Specify the container in which to launch the busy box. ###
           - name: <create-a-container-name-here>
             image: 'mcr.microsoft.com/mirror/docker/library/busybox:1.35'
             command:
               - "/bin/sh"
               - "-c"
               - "dd if=/dev/urandom of=/data/esalocalsharedtestfile count=16 bs=1M && while true; do ls /data &>/dev/null || break; sleep 1; done"
             volumeMounts:
               ### This name must match the following volumes::name attribute ###
               - name: wyvern-volume
                 ### This mountPath is where the PVC will be attached to the pod's filesystem ###
                 mountPath: /data
         volumes:
           ### User-defined name that is used to link the volumeMounts. This name must match volumeMounts::name as previously specified. ###
           - name: wyvern-volume
             persistentVolumeClaim:
               ### This claimName must refer to your PVC metadata::name from lsevPVC.yaml.
               claimName: <your-pvc-metadata-name-from-line-5-of-pvc-yaml>
   ```

1. To apply these YAML files, run:

   ```bash
   kubectl apply -f "localSharedPVC.yaml"
   kubectl apply -f "deploymentExample.yaml"
   ```

1. Run `kubectl get pods` to find the name of your pod. Copy this name, as it's needed in the next step.

   > [!NOTE]
   > Because `spec::replicas` from `deploymentExample.yaml` was specified as `2`, two pods appear using `kubectl get pods`. You can choose either pod name to use for the next step.

1. Run the following command and replace `POD_NAME_HERE` with your copied value from the previous step:

   ```bash
   kubectl exec -it pod_name_here -- sh
   ```

1. Change directories to the `/data` mount path, as specified in `deploymentExample.yaml`.

1. As an example, create a file named `file1.txt` and write to it using `echo "Hello World" > file1.txt`.

After you complete the previous steps, begin monitoring your deployment using Azure Monitor and Kubernetes Monitoring, or third-party monitoring with Prometheus and Grafana.

## Next steps

[Monitor your deployment](monitor-deployment-edge-volumes.md)
