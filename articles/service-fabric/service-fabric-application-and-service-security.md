---
title: Learn about Azure Service Fabric application security | Microsoft Docs
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
# Service Fabric application and service security

## Securing the hosting environment
By using Azure Service Fabric, you can secure applications that are running in the cluster under different user accounts. Service Fabric also helps secure the resources that are used by applications at the time of deployment under the user accounts--for example, files, directories, and certificates. This makes running applications, even in a shared hosted environment, more secure from one another.

By default, Service Fabric applications run under the account that the Fabric.exe process runs under. Service Fabric also provides the capability to run applications under a local user account or local system account, which is specified within the application manifest. Supported local system account types are **LocalUser**, **NetworkService**, **LocalService**, and **LocalSystem**.

 When you're running Service Fabric on Windows Server in your datacenter by using the standalone installer, you can use Active Directory domain accounts, including group managed service accounts.

You can define and create user groups so that one or more users can be added to each group to be managed together. This is useful when there are multiple users for different service entry points and they need to have certain common privileges that are available at the group level.

For an example, see [Run setup scripts at service startup](service-fabric-run-script-at-service-startup.md).

## Managing secrets
Secrets can be any sensitive information, such as storage connection strings, passwords, or other values that should not be handled in plain text. This article uses Azure Key Vault to manage keys and secrets. However, *using* secrets in an application is cloud platform-agnostic to allow applications to be deployed to a cluster hosted anywhere.

The recommended way to manage service configuration settings is through [service configuration packages][config-package]. Configuration packages are versioned and updatable through managed rolling upgrades with health-validation and auto rollback. This is preferred to global configuration as it reduces the chances of a global service outage. Encrypted secrets are no exception. Service Fabric has built-in features for encrypting and decrypting values in a configuration package Settings.xml file using certificate encryption.

The following diagram illustrates the basic flow for secret management in a Service Fabric application:

![secret management overview][overview]

There are four main steps in this flow:

1. Obtain a data encipherment certificate.
2. Install the certificate in your cluster.
3. Encrypt secret values when deploying an application with the certificate and inject them into a service's Settings.xml configuration file.
4. Read encrypted values out of Settings.xml by decrypting with the same encipherment certificate. 

[Azure Key Vault][key-vault-get-started] is used here as a safe storage location for certificates and as a way to get certificates installed on Service Fabric clusters in Azure. If you are not deploying to Azure, you do not need to use Key Vault to manage secrets in Service Fabric applications.

For an example, see [Manage application secrets](service-fabric-secret-management.md).

## Securing service communication

The Reliable Services application framework provides a few prebuilt communication stacks and tools that you can use to improve security. Learn how to improve security when you're using service remoting in [C#](service-fabric-reliable-services-secure-communication.md) or [Java](service-fabric-reliable-services-secure-communication-java.md).

You can establish secure connection between the reverse proxy and services, thus enabling an end to end secure channel.
Connecting to secure services is supported only when reverse proxy is configured to listen on HTTPS. For information on configuring the reverse proxy, read [Reverse proxy in Azure Service Fabric](service-fabric-reverseproxy.md).  [Connect to a secure service](service-fabric-reverseproxy-configure-secure-communication.md) describes how to establish secure connection between the reverse proxy and services.



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
* [Run a setup script at service startup](service-fabric-run-script-at-service-startup.md)

* [Specify resources in a service manifest](service-fabric-service-manifest-resources.md)
* [Deploy an application](service-fabric-deploy-remove-applications.md)


<!-- Links -->
[key-vault-get-started]:../key-vault/key-vault-get-started.md
[config-package]: service-fabric-application-and-service-manifests.md
[service-fabric-cluster-creation-via-arm]: service-fabric-cluster-creation-via-arm.md

<!-- Images -->
[overview]:./media/service-fabric-application-and-service-security/overview.png