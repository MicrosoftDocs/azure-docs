---
title: Consume Events with Logic Apps - Azure Health Data Services
description: This article provides resources on how to consume Events with Logic Apps.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 05/26/2022
ms.author: v-smcevoy
---

# Consume Events with Logic Apps

This tutorial shows how to use Azure Logic Apps to process Azure Health Data Services FHIR events. Logic Apps create and run automated workflows to process event data from other applications. You will learn how to register a FHIR event with your Logic App, meet a specified event criteria, and perform an service operation.

Here is an example of a Logic App workflow:

:::image type="content" source="media/events-logic-apps/events-logic-example.png" alt-text="Example of a Logic App workflow." lightbox="./media/events-logic-apps/events-logic-example.png":::

The workflow is on the left and the trigger condition is on the right.

## Overview

These are the steps needed to create a Logic App workflow to consume FHIR events:

- Set up prerequisites
- Create a Logic App
- Create a Logic App workflow

The workflow needs to be configured to receive and respond to events. A criteria must be set up to determine whether an operation will take place.

In this tutorial, the criteria will be:

- Resource Type = "Patient"
- Event Type = FHIR Resource Created

In addition, you must also give the FHIR Reader access to your Logic App.

## Prerequisites

To begin this tutorial, you need to deploy a FHIR service with events enabled. For more information, see [Deploy Events in the Azure Portal](./events-deploy-portal.md).

## Creating a Logic App

To set up an automated workflow, you must first create a Logic App. For more information, see [What is Azure Logic Apps?](./../../logic-apps/logic-apps-overview.md)

### Specify your Logic App details

Follow these steps:

- Go to the Azure Portal.
- Search for "Logic App".
- Click "Add".
- Specify Basic details
- Specify Hosting
- Specify Monitoring
- Specify Tags
- Review and Create your Logic App

You now need to fill out the details of your Logic App. Specify information for these five categories. They are in separate tabs:

:::image type="content" source="media/events-logic-tabs.png" alt-text="screenshot":::

- Tab 1 - Basics
- Tab 2 - Hosting
- Tab 3 - Monitoring
- Tab 4 - Tags
- Tab 5 - Review + Create

### Basics - Tab 1

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

### Hosting - Tab 2

Continue specifying your Logic App by clicking "Next: Hosting".

#### Storage

- Storage type
- Storage account

Choose the type of storage you want to use and the storage account. You can use Azure Storage or add SQL functionality. You must also create a new storage account or use an existing one.

### Monitoring - Tab 3

Continue specifying your Logic App by clicking "Next: Monitoring".

#### Monitoring with Application Insights

- Enable Application Insights
- Application Insights
- Region

Enable Azure Monitor application insights to automatically monitor your application. If you enable insights, you must create a new insight and specify the region.

### Tags - Tab 4

Continue specifying your Logic App by clicking "Next: Tags".

#### Use tags to categorize resources

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups.

Note that this example will not use tagging.

### Review + create - Tab 5

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

If you are satisfied with the proposed configuration, click "Create". If not, click "Previous" to go back and re-specify.

First you will see an alert telling you that deployment is initializing. Next you will see a new page telling you that the deployment is in progress.

:::image type="content" source="media/events-logic-progress.png" alt-text="screenshot":::

If there are no errors, you will finally see a notification telling you that your deployment is complete.

:::image type="content" source="media/events-logic-complete.png" alt-text="screenshot":::

#### Your Logic App Dashboard

Azure creates a dashboard when your Logic App is complete. The dashboard will show you the status of your app. You can return to your dashboard by clicking Overview in the Logic App menu. Here is a Logic App dashboard:

:::image type="content" source="media/events-logic-overview.png" alt-text="screenshot":::

You can do the following activities from your dashboard.

- Browse
- Refresh
- Stop
- Restart
- Swap
- Get Publish Profile
- Reset Publish Profile
- Delete

## Creating a workflow

When your Logic App is running, follow these steps to create a workflow:

- Initialize a workflow
- Configuring a workflow
- Designing a workflow
- Adding an action
- Giving FHIR Reader access
- Adding a condition
- Choosing a condition criteria
- Testing your condition

### Initializing your workflow

You need to have a Logic App configured and running correctly.

Once your Logic App is running, you can create and configure a workflow. To initialize a workflow, follow these steps:

- Start at the Azure Portal.
- Click "Logic Apps" in Azure services.
- Select the Logic App you created.
- Click "Workflows" in the Workflow menu on the left.
- Click "Add" to add a workflow.

### Configuring a new workflow

You will see a new panel on the right for creating a workflow.

:::image type="content" source="media/events-logic-panel.png" alt-text="screenshot":::

You can specify the details of the new workflow in the panel on the right.

#### Creating a new workflow for the logic app

To set up a new workflow, follow these steps:

- Workflow Name
- State type

Specify a new name for your workflow. Indicate whether you want the workflow to be stateful or stateless. Stateful is for business processes and stateless is for processing IoT events.

When you have specified the details, click "Create" to begin designing your workflow.

### Designing the workflow

In your new workflow, click the name of the enabled workflow.

You can write code to design a workflow for your application, but for this tutorial, choose the Designer option on the Developer menu.

Next, click "Choose an operation" to display the "Add a Trigger" blade on the right. Then search for "Azure Event Grid" and click the "Azure" tab below. Note that Event Grid is not a Logic App Built-in.

:::image type="content" source="media/events-logic-grid.png" alt-text="screenshot":::

When you see the "Azure Event Grid" icon,  click on it to display the Triggers and Actions available from Event Grid. For more information, see [Azure Event Grid]([What is Azure Event Grid?](./../../event-grid/overview.md)).

Click "When a resource event occurs" to set up a trigger for the Azure Event Grid.

To tell Event Grid how to respond to the trigger, you must specify parameters and add actions.

#### Parameter settings

You need to specify the parameters for the trigger:

- Subscription
- Resource Type
- Resource Name
- Event type item(s)

Fill in the details for subscription, resource type, and resource name. Then you must specify the event types you want to respond to. The event types used in this article are:

- Resource created
- Resource deleted
- Resource updated

<!--- add link to Events FAQ relating to event types. --->

### Adding a HTTP action

Once you have specified the trigger events, you must add another step. Click the "+" below the "When a resource event occurs" button.

You need to add a specific action. Click "Choose an operation" to continue. Then, for the operation, search for "HTTP" and click on "Built-in" to select an HTTP operation. The HTTP action will allow you to query the FHIR service.

The options in this example are:

- Method is "Get"
- URL is "concat('https://', triggerBody()?['subject'], '/_history/', triggerBody()?['dataVersion'])".
- Authentication type is "Managed Identity".
- Audience is "concat('https://', triggerBody()?['data']['resourceFhirAccount'])"

### Allow FHIR Reader access to your Logic App

At this point, you need to give the FHIR Reader access to your app, so it can verify that the event details are correct. Follow these steps to give it access:

1. The first step is to go back to your Logic App and click the Identity menu item.

2. In the System assigned tab, make sure the Status is "On".

3. Click on Azure role assignments. Click "Add role assignment".

4. Specify the following:

- Scope = Subscription
- Subscription = your subscription
- Role = FHIR Data Reader.

When you have specified the first four steps, add the role assignment by Managed identity, using Subscription, Managed identity (Logic App Standard), and select you Logic App by clicking the name and then clicking the Select button. Finally, click "Review + assign" to assign the role.

### Add a Condition

After you have given FHIR Reader access to your app, go back to the Logic App workflow Designer. Then add a condition to determine whether the event is one you want to process. Click the "+" below HTTP to "Choose an operation". On the right, search for the word "condition". Click on "Built-in" to display the Control icon. Next click Actions and choose Condition.

When the condition is ready, you can specify what actions happen if the condition is true or false.

### Choosing a Condition Criteria

In order to specify whether you want to take action for the specific event, begin specifying the criteria by clicking on "Condition" in the workflow on the left. You will then see a set of condition choices on the right.

Under the "And" box, add these two conditions:

- resourceType
- Event Type

#### resourceType

The expression for getting the resourceType is `body('HTTP')?['resourceType']`.

#### Event Type

You can select Event Type from the Dynamic Content.

Here is an example of the Condition criteria:

:::image type="content" source="media/events-logic-condition.png" alt-text="screenshot":::

#### Save your workflow

When you have entered the condition criteria, save your workflow.

#### Workflow dashboard

To check the status of your workflow, click Overview in the workflow menu. Here is a dashboard for a workflow:

:::image type="content" source="media/events-logic-dashboard.png" alt-text="screenshot":::

You can do the following operations from your workflow dashboard:

- Run trigger
- Refresh
- Enable
- Disable
- Delete

### Condition Testing

Save your workflow by clicking the "Save" button.

To test your new workflow, do the following:

- Add a new Patient FHIR Resource to your FHIR Service.
- Wait a moment or two and then check the Overview webpage of your Logic App workflow.
- The event should be shaded in green if the action was successful.
- If it failed, the event will be shaded in red.

Here is an example of a workflow trigger success operation:

:::image type="content" source="media/events-logic-success.png" alt-text="screenshot":::

## Next steps

For more information about FHIR events, see

>[!div class="nextstepaction"]
>[What are Events?](./events-overview.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.
