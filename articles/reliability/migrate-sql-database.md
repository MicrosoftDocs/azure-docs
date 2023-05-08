---
title: Migrate Azure SQL Database to availability zone support 
description: Learn how to migrate your Azure SQL Database to availability zone support.
author: rsetlem
ms.service: sql
ms.topic: conceptual
ms.date: 05/08/2023
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---

# Migrate Azure SQL Database to availability zone support
 
This guide describes how to migrate [Azure SQL Database](/azure/azure-sql/)  from non-availability zone support to availability support.

Enabling zone redundancy for Azure SQL Database guarantees high availability as the database utilizes Azure Availability Zones to replicate data across multiple physical locations within an Azure region. By selecting zone redundancy, you can make your databases and elastic pools resilient to a much larger set of failures, including catastrophic datacenter outages, without any changes of the application logic.  

## Prerequisites

To migrate to availability zone support, ensure that your Azure SQL Database service tier and deployment model are one of the following service tier and deployment model :

| Service tier | Deployment model |
|-----|-----|
| Premium | Single database or Elastic pool
| Business Critical | Single database or Elastic pool |
| General Purpose | Single database or Elastic pool  |
| Hyperscale| Single database |


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