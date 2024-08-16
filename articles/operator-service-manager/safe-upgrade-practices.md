---
title: Safe Upgrade Practices for CNFs
description: Safely excecute compelx upgrades of CNF workloads with Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 08/16/2024
ms.topic: safe-upgrades
ms.service: azure-operator-service-manager
---

# Safe Upgrade Practices for CNFs

Upgrading Nexus CNF Workload Software Using Azure Operator Service Manage

# What Are Safe Upgrade Practices 

A given network service supported by Azure Operator Service Manager will be composed of one-to-many container-based network functions (CNFs) which, over time, will require frequent software updates.  For each CNF update, it is necessary to run one-to-many helm operations, upgrading dependent network function applications (NfApps), in a particular order, in a manner which least impacts the network service.  At Azure Operator Service Manager, “Safe Upgrade Practices” represents a set of features which can automate the CNF operations required to update a network service on Azure Operator Nexus.
  
![iFigre 1 - Overview](media/sup1.png)

# Safe Upgrade Practices Overview

To update an existing Azure Operator Service Manager site network service (SNS), the Operator will execute a “Re-Put update” request against the deployed SNS resource.  Where a SNS contains CNFs with multiple NfApps, this request will fan out execution of helm upgrades across any NfApps defined in the NFDV, by default in the order which they appear, or optionally in the order defined by UpdateDependsOn parameter.  
For each NfApp, the “Re-Put update” request supports increasing a helm chart version, adding/removing helm values and/or adding/removing any NfApps.  Timeouts can be set per NfApp, based on known allowable runtimes, but NfApps can only be processed in serial order, one after the other.  When processing each NfApp, the “Re-Put update” applies the following logic:

* For an NFApp which has applicationEnablement set to false, skip.
* For an NFApp which is common between old and new NFDV, trigger upgrade component.
* For an NFApp which is added in new NFDV, trigger create component.

To ensure outcomes, NfApp testing is supported using helm, either helm upgrade pre/post tests, or standalone helm tests.  For pre/post tests failures, the atomic parameter will be honored.  With atomic/true, the failed chart will be rolled back.  With atomic/false, no rollback will be executed. For standalone helm tests, the rollbackOnTestFailure parameter will be honored. With rollbackOnTestFailure/true, the failed chart will be rolled back.  With rollbackOnTestFailure/false, no rollback will be executed.  

# Safe Upgrade Practices - Prerequisites for CNF
When planning for an upgrade using Azure Operator Service Manager, address the following requirements in advance of upgrade execution to optimize the time spent attempting the upgrade.

![iFigre 2 - Prerequisites](media/sup2.png)

- Onboard updated artifacts using publisher and/or designer workflows.
  - Publisher, store, NSDG and NFDG are static and do not need to change.  
    - A new artifact manifest is needed to store the new charts and images. Please see onboarding documentation for further details on uploading new charts and images.
  - New NFDV and NSDV are needed, under existing NFDG and NSDG.
    - We cover basic changes to the NFDV in the step-by-step section.
    - New NSDV is only required if a new CGS version is being introduced.
  - If required, new CGS.
    - Required if an upgrade introduces new exposed configuration parameters. 

- Create updated artifacts using Operator workflow.
  - If required, create new CGVs based on new CGS.
  - Confirm the existing site and site network service objects to re-use and craft payload.

- Update templates to ensure that upgrade parameters are set based on confidence in the upgrade and desired failure behavior.
  - Settings used for production may suppress failures details, while settings used for debugging, or testing, may choose to expose these details.

## Safe Upgrade Practices - Step-by-Step Upgrade Procedure
Follow the below process to trigger an upgrade with Azure Operator Service Manager.

### Create new NFDV template with higher version.

When selecting a new NFDV version, it must be a valid SemVer format, where only incrementing values of patch and minor versions updates are allowed.  A lower NFDV version is not allowed.  Given a CNF deployed using NFDV 2.0.0, the new NFDV can be of version 2.0.1, or 2.1.0, but not 1.0.0, or 3.0.0.   Future guidance will be provided, when available, to address major upgrades.

### Update new NFDV Helm parameters to desired target version.

Helm chart versions can be updated, or Helm values can be updated or parameterized as necessary.  New NfApps can also be added where they did not exist in deployed version.

### Update NFDV for desired NfApp order using UpdateDependsOn

UpdateDependsOn is a NFDV parameter used to specify ordering of NfApps during update operations. If UpdateDependsOn is not provided, serial ordering of NF applications, as appearing in the NFDV, will be used. See below dependsOnProfile example.

![iFigre 3 - UpdateDependsOn](media/sup3.png)

### Update NFDV roleOverrideValues for desired upgrade behavior.

Make sure to set any desired NF application timeouts, as well as the atomic and rollbackOnTestFailure parameters.  It may be useful to change these parameters over time as more confidence is gained in the upgrade.

![iFigre 4 - roleOverrides](media/sup4.png)

### Issue SNS Re-Put

With onboarding complete, the Re-Put operation is submitted by an AOSM operator role using standard Azure interfaces. Depending on the number, size and complexity of the NfApps, the Re-Put operation could take some time to complete (multiple hours).

![iFigre 5 - SNS Re-put](media/sup5.png)

### Examine Re-Put Results

If the Re-Put is reporting a successful result, the upgrade has been completed and the user should validate the state and availability of the service.   If the Re-Put is reporting a failure, follow the steps in the upgrade failure recovery section to continue.

##  Safe Upgrade Practices  - Step-by-Step Retry Procedure

In cases where a reput update has failed, the following process can be followed to retry the operation.

### In case of failure, diagnose failed NfApp.

Gather logs and other debugging information and take necessary action to resolve the root cause for NfApp failure.

### Manually skip completed charts using applicationEnablement parameter.

After fixing the failed NfApp, but before attempting an upgrade retry, consider changing the applicationEnablement parameter to accelerate retry behavior.  This parameter can be set false where an NfApp should be skipped, perhaps where it’s already been upgraded, or perhaps where no change is otherwise required.  See the appendix for more information on manipulating the applicationEnablement flag.

### Issue SNS Re-Put retry (repeat until success)

By default, the Re-Put will retry NfApps in the declared update order, even if they had been successfully upgraded during a previous attempt, or even if they are not changing versions, unless they are skipped using applicationEnablement flag.

# Safe Upgrade Practices - Next Steps

Azure Operator Service Manager will continue to grow the Safe Upgrade Practice feature set and drive improvements into offered update services.   As new features are introduced, where they may change default behavior, this guide will be updated to reflect such changes.  The following features are presently under consideration for future availability:
* Improve Upgrade Options Control - Expose parameters more effectively.
* Skip NfApp on No Change - Skip processing of NfApps where no changes will result.
* NF Rollback-On-Failure - Based on flag, rollback all completed NfApps on failure.
* Asynchronous Operations - Ability to run multiple NfApp operations at a time.
* Image Prefetch - Ability to preload images to edge repository.
* Targeted Chart Validation - Ability to run a helm test only on a specific NfApp.

# Appendix A - Using applicationEnablement

In the NFDV resource, under deployParametersMappingRuleProfile there is the property applicationEnablement of type enum which take values: “Unknown”, “Enabled”, or “Disabled.” It can be used to exclude NfApp operations during NF deployment.

Publisher.  For the applicationEnablement property, the publisher has two options: either provide a default value or parameterize it. In the below example below, applicationEnablement is parameterized for the NfApp “testroletwo” so that its value must be provided by the operator at run-time.

![iFigre 6 - applicationEnablement Publisher](media/sup6.png)

Operator.  Operators specify applicationEnablement as defined by the NFDV. If applicationEnablement for specific application is parameterized, then it must be passed through the deploymentValues property at run-time. The below example shows deploymentValues "enableRoleTwoDeployment" property set. Also show is how Operators can override any applicationEnablement value using the roleOverrideValues property.

![iFigre 7 - applicationEnablement Operator](media/sup7.png)

# Appendix B - Support for In-Service upgrades (ISSU)

Azure Operator Service Manager, where possible, supports in-service upgrades, an upgrade method which advances a deployment version without interrupting the service.  However, the ability for a given service to be upgraded without interruption is a feature of the service itself.  Please consult further with the service publisher to understand the in-service upgrade capabilities.
