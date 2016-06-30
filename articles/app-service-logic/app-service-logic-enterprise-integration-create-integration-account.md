<properties 
	pageTitle="Overview of integration accounts and the Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Learn all about Integration accounts, the Enterprise Integration Pack and Logic apps" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erikre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Overview of integration accounts

## What is an integration account?
An integration account is an Azure account that allows Enterprise Integration apps to manage artifacts including schemas, maps, certificates, partners and agreements. Any integration app you create will need to use an integration account in order to access a schema, map or certificate, for example.

## Create an integration account 
1. Select **Browse**   
![](./media/app-service-logic-enterprise-integration-accounts/account-1.png)  
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-accounts/account-2.png)  
3. Select *Add* button from the menu at the top of the page      
![](./media/app-service-logic-enterprise-integration-accounts/account-3.png)  
4. Enter the **Name**, select the **Subscription** you want to use, either create a new **Resource group** or select an existing resource group, select a **Location** where your integration account will be hosted, select a **Pricing tier**, then select the **Create** button.   

  At this point the integration account will be provisioned in the location you selected. This should complete within 1 minute.    
![](./media/app-service-logic-enterprise-integration-accounts/account-4.png)  
5. Refresh the page. You will see your new integration account listed. Congratulations!  
![](./media/app-service-logic-enterprise-integration-accounts/account-5.png)  
    
## How to delete an integration account?
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  
3. Select the **integration account** that you wish to delete  
![](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  
4. Select the **Delete** link that's located on the menu   
![](./media/app-service-logic-enterprise-integration-accounts/delete.png)  
5. Confirm your choice    

## How to move an integration account?
You can easily move an integration account to a new subscription and a new resource group. Follow these steps if you need to move your integration account:

>[AZURE.IMPORTANT] You will need to update all scripts to use the new resource IDs after you move an integration account.

1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  
3. Select the **integration account** that you wish to delete  
![](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  
4. Select the **Move** link that's located on the menu   
![](./media/app-service-logic-enterprise-integration-accounts/move.png)  
5. Confirm your choice    

## Next Steps
- [Lean more about agreements](./app-service-logic-enterprise-integration-agreements.md "Learn about enterprise integration agreements")  


 