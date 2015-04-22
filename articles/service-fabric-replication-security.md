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
When replication is enabled, Stateful services replicate states across replicas. This page is about how to configure the protection on such traffic.

There are 2 types of security settings that are supported.
- X509
- Windows

The following section shows how to configure the above 2 types of settings.
The configuration "CredentialType" determines which type is being used.


## CredentialType=X509

### Configuration Names
|Name|Supported Values|Remarks|
|----|----------------|-------|
|StoreLocation|CurrentUser,LocalMachine|Store location to find the certificate.|
|StoreName|N/A. |Store name to find the certificate.|
|FindType|FindBySubjectName|Identifies the type of value provided by in the FindValue parameter.|
|FindValue|N/A. This is a required configuration|Search target for finding the certificate.|
|AllowedCommonNames|N/A. This is a required configuration|A comma separated list of certificate common names/dns names used by replicators.|
|IssuerThumbprints|empty string|A comma separated list of issuer certificate thumbprints. When empty, no issuer checking will be done.|
|RemoteCertThumbprints|empty string|A comma separated list of certificate thumbprints used by replicators.|
|ProtectionLevel|EncryptAndSign|

## CredentialType=Windows

### Configuration Names
|Name|Supported Values|Remarks|
|----|----------------|-------|
|ServicePrincipalName|
|WindowsIdentities|
|ProtectionLevel|

## Samples

### X509 Sample

```
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
### Windows Sample

```
<Section Name="SecurityConfig">
  <Parameter Name="CredentialType" Value="Windows" />
  <Parameter Name="ServicePrincipalName" Value="TODO" />
  <Parameter Name="WindowsIdentities" Value="TODO" />
  <Parameter Name="ProtectionLevel" Value="TODO" />
</Section>
```
