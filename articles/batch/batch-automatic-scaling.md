---
title: Autoscale compute nodes in an Azure Batch pool
description: Enable automatic scaling on an Azure Batch cloud pool to dynamically adjust the number of compute nodes in the pool.
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: H1Hack27Feb2017, fasttrack-edit, devx-track-csharp
---

# Create a formula to automatically scale compute nodes in a Batch pool

Azure Batch can automatically scale pools based on parameters that you define, saving you time and money. With automatic scaling, Batch dynamically adds nodes to a pool as task demands increase, and removes compute nodes as task demands decrease.

To enable automatic scaling on a pool of compute nodes, you associate the pool with an *autoscale formula* that you define. The Batch service uses the autoscale formula to determine how many nodes are needed to execute your workload. These nodes can be dedicated nodes or [Azure Spot nodes](batch-spot-vms.md). Batch periodically reviews service metrics data and uses it to adjust the number of nodes in the pool based on your formula and at an interval that you define.

You can enable automatic scaling when you create a pool, or apply it to an existing pool. Batch lets you evaluate your formulas before assigning them to pools and to monitor the status of automatic scaling runs. Once you configure a pool with automatic scaling, you can make changes to the formula later.

> [!IMPORTANT]
> When you create a Batch account, you can specify the [pool allocation mode](accounts.md), which determines whether pools are allocated in a Batch service subscription (the default) or in your user subscription. If you created your Batch account with the default Batch service configuration, then your account is limited to a maximum number of cores that can be used for processing. The Batch service scales compute nodes only up to that core limit. For this reason, the Batch service might not reach the target number of compute nodes specified by an autoscale formula. To learn how to view and increase your account quotas, see [Quotas and limits for the Azure Batch service](batch-quota-limit.md).
>
>If you created your account with user subscription mode, then your account shares in the core quota for the subscription. For more information, see [Virtual Machines limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-virtual-machines-limits) in [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## Autoscale formulas

An autoscale formula is a string value that you define that contains one or more statements. The autoscale formula is assigned to a pool's [autoScaleFormula](/rest/api/batchservice/enable-automatic-scaling-on-a-pool) element (Batch REST) or [CloudPool.AutoScaleFormula](/dotnet/api/microsoft.azure.batch.cloudpool.autoscaleformula) property (Batch .NET). The Batch service uses your formula to determine the target number of compute nodes in the pool for the next interval of processing. The formula string can't exceed 8 KB, can include up to 100 statements that are separated by semicolons, and can include line breaks and comments.

You can think of automatic scaling formulas as a Batch autoscale "language." Formula statements are free-formed expressions that can include both *service-defined variables*, which are defined by the Batch service, and *user-defined variables*. Formulas can perform various operations on these values by using built-in types, operators, and functions. For example, a statement might take the following form:

```
$myNewVariable = function($ServiceDefinedVariable, $myCustomVariable);
```

Formulas generally contain multiple statements that perform operations on values that are obtained in previous statements. For example, first you obtain a value for `variable1`, then pass it to a function to populate `variable2`:

```
$variable1 = function1($ServiceDefinedVariable);
$variable2 = function2($OtherServiceDefinedVariable, $variable1);
```

Include these statements in your autoscale formula to arrive at a target number of compute nodes. Dedicated nodes and Spot nodes each have their own target settings. An autoscale formula can include a target value for dedicated nodes, a target value for Spot nodes, or both.

The target number of nodes might be higher, lower, or the same as the current number of nodes of that type in the pool. Batch evaluates a pool's autoscale formula at specific [automatic scaling intervals](#automatic-scaling-interval). Batch adjusts the target number of each type of node in the pool to the number that your autoscale formula specifies at the time of evaluation.

### Sample autoscale formulas

The following examples show two autoscale formulas, which can be adjusted to work for most scenarios. The variables `startingNumberOfVMs` and `maxNumberofVMs` in the example formulas can be adjusted to your needs.

#### Pending tasks

With this autoscale formula, the pool is initially created with a single VM. The `$PendingTasks` metric defines the number of tasks that are running or queued. The formula finds the average number of pending tasks in the last 180 seconds and sets the `$TargetDedicatedNodes` variable accordingly. The formula ensures that the target number of dedicated nodes never exceeds 25 VMs. As new tasks are submitted, the pool automatically grows. As tasks complete, VMs become free and the autoscaling formula shrinks the pool.

This formula scales dedicated nodes, but can be modified to apply to scale Spot nodes as well.

```
startingNumberOfVMs = 1;
maxNumberofVMs = 25;
pendingTaskSamplePercent = $PendingTasks.GetSamplePercent(180 * TimeInterval_Second);
pendingTaskSamples = pendingTaskSamplePercent < 70 ? startingNumberOfVMs : avg($PendingTasks.GetSample(180 * TimeInterval_Second));
$TargetDedicatedNodes=min(maxNumberofVMs, pendingTaskSamples);
$NodeDeallocationOption = taskcompletion;
```
> [!IMPORTANT]
> Currently, Batch Service has limitations with the resolution of the pending tasks. When a task is added to the job, it's also added into a internal queue used by Batch service for scheduling. If the task is deleted before it can be scheduled, the task might persist within the queue, causing it to still be counted in `$PendingTasks`. This deleted task will eventually be cleared from the queue when Batch gets chance to pull tasks from the queue to schedule with idle nodes in the Batch pool.

#### Preempted nodes

This example creates a pool that starts with 25 Spot nodes. Every time a Spot node is preempted, it's replaced with a dedicated node. As with the first example, the `maxNumberofVMs` variable prevents the pool from exceeding 25 VMs. This example is useful for taking advantage of Spot VMs while also ensuring that only a fixed number of preemptions occur for the lifetime of the pool.

```
maxNumberofVMs = 25;
$TargetDedicatedNodes = min(maxNumberofVMs, $PreemptedNodeCount.GetSample(180 * TimeInterval_Second));
$TargetLowPriorityNodes = min(maxNumberofVMs , maxNumberofVMs - $TargetDedicatedNodes);
$NodeDeallocationOption = taskcompletion;
```

You'll learn more about [how to create autoscale formulas](#write-an-autoscale-formula) and see more [example autoscale formulas](#example-autoscale-formulas) later in this article.

## Variables

You can use both *service-defined* and *user-defined* variables in your autoscale formulas.

The service-defined variables are built in to the Batch service. Some service-defined variables are read-write, and some are read-only.

User-defined variables are variables that you define. In the previous example, `$TargetDedicatedNodes` and `$PendingTasks` are service-defined variables, while `startingNumberOfVMs` and `maxNumberofVMs` are user-defined variables.

> [!NOTE]
> Service-defined variables are always preceded by a dollar sign ($). For user-defined variables, the dollar sign is optional.

The following tables show the read-write and read-only variables defined by the Batch service.

### Read-write service-defined variables

You can get and set the values of these service-defined variables to manage the number of compute nodes in a pool.

| Variable | Description |
| --- | --- |
| $TargetDedicatedNodes |The target number of dedicated compute nodes for the pool. Specified as a target because a pool might not always achieve the desired number of nodes. For example, if the target number of dedicated nodes is modified by an autoscale evaluation before the pool has reached the initial target, the pool might not reach the target. <br><br> A pool in an account created in Batch service mode might not achieve its target if the target exceeds a Batch account node or core quota. A pool in an account created in user subscription mode might not achieve its target if the target exceeds the shared core quota for the subscription.|
| $TargetLowPriorityNodes |The target number of Spot compute nodes for the pool. Specified as a target because a pool might not always achieve the desired number of nodes. For example, if the target number of Spot nodes is modified by an autoscale evaluation before the pool has reached the initial target, the pool might not reach the target. A pool might also not achieve its target if the target exceeds a Batch account node or core quota. <br><br> For more information on Spot compute nodes, see [Use Spot VMs with Batch](batch-spot-vms.md). |
| $NodeDeallocationOption |The action that occurs when compute nodes are removed from a pool. Possible values are:<br>- **requeue**: The default value. Ends tasks immediately and puts them back on the job queue so that they're rescheduled. This action ensures the target number of nodes is reached as quickly as possible. However, it might be less efficient, because any running tasks are interrupted and then must be restarted. <br>- **terminate**: Ends tasks immediately and removes them from the job queue.<br>- **taskcompletion**: Waits for currently running tasks to finish and then removes the node from the pool. Use this option to avoid tasks being interrupted and requeued, wasting any work the task has done.<br>- **retaineddata**: Waits for all the local task-retained data on the node to be cleaned up before removing the node from the pool. |

> [!NOTE]
> The `$TargetDedicatedNodes` variable can also be specified using the alias `$TargetDedicated`. Similarly, the `$TargetLowPriorityNodes` variable can be specified using the alias `$TargetLowPriority`. If both the fully named variable and its alias are set by the formula, the value assigned to the fully named variable takes precedence.

### Read-only service-defined variables

You can get the value of these service-defined variables to make adjustments that are based on metrics from the Batch service.

> [!IMPORTANT]
> Job release tasks aren't currently included in variables that provide task counts, such as `$ActiveTasks` and `$PendingTasks`. Depending on your autoscale formula, this can result in nodes being removed with no nodes available to run job release tasks.

> [!TIP]
> These read-only service-defined variables are *objects* that provide various methods to access data associated with each. For more information, see [Obtain sample data](#obtain-sample-data) later in this article.

| Variable | Description |
| --- | --- |
| $CPUPercent |The average percentage of CPU usage. |
| $ActiveTasks |The number of tasks that are ready to execute but aren't yet executing. This includes all tasks that are in the active state and whose dependencies have been satisfied. Any tasks that are in the active state but whose dependencies haven't been satisfied are excluded from the `$ActiveTasks` count. For a multi-instance task, `$ActiveTasks` includes the number of instances set on the task.|
| $RunningTasks |The number of tasks in a running state. |
| $PendingTasks |The sum of `$ActiveTasks` and `$RunningTasks`. |
| $SucceededTasks |The number of tasks that finished successfully. |
| $FailedTasks |The number of tasks that failed. |
| $TaskSlotsPerNode |The number of task slots that can be used to run concurrent tasks on a single compute node in the pool. |
| $CurrentDedicatedNodes |The current number of dedicated compute nodes. |
| $CurrentLowPriorityNodes |The current number of Spot compute nodes, including any nodes that have been preempted. |
| $UsableNodeCount | The number of usable compute nodes. |
| $PreemptedNodeCount | The number of nodes in the pool that are in a preempted state. |

> [!NOTE]
> Use `$RunningTasks` when scaling based on the number of tasks running at a point in time, and `$ActiveTasks` when scaling based on the number of tasks that are queued up to run.

## Types

Autoscale formulas support the following types:

- double
- doubleVec
- doubleVecList
- string
- timestamp--a compound structure that contains the following members:
  - year
  - month (1-12)
  - day (1-31)
  - weekday (in the format of number; for example, 1 for Monday)
  - hour (in 24-hour number format; for example, 13 means 1 PM)
  - minute (00-59)
  - second (00-59)
- timeinterval
  - TimeInterval_Zero
  - TimeInterval_100ns
  - TimeInterval_Microsecond
  - TimeInterval_Millisecond
  - TimeInterval_Second
  - TimeInterval_Minute
  - TimeInterval_Hour
  - TimeInterval_Day
  - TimeInterval_Week
  - TimeInterval_Year

## Operations

These operations are allowed on the types that are listed in the previous section.

| Operation | Supported operators | Result type |
| --- | --- | --- |
| double *operator* double |+, -, *, / |double |
| double *operator* timeinterval |* |timeinterval |
| doubleVec *operator* double |+, -, *, / |doubleVec |
| doubleVec *operator* doubleVec |+, -, *, / |doubleVec |
| timeinterval *operator* double |*, / |timeinterval |
| timeinterval *operator* timeinterval |+, - |timeinterval |
| timeinterval *operator* timestamp |+ |timestamp |
| timestamp *operator* timeinterval |+ |timestamp |
| timestamp *operator* timestamp |- |timeinterval |
| *operator* double |-, ! |double |
| *operator* timeinterval |- |timeinterval |
| double *operator* double |<, <=, ==, >=, >, != |double |
| string *operator* string |<, <=, ==, >=, >, != |double |
| timestamp *operator* timestamp |<, <=, ==, >=, >, != |double |
| timeinterval *operator* timeinterval |<, <=, ==, >=, >, != |double |
| double *operator* double |&&, &#124;&#124; |double |

Testing a double with a ternary operator (`double ? statement1 : statement2`), results in nonzero as **true**, and zero as **false**.

## Functions

You can use these predefined *functions* when defining an autoscale formula.

| Function | Return type | Description |
| --- | --- | --- |
| avg(doubleVecList) |double |Returns the average value for all values in the doubleVecList. |
| ceil(double) |double |Returns the smallest integer value not less than the double. |
| ceil(doubleVecList) |doubleVec |Returns the component-wise `ceil` of the doubleVecList. |
| floor(double) |double |Returns the largest integer value not greater than the double. |
| floor(doubleVecList) |doubleVec |Returns the component-wise `floor` of the doubleVecList. |
| len(doubleVecList) |double |Returns the length of the vector that is created from the doubleVecList. |
| lg(double) |double |Returns the log base 2 of the double. |
| lg(doubleVecList) |doubleVec |Returns the component-wise `lg` of the doubleVecList. |
| ln(double) |double |Returns the natural log of the double. |
| ln(doubleVecList) |doubleVec |Returns the component-wise `ln` of the doubleVecList. |
| log(double) |double |Returns the log base 10 of the double. |
| log(doubleVecList) |doubleVec |Returns the component-wise `log` of the doubleVecList. |
| max(doubleVecList) |double |Returns the maximum value in the doubleVecList. |
| min(doubleVecList) |double |Returns the minimum value in the doubleVecList. |
| norm(doubleVecList) |double |Returns the two-norm of the vector that is created from the doubleVecList. |
| percentile(doubleVec v, double p) |double |Returns the percentile element of the vector v. |
| rand() |double |Returns a random value between 0.0 and 1.0. |
| range(doubleVecList) |double |Returns the difference between the min and max values in the doubleVecList. |
| round(double) |double |Returns the nearest integer value to the double (in floating-point format), rounding halfway cases away from zero. |
| round(doubleVecList) |doubleVec |Returns the component-wise `round` of the doubleVecList. |
| std(doubleVecList) |double |Returns the sample standard deviation of the values in the doubleVecList. |
| stop() | |Stops evaluation of the autoscaling expression. |
| sum(doubleVecList) |double |Returns the sum of all the components of the doubleVecList. |
| time(string dateTime="") |timestamp |Returns the time stamp of the current time if no parameters are passed, or the time stamp of the dateTime string if that is passed. Supported dateTime formats are W3C-DTF and RFC 1123. |
| val(doubleVec v, double i) |double |Returns the value of the element that is at location i in vector v, with a starting index of zero. |

Some of the functions that are described in the previous table can accept a list as an argument. The comma-separated list is any combination of *double* and *doubleVec*. For example:

`doubleVecList := ( (double | doubleVec)+(, (double | doubleVec) )* )?`

The *doubleVecList* value is converted to a single *doubleVec* before evaluation. For example, if `v = [1,2,3]`, then calling `avg(v)` is equivalent to calling `avg(1,2,3)`. Calling `avg(v, 7)` is equivalent to calling `avg(1,2,3,7)`.

## Metrics

You can use both resource and task metrics when you define a formula. You adjust the target number of dedicated nodes in the pool based on the metrics data that you obtain and evaluate. For more information on each metric, see the [Variables](#variables) section.

| Metric   | Description  |
|----------|--------------|
| Resource | Resource metrics are based on the CPU, the bandwidth, the memory usage of compute nodes, and the number of nodes.<br><br>These service-defined variables are useful for making adjustments based on node count:<br>- $TargetDedicatedNodes <br>- $TargetLowPriorityNodes <br>- $CurrentDedicatedNodes <br>- $CurrentLowPriorityNodes <br>- $PreemptedNodeCount <br>- $UsableNodeCount <br><br>These service-defined variables are useful for making adjustments based on node resource usage: <br>- $CPUPercent |
| Task     | Task metrics are based on the status of tasks, such as Active, Pending, and Completed. The following service-defined variables are useful for making pool-size adjustments based on task metrics: <br>- $ActiveTasks <br>- $RunningTasks <br>- $PendingTasks <br>- $SucceededTasks <br>- $FailedTasks |

## Obtain sample data

The core operation of an autoscale formula is to obtain task and resource metrics data (samples), and then adjust pool size based on that data. As such, it's important to have a clear understanding of how autoscale formulas interact with samples.

### Methods

Autoscale formulas act on samples of metric data provided by the Batch service. A formula grows or shrinks the pool compute nodes based on the values that it obtains. Service-defined variables are objects that provide methods to access data that's associated with that object. For example, the following expression shows a request to get the last five minutes of CPU usage:

```
$CPUPercent.GetSample(TimeInterval_Minute * 5)
```

The following methods can be used to obtain sample data about service-defined variables.

| Method | Description |
| --- | --- |
| GetSample() |The `GetSample()` method returns a vector of data samples.<br><br>A sample is 30 seconds worth of metrics data. In other words, samples are obtained every 30 seconds. But as noted below, there's a delay between when a sample is collected and when it's available to a formula. As such, not all samples for a given time period might be available for evaluation by a formula. <br><br>- `doubleVec GetSample(double count)`: Specifies the number of samples to obtain from the most recent samples that were collected. `GetSample(1)` returns the last available sample. For metrics like `$CPUPercent`, however, `GetSample(1)` shouldn't be used, because it's impossible to know *when* the sample was collected. It could be recent, or, because of system issues, it might be much older. In such cases, it's better to use a time interval as shown below.<br><br>- `doubleVec GetSample((timestamp or timeinterval) startTime [, double samplePercent])`: Specifies a time frame for gathering sample data. Optionally, it also specifies the percentage of samples that must be available in the requested time frame. For example, `$CPUPercent.GetSample(TimeInterval_Minute * 10)` would return 20 samples if all samples for the last 10 minutes are present in the `CPUPercent` history. If the last minute of history wasn't available, only 18 samples would be returned. In this case `$CPUPercent.GetSample(TimeInterval_Minute * 10, 95)` would fail because only 90 percent of the samples are available, but `$CPUPercent.GetSample(TimeInterval_Minute * 10, 80)` would succeed.<br><br>- `doubleVec GetSample((timestamp or timeinterval) startTime, (timestamp or timeinterval) endTime [, double samplePercent])`: Specifies a time frame for gathering data, with both a start time and an end time. As mentioned above, there's a delay between when a sample is collected and when it becomes available to a formula. Consider this delay when you use the `GetSample` method. See `GetSamplePercent` below. |
| GetSamplePeriod() |Returns the period of samples that were taken in a historical sample data set. |
| Count() |Returns the total number of samples in the metrics history. |
| HistoryBeginTime() |Returns the time stamp of the oldest available data sample for the metric. |
| GetSamplePercent() |Returns the percentage of samples that are available for a given time interval. For example, `doubleVec GetSamplePercent( (timestamp or timeinterval) startTime [, (timestamp or timeinterval) endTime] )`. Because the `GetSample` method fails if the percentage of samples returned is less than the `samplePercent` specified, you can use the `GetSamplePercent` method to check first. Then you can perform an alternate action if insufficient samples are present, without halting the automatic scaling evaluation. |

### Samples

The Batch service periodically takes samples of task and resource metrics and makes them available to your autoscale formulas. These samples are recorded every 30 seconds by the Batch service. However, there's typically a delay between when those samples were recorded and when they're made available to (and read by) your autoscale formulas. Additionally, samples might not be recorded for a particular interval because of factors such as network or other infrastructure issues.

### Sample percentage

When `samplePercent` is passed to the `GetSample()` method or the `GetSamplePercent()` method is called, *percent* refers to a comparison between the total possible number of samples recorded by the Batch service and the number of samples that are available to your autoscale formula.

Let's look at a 10-minute time span as an example. Because samples are recorded every 30 seconds within that 10-minute time span, the maximum total number of samples recorded by Batch would be 20 samples (2 per minute). However, due to the inherent latency of the reporting mechanism and other issues within Azure, there might be only 15 samples that are available to your autoscale formula for reading. So, for example, for that 10-minute period, only 75 percent of the total number of samples recorded might be available to your formula.

### GetSample() and sample ranges

Your autoscale formulas grow and shrink your pools by adding or removing nodes. Because nodes cost you money, be sure that your formulas use an intelligent method of analysis that's based on sufficient data. It's recommended that you use a trending-type analysis in your formulas. This type grows and shrinks your pools based on a range of collected samples.

To do so, use `GetSample(interval look-back start, interval look-back end)` to return a vector of samples:

```
$runningTasksSample = $RunningTasks.GetSample(1 * TimeInterval_Minute, 6 * TimeInterval_Minute);
```

When Batch evaluates the above line, it returns a range of samples as a vector of values. For example:

```
$runningTasksSample=[1,1,1,1,1,1,1,1,1,1];
```

After you collect the vector of samples, you can then use functions like `min()`, `max()`, and `avg()` to derive meaningful values from the collected range.

To exercise extra caution, you can force a formula evaluation to fail if less than a certain sample percentage is available for a particular time period. When you force a formula evaluation to fail, you instruct Batch to cease further evaluation of the formula if the specified percentage of samples isn't available. In this case, no change is made to the pool size. To specify a required percentage of samples for the evaluation to succeed, specify it as the third parameter to `GetSample()`. Here, a requirement of 75 percent of samples is specified:

```
$runningTasksSample = $RunningTasks.GetSample(60 * TimeInterval_Second, 120 * TimeInterval_Second, 75);
```

Because there might be a delay in sample availability, you should always specify a time range with a look-back start time that's older than one minute. It takes approximately one minute for samples to propagate through the system, so samples in the range `(0 * TimeInterval_Second, 60 * TimeInterval_Second)` might not be available. Again, you can use the percentage parameter of `GetSample()` to force a particular sample percentage requirement.

> [!IMPORTANT]
> We strongly recommend that you **avoid relying *only* on `GetSample(1)` in your autoscale formulas**. This is because `GetSample(1)` essentially says to the Batch service, "Give me the last sample you had, no matter how long ago you retrieved it." Since it's only a single sample, and it might be an older sample, it might not be representative of the larger picture of recent task or resource state. If you do use `GetSample(1)`, make sure that it's part of a larger statement and not the only data point that your formula relies on.

## Write an autoscale formula

You build an autoscale formula by forming statements that use the above components, then combine those statements into a complete formula. In this section, you create an example autoscale formula that can perform real-world scaling decisions and make adjustments.

First, let's define the requirements for our new autoscale formula. The formula should:

- Increase the target number of dedicated compute nodes in a pool if CPU usage is high.
- Decrease the target number of dedicated compute nodes in a pool when CPU usage is low.
- Always restrict the maximum number of dedicated nodes to 400.
- When reducing the number of nodes, don't remove nodes that are running tasks; if necessary, wait until tasks have finished before removing nodes.

The first statement in the formula increases the number of nodes during high CPU usage. You define a statement that populates a user-defined variable (`$totalDedicatedNodes`) with a value that is 110 percent of the current target number of dedicated nodes, but only if the minimum average CPU usage during the last 10 minutes was above 70 percent. Otherwise, it uses the value for the current number of dedicated nodes.

```
$totalDedicatedNodes =
    (min($CPUPercent.GetSample(TimeInterval_Minute * 10)) > 0.7) ?
    ($CurrentDedicatedNodes * 1.1) : $CurrentDedicatedNodes;
```

To decrease the number of dedicated nodes during low CPU usage, the next statement in the formula sets the same `$totalDedicatedNodes` variable to 90 percent of the current target number of dedicated nodes, if average CPU usage in the past 60 minutes was under 20 percent. Otherwise, it uses the current value of `$totalDedicatedNodes` populated in the statement above.

```
$totalDedicatedNodes =
    (avg($CPUPercent.GetSample(TimeInterval_Minute * 60)) < 0.2) ?
    ($CurrentDedicatedNodes * 0.9) : $totalDedicatedNodes;
```

Now, limit the target number of dedicated compute nodes to a maximum of 400.

```
$TargetDedicatedNodes = min(400, $totalDedicatedNodes);
```

Finally, ensure that nodes aren't removed until their tasks are finished.

```
$NodeDeallocationOption = taskcompletion;
```

Here's the complete formula:

```
$totalDedicatedNodes =
    (min($CPUPercent.GetSample(TimeInterval_Minute * 10)) > 0.7) ?
    ($CurrentDedicatedNodes * 1.1) : $CurrentDedicatedNodes;
$totalDedicatedNodes =
    (avg($CPUPercent.GetSample(TimeInterval_Minute * 60)) < 0.2) ?
    ($CurrentDedicatedNodes * 0.9) : $totalDedicatedNodes;
$TargetDedicatedNodes = min(400, $totalDedicatedNodes);
$NodeDeallocationOption = taskcompletion;
```

> [!NOTE]
> If you choose, you can include both comments and line breaks in formula strings. Also be aware that missing semicolons might result in evaluation errors.

## Automatic scaling interval

By default, the Batch service adjusts a pool's size according to its autoscale formula every 15 minutes. This interval is configurable by using the following pool properties:

- [CloudPool.AutoScaleEvaluationInterval](/dotnet/api/microsoft.azure.batch.cloudpool.autoscaleevaluationinterval) (Batch .NET)
- [autoScaleEvaluationInterval](/rest/api/batchservice/enable-automatic-scaling-on-a-pool) (REST API)

The minimum interval is five minutes, and the maximum is 168 hours. If an interval outside this range is specified, the Batch service returns a Bad Request (400) error.

> [!NOTE]
> Autoscaling is not currently intended to respond to changes in less than a minute, but rather is intended to adjust the size of your pool gradually as you run a workload.

## Create an autoscale-enabled pool with Batch SDKs

Pool autoscaling can be configured using any of the [Batch SDKs](batch-apis-tools.md#azure-accounts-for-batch-development), the [Batch REST API](/rest/api/batchservice/) [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md), and the [Batch CLI](batch-cli-get-started.md). In this section, you can see examples for both .NET and Python.

### .NET

To create a pool with autoscaling enabled in .NET, follow these steps:

1. Create the pool with [BatchClient.PoolOperations.CreatePool](/dotnet/api/microsoft.azure.batch.pooloperations.createpool).
1. Set the [CloudPool.AutoScaleEnabled](/dotnet/api/microsoft.azure.batch.cloudpool.autoscaleenabled) property to **true**.
1. Set the [CloudPool.AutoScaleFormula](/dotnet/api/microsoft.azure.batch.cloudpool.autoscaleformula) property with your autoscale formula.
1. (Optional) Set the [CloudPool.AutoScaleEvaluationInterval](/dotnet/api/microsoft.azure.batch.cloudpool.autoscaleevaluationinterval) property (default is 15 minutes).
1. Commit the pool with [CloudPool.Commit](/dotnet/api/microsoft.azure.batch.cloudpool.commit) or [CommitAsync](/dotnet/api/microsoft.azure.batch.cloudpool.commitasync).

The following example creates an autoscale-enabled pool in .NET. The pool's autoscale formula sets the target number of dedicated nodes to 5 on Mondays, and to 1 on every other day of the week. The [automatic scaling interval](#automatic-scaling-interval) is set to 30 minutes. In this and the other C# snippets in this article, `myBatchClient` is a properly initialized instance of the [BatchClient](/dotnet/api/microsoft.azure.batch.batchclient) class.

```csharp
CloudPool pool = myBatchClient.PoolOperations.CreatePool(
                    poolId: "mypool",
                    virtualMachineSize: "standard_d1_v2",
                    VirtualMachineConfiguration: new VirtualMachineConfiguration(
                        imageReference: new ImageReference(
                                            publisher: "MicrosoftWindowsServer",
                                            offer: "WindowsServer",
                                            sku: "2019-datacenter-core",
                                            version: "latest"),
                        nodeAgentSkuId: "batch.node.windows amd64");
pool.AutoScaleEnabled = true;
pool.AutoScaleFormula = "$TargetDedicatedNodes = (time().weekday == 1 ? 5:1);";
pool.AutoScaleEvaluationInterval = TimeSpan.FromMinutes(30);
await pool.CommitAsync();
```

> [!IMPORTANT]
> When you create an autoscale-enabled pool, don't specify the *targetDedicatedNodes* parameter or the *targetLowPriorityNodes* parameter on the call to `CreatePool`. Instead, specify the `AutoScaleEnabled` and `AutoScaleFormula` properties on the pool. The values for these properties determine the target number of each type of node.
>
> To manually resize an autoscale-enabled pool (for example, with [BatchClient.PoolOperations.ResizePoolAsync](/dotnet/api/microsoft.azure.batch.pooloperations.resizepoolasync)), you must first disable automatic scaling on the pool, then resize it.

> [!TIP]
> For more examples of using the .NET SDK, see the [Batch .NET Quickstart repository](https://github.com/Azure-Samples/batch-dotnet-quickstart) on GitHub.

### Python

To create an autoscale-enabled pool with the Python SDK:

1. Create a pool and specify its configuration.
1. Add the pool to the service client.
1. Enable autoscale on the pool with a formula you write.

The following example illustrates these steps.

```python
# Create a pool; specify configuration
new_pool = batch.models.PoolAddParameter(
    id="autoscale-enabled-pool",
    virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
        image_reference=batchmodels.ImageReference(
          publisher="Canonical",
          offer="UbuntuServer",
          sku="20.04-LTS",
          version="latest"
            ),
        node_agent_sku_id="batch.node.ubuntu 20.04"),
    vm_size="STANDARD_D1_v2",
    target_dedicated_nodes=0,
    target_low_priority_nodes=0
)
batch_service_client.pool.add(new_pool) # Add the pool to the service client

formula = """$curTime = time();
             $workHours = $curTime.hour >= 8 && $curTime.hour < 18;
             $isWeekday = $curTime.weekday >= 1 && $curTime.weekday <= 5;
             $isWorkingWeekdayHour = $workHours && $isWeekday;
             $TargetDedicated = $isWorkingWeekdayHour ? 20:10;""";

# Enable autoscale; specify the formula
response = batch_service_client.pool.enable_auto_scale(pool_id, auto_scale_formula=formula,
                                            auto_scale_evaluation_interval=datetime.timedelta(minutes=10),
                                            pool_enable_auto_scale_options=None,
                                            custom_headers=None, raw=False)
```

> [!TIP]
> For more examples of using the Python SDK, see the [Batch Python Quickstart repository](https://github.com/Azure-Samples/batch-python-quickstart) on GitHub.

## Enable autoscaling on an existing pool

Each Batch SDK provides a way to enable automatic scaling. For example:

- [BatchClient.PoolOperations.EnableAutoScaleAsync](/dotnet/api/microsoft.azure.batch.pooloperations.enableautoscaleasync) (Batch .NET)
- [Enable automatic scaling on a pool](/rest/api/batchservice/enable-automatic-scaling-on-a-pool) (REST API)

When you enable autoscaling on an existing pool, keep in mind:

- If autoscaling is currently disabled on the pool, you must specify a valid autoscale formula when you issue the request. You can optionally specify an automatic scaling interval. If you don't specify an interval, the default value of 15 minutes is used.
- If autoscaling is currently enabled on the pool, you can specify a new formula, a new interval, or both. You must specify at least one of these properties.
  - If you specify a new automatic scaling interval, the existing schedule is stopped and a new schedule is started. The new schedule's start time is the time at which the request to enable autoscaling was issued.
  - If you omit either the autoscale formula or interval, the Batch service continues to use the current value of that setting.

> [!NOTE]
> If you specified values for the *targetDedicatedNodes* or *targetLowPriorityNodes* parameters of the `CreatePool` method when you created the pool in .NET, or for the comparable parameters in another language, then those values are ignored when the autoscale formula is evaluated.

This C# example uses the [Batch .NET](/dotnet/api/microsoft.azure.batch) library to enable autoscaling on an existing pool.

```csharp
// Define the autoscaling formula. This formula sets the target number of nodes
// to 5 on Mondays, and 1 on every other day of the week
string myAutoScaleFormula = "$TargetDedicatedNodes = (time().weekday == 1 ? 5:1);";

// Set the autoscale formula on the existing pool
await myBatchClient.PoolOperations.EnableAutoScaleAsync(
    "myexistingpool",
    autoscaleFormula: myAutoScaleFormula);
```

### Update an autoscale formula

To update the formula on an existing autoscale-enabled pool, call the operation to enable autoscaling again with the new formula. For example, if autoscaling is already enabled on `myexistingpool` when the following .NET code is executed, its autoscale formula is replaced with the contents of `myNewFormula`.

```csharp
await myBatchClient.PoolOperations.EnableAutoScaleAsync(
    "myexistingpool",
    autoscaleFormula: myNewFormula);
```

### Update the autoscale interval

To update the autoscale evaluation interval of an existing autoscale-enabled pool, call the operation to enable autoscaling again with the new interval. For example, to set the autoscale evaluation interval to 60 minutes for a pool that's already autoscale-enabled in .NET:

```csharp
await myBatchClient.PoolOperations.EnableAutoScaleAsync(
    "myexistingpool",
    autoscaleEvaluationInterval: TimeSpan.FromMinutes(60));
```

## Evaluate an autoscale formula

You can evaluate a formula before applying it to a pool. This lets you test the formula's results before you put it into production.

Before you can evaluate an autoscale formula, you must first enable autoscaling on the pool with a valid formula, such as the one-line formula `$TargetDedicatedNodes = 0`. Then, use one of the following to evaluate the formula you want to test:

- [BatchClient.PoolOperations.EvaluateAutoScale](/dotnet/api/microsoft.azure.batch.pooloperations.evaluateautoscale) or [EvaluateAutoScaleAsync](/dotnet/api/microsoft.azure.batch.pooloperations.evaluateautoscaleasync)

    These Batch .NET methods require the ID of an existing pool and a string containing the autoscale formula to evaluate.

- [Evaluate an automatic scaling formula](/rest/api/batchservice/evaluate-an-automatic-scaling-formula)

    In this REST API request, specify the pool ID in the URI, and the autoscale formula in the *autoScaleFormula* element of the request body. The response of the operation contains any error information that might be related to the formula.

The following [Batch .NET](/dotnet/api/microsoft.azure.batch) example evaluates an autoscale formula. If the pool doesn't already use autoscaling, enable it first.

```csharp
// First obtain a reference to an existing pool
CloudPool pool = await batchClient.PoolOperations.GetPoolAsync("myExistingPool");

// If autoscaling isn't already enabled on the pool, enable it.
// You can't evaluate an autoscale formula on a non-autoscale-enabled pool.
if (pool.AutoScaleEnabled == false)
{
    // You need a valid autoscale formula to enable autoscaling on the
    // pool. This formula is valid, but won't resize the pool:
    await pool.EnableAutoScaleAsync(
        autoscaleFormula: "$TargetDedicatedNodes = $CurrentDedicatedNodes;",
        autoscaleEvaluationInterval: TimeSpan.FromMinutes(5));

    // Batch limits EnableAutoScaleAsync calls to once every 30 seconds.
    // Because you want to apply our new autoscale formula below if it
    // evaluates successfully, and you *just* enabled autoscaling on
    // this pool, pause here to ensure you pass that threshold.
    Thread.Sleep(TimeSpan.FromSeconds(31));

    // Refresh the properties of the pool so that we've got the
    // latest value for AutoScaleEnabled
    await pool.RefreshAsync();
}

// You must ensure that autoscaling is enabled on the pool prior to
// evaluating a formula
if (pool.AutoScaleEnabled == true)
{
    // The formula to evaluate - adjusts target number of nodes based on
    // day of week and time of day
    string myFormula = @"
        $curTime = time();
        $workHours = $curTime.hour >= 8 && $curTime.hour < 18;
        $isWeekday = $curTime.weekday >= 1 && $curTime.weekday <= 5;
        $isWorkingWeekdayHour = $workHours && $isWeekday;
        $TargetDedicatedNodes = $isWorkingWeekdayHour ? 20:10;
    ";

    // Perform the autoscale formula evaluation. Note that this code does not
    // actually apply the formula to the pool.
    AutoScaleRun eval =
        await batchClient.PoolOperations.EvaluateAutoScaleAsync(pool.Id, myFormula);

    if (eval.Error == null)
    {
        // Evaluation success - print the results of the AutoScaleRun.
        // This will display the values of each variable as evaluated by the
        // autoscale formula.
        Console.WriteLine("AutoScaleRun.Results: " +
            eval.Results.Replace("$", "\n    $"));

        // Apply the formula to the pool since it evaluated successfully
        await batchClient.PoolOperations.EnableAutoScaleAsync(pool.Id, myFormula);
    }
    else
    {
        // Evaluation failed, output the message associated with the error
        Console.WriteLine("AutoScaleRun.Error.Message: " +
            eval.Error.Message);
    }
}
```

Successful evaluation of the formula shown in this code snippet produces results similar to:

```
AutoScaleRun.Results:
    $TargetDedicatedNodes=10;
    $NodeDeallocationOption=requeue;
    $curTime=2016-10-13T19:18:47.805Z;
    $isWeekday=1;
    $isWorkingWeekdayHour=0;
    $workHours=0
```

## Get information about autoscale runs

It's recommended to periodically check the Batch service's evaluation of your autoscale formula. To do so, get (or refresh) a reference to the pool, then examine the properties of its last autoscale run.

In Batch .NET, the [CloudPool.AutoScaleRun](/dotnet/api/microsoft.azure.batch.cloudpool.autoscalerun) property has several properties that provide information about the latest automatic scaling run performed on the pool:

- [AutoScaleRun.Timestamp](/dotnet/api/microsoft.azure.batch.autoscalerun.timestamp)
- [AutoScaleRun.Results](/dotnet/api/microsoft.azure.batch.autoscalerun.results)
- [AutoScaleRun.Error](/dotnet/api/microsoft.azure.batch.autoscalerun.error)

In the REST API, [information about a pool](/rest/api/batchservice/get-information-about-a-pool) includes the latest automatic scaling run information in the [autoScaleRun](/rest/api/batchservice/get-information-about-a-pool) property.

The following C# example uses the Batch .NET library to print information about the last autoscaling run on pool *myPool*.

```csharp
await Cloud pool = myBatchClient.PoolOperations.GetPoolAsync("myPool");
Console.WriteLine("Last execution: " + pool.AutoScaleRun.Timestamp);
Console.WriteLine("Result:" + pool.AutoScaleRun.Results.Replace("$", "\n  $"));
Console.WriteLine("Error: " + pool.AutoScaleRun.Error);
```

Sample output from the preceding example:

```
Last execution: 10/14/2016 18:36:43
Result:
  $TargetDedicatedNodes=10;
  $NodeDeallocationOption=requeue;
  $curTime=2016-10-14T18:36:43.282Z;
  $isWeekday=1;
  $isWorkingWeekdayHour=0;
  $workHours=0
Error:
```

## Get autoscale run history using pool autoscale events
You can also check automatic scaling history by querying [PoolAutoScaleEvent](batch-pool-autoscale-event.md). Batch emits this event to record each occurrence of autoscale formula evaluation and execution, which can be helpful to troubleshoot potential issues.

Sample event for PoolAutoScaleEvent:

```json
{
    "id": "poolId",
    "timestamp": "2020-09-21T23:41:36.750Z",
    "formula": "...",
    "results": "$TargetDedicatedNodes=10;$NodeDeallocationOption=requeue;$curTime=2016-10-14T18:36:43.282Z;$isWeekday=1;$isWorkingWeekdayHour=0;$workHours=0",
    "error": {
        "code": "",
        "message": "",
        "values": []
    }
}
```

## Example autoscale formulas

Let's look at a few formulas that show different ways to adjust the amount of compute resources in a pool.

### Example 1: Time-based adjustment

Suppose you want to adjust the pool size based on the day of the week and time of day. This example shows how to increase or decrease the number of nodes in the pool accordingly.

The formula first obtains the current time. If it's a weekday (1-5) and within working hours (8 AM to 6 PM), the target pool size is set to 20 nodes. Otherwise, it's set to 10 nodes.

```
$curTime = time();
$workHours = $curTime.hour >= 8 && $curTime.hour < 18;
$isWeekday = $curTime.weekday >= 1 && $curTime.weekday <= 5;
$isWorkingWeekdayHour = $workHours && $isWeekday;
$TargetDedicatedNodes = $isWorkingWeekdayHour ? 20:10;
$NodeDeallocationOption = taskcompletion;
```

`$curTime` can be adjusted to reflect your local time zone by adding `time()` to the product of `TimeZoneInterval_Hour` and your UTC offset. For instance, use `$curTime = time() + (-6 * TimeInterval_Hour);` for Mountain Daylight Time (MDT). Keep in mind that the offset needs to be adjusted at the start and end of daylight saving time, if applicable.

### Example 2: Task-based adjustment

In this C# example, the pool size is adjusted based on the number of tasks in the queue. Both comments and line breaks are included in the formula strings.

```csharp
// Get pending tasks for the past 15 minutes.
$samples = $PendingTasks.GetSamplePercent(TimeInterval_Minute * 15);
// If you have fewer than 70 percent data points, use the last sample point,
// otherwise use the maximum of last sample point and the history average.
$tasks = $samples < 70 ? max(0,$PendingTasks.GetSample(1)) : max( $PendingTasks.GetSample(1), avg($PendingTasks.GetSample(TimeInterval_Minute * 15)));
// If number of pending tasks is not 0, set targetVM to pending tasks, otherwise
// half of current dedicated.
$targetVMs = $tasks > 0? $tasks:max(0, $TargetDedicatedNodes/2);
// The pool size is capped at 20, if target VM value is more than that, set it
// to 20. This value should be adjusted according to your use case.
$TargetDedicatedNodes = max(0, min($targetVMs, 20));
// Set node deallocation mode - let running tasks finish before removing a node
$NodeDeallocationOption = taskcompletion;
```

### Example 3: Accounting for parallel tasks

This C# example adjusts the pool size based on the number of tasks. This formula also takes into account the [TaskSlotsPerNode](/dotnet/api/microsoft.azure.batch.cloudpool.taskslotspernode) value that's been set for the pool. This approach is useful in situations where [parallel task execution](batch-parallel-node-tasks.md) has been enabled on your pool.

```csharp
// Determine whether 70 percent of the samples have been recorded in the past
// 15 minutes; if not, use last sample
$samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
$tasks = $samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1),avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
// Set the number of nodes to add to one-fourth the number of active tasks
// (the TaskSlotsPerNode property on this pool is set to 4, adjust
// this number for your use case)
$cores = $TargetDedicatedNodes * 4;
$extraVMs = (($tasks - $cores) + 3) / 4;
$targetVMs = ($TargetDedicatedNodes + $extraVMs);
// Attempt to grow the number of compute nodes to match the number of active
// tasks, with a maximum of 3
$TargetDedicatedNodes = max(0,min($targetVMs,3));
// Keep the nodes active until the tasks finish
$NodeDeallocationOption = taskcompletion;
```

### Example 4: Setting an initial pool size

This example shows a C# example with an autoscale formula that sets the pool size to a specified number of nodes for an initial time period. After that, it adjusts the pool size based on the number of running and active tasks.

Specifically, this formula does the following:

- Sets the initial pool size to four nodes.
- Doesn't adjust the pool size within the first 10 minutes of the pool's lifecycle.
- After 10 minutes, obtains the max value of the number of running and active tasks within the past 60 minutes.
  - If both values are 0, indicating that no tasks were running or active in the last 60 minutes, the pool size is set to 0.
  - If either value is greater than zero, no change is made.

```csharp
string now = DateTime.UtcNow.ToString("r");
string formula = string.Format(@"
    $TargetDedicatedNodes = {1};
    lifespan         = time() - time(""{0}"");
    span             = TimeInterval_Minute * 60;
    startup          = TimeInterval_Minute * 10;
    ratio            = 50;

    $TargetDedicatedNodes = (lifespan > startup ? (max($RunningTasks.GetSample(span, ratio), $ActiveTasks.GetSample(span, ratio)) == 0 ? 0 : $TargetDedicatedNodes) : {1});
    ", now, 4);
```

## Next steps

- Learn how to [execute multiple tasks simultaneously on the compute nodes in your pool](batch-parallel-node-tasks.md). Along with autoscaling, this can help to lower job duration for some workloads, saving you money.
- Learn how to [query the Azure Batch service efficiently](batch-efficient-list-queries.md).
