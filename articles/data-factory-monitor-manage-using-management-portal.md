<properties 
	pageTitle="Monitor and manage Azure Data Factory using Azure Preview Portal" 
	description="Learn how to use Azure Management Portal to monitor and manage Azure data factories you have created." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/17/2015" 
	ms.author="spelluru"/>

# Monitor Azure Data Factory using Azure Preview Portal
This article describes various scenarios for using the Azure Preview Portal to monitor and manage Azure Data Factory.

## <a name="AllDataFactories"></a> View all data factories in an Azure subscription

- Sign-in to the [Azure Preview Portal][azure-preview-portal].
- Click **BROWSE** hub on left and click **Data factories**.  

	![BROWSE hub -> Data Factories][image-data-factory-browse-datafactories]

	If you do not see **Data factories**, click **Everything** and then click **Data factorries** in the **Browse** blade.

	![BROWSE hub -> Everything] [image-data-factory-browse-everything]

- You should see all the data factories in the **Data factories** blade.

	![Data factories blade][image-data-factory-datafactories-blade]

    
## <a name="DataFactoryDetails"></a> View details about a data factory

To view details about a data factory, do one of the following: 


- Click a data factory in the **Data factories** blade shown above.
- Click the link for the data factory on the **Startboard**. **Startboard** is the blade you see when you login in to the Azure Preview Portal. If you had selected **Add to Startboard** while creating a data factory (default option), you should see the data factory link on the Startboard as shown in the following image. In this example, **ADFTutorialDataFactory**, **ADFTutorialDataFactoryDF** and **LogProcessingFactory** data factory links are available on the **Startboard**.


![Data factory from the Startboard][image-data-factory-datafactory-from-startboard]

Either way, you will see the **DATA FACTORY** blade for the selected data factory as shown in the following image. 

 ![Data Factory Home Page][image-data-factory-datafactory-home-page]
 
## <a name="DataFactoryDiagram"></a> View diagram view of the data factory
In the **DATA FACTORY** blade for the data factory, click **Diagram** tile to see the diagram view of the data factory. 

![Data Factory Diagram View][image-data-factory-diagram-view]
 

## <a name="DataFactoryLinkedServices"></a> View linked services in a data factory
In the **DATA FACTORY** blade for the data factory, click **Linked Services** tile to see all the linked services in a list. 

![Linked Services Blade][image-data-factory-linked-services]

## <a name="DataFactoryLinkedService"></a> View details about a linked service
In the **LINKED SERVICES** blade, click the linked service from the list to see details about it. 

![Linked Service Blade][image-data-factory-linked-service]

## <a name="DataFactoryDatasets"></a> View datasets in a data factory 
In the **DATA FACTORY** blade for the data factory, click **Datasets** tile to see all the tables in the data factory.

![Data Sets Blade][image-data-factory-datasets] 

## <a name="DataFactoryDataset"></a>  View details about a dataset
Click the dataset from the list of datasets on the DATASETS blade to see details about the dataset. Note that a table is a rectangular dataset that has a schema. It is the only type of dataset supported at this point. 

![Table Blade][image-data-factory-table]

In the **TABLE** blade above, both **Recently updated slices** and **Recently failed slices** lists are sorted by the **LAST UPDATE TIME**. The update time of a slice is changed in the following situations.

-  You update the status of the slice manually, for example, by using the **Set-AzureDataFactorySliceStatus** (or) by clicking **RUN** on the **SLICE** blade for the slice.
-  The slice changes status due to an execution (e.g. a run started, a run ended and failed, a run ended and succeeded, etc).
 
	
To view the data slices sorted by the slice start/end times instead, click **Data slices (by slice time)** tile.
 
![Data Slices by Slice Time][DataSlicesBySliceTime]

Click on the title of the lists or **... (ellipses)** to see the larger list of slices. 

![All Slices of a Table][image-data-factory-all-slices]

On the **Data Slices** blade, click the **Filter** button to see the **Filter** blade that lets you **filter** slices to see the specific slices that you want to review. You will see the blade similar to the following one when you click **Filter** on the **Data Slices** blade with slices **sorted by update time**. 

![Filter Blade][image-data-factory-filter-blade]

The **Filter** blade allows you to filter based on **last updated time** and **slice status**. The following table describes all slice statuses and their description.
 
Slice status | Description
------------ | ------------
PendingExecution | Data processing has not started yet.
InProgress | Data processing is in-progress.
Ready | Data processing has completed and the data slice is ready.
Failed | Execution of the run that produces the slice failed.
Skip | Skip processing of the slice.
Retry | Retrying the run that produces the slice.
Timed Out | Data processing of the slice has timed out.
PendingValidation | Data slice is waiting for validation against validation policies before being processed.
RetryValidation | Retrying the validation of the slice.
FailedValidation | Validation of the slice failed.
LongRetry | A slice will be in this status if LongRetry is specified in the table JSON, and regular retries for the slice have failed.
ValidationInProgress | Validation of the slice (based on the policies defined in the table JSON) is being performed.

When you click **Filter** on on the **Data Slices** blade with slices **sorted by the slice time**, you will see a different type of **Filter** blade. 

![Filter Blade 2][image-data-factory-filter-blade-2] 


When you launch the **Filter** blade, the **To** field is automatically set to the most recent time (rounded) to limit the number of records returned. The **From** field is automatically set as well. You can change the **From** date by clicking the **Calendar** button. The **To** date is automatically changed when you change the **From** date. 

You can click **Previous**/**Next** buttons to view slices in the previous period/next period. The time range for **Previous** and **Next** buttons is set based on the slice frequency and interval as shown in the following table.

Frequency | Interval Value Range | Resulting Time Chunk
----------| -------------------- | --------------------
Minute | 1-4 | 6 hours
Minute | 5-29 | 1 day
Minute | 30-180 | 7 days
Minute | 180+ | 28 days (approximate. calendar month)
Hour | 1-3 | 7 days
Hour | 4-11 | 28 days (approximate. calendar month)
Hour | 12-72 | 182 days (approximate. 6 months)
Hour | 73+ | 1 year
Day | 1-6 | 1 year
Day | 7-20 | 5 years
Day | 21+ | 10 years
Week | 1-3 | 5 years
Week | 4+ | 10 years
Month | any | 10 years
 
For example, if you define **frequency** as **Hour** and **interval** of **2**, clicking the **Next**/**Previous** buttons move the time range **7 days** in either direction. This logic applies to the Filter blade whether you are viewing all slices/recent slices/problem slices.




## <a name="DataFactorySlice"></a> View details about a slice
Click on a slice in the list of slices either on the **TABLE** blade or **Data Slices** blade to see details about that slice. 

![Data Slice][image-data-factory-dataslice]

If the slice is not in the **Ready** state, you can see the upstream slices that are not Ready and are blocking the current slice from executing in the **Upstream slices that are not ready** list.

### <a name="DataFactoryActivtyRuns"></a> View all activity runs for a slice
For a slice, there can be more than one run. For example, when a slice fails, the service may retry for a few time. You can also rerun a slice that has failed all the retries. You can see all the activity runs on the** Data Slice** blade in the list at the bottom. 

## <a name="DataFactoryActivtyRunDetails"></a>  View details about an activity run
Click on an activity run from the list of runs on the **Data Slice** blade to see details about the activity run. 

![Activity Run Details][image-data-factory-activity-run-details]

## <a name="EventsInThePastweek"></a> Operations Lens - Events in the past week
In the **DATA FACTORY** blade (or home page) for the data factory, click **Events in the past week** in **Operations** Lens to see the events in the past week. This helps you to get a high-level view of operations performed by the data factory in the past week. It also helps you troubleshoot any errors with the data movement/processing. 

![ Data Factory Events][image-data-factory-events]


## See Also

Article | Description
------ | ---------------
[Monitor and Manage Azure Data Factory using PowerShell][monitor-manage-using-powershell] | This article describes how to monitor an Azure Data Factory using Azure PowerShell cmdlets. 


[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[use-pig-and-hive-with-data-factory]: data-factory-pig-hive-activities.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

[azure-preview-portal]: http://portal.azure.com/

[image-data-factory-filter-blade]: ./media/data-factory-monitor-manage-using-management-portal/FilterBlade.png

[image-data-factory-filter-blade-2]: ./media/data-factory-monitor-manage-using-management-portal/FilterBlade2.png


[image-data-factory-browse-everything]: ./media/data-factory-monitor-manage-using-management-portal/BrowseEverything.png

[image-data-factory-browse-datafactories]: ./media/data-factory-monitor-manage-using-management-portal/BrowseDataFactories.png

[image-data-factory-datafactories-blade]: ./media/data-factory-monitor-manage-using-management-portal/DataFactories.png

[image-data-factory-datafactory-from-startboard]: ./media/data-factory-monitor-manage-using-management-portal/DataFactoryFromStartboard.png

[image-data-factory-datafactory-home-page]: ./media/data-factory-monitor-manage-using-management-portal/DataFactoryHomePage.png

[image-data-factory-diagram-view]: ./media/data-factory-monitor-manage-using-management-portal/DiagramView.png

[image-data-factory-linked-services]: ./media/data-factory-monitor-manage-using-management-portal/LinkedServicesBlade.png

[image-data-factory-linked-service]: ./media/data-factory-monitor-manage-using-management-portal/LinkedServiceBlade.png

[image-data-factory-datasets]: ./media/data-factory-monitor-manage-using-management-portal/Datasets.png

[image-data-factory-table]: ./media/data-factory-monitor-manage-using-management-portal/Table.png

[image-data-factory-all-slices]: ./media/data-factory-monitor-manage-using-management-portal/AllSlices.png

[image-data-factory-filter]: ./media/data-factory-monitor-manage-using-management-portal/Filter.png

[image-data-factory-dataslice]: ./media/data-factory-monitor-manage-using-management-portal/DataSlice.png

[image-data-factory-activity-run-details]: ./media/data-factory-monitor-manage-using-management-portal/ActivityRunDetails.png

[image-data-factory-events]: ./media/data-factory-monitor-manage-using-management-portal/Events.png
[DataSlicesBySliceTime]: ./media/data-factory-monitor-manage-using-management-portal/DataSlicesBySliceTime.png