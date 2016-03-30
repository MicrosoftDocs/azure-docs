<properties 
	pageTitle="Instance Metadata Services on your VMs | Microsoft Azure" 
	description="Learn what instance metadata can be collected about your VMs." 
	services="virtual-machines-linux" 
	documentationCenter="" 
	authors="rickstercdn"  
	manager="timlt" 
	editor="tysonn"
	tag="azure-resource-manager" />

<tags 
	ms.service="virtual-machines-linux" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/25/2016" 
	ms.author="rclaus"/>

# In-VM Notification Services

Note: the following information relates to a service that is in PREVIEW as of March 29th, 2016.

This will help service owners understand what is going to happen to their VMs five minutes prior to a VM event.

One of the advantages in running virtual machines on Azure is that we allow a VM grouping in an availability set for redundancy so the service stays available during [planned platform updates](virtual-machines-linux-planned-maintenance.md) and even when unexpected problems occur. When Azure detects a problem with a node, it proactively moves the VM to new nodes, so its restored to a running and accessible state. Some updates do require a reboot to your virtual machines. As a service owner, you might want to be better prepared for the coming occurrence, even though we send [email notifications](virtual-machines-linux-planned-maintenance.md) for such events.

Some services just need to know when such event is about to happen. It will allow the services to execute several steps that can minimize and even eliminate the service interruption to its end-users. In this post we present the In-VM Metadata service. The service is based on [IETF 3927](https://tools.ietf.org/html/rfc3927) allowing a dynamic network configuration within the 169.254/16 prefix that is valid for communication with other VMs connected to the same physical node.


### How Should I Use It? ###
The In-VM Metadata service allows a standard method to pull the maintenance status of that VM by executing the command:

```curl http://169.254.169.254/metadata/v1/maintenance```

The standard results set will include three main attributes: InstanceID, placement upgrade-domains and placement fault-domains. If an on-going maintenance activity is about to begin (within 5 minutes)  an additional maintenance event will be added.

Normal Results - 

``` {} ```

Results when your VM in about to reboot -

```{
  "EventID": "6f0a13a3-dc0d-4bbe-ab24-df710a3917e6",
  "EventCreationTime": "9/15/2015 6:42:51 AM"
}```

Another call availible in the current preview is update-domain and fault-domain palcement.

```curl http://169.254.169.254/metadata/v1/instanceInfo```

Results are - 

```{"ID":"_imds2","UD":"0","FD":"0"}```


### Why Should I Use it? ###
The service is easy to use and available on any OS you choose to run. It will allow a pulling-based mechanism from the VM itself so the DevOps team operating the service can get a near-time status of their VMs. Such indications can help you mask availability issues from your end-users and increase the service availability (basic availability logging or pro-active steps for incoming reboot events).

There are two scenarios one can use In-VM Metadata:

1. System logging events: In this example, the service owners would like to track their resources availability by pulling data on regular basis and store it in EventLog (Windows) or syslog (Linux).

2. Masking reboots from end-users by tracking on-the-spot upcoming reboots and drains traffic from a VM that about to be rebooted. VMs can be excluded from its [availability set](virtual-machines-classic-configure-availability.md) based on dynamic indication pulled from the In-VM Metadata service.

####Simple Reboot Logging####
The example below shows how upcoming reboots on an Azure VM can be logged using standard logging (syslog for Linux and EventLog for Windows. 

The [IsVmInMaint.sh](https://github.com/yahavb/AzureComputeInVmNotification/blob/master/samples/IsVmInMaint.sh) needs to be registered in crontab to be executed every five minutes and log upcoming reboots event using the Linux syslog. 

``` bash
#!/bin/bash
result=`curl http://169.254.169.254/metadata/v1/InstanceInfo| grep -i reboot`
if [ -n $result ]; then
 `logger Incoming VM reboot`
fi
```

[IsVmInMaint.ps1](https://github.com/yahavb/AzureComputeInVmNotification/blob/master/samples/IsVmInMaint.ps1) is scheduled to execute every five minutes and log an event in the EventLog in case of a VM reboot is about to happen.

```$result=curl http://169.254.169.254/metadata/v1/maintenance | findstr -i EventID```

```if ($result) {Write-EventLog -LogName Application –Source "IsVmInMaint" -EntryType```
