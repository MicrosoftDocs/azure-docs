---
title: Identity resource provider operations include file
description: Identity resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.AAD

Azure service: [Azure Active Directory Domain Services](../../../active-directory-domain-services/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AAD/register/action | Subscription Registration Action |
> | Microsoft.AAD/unregister/action | Unregister Domain Service |
> | Microsoft.AAD/register/action | Register Domain Service |
> | Microsoft.AAD/domainServices/read | Read Domain Services |
> | Microsoft.AAD/domainServices/write | Write Domain Service |
> | Microsoft.AAD/domainServices/delete | Delete Domain Service |
> | Microsoft.AAD/domainServices/oucontainer/read | Read Ou Containers |
> | Microsoft.AAD/domainServices/oucontainer/write | Write Ou Container |
> | Microsoft.AAD/domainServices/oucontainer/delete | Delete Ou Container |
> | Microsoft.AAD/domainServices/OutboundNetworkDependenciesEndpoints/read | Get the network endpoints of all outbound dependencies |
> | Microsoft.AAD/domainServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for Domain Service |
> | Microsoft.AAD/domainServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Domain Service resource |
> | Microsoft.AAD/domainServices/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Domain Service |
> | Microsoft.AAD/domainServices/providers/Microsoft.Insights/metricDefinitions/read | Gets metrics for Domain Service |
> | Microsoft.AAD/locations/operationresults/read |  |
> | Microsoft.AAD/Operations/read |  |

### microsoft.aadiam

Azure service: Azure Active Directory

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.aadiam/azureADMetrics/read | Read Azure AD Metrics Definition |
> | microsoft.aadiam/azureADMetrics/write | Create and Update Azure AD Metrics Definition |
> | microsoft.aadiam/azureADMetrics/delete | Delete Azure AD Metrics Definition |
> | microsoft.aadiam/azureADMetrics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.aadiam/azureADMetrics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | microsoft.aadiam/azureADMetrics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for azureADMetrics |
> | microsoft.aadiam/diagnosticsettings/write | Writing a diagnostic setting |
> | microsoft.aadiam/diagnosticsettings/read | Reading a diagnostic setting |
> | microsoft.aadiam/diagnosticsettings/delete | Deleting a diagnostic setting |
> | microsoft.aadiam/diagnosticsettingscategories/read | Reading a diagnostic setting categories |
> | microsoft.aadiam/metricDefinitions/read | Reading Tenant-Level Metric Definitions |
> | microsoft.aadiam/metrics/read | Reading Tenant-Level Metrics |
> | microsoft.aadiam/privateLinkForAzureAD/read | Read Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/write | Create and Update Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/delete | Delete Private Link Policy Definition |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionsApproval/action | Approve PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/read | Read Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/delete | Delete Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnectionProxies/validate/action | Validate Private Link Proxies |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/read | Read PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/write | Create and Update PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateEndpointConnections/delete | Delete PrivateEndpointConnections |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/read | Read PrivateLinkResources |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/write | Create and Update PrivateLinkResources |
> | microsoft.aadiam/privateLinkForAzureAD/privateLinkResources/delete | Delete PrivateLinkResources |
> | microsoft.aadiam/tenants/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.aadiam/tenants/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | microsoft.aadiam/tenants/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for tenants |

### Microsoft.ADHybridHealthService

Azure service: [Azure Active Directory](../../../active-directory/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ADHybridHealthService/configuration/action | Updates Tenant Configuration. |
> | Microsoft.ADHybridHealthService/services/action | Updates a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/addsservices/action | Create a new forest for the tenant. |
> | Microsoft.ADHybridHealthService/register/action | Registers the ADHybrid Health Service Resource Provider and enables the creation of ADHybrid Health Service resource. |
> | Microsoft.ADHybridHealthService/unregister/action | Unregisters the subscription for ADHybrid Health Service Resource Provider. |
> | Microsoft.ADHybridHealthService/addsservices/write | Creates or Updates the ADDomainService instance for the tenant. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/action | Add a server instance to the service. |
> | Microsoft.ADHybridHealthService/addsservices/read | Gets Service details for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/delete | Deletes a Service and it's servers along with Health data. |
> | Microsoft.ADHybridHealthService/addsservices/addomainservicemembers/read | Gets all servers for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/alerts/read | Gets alerts details for the forest like alertid, alert raised date, alert last detected, alert description, last updated, alert level, alert state, alert troubleshooting links etc. . |
> | Microsoft.ADHybridHealthService/addsservices/configuration/read | Gets Service Configuration for the forest. Example- Forest Name, Functional Level, Domain Naming master FSMO role, Schema master FSMO role etc. |
> | Microsoft.ADHybridHealthService/addsservices/dimensions/read | Gets the domains and sites details for the forest. Example- health status, active alerts, resolved alerts, properties like Domain Functional Level, Forest, Infrastructure Master, PDC, RID master etc.  |
> | Microsoft.ADHybridHealthService/addsservices/features/userpreference/read | Gets the user preference setting for the forest.<br>Example- MetricCounterName like ldapsuccessfulbinds, ntlmauthentications, kerberosauthentications, addsinsightsagentprivatebytes, ldapsearches.<br>Settings for the UI Charts etc. |
> | Microsoft.ADHybridHealthService/addsservices/forestsummary/read | Gets forest summary for the given forest like forest name, number of domains under this forest, number of sites and sites details etc. |
> | Microsoft.ADHybridHealthService/addsservices/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Microsoft.ADHybridHealthService/addsservices/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/addsservices/premiumcheck/read | This API gets the list of all onboarded ADDomainServices for a premium tenant. |
> | Microsoft.ADHybridHealthService/addsservices/replicationdetails/read | Gets replication details for all the servers for the specified service name. |
> | Microsoft.ADHybridHealthService/addsservices/replicationstatus/read | Gets the number of domain controllers and their replication errors if any. |
> | Microsoft.ADHybridHealthService/addsservices/replicationsummary/read | Gets complete domain controller list along with replication details for the given forest. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/delete | Deletes a server for a given service and tenant. |
> | Microsoft.ADHybridHealthService/addsservices/servicemembers/credentials/read | During server registration of ADDomainService, this api is called to get the credentials for onboarding new servers. |
> | Microsoft.ADHybridHealthService/configuration/write | Creates a Tenant Configuration. |
> | Microsoft.ADHybridHealthService/configuration/read | Reads the Tenant Configuration. |
> | Microsoft.ADHybridHealthService/logs/read | Gets agent installation and registration logs for the tenant. |
> | Microsoft.ADHybridHealthService/logs/contents/read | Gets the content of agent installation and registration logs stored in blob. |
> | Microsoft.ADHybridHealthService/operations/read | Gets list of operations supported by system. |
> | Microsoft.ADHybridHealthService/reports/availabledeployments/read | Gets list of available regions, used by DevOps to support customer incidents. |
> | Microsoft.ADHybridHealthService/reports/badpassword/read | Gets the list of bad password attempts for all the users in Active Directory Federation Service. |
> | Microsoft.ADHybridHealthService/reports/badpassworduseridipfrequency/read | Gets Blob SAS URI containing status and eventual result of newly enqueued report job for frequency of Bad Username/Password attempts per UserId per IPAddress per Day for a given Tenant. |
> | Microsoft.ADHybridHealthService/reports/consentedtodevopstenants/read | Gets the list of DevOps consented tenants. Typically used for customer support. |
> | Microsoft.ADHybridHealthService/reports/isdevops/read | Gets a value indicating whether the tenant is DevOps Consented or not. |
> | Microsoft.ADHybridHealthService/reports/selectdevopstenant/read | Updates userid(objectid) for the selected dev ops tenant. |
> | Microsoft.ADHybridHealthService/reports/selecteddeployment/read | Gets selected deployment for the given tenant. |
> | Microsoft.ADHybridHealthService/reports/tenantassigneddeployment/read | Given a tenant id gets the tenant storage location. |
> | Microsoft.ADHybridHealthService/reports/updateselecteddeployment/read | Gets the geo location from which data will be accessed. |
> | Microsoft.ADHybridHealthService/services/write | Creates a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/services/read | Reads the service instances in the tenant. |
> | Microsoft.ADHybridHealthService/services/delete | Deletes a service instance in the tenant. |
> | Microsoft.ADHybridHealthService/services/servicemembers/action | Creates or updates a server instance in the service. |
> | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Microsoft.ADHybridHealthService/services/checkservicefeatureavailibility/read | Given a feature name verifies if a service has everything required to use that feature. |
> | Microsoft.ADHybridHealthService/services/exporterrors/read | Gets the export errors for a given sync service. |
> | Microsoft.ADHybridHealthService/services/exportstatus/read | Gets the export status for a given service. |
> | Microsoft.ADHybridHealthService/services/feedbacktype/feedback/read | Gets alerts feedback for a given service and server. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregates/read | Reads the bad IPs which attempted to access the service. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregateSettings/read | Reads alarm thresholds for bad IPs. |
> | Microsoft.ADHybridHealthService/services/ipAddressAggregateSettings/write | Writes alarm thresholds for bad IPs. |
> | Microsoft.ADHybridHealthService/services/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/average/read | Given a service, this API gets the average for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/metrics/groups/sum/read | Given a service, this API gets the aggregated view for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfiguration/write | Add or updates monitoring configuration for a service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfigurations/read | Gets the monitoring configurations for a given service. |
> | Microsoft.ADHybridHealthService/services/monitoringconfigurations/write | Add or updates monitoring configurations for a service. |
> | Microsoft.ADHybridHealthService/services/premiumcheck/read | This API gets the list of all onboarded services for a premium tenant. |
> | Microsoft.ADHybridHealthService/services/reports/generateBlobUri/action | Generates Risky IP report and returns a URI pointing to it. |
> | Microsoft.ADHybridHealthService/services/reports/blobUris/read | Gets all Risky IP report URIs for the last 7 days. |
> | Microsoft.ADHybridHealthService/services/reports/details/read | Gets report of top 50 users with bad password errors from last 7 days |
> | Microsoft.ADHybridHealthService/services/servicemembers/read | Reads the server instance in the service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/delete | Deletes a server instance in the service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/alerts/read | Reads the alerts for a server. |
> | Microsoft.ADHybridHealthService/services/servicemembers/credentials/read | During server registration, this api is called to get the credentials for onboarding new servers. |
> | Microsoft.ADHybridHealthService/services/servicemembers/datafreshness/read | For a given server, this API gets a list of  datatypes that are being uploaded by the servers and the latest time for each upload. |
> | Microsoft.ADHybridHealthService/services/servicemembers/exportstatus/read | Gets the Sync Export Error details for a given Sync Service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/metrics/read | Gets the list of connectors and run profile names for the given service and service member. |
> | Microsoft.ADHybridHealthService/services/servicemembers/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Microsoft.ADHybridHealthService/services/servicemembers/serviceconfiguration/read | Gets service configuration for a given tenant. |
> | Microsoft.ADHybridHealthService/services/tenantwhitelisting/read | Gets feature allowlisting status for a given tenant. |

### Microsoft.AzureActiveDirectory

Azure service: [Azure Active Directory B2C](../../../active-directory-b2c/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AzureActiveDirectory/register/action | Register subscription for Microsoft.AzureActiveDirectory resource provider |
> | Microsoft.AzureActiveDirectory/b2cDirectories/write | Create or update B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2cDirectories/read | View B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2cDirectories/delete | Delete B2C Directory resource |
> | Microsoft.AzureActiveDirectory/b2ctenants/read | Lists all B2C tenants where the user is a member |
> | Microsoft.AzureActiveDirectory/ciamDirectories/write | Create or update CIAM Directory resource |
> | Microsoft.AzureActiveDirectory/ciamDirectories/read | View CIAM Directory resource |
> | Microsoft.AzureActiveDirectory/ciamDirectories/delete | Delete CIAM Directory resource |
> | Microsoft.AzureActiveDirectory/guestUsages/write | Create or update Guest Usages resource |
> | Microsoft.AzureActiveDirectory/guestUsages/read | View Guest Usages resource |
> | Microsoft.AzureActiveDirectory/guestUsages/delete | Delete Guest Usages resource |
> | Microsoft.AzureActiveDirectory/operations/read | Read all API operations available for Microsoft.AzureActiveDirectory resource provider |

### Microsoft.ManagedIdentity

Azure service: [Managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ManagedIdentity/register/action | Registers the subscription for the managed identity resource provider |
> | Microsoft.ManagedIdentity/identities/read | Gets an existing system assigned identity |
> | Microsoft.ManagedIdentity/operations/read | Lists operations available on Microsoft.ManagedIdentity resource provider |
> | Microsoft.ManagedIdentity/userAssignedIdentities/assign/action | RBAC action for assigning an existing user assigned identity to a resource |
> | Microsoft.ManagedIdentity/userAssignedIdentities/delete | Deletes an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/listAssociatedResources/action | Lists all associated resources for an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/read | Gets an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/write | Creates a new user assigned identity or updates the tags associated with an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/read | Get or list Federated Identity Credentials |
> | Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/write | Add or update a Federated Identity Credential |
> | Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/delete | Delete a Federated Identity Credential |
