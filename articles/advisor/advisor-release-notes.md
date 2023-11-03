---
title: Release notes for Azure Advisor
description: A description of what's new and changed in Azure Advisor
ms.topic: reference
ms.date: 04/18/2023
---
# What's new in Azure Advisor?

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with the service.

## October 2023
### New version of Service Retirement Workbook

We have released new version of Service Retirement Workbook in Advisor which include 3 major changes. The Retirement Workbook now covers 40 services.

* We have onboarded 10 new services to the workbook.

* We have offboarded 7 services that have completed their retirement lifecycle. 

* We've implemented few improvements to enhance the user experience and navigation based on valuable feedback from our customers.

List of the newly onboarded services in workbook:

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

List of services offboarded from Workbook:

| Service | Retiring Feature | 
|-----------------|-------------------|
| Virtual Machines | Classic IaaS |
| Azure Cache for Redis | Version 4.x |
| Virtual Machines | NV and NV_Promo series |
| Virtual Machines | NC-series |
| Virtual Machines | NC V2 series |
| Virtual Machines | ND-Series |
| Virtual Machines | Azure Dedicated Host SKUs (Dsv3-Type1, Esv3-Type1, Dsv3-Type2, Esv3-Type2) |

**UX improvements**

* Resource details grid - Based on customer feedback, we have made an improvement in the visibility of the 'Resource Details' grid. Now, the resource details are readily available by default, whereas previously, they were only visible upon selecting a service.
* Resource link - We have further enhanced the user experience for accessing resource details by updating the Resource link to open in a context pane, as opposed to the previous method where it opened in the same tab. This change streamlines navigation and provides a more

To learn more, visit [Prepare migration of your workloads impacted by service retirement](/azure/advisor/advisor-how-to-plan-migration-workloads-service-retirement).

## October 2023
### Service Health Alert Recommendations

Increased reliability recommendations coverage on Advisor provides customers with actionable and holistic guidance to improve their resiliency posture. Leveraging Azure Resource Graph (ARG) as a data source, we are announcing the launch of the Service Health Alert recommendations. It will surface for subscriptions that have no configured service health alert and will help redirect customers to the Service Health page to take action. Customer can create and customize alerts based on the class of service health notification, affected subscriptions, services, and regions.

Azure Service Health alerts keep customers informed about issues and advisories in four areas (Service issues, Planned maintenance, Security and Health advisories). This recommendation is crucial for incident preparedness and is one of the top requests to our customers on how they can proactively prepare for unexpected incidents.

To learn more, visit [Service Health portal classic experience overview](/azure/service-health/service-health-overview).

## August 2023
### Improved VM resiliency with Azure Advisor's Availability Zone recommendations

One of the best practices, according to the Well Architected Framework (WAF) guidelines, is zonal deployment. By adopting this recommendation, you can now design your solutions to utilize zonal virtual machines (VMs), ensuring the isolation of your VMs from potential failures in other zones. With this, you can expect enhanced resiliency in your workload by avoiding downtime and business interruptions. 

To learn more, visit [Reliability recommendations - Azure Advisor | Microsoft Learn](/azure/advisor/advisor-reference-reliability-recommendations#compute).

## July 2023
### Introducing Workload based recommendations management

Avoiding interruptions to applications is critical for business. Azure Advisor recommendations identify risks and improve the quality of workloads. If you manage hundreds of subscriptions, the number of recommendations can be overwhelming, which makes it difficult to plan the work and focus on the most impactful improvements. Azure Advisor workload-based recommendations make it easier for managed customers (as part of CSU-Proactive Resiliency and Mission Critical programs) to get recommendations for their most critical workloads across five pillars of web application firewall (WAF) - cost, reliability, security, performance, and operational excellence.

To learn more, visit [Optimize Azure workloads by using Advisor score](/azure/advisor/azure-advisor-score).

## July 2023
### Public preview: Assess cost optimization opportunities using new workbook template in Azure Advisor

The Azure Cost Optimization workbook serves as a centralized hub for some of the most used tools that can help you drive utilization and efficiency goals. It offers a range of recommendations, including Azure Advisor cost recommendations, identification of idle resources, and management of improperly deallocated Virtual Machines. Additionally, it provides insights into leveraging Azure Hybrid benefit options for Windows, Linux, and SQL databases. 

To learn more, visit [Understand and optimize your Azure costs using the Cost Optimization workbook](/azure/advisor/advisor-cost-optimization-workbook).

## June 2023
### Recommendation reminders for an upcoming event

Workload reliability issues can lead to dissatisfaction, interruptions, unexpected financial and in some cases – reputational losses. We are launching new capabilities to help customers proactively manage and improve the resilience and health of their workloads before an important event. Customers in Azure Event Management (AEM) and HiPri programs will now be reminded about outstanding commendations for their subscriptions and resources which are critical for the event. Microsoft engagement teams can now guide customers to leverage Advisor recommendations to minimize risks and ensure great event experience.

The event notifications will be displayed when customers visit Advisor or manage resources critical for an upcoming event. The reminder will be displayed for events happening within the next 12 months and only for the subscriptions linked to an event. Customers will be presented with a call to action to review outstanding recommendations for reliability, security, performance, and operational excellence.

To learn more, visit [Reliability recommendations](/azure/advisor/advisor-reference-reliability-recommendations).

## May 2023
### Public preview: Optimize your workloads for reliability using new workbook template in Azure Advisor

Architecting for reliability and resiliency ensures that your workloads are available, can recover from failures at any level and meet your commitments to customers. The new workbook helps you identify areas of improvement by checking configuration of selected Azure resources using the [resiliency checklist](/azure/architecture/checklist/resiliency-per-service) and documented best practices. You can use filters (subscription, resource group, tags) to focus on resources that you care about most. Use the workbook recommendations to: 

* Optimize your workload. 

* Prepare for an important event. 

* Mitigate risks after an outage. 

* To learn more, visit Optimize your resources for reliability. 

To learn more, visit [Optimize your resources for reliability](https://aka.ms/advisor_improve_reliability).

To assess the reliability of your workload using the tenets found in the [Microsoft Azure Well-Architected Framework](/azure/architecture/framework/), 
reference the [Microsoft Azure Well-Architected Review](/assessments/?id=azure-architecture-review&mode=pre-assessment). 

## May 2023
### Data in Azure Resource Graph is now available in Azure China and US Government clouds

Azure Advisor data is now available in Azure Resource Graph (ARG) in Azure China and US Government clouds (public cloud enabled in April 2020). This is useful for customers who can now get recommendations for all their subscriptions at once and build custom views of Advisor recommendation data. For example: 

* Review their recommendations summarized by impact and category. 

* See all recommendations for a recommendation type. 

* View impacted resource counts by recommendation category. 

To learn more, visit [Query for Advisor data in Resource Graph Explorer (Azure Resource Graph)](https://aka.ms/advisorarg).

## May 2023
### Service retirement workbook

It is important to be aware of the upcoming Azure service and feature retirements to understand their impact on your workloads and plan migration. The [Service Retirement workbook](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/workbooks) provides a single centralized resource level view of service retirements and helps you assess impact, evaluate options, and plan migration. 
The workbook includes 35 services and features planned for retirement. You can view planned retirement dates, list and map of impacted resources and get information to make the necessary actions.

To learn more, visit [Prepare migration of your workloads impacted by service retirements](advisor-how-to-plan-migration-workloads-service-retirement.md).

## April 2023

### Cost savings summary for multiple currencies

Enterprise customers with subsidiaries in other countries often get cost recommendations nominated in multiple currencies. They now can use updated cost summary view to evaluate total amount of cost savings in different currencies.

To learn more, visit ???.

## April 2023

### Postpone/dismiss a recommendation for multiple resources

It can be difficult to prioritize recommendations for the workloads they care about the most. When you are looking at suggested improvements for hundreds of subscriptions, the amount of information can be overwhelming. To reduce noise, customers now can postpone recommendations they want to revisit later and dismiss those which are less relevant.

The new capability will make this process more efficient by enabling a single-click Postpone/dismiss operation for multiple resources.

To learn more, visit ???.

## April 2023

### VM/VMSS right-sizing recommendations with custom lookback period

Customers can now improve the relevance of recommendations to make them more actionable, resulting in additional cost savings. 
The right sizing recommendations help optimize costs by identifying idle or underutilized virtual machines based on their CPU, memory, and network activity over the default lookback period of seven days. 
Now, with this latest update, customers can adjust the default look back period to get recommendations based on 14, 21, 30, 60, or even 90 days of use. The configuration can be applied at the subscription level. This is especially useful when the workloads have biweekly or monthly peaks (such as with payroll applications). 

To learn more, visit [Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances).

## March 2023

### Advanced filtering capabilities

It can be difficult to prioritize recommendations. When you multiply the number of recommendations by hundreds of subscriptions and thousands of resources that you manage – the amount of information can be overwhelming.

We are making it easier by offering new filtering capabilities. Users can now filter recommendations by impact (priority), resource group and resource type.

To learn more, visit ???.

## November 2022
### New cost recommendations for Virtual Machine Scale Sets

Azure Advisor has expanded recommendations to include cost optimization recommendation for Virtual Machine Scale Sets too. Recommendations will include shutdown recommendations for resources that we detect are not used at all, and SKU change or Instance count reduction recommendations for resources that we detect are under-utilized for what is provisioned, i.e. for resources where we think customers are paying for more than what they might need based on the workloads running on the resources.

To learn more, visit [
Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances](/azure/advisor/advisor-cost-recommendations#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances).

## October 2022
### Advisor score across all Azure regions

Azure Advisor score offers you a way to prioritize the most impactful Advisor recommendations to optimize your deployments using the Azure Well-Architected Framework. Advisor displays your category scores and your overall Advisor score as percentages. A score of 100% in any category means all your resources, assessed by Advisor, follow the best practices that Advisor recommends. On the other end of the spectrum, a score of 0% means that none of your resources, assessed by Advisor, follows Advisor recommendations. 

Advisor Score now supports the ability to report on specific workloads using resource tag filters in addition to subscriptions. For example, you can now omit non-production resources from the score calculation. You can also track your progress over time to understand whether you are consistently maintaining healthy Azure deployments.

To learn more, visit [Optimize Azure workloads by using Advisor score](/azure/advisor/azure-advisor-score).

## June 2022
### Advisor support for Azure Database for MySQL - Flexible Server

Azure Advisor provides a personalized list of best practices for optimizing your Azure Database for MySQL - Flexible Server instance. The feature analyzes your resource configuration and usage telemetry and then recommends solutions that can help you improve the cost effectiveness, performance, reliability, and security of your Azure resources. With Azure Advisor, you can find recommendations based on TLS configuration, CPU, and storage usage to prevent resource exhaustion.

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

3. For better actionability, we updated recommendation criteria to include other SKU characteristics such as accelerated networking support, premium storage support, availability in a region, inclusion in an availability set, etc. 

![vm-right-sizing-recommendation](media/advisor-overview/advisor-vm-right-sizing.png)

Read the [How-to guide](advisor-cost-recommendations.md#optimize-virtual-machine-vm-or-virtual-machine-scale-set-vmss-spend-by-resizing-or-shutting-down-underutilized-instances) to learn more.
