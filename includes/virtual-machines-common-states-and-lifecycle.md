---
 title: include file
 description: include file
 services: virtual-machines
 author: shandilvarun
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/02/2018
 ms.author: vashan, cynthn
 ms.custom: include file
---

Virtual machines go through different states that can be categorized into *provisioning* and *power* states. The purpose of this article is to describe these states and specifically highlight when customers are billed for hardware and software usage. 

## Power States

The power state represents the last known state of a VM.

![VM power state diagram](./media/virtual-machines-common-states-and-lifecycle/vm-power-states.png)



<table>
<th>
<td>
<p><b>State</b></p>
</td>
<td>
<p><b>Description</b></p>
</td>
<td>
<p><b>Billing</b></p>
</td>
</th>
<tr>
<td>
<p><b>Starting</b></p>
</td>
<td>
<p>VM is starting up.</p>
<code>"statuses": [</br>
   {</br>
      "code": "PowerState/starting",</br>
       "level": "Info",</br>
        "displayStatus": "VM starting"</br>
    }</br>
    ]</code></br>
</td>
<td>
<p><b>Not Billed</b></p>
</td>
</tr>
<tr>
<td>
<p><b>Running</b></p>
</td>
<td>
<p>Running state for a VM</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/running",</br>
 "level": "Info",</br>
 "displayStatus": "VM running"</br>
 }</br>
 ]</code></br>
</td>
<td>
<p><b>Billed (Hardware + Software) </b></p>
</td>
</tr>
<tr>
<td>
<p><b>Stopping</b></p>
</td>
<td>
<p>**Stopping** is a transitional state. When completed, it will show as **Stopped**.</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/stopping",</br>
 "level": "Info",</br>
 "displayStatus": "VM stopping"</br>
 }</br>
 ]</code></br>
</td>
<td>
<p><b>Billed (Hardware + Software)</b></p>
</td>
</tr>
<tr>
<td>
<p><b>Stopped</b></p>
</td>
<td>
<p>Stopped state is observed when a VM has been shut down from the guest OS or client PowerOff APIs.</p>
<p>VM in a stopped state is not removed from the host as compared to deallocated state. </p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/stopped",</br>
 "level": "Info",</br>
 "displayStatus": "VM stopped"</br>
 }</br>
 ]</code></br>
</td>
<td>
<p><b>Billed (Hardware only)</b></p>
</td>
</tr>
<tr>
<td>
<p><b>Deallocating</b></p>
</td>
<td>
<p>Deallocating is a transitional state of a VM when user performs a deallocate action.</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/deallocating",</br>
 "level": "Info",</br>
 "displayStatus": "VM deallocating"</br>
 }</br>
 ]</code></br>
</td>
<td>
<p><b>Billed (Hardware only)</b></p>
</td>
</tr>
<tr>
<td>
<p><b>Deallocated</b></p>
</td>
<td>
<p>Deallocated status is observed when CRP has successfully stopped and removed the VM from the host. </p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/deallocated",</br>
 "level": "Info",</br>
 "displayStatus": "VM deallocated"</br>
 }</br>
 ]</code></br>
</td>
<td>
<p><b>Not billed </b></p>
</td>
</tr>
</tbody>
</table>


## Provisioning states

A provisioning state is the status of a user-initiated (control plane) operation on the VM. These states are independent of the power state of a VM.

**User Initiated actions**

- **Create** – VM creation.

- **Update** – update model for an existing VM. Some non-model changes to VM such as Start/Restart also fall under update.

- **Delete** – VM deletion.

- **Deallocate** – is where a VM is stopped and removed from the host. Deallocating a VM results into Update of the VM model hence resulting into provisioning states related to updating.

- **Operation states** – transitional states after the platform has
accepted the request for user-initiated action.

<table>
<tbody>
<tr>
<td width="162">
<p><b>States</b></p>
</td>
<td width="366">
<p>Description</p>
</td>
</tr>
<tr>
<td width="162">
<p><b>Creating</b></p>
</td>
<td width="366">
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/creating",</br>
 "level": "Info",</br>
 "displayStatus": "Creating"</br>
 }</code></br>
</td>
</tr>
<tr>
<td width="162">
<p><b>Updating</b></p>
</td>
<td width="366">
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/updating",</br>
 "level": "Info",</br>
 "displayStatus": "Updating"</br>
 }</br>
 ]</code></br>
</td>
</tr>
<tr>
<td width="162">
<p><b>Deleting</b></p>
</td>
<td width="366">
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/deleting",</br>
 "level": "Info",</br>
 "displayStatus": "Deleting"</br>
 }</br>
 ]</code></br>
</td>
</tr>
<tr>
<td width="162">
<p><b>OS provisioning states</b></p>
</td>
<td width="366">
<p>If a VM is created with an OS image and not with a specialized image, then following substates can be observed</p>
<p><b>1. </b><b>OSProvisioningInprogress</b> &ndash; The VM is running, and installation of guest OS is in progress. <p /> 
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/creating/OSProvisioningInprogress",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning In progress"</br>
 }</br>
]</code></br>
<p><b>2. </b><b>OSProvisioningComplete</b> &ndash; Short-lived state, as it quickly transitions to Success unless VM has to install any extensions. Installation of extensions takes time and provides a window to observe this state. <br />
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/creating/OSProvisioningComplete",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning Complete"</br>
 }</br>
]</code></br>
<p><b>Note</b>: OS Provisioning can transition to Failed if OS fails or if OS fails to install in time. At this time, customers will be billed for the deployed VM on the infrastructure.</p>
</td>
</tr>
</tbody>
</table>

**Succeeded**– This state represents that user-initiated actions have
completed.
</p>
<code>
 "statuses": \[ </br>
 {</br>
     "code": "ProvisioningState/succeeded",</br>
     "level": "Info",</br>
     "displayStatus": "Provisioning succeeded",</br>
     "time": "time"</br>
 }</br>
 \]</br>
</code>
</p>
**Failed** – This state represents a failed operation. Refer to the error codes to get more information and possible
resolution.
</p>
<code>
 "statuses": [</br>
    {</br>
      "code": "ProvisioningState/failed/InternalOperationError",</br>
      "level": "Error",</br>
      "displayStatus": "Provisioning failed",</br>
      "message": "Operation abandoned due to internal error. Please try again later.",</br>
      "time": "time"</br>
    }</br>
</code>
</p>
**Edge cases**: In cases where a VM was running and in a good state, a
failed management operation will typically leave the VM running with the
original VM model (configuration). If such a case happens, then the
effective running VM model may be different from the latest received and
persisted model by CRP. CRP persisted model gets returned with GetVM API. To resolve this
issue, look at the error message (either from the last failed
operation of the VM instance view). If the error is due to API input validation, then try to fix the inputs. If the error, is due to Azure
internal errors a retry of the management operation should resolve the
issue.

## VM Instance View
Virtual Machine Instance View API provides VM running-state information. [Here] (https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines/instanceview) is the API documentation.

Azure Resources explorer provides a simple UX to view VM running state: [Resource Explorer] (https://resources.azure.com/)

Provisioning states are visible on VM properties and Instance View whereas Power States are available in Instance View of VM. 