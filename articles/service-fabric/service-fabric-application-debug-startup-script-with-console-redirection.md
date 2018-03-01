---
title: Use console redirection to debug a startup script | Microsoft Docs
description: An overview of how to run a Service Fabric application under system and local security accounts, including the SetupEntry point where an application needs to perform some privileged action before it starts
services: service-fabric
documentationcenter: .net
author: msfussell
manager: timlt
editor: ''

ms.assetid: 4242a1eb-a237-459b-afbf-1e06cfa72732
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 03/01/2018
ms.author: mfussell

---
# Debug a startup script locally using console redirection
Occasionally, it's useful for debugging purposes to see the console output from running a setup script. You can set a console redirection policy on the setup entry point in the service manifest, which writes the output to a file. The file output is written to the application folder called **log** on the cluster node where the application is deployed and run. 

> [!WARNING]
> Never use the console redirection policy in an application that is deployed in production because this can affect the application failover. *Only* use this for local development and debugging purposes.  
> 
> 

The following example shows setting the console redirection with a FileRetentionCount value:

```xml
<SetupEntryPoint>
    <ExeHost>
    <Program>MySetup.bat</Program>
    <WorkingFolder>CodePackage</WorkingFolder>
    <ConsoleRedirection FileRetentionCount="10"/>
    </ExeHost>
</SetupEntryPoint>
```

If you now change the MySetup.ps1 file to write an **Echo** command, this will write to the output file for debugging purposes:

```
Echo "Test console redirection which writes to the application log folder on the node that the application is deployed to"
```

> [!WARNING]
> After you debug your script, immediately remove this console redirection policy.




<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Understand the application model](service-fabric-application-model.md)
* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)

[image1]: ./media/service-fabric-application-runas-security/copy-to-output.png
