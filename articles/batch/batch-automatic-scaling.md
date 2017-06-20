---
title: Automatically scale compute nodes in an Azure Batch pool | Microsoft Docs
description: Enable automatic scaling on a cloud pool to dynamically adjust the number of compute nodes in the pool.
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: tysonn

ms.assetid: c624cdfc-c5f2-4d13-a7d7-ae080833b779
ms.service: batch
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: multiple
ms.date: 06/20/2017
ms.author: tamram
ms.custom: H1Hack27Feb2017

---
# Create an automatic scaling formula for scaling compute nodes in a Batch pool

With automatic scaling, the Azure Batch service can dynamically add or remove compute nodes in a pool based on parameters that you define. You can save both time and money by automatically adjusting the number of compute nodes used by your application. Automatic scaling enables you to add nodes as your job's task demands increase, and remove them when they decrease.

You enable automatic scaling on a pool of compute nodes by associating with it an *autoscale formula* that you define. For example, in Batch .NET, you can use the [PoolOperations.EnableAutoScale][net_enableautoscale] method. The Batch service uses the autoscale formula to determine the number of compute nodes that are needed to execute your workload. Compute nodes may be dedicated nodes or [low-priority nodes](batch-low-pri-vms.md). Batch responds to service metrics data that is collected periodically. Using this metrics data, Batch adjusts the number of compute nodes in the pool based on your formula and at a configurable interval .

You can enable automatic scaling when a pool is created, or on an existing pool. You can also change an existing formula on a pool that is configured for autoscaling. Batch enables you to evaluate your formulas before assigning them to pools and to monitor the status of automatic scaling runs.

This article discusses the various entities that make up your autoscale formulas, including variables, operators, operations, and functions. You'll find out how to obtain various compute resource and task metrics within Batch. You can use these metrics to intelligently adjust your pool's node count based on resource usage and task status. You'll then learn how to construct a formula and enable automatic scaling on a pool by using both the Batch REST and .NET APIs. We'll finish up with a few example formulas.

> [!IMPORTANT]
> Each Azure Batch account is limited to a maximum number of cores (and therefore compute nodes) that can be used for processing. The Batch service creates new nodes only up to that core limit. The Batch service may not reach the target number of compute nodes specified by an autoscale formula. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for information on viewing and increasing your account quotas.
>
>

## Automatic scaling formulas
An automatic scaling formula is a string value that you define that contains one or more statements. The autoscale formula is assigned to a pool's [autoScaleFormula][rest_autoscaleformula] element (Batch REST) or [CloudPool.AutoScaleFormula][net_cloudpool_autoscaleformula] property (Batch .NET). The Batch service uses your formula to determine the target number of compute nodes in the pool for the next interval of processing. The formula string cannot exceed 8 KB in size, can include up to 100 statements that are separated by semicolons, and can include line breaks and comments.

You can think of automatic scaling formulas as using a Batch autoscale "language." Formula statements are free-formed expressions that can include both service-defined variables (variables defined by the Batch service) and user-defined variables (variables that you define). They can perform various operations on these values by using built-in types, operators, and functions. For example, a statement might take the following form:

```
$myNewVariable = function($ServiceDefinedVariable, $myCustomVariable);
```

Formulas generally contain multiple statements that perform operations on values that are obtained in previous statements. For example, first we obtain a value for `variable1`, then pass it to a function to populate `variable2`:

```
$variable1 = function1($ServiceDefinedVariable);
$variable2 = function2($OtherServiceDefinedVariable, $variable1);
```

Include these statements in your autoscale formula in order to arrive at a target number of compute nodes. Dedicated nodes and low-priority nodes each have their own target settings, so that you can define a target for each type of node. An autoscale formula can include a target value for dedicated nodes, a target value for low-priority nodes, or both.

The target number of nodes may be higher, lower, or the same as the current number of nodes of that type in the pool. Batch evaluates a pool's autoscale formula at a specific interval ([automatic scaling intervals](#automatic-scaling-interval) are discussed below). Batch adjusts the target number of each type of node in the pool to the number that your autoscale formula specifies at the time of evaluation.

### Sample autoscale formula

Here is an example of an autoscale formula that can be adjusted to work for most scenarios. The variables `startingNumberOfVMs` and `maxNumberofVMs` in the example formula can be adjusted to your needs. This formula scales dedicated nodes, but can be modified to apply to scale low-priority nodes as well. 

```
startingNumberOfVMs = 1;
maxNumberofVMs = 25;
pendingTaskSamplePercent = $PendingTasks.GetSamplePercent(180 * TimeInterval_Second);
pendingTaskSamples = pendingTaskSamplePercent < 70 ? startingNumberOfVMs : avg($PendingTasks.GetSample(180 * TimeInterval_Second));
$TargetDedicatedNodes=min(maxNumberofVMs, pendingTaskSamples);
```

With this autoscale formula, the pool is initially created with a single VM. The $PendingTasks metric defines the number of tasks that are running or queued. The formula finds the average number of pending tasks in the last 180 seconds and sets the `$TargetDedicatedNodes` variable accordingly. The formula ensures that the target number of dedicated nodes never exceeds 25 VMs. As new tasks are submitted, the pool automatically grows. As tasks complete, VMs become free one by one and the autoscaling formula shrinks the pool.

## Variables
You can use both **service-defined** and **user-defined** variables in your autoscale formulas. The service-defined variables are built in to the Batch service. Some service-defined variables are read-write, and some are read-only. User-defined variables are variables that *you* define. In the example formula shown in the previous section, `$TargetDedicatedNodes` and `$PendingTasks` are service-defined variables. Variables `startingNumberOfVMs` and `maxNumberofVMs` are user-defined variables.

> [!NOTE]
> Service-defined variables are always preceeded by a dollar sign ($). For user-defined variables, the dollar sign is optional.
>
>

The tables below show both read-write and read-only variables that are defined by the Batch service.

You can **get** and **set** the values of these service-defined variables to manage the number of compute nodes in a pool:

| Read-write service-defined variables | Description |
| --- | --- |
| $TargetDedicatedNodes |The **target** number of **dedicated compute nodes** for the pool. The number of nodes is specified as a target because a pool may not always achieve the desired number of nodes. For example, if the target number of nodes is modified again by a subsequent autoscale evaluation before the pool has reached the initial target, the pool may not reach the desired number of nodes. A pool may also not achieve its target if the target exceeds a Batch account node or core quota. |
| $TargetLowPriorityNodes |The **target** number of **low-priority compute nodes** for the pool. For more information on low-priority compute nodes, see [Use low-priority VMs with Batch (Preview)](batch-low-pri-vms.md). |
| $NodeDeallocationOption |The action that occurs when compute nodes are removed from a pool. Possible values are:<ul><li>**requeue**--Terminates tasks immediately and puts them back on the job queue so that they are rescheduled.<li>**terminate**--Terminates tasks immediately and removes them from the job queue.<li>**taskcompletion**--Waits for currently running tasks to finish and then removes the node from the pool.<li>**retaineddata**--Waits for all the local task-retained data on the node to be cleaned up before removing the node from the pool.</ul> |

You can **get** the value of these service-defined variables to make adjustments that are based on metrics from the Batch service:

| Read-only service-defined variables | Description |
| --- | --- |
| $CPUPercent |The average percentage of CPU usage. |
| $WallClockSeconds |The number of seconds consumed. |
| $MemoryBytes |The average number of megabytes used. |
| $DiskBytes |The average number of gigabytes used on the local disks. |
| $DiskReadBytes |The number of bytes read. |
| $DiskWriteBytes |The number of bytes written. |
| $DiskReadOps |The count of read disk operations performed. |
| $DiskWriteOps |The count of write disk operations performed. |
| $NetworkInBytes |The number of inbound bytes. |
| $NetworkOutBytes |The number of outbound bytes. |
| $SampleNodeCount |The count of compute nodes. |
| $ActiveTasks |The number of tasks that are ready to execute but are not yet executing. The $ActiveTasks count includes all tasks that are in the active state and whose dependencies have been satisfied. Tasks that are in the active state but whose dependencies are not satisfied are not included in the $ActiveTasks count.|
| $RunningTasks |The number of tasks in a running state. |
| $PendingTasks |The sum of $ActiveTasks and $RunningTasks. |
| $SucceededTasks |The number of tasks that finished successfully. |
| $FailedTasks |The number of tasks that failed. |
| $CurrentDedicatedNodes |The current number of dedicated compute nodes. |
| $CurrentLowPriorityNodes |The current number of low-priority compute nodes, including any nodes that have been preempted. |
| $PreemptedNodeCount | The number of nodes in the pool that are in a preempted state. |

> [!TIP]
> The read-only, service-defined variables that are shown above are *objects* that provide various methods to access data associated with each. For more information, see [Obtain sample data](#getsampledata) below.
>
>

## Types
These **types** are supported in a formula.

* double
* doubleVec
* doubleVecList
* string
* timestamp--timestamp is a compound structure that contains the following members:

  * year
  * month (1-12)
  * day (1-31)
  * weekday (in the format of number, e.g. 1 for Monday)
  * hour (in 24-hour number format, e.g. 13 means 1 PM)
  * minute (00-59)
  * second (00-59)
* timeinterval

  * TimeInterval_Zero
  * TimeInterval_100ns
  * TimeInterval_Microsecond
  * TimeInterval_Millisecond
  * TimeInterval_Second
  * TimeInterval_Minute
  * TimeInterval_Hour
  * TimeInterval_Day
  * TimeInterval_Week
  * TimeInterval_Year

## Operations
These **operations** are allowed on the types that are listed above.

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
| *operator*double |-, ! |double |
| *operator*timeinterval |- |timeinterval |
| double *operator* double |<, <=, ==, >=, >, != |double |
| string *operator* string |<, <=, ==, >=, >, != |double |
| timestamp *operator* timestamp |<, <=, ==, >=, >, != |double |
| timeinterval *operator* timeinterval |<, <=, ==, >=, >, != |double |
| double *operator* double |&&, &#124;&#124; |double |

When testing a double with a ternary operator (`double ? statement1 : statement2`), nonzero is **true**, and zero is **false**.

## Functions
These predefined **functions** are available for you to use in defining an automatic scaling formula.

| Function | Return type | Description |
| --- | --- | --- |
| avg(doubleVecList) |double |Returns the average value for all values in the doubleVecList. |
| len(doubleVecList) |double |Returns the length of the vector that is created from the doubleVecList. |
| lg(double) |double |Returns the log base 2 of the double. |
| lg(doubleVecList) |doubleVec |Returns the component-wise log base 2 of the doubleVecList. A vec(double) must be explicitly passed for the parameter. Otherwise, the double lg(double) version is assumed. |
| ln(double) |double |Returns the natural log of the double. |
| ln(doubleVecList) |doubleVec |Returns the component-wise log base 2 of the doubleVecList. A vec(double) must be explicitly passed for the parameter. Otherwise, the double lg(double) version is assumed. |
| log(double) |double |Returns the log base 10 of the double. |
| log(doubleVecList) |doubleVec |Returns the component-wise log base 10 of the doubleVecList. A vec(double) must be explicitly passed for the single double parameter. Otherwise, the double log(double) version is assumed. |
| max(doubleVecList) |double |Returns the maximum value in the doubleVecList. |
| min(doubleVecList) |double |Returns the minimum value in the doubleVecList. |
| norm(doubleVecList) |double |Returns the two-norm of the vector that is created from the doubleVecList. |
| percentile(doubleVec v, double p) |double |Returns the percentile element of the vector v. |
| rand() |double |Returns a random value between 0.0 and 1.0. |
| range(doubleVecList) |double |Returns the difference between the min and max values in the doubleVecList. |
| std(doubleVecList) |double |Returns the sample standard deviation of the values in the doubleVecList. |
| stop() | |Stops evaluation of the autoscaling expression. |
| sum(doubleVecList) |double |Returns the sum of all the components of the doubleVecList. |
| time(string dateTime="") |timestamp |Returns the time stamp of the current time if no parameters are passed, or the time stamp of the dateTime string if it is passed. Supported dateTime formats are W3C-DTF and RFC 1123. |
| val(doubleVec v, double i) |double |Returns the value of the element that is at location i in vector v, with a starting index of zero. |

Some of the functions that are described in the table above can accept a list as an argument. The comma-separated list is any combination of *double* and *doubleVec*. For example:

`doubleVecList := ( (double | doubleVec)+(, (double | doubleVec) )* )?`

The *doubleVecList* value is converted to a single *doubleVec* before evaluation. For example, if `v = [1,2,3]`, then calling `avg(v)` is equivalent to calling `avg(1,2,3)`. Calling `avg(v, 7)` is equivalent to calling `avg(1,2,3,7)`.

## <a name="getsampledata"></a>Obtain sample data
Autoscale formulas act on metrics data (samples) that is provided by the Batch service. A formula grows or shrinks pool size based on the values that it obtains from the service. The service-defined variables that are described above are objects that provide various methods to access data that is associated with that object. For example, the following expression shows a request to get the last five minutes of CPU usage:

```
$CPUPercent.GetSample(TimeInterval_Minute * 5)
```

| Method | Description |
| --- | --- |
| GetSample() |The `GetSample()` method returns a vector of data samples.<br/><br/>A sample is 30 seconds worth of metrics data. In other words, samples are obtained every 30 seconds. But as noted below, there is a delay between when a sample is collected and when it is available to a formula. As such, not all samples for a given time period may be available for evaluation by a formula.<ul><li>`doubleVec GetSample(double count)`<br/>Specifies the number of samples to obtain from the most recent samples that were collected.<br/><br/>`GetSample(1)` returns the last available sample. For metrics like `$CPUPercent`, however, this should not be used because it is impossible to know *when* the sample was collected. It might be recent, or, because of system issues, it might be much older. It is better in such cases to use a time interval as shown below.<li>`doubleVec GetSample((timestamp or timeinterval) startTime [, double samplePercent])`<br/>Specifies a time frame for gathering sample data. Optionally, it also specifies the percentage of samples that must be available in the requested time frame.<br/><br/>`$CPUPercent.GetSample(TimeInterval_Minute * 10)` would return 20 samples if all samples for the last ten minutes are present in the CPUPercent history. If the last minute of history was not available, however, only 18 samples would be returned. In this case:<br/><br/>`$CPUPercent.GetSample(TimeInterval_Minute * 10, 95)` would fail because only 90 percent of the samples are available.<br/><br/>`$CPUPercent.GetSample(TimeInterval_Minute * 10, 80)` would succeed.<li>`doubleVec GetSample((timestamp or timeinterval) startTime, (timestamp or timeinterval) endTime [, double samplePercent])`<br/>Specifies a time frame for gathering data, with both a start time and an end time.<br/><br/>As mentioned above, there is a delay between when a sample is collected and when it is available to a formula. This must be considered when you use the `GetSample` method. See `GetSamplePercent` below. |
| GetSamplePeriod() |Returns the period of samples that were taken in a historical sample data set. |
| Count() |Returns the total number of samples in the metric history. |
| HistoryBeginTime() |Returns the time stamp of the oldest available data sample for the metric. |
| GetSamplePercent() |Returns the percentage of samples that are available for a given time interval. For example:<br/><br/>`doubleVec GetSamplePercent( (timestamp or timeinterval) startTime [, (timestamp or timeinterval) endTime] )`<br/><br/>Because the `GetSample` method fails if the percentage of samples returned is less than the `samplePercent` specified, you can use the `GetSamplePercent` method to check first. Then you can perform an alternate action if insufficient samples are present, without halting the automatic scaling evaluation. |

### Samples, sample percentage, and the *GetSample()* method
The core operation of an autoscale formula is to obtain task and resource metric data and then adjust pool size based on that data. As such, it is important to have a clear understanding of how autoscale formulas interact with metrics data, or "samples."

**Samples**

The Batch service periodically takes *samples* of task and resource metrics and makes them available to your autoscale formulas. These samples are recorded every 30 seconds by the Batch service. However, there is typically some latency that causes a delay between when those samples were recorded and when they are made available to (and can be read by) your autoscale formulas. Additionally, due to various factors such as network or other infrastructure issues, samples may not have been recorded for a particular interval. This results in "missing" samples.

**Sample percentage**

When `samplePercent` is passed to the `GetSample()` method or the `GetSamplePercent()` method is called, "percent" refers to a comparison between the total *possible* number of samples that are recorded by the Batch service and the number of samples that are actually *available* to your autoscale formula.

Let's look at a 10-minute timespan as an example. Because samples are recorded every 30 seconds, within a 10 minute timespan, the maximum total number of samples that are recorded by Batch would be 20 samples (2 per minute). However, due to the inherent latency of the reporting mechanism or some other issue within the Azure infrastructure, there may be only 15 samples that are available to your autoscale formula for reading. This means that, for that 10-minute period, only **75 percent** of the total number of samples recorded are actually available to your formula.

**GetSample() and sample ranges**

Your autoscale formulas are going to be growing and shrinking your pools--adding nodes or removing nodes. Because nodes cost you money, you want to ensure that your formulas use an intelligent method of analysis that is based on sufficient data. Therefore, we recommend that you use a trending-type analysis in your formulas. This type will grow and shrink your pools based on a *range* of collected samples.

To do so, use `GetSample(interval look-back start, interval look-back end)` to return a **vector** of samples:

```
$runningTasksSample = $RunningTasks.GetSample(1 * TimeInterval_Minute, 6 * TimeInterval_Minute);
```

When the above line is evaluated by Batch, it returns a range of samples as a vector of values. For example:

```
$runningTasksSample=[1,1,1,1,1,1,1,1,1,1];
```

Once you've collected the vector of samples, you can then use functions like `min()`, `max()`, and `avg()` to derive meaningful values from the collected range.

For additional security, you can force a formula evaluation to *fail* if less than a certain sample percentage is available for a particular time period. When you force a formula evaluation to fail, you instruct Batch to cease further evaluation of the formula if the specified percentage of samples is not available. In this case, no change is made to the pool size. To specify a required percentage of samples for the evaluation to succeed, specify it as the third parameter to `GetSample()`. Here, a requirement of 75 percent of samples is specified:

```
$runningTasksSample = $RunningTasks.GetSample(60 * TimeInterval_Second, 120 * TimeInterval_Second, 75);
```

Because there may be a delay in sample availability, it is important to always specify a time range with a look-back start time that is older than one minute. It takes approximately one minute for samples to propagate through the system, so samples in the range `(0 * TimeInterval_Second, 60 * TimeInterval_Second)` may not be available. Again, you can use the percentage parameter of `GetSample()` to force a particular sample percentage requirement.

> [!IMPORTANT]
> We **strongly recommend** that you **avoid relying *only* on `GetSample(1)` in your autoscale formulas**. This is because `GetSample(1)` essentially says to the Batch service, "Give me the last sample you have, no matter how long ago you retrieved it." Since it is only a single sample, and it may be an older sample, it may not be representative of the larger picture of recent task or resource state. If you do use `GetSample(1)`, make sure that it's part of a larger statement and not the only data point that your formula relies on.
>
>

## Metrics
You can use both **resource** and **task** metrics when you're defining a formula. You adjust the target number of dedicated nodes in the pool based on the metrics data that you obtain and evaluate. See the [Variables](#variables) section above for more information on each metric.

<table>
  <tr>
    <th>Metric</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><b>Resource</b></td>
    <td><p><b>Resource metrics</b> are based on the CPU, bandwidth, and memory usage of compute nodes, as well as the number of nodes.</p>
        <p> These service-defined variables are useful for making adjustments based on node count:</p>
    <p><ul>
            <li>$TargetDedicatedNodes</li>
            <li>$TargetLowPriorityNodes</li>
            <li>$CurrentDedicatedNodes</li>
            <li>$CurrentLowPriorityNodes</li>
            <li>$PreemptedNodeCount</li>
            <li>$SampleNodeCount</li>
    </ul></p>
    <p>These service-defined variables are useful for making adjustments based on node resource usage:</p>
    <p><ul>
      <li>$CPUPercent</li>
      <li>$WallClockSeconds</li>
      <li>$MemoryBytes</li>
      <li>$DiskBytes</li>
      <li>$DiskReadBytes</li>
      <li>$DiskWriteBytes</li>
      <li>$DiskReadOps</li>
      <li>$DiskWriteOps</li>
      <li>$NetworkInBytes</li>
      <li>$NetworkOutBytes</li></ul></p>
  </tr>
  <tr>
    <td><b>Task</b></td>
    <td><p><b>Task metrics</b> are based on the status of tasks, such as Active, Pending, and Completed. The following service-defined variables are useful for making pool-size adjustments based on task metrics:</p>
    <p><ul>
      <li>$ActiveTasks</li>
      <li>$RunningTasks</li>
      <li>$PendingTasks</li>
      <li>$SucceededTasks</li>
            <li>$FailedTasks</li></ul></p>
        </td>
  </tr>
</table>

## Write an autoscale formula
You build an autoscale formula by forming statements that use the above components, then combine those statements into a complete formula. In this section, we'll create an example autoscale formula that can perform some real-world scaling decisions.

First, let's define the requirements for our new autoscale formula. The formula should:

1. **Increase** the target number of compute nodes in a pool if CPU usage is high.
2. **Decrease** the target number of compute nodes in a pool when CPU usage is low.
3. Always restrict the **maximum** number of nodes to 400.

To *increase* the number of nodes during high CPU usage, we define the statement that populates a user-defined variable (`$totalDedicatedNodes`) with a value that is 110 percent of the current target number of dedicated nodes, but only if the minimum average CPU usage during the last 10 minutes was above 70 percent. Otherwise, we use the value for the current number of dedicated nodes.

```
$totalDedicatedNodes =
    (min($CPUPercent.GetSample(TimeInterval_Minute * 10)) > 0.7) ?
    ($CurrentDedicatedNodes * 1.1) : $CurrentDedicatedNodes;
```

To *decrease* the number of dedicated nodes during low CPU usage, the next statement in our formula sets the same `$totalDedicatedNodes` variable to 90 percent of the current target number of dedicated nodes if the average CPU usage in the past 60 minutes was under 20 percent. Otherwise, use the current value of `$totalDedicatedNodes` that we populated in the statement above.

```
$totalDedicatedNodes =
    (avg($CPUPercent.GetSample(TimeInterval_Minute * 60)) < 0.2) ?
    ($CurrentDedicatedNodes * 0.9) : $totalDedicatedNodes;
```

Now limit the target number of dedicated compute nodes to a **maximum** of 400:

```
$TargetDedicatedNodes = min(400, $totalDedicatedNodes)
```

Here's the complete formula:

```
$totalDedicatedNodes =
    (min($CPUPercent.GetSample(TimeInterval_Minute * 10)) > 0.7) ?
    ($CurrentDedicatedNodes * 1.1) : $CurrentDedicatedNodes;
$totalDedicatedNodes =
    (avg($CPUPercent.GetSample(TimeInterval_Minute * 60)) < 0.2) ?
    ($CurrentDedicatedNodes * 0.9) : $totalDedicatedNodes;
$TargetDedicatedNodes = min(400, $totalDedicatedNodes)
```

## Create an autoscale-enabled pool with .NET

To create a new pool with autoscaling enabled in .NET, follow these steps:

1. Create the pool with [BatchClient.PoolOperations.CreatePool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx).
2. Set the [CloudPool.AutoScaleEnabled](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleenabled.aspx) property to `true`.
3. Set the [CloudPool.AutoScaleFormula](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleformula.aspx) property with your autoscale formula.
4. (Optional) Set the [CloudPool.AutoScaleEvaluationInterval](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoScaleevaluationinterval.aspx) property (default is 15 minutes).
5. Commit the pool with [CloudPool.Commit](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.commit.aspx) or [CommitAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.commitasync.aspx).

The following code snippet creates an autoscale-enabled pool in .NET. The pool's autoscale formula sets the target number of dedicated nodes to 5 on Mondays, and 1 on every other day of the week. The [automatic scaling interval](#automatic-scaling-interval) is set to 30 minutes. In this and the other C# snippets in this article, `myBatchClient` is a properly initialized instance of the [BatchClient][net_batchclient] class.

```csharp
CloudPool pool = myBatchClient.PoolOperations.CreatePool(
                    poolId: "mypool",
                    virtualMachineSize: "small",                                                // single-core, 1.75 GB memory, 225 GB disk
                    cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "5"));    
pool.AutoScaleEnabled = true;
pool.AutoScaleFormula = "$TargetDedicatedNodes = (time().weekday == 1 ? 5:1);";
 pool.AutoScaleEvaluationInterval = TimeSpan.FromMinutes(30);
pool.Commit();
```

> [!IMPORTANT]
> When you create an autoscale-enabled pool, do not specify the `targetDedicatedComputeNodes` parameter or the `targetLowPriorityComputeNodes` parameter on the call to **CreatePool**. Instead, specify the **AutoScaleEnabled** and **AutoScaleFormula** properties. The values for these properties will determine the target number of each type of node. Also, to manually resize an autoscale-enabled pool (for example, with [BatchClient.PoolOperations.ResizePool][net_poolops_resizepool]), first **disable** automatic scaling on the pool, then resize it.
>
>

In addition to Batch .NET, you can use any of the other [Batch SDKs](batch-apis-tools.md#azure-accounts-for-batch-development), [Batch REST](https://docs.microsoft.com/rest/api/batchservice/), [Batch PowerShell cmdlets](batch-powershell-cmdlets-get-started.md), and the [Batch CLI](batch-cli-get-started.md)to configure autoscaling.


### Automatic scaling interval
By default, the Batch service adjusts a pool's size according to its autoscale formula every **15 minutes**. This interval is configurable, however, by using the following pool properties:

* [CloudPool.AutoScaleEvaluationInterval][net_cloudpool_autoscaleevalinterval] (Batch .NET)
* [autoScaleEvaluationInterval][rest_autoscaleinterval] (REST API)

The minimum interval is five minutes, and the maximum is 168 hours. If an interval outside this range is specified, the Batch service will return a Bad Request (400) error.

> [!NOTE]
> Autoscaling is not currently intended to respond to changes in less than a minute, but rather is intended to adjust the size of your pool gradually as you run a workload.
>
>

## Enable autoscaling on an existing pool

In .NET, if you've already created a pool with a set number of compute nodes by using the `targetDedicatedComputeNodes` parameter, you can still enable autoscaling on the pool. Each Batch SDK provides a way to enable autoscaling. For example:

* [BatchClient.PoolOperations.EnableAutoScale][net_enableautoscale] (Batch .NET)
* [Enable automatic scaling on a pool][rest_enableautoscale] (REST API)

When you enable autoscaling on an existing pool, the following applies:

* If automatic scaling is currently **disabled** on the pool when you issue the "enable autoscale" request, you *must* specify a valid autoscale formula when you issue the request. You can *optionally* specify an autoscale evaluation interval. If you do not specify an interval, the default value of 15 minutes is used.
* If autoscale is currently **enabled** on the pool, you can specify an autoscale formula, an evaluation interval, or both. You can't omit both properties.

  * If you specify a new autoscale evaluation interval, then the existing evaluation schedule is stopped and a new schedule is started. The new schedule's start time is the time at which the "enable autoscale" request was issued.
  * If you omit either the autoscale formula or evaluation interval, the Batch service continues to use the current value of that setting.

> [!NOTE]
> If you specified a value for the *targetDedicatedComputeNodes* parameter of the **CreatePool** method when you created the pool in .NET, that value is ignored when the automatic scaling formula is evaluated.
>
>

This C# code snippet uses the [Batch .NET][net_api] library to enable autoscaling on an existing pool:

```csharp
// Define the autoscaling formula. This formula sets the target number of nodes
// to 5 on Mondays, and 1 on every other day of the week
string myAutoScaleFormula = "$TargetDedicatedNodes = (time().weekday == 1 ? 5:1);";

// Set the autoscale formula on the existing pool
myBatchClient.PoolOperations.EnableAutoScale(
    "myexistingpool",
    autoscaleFormula: myAutoScaleFormula);
```

### Update an autoscale formula
You use the same "enable autoscale" request to *update* the formula on an existing autoscale-enabled pool (for example, with [EnableAutoScale][net_enableautoscale] in Batch .NET). There is no special "update autoscale" operation. For example, if autoscaling is already enabled on "myexistingpool" when the following code is executed, its autoscale formula is replaced with the contents of `myNewFormula`.

```csharp
myBatchClient.PoolOperations.EnableAutoScale(
    "myexistingpool",
    autoscaleFormula: myNewFormula);
```

### Update the autoscale interval
As with updating an autoscale formula, you use the same [EnableAutoScale][net_enableautoscale] method to change the autoscale evaluation interval of an existing autoscale-enabled pool. For example, to set the autoscale evaluation interval to 60 minutes for a pool that's already autoscale-enabled:

```csharp
myBatchClient.PoolOperations.EnableAutoScale(
    "myexistingpool",
    autoscaleEvaluationInterval: TimeSpan.FromMinutes(60));
```

## Evaluate an autoscale formula
You can evaluate a formula before applying it to a pool. In this way, you can perform a "test run" of the formula to see how its statements evaluate before you put the formula into production.

To evaluate an autoscale formula, you must first **enable autoscaling** on the pool with a **valid formula**. If you want to test a formula on a pool that doesn't yet have autoscaling enabled, you can use the one-line formula `$TargetDedicatedNodes = 0` when you first enable autoscaling. Then, use one of the following to evaluate the formula you want to test:

* [BatchClient.PoolOperations.EvaluateAutoScale](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscale.aspx) or [EvaluateAutoScaleAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscaleasync.aspx)

    These Batch .NET methods require the ID of an existing pool and a string containing the autoscale formula to evaluate. The evaluation results are contained in the returned [AutoScaleEvaluation](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscaleevaluation.aspx) instance.
* [Evaluate an automatic scaling formula](https://msdn.microsoft.com/library/azure/dn820183.aspx)

    In this REST API request, specify the pool ID in the URI, and the autoscale formula in the *autoScaleFormula* element of the request body. The response of the operation contains any error information that might be related to the formula.

In this [Batch .NET][net_api] code snippet, we evaluate a formula prior to applying it to the [CloudPool][net_cloudpool]. If the pool does not have autoscaling enabled, we enable it first.

```csharp
// First obtain a reference to an existing pool
CloudPool pool = batchClient.PoolOperations.GetPool("myExistingPool");

// If autoscaling isn't already enabled on the pool, enable it.
// You can't evaluate an autoscale formula on non-autoscale-enabled pool.
if (pool.AutoScaleEnabled == false)
{
    // We need a valid autoscale formula to enable autoscaling on the
    // pool. This formula is valid, but won't resize the pool:
    pool.EnableAutoScale(
        autoscaleFormula: $"$TargetDedicatedNodes = {pool.CurrentDedicatedNodes};",
        autoscaleEvaluationInterval: TimeSpan.FromMinutes(5));

    // Batch limits EnableAutoScale calls to once every 30 seconds.
    // Because we want to apply our new autoscale formula below if it
    // evaluates successfully, and we *just* enabled autoscaling on
    // this pool, we pause here to ensure we pass that threshold.
    Thread.Sleep(TimeSpan.FromSeconds(31));

    // Refresh the properties of the pool so that we've got the
    // latest value for AutoScaleEnabled
    pool.Refresh();
}

// We must ensure that autoscaling is enabled on the pool prior to
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

    // Perform the autoscale formula evaluation. Note that this does not
    // actually apply the formula to the pool.
    AutoScaleRun eval =
        batchClient.PoolOperations.EvaluateAutoScale(pool.Id, myFormula);

    if (eval.Error == null)
    {
        // Evaluation success - print the results of the AutoScaleRun.
        // This will display the values of each variable as evaluated by the
        // autoscale formula.
        Console.WriteLine("AutoScaleRun.Results: " +
            eval.Results.Replace("$", "\n    $"));

        // Apply the formula to the pool since it evaluated successfully
        batchClient.PoolOperations.EnableAutoScale(pool.Id, myFormula);
    }
    else
    {
        // Evaluation failed, output the message associated with the error
        Console.WriteLine("AutoScaleRun.Error.Message: " +
            eval.Error.Message);
    }
}
```

Successful evaluation of the formula in this snippet will result in output similar to the following:

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
To ensure your formula is performing as expected, we recommend you periodically check the results of the autoscaling "runs" Batch performs on your pool. To do so, get (or refresh) a reference to the pool, and examine the properties of its last autoscale run.

In Batch .NET, the [CloudPool.AutoScaleRun](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscalerun.aspx) property has several properties providing information about the latest automatic scaling run performed on the pool by the Batch service.

* [AutoScaleRun.Timestamp](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.timestamp.aspx)
* [AutoScaleRun.Results](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.results.aspx)
* [AutoScaleRun.Error](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.error.aspx)

In the REST API, the [Get information about a pool](https://msdn.microsoft.com/library/dn820165.aspx) request returns information about the pool, which includes the latest automatic scaling run information in [autoScaleRun](https://msdn.microsoft.com/library/dn820165.aspx#bk_autrun).

The following C# code snippet uses the Batch .NET library to print information about the last autoscaling run on pool "myPool":

```csharp
Cloud pool = myBatchClient.PoolOperations.GetPool("myPool");
Console.WriteLine("Last execution: " + pool.AutoScaleRun.Timestamp);
Console.WriteLine("Result:" + pool.AutoScaleRun.Results.Replace("$", "\n  $"));
Console.WriteLine("Error: " + pool.AutoScaleRun.Error);
```

Sample output of the preceding snippet:

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

## Example autoscale formulas
Let's take a look at a few formulas that show different ways to adjust the amount of compute resources in a pool.

### Example 1: Time-based adjustment
Perhaps you want to adjust the pool size based on the day of the week and time of day, to increase or decrease the number of nodes in the pool accordingly.

This formula first obtains the current time. If it's a weekday (1-5) and within working hours (8 AM to 6 PM), the target pool size is set to 20 nodes. Otherwise, it's set to 10 nodes.

```
$curTime = time();
$workHours = $curTime.hour >= 8 && $curTime.hour < 18;
$isWeekday = $curTime.weekday >= 1 && $curTime.weekday <= 5;
$isWorkingWeekdayHour = $workHours && $isWeekday;
$TargetDedicatedNodes = $isWorkingWeekdayHour ? 20:10;
```

### Example 2: Task-based adjustment
In this example, the pool size is adjusted based on the number of tasks in the queue. Note that both comments and line breaks are acceptable in formula strings.

```csharp
// Get pending tasks for the past 15 minutes.
$samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
// If we have fewer than 70 percent data points, we use the last sample point,
// otherwise we use the maximum of last sample point and the history average.
$tasks = $samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1), avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
// If number of pending tasks is not 0, set targetVM to pending tasks, otherwise
// half of current dedicated.
$targetVMs = $tasks > 0? $tasks:max(0, $TargetDedicatedNodes/2);
// The pool size is capped at 20, if target VM value is more than that, set it
// to 20. This value should be adjusted according to your use case.
$TargetDedicatedNodes = max(0, min($targetVMs, 20));
// Set node deallocation mode - keep nodes active only until tasks finish
$NodeDeallocationOption = taskcompletion;
```

### Example 3: Accounting for parallel tasks
This is another example that adjusts the pool size based on the number of tasks. This formula also takes into account the [MaxTasksPerComputeNode][net_maxtasks] value that has been set for the pool. This is particularly useful in situations where [parallel task execution](batch-parallel-node-tasks.md) has been enabled on your pool.

```csharp
// Determine whether 70 percent of the samples have been recorded in the past
// 15 minutes; if not, use last sample
$samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
$tasks = $samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1),avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
// Set the number of nodes to add to one-fourth the number of active tasks (the
// MaxTasksPerComputeNode property on this pool is set to 4, adjust this number
// for your use case)
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
This example shows a C# code snippet with an autoscale formula that sets the pool size to a certain number of nodes for an initial time period. Then it adjusts the pool size based on the number of running and active tasks after the initial time period has elapsed.

The formula in the following code snippet:

* Sets the initial pool size to four nodes.
* Does not adjust the pool size within the first 10 minutes of the pool's lifecycle.
* After 10 minutes, obtains the max value of the number of running and active tasks within the past 60 minutes.
  * If both values are 0 (indicating that no tasks were running or active in the last 60 minutes), the pool size is set to 0.
  * If either value is greater than zero, no change is made.

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
* [Maximize Azure Batch compute resource usage with concurrent node tasks](batch-parallel-node-tasks.md) contains details about how you can execute multiple tasks simultaneously on the compute nodes in your pool. In addition to autoscaling, this feature may help to lower job duration for some workloads, saving you money.
* For another efficiency booster, ensure that your Batch application queries the Batch service in the most optimal way. In [Query the Azure Batch service efficiently](batch-efficient-list-queries.md), you'll learn how to limit the amount of data that crosses the wire when you query the status of potentially thousands of compute nodes or tasks.

[net_api]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[net_batchclient]: http://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_cloudpool_autoscaleformula]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleformula.aspx
[net_cloudpool_autoscaleevalinterval]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleevaluationinterval.aspx
[net_enableautoscale]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.enableautoscale.aspx
[net_maxtasks]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.maxtaskspercomputenode.aspx
[net_poolops_resizepool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.resizepool.aspx

[rest_api]: https://msdn.microsoft.com/library/azure/dn820158.aspx
[rest_autoscaleformula]: https://msdn.microsoft.com/library/azure/dn820173.aspx
[rest_autoscaleinterval]: https://msdn.microsoft.com/library/azure/dn820173.aspx
[rest_enableautoscale]: https://msdn.microsoft.com/library/azure/dn820173.aspx
