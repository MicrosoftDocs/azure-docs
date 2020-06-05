---
title: Request a quota increase
description: This page describes how to create a support request to increase the quotas for Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-database
ms.topic: conceptual
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: sstein
ms.date: 06/04/2020
---

# Request quota increases for Azure SQL Database and SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article explains how to request a quota increase for Azure SQL Database and Azure SQL Managed Instance. It also explains how to enable subscription access to a region.

## <a id="newquota"></a> Create a new support request

Use the following steps to create a new support request from the Azure portal for SQL Database.

1. On  the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

   ![The Help + support link](./media/quota-increase-request/help-plus-support.png)

1. In **Help + support**, select **New support request**.

    ![Create a new support request](./media/quota-increase-request/new-support-request.png)

1. For **Issue type**, select **Service and subscription limits (quotas)**.

   ![Select an issue type](./media/quota-increase-request/select-quota-issue-type.png)

1. For **Subscription**, select the subscription whose quota you want to increase.

   ![Select a subscription for an increased quota](./media/quota-increase-request/select-subscription-support-request.png)

1. For **Quota type**, select one of the following quota types:

   - **SQL Database** for single database and elastic pool quotas.
   - **SQL Database Managed Instance** for managed instances.

   Then select **Next: Solutions >>**.

   ![Select a quota type](./media/quota-increase-request/select-quota-type.png)

1. In the **Details** window, select **Enter details** to enter additional information.

   ![Enter details link](./media/quota-increase-request/provide-details-link.png)

Clicking **Enter details** displays the **Quota details** window that allows you to add additional information. The following sections describe the different options for **SQL Database** and **SQL Database Managed Instance** quota types.

## <a id="sqldbquota"></a> SQL Database quota types

The following sections describe the quota increase options for the **SQL Database** quota types:

- Database transaction units (DTUs) per server
- Servers per subscription
- M-series region access
- Region access

### Database transaction units (DTUs) per server

Use the following steps to request an increase in the DTUs per server.

1. Select the **Database transaction units (DTUs) per server** quota type.

1. In the **Resource** list, select the resource to target.

1. In the **New quota** field, enter the new DTU limit that you are requesting.

   ![DTU quota details](./media/quota-increase-request/quota-details-dtus.png)

For more information, see [Resource limits for single databases using the DTU purchasing model](resource-limits-dtu-single-databases.md) and [Resources limits for elastic pools using the DTU purchasing model](resource-limits-dtu-elastic-pools.md).

### Servers per subscription

Use the following steps to request an increase in the number of servers per subscription.

1. Select the **Servers per subscription** quota type.

1. In the **Location** list, select the Azure region to use. The quota is per subscription in each region.

1. In the **New quota** field, enter your request for the maximum number of servers in that region.

   ![Servers quota details](./media/quota-increase-request/quota-details-servers.png)

For more information, see [SQL Database resource limits and resource governance](resource-limits-logical-server.md).

### <a id="region"></a> Enable subscription access to a region

Some offer types are not available in every region. You may see an error such as the following:

`Your subscription does not have access to create a server in the selected region. For the latest information about region availability for your subscription, go to aka.ms/sqlcapacity. Please try another region or create a support ticket to request access.`

If your subscription needs access in a particular region, select the **Region access** option. In your request, specify the offering and SKU details that you want to enable for the region. To explore the offering and SKU options, see [Azure SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/single/).

1. Select the **Region access** quota type.

1. In the **Select a location** list, select the Azure region to use. The quota is per subscription in each region.

1. Enter the **Purchase Model**, and **Expected Consumption** details.

   ![Request region access](./media/quota-increase-request/quota-details-whitelisting.png)

### <a id="mseries"></a> Enable M-series access to a region

To enable M-series hardware for a subscription and region, a support request must be opened.

1. Select the **M-series region access** quota type.

1. In the **Select a location** list, select the Azure region to use. The quota is per subscription in each region.


   ![Request region access](./media/quota-increase-request/quota-m-series.png)

## <a id="sqlmiquota"></a> SQL Managed Instance quota type

For the **SQL Managed Instance** quota type, use the following steps:

1. In the **Region** list, select the Azure region to target.

1. Enter the new limits you are requesting for **Subnet** and **vCore**.

   ![SQL Managed Instance quota details](./media/quota-increase-request/quota-details-managed-instance.png)

For more information, see [Overview Azure SQL Managed Instance resource limits](../managed-instance/resource-limits.md).

## Submit your request

The final step is to fill in the remaining details of your SQL Database quota request. Then select **Next: Review + create>>**, and after reviewing the request details, click **Create** to submit the request.

## Next steps

After you submit your request, it will be reviewed. You will be contacted with an answer based on the information you provided in the form.

For more information about other Azure limits, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).
