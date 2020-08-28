---
title: Manage compute network on Azure Stack Edge with GPU to access modules| Microsoft Docs 
description: Describes how to extend the compute network on your Azure Stack Edge to access modules via an external IP.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 08/04/2020
ms.author: alkohli
---
# Enable compute network on your Azure Stack Edge GPU device

[!INCLUDE [applies-to-skus](../../includes/azure-stack-edge-applies-to-all-sku.md)]

This article describes how the modules running on your Azure Stack Edge can access the compute network enabled on the device.

To configure the network, you'll take the following steps:

- Enable a network interface on your Azure Stack Edge device for compute
- Add a module to access compute network on your Azure Stack Edge
- Verify the module can access the enabled network interface

In this tutorial, you'll use a webserver app module to demonstrate the scenario.

## Prerequisites

Before you begin, you'll need:

- A Azure Stack Edge device with GPU. The device is activated with the service in Azure portal.
- You've completed **Configure compute** step as per the [Tutorial: Transform data with Azure Stack Edge](azure-stack-edge-j-series-deploy-configure-compute-advanced.md#configure-compute) on your device. Your device should have an associated IoT Hub resource, an IoT device, and an IoT Edge device.

## Enable network interface for compute

To access the modules running on your device via an external network, you'll need to assign an IP address to a network interface on your device. You can manage these compute settings from your local web UI.

Take the following steps on your local web UI to configure compute settings.

1. In the local web UI, go to **Configuration > Compute**.  

    ![Enable compute settings 1](media/azure-stack-edge-j-series-extend-compute-access-modules/enable-compute-setting-1.png)

2. **Enable** the network interface that you want to use to connect to a compute module that you'll run on the device.

    ![Enable compute settings 2](media/azure-stack-edge-j-series-extend-compute-access-modules/enable-compute-setting-2.png)

3. Select **Apply** to apply the settings.

    ![Enable compute settings 3](media/azure-stack-edge-j-series-extend-compute-access-modules/enable-compute-setting-3.png)
 
    
## Add webserver app module

Take the following steps to add a webserver app module on your Azure Stack Edge device.

1. Go to the IoT Hub resource associated with your Azure Stack Edge device and then select **IoT Edge device**.
2. Select the IoT Edge device associated with your Azure Stack Edge device. On the **Device details**, select **Set modules**. On **Add modules**, select **+ Add** and then select **IoT Edge Module**.
3. In the **IoT Edge custom modules** blade:

    1. Specify a **Name** for your webserver app module that you want to deploy.
    2. Provide an **Image URI** for your module image. A module matching the provided name and tags is retrieved. In this case, `nginx:stable` will pull a stable nginx image (tagged as stable) from the public [Docker repository](https://hub.docker.com/_/nginx/).
    3. In the **Container Create Options**, paste the following sample code:  

        ```
        {
            "HostConfig": {
                "PortBindings": {
                    "80/tcp": [
                        {
                            "HostPort": "8080"
                        }
                    ]
                }
            }
        }
        ```

        This configuration lets you access the module using the compute network IP over *http* on TCP port 8080 (with the default webserver port being 80).

        ![Specify port information in IoT Edge custom module blade](media/azure-stack-edge-j-series-extend-compute-access-modules/module-information.png)

    4. Select **Save**.


<!--## Get IP address for compute network interface - these steps will come later.-->

## Verify module access

1. Verify the module is successfully deployed and is running. On the **Device Details** page, on the **Modules** tab, the runtime status of the module should be **running**.  
2. Connect to the web server app module. Open a browser window and type:

    `http://<compute-network-IP-address>:8080`

    You should see that the webserver app is running.

    ![Verify connection to module over specified port](media/azure-stack-edge-j-series-extend-compute-access-modules/verify-connect-module-1.png)

## Next steps

- Learn how to [Manage users via Azure portal](azure-stack-edge-j-series-manage-users.md).
