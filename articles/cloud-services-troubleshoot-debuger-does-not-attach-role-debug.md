<properties 
   pageTitle="Debuger Does Not Attach Role Debug"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/12/2015"
   ms.author="adegeo" />

# Debugger Does Not Attach to Role to be Debugged

Applies to: Azure SDK 1.3 and 1.4. The UI has been removed in Azure SDK 1.5.

Symptom: Using the Attach to process option in the compute emulator UI the debugger attaches to the WaHostBootstrapper.exe process.

Cause: The Azure compute emulator attempts to attach a debugger to the host bootstrapper process instead of the process which is hosting your role.

Resolution: Use CSrun with /launchDebugger parameter of the /run option. For more information on CSRun, see [CSRun Command-Line Tool](https://msdn.microsoft.com/en-us/library/gg433001).

You can also use Microsoft Visual Studio to debug your role instance.

## See Also

[Known Issues in Azure Cloud Services](https://msdn.microsoft.com/en-us/library/gg508668)

