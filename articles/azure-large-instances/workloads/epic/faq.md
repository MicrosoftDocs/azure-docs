---
title: Common Issues
description: Provides resolutions for common issues that arise in working with ALI for Epic.
ms.topic: conceptual
author: jjaygbay1
ms.author: jacobjaygbay
ms.service: baremetal-infrastructure
ms.date: 06/01/2023
---

# Frequently asked questions about Epic on Azure Large Instance

This article provides answers to frequently asked questions about Azure Large Instances(ALI) for Epic workloads.

## In which regions is this service available?

The Epic on Azure Large Instances(ALI) service is available in East US, US West2, US South Central  

 ## Do I need to give permissions to allow the deployment of a managed resource group in my subscription?

No, explicit permissions aren't required but register the resource provider with your subscription.

## Why am I not able to see the ALI resources in Azure Portal?

Check Azure Policy set up if ALI managed RGs are not reflected in portal. Azure subscription you use for Azure Large Instancesdeployments is already registered with the ALI infrastructure resource provider by Microsoft Operations team during provisioning process. If you don't see your deployed ALI instances under your subscription, register with the resource provider with your subscription. Please ensure that your VNET address space provided in the request is the same as what you. Configure [Link -Connect BareMetal Infrastructure instances in Azure - Azure Baremetal Infrastructure | Microsoft Learn]

## Is it possible to have Azure ARC installed on Azure Large Instancesresource?

It’s not mandatory but yes, it’s possible. You would have to create a support ticket with Azure Customer Support for Proxy set up and ARC and AMA installation.  

## How do I monitor Azure Large Instances(ALI) for Epic?

ALI is an IaaS offering and Azure teams are actively monitoring ALI infrastructure (network devices, storage appliances, server hardware, etc.). Customer alerts related to infrastructure would be provided only via Azure Portal’s Service Health.  Customers are highly recommended to set up Service Health alerts to get notified via their preferred communication channels when service issues, planned maintenance, or other changes happen around ALI.

 Refer : Receive activity log alerts on Azure service notifications using Azure portal - Azure Service Health | Microsoft Learn  

> [!NOTE]
> Microsoft is not responsible for integration with any other tooling or 3P agents. Customers are responsible for any additional 3P agents that they would like to install for logging and monitoring on ALI infrastructure.

It’s also recommended to re-run Epic GenIO test post 3P agents are installed to check for any performance variations.

For more details see “Shared Responsibility Model"

 -- Publishing Team to put  link where user can see the shared Responsibility Mode or paste the table here --  

## How will I get notified if there is any issue with our Azure ALI resource? How will Microsoft communicate unplanned issues?

Microsoft will send service health notification only through Azure portal. We always recommend customers to configure alerts for service health notifications.  

This monitoring and alerting mechanism is different than traditional, so customers are highly recommended to set up Service Health alerts to get notified via their preferred communication channels when service issues, planned maintenance, or other changes happen around ALI. 
Not setting this up could cause an issue with your ALI undetected for a long time and cause downtime if not addressed at the right time.  

Link : Receive activity log alerts on Azure service notifications using Azure portal - Azure Service Health | Microsoft Learn

## Based on my business priority, can I request a change in the “Planned” maintenance schedule for ALI- if I must? 

Microsoft will send a health notification service for both planned and unplanned events.
Ensure you configure health alerts for service health notifications.
If due to any business dependency, you need to request a change in the planned maintenance schedule, the preferred way would be to create a service request.
Planned maintenance does not include emergency fixes/patches required which cannot be rescheduled.

## Where do we create an Epic on Azure ALI related Service or Support Request? 

You can get Help + support in the Azure portal.
It's available from the Azure portal menu, the global header, or the resource menu for a service and create a Service Request.
In the dropdown menu you can look for Epic key word and then "Azure Large Instances" and select appropriate service type.

## What resources are available to learn more? 

Customers and partners can find more information at Microsoft Learn: <Publishing Team to put Epic on ALI landing page link> 

## Next steps

Learn how to identify and interact with ALI instances through the Azure portal.

> [!div class="nextstepaction"]
> [What is Azure for Large Instances?](../../what-is-azure-for-large-instances.md)


