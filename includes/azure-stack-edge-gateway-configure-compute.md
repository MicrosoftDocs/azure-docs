---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/01/2024
ms.author: alkohli
---

To configure compute on your Azure Stack Edge Pro, you create an IoT Hub resource via Azure portal.

1. In the Azure portal of your Azure Stack Edge resource, go to **Overview**, and select **Kubernetes for Azure Stack Edge**.

   ![Get started with compute](./media/azure-stack-edge-gateway-configure-compute/configure-compute-1.png)

2. In **Get started with Kubernetes service**, select **Add**.

   ![Configure compute](./media/azure-stack-edge-gateway-configure-compute/configure-compute-2.png)

3. After the resource is created, the **Overview** indicates that the Kubernetes service is online.

   ![Get started with compute 3](./media/azure-stack-edge-gateway-configure-compute/configure-compute-4.png)

   When the Edge compute role is set up on the Edge device, it creates two devices: an IoT device and an IoT Edge device. Both devices can be viewed in the IoT Hub resource. An IoT Edge Runtime is also running on this IoT Edge device. At this point, only the Linux platform is available for your IoT Edge device.

It can take 20-30 minutes to configure compute because, behind the scenes, virtual machines, and a Kubernetes cluster are being created.

After you configure compute in Azure portal, a Kubernetes cluster and a default user associated with the IoT namespace (a system namespace controlled by Azure Stack Edge) exist.
