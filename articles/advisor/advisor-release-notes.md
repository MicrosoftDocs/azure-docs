---
title: What's new in Azure Advisor
description: A description of what's new and changed in Azure Advisor
ms.topic: reference
ms.date: 11/02/2023
---
# What's new in Azure Advisor?

Learn what's new in the service. These items might be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with the service.

## November 2023

### ZRS recommendations for Azure Disks

Azure Advisor now has Zone Redundant Storage (ZRS) recommendations for Azure Managed Disks. Disks with ZRS provide synchronous replication of data across three availability zones in a region, enabling disks to tolerate zonal failures without causing disruptions to your application. By adopting this recommendation, you can now design your solutions to utilize ZRS disks. Access these recommendations through the Advisor portal and APIs.

To learn more, visit [Use Azure Disks with Zone Redundant Storage for higher resiliency and availability](/azure/advisor/advisor-reference-reliability-recommendations#use-azure-disks-with-zone-redundant-storage-for-higher-resiliency-and-availability).

## October 2023

### New version of Service Retirement workbook

Azure Advisor now has a new version of the Service Retirement workbook that includes three major changes:

* 10 new services are onboarded to the workbook. The Retirement workbook now covers 40 services.

* Seven services that completed their retirement lifecycle are off boarded.

* User experience and navigation are improved.

List of the newly added services:

| Service | Retiring Feature |
|-----------------|-------------------|
| Azure Monitor | Classic alerts for Azure Gov cloud and Azure China 21Vianet |
| Azure Stack Edge | IoT Edge on K8s |
| Azure Migrate | Classic |
| Application Insights | Trouble Shooting Guides Retirement |
| Azure Maps | Gen1 price tier |
| Application Insights | Single URL Ping Test |
| Azure API for FHIR | Azure API for FHIR |
| Azure Health Data Services | SMART on FHIR proxy |
| Azure Database for MariaDB | Entire service |
| Azure Cache for Redis | Support for TLS 1.0 and 1.1 |

List of the removed services:

| Service | Retiring Feature |
|-----------------|-------------------|
| Virtual Machines | Classic IaaS |
| Azure Cache for Redis | Version 4.x |
| Virtual Machines | NV and NV_Promo series |
| Virtual Machines | NC-series |
| Virtual Machines | NC V2 series |
| Virtual Machines | ND-Series |
| Virtual Machines | Azure Dedicated Host SKUs (Dsv3-Type1, Esv3-Type1, Dsv3-Type2, Esv3-Type2) |

UX improvements:

* Resource details grid: Now, the resource details are readily available by default, whereas previously, they were only visible after selecting a service.
* Resource link: The **Resource** link now opens in a context pane, previously it opened in the same tab.

To learn more, visit [Prepare migration of your workloads impacted by service retirement](/azure/advisor/advisor-how-to-plan-migration-workloads-service-retirement).

### Service Health Alert recommendations

Azure Advisor now provides Service Health Alert recommendation for subscriptions, which do not have service health alerts configured. The action link will redirect you to the Service Health page where you can create and customize alerts based on the class of service health notification, affected subscriptions, services, and regions.

Azure Service Health alerts keep you informed about issues and advisories in four areas (Service issues, Planned maintenance, Security and Health advisories) and can be crucial for incident preparedness.

To learn more, visit [Service Health portal classic experience overview](/azure/service-health/service-health-overview).

## August 2023

### Improved VM resiliency with Availability Zone recommendations

Azure Advisor now provides availability zone recommendations. By adopting these recommendations, you can design your solutions to utilize zonal virtual machines (VMs), ensuring the isolation of your VMs from potential failures in other zones. With zonal deployment, you can expect enhanced resiliency in your workload by avoiding downtime and business interruptions.

To learn more, visit [Use Availability zones for better resiliency and availability](/azure/advisor/advisor-reference-reliability-recommendations#use-availability-zones-for-better-resiliency-and-availability).

## July 2023

### Introducing workload based recommendations management

Azure Advisor now offers the capability of grouping and/or filtering recommendations by workload. The feature is available to selected customers based on their support contract.

If you're interested in workload based recommendations, reach out to your account team for more information.

### Cost Optimization workbook template

The Azure Cost Optimization workbook serves as a centralized hub for some of the most used tools that can help you drive utilization and efficiency goals. It offers a range of recommendations, including Azure Advisor cost recommendations, identification of idle resources, and management of improperly deallocated Virtual Machines. Additionally, it provides insights into leveraging Azure Hybrid benefit options for Windows, Linux, and SQL databases

To learn more, visit [Understand and optimize your Azure costs using the Cost Optimization workbook](/azure/advisor/advisor-cost-optimization-workbook).

## June 2023

### Recommendation reminders for an upcoming event

Azure Advisor now offers new recommendation reminders to help you proactively manage and improve the resilience and health of your workloads before an important event. Customers in [Azure Event Management (AEM) program](https://www.microsoft.com/unifiedsupport/enhanced-solutions) are now reminded about outstanding recommendations for their subscriptions and resources that are critical for the event.

The event notifications are displayed when you visit Advisor or manage resources critical for an upcoming event. The reminders are displayed for events happening within the next 12 months and only for the subscriptions linked to an event. The notification includes a call to action to review outstanding recommendations for reliability, security, performance, and operational excellence.

## May 2023

### New: Reliability workbook template

Azure Advisor now has a Reliability workbook template. The new workbook helps you identify areas of improvement by checking configuration of selected Azure resources using the [resiliency checklist](/azure/architecture/checklist/resiliency-per-service) and documented best practices. You can use filters, subscription, resource group, and tags, to focus on resources that you care about most. Use the workbook recommendations to:

* Optimize your workload.

* Prepare for an important event.

* Mitigate risks after an outage.

To learn more, visit [Optimize your resources for reliability](https://aka.ms/advisor_improve_reliability).

To assess the reliability of your workload using the tenets found in the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/), reference the [Microsoft Azure Well-Architected Review](/assessments/?id=azure-architecture-review&mode=pre-assessment).

### Data in Azure Resource Graph is now available in Azure China and US Government clouds

Azure Advisor data is now available in the Azure Resource Graph (ARG) in Azure China and US Government clouds. The ARG is useful for customers who can now get recommendations for all their subscriptions at once and build custom views of Advisor recommendation data. For example:

* Review your recommendations summarized by impact and category.

* See all recommendations for a recommendation type.

* View impacted resource counts by recommendation category.

To learn more, visit [Query for Advisor data in Resource Graph Explorer (Azure Resource Graph)](https://aka.ms/advisorarg).

### Service retirement workbook

Azure Advisor now provides a service retirement workbook. It's important to be aware of the upcoming Azure service and feature retirements to understand their impact on your workloads and plan migration. The [Service Retirement workbook](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/workbooks) provides a single centralized resource level view of service retirements and helps you assess impact, evaluate options, and plan migration.
The workbook includes 35 services and features planned for retirement. You can view planned retirement dates, list and map of impacted resources and get information to make the necessary actions.

To learn more, visit [Prepare migration of your workloads impacted by service retirements](advisor-how-to-plan-migration-workloads-service-retirement.md).

## April 2023

### Postpone/dismiss a recommendation for multiple resources

Azure Advisor now provides the option to postpone or dismiss a recommendation for multiple resources at once. Once you open a recommendations details page with a list of recommendations and associated resources, select the relevant resources and choose **Postpone** or **Dismiss** in the command bar at the top of the page.

To learn more, visit [Dismissing and postponing recommendations](/azure/advisor/view-recommendations#dismissing-and-postponing-recommendations)

### VM/VMSS right-sizing recommendations with custom lookback period

You can now improve the relevance of recommendations to make them more actionable, resulting in additional cost savings.

The right sizing recommendations help optimize costs by identifying idle or underutilized virtual machines based on their CPU, memory, and network activity over the default lookback period of seven days. Now, with this latest update, you can adjust the default look back period to get recommendations based on 14, 21, 30, 60, or even 90 days of use. The configuration can be applied at the subscription level. This is especially useful when the workloads have biweekly or monthly peaks (such as with payroll applications).

To learn more, visit [Optimize Virtual Machine (VM) or Virtual Machine Scale Set (VMSS) spend by resizing or shutting down underutilized instances](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances).

## March 2023

### Advanced filtering capabilities

Azure Advisor now provides additional filtering capabilities. You can filter recommendations by resource group, resource type, impact and workload.

## November 2022

### New cost recommendations for Virtual Machine Scale Sets

Azure Advisor now offers cost optimization recommendations for Virtual Machine Scale Sets (VMSS). These include shutdown recommendations for resources that we detect aren't used at all, and SKU change or instance count reduction recommendations for resources that we detect are under-utilized. For example, for resources where we think customers are paying for more than what they might need based on the workloads running on the resources.

To learn more, visit [
Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances](/azure/advisor/advisor-cost-recommendations#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances).

## June 2022

### Advisor support for Azure Database for MySQL - Flexible Server

Azure Advisor provides a personalized list of best practices for optimizing your Azure Database for MySQL - Flexible Server instance. The feature analyzes your resource configuration and usage, and then recommends solutions to help you improve the cost effectiveness, performance, reliability, and security of your resources. With Azure Advisor, you can find recommendations based on transport layer security (TLS) configuration, CPU, and storage usage to prevent resource exhaustion.

To learn more, visit [Azure Advisor for MySQL](/azure/mysql/single-server/concepts-azure-advisor-recommendations).

## May 2022

### Unlimited number of subscriptions

It is easier now to get an overview of optimization opportunities available to your organization – no need to spend time and effort to apply filters and process subscription in batches.

To learn more, visit [Get started with Azure Advisor](advisor-get-started.md).

### Tag filtering

You can now get Advisor recommendations scoped to a business unit, workload, or team. Filter recommendations and calculate scores using tags you have already assigned to Azure resources, resource groups and subscriptions. Apply tag filters to:

* Identify cost saving opportunities by business units

* Compare scores for workloads to optimize critical ones first

To learn more, visit [How to filter Advisor recommendations using tags](advisor-tag-filtering.md).

## January 2022

[**Shutdown/Resize your virtual machines**](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances) recommendation was enhanced to increase the quality, robustness, and applicability.

Improvements include:  

1. Cross SKU family series resize recommendations are now available.  

1. Cross version resize recommendations are now available. In general, newer versions of SKU families are more optimized, provide more features, and have better performance/cost ratios than older versions.

1. For better actionability, we updated recommendation criteria to include other SKU characteristics such as accelerated networking support, premium storage support, availability in a region, inclusion in an availability set, and more.

:::image type="content" source="media/advisor-overview/advisor-vm-right-sizing.png" alt-text="Screenshot of virtual machine right sizing recommendations." lightbox="media/advisor-overview/advisor-vm-right-sizing.png":::

Read the [How-to guide](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances) to learn more.
