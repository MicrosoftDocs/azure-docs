---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 09/15/2021
 ms.author: spelluru
 ms.custom: include file
---

## Message headers
These are the properties you receive in the message headers:

| Property name | Description |
| ------------- | ----------- | 
| aeg-subscription-name | Name of the event subscription. |
| aeg-delivery-count | Number of attempts made for the event. |
| aeg-event-type | <p>Type of the event.</p><p>It can be one of the following values:</p><ul><li>SubscriptionValidation</li><li>Notification</li><li>SubscriptionDeletion</li></ul> | 
| aeg-metadata-version | <p>Metadata version of the event.<p> For **Event Grid event schema**, this property represents the metadata version and for **cloud event schema**, it represents the **spec version**. </p>|
| aeg-data-version | <p>Data version of the event.</p><p>For **Event Grid event schema**, this property represents the data version and for **cloud event schema**, it doesn't apply.</p> |
| aeg-output-event-id | ID of the Event Grid event. |


