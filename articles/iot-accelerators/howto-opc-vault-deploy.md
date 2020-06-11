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
> For more information, see the GitHub [OPC Vault repository](https://github.com/Azure/azure-iiot-opc-vault-service).

## Prerequisites

### Install required software

Currently the build and deploy operation is limited to Windows.
The samples are all written for C# .NET Standard, which you need to build the service and samples for deployment.
All the tools you need for .NET Standard come with the .NET Core tools. See [Get started with .NET Core](https://docs.microsoft.com/dotnet/articles/core/getting-started).

1. [Install .NET Core 2.1+][dotnet-install].
2. [Install Docker][docker-url] (optional, only if the local Docker build is required).
4. Install the [Azure command-line tools for PowerShell][powershell-install].
5. Sign up for an [Azure subscription][azure-free].

### Clone the repository

If you haven't done so yet, clone this GitHub repository. Open a command prompt or terminal, and run the following:

```bash
git clone https://github.com/Azure/azure-iiot-opc-vault-service
cd azure-iiot-opc-vault-service 
```

Alternatively, you can clone the repo directly in Visual Studio 2017.

### Build and deploy the Azure service on Windows

A PowerShell script provides an easy way to deploy the OPC Vault microservice and the application.

1. Open a PowerShell window at the repo root. 
3. Go to the deploy folder `cd deploy`.
3. Choose a name for `myResourceGroup` that's unlikely to cause a conflict with other deployed webpages. See the "Website name already in use" section later in this article.
5. Start the deployment with `.\deploy.ps1` for interactive installation, or enter a full command line:  
`.\deploy.ps1  -subscriptionName "MySubscriptionName" -resourceGroupLocation "East US" -tenantId "myTenantId" -resourceGroupName "myResourceGroup"`
7. If you plan to develop with this deployment, add `-development 1` to enable the Swagger UI, and to deploy debug builds.
6. Follow the instructions in the script to sign in to your subscription, and to provide additional information.
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

   > [!NOTE]
   > In case of problems, see the "Troubleshooting deployment failures" section later in the article.

8. Open your favorite browser, and open the application page: `https://myResourceGroup.azurewebsites.net`
8. Give the web app and the OPC Vault microservice a few minutes to warm up after deployment. The web home page might stop responding on first use, for up to a minute, until you get the first responses.
11. To take a look at the Swagger API, open: `https://myResourceGroup-service.azurewebsites.net`
13. To start a local GDS server with dotnet, start `.\myResourceGroup-gds.cmd`. With Docker, start `.\myResourceGroup-dockergds.cmd`.

It's possible to redeploy a build with exactly the same settings. Be aware that such an operation renews all application secrets, and might reset some settings in the Azure Active Directory (Azure AD) application registrations.

It's also possible to redeploy just the web app binaries. With the parameter `-onlyBuild 1`, new zip packages of the service and the app are deployed to the web applications.

After successful deployment, you can start using the services. See [Manage the OPC Vault certificate management service](howto-opc-vault-manage.md).

## Delete the services from the subscription

Here's how:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Go to the resource group in which the service was deployed.
3. Select **Delete resource group**, and confirm.
4. After a short while, all deployed service components are deleted.
5. Go to **Azure Active Directory** > **App registrations**.
6. There should be three registrations listed for each deployed resource group. The registrations have the following names:
`resourcegroup-client`, `resourcegroup-module`, `resourcegroup-service`. Delete each registration separately.

Now all deployed components are removed.

## Troubleshooting deployment failures

### Resource group name

Use a short and simple resource group name. The name is also used to name resources and the service URL prefix. As such, it must comply with resource naming requirements.  

### Website name already in use

It's possible that the name of the website is already in use. You need to use a different resource group name. The hostnames in use by the deployment script are: https:\//resourcegroupname.azurewebsites.net and https:\//resourgroupname-service.azurewebsites.net.
Other names of services are built by the combination of short name hashes, and are unlikely to conflict with other services.

### Azure AD registration 

The deployment script tries to register three Azure AD applications in Azure AD. Depending on your permissions in the selected Azure AD tenant, this operation might fail. There are two options:

- If you chose an Azure AD tenant from a list of tenants, restart the script and choose a different one from the list.
- Alternatively, deploy a private Azure AD tenant in another subscription. Restart the script, and select to use it.

## Deployment script options

The script takes the following parameters:


```
-resourceGroupName
```

This can be the name of an existing or a new resource group.

```
-subscriptionId
```


This is the subscription ID where resources will be deployed. It's optional.

```
-subscriptionName
```


Alternatively, you can use the subscription name.

```
-resourceGroupLocation
```


This is a resource group location. If specified, this parameter tries to create a new resource group in this location. This parameter is also optional.


```
-tenantId
```


This is the Azure AD tenant to use. 

```
-development 0|1
```

This is to deploy for development. Use debug build, and set the ASP.NET environment to Development. Create `.publishsettings` for import in Visual Studio 2017, to allow it to deploy the app and the service directly. This parameter is also optional.

```
-onlyBuild 0|1
```

This is to rebuild and to redeploy only the web apps, and to rebuild the Docker containers. This parameter is also optional.

[azure-free]:https://azure.microsoft.com/free/
[powershell-install]:https://azure.microsoft.com/downloads/#powershell
[docker-url]: https://www.docker.com/
[dotnet-install]: https://www.microsoft.com/net/learn/get-started

## Next steps

Now that you have learned how to deploy OPC Vault from scratch, you can:

> [!div class="nextstepaction"]
> [Manage OPC Vault](howto-opc-vault-manage.md)
