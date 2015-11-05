<properties
   pageTitle="NuGet Packages | Microsoft Azure"
   description="Guidance on NuGet Packages for general retry policy work."
   services=""
   documentationCenter="na"
   authors="dragon119"
   manager="masimms"
   editor=""
   tags=""/>

<tags
   ms.service="best-practice"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/09/2015"
   ms.author="masashin"/>

# NuGet Packages

<p class="lead">As more components begin to communicate, transient failures become
more important to smartly handle. The Transient Fault Handling work handled by the
retry policies NuGet package can help handle retries within a single instance.</p>

> This document was based on a draft as a proof of concept. It is not the actual
  reviewed guidance.

The Patterns & Practices `TransientFaultHandling` code is recommended for general retry policy work.

```
Install-Package EnterpriseLibrary.WindowsAzure.TransientFaultHandling
```

## Configuration

Section includes the configuration information for the retry feature:

Parameter            | Description
-------------------- | ----------------------
MaximumExecutionTime | Maximum execution time for the request, including all potential retry attempts.
ServerTimeOut        | Server timeout interval for the request
RetryPolicy          | Retry policy. See Policies section below

```csharp
/// <summary>
/// An interface required for request option types.
/// </summary>
public interface IRequestOptions
{
    IRetryPolicy RetryPolicy { get; set; }

    TimeSpan? ServerTimeout { get; set; }

    TimeSpan? MaximumExecutionTime { get; set; }
}
```

Programmatic:

- Support for setting on the Client.
- Enable overriding at operations provided by client

Configuration file:

```xml
<RetryPolicyConfiguration defaultRetryStrategy="Fixed Interval Retry Strategy">
    <linearInterval name="Fixed Interval Retry Strategy"
	retryInterval="00:00:01" maxRetryCount="10" />
    <exponentialBackoff name="Backoff Retry Strategy" minBackoff="00:00:01"
        maxBackoff="00:00:30" deltaBackoff="00:00:10" maxRetryCount="10"
        fastFirst="false"/>
</RetryPolicyConfiguration>
```

## Policies

### Exponential

Used for spacing out repeated attempts of service invocations exponentially to avoid service throttling.

__Approach:__

Exponentially increase the backoff interval between subsequent attempts. Add randomization to (+/- 20%) to backoff interval to avoid all clients retrying simultaneously

__Configuration:__

Parameter            | Description
-------------------- | -------------------------------------------------------
maxAttempt           | Number of retry attempts.
deltaBackoff         | Back-off interval between retries. Multiples of this timespan will be used for subsequent retry attempts.
MinBackoff           | Added to all retry intervals computed from deltaBackoff.
FastFirst            | Immediate first retry
MaxBackoff           | MaxBackoff is used if the computed retry interval is greater than MaxBackoff. This value cannot be changed.

__Implementation Logic:__

```csharp
if(!ExponentialRetry.FastFirst){
    Random r = new Random();
    double increment = (Math.Pow(2, currentRetryCount) - 1) * r.Next((int)(this.deltaBackoff.TotalMilliseconds * 0.8), (int)(this.deltaBackoff.TotalMilliseconds * 1.2));
    retryInterval = (increment < 0) ? ExponentialRetry.MaxBackoff :
    TimeSpan.FromMilliseconds(Math.Min(ExponentialRetry.MaxBackoff.TotalMilliseconds, ExponentialRetry.MinBackoff.TotalMilliseconds + increment));
} else {
    retryInterval = TimeSpan.Zero;
}
```

## Linear

Used for spacing out repeated attempts of service invocations linearly to avoid service throttling.

__Approach:__

Perform a specified number of retries, using a specified fixed time interval between retries. Add randomization to (+/- 20%) to backoff interval to avoid all clients retrying simultaneously.

__Configuration:__

Parameter            | Description
-------------------- | -------------------------------------------------------
maxAttempt | Number of retry attempts.
deltaBackoff | Back-off interval between retries.
FastFirst | Immediate first retry

__Implementation Logic:__

```csharp
if(!ExponentialRetry.FastFirst) {
    Random r = new Random();
    retryInterval = TimeSpan.FromMilliseconds(r.Next((int)(
    this.deltaBackoff.TotalMilliseconds * 0.8), (int)(this.deltaBackoff.TotalMilliseconds * 1.2)));
} else {
    retryInterval = TimeSpan.Zero;
}
```

## Adaptive

Used for spacing out repeated attempts of service invocations based on error code / metadata passed by service in response header.

__Approach:__

Perform a specified number of retries, using a backoff interval calculated based on error code / metadata passed by service in response header


__Configuration:__

Not configurable

__Implementation Logic:__

Based on error code / metadata passed by service in response header

__Circuit Break:__

Based on [Circuit Breaker](http://msdn.microsoft.com/library/dn589784.aspx)

## Extensibility

Public interface that can be implemented for providing Custom Retry policy

```csharp
public interface IRetryPolicy
{
    /// <summary>
    /// Generates a new retry policy for the current request attempt.
    /// </summary>
    IRetryPolicy CreateInstance();

    /// <summary>
    /// Determines whether the operation should be retried and the interval until the next retry.
    /// </summary>
    /// <param name="currentRetryCount">An integer specifying the number of retries for the given operation. A value of zero signifies this is the first error encountered.</param>
    /// <param name="statusCode">An integer containing the status code for the last operation.</param>
    /// <param name="retryInterval">A <see cref="TimeSpan"/> indicating the interval to wait until the next retry.</param>
    /// <returns><c>true</c> if the operation should be retried; otherwise, <c>false</c>.</returns>
    bool ShouldRetry(int currentRetryCount, int statusCode, out TimeSpan retryInterval);
}
```

## Telemetry

Log retries as ETW events using an EventSource. Here are the fields that should be logged for every retry attempt

Parameter            | Description
-------------------- | -------------------------------------------------------
requestId | ""
policyType | "RetryExponential"
operation | "Get:https://retry-guidance-tests.servicebus.windows.net/TestQueue/?api-version=2014-05"
operationStartTime | "9/5/2014 10:00:13 PM"
operationEndTime | "9/5/2014 10:00:14 PM"
iteration | "0"
iterationSleep | "00:00:00.1000000"
lastExceptionType | "Microsoft.ServiceBus.Messaging.MessagingCommunicationException"
exceptionMessage | "The remote name could not be resolved: 'retry-guidance-tests.servicebus.windows.net'.TrackingId:6a26f99c-dc6d-422e-8565-f89fdd0d4fe3,TimeStamp:9/5/2014 10:00:13 PM"
