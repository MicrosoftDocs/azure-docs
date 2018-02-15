---
title: How to add a reference data set to your Azure Time Series Insights environment
description: This article describes how to add a reference data set to augment data in your Azure Time Series Insights environment. 
services: time-series-insights
ms.service: time-series-insights
author: jasonwhowell
ms.author: jasonh
manager: kfile
editor: MicrosoftDocs/tsidocs
ms.reviewer: jasonh, kfile, anshan
ms.workload: big-data
ms.topic: article
ms.date: 02/15/2018
---

# Create a reference data set for your Time Series Insights environment using the Azure portal

This article describes how to add a reference data set to your Azure Time Series Insights environment. Reference data is useful to join to your source data to augment the values.

A Reference Data Set is a collection of items that are augmented with the events from your event source. Time Series Insights ingress engine joins an event from your event source with an item in your reference data set. This augmented event is then available for query. This join is based on the keys defined in your reference data set.

## Add a reference data set

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Locate your existing Time Series Insights environment. Click **All resources** in the menu on the left side of the Azure portal. Select your Time Series Insights environment.

3. Select the **Overview** page. Locate the **Time Series Insights explorer URL** and open the link.  

View the explorer for your TSI environment. 
https://insights.timeseries.azure.com/

4. Select the Manager environment reference data icon on the upper right in the explorer page.

Notice that the url changes to https://insights.timeseries.azure.com/referencedata

5. Select the **+ Add a data set** button to begin adding a new data set.

6. On the **New reference data set** page, choose the format of the data.
   - Choose **CSV** for comma-delimited data. The first row is treated as a header row. 
   - Choose **JSON**. 

7. Provide the data, using one of the two methods:
   - Copy the data values, and paste into the text editor. Then, select **Parse reference data** button.
   - Select **Choose File ** button to add data from a local file. 

If there is an error parsing the data values, the error appears in red at the bottom of the page, such as `CSV parsing error, no rows extracted`.

8. Once the data is successfully parsed, a data grid is shown displaying the columns and rows representing the data.  Review the data grid to ensure correctness.

   - Review each column to see the data type assumed, and change the data type if needed.  Select the data type as **#** for double (numerical data), **T|F** for boolean, or **Abc** for string.
   - Rename the column headers if needed. This the column name is necessary to join to the correct property in your event source. Ensure that the names match exactly to your incoming event data, including case-sensitivity.
   - Click **Add a row** or **Add a column** to add more reference data values, if needed.
   - Type a value to **Filter the rows...** to review specific rows as needed. The filter is useful for reviewing data, and is not applied when uploading the data.
 
9. Name the data set, by filling in the **Data set name** field above the data grid.

10. Provide the **Primary Key** column in the data set, by selecting the drop down above the data grid.  The key name match is case-sensitive.

   Optionally, select the **+** button to add a secondary key column, as a composite primary key. If you need to undo the selection, choose the empty value from the drop down, and the secondary key will be removed.

11. Select the **Upload rows** button to upload the data. 

The page will confirm the completed upload and display the message **Successfully uploaded dataset**.

## View existing reference data

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Locate your existing Time Series Insights environment. Click **All resources** in the menu on the left side of the Azure portal. Select your Time Series Insights environment.

3. Under the **Environment Topology** heading, select **Reference Data Sets**.

4. The existing reference data sets are listed. 

## Next steps
* [Manage reference data](time-series-insights-manage-reference-data-csharp.md) programmatically.
* For the complete API reference, see [Reference Data API](/rest/api/time-series-insights/time-series-insights-reference-reference-data-api) document.
