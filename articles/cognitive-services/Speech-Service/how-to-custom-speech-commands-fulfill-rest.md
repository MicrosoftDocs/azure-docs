
## How To: Fulfill commands with a REST backend

Demonstrate connecting to REST backed with an Azure function.
Can be any REST enabled backend

https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code

Code snippet for azure function
```C#
[FunctionName("DeviceControlTurnOnOff")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
    ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");

    string name = req.Query["name"];

    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    name = name ?? data?.name;

    return name != null
        ? (ActionResult)new OkObjectResult($"Hello, {name}")
        : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
}
```

Go to http endpoints tab
add new http endpoint "Device Control Quickstart Backend"

uri: function uri
headers: function key header

Go to Completion Rules section
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Http Action

On Success
 - No additional actions required.
On Failure
 - Speech Response - "Sorry, unable to complete your request at this time"
