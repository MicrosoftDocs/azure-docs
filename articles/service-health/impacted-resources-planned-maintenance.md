---
title: Resource impact from Azure planned maintenance events
description: This article details where to find information from Azure Service Health about how Azure Planned Maintenance impact your resources.
ms.topic: conceptual
ms.date: 9/29/2023
---

# Resource impact from Azure planned maintenance

In support of the experience for viewing Impacted Resources, Service Health has enabled a new feature to:

- Display resources that are impacted by a planned maintenance event.
- Provide impacted resources information for planned maintenance via the Service Health Portal. 

This article details what is communicated to users and where they can view information about their impacted resources.

>[!Note]
>This feature will be rolled out in phases. Initially, impacted resources will only be shown for **SQL resources with advance customer notifications and rebootful updates for compute resources.** Planned maintenance impacted resources coverage will be expanded to other resource types and scenarios in the future.

## Viewing Impacted Resources for Planned Maintenance Events on the Service Health Portal 

In the Azure portal, the **Impacted Resources** tab under **Service Health** > **Planned Maintenance** displays resources that are affected by a planned maintenance event. The following example of the Impacted Resources tab shows a planned maintenance event with impacted resources.

:::image type="content" source="./media/impacted-resource-maintenance/grid-image.PNG" alt-text="Screenshot of planned maintenance impacted resources in Azure Service Health.":::

Service Health provides the information below   on resources impacted by a planned maintenance event:

|Fields  |Description |
|---------|---------|
|**Resource Name**|Name of the resource impacted by the planned maintenance event|
|**Resource Type**|Type of resource impacted by the planned maintenance event|
|**Resource Group**|Resource group which contains the impacted resource|
|**Region**|Region which contains the impacted resource|
|**Subscription ID**|Unique ID for the subscription that contains the impacted resource|
|**Action(*)**|Link to the apply update page during Self-Service window (only for rebootful updates on compute resources)|
|**Self-serve Maintenance Due Date(*)**|Due date for Self-Service window during which the update can be applied by the user (only for rebootful updates on compute resources)|

>[!Note]
>Fields with an asterisk * are optional fields that are available depending on the resource type.



## Filters

Customers can filter on the results using the below filters
- Region
- Subscription ID: All Subscription IDs the user has access to 
- Resource Type: All Resource types under the users subscriptions

:::image type="content" source="./media/impacted-resource-maintenance/details-filters.PNG" alt-text="Screenshot of filters used to sort impacted resources.":::

## Export to CSV

The list of impacted resources can be exported to an excel file by clicking on this option.

:::image type="content" source="./media/impacted-resource-maintenance/details-csv.PNG" alt-text="Screenshot of export to csv button.":::

The CSV file includes the properties associated with each event and additional details per event level. This CSV could be used as a static point in time snapshot for all the active events under the Service Health Planned Maintenance view. These details are a subset of more event level information available through Service Health API, which could be integrated with Event Grid or other events automation solutions.

:::image type="content" source="./media/impacted-resource-maintenance/SH-PM-CSV-2.png" alt-text="Screenshot of csv file format.":::


Below is a short description of each of the column properties:
|Column Property  |Description  |
|---------|---------|
|**Title**|The Title of the published event|
|**TrackingId**|This is a unique identifier for each event, across different Service Health categories|
|**Impacted Services**|The service(s) applicable to the published Maintenance event|
|**Impact Start Time**|This is the Start Time in UTC for the event. There could be smaller work windows or timeframe within each event shared through update communications|
|**Impact End Time**|This is the End Time in UTC for the event. There could be smaller work windows or timeframe within each event shared through update communications|
|**Subscription(s)**|One of more SubscriptionId’s which are in scope of the published event|
|**Estimated Impact Duration(^)**|Estimated time in seconds for resource level impact. An event window could be for a broader timeframe ( several hours or sometimes days), however this field shows the estimated impact duration within the scheduled window|
|**Impact Type(^)**|These are pre-defined Impact types which are helpful in categorizing events based on how the service or resource level impact would be observed, during the event window.(***More details on categories in following section***) |
|**Recommendation(^)**|Steps or recommended action  users, based on Impact Type |

>[!Note]
>For fields with an ^ - The Impact Duration, Impact Type and Recommendation are newly introduced properties which might be empty for some services, as these are yet to adopt the new layout.

### Maintenance Impact Type and Impact Duration Fields
In our continuous quest to make the Planned Maintenance notifications more reliable and predictable for customers, we recently added 3 new properties, specifically on the Impact aspect for the published event. These properties are currently available through CSV export option or through Service Health API call. 

**Note**: ***We are enabling more services to include these fields as part of event publishing, however there is a subset of services which are in process of onboarding and these fields might show no value for their events***. 

#### What kind of Impact will this event have on my hosted services or end users? 
The new property ‘Impact Type’ is the key to answering this common concern. Among many other enhancements across Azure Service Health Portal UI for Maintenance events, the most important addition is the new Impact Type field which gives a quick idea on what is the presumptive or overall impact expected during the scheduled window.  

Currently we have a pre-defined set of categories, which cover or represent different impact symptoms, across Azure Services. There is a likelihood of minor overlap, as each service has its unique criteria on ‘Impact’, per the product design. 

Below mapping provides more insight into possible values for Impact Type property. The description columns also show the mapping with Industry standard terms like Blackout, Brownout and Grayout.

|Impact Type Category | Description  | Examples    |
|--|--|--|
| **Service Availability** | **#Blackout**, **#Impactful**, #ServicePaused, #TempStorageLoss <br><br>Resource or service is in paused state for a short duration. Events under this category might temporarily affect overall resource availability and/or user connections. | **Networking**: VMs might lose network connectivity and/or existing connections might be terminated.<br><br>**Compute (VMs)**: Temporary pause or freeze on virtual cores (CPU) affecting VM response times and connectivity. Service-heal process during forced update or Host health degradation is another common scenario.<br><br>**Storage**: Complete or temporary pause on Disk IOs (eg: driver updates, or storage agent updates)<br><br>**SQL**: Temporary impact to SQL databases from maintenance reconfigurations affecting query response times and brief loss of database connection.  Long-running queries may be interrupted and may need to be restarted  |
| **Performance Degradation** | **#Brownout**, **#ModerateImpact**, #Latency, #IntermittentTimeouts, #Slowness, #VMStatePreserved <br><br>The symptoms could vary for each service or product. For some like SQL Apps, latency or slower response times might be more evident to users or queries being executed.<br>Resource is usually up and running but with degraded or limited functionality. More prominent for sensitive workloads.  | **Networking**: Visible degradation in connectivity leading to intermittent timeouts or disconnections. Slow response times while accessing disk drives (eg: during update the Accelerated Networking capability might be paused). Intermittent packet loss.<br><br>**Compute (VMs)**: ***Live Migration*** activity. Applications or users might observe slower processing. Another scenario is NIC reset where degraded connectivity could be observed for up to 9 seconds.<br><br>**Storage**: Possiblility of degraded disk IOPSs<br><br>**SQL**: In case of DB latency Request may experience delay or failure in read or write operations |
| **Network Connectivity** | **#Grayout**, **#ModerateImpact**, #ConnectionTimeouts, #RetriesSucceed <br><br>Moderate user impact as the events relate to Network stack. The impact duration is shorter as there are redundant layers built in per architecture design, which minimizes the overall impact.<br>These could be for events which related to T0, T1, NIC or NMAgent upgrades and/or regional or zonal network cables and switches. | **Networking**: Existing connections continue to operate, but new connections cannot be established (eg: this can happen during VFP updates).<br>Some of the ToR (Top of Rack) device related maintenance falls in this category |
| **Resource Unavailable** | **#Impactful**, #Reboot, #Restart, #Redeploy, #Shutdown, #NoConnectivity, **#Downtime**<br><br>An event with a relatively longer duration of resource downtime (eg. for VMs > 30 seconds). The service or resource could be unavailable for users and/or application. With newer platform design innovations, the frequency of events in this category has been drastically reduced. | **Compute**: VM’s will restart or will reboot. Data on temporary storage could be lost.<br>Operations like Reboot, Redeploy, Stop-Start a VM are common examples of this scenario.<br>Initiating Controlled Maintenance for VMs falls in this category as it constitutes a redeploy  |
| **Data Availability** | **#Grayout**, **#Failover** **#ModerateImpact**, #ConnectionTimeouts, #QueryTimeouts, #RetriesSucceed<br><br>Applicable for SQL suite of Apps. Impact to users is minimal and only seen while failover happens. | **SQL**: Maintenace events can produce single or multiple reconfigurations/failovers, depending on constellation of the primary and secondary replicas at the beginning of the maintenance event.  The average impact duration is few seconds.  If already connected, your application must reconnect and long-running queries may be interrupted any may need to be restarted.  |
| **No Impact Expected** | **#NoImpact**, **#Impactless**  | No noticeable impact.<br><br>**Network**: An example is Fiber Cable maintenance events which are mostly non-impactful except for the duration traffic is switched with minor  intermittent packet drops but retries would succeed.  |
| **Other (refer to message for details)** | If ***none*** of these categories directly apply or if there are ***more than one of above categories applicable***, then we would provide more details within the message content.  | More than one of the Impact Categories is applicable.  |

### How long the impact would last? 

Impact Duration field would show a numeric value representing the time in seconds the event would affect the listed resource. Depending on the service resiliency and implementation design, this Duration field combined with Impact Type field should help in overall level of Impact users might expect.  
<br>
One key aspect to call out is the difference between the event StartTime/EndTime and the duration. While the event level fields like Start/End times represent the scheduled work window, the Impact duration field represents the actual ‘downtime’ within that scheduled work window. 

## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
