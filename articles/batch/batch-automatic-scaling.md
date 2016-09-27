<properties
	pageTitle="Automatically scale compute nodes in an Azure Batch pool | Microsoft Azure"
	description="Enable automatic scaling on a cloud pool to dynamically adjust the number of compute nodes in the pool."
	services="batch"
	documentationCenter=""
	authors="mmacy"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="batch"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="multiple"
	ms.date="07/21/2016"
	ms.author="marsma"/>

# Automatically scale compute nodes in an Azure Batch pool

With automatic scaling, the Azure Batch service can dynamically add or remove compute nodes in a pool based on parameters that you define. You can potentially save both time and money by automatically adjusting the amount of compute power used by your application--add nodes as your job's task demands increase, and remove them when they decrease.

You enable automatic scaling on a pool of compute nodes by associating with it an *autoscale formula* that you define, such as with the [PoolOperations.EnableAutoScale][net_enableautoscale] method in the [Batch .NET](batch-dotnet-get-started.md) library. The Batch service then uses this formula to determine the number of compute nodes that are needed to execute your workload. Batch responds to service metrics data samples that are collected periodically, and adjusts the number of compute nodes in the pool at a configurable interval based on your formula.

You can enable automatic scaling when a pool is created, or on an existing pool. You can also change an existing formula on a pool that is "autoscale" enabled. Batch provides the ability to evaluate your formulas before assigning them to pools, as well as monitor the status of automatic scaling runs.

## Automatic scaling formulas

An automatic scaling formula is a string value that you define that contains one or more statements, and is assigned to a pool's [autoScaleFormula][rest_autoscaleformula] element (Batch REST) or [CloudPool.AutoScaleFormula][net_cloudpool_autoscaleformula] property (Batch .NET). When assigned to a pool, the Batch service uses your formula to determine the target number of compute nodes in the pool for the next interval of processing (more on intervals later). The formula string cannot exceed 8 KB in size, can include up to 100 statements that are separated by semicolons, and can include line breaks and comments.

You can think of automatic scaling formulas as using a Batch autoscale "language." Formula statements are free-formed expressions that can include both service-defined variables (variables defined by the Batch service) and user-defined variables (variables that you define). They can perform various operations on these values by using built-in types, operators, and functions. For example, a statement might take the following form:

`$myNewVariable = function($ServiceDefinedVariable, $myCustomVariable);`

Formulas generally contain multiple statements that perform operations on values that are obtained in previous statements. For example, first we obtain a value for  `variable1`, then pass it to a function to populate `variable2`:

```
$variable1 = function1($ServiceDefinedVariable);
$variable2 = function2($OtherServiceDefinedVariable, $variable1);
```

With these statements in your formula, your goal is to arrive at a number of compute nodes that the pool should be scaled to--the **target** number of **dedicated nodes**. This number may be higher, lower, or the same as the current number of nodes in the pool. Batch evaluates a pool's autoscale formula at a specific interval ([automatic scaling intervals](#automatic-scaling-interval) are discussed below). Then it will adjust the target number of nodes in the pool to the number that your autoscale formula specifies at the time of evaluation.

As a quick example, this two-line autoscale formula specifies that the number of nodes should be adjusted according to the number of active tasks, up to a maximum of 10 compute nodes:

```
$averageActiveTaskCount = avg($ActiveTasks.GetSample(TimeInterval_Minute * 15));
$TargetDedicated = min(10, $averageActiveTaskCount);
```

The next few sections of this article discuss the various entities that will make up your autoscale formulas, including variables, operators, operations, and functions. You'll find out how to obtain various compute resource and task metrics within Batch. You can use these metrics to intelligently adjust your pool's node count based on resource usage and task status. You'll then learn how to construct a formula and enable automatic scaling on a pool by using both the Batch REST and .NET APIs. We'll finish up with a few example formulas.

> [AZURE.IMPORTANT] Each Azure Batch account is limited to a maximum number of cores (and therefore compute nodes) that can be used for processing. The Batch service will create nodes only up to that core limit. Therefore, it may not reach the target number of compute nodes that is specified by a formula. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for information on viewing and increasing your account quotas.

## Variables

You can use both **service-defined** and **user-defined** variables in your autoscale formulas. The service-defined variables are built in to the Batch service--some are read-write, and some are read-only. User-defined variables are variables that *you* define. In the two-line example formula above, `$TargetDedicated` is a service-defined variable, while `$averageActiveTaskCount` is a user-defined variable.

The tables below show both read-write and read-only variables that are defined by the Batch service.

You can **get** and **set** the values of these service-defined variables to manage the number of compute nodes in a pool:

<table>
  <tr>
    <th>Read-write<br/>service-defined variables</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>$TargetDedicated</td>
    <td>The <b>target</b> number of <b>dedicated compute nodes</b> for the pool. This is the number of compute nodes that the pool should be scaled to. It is a "target" number since it's possible for a pool not to reach the target number of nodes. This can occur if the target number of nodes is modified again by a subsequent autoscale evaluation before the pool has reached the initial target. It can also happen if a Batch account node or core quota is reached before the target number of nodes is reached.</td>
  </tr>
  <tr>
    <td>$NodeDeallocationOption</td>
    <td>The action that occurs when compute nodes are removed from a pool. Possible values are:
      <br/>
      <ul>
        <li><p><b>requeue</b>--Terminates tasks immediately and puts them back on the job queue so that they are rescheduled.</p></li>
        <li><p><b>terminate</b>--Terminates tasks immediately and removes them from the job queue.</p></li>
        <li><p><b>taskcompletion</b>--Waits for currently running tasks to finish and then removes the node from the pool.</p></li>
        <li><p><b>retaineddata</b>--Waits for all the local task-retained data on the node to be cleaned up before removing the node from the pool.</p></li>
      </ul></td>
   </tr>
</table>

You can **get** the value of these service-defined variables to make adjustments that are based on metrics from the Batch service:

<table>
  <tr>
    <th>Read-only<br/>service-defined<br/>variables</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>$CPUPercent</td>
    <td>The average percentage of CPU usage.</td>
  </tr>
  <tr>
    <td>$WallClockSeconds</td>
    <td>The number of seconds consumed.</td>
  </tr>
  <tr>
    <td>$MemoryBytes</td>
    <td>The average number of megabytes used.</td>
  <tr>
    <td>$DiskBytes</td>
    <td>The average number of gigabytes used on the local disks.</td>
  </tr>
  <tr>
    <td>$DiskReadBytes</td>
    <td>The number of bytes read.</td>
  </tr>
  <tr>
    <td>$DiskWriteBytes</td>
    <td>The number of bytes written.</td>
  </tr>
  <tr>
    <td>$DiskReadOps</td>
    <td>The count of read disk operations performed.</td>
  </tr>
  <tr>
    <td>$DiskWriteOps</td>
    <td>The count of write disk operations performed.</td>
  </tr>
  <tr>
    <td>$NetworkInBytes</td>
    <td>The number of inbound bytes.</td>
  </tr>
  <tr>
    <td>$NetworkOutBytes</td>
    <td>The number of outbound bytes.</td>
  </tr>
  <tr>
    <td>$SampleNodeCount</td>
    <td>The count of compute nodes.</td>
  </tr>
  <tr>
    <td>$ActiveTasks</td>
    <td>The number of tasks in an active state.</td>
  </tr>
  <tr>
    <td>$RunningTasks</td>
    <td>The number of tasks in a running state.</td>
  </tr>
  <tr>
    <td>$SucceededTasks</td>
    <td>The number of tasks that finished successfully.</td>
  </tr>
  <tr>
    <td>$FailedTasks</td>
    <td>The number of tasks that failed.</td>
  </tr>
  <tr>
    <td>$CurrentDedicated</td>
    <td>The current number of dedicated compute nodes.</td>
  </tr>
</table>

> [AZURE.TIP] The read-only, service-defined variables that are shown above are *objects* that provide various methods to access data associated with each. See [Obtain sample data](#getsampledata) below for more information.

## Types

These **types** are supported in a formula.

- double
- doubleVec
- doubleVecList
- string
- timestamp--timestamp is a compound structure that contains the following members:

	- year
	- month (1-12)
	- day (1-31)
	- weekday (in the format of number, e.g. 1 for Monday)
	- hour (in 24-hour number format, e.g. 13 means 1 PM)
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

These **operations** are allowed on the types that are listed above.

| Operation								| Supported operators	| Result type	|
| ------------------------------------- | --------------------- | ------------- |
| double *operator* double 				| +, -, *, /            | double		    |
| double *operator* timeinterval 		| *                     | timeinterval	    |
| doubleVec *operator* double 			| +, -, *, /            | doubleVec		    |
| doubleVec *operator* doubleVec 		| +, -, *, /            | doubleVec		    |
| timeinterval *operator* double 		| *, /                  | timeinterval	    |
| timeinterval *operator* timeinterval 	| +, -                  | timeinterval	    |
| timeinterval *operator* timestamp 	| +                     | timestamp		    |
| timestamp *operator* timeinterval 	| +                     | timestamp		    |
| timestamp *operator* timestamp 		| -                     | timeinterval	    |
| *operator*double 						| -, !                  | double		    |
| *operator*timeinterval 				| -                     | timeinterval	    |
| double *operator* double 				| <, <=, ==, >=, >, !=  | double		    |
| string *operator* string 				| <, <=, ==, >=, >, !=  | double		    |
| timestamp *operator* timestamp 		| <, <=, ==, >=, >, !=  | double		    |
| timeinterval *operator* timeinterval 	| <, <=, ==, >=, >, !=  | double		    |
| double *operator* double 				| &&, &#124;&#124;      | double		    |

When testing a double with a ternary operator (`double ? statement1 : statement2`), nonzero is **true**, and zero is **false**.

## Functions

These predefined **functions** are available for you to use in defining an automatic scaling formula.

| Function							| Return type	| Description
| --------------------------------- | ------------- | --------- |
| avg(doubleVecList)				| double 		| Returns the average value for all values in the doubleVecList.
| len(doubleVecList)				| double 		| Returns the length of the vector that is created from the doubleVecList.
| lg(double)						| double 		| Returns the log base 2 of the double.
| lg(doubleVecList)					| doubleVec 	| Returns the componentwise log base 2 of the doubleVecList. A vec(double) must explicitly be passed for the parameter. Otherwise, the double lg(double) version is assumed.
| ln(double)						| double 		| Returns the natural log of the double.
| ln(doubleVecList)					| doubleVec 	| Returns the componentwise log base 2 of the doubleVecList. A vec(double) must explicitly be passed for the parameter. Otherwise, the double lg(double) version is assumed.
| log(double)						| double 		| Returns the log base 10 of the double.
| log(doubleVecList)				| doubleVec 	| Returns the componentwise log base 10 of the doubleVecList. A vec(double) must explicitly be passed for the single double parameter. Otherwise, the double log(double) version is assumed.
| max(doubleVecList)				| double 		| Returns the maximum value in the doubleVecList.
| min(doubleVecList)				| double 		| Returns the minimum value in the doubleVecList.
| norm(doubleVecList)				| double 		| Returns the two-norm of the vector that is created from the doubleVecList.
| percentile(doubleVec v, double p)	| double 		| Returns the percentile element of the vector v.
| rand()							| double 		| Returns a random value between 0.0 and 1.0.
| range(doubleVecList)				| double 		| Returns the difference between the min and max values in the doubleVecList.
| std(doubleVecList)				| double 		| Returns the sample standard deviation of the values in the doubleVecList.
| stop()							| 				| Stops evaluation of the autoscaling expression.
| sum(doubleVecList)				| double 		| Returns the sum of all the components of the doubleVecList.
| time(string dateTime="")			| timestamp 	| Returns the time stamp of the current time if no parameters are passed, or the time stamp of the dateTime string if it is passed. Supported dateTime formats are W3C-DTF and RFC 1123.
| val(doubleVec v, double i)		| double 		| Returns the value of the element that is at location i in vector v, with a starting index of zero.

Some of the functions that are described in the table above can accept a list as an argument. The comma-separated list is any combination of *double* and *doubleVec*. For example:

`doubleVecList := ( (double | doubleVec)+(, (double | doubleVec) )* )?`

The *doubleVecList* value is converted to a single *doubleVec* prior to evaluation. For example, if `v = [1,2,3]`, then calling `avg(v)` is equivalent to calling `avg(1,2,3)`. Calling `avg(v, 7)` is equivalent to calling `avg(1,2,3,7)`.

## <a name="getsampledata"></a>Obtain sample data

Autoscale formulas act on metrics data (samples) that is provided by the Batch service. A formula grows or shrinks pool size based on the values that it obtains from the service. The service-defined variables that are described above are objects that provide various methods to access data that is associated with that object. For example, the following expression shows a request to get the last five minutes of CPU usage:

`$CPUPercent.GetSample(TimeInterval_Minute * 5)`

<table>
  <tr>
    <th>Method</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>GetSample()</td>
    <td><p>The <b>GetSample()</b> method returns a vector of data samples.
	<p>A sample is 30 seconds worth of metrics data. In other words, samples are obtained every 30 seconds. But as noted below, there is a delay between when a sample is collected and when it is available to a formula. As such, not all samples for a given time period may be available for evaluation by a formula.
        <ul>
          <li><p><b>doubleVec GetSample(double count)</b>--Specifies the number of samples to obtain from the most recent samples that were collected.</p>
				  <p>GetSample(1) returns the last available sample. For metrics like $CPUPercent, however, this should not be used because it is impossible to know <em>when</em> the sample was collected. It might be recent, or, because of system issues, it might be much older. It is better in such cases to use a time interval as shown below.</p></li>
          <li><p><b>doubleVec GetSample((timestamp | timeinterval) startTime [, double samplePercent])</b>--Specifies a time frame for gathering sample data. Optionally, it also specifies the percentage of samples that must be available in the requested time frame.</p>
          <p><em>$CPUPercent.GetSample(TimeInterval_Minute * 10)</em> would return 20 samples if all samples for the last ten minutes are present in the CPUPercent history. If the last minute of history was not available, however, only 18 samples would be returned. In this case:<br/>
		  &nbsp;&nbsp;&nbsp;&nbsp;<em>$CPUPercent.GetSample(TimeInterval_Minute * 10, 95)</em> would fail because only 90 percent of the samples are available.<br/>
		  &nbsp;&nbsp;&nbsp;&nbsp;<em>$CPUPercent.GetSample(TimeInterval_Minute * 10, 80)</em> would succeed.</p></li>
          <li><p><b>doubleVec GetSample((timestamp | timeinterval) startTime, (timestamp | timeinterval) endTime [, double samplePercent])</b>--Specifies a time frame for gathering data, with both a start time and an end time.</p></li></ul>
		  <p>As mentioned above, there is a delay between when a sample is collected and when it is available to a formula. This must be considered when you use the <em>GetSample</em> method. See <em>GetSamplePercent</em> below.</td>
  </tr>
  <tr>
    <td>GetSamplePeriod()</td>
    <td>Returns the period of samples that were taken in a historical sample data set.</td>
  </tr>
	<tr>
		<td>Count()</td>
		<td>Returns the total number of samples in the metric history.</td>
	</tr>
  <tr>
    <td>HistoryBeginTime()</td>
    <td>Returns the time stamp of the oldest available data sample for the metric.</td>
  </tr>
  <tr>
    <td>GetSamplePercent()</td>
    <td><p>Returns the percentage of samples that are available for a given time interval. For example:</p>
    <p><b>doubleVec GetSamplePercent( (timestamp | timeinterval) startTime [, (timestamp | timeinterval) endTime] )</b>
	<p>Because the GetSample method fails if the percentage of samples returned is less than the samplePercent specified, you can use the GetSamplePercent method to check first. Then you can perform an alternate action if insufficient samples are present, without halting the automatic scaling evaluation.</p></td>
  </tr>
</table>

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

`runningTasksSample = $RunningTasks.GetSample(1 * TimeInterval_Minute, 6 * TimeInterval_Minute);`

When the above line is evaluated by Batch, it will return a range of samples as a vector of values. For example:

`runningTasksSample=[1,1,1,1,1,1,1,1,1,1];`

Once you've collected the vector of samples, you can then use functions like `min()`, `max()`, and `avg()` to derive meaningful values from the collected range.

For additional security, you can force a formula evaluation to *fail* if less than a certain sample percentage is available for a particular time period. When you force a formula evaluation to fail, you instruct Batch to cease further evaluation of the formula if the specified percentage of samples is not available--and no change to pool size will be made. To specify a required percentage of samples for the evaluation to succeed, specify it as the third parameter to `GetSample()`. Here, a requirement of 75 percent of samples is specified:

`runningTasksSample = $RunningTasks.GetSample(60 * TimeInterval_Second, 120 * TimeInterval_Second, 75);`

It is also important, due to the previously mentioned delay in sample availability, to always specify a time range with a look-back start time that is older than one minute. This is because it takes approximately one minute for samples to propagate through the system, so samples in the range `(0 * TimeInterval_Second, 60 * TimeInterval_Second)` will often not be available. Again, you can use the percentage parameter of `GetSample()` to force a particular sample percentage requirement.

> [AZURE.IMPORTANT] We **strongly recommend** that you **avoid relying *only* on `GetSample(1)` in your autoscale formulas**. This is because `GetSample(1)` essentially says to the Batch service, "Give me the last sample you have, no matter how long ago you got it." Since it is only a single sample, and it may be an older sample, it may not be representative of the larger picture of recent task or resource state. If you do use `GetSample(1)`, make sure that it's part of a larger statement and not the only data point that your formula relies on.

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
      <li>$TargetDedicated</li>
			<li>$CurrentDedicated</li>
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
      <li>$SucceededTasks</li>
			<li>$FailedTasks</li></ul></p>
		</td>
  </tr>
</table>

## Build an autoscale formula

You construct an autoscale formula by forming statements that use the above components and then combining those statements into a complete formula. For example, here we construct a formula by first defining the requirements for a formula that will:

1. Increase the target number of compute nodes in a pool if CPU usage is high.
2. Decrease the target number of compute nodes in a pool when CPU usage is low.
3. Always restrict the maximum number of nodes to 400.

For the *increase* of nodes during high CPU usage, we define the statement that populates a user-defined variable ($TotalNodes) with a value that is 110 percent of the current target number of nodes, if the minimum average CPU usage during the last 10 minutes was above 70 percent:

`$TotalNodes = (min($CPUPercent.GetSample(TimeInterval_Minute*10)) > 0.7) ? ($CurrentDedicated * 1.1) : $CurrentDedicated;`

The next statement sets the same variable to 90 percent of the current target number of nodes if the average CPU usage of the past 60 minutes was *under* 20 percent. This lowers the target number during low CPU usage. Note that this statement also references the user-defined variable *$TotalNodes* from the statement above.

`$TotalNodes = (avg($CPUPercent.GetSample(TimeInterval_Minute * 60)) < 0.2) ? ($CurrentDedicated * 0.9) : $TotalNodes;`

Now limit the target number of dedicated compute nodes to a **maximum** of 400:

`$TargetDedicated = min(400, $TotalNodes)`

Here's the complete formula:

```
$TotalNodes = (min($CPUPercent.GetSample(TimeInterval_Minute*10)) > 0.7) ? ($CurrentDedicated * 1.1) : $CurrentDedicated;
$TotalNodes = (avg($CPUPercent.GetSample(TimeInterval_Minute*60)) < 0.2) ? ($CurrentDedicated * 0.9) : $TotalNodes;
$TargetDedicated = min(400, $TotalNodes)
```

> [AZURE.NOTE] An automatic scaling formula is comprised of [Batch REST][rest_api] API variables, types, operations, and functions. You use these in formula strings even while you're working with the [Batch .NET][net_api] library.

## Create a pool with automatic scaling enabled

To enable automatic scaling when you're creating a pool, use one of the following techniques:

- [New-AzureBatchPool](https://msdn.microsoft.com/library/azure/mt125936.aspx)--This Azure PowerShell cmdlet uses the AutoScaleFormula parameter to specify the automatic scaling formula.
- [BatchClient.PoolOperations.CreatePool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx)--After this .NET method is called to create a pool, you'll then set the pool's [CloudPool.AutoScaleEnabled](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleenabled.aspx) property and [CloudPool.AutoScaleFormula](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleformula.aspx) property to enable automatic scaling.
- [Add a pool to an account](https://msdn.microsoft.com/library/azure/dn820174.aspx)--The enableAutoScale and autoScaleFormula elements are used in this REST API request to set up automatic scaling for the pool when it is created.

> [AZURE.IMPORTANT] If you create an autoscale-enabled pool by using one of the above techniques, the *targetDedicated* parameter for the pool must **not** be specified. Also note that if you wish to manually resize an autoscale-enabled pool (for example, with [BatchClient.PoolOperations.ResizePool][net_poolops_resizepool]), then you must first **disable** automatic scaling on the pool, then resize it.

The following code snippet shows the creation of an autoscale-enabled pool ([CloudPool][net_cloudpool]) by using the [Batch .NET][net_api] library. The pool's autoscale formula sets the target number of nodes to five on Mondays, and one on every other day of the week. In addition, the automatic scaling interval is set to 30 minutes (see [Automatic scaling interval](#automatic-scaling-interval) below). In this and the other C# snippets in this article, "myBatchClient" is a properly initialized instance of [BatchClient][net_batchclient].

```
CloudPool pool = myBatchClient.PoolOperations.CreatePool("mypool", "3", "small");
pool.AutoScaleEnabled = true;
pool.AutoScaleFormula = "$TargetDedicated = (time().weekday==1?5:1);";
pool.AutoScaleEvaluationInterval = TimeSpan.FromMinutes(30);
pool.Commit();
```

### Automatic scaling interval

By default, the Batch service adjusts a pool's size according to its autoscale formula every **15 minutes**. This interval is configurable, however, by using the following pool properties:

- REST API--[autoScaleEvaluationInterval][rest_autoscaleinterval]
- .NET API--[CloudPool.AutoScaleEvaluationInterval][net_cloudpool_autoscaleevalinterval]

The minimum interval is five minutes, and the maximum is 168 hours. If an interval outside this range is specified, the Batch service will return a Bad Request (400) error.

> [AZURE.NOTE] Autoscaling is not currently intended to respond to changes in less than a minute, but rather is intended to adjust the size of your pool gradually as you run a workload.

## Enable automatic scaling after a pool is created

If you've already set up a pool with a specified number of compute nodes by using the *targetDedicated* parameter, you can update the existing pool at a later time to automatically scale. You can do this in one of these ways:

- [BatchClient.PoolOperations.EnableAutoScale][net_enableautoscale]--This .NET method requires the ID of an existing pool and the automatic scaling formula to apply to the pool.
- [Enable automatic scaling on a pool][rest_enableautoscale]--This REST API request requires the ID of the existing pool in the URI and the automatic scaling formula in the request body.

> [AZURE.NOTE] If a value was specified for the *targetDedicated* parameter when the pool was created, it is ignored when the automatic scaling formula is evaluated.

This code snippet demonstrates enabling autoscaling on an existing pool by using the [Batch .NET][net_api] library. Note that both enabling and updating the formula on an existing pool use the same method. As such, this technique would *update* the formula on the specified pool if autoscaling had already been enabled. The snippet assumes that "mypool" is the ID of an existing pool ([CloudPool][net_cloudpool]).

		 // Define the autoscaling formula. In this snippet, the  formula sets the target number of nodes to 5 on
		 // Mondays, and 1 on every other day of the week
		 string myAutoScaleFormula = "$TargetDedicated = (time().weekday==1?5:1);";

		 // Update the existing pool's autoscaling formula by calling the BatchClient.PoolOperations.EnableAutoScale
		 // method, passing in both the pool's ID and the new formula.
		 myBatchClient.PoolOperations.EnableAutoScale("mypool", myAutoScaleFormula);

## Evaluate the automatic scaling formula

It’s always a good practice to evaluate a formula before you use it in your application. A formula is evaluated by performing a "test run" of the formula on an existing pool. Do this by using:

- [BatchClient.PoolOperations.EvaluateAutoScale](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscale.aspx) or [BatchClient.PoolOperations.EvaluateAutoScaleAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscaleasync.aspx)--These .NET methods require the ID of an existing pool and the string that contains the automatic scaling formula. The results of the call are contained in an instance of the [AutoScaleEvaluation](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscaleevaluation.aspx) class.
- [Evaluate an automatic scaling formula](https://msdn.microsoft.com/library/azure/dn820183.aspx)--In this REST API request, the pool ID is specified in the URI. The automatic scaling formula is specified in the *autoScaleFormula* element of the request body. The response of the operation contains any error information that might be related to the formula.

> [AZURE.NOTE] To evaluate an autoscale formula, you must first have enabled autoscaling on the pool by using a valid formula.

In this code snippet that uses the [Batch .NET][net_api] library, we evaluate a formula prior to applying it to the pool ([CloudPool][net_cloudpool]).

```
// First obtain a reference to the existing pool
CloudPool pool = myBatchClient.PoolOperations.GetPool("mypool");

// We must ensure that autoscaling is enabled on the pool prior to evaluating a formula
if (pool.AutoScaleEnabled.HasValue && pool.AutoScaleEnabled.Value)
{
	// The formula to evaluate - adjusts target number of nodes based on day of week and time of day
	string myFormula = @"
		$CurTime=time();
		$WorkHours=$CurTime.hour>=8 && $CurTime.hour<18;
		$IsWeekday=$CurTime.weekday>=1 && $CurTime.weekday<=5;
		$IsWorkingWeekdayHour=$WorkHours && $IsWeekday;
		$TargetDedicated=$IsWorkingWeekdayHour?20:10;
	";

	// Perform the autoscale formula evaluation. Note that this does not actually apply the formula to
	// the pool.
	AutoScaleEvaluation eval = client.PoolOperations.EvaluateAutoScale(pool.Id, myFormula);

	if (eval.AutoScaleRun.Error == null)
	{
		// Evaluation success - print the results of the AutoScaleRun. This will display the values of each
		// variable as evaluated by the autoscale formula.
		Console.WriteLine("AutoScaleRun.Results: " + eval.AutoScaleRun.Results);

		// Apply the formula to the pool since it evaluated successfully
		client.PoolOperations.EnableAutoScale(pool.Id, myFormula);
	}
	else
	{
		// Evaluation failed, output the message associated with the error
		Console.WriteLine("AutoScaleRun.Error.Message: " + eval.AutoScaleRun.Error.Message);
	}
}
```

Successful evaluation of the formula in this snippet will result in output similar to the following:

`AutoScaleRun.Results: $TargetDedicated = 10;$NodeDeallocationOption = requeue;$CurTime = 2015 - 08 - 25T20: 08:42.271Z;$IsWeekday = 1;$IsWorkingWeekdayHour = 0;$WorkHours = 0`

## Obtain information about automatic scaling runs

Periodically check the results of automatic scaling runs to ensure that a formula is performing as expected.

- [CloudPool.AutoScaleRun](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscalerun.aspx)--When you use the .NET library, this property of a pool provides an instance of the [AutoScaleRun](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.aspx) class. This class provides the following properties of the latest automatic scaling run:
  - [AutoScaleRun.Error](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.error.aspx)
  - [AutoScaleRun.Results](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.results.aspx)
  - [AutoScaleRun.Timestamp](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.timestamp.aspx)
- [Get information about a pool](https://msdn.microsoft.com/library/dn820165.aspx)--This REST API request returns information about the pool, which includes the latest automatic scaling run.

## <a name="examples"></a>Example formulas

Let's take a look at some examples that show just a few ways that formulas can be used to automatically scale compute resources in a pool.

### Example 1: Time-based adjustment

Perhaps you want to adjust the pool size based on the day of the week and time of day, to increase or decrease the number of nodes in the pool accordingly:

```
$CurTime=time();
$WorkHours=$CurTime.hour>=8 && $CurTime.hour<18;
$IsWeekday=$CurTime.weekday>=1 && $CurTime.weekday<=5;
$IsWorkingWeekdayHour=$WorkHours && $IsWeekday;
$TargetDedicated=$IsWorkingWeekdayHour?20:10;
```

This formula first obtains the current time. If it's a weekday (1-5) and within working hours (8 AM to 6 PM), the target pool size is set to 20 nodes. Otherwise, the pool size is targeted at 10 nodes.

### Example 2: Task-based adjustment

In this example, the pool size is adjusted based on the number of tasks in the queue. Note that both comments and line breaks are acceptable in formula strings.

```
// Get pending tasks for the past 15 minutes.
$Samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
// If we have fewer than 70 percent data points, we use the last sample point, otherwise we use the maximum of
// last sample point and the history average.
$Tasks = $Samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1), avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
// If number of pending tasks is not 0, set targetVM to pending tasks, otherwise half of current dedicated.
$TargetVMs = $Tasks > 0? $Tasks:max(0, $TargetDedicated/2);
// The pool size is capped at 20, if target VM value is more than that, set it to 20. This value
// should be adjusted according to your use case.
$TargetDedicated = max(0,min($TargetVMs,20));
// Set node deallocation mode - keep nodes active only until tasks finish
$NodeDeallocationOption = taskcompletion;
```

### Example 3: Accounting for parallel tasks

This is another example that adjusts the pool size based on the number of tasks. This formula also takes into account the [MaxTasksPerComputeNode][net_maxtasks] value that has been set for the pool. This is particularly useful in situations where [parallel task execution](batch-parallel-node-tasks.md) has been enabled on your pool.

```
// Determine whether 70 percent of the samples have been recorded in the past 15 minutes; if not, use last sample
$Samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
$Tasks = $Samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1),avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
// Set the number of nodes to add to one-fourth the number of active tasks (the MaxTasksPerComputeNode
// property on this pool is set to 4, adjust this number for your use case)
$Cores = $TargetDedicated * 4;
$ExtraVMs = (($Tasks - $Cores) + 3) / 4;
$TargetVMs = ($TargetDedicated+$ExtraVMs);
// Attempt to grow the number of compute nodes to match the number of active tasks, with a maximum of 3
$TargetDedicated = max(0,min($TargetVMs,3));
// Keep the nodes active until the tasks finish
$NodeDeallocationOption = taskcompletion;
```

### Example 4: Setting an initial pool size

This example shows a C# code snippet with an autoscale formula that sets the pool size to a certain number of nodes for an initial time period. Then it adjusts the pool size based on the number of running and active tasks after the initial time period has elapsed.

```
string now = DateTime.UtcNow.ToString("r");
string formula = string.Format(@"

	$TargetDedicated = {1};
	lifespan         = time() - time(""{0}"");
	span             = TimeInterval_Minute * 60;
	startup          = TimeInterval_Minute * 10;
	ratio            = 50;

	$TargetDedicated = (lifespan > startup ? (max($RunningTasks.GetSample(span, ratio), $ActiveTasks.GetSample(span, ratio)) == 0 ? 0 : $TargetDedicated) : {1});
	", now, 4);
```

The formula in the above code snippet:

- Sets the initial pool size to four nodes.
- Does not adjust the pool size within the first 10 minutes of the pool's lifecycle.
- After 10 minutes, obtains the max value of the number of running and active tasks within the past 60 minutes.
  - If both values are 0 (indicating that no tasks were running or active in the last 60 minutes), the pool size is set to 0.
  - If either value is greater than zero, no change is made.

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
[rest_autoscaleinterval]: https://msdn.microsoft.com/en-us/library/azure/dn820173.aspx
[rest_enableautoscale]: https://msdn.microsoft.com/library/azure/dn820173.aspx
