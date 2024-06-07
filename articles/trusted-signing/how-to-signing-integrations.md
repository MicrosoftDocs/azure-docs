---
title: Set up signing integrations to use Trusted Signing 
description: Learn how to set up signing integrations to use Trusted Signing.  
author: microsoftshawarma 
ms.author: rakiasegev 
ms.service: trusted-signing
ms.topic: how-to
ms.date: 05/20/2024 
ms.custom: template-how-to-pattern 
---

# Set up signing integrations to use Trusted Signing

Trusted Signing currently supports the following signing integrations:

- SignTool
- GitHub Actions
- Azure DevOps tasks
- PowerShell for Authenticode
- Azure PowerShell (App Control for Business CI policy)
- Trusted Signing SDK

We constantly work to support more signing integrations. We update the supported integration list when more integrations are available.

This article explains how to set up each supported Trusted Signing signing integration.

## Set up SignTool to use Trusted Signing

This section explains how to set up SignTool to use with Trusted Signing.

### Prerequisites

To complete the steps in this article, you need:

- A Trusted Signing account, identity validation, and certificate profile.
- Individual or group assignment of the Trusted Signing Certificate Profile Signer role.

### Summary of steps

1. [Download and install SignTool](#download-and-install-signtool).
1. [Download and install the .NET 8 Runtime](#download-and-install-net-80-runtime).
1. [Download and install the Trusted Signing dlib package](#download-and-install-the-trusted-signing-dlib-package).
1. [Create a JSON file to provide your Trusted Signing account and a certificate profile](#create-a-json-file).
1. [Invoke SignTool to sign a file](#use-signtool-to-sign-a-file).

### Download and install SignTool

Trusted Signing requires the use of SignTool to sign files on Windows, specifically the version of SignTool.exe that's in the Windows 10 SDK 10.0.2261.755 or later. You can install the full Windows 10 SDK via the Visual Studio Installer or [download and install it separately](https://developer.microsoft.com/windows/downloads/windows-sdk/).

To download and install SignTool:

1. Download the latest version of SignTool and Windows Build Tools NuGet at [Microsoft.Windows.SDK.BuildTools](https://www.nuget.org/packages/Microsoft.Windows.SDK.BuildTools/).

1. Install SignTool from the Windows SDK (minimum version: 10.0.2261.755).

Another option is to use the latest *nuget.exe* file to download and extract the latest Windows SDK Build Tools NuGet package by using PowerShell:

1. Download *nuget.exe* by running the following download command:  

   ```powershell
   Invoke-WebRequest -Uri https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile .\nuget.exe  
   ```

1. Download and extract Windows SDK Build Tools NuGet package by running the following installation command:

   ```powershell
   .\nuget.exe install Microsoft.Windows.SDK.BuildTools -Version 10.0.22621.3233 -x
   ```
   
### Download and install .NET 8.0 Runtime

The components that SignTool uses to interface with Trusted Signing require the installation of [.NET 8.0 Runtime](https://dotnet.microsoft.com/download/dotnet/8.0) You need only the core .NET 8.0 Runtime. Make sure that you install the correct platform runtime depending on the version of SignTool you intend to run. Or, you can simply install both

For example:

- For x64 SignTool.exe: [Download .NET 8.0 Runtime - Windows x64 installer](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-8.0.4-windows-x64-installer)
- For x86 SignTool.exe: [Download .NET 8.0 Runtime - Windows x86 installer](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-8.0.4-windows-x86-installer)

### Download and install the Trusted Signing dlib package

To download and install the Trusted Signing dlib package (a .zip file):

1. Download the [Trusted Signing dlib package](https://www.nuget.org/packages/Microsoft.Trusted.Signing.Client).

1. Extract the Trusted Signing dlib zipped content and install it on your signing node in your choice of directory. The node must be the node where you'll use SignTool to sign files.

Another option is to download the [Trusted Signing dlib package](https://www.nuget.org/packages/Microsoft.Trusted.Signing.Client) via NuGet similar like the Windows SDK Build Tools NuGet package:

```powershell
.\nuget.exe install Microsoft.Trusted.Signing.Client -Version 1.0.53 -x
```

### Create a JSON file

To sign by using Trusted Signing, you need to provide the details of your Trusted Signing account and certificate profile that were created as part of the prerequisites. You provide this information on a JSON file by completing these steps:

1. Create a new JSON file (for example, *metadata.json*).
1. Add the specific values for your Trusted Signing account and certificate profile to the JSON file. For more information, see the *metadata.sample.json* file that’s included in the Trusted Signing dlib package or use the following example:

   ```json
   {
     "Endpoint": "<Trusted Signing account endpoint>",
     "CodeSigningAccountName": "<Trusted Signing account name>",
     "CertificateProfileName": "<Certificate profile name>",
     "CorrelationId": "<Optional CorrelationId value>"
   }
   ```

   The `"Endpoint"` URI value must be a URI that aligns with the region where you created your Trusted Signing account and certificate profile when you set up these resources. The table shows regions and their corresponding URIs.

   | Region       | Region class fields  | Endpoint URI value  |
   |--------------|-----------|------------|
   | East US  | EastUS  | `https://eus.codesigning.azure.net` |
   | West US3 <sup>[1]</sup>   | WestUS3  | `https://wus3.codesigning.azure.net` |
   | West Central US  | WestCentralUS  | `https://wcus.codesigning.azure.net` |
   | West US 2   | WestUS2   | `https://wus2.codesigning.azure.net` |
   | North Europe   | NorthEurope   | `https://neu.codesigning.azure.net`   |
   | West Europe   | WestEurope   | `https://weu.codesigning.azure.net`  |

   <sup>1</sup> The optional `"CorrelationId"` field is an opaque string value that you can provide to correlate sign requests with your own workflows, such as build identifiers or machine names.

### Use SignTool to sign a file

To invoke SignTool to sign a file:

1. Make a note of where your SDK Build Tools, the extracted *Azure.CodeSigning.Dlib*, and your *metadata.json* file are located (from earlier sections).  

1. Replace the placeholders in the following path with the specific values that you noted in step 1:

   ```console
   & "<Path to SDK bin folder>\x64\signtool.exe" sign /v /debug /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "<Path to Trusted Signing dlib bin folder>\x64\Azure.CodeSigning.Dlib.dll" /dmdf "<Path to metadata file>\metadata.json" <File to sign> 
   ```

- Both the x86 and the x64 version of SignTool are included in the Windows SDK. Be sure to reference the corresponding version of *Azure.CodeSigning.Dlib.dll*. The preceding example is for the x64 version of SignTool.
- Make sure that you use the recommended Windows SDK version in the dependencies that are listed at the beginning of this article or the dlib file won't work.

Trusted Signing certificates have a three-day validity, so time stamping is critical for continued successful validation of a signature beyond that three-day validity period. Trusted Signing recommends the use of Trusted Signing’s Microsoft Public RSA Time Stamping Authority: `http://timestamp.acs.microsoft.com/`.

## Use other signing integrations with Trusted Signing

You can also use the following tools or platforms to set up signing integrations with Trusted Signing.

- **GitHub Actions**: To learn how to use a GitHub action for Trusted Signing, see [Trusted Signing - Actions](https://github.com/azure/trusted-signing-action) in GitHub Marketplace. Complete the instructions to set up and use a GitHub action.

- **Azure DevOps task**: To use the Trusted Signing Azure DevOps task, see [Trusted Signing](https://marketplace.visualstudio.com/items?itemName=VisualStudioClient.TrustedSigning&ssr=false#overview) in Visual Studio Marketplace. Complete the instructions for setup.

- **PowerShell for Authenticode**: To use PowerShell for Trusted Signing, see [Trusted Signing 0.3.8](https://www.powershellgallery.com/packages/TrustedSigning/0.3.8) in PowerShell Gallery to install the PowerShell module.

- **Azure PowerShell - App Control for Business CI policy**: To use Trusted Signing for code integrity (CI) policy signing, follow the instructions in [Sign a new CI policy](./how-to-sign-ci-policy.md) and see [Az.CodeSigning PowerShell Module](/powershell/azure/install-azps-windows).

- **Trusted Signing SDK**: To create your own signing integration, you can use our open-source [Trusted Signing SDK](https://www.nuget.org/packages/Azure.CodeSigning.Sdk). Note that this SDK version does appear as unlisted. It is still being supported and will be supported when a newer SDK will be released. 
