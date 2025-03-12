---
title: Pre-send email analysis - Detecting sensitive data and inappropriate content using Azure AI 
titleSuffix: An Azure Communication Services sample
description: How to detect sensitive data and inappropriate content in email messages before sending, using Azure AI in Azure Communication Services.
author: MsftPMACS
manager: darmour
services: azure-communication-services

ms.author: maniss
ms.date: 10/30/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: email
---

# Pre-send email analysis: Detecting sensitive data and inappropriate content using Azure AI

Azure Communication Services email enables organizations to send high volume messages to their customers using their applications. This tutorial shows how to leverage Azure AI to ensure that your messages accurately reflect your business’s brand and reputation before sending them. Azure AI offers services to analyze your email content for sensitive data and identify inappropriate content.

This tutorial describes how to use Azure AI Text Analytics to check for sensitive data and Azure AI Content Safety to identify inappropriate text content. Use these functions to check your content before sending the email using Azure Communication Services.

## Prerequisites 

You need to complete these quickstarts to set up the Azure AI resources: 

- [Quickstart: Detect Personally Identifying Information (PII) in text](/azure/ai-services/language-service/personally-identifiable-information/quickstart) 

- [Quickstart: Moderate text and images with content safety in Azure AI Foundry portal](/azure/ai-studio/quickstarts/content-safety)

## Prerequisite check

1. In a terminal or command window, run the dotnet command to check that the .NET client library is installed.

   `reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP"`
   
2. View the subdomains associated with your Email Communication Services resource. Sign in to the Azure portal. Locate your Email Communication Services resource. Open the **Provision domains** tab from the left navigation pane.

   :::image type="content" source="./media/email-view-subdomains.png" alt-text="Screenshot showing the email subdomains in your Email Communication Services resource in the Azure portal.":::
   
   > [!NOTE]
   > Make sure that the email sub-domain you plan to use for sending email is verified in your email communication resource. For more information, see [Quickstart: How to add custom verified email domains](../quickstarts/email/add-custom-verified-domains.md).
 
3. View the domains connected to your Azure Communication Services resource. Sign in to the Azure portal. Locate your Azure Communication Services resource. Open the **Email** > **Domains** tab from the left navigation pane.
   
   :::image type="content" source="./media/email-view-connected-domains.png" alt-text="Screenshot showing the email domains connected to your Email Communication Services resource in the Azure portal.":::

   > [!NOTE]
   > Verified custom sub-domains must be connected with your Azure Communication Services resource before you use the resource to send emails. For more information, see [Quickstart: How to connect a verified email domain](../quickstarts/email/connect-email-communication-resource.md).

## Create a new C# application

This section describes how to create a new C# application, install required packages, and create the Main function.

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `EmailPreCheck`. This command creates a simple "Hello World" C# project with a single source file: `Program.cs`.
   
   `dotnet new console -o EmailPreCheck`
   
2. Change your directory to the newly created `EmailPreCheck` app folder and use the `dotnet build` command to compile your application.
   
   `cd EmailPreCheck`
   
   `dotnet build`

### Install required packages

From the application directory, install the Azure Communication Services Email client and Azure AI libraries for .NET packages using the `dotnet add package` commands.

`dotnet add package Azure.Communication.Email`

`dotnet add package Azure.AI.TextAnalytics`

`dotnet add package Microsoft.Azure.CognitiveServices.ContentModerator`

`dotnet add package Azure.AI.ContentSafety`

## Create the Main function

Open `Program.cs` and replace the existing contents with the following code. The `using` directives include the `Azure.Communication.Email` and `Azure.AI namespaces`. The rest of the code outlines the `SendMail` function for your program.

```csharp
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using Azure;
using Azure.Communication.Email;
using Azure.AI.TextAnalytics;
using Azure.AI.ContentSafety;
namespace SendEmail
{
  internal class Program
  {
    static async Task Main(string[] args)    {
	// Authenticate and create the Azure Communication Services email client

	// Set sample content
    
    // Pre-check for sensitive data and inappropriate content

	// Send Email
    }
  }
}
```

## Add function that checks for sensitive data

Create a new function to analyze the email subject and body for sensitive data such as social security numbers and credit card numbers.

```csharp
private static async Task<bool> AnalyzeSensitiveData(List<string> documents)
{
// Client authentication goes here


// Function implementation goes here

}
```

### Create the Text Analytics client with authentication

Create a new function with a Text Analytics client that also retrieves your connection information. Add the following code into the `AnalyzeSensitiveData` function to retrieve the connection key and endpoint for the resource from environment variables named `LANGUAGE_KEY` and `LANGUAGE_ENDPOINT`. It also creates the new `TextAnalyticsClient` and `AzureKeyCredential` variables. For more information about managing your Text Analytics connection information, see [Quickstart: Detect Personally Identifiable Information \(PII\) > Get your key and endpoint](/azure/ai-services/language-service/personally-identifiable-information/quickstart#get-your-key-and-endpoint).

```csharp
// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
string languageKey = Environment.GetEnvironmentVariable("LANGUAGE_KEY");
string languageEndpoint = Environment.GetEnvironmentVariable("LANGUAGE_ENDPOINT");
var client = new TextAnalyticsClient(new Uri(languageEndpoint), new AzureKeyCredential(languageKey));

```

### Check the content for sensitive data

Loop through the content to check for any sensitive data. Start the sensitivity check with a baseline of `false`. If sensitive data is found, return `true`.

Add the following code into the `AnalyzeSensitiveData` function following the line that creates the `TextAnalyticsClient` variable. 

```csharp
bool sensitiveDataDetected = false;  // we start with a baseline that of no sensitive data
var actions = new TextAnalyticsActions
{
    RecognizePiiEntitiesActions = new List<RecognizePiiEntitiesAction> { new RecognizePiiEntitiesAction() }
};

var operation = await client.StartAnalyzeActionsAsync(documents, actions);
await operation.WaitForCompletionAsync();

await foreach (var documentResults in operation.Value)
{
    foreach (var actionResult in documentResults.RecognizePiiEntitiesResults)
    {
        if (actionResult.HasError)
        {
            Console.WriteLine($"Error: {actionResult.Error.ErrorCode} - {actionResult.Error.Message}");
                        
        }
        else
        {
            foreach (var document in actionResult.DocumentsResults)
            {
                foreach (var entity in document.Entities)
                {
                    if (document.Entities.Count > 0)
                    {
                        sensitiveDataDetected = true; // Sensitive data detected
                    }

                }
            }
        }
                 
    }
}
return sensitiveDataDetected;
```

## Add function that checks for inappropriate content

Create another new function to analyze the email subject and body for inappropriate content such as hate or violence.

```csharp
static async Task<bool> AnalyzeInappropriateContent(List<string> documents)
{
// Client authentication goes here

// Function implementation goes here
}
```

### Create the Content Safety client with authentication

Create a new function with a Content Safety client that also retrieves your connection information. Add the following code into the `AnalyzeInappropriateContent` function to retrieve the connection key and endpoint for the resource from environment variables named `CONTENT_LANGUAGE_KEY` and `CONTENT_LANGUAGE_ENDPOINT`. It also creates a new `ContentSafetyClient` variable. If you're using the same Azure AI instance for Text Analytics, these values remain the same. For more information about managing your Content Safety connection information, see [Quickstart: Create the Content Safety resource](/azure/ai-services/content-safety/how-to/use-blocklist?tabs=windows%2Ccsharp#prerequisites).

```csharp
// This example requires environment variables named "CONTENT_LANGUAGE_KEY" and "CONTENT_LANGUAGE_ENDPOINT"
 string contentSafetyLanguageKey = Environment.GetEnvironmentVariable("CONTENT_LANGUAGE_KEY");
string contentSafetyEndpoint = Environment.GetEnvironmentVariable("CONTENT_LANGUAGE_ENDPOINT");
var client = new ContentSafetyClient(new Uri(contentSafetyEndpoint), new AzureKeyCredential(contentSafetyLanguageKey));
```

### Check for inappropriate content

Loop through the content to check for inappropriate content. Start the inappropriate content detection with a baseline of `false`. If inappropriate content is found, return `true`.

Add the following code into the `AnalyzeInappropriateContent` function after the line that creates the `ContentSafetyClient` variable.

```csharp
bool inappropriateTextDetected = false;
foreach (var document in documents)
{
    var options = new AnalyzeTextOptions(document);
    AnalyzeTextResult response = await client.AnalyzeTextAsync(options);
    // Check the response
    if (response != null)
    {
        // Access the results from the response
        foreach (var category in response.CategoriesAnalysis)
        {
            if (category.Severity > 2) // Severity: 0=safe, 2=low, 4=medium, 6=high
            {
                inappropriateTextDetected = true;
            }
        }
    }
    else
    {
        Console.WriteLine("Failed to analyze content.");
    }
}
return inappropriateTextDetected; // No inappropriate content detected
```

## Update the Main function to run prechecks and send email

Now that you added the two functions for checking for sensitive data and inappropriate content, you can call them before sending email from Azure Communication Services.

### Create and authenticate the email client
 
You have a few options available for authenticating to an email client. This example fetches your connection string from an environment variable.

Open `Program.cs` in an editor. Add the following code to the body of the Main function to initialize an `EmailClient` with your connection string. This code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. For more information about managing your resource  connection string, see [Quickstart: Create and manage Communication Services resources > Store your connection string](../quickstarts/create-communication-resource.md#store-your-connection-string).

```csharp
// This code shows how to fetch your connection string from an environment variable.
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
EmailClient emailClient = new EmailClient(connectionString);
```

## Add sample content

Add the sample email content into the Main function, following the lines that create the email client.

You need to get the sender email address. For more information about Azure Communication Services email domains, see [Quickstart: How to add Azure Managed Domains to Email Communication Service](../quickstarts/email/add-custom-verified-domains.md). 

Modify the recipient email address variable.

Put both the subject and the message body into a `List<string>` which can be used by the two content checking functions.

```csharp
//Set sample content
var sender = "donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net"; // get the send email from your email resource in the Azure Portal
var recipient = "emailalias@contoso.com"; // modify the recipient
var subject = "Precheck Azure Communication Service Email with Azure AI";
var htmlContent = "<html><body><h1>Precheck email test</h1><br/><h4>This email message is sent from Azure Communication Service Email. </h4>";
htmlContent += "<p> My SSN is 123-12-1234.  My Credit Card Number is: 1234 4321 5678 8765.  My address is 1011 Main St, Redmond, WA, 998052 </p>";
htmlContent += "<p>A 51-year-old man was found dead in his car. There were blood stains on the dashboard and windscreen.";
htmlContent += "At autopsy, a deep, oblique, long incised injury was found on the front of the neck. It turns out that he died by suicide.</p>";
htmlContent += "</body></html>";
List<string> documents = new List<string> { subject, htmlContent };
```

### Pre-check content before sending email

You need to call the two functions to look for violations and use the results to determine whether or not to send the email. Add the following code to the Main function after the sample content.

```csharp
// Pre-Check content
bool containsSensitiveData = await AnalyzeSensitiveData(documents);
bool containsInappropriateContent = await AnalyzeInappropriateContent(documents);

// Send email only if not sensitive data or inappropriate content is detected
if (containsSensitiveData == false && containsInappropriateContent == false)
{

    /// Send the email message with WaitUntil.Started
    EmailSendOperation emailSendOperation = await emailClient.SendAsync(
        Azure.WaitUntil.Started,
        sender,
        recipient,
        subject,
        htmlContent);

    /// Call UpdateStatus on the email send operation to poll for the status manually
    try
    {
        while (true)
        {
            await emailSendOperation.UpdateStatusAsync();
            if (emailSendOperation.HasCompleted)
            {
                break;
            }
            await Task.Delay(100);
        }

        if (emailSendOperation.HasValue)
        {
            Console.WriteLine($"Email queued for delivery. Status = {emailSendOperation.Value.Status}");
        }
    }
    catch (RequestFailedException ex)
    {
        Console.WriteLine($"Email send failed with Code = {ex.ErrorCode} and Message = {ex.Message}");
    }

    /// Get the OperationId so that it can be used for tracking the message for troubleshooting
    string operationId = emailSendOperation.Id;
    Console.WriteLine($"Email operation id = {operationId}");
}
else
{
    Console.WriteLine("Sensitive data and/or inappropriate content detected, email not sent\n\n");
}
```

## Next steps

- Learn more about [Azure Communication Services](../overview.md).
- Learn more about [Azure AI Foundry](/azure/ai-studio/).
