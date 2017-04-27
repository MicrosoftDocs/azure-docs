---
title: Azure Resource health FAQ | Microsoft Docs
description: Overview of Azure Resource health
services: Resource health
documentationcenter: dev-center-name
author: BernardoAMunoz
manager: ''
editor: ''

ms.assetid: 85cc88a4-80fd-4b9b-a30a-34ff3782855f
ms.service: resource-health
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Supportability
ms.date: 06/01/2016
ms.author: BernardoAMunoz

---

# Azure Resource health FAQ
Learn the answers to common questions about Azure resource health.

## Frequently asked questions
* [What is Azure resource health?](#what-is-azure-resource-health)
* [What is the resource health intended for?](#what-is-the-resource-health-intended-for)
* [What health checks are performed by resource health?](#what-health-checks-are-performed-by-resource-health)
* [What does each of the health status mean?](#what-does-each-of-the-health-status-mean)
* [What does the unknown status mean? Is something wrong with my resource?](#what-does-the-unknown-status-mean-is-something-wrong-with-my-resource)
* [How can I get help for a resource that is unavailable?](#how-can-i-get-help-for-a-resource-that-is-unavailable)
* [Does resource health differentiate between unavailability cased by platform problems versus something I did?](#does-resource-health-differentiate-between-unavailability-cased-by-platform-problems-versus-something-i-did)
* [Can I integrate resource health with my monitoring tools?](#can-i-integrate-resource-health-with-my-monitoring-tools)
* [Where do I find resource health?](#where-do-i-find-resource-health)
* [Is resource health available for all resource types?](#is-resource-health-available-for-all-resource-types)
* [What should I do if my resource is showing available but I believe it is not?](#what-should-i-do-if-my-resource-is-showing-available-but-i-believe-it-is-not)
* [Is resource health available for all Azure regions?](#is-resource-health-available-for-all-azure-regions)
* [How is resource health different from the Service Health Dashboard or the Azure portal service notifications?](#how-is-resource-health-different-from-the-service-health-dashboard-or-the-azure-portal-service-notifications)
* [Do I need to activate resource health for each resource?](#do-i-need-to-activate-resource-health-for-each-resource)
* [Do we need to enable resource health for my organization?](#do-we-need-to-enable-resource-health-for-my-organization)
* [Is resource health available free of charge?](#is-resource-health-available-free-of-charge)
* [What are the recommendations that resource health provides?](#what-are-the-recommendations-that-resource-health-provides)


## What is Azure resource health?
Resource health helps you diagnose and get support when an Azure issue impacts your resources. It informs you about the current and past health of your resources and helps you mitigate issues. Resource health provides technical support when you need help with Azure service issues.  

## What is the resource health intended for?
Once an issue with a resource has been detected, resource health can help you diagnose the root cause. It provides help to mitigate the issue and technical support when you need more help with Azure service issues.

## What health checks are performed by resource health?
Resource health performs various checks based on the [resource type](resource-health-checks-resource-types.md). These checks are designed to implement three types of issues: 
1. Unplanned events, for example an unexpected host reboot
2. Planned events, like scheduled host OS updates
3. Events triggered by user actions, for example a user rebooting a virtual machine

## What does each of the health status mean?
There are three different health statuses:
1. Available: There aren't any known problems in the Azure platform that could be impacting this resource
2. Unavailable: Resource health has detected issues that are impacting the resource
3. Unknown: Resource health can not determine the health of a resource because it has stopped receiving information about it. 

## What does the unknown status mean? Is something wrong with my resource?
The health status is set to unknown when resource health stops receiving information about a specific resource. While this status is not a definitive indication of the state of the resource, in cases where you are experiencing problems, it may indicate there is an Azure problem.

## How can I get help for a resource that is unavailable?
You can submit a support request from the resource health blade. You do not need a support agreement with Microsoft to open a request when the resource is unavailable because platform events.

## Does resource health differentiate between unavailability cased by platform problems versus something I did?
Yes, when a resource is unavailable, resource health identifies the root cause within one of these categories: 
1.	User initiated action
2.	Planned event 
3.	Unplanned event

In the portal, user initiated actions are shown using a blue notification icon, while planned and unplanned events are shown using a red warning icon. More details are provided in the [resource health overview](Resource-health-overview.md).  

## Can I integrate resource health with my monitoring tools?
Resource health is a service designed to help you diagnose and mitigate Azure service issues that impact your resources. While you can use the resource health API to programmatically obtain the health status, we recommend you use metrics to monitor your resources. Once an issue is detected, resource health helps you determine the root cause and guides you through actions to address them. Visit [Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/) to learn more about how you can use metrics to check your resources.

## Where do I find resource health?
After you log in to the Azure portal, there are multiple ways you can access resource health:
1. Navigate to your resource. In the left-hand navigation, click **Resource health**.
2. Go to the Azure Monitor blade.  In the left-hand navigation, click **Resource health**.
3. Open the **Help + Support** blade by clicking the question mark in the upper right corner of the portal and then selecting **Help + Support**. Once the blade opens, click **Resource health**

You can also use the resource health API to obtain information about the health of your resources.

## Is resource health available for all resource types?
The list of health checks and resource types supported through resource health can be found [here](resource-health-checks-resource-types.md)

## What should I do if my resource is showing available but I believe it is not?”
When checking the health of a resource, right under the health status you can click **Report incorrect health status**. Before submitting the report, you have the option of providing additional details on why you believe the current health status is incorrect.

## Is resource health available for all Azure regions? 
Resource health is available in across all Azure geos except the following regions:
* US Gov Virginia
* US Gov Iowa
* US DoD East
* US DoD Central
* Germany Central
* Germany Northeast
* China East
* China North

## How is resource health different from the Service Health Dashboard or the Azure portal service notifications?
The information provided by resource health is more specific than what is provided by the Azure Service Health Dashboard.

Whereas [Azure Status](https://status.azure.com) and the portal service notifications inform you about service issues that affect a broad set of customers (for example an Azure region), resource health exposes more granular events that are relevant only to the specific resource. For example, if a host unexpectedly reboots, resource health alerts only those customers whose virtual machines were running on that host.

It is important to notice that to provide you complete visibility of events impacting your resources, resource health also surfaces events published in Service notifications and the Service Health Dashboard.

## Do I need to activate resource health for each resource?
No, health information is available for all resource types available through resource health. 

## Do we need to enable resource health for my organization?
No.  Azure resource health is accessible within the Azure portal without any setup requirements.

## Is resource health available free of charge?
Yes.  Azure resource health is free of charge.

## What are the recommendations that resource health provides?
Based on the health status, resource health provides you with recommendations with the goal of reducing the time you spent troubleshooting. For available resources, the recommendations focus on how to solve the most common problems customers encounter. If the resource is unavailable due to an Azure unplanned event, the focus will be on assisting you during and after the recovery process. 

## Next steps

Check out these resources to learn more about resource health:
-  [Azure resource health overview](Resource-health-overview.md)
-  [Resource types and health checks available through Azure resource health](resource-health-checks-resource-types.md)
