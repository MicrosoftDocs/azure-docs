---
title: Use an IoT Edge module to deploy compute workload on Azure Stack Edge Pro with GPU | Microsoft Docs
description: Learn how to run a compute workload using a pre-created IoT Edge module on your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 10/19/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to configure compute on Azure Stack Edge Pro so I can use it to transform the data before sending it to Azure.
---

# Tutorial: Run a compute workload with IoT Edge module on Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

> [!NOTE]
> We strongly recommend that you deploy the latest IoT Edge version in a Linux VM. The managed IoT Edge on Azure Stack Edge uses an older version of IoT Edge runtime that doesn’t have the latest features and patches. For instructions, see how to [Deploy an Ubuntu VM](azure-stack-edge-gpu-deploy-iot-edge-linux-vm.md). For more information on other supported Linux distributions that can run IoT Edge, see [Azure IoT Edge supported systems – Container engines](../iot-edge/support.md#linux-containers).

This tutorial describes how to run a compute workload using an IoT Edge module on your Azure Stack Edge Pro GPU device. After you configure the compute, the device will transform the data before sending it to Azure.

This procedure can take around 10 to 15 minutes to complete.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure compute
> * Add shares
> * Add a compute module
> * Verify data transform and transfer

 
## Prerequisites

Before you set up a compute role on your Azure Stack Edge Pro GPU device, make sure that:

- You've activated your Azure Stack Edge Pro device as described in [Activate your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).
- You have an IoT Edge module that you can run on your data. In this tutorial, we used a `filemove2` module that moves data from Edge local share on your device to Edge share from where the data goes to Azure Storage account.


## Configure compute

[!INCLUDE [configure-compute](../../includes/azure-stack-edge-gateway-configure-compute.md)]


## Add shares

For the simple deployment in this tutorial, you'll need two shares: one Edge share and another Edge local share.

1. To add an Edge share on the device, do the following steps:

    1. In your Azure Stack Edge resource, go to **Cloud storage gateway > Shares**.
    2. From the command bar, select **+ Add share**.
    3. On the **Add share** blade, provide the share name and select the share type.
    4. To mount the Edge share, select the check box for **Use the share with Edge compute**.
    5. Select the **Storage account**, **Storage service**, an existing user, and then select **Create**.

        ![Add an Edge share](./media/azure-stack-edge-gpu-deploy-compute-module-simple/add-edge-share-1.png) 


    > [!NOTE]
    > To mount NFS share to compute, the compute network must be configured on same subnet as NFS Virtual IP address. For details on how to configure compute network, go to [Enable compute network on your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).

    The Edge share is created, and you'll receive a successful creation notification. The share list might be updated, but you must wait for the share creation to be completed.

2. To add an Edge local share on the device, repeat all the steps in the preceding step and select the check box for **Configure as Edge local share**. The data in the local share stays on the device.

    ![Add an Edge local share](./media/azure-stack-edge-gpu-deploy-compute-module-simple/add-edge-share-2.png)

    If you created a local NFS share, use the following remote sync (rsync) command option to copy files onto the share:

    `rsync <source file path> < destination file path>`

    For more information about the `rsync` command, go to [`Rsync` documentation](https://www.computerhope.com/unix/rsync.htm).
 
3. Go to **Cloud storage gateway > Shares** to see the updated list of shares.

    ![Updated list of shares](./media/azure-stack-edge-gpu-deploy-compute-module-simple/add-edge-share-3.png) 
 

## Add a module

You could add a custom or a pre-built module. The device does not come with pre-built or custom modules. To learn how to create a custom module, go to [Develop a C# module for your Azure Stack Edge Pro device](./azure-stack-edge-gpu-create-iot-edge-module.md).

In this section, you add a custom module to the IoT Edge device that you created in [Develop a C# module for your Azure Stack Edge Pro](./azure-stack-edge-gpu-create-iot-edge-module.md). This custom module takes files from an Edge local share on the Edge device and moves them to an Edge (cloud) share on the device. The cloud share then pushes the files to the Azure storage account that's associated with the cloud share.

To add a module, do the following steps:

1. Go to **IoT Edge > Modules**. From the command bar, select **+ Add module**. 

2. In the **Add module** blade, input the following values:

    
    |Field  |Value  |
    |---------|---------|
    |Name     | A unique name for the module. This module is a docker container that you can deploy to the IoT Edge device that's associated with your Azure Stack Edge Pro.        |
    |Image URI     | The image URI for the corresponding container image for the module.        |
    |Credentials required     | If checked, username and password are used to retrieve modules with a matching URL.        |
    |Input share     | Select an input share. The Edge local share is the input share in this case. The module used here moves files from the Edge local share to an Edge share where they are uploaded into the cloud.        |
    |Output share     | Select an output share. The Edge share is the output share in this case.        |
    |Trigger type     | Select from **File** or **Schedule**. A file trigger fires whenever a file event occurs such as a file is written to the input share. A scheduled trigger fires up based on a schedule defined by you.         |
    |Trigger name     | A unique name for your trigger.         |
    |Environment variables| Optional information that will help define the environment in which your module will run.   |

    ![Add and configure module](./media/azure-stack-edge-gpu-deploy-compute-module-simple/add-module-1.png)

3. Select **Add**. The module gets added. The **IoT Edge > Modules** page updates to indicate that the module is deployed. The runtime status of the module you added should be *running*.

    ![Module deployed](./media/azure-stack-edge-gpu-deploy-compute-module-simple/add-module-2.png)

### Verify data transform and transfer

The final step is to ensure that the module is running and processing data as expected. The run-time status of the module should be running for your IoT Edge device in the IoT Hub resource.

To verify that the module is running and processing data as expected, do the following:


1. In File Explorer, connect to both the Edge local and Edge shares you created previously. See the steps 

    ![Connect to Edge local and Edge cloud shares](./media/azure-stack-edge-gpu-deploy-compute-module-simple/verify-data-1.png) 
 
1. Add data to the local share.

    ![File copied to Edge local share](./media/azure-stack-edge-gpu-deploy-compute-module-simple/verify-data-2.png) 
 
   The data gets moved to the cloud share.

    ![File moved to Edge cloud share](./media/azure-stack-edge-gpu-deploy-compute-module-simple/verify-data-3.png)  

   The data is then pushed from the cloud share to the storage account. To view the data, you can use Storage Explorer or Azure Storage in portal.

    ![Verify data in storage account](./media/azure-stack-edge-gpu-deploy-compute-module-simple/verify-data-4.png)
 
You have completed the validation process.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure compute
> * Add shares
> * Add a compute module
> * Verify data transform and transfer

To learn how to administer your Azure Stack Edge Pro device, see:

> [!div class="nextstepaction"]
> [Use local web UI to administer an Azure Stack Edge Pro](azure-stack-edge-gpu-manage-access-power-connectivity-mode.md)