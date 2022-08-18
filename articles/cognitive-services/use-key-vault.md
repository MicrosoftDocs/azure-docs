---
title: Develop Azure Cognitive Services applications with Key Vault
description: Learn how to develop Cognitive Services applications securely by using Key Vault.
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: how-to
ms.date: 08/18/2022
---

# Develop Azure Cognitive Services applications with Key Vault

Use this article to learn how to develop Cognitive Services applications securely by using Key Vault.

## Prerequisites

* A valid Azure subscription - Create one for free.
* An [Azure Key Vault](/azure/key-vault/general/quick-create-portal)
* A [Cognitive Services resource](cognitive-services-apis-create-account.md)
* [!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Get your key and endpoint from your Cognitive Services resource

To add your key and endpoint to your key vault, first you need to get them from your Cognitive Services resource.

1. Navigate to your key vault using the [Azure portal](https://portal.azure.com/).
1. From the menu on the left side, select **Keys and Endpoint**. You will use the endpoint and key for the API requests 

    :::image type="content" source="language-service/custom-text-classification/media/get-endpoint-azure.png" alt-text="A screenshot showing the key and endpoint page in the Azure portal" lightbox="language-service/custom-text-classification/media/get-endpoint-azure.png":::

You will use your key and endpoint in the next step to add to your key vault. 

## Add your resource key and endpoint to your key vault

Before your application can retrieve and use your credentials to authenticate its API calls to Cognitive Services, you will need to add your key and endpoint to your [key vault secrets](/azure/key-vault/secrets/about-secrets). 

Repeat these steps for both the key and point your retrieved in the previous step:

1. Open a new browser tab or window. Navigate to your key vault using the [Azure portal](https://portal.azure.com/).
1. On the Key Vault settings pages, select **Secrets**.
1. Click on **Generate/Import**.
1. On the **Create a secret** screen, choose the following values:

    |Name  | Value  |
    |---------|---------|
    |Upload options     | Manual         |
    |Name     | A name for your secret. For example "key" or "endpoint"        |
    |Value     | Paste your key or endpoint.       |
    
1. Leave the other values as their defaults. Click **Create**.

## Create an environment variable for your key vault's name

We recommend creating an environment variable for your Azure key vault's name. Your application will read this environment variable at runtime to retrieve your key and endpoint information.

To set environment variables, use one the following commands - where `KEY_VAULT_NAME` is the name of the environment variable, and `value` is the name of your key vault, which will be stored in the environment variable.

# [Command Line](#tab/command-line)

Create and assign persisted environment variable, given the value.

```CMD
:: Assigns the env var to the value
setx KEY_VAULT_NAME="value"
```

In a new instance of the **Command Prompt**, read the environment variable.

```CMD
:: Prints the env var value
echo %KEY_VAULT_NAME%
```

# [PowerShell](#tab/powershell)

Create and assign persisted environment variable, given the value.

```powershell
# Assigns the env var to the value
[System.Environment]::SetEnvironmentVariable('KEY_VAULT_NAME', 'value', 'User')
```

In a new instance of the **Windows PowerShell**, read the environment variable.

```powershell
# Prints the env var value
[System.Environment]::GetEnvironmentVariable('KEY_VAULT_NAME')
```

# [Bash](#tab/bash)

Create and assign persisted environment variable, given the value.

```Bash
# Assigns the env var to the value
echo export KEY_VAULT_NAME="value" >> /etc/environment && source /etc/environment
```

In a new instance of the **Bash**, read the environment variable.

```Bash
# Prints the env var value
echo "${KEY_VAULT_NAME}"

# Or use printenv:
# printenv KEY_VAULT_NAME
```

---

## Create a new C# application

```csharp
// See https://aka.ms/new-console-template for more information
//Console.WriteLine("Hello, World!");

using System;
using System.Threading.Tasks;
using Azure;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.AI.TextAnalytics;
using System.Net;

namespace key_vault_console_app
{
    class Program
    {
        static async Task Main(string[] args)
        {
            //Name of your key vault
            var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME");

            //variables for retrieving the key and endpoint from your key vault.
            //Make sure these variables match the name you created for your secrets
            const string keySecretName = "key";
            const string endpointSecretName = "endpoint";

            //Endpoint for accessing your key vault
            var kvUri = $"https://{keyVaultName}.vault.azure.net";

            var keyVaultClient = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());

            Console.WriteLine($"Retrieving your secrets from {keyVaultName}.");

            //Key and endpoint secrets retrieved from your key vault
            var keySecret = await keyVaultClient.GetSecretAsync(keySecretName);
            var endpointSecret = await keyVaultClient.GetSecretAsync(endpointSecretName);

            Console.WriteLine("Secrets retrieved successfully");

            EntityRecognitionExample(keySecret.Value.Value, endpointSecret.Value.Value);
            
        }

        // Example method for extracting named entities from text 
        private static void EntityRecognitionExample(string keySecret, string endpointSecret)
        {
            //String to be sent for Named Entity Recognition
            var exampleString = "I had a wonderful trip to Seattle last week.";

            AzureKeyCredential key = new AzureKeyCredential(keySecret);
            Uri endpoint = new Uri(endpointSecret);
            var languageServiceClient = new TextAnalyticsClient(endpoint, key);

            Console.WriteLine($"Sending a Named Entity Recognition (NER) request");
            var response = languageServiceClient.RecognizeEntities(exampleString);
            Console.WriteLine("Named Entities:");
            foreach (var entity in response.Value)
            {
                Console.WriteLine($"\tText: {entity.Text},\tCategory: {entity.Category},\tSub-Category: {entity.SubCategory}");
                Console.WriteLine($"\t\tScore: {entity.ConfidenceScore:F2},\tLength: {entity.Length},\tOffset: {entity.Offset}\n");
            }
        }
    }
}
```
