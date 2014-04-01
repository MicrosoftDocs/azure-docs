<properties pageTitle="Azure Spring 2014 release highlights - .NET Dev Center" metaKeywords="azure .net sdk 2.3" description="Learn about the new tools and features available for Azure .NET developers." documentationCenter=".NET" title="Azure Spring 2014 release highlights" authors="mollybos" solutions="" manager="carolz" editor="mollybos" />

# Azure Spring 2014 release highlights

This article summarizes the new tools, features, and themes presented for Azure .NET developers at the Build 2014 conference and available in the Azure SDK for .NET 2.3, Visual Studio 2013 Update 2, and other spring releases. 

**Get the tools:**

- [Visual Studio 2013 Update 2 RC](http://aka.ms/vs2013update2rc)
- [Azure SDK 2.3](http://www.windowsazure.com/en-us/downloads/)
- [Azure PowerShell](http://go.microsoft.com/?linkid=9811175)
- [Azure Cross-Platform Command Line Interface](http://go.microsoft.com/?linkid=9828653)

For complete details about Spring 2014 tools releases, check out the [Azure SDK for .NET 2.3 Release Notes](http://go.microsoft.com/fwlink/p/?LinkId=393548) and the [Visual Studio 2013 Product Updates page](http://go.microsoft.com/fwlink/?LinkId=272487).

[Watch Build videos](http://go.microsoft.com/fwlink/?LinkId=394377&clcid=0x409), live from April 2-4, then streaming on-demand.

## Table of contents

- [Web development and publishing](#webdeploy)
- [Diagnostics and debugging](#diagnostics)
- [Manage Azure services in Visual Studio](#service-management)
- [Automate with PowerShell](#automation)
- [Mobile development with .NET](#mobile)
- [Storage Client Library 3.0 and new Storage emulator](#storage)
- [Resource Manager](#arm)

##<a id="webdeploy"></a>Web development and publishing

The Azure SDK 2.3 and Visual Studio 2013 Update 2 RC include several updates that streamline web development and publishing with Azure. You can now create an Azure web site or virtual machine when you create a new web app and use Web Deploy to deploy to your web site or VM. Check out the following resources for more details and tutorials that describe how to leverage the new features:

- [Get started with Azure and ASP.NET](http://azure.microsoft.com/en-us/documentation/articles/web-sites-dotnet-get-started/) 
- [Getting Started with Azure Tools for Visual Studio](http://msdn.microsoft.com/en-us/library/azure/ff687127.aspx)
- [Creating ASP.NET Web Projects in Visual Studio 2013](http://asp.net/visual-studio/overview/2013/creating-web-projects-in-visual-studio)


## <a id="diagnostics"></a>Diagnostics and debugging
Remotely diagnose application issues using new remote debugging for Virtual Machines and new native code debugging:

- [Debugging a cloud service or virtual machine in Visual Studio](http://msdn.microsoft.com/en-us/library/azure/ff683670.aspx)

Emulator Express is the new lighter-weight local emulator for Cloud Services. Learn how you can use it to test Cloud Services on your local machine: 

- [Using Emulator Express to run and debug Cloud Services](http://msdn.microsoft.com/en-us/library/windowsazure/dn339018.aspx)

You can now remotely view and edit files in your staged or live Azure web site directly in Visual Studio. Find details here:

- [Troubleshooting Azure Web Sites in Visual Studio](http://www.windowsazure.com/en-us/documentation/articles/web-sites-dotnet-troubleshoot-visual-studio)

## <a id="service-management"></a>Manage Azure services in Visual Studio

Leverage improved virtual machine management from Visual Studio, including the ability to create VMs from within the IDE:

- [Create a Virtual Machine from Server Explorer](http://msdn.microsoft.com/en-us/library/windowsazure/dn569263.aspx)
- [Accessing Azure Virtual Machines from Server Explorer](http://msdn.microsoft.com/en-us/library/windowsazure/jj131259.aspx)


We also have a several improvements to help you manage other Azure services more effectively from Server Explorer. For details, see: 

- [Browsing Service Bus resources with the Visual Studio Server Explorer](http://msdn.microsoft.com/en-us/library/windowsazure/jj149828.aspx)
- [Browsing Storage resources with Server Explorer](http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx)


## <a id="automation"></a>Automate with PowerShell

Install Azure Powershell to leverage new cmdlets for Web Sites, WebJobs, and more. For details, see:

- [How to install and configure Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/)
- [Azure PowerShell documentation](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx)

Create PowerShell scripts directly in Visual Studio, and use them to automate your environment creation:

- [Using Windows PowerShell publishing scripts to create and publish to dev and test environments](http://msdn.microsoft.com/en-us/library/windowsazure/dn642480.aspx)

## <a id="mobile"></a>Mobile development with .NET
Azure Mobile Services now provide an option for using .NET-based backends for your mobile apps targeting mobile platforms including Windows Store, Windows Phone, iOS, and Android. To learn more, check out the [Mobile Dev Center](/en-us/develop/mobile/resources/).

Visual Studio 2013 Update 2 also includes new support for mobile development, including remote debugging support and Notification Hubs integration in Server Explorer. For more details, see:

- [Quickstart: Add a mobile service](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn629482.aspx)
- [How to send push notifications to a running app with Visual Studio](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn614131.aspx)
- [How to create custom APIs and scheduled jobs in a mobile service](http://msdn.microsoft.com/en-us/library/windows/apps/xaml/dn614130.aspx)

## <a id="storage"></a>Storage Client Library 3.0
Azure SDK 2.3 includes an updated Storage emulator and the Storage Client Library 3.0 is integrated into the project templates included in the SDK. 

For more details, see:

- [Introduction to Azure Storage](/en-us/documentation/articles/storage-introduction/)
- [Azure Storage documentation](/en-us/documentation/services/storage/)

## <a id="arm"></a>Resource Manager

Resource Manager is a new framework for deploying and managing applications across resources. Experiment with Resource Manager using the new JSON editor, PowerShell cmdlets, and CLI support. For more information, check out:

- [Using Azure PowerShell with Resource Manager](http://go.microsoft.com/fwlink/?LinkID=394767)
- [Using the Azure Cross-Platform Command-Line Interface with the Resource Manager](/en-us/documentation/articles/xplat-cli-azure-resource-manager/)



