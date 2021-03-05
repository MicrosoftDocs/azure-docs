---
title: Sign an HTTP request with C#
description: This is the C# version of signing an HTTP request with an HMAC signature for Communication Services.
author: alexandra142
manager: soricos
services: azure-communication-services

ms.author: apistrak
ms.date: 01/15/2021
ms.topic: include
ms.service: azure-communication-services
---
## Prerequisites

Before you get started, make sure to:
- Create an Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Install [Visual Studio](https://visualstudio.microsoft.com/downloads/) 
- Create an Azure Communication Services resource. For details, see [Create an Azure Communication Resource](../../quickstarts/create-communication-resource.md).You'll need to record your **resourceEndpoint** and  **resourceAccessKey** for this tutorial.



## Sign an HTTP request with C#
Access key authentication uses a shared secret key to generate an HMAC signature for each HTTP request. This signature is generated with the SHA256 algorithm, and is sent in the `Authorization` header using the `HMAC-SHA256` scheme. For example:

```
Authorization: "HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature=<hmac-sha256-signature>"
```

The `hmac-sha256-signature` consists of: 

- HTTP Verb (e.g. `GET` or `PUT`)
- HTTP request path
- Date
- Host
- x-ms-content-sha256

## Setting up
The following steps describe how to construct the Authorization header:

### Create a new C# application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `SignHmacTutorial`. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

```console
dotnet new console -o SignHmacTutorial
```

Change your directory to the newly created app folder and use the `dotnet build` command to compile your application.

```console
cd SignHmacTutorial
dotnet build
```

## Install the package

Install the  package `Newtonsoft.Json`, used for body serialization:

```console
dotnet add package Newtonsoft.Json
```

Update the `Main` method declaration to support async code. Use the following code to begin:

```csharp
using System;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
namespace SignHmacTutorial
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Sign an HTTP request Tutorial");
            // Tutorial code goes here
        }
    }
}

```
## Create a request message

For this example we'll sign a request to create a new identity using the Communication Services Authentication API (version `2021-03-07`)

Add following code to the `Main` method:

```csharp
string resourceEndpoint = "resourceEndpoint";
//Create an uri you are going to call
var requestUri = new Uri($"{resourceEndpoint}/identities?api-version=2021-03-07");
//Endpoint identities?api-version=2021-03-07 accepts list of scopes as a body
var body = new[] { "chat" }; 
var serializedBody = JsonConvert.SerializeObject(body);
var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri)
{
    Content = new StringContent(serializedBody, Encoding.UTF8)
};
```

Replace `resourceEndpoint` with your real resource endpoint value.

## Create content hash

The content hash is a part of your HMAC signature. Use the following code to compute the content hash. You can add this method to `Progam.cs` under the `Main` method.

```csharp
static string ComputeContentHash(string content)
{
    using (var sha256 = SHA256.Create())
    {
        byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(content));
        return Convert.ToBase64String(hashedBytes);
    }
}
```

## Compute a signature
Use the following code to create a method for computing a your HMAC signature.

```csharp
 static string ComputeSignature(string stringToSign)
{
    string secret = "resourceAccessKey";
    using (var hmacsha256 = new HMACSHA256(Convert.FromBase64String(secret)))
    {
        var bytes = Encoding.ASCII.GetBytes(stringToSign);
        var hashedBytes = hmacsha256.ComputeHash(bytes);
        return Convert.ToBase64String(hashedBytes);
    }
}
```

Replace `resourceAccessKey` with access key of your real Azure Communication Services resource.

## Create an authorization header string

We'll now construct the string we'll add to our authorization header:

1. Compute a content hash
2. Specify the Coordinated Universal Time (UTC) timestamp
3. Prepare a string to sign
4. Compute the signature
5. Concatenate the string, which will be used in authorization header
 
Add following code to the `Main` method:

```csharp
// Compute a content hash
var contentHash = ComputeContentHash(serializedBody);
//Specify the Coordinated Universal Time (UTC) timestamp
var date = DateTimeOffset.UtcNow.ToString("r", CultureInfo.InvariantCulture);
//Prepare a string to sign
var stringToSign = $"POST\n{requestUri.PathAndQuery}\n{date};{requestUri.Authority};{contentHash}";
//Compute the signature
var signature = ComputeSignature(stringToSign);
//Concatenate the string, which will be used in authorization header
var authorizationHeader = $"HMAC-SHA256 SignedHeaders=date;host;x-ms-content-sha256&Signature={signature}";
```

## Add headers to requestMessage

Use the following code to add the required headers to your `requestMessage`:

```csharp
//Add content hash header
requestMessage.Headers.Add("x-ms-content-sha256", contentHash);
//add date header
requestMessage.Headers.Add("Date", date);
//add Authorization header
requestMessage.Headers.Add("Authorization", authorizationHeader);
```

## Test the client
Call the endpoint using `HttpClient` and check the response.

```csharp
HttpClient httpClient = new HttpClient
{
    BaseAddress = requestUri
};
var response = await httpClient.SendAsync(requestMessage);
var responseString = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseString);
```
