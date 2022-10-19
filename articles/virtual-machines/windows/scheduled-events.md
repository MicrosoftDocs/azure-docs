---
title: Scheduled Events for Windows VMs in Azure 
description: Scheduled events using the Azure Metadata Service for your Windows virtual machines.
author: EricRadzikowskiMSFT
ms.service: virtual-machines
ms.subservice: scheduled-events
ms.collection: windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 06/01/2020
ms.author: ericrad
ms.reviwer: mimckitt 
ms.custom: devx-track-azurepowershell

---

# Azure Metadata Service: Scheduled Events for Windows VMs

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Scheduled Events is an Azure Metadata Service that gives your application time to prepare for virtual machine (VM) maintenance. It provides information about upcoming maintenance events (for example, reboot) so that your application can prepare for them and limit disruption. It's available for all Azure Virtual Machines types, including PaaS and IaaS on both Windows and Linux. 

For information about Scheduled Events on Linux, see [Scheduled Events for Linux VMs](../linux/scheduled-events.md).

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

  Metadata Service exposes information about running VMs by using a REST endpoint that's accessible from within the VM. The information is available via a nonroutable IP so that it's not exposed outside the VM.

### Scope
Scheduled events are delivered to:

- Standalone Virtual Machines.
- All the VMs in a cloud service.
- All the VMs in an availability set.
- All the VMs in an availability zone.
- All the VMs in a scale set placement group. 

> [!NOTE]
> Scheduled Events for all virtual machines (VMs) in a Fabric Controller (FC) tenant are delivered to all VMs in a FC tenant. FC tenant equates to a standalone VM, an entire Cloud Service, an entire Availability Set, and a Placement Group for a VM Scale Set (VMSS) regardless of Availability Zone usage. 

As a result, check the `Resources` field in the event to identify which VMs are affected.

### Endpoint discovery
For VNET enabled VMs, Metadata Service is available from a static nonroutable IP, `169.254.169.254`. The full endpoint for the latest version of Scheduled Events is: 

 > `http://169.254.169.254/metadata/scheduledevents?api-version=2020-07-01`

If the VM is not created within a Virtual Network, the default cases for cloud services and classic VMs, additional logic is required to discover the IP address to use. 
To learn how to [discover the host endpoint](https://github.com/azure-samples/virtual-machines-python-scheduled-events-discover-endpoint-for-non-vnet-vm), see this sample.

### Version and region availability
The Scheduled Events service is versioned. Versions are mandatory; the current version is `2020-07-01`.

| Version | Release Type | Regions | Release Notes | 
| - | - | - | - | 
| 2020-07-01 | General Availability | All | <li> Added support for Event Duration |
| 2019-08-01 | General Availability | All | <li> Added support for EventSource |
| 2019-04-01 | General Availability | All | <li> Added support for Event Description |
| 2019-01-01 | General Availability | All | <li> Added support for virtual machine scale sets EventType 'Terminate' |
| 2017-11-01 | General Availability | All | <li> Added support for Spot VM eviction EventType 'Preempt'<br> | 
| 2017-08-01 | General Availability | All | <li> Removed prepended underscore from resource names for IaaS VMs<br><li>Metadata header requirement enforced for all requests | 
| 2017-03-01 | Preview | All | <li>Initial release |


> [!NOTE] 
> Previous preview releases of Scheduled Events supported {latest} as the api-version. This format is no longer supported and will be deprecated in the future.

### Enabling and disabling Scheduled Events
Scheduled Events is enabled for your service the first time you make a request for events. You should expect a delayed response in your first call of up to two minutes.

Scheduled Events is disabled for your service if it does not make a request for 24 hours.

### User-initiated maintenance
User-initiated VM maintenance via the Azure portal, API, CLI, or PowerShell results in a scheduled event. You then can test the maintenance preparation logic in your application, and your application can prepare for user-initiated maintenance.

If you restart a VM, an event with the type `Reboot` is scheduled. If you redeploy a VM, an event with the type `Redeploy` is scheduled. Typically events with a user event source can be immediately approved to avoid a delay on user-initiated actions. 

## Use the API

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
| EventType | Impact this event causes. <br><br> Values: <br><ul><li> `Freeze`: The Virtual Machine is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there is no impact on memory or open files.<li>`Reboot`: The Virtual Machine is scheduled for reboot (non-persistent memory is lost). <li>`Redeploy`: The Virtual Machine is scheduled to move to another node (ephemeral disks are lost). <li>`Preempt`: The Spot Virtual Machine is being deleted (ephemeral disks are lost). This event is made available on a best effort basis <li> `Terminate`: The virtual machine is scheduled to be deleted. |
| ResourceType | Type of resource this event affects. <br><br> Values: <ul><li>`VirtualMachine`|
| Resources| List of resources this event affects. <br><br> Example: <br><ul><li> ["FrontEnd_IN_0", "BackEnd_IN_0"] |
| EventStatus | Status of this event. <br><br> Values: <ul><li>`Scheduled`: This event is scheduled to start after the time specified in the `NotBefore` property.<li>`Started`: This event has started.</ul> No `Completed` or similar status is ever provided. The event is no longer returned when the event is finished.
| NotBefore| Time after which this event can start. The event is guaranteed to not start before this time. Will be blank if the event has already started <br><br> Example: <br><ul><li> Mon, 19 Sep 2016 18:29:47 GMT  |
| Description | Description of this event. <br><br> Example: <br><ul><li> Host server is undergoing maintenance. |
| EventSource | Initiator of the event. <br><br> Example: <br><ul><li> `Platform`: This event is initiated by platform. <li>`User`: This event is initiated by user. |
| DurationInSeconds | The expected duration of the interruption caused by the event. <br><br> Example: <br><ul><li> `9`: The interruption caused by the event will last for 9 seconds. <li>`-1`: The default value used if the impact duration is either unknown or not applicable. |

### Event scheduling
Each event is scheduled a minimum amount of time in the future based on the event type. This time is reflected in an event's `NotBefore` property. 

|EventType  | Minimum notice |
| - | - |
| Freeze| 15 minutes |
| Reboot | 15 minutes |
| Redeploy | 10 minutes |
| Preempt | 30 seconds |
| Terminate | [User Configurable](../../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md#enable-terminate-notifications): 5 to 15 minutes |

> [!NOTE] 
> In some cases, Azure is able to predict host failure due to degraded hardware and will attempt to mitigate disruption to your service by scheduling a migration. Affected virtual machines will receive a scheduled event with a `NotBefore` that is typically a few days in the future. The actual time varies depending on the predicted failure risk assessment. Azure tries to give 7 days' advance notice when possible, but the actual time varies and might be smaller if the prediction is that there is a high chance of the hardware failing imminently. To minimize risk to your service in case the hardware fails before the system-initiated migration, we recommend that you self-redeploy your virtual machine as soon as possible.

>[!NOTE]
> In the case the host node experiences a hardware failure Azure will bypass the minimum notice period an immediately begin the recovery process for affected virtual machines. This reduces recovery time in the case that the affected VMs are unable to respond. During the recovery process an event will be created for all impacted VMs with `EventType = Reboot` and `EventStatus = Started`.

### Polling frequency

You can poll the endpoint for updates as frequently or infrequently as you like. However, the longer the time between requests, the more time you potentially lose to react to an upcoming event. Most events have 5 to 15 minutes of advance notice, although in some cases advance notice might be as little as 30 seconds. To ensure that you have as much time as possible to take mitigating actions, we recommend that you poll the service once per second.

### Start an event 

After you learn of an upcoming event and finish your logic for graceful shutdown, you can approve the outstanding event by making a `POST` call to Metadata Service with `EventId`. This call indicates to Azure that it can shorten the minimum notification time (when possible). The event may not start immediately upon approval, in some cases Azure will require the approval of all the VMs hosted on the node before proceeding with the event. 

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

The service will always return a 200 success code in the case of a valid event ID, even if it was already approved by a different VM. A 400 error code indicates that the request header or payload was malformed. 


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
The following is an example of a series of events that were seen by two VMs that were live migrated to another node. 

The `DocumentIncarnation` is changing every time there is new information in `Events`. An approval of the event would allow the freeze to proceed for both WestNO_0 and WestNO_1. The `DurationInSeconds` of -1 indicates that the platform does not know how long the operation will take. 

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
                       "DurationInSeconds":  -1
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
                       "DurationInSeconds":  -1
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
            
        # Events that may be impactful (eg. Reboot or redeploy) may need custom 
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
- Learn about [planned maintenance for Windows virtual machines in Azure](../maintenance-and-updates.md?bc=/azure/virtual-machines/windows/breadcrumb/toc.json&toc=/azure/virtual-machines/windows/toc.json).
- Learn how to [monitor scheduled events for your VMs through Log Analytics](./scheduled-event-service.md).
- Learn how to log scheduled events using Azure Event Hub in the [Azure Samples GitHub repository](https://github.com/Azure-Samples/virtual-machines-python-scheduled-events-central-logging).
