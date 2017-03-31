---
title: Logic Apps B2B Integration Account Business Continuity - Azure Logic Apps | Microsoft Docs
description: Azure Logic Apps B2B Business Continuity
services: logic-apps
documentationcenter: .net,nodejs,java
author: padmavc
manager: anneta
editor: ''

ms.assetid: cf44af18-1fe5-41d5-9e06-cc57a968207c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/302016
ms.author: padmavc

---

# Logic Apps B2B cross region HA/DR
B2B workloads involve money transactions like orders, invoices, etc.  For business, it is critical to quickly recover to meet business level SLAs as agreed with their partners during a disaster event.  This topic demonstrates building a business continuity plan for B2B workloads.  It covers

* Create integration account in secondary region
* Establish a connection from primary region to secondary region 
* Failover to secondary region during a disaster event
* Fall back to primary region post-disaster event

## Create integration account in secondary region
1. Select a secondary region and create an [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md).  

2. Add partners, schemas, and agreements for the required message flows where the run status needs to be replicated to secondary region integration account.

    > [!Note]
    > Make sure consistency in integration account artifacts naming convention across regions 
    > 
    >

## Establish a connection from primary region integration account to secondary region integration account
Create a Logic App in the secondary region to pull the primary region run status.  It should have a **trigger** and a **action**.  The trigger should connect to primary region integration account and the action should connect to secondary region integration account.  Based on the time interval, the trigger polls the primary region run status table pulls the new records if any and action updates them to secondary region integration account. This helps to get incremental runtime status from primary region to secondary region.

Business continuity in Logic Apps integration account is designed to support based on B2B protocols - X12, AS2, and EDIFACT.  To find detailed steps select respective links given below.

* X12 
* AS2
* EDIFACT

## Failover to secondary region during a disaster event
The recommendation is to deploy all primary region resources in the secondary region as well.  During a disaster event when the primary region is not available for business continuity, direct traffic to the secondary region.  This helps recover business functions quickly to meet recovery time/point objectives (RPO/RTO) as agreed with their partners.  Also, minimizes efforts to fail over from one region to another region.
 

## Fall back to primary region post-disaster event
When primary region is available, to fall back to primary region follow below steps
* Stop accepting messages from partners in the **secondary region**
* Bump up generated control numbers for all the **primary region agreements** using [PowerShell cmdlets](https://blogs.msdn.microsoft.com/david_burgs_blog/2017/03/09/fresh-of-the-press-new-azure-powershell-cmdlets-for-upcoming-x12-connector-disaster-recovery)
* Direct traffic from secondary to primary region
* Check the Logic App created in the secondary region to pull run status from the primary is enabled 


## X12 
These are 2 types based on control numbers 
* Control numbers received (Inbound messages) from partners
* Control numbers generated (outbound messages) and send to partners


### Contorl numbers received from the partners
1. Create a [Logic App](../logic-apps/logic-apps-create-a-logic-app.md) in the secondary region   

2. Search **X12** and select **X12 - When a received control number is modified**    
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN1.png)

3. Selecting the trigger prompts to establish a connection to integration account. Trigger needs to be connected to primary region integration account.  Give a connection name, select your **primary region integration account** from the list and click create.   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN2.png)

4. DateTime to start control number sync is optional.  Frequency can be set to **Day**, **Hour**, **Minute** or **Second** with an interval.    
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN3.png)

5. Click **New step** and **Add an action**    
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN4.png)

6. Search **X12** and select **X12 - Add or update a received control number**   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN5.png)

7. Action needs to be connected to secondary integration account.  Select **Change connection** and **Add new connection** lists the available integration accounts.  Give a connection name, select your **secondary region integration account** from the list and click create.     
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN6.png)

8. Select the dynamic content and save the logic app   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN7.png)

9. Based on the time interval, the trigger polls the primary region received control number table, pulls the new records and actions updates them to secondary region integration account.  If they are no updates, the trigger status shows as skipped.   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12recevicedCN8.png)


### Contorl numbers generated and  from the partners
1. Create a [Logic App](../logic-apps/logic-apps-create-a-logic-app.md) in the secondary region  

2. Search **X12** and select **X12 - When a generated control number is modified**   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN1.png)

3. Selecting the trigger prompts to establish a connection to integration account. Trigger needs to be connected to primary region integration account.  Give a connection name, select your **primary region integration account** from the list and click create.   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN2.png) 

4. DateTime to start control number sync is optional.  Frequency can be set to **Day**, **Hour**, **Minute** or **Second** with an interval.   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN3.png)  

5. Click **New step** and **Add an action**   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN4.png)

6. Search **X12** and select **X12 - Add or update a generated control number**   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN5.png)

7. Action needs to be connected to secondary integration account.  Select **Change connection** and **Add new connection** lists the available integration accounts.  Give a connection name, select your **secondary region integration account** from the list and click create.    
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN6.png)

8. Select the dynamic content and save the logic app   
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN7.png)

9. Based on the time interval, the trigger polls the primary region received control number table, pulls the new records and actions updates them to secondary region integration account.  If they are no updates, the trigger status shows as skipped.  
![](./media/logic-apps-enterprise-integration-b2b-business-continuity/X12generatedCN8.png)