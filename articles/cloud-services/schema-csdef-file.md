---
title: Azure Cloud Services (classic) Definition Schema (.csdef File) | Microsoft Docs
description: A service definition (.csdef) file defines a service model for an application, containing available roles, endpoints, and configuration values for the service.
ms.topic: article
ms.service: cloud-services
ms.subservice: deployment-files
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Azure Cloud Services (classic) Definition Schema (.csdef File)

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

The service definition file defines the service model for an application. The file contains the definitions for the roles that are available to a cloud service, specifies the service endpoints, and establishes configuration settings for the service. Configuration setting values are set in the service configuration file, as described by the [Cloud Service (classic) Configuration Schema](/previous-versions/azure/reference/ee758710(v=azure.100)).

By default, the Azure Diagnostics configuration schema file is installed to the `C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\<version>\schemas` directory. Replace `<version>` with the installed version of the [Azure SDK](https://www.windowsazure.com/develop/downloads/).

The default extension for the service definition file is .csdef.

## Basic service definition schema
The service definition file must contain one `ServiceDefinition` element. The service definition must contain at least one role (`WebRole` or `WorkerRole`) element. It can contain up to 25 roles defined in a single definition and you can mix role types. The service definition also contains the optional `NetworkTrafficRules` element which restricts which roles can communicate to specified internal endpoints. The service definition also contains the optional `LoadBalancerProbes` element which contains customer defined health probes of endpoints.

The basic format of the service definition file is as follows.

```xml
<ServiceDefinition name="<service-name>" topologyChangeDiscovery="<change-type>" xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" upgradeDomainCount="<number-of-upgrade-domains>" schemaVersion="<version>">
  
  <LoadBalancerProbes>
         …
  </LoadBalancerProbes>
  
  <WebRole …>
         …
  </WebRole>
  
  <WorkerRole …>
         …
  </WorkerRole>
  
  <NetworkTrafficRules>
         …
  </NetworkTrafficRules>

</ServiceDefinition>
```

## Schema definitions
The following topics describe the schema:

- [LoadBalancerProbe Schema](schema-csdef-loadbalancerprobe.md)
- [WebRole Schema](schema-csdef-webrole.md)
- [WorkerRole Schema](schema-csdef-workerrole.md)
- [NetworkTrafficRules Schema](schema-csdef-networktrafficrules.md)

##  <a name="ServiceDefinition"></a> ServiceDefinition Element
The `ServiceDefinition` element is the top-level element of the service definition file.

The following table describes the attributes of the `ServiceDefinition` element.

| Attribute               | Description |
| ----------------------- | ----------- |
| name                    |Required. The name of the service. The name must be unique within the service account.|
| topologyChangeDiscovery | Optional. Specifies the type of topology change notification. Possible values are:<br /><br /> -   `Blast` - Sends the update as soon as possible to all role instances. If you choose option, the role should be able to handle the topology update without being restarted.<br />-   `UpgradeDomainWalk` – Sends the update to each role instance in a sequential manner after the previous instance has successfully accepted the update.|
| schemaVersion           | Optional. Specifies the version of the service definition schema. The schema version allows Visual Studio to select the correct SDK tools to use for schema validation if more than one version of the SDK is installed side-by-side.|
| upgradeDomainCount      | Optional. Specifies the number of upgrade domains across which roles in this service are allocated. Role instances are allocated to an upgrade domain when the service is deployed. For more information, see [Update a cloud service role or deployment](cloud-services-how-to-manage-portal.md#update-a-cloud-service-role-or-deployment), [Manage the availability of virtual machines](../virtual-machines/availability.md) and [What is a Cloud Service Model](./cloud-services-model-and-package.md).<br /><br /> You can specify up to 20 upgrade domains. If not specified, the default number of upgrade domains is 5.|