<properties
	pageTitle="Add delay in Logic Apps | Microsoft Azure"
	description="Overview of the delay and delay-until actions, and how to use with an Azure logic app."
	services=""
	documentationCenter="" 
	authors="jeffhollan"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="app-service-logic"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="07/18/2016"
   ms.author="jehollan"/>

# Get started with the delay and delay until actions

With the delay and delay until actions, you can complete workflow scenarios like

- Wait until a weekday to send a status update over email
- Delay the workflow until an HTTP call has time to complete before resuming and retrieving the result

To get started using the delay action in a logic app, see [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

---

## Use the delay actions

An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](connectors-overview.md). 

Here’s an example sequence of how to use a delay step in a logic app:

1. After adding a trigger, click the **New Step** to add an action
1. Search for "delay" to bring up the delay actions.  In this example we will select **Delay**

	![Delay actions](./media/connectors-native-delay/using-action-1.png)

1. Complete any of the action properties to configure delay

	![Delay config](./media/connectors-native-delay/using-action-2.png)

1. Click "Save" to publish and activate the logic app

---

## Technical details

Below are the details for the delay and delay until actions.

### Action Details

The recurrence trigger has the following properties that can be configured.

#### Delay

Delays the run for a certain time interval.
An * means required field.

|Display Name|Property Name|Description|
|---|---|---|
|Count*|count|The number of time units to delay|
|Unit*|unit|The unit of time - `Second`, `Minute`, `Hour`, or `Day`|
<br>

#### Delay Until

Delays the run until a specified date/time.
An * means required field.

|Display Name|Property Name|Description|
|---|---|---|
|Year*|timestamp|The year to delay until (GMT)|
|Month*|timestamp|The month to delay until (GMT)|
|Day*|timestamp|The day to delay until (GMT)|
<br>


## Next steps

Below are details on how to move forward with logic apps and our community.

## Create a logic app

Try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) now. You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
