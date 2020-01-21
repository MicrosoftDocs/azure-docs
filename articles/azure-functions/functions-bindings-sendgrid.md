---
title: Azure Functions SendGrid bindings
description: Azure Functions SendGrid bindings reference.
author: craigshoemaker

ms.topic: conceptual
ms.date: 11/29/2017
ms.author: cshoe

---

# Azure Functions SendGrid bindings

This article explains how to send email by using [SendGrid](https://sendgrid.com/docs/User_Guide/index.html) bindings in Azure Functions. Azure Functions supports an output binding for SendGrid.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

## Packages - Functions 1.x

The SendGrid bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.SendGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid) NuGet package, version 2.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/v2.x/src/WebJobs.Extensions.SendGrid/) GitHub repository.

[!INCLUDE [functions-package](../../includes/functions-package.md)]

## Packages - Functions 2.x and higher

The SendGrid bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.SendGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid) NuGet package, version 3.x. Source code for the package is in the [azure-webjobs-sdk-extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.SendGrid/) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Example

# [C#](#tab/csharp)

The following example shows a [C# function](functions-dotnet-class-library.md) that uses a Service Bus queue trigger and a SendGrid output binding.

### Synchronous

```cs
[FunctionName("SendEmail")]
public static void Run(
    [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] Message email,
    [SendGrid(ApiKey = "CustomSendGridKeyAppSettingName")] out SendGridMessage message)
{
var emailObject = JsonConvert.DeserializeObject<OutgoingEmail>(Encoding.UTF8.GetString(email.Body));

message = new SendGridMessage();
message.AddTo(emailObject.To);
message.AddContent("text/html", emailObject.Body);
message.SetFrom(new EmailAddress(emailObject.From));
message.SetSubject(emailObject.Subject);
}

public class OutgoingEmail
{
    public string To { get; set; }
    public string From { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
```

### Asynchronous

```cs
[FunctionName("SendEmail")]
public static async void Run(
 [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] Message email,
 [SendGrid(ApiKey = "CustomSendGridKeyAppSettingName")] IAsyncCollector<SendGridMessage> messageCollector)
{
 var emailObject = JsonConvert.DeserializeObject<OutgoingEmail>(Encoding.UTF8.GetString(email.Body));

 var message = new SendGridMessage();
 message.AddTo(emailObject.To);
 message.AddContent("text/html", emailObject.Body);
 message.SetFrom(new EmailAddress(emailObject.From));
 message.SetSubject(emailObject.Subject);
 
 await messageCollector.AddAsync(message);
}

public class OutgoingEmail
{
 public string To { get; set; }
 public string From { get; set; }
 public string Subject { get; set; }
 public string Body { get; set; }
}
```

You can omit setting the attribute's `ApiKey` property if you have your API key in an app setting named "AzureWebJobsSendGridApiKey".

# [C# Script](#tab/csharp-script)

The following example shows a SendGrid output binding in a *function.json* file and a [C# script function](functions-reference-csharp.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json 
{
    "bindings": [
        {
          "type": "queueTrigger",
          "name": "mymsg",
          "queueName": "myqueue",
          "connection": "AzureWebJobsStorage",
          "direction": "in"
        },
        {
          "type": "sendGrid",
          "name": "$return",
          "direction": "out",
          "apiKey": "SendGridAPIKeyAsAppSetting",
          "from": "{FromEmail}",
          "to": "{ToEmail}"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the C# script code:

```csharp
#r "SendGrid"

using System;
using SendGrid.Helpers.Mail;
using Microsoft.Azure.WebJobs.Host;

public static SendGridMessage Run(Message mymsg, ILogger log)
{
    SendGridMessage message = new SendGridMessage()
    {
        Subject = $"{mymsg.Subject}"
    };
    
    message.AddContent("text/plain", $"{mymsg.Content}");

    return message;
}
public class Message
{
    public string ToEmail { get; set; }
    public string FromEmail { get; set; }
    public string Subject { get; set; }
    public string Content { get; set; }
}
```

# [JavaScript](#tab/javascript)

The following example shows a SendGrid output binding in a *function.json* file and a [JavaScript function](functions-reference-node.md) that uses the binding.

Here's the binding data in the *function.json* file:

```json 
{
    "bindings": [
        {
            "name": "$return",
            "type": "sendGrid",
            "direction": "out",
            "apiKey" : "MySendGridKey",
            "to": "{ToEmail}",
            "from": "{FromEmail}",
            "subject": "SendGrid output bindings"
        }
    ]
}
```

The [configuration](#configuration) section explains these properties.

Here's the JavaScript code:

```javascript
module.exports = function (context, input) {
    var message = {
         "personalizations": [ { "to": [ { "email": "sample@sample.com" } ] } ],
        from: { email: "sender@contoso.com" },
        subject: "Azure news",
        content: [{
            type: 'text/plain',
            value: input
        }]
    };

    context.done(null, message);
};
```

# [Python](#tab/python)

The following example shows an HTTP-triggered function that sends an email using the SendGrid binding. You can provide default values in the binding configuration. For instance, the *from* email address is configured in *function.json*. 

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "type": "httpTrigger",
      "authLevel": "function",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "sendGrid",
      "name": "sendGridMessage",
      "direction": "out",
      "apiKey": "SendGrid_API_Key",
      "from": "sender@contoso.com"
    }
  ]
}
```

The following function shows how you can provide custom values for optional properties.

```python
import logging
import json
import azure.functions as func

def main(req: func.HttpRequest, sendGridMessage: func.Out[str]) -> func.HttpResponse:

    value = "Sent from Azure Functions"

    message = {
        "personalizations": [ {
          "to": [{
            "email": "user@contoso.com"
            }]}],
        "subject": "Azure Functions email with SendGrid",
        "content": [{
            "type": "text/plain",
            "value": value }]}

    sendGridMessage.set(json.dumps(message))

    return func.HttpResponse(f"Sent")
```

# [Java](#tab/java)

The following example uses the `@SendGridOutput` annotation from the [Java functions runtime library](/java/api/overview/azure/functions/runtime) to send an email using the SendGrid output binding.

```java
package com.function;

import java.util.*;
import com.microsoft.azure.functions.annotation.*;
import com.microsoft.azure.functions.*;

public class HttpTriggerSendGrid {

    @FunctionName("HttpTriggerSendGrid")
    public HttpResponseMessage run(

        @HttpTrigger(
            name = "req",
            methods = { HttpMethod.GET, HttpMethod.POST },
            authLevel = AuthorizationLevel.FUNCTION)
                HttpRequestMessage<Optional<String>> request,

        @SendGridOutput(
            name = "message",
            dataType = "String",
            apiKey = "SendGrid_API_Key",
            to = "user@contoso.com",
            from = "sender@contoso.com",
            subject = "Azure Functions email with SendGrid",
            text = "Sent from Azure Functions")
                OutputBinding<String> message,

        final ExecutionContext context) {

        final String toAddress = "user@contoso.com";
        final String value = "Sent from Azure Functions";

        StringBuilder builder = new StringBuilder()
            .append("{")
            .append("\"personalizations\": [{ \"to\": [{ \"email\": \"%s\"}]}],")
            .append("\"content\": [{\"type\": \"text/plain\", \"value\": \"%s\"}]")
            .append("}");

        final String body = String.format(builder.toString(), toAddress, value);

        message.setValue(body);

        return request.createResponseBuilder(HttpStatus.OK).body("Sent").build();
    }
}
```

---

## Attributes and annotations

# [C#](#tab/csharp)

In [C# class libraries](functions-dotnet-class-library.md), use the [SendGrid](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.SendGrid/SendGridAttribute.cs) attribute.

For information about attribute properties that you can configure, see [Configuration](#configuration). Here's a `SendGrid` attribute example in a method signature:

```csharp
[FunctionName("SendEmail")]
public static void Run(
    [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] OutgoingEmail email,
    [SendGrid(ApiKey = "CustomSendGridKeyAppSettingName")] out SendGridMessage message)
{
    ...
}
```

For a complete example, see [C# example](#example).

# [C# Script](#tab/csharp-script)

Attributes are not supported by C# Script.

# [JavaScript](#tab/javascript)

Attributes are not supported by JavaScript.

# [Python](#tab/python)

Attributes are not supported by Python.

# [Java](#tab/java)

The [SendGridOutput](https://github.com/Azure/azure-functions-java-library/blob/master/src/main/java/com/microsoft/azure/functions/annotation/SendGridOutput.java) annotation allows you to declaratively configure the SendGrid binding by providing configuration values. See the [example](#example) and [configuration](#configuration) sections for more detail.

---

## Configuration

The following table lists the binding configuration properties available in the  *function.json* file and the `SendGrid` attribute/annotation.

| *function.json* property | Attribute/annotation property | Description | Optional |
|--------------------------|-------------------------------|-------------|----------|
| type |n/a| Must be set to `sendGrid`.| No |
| direction |n/a| Must be set to `out`.| No |
| name |n/a| The variable name used in function code for the request or request body. This value is `$return` when there is only one return value. | No |
| apiKey | ApiKey | The name of an app setting that contains your API key. If not set, the default app setting name is *AzureWebJobsSendGridApiKey*.| No |
| to| To | The recipient's email address. | Yes |
| from| From | The sender's email address. |  Yes |
| subject| Subject | The subject of the email. | Yes |
| text| Text | The email content. | Yes |

Optional properties may have default values defined in the binding and either added or overridden programmatically.

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

<a name="host-json"></a>  

## host.json settings

This section describes the global configuration settings available for this binding in versions 2.x and higher. The example host.json file below contains only the version 2.x+ settings for this binding. For more information about global configuration settings in versions 2.x and beyond, see [host.json reference for Azure Functions](functions-host-json.md).

> [!NOTE]
> For a reference of host.json in Functions 1.x, see [host.json reference for Azure Functions 1.x](functions-host-json-v1.md).

```json
{
    "version": "2.0",
    "extensions": {
        "sendGrid": {
            "from": "Azure Functions <samples@functions.com>"
        }
    }
}
```  

|Property  |Default | Description |
|---------|---------|---------| 
|from|n/a|The sender's email address across all functions.| 


## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
