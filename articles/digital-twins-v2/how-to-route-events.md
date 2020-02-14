---
# Mandatory fields.
title: Route event data
description: See how to route Azure Digital Twins telemetry and event data to external Azure services.
author: philmea
ms.author: philmea # Microsoft employees only
ms.date: 2/12/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---
# Route telemetry and event data to outside services

## Here is an info dump.

*There are 2 sides to routing: getting data out to another Azure thing for use later, and getting data specifically to an Azure Function that will be used to make updates back to graph. Not sure whether this is material for 1 how-to in private preview or should be split into 2. Will be 2 for GA when event handling is introduced.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	Event and Routing APIs. The Event APIs let developers wire-up event flow throughout the system, as well as to downstream services.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

HANDLING GRAPH EVENTS WITH AZURE FUNCTIONS

Compute Setup and Preparation
Add more detail to the setup workflow of compute 
To run compute from ADT event handlers, you need to prepare an event grid as the broker between ADT and your compute resource. You can then use subscriptions to this EventGrid to handle events from ADT, for example using Azure functions. 
The steps to do so are: 
	Attach an event grid in your subscription to ADT. This is typically done as part of deployment. As a result, you now have a named endpoint in ADT (e.g. “MyEventGrid1”). 
	Create an Event Grid Topic for each function you want to call. This is also typically done as part of deployment operations. We recommend using Event Domains, as this allows for greater numbers of topics, and provides additional security via Event Grid RBAC.
	Set up an Azure Functions app with your desired functions
	Register the Azure Function App with Azure Active Directory
	Enable Event Grid to access the AAD App
For more information:
	https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-event-grid
	https://docs.microsoft.com/en-us/azure/event-grid/secure-webhook-delivery

Creating Function / Webhook Subscription
Once you have an event grid with appropriate topics for each function you want to connect, you need to create subscriptions for each compute resource. This is done using the Azure management APIs for Event Grid. 
If your compute resource is an Azure Function, wire-up is a little easier, as you do not need to perform validation explicitly (this is handled by the EventGridTrigger for Azure Functions automatically).
Writing the Function Body
The following code snippet shows an example for an Azure Function set up as an event handler:
[FunctionName("HandlePercentageUpdate")]
public static void HandlePercentageUpdate([EventGridTrigger]EventGridEvent eventGridEvent, 
                                          ILogger log);
{
       DigitalTwinsEventData msg = eventGridEvent.Data;
       DigitalTwinsClient client = new DigitalTwinsClient(msg.SecurityContext);
       Response<JsonDocument> rrels = client.GetRelationships(msg.TargetId);
       JsonDocument rels = rrels.Value;
       double valueSum = 0;
       foreach (JElement rel in rels.GetArrayEnumerator())
       {
           JProperty relTargetProp = rel.Property("Target");
           string relTarget = rel.GetProperty(“Target”).GetString(); 
           double val = client.GetDoubleProperty(relTarget, "HandWashPercentage");
           valueSum += val;
       }
       double avg = valueSum / relArray.Count;
       client.SetDoubleProperty(msg.TargetId, "HandWashPercentage", avg);
}  
Note that the function receives a DigitalTwinsEventData object as parameters, delivered via the EventGridEvent.Data field. 
    class DigitalTwinsEventData
    {
        public string SourceId { get; set; }
        public string TargetId { get; set; }
        public string Payload { get; set; }
        public string PrmData { get; set; }
        public string Token { get; set; }
    }
This object provides context to your function:
	The source twin id
	The target twin id of the event handler registration
	The original event payload that caused the event to fire (for example, telemetry data)
	The parameter data that was specified in the event handler registration. This data can be used to customize execution of an event handler function that is re-used throughout a graph for a particular instantiation
	A security context that allows the event handler access to the graph
In this particular example, the function only uses the security context to connect to ADT, and the target twin id. This is used to find all connected patient rooms, and then calculate the average handwash ratio, extracting data from all the rooms.
