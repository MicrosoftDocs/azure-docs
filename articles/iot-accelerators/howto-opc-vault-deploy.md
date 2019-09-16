---
title: How to deploy the OPC Vault certificate management service - Azure | Microsoft Docs
description: How to deploy the OPC Vault certificate management service from scratch.
author: mregen
ms.author: mregen
ms.date: 08/16/2019
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Build and deploy the OPC Vault certificate management service

This article explains how to deploy the OPC Vault certificate management service in Azure.

> [!NOTE]
> For more information on deployment details and instructions, see the GitHub [OPC Vault repository](https://github.com/Azure/azure-iiot-opc-vault-service).

## Prerequisites

### Install required software

Currently the build and deploy operation is limited to Windows.
The samples are all written for C# .Net Standard, which is needed to build the service and samples for deployment.
All the tools you need for .Net Standard come with the .Net Core tools. See [here](https://docs.microsoft.com/dotnet/articles/core/getting-started) for what you need.

1. [Install .NET Core 2.1+][dotnet-install].
2. [Install Docker][docker-url] (optional, only if the local docker build is required).
4. Install the [Azure Command-line tools for PowerShell][powershell-install].
5. Sign up for an [Azure Subscription][azure-free].

### Clone the repository

If you have not done so yet, clone this GitHub repository.  Open a command prompt or terminal and run:

```bash
git clone https://github.com/Azure/azure-iiot-opc-vault-service
cd azure-iiot-opc-vault-service 
```

or clone the repo directly in Visual Studio 2017.

### Build and deploy the Azure service on Windows

A Powershell script provides an easy way to deploy the OPC Vault microservice and the application.<br>

1. Open a Powershell window at the repo root. 
3. Go to the deploy folder `cd deploy`
3. Choose a name for `myResourceGroup` that's unlikely to cause a conflict with other deployed webpages. See [below](#website-name-already-in-use) how webpage names are chosen based on the name of the resource group.
5. Start the deployment with `.\deploy.ps1` for interactive installation<br>
or enter a full command line:  
`.\deploy.ps1  -subscriptionName "MySubscriptionName" -resourceGroupLocation "East US" -tenantId "myTenantId" -resourceGroupName "myResourceGroup"`
7. If you plan to develop with this deployment, add `-development 1` to enable the Swagger UI and to deploy debug builds.
6. Follow the instructions in the script to sign in to your subscription and to provide additional information.
9. After a successful build and deploy operation, you should see the following message:
   ```
   To access the web client go to:
   https://myResourceGroup.azurewebsites.net

   To access the web service go to:
   https://myResourceGroup-service.azurewebsites.net

   To start the local docker GDS server:
   .\myResourceGroup-dockergds.cmd

   To start the local dotnet GDS server:
   .\myResourceGroup-gds.cmd
   ```

In case you run into issues follow the steps [below](#troubleshooting-deployment-failures).

8. Open your favorite browser and open the application page: `https://myResourceGroup.azurewebsites.net`
8. Give the web app and the OPC Vault microservice a few minutes to warm up after deployment. The web home page may hang on first use for up to a minute until you get the first responses.
11. To take a look at the Swagger Api open: `https://myResourceGroup-service.azurewebsites.net`
13. To start a local GDS server with dotnet start `.\myResourceGroup-gds.cmd` or with docker start `.\myResourceGroup-dockergds.cmd`.

As a sidenote, it is possible to redeploy a build with exactly the same settings. Be aware that such an operation renews all application secrets and may reset some settings in the Azure Active Directory (Azure AD) application registrations.

It is also possible to redeploy just the web app binaries. With the parameter `-onlyBuild 1` new zip packages of the service and the app are deployed to the web applications.

After successful deployment, feel free to start using the services: [How to manage the OPC Vault Certificate Management Service](howto-opc-vault-manage.md)

## Delete the services from the subscription

1. Sign in to the Azure portal: `https://portal.azure.com`.
2. Go to the resource group in which the service was deployed.
3. Select `Delete resource group` and confirm.
4. After a short while all deployed service components are deleted.
5. Now go to `Azure Active Directory/App registrations`.
6. There should be three registrations listed for each deployed resource group with the following names:
`resourcegroup-client`, `resourcegroup-module`, `resourcegroup-service`.
Each registration needs to be deleted separately.
7. Now all deployed components are removed.

## Troubleshooting deployment failures

### Resource group name

Ensure you use a short and simple resource group name.  The name is used also to name resources and the service url prefix and as such, it must comply with resource naming requirements.  

### Website name already in use

It is possible that the name of the website is already in use.  If you run into this error, you need to use a different resource group name. The hostnames in use by the deployment script are: https://resourcegroupname.azurewebsites.net and https://resourgroupname-service.azurewebsites.net.
Other names of services are built by the combination of short name hashes and are unlikely to conflict with other services.

### Azure Active Directory (Azure AD) registration 

The deployment script tries to register three Azure AD applications in Azure Active Directory.  
Depending on your permissions in the selected Azure AD tenant, this operation might fail.   There are two options:

1. If you chose an Azure AD tenant from a list of tenants, restart the script and choose a different one from the list.
2. Alternatively, deploy a private Azure AD tenant in another subscription, restart the script and select to use it.

## Deployment script options

The script takes the following parameters:


```
-resourceGroupName
```

Can be the name of an existing or a new resource group.

```
-subscriptionId
```


Optional, the subscription ID where resources will be deployed.

```
-subscriptionName
```


Or alternatively the subscription name.

```
-resourceGroupLocation
```


Optional, a resource group location. If specified, will try to create a new resource group in this location.


```
-tenantId
```


Azure AD tenant to use. 

```
-development 0|1
```

Optional, to deploy for development. Use debug build and set the ASP.Net Environment to Development. Create '.publishsettings' for import in Visual Studio 2017 to allow it to deploy the app and the service directly.

```
-onlyBuild 0|1
```

Optional, to rebuild and to redeploy only the web apps and to rebuild the docker containers.

[azure-free]:https://azure.microsoft.com/free/
[powershell-install]:https://azure.microsoft.com/downloads/#powershell
[docker-url]: https://www.docker.com/
[dotnet-install]: https://www.microsoft.com/net/learn/get-started

## Next steps

Now that you have learned how to deploy OPC Vault from scratch, here is the suggested next step:

> [!div class="nextstepaction"]
> [Manage OPC Vault](howto-opc-vault-manage.md)
