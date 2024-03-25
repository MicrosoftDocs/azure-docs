---
title: Implement signing integrations with Trusted Signing #Required; page title is displayed in search results. Include the brand.
description: Learn how to set up signing integrations with Trusted Signing. #Required; article description that is displayed in search results. 
author: microsoftshawarma #Required; your GitHub user alias, with correct capitalization.
ms.author: rakiasegev #Required; microsoft alias of author; optional team alias.
ms.service: azure-code-signing #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/21/2024 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Implement Signing Integrations with Trusted Signing

Trusted Signing currently supports the following signing integrations: 
* SignTool
* GitHub Action 
* ADO Task
* PowerShell for Authenticode
* Azure PowerShell - App Control for Business CI Policy
We constantly work to support more signing integrations and will update the above list if/when more are available. 

This article explains how to set up each of the above Trusted Signing signing integrations.


## Set up SignTool with Trusted Signing
This section explains how to set up SignTool to use with Trusted Signing.

Prerequisites: 
* A Trusted Signing account, Identity Validation, and Certificate Profile.
* Ensure there are proper individual or group role assignments for signing (“Trusted Signing Certificate Profile Signer” role).

Overview of steps:  
1.	[Download and install SignTool.](#download-and-install-signtool)
2.	[Download and install the .NET 6 Runtime.](#download-and-install-net-60-runtime)
3.	[Download and install the Trusted Signing Dlib Package.](#download-and-install-trusted-signing-dlib-package)
4.	[Create JSON file to provide your Trusted Signing account and Certificate Profile.](#create-json-file)
5.	[Invoke SignTool.exe to sign a file.](#invoke-signtool-to-sign-a-file)

### Download and install SignTool
Trusted Signing requires the use of SignTool.exe to sign files on Windows, specifically the version of SignTool.exe from the Windows 10 SDK 10.0.19041 or higher. You can install the full Windows 10 SDK via the Visual Studio Installer or [download and install it separately](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/).


To download and install SignTool:

1.	Download the latest version of SignTool + Windows Build Tools NuGet at: [Microsft.Windows.SDK.BuildTools](https://www.nuget.org/packages/Microsoft.Windows.SDK.BuildTools/)
2.	Install SignTool from Windows SDK (min version: 10.0.2261.755)

 Another option is to use the latest nuget.exe to download and extract the latest SDK Build Tools NuGet package by completing the following steps (PowerShell):

1.	Download nuget.exe by running the following download command:  

```
Invoke-WebRequest -Uri https://dist.nuget.org/win-x86-commandline/latest/nuget.exe -OutFile .\nuget.exe  
```

2.	Install nuget.exe by running the following install command:
```
.\nuget.exe install Microsoft.Windows.SDK.BuildTools -Version 10.0.20348.19 
```

### Download and install .NET 6.0 Runtime
The components that SignTool.exe uses to interface with Trusted Signing require the installation of the [.NET 6.0 Runtime](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) You only need the core .NET 6.0 Runtime. Make sure you install the correct platform runtime depending on which version of SignTool.exe you intend to run (or simply install both). For example: 

* For x64 SignTool.exe: [Download Download .NET 6.0 Runtime - Windows x64 Installer](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-6.0.9-windows-x64-installer)
* For x86 SignTool.exe: [Download Download .NET 6.0 Runtime - Windows x86 Installer](https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-6.0.9-windows-x86-installer)

### Download and install Trusted Signing Dlib package
Complete these steps to download and install the Trusted Signing Dlib package (.ZIP):
1.	Download the [Trusted Signing Dlib package](https://www.nuget.org/packages/Azure.CodeSigning.Client). 

2.	Extract the Trusted Signing Dlib zip content and install it onto your signing node in a directory of your choice. You’re required to install it onto the node you’ll be signing files from with SignTool.exe.

### Create JSON file
To sign using Trusted Signing, you need to provide the details of your Trusted Signing Account and Certificate Profile that were created as part of the prerequisites. You provide this information on a JSON file by completing these steps: 
1.	Create a new JSON file (for example `metadata.json`).
2.	Add the specific values for your Trusted Signing Account and Certificate Profile to the JSON file. For more information, see the metadata.sample.json file that’s included in the Trusted Signing Dlib package or refer to the following example: 
```
{ 
  "Endpoint": "<Code Signing Account Endpoint>", 
  "CodeSigningAccountName": "<Code Signing Account Name>", 
  "CertificateProfileName": "<Certificate Profile Name>", 
  "CorrelationId": "<Optional CorrelationId*>" 
} 
```

*	The `"Endpoint"` URI value must have a URI that aligns to the region your Trusted Signing Account and Certificate Profile were created in during the setup of these resources. The table shows regions and their corresponding URI. 

| Region       | Region Class Fields  | Endpoint URI value  |
|--------------|-----------|------------|
| East US  | EastUS  | `https://eus.codesigning.azure.net` |
| West US   | WestUS  | `https://wus.codesigning.azure.net` |
| West Central US  | WestCentralUS  | `https://wcus.codesigning.azure.net/` |
| West US 2   | WestUS2   | `https://wus2.codesigning.azure.net/` |
| North Europe   | NorthEurope   | `https://neu.codesigning.azure.net`   |
| West Europe   | WestEurope   | `https://weu.codesigning.azure.net`  |

* The optional `"CorrelationId"` field is an opaque string value that you can provide to correlate sign requests with your own workflows such as build identifiers or machine names.

### Invoke SignTool to sign a file 
Complete the following steps to invoke SignTool to sign a file for you:
1.	Make a note of where your SDK Build Tools, extracted Azure.CodeSigning.Dlib, and metadata.json file are located (from the previous steps above).  

2.	Replace the placeholders in the following path with the specific values you noted in step 1.

```
& "<Path to SDK bin folder>\x64\signtool.exe" sign /v /debug /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "<Path to Azure Code Signing Dlib bin folder>\x64\Azure.CodeSigning.Dlib.dll" /dmdf "<Path to Metadata file>\metadata.json" <File to sign> 
```
* Both x86 and x64 versions of SignTool.exe are provided as part of the Windows SDK - ensure you reference the corresponding version of Azure.CodeSigning.Dlib.dll. The above example is for the x64 version of SignTool.exe.
* You must make sure you use the recommended Windows SDK version in the dependencies listed at the beginning of this article. Otherwise our dlib won’t work. 

Trusted Signing certificates have a 3-day validity, so timestamping is critical for continued successful validation of a signature beyond that 3-day validity period. Trusted Signing recommends the use of Trusted Signing’s Microsoft Public RSA Time Stamping Authority: `http://timestamp.acs.microsoft.com/`.

## Use other signing integrations with Trusted Signing 
This section explains how to set up other not [SignTool](#set-up-signtool-with-trusted-signing) signing integrations with Trusting Signing.

* GitHub Action – To use the GitHub action for Trusted Signing, visit [Azure Code Signing · Actions · GitHub Marketplace](https://github.com/marketplace/actions/azure-code-signing) and follow the instructions to set up and use GitHub action.

* ADO Task – To use the Trusted Signing AzureDevOps task, visit [Azure Code Signing - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=VisualStudioClient.AzureCodeSigning) and follow the instructions for setup.

* PowerShell for Authenticode – To use PowerShell for Trusted Signing, visit [PowerShell Gallery | AzureCodeSigning 0.2.15](https://www.powershellgallery.com/packages/AzureCodeSigning/0.2.15) to install the PowerShell module. 

* Azure PowerShell – App Control for Business CI Policy - App Control for Windows [link to CI policy signing tutorial].

* Trusted Signing SDK – To create your own signing integration our [Trusted Signing SDK](https://www.nuget.org/packages/Azure.CodeSigning.Sdk) is publicly available.
