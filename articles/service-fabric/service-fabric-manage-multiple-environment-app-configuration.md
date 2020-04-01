---
title: Manage apps for multiple environments
description: Azure Service Fabric applications can be run on clusters that range in size from one machine to thousands of machines. In some cases, you will want to configure your application differently for those varied environments. This article covers how to define different application parameters per environment.
author: mikkelhegn


ms.topic: conceptual
ms.date: 02/23/2018
ms.author: mikhegn
---
# Manage applications for multiple environments

Azure Service Fabric clusters enable you to create clusters using anywhere from one to many thousands machines. In most cases, you find yourself having to deploy your application across multiple cluster configurations: your local development cluster, a shared development cluster and your production cluster. All of these clusters are considered different environments your code has to run in. Application binaries can run without modification across this wide spectrum, but you often want to configure the application differently.

Consider two simple examples:
  - your service listens on a defined port, but you need that port to be different across the environments
  - you need to provide different binding credentials for a database across the environments

## Specifying configuration

The configuration you provide can be divided in two categories:

- Configuration that applies to how your services are run
  - For example, the port number for an endpoint or the number of instances of a service
  - This configuration is specified in the application or service manifest file
- Configuration that applies to your application code
  - For example, binding information for a database
  - This configuration can be provided either through configuration files or environment variables

> [!NOTE]
> Not all attributes in the application and service manifest file support parameters.
> In those cases, you have to rely on substituting strings as part of your deployment workflow. In Azure DevOps you can use an extension like Replace Tokens: https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens or in Jenkins you could run a script task to replace the values.
>

## Specifying parameters during application creation

When creating a named application instances in Service Fabric, you have the option to pass in parameters. The way you do it depends on how you create the application instance.

  - In PowerShell, the [`New-ServiceFabricApplication`](https://docs.microsoft.com/powershell/module/servicefabric/new-servicefabricapplication?view=azureservicefabricps) cmdlet takes the application parameters as a hashtable.
  - Using sfctl, The [`sfctl application create`](https://docs.microsoft.com/azure/service-fabric/service-fabric-sfctl-application#sfctl-application-create) command takes parameters as a JSON string. The install.sh script uses sfctl.
  - Visual Studio provides you with a set of parameter files in the Parameters folder in the application project. These parameter files are used when publishing from Visual Studio, using Azure DevOps Services or Azure DevOps Server. In Visual Studio, the parameter files are being passed on to the Deploy-FabricApplication.ps1 script.

## Next steps
The following articles show you how to use some of the concepts described here:

- [How to specify environment variables for services in Service Fabric](service-fabric-how-to-specify-environment-variables.md)
- [How to specify the port number of a service using parameters in Service Fabric](service-fabric-how-to-specify-port-number-using-parameters.md)
- [How to parameterize configuration files](service-fabric-how-to-parameterize-configuration-files.md)

- [Environment variable reference](service-fabric-environment-variables-reference.md)
