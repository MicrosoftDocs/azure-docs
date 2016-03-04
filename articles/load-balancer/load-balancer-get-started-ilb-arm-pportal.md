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

# Get started creating an Internal load balancer in the Azure portal

[AZURE.INCLUDE [load-balancer-get-started-ilb-arm-selectors-include.md](../../includes/load-balancer-get-started-ilb-arm-selectors-include.md)]
<BR>
[AZURE.INCLUDE [load-balancer-get-started-ilb-intro-include.md](../../includes/load-balancer-get-started-ilb-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](load-balancer-get-started-ilb-classic-ps.md).

[AZURE.INCLUDE [load-balancer-get-started-ilb-scenario-include.md](../../includes/load-balancer-get-started-ilb-scenario-include.md)]


## Get started creating an Internal load balancer using Azure portal	

To create an Internal load balancer from the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.

2. Go to upper left hand side and click "+New" > Networking.

3. In the Networking blade >  select  "Load balancer"

4. In "Create load balancer, type name > click internal.

5. Choose a virtual network for the load balancer and subnet.

6. Define the IP address for the load balancer, either static or dynamic.
    
7. Choose a resource group for the load balancer. 

8. Click create. 

## Configure load balancing rules 

After the load balancer creation, navigate to the load balancer resource to configure it.

You need to configure first a back-end address pool and a probe before configuring a load balancing rule.

### Step 1
Configure a back-end pool:

1. In the Azure portal, "browse" > "load balancers" > select the load balancer you just created.

2. Click in "all settings". 

3. In "Backend address pools", click "+Add".

4. Type the back-end pool name and click ok.

### Step 2 
Configure a probe:
 
1. In the Azure portal, "browse" > "load balancers" > select the load balancer you just created.

2. Click in "all settings".

3. In "Probes", click "+Add".

4. Type the probe name, protocol, port, interval and unhealthy threshold.

5. click ok to create probe.

### Step 3
Configure load balancing rules:

1. In the Azure portal, "browse" > "load balancers" > select the load balancer you just created.

2. Click in "all settings".

3. In "Add load balancing rules", click "+Add".

4. Type the load balancing rule name, protocol, port, back-end port, back-end pool, probe, idle timeout and floating IP.

5. Click ok.

 
 
## Next steps

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
