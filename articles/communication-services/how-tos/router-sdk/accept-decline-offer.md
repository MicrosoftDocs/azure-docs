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

This guide lays out the steps you need to take to observe a Job Router offer. It also outlines how to accept or decline job offers.

## Prerequisites

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Azure Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md).

## Accept job offers

After you create a job, observe the [worker offer-issued event](subscribe-events.md#microsoftcommunicationrouterworkerofferissued), which contains the worker ID and the job offer ID.  The worker can accept job offers by using the SDK.  Once the offer is accepted, the job is assigned to the worker, and the job's status is updated to `assigned`.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
var accept = await client.AcceptJobOfferAsync(offerIssuedEvent.Data.WorkerId, offerIssuedEvent.Data.OfferId);
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
const accept = await client.path("/routing/workers/{workerId}/offers/{offerId}:accept",
    offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId).post();
```

::: zone-end

::: zone pivot="programming-language-python"

```python
# Event handler logic omitted
accept = client.accept_job_offer(offerIssuedEvent.data.worker_id, offerIssuedEvent.data.offer_id)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
// Event handler logic omitted
AcceptJobOfferResult accept = client.acceptJobOffer(offerIssuedEvent.getData().getWorkerId(), offerIssuedEvent.getData().getOfferId());
```

::: zone-end

## Decline job offers

The worker can decline job offers by using the SDK. Once the offer is declined, the job is offered to the next available worker.  The job is not offered to the same worker that declined the job until the worker is deregistered and registered again.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
await client.DeclineJobOfferAsync(new DeclineJobOfferOptions(workerId: offerIssuedEvent.Data.WorkerId,
    offerId: offerIssuedEvent.Data.OfferId));
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
await client.path("/routing/workers/{workerId}/offers/{offerId}:decline",
    offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId).post();
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
client.declineJobOffer(offerIssuedEvent.getData().getWorkerId(), offerIssuedEvent.getData().getOfferId());
```

::: zone-end

### Retry offer after some time

In some scenarios, a worker may want to automatically retry an offer after some time.  For example, a worker may want to retry an offer after 5 minutes.  To achieve this flow, the worker can use the SDK to decline the offer and specify the `retryOfferAfter` property.

::: zone pivot="programming-language-csharp"

```csharp
// Event handler logic omitted
await client.DeclineJobOfferAsync(new DeclineJobOfferOptions(workerId: offerIssuedEvent.Data.WorkerId,
    offerId: offerIssuedEvent.Data.OfferId)
{
    RetryOfferAt = DateTimeOffset.UtcNow.AddMinutes(5)
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
// Event handler logic omitted
await client.path("/routing/workers/{workerId}/offers/{offerId}:decline",
    offerIssuedEvent.data.workerId, offerIssuedEvent.data.offerId).post({
        body: {
            retryOfferAt: new Date(Date.now() + 5 * 60 * 1000)
        }
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
    offerIssuedEvent.getData().getWorkerId(),
    offerIssuedEvent.getData().getOfferId(),
    new RequestOptions().setBody(BinaryData.fromObject(
        new DeclineJobOfferOptions().setRetryOfferAt(OffsetDateTime.now().plusMinutes(5)))));
```

::: zone-end

## Complete the job

Once the worker has completed the work associated with the job (for example, completed the call), we complete the job, which updates the status to `completed`.

::: zone pivot="programming-language-csharp"

```csharp
await routerClient.CompleteJobAsync(new CompleteJobOptions(jobId: accept.Value.JobId, assignmentId: accept.Value.AssignmentId));
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.path("/routing/jobs/{jobId}:complete", accept.body.jobId, accept.body.assignmentId).post();
```

::: zone-end

::: zone pivot="programming-language-python"

```python
router_client.complete_job(job_id = job.id, assignment_id = accept.assignment_id)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
routerClient.completeJobWithResponse(accept.getJobId(), accept.getAssignmentId(), null);
```

::: zone-end

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job, which updates the status to `closed`.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

::: zone pivot="programming-language-csharp"

```csharp
await routerClient.CloseJobAsync(new CloseJobOptions(jobId: accept.Value.JobId, assignmentId: accept.Value.AssignmentId) {
    DispositionCode = "Resolved"
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.path("/routing/jobs/{jobId}:close", accept.body.jobId, accept.body.assignmentId).post({
    body: {
        dispositionCode: "Resolved"
    }
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
router_client.close_job(job_id = job.id, assignment_id = accept.assignment_id, disposition_code = "Resolved")
```

::: zone-end

::: zone pivot="programming-language-java"

```java
routerClient.closeJobWithResponse(accept.getJobId(), accept.getAssignmentId(), 
    new RequestOptions().setBody(BinaryData.fromObject(new CloseJobOptions().setDispositionCode("Resolved"))));
```

::: zone-end

## Next steps

- Review how to [manage a Job Router queue](manage-queue.md).
- Learn how to [subscribe to Job Router events](subscribe-events.md).
