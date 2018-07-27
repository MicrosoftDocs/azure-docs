---
title: Common questions for Azure Service Fabric Mesh | Microsoft Docs
description: Learn about commonly asked questions and answers for Azure Service Fabric Mesh.
services: service-fabric-mesh
keywords: 
author: chackdan
ms.author: chackdan
ms.date: 06/25/2018
ms.topic: troubleshooting
ms.service: service-fabric-mesh
manager: timlt
---
# Commonly asked Service Fabric Mesh questions
Azure Service Fabric Mesh is a fully managed service that enables developers to deploy microservices applications without managing virtual machines, storage, or networking. This article has answers to commonly asked questions.

## How do I report an issue or ask a question?

Ask questions, get answers from Microsoft engineers, and report issues in the [service-fabric-mesh-preview GitHub repo](https://aka.ms/sfmeshissues).

## Quota and Cost

**What is the cost of participating in the preview?**

There are no charges for deploying applications or containers to Mesh preview. However you are encouraged to delete the resources you deploy and not leave them running, unless you are actively testing it.

**Is there a quota limit of the number of cores and RAM?**

Yes, the quotas for each subscription are:

- Number of Applications - 5 
- Number of Cores per application– 12 
- Total RAM per application - 48 GB 
- Number of Network and Ingress end points – 5  
- Number of Azure Volumes that you can attach - 10 
- Number of Service replicas – 3 
- The largest container you can deploy is limited to 4 cores, 16-GB RAM.
- You can allocate partial cores to your containers in increments of 0.5 cores up to a maximum of 6 cores.

**Can I leave my application running overnight?**

Yes, you can, however you are encouraged to delete the resources you deploy and not leave them running, unless you are actively testing it. This policy may change in the future and the resources may be deleted if they are being misused.

## Supported container OS images
The following container OS images can be used when deploying services.

- Windows - windowsservercore and nanoserver
    - Windows Server 2016
    - Windows Server version 1709
- Linux
    - No known limitations

## Features Gaps and Known Issues

**After deploying my application, the network resource associated with it does not seem to an IP address**

There is a known issue today with the IP address coming up after a delay. Check the status of the network resource in a few minutes to see the associated IP address.

**My application is failing to access the right network/volume resource**

In your application model, you need to use the full resource ID for networks and volumes to be able to access the associated resource. Here is what this looks like in the quickstart sample:

```json
"networkRefs": [
    {
    "name":  "[resourceId('Microsoft.ServiceFabric/networks', 'SbzVotingNetwork')]" 
    }
]
```

**I do not see the current application model supporting a way to encrypt my secrets**

Yes, encrypting secrets is not supported in the current Private Preview. 

**DNS does not work the same way in my Service Fabric development cluster and in Mesh**

There is a known issue, where you might have to reference services differently in your local development cluster and in Azure Mesh. In your local development cluster use {serviceName}.{applicationName}. In Azure Service Fabric Mesh, use {servicename}. Azure Mesh does not currently support dns resolution across applications.

For other known DNS issues with running a Service Fabric development cluster on Windows 10, see here: [Debug Windows containers](/azure/service-fabric/service-fabric-how-to-debug-windows-containers).

**I get this error when using the CLI module, ImportError: cannot import name 'sdk_no_wait'**

If you are using older CLI version than 2.0.30, you may get this error -

```
cannot import name 'sdk_no_wait'
Traceback (most recent call last):
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\knack\cli.py", line 193, in invoke cmd_result = self.invocation.execute(args)
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\azure\cli\core\commands_init_.py", line 241, in execute self.commands_loader.load_arguments(command)
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\azure\cli\core_init_.py", line 201, in load_arguments self.command_table[command].load_arguments() # this loads the arguments via reflection
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\azure\cli\core\commands_init_.py", line 142, in load_arguments super(AzCliCommand, self).load_arguments()
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\knack\commands.py", line 76, in load_arguments cmd_args = self.arguments_loader()
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\azure\cli\core_init_.py", line 332, in default_arguments_loader op = handler or self.get_op_handler(operation)
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\site-packages\azure\cli\core_init_.py", line 375, in get_op_handler op = import_module(mod_to_import)
File "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\lib\importlib_init_.py", line 126, in import_module return _bootstrap._gcd_import(name[level:], package, level)
File "", line 978, in _gcd_import
File "", line 961, in _find_and_load
File "", line 950, in _find_and_load_unlocked
File "", line 655, in _load_unlocked
File "", line 678, in exec_module
File "", line 205, in _call_with_frames_removed
File "C:\Users\annayak.azure\cliextensions\azure-cli-sbz\azext_sbz\custom.py", line 18, in 
from azure.cli.core.util import get_file_json, shell_safe_json_parse, sdk_no_wait
ImportError: cannot import name 'sdk_no_wait'.
```

**I get a mismatch distribution name error when installing the CLI extension package**

This does not mean that the extension did not install. You should still be able to use the CLI commands without a problem.

**When I scale out, I see that all my containers are affected, including my running ones**

This is a bug and should be fixed in the next runtime refresh.

## Next steps

To learn more about Service Fabric Mesh, read the [overview](service-fabric-mesh-overview.md).
