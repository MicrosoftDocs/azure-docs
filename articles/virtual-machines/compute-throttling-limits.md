---
title: Compute Throttling Limits
description: Compute Throttling Limits
author: viveksingla
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 05/27/2024
ms.author: viveksingla
ms.reviewer: 

---

# Compute Throttling Limits

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

1.  **Per Resource Limit** – Each resource, such as a virtual machine
    (VM), has a specific limit for API requests. For instance, let us
    assume that a user creates 10 VMs in a subscription. The user
    can invoke up to 12 update requests for each VM in one minute. If the
    user exceeds the limit for the VM, API requests are throttled.
    This limit ensures that a few resources don’t consume the
    subscription level limits and throttle other resources.

2.  **Subscription Limit** – In addition to resource limits, there's
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
requests can be made in the fifth minute, while Microsoft Compute will throttle one API request due to insufficient tokens.

<table>
<colgroup>
<col style="width: 43%" />
<col style="width: 8%" />
<col style="width: 9%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 12%" />
</colgroup>
<thead>
<tr class="header">
<th>(min)</th>
<th>1<sup>st</sup></th>
<th>2<sup>nd</sup></th>
<th>3<sup>rd</sup></th>
<th>4<sup>th</sup></th>
<th>5<sup>th</sup></th>
<th>6<sup>th</sup></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Number of tokens in the beginning (A)</td>
<td>12</td>
<td>12</td>
<td>8</td>
<td>12</td>
<td>4</td>
<td>4</td>
</tr>
<tr class="even">
<td>Requests per minute (B)</td>
<td>0</td>
<td>8</td>
<td>0</td>
<td>13</td>
<td>5</td>
<td>0</td>
</tr>
<tr class="odd">
<td>Throttled requests (C)</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr class="even">
<td><p>Remaining tokens at the end of period</p>
<p>D = Max(A-B,0)</p></td>
<td>12</td>
<td>4</td>
<td>8</td>
<td>0</td>
<td>0</td>
<td>4</td>
</tr>
</tbody>
</table>

Similar process is followed for determining the throttling limits at
subscription level. The following sections detail the Bucket refill rate
and Maximum bucket capacity that is used to determine throttling limits for
[Virtual
Machines](/azure/virtual-machines/overview),
[Virtual Machine Scale
Sets](/azure/virtual-machine-scale-sets/overview)
and [Virtual Machines Scale Set
VMs](/rest/api/compute/virtual-machine-scale-set-vms/deallocate?tabs=HTTP).

## Throttling limits for Virtual machines 

API requests for Virtual Machines are categorized into seven distinct
policies. Each policy has its own limits, depending upon the how
resource intensive the API requests under that policy are. Following table contains a
comprehensive list of these policies, the corresponding REST APIs, and
their respective throttling limits:

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 27%" />
<col style="width: 11%" />
<col style="width: 14%" />
<col style="width: 12%" />
<col style="width: 16%" />
</colgroup>
<thead>
<tr class="header">
<th>Policy category</th>
<th>REST APIs</th>
<th colspan="2">Resource Level</th>
<th colspan="2">Subscription Level</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td></td>
<td></td>
<td>Bucket refill rate (per min)</td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
<td>Bucket refill rate<br>
(per min)<br></td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
</tr>
<tr class="even">
<td>Put VM<br>
(Create new VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/create-or-update?tabs=HTTP">Create</a></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="odd">
<td>Update VM<br>
(Update existing VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/update">Update</a><br>
<a
href="/rest/api/compute/virtual-machines/reapply?tabs=HTTP">Reapply</a>
<a
href="/rest/api/compute/virtual-machines/restart?tabs=HTTP">Restart</a><br>
<a
href="/rest/api/compute/virtual-machines/power-off?tabs=HTTP">Power
Off</a><br>
<a
href="/rest/api/compute/virtual-machines/start?view=rest-compute-2024-03-01&amp;tabs=HTTP">Start</a><br>
<a
href="/rest/api/compute/virtual-machines/generalize?tabs=HTTP">Generalize</a><br>
<a
href="/rest/api/compute/virtual-machines/convert-to-managed-disks?tabs=HTTP">Convert
To Managed Disks</a><br>
<a
href="/rest/api/compute/virtual-machines/redeploy?tabs=HTTP">Redeploy</a><br>
<a
href="/rest/api/compute/virtual-machines/perform-maintenance?tabs=HTTP">Perform
Maintenance</a><br>
<a
href="/rest/api/compute/virtual-machines/capture?tabs=HTTP">Capture</a><br>
<a
href="/rest/api/compute/virtual-machines/run-command?tabs=HTTP">Run
Command</a><br>
<a
href="/rest/api/compute/virtual-machine-extensions/create-or-update?tabs=HTTP">Create
Or Update</a><br>
<a
href="/rest/api/compute/virtual-machine-extensions/update?tabs=HTTP">Extensions
- Update</a><br>
<a
href="/rest/api/compute/virtual-machine-extensions/delete?tabs=HTTP">Extensions
- Delete</a><br>
<a
href="/rest/api/compute/virtual-machines/reimage?tabs=HTTP">Reimage</a><br>
<a
href="/rest/api/compute/virtual-machines/update?tabs=HTTP">Update</a><br>
<a
href="/rest/api/compute/virtual-machine-run-commands/update?view=rest-compute-2024-03-01&amp;tabs=HTTP">Run
Commands - Update</a><br>
<a
href="/rest/api/compute/virtual-machine-run-commands/delete?view=rest-compute-2024-03-01&amp;tabs=HTTP">Run
Commands - Delete</a><br>
<a
href="/rest/api/compute/virtual-machine-run-commands/create-or-update?view=rest-compute-2024-03-01&amp;tabs=HTTP">Run
Commands - Create Or Update</a><br></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="even">
<td>Delete VM<br>
(Delete VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/delete">Delete</a><br>
<a
href="/rest/api/compute/virtual-machines/simulate-eviction">Simulate
Eviction</a><br>
<a
href="/rest/api/compute/virtual-machines/deallocate?tabs=HTTP">Deallocate</a><br></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="odd">
<td>Low Cost Get VM<br>
(Get information on single VM)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/get?tabs=HTTP">Get</a><br>
<a
href="/rest/api/compute/virtual-machines/instance-view?tabs=HTTP">Instance
View</a><br>
<a
href="/rest/api/compute/virtual-machine-extensions/get?tabs=HTTP">Extensions
- Get</a><br>
<a
href="/rest/api/compute/virtual-machines/list-available-sizes?tabs=HTTP">List
Available Sizes</a><br>
<a
href="/rest/api/compute/virtual-machines/retrieve-boot-diagnostics-data?tabs=HTTP">Retrieve
Boot Diagnostics Data</a><br>
<a
href="/rest/api/compute/virtual-machine-run-commands/get-by-virtual-machine?view=rest-compute-2024-03-01&amp;tabs=HTTP">Run
Commands - Get By Virtual Machine</a><br>
<a
href="/rest/api/compute/virtual-machine-run-commands/list-by-virtual-machine?view=rest-compute-2024-03-01&amp;tabs=HTTP">Run
Commands - List By Virtual Machine</a><br></td>
<td>12</td>
<td>36</td>
<td>8,000</td>
<td>24,000</td>
</tr>
<tr class="even">
<td>High Cost Get VM<sup>1</sup><br>
(Get information on multiple VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/list?tabs=HTTP">List</a><br>
<a
href="/rest/api/compute/virtual-machines/list-all?tabs=HTTP">List
All</a><br>
<a
href="/rest/api/compute/virtual-machines/list-by-location?tabs=HTTP">List
By Location</a><br></td>
<td>NA</td>
<td>NA</td>
<td>300</td>
<td>900</td>
</tr>
<tr class="odd">
<td>Get Operation<br>
(Get information on async VM operations)<br></td>
<td><a
href="/azure/azure-resource-manager/management/async-operations#start-virtual-machine-202-with-azure-asyncoperation">Status
of asynchronous operations</a></td>
<td>15</td>
<td>45</td>
<td>5,000</td>
<td>15,000</td>
</tr>
<tr class="even">
<td>VM Guest Patch Operations<br>
(Assess &amp; install guest patches)<br></td>
<td><a
href="/rest/api/compute/virtual-machines/assess-patches?view=rest-compute-2024-03-01&amp;tabs=HTTP">Assess
Patches</a><br>
<a
href="/rest/api/compute/virtual-machines/install-patches?view=rest-compute-2024-03-01&amp;tabs=HTTP">Install
Patches</a><br></td>
<td>2</td>
<td>6</td>
<td>200</td>
<td>600</td>
</tr>
</tbody>
</table>

<sup>1</sup>Only subscription level policies are applicable to the Rest
API.

## Throttling limits for Virtual Machine Scale Sets

API requests for Virtual Machine Scale Set(Uniform & Flex) are categorized into 5
distinct policies. Each policy has its own limits, depending upon how resource intensive the API requests under that policy are. These
policies are applicable to both Flex and Uniform orchestration modes.
Following table contains a comprehensive list of these policies, the corresponding REST
APIs, and their respective throttling limits:

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 28%" />
<col style="width: 11%" />
<col style="width: 14%" />
<col style="width: 11%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th>Policy category</th>
<th>REST APIs</th>
<th colspan="2">Resource Level</th>
<th colspan="2">Subscription Level</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td></td>
<td></td>
<td>Bucket refill rate<br>
(per min)<br></td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
<td>Bucket refill rate (per min)</td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
</tr>
<tr class="even">
<td>Put VMSS<br>
(Create new scale set)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP">Create</a></td>
<td>4</td>
<td>12</td>
<td>125</td>
<td>375</td>
</tr>
<tr class="odd">
<td>Update VMSS<br>
(Update existing scaleset)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-sets/update?tabs=HTTP">Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/start?tabs=HTTP">Start</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/restart?tabs=HTTP">Restart</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/redeploy?tabs=HTTP">Redeploy</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/perform-maintenance?tabs=HTTP">Perform
Maintenance</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/reimage?tabs=HTTP">Reimage</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/reimage-all?tabs=HTTP">Reimage
All</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/create-or-update?tabs=HTTP">Create
Or Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-rolling-upgrades/cancel?tabs=HTTP">Rolling
Upgrades - Cancel</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-extensions/create-or-update?tabs=HTTP">Extensions
- Create</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-extensions/update?tabs=HTTP">Extensions
- Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-extensions/delete?tabs=HTTP">Extensions
- Delete</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/force-recovery-service-fabric-platform-update-domain-walk?tabs=HTTP">Force
Recovery Service Fabric Platform Update Domain Walk</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/convert-to-single-placement-group?tabs=HTTP">Convert
To Single Placement Group</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/set-orchestration-service-state?tabs=HTTP">Set
Orchestration Service State</a><br></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="even">
<td>Delete VMSS<br>
(Delete scale set)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-sets/delete?tabs=HTTP">Delete</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/power-off?tabs=HTTP">Power
Off</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/deallocate?tabs=HTTP">Deallocate</a><br></td>
<td>4</td>
<td>12</td>
<td>175</td>
<td>525</td>
</tr>
<tr class="odd">
<td>Low Cost Get VMSS<br>
(Get information on single scale set)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-sets/get?tabs=HTTP">Get</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/list-skus?tabs=HTTP">List
Skus</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-rolling-upgrades/get-latest?tabs=HTTP">Rolling
Upgrades - Get Latest</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/get-os-upgrade-history?tabs=HTTP">Get
OS Upgrade History</a><br></td>
<td>12</td>
<td>36</td>
<td>800</td>
<td>2,400</td>
</tr>
<tr class="even">
<td>High Cost Get VMSS<br>
(Get resource intensive information)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-sets/get-instance-view?tabs=HTTP">Get
Instance View</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/list?tabs=HTTP"><u>List</u></a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/list-all?tabs=HTTP">List
All</a><sup>2</sup><br>
<a
href="/rest/api/compute/virtual-machine-scale-sets/list-by-location?tabs=HTTP">List
By Location</a><sup>2</sup><br></td>
<td>10</td>
<td>30</td>
<td>360</td>
<td>1,080</td>
</tr>
</tbody>
</table>

<sup>2</sup>Only subscription level policies are applicable to the Rest
API.

## Throttling limits for Virtual Machine Scale Set Virtual Machines 

API requests for Virtual Machine Scale Set Virtual Machines are categorized into 3 distinct
policies. Each policy has its own limits, depending upon the how
resource intensive the API requests under that policy are. Following table contains a
comprehensive list of these policies, the corresponding REST APIs, and
their respective throttling limits:

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 28%" />
<col style="width: 11%" />
<col style="width: 14%" />
<col style="width: 11%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th>Policy category</th>
<th>REST APIs</th>
<th colspan="2">Resource Level</th>
<th colspan="2">Subscription Level</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td></td>
<td></td>
<td>Bucket refill rate<br>
(per min)<br></td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
<td>Bucket refill rate<br>
(per min)<br></td>
<td>Maximum Bucket capacity<br>
(per min)<br></td>
</tr>
<tr class="even">
<td>Update VMSS VMs<br>
(Update existing VMs in a scale set)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-set-vms/start?tabs=HTTP">Start</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/restart?tabs=HTTP">Restart</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/reimage?tabs=HTTP">Reimage</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/reimage-all?tabs=HTTP">Reimage
All</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/update?tabs=HTTP">Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/simulate-eviction?tabs=HTTP">Simulate
Eviction</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/create-or-update?tabs=HTTP">Extensions
- Create Or Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/create-or-update?tabs=HTTP">Run
Commands - Create Or Update</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/update?tabs=HTTP">Run
Commands - Update</a><br></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="odd">
<td>Delete VMSS VMs<br>
(Delete scale set VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-set-vms/delete?tabs=HTTP">Delete</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/power-off?tabs=HTTP">Power
Off</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/deallocate?tabs=HTTP">Deallocate</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/delete?tabs=HTTP">Extensions
- Delete</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/delete?tabs=HTTP">Run
Commands - Delete</a><br></td>
<td>4</td>
<td>12</td>
<td>500</td>
<td>1,500</td>
</tr>
<tr class="even">
<td>Get VMSS VMs<br>
(Get information on scale set VMs)<br></td>
<td><a
href="/rest/api/compute/virtual-machine-scale-set-vms/get?tabs=HTTP">Get</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/get-instance-view?tabs=HTTP">Get
Instance View</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-extensions/get?tabs=HTTP">Extensions
- Get</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vm-run-commands/get?tabs=HTTP">Run
Commands - Get</a><br>
<a
href="/rest/api/compute/virtual-machine-scale-set-vms/retrieve-boot-diagnostics-data?tabs=HTTP">Retrieve
Boot Diagnostics Data</a><br></td>
<td>12</td>
<td>36</td>
<td>2,000</td>
<td>6,000</td>
</tr>
</tbody>
</table>

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

1.  All Compute resources have a uniform window of 1 min. Users
    can successfully invoke API calls, 1 min after getting
    throttled.

2.  No single resource can use up all the limits under a subscription as
    limits are defined at resource level.

3.  Microsoft Compute is introducing a new algorithm, Token Bucket Algorithm, for determining the limits. The algorithm provides extra buffer to the customers, while making high number of API requests.

### Does the customer get an alert when they're about to reach their throttling limits?
As part of every response, Microsoft Compute returns
**x-ms-ratelimit-remaining-resource** which can be used to determine the
throttling limits against the policies. A list of applicable throttling
policies is returned as a response to [Call rate informational
headers](/troubleshoot/azure/virtual-machines/troubleshooting-throttling-errors).
