<properties
   pageTitle="Secure replication traffic of Stateful Services in Azure Service Fabric"
   description="When replication is enabled, Stateful Services replicate their state from a primary replica to secondary replicas and such traffic needs to be protected against eavesdropping and tampering."
   services="service-fabric"
   documentationCenter=".net"
   authors="leikong"
   manager="vipulm"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/13/2015"
   ms.author="leikong"/>

# What is Secured?
When replication is enabled, Stateful services replicate states across replicas. This page is about how to protect such traffic.

In general, SecurityCredentials has two categories of information:
- Local credential to use
- Identity of expected remote credentials

TODO: Add details of X509 and Windows Credentials

## Configuration Names
TODO: Add Configuration Names

## Samples
The following is a sample configuration file for setting.
```
<?xml version="1.0" encoding="utf-8"?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Section Name="VoicemailBoxActorServiceReplicatorSecurityConfig">
      <Parameter Name="CredentialType" Value="X509" />
      <Parameter Name="FindType" Value="FindByThumbprint" />
      <Parameter Name="FindValue" Value="9d c9 06 b1 69 dc 4f af fd 16 97 ac 78 1e 80 67 90 74 9d 2f" />
      <Parameter Name="StoreLocation" Value="LocalMachine" />
      <Parameter Name="StoreName" Value="My" />
      <Parameter Name="ProtectionLevel" Value="EncryptAndSign" />
      <Parameter Name="AllowedCommonNames" Value="WinFabric-Test-SAN1-Alice,WinFabric-Test-SAN1-Bob" />
   </Section>
</Settings>
```
In the example above, CredentailTye is set to "X509", which tells Service Fabric to create X509Credentials, another supported value is "Windows", for which WindowsCredentials will be created. The rest of section VoicemailBoxActorServiceReplicatorSecurityConfig maps to properties of X509Credentials, the following is the complete mapping.

|X509Credentials property|Configuration parameter|
|------------------------|-----------------------|
|StoreLocation|StoreLocation|
|StoreName|StoreName|
|FindType|FindType|
|FindValue|FindValue|
|RemoteCommonNames|AllowedCommonNames|
|IssuerThumbprints|IssuerThumbprints|
|RemoteCertThumbprints|RemoteCertThumbprints|
|ProtectionLevel|ProtectionLevel|

|WindowsCredentials property|Configuration parameter|
|---------------------------|-----------------------|
|RemoteSpn|ServicePrincipalName|
|RemoteIdentities|WindowsIdentities|
|ProtectionLevel|ProtectionLevel|
