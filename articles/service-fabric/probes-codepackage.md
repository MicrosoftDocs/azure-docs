---
title: Azure Service Fabric probes
description: How to model a liveness probe in Azure Service Fabric by using application and service manifest files.

ms.topic: conceptual
ms.date: 3/12/2020
---
# Liveness probe
Starting with version 7.1, Service Fabric supports a liveness probe mechanism for [containerized][containers-introduction-link] applications. A liveness probe helps to report the liveness of a containerized application, which will restart if it does not respond in a timely fashion.
This article provides an overview of how to define a liveness probe by using manifest files.

Before proceeding with this article, you should become familiar with the [Service Fabric application model][application-model-link] and the [Service Fabric hosting model][hosting-model-link].

> [!NOTE]
> Liveness probe is only supported for containers on in network address translation mode.

## Semantics
You can specify only one liveness probe per container and can control its behavior by using these fields:

* `initialDelaySeconds`: The initial delay in seconds to start executing the probe once the container has started. The supported value is int (default: 0; minimum: 0).

* `timeoutSeconds`: The period in seconds after which the probe is considered to have failed, if it hasn't completed successfully. The supported value is int (default: 1; minimum: 1).

* `periodSeconds`: The period in seconds to specify the frequency of the probe. The supported value is int (default: 10; minimum: 1).

* `failureThreshold`: When this value is reached the container will restart. The supported value is int (default: 3; minimum: 1).

* `successThreshold`: On failure, for the probe to be considered successful, it has to execute successfully for this value. The supported value is int (default: 1; minimum: 1).

There can be, at most, one probe to one container at any moment in time. If the probe does not complete in the time set in **timeoutSeconds**, wait and count the time towards the **failureThreshold**. 

Additionally, Service Fabric will raise the following probe [Health Reports][health-introduction-link] on **DeployedServicePackage**:

* `OK`: The probe succeeds for the value set in **successThreshold**.

* `Error`: The probe **failureCount** ==  **failureThreshold**, before the container restarts.

* `Warning`: 
    * The probe fails and **failureCount** < **failureThreshold**. This health report stays until **failureCount** reaches the value set in **failureThreshold** or **successThreshold**.
    * On success post failure, the warning remains but with updated consecutive successes.

## Specifying a liveness probe

You can specify a probe in the ApplicationManifest.xml file under **ServiceManifestImport**:

The probe can be for any of the following:

* HTTP
* TCP
* Exec 

### HTTP probe

For an HTTP probe, Service Fabric will send an HTTP request to the port and path that you specify. A return code that is greater than, or equal to, 200 and less than 400 indicates success.

Here is an example of how to specify an HTTP probe:

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

The HTTP probe has additional properties you can set as follows:

* `path`: The path to use in the HTTP request.

* `port`: The port to use for probes. The range is 1 to 65535 (mandatory).

* `scheme`: The scheme to use for connecting to the code package. If this is set to HTTPS, the certificate verification is skipped. The default setting is HTTP.

* `httpHeader`: The headers to set in the request. You can specify multiple headers.

* `host`: The host IP address to connect to.

### TCP probe

For a TCP probe, Service Fabric will try to open a socket on the container by using the specified port. If it can establish a connection, the probe is considered successful. Here is an example of how to specify a probe that uses a TCP socket:

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

### Exec probe

This probe will issue an **exec** command into the container and wait for the command to complete.

> [!NOTE]
> **Exec** command takes a comma separated string. The command in the following example will work for a Linux container.
> If you are trying to probe a Windows container, use **cmd**.

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

