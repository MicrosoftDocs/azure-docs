---
title: Azure Service Fabric container security| Microsoft Docs
description: Learn now to secure container services.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: ab49c4b9-74a8-4907-b75b-8d2ee84c6d90
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 8/9/2017
ms.author: subramar
---

# Container security

Service Fabric supports certificate-based authentication and encryption of container services for Windows and Linux clusters. In addition, Service Fabric also supports gMSA (group Managed Service Accounts) for Windows containers. 

## Certificate management for containers

You can secure your container services by providing a certificate to the Service Fabric runtime. The certificate must be installed on the nodes of the cluster. The certificate information is provided in the application manifest under the `ContainerHostPolicies` tag as the following snippet shows:

```xml
  <ContainerHostPolicies CodePackageRef="NodeContainerService.Code">
    <CertificateRef Name="MyCert1" X509StoreName="My" X509FindValue="[Thumbprint1]"/>
    <CertificateRef Name="MyCert2" X509FindValue="[Thumbprint2]"/>
 ```

When starting the application, the runtime reads the certificates and generate a PFX certificate and password per certificate. This PFX cerficate and password are accessible inside the container using the following environment variables: 

* **Certificate_[CodePackageName]_[CertName]_PFX**
* **Certificate_[CodePackageName]_[CertName]_Password**

The container service is responsible for installing the runtime generated certificate into the container. To import the certificate, you can use `setupentrypoint.sh` scripts or executed custom code within the container process. This runtime generated certificate can be used to authenticate services or encrypt commmunication within or outside the cluster. 


## Set up gMSA for Windows containers

To set up gMSA (group Managed Service Accounts), a credential specification file (`credspec`) is placed on all nodes in the cluster. The file can be copied on all nodes using a VM extension.  The `credspec` file must contain the gMSA account information. For more information on the `credspec` file, see [Service Accounts](https://github.com/MicrosoftDocs/Virtualization-Documentation/tree/live/windows-server-container-tools/ServiceAccounts). The credential specification and the `Hostname` tag are specified in the application manifest. The `Hostname` tag must match the gMSA account name that the container runs under.  The `Hostname` tag allows the container to authenticate itself to other services in the domain using Kerberos authentication.  A sample for specifying the `Hostname` and the `credspec` in the application manifest is shown in the following snippet:

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="process" Hostname="gMSAAccountName">
    <SecurityOption Value="credentialspec=file://WebApplication1.json"/>
  </ContainerHostPolicies>
</Policies>
```
