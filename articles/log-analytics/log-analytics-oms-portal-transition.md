---
title: Transition from OMS portal to Azure portal for Log Analytics users | Microsoft Docs
description: Answers to common questions for Log Analytics users transitioning from the OMS portal to the Azure portal.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/06/2018
ms.author: bwren

---
# Transition from OMS portal to Azure portal for Log Analytics users
Today, the Azure portal is a hub for all Azure services and offers a rich management experience with capabilities such as dashboards for pinning resources, intelligent search for finding resources, and tagging for resource management. But certain Log Analytics monitoring capabilities were only available in the OMS portal, and as a result, you often had to go back and forth between the Azure portal and the OMS portal. To provide a single streamlined workflow and a unified management and monitoring experience, we started integrating the OMS portal capabilities into the Azure portal. We are happy to announce that most of the features of OMS portal are now part of the Azure portal. As a result, most customers will be able to accomplish everything you were doing in the OMS portal using the Azure portal and more. If you haven’t already done so, we recommend that you start using the Azure portal today!  

We expect to close down the remaining gaps between the two portals soon, and we plan to sunset OMS portal in the next six months. We are excited to move to the Azure portal and expect the transition to be easy. But we understand that changes are difficult and can be disruptive- If you need any help, have questions, feedback, or concerns, please don’t hesitate to reach out to us at LAUpgradeFeedback@microsoft.com.  The rest of this article goes over the key scenarios, the current gaps and the roadmap for this transition.  

## What will change? 
We are planning to introduce the following changes: 

- Alert extension was already announced and is-on going (see more) 
- User role assignment in OMS Portal will be auto extended to Azure portal (see more) 
- Existing OMS Portal will be deprecated in the next six months – customers are advised to use [equivalent experiences in Azure Portal](log-analytics-oms-portal-faq.md).
- OMS Mobile App will be deprecated (see more) 


## Known gaps  
We are aware of several functional gaps that may necessitate usage of the OMS Portal. We are working on closing these gaps and we will continue to keep this document up to date as we are enabling these capabilities. You should also use Azure Updates <<link>> for on-going announcements about extensions and changes. 

1. Update schedules that were created using the OMS portal may not be reflected in the scheduled update deployments or update job history of the Update management dashboard in the Azure portal. We are targeting to address this gap by the end of June 2018Following solutions are not yet available in Azure portal, we are working on closing the gaps.

Windows Analytics Solutions (Upgrade Readiness, Device Health, and Update Compliance) 

DNS Analytics  

Azure Automation 

Surface Hub 

 

Custom logs preview feature is only available in classic OMS Portal. By end of June 2018, this will be auto enabled for all work spaces. 

Log search history is not available through the Azure Log search. It is however available through the Advanced Analytics portal, where it shows on the home page (“recent queries”). 

 

Some solution settings were places in the general solutions settings area: 

Office 365 - @Oleg is following up with Eliav 

ITSM Connector Connected Sources Settings is not part of the solution. - @Oleg to add the details 

New Alert Management experience is now available and will replace Alert Management solution. (see below) Existing Alert Management solution deployed will continue to function. 

AI/OMS Connector and solution are no longer required– same functionality can be enabled through cross-app/cross-workspace queries (reference below) - @Yossi 

NSG Solution is being replaced with enhanced functionality available via Traffic Analytics solution. (see below) 

Management API – TBD - @Yossi to update. 

 