---
title: Compute throttling limits
description: Compute throttling limits
author: viveksingla
ms.service: azure-virtual-machines
ms.topic: conceptual
ms.date: 05/27/2024
ms.author: viveksingla
ms.reviewer: 

---

# Compute throttling limits

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Microsoft Compute implements throttling mechanism to help with the
overall performance of the service and to give a consistent experience
to the customers. API requests that exceed the maximum allowed limits
are throttled and users get an [HTTP 429
error](/troubleshoot/azure/virtual-machines/windows/troubleshooting-throttling-errors#throttling-error-details).
All Compute throttling policies are implemented on a per-region basis.

## How do the throttling policies work?

Microsoft Compute implements throttling policies that limit the
number of API requests made per resource and per subscription per region
per minute. If the number of API requests exceeds these limits, the
requests are throttled. Here's how these limits work:

- **Per Resource Limit** – Each resource, such as a virtual machine
    (VM), has a specific limit for API requests. For instance, let us
    assume that a user creates 10 VMs in a subscription. The user
    can invoke up to 12 update requests for each VM in one minute. If the
    user exceeds the limit for the VM, API requests are throttled.
    This limit ensures that a few resources don’t consume the
    subscription level limits and throttle other resources.

 - **Subscription Limit** – In addition to resource limits, there's
    an overarching limit on the number of API requests across all
    resources within a subscription. Any API requests beyond this limit
    are throttled, regardless of whether the limit for an individual resource has been reached. For instance, let us assume that a user has 200 VMs in a subscription. Even though user is entitled to initiate up to 12
    Update VM requests for each VM, the aggregate limit for Update VM
    API requests is capped at 1500 per min. Any Update VM API requests
    for the subscription exceeding 1500 are throttled.

## How does Microsoft Compute determine throttling limits?

To determine the limits for each resource and subscription, Microsoft
Compute uses **Token Bucket Algorithm.** This algorithm creates buckets
for each limit and holds a specific number of tokens in each bucket. The
number of tokens in a bucket represent the throttling limit at any given
minute.

At the start of throttling window, when the resource is created, the
bucket is filled to its *Maximum Capacity*. Each API request initiated
by the user consumes one token. When the token count depletes to zero,
subsequent API requests are throttled. Bucket is replenished with
new tokens every minute at a consistent rate called *Bucket Refill Rate*
for a resource and a subscription.

For Instance: Let us consider the 'throttling policy for VM Update API'
that stipulates a Bucket Refill Rate of four tokens per minute, and a
Maximum Bucket Capacity of 12 tokens. The user invokes the Update VM
API request for a virtual machine (VM) as per the following table. Initially, the
bucket is filled with 12 tokens at the start of the throttling window.
By the fourth minute, the user utilizes all 12 tokens, leaving the
bucket empty. In the fifth minute, the bucket is replenished with four new
tokens in accordance with the Bucket Refill Rate. So, four API
requests can be made in the fifth minute, while Microsoft Compute throttles one API request due to insufficient tokens.

|(min)|1st|2nd|3rd|4th|5th|6th|
|-------|-----|----|----|----|----|----|
|Number of tokens in the beginning (A)|12|12|8|12|4|4|
|Requests per minute (B)|0|8|0|13|5|0|
|Throttled requests (C)|0|0|0|1|1|0|
|Remaining tokens at the end of period <br> D = Max(A-B, 0)|12|4|8|0|0|4|


Similar process is followed for determining the throttling limits at
subscription level. The following sections detail the Bucket refill rate
and Maximum bucket capacity that is used to determine throttling limits for
[Virtual
Machines](/azure/virtual-machines/overview),
[Virtual Machine Scale
Sets](/azure/virtual-machine-scale-sets/overview)
and [Virtual Machines Scale Set
VMs](/rest/api/compute/virtual-machine-scale-set-vms/deallocate?tabs=HTTP).

## Throttling limits for Virtual Machines 

API requests for Virtual Machines are categorized into seven distinct
policies. Each policy has its own limits, depending upon how
resource intensive the API requests under that policy are. Following table contains a
comprehensive list of these policies, the corresponding REST APIs, and
their respective throttling limits:


|Policy category|REST APIs|Resource Level|Resource Level|Subscription Level|Subscription Level|
|---------------|---------|-------|-------|----------|--------|
|||Bucket refill rate (Per Min)|Maximum Bucket capacity<br>(Per Min)|Bucket refill rate<br>(Per Min)|Maximum Bucket capacity<br>(Per Min)|
|Put VM<br>(Create new VMs)|<a href="/rest/api/compute/virtual-machines/create-or-update?tabs=HTTP">Create</a>|4|12|500|1,500|
|Update VM<br>(Update existing VMs)|<a href="/rest/api/compute/virtual-machines/update">Update</a><br><a href="/rest/api/compute/virtual-machines/reapply?tabs=HTTP">Reapply</a> <a href="/rest/api/compute/virtual-machines/restart?tabs=HTTP">Restart</a><br> <a href="/rest/api/compute/virtual-machines/power-off?tabs=HTTP">Power Off</a><br> <a href="/rest/api/compute/virtual-machines/start?tabs=HTTP">Start</a><br> <a href="/rest/api/compute/virtual-machines/generalize?tabs=HTTP">Generalize</a><br> <a href="/rest/api/compute/virtual-machines/convert-to-managed-disks?tabs=HTTP">Convert To Managed Disks</a><br> <a href="/rest/api/compute/virtual-machines/redeploy?tabs=HTTP">Redeploy</a><br> <a href="/rest/api/compute/virtual-machines/perform-maintenance?tabs=HTTP">Perform Maintenance</a><br> <a href="/rest/api/compute/virtual-machines/capture?tabs=HTTP">Capture</a><br> <a href="/rest/api/compute/virtual-machines/run-command?tabs=HTTP">Run Command</a><br> <a href="/rest/api/compute/virtual-machine-extensions/create-or-update?tabs=HTTP">Create Or Update</a><br> <a href="/rest/api/compute/virtual-machine-extensions/update?tabs=HTTP">Extensions - Update</a><br> <a href="/rest/api/compute/virtual-machine-extensions/delete?tabs=HTTP">Extensions - Delete</a><br> <a href="/rest/api/compute/virtual-machines/reimage?tabs=HTTP">Reimage</a><br> <a href="/rest/api/compute/virtual-machines/update?tabs=HTTP">Update</a><br> <a href="/rest/api/compute/virtual-machine-run-commands/update?tabs=HTTP">Run Commands - Update</a><br> <a href="/rest/api/compute/virtual-machine-run-commands/delete?tabs=HTTP">Run Commands - Delete</a><br> <a href="/rest/api/compute/virtual-machine-run-commands/create-or-update?tabs=HTTP">Run Commands - Create Or Update</a><br>|4|12|500|1,500|
|Delete VM<br> (Delete VMs)<br>|<a href="/rest/api/compute/virtual-machines/delete">Delete</a><br> <a href="/rest/api/compute/virtual-machines/simulate-eviction">Simulate Eviction</a><br> <a href="/rest/api/compute/virtual-machines/deallocate?tabs=HTTP">Deallocate</a><br>|4|12|500|1,500| 
|Low Cost Get VM<br> (Get information on single VM)<br>|<a href="/rest/api/compute/virtual-machines/get?tabs=HTTP">Get</a><br> <a href="/rest/api/compute/virtual-machines/instance-view?tabs=HTTP">Instance View</a><br> <a href="/rest/api/compute/virtual-machine-extensions/get?tabs=HTTP">Extensions - Get</a><br> <a href="/rest/api/compute/virtual-machines/list-available-sizes?tabs=HTTP">List Available Sizes</a><br> <a href="/rest/api/compute/virtual-machines/retrieve-boot-diagnostics-data?tabs=HTTP">Retrieve Boot Diagnostics Data</a><br> <a href="/rest/api/compute/virtual-machine-run-commands/get-by-virtual-machine?tabs=HTTP">Run Commands - Get By Virtual Machine</a><br> <a href="/rest/api/compute/virtual-machine-run-commands/list-by-virtual-machine?tabs=HTTP">Run Commands - List By Virtual Machine</a><br>|12|36|8,000|24,000| 
|High Cost Get VM<sup>1</sup><br> (Get information on multiple VMs)<br>|<a href="/rest/api/compute/virtual-machines/list?tabs=HTTP">List</a><br> <a href="/rest/api/compute/virtual-machines/list-all?tabs=HTTP">List All</a><br> <a href="/rest/api/compute/virtual-machines/list-by-location?tabs=HTTP">List By Location</a><br>|NA|NA|300|900| 
|Get Operation<br> (Get information on async VM operations)<br>|<a href="/azure/azure-resource-manager/management/async-operations#start-virtual-machine-202-with-azure-asyncoperation">Status of asynchronous operations</a>|15|45|5,000|15,000| 
|VM Guest Patch Operations<br> (Assess & install guest patches)<br>|<a href="/rest/api/compute/virtual-machines/assess-patches?tabs=HTTP">Assess Patches</a><br> <a href="/rest/api/compute/virtual-machines/install-patches?tabs=HTTP">Install Patches</a><br>|2|6|200|600|

<sup>1</sup> Only subscription level policies are applicable.

## Throttling limits for Virtual Machine Scale Sets

API requests for Virtual Machine Scale Set(Uniform & Flex) are categorized into 5
distinct policies. Each policy has its own limits, depending upon how resource intensive the API requests under that policy are. These
policies are applicable to both Flex and Uniform orchestration modes.
Following table contains a comprehensive list of these policies, the corresponding REST
APIs, and their respective throttling limits:

|Policy category |REST APIs |Resource Level |Resource Level |Subscription Level |Subscription Level | 
|-----|---------|--------|--------|---------|---------|
|||Bucket refill rate<br> (Per Min)<br>|Maximum Bucket capacity<br> (Per Min)<br>|Bucket refill rate (Per Min)|Maximum Bucket capacity<br> (Per Min)<br>|   
|Put<br> (Create new scale set)<br>|<a href="/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP">Create</a>|4|12|125|375| 
|Update<br> (Update existing scaleset)<br>|<a href="/rest/api/compute/virtual-machine-scale-sets/update?tabs=HTTP">Update</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/start?tabs=HTTP">Start</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/restart?tabs=HTTP">Restart</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/redeploy?tabs=HTTP">Redeploy</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/perform-maintenance?tabs=HTTP">Perform Maintenance</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/reimage?tabs=HTTP">Reimage</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/reimage-all?tabs=HTTP">Reimage All</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP">Create Or Update</a><br> <a href="/rest/api/compute/virtual-machine-scale-set-rolling-upgrades/cancel?tabs=HTTP">Rolling Upgrades - Cancel</a><br> <a href="/rest/api/compute/virtual-machine-scale-set-extensions/create-or-update?tabs=HTTP">Extensions - Create</a><br> <a href="/rest/api/compute/virtual-machine-scale-set-extensions/update?tabs=HTTP">Extensions - Update</a><br> <a href="/rest/api/compute/virtual-machine-scale-set-extensions/delete?tabs=HTTP">Extensions - Delete</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/force-recovery-service-fabric-platform-update-domain-walk?tabs=HTTP">Force Recovery Service Fabric Platform Update Domain Walk</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/convert-to-single-placement-group?tabs=HTTP">Convert To Single Placement Group</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/set-orchestration-service-state?tabs=HTTP">Set Orchestration Service State</a><br>|4|12|500|1,500| 
|Delete<br> (Delete scale set)<br>|<a href="/rest/api/compute/virtual-machine-scale-sets/delete?tabs=HTTP">Delete</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/power-off?tabs=HTTP">Power Off</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/deallocate?tabs=HTTP">Deallocate</a><br>|4|12|175|525| 
|Low Cost Get<br> (Get information on single scale set)<br>|<a href="/rest/api/compute/virtual-machine-scale-sets/get?tabs=HTTP">Get</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/list-skus?tabs=HTTP">List Skus</a><br> <a href="/rest/api/compute/virtual-machine-scale-set-rolling-upgrades/get-latest?tabs=HTTP">Rolling Upgrades - Get Latest</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/get-os-upgrade-history?tabs=HTTP">Get OS Upgrade History</a><br>|12|36|800|2,400| 
|High Cost Get<br> (Get resource intensive information)<br>|<a href="/rest/api/compute/virtual-machine-scale-sets/get-instance-view?tabs=HTTP">Get Instance View</a><br> <a href="/rest/api/compute/virtual-machine-scale-sets/list?tabs=HTTP"><u>List</u></a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/list-all?tabs=HTTP">List All</a><sup>2</sup><br> <a href="/rest/api/compute/virtual-machine-scale-sets/list-by-location?tabs=HTTP">List By Location</a><sup>2</sup><br>|10|30|360|1,080| 
 
<sup>2</sup> Only subscription level policies are applicable.

## Throttling limits for Virtual Machine Scale Set Virtual Machines 

API requests for Virtual Machine Scale Set Virtual Machines are categorized into 3 distinct
policies. Each policy has its own limits, depending upon how
resource intensive the API requests under that policy are. Following table contains a
comprehensive list of these policies, the corresponding REST APIs, and
their respective throttling limits:

|Policy category |REST APIs |Resource Level |Resource Level |Subscription Level |Subscription Level |
|-|-|-|-|-|-|
|||Bucket refill rate<br>(Per Min)<br>|Maximum Bucket capacity<br>(Per Min)<br>|Bucket refill rate<br>(Per Min)<br>|Maximum Bucket capacity<br>(Per Min)<br>|
|Update scale set VMs<br>(Update existing VMs in a scale set)<br>|<a href="/rest/api/compute/virtual-machine-scale-set-vms/start?tabs=HTTP">Start</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/restart?tabs=HTTP">Restart</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/reimage?tabs=HTTP">Reimage</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/reimage-all?tabs=HTTP">ReimageAll</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/update?tabs=HTTP">Update</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/simulate-eviction?tabs=HTTP">SimulateEviction</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/create-or-update?tabs=HTTP">Extensions- Create Or Update</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/create-or-update?tabs=HTTP">RunCommands - Create Or Update</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/update?tabs=HTTP">RunCommands - Update</a><br>|4|12|500|1,500|
|Delete scale set VMs<br>(Delete scale set VMs)<br>|<a href="/rest/api/compute/virtual-machine-scale-set-vms/delete?tabs=HTTP">Delete</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/power-off?tabs=HTTP">PowerOff</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/deallocate?tabs=HTTP">Deallocate</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/delete?tabs=HTTP">Extensions- Delete</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/delete?tabs=HTTP">RunCommands - Delete</a><br>|4|12|500|1,500|
|Get scale set VMs<br>(Get information on scale set VMs)<br>|<a href="/rest/api/compute/virtual-machine-scale-set-vms/get?tabs=HTTP">Get</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/get-instance-view?tabs=HTTP">GetInstance View</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/get?tabs=HTTP">Extensions- Get</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/get?tabs=HTTP">RunCommands - Get</a><br><a href="/rest/api/compute/virtual-machine-scale-set-vms/retrieve-boot-diagnostics-data?tabs=HTTP">RetrieveBoot Diagnostics Data</a><br>|12|36|2,000|6,000|

## Troubleshooting guidelines 

In case users are still facing challenges due to Compute throttling,
refer to [Troubleshooting throttling errors in Azure - Virtual
Machines](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors#best-practices).
It has details on how to troubleshoot throttling issues, and best
practices to avoid being throttled.

## FAQs

### Is there any action required from users?
Users don’t need to change anything in their configuration or workloads. All existing APIs continue to work as is.

### What benefits do the throttling policies provide?
The throttling policies offer several benefits:

 - All Compute resources have a uniform window of 1 min. Users
    can successfully invoke API calls, 1 min after getting
    throttled.

 - No single resource can use up all the limits under a subscription as
    limits are defined at resource level.

 - Microsoft Compute is introducing a new algorithm, Token Bucket Algorithm, for determining the limits. The algorithm provides extra buffer to the customers, while making high number of API requests.

### Does the customer get an alert when they're about to reach their throttling limits?
As part of every response, Microsoft Compute returns
**x-ms-ratelimit-remaining-resource** which can be used to determine the
throttling limits against the policies. A list of applicable throttling
policies is returned as a response to [Call rate informational
headers](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors).
