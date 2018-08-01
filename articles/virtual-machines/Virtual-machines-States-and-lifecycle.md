#Virtual Machines Lifecycle and States

Virtual Machines goes through different provisioning and power states during its lifecycle. The purpose of this document is to describe these states and specifically highlight when our customers are billed for hardware + software usage. 

##Power State

The Power states represent VM’s running state as seen by the hypervisor.

<img src="./media/Virtual-Machines-States/VM-Power-States.png" alt="VM power state diagram"/>


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
      "code": "ProvisioningState/creating",</br>
       "level": "Info",</br>
 "displayStatus": "Creating"</br>
  },</br>
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
 "code": "ProvisioningState/succeeded",</br>
 "level": "Info",</br>
 "displayStatus": "Provisioning succeeded",</br>
 "time": &ldquo;time&rdquo;</br>
 },</br>
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
<p>Status of the VM when a VM is either stopped from client or guest OS. Stopping status is a transitional state, which eventually transitions to its final state of Stopped.</p>
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/updating",</br>
 "level": "Info",</br>
 "displayStatus": "Updating"</br>
 },</br>
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
<p>State occurs when a VM has been shut down from the guest OS then the VM transitions to the stopped state.</p>
<p>An important distinction to note is that VM is only stopped on the host but not removed as compared to deallocate and is still billed.</p>
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/succeeded",</br>
 "level": "Info",</br>
 "displayStatus": "Provisioning succeeded",</br>
 "time": "time"</br>
 },</br>
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
<p>when the user stops the VM using client APIs VM transitions to deallocating transitional state.</p>
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/updating",</br>
 "level": "Info",</br>
 "displayStatus": "Updating"</br>
 },</br>
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
<p>VM is stopped and removed/deallocated from the host. VM in the deallocated state is not billed, but other resources like network and storage are billed.</p>
<code>"statuses": [</br>
 {</br>
 "code": "ProvisioningState/succeeded",</br>
 "level": "Info",</br>
 "displayStatus": "Provisioning succeeded",</br>
 "time": "time"</br>
 },</br>
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

Refer to the following [Virtual
Machines Error
Messages](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/error-messages)
for details.

##Provisioning

These states are statuses of User-initiated (control plane)
operations on the VM. These states are independent of the running state of a VM, which is observed as Power states and discussed earlier.

**User Initiated actions**

1.  **Create** – VM Creation

2.  **Update** – Update model for an existing VM. Some non-model changes
    to VM such as start/Restart also fall under update.

3.  **Delete** – VM deletion

4.  **Deallocate** – Deallocating a VM is a power state. Internal effect
    of deallocating a VM results into Update of the VM hence resulting
    into provisioning states related to updating.

**Operation states** – Transitional states after the platform has
accepted the request for user action.

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
<p><strong>InProgress</strong></p>
</td>
<td width="366">
<p>Creating or updating or deletion status</p>
</td>
</tr>
<tr>
<td width="162">
<p><strong>Canceled</strong></p>
</td>
<td width="366">
<p>User-initiated cancel will result in this state</p>
</td>
</tr>
<tr>
<td width="162">
<p><strong>OS provisioning states</strong></p>
</td>
<td width="366">
<p>If a VM is created with an OS image and not with a specialized image, then following substates can be observed</p>
<p><strong>1. </strong><strong>OSProvisioningInprogress</strong> &ndash; The VM is running, and installation of guest OS is in progress. <br /> 
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/ OSProvisioningInprogress",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning In progress"</br>
 }</br>
]</code></br>
<p><strong>2. </strong><strong>OSProvisioningComplete</strong> &ndash; Short-lived as it quickly transitions to Success state from completion unless VM has to install the extension. Installation of extension take time and thus provides a window to observe these states. <br />
<code> "statuses": [</br>
 {</br>
 "code": "ProvisioningState/ OSProvisioningComplete",</br>
 "level": "Info",</br>
 "displayStatus": "OS Provisioning Complete"</br>
 }</br>
]</code></br>
<p><strong>Note</strong>: OS Provisioning can transition to Failed if OS fails or if OS fails to install in time. At this time, customers will be billed for the deployed VM on the infrastructure. In cases where OS takes longer than expected to complete the installation, the platform will automatically transition to success from failure. In other cases, restarting a VM can resolve the issue. If the issue is persistent, then refer to error codes documentation for resolution.</p>
</td>
</tr>
</tbody>
</table>

**Success**– This state represents that user-initiated actions have
completed.
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

**Failed** – This state represent a failed operation. Refer to the error codes to get more information and possible
resolution.
<code>
 "statuses": \[</br>
 {</br>
     "code": "ProvisioningState/failed",</br>
     "level": "Info",</br>
     "displayStatus": "Provisioning failed",</br>
     "time": "time"</br>
 }</br>
 \]</br>
</code>
**Edge cases**: In cases where a VM was running and in a good state, a
failed management operation will typically leave the VM running with the
original VM model (configuration). If such a case happens, then the
effective running VM model may be different from the latest received and
persisted model by CRP. CRP persisted model gets returned with GetVM API. To resolve this
issue, look at the error message (either from the last failed
operation of the VM instance view). If the error is due to API input validation, then try to fix the inputs. If the error, is due to Azure
internal errors a retry of the management operation should resolve the
issue.
