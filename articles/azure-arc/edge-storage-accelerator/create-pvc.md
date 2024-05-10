---
title: Create a Persistent Volume Claim (PVC) (preview)
description: Learn how to create a Persistent Volume Claim (PVC) in Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024

---

# Create a Persistent Volume Claim (PVC) (preview)

The PVC is a persistent volume claim against the persistent volume that you can use to mount a Kubernetes pod.

This size does not affect the ceiling of blob storage used in the cloud to support this local cache. Note the name of this PVC, as you need it when you create your application pod.  

## Create PVC

1. Create a file named **pvc.yaml** with the following contents:

   ```yaml
   apiVersion: v1 
   kind: PersistentVolumeClaim 
   metadata:
       ### Create a name for your PVC ###
       name: CREATE_A_NAME_HERE
       ### Use a namespace that matched your intended consuming pod, or "default" ###
       namespace: INTENDED_CONSUMING_POD_OR_DEFAULT_HERE
   spec: 
       accessModes: 
           - ReadWriteMany 
       resources: 
           requests: 
               storage: 5Gi 
       storageClassName: esa
       volumeMode: Filesystem
       ### This name references your PV name in your PV config ###
       volumeName: INSERT_YOUR_PV_NAME
   status: 
       accessModes: 
           - ReadWriteMany 
       capacity: 
           storage: 5Gi
   ```

   > [!NOTE]
   > If you intend to use your PVC with the Azure IoT Operations Data Processor, use `azure-iot-operations` as the `namespace` on line 7.

1. To apply this .yaml file, run:

    ```bash
    kubectl apply -f "pvc.yaml"
    ```

## Next steps

After you create a Persistent Volume Claim (PVC), attach your app (Azure IoT Operations Data Processor or Kubernetes Native Application):

[Attach your app](attach-app.md)
