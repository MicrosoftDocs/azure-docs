<properties
   pageTitle="Command-line build for Azure | Microsoft Azure"
   description="Command-line build for Azure"
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/08/2016"
   ms.author="tarcher" />

# Command-Line Build for Azure

## Overview

You can create a package for Azure deployment by running MSBuild at a command prompt. You can configure and define builds for debugging, staging, and production, in addition to automating some of the build process.


## Microsoft Build Engine (MSBuild)

By using the Microsoft Build Engine (MSBuild), you can build products in build lab environments where Visual Studio isn't installed. MSBuild uses an XML format for project files that's extensible and fully supported by Microsoft. In this file format, you can describe what items must be built for one or more platforms and configurations.

You can also run MSBuild at a command prompt, and this topic describes that approach. By setting properties at a command prompt, you can build specific configurations of a project. Similarly, you can also define the targets that the MSBuild command will build. For more information about command-line parameters and MSBuild, see [MSBuild Command Line Reference](https://msdn.microsoft.com/library/ms164311.aspx).

## Installation

As the following procedure describes, you must install software and tools on the build server before you can create an Azure package by using MSBuild:

1. Install the .NET Framework 4 or later, which includes MSBuild.

1. Install the [Azure Authoring Tools](http://go.microsoft.com/fwlink/?LinkId=394615) (look for MicrosoftAzureAuthoringTools-x64.msi or MicrosoftAzureAuthoringTools-x86.msi.

1. Install the [Azure Libraries for .NET](http://go.microsoft.com/fwlink/?LinkId=394616) (look for MicrosoftAzureLibsForNet-x64.msi or MicrosoftAzureLibs-x86.msi.

1. Copy the Microsoft.WebApplication.targets file from a Visual Studio installation on another computer.

    The file is located in the directory C:\Program Files (x86)\MSBuild\Microsoft\Visual Studio\v12.0\WebApplications (v11.0 for Visual Studio 2012), and you should copy it to the same directory on the build server.

1. Install the [Azure Tools for Visual Studio](http://go.microsoft.com/fwlink/?LinkId=394616).

    Look for WindowsAzureTools.vs120.exe to build Visual Studio 2013 projects.

## MSBuild Parameters

The simplest way to create a package is to run MSBuild with the `/t:Publish` option. By default, this command creates a directory in relation to the root folder for the project, such as ProjectDir\bin\Configuration\app.publish\. When you build an Azure project, you generate two files, the package file itself and the accompanying configuration file:

- Project.cspkg

- ServiceConfiguration.TargetProfile.cscfg

By default, each Azure project includes one service-configuration file for local (debugging) builds and another for cloud (staging or production) builds, but you can add or remove service-configuration files as needed. When you build a package within Visual Studio, you will be asked which service-configuration file to include alongside the package. When you build a package by using MSBuild, the local service-configuration file is included by default. To include a different service-configuration file, set the `TargetProfile` property of the MSBuild command (`MSBuild /t:Publish /p:TargetProfile=ProfileName`).

If you want to use an alternate directory for the stored package and configuration files, set the path by using the `/p:PublishDir=Directory\` option, including the trailing backslash separator.

## Deployment

After the package is built, you can deploy it to Azure. For a tutorial that demonstrates that process, see the Azure website. For information about how to automate that process, see [Continuous Delivery for Cloud Services in Azure](./cloud-services/cloud-services-dotnet-continuous-delivery.md).
