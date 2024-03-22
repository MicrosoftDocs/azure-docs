---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 11/07/2023
 ms.author: spelluru
 ms.custom: include file
---

## Contact us
If you have any questions or feedback on this feature, don't hesitate to reach us at [arnsupport@microsoft.com](mailto:arnsupport@microsoft.com). 

To better assist you with specific feedback about a certain event, provide the following information: 
 
### For missing events:

- System topic type name
- Approximate timestamp in UTC when the operation was executed
- Base resource ID for which the notification was generated
- Navigate to your resource in Azure portal and select JSON view at the far right corner. Resource ID is the first field on the JSON view page.
- Expected event type
- Operation executed (for example, VM  started or stopped, Storage account created etc.)
- Description of issue encountered (for example, VM started and no Microsoft.ResourceNotifications.HealthResources.AvailabilityStatusChanged event generated)
- If possible, provide the correlation ID of operation executed 

### For event that was delayed or has unexpected content

- System topic type name
- Entire contents of the notification excluding data.resourceInfo.properties
- Description of issue encountered and impacted field values

Ensure that you aren't providing any end user identifiable information while you're sharing this data. 