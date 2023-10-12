---	
title: How to customize how workers are ranked for the best worker distribution mode
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to customize how workers are ranked for the best worker mode
author: rsarkar
manager: bo.gao
services: azure-communication-services

ms.author: rsarkar
ms.date: 02/23/2022
ms.topic: how-to
ms.service: azure-communication-services
---	

# How to customize how workers are ranked for the best worker distribution mode

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

The `best-worker` distribution mode selects the workers that are best able to handle the job first. The logic to rank Workers can be customized, with an expression or Azure function to compare two workers. The following example shows how to customize this logic with your own Azure Function.

## Scenario: Custom scoring rule in best worker distribution mode

We want to distribute offers among their workers associated with a queue. The workers will be given a score based on their labels and skill set. The worker with the highest score should get the first offer (_BestWorker Distribution Mode_).

:::image type="content" source="./media/best-worker-distribution-mode-problem-statement.png" alt-text="Diagram showing Best Worker Distribution Mode problem statement" lightbox="./media/best-worker-distribution-mode-problem-statement.png":::

### Situation

- A job has been created and classified.
  - Job has the following **labels** associated with it
    - ["CommunicationType"] = "Chat"
    - ["IssueType"] = "XboxSupport"
    - ["Language"] = "en"
    - ["HighPriority"] = true
    - ["SubIssueType"] = "ConsoleMalfunction"
    - ["ConsoleType"] = "XBOX_SERIES_X"
    - ["Model"] = "XBOX_SERIES_X_1TB"
  - Job has the following **WorkerSelectors** associated with it
    - ["English"] >= 7
    - ["ChatSupport"] = true
    - ["XboxSupport"] = true
- Job currently is in a state of '**Queued**'; enqueued in _Xbox Hardware Support Queue_ waiting to be matched to a worker.
- Multiple workers become available simultaneously.
  - **Worker 1** has been created with the following **labels**
    - ["HighPrioritySupport"] = true
    - ["HardwareSupport"] = true
    - ["Support_XBOX_SERIES_X"] = true
    - ["English"] = 10
    - ["ChatSupport"] = true
    - ["XboxSupport"] = true
  - **Worker 2** has been created with the following **labels**
    - ["HighPrioritySupport"] = true
    - ["HardwareSupport"] = true
    - ["Support_XBOX_SERIES_X"] = true
    - ["Support_XBOX_SERIES_S"] = true
    - ["English"] = 8
    - ["ChatSupport"] = true
    - ["XboxSupport"] = true
  - **Worker 3** has been created with the following **labels**
    - ["HighPrioritySupport"] = false
    - ["HardwareSupport"] = true
    - ["Support_XBOX"] = true
    - ["English"] = 7
    - ["ChatSupport"] = true
    - ["XboxSupport"] = true

### Expectation

We would like the following behavior when scoring workers to select which worker gets the first offer.

:::image type="content" source="./media/best-worker-distribution-mode-scoring-rule.png" alt-text="Decision flow diagram for scoring worker" lightbox="./media/best-worker-distribution-mode-scoring-rule.png":::

The decision flow (as shown above) is as follows:

- If a job is **NOT HighPriority**:
  - Workers with label: **["Support_XBOX"] = true**; get a score of _100_
  - Otherwise, get a score of _1_

- If a job is **HighPriority**:
  - Workers with label: **["HighPrioritySupport"] = false**; get a score of _1_
  - Otherwise, if **["HighPrioritySupport"] = true**:
    - Does Worker specialize in console type -> Does worker have label: **["Support_<**jobLabels.ConsoleType**>"] = true**? If true, worker gets score of _200_
    - Otherwise, get a score of _100_

## Creating an Azure function

Before moving on any further in the process, let us first define an Azure function that scores worker.
> [!NOTE]
> The following Azure function is using JavaScript. For more information, please refer to [Quickstart: Create a JavaScript function in Azure using Visual Studio Code](../../../azure-functions/create-first-function-vs-code-node.md)

Sample input for **Worker 1**

```json
{
  "job": {
    "CommunicationType": "Chat",
    "IssueType": "XboxSupport",
    "Language": "en",
    "HighPriority": true,
    "SubIssueType": "ConsoleMalfunction",
    "ConsoleType": "XBOX_SERIES_X",
    "Model": "XBOX_SERIES_X_1TB"
  },
  "selectors": [
    {
      "key": "English",
      "operator": "GreaterThanEqual",
      "value": 7,
      "expiresAfterSeconds": null
    },
    {
      "key": "ChatSupport",
      "operator": "Equal",
      "value": true,
      "expiresAfterSeconds": null
    },
    {
      "key": "XboxSupport",
      "operator": "Equal",
      "value": true,
      "expiresAfterSeconds": null
    }
  ],
  "worker": {
    "Id": "e3a3f2f9-3582-4bfe-9c5a-aa57831a0f88",
    "HighPrioritySupport": true,
    "HardwareSupport": true,
    "Support_XBOX_SERIES_X": true,
    "English": 10,
    "ChatSupport": true,
    "XboxSupport": true
  }
}
```

Sample implementation:

```javascript
module.exports = async function (context, req) {
    context.log('Best Worker Distribution Mode using Azure Function');

    let score = 0;
    const jobLabels = req.body.job;
    const workerLabels = req.body.worker;

    const isHighPriority = !!jobLabels["HighPriority"];
    context.log('Job is high priority? Status: ' + isHighPriority);

    if(!isHighPriority) {
        const isGenericXboxSupportWorker = !!workerLabels["Support_XBOX"];
        context.log('Worker provides general xbox support? Status: ' + isGenericXboxSupportWorker);

        score = isGenericXboxSupportWorker ? 100 : 1;

    } else {
        const workerSupportsHighPriorityJob = !!workerLabels["HighPrioritySupport"];
        context.log('Worker provides high priority support? Status: ' + workerSupportsHighPriorityJob);

        if(!workerSupportsHighPriorityJob) {
            score = 1;
        } else {
            const key = `Support_${jobLabels["ConsoleType"]}`;
            
            const workerSpecializeInConsoleType = !!workerLabels[key];
            context.log(`Worker specializes in consoleType: ${jobLabels["ConsoleType"]} ? Status: ${workerSpecializeInConsoleType}`);

            score = workerSpecializeInConsoleType ? 200 : 100;
        }
    }
    context.log('Final score of worker: ' + score);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: score
    };
}
```

Output for **Worker 1**

```markdown
200
```

With the aforementioned implementation, for the given job we'll get the following scores for workers:

| Worker | Score |
|--------|-------|
| Worker 1 | 200 |
| Worker 2 | 200 |
| Worker 3 | 1 |

## Distribute offers based on best worker mode

Now that the Azure function app is ready, let us create an instance of **BestWorkerDistribution** mode using Router SDK.

```csharp
var administrationClient = new JobRouterAdministrationClient("<YOUR_ACS_CONNECTION_STRING>");

// Setup Distribution Policy
var distributionPolicy = await administrationClient.CreateDistributionPolicyAsync(
    new CreateDistributionPolicyOptions(
        distributionPolicyId: "BestWorkerDistributionMode",
        offerExpiresAfter: TimeSpan.FromMinutes(5),
        mode: new BestWorkerMode(scoringRule: new FunctionRouterRule(new Uri("<insert function url>")))
    ) { Name = "XBox hardware support distribution" });

// Setup Queue
var queue = await administrationClient.CreateQueueAsync(
    new CreateQueueOptions(
        queueId: "XBox_Hardware_Support_Q",
        distributionPolicyId: distributionPolicy.Value.Id
    ) { Name = "XBox Hardware Support Queue" });

// Create workers
var worker1 = await client.CreateWorkerAsync(new CreateWorkerOptions(workerId: "Worker_1", totalCapacity: 100)
    {
        QueueAssignments = { [queue.Value.Id] = new RouterQueueAssignment() },
        ChannelConfigurations = { ["Xbox_Chat_Channel"] = new ChannelConfiguration(capacityCostPerJob: 10) },
        Labels =
        {
            ["English"] = new LabelValue(10),
            ["HighPrioritySupport"] = new LabelValue(true),
            ["HardwareSupport"] = new LabelValue(true),
            ["Support_XBOX_SERIES_X"] = new LabelValue(true),
            ["ChatSupport"] = new LabelValue(true),
            ["XboxSupport"] = new LabelValue(true)
        }
    });

var worker2 = await client.CreateWorkerAsync(new CreateWorkerOptions(workerId: "Worker_2", totalCapacity: 100)
    {
        QueueAssignments = { [queue.Value.Id] = new RouterQueueAssignment() },
        ChannelConfigurations = { ["Xbox_Chat_Channel"] = new ChannelConfiguration(capacityCostPerJob: 10) },
        Labels =
        {
            ["English"] = new LabelValue(8),
            ["HighPrioritySupport"] = new LabelValue(true),
            ["HardwareSupport"] = new LabelValue(true),
            ["Support_XBOX_SERIES_X"] = new LabelValue(true),
            ["ChatSupport"] = new LabelValue(true),
            ["XboxSupport"] = new LabelValue(true)
        }
    });

var worker3 = await client.CreateWorkerAsync(new CreateWorkerOptions(workerId: "Worker_3", totalCapacity: 100)
    {
        QueueAssignments = { [queue.Value.Id] = new RouterQueueAssignment() },
        ChannelConfigurations = { ["Xbox_Chat_Channel"] = new ChannelConfiguration(capacityCostPerJob: 10) },
        Labels =
        {
            ["English"] = new LabelValue(7),
            ["HighPrioritySupport"] = new LabelValue(true),
            ["HardwareSupport"] = new LabelValue(true),
            ["Support_XBOX_SERIES_X"] = new LabelValue(true),
            ["ChatSupport"] = new LabelValue(true),
            ["XboxSupport"] = new LabelValue(true)
        }
    });

// Create Job
var job = await client.CreateJobAsync(
    new CreateJobOptions(jobId: "job1", channelId: "Xbox_Chat_Channel", queueId: queue.Value.Id)
    {
        Priority = 100,
        ChannelReference = "ChatChannel",
        RequestedWorkerSelectors =
        {
            new RouterWorkerSelector(key: "English", labelOperator: LabelOperator.GreaterThanEqual, value: new LabelValue(7)),
            new RouterWorkerSelector(key: "ChatSupport", labelOperator: LabelOperator.Equal, value: new LabelValue(true)),
            new RouterWorkerSelector(key: "XboxSupport", labelOperator: LabelOperator.Equal, value: new LabelValue(true))
        },
        Labels =
        {
            ["CommunicationType"] = new LabelValue("Chat"),
            ["IssueType"] = new LabelValue("XboxSupport"),
            ["Language"] = new LabelValue("en"),
            ["HighPriority"] = new LabelValue(true),
            ["SubIssueType"] = new LabelValue("ConsoleMalfunction"),
            ["ConsoleType"] = new LabelValue("XBOX_SERIES_X"),
            ["Model"] = new LabelValue("XBOX_SERIES_X_1TB")
        }
    });

// Wait a few seconds and see which worker was matched
await Task.Delay(TimeSpan.FromSeconds(5));
var getJob = await client.GetJobAsync(job.Value.Id);
Console.WriteLine(getJob.Value.Assignments.Select(assignment => assignment.Value.WorkerId).First());
```

Output

```markdown
Worker_1 // or Worker_2

Since both workers, Worker_1 and Worker_2, get the same score of 200,
the worker who has been idle the longest will get the first offer.
```
