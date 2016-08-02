<properties 
	pageTitle="Logging for Machine Learning web services | Microsoft Azure" 
	description="Learn how to enable logging for Machine Learning web services. Logging provides additional information to help troubleshoot the APIs." 
	services="machine-learning" 
	documentationCenter="" 
	authors="raymondlaghaeian" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="big-data" 
	ms.date="05/10/2016"
	ms.author="raymondl;garye"/>

#Enable logging for Machine Learning web services  

This document provides information on the logging capability of Azure ML Web Services. Enabling logging in web services provides additional information to help troubleshoot the APIs beyond just and error number and a message.  

-	How to enable logging in Web Services:   
	-	Log in to [Azure Classic Portal](https://manage.windowsazure.com/)
	-	Click on Machine Learning, then on your Workspace, then Web Service menu option.
	-	In the Web Services list, click on the name of the web service
	-	In the endpoints list, click on the endpoint name
	-	Click on the Configure menu option
	-	Set the Diagnostics Trace Level to Error or All, then click Save on the botton menu bar
-	What is the effect of enabling logging:  
	-	When Logging is enabled, all the diagnostics/errors from the selected endpoint are logged to the Azure Storage Account linked with the user’s workspace. You can see this storage account in the Azure Classic Portal Dashboard view (bottom of the Quick Glance section) of their workspace.  
-	How to view the logs:  
	-	The logs can be viewed using any of the several tools available to ‘explore’ an Azure Storage Account. The easiest may be to simply navigate to the Storage Account in the Azure Classic Portal and then click on the CONTAINERS tab. You would then see a Container named **ml-diagnostics**. This container holds all the diagnostics info for all the web service endpoints for all the workspaces associated with this Storage account.  
-	What are the log blob details:  
	-	Each blob in the container holds the diagnostics info for exactly one of the following:
		-	An execution of the Batch-Execution method  
		-	An execution of the Request-Response method  
		-	Initialization of a Request-Response container  
	-	The name of each blob has a prefix of the following form: {Workspace Id}-{Web service Id}-{Endpoint Id}/{Log type}  
-	Log type takes one of the following values:  
	- batch  
	- score/requests  
	- score/init  

 
