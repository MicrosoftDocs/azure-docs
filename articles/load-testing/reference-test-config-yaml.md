---
title: Load test configuration YAML
titleSuffix: Azure Load Testing
description: 'Learn how to configure a load test using a YAML file. The YAML configuration is used for setting up automated load testing in a CI/CD pipeline.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: nicktrog
author: ntrogh
ms.date: 11/11/2021
adobe-target: true
---

# Configure load tests in YAML

Learn how to configure your load test in [YAML](https://yaml.org/). You will create a YAML test configuration to add a load test to your CI/CD workflow.


## Load Test definition

A test configuration uses the following keys.

| Key | Type | Description | 
| ----- | ----- | ----- | 
| `version` | string | The version of the YAML config file used by the service. Currently the only valid value is `v0.1`. |
| `testName` | string | **Required**. Name of the test to run. The results of different test runs will be collected under this test name in the Azure portal. |
| `testPlan` | string | **Required**. The relative path to the JMeter test script to run. |
| `engineInstances` | integer | **Required**. The number of parallel test engine instances to execute the provided test plan. You can update this property to increase the amount of load that the service can generate. |
| `configurationFiles` | array | List of relevant configuration files, references from the JMeter script. By default, a wildcard *`*.csv`* is generated to reference all *.csv* files in the test plan's folder. |
| `description` | string | Short description of the load test run. |
| `failureCriteria` | object | The criteria that indicate failure of the test. Each criteria is in the form of:<BR>`[Aggregate_function] ([client_metric]) > [value]`<BR><BR>- *`[Aggregate function] ([client_metric])`*: one of `avg(response_time_ms)` or `percentage(error)`<BR>- *`value`*: integer number. |
| `secrets` | object | List of secrets that the JMeter script references. |
| `secrets.name` | string | Name of the secret. This name should match the secret name that you use in the JMeter script. |
| `secrets.value` | string | Azure Key Vault secret URI. |
| `env` | object | List of environment variables that the JMeter script references. |
| `env.name` | string | The name of the environment variable. This name should match the secret name that you use in the JMeter script. |
| `env.value` | string | The value of the environment variable. |

The following example contains the configuration for a load test:

```yaml
version: v0.1
testName: SampleTest
testPlan: SampleTest.jmx
description: Load test website home page
engineInstances: 1
configurationFiles:
  - '*.csv'
failureCriteria:
  - avg(response_time_ms) > 300
  - percentage(error) > 50
env:
  - name: my-variable
    value: my-value
secrets:
  - name: my-secret
    value: https://akv-contoso.vault.azure.net/secrets/MySecret
```

## Next steps

Learn how to build [automated regression testing in your CI/CD workflow](tutorial-cicd-azure-pipelines.md).
