---
title: Add requests to URL-based test
titleSuffix: Azure Load Testing
description: Learn how to add requests to a URL-based test in Azure Load Testing by using UI fields or cURL commands. Use variables to pass parameters to requests.
services: load-testing
ms.service: load-testing
ms.author: nicktrog
author: ntrogh
ms.date: 10/30/2023
ms.topic: how-to

#CustomerIntent: As a developer, I want to add HTTP requests to a load test in the Azure portal so that I don't have to manage a JMeter test script.
---

# Add requests to URL-based load tests in Azure Load Testing

In this article, you learn how to add HTTP requests to a URL-based load test in Azure Load Testing. Use a URL-based load test to validate HTTP endpoints, such as web applications or REST endpoints, without prior knowledge of load testing tools and scripting.

Azure supports two ways to define HTTP requests in a URL-based load test. You can combine both methods within a load test.

- Specify the HTTP endpoint details, such as the endpoint URL, HTTP method, headers, query parameters, or the request body.
- Enter a cURL command for the HTTP request.

If you have dependent requests, you can extract response values from one request and pass them as input to a subsequent request. For example, you might first retrieve the customer details, and extract the customer ID to retrieve the customer order details.

If you use a URL-based load test in your CI/CD workflow, you can pass a JSON file that contains the HTTP requests to your load test.

You can add up to five requests to a URL-based load test. For more complex load tests, you can [create a load test by uploading a JMeter test script](./how-to-create-and-run-load-test-with-jmeter-script.md). For example, when you have more than five requests, if you use non-HTTP protocols, or if you need to use JMeter plugins.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure load testing resource. To create a load testing resource, see [Create and run a load test](./quickstart-create-and-run-load-test.md#create-an-azure-load-testing-resource).

## Add requests with HTTP details

You can specify an HTTP request for a URL-based load test by providing the HTTP request details. The following table lists the fields you can configure for an HTTP request in Azure Load Testing:

| Field | Details |
|-|-|
| URL              | The HTTP endpoint URL. For example, `https://www.contoso.com/products`. |
| Method           | The HTTP method. Azure Load Testing supports GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS. |
| Query parameters | (Optional) Enter query string parameters to append to the URL. |
| HTTP headers     | (Optional) Enter HTTP headers to include in the HTTP request. You can add up to 20 headers for a request. |
| Request body     | (Optional) Depending on the HTTP method, you can specify the HTTP body content. Azure Load Testing supports the following formats: raw data, JSON view, JavaScript, HTML, and XML. |

Follow these steps to add an HTTP request to a URL-based load test:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com/), go to your load testing resource.

1. In the left navigation, select **Tests**  to view all tests.

1. In the list, select your load test, and then select **Edit**.

    Make sure to select a URL-based load test from the list and that you enabled **Enable advanced settings** on the **Basics** tab.

1. Go to the **Test plan** tab, and select **Add request**.

    :::image type="content" source="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request.png" alt-text="Screenshot that shows how to add a request to a URL-based load test in the Azure portal." lightbox="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request.png":::

1. Select **Add input in UI** to enter the HTTP request details.

1. Enter the HTTP request details, and then select **Add** to add the request to your load test.

    |Field  |Description  |
    |-|-|
    | **Request format**   | Select *Add input in UI* to configure the request details through fields in the Azure portal. |
    | **Request name**     | Enter a unique name for the request. You can refer to this request name when you define [test fail criteria](./how-to-define-test-criteria.md). |
    | **URL**              | The URL of the application endpoint. |
    | **Method**           | Select an HTTP method from the list. Azure Load Testing supports GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS. |
    | **Query parameters** | (Optional) Enter query string parameters to append to the URL. |
    | **Headers**          | (Optional) Enter HTTP headers to include in the HTTP request. |
    | **Body**             | (Optional) Depending on the HTTP method, you can also specify the HTTP body content. Azure Load Testing supports the following formats: raw data, JSON view, JavaScript, HTML, and XML. |

    :::image type="content" source="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request-details.png" alt-text="Screenshot that shows the details page to add an HTTP request by using UI fields in the Azure portal." lightbox="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request-details.png":::

1. Select **Apply** to save the load test.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

When you run your load test as part of a CI/CD workflow, such as GitHub Actions or Azure Pipelines, you provide the list of HTTP requests in a requests JSON file. In the [load test configuration YAML file](./reference-test-config-yaml.md), you reference the JSON file in the `testPlan` property.

1. Create a `requests.json` file to store the HTTP requests and paste the following code snippet in the file:

    ```json
    {
        "version": "1.0",
        "scenarios": {
            "requestGroup1": {
                "requests": [
                ],
                "csvDataSetConfigList": []
            }
        },
        "testSetup": [
            {
                "virtualUsersPerEngine": 50,
                "durationInSeconds": 300,
                "loadType": "Linear",
                "scenario": "requestGroup1",
                "rampUpTimeInSeconds": 60
            }
        ]
    }
    ```

    Optionally, configure the load settings in the `testSetup` property. Learn more about [configuring load parameters for URL-based load tests](./how-to-high-scale-load.md#configure-load-parameters-for-url-based-tests).

1. Add the HTTP request details in the `requests` property:

    The following code snippet shows an example of an HTTP POST request. Notice that the `requestType` is `URL`.

    ```json
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
        "endpoint": "http://www.contoso.com/orders",
        "headers": {
            "api-token": "my-token"
        },
        "body": "{\r\n  \"customer\": \"Contoso\",\r\n  \"items\": {\r\n\t  \"product_id\": 321,\r\n\t  \"count\": 50,\r\n\t  \"amount\": 245.95\r\n  }\r\n}",
        "method": "POST",
        "requestBodyFormat": "JSON"
    },
    ```

1. Update the load test configuration YAML file and set the `testType` and `testPlan` settings:

    Make sure to set the `testType` property to `URL` to indicate that you're running a URL-based load test.

    The `testPlan` property references the requests JSON file you created in the previous step.

    The following code snippet shows a fragment of an example load test configuration file:

    ```yml
    displayName: my-first-load-test
    testPlan: requests.json
    description: Web application front-end
    engineInstances: 1
    testId: my-first-load-test
    testType: URL
    splitAllCSVs: False
    failureCriteria: []
    autoStop:
      errorPercentage: 90
      timeWindow: 60
    ```

1. Save both files and commit them to your source control repository.

---

## Add requests using cURL

Instead of providing the HTTP request details, you can also provide cURL commands for the HTTP requests in your URL-based load test. [cURL](https://curl.se/) is a command-line tool and library for URL-based requests.

Follow these steps to add an HTTP request to a load test by using a cURL command.

# [Azure portal](#tab/portal)

1. In the list of tests, select your load test, and then select **Edit**.

    Make sure to select a URL-based load test from the list and that you enabled **Enable advanced settings** on the **Basics** tab.

1. Go to the **Test plan** tab, and select **Add request**.

1. Select **Add cURL command** to create an HTTP request by using cURL.

1. Enter the cURL command in the **cURL command** field, and then select **Add** to add the request to your load test.

    The following example uses cURL to perform an HTTP GET request, specifying an HTTP header:

    ```bash
    curl --request GET 'http://www.contoso.com/customers?version=1' --header 'api-token: my-token'
    ```

    :::image type="content" source="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request-curl.png" alt-text="Screenshot that shows the details page to add an HTTP request by using a cURL command in the Azure portal." lightbox="./media/how-to-add-requests-to-url-based-test/url-load-test-add-request-curl.png":::

1. Select **Apply** to save the load test.

# [Azure Pipelines / GitHub Actions](#tab/pipelines+github)

When you run your load test as part of a CI/CD workflow, such as GitHub Actions or Azure Pipelines, you provide the list of HTTP requests in a requests JSON file. In the [load test configuration YAML file](./reference-test-config-yaml.md), you reference the JSON file in the `testPlan` property.

1. Create a JSON file to store the HTTP requests and paste the following code snippet in the file:

    ```json
    {
        "version": "1.0",
        "scenarios": {
            "requestGroup1": {
                "requests": [
                ],
                "csvDataSetConfigList": []
            }
        },
        "testSetup": [
            {
                "virtualUsersPerEngine": 50,
                "durationInSeconds": 300,
                "loadType": "Linear",
                "scenario": "requestGroup1",
                "rampUpTimeInSeconds": 60
            }
        ]
    }
    ```

    Optionally, configure the load settings in the `testSetup` property. Learn more about [configuring load parameters for URL-based load tests](./how-to-high-scale-load.md#configure-load-parameters-for-url-based-tests).

1. Add a cURL command in the `requests` property:

    The following code snippet shows an example of an HTTP POST request. Notice that the `requestType` is `CURL`.

    ```json
    {
        "requestName": "get-customers",
        "responseVariables": [],
        "requestType": "CURL",
        "curlCommand": "curl --request GET 'http://www.contoso.com/customers?version=1' --header 'api-token: my-token'"
    },
    ```

1. Set the `testType` and `testPlan` settings in the load test configuration YAML file to reference the requests JSON file:

    Make sure to set the `testType` property to `URL` to indicate that you're running a URL-based load test.

    The `testPlan` property references the requests JSON file you created in the previous step.

    The following code snippet shows a fragment of an example load test configuration file:

    ```yml
    displayName: my-first-load-test
    testPlan: requests.json
    description: Web application front-end
    engineInstances: 1
    testId: my-first-load-test
    testType: URL
    splitAllCSVs: False
    failureCriteria: []
    autoStop:
      errorPercentage: 90
      timeWindow: 60
    ```

1. Save both files and commit them to your source control repository.

---

## Use variables in HTTP requests

You can use variables in your HTTP request to make your tests more flexible, or to avoid including secrets in your test plan. For example, you could use an environment variable with the domain name of your endpoint and then use variable name in the individual HTTP requests. The use of variables makes your test plan more flexible and maintainable.

With URL-based load tests in Azure Load Testing, you can use variables to refer to the following information:

- Environment variables: you can [configure environment variables](./how-to-parameterize-load-tests.md) for the load test
- Secrets: [configure Azure Key Vault secrets in your load test](./how-to-parameterize-load-tests.md)
- Values from a CSV input file: use variables for the columns in a [CSV input file](./how-to-read-csv-data.md) and run a request for each row in the file
- Response variables: extract values from a previous HTTP request

The syntax for referring to a variable in a request is: `${variable-name}`. 

The following screenshot shows how to refer to a `token` variable in an HTTP header by using `${token}`.

:::image type="content" source="./media/how-to-add-requests-to-url-based-test/url-load-test-request-variables.png" alt-text="Screenshot that shows the request details page in the Azure portal, highlighting a variable reference in an HTTP header." lightbox="./media/how-to-add-requests-to-url-based-test/url-load-test-request-variables.png":::

> [!NOTE]
> If you specify certificates, Azure Load Testing automatically passes the certificates in each HTTP request.

### Use response variables for dependent requests

To create HTTP requests that depent on a previous request, you can use response variables. For example, in the first request you might retrieve a list of items from an API, extract the ID from the first result, and then make a subsequent and pass this ID as a query string parameter.

Azure Load Testing supports the following options to extract values from an HTTP request and store them in a variable:

- JSONPath
- XPath
- Regular expression

For example, the following example shows how to use an XPathExtractor to store the body of a request in the `token` response variable. You can then use `${token}` in other HTTP requests to refer to this value.

```json
"responseVariables": [
    {
        "extractorType": "XPathExtractor",
        "expression": "/note/body",
        "variableName": "token"
    }
]
```

## Related content

- [Configure a load test with environment variables and secrets](./how-to-parameterize-load-tests.md)
- [Read data from an input CSV file](./how-to-read-csv-data.md)
- [Load test configuration YAML reference](./reference-test-config-yaml.md)
