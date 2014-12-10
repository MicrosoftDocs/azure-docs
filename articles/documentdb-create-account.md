<properties title="How to Create a DocumentDB Account" pageTitle="Create a database account | Azure" description="Learn how to create a DocumentDB NoSQL document database account and choose account settings in the Azure Preview portal."  metaKeywords="NoSQL, DocumentDB, database, document-orientated database, JSON, account" services="documentdb"  solutions="data-management" documentationCenter=""  authors="mimig" manager="jhubbard" editor="monicar" videoId="" scriptId="" />

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/09/2014" ms.author="mimig" />

#Create a database account
To use DocumentDB, you must create a DocumentDB account.  This topic describes how to create a DocumentDB account in the Azure Preview portal.  


1.	Sign in to the [Azure management preview portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB).
2.	Click New -> DocumentDB Account.  
	![][1]  

	Alternatively, from the Startboard, you can browse the Azure Marketplace, select the “Data + analytics” category, choose **DocumentDB** and then click **Create**.  

	![][2]   

3. In the **New DocumentDB (Preview)** blade, specify the desired configuration for the DocumentDB account. 
 
	![][3] 


	- In the **Id** box, enter a name to identify the DocumentDB account. This value becomes the host name within the URI. The Id may contain only lowercase letters, numbers, and the '-' character, and must be between 3 and 50 characters. Note that documents.azure.com is appended to the endpoint name you choose, the result of which will become your DocumentDB account endpoint.

	- The **Pricing Tier** lens is locked because the DocumentDB preview supports a single standard pricing tier. For more information, see [DocumentDB pricing](http://go.microsoft.com/fwlink/p/?LinkID=402317&clcid=0x409).

	- The **Optional configuration** lens is used to specify the initial capacity allocated to your DocumentDB account.  DocumentDB leverages capacity units to allow you to scale your DocumentDB account, where each capacity unit includes reserved database storage and throughput.  By default, 1 capacity unit is provisioned.  You can adjust the number of capacity units available to your DocumentDB account at any time via the [Azure management preview portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB). For details about DocumentDB account capacity and throughput,please see the [Manage DocumentDB capacity and performance][documentdb-manage] article.

	- In **Resource group**, select or create a resource group for your DocumentDB account.  By default, a new Resource group will be created.  You may, however, choose to select an existing resource group to which you would like to add your DocumentDB account. For more information, see [Using resource groups to manage your Azure resources](http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-resource-groups/).

	- For **Subscription**, select the Azure subscription that you want to use for the DocumentDB account. If your account has only one subscription, that account will be selected automatically.*
 
	- Use **Location** to specify the geographic location in which your DocumentDB account will be hosted.   

3.	Once the new DocumentDB account options are configured, click **Create**.  It can take a few minutes for the DocumentDB account to be created.  To check the status, you can monitor the progress on the Startboard.  
	![][4]  
  
	Or, you can monitor your progress from the Notifications hub.  

	![][5]  

	![][6]

4.	After the DocumentDB account has been created, it is ready for use with the default settings.

	*Note that the default consistency of the DocumentDB account will be set to Session.  You can adjust the default consistency setting via the [Azure management preview portal](https://portal.azure.com/#gallery/Microsoft.DocumentDB).*  
	![][7]  

5.	You may also access your existing DocumentDB accounts from the **Browse** blade.  
	![][8]

##<a id="NextSteps"></a>Next steps
To get started with Azure DocumentDB, explore these resources:

-	[DocumentDB resource model and concepts](/documentation/articles/documentdb-resources/)
-	[Interact with DocumentDB resources](/documentation/articles/documentdb-interactions-with-resources/)
-	[How to create a DocumentDB account](/documentation/articles/documentdb-create-account/)
-	[Get started with a DocumentDB account](/documentation/articles/documentdb-get-started/)

To learn more about DocumentDB, see the Azure DocumentDB documentation on [azure.com](http://go.microsoft.com/fwlink/p/?LinkID=402319)

[How to: Create a DocumentDB account]: #Howto
[Next steps]: #NextSteps
[documentdb-manage]:../documentdb-manage/

<!--Image references-->
[1]: ./media/documentdb-create-account/ca1.png
[2]: ./media/documentdb-create-account/ca2.png
[3]: ./media/documentdb-create-account/ca3.png
[4]: ./media/documentdb-create-account/ca4.png
[5]: ./media/documentdb-create-account/ca5.png
[6]: ./media/documentdb-create-account/ca6.png
[7]: ./media/documentdb-create-account/ca7.png
[8]: ./media/documentdb-create-account/ca8.png
