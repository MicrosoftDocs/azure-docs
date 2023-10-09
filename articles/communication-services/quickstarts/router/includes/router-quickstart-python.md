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
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- [Python](https://www.python.org/downloads/) 3.7+ for your operating system.

## Sample code

You can review and download the sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/jobrouter-quickstart).

## Setting up

### Create a new Python application

In a terminal or console window, create a new folder for your application and navigate to it.

```console
mkdir jobrouter-quickstart && cd jobrouter-quickstart
```

### Install the package

You'll need to use the Azure Communication Job Router client library for Python [version 1.0.0b1](https://pypi.org/project/azure-communication-jobrouter) or above.

From a console prompt, execute the following command:

```console
pip install azure-communication-jobrouter
```

### Set up the app framework

Create a new file called `router-quickstart.py` and add the basic program structure.

```python
import time
from azure.communication.jobrouter import (
    JobRouterClient,
    JobRouterAdministrationClient,
    DistributionPolicy,
    LongestIdleMode,
    RouterQueue,
    RouterJob,
    RouterWorkerSelector,
    LabelOperator,
    RouterWorker,
    ChannelConfiguration
)

class RouterQuickstart(object):
    print("Azure Communication Services - Job Router Quickstart")
    #Job Router method implementations goes here

if __name__ == '__main__':
    router = RouterQuickstart()
```

## Initialize the Job Router client and administration client

Job Router clients can be authenticated using your connection string acquired from an Azure Communication Services resource in the Azure portal.  We generate both a client and an administration client to interact with the Job Router service.  The admin client is used to provision queues and policies, while the client is used to submit jobs and register workers. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

```python
# Get a connection string to our Azure Communication Services resource.
connection_string = "your_connection_string"
router_admin_client = JobRouterAdministrationClient.from_connection_string(conn_str = connection_string)
router_client = JobRouterClient.from_connection_string(conn_str = connection_string)
```

## Create a distribution policy

Job Router uses a distribution policy to decide how Workers will be notified of available Jobs and the time to live for the notifications, known as **Offers**. Create the policy by specifying the **distribution_policy_id**, a **name**, an **offer_expires_after_seconds** value, and a distribution **mode**.

```python
distribution_policy = router_admin_client.create_distribution_policy(
    distribution_policy_id ="distribution-policy-1",
    distribution_policy = DistributionPolicy(
        offer_expires_after_seconds = 60,
        mode = LongestIdleMode(),
        name = "My distribution policy"
    ))
```

## Create a queue

Create the Queue by specifying an **ID**, **name**, and provide the **Distribution Policy** object's ID you created above.

```python
queue = router_admin_client.create_queue(
    queue_id = "queue-1",
    queue = RouterQueue(
        name = "My Queue",
        distribution_policy_id = distribution_policy.id
    ))
```

## Submit a job

Now, we can submit a job directly to that queue, with a worker selector that requires the worker to have the label `Some-Skill` greater than 10.

```python
job = router_client.create_job(
    job_id = "job-1",
    router_job = RouterJob(
        channel_id = "voice",
        queue_id = queue.id,
        priority = 1,
        requested_worker_selectors = [
            RouterWorkerSelector(
                key = "Some-Skill",
                label_operator = LabelOperator.GREATER_THAN,
                value = 10
            )
        ]
    ))
```

## Create a worker

Now, we create a worker to receive work from that queue, with a label of `Some-Skill` equal to 11 and capacity on `my-channel`.

```python
worker = router_client.create_worker(
    worker_id = "worker-1",
    router_worker = RouterWorker(
        total_capacity = 1,
        queue_assignments = {
            "queue-1": {}
        },
        labels = {
            "Some-Skill": 11
        },
        channel_configurations = {
            "voice": ChannelConfiguration(capacity_cost_per_job = 1)
        },
        available_for_offers = True
    ))
```

## Receive an offer

We should get a [RouterWorkerOfferIssued][offer_issued_event] from our [Event Grid subscription][subscribe_events].
However, we could also wait a few seconds and then query the worker directly against the JobRouter API to see if an offer was issued to it.

```python
time.sleep(10)
worker = router_client.get_worker(worker_id = worker.id)
for offer in worker.offers:
    print(f"Worker {worker.id} has an active offer for job {offer.job_id}")
```

## Accept the job offer

Then, the worker can accept the job offer by using the SDK, which assigns the job to the worker.

```python
accept = router_client.accept_job_offer(worker_id = worker.id, offer_id = worker.offers[0].offer_id)
print(f"Worker {worker.id} is assigned job {accept.job_id}")
```

## Complete the job

Once the worker has completed the work associated with the job (for example, completed the call), we complete the job.

```python
router_client.complete_job(job_id = job.id, assignment_id = accept.assignment_id)
print(f"Worker {worker.id} has completed job {accept.job_id}")
```

## Close the job

Once the worker is ready to take on new jobs, the worker should close the job.  Optionally, the worker can provide a disposition code to indicate the outcome of the job.

```python
router_client.close_job(job_id = job.id, assignment_id = accept.assignment_id, disposition_code = "Resolved")
print(f"Worker {worker.id} has closed job {accept.job_id}")
```

## Delete the job

Once the job has been closed, we can delete the job so that we can re-create the job with the same ID if we run this sample again

```python
router_client.delete_job(accept.job_id)
print(f"Deleting {accept.job_id}")
```

## Run the code

To run the code, make sure you are on the directory where your `router-quickstart.py` file is.

```console
python router-quickstart.py

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

Read about the full set of capabilities of Azure Communication Services Job Router from the [Python SDK reference](/python/api/overview/azure/communication-jobrouter-readme?view=azure-python-preview&preserve-view=true) or [REST API reference](/rest/api/communication/jobrouter/job-router).

<!-- LINKS -->

[subscribe_events]: ../../../how-tos/router-sdk/subscribe-events.md
[offer_issued_event]: ../../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
