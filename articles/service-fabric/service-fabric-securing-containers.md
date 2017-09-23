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

Service Fabric provides a mechanism for services inside a container to access a certificate that is installed on the nodes in a Windows or Linux cluster (version 5.7 or higher). In addition, Service Fabric also supports gMSA (group Managed Service Accounts) for Windows containers. 

## Certificate management for containers

You can secure your container services by specifying a certificate. The certificate must be installed in LocalMachine on all nodes of the cluster. The certificate information is provided in the application manifest under the `ContainerHostPolicies` tag as the following snippet shows:

```xml
  <ContainerHostPolicies CodePackageRef="NodeContainerService.Code">
    <CertificateRef Name="MyCert1" X509StoreName="My" X509FindValue="[Thumbprint1]"/>
    <CertificateRef Name="MyCert2" X509FindValue="[Thumbprint2]"/>
 ```

For windows clusters, when starting the application, the runtime reads the certificates and generates a PFX file and password for each certificate. This PFX file and password are accessible inside the container using the following environment variables: 

* **Certificate_[ServicePackageName]_[CodePackageName]_[CertName]_PFX**
* **Certificate_[ServicePackageName]_[CodePackageName]_[CertName]_Password**

For Linux clusters, the certificates(PEM) are simply copied over from the store specified by X509StoreName onto the container. The corresponding environment variables on linux are:

* **Certificate_[ServicePackageName]_[CodePackageName]_[CertName]_PEM**
* **Certificate_[ServicePackageName]_[CodePackageName]_[CertName]_PrivateKey**

Alternatively, if you already have the certificates in the required form and would simply want to access it inside the container, you can create a data package inside your app package and specify the following inside your application manifest:

```xml
  <ContainerHostPolicies CodePackageRef="NodeContainerService.Code">
   <CertificateRef Name="MyCert1" DataPackageRef="[DataPackageName]" DataPackageVersion="[Version]" RelativePath="[Relative Path to certificate inside DataPackage]" Password="[password]" IsPasswordEncrypted="[true/false]"/>
 ```

The container service or process is responsible for importing the certificate files into the container. To import the certificate, you can use `setupentrypoint.sh` scripts or execute custom code within the container process. Sample code in C# for importing the PFX file follows:

```c#
    string certificateFilePath = Environment.GetEnvironmentVariable("Certificate_MyServicePackage_NodeContainerService.Code_MyCert1_PFX");
    string passwordFilePath = Environment.GetEnvironmentVariable("Certificate_MyServicePackage_NodeContainerService.Code_MyCert1_Password");
    X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
    string password = File.ReadAllLines(passwordFilePath, Encoding.Default)[0];
    password = password.Replace("\0", string.Empty);
    X509Certificate2 cert = new X509Certificate2(certificateFilePath, password, X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.PersistKeySet);
    store.Open(OpenFlags.ReadWrite);
    store.Add(cert);
    store.Close();
```
This PFX certificate can be used for authenticating the application or service or secure commmunication with other services. By default, the files are ACLed only to SYSTEM. You can ACL it to other accounts as required by the service.


## Set up gMSA for Windows containers

To set up gMSA (group Managed Service Accounts), a credential specification file (`credspec`) is placed on all nodes in the cluster. The file can be copied on all nodes using a VM extension.  The `credspec` file must contain the gMSA account information. For more information on the `credspec` file, see [Service Accounts](https://github.com/MicrosoftDocs/Virtualization-Documentation/tree/live/windows-server-container-tools/ServiceAccounts). The credential specification and the `Hostname` tag are specified in the application manifest. The `Hostname` tag must match the gMSA account name that the container runs under.  The `Hostname` tag allows the container to authenticate itself to other services in the domain using Kerberos authentication.  A sample for specifying the `Hostname` and the `credspec` in the application manifest is shown in the following snippet:

```xml
<Policies>
  <ContainerHostPolicies CodePackageRef="NodeService.Code" Isolation="process" Hostname="gMSAAccountName">
    <SecurityOption Value="credentialspec=file://WebApplication1.json"/>
  </ContainerHostPolicies>
</Policies>
```
## Next steps

* [Deploy a Windows container to Service Fabric on Windows Server 2016](service-fabric-get-started-containers.md)
* [Deploy a Docker container to Service Fabric on Linux](service-fabric-get-started-containers-linux.md)
