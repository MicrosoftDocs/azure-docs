---
title: Connect to Azure Media Services v3 API - .NET
description: This article demonstrates how to connect to Media Services v3 API with .NET.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2019
ms.author: juliako
ms.custom: has-adal-ref
---
# Connect to Media Services v3 API - .NET

This article shows you how to connect to the Azure Media Services v3 .NET SDK using the service principal login method.

## Prerequisites

- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name
- Install a tool that you would like to use for .NET development. The steps in this article show how to use [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). You can use Visual Studio Code, see [Working with C#](https://code.visualstudio.com/docs/languages/csharp). Or, you can use a different code editor.

> [!IMPORTANT]
> Review [naming conventions](media-services-apis-overview.md#naming-conventions).

## Create a console application

1. Start Visual Studio. 
1. From the **File** menu, click **New** > **Project**. 
1. Create a **.NET Core** console application.

The sample app in this topic, targets `netcoreapp2.0`. The code uses 'async main', which is available starting with C# 7.1. See this [blog](https://blogs.msdn.microsoft.com/benwilli/2017/12/08/async-main-is-available-but-hidden/) for more details.

## Add required NuGet packages

1. In Visual Studio, select **Tools** > **NuGet Package Manager** > **NuGet Manager Console**.
2. In the **Package Manager Console** window, use `Install-Package` command to add the following NuGet packages. For example, `Install-Package Microsoft.Azure.Management.Media`.

|Package|Description|
|---|---|
|`Microsoft.Azure.Management.Media`|Azure Media Services SDK. <br/>To make sure you are using the latest Azure Media Services package, check [Microsoft.Azure.Management.Media](https://www.nuget.org/packages/Microsoft.Azure.Management.Media).|
|`Microsoft.Rest.ClientRuntime.Azure.Authentication`|ADAL authentication library for Azure SDK for NET|
|`Microsoft.Extensions.Configuration.EnvironmentVariables`|Read configuration values from environment variables and local JSON files|
|`Microsoft.Extensions.Configuration.Json`|Read configuration values from environment variables and local JSON files
|`WindowsAzure.Storage`|Storage SDK|

## Create and configure the app settings file

### Create appsettings.json

1. Go go **General** > **Text file**.
1. Name it "appsettings.json".
1. Set the "Copy to Output Directory" property of the .json file to "Copy if newer" (so that the application is able to access it when published).

### Set values in appsettings.json

Run the `az ams account sp create` command as described in [access APIs](access-api-cli-how-to.md). The command returns json that you should copy into your "appsettings.json".
 
## Add configuration file

For convenience, add a configuration file that is responsible for reading values from "appsettings.json".

1. Add a new .cs class to your project. Name it `ConfigWrapper`. 
1. Paste the following code in this file (this example assumes you have the namespace is `ConsoleApp1`).

```csharp
using System;

using Microsoft.Extensions.Configuration;

namespace ConsoleApp1
{
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

        public string Region
        {
            get { return _config["Region"]; }
        }
    }
}
```

## Connect to the .NET client

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code below, the GetCredentialsAsync function creates the ServiceClientCredentials object based on the credentials supplied in local configuration file.

1. Open `Program.cs`.
1. Paste the following code:

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.Media.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;
using Microsoft.Rest.Azure.Authentication;

namespace ConsoleApp1
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            
            ConfigWrapper config = new ConfigWrapper(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build());

            try
            {
                IAzureMediaServicesClient client = await CreateMediaServicesClientAsync(config);
                Console.WriteLine("connected");
            }
            catch (Exception exception)
            {
                if (exception.Source.Contains("ActiveDirectory"))
                {
                    Console.Error.WriteLine("TIP: Make sure that you have filled out the appsettings.json file before running this sample.");
                }

                Console.Error.WriteLine($"{exception.Message}");

                ApiErrorException apiException = exception.GetBaseException() as ApiErrorException;
                if (apiException != null)
                {
                    Console.Error.WriteLine(
                        $"ERROR: API call failed with error code '{apiException.Body.Error.Code}' and message '{apiException.Body.Error.Message}'.");
                }
            }

            Console.WriteLine("Press Enter to continue.");
            Console.ReadLine();
        }
 
        private static async Task<ServiceClientCredentials> GetCredentialsAsync(ConfigWrapper config)
        {
            // Use ApplicationTokenProvider.LoginSilentWithCertificateAsync or UserTokenProvider.LoginSilentAsync to get a token using service principal with certificate
            //// ClientAssertionCertificate
            //// ApplicationTokenProvider.LoginSilentWithCertificateAsync

            // Use ApplicationTokenProvider.LoginSilentAsync to get a token using a service principal with symmetric key
            ClientCredential clientCredential = new ClientCredential(config.AadClientId, config.AadSecret);
            return await ApplicationTokenProvider.LoginSilentAsync(config.AadTenantId, clientCredential, ActiveDirectoryServiceSettings.Azure);
        }

        private static async Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync(ConfigWrapper config)
        {
            var credentials = await GetCredentialsAsync(config);

            return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
            {
                SubscriptionId = config.SubscriptionId,
            };
        }

    }
}
```

## Next steps

- [Tutorial: Upload, encode, and stream videos - .NET](stream-files-tutorial-with-api.md) 
- [Tutorial: Stream live with Media Services v3 - .NET](stream-live-tutorial-with-api.md)
- [Tutorial: Analyze videos with Media Services v3 - .NET](analyze-videos-tutorial-with-api.md)
- [Create a job input from a local file - .NET](job-input-from-local-file-how-to.md)
- [Create a job input from an HTTPS URL - .NET](job-input-from-http-how-to.md)
- [Encode with a custom Transform - .NET](customize-encoder-presets-how-to.md)
- [Use AES-128 dynamic encryption and the key delivery service - .NET](protect-with-aes128.md)
- [Use DRM dynamic encryption and license delivery service - .NET](protect-with-drm.md)
- [Get a signing key from the existing policy - .NET](get-content-key-policy-dotnet-howto.md)
- [Create filters with Media Services - .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Advanced video on-demand examples of Azure Functions v2 with Media Services v3](https://aka.ms/ams3functions)

## See also

* [.NET reference](https://docs.microsoft.com/dotnet/api/overview/azure/mediaservices/management?view=azure-dotnet)
* For more code examples, see the [.NET SDK samples](https://github.com/Azure-Samples/media-services-v3-dotnet) repo.
