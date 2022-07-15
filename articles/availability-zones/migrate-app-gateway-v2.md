---
title: Migrate Azure Application Gateway deployments to availability zone support 
description: Learn how to migrate your Azure Application Gateway deployments to availability zone support.
author: anaharris-ms
ms.service: application-gateway
ms.topic: conceptual
ms.date: 07/15/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions
---

# Migrate Application Gateway deployments to availability zone support
 
Application Gateway Standard v2 or WAF v2 supports zonal and/or zone redundant deployments.  To change your Application Gateway Standard v2 deployments to zonal or to complete zone redundancy, you must redeploy them by using one of the migration options in this article.

## Prerequisites

- Your deployment must be Standard v2 or WAF v2 SKU. Earlier SKUs (Standard and WAF) don't support zone awareness. 

- Confirm that your storage account(s) is a general-purpose v2 account. If your storage account is v1, you'll need to upgrade it to v2. To learn how to upgrade your v1 account, see [Upgrade to a general-purpose v2 storage account](../storage/common/storage-account-upgrade.md).

## Downtime requirements

Some migration options described in this article require downtime until new deployments have been completed.

## Option 1: Create a separate Application Gateway and IP address

This option requires you to create a separate Application Gateway deployment, along with a public IP address. Workloads are then migrated from the non-zone aware Application Gateway setup to the new one. 

Since you're changing the public IP address, changes to DNS configuration will likely be required.

This option also may require changes to virtual network/subnet configuration.

Use this option to:

- Minimize downtime. If DNS records are updated to the new environment, clients will establish new connections to the new gateway with no interruption.

- Allow for extensive testing or even a blue/green scenario.

To learn how to create and deploy a new Application Gateway and public IP address see [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway).


## Option 2: Delete/Redeploy Application Gateway and IP address

This option doesn't require you to reconfigure a virtual network/subnet.

Since you're changing the public IP address, changes to DNS configuration will likely be required. However, if the public IP address for the Application Gateway is already configured for the desired end state zone awareness, you can choose to delete and redeploy the Application Gateway, and leave the IP address as is. See [Option 3: Delete/Redeploy Application Gateway and Keep IP address](#option-3-deleteredeploy-application-gateway-and-keep-ip-address) for more information.


To delete the Application Gateway and public IP address and redeploy new ones:

1. Go to the [Azure portal](https://portal.azure.com). 

1. Select **All resources**, and then select the resource group that contains the Application Gateway.

1. Select **Delete**.

1. After you have deleted the Application Gateway resource, select the public IP address and repeat the process.

1. To learn how to create and deploy a new Application Gateway and public IP address see [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway).

## Option 3: Delete/Redeploy Application Gateway and Keep IP address

This option doesn't require you to reconfigure a virtual network/subnet. Since you aren't changing the public IP address, changes to DNS configuration won't be required.

To delete the Application Gateway and redeploy a new one:

1. Go to the [Azure portal](https://portal.azure.com). 

1. Select **All resources**, and then select the resource group that contains the Application Gateway.

1. Select **Delete**.

1. To learn how to create and deploy a new Application Gateway see [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway).


## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [Scaling and Zone-redundant Application Gateway v2](../application-gateway/application-gateway-autoscaling-zone-redundant.md)

> [!div class="nextstepaction"]
> [Regions and Availability Zones in Azure](az-overview.md)

> [!div class="nextstepaction"]
> [Azure Services that support Availability Zones](az-region.md)