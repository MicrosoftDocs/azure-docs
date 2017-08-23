---
title: How to create a support ticket for SQL Data Warehouse | Microsoft Docs
description: How to create a support ticket in Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: kevinvngo
manager: jhubbard
editor: ''

ms.assetid: a91d1f53-03cb-464b-9d5b-4a9c1a194ed3
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 10/31/2016
ms.author: kevin;barbkess

---
# How to create a support ticket for SQL Data Warehouse
If you are having any issues with your SQL Data Warehouse, please create a support ticket so that our engineering team can assist you.

> [!NOTE] 
> As of 12/20/2016, the resource health check in the Azure portal is not accurate. We are actively working to fix this issue. 


## Create a support ticket
1. Open the [Azure portal][Azure portal].
2. On the Home screen, click the **Help + support** tile.
   
    ![Help + support](./media/sql-data-warehouse-get-started-create-support-ticket/help-support.png)
3. On the Help + Support blade, click **Create support request**.
   
    ![New support request](./media/sql-data-warehouse-get-started-create-support-ticket/create-support-request.png)
   
    <a name="request-quota-change"></a> 
4. Select the **Request Type**.
   
    ![Request type](./media/sql-data-warehouse-get-started-create-support-ticket/request-type.png)
   
   > [!NOTE]
   > By default, each SQL server (e.g. myserver.database.windows.net) has a **DTU Quota** of 45,000. This quota is simply a safety limit. You can increase your quota by creating a support ticket and selecting *Quota* as the request type. To calculate your DTU needs, multiply the 7.5 by the total [DWU][DWU] needed. For example, you would like to host two DW6000s on one SQL server, then you should request a DTU quota of 90,000.  You can view your current DTU consumption from the SQL server blade in the portal. Both paused and un-paused databases count toward the DTU quota. 
   > 
   > 
5. Select the **Subscription** that hosts the database with the problem you are reporting.
   
    ![Subscription](./media/sql-data-warehouse-get-started-create-support-ticket/subscription.png)
6. Select **SQL Data Warehouse** as the Resource.
   
    ![Resource](./media/sql-data-warehouse-get-started-create-support-ticket/resource.png)
7. Select your [Azure support plan][Azure support plan].
   
   * **Billing, quota and subscription management** support is available at all support levels.
   * **Break-fix** support is provided through [Developer][Developer], [Standard][Standard], [Professional Direct][Professional Direct] or [Premier][Premier] support. Break-fix issues are problems experienced by customers while using Azure where there is a reasonable expectation that Microsoft caused the problem.
   * **Developer mentoring** and **advisory services** are available at the [Professional Direct][Professional Direct] and [Premier][Premier] support levels. 
     
     If you have a Premier support plan, you can also report SQL Data Warehouse related issues on the [Microsoft Premier online portal][Microsoft Premier online portal].  See [Azure support plans][Azure support plan] to learn more about the various support plans, including scope, response times, pricing, etc.  For frequently asked questions about Azure support, see [Azure support FAQs][Azure support FAQs].  
     
     ![Support plan](./media/sql-data-warehouse-get-started-create-support-ticket/support-plan.png)
8. Select the **Problem Type** and **Category**. In this example, we have chosen "Tools" as the Problem type and "Client tools" as the category. 
   
    ![Problem type category](./media/sql-data-warehouse-get-started-create-support-ticket/problem-type-category.png)
9. Describe the problem and choose the level of business impact.
   
    ![Problem description](./media/sql-data-warehouse-get-started-create-support-ticket/problem-description.png)
10. Your **contact information** for this support ticket will be pre-filled. Update this if necessary.
    
    ![Contact info](./media/sql-data-warehouse-get-started-create-support-ticket/contact-info.png)
11. Click **Create** to submit the support request.

## Monitor a support ticket
After you have submitted the support request, the Azure support team will contact you. To check your request status and details, click **Manage support requests** on the dashboard.

![Check status](./media/sql-data-warehouse-get-started-create-support-ticket/check-status.png)

## Other Resources
Additionally, you can connect with the SQL Data Warehouse community on [Stack Overflow][Stack Overflow] or on the [Azure SQL Data Warehouse MSDN forum][Azure SQL Data Warehouse MSDN forum].

<!--Image references--> 

<!--Article references--> 
[DWU]: ./sql-data-warehouse-overview-what-is.md

<!--MSDN references--> 

<!--Other web references--> 
[Azure portal]: https://portal.azure.com/
[Azure support plan]: https://azure.microsoft.com/support/plans/?WT.mc_id=Support_Plan_510979/  
[Developer]: https://azure.microsoft.com/support/plans/developer/  
[Standard]: https://azure.microsoft.com/support/plans/standard/  
[Professional Direct]: https://azure.microsoft.com/support/plans/prodirect/  
[Premier]: https://azure.microsoft.com/support/plans/premier/  
[Azure support FAQs]: https://azure.microsoft.com/support/faq/
[Microsoft Premier online portal]: https://premier.microsoft.com/
[Stack Overflow]: https://stackoverflow.com/questions/tagged/azure-sqldw/
[Azure SQL Data Warehouse MSDN forum]: https://social.msdn.microsoft.com/Forums/home?forum=AzureSQLDataWarehouse/

