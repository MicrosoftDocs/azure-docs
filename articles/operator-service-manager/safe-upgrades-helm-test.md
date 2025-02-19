---
title: Run tests after install or upgrade operations with Azure Operator Service Manager
description: Learn about using helm test as poart of a network function install or upgrade.
author: msftadam
ms.author: adamdor
ms.date: 02/19/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Run tests after install or upgrade
This article describes hww Azure Operator Service Manager (AOSM) users can run tests on deployed network functions (NFs) as part install or upgrade operations. When enabledd, each network function application (nfApp) will be tested after completion of the install or upgrade opreation. A successful result of the nfApp test will be required for the NF operation status to report successful.

## Overview
This feature's scope is to run helm tests as part of the network function install or upgrade operations.
*	Users will author their own tests and include within helm package during NF onboarding.
*	Only where enabled, AOSM will execute these helm tests on each nfApp.
* Upon test success, AOSM will proceed to the next nfApp.
*	Upon test failure, AOSM will honor `RollbackOnTestFail` flag to determine if the nfApp will be rolled back.
* The parent NF operation will terminate with failure if any nfApp fails a user configured test.
* Upon parent failure, AOSM will honor the configured method of NF failure control, either `pause-on-failure` or `rollback-on-failure`.

> [!NOTE]
> * Helm Test is only supported as part of the install/upgrade operation and cannot be run separately.

## Authoring helm tests
Helm tests are authored by the owner of the helm charts. The helm tests are defined in the helm chart under the folder: `<ChartName>/Templates/`. Each test includes a job definition that specifies a container environment and command to run. The container environment should exit successfully for a test to be considered a success. The job definition must include the Helm test hook annotation `(helm.sh/hook: test)` to be recognized as a test by Helm.

## Enable helm tests during operations
AOSM provides a set of configurable install and upgrade options for each component under a NF. These existing options are extended with a new configurable 'TestOptions` parameter. This will give the uses the ability to specify TestOptions per nfApp  and as per the type of operation. Following are the parameters available under the TestOptions bag:

* enable	
  * This is a bool flag that will enable/disable helm test on a component after install/upgrade.
  * Default value is false.
* timeout	
  * This parameter takes an int that represents test timeout in minutes.
  * Default value is 20 minutes.
* rollbackOnTestFailure	
  * This is a bool flag that will enable/disable component rollback on helm test failure.
  * Default value is true.
* filter	
  * This is a list of strings and each string in the list represents a test name. This parameter will allow users to run a subset of defined tests in the chart
  * No filter is applied by default.

## Exposing helm test control via parameters
Users already can use `RoleOverrideValues` parameter in a NF payload to specify `InstallOptions` and `UpgradeOptions`. Now the `InstallOptions` and `UpgradeOptions` will be extended to hold `TestOptions`. Thus, `TestOptions` can be specified for each component under a NF and each method of operation. Following is an example of roleOverrideValues to be specified in the NF Payload to specify InstallOptions (inlcuding TestOptions) and UpgradeOptions (including TestOptions) for a component named: application1-

``` 
"roleOverrideValues": [  
            "{\"name\":\"application1\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"helmPackageVersion\":\"2.1.3\",\"values\":\"{\\\"roleOneParam\\\":\\\"roleOneOverrideValue\\\"}\",\"options\":{\"installOptions\":{\"atomic\":\”true\”,\"wait\":\"true\",\"timeout\":\"30m\",\” testOptions \”:{\” enable \”:\”true\”,\” timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\” filter \”:[\”test1\”,\”test2\”,\”test3\”]}},\"upgradeOptions\":{\"atomic\": \”true\”,\"wait\":\"true\",\"timeout\":\"30\", \” testOptions \”:{\” enable \”:\”true\”,\” timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\” filter \”:[\”test1\”,\”test2\”,\”test3\”]}}}}}}"  
        ]
```

```
Uescaped Version:
"roleOverrideValues": [
            "{"name":"hellotest",
"deployParametersMappingRuleProfile":
{"helmMappingRuleProfile":
{
"options": 
{
"installOptions":
{
"atomic":"true",
"wait":"true",
"timeout":"1"
“testOptions”:
{
“enable”: “true”,
“timeout”: “10”,
“rollbackOnTestFailure”: “true”,
"filter”: [“test1”, “test2”]		
}
},
"upgradeOptions":
{
"atomic":"true",
"wait":"true",
"timeout":"2",
“testOptions”:
{
“enable”: “true”,
“timeout”: “10”,
“rollbackOnTestFailure”: “true”,
"filter”: [“test1”, “test2”]		
} } } } } }" ]
```
## Example of TestOptions usage
Following is an example NF Payload with TestOptions under InstallOptions and UpgradeOptions for a component named: application1

```
{
    "location": "eastus",
    "properties": {
        "publisherName": "testVendor",
        "publisherScope": "Public",
        "networkFunctionDefinitionGroupName": "testnetworkFunctionDefinitionGroupName",
        "networkFunctionDefinitionVersion": "1.0.1",
        "networkFunctionDefinitionOfferingLocation": "eastus",
        "nfviType": "AzureArcKubernetes",
        "nfviId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testResourceGroup/providers/Microsoft.ExtendedLocation/customLocations/testCustomLocation",
        "allowSoftwareUpdate": true,
        "deploymentValues": "{\"releaseName\":\"testReleaseName\",\"namespace\":\"testNamespace\",\"wait\":\"false\"}",
       "roleOverrideValues": [ 
            "{\"name\":\"application1\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"helmPackageVersion\":\"2.1.3\",\"values\":\"{\\\"roleOneParam\\\":\\\"roleOneOverrideValue\\\"}\",\"options\":{\"installOptions\":{\"atomic\":\”true\”,\"wait\":\"true\",\"timeout\":\"30m\",\” testOptions \”:{\” enable \”:\”true\”,\” timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\” filter \”:[\”test1\”,\”test2\”,\”test3\”]}},\"upgradeOptions\":{\"atomic\": \”true\”,\"wait\":\"true\",\"timeout\":\"30\", \” testOptions \”:{\” enable \”:\”true\”,\” timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\” filter \”:[\”test1\”,\”test2\”,\”test3\”]}}}}}}" 
        ]
    }
}
```
