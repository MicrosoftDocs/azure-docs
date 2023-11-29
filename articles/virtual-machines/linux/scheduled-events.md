---
title: Scheduled Events for Linux VMs in Azure 
description: Scheduled events using the Azure Metadata Service for your Linux virtual machines.
author: EricRadzikowskiMSFT
ms.service: virtual-machines
ms.subservice: scheduled-events
ms.collection: linux
ms.topic: how-to
ms.workload: infrastructure-services
ms.custom: devx-track-python
ms.date: 01/25/2023
ms.author: ericrad
ms.reviewer: mimckitt
---

# Azure Metadata Service: Scheduled Events for Linux VMs

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets 

Scheduled Events is an Azure Metadata Service that gives your application time to prepare for virtual machine (VM) maintenance. It provides information about upcoming maintenance events (for example, reboot) so that your application can prepare for them and limit disruption. It's available for all Azure Virtual Machines types, including PaaS and IaaS on both Windows and Linux. 

For information about Scheduled Events on Windows, see [Scheduled Events for Windows VMs](../windows/scheduled-events.md).

Scheduled events provide proactive notifications about upcoming events, for reactive information about events that have already happened see [VM availability information in Azure Resource Graph](../resource-graph-availability.md) and [Create availability alert rule for Azure virtual machine](../../azure-monitor/vm/tutorial-monitor-vm-alert-availability.md). 

> [!Note] 
> Scheduled Events is generally available in all Azure Regions. See [Version and Region Availability](#version-and-region-availability) for latest release information.

## Why use Scheduled Events?

Many applications can benefit from time to prepare for VM maintenance. The time can be used to perform application-specific tasks that improve availability, reliability, and serviceability, including: 

- Checkpoint and restore.
- Connection draining.
- Primary replica failover.
- Removal from a load balancer pool.
- Event logging.
- Graceful shutdown.

With Scheduled Events, your application can discover when maintenance will occur and trigger tasks to limit its impact.  

Scheduled Events provides events in the following use cases:

- [Platform initiated maintenance](../maintenance-and-updates.md?bc=/azure/virtual-machines/windows/breadcrumb/toc.json&toc=/azure/virtual-machines/windows/toc.json) (for example, VM reboot, live migration or memory preserving updates for host).
- Virtual machine is running on [degraded host hardware](https://azure.microsoft.com/blog/find-out-when-your-virtual-machine-hardware-is-degraded-with-scheduled-events) that is predicted to fail soon.
- Virtual machine was running on a host that suffered a hardware failure.
- User-initiated maintenance (for example, a user restarts or redeploys a VM).
- [Spot VM](../spot-vms.md) and [Spot scale set](../../virtual-machine-scale-sets/use-spot.md) instance evictions.

## The Basics  

Metadata Service exposes information about running VMs by using a REST endpoint that's accessible from within the VM. The information is available via a nonroutable IP and is not exposed outside the VM.

### Scope
Scheduled events are delivered to and can be acknowledged by:

- Standalone Virtual Machines.
- All the VMs in an [Azure cloud service (classic)](../../cloud-services/index.yml).
- All the VMs in an availability set.
- All the VMs in a scale set placement group. 

> [!NOTE]
> Scheduled Events for all virtual machines (VMs) in an entire Availability Set or a Placement Group for a Virtual Machine Scale Set are delivered to all other VMs in the same group or set regardless of Availability Zone usage. 

As a result, check the `Resources` field in the event to identify which VMs are affected.

### Endpoint discovery
For VNET enabled VMs, Metadata Service is available from a static nonroutable IP, `169.254.169.254`. The full endpoint for the latest version of Scheduled Events is: 

 > `http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01`

If the VM isn't created within a Virtual Network, the default cases for cloud services and classic VMs, additional logic is required to discover the IP address to use. 
To learn how to [discover the host endpoint](https://github.com/azure-samples/virtual-machines-python-scheduled-events-discover-endpoint-for-non-vnet-vm), see this sample.

### Version and region availability
The Scheduled Events service is versioned. Versions are mandatory; the current version is `2020-07-01`.

| Version | Release Type | Regions | Release Notes | 
| - | - | - | - | 
| 2020-07-01 | General Availability | All | <li> Added support for Event Duration |
| 2019-08-01 | General Availability | All | <li> Added support for EventSource |
| 2019-04-01 | General Availability | All | <li> Added support for Event Description |
| 2019-01-01 | General Availability | All | <li> Added support for Virtual Machine Scale Sets EventType 'Terminate' |
| 2017-11-01 | General Availability | All | <li> Added support for Spot VM eviction EventType 'Preempt'<br> | 
| 2017-08-01 | General Availability | All | <li> Removed prepended underscore from resource names for IaaS VMs<br><li>Metadata header requirement enforced for all requests | 
| 2017-03-01 | Preview | All | <li>Initial release |


> [!NOTE] 
> Previous preview releases of Scheduled Events supported {latest} as the api-version. This format is no longer supported and will be deprecated in the future.

### Enabling and disabling Scheduled Events
Scheduled Events is enabled for your service the first time you make a request for events. You should expect a delayed response in your first call of up to two minutes. Scheduled Events is disabled for your service if it doesn't make a request to the endpoint for 24 hours.	

### User-initiated maintenance
User-initiated VM maintenance via the Azure portal, API, CLI, or PowerShell results in a scheduled event. You then can test the maintenance preparation logic in your application, and your application can prepare for user-initiated maintenance.

If you restart a VM, an event with the type `Reboot` is scheduled. If you redeploy a VM, an event with the type `Redeploy` is scheduled. Typically events with a user event source can be immediately approved to avoid a delay on user-initiated actions. We advise having a primary and secondary VM communicating and approving user generated scheduled events in case the primary VM becomes unresponsive. Immediately approving events prevents delays in recovering your application back to a good state.  
	
Scheduled events for [VMSS Guest OS upgrades or reimages](../../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) are supported for general purpose VM sizes that [support memory preserving updates](../maintenance-and-updates.md#maintenance-that-doesnt-require-a-reboot) only. It doesn't work for G, M, N, and H series. Scheduled events for VMSS Guest OS upgrades and reimages are disabled by default. To enable scheduled events for these operations on supported VM sizes, first enable them using [OSImageNotificationProfile](/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP). 

## Use the API

### High level overview

There are two major components to handling Scheduled Events, preparation and recovery. All current scheduled events impacting a VM are available to read via the IMDS Scheduled Events endpoint. When the event has reached a terminal state, it is removed from the list of events. The following diagram shows the various state transitions that a single scheduled event can experience: 

![State diagram showing the various transitions a scheduled event can take.](media/scheduled-events/scheduled-events-states.png)

For events in the EventStatus:"Scheduled" state, you'll need to take steps to prepare your workload. Once the preparation is complete, you should then approve the event using the scheduled event API. Otherwise, the event is automatically approved when the NotBefore time is reached. If the VM is on shared infrastructure, the system will then wait for all other tenants on the same hardware to also approve the job or timeout. Once approvals are gathered from all impacted VMs or the NotBefore time is reached then Azure generates a new scheduled event payload with EventStatus:"Started" and triggers the start of the maintenance event. When the event has reached a terminal state, it is removed from the list of events. That serves as the signal for the customer to recover their VMs.

Below is psudeo code demonstrating a process for how to read and manage scheduled events in your application: 
```
current_list_of_scheduled_events = get_latest_from_se_endpoint()
#prepare for new events
for each event in current_list_of_scheduled_events:
  if event not in previous_list_of_scheduled_events:
    prepare_for_event(event)
#recover from completed events
for each event in previous_list_of_scheduled_events:
  if event not in current_list_of_scheduled_events:
    receover_from_event(event)
#prepare for future jobs
previous_list_of_scheduled_events = current_list_of_scheduled_events
```
As scheduled events are often used for applications with high availability requirements, there are a few exceptional cases that should be considered:

1. Once a scheduled event is completed and removed from the array, there will be no further impacts without a new event including another EventStatus:"Scheduled" event
2. Azure  monitors maintenance operations across the entire fleet and in rare circumstances determines that a maintenance operation too high risk to apply. In that case the scheduled event will go directly from “Scheduled” to being removed from the events array
3. In the case of hardware failure, Azure bypasses the “Scheduled” state and immediately move to the EventStatus:"Started" state. 
4. While the event is still in EventStatus:"Started" state, there may be another impact of a shorter duration than what was advertised in the scheduled event.

As part of Azure’s availability guarantee, VMs in different fault domains won't be impacted by routine maintenance operations at the same time. However, they may have operations serialized one after another. VMs in one fault domain can receive scheduled events with EventStatus:"Scheduled" shortly after another fault domain’s maintenance is completed. Regardless of what architecture you chose, always keep checking for new events pending against your VMs.

While the exact timings of events vary, the following diagram provides a rough guideline for how a typical maintenance operation proceeds:

- EventStatus:"Scheduled" to Approval Timeout: 15 minutes
- Impact Duration: 7 seconds
- EventStatus:"Started" to Completed (event removed from Events array): 10 minutes

![Diagram of a timeline showing the flow of a scheduled event.](media/scheduled-events/scheduled-events-timeline.png)


### Headers
When you query Metadata Service, you must provide the header `Metadata:true` to ensure the request wasn't unintentionally redirected. The `Metadata:true` header is required for all scheduled events requests. Failure to include the header in the request results in a "Bad Request" response from Metadata Service.

### Query for events
You can query for scheduled events by making the following call:

#### Bash sample
```
curl -H Metadata:true http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01
```
#### PowerShell sample
```
Invoke-RestMethod -Headers @{"Metadata"="true"} -Method GET -Uri "http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01" | ConvertTo-Json -Depth 64
```
#### Python sample
````
import json
import requests

metadata_url ="http://169.254.169.254/metadata/scheduledevents"
header = {'Metadata' : 'true'}
query_params = {'api-version':'2020-07-01'}

def get_scheduled_events():           
    resp = requests.get(metadata_url, headers = header, params = query_params)
    data = resp.json()
    return data

````


A response contains an array of scheduled events. An empty array means that currently no events are scheduled.
In the case where there are scheduled events, the response contains an array of events. 
```
{
    "DocumentIncarnation": {IncarnationID},
    "Events": [
        {
            "EventId": {eventID},
            "EventType": "Reboot" | "Redeploy" | "Freeze" | "Preempt" | "Terminate",
            "ResourceType": "VirtualMachine",
            "Resources": [{resourceName}],
            "EventStatus": "Scheduled" | "Started",
            "NotBefore": {timeInUTC},       
            "Description": {eventDescription},
            "EventSource" : "Platform" | "User",
            "DurationInSeconds" : {timeInSeconds},
        }
    ]
}
```

### Event properties
|Property  |  Description |
| - | - |
| Document Incarnation | Integer that increases when the events array changes. Documents with the same incarnation contain the same event information, and the incarnation will be incremented when an event changes. |
| EventId | Globally unique identifier for this event. <br><br> Example: <br><ul><li>602d9444-d2cd-49c7-8624-8643e7171297  |
| EventType | Impact this event causes. <br><br> Values: <br><ul><li> `Freeze`: The Virtual Machine is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there's no impact on memory or open files.<li>`Reboot`: The Virtual Machine is scheduled for reboot (non-persistent memory is lost). In rare cases a VM scheduled for EventType:"Reboot" may experience a freeze event instead of a reboot. Follow the instructions above for how to know if the event is complete and it is safe to restore your workload. <li>`Redeploy`: The Virtual Machine is scheduled to move to another node (ephemeral disks are lost). <li>`Preempt`: The Spot Virtual Machine is being deleted (ephemeral disks are lost). This event is made available on a best effort basis <li> `Terminate`: The virtual machine is scheduled to be deleted. |
| ResourceType | Type of resource this event affects. <br><br> Values: <ul><li>`VirtualMachine`|
| Resources| List of resources this event affects. <br><br> Example: <br><ul><li> ["FrontEnd_IN_0", "BackEnd_IN_0"] |
| EventStatus | Status of this event. <br><br> Values: <ul><li>`Scheduled`: This event is scheduled to start after the time specified in the `NotBefore` property.<li>`Started`: This event has started.</ul> No `Completed` or similar status is ever provided. The event is no longer returned when the event is finished.
| NotBefore| Time after which this event can start. The event is guaranteed to not start before this time. Will be blank if the event has already started <br><br> Example: <br><ul><li> Mon, 19 Sep 2016 18:29:47 GMT  |
| Description | Description of this event. <br><br> Example: <br><ul><li> Host server is undergoing maintenance. |
| EventSource | Initiator of the event. <br><br> Example: <br><ul><li> `Platform`: This event is initiated by platform. <li>`User`: This event is initiated by user. |
| DurationInSeconds | The expected duration of the interruption caused by the event. <br><br> Example: <br><ul><li> `9`: The interruption caused by the event will last for 9 seconds. <li>`0`: The event won't interrupt the VM or impact its availability (eg. update to the network) <li>`-1`: The default value used if the impact duration is either unknown or not applicable.  |

### Event scheduling
Each event is scheduled a minimum amount of time in the future based on the event type. This time is reflected in an event's `NotBefore` property. 

|EventType  | Minimum notice |
| - | - |
| Freeze| 15 minutes |
| Reboot | 15 minutes |
| Redeploy | 10 minutes |
| Terminate | [User Configurable](../../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md#enable-terminate-notifications): 5 to 15 minutes |

Once an event is scheduled, it will move into the `Started` state after it's been approved or the `NotBefore` time passes. However, in rare cases, the operation will be canceled by Azure before it starts. In that case the event will be removed from the Events array, and the impact won't occur as previously scheduled. 
	
> [!NOTE] 
> In some cases, Azure is able to predict host failure due to degraded hardware and will attempt to mitigate disruption to your service by scheduling a migration. Affected virtual machines will receive a scheduled event with a `NotBefore` that is typically a few days in the future. The actual time varies depending on the predicted failure risk assessment. Azure tries to give 7 days' advance notice when possible, but the actual time varies and might be smaller if the prediction is that there's a high chance of the hardware failing imminently. To minimize risk to your service in case the hardware fails before the system-initiated migration, we recommend that you self-redeploy your virtual machine as soon as possible.

>[!NOTE]
> In the case the host node experiences a hardware failure Azure will bypass the minimum notice period an immediately begin the recovery process for affected virtual machines. This reduces recovery time in the case that the affected VMs are unable to respond. During the recovery process an event will be created for all impacted VMs with `EventType = Reboot` and `EventStatus = Started`.

### Polling frequency

You can poll the endpoint for updates as frequently or infrequently as you like. However, the longer the time between requests, the more time you potentially lose to react to an upcoming event. Most events have 5 to 15 minutes of advance notice, although in some cases advance notice might be as little as 30 seconds. To ensure that you have as much time as possible to take mitigating actions, we recommend that you poll the service once per second.

### Start an event 

After you learn of an upcoming event and finish your logic for graceful shutdown, you can approve the outstanding event by making a `POST` call to Metadata Service with `EventId`. This call indicates to Azure that it can shorten the minimum notification time (when possible). The event may not start immediately upon approval, in some cases Azure requires the approval of all the VMs hosted on the node before proceeding with the event. 

The following JSON sample is expected in the `POST` request body. The request should contain a list of `StartRequests`. Each `StartRequest` contains `EventId` for the event you want to expedite:

```
{
	"StartRequests" : [
		{
			"EventId": {EventId}
		}
	]
}
```

The service always returns a 200 success code if it is passed a valid event ID, even if another VM already approved the event. A 400 error code indicates that the request header or payload was malformed. 

> [!Note] 
> Events will not proceed unless they are  either approved via a POST message or the NotBefore time elapses. This includes user triggered events such as VM restarts from the Azure portal. 

#### Bash sample
```
curl -H Metadata:true -X POST -d '{"StartRequests": [{"EventId": "f020ba2e-3bc0-4c40-a10b-86575a9eabd5"}]}' http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01
```
#### PowerShell sample
```
Invoke-RestMethod -Headers @{"Metadata" = "true"} -Method POST -body '{"StartRequests": [{"EventId": "5DD55B64-45AD-49D3-BBC9-F57D4EA97BD7"}]}' -Uri http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01 | ConvertTo-Json -Depth 64
```
#### Python sample
````
import json
import requests

def confirm_scheduled_event(event_id):  
   # This payload confirms a single event with id event_id
   payload = json.dumps({"StartRequests": [{"EventId": event_id }]})
   response = requests.post("http://169.254.169.254/metadata/scheduledevents", 
                            headers =  {'Metadata' : 'true'}, 
                            params = {'api-version':'2020-07-01'}, 
                            data = payload)    
   return response.status_code
````

> [!NOTE] 
> Acknowledging an event allows the event to proceed for all `Resources` in the event, not just the VM that acknowledges the event. Therefore, you can choose to elect a leader to coordinate the acknowledgement, which might be as simple as the first machine in the `Resources` field.

## Example responses
The following events are an example that was seen by two VMs that were live migrated to another node. 

The `DocumentIncarnation` is changing every time there is new information in `Events`. An approval of the event would allow the freeze to proceed for both WestNO_0 and WestNO_1. The `DurationInSeconds` of -1 indicates that the platform doesn't know how long the operation will take. 

```JSON
{
    "DocumentIncarnation":  1,
    "Events":  [
               ]
}

{
    "DocumentIncarnation":  2,
    "Events":  [
                   {
                       "EventId":  "C7061BAC-AFDC-4513-B24B-AA5F13A16123",
                       "EventStatus":  "Scheduled",
                       "EventType":  "Freeze",
                       "ResourceType":  "VirtualMachine",
                       "Resources":  [
                                         "WestNO_0",
                                         "WestNO_1"
                                     ],
                       "NotBefore":  "Mon, 11 Apr 2022 22:26:58 GMT",
                       "Description":  "Virtual machine is being paused because of a memory-preserving Live Migration operation.",
                       "EventSource":  "Platform",
                       "DurationInSeconds":  5
                   }
               ]
}

{
    "DocumentIncarnation":  3,
    "Events":  [
                   {
                       "EventId":  "C7061BAC-AFDC-4513-B24B-AA5F13A16123",
                       "EventStatus":  "Started",
                       "EventType":  "Freeze",
                       "ResourceType":  "VirtualMachine",
                       "Resources":  [
                                         "WestNO_0",
                                         "WestNO_1"
                                     ],
                       "NotBefore":  "",
                       "Description":  "Virtual machine is being paused because of a memory-preserving Live Migration operation.",
                       "EventSource":  "Platform",
                       "DurationInSeconds":  5
                   }
               ]
}

{
    "DocumentIncarnation":  4,
    "Events":  [
               ]
}

```

## Python Sample 

The following sample queries Metadata Service for scheduled events and approves each outstanding event:

```python
#!/usr/bin/python
import json
import requests
from time import sleep

# The URL to access the metadata service
metadata_url ="http://169.254.169.254/metadata/scheduledevents"
# This must be sent otherwise the request will be ignored
header = {'Metadata' : 'true'}
# Current version of the API
query_params = {'api-version':'2020-07-01'}

def get_scheduled_events():           
    resp = requests.get(metadata_url, headers = header, params = query_params)
    data = resp.json()
    return data

def confirm_scheduled_event(event_id):  
    # This payload confirms a single event with id event_id
    # You can confirm multiple events in a single request if needed      
    payload = json.dumps({"StartRequests": [{"EventId": event_id }]})
    response = requests.post(metadata_url, 
                            headers= header,
                            params = query_params, 
                            data = payload)    
    return response.status_code

def log(event): 
    # This is an optional placeholder for logging events to your system 
    print(event["Description"])
    return

def advanced_sample(last_document_incarnation): 
    # Poll every second to see if there are new scheduled events to process
    # Since some events may have necessarily short warning periods, it is 
    # recommended to poll frequently
    found_document_incarnation = last_document_incarnation
    while (last_document_incarnation == found_document_incarnation):
        sleep(1)
        payload = get_scheduled_events()    
        found_document_incarnation = payload["DocumentIncarnation"]        
        
    # We recommend processing all events in a document together, 
    # even if you won't be actioning on them right away
    for event in payload["Events"]:

        # Events that have already started, logged for tracking
        if (event["EventStatus"] == "Started"):
            log(event)
            
        # Approve all user initiated events. These are typically created by an 
        # administrator and approving them immediately can help to avoid delays 
        # in admin actions
        elif (event["EventSource"] == "User"):
            confirm_scheduled_event(event["EventId"])            
            
        # For this application, freeze events less that 9 seconds are considered
        # no impact. This will immediately approve them
        elif (event["EventType"] == "Freeze" and 
            int(event["DurationInSeconds"]) >= 0  and 
            int(event["DurationInSeconds"]) < 9):
            confirm_scheduled_event(event["EventId"])
            
        # Events that may be impactful (for example, reboot or redeploy) may need custom 
        # handling for your application
        else: 
            #TODO Custom handling for impactful events
            log(event)
    print("Processed events from document: " + str(found_document_incarnation))
    return found_document_incarnation

def main():
    # This will track the last set of events seen 
    last_document_incarnation = "-1"

    input_text = "\
        Press 1 to poll for new events \n\
        Press 2 to exit \n "
    program_exit = False 

    while program_exit == False:
        user_input = input(input_text)    
        if (user_input == "1"):                        
            last_document_incarnation = advanced_sample(last_document_incarnation)
        elif (user_input == "2"):
            program_exit = True       

if __name__ == '__main__':
    main()
```

## Next steps 
- Review the Scheduled Events code samples in the [Azure Instance Metadata Scheduled Events GitHub repository](https://github.com/Azure-Samples/virtual-machines-scheduled-events-discover-endpoint-for-non-vnet-vm).
- Review the Node.js Scheduled Events code samples in [Azure Samples GitHub repository](https://github.com/Azure/vm-scheduled-events).
- Read more about the APIs that are available in the [Instance Metadata Service](instance-metadata-service.md).
- Learn about [planned maintenance for Linux virtual machines in Azure](../maintenance-and-updates.md?bc=/azure/virtual-machines/linux/breadcrumb/toc.json&toc=/azure/virtual-machines/linux/toc.json).
- Learn how to log scheduled events by using Azure Event Hubs in the [Azure Samples GitHub repository](https://github.com/Azure-Samples/virtual-machines-python-scheduled-events-central-logging).
