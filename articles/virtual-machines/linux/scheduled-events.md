---
title: Scheduled Events for Linux VMs in Azure | Microsoft Docs
description: Scheduled events using the Azure Metadata service for on your Linux virtual machines.
services: virtual-machines-windows, virtual-machines-linux, cloud-services
documentationcenter: ''
author: zivraf
manager: timlt
editor: ''
tags: ''

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/14/2017
ms.author: zivr

---

# Azure Metadata Service: Scheduled Events (Preview) for Linux VMs

> [!NOTE] 
> Previews are made available to you on the condition that you agree to the terms of use. For more information, see [Microsoft Azure Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>

Scheduled Events is one of the subservices under the Azure Metadata Service. It is responsible for surfacing information regarding upcoming events (for example, reboot) so your application can prepare for them and limit disruption. It is available for all Azure Virtual Machine types including PaaS and IaaS. Scheduled Events gives your Virtual Machine time to perform preventive tasks to minimize the effect of an event. 

Scheduled Events is available for both Windows and Linux VMs. For information about Scheduled Events on Windows, see [Scheduled Events for Windows VMs](../windows/scheduled-events.md).

## Why Scheduled Events?

With Scheduled Events, you can take steps to limit the impact of platform-intiated maintenance or user-initiated actions on your service. 

Multi-instance workloads, which use replication techniques to maintain state, may be vulnerable to outages happening across multiple instances. Such outages may result in expensive tasks (for example, rebuilding indexes) or even a replica loss. 

In many other cases, the overall service availability may be improved by performing a graceful shutdown sequence such as completing (or canceling) in-flight transactions, reassigning tasks to other VMs in the cluster (manual failover), or removing the Virtual Machine from a network load balancer pool. 

There are cases where notifying an administrator about an upcoming event or logging such an event help improving the serviceability of applications hosted in the cloud.

Azure Metadata Service surfaces Scheduled Events in the following use cases:
-	Platform initiated maintenance (for example, Host OS rollout)
-	User-initiated calls (for example, user restarts or redeploys a VM)


## The basics  

Azure Metadata service exposes information about running Virtual Machines using a REST Endpoint accessible from within the VM. The information is available via a non-routable IP so that it is not exposed outside the VM.

### Scope
Scheduled events are surfaced to all Virtual Machines in a cloud service or to all Virtual Machines in an Availability Set. As a result, you should check the `Resources` field in the event to identify which VMs are going to be impacted. 

### Discovering the endpoint
In the case where a Virtual Machine is created within a Virtual Network (VNet), the metadata service is available from a static non-routable IP, `169.254.169.254`.
If the Virtual Machine is not created within a Virtual Network, the default cases for cloud services and classic VMs, additional logic is required to discover the endpoint to use. 
Refer to this sample to learn how to [discover the host endpoint](https://github.com/azure-samples/virtual-machines-python-scheduled-events-discover-endpoint-for-non-vnet-vm).

### Versioning 
The Instance Metadata Service is versioned. Versions are mandatory and the current version is `2017-03-01`.

> [!NOTE] 
> Previous preview releases of scheduled events supported {latest} as the api-version. This format is no longer supported and will be deprecated in the future.

### Using headers
When you query the Metadata Service, you must provide the header `Metadata: true` to ensure the request was not unintentionally redirected.

### Enabling Scheduled Events
The first time you make a request for scheduled events, Azure implicitly enables the feature on your Virtual Machine. As a result, you should expect a delayed response in your first call of up to two minutes.

### User initiated maintenance
User initiated virtual machine maintenance via the Azure portal, API, CLI, or PowerShell results in a scheduled event. This allows you to test the maintenance preparation logic in your application and allows your application to prepare for user initiated maintenance.

Restarting a virtual machine schedules an event with type `Reboot`. Redeploying a virtual machine schedules an event with type `Redeploy`.

> [!NOTE] 
> Currently a maximum of 10 user initiated maintenance operations can be simultaneously scheduled. This limit will be relaxed before Scheduled Events general availability.

> [!NOTE] 
> Currently user initiated maintenance resulting in Scheduled Events is not configurable. Configurability is planned for a future release.

## Using the API

### Query for events
You can query for Scheduled Events simply by making the following call:

```
curl -H Metadata:true http://169.254.169.254/metadata/scheduledevents?api-version=2017-03-01
```

A response contains an array of scheduled events. An empty array means that there are currently no events scheduled.
In the case where there are scheduled events, the response contains an array of events: 
```
{
    "DocumentIncarnation": {IncarnationID},
    "Events": [
        {
            "EventId": {eventID},
            "EventType": "Reboot" | "Redeploy" | "Freeze",
            "ResourceType": "VirtualMachine",
            "Resources": [{resourceName}],
            "EventStatus": "Scheduled" | "Started",
            "NotBefore": {timeInUTC},              
        }
    ]
}
```

### Event properties
|Property  |  Description |
| - | - |
| EventId | Globally unique identifier for this event. <br><br> Example: <br><ul><li>602d9444-d2cd-49c7-8624-8643e7171297  |
| EventType | Impact this event causes. <br><br> Values: <br><ul><li> `Freeze`: The Virtual Machine is scheduled to pause for few seconds. The CPU is suspended, but there is no impact on memory, open files, or network connections. <li>`Reboot`: The Virtual Machine is scheduled for reboot (non-persistent memory is lost). <li>`Redeploy`: The Virtual Machine is scheduled to move to another node (ephemeral disks are lost). |
| ResourceType | Type of resource this event impacts. <br><br> Values: <ul><li>`VirtualMachine`|
| Resources| List of resources this event impacts. This is guaranteed to contain machines from at most one [Update Domain](manage-availability.md), but may not contain all machines in the UD. <br><br> Example: <br><ul><li> ["FrontEnd_IN_0", "BackEnd_IN_0"] |
| Event Status | Status of this event. <br><br> Values: <ul><li>`Scheduled`: This event is scheduled to start after the time specified in the `NotBefore` property.<li>`Started`: This event has started.</ul> No `Completed` or similar status is ever provided; the event will no longer be returned when the event is completed.
| NotBefore| Time after which this event may start. <br><br> Example: <br><ul><li> 2016-09-19T18:29:47Z  |

### Event scheduling
Each event is scheduled a minimum amount of time in the future based on event type. This time is reflected in an event's `NotBefore` property. 

|EventType  | Minimum Notice |
| - | - |
| Freeze| 15 minutes |
| Reboot | 15 minutes |
| Redeploy | 10 minutes |

### Starting an event 

Once you have learned of an upcoming event and completed your logic for graceful shutdown, you can approve the outstanding event by making a `POST` call to the metadata service with the `EventId`. This indicates to Azure that it can shorten the minimum notification time (when possible). 

```
curl -H Metadata:true -X POST -d '{"DocumentIncarnation":"5", "StartRequests": [{"EventId": "f020ba2e-3bc0-4c40-a10b-86575a9eabd5"}]}' http://169.254.169.254/metadata/scheduledevents?api-version=2017-03-01
```

> [!NOTE] 
> Acknowledging an event allows the event to proceed for all `Resources` in the event, not just the virtual machine that acknowledges the event. You may therefore choose to elect a leader to coordinate the acknowledgement, which may be as simple as the first machine in the `Resources` field.




## Python sample 

The following sample queries the metadata service for scheduled events and approves each outstanding event.

```python
#!/usr/bin/python

import json
import urllib2
import socket
import sys

metadata_url = "http://169.254.169.254/metadata/scheduledevents?api-version=2017-03-01"
headers = "{Metadata:true}"
this_host = socket.gethostname()

def get_scheduled_events():
   req = urllib2.Request(metadata_url)
   req.add_header('Metadata', 'true')
   resp = urllib2.urlopen(req)
   data = json.loads(resp.read())
   return data

def handle_scheduled_events(data):
    for evt in data['Events']:
        eventid = evt['EventId']
        status = evt['EventStatus']
        resources = evt['Resources']
        eventtype = evt['EventType']
        resourcetype = evt['ResourceType']
        notbefore = evt['NotBefore'].replace(" ","_")
        if this_host in resources:
            print "+ Scheduled Event. This host is scheduled for " + eventype + " not before " + notbefore
            # Add logic for handling events here

def main():
   data = get_scheduled_events()
   handle_scheduled_events(data)
   
if __name__ == '__main__':
  main()
  sys.exit(0)
```

## Next steps 

- Read more about the APIs available in the [Instance Metadata service](instance-metadata-service.md).
- Learn about [planned maintenance for Linux virtual machines in Azure](planned-maintenance.md).
