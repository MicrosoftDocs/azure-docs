
<properties
	pageTitle="Automatically Scale Compute Nodes in an Azure Batch Pool | Microsoft Azure"
	description="Enable automatic scaling on a cloud pool to dynamically adjust the number of compute nodes in the pool."
	services="batch"
	documentationCenter=""
	authors="davidmu1"
	manager="timlt"
	editor="tysonn"/>

<tags
	ms.service="batch"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="multiple"
	ms.date="08/26/2015"
	ms.author="davidmu"/>

# Automatically scale compute nodes in an Azure Batch pool

Automatically scaling compute nodes in an Azure Batch pool is the dynamic adjustment of processing power used by your application. This ease of adjustment saves you time and money. To learn more about compute nodes and pools, see the [Azure Batch technical overview](batch-technical-overview.md).

Automatic scaling occurs when it is enabled on a pool and a formula is associated with the pool. The formula is used to determine the number of compute nodes that are needed to process the application. Acting on samples that are collected periodically, the number of available compute nodes in the pool are adjusted every 15 minutes based on the associated formula.

Automatic scaling can be set when a pool is created, or enabled later on an existing pool. The formula can also be updated on a pool where automatic scaling was previously enabled. It’s always good practice to evaluate a formula before assigning it to a pool, and it’s important to monitor the status of the automatic scaling runs; we discuss each of these topics below.

> [AZURE.NOTE] Each Azure Batch account is limited to a maximum number of compute nodes that can be used for processing. The system will create nodes only up to that limit and therefore may not reach the target numbers specified by a formula.

## Scale compute resources automatically

The scaling formulas you define determine the number of available compute nodes in a pool for the next interval of processing. An automatic scaling formula is simply a string value assigned to a pool's [autoScaleFormula](https://msdn.microsoft.com/library/azure/dn820173.aspx) element in a request body (REST API) or [CloudPool.AutoScaleFormula](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleformula.aspx) property (.NET API). This formula string cannot exceed 8KB in size, can include up to 100 statements separated by semicolons, and can include line breaks and comments.

Statements in a formula are free-formed expressions. They can include any system-defined variables, user-defined variables, constant values, and supported operations on these variables or constants.

	VAR = Expression(system-defined variables, user-defined variables);

Complex formulas are created by using multiple statements and variables:

	VAR₀ = Expression₀(system-defined variables);
	VAR₁ = Expression₁(system-defined variables, VAR₀);

> [AZURE.NOTE] An automatic scaling formula is comprised of [Batch REST](https://msdn.microsoft.com/library/azure/dn820158.aspx) API variables, types, operations, and functions. These are used in formula strings even while working with the [Batch .NET](https://msdn.microsoft.com/library/azure/mt348682.aspx) library.

### Variables

Both system-defined and user-defined variables can be used in a formula.

*Get* and *set* the value of these **system-defined variables** to manage the number of compute nodes in a pool.

<table>
  <tr>
    <th>Variable</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>$TargetDedicated</td>
    <td>The target number of dedicated compute nodes for the pool. The value can be changed based upon actual usage for tasks.</td>
  </tr>
  <tr>
    <td>$NodeDeallocationOption</td>
    <td>The action that occurs when compute nodes are removed from a pool. Possible values are:
      <br/>
      <ul>
        <li><p><b>requeue</b> – Terminate tasks immediately and put them back on the job queue so that they are rescheduled.</p></li>
        <li><p><b>terminate</b> – Terminate tasks immediately and remove them from the job queue.</p></li>
        <li><p><b>taskcompletion</b> – Wait for currently running tasks to finish and then remove the node from the pool.</p></li>
        <li><p><b>retaineddata</b> - Wait for all the local task retained data on the node to be cleaned up before removing the node from the pool.</p></li>
      </ul></td>
   </tr>
</table>

*Get* the value of these **system-defined variables** to make adjustments based on metrics from compute nodes in the samples. These variables are read-only.

<table>
  <tr>
    <th>Variable</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>$CPUPercent</td>
    <td>The average percentage of CPU usage</td>
  </tr>
  <tr>
    <td>$WallClockSeconds</td>
    <td>The number of seconds consumed</td>
  </tr>
  <tr>
    <td>$MemoryBytes</td>
    <td>The average number of megabytes used</td>
  <tr>
    <td>$DiskBytes</td>
    <td>The average number of gigabytes used on the local disks</td>
  </tr>
  <tr>
    <td>$DiskReadBytes</td>
    <td>The number of bytes read</td>
  </tr>
  <tr>
    <td>$DiskWriteBytes</td>
    <td>The number of bytes written</td>
  </tr>
  <tr>
    <td>$DiskReadOps</td>
    <td>The count of read disk operations performed</td>
  </tr>
  <tr>
    <td>$DiskWriteOps</td>
    <td>The count of write disk operations performed</td>
  </tr>
  <tr>
    <td>$NetworkInBytes</td>
    <td>The number of inbound bytes</td>
  </tr>
  <tr>
    <td>$NetworkOutBytes</td>
    <td>The number of outbound bytes</td>
  </tr>
  <tr>
    <td>$SampleNodeCount</td>
    <td>The count of compute nodes</td>
  </tr>
  <tr>
    <td>$ActiveTasks</td>
    <td>The number of tasks that are in an active state</td>
  </tr>
  <tr>
    <td>$RunningTasks</td>
    <td>The number of tasks in a running state</td>
  </tr>
  <tr>
    <td>$SucceededTasks</td>
    <td>The number of tasks that finished successfully</td>
  </tr>
  <tr>
    <td>$FailedTasks</td>
    <td>The number of tasks that failed</td>
  </tr>
  <tr>
    <td>$CurrentDedicated</td>
    <td>The current number of dedicated compute nodes</td>
  </tr>
</table>

### Types

These **types** are supported in a formula.

- double
- doubleVec
- string
- timestamp -- timestamp is a compound structure which contains the following members:
	- year
	- month (1-12)
	- day (1-31)
	- weekday (in the format of number, e.g. 1 for Monday)
	- hour (in 24-hour number format, e.g. 13 means 1PM)
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

### Operations

These **operations** are allowed on the types listed above.

<table>
  <tr>
    <th>Operation</th>
    <th>Allowed operators</th>
  </tr>
  <tr>
    <td>double &lt;operator&gt; double =&gt; double</td>
    <td>+, -, *, /</td>
  </tr>
  <tr>
    <td>double &lt;operator&gt; timeinterval =&gt; timeinterval</td>
    <td>*</td>
  </tr>
  <tr>
    <td>doubleVec &lt;operator&gt; double =&gt; doubleVec</td>
    <td>+, -, *, /</td>
  </tr>
  <tr>
    <td>doubleVec &lt;operator&gt; doubleVec =&gt; doubleVec</td>
    <td>+, -, *, /</td>
  </tr>
  <tr>
    <td>timeinterval &lt;operator&gt; double =&gt; timeinterval</td>
    <td>*, /</td>
  </tr>
  <tr>
    <td>timeinterval &lt;operator&gt; timeinterval =&gt; timeinterval</td>
    <td>+, -</td>
  </tr>
  <tr>
    <td>timeinterval &lt;operator&gt; timestamp =&gt; timestamp</td>
    <td>+</td>
  </tr>
  <tr>
    <td>timestamp &lt;operator&gt; timeinterval =&gt; timestamp</td>
    <td>+</td>
  </tr>
  <tr>
    <td>timestamp &lt;operator&gt; timestamp =&gt; timeinterval</td>
    <td>-</td>
  </tr>
  <tr>
    <td>&lt;operator&gt;double =&gt; double</td>
    <td>-, !</td>
  </tr>
  <tr>
    <td>&lt;operator&gt;timeinterval =&gt; timeinterval</td>
    <td>-</td>
  </tr>
  <tr>
    <td>double &lt;operator&gt; double =&gt; double</td>
    <td>&lt;, &lt;=, ==, &gt;=, &gt;, !=</td>
  </tr>
  <tr>
    <td>string &lt;operator&gt; string =&gt; double</td>
    <td>&lt;, &lt;=, ==, &gt;=, &gt;, !=</td>
  </tr>
  <tr>
    <td>timestamp &lt;operator&gt; timestamp =&gt; double</td>
    <td>&lt;, &lt;=, ==, &gt;=, &gt, !=</td>
  </tr>
  <tr>
    <td>timeinterval &lt;operator&gt; timeinterval =&gt; double</td>
    <td>&lt;, &lt;=, ==, &gt;=, &gt;, !=</td>
  </tr>
  <tr>
    <td>double &lt;operator&gt; double =&gt; double</td>
    <td>&&, ||</td>
  </tr>
  <tr>
    <td>test double only (non-zero is true, zero is false)</td>
    <td>? :</td>
  </tr>
</table>

### Functions

These predefined **functions** are available for defining an automatic scaling formula.

<table>
  <tr>
    <th>Function</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>double <b>avg</b>(doubleVecList)</td>
    <td>The average value for all values in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double <b>len</b>(doubleVecList)</td>
    <td>The length of the vector created from the doubleVecList.</td>
  <tr>
    <td>double <b>lg</b>(double)</td>
    <td>Log base 2.</td>
  </tr>
  <tr>
    <td>doubleVec <b>lg</b>(doubleVecList)</td>
    <td>Componentwise log base 2. A vec(double) must be explicitly passed for single double parameter, otherwise the double lg(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double <b>ln</b>(double)</td>
    <td>Natural log.</td>
  </tr>
  <tr>
    <td>doubleVec <b>ln</b>(doubleVecList)</td>
    <td>Componentwise log base 2.  A vec(double) must be explicitly passed for single double parameter, otherwise the double lg(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double <b>log</b>(double)</td>
    <td>Log base 10.</td>
  </tr>
  <tr>
    <td>doubleVec <b>log</b>(doubleVecList)</td>
    <td>Componentwise log base 10. A vec(double) must be explicitly passed for single double parameter, otherwise the double log(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double <b>max</b>(doubleVecList)</td>
    <td>The maximum value in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double <b>min</b>(doubleVecList)</td>
    <td>The minimum value in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double <b>norm</b>(doubleVecList)</td>
    <td>The two-norm of the vector created from the doubleVecList.
  </tr>
  <tr>
    <td>double <b>percentile</b>(doubleVec v, double p)</td>
    <td>The percentile element of the vector v.</td>
  </tr>
  <tr>
    <td>double <b>rand</b>()</td>
    <td>A random value between 0.0 and 1.0.</td>
  </tr>
  <tr>
    <td>double <b>range</b>(doubleVecList)</td>
    <td>The difference between the min and max values in doubleVecList.</td>
  </tr>
  <tr>
    <td>double <b>std</b>(doubleVecList)</td>
    <td>The sample standard deviation of the values in the doubleVecList.</td>
  </tr>
  <tr>
    <td><b>stop</b>()</td>
    <td>Stop auto-scaling expression evaluation.</td>
  </tr>
  <tr>
    <td>double <b>sum</b>(doubleVecList)</td>
    <td>The sum of all the components of doubleVecList.</td>
  </tr>
  <tr>
    <td>timestamp <b>time</b>(string dateTime="")</td>
    <td>The timestamp of the current time if no parameters passed, or the timestamp of the dateTime string if passed. Supported dateTime formats are W3CDTF and RFC1123.</td>
  </tr>
  <tr>
    <td>double <b>val</b>(doubleVec v, double i)</td>
    <td>The value of the element at location i in vector v with a starting index of zero.</td>
  </tr>
</table>

Some of the functions described in the table above can accept a list as an argument. The comma separated list is any combination of *double* and *doubleVec*. For example:

	doubleVecList := ( (double | doubleVec)+(, (double | doubleVec) )* )?

The *doubleVecList* value is converted to a single *doubleVec* prior to evaluation. For example, if v = [1,2,3], then calling avg(v) is equivalent to calling avg(1,2,3) and calling avg(v, 7) is equivalent to calling avg(1,2,3,7).

### Obtain sample data

The system-defined variables described above are objects that provide methods to access the associated data. For example, the following expression shows a request to get the last five minutes of CPU usage:

	$CPUPercent.GetSample(TimeInterval_Minute*5)

These methods can be used to get sample data.

<table>
  <tr>
    <th>Method</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Count()</td>
    <td>Returns the total number of samples in the metric history.</td>
  </tr>
  <tr>
    <td>GetSample()</td>
    <td><p>Returns a vector of data samples. For example:</p>
        <ul>
          <li><p><b>doubleVec GetSample(double count)</b> - Specifies the number of samples that are required from the most recent samples.</p>
				  <p>A sample is 5 seconds worth of metrics data. GetSample(1) returns the last available sample, but for metrics like $CPUPercent you shouldn’t use this because it isn’t possible to know when the sample was collected. It might be recent, or because of system issues, it might be much older. It is better to use a time interval as shown below.</p></li>
          <li><p><b>doubleVec GetSample((timestamp | timeinterval) startTime [, double samplePercent])</b> – Specifies a time frame for gathering sample data and optionally specifies the percentage of samples that must be in the requested range.</p>
          <p>$CPUPercent.GetSample(TimeInterval\_Minute\*10), should return 200 samples if all samples for the last ten minutes are present in the CPUPercent history. If the last minute of history is still not present, only 180 samples are returned.</p>
					<p>$CPUPercent.GetSample(TimeInterval\_Minute\*10, 80) succeeds, and $CPUPercent.GetSample(TimeInterval_Minute\*10,95) fails.</p></li>
          <li><p><b>doubleVec GetSample((timestamp | timeinterval) startTime, (timestamp | timeinterval) endTime [, double samplePercent])</b> – Specifies a time frame for gathering data with both a start time and an end time.</p></li></ul>
		  <p>Note that there is a delay between when a sample is collected and when it is available to a formula; this must be considered when using the GetSample method; see GetSamplePercent below.</td>
  </tr>
  <tr>
    <td>GetSamplePeriod()</td>
    <td>Returns the period of the samples taken in a historical sample data set.</td>
  </tr>
  <tr>
    <td>HistoryBeginTime()</td>
    <td>Returns the timestamp  of the oldest available data sample for the metric.</td>
  </tr>
  <tr>
    <td>GetSamplePercent()</td>
    <td><p>Returns the percent of samples a history currently has for a given time interval. For example:</p>
    <p><b>doubleVec GetSamplePercent( (timestamp | timeinterval) startTime [, (timestamp | timeinterval) endTime] )</b>
	<p>Because the GetSample method fails if the percent of samples returned is less than the samplePercent specified, you can use the GetSamplePercent method to first check, then perform an alternate action when enough samples are not present without halting their automatic scaling evaluation.</p></td>
  </tr>
</table>

### Metrics

You can use both resource and task **metrics** when defining a formula, and these metrics can be used to manage the compute nodes in a pool.

<table>
  <tr>
    <th>Metric</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Resource</td>
    <td><p>Resource metrics are based on CPU usage, bandwidth usage, memory usage, and the number of compute nodes. These system-defined variables (described in **Variables** above) are used in formulas to manage the compute nodes in a pool:</p>
    <p><ul>
      <li>$TargetDedicated</li>
      <li>$NodeDeallocationOption</li>
    </ul></p>
    <p>These system-defined variables are used for making adjustments based on node resource metrics:</p>
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
    <td>Task</td>
    <td><p>Based on the status of tasks, such as Active, Pending, and Completed.</p>
    <p>These system-defined variables are used for making adjustments based on task metrics:</p>
    <p><ul>
      <li>$ActiveTasks</li>
      <li>$RunningTasks</li>
      <li>$SucceededTasks</li>
      <li>$FailedTasks</li>
      <li>$CurrentDedicated</li></ul></p></td>
  </tr>
</table>

## Build an autoscale formula

Constructing an autoscaling formula is done by forming statements using the above components and combining those statements into a complete formula. For example, here we construct a formula by first defining the requirements for a formula that will:

1. Increase the target number of compute nodes in a pool if CPU usage is high
2. Descrease the target number of compute nodes in a pool when CPU usage is low
3. Always restrict the maximum number of nodes to 400

For the *increase* of nodes during high CPU usage, we define the statement that populates a user-defined variable ($TotalNodes) with a value that is 110% of the current target number of nodes if the minimum average CPU usage during the last 10 minutes was above 70%:

	$TotalNodes = (min($CPUPercent.GetSample(TimeInterval_Minute*10)) > 0.7) ? ($CurrentDedicated * 1.1) : $CurrentDedicated;

The next statement sets the same variable to 90% of the current target number of nodes if the average CPU usage of the past 60 minutes was *under* 20%, lowering the target number during low CPU usage. Note that this statement also references the user-defined variable *$TotalNodes* from the statement above.

	$TotalNodes = (avg($CPUPercent.GetSample(TimeInterval_Minute*60)) < 0.2) ? ($CurrentDedicated * 0.9) : $TotalNodes;

Now limit the target number of dedicated compute nodes to a **maximum** of 400:

	$TargetDedicated = min(400, $TotalNodes)

Here's the complete formula:

	$TotalNodes = (min($CPUPercent.GetSample(TimeInterval_Minute*10)) > 0.7) ? ($CurrentDedicated * 1.1) : $CurrentDedicated;
	$TotalNodes = (avg($CPUPercent.GetSample(TimeInterval_Minute*60)) < 0.2) ? ($CurrentDedicated * 0.9) : $TotalNodes;
	$TargetDedicated = min(400, $TotalNodes)

## Create a pool with automatic scaling enabled

To enable automatic scaling when creating a pool, use one of the following techniques:

- [New-AzureBatchPool](https://msdn.microsoft.com/library/azure/mt125936.aspx) – This Azure PowerShell cmdlet uses the AutoScaleFormula parameter to specify the automatic scaling formula.
- [BatchClient.PoolOperations.CreatePool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx) – After this .NET method is called to create a pool, you'll then set the pool's [CloudPool.AutoScaleEnabled](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleenabled.aspx) and [CloudPool.AutoScaleFormula](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscaleformula.aspx) properties to enable automatic scaling.
- [Add a pool to an account](https://msdn.microsoft.com/library/azure/dn820174.aspx) – The enableAutoScale and autoScaleFormula elements are used in this REST API request to set up automatic scaling for the pool when it is created.

> [AZURE.NOTE] If you set up automatic scaling when the pool is created using one of the techniques above, the *targetDedicated* parameter for the pool is not (and must not) be specified when created. Also note that if you wish to manually resize an autoscale-enabled pool (for example with [BatchClient.PoolOperations.ResizePool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.resizepool.aspx)) then you must first disable automatic scaling on the pool, then resize the pool.

The following code snippet shows the creation of an autoscale-enabled [CloudPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx) using the [Batch .NET](https://msdn.microsoft.com/library/azure/mt348682.aspx) library whose formula sets the target number of nodes to 5 on Mondays, and 1 on every other day of the week. In the snippet, "myBatchClient" is a properly initialized instance of [BatchClient](http://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx)):

		CloudPool pool myBatchClient.PoolOperations.CreatePool("mypool", "3", "small");
		pool.AutoScaleEnabled = true;
		pool.AutoScaleFormula = "$TargetDedicated = (time().weekday==1?5:1);";
		pool.Commit();

## Enable automatic scaling after a pool was created

If you've already set up a pool with a specified number of compute nodes using the *targetDedicated* parameter, you can update the existing pool at a later time to automatically scale. Do this in one of these ways:

- [BatchClient.PoolOperations.EnableAutoScale](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.enableautoscale.aspx) – This .NET method requires the ID of an existing pool and the automatic scaling formula to apply to the pool.
- [Enable automatic scaling on a pool](https://msdn.microsoft.com/library/azure/dn820173.aspx) – This REST API request requires the ID of the existing pool in the URI and the automatic scaling formula in the request body.

> [AZURE.NOTE] If a value was specified for the *targetDedicated* parameter when the pool was created, it is ignored when the automatic scaling formula is evaluated.

This code snippet demonstrates enabling autoscaling on an existing pool using the [Batch .NET](https://msdn.microsoft.com/library/azure/mt348682.aspx) library. Note that both enabling and updating the formula on an existing pool use the same method. As such, this technique would *update* the formula on the specified pool if autoscaling had already been enabled. This snippet assumes that "myBatchClient" is a properly initialized instance of [BatchClient](http://msdn.microsoft.com/library/azure/microsoft.azure.batch.batchclient.aspx), and "mypool" is the ID of an existing [CloudPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx).

		 // Define the autoscaling formula. In this snippet, the  formula sets the target number of nodes to 5 on
		 // Mondays, and 1 on every other day of the week
		 string myAutoScaleFormula = "$TargetDedicated = (time().weekday==1?5:1);";

		 // Update the existing pool's autoscaling formula by calling the BatchClient.PoolOperations.EnableAutoScale
		 // method, passing in both the pool's ID and the new formula.
		 myBatchClient.PoolOperations.EnableAutoScale("mypool", myAutoScaleFormula);

## Evaluate the automatic scaling formula

It’s always good practice to evaluate a formula before you use it in your application. A formula is evaluated by performing a "test run" of the formula on an existing pool. Do this by using:

- [BatchClient.PoolOperations.EvaluateAutoScale](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscale.aspx) or [BatchClient.PoolOperations.EvaluateAutoScaleAsync](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.evaluateautoscaleasync.aspx) – These .NET methods require the ID of an existing pool and the string that contains the automatic scaling formula. The results of the call are contained in an instance of the [AutoScaleEvaluation](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscaleevaluation.aspx) class.
- [Evaluate an automatic scaling formula](https://msdn.microsoft.com/library/azure/dn820183.aspx) – In this REST API request, the pool ID is specified in the URI and the automatic scaling formula is specified in the *autoScaleFormula* element of the request body. The response of the operation contains any error information that might be related to the formula.

> [AZURE.NOTE] To evaluate an autoscaling formula, you must first have enabled autoscaling on the pool using a valid formula.

In this code snippet using the [Batch .NET](https://msdn.microsoft.com/library/azure/mt348682.aspx) library, we evaluate a formula prior to applying it to the [CloudPool](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx).

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
				// variable as evaluated by the the autoscaling formula.
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

Successful evaluation of the formula in this snippet will result in output similar to the following:

		AutoScaleRun.Results: $TargetDedicated = 10;$NodeDeallocationOption = requeue;$CurTime = 2015 - 08 - 25T20: 08:42.271Z;$IsWeekday = 1;$IsWorkingWeekdayHour = 0;$WorkHours = 0

## Obtain information about automatic scaling runs

Periodically checking the results of automatic scaling runs should be done to a formula is performing as expected. Do this in one of these ways:

- [CloudPool.AutoScaleRun](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.autoscalerun.aspx) – When using the .NET library, this property of a pool provides an instance of the [AutoScaleRun](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.aspx) class which provides the following properties of the latest automatic scaling run:
  - [AutoScaleRun.Error](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.error.aspx)
  - [AutoScaleRun.Results](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.results.aspx)
  - [AutoScaleRun.Timestamp](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.timestamp.aspx)
- [Get information about a pool](https://msdn.microsoft.com/library/dn820165.aspx) – This REST API request returns information about the pool, which includes the latest automatic scaling run.

## Example formulas

Let's take a look at some examples showing just a few ways formulas can be used to automatically scale compute resources in a pool.

### Example 1

Perhaps you want to adjust the pool size based on the day of the week and time of day, increasing or decreasing the number of nodes in the pool accordingly:

		$CurTime=time();
		$WorkHours=$CurTime.hour>=8 && $CurTime.hour<18;
		$IsWeekday=$CurTime.weekday>=1 && $CurTime.weekday<=5;
		$IsWorkingWeekdayHour=$WorkHours && $IsWeekday;
		$TargetDedicated=$IsWorkingWeekdayHour?20:10;

This formula first obtains the current time. If it's a weekday (1-5) and within working hours (8AM-6PM), the target pool size is set to 20 nodes. Otherwise, the pool size is targeted at 10 nodes.

### Example 2

In this example, the pool size is adjusted based on the number of tasks in the queue. Note that both comments and line breaks are acceptable in formula strings.

	    // Get pending tasks for the past 15 minutes.
	    $Samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
	    // If we have less than 70% data points, we use the last sample point, otherwise we use the maximum of
		// last sample point and the history average.
	    $Tasks = $Samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1), avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
	    // If number of pending tasks is not 0, set targetVM to pending tasks, otherwise half of current dedicated.
	    $TargetVMs = $Tasks > 0? $Tasks:max(0, $TargetDedicated/2);
	    // The pool size is capped at 20, if target VM value is more than that, set it to 20. This value
		// should be adjusted according to your use case.
	    $TargetDedicated = max(0,min($TargetVMs,20));
	    // Set node deallocation mode - keep nodes active only until tasks finish
	    $NodeDeallocationOption = taskcompletion;

### Example 3

Another example that adjusts the pool size based on the number of tasks, this formula also takes into account the [MaxTasksPerComputeNode](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.maxtaskspercomputenode.aspx) value that has been set for the pool. This is particularly useful in situations where parallel task execution on compute nodes is desired.

		// Determine whether 70% of the samples have been recorded in the past 15 minutes; if not, use last sample
		$Samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
		$Tasks = $Samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1),avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));
		// Set the number of nodes to add to one-fourth the number of active tasks (the MaxTasksPerComputeNode
		// property on this pool is set to 4, adjust this number for your use case)
		$Cores = $TargetDedicated * 4;
		$ExtraVMs = ($Tasks - $Cores) / 4;
		$TargetVMs = ($TargetDedicated+$ExtraVMs);
		// Attempt to grow the number of compute nodes to match the number of active tasks, with a maximum of 3
		$TargetDedicated = max(0,min($TargetVMs,3));
		// Keep the nodes active until the tasks finish
		$NodeDeallocationOption = taskcompletion;

## Next Steps

1. To fully assess the efficiency of your application, you might need to access a compute node. To take advantage of remote access, a user account must be added to the node that you want to access and an RDP file must be retrieved for that node.
    - Add the user account in one of these ways:
        * [New-AzureBatchVMUser](https://msdn.microsoft.com/library/mt149846.aspx) – This PowerShell cmdlet takes the pool name, compute node name, account name, and password as parameters.
        * [BatchClient.PoolOperations.CreateComputeNodeUser](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createcomputenodeuser.aspx) – This .NET method creates an instance of the [ComputeNodeUser](https://msdn.microsoft.com/library/microsoft.azure.batch.computenodeuser.aspx) class on which the account name and password can be set for the compute node, and [ComputeNodeUser.Commit](https://msdn.microsoft.com/library/microsoft.azure.batch.computenodeuser.commit.aspx) is then called on the instance to create the user on that node.
        * [Add a user account to a node](https://msdn.microsoft.com/library/dn820137.aspx) – The name of the pool and the compute node are specified in the URI and the account name and password are sent to the node in the request body of this REST API request.
    - Get the RDP file:
        * [BatchClient.PoolOperations.GetRDPFile](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getrdpfile.aspx) – This .NET method requires the ID of the pool, the node ID, and the name of the RDP file to create.
        * [Get a remote desktop protocol file from a node](https://msdn.microsoft.com/library/dn820120.aspx) – This REST API request requires the name of the pool and the name of the compute node. The response contains the contents of the RDP file.
        * [Get-AzureBatchRDPFile](https://msdn.microsoft.com/library/mt149851.aspx) – This PowerShell cmdlet gets the RDP file from the specified compute node and saves it to the specified file location or to a stream.
2.	Some applications produce large amounts of data that can be difficult to process. One way to solve this is through [efficient list querying](batch-efficient-list-queries.md).
