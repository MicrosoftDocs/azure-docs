<properties
	pageTitle="Add the recurrence trigger in Logic Apps | Microsoft Azure"
	description="Overview of the recurrence trigger, and how to use with an Azure logic app."
	services=""
	documentationCenter="" 
	authors="jeffhollan"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="logic-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="07/18/2016"
   ms.author="jehollan"/>

# Get started with the recurrence trigger

With the recurrence trigger, you can create powerful workflows in the cloud like:

- Schedule a workflow to run a SQL stored procedure every day
- Email a summary of all tweets within the last week about a certain hashtag

To get started using the recurrence trigger in a logic app, see [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

---

## Use a recurrence trigger

A trigger is an event that can be used to start the workflow defined in a Logic app. [Learn more about triggers](connectors-overview.md). 

Here’s an example sequence of how to setup a recurrence trigger in a logic app

1. Add the **Recurrence** trigger as the first step in a logic app
1. Fill in the parameters for the recurrence interval
1. The logic app will now start a run after each interval of time

![HTTP Trigger](./media/connectors-native-recurrence/using-trigger.png)

---

## Technical details

Below are the details for the recurrence trigger and the parameters you can configure.

### Trigger Details

The recurrence trigger has the following properties that can be configured.

#### Recurrence
Fire a logic app after a specified time interval.
An * means required field.

|Display Name|Property Name|Description|
|---|---|---|
|Frequency*|frequency|The unit of time - `Second`, `Minute`, `Hour`, `Day`, or `Year`|
|Interval*|interval|Interval of the given frequency for the recurrence|
|Time Zone|timeZone|If a startTime is provided without a UTC offset, this timeZone will be used|
|Start time|startTime|Start time in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations). If a startTime is provided without a UTC offset, this timeZone will be used|
<br>


## Next steps

Below are details on how to move forward with logic apps and our community.

## Create a logic app

Try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) now. You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
