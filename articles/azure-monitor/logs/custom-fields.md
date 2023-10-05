---
title: Custom fields in Azure Monitor (Preview)
description: The Custom Fields feature of Azure Monitor allows you to create your own searchable fields from records in a Log Analytics workspace that add to the properties of a collected record.  This article describes the process to create a custom field and provides a detailed walkthrough with a sample event.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 03/31/2023

---

# Create custom fields in a Log Analytics workspace in Azure Monitor (Preview)

> [!IMPORTANT]
> Creation of new custom fields will be disabled starting March 31, 2023. Custom fields functionality will be deprecated, and existing custom fields will stop functioning by March 31, 2026. You should [migrate to ingestion-time transformations](custom-fields-migrate.md) to keep parsing your log records.
> 
> Currently, when you add a new custom field, it may take up to 7 days before data starts appearing.

The **Custom Fields** feature of Azure Monitor allows you to extend existing records in your Log Analytics workspace by adding your own searchable fields.  Custom fields are automatically populated from data extracted from other properties in the same record.

![Diagram shows an original record associated with a modified record in a Log Analytics workspace with property value pairs added to the original property in the modified record.](media/custom-fields/overview.png)

For example, the sample record below has useful data buried in the event description. Extracting this data into a separate property makes it available for such actions as sorting and filtering.

![Sample extract](media/custom-fields/sample-extract.png)

> [!NOTE]
> In the Preview, you are limited to 500 custom fields in your workspace.  This limit will be expanded when this feature reaches general availability.

## Creating a custom field
When you create a custom field, Log Analytics must understand which data to use to populate its value.  It uses a technology from Microsoft Research called FlashExtract to quickly identify this data.  Rather than requiring you to provide explicit instructions, Azure Monitor learns about the data you want to extract from examples that you provide.

The following sections provide the procedure for creating a custom field.  At the bottom of this article is a walkthrough of a sample extraction.

> [!NOTE]
> The custom field is populated as records matching the specified criteria are added to the Log Analytics workspace, so it will only appear on records collected after the custom field is created.  The custom field will not be added to records that are already in the data store when it’s created.
> 

### Step 1: Identify records that will have the custom field
The first step is to identify the records that will get the custom field.  You start with a [standard log query](./log-query-overview.md) and then select a record to act as the model that Azure Monitor will learn from.  When you specify that you are going to extract data into a custom field, the **Field Extraction Wizard** is opened where you validate and refine the criteria.

1. Go to **Logs** and use a [query to retrieve the records](./log-query-overview.md) that will have the custom field.
2. Select a record that Log Analytics will use to act as a model for extracting data to populate the custom field.  You will identify the data that you want to extract from this record, and Log Analytics will use this information to determine the logic to populate the custom field for all similar records.
3. Right-click on the record, and select **Extract fields from**.
4. The **Field Extraction Wizard** is opened, and the record you selected is displayed in the **Main Example** column.  The custom field will be defined for those records with the same values in the properties that are selected.  
5. If the selection is not exactly what you want, select additional fields to narrow the criteria.  In order to change the field values for the criteria, you must cancel and select a different record matching the criteria you want.

### Step 2: Perform initial extract.
Once you’ve identified the records that will have the custom field, you identify the data that you want to extract.  Log Analytics will use this information to identify similar patterns in similar records.  In the step after this you will be able to validate the results and provide further details for Log Analytics to use in its analysis.

1. Highlight the text in the sample record that you want to populate the custom field.  You will then be presented with a dialog box to provide a name and data type for the field and to perform the initial extract.  The characters **\_CF** will automatically be appended.
2. Click **Extract** to perform an analysis of collected records.  
3. The **Summary** and **Search Results** sections display the results of the extract so you can inspect its accuracy.  **Summary** displays the criteria used to identify records and a count for each of the data values identified.  **Search Results** provides a detailed list of records matching the criteria.

### Step 3: Verify accuracy of the extract and create custom field
Once you have performed the initial extract, Log Analytics will display its results based on data that has already been collected.  If the results look accurate then you can create the custom field with no further work.  If not, then you can refine the results so that Log Analytics can improve its logic.

1. If any values in the initial extract aren’t correct, then click the **Edit** icon next to an inaccurate record and select **Modify this highlight** in order to modify the selection.
2. The entry is copied to the **Additional examples** section underneath the **Main Example**.  You can adjust the highlight here to help Log Analytics understand the selection it should have made.
3. Click **Extract** to use this new information to evaluate all the existing records.  The results may be modified for records other than the one you just modified based on this new intelligence.
4. Continue to add corrections until all records in the extract correctly identify the data to populate the new custom field.
5. Click **Save Extract** when you are satisfied with the results.  The custom field is now defined, but it won’t be added to any records yet.
6. Wait for new records matching the specified criteria to be collected and then run the log search again. New records should have the custom field.
7. Use the custom field like any other record property.  You can use it to aggregate and group data and even use it to produce new insights.

## Removing a custom field
There are two ways to remove a custom field.  The first is the **Remove** option for each field when viewing the complete list as described above.  The other method is to retrieve a record and click the button to the left of the field.  The menu will have an option to remove the custom field.

## Sample walkthrough
The following section walks through a complete example of creating a custom field.  This example extracts the service name in Windows events that indicate a service changing state.  This relies on events created by Service Control Manager during system startup on Windows computers.  If you want to follow this example, you must be [collecting Information events for the System log](../agents/data-sources-windows-events.md).

We enter the following query to return all events from Service Control Manager that have an Event ID of 7036 which is the event that indicates a service starting or stopping.

![Screenshot showing a query for an event source and ID.](media/custom-fields/query.png)

We then right-click on any record with event ID 7036 and select **Extract fields from \`Event`**.

![Screenshot showing the Copy and Extract fields options, which are available when you right-click a record from the list of results.](media/custom-fields/extract-fields.png)

The **Field Extraction Wizard** opens with the **EventLog** and **EventID** fields selected in the **Main Example** column.  This indicates that the custom field will be defined for events from the System log with an event ID of 7036.  This is sufficient so we don’t need to select any other fields.

![Main example](media/custom-fields/main-example.png)

We highlight the name of the service in the **RenderedDescription** property and use **Service** to identify the service name.  The custom field will be called **Service_CF**. The field type in this case is a string, so we can leave that unchanged.

![Field Title](media/custom-fields/field-title.png)

We see that the service name is identified properly for some records but not for others.   The **Search Results** show that part of the name for the **WMI Performance Adapter** wasn’t selected.  The **Summary** shows that one record identified **Modules Installer** instead of **Windows Modules Installer**.  

![Screenshot showing portions of the service name highlighted in the Search Results pane and one incorrect service name highlighted in the Summary.](media/custom-fields/search-results-01.png)

We start with the **WMI Performance Adapter** record.  We click its edit icon and then **Modify this highlight**.  

![Modify highlight](media/custom-fields/modify-highlight.png)

We increase the highlight to include the word **WMI** and then rerun the extract.  

![Additional example](media/custom-fields/additional-example-01.png)

We can see that the entries for **WMI Performance Adapter** have been corrected, and Log Analytics also used that information to correct the records for **Windows Module Installer**.

![Screenshot showing the full service name highlighted in the Search Results pane and the correct service names highlighted in the Summary.](media/custom-fields/search-results-02.png)

We can now run a query that verifies **Service_CF** is created but is not yet added to any records. That's because the custom field doesn't work against existing records so we need to wait for new records to be collected.

![Initial count](media/custom-fields/initial-count.png)

After some time has passed so new events are collected, we can see that the **Service_CF** field is now being added to records that match our criteria.

![Final results](media/custom-fields/final-results.png)

We can now use the custom field like any other record property.  To illustrate this, we create a query that groups by the new **Service_CF** field to inspect which services are the most active.

![Group by query](media/custom-fields/query-group.png)

## Next steps
* Learn about [log queries](./log-query-overview.md) to build queries using custom fields for criteria.
* Monitor [custom log files](../agents/data-sources-custom-logs.md) that you parse using custom fields.
