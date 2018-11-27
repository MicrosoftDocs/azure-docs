---
title: Transform data with Azure Data Box Edge | Microsoft Docs
description: Learn how to configure compute role on Data Box Edge and use it to transform data before sending to Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 11/27/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to configure compute on Data Box Edge so I can use it to transform the data before sending it to Azure.
---

# Tutorial: Transform data with Azure Data Box Edge (preview)

This tutorial describes how to configure a compute role on your Azure Data Box Edge device. After you configure the compute role, Data Box Edge can transform data before sending it to Azure.

This procedure can take around 30 to 45 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure IoT Hub resource
> * Set up compute role
> * Add a compute module
> * Verify data transform and transfer

> [!IMPORTANT]
> Data Box Edge is in preview. Before you order and deploy this solution, review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
## Prerequisites

Before you set up a compute role on your Data Box Edge device, make sure that:

* You've activated your Data Box Edge device as described in [Connect, set up, and activate Azure Data Box Edge](data-box-edge-deploy-connect-setup-activate.md).


## Create an IoT Hub resource

Before you set up a compute role on Data Box Edge, you must create an IoT Hub resource.

For detailed instructions, go to [Create an IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal#create-an-iot-hub). Use the same subscription and resource group that you used for your Data Box Edge resource.

![Create an IoT Hub resource](./media/data-box-edge-deploy-configure-compute/create-iothub-resource-1.png)

If an Edge compute role hasn't been set up, the following caveats apply:

- The IoT Hub resource doesn't have any Azure IoT devices or Azure IoT Edge devices.
- You can't create Edge local shares. When you add a share, the option to create a local share for Edge compute isn't enabled.


## Set up compute role

When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource.

To set up the compute role on the device, do the following:

1. Go to the Data Box Edge resource, select **Overview**, and then select **Set up compute role**. 

    ![The Overview link in the left pane](./media/data-box-edge-deploy-configure-compute/setup-compute-1.png)
   
    Optionally, you can go to **Modules** and select **Configure compute**.

    ![The "Modules" and "Configure compute" links](./media/data-box-edge-deploy-configure-compute/setup-compute-2.png)
 
1. In the drop-down list, select the **IoT Hub resource** you created in the previous step.  
    At this point, only the Linux platform is available for your IoT Edge device. 
    
1. Click **Create**.

    ![The Create button](./media/data-box-edge-deploy-configure-compute/setup-compute-3.png)
 
    The compute role takes a couple minutes to create. Because of a bug in this release, even when the compute role is created, the screen doesn't refresh. To confirm that the Edge compute role has been configured, go to **Modules**.  

    ![The "Configure Edge compute" device list](./media/data-box-edge-deploy-configure-compute/setup-compute-4.png)

1. Go to **Overview** again.  
    The screen is updated to indicate that the compute role is configured.

    ![Set up a compute role](./media/data-box-edge-deploy-configure-compute/setup-compute-5.png)
 
1. In the IoT Hub that you used when you created the Edge compute role, go to **IoT devices**.  
    An IoT device is now enabled. 

    ![The "IoT devices" page](./media/data-box-edge-deploy-configure-compute/setup-compute-6.png)

1. In the left pane, select **IoT Edge**.  
    An IoT Edge device is also enabled.

    ![Set up a compute role](./media/data-box-edge-deploy-configure-compute/setup-compute-7.png)
 
1. Select and click the IoT Edge device.  
    An Edge agent is running on this IoT Edge device. 

    ![The Device Details page](./media/data-box-edge-deploy-configure-compute/setup-compute-8.png) 

    There are no custom modules on this Edge device, but you can now add a custom module. To learn how to create a custom module, go to [Develop a C# module for your Data Box Edge device](data-box-edge-create-iot-edge-module.md).


## Add a custom module

In this section, you add a custom module to the IoT Edge device that you created in [Develop a C# module for your Data Box Edge](data-box-edge-create-iot-edge-module.md). 

The following procedure uses an example where the custom module takes files from a local share on the Edge device and moves them to a cloud share on the device. The cloud share then pushes the files to the Azure storage account that's associated with the cloud share. 

1. Add a local share on the Edge device by doing the following:

    a. In your Data Box Edge resource, go to **Shares**. 
    
    b. Select **Add share**, and then provide the share name and select the share type. 
    
    c. To create a local share, select the **Configure as Edge local share** check box. 
    
    d. Select **Create new** or **Use existing**, and then select **Create**.

    ![Add custom module](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-1.png) 

    If you created a local NFS share, use the following remote sync (rsync) command option to copy files onto the share:

    `rsync --inplace <source file path> < destination file path>`

     For more information about the rsync command, go to [Rsync documentation](https://www.computerhope.com/unix/rsync.htm). 

 
    The local share is created, and you'll receive a successful creation notification. The share list might be updated, but you must wait for the share creation to be completed.
    
1. Go to the list of shares. 

    ![Add custom module](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-2.png) 
 
1. To view the properties of the newly created local share, select it. 

1. In the **Local mount point for Edge compute modules** box, copy the value corresponding to this share.  
    You'll use this local mount point when you deploy the module.

    ![The "Local mount point for Edge compute modules" box](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-3.png) 
 
1. On an existing cloud share that was created on your Data Box Edge device, in the **Local mount point for Edge compute modules** box, copy the local mount point for Edge compute modules for this cloud share.  
    You'll use this local mount point when you deploy the module.

    ![Add custom module](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-4.png)  

1. To add a custom module to the IoT Edge device, go to your IoT Hub resource, and then go to **IoT Edge device**. 

1. Select the device and then, under **Device details**, select **Set Modules**. 

    ![The Set Modules link](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-5.png) 

1. Under **Add Modules**, do the following:

    a. Enter the name, address, user name, and password for the container registry settings for the custom module.  
    The name, address, and listed credentials are used to retrieve modules with a matching URL. To deploy this module, under **Deployment modules**, select **IoT Edge module**. This IoT Edge module is a docker container that you can deploy to the IoT Edge device that's associated with your Data Box Edge device.

    ![The Set Modules page](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-6.png) 
 
    b. Specify the settings for the IoT Edge custom module by entering the name of your module and the image URI for the corresponding container image. 
    
    ![The IoT Edge Custom Modules page](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-7.png) 

    c. In the **Container Create Options** box, enter the local mount points for the Edge modules that you copied in the preceding steps for the cloud and local share.
    > [!IMPORTANT]
    > Use the copied paths; do not create new paths. The local mount points are mapped to the corresponding **InputFolderPath** and the **OutputFolderPath** that you specified in the module when you [updated the module with custom code](data-box-edge-create-iot-edge-module.md#update-the-module-with-custom-code). 
    
    In the **Container Create Options** box, you can paste the following sample: 
    
    ```
    {
        "HostConfig": {
        "Binds": [
        "/home/hcsshares/mysmblocalshare:/home/LocalShare",
        "/home/hcsshares/mysmbshare1:/home/CloudShare"
        ]
        }
    }
    ```

    Also provide any environmental variables here for your module.

    ![The Container Create Options box](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-8.png) 
 
    d. If necessary, configure the advanced Edge runtime settings, and then click **Next**.

    ![Add custom module](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-9.png) 
 
1.	Under **Specify Routes**, set routes between modules.  
    In this example, enter the name of the local share that will push data to the cloud share.

    You can replace *route* with the following route string:
          `"route": "FROM /* WHERE topic = 'mysmblocalshare' INTO BrokeredEndpoint(\"/modules/filemovemodule/inputs/input1\")"`

    ![The Specify Routes section](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-10.png) 

1. Select **Next**. 

1.	Under **Review deployment**, review all the settings, and then select **Submit** to submit the module for deployment.

    ![The Set Modules page](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-11.png) 
 
    This action starts the module deployment as shown in the following image:

    ![Add custom module](./media/data-box-edge-deploy-configure-compute/add-a-custom-module-12.png) 

### Verify data transform and transfer

The final step is to ensure that the module is connected and running as expected. The run-time status of the module should be running for your IoT Edge device in the IoT Hub resource.

![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-1.png) 
 
To verify that the module is running, do the following:

1. Select the module, and then view the Module Identity Twin.  
    The client status for the Edge device and module should be displayed as *Connected*.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-2.png) 
 
    After the module is running, it is also displayed under the list of Edge modules in your Data Box Edge resource. The runtime status of the module you added is *running*.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-3.png) 
 
1.	In File Explorer, connect to both the local and cloud shares you created previously.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-4.png) 
 
1.	Add data to the local share.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-5.png) 
 
    The data gets moved to the cloud share.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-6.png)  

    The data is then pushed from the cloud share to the storage account. To view the data, go to the Storage Explorer to view the data.

    ![Verify data transform](./media/data-box-edge-deploy-configure-compute/verify-data-transform-7.png) 
 
You have completed the validation process.


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an IoT Hub resource
> * Set up compute role
> * Add a compute module
> * Verify data transform and transfer

To learn how to administer your Data Box Edge device, see:

> [!div class="nextstepaction"]
> [Use local web UI to administer a Data Box Edge](https://aka.ms/dbg-docs)


