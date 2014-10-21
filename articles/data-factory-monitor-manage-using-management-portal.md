<properties title="Monitor and manage Azure Data Factory using Azure Preview Portal" pageTitle="Monitor and manage Azure Data Factory using Azure Preview Portal" description="Learn how to use Azure Management Portal to monitor and manage Azure data factories you have created." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Monitor Azure Data Factory using Azure Preview Portal

## View all data factories in an Azure subscription

- Sign-in to the [Azure Preview Portal][azure-preview-portal].
- Click **BROWSE** hub on left and click **Data factories**.  

	![BROWSE hub -> Data Factories][image-data-factory-browse-datafactories]

	If you do not see **Data factories**, click **Everything** and then click **Data factorries** in the **Browse** blade.

	![BROWSE hub -> Everything] [image-data-factory-browse-everything]

- You should see all the data factories in the **Data factories** blade.

	![Data factories blade][image-data-factory-datafactories-blade]

    
## View details about a data factory

To view details about a data factory, click a data factory in the **Data factories** blade shown above                    			<br/>(or)<br/> 
click the link for the data factory on the **Startboard**. **Startboard** is the blade you see when you login in to the Azure Portal. If you had selected **Add to Startboard** while creating a data factory, you should see the data factory link on the Startboard as shown in the following image. In this example, **ADFTutorialDataFactory**, **ADFTutorialDataFactoryDF** and **LogProcessingFactory** data factory links are available on the Startboard.


![Data factory from the Startboard][image-data-factory-datafactory-from-startboard]

Either way, you will see the DATA FACTORY blade for the selected data factory as shown in the following image. 

 
 

## View linked services in a data factory

## View details about a linked service

## View tables in a data factory 

## View details about a table 

## View all slices for a table

## View details about a slice

## View all activity runs for a slice

## View details about a run


[azure-preview-portal]: http://portal.azure.com/

[image-data-factory-browse-everything]: ./media/data-factory-monitor-manage-using-management-portal/BrowseEverything.png

[image-data-factory-browse-datafactories]: ./media/data-factory-monitor-manage-using-management-portal/BrowseDataFactories.png

[image-data-factory-datafactories-blade]: ./media/data-factory-monitor-manage-using-management-portal/DataFactories.png

[image-data-factory-datafactory-from-startboard]: ./media/data-factory-monitor-manage-using-management-portal/DataFactoryFromStartboard.png