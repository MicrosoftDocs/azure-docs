---
title: Migrate Azure Application Gateway Standard and WAF v2 deployments to availability zone support 
description: Learn how to migrate your Azure Application Gateway and WAF deployments to availability zone support.
author: jfaurskov
ms.service: application-gateway
ms.topic: conceptual
ms.date: 07/28/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---

# Migrate Application Gateway and WAF deployments to availability zone support
 
[Application Gateway Standard v2](../application-gateway/overview-v2.md) and Application Gateway with [WAF v2](../web-application-firewall/ag/ag-overview.md) supports zonal and zone redundant deployments. For more information about zone redundancy, see [Azure services and regions that support availability zones](availability-zones-service-support.md). 

If you previously deployed **Azure Application Gateway Standard v2** or **Azure Application Gateway Standard v2 + WAF v2** without zonal support, you must redeploy these services to enable zone redundancy. Two migration options to redeploy these services are described in this article.

## Prerequisites

- Your deployment must be Standard v2 or WAF v2 SKU. Earlier SKUs (Standard and WAF) don't support availability zones.

## Downtime requirements

Some migration options described in this article require downtime until new deployments have been completed.

## Option 1: Create a separate Application Gateway and IP address

This option requires you to create a separate Application Gateway deployment, using a new public IP address. Workloads are then migrated from the non-zone aware Application Gateway setup to the new one. 

Since you're changing the public IP address, changes to DNS configuration are required. This option also requires some changes to virtual networks and subnets.

Use this option to:

- Minimize downtime. If DNS records are updated to the new environment, clients will establish new connections to the new gateway with no interruption.
- Allow for extensive testing or even a blue/green scenario.

To create a separate Application Gateway, WAF (optional) and IP address:

1. Go to the [Azure portal](https://portal.azure.com).
2. Follow the steps in [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway) or [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) to create a new Application Gateway v2 or Application Gateway v2 + WAF v2, respectively. You can reuse your existing Virtual Network or create a new one, but you must create a new frontend Public IP address.
3. Verify that the application gateway and WAF are working as intended.
4. Migrate your DNS configuration to the new public IP address.
5. Delete the old Application gateway and WAF resources.

## Option 2: Delete and redeploy Application Gateway

This option doesn't require you to reconfigure  your virtual network and subnets. If the public IP address for the Application Gateway is already configured for the desired end state zone awareness, you can choose to delete and redeploy the Application Gateway, and leave the Public IP address unchanged.

Use this option to:

- Avoid changing IP address, subnet, and DNS configurations.
- Move workloads that are not sensitive to downtime.

To delete the Application Gateway and WAF and redeploy:

1. Go to the [Azure portal](https://portal.azure.com). 
2. Select **All resources**, and then select the resource group that contains the Application Gateway.
3. Select the Application Gateway resource and then select **Delete**. Type **yes** to confirm deletion, and then click **Delete**.
4. Follow the steps in [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway) or [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) to create a new Application Gateway v2 or Application Gateway v2 + WAF v2, respectively, using the same Virtual Network, subnets, and Public IP address that you used previously.

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [Scaling and Zone-redundant Application Gateway v2](../application-gateway/application-gateway-autoscaling-zone-redundant.md)

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)