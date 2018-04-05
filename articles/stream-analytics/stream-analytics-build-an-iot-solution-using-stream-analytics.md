---
title: Build an IoT solution by using Stream Analytics | Microsoft Docs
description: Getting-started tutorial for the Stream Analytics IoT solution of a tollbooth scenario
services: stream-analytics
author: SnehaGunda
ms.author: sngun
reviewer: jasonh, sngun
manager: kfile
ms.service: stream-analytics
ms.topic: article
ms.workload: data-services
ms.date: 03/21/2018
---

# Build an IoT solution by using Stream Analytics

## Introduction
In this tutorial, you will learn how to use Azure Stream Analytics to get real-time insights from your data. Developers can easily combine streams of data, such as click-streams, logs, and device-generated events, with historical records or reference data to derive business insights. As a fully managed, real-time stream computation service that's hosted in Microsoft Azure, Azure Stream Analytics provides built-in resiliency, low latency, and scalability to get you up and running in minutes.

After completing this tutorial, you will be able to:

* Familiarize yourself with the Azure Stream Analytics portal.
* Configure and deploy a streaming job.
* Articulate real-world problems and solve them by using the Stream Analytics query language.
* Develop streaming solutions for your customers by using Stream Analytics with confidence.
* Use the monitoring and logging experience to troubleshoot issues.

## Prerequisites
You will need the following prerequisites to complete this tutorial:
* An [Azure subscription](https://azure.microsoft.com/pricing/free-trial/)

## Scenario introduction: “Hello, Toll!”
A toll station is a common phenomenon. You encounter them on many expressways, bridges, and tunnels across the world. Each toll station has multiple toll booths. At manual booths, you stop to pay the toll to an attendant. At automated booths, a sensor on top of each booth scans an RFID card that's affixed to the windshield of your vehicle as you pass the toll booth. It is easy to visualize the passage of vehicles through these toll stations as an event stream over which interesting operations can be performed.

![Picture of cars at toll booths](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image1.jpg)

## Incoming data
This tutorial works with two streams of data. Sensors installed in the entrance and exit of the toll stations produce the first stream. The second stream is a static lookup dataset that has vehicle registration data.

### Entry data stream
The entry data stream contains information about cars as they enter toll stations.

| TollID | EntryTime | LicensePlate | State | Make | Model | VehicleType | VehicleWeight | Toll | Tag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |2014-09-10 12:01:00.000 |JNB 7001 |NY |Honda |CRV |1 |0 |7 | |
| 1 |2014-09-10 12:02:00.000 |YXZ 1001 |NY |Toyota |Camry |1 |0 |4 |123456789 |
| 3 |2014-09-10 12:02:00.000 |ABC 1004 |CT |Ford |Taurus |1 |0 |5 |456789123 |
| 2 |2014-09-10 12:03:00.000 |XYZ 1003 |CT |Toyota |Corolla |1 |0 |4 | |
| 1 |2014-09-10 12:03:00.000 |BNJ 1007 |NY |Honda |CRV |1 |0 |5 |789123456 |
| 2 |2014-09-10 12:05:00.000 |CDE 1007 |NJ |Toyota |4x4 |1 |0 |6 |321987654 |

Here is a short description of the columns:

| Column | Description |
| --- | --- |
| TollID |The toll booth ID that uniquely identifies a toll booth |
| EntryTime |The date and time of entry of the vehicle to the toll booth in UTC |
| LicensePlate |The license plate number of the vehicle |
| State |A state in United States |
| Make |The manufacturer of the automobile |
| Model |The model number of the automobile |
| VehicleType |Either 1 for passenger vehicles or 2 for commercial vehicles |
| WeightType |Vehicle weight in tons; 0 for passenger vehicles |
| Toll |The toll value in USD |
| Tag |The e-Tag on the automobile that automates payment; blank where the payment was done manually |

### Exit data stream
The exit data stream contains information about cars leaving the toll station.

| **TollId** | **ExitTime** | **LicensePlate** |
| --- | --- | --- |
| 1 |2014-09-10T12:03:00.0000000Z |JNB 7001 |
| 1 |2014-09-10T12:03:00.0000000Z |YXZ 1001 |
| 3 |2014-09-10T12:04:00.0000000Z |ABC 1004 |
| 2 |2014-09-10T12:07:00.0000000Z |XYZ 1003 |
| 1 |2014-09-10T12:08:00.0000000Z |BNJ 1007 |
| 2 |2014-09-10T12:07:00.0000000Z |CDE 1007 |

Here is a short description of the columns:

| Column | Description |
| --- | --- |
| TollID |The toll booth ID that uniquely identifies a toll booth |
| ExitTime |The date and time of exit of the vehicle from toll booth in UTC |
| LicensePlate |The license plate number of the vehicle |

### Commercial vehicle registration data
The tutorial uses a static snapshot of a commercial vehicle registration database.

| LicensePlate | RegistrationId | Expired |
| --- | --- | --- |
| SVT 6023 |285429838 |1 |
| XLZ 3463 |362715656 |0 |
| BAC 1005 |876133137 |1 |
| RIV 8632 |992711956 |0 |
| SNY 7188 |592133890 |0 |
| ELH 9896 |678427724 |1 |

Here is a short description of the columns:

| Column | Description |
| --- | --- |
| LicensePlate |The license plate number of the vehicle |
| RegistrationId |The vehicle's registration ID |
| Expired |The registration status of the vehicle: 0 if vehicle registration is active, 1 if registration is expired |

## Set up the environment for Azure Stream Analytics
To complete this sample, you need a Microsoft Azure subscription. If you do not have an Azure account, you can [request a free trial version](http://azure.microsoft.com/pricing/free-trial/).

Be sure to follow the steps in the “Clean up your Azure account” section at the end of this article so that you can make the best use of your Azure credit.

## Provision Azure resources required for the tutorial
There are several resources that can easily be deployed in a resource group together with a few clicks. The sample definition is hosted in github repository at [https://github.com/Azure/azure-stream-analytics/tree/master/Samples/TollApp](https://github.com/Azure/azure-stream-analytics/tree/master/Samples/TollApp).

### Deploy the TollApp template in the Azure portal
1. To deploy the TollApp environment to Azure, [Use this link to fill out the Azure Template](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-stream-analytics%2Fmaster%2FSamples%2FTollApp%2FVSProjects%2FTollAppDeployment%2Fazuredeploy.json)
2. Sign in to the Azure portal if prompted.
3. Choose the subscription in which the various resources will be billed.
4. Specify a new resource group, with a unique name, for example `MyTollApp`. 
4. Select an Azure location.
5. Specify an **Interval** as a number of seconds. This value is used in the sample web app, for how frequently to send data into Event Hub. 
6. Check to agree to the terms and conditions.
7. Select **Pin to dashboard** so that you can easily locate the resources later on.
8. Select **Purchase** to deploy the sample template.
9. After a few moments, a notification will appear to confirm the **Deployment succeeded**.

### Review the Azure Stream Analytics TollApp resources
1. Log in to the Azure portal
2. Locate the Resource Group that you named in the previous section.
3. Verify that the following services are listed in the resource group:
   - One Cosmos DB Account
   - One Azure Stream Analytics Job
   - One Azure Storage Account
   - One Azure Event Hub
   - Two Web Apps

### Start the TollApp streaming job
The Azure Stream Analytics Job is not started upon deployment. Steps to start the job

1. Log into Microsoft Azure Portal.
2. Open the Stream Analytics jobs.
3. Select the job starting with the name **tollapp\*** (name contains random characters for uniqueness).
4. On the **Overview** page of the job, select **Start**.
5. After a few moments, cnce the job is running, on the **Overview** page of the streaming job, view the **Monitoring** graph. The graph should show several thousand input events, and tens of output events.

## Introduction to Azure Stream Analytics query language
- - -
Let’s say that you need to count the number of vehicles that enter a toll booth. Because this is a continuous stream of events, you have to define a “period of time.” Let's modify the question to be “How many vehicles enter a toll booth every three minutes?” This is commonly referred to as the tumbling count.

Let’s look at the Azure Stream Analytics query that answers this question:

```sql
SELECT TollId, System.Timestamp AS WindowEnd, COUNT(*) AS Count
INTO CosmosDB
FROM EntryStream TIMESTAMP BY EntryTime
GROUP BY TUMBLINGWINDOW(minute, 3), TollId
```

As you can see, Azure Stream Analytics uses a query language that's like SQL and adds a few extensions to specify time-related aspects of the query.

For more details, read about [Time Management](https://msdn.microsoft.com/library/azure/mt582045.aspx) and [Windowing](https://msdn.microsoft.com/library/azure/dn835019.aspx)
constructs used in the query.

## Testing Azure Stream Analytics queries
Now that you have written your first Azure Stream Analytics query, it is time to test it by using sample data files located in your TollApp folder in the following path:

**..\\TollApp\\TollApp\\Data**

This folder contains the following files:

* Entry.json
* Exit.json
* Registration.json

## Question 1: Number of vehicles entering a toll booth
1. Open the Azure portal and go to your created Azure Stream Analytics job. Click the **QUERY** tab and review the query syntax.

2. Review the job input and output to familiarize yourself.

3. To validate this query against sample data, upload the data into the EntryStream input by clicking the ... symbol and selecting **Upload sample data from file**.

    ![Screenshot of the Entry.json file](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image41.png)

4. In the pane that appears select the file (Entry.json) on your local machine and click **OK**. The **Test** icon will now illuminate and be clickable.
   
    ![Screenshot of the Entry.json file](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image42.png)

5. Validate that the output of the query is as expected:
   
    ![Results of the test](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image43.png)

## Question 2: Report total time for each car to pass through the toll booth
The average time that's required for a car to pass through the toll helps to assess the efficiency of the process and the customer experience.

To find the total time, you need to join the EntryTime stream with the ExitTime stream. You will join the streams on TollId and LicencePlate columns. The **JOIN** operator requires you to specify temporal leeway that describes the acceptable time difference between the joined events. You will use **DATEDIFF** function to specify that events should be no more than 15 minutes from each other. You will also apply the **DATEDIFF** function to exit and entry times to compute the actual time that a car spends in the toll station. Note the difference of the use of **DATEDIFF** when it's used in a **SELECT** statement rather than a **JOIN** condition.

    SELECT EntryStream.TollId, EntryStream.EntryTime, ExitStream.ExitTime, EntryStream.LicensePlate, DATEDIFF (minute , EntryStream.EntryTime, ExitStream.ExitTime) AS DurationInMinutes
    FROM EntryStream TIMESTAMP BY EntryTime
    JOIN ExitStream TIMESTAMP BY ExitTime
    ON (EntryStream.TollId= ExitStream.TollId AND EntryStream.LicensePlate = ExitStream.LicensePlate)
    AND DATEDIFF (minute, EntryStream, ExitStream ) BETWEEN 0 AND 15

1. To test this query, update the query on the **QUERY** for the job. Add the test file for **ExitStream** just like **EntryStream** was entered above.
   
2. Click **Test**.

3. Select the check box to test the query and view the output:
   
    ![Output of the test](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image45.png)

## Question 3: Report all commercial vehicles with expired registration
Azure Stream Analytics can use static snapshots of data to join with temporal data streams. To demonstrate this capability, use the following sample question.

If a commercial vehicle is registered with the toll company, it can pass through the toll booth without being stopped for inspection. You will use Commercial Vehicle Registration lookup table to identify all commercial vehicles that have expired registrations.

```
SELECT EntryStream.EntryTime, EntryStream.LicensePlate, EntryStream.TollId, Registration.RegistrationId
FROM EntryStream TIMESTAMP BY EntryTime
JOIN Registration
ON EntryStream.LicensePlate = Registration.LicensePlate
WHERE Registration.Expired = '1'
```

To test a query by using reference data, you need to define an input source for the reference data, which you have done already.

To test this query, paste the query into the **QUERY** tab, click **Test**, and specify the two input sources and the registration sample data and click **Test**.  
   
![Output of the test](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image46.png)

## Start the Stream Analytics job
Now it's time to finish the configuration and start the job. Save the query from Question 3, which will produce output that matches the schema of the **TollDataRefJoin** output table.

Go to the job **DASHBOARD**, and click **START**.

![Screenshot of the Start button in the job dashboard](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image48.png)

In the dialog box that opens, change the **START OUTPUT** time to **CUSTOM TIME**. Change the hour to one hour before the current time. This change ensures that all events from the event hub are processed since you started to generate the events at the beginning of the tutorial. Now click the **Start** button to start the job.

![Selection of custom time](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image49.png)

Starting the job can take a few minutes. You can see the status on the top-level page for Stream Analytics.

![Screenshot of the status of the job](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image50.png)

## Check results in Visual Studio
1. Open Visual Studio Server Explorer, and right-click the **TollDataRefJoin** table.
2. Click **Show Table Data** to see the output of your job.
   
    ![Selection of "Show Table Data" in Server Explorer](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image51.jpg)

## Scale out Azure Stream Analytics jobs
Azure Stream Analytics is designed to elastically scale so that it can handle large volumes of data. The Azure Stream Analytics query can use a **PARTITION BY** clause to tell the system that this step will scale out. **PartitionId** is a special column that the system adds to match the partition ID of the input (event hub).

    SELECT TollId, System.Timestamp AS WindowEnd, COUNT(*)AS Count
    FROM EntryStream TIMESTAMP BY EntryTime PARTITION BY PartitionId
    GROUP BY TUMBLINGWINDOW(minute,3), TollId, PartitionId

1. Stop the current job, update the query in the **QUERY** tab, and open the **Settings** gear in the job dashboard. Click **Scale**.
   
    **STREAMING UNITS** define the amount of compute power that the job can receive.
2. Change the drop-down from 1 from 6.
   
    ![Screenshot of selecting six streaming units](media/stream-analytics-build-an-iot-solution-using-stream-analytics/image52.png)
3. Go to the **OUTPUTS** tab and change the name of the SQL table to **TollDataTumblingCountPartitioned**.

If you start the job now, Azure Stream Analytics can distribute work across more compute resources and achieve better throughput. Note that the TollApp application is also sending events partitioned by TollId.

## Monitor
The **MONITOR** area contains statistics about the running job. First-time configuration is needed to use the storage account in the same region (name toll like the rest of this document).   

![Screenshot of monitor](media/stream-analytics-build-an-iot-solution-using-stream-analytics/monitoring.png)

You can access **Activity Logs** from the job dashboard **Settings** area as well.


## Conclusion
This tutorial introduced you to the Azure Stream Analytics service. It demonstrated how to configure inputs and outputs for the Stream Analytics job. Using the Toll Data scenario, the tutorial explained common types of problems that arise in the space of data in motion and how they can be solved with simple SQL-like queries in Azure Stream Analytics. The tutorial described SQL extension constructs for working with temporal data. It showed how to join data streams, how to enrich the data stream with static reference data, and how to scale out a query to achieve higher throughput.

Although this tutorial provides a good introduction, it is not complete by any means. You can find more query patterns using the SAQL language at [Query examples for common Stream Analytics usage patterns](stream-analytics-stream-analytics-query-patterns.md).
Refer to the [online documentation](https://azure.microsoft.com/documentation/services/stream-analytics/) to learn more about Azure Stream Analytics.

## Clean up the TollApp resources from your Azure account
1. Stop the Stream Analytics job in the Azure portal.
2. Locate the resource group that contains 8 resources related to the TollApp template.
3. Select **Delete resource group** and type the name of the resource group to confirm deletion.
