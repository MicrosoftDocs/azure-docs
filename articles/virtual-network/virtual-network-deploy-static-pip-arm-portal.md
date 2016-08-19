<properties 
   pageTitle="Deploy a VM with a static public IP using the Azure portal in Resource Manager | Microsoft Azure"
   description="Learn how to deploy VMs with a static public IP using the zure portal in Resource Manager"
   services="virtual-network"
   documentationCenter="na"
   authors="jimdial"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"
/>
<tags  
   ms.service="virtual-network"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/04/2016"
   ms.author="jdial" />

# Deploy a VM with a static public IP using the Azure portal

[AZURE.INCLUDE [virtual-network-deploy-static-pip-arm-selectors-include.md](../../includes/virtual-network-deploy-static-pip-arm-selectors-include.md)]

[AZURE.INCLUDE [virtual-network-deploy-static-pip-intro-include.md](../../includes/virtual-network-deploy-static-pip-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.

[AZURE.INCLUDE [virtual-network-deploy-static-pip-scenario-include.md](../../includes/virtual-network-deploy-static-pip-scenario-include.md)]

## Create a VM with a static public IP 

To create a VM with a static public IP address in the Azure portal, follow the steps below.

1. From a browser, navigate to the [Azure portal](https://portal.azure.com) and, if necessary, sign in with your Azure account.
2. On the top left hand corner of the portal, click **New**>>**Compute**>**Windows Server 2012 R2 Datacenter**.
3. In the **Select a deployment model** list, select **Resource Manager** and click **Create**.
4. In the **Basics** blade, enter the VM information as shown below, and then click **OK**.

	![Azure portal - Basics](./media/virtual-network-deploy-static-pip-arm-portal/figure1.png)

5. In the **Choose a size** blade, click **A1 Standard** as shown below, and then click **Select**.

	![Azure portal - Choose a size](./media/virtual-network-deploy-static-pip-arm-portal/figure2.png)

6. In the **Settings** blade, click **Public IP address**, then in the **Create public IP address** blade, under **Assignment**, click **Static** as shown below. And then click **OK**.

	![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure3.png)

7. In the **Settings** blade, click **OK**.
8. Review the **Summary** blade, as shown below, and then click **OK**.

	![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure4.png)

9. Notice the new tile in your dashboard.

	![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure5.png)

10. Once the VM is created, the **Settings** blade will be displayed as shown below

	![Azure portal - Create public IP address](./media/virtual-network-deploy-static-pip-arm-portal/figure6.png)