<properties linkid="dotnet-visual-studio-2014" urlDisplayName="Visual Studio 2014 CTP1" pageTitle="Continuous delivery for cloud services with TFS in Azure" metaKeywords="Visual Studio, Azure SDK" description="Install Azure SDK 2.3 and Visual Studio 2014 CTP1" metaCanonical="" services="" documentationCenter="" title="Installing Azure SDK 2.3 for Visual Studio 2014 CTP1" authors="ghogen" solutions="" manager="" editor="" />

## Installing the Azure SDK 2.3 for Visual Studio 2014 CTP1

To install the Azure SDK 2.3 for .NET with Visual Studio 2014 CTP1, follow these steps. This procedure installs SDKs, basic tools, and extended tools for Azure development with Visual Studio 2014 CPT1 and is not intended to be used with any other version of Visual Studio.

To install the Azure SDK 2.3 for .NET, follow these steps:

1.       Install [Visual Studio 2014 CTP1](http://go.microsoft.com/fwlink/p/?LinkId=400776)
2.       To download each component of the [Azure SDK](http://go.microsoft.com/fwlink/p/?LinkId=400777), use the **Download** button, choose the x86 or x64 version of each of the following components, and then choose **Next**.
       <ol>
       <li>
       Web Tools Extensions: WebToolsExtensionsVS14.msi</li>
        <li>Azure authoring tools: WindowsAzureAuthoringTools-*.msi</li>
       <li>Azure compute emulator: WindowsAzureEmulator-*.msi</li>
       <li>The Azure client libraries: WindowsAzureLibsForNet-*.msi</li>
       <li>The storage emulator: WindowsAzureStorageEmulator.msi.                            If you receive a warning regarding local SQL Databases, install the Storage emulator from <a href="http://go.microsoft.com/fwlink/?LinkId=400779">this location</a> for x64 or <a href="http://go.microsoft.com/fwlink/?LinkId=400778">this location</a> for x86.</li><li> Azure Tools for Visual Studio: WindowsAzureTools.vs140.exe</li></ol>

3. Open the folder where you downloaded the above components, and install them in the order that they appear in the previous list.