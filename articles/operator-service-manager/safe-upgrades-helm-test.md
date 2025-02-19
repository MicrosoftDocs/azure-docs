---
title: Run tests after install or upgrade operations with Azure Operator Service Manager
description: Learn about using helm test as part of a network function install or upgrade.
author: msftadam
ms.author: adamdor
ms.date: 02/19/2024
ms.topic: upgrade-and-migration-article
ms.service: azure-operator-service-manager
---

# Run tests after install or upgrade
This article describes how Azure Operator Service Manager (AOSM) can run tests on deployed network functions (NFs) as part install or upgrade operations. When enabled, each network function application (nfApp) will be tested after install or upgrade completion. A successful result across all nfApp tests is required for the NF operation status to complete successfully.

## Overview
This feature's scope is to run helm tests as part of the network function install or upgrade operations.
*	Users author their own tests and include them within the helm package during NF onboarding.
*	Only where enabled, AOSM executes these helm tests on each nfApp.
* Upon test success, AOSM proceeds to the next nfApp.
*	Upon test failure, AOSM honors `RollbackOnTestFail` flag to determine if the nfApp is rolled back.
* The parent NF operation terminates with failure if any nfApp fails a configured test.
* Upon parent failure, AOSM honors the configured method of NF failure control, either `pause-on-failure` or `rollback-on-failure`.

> [!NOTE]
> * Helm Test is only supported as part of the install or upgrade operation and can't be run separately.

## Authoring helm tests
The publisher is responsible for authoring the helm tests during construction of the helm charts. The helm tests are defined in the helm chart under the folder: `<ChartName>/Templates/`. Each test includes a job definition that specifies a container environment and command to run. The container environment should exit successfully for a test to be considered a success. The job definition must include the helm test hook annotation `(helm.sh/hook: test)` to be recognized as a test by helm.

## Enable helm tests during operations
AOSM provides a set of configurable install and upgrade options for each component under an NF. These existing options are extended with a new `testOptions` parameter. This parameter gives the user the ability to specify `testOptions` per nfApp and as per the type of operation. The `testOptions` feature supports the following parameters:

* enable	
  * Enables or disables the helm test on a nfApp after install or upgrade completes.
  * Default value is false.
* timeout	
  * Takes a value that represents the test time-out in minutes.
  * Default value is 20 minutes.
* rollbackOnTestFailure	
  * Enables or disables component rollback on helm test failure.
  * Default value is true.
* filter	
  * Allows for a method to run only a subset of chart tests. Accepts a list of strings where each string in the list represents a test name to include.
  * Default value is no filter.

## Exposing helm test control via parameters
Users already can use the NF payload parameter `roleOverrideValues` to specify settings for `installOptions` and `upgradeOptions`. These fields are now extended to include settings for `testOptions` which can be specified for each nfApplication and each operation method. See the following example of `roleOverrideValues` usage where the NF Payload defines  `installOptions` and `upgradeOptions` including `testOptions` for a component named `application1`.

## roleOverrideValues escaped example:
Following is an escaped example `roleOverrideValues` with `testOptions` under `installOptions` and `upgradeOptions` for a component named `application1`. This example uses a `filter` to execute only tests which match the string provided.

``` 
"roleOverrideValues": [  
"{\"name\":\"application1\",\"deployParametersMappingRuleProfile\":{\"helmMappingRuleProfile\":{\"helmPackageVersion\":\"2.1.3\",\"values\":\"{\\\"roleOneParam\\\":\\\"roleOneOverrideValue\\\"}\",\"options\":{\"installOptions\":{\"atomic\":\”true\”,\"wait\":\"true\",\"timeout\":\"30m\",\”testOptions\”:{\”enable\”:\”true\”,\”timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\”filter\”:[\”test1\”,\”test2\”,\”test3\”]}},\"upgradeOptions\":{\"atomic\": \”true\”,\"wait\":\"true\",\"timeout\":\"30\", \”testOptions\”:{\”enable ”:\”true\”,\”timeout\”:\”15\”,\”rollbackOnTestFailure\”:\”true\”,\” filter \”:[\”test1\”,\”test2\”,\”test3\”]}}}}}}"]
```

## roleOverrideValues unescaped example:
Following is an unescaped example `roleOverrideValues` NF Payload with `testOptions` under `installOptions` and `upgradeOptions` for a component named `hellotest`. This example uses a `filter` to execute only those test which match the string provided.
```
"roleOverrideValues": ["{
   "name":"hellotest",
    "deployParametersMappingRuleProfile": {
      "helmMappingRuleProfile": {
       "options": {
        "installOptions": {
         "atomic":"true",
         "wait":"true",
         "timeout":"1"
        “testOptions”: {
         “enable”: “true”,
         “timeout”: “10”,
         “rollbackOnTestFailure”: “true”,
         "filter”: [“test1”, “test2”]	} },
        "upgradeOptions": {
         "atomic":"true",
         "wait":"true",
         "timeout":"2",
        “testOptions”: {
         “enable”: “true”,
         “timeout”: “10”,
         “rollbackOnTestFailure”: “true”,
         "filter”: [“test1”, “test2”] } } } } } }"
]
```

## NF payload example
Following is an example NF Payload with `testOptions` under `installOptions` and `upgradeOptions` for a component named `application1`. This example uses a `filter` to execute only those test which match the string provided.

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
