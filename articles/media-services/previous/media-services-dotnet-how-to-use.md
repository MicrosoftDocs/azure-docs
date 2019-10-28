---
title: How to Set Up Computer for Media Services Development with .NET
description: Learn about the prerequisites for Media Services using the Media Services SDK for .NET. Also learn how to create a Visual Studio app.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: ec2804c7-c656-4fbf-b3e4-3f0f78599a7f
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Media Services development with .NET 

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

This article discusses how to start developing Media Services applications using .NET.

The **Azure Media Services .NET SDK** library enables you to program against Media Services using .NET. To make it even easier to develop with .NET, the **Azure Media Services .NET SDK Extensions** library is provided. This library contains a set of extension methods and helper functions that simplify your .NET code. Both libraries are available through **NuGet** and **GitHub**.

## Prerequisites
* A Media Services account in a new or existing Azure subscription. See the article [How to Create a Media Services Account](media-services-portal-create-account.md).
* Operating Systems: Windows 10, Windows 7, Windows 2008 R2, or Windows 8.
* .NET Framework 4.5 or later.
* Visual Studio.

## Create and configure a Visual Studio project
This section shows you how to create a project in Visual Studio and set it up for Media Services development.  In this case, the project is a C# Windows console application, but the same setup steps shown here apply to other types of projects you can create for Media Services applications (for example, a Windows Forms application or an ASP.NET Web application).

This section shows how to use **NuGet** to add Media Services .NET SDK extensions and other dependent libraries.

Alternatively, you can get the latest Media Services .NET SDK bits from GitHub ([github.com/Azure/azure-sdk-for-media-services](https://github.com/Azure/azure-sdk-for-media-services) or [github.com/Azure/azure-sdk-for-media-services-extensions](https://github.com/Azure/azure-sdk-for-media-services-extensions)), build the solution, and add the references to the client project. All the necessary dependencies get downloaded and extracted automatically.

1. Create a new C# Console Application in Visual Studio. Enter the **Name**, **Location**, and **Solution name**, and then click OK.
2. Build the solution.
3. Use **NuGet** to install and add **Azure Media Services .NET SDK Extensions** (**windowsazure.mediaservices.extensions**). Installing this package, also installs **Media Services .NET SDK** and adds all other required dependencies.
   
    Ensure that you have the newest version of NuGet installed. For more information and installation instructions, see [NuGet](https://nuget.codeplex.com/).

    1. In Solution Explorer, right-click the name of the project and choose **Manage NuGet Packages**.

    2. The Manage NuGet Packages dialog box appears.

    3. In the Online gallery, search for Azure MediaServices Extensions, choose **Azure Media Services .NET SDK Extensions** (**windowsazure.mediaservices.extensions**), and then click the **Install** button.
   
    4. The project is modified and references to the Media Services .NET SDK Extensions,  Media Services .NET SDK, and other dependent assemblies are added.
4. To promote a cleaner development environment, consider enabling NuGet Package Restore. For more information, see [NuGet Package Restore"](https://docs.nuget.org/consume/package-restore).
5. Add a reference to **System.Configuration** assembly. This assembly contains the System.Configuration.**ConfigurationManager** class that is used to access configuration files (for example, App.config).
   
    1. To add references using the Manage References dialog, right-click the project name in the Solution Explorer. Then, click **Add**, then click **Reference...**.
   
    2. The Manage References dialog appears.
    3. Under .NET framework assemblies, find and select the System.Configuration assembly and press **OK**.
6. Open the App.config file and add an **appSettings** section to the file. Set the values that are needed to connect to the Media Services API. For more information, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md). 

    Set the values that are needed to connect using the **Service principal** authentication method.

        ```csharp
                <configuration>
                ...
                    <appSettings>
                        <add key="AMSAADTenantDomain" value="tenant"/>
                        <add key="AMSRESTAPIEndpoint" value="endpoint"/>
                        <add key="AMSClientId" value="id"/>
                        <add key="AMSClientSecret" value="secret"/>
                    </appSettings>
                </configuration>
        ```

7. Add the **System.Configuration** reference to your project.
8. Overwrite the existing **using** statements at the beginning of the Program.cs file with the following code:

    ```csharp	   
            using System;
            using System.Configuration;
            using System.IO;
            using Microsoft.WindowsAzure.MediaServices.Client;
            using System.Threading;
            using System.Collections.Generic;
            using System.Linq;
    ```

    At this point, you are ready to start developing a Media Services application.    

## Example

Here is a small example that connects to the AMS API and lists all available Media Processors.

```csharp
        class Program
        {
            // Read values from the App.config file.

            private static readonly string _AADTenantDomain =
                ConfigurationManager.AppSettings["AMSAADTenantDomain"];
            private static readonly string _RESTAPIEndpoint =
                ConfigurationManager.AppSettings["AMSRESTAPIEndpoint"];
            private static readonly string _AMSClientId =
                ConfigurationManager.AppSettings["AMSClientId"];
            private static readonly string _AMSClientSecret =
                ConfigurationManager.AppSettings["AMSClientSecret"];
        
            private static CloudMediaContext _context = null;
            static void Main(string[] args)
            {
                AzureAdTokenCredentials tokenCredentials = 
                    new AzureAdTokenCredentials(_AADTenantDomain,
                        new AzureAdClientSymmetricKey(_AMSClientId, _AMSClientSecret),
                        AzureEnvironments.AzureCloudEnvironment);

                var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

                _context = new CloudMediaContext(new Uri(_RESTAPIEndpoint), tokenProvider);
        
                // List all available Media Processors
                foreach (var mp in _context.MediaProcessors)
                {
                    Console.WriteLine(mp.Name);
                }
        
            }
 ```

## Next steps

Now [you can connect to the AMS API](media-services-use-aad-auth-to-access-ams-api.md) and start [developing](media-services-dotnet-get-started.md).


## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

