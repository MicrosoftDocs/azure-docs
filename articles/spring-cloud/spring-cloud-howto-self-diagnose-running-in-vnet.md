---
title: "How to self-diagnose Azure Spring Cloud VNET"
description: Learn how to self-diagnose and solve problems in Azure Spring Cloud running in VNET.
author: MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 01/25/2021
ms.custom: devx-track-java
---

# Self-diagnose for Running Azure Spring Cloud in VNET

## Navigate to the diagnostics page
1. Sign in to the Azure portal.
1. Go to your Azure Spring Cloud Overview page.
1. Open Diagnose and solve problems in the menu on the left side of the page.
1. Select the third category named **Networking**.

    ![Self diagnostic title](media/spring-cloud-self-diagnose-vnet/self-diagostic-title.png)

## View a diagnostic report
After you click the **Networking** category, you can view two issues related to Networking specific to your VNet injected Azure Spring Cloud: **DNS Resolution** and **Required Outbound Traffic**.

Find your target issue, and click it to view the diagnostic report. A summary of diagnostics will be shown after your click. Some results contain related documentation.

If your Azure Spring Cloud resource has been deleted, you will see the results like **Resource has been removed.**
    ![Self diagnostic removed resource](media/spring-cloud-self-diagnose-vnet/self-diagostic-resource-removed.png)

If your Azure Spring Cloud resource is not deployed in your own virtual network, you will see the following prompt.
    ![Self diagnostic not VNET](media/spring-cloud-self-diagnose-vnet/self-diagostic-resource-is-not-vnet.png)

Different subnets will display the results separately.
### DNS Resolution 
Healthy results:
    ![DNS healthy](media/spring-cloud-self-diagnose-vnet/self-diagostic-dns-healthy.png)

Assuming the context end time is **2021-01-21T11:22:00Z**, and the diagnostic report like the following picture. The latest TIMESTAMP in the **DNS Resolution Table Renderings** is yesterday, more than **30 minutes** from the context end time, the health status will be unknown. Since the health check log may not be sent out because of the blocked network. 

The unknown health status results contain related documentation, you can click the left angle brackets.
    ![DNS unknown](media/spring-cloud-self-diagnose-vnet/self-diagostic-dns-unknown.png)


Assuming the context end time is 2021-01-20T22:22:00Z and you misconfigured your Private DNS Zone record set, you will get a Critical result like `Failed to resolve the Private DNS in subnet xxx`. 

In the **DNS Resolution Table Renderings** you will find the detail message info, you can check your config with that.
    ![DNS failed](media/spring-cloud-self-diagnose-vnet/self-diagostic-dns-failed.png)

### Required Outbound Traffic 
Healthy results:
    ![Endpoint healthy](media/spring-cloud-self-diagnose-vnet/self-diagostic-endpoint-healthy.png)

If any of your subnet is blocked by NSG or firewall rules, you will find the following failures unless you blocked the log. Then you can check whether you miss any [Customer Responsibilities](spring-cloud-vnet-customer-responsibilities.md).
    ![Endpoint failed](media/spring-cloud-self-diagnose-vnet/self-diagostic-endpoint-failed.png)

If there are no data in `Required Outbound Traffic Table Renderings` within 30 minutes, it will result in unknown health status. 
Maybe your network is blocked or the Log service is down.
    ![Diagnostic endpoint unknown](media/spring-cloud-self-diagnose-vnet/self-diagostic-endpoint-unknown.png)

## See also
* [How to self diagnose Azure Spring Cloud](spring-cloud-howto-self-diagnose-solve.md)