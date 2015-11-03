<properties
   pageTitle="Service Fabric service manifest resources"
   description="How to describe resources in a service manifest"
   services="service-fabric"
   documentationCenter=".net"
   authors="sumukhs"
   manager="anuragg"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/26/2015"
   ms.author="sumukhs"/>

# Service Manifest Resources

## Overview

The service manifest allows resources to be used by the service to be declared/changed without changing the compiled code. Service Fabric supports configuration of endpoint resources for the service. The access to the resources specified in the service manifest can be controlled via the SecurityGroup in the application manifest. The declaration of resources allows these resources to be changed at deployment time rather than requiring the service to introduce a new configuration mechanism.

## Endpoints

When an Endpoint resource is defined in the service manifest, Service Fabric assigns ports from the reserved application port range. Additionally, services can also request for a specific port in a resource. Service replicas running on different cluster nodes can be assigned different port numbers, while replicas of the same service running on the same node share the same port. Such ports can be used by the service replicas for various purposes like replication, listening for client requests, etc.

```xml
<Resources>
  <Endpoints>
    <Endpoint Name="ServiceEndpoint" Protocol="http"/>
    <Endpoint Name="ServiceInputEndpoint" Protocol="http" Port="80"/>
    <Endpoint Name="ReplicatorEndpoint" Protocol="tcp"/>
  </Endpoints>
</Resources>
```

Refer to [configuring stateful Reliable Services](../Service-Fabric/service-fabric-reliable-services-configuration.md) to read more about referencing endpoints from the config package settings file (settings.xml).

## Sample
The following service manifest defines 1 TCP endpoint resource and 2 HTTP endpoint resources in the &lt;Resources&gt; element.

HTTP endpoints are automatically ACL'd by Service-Fabric.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Name="SP1" Version="V1" xmlns="http://schemas.microsoft.com/2011/01/fabric">
  <Description>Test Service</Description>
  <ServiceTypes>
    <StatefulServiceType ServiceTypeName="PersistType" HasPersistedState="true" />
  </ServiceTypes>
  <CodePackage Name="CP1" Version="V1">
    <EntryPoint>
      <ExeHost>
        <Program>CB\Code.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
  <ConfigPackage Name="CP1.Config0" Version="V1" />
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint" Protocol="http"/>
      <Endpoint Name="ServiceInputEndpoint" Protocol="http" Port="80"/>
      <Endpoint Name="ReplicatorEndpoint" Protocol="tcp"/>
    </Endpoints>
  </Resources>
</ServiceManifest>
```
 
