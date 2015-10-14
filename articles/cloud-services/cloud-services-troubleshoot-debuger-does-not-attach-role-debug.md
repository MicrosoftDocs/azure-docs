<properties 
   pageTitle="Debuger Does Not Attach Role Debug | Microsoft Azure"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="kevingw"
   manager="jroley"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/21/2015"
   ms.author="kwill" />

# Debugger does not attach to the role that is to be debugged

>[AZURE.NOTE] Only applies to Azure SDK 1.3 and 1.4. The UI has been removed in Azure SDK 1.5.

Sometimes when you use the **Attach to process** option in the compute emulator UI, the debugger attaches  to the WaHostBootstrapper.exe process.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Cause
The Azure compute emulator attempts to attach a debugger to the host bootstrapper process instead of the process which is hosting your role.

## Resolution
Use [CSrun](https://msdn.microsoft.com/library/gg433001) with /launchDebugger parameter of the /run option.

You can also use Microsoft Visual Studio to debug your role instance.

## Next steps

View more [troubleshooting articles](/documentation/articles/?tag=top-support-issue&service=cloud-services) for cloud services.

