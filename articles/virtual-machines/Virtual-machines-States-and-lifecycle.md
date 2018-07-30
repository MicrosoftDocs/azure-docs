*Virtual Machines Lifecycle and States

Understand different VM states which makes up a Virtual Machine (VM)
lifecycle. VMs can be in one of the two distinct state machines called
provisioning and power states. Understanding these states will help
build a great customer experience for your applications.

**Power State

The Power states represent VM’s running state as seen by the hypervisor.

![VM power state diagram](./media/Virtual-Machines-States/VM-Power-States.png)

Figure 1: VM power state diagram

|    State    |    Description    |    Billing    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
|    Starting    |    VM is starting up.    "statuses": [       {         "code":   "ProvisioningState/creating",         "level":   "Info",           "displayStatus": "Creating"       },       {         "code":   "PowerState/starting",         "level":   "Info",           "displayStatus": "VM starting"       }     ]    |    Not Billed    |
|    Running    |    Running state for a VM   "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time": “time”       },       {         "code":   "PowerState/running",         "level":   "Info",           "displayStatus": "VM running"       }     ]    |    Billed (Hardware + Software)     |
|    Stopping    |    Status of the VM when a VM is either   stopped from client or guest OS. Stopping   status is a transitional state which eventually transitions to its final state of Stopped.   "statuses": [       {         "code":   "ProvisioningState/updating",         "level":   "Info",           "displayStatus": "Updating"       },       {         "code":   "PowerState/stopping",         "level":   "Info",           "displayStatus": "VM stopping"       }     ]     |    Billed (Hardware + Software)    |
|    Stopped    |    State occurs when a VM has been shut   down from the guest OS then the VM transitions to the stopped state.    An important distinction to   note is that VM is only stopped on the host but not removed as compared to   deallocate and is still billed.    "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time":   "time"       },       {         "code":   "PowerState/stopped",         "level":   "Info",           "displayStatus": "VM stopped"       }     ]    |    Billed (Hardware only)    |
|    Deallocating    |    when the user stops the VM using client APIs VM transitions   to deallocating transitional state.   "statuses": [       {         "code":   "ProvisioningState/updating",         "level":   "Info",           "displayStatus": "Updating"       },       {         "code":   "PowerState/deallocating",         "level":   "Info",           "displayStatus": "VM deallocating"       }     ]    |    Billed (Hardware only)    |
|    Deallocated    |    VM is stopped and removed/deallocated from the host. VM in the deallocated state are not billed, but other   resources like network and storage are billed.   "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time":   "time"       },       {         "code":   "PowerState/deallocated",         "level":   "Info",           "displayStatus": "VM deallocated"       }     ]    |    Not billed     | 

A VM can error out due to a variety of reasons, e.g., infrastructure,
platform, etc. Some of these failures are self-recovered and occur due
to loss of communication. Please refer to the following [Virtual
Machines Error
Messages](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/error-messages)
in cases where VM has not recovered.

**Provisioning

These states reflect statuses of User-initiated (control plane)
operations on the VM. These states are independent of the running state
of a VM, which are exposed as Power states and discussed later in this
document.

**User Initiated actions **

1.  **Create** – Create a VM

2.  **Update** – Update model for an existing VM. Some non-model changes
    to VM such as start/Restart also fall under update.

3.  **Delete** – Delete a VM

4.  **Deallocate** – Deallocating a VM is a power state. Internal effect
    of deallocating a VM results into Update of the VM hence resulting
    into provisioning states related to updating.

**Operation states** – Transitional states after the platform has
accepted the request for user action.
|    State    |    Description    |    Billing    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
|    Starting    |    VM is starting up.    "statuses": [       {         "code":   "ProvisioningState/creating",         "level":   "Info",           "displayStatus": "Creating"       },       {         "code":   "PowerState/starting",         "level":   "Info",           "displayStatus": "VM starting"       }     ]    |    Not Billed    |
|    Running    |    Running state for a VM   "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time": “time”       },       {         "code":   "PowerState/running",         "level":   "Info",           "displayStatus": "VM running"       }     ]    |    Billed (Hardware + Software)     |
|    Stopping    |    Status of the VM when a VM is either   stopped from client or guest OS. Stopping   status is a transitional state which eventually transitions to its final state of Stopped.   "statuses": [       {         "code":   "ProvisioningState/updating",         "level":   "Info",           "displayStatus": "Updating"       },       {         "code":   "PowerState/stopping",         "level":   "Info",           "displayStatus": "VM stopping"       }     ]     |    Billed (Hardware + Software)    |
|    Stopped    |    State occurs when a VM has been shut   down from the guest OS then the VM transitions to the stopped state.    An important distinction to   note is that VM is only stopped on the host but not removed as compared to   deallocate and is still billed.    "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time":   "time"       },       {         "code":   "PowerState/stopped",         "level":   "Info",           "displayStatus": "VM stopped"       }     ]    |    Billed (Hardware only)    |
|    Deallocating    |    when the user stops the VM using client APIs VM transitions   to deallocating transitional state.   "statuses": [       {         "code":   "ProvisioningState/updating",         "level":   "Info",           "displayStatus": "Updating"       },       {         "code":   "PowerState/deallocating",         "level":   "Info",           "displayStatus": "VM deallocating"       }     ]    |    Billed (Hardware only)    |
|    Deallocated    |    VM is stopped and removed/deallocated from the host. VM in the deallocated state are not billed, but other   resources like network and storage are billed.   "statuses": [       {         "code":   "ProvisioningState/succeeded",         "level":   "Info",           "displayStatus": "Provisioning succeeded",         "time":   "time"       },       {         "code":   "PowerState/deallocated",         "level":   "Info",           "displayStatus": "VM deallocated"       }     ]    |    Not billed     |

**Success**– This state represents that user-initiated actions have
completed.

> "statuses": \[
>
> {
>
> "code": "ProvisioningState/succeeded",
>
> "level": "Info",
>
> "displayStatus": "Provisioning succeeded",
>
> "time": "time"
>
> }
>
> \]

**Failed** – This state represents something has went wrong with the
operation. Refer to the error codes to get more information and possible
resolution.

> "statuses": \[
>
> {
>
> "code": "ProvisioningState/failed",
>
> "level": "Info",
>
> "displayStatus": "Provisioning failed",
>
> "time": "time"
>
> }
>
> \]

**Edge cases**: In cases where a VM was running and in a good state, a
failed management operation will typically leave the VM running with the
original VM model (configuration). If such a case happens then, the
effective running VM model may be different from the latest received and
persisted by CRP which is reported back if by GetVM API. To resolve this
issue, please look at the error message (either from the last failed
operation of the VM instance view). If the error is due to API input
validation then try to fix the inputs but if the error is due to Azure
internal errors a retry of the management operation should resolve the
issue.
