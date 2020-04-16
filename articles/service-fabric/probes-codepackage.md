---
title: Azure Service Fabric probes
description: How to model Liveness Probe in Azure Service Fabric using application and service manifest files.

ms.topic: conceptual
ms.date: 3/12/2020
---
# Liveness Probe
Starting with 7.1 Service Fabric supports Liveness Probe mechanism for [containerized][containers-introduction-link] applications. Liveness Probe help announce the liveness of the containerized application and when they do not respond in a timely fashion, it will result in a restart.
This article provides an overview of how to define a Liveness Probe via manifest files.

Before proceeding with this article, we recommend getting familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].

> [!NOTE]
> Liveness Probe is only supported for containers on NAT networking mode.

## Semantics
You can specify only 1 Liveness Probe per container and can control it's behavior with these fields:

* `initialDelaySeconds`: The initial delay in seconds to start executing probe once container has started. Supported value is int. Default is 0. Minimum is 0.

* `timeoutSeconds`: Period in seconds after which we consider probe as failed if it hasn't completed successfully. Supported value is int. Default is 1. Minimum is 1.

* `periodSeconds`: Period in seconds to specify how often we probe. Supported value is int. Default is 10. Minimum is 1.

* `failureThreshold`: Once we hit FailureThreshold, container will restart. Supported value is int. Default is 3. Minimum is 1.

* `successThreshold`: On failure, for probe to be considered success it has to execute successfully for SuccessThreshold. Supported value is int. Default is 1. Minimum is 1.

There will be at most 1 probe to container at one moment of time. If the probe does not complete in **timeoutSeconds** we keep waiting and counting it towards the **failureThreshold**. 

Additionally, ServiceFabric will raise following probe [Health Reports][health-introduction-link] on DeployedServicePackage:

* `Ok`: If the probe succeeds for **successThreshold** then we report health as Ok.

* `Error`: If the probe failureCount ==  **failureThreshold**, before restarting the container we report Error.

* `Warning`: 
    1. If the probe fails and the failureCount < **failureThreshold** we report Warning. This health report stays until failureCount reaches **failureThreshold** or **successThreshold**.
    2. On success post failure, we still report Warning but with updated consecutive success.

## Specifying Liveness Probe

You can specify probe in the ApplicationManifest.xml under ServiceManifestImport:

Probe can either one of :

1. HTTP
2. TCP
3. Exec 

## HTTP Probe

For HTTP probe, Service Fabric will send an HTTP request to the port and path specified. Return code greater than or equal to 200 and less than 400 indicates success.

Here is an example of how to specify HttpGet probe:

```xml
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateless1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <CodePackagePolicy CodePackageRef="Code">
        <Probes>
          <Probe Type="Liveness" FailureThreshold="5" SuccessThreshold="2" InitialDelaySeconds="10" PeriodSeconds="30" TimeoutSeconds="20">
            <HttpGet Path="/" Port="8081" Scheme="http">
              <HttpHeader Name="Foo" Value="Val"/>
              <HttpHeader Name="Bar" Value="val1"/>
            </HttpGet>
          </Probe>
        </Probes>
      </CodePackagePolicy>
    </Policies>
  </ServiceManifestImport>
```

HttpGet probe has additional properties you can set:

* `path`: Path to access on the HTTP request.

* `port`: Port to access for probes. Range is 1 to 65535. Mandatory.

* `scheme`: Scheme to use for connecting to code package. If set to HTTPS, certificate verification is skipped. Defaults to HTTP

* `httpHeader`: Headers to set in the request. You can specify multiple of these.

* `host`: Host IP to connect to.

## TCP Probe

For TCP probe, Service Fabric will try to open a socket on the container with the specified port. If it can establish a connection, the probe is considered success. Here is an example of how to specify probe which uses TCP socket:

```xml
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateless1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <CodePackagePolicy CodePackageRef="Code">
        <Probes>
          <Probe Type="Liveness" FailureThreshold="5" SuccessThreshold="2" InitialDelaySeconds="10" PeriodSeconds="30" TimeoutSeconds="20">
            <TcpSocket Port="8081"/>
          </Probe>
        </Probes>
      </CodePackagePolicy>
    </Policies>
  </ServiceManifestImport>
```

## Exec Probe

This probe will issue an exec into the container and wait for the command to complete.

> [!NOTE]
> Exec command takes a comma seperated string. The following command in the example will work for Linux container.
> If you are trying windows container, use <Command>cmd</Command>

```xml
  <ServiceManifestImport>
    <ServiceManifestRef ServiceManifestName="Stateless1Pkg" ServiceManifestVersion="1.0.0" />
    <ConfigOverrides />
    <Policies>
      <CodePackagePolicy CodePackageRef="Code">
        <Probes>
          <Probe Type="Liveness" FailureThreshold="5" SuccessThreshold="2" InitialDelaySeconds="10" PeriodSeconds="30" TimeoutSeconds="20">
            <Exec>
              <Command>ping,-c,2,localhost</Command>
            </Exec>
          </Probe>        
       </Probes>
      </CodePackagePolicy>
    </Policies>
  </ServiceManifestImport>
```

## Next steps
See the following articles for related information.
* [Service Fabric and containers.][containers-introduction-link]

<!-- Links -->
[containers-introduction-link]: service-fabric-containers-overview.md
[health-introduction-link]: service-fabric-health-introduction.md
[application-model-link]: service-fabric-application-model.md
[hosting-model-link]: service-fabric-hosting-model.md

