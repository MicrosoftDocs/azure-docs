---
title: Authenticate with an Azure container registry | Microsoft Docs
description: How to log in to an Azure container registry using an Azure Active Directory service principal or an admin account
services: container-registry
documentationcenter: ''
author: stevelas
manager: balans
editor: dlepow
tags: ''
keywords: ''

ms.assetid: 128a937a-766a-415b-b9fc-35a6c2f27417
ms.service: container-registry
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/09/2016
ms.author: stevelas
---
# Authenticate with a container registry
To work with container images in an Azure container registry, you log in using the `docker login` command. You can log in using either an **[Azure Active Directory service principal](../active-directory/active-directory-application-objects.md)** or a registry-specific **admin account**. This article provides more detail about these identities. 


> [!NOTE]
> Container Registry is currently in preview. In preview, individual Azure Active Directory identities (which enable per-user access and control) are not supported to authenticate with a container registry. 
> 





## Service principal

You can [assign a service principal](container-registry-get-started-azure-cli.md#assign-a-service-principal) to your registry and use it for basic Docker authentication. You provide the app ID and password of the service principal to the `docker login` command, as shown in the following example:

```
docker login myregistry.contoso.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword
```

Once logged in, Docker caches the credentials, so you don't need to remember the app ID.

> [!TIP]
> If you want, you can regenerate the password of the service principal by running the `az ad sp reset-credentials` command.
> 


Service principals allow [role-based access](../active-directory/role-based-access-control-configure.md) to a registry for Read-only, Write, and Owner permissions. You can use service principals to assign roles to individual users or applications. Service principals also enable "headless" connectivity to a registry in developer or DevOps scenarios such as the following:

  * Container deployments from a registry to orchestration systems including DC/OS, Docker Swarm and Kubernetes. You can also pull container registries to related Azure services such as [Container Service](../container-service/index.md), [App Service](../app-service/index.md), [Batch](../batch/index.md), and [Service Fabric](../service-fabric/index.md).
  
  * Continuous integration and development solutions (such as Visual Studio Team Services or Jenkins) that build container images and push them to a registry.
  
  



## Admin account
With each registry you create, an admin account gets created automatically. By default the account is disabled, but you can enable it and manage the credentials, for example through the [portal](container-registry-get-started-portal.md#manage-registry-settings) or using the [Azure CLI 2.0 Preview commands](container-registry-get-started-azure-cli.md#manage-admin-credentials). If the account is enabled, you can pass the user name and password to the `docker login` command for basic authentication to the registry. For example:

```
docker login myregistry.contoso.azurecr.io -u myAdminName -p myPassword
```

> [!IMPORTANT]
> The admin account is designed for a single user to access the registry. It is not recommended to share the admin account credentials among other users. All users appear as a single user to the registry. Changing or disabling this account disables registry access for all users who use the credentials. 
> 


### Next steps
* [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).


