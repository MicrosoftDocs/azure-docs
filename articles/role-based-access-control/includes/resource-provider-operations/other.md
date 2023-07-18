---
title: Other resource provider operations include file
description: Other resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.Chaos

Azure service: [Azure Chaos Studio](../../../chaos-studio/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Chaos/register/action | Registers the subscription for the Chaos Resource Provider and enables the creation of Chaos resources. |
> | Microsoft.Chaos/unregister/action | Unregisters the subscription for the Chaos Resource Provider and enables the creation of Chaos resources. |
> | Microsoft.Chaos/experiments/write | Creates or updates a Chaos Experiment resource in a resource group. |
> | Microsoft.Chaos/experiments/delete | Deletes a Chaos Experiment resource in a resource group. |
> | Microsoft.Chaos/experiments/read | Gets all Chaos Experiments in a resource group. |
> | Microsoft.Chaos/experiments/start/action | Starts a Chaos Experiment to inject faults. |
> | Microsoft.Chaos/experiments/cancel/action | Cancels a running Chaos Experiment to stop the fault injection. |
> | Microsoft.Chaos/experiments/executionDetails/read | Gets all chaos experiment execution details for a given chaos experiment. |
> | Microsoft.Chaos/experiments/statuses/read | Gets all chaos experiment execution statuses for a given chaos experiment. |
> | Microsoft.Chaos/locations/targetTypes/read | Gets all TargetTypes. |
> | Microsoft.Chaos/locations/targetTypes/capabilityTypes/read | Gets all CapabilityType. |
> | Microsoft.Chaos/operations/read | Read the available Operations for Chaos Studio. |
> | Microsoft.Chaos/skus/read | Read the available SKUs for Chaos Studio. |
> | Microsoft.Chaos/targets/write | Creates or update a Target resource that extends a tracked resource. |
> | Microsoft.Chaos/targets/delete | Deletes a Target resource that extends a tracked resource. |
> | Microsoft.Chaos/targets/read | Gets all Targets that extend a tracked resource. |
> | Microsoft.Chaos/targets/capabilities/write | Creates or update a Capability resource that extends a Target resource. |
> | Microsoft.Chaos/targets/capabilities/delete | Deletes a Capability resource that extends a Target resource. |
> | Microsoft.Chaos/targets/capabilities/read | Gets all Capabilities that extend a Target resource. |

### Microsoft.Dashboard

Azure service: [Azure Managed Grafana](../../../managed-grafana/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Dashboard/grafana/action | Operate grafana |
> | Microsoft.Dashboard/checkNameAvailability/action | Checks if grafana resource name is available |
> | Microsoft.Dashboard/register/action | Registers the subscription for the Microsoft.Dashboard resource provider |
> | Microsoft.Dashboard/unregister/action | Unregisters the subscription for the Microsoft.Dashboard resource provider |
> | Microsoft.Dashboard/grafana/read | Read grafana |
> | Microsoft.Dashboard/grafana/write | Write grafana |
> | Microsoft.Dashboard/grafana/delete | Delete grafana |
> | Microsoft.Dashboard/grafana/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnection |
> | Microsoft.Dashboard/grafana/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxy |
> | Microsoft.Dashboard/grafana/privateEndpointConnectionProxies/read | Get PrivateEndpointConnectionProxy |
> | Microsoft.Dashboard/grafana/privateEndpointConnectionProxies/write | Create/Update PrivateEndpointConnectionProxy |
> | Microsoft.Dashboard/grafana/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxy |
> | Microsoft.Dashboard/grafana/privateEndpointConnections/read | Get PrivateEndpointConnection |
> | Microsoft.Dashboard/grafana/privateEndpointConnections/write | Update PrivateEndpointConnection |
> | Microsoft.Dashboard/grafana/privateEndpointConnections/delete | Delete PrivateEndpointConnection |
> | Microsoft.Dashboard/grafana/privateLinkResources/read | Get PrivateLinkResources |
> | Microsoft.Dashboard/locations/read | Get locations |
> | Microsoft.Dashboard/locations/operationStatuses/read | Get operation statuses |
> | Microsoft.Dashboard/locations/operationStatuses/write | Write operation statuses |
> | Microsoft.Dashboard/operations/read | List operations available on Microsoft.Dashboard resource provider |
> | Microsoft.Dashboard/registeredSubscriptions/read | Get registered subscription details |
> | **DataAction** | **Description** |
> | Microsoft.Dashboard/grafana/ActAsGrafanaAdmin/action | Act as Grafana Admin role |
> | Microsoft.Dashboard/grafana/ActAsGrafanaEditor/action | Act as Grafana Editor role |
> | Microsoft.Dashboard/grafana/ActAsGrafanaViewer/action | Act as Grafana Viewer role |

### Microsoft.DigitalTwins

Azure service: [Azure Digital Twins](../../../digital-twins/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DigitalTwins/register/action | Register the Subscription for the Digital Twins resource provider and enable the creation of Digital Twins instances. |
> | Microsoft.DigitalTwins/unregister/action | Unregister the subscription for the Digital Twins Resource Provider |
> | Microsoft.DigitalTwins/digitalTwinsInstances/read | Read any Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/write | Create or update any Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/delete | Delete an Microsoft.DigitalTwins/digitalTwinsInstances resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/PrivateEndpointConnectionsApproval/action | Approve PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/diagnosticSettings/write | Sets the diagnostic settings for the resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/delete | Delete any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/read | Read any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/endpoints/write | Create or Update any Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/ingressEndpoints/delete | Delete any Ingress Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/ingressEndpoints/read | Read any Ingress Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/ingressEndpoints/write | Create or Update any Ingress Endpoint of a Digital Twins resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/logDefinitions/read | Gets the log settings for the resource's Azure Monitor |
> | Microsoft.DigitalTwins/digitalTwinsInstances/metricDefinitions/read | Gets the metric settings for the resource's Azure Monitor |
> | Microsoft.DigitalTwins/digitalTwinsInstances/networkSecurityPerimeterAssociationProxies/read | Read NetworkSecurityPerimeterAssociationProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/networkSecurityPerimeterAssociationProxies/write | Write NetworkSecurityPerimeterAssociationProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/networkSecurityPerimeterAssociationProxies/delete | Delete NetworkSecurityPerimeterAssociationProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/operationsResults/read | Read any Operation Result |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/validate/action | Validate PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/read | Read PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/write | Write PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/delete | Delete PrivateEndpointConnectionProxies resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnectionProxies/operationResults/read | Get the result of an async operation on a private endpoint connection proxy |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/read | Read PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/write | Write PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/delete | Delete PrivateEndpointConnection resource |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateEndpointConnections/operationResults/read | Get the result of an async operation on a private endpoint connection |
> | Microsoft.DigitalTwins/digitalTwinsInstances/privateLinkResources/read | Reads PrivateLinkResources for Digital Twins |
> | Microsoft.DigitalTwins/locations/checkNameAvailability/action | Check Name Availability of a resource in the Digital Twins Resource Provider |
> | Microsoft.DigitalTwins/locations/operationsResults/read | Read any Operation Result |
> | Microsoft.DigitalTwins/operations/read | Read all Operations |
> | **DataAction** | **Description** |
> | Microsoft.DigitalTwins/query/action | Query any Digital Twins Graph |
> | Microsoft.DigitalTwins/digitaltwins/read | Read any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/write | Create or Update any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/delete | Delete any Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/commands/action | Invoke any Command on a Digital Twin |
> | Microsoft.DigitalTwins/digitaltwins/relationships/read | Read any Digital Twin Relationship |
> | Microsoft.DigitalTwins/digitaltwins/relationships/write | Create or Update any Digital Twin Relationship |
> | Microsoft.DigitalTwins/digitaltwins/relationships/delete | Delete any Digital Twin Relationship |
> | Microsoft.DigitalTwins/eventroutes/read | Read any Event Route |
> | Microsoft.DigitalTwins/eventroutes/delete | Delete any Event Route |
> | Microsoft.DigitalTwins/eventroutes/write | Create or Update any Event Route |
> | Microsoft.DigitalTwins/jobs/import/read | Read any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/import/write | Create any Bulk Import Job |
> | Microsoft.DigitalTwins/jobs/import/delete | Delete any Bulk Import Job |
> | Microsoft.DigitalTwins/models/read | Read any Model |
> | Microsoft.DigitalTwins/models/write | Create or Update any Model |
> | Microsoft.DigitalTwins/models/delete | Delete any Model |

### Microsoft.LoadTestService

Azure service: [Azure Load Testing](../../../load-testing/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.LoadTestService/checkNameAvailability/action | Checks if a LoadTest resource name is available |
> | Microsoft.LoadTestService/register/action | Register the subscription for Microsoft.LoadTestService |
> | Microsoft.LoadTestService/unregister/action | Unregister the subscription for Microsoft.LoadTestService |
> | Microsoft.LoadTestService/loadTests/read | Get a LoadTest resource, or Lists loadtest resources in a subscription or resource group. |
> | Microsoft.LoadTestService/loadTests/write | Create or update LoadTest resource. |
> | Microsoft.LoadTestService/loadTests/delete | Delete a LoadTest resource. |
> | Microsoft.LoadTestService/loadTests/outboundNetworkDependenciesEndpoints/read | Lists the endpoints that agents may call as part of load testing. |
> | Microsoft.LoadTestService/Locations/OperationStatuses/read | Read OperationStatuses |
> | Microsoft.LoadTestService/Locations/OperationStatuses/write | Write OperationStatuses |
> | Microsoft.LoadTestService/locations/quotas/read | Get/List the available quotas for quota buckets per region per subscription. |
> | Microsoft.LoadTestService/locations/quotas/checkAvailability/action | Check Quota Availability on quota bucket per region per subscription. |
> | Microsoft.LoadTestService/operations/read | read operations |
> | Microsoft.LoadTestService/registeredSubscriptions/read | read registeredSubscriptions |
> | **DataAction** | **Description** |
> | Microsoft.LoadTestService/loadtests/startTest/action | Start Load Tests |
> | Microsoft.LoadTestService/loadtests/stopTest/action | Stop Load Tests |
> | Microsoft.LoadTestService/loadtests/writeTest/action | Create or Update Load Tests |
> | Microsoft.LoadTestService/loadtests/deleteTest/action | Delete Load Tests |
> | Microsoft.LoadTestService/loadtests/readTest/action | Read Load Tests |

### Microsoft.ServicesHub

Azure service: [Services Hub](/services-hub/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServicesHub/connectors/write | Create or update a Services Hub Connector |
> | Microsoft.ServicesHub/connectors/read | View or List Services Hub Connectors |
> | Microsoft.ServicesHub/connectors/delete | Delete Services Hub Connectors |
> | Microsoft.ServicesHub/connectors/checkAssessmentEntitlement/action | Lists the Assessment Entitlements for a given Services Hub Workspace |
> | Microsoft.ServicesHub/supportOfferingEntitlement/read | View the Support Offering Entitlements for a given Services Hub Workspace |
> | Microsoft.ServicesHub/workspaces/read | List the Services Hub Workspaces for a given User |
