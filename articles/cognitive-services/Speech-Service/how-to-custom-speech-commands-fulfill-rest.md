---
title: 'How To: Fulfill Commands with a REST backend (Preview)'
titleSuffix: Azure Cognitive Services
description: In this article, connect a Custom Speech Commands application to a REST backend
services: cognitive-services
author: donkim
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 10/09/2019
ms.author: donkim
---

# How To: Fulfill Commands with a REST backend (Preview)

In this article, a sample REST backend will be created using an Azure function.

## Create REST backend with an Azure function

> [!TIP]
> Can be any REST enabled backend


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

## Connect REST backend to the Custom Speech Commands app

Go to http endpoints tab
add new http endpoint "Device Control Quickstart Backend"

uri: function uri
headers: function key header

## Update Completion rules to invoke REST backend

Go to Completion Rules section
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Http Action

On Success
 - No additional actions required.
On Failure
 - Speech Response - "Sorry, unable to complete your request at this time"

## Try it out


## Next steps
> [!div class="nextstepaction"]
> [How To: Fulfill Commands on the client with the Speech SDK (Preview)](./how-to-custom-speech-commands-fulfill-sdk.md)

