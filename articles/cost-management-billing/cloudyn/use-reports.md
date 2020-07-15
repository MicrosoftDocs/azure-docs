---
title: Use Cloudyn reports in Azure
description: This article describes the purpose of the Cloudyn reports that are included in the Cloudyn portal to help you effectively use them.
author: bandersmsft
ms.author: banders
ms.date: 03/12/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: benshy
ms.custom: seodec18
ROBOTS: NOINDEX
---

# Reports available in the Cloudyn portal

This article describes the purpose of the Cloudyn reports that are included in the Cloudyn portal. It also describes how you can effectively use the reports. Most reports are intuitive and have a uniform look and feel. Most of the actions that you can do in one report, you can also do in other reports. For an overview about how to use Cloudyn reports, including how to customize and save or to schedule reports, see [Understanding cost reports](understanding-cost-reports.md).

Azure Cost Management offers similar functionality to Cloudyn. Azure Cost Management is a native Azure cost management solution. It helps you analyze costs, create and manage budgets, export data, and review and act on optimization recommendations to save money. For more information, see [Azure Cost Management](../cost-management-billing-overview.md).

[!INCLUDE [cloudyn-note](../../../includes/cloudyn-note.md)]

## Report types

There are three types of Cloudyn reports:

- Over-time reports. For example, the Cost Over Time report. Over-time reports show a time series of data over a selected interval with a predefined resolution and show a weekly resolution for last two months. You can use grouping and filtering to zoom in to various data points.
  - Over-time reports can help you view trends and detect spikes or anomalies.
- Analysis reports. For example, the Cost Analysis report. These reports show aggregated data over a period that you define and allow grouping and filtering on the data.
  - Analysis reports can help you view spikes and determine anomaly root-causes and to show you a granular break-down of your data.
- Tabular reports. You can view any report as a table, but some reports are viewed only as a table. These reports provide you detailed lists of items.
  - Recommendations are tabular reports—there are no visualizations for recommendations. However, you can visualize recommendation results. For example, savings over time.
  - Tabular reports are useful as lists of actions or for data export for further processing. For example, a chargeback report.

Cost reports show either _actual_ or _amortized_ costs.

Actual cost reports display the payments made during the selected time frame. For example, all one-time fees such as reserved instance (RI) purchases are shown in actual cost reports as spikes in cost.

Amortized cost reports spread one-time fees over a period to which they apply. For example, one-time fees for RI purchases are spread over the reservation term and are not shown as a spike. The amortized view is the only way to see true trends and make cost projections.

In some cases, the amortization is presented as a separate report. Examples include the Cost Analysis and Amortized Cost Analysis reports. In other cases, amortization is a report policy such as the Cost Allocation and Cost Analysis reports.

You can schedule any report for periodic delivery. Cost reports allow setting a threshold, so they're useful for alerts.

## Cost analysis vs. cost allocation

_Cost analysis_ reports display billing data from your cloud providers. Using the reports, you can group and drill into various data segments itemized from the billing file. The reports enable granular cost navigation across your cloud vendor's raw billing data.

Some _cost analysis_ reports don't group costs by resource tags. And, tag-based billing information only appears in reports after you allocate costs by creating a cost model using [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs).

_Cost allocation_ reports are available after you create a cost model using [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs). Cloudyn processes cost and billing data and _matches_ the data to the usage and tag data of your cloud accounts. To match the data, Cloudyn requires access to your usage data. If you have accounts that are missing credentials, they are labeled as _uncategorized resources_.

## Dashboards

Dashboards in Cloudy provide a high-level view of reports. Dashboards are made up of widgets and each widget is essentially a report thumbnail. When you [customize reports](understanding-cost-reports.md#save-and-schedule-reports), you save them to My Reports and they're added to the dashboard. For more information about dashboards, see [View key cost metrics with dashboards](dashboards.md).

## Budget information in reports

Many Cloudyn reports show budget information after you've manually created one. So reports won't show budget information until you create a budget. For more information, see [Budget Management settings](#budget-management-settings).

## Reports and reporting features

Cloudyn includes the following reports and reporting features.

### Cost Navigator report

The Cost Navigator report is a quick way to view your billing consumption using a dashboard view. It has a subset of filters and basic views to immediately show a summarized view of organization's costs. Costs are shown by date. Because the report is intended as an initial view of your costs, it's not as flexible or as comprehensive as many other reports or custom dashboards that you create yourself.

By default, major views in the report show:

- Cost over time showing a work week bar chart view. You can change the **Date Range** to change date range bar chart.
- Expenditures by service, using a pie chart.
- Resource categorization by tags, using a pie chart.
- Expenditures by cost entities, using a pie chart.
- Cost total, per date in a list view.

### Cost Analysis report

The Cost Analysis report is a calculation of showback and chargeback, based on your policy. It aggregates your cloud consumption during a selected time frame, after having applied all allocation rules to your cost. For example, it calculates the costs by tags, reassigns the costs of untagged resources and optionally allocates the utilization of reserved instances.

The policies set in [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) are used in the Cost Analysis report and results are then combined with information from your cloud vendor's raw data.

How is this report calculated? The Cloudyn service ensures allocation retains the integrity of each linked account by applying _account affinity_. Affinity ensures an account that doesn't use a specific service doesn't have any costs of this service allocated to it. The costs accrued in that account remain in that account and are not calculated by the allocation policies. For example, you might have five linked accounts. If only three of them use storage services, then the cost of storage services is only allocated across tags in the three accounts.

Use the Cost Analysis report to:

- Calculate your organization chargeback/showback
- Categorize all your costs
- Display an aggregated view of your entire deployment for a specific time frame.
- View costs by tag categories based on policies created in the cost model.

To use the Cost Analysis report:

1. Select a date range.
2. Add tags, as needed.
3. Add groups.
4. Choose a cost model that you created previously.

### Cost Over Time report

The Cost over Time report displays the results of cost allocation as time series. It allows you to observe trends and detect irregularities in your deployment. It essentially shows costs distributed over a defined period. The report includes your main cost contributors including ongoing costs and one-time reserved instance fees that are being spent during a selected time frame. Policies set in [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) are used in this report.

Use the Cost Over Time report to:

- See changes over time and which influences change from one day (or date range) to the next.
- Analyze costs over time for a specific instance.
- Understand why there was a cost increase for a specific instance.

To use the Cost Over Time report:

1. Select a date range.
2. Add tags, as needed.
3. Add groups.
4. Choose a cost model that you created previously.
5. Select actual costs or amortized costs.
6. Choose whether to apply allocation rules to view raw billing data view or to recalculated cost view.

### Actual Cost Analysis report

The Actual Cost Analysis report shows provider costs with no modifications. It shows your main cost contributors, including ongoing costs and one-time fees.

You can use the report to view cost information for your subscriptions. In the report, Azure subscriptions are shown as **account name** and **account number**. **Linked accounts** show AWS subscriptions. To view per subscription costs, a breakdown for each account, under **Groups**, select the type of subscription that you have.

Use the Actual Cost Analysis report to:

- Analyze and monitor raw provider costs spent during a specified time frame.
- Schedule a threshold alert.
- Analyze unmodified costs incurred by your accounts and entities.

### Actual Cost Over Time report

The Actual Cost Over Time report is a standard cost analysis report distributing cost over a defined time resolution. The report displays spending over time to allow you to observe trends and detect spending irregularities. This report shows your main cost contributors including ongoing costs and one-time reserved instance fees that are being spent during a selected time frame.

Use the Actual Cost Over Time report to:

- See cost trends over time.
- Find irregularities in cost.
- Find all cost-related questions related to cloud providers.

### Amortized cost reports

This set of amortized cost reports shows linearized non-usage based service fees, or one-time payable costs and spread their cost over time evenly during their lifespan. For example, one-time fees might include:

- Annual support fees
- Annual security component fees
- Reserved Instances purchase fees
- Some Azure Marketplace items

In the billing file, one-time fees are characterized when the service consumption start and end dates (timestamp) have equal values. The Cloudyn service then recognizes them as one-time fees that are amortized. Other consumption-based services with on-demand usage costs are not amortized.

Amortized cost reports include:

- Amortized cost analysis
- Amortized cost over time

### Cost Analysis report

The Cost Analysis report provides insight into your cloud consumption and spending during a selected time frame. The policies set in the [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) are used in the Cost Analysis report.

How does Cloudyn calculate this report?

Cloudyn ensures that allocation retains the integrity of each linked account by applying _account affinity_. Affinity ensures an account that doesn't use a specific service also doesn't have any costs of this service allocated to it. The costs accrued in that account remain in that account and aren't calculated by the allocation policies. For example, you might have five linked accounts. If only three of them use storage services, then the cost of storage services is only allocated across tags in the three accounts.

Use the Cost Analysis report to:

- Display an aggregated view of your entire deployment for a specific time frame.
- View costs by tag categories based on policies created in the cost model.

### Cost Over Time report

The Cost Over Time report displays spending over time so you can spot trends and notice irregularities in your deployment. It essentially shows costs distributed over a defined period. The report includes your main cost contributors including ongoing costs and one-time reserved instance fees that are being spent during a selected time frame. Policies set in [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) are used in this report.

Use the Cost Over Time report to:

- See changes over time and which influences change from one day (or date range) to the next.
- Analyze costs over time for a specific instance.
- Understand why there was a cost increase for a specific instance.

### Custom Charges report

Enterprise and CSP users often find themselves providing added services to their external or internal customers, in addition to their own cloud resource consumption. You define custom charges for added services or discounts that are added to customer's billing or chargeback reports as custom line items.

Custom service charges reflect services that aren't normally shown in a bill. The custom charges that you create are then shown in Cost reports.

*Custom charges aren't custom pricing*. The list of custom charges doesn't show the different rates that you may be charging. For example, AWS billing charges are displayed just as they are charged.

To create a custom charge:

1. In **Custom Charges**, click  **Add New**. The _Add New Custom Charge_ dialog box is displayed.
2. In **Provider Name**, enter the name of the provider.
3. In **Service Name**, enter the type of service.
4. In **Description**, add a description for the custom charge.
5. In **Type**, enter the select  **Percentage** and then in Services dropdown, select the services to include as custom charges in the cost reports.
6. In **Payment**, select if the charge is a One-Time Fee or Recurring Fee. If the charge is a Recurring Fee, select Amortized if you want the charge to be amortized and select the number of months.
7. In **Dates**, if a one-time fee is selected, in **Effective Date**, enter the date the charge is paid. If Recurring Fee is selected, enter the date range including start date and the end date for the charge.
8. In the **Entities tree**, select the entities that you want to apply the charge to and then select **On**.

_When charges are assigned to an entity, users can't change them. Charges that are added by an administrator to a parent entity are read-only._

To view custom charges:

Custom charges are shown in Cost reports. For example, open the Actual Cost Analysis report, then under **Extended Filters**, select **Standalone**. Then filter to show **Custom Charges**.

### Cost Allocation 360

You use Cost Allocation 360 to create custom cost allocation models to assign costs to consumed cloud resources. Many reports show information from custom cost models that you've created with custom cost models. And, some reports only show information after you've created a custom cost model with cost allocation.

For more information about creating custom cost models, see [Tutorial: Manage costs by using Cloudyn](tutorial-manage-costs.md).

### Cost vs. Budget Over Time report

The Cost vs. Budget Over Time report allows you to compare the main cost contributors against your budget. The assigned budget appears in the report so that you can view your (over/under/par) budget consumption over time. Using Show/Hide Fields at the top of the report, you can select to view cost, budget, accumulated cost, and total budget.

### Current Month Projected Cost report

The Current Month Projected Cost report provides insight into your current month-to-date cost summary. This report displays your costs from the beginning of month, from the previous month, and the total projected cost for the current month. The current month projected cost is calculated as sum of the up-to-date monthly cost and a projection based on the cost monitored in the last 30 days.

Use the Current Month Projected Cost report to:

- Project monthly costs by service
- Project monthly costs by account

### Annual Projected Cost report

The Annual Projected Costs report allows you to view annual projected costs based on previous spending trends. It shows the next 12 months of overall projected costs. The projections are made using a trend function extrapolated over the next 12 months, based on the costs associated with the last 30 days of usage.

### Budget Management settings

Budget Management allows you to set a budget for your fiscal year.

To add a budget to an entity:

1. On the Budget Management page, under **Entities**, select the entity where you want to create the budget.
2. In the budget year, select the year where you want to create the budget.
3. In each month, set your budget and then and click **Save**.

To import a file for the annual budget:

1. Under **Actions**, select **Export** to download an empty CSV template to use as your basis for the budget.
2. Fill in the CSV file with your budget entries and save it locally.
3. Under **Actions**, select **Import**.
4. Select your saved file and then click  **OK**.

To export your completed budget as a CSV file, under **Actions**, select **Export** to download the file.

When completed, your budget is shown in Cost Analysis reports and in the Cost vs. Budget Over Time report. You can also schedule reports based on budget thresholds.

### Azure Resource Explorer report

The Azure Resource Explorer report shows a bulk list of all the Azure resources available in Cloudyn. To effectively use the report, your Azure accounts should have extended metrics enabled. Extended metrics provide Cloudyn access to your Azure VMs. For more information, see [Add extended metrics for Azure virtual machines](azure-vm-extended-metrics.md).

### Azure Resources Over Time report

The Azure Resources Over Time report shows a breakdown of all resources running over a specific period. To effectively use the report, your Azure accounts should have extended metrics enabled. Extended metrics provide Cloudyn access to your Azure VMs. For more information, see [Add extended metrics for Azure virtual machines](azure-vm-extended-metrics.md).

### Instance Explorer report

The Instance Explorer report is used to view various metrics for assets of your virtual machines. You can drill-into specific instances to view information such as:
- Instance running intervals
- Life cycle in the selected period
- CPU utilization
- Network input
- Output traffic
- Active disks

The Instance Explorer report collects all running intervals within the defined date range and aggregates data accordingly. To view each of the running intervals during the date range, expand the instance. The cost of each instance is calculated for the date range selected based on AWS and Azure list prices. No discounts are applied. You can add additional fields to the report using Show/Hide Fields.

Use Instance Explorer report to:

- Calculate the estimated cost per machine.
- Create a full list, including aggregated running hours, of all machines that were active during a time range.
- Create a list by cloud service provider or account.
- View machines created or terminated during a time range.
- View all currently stopped machines.
- View the tags of each machine.

### Instances Over Time report

Using the Instances Over Time report, you can see the maximum number of machines that were active each during the selected time range. If the defined resolution is by week or month, results are the maximum number of machines active on any given day during that month. Select a date range to select the filters that you want displayed in the report.

### Instance Utilization Over Time report

This report shows a breakdown of CPU or memory use over time for all your instances.

### Compute Power Cost Over Time report

The Compute Power Over Time report provides a breakdown of compute power over a specified date range. Although other reports show the number of running machines or the runtime hours, this report shows Core hours, Compute unit hours, or GB RAM hours.

Use the report to:

- Check compute power within a specified date range.
- View compute times based on cost allocation models.

This report is linked to your [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) policies so results are shown based on the defined tagging and policies your selected cost policy. When you don't have a policy created, then results aren't shown.

### Compute Power Average Cost Over Time report

You use the Compute Power Average Cost Over Time report to view more than just the cost of each running machine. The report shows your average cost per instance hour, core hour, compute unit hour, and GB RAM hour. The report provides insight into the efficiency of your deployment.

This report is linked to your [Cost Allocation 360](tutorial-manage-costs.md#use-custom-tags-to-allocate-costs) policies so results are displayed based on the defined tagging and policies your selected cost policy. When you don't have a policy created, then results aren't shown.

### S3 Cost Over Time report

The S3 Cost Over Time report provides a breakdown of Amazon Simple Storage Service (S3) costs per bucket over time for a specified time frame. The report helps you find the buckets that are your main cost drivers and it shows you trends in your S3 usage and spending.

### S3 Distribution of Cost report

Use the report to analyze your S3 cost for the last month by bucket and storage class. You can use the pie chart view to set the visibility threshold. Or, you can use the table view to see subtotals.

### S3 Bucket Properties report

Use the report to view S3 bucket properties. You can use the pie chart view to set the visibility threshold. Or, you can use the table view to see subtotals.

### RDS Instances Over Time report

Use the report to view a breakdown of all Amazon Relational Database Service (RDS) instances running during the specified period.

### RDS Active Instances report

Use the report to analyze RDS active instances. In the report, expand the line item to view additional information.

### Azure Reserved Instances report

The Azure Reserved Instances report provides you with a single view of all your Azure reserved instances. This report displays each purchase as is its own line item. The report also shows details about that purchase such as the account that purchased it, the type of purchase and instance type, days remaining and so on. You can show or hide report data using Show/Hide Fields.

Use the Azure Reserved Instances report to view:

- A list of all reservations by purchase date.
- Time remaining until the RI expires.
- One-time fees.
- The account that purchased RIs, and when.

### AWS Reserved Instances report

The AWS Reserved Instances report provides you with a single view of all AWS reserved instances. This report displays each purchase is its own line item and details about that purchase such as the account that purchased it, the type of purchase and instance type, days remaining and so on. You can show or hide report data using Show/Hide Fields.

Use the AWS Reserved Instances report to view:

- A list of all reservations by purchase date.
- Time remaining until the RI expires.
- One-time fees.
- Original purchase ID (reservation ID).
- The account that purchased RIs and when.

### EC2 RI Buying Recommendations report

The foundation of cloud resource consumption is the on-demand model, where resources incur cost only when used. There are no up-front commitments — you pay only for what you use, when you use it.

AWS offers an alternative pricing model for its Elastic Compute Cloud (EC2) services — the reserved instance (RI). This pricing model guarantees users the capacity whenever they need it for the duration of the RI. The RI offers significant price discounts over on-demand pricing. In return, users make an upfront commitment for the use of a virtual instance. The commitment is bound to a specific family, size, availability zone (AZ), and operating system, over the period of commitment (one or three years). The RI allows AWS to efficiently plan future capacity, as well as to gain customer commitment to using its services.

Three payment options for RIs, which are all-upfront:

- Bulk sum at day 0, offering the highest discount
- No upfront - in which the cost of RI is paid in monthly installments over the duration of the RI, offering the lowest discount
- Partial upfront, in which ¼ - ½ of the price is paid up front, and the rest in monthly installments, with a discount rate that is lower, but close, to the all-upfront rate

Cloudyn evaluates the uptime of each machine for the last 30 days. Cloudyn recommends buying RIs when it is more cost-effective to run the machine with an RI at the current uptime level.

The report shows the justification for its recommendations to save the most money over the year. The recommendations suggest replacing on-demand instances with RIs. You can purchase RIs directly from the report.

Each tab opens as a full report. Notable sections in tabs include:

- **EC2 RI Purchase Impact** - This section provides a simulation of the difference between on-demand vs reserved instances. Click  **Zoom in**, to see the full EC2 RI Purchase Impact report with the filters already defined to your recommendation. This report shows the purchase impact of all potential RI purchases. You can adjust the expected average uptime to see the potential saving when you purchase EC2 Reserved Instances.

- **Saving Analysis** - This section provides the potential savings achieved and the month the savings are actualized when following Cloudyn recommendations. The actual savings and the percent saved are highlighted in red.

- **EC2 RI Type Comparison** - This section emphasizes the ROI highlights of Cloudyn's recommended deployment, including all relevant options. The results in this report assume that the machine is running at 100% uptime. Click **Zoom In**  to open the detailed report.

- **Instances Over Time** - This section displays a breakdown of all instances associated with the recommendation, OnDemand, Reserved Instances, and Spot. Click  **Zoom In**  to open the detailed report.
- **Breakeven Points** - This section displays a table of all the possible recommended deployments and the ROI and the month when the ROI occurs. Click  **Zoom In** to open the detailed report.

### EC2 Reservations Over Time report

The EC2 Reservations Over Time report tracks the status of your usage of your purchased EC2 RIs. You can set the resolution of the report to hour, day, or week.

Use the report to:

- Display reservations purchased that are used and not used.
- Drill in to the resolution by hour to see RI usage per hour.

### Savings Over Time report

Use the Savings Over Time report to view the savings achieved using reserved instances as well as spot instances. The report shows the ROI achieved over time resulting from RI purchases.

To view savings from RIs, group the results by **Price Model** and select **Reservation**. To view RI savings achieved by a specific account or instance type, add the relevant grouping and filter to the account or instance type.

To see savings from Spot instance use, filter the **Price Model** to **Spot**. The default filter for this report is RI and Spot Instances.

### RDS RI Buying Recommendations report

RDS RI Buying Recommendations report recommends when to use RDS RIs instead of on-demand instances.

Each tab opens as a full report. Notable sections in tabs include:

- **RDS RI Purchase Impact** - This section provides a simulation of the difference between on demand vs reserved instances. Click  **Zoom in** to see the full RDS RI Purchase Impact report with the filters already defined to your recommendation. This report allows you to see the purchase impact of all potential RI purchases.  You can adjust the expected average uptime and see the potential saving by purchasing RIs.
- **Saving Analysis** – This section provides the potential savings achieved and the month the savings are actualized when following Cloudyn recommendations. The actual savings and the percent saved are highlighted in red.

- **RDS RI Type Comparison** - This section emphasizes the ROI highlights of the recommended deployment, including all relevant options. The results in this report assume that the machine is running at 100% uptime. Click **Zoom In** to open the detailed report for the selected machine.
- **Instances Over Time** – This section displays a breakdown of all instances associated with the recommendation, OnDemand, Reserved Instances, and Spot. Click **Zoom In** to open the detailed report.

- **Breakeven Points** – This section displays a table of all the possible recommended deployments and the ROI and the month when the ROI occurs. Click **Zoom In** to open the detailed report.

### RDS Reservations Over Time report

Use the RDS Reservation Over Time report to view a breakdown of both your used and unused reservations during the specified period.

### Reserved Instance Purchase Impact report

The EC2 RI Purchase Impact report allows you to simulate reserved instance cost versus on-demand cost over time. It can help you make better purchasing decisions. Adjust the filters such as average runtime, term, platform, and others to make informed decisions when you consider RI purchases.

### Cost-Effective Sizing Recommendations report

The Cost-Effective Sizing Recommendations report provides results for AWS and Azure. For AWS users, your RI purchases are taken into consideration and the results don't include machines running as RI's. This report provides a list of underutilized instances that are candidates to downsize. Recommendations are based on your usage and performance data from the last 30 days. In each recommendation is a list of candidates to downsize, the justification to downsize, and a link to view complete details and performance metrics of the instance. And when relevant recommendations advise changing to newer generation instance types.

You can't download the list of instance IDs that are recommended to downsize from this report. To download Instance IDs, use the All Sizing Recommendations report.

Consider the following downsizing example:

You have six m3.xlarge running instances. Cloudyn analysis shows that five of them have low CPU utilization. Consider downsizing them.

In Cost Impact, the cost impact is calculated. In this example, by expanding the line item, you can see the current price for one m3.xlarge instance (Linux/Unix) costs $0.266 per hour and one m3.large instance (Linux/Unix) costs $0.133 per hour. So, the annual cost is $11,651 for five m3.xlarge instances running at 100% utilization. The annual cost is $5,825 for five m3.large instances running at 100% utilization. The potential savings are $5,825.

To view cost-effective sizing justifications, click + to expand the line item. In **Details**:

- The **Recommendation Justification** section displays the current deployment and the number of instances recommended to downsize.
- The **Cost Impact** section displays the calculation used to determine potential savings.
- The **Potential Annual Savings** section displays the potential annual savings when downsizing per Cloudyn's recommendation.

### All Sizing Recommendations report

This report provides a list of underutilized instances that are candidates to downsize. The recommendations are based on your usage and performance data from the last 30 days. In each recommendation, you can view complete details and performance metrics of the instance.

If you've purchased AWS reserved instances, this report contains results for all running instances, including instances running as RIs.

Use the All Sizing Recommendations report to:

- See a list of all your instances that are candidates to downsize.
- Export a report list containing Instance Names and IDs.

To view recommendation details for a specific Instance, click **+** to expand the details. The Recommendation Details section provides an overview of the recommendation.

The **Tags** section provides the list of the tag keys and values for the selected instance. Use Tags in the left pane to filter the section.

The **CPU Utilization** section provides the CPU utilization for the instance over the last month, by day.

Click the graph to drill down and open the Instance CPU Over Time Report to see a breakdown of the instances.

- Use **Show/Hide Fields** to add or remove fields: Timestamp, Avg CPU, Min CPU, Max CPU.
- Use **Date Range** to enter a date or date range and drill into a specific InstanceID.
- Use **Extended Filters** to show all or a specific Instance ID
- Click **Zoom in** to open the CPU Utilization Report

If the instance hasn't been monitored for 30 days, incomplete data is shown.

The **Memory Utilization (GB)** section provides information about the memory utilized. For AWS users, memory metrics are not automatically available and need to be added per instance through AWS. AWS charges you to enable memory metrics for EC2 instances.

The **Memory Utilization (%)** section displays the percent of memory used.

The **Network Input Traffic** section displays a snapshot over time of the network traffic, average, and maximum, for the selected instance. Hover over the lines to see the date and maximum traffic for that time. Click **Zoom In** to open the Network Input Traffic Report.

The **Network Output Traffic** section displays a snapshot of the network output traffic for the selected instance. Hover over the lines to see the date and maximum traffic for that time. Click **Zoom In** to open the Network Output Traffic report.

### Instance Metrics Explorer report

The Instance Metrics Explorer report shows cross-cloud performance metrics per instance. Use the report to view instances that are over or under-utilized based on CPU, memory, and network metric thresholds.

To view cross-cloud performance per instance:

1. In **Date Range**, select a date range for which you want to view performance.
2. In **Tags**, select any tags that you want to view.
3. In **Filters**, select the filters you want to display in the report.
4. In **Extended Filters**, adjust the report thresholds for:
    - Avg CPU
    - Max CPU
    - Avg Memory
    - Max Memory
5. In **Extended Filters**, click **Show** and then select the type of instances to display.

To view a specific instance's metrics over time:

- Go to the Instance Metrics Explorer report and click **+** to view details.

### RDS Sizing Recommendations report

The RDS Sizing Recommendations report provides RDS sizing recommendations to optimize your cloud usage. It provides a list of underutilized instances that are candidates to downsize. Cloudyn recommendations are based on the usage and performance data of the last 30 days. You can filter recommendations by Account Name, Region, Instance Type, and Status.

### Sizing Threshold Manager report

Cloudyn's built-in sizing recommendations are calculated using a complex algorithm to provide accurate sizing suggestions. You can adjust the thresholds for downsizing recommendations.

To manually adjust threshold sizing recommendations:

1. In Sizing Threshold Manager, adjust the following thresholds as you like:
    - Average CPU %
    - Maximum CPU %
    - Average Memory %
    - Maximum Memory %
3. Click **Apply** to save changes.
4. Changes apply immediately to all your recommendations.

To restore default thresholds:

- In Sizing Threshold Manager, click **Restore Defaults**.

### Compute Instance Types report

Use the Instance Types report to:

- View instance types by Service, Family, API Name, and Name.
- View details such as CPU, ECU, RAM, and Network.

You can use **Search** to find specific line items.

## Next steps

- Learn about how to use reports, including how to customize or save and schedule reports, see [Understanding cost reports](understanding-cost-reports.md).
- Learn about the dashboards included in Cloudyn and about how to create your own custom dashboards, see [View key cost metrics with dashboards](dashboards.md).
