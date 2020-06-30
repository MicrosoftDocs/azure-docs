# Notifications

Azure Communication Services provides a number of mechanisms for your clients and services to be notified of important application events. Those three options are briefly described here with links for more detailed information. 

## SDK Client Notifications

When an application is active and using the Calling or Chat SDKs, those SDKs provide events for actions such as Call Ended and Chat Message Received. These SDK events allow for a real-time foreground application experience with limited polling. These events are powered by non-public client-to-service connections managed internally by these SDKs. All you need to do is integrate these SDK capabilities into your application business logic and presentation layer. 

To learn more about the events available in the Calling and Chat SDKs, please see the respective tutorials for these services (TBD).

## Platform Push Notifications

When an application is in the background and non-active, you still may want to pop a push notification on the end-user device. The classic example is call initiation, when User A wants to start a voice or video call with User B. User B is not likely going to have the application idly open before the call starts. These push notifications need to use platform systems such as Apple Push Notification Service, Google Firebase, or the Windows Notification Service (WNS).

Azure Communication Services supports two patterns for implementing platform push notifications: 

## Push Notifications through Azure EventGrid connections

All ACS events are fired into Azure EventGrid, where they can be ingested into Azure Data Explorer, fire Webhooks, and otherwise be connected to your own systems. You can build your own service or use server-less computing (e.g. Azure Functions) to process events and fire into platform push notifications. This allows for a high degree of customization in the platform push notification pipeline, but you have to operate the connection between Event Grid and the platform service.

For more information see the topic on [ACS and EventGrid](acs-event-grid.md).

### Direct Delivery of Platform Push Notifications
A subset of ACS events can be configured to fire directly into Apple, Firebase, and Windows push notification channels. This requires you to provide platform configuration to ACS through the Azure portal. This subset of client-oriented events, such as call initiation, are available through this direct pathway to simple implementation, but customization of the notification payload is limited.

These events are a subset of what is available via EventGrid. Even if you are using this direct  ACS -> platform functionality, we recommend you use EventGrid and ingest events into Azure Data Explorer (Kusto) or another data platform so you retain the ability to search event history and debug issues.

For more information see the topic on *Direct Delivery of Platform Push Notifications*.

## Service to Service Webhooks
Your services might want to receive notifications of ACS activity. The common pattern for service to service notifications is Webhooks, where the initiating service (ACS) calls an HTTPS resource you specify.

Webhooks are easily configured for ACS activity using Azure EventGrid integration. For more information see the topic on [ACS and EventGrid](acs-event-grid.md).


