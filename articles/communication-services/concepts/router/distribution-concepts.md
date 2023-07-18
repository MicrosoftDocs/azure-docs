---
title: Distribution mode concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router distribution mode concepts.
author: williamzhao
manager: bgao
services: azure-communication-services

ms.author: williamzhao
ms.date: 05/06/2022
ms.topic: conceptual
ms.service: azure-communication-services
---

# Distribution modes

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

When creating a distribution policy, we specify one of the following distribution modes to define the strategy to use when distributing jobs to workers:

## Round robin mode

Jobs will be distributed in a circular fashion such that each available worker will receive jobs in sequence.

## Longest idle mode

Jobs will be distributed to the worker that is least utilized first.  If there's a tie, we'll pick the worker that has been available for the longer time.  Utilization is calculated as a `Load Ratio` by the following algorithm:

Load Ratio = Aggregate of capacity consumed by all jobs assigned to the worker / Total capacity of the worker

### Example

Assume that each `chat` job has been configured to consume one capacity for a worker.  A new chat job is queued into Job Router and the following workers are available to take the job:

```text
Worker A:
TotalCapacity = 5
ConsumedScore = 3 (Currently handling 3 chats)
LoadRatio = 3 / 5 = 0.6
LastAvailable: 5 mins ago

Worker B:
TotalCapacity = 4
ConsumedScore = 3 (Currently handling 3 chats)
LoadRatio = 3 / 4 = 0.75
LastAvailable: 3 min ago

Worker C:
TotalCapacity = 5
ConsumedScore = 3 (Currently handling 3 chats)
LoadRatio = 3 / 5 = 0.6
LastAvailable: 7 min ago

Worker D:
TotalCapacity = 3
ConsumedScore = 0 (Currently idle)
LoadRatio = 0 / 4 = 0
LastAvailable: 2 min ago

Workers would be matched in order: D, C, A, B
```

Worker D has the lowest load ratio (0), so Worker D will be offered the job first.  Workers A and C are tied with the same load ratio (0.6).  However, Worker C has been available for a longer time (7 minutes ago) than Worker A (5 minutes ago), so Worker C will be matched before Worker A.  Finally, Worker B will be matched last since Worker B has the highest load ratio (0.75).

## Best worker mode

The workers that are best able to handle the job are picked first.  The logic to rank Workers can be customized, with an expression or Azure function to compare two workers by specifying a Scoring Rule. [See example](../../how-tos/router-sdk/customize-worker-scoring.md)

When a Scoring Rule isn't provided, this distribution mode will use the default scoring method instead, which evaluates workers based on how the job's labels and selectors match with the worker's labels.  The algorithms are outlined below.

### Default label matching

For calculating a score based on the job's labels, we increment the `Match Score` by 1 for every worker label that matches a corresponding label on the job and then divide by the total number of labels on the job. Therefore, the more labels that matched, the higher a worker's `Match Score`.  The final `Match Score` will always be a value between 0 and 1.

#### Example

Job 1:

```json
{
  "labels": {
    { "language": "english" },
    { "department": "sales" }
  }
}
```

Worker A:

```json
{
  "labels": {
    { "language": "english" },
    { "department": "sales" }
  }
}
```

Worker B:

```json
{
  "labels": {
    { "language": "english" }
  }
}
```

Worker C:

```json
{
  "labels": {
    { "language": "english" },
    { "department": "support" }
  }
}
```

Calculation:

```
Worker A's match score = 1 (for matching english language label) + 1 (for matching department sales label) / 2 (total number of labels) = 1
Worker B's match score = 1 (for matching english language label) / 2 (total number of labels) = 0.5
Worker C's match score = 1 (for matching english language label) / 2 (total number of labels) = 0.5
```

Worker A would be matched first.  Next, Worker B or Worker C would be matched, depending on who was available for a longer time, since the match score is tied.

### Default worker selector matching

In the case where the job also contains worker selectors, we'll calculate the `Match Score` based on the `LabelOperator` of that worker selector.

#### Equal/notEqual label operators

If the worker selector has the `LabelOperator` `Equal` or `NotEqual`, we increment the score by 1 for each job label that matches that worker selector, in a similar manner as the `Label Matching` above.

##### Example

Job 2:

```json
{
  "workerSelectors": [
    { "key": "department", "labelOperator": "equals", "value": "billing" },
    { "key": "segment", "labelOperator": "notEquals", "department": "vip" }
  ]
}
```

Worker D:

```json
{
  "labels": {
    { "department": "billing" },
    { "segment": "vip" }
  }
}
```

Worker E:

```json
{
  "labels": {
    { "department": "billing" }
  }
}
```

Worker F:

```json
{
  "labels": {
    { "department": "sales" },
    { "segment": "new" }
  }
}
```

Calculation:

```text
Worker D's match score = 1 (for matching department selector) / 2 (total number of worker selectors) = 0.5
Worker E's match score = 1 (for matching department selector) + 1 (for matching segment not equal to vip) / 2 (total number of worker selectors) = 1
Worker F's match score = 1 (for segment not equal to vip) / 2 (total number of labels) = 0.5
```

Worker E would be matched first.  Next, Worker D or Worker F would be matched, depending on who was available for a longer time, since the match score is tied.

#### Other label operators

For worker selectors using operators that compare by magnitude (`GreaterThan`/`GreaterThanEqual`/`LessThan`/`LessThanEqual`), we'll increment the worker's `Match Score` by an amount calculated using the logistic function (See Fig 1).  The calculation is based on how much the worker's label value exceeds the worker selector's value or a lesser amount if it doesn't exceed the worker selector's value. Therefore, the more worker selector values the worker exceeds, and the greater the degree to which it does so, the higher a worker's score will be.

:::image type="content" source="../media/router/distribution-concepts/logistic-function.png" alt-text="Diagram that shows logistic function.":::

Fig 1. Logistic function

The following function is used for GreaterThan or GreaterThanEqual operators:

```text
MatchScore(x) = 1 / (1 + e^(-x)) where x = (labelValue - selectorValue) / selectorValue
```

The following function is used for LessThan or LessThanEqual operators:

```text
MatchScore(x) = 1 / (1 + e^(-x)) where x = (selectorValue - labelValue) / selectorValue
```

#### Example

Job 3:

```json
{
  "workerSelectors": [
    { "key": "language", "operator": "equals", "value": "french" },
    { "key": "sales", "operator": "greaterThanEqual", "value": 10 },
    { "key": "cost", "operator": "lessThanEqual", "value": 10 }
  ]
}
```

Worker G:

```json
{
  "labels": {
    { "language": "french" },
    { "sales": 10 },
    { "cost": 10 }
  }
}
```

Worker H:

```json
{
  "labels": {
    { "language": "french" },
    { "sales": 15 },
    { "cost": 10 }
  }
}
```

Worker I:

```json
{
  "labels": {
    { "language": "french" },
    { "sales": 10 },
    { "cost": 9 }
  }
}
```

Calculation:

```text
Worker G's match score = (1 + 1 / (1 + e^-((10 - 10) / 10)) + 1 / (1 + e^-((10 - 10) / 10))) / 3 = 0.667
Worker H's match score = (1 + 1 / (1 + e^-((15 - 10) / 10)) + 1 / (1 + e^-((10 - 10) / 10))) / 3 = 0.707
Worker I's match score = (1 + 1 / (1 + e^-((10 - 10) / 10)) + 1 / (1 + e^-((10 - 9) / 10))) / 3 = 0.675
```

All three workers match the worker selectors on the job and are eligible to work on it.  However, we can see that Worker H exceeds the "sales" worker selector's value by a margin of 5.  Meanwhile, Worker I only exceeds the cost worker selector's value by a margin of 1.  Worker G doesn't exceed any of the worker selector's values at all.  Therefore, Worker H would be matched first, followed by Worker I and finally Worker G would be matched last.
