<properties 
   pageTitle="Get started creating an Internet facing load balancer in classic deployment model using the Azure portal | Microsoft Azure"
   description="Learn how to create an Internet facing load balancer in classic deployment model using the Azure portal"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="carolz"
   editor=""
   tags="azure-service-management"
/>
<tags  
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="03/17/2016"
   ms.author="joaoma" />

# Get started creating an Internet facing load balancer (classic) in the Azure portal

[AZURE.INCLUDE [load-balancer-get-started-internet-classic-selectors-include.md](../../includes/load-balancer-get-started-internet-classic-selectors-include.md)]

[AZURE.INCLUDE [load-balancer-get-started-internet-intro-include.md](../../includes/load-balancer-get-started-internet-intro-include.md)]

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)] This article covers the classic deployment model. You can also [Learn how to create an Internet facing load balancer using Azure Resource Manager](load-balancer-get-started-internet-arm-ps.md).

 
[AZURE.INCLUDE [load-balancer-get-started-internet-scenario-include.md](../../includes/load-balancer-get-started-internet-scenario-include.md)]



## Get started creating a load balancer endpoint using Azure portal	

To create an Internet facing load balancer (classic) deployment model from the Azure portal, follow the steps below.

1. From a browser, navigate to http://portal.azure.com and, if necessary, sign in with your Azure account.

2. Go to virtual machines (classic) blade > select a virtual machine.

3. In the virtual machines "essentials" blade >  select  "all settings"

4. Click in "load balanced sets".

5. To create a new load balancer, click  "join" icon on the top of the load balanced sets blade.

6. Select the "load balanced set type" public for Internet facing load balancer. 

7. Click in "configure required settings" to open "choose a load balanced set" and click on "create a load balanced set".

8. In "create a load balanced set" blade, create a name for the load balancer set. Fill out the name, public port, probe protocol, probe port.

9. Change probe interval and retries if needed.

10. (optional) if you want, you can configure access control rules from load balancer set creation blade.

11. Click ok to go back to "join load balanced set" blade.

12. click ok and wait for new load balancer resource to show in the "load balancer sets" blade.
 
## Next steps

[Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-ps.md)

[Configure a load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
