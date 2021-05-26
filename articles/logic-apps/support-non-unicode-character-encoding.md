---
title: Support non-Unicode character encoding in Logic Apps
description: Work with non-Unicode text in Logic Apps. Convert text payloads to UTF-8 using base64 encoding and Azure Functions.
ms.date: 04/29/2021
ms.topic: conceptual
ms.reviewer: logicappspm
ms.service: logic-apps
---
# Support non-Unicode character encoding in Logic Apps

When you work with text payloads, Azure Logic Apps infers the text is encoded in a Unicode format, such as UTF-8. You might have problems receiving, sending, or processing characters with different encodings in your workflow. For example, you might get corrupted characters in flat files when working with legacy systems that don't support Unicode.

To work with text that has other character encoding, apply base64 encoding to the non-Unicode payload. This step prevents Logic Apps from assuming the text is in UTF-8 format. You can then convert any .NET-supported encoding to UTF-8 using Azure Functions. 

This solution works with both *multi-tenant* and *single-tenant* workflows. You can also [use this solution with the AS2 connector](#convert-payloads-for-as2).

## Convert payload encoding

First, check that your trigger can correctly identify the content type. This step ensures that Logic Apps no longer assumes the text is UTF-8. 

For triggers with the setting **Infer Content Type**, choose **No**. If your trigger doesn't have this option, the content type is set by the incoming message. 

If you're using the HTTP request trigger for `text/plain` content, you must set the `charset` parameter in the `Content-Type` header of the call. Characters might become corrupted if you don't set the `charset` parameter, or the parameter doesn't match the payload's encoding format. For more information, see [how to handle the `text/plain` content type](logic-apps-content-type.md#text-plain).

For example, the HTTP trigger converts the incoming content to UTF-8 when the `Content-Type` header is set with the correct `charset` parameter:

```json
{
    "headers": {
        <...>
        "Content-Type": "text/plain; charset=windows-1250"
        },
        "body": "non UTF-8 text content"
}
```

If you set the `Content-Type` header to `application/octet-stream`, you also might receive characters that aren't UTF-8. For more information, see [how to handle the `application/octet-stream` content type](logic-apps-content-type.md#applicationxml-and-applicationoctet-stream).

## Base64 encode content

Before you [base64 encode](workflow-definition-language-functions-reference.md#base64) content, make sure you've [converted the text to UTF-8](#convert-payload-encoding). If you base64 decode the content to a string before converting the text to UTF-8, characters might return corrupted.

Next, convert any .NET-supported encoding to another .NET-supported encoding. Review the [Azure Functions code example](#azure-functions-version) or the [.NET code example](#net-version):

> [!TIP]
> For *single-tenant* logic apps, you can improve performance and decrease latency by locally running the conversion function.

### Azure Functions version

The following example is for Azure Functions version 2: 

```csharp
using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

public static class ConversionFunctionv2 {
  [FunctionName("ConversionFunctionv2")]
  public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req, TraceWriter log) {
    log.Info("C# HTTP trigger function processing a request.");

    Encoding inputEncoding = null;

    string requestBody = new StreamReader(req.Body).ReadToEnd();
    dynamic data = JsonConvert.DeserializeObject(requestBody);

    if (data == null || data.text == null || data.encodingInput == null || data.encodingOutput == null) {
      return new BadRequestObjectResult("Please pass text/encodingOutput properties in the input JSON object.");
    }

    Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

    try {
      string encodingInput = data.encodingInput.Value;
      inputEncoding = Encoding.GetEncoding(name: encodingInput);
    } catch (ArgumentException) {
      return new BadRequestObjectResult($"Input character set value '{data.encodingInput.Value}' is not supported. Supported values are listed at https://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx.");
    }

    Encoding encodingOutput = null;
    try {
      string outputEncoding = data.encodingOutput.Value;
      encodingOutput = Encoding.GetEncoding(outputEncoding);
    } catch (ArgumentException) {
      return new BadRequestObjectResult($"Output character set value '{data.encodingOutput.Value}' is not supported. Supported values are listed at https://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx.");
    }

    return (ActionResult) new JsonResult(
      value: new {
        text = Convert.ToBase64String(
          Encoding.Convert(
            srcEncoding: inputEncoding,
            dstEncoding: encodingOutput,
            bytes: Convert.FromBase64String((string) data.text)))
      });
  }
}
```

### .NET version

The following example is for use with **.NET standard** and Azure Functions **version 2**:

```csharp
    using System;
    using System.IO;
    using System.Text;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Azure.WebJobs.Host;
    using Newtonsoft.Json;

    public static class ConversionFunctionNET
    {
        [FunctionName("ConversionFunctionNET")]
        public static IActionResult Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)]HttpRequest req, TraceWriter log)
        {
            log.Info("C# HTTP trigger function processing a request.");

            Encoding inputEncoding = null;

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            if (data == null || data.text == null || data.encodingInput == null || data.encodingOutput == null)
            {
                return new BadRequestObjectResult("Please pass text/encodingOutput properties in the input JSON object.");
            }

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            try
            {
                string encodingInput = data.encodingInput.Value;
                inputEncoding = Encoding.GetEncoding(name: encodingInput);
            }
            catch (ArgumentException)
            {
                return new BadRequestObjectResult($"Input character set value '{data.encodingInput.Value}' is not supported. Supported values are listed at https://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx.");
            }

            Encoding encodingOutput = null;
            try
            {
                string outputEncoding = data.encodingOutput.Value;
                encodingOutput = Encoding.GetEncoding(outputEncoding);
            }
            catch (ArgumentException)
            {
                return new BadRequestObjectResult($"Output character set value '{data.encodingOutput.Value}' is not supported. Supported values are listed at https://msdn.microsoft.com/en-us/library/system.text.encoding(v=vs.110).aspx.");
            }

            return (ActionResult)new JsonResult(
                value: new
                {
                    text = Convert.ToBase64String(
                        Encoding.Convert(
                            srcEncoding: inputEncoding,
                            dstEncoding: encodingOutput,
                            bytes: Convert.FromBase64String((string)data.text)))
                });
        }
    }
```

Using these same concepts, you can also [send a non-Unicode payload from your workflow](#send-non-unicode-payload).

## Sample payload conversions

In this example, the base64-encoded sample input string is a personal name, *H&eacute;lo&iuml;se*, that contains accented characters.

Example input:

```json
{  
    "text": "SMOpbG/Dr3Nl",
    "encodingInput": "utf-8",
    "encodingOutput": "windows-1252"
}
```

Example output:

```json
{
    "text": "U01PcGJHL0RyM05s"
}
```

## Send non-Unicode payload

If you need to send a non-Unicode payload from your workflow, do the steps for [converting the payload to UTF-8](#convert-payload-encoding) in reverse. Keep the text in UTF-8 as long as possible within your system. Next, use the same function to convert the base64-encoded UTF-8 characters to the required encoding. Then, apply base64 decoding to the text, and send your payload.

## Convert payloads for AS2

You can also use this solution with non-Unicode payloads in the [AS2 v2 connector](logic-apps-enterprise-integration-as2.md). If you don't convert payloads that you pass to AS2 to UTF-8, you might experience problems with the payload interpretation. These problems might result in a mismatch with the MIC hash between the partners because of misinterpreted characters.

## Next steps

> [!div class="nextstepaction"]
> [Encode and decode flat files in Azure Logic Apps by using the Enterprise Integration Pack](logic-apps-enterprise-integration-flatfile.md)
