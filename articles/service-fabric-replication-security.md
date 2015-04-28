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

# Secure Replication Traffic

When replication is enabled, Stateful services replicate state across replicas. This page is about how to configure protection on such traffic.

There are 2 types of security settings that are supported:

- X509: Uses X509 certificate to secure the communication channel. Users are expected to ACL certificate private keys to allow Actor/Service host processes to be able to use the certificate credentials.
- Windows: Uses windows security(requires Active Directory) to secure the communication channel.

The following section shows how to configure the above 2 types of settings.
The configuration "CredentialType" determines which type is being used.

## CredentialType=X509

### Configuration Names

|Name|Remarks|
|----|-------|
|StoreLocation|Store location to find the certificate: CurrentUser or LocalMachine|
|StoreName|Store name to find the certificate|
|FindType|Identifies the type of value provided by in the FindValue parameter: FindBySubjectName or FindByThumbPrint|
|FindValue|Search target for finding the certificate|
|AllowedCommonNames|A comma separated list of certificate common names/dns names used by replicators.|
|IssuerThumbprints|A comma separated list of issuer certificate thumbprints. When specified, the incoming certificate is validated if it is issued by one of the entries in the list. Chain validation is always performed.|
|RemoteCertThumbprints|A comma separated list of certificate thumbprints used by replicators.|
|ProtectionLevel|Indicates how the data is protected: Sign or EncryptAndSign or None|

## CredentialType=Windows

### Configuration Names

|Name|Remarks|
|----|-------|
|ServicePrincipalName|Service Principal name registered for the service. Can be empty if the service/actor host processes runs as a machine account (e.g: NetworkService, LocalSystem etc.)|
|WindowsIdentities|A comma separated list of windows identities of all service/actor host processes.
|ProtectionLevel|Indicates how the data is protected: Sign or EncryptAndSign or None|

## Samples

### Sample 1: CredentialType=X509

```xml
<Section Name="SecurityConfig">
  <Parameter Name="CredentialType" Value="X509" />
  <Parameter Name="FindType" Value="FindByThumbprint" />
  <Parameter Name="FindValue" Value="9d c9 06 b1 69 dc 4f af fd 16 97 ac 78 1e 80 67 90 74 9d 2f" />
  <Parameter Name="StoreLocation" Value="LocalMachine" />
  <Parameter Name="StoreName" Value="My" />
  <Parameter Name="ProtectionLevel" Value="EncryptAndSign" />
  <Parameter Name="AllowedCommonNames" Value="My-Test-SAN1-Alice,My-Test-SAN1-Bob" />
</Section>
```

### Sample 2: CredentialType=Windows
This snippet shows a sample when all the service/actor host processes run as NetworkService or LocalSystem. The ServicePrincipalName is empty.

```xml
<Section Name="SecurityConfig">
  <Parameter Name="CredentialType" Value="Windows" />
  <Parameter Name="ServicePrincipalName" Value="" />
  <!--This machine group contains all machines in a cluster-->
  <Parameter Name="WindowsIdentities" Value="redmond\ClusterMachineGroup" />
  <Parameter Name="ProtectionLevel" Value="EncryptAndSign" />
</Section>
```

### Sample 3: CredentialType=Windows
This snippet shows a sample when all the service/actor host processes run as a group managed serice account with a valid ServicePrincipalName.

```xml
<Section Name="SecurityConfig">
  <Parameter Name="CredentialType" Value="Windows" />
  <Parameter Name="ServicePrincipalName" Value="servicefabric/cluster.microsoft.com" />
  <--All actor/service host processes run as redmond\GroupManagedServiceAccount-->
  <Parameter Name="WindowsIdentities" Value="redmond\GroupManagedServiceAccount" />
  <Parameter Name="ProtectionLevel" Value="EncryptAndSign" />
</Section>
```
