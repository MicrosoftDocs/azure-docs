<properties
	pageTitle="Create and configure a connector in logic apps | Microsoft Azure"
	description="Learn about the available APIs in PowerApps and how to register them in the Azure portal"
	services="app-service\logic" 
	documentationCenter=".net,nodejs,java" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="01/21/2016"
   ms.author="mandia"/>



# 
Microsoft offers many built-in connectors that can be added to your logic apps. This topic shows you how to create a logic app, and then add connectors to your logic app. 

Get outline from powerapps-register-from-available-apis.md


## Add a connector to your logic app
1. In the [Azure portal](https://portal.azure.com/), create a new logic app, or open an existing logic app. 
2. When the logic app opens for the first time, a **Recurrence** trigger is automatically added to the top of the logic app. Using Recurrence, your logic app runs continuously using the time you choose. The Recurrence is optional and can be deleted. 

	Instead of Recurrence, there are other Triggers available. You can delete Recurrence and from the list, select another trigger: 

	<INSERT SCREEN SHOT OF OTHER TRIGGERS>

3. After your trigger is selected, select the plus sign. There are two options available: **Add an action** or **Add a condition**. 

	- **Add an action** : Uses one of the Bing Search actions, like search videos. 
	- **Add a condition** : Creates an If Then conditional statement. 

4. Select **Add an action**, type in 'bing', and select one of the **Bing Search** actions from the list:  

	<INSERT SCREEN SHOT OF BING SEARCH ACTIONS> 

5. In the Search text, enter what you want to search for and configure any other parameters. 

6. Save your changes. 