<properties 
	pageTitle="Monitor and manage Azure Data Factory pipelines" 
	description="Learn how to use Monitoring and Management App to monitor and manage Azure data factories and pipelines." 
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
	ms.date="06/20/2016" 
	ms.author="spelluru"/>

# Monitor and manage Azure Data Factory pipelines using new Monitoring and Management App
> [AZURE.SELECTOR]
- [Using Azure Portal/Azure PowerShell](data-factory-monitor-manage-pipelines.md)
- [Using Monitoring and Management App](data-factory-monitor-manage-app.md)

This article describes how to monitor, manage and debug your pipelines, and create alerts to get notified on failures using the **Monitoring and Management App**. You can also watch the following video to learn about using the Monitoring and Management App.
   

> [AZURE.VIDEO azure-data-factory-monitoring-and-managing-big-data-piplines]
      
## Launching the Monitoring and Management App a
To launch the Monitor and Management App, click **Monitoring & Manage** tile on the **DATA FACTORY** blade for your data factory.

![Monitoring tile on Data Factory home page](./media/data-factory-monitor-manage-app/MonitoringAppTile.png) 

You should see the Monitoring and Management App launched in a separate tab/window.  

![Monitoring and Management App](./media/data-factory-monitor-manage-app/AppLaunched.png)

> [AZURE.NOTE] If you see that the web browser is stuck at "Authorizing...", disable/uncheck **Block third party cookies and site data** setting (or) keep it enabled and create an exception for **login.microsoftonline.com** and then try launching the app again.


If you do not see activity windows in the list at the bottom, click the **Refresh** button on the toolbar to refresh the list. In addition, set the right values for the **Start time** and **End time** filters.  


## Understanding the Monitoring and Management App
There are three tabs (**Resource Explorer**, **Monitoring Views** and **Alerts**) on the left and the first tab (Resource Explorer) is selected by default. 

### Resource Explorer
You see Resource Explorer **tree view** in the left pane, **Diagram View** at the top and **Activity Windows** list at the bottom in the middle pane, and **Properties**/**Activity Window Explorer** tabs in the right pane. 

You can see all resources (pipelines, datasets, linked services) in the data factory in a tree view. When you select an object in Resource Explorer, you will notice the following: 

- associated Data Factory entity is highlighted in the Diagram View.
- associated activity windows (click [here](data-factory-scheduling-and-execution.md) to learn about activity windows) are highlighted in the Activity Windows list at the bottom.  
- properties of the selected object in the Properties window in the right pane. 
- JSON definition of the selected object if applicable. For example: a linked service or a dataset or a pipeline. 

![Resource Explorer](./media/data-factory-monitor-manage-app/ResourceExplorer.png)

See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for detailed conceptual information about activity window. 

### Diagram View
The Diagram View of a data factory provides a single pane of glass to monitor and manage the data factory and its assets. When you select a Data Factory entity (dataset/pipeline) in the diagram view, you will notice the following:
 
- the data factory entity is selected in the tree view
- associated activity windows are highlighted in the Activity Windows list.
- properties of the selected object in the Properties window

When the pipeline is enabled (i.e. not in paused state) then it is shown with a green line as shown below. 

![Pipeline Running](./media/data-factory-monitor-manage-app/PipelineRunning.png)

You notice that there are three command buttons for the pipeline in the diagram view. You can use the 2nd button to pause the pipeline. This will not terminate the currently running activities and let them proceed to completion. 3rd button will pause the pipeline and terminate its existing executing activities. 1st button resumes the pipeline i.e. un-pauses it. When you pipeline is paused, you will notice the color change for the pipeline tile as follows.

![Pause/Resume on Tile](./media/data-factory-monitor-manage-app/SuspendResumeOnTile.png)

You can multi-select two or more pipelines (using CTRL) and use command bar buttons to pause/resume multiple pipelines at a time.

![Pause/Resume on Command bar](./media/data-factory-monitor-manage-app/SuspendResumeOnCommandBar.png)

You can see all the activities in the pipeline, by right-clicking on the pipeline tile, and clicking **Open pipeline**.

![Open Pipeline menu](./media/data-factory-monitor-manage-app/OpenPipelineMenu.png)

In the opened pipeline view, you will see all activities in the pipeline. In this example, there is only one activity: Copy Activity. To go back to the previous view, click on data factory name in the breadcrumb menu at the top.

![Opened Pipeline](./media/data-factory-monitor-manage-app/OpenedPipeline.png)

In either the closed/opened pipeline view, when you click an output dataset, when you move your mouse over the output dataset, you will see the Activity Windows pop up for that dataset.

![Activity Windows popup](./media/data-factory-monitor-manage-app/ActivityWindowsPopup.png)

You can click on an activity window to see details for it in the **Property** window in the right pane. 

![Activity Window Properties](./media/data-factory-monitor-manage-app/ActivityWindowProperties.png)

In the right pane, switch to **Activity Window Explorer** tab to see more details.

![Activity Window Explorer](./media/data-factory-monitor-manage-app/ActivityWindowExplorer.png) 

You will also see **resolved variables** for each activity run attempt in the **Attempts** section. 

![Resolved variables](./media/data-factory-monitor-manage-app/ResolvedVariables.PNG)

Switch to the **Script** tab to see the JSON script definition for the selected object.   

![Script tabl](./media/data-factory-monitor-manage-app/ScriptTab.png)

You can see activity windows in three places:

- Activity Windows pop up in the diagram view (middle pane).
- Activity Window Explorer in the right pane.
- Activity Windows list in the bottom pane.

In the Activity Windows pop up and Activity Window Explorer, you can scroll to previous week and next week using left and right arrows.

![Activity Window Explorer Left/Right Arrows](./media/data-factory-monitor-manage-app/ActivityWindowExplorerLeftRightArrows.png)

At the bottom of the Diagram View, you will see buttons to Zoom In, Zoom Out, Zoom to Fit, Zoom 100%, Lock layout (prevents you from accidentally moving tables and pipelines in the diagram view). The Lock layout button is ON by default. You can turn it off and move entities around in the diagram. When you turn it OFF, you can use the last button to automatically position tables and pipelines. You can also Zoom in/Zoom Out using mouse wheel.

![Diagram View Zoom commands](./media/data-factory-monitor-manage-app/DiagramViewZoomCommands.png)


### Activity Windows List
The Activity windows list in the bottom of the middle pane displays all activity windows for the dataset you selected in the resource explorer or diagram view. By default, the list is in the descending order, which means that you see the latest activity window at the top. 

![Activity Windows List](./media/data-factory-monitor-manage-app/ActivityWindowsList.png)

This list does not refresh automatically, so use the refresh button on the toolbar to manually refresh it.  


The activity windows can be in one of the following statuses:

<table>
<tr>
	<th align="left">Status</th><th align="left">Substatus</th><th align="left">Description</th>
</tr>
<tr>
	<td rowspan="8">Waiting</td><td>ScheduleTime</td><td>The time has not come for the activity window to run.</td>
</tr>
<tr>
<td>DatasetDependencies</td><td>The upstream dependencies are not ready.</td>
</tr>
<tr>
<td>ComputeResources</td><td>The compute resources are not available.</td>
</tr>
<tr>
<td>ConcurrencyLimit</td> <td>All the activity instances are busy running other activity windows.</td>
</tr>
<tr>
<td>ActivityResume</td><td>Activity is paused and cannot run the activity windows until it is resumed.</td>
</tr>
<tr>
<td>Retry</td><td>Activity execution will be retried.</td>
</tr>
<tr>
<td>Validation</td><td>Validation has not started yet.</td>
</tr>
<tr>
<td>ValidationRetry</td><td>Waiting for the validation to be retried.</td>
</tr>
<tr>
<tr
<td rowspan="2">InProgress</td><td>Validating</td><td>Validation in progress.</td>
</tr>
<td></td>
<td>The activity window is being processed.</td>
</tr>
<tr>
<td rowspan="4">Failed</td><td>TimedOut</td><td>Execution took longer than that is allowed by the activity.</td>
</tr>
<tr>
<td>Canceled</td><td>Canceled by user action.</td>
</tr>
<tr>
<td>Validation</td><td>Validation has failed.</td>
</tr>
<tr>
<td></td><td>Failed to generate and/or validate the activity window.</td>
</tr>
<td>Ready</td><td></td><td>The activity window is ready for consumption.</td>
</tr>
<tr>
<td>Skipped</td><td></td><td>The activity window is not processed.</td>
</tr>
<tr>
<td>None</td><td></td><td>A activity window that used to exist with a different status, but has been reset.</td>
</tr>
</table>


When you click an activity window in the list, you will see details about the activity window in the **Activity Windows Explorer** or **Properties** window on the right.

![Activity Window Explorer](./media/data-factory-monitor-manage-app/ActivityWindowExplorer-2.png)

### Refresh activity windows  
The details are not automatically refreshed, so you use the **refresh** button (second button) on the command bar to manually refresh the activity windows list.  
 

### Properties window
The Properties window is in the right-most pane of the Monitoring and Management app. 

![Properties window](./media/data-factory-monitor-manage-app/PropertiesWindow.png)

It displays properties for the item you selected in the resource explorer (tree view) (or) diagram view (or) activity windows list. 

### Activity Window Explorer

The **Activity Window Explorer** window is in the right-most pane of the Monitoring and Management App. It displays details about the activity window you selected in the Activity Windows pop up or Activity Windows list. 

![Activity Window Explorer](./media/data-factory-monitor-manage-app/ActivityWindowExplorer-3.png)

You can switch to different activity window by clicking on it in the calendar view at the top. You can also use the **left arrow**/**right arrow** buttons at the top to see activity windows from the previous/next week.

You can use the toolbar buttons in the bottom pane to **rerun** the activity window or **refresh** the details in the pane. 

### Script 
You can use the **Script** tab to view the JSON definition of the selected Data Factory entity (linked service, dataset, and pipeline). 

![Script tabl](./media/data-factory-monitor-manage-app/ScriptTab.png)

## Using system views
The Monitoring and Management App includes pre-built system views (**Recent activity windows**, **Failed activity windows**, **In-Progress activity windows**) that allows you to view recent/failed/in-progress activity windows for your data factory. 

Switch to the **Monitoring Views** tab on the left by clicking on it. 

![Monitoring Views tab](./media/data-factory-monitor-manage-app/MonitoringViewsTab.png)

There are three system views supported at this time. Select an option to see recent activity windows (or) failed activity windows (or) in-progress activity windows in the Activity Windows list (at the bottom of the middle pane). 

When you select **Recent activity windows** option, you see all recent activity windows in the descending order of **last attempt time**. 

You can use the **Failed activity windows** view to see all failed activity windows in the list. Select a failed activity window in the list to see details about it in the **Properties** window (or) **Activity Window Explorer**. You can also download any logs for a failed activity window. 


## Sorting and filtering activity windows
Change the **start time** and **end time** settings in the command bar to filter activity windows. After you change Start time and End time, click the button next to end-time to refresh the Activity Windows list.

![Start and End Times](./media/data-factory-monitor-manage-app/StartAndEndTimes.png)

> [AZURE.NOTE] All times are in UTC format in the Monitoring and Management App at this time. 

In the **Activity Windows list**, click on the name of a column (for example: Status). 

![Activity Windows List column menu](./media/data-factory-monitor-manage-app/ActivityWindowsListColumnMenu.png)

You can do the following:

- Sort in the ascending order.
- Sort in the descending order.
- Filter by one or more values (Ready, Waiting, etc…)

When you specify a filter on a column, you will see the filter button enabled for that column to indicate that the values in the column are filtered values. 

![Filter in column of Activity Windows list](./media/data-factory-monitor-manage-app/ActivityWindowsListFilterInColumn.png)

You can use the same pop up window to clear filters. To clear all filters for the activity windows list, click the clear filter button on the command bar. 

![Clear all filters in Activity Windows list](./media/data-factory-monitor-manage-app/ClearAllFiltersActivityWindowsList.png)


## Performing batch actions

### Re-run selected activity windows
Select an activity window, click the down arrow for the first command bar button and select **Rerun** / **Rerun with upstream in pipeline**. When you select **Rerun with upstream in pipeline** option, it reruns all upstream activity windows as well. 
	![Rerun a activity window](./media/data-factory-monitor-manage-app/ReRunSlice.png)

You can also select multiple activity windows in the list and rerun them at the same time. You may want to filter activity windows based on the status (for example: **Failed**) and then rerun the failed activity windows after correcting the issue that causes the activity windows to fail. See the following section for details about filtering activity windows in the list.  

### Pause/resume multiple pipelines
You can multi-select two or more pipelines (using CTRL) and use command bar buttons (highlighted in red rectangle in the following image) to pause/resume them at a time.

![Suspend/Resume on Command bar](./media/data-factory-monitor-manage-app/SuspendResumeOnCommandBar.png)

## Creating alerts 
The Alerts page lets you create a new alert, view/edit/delete existing alerts. You can also disable/enable an alert. Click the Alerts tab to see the page.

![Alerts tab](./media/data-factory-monitor-manage-app/AlertsTab.png)

### To create an alert

1. Click **Add Alert** to add an alert. You will see the Details page. 

	![Create Alerts - Details page](./media/data-factory-monitor-manage-app/CreateAlertDetailsPage.png)
1. Specify the **name** and **description** for the alert, and click **Next**. You should see the **Filters** page.

	![Create Alerts - Filters page](./media/data-factory-monitor-manage-app/CreateAlertFiltersPage.png)

2. Select the **event**, **status** and **substatus** (optional) on which you want the Data Factory service to alert you, and click **Next**. You should see the **Recipients** page.

	![Create Alerts - Recipients page](./media/data-factory-monitor-manage-app/CreateAlertRecipientsPage.png) 
3. Select **Email subscription admins** option and/or enter **additional administrator email**, and click **Finish**. You should see the alert in the list. 
	
	![Alerts list](./media/data-factory-monitor-manage-app/AlertsList.png)

In the Alerts list, use the buttons associated with the alert to edit/delete/disable/enable an alert. 

### Event/status/substatus
The following table provides the list of available events and statuses (and sub-statuses).

Event name | Status | Sub status
-------------- | ------ | ----------
Activity Run Started | Started | Starting
Activity Run Finished | Succeeded | Succeeded 
Activity Run Finished | Failed| Failed Resource Allocation<br/><br/>Failed Execution<br/><br/>Timed Out<br/><br/>Failed Validation<br/><br/>Abandoned
On-Demand HDI Cluster Create Started | Started | &nbsp; |
On-Demand HDI Cluster Created Successfully | Succeeded | &nbsp; |
On-Demand HDI Cluster Deleted | Succeeded | &nbsp; |
### To edit/delete/disable an alert


![Alerts buttons](./media/data-factory-monitor-manage-app/AlertButtons.png)



    
 


