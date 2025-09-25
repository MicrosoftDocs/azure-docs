---
title: Get started with Azure Operator Service Manager Safe Upgrade Practices 
description: Safely execute complex upgrades of CNF workloads on Azure Operator Nexus
author: msftadam
ms.author: adamdor
ms.date: 05/20/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
ms.custom:
  - build-2025
---

# Get started with safe upgrade practices
This article introduces Azure Operator Service Manager (AOSM) safe upgrade practices (SUP). This feature set enables upgrades to complex container network function (CNF) hosted on Azure Operator Nexus. These upgrades generally support partner In Service Software Upgrade (ISSU) methods and requirements. While this article introduces basic concepts, look for other articles which expand on advanced SUP features and capabilities.

## Introduction to safe upgrades
A given network service supported by AOSM, composed of one to many CNFs, includes components which, over time, require software and/or configuration changes. To make these component level changes it's necessary to run one to many helm operations, upgrading each network function application (nfApp) in a particular order and in a manner which least impacts the network service. AOSM safe upgrade practices apply the following high level capabilities to handle upgrade process and workflow requirements:
  
* SNS Reput Support - Execute helm upgrade operation across all nfApps in network function design version (NFDV).
* Nexus Platform - Support SNS reput operations on Nexus platform targets. 
* Operation Timeouts - Ability to set operational timeouts for each nfApp operation.
* Synchronous Operations - Ability to run one serial nfApp operation at a time.
* Control Upgrade Order - Define different nfApp sequence for install and upgrade.
* Pause On Failure - Default behavior pauses after an nfApp operation failure.
* Rollback On Failure - Optional behavior, rollback completed nfApps before failed nfApp.
* Single Chart Test Validation - Running a helm test operation after a create or update.
* Skip nfApp on No Change - Skip processing of nfApps where no changes result.
* Image Preloading - Ability to preload images to edge repository.
  
## Safe upgrade approach
To update an existing AOSM site network service (SNS), the operator executes a reput request against the deployed SNS resource. Where the SNS contains CNFs with multiple nfApps, the request is fanned out across all nfApps defined in the network function definition version (NFDV). By default, in the order, which they appear, or optionally in the order defined by `updateDependsOn` parameter.

For each nfApp, the reput request supports various changes including increasing a helm chart version, adding/removing helm values and/or adding/removing any nfApps. While timeouts can be set per nfApp, based on known allowable runtimes, nfApps can only be processed in serial order, one after the other. The reput update implements the following processing logic:

* nfApps are processed following either `updateDependsOn` ordering, or in the sequential order they appear.
* nfApps with parameter `applicationEnabled` set to disable are skipped.
* nfApps with parameter `skipUpgrade` set to `enabled` are skipped if no changes detected.
* nfApps which are common between old and new NFDV are upgraded using `helm upgrade`.
* nfApps which are only in the new NFDV are installed using `helm install`.
* nfApps deployed, but not referenced by the new NFDV, are deleted using `helm delete`.
  
To ensure outcomes, nfApp testing is supported using helm methods, either tests triggered by helm pre or post hooks, or using the standalone helm test hook. For pre or post hook failure, the `atomic` parameter is honored. With atomic/true, the failed chart is rolled back. With atomic/false, no rollback is executed. For standalone helm test hook failure, the `rollbackOnTestFailure` is honored, following similar logic as atomic. For more information on standalone helm testing, see the following article: [Run tests after install or upgrade](safe-upgrades-helm-test.md)

When an nfApp operation failure occurs, and after the failed nfApp is handled via `atomic` or `rollbackOnTestFailure` parameters, the operator can control behavior on how to handle any nfApps changed before the failed nfApp. With pause-on-failure the operator can force AOSM to break after addressing the failed nfApp, preserving the mixed version environment. With rollback-on-failure the operator can force AOSM to rollback any prior nfApp, restoring the original environment snapshot. For more information on controlling upgrade failure behavior, see the following article: [Control upgrade failure behavior](safe-upgrades-nf-level-rollback.md)

## Considerations for in-service upgrades
Azure Operator Service Manager generally supports in service upgrades, an upgrade method which advances a deployment version without interrupting the running service. Some network function owner considerations are necessary to ensure the proper behavior of AOSM during ISSU operations. 
* Where AOSM performs an upgrade against an ordered set of multiple nfApps, AOSM first upgrades or creates all new nfApps, then deletes all old nfApps. This approach ensures service isn't impacted until all new nfApps are ready but requires extra platform capacity for transient hosting of both old and new nfApps. 
* Where AOSM upgrades an nfApp with multiple replicas, AOSM honors the deployment profile settings for either the rolling or recreate option. Where rolling is used, expose the values `maxUnavailable` and `maxSurge` as CGS parameters, which can then be set via operator CGV at run-time.

Ultimately, the ability for a given service to be upgraded without interruption is a feature of the service itself. Consult further with the service publisher to understand the in-service upgrade capabilities and ensure they're aligned with the proper AOSM behavioral options.

## Safe upgrade prerequisites
When planning for an upgrade using AOSM, address the following requirements in advance of upgrade execution, to optimize time spent attempting and ensure success of the upgrade.

- Onboard updated artifacts using publisher and/or designer workflows.
  - In most cases, use the existing publisher to host new version artifacts.
    - Using an existing publisher supports `helm upgrade` to update an SNS to a different version.
    - Using a new publisher requires a `helm delete` on the current SNS and then a `helm install` for the new SNS version.
  - Artifact store, network service design group (NSDG), and network function design group (NFDG) are immutable and can't change.
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
Follow the following process to trigger an upgrade with AOSM.

* Create new NFDV resource
  * For new NFDV versions, it must be in a valid SemVer format. The new version can be an upgrade, a greater value versus the deployed version, or a downgrade, a lower value versus the deployed version. The new version can differ by major, minor, or patch values.
* Update new NFDV parameters
  * Helm chart versions can be updated, or Helm values can be updated or parameterized as necessary. New nfApps can also be added where they didn't exist in deployed version.
* Update NFDV for desired nfApp order
  * UpdateDependsOn is an NFDV parameter used to specify ordering of nfApps during update operations. If `updateDependsOn` isn't provided, serial ordering of CNF applications, as appearing in the NFDV is used.
* Update ARM template for desired upgrade behavior
  * Make sure to set any desired CNF application `timeout`, the `atomic` parameter, and `rollbackOnTestFailure` parameter. It may be useful to change these parameters over time as more confidence is gained in the upgrade.
* Issue SNS reput
  * With onboarding complete, the reput operation is submitted. Depending on the number, size and complexity of the nfApps, the reput operation could take some time to complete (multiple hours).
* Examine reput results
  * If the reput is reporting a successful result, the upgrade is complete and the user should validate the state and availability of the service. If the reput is reporting a failure, follow the steps in the upgrade failure recovery section to continue.

## Safe upgrade retry procedure
In cases where a reput update fails, the following process can be followed to retry the operation.

* Diagnose failed nfApp
  * Resolve the root cause for nfApp failure by analyzing logs and other debugging information.
* Manually skip completed charts
  * After fixing the failed nfApp, but before attempting an upgrade retry, consider changing the `applicationEnablement` parameter to accelerate retry behavior. This parameter can be set false, where an nfApp should be skipped. This parameter can be useful where an nfApp doesn't require an upgraded.
* Issue SNS reput retry (repeat until success)
  * By default, the reput retries nfApps in the declared update order, unless they're skipped using `applicationEnablement` flag.

## Control timeouts with installOptions and UpgradeOptions
When an SNS operation starts either a `helm install` or a `helm upgrade`, a 27-minute default timeout value is used. While this value can be customized at the global network function (NF) level, we recommend customizing this value at the component NF level using `roleOverrideValues` in the NF payload template. Further exposing the `roleOverrideValues` in CGS/CGV allows control by the operator at run-time. The following example demonstrates supported installOptions and upgradeOptions parameters applied across two nfApp components;

```json
{
  "roleOverrideValues": [
    {
      "name": "nfApplication1",
      "deployParametersMappingRuleProfile": {
        "helmMappingRuleProfile": {
          "options": {
            "installOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1"
            },
            "upgradeOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1"
            } } } } },
    {
      "name": "nfApplication2",
      "deployParametersMappingRuleProfile": {
        "helmMappingRuleProfile": {
          "options": {
            "installOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1"
            },
            "upgradeOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1"
            } } } } }
  ]
}
```

## Skip nfApps using applicationEnablement
In the NFDV resource, under `deployParametersMappingRuleProfile` there's a supported property `applicationEnablement` of type enum, which takes values of Unknown, Enabled, or disabled. It can be used to manually exclude nfApp operations during network function deployment. The following example demonstrates a generic method to parameterize `applicationEnablement` as an included value in `roleOverrideValues` property.

### NFDV template changes
While no NFDV changes are necessarily required, optionally the publisher can use the NFDV to set a default value for the `applicationEnablement` property. The default value is used, unless its changed via `roleOverrideValues`.  Use the NFDV template to set a default value for `applicationEnablement`. The following example sets `enabled` state as the default value for `hellotest` networkfunctionApplication. 

```json
      "location":"<location>", 
      "properties": {
      "networkFunctionTemplate": {
        "networkFunctionApplications": [
            "deployParametersMappingRuleProfile": {
              "applicationEnablement": "Enabled"
            },
            "name": "hellotest"
        ],
        "nfviType": "AzureArcKubernetes"
        },
      }
```

To manage the `applicationEnablement` value more dynamically, the Operator can pass a real-time value using the NF template `roleOverrideValues` property. While it's possible for the operator to manipulate the NF template directly, instead parameterize the `roleOverrideValues`, so that values can be passed via a CGV template at runtime. The following examples demonstrate the needed modifications to the CGS, NF templates, and finally the CGV.

### CGS template changes
The CGS template must be updated to include one variable declaration for each line to parameterize under `roleOverrideValues`. The following example demonstrates three override values.

```json
        "roleOverrideValues0": {
          "type": "string"        
        },    
        "roleOverrideValues1": {
          "type": "string"        
        },        
        "roleOverrideValues2": {
          "type": "string"
        }
```

### NF payload template changes
The NF template must be update three ways. First, the implicit config parameter must be defined as type object. Second, `roleOverrideValues0`, `roleOverrideValues1`, and `roleOverrideValues2` must be declared as variables mapped to config parameter. Third, `roleOverrideValues0`, `roleOverrideValues1`, and `roleOverrideValues2` must be referenced for substitution under `roleOverrideValues` in proper order and following proper syntax.

```json
  "parameters": {
    "config": {
      "type": "object",
      "defaultValue": {}
    }
  }
  "variables": {
    "roleOverrideValues0": "[string(parameters('config').roleOverrideValues1)]",
    "roleOverrideValues1": "[string(parameters('config').roleOverrideValues1)]",
    "roleOverrideValues2": "[string(parameters('config').roleOverrideValues2)]"
  },
  "resources": [
  {
<snip>
     "roleOverrideValues": [
          "[variables('roleOverrideValues0')]",
          "[variables('roleOverrideValues1')]",
          "[variables('roleOverrideValues2')]"
        ]
   }
```

### CGV template changes
The CGV template can now be updated to include the content for each variable to be substituted into `roleOverrideValues` property at run-time. The following example sets `rollbackEnabled` to true, followed by override sets for `hellotest` and `hellotest1` nfApplications.

```json
{
    "roleOverrideValues0": "{\"nfConfiguration\":{\"rollbackEnabled\":true}}",
    "roleOverrideValues1": "{\"name\":\"hellotest\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\":\"Enabled\",\"helmMappingRuleProfile\":{\"releaseName\":\"override-release\",\"releaseNamespace\":\"override-namespace\",\"helmPackageVersion\":\"1.0.0\",\"values\":\"\",\"options\":{\"installOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"30\",\"injectArtifactStoreDetails\":\"true\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"30\",\"injectArtifactStoreDetails\":\"true\"}}}}}",
    "roleOverrideValues2": "{\"name\":\"hellotest1\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\" : \"Enabled\"}}"
}
```
With this framework in place, the Operator can manage any of the `roleOverrideValues` via simple updates to the CGV, followed by attaching that CGV to the desired SNS operation.

## Skip nfApps which have no change
The `skipUpgrade` feature is designed to optimize the time taken for CNF upgrades. When the publisher enables this flag in the `roleOverrideValues` under `upgradeOptions`, the AOSM service layer performs certain prechecks, to determine whether an upgrade for a specific `nfApplication` can be skipped. If all precheck criteria are met, the upgrade is skipped for that application. Otherwise, an upgrade is executed at the cluster level.

### Precheck Criteria
An upgrade can be skipped if all the following conditions are met:
- The `nfApplication` provisioning state is Succeeded.
- There's no change in the Helm chart name or version.
- There's no change in the Helm values.

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

## Complete roleOverrideValues option reference
Bringing together all examples in this and other articles, the following reference demonstrates all presently supported options available through the `roleOverrideValues` mechanism.

```json
{
  "roleOverrideValues": [
    {
      "nfConfiguration": {
        "rollbackEnabled": "true"
      }
    },
    {
      "name": "nfApplication1",
      "deployParametersMappingRuleProfile": {
        "helmMappingRuleProfile": {
          "options": {
            "installOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1",
              "testOptions": {
                "enable": "true",
                "timeout": "true",
                "rollbackOnTestFailure": "true",
                "filter": [
                  "test1",
                  "test2"
                ]
              }
            },
            "upgradeOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1",
              "skipUpgrade": "true",
              "testOptions": {
                "enable": "true",
                "timeout": "true",
                "rollbackOnTestFailure": "true",
                "filter": [
                  "test1",
                  "test2"
                ]
              }
            }
          }
        }
      }
    },
    {
      "name": "nfApplication2",
      "deployParametersMappingRuleProfile": {
        "helmMappingRuleProfile": {
          "options": {
            "installOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1",
              "testOptions": {
                "enable": "true",
                "timeout": "true",
                "rollbackOnTestFailure": "true",
                "filter": [
                  "test1",
                  "test2"
                ]
              }
            },
            "upgradeOptions": {
              "atomic": "true",
              "wait": "true",
              "timeout": "1",
              "skipUpgrade": "true",
              "testOptions": {
                "enable": "true",
                "timeout": "true",
                "rollbackOnTestFailure": "true",
                "filter": [
                  "test1",
                  "test2"
                ]
              }
            }
          }
        }
      }
    }
  ]
}
```
