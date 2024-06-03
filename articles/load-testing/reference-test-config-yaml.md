---
title: Load test configuration YAML
titleSuffix: Azure Load Testing
description: 'Learn how to configure a load test by using a YAML file. The YAML configuration is used for setting up automated load testing in a CI/CD pipeline.'
services: load-testing
ms.service: load-testing
ms.topic: reference
ms.author: ninallam
author: ninallam
ms.date: 12/06/2023
adobe-target: true
---

# Configure a load test in YAML

Learn how to configure your load test in Azure Load Testing by using [YAML](https://yaml.org/). You use the test configuration YAML file to create and run load tests from your continuous integration and continuous delivery (CI/CD) workflow.

## Load test YAML syntax

A load test configuration uses the following keys:

| Key | Type | Required | Default value | Description | 
| ----- | ----- | ----- | ----- | ---- |
| `version` | string | Y |  | Load test specification version. The only supported value is `v0.1`. |
| `testId` | string | Y |  | Unique identifier of the load test. The value must be between 2 and 50 characters ([a-z0-9_-]). For an existing test, you can get the `testId` from the test details page in the Azure portal. |
| `testName` | string | N |  | **Deprecated**. Unique identifier of the load test. This setting is replaced by `testId`. You can still run existing tests with the `testName` field. |
| `displayName` | string | N |  | Display name of the test. This value is shown in the list of tests in the Azure portal. If not provided, `testId` is used as the display name. |
| `description` | string | N |  | Short description of the test. The value has a maximum length of 100 characters. |
| `testType` | string | Y | | Test type. Possible values:<br/><ul><li>`URL`: URL-based load test</li><li>`JMX`: JMeter-based load test</li></ul> |
| `testPlan` | string | Y |  | Reference to the test plan file.<br/><ul><li>If `testType: JMX`: relative path to the JMeter test script.</li><li>If `testType: URL`: relative path to the [requests JSON file](./how-to-add-requests-to-url-based-test.md).</li></ul> |
| `engineInstances` | integer | Y |  | Number of parallel test engine instances for running the test plan. Learn more about [configuring high-scale load](./how-to-high-scale-load.md). |
| `configurationFiles` | array of string | N |  | List of external files, required by the test script. For example, CSV data files, images, or any other data file.<br/>Azure Load Testing uploads all files in the same folder as the test script. In the JMeter script, only refer to external files using the file name, and remove any file path information. |
| `failureCriteria` | object | N |  | List of load test fail criteria. See [failureCriteria](#failurecriteria-configuration) for more details. |
| `autoStop` | string or object | N |  | Automatically stop the load test when the error percentage exceeds a value.<br/>Possible values:<br/>- `disable`: don't stop a load test automatically.<br/>- *object*: see [autostop](#autostop-configuration) configuration for more details. |
| `properties` | object | N |  | JMeter user property file references. See [properties](#properties-configuration) for more details. |
| `zipArtifacts` | array of string| N |  | Specifies the list of zip artifact files. For files other than JMeter scripts and user properties, if the file size exceeds 50 MB, compress them into a ZIP file. Ensure that the ZIP file remains below 50 MB in size. Only 5 ZIP artifacts are allowed with a maximum of 1000 files in each and uncompressed size of 1 GB. Only applies when `testType: JMX`. |
| `splitAllCSVs` | boolean | N | False | Split the input CSV files evenly across all test engine instances. For more information, see [Read a CSV file in load tests](./how-to-read-csv-data.md#split-csv-input-data-across-test-engines). |
| `secrets` | object | N |  | List of secrets that the Apache JMeter script references. See [secrets](#secrets-configuration) for more details. |
| `env` | object | N |  | List of environment variables that the Apache JMeter script references. See [environment variables](#env-configuration) for more details. |
| `certificates` | object | N |  | List of client certificates for authenticating with application endpoints in the JMeter script. See [certificates](#certificates-configuration) for more details.|
| `keyVaultReferenceIdentity` | string | N |  | Resource ID of the user-assigned managed identity for accessing the secrets from your Azure Key Vault. If you use a system-managed identity, this information isn't needed. Make sure to grant this user-assigned identity access to your Azure key vault. Learn more about [managed identities in Azure Load Testing](./how-to-use-a-managed-identity.md). |
| `subnetId` | string | N |  | Resource ID of the virtual network subnet for testing privately hosted endpoints. This subnet hosts the injected test engine VMs. For more information, see [how to load test privately hosted endpoints](./how-to-test-private-endpoint.md). |
| `publicIPDisabled` | boolean | N |  | Disable the deployment of a public IP address, load balancer, and network security group while testing a private endpoint. For more information, see [how to load test privately hosted endpoints](./how-to-test-private-endpoint.md). |

### Load test configuration sample

The following YAML snippet contains an example load test configuration.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
subnetId: /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/sample-rg/providers/Microsoft.Network/virtualNetworks/load-testing-vnet/subnets/load-testing
configurationFiles:
  - 'sampledata.csv'
zipArtifacts:
   - bigdata.zip
splitAllCSVs: True
failureCriteria:
  - avg(response_time_ms) > 300
  - percentage(error) > 50
  - GetCustomerDetails: avg(latency) >200
autoStop:
  errorPercentage: 80
  timeWindow: 60
secrets:
  - name: my-secret
    value: https://akv-contoso.vault.azure.net/secrets/MySecret/abc1234567890def12345
keyVaultReferenceIdentity: /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/sample-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/sample-identity
```

### `failureCriteria` configuration

Test fail criteria enable you to define conditions to determine if a load test run was successful or not. If one or more fail criteria are met, the test gets a failed test result. Learn more about [using load test fail criteria](./how-to-define-test-criteria.md).

You can define fail criteria that apply to the entire load test, or that apply to a specific request. Fail criteria have the following structure:

- Test criteria at the load test level: `Aggregate_function (client_metric) condition threshold`.
- Test criteria applied to specific JMeter requests: `Request: Aggregate_function (client_metric) condition threshold`.

#### Supported client metrics

Azure Load Testing supports the following client metrics:

|Metric  |Aggregate function  |Threshold  |Condition  | Description |
|---------|---------|---------|---------|-------------|
|`response_time_ms`     |  `avg` (average)<BR> `min` (minimum)<BR> `max` (maximum)<BR> `pxx` (percentile), xx can be 50, 75, 90, 95, 96, 97, 98, 99, 999 and 9999    | Integer value, representing number of milliseconds (ms).     |   `>` (greater than)<BR> `<` (less than)      | Response time or elapsed time, in milliseconds. Learn more about [elapsed time in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html). |
|`latency`     |  `avg` (average)<BR> `min` (minimum)<BR> `max` (maximum)<BR> `pxx` (percentile), xx can be 50, 90, 95, 99     | Integer value, representing number of milliseconds (ms).     |   `>` (greater than)<BR> `<` (less than)      | Latency, in milliseconds. Learn more about [latency in the Apache JMeter documentation](https://jmeter.apache.org/usermanual/glossary.html). |
|`error`     |  `percentage`       | Numerical value in the range 0-100, representing a percentage.      |   `>` (greater than)      | Percentage of failed requests. |
|`requests_per_sec`     |  `avg` (average)       | Numerical value with up to two decimal places.      |   `>` (greater than) <BR> `<` (less than)     | Number of requests per second. |
|`requests`     |  `count`       | Integer value.      |   `>` (greater than) <BR> `<` (less than)     | Total number of requests. |

#### Fail criteria configuration sample

The following code snippet shows a load test configuration, which has three load test fail criteria.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
failureCriteria:
  - avg(response_time_ms) > 300
  - percentage(error) > 50
  - GetCustomerDetails: avg(latency) >200
```

### `autoStop` configuration

The load test autostop functionality enables you to automatically stop a load test when the error percentage exceeds a specific threshold during a given time window. Learn more about the [load test autostop functionality](./how-to-define-test-criteria.md#auto-stop-configuration).

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `errorPercentage` | integer | 90 | Threshold for the error percentage, during the `timeWindow`. If the error percentage exceeds this percentage during any given time window, the test run stops automatically. |
| `timeWindow` | integer | 60 | Time window in seconds for calculating the `errorPercentage`. |

#### Autostop configuration sample

The following code snippet shows a load test configuration, which has three load test fail criteria.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
autoStop:
  errorPercentage: 80
  timeWindow: 60
```

### `properties` configuration

You can specify a JMeter user properties file for your load test. The user properties file is uploaded alongside the test plan and other files. Learn more about [using JMeter user properties in Azure Load Testing](./how-to-configure-user-properties.md).

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `userPropertyFile` | string |  | File to use as an Apache JMeter [user properties file](https://jmeter.apache.org/usermanual/test_plan.html#properties). The file is uploaded to the Azure Load Testing resource alongside the JMeter test script and other configuration files. If the file is in a subfolder on your local machine, use a path relative to the location of the test script. |

#### User property file configuration sample

The following code snippet shows a load test configuration, which specifies a user properties file.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
properties:
  userPropertyFile: 'user.properties'
```

### `secrets` configuration

You can store secret values in Azure Key Vault and reference them in your test plan. Learn more about [using secrets with Azure Load Testing](./how-to-parameterize-load-tests.md).

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `name` | string |  | Name of the secret. This name should match the secret name that you use in the test plan requests. |
| `value` | string |  | URI (secret identifier) for the Azure Key Vault secret. |

#### Secrets configuration sample

The following code snippet shows a load test configuration, which references a secret `my-secret` in Azure Key Vault.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
secrets:
  - name: my-secret
    value: https://akv-contoso.vault.azure.net/secrets/MySecret/abc1234567890def12345
```

### `env` configuration

You can specify environment variables and reference them in your test plan. Learn more about [using environment variables with Azure Load Testing](./how-to-parameterize-load-tests.md).

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `name` | string |  | Name of the environment variable. This name should match the variable name that you use in the test plan requests. |
| `value` | string |  | Value of the environment variable. |

#### Environment variable configuration sample

The following code snippet shows a load test configuration, which specifies an environment variable `my-variable` and value `my-value`.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
env:
  - name: my-variable
    value: my-value
```

### `certificates` configuration

You can pass client certificates to your load test. The certificate is stored in Azure Key Vault. Learn more about [using client certificates with Azure Load Testing](./how-to-test-secured-endpoints.md#authenticate-with-client-certificates).

| Key | Type | Default value | Description | 
| ----- | ----- | ----- | ---- |
| `name` | string |  | Name of the certificate. |
| `value` | string |  | URI (secret identifier) for the certificate in Azure Key Vault. |

#### Certificate configuration sample

The following code snippet shows a load test configuration, which references a client certificate in Azure Key Vault.

```yaml
version: v0.1
testId: SampleTest
displayName: Sample Test
description: Load test website home page
testPlan: SampleTest.jmx
testType: JMX
engineInstances: 1
certificates:
  - name: my-certificate
    value: https://akv-contoso.vault.azure.net/certificates/MyCertificate/abc1234567890def12345
```

## Requests JSON file

If you use a URL-based test, you can specify the HTTP requests in a JSON file instead of using a JMeter test script. Make sure to set the `testType` to `URL` in the test configuration YAML file and reference the requests JSON file.

### HTTP requests

The requests JSON file uses the following properties for defining requests in the `requests` property:

| Property | Type | Description | 
| ----- | ----- | ----- |
| `requestName` | string | Unique request name. You can reference the request name when you [configure test fail criteria](./how-to-define-test-criteria.md). |
| `responseVariables` | array | List of response variables. Use response variables to extract a value from the request and reference it in a subsequent request. Learn more about [response variables](./how-to-add-requests-to-url-based-test.md#use-response-variables-for-dependent-requests). |
| `responseVariables.extractorType` | string | Mechanism to extract a value from the response output. Supported values are `XPathExtractor`, `JSONExtractor`, and `RegularExpression`. |
| `responseVariables.expression` | string | Expression to retrieve the response output. The expression depends on the extractor type value. |
| `responseVariables.variableName` | string | Unique response variable name. You can reference this variable in a subsequent request by using the `{$variable-name}` syntax. |
| `queryParameters` | array | List of query string parameters to pass to the endpoint. |
| `queryParameters.key` | string | Query string parameter name. |
| `queryParameters.value` | string | Query string parameter value. |
| `requestType` | string | Type of request. Supported values are: `URL` or `CURL`. |
| `endpoint` | string |  URL of the application endpoint to test. |
| `headers` | array |  List of HTTP headers to pass to the application endpoint. Specify a key-value pair for each header. |
| `body` | string |  Body text for the HTTP request. You can use the `requestBodyFormat` to specify the format of the body content. |
| `requestBodyFormat` | string | Format of the body content. Supported values are: `Text`, `JSON`, `JavaScript`, `HTML`, and `XML`. |
| `method` | string |  HTTP method to invoke the endpoint. Supported values are: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, and `OPTIONS`. |
| `curlCommand` | string | cURL command to run. Requires that the `requestType` is `CURL`. |

The following JSON snippet contains an example requests JSON file:

```json
{
    "version": "1.0",
    "scenarios": {
        "requestGroup1": {
            "requests": [
                {
                    "requestName": "add",
                    "responseVariables": [],
                    "queryParameters": [
                        {
                            "key": "param1",
                            "value": "value1"
                        }
                    ],
                    "requestType": "URL",
                    "endpoint": "https://www.contoso.com/orders",
                    "headers": {
                        "api-token": "my-token"
                    },
                    "body": "{\r\n  \"customer\": \"Contoso\",\r\n  \"items\": {\r\n\t  \"product_id\": 321,\r\n\t  \"count\": 50,\r\n\t  \"amount\": 245.95\r\n  }\r\n}",
                    "method": "POST",
                    "requestBodyFormat": "JSON"
                },
                {
                    "requestName": "get",
                    "responseVariables": [],
                    "requestType": "CURL",
                    "curlCommand": "curl --request GET 'https://www.contoso.com/orders'"
                },
            ],
            "csvDataSetConfigList": []
        }
    },
    "testSetup": [
        {
            "virtualUsersPerEngine": 1,
            "durationInSeconds": 600,
            "loadType": "Linear",
            "scenario": "requestGroup1",
            "rampUpTimeInSeconds": 30
        }
    ]
}
```

### Load configuration

The requests JSON file uses the following properties for defining the load configuration in the `testSetup` property:

| Property | Type | Load type | Description | 
| ----- | ----- | ----- | ----- |
| `loadType` | string | | Load pattern type. Supported values are: `linear`, `step`, and `spike`. |
| `scenario` | string | | Reference to the request group, specified in the `scenarios` property. |
| `virtualUsersPerEngine` | integer | All | Number of virtual users per test engine instance. |
| `durationInSeconds` | integer | All | Total duration of the load test in seconds. |
| `rampUpTimeInSeconds` | integer| Linear, Step | Duration in seconds to ramp up to the target number of virtual users. |
| `rampUpSteps` | integer | Step | The number of steps to reach the target number of virtual users. |
| `spikeMultiplier` | integer | Spike | The factor to multiply the number of target users with during the spike duration. |
| `spikeHoldTimeInSeconds` | integer | Spike | Total duration in seconds to maintain the spike load. |

## Related content

- Learn how to build [automated regression testing in your CI/CD workflow](./quickstart-add-load-test-cicd.md).
- Learn how to [parameterize load tests with secrets and environment variables](./how-to-parameterize-load-tests.md).
- Learn how to [load test secured endpoints](./how-to-test-secured-endpoints.md).
