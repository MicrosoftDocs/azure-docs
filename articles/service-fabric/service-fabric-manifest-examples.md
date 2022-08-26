---
title: Azure Service Fabric application manifest examples
description: Learn how to configure application and service manifest settings for a Service Fabric application.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Service Fabric application and service manifest examples
This section contains examples of application and service manifests. These examples are not meant to show important scenarios, but to show the different settings that are available and how to use them. 

The following is an index of the features shown and the example manifest(s) they're a part of.

|Feature|Manifest|
|---|---|
|[Resource governance](service-fabric-resource-governance.md)|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest), [Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Run a service as a local admin account](service-fabric-application-runas-security.md)|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest)|
|[Apply a default policy to all service code packages](service-fabric-application-runas-security.md#apply-a-default-policy-to-all-service-code-packages)|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest)|
|[Create user and group principals](service-fabric-application-runas-security.md)|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest)|
|share a data package between service instances|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest)|
|[Override service endpoints](service-fabric-service-manifest-resources.md#overriding-endpoints-in-servicemanifestxml)|[Reliable Services Application manifest](service-fabric-manifest-example-reliable-services-app.md#application-manifest)|
|[Run a script at service startup](service-fabric-run-script-at-service-startup.md)|[VotingWeb service manifest](service-fabric-manifest-example-reliable-services-app.md#votingweb-service-manifest)|
|[Define an HTTPS endpoint](service-fabric-tutorial-dotnet-app-enable-https-endpoint.md#define-an-https-endpoint-in-the-service-manifest)|[VotingWeb service manifest](service-fabric-manifest-example-reliable-services-app.md#votingweb-service-manifest)|
|[Declare a config package](service-fabric-application-and-service-manifests.md)|[VotingData service manifest](service-fabric-manifest-example-reliable-services-app.md#votingdata-service-manifest)|
|[Declare a data package](service-fabric-application-and-service-manifests.md)|[VotingData service manifest](service-fabric-manifest-example-reliable-services-app.md#votingdata-service-manifest)|
|[Override environment variables](service-fabric-get-started-containers.md#configure-and-set-environment-variables)|[Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Configure container port-to-host mapping](service-fabric-get-started-containers.md#configure-container-port-to-host-port-mapping-and-container-to-container-discovery)| [Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Configure container registry authentication](service-fabric-get-started-containers.md#configure-container-repository-authentication)|[Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Set isolation mode](service-fabric-get-started-containers.md#configure-isolation-mode)|[Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Specify OS build-specific container images](service-fabric-get-started-containers.md#specify-os-build-specific-container-images)|[Container Application manifest](service-fabric-manifest-example-container-app.md#application-manifest)|
|[Set environment variables](service-fabric-get-started-containers.md#configure-and-set-environment-variables)|[Container FrontEndService service manifest](service-fabric-manifest-example-container-app.md#frontendservice-service-manifest), [Container BackEndService service manifest](service-fabric-manifest-example-container-app.md#backendservice-service-manifest)|
|[Configure an endpoint](service-fabric-get-started-containers.md#configure-communication)|[Container FrontEndService service manifest](service-fabric-manifest-example-container-app.md#frontendservice-service-manifest), [Container BackEndService service manifest](service-fabric-manifest-example-container-app.md#backendservice-service-manifest), [VotingData service manifest](service-fabric-manifest-example-reliable-services-app.md#votingdata-service-manifest)|
|pass commands to the container|[Container FrontEndService service manifest](service-fabric-manifest-example-container-app.md#frontendservice-service-manifest)|
|[Import a certificate into a container](service-fabric-securing-containers.md)|[Container FrontEndService service manifest](service-fabric-manifest-example-container-app.md#frontendservice-service-manifest)|
|[Configure volume driver](service-fabric-containers-volume-logging-drivers.md)|[Container BackEndService service manifest](service-fabric-manifest-example-container-app.md#backendservice-service-manifest)|

