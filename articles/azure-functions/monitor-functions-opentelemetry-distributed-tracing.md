---
title: Monitor Azure Functions with OpenTelemetry distributed tracing
description: "Learn how to implement OpenTelemetry distributed tracing across multiple function calls in your function app. See how to monitor function calls, track performance, and gain observability into your serverless applications using Application Insights integration."
ms.date: 11/17/2025
ms.topic: tutorial
ms.custom:
  - ignite-2025
zone_pivot_groups: programming-languages-set-functions
---

# Tutorial: Monitor Azure Functions with OpenTelemetry distributed tracing

This article demonstrates OpenTelemetry support in Azure Function, which enables distributed tracing across multiple function calls by using integrated Application Insights and OpenTelemetry support. To help you get started, an Azure Developer CLI (`azd`) template is used to create your code project as well as the Azure deployment in which to run your app.  

In this tutorial, you use the `azd` tool to:

> [!div class="checklist"]
> * Initialize an OpenTelemetry-enabled project from a template.
> * Review the code that enables OpenTelemetry integration. 
> * Run and verify your OpenTelemetry-enabled app locally.
> * Create a function app and related resources in Azure.
> * Deploy your code project to the function app in Azure.
> * Verify distributed tracing in Application Insights.

The required Azure resources created by this template follow current best practices for secure and scalable function app deployments in Azure. The same `azd` command also deploys your code project to your new function app in Azure.

By default, the Flex Consumption plan follows a _pay-for-what-you-use_ billing model, which means completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell"  
> [!IMPORTANT]  
> This article currently supports only C#, Python, and TypeScript. To complete the quickstart, select one of these supported languages at the top of the article.
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Prerequisites

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

+ [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
::: zone-end  
::: zone pivot="programming-language-python"  
+ [Python 3.11 or later](https://www.python.org/downloads/)
::: zone-end  
::: zone pivot="programming-language-typescript"  
+ [Node.js 18.x or later](https://nodejs.org/)
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
## Initialize the project

Use the `azd init` command to create a local Azure Functions code project from a template that includes OpenTelemetry distributed tracing.
::: zone-end  
::: zone pivot="programming-language-python"

1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-python-azd-otel -e flexquickstart-otel
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-python-azd-otel) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name also appears in the name of the resource group you create in Azure.

::: zone-end  
::: zone pivot="programming-language-typescript"  

1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-typescript-azd-otel -e flexquickstart-otel
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-otel) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name also appears in the name of the resource group you create in Azure.  
::: zone-end  
::: zone pivot="programming-language-csharp"
1. In your local terminal or command prompt, run this `azd init` command in an empty folder:
 
    ```console
    azd init --template functions-quickstart-dotnet-azd-otel -e flexquickstart-otel
    ```

    This command pulls the project files from the [template repository](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-otel) and initializes the project in the current folder. The `-e` flag sets a name for the current environment. In `azd`, the environment maintains a unique deployment context for your app, and you can define more than one. The environment name also appears in the name of the resource group you create in Azure.  
::: zone-end  

## Review the code

The template creates a complete distributed tracing scenario with three functions that work together. Let's review the key OpenTelemetry-related aspects:

### OpenTelemetry configuration

::: zone pivot="programming-language-python,programming-language-typescript"  
The `src/otel-sample/host.json` file enables OpenTelemetry for the Functions host:

```json
{
  "version": "2.0",
  "telemetryMode": "OpenTelemetry",
  "extensions": {
    "serviceBus": {
        "maxConcurrentCalls": 10
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

The key setting `"telemetryMode": "OpenTelemetry"` enables distributed tracing across function calls.
::: zone-end  
::: zone pivot="programming-language-csharp"  
The `src/OTelSample/host.json` file enables OpenTelemetry for the Functions host:

```json
{
  "version": "2.0",
  "telemetryMode": "OpenTelemetry",
  "logging": {
    "OpenTelemetry": {
      "logLevel": {
        "Host.General": "Warning"
      }
    }
  }
}
```

The key setting `"telemetryMode": "OpenTelemetry"` enables distributed tracing across function calls.  
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
### Dependencies for OpenTelemetry
::: zone-end  
::: zone pivot="programming-language-python"  
The `src/otel-sample/requirements.txt` file includes the necessary packages for OpenTelemetry integration:

```text
azure-functions
azure-monitor-opentelemetry
requests
```

The `azure-monitor-opentelemetry` package provides the OpenTelemetry integration with Application Insights.  
::: zone-end  
::: zone pivot="programming-language-typescript"  
The `src/otel-sample/package.json` file includes the necessary packages for OpenTelemetry integration:

```json
{
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "@azure/functions-opentelemetry-instrumentation": "^0.1.0",
    "@azure/monitor-opentelemetry-exporter": "^1.0.0",
    "axios": "^1.6.0"
  }
}
```

The `@azure/functions-opentelemetry-instrumentation` and `@azure/monitor-opentelemetry-exporter` packages provide the OpenTelemetry integration with Application Insights.  
::: zone-end  
::: zone pivot="programming-language-csharp"  
The `.csproj` file includes the necessary packages for OpenTelemetry integration:

```xml
<PackageReference Include="Azure.Monitor.OpenTelemetry.Exporter" Version="1.4.0" />
<PackageReference Include="Microsoft.Azure.Functions.Worker.OpenTelemetry" Version="1.4.0" />
<PackageReference Include="OpenTelemetry.Instrumentation.Http" Version="1.10.0" />
```

These packages provide the OpenTelemetry integration with Application Insights and HTTP instrumentation for distributed tracing.  
::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
### Function implementation
::: zone-end
::: zone pivot="programming-language-python"  
The functions in `src/otel-sample/function_app.py` demonstrate a distributed tracing flow:

#### First HTTP Function

```python
@app.function_name("first_http_function")
@app.route(route="first_http_function", auth_level=func.AuthLevel.ANONYMOUS)
def first_http_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function (first) processed a request.')
    
    # Call the second function
    base_url = f"{req.url.split('/api/')[0]}/api"
    second_function_url = f"{base_url}/second_http_function"
    
    response = requests.get(second_function_url)
    second_function_result = response.text
    
    result = {
        "message": "Hello from the first function!",
        "second_function_response": second_function_result
    }
    
    return func.HttpResponse(
        json.dumps(result),
        status_code=200,
        mimetype="application/json"
    )
```

#### Second HTTP Function

```python
@app.function_name("second_http_function")
@app.route(route="second_http_function", auth_level=func.AuthLevel.ANONYMOUS)
@app.service_bus_queue_output(arg_name="outputsbmsg", queue_name="%ServiceBusQueueName%",
                              connection="ServiceBusConnection")
def second_http_function(req: func.HttpRequest, outputsbmsg: func.Out[str]) -> func.HttpResponse:
    logging.info('Python HTTP trigger function (second) processed a request.')

    message = "This is the second function responding."
    
    # Send a message to the Service Bus queue
    queue_message = "Message from second HTTP function to trigger ServiceBus queue processing"
    outputsbmsg.set(queue_message)
    logging.info('Sent message to ServiceBus queue: %s', queue_message)
    
    return func.HttpResponse(
        message,
        status_code=200
    )
```

#### Service Bus Queue Trigger

```python
@app.service_bus_queue_trigger(arg_name="azservicebus", queue_name="%ServiceBusQueueName%",
                               connection="ServiceBusConnection") 
def servicebus_queue_trigger(azservicebus: func.ServiceBusMessage):
    logging.info('Python ServiceBus Queue trigger start processing a message: %s',
                azservicebus.get_body().decode('utf-8'))
    time.sleep(5)  # Simulate processing work
    logging.info('Python ServiceBus Queue trigger end processing a message')
```

::: zone-end  
::: zone pivot="programming-language-typescript"  
The OpenTelemetry configuration is set up in `src/otel-sample/index.ts`:

```typescript
import { AzureFunctionsInstrumentation } from '@azure/functions-opentelemetry-instrumentation';
import { AzureMonitorTraceExporter, AzureMonitorLogExporter } from '@azure/monitor-opentelemetry-exporter';
import { getNodeAutoInstrumentations, getResourceDetectors } from '@opentelemetry/auto-instrumentations-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { detectResources } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';

const resource = detectResources({ detectors: getResourceDetectors() });

const tracerProvider = new NodeTracerProvider({ 
  resource, 
  spanProcessors: [new SimpleSpanProcessor(new AzureMonitorTraceExporter())] 
});
tracerProvider.register();

const loggerProvider = new LoggerProvider({
  resource,
  processors: [new SimpleLogRecordProcessor(new AzureMonitorLogExporter())],
});

registerInstrumentations({
    tracerProvider,
    loggerProvider,
    instrumentations: [getNodeAutoInstrumentations(), new AzureFunctionsInstrumentation()],
});
```

The functions are defined in the `src/otel-sample/src/functions` folder:

#### First HTTP Function

```typescript
export async function firstHttpFunction(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("TypeScript HTTP trigger function (first) processed a request.");

  try {
    // Call the second function
    const baseUrl = request.url.split("/api/")[0];
    const secondFunctionUrl = `${baseUrl}/api/second_http_function`;

    const response = await axios.get(secondFunctionUrl);
    const secondFunctionResult = response.data;

    const result = {
      message: "Hello from the first function!",
      second_function_response: secondFunctionResult,
    };

    return {
      status: 200,
      body: JSON.stringify(result),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to process request" }),
    };
  }
}
```

#### Second HTTP Function

```typescript
export async function secondHttpFunction(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("TypeScript HTTP trigger function (second) processed a request.");

  const message = "This is the second function responding.";

  // Send a message to the Service Bus queue
  const queueMessage =
    "Message from second HTTP function to trigger ServiceBus queue processing";
  
  context.extraOutputs.set(serviceBusOutput, queueMessage);
  context.log("Sent message to ServiceBus queue:", queueMessage);

  return {
    status: 200,
    body: message,
  };
}
```

#### Service Bus Queue Trigger

```typescript
export async function serviceBusQueueTrigger(
  message: unknown,
  context: InvocationContext
): Promise<void> {
  context.log("TypeScript ServiceBus Queue trigger start processing a message:", message);

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 5000));

  context.log("TypeScript ServiceBus Queue trigger end processing a message");
}
```

::: zone-end  
::: zone pivot="programming-language-csharp"  
The OpenTelemetry configuration is set up in `src/OTelSample/Program.cs`:

```csharp
using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.OpenTelemetry;
using OpenTelemetry.Trace;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeFormattedMessage = true;
    logging.IncludeScopes = true;
});

builder.Services.AddOpenTelemetry()    
    .WithTracing(tracing =>
    {
        tracing.AddHttpClientInstrumentation();
    });

builder.Services.AddOpenTelemetry().UseAzureMonitorExporter();
builder.Services.AddOpenTelemetry().UseFunctionsWorkerDefaults();

builder.Services.AddHttpClient();

builder.Build().Run();
```

The functions are defined in separate class files:

#### First HTTP Function

```csharp
public class FirstHttpTrigger
{
    private readonly ILogger<FirstHttpTrigger> _logger;
    private readonly IHttpClientFactory _httpClientFactory;

    public FirstHttpTrigger(ILogger<FirstHttpTrigger> logger, IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
    }

    [Function("first_http_function")]
    public async Task<IActionResult> Run(
         [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
    {
        _logger.LogInformation("first_http_function function processed a request.");

        var baseUrl = $"{req.Url.AbsoluteUri.Split("/api/")[0]}/api";
        var targetUri = $"{baseUrl}/second_http_function";

        var client = _httpClientFactory.CreateClient();
        var response = await client.GetAsync(targetUri);
        var content = await response.Content.ReadAsStringAsync();

        return new OkObjectResult($"Called second_http_function, status: {response.StatusCode}, content: {content}");
    }
}
```

#### Second HTTP Function

```csharp
public class SecondHttpTrigger
{
    private readonly ILogger<SecondHttpTrigger> _logger;

    public SecondHttpTrigger(ILogger<SecondHttpTrigger> logger)
    {
        _logger = logger;
    }

    [Function("second_http_function")]
    public MultiResponse Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
    {
        _logger.LogInformation("second_http_function function processed a request.");

        return new MultiResponse
        {
            Messages = new string[] { "Hello" },
            HttpResponse = req.CreateResponse(System.Net.HttpStatusCode.OK)
        };
    }
}

public class MultiResponse
{
    [ServiceBusOutput("%ServiceBusQueueName%", Connection = "ServiceBusConnection")]
    public string[]? Messages { get; set; }

    [HttpResult]
    public HttpResponseData? HttpResponse { get; set; }
}
```

#### Service Bus Queue Trigger

```csharp
public class ServiceBusQueueTrigger
{
    private readonly ILogger<ServiceBusQueueTrigger> _logger;

    public ServiceBusQueueTrigger(ILogger<ServiceBusQueueTrigger> logger)
    {
        _logger = logger;
    }

    [Function("servicebus_queue_trigger")]
    public async Task Run(
        [ServiceBusTrigger("%ServiceBusQueueName%", Connection = "ServiceBusConnection")]
        ServiceBusReceivedMessage message,
        ServiceBusMessageActions messageActions)
    {
        _logger.LogInformation("Message ID: {id}", message.MessageId);
        _logger.LogInformation("Message Body: {body}", message.Body);

        // Complete the message
        await messageActions.CompleteMessageAsync(message);
    }
}
```

::: zone-end
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
### Distributed tracing flow

This architecture creates a complete distributed tracing scenario, with this behavior:

1. **First HTTP function** receives an HTTP request and calls the second HTTP function
1. **Second HTTP function** responds and sends a message to Service Bus
1. **Service Bus trigger** processes the message with a delay to simulate processing work

Key aspects of the OpenTelemetry implementation:
::: zone-end
::: zone pivot="programming-language-python"

+ **OpenTelemetry integration**: The `host.json` file enables OpenTelemetry with `"telemetryMode": "OpenTelemetry"`
+ **Function chaining**: The first function calls the second using HTTP requests, creating correlated traces
+ **Service Bus integration**: The second function outputs to Service Bus, which triggers the third function
+ **Anonymous authentication**: The HTTP functions use `auth_level=func.AuthLevel.ANONYMOUS`, so no function keys are required

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-python-azd-otel).

::: zone-end  
::: zone pivot="programming-language-typescript"  
+ **OpenTelemetry integration**: The `index.ts` file configures OpenTelemetry with Azure Monitor exporters for traces and logs
+ **Function chaining**: The first function calls the second using axios with automatic trace propagation
+ **Service Bus integration**: The second function outputs to Service Bus using output bindings, which triggers the third function
+ **Managed identity**: All Service Bus connections use managed identity instead of connection strings
+ **Processing simulation**: The 5-second delay in the Service Bus trigger simulates message processing work

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-otel).  
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ **OpenTelemetry integration**: The `Program.cs` file configures OpenTelemetry with Azure Monitor exporter
+ **Function chaining**: The first function calls the second using HttpClient with OpenTelemetry instrumentation
+ **Service Bus integration**: The second function outputs to Service Bus using output bindings, which triggers the third function
+ **Managed identity**: All Service Bus connections use managed identity instead of connection strings
+ **.NET 8 Isolated Worker**: Uses the latest Azure Functions .NET Isolated Worker model for better performance and flexibility

You can review the complete template project [here](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-otel).  
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-python,programming-language-typescript" 
After you verify your functions locally, it's time to publish them to Azure.

## Deploy to Azure

This project is configured to use the `azd up` command to deploy this project to a new function app in a Flex Consumption plan in Azure with OpenTelemetry support.

>[!TIP]
>This project includes a set of Bicep files that `azd` uses to create a secure deployment to a Flex consumption plan that follows best practices, including managed identity connections.

1. Run this command to have `azd` create the required Azure resources in Azure and deploy your code project to the new function app:

    ```console
    azd up
    ```

    The root folder contains the `azure.yaml` definition file required by `azd`. 

    If you're not already signed in, you're asked to authenticate with your Azure account.

1. When prompted, provide these required deployment parameters:

    | Parameter | Description |
    | ---- | ---- |
    | _Azure subscription_ | Subscription in which your resources are created.|
    | _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|
    
    The `azd up` command uses your response to these prompts with the Bicep configuration files to complete these deployment tasks:

    + Create and configure these required Azure resources (equivalent to `azd provision`):

        + Azure Functions Flex Consumption plan and function app with OpenTelemetry enabled
        + Azure Storage (required) and Application Insights (recommended) 
        + Service Bus namespace and queue for distributed tracing demonstration
        + Access policies and roles for your account
        + Service-to-service connections using managed identities (instead of stored connection strings)

    + Package and deploy your code to the deployment container (equivalent to `azd deploy`). The app is then started and runs in the deployed package. 

    After the command completes successfully, you see links to the resources you created.

## Test distributed tracing

Now you can test the OpenTelemetry distributed tracing functionality by calling your deployed functions and observing the telemetry in Application Insights.

### Invoke the function on Azure

You can invoke your function endpoints in Azure by making HTTP requests to their URLs. Since the HTTP functions in this template are configured with anonymous access, no function keys are required.

1. In your local terminal or command prompt, run this command to get the function app name and construct the URL:

    ```bash
    APP_NAME=$(azd env get-value AZURE_FUNCTION_NAME)
    echo "Function URL: https://$APP_NAME.azurewebsites.net/api/first_http_function"
    ```

    The `azd env get-value` command gets your function app name from the local environment.

1. Test the function in your browser by navigating to the URL:

    ```
    https://your-function-app.azurewebsites.net/api/first_http_function
    ```

    Replace `your-function-app` with your actual function app name from the previous step. This single request creates a distributed trace that flows through all three functions.

### View distributed tracing in Application Insights

After invoking the function, you can observe the complete distributed trace in Application Insights:

>[!NOTE]
>It might take a few minutes for telemetry data to appear in Application Insights after invoking your function. If you don't see data immediately, wait a few minutes and refresh the view.

1. Go to your Application Insights resource in the Azure portal (you can find it in the same resource group as your function app).

1. Open the **Application map** to see the distributed trace across all three functions. You should see the flow from the HTTP request through your functions and to Service Bus.

1. Check the **Transaction search** to find your request and see the complete trace timeline. Search for transactions from your function app.

1. Select a specific transaction to see the end-to-end trace that shows:
   - The HTTP request to `first_http_function`
   - The internal HTTP call to `second_http_function`
   - The Service Bus message being sent
   - The `servicebus_queue_trigger` processing the message from Service Bus

1. In the trace details, you can see:
   - **Timing information**: How long each step took
   - **Dependencies**: The connections between functions
   - **Logs**: Application logs correlated with the trace
   - **Performance metrics**: Response times and throughput

This example demonstrates end-to-end distributed tracing across multiple Azure Functions with OpenTelemetry integration, providing complete visibility into your application's behavior and performance.

## Redeploy your code

Run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app. 

>[!NOTE]
>The latest deployment package always overwrites deployed code files.

Your initial responses to `azd` prompts and any environment variables generated by `azd` are stored locally in your named environment. Use the `azd env get-values` command to review all of the variables in your environment that the command uses when creating Azure resources.

## Clean up resources

When you're done working with your function app and related resources, use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```console
azd down --no-prompt
```

>[!NOTE]  
>The `--no-prompt` option instructs `azd` to delete your resource group without a confirmation from you. 
>
>This command doesn't affect your local code project. 
::: zone-end  
## Related content

+ [Use OpenTelemetry with Azure Functions](opentelemetry-howto.md)
+ [Monitor Azure Functions with Application Insights](functions-monitoring.md)