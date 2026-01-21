---
title: Set up signing integrations to use Artifact Signing 
description: Learn how to set up signing integrations to use Artifact Signing.  
author: TacoTechSharma
ms.author: mesharm 
ms.service: trusted-signing
ms.topic: how-to
ms.date: 01/06/2026 
ms.custom: template-how-to-pattern 
---

# Set up signing integrations to use Artifact Signing

Artifact Signing currently supports the following signing integrations:

- SignTool
- GitHub Actions
- Azure DevOps tasks
- PowerShell for Authenticode
- Azure PowerShell (App Control for Business CI policy)
- Artifact Signing SDK

We constantly work to support more signing integrations. We update the supported integration list when more integrations are available.

This article explains how to set up each supported Artifact Signing signing integration.

## Set up SignTool to use Artifact Signing

This section explains how to set up SignTool to use with Artifact Signing.

### Prerequisites

To complete the steps in this article, you need:

- An Artifact Signing account, identity validation, and certificate profile.
- Individual or group assignment of the Artifact Signing Certificate Profile Signer role.
- Windows 10 Version 1809/October 2018 Update or newer, Windows 11 (all versions), or Windows Server 2016 or newer

### Artifact Signing Client Tools Installer

Artifact Signing Client Tools for SignTool.exe is a library plugin that requires the following components:

1. Windows SDK SignTool.exe (minimum version: 10.0.2261.755)
1. .NET 8 Runtime
1. Microsoft Visual C++ Redistributable
1. Artifact Signing Client Dlib
 
To simplify this setup there is an MSI installer package that is available for download along with a Setup.exe.

> [!div class="nextstepaction"]
> [Artifact Signing Client Tools MSI Download](https://download.microsoft.com/download/a3c24ba9-ff1f-444f-b626-eff710f345c3/ArtifactSigningClientTools.msi)

> [!div class="nextstepaction"]
> [Artifact Signing Client Tools Setup.exe Download](https://download.microsoft.com/download/a3c24ba9-ff1f-444f-b626-eff710f345c3/setup.exe)

#### Installing from the Windows Package Manager

The Artifact Signing Client Tools installer is available on the Windows Package Manager (WinGet).

> [!NOTE]
> winget is available by default in Windows 11 and modern versions of Windows 10. However, it may not be installed in older versions of Windows. See the [winget documentation](/windows/package-manager/winget/) for installation instructions.

   ```PowerShell
   winget install -e --id Microsoft.Azure.TrustedSigningClientTools
   ```

The `-e` option is to ensure the official Artifact Signing Client Tools package is installed. This command installs the latest version by default. To specify a version, add a `-v <version>` with your desired version to the command.

#### Installing from PowerShell
To install the Artifact Signing Client Tools using PowerShell, start PowerShell **as administrator** and run the following command:

   ```PowerShell
  $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri "https://download.microsoft.com/download/70ad2c3b-761f-4aa9-a9de-e7405aa2b4c1/ArtifactSigningClientTools.msi" -OutFile .\ArtifactSigningClientTools.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I ArtifactSigningClientTools.msi /quiet'; Remove-Item .\ArtifactSigningClientTools.msi
   ```

### Summary of manual setup steps

1. [Download and install SignTool](#download-and-install-signtool).
1. [Download and install the .NET 8 Runtime](#download-and-install-net-80-runtime).
1. [Download and install the Artifact Signing dlib package](#download-and-install-the-artifact-signing-dlib-package).
1. [Create a JSON file to provide your Artifact Signing account and a certificate profile](#create-a-json-file).
1. [To Sign a file, Invoke SignTool](#use-signtool-to-sign-a-file).

### Download and install SignTool

Artifact Signing requires the use of SignTool to sign files on Windows, specifically the version of SignTool.exe that's in the Windows 10 SDK 10.0.2261.755 or later. You can install the full Windows 10 SDK via the Visual Studio Installer or [download and install it separately](https://developer.microsoft.com/windows/downloads/windows-sdk/).

To download and install SignTool:

1. Download the latest version of SignTool and Windows Build Tools NuGet at [Microsoft.Windows.SDK.BuildTools](https://www.nuget.org/packages/Microsoft.Windows.SDK.BuildTools/).

1. Install SignTool from the Windows SDK (minimum version: 10.0.2261.755, 20348 Windows SDK version isn't supported with our dlib).

Another option is to use the latest *nuget.exe* file to download and extract the latest Windows SDK Build Tools NuGet package by using PowerShell:

1. Download *nuget.exe* by running the following download command:  

   ```powershell
   Invoke-WebRequest -Uri https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile .\nuget.exe  
   ```

1. Download and extract Windows SDK Build Tools NuGet package by running the following installation command:

   ```powershell
   .\nuget.exe install Microsoft.Windows.SDK.BuildTools -x
   ```
   
### Download and install .NET 8.0 Runtime

The components that SignTool uses to interface with Artifact Signing require the installation of [.NET 8.0 Runtime](https://dotnet.microsoft.com/download/dotnet/8.0) You need only the core .NET 8.0 Runtime. Make sure that you install the correct platform runtime depending on the version of SignTool you intend to run. Or, you can simply install both

For example:

- For x64 SignTool.exe: [Download .NET 8.0 Runtime - Windows x64 installer](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-8.0.18-windows-x64-installer)
- For x86 SignTool.exe: [Download .NET 8.0 Runtime - Windows x86 installer](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-8.0.18-windows-x86-installer)

### Download and install the Artifact Signing dlib package

To download and install the Artifact Signing dlib package (a .zip file):

1. Download the [Artifact Signing dlib package](https://www.nuget.org/packages/Microsoft.ArtifactSigning.Client).

1. Extract the Artifact Signing dlib zipped content and install it on your signing node in your choice of directory. The node must be the node where you use SignTool to sign files.

Another option is to download the [Artifact Signing dlib package](https://www.nuget.org/packages/Microsoft.ArtifactSigning.Client) via NuGet similar like the Windows SDK Build Tools NuGet package:

```powershell
.\nuget.exe install Microsoft.ArtifactSigning.Client -x
```

> [!NOTE]
> We recommend using the latest version of any of the required resources.

### Create a JSON file

To sign by using Artifact Signing, you need to provide the details of your Artifact Signing account and certificate profile that were created as part of the prerequisites. You provide this information on a JSON file by completing these steps:

1. Create a new JSON file (for example, *metadata.json*).
1. Add the specific values for your Artifact Signing account and certificate profile to the JSON file. For more information, see the *metadata.sample.json* file that’s included in the Artifact Signing dlib package or use the following example:

   ```json
   {
     "Endpoint": "<Artifact Signing account endpoint>",
     "CodeSigningAccountName": "<Artifact Signing account name>",
     "CertificateProfileName": "<Certificate profile name>",
     "CorrelationId": "<Optional CorrelationId value>"
   }
   ```
  <sup>1</sup> The optional `"CorrelationId"` field is an opaque string value that you can provide to correlate sign requests with your own workflows, such as build identifiers or machine names.

  > [!IMPORTANT]
  > The `"Endpoint"` URI value must match the region where you created your Artifact Signing account **and** the certificate profile. Use one of the region-specific URIs in the table below. A region/endpoint mismatch commonly causes a 403 Forbidden error and an internal `SignerSign()` failure during signing.

   | Region       | Region class fields  | Endpoint URI value  |
   |--------------|-----------|------------|
   | Brazil South | BrazilSouth | `https://brs.codesigning.azure.net` |
   | Central US  | CentralUS  | `https://cus.codesigning.azure.net` |
   | East US  | EastUS  | `https://eus.codesigning.azure.net` |
   | Japan East | JapanEast | `https://jpe.codesigning.azure.net` |
   | Korea Central | KoreaCentral | `https://krc.codesigning.azure.net` |
   | North Central US  | NorthCentralUS  | `https://ncus.codesigning.azure.net` |
   | North Europe   | NorthEurope   | `https://neu.codesigning.azure.net`   |
   | Poland Central | PolandCentral  | `https://plc.codesigning.azure.net` |
   | South Central US  | SouthCentralUS  | `https://scus.codesigning.azure.net` |
   | Switzerland North  | SwitzerlandNorth  | `https://swn.codesigning.azure.net` |
   | West Central US  | WestCentralUS  | `https://wcus.codesigning.azure.net` |
   | West Europe  | WestEurope   | `https://weu.codesigning.azure.net`   |
   | West US  | WestUS  | `https://wus.codesigning.azure.net` |
   | West US 2   | WestUS2   | `https://wus2.codesigning.azure.net` |
   | West US 3   | WestUS3   | `https://wus3.codesigning.azure.net` |
   
### Authentication

This Task performs authentication using [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), which attempts a series of authentication methods in order. If one method fails, it attempts the next one until authentication is successful.

Each authentication method can be disabled individually to avoid unnecessary attempts.

For example, when authenticating with [EnvironmentCredential](/dotnet/api/azure.identity.environmentcredential) specifically, disable the other credentials with the following inputs:

   ```json
   {
     "Endpoint": "<Trusted Signing account endpoint>",
     "CodeSigningAccountName": "<Trusted Signing account name>",
     "CertificateProfileName": "<Certificate profile name>",
     "CorrelationId": "<Optional CorrelationId value>",
     "ExcludeCredentials": [
        "ManagedIdentityCredential",
        "WorkloadIdentityCredential",
        "SharedTokenCacheCredential",
        "VisualStudioCredential",
        "VisualStudioCodeCredential",
        "AzureCliCredential",
        "AzurePowerShellCredential",
        "AzureDeveloperCliCredential",
        "InteractiveBrowserCredential"
    ]
   }
   ```

Similarly, if using for example an [AzureCliCredential](/dotnet/api/azure.identity.azureclicredential) , then we want to skip over attempting to authenticate with the several methods that come before it in order.


### Use SignTool to sign a file

To invoke SignTool to sign a file:

1. Make a note of where your SDK Build Tools, the extracted *Azure.CodeSigning.Dlib*, and your *metadata.json* file are located (from earlier sections).  

1. Replace the placeholders in the following path with the specific values that you noted in step 1:

   ```console
   & "<Path to SDK bin folder>\x64\signtool.exe" sign /v /debug /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "<Path to Artifact Signing dlib bin folder>\x64\Azure.CodeSigning.Dlib.dll" /dmdf "<Path to metadata file>\metadata.json" <File to sign>
   ```

- Both the x86 and the x64 version of SignTool are included in the Windows SDK. Be sure to reference the corresponding version of *Azure.CodeSigning.Dlib.dll*. The preceding example is for the x64 version of SignTool.
- Make sure that you use the recommended Windows SDK version in the dependencies that are listed at the beginning of this article or the dlib file won't work.

Artifact Signing certificates have a three-day validity, so time stamping is critical for continued successful validation of a signature beyond that three-day validity period. Artifact Signing recommends the use of Artifact Signing’s Microsoft Public RSA Time Stamping Authority: `http://timestamp.acs.microsoft.com/`.

## Use other signing integrations with Artifact Signing

You can also use the following tools or platforms to set up signing integrations with Artifact Signing.

- **GitHub Actions**: To learn how to use a GitHub action for Artifact Signing, see [Artifact Signing - Actions](https://github.com/azure/artifact-signing-action) in GitHub Marketplace. Complete the instructions to set up and use a GitHub action.

- **Azure DevOps task**: To use the Artifact Signing Azure DevOps task, see [Artifact Signing](https://marketplace.visualstudio.com/items?itemName=VisualStudioClient.TrustedSigning&ssr=false#overview) in Visual Studio Marketplace. Complete the instructions for setup.

- **PowerShell for Authenticode**: To use PowerShell for Artifact Signing, see [Artifact Signing](https://www.powershellgallery.com/packages/TrustedSigning/) in PowerShell Gallery to install the PowerShell module.

- **Azure PowerShell - App Control for Business CI policy**: To use Artifact Signing for code integrity (CI) policy signing, follow the instructions in [Sign a new CI policy](./how-to-sign-ci-policy.md) and see [Az.TrustedSigning PowerShell Module](/powershell/azure/install-azps-windows).

- **Artifact Signing SDK**: To create your own signing integration, you can use our open-source [Artifact Signing SDK](https://www.nuget.org/packages/Azure.CodeSigning.Sdk). 

- [**Azure.Developer.ArtifactSigning.CryptoProvider**](https://www.nuget.org/packages/Azure.Developer.ArtifactSigning.CryptoProvider): Simplifies integration of the service with a .NET crypto provider that abstracts the service endpoint integration from the consumer. 
