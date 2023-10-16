---
title: Load test configuration YAML
titleSuffix: Azure Load Testing
description: 'Learn how to configure a load test by using a YAML file. The YAML configuration is used for setting up automated load testing in a CI/CD pipeline.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 05/08/2023
adobe-target: true
---

# Configure a load test in YAML

Learn how to configure your load test in Azure Load Testing by using [YAML](https://yaml.org/). You use the test configuration YAML file to create and run load tests from your continuous integration and continuous delivery (CI/CD) workflow.

## Load test definition

A test configuration uses the following keys:

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `version` | string |  | Version of the YAML configuration file that the service uses. Currently, the only valid value is `v0.1`. |
| `testId` | string |  | *Required*. Id of the test to run. testId must be between 2 to 50 characters. For a new test, enter an Id with characters [a-z0-9_-]. For an existing test, you can get the test Id from the test details page in Azure portal. This field was called `testName` earlier, which has been deprecated. You can still run existing tests with `testName`field. |
| `displayName` | string |  | Display name of the test. This will be shown in the list of tests in Azure portal. If not provided, testId is used as the display name. |
| `testPlan` | string |  | *Required*. Relative path to the Apache JMeter test script to run. |
| `engineInstances` | integer |  | *Required*. Number of parallel instances of the test engine to execute the provided test plan. You can update this property to increase the amount of load that the service can generate. |
| `configurationFiles` | array |  | List of relevant configuration files or other files that you reference in the Apache JMeter script. For example, a CSV data set file, images, or any other data file. These files will be uploaded to the Azure Load Testing resource alongside the test script. If the files are in a subfolder on your local machine, use file paths that are relative to the location of the test script. <BR><BR>Azure Load Testing currently doesn't support the use of file paths in the JMX file. When you reference an external file in the test script, make sure to only specify the file name. |
| `description` | string |  | Short description of the test. description must have a maximum length of 100 characters |
| `subnetId` | string |  | Resource ID of the subnet for testing privately hosted endpoints (VNET injection). This subnet will host the injected test engine VMs. For more information, see [how to load test privately hosted endpoints](./how-to-test-private-endpoint.md). |
| `failureCriteria` | object |  | Criteria that indicate when a test should fail. The structure of a fail criterion is: `Request: Aggregate_function (client_metric) condition threshold`. For more information on the supported values, see [Define load test fail criteria](./how-to-define-test-criteria.md#load-test-fail-criteria). |
| `autoStop` | object |  | Enable or disable the auto-stop functionality when the error percentage passes a given threshold. For more information, see [Configure auto stop for a load test](./how-to-define-test-criteria.md#auto-stop-configuration).<br/><br/>Values:<br/>- *disable*: don't stop a load test automatically.<br/>- Empty value: auto stop is enabled. Provide the *errorPercentage* and *timeWindow* values. |
| `autoStop.errorPercentage` | integer | 90 | Threshold for the error percentage, during the *autoStop.timeWindow*. If the error percentage exceeds this percentage during any given time window, the load test run stops automatically. |
| `autoStop.timeWindow` | integer | 60 | Time window in seconds for calculating the *autoStop.errorPercentage*. |
| `properties` | object |  | List of properties to configure the load test. |
| `properties.userPropertyFile` | string |  | File to use as an Apache JMeter [user properties file](https://jmeter.apache.org/usermanual/test_plan.html#properties). The file will be uploaded to the Azure Load Testing resource alongside the JMeter test script and other configuration files. If the file is in a subfolder on your local machine, use a path relative to the location of the test script. |
| `splitAllCSVs` | boolean | False | Split the input CSV files evenly across all test engine instances. For more information, see [Read a CSV file in load tests](./how-to-read-csv-data.md#split-csv-input-data-across-test-engines). |
| `secrets` | object |  | List of secrets that the Apache JMeter script references. |
| `secrets.name` | string |  | Name of the secret. This name should match the secret name that you use in the Apache JMeter script. |
| `secrets.value` | string |  | URI (secret identifier) for the Azure Key Vault secret. |
| `env` | object |  | List of environment variables that the Apache JMeter script references. |
| `env.name` | string |  | Name of the environment variable. This name should match the secret name that you use in the Apache JMeter script. |
| `env.value` | string |  | Value of the environment variable. |
| `certificates` | object |  | List of client certificates for authenticating with application endpoints in the JMeter script. |
| `certificates.name` | string |  | Name of the certificate. |
| `certificates.value` | string |  | URI (secret identifier) for the certificate in Azure Key Vault. |
| `keyVaultReferenceIdentity` | string |  | Resource ID of the user-assigned managed identity for accessing the secrets from your Azure Key Vault. If you use a system-managed identity, this information isn't needed. Make sure to grant this user-assigned identity access to your Azure key vault. |

The following YAML snippet contains an example load test configuration:

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
testPlan: SampleTest.jmx
description: Load test website home page
engineInstances: 1
subnetId: /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/sample-rg/providers/Microsoft.Network/virtualNetworks/load-testing-vnet/subnets/load-testing
properties:
  userPropertyFile: 'user.properties'
configurationFiles:
  - 'SampleData.csv'
failureCriteria:
  - avg(response_time_ms) > 300
  - percentage(error) > 50
  - GetCustomerDetails: avg(latency) >200
autoStop:
  errorPercentage: 80
  timeWindow: 60
splitAllCSVs: True
env:
  - name: my-variable
    value: my-value
secrets:
  - name: my-secret
    value: https://akv-contoso.vault.azure.net/secrets/MySecret/abc1234567890def12345
certificates:
  - name: my-certificate
    value: https://akv-contoso.vault.azure.net/certificates/MyCertificate/abc1234567890def12345
keyVaultReferenceIdentity: /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/sample-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/sample-identity
```

## Next steps

- Learn how to build [automated regression testing in your CI/CD workflow](./tutorial-identify-performance-regression-with-cicd.md).
- Learn how to [parameterize load tests with secrets and environment variables](./how-to-parameterize-load-tests.md).
- Learn how to [load test secured endpoints](./how-to-test-secured-endpoints.md).
