---
title: Import Amazon Bedrock Passthrough API - Azure API Management
description: How to import an Amazon Bedrock language model as a REST API in Azure API Management.
ms.service: azure-api-management
author: dlepow
ms.author: danlep
ms.topic: how-to
ms.date: 07/03/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.custom: template-how-to, build-2024
---

# Import an Amazon Bedrock passthrough language model API 

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In this article, you import an Amazon Bedrock passthrough language model API into your API Management instance. This is an example of a model that's hosted on an inference provider other than Azure AI services. Use AI gateway policies and other capabilities in API Management to simplify integration, improve observability, and enhance control over the model endpoints.

Learn more about managing AI APIs in API Management:

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)
* [Import a language model API](openai-compatible-llm-api.md)

Learn more about Amazon Bedrock:

* [What is Amazon Bedrock?](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)


## Prerequisites

- An existing API Management instance. [Create one if you haven't already](get-started-create-service-instance.md).
- An Amazon Web Services (AWS) account with access to Amazon Bedrock, and access to an Amazon Bedrock foundation model. [Learn more](https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started-console.html)


<!--
Outline from Andrei:
1) Passtrough API (not auth configuration, even URL is not used, but should be setup in the UI anyway)
2) Named values for aws access key and secret key
 
3) policy for signing on API level that uses secret and access keys
 
4) do a couple of modification to the code (.NET SDK sample Ethan also shared in the same threaed)
-->

## Create IAM user access keys

To authenticate your API Management instance to Amazon API Gateway, you need access keys for an AWS IAM user. 

To generate the required access key ID and secret key using the AWS Management Console, see [Create an access key for yourself](https://docs.aws.amazon.com/IAM/latest/UserGuide/access-key-self-managed.html#Using_CreateAccessKey) in the AWS documentation. 

Save your access keys in a safe location. You'll store them as named values in the next step.

> [!CAUTION]
> Access keys are long-term credentials, and you should manage them as securely as you would a password. Learn more about [securing access keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/securing_access-keys.html)

## Store IAM user access keys as named values

Securely store the two IAM user access keys as secret [named values](api-management-howto-properties) in your Azure API Management instance using the configuration recommended in the following table. 


| AWS secret | Name | Secret value | 
|------------|----------------|------|--------------|
| Access key | *accesskey* | Access key ID retrieved from AWS |
| Secret access key  | *secretkey* | Secret access key retrieved from AWS |

## Import a passthrough language model API using the portal


To import an Amazon Bedrock language model API to API Management:

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs** > **+ Add API**.
1. Under **Define a new API**, select **Language Model API**.

    :::image type="content" source="media/openai-compatible-llm-api/openai-api.png" alt-text="Screenshot of creating a passthrough language model API in the portal." :::

1. On the **Configure API** tab:
    1. Enter a **Display name** and optional **Description** for the API.
    1. Enter the following **URL** to the default Amazon Bedrock endpoint: `https://bedrock-runtime.<aws-region>.amazonaws.com`.

        Example: `https://bedrock-runtime.us-east-1.amazonaws.com`
    1. Optionally select one or more **Products** to associate with the API.  
    1. In **Path**, append a path that your API Management instance uses to access the LLM API endpoints.
    1. In **Type**, select **Create a passthrough API**.
    1. Leave values in **Access key** blank. 

    :::image type="content" source="media/openai-compatible-llm-api/configure-api.png" alt-text="Screenshot of language model API configuration in the portal.":::

1. On the remaining tabs, optionally configure policies to manage token consumption, semantic caching, and AI content safety. For details, see [Import an OpenAI-compatible language model API](openai-compatible-llm-api.md).
1. Select **Review**.
1. After settings are validated, select **Create**. 


API Management creates the API and (optionally) policies to help you monitor and manage the API. 

## Configure policies to authenticate requests to the Amazon Bedrock API

Configure API Management policies at the level of the API that you imported to sign requests to the Amazon Bedrock API. 

The following example uses the *accesskey* and *secretkey* named values you created earlier for the AWS access key and secret key. Set the `region` variable to the appropriate values for your Amazon Bedrock API. The example uses `us-east-1` for the region.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **APIs**, select **APIs**.    
1. Select the API that you created in the previous step.
1. In the left menu, under **Design**, select **All operations**.
1. Select the **Inbound processing** tab.
1. In the **Inbound processing** policy editor, select **</>** to open the policy editor.
1. Configure the following policies:

    ```xml
    <policies>
    <inbound>
        <base />
        <set-variable name="now" value="@(DateTime.UtcNow)" />
        <set-header name="X-Amz-Date" exists-action="override">
            <value>@(((DateTime)context.Variables["now"]).ToString("yyyyMMddTHHmmssZ"))</value>
        </set-header>
        <set-header name="X-Amz-Content-Sha256" exists-action="override">
            <value>@{
                var body = context.Request.Body.As<string>(preserveContent: true);
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(body));
                    return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                }
            }</value>
        </set-header>
        <set-header name="Authorization" exists-action="override">
            <value>@{
                var accessKey = "{{accesskey}}";
                var secretKey = "{{secretkey}}";
                var region = "us-east-1";
                var service = "bedrock";

                var method = context.Request.Method;
                var uri = context.Request.Url;
                var host = uri.Host;

                // create canonical path
                var path = uri.Path;
                var modelSplit = path.Split(new[] { "model/" }, 2, StringSplitOptions.None);
                var afterModel = modelSplit.Length > 1 ? modelSplit[1] : "";
                var parts = afterModel.Split(new[] { '/' }, 2);
                var model = System.Uri.EscapeDataString(parts[0]);
                var remainder = parts.Length > 1 ? parts[1] : "";
                var canonicalPath = $"/model/{model}/{remainder}";

                var amzDate = ((DateTime)context.Variables["now"]).ToString("yyyyMMddTHHmmssZ");
                var dateStamp = ((DateTime)context.Variables["now"]).ToString("yyyyMMdd");

                // hash the payload
                var body = context.Request.Body.As<string>(preserveContent: true);
                string hashedPayload;
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(body));
                    hashedPayload = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                }

                // create canonical query string
                var queryDict = context.Request.Url.Query;
                var canonicalQueryString = "";
                if (queryDict != null && queryDict.Count > 0)
                {
                    var encodedParams = new List<string>();
                    foreach (var kvp in queryDict)
                    {
                        var encodedKey = System.Uri.EscapeDataString(kvp.Key);
                        var encodedValue = System.Uri.EscapeDataString(kvp.Value.First() ?? "");
                        encodedParams.Add($"{encodedKey}={encodedValue}");
                    }
                    canonicalQueryString = string.Join("&", encodedParams.OrderBy(p => p));
                }

                // create signed headers and canonical headers
                var headers = context.Request.Headers;
                var canonicalHeaderList = new List<string[]>();

                // Add content-type if present
                var contentType = headers.GetValueOrDefault("Content-Type", "").ToLowerInvariant();
                if (!string.IsNullOrEmpty(contentType))
                {
                    canonicalHeaderList.Add(new[] { "content-type", contentType });
                }

                // Always add host
                canonicalHeaderList.Add(new[] { "host", host });

                // Add x-amz-* headers (excluding x-amz-date, x-amz-content-sha256)
                foreach (var header in headers)
                {
                    var name = header.Key.ToLowerInvariant();
                    if (string.Equals(name, "x-amz-content-sha256", StringComparison.OrdinalIgnoreCase) || 
                        string.Equals(name, "x-amz-date", StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    if (name.StartsWith("x-amz-"))
                    {
                        var value = header.Value.First()?.Trim();
                        canonicalHeaderList.Add(new[] { name, value });
                    }
                }
                canonicalHeaderList.Add(new[] { "x-amz-content-sha256", hashedPayload });
                canonicalHeaderList.Add(new[] { "x-amz-date", amzDate });
                var canonicalHeadersOrdered = canonicalHeaderList.OrderBy(h => h[0]);
                var canonicalHeaders = string.Join("\n", canonicalHeadersOrdered.Select(h => $"{h[0]}:{h[1].Trim()}")) + "\n";
                var signedHeaders = string.Join(";", canonicalHeadersOrdered.Select(h => h[0]));

                // create and hash the canonical request
                var canonicalRequest = $"{method}\n{canonicalPath}\n{canonicalQueryString}\n{canonicalHeaders}\n{signedHeaders}\n{hashedPayload}";
                string hashedCanonicalRequest = "";
                using (var sha256 = System.Security.Cryptography.SHA256.Create())
                {
                    var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(canonicalRequest));
                    hashedCanonicalRequest = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                }

                // build string to sign
                var credentialScope = $"{dateStamp}/{region}/{service}/aws4_request";
                var stringToSign = $"AWS4-HMAC-SHA256\n{amzDate}\n{credentialScope}\n{hashedCanonicalRequest}";

                // sign it using secret key
                byte[] kSecret = System.Text.Encoding.UTF8.GetBytes("AWS4" + secretKey);
                byte[] kDate, kRegion, kService, kSigning;
                using (var h1 = new System.Security.Cryptography.HMACSHA256(kSecret))
                {
                    kDate = h1.ComputeHash(System.Text.Encoding.UTF8.GetBytes(dateStamp));
                }
                using (var h2 = new System.Security.Cryptography.HMACSHA256(kDate))
                {
                    kRegion = h2.ComputeHash(System.Text.Encoding.UTF8.GetBytes(region));
                }
                using (var h3 = new System.Security.Cryptography.HMACSHA256(kRegion))
                {
                    kService = h3.ComputeHash(System.Text.Encoding.UTF8.GetBytes(service));
                }
                using (var h4 = new System.Security.Cryptography.HMACSHA256(kService))
                {
                    kSigning = h4.ComputeHash(System.Text.Encoding.UTF8.GetBytes("aws4_request"));
                }

                // auth header
                string signature;
                using (var hmac = new System.Security.Cryptography.HMACSHA256(kSigning))
                {
                    var sigBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(stringToSign));
                    signature = BitConverter.ToString(sigBytes).Replace("-", "").ToLowerInvariant();
                }

                return $"AWS4-HMAC-SHA256 Credential={accessKey}/{credentialScope}, SignedHeaders={signedHeaders}, Signature={signature}";
            }</value>
        </set-header>
        <set-header name="Host" exists-action="override">
            <value>@(context.Request.Url.Host)</value>
        </set-header>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
    </policies>
    ```
    

## Call the LLM API

To call the LLM API through API Management, you can use the AWS Bedrock SDK. This example uses the .NET SDK, but you can use any language that supports the AWS Bedrock API.

The following example uses a custom HTTP client that instantiates classes in the accompanying file `BedrockHttpClientFactory.cs`. The custom HTTP client routes requests to the API Management endpoint and includes the API Management subscription key in the request headers.

```csharp
using Amazon;
using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using Amazon.Runtime;
using BedrockClient;

// Replace with your AWS access key and secret key.
var accessKey = "<your-access-key>";
var secretKey = "<your-secret-key>";
var credentials = new BasicAWSCredentials(accessKey, secretKey);

// Create custom configuration to route requests through API Management
// apimUrl is the API Management endpoint, such as https://apim-helo-word.azure-api.net/bedrock
var apimUrl = "<api-management-endpoint">;
// Provide name and value for the API Management subscription key header.
var apimSubscriptionHeaderName = "api-key";
var apimSubscriptionKey = "<your-apim-subscription-key>";
var config = new AmazonBedrockRuntimeConfig()
{
    HttpClientFactory = new BedrockHttpClientFactory(apimUrl, apimSubscriptionHeaderName, apimSubscriptionKey),
    RegionEndpoint = RegionEndpoint.USEast1
};

var client = new AmazonBedrockRuntimeClient(credentials, config);

// Set the model ID, e.g., Claude 3 Haiku. Find the supported models in Amazon Bedrock documentation: https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html.
var modelId = "us.anthropic.claude-3-5-haiku-20241022-v1:0";

// Define the user message.
var userMessage = "Describe the purpose of a 'hello world' program in one line.";

// Create a request with the model ID, the user message, and an inference configuration.
var request = new ConverseRequest
{
    ModelId = modelId,
    Messages = new List<Message>
    {
        new Message
        {
            Role = ConversationRole.User,
            Content = new List<ContentBlock> { new ContentBlock { Text = userMessage } }
        }
    },
    InferenceConfig = new InferenceConfiguration()
    {
        MaxTokens = 512,
        Temperature = 0.5F,
        TopP = 0.9F
    }
};

try
{
    // Send the request to the Bedrock Runtime and wait for the result.
    var response = await client.ConverseAsync(request);

    // Extract and print the response text.
    string responseText = response?.Output?.Message?.Content?[0]?.Text ?? "";
    Console.WriteLine(responseText);
}
catch (AmazonBedrockRuntimeException e)
{
    Console.WriteLine($"ERROR: Can't invoke '{modelId}'. Reason: {e.Message}");
    throw;
}

```


### BedrockHttpClientFactory.cs

The following code implements classes to create a custom HTTP client that routes requests to the Bedrock API through API Management, including the necessary subscription key in the headers.

```csharp
using Amazon.Runtime;

namespace BedrockClient
{
    public class BedrockHttpClientFactory : HttpClientFactory
    {
        readonly string subscriptionKey;
        readonly string subscriptionHeaderName;
        readonly string rerouteUrl;

        public BedrockHttpClientFactory(string rerouteUrl, string subscriptionHeaderName, string subscriptionKey)
        {
            this.rerouteUrl = rerouteUrl;
            this.subscriptionHeaderName = subscriptionHeaderName;
            this.subscriptionKey = subscriptionKey;
        }

        public override HttpClient CreateHttpClient(IClientConfig clientConfig)
        {
            var handler = new RerouteHandler(rerouteUrl)
            {
                InnerHandler = new HttpClientHandler()
            };

            var httpClient = new HttpClient(handler);
            httpClient.DefaultRequestHeaders.Add(this.subscriptionHeaderName, this.subscriptionKey);
            return httpClient;
        }
    }

    public class RerouteHandler : DelegatingHandler
    {
        readonly string rerouteUrl;
        readonly string host;

        public RerouteHandler(string rerouteUrl)
        {
            this.rerouteUrl = rerouteUrl;
            this.host = rerouteUrl.Split("/")[2].Split(":")[0];
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var originalUri = request.RequestUri;
            request.RequestUri = new Uri($"{this.rerouteUrl}{originalUri.PathAndQuery}");
            request.Headers.Host = this.host;
            return base.SendAsync(request, cancellationToken);
        }
    }
}
```

## Related content

* [Generative AI gateway capabilities in Azure API Management](genai-gateway-capabilities.md)
