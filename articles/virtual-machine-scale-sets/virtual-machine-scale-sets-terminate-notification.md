---
title: Terminate notification for Azure virtual machine scale set instances
description: Learn how to enable termination notification for Azure virtual machine scale set instances
author: shandilvarun
tags: azure-resource-manager
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.date: 08/27/2019
ms.author: vashan

---
# Terminate notification for Azure virtual machine scale set instances (Preview)
Scale set instances can opt in to receive instance termination notifications and set a pre-defined delay timeout to the terminate operation. The termination notification is sent through Azure Metadata Service – [Scheduled Events](../virtual-machines/windows/scheduled-events.md), which provides notifications for and delaying of impactful operations such as reboots and redeploy. The preview solution adds another event – Terminate – to the list of Scheduled Events, and the associated delay of the terminate event will depend on the delay limit as specified by users in their scale set model configurations.

Once enrolled into the feature, scale set instances don't need to wait for specified timeout to expire before the instance is deleted. After receiving a Terminate notification, the instance can choose to be deleted at any time before the terminate timeout expires.

> [!IMPORTANT]
> Terminate notification for scale set instances is currently in Public Preview. No opt in procedure is needed to use the public preview functionality described below.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable terminate notifications
There are multiple ways of enabling termination notifications on your scale set instances, as detailed in the examples below.

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

The above block specifies a timeout delay of 5 minutes (as indicated by *PT5M*) for any terminate operation on all instances in your scale set. The field *notBeforeTimeout* can take any value between 5 and 15 minutes in ISO 8601 format. You can change the default timeout for the terminate operation by modifying the *notBeforeTimeout* property under *terminateNotificationProfile* described above.

After enabling *scheduledEventsProfile* on the scale set model and setting the *notBeforeTimeout*, update the individual instances to the [latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

> [!NOTE]
>Terminate notifications on scale set instances can only be enabled with API version 2019-03-01 and above

### Azure PowerShell
When creating a new scale set, you can enable termination notifications on the scale set by using the [New-AzVmss](/powershell/module/az.compute/new-azvmss) cmdlet.

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic" `
  -TerminateScheduledEvents
```

The above example creates a new scale set with terminate notifications enabled with a 5-minute default timeout. When creating a new scale set, the parameter *TerminateScheduledEvents* does not require a value. To change the timeout value, specify the desired timeout through the *TerminateScheduledEventNotBeforeTimeoutInMinutes* parameter.

Use the [Update-AzVmss](/powershell/module/az.compute/update-azvmss) cmdlet to enable termination notifications on an existing scale set.

```azurepowershell-interactive
Update-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myScaleSet" `
  -TerminateScheduledEvents $true
  -TerminateScheduledEventNotBeforeTimeoutInMinutes 15
```
The above example enables terminate notifications on an existing scale set and sets a 15-minute timeout for the terminate event.

After enabling scheduled events on the scale set model and setting the timeout, update the individual instances to the [latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

## Get Terminate notifications

Terminate notifications are delivered through [Scheduled Events](../virtual-machines/windows/scheduled-events.md), which is an Azure Metadata Service. Azure Metadata service exposes information about running Virtual Machines using a REST Endpoint accessible from within the VM. The information is available via a non-routable IP so that it isn't exposed outside the VM.

Scheduled Events is enabled for your scale set the first time you make a request for events. You can expect a delayed response in your first call of up to two minutes. Query the endpoint periodically to detect upcoming maintenance events and the status of ongoing maintenance activities.

Scheduled Events is disabled for your scale set if the scale set instances don't make a request for 24 hours.

### Endpoint discovery
For VNET enabled VMs, the Metadata Service is available from a static non-routable IP, 169.254.169.254.

The full endpoint for the latest version of Scheduled Events for this preview is:
> 'http://169.254.169.254/metadata/scheduledevents?api-version=2019-01-01'

### Query response
A response contains an array of scheduled events. An empty array means that there are currently no events scheduled.

In the case where there are scheduled events, the response contains an array of events. For a “Terminate” event, the response will look as follows:
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

For more information on each of the fields above, see the Scheduled Events documentation for [Windows](../virtual-machines/windows/scheduled-events.md#event-properties) and [Linux](../virtual-machines/linux/scheduled-events.md#event-properties).

### Respond to events
Once you've learnt of an upcoming event and completed your logic for graceful shutdown, you may approve the outstanding event by making a POST call to the metadata service with the EventId. The POST call indicates to Azure that it can continue with the VM delete.

Below is the json expected in the POST request body. The request should contain a list of StartRequests. Each StartRequest contains the EventId for the event you want to expedite:
```
{
	"StartRequests" : [
		{
			"EventId": {EventId}
		}
	]
}
```

Ensure that every VM in the scale set is only approving the EventID relevant for that VM only. A VM can get its own VM name [through instance metadata](virtual-machine-scale-sets-instance-ids.md#instance-metadata-vm-name). This name takes the form "{scale-set-name}_{instance-id}", and will be displayed in the 'Resources' section of the query response described above.

You can also refer to samples scripts for querying and responding to events using [PowerShell](../virtual-machines/windows/scheduled-events.md#powershell-sample) and [Python](../virtual-machines/linux/scheduled-events.md#python-sample).

## Tips and best practices
-	Terminate notifications only on ‘delete’ operations – All delete operations (manual delete or Autoscale-initiated scale-in) will generate Terminate events if your scale set has *scheduledEventsProfile* enabled. Other operations such as reboot, reimage, redeploy, and stop/deallocate do not generate Terminate events. Terminate notifications can't be enabled for low-priority VMs.
-	No mandatory wait for timeout – You can start the terminate operation at any time after the event has been received and before the event's *NotBefore* time expires.
-	Mandatory delete at timeout – The preview doesn't provide any capability of extending the timeout value after an event has been generated. Once the timeout expires, the pending terminate event will be processed and the VM will be deleted.
-	Modifiable timeout value – You can modify the timeout value at any time before an instance is deleted, by modifying the *notBeforeTimeout* property on the scale set model and updating the VM instances to the latest model.
-	Approve all pending deletes – If there’s a pending delete on VM_1 that isn't approved, and you've approved another terminate event on VM_2, then VM_2 isn't deleted until the terminate event for VM_1 is approved, or its timeout has elapsed. Once you approve the terminate event for VM_1, then both VM_1 and VM_2 are deleted.
-	Approve all simultaneous deletes – Extending the above example, if VM_1 and VM_2 have the same *NotBefore* time, then both terminate events must be approved or neither VM is deleted before the timeout expires.

## Troubleshoot
### Failure to enable scheduledEventsProfile
If you get a ‘BadRequest’ error with an error message stating "Could not find member 'scheduledEventsProfile' on object of type 'VirtualMachineProfile'”, check the API version used for the scale set operations. Compute API version **2019-03-01** or higher is required for this preview.

### Failure to get Terminate events
If you are not getting any **Terminate** events through Scheduled Events, then check the API version used for getting the events. Metadata Service API version **2019-01-01** or higher is required for Terminate events.
>'http://169.254.169.254/metadata/scheduledevents?api-version=2019-01-01'

### Getting Terminate event with incorrect NotBefore time  
After enabling *scheduledEventsProfile* on the scale set model and setting the *notBeforeTimeout*, update the individual instances to the [latest model](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) to reflect the changes.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
