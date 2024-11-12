---
title: Service limits for Azure Communication Services
titleSuffix: An Azure Communication Services how-to document
description: Learn how to handle service limits.
author: tophpalmer
manager: sundraman
services: azure-communication-services

ms.author: chpalm
ms.date: 03/31/2023
ms.topic: how-to
ms.service: azure-communication-services
ms.subservice: data
---
# Service limits for Azure Communication Services

This document explains the limitations of Azure Communication Services APIs and possible resolutions.

## Throttling patterns and architecture
When you hit service limitations, you receive an HTTP status code 429 (Too many requests). In general, the following are best practices for handling throttling:

- Reduce the number of operations per request.
- Reduce the frequency of calls.
- Avoid immediate retries because all requests accrue against your usage limits.

You can find more general guidance on how to set up your service architecture to handle throttling and limitations in the [Azure Architecture](/azure/architecture) documentation for [throttling patterns](/azure/architecture/patterns/throttling). Throttling limits can be increased through a request to Azure Support.

1. Open the [Azure portal](https://ms.portal.azure.com/) and sign in.
2. Select [Help+Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
3. Click **Create new support request**.
4. In the **Describe your issue** text box, enter `Technical` then click **Go**. 
5. From the **Select a service** dropdown menu, select **Service and Subscription Limits (Quotas)** then click **Next**.
6. At the Problem description, choose the **Issue type**, **Subscription**, and **Quota type** then click **Next**.
7. Review any **Recommended solution** if available, then click **Next**.
8. Add **Additional details** as needed, then click **Next**.
9. At **Review + create** check the information, make changes as needed, then click **Create**.
  
You can follow the documentation for [creating request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Acquiring phone numbers
Before acquiring a phone number, make sure your subscription meets the [geographic and subscription](./telephony/plan-solution.md) requirements. Otherwise, you can't purchase a phone number. The following limitations apply to purchasing numbers through the [Phone Numbers SDK](./reference.md) and the [Azure portal](https://portal.azure.com/).

| Operation | Scope | Timeframe | Limit (number of requests) |
|---|--|--|--|
| Purchase phone number | Azure tenant | - | 1 |
| Search for phone numbers | Azure tenant | one week | 5 |

### Action to take

For more information, see the [phone number types](./telephony/plan-solution.md) concept page and the [telephony concept](./telephony/telephony-concept.md) overview page.

Number purchase limits can be increased through a request to Azure Support.

1. Open the [Azure portal](https://ms.portal.azure.com/) and sign in.
2. Select [Help+Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
3. Click **Create new support request**.
4. In the **Describe your issue** text box, enter `Technical` then click **Go**. 
5. From the **Select a service** dropdown menu, select **Service and Subscription Limits (Quotas)** then click **Next**.
6. At the Problem description, choose the **Issue type**, **Subscription**, and **Quota type** then click **Next**.
7. Review any **Recommended solution** if available, then click **Next**.
8. Add **Additional details** as needed, then click **Next**.
9. At **Review + create** check the information, make changes as needed, then click **Create**.



## Identity

| Operation | Timeframes (seconds) | Limit (number of requests) |
|---|--|--|
| **Create identity** | 30 | 1000|
| **Delete identity** | 30 | 500|
| **Issue access token** | 30 | 1000|
| **Revoke access token**  | 30 | 500|
| **createUserAndToken**| 30 | 1000 |
| **exchangeTokens**| 30 | 500 |

### Action to take
We recommend acquiring identities and tokens before creating chat threads or starting calls. For example, when the webpage loads or the application starts. 

For more information, see the [identity concept overview](./authentication.md) page.

## SMS

When sending or receiving a high volume of messages, you might receive a ```429``` error. This error indicates you're hitting the service limitations, and your messages are queued to be sent once the number of requests is below the threshold.

### Rate Limits for SMS

|Operation|Number Type |Scope|Timeframe (s)| Limit (request #) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send Message|Toll-Free|Per Number|60|200|200|
|Send Message|Short Code |Per Number|60|6000|6000|
|Send Message|Alphanumeric Sender ID |Per resource|60|600|600|

### Action to take

If you have requirements that exceed the rate-limits, submit [a request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to enable higher throughput.


For more information on the SMS SDK and service, see the [SMS SDK overview](./sms/sdk-features.md) page or the [SMS FAQ](./sms/sms-faq.md) page.

## Email

You can send a limited number of email messages. If you exceed the [email rate limits](#rate-limits-for-email) for your subscription, your requests are rejected. You can attempt these requests again, after the Retry-After time passes. Take action before reaching the limit by requesting to raise your sending volume limits if needed.

The Azure Communication Services email service is designed to support high throughput. However, the service imposes initial rate limits to help customers onboard smoothly and avoid some of the issues that can occur when switching to a new email service.

We recommend gradually increasing your email volume using Azure Communication Services Email over a period of two to four weeks, while closely monitoring the delivery status of your emails. This gradual increase enables third-party email service providers to adapt to the change in IP for your domain's email traffic. The gradual change gives you time to protect your sender reputation and maintain the reliability of your email delivery.

Azure Communication Services email service supports high volume up to 1-2 million messages per hour. High throughput can be enabled based on several factors, including:
- Customer peak traffic
- Business needs
- Ability to manage failure rates
- Domain reputation

### Failure Rate Requirements

To enable a high email quota, your email failure rate must be less than one percent (1%). If your failure rate is high, you must resolve the issues before requesting a quota increase.
Customers are expected to actively monitor their failure rates.

If the failure rate increases after a quota increase, Azure Communication Services will contact the customer for immediate action and a resolution timeline. In extreme cases, if the failure rate isn't managed within the specified timeline, Azure Communication Services may reduce or suspend service until the issue is resolved.

#### Related articles

Azure Communication Services provides rich logs and analytics to help monitor and manage failure rates. For more information, see the following articles:

- [Improve sender reputation in Azure Communication Services email](./email/sender-reputation-managed-suppression-list.md)
- [Email Insights](./analytics/insights/email-insights.md)
- [Enable logs via Diagnostic Settings in Azure Monitor](./analytics/enable-logging.md)
- [Quickstart: Handle Email events](../quickstarts/email/handle-email-events.md)
- [Quickstart: Manage domain suppression lists in Azure Communication Services using the management client libraries](../quickstarts/email/manage-suppression-list-management-sdks.md)

> [!NOTE]
> To request higher limits, follow the instructions at [Quota increase for email domains](./email/email-quota-increase.md). Higher quotas are only available for verified custom domains, not Azure-managed domains.

### Rate Limits for Email

[Custom Domains](../quickstarts/email/add-custom-verified-domains.md)

| Operation | Scope | Timeframe (minutes) | Limit (number of emails) |
|---------|-----|-------------|-------------------|
|Send Email|Per Subscription|1|30 <br /> You can [request an increase](./email/email-quota-increase.md).|
|Send Email|Per Subscription|60|100 <br /> You can [request an increase](./email/email-quota-increase.md).|
|Get Email Status|Per Subscription|1|60 <br /> You can [request an increase](./email/email-quota-increase.md).|
|Get Email Status|Per Subscription|60|200 <br /> You can [request an increase](./email/email-quota-increase.md).|

[Azure Managed Domains](../quickstarts/email/add-azure-managed-domains.md)

| Operation | Scope | Timeframe (minutes) | Limit (number of emails) |
|---------|-----|-------------|-------------------|
|Send Email|Per Subscription|1|5|
|Send Email|Per Subscription|60|10|
|Get Email Status|Per Subscription|1|10|
|Get Email Status|Per Subscription|60|20|

### Size Limits for Email

| **Name** | Limit |
| --- | --- |
| Number of recipients in Email | 50 |
| Total email request size (including attachments) | 10 MB |
| Maximum authenticated connections per subscription | 250 |

For all message size limits, you need to consider that that base64 encoding increases the size of the message. You need to increase the size value to account for the message size increase that occurs after the message attachments and any other binary data are Base64 encoded. Base64 encoding increases the size of the message by about 33%, so the message size is about 33% larger than the message sizes before encoding. For example, if you specify a maximum message size value of ~10 MB, you can expect a realistic maximum message size value of approximately ~7.5 MB.

### Send attachments larger than 10 MB

To email file attachments up to 30 MB, complete a [support request](../support.md).

If you need to send email file attachments larger than 30 MB, you can use this alternative solution. Store the files in an Azure Blob Storage account and include a link to the files in your email. You can secure the files with a Shared Access Signature (SAS). SAS provides secure delegated access to resources in your storage account. By using SAS, you have granular control over how clients can access your data.
 
Benefits of using an Azure Blob Storage account:

 - You can handle large scale files.
 - You can use SAS keys to precisely manage file access.

For more information, see:

 - [Introduction to Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction)
 - [Grant limited access to Azure Storage resources using shared access signatures (SAS)](/azure/storage/common/storage-sas-overview)

### Action to take

To increase your email quota, follow the instructions at [Quota increase for email domains](./email/email-quota-increase.md).

> [!NOTE]
> Email quota increase requests may take up to 72 hours to be evaluated and approved, especially for requests that come in on Friday afternoon.

## Chat

### Size Limits for Chat

| **Name** | Limit |
| --- | --- |
|Number of participants in thread|250 |
|Batch of participants - CreateThread|200 |
|Batch of participants - AddParticipant|200 |
|Page size - ListMessages|200 |
|Message Size|28 KB |
|Number of Azure Communication Services resources per Azure Bot|1000 |

### Rate Limits for Chat

| **Operation** | **Scope** | **Limit per 10 seconds** | **Limit per minute** |
| --- | --- | --- | --- |
| Create chat thread | per User | 10 | - |
| Delete chat thread | per User | 10 | - |
| Update chat thread | per Chat thread | 5 | - |
| Add participants / remove participants | per Chat thread | 10 | 30 |
| Get chat thread / List chat threads | per User | 50 | - |
| Get chat message | per User per chat thread | 50 | - |
| Get chat message | per Chat thread | 250 | - |
| List chat messages | per User per chat thread | 50 | 200 |
| List chat messages | per Chat thread | 250 | 400 |
| Get read receipts (20 participant limit\*) | per User per chat thread | 5 | - |
| Get read receipts (20 participant limit\*) | per Chat thread | 100 | - |
| List chat thread participants | per User per chat thread | 10 | - |
| List chat thread participants | per Chat thread | 250 | - |
| Send message / update message / delete message | per Chat thread | 10 | 30 |
| Send read receipt | per User per chat thread | 10 | 30 |
| Send typing indicator | per User per chat thread | 5 | 15 |
| Send typing indicator | per Chat thread | 10 | 30 |

> [!NOTE] 
> \* Read receipts and typing indicators are not supported on chat threads with more than 20 participants.

### Chat storage

Azure Communication Services stores chat messages according to the retention policy you set when you create a chat thread.

[!INCLUDE [public-preview-notice.md](../includes/public-preview-include-document.md)]

You can choose between indefinite message retention or automatic deletion between 30 and 90 days via the retention policy on the [Create Chat Thread API](/rest/api/communication/chat/chat/create-chat-thread).
Alternatively, you can choose not to set a retention policy on a chat thread.

If you have strict compliance needs, we recommend that you delete chat threads using the API [Delete Chat Thread](/rest/api/communication/chat/chat/delete-chat-thread). Any threads created before the new retention policy aren't affected unless you specifically change the policy for that thread.

> [!NOTE] 
> If you accidentally deleted messages, they can't be recovered by the system. Additionally, if you submit a support request for a deleted chat thread after the retention policy has deleted that thread, it can no longer be retrieved and no information about that thread is available. If needed, open a support ticket as quickly as possible within the 30 day window after you created a thread so we can assist you.

## Voice and video calling

### PSTN Call limitations

| **Name** | **Scope** | Limit |
| --- | --- | --- |
| Default number of outbound* concurrent calls | per Number | 2 |

> [!NOTE] 
> \* No limits on inbound concurrent calls. You can also [submit a request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to increase the outbound concurrent calls limit, which is reviewed by our vetting team.

### Call maximum limitations

| **Name** | Limit |
| --- | --- |
| Number of participants | 350 |

### Calling SDK streaming support
The Communication Services Calling SDK supports the following streaming configurations:

| Limit | Web | Windows/Android/iOS |
| --- | --- | --- |
| **Maximum # of outgoing local streams that you can send simultaneously** | one video or one screen sharing | one video + one screen sharing |
| **Maximum # of incoming remote streams that you can render simultaneously** | nine videos + one screen sharing | nine videos + one screen sharing |

The Calling SDK doesn't enforce these limits, but your users might experience performance degradation if you exceed these limits.

### Calling SDK timeouts

The following timeouts apply to the Communication Services Calling SDKs:

| Action | Timeout in seconds |
| --- | --- |
| Reconnect/removal participant | 120 |
| Add or remove new modality from a call (Start/stop video or screen sharing) | 40 |
| Call Transfer operation timeout | 60 |
| 1:1 call establishment timeout | 85 |
| Group call establishment timeout | 85 |
| PSTN call establishment timeout | 115 |
| Promote 1:1 call to a group call timeout | 115 |

### Action to take

For more information about the voice and video calling SDK and service, see the [calling SDK overview](./voice-video-calling/calling-sdk-features.md) page or [known issues](./known-issues.md). You can also [submit a request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to increase some of the limits, pending review by our vetting team.

## Job Router

When sending or receiving a high volume of requests, you might receive a ```ThrottleLimitExceededException``` error. This error indicates you're hitting the service limitations, and your requests fail until the token of bucket to handle requests is replenished after a certain time.

### Rate Limits for Job Router

| Operation | Scope | Timeframe (seconds) | Limit (number of requests) | Timeout in seconds |
| --- | --- | --- | --- | --- |
| General Requests | Per Resource | 10 | 1000 | 10 |

### Action to take

If you need to send a volume of messages that exceeds the rate limits, email us at acs-ccap@microsoft.com.

## Teams Interoperability and Microsoft Graph

Using a Teams interoperability scenario, you often use Microsoft Graph APIs to create [meetings](/graph/cloud-communications-online-meetings).  

Each service offered through Microsoft Graph has different limitations; service-specific limits are [described here](/graph/throttling) in more detail.

### Action to take

When you implement error handling, use the HTTP error code 429 to detect throttling. The failed response includes the `Retry-After` response header. Backing off requests using the `Retry-After` delay is the fastest way to recover from throttling because Microsoft Graph continues to log resource usage while a client is being throttled.

You can find more information about Microsoft Graph [throttling](/graph/throttling) limits in the [Microsoft Graph](/graph/overview) documentation.

## Next steps

- [Azure Communication Services](../overview.md)
- [Azure AI Studio](/azure/ai-studio/)
- [Help and support options](../support.md)
