<properties
   pageTitle="Specifying Service Fabric Service Endpoints"
   description="How to describe endpoint resources in a service manifest including setting up HTTPS endpoints"
   services="service-fabric"
   documentationCenter=".net"
   authors="sumukhs"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/26/2015"
   ms.author="sumukhs"/>

# Specifying Resources in a Service Manifest 

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

## Example: Specifying a HTTP endpoing for your service
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

## Example: Specifying a HTTPS endpoint for your service

The HTTPS protocol provides server authentication and is also used for encrypting client-server communication. To enable this on your Service Fabric service, when defining the service, the protocol is specified in the *Resources -> Endpoints -> Endpoint* section of the service manifest, as shown above. 

>[AZURE.NOTE] A service’s protocol cannot be changed during application upgrade, since this would be a breaking change. 

 
Here is an example ApplicationManifest that you need to set for HTTPS (you will need to provide the thumbpring for your certificate). The EndpointRef is a reference to EndpointResource in ServiceManifest for which you set the HTTPS protocol.  

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ApplicationManifest ApplicationTypeName="CalculatorApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <Description>Calculator Application</Description>
    <ServiceManifestImport>
        <ServiceManifestRef ServiceManifestName="CalculatorServicePackage" ServiceManifestVersion="1.0"/>
      <Policies>
       <EndpointBindingPolicy CertificateRef="TestCert1" EndpointRef="StatelessCalculatorEndpoint1"/>
        <EndpointBindingPolicy CertificateRef="TestCert2" EndpointRef="StatelessCalculatorEndpoint2"/>
      </Policies>
    </ServiceManifestImport>
    <ServiceTemplates>
        <StatelessService ServiceTypeName="StatelessCalculatorService" InstanceCount="5">
            <SingletonPartition></SingletonPartition>
        </StatelessService>
    </ServiceTemplates>
  <Certificates>
    <EndpointCertificate Name="TestCert1" X509FindType="FindByThumbprint" X509FindValue="FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF F0"/>
    <EndpointCertificate Name="TestCert2" X509FindType="FindByThumbprint" X509FindValue="FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF F1"/>
    <SecretsCertificate Name="TestCert" X509FindType="FindByThumbprint" X509FindValue="FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF F2"/>
  </Certificates>
</ApplicationManifest>
```


