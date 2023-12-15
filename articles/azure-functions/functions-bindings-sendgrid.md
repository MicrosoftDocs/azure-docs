---
title: Azure Functions SendGrid bindings
description: Azure Functions SendGrid bindings reference.
ms.topic: reference
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-csharp, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 03/04/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions SendGrid bindings

This article explains how to send email by using [SendGrid](https://sendgrid.com/docs/User_Guide/index.html) bindings in Azure Functions. Azure Functions supports an output binding for SendGrid.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

---

The functionality of the extension varies depending on the extension version:

# [Functions v2.x+](#tab/functionsv2/in-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid), version 3.x.

# [Functions v1.x](#tab/functionsv1/in-process)

[!INCLUDE [functions-runtime-1x-retirement-note](../../includes/functions-runtime-1x-retirement-note.md)]

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid), version 2.x.

# [Functions v2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.SendGrid), version 3.x.

# [Functions v1.x](#tab/functionsv1/isolated-process)

Functions 1.x doesn't support running in an isolated worker process.

---

::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

Starting with Functions version 2.x, the HTTP extension is part of an [extension bundle], which is specified in your host.json project file. To learn more, see [extension bundle].

# [Bundle v2.x](#tab/functionsv2)

This version of the extension should already be available to your function app with [extension bundle], version 2.x. 

# [Functions 1.x](#tab/functionsv1)

You can add the extension to your project by explicitly installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.SendGrid), version 2.x. To learn more, see [Explicitly install extensions](functions-bindings-register.md#explicitly-install-extensions).

---

::: zone-end

## Example

::: zone pivot="programming-language-csharp"
[!INCLUDE [functions-bindings-csharp-intro-with-csx](../../includes/functions-bindings-csharp-intro-with-csx.md)]

# [Isolated worker model](#tab/isolated-process)

We don't currently have an example for using the SendGrid binding in a function app running in an isolated worker process. 

# [In-process model](#tab/in-process)    

The following examples shows a [C# function](functions-dotnet-class-library.md) that uses a Service Bus queue trigger and a SendGrid output binding.

The following example is a synchronous execution:

```cs
using SendGrid.Helpers.Mail;
using System.Text.Json;

...

[FunctionName("SendEmail")]
public static void Run(
    [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] Message email,
    [SendGrid(ApiKey = "CustomSendGridKeyAppSettingName")] out SendGridMessage message)
{
    var emailObject = JsonSerializer.Deserialize<OutgoingEmail>(Encoding.UTF8.GetString(email.Body));

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

This example shows asynchronous execution:


```cs
using SendGrid.Helpers.Mail;
using System.Text.Json;

...

[FunctionName("SendEmail")]
public static async Task Run(
 [ServiceBusTrigger("myqueue", Connection = "ServiceBusConnection")] Message email,
 [SendGrid(ApiKey = "CustomSendGridKeyAppSettingName")] IAsyncCollector<SendGridMessage> messageCollector)
{
    var emailObject = JsonSerializer.Deserialize<OutgoingEmail>(Encoding.UTF8.GetString(email.Body));

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

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
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

    return message;
};
```

::: zone-end  
::: zone pivot="programming-language-powershell" 
 
Complete PowerShell examples aren't currently available for SendGrid bindings.
::: zone-end 
::: zone pivot="programming-language-python"  

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
::: zone-end
::: zone pivot="programming-language-java"

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

::: zone-end
::: zone pivot="programming-language-csharp"
## Attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated worker process](dotnet-isolated-process-guide.md) C# libraries use attributes to define the output binding. C# script instead uses a function.json configuration file.  

# [Isolated worker model](#tab/isolated-process)

In [isolated worker process](dotnet-isolated-process-guide.md) function apps, the `SendGridOutputAttribute` supports the following parameters:

| Attribute/annotation property | Description | 
|-------------------------------|-------------|
| **ApiKey** | The name of an app setting that contains your API key. If not set, the default app setting name is `AzureWebJobsSendGridApiKey`.|
| **To** | (Optional) The recipient's email address. | 
| **From** | (Optional) The sender's email address. |  
| **Subject** | (Optional) The subject of the email. | 
| **Text** | (Optional) The email content. | 

# [In-process model](#tab/in-process)

In [in-process](functions-dotnet-class-library.md) function apps, use the [SendGridAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.SendGrid/SendGridAttribute.cs), which supports the following parameters.

| Attribute/annotation property | Description | 
|-------------------------------|-------------|
| **ApiKey** | The name of an app setting that contains your API key. If not set, the default app setting name is `AzureWebJobsSendGridApiKey`.|
| **To** | (Optional) The recipient's email address. | 
| **From** | (Optional) The sender's email address. |  
| **Subject** | (Optional) The subject of the email. | 
| **Text** | (Optional) The email content. | 

---

::: zone-end
::: zone pivot="programming-language-java"
## Annotations

The [SendGridOutput](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput) annotation allows you to declaratively configure the SendGrid binding by providing the following configuration values. 

+ [apiKey](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.apikey)
+ [dataType](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.datatype)
+ [name](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.name)
+ [to](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.to)
+ [from](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.from)
+ [subject](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.subject)
+ [text](/java/api/com.microsoft.azure.functions.annotation.sendgridoutput.text)

::: zone-end 
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"  

## Configuration

The following table lists the binding configuration properties available in the  *function.json* file and the `SendGrid` attribute/annotation.

| *function.json* property |  Description | 
|--------------------------|---------------------|
| **type** | Must be set to `sendGrid`.| 
| **direction** | Must be set to `out`.| 
| **name** | The variable name used in function code for the request or request body. This value is `$return` when there is only one return value. | 
| **apiKey** |  The name of an app setting that contains your API key. If not set, the default app setting name is *AzureWebJobsSendGridApiKey*.|
| **to**| (Optional) The recipient's email address. | 
| **from**| (Optional) The sender's email address. |  
| **subject**|  (Optional) The subject of the email. | 
| **text**| (Optional) The email content. | 

Optional properties may have default values defined in the binding and either added or overridden programmatically.

::: zone-end

[!INCLUDE [app settings to local.settings.json](../../includes/functions-app-settings-local.md)]

<a name="host-json"></a>  

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

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
|**from**|n/a|The sender's email address across all functions.| 


## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
