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
This article introduces Azure Operator Service Manager (AOSM) safe upgrade practices (SUP). This feature set enables an end user to safely execute complex upgrades of container network function (CNF) workloads hosted on Azure Operator Nexus, in compliance with partner In Service Software Upgrade (ISSU) requirements, where applicable. Look for future articles to expand on advanced SUP features and capabilities.

## Introduction to safe upgrades
A given network service supported by AOSM is composed of one to many CNFs which, over time, require software upgrades. For each upgrade, it is necessary to run one to many helm operations, updating dependent network function applications (nfApps), in a particular order, in a manner which least impacts the network service. AOSM SUP represents a set of features, which enables safe automation of these operations on Azure Operator Nexus.
  
* SNS Reput Support - Execute helm upgrade operation across all nfApps in network function design version (NFDV).
* Nexus Platform - Support SNS reput operations on Nexus platform targets. 
* Operation Time-outs - Ability to set operational time-outs for each nfApp operation.
* Synchronous Operations - Ability to run one serial nfApp operation at a time.
* Control Upgrade Order - Define different nfApp sequence for install and upgrade.
* Pause On Failure - Default behavior pauses after an nfApp operation failure.
* Rollback On Failure - Optional behavior, rollsback all completed nfApps prior to operation failure.
* Single Chart Test Validation - Running a helm test operation after a create or update.
* Skip nfApp on No Change - Skip processing of nfApps where no changes result.
* Image Preloading - Ability to preload images to edge repository.
  
## Safe upgrade approach
To update an existing Azure Operator Service Manager site network service (SNS), the Operator executes a reput update request against the deployed SNS resource. Where the SNS contains CNFs with multiple nfApps, the request is fanned out across all nfApps defined in the network function definition version (NFDV). By default, in the order, which they appear, or optionally in the order defined by `updateDependsOn` parameter.

For each nfApp, the reput update request supports increasing a helm chart version, adding/removing helm values and/or adding/removing any nfApps. Time-outs can be set per nfApp, based on known allowable runtimes, but nfApps can only be processed in serial order, one after the other. The reput update implements the following processing logic:

* nfApps are processed following either updateDependsOn ordering, or in the sequential order they appear.
* nfApps with parameter `applicationEnabled` set to disable are skipped.
* nfApps with parameter `skipUpgrade` set to enabled are skipped if no changes detected.
* nfApps which are common between old and new NFDV are upgraded.
* nfApps which are only in the new NFDV are installed.
* nfApps deployed, but not referenced by the new NFDV, are deleted.
  
To ensure outcomes, nfApp testing is supported using helm, either helm upgrade pre/post tests, or standalone helm tests. For pre/post tests failures, the atomic parameter is honored. With atomic/true, the failed chart is rolled back. With atomic/false, no rollback is executed. For more information on standalone helm testing, see the following article: [Run tests after install or upgrade](safe-upgrades-helm-test.md)

## Considerations for in-service upgrades
Azure Operator Service Manager generally supports in service upgrades, an upgrade method which advances a deployment version without interrupting the running service. Some considerations are necessary to ensure the proper behavior of AOSM during ISSU operations. 
* Where AOSM performs an upgrade against an ordered set of multiple nfApps, AOSM first upgrades or creates all new nfApps, then deletes all old nfApps. This approach ensures service is not impacted until all new nfApps are ready but requires extra platform capacity for transient hosting of both old and new nfApps. 
* Where AOSM upgrades an nfApp with multiple replica, AOSM honors the deployment profile settings for rolling or recreate option. Where rolling is used, expose the values `maxUnavailable` and `maxSurge` as CGS parameters, which can then be set via operator CGV at run-time.

Ultimately, the ability for a given service to be upgraded without interruption is a feature of the service itself. Consult further with the service publisher to understand the in-service upgrade capabilities and ensure they are aligned with the proper AOSM behavioral options.

## Safe upgrade prerequisites
When planning for an upgrade using Azure Operator Service Manager, address the following requirements in advance of upgrade execution to optimize the time spent attempting the upgrade.

- Onboard updated artifacts using publisher and/or designer workflows.
  - Publisher, artifact store, network service design group (NSDG), and network function design group (NFDG) are immutabe and cannot change.
    - Changing one of these resources would require deployment of a new NF via put.
  - A new artifact manifest is needed to store the new charts and images.
    - For more information, see [onboarding documentation](how-to-manage-artifacts-nexus.md) for details on uploading new charts and images.
  - A new NFDV, and optionally network service design version (NSDV), is needed.
    - We cover basic changes to the NFDV in the step by step section.
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
For new NFDV versions, it must be in a valid SemVer format. The new version can be an upgrade, a greater value versus the deployed version, or an downgrade, a lower value versus the deployed version. The new version can differ by major, minor or patch values.

### Update new NFDV parameters
Helm chart versions can be updated, or Helm values can be updated or parameterized as necessary. New nfApps can also be added where they did not exist in deployed version.

### Update NFDV for desired nfApp order
UpdateDependsOn is an NFDV parameter used to specify ordering of nfApps during update operations. If `updateDependsOn` is not provided, serial ordering of CNF applications, as appearing in the NFDV is used.

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
After fixing the failed nfApp, but before attempting an upgrade retry, consider changing the `applicationEnablement` parameter to accelerate retry behavior. This parameter can be set false, where an nfApp should be skipped. This parameter can be useful where an nfApp does not require an upgraded. 

### Issue SNS reput retry (repeat until success)
By default, the reput retries nfApps in the declared update order, unless they are skipped using `applicationEnablement` flag.

## Skip nfApps using applicationEnablement
In the NFDV resource, under `deployParametersMappingRuleProfile` there is the property `applicationEnablement` of type enum, which takes values: Unknown, Enabled, or disabled. It can be used to exclude nfApp operations during network function (NF) deployment.

### Publisher changes
For the `applicationEnablement` property, the publisher has two options: either provide a default value or parameterize it. 

#### Sample NFDV
The NFDV is used by publisher to set default values for applicationEnablement.

```json
{ 
      "location":"<location>", 
      "properties": {
      "networkFunctionTemplate": {
        "networkFunctionApplications": [
          {
            "artifactProfile": {
              "helmArtifactProfile": { 
                "var":"var"
              },
              "artifactStore": {
                "id": "<artifactStore id>"
              }
            },
            "deployParametersMappingRuleProfile": {
              "helmMappingRuleProfile": {
                "releaseNamespace": "{deployParameters.role1releasenamespace}",
                "releaseName": "{deployParameters.role1releasename}"
              },
              "applicationEnablement": "Enabled"
            },
            "artifactType": "HelmPackage",
            "dependsOnProfile": "null",
            "name": "hellotest"
          },
          {
            "artifactProfile": {
              "helmArtifactProfile": {
                 "var":"var"
              },
              "artifactStore": {
                "id": "<artifactStore id>"
              }
            },
            "deployParametersMappingRuleProfile": {
              "helmMappingRuleProfile": {
                "releaseNamespace": "{deployParameters.role2releasenamespace}",
                "releaseName": "{deployParameters.role2releasename}"
              },
              "applicationEnablement": "Enabled"
            },
            "artifactType": "HelmPackage",
            "dependsOnProfile": "null",
            "name": "hellotest1"
          }
        ],
        "nfviType": "AzureArcKubernetes"
      },
      "description": "null",
      "deployParameters": {"type":"object","properties":{"role1releasenamespace":{"type":"string"},"role1releasename":{"type":"string"},"role2releasenamespace":{"type":"string"},"role2releasename":{"type":"string"}},"required":["role1releasenamespace","role1releasename","role2releasenamespace","role2releasename"]},
      "networkFunctionType": "ContainerizedNetworkFunction"
    }
}
```

#### Sample configuration group schema (CGS) resource
The CGS is used by the publisher to require a `roleOverrideValues` variable to be provided by Operator at run-time. `roleOverrideValues` can include nondefault settings for `applicationEnablement`.

```json
{
  "type": "object",
  "properties": {
    "location": {
      "type": "string"
    },
    "nfviType": {
      "type": "string"
    },
    "nfdvId": {
      "type": "string"
    },
    "helloworld-cnf-config": {
      "type": "object",
      "properties": {
        "role1releasenamespace": {
          "type": "string"
        },
        "role1releasename": {
          "type": "string"
        },
        "role2releasenamespace": {
          "type": "string"
        },
        "role2releasename": {
          "type": "string"
        },
        "roleOverrideValues1": {
          "type": "string"
        },
        "roleOverrideValues2": {
          "type": "string"
        }
      },
      "required": [
        "role1releasenamespace",
        "role1releasename",
        "role2releasenamespace",
        "role2releasename",
        "roleOverrideValues1",
        "roleOverrideValues2"
      ]
    }
  },
  "required": [
    "nfviType",
    "nfdvId",
    "location",
    "helloworld-cnf-config"
  ]
}
```

### Operator changes
Operators inherit default `applicationEnablement` values as defined by the NFDV. If `applicationEnablement` is parameterized in CGS, then it must be passed through the `deploymentValues` property at runtime. 
 
#### Sample configuration group value (CGV) resource
The CGV is used by the operator to set the `roleOverrideValues` variable at run-time. `roleOverrideValues` include nondefault settings for `applicationEnablement`.

```json
{
  "location": "<location>",
  "nfviType": "AzureArcKubernetes",
  "nfdvId": "<nfdv_id>",
  "helloworld-cnf-config": {
    "role1releasenamespace": "hello-test-releasens",
    "role1releasename": "hello-test-release",
    "role2releasenamespace": "hello-test-2-releasens",
    "role2releasename": "hello-test-2-release",
    "roleOverrideValues1": "{\"name\":\"hellotest\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\":\"Enabled\",\"helmMappingRuleProfile\":{\"releaseName\":\"override-release\",\"releaseNamespace\":\"override-namespace\",\"helmPackageVersion\":\"1.0.0\",\"values\":\"\",\"options\":{\"installOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"30\",\"injectArtifactStoreDetails\":\"true\"},\"upgradeOptions\":{\"atomic\":\"true\",\"wait\":\"true\",\"timeout\":\"30\",\"injectArtifactStoreDetails\":\"true\"}}}}}",
    "roleOverrideValues2": "{\"name\":\"hellotest1\",\"deployParametersMappingRuleProfile\":{\"applicationEnablement\" : \"Enabled\"}}"
  }
}
```

#### Sample NF ARM template
The NF ARM template is used by operator to submit the `roleOverrideValues` variable, set by CGV, to the resource provider (RP). The operator can change the `applicationEnablement` setting in CGV, as needed, and resubmit the same NF ARM template, to alter behavior between iterations.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "nameValue": {
      "type": "string",
      "defaultValue": "HelloWorld"
    },
    "locationValue": {
      "type": "string",
      "defaultValue": "eastus"
    },
    "nfviTypeValue": {
      "type": "string",
      "defaultValue": "AzureArcKubernetes"
    },
    "nfviIdValue": {
      "type": "string"
    },
    "config": {
      "type": "object",
      "defaultValue": {}
    },
    "nfdvId": {
      "type": "string"
    }
  },
  "variables": {
    "deploymentValuesValue": "[string(createObject('role1releasenamespace', parameters('config').role1releasenamespace, 'role1releasename',parameters('config').role1releasename, 'role2releasenamespace', parameters('config').role2releasenamespace, 'role2releasename',parameters('config').role2releasename))]",
    "nfName": "[concat(parameters('nameValue'), '-CNF')]",
    "roleOverrideValues1": "[string(parameters('config').roleOverrideValues1)]",
    "roleOverrideValues2": "[string(parameters('config').roleOverrideValues2)]"
  },
  "resources": [
    {
      "type": "Microsoft.HybridNetwork/networkFunctions",
      "apiVersion": "2023-09-01",
      "name": "[variables('nfName')]",
      "location": "[parameters('locationValue')]",
      "properties": {
        "networkFunctionDefinitionVersionResourceReference": {
          "id": "[parameters('nfdvId')]",
          "idType": "Open"
        },
        "nfviType": "[parameters('nfviTypeValue')]",
        "nfviId": "[parameters('nfviIdValue')]",
        "allowSoftwareUpdate": true,
        "configurationType": "Open",
        "deploymentValues": "[string(variables('deploymentValuesValue'))]",
        "roleOverrideValues": [
          "[variables('roleOverrideValues1')]",
          "[variables('roleOverrideValues2')]"
        ]
      }
    }
  ]
}
```

## Skip nfApps which have no change
The `skipUpgrade` feature is designed to optimize the time taken for CNF upgrades. When the publisher enables this flag in the `roleOverrideValues` under `upgradeOptions`, the AOSM service layer performs certain prechecks, to determine whether an upgrade for a specific `nfApplication` can be skipped. If all precheck criteria are met, the upgrade is skipped for that application. Otherwise, an upgrade is executed at the cluster level.

### Precheck Criteria
An upgrade can be skipped if all the following conditions are met:
1. The `nfApplication` provisioning state is Succeeded.
2. There is no change in the Helm chart name or version.
3. There is no change in the Helm values.

### Enabling or disabling the skipUpgrade feature
The `skipUpgrade` feature is **disabled by default**. If this optional parameter is not specified in `roleOverrideValues` under `upgradeOptions`, CNF upgrades proceed in the traditional manner, where the `nfApplications` are upgraded at the cluster level.

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
  - The `skipUpgrade` flag is not specified. Therefore, `runnerTest` executes a traditional Helm upgrade at the cluster level, even if the precheck criteria are met.
