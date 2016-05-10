<properties 
   pageTitle="Get started creating an Internal load balancer in Resource Manager using the Azure portal | Microsoft Azure"
   description="Learn how to create an Internal load balancer in Resource Manager using the Azure portal"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carmonm"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/04/2016"
   ms.author="joaoma" />

# Get started creating an internal load balancer in the Azure portal

[AZURE.INCLUDE [load-balancer-get-started-ilb-arm-selectors-include.md](../../includes/load-balancer-get-started-ilb-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](load-balancer-get-started-ilb-classic-ps.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]


## Get started creating an internal load balancer using Azure portal	

To create an internal load balancer from the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.
2. In the upper left hand side of the screen, click **New** > **Networking** > **Load balancer**.
4. In the **Create load balancer** blade, type a **Name** for your load balancer.
5. Under **Scheme**, click **Internal**.
5. Click **Virtual network**, and then select the virtual network where you want to create the load balancer.

>[AZURE.NOTE] If you do not see the virtual network you want to use, check the **Location** you are using for the load balancer, and change it accordingly.

6. Click **Subnet**, and then select the subnet where you want to create the load balancer.
6. Under **IP address assignment**, click either **Dynamic** or **Static**, depending on whether you want the IP address for the load balancer to be fixed (static) or not.

>[AZURE.NOTE] If you select to use a static IP address, you will have to provide an address for the load balancer.
    
7. Under **Resource group** either specify the name of a new resource group for the load balancer, or click **select existing** and select an existing resource group. 
8. Click **Create**. 

## Configure load balancing rules 

After the load balancer creation, navigate to the load balancer resource to configure it.
You need to configure first a back-end address pool and a probe before configuring a load balancing rule.

### Step 1

Configure a back-end pool:

1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Backend pools**. 
3. In the **Backend address pools** blade, click **Add**.
4. In the **Add backend pool** blade, type a **Name** for the backend pool, and then click **OK**.

### Step 2 

Configure a probe:
 
1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Probes**. 
3. In the **Probes**  blade, click **Add**.
4. In the **Add probe** blade, type a **Name** for the probe.
5. Under **Protocol**, select **HTTP** (for web sites) or **TCP** (for other TCP based applications).
6. Under **Port**, specify the port to use when accessing the probe.
7. Under **Path** (for HTTP probes only), specify the path to use as a probe.
4. Under **Interval** specify how frequently to probe the application.
5. Under **Unhealthy threshold**, specify how many attempts should fail before the backend VM is marked as unhealthy.
5. click **OK** to create probe.

### Step 3

Configure load balancing rules:

1. In the Azure portal, click **Browse** > **Load balancers**, and then click the load balancer you created above.
2. In the **Settings** blade, click **Load balancing rules**. 
3. In the **Load balancing rules** blade, click **Add**.
4. In the **Add load balancing rule** blade, type a **Name** for the rule.
5. Under **Protocol**, select **HTTP** (for web sites) or **TCP** (for other TCP based applications).
6. Under **Port**, specify the port clients connect to int he load balancer.
7. Under **Backend port**, specify the port to be used in the backend pool (usually, the load balancer port and the backend port are the same).
8. Under **Backend pool**, select the backend pool you created above.
9. Under **Session persistence**, select how you want sessions to persist.
10. Under **Idle timeout (minutes)**, specify the idle timeout.
11. Under **Floating IP (direct server return)**, click **Disabled** or **Enabled**.
12. Click **OK**.
 
## Next steps

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
