#Azure Virtual Machine states and lifecycle
Understand different VM states which makes up a Virtual Machine (VM)
lifecycle. VMs can be in one of the two distinct state machines called
provisioning and power states. Understanding these states will help
build a great customer experience for your applications.

##Power State

The Power states represent VM’s running state as seen by hypervisor.

![VM power state diagram](azure-docs-pr/articles/virtual-machines/media/Virtual-Machines-States/VM-Power-States.png)

Figure 1: VM power state diagram

  |-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
  |**State**          |**Description**                                                                                                                                       | **Billing**                        |
  |------------------ |------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
  | **Starting**      |When a VM is starting up.                                                                                                                             | **Not Billed**                     |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/creating",                                                                                                                 |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Creating"                                                                                                                           |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/starting",                                                                                                                        |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM starting"                                                                                                                        |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
 =|===================|======================================================================================================================================================|====================================|
  |**Running**        |Running state for a VM                                                                                                                                | **Billed (Hardware + Software)**   |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/succeeded",                                                                                                                |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Provisioning succeeded",                                                                                                            |                                    |
  |                   |"time": “time”                                                                                                                                        |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/running",                                                                                                                         |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM running"                                                                                                                         |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
=|==========================================================================================================================================================================|====================================|=
  |**Stopping**       |When a VM is either stopped from client or guest OS or deallocated. This is a transitional state which eventually transitions to it final state.      |**Billed (Hardware + Software)**    |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/updating",                                                                                                                 |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Updating"                                                                                                                           |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/stopping",                                                                                                                        |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM stopping"                                                                                                                        |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
=|==========================================================================================================================================================================|====================================|
  |**Stopped**        |When a VM is shut down from the guest OS then the VM transitions to stopped state.                                                                    |**Billed (Hardware + Software)**    |
  |                   |Important distinction to note is that VM is only stopped on the host but not removed as compared to deallocate and is still billed.                   |                                    |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/succeeded",                                                                                                                |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Provisioning succeeded",                                                                                                            |                                    |
  |                   |"time": "time"                                                                                                                                        |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/stopped",                                                                                                                         |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM stopped"                                                                                                                         |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
=|===================|======================================================================================================================================================|====================================|
  |**Deallocating**   |when user stop the VM using client APIs VM transitions to deallocating transitional state.                                                            | **Billed (Software only)**         |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/updating",                                                                                                                 |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Updating"                                                                                                                           |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/deallocating",                                                                                                                    |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM deallocating"                                                                                                                    |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
=|===================|======================================================================================================================================================|====================================|=
  |**Deallocated**    |VM is stopped and removed/deallocated from the host. VM in deallocated state are not billed but other resources like network and storage are billed.  | **Not billed **                    |
  |                   |"statuses": \[                                                                                                                                        |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "ProvisioningState/succeeded",                                                                                                                |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "Provisioning succeeded",                                                                                                            |                                    |
  |                   |"time": "time"                                                                                                                                        |                                    |
  |                   |},                                                                                                                                                    |                                    |
  |                   |{                                                                                                                                                     |                                    |
  |                   |"code": "PowerState/deallocated",                                                                                                                     |                                    |
  |                   |"level": "Info",                                                                                                                                      |                                    |
  |                   |"displayStatus": "VM deallocated"                                                                                                                     |                                    |
  |                   |}                                                                                                                                                     |                                    |
  |                   |\]                                                                                                                                                    |                                    |
  |-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|

A VM can error out due to variety of reasons e.g. infrastructure,
platform, etc. Some of these failures are self-recovered and are caused
due to loss of communication. Please refer to the following [Virtual
Machines Error
Messages](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/error-messages)
in cases where VM has not recovered.

Provisioning
============

These states reflect statuses of User-initiated (control plane)
operations on the VM. These states are independent from the running
state of a VM, which are exposed as Power states and discussed later in
this document.

**User Initiated actions **

1.  **Create** – Create a VM

2.  **Update** – Update model for an existing VM. Some non-model changes
    to VM such as start/Restart also fall under update.

3.  **Delete** – Delete a VM

4.  **Deallocate** – Deallocating a VM is a power state. Internal effect
    of deallocating a VM results into Update of the VM hence resulting
    into provisioning states related to updating.

**Operation states** – Transitional states after the platform has
accepted the request for a user action.

+-----------------------------------+-----------------------------------+
| **Creating**                      | "statuses": \[                    |
|                                   |                                   |
|                                   | {                                 |
|                                   |                                   |
|                                   | "code":                           |
|                                   | "ProvisioningState/creating",     |
|                                   |                                   |
|                                   | "level": "Info",                  |
|                                   |                                   |
|                                   | "displayStatus": "Creating"       |
|                                   |                                   |
|                                   | }                                 |
+===================================+===================================+
| **Updating**                      | "statuses": \[                    |
|                                   |                                   |
|                                   | {                                 |
|                                   |                                   |
|                                   | "code":                           |
|                                   | "ProvisioningState/updating",     |
|                                   |                                   |
|                                   | "level": "Info",                  |
|                                   |                                   |
|                                   | "displayStatus": "Updating"       |
|                                   |                                   |
|                                   | }                                 |
|                                   |                                   |
|                                   | \]                                |
+-----------------------------------+-----------------------------------+
| **Deleting**                      | "statuses": \[                    |
|                                   |                                   |
|                                   | {                                 |
|                                   |                                   |
|                                   | "code":                           |
|                                   | "ProvisioningState/deleting",     |
|                                   |                                   |
|                                   | "level": "Info",                  |
|                                   |                                   |
|                                   | "displayStatus": "Deleting"       |
|                                   |                                   |
|                                   | }                                 |
|                                   |                                   |
|                                   | \]                                |
+-----------------------------------+-----------------------------------+
| **InProgress**                    | Creating or updating or deletion  |
|                                   | status                            |
+-----------------------------------+-----------------------------------+
| **Cancelled**                     | User initiated cancel will result |
|                                   | into this state                   |
+-----------------------------------+-----------------------------------+
| **OS provisioning states**        | If a VM is created with an OS     |
|                                   | image and not with a specialized  |
|                                   | image then following sub-states   |
|                                   | can be observed                   |
|                                   |                                   |
|                                   | 1.  **OSProvisioningInprogress**  |
|                                   |     – The VM is running and       |
|                                   |     installation of guest OS is   |
|                                   |     in progress.\                 |
|                                   |     "statuses": \[                |
|                                   |                                   |
|                                   | > {                               |
|                                   | >                                 |
|                                   | > "code": "ProvisioningState/     |
|                                   | > OSProvisioningInprogress",      |
|                                   | >                                 |
|                                   | > "level": "Info",                |
|                                   | >                                 |
|                                   | > "displayStatus": "OS            |
|                                   | > Provisioning In progress"       |
|                                   | >                                 |
|                                   | > }                               |
|                                   |                                   |
|                                   | \]                                |
|                                   |                                   |
|                                   | 1.  **OSProvisioningComplete** –  |
|                                   |     Short-lived as it quickly     |
|                                   |     transitions to Success state  |
|                                   |     from completion unless VM has |
|                                   |     to install extension,         |
|                                   |     installation of extension     |
|                                   |     take time and thus provides a |
|                                   |     window where this state can   |
|                                   |     be observed before it         |
|                                   |     transitions over to           |
|                                   |     succeeded.\                   |
|                                   |     "statuses": \[                |
|                                   |                                   |
|                                   | > {                               |
|                                   | >                                 |
|                                   | > "code": "ProvisioningState/     |
|                                   | > OSProvisioningComplete",        |
|                                   | >                                 |
|                                   | > "level": "Info",                |
|                                   | >                                 |
|                                   | > "displayStatus": "OS            |
|                                   | > Provisioning Complete"          |
|                                   | >                                 |
|                                   | > }                               |
|                                   |                                   |
|                                   | \]                                |
|                                   |                                   |
|                                   | **Note**: OS Provisioning can     |
|                                   | transition to Failed if OS fails  |
|                                   | or if OS fails to install in      |
|                                   | time. At this time customers will |
|                                   | be billed for the VM as it is     |
|                                   | deployed on the infrastructure.   |
|                                   | In cases where OS take longer     |
|                                   | than expected to complete         |
|                                   | installation the platform will    |
|                                   | automatically transition to       |
|                                   | success from failure. In other    |
|                                   | cases re-starting a VM can        |
|                                   | resolve the issue. If the issue   |
|                                   | is persistent then refer to error |
|                                   | codes documentation for           |
|                                   | resolution.                       |
+-----------------------------------+-----------------------------------+

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

**Edge cases**: In cases where a VM was running and in good state, a
failed management operation will typically leave the VM running with the
original VM model (configuration). If such a case happens then the
effective running VM model may be different from the latest received and
persisted by CRP which is reported back if by GetVM API. To resolve this
issue, please look at the error message (either from the last failed
operation or from the VM instance view). If the error is due to API
input validation then try to fix the inputs but if the error are due to
Azure internal errors a retry of the management operation should resolve
the issue.
