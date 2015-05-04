<properties 
	pageTitle="Enable remote debugging with continuous delivery" 
	description="Learn how to enable remote debugging when using continuous delivery to deploy to Azure" 
	services="cloud-services" 
	documentationCenter=".net" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="cloud-services" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-multiple" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="kempb"/>
# Enable remote debugging when using continuous delivery to publish to Azure

You can enable remote debugging in Azure when you use [continuous delivery](cloud-services-dotnet-continuous-delivery.md) to publish to Azure by following these steps.

In this topic:

[Enabling remote debugging for cloud services](#cloudservice)

[Enabling remote debugging for virtual machines](#virtualmachine)

<h2> <a name="cloudservice"></a>Enabling remote debugging for cloud services</h2>

1. On the build agent, set up the initial environment for Azure as outlined in [Command-Line Build for Azure](http://msdn.microsoft.com/library/hh535755.aspx).
2. Because the remote debug runtime (msvsmon.exe) is required for the package, install the [Remote Tools for Visual Studio 2013](http://www.microsoft.com/download/details.aspx?id=40781) (or the [Remote Tools for Visual Studio 2012 Update 4](http://www.microsoft.com/download/details.aspx?id=38184) if you’re using Visual Studio 2012). As an alternative, you can copy the remote debug binaries from a system that has Visual Studio installed.
3. Create a certificate as outlined in [Create a Service Certificate for Azure](http://msdn.microsoft.com/library/azure/gg432987.aspx). Keep the .pfx and RDP certificate thumbprint and upload the certificate to the target cloud service.
4. Use the following options in the MSBuild command line to build and package with remote debug enabled. (Update the paths for your system and project files.)

	/TARGET:PUBLISH /PROPERTY:Configuration=Debug;EnableRemoteDebugger=true;VSX64RemoteDebuggerPath="C:\Remote Debugger\x64\\";RemoteDebuggerConnectorCertificateThumbprint="56D7D1B25B472268E332F7FC0C87286458BFB6B2";RemoteDebuggerConnectorVersion="2.4" "C:\Users\yourusername\Documents\visual studio 2013\Projects\WindowsAzure1\WindowsAzure1.sln"

5. Publish to the target cloud service by using the package and .cscfg file generated in the previous step.
6. Import the certificate (.pfx file) to the machine that has Visual Studio with Azure SDK 2.4 installed.

<h2> <a name="virtualmachine"></a>Enabling remote debugging for virtual machines</h2>

1. Create an Azure virtual machine. See [Create a Virtual Machine Running Windows Server](virtual-machines-windows-tutorial.md) or [Creating Azure Virtual Machines in Visual Studio](http://msdn.microsoft.com/library/azure/dn569263.aspx).
2. On the [Azure portal page](http://go.microsoft.com/fwlink/p/?LinkID=269851), view the virtual machine dashboard to see the virtual machine’s “RDP Certificate Thumbprint”. This is used for the ServerThumbprint value in the extension configuration.
3. Create a client certificate as outlined in [Create a Service Certificate for Azure](http://msdn.microsoft.com/library/azure/gg432987.aspx) (keep the .pfx and RDP certificate thumbprint).
4. Install [Azure Powershell](http://go.microsoft.com/?linkid=9811175&clcid=0x409) (version 0.7.4 or later) from the Microsoft Download Center.
5. Run the following script to enable the RemoteDebug extension. Replace the personal data with your own, such as your subscription name, service name, and thumbprint. (NOTE: This script is configured for Visual Studio 2013. If you’re using Visual Studio 2012, use "RemoteDebugVS2013" for ReferenceName and ExtensionName.)

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
    
    $referenceName = "Microsoft.VisualStudio.WindowsAzure.RemoteDebug.RemoteDebugVS2013"
    $publisher = "Microsoft.VisualStudio.WindowsAzure.RemoteDebug"
    $extensionName = "RemoteDebugVS2013"
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
    
6. Import the certificate (.pfx) to the machine that has Visual Studio with Azure SDK for .NET 2.4 installed.