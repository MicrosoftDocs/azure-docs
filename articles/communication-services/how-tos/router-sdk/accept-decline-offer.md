---
title: How to accept or decline offers in Job Router
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to use Azure Communication Services SDKs to accept or decline job offers in Job Router.
author: marche0133
ms.author: marcma
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 06/01/2022
ms.custom: template-how-to, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
#Customer intent: As a developer, I want to accept/decline job offers when they come in.
---

# Discover how to accept or decline Job Router job offers

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

This guide lays out the steps you need to take to observe a Job Router offer. It also outlines how to accept or decline job offers.

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Azure Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md).

## Accept job offers

After you create a job, observe the [worker offer-issued event](subscribe-events.md#microsoftcommunicationrouterworkerofferissued), which contains the worker ID and the job offer ID.  The worker can accept job offers by using the SDK.  Once the offer is accepted, the job will be assigned to the worker.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
await client.AcceptJobOfferAsync(offerIssuedEvent.Data.WorkerId, offerIssuedEvent.Data.OfferId);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
await client.acceptJobOffer(offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId);
```

::: zone-end

::: zone pivot="programming-language-python"

```python
# Event handler logic omitted
client.accept_job_offer(offerIssuedEvent.data.worker_id, offerIssuedEvent.data.offer_id)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Event handler logic omitted
client.acceptJobOffer(offerIssuedEvent.getData().getWorkerId(), offerIssuedEvent.getData().getOfferId());
```

::: zone-end

## Decline job offers

The worker can decline job offers by using the SDK. Once the offer is declined, the job will be offered to the next available worker.  The same job will not be offered to the worker that declined the job unless the worker is deregistered and registered again.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
await client.DeclineJobOfferAsync(new DeclineJobOfferOptions(
    workerId: offerIssuedEvent.Data.WorkerId,
    offerId: offerIssuedEvent.Data.OfferId));
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
await client.declineJobOffer(offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId);
```

::: zone-end

::: zone pivot="programming-language-python"

```python
# Event handler logic omitted
client.decline_job_offer(offerIssuedEvent.data.worker_id, offerIssuedEvent.data.offer_id)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Event handler logic omitted
client.declineJobOffer(
    new DeclineJobOfferOptions(offerIssuedEvent.getData().getWorkerId(), offerIssuedEvent.getData().getOfferId()));
```

::: zone-end

### Retry offer after some time

In some scenarios, a worker may want to automatically retry an offer after some time.  For example, a worker may want to retry an offer after 5 minutes.  To do this, the worker can use the SDK to decline the offer and specify the `retryOfferAfterUtc` property.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
await client.DeclineJobOfferAsync(new DeclineJobOfferOptions(
    workerId: offerIssuedEvent.Data.WorkerId,
    offerId: offerIssuedEvent.Data.OfferId)
{
    RetryOfferAt = DateTimeOffset.UtcNow.AddMinutes(5)
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
await client.declineJobOffer(offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId, {
    retryOfferAt: new Date(Date.now() + 5 * 60 * 1000)
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
# Event handler logic omitted
client.decline_job_offer(
    worker_id = offerIssuedEvent.data.worker_id,
    offer_id = offerIssuedEvent.data.offer_id,
    retry_offer_at = datetime.utcnow() + timedelta(minutes = 5))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Event handler logic omitted
client.declineJobOffer(
    new DeclineJobOfferOptions(offerIssuedEvent.getData().getWorkerId(), offerIssuedEvent.getData().getOfferId())
        .setRetryOfferAt(OffsetDateTime.now().plusMinutes(5)));
```

::: zone-end

## Next steps

- Review how to [manage a Job Router queue](manage-queue.md).
- Learn how to [subscribe to Job Router events](subscribe-events.md).
