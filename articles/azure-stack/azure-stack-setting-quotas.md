---
title: Quotas in Azure Stack | Microsoft Docs
description: Administrators set quotas to restrict the maximum amount of resources that tenants have access to.
services: azure-stack
documentationcenter: ''
author: mattmcg
manager: byronr
editor: ''

ms.assetid: 955c6dd8-cefe-42f3-af88-e11d17d22725
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/1/2017
ms.author: mattmcg

---
# Set and view quotas in Azure Stack
Quotas define the limits of resources that a tenant subscription
can provision or consume. For example, a quota might allow a tenant to
create up to five VMs. To add a service to a plan, the
administrator must configure the quota settings for that service.

Quotas are configurable per service and per location, enabling administrators to provide granular control over the resource
consumption. Administrators can create one or more quota
resources and associate them with plans, which means they can provide
differentiated offerings for their services. Quotas for a given service can be created
from the **Resource Provider** administration blade for that service.

A tenant that subscribes to an offer that contains multiple
plans can use all resources that are available in each plan.

## To create an IaaS quota
1. In a browser, go to
   [https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external/).
   
   Sign in to the Azure Stack portal as an administrator (by using the credentials that you provided during deployment).
2. Select **New**, then **Tenant Offers + Plans**, and select **Quota**.
3. Select the first service for which you want to create a quota. For an IaaS quota, follow these steps for the Compute, Network, and Storage services.
   In this example, we first create a quota for the Compute service. In the **Namespace** list, select the **Microsoft.Compute** namespace.
   
   > ![Creating a new Compute quota](./media/azure-stack-setting-quota/NewComputeQuota.PNG)
   > 
   > 
4. Choose the location where the quota is defined (for example, 'local').
5. On the **Quota Settings** item, it says **Set the
   Capacity of Quota**. Click this item to configure the quota settings.
6. On the **Set Quotas** blade, you see all the Compute resources for which
   you can configure limits. Each type has a default
   value that's associated with it. You can change these values or you can select the **Ok** button at the bottom of the blade to accept
   the defaults.
   
   > ![Setting a Compute quota](./media/azure-stack-setting-quota/SetQuotasBladeCompute.PNG)
   > 
   > 
7. After you have configured the values and clicked **Ok**, the **Quota
   Settings** item appears as **Configured**. Click **Ok** to
   create the **Quota** resource.
   
   You should see a notification indicating that the quota resource is
   being created.
8. After the quota set has been successfully created, you receive a second notification. The Compute service quota is now ready to be associated with a plan. Repeat these steps with the Network and Storage services, and you are ready to create an IaaS plan!
   
   > ![Notification upon quota creation success](./media/azure-stack-setting-quota/QuotaSuccess.png)
   > 
   > 

## Compute quota types
| **Type** | **Default value** | **Description** |
| --- | --- | --- |
| Max number of virtual machines |50 |The maximum number of virtual machines that a subscription can create in this location. |
| Max number of virtual machine cores |100 |The maximum number of cores that a subscription can create in this location (for example, an A3 VM has four cores). |
| Max amount of virtual machine memory (GB) |150 |The maximum amount of RAM that can be provisioned in megabytes (for example, an A1 VM consumes 1.75 GB of RAM). |

> [!NOTE]
> Compute quotas are not enforced in this technical preview.
> 
> 

## Storage quota types
| **Item** | **Default value** | **Description** |
| --- | --- | --- |
| Maximum capacity (GB) |500 |Total storage capacity that can be consumed by a subscription in this location. |
| Total number of storage accounts |20 |The maximum number of storage accounts that a subscription can create in this location. |

## Network quota types
| **Item** | **Default value** | **Description** |
| --- | --- | --- |
| Max public IPs |50 |The maximum number of public IPs that a subscription can create in this location. |
| Max virtual networks |50 |The maximum number of virtual networks that a subscription can create in this location. |
| Max virtual network gateways |1 |The maximum number of virtual network gateways (VPN Gateways) that a subscription can create in this location. |
| Max network connections |2 |The maximum number of network connections (point-to-point or site-to-site) that a subscription can create across all virtual network gateways in this location. |
| Max load balancers |50 |The maximum number of load balancers that a subscription can create in this location. |
| Max NICs |100 |The maximum number of network interfaces that a subscription can create in this location. |
| Max network security groups |50 |The maximum number of network security groups that a subscription can create in this location. |

##View an existing quota
To view an existing quota, click **More services**>**Resource Providers** and select the service with which the quota you want to view is associated. Next, click **Quotas**, and select the Quota you want to view.
   > ![Viewing an existing quota](./media/azure-stack-setting-quota/ExistingQuota.PNG)
