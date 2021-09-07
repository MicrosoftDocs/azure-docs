---
title: Develop Azure Functions with Media Services v3
description: This article shows how to start developing Azure Functions with Media Services v3 using Visual Studio Code.
services: media-services
author: xpouyat
ms.service: media-services
ms.workload: media
ms.devlang: dotnet
ms.topic: article
ms.date: 06/09/2021
ms.author: xpouyat
ms.custom: devx-track-csharp
---

# Develop Azure Functions with Media Services v3

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to get started with creating Azure Functions that use Media Services. The Azure Function defined in this article encodes a video file with Media Encoder Standard. As soon as the encoding job has been created, the function returns the job name and output asset name. To review Azure Functions, see [Overview](../../azure-functions/functions-overview.md) and other topics in the **Azure Functions** section.

If you want to explore and deploy existing Azure Functions that use Azure Media Services, check out [Media Services Azure Functions](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration). This repository contains examples that use Media Services to show workflows related to ingesting content directly from blob storage, encoding, and live streaming operations.

## Prerequisites

- Before you can create your first function, you need to have an active Azure account. If you don't already have an Azure account, [free accounts are available](https://azure.microsoft.com/free/).
- If you are going to create Azure Functions that perform actions on your Azure Media Services (AMS) account or listen to events sent by Media Services, you should create an AMS account, as described [here](account-create-how-to.md).
- Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

This article explains how to create a C# .NET 5 function that communicates with Azure Media Services. To create a function with another language, look to this [article](../../azure-functions/functions-develop-vs-code.md).

### Run local requirements

These prerequisites are only required to run and debug your functions locally. They aren't required to create or publish projects to Azure Functions.

- [.NET Core 3.1 and .NET 5 SDKs](https://dotnet.microsoft.com/download/dotnet).

- The [Azure Functions Core Tools](../../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools) version 3.x or later. The Core Tools package is downloaded and installed automatically when you start the project locally. Core Tools includes the entire Azure Functions runtime, so download and installation might take some time.

- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

## Install the Azure Functions extension

You can use the Azure Functions extension to create and test functions and deploy them to Azure.

1. In Visual Studio Code, open **Extensions** and search for **Azure functions**, or select this link in Visual Studio Code: `vscode:extension/ms-azuretools.vscode-azurefunctions`.

1. Select **Install** to install the extension for Visual Studio Code:

    ![Install the extension for Azure Functions](./Media/integrate-azure-functions-dotnet-how-to/vscode-install-extension.png)

1. After installation, select the Azure icon on the Activity bar. You should see an Azure Functions area in the Side Bar.

    ![Azure Functions area in the Side Bar](./Media/integrate-azure-functions-dotnet-how-to/azure-functions-window-vscode.png)

## Create an Azure Functions project

The Functions extension lets you create a function app project, along with your first function. The following steps show how to create an HTTP-triggered function in a new Functions project. HTTP trigger is the simplest function trigger template to demonstrate.

1. From **Azure: Functions**, select the **Create Function** icon:

    ![Create a function](./Media/integrate-azure-functions-dotnet-how-to/create-function.png)

1. Select the folder for your function app project, and then **Select C# for your function project** and **.NET 5 Isolated** for the runtime.

1. Select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](./Media/integrate-azure-functions-dotnet-how-to/create-function-choose-template.png)

1. Type **HttpTriggerEncode** for the function name and select Enter, accept **Company.Function** for the namespace then select **Function** for the access rights. This authorization level requires you to provide a [function key](../../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) when you call the function endpoint.

    ![Select Function authorization](./Media/integrate-azure-functions-dotnet-how-to/create-function-auth.png)

    A function is created in your chosen language and in the template for an HTTP-triggered function.

    ![HTTP-triggered function template in Visual Studio Code](./Media/integrate-azure-functions-dotnet-how-to/new-function-full.png)

## Install Media Services and other extensions

Run the dotnet add package command in the Terminal window to install the extension packages that you need in your project. The following command installs the Media Services package and other extensions needed by the sample.

```bash
dotnet add package Azure.Storage.Blobs
dotnet add package Microsoft.Azure.Management.Media
dotnet add package Microsoft.Identity.Client
dotnet add package Microsoft.AspNetCore.Mvc.Abstractions
dotnet add package Microsoft.AspNetCore.Mvc.Core
```

## Generated project files

The project template creates a project in your chosen language and installs required dependencies. The new project has these files:

* **host.json**: Lets you configure the Functions host. These settings apply when you're running functions locally and when you're running them in Azure. For more information, see [host.json reference](./../../azure-functions/functions-host-json.md).

* **local.settings.json**: Maintains settings used when you're running functions locally. These settings are used only when you're running functions locally.

    >[!IMPORTANT]
    >Because the local.settings.json file can contain secrets, you need to exclude it from your project source control.

* **HttpTriggerEncode.cs** class file that implements the function.

### HttpTriggerEncode.cs

This is the C# code for your function. The function defined below takes a Media Services asset or a source URL and launches an encoding job with Media Services. It uses a Transform that is created if it does not exist. When it is created, it used the preset provided in the input body. 

Replace the content of the existing HttpTriggerEncode.cs file with the following code. Once you are done defining your function click **Save and Run**.

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.Media.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Identity.Client;
using Microsoft.Rest;
using System.Linq;

namespace Functions
{
    public static class SubmitEncodingJob
    {
        /// <summary>
        /// Data to pass as an input to the function
        /// </summary>
        private class RequestBodyModel
        {
            /// <summary>
            /// Name of the asset to encode.
            /// Mandatory, except if you provide inputUrl.
            /// </summary>
            [JsonProperty("inputAssetName")]
            public string InputAssetName { get; set; }

            /// <summary>
            /// Input Url of the file to encode.
            /// Example : "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4"
            /// Mandatory, except if you provide inputAssetName.
            /// </summary>
            [JsonProperty("inputUrl")]
            public string InputUrl { get; set; }

            /// <summary>
            /// Name of the transform.
            /// It will be created if it does not exist. In that case, please set the builtInPreset value to provide the Standard Encoder preset to use.
            /// Mandatory.
            /// </summary>
            [JsonProperty("transformName")]
            public string TransformName { get; set; }

            /// <summary>
            /// If transform does not exist, then the function creates it and use the provided built in preset.
            /// Optional.
            /// </summary>
            [JsonProperty("builtInPreset")]
            public string BuiltInPreset { get; set; }

            /// <summary>
            /// Name of the attached storage account to use for the output asset.
            /// Optional.
            /// </summary>
            [JsonProperty("outputAssetStorageAccount")]
            public string OutputAssetStorageAccount { get; set; }
        }

        /// <summary>
        /// Data output by the function
        /// </summary>
        private class AnswerBodyModel
        {
            /// <summary>
            /// Name of the output asset created.
            /// </summary>
            [JsonProperty("outputAssetName")]
            public string OutputAssetName { get; set; }

            /// <summary>
            /// Name of the job created.
            /// </summary>
            [JsonProperty("jobName")]
            public string JobName { get; set; }
        }

        /// <summary>
        /// Function which submits an encoding job
        /// </summary>
        /// <param name="req"></param>
        /// <param name="executionContext"></param>
        /// <returns></returns>
        [Function("HttpTriggerEncode")]
        public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger("SubmitEncodingJob");
            log.LogInformation("C# HTTP trigger function processed a request.");

            // Get request body data.
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = (RequestBodyModel)JsonConvert.DeserializeObject(requestBody, typeof(RequestBodyModel));

            // Return bad request if input asset name is not passed in
            if (data.InputAssetName == null && data.InputUrl == null)
            {
                return new BadRequestObjectResult("Please pass asset name or input Url in the request body");
            }

            // Return bad request if input asset name is not passed in
            if (data.TransformName == null)
            {
                return new BadRequestObjectResult("Please pass the transform name in the request body");
            }

            ConfigWrapper config = new(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables() // parses the values from the optional .env file at the solution root
                .Build());

            IAzureMediaServicesClient client;
            try
            {
                client = await CreateMediaServicesClientAsync(config);
                log.LogInformation("AMS Client created.");
            }
            catch (Exception e)
            {
                if (e.Source.Contains("ActiveDirectory"))
                {
                    log.LogError("TIP: Make sure that you have filled out the appsettings.json file before running this sample.");
                }
                log.LogError($"{e.Message}");

                return new BadRequestObjectResult(e.Message);
            }

            // Set the polling interval for long running operations to 2 seconds.
            // The default value is 30 seconds for the .NET client SDK
            client.LongRunningOperationRetryTimeout = 2;

            // Creating a unique suffix so that we don't have name collisions if you run the sample
            // multiple times without cleaning up.
            string uniqueness = Guid.NewGuid().ToString().Substring(0, 13);
            string jobName = $"job-{uniqueness}";
            string outputAssetName = $"output-{uniqueness}";

            Transform transform;
            try
            {
                // Ensure that you have the encoding Transform.  This is really a one time setup operation.
                transform = await CreateEncodingTransform(client, log, config.ResourceGroup, config.AccountName, data.TransformName, data.BuiltInPreset);
                log.LogInformation("Transform retrieved.");
            }
            catch (Exception e)
            {
                log.LogError("Error when creating/getting the transform.");
                log.LogError($"{e.Message}");
                return new BadRequestObjectResult(e.Message);
            }

            Asset outputAsset;
            try
            {
                // Output from the job must be written to an Asset, so let's create one
                outputAsset = await CreateOutputAssetAsync(client, log, config.ResourceGroup, config.AccountName, outputAssetName, data.OutputAssetStorageAccount);
                log.LogInformation($"Output asset '{outputAssetName}' created.");
            }
            catch (Exception e)
            {
                log.LogError("Error when creating the output asset.");
                log.LogError($"{e.Message}");
                return new BadRequestObjectResult(e.Message);
            }

            // Job input prepration : asset or url
            JobInput jobInput;
            if (data.InputUrl != null)
            {
                jobInput = new JobInputHttp(files: new[] { data.InputUrl });
                log.LogInformation("Input is a Url.");
            }
            else
            {
                jobInput = new JobInputAsset(assetName: data.InputAssetName);
                log.LogInformation($"Input is asset '{data.InputAssetName}'.");
            }

            Job job;
            try
            {
                // Job submission to Azure Media Services
                job = await SubmitJobAsync(
                                           client,
                                           log,
                                           config.ResourceGroup,
                                           config.AccountName,
                                           data.TransformName,
                                           jobName,
                                           jobInput,
                                           outputAssetName
                                           );
                log.LogInformation($"Job '{jobName}' submitted.");
            }
            catch (Exception e)
            {
                log.LogError("Error when submitting the job.");
                log.LogError($"{e.Message}");
                return new BadRequestObjectResult(e.Message);
            }

            return new OkObjectResult(new AnswerBodyModel
            {
                OutputAssetName = outputAsset.Name,
                JobName = job.Name
            });
        }

        /// <summary>
        /// Creates the AzureMediaServicesClient object based on the credentials
        /// supplied in local configuration file.
        /// </summary>
        /// <param name="config">The param is of type ConfigWrapper, which reads values from local configuration file.</param>
        /// <returns>A task.</returns>
        private static async Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync(ConfigWrapper config)
        {
            ServiceClientCredentials credentials = await GetCredentialsAsync(config);

            return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
            {
                SubscriptionId = config.SubscriptionId
            };
        }

        private static readonly string TokenType = "Bearer";

        /// <summary>
        /// Create the ServiceClientCredentials object based on the credentials
        /// supplied in local configuration file.
        /// </summary>
        /// <param name="config">The param is of type ConfigWrapper. This class reads values from local configuration file.</param>
        /// <returns></returns>
        private static async Task<ServiceClientCredentials> GetCredentialsAsync(ConfigWrapper config)
        {
            var scopes = new[] { config.ArmAadAudience + "/.default" };

            var app = ConfidentialClientApplicationBuilder.Create(config.AadClientId)
                .WithClientSecret(config.AadSecret)
                .WithAuthority(AzureCloudInstance.AzurePublic, config.AadTenantId)
                .Build();

            var authResult = await app.AcquireTokenForClient(scopes)
                                                     .ExecuteAsync()
                                                     .ConfigureAwait(false);

            return new TokenCredentials(authResult.AccessToken, TokenType);
        }

        /// <summary>
        /// If the specified transform exists, return that transform. If the it does not
        /// exist, creates a new transform with the specified output. In this case, the
        /// output is set to encode a video using a predefined preset.
        /// </summary>
        /// <param name="client">The Media Services client.</param>
        /// <param name="log">Function logger.</param>
        /// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
        /// <param name="accountName"> The Media Services account name.</param>
        /// <param name="transformName">The transform name.</param>
        /// <param name="builtInPreset">The built in standard encoder preset to use if the transform is created.</param>
        /// <returns></returns>
        private static async Task<Transform> CreateEncodingTransform(IAzureMediaServicesClient client, ILogger log, string resourceGroupName, string accountName, string transformName, string builtInPreset)
        {
            // Does a transform already exist with the desired name? Assume that an existing Transform with the desired name
            // also uses the same recipe or Preset for processing content.
            Transform transform = client.Transforms.Get(resourceGroupName, accountName, transformName);

            if (transform == null)
            {
                log.LogInformation($"Creating transform '{transformName}'...");

                // Create a new Transform Outputs array - this defines the set of outputs for the Transform
                TransformOutput[] outputs = new TransformOutput[]
                {
                    // Create a new TransformOutput with a custom Standard Encoder Preset
                    // This demonstrates how to create custom codec and layer output settings
                  new TransformOutput(
                        new BuiltInStandardEncoderPreset()
                        {
                            // Pass the buildin preset name.
                            PresetName = builtInPreset
                        },
                        onError: OnErrorType.StopProcessingJob,
                        relativePriority: Priority.Normal
                    )
                };

                string description = $"An encoding transform using {builtInPreset} preset";

                // Create the Transform with the outputs defined above
                transform = await client.Transforms.CreateOrUpdateAsync(resourceGroupName, accountName, transformName, outputs, description);
            }
            else
            {
                log.LogInformation($"Transform '{transformName}' found in AMS account.");
            }

            return transform;
        }

        /// <summary>
        /// Creates an output asset. The output from the encoding Job must be written to an Asset.
        /// </summary>
        /// <param name="client">The Media Services client.</param>
        /// <param name="log">Function logger.</param>
        /// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
        /// <param name="accountName"> The Media Services account name.</param>
        /// <param name="assetName">The output asset name.</param>
        /// <param name="storageAccountName">The output asset storage name.</param>
        /// <returns></returns>
        private static async Task<Asset> CreateOutputAssetAsync(IAzureMediaServicesClient client, ILogger log, string resourceGroupName, string accountName, string assetName, string storageAccountName = null)
        {
            // Check if an Asset already exists
            Asset outputAsset = await client.Assets.GetAsync(resourceGroupName, accountName, assetName);

            if (outputAsset != null)
            {
                // The asset already exists and we are going to overwrite it. In your application, if you don't want to overwrite
                // an existing asset, use an unique name.
                log.LogInformation($"Warning: The asset named {assetName} already exists. It will be overwritten by the function.");
            }
            else
            {
                log.LogInformation("Creating an output asset..");
                outputAsset = new Asset(storageAccountName: storageAccountName);
            }

            return await client.Assets.CreateOrUpdateAsync(resourceGroupName, accountName, assetName, outputAsset);
        }

        /// <summary>
        /// Submits a request to Media Services to apply the specified Transform to a given input video.
        /// </summary>
        /// <param name="client">The Media Services client.</param>
        /// <param name="log">Function logger.</param>
        /// <param name="resourceGroupName">The name of the resource group within the Azure subscription.</param>
        /// <param name="accountName"> The Media Services account name.</param>
        /// <param name="transformName">The name of the transform.</param>
        /// <param name="jobName">The (unique) name of the job.</param>
        /// <param name="jobInput">The input of the job</param>
        /// <param name="outputAssetName">The (unique) name of the  output asset that will store the result of the encoding job. </param>
        private static async Task<Job> SubmitJobAsync(
            IAzureMediaServicesClient client,
            ILogger log,
            string resourceGroupName,
            string accountName,
            string transformName,
            string jobName,
            JobInput jobInput,
            string outputAssetName
            )
        {
            JobOutput[] jobOutputs =
            {
                new JobOutputAsset(outputAssetName),
            };

            // In this example, we are assuming that the job name is unique.
            //
            // If you already have a job with the desired name, use the Jobs.Get method
            // to get the existing job. In Media Services v3, Get methods on entities returns null 
            // if the entity doesn't exist (a case-insensitive check on the name).
            Job job;
            try
            {
                log.LogInformation("Creating a job...");
                job = await client.Jobs.CreateAsync(
                         resourceGroupName,
                         accountName,
                         transformName,
                         jobName,
                         new Job
                         {
                             Input = jobInput,
                             Outputs = jobOutputs,
                         });
            }
            catch (Exception exception)
            {
                if (exception.GetBaseException() is ApiErrorException apiException)
                {
                    log.LogError(
                          $"ERROR: API call failed with error code '{apiException.Body.Error.Code}' and message '{apiException.Body.Error.Message}'.");
                }
                throw;
            }

            return job;
        }
    }

    /// <summary>
    /// This class reads values from local configuration file resources/conf/appsettings.json.
    /// Please change the configuration using your account information. For more information, see
    /// https://docs.microsoft.com/azure/media-services/latest/access-api-cli-how-to. For security
    /// reasons, do not check in the configuration file to source control.
    /// </summary>
    public class ConfigWrapper
    {
        private readonly IConfiguration _config;

        public ConfigWrapper(IConfiguration config)
        {
            _config = config;
        }

        public string SubscriptionId
        {
            get { return _config["SubscriptionId"]; }
        }

        public string ResourceGroup
        {
            get { return _config["ResourceGroup"]; }
        }

        public string AccountName
        {
            get { return _config["AccountName"]; }
        }

        public string AadTenantId
        {
            get { return _config["AadTenantId"]; }
        }

        public string AadClientId
        {
            get { return _config["AadClientId"]; }
        }

        public string AadSecret
        {
            get { return _config["AadSecret"]; }
        }

        public Uri ArmAadAudience
        {
            get { return new Uri(_config["ArmAadAudience"]); }
        }

        public Uri AadEndpoint
        {
            get { return new Uri(_config["AadEndpoint"]); }
        }

        public Uri ArmEndpoint
        {
            get { return new Uri(_config["ArmEndpoint"]); }
        }
    }
}
```

### local.settings.json

Update the file with the following content (and replace the values).

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "AadClientId": "00000000-0000-0000-0000-000000000000",
    "AadEndpoint": "https://login.microsoftonline.com",
    "AadSecret": "00000000-0000-0000-0000-000000000000",
    "AadTenantId": "00000000-0000-0000-0000-000000000000",
    "AccountName": "amsaccount",
    "ArmAadAudience": "https://management.core.windows.net/",
    "ArmEndpoint": "https://management.azure.com/",
    "ResourceGroup": "amsResourceGroup",
    "SubscriptionId": "00000000-0000-0000-0000-000000000000"
  }
}
```

## Test your function

When you run the function locally in VS Code, the function should be exposed as : 

```url
http://localhost:7071/api/HttpTriggerEncode
```

To test your it, you can use Postman to do a POST on this URL using a JSON input body.

JSON input body example :

```json
{
    "inputUrl":"https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4",
    "transformName" : "TransformAS",
    "builtInPreset" :"AdaptiveStreaming"
 }
```

The function should return 200 OK with an output body containing the job and output asset names.

![Test the function with Postman](./Media/integrate-azure-functions-dotnet-how-to/postman.png)

## Next steps

At this point, you are ready to start developing functions that call Media Services API.

For more details and a complete sample of using Azure Functions with Azure Media Services v3, see the [Media Services v3 Azure Functions sample](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration/tree/main/Functions)
