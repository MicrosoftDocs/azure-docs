<properties 
	pageTitle="Installing the Azure SDK 2.4 for Visual Studio 14 CTP2" 
	description="Install Azure SDK 2.4 and Visual Studio 14 CTP2" 
	services="" 
	documentationCenter=".net" 
	authors="ghogen" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="multiple" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="09/24/2014" 
	ms.author="ghogen"/>

# Installing the Azure SDK 2.4 for Visual Studio "14" CTP

To install the Azure SDK 2.4 for .NET with Visual Studio "14" CTPs, follow these steps. This procedure installs SDKs, basic tools, and extended tools for Azure development with Visual Studio "14" CTPs and is not intended to be used with any other version of Visual Studio.

**Note**: Azure SDK 2.4 is not compatible with Visual Studio "14" CTP1.

To install the Azure SDK 2.4 for .NET, follow these steps:

1. Install the latest [Visual Studio "14" CTP](http://go.microsoft.com/fwlink/p/?LinkId=400776).

2. Install each component of the Azure SDK using the links in the following list, in this order. Choose the x86 or x64 version of each of the following components.

       <ul>
        <li>Azure authoring tools: <a href="http://go.microsoft.com/fwlink/p/?LinkId=400892">MicrosoftAzureAuthoringTools-x86.msi</a> or <a href="http://go.microsoft.com/fwlink/p/?LinkId=400893">MicrosoftAzureAuthoringTools-x64.msi</a>.</li>
       <li>Azure compute emulator: <a href="http://go.microsoft.com/fwlink/p/?LinkId=400894">MicrosoftAzureEmulator-x86.exe</a> or <a href="http://go.microsoft.com/fwlink/p/?LinkId=400895">MicrosoftAzureEmulator-x64.exe</a>.</li>
       <li>The Azure client libraries: <a href="http://go.microsoft.com/fwlink/p/?LinkId=400896">MicrosoftAzureLibsForNet-x86.msi</a> or <a href="http://go.microsoft.com/fwlink/p/?LinkId=400897">MicrosoftAzureLibsForNet-x64.msi</a>.</li>
       <li>The storage emulator: <a href="http://go.microsoft.com/fwlink/p/?LinkId=400904">MicrosoftAzureStorageEmulator.msi</a>.                            If you receive a warning regarding local SQL databases, install SQL Server LocalDB 11.0 from <a href="http://go.microsoft.com/fwlink/p/?LinkId=400778">this location</a> for x86 or <a href="http://go.microsoft.com/fwlink/p/?LinkId=400779">this location</a> for x64.</li><li> Azure Tools for Visual Studio: <a href="http://go.microsoft.com/fwlink/p/?LinkId=400903">WindowsAzureTools.vs140.exe</a>.</li></ul>

## Known Issues

1. If you install Visual Studio "14" CTP2 on a machine with Visual Studio 2013 installed, you won't be able to start mobile services in Visual Studio "14" CTP2. To work around this issue, add a  reference to the following assemblies in your mobile services project:

	* packages/Microsoft.Data.OData.5.6.0/lib/net40/Microsoft.Data.OData.dll
	* packages/Microsoft.Data.Edm.5.6.0/lib/net40/Microsoft.Data.Edm.dll

2. Remote debugging for Azure Websites and Mobile Services does not work in Visual Studio "14" CTP2.

## Release Notes

Read the [release notes](http://go.microsoft.com/fwlink/?LinkId=507517) for Azure SDK 2.4.
