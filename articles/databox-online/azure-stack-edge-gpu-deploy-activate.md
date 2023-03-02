---
title: Tutorial to activate Azure Stack Edge Pro device with GPU in Azure portal | Microsoft Docs
description: Tutorial to deploy Azure Stack Edge Pro GPU instructs you to activate your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 05/31/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to activate Azure Stack Edge Pro so I can use it to transfer data to Azure. 
---
# Tutorial: Activate Azure Stack Edge Pro with GPU

This tutorial describes how you can activate your Azure Stack Edge Pro device with an onboard GPU by using the local web UI.

The activation process can take around 5 minutes to complete.

In this tutorial, you learned about:

> [!div class="checklist"]
> * Prerequisites
> * Activate the physical device

## Prerequisites

Before you configure and set up your Azure Stack Edge Pro device with GPU, make sure that:

* For your physical device: 
    
    - You've installed the physical device as detailed in [Install Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-install.md).
    - You've configured the network and compute network settings as detailed in [Configure network, compute network, web proxy](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md)
    - You've uploaded your own or generated the device certificates on your device if you changed the device name or the DNS domain via the **Device** page. If you haven't done this step, you'll see an error during the device activation and the activation will be blocked. For more information, go to [Configure certificates](azure-stack-edge-gpu-deploy-configure-certificates.md).
    
* You have the activation key from the Azure Stack Edge service that you created to manage the Azure Stack Edge Pro device. For more information, go to [Prepare to deploy Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md).


## Activate the device

1. In the local web UI of the device, go to **Get started** page.
2. On the **Activation** tile, select **Activate**. 

    ![Screenshot that shows the local web U I "Cloud details" page.](./media/azure-stack-edge-gpu-deploy-activate/activate-1.png)
    
3. In the **Activate** pane, enter the **Activation key** that you got in [Get the activation key for Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md#get-the-activation-key).

4. Select **Apply**.

    ![Screenshot that shows the local web U I "Cloud details" page 2.](./media/azure-stack-edge-gpu-deploy-activate/activate-2.png)


5. First the device is activated. You're then prompted to download the key file.
    
    ![Screenshot that shows the local web U I "Cloud details" page 3.](./media/azure-stack-edge-gpu-deploy-activate/activate-3.png)
    
    Select **Download and continue** and save the *device-serial-no.json* file in a safe location outside of the device. **This key file contains the recovery keys for the OS disk and data disks on your device**. These keys may be needed to facilitate a future system recovery.

    Here are the contents of the *json* file:

        
    ```json
    {
      "Id": "<Device ID>",
      "DataVolumeBitLockerExternalKeys": {
        "hcsinternal": "<BitLocker key for data disk>",
        "hcsdata": "<BitLocker key for data disk>"
      },
      "SystemVolumeBitLockerRecoveryKey": "<BitLocker key for system volume>",
      "ServiceEncryptionKey": "<Azure service encryption key>"
    }
    ```
        
 
    The following table explains the various keys:
    
    |Field  |Description  |
    |---------|---------|
    |`Id`    | This is the ID for the device.        |
    |`DataVolumeBitLockerExternalKeys`|These are the BitLocker keys for the data disks and are used to recover the local data on your device.|
    |`SystemVolumeBitLockerRecoveryKey`| This is the BitLocker key for the system volume. This key helps with the recovery of the system configuration and system data for your device. |
    |`ServiceEncryptionKey`| This key protects the data flowing through the Azure service. This key ensures that a compromise of the Azure service won't result in a compromise of stored information. |

6. Go to the **Overview** page. The device state should show as **Activated**.

    ![Screenshot that shows the local web U I "Cloud details" page 4.](./media/azure-stack-edge-gpu-deploy-activate/activate-4.png)
 
The device activation is complete. You can now add shares on your device.

If you encounter any issues during activation, go to [Troubleshoot activation and Azure Key Vault errors](azure-stack-edge-gpu-troubleshoot-activation.md#activation-errors).



## Deploy workloads

After you've activated the device, the next step is to deploy workloads.

- To deploy VM workloads, see [What are VMs on Azure Stack Edge?](azure-stack-edge-gpu-virtual-machine-overview.md) and the associated VM deployment documentation.
- To deploy network functions as managed applications:
    - Make sure that you create a Device resource for Azure Network Function Manager (NFM) that is linked to the Azure Stack Edge resource. The device resource aggregates all the network functions deployed on Azure Stack Edge device. For detailed instructions, see [Tutorial: Create a Network Function Manager Device resource (Preview)](../network-function-manager/create-device.md). 
    - You can then deploy Network Function Manager as per the instructions in [Tutorial: Deploy network functions on Azure Stack Edge (Preview)](../network-function-manager/deploy-functions.md).
- To deploy IoT Edge and Kubernetes workloads:
    - You'll need to first configure compute as described in [Tutorial: Configure compute on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-configure-compute.md). This step creates a Kubernetes cluster that acts as the hosting platform for IoT Edge on your device. 
    - After a Kubernetes cluster is created on your Azure Stack Edge device, you can deploy application workloads on this cluster via any of the following methods:

        - Native access via `kubectl`
        - IoT Edge
        - Azure Arc
        
        For more information on workload deployment, see [Kubernetes workload management on your Azure Stack Edge device](azure-stack-edge-gpu-kubernetes-workload-management.md).

## Next steps

In this tutorial, you learned about:

> [!div class="checklist"]
> * Prerequisites
> * Activate the physical device

To learn how to transfer data with your Azure Stack Edge Pro device, see:

> [!div class="nextstepaction"]
> [Transfer data with Azure Stack Edge Pro](./azure-stack-edge-gpu-deploy-add-shares.md)