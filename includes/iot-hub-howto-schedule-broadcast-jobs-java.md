---
title: Schedule and broadcast jobs (Java)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for Java to create backend service application code for job scheduling.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.devlang: java
ms.topic: include
ms.date: 1/15/2025
ms.custom: mqtt, devx-track-java, devx-track-extended-java
---

  * Requires [Java SE Development Kit 8](/azure/developer/java/fundamentals/). Make sure you select **Java 8** under **Long-term support** to navigate to downloads for JDK 8.

## Overview

This article describes how to use the [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) to create backend service application code to schedule job to invoke a direct method or perform a device twin update on one or more devices.

### Service import statements

The [JobClient](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient) class contains methods that services can use to schedule jobs.

Use the following service import statements to access the Azure IoT SDK for Java.

```java
import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceTwinDevice;
import com.microsoft.azure.sdk.iot.service.devicetwin.Pair;
import com.microsoft.azure.sdk.iot.service.devicetwin.Query;
import com.microsoft.azure.sdk.iot.service.devicetwin.SqlQuery;
import com.microsoft.azure.sdk.iot.service.jobs.JobClient;
import com.microsoft.azure.sdk.iot.service.jobs.JobResult;
import com.microsoft.azure.sdk.iot.service.jobs.JobStatus;

import java.util.Date;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
```

### Connect to the IoT Hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use a [JobClient](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient) constructor to create the connection to IoT hub. The `JobClient` object handles the communication with your IoT hub.

This article describes back-end code that can schedule a job to invoke a direct method, schedule a job to update a device twin, and monitors the progress of a job for one or more devices. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```java
public static final String iotHubConnectionString = "{Shared access policy connection string}";
JobClient jobClient = new JobClient(iotHubConnectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-java](iot-hub-howto-connect-service-iothub-entra-java.md)]

### Schedule a direct method update job

Use [scheduleDeviceMethod](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient?#com-microsoft-azure-sdk-iot-service-jobs-jobclient-scheduledevicemethod(java-lang-string-java-lang-string-java-lang-string-java-lang-long-java-lang-long-java-lang-object-java-util-date-long)) to run a direct method on one or multiple devices.

This example method schedules a job for a direct method named "lockDoor" on a device named "Device-1".

```java
// Schedule a job now to call the lockDoor direct method
// against a single device. Response and connection
// timeouts are set to 5 seconds.
String deviceId = "Device-1";
String jobId = "DMCMD" + UUID.randomUUID();  //Job ID must be unique

// How long the job is permitted to run without
// completing its work on the set of devices
private static final long maxExecutionTimeInSeconds = 30;

System.out.println("Schedule job " + jobId + " for device " + deviceId);
try {
  JobResult jobResult = jobClient.scheduleDeviceMethod(jobId,
    "deviceId='" + deviceId + "'",
    "lockDoor",
    5L, 5L, null,
    new Date(),
    maxExecutionTimeInSeconds);
} catch (Exception e) {
  System.out.println("Exception scheduling direct method job: " + jobId);
  System.out.println(e.getMessage());
}
```

### Schedule a device twin update job

Use [scheduleUpdateTwin](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient?#com-microsoft-azure-sdk-iot-service-jobs-jobclient-scheduleupdatetwin(java-lang-string-java-lang-string-com-microsoft-azure-sdk-iot-service-devicetwin-devicetwindevice-java-util-date-long)) to schedule a job to run a device twin update on one or multiple devices.

First, prepare a [DeviceTwinDevice](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicetwindevice) record for the device twin update. For example:

```java
String deviceId = "Device-1";

//Create a device twin desired properties update object
DeviceTwinDevice twin = new DeviceTwinDevice(deviceId);
Set<Pair> desiredProperties = new HashSet<Pair>();
desiredProperties.add(new Pair("Building", 43));
desiredProperties.add(new Pair("Floor", 3));
twin.setDesiredProperties(desiredProperties);
// Optimistic concurrency control
twin.setETag("*");
```

Then call `scheduleUpdateTwin` to schedule the update job. For example:

```java
String jobId = "DPCMD" + UUID.randomUUID();  //Unique job ID

// How long the job is permitted to run without
// completing its work on the set of devices
private static final long maxExecutionTimeInSeconds = 30;

// Schedule the update twin job to run now for a single device
System.out.println("Schedule job " + jobId + " for device " + deviceId);
try {
  JobResult jobResult = jobClient.scheduleUpdateTwin(jobId, 
    "deviceId='" + deviceId + "'",
    twin,
    new Date(),
    maxExecutionTimeInSeconds);
} catch (Exception e) {
  System.out.println("Exception scheduling desired properties job: " + jobId);
  System.out.println(e.getMessage());
}
```

### Monitor a job

Use [getJob](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient?#com-microsoft-azure-sdk-iot-service-jobs-jobclient-getjob(java-lang-string)) to fetch job information based on a specific job ID. `getJob` returns a [JobResult](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobresult) object that contains methods and properties you can use to check job information including running status.

For example:

```java
try {
  JobResult jobResult = jobClient.getJob(jobId);
  if(jobResult == null)
  {
    System.out.println("No JobResult for: " + jobId);
    return;
  }
  // Check the job result until it's completed
  while(jobResult.getJobStatus() != JobStatus.completed)
  {
    Thread.sleep(100);
    jobResult = jobClient.getJob(jobId);
    System.out.println("Status " + jobResult.getJobStatus() + " for job " + jobId);
  }
  System.out.println("Final status " + jobResult.getJobStatus() + " for job " + jobId);
} catch (Exception e) {
  System.out.println("Exception monitoring job: " + jobId);
  System.out.println(e.getMessage());
  return;
}
```

### Query a job status

Use [queryDeviceJob](/java/api/com.microsoft.azure.sdk.iot.service.jobs.jobclient?#com-microsoft-azure-sdk-iot-service-jobs-jobclient-querydevicejob(java-lang-string)) to query the job status for one or more jobs.

For example:

```java
private static void queryDeviceJobs(JobClient jobClient, String start) throws Exception {
  System.out.println("\nQuery device jobs since " + start);

  // Create a jobs query using the time the jobs started
  Query deviceJobQuery = jobClient
      .queryDeviceJob(SqlQuery.createSqlQuery("*", SqlQuery.FromType.JOBS, "devices.jobs.startTimeUtc > '" + start + "'", null).getQuery());

  // Iterate over the list of jobs and print the details
  while (jobClient.hasNextJob(deviceJobQuery)) {
    System.out.println(jobClient.getNextJob(deviceJobQuery));
  }
}
```

### SDK schedule job example

The Azure IoT SDK for Java provides a working sample of a service app that handles job scheduling tasks. For more information, see [Job Client Sample](https://github.com/Azure/azure-iot-service-sdk-java/blob/main/service/iot-service-samples/job-client-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/JobClientSample.java).
