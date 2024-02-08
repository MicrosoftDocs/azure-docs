---
title: Tutorial to filter, analyze data with compute on Azure Stack Edge Pro GPU | Microsoft Docs
description: Learn how to configure compute role on Azure Stack Edge Pro GPU and use it to transform data before sending to Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 08/04/2023
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to configure compute on Azure Stack Edge Pro so I can use it to transform the data before sending it to Azure.
---

# Tutorial: Configure compute on Azure Stack Edge Pro GPU device

<!--ALPA WILL VERIFY - [!INCLUDE [applies-to-skus](../../includes/azure-stack-edge-applies-to-all-sku.md)]-->

This tutorial describes how to configure a compute role and create a Kubernetes cluster on your Azure Stack Edge Pro GPU device. 

This procedure can take 20 to 30 minutes to complete.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure compute
> * Get Kubernetes endpoints

 [!INCLUDE [deprecation-notice-managed-iot-edge](../../includes/azure-stack-edge-deprecation-notice-managed-iot-edge.md)]

## Prerequisites

Before you set up a compute role on your Azure Stack Edge Pro device:

- Make sure that you've activated your Azure Stack Edge Pro device as described in [Activate Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).
- Make sure that you've followed the instructions in [Enable compute network](azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md#configure-virtual-switches) and:
    - Enabled a network interface for compute.
    - Assigned Kubernetes node IPs and Kubernetes external service IPs.

  > [!NOTE]
  > If your datacenter firewall is restricting or filtering traffic based on source IPs or MAC addresses, make sure that the compute IPs (Kubernetes node IPs) and MAC addresses are on the allowed list. The MAC addresses can be specified by running the `Set-HcsMacAddressPool` cmdlet on the PowerShell interface of the device.

## Configure compute

[!INCLUDE [configure-compute](../../includes/azure-stack-edge-gateway-configure-compute.md)]

## Get Kubernetes endpoints

To configure a client to access Kubernetes cluster, you'll need the Kubernetes endpoint. Follow these steps to get Kubernetes API endpoint from the local UI of your Azure Stack Edge Pro device.

1. In the local web UI of your device, go to **Device** page.
2. Under the **Device endpoints**, copy the **Kubernetes API** endpoint. This endpoint is a string in the following format: `https://compute.<device-name>.<DNS-domain>[Kubernetes-cluster-IP-address]`. 

    ![Screenshot that shows the Device page in local U I.](./media/azure-stack-edge-gpu-create-kubernetes-cluster/device-kubernetes-endpoint-1.png)

3. Save the endpoint string. You'll use this endpoint string later when configuring a client to access the Kubernetes cluster via kubectl.

4. While you are in the local web UI, you can:

    - If you've been provided a key from Microsoft (select users may have a key), go to Kubernetes API, select **Advanced config**, and download an advanced configuration file for Kubernetes. 

        ![Screenshot that shows the Device page in local U I 1.](./media/azure-stack-edge-gpu-deploy-configure-compute/download-advanced-config-1.png)
     
        ![Screenshot that shows the Device page in local U I 2.](./media/azure-stack-edge-gpu-deploy-configure-compute/download-advanced-config-2.png)

    - You can also go to **Kubernetes dashboard** endpoint and download an `aseuser` config file. 
    
        ![Screenshot that shows the Device page in local U I 3.](./media/azure-stack-edge-gpu-deploy-configure-compute/download-aseuser-config-1.png)

        You can use this config file to sign into the Kubernetes dashboard or debug any issues in your Kubernetes cluster. For more information, see [Access Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md#access-dashboard). 


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Configure compute
> * Get Kubernetes endpoints


To learn how to administer your Azure Stack Edge Pro device, see:

> [!div class="nextstepaction"]
> [Use local web UI to administer an Azure Stack Edge Pro](azure-stack-edge-manage-access-power-connectivity-mode.md)
