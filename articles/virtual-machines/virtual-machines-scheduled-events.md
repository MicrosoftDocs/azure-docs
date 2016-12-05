---
title: Scheduled Events with Azure Metadata Service | Microsoft Docs
description: React to Impactful Events on your Virtual Machine before they happen.
services: virtual-machines-windows, virtual-machines-linux, cloud-services
documentationcenter: ''
author: zivraf
manager: timlt
editor: ''
tags: ''

ms.assetid: 28d8e1f2-8e61-4fbe-bfe8-80a68443baba
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/10/2016
ms.author: zivr

---
# Azure Metadata Service - Scheduled Events

Azure Metadata service enables you to discover information about your Virtual Machine hosted in Azure. One of the Metadata Service data categories is Scheduled Events where you can get information regarding upcoming events (for example, reboot) 
so your service can prepare for them and limit disruption. It's available for all Azure Virtual Machine types including PaaS and IaaS. The service gives your Virtual Machine time to perform 
preventive tasks and minimize the effect of an event. For example, your service might drain sessions, elect a new leader, or copy data after observing that an instance is scheduled for reboot to avoid 
disruption.



## Introduction - Why Scheduled Events?

With Scheduled Events, you can learn of (discover) upcoming events that may impact the availability of your Virtual Machine and take proactive operations to limit the impact on your service.
Multi-instance workloads, which use replication techniques to maintain state, may be vulnerable to frequent outages happening across multiple instances. Such outages may result in expensive tasks 
(for example, rebuilding indexes) or even a replica loss.
In many other cases, using graceful shutdown sequence improves the overall service availability. For example, completing (or canceling) in-flight transactions, reassigning other tasks to other VMs 
in the cluster (manual failover), remove the Virtual Machine from a load balancer pool.
There are cases where notifying an administrator about upcoming event or even just logging such an event help improving the serviceability of applications hosted in the cloud.

Azure Metadata Service surfaces scheduled events in the following use cases:     
-   Platform initiated ‘impactful’ maintenance (for example, Host OS rollout)
-   Platform initiated ‘impact-less’ maintenance (for example, In-place VM Migration)
-   Interactive calls (for example, user restarts or redeploy a VM)



## Scheduled Events – The Basics  

Azure Metadata service exposes information about running Virtual Machines using a REST Endpoint from within the VM. The information is available via a Non-routable IP so that it is not exposed 
outside the VM.

### Scope 
Scheduled events are surfaced to all VMs in a cloud service or to all VMs in an Availability Set. As a result, you should check the **Resources* field in the event to identify which VMs are
going to be impacted.

### Discover the Endpoint
In the case where a Virtual Machine is created within a Virtual Network (VNet), the metadata service is available from the non-routable IP of:
169.254.169.254

In the case where a Virtual Machine is used for cloud services (PaaS), metadata service endpoint could be discovered using the registry.

    {HKEY_LOCAL_MACHINE\Software\Microsoft\Windows Azure\DeploymentManagement}

### Versioning 
The Metadata Service uses a versioned API in the following format: http://{ip}/metadata/{version}/scheduledevents
It is recommended that your service consumes the latest version available at: http://{ip}/metadata/latest/scheduledevents

### Using Headers
When you query the Metadata Service, you must provide the following header **Metadata:true **. 

### Enable Scheduled Events
The first time you call for scheduled events, Azure implicitly enables the feature on your Virtual Machine. 
As a result, you should expect a delayed response in your first call of up to a minute. 


## Using the API

### Query for events
You can query for Scheduled Events simply by making the following call

	curl -H Metadata:true http://169.254.169.254/metadata/latest/scheduledevents

A response contains an array of scheduled events. An empty array means that there are currently no events scheduled.
In the case where there are scheduled events, the response contains an array of events: 

	{
     "Events":[
          {
                "EventId":{eventID},
                "EventType":"Reboot" | "Redeploy" | "Pause",
                "ResourceType":"VirtualMachine",
                "Resources":[{resourceName}],
                "EventStatus":"Scheduled" | "Started",
                "NotBefore":{timeInUTC},              
         }
     ]
	}

EventType Captures the expected impact on the Virtual Machine where:
- Pause: The Virtual Machine is scheduled to pause for few seconds. There is no impact on memory, open files or network connections
- Reboot: The Virtual Machine is scheduled for reboot (memory is wiped).
- Redeploy: The Virtual Machine is scheduled to move to another node (ephemeral disk are lost). 

When an event is scheduled (Status = Scheduled) Azure shares the time after which the event can start (specified in the NotBefore field).

### Starting an event (expedite)

Once you have learned of an upcoming event and completed your logic for graceful shutdown, you can indicate Azure to move faster (when possible) by making a **POST** call 
 

## Samples 


### PowerShell Sample 

The following sample reads the metadata server for scheduled events and
record them in the Application event log before acknowledging.

```PowerShell
$localHostIP = "169.254.169.254"
$ScheduledEventURI = "http://"+$localHostIP+"/metadata/latest/scheduledevents"

# Call Azure Metadata Service - Scheduled Events 
$scheduledEventsResponse =  Invoke-RestMethod -Headers @{"Metadata"="true"} -URI $ScheduledEventURI -Method get 

if ($json.Events.Count -eq 0 )
{
    Write-Output "++No scheduled events were found"
}

for ($eventIdx=0; $eventIdx -lt $scheduledEventsResponse.Events.Length ; $eventIdx++)
{
    if ($scheduledEventsResponse.Events[$eventIdx].Resources[0].ToLower().substring(1) -eq $env:COMPUTERNAME.ToLower())
    {    
        # YOUR LOGIC HERE 
         pause "This Virtual Machine is scheduled for to "+ $scheduledEventsResponse.Events[$eventIdx].EventType

        # Acknoledge the event to expedite
        $jsonResp = "{""StartRequests"" : [{ ""EventId"": """+$scheduledEventsResponse.events[$eventIdx].EventId +"""}]}"
        $respbody = convertto-JSon $jsonResp
       
        Invoke-RestMethod -Uri $ScheduledEventURI  -Headers @{"Metadata"="true"} -Method POST -Body $jsonResp 
    }
}


``` 


### C\# Sample 

```csharp

    class Program
    {
        static void Main(string[] args)
        {
            ScheduledEventsCallAsync().Wait();
            Console.ReadLine();

        }
        static async Task ScheduledEventsCallAsync()
        {
            try
            {
                var client = new HttpClient();
                client.BaseAddress = new Uri("http://169.254.169.254/");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Add("Metadata", "true");
                HttpResponseMessage response = await client.GetAsync("metadata/latest/scheduledevents");
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("REST Call returned success {0}", response.Content);
                    string str = response.Content.ReadAsStringAsync().Result;
                    CloudControlMessage msg = JSonHelper.ConvertJSonToObject<CloudControlMessage>(str);
                    Console.WriteLine("Analyze Scheduled Events Array with {0} events", msg.Events.Count);

                    foreach (CloudControlEvent ccEvent in msg.Events)
                    {
                        Console.WriteLine("EventID: {0}, EventType{1}, EventStatus{2}, Resource{3}, NotBefore{4}",
                            ccEvent.EventId,
                            ccEvent.EventType,
                            ccEvent.EventStatus,
                            ccEvent.Resources.First<string>(),
                            ccEvent.NoteBefore);
                    }
                }
                else
                {
                    Console.WriteLine("REST Call returned failed {0}", response.IsSuccessStatusCode);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception caught {0}", ex);
            }
        }

        public class CloudControlEvent
        {
            public string EventId { get; set; }
            public string EventStatus { get; set; }
            public string EventType { get; set; }
            public string ResourceType { get; set; }
            public List<string> Resources { get; set; }
            public DateTime NoteBefore { get; set; }
        }

        public class CloudControlMessage
        {
            public List<CloudControlEvent> Events { get; set; }
        }

        private static class JSonHelper
        {
            public static string ConvertObjectToJSon<T>(T obj)
            {
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
                MemoryStream ms = new MemoryStream();
                ser.WriteObject(ms, obj);
                string jsonString = Encoding.UTF8.GetString(ms.ToArray());
                ms.Close();
                return jsonString;
            }

            public static T ConvertJSonToObject<T>(string jsonString)
            {
                DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
                MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
                T obj = (T)serializer.ReadObject(ms);
                return obj;
            }
        }
    }

```
### Python Sample 

```python


#!/usr/bin/python

import json
import urllib2
import socket
import sys

metadata_url="http://169.254.169.254/metadata/latest/scheduledevents"
headers="{Metadata:true}"
this_host=socket.gethostname()

def get_scheduled_events():
   req=urllib2.Request(metadata_url)
   req.add_header('Metadata','true')
   resp=urllib2.urlopen(req)
   data=json.loads(resp.read())
   return data

def handle_scheduled_events(data):
    for evt in data['Events']:
        eventid=evt['EventId']
        status=evt['EventStatus']
        resources=evt['Resources'][0]
        eventype=evt['EventType']
        restype=evt['ResourceType']
        notbefore=evt['NotBefore'].replace(" ","_")
        if this_host in evt['Resources'][0]:
            print "+ Scheduled Event. This host is scheduled for " + eventype + " not before " + notbefore
            print "++ Add you logic here"

def main():
   data=get_scheduled_events()
   handle_scheduled_events(data)
   

if __name__ == '__main__':
  main()
  sys.exit(0)


```
