---
title: Terminate notification for Azure virtual machine scale set instances | Microsoft Docs
description: Learn how to enable terminate notification for Azure virtual machine scale set instances
services: virtual-machine-scale-sets
documentationcenter: ''
author: mayanknayar
manager: drewm
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/27/2019
ms.author: manayar

---
# Terminate notification for Azure virtual machine scale set instances (Preview)
Scale set instances can opt-in to receive instance termination notifications and set a pre-defined delay timeout to the terminate operation.

The termination notification will be sent through Azure Metadata Service – [Scheduled Events](../virtual-machines/windows/scheduled-events.md), which provides notifications for and delaying of impactful operations such as reboots and redeploy. The preview solution adds another event – Terminate – to the list of Scheduled Events, and the associated delay of the terminate event will depend on the delay limit as specified by users in their VMSS model configurations.

Once enrolled into the feature, VMSS instances do not need to wait for the entire duration of the specified interval for the instance to terminate. After receiving a Terminate notification, the instance can choose to be deleted at any time prior to the terminate timeout period expiration.

> [!IMPORTANT]
> Terminate notification for scale set instances is currently in Public Preview. No opt-in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable terminate notifications
There are multiple ways of enabling termination notifications on your scale set instances as detailed in the examples below.

### REST API

The following example enables terminate notification on the scale set model.

```
PUT on `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2019-03-01`
```

```json
{
  "properties": {
    "virtualMachineProfile": {
            "scheduledEventsProfile": {
                "terminateNotificationProfile": {
                    "notBeforeTimeout":"PT5M",
                    "enable":true
                }
            }
        }
    }        
}

```

The above block specifies a timeout delay of 5 minutes (as indicated by *PT5M*) for any terminate operation on all instances in your scale set. The field notBeforeTimeout can take any value between 5 and 15 minutes in ISO 8601 format.

After enabling scheduledEventsProfile on the scale set model and setting the notBeforeTimeout, the individual instances must be [updated to the latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

> [!NOTE]
>Terminate notifications on scale set instances can only be enabled with API version 2019-03-01 and above

### Azure PowerShell

Use the [Update-AzVmssVM](/powershell/module/az.compute/update-azvmssvm) cmdlet to apply scale-in protection to your scale set instance.

The following example applies scale-in protection to an instance in the scale set having instance ID 0.

```azurepowershell-interactive
Update-AzVmssVM `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myVMScaleSet" `
  -InstanceId 0 `
  -ProtectFromScaleIn $true
```

The above block specifies a timeout delay of 5 minutes (as indicated by *PT5M*) for any terminate operation on all instances in your scale set. The field notBeforeTimeout can take any value between 5 and 15 minutes in ISO 8601 format.

After enabling scheduledEventsProfile on the scale set model and setting the notBeforeTimeout, the individual instances must be [updated to the latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

## Changing default timeout

You can change the default timeout for the terminate operation by modifying the notBeforeTimeout property under terminateNotificationProfile described above.

To apply the new timeout to the existing scale set instances you must update the instances to [latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) for the changes to apply. New timeout will not apply to existing instances till they are upgraded to the latest scale set model. The new timeout will also not apply to any VM that has already started the termination process.

## Get Terminate notifications

Terminate notifications are delivered through [Scheduled Events](../virtual-machines/windows/scheduled-events.md), which is an Azure Metadata Service. Azure Metadata service exposes information about running Virtual Machines using a REST Endpoint accessible from within the VM. The information is available via a non-routable IP so that it is not exposed outside the VM.

Scheduled Events is enabled for your scale set the first time you make a request for events. You should expect a delayed response in your first call of up to two minutes. You should query the endpoint periodically to detect upcoming maintenance events as well as the status of maintenance activities being performed.

Scheduled Events is disabled for your scale set if the scale set instances do not make a request for 24 hours.

### Endpoint discovery
For VNET enabled VMs, the Metadata Service is available from a static non-routable IP, 169.254.169.254.

The full endpoint for the latest version of Scheduled Events for this preview is:
> 'http://169.254.169.254/metadata/scheduledevents?api-version=2019-01-01'

### Query response
A response contains an array of scheduled events. An empty array means that there are currently no events scheduled.

In the case where there are scheduled events, the response contains an array of events. For a “Terminate” event, the response will look as follows::
```
{
    "DocumentIncarnation": {IncarnationID},
    "Events": [
        {
            "EventId": {eventID},
            "EventType": "Terminate",
            "ResourceType": "VirtualMachine",
            "Resources": [{resourceName}],
            "EventStatus": "Scheduled",
            "NotBefore": {timeInUTC},
        }
    ]
}
```
The DocumentIncarnation is an ETag and provides an easy way to inspect if the Events payload has changed since the last query.

For more details on each of the fields above, please refer to the Scheduled Events documentation for [Windows](../virtual-machines/windows/scheduled-events.md#event-properties) and [Linux](../virtual-machines/linux/scheduled-events#event-properties).

### Respond to events
Once you have learned of an upcoming event and completed your logic for graceful shutdown, you may approve the outstanding event by making a POST call to the metadata service with the EventId. This indicates to Azure that it can shorten the minimum notification time (when possible).

The following is the json expected in the POST request body. The request should contain a list of StartRequests. Each StartRequest contains the EventId for the event you want to expedite:
```
{
	"StartRequests" : [
		{
			"EventId": {EventId}
		}
	]
}
```

Ensure that every VM in the scale set is only approving the EventID relevant for that VM only. To do this, a VM can get its own VM name [through instance metadata](virtual-machine-scale-sets-instance-ids.md#instance-metadata-vm-name). This name takes the form "{scale-set-name}_{instance-id}", and will be displayed in the 'Resources' section of the query response described above.

You can also refer to samples scripts for querying and responding to events using [PowerShell](../virtual-machines/windows/scheduled-events.md#powershell-sample) and [Python](../virtual-machines/linux/scheduled-events#python-sample).

## Tips and best practices
-	Terminate notifications for all ‘delete’ operations – All delete operation (manual or Autoscale-initiated) will get Terminate events if your scale set has scheduledEventsProfile enabled.
-	No mandatory wait for timeout – You can start the terminate operation at any time after the event has been received and before the event's NotBefore time expires.
-	Mandatory delete at timeout – The preview does not provide any capability of extending the timeout period after an event has been generated. Once the timeout period expires, the pending terminate event will be processed and the VM will be deleted.
-	Modifiable timeout period – You can modify the timeout period at any time before an instance is deleted by modifying the notBeforeTimeout property on the VMSS model and updating the VMSS instances to the latest model.
-	All pending deletes must be approved for any VM to be cleaned up – If there’s a pending delete on VM_1 that is not approved, and you have approved another terminate event on VM_2 , VM_2 will not be cleaned up until VM_1 has been approved, or its timeout has elapsed. Once you approve the terminate event for VM_1, then both VM_1 and VM_2 will both be deleted.
-	Simultaneous deletes must all be approved – Extending the above example, if VM_1 and VM_2 have the same NotBefore time, then both terminate events must be approved or neither VM will be deleted before timeout expires.

## Troubleshoot
### Failure to enable scheduledEventsProfile
If you get a ‘BadRequest’ error with an error message stating "Could not find member 'scheduledEventsProfile' on object of type 'VirtualMachineProfile'”, then check the API version used for the scale set operations. Compute API version **2019-03-01** or higher is required for this preview.

### Failure to get Terminate events
If you are not getting any **Terminate** events through Scheduled Events, then check the API version used for getting the events. Metadata Service API version **2019-01-01** or higher is required for Terminate events.
>'http://169.254.169.254/metadata/scheduledevents?api-version=2019-01-01'

### Getting Terminate event with incorrect NotBefore time  
After enabling scheduledEventsProfile on the scale set model and setting the notBeforeTimeout, the individual instances must be [updated to the latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
