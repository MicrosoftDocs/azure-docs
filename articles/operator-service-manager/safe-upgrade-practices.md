---
title: Get started with Azure Operator Service Manager Safe Upgrade Practices 
description: Safely execute complex upgrades of CNF workloads on Azure Operator Nexus
author: msftadam
ms.author: adamdor
ms.date: 02/19/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Get started with safe upgrade practices
This article introduces Azure Operator Service Manager (AOSM) safe upgrade practices (SUP). This feature set enables the safe execution of complex container network function (CNF) hosted on Azure Operator Nexus. These upgrades are structured in general compliance with partner In Service Software Upgrade (ISSU) requirements. Look for future articles to expand on advanced SUP features and capabilities.

## Introduction to safe upgrades
A given network service supported by AOSM is composed of one to many CNFs which, over time, require software upgrades. For each upgrade, it's necessary to run one to many helm operations, updating dependent network function applications (nfApps), in a particular order, in a manner which least impacts the network service. AOSM SUP represents a set of features, which enables safe automation of these operations on Azure Operator Nexus.
  
* SNS Reput Support - Execute helm upgrade operation across all nfApps in network function design version (NFDV).
* Nexus Platform - Support SNS reput operations on Nexus platform targets. 
* Operation Time-outs - Ability to set operational time-outs for each nfApp operation.
* Synchronous Operations - Ability to run one serial nfApp operation at a time.
* Control Upgrade Order - Define different nfApp sequence for install and upgrade.
* Pause On Failure - Default behavior pauses after an nfApp operation failure.
* Rollback On Failure - Optional behavior, rollback completed nfApps before failed nfApp.
* Single Chart Test Validation - Running a helm test operation after a create or update.
* Skip nfApp on No Change - Skip processing of nfApps where no changes result.
* Image Preloading - Ability to preload images to edge repository.
  
## Safe upgrade approach
To update an existing Azure Operator Service Manager site network service (SNS), the Operator executes a reput update request against the deployed SNS resource. Where the SNS contains CNFs with multiple nfApps, the request is fanned out across all nfApps defined in the network function definition version (NFDV). By default, in the order, which they appear, or optionally in the order defined by `updateDependsOn` parameter.

For each nfApp, the reput update request supports increasing a helm chart version, adding/removing helm values and/or adding/removing any nfApps. Time-outs can be set per nfApp, based on known allowable runtimes, but nfApps can only be processed in serial order, one after the other. The reput update implements the following processing logic:

* nfApps are processed following either updateDependsOn ordering, or in the sequential order they appear.
* nfApps with parameter `applicationEnabled` set to disable are skipped.
* nfApps with parameter `skipUpgrade` set to `enabled` are skipped if no changes detected.
* nfApps which are common between old and new NFDV are upgraded.
* nfApps which are only in the new NFDV are installed.
* nfApps deployed, but not referenced by the new NFDV, are deleted.
  
To ensure outcomes, nfApp testing is supported using helm, either helm upgrade pre/post tests, or standalone helm tests. For pre/post tests failures, the atomic parameter is honored. With atomic/true, the failed chart is rolled back. With atomic/false, no rollback is executed. For more information on standalone helm testing, see the following article: [Run tests after install or upgrade](safe-upgrades-helm-test.md)

## Considerations for in-service upgrades
Azure Operator Service Manager generally supports in service upgrades, an upgrade method which advances a deployment version without interrupting the running service. Some considerations are necessary to ensure the proper behavior of AOSM during ISSU operations. 
* Where AOSM performs an upgrade against an ordered set of multiple nfApps, AOSM first upgrades or creates all new nfApps, then deletes all old nfApps. This approach ensures service isn't impacted until all new nfApps are ready but requires extra platform capacity for transient hosting of both old and new nfApps. 
* Where AOSM upgrades an nfApp with multiple replica, AOSM honors the deployment profile settings for either the rolling or recreate options. Where rolling is used, expose the values `maxUnavailable` and `maxSurge` as CGS parameters, which can then be set via operator CGV at run-time.

Ultimately, the ability for a given service to be upgraded without interruption is a feature of the service itself. Consult further with the service publisher to understand the in-service upgrade capabilities and ensure they're aligned with the proper AOSM behavioral options.

## Safe upgrade prerequisites
When planning for an upgrade using Azure Operator Service Manager, address the following requirements in advance of upgrade execution to optimize the time spent attempting the upgrade.

- Onboard updated artifacts using publisher and/or designer workflows.
  - In most cases, use the existing publisher to host new version artifacts.
    - Using an existing publisher supports `helm upgrade` to update an SNS to a different version.
    - Using a new publisher requires a `helm delete` on the current SNS and then a `helm install` for the new SNS version.
  - Artifact store, network service design group (NSDG), and network function design group (NFDG) are immutable and cannot change.
    - Changing one of these resources requires deployment of a new SNS.
  - A new artifact manifest is needed to store the new charts and images.
    - See [onboarding documentation](how-to-manage-artifacts-nexus.md) for details on uploading new charts and images.
  - A new NFDV, and optionally network service design version (NSDV), is needed.
    - NFDV changes can be complex. We cover only basic changes in this article.
    - New NSDV is only required if a new configuration group schema (CGS) version is being introduced.
  - If necessary, new CGS.
    - Required if an upgrade introduces new exposed configuration parameters. 

> [!NOTE]
> NSDVs and NFDVs with different major versions can be supported in the same NSDG and NFDG

- Create updated artifacts using Operator workflow.
  - If necessary, create new configuration group values (CGVs) based on new CGS.
  - Reuse and craft payload by confirming the existing site and site network service objects.

- Update templates to ensure that upgrade parameters are set based on confidence in the upgrade and desired failure behavior.
  - Settings used for production may suppress failures details, while settings used for debugging, or testing, may choose to expose these details.

## Safe upgrade procedure
Follow the following process to trigger an upgrade with Azure Operator Service Manager.

### Create new NFDV resource
For new NFDV versions, it must be in a valid SemVer format. The new version can be an upgrade, a greater value versus the deployed version, or a downgrade, a lower value versus the deployed version. The new version can differ by major, minor, or patch values.

### Update new NFDV parameters
Helm chart versions can be updated, or Helm values can be updated or parameterized as necessary. New nfApps can also be added where they didn't exist in deployed version.

### Update NFDV for desired nfApp order
UpdateDependsOn is an NFDV parameter used to specify ordering of nfApps during update operations. If `updateDependsOn` isn't provided, serial ordering of CNF applications, as appearing in the NFDV is used.

### Update ARM template for desired upgrade behavior
Make sure to set any desired CNF application `timeout`, the `atomic` parameter, and `rollbackOnTestFailure` parameter. It may be useful to change these parameters over time as more confidence is gained in the upgrade.

### Issue SNS reput
With onboarding complete, the reput operation is submitted. Depending on the number, size and complexity of the nfApps, the reput operation could take some time to complete (multiple hours).

### Examine reput results
If the reput is reporting a successful result, the upgrade is complete and the user should validate the state and availability of the service. If the reput is reporting a failure, follow the steps in the upgrade failure recovery section to continue.

## Safe upgrade retry procedure
In cases where a reput update fails, the following process can be followed to retry the operation.

### Diagnose failed nfApp
Resolve the root cause for nfApp failure by analyzing logs and other debugging information.

### Manually skip completed charts
After fixing the failed nfApp, but before attempting an upgrade retry, consider changing the `applicationEnablement` parameter to accelerate retry behavior. This parameter can be set false, where an nfApp should be skipped. This parameter can be useful where an nfApp doesn't require an upgraded. 

### Issue SNS reput retry (repeat until success)
By default, the reput retries nfApps in the declared update order, unless they're skipped using `applicationEnablement` flag.

## Skip nfApps using applicationEnablement
In the NFDV resource, under `deployParametersMappingRuleProfile` there's the property `applicationEnablement` of type enum, which takes values: Unknown, Enabled, or disabled. It can be used to exclude nfApp operations during network function (NF) deployment.

### Publisher changes
For the `applicationEnablement` property, the publisher has two options: either provide a default value or parameterize it. The following example sets `enabled` as the default value for `hellotest` which can later be changed via override.

```json
{ 
      "location":"<location>", 
      "properties": {
      "networkFunctionTemplate": {
        "networkFunctionApplications": [
            "deployParametersMappingRuleProfile": {
              "applicationEnablement": "Enabled"
            },
            "name": "hellotest"
          }
        ],
        "nfviType": "AzureArcKubernetes"
      },
    }
}
```

### Operator changes
Operators inherit default `applicationEnablement` values as defined by the NFDV. If `applicationEnablement` is parameterized, then it can be passed through the `deploymentValues` property at runtime using the CGV. `roleOverrideValues` specifies a nondefault setting for `applicationEnablement`.

```json
{
  "location": "<location>",
  "nfviType": "AzureArcKubernetes",
  "nfdvId": "<nfdv_id>",
  "helloworld-cnf-config": {
    "roleOverrideValues1": "{\"name\":\"hellotest\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\":\"Disable\"}}",
  }
}
```

## Skip nfApps which have no change
The `skipUpgrade` feature is designed to optimize the time taken for CNF upgrades. When the publisher enables this flag in the `roleOverrideValues` under `upgradeOptions`, the AOSM service layer performs certain prechecks, to determine whether an upgrade for a specific `nfApplication` can be skipped. If all precheck criteria are met, the upgrade is skipped for that application. Otherwise, an upgrade is executed at the cluster level.

### Precheck Criteria
An upgrade can be skipped if all the following conditions are met:
1. The `nfApplication` provisioning state is Succeeded.
2. there's no change in the Helm chart name or version.
3. there's no change in the Helm values.

### Enabling or disabling the skipUpgrade feature
The `skipUpgrade` feature is **disabled by default**. If this optional parameter isn't specified in `roleOverrideValues` under `upgradeOptions`, CNF upgrades proceed in the traditional manner, where the `nfApplications` are upgraded at the cluster level.

#### Enabling SkipUpgrade within Network Function Resource
To enable the SkipUpgrade feature via `roleOverrideValues`, refer to the following example.

```json
{
    "location": "eastus2euap",
    "properties": {
        "publisherName": "xyAzureArcRunnerPublisher",
        "publisherScope": "Private",
        "networkFunctionDefinitionGroupName": "AzureArcRunnerNFDGroup",
        "networkFunctionDefinitionVersion": "1.0.0",
        "networkFunctionDefinitionOfferingLocation": "eastus2euap",
        "nfviType": "AzureArcKubernetes",
        "nfviId": "/subscriptions/4a0479c0-b795-4d0f-96fd-c7edd2a2928f/resourcegroups/ashutosh_test_rg/providers/microsoft.extendedlocation/customlocations/ashutosh_test_cl",
        "deploymentValues": "",
        "roleOverrideValues": [
            "{\"name\":\"hellotest\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"options\":{\"installOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"1\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"4\",\"skipUpgrade\":\"true\"}}}}}",
            "{\"name\":\"runnerTest\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"options\":{\"installOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"5\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"5\"}}}}}"
        ]
    }
}
```
#### Explanation of the Example
- **nfApplication: `hellotest`**
  - The `skipUpgrade` flag is enabled. If the upgrade request for `hellotest` meets the precheck criteria, the upgrade is skipped.
- **nfApplication: `runnerTest`**
  - The `skipUpgrade` flag isn't specified. Therefore, `runnerTest` executes a traditional Helm upgrade at the cluster level, even if the precheck criteria are met.
