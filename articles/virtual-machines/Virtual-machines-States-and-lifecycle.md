#Virtual Machines Lifecycle and States

Virtual Machine goes through different states that can be categories into "provisioning" and "power" states. The purpose of this document is to describe these states and specifically highlight when customers are billed for hardware and software usage. 

##Power States

The Power states represent last known VM running state.

![VM power state diagram](./media/Virtual-Machines-States/VM-Power-States.png)



<table width="685">
<tbody>
<tr>
<td width="119">
<p><strong>State</strong></p>
</td>
<td width="484">
<p><strong>Description</strong></p>
</td>
<td width="83">
<p><strong>Billing</strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Starting</strong></p>
</td>
<td width="484">
<p>VM is starting up.</p>
<code>"statuses": [</br>
   {</br>
      "code": "PowerState/starting",</br>
       "level": "Info",</br>
        "displayStatus": "VM starting"</br>
    }</br>
    ]</code></br>
</td>
<td width="83">
<p><strong>Not Billed</strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Running</strong></p>
</td>
<td width="484">
<p>Running state for a VM</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/running",</br>
 "level": "Info",</br>
 "displayStatus": "VM running"</br>
 }</br>
 ]</code></br>
</td>
<td width="83">
<p><strong>Billed (Hardware + Software) </strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Stopping</strong></p>
</td>
<td width="484">
<p>Stopping is a transitional state, which eventually transitions to its final state of Stopped.</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/stopping",</br>
 "level": "Info",</br>
 "displayStatus": "VM stopping"</br>
 }</br>
 ]</code></br>
</td>
<td width="83">
<p><strong>Billed (Hardware + Software)</strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Stopped</strong></p>
</td>
<td width="484">
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
<td width="83">
<p><strong>Billed (Hardware only)</strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Deallocating</strong></p>
</td>
<td width="484">
<p>Deallocating is a transitional state of a VM when user performs a deallocate action.</p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/deallocating",</br>
 "level": "Info",</br>
 "displayStatus": "VM deallocating"</br>
 }</br>
 ]</code></br>
</td>
<td width="83">
<p><strong>Billed (Hardware only)</strong></p>
</td>
</tr>
<tr>
<td width="119">
<p><strong>Deallocated</strong></p>
</td>
<td width="484">
<p>Deallocated status is observed when CRP has successfully stopped and removed the VM from the host. </p>
<code>"statuses": [</br>
 {</br>
 "code": "PowerState/deallocated",</br>
 "level": "Info",</br>
 "displayStatus": "VM deallocated"</br>
 }</br>
 ]</code></br>
</td>
<td width="83">
<p><strong>Not billed </strong></p>
</td>
</tr>
</tbody>
</table>


##Provisioning States

Provisioning states are statuses of User-initiated (control plane)
operations on the VM. These states are independent of the running state of a VM; which are observed as Power states and discussed earlier.

**User Initiated actions**

1.  **Create** – VM Creation

2.  **Update** – Update model for an existing VM. Some non-model changes
    to VM such as start/Restart also fall under update.

3.  **Delete** – VM deletion

4.  **Deallocate** – VM deallocate is a CRP control plane operation, where VM is stopped and removed from the host. Deallocating a VM results into Update of the VM model hence resulting
    into provisioning states related to updating.

**Operation states** – Transitional states after the platform has
accepted the request for user-initiated action.

<table>
<tbody>
<tr>
<td width="162">
<p><strong>States</strong></p>
</td>
<td width="366">
<p>Description</p>
</td>
</tr>
<tr>
<td width="162">
<p><strong>Creating</strong></p>
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
<p><strong>Updating</strong></p>
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
<p><strong>Deleting</strong></p>
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
<p><strong>OS provisioning states</strong></p>
</td>
<td width="366">
<p>If a VM is created with an OS image and not with a specialized image, then following substates can be observed</p>
<p><strong>1. </strong><strong>OSProvisioningInprogress</strong> &ndash; The VM is running, and installation of guest OS is in progress. <p /> 
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/creating/OSProvisioningInprogress",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning In progress"</br>
 }</br>
]</code></br>
<p><strong>2. </strong><strong>OSProvisioningComplete</strong> &ndash; Short-lived state, as it quickly transitions to Success unless VM has to install any extensions. Installation of extensions takes time and provides a window to observe this state. <br />
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/creating/OSProvisioningComplete",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning Complete"</br>
 }</br>
]</code></br>
<p><strong>Note</strong>: OS Provisioning can transition to Failed if OS fails or if OS fails to install in time. At this time, customers will be billed for the deployed VM on the infrastructure.</p>
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

##VM Instance View
Virtual Machine Instance View API provides VM running-state information. [Here] (https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines/instanceview) is the API documentation.

Azure Resources explorer provides a simple UX to view VM running state: [Resource Explorer] (https://resources.azure.com/)

Provisioning states are visible on VM properties and Instance View whereas Power States are available in Instance View of VM. 