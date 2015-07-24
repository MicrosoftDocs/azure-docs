
<properties
	pageTitle="Automatically Scale Compute Nodes in an Azure Batch Pool"
	description="Automatic scaling is accomplished by enabling it on a pool and associating a formula to the pool that is used to calculate the number of compute nodes that are needed to process the application."
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
	ms.date="07/21/2015"
	ms.author="davidmu"/>

# Automatically scale compute nodes in an Azure Batch pool

Automatically scaling compute nodes in an Azure Batch pool is a dynamic adjustment of the processing power that is used by your application. This ease of adjustment saves you time and money. To learn more about compute nodes and pools, see the [Azure Batch technical overview](batch-technical-overview.md).

Automatic scaling happens when it is enabled on a pool and a formula is associated to the pool. The formula is used to determine the number of compute nodes that are needed to process the application. Automatic scaling can be set when a pool is created, or you can do it later on an existing pool. The formula can also be updated on a pool where automatic scaling was enabled.

When automatic scaling is enabled, the number of available compute nodes are adjusted every 15 minutes based on the formula. The formula acts on samples that are collected every 5 seconds, but there is a 75 second delay between when a sample is collected and when it is available to the formula. These time factors must be considered when using the GetSample method described below.

It’s always a good practice to evaluate the formula before you assign it to a pool, and it’s important to monitor the status of the automatic scaling runs.

> [AZURE.NOTE] Each Azure Batch account is limited to a maximum number of compute nodes that can be used for processing. The system creates the nodes up to that limit and may not reach the target numbers specified by a formula.

## Define the formula

The formula that you define is used to decide the number of available compute nodes in the pool for the next interval of processing. The formula is a string that cannot exceed 8KB in size, and can include up to 100 statements separated by semicolons.

Statements in a formula are free-formed expressions. They can include any system-defined variables, user-defined variables, constant values, and supported operations on these variables or constants:

	VAR = Function(System defined variables, user-defined variables);

It’s possible for you to combine variables to make complex formulas:

	VAR₀ = Function₀(system-defined variables);
	VAR₁ = Function₁(system-defined variables, VAR₀);

### Variables

System-defined variables and user-defined variables can be used in a formula. You can set the value of these system-defined variables to manage compute nodes in a pool.

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
    <td>$TVMDeallocationOption</td>
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

You can only read the values of these system-defined variables to make adjustments based on metrics from compute nodes in the sample.

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
    <td>$SampleTVMCount</td>
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

These types are supported in a formula:

- double
- doubleVec
- string
- timestamp
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

These operations are allowed on the types listed above.

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

These predefined functions are available to define an automatic scaling formula.

<table>
  <tr>
    <th>Function</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>double avg(doubleVecList)</td>
    <td>The average value for all values in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double len(doubleVecList)</td>
    <td>The length of the vector created from the doubleVecList.</td>
  <tr>
    <td>double lg(double)</td>
    <td>Log base 2.</td>
  </tr>
  <tr>
    <td>doubleVec lg(doubleVecList)</td>
    <td>Componentwise log base 2. A vec(double) must be explicitly passed for single double parameter, otherwise the double lg(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double ln(double)</td>
    <td>Natural log.</td>
  </tr>
  <tr>
    <td>doubleVec ln(doubleVecList)</td>
    <td>Componentwise log base 2.  A vec(double) must be explicitly passed for single double parameter, otherwise the double lg(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double log(double)</td>
    <td>Log base 10.</td>
  </tr>
  <tr>
    <td>doubleVec log(doubleVecList)</td>
    <td>Componentwise log base 10. A vec(double) must be explicitly passed for single double parameter, otherwise the double log(double) version is assumed.</td>
  </tr>
  <tr>
    <td>double max(doubleVecList)</td>
    <td>The maximum value in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double min(doubleVecList)</td>
    <td>The minimum value in the doubleVecList.</td>
  </tr>
  <tr>
    <td>double norm(doubleVecList)</td>
    <td>The two-norm of the vector created from the doubleVecList.
  </tr>
  <tr>
    <td>double percentile(doubleVec v, double p)</td>
    <td>The percentile element of the vector v.</td>
  </tr>
  <tr>
    <td>double rand()</td>
    <td>A random value between 0.0 and 1.0.</td>
  </tr>
  <tr>
    <td>double range(doubleVecList)</td>
    <td>The difference between the min and max values in doubleVecList.</td>
  </tr>
  <tr>
    <td>double std(doubleVecList)</td>
    <td>The sample standard deviation of the values in the doubleVecList.</td>
  </tr>
  <tr>
    <td>stop()</td>
    <td>Stop auto-scaling expression evaluation.</td>
  </tr>
  <tr>
    <td>double sum(doubleVecList)</td>
    <td>The sum of all the components of doubleVecList.</td>
  </tr>
  <tr>
    <td>timestamp time(string dateTime="")</td>
    <td>The timestamp of the current time if no parameters passed, or the timestamp of the dateTime string if passed. Supported dateTime formats are W3CDTF and RFC1123.</td>
  </tr>
  <tr>
    <td>double val(doubleVec v, double i)</td>
    <td>The value of the element at location i in vector v with a starting index of zero.</td>
  </tr>
  <tr>
    <td>doubleVec vec(doubleVecList)</td>
    <td>Explicitly create a single doubleVec from doubleVecList.</td>
  </tr>
</table>

Some of the functions described in the table can accept a list as an argument. The comma separated list is any combination of double and doubleVec. For example:

	doubleVecList := ( (double | doubleVec)+(, (double | doubleVec) )* )?

The doubleVecList value is converted to a single doubleVec prior to evaluation. For example, if v = [1,2,3], then calling avg(v) is equivalent to calling avg(1,2,3) and calling avg(v, 7) is equivalent to calling avg(1,2,3,7).

### Sample data

The system-defined variables are objects that provide methods to access the associated data. For example, the following expression shows a request to get the last five minutes of CPU usage:

	$CPUPercent.GetSample(TimeInterval_Minute*5)

These methods that can be used to get sample data.

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
          <li><p><b>doubleVec GetSample((timestamp | timeinterval) startTime, (timestamp | timeinterval) endTime [, double samplePercent])</b> – Specifies a time frame for gathering data with both a start time and an end time.</p></li></ul></td>
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
    <p><b>doubleVec GetSamplePercent( (timestamp | timeinterval) startTime [, (timestamp | timeinterval) endTime] )</b> - Because the GetSample method fails if the percent of samples returned is less than the samplePercent specified, you can use the GetSamplePercent methods to first check, then perform an alternate action when enough samples are not present without halting their automatic scaling evaluation.</p></td>
  </tr>
</table>

### Metrics

These metrics that can be defined in a formula.

<table>
  <tr>
    <th>Metric</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Resource</td>
    <td><p>Based on CPU usage, bandwidth usage, memory usage, and number of compute nodes. These system variables described above are used in formulas to manage the compute nodes in a pool:</p>
    <p><ul>
      <li>$TargetDedicated</li>
      <li>$TVMDeallocationOption</li>
    </ul></p>
    <p>These system variables are used for making adjustments based on node metrics:</p>
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
    <p>This example shows a formula that is used to set the number of compute nodes in the pool to 110% of the current target number of nodes if the minimum average CPU usage of the past 10 minutes is above 70%:</p>
    <p><b>totalTVMs  = (min($CPUPercent.GetSample(TimeInterval\_Minute\*10)) > 0.7) ? ($CurrentDedicated \* 1.1) : $CurrentDedicated;</b></p>
    <p>This example shows a formula that is used to set the number of compute nodes in the pool to 90% of current target number of nodes if the average CPU usage of past 60 minutes is under 20%:</p>
    <p><b>totalTVMs = (avg($CPUPercent.GetSample(TimeInterval\_Minute\*60)) < 0.2) ? ($CurrentDedicated \* 0.9) : totalTVMs;</b></p>
    <p>This example sets the target number of dedicated compute nodes to a maximum of 400:</p>
    <p><b>$TargetDedicated = min(400, totalTVMs);</b></p></td>
  </tr>
  <tr>
    <td>Task</td>
    <td><p>Based on the status of tasks, such as Active, Pending, and Completed.</p>
    <p>These system variables are used for making adjustments based on task metrics:</p>
    <p><ul>
      <li>$ActiveTasks</li>
      <li>$RunningTasks</li>
      <li>$SucceededTasks</li>
      <li>$FailedTasks</li>
      <li>$CurrentDedicated</li></ul></p>
    <p>This example shows a formula that detects whether 70% of the samples have been recorded in the past 15 minutes. If it doesn’t, it uses the last sample. It tries to grow the number of compute nodes to match the number of active tasks, with a maximum of 3. It sets the number of nodes to one-fourth the number of active tasks because the MaxTasksPerVM property of the pool is set to 4. It also sets the Deallocation option to “taskcompletion” to keep the machine until the tasks finish.</p>
    <p><b>$Samples = $ActiveTasks.GetSamplePercent(TimeInterval\_Minute \* 15);
    $Tasks = $Samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1),avg($ActiveTasks.GetSample(TimeInterval\_Minute \* 15)));
    $Cores = $TargetDedicated \* 4;
    $ExtraVMs = ($Tasks - $Cores) / 4;
    $TargetVMs = ($TargetDedicated+$ExtraVMs);$TargetDedicated = max(0,min($TargetVMs,3));
    $TVMDeallocationOption = taskcompletion;</b></p></td>
  </tr>
</table>

## Evaluate the automatic scaling formula

It’s always a good practice to evaluate a formula before you use it in your application. The formula is evaluated by doing a test run on an existing pool. Do this by using one of these methods:

- [IPoolManager.EvaluateAutoScale Method](https://msdn.microsoft.com/library/azure/dn931617.aspx) or the [IPoolManager.EvaluateAutoScaleAsync Method](https://msdn.microsoft.com/library/azure/dn931545.aspx) – These .NET methods require the name of an existing pool and the string that contains the automatic scaling formula. The results of the call are contained in an instance of the [AutoScaleEvaluation Class](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscaleevaluation.aspx).
- [Evaluate an automatic scaling formula](https://msdn.microsoft.com/library/azure/dn820183.aspx) – In this REST operation, the pool name is specified in the URI and the automatic scaling formula is specified in the autoScaleFormula element of the request body. The response of the operation contains any error information that might be related to the formula.

## Create a pool with automatic scaling enabled

Create a pool in the one of these ways:

- [New-AzureBatchPool](https://msdn.microsoft.com/library/azure/mt125936.aspx) – This cmdlet uses the AutoScaleFormula parameter to specify the automatic scaling  formula.
- [IPoolManager.CreatePool Method](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.ipoolmanager.createpool.aspx) – After this .NET method is called to create a pool, the [ICloudPool.AutoScaleEnabled Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.icloudpool.autoscaleenabled.aspx) and the [ICloudPool.AutoScaleFormula Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.icloudpool.autoscaleformula.aspx) are set on the pool to enable automatic scaling.
- [Add a pool to an account](https://msdn.microsoft.com/library/azure/dn820174.aspx) – The enableAutoScale and autoScaleFormula elements are used in this REST API to set up automatic scaling for the pool when it is created.

> [AZURE.NOTE] If you set up automatic scaling when the pool is created using the resources mentioned above, the targetDedicated parameter for the pool is not used.

## Enable automatic scaling after a pool was created

If you already set up a pool with a specified a number of compute nodes using the targetDedicated parameter, you can update the existing pool at a later time to automatically scale. You do this in one of these ways:

- [IPoolManager.EnableAutoScale Method](https://msdn.microsoft.com/library/azure/dn931709.aspx) – This .NET method requires the name of the existing pool and the automatic scaling formula.
- [Enable/Disable Autoscale](https://msdn.microsoft.com/library/azure/dn820173.aspx) – This REST API requires the name of the existing pool in the URI and the automatic scaling formula in the request body.

> [AZURE.NOTE] The value that was specified for the targetDedicated parameter when the pool was created is ignored when the automatic scaling formula is evaluated.

## Obtain information about automatic scaling runs

You should periodically check the results of the automatic scaling runs. Do this in one of these ways:

- [ICloudPool.AutoScaleRun Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.icloudpool.autoscalerun.aspx) – When using the .NET library, this property of a pool provides an instance of the [AutoScaleRun Class](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.aspx), which provides an  [AutoScaleRun.Error Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.error.aspx), a [AutoScaleRun.Results Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.results.aspx), and a [AutoScaleRun.Timestamp Property](https://msdn.microsoft.com/library/azure/microsoft.azure.batch.autoscalerun.timestamp.aspx).
- [Get information about a pool](https://msdn.microsoft.com/library/dn820165.aspx) – This REST API returns information about the pool, which includes the latest automatic scaling run.

## Next Steps

1.	You might need to access the compute node to be able to fully assess the efficiency of your application. To take advantage of remote access, a user account must be added to the compute node that you want to access and an RDP file must be retrieved from that nodee. Add the user account in one of these ways:

	- [New-AzureBatchVMUser](https://msdn.microsoft.com/library/mt149846.aspx) – This cmdlet takes the pool name, compute node name, account name, and password as parameters.
	- [IVM.CreateUser Method](https://msdn.microsoft.com/library/microsoft.azure.batch.ivm.createuser.aspx) – This .NET method creates an instance of the [IUser Interface](https://msdn.microsoft.com/library/microsoft.azure.batch.iuser.aspx) on which the account name and password can be set for the compute node.
	- [Add a user account to a node](https://msdn.microsoft.com/library/dn820137.aspx) – The name of the pool and the compute node are specified in the URI and the account name and password are sent to the node in the request body of this REST API.

		Get the RDP file:

	- [IVM.GetRDPFile Method](https://msdn.microsoft.com/library/microsoft.azure.batch.ivm.getrdpfile.aspx) – This .NET method requires the name of the RDP file to create.
	- [Get a remote desktop protocol file from a node](https://msdn.microsoft.com/library/dn820120.aspx) – This REST API requires the name of the pool and the name of the compute node. The response contains the contents of the RDP file.
	- [Get-AzureBatchRDPFile](https://msdn.microsoft.com/library/mt149851.aspx) – This cmdlet gets the RDP file from the specified compute node and saves it to the specified file location or to a stream.
2.	Some applications produce large amounts of data that can be difficult to process. One way to solve this is through [efficient list querying](batch-efficient-list-queries.md).
