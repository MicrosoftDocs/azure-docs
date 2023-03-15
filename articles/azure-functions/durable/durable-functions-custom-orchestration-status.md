---
title: Custom orchestration status in Durable Functions - Azure
description: Learn how to configure and use custom orchestration status for Durable Functions.
ms.topic: conceptual
ms.date: 12/07/2022
ms.author: azfuncdf
ms.devlang: csharp, javascript, python
---

# Custom orchestration status in Durable Functions (Azure Functions)

Custom orchestration status lets you set a custom status value for your orchestrator function. This status is provided via the [HTTP GetStatus API](durable-functions-http-api.md#get-instance-status) or the equivalent [SDK API](durable-functions-instance-management.md#query-instances) on the orchestration client object.

## Sample use cases

### Visualize progress

Clients can poll the status end point and display a progress UI that visualizes the current execution stage. The following sample demonstrates progress sharing:

# [C#](#tab/csharp)

> [!NOTE]
> These C# examples are written for Durable Functions 2.x and are not compatible with Durable Functions 1.x. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

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
> In JavaScript, the `customStatus` field will be set when the next `yield` or `return` action is scheduled.

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
> In Python, the `custom_status` field will be set when the next `yield` or `return` action is scheduled.

# [PowerShell](#tab/powershell)

The feature is not currently implemented in PowerShell

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

    while (metadata.readCustomStatusAs(String.class) != "London") {
        Thread.sleep(200);
        metadata = client.getInstanceMetadata(instanceId, true);
    }

    return req.createResponseBuilder(HttpStatus.OK).build();
}
```

---

### Output customization

Another interesting scenario is segmenting users by returning customized output based on unique characteristics or interactions. With the help of custom orchestration status, the client-side code will stay generic. All main modifications will happen on the server side as shown in the following sample:

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
        recommendedCities = new[] {"Seattle, London"},
        recommendedSeasons = new[] {"Summer"}
      });
        break;
      case 3:
      context.SetCustomStatus(new
      {
        recommendedCities = new[] {"Tokyo, London"},
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
                recommendedCity: [ "Tokyo", "London" ],
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
            'recommendedCities' : ['Tokyo', 'Seattle'], 
            'recommendedSeasons' : ['Spring', 'Summer']
        }))
    if userChoice == 2:
        context.set_custom_status({
            'recommendedCities' : ['Seattle', 'London']
            'recommendedSeasons' : ['Summer']
        }))
    if userChoice == 3:
        context.set_custom_status({
            'recommendedCities' : ['Tokyo', 'London'], 
            'recommendedSeasons' : ['Spring', 'Summer']
        }))



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

### Instruction specification

The orchestrator can provide unique instructions to the clients via the custom state. The custom status instructions will be mapped to the steps in the orchestration code:

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
        discountTimeout = 60,
        bookingUrl = "https://www.myawesomebookingweb.com",
    });

    const isBookingConfirmed = yield context.df.waitForExternalEvent("bookingConfirmed");

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

## Querying custom status with HTTP

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

Clients will get the following response:

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
> The custom status payload is limited to 16 KB of UTF-16 JSON text. We recommend you use external storage if you need a larger payload.

## Next steps

> [!div class="nextstepaction"]
> [Learn about durable timers](durable-functions-timers.md)
