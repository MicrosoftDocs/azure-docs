---
title: Get started with Azure Operator Service Manager Safe Upgrade Practices 
description: Safely execute complex upgrades of CNF workloads on Azure Operator Nexus
author: msftadam
ms.author: adamdor
ms.date: 08/30/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Get started with safe upgrade practices

## Overview 
This article introduces Azure Operator Service Manager (AOSM) safe upgrade practices (SUP). This feature set enables an end user to safely execute complex upgrades of CNF workloads hosted on Azure Operator Nexus, in compliance with partner ISSU requirements, where applicable. Look for future articles in these services to expand on SUP features and capabilities.

## Introduction
A given network service supported by Azure Operator Service Manager will be composed of one to many container based network functions (CNFs) which, over time, will require  software updates. For each  update, it is necessary to run one to many helm operations, upgrading dependent network function applications (NfApps), in a particular order, in a manner which least impacts the network service. At Azure Operator Service Manager, Safe Upgrade Practices represents a set of features, which can automate the CNF operations required to update a network service on Azure Operator Nexus.
  
* SNS Reput update - Execute helm upgrade operation across all NfApps in NFDV.
* Nexus Platform - Support SNS reput operations on Nexus platform targets. 
* Operation Timeouts - Ability to set operational timeouts for each NfApp operation.
* Synchronous Operations - Ability to run one serial NfApp operation at a time.
* Pause On Failure - Based on flag, set failure behavior to rollback only last NfApp operation.
* Single Chart Test Validation - Running a helm test operation after a create or update.
* Refactored SNS Reput - Improved methods, adds update order and cleanup check.

## Upgrade approach
To update an existing Azure Operator Service Manager site network service (SNS), the Operator executes a reput update request against the deployed SNS resource. Where the SNS contains CNFs with multiple NfApps, the request is fanned out across all NfApps defined in the network function definition version (NFDV). By default, in the order, which they appear, or optionally in the order defined by UpdateDependsOn parameter.

For each NfApp, the reput update request supports increasing a helm chart version, adding/removing helm values and/or adding/removing any NfApps. Timeouts can be set per NfApp, based on known allowable runtimes, but NfApps can only be processed in serial order, one after the other. The reput update implements the following processing logic:

* NfApps are processed following either updateDependsOn ordering, or in the sequential order they appear.
* NfApps with parameter "applicationEnabled" set to disable are skipped.
* NFApps deployed, but not referenced by the new NFDV, are deleted.
* NFApps which are common between old and new NFDV are upgraded.
* NFApps which are only in the new NFDV are installed.

To ensure outcomes, NfApp testing is supported using helm, either helm upgrade pre/post tests, or standalone helm tests. For pre/post tests failures, the atomic parameter is honored. With atomic/true, the failed chart is rolled back. With atomic/false, no rollback is executed. For standalone helm tests, the rollbackOnTestFailure parameter us honored. With rollbackOnTestFailure/true, the failed chart is rolled back. With rollbackOnTestFailure/false, no rollback is executed.

## Prerequisites
When planning for an upgrade using Azure Operator Service Manager, address the following requirements in advance of upgrade execution to optimize the time spent attempting the upgrade.

- Onboard updated artifacts using publisher and/or designer workflows.
  - Publisher, store, network service design (NSDg), and network function design group (NFDg) are static and do not need to change.
    - A new artifact manifest is needed to store the new charts and images. For more information, see onboarding documentation for details on uploading new charts and images.
  - New NFDV and network service design version (NSDV) are needed, under existing NFDg and NSDg.
    - We cover basic changes to the NFDV in the step by step section.
    - New NSDV is only required if a new configuration group schema (CGS) version is being introduced.
  - If necessary, new CGS.
    - Required if an upgrade introduces new exposed configuration parameters. 

- Create updated artifacts using Operator workflow.
  - If necessary, create new configuration group values (CGVs) based on new CGS.
  - Reuse and craft payload by confirming the existing site and site network service objects.

- Update templates to ensure that upgrade parameters are set based on confidence in the upgrade and desired failure behavior.
  - Settings used for production may suppress failures details, while settings used for debugging, or testing, may choose to expose these details.

## Upgrade procedure
Follow the following process to trigger an upgrade with Azure Operator Service Manager.

### Create new NFDV resource
For new NFDV versions, it must be in a valid SemVer format, where only higher incrementing values of patch and minor versions updates are allowed. A lower NFDV version is not allowed. Given a CNF deployed using NFDV 2.0.0, the new NFDV can be of version 2.0.1, or 2.1.0, but not 1.0.0, or 3.0.0. 

### Update new NFDV parameters
Helm chart versions can be updated, or Helm values can be updated or parameterized as necessary. New NfApps can also be added where they did not exist in deployed version.

### Update NFDV for desired NfApp order
UpdateDependsOn is an NFDV parameter used to specify ordering of NfApps during update operations. If UpdateDependsOn is not provided, serial ordering of CNF applications, as appearing in the NFDV is used.

### Update NFDV for desired upgrade behavior
Make sure to set any desired CNF application timeouts, the atomic parameter, and rollbackOnTestFailure parameter. It may be useful to change these parameters over time as more confidence is gained in the upgrade.

### Issue SNS reput
With onboarding complete, the reput operation is submitted. Depending on the number, size and complexity of the NfApps, the reput operation could take some time to complete (multiple hours).

### Examine reput results
If the reput is reporting a successful result, the upgrade is complete and the user should validate the state and availability of the service. If the reput is reporting a failure, follow the steps in the upgrade failure recovery section to continue.

## Retry procedure
In cases where a reput update fails, the following process can be followed to retry the operation.

### Diagnose failed NfApp
Resolve the root cause for NfApp failure by analyzing logs and other debugging information.

### Manually skip completed charts
After fixing the failed NfApp, but before attempting an upgrade retry, consider changing the applicationEnablement parameter to accelerate retry behavior. This parameter can be set false, where an NfApp should be skipped. This parameter can be useful where an NfApp does not require an upgraded. 

### Issue SNS reput retry (repeat until success)
By default, the reput retries NfApps in the declared update order, unless they are skipped using applicationEnablement flag.

## How to use applicationEnablement
In the NFDV resource, under deployParametersMappingRuleProfile there is the property applicationEnablement of type enum, which takes values: Unknown, Enabled, or disabled. It can be used to exclude NfApp operations during NF deployment.

### Publisher changes
For the applicationEnablement property, the publisher has two options: either provide a default value or parameterize it. 

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
The CGS is used by publisher to require the roleOverrideValues variable(s) to be provided by Operator at runt-time. These roleOverrideValues can include non-dedfault settings for applicationEnablement.

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
Operators inherity default applicationEnablement values as defined by the NFDV. If applicationEnablement is parameterized in CGS, then it must be passed through the deploymentValues property at runtime. 
 
#### Sample configuration group value (CGV) resource
The CGV is used by operator to set the roleOverrideValues variable(s) at runt-time. The roleOverrideValues includes a non-dedfault settings for applicationEnablement.

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
The NF ARM template is used by operator to submit the roleOverrideValues variable(s), set by CGV, to the resource provider (RP). The operator can change the applicationEnablement setting in CGV, as needed, and resubmit the same NF ARM template, to alter behavior between iterations.

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

## Support for in service upgrades
Azure Operator Service Manager, where possible, supports in service upgrades, an upgrade method which advances a deployment version without interrupting the service. However, the ability for a given service to be upgraded without interruption is a feature of the service itself. Consult further with the service publisher to understand the in-service upgrade capabilities.

## Forwarding looking objectives
Azure Operator Service Manager continues to grow the Safe Upgrade Practice feature set and drive improvements into offered update services. The following features are presently under consideration for future availability:

* Improve Upgrade Options Control - Expose parameters more effectively.
* Skip NfApp on No Change - Skip processing of NfApps where no changes result.
* Execute NFDV Rollback On Failure - Based on flag, rollback all completed NfApps on failure.
* Operate Asynchronously - Ability to run multiple NfApp operations at a time.
* Download Images- Ability to preload images to edge repository.
* Target Charts for Validation - Ability to run a helm test only on a specific NfApp.
