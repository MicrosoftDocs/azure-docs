---
title: Reliability in Azure Health Data Services de-identification service
description: Find out about reliability in the Azure Health Data Services de-identification service.
author: jovinson-ms
ms.author: jovinson
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.date: 09/27/2024
#Customer intent: As an IT admin, I want to understand reliability support for the de-identification service so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in the Azure Health Data Services de-identification service (preview)

This article describes reliability support in the de-identification service (preview). For a more detailed overview of a reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Cross-region disaster recovery

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]


<!-- 4. Cross-region disaster recovery ---------------------------------------

Required. This section can be organized as your product demands, but try to keep the headings as listed below, as best you are able.

The include [!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)] must be first in this SECTION.

In the case of a region-wide disaster, Azure can provide protection from regional or large geography disasters with disaster recovery by making use of another region. 
For more information on Azure disaster recovery architecture, see [Azure to Azure disaster recovery architecture](/azure/site-recovery/azure-to-azure-architecture.md).

Give a high-level overview of how cross-region failover works for your service here.

In the sections below, address the following for both multi and single region geographies, as appropriate:

- If cross-region failover or responsibilities depend on region type (for example paired region vs. non-paired), provide detailed explanation. Refer to non-paired region recovery in section below.

- Explain whether items are Microsoft responsible or customer responsible for setup and execution.

- If service is deployed geographically, explain how this works. 

- Explain how customer storage is handled, how much data loss occurs and whether R/W or only R/O for 00:__ (duration).

- If this single offering fails over, indicate whether it continues to support primary region or only secondary region. 

-->

### Plan for disaster recovery
TODO: Add recommendations for planning for DR.

<!-- 4E. Plan for disaster recovery ---------------------------
Microsoft and its customers operate under the Shared responsibility model. This means that for customer-enabled DR (customer-responsible services), the customer must address DR for any service they deploy and control. 

To ensure that recovery is proactive, customers should always pre-deploy secondaries because there is no guarantee of capacity at time of impact for those who have not pre-allocated. 

In this section, provide details of customer knowledge required re: capacity planning and proactive deployments.

In cases where Microsoft shares responsibility with the customer for outage detection and management, the customer needs to do the following:

- Provide comprehensive How to for setup of DR, including prerequisite, recipe, format, instructions, diagrams, tools, and so on.  

- Specify Active-Active or Active-Passive 

- Provide details on how customer can minimize failover downtime (if due to Microsoft responsible).  

This can be provided in another document, located under the Reliability node in your TOC. Provide the link here.


-->

#### Set up disaster recovery and outage detection 

To prepare for disaster recovery in a multi-region geography, you can use either an active-active or active-passive architecture. 

##### Active-Active architecture

In active-active disaster recovery architecture, identical web apps are deployed in two separate regions and Azure Front door is used to route traffic to both the active regions.

:::image type="content" source="../app-service/media/overview-disaster-recovery/active-active-architecture.png" alt-text="Diagram that shows an active-active deployment of App Service.":::

With this example architecture: 

- Identical App Service apps are deployed in two separate regions, including pricing tier and instance count. 
- Public traffic directly to the App Service apps is blocked. 
- Azure Front Door is used to route traffic to both the active regions.
- During a disaster, one of the regions becomes offline, and Azure Front Door routes traffic exclusively to the region that remains online. The RTO during such a geo-failover is near-zero.
- Application files should be deployed to both web apps with a CI/CD solution. This ensures that the RPO is practically zero. 
- If your application actively modifies the file system, the best way to minimize RPO is to only write to a [mounted Azure Storage share](../app-service/configure-connect-to-azure-storage.md) instead of writing directly to the web app's */home* content share. Then, use the Azure Storage redundancy features ([GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage)) for your mounted share, which has an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).


Steps to create an active-active architecture for your web app in App Service are summarized as follows: 

1. Create two App Service plans in two different Azure regions. Configure the two App Service plans identically.

1. Create two instances of your web app, with one in each App Service plan. 

1. Create an Azure Front Door profile with:
    - An endpoint.
    - Two origin groups, each with a priority of 1. The equal priority tells Azure Front Door to route traffic to both regions equally (thus active-active).
    - A route. 

1. [Limit network traffic to the web apps only from the Azure Front Door instance](../app-service/app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance). 

1. Setup and configure all other back-end Azure service, such as databases, storage accounts, and authentication providers. 

1. Deploy code to both the web apps with [continuous deployment](../app-service/deploy-continuous-deployment.md).


####  RTO and RPO

<!--- 4E1. RTO and RPO ---------------------------

- Present RPO and RTO for each disaster recovery option.
- Define customer Recovery Time Objective (RTO) and Recovery Point Objective (RPO) expectations for optimal setup. 

-->

### Validate disaster recovery plan
TODO: Add validation methods here for DR.

<!-- 4F. Validate disaster recovery plan ---------------------------
    If it is possible for the customer to validate/test their DR plan, please describe here.
-->


### Outage guidance
TODO: Add outage guidance here for DR.

<!-- 4G. Outage guidance -------------------------------- -->


<!--

- Provide all guidance of what the customer can expect in region loss scenario. 

- Specify whether recovery is automated or manual. 


-->


#### Notifications
TODO: Add any notifications here for DR.
<!-- 4G1. Notifications -------------------------------- -->


<!-- In the case of disaster, explain:
    
- How customer detects outages.    
- How the customer is notified or how customer can check service health. 
- Explain how Microsoft detects and handles outages for this offering. 

-->


#### Initiate recovery
<!-- 4G2. Initiate recovery -------------------------------- -->

<!-- In the case of disaster, explain how the customer can initiate recovery or how customer can check service health. -->


#### Post-disaster recovery configuration
<!-- 4G3. Post-disaster recovery configuration -------------------------------- -->

<!-- After disaster recovery has been completed, document any post recovery configurations that may be required.  -->

## Additional guidance

TODO: Add your additional guidance

<!-- 5. Additional guidance ------------------------------------------------------------
Provide any additional guidance here.
-->

## Related content

<!-- 6.Related content ---------------------------------------------------------------------
Required: Include any related content that points to a relevant task to accomplish,
or to a related topic. Use the blue box format for links.
-->


- [Reliability in Azure](/azure/availability-zones/overview.md)