---
title: Azure Functions Twilio binding
description: Understand how to use Twilio bindings with Azure Functions.
ms.topic: reference
ms.date: 03/04/2022
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, H1Hack27Feb2017, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Twilio binding for Azure Functions

This article explains how to send text messages by using [Twilio](https://www.twilio.com/) bindings in Azure Functions. Azure Functions supports output bindings for Twilio.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

# [Functions v2.x+](#tab/functionsv2/in-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Twilio), version 3.x.

# [Functions v1.x](#tab/functionsv1/in-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Twilio), version 1.x.

# [Functions v2.x+](#tab/functionsv2/isolated-process)

There is currently no support for Twilio for an isolated worker process app.

# [Functions v1.x](#tab/functionsv1/isolated-process)

Functions 1.x doesn't support running in an isolated worker process.

# [Functions v2.x+](#tab/functionsv2/csharp-script)

This version of the extension should already be available to your function app with [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1/csharp-script)

You can add the extension to your project by explicitly installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Twilio), version 1.x. To learn more, see [Explicitly install extensions](functions-bindings-register.md#explicitly-install-extensions).

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

Starting with Functions version 2.x, the HTTP extension is part of an [extension bundle], which is specified in your host.json project file. To learn more, see [extension bundle].

# [Bundle v2.x](#tab/functionsv2)

This version of the extension should already be available to your function app with [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1)

You can add the extension to your project by explicitly installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid), version 2.x. To learn more, see [Explicitly install extensions](functions-bindings-register.md#explicitly-install-extensions).

---

::: zone-end

## Example

Unless otherwise noted, these examples are specific to version 2.x and later version of the Functions runtime.

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [In-process](#tab/in-process)    

The following example shows a [C# function](functions-dotnet-class-library.md) that sends a text message when triggered by a queue message.

```cs
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
namespace TwilioQueueOutput
{
    public static class QueueTwilio
    {
        [FunctionName("QueueTwilio")]
        [return: TwilioSms(AccountSidSetting = "TwilioAccountSid", AuthTokenSetting = "TwilioAuthToken", From = "+1425XXXXXXX")]
        public static CreateMessageOptions Run(
        [QueueTrigger("myqueue-items", Connection = "AzureWebJobsStorage")] JObject order,
        ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed: {order}");

            var message = new CreateMessageOptions(new PhoneNumber(order["mobileNumber"].ToString()))
            {
                Body = $"Hello {order["name"]}, thanks for your order!"
            };

            return message;
        }
    }
}
```

This example uses the `TwilioSms` attribute with the method return value. An alternative is to use the attribute with an `out CreateMessageOptions` parameter or an `ICollector<CreateMessageOptions>` or `IAsyncCollector<CreateMessageOptions>` parameter.

# [Isolated process](#tab/isolated-process)

The Twilio binding isn't currently supported for a function app running in an isolated worker process.

# [C# Script](#tab/csharp-script)

The following example shows a Twilio output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding. The function uses an `out` parameter to send a text message.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "twilioSms",
  "name": "message",
  "accountSidSetting": "TwilioAccountSid",
  "authTokenSetting": "TwilioAuthToken",
  "from": "+1425XXXXXXX",
  "direction": "out",
  "body": "Azure Functions Testing"
}
```

Here's C# script code:

```cs
#r "Newtonsoft.Json"
#r "Twilio"
#r "Microsoft.Azure.WebJobs.Extensions.Twilio"

using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public static void Run(string myQueueItem, out CreateMessageOptions message,  ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

    // In this example the queue item is a JSON string representing an order that contains the name of a
    // customer and a mobile number to send text updates to.
    dynamic order = JsonConvert.DeserializeObject(myQueueItem);
    string msg = "Hello " + order.name + ", thank you for your order.";

    // You must initialize the CreateMessageOptions variable with the "To" phone number.
    message = new CreateMessageOptions(new PhoneNumber("+1704XXXXXXX"));

    // A dynamic message can be set instead of the body in the output binding. In this example, we use
    // the order information to personalize a text message.
    message.Body = msg;
}
```

You can't use out parameters in asynchronous code. Here's an asynchronous C# script code example:

```cs
#r "Newtonsoft.Json"
#r "Twilio"
#r "Microsoft.Azure.WebJobs.Extensions.Twilio"

using System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public static async Task Run(string myQueueItem, IAsyncCollector<CreateMessageOptions> message,  ILogger log)
{
    log.LogInformation($"C# Queue trigger function processed: {myQueueItem}");

    // In this example the queue item is a JSON string representing an order that contains the name of a
    // customer and a mobile number to send text updates to.
    dynamic order = JsonConvert.DeserializeObject(myQueueItem);
    string msg = "Hello " + order.name + ", thank you for your order.";

    // You must initialize the CreateMessageOptions variable with the "To" phone number.
    CreateMessageOptions smsText = new CreateMessageOptions(new PhoneNumber("+1704XXXXXXX"));

    // A dynamic message can be set instead of the body in the output binding. In this example, we use
    // the order information to personalize a text message.
    smsText.Body = msg;

    await message.AddAsync(smsText);
}
```

---

::: zone-end
::: zone pivot="programming-language-javascript"
The following example shows a Twilio output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding.

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "twilioSms",
  "name": "message",
  "accountSidSetting": "TwilioAccountSid",
  "authTokenSetting": "TwilioAuthToken",
  "from": "+1425XXXXXXX",
  "direction": "out",
  "body": "Azure Functions Testing"
}
```

Here's the JavaScript code:

```javascript
module.exports = async function (context, myQueueItem) {
    context.log('Node.js queue trigger function processed work item', myQueueItem);

    // In this example the queue item is a JSON string representing an order that contains the name of a
    // customer and a mobile number to send text updates to.
    var msg = "Hello " + myQueueItem.name + ", thank you for your order.";

    // Even if you want to use a hard coded message in the binding, you must at least
    // initialize the message binding.
    context.bindings.message = {};

    // A dynamic message can be set instead of the body in the output binding. The "To" number 
    // must be specified in code. 
    context.bindings.message = {
        body : msg,
        to : myQueueItem.mobileNumber
    };
};
```

::: zone-end  
::: zone pivot="programming-language-powershell" 
 
Complete PowerShell examples aren't currently available for SendGrid bindings.
::: zone-end 
::: zone pivot="programming-language-python"  

The following example shows how to send an SMS message using the output binding as defined in the following *function.json*.

```json
    {
      "type": "twilioSms",
      "name": "twilioMessage",
      "accountSidSetting": "TwilioAccountSID",
      "authTokenSetting": "TwilioAuthToken",
      "from": "+1XXXXXXXXXX",
      "direction": "out",
      "body": "Azure Functions Testing"
    }
```

You can pass a serialized JSON object to the `func.Out` parameter to send the SMS message.

```python
import logging
import json
import azure.functions as func

def main(req: func.HttpRequest, twilioMessage: func.Out[str]) -> func.HttpResponse:

    message = req.params.get('message')
    to = req.params.get('to')

    value = {
      "body": message,
      "to": to
    }

    twilioMessage.set(json.dumps(value))

    return func.HttpResponse(f"Message sent")
```

::: zone-end
::: zone pivot="programming-language-java"
The following example shows how to use the [TwilioSmsOutput](/java/api/com.microsoft.azure.functions.annotation.twiliosmsoutput) annotation to send an SMS message. Values for `to`, `from`, and `body` are required in the attribute definition even if you override them programmatically.

```java
package com.function;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;

public class TwilioOutput {

    @FunctionName("TwilioOutput")
    public HttpResponseMessage run(
            @HttpTrigger(name = "req", methods = { HttpMethod.GET, HttpMethod.POST },
                authLevel = AuthorizationLevel.FUNCTION) HttpRequestMessage<Optional<String>> request,
            @TwilioSmsOutput(
                name = "twilioMessage",
                accountSid = "AzureWebJobsTwilioAccountSID",
                authToken = "AzureWebJobsTwilioAuthToken",
                to = "+1XXXXXXXXXX",
                body = "From Azure Functions",
                from = "+1XXXXXXXXXX") OutputBinding<String> twilioMessage,
            final ExecutionContext context) {

        String message = request.getQueryParameters().get("message");
        String to = request.getQueryParameters().get("to");

        StringBuilder builder = new StringBuilder()
            .append("{")
            .append("\"body\": \"%s\",")
            .append("\"to\": \"%s\"")
            .append("}");

        final String body = String.format(builder.toString(), message, to);

        twilioMessage.setValue(body);

        return request.createResponseBuilder(HttpStatus.OK).body("Message sent").build();
    }
}
```

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the output binding. C# script instead uses a function.json configuration file.  

# [In-process](#tab/in-process)

In [in-process](functions-dotnet-class-library.md) function apps, use the [TwilioSmsAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.Twilio/TwilioSMSAttribute.cs), which supports the following parameters.

| Attribute/annotation property | Description | 
|-------------------------------|-------------|
| **AccountSidSetting**| This value must be set to the name of an app setting that holds your Twilio Account Sid (`TwilioAccountSid`). When not set, the default app setting name is `AzureWebJobsTwilioAccountSid`. |
|**AuthTokenSetting**| This value must be set to the name of an app setting that holds your Twilio authentication token (`TwilioAccountAuthToken`). When not set, the default app setting name is `AzureWebJobsTwilioAuthToken`. |
| **To**| This value is set to the phone number that the SMS text is sent to.|
| **From**| This value is set to the phone number that the SMS text is sent from.|
| **Body**| This value can be used to hard code the SMS text message if you don't need to set it dynamically in the code for your function. |


# [Isolated process](#tab/isolated-process)

The Twilio binding isn't currently supported for a function app running in an isolated worker process.

# [C# Script](#tab/csharp-script)

---

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The [TwilioSmsOutput](/java/api/com.microsoft.azure.functions.annotation.twiliosmsoutput) annotation allows you to declaratively configure the Twilio output binding by providing the following configuration values:

 + 

Place the [TwilioSmsOutput](/java/api/com.microsoft.azure.functions.annotation.twiliosmsoutput) annotation on an [`OutputBinding<T>`](/java/api/com.microsoft.azure.functions.outputbinding) parameter, where `T` may be any native Java type such as `int`, `String`, `byte[]`, or a POJO type.

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-powershell"  
## Configuration

The following table explains the binding configuration properties that you set in the *function.json* file, which differs by runtime version:

# [Functions v2.x+](#tab/functionsv2)
 
| function.json property | Description|
|---------|------------------------|
|**type**| must be set to `twilioSms`.|
|**direction**| must be set to `out`.|
|**name**| Variable name used in function code for the Twilio SMS text message. |
|**accountSidSetting**| This value must be set to the name of an app setting that holds your Twilio Account Sid (`TwilioAccountSid`). When not set, the default app setting name is `AzureWebJobsTwilioAccountSid`. |
|**authTokenSetting**| This value must be set to the name of an app setting that holds your Twilio authentication token (`TwilioAccountAuthToken`). When not set, the default app setting name is `AzureWebJobsTwilioAuthToken`. |
|**from** |  This value is set to the phone number that the SMS text is sent from.|
|**body** |  This value can be used to hard code the SMS text message if you don't need to set it dynamically in the code for your function. |

In version 2.x, you set the `to` value in your code.

# [Functions 1.x](#tab/functionsv1)

| function.json property | Description|
|---------|-----------------------|
|**type**|must be set to `twilioSms`.|
|**direction**| must be set to `out`.|
|**name**| Variable name used in function code for the Twilio SMS text message. |
|**accountSid**| This value must be set to the name of an app setting that holds your Twilio Account Sid (`TwilioAccountSid`). When not set, the default app setting name is `AzureWebJobsTwilioAccountSid`. |
|**authToken**|This value must be set to the name of an app setting that holds your Twilio authentication token (`TwilioAccountAuthToken`). When not set, the default app setting name is `AzureWebJobsTwilioAuthToken`. |
|**to**| This value is set to the phone number that the SMS text is sent to.|
|**from**|  This value is set to the phone number that the SMS text is sent from.|
|**body**|  This value can be used to hard code the SMS text message if you don't need to set it dynamically in the code for your function. |

---

::: zone-end

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
