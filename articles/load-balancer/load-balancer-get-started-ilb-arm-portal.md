---
title: Create an Internal load balancer - Azure portal | Microsoft Docs
description: Learn how to create an Internal load balancer in Resource Manager using the Azure portal
services: load-balancer
documentationcenter: na
author: kumudd
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 1ac14fb9-8d14-4892-bfe6-8bc74c48ae2c
ms.service: load-balancer
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/23/2017
ms.author: kumud
---

# Create an Internal load balancer in the Azure portal

> [!div class="op_single_selector"]
> * [Azure Portal](../load-balancer/load-balancer-get-started-ilb-arm-portal.md)
> * [PowerShell](../load-balancer/load-balancer-get-started-ilb-arm-ps.md)
> * [Azure CLI](../load-balancer/load-balancer-get-started-ilb-arm-cli.md)
> * [Template](../load-balancer/load-balancer-get-started-ilb-arm-template.md)

[!INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../azure-resource-manager/resource-manager-deployment-model.md).  This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the [classic deployment model](load-balancer-get-started-ilb-classic-ps.md).

[!INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]

## Get started creating an Internal load balancer using Azure portal

Use the following steps to create an internal load balancer from the Azure Portal.

1. Open a browser, navigate to the [Azure portal](http://portal.azure.com), and sign in with your Azure account.
2. In the upper left hand side of the screen, click **New** > **Networking** > **Load balancer**.
3. In the **Create load balancer** blade, enter a **Name** for your load balancer.
4. Under **Scheme**, click **Internal**.
5. Click **Virtual network**, and then select the virtual network where you want to create the load balancer.

   > [!NOTE]
   > If you do not see the virtual network you want to use, check the **Location** you are using for the load balancer, and change it accordingly.

6. Click **Subnet**, and then select the subnet where you want to create the load balancer.
7. Under **IP address assignment**, click either **Dynamic** or **Static**, depending on whether you want the IP address for the load balancer to be fixed (static) or not.

   > [!NOTE]
   > If you select to use a static IP address, you will have to provide an address for the load balancer.

8. Under **Resource group** either specify the name of a new resource group for the load balancer, or click **select existing** and select an existing resource group.
9. Click **Create**.

## Configure load balancing rules

After the load balancer creation, navigate to the load balancer resource to configure it.
You need to configure first a back-end address pool and a probe before configuring a load balancing rule.

### Step 1: Configure a back-end pool

1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Backend pools**.
3. In the **Backend address pools** blade, click **Add**.
4. In the **Add backend pool** blade, enter a **Name** for the backend pool, and then click **OK**.

### Step 2: Configure a probe

1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Probes**.
3. In the **Probes**  blade, click **Add**.
4. In the **Add probe** blade, enter a **Name** for the probe.
5. Under **Protocol**, select **HTTP** (for web sites) or **TCP** (for other TCP based applications).
6. Under **Port**, specify the port to use when accessing the probe.
7. Under **Path** (for HTTP probes only), specify the path to use as a probe.
8. Under **Interval** specify how frequently to probe the application.
9. Under **Unhealthy threshold**, specify how many attempts should fail before the backend virtual machine is marked as unhealthy.
10. Click **OK** to create probe.

### Step 3: Configure load balancing rules

1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Load balancing rules**.
3. In the **Load balancing rules** blade, click **Add**.
4. In the **Add load balancing rule** blade, enter a **Name** for the rule.
5. Under **Protocol**, select **HTTP** (for web sites) or **TCP** (for other TCP based applications).
6. Under **Port**, specify the port clients connect to in the load balancer.
7. Under **Backend port**, specify the port to be used in the backend pool (usually, the load balancer port and the backend port are the same).
8. Under **Backend pool**, select the backend pool you created above.
9. Under **Session persistence**, select how you want sessions to persist.
10. Under **Idle timeout (minutes)**, specify the idle timeout.
11. Under **Floating IP (direct server return)**, click **Disabled** or **Enabled**.
12. Click **OK**.

## Next steps

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)

