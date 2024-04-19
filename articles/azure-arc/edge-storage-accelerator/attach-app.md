---
title: Attach your application using the Azure IoT Operations data processor or Kubernetes native application (preview)
description: Learn how to attach your app using the Azure IoT Operations data processor or Kubernetes native application in Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024
zone_pivot_groups: attach-app
---

# Attach your application (preview)

This article assumes you created a Persistent Volume (PV) and a Persistent Volume Claim (PVC). For information about creating a PV, see [Create a persistent volume](create-pv.md). For information about creating a PVC, see [Create a Persistent Volume Claim](create-pvc.md).

::: zone pivot="attach-iot-op"
## Configure the Azure IoT Operations data processor

When you use Azure IoT Operations (AIO), the Data Processor is spawned without any mounts for Edge Storage Accelerator. You can perform the following tasks:

- Add a mount for the Edge Storage Accelerator PVC you created previously.
- Reconfigure all pipelines' output stage to output to the Edge Storage Accelerator mount you just created.  

## Add Edge Storage Accelerator to your aio-dp-runner-worker-0 pods

These pods are part of a **statefulSet**. You can't edit the statefulSet in place to add mount points. Instead, follow this procedure:

1. Dump the statefulSet to yaml:

    ```bash
    kubectl get statefulset -o yaml -n azure-iot-operations aio-dp-runner-worker > stateful_worker.yaml
    ```

1. Edit the statefulSet to include the new mounts for ESA in volumeMounts and volumes:

    ```yaml
    volumeMounts: 
    - mountPath: /etc/bluefin/config 
      name: config-volume 
      readOnly: true 
    - mountPath: /var/lib/bluefin/registry 
      name: nfs-volume 
    - mountPath: /var/lib/bluefin/local 
      name: runner-local
      ### Add the next 2 lines ###
    - mountPath: /mnt/esa 
      name: esa4 
    
    volumes: 
    - configMap: 
        defaultMode: 420 
        name: file-config 
      name: config-volume 
    - name: nfs-volume 
    persistentVolumeClaim: 
      claimName: nfs-provisioner
      ### Add the next 3 lines ### 
    - name: esa4 
      persistentVolumeClaim: 
        claimName: esa4
    ```

1. Delete the existing statefulSet:

    ```bash
    kubectl delete statefulset -n azure-iot-operations aio-dp-runner-worker
    ```

    This deletes all `aio-dp-runner-worker-n` pods. This is an outage-level event.  

1. Create a new statefulSet of aio-dp-runner-worker(s) with the ESA mounts:

    ```bash
    kubectl apply -f stateful_worker.yaml -n azure-iot-operations
    ```

    When the `aio-dp-runner-worker-n` pods start, they include mounts to ESA. The PVC should convey this in the state.

1. Once you reconfigure your Data Processor workers to have access to the ESA volumes, you must manually update the pipeline configuration to use a local path that corresponds to the mounted location of your ESA volume on the worker PODs.

   In order to modify the pipeline, use `kubectl edit pipeline <name of your pipeline>`. In that pipeline, replace your output stage with the following YAML:

   ```yaml
   output:
     batch:
       path: .payload
       time: 60s
     description: An example file output stage
     displayName: Sample File output
     filePath: '{{{instanceId}}}/{{{pipelineId}}}/{{{partitionId}}}/{{{YYYY}}}/{{{MM}}}/{{{DD}}}/{{{HH}}}/{{{mm}}}/{{{fileNumber}}}'
     format:
       type: jsonStream
     rootDirectory: /mnt/esa
     type: output/file@v1
   ```

::: zone-end

::: zone pivot="attach-kubernetes"
## Configure a Kubernetes native application

1. To configure a generic single pod (Kubernetes native application) against the Persistent Volume Claim (PVC), create a file named `configPod.yaml` with the following contents:

   ```yaml
   kind: Deployment
   apiVersion: apps/v1
   metadata:
     name: example-static
     labels:
       app: example-static
     ### Uncomment the next line and add your namespace only if you are not using the default namespace (if you are using azure-iot-operations) as specified from Line 6 of your pvc.yaml. If you are not using the default namespace, all future kubectl commands require "-n YOUR_NAMESPACE" to be added to the end of your command.
     # namespace: YOUR_NAMESPACE
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: example-static
     template:
       metadata:
         labels:
           app: example-static
       spec:
         containers:
           - image: mcr.microsoft.com/cbl-mariner/base/core:2.0
             name: mariner
             command:
               - sleep
               - infinity
             volumeMounts:
               ### This name must match the 'volumes.name' attribute in the next section. ###
               - name: blob
                 ### This mountPath is where the PVC is attached to the pod's filesystem. ###
                 mountPath: "/mnt/blob"
         volumes:
           ### User-defined 'name' that's used to link the volumeMounts. This name must match 'volumeMounts.name' as specified in the previous section. ###
           - name: blob
             persistentVolumeClaim:
               ### This claimName must refer to the PVC resource 'name' as defined in the PVC config. This name must match what your PVC resource was actually named. ###
               claimName: YOUR_CLAIM_NAME_FROM_YOUR_PVC
   ```

   > [!NOTE]
   > If you are using your own namespace, all future `kubectl` commands require `-n YOUR_NAMESPACE` to be appended to the command. For example, you must use `kubectl get pods -n YOUR_NAMESPACE` instead of the standard `kubectl get pods`.

1. To apply this .yaml file, run the following command:

    ```bash
    kubectl apply -f "configPod.yaml"
    ```

1. Use `kubectl get pods` to find the name of your pod. Copy this name, as you need it for the next step.

1. Run the following command and replace `POD_NAME_HERE` with your copied value from the previous step:

   ```bash
   kubectl exec -it POD_NAME_HERE -- bash
   ```

1. Change directories into the `/mnt/blob` mount path as specified from your `configPod.yaml`.

1. As an example, to write a file, run `touch file.txt`.

1. In the Azure portal, navigate to your storage account and find the container. This is the same container you specified in your `pv.yaml` file. When you select your container, you see `file.txt` populated within the container.

::: zone-end

## Next steps

After you complete these steps, begin monitoring your deployment using Azure Monitor and Kubernetes Monitoring or third-party monitoring with Prometheus and Grafana:

[Third-party monitoring](third-party-monitoring.md)