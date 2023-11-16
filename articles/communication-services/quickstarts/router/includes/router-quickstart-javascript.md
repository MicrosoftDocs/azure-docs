---
title: include file
description: include file
services: azure-communication-services
author: williamzhao
manager: bga

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/09/2023
ms.topic: include
ms.custom: include file
ms.author: williamzhao
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).
- The latest versions of [Node.js](https://nodejs.org/en/download/) Active LTS and Maintenance LTS versions.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/job-router-quickstart).

## Setting up

### Create a new web application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir acs-router-quickstart && cd acs-router-quickstart
```

Run `npm init` to create a package.json file with default settings.

```console
npm init -y
```

Create a new file `index.js` where you'll add the code for this quickstart.

### Install the packages

You'll need to use the Azure Communication Job Router client library for JavaScript [version 1.0.0](https://www.npmjs.com/package/@azure-rest/communication-job-router) or above.

Use the `npm install` command to install the below Communication Services SDKs for JavaScript.

```console
npm install @azure-rest/communication-job-router --save
```

### Set up the app framework

In the `index.js` file, add the following code. We'll add the code for the quickstart in the `main` function.

``` javascript
const createClient = require('@azure-rest/communication-job-router');

const main = async () => {
  console.log("Azure Communication Services - Job Router Quickstart")

  // Quickstart code goes here

};

main().catch((error) => {
  console.log("Encountered an error");
  console.log(error);
})
```

## Initialize the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We generate both a client and an administration client to interact with the Job Router service.  The admin client is used to provision queues and policies, while the client is used to submit jobs and register workers. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

Add the following code in `index.js` inside the `main` function.

```javascript
// create JobRouterAdministrationClient and JobRouterClient
const connectionString = process.env["COMMUNICATION_CONNECTION_STRING"] ||
    "endpoint=https://<resource-name>.communication.azure.com/;<access-key>";
const client = createClient(connectionString);
```

## Create a distribution policy

Job Router uses a distribution policy to decide how workers are notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **ID**, a **name**, an **offerExpiresAfter**, and a distribution **mode**.

```javascript
const distributionPolicy = await client.path("/routing/distributionPolicies/{distributionPolicyId}", "distribution-policy-1").patch({
    body: {
        offerExpiresAfterSeconds: 60,
        mode: { kind: "longest-idle" },
        name: "My distribution policy"
    },
    contentType: "application/merge-patch+json"
});
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```javascript
const queue = await client.path("/routing/queues/{queueId}", "queue-1").patch({
    body: {
        name: "My Queue",
        distributionPolicyId: distributionPolicy.body.id
    },
    contentType: "application/merge-patch+json"
});
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector that requires the worker to have the label `Some-Skill` greater than 10.

```javascript
const job = await client.path("/routing/jobs/{jobId}", "job-1").patch({
    body: {
        channelId: "voice",
        queueId: queue.body.id,
        priority: 1,
        requestedWorkerSelectors: [{ key: "Some-Skill", labelOperator: "greaterThan", value: 10 }]
    },
    contentType: "application/merge-patch+json"
});
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```javascript
let worker = await client.path("/routing/workers/{workerId}", "worker-1").patch({
    body:  {
        capacity: 1,
        queues: [queue.body.id],
        labels: { "Some-Skill": 11 },
        channels: [ { channelId: "voice", capacityCostPerJob: 1 } ],
        availableForOffers: true
    },
    contentType: "application/merge-patch+json"
});
```

## Receive an offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [Event Grid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```javascript
await new Promise(r => setTimeout(r, 10000));
worker = await client.path("/routing/workers/{workerId}", worker.body.id).get();
for (const offer of worker.body.offers) {
    console.log(`Worker ${worker.body.id} has an active offer for job ${offer.jobId}`);
}
```

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which assigns the job to the worker.

```javascript
const accept = await client.path("/routing/workers/{workerId}/offers/{offerId}:accept", worker.body.id, worker.body.offers[0].offerId).post();
console.log(`Worker ${worker.body.id} is assigned job ${accept.body.jobId}`);
```

## Complete the job

Once the worker has completed the work associated with the job (for example, completed the call), we complete the job.

```javascript
await client.path("/routing/jobs/{jobId}:complete", accept.body.jobId).post({
    body: { assignmentId: accept.body.assignmentId }
});
console.log(`Worker ${worker.body.id} has completed job ${accept.body.jobId}`);
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```javascript
await client.path("/routing/jobs/{jobId}:complete", accept.body.jobId).post({
    body: { assignmentId: accept.assignmentId, dispositionCode: "Resolved" }
});
console.log(`Worker ${worker.body.id} has closed job ${accept.body.jobId}`);
```

## Delete the job

Once the job has been closed, we can delete the job so that we can re-create the job with the same ID if we run this sample again

```javascript
await client.path("/routing/jobs/{jobId}", accept.body.jobId).delete();
console.log(`Deleting job ${accept.body.jobId}`);
```

## Run the code

To run the code, make sure you are on the directory where your `index.js` file is.

```console
node index.js

Azure Communication Services - Job Router Quickstart
Worker worker-1 has an active offer for job job-1
Worker worker-1 is assigned job job-1
Worker worker-1 has completed job job-1
Worker worker-1 has closed job job-1
Deleting job job-1
```

> [!NOTE]
> Running the application more than once will cause a new Job to be placed in the queue each time. This can cause the Worker to be offered a Job other than the one created when you run the above code. Since this can skew your request, considering deleting Jobs in the queue each time. Refer to the SDK documentation for managing a Queue or a Job.

## Reference documentation

Read about the full set of capabilities of Azure Communication Services Job Router from the [JavaScript SDK reference](/javascript/api/overview/azure/communication-jobrouter?view=azure-node-preview&preserve-view=true) or [REST API reference](/rest/api/communication/jobrouter/job-router).

<!-- LINKS -->

[subscribe_events]: ../../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
