---
title: Custom orchestration status
description: Learn how to configure and use custom orchestration status.
ms.topic: conceptual
ms.date: 01/15/2026
ms.author: azfuncdf
reviewer: hhunter-ms
ms.service: azure-functions
ms.subservice: durable
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
# ms.devlang: csharp, javascript, python
---

# Custom orchestration status

Custom orchestration status lets you set a custom status value for an orchestration instance. External clients can query this value to track progress or share metadata while the orchestration is running.

::: zone pivot="durable-functions"
In Azure Functions, this status is available via the [HTTP GetStatus API](durable-functions-http-api.md#get-instance-status) or the equivalent [SDK API](durable-functions-instance-management.md#query-instances) on the orchestration client object.
::: zone-end

::: zone pivot="durable-task-sdks"
In Durable Task SDKs, this status is available through orchestration status query APIs on the `DurableTaskClient` (for example, `GetInstanceAsync` in .NET or `getInstanceMetadata` in Java).

[!INCLUDE [preview-sample-limitations](./durable-task-scheduler/includes/preview-sample-limitations.md)]

::: zone-end

## Sample use cases

### Visualize progress

::: zone pivot="durable-functions"
Clients can poll the status endpoint and display a progress UI that visualizes the current execution stage. The following sample demonstrates progress sharing:

# [C#](#tab/csharp)

> [!NOTE]
> These examples are written for Durable Functions 2.x and aren't compatible with Durable Functions 1.x. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

```csharp
[FunctionName("E1_HelloSequence")]
public static async Task<List<string>> Run(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var outputs = new List<string>();

    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Tokyo"));
    context.SetCustomStatus("Tokyo");
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "Seattle"));
    context.SetCustomStatus("Seattle");
    outputs.Add(await context.CallActivityAsync<string>("E1_SayHello", "London"));
    context.SetCustomStatus("London");

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
}

[FunctionName("E1_SayHello")]
public static string SayHello([ActivityTrigger] string name)
{
    return $"Hello {name}!";
}
```

# [JavaScript](#tab/javascript)

`E1_HelloSequence` orchestrator function:

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context){
    const outputs = [];

    outputs.push(yield context.df.callActivity("E1_SayHello", "Tokyo"));
    context.df.setCustomStatus("Tokyo");
    outputs.push(yield context.df.callActivity("E1_SayHello", "Seattle"));
    context.df.setCustomStatus("Seattle");
    outputs.push(yield context.df.callActivity("E1_SayHello", "London"));
    context.df.setCustomStatus("London");

    // returns ["Hello Tokyo!", "Hello Seattle!", "Hello London!"]
    return outputs;
});
```

`E1_SayHello` activity function:

```javascript
module.exports = async function(context, name) {
    return `Hello ${name}!`;
};
```
# [Python](#tab/python)

### `E1_HelloSequence` Orchestrator function
```python
import azure.functions as func
import azure.durable_functions as df


def orchestrator_function(context: df.DurableOrchestrationContext):
    
    output1 = yield context.call_activity('E1_SayHello', 'Tokyo')
    context.set_custom_status('Tokyo')
    output2 = yield context.call_activity('E1_SayHello', 'Seattle')
    context.set_custom_status('Seattle')
    output3 = yield context.call_activity('E1_SayHello', 'London')
    context.set_custom_status('London')
    
    return [output1, output2, output3]

main = df.Orchestrator.create(orchestrator_function)
```

### `E1_SayHello` Activity function
```python
def main(name: str) -> str:
    return f"Hello {name}!"

```
# [PowerShell](#tab/powershell)

### `E1_HelloSequence` Orchestrator function
```powershell
param($Context)

$output = @()

$output += Invoke-DurableActivity -FunctionName 'E1_SayHello' -Input 'Tokyo'
Set-DurableCustomStatus -CustomStatus 'Tokyo'

$output += Invoke-DurableActivity -FunctionName 'E1_SayHello' -Input 'Seattle'
Set-DurableCustomStatus -CustomStatus 'Seattle'

$output += Invoke-DurableActivity -FunctionName 'E1_SayHello' -Input 'London'
Set-DurableCustomStatus -CustomStatus 'London'


return $output
```

### `E1_SayHello` Activity function
```powershell
param($name)

"Hello $name"
```

# [Java](#tab/java)

```java
@FunctionName("HelloCities")
public String helloCitiesOrchestrator(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String result = "";
    result += ctx.callActivity("SayHello", "Tokyo", String.class).await() + ", ";
    ctx.setCustomStatus("Tokyo");
    result += ctx.callActivity("SayHello", "London", String.class).await() + ", ";
    ctx.setCustomStatus("London");
    result += ctx.callActivity("SayHello", "Seattle", String.class).await();
    ctx.setCustomStatus("Seattle");
    return result;
}

@FunctionName("SayHello")
public String sayHello(@DurableActivityTrigger(name = "name") String name) {
    return String.format("Hello %s!", name);
}
```
---

::: zone-end

::: zone pivot="durable-task-sdks"
Clients can poll orchestration metadata and display a progress UI that visualizes the current execution stage. The following sample demonstrates progress sharing:

# [C#](#tab/csharp)

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;

public class HelloCities : TaskOrchestrator<object?, string>
{
    public override async Task<string> RunAsync(TaskOrchestrationContext context, object? input)
    {
        string result = "";

        result += await context.CallActivityAsync<string>("SayHello", "Tokyo") + ", ";
        context.SetCustomStatus("Tokyo");

        result += await context.CallActivityAsync<string>("SayHello", "London") + ", ";
        context.SetCustomStatus("London");

        result += await context.CallActivityAsync<string>("SayHello", "Seattle");
        context.SetCustomStatus("Seattle");

        return result;
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def say_hello(ctx: task.ActivityContext, name: str) -> str:
    return f"Hello {name}!"

def hello_cities(ctx: task.OrchestrationContext, _):
    result = ""

    result += (yield ctx.call_activity(say_hello, input="Tokyo")) + ", "
    ctx.set_custom_status("Tokyo")

    result += (yield ctx.call_activity(say_hello, input="London")) + ", "
    ctx.set_custom_status("London")

    result += yield ctx.call_activity(say_hello, input="Seattle")
    ctx.set_custom_status("Seattle")

    return result
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class HelloCities implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        String result = "";

        result += ctx.callActivity("SayHello", "Tokyo", String.class).await() + ", ";
        ctx.setCustomStatus("Tokyo");

        result += ctx.callActivity("SayHello", "London", String.class).await() + ", ";
        ctx.setCustomStatus("London");

        result += ctx.callActivity("SayHello", "Seattle", String.class).await();
        ctx.setCustomStatus("Seattle");

        ctx.complete(result);
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const sayHello = async (_: ActivityContext, name: string): Promise<string> => {
    return `Hello ${name}!`;
};

const helloCities: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    let result = "";

    result += (yield ctx.callActivity(sayHello, "Tokyo")) + ", ";
    ctx.setCustomStatus("Tokyo");

    result += (yield ctx.callActivity(sayHello, "London")) + ", ";
    ctx.setCustomStatus("London");

    result += yield ctx.callActivity(sayHello, "Seattle");
    ctx.setCustomStatus("Seattle");

    return result;
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

The client can poll orchestration metadata and wait until the `CustomStatus` field is set to `"London"`:

# [C#](#tab/csharp)

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask.Client;

string instanceId = await client.ScheduleNewOrchestrationInstanceAsync("HelloCities");

OrchestrationMetadata metadata = await client.WaitForInstanceStartAsync(instanceId, getInputsAndOutputs: true);
while (metadata.SerializedCustomStatus is null || metadata.ReadCustomStatusAs<string>() != "London")
{
    await Task.Delay(200);
    metadata = await client.GetInstanceAsync(instanceId, getInputsAndOutputs: true) ?? metadata;
}
```

# [Python](#tab/python)

```python
import time
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Assumes 'client' is a DurableTaskSchedulerClient instance
instance_id = client.schedule_new_orchestration(hello_cities)
state = client.wait_for_orchestration_start(instance_id, fetch_payloads=True)

while state.serialized_custom_status is None or state.serialized_custom_status != '"London"':
    time.sleep(0.2)
    state = client.get_orchestration_state(instance_id, fetch_payloads=True)
```

# [Java](#tab/java)

```java
String instanceId = client.scheduleNewOrchestrationInstance("HelloCities");
OrchestrationMetadata metadata = client.waitForInstanceStart(instanceId, Duration.ofMinutes(5), true);

while (!"London".equals(metadata.readCustomStatusAs(String.class))) {
    Thread.sleep(200);
    metadata = client.getInstanceMetadata(instanceId, true);
}
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

const instanceId = await client.scheduleNewOrchestration(helloCities);
let state = await client.waitForOrchestrationStart(instanceId, true, 60);

while (!state?.serializedCustomStatus || JSON.parse(state.serializedCustomStatus) !== "London") {
    await new Promise((resolve) => setTimeout(resolve, 200));
    state = await client.getOrchestrationState(instanceId, true);
}
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

::: zone pivot="durable-functions"
And then the client will receive the output of the orchestration only when `CustomStatus` field is set to "London":

# [C#](#tab/csharp)

```csharp
[FunctionName("HttpStart")]
public static async Task<HttpResponseMessage> Run(
    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "orchestrators/{functionName}")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient starter,
    string functionName,
    ILogger log)
{
    // Function input comes from the request content.
    dynamic eventData = await req.Content.ReadAsAsync<object>();
    string instanceId = await starter.StartNewAsync(functionName, (string)eventData);

    log.LogInformation($"Started orchestration with ID = '{instanceId}'.");

    DurableOrchestrationStatus durableOrchestrationStatus = await starter.GetStatusAsync(instanceId);
    while (durableOrchestrationStatus.CustomStatus.ToString() != "London")
    {
        await Task.Delay(200);
        durableOrchestrationStatus = await starter.GetStatusAsync(instanceId);
    }

    HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK)
    {
        Content = new StringContent(JsonConvert.SerializeObject(durableOrchestrationStatus))
    };

    return httpResponseMessage;
  }
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = async function(context, req) {
    const client = df.getClient(context);

    // Function input comes from the request content.
    const eventData = req.body;
    const instanceId = await client.startNew(req.params.functionName, undefined, eventData);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    let durableOrchestrationStatus = await client.getStatus(instanceId);
    while (durableOrchestrationStatus.customStatus.toString() !== "London") {
        await new Promise((resolve) => setTimeout(resolve, 200));
        durableOrchestrationStatus = await client.getStatus(instanceId);
    }

    const httpResponseMessage = {
        status: 200,
        body: JSON.stringify(durableOrchestrationStatus),
    };

    return httpResponseMessage;
};
```

> [!NOTE]
> In JavaScript, the `customStatus` field gets set when the next `yield` or `return` action is scheduled.

# [Python](#tab/python)
```python
import json
import logging
import azure.functions as func
import azure.durable_functions as df
from time import sleep

async def main(req: func.HttpRequest, starter: str) -> func.HttpResponse:
    client = df.DurableOrchestrationClient(starter)    
    instance_id = await client.start_new(req.params.functionName, None, None)

    logging.info(f"Started orchestration with ID = '{instance_id}'.")

    durable_orchestration_status = await client.get_status(instance_id)
    while durable_orchestration_status.custom_status != 'London':
        sleep(0.2)
        durable_orchestration_status = await client.get_status(instance_id)

    return func.HttpResponse(body='Success', status_code=200, mimetype='application/json')
```

> [!NOTE]
> In Python, the `custom_status` field gets set when the next `yield` or `return` action is scheduled.

# [PowerShell](#tab/powershell)

The feature isn't currently implemented in PowerShell.

# [Java](#tab/java)

```java
@FunctionName("StartHelloCities")
public HttpResponseMessage startHelloCities(
        @HttpTrigger(name = "req") HttpRequestMessage<Void> req,
        @DurableClientInput(name = "durableContext") DurableClientContext durableContext,
        final ExecutionContext context) throws InterruptedException {

    DurableTaskClient client = durableContext.getClient();
    String instanceId = client.scheduleNewOrchestrationInstance("HelloCities");
    context.getLogger().info("Created new Java orchestration with instance ID = " + instanceId);

    OrchestrationMetadata metadata;
    try {
        metadata = client.waitForInstanceStart(instanceId, Duration.ofMinutes(5), true);
    } catch (TimeoutException ex) {
        return req.createResponseBuilder(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    while (!"London".equals(metadata.readCustomStatusAs(String.class))) {
        Thread.sleep(200);
        metadata = client.getInstanceMetadata(instanceId, true);
    }

    return req.createResponseBuilder(HttpStatus.OK).build();
}
```

---

::: zone-end

### Output customization

You can use custom orchestration status to segment users by returning customized output based on unique characteristics or interactions. With custom orchestration status, your client-side code stays generic while all main modifications happen on the server side:

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[FunctionName("CityRecommender")]
public static void Run(
  [OrchestrationTrigger] IDurableOrchestrationContext context)
{
  int userChoice = context.GetInput<int>();

  switch (userChoice)
  {
    case 1:
    context.SetCustomStatus(new
    {
      recommendedCities = new[] {"Tokyo", "Seattle"},
      recommendedSeasons = new[] {"Spring", "Summer"}
     });
      break;
    case 2:
      context.SetCustomStatus(new
      {
                recommendedCities = new[] {"Seattle", "London"},
        recommendedSeasons = new[] {"Summer"}
      });
        break;
      case 3:
      context.SetCustomStatus(new
      {
                recommendedCities = new[] {"Tokyo", "London"},
        recommendedSeasons = new[] {"Spring", "Summer"}
      });
        break;
  }

  // Wait for user selection and refine the recommendation
}
```

# [JavaScript](#tab/javascript)

#### `CityRecommender` orchestrator

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const userChoice = context.df.getInput();

    switch (userChoice) {
        case 1:
            context.df.setCustomStatus({
                recommendedCities: [ "Tokyo", "Seattle" ],
                recommendedSeasons: [ "Spring", "Summer" ],
            });
            break;
        case 2:
            context.df.setCustomStatus({
                recommendedCities: [ "Seattle", "London" ],
                recommendedSeasons: [ "Summer" ],
            });
            break;
        case 3:
            context.df.setCustomStatus({
                recommendedCities: [ "Tokyo", "London" ],
                recommendedSeasons: [ "Spring", "Summer" ],
            });
            break;
    }

    // Wait for user selection and refine the recommendation
});
```

# [Python](#tab/python)

#### `CityRecommender` orchestrator

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    userChoice = int(context.get_input())

    if userChoice == 1:
        context.set_custom_status({
            'recommendedCities': ['Tokyo', 'Seattle'],
            'recommendedSeasons': ['Spring', 'Summer']
        })
    elif userChoice == 2:
        context.set_custom_status({
            'recommendedCities': ['Seattle', 'London'],
            'recommendedSeasons': ['Summer']
        })
    elif userChoice == 3:
        context.set_custom_status({
            'recommendedCities': ['Tokyo', 'London'],
            'recommendedSeasons': ['Spring', 'Summer']
        })



    # Wait for user selection and refine the recommendation

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

#### `CityRecommender` orchestrator

```powershell
param($Context)

$userChoice = $Context.Input -as [int]

if ($userChoice -eq 1) {
    Set-DurableCustomStatus -CustomStatus @{ recommendedCities = @('Tokyo', 'Seattle'); 
                                             recommendedSeasons = @('Spring', 'Summer') 
                                            }  
}

if ($userChoice -eq 2) {
    Set-DurableCustomStatus -CustomStatus @{ recommendedCities = @('Seattle', 'London'); 
                                             recommendedSeasons = @('Summer') 
                                            }  
}

if ($userChoice -eq 3) {
    Set-DurableCustomStatus -CustomStatus @{ recommendedCities = @('Tokyo', 'London'); 
                                             recommendedSeasons = @('Spring', 'Summer') 
                                            }  
}

# Wait for user selection and refine the recommendation
```

# [Java](#tab/java)

```java
@FunctionName("CityRecommender")
public void cityRecommender(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    int userChoice = ctx.getInput(int.class);
    switch (userChoice) {
        case 1:
            ctx.setCustomStatus(new Recommendation(
                    new String[]{ "Tokyo", "Seattle" },
                    new String[]{ "Spring", "Summer" }));
            break;
        case 2:
            ctx.setCustomStatus(new Recommendation(
                    new String[]{ "Seattle", "London" },
                    new String[]{ "Summer" }));
            break;
        case 3:
            ctx.setCustomStatus(new Recommendation(
                    new String[]{ "Tokyo", "London" },
                    new String[]{ "Spring", "Summer" }));
            break;
    }

    // Wait for user selection with an external event
}

class Recommendation {
    public Recommendation() { }

    public Recommendation(String[] cities, String[] seasons) {
        this.recommendedCities = cities;
        this.recommendedSeasons = seasons;
    }

    public String[] recommendedCities;
    public String[] recommendedSeasons;
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"
# [C#](#tab/csharp)

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;

public class CityRecommender : TaskOrchestrator<int, object?>
{
    public override Task<object?> RunAsync(TaskOrchestrationContext context, int userChoice)
    {
        switch (userChoice)
        {
            case 1:
                context.SetCustomStatus(new
                {
                    recommendedCities = new[] { "Tokyo", "Seattle" },
                    recommendedSeasons = new[] { "Spring", "Summer" },
                });
                break;
            case 2:
                context.SetCustomStatus(new
                {
                    recommendedCities = new[] { "Seattle", "London" },
                    recommendedSeasons = new[] { "Summer" },
                });
                break;
            case 3:
                context.SetCustomStatus(new
                {
                    recommendedCities = new[] { "Tokyo", "London" },
                    recommendedSeasons = new[] { "Spring", "Summer" },
                });
                break;
        }

        // Wait for user selection and refine the recommendation
        return Task.FromResult<object?>(null);
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def city_recommender(ctx: task.OrchestrationContext, user_choice: int):
    if user_choice == 1:
        ctx.set_custom_status({
            "recommendedCities": ["Tokyo", "Seattle"],
            "recommendedSeasons": ["Spring", "Summer"]
        })
    elif user_choice == 2:
        ctx.set_custom_status({
            "recommendedCities": ["Seattle", "London"],
            "recommendedSeasons": ["Summer"]
        })
    elif user_choice == 3:
        ctx.set_custom_status({
            "recommendedCities": ["Tokyo", "London"],
            "recommendedSeasons": ["Spring", "Summer"]
        })

    # Wait for user selection and refine the recommendation
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class CityRecommender implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        int userChoice = ctx.getInput(int.class);

        switch (userChoice) {
            case 1:
                ctx.setCustomStatus(new Recommendation(
                        new String[]{ "Tokyo", "Seattle" },
                        new String[]{ "Spring", "Summer" }));
                break;
            case 2:
                ctx.setCustomStatus(new Recommendation(
                        new String[]{ "Seattle", "London" },
                        new String[]{ "Summer" }));
                break;
            case 3:
                ctx.setCustomStatus(new Recommendation(
                        new String[]{ "Tokyo", "London" },
                        new String[]{ "Spring", "Summer" }));
                break;
        }

        // Wait for user selection and refine the recommendation
    }
}

class Recommendation {
    public Recommendation(String[] cities, String[] seasons) {
        this.recommendedCities = cities;
        this.recommendedSeasons = seasons;
    }

    public String[] recommendedCities;
    public String[] recommendedSeasons;
}
```

# [JavaScript](#tab/javascript)

```typescript
import { OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const cityRecommender: TOrchestrator = async function* (ctx: OrchestrationContext, userChoice: number): any {
    switch (userChoice) {
        case 1:
            ctx.setCustomStatus({
                recommendedCities: ["Tokyo", "Seattle"],
                recommendedSeasons: ["Spring", "Summer"],
            });
            break;
        case 2:
            ctx.setCustomStatus({
                recommendedCities: ["Seattle", "London"],
                recommendedSeasons: ["Summer"],
            });
            break;
        case 3:
            ctx.setCustomStatus({
                recommendedCities: ["Tokyo", "London"],
                recommendedSeasons: ["Spring", "Summer"],
            });
            break;
    }

    // Wait for user selection and refine the recommendation
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

### Instruction specification

Your orchestrator can provide unique instructions to clients through the custom status. The custom status instructions map to the steps in your orchestration code:

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

```csharp
[FunctionName("ReserveTicket")]
public static async Task<bool> Run(
  [OrchestrationTrigger] IDurableOrchestrationContext context)
{
  string userId = context.GetInput<string>();

  int discount = await context.CallActivityAsync<int>("CalculateDiscount", userId);

  context.SetCustomStatus(new
  {
    discount = discount,
    discountTimeout = 60,
    bookingUrl = "https://www.myawesomebookingweb.com",
  });

  bool isBookingConfirmed = await context.WaitForExternalEvent<bool>("BookingConfirmed");

  context.SetCustomStatus(isBookingConfirmed
    ? new {message = "Thank you for confirming your booking."}
    : new {message = "The booking was not confirmed on time. Please try again."});

  return isBookingConfirmed;
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const userId = context.df.getInput();

    const discount = yield context.df.callActivity("CalculateDiscount", userId);

    context.df.setCustomStatus({
        discount,
        discountTimeout: 60,
        bookingUrl: "https://www.myawesomebookingweb.com",
    });

    const isBookingConfirmed = yield context.df.waitForExternalEvent("BookingConfirmed");

    context.df.setCustomStatus(isBookingConfirmed
        ? { message: "Thank you for confirming your booking." }
        : { message: "The booking was not confirmed on time. Please try again." }
    );

    return isBookingConfirmed;
});
```
# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    userId = int(context.get_input())

    discount = yield context.call_activity('CalculateDiscount', userId)

    status = { 'discount' : discount,
        'discountTimeout' : 60,
        'bookingUrl' : "https://www.myawesomebookingweb.com",
    }
    context.set_custom_status(status)

    is_booking_confirmed = yield context.wait_for_external_event('BookingConfirmed')
    context.set_custom_status({'message': 'Thank you for confirming your booking.'} if is_booking_confirmed 
        else {'message': 'The booking was not confirmed on time. Please try again.'})
    return is_booking_confirmed

main = df.Orchestrator.create(orchestrator_function)
```
# [PowerShell](#tab/powershell)

```powershell
param($Context)

$userId = $Context.Input -as [int]

$discount = Invoke-DurableActivity -FunctionName 'CalculateDiscount' -Input $userId

$status = @{
            discount = $discount;
            discountTimeout = 60;
            bookingUrl = "https://www.myawesomebookingweb.com"
            }

Set-DurableCustomStatus -CustomStatus $status

$isBookingConfirmed = Invoke-DurableActivity -FunctionName 'BookingConfirmed'

if ($isBookingConfirmed) {
    Set-DurableCustomStatus -CustomStatus @{message = 'Thank you for confirming your booking.'}
} else {
    Set-DurableCustomStatus -CustomStatus @{message = 'The booking was not confirmed on time. Please try again.'}
}

return $isBookingConfirmed
```

# [Java](#tab/java)

```java
@FunctionName("ReserveTicket")
public boolean reserveTicket(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    String userID = ctx.getInput(String.class);
    int discount = ctx.callActivity("CalculateDiscount", userID, int.class).await();
    ctx.setCustomStatus(new DiscountInfo(discount, 60, "https://www.myawesomebookingweb.com"));

    boolean isConfirmed = ctx.waitForExternalEvent("BookingConfirmed", boolean.class).await();
    if (isConfirmed) {
        ctx.setCustomStatus("Thank you for confirming your booking.");
    } else {
        ctx.setCustomStatus("There was a problem confirming your booking. Please try again.");
    }

    return isConfirmed;
}

class DiscountInfo {
    public DiscountInfo() { }
    public DiscountInfo(int discount, int discountTimeout, String bookingUrl) {
        this.discount = discount;
        this.discountTimeout = discountTimeout;
        this.bookingUrl = bookingUrl;
    }
    public int discount;
    public int discountTimeout;
    public String bookingUrl;
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"
# [C#](#tab/csharp)

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;

public class ReserveTicket : TaskOrchestrator<string, bool>
{
    public override async Task<bool> RunAsync(TaskOrchestrationContext context, string userId)
    {
        int discount = await context.CallActivityAsync<int>("CalculateDiscount", userId);

        context.SetCustomStatus(new
        {
            discount,
            discountTimeout = 60,
            bookingUrl = "https://www.myawesomebookingweb.com",
        });

        bool isBookingConfirmed = await context.WaitForExternalEvent<bool>("BookingConfirmed");
        context.SetCustomStatus(isBookingConfirmed
            ? new { message = "Thank you for confirming your booking." }
            : new { message = "The booking was not confirmed on time. Please try again." });

        return isBookingConfirmed;
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def calculate_discount(ctx: task.ActivityContext, user_id: str) -> int:
    # Calculate discount based on user
    return 10

def reserve_ticket(ctx: task.OrchestrationContext, user_id: str):
    discount = yield ctx.call_activity(calculate_discount, input=user_id)

    ctx.set_custom_status({
        "discount": discount,
        "discountTimeout": 60,
        "bookingUrl": "https://www.myawesomebookingweb.com"
    })

    is_booking_confirmed = yield ctx.wait_for_external_event("BookingConfirmed")
    if is_booking_confirmed:
        ctx.set_custom_status({"message": "Thank you for confirming your booking."})
    else:
        ctx.set_custom_status({"message": "The booking was not confirmed on time. Please try again."})

    return is_booking_confirmed
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class ReserveTicket implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        String userId = ctx.getInput(String.class);
        int discount = ctx.callActivity("CalculateDiscount", userId, int.class).await();

        ctx.setCustomStatus(new DiscountInfo(discount, 60, "https://www.myawesomebookingweb.com"));

        boolean isConfirmed = ctx.waitForExternalEvent("BookingConfirmed", boolean.class).await();
        if (isConfirmed) {
            ctx.setCustomStatus("Thank you for confirming your booking.");
        } else {
            ctx.setCustomStatus("The booking was not confirmed on time. Please try again.");
        }

        ctx.complete(isConfirmed);
    }
}

class DiscountInfo {
    public DiscountInfo(int discount, int discountTimeout, String bookingUrl) {
        this.discount = discount;
        this.discountTimeout = discountTimeout;
        this.bookingUrl = bookingUrl;
    }

    public int discount;
    public int discountTimeout;
    public String bookingUrl;
}
```

# [JavaScript](#tab/javascript)

```typescript
import { ActivityContext, OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const calculateDiscount = async (_: ActivityContext, userId: string): Promise<number> => {
    // Calculate discount based on user
    return 10;
};

const reserveTicket: TOrchestrator = async function* (ctx: OrchestrationContext, userId: string): any {
    const discount: number = yield ctx.callActivity(calculateDiscount, userId);

    ctx.setCustomStatus({
        discount,
        discountTimeout: 60,
        bookingUrl: "https://www.myawesomebookingweb.com",
    });

    const isBookingConfirmed: boolean = yield ctx.waitForExternalEvent("BookingConfirmed");
    ctx.setCustomStatus(isBookingConfirmed
        ? { message: "Thank you for confirming your booking." }
        : { message: "The booking was not confirmed on time. Please try again." }
    );

    return isBookingConfirmed;
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

::: zone-end

## Querying custom status

::: zone pivot="durable-functions"
The following example shows how custom status values can be queried using the built-in HTTP APIs.

# [C#](#tab/csharp)

```csharp
public static async Task SetStatusTest([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    // ...do work...

    // update the status of the orchestration with some arbitrary data
    var customStatus = new { nextActions = new [] {"A", "B", "C"}, foo = 2, };
    context.SetCustomStatus(customStatus);

    // ...do more work...
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    // ...do work...

    // update the status of the orchestration with some arbitrary data
    const customStatus = { nextActions: [ "A", "B", "C" ], foo: 2, };
    context.df.setCustomStatus(customStatus);

    // ...do more work...
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    # ...do work...

    custom_status = {'nextActions': ['A','B','C'], 'foo':2}
    context.set_custom_status(custom_status)

    # ...do more work...

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

# ...do work...

Set-DurableCustomStatus -CustomStatus @{ nextActions = @('A', 'B', 'C'); 
                                         foo = 2 
                                        }  

# ...do more work...
```

# [Java](#tab/java)

```java
@FunctionName("MyCustomStatusOrchestrator")
public void myCustomStatusOrchestrator(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    // ... do work ...

    // update the status of the orchestration with some arbitrary data
    CustomStatusPayload payload = new CustomStatusPayload();
    payload.nextActions = new String[] { "A", "B", "C" };
    payload.foo = 2;
    ctx.setCustomStatus(payload);

    // ... do more work ...
}

class CustomStatusPayload {
    public String[] nextActions;
    public int foo;
}
```

---

While the orchestration is running, external clients can fetch this custom status:

```http
GET /runtime/webhooks/durabletask/instances/instance123
```

Clients get the following response:

```json
{
  "runtimeStatus": "Running",
  "input": null,
  "customStatus": { "nextActions": ["A", "B", "C"], "foo": 2 },
  "output": null,
  "createdTime": "2019-10-06T18:30:24Z",
  "lastUpdatedTime": "2019-10-06T19:40:30Z"
}
```

> [!WARNING]
> The custom status payload is limited to 16 KB of UTF-16 JSON text. If you need a larger payload, we recommend you use external storage.

::: zone-end

::: zone pivot="durable-task-sdks"
Durable Task SDKs don't provide a built-in HTTP status endpoint. Instead, you query custom status by using orchestration instance metadata APIs on the `DurableTaskClient`.

# [C#](#tab/csharp)

```csharp
using System.Threading.Tasks;
using Microsoft.DurableTask;

public class MyCustomStatusOrchestrator : TaskOrchestrator<object?, object?>
{
    public override Task<object?> RunAsync(TaskOrchestrationContext context, object? input)
    {
        context.SetCustomStatus(new { nextActions = new[] { "A", "B", "C" }, foo = 2 });
        return Task.FromResult<object?>(null);
    }
}
```

# [Python](#tab/python)

```python
from durabletask import task

def my_custom_status_orchestrator(ctx: task.OrchestrationContext, _):
    ctx.set_custom_status({"nextActions": ["A", "B", "C"], "foo": 2})
```

# [Java](#tab/java)

```java
import com.microsoft.durabletask.TaskOrchestration;
import com.microsoft.durabletask.TaskOrchestrationContext;

public class MyCustomStatusOrchestrator implements TaskOrchestration {
    @Override
    public void run(TaskOrchestrationContext ctx) {
        CustomStatusPayload payload = new CustomStatusPayload();
        payload.nextActions = new String[] { "A", "B", "C" };
        payload.foo = 2;
        ctx.setCustomStatus(payload);

        ctx.complete(null);
    }
}

class CustomStatusPayload {
    public String[] nextActions;
    public int foo;
}
```

# [JavaScript](#tab/javascript)

```typescript
import { OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const myCustomStatusOrchestrator: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    // ...do work...

    ctx.setCustomStatus({ nextActions: ["A", "B", "C"], foo: 2 });

    // ...do more work...
};
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

Query the custom status from a client:

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask.Client;

OrchestrationMetadata? metadata = await client.GetInstanceAsync(instanceId, getInputsAndOutputs: true);
string? customStatusJson = metadata?.SerializedCustomStatus;
```

# [Python](#tab/python)

```python
from durabletask.azuremanaged.client import DurableTaskSchedulerClient

# Assumes 'client' is a DurableTaskSchedulerClient instance
state = client.get_orchestration_state(instance_id, fetch_payloads=True)
custom_status_json = state.serialized_custom_status
```

# [Java](#tab/java)

```java
OrchestrationMetadata metadata = client.getInstanceMetadata(instanceId, true);
CustomStatusPayload payload = metadata.readCustomStatusAs(CustomStatusPayload.class);
```

# [JavaScript](#tab/javascript)

```typescript
import { createAzureManagedClient } from "@microsoft/durabletask-js-azuremanaged";

const client = createAzureManagedClient(connectionString);

// Get the custom status of an orchestration instance
const state = await client.getOrchestrationState(instanceId, true);
const customStatusJson = state?.serializedCustomStatus;
```

# [PowerShell](#tab/powershell)

The Durable Task SDK is not available for PowerShell. Use [Durable Functions](what-is-durable-task.md) instead.

---

> [!WARNING]
> The custom status payload is limited to 16 KB of UTF-16 JSON text.

::: zone-end



## Next steps

::: zone pivot="durable-functions"
> [!div class="nextstepaction"]
> [Learn about durable timers](durable-functions-timers.md)
::: zone-end

::: zone pivot="durable-task-sdks"
> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](durable-task-scheduler/quickstart-portable-durable-task-sdks.md)
::: zone-end
