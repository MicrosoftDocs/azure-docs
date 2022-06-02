---
title: Consume Events with Logic Apps - Azure Health Data Services
description: This article provides resources on how to consume Events with Logic Apps.
services: healthcare-apis
author: mcevoy.building7
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/31/2022
ms.author: v-smcevoy
---

# Consume Events with Logic Apps

In this article, you'll learn how to route and process Azure Health Data Services FHIR events using Azure Logic Apps. Events are a notification and subscription feature in the Azure Health Data Services. Azure Logic Apps create and run automated workflows to process data across different Azure services. When a FHIR Event is triggered by a subscribed notification, the event is processed with a Logic App workflow, causing one or more operations to be performed.

## Overview

Follow these steps to consume FHIR Events with Azure Logic Apps:

- Set up prerequisites
- Create a Logic App
- Create a Logic App Workflow
- Configure the workflow to receive events
- Configure the workflow to respond to events
- If the event resource satisfies a criteria, perform an operation.

## Prerequisites

You need to deploy a FHIR service with events enabled. For more information, see [Deploy Events in the Azure Portal](./events-deploy-portal.md).

## Creating a Logic App

Get started by creating a Logic App. For more information, see [What is Azure Logic Apps?](./../../logic-apps/logic-apps-overview.md)

### Start creating Logic App

Follow these steps:

- Go to the Azure Portal.
- Search for "Logic App".
- Click "Add".

You are now need to fill out the details of your Logic App. Specify information for these five categories (each category is a separate tab):

- Tab 1 - Basics
- Tab 2 - Hosting
- Tab 3 - Monitoring
- Tab 4 - Tags
- Tab 5 - Review + Create

### Basics

Start by specifying the following basics:

#### Project Details

- Subscription
- Resource Group

Select a current subscription and specify an existing or new resource group.

#### Instance Details

- Logic App name
- Publish type
- Region

Create a name for your Logic App. You must choose Workflow or Docker Container as your publishing type. Select a region that is compatible with your plan.

#### Plan

- Plan type
- App Service Plan
- Sku and size

Choose a plan type (Standard or Consumption). Create a new Windows Plan
name and specify the Sku and size.

#### Zone redundancy

- Zone redundancy deployment

Enabling your plan will make it zone redundant.

### Hosting

Continue specifying your Logic App by clicking "Next: Hosting".

#### Storage

- Storage type
- Storage account

Choose the type of storage you want to use and the storage account. You can use Azure Store or add SQL functionality. You must also create a new storage account or use an existing one.

### Monitoring

Continue specifying your Logic App by clicking "Next: Monitoring".

#### Monitoring wit Application Insights

- Enable Application Insights
- Application Insights
- Region

Enable Azure Monitor application insights to automatically monitor your application. If you enable insights, you must create a new insight and specify the region.

### Tags

Continue specifying your Logic App by clicking "Next: Tags".

#### Use tags to categorize resources

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

Note that this example will not use tagging.

### Review + create

Finish specifying your Logic App by clicking "Next: Review + create".

#### Review your Logic App

Your proposed Logic app will display the following details:

- Subscription
- Resource Group
- Logic App Name
- Runtime stack
- Hosting
- Storage
- Plan
- Monitoring

If you are satisfied with the all the proposed configuration, click "Create" or click "Previous" to go back and respecify.

You will see an alert telling you that deployment is initializing and then a page telling you that the deployment is in progress. If there are no errors, you will see a notification telling you that your deployment is complete.

Once your Logic App is created, you can do the following with your app:

- Stop
- Restart
- Kill
- Refresh

## Creating a workflow

Once your Logic App is running, you can create a workflow. To create a workflow, follow these steps:

- Start at the Azure Portal.
- Click "Logic Apps" in Azure services.
- Select the named Logic App you created.
- Click "Workflows" in the Workflow menu on the left.
- Click "Add" to add a workflow.

### Specifying a new workflow

You can specify the details of the new workflow on a panel on the right.

#### Creating a new workflow for the logic app

To create a new workflow, follow these steps:

- Workflow Name
- State type

Create a new name for your workflow. Specify whether you want the workflow to be stateful or stateless. Stateful is for business processes and stateless is for processing IoT events.

When you have specified the details, click "Create" to create the workflow.

### Designing the workflow

In your new workflow, click the name of the enabled workflow.

You can write code to design the workflow, but for this article, click the Designer item on the Developer menu.

Click "Choose an operation" to display the "Add a Trigger" blade on the right. Then search for "Azure Event Grid" and click "Azure" below (Event Grid is not a Logic App Built-in).

Click "Azure Event Grid" to display the Triggers and Actions available from Event Grid. For more information, see [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview).

Click "When a resource event occurs" as a trigger for the Azure Event Grid.

To tell Event Grid how to respond to the trigger, you must specify details for these categories:

- Specify Parameters
- Add actions

#### Parameter settings

You must specify the parameters for the trigger:

- Subscription
- Resource Type
- Resource Name
- Event type item(s)

Specify subscription, resource type, and resource name. Then you must specify the event types you want to respond to. In this article, the event types are:

- Resource created
- Resource deleted
- Resource updated

#### Adding a HTTP action

Once you have specified the trigger events, you must add a step. For this article, click the "+" below "When a resource even occurs".

You then must add an action. Click "Choose an operation" to continue. Then, for the operation, search for "HTTP and click on "Built-in" to select an HTTP operation.

- Method is "Get"
- URL is "concat('https://', triggerBody()?['subject'], '/_history/', triggerBody()?['dataVersion'])".
- Authentication type is "Managed Identity".
- Audience is "concat('https://', triggerBody()?['data']['resourceFhirAccount'])"

#### Allow FHIR Reader access to your Logic App

For this next step, you must go back to your Logic App and click the Identity menu item.

In the System assigned tab, make sure the Status is "On".

Click on Azure role assignments. Click "Add role assignment".

Specify the Scope as Subscription, the Subscription as your subscription, and the role as FHIR Data Reader. Give your Logic App the role of FHIR Data Reader. 

Add the role assignment by Managed identity, using Subscription, Managed identity (Logic App Standard), and select you Logic App by clicking the name and then clicking the Select button.

Then click "Review + assign" to assign the role.

### Add a Condition

Go back to the Logic App workflow.

Add a new condition by clicking the "+" below HTTP. Click "Choose an operation". Search for the word "condition". Click on "Built-in" to display the Control icon. Then click Actions and choose Condition.

You can now choose what actions happen if the condition is true or false.

### Choosing a Condition Criteria

Click on "Condition" in the flow on the left. You will see a set of condition choices on the right.

Under the "And" box, add these two conditions:

- resourceType
- Event Type

#### resourceType

The expression for getting the resourceType is `body('HTTP')?['resourceType']`.

#### Event Type

You can select Event Type from the Dynamic Content.

### Condition Testing

Click save. Then add some new Patient FHIR Resource to your FHIR Service. Wait a minute or two and check the Overview webpage of your Logic App workflow to verify that the Event was processed successfully by your Logic App workflow. The event should appear in green. If it failed then the event should appear in red.

## Next steps

For more information about FHIR events and Logic Apps, see

>[!div class="nextstepaction"]
>[What are Events](./events-overview.md)
>[What is Azure Logic Apps?](./../../logic-apps/logic-apps-overview.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
