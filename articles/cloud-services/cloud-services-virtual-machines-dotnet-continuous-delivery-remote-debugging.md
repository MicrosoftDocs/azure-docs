<properties
	pageTitle="Enable remote debugging with continuous delivery | Microsoft Azure"
	description="Learn how to enable remote debugging when using continuous delivery to deploy to Azure"
	services="cloud-services"
	documentationCenter=".net"
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="04/19/2016"
	ms.author="tarcher"/>

# Enable remote debugging when using continuous delivery to publish to Azure

You can enable remote debugging in Azure, for cloud services or virtual machines, when you use [continuous delivery](cloud-services-dotnet-continuous-delivery.md) to publish to Azure by following these steps.

## Enabling remote debugging for cloud services

1. On the build agent, set up the initial environment for Azure as outlined in [Command-Line Build for Azure](http://msdn.microsoft.com/library/hh535755.aspx).
2. Because the remote debug runtime (msvsmon.exe) is required for the package, install the [Remote Tools for Visual Studio 2015](http://www.microsoft.com/en-us/download/details.aspx?id=48155) (or the [Remote Tools for Microsoft Visual Studio 2013 Update 5](https://www.microsoft.com/en-us/download/details.aspx?id=48156) if you’re using Visual Studio 2013). As an alternative, you can copy the remote debug binaries from a system that has Visual Studio installed.
3. Create a certificate as outlined in [Certificates Overview for Azure Cloud Services](cloud-services-certs-create.md). Keep the .pfx and RDP certificate thumbprint and upload the certificate to the target cloud service.
4. Use the following options in the MSBuild command line to build and package with remote debug enabled. (Substitute actual paths to your system and project files for the angle-bracketed items.)

		msbuild /TARGET:PUBLISH /PROPERTY:Configuration=Debug;EnableRemoteDebugger=true;VSX64RemoteDebuggerPath="<remote tools path>";RemoteDebuggerConnectorCertificateThumbprint="<thumbprint of the certificate added to the cloud service>";RemoteDebuggerConnectorVersion="2.7" "<path to your VS solution file>"

	`VSX64RemoteDebuggerPath` is the path to the folder containing msvsmon.exe in the Remote Tools for Visual Studio.
	`RemoteDebuggerConnectorVersion` is the Azure SDK version in your cloud service. It should also match the version installed with Visual Studio.

5. Publish to the target cloud service by using the package and .cscfg file generated in the previous step.
6. Import the certificate (.pfx file) to the machine that has Visual Studio with Azure SDK for .NET installed. Make sure to import to the `CurrentUser\My` certificate store, otherwise attaching to the debugger in Visual Studio will fail.

## Enabling remote debugging for virtual machines

1. Create an Azure virtual machine. See [Create a Virtual Machine Running Windows Server](../virtual-machines/virtual-machines-windows-hero-tutorial.md) or [Create and Manage Azure Virtual Machines in Visual Studio](../virtual-machines/virtual-machines-windows-classic-manage-visual-studio.md).
2. On the [Azure classic portal page](http://go.microsoft.com/fwlink/p/?LinkID=269851), view the virtual machine's dashboard to see the virtual machine’s **RDP CERTIFICATE THUMBPRINT**. This value is used for the `ServerThumbprint` value in the extension configuration.
3. Create a client certificate as outlined in [Certificates Overview for Azure Cloud Services](cloud-services-certs-create.md) (keep the .pfx and RDP certificate thumbprint).
4. Install Azure Powershell (version 0.7.4 or later) as outlined in [How to install and configure Azure PowerShell](../powershell-install-configure.md).
5. Run the following script to enable the RemoteDebug extension. Replace the paths and personal data with your own, such as your subscription name, service name, and thumbprint.

	>[AZURE.NOTE] This script is configured for Visual Studio 2015. If you’re using Visual Studio 2013, modify the `$referenceName` and `$extensionName` assignments below to use `RemoteDebugVS2013` (instead of `RemoteDebugVS2015`).

	<pre>
    Add-AzureAccount

    Select-AzureSubscription "My Microsoft Subscription"

    $vm = Get-AzureVM -ServiceName "mytestvm1" -Name "mytestvm1"

    $endpoints = @(
    ,@{Name="RDConnVS2013"; PublicPort=30400; PrivatePort=30398}
    ,@{Name="RDFwdrVS2013"; PublicPort=31400; PrivatePort=31398}
    )

    foreach($endpoint in $endpoints)
    {
    Add-AzureEndpoint -VM $vm -Name $endpoint.Name -Protocol tcp -PublicPort $endpoint.PublicPort -LocalPort $endpoint.PrivatePort
    }

    $referenceName = "Microsoft.VisualStudio.WindowsAzure.RemoteDebug.RemoteDebugVS2015"
    $publisher = "Microsoft.VisualStudio.WindowsAzure.RemoteDebug"
    $extensionName = "RemoteDebugVS2015"
    $version = "1.*"
    $publicConfiguration = "<PublicConfig><Connector.Enabled>true</Connector.Enabled><ClientThumbprint>56D7D1B25B472268E332F7FC0C87286458BFB6B2</ClientThumbprint><ServerThumbprint>E7DCB00CB916C468CC3228261D6E4EE45C8ED3C6</ServerThumbprint><ConnectorPort>30398</ConnectorPort><ForwarderPort>31398</ForwarderPort></PublicConfig>"

    $vm | Set-AzureVMExtension `
    -ReferenceName $referenceName `
    -Publisher $publisher `
    -ExtensionName $extensionName `
    -Version $version `
    -PublicConfiguration $publicConfiguration

    foreach($extension in $vm.VM.ResourceExtensionReferences)
    {
    if(($extension.ReferenceName -eq $referenceName) `
    -and ($extension.Publisher -eq $publisher) `
    -and ($extension.Name -eq $extensionName) `
    -and ($extension.Version -eq $version))
    {
    $extension.ResourceExtensionParameterValues[0].Key = 'config.txt'
    break
    }
    }

    $vm | Update-AzureVM
	</pre>

6. Import the certificate (.pfx) to the machine that has Visual Studio with Azure SDK for .NET installed.
