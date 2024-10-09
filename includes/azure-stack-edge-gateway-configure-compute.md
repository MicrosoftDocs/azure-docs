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

It can take 20-30 minutes to configure compute because, behind the scenes, virtual machines, and a Kubernetes cluster are being created.
