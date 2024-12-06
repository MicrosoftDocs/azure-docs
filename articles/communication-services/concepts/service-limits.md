---
title: Service limits for Azure Communication Services
titleSuffix: An Azure Communication Services how-to document
description: Learn how to handle service limits for Azure Communication Services APIs.
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

This article explains the limitations of Azure Communication Services APIs and possible resolutions.

## Throttling patterns and architecture

When you reach service limitations, you receive an HTTP status code 429 (too many requests). In general, the following best practices are used for throttling:

- Reduce the number of operations per request.
- Reduce the frequency of calls.
- Avoid immediate retries because all requests accrue against your usage limits.

Find more general guidance on how to set up your service architecture to handle throttling and limitations in the [Azure architecture](/azure/architecture) documentation for [throttling patterns](/azure/architecture/patterns/throttling). To increase throttling limits, make a request to [Azure Support](../support.md).

1. Open the [Azure portal](https://ms.portal.azure.com/) and sign in.
1. Select [Help+Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
1. Select **Create new support request**.
1. In the **Describe your issue** text box, enter **Technical**, and then select **Go**.
1. From the **Select a service** dropdown menu, select **Service and Subscription Limits (Quotas)**, and then select **Next**.
1. At the **Problem** description, choose the **Issue type**, **Subscription**, and **Quota type** values, and then select **Next**.
1. Review any recommended solution, if available, and then select **Next**.
1. Add other details as needed, and then select **Next**.
1. At **Review + create**, check the information, make changes as needed, and then select **Create**.

Follow the steps to [make a request to Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Acquire phone numbers

Before you acquire a phone number, make sure your subscription meets the [geographic and subscription](./telephony/plan-solution.md) requirements. Otherwise, you can't purchase a phone number. The following limitations apply to purchasing numbers through the [Phone numbers SDK](./reference.md) and the [Azure portal](https://portal.azure.com/).

| Operation | Scope | Time frame | Limit (number of requests) |
|---|--|--|--|
| Purchase phone number | Azure tenant | - | 1 |
| Search for phone numbers | Azure tenant | One week | 5 |

### Action to take

For more information, see [Phone number types](./telephony/plan-solution.md) and [Telephony concepts](./telephony/telephony-concept.md).

To increase number purchase limits, make a request to Azure Support.

1. Open the [Azure portal](https://ms.portal.azure.com/) and sign in.
1. Select [Help+Support](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
1. Select **Create new support request**.
1. In the **Describe your issue** text box, enter **Technical**, and then select **Go**.
1. From the **Select a service** dropdown menu, select **Service and Subscription Limits (Quotas)**, and then select **Next**.
1. At the **Problem** description, choose the **Issue type**, **Subscription**, and **Quota type** values, and then select **Next**.
1. Review any recommended solutions, if available, and then select **Next**.
1. Add more details as needed, and then select **Next**.
1. At **Review + create** check the information, make changes as needed, and then select **Create**.

## Identity

| Operation | Time frames (seconds) | Limit (number of requests) |
|---|--|--|
| Create identity | 30 | 1,000|
| Delete identity | 30 | 500|
| Issue access token | 30 | 1,000|
| Revoke access token | 30 | 500|
| `createUserAndToken`| 30 | 1,000 |
| `exchangeTokens`| 30 | 500 |

### Action to take

We recommend that you acquire identities and tokens before you create chat threads or start calls. For example, do this task when the webpage loads or the application starts.

For more information, see [Authenticate to Azure Communication Services](./authentication.md).

## SMS

When you send or receive a high volume of messages, you might receive a ```429``` error. This error indicates that you're about to reach the service limitations. Your messages are queued and are sent after the number of requests is below the threshold.

Rate limits for SMS:

|Operation|Number type |Scope|Time frames| Limit (request number) | Message units per minute|
|---------|---|--|-------------|-------------------|-------------------------|
|Send message|Toll-free|Per number|60|200|200|
|Send message|Short code |Per number|60|6000|6000|
|Send message|Alphanumeric sender ID |Per resource|60|600|600|

### Action to take

If you have requirements that exceed the rate limits, submit a request to [Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to enable higher throughput.

For more information on the SMS SDK and service, see [SMS SDK overview](./sms/sdk-features.md) or the [SMS FAQ](./sms/sms-faq.md).

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

| Operation | Scope | Timeframe (minutes) | Limit (number of emails) | Higher limits available |
| --- | --- | --- | --- | --- |
| Send Email | Per Subscription | 1 | 30 | Yes |
| Send Email | Per Subscription | 60 | 100 | Yes |
| Get Email Status | Per Subscription | 1 | 60 | Yes |
| Get Email Status | Per Subscription | 60 | 200 | Yes |

The following table lists limits for [Azure managed domains](../quickstarts/email/add-azure-managed-domains.md).

| Operation | Scope | Timeframe (minutes) | Limit (number of emails) | Higher limits available |
| --- | --- | --- | --- | --- |
| Send Email | Per Subscription | 1 | 5 | No |
| Send Email | Per Subscription | 60 | 10 | No |
| Get Email Status | Per Subscription | 1 |10 | No |
| Get Email Status | Per Subscription | 60 |20 | No |

### Size limits for email

| Name | Limit |
| --- | --- |
| Number of recipients in email | 50 |
| Total email request size (including attachments) | 10 MB |
| Maximum authenticated connections per subscription | 250 |

For all message size limits, consider that Base64 encoding increases the size of the message. You need to increase the size value to account for the message size increase that occurs after the message attachments and any other binary data are Base64 encoded. Base64 encoding increases the size of the message by about 33%, so the message size is about 33% larger than the message sizes before encoding. For example, if you specify a maximum message size value of approximately 10 MB, you can expect a realistic maximum message size value of approximately 7.5 MB.

### Send attachments larger than 10 MB

To email file attachments up to 30 MB, make a [support request](../support.md).

If you need to send email file attachments larger than 30 MB, use this alternative solution. Store the files in an Azure Blob Storage account and include a link to the files in your email. You can secure the files with a shared access signature (SAS). A SAS provides secure delegated access to resources in your storage account. By using a SAS, you have granular control over how clients can access your data.

Benefits of using a Blob Storage account:

- You can handle large-scale files.
- You can use a SAS or keys to precisely manage file access.

For more information, see:

- [Introduction to Azure Blob Storage](/azure/storage/blobs/storage-blobs-introduction)
- [Grant limited access to Azure Storage resources by using shared access signatures](/azure/storage/common/storage-sas-overview)

### Action to take

To increase your email quota, follow the instructions in [Quota increase for email domains](./email/email-quota-increase.md).

> [!NOTE]
> Email quota increase requests might take up to 72 hours for evaluation and approval, especially for requests that come in on Friday afternoon.

## Chat

Azure Communication Services supports chat.

### Size limits for chat

| Name | Limit |
| --- | --- |
|Number of participants in thread|250 |
|Batch of participants: `CreateThread`|200 |
|Batch of participants: `AddParticipant`|200 |
|Page size: `ListMessages`|200 |
|Message size|28 KB |
|Number of Azure Communication Services resources per Azure Bot Service |1,000 |

### Rate limits for chat

| Operation | Scope | Limit per 10 seconds | Limit per minute |
| --- | --- | --- | --- |
| Create chat thread | Per user | 10 | - |
| Delete chat thread | Per user | 10 | - |
| Update chat thread | Per chat thread | 5 | - |
| Add participants or remove participants | Per chat thread | 10 | 30 |
| Get chat thread or list chat threads | Per user | 50 | - |
| Get chat message | Per user, per chat thread | 50 | - |
| Get chat message | Per chat thread | 250 | - |
| List chat messages | Per user, per chat thread | 50 | 200 |
| List chat messages | Per chat thread | 250 | 400 |
| Get read receipts (20-participant limit) | Per user, per chat thread | 5 | - |
| Get read receipts (20-participant limit) | Per chat thread | 100 | - |
| List chat thread participants | Per user, per chat thread | 10 | - |
| List chat thread participants | Per chat thread | 250 | - |
| Send message, update message, or delete message | Per chat thread | 10 | 30 |
| Send read receipt | Per user, per chat thread | 10 | 30 |
| Send typing indicator | Per user, per chat thread | 5 | 15 |
| Send typing indicator | Per chat thread | 10 | 30 |

> [!NOTE]
> Read receipts and typing indicators aren't supported on chat threads with more than 20 participants.

### Chat storage

Azure Communication Services stores chat messages according to the retention policy that you set when you create a chat thread.

[!INCLUDE [public-preview-notice.md](../includes/public-preview-include-document.md)]

You can choose between indefinite message retention or automatic deletion between 30 and 90 days via the retention policy on the [Create Chat Thread API](/rest/api/communication/chat/chat/create-chat-thread). Alternatively, you can choose not to set a retention policy on a chat thread.

If you have strict compliance needs, we recommend that you use the [Delete Chat Thread](/rest/api/communication/chat/chat/delete-chat-thread) API to delete chat threads. Any threads created before the new retention policy aren't affected unless you specifically change the policy for that thread.

> [!NOTE]
> If you accidentally delete messages, the system can't recover them. If you submit a support request for a deleted chat thread after the retention policy deletes that thread, it can't be retrieved. Information about that thread is no longer available. If needed, open a support ticket as quickly as possible within the 30-day window after you created a thread so that we can assist you.

## Voice and video calling

Azure Communication Services supports voice and video calling.

### PSTN call limitations

| Name | Scope | Limit |
| --- | --- | --- |
| Default number of outbound concurrent calls | Per number | 2 |

> [!NOTE]
> There are no limits on inbound concurrent calls. You can also submit a request to [Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to increase the limit for outbound concurrent calls. Our vetting team reviews all requests.

### Call maximum limitations

| Name | Limit |
| --- | --- |
| Number of participants | 350 |

### Calling SDK streaming support

The Azure Communication Services Calling SDK supports the following streaming configurations:

| Limit | Web | Windows/Android/iOS |
| --- | --- | --- |
| Maximum number of outgoing local streams that you can send simultaneously. | One video or one screen sharing | One video + one screen sharing |
| Maximum number of incoming remote streams that you can render simultaneously. | Nine videos + one screen sharing | Nine videos + one screen sharing |

The Calling SDK doesn't enforce these limits, but your users might experience performance degradation if you exceed these limits.

### Calling SDK timeouts

The following timeouts apply to the Azure Communication Services Calling SDKs:

| Action | Timeout in seconds |
| --- | --- |
| Reconnect or remove a participant. | 120 |
| Add or remove new modality from a call. (Start or stop video or screen sharing.) | 40 |
| Call transfer operation timeout. | 60 |
| A 1:1 call establishment timeout. | 85 |
| Group call establishment timeout. | 85 |
| PSTN call establishment timeout. | 115 |
| Promote a 1:1 call to a group call timeout. | 115 |

### Action to take

For more information about the voice and video calling SDK and service, see [Calling SDK overview](./voice-video-calling/calling-sdk-features.md) or [Known issues in the SDKs and APIs](./known-issues.md). You can also submit a request to [Azure Support](/azure/azure-portal/supportability/how-to-create-azure-support-request) to increase some of the limits. Our vetting team reviews all requests.

## Job Router

When you send or receive a high volume of requests, you might receive a ```ThrottleLimitExceededException``` error. This error indicates that you're reaching the service limitations. Your requests fail until the token bucket that's used to handle requests is replenished after a certain time.

### Rate limits for Job Router

| Operation | Scope | Time frame (seconds) | Limit (number of requests) | Timeout in seconds |
| --- | --- | --- | --- | --- |
| General requests | Per resource | 10 | 1,000 | 10 |

### Action to take

If you need to send a volume of messages that exceeds the rate limits, email us at acs-ccap@microsoft.com.

## Teams interoperability and Microsoft Graph

By using a Teams interoperability scenario, you likely use some Microsoft Graph APIs to create [meetings](/graph/cloud-communications-online-meetings).

Each service offered through Microsoft Graph has different limitations. Service-specific limits are described on [this webpage](/graph/throttling) in more detail.

### Action to take

When you implement error handling, use the HTTP error code 429 to detect throttling. The failed response includes the `Retry-After` response header. Use the `Retry-After` delay to back off requests. It's the fastest way to recover from throttling because Microsoft Graph continues to log resource use while a client is throttled.

You can find more information about Microsoft Graph [throttling](/graph/throttling) limits in the [Microsoft Graph](/graph/overview) documentation.

## Related content

- [Help and support options](../support.md)
