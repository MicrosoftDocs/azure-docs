---
title: Networking resource provider operations include file
description: Networking resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.Cdn

Azure service: [Content Delivery Network](../../../cdn/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Cdn/register/action | Registers the subscription for the CDN resource provider and enables the creation of CDN profiles. |
> | Microsoft.Cdn/unregister/action | UnRegisters the subscription for the CDN resource provider. |
> | Microsoft.Cdn/CheckNameAvailability/action |  |
> | Microsoft.Cdn/ValidateProbe/action |  |
> | Microsoft.Cdn/CheckResourceUsage/action |  |
> | Microsoft.Cdn/ValidateSecret/action |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/read |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/write |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/delete |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/read |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/write |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/delete |  |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the resource |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Microsoft.Cdn/cdnwebapplicationfirewallpolicies |
> | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.Cdn |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/edgenodes/write |  |
> | Microsoft.Cdn/edgenodes/delete |  |
> | Microsoft.Cdn/operationresults/read |  |
> | Microsoft.Cdn/operationresults/write |  |
> | Microsoft.Cdn/operationresults/delete |  |
> | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/read |  |
> | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/write |  |
> | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/CheckResourceUsage/action |  |
> | Microsoft.Cdn/operationresults/profileresults/GenerateSsoUri/action |  |
> | Microsoft.Cdn/operationresults/profileresults/GetSupportedOptimizationTypes/action |  |
> | Microsoft.Cdn/operationresults/profileresults/CheckHostNameAvailability/action |  |
> | Microsoft.Cdn/operationresults/profileresults/Usages/action |  |
> | Microsoft.Cdn/operationresults/profileresults/Upgrade/action |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/Purge/action |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/Usages/action |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/CheckEndpointNameAvailability/action |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/routeresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/routeresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/afdendpointresults/routeresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/customdomainresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/customdomainresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/customdomainresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/customdomainresults/RefreshValidationToken/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/CheckResourceUsage/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Start/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Stop/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Purge/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/Load/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/DisableCustomHttps/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/EnableCustomHttps/action |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/origingroupresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/Usages/action |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/originresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/originresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/origingroupresults/originresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/Usages/action |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/ruleresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/ruleresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/rulesetresults/ruleresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/secretresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/secretresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/secretresults/delete |  |
> | Microsoft.Cdn/operationresults/profileresults/securitypolicyresults/read |  |
> | Microsoft.Cdn/operationresults/profileresults/securitypolicyresults/write |  |
> | Microsoft.Cdn/operationresults/profileresults/securitypolicyresults/delete |  |
> | Microsoft.Cdn/operations/read |  |
> | Microsoft.Cdn/profiles/read |  |
> | Microsoft.Cdn/profiles/write |  |
> | Microsoft.Cdn/profiles/delete |  |
> | Microsoft.Cdn/profiles/CheckResourceUsage/action |  |
> | Microsoft.Cdn/profiles/GenerateSsoUri/action |  |
> | Microsoft.Cdn/profiles/GetSupportedOptimizationTypes/action |  |
> | Microsoft.Cdn/profiles/CheckHostNameAvailability/action |  |
> | Microsoft.Cdn/profiles/Usages/action |  |
> | Microsoft.Cdn/profiles/Upgrade/action |  |
> | Microsoft.Cdn/profiles/afdendpoints/read |  |
> | Microsoft.Cdn/profiles/afdendpoints/write |  |
> | Microsoft.Cdn/profiles/afdendpoints/delete |  |
> | Microsoft.Cdn/profiles/afdendpoints/Purge/action |  |
> | Microsoft.Cdn/profiles/afdendpoints/Usages/action |  |
> | Microsoft.Cdn/profiles/afdendpoints/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/profiles/afdendpoints/CheckEndpointNameAvailability/action |  |
> | Microsoft.Cdn/profiles/afdendpoints/routes/read |  |
> | Microsoft.Cdn/profiles/afdendpoints/routes/write |  |
> | Microsoft.Cdn/profiles/afdendpoints/routes/delete |  |
> | Microsoft.Cdn/profiles/customdomains/read |  |
> | Microsoft.Cdn/profiles/customdomains/write |  |
> | Microsoft.Cdn/profiles/customdomains/delete |  |
> | Microsoft.Cdn/profiles/customdomains/RefreshValidationToken/action |  |
> | Microsoft.Cdn/profiles/endpoints/read |  |
> | Microsoft.Cdn/profiles/endpoints/write |  |
> | Microsoft.Cdn/profiles/endpoints/delete |  |
> | Microsoft.Cdn/profiles/endpoints/CheckResourceUsage/action |  |
> | Microsoft.Cdn/profiles/endpoints/Start/action |  |
> | Microsoft.Cdn/profiles/endpoints/Stop/action |  |
> | Microsoft.Cdn/profiles/endpoints/Purge/action |  |
> | Microsoft.Cdn/profiles/endpoints/Load/action |  |
> | Microsoft.Cdn/profiles/endpoints/ValidateCustomDomain/action |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/read |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/write |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/delete |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/DisableCustomHttps/action |  |
> | Microsoft.Cdn/profiles/endpoints/customdomains/EnableCustomHttps/action |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/read |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/write |  |
> | Microsoft.Cdn/profiles/endpoints/origingroups/delete |  |
> | Microsoft.Cdn/profiles/endpoints/origins/read |  |
> | Microsoft.Cdn/profiles/endpoints/origins/write |  |
> | Microsoft.Cdn/profiles/endpoints/origins/delete |  |
> | Microsoft.Cdn/profiles/endpoints/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.Cdn/profiles/endpoints/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the resource |
> | Microsoft.Cdn/profiles/endpoints/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Microsoft.Cdn/profiles/endpoints |
> | Microsoft.Cdn/profiles/getloganalyticslocations/read |  |
> | Microsoft.Cdn/profiles/getloganalyticsmetrics/read |  |
> | Microsoft.Cdn/profiles/getloganalyticsrankings/read |  |
> | Microsoft.Cdn/profiles/getloganalyticsresources/read |  |
> | Microsoft.Cdn/profiles/getwafloganalyticsmetrics/read |  |
> | Microsoft.Cdn/profiles/getwafloganalyticsrankings/read |  |
> | Microsoft.Cdn/profiles/origingroups/read |  |
> | Microsoft.Cdn/profiles/origingroups/write |  |
> | Microsoft.Cdn/profiles/origingroups/delete |  |
> | Microsoft.Cdn/profiles/origingroups/Usages/action |  |
> | Microsoft.Cdn/profiles/origingroups/origins/read |  |
> | Microsoft.Cdn/profiles/origingroups/origins/write |  |
> | Microsoft.Cdn/profiles/origingroups/origins/delete |  |
> | Microsoft.Cdn/profiles/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic settings for the resource |
> | Microsoft.Cdn/profiles/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic settings for the resource |
> | Microsoft.Cdn/profiles/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Microsoft.Cdn/profiles |
> | Microsoft.Cdn/profiles/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.Cdn |
> | Microsoft.Cdn/profiles/rulesets/read |  |
> | Microsoft.Cdn/profiles/rulesets/write |  |
> | Microsoft.Cdn/profiles/rulesets/delete |  |
> | Microsoft.Cdn/profiles/rulesets/Usages/action |  |
> | Microsoft.Cdn/profiles/rulesets/rules/read |  |
> | Microsoft.Cdn/profiles/rulesets/rules/write |  |
> | Microsoft.Cdn/profiles/rulesets/rules/delete |  |
> | Microsoft.Cdn/profiles/secrets/read |  |
> | Microsoft.Cdn/profiles/secrets/write |  |
> | Microsoft.Cdn/profiles/secrets/delete |  |
> | Microsoft.Cdn/profiles/securitypolicies/read |  |
> | Microsoft.Cdn/profiles/securitypolicies/write |  |
> | Microsoft.Cdn/profiles/securitypolicies/delete |  |

### Microsoft.ClassicNetwork

Azure service: Classic deployment model virtual network

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicNetwork/register/action | Register to Classic Network |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/read | Get express route cross connections. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/write | Add express route cross connections. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/operationstatuses/read | Get an express route cross connection operation status. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/read | Get express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/write | Add express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/delete | Delete express route cross connection peering. |
> | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/operationstatuses/read | Get an express route cross connection peering operation status. |
> | Microsoft.ClassicNetwork/gatewaySupportedDevices/read | Retrieves the list of supported devices. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/read | Gets the network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/write | Adds a new network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/delete | Deletes the network security group. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/operationStatuses/read | Reads the operation status for the network security group. |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Network Security Groups Diagnostic Settings |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Network Security Groups diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/logDefinitions/read | Gets the events for network security group |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/read | Gets the security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/write | Adds or update a security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/delete | Deletes the security rule. |
> | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/operationStatuses/read | Reads the operation status for the network security group security rules. |
> | Microsoft.ClassicNetwork/operations/read | Get classic network operations. |
> | Microsoft.ClassicNetwork/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicNetwork/reservedIps/read | Gets the reserved Ips |
> | Microsoft.ClassicNetwork/reservedIps/write | Add a new reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/delete | Delete a reserved Ip. |
> | Microsoft.ClassicNetwork/reservedIps/link/action | Link a reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/join/action | Join a reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/operationStatuses/read | Reads the operation status for the reserved ips. |
> | Microsoft.ClassicNetwork/virtualNetworks/read | Get the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/write | Add a new virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/delete | Deletes the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/peer/action | Peers a virtual network with another virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/join/action | Joins the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/checkIPAddressAvailability/action | Checks the availability of a given IP address in a virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/validateMigration/action | Validates the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/prepareMigration/action | Prepares the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/commitMigration/action | Commits the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/abortMigration/action | Aborts the migration of a Virtual Network |
> | Microsoft.ClassicNetwork/virtualNetworks/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/read | Gets the virtual network gateways. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/write | Adds a virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/delete | Deletes the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/startDiagnostics/action | Starts diagnostic for the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/stopDiagnostics/action | Stops the diagnostic for the virtual network gateway. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDiagnostics/action | Downloads the gateway diagnostics. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/listCircuitServiceKey/action | Retrieves the circuit service key. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDeviceConfigurationScript/action | Downloads the device configuration script. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/listPackage/action | Lists the virtual network gateway package. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/read | Read the revoked client certificates. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/write | Revokes a client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/delete | Unrevokes a client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/read | Find the client root certificates. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/write | Uploads a new client root certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/delete | Deletes the virtual network gateway client certificate. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/download/action | Downloads certificate by thumbprint. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/listPackage/action | Lists the virtual network gateway certificate package. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/read | Retrieves the list of connections. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/connect/action | Connects a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/disconnect/action | Disconnects a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/test/action | Tests a site to site gateway connection. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/operationStatuses/read | Reads the operation status for the virtual networks gateways. |
> | Microsoft.ClassicNetwork/virtualNetworks/gateways/packages/read | Gets the virtual network gateway package. |
> | Microsoft.ClassicNetwork/virtualNetworks/operationStatuses/read | Reads the operation status for the virtual networks. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/read | Gets the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/write | Adds or updates the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/delete | Deletes the remote virtual network peering proxy. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/read | Gets the network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/write | Adds a network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the subnet. |
> | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual network subnet associated network security group. |
> | Microsoft.ClassicNetwork/virtualNetworks/virtualNetworkPeerings/read | Gets the virtual network peering. |

### Microsoft.HybridConnectivity

Azure service: Microsoft.HybridConnectivity

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.HybridConnectivity/register/action | Register the subscription for Microsoft.HybridConnectivity |
> | Microsoft.HybridConnectivity/unregister/action | Unregister the subscription for Microsoft.HybridConnectivity |
> | Microsoft.HybridConnectivity/endpoints/read | Get or list of endpoints to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/write | Create or update the endpoint to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/delete | Deletes the endpoint access to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/listCredentials/action | List the endpoint access credentials to the resource. |
> | Microsoft.HybridConnectivity/endpoints/listIngressGatewayCredentials/action | List the ingress gateway access credentials to the resource. |
> | Microsoft.HybridConnectivity/endpoints/listManagedProxyDetails/action | List the managed proxy details to the resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/read | Get or list of serviceConfigurations to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/write | Create or update the serviceConfigurations to the target resource. |
> | Microsoft.HybridConnectivity/endpoints/serviceConfigurations/delete | Deletes the serviceConfigurations access to the target resource. |
> | Microsoft.HybridConnectivity/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.HybridConnectivity/operations/read | Get the list of Operations |

### Microsoft.MobileNetwork

Azure service: [Mobile networks](../../../private-5g-core/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.MobileNetwork/register/action | Register the subscription for Microsoft.MobileNetwork |
> | Microsoft.MobileNetwork/unregister/action | Unregister the subscription for Microsoft.MobileNetwork |
> | Microsoft.MobileNetwork/Locations/OperationStatuses/read | read OperationStatuses |
> | Microsoft.MobileNetwork/Locations/OperationStatuses/write | write OperationStatuses |
> | Microsoft.MobileNetwork/mobileNetworks/read | Gets information about the specified mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/write | Creates or updates a mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/delete | Deletes the specified mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/write | Updates mobile network tags. |
> | Microsoft.MobileNetwork/mobileNetworks/read | Lists all the mobile networks in a subscription. |
> | Microsoft.MobileNetwork/mobileNetworks/read | Lists all the mobile networks in a resource group. |
> | Microsoft.MobileNetwork/mobileNetworks/dataNetworks/read | Gets information about the specified data network. |
> | Microsoft.MobileNetwork/mobileNetworks/dataNetworks/write | Creates or updates a data network. Must be created in the same location as its parent mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/dataNetworks/delete | Deletes the specified data network. |
> | Microsoft.MobileNetwork/mobileNetworks/dataNetworks/write | Updates data network tags. |
> | Microsoft.MobileNetwork/mobileNetworks/dataNetworks/read | Lists all data networks in the mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/services/read | Gets information about the specified service. |
> | Microsoft.MobileNetwork/mobileNetworks/services/write | Creates or updates a service. Must be created in the same location as its parent mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/services/delete | Deletes the specified service. |
> | Microsoft.MobileNetwork/mobileNetworks/services/write | Updates service tags. |
> | Microsoft.MobileNetwork/mobileNetworks/services/read | Gets all the services in a mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/simPolicies/read | Gets information about the specified SIM policy. |
> | Microsoft.MobileNetwork/mobileNetworks/simPolicies/write | Creates or updates a SIM policy. Must be created in the same location as its parent mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/simPolicies/delete | Deletes the specified SIM policy. |
> | Microsoft.MobileNetwork/mobileNetworks/simPolicies/write | Updates SIM policy tags. |
> | Microsoft.MobileNetwork/mobileNetworks/simPolicies/read | Gets all the SIM policies in a mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/sites/read | Gets information about the specified mobile network site. |
> | Microsoft.MobileNetwork/mobileNetworks/sites/write | Creates or updates a mobile network site. Must be created in the same location as its parent mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/sites/delete | Deletes the specified mobile network site. This will also delete any network functions that are a part of this site. |
> | Microsoft.MobileNetwork/mobileNetworks/sites/write | Updates site tags. |
> | Microsoft.MobileNetwork/mobileNetworks/sites/read | Lists all sites in the mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/slices/read | Gets information about the specified network slice. |
> | Microsoft.MobileNetwork/mobileNetworks/slices/write | Creates or updates a network slice. Must be created in the same location as its parent mobile network. |
> | Microsoft.MobileNetwork/mobileNetworks/slices/delete | Deletes the specified network slice. |
> | Microsoft.MobileNetwork/mobileNetworks/slices/write | Updates slice tags. |
> | Microsoft.MobileNetwork/mobileNetworks/slices/read | Lists all slices in the mobile network. |
> | Microsoft.MobileNetwork/Operations/read | read Operations |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/read | Gets information about the specified packet core control plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/write | Creates or updates a packet core control plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/delete | Deletes the specified packet core control plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/write | Updates packet core control planes tags. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/read | Lists all the packet core control planes in a subscription. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/read | Lists all the packet core control planes in a resource group. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/rollback/action | Roll back the specified packet core control plane to the previous version, "rollbackVersion". Multiple consecutive rollbacks are not possible. This action may cause a service outage. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/reinstall/action | Reinstall the specified packet core control plane. This action will remove any transaction state from the packet core to return it to a known state. This action will cause a service outage. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/collectDiagnosticsPackage/action | Collect a diagnostics package for the specified packet core control plane. This action will upload the diagnostics to a storage account. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/read | Gets information about the specified packet core data plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/write | Creates or updates a packet core data plane. Must be created in the same location as its parent packet core control plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/delete | Deletes the specified packet core data plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/write | Updates packet core data planes tags. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/read | Lists all the packet core data planes associated with a packet core control plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks/read | Gets information about the specified attached data network. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks/write | Creates or updates an attached data network. Must be created in the same location as its parent packet core data plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks/delete | Deletes the specified attached data network. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks/write | Updates an attached data network tags. |
> | Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks/read | Gets all the attached data networks associated with a packet core data plane. |
> | Microsoft.MobileNetwork/packetCoreControlPlaneVersions/read | Gets information about the specified packet core control plane version. |
> | Microsoft.MobileNetwork/packetCoreControlPlaneVersions/read | Lists all supported packet core control planes versions. |
> | Microsoft.MobileNetwork/radioAccessNetworks/read | Gets information about the specified RAN. |
> | Microsoft.MobileNetwork/radioAccessNetworks/write | Creates or updates a RAN. |
> | Microsoft.MobileNetwork/radioAccessNetworks/delete | Deletes the specified RAN. |
> | Microsoft.MobileNetwork/radioAccessNetworks/write | Updates RAN tags. |
> | Microsoft.MobileNetwork/radioAccessNetworks/read | Gets all the RANs in a subscription. |
> | Microsoft.MobileNetwork/radioAccessNetworks/read | Gets all the RANs in a resource group. |
> | Microsoft.MobileNetwork/simGroups/uploadSims/action | Bulk upload SIMs to a SIM group. |
> | Microsoft.MobileNetwork/simGroups/deleteSims/action | Bulk delete SIMs from a SIM group. |
> | Microsoft.MobileNetwork/simGroups/uploadEncryptedSims/action | Bulk upload SIMs in encrypted form to a SIM group. The SIM credentials must be encrypted. |
> | Microsoft.MobileNetwork/simGroups/read | Gets information about the specified SIM group. |
> | Microsoft.MobileNetwork/simGroups/write | Creates or updates a SIM group. |
> | Microsoft.MobileNetwork/simGroups/delete | Deletes the specified SIM group. |
> | Microsoft.MobileNetwork/simGroups/write | Updates SIM group tags. |
> | Microsoft.MobileNetwork/simGroups/read | Gets all the SIM groups in a subscription. |
> | Microsoft.MobileNetwork/simGroups/read | Gets all the SIM groups in a resource group. |
> | Microsoft.MobileNetwork/simGroups/sims/read | Gets information about the specified SIM. |
> | Microsoft.MobileNetwork/simGroups/sims/write | Creates or updates a SIM. |
> | Microsoft.MobileNetwork/simGroups/sims/delete | Deletes the specified SIM. |
> | Microsoft.MobileNetwork/simGroups/sims/read | Gets all the SIMs in a SIM group. |
> | Microsoft.MobileNetwork/sims/read | Gets information about the specified SIM. |
> | Microsoft.MobileNetwork/sims/write | Creates or updates a SIM. |
> | Microsoft.MobileNetwork/sims/delete | Deletes the specified SIM. |
> | Microsoft.MobileNetwork/sims/write | Updates SIM tags. |
> | Microsoft.MobileNetwork/sims/read | Gets all the SIMs in a subscription. |
> | Microsoft.MobileNetwork/sims/read | Gets all the SIMs in a resource group. |

### Microsoft.Network

Azure service: [Application Gateway](../../../application-gateway/index.yml), [Azure Bastion](../../../bastion/index.yml), [Azure DDoS Protection](../../../ddos-protection/ddos-protection-overview.md), [Azure DNS](../../../dns/index.yml), [Azure ExpressRoute](../../../expressroute/index.yml), [Azure Firewall](../../../firewall/index.yml), [Azure Front Door Service](../../../frontdoor/index.yml), [Azure Private Link](../../../private-link/index.yml), [Load Balancer](../../../load-balancer/index.yml), [Network Watcher](../../../network-watcher/index.yml), [Traffic Manager](../../../traffic-manager/index.yml), [Virtual Network](../../../virtual-network/index.yml), [Virtual WAN](../../../virtual-wan/index.yml), [VPN Gateway](../../../vpn-gateway/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Network/register/action | Registers the subscription |
> | Microsoft.Network/unregister/action | Unregisters the subscription |
> | Microsoft.Network/checkTrafficManagerNameAvailability/action | Checks the availability of a Traffic Manager Relative DNS name. |
> | Microsoft.Network/internalNotify/action | DNS alias resource notification |
> | Microsoft.Network/getDnsResourceReference/action | DNS alias resource dependency request |
> | Microsoft.Network/checkFrontDoorNameAvailability/action | Checks whether a Front Door name is available |
> | Microsoft.Network/privateDnsZonesInternal/action | Executes Private DNS Zones Internal APIs |
> | Microsoft.Network/applicationGatewayAvailableRequestHeaders/read | Get Application Gateway available Request Headers |
> | Microsoft.Network/applicationGatewayAvailableResponseHeaders/read | Get Application Gateway available Response Header |
> | Microsoft.Network/applicationGatewayAvailableServerVariables/read | Get Application Gateway available Server Variables |
> | Microsoft.Network/applicationGatewayAvailableSslOptions/read | Application Gateway available Ssl Options |
> | Microsoft.Network/applicationGatewayAvailableSslOptions/predefinedPolicies/read | Application Gateway Ssl Predefined Policy |
> | Microsoft.Network/applicationGatewayAvailableWafRuleSets/read | Gets Application Gateway Available Waf Rule Sets |
> | Microsoft.Network/applicationGateways/read | Gets an application gateway |
> | Microsoft.Network/applicationGateways/write | Creates an application gateway or updates an application gateway |
> | Microsoft.Network/applicationGateways/delete | Deletes an application gateway |
> | Microsoft.Network/applicationGateways/backendhealth/action | Gets an application gateway backend health |
> | Microsoft.Network/applicationGateways/getBackendHealthOnDemand/action | Gets an application gateway backend health on demand for given http setting and backend pool |
> | Microsoft.Network/applicationGateways/resolvePrivateLinkServiceId/action | Resolves privateLinkServiceId for application gateway private link resource |
> | Microsoft.Network/applicationGateways/start/action | Starts an application gateway |
> | Microsoft.Network/applicationGateways/stop/action | Stops an application gateway |
> | Microsoft.Network/applicationGateways/restart/action | Restarts an application gateway |
> | Microsoft.Network/applicationGateways/migrateV1ToV2/action | Migrate Application Gateway from v1 sku to v2 sku |
> | Microsoft.Network/applicationGateways/getMigrationStatus/action | Get Status Of Migrate Application Gateway From V1 sku To V2 sku |
> | Microsoft.Network/applicationGateways/setSecurityCenterConfiguration/action | Sets Application Gateway Security Center Configuration |
> | Microsoft.Network/applicationGateways/effectiveNetworkSecurityGroups/action | Get Route Table configured On Application Gateway |
> | Microsoft.Network/applicationGateways/effectiveRouteTable/action | Get Route Table configured On Application Gateway |
> | Microsoft.Network/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool. Not Alertable. |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/read | Gets Application Gateway PrivateEndpoint Connections |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/write | Updates Application Gateway PrivateEndpoint Connection |
> | Microsoft.Network/applicationGateways/privateEndpointConnections/delete | Deletes Application Gateway PrivateEndpoint Connection |
> | Microsoft.Network/applicationGateways/privateLinkConfigurations/read | Gets Application Gateway Private Link Configurations |
> | Microsoft.Network/applicationGateways/privateLinkResources/read | Gets ApplicationGateway PrivateLink Resources |
> | Microsoft.Network/applicationGateways/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Application Gateway |
> | Microsoft.Network/applicationGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Application Gateway |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/read | Gets an Application Gateway WAF policy |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/write | Creates an Application Gateway WAF policy or updates an Application Gateway WAF policy |
> | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/delete | Deletes an Application Gateway WAF policy |
> | Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action | Joins an IP Configuration to Application Security Groups. Not alertable. |
> | Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action | Joins a Security Rule to Application Security Groups. Not alertable. |
> | Microsoft.Network/applicationSecurityGroups/read | Gets an Application Security Group ID. |
> | Microsoft.Network/applicationSecurityGroups/write | Creates an Application Security Group, or updates an existing Application Security Group. |
> | Microsoft.Network/applicationSecurityGroups/delete | Deletes an Application Security Group |
> | Microsoft.Network/applicationSecurityGroups/listIpConfigurations/action | Lists IP Configurations in the ApplicationSecurityGroup |
> | Microsoft.Network/azureFirewallFqdnTags/read | Gets Azure Firewall FQDN Tags |
> | Microsoft.Network/azurefirewalls/read | Get Azure Firewall |
> | Microsoft.Network/azurefirewalls/write | Creates or updates an Azure Firewall |
> | Microsoft.Network/azurefirewalls/delete | Delete Azure Firewall |
> | Microsoft.Network/azurefirewalls/learnedIPPrefixes/action | Gets IP prefixes learned by Azure Firewall to not perform SNAT |
> | Microsoft.Network/azurefirewalls/packetCapture/action | AzureFirewallPacketCaptureOperation |
> | Microsoft.Network/azureFirewalls/applicationRuleCollections/read | Gets Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/azureFirewalls/applicationRuleCollections/write | CreatesOrUpdates Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/azureFirewalls/applicationRuleCollections/delete | Deletes Azure Firewall ApplicationRuleCollection |
> | Microsoft.Network/azureFirewalls/natRuleCollections/read | Gets Azure Firewall NatRuleCollection |
> | Microsoft.Network/azureFirewalls/natRuleCollections/write | CreatesOrUpdates Azure Firewall NatRuleCollection |
> | Microsoft.Network/azureFirewalls/natRuleCollections/delete | Deletes Azure Firewall NatRuleCollection |
> | Microsoft.Network/azureFirewalls/networkRuleCollections/read | Gets Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/azureFirewalls/networkRuleCollections/write | CreatesOrUpdates Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/azureFirewalls/networkRuleCollections/delete | Deletes Azure Firewall NetworkRuleCollection |
> | Microsoft.Network/azurefirewalls/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Azure Firewall |
> | Microsoft.Network/azurefirewalls/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Azure Firewall |
> | Microsoft.Network/azureWebCategories/read | Gets Azure WebCategories |
> | Microsoft.Network/azureWebCategories/getwebcategory/action | Looks up WebCategory |
> | Microsoft.Network/azureWebCategories/classifyUnknown/action | Classifies Unknown WebCategory |
> | Microsoft.Network/azureWebCategories/reclassify/action | Reclassifies WebCategory |
> | Microsoft.Network/azureWebCategories/getMiscategorizationStatus/action | Gets Miscategorization Status |
> | Microsoft.Network/bastionHosts/read | Gets a Bastion Host |
> | Microsoft.Network/bastionHosts/write | Create or Update a Bastion Host |
> | Microsoft.Network/bastionHosts/delete | Deletes a Bastion Host |
> | Microsoft.Network/bastionHosts/getactivesessions/action | Get Active Sessions in the Bastion Host |
> | Microsoft.Network/bastionHosts/disconnectactivesessions/action | Disconnect given Active Sessions in the Bastion Host |
> | Microsoft.Network/bastionHosts/getShareableLinks/action | Returns the shareable urls for the specified VMs in a Bastion subnet provided their urls are created |
> | Microsoft.Network/bastionHosts/createShareableLinks/action | Creates shareable urls for the VMs under a bastion and returns the urls |
> | Microsoft.Network/bastionHosts/deleteShareableLinks/action | Deletes shareable urls for the provided VMs under a bastion |
> | Microsoft.Network/bastionHosts/deleteShareableLinksByToken/action | Deletes shareable urls for the provided tokens under a bastion |
> | Microsoft.Network/bastionHosts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Network/bastionHosts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Network/bastionHosts/providers/Microsoft.Insights/logDefinitions/read | Gets the available audit logs for Bastion Host |
> | Microsoft.Network/bgpServiceCommunities/read | Get Bgp Service Communities |
> | Microsoft.Network/connections/read | Gets VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/write | Creates or updates an existing VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/delete | Deletes VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/sharedkey/action | Get VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/connections/vpndeviceconfigurationscript/action | Gets Vpn Device Configuration of VirtualNetworkGatewayConnection |
> | Microsoft.Network/connections/revoke/action | Marks an Express Route Connection status as Revoked |
> | Microsoft.Network/connections/startpacketcapture/action | Starts a Virtual Network Gateway Connection Packet Capture. |
> | Microsoft.Network/connections/stoppacketcapture/action | Stops a Virtual Network Gateway Connection Packet Capture. |
> | Microsoft.Network/connections/getikesas/action | Lists IKE Security Associations for the connection |
> | Microsoft.Network/connections/resetconnection/action | Resets connection for VNG |
> | Microsoft.Network/connections/providers/Microsoft.Insights/diagnosticSettings/read | Gets diagnostic settings for Connections |
> | Microsoft.Network/connections/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates diagnostic settings for Connections |
> | Microsoft.Network/connections/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for Connections |
> | Microsoft.Network/connections/sharedKey/read | Gets VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/connections/sharedKey/write | Creates or updates an existing VirtualNetworkGatewayConnection SharedKey |
> | Microsoft.Network/customIpPrefixes/read | Gets a Custom Ip Prefix Definition |
> | Microsoft.Network/customIpPrefixes/write | Creates A Custom Ip Prefix Or Updates An Existing Custom Ip Prefix |
> | Microsoft.Network/customIpPrefixes/delete | Deletes A Custom Ip Prefix |
> | Microsoft.Network/customIpPrefixes/join/action | Joins a CustomIpPrefix. Not alertable. |
> | Microsoft.Network/ddosCustomPolicies/read | Gets a DDoS customized policy definition Definition |
> | Microsoft.Network/ddosCustomPolicies/write | Creates a DDoS customized policy or updates an existing DDoS customized policy |
> | Microsoft.Network/ddosCustomPolicies/delete | Deletes a DDoS customized policy |
> | Microsoft.Network/ddosProtectionPlans/read | Gets a DDoS Protection Plan |
> | Microsoft.Network/ddosProtectionPlans/write | Creates a DDoS Protection Plan or updates a DDoS Protection Plan  |
> | Microsoft.Network/ddosProtectionPlans/delete | Deletes a DDoS Protection Plan |
> | Microsoft.Network/ddosProtectionPlans/join/action | Joins a DDoS Protection Plan. Not alertable. |
> | Microsoft.Network/ddosProtectionPlans/ddosProtectionPlanProxies/read | Gets a DDoS Protection Plan Proxy definition |
> | Microsoft.Network/ddosProtectionPlans/ddosProtectionPlanProxies/write | Creates a DDoS Protection Plan Proxy or updates and existing DDoS Protection Plan Proxy |
> | Microsoft.Network/ddosProtectionPlans/ddosProtectionPlanProxies/delete | Deletes a DDoS Protection Plan Proxy |
> | Microsoft.Network/dnsForwardingRulesets/read | Gets a DNS Forwarding Ruleset, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/write | Creates Or Updates a DNS Forwarding Ruleset |
> | Microsoft.Network/dnsForwardingRulesets/join/action | Join DNS Forwarding Ruleset |
> | Microsoft.Network/dnsForwardingRulesets/delete | Deletes a DNS Forwarding Ruleset, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/forwardingRules/read | Gets a DNS Forwarding Rule, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/forwardingRules/write | Creates Or Updates a DNS Forwarding Rule, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/forwardingRules/delete | Deletes a DNS Forwarding Rule, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks/read | Gets the DNS Forwarding Ruleset Link to virtual network properties, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks/write | Creates Or Updates DNS Forwarding Ruleset Link to virtual network properties, in JSON format |
> | Microsoft.Network/dnsForwardingRulesets/virtualNetworkLinks/delete | Deletes DNS Forwarding Ruleset Link to Virtual Network |
> | Microsoft.Network/dnsoperationresults/read | Gets results of a DNS operation |
> | Microsoft.Network/dnsoperationstatuses/read | Gets status of a DNS operation  |
> | Microsoft.Network/dnsResolvers/read | Gets the DNS Resolver Properties, in JSON format |
> | Microsoft.Network/dnsResolvers/write | Creates Or Updates a DNS Resolver, in JSON format |
> | Microsoft.Network/dnsResolvers/join/action | Join DNS Resolver |
> | Microsoft.Network/dnsResolvers/delete | Deletes a DNS Resolver |
> | Microsoft.Network/dnsResolvers/inboundEndpoints/read | Gets the DNS Resolver Inbound Endpoint, in JSON format |
> | Microsoft.Network/dnsResolvers/inboundEndpoints/write | Creates Or Updates a DNS Resolver Inbound Endpoint, in JSON format |
> | Microsoft.Network/dnsResolvers/inboundEndpoints/join/action | Join DNS Resolver |
> | Microsoft.Network/dnsResolvers/inboundEndpoints/delete | Deletes a DNS Resolver Inbound Endpoint, in JSON format |
> | Microsoft.Network/dnsResolvers/outboundEndpoints/read | Gets the DNS Resolver Outbound Endpoint Properties, in JSON format |
> | Microsoft.Network/dnsResolvers/outboundEndpoints/write | Creates Or Updates a DNS Resolver Outbound Endpoint, in JSON format |
> | Microsoft.Network/dnsResolvers/outboundEndpoints/join/action | Join DNS Resolver |
> | Microsoft.Network/dnsResolvers/outboundEndpoints/delete | Deletes a DNS Resolver Outbound Endpoint description. |
> | Microsoft.Network/dnsResolvers/outboundEndpoints/listDnsForwardingRulesets/action | Gets the DNS Forwarding Rulesets Properties for DNS Resolver Outbound Endpoint, in JSON format |
> | Microsoft.Network/dnszones/read | Get the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. Note that this command does not retrieve the record sets contained within the zone. |
> | Microsoft.Network/dnszones/write | Create or update a DNS zone within a resource group.  Used to update the tags on a DNS zone resource. Note that this command can not be used to create or update record sets within the zone. |
> | Microsoft.Network/dnszones/delete | Delete the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. |
> | Microsoft.Network/dnszones/A/read | Get the record set of type 'A', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/A/write | Create or update a record set of type 'A' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/A/delete | Remove the record set of a given name and type 'A' from a DNS zone. |
> | Microsoft.Network/dnszones/AAAA/read | Get the record set of type 'AAAA', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/AAAA/write | Create or update a record set of type 'AAAA' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/AAAA/delete | Remove the record set of a given name and type 'AAAA' from a DNS zone. |
> | Microsoft.Network/dnszones/all/read | Gets DNS record sets across types |
> | Microsoft.Network/dnszones/CAA/read | Get the record set of type 'CAA', in JSON format. The record set contains the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/CAA/write | Create or update a record set of type 'CAA' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/CAA/delete | Remove the record set of a given name and type 'CAA' from a DNS zone. |
> | Microsoft.Network/dnszones/CNAME/read | Get the record set of type 'CNAME', in JSON format. The record set contains the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/CNAME/write | Create or update a record set of type 'CNAME' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/CNAME/delete | Remove the record set of a given name and type 'CNAME' from a DNS zone. |
> | Microsoft.Network/dnszones/MX/read | Get the record set of type 'MX', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/MX/write | Create or update a record set of type 'MX' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/MX/delete | Remove the record set of a given name and type 'MX' from a DNS zone. |
> | Microsoft.Network/dnszones/NS/read | Gets DNS record set of type NS |
> | Microsoft.Network/dnszones/NS/write | Creates or updates DNS record set of type NS |
> | Microsoft.Network/dnszones/NS/delete | Deletes the DNS record set of type NS |
> | Microsoft.Network/dnszones/providers/Microsoft.Insights/diagnosticSettings/read | Gets the DNS zone diagnostic settings |
> | Microsoft.Network/dnszones/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the DNS zone diagnostic settings |
> | Microsoft.Network/dnszones/providers/Microsoft.Insights/metricDefinitions/read | Gets the DNS zone metric definitions |
> | Microsoft.Network/dnszones/PTR/read | Get the record set of type 'PTR', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/PTR/write | Create or update a record set of type 'PTR' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/PTR/delete | Remove the record set of a given name and type 'PTR' from a DNS zone. |
> | Microsoft.Network/dnszones/recordsets/read | Gets DNS record sets across types |
> | Microsoft.Network/dnszones/SOA/read | Gets DNS record set of type SOA |
> | Microsoft.Network/dnszones/SOA/write | Creates or updates DNS record set of type SOA |
> | Microsoft.Network/dnszones/SRV/read | Get the record set of type 'SRV', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/SRV/write | Create or update record set of type SRV |
> | Microsoft.Network/dnszones/SRV/delete | Remove the record set of a given name and type 'SRV' from a DNS zone. |
> | Microsoft.Network/dnszones/TXT/read | Get the record set of type 'TXT', in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/dnszones/TXT/write | Create or update a record set of type 'TXT' within a DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/dnszones/TXT/delete | Remove the record set of a given name and type 'TXT' from a DNS zone. |
> | Microsoft.Network/dscpConfiguration/write | Operation to put the DSCP configuration |
> | Microsoft.Network/dscpConfiguration/read | Operation to put the DSCP configuration |
> | Microsoft.Network/dscpConfiguration/join/action | Joins DSCP Configuration |
> | Microsoft.Network/expressRouteCircuits/read | Get an ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/write | Creates or updates an existing ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/join/action | Joins an Express Route Circuit. Not alertable. |
> | Microsoft.Network/expressRouteCircuits/delete | Deletes an ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/nrpinternalupdate/action | Create or Update ExpressRouteCircuit |
> | Microsoft.Network/expressRouteCircuits/authorizations/read | Gets an ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/authorizations/write | Creates or updates an existing ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/authorizations/delete | Deletes an ExpressRouteCircuit Authorization |
> | Microsoft.Network/expressRouteCircuits/peerings/read | Gets an ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/write | Creates or updates an existing ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/delete | Deletes an ExpressRouteCircuit Peering |
> | Microsoft.Network/expressRouteCircuits/peerings/arpTables/read | Gets an ExpressRouteCircuit Peering ArpTable |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/read | Gets an ExpressRouteCircuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/write | Creates or updates an existing ExpressRouteCircuit Connection Resource |
> | Microsoft.Network/expressRouteCircuits/peerings/connections/delete | Deletes an ExpressRouteCircuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/peerConnections/read | Gets Peer Express Route Circuit Connection |
> | Microsoft.Network/expressRouteCircuits/peerings/providers/Microsoft.Insights/diagnosticSettings/read | Gets diagnostic settings for ExpressRoute Circuit Peerings |
> | Microsoft.Network/expressRouteCircuits/peerings/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates diagnostic settings for ExpressRoute Circuit Peerings |
> | Microsoft.Network/expressRouteCircuits/peerings/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for ExpressRoute Circuit Peerings |
> | Microsoft.Network/expressRouteCircuits/peerings/routeTables/read | Gets an ExpressRouteCircuit Peering RouteTable |
> | Microsoft.Network/expressRouteCircuits/peerings/routeTablesSummary/read | Gets an ExpressRouteCircuit Peering RouteTable Summary |
> | Microsoft.Network/expressRouteCircuits/peerings/stats/read | Gets an ExpressRouteCircuit Peering Stat |
> | Microsoft.Network/expressRouteCircuits/providers/Microsoft.Insights/diagnosticSettings/read | Gets diagnostic settings for ExpressRoute Circuits |
> | Microsoft.Network/expressRouteCircuits/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates diagnostic settings for ExpressRoute Circuits |
> | Microsoft.Network/expressRouteCircuits/providers/Microsoft.Insights/logDefinitions/read | Get the events for ExpressRoute Circuits |
> | Microsoft.Network/expressRouteCircuits/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for ExpressRoute Circuits |
> | Microsoft.Network/expressRouteCircuits/stats/read | Gets an ExpressRouteCircuit Stat |
> | Microsoft.Network/expressRouteCrossConnections/read | Get Express Route Cross Connection |
> | Microsoft.Network/expressRouteCrossConnections/write | Create or Update Express Route Cross Connection |
> | Microsoft.Network/expressRouteCrossConnections/delete | Delete Express Route Cross Connection |
> | Microsoft.Network/expressRouteCrossConnections/serviceProviders/action | Backfill Express Route Cross Connection |
> | Microsoft.Network/expressRouteCrossConnections/join/action | Joins an Express Route Cross Connection. Not alertable. |
> | Microsoft.Network/expressRouteCrossConnections/peerings/read | Gets an Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/write | Creates an Express Route Cross Connection Peering or Updates an existing Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/delete | Deletes an Express Route Cross Connection Peering |
> | Microsoft.Network/expressRouteCrossConnections/peerings/arpTables/read | Gets an Express Route Cross Connection Peering Arp Table |
> | Microsoft.Network/expressRouteCrossConnections/peerings/routeTables/read | Gets an Express Route Cross Connection Peering Route Table |
> | Microsoft.Network/expressRouteCrossConnections/peerings/routeTableSummary/read | Gets an Express Route Cross Connection Peering Route Table Summary |
> | Microsoft.Network/expressRouteGateways/read | Get Express Route Gateway |
> | Microsoft.Network/expressRouteGateways/write | Create or Update Express Route Gateway |
> | Microsoft.Network/expressRouteGateways/delete | Delete Express Route Gateway |
> | Microsoft.Network/expressRouteGateways/join/action | Joins an Express Route Gateway. Not alertable. |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/read | Gets an Express Route Connection |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/write | Creates an Express Route Connection or Updates an existing Express Route Connection |
> | Microsoft.Network/expressRouteGateways/expressRouteConnections/delete | Deletes an Express Route Connection |
> | Microsoft.Network/expressRouteGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for ExpressRoute Gateways |
> | Microsoft.Network/expressRoutePorts/read | Gets ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/write | Creates or updates ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/join/action | Joins Express Route ports. Not alertable. |
> | Microsoft.Network/expressRoutePorts/delete | Deletes ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/generateloa/action | Generates LOA for ExpressRoutePorts |
> | Microsoft.Network/expressRoutePorts/authorizations/read | Gets an ExpressRoutePorts Authorization |
> | Microsoft.Network/expressRoutePorts/authorizations/write | Creates or updates an existing ExpressRoutePorts Authorization |
> | Microsoft.Network/expressRoutePorts/authorizations/delete | Deletes an ExpressRoutePorts Authorization |
> | Microsoft.Network/expressRoutePorts/links/read | Gets ExpressRouteLink |
> | Microsoft.Network/expressRoutePorts/providers/Microsoft.Insights/metricDefinitions/read | Gets the metric definitions for ExpressRoute Ports |
> | Microsoft.Network/expressRoutePortsLocations/read | Get Express Route Ports Locations |
> | Microsoft.Network/expressRouteServiceProviders/read | Gets Express Route Service Providers |
> | Microsoft.Network/firewallPolicies/read | Gets a Firewall Policy |
> | Microsoft.Network/firewallPolicies/write | Creates a Firewall Policy or Updates an existing Firewall Policy |
> | Microsoft.Network/firewallPolicies/join/action | Joins a Firewall Policy. Not alertable. |
> | Microsoft.Network/firewallPolicies/certificates/action | Generate Firewall Policy Certificates |
> | Microsoft.Network/firewallPolicies/delete | Deletes a Firewall Policy |
> | Microsoft.Network/firewallPolicies/ruleCollectionGroups/read | Gets a Firewall Policy Rule Collection Group |
> | Microsoft.Network/firewallPolicies/ruleCollectionGroups/write | Creates a Firewall Policy Rule Collection Group or Updates an existing Firewall Policy Rule Collection Group |
> | Microsoft.Network/firewallPolicies/ruleCollectionGroups/delete | Deletes a Firewall Policy Rule Collection Group |
> | Microsoft.Network/firewallPolicies/ruleGroups/read | Gets a Firewall Policy Rule Group |
> | Microsoft.Network/firewallPolicies/ruleGroups/write | Creates a Firewall Policy Rule Group or Updates an existing Firewall Policy Rule Group |
> | Microsoft.Network/firewallPolicies/ruleGroups/delete | Deletes a Firewall Policy Rule Group |
> | Microsoft.Network/frontdooroperationresults/read | Gets Frontdoor operation result |
> | Microsoft.Network/frontdooroperationresults/frontdoorResults/read | Gets Frontdoor operation result |
> | Microsoft.Network/frontdooroperationresults/rulesenginesresults/read | Gets Rules Engine operation result |
> | Microsoft.Network/frontDoors/read | Gets a Front Door |
> | Microsoft.Network/frontDoors/write | Creates or updates a Front Door |
> | Microsoft.Network/frontDoors/delete | Deletes a Front Door |
> | Microsoft.Network/frontDoors/purge/action | Purge cached content from a Front Door |
> | Microsoft.Network/frontDoors/validateCustomDomain/action | Validates a frontend endpoint for a Front Door |
> | Microsoft.Network/frontDoors/backendPools/read | Gets a backend pool |
> | Microsoft.Network/frontDoors/backendPools/write | Creates or updates a backend pool |
> | Microsoft.Network/frontDoors/backendPools/delete | Deletes a backend pool |
> | Microsoft.Network/frontDoors/frontendEndpoints/read | Gets a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/write | Creates or updates a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/delete | Deletes a frontend endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/enableHttps/action | Enables HTTPS on a Frontend Endpoint |
> | Microsoft.Network/frontDoors/frontendEndpoints/disableHttps/action | Disables HTTPS on a Frontend Endpoint |
> | Microsoft.Network/frontDoors/healthProbeSettings/read | Gets health probe settings |
> | Microsoft.Network/frontDoors/healthProbeSettings/write | Creates or updates health probe settings |
> | Microsoft.Network/frontDoors/healthProbeSettings/delete | Deletes health probe settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/read | Gets load balancing settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/write | Creates or updates load balancing settings |
> | Microsoft.Network/frontDoors/loadBalancingSettings/delete | Creates or updates load balancing settings |
> | Microsoft.Network/frontdoors/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic setting for the Frontdoor resource |
> | Microsoft.Network/frontdoors/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Frontdoor resource |
> | Microsoft.Network/frontdoors/providers/Microsoft.Insights/logDefinitions/read | Get available logs for Frontdoor resources |
> | Microsoft.Network/frontdoors/providers/Microsoft.Insights/metricDefinitions/read | Get available metrics for Frontdoor resources |
> | Microsoft.Network/frontDoors/routingRules/read | Gets a routing rule |
> | Microsoft.Network/frontDoors/routingRules/write | Creates or updates a routing rule |
> | Microsoft.Network/frontDoors/routingRules/delete | Deletes a routing rule |
> | Microsoft.Network/frontDoors/rulesEngines/read | Gets a Rules Engine |
> | Microsoft.Network/frontDoors/rulesEngines/write | Creates or updates a Rules Engine |
> | Microsoft.Network/frontDoors/rulesEngines/delete | Deletes a Rules Engine |
> | Microsoft.Network/frontDoorWebApplicationFirewallManagedRuleSets/read | Gets Web Application Firewall Managed Rule Sets |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/read | Gets a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/write | Creates or updates a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/delete | Deletes a Web Application Firewall Policy |
> | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/join/action | Joins a Web Application Firewall Policy. Not Alertable. |
> | Microsoft.Network/internalPublicIpAddresses/read | Returns internal public IP addresses in subscription |
> | Microsoft.Network/ipAllocations/read | Get The IpAllocation |
> | Microsoft.Network/ipAllocations/write | Creates A IpAllocation Or Updates An Existing IpAllocation |
> | Microsoft.Network/ipAllocations/delete | Deletes A IpAllocation |
> | Microsoft.Network/ipGroups/read | Gets an IpGroup |
> | Microsoft.Network/ipGroups/write | Creates an IpGroup or Updates an Existing IpGroup |
> | Microsoft.Network/ipGroups/validate/action | Validates an IpGroup |
> | Microsoft.Network/ipGroups/updateReferences/action | Update references in an IpGroup |
> | Microsoft.Network/ipGroups/join/action | Joins an IpGroup. Not alertable. |
> | Microsoft.Network/ipGroups/delete | Deletes an IpGroup |
> | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Microsoft.Network/loadBalancers/write | Creates a load balancer or updates an existing load balancer |
> | Microsoft.Network/loadBalancers/delete | Deletes a load balancer |
> | Microsoft.Network/loadBalancers/health/action | Get Health Summary of Load Balancer |
> | Microsoft.Network/loadBalancers/migrateToIpBased/action | Migrate from NIC based to IP based Load Balancer |
> | Microsoft.Network/loadBalancers/backendAddressPools/queryInboundNatRulePortMapping/action | Query inbound Nat rule port mapping. |
> | Microsoft.Network/loadBalancers/backendAddressPools/updateAdminState/action | Update AdminStates of backend addresses of a pool |
> | Microsoft.Network/loadBalancers/backendAddressPools/health/action | Get Health Details of Backend Instance |
> | Microsoft.Network/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | Microsoft.Network/loadBalancers/backendAddressPools/write | Creates a load balancer backend address pool or updates an existing load balancer backend address pool |
> | Microsoft.Network/loadBalancers/backendAddressPools/delete | Deletes a load balancer backend address pool |
> | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | Microsoft.Network/loadBalancers/backendAddressPools/backendPoolAddresses/read | Lists the backend addresses of the Load Balancer backend address pool |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action | Joins a Load Balancer Frontend IP Configuration. Not alertable. |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/read | Gets a load balancer frontend IP address backend pool definition |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/write | Creates a load balancer frontend IP address backend pool or updates an existing public IP address load balancer backend pool |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/delete | Deletes a load balancer frontend IP address backend pool |
> | Microsoft.Network/loadBalancers/frontendIPConfigurations/loadBalancerPools/join/action | Joins a load balancer frontend IP address backend pool. Not alertable. |
> | Microsoft.Network/loadBalancers/inboundNatPools/read | Gets a load balancer inbound nat pool definition |
> | Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
> | Microsoft.Network/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | Microsoft.Network/loadBalancers/inboundNatRules/write | Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule |
> | Microsoft.Network/loadBalancers/inboundNatRules/delete | Deletes a load balancer inbound nat rule |
> | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | Microsoft.Network/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | Microsoft.Network/loadBalancers/loadBalancingRules/health/action | Get Health Details of Load Balancing Rule |
> | Microsoft.Network/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | Microsoft.Network/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | Microsoft.Network/loadBalancers/probes/read | Gets a load balancer probe |
> | Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. Not alertable. |
> | Microsoft.Network/loadBalancers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Load Balancer Diagnostic Settings |
> | Microsoft.Network/loadBalancers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Load Balancer Diagnostic Settings |
> | Microsoft.Network/loadBalancers/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Load Balancer |
> | Microsoft.Network/loadBalancers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Load Balancer |
> | Microsoft.Network/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | Microsoft.Network/localnetworkgateways/read | Gets LocalNetworkGateway |
> | Microsoft.Network/localnetworkgateways/write | Creates or updates an existing LocalNetworkGateway |
> | Microsoft.Network/localnetworkgateways/delete | Deletes LocalNetworkGateway |
> | Microsoft.Network/locations/checkAcceleratedNetworkingSupport/action | Checks Accelerated Networking support |
> | Microsoft.Network/locations/batchValidatePrivateEndpointsForResourceMove/action | Validates private endpoints in batches for resource move. |
> | Microsoft.Network/locations/batchNotifyPrivateEndpointsForResourceMove/action | Notifies to private endpoint in batches for resource move. |
> | Microsoft.Network/locations/checkPrivateLinkServiceVisibility/action | Checks Private Link Service Visibility |
> | Microsoft.Network/locations/validateResourceOwnership/action | Validates Resource Ownership |
> | Microsoft.Network/locations/setResourceOwnership/action | Sets Resource Ownership |
> | Microsoft.Network/locations/effectiveResourceOwnership/action | Gets Effective  Resource Ownership |
> | Microsoft.Network/locations/setAzureNetworkManagerConfiguration/action | Sets Azure Network Manager Configuration |
> | Microsoft.Network/locations/publishResources/action | Publish Subscrioption Resources |
> | Microsoft.Network/locations/getAzureNetworkManagerConfiguration/action | Gets Azure Network Manager Configuration |
> | Microsoft.Network/locations/bareMetalTenants/action | Allocates or validates a Bare Metal Tenant |
> | Microsoft.Network/locations/commitInternalAzureNetworkManagerConfiguration/action | Commits Internal AzureNetworkManager Configuration In ANM |
> | Microsoft.Network/locations/internalAzureVirtualNetworkManagerOperation/action | Internal AzureVirtualNetworkManager Operation In ANM |
> | Microsoft.Network/locations/setLoadBalancerFrontendPublicIpAddresses/action | SetLoadBalancerFrontendPublicIpAddresses targets frontend IP configurations of 2 load balancers. Azure Resource Manager IDs of the IP configurations are provided in the body of the request. |
> | Microsoft.Network/locations/queryNetworkSecurityPerimeter/action | Queries Network Security Perimeter by the perimeter GUID |
> | Microsoft.Network/locations/applicationGatewayWafDynamicManifests/read | Get the application gateway waf dynamic manifest |
> | Microsoft.Network/locations/applicationGatewayWafDynamicManifests/default/read | Get Application Gateway Waf Dynamic Manifest Default entry |
> | Microsoft.Network/locations/autoApprovedPrivateLinkServices/read | Gets Auto Approved Private Link Services |
> | Microsoft.Network/locations/availableDelegations/read | Gets Available Delegations |
> | Microsoft.Network/locations/availablePrivateEndpointTypes/read | Gets available Private Endpoint resources |
> | Microsoft.Network/locations/availableServiceAliases/read | Gets Available Service Aliases |
> | Microsoft.Network/locations/checkDnsNameAvailability/read | Checks if dns label is available at the specified location |
> | Microsoft.Network/locations/dataTasks/run/action | Runs Data Task |
> | Microsoft.Network/locations/dnsResolverOperationResults/read | Gets results of a DNS Resolver operation, in JSON format |
> | Microsoft.Network/locations/dnsResolverOperationStatuses/read | Gets status of a DNS Resolver operation |
> | Microsoft.Network/locations/operationResults/read | Gets operation result of an async POST or DELETE operation |
> | Microsoft.Network/locations/operations/read | Gets operation resource that represents status of an asynchronous operation |
> | Microsoft.Network/locations/privateLinkServices/privateEndpointConnectionProxies/read | Gets an private endpoint connection proxy resource. |
> | Microsoft.Network/locations/privateLinkServices/privateEndpointConnectionProxies/write | Creates a new private endpoint connection proxy, or updates an existing private endpoint connection proxy. |
> | Microsoft.Network/locations/privateLinkServices/privateEndpointConnectionProxies/delete | Deletes an private endpoint connection proxy resource. |
> | Microsoft.Network/locations/serviceTagDetails/read | GetServiceTagDetails |
> | Microsoft.Network/locations/serviceTags/read | Get Service Tags |
> | Microsoft.Network/locations/supportedVirtualMachineSizes/read | Gets supported virtual machines sizes |
> | Microsoft.Network/locations/usages/read | Gets the resources usage metrics |
> | Microsoft.Network/locations/virtualNetworkAvailableEndpointServices/read | Gets a list of available Virtual Network Endpoint Services |
> | Microsoft.Network/masterCustomIpPrefixes/read | Gets a Master Custom Ip Prefix Definition |
> | Microsoft.Network/masterCustomIpPrefixes/write | Creates A Master Custom Ip Prefix Or Updates An Existing Master Custom Ip Prefix |
> | Microsoft.Network/masterCustomIpPrefixes/delete | Deletes A Master Custom Ip Prefix |
> | Microsoft.Network/natGateways/join/action | Joins a NAT Gateway |
> | Microsoft.Network/natGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Nat Gateway |
> | Microsoft.Network/networkExperimentProfiles/read | Get an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/write | Create or update an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/delete | Delete an Internet Analyzer profile |
> | Microsoft.Network/networkExperimentProfiles/experiments/read | Get an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/write | Create or update an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/delete | Delete an Internet Analyzer test |
> | Microsoft.Network/networkExperimentProfiles/experiments/timeseries/action | Get an Internet Analyzer test's time series |
> | Microsoft.Network/networkExperimentProfiles/experiments/latencyScorecard/action | Get an Internet Analyzer test's latency scorecard |
> | Microsoft.Network/networkExperimentProfiles/preconfiguredEndpoints/read | Get an Internet Analyzer profile's pre-configured endpoints |
> | Microsoft.Network/networkGroupMemberships/read | List Network Group Memberships |
> | Microsoft.Network/networkIntentPolicies/read | Gets an Network Intent Policy Description |
> | Microsoft.Network/networkIntentPolicies/write | Creates an Network Intent Policy or updates an existing Network Intent Policy |
> | Microsoft.Network/networkIntentPolicies/delete | Deletes an Network Intent Policy |
> | Microsoft.Network/networkIntentPolicies/join/action | Joins a Network Intent Policy. Not alertable. |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | Microsoft.Network/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | Microsoft.Network/networkInterfaces/delete | Deletes a network interface |
> | Microsoft.Network/networkInterfaces/effectiveRouteTable/action | Get Route Table configured On Network Interface Of The Vm |
> | Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action | Get Network Security Groups configured On Network Interface Of The Vm |
> | Microsoft.Network/networkInterfaces/rnmEffectiveRouteTable/action | Get Route Table configured On Network Interface Of The Vm In RNM Format |
> | Microsoft.Network/networkInterfaces/rnmEffectiveNetworkSecurityGroups/action | Get Network Security Groups configured On Network Interface Of The Vm In RNM Format |
> | Microsoft.Network/networkInterfaces/UpdateParentNicAttachmentOnElasticNic/action | Updates the parent NIC associated to the elastic NIC |
> | Microsoft.Network/networkInterfaces/diagnosticIdentity/read | Gets Diagnostic Identity Of The Resource |
> | Microsoft.Network/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | Microsoft.Network/networkInterfaces/ipconfigurations/join/action | Joins a Network Interface IP Configuration. Not alertable. |
> | Microsoft.Network/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | Microsoft.Network/networkInterfaces/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the Network Interface |
> | Microsoft.Network/networkInterfaces/tapConfigurations/read | Gets a Network Interface Tap Configuration. |
> | Microsoft.Network/networkInterfaces/tapConfigurations/write | Creates a Network Interface Tap Configuration or updates an existing Network Interface Tap Configuration. |
> | Microsoft.Network/networkInterfaces/tapConfigurations/delete | Deletes a Network Interface Tap Configuration. |
> | Microsoft.Network/networkManagerConnections/read | Get Network Manager Connection |
> | Microsoft.Network/networkManagerConnections/write | Create Or Update Network Manager Connection |
> | Microsoft.Network/networkManagerConnections/delete | Delete Network Manager Connection |
> | Microsoft.Network/networkManagers/read | Get Network Manager |
> | Microsoft.Network/networkManagers/write | Create Or Update Network Manager |
> | Microsoft.Network/networkManagers/delete | Delete Network Manager |
> | Microsoft.Network/networkManagers/commit/action | Network Manager Commit |
> | Microsoft.Network/networkManagers/listDeploymentStatus/action | List Deployment Status |
> | Microsoft.Network/networkManagers/listActiveSecurityAdminRules/action | List Active Security Admin Rules |
> | Microsoft.Network/networkManagers/listActiveSecurityUserRules/action | List Active Security User Rules |
> | Microsoft.Network/networkManagers/connectivityConfigurations/read | Get Connectivity Configuration |
> | Microsoft.Network/networkManagers/connectivityConfigurations/write | Create Or Update Connectivity Configuration |
> | Microsoft.Network/networkManagers/connectivityConfigurations/delete | Delete Connectivity Configuration |
> | Microsoft.Network/networkManagers/networkGroups/read | Get Network Group |
> | Microsoft.Network/networkManagers/networkGroups/write | Create Or Update Network Group |
> | Microsoft.Network/networkManagers/networkGroups/delete | Delete Network Group |
> | Microsoft.Network/networkManagers/networkGroups/join/action | Join Network Group |
> | Microsoft.Network/networkManagers/networkGroups/staticMembers/read | Get Network Group Static Member |
> | Microsoft.Network/networkManagers/networkGroups/staticMembers/write | Create Or Update Network Group Static Member |
> | Microsoft.Network/networkManagers/networkGroups/staticMembers/delete | Delete Network Group Static Member |
> | Microsoft.Network/networkManagers/scopeConnections/read | Get Network Manager Scope Connection |
> | Microsoft.Network/networkManagers/scopeConnections/write | Create Or Update Network Manager Scope Connection |
> | Microsoft.Network/networkManagers/scopeConnections/delete | Delete Network Manager Scope Connection |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/read | Get Security Admin Configuration |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/write | Create Or Update Security Admin Configuration |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/delete | Delete Security Admin Configuration |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/read | Get Security Admin Rule Collection |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/write | Create Or Update Security Admin Rule Collection |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/delete | Delete Security Admin Rule Collection |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules/read | Get Security Admin Rule |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules/write | Create Or Update Security Admin Rule |
> | Microsoft.Network/networkManagers/securityAdminConfigurations/ruleCollections/rules/delete | Delete Security Admin Rule |
> | Microsoft.Network/networkManagers/securityUserConfigurations/read | Get Security User Configuration |
> | Microsoft.Network/networkManagers/securityUserConfigurations/write | Create Or Update Security User Configuration |
> | Microsoft.Network/networkManagers/securityUserConfigurations/delete | Delete Security User Configuration |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/read | Get Security User Rule Collection |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/write | Create Or Update Security User Rule Collection |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/delete | Delete  Security User Rule Collection |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/rules/read | Get Security User Rule |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/rules/write | Create Or Update Security User Rule |
> | Microsoft.Network/networkManagers/securityUserConfigurations/ruleCollections/rules/delete | Delete Security User Rule |
> | Microsoft.Network/networkProfiles/read | Gets a Network Profile |
> | Microsoft.Network/networkProfiles/write | Creates or updates a Network Profile |
> | Microsoft.Network/networkProfiles/delete | Deletes a Network Profile |
> | Microsoft.Network/networkProfiles/setContainers/action | Sets Containers |
> | Microsoft.Network/networkProfiles/removeContainers/action | Removes Containers |
> | Microsoft.Network/networkProfiles/setNetworkInterfaces/action | Sets Container Network Interfaces |
> | Microsoft.Network/networkSecurityGroups/read | Gets a network security group definition |
> | Microsoft.Network/networkSecurityGroups/write | Creates a network security group or updates an existing network security group |
> | Microsoft.Network/networkSecurityGroups/delete | Deletes a network security group |
> | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | Microsoft.Network/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Network Security Groups Diagnostic Settings |
> | Microsoft.Network/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Network Security Groups diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.Network/networksecuritygroups/providers/Microsoft.Insights/logDefinitions/read | Gets the events for network security group |
> | Microsoft.Network/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | Microsoft.Network/networkSecurityGroups/securityRules/write | Creates a security rule or updates an existing security rule |
> | Microsoft.Network/networkSecurityGroups/securityRules/delete | Deletes a security rule |
> | Microsoft.Network/networkSecurityPerimeters/read | Gets a Network Security Perimeter |
> | Microsoft.Network/networkSecurityPerimeters/write | Creates or Updates a Network Security Perimeter |
> | Microsoft.Network/networkSecurityPerimeters/delete | Deletes a Network Security Perimeter |
> | Microsoft.Network/networkSecurityPerimeters/joinPerimeterRule/action | Joins an NSP Access Rule |
> | Microsoft.Network/networkSecurityPerimeters/linkPerimeter/action | Link Perimeter in Auto-Approval mode |
> | Microsoft.Network/networkSecurityPerimeters/linkReferences/read | Gets a Network Security Perimeter LinkReference |
> | Microsoft.Network/networkSecurityPerimeters/linkReferences/write | Creates or Updates a Network Security Perimeter LinkReference |
> | Microsoft.Network/networkSecurityPerimeters/linkReferences/delete | Deletes a Network Security Perimeter LinkReference |
> | Microsoft.Network/networkSecurityPerimeters/links/read | Gets a Network Security Perimeter Link |
> | Microsoft.Network/networkSecurityPerimeters/links/write | Creates or Updates a Network Security Perimeter Link |
> | Microsoft.Network/networkSecurityPerimeters/links/delete | Deletes a Network Security Perimeter Link |
> | Microsoft.Network/networkSecurityPerimeters/profiles/read | Gets a Network Security Perimeter Profile |
> | Microsoft.Network/networkSecurityPerimeters/profiles/write | Creates or Updates a Network Security Perimeter Profile |
> | Microsoft.Network/networkSecurityPerimeters/profiles/delete | Deletes a Network Security Perimeter Profile |
> | Microsoft.Network/networkSecurityPerimeters/profiles/join/action | Joins a Network Security Perimeter Profile |
> | Microsoft.Network/networkSecurityPerimeters/profiles/checkMembers/action | Checks if members can be accessed or not |
> | Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/read | Gets a Network Security Perimeter Access Rule |
> | Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/write | Creates or Updates a Network Security Perimeter Access Rule |
> | Microsoft.Network/networkSecurityPerimeters/profiles/accessRules/delete | Deletes a Network Security Perimeter Access Rule |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/read | Gets a Network Security Perimeter Resource Association Proxy |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/write | Creates or Updates a Network Security Perimeter Resource Association Proxy |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociationProxies/delete | Deletes a Network Security Perimeter Resource Association Proxy |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociations/read | Gets a Network Security Perimeter Resource Association |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociations/write | Creates or Updates a Network Security Perimeter Resource Association |
> | Microsoft.Network/networkSecurityPerimeters/resourceAssociations/delete | Deletes a Network Security Perimeter Resource Association |
> | Microsoft.Network/networkVirtualAppliances/delete | Delete a Network Virtual Appliance |
> | Microsoft.Network/networkVirtualAppliances/read | Get a Network Virtual Appliance |
> | Microsoft.Network/networkVirtualAppliances/write | Create or update a Network Virtual Appliance |
> | Microsoft.Network/networkVirtualAppliances/getDelegatedSubnets/action | Get Network Virtual Appliance delegated subnets |
> | Microsoft.Network/networkWatchers/read | Get the network watcher definition |
> | Microsoft.Network/networkWatchers/write | Creates a network watcher or updates an existing network watcher |
> | Microsoft.Network/networkWatchers/delete | Deletes a network watcher |
> | Microsoft.Network/networkWatchers/configureFlowLog/action | Configures flow logging for a target resource. |
> | Microsoft.Network/networkWatchers/ipFlowVerify/action | Returns whether the packet is allowed or denied to or from a particular destination. |
> | Microsoft.Network/networkWatchers/nextHop/action | For a specified target and destination IP address, return the next hop type and next hope IP address. |
> | Microsoft.Network/networkWatchers/queryFlowLogStatus/action | Gets the status of flow logging on a resource. |
> | Microsoft.Network/networkWatchers/queryTroubleshootResult/action | Gets the troubleshooting result from the previously run or currently running troubleshooting operation. |
> | Microsoft.Network/networkWatchers/securityGroupView/action | View the configured and effective network security group rules applied on a VM. |
> | Microsoft.Network/networkWatchers/networkConfigurationDiagnostic/action | Diagnostic of network configuration. |
> | Microsoft.Network/networkWatchers/queryConnectionMonitors/action | Batch query monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/topology/action | Gets a network level view of resources and their relationships in a resource group. |
> | Microsoft.Network/networkWatchers/troubleshoot/action | Starts troubleshooting on a Networking resource in Azure. |
> | Microsoft.Network/networkWatchers/connectivityCheck/action | Verifies the possibility of establishing a direct TCP connection from a virtual machine to a given endpoint including another VM or an arbitrary remote server. |
> | Microsoft.Network/networkWatchers/azureReachabilityReport/action | Returns the relative latency score for internet service providers from a specified location to Azure regions. |
> | Microsoft.Network/networkWatchers/availableProvidersList/action | Returns all available internet service providers for a specified Azure region. |
> | Microsoft.Network/networkWatchers/connectionMonitors/start/action | Start monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/stop/action | Stop/pause monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/query/action | Query monitoring connectivity between specified endpoints |
> | Microsoft.Network/networkWatchers/connectionMonitors/read | Get Connection Monitor details |
> | Microsoft.Network/networkWatchers/connectionMonitors/write | Creates a Connection Monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/delete | Deletes a Connection Monitor |
> | Microsoft.Network/networkWatchers/connectionMonitors/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Connection Monitor |
> | Microsoft.Network/networkWatchers/flowLogs/read | Get Flow Log details |
> | Microsoft.Network/networkWatchers/flowLogs/write | Creates a Flow Log |
> | Microsoft.Network/networkWatchers/flowLogs/delete | Deletes a Flow Log |
> | Microsoft.Network/networkWatchers/lenses/start/action | Start monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/stop/action | Stop/pause monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/query/action | Query monitoring network traffic on a specified endpoint |
> | Microsoft.Network/networkWatchers/lenses/read | Get Lens details |
> | Microsoft.Network/networkWatchers/lenses/write | Creates a Lens |
> | Microsoft.Network/networkWatchers/lenses/delete | Deletes a Lens |
> | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action | Gets information about properties and status of a packet capture resource. |
> | Microsoft.Network/networkWatchers/packetCaptures/stop/action | Stop the running packet capture session. |
> | Microsoft.Network/networkWatchers/packetCaptures/read | Get the packet capture definition |
> | Microsoft.Network/networkWatchers/packetCaptures/write | Creates a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/delete | Deletes a packet capture |
> | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/read | Read Packet Capture Status |
> | Microsoft.Network/networkWatchers/pingMeshes/start/action | Start PingMesh between specified VMs |
> | Microsoft.Network/networkWatchers/pingMeshes/stop/action | Stop PingMesh between specified VMs |
> | Microsoft.Network/networkWatchers/pingMeshes/read | Get PingMesh details |
> | Microsoft.Network/networkWatchers/pingMeshes/write | Creates a PingMesh |
> | Microsoft.Network/networkWatchers/pingMeshes/delete | Deletes a PingMesh |
> | Microsoft.Network/networkWatchers/topology/read | Gets a network level view of resources and their relationships in a resource group. |
> | Microsoft.Network/operations/read | Get Available Operations |
> | Microsoft.Network/p2sVpnGateways/read | Gets a P2SVpnGateway. |
> | Microsoft.Network/p2sVpnGateways/write | Puts a P2SVpnGateway. |
> | Microsoft.Network/p2sVpnGateways/delete | Deletes a P2SVpnGateway. |
> | microsoft.network/p2sVpnGateways/reset/action | Resets a P2SVpnGateway |
> | microsoft.network/p2sVpnGateways/detach/action | Detaches a P2SVpnGateway Hub from WAN Traffic manager |
> | microsoft.network/p2sVpnGateways/attach/action | Attaches a P2SVpnGateway Hub from WAN Traffic manager |
> | Microsoft.Network/p2sVpnGateways/generatevpnprofile/action | Generate Vpn Profile for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealth/action | Gets a P2S Vpn Connection health for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealthdetailed/action | Gets a P2S Vpn Connection health detailed for P2SVpnGateway |
> | Microsoft.Network/p2sVpnGateways/disconnectp2svpnconnections/action | Disconnect p2s vpn connections |
> | Microsoft.Network/p2sVpnGateways/providers/Microsoft.Insights/diagnosticSettings/read | Gets the P2S Vpn Gateway Diagnostic Settings |
> | Microsoft.Network/p2sVpnGateways/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the P2S Vpn Gateway diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.Network/p2sVpnGateways/providers/Microsoft.Insights/logDefinitions/read | Gets the events for P2S Vpn Gateway |
> | Microsoft.Network/p2sVpnGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for P2S Vpn Gateway |
> | Microsoft.Network/privateDnsOperationResults/read | Gets results of a Private DNS operation |
> | Microsoft.Network/privateDnsOperationStatuses/read | Gets status of a Private DNS operation |
> | Microsoft.Network/privateDnsZones/read | Get the Private DNS zone properties, in JSON format. Note that this command does not retrieve the virtual networks to which the Private DNS zone is linked or the record sets contained within the zone. |
> | Microsoft.Network/privateDnsZones/write | Create or update a Private DNS zone within a resource group. Note that this command cannot be used to create or update virtual network links or record sets within the zone. |
> | Microsoft.Network/privateDnsZones/delete | Delete a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/join/action | Joins a Private DNS Zone |
> | Microsoft.Network/privateDnsZones/A/read | Get the record set of type 'A' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/A/write | Create or update a record set of type 'A' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/A/delete | Remove the record set of a given name and type 'A' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/AAAA/read | Get the record set of type 'AAAA' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/AAAA/write | Create or update a record set of type 'AAAA' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/AAAA/delete | Remove the record set of a given name and type 'AAAA' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/ALL/read | Gets Private DNS record sets across types |
> | Microsoft.Network/privateDnsZones/CNAME/read | Get the record set of type 'CNAME' within a Private DNS zone, in JSON format. |
> | Microsoft.Network/privateDnsZones/CNAME/write | Create or update a record set of type 'CNAME' within a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/CNAME/delete | Remove the record set of a given name and type 'CNAME' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/MX/read | Get the record set of type 'MX' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/MX/write | Create or update a record set of type 'MX' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/MX/delete | Remove the record set of a given name and type 'MX' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Private DNS zone diagnostic settings |
> | Microsoft.Network/privateDnsZones/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Private DNS zone diagnostic settings |
> | Microsoft.Network/privateDnsZones/providers/Microsoft.Insights/metricDefinitions/read | Gets the Private DNS zone metric settings |
> | Microsoft.Network/privateDnsZones/PTR/read | Get the record set of type 'PTR' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/PTR/write | Create or update a record set of type 'PTR' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/PTR/delete | Remove the record set of a given name and type 'PTR' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/recordsets/read | Gets Private DNS record sets across types |
> | Microsoft.Network/privateDnsZones/SOA/read | Get the record set of type 'SOA' within a Private DNS zone, in JSON format. |
> | Microsoft.Network/privateDnsZones/SOA/write | Update a record set of type 'SOA' within a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/SRV/read | Get the record set of type 'SRV' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/SRV/write | Create or update a record set of type 'SRV' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/SRV/delete | Remove the record set of a given name and type 'SRV' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/TXT/read | Get the record set of type 'TXT' within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Microsoft.Network/privateDnsZones/TXT/write | Create or update a record set of type 'TXT' within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Microsoft.Network/privateDnsZones/TXT/delete | Remove the record set of a given name and type 'TXT' from a Private DNS zone. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Get the Private DNS zone link to virtual network properties, in JSON format. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Create or update a Private DNS zone link to virtual network. |
> | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Delete a Private DNS zone link to virtual network. |
> | Microsoft.Network/privateEndpointRedirectMaps/read | Gets a Private Endpoint RedirectMap |
> | Microsoft.Network/privateEndpointRedirectMaps/write | Creates Private Endpoint RedirectMap Or Updates An Existing Private Endpoint RedirectMap |
> | Microsoft.Network/privateEndpoints/pushPropertiesToResource/action | Operation to push private endpoint property updates from NRP client |
> | Microsoft.Network/privateEndpoints/read | Gets an private endpoint resource. |
> | Microsoft.Network/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | Microsoft.Network/privateEndpoints/delete | Deletes an private endpoint resource. |
> | Microsoft.Network/privateEndpoints/privateDnsZoneGroups/read | Gets a Private DNS Zone Group |
> | Microsoft.Network/privateEndpoints/privateDnsZoneGroups/write | Puts a Private DNS Zone Group |
> | Microsoft.Network/privateEndpoints/privateLinkServiceProxies/read | Gets a private link service proxy resource. |
> | Microsoft.Network/privateEndpoints/privateLinkServiceProxies/write | Creates a new private link service proxy, or updates an existing private link service proxy. |
> | Microsoft.Network/privateEndpoints/privateLinkServiceProxies/delete | Deletes an private link service proxy resource. |
> | Microsoft.Network/privateEndpoints/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Private Endpoint |
> | Microsoft.Network/privateLinkServices/read | Gets an private link service resource. |
> | Microsoft.Network/privateLinkServices/write | Creates a new private link service, or updates an existing private link service. |
> | Microsoft.Network/privateLinkServices/delete | Deletes an private link service resource. |
> | Microsoft.Network/privateLinkServices/notifyPrivateEndpointMove/action | Notifies a connected Private Link Service of Private Endpoint move |
> | Microsoft.Network/privateLinkServices/PrivateEndpointConnectionsApproval/action | Approve or reject PrivateEndpoint connection on PrivateLinkService |
> | Microsoft.Network/privateLinkServices/privateEndpointConnectionProxies/read | Gets an private endpoint connection proxy resource. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnectionProxies/write | Creates a new private endpoint connection proxy, or updates an existing private endpoint connection proxy. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnectionProxies/delete | Deletes an private endpoint connection proxy resource. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/read | Gets an private endpoint connection definition. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/write | Creates a new private endpoint connection, or updates an existing private endpoint connection. |
> | Microsoft.Network/privateLinkServices/privateEndpointConnections/delete | Deletes an private endpoint connection. |
> | Microsoft.Network/privateLinkServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Private Link Service |
> | Microsoft.Network/publicIPAddresses/read | Gets a public IP address definition. |
> | Microsoft.Network/publicIPAddresses/write | Creates a public IP address or updates an existing public IP address.  |
> | Microsoft.Network/publicIPAddresses/delete | Deletes a public IP address. |
> | Microsoft.Network/publicIPAddresses/join/action | Joins a public IP address. Not Alertable. |
> | Microsoft.Network/publicIPAddresses/ddosProtectionStatus/action | Gets the effective Ddos protection status for a Public IP address resource. |
> | Microsoft.Network/publicIPAddresses/dnsAliases/read | Gets a Public IP address Dns Alias resource |
> | Microsoft.Network/publicIPAddresses/dnsAliases/write | Creates a Public IP address Dns Alias resource |
> | Microsoft.Network/publicIPAddresses/dnsAliases/delete | Deletes a Public IP address Dns Alias resource |
> | Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings of Public IP address |
> | Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings of Public IP address |
> | Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/logDefinitions/read | Get the log definitions of Public IP address |
> | Microsoft.Network/publicIPAddresses/providers/Microsoft.Insights/metricDefinitions/read | Get the metrics definitions of Public IP address |
> | Microsoft.Network/publicIPPrefixes/read | Gets a Public Ip Prefix Definition |
> | Microsoft.Network/publicIPPrefixes/write | Creates A Public Ip Prefix Or Updates An Existing Public Ip Prefix |
> | Microsoft.Network/publicIPPrefixes/delete | Deletes A Public Ip Prefix |
> | Microsoft.Network/publicIPPrefixes/join/action | Joins a PublicIPPrefix. Not alertable. |
> | Microsoft.Network/routeFilters/read | Gets a route filter definition |
> | Microsoft.Network/routeFilters/join/action | Joins a route filter. Not Alertable. |
> | Microsoft.Network/routeFilters/delete | Deletes a route filter definition |
> | Microsoft.Network/routeFilters/write | Creates a route filter or Updates an existing route filter |
> | Microsoft.Network/routeFilters/routeFilterRules/read | Gets a route filter rule definition |
> | Microsoft.Network/routeFilters/routeFilterRules/write | Creates a route filter rule or Updates an existing route filter rule |
> | Microsoft.Network/routeFilters/routeFilterRules/delete | Deletes a route filter rule definition |
> | Microsoft.Network/routeTables/read | Gets a route table definition |
> | Microsoft.Network/routeTables/write | Creates a route table or Updates an existing route table |
> | Microsoft.Network/routeTables/delete | Deletes a route table definition |
> | Microsoft.Network/routeTables/join/action | Joins a route table. Not Alertable. |
> | Microsoft.Network/routeTables/routes/read | Gets a route definition |
> | Microsoft.Network/routeTables/routes/write | Creates a route or Updates an existing route |
> | Microsoft.Network/routeTables/routes/delete | Deletes a route definition |
> | Microsoft.Network/securityPartnerProviders/read | Gets a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/write | Creates a SecurityPartnerProvider or Updates An Existing SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/validate/action | Validates a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/updateReferences/action | Update references in a SecurityPartnerProvider |
> | Microsoft.Network/securityPartnerProviders/join/action | Joins a SecurityPartnerProvider. Not alertable. |
> | Microsoft.Network/securityPartnerProviders/delete | Deletes a SecurityPartnerProvider |
> | Microsoft.Network/serviceEndpointPolicies/read | Gets a Service Endpoint Policy Description |
> | Microsoft.Network/serviceEndpointPolicies/write | Creates a Service Endpoint Policy or updates an existing Service Endpoint Policy |
> | Microsoft.Network/serviceEndpointPolicies/delete | Deletes a Service Endpoint Policy |
> | Microsoft.Network/serviceEndpointPolicies/join/action | Joins a Service Endpoint Policy. Not alertable. |
> | Microsoft.Network/serviceEndpointPolicies/joinSubnet/action | Joins a Subnet To Service Endpoint Policies. Not alertable. |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/read | Gets a Service Endpoint Policy Definition Description |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/write | Creates a Service Endpoint Policy Definition or updates an existing Service Endpoint Policy Definition |
> | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/delete | Deletes a Service Endpoint Policy Definition |
> | Microsoft.Network/trafficManagerGeographicHierarchies/read | Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method |
> | Microsoft.Network/trafficManagerProfiles/read | Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile. |
> | Microsoft.Network/trafficManagerProfiles/write | Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile.<br>This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings.<br>Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled. |
> | Microsoft.Network/trafficManagerProfiles/delete | Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/read | Gets an Azure Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Azure Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/write | Add a new Azure Endpoint in an existing Traffic Manager Profile or update the properties of an existing Azure Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/azureEndpoints/delete | Deletes an Azure Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Azure Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/read | Gets an External Endpoint which belongs to a Traffic Manager Profile, including all the properties of that External Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/write | Add a new External Endpoint in an existing Traffic Manager Profile or update the properties of an existing External Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/externalEndpoints/delete | Deletes an External Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted External Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/heatMaps/read | Gets the Traffic Manager Heat Map for the given Traffic Manager profile which contains query counts and latency data by location and source IP. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/read | Gets an Nested Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Nested Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/write | Add a new Nested Endpoint in an existing Traffic Manager Profile or update the properties of an existing Nested Endpoint in that Traffic Manager Profile. |
> | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/delete | Deletes an Nested Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Nested Endpoint. |
> | Microsoft.Network/trafficManagerProfiles/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Traffic Manager Diagnostic Settings |
> | Microsoft.Network/trafficManagerProfiles/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Traffic Manager diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.Network/trafficManagerProfiles/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Traffic Manager |
> | Microsoft.Network/trafficManagerProfiles/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Traffic Manager. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/read | Gets the subscription-level key used for Realtime User Metrics collection. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/write | Creates a new subscription-level key to be used for Realtime User Metrics collection. |
> | Microsoft.Network/trafficManagerUserMetricsKeys/delete | Deletes the subscription-level key used for Realtime User Metrics collection. |
> | Microsoft.Network/virtualHubs/delete | Deletes a Virtual Hub |
> | Microsoft.Network/virtualHubs/read | Get a Virtual Hub |
> | Microsoft.Network/virtualHubs/write | Create or update a Virtual Hub |
> | Microsoft.Network/virtualHubs/effectiveRoutes/action | Gets effective route configured on Virtual Hub |
> | Microsoft.Network/virtualHubs/migrateRouteService/action | Validate or execute the hub router migration |
> | Microsoft.Network/virtualHubs/inboundRoutes/action | Gets routes learnt from a virtual wan connection |
> | Microsoft.Network/virtualHubs/outboundRoutes/action | Get Routes advertised by a virtual wan connection |
> | Microsoft.Network/virtualHubs/bgpConnections/read | Gets a Hub Bgp Connection child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/bgpConnections/write | Creates or Updates a Hub Bgp Connection child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/bgpConnections/delete | Deletes a Hub Bgp Connection child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/bgpConnections/advertisedRoutes/action | Gets virtualrouter advertised routes |
> | Microsoft.Network/virtualHubs/bgpConnections/learnedRoutes/action | Gets virtualrouter learned routes |
> | Microsoft.Network/virtualHubs/hubRouteTables/read | Gets a Route Table child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/hubRouteTables/write | Creates or Updates a Route Table child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/hubRouteTables/delete | Deletes a Route Table child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read | Get a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/write | Create or update a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/delete | Deletes a HubVirtualNetworkConnection |
> | Microsoft.Network/virtualHubs/ipConfigurations/read | Gets a Hub IpConfiguration child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/ipConfigurations/write | Creates or Updates a Hub IpConfiguration child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/ipConfigurations/delete | Deletes a Hub IpConfiguration child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routeMaps/read | Gets a Route Map child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routeMaps/write | Creates or Updates a Route Map child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routeMaps/delete | Deletes a Route Map child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routeTables/read | Get a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualHubs/routeTables/write | Create or Update a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualHubs/routeTables/delete | Delete a VirtualHubRouteTableV2 |
> | Microsoft.Network/virtualHubs/routingIntent/read | Gets a Routing Intent child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routingIntent/write | Creates or Updates a Routing Intent child resource of Virtual Hub |
> | Microsoft.Network/virtualHubs/routingIntent/delete | Deletes a Routing Intent child resource of Virtual Hub |
> | Microsoft.Network/virtualnetworkgateways/supportedvpndevices/action | Lists Supported Vpn Devices |
> | Microsoft.Network/virtualNetworkGateways/read | Gets a VirtualNetworkGateway |
> | Microsoft.Network/virtualNetworkGateways/write | Creates or updates a VirtualNetworkGateway |
> | Microsoft.Network/virtualNetworkGateways/delete | Deletes a virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/generatevpnclientpackage/action | Generate VpnClient package for virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/generatevpnprofile/action | Generate VpnProfile package for VirtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/getvpnclientconnectionhealth/action | Get Per Vpn Client Connection Health for VirtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/disconnectvirtualnetworkgatewayvpnconnections/action | Disconnect virtual network gateway vpn connections |
> | microsoft.network/virtualnetworkgateways/getvpnprofilepackageurl/action | Gets the URL of a pre-generated vpn client profile package |
> | microsoft.network/virtualnetworkgateways/setvpnclientipsecparameters/action | Set Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/getvpnclientipsecparameters/action | Get Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/resetvpnclientsharedkey/action | Reset Vpnclient shared key for VirtualNetworkGateway P2S client. |
> | microsoft.network/virtualnetworkgateways/reset/action | Resets a virtualNetworkGateway |
> | microsoft.network/virtualnetworkgateways/getadvertisedroutes/action | Gets virtualNetworkGateway advertised routes |
> | microsoft.network/virtualnetworkgateways/getbgppeerstatus/action | Gets virtualNetworkGateway bgp peer status |
> | microsoft.network/virtualnetworkgateways/getlearnedroutes/action | Gets virtualnetworkgateway learned routes |
> | microsoft.network/virtualnetworkgateways/startpacketcapture/action | Starts a Virtual Network Gateway Packet Capture. |
> | microsoft.network/virtualnetworkgateways/stoppacketcapture/action | Stops a Virtual Network Gateway Packet Capture. |
> | microsoft.network/virtualnetworkgateways/connections/read | Get VirtualNetworkGatewayConnection |
> | microsoft.network/virtualNetworkGateways/natRules/read | Gets a NAT rule resource |
> | microsoft.network/virtualNetworkGateways/natRules/write | Puts a NAT rule resource |
> | microsoft.network/virtualNetworkGateways/natRules/delete | Deletes a NAT rule resource |
> | Microsoft.Network/virtualNetworkGateways/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Virtual Network Gateway Diagnostic Settings |
> | Microsoft.Network/virtualNetworkGateways/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Virtual Network Gateway diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.Network/virtualNetworkGateways/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Virtual Network Gateway |
> | Microsoft.Network/virtualNetworkGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Virtual Network Gateway |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/virtualNetworks/write | Creates a virtual network or updates an existing virtual network |
> | Microsoft.Network/virtualNetworks/delete | Deletes a virtual network |
> | Microsoft.Network/virtualNetworks/joinLoadBalancer/action | Joins a load balancer to virtual networks |
> | Microsoft.Network/virtualNetworks/peer/action | Peers a virtual network with another virtual network |
> | Microsoft.Network/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/virtualNetworks/BastionHosts/action | Gets Bastion Host references in a Virtual Network. |
> | Microsoft.Network/virtualNetworks/ddosProtectionStatus/action | Gets the effective Ddos protection status for a Virtual Network resource. |
> | Microsoft.Network/virtualNetworks/listNetworkManagerEffectiveConnectivityConfigurations/action | List Network Manager Effective Connectivity Configurations |
> | Microsoft.Network/virtualNetworks/listNetworkManagerEffectiveSecurityAdminRules/action | List Network Manager Effective Security Admin Rules |
> | Microsoft.Network/virtualNetworks/listDnsResolvers/action | Gets the DNS Resolver for Virtual Network, in JSON format |
> | Microsoft.Network/virtualNetworks/listDnsForwardingRulesets/action | Gets the DNS Forwarding Ruleset for Virtual Network, in JSON format |
> | Microsoft.Network/virtualNetworks/bastionHosts/default/action | Gets Bastion Host references in a Virtual Network. |
> | Microsoft.Network/virtualNetworks/checkIpAddressAvailability/read | Check if IP address is available at the specified virtual network |
> | Microsoft.Network/virtualNetworks/customViews/read | Get definition of a custom view of Virtual Network |
> | Microsoft.Network/virtualNetworks/customViews/get/action | Get a Virtual Network custom view content |
> | Microsoft.Network/virtualNetworks/privateDnsZoneLinks/read | Get the Private DNS zone link to a virtual network properties, in JSON format. |
> | Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings of Virtual Network |
> | Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings of the Virtual Network |
> | Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/logDefinitions/read | Get the log definitions of Virtual Network |
> | Microsoft.Network/virtualNetworks/providers/Microsoft.Insights/metricDefinitions/read | Gets available metrics for the PingMesh |
> | Microsoft.Network/virtualNetworks/remoteVirtualNetworkPeeringProxies/read | Gets a virtual network peering proxy definition |
> | Microsoft.Network/virtualNetworks/remoteVirtualNetworkPeeringProxies/write | Creates a virtual network peering proxy or updates an existing virtual network peering proxy |
> | Microsoft.Network/virtualNetworks/remoteVirtualNetworkPeeringProxies/delete | Deletes a virtual network peering proxy |
> | Microsoft.Network/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | Microsoft.Network/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | Microsoft.Network/virtualNetworks/subnets/delete | Deletes a virtual network subnet |
> | Microsoft.Network/virtualNetworks/subnets/joinLoadBalancer/action | Joins a load balancer to virtual network subnets |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action | Prepares a subnet by applying necessary Network Policies |
> | Microsoft.Network/virtualNetworks/subnets/unprepareNetworkPolicies/action | Unprepare a subnet by removing the applied Network Policies |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/read | Gets Contextual Service Endpoint Policies |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/write | Creates a Contextual Service Endpoint Policy or updates an existing Contextual Service Endpoint Policy |
> | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/delete | Deletes A Contextual Service Endpoint Policy |
> | Microsoft.Network/virtualNetworks/subnets/resourceNavigationLinks/read | Get the Resource Navigation Link definition |
> | Microsoft.Network/virtualNetworks/subnets/resourceNavigationLinks/write | Creates a Resource Navigation Link or updates an existing Resource Navigation Link |
> | Microsoft.Network/virtualNetworks/subnets/resourceNavigationLinks/delete | Deletes a Resource Navigation Link |
> | Microsoft.Network/virtualNetworks/subnets/serviceAssociationLinks/read | Gets a Service Association Link definition |
> | Microsoft.Network/virtualNetworks/subnets/serviceAssociationLinks/write | Creates a Service Association Link or updates an existing Service Association Link |
> | Microsoft.Network/virtualNetworks/subnets/serviceAssociationLinks/delete | Deletes a Service Association Link |
> | Microsoft.Network/virtualNetworks/subnets/serviceAssociationLinks/validate/action | Validates a Service Association Link |
> | Microsoft.Network/virtualNetworks/subnets/serviceAssociationLinks/details/read | Gets a Service Association Link Detail Definition |
> | Microsoft.Network/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | Microsoft.Network/virtualNetworks/taggedTrafficConsumers/read | Get the Tagged Traffic Consumer definition |
> | Microsoft.Network/virtualNetworks/taggedTrafficConsumers/write | Creates a Tagged Traffic Consumer or updates an existing Tagged Traffic Consumer |
> | Microsoft.Network/virtualNetworks/taggedTrafficConsumers/delete | Deletes a Tagged Traffic Consumer |
> | Microsoft.Network/virtualNetworks/taggedTrafficConsumers/validate/action | Validates a Tagged Traffic Consumer |
> | Microsoft.Network/virtualNetworks/usages/read | Get the IP usages for each subnet of the virtual network |
> | Microsoft.Network/virtualNetworks/virtualMachines/read | Gets references to all the virtual machines in a virtual network |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read | Gets a virtual network peering definition |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write | Creates a virtual network peering or updates an existing virtual network peering |
> | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete | Deletes a virtual network peering |
> | Microsoft.Network/virtualNetworkTaps/read | Get Virtual Network Tap |
> | Microsoft.Network/virtualNetworkTaps/join/action | Joins a virtual network tap. Not Alertable. |
> | Microsoft.Network/virtualNetworkTaps/delete | Delete Virtual Network Tap |
> | Microsoft.Network/virtualNetworkTaps/write | Create or Update Virtual Network Tap |
> | Microsoft.Network/virtualNetworkTaps/networkInterfaceTapConfigurationProxies/read | Gets a Network Interface Tap Configuration Proxy. |
> | Microsoft.Network/virtualNetworkTaps/networkInterfaceTapConfigurationProxies/write | Creates a Network Interface Tap Configuration Proxy Or updates an existing Network Interface Tap Configuration Proxy. |
> | Microsoft.Network/virtualNetworkTaps/networkInterfaceTapConfigurationProxies/delete | Deletes a Network Interface Tap Configuration Proxy. |
> | Microsoft.Network/virtualRouters/read | Gets A VirtualRouter |
> | Microsoft.Network/virtualRouters/write | Creates A VirtualRouter or Updates An Existing VirtualRouter |
> | Microsoft.Network/virtualRouters/delete | Deletes A VirtualRouter |
> | Microsoft.Network/virtualRouters/join/action | Joins A VirtualRouter. Not alertable. |
> | Microsoft.Network/virtualRouters/peerings/read | Gets A VirtualRouterPeering |
> | Microsoft.Network/virtualRouters/peerings/write | Creates A VirtualRouterPeering or Updates An Existing VirtualRouterPeering |
> | Microsoft.Network/virtualRouters/peerings/delete | Deletes A VirtualRouterPeering |
> | Microsoft.Network/virtualRouters/providers/Microsoft.Insights/metricDefinitions/read | Gets The Metric Definitions For VirtualRouter |
> | Microsoft.Network/virtualWans/delete | Deletes a Virtual Wan |
> | Microsoft.Network/virtualWans/read | Get a Virtual Wan |
> | Microsoft.Network/virtualWans/write | Create or update a Virtual Wan |
> | Microsoft.Network/virtualWans/join/action | Joins a Virtual WAN. Not alertable. |
> | Microsoft.Network/virtualwans/vpnconfiguration/action | Gets a Vpn Configuration |
> | Microsoft.Network/virtualwans/vpnServerConfigurations/action | Get VirtualWanVpnServerConfigurations |
> | Microsoft.Network/virtualwans/generateVpnProfile/action | Generate VirtualWanVpnServerConfiguration VpnProfile |
> | Microsoft.Network/virtualWans/updateVpnReferences/action | Update VPN reference in VirtualWan |
> | Microsoft.Network/virtualWans/updateVhubReferences/action | Update VirtualHub reference in VirtualWan |
> | Microsoft.Network/virtualWans/p2sVpnServerConfigurations/read | Gets a virtual Wan P2SVpnServerConfiguration |
> | Microsoft.network/virtualWans/p2sVpnServerConfigurations/write | Creates a virtual Wan P2SVpnServerConfiguration or updates an existing virtual Wan P2SVpnServerConfiguration |
> | Microsoft.network/virtualWans/p2sVpnServerConfigurations/delete | Deletes a virtual Wan P2SVpnServerConfiguration |
> | Microsoft.Network/virtualwans/supportedSecurityProviders/read | Gets supported VirtualWan Security Providers. |
> | Microsoft.Network/virtualWans/virtualHubProxies/read | Gets a Virtual Hub proxy definition |
> | Microsoft.Network/virtualWans/virtualHubProxies/write | Creates a Virtual Hub proxy or updates a Virtual Hub proxy |
> | Microsoft.Network/virtualWans/virtualHubProxies/delete | Deletes a Virtual Hub proxy |
> | Microsoft.Network/virtualWans/virtualHubs/read | Gets all Virtual Hubs that reference a Virtual Wan. |
> | Microsoft.Network/virtualWans/vpnSiteProxies/read | Gets a Vpn Site proxy definition |
> | Microsoft.Network/virtualWans/vpnSiteProxies/write | Creates a Vpn Site proxy or updates a Vpn Site proxy |
> | Microsoft.Network/virtualWans/vpnSiteProxies/delete | Deletes a Vpn Site proxy |
> | Microsoft.Network/virtualWans/vpnSites/read | Gets all VPN Sites that reference a Virtual Wan. |
> | Microsoft.Network/vpnGateways/read | Gets a VpnGateway. |
> | Microsoft.Network/vpnGateways/write | Puts a VpnGateway. |
> | Microsoft.Network/vpnGateways/delete | Deletes a VpnGateway. |
> | microsoft.network/vpngateways/reset/action | Resets a VpnGateway |
> | microsoft.network/vpngateways/getbgppeerstatus/action | Gets bgp peer status of a VpnGateway |
> | microsoft.network/vpngateways/getlearnedroutes/action | Gets learned routes of a VpnGateway |
> | microsoft.network/vpngateways/getadvertisedroutes/action | Gets advertised routes of a VpnGateway |
> | microsoft.network/vpngateways/startpacketcapture/action | Start Vpn gateway Packet Capture with according resource |
> | microsoft.network/vpngateways/stoppacketcapture/action | Stop Vpn gateway Packet Capture with sasURL |
> | microsoft.network/vpngateways/listvpnconnectionshealth/action | Gets connection health for all or a subset of connections on a VpnGateway |
> | microsoft.network/vpnGateways/natRules/read | Gets a NAT rule resource |
> | microsoft.network/vpnGateways/natRules/write | Puts a NAT rule resource |
> | microsoft.network/vpnGateways/natRules/delete | Deletes a NAT rule resource |
> | Microsoft.Network/vpnGateways/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Vpn Gateway Diagnostic Settings |
> | Microsoft.Network/vpnGateways/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Vpn Gateway diagnostic settings, this operation is supplemented by insights resource provider. |
> | Microsoft.Network/vpnGateways/providers/Microsoft.Insights/logDefinitions/read | Gets the events for Vpn Gateway |
> | Microsoft.Network/vpnGateways/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Vpn Gateway |
> | microsoft.network/vpnGateways/vpnConnections/read | Gets a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/write | Puts a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/delete | Deletes a VpnConnection. |
> | microsoft.network/vpnGateways/vpnConnections/startpacketcapture/action | Start packet capture for selected linked in vpn connection |
> | microsoft.network/vpnGateways/vpnConnections/stoppacketcapture/action | Stop packet capture for selected linked in vpn connection |
> | microsoft.network/vpnGateways/vpnConnections/vpnLinkConnections/getikesas/action | Lists Vpn Link Connection IKE Security Associations |
> | microsoft.network/vpnGateways/vpnConnections/vpnLinkConnections/resetconnection/action | Resets connection for vWAN |
> | microsoft.network/vpnGateways/vpnConnections/vpnLinkConnections/read | Gets a Vpn Link Connection |
> | Microsoft.Network/vpnServerConfigurations/read | Get VpnServerConfiguration |
> | Microsoft.Network/vpnServerConfigurations/write | Create or Update VpnServerConfiguration |
> | Microsoft.Network/vpnServerConfigurations/delete | Delete VpnServerConfiguration |
> | microsoft.network/vpnServerConfigurations/configurationPolicyGroups/read | Gets a Configuration Policy Group  |
> | microsoft.network/vpnServerConfigurations/configurationPolicyGroups/write | Puts a Configuration Policy Group |
> | microsoft.network/vpnServerConfigurations/configurationPolicyGroups/delete | Deletes a Configuration Policy Group |
> | Microsoft.Network/vpnServerConfigurations/configurationPolicyGroups/p2sConnectionConfigurationProxies/read | Gets A P2S Connection Configuration Proxy Definition |
> | Microsoft.Network/vpnServerConfigurations/configurationPolicyGroups/p2sConnectionConfigurationProxies/write | Creates A P2S Connection Configuration Proxy Or Updates An Existing P2S Connection Configuration Proxy |
> | Microsoft.Network/vpnServerConfigurations/configurationPolicyGroups/p2sConnectionConfigurationProxies/delete | Deletes A P2S Connection Configuration Proxy |
> | Microsoft.Network/vpnServerConfigurations/p2sVpnGatewayProxies/read | Gets a P2SVpnGateway Proxy definition |
> | Microsoft.Network/vpnServerConfigurations/p2sVpnGatewayProxies/write | Creates a P2SVpnGateway Proxy or updates a P2SVpnGateway Proxy |
> | Microsoft.Network/vpnServerConfigurations/p2sVpnGatewayProxies/delete | Deletes a P2SVpnGateway Proxy |
> | Microsoft.Network/vpnsites/read | Gets a Vpn Site resource. |
> | Microsoft.Network/vpnsites/write | Creates or updates a Vpn Site resource. |
> | Microsoft.Network/vpnsites/delete | Deletes a Vpn Site resource. |
> | microsoft.network/vpnSites/vpnSiteLinks/read | Gets a Vpn Site Link |
