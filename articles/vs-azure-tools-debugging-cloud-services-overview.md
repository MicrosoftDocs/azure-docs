---
title: Options for debugging Azure cloud services | Microsoft Docs
description: Debugging Azure cloud services
services: visual-studio-online
documentationcenter: n/a
author: TomArcher
manager: douge
editor: ''

ms.assetid: 80755da7-8350-4f5c-97ce-2962beabb36d
ms.service: visual-studio-online
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 03/18/2017
ms.author: tarcher

---
# Learn the various ways to debug an Azure cloud service
This article provides links to the various ways to debug an Azure cloud service. 

## Debugging an Azure cloud service in Visual Studio
You can save time and money by using the Azure compute emulator to debug your cloud service on a local machine. By debugging a service locally before you deploy it, you can improve reliability and performance without paying for compute time. However, some errors might occur only when you run a cloud service in Azure. Errors that occur only when you run a cloud service in Azure can be debugged by enabling remote debugging when you publish your service, and then attaching the debugger to a role instance. For more information, see [Debug your cloud service on your local computer](vs-azure-tools-debug-cloud-services-virtual-machines.md#debug-your-cloud-service-on-your-local-computer).

## Using Azure Diagnostics 
You can use Azure Diagnostics to log detailed information from code running within roles, whether the roles are running in the development environment or in Azure. For more information, see [Enabling Azure Diagnostics in Azure Cloud Services](http://go.microsoft.com/fwlink/p/?LinkId=400450).

## Using IntelliTrace 
If you are using Visual Studio Enterprise to write roles targeted .NET Framework 4.5, you can enable IntelliTrace at the time that you deploy an Azure cloud service from Visual Studio. IntelliTrace provides a log that you can use with Visual Studio to debug your application as if it were running in Azure. For more information, see [Debugging a published cloud service with IntelliTrace and Visual Studio](http://go.microsoft.com/fwlink/p/?LinkId=623016).

## Remote debugging 
You can enable remote debugging on your cloud services at the time when you deploy the cloud service from Visual Studio. If you choose to enable remote debugging for a deployment, remote debugging services are installed on the virtual machines that run each role instance. These services - such as `msvsmon.exe` - do not affect performance or result in extra costs. For more information, see [Debug a cloud service in Azure](vs-azure-tools-debug-cloud-services-virtual-machines.md#debug-a-cloud-service-in-azure).

## Next steps
- [Debugging an Azure cloud service or VM in Visual Studio](./vs-azure-tools-debug-cloud-services-virtual-machines.md) - Learn the details of how to debug Azure cloud services.