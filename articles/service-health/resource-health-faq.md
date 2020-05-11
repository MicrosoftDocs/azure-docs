---
title: Azure Resource Health FAQ
description: Overview of Azure Resource Health
ms.topic: conceptual
ms.date: 01/29/2019
---

# Azure Resource Health FAQ
Learn the answers to common questions about Azure Resource Health.

## What is Azure Resource Health?
Resource health helps you diagnose and get support when an Azure issue impacts your resources. It informs you about the current and past health of your resources and helps you mitigate issues. Resource health provides technical support when you need help with Azure service issues.  

## What is the Resource Health intended for?
Once an issue with a resource has been detected, Resource Health can help you diagnose the root cause. It provides help to mitigate the issue and technical support when you need more help with Azure service issues.

## What health checks are performed by Resource Health?
Resource health performs various checks based on the [resource type](resource-health-checks-resource-types.md). These checks are designed to implement three types of issues: 
- Unplanned events, for example an unexpected host reboot
- Planned events, like scheduled host OS updates
- Events triggered by user actions, for example a user rebooting a virtual machine

## What does each of the health status mean?
There are three different health statuses:
- Available: There aren't any known problems in the Azure platform that could be impacting this resource
- Unavailable: Resource health has detected issues that are impacting the resource
- Unknown: Resource health can not determine the health of a resource because it has stopped receiving information about it. 

## What does the unknown status mean? Is something wrong with my resource?
The health status is set to unknown when Resource Health stops receiving information about a specific resource. While this status is not a definitive indication of the state of the resource, in cases where you are experiencing problems, it may indicate there is an Azure problem.

## How can I get help for a resource that is unavailable?
You can submit a support request from the Resource Health blade. You do not need a support agreement with Microsoft to open a request when the resource is unavailable because platform events.

## Does Resource Health differentiate between unavailability caused by platform problems versus something I did?
Yes, when a resource is unavailable, Resource Health identifies the root cause within one of these categories: 
-	User initiated action
-	Planned event 
-	Unplanned event

In the portal, user initiated actions are shown using a blue notification icon, while planned and unplanned events are shown using a red warning icon. More details are provided in the [Resource Health overview](Resource-health-overview.md).  

## Can I integrate Resource Health with my monitoring tools?
Resource health has [preview support](resource-health-alert-arm-template-guide.md) for Activity Log based alerts. Activity Log alerts use [action groups](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups) to notify users that an alert has been triggered. Action groups support a variety of notification channels such as email, SMS, webhook, and ITSM actions.

## Where do I find Resource Health?
After you log in to the Azure portal, there are multiple ways you can access Resource Health:
- Navigate to your resource. In the left-hand navigation, select **Resource health**
- Go to the Azure Service Health blade.  In the left-hand navigation, select **Resource health**.
- Open the **Help + Support** blade by selecting the question mark in the upper right corner of the portal and then selecting **Help + Support**. Once the blade opens, select **Resource health**

You can also use the Resource Health API to obtain information about the health of your resources.

## Is Resource Health available for all resource types?
The list of health checks and resource types supported through Resource Health can be found [here](resource-health-checks-resource-types.md).

## What should I do if my resource is showing available but I believe it is not?”
When checking the health of a resource, right under the health status you can click **Report incorrect health status**. Before submitting the report, you have the option of providing additional details on why you believe the current health status is incorrect.

## Is Resource Health available for all Azure regions? 
Resource health is available in all Azure geos.

## How is Resource Health different from Azure status or the Service Health dashboard?
The information provided by Resource Health is more specific than what is provided by Azure status or the Service Health dashboard.

Whereas [Azure status](https://status.azure.com) and the Service Health dashboard inform you about service issues that affect a broad set of customers (for example an Azure region), Resource Health exposes more granular events that are relevant only to the specific resource. For example, if a host unexpectedly reboots, Resource Health alerts only those customers whose virtual machines were running on that host.

It is important to notice that to provide you complete visibility of events impacting your resources, Resource Health also surfaces events published in the Service Health dashboard.

## Do I need to activate Resource Health for each resource?
No, health information is available for all resource types available through Resource Health. 

## Do we need to enable Resource Health for my organization?
No.  Azure Resource Health is accessible within the Azure portal without any setup requirements.

## Is Resource Health available free of charge?
Yes.  Azure Resource Health is free of charge.

## What are the recommendations that Resource Health provides?
Based on the health status, Resource Health provides you with recommendations with the goal of reducing the time you spent troubleshooting. For available resources, the recommendations focus on how to solve the most common problems customers encounter. If the resource is unavailable due to an Azure unplanned event, the focus will be on assisting you during and after the recovery process. 

## Next steps

Learn more about Resource Health:
-  [Azure Resource Health overview](Resource-health-overview.md)
-  [Resource types and health checks available through Azure Resource Health](resource-health-checks-resource-types.md)
