---
title: Microsoft Graph bindings for Azure Functions
description: Understand how to use Microsoft Graph triggers and bindings in Azure Functions.
author: craigshoemaker

ms.topic: conceptual
ms.date: 12/20/2017
ms.author: cshoe
---

# Microsoft Graph bindings for Azure Functions

This article explains how to configure and work with Microsoft Graph triggers and bindings in Azure Functions. With these, you can use Azure Functions to work with data, insights, and events from the [Microsoft Graph](https://developer.microsoft.com/graph).

The Microsoft Graph extension provides the following bindings:
- An [auth token input binding](#token-input) allows you to interact with any Microsoft Graph API.
- An [Excel table input binding](#excel-input) allows you to read data from Excel.
- An [Excel table output binding](#excel-output) allows you to modify Excel data.
- A [OneDrive file input binding](#onedrive-input) allows you to read files from OneDrive.
- A [OneDrive file output binding](#onedrive-output) allows you to write to files in OneDrive.
- An [Outlook message output binding](#outlook-output) allows you to send email through Outlook.
- A collection of [Microsoft Graph webhook triggers and bindings](#webhooks) allows you to react to events from the Microsoft Graph.

[!INCLUDE [intro](../../includes/functions-bindings-intro.md)]

> [!Note]
> Microsoft Graph bindings are currently in preview for Azure Functions version 2.x and higher. They are not supported in Functions version 1.x.

## Packages

The auth token input binding is provided in the [Microsoft.Azure.WebJobs.Extensions.AuthTokens](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AuthTokens/) NuGet package. The other Microsoft Graph bindings are provided in the [Microsoft.Azure.WebJobs.Extensions.MicrosoftGraph](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.MicrosoftGraph/) package. Source code for the packages is in the [azure-functions-microsoftgraph-extension](https://github.com/Azure/azure-functions-microsoftgraph-extension/) GitHub repository.

[!INCLUDE [functions-package-v2](../../includes/functions-package-v2.md)]

## Setting up the extensions

Microsoft Graph bindings are available through _binding extensions_. Binding extensions are optional components to the Azure Functions runtime. This section shows how to set up the Microsoft Graph and auth token extensions.

### Enabling Functions 2.0 preview

Binding extensions are available only for Azure Functions 2.0 preview. 

For information about how to set a function app to use the preview 2.0 version of the Functions runtime, see [How to target Azure Functions runtime versions](set-runtime-version.md).

### Installing the extension

To install an extension from the Azure portal, navigate to either a template or binding that references it. Create a new function, and while in the template selection screen, choose the "Microsoft Graph" scenario. Select one of the templates from this scenario. Alternatively, you can navigate to the "Integrate" tab of an existing function and select one of the bindings covered in this article.

In both cases, a warning will appear which specifies the extension to be installed. Click **Install** to obtain the extension. Each extension only needs to be installed once per function app. 

> [!Note] 
> The in-portal installation process can take up to 10 minutes on a Consumption plan.

If you are using Visual Studio, you can get the extensions by installing [the NuGet packages that are listed earlier in this article](#packages).

### Configuring Authentication / Authorization

The bindings outlined in this article require an identity to be used. This allows the Microsoft Graph to enforce permissions and audit interactions. The identity can be a user accessing your application or the application itself. To configure this identity, set up [App Service Authentication / Authorization](https://docs.microsoft.com/azure/app-service/overview-authentication-authorization) with Azure Active Directory. You will also need to request any resource permissions your functions require.

> [!Note] 
> The Microsoft Graph extension only supports Azure AD authentication. Users need to log in with a work or school account.

If you're using the Azure portal, you'll see a warning below the prompt to install the extension. The warning prompts you to configure App Service Authentication / Authorization and request any permissions the template or binding requires. Click **Configure Azure AD now** or **Add permissions now** as appropriate.



<a name="token-input"></a>
## Auth token

The auth token input binding gets an Azure AD token for a given resource and provides it to your code as a string. The resource can be any for which the application has permissions. 

This section contains the following subsections:

* [Example](#auth-token---example)
* [Attributes](#auth-token---attributes)
* [Configuration](#auth-token---configuration)
* [Usage](#auth-token---usage)

### Auth token - example

See the language-specific example:

* [C# script (.csx)](#auth-token---c-script-example)
* [JavaScript](#auth-token---javascript-example)

#### Auth token - C# script example

The following example gets user profile information.

The *function.json* file defines an HTTP trigger with a token input binding:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "token",
      "direction": "in",
      "name": "graphToken",
      "resource": "https://graph.microsoft.com",
      "identity": "userFromRequest"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code uses the token to make an HTTP call to the Microsoft Graph and returns the result:

```csharp
using System.Net; 
using System.Net.Http; 
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging; 

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, string graphToken, ILogger log)
{
    HttpClient client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", graphToken);
    return await client.GetAsync("https://graph.microsoft.com/v1.0/me/");
}
```

#### Auth token - JavaScript example

The following example gets user profile information.

The *function.json* file defines an HTTP trigger with a token input binding:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "token",
      "direction": "in",
      "name": "graphToken",
      "resource": "https://graph.microsoft.com",
      "identity": "userFromRequest"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The JavaScript code uses the token to make an HTTP call to the Microsoft Graph and returns the result.

```js
const rp = require('request-promise');

module.exports = function (context, req) {
    let token = "Bearer " + context.bindings.graphToken;

    let options = {
        uri: 'https://graph.microsoft.com/v1.0/me/',
        headers: {
            'Authorization': token
        }
    };
    
    rp(options)
        .then(function(profile) {
            context.res = {
                body: profile
            };
            context.done();
        })
        .catch(function(err) {
            context.res = {
                status: 500,
                body: err
            };
            context.done();
        });
};
```

### Auth token - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [Token](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/TokenBinding/TokenAttribute.cs) attribute.

### Auth token - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Token` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the auth token. See [Using an auth token input binding from code](#token-input-code).|
|**type**| n/a |Required - must be set to `token`.|
|**direction**| n/a |Required - must be set to `in`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**userId**|**UserId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**Resource**|**resource**|Required - An Azure AD resource URL for which the token is being requested.|

<a name="token-input-code"></a>
### Auth token - usage

The binding itself does not require any Azure AD permissions, but depending on how the token is used, you may need to request additional permissions. Check the requirements of the resource you intend to access with the token.

The token is always presented to code as a string.

> [!Note]
> When developing locally with either of `userFromId`, `userFromToken` or `userFromRequest` options, required token can be [obtained manually](https://github.com/Azure/azure-functions-microsoftgraph-extension/issues/54#issuecomment-392865857) and specified in `X-MS-TOKEN-AAD-ID-TOKEN` request header from a calling client application.


<a name="excel-input"></a>
## Excel input

The Excel table input binding reads the contents of an Excel table stored in OneDrive.

This section contains the following subsections:

* [Example](#excel-input---example)
* [Attributes](#excel-input---attributes)
* [Configuration](#excel-input---configuration)
* [Usage](#excel-input---usage)

### Excel input - example

See the language-specific example:

* [C# script (.csx)](#excel-input---c-script-example)
* [JavaScript](#excel-input---javascript-example)

#### Excel input - C# script example

The following *function.json* file defines an HTTP trigger with an Excel input binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "excel",
      "direction": "in",
      "name": "excelTableData",
      "path": "{query.workbook}",
      "identity": "UserFromRequest",
      "tableName": "{query.table}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The following C# script code reads the contents of the specified table and returns them to the user:

```csharp
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Logging;

public static IActionResult Run(HttpRequest req, string[][] excelTableData, ILogger log)
{
    return new OkObjectResult(excelTableData);
}
```

#### Excel input - JavaScript example

The following *function.json* file defines an HTTP trigger with an Excel input binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "excel",
      "direction": "in",
      "name": "excelTableData",
      "path": "{query.workbook}",
      "identity": "UserFromRequest",
      "tableName": "{query.table}"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The following JavaScript code reads the contents of the specified table and returns them to the user.

```js
module.exports = function (context, req) {
    context.res = {
        body: context.bindings.excelTableData
    };
    context.done();
};
```

### Excel input - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [Excel](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/ExcelAttribute.cs) attribute.

### Excel input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Excel` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the Excel table. See [Using an Excel table input binding from code](#excel-input-code).|
|**type**| n/a |Required - must be set to `excel`.|
|**direction**| n/a |Required - must be set to `in`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**userId**|**UserId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**path**|**Path**|Required - the path in OneDrive to the Excel workbook.|
|**worksheetName**|**WorksheetName**|The worksheet in which the table is found.|
|**tableName**|**TableName**|The name of the table. If not specified, the contents of the worksheet will be used.|

<a name="excel-input-code"></a>
### Excel input - usage

This binding requires the following Azure AD permissions:

|Resource|Permission|
|--------|--------|
|Microsoft Graph|Read user files|

The binding exposes the following types to .NET functions:
- string[][]
- Microsoft.Graph.WorkbookTable
- Custom object types (using structural model binding)










<a name="excel-output"></a>
## Excel output

The Excel output binding modifies the contents of an Excel table stored in OneDrive.

This section contains the following subsections:

* [Example](#excel-output---example)
* [Attributes](#excel-output---attributes)
* [Configuration](#excel-output---configuration)
* [Usage](#excel-output---usage)

### Excel output - example

See the language-specific example:

* [C# script (.csx)](#excel-output---c-script-example)
* [JavaScript](#excel-output---javascript-example)

#### Excel output - C# script example

The following example adds rows to an Excel table.

The *function.json* file defines an HTTP trigger with an Excel output binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "newExcelRow",
      "type": "excel",
      "direction": "out",
      "identity": "userFromRequest",
      "updateType": "append",
      "path": "{query.workbook}",
      "tableName": "{query.table}"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code adds a new row to the table (assumed to be single-column) based on input from the query string:

```csharp
using System.Net;
using System.Text;
using Microsoft.Extensions.Logging;

public static async Task Run(HttpRequest req, IAsyncCollector<object> newExcelRow, ILogger log)
{
    string input = req.Query
        .FirstOrDefault(q => string.Compare(q.Key, "text", true) == 0)
        .Value;
    await newExcelRow.AddAsync(new {
        Text = input
        // Add other properties for additional columns here
    });
    return;
}
```

#### Excel output - JavaScript example

The following example adds rows to an Excel table.

The *function.json* file defines an HTTP trigger with an Excel output binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "newExcelRow",
      "type": "excel",
      "direction": "out",
      "identity": "userFromRequest",
      "updateType": "append",
      "path": "{query.workbook}",
      "tableName": "{query.table}"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The following JavaScript code adds a new row to the table (assumed to be single-column) based on input from the query string.

```js
module.exports = function (context, req) {
    context.bindings.newExcelRow = {
        text: req.query.text
        // Add other properties for additional columns here
    }
    context.done();
};
```

### Excel output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [Excel](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/ExcelAttribute.cs) attribute.

### Excel output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Excel` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the auth token. See [Using an Excel table output binding from code](#excel-output-code).|
|**type**| n/a |Required - must be set to `excel`.|
|**direction**| n/a |Required - must be set to `out`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**UserId**	|**userId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**path**|**Path**|Required - the path in OneDrive to the Excel workbook.|
|**worksheetName**|**WorksheetName**|The worksheet in which the table is found.|
|**tableName**|**TableName**|The name of the table. If not specified, the contents of the worksheet will be used.|
|**updateType**|**UpdateType**|Required - The type of change to make to the table. Can be one of the following values:<ul><li><code>update</code> - Replaces the contents of the table in OneDrive.</li><li><code>append</code> - Adds the payload to the end of the table in OneDrive by creating new rows.</li></ul>|

<a name="excel-output-code"></a>
### Excel output - usage

This binding requires the following Azure AD permissions:

|Resource|Permission|
|--------|--------|
|Microsoft Graph|Have full access to user files|

The binding exposes the following types to .NET functions:
- string[][]
- Newtonsoft.Json.Linq.JObject
- Microsoft.Graph.WorkbookTable
- Custom object types (using structural model binding)





<a name="onedrive-input"></a>
## File input

The OneDrive File input binding reads the contents of a file stored in OneDrive.

This section contains the following subsections:

* [Example](#file-input---example)
* [Attributes](#file-input---attributes)
* [Configuration](#file-input---configuration)
* [Usage](#file-input---usage)

### File input - example

See the language-specific example:

* [C# script (.csx)](#file-input---c-script-example)
* [JavaScript](#file-input---javascript-example)

#### File input - C# script example

The following example reads a file that is stored in OneDrive.

The *function.json* file defines an HTTP trigger with a OneDrive file input binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "myOneDriveFile",
      "type": "onedrive",
      "direction": "in",
      "path": "{query.filename}",
      "identity": "userFromRequest"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code reads the file specified in the query string and logs its length:

```csharp
using System.Net;
using Microsoft.Extensions.Logging;

public static void Run(HttpRequestMessage req, Stream myOneDriveFile, ILogger log)
{
    log.LogInformation(myOneDriveFile.Length.ToString());
}
```

#### File input - JavaScript example

The following example reads a file that is stored in OneDrive.

The *function.json* file defines an HTTP trigger with a OneDrive file input binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "myOneDriveFile",
      "type": "onedrive",
      "direction": "in",
      "path": "{query.filename}",
      "identity": "userFromRequest"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The following JavaScript code reads the file specified in the query string and returns its length.

```js
module.exports = function (context, req) {
    context.res = {
        body: context.bindings.myOneDriveFile.length
    };
    context.done();
};
```

### File input - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [OneDrive](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/OneDriveAttribute.cs) attribute.

### File input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `OneDrive` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the file. See [Using a OneDrive file input binding from code](#onedrive-input-code).|
|**type**| n/a |Required - must be set to `onedrive`.|
|**direction**| n/a |Required - must be set to `in`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**userId**|**UserId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**path**|**Path**|Required - the path in OneDrive to the file.|

<a name="onedrive-input-code"></a>
### File input - usage

This binding requires the following Azure AD permissions:

|Resource|Permission|
|--------|--------|
|Microsoft Graph|Read user files|

The binding exposes the following types to .NET functions:
- byte[]
- Stream
- string
- Microsoft.Graph.DriveItem






<a name="onedrive-output"></a>
## File output

The OneDrive file output binding modifies the contents of a file stored in OneDrive.

This section contains the following subsections:

* [Example](#file-output---example)
* [Attributes](#file-output---attributes)
* [Configuration](#file-output---configuration)
* [Usage](#file-output---usage)

### File output - example

See the language-specific example:

* [C# script (.csx)](#file-output---c-script-example)
* [JavaScript](#file-output---javascript-example)

#### File output - C# script example

The following example writes to a file that is stored in OneDrive.

The *function.json* file defines an HTTP trigger with a OneDrive output binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "myOneDriveFile",
      "type": "onedrive",
      "direction": "out",
      "path": "FunctionsTest.txt",
      "identity": "userFromRequest"
    },
    {
      "name": "$return",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code gets text from the query string and writes it to a text file (FunctionsTest.txt as defined in the preceding example) at the root of the caller's OneDrive:

```csharp
using System.Net;
using System.Text;
using Microsoft.Extensions.Logging;

public static async Task Run(HttpRequest req, ILogger log, Stream myOneDriveFile)
{
    string data = req.Query
        .FirstOrDefault(q => string.Compare(q.Key, "text", true) == 0)
        .Value;
    await myOneDriveFile.WriteAsync(Encoding.UTF8.GetBytes(data), 0, data.Length);
    myOneDriveFile.Close();
    return;
}
```

#### File output - JavaScript example

The following example writes to a file that is stored in OneDrive.

The *function.json* file defines an HTTP trigger with a OneDrive output binding:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "myOneDriveFile",
      "type": "onedrive",
      "direction": "out",
      "path": "FunctionsTest.txt",
      "identity": "userFromRequest"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The JavaScript code gets text from the query string and writes it to a text file (FunctionsTest.txt as defined in the config above) at the root of the caller's OneDrive.

```js
module.exports = function (context, req) {
    context.bindings.myOneDriveFile = req.query.text;
    context.done();
};
```

### File output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [OneDrive](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/OneDriveAttribute.cs) attribute.

### File output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `OneDrive` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for file. See [Using a OneDrive file output binding from code](#onedrive-output-code).|
|**type**| n/a |Required - must be set to `onedrive`.|
|**direction**| n/a |Required - must be set to `out`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**UserId**	|**userId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**path**|**Path**|Required - the path in OneDrive to the file.|

<a name="onedrive-output-code"></a>
#### File output - usage

This binding requires the following Azure AD permissions:

|Resource|Permission|
|--------|--------|
|Microsoft Graph|Have full access to user files|

The binding exposes the following types to .NET functions:
- byte[]
- Stream
- string
- Microsoft.Graph.DriveItem





<a name="outlook-output"></a>
## Outlook output

The Outlook message output binding sends a mail message through Outlook.

This section contains the following subsections:

* [Example](#outlook-output---example)
* [Attributes](#outlook-output---attributes)
* [Configuration](#outlook-output---configuration)
* [Usage](#outlook-output---usage)

### Outlook output - example

See the language-specific example:

* [C# script (.csx)](#outlook-output---c-script-example)
* [JavaScript](#outlook-output---javascript-example)

#### Outlook output - C# script example

The following example sends an email through Outlook.

The *function.json* file defines an HTTP trigger with an Outlook message output binding:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "message",
      "type": "outlook",
      "direction": "out",
      "identity": "userFromRequest"
    }
  ],
  "disabled": false
}
```

The C# script code sends a mail from the caller to a recipient specified in the query string:

```csharp
using System.Net;
using Microsoft.Extensions.Logging;

public static void Run(HttpRequest req, out Message message, ILogger log)
{ 
    string emailAddress = req.Query["to"];
    message = new Message(){
        subject = "Greetings",
        body = "Sent from Azure Functions",
        recipient = new Recipient() {
            address = emailAddress
        }
    };
}

public class Message {
    public String subject {get; set;}
    public String body {get; set;}
    public Recipient recipient {get; set;}
}

public class Recipient {
    public String address {get; set;}
    public String name {get; set;}
}
```

#### Outlook output - JavaScript example

The following example sends an email through Outlook.

The *function.json* file defines an HTTP trigger with an Outlook message output binding:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "name": "message",
      "type": "outlook",
      "direction": "out",
      "identity": "userFromRequest"
    }
  ],
  "disabled": false
}
```

The JavaScript code sends a mail from the caller to a recipient specified in the query string:

```js
module.exports = function (context, req) {
    context.bindings.message = {
        subject: "Greetings",
        body: "Sent from Azure Functions with JavaScript",
        recipient: {
            address: req.query.to 
        } 
    };
    context.done();
};
```

### Outlook output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [Outlook](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/OutlookAttribute.cs) attribute.

### Outlook output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `Outlook` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the mail message. See [Using an Outlook message output binding from code](#outlook-output-code).|
|**type**| n/a |Required - must be set to `outlook`.|
|**direction**| n/a |Required - must be set to `out`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**userId**|**UserId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |

<a name="outlook-output-code"></a>
### Outlook output - usage

This binding requires the following Azure AD permissions:

|Resource|Permission|
|--------|--------|
|Microsoft Graph|Send mail as user|

The binding exposes the following types to .NET functions:
- Microsoft.Graph.Message
- Newtonsoft.Json.Linq.JObject
- string
- Custom object types (using structural model binding)






## Webhooks

Webhooks allow you to react to events in the Microsoft Graph. To support webhooks, functions are needed to create, refresh, and react to _webhook subscriptions_. A complete webhook solution requires a combination of the following bindings:
- A [Microsoft Graph webhook trigger](#webhook-trigger) allows you to react to an incoming webhook.
- A [Microsoft Graph webhook subscription input binding](#webhook-input) allows you to list existing subscriptions and optionally refresh them.
- A [Microsoft Graph webhook subscription output binding](#webhook-output) allows you to create or delete webhook subscriptions.

The bindings themselves do not require any Azure AD permissions, but you need to request permissions relevant to the resource type you wish to react to. For a list of which permissions are needed for each resource type, see [subscription permissions](https://docs.microsoft.com/graph/api/subscription-post-subscriptions?view=graph-rest-1.0).

For more information about webhooks, see [Working with webhooks in Microsoft Graph].





## Webhook trigger

The Microsoft Graph webhook trigger allows a function to react to an incoming webhook from the Microsoft Graph. Each instance of this trigger can react to one Microsoft Graph resource type.

This section contains the following subsections:

* [Example](#webhook-trigger---example)
* [Attributes](#webhook-trigger---attributes)
* [Configuration](#webhook-trigger---configuration)
* [Usage](#webhook-trigger---usage)

### Webhook trigger - example

See the language-specific example:

* [C# script (.csx)](#webhook-trigger---c-script-example)
* [JavaScript](#webhook-trigger---javascript-example)

#### Webhook trigger - C# script example

The following example handles webhooks for incoming Outlook messages. To use a webhook trigger you [create a subscription](#webhook-output---example), and you can [refresh the subscription](#webhook-subscription-refresh) to prevent it from expiring.

The *function.json* file defines a webhook trigger:

```json
{
  "bindings": [
    {
      "name": "msg",
      "type": "GraphWebhookTrigger",
      "direction": "in",
      "resourceType": "#Microsoft.Graph.Message"
    }
  ],
  "disabled": false
}
```

The C# script code reacts to incoming mail messages and logs the body of those sent by the recipient and containing "Azure Functions" in the subject:

```csharp
#r "Microsoft.Graph"
using Microsoft.Graph;
using System.Net;
using Microsoft.Extensions.Logging;

public static async Task Run(Message msg, ILogger log)  
{
    log.LogInformation("Microsoft Graph webhook trigger function processed a request.");

    // Testable by sending oneself an email with the subject "Azure Functions" and some text body
    if (msg.Subject.Contains("Azure Functions") && msg.From.Equals(msg.Sender)) {
        log.LogInformation($"Processed email: {msg.BodyPreview}");
    }
}
```

#### Webhook trigger - JavaScript example

The following example handles webhooks for incoming Outlook messages. To use a webhook trigger you [create a subscription](#webhook-output---example), and you can [refresh the subscription](#webhook-subscription-refresh) to prevent it from expiring.

The *function.json* file defines a webhook trigger:

```json
{
  "bindings": [
    {
      "name": "msg",
      "type": "GraphWebhookTrigger",
      "direction": "in",
      "resourceType": "#Microsoft.Graph.Message"
    }
  ],
  "disabled": false
}
```

The JavaScript code reacts to incoming mail messages and logs the body of those sent by the recipient and containing "Azure Functions" in the subject:

```js
module.exports = function (context) {
    context.log("Microsoft Graph webhook trigger function processed a request.");
    const msg = context.bindings.msg
    // Testable by sending oneself an email with the subject "Azure Functions" and some text body
    if((msg.subject.indexOf("Azure Functions") > -1) && (msg.from === msg.sender) ) {
      context.log(`Processed email: ${msg.bodyPreview}`);
    }
    context.done();
};
```

### Webhook trigger - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [GraphWebhookTrigger](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/GraphWebhookTriggerAttribute.cs) attribute.

### Webhook trigger - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `GraphWebhookTrigger` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the mail message. See [Using an Outlook message output binding from code](#outlook-output-code).|
|**type**| n/a |Required - must be set to `graphWebhook`.|
|**direction**| n/a |Required - must be set to `trigger`.|
|**resourceType**|**ResourceType**|Required - the graph resource for which this function should respond to webhooks. Can be one of the following values:<ul><li><code>#Microsoft.Graph.Message</code> - changes made to Outlook messages.</li><li><code>#Microsoft.Graph.DriveItem</code> - changes made to OneDrive root items.</li><li><code>#Microsoft.Graph.Contact</code> - changes made to personal contacts in Outlook.</li><li><code>#Microsoft.Graph.Event</code> - changes made to Outlook calendar items.</li></ul>|

> [!Note]
> A function app can only have one function that is registered against a given `resourceType` value.

### Webhook trigger - usage

The binding exposes the following types to .NET functions:
- Microsoft Graph SDK types relevant to the resource type, such as `Microsoft.Graph.Message` or `Microsoft.Graph.DriveItem`.
- Custom object types (using structural model binding)




<a name="webhook-input"></a>
## Webhook input

The Microsoft Graph webhook input binding allows you to retrieve the list of subscriptions managed by this function app. The binding reads from function app storage, so it does not reflect other subscriptions created from outside the app.

This section contains the following subsections:

* [Example](#webhook-input---example)
* [Attributes](#webhook-input---attributes)
* [Configuration](#webhook-input---configuration)
* [Usage](#webhook-input---usage)

### Webhook input - example

See the language-specific example:

* [C# script (.csx)](#webhook-input---c-script-example)
* [JavaScript](#webhook-input---javascript-example)

#### Webhook input - C# script example

The following example gets all subscriptions for the calling user and deletes them.

The *function.json* file defines an HTTP trigger with a subscription input binding and a subscription output binding that uses the delete action:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "existingSubscriptions",
      "direction": "in",
      "filter": "userFromRequest"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "subscriptionsToDelete",
      "direction": "out",
      "action": "delete",
      "identity": "userFromRequest"
    },
    {
      "type": "http",
      "name": "res",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code gets the subscriptions and deletes them:

```csharp
using System.Net;
using Microsoft.Extensions.Logging;

public static async Task Run(HttpRequest req, string[] existingSubscriptions, IAsyncCollector<string> subscriptionsToDelete, ILogger log)
{
    log.LogInformation("C# HTTP trigger function processed a request.");
    foreach (var subscription in existingSubscriptions)
    {
        log.LogInformation($"Deleting subscription {subscription}");
        await subscriptionsToDelete.AddAsync(subscription);
    }
}
```

#### Webhook input - JavaScript example

The following example gets all subscriptions for the calling user and deletes them.

The *function.json* file defines an HTTP trigger with a subscription input binding and a subscription output binding that uses the delete action:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "existingSubscriptions",
      "direction": "in",
      "filter": "userFromRequest"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "subscriptionsToDelete",
      "direction": "out",
      "action": "delete",
      "identity": "userFromRequest"
    },
    {
      "type": "http",
      "name": "res",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The JavaScript code gets the subscriptions and deletes them:

```js
module.exports = function (context, req) {
    const existing = context.bindings.existingSubscriptions;
    var toDelete = [];
    for (var i = 0; i < existing.length; i++) {
        context.log(`Deleting subscription ${existing[i]}`);
        todelete.push(existing[i]);
    }
    context.bindings.subscriptionsToDelete = toDelete;
    context.done();
};
```

### Webhook input - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [GraphWebhookSubscription](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/GraphWebhookSubscriptionAttribute.cs) attribute.

### Webhook input - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `GraphWebhookSubscription` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the mail message. See [Using an Outlook message output binding from code](#outlook-output-code).|
|**type**| n/a |Required - must be set to `graphWebhookSubscription`.|
|**direction**| n/a |Required - must be set to `in`.|
|**filter**|**Filter**| If set to `userFromRequest`, then the binding will only retrieve subscriptions owned by the calling user (valid only with [HTTP trigger]).| 

### Webhook input - usage

The binding exposes the following types to .NET functions:
- string[]
- Custom object type arrays
- Newtonsoft.Json.Linq.JObject[]
- Microsoft.Graph.Subscription[]





## Webhook output

The webhook subscription output binding allows you to create, delete, and refresh webhook subscriptions in the Microsoft Graph.

This section contains the following subsections:

* [Example](#webhook-output---example)
* [Attributes](#webhook-output---attributes)
* [Configuration](#webhook-output---configuration)
* [Usage](#webhook-output---usage)

### Webhook output - example

See the language-specific example:

* [C# script (.csx)](#webhook-output---c-script-example)
* [JavaScript](#webhook-output---javascript-example)

#### Webhook output - C# script example

The following example creates a subscription. You can [refresh the subscription](#webhook-subscription-refresh) to prevent it from expiring.

The *function.json* file defines an HTTP trigger with a subscription output binding using the create action:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "clientState",
      "direction": "out",
      "action": "create",
      "subscriptionResource": "me/mailFolders('Inbox')/messages",
      "changeTypes": [
        "created"
      ],
      "identity": "userFromRequest"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The C# script code registers a webhook that will notify this function app when the calling user receives an Outlook message:

```csharp
using System;
using System.Net;
using Microsoft.Extensions.Logging;

public static HttpResponseMessage run(HttpRequestMessage req, out string clientState, ILogger log)
{
  log.LogInformation("C# HTTP trigger function processed a request.");
	clientState = Guid.NewGuid().ToString();
	return new HttpResponseMessage(HttpStatusCode.OK);
}
```

#### Webhook output - JavaScript example

The following example creates a subscription. You can [refresh the subscription](#webhook-subscription-refresh) to prevent it from expiring.

The *function.json* file defines an HTTP trigger with a subscription output binding using the create action:

```json
{
  "bindings": [
    {
      "name": "req",
      "type": "httpTrigger",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "clientState",
      "direction": "out",
      "action": "create",
      "subscriptionResource": "me/mailFolders('Inbox')/messages",
      "changeTypes": [
        "created"
      ],
      "identity": "userFromRequest"
    },
    {
      "type": "http",
      "name": "$return",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

The JavaScript code registers a webhook that will notify this function app when the calling user receives an Outlook message:

```js
const uuidv4 = require('uuid/v4');

module.exports = function (context, req) {
    context.bindings.clientState = uuidv4();
    context.done();
};
```

### Webhook output - attributes

In [C# class libraries](functions-dotnet-class-library.md), use the [GraphWebhookSubscription](https://github.com/Azure/azure-functions-microsoftgraph-extension/blob/master/src/MicrosoftGraphBinding/Bindings/GraphWebhookSubscriptionAttribute.cs) attribute.

### Webhook output - configuration

The following table explains the binding configuration properties that you set in the *function.json* file and the `GraphWebhookSubscription` attribute.

|function.json property | Attribute property |Description|
|---------|---------|----------------------|
|**name**| n/a |Required - the variable name used in function code for the mail message. See [Using an Outlook message output binding from code](#outlook-output-code).|
|**type**| n/a |Required - must be set to `graphWebhookSubscription`.|
|**direction**| n/a |Required - must be set to `out`.|
|**identity**|**Identity**|Required - The identity that will be used to perform the action. Can be one of the following values:<ul><li><code>userFromRequest</code> - Only valid with [HTTP trigger]. Uses the identity of the calling user.</li><li><code>userFromId</code> - Uses the identity of a previously logged-in user with the specified ID. See the <code>userId</code> property.</li><li><code>userFromToken</code> - Uses the identity represented by the specified token. See the <code>userToken</code> property.</li><li><code>clientCredentials</code> - Uses the identity of the function app.</li></ul>|
|**userId**|**UserId**	|Needed if and only if _identity_ is set to `userFromId`. A user principal ID associated with a previously logged-in user.|
|**userToken**|**UserToken**|Needed if and only if _identity_ is set to `userFromToken`. A token valid for the function app. |
|**action**|**Action**|Required - specifies the action the binding should perform. Can be one of the following values:<ul><li><code>create</code> - Registers a new subscription.</li><li><code>delete</code> - Deletes a specified subscription.</li><li><code>refresh</code> - Refreshes a specified subscription to keep it from expiring.</li></ul>|
|**subscriptionResource**|**SubscriptionResource**|Needed if and only if the _action_ is set to `create`. Specifies the Microsoft Graph resource that will be monitored for changes. See [Working with webhooks in Microsoft Graph]. |
|**changeType**|**ChangeType**|Needed if and only if the _action_ is set to `create`. Indicates the type of change in the subscribed resource that will raise a notification. The supported values are: `created`, `updated`, `deleted`. Multiple values can be combined using a comma-separated list.|

### Webhook output - usage

The binding exposes the following types to .NET functions:
- string
- Microsoft.Graph.Subscription




<a name="webhook-examples"></a>
## Webhook subscription refresh

There are two approaches to refreshing subscriptions:

- Use the application identity to deal with all subscriptions. This will require consent from an Azure Active Directory admin. This can be used by all languages supported by Azure Functions.
- Use the identity associated with each subscription by manually binding each user ID. This will require some custom code to perform the binding. This can only be used by .NET functions.

This section contains an example for each of these approaches:

* [App identity example](#webhook-subscription-refresh---app-identity-example)
* [User identity example](#webhook-subscription-refresh---user-identity-example)

### Webhook Subscription refresh - app identity example

See the language-specific example:

* [C# script (.csx)](#app-identity-refresh---c-script-example)
* JavaScript

### App identity refresh - C# script example

The following example uses the application identity to refresh a subscription.

The *function.json* defines a timer trigger with a subscription input binding and a  subscription output binding:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 * * */2 * *"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "existingSubscriptions",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "subscriptionsToRefresh",
      "direction": "out",
      "action": "refresh",
      "identity": "clientCredentials"
    }
  ],
  "disabled": false
}
```

The C# script code refreshes the subscriptions:

```csharp
using System;
using Microsoft.Extensions.Logging;

public static void Run(TimerInfo myTimer, string[] existingSubscriptions, ICollector<string> subscriptionsToRefresh, ILogger log)
{
    // This template uses application permissions and requires consent from an Azure Active Directory admin.
    // See https://go.microsoft.com/fwlink/?linkid=858780
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
    foreach (var subscription in existingSubscriptions)
    {
      log.LogInformation($"Refreshing subscription {subscription}");
      subscriptionsToRefresh.Add(subscription);
    }
}
```

### App identity refresh - C# script example

The following example uses the application identity to refresh a subscription.

The *function.json* defines a timer trigger with a subscription input binding and a  subscription output binding:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 * * */2 * *"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "existingSubscriptions",
      "direction": "in"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "subscriptionsToRefresh",
      "direction": "out",
      "action": "refresh",
      "identity": "clientCredentials"
    }
  ],
  "disabled": false
}
```

The JavaScript code refreshes the subscriptions:

```js
// This template uses application permissions and requires consent from an Azure Active Directory admin.
// See https://go.microsoft.com/fwlink/?linkid=858780

module.exports = function (context) {
    const existing = context.bindings.existingSubscriptions;
    var toRefresh = [];
    for (var i = 0; i < existing.length; i++) {
        context.log(`Refreshing subscription ${existing[i]}`);
        toRefresh.push(existing[i]);
    }
    context.bindings.subscriptionsToRefresh = toRefresh;
    context.done();
};
```

### Webhook Subscription refresh - user identity example

The following example uses the user identity to refresh a subscription.

The *function.json* file defines a timer trigger and defers the subscription input binding to the function code:

```json
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 * * */2 * *"
    },
    {
      "type": "graphWebhookSubscription",
      "name": "existingSubscriptions",
      "direction": "in"
    }
  ],
  "disabled": false
}
```

The C# script code refreshes the subscriptions and creates the output binding in code, using each user's identity:

```csharp
using System;
using Microsoft.Extensions.Logging;

public static async Task Run(TimerInfo myTimer, UserSubscription[] existingSubscriptions, IBinder binder, ILogger log)
{
  log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
	foreach (var subscription in existingSubscriptions)
	{
        // binding in code to allow dynamic identity
        using (var subscriptionsToRefresh = await binder.BindAsync<IAsyncCollector<string>>(
            new GraphWebhookSubscriptionAttribute() {
                Action = "refresh",
                Identity = "userFromId",
                UserId = subscription.UserId
            }
        ))
        {
    		log.LogInformation($"Refreshing subscription {subscription}");
            await subscriptionsToRefresh.AddAsync(subscription);
        }

    }
}

public class UserSubscription {
    public string UserId {get; set;}
    public string Id {get; set;}
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)

[HTTP trigger]: functions-bindings-http-webhook.md
[Working with webhooks in Microsoft Graph]: https://developer.microsoft.com/graph/docs/api-reference/v1.0/resources/webhooks
