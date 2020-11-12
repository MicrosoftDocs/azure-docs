---
title: Azure Event Grid - Troubleshooting guide
description: This article provides a list of error codes, error messages, descriptions, and recommended actions. 
ms.topic: conceptual
ms.date: 07/07/2020
---

# Troubleshoot Azure Event Grid errors
This troubleshooting guide provides you with a list of Azure Event Grid error codes, error messages, their descriptions, and recommended actions that you should take when you receive these errors. 

## Error code: 400
| Error code | Error message | Description | Recommendation |
| ---------- | ------------- | ----------- | -------------- | 
| HttpStatusCode.BadRequest<br/>400 | Topic name must be between 3 and 50 characters in length. | The custom topic name length should be between 3 and 50 characters in length. Only alphanumeric letters, digits and the '-' character are allowed in the topic name. Also, the name shouldn't start with the following reserved words: <ul><li>Microsoft-</li><li>EventGrid-</li><li>System-</li></ul> | Choose a different topic name that adheres to the topic name requirements. |
| HttpStatusCode.BadRequest<br/>400 | Domain name must be between 3 and 50 characters in length. | The domain name length should be between 3 and 50 characters in length. Only alphanumeric letters, digits and the '-' character are allowed in the domain name. Also, the name shouldn't start with the following reserved words:<ul><li>Microsoft-</li><li>EventGrid-</li><li>System-</li> | Choose a different domain name that adheres to the domain name requirements. |
| HttpStatusCode.BadRequest<br/>400 | Invalid expiration time. | The expiration time for the event subscription determines when the event subscription will retire. This value should be a valid DateTime value in the future.| Make sure the Event Subscription expiration time in a valid DateTime format and it's set to be in the future. |

## Error code: 409
| Error code | Error message | Description | Recommended action |
| ---------- | ------------- | ----------- | -------------- | 
| HttpStatusCode.Conflict <br/>409 | Topic with the specified name already exists. Choose a different topic name.	| The custom topic name should be unique in a single Azure region in order to ensure a correct publishing operation. The same name can be used in different Azure regions. | Choose a different name for the topic. |
| HttpStatusCode.Conflict <br/> 409 | Domain with the specified already exists. Choose a different domain name. | The domain name should be unique in a single Azure region in order to ensure a correct publishing operation. The same name can be used in different Azure regions. | Choose a different name for the domain. |
| HttpStatusCode.Conflict<br/>409 | Quota limit reached. For more information on these limits, see [Azure Event Grid limits](../azure-resource-manager/management/azure-subscription-service-limits.md#event-grid-limits).  | Each Azure subscription has a limit on the number of Azure Event Grid resources that it can use. Some or all of this quota had been exceeded and no more resources could be created. |	Check your current resources usage and delete any that aren't needed. If you still need to increase your quota, send an email to [aeg@microsoft.com](mailto:aeg@microsoft.com) with the exact number of resources needed. |

## Error code: 403

| Error code | Error message | Description | Recommended action |
| ---------- | ------------- | ----------- | ------------------ |
| HttpStatusCode.Forbidden <br/>403 | Publishing to {Topic/Domain} by client {IpAddress} is rejected due to IpAddress filtering rules. | The topic or domain has IP firewall rules configured and access is restricted only to configured IP addresses. | Add the IP address to the IP firewall rules, see [Configure IP firewall](configure-firewall.md) |
| HttpStatusCode.Forbidden <br/> 403 | Publishing to {Topic/Domain} by client is rejected as request came from Private Endpoint and no matching private endpoint connection found for the resource. | The topic or domain has Private Endpoints configured and publish request came from a private endpoint which is not configured/approved. | Configure a private endpoint for the topic/domain. [Configure private endpoints](configure-private-endpoints.md) |

Also, check if your webhook is behind an Azure Application Gateway or Web Application Firewall. If it's, you need to disable the following firewall rules and do an HTTP POST again:

  - 920300 (Request Missing an Accept Header, we can fix this)
  - 942430 (Restricted SQL Character Anomaly Detection (args): # of special characters exceeded (12))
  - 920230 (Multiple URL Encoding Detected)
  - 942130 (SQL Injection Attack: SQL Tautology Detected.)
  - 931130 (Possible Remote File Inclusion (RFI) Attack = Off-Domain Reference/Link)



## Next steps
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
