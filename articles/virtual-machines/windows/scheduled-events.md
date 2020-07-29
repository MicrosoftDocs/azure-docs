---
title: Scheduled Events for Windows VMs in Azure 
description: Scheduled events using the Azure Metadata service for on your Windows virtual machines.
author: mimckitt
ms.service: virtual-machines-windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 06/01/2020
ms.author: mimckitt

---
# Azure Metadata Service: Scheduled Events for Windows VMs

Scheduled Events is an Azure Metadata Service that gives your application time to prepare for virtual machine maintenance. It provides information about upcoming maintenance events (e.g. reboot) so your application can prepare for them and limit disruption. It is available for all Azure Virtual Machine types including PaaS and IaaS on both Windows and Linux. 

For information about Scheduled Events on Linux, see [Scheduled Events for Linux VMs](../linux/scheduled-events.md).

> [!Note] 
> Scheduled Events is generally available in all Azure Regions. See [Version and Region Availability](#version-and-region-availability) for latest release information.

## Why Scheduled Events?

Many applications can benefit from time to prepare for virtual machine maintenance. The time can be used to perform application specific tasks that improve availability, reliability, and serviceability including: 

- Checkpoint and restore
- Connection draining
- Primary replica failover 
- Removal from load balancer pool
- Event logging
- Graceful shutdown 

Using Scheduled Events your application can discover when maintenance will occur and trigger tasks to limit its impact. Enabling scheduled events gives your virtual machine a minimum amount of time before the maintenance activity is performed. See the Event Scheduling section below for details.

Scheduled Events provides events in the following use cases:
- [Platform initiated maintenance](https://docs.microsoft.com/azure/virtual-machines/windows/maintenance-and-updates) (for example, VM reboot, live migration or memory preserving updates for host)
- Virtual machine is running on [degraded host hardware](https://azure.microsoft.com/blog/find-out-when-your-virtual-machine-hardware-is-degraded-with-scheduled-events) that is predicted to fail soon
- User initiated maintenance (e.g. user restarts or redeploys a VM)
- [Spot VM](spot-vms.md) and [Spot scale set](../../virtual-machine-scale-sets/use-spot.md) instance evictions

## The Basics  

Azure Metadata service exposes information about running Virtual Machines using a REST Endpoint accessible from within the VM. The information is available via a non-routable IP so that it is not exposed outside the VM.

### Endpoint Discovery
For VNET enabled VMs, the metadata service is available from a static non-routable IP, `169.254.169.254`. The full endpoint for the latest version of Scheduled Events is: 

 > `http://169.254.169.254/metadata/scheduledevents?api-version=2019-08-01`

If the Virtual Machine is not created within a Virtual Network, the default cases for cloud services and classic VMs, additional logic is required to discover the IP address to use. 
Refer to this sample to learn how to [discover the host endpoint](https://github.com/azure-samples/virtual-machines-python-scheduled-events-discover-endpoint-for-non-vnet-vm).

### Version and Region Availability
The Scheduled Events Service is versioned. Versions are mandatory and the current version is `2019-01-01`.

| Version | Release Type | Regions | Release Notes | 
| - | - | - | - |
| 2019-08-01 | General Availability | All | <li> Added support for EventSource |
| 2019-04-01 | General Availability | All | <li> Added support for Event Description |
| 2019-01-01 | General Availability | All | <li> Added support for virtual machine scale sets EventType 'Terminate' |
| 2017-11-01 | General Availability | All | <li> Added support for Spot VM eviction EventType 'Preempt'<br> | 
| 2017-08-01 | General Availability | All | <li> Removed prepended underscore from resource names for IaaS VMs<br><li>Metadata Header requirement enforced for all requests | 
| 2017-03-01 | Preview | All |<li>Initial release |

> [!NOTE] 
> Previous preview releases of scheduled events supported {latest} as the api-version. This format is no longer supported and will be deprecated in the future.

### Enabling and Disabling Scheduled Events
Scheduled Events is enabled for your service the first time you make a request for events. You should expect a delayed response in your first call of up to two minutes. You should query the endpoint periodically to detect upcoming maintenance events as well as the status of maintenance activities that are being performed.

Scheduled Events is disabled for your service if it does not make a request for 24 hours.

### User Initiated Maintenance
User initiated virtual machine maintenance via the Azure portal, API, CLI, or PowerShell results in a scheduled event. This allows you to test the maintenance preparation logic in your application and allows your application to prepare for user initiated maintenance.

Restarting a virtual machine schedules an event with type `Reboot`. Redeploying a virtual machine schedules an event with type `Redeploy`.

## Using the API

### Headers
When you query the Metadata Service, you must provide the header `Metadata:true` to ensure the request was not unintentionally redirected. The `Metadata:true` header is required for all scheduled events requests. Failure to include the header in the request will result in a Bad Request response from the Metadata Service.

### Query for events
You can query for Scheduled Events simply by making the following call:

#### PowerShell
```
curl http://169.254.169.254/metadata/scheduledevents?api-version=2019-08-01 -H @{"Metadata"="true"}
```

A response contains an array of scheduled events. An empty array means that there are currently no events scheduled.
In the case where there are scheduled events, the response contains an array of events: 
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
        }
    ]
}
```
The DocumentIncarnation is an ETag and provides an easy way to inspect if the Events payload has changed since the last query.

### Event Properties
|Property  |  Description |
| - | - |
| EventId | Globally unique identifier for this event. <br><br> Example: <br><ul><li>602d9444-d2cd-49c7-8624-8643e7171297  |
| EventType | Impact this event causes. <br><br> Values: <br><ul><li> `Freeze`: The Virtual Machine is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there is no impact on memory or open files. <li>`Reboot`: The Virtual Machine is scheduled for reboot (non-persistent memory is lost). <li>`Redeploy`: The Virtual Machine is scheduled to move to another node (ephemeral disks are lost). <li>`Preempt`: The Spot Virtual Machine is being deleted (ephemeral disks are lost). <li> `Terminate`: The Virtual Machine is scheduled to be deleted. |
| ResourceType | Type of resource this event impacts. <br><br> Values: <ul><li>`VirtualMachine`|
| Resources| List of resources this event impacts. This is guaranteed to contain machines from at most one [Update Domain](manage-availability.md), but may not contain all machines in the UD. <br><br> Example: <br><ul><li> ["FrontEnd_IN_0", "BackEnd_IN_0"] |
| Event Status | Status of this event. <br><br> Values: <ul><li>`Scheduled`: This event is scheduled to start after the time specified in the `NotBefore` property.<li>`Started`: This event has started.</ul> No `Completed` or similar status is ever provided; the event will no longer be returned when the event is completed.
| NotBefore| Time after which this event may start. <br><br> Example: <br><ul><li> Mon, 19 Sep 2016 18:29:47 GMT  |
| Description | Description of this event. <br><br> Example: <br><ul><li> Host server is undergoing maintenance. |
| EventSource | Initiator of the event. <br><br> Example: <br><ul><li> `Platform`: This event is initiated by platfrom. <li>`User`: This event is initiated by user. |

### Event Scheduling
Each event is scheduled a minimum amount of time in the future based on event type. This time is reflected in an event's `NotBefore` property. 

|EventType  | Minimum Notice |
| - | - |
| Freeze| 15 minutes |
| Reboot | 15 minutes |
| Redeploy | 10 minutes |
| Preempt | 30 seconds |
| Terminate | [User Configurable](../../virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification.md#enable-terminate-notifications): 5 to 15 minutes |

> [!NOTE] 
> In some cases, Azure is able to predict host failure due to degraded hardware and will attempt to mitigate disruption to your service by scheduling a migration. Affected virtual machines will receive a scheduled event with a `NotBefore` that is typically a few days in the future. The actual time varies depending on the predicted failure risk assessment. Azure tries to give 7 days' advance notice when possible, but the actual time varies and might be smaller if the prediction is that there is a high chance of the hardware failing imminently. To minimize risk to your service in case the hardware fails before the system initiated migration, it is recommended to self-redeploy your virtual machine as soon as possible.

### Event Scope		
Scheduled events are delivered to:
 - Standalone Virtual Machines.
 - All Virtual Machines in a Cloud Service.		
 - All Virtual Machines in an Availability Set.	
 - All Virtual Machines in an Availability Zone.
 - All Virtual Machines in a Scale Set Placement Group (Including Batch).		

> [!NOTE]
> In an availability zone, scheduled events go only to single, affected VMs in the availability zone.
> 
> For example, in an availability set, if you have 100 VMs in the set and there is an update for one of the VMs, the scheduled event goes to all 100 VMs in the availability set.
>
> In an availability zone, if you have 100 VMs in the availability zone, the event goes only to the VM that is affected.
>
> As a result, you should check the `Resources` field in the event to identify which VMs will be affected. 

### Starting an event 

Once you have learned of an upcoming event and completed your logic for graceful shutdown, you can approve the outstanding event by making a `POST` call to the metadata service with the `EventId`. This indicates to Azure that it can shorten the minimum notification time (when possible). 

The following is the json expected in the `POST` request body. The request should contain a list of `StartRequests`. Each `StartRequest` contains the `EventId` for the event you want to expedite:
```
{
	"StartRequests" : [
		{
			"EventId": {EventId}
		}
	]
}
```

#### PowerShell
```
curl -H @{"Metadata"="true"} -Method POST -Body '{"StartRequests": [{"EventId": "f020ba2e-3bc0-4c40-a10b-86575a9eabd5"}]}' -Uri http://169.254.169.254/metadata/scheduledevents?api-version=2019-01-01
```

> [!NOTE] 
> Acknowledging an event allows the event to proceed for all `Resources` in the event, not just the virtual machine that acknowledges the event. You may therefore choose to elect a leader to coordinate the acknowledgement, which may be as simple as the first machine in the `Resources` field.


## PowerShell sample 

The following sample queries the metadata service for scheduled events and approves each outstanding event.

```powershell
# How to get scheduled events 
function Get-ScheduledEvents($uri)
{
    $scheduledEvents = Invoke-RestMethod -Headers @{"Metadata"="true"} -URI $uri -Method get
    $json = ConvertTo-Json $scheduledEvents
    Write-Host "Received following events: `n" $json
    return $scheduledEvents
}

# How to approve a scheduled event
function Approve-ScheduledEvent($eventId, $uri)
{
    # Create the Scheduled Events Approval Document
    $startRequests = [array]@{"EventId" = $eventId}
    $scheduledEventsApproval = @{"StartRequests" = $startRequests} 
    
    # Convert to JSON string
    $approvalString = ConvertTo-Json $scheduledEventsApproval

    Write-Host "Approving with the following: `n" $approvalString

    # Post approval string to scheduled events endpoint
    Invoke-RestMethod -Uri $uri -Headers @{"Metadata"="true"} -Method POST -Body $approvalString
}

function Handle-ScheduledEvents($scheduledEvents)
{
    # Add logic for handling events here
}

######### Sample Scheduled Events Interaction #########

# Set up the scheduled events URI for a VNET-enabled VM
$localHostIP = "169.254.169.254"
$scheduledEventURI = 'http://{0}/metadata/scheduledevents?api-version=2019-01-01' -f $localHostIP 

# Get events
$scheduledEvents = Get-ScheduledEvents $scheduledEventURI

# Handle events however is best for your service
Handle-ScheduledEvents $scheduledEvents

# Approve events when ready (optional)
foreach($event in $scheduledEvents.Events)
{
    Write-Host "Current Event: `n" $event
    $entry = Read-Host "`nApprove event? Y/N"
    if($entry -eq "Y" -or $entry -eq "y")
    {
        Approve-ScheduledEvent $event.EventId $scheduledEventURI 
    }
}
``` 

## Next steps 

- Watch a [Scheduled Events Demo](https://channel9.msdn.com/Shows/Azure-Friday/Using-Azure-Scheduled-Events-to-Prepare-for-VM-Maintenance) on Azure Friday. 
- Review the Scheduled Events code samples in the [Azure Instance Metadata Scheduled Events GitHub Repository](https://github.com/Azure-Samples/virtual-machines-scheduled-events-discover-endpoint-for-non-vnet-vm)
- Read more about the APIs available in the [Instance Metadata service](instance-metadata-service.md).
- Learn about [planned maintenance for Windows virtual machines in Azure](planned-maintenance.md).
