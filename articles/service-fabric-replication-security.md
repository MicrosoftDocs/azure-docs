<properties
   pageTitle="Replication Security"
   description="Secure replication traffic of stafeful services"
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

# Secure replication traffic of stateful services
Stateful services replicate states across replicas. This page is about how to protect such traffic.

For stateful services, OpenAsync method requires the return of an IReplicator instance. For more information, see Stateful Services.

When creating IReplicator instance using CreateReplicator method, ReplicatorSettings object for the new IReplicator can specify SecurityCredentials property. These credentials can be either X509Credentials or WindowsCredentials.

In general, SecurityCredentials has two categories of information:
- Local credential to use
- Identity of expected remote credentials

## Using X509 certificate
```
public override ReplicatorSettings ReplicatorSettings
{
  get
  {
     if (this.replicatorSettings == null)
     {
       this.replicatorSettings = base.ReplicatorSettings;
       X509Credentials creds = new X509Credentials()
       {
          StoreName = "MY",
          FindType = X509FindType.FindByThumbprint,
          FindValue = "AA11BB22CC33DD44EE55FF66AA77BB88CC99DD00",
          RemoteCommonNames = { "serverCommonName" }
       };
       this.replicatorSettings.SecurityCredentials = creds;
       }

      return this.replicatorSettings;
  }
}
```
In the example above, local X509 certificate credential is loaded from "MY" store at LocalMachine(default location), and the certificate's thumbprint value is AA11BB22CC33DD44EE55FF66AA77BB88CC99DD00. RemoteCommonName specifies the expected certificate common name of other replicas. Often times, all replicas share a single certificate credential. As an alternative, RemoteCertThumbprints can be usd to identify other replicas in place of RemoteCommonNames.

##Using Windows credentials
```
public override ReplicatorSettings ReplicatorSettings
{
  get
  {
     if (this.replicatorSettings == null)
     {
       this.replicatorSettings = base.ReplicatorSettings;
       WindowsCredentials creds = new WindowsCredentials()
       {
         RemoteSpn = "WindowsFabric/clusterA.domain.com"
       };
       this.replicatorSettings.SecurityCredentials = creds;
       }

      return this.replicatorSettings;
  }
}
```
When Windows credential is used, local credential is always from  process token, thus nothing needs to be specified for local credential. Remote replica is identified by the service principal name (SPN) of the replica set, "WindowsFabric/clusterA.domain.com" in the example above, you can leave it unspecified if all replicas run as machine account.

## Load from configuration file
Instead of specifying SecurityCredentials properties in code, you can load them from configuration by specifying package and section name.
```
var settings = ReplicatorSettings.LoadFrom(
                this.ServiceInitializationParameters.CodePackageActivationContext,
                configPackageName,
                replicatorConfigSectionName));

settings.SecurityCredentials = SecurityCredentials.LoadFrom(
                this.ServiceInitializationParameters.CodePackageActivationContext,
                configPackageName,
                replicatorSecurityConfigSectionName);
```
The following is a sample configuration file, the code a
```
<?xml version="1.0" encoding="utf-8"?>
<Settings xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <Section Name="VoicemailBoxActorServiceReplicatorConfig">
      <Parameter Name="ReplicatorEndpoint" Value="VoicemailBoxActorServiceReplicatorEndpoint" />
   </Section>
   <Section Name="VoicemailBoxActorServiceReplicatorSecurityConfig">
      <Parameter Name="CredentialType" Value="X509" />
      <Parameter Name="FindType" Value="FindByThumbprint" />
      <Parameter Name="FindValue" Value="9d c9 06 b1 69 dc 4f af fd 16 97 ac 78 1e 80 67 90 74 9d 2f" />
      <Parameter Name="StoreLocation" Value="LocalMachine" />
      <Parameter Name="StoreName" Value="My" />
      <Parameter Name="ProtectionLevel" Value="EncryptAndSign" />
      <Parameter Name="AllowedCommonNames" Value="WinFabric-Test-SAN1-Alice,WinFabric-Test-SAN1-Bob" />
   </Section>
   <Section Name="VoicemailBoxActorServiceLocalStoreConfig">
      <Parameter Name="MaxAsyncCommitDelayInMilliseconds" Value="100" />
      <Parameter Name="MaxVerPages" Value="32768" />
      <Parameter Name="MaxAsyncCommitDelay" Value="100" />
   </Section>
</Settings>
```
