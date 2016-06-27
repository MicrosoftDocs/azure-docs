<properties 
	pageTitle="Overview of Enterprise Integration Pack | Microsoft Azure App Service" 
	description="Use the features of Enterprise Integration Pack to enable business process and integration scenarios using Microsoft Azure App service" 
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java"
	authors="msftman" 
	manager="erickre" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/29/2016" 
	ms.author="deonhe"/>

# Partners

## Overview
Before you can create a partner, you must have offline discussions with the organization you intend to do business with. In your discussions, you would agree on various details such as how you will both identify and validate messages that are sent by each other. After you have these discussion, and you are ready to begin your business relationship, you are can to create a *partner* in your integration account.

## What is a partner?
Partners are the entities that participate in Business-To-Business (B2B) messaging and transactions. 

## How are partners used?
Partners are used to create agreements. An agreement defines the details about the messages that will be  exchanged between partners. 

Before you can create an agreement, you need to have added at least two partners to your integration account. One of the partners to an agreement must be your organization. The partner that represents your organization is referred to as the host partner. The second partner would represent the other organization with which your organization exchanges messages. The second partner is know as the guest partner. 

After you have added the partners, you would use those partners to create an agreement. 

## How to create a partner?
1. Select **Browse**  
![](./media/app-service-logic-enterprise-integration-overview/overview-1.png)    
2. Enter **integration** in the filter search box and select **Integration Accounts** from the results list     
 ![](./media/app-service-logic-enterprise-integration-overview/overview-2.png)  
3. Select the **integration account** to which you will add the partners  
![](./media/app-service-logic-enterprise-integration-overview/overview-3.png)  
4.  Select the **Partners** tile  
![](./media/app-service-logic-enterprise-integration-partners/partner-1.png)  
5. Select the **Add** button in the Partners blade that opens  
![](./media/app-service-logic-enterprise-integration-partners/partner-2.png)  
6. Enter a **Name** for your partner, then select the **Qualifier **, finally, enter a **Value**. The value is used to help identify documents that come into your apps.  
![](./media/app-service-logic-enterprise-integration-partners/partner-3.png)  
7. Select the *bell* notification icon to see the progress of the partner creation process.  
![](./media/app-service-logic-enterprise-integration-partners/partner-4.png)  
8. Select the **Partners** tile. This refreshes the tile and you should see the number of partners increase, reflecting the new partner has been added successfully.    
![](./media/app-service-logic-enterprise-integration-partners/partner-5.png)  
10. After you select the Partners tile, you will also see the newly added partner displayed in the Partners blade.    
![](./media/app-service-logic-enterprise-integration-partners/partner-6.png)  

## How to create an partner using PowerShell
```
Login-AzureRmAccount 

Select-AzureRmSubscription -SubscriptionName "<your subscription name>"

$ResourceGroupName = "IntegrationAccountPsCmdletTest"
$AccountName = "TestIntegrationAccount"
$AppServicePlan = "StandardServicePlan"
  
#Create a resource group
New-AzureRmResourceGroup -Name $ResourceGroupName -location "brazilsouth" -Force
$RG=Get-AzureRmResourceGroup -Name $ResourceGroupName
 
#Clean-up the resource group if any integration account alreay exists
Remove-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName -Name $AccountName -Force 

#Create an integration account Creation
$integrationAccount = New-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName -Name $AccountName -Location "brazilsouth" -Sku "Free"
#Get an integration account by name
Get-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName -Name $AccountName

#Get an integration account by name using pipe input from resource group object
$RG | Get-AzureRmIntegrationAccount -Name $AccountName

#Get integration accounts by resource group name
Get-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName

#Get integration accounts by resource group name with selected attributes 
Get-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName | Select Name,Location

#Get integration accounts in the current subscription with selected attributes 
Get-AzureRmIntegrationAccount | Select Name,Location

#Get CallBackUrl for an integration account.
#This is also known as the SAS URL. Beware the line return character to be removed when copying the SAS URL to the LA Designer.
Get-AzureRmIntegrationAccountCallbackUrl -ResourceGroupName $ResourceGroupName -Name $AccountName

#Update an integration account
$integrationAccount = Set-AzureRmIntegrationAccount -ResourceGroupName $ResourceGroupName -Name $AccountName -Sku "Free" 

```

## How do edit a partner?

Follow these steps to edit a partner that already exists in your integration account:  
1. Select the **Partners** tile
2. Select the partner you wish to edit when the Partners blade opens up
3. On the **Update Partner** tile, make the changes you need
4. If you are satisfied with your changes, select the **Save** link, else, select the **Discard** link to throw away your changes.  
![](./media/app-service-logic-enterprise-integration-partners/edit-1.png)


## How to delete a partner?
1. Select the **Partners** tile  
2. Select the partner you wish to edit when the Partners blade opens up  
3. Select the **Delete** link    
![](./media/app-service-logic-enterprise-integration-partners/delete-1.png)   


## Next steps
- [Lean more about agreements](./app-service-logic-enterprise-integration-agreements.md "Learn about enterprise integration agreements")
