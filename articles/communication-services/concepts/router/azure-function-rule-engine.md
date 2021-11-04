---	
title: Azure Function Rule concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Job Router Azure Function Rule concepts.	
author: rsarkar
manager: bo.gao
services: azure-communication-services

ms.author: rsarkar
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---	

# Azure Function Rule concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

As part of customer extensibility model, Router supports Azure Function Rule Engine. It gives Contoso the ability to bring their own Azure function. With Azure function, Contoso can incorporate custom and complex logic into the process of routing.

Let's walk through the scenario below and observe how Contoso can use Azure Communication Services Job Router to solve it.

For example,
Contoso wants to distribute offers among their workers associated with a queue. The workers will be given a score based on their labels and skill set. The worker with the highest score should get the first offer (_BestWorker Distribution Mode_).
```text
Situation:
- A job has been created and classified.
- Job currently is in a state of 'Queued' waiting to be matched to an worker.
- Multiple workers (associated to the same queue as job) becomes available simultaneously. 
- All workers has ability to take up the job
- Which worker should the job be routed to?

In context of a contact center, this could be a scenario of a returning caller. 
For best user experience, maybe it's best to route the job to a worker who has previously interacted with the caller (assuming the same worker became available)

Task:
- The 'Best Worker' needs to be evaluated via some scoring mechanism
- Contoso needs to interact with a separate service to fetch 'score' of worker
- Scoring logic may involve interaction with more than one service
- Scoring logic is complicated and involves querying against Contoso's metadata store to fetch additional information. Router do not have access to the metadata store.
- Contoso wants to incorporate query results from the metadata store to calculate score for workers and pass it to Router so that it can generate an offer to the best worker

Action:
- Contoso creates an Azure Function which can query the metadata store and calculate score of an worker given all other pieces of information from Router.
- Contoso creates Distribution policy with the BestWorker distribution mode with the aforementioned azure function as it scoring rule
- Contoso provides azure function url, credentials etc. for Router to be able to access its custom function

Result
- Router when distributing jobs between workers, makes a request to Contoso's azure function to fetch score of workers
- Router sorts workers based on their scores and sends out offer(s) to workers

```

## Creating an Azure Function Rule

Building on the previous sample situation, let's create a custom Azure Function Rule.

Before moving on any further in the process, let us first define an Azure function that scores worker in the following manner:
> [!NOTE]
> The following Azure function is using C#. For more information, please refer to [Quickstart: Create your first C# function in Azure using Visual Studio](../../../azure-functions/functions-create-your-first-function-visual-studio.md)


```text
- Function takes in job labels and worker labels as input
- Function implements OverlappingLabelMatchScorer (Contoso implemented) as the scoring mode. This scoring mode counts the number of labels that is common between a worker and a job.
- The number of labels that 'overlaps' is the score of the worker.
```

```csharp
    public class OverlappingLabelMatchScorer
    {
        public static async Task<IDictionary<string, float>> GetScoreAsync(List<KeyValuePair<string, Dictionary<string, object>>>? workerLabelsCollection, Dictionary<string, object>? jobLabels)
        {
            var response = new ConcurrentDictionary<string, float>();
            var tasks = new List<Task>();

            var workerLabelsCollectionWithIndex = workerLabelsCollection.Select(labels => (labels.Key, labels.Value));

            foreach (var workerLabels in workerLabelsCollectionWithIndex)
            {
                var commonLabels = workerLabels.Value.Intersect(jobLabels);
                tasks.Add(GetCount(workerLabels.Key, commonLabels, response));
            }

            await Task.WhenAll(tasks);

            return response;
        }

        private static async Task GetCount(string workerLabelsId, IEnumerable<KeyValuePair<string, object>> commonLabels, ConcurrentDictionary<string, float> response)
        {
            int counter = 0;
            foreach (var r in commonLabels)
            {
                counter++;
            }

            response.AddOrUpdate(workerLabelsId.ToString(), counter, (_, _) => counter);
        }
    }
```

The complete function definition is provided below

```csharp
// © Microsoft Corporation. All rights reserved.

using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using JsonException = System.Text.Json.JsonException;

namespace AzureFunctionScorer
{
    public static class BestWorkerScorer
    {
        public class OverlappingLabelMatchScorer
        {
            public static async Task<IDictionary<string, float>> GetScoreAsync(List<KeyValuePair<string, Dictionary<string, object>>>? workerLabelsCollection, Dictionary<string, object>? jobLabels)
            {
                var response = new ConcurrentDictionary<string, float>();
                var tasks = new List<Task>();

                var workerLabelsCollectionWithIndex = workerLabelsCollection.Select(labels => (labels.Key, labels.Value));

                foreach (var workerLabels in workerLabelsCollectionWithIndex)
                {
                    var commonLabels = workerLabels.Value.Intersect(jobLabels);
                    tasks.Add(GetCount(workerLabels.Key, commonLabels, response));
                }

                await Task.WhenAll(tasks);

                return response;
            }

            private static async Task GetCount(string workerLabelsId, IEnumerable<KeyValuePair<string, object>> commonLabels, ConcurrentDictionary<string, float> response)
            {
                int counter = 0;
                foreach (var r in commonLabels)
                {
                    counter++;
                }

                response.AddOrUpdate(workerLabelsId.ToString(), counter, (_, _) => counter);
            }
        }

        public class AzureFunctionPayload
        {
            public Dictionary<string, object> Parameters { get; set; } = default!;
        }

        public class WorkerLabels
        {
            [JsonProperty("workerId")]
            public string WorkerId { get; set; }

            [JsonProperty("workerLabels")]
            public Dictionary<string, object> Labels { get; set; }
        }


        private const int MaxDepth = 8;


        [FunctionName("BestWorkerScorerByOverlappingLabels")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string requestBodyAsString = await new StreamReader(req.Body).ReadToEndAsync();

            var parameters = ReadContent(requestBodyAsString);

            var reqPayload = new AzureFunctionPayload()
            {
                Parameters = (Dictionary<string, object>)parameters.GetValueOrDefault("parameters")
            };

            var jobLabels = (Dictionary<string, object>)reqPayload.Parameters.GetValueOrDefault("jobLabels", Array.Empty<Dictionary<string, object>>());
            if (jobLabels.Count == 0)
            {
                var msg = $"Invalid job labels. Job labels found: {jobLabels.Count}";
                log.LogError(msg);
                return new BadRequestObjectResult(msg);
            }


            var workerLabelsRaw = (List<object>)reqPayload.Parameters.GetValueOrDefault("workerLabelsCollection", Array.Empty<Dictionary<string, object>>());

            if (workerLabelsRaw.Count == 0)
            {
                var msg = $"Invalid worker labels. Worker labels found: {workerLabelsRaw.Count}";
                log.LogError(msg);
                return new BadRequestObjectResult(msg);
            }

            var workerLabelsCollection = new List<WorkerLabels>();

            foreach (var workerLabels in workerLabelsRaw)
            {
                var res = (Dictionary<string, object>)workerLabels;
                var workerId = (string)res.GetValueOrDefault("workerId");
                var _labels = (Dictionary<string, object>)res.GetValueOrDefault("workerLabels");

                workerLabelsCollection.Add(new WorkerLabels()
                {
                    WorkerId = workerId,
                    Labels = _labels,
                });

            }

            var workerScores =
                await OverlappingLabelMatchScorer.GetScoreAsync(workerLabelsCollection.Select(x => new KeyValuePair<string, Dictionary<string, object>>(x.WorkerId, x.Labels)).ToList(), jobLabels);

            var result = workerScores.Select(x => x.Value).ToList();
            return new OkObjectResult(result.First());
        }

        private static Dictionary<string, object>? ReadContent(string requestContent)
        {
            var doc = JsonDocument.Parse(requestContent);
            var objenum = doc.RootElement.EnumerateObject();
            var result = new Dictionary<string, object>();
            while (objenum.MoveNext())
            {
                result.Add(objenum.Current.Name, ConvertJsonElement(objenum.Current.Value, 0));
            }

            return result;
        }

        private static object? ConvertJsonElement(JsonElement element, int depth)
        {
            if (depth > MaxDepth)
                throw new JsonException("Max recursion depth exeeded.");

            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    var objenum = element.EnumerateObject();
                    var obj = new Dictionary<string, object>();
                    while (objenum.MoveNext())
                    {
                        obj.Add(objenum.Current.Name, ConvertJsonElement(objenum.Current.Value, depth + 1));
                    }

                    return obj;
                case JsonValueKind.Array:
                    var arrenum = element.EnumerateArray();
                    var arr = new List<object>();
                    while (arrenum.MoveNext())
                    {
                        arr.Add(ConvertJsonElement(arrenum.Current, depth + 1));
                    }

                    return arr;
                case JsonValueKind.String:
                    return element.GetString();
                case JsonValueKind.Number:
                    return element.GetDecimal();
                case JsonValueKind.False:
                    return false;
                case JsonValueKind.True:
                    return true;
            }

            return null;
        }
    }
}

```

The following payload is sent to Contoso's  Azure function

**Input**
```json
{
    "parameters": {
        "jobLabels": {
            "Key1": "Label1"
        },
        "workerLabelsCollection": [
            {
                "workerId": "WorkerId1",
                "workerLabels": {
                    "Key1": "Label1"
                }
            }
        ]
    }
}
```

**Output**
```markdown
1.0

Score of 1.0 is returned as response since there is an overlap of exactly 1 key-value pair between 'jobLabels' and 'workerLabels'
```

## Distribute offers based on Best Worker Mode
Now that the Azure function app is ready, let us create an instance of **BestWorkerDistribution** mode using Router SDK.

```csharp
    // ----- initialize router client
    // setup distribution policy
    var bestWorkerMode = new BestWorkerMode(
        new AzureFunctionRule("<insert azure function url>"),
        new List<ScoringRuleParameterSelector>()
        {
            ScoringRuleParameterSelector.JobLabels, 
            ScoringRuleParameterSelector.WorkerLabelsCollection
        }, 
        minConcurrentOffers:1, 
        maxConcurrentOffers:1); // only 1 offer will be sent out


    var bestWorkerDistributionPolicyReponse = await client.SetDistributionPolicyAsync(
        "BestWorkerByOverlap",
        TimeSpan.FromMinutes(1),
        bestWorkerMode,
        "best worker distribution policy with azure function");
    var bestWorkerDistributionPolicy = bestWorkerDistributionPolicyReponse.Value;

    // Setup channel
    var upsertChannelResponse = await client.SetChannelAsync("ITSupport");
    var upsertChannel = upsertChannelResponse.Value;

    // Setup queue
    var queueLabels = new LabelCollection()
    {
        ["region"] = "NAM",
        ["country"] = "CAN",
        ["queueType"] = "Escalation Queue"
    };

    var upsertQueueResponse = await client.SetQueueAsync("ITSupportEscalation", bestWorkerDistributionPolicy.Id, labels: queueLabels);
    var upsertQueue = upsertQueueResponse.Value;

    // Register workers
    // --- create correct queue assignments
    var queueAssignments = new List<QueueAssignment>()
    {
        new QueueAssignment(upsertQueue.Id)
    };
    var worker1Id = "Bob";
    var worker1Labels = new LabelCollection()
    {
        ["region"] = "NAM",
        ["country"] = "CAN",
        ["lang"] = "en"
    };

    var worker2Id = "Susan";
    var worker2Labels = new LabelCollection()
    {
        ["region"] = "NAM",
        ["country"] = "CAN",
        ["lang"] = "en",
        ["en"] = 10
    };

    // Same worker capacity for both workers
    var workerTotalCapacity = 100;

    // Both workers associated with same channel with equal capacityCostPerJob
    var workerChannelConfigList = new List<ChannelConfiguration>()
    {
        new ChannelConfiguration(upsertChannel.Id, 10)
    };

    // --- Register worker 1
    var registeredWorker1 = await client.RegisterWorkerAsync(
        worker1Id,
        workerTotalCapacity,
        new List<string>() {upsertQueue.Id},
        worker1Labels,
        workerChannelConfigList);

    // --- Register worker 2
    var registeredWorker2 = await client.RegisterWorkerAsync(
        worker2Id,
        workerTotalCapacity,
        new List<string>() { upsertQueue.Id },
        worker2Labels,
        workerChannelConfigList);


    // Create job
    // --- Create job labels
    var jobLabels = new LabelCollection()
    {
        ["region"] = "NAM",
        ["country"] = "CAN",
        ["lang"] = "en",
        ["en"] = 10
    };

    var job = await client.CreateJobAsync(
        upsertChannel.Id,
        upsertQueue.Id,
        priority: 10,
        labels: jobLabels);
```

**Output**
As shown below from the snippet, Susan is made an offer.

:::image type="content" source="../media/router/acs-router-azure-function-best-worker-example.png" alt-text="Diagram showing Communication Services' Job Router Routing offer using best worker distribution with Azure Function Rule.":::



## See also

- [Router Rule concepts](router-rule-concepts.md)