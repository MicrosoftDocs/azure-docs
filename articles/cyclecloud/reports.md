---
title: Azure CycleCloud Reporting Options | Microsoft Docs
description: View, Edit, and Create Reports within Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Reporting

The reports page is accessible from the main menu and enables long­-term tracking of usage
data across the systems that Azure CycleCloud monitors. Reports are grouped by their underlying
data type.

Reports are based off of data called "Derived Types". These allow large amounts of raw
data to be aggregated over time so that it can easily be stored for months or years.

Other reports use CycleCloud's plugin APIs to display custom views. This section will mostly
focus on standard derived type­-based reports.

## Viewing & Editing Reports

To show reports for a specific type, select it from the sentence filter at the top of the page that
reads "Show: ____ Reports". This will display a list of reports for that type on the left­-hand side
of the screen. Select a report to view or edit it, or use the buttons in the bottom­-left to create,
delete or duplicate an existing report.

In the right­-hand pane, report data is displayed, along with any associated options.
Standard derived type­-based reports have a standard interface with an editable sentence at the
top, followed by a timeline graph and a table below. Plugin­-based reports may have a custom user interface.

Standard reports can be modified and saved using the sentence at the top of the report pane.
Changes are not saved until the "Save" button is pressed, but they are immediately reflected in
the graph and table. This allows users to tweak the options of any given report as­-needed
without saving it.

> [!NOTE]
> Reports are shared across all CycleCloud users for the installation. Changes to a report will be reflected for every user on that installation.

## Standard Report Options

Standard reports have a variety of options for controlling the data that is displayed. See below
for each available option and matching descriptions:

![Standard Reports](~/images/cyclecloud_admin_standard_reports.png)

1. **Partition** selects a partition (of the derived type) which is used to group values on the graph and table. For example, if viewing a Cloud Instance report, selecting region will cause each column of the table and each series of the graph to represent a region.

2. **Instantaneous aggregation function** controls the type of aggregation that is performed for each instantaneous point in time. For example, selecting sum of Instance Count with a partition of Region will add up the number of instances per region for each point in time.

3. **Metric** indicates the value to aggregate. Available metrics are defined on the derived type.

4. A **Filter** to apply when querying at each point in time. This can be any valid filter expression. For example, the following would filter a Cloud Instance report by a single cluster called "mycluster": `ClusterName === "mycluster"`. Note that this filter is applied to the derived type, so not all attributes on the raw data can be used in this filter. Only those that have been defined as metrics or partitions.

5. **Time series aggregation function** controls the type of aggregation that is performed when aggregating time periods. For example, aggregating by the average of every day would take each interval of data from the derived type and re­aggregate it to the day level, averaging across time.

6. The time series **Interval** to aggregate on when displaying the report. Note that most derived types are already aggregated on 15 minute intervals, so that is the minimum level of granularity available.

7. **Time period** determines how far in the past this report should show data.

## Configuring Data Collection (Derived Types)

When logged in as an administrator, the reports page contains a link titled "Configure Data
Collection" in the upper right­-hand corner. Clicking this will open a form which controls how
CycleCloud aggregates data over time for reporting purposes. Below is a screenshot of this
form and descriptions of each section:

![Data Collection](~/images/cyclecloud_admin_data_collection.png)

1. **Collection Interval** ­controls the granularity of data aggregation. For most data, 15 minutes is a good compromise between compact storage and detail.

2. **Metrics** ­displays a list of aggregated numeric values to store on the derived type.

3. **Partitions** ­is a list of discrete values to use to partition the derived type data. Each partition multiplies the number of data points stored for each interval by the number of discrete values contained in that partition. Because of this, partitions should be chosen carefully, using only attributes that contain a limited number of possible values such as cluster name, machine state, etc.

4. **Metric/Partition options** determine ­the definition for the selected partition or metric. Changes will not take effect until the save button is pressed.
