---
title: Azure Resource Manager resource provider operations | Microsoft Docs
description: Lists the operations available for the Microsoft Azure Resource Manager resource providers
services: active-directory
documentationcenter:
author: rolyon
manager: mtillman


ms.service: role-based-access-control
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/02/2019
ms.author: rolyon
ms.reviewer: bagovind

---
# Azure Resource Manager resource provider operations

This article lists the operations available for each Azure Resource Manager resource provider. These operations can be used in [custom roles](custom-roles.md) to provide granular [role-based access control (RBAC)](overview.md) to resources in Azure. Operation strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`. For a list of how resource provider namespaces map to Azure services, see [Match resource provider to service](../azure-resource-manager/azure-services-resource-providers.md).

The resource provider operations are always evolving. To get the latest operations, use [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation) or [az provider operation list](/cli/azure/provider/operation#az-provider-operation-list).

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## Microsoft.AAD

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.AAD/domainServices/delete | Delete Domain Service |
> | Action | Microsoft.AAD/domainServices/oucontainer/delete | Delete Ou Container |
> | Action | Microsoft.AAD/domainServices/oucontainer/read | Read Ou Containers |
> | Action | Microsoft.AAD/domainServices/oucontainer/write | Write Ou Container |
> | Action | Microsoft.AAD/domainServices/read | Read Domain Services |
> | Action | Microsoft.AAD/domainServices/write | Write Domain Service |
> | Action | Microsoft.AAD/locations/operationresults/read |  |
> | Action | Microsoft.AAD/Operations/read |  |
> | Action | Microsoft.AAD/register/action | Register Domain Service |
> | Action | Microsoft.AAD/unregister/action | Unregister Domain Service |

## microsoft.aadiam

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | microsoft.aadiam/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Action | microsoft.aadiam/diagnosticsettings/read | Reading a diagnostic setting |
> | Action | microsoft.aadiam/diagnosticsettings/write | Writing a diagnostic setting |
> | Action | microsoft.aadiam/diagnosticsettingscategories/read | Reading a diagnostic setting categories |
> | Action | microsoft.aadiam/metricDefinitions/read | Reading Tenant-Level Metric Definitions |
> | Action | microsoft.aadiam/metrics/read | Reading Tenant-Level Metrics |

## Microsoft.Addons

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Addons/operations/read | Gets supported RP operations. |
> | Action | Microsoft.Addons/register/action | Register the specified subscription with Microsoft.Addons |
> | Action | Microsoft.Addons/supportProviders/listsupportplaninfo/action | Lists current support plan information for the specified subscription. |
> | Action | Microsoft.Addons/supportProviders/supportPlanTypes/delete | Removes the specified Canonical support plan |
> | Action | Microsoft.Addons/supportProviders/supportPlanTypes/read | Get the specified Canonical support plan state. |
> | Action | Microsoft.Addons/supportProviders/supportPlanTypes/write | Adds the Canonical support plan type specified. |

## Microsoft.ADHybridHealthService

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ADHybridHealthService/addsservices/action | Create a new forest for the tenant. |
> | Action | Microsoft.ADHybridHealthService/addsservices/addomainservicemembers/read | Gets all servers for the specified service name. |
> | Action | Microsoft.ADHybridHealthService/addsservices/alerts/read | Gets alerts details for the forest like alertid, alert raised date, alert last detected, alert description, last updated, alert level, alert state, alert troubleshooting links etc. . |
> | Action | Microsoft.ADHybridHealthService/addsservices/configuration/read | Gets Service Configuration for the forest. Example- Forest Name, Functional Level, Domain Naming master FSMO role, Schema master FSMO role etc. |
> | Action | Microsoft.ADHybridHealthService/addsservices/delete | Deletes a Service and it's servers along with Health data. |
> | Action | Microsoft.ADHybridHealthService/addsservices/dimensions/read | Gets the domains and sites details for the forest. Example- health status, active alerts, resolved alerts, properties like Domain Functional Level, Forest, Infrastructure Master, PDC, RID master etc.  |
> | Action | Microsoft.ADHybridHealthService/addsservices/features/userpreference/read | Gets the user preference setting for the forest.<br>Example- MetricCounterName like ldapsuccessfulbinds, ntlmauthentications, kerberosauthentications, addsinsightsagentprivatebytes, ldapsearches.<br>Settings for the UI Charts etc. |
> | Action | Microsoft.ADHybridHealthService/addsservices/forestsummary/read | Gets forest summary for the given forest like forest name, number of domains under this forest, number of sites and sites details etc. |
> | Action | Microsoft.ADHybridHealthService/addsservices/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Action | Microsoft.ADHybridHealthService/addsservices/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Action | Microsoft.ADHybridHealthService/addsservices/premiumcheck/read | This API gets the list of all onboarded ADDomainServices for a premium tenant. |
> | Action | Microsoft.ADHybridHealthService/addsservices/read | Gets Service details for the specified service name. |
> | Action | Microsoft.ADHybridHealthService/addsservices/replicationdetails/read | Gets replication details for all the servers for the specified service name. |
> | Action | Microsoft.ADHybridHealthService/addsservices/replicationstatus/read | Gets the number of domain controllers and their replication errors if any. |
> | Action | Microsoft.ADHybridHealthService/addsservices/replicationsummary/read | Gets complete domain controller list along with replication details for the given forest. |
> | Action | Microsoft.ADHybridHealthService/addsservices/servicemembers/action | Add a server instance to the service. |
> | Action | Microsoft.ADHybridHealthService/addsservices/servicemembers/credentials/read | During server registration of ADDomainService, this api is called to get the credentials for onboarding new servers. |
> | Action | Microsoft.ADHybridHealthService/addsservices/servicemembers/delete | Deletes a server for a given service and tenant. |
> | Action | Microsoft.ADHybridHealthService/addsservices/write | Creates or Updates the ADDomainService instance for the tenant. |
> | Action | Microsoft.ADHybridHealthService/configuration/action | Updates Tenant Configuration. |
> | Action | Microsoft.ADHybridHealthService/configuration/read | Reads the Tenant Configuration. |
> | Action | Microsoft.ADHybridHealthService/configuration/write | Creates a Tenant Configuration. |
> | Action | Microsoft.ADHybridHealthService/logs/contents/read | Gets the content of agent installation and registration logs stored in blob. |
> | Action | Microsoft.ADHybridHealthService/logs/read | Gets agent installation and registration logs for the tenant. |
> | Action | Microsoft.ADHybridHealthService/operations/read | Gets list of operations supported by system. |
> | Action | Microsoft.ADHybridHealthService/register/action | Registers the ADHybrid Health Service Resource Provider and enables the creation of ADHybrid Health Service resource. |
> | Action | Microsoft.ADHybridHealthService/reports/availabledeployments/read | Gets list of available regions, used by DevOps to support customer incidents. |
> | Action | Microsoft.ADHybridHealthService/reports/badpassword/read | Gets the list of bad password attempts for all the users in Active Directory Federation Service. |
> | Action | Microsoft.ADHybridHealthService/reports/badpassworduseridipfrequency/read | Gets Blob SAS URI containing status and eventual result of newly enqueued report job for frequency of Bad Username/Password attempts per UserId per IPAddress per Day for a given Tenant. |
> | Action | Microsoft.ADHybridHealthService/reports/consentedtodevopstenants/read | Gets the list of DevOps consented tenants. Typically used for customer support. |
> | Action | Microsoft.ADHybridHealthService/reports/isdevops/read | Gets a value indicating whether the tenant is DevOps Consented or not. |
> | Action | Microsoft.ADHybridHealthService/reports/selectdevopstenant/read | Updates userid(objectid) for the selected dev ops tenant. |
> | Action | Microsoft.ADHybridHealthService/reports/selecteddeployment/read | Gets selected deployment for the given tenant. |
> | Action | Microsoft.ADHybridHealthService/reports/tenantassigneddeployment/read | Given a tenant id gets the tenant storage location. |
> | Action | Microsoft.ADHybridHealthService/reports/updateselecteddeployment/read | Gets the geo location from which data will be accessed. |
> | Action | Microsoft.ADHybridHealthService/services/action | Updates a service instance in the tenant. |
> | Action | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Action | Microsoft.ADHybridHealthService/services/alerts/read | Reads the alerts for a service. |
> | Action | Microsoft.ADHybridHealthService/services/checkservicefeatureavailibility/read | Given a feature name verifies if a service has everything required to use that feature. |
> | Action | Microsoft.ADHybridHealthService/services/delete | Deletes a service instance in the tenant. |
> | Action | Microsoft.ADHybridHealthService/services/exporterrors/read | Gets the export errors for a given sync service. |
> | Action | Microsoft.ADHybridHealthService/services/exportstatus/read | Gets the export status for a given service. |
> | Action | Microsoft.ADHybridHealthService/services/feedbacktype/feedback/read | Gets alerts feedback for a given service and server. |
> | Action | Microsoft.ADHybridHealthService/services/metricmetadata/read | Gets the list of supported metrics for a given service.<br>For example Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFS service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomainService.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for ADSync service. |
> | Action | Microsoft.ADHybridHealthService/services/metrics/groups/average/read | Given a service, this API gets the average for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Action | Microsoft.ADHybridHealthService/services/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Action | Microsoft.ADHybridHealthService/services/metrics/groups/sum/read | Given a service, this API gets the aggregated view for metrics for a given service.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Action | Microsoft.ADHybridHealthService/services/monitoringconfiguration/write | Add or updates monitoring configuration for a service. |
> | Action | Microsoft.ADHybridHealthService/services/monitoringconfigurations/read | Gets the monitoring configurations for a given service. |
> | Action | Microsoft.ADHybridHealthService/services/monitoringconfigurations/write | Add or updates monitoring configurations for a service. |
> | Action | Microsoft.ADHybridHealthService/services/premiumcheck/read | This API gets the list of all onboarded services for a premium tenant. |
> | Action | Microsoft.ADHybridHealthService/services/read | Reads the service instances in the tenant. |
> | Action | Microsoft.ADHybridHealthService/services/reports/blobUris/read | Gets all Risky IP report URIs for the last 7 days. |
> | Action | Microsoft.ADHybridHealthService/services/reports/details/read | Gets report of top 50 users with bad password errors from last 7 days |
> | Action | Microsoft.ADHybridHealthService/services/reports/generateBlobUri/action | Generates Risky IP report and returns a URI pointing to it. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/action | Creates a server instance in the service. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/alerts/read | Reads the alerts for a server. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/credentials/read | During server registration, this api is called to get the credentials for onboarding new servers. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/datafreshness/read | For a given server, this API gets a list of  datatypes that are being uploaded by the servers and the latest time for each upload. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/delete | Deletes a server instance in the service. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/exportstatus/read | Gets the Sync Export Error details for a given Sync Service. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/metrics/groups/read | Given a service, this API gets the metrics information.<br>For example, this API can be used to get information related to: Extranet Account Lockouts, Total Failed Requests, Outstanding Token Requests (Proxy), Token Requests /sec etc for ADFederation service.<br>NTLM Authentications/sec, LDAP Successful Binds/sec, LDAP Bind Time, LDAP Active Threads, Kerberos Authentications/sec, ATQ Threads Total etc for ADDomain Service.<br>Run Profile Latency, TCP Connections Established, Insights Agent Private Bytes,Export Statistics to Azure AD for Sync Service. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/metrics/read | Gets the list of connectors and run profile names for the given service and service member. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/read | Reads the server instance in the service. |
> | Action | Microsoft.ADHybridHealthService/services/servicemembers/serviceconfiguration/read | Gets service configuration for a given tenant. |
> | Action | Microsoft.ADHybridHealthService/services/tenantwhitelisting/read | Gets feature whitelisting status for a given tenant. |
> | Action | Microsoft.ADHybridHealthService/services/write | Creates a service instance in the tenant. |
> | Action | Microsoft.ADHybridHealthService/unregister/action | Unregisters the subscription for ADHybrid Health Service Resource Provider. |

## Microsoft.Advisor

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Advisor/configurations/read | Get configurations |
> | Action | Microsoft.Advisor/configurations/write | Creates/updates configuration |
> | Action | Microsoft.Advisor/generateRecommendations/action | Gets generate recommendations status |
> | Action | Microsoft.Advisor/generateRecommendations/read | Gets generate recommendations status |
> | Action | Microsoft.Advisor/metadata/read | Get Metadata |
> | Action | Microsoft.Advisor/operations/read | Gets the operations for the Microsoft Advisor |
> | Action | Microsoft.Advisor/recommendations/available/action | New recommendation is available in Microsoft Advisor |
> | Action | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Action | Microsoft.Advisor/recommendations/suppressions/delete | Deletes suppression |
> | Action | Microsoft.Advisor/recommendations/suppressions/read | Gets suppressions |
> | Action | Microsoft.Advisor/recommendations/suppressions/write | Creates/updates suppressions |
> | Action | Microsoft.Advisor/register/action | Registers the subscription for the Microsoft Advisor |
> | Action | Microsoft.Advisor/suppressions/delete | Deletes suppression |
> | Action | Microsoft.Advisor/suppressions/read | Gets suppressions |
> | Action | Microsoft.Advisor/suppressions/write | Creates/updates suppressions |
> | Action | Microsoft.Advisor/unregister/action | Unregisters the subscription for the Microsoft Advisor |

## Microsoft.AlertsManagement

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.AlertsManagement/actionRules/delete | Delete action rule in a given subscription. |
> | Action | Microsoft.AlertsManagement/actionRules/read | Get all the action rules for the input filters. |
> | Action | Microsoft.AlertsManagement/actionRules/write | Create or update action rule in a given subscription |
> | Action | Microsoft.AlertsManagement/alerts/changestate/action | Change the state of the alert. |
> | Action | Microsoft.AlertsManagement/alerts/diagnostics/read | Get all diagnostics for the alert |
> | Action | Microsoft.AlertsManagement/alerts/history/read | Get history of the alert |
> | Action | Microsoft.AlertsManagement/alerts/read | Get all the alerts for the input filters. |
> | Action | Microsoft.AlertsManagement/alertsList/read | Get all the alerts for the input filters across subscriptions |
> | Action | Microsoft.AlertsManagement/alertsMetaData/read | Get alerts meta data for the input parameter. |
> | Action | Microsoft.AlertsManagement/alertsSummary/read | Get the summary of alerts |
> | Action | Microsoft.AlertsManagement/alertsSummaryList/read | Get the summary of alerts across subscriptions |
> | Action | Microsoft.AlertsManagement/Operations/read | Reads the operations provided |
> | Action | Microsoft.AlertsManagement/register/action | Registers the subscription for the Microsoft Alerts Management |
> | Action | Microsoft.AlertsManagement/smartDetectorAlertRules/delete | Delete Smart Detector alert rule in a given subscription |
> | Action | Microsoft.AlertsManagement/smartDetectorAlertRules/read | Get all the Smart Detector alert rules for the input filters |
> | Action | Microsoft.AlertsManagement/smartDetectorAlertRules/write | Create or update Smart Detector alert rule in a given subscription |
> | Action | Microsoft.AlertsManagement/smartGroups/changestate/action | Change the state of the smart group |
> | Action | Microsoft.AlertsManagement/smartGroups/history/read | Get history of the smart group |
> | Action | Microsoft.AlertsManagement/smartGroups/read | Get all the smart groups for the input filters |

## Microsoft.AnalysisServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.AnalysisServices/locations/checkNameAvailability/action | Checks that given Analysis Server name is valid and not in use. |
> | Action | Microsoft.AnalysisServices/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Action | Microsoft.AnalysisServices/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Action | Microsoft.AnalysisServices/operations/read | Retrieves the information of operations |
> | Action | Microsoft.AnalysisServices/register/action | Registers Analysis Services resource provider. |
> | Action | Microsoft.AnalysisServices/servers/delete | Deletes the Analysis Server. |
> | Action | Microsoft.AnalysisServices/servers/listGatewayStatus/action | List the status of the gateway associated with the server. |
> | Action | Microsoft.AnalysisServices/servers/read | Retrieves the information of the specified Analysis Server. |
> | Action | Microsoft.AnalysisServices/servers/resume/action | Resumes the Analysis Server. |
> | Action | Microsoft.AnalysisServices/servers/skus/read | Retrieve available SKU information for the server |
> | Action | Microsoft.AnalysisServices/servers/suspend/action | Suspends the Analysis Server. |
> | Action | Microsoft.AnalysisServices/servers/write | Creates or updates the specified Analysis Server. |
> | Action | Microsoft.AnalysisServices/skus/read | Retrieves the information of Skus |

## Microsoft.ApiManagement

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ApiManagement/checkNameAvailability/read | Checks if provided service name is available |
> | Action | Microsoft.ApiManagement/operations/read | Read all API operations available for Microsoft.ApiManagement resource |
> | Action | Microsoft.ApiManagement/register/action | Register subscription for Microsoft.ApiManagement resource provider |
> | Action | Microsoft.ApiManagement/reports/read | Get reports aggregated by time periods, geographical region, developers, products, APIs, operations, subscription and byRequest. |
> | Action | Microsoft.ApiManagement/service/apis/delete | Deletes the specified API of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/apis/diagnostics/delete | Deletes the specified Diagnostic from an API. |
> | Action | Microsoft.ApiManagement/service/apis/diagnostics/read | Lists all diagnostics of an API. or Gets the details of the Diagnostic for an API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/diagnostics/write | Creates a new Diagnostic for an API or updates an existing one. or Updates the details of the Diagnostic for an API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/issues/attachments/delete | Deletes the specified comment from an Issue. |
> | Action | Microsoft.ApiManagement/service/apis/issues/attachments/read | Lists all attachments for the Issue associated with the specified API. or Gets the details of the issue Attachment for an API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/issues/attachments/write | Creates a new Attachment for the Issue in an API or updates an existing one. |
> | Action | Microsoft.ApiManagement/service/apis/issues/comments/delete | Deletes the specified comment from an Issue. |
> | Action | Microsoft.ApiManagement/service/apis/issues/comments/read | Lists all comments for the Issue associated with the specified API. or Gets the details of the issue Comment for an API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/issues/comments/write | Creates a new Comment for the Issue in an API or updates an existing one. |
> | Action | Microsoft.ApiManagement/service/apis/issues/delete | Deletes the specified Issue from an API. |
> | Action | Microsoft.ApiManagement/service/apis/issues/read | Lists all issues associated with the specified API. or Gets the details of the Issue for an API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/issues/write | Creates a new Issue for an API or updates an existing one. or Updates an existing issue for an API. |
> | Action | Microsoft.ApiManagement/service/apis/operations/delete | Deletes the specified operation in the API. |
> | Action | Microsoft.ApiManagement/service/apis/operations/policies/delete | Deletes the policy configuration at the Api Operation. |
> | Action | Microsoft.ApiManagement/service/apis/operations/policies/read | Get the list of policy configuration at the API Operation level. or Get the policy configuration at the API Operation level. |
> | Action | Microsoft.ApiManagement/service/apis/operations/policies/write | Creates or updates policy configuration for the API Operation level. |
> | Action | Microsoft.ApiManagement/service/apis/operations/policy/delete | Delete the policy configuration at Operation level |
> | Action | Microsoft.ApiManagement/service/apis/operations/policy/read | Get the policy configuration at Operation level |
> | Action | Microsoft.ApiManagement/service/apis/operations/policy/write | Create policy configuration at Operation level |
> | Action | Microsoft.ApiManagement/service/apis/operations/read | Lists a collection of the operations for the specified API. or Gets the details of the API Operation specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/operations/tags/delete | Detach the tag from the Operation. |
> | Action | Microsoft.ApiManagement/service/apis/operations/tags/read | Lists all Tags associated with the Operation. or Get tag associated with the Operation. |
> | Action | Microsoft.ApiManagement/service/apis/operations/tags/write | Assign tag to the Operation. |
> | Action | Microsoft.ApiManagement/service/apis/operations/write | Creates a new operation in the API or updates an existing one. or Updates the details of the operation in the API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/operationsByTags/read | Lists a collection of operations associated with tags. |
> | Action | Microsoft.ApiManagement/service/apis/policies/delete | Deletes the policy configuration at the Api. |
> | Action | Microsoft.ApiManagement/service/apis/policies/read | Get the policy configuration at the API level. or Get the policy configuration at the API level. |
> | Action | Microsoft.ApiManagement/service/apis/policies/write | Creates or updates policy configuration for the API. |
> | Action | Microsoft.ApiManagement/service/apis/policy/delete | Delete the policy configuration at API level |
> | Action | Microsoft.ApiManagement/service/apis/policy/read | Get the policy configuration at API level |
> | Action | Microsoft.ApiManagement/service/apis/policy/write | Create policy configuration at API level |
> | Action | Microsoft.ApiManagement/service/apis/products/read | Lists all Products, which the API is part of. |
> | Action | Microsoft.ApiManagement/service/apis/read | Lists all APIs of the API Management service instance. or Gets the details of the API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/releases/delete | Removes all releases of the API or Deletes the specified release in the API. |
> | Action | Microsoft.ApiManagement/service/apis/releases/read | Lists all releases of an API.<br>An API release is created when making an API Revision current.<br>Releases are also used to rollback to previous revisions.<br>Results will be paged and can be constrained by the $top and $skip parameters.<br>or Returns the details of an API release. |
> | Action | Microsoft.ApiManagement/service/apis/releases/write | Creates a new Release for the API. or Updates the details of the release of the API specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apis/revisions/delete | Removes all revisions of an API |
> | Action | Microsoft.ApiManagement/service/apis/revisions/read | Lists all revisions of an API. |
> | Action | Microsoft.ApiManagement/service/apis/schemas/delete | Deletes the schema configuration at the Api. |
> | Action | Microsoft.ApiManagement/service/apis/schemas/read | Get the schema configuration at the API level. or Get the schema configuration at the API level. |
> | Action | Microsoft.ApiManagement/service/apis/schemas/write | Creates or updates schema configuration for the API. |
> | Action | Microsoft.ApiManagement/service/apis/tagDescriptions/delete | Delete tag description for the Api. |
> | Action | Microsoft.ApiManagement/service/apis/tagDescriptions/read | Lists all Tags descriptions in scope of API. Model similar to swagger - tagDescription is defined on API level but tag may be assigned to the Operations or Get Tag description in scope of API |
> | Action | Microsoft.ApiManagement/service/apis/tagDescriptions/write | Create/Update tag description in scope of the Api. |
> | Action | Microsoft.ApiManagement/service/apis/tags/delete | Detach the tag from the Api. |
> | Action | Microsoft.ApiManagement/service/apis/tags/read | Lists all Tags associated with the API. or Get tag associated with the API. |
> | Action | Microsoft.ApiManagement/service/apis/tags/write | Assign tag to the Api. |
> | Action | Microsoft.ApiManagement/service/apis/write | Creates new or updates existing specified API of the API Management service instance. or Updates the specified API of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/apisByTags/read | Lists a collection of apis associated with tags. |
> | Action | Microsoft.ApiManagement/service/apiVersionSets/delete | Deletes specific Api Version Set. |
> | Action | Microsoft.ApiManagement/service/apiVersionSets/read | Lists a collection of API Version Sets in the specified service instance. or Gets the details of the Api Version Set specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/apiVersionSets/versions/read | Get list of version entities |
> | Action | Microsoft.ApiManagement/service/apiVersionSets/write | Creates or Updates a Api Version Set. or Updates the details of the Api VersionSet specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/applynetworkconfigurationupdates/action | Updates the Microsoft.ApiManagement resources running in Virtual Network to pick updated Network Settings. |
> | Action | Microsoft.ApiManagement/service/authorizationServers/delete | Deletes specific authorization server instance. |
> | Action | Microsoft.ApiManagement/service/authorizationServers/listSecrets/action | Gets secrets for the authorization server. |
> | Action | Microsoft.ApiManagement/service/authorizationServers/read | Lists a collection of authorization servers defined within a service instance. or Gets the details of the authorization server without secrets. |
> | Action | Microsoft.ApiManagement/service/authorizationServers/write | Creates new authorization server or updates an existing authorization server. or Updates the details of the authorization server specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/backends/delete | Deletes the specified backend. |
> | Action | Microsoft.ApiManagement/service/backends/read | Lists a collection of backends in the specified service instance. or Gets the details of the backend specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/backends/reconnect/action | Notifies the APIM proxy to create a new connection to the backend after the specified timeout. If no timeout was specified, timeout of 2 minutes is used. |
> | Action | Microsoft.ApiManagement/service/backends/write | Creates or Updates a backend. or Updates an existing backend. |
> | Action | Microsoft.ApiManagement/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
> | Action | Microsoft.ApiManagement/service/caches/delete | Deletes specific Cache. |
> | Action | Microsoft.ApiManagement/service/caches/read | Lists a collection of all external Caches in the specified service instance. or Gets the details of the Cache specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/caches/write | Creates or updates an External Cache to be used in Api Management instance. or Updates the details of the cache specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/certificates/delete | Deletes specific certificate. |
> | Action | Microsoft.ApiManagement/service/certificates/read | Lists a collection of all certificates in the specified service instance. or Gets the details of the certificate specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/certificates/write | Creates or updates the certificate being used for authentication with the backend. |
> | Action | Microsoft.ApiManagement/service/contentTypes/contentItems/delete | Removes specified content item. |
> | Action | Microsoft.ApiManagement/service/contentTypes/contentItems/read | Returns list of content items or Returns content item details |
> | Action | Microsoft.ApiManagement/service/contentTypes/contentItems/write | Creates new content item or Updates specified content item |
> | Action | Microsoft.ApiManagement/service/contentTypes/read | Returns list of content types |
> | Action | Microsoft.ApiManagement/service/delete | Delete API Management Service instance |
> | Action | Microsoft.ApiManagement/service/diagnostics/delete | Deletes the specified Diagnostic. |
> | Action | Microsoft.ApiManagement/service/diagnostics/read | Lists all diagnostics of the API Management service instance. or Gets the details of the Diagnostic specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/diagnostics/write | Creates a new Diagnostic or updates an existing one. or Updates the details of the Diagnostic specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/gateways/action | Retrieves gateway configuration. or Updates gateway heartbeat. |
> | Action | Microsoft.ApiManagement/service/gateways/apis/delete | Deletes the specified API from the specified Gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/apis/read | Lists a collection of the APIs associated with a gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/apis/write | Adds an API to the specified Gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/delete | Deletes specific Gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/hostnameConfigurations/read | Lists the collection of hostname configurations for the specified gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/keys/action | Retrieves gateway keys. |
> | Action | Microsoft.ApiManagement/service/gateways/read | Lists a collection of gateways registered with service instance. or Gets the details of the Gateway specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/gateways/regeneratePrimaryKey/action | Regenerates primary gateway key invalidationg any tokens created with it. |
> | Action | Microsoft.ApiManagement/service/gateways/regenerateSecondaryKey/action | Regenerates secondary gateway key invalidationg any tokens created with it. |
> | Action | Microsoft.ApiManagement/service/gateways/token/action | Gets the Shared Access Authorization Token for the gateway. |
> | Action | Microsoft.ApiManagement/service/gateways/write | Creates or updates an Gateway to be used in Api Management instance. or Updates the details of the gateway specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/getssotoken/action | Gets SSO token that can be used to login into API Management Service Legacy portal as an administrator |
> | Action | Microsoft.ApiManagement/service/groups/delete | Deletes specific group of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/groups/read | Lists a collection of groups defined within a service instance. or Gets the details of the group specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/groups/users/delete | Remove existing user from existing group. |
> | Action | Microsoft.ApiManagement/service/groups/users/read | Lists a collection of user entities associated with the group. |
> | Action | Microsoft.ApiManagement/service/groups/users/write | Add existing user to existing group |
> | Action | Microsoft.ApiManagement/service/groups/write | Creates or Updates a group. or Updates the details of the group specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/identityProviders/delete | Deletes the specified identity provider configuration. |
> | Action | Microsoft.ApiManagement/service/identityProviders/listSecrets/action | Gets Identity Provider secrets. |
> | Action | Microsoft.ApiManagement/service/identityProviders/read | Lists a collection of Identity Provider configured in the specified service instance. or Gets the configuration details of the identity Provider without secrets. |
> | Action | Microsoft.ApiManagement/service/identityProviders/write | Creates or Updates the IdentityProvider configuration. or Updates an existing IdentityProvider configuration. |
> | Action | Microsoft.ApiManagement/service/issues/read | Lists a collection of issues in the specified service instance. or Gets API Management issue details |
> | Action | Microsoft.ApiManagement/service/locations/networkstatus/read | Gets the network access status of resources on which the service depends on in the location. |
> | Action | Microsoft.ApiManagement/service/loggers/delete | Deletes the specified logger. |
> | Action | Microsoft.ApiManagement/service/loggers/read | Lists a collection of loggers in the specified service instance. or Gets the details of the logger specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/loggers/write | Creates or Updates a logger. or Updates an existing logger. |
> | Action | Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
> | Action | Microsoft.ApiManagement/service/namedValues/delete | Deletes specific named value from the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/namedValues/listSecrets/action | Gets the secrets of the named value specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/namedValues/read | Lists a collection of named values defined within a service instance. or Gets the details of the named value specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/namedValues/write | Creates or updates named value. or Updates the specific named value. |
> | Action | Microsoft.ApiManagement/service/networkstatus/read | Gets the network access status of resources on which the service depends on. |
> | Action | Microsoft.ApiManagement/service/notifications/action | Sends notification to a specified user |
> | Action | Microsoft.ApiManagement/service/notifications/read | Lists a collection of properties defined within a service instance. or Gets the details of the Notification specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientEmails/delete | Removes the email from the list of Notification. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientEmails/read | Gets the list of the Notification Recipient Emails subscribed to a notification. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientEmails/write | Adds the Email address to the list of Recipients for the Notification. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientUsers/delete | Removes the API Management user from the list of Notification. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientUsers/read | Gets the list of the Notification Recipient User subscribed to the notification. |
> | Action | Microsoft.ApiManagement/service/notifications/recipientUsers/write | Adds the API Management User to the list of Recipients for the Notification. |
> | Action | Microsoft.ApiManagement/service/notifications/write | Create or Update API Management publisher notification. |
> | Action | Microsoft.ApiManagement/service/openidConnectProviders/delete | Deletes specific OpenID Connect Provider of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/openidConnectProviders/listSecrets/action | Gets specific OpenID Connect Provider secrets. |
> | Action | Microsoft.ApiManagement/service/openidConnectProviders/read | Lists of all the OpenId Connect Providers. or Gets specific OpenID Connect Provider without secrets. |
> | Action | Microsoft.ApiManagement/service/openidConnectProviders/write | Creates or updates the OpenID Connect Provider. or Updates the specific OpenID Connect Provider. |
> | Action | Microsoft.ApiManagement/service/operationresults/read | Gets current status of long running operation |
> | Action | Microsoft.ApiManagement/service/policies/delete | Deletes the global policy configuration of the Api Management Service. |
> | Action | Microsoft.ApiManagement/service/policies/read | Lists all the Global Policy definitions of the Api Management service. or Get the Global policy definition of the Api Management service. |
> | Action | Microsoft.ApiManagement/service/policies/write | Creates or updates the global policy configuration of the Api Management service. |
> | Action | Microsoft.ApiManagement/service/policy/delete | Delete the policy configuration at Tenant level |
> | Action | Microsoft.ApiManagement/service/policy/read | Get the policy configuration at Tenant level |
> | Action | Microsoft.ApiManagement/service/policy/write | Create policy configuration at Tenant level |
> | Action | Microsoft.ApiManagement/service/policyDescriptions/read | Lists all policy descriptions. |
> | Action | Microsoft.ApiManagement/service/policySnippets/read | Lists all policy snippets. |
> | Action | Microsoft.ApiManagement/service/portalsettings/read | Get Sign In Settings for the Portal or Get Sign Up Settings for the Portal or Get Delegation Settings for the Portal. |
> | Action | Microsoft.ApiManagement/service/portalsettings/write | Update Sign-In settings. or Create or Update Sign-In settings. or Update Sign Up settings or Update Sign Up settings or Update Delegation settings. or Create or Update Delegation settings. |
> | Action | Microsoft.ApiManagement/service/products/apis/delete | Deletes the specified API from the specified product. |
> | Action | Microsoft.ApiManagement/service/products/apis/read | Lists a collection of the APIs associated with a product. |
> | Action | Microsoft.ApiManagement/service/products/apis/write | Adds an API to the specified product. |
> | Action | Microsoft.ApiManagement/service/products/delete | Delete product. |
> | Action | Microsoft.ApiManagement/service/products/groups/delete | Deletes the association between the specified group and product. |
> | Action | Microsoft.ApiManagement/service/products/groups/read | Lists the collection of developer groups associated with the specified product. |
> | Action | Microsoft.ApiManagement/service/products/groups/write | Adds the association between the specified developer group with the specified product. |
> | Action | Microsoft.ApiManagement/service/products/policies/delete | Deletes the policy configuration at the Product. |
> | Action | Microsoft.ApiManagement/service/products/policies/read | Get the policy configuration at the Product level. or Get the policy configuration at the Product level. |
> | Action | Microsoft.ApiManagement/service/products/policies/write | Creates or updates policy configuration for the Product. |
> | Action | Microsoft.ApiManagement/service/products/policy/delete | Delete the policy configuration at Product level |
> | Action | Microsoft.ApiManagement/service/products/policy/read | Get the policy configuration at Product level |
> | Action | Microsoft.ApiManagement/service/products/policy/write | Create policy configuration at Product level |
> | Action | Microsoft.ApiManagement/service/products/read | Lists a collection of products in the specified service instance. or Gets the details of the product specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/products/subscriptions/read | Lists the collection of subscriptions to the specified product. |
> | Action | Microsoft.ApiManagement/service/products/tags/delete | Detach the tag from the Product. |
> | Action | Microsoft.ApiManagement/service/products/tags/read | Lists all Tags associated with the Product. or Get tag associated with the Product. |
> | Action | Microsoft.ApiManagement/service/products/tags/write | Assign tag to the Product. |
> | Action | Microsoft.ApiManagement/service/products/write | Creates or Updates a product. or Update existing product details. |
> | Action | Microsoft.ApiManagement/service/productsByTags/read | Lists a collection of products associated with tags. |
> | Action | Microsoft.ApiManagement/service/properties/delete | Deletes specific property from the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/properties/listSecrets/action | Gets the secrets of the property specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/properties/read | Lists a collection of properties defined within a service instance. or Gets the details of the property specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/properties/write | Creates or updates a property. or Updates the specific property. |
> | Action | Microsoft.ApiManagement/service/quotas/periods/read | Get quota counter value for period |
> | Action | Microsoft.ApiManagement/service/quotas/periods/write | Set quota counter current value |
> | Action | Microsoft.ApiManagement/service/quotas/read | Get values for quota |
> | Action | Microsoft.ApiManagement/service/quotas/write | Set quota counter current value |
> | Action | Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
> | Action | Microsoft.ApiManagement/service/regions/read | Lists all azure regions in which the service exists. |
> | Action | Microsoft.ApiManagement/service/reports/read | Get report aggregated by time periods or Get report aggregated by geographical region or Get report aggregated by developers.<br>or Get report aggregated by products.<br>or Get report aggregated by APIs or Get report aggregated by operations or Get report aggregated by subscription.<br>or Get requests reporting data |
> | Action | Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
> | Action | Microsoft.ApiManagement/service/subscriptions/delete | Deletes the specified subscription. |
> | Action | Microsoft.ApiManagement/service/subscriptions/listSecrets/action | Gets the specified Subscription keys. |
> | Action | Microsoft.ApiManagement/service/subscriptions/read | Lists all subscriptions of the API Management service instance. or Gets the specified Subscription entity (without keys). |
> | Action | Microsoft.ApiManagement/service/subscriptions/regeneratePrimaryKey/action | Regenerates primary key of existing subscription of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/subscriptions/regenerateSecondaryKey/action | Regenerates secondary key of existing subscription of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/subscriptions/write | Creates or updates the subscription of specified user to the specified product. or Updates the details of a subscription specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/tagResources/read | Lists a collection of resources associated with tags. |
> | Action | Microsoft.ApiManagement/service/tags/delete | Deletes specific tag of the API Management service instance. |
> | Action | Microsoft.ApiManagement/service/tags/read | Lists a collection of tags defined within a service instance. or Gets the details of the tag specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/tags/write | Creates a tag. or Updates the details of the tag specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/templates/delete | Reset default API Management email template |
> | Action | Microsoft.ApiManagement/service/templates/read | Gets all email templates or Gets API Management email template details |
> | Action | Microsoft.ApiManagement/service/templates/write | Create or update API Management email template or Updates API Management email template |
> | Action | Microsoft.ApiManagement/service/tenant/delete | Remove policy configuration for the tenant |
> | Action | Microsoft.ApiManagement/service/tenant/deploy/action | Runs a deployment task to apply changes from the specified git branch to the configuration in database. |
> | Action | Microsoft.ApiManagement/service/tenant/listSecrets/action | Get tenant access information details |
> | Action | Microsoft.ApiManagement/service/tenant/operationResults/read | Get list of operation results or Get result of a specific operation |
> | Action | Microsoft.ApiManagement/service/tenant/read | Get the Global policy definition of the Api Management service. or Get tenant access information details |
> | Action | Microsoft.ApiManagement/service/tenant/regeneratePrimaryKey/action | Regenerate primary access key |
> | Action | Microsoft.ApiManagement/service/tenant/regenerateSecondaryKey/action | Regenerate secondary access key |
> | Action | Microsoft.ApiManagement/service/tenant/save/action | Creates commit with configuration snapshot to the specified branch in the repository |
> | Action | Microsoft.ApiManagement/service/tenant/syncState/read | Get status of last git synchronization |
> | Action | Microsoft.ApiManagement/service/tenant/validate/action | Validates changes from the specified git branch |
> | Action | Microsoft.ApiManagement/service/tenant/write | Set policy configuration for the tenant or Update tenant access information details |
> | Action | Microsoft.ApiManagement/service/updatecertificate/action | Upload SSL certificate for an API Management Service |
> | Action | Microsoft.ApiManagement/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
> | Action | Microsoft.ApiManagement/service/users/action | Register a new user |
> | Action | Microsoft.ApiManagement/service/users/confirmations/send/action | Sends confirmation |
> | Action | Microsoft.ApiManagement/service/users/delete | Deletes specific user. |
> | Action | Microsoft.ApiManagement/service/users/generateSsoUrl/action | Retrieves a redirection URL containing an authentication token for signing a given user into the developer portal. |
> | Action | Microsoft.ApiManagement/service/users/groups/read | Lists all user groups. |
> | Action | Microsoft.ApiManagement/service/users/identities/read | List of all user identities. |
> | Action | Microsoft.ApiManagement/service/users/keys/read | Get keys associated with user |
> | Action | Microsoft.ApiManagement/service/users/read | Lists a collection of registered users in the specified service instance. or Gets the details of the user specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/users/subscriptions/read | Lists the collection of subscriptions of the specified user. |
> | Action | Microsoft.ApiManagement/service/users/token/action | Gets the Shared Access Authorization Token for the User. |
> | Action | Microsoft.ApiManagement/service/users/write | Creates or Updates a user. or Updates the details of the user specified by its identifier. |
> | Action | Microsoft.ApiManagement/service/write | Create a new instance of API Management Service |
> | Action | Microsoft.ApiManagement/unregister/action | Un-register subscription for Microsoft.ApiManagement resource provider |

## Microsoft.Authorization

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Authorization/classicAdministrators/delete | Removes the administrator from the subscription. |
> | Action | Microsoft.Authorization/classicAdministrators/operationstatuses/read | Gets the administrator operation statuses of the subscription. |
> | Action | Microsoft.Authorization/classicAdministrators/read | Reads the administrators for the subscription. |
> | Action | Microsoft.Authorization/classicAdministrators/write | Add or modify administrator to a subscription. |
> | Action | Microsoft.Authorization/denyAssignments/delete | Delete a deny assignment at the specified scope. |
> | Action | Microsoft.Authorization/denyAssignments/read | Get information about a deny assignment. |
> | Action | Microsoft.Authorization/denyAssignments/write | Create a deny assignment at the specified scope. |
> | Action | Microsoft.Authorization/elevateAccess/action | Grants the caller User Access Administrator access at the tenant scope |
> | Action | Microsoft.Authorization/locks/delete | Delete locks at the specified scope. |
> | Action | Microsoft.Authorization/locks/read | Gets locks at the specified scope. |
> | Action | Microsoft.Authorization/locks/write | Add locks at the specified scope. |
> | Action | Microsoft.Authorization/operations/read | Gets the list of operations |
> | Action | Microsoft.Authorization/permissions/read | Lists all the permissions the caller has at a given scope. |
> | Action | Microsoft.Authorization/policies/audit/action | Action taken as a result of evaluation of Azure Policy with 'audit' effect |
> | Action | Microsoft.Authorization/policies/auditIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'auditIfNotExists' effect |
> | Action | Microsoft.Authorization/policies/deny/action | Action taken as a result of evaluation of Azure Policy with 'deny' effect |
> | Action | Microsoft.Authorization/policies/deployIfNotExists/action | Action taken as a result of evaluation of Azure Policy with 'deployIfNotExists' effect |
> | Action | Microsoft.Authorization/policyAssignments/delete | Delete a policy assignment at the specified scope. |
> | Action | Microsoft.Authorization/policyAssignments/read | Get information about a policy assignment. |
> | Action | Microsoft.Authorization/policyAssignments/write | Create a policy assignment at the specified scope. |
> | Action | Microsoft.Authorization/policyDefinitions/delete | Delete a policy definition. |
> | Action | Microsoft.Authorization/policyDefinitions/read | Get information about a policy definition. |
> | Action | Microsoft.Authorization/policyDefinitions/write | Create a custom policy definition. |
> | Action | Microsoft.Authorization/policySetDefinitions/delete | Delete a policy set definition. |
> | Action | Microsoft.Authorization/policySetDefinitions/read | Get information about a policy set definition. |
> | Action | Microsoft.Authorization/policySetDefinitions/write | Create a custom policy set definition. |
> | Action | Microsoft.Authorization/providerOperations/read | Get operations for all resource providers which can be used in role definitions. |
> | Action | Microsoft.Authorization/roleAssignments/delete | Delete a role assignment at the specified scope. |
> | Action | Microsoft.Authorization/roleAssignments/read | Get information about a role assignment. |
> | Action | Microsoft.Authorization/roleAssignments/write | Create a role assignment at the specified scope. |
> | Action | Microsoft.Authorization/roleDefinitions/delete | Delete the specified custom role definition. |
> | Action | Microsoft.Authorization/roleDefinitions/read | Get information about a role definition. |
> | Action | Microsoft.Authorization/roleDefinitions/write | Create or update a custom role definition with specified permissions and assignable scopes. |

## Microsoft.Automation

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Automation/automationAccounts/agentRegistrationInformation/read | Read an Azure Automation DSC's registration information |
> | Action | Microsoft.Automation/automationAccounts/agentRegistrationInformation/regenerateKey/action | Writes a request to regenerate Azure Automation DSC keys |
> | Action | Microsoft.Automation/automationAccounts/certificates/delete | Deletes an Azure Automation certificate asset |
> | Action | Microsoft.Automation/automationAccounts/certificates/getCount/action | Reads the count of certificates |
> | Action | Microsoft.Automation/automationAccounts/certificates/read | Gets an Azure Automation certificate asset |
> | Action | Microsoft.Automation/automationAccounts/certificates/write | Creates or updates an Azure Automation certificate asset |
> | Action | Microsoft.Automation/automationAccounts/compilationjobs/read | Reads an Azure Automation DSC's Compilation |
> | Action | Microsoft.Automation/automationAccounts/compilationjobs/read | Reads an Azure Automation DSC's Compilation |
> | Action | Microsoft.Automation/automationAccounts/compilationjobs/write | Writes an Azure Automation DSC's Compilation |
> | Action | Microsoft.Automation/automationAccounts/compilationjobs/write | Writes an Azure Automation DSC's Compilation |
> | Action | Microsoft.Automation/automationAccounts/configurations/content/read | Reads the configuration media content |
> | Action | Microsoft.Automation/automationAccounts/configurations/delete | Deletes an Azure Automation DSC's content |
> | Action | Microsoft.Automation/automationAccounts/configurations/getCount/action | Reads the count of an Azure Automation DSC's content |
> | Action | Microsoft.Automation/automationAccounts/configurations/read | Gets an Azure Automation DSC's content |
> | Action | Microsoft.Automation/automationAccounts/configurations/write | Writes an Azure Automation DSC's content |
> | Action | Microsoft.Automation/automationAccounts/connections/delete | Deletes an Azure Automation connection asset |
> | Action | Microsoft.Automation/automationAccounts/connections/getCount/action | Reads the count of connections |
> | Action | Microsoft.Automation/automationAccounts/connections/read | Gets an Azure Automation connection asset |
> | Action | Microsoft.Automation/automationAccounts/connections/write | Creates or updates an Azure Automation connection asset |
> | Action | Microsoft.Automation/automationAccounts/connectionTypes/delete | Deletes an Azure Automation connection type asset |
> | Action | Microsoft.Automation/automationAccounts/connectionTypes/read | Gets an Azure Automation connection type asset |
> | Action | Microsoft.Automation/automationAccounts/connectionTypes/write | Creates an Azure Automation connection type asset |
> | Action | Microsoft.Automation/automationAccounts/credentials/delete | Deletes an Azure Automation credential asset |
> | Action | Microsoft.Automation/automationAccounts/credentials/getCount/action | Reads the count of credentials |
> | Action | Microsoft.Automation/automationAccounts/credentials/read | Gets an Azure Automation credential asset |
> | Action | Microsoft.Automation/automationAccounts/credentials/write | Creates or updates an Azure Automation credential asset |
> | Action | Microsoft.Automation/automationAccounts/delete | Deletes an Azure Automation account |
> | Action | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/delete | Deletes Hybrid Runbook Worker Resources |
> | Action | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
> | Action | Microsoft.Automation/automationAccounts/jobs/output/read | Gets the output of a job |
> | Action | Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
> | Action | Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | Action | Microsoft.Automation/automationAccounts/jobs/runbookContent/action | Gets the content of the Azure Automation runbook at the time of the job execution |
> | Action | Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | Action | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Action | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Action | Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | Action | Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
> | Action | Microsoft.Automation/automationAccounts/jobSchedules/delete | Deletes an Azure Automation job schedule |
> | Action | Microsoft.Automation/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
> | Action | Microsoft.Automation/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
> | Action | Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
> | Action | Microsoft.Automation/automationAccounts/listKeys/action | Reads the Keys for the automation account |
> | Action | Microsoft.Automation/automationAccounts/modules/activities/read | Gets Azure Automation Activities |
> | Action | Microsoft.Automation/automationAccounts/modules/delete | Deletes an Azure Automation Powershell module |
> | Action | Microsoft.Automation/automationAccounts/modules/getCount/action | Gets the count of Powershell modules within the Automation Account |
> | Action | Microsoft.Automation/automationAccounts/modules/read | Gets an Azure Automation Powershell module |
> | Action | Microsoft.Automation/automationAccounts/modules/write | Creates or updates an Azure Automation Powershell module |
> | Action | Microsoft.Automation/automationAccounts/nodeConfigurations/delete | Deletes an Azure Automation DSC's node configuration |
> | Action | Microsoft.Automation/automationAccounts/nodeConfigurations/rawContent/action | Reads an Azure Automation DSC's node configuration content |
> | Action | Microsoft.Automation/automationAccounts/nodeConfigurations/read | Reads an Azure Automation DSC's node configuration |
> | Action | Microsoft.Automation/automationAccounts/nodeConfigurations/write | Writes an Azure Automation DSC's node configuration |
> | Action | Microsoft.Automation/automationAccounts/nodecounts/read | Reads node count summary for the specified type |
> | Action | Microsoft.Automation/automationAccounts/nodes/delete | Deletes Azure Automation DSC nodes |
> | Action | Microsoft.Automation/automationAccounts/nodes/read | Reads Azure Automation DSC nodes |
> | Action | Microsoft.Automation/automationAccounts/nodes/reports/content/read | Reads Azure Automation DSC report contents |
> | Action | Microsoft.Automation/automationAccounts/nodes/reports/read | Reads Azure Automation DSC reports |
> | Action | Microsoft.Automation/automationAccounts/nodes/write | Creates or updates Azure Automation DSC nodes |
> | Action | Microsoft.Automation/automationAccounts/objectDataTypes/fields/read | Gets Azure Automation TypeFields |
> | Action | Microsoft.Automation/automationAccounts/python2Packages/delete | Deletes an Azure Automation Python 2 package |
> | Action | Microsoft.Automation/automationAccounts/python2Packages/read | Gets an Azure Automation Python 2 package |
> | Action | Microsoft.Automation/automationAccounts/python2Packages/write | Creates or updates an Azure Automation Python 2 package |
> | Action | Microsoft.Automation/automationAccounts/python3Packages/delete | Deletes an Azure Automation Python 3 package |
> | Action | Microsoft.Automation/automationAccounts/python3Packages/read | Gets an Azure Automation Python 3 package |
> | Action | Microsoft.Automation/automationAccounts/python3Packages/write | Creates or updates an Azure Automation Python 3 package |
> | Action | Microsoft.Automation/automationAccounts/read | Gets an Azure Automation account |
> | Action | Microsoft.Automation/automationAccounts/runbooks/content/read | Gets the content of an Azure Automation runbook |
> | Action | Microsoft.Automation/automationAccounts/runbooks/delete | Deletes an Azure Automation runbook |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/content/write | Creates the content of an Azure Automation runbook draft |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/operationResults/read | Gets Azure Automation runbook draft operation results |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/read | Gets an Azure Automation runbook draft |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/read | Gets an Azure Automation runbook draft test job |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/resume/action | Resumes an Azure Automation runbook draft test job |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/stop/action | Stops an Azure Automation runbook draft test job |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/suspend/action | Suspends an Azure Automation runbook draft test job |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/testJob/write | Creates an Azure Automation runbook draft test job |
> | Action | Microsoft.Automation/automationAccounts/runbooks/draft/undoEdit/action | Undo edits to an Azure Automation runbook draft |
> | Action | Microsoft.Automation/automationAccounts/runbooks/getCount/action | Gets the count of Azure Automation runbooks |
> | Action | Microsoft.Automation/automationAccounts/runbooks/publish/action | Publishes an Azure Automation runbook draft |
> | Action | Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | Action | Microsoft.Automation/automationAccounts/runbooks/write | Creates or updates an Azure Automation runbook |
> | Action | Microsoft.Automation/automationAccounts/schedules/delete | Deletes an Azure Automation schedule asset |
> | Action | Microsoft.Automation/automationAccounts/schedules/getCount/action | Gets the count of Azure Automation schedules |
> | Action | Microsoft.Automation/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
> | Action | Microsoft.Automation/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationMachineRuns/read | Gets an Azure Automation Software Update Configuration Machine Run |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurationRuns/read | Gets an Azure Automation Software Update Configuration Run |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/delete | Deletes an Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/delete | Deletes an Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/read | Gets an Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/read | Gets an Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/write | Creates or updates Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/softwareUpdateConfigurations/write | Creates or updates Azure Automation Software Update Configuration |
> | Action | Microsoft.Automation/automationAccounts/statistics/read | Gets Azure Automation Statistics |
> | Action | Microsoft.Automation/automationAccounts/updateDeploymentMachineRuns/read | Get an Azure Automation update deployment machine |
> | Action | Microsoft.Automation/automationAccounts/updateManagementPatchJob/read | Gets an Azure Automation update management patch job |
> | Action | Microsoft.Automation/automationAccounts/usages/read | Gets Azure Automation Usage |
> | Action | Microsoft.Automation/automationAccounts/variables/delete | Deletes an Azure Automation variable asset |
> | Action | Microsoft.Automation/automationAccounts/variables/read | Reads an Azure Automation variable asset |
> | Action | Microsoft.Automation/automationAccounts/variables/write | Creates or updates an Azure Automation variable asset |
> | Action | Microsoft.Automation/automationAccounts/watchers/delete | Delete an Azure Automation watcher job |
> | Action | Microsoft.Automation/automationAccounts/watchers/read | Gets an Azure Automation watcher job |
> | Action | Microsoft.Automation/automationAccounts/watchers/start/action | Start an Azure Automation watcher job |
> | Action | Microsoft.Automation/automationAccounts/watchers/stop/action | Stop an Azure Automation watcher job |
> | Action | Microsoft.Automation/automationAccounts/watchers/streams/read | Gets an Azure Automation watcher job stream |
> | Action | Microsoft.Automation/automationAccounts/watchers/watcherActions/delete | Delete an Azure Automation watcher job actions |
> | Action | Microsoft.Automation/automationAccounts/watchers/watcherActions/read | Gets an Azure Automation watcher job actions |
> | Action | Microsoft.Automation/automationAccounts/watchers/watcherActions/write | Create an Azure Automation watcher job actions |
> | Action | Microsoft.Automation/automationAccounts/watchers/write | Creates an Azure Automation watcher job |
> | Action | Microsoft.Automation/automationAccounts/webhooks/action | Generates a URI for an Azure Automation webhook |
> | Action | Microsoft.Automation/automationAccounts/webhooks/delete | Deletes an Azure Automation webhook  |
> | Action | Microsoft.Automation/automationAccounts/webhooks/read | Reads an Azure Automation webhook |
> | Action | Microsoft.Automation/automationAccounts/webhooks/write | Creates or updates an Azure Automation webhook |
> | Action | Microsoft.Automation/automationAccounts/write | Creates or updates an Azure Automation account |
> | Action | Microsoft.Automation/operations/read | Gets Available Operations for Azure Automation resources |
> | Action | Microsoft.Automation/register/action | Registers the subscription to Azure Automation |

## Microsoft.AzureActiveDirectory

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.AzureActiveDirectory/b2cDirectories/delete | Delete B2C Directory resource |
> | Action | Microsoft.AzureActiveDirectory/b2cDirectories/read | View B2C Directory resource |
> | Action | Microsoft.AzureActiveDirectory/b2cDirectories/write | Create or update B2C Directory resource |
> | Action | Microsoft.AzureActiveDirectory/b2ctenants/read | Lists all B2C tenants where the user is a member |
> | Action | Microsoft.AzureActiveDirectory/operations/read | Read all API operations available for Microsoft.AzureActiveDirectory resource provider |
> | Action | Microsoft.AzureActiveDirectory/register/action | Register subscription for Microsoft.AzureActiveDirectory resource provider |

## Microsoft.AzureStack

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.AzureStack/Operations/read | Gets the properties of a resource provider operation |
> | Action | Microsoft.AzureStack/register/action | Registers Subscription with Microsoft.AzureStack resource provider |
> | Action | Microsoft.AzureStack/registrations/customerSubscriptions/delete | Deletes an Azure Stack Customer Subscription |
> | Action | Microsoft.AzureStack/registrations/customerSubscriptions/read | Gets the properties of an Azure Stack Customer Subscription |
> | Action | Microsoft.AzureStack/registrations/customerSubscriptions/write | Creates or updates an Azure Stack Customer Subscription |
> | Action | Microsoft.AzureStack/registrations/delete | Deletes an Azure Stack registration |
> | Action | Microsoft.AzureStack/registrations/getActivationKey/action | Gets the latest Azure Stack activation key |
> | Action | Microsoft.AzureStack/registrations/products/getProduct/action | Retrieves Azure Stack Marketplace product |
> | Action | Microsoft.AzureStack/registrations/products/getProducts/action | Retrieves a list of Azure Stack Marketplace products |
> | Action | Microsoft.AzureStack/registrations/products/listDetails/action | Retrieves extended details for an Azure Stack Marketplace product |
> | Action | Microsoft.AzureStack/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
> | Action | Microsoft.AzureStack/registrations/products/uploadProductLog/action | Record Azure Stack Marketplace product operation status and timestamp |
> | Action | Microsoft.AzureStack/registrations/read | Gets the properties of an Azure Stack registration |
> | Action | Microsoft.AzureStack/registrations/write | Creates or updates an Azure Stack registration |
> | Action | Microsoft.AzureStack/verificationKeys/getCurrentKey/action | Gets the current version of Azure Stack signing public key |

## Microsoft.Batch

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Batch/batchAccounts/applications/delete | Deletes an application |
> | Action | Microsoft.Batch/batchAccounts/applications/read | Lists applications or gets the properties of an application |
> | Action | Microsoft.Batch/batchAccounts/applications/versions/activate/action | Activates an application package |
> | Action | Microsoft.Batch/batchAccounts/applications/versions/delete | Deletes an application package |
> | Action | Microsoft.Batch/batchAccounts/applications/versions/read | Gets the properties of an application package |
> | Action | Microsoft.Batch/batchAccounts/applications/versions/write | Creates a new application package or updates an existing application package |
> | Action | Microsoft.Batch/batchAccounts/applications/write | Creates a new application or updates an existing application |
> | Action | Microsoft.Batch/batchAccounts/certificateOperationResults/read | Gets the results of a long running certificate operation on a Batch account |
> | Action | Microsoft.Batch/batchAccounts/certificates/cancelDelete/action | Cancels the failed deletion of a certificate on a Batch account |
> | Action | Microsoft.Batch/batchAccounts/certificates/delete | Deletes a certificate from a Batch account |
> | Action | Microsoft.Batch/batchAccounts/certificates/read | Lists certificates on a Batch account or gets the properties of a certificate |
> | Action | Microsoft.Batch/batchAccounts/certificates/write | Creates a new certificate on a Batch account or updates an existing certificate |
> | Action | Microsoft.Batch/batchAccounts/delete | Deletes a Batch account |
> | DataAction | Microsoft.Batch/batchAccounts/jobs/delete | Deletes a job from a Batch account |
> | DataAction | Microsoft.Batch/batchAccounts/jobs/read | Lists jobs on a Batch account or gets the properties of a job |
> | DataAction | Microsoft.Batch/batchAccounts/jobs/write | Creates a new job on a Batch account or updates an existing job |
> | DataAction | Microsoft.Batch/batchAccounts/jobSchedules/delete | Deletes a job schedule from a Batch account |
> | DataAction | Microsoft.Batch/batchAccounts/jobSchedules/read | Lists job schedules on a Batch account or gets the properties of a job schedule |
> | DataAction | Microsoft.Batch/batchAccounts/jobSchedules/write | Creates a new job schedule on a Batch account or updates an existing job schedule |
> | Action | Microsoft.Batch/batchAccounts/listkeys/action | Lists access keys for a Batch account |
> | Action | Microsoft.Batch/batchAccounts/operationResults/read | Gets the results of a long running Batch account operation |
> | Action | Microsoft.Batch/batchAccounts/poolOperationResults/read | Gets the results of a long running pool operation on a Batch account |
> | Action | Microsoft.Batch/batchAccounts/pools/delete | Deletes a pool from a Batch account |
> | Action | Microsoft.Batch/batchAccounts/pools/disableAutoscale/action | Disables automatic scaling for a Batch account pool |
> | Action | Microsoft.Batch/batchAccounts/pools/read | Lists pools on a Batch account or gets the properties of a pool |
> | Action | Microsoft.Batch/batchAccounts/pools/stopResize/action | Stops an ongoing resize operation on a Batch account pool |
> | Action | Microsoft.Batch/batchAccounts/pools/write | Creates a new pool on a Batch account or updates an existing pool |
> | Action | Microsoft.Batch/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account |
> | Action | Microsoft.Batch/batchAccounts/regeneratekeys/action | Regenerates access keys for a Batch account |
> | Action | Microsoft.Batch/batchAccounts/syncAutoStorageKeys/action | Synchronizes access keys for the auto storage account configured for a Batch account |
> | Action | Microsoft.Batch/batchAccounts/write | Creates a new Batch account or updates an existing Batch account |
> | Action | Microsoft.Batch/locations/accountOperationResults/read | Gets the results of a long running Batch account operation |
> | Action | Microsoft.Batch/locations/checkNameAvailability/action | Checks that the account name is valid and not in use. |
> | Action | Microsoft.Batch/locations/quotas/read | Gets Batch quotas of the specified subscription at the specified Azure region |
> | Action | Microsoft.Batch/operations/read | Lists operations available on Microsoft.Batch resource provider |
> | Action | Microsoft.Batch/register/action | Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts |
> | Action | Microsoft.Batch/unregister/action | Unregisters the subscription for the Batch Resource Provider preventing the creation of Batch accounts |

## Microsoft.Billing

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Billing/billingAccounts/agreements/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/customers/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoices/pricesheet/download/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/move/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/transfer/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/billingSubscriptions/validateMoveEligibility/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/move/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/transfer/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/products/validateMoveEligibility/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/invoiceSections/write |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/pricesheet/download/action |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/read |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Action | Microsoft.Billing/billingAccounts/billingProfiles/write |  |
> | Action | Microsoft.Billing/billingAccounts/billingSubscriptions/read |  |
> | Action | Microsoft.Billing/billingAccounts/customers/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/customers/read |  |
> | Action | Microsoft.Billing/billingAccounts/departments/read |  |
> | Action | Microsoft.Billing/billingAccounts/enrollmentAccounts/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/enrollmentAccounts/read |  |
> | Action | Microsoft.Billing/billingAccounts/enrollmentDepartments/billingPermissions/read |  |
> | Action | Microsoft.Billing/billingAccounts/listInvoiceSectionsWithCreateSubscriptionPermission/action |  |
> | Action | Microsoft.Billing/billingAccounts/products/read |  |
> | Action | Microsoft.Billing/billingAccounts/read |  |
> | Action | Microsoft.Billing/billingAccounts/write |  |
> | Action | Microsoft.Billing/departments/read |  |
> | Action | Microsoft.Billing/invoices/download/action | Download invoice using download link from list |
> | Action | Microsoft.Billing/invoices/read |  |
> | Action | Microsoft.Billing/register/action |  |
> | Action | Microsoft.Billing/validateAddress/action |  |

## Microsoft.BingMaps

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.BingMaps/mapApis/Delete | Delete Operation |
> | Action | Microsoft.BingMaps/mapApis/listSecrets/action | List the Secrets |
> | Action | Microsoft.BingMaps/mapApis/listSingleSignOnToken/action | Read Single Sign On Authorization Token For The Resource |
> | Action | Microsoft.BingMaps/mapApis/Read | Read Operation |
> | Action | Microsoft.BingMaps/mapApis/regenerateKey/action | Regenerates the Key |
> | Action | Microsoft.BingMaps/mapApis/Write | Write Operation |
> | Action | Microsoft.BingMaps/Operations/read | Description of the operation. |

## Microsoft.Blockchain

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Blockchain/blockchainMembers/delete | Deletes an existing Blockchain Member. |
> | Action | Microsoft.Blockchain/blockchainMembers/listApiKeys/action | Gets or Lists existing Blockchain Member API keys. |
> | Action | Microsoft.Blockchain/blockchainMembers/read | Gets or Lists existing Blockchain Member(s). |
> | DataAction | Microsoft.Blockchain/blockchainMembers/transactionNodes/connect/action | Connects to a Blockchain Member Transaction Node. |
> | Action | Microsoft.Blockchain/blockchainMembers/transactionNodes/delete | Deletes an existing Blockchain Member Transaction Node. |
> | Action | Microsoft.Blockchain/blockchainMembers/transactionNodes/listApiKeys/action | Gets or Lists existing Blockchain Member Transaction Node API keys. |
> | Action | Microsoft.Blockchain/blockchainMembers/transactionNodes/read | Gets or Lists existing Blockchain Member Transaction Node(s). |
> | Action | Microsoft.Blockchain/blockchainMembers/transactionNodes/write | Creates or Updates a Blockchain Member Transaction Node. |
> | Action | Microsoft.Blockchain/blockchainMembers/write | Creates or Updates a Blockchain Member. |
> | Action | Microsoft.Blockchain/cordaMembers/delete | Deletes an existing Blockchain Corda Member. |
> | Action | Microsoft.Blockchain/cordaMembers/read | Gets or Lists existing Blockchain Corda Member(s). |
> | Action | Microsoft.Blockchain/cordaMembers/write | Creates or Updates a Blockchain Corda Member. |
> | Action | Microsoft.Blockchain/locations/blockchainMemberOperationResults/read | Gets the Operation Results of Blockchain Members. |
> | Action | Microsoft.Blockchain/locations/checkNameAvailability/action | Checks that resource name is valid and is not in use. |
> | Action | Microsoft.Blockchain/operations/read | List all Operations in Microsoft Blockchain Resource Provider. |
> | Action | Microsoft.Blockchain/register/action | Registers the subscription for the Blockchain Resource Provider. |

## Microsoft.Blueprint

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Blueprint/blueprintAssignments/assignmentOperations/read | Read any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprintAssignments/delete | Delete any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprintAssignments/read | Read any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprintAssignments/whoisblueprint/action | Get Azure Blueprints service principal object Id. |
> | Action | Microsoft.Blueprint/blueprintAssignments/write | Create or update any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprints/artifacts/delete | Delete any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprints/artifacts/read | Read any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprints/artifacts/write | Create or update any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprints/delete | Delete any blueprints |
> | Action | Microsoft.Blueprint/blueprints/read | Read any blueprints |
> | Action | Microsoft.Blueprint/blueprints/versions/artifacts/read | Read any blueprint artifacts |
> | Action | Microsoft.Blueprint/blueprints/versions/delete | Delete any blueprints |
> | Action | Microsoft.Blueprint/blueprints/versions/read | Read any blueprints |
> | Action | Microsoft.Blueprint/blueprints/versions/write | Create or update any blueprints |
> | Action | Microsoft.Blueprint/blueprints/write | Create or update any blueprints |
> | Action | Microsoft.Blueprint/register/action | Registers the Azure Blueprints Resource Provider |

## Microsoft.BotService

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.BotService/botServices/channels/delete | Delete a Bot Service |
> | Action | Microsoft.BotService/botServices/channels/read | Read a Bot Service |
> | Action | Microsoft.BotService/botServices/channels/write | Write a Bot Service |
> | Action | Microsoft.BotService/botServices/connections/delete | Delete a Bot Service |
> | Action | Microsoft.BotService/botServices/connections/read | Read a Bot Service |
> | Action | Microsoft.BotService/botServices/connections/write | Write a Bot Service |
> | Action | Microsoft.BotService/botServices/delete | Delete a Bot Service |
> | Action | Microsoft.BotService/botServices/read | Read a Bot Service |
> | Action | Microsoft.BotService/botServices/write | Write a Bot Service |
> | Action | Microsoft.BotService/locations/operationresults/read | Read the status of an asynchronous operation |
> | Action | Microsoft.BotService/Operations/read | Read the operations for all resource types |

## Microsoft.Cache

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Cache/checknameavailability/action | Checks if a name is available for use with a new Redis Cache |
> | Action | Microsoft.Cache/locations/operationresults/read | Gets the result of a long running operation for which the 'Location' header was previously returned to the client |
> | Action | Microsoft.Cache/operations/read | Lists the operations that 'Microsoft.Cache' provider supports. |
> | Action | Microsoft.Cache/redis/delete | Delete the entire Redis Cache |
> | Action | Microsoft.Cache/redis/export/action | Export Redis data to prefixed storage blobs in specified format |
> | Action | Microsoft.Cache/redis/firewallRules/delete | Delete IP firewall rules of a Redis Cache |
> | Action | Microsoft.Cache/redis/firewallRules/read | Get the IP firewall rules of a Redis Cache |
> | Action | Microsoft.Cache/redis/firewallRules/write | Edit the IP firewall rules of a Redis Cache |
> | Action | Microsoft.Cache/redis/forceReboot/action | Force reboot a cache instance, potentially with data loss. |
> | Action | Microsoft.Cache/redis/import/action | Import data of a specified format from multiple blobs into Redis |
> | Action | Microsoft.Cache/redis/linkedservers/delete | Delete Linked Server from a Redis Cache |
> | Action | Microsoft.Cache/redis/linkedservers/read | Get Linked Servers associated with a redis cache. |
> | Action | Microsoft.Cache/redis/linkedservers/write | Add Linked Server to a Redis Cache |
> | Action | Microsoft.Cache/redis/listKeys/action | View the value of Redis Cache access keys in the management portal |
> | Action | Microsoft.Cache/redis/listUpgradeNotifications/read | List the latest Upgrade Notifications for the cache tenant. |
> | Action | Microsoft.Cache/redis/metricDefinitions/read | Gets the available metrics for a Redis Cache |
> | Action | Microsoft.Cache/redis/patchSchedules/delete | Delete the patch schedule of a Redis Cache |
> | Action | Microsoft.Cache/redis/patchSchedules/read | Gets the patching schedule of a Redis Cache |
> | Action | Microsoft.Cache/redis/patchSchedules/write | Modify the patching schedule of a Redis Cache |
> | Action | Microsoft.Cache/redis/read | View the Redis Cache's settings and configuration in the management portal |
> | Action | Microsoft.Cache/redis/regenerateKey/action | Change the value of Redis Cache access keys in the management portal |
> | Action | Microsoft.Cache/redis/start/action | Start a cache instance. |
> | Action | Microsoft.Cache/redis/stop/action | Stop a cache instance. |
> | Action | Microsoft.Cache/redis/write | Modify the Redis Cache's settings and configuration in the management portal |
> | Action | Microsoft.Cache/register/action | Registers the 'Microsoft.Cache' resource provider with a subscription |
> | Action | Microsoft.Cache/unregister/action | Unregisters the 'Microsoft.Cache' resource provider with a subscription |

## Microsoft.Capacity

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Capacity/appliedreservations/read | Read All Reservations |
> | Action | Microsoft.Capacity/calculateexchange/action | Computes the exchange amount and price of new purchase and returns policy Errors. |
> | Action | Microsoft.Capacity/calculateprice/action | Calculate any Reservation Price |
> | Action | Microsoft.Capacity/catalogs/read | Read catalog of Reservation |
> | Action | Microsoft.Capacity/checkoffers/action | Check any Subscription Offers |
> | Action | Microsoft.Capacity/checkscopes/action | Check any Subscription |
> | Action | Microsoft.Capacity/commercialreservationorders/read | Get Reservation Orders created in any Tenant |
> | Action | Microsoft.Capacity/exchange/action | Exchange any Reservation |
> | Action | Microsoft.Capacity/operations/read | Read any Operation |
> | Action | Microsoft.Capacity/register/action | Registers the Capacity resource provider and enables the creation of Capacity resources. |
> | Action | Microsoft.Capacity/reservationorders/action | Update any Reservation |
> | Action | Microsoft.Capacity/reservationorders/availablescopes/action | Find any Available Scope |
> | Action | Microsoft.Capacity/reservationorders/calculaterefund/action | Computes the refund amount and price of new purchase and returns policy Errors. |
> | Action | Microsoft.Capacity/reservationorders/delete | Delete any Reservation |
> | Action | Microsoft.Capacity/reservationorders/merge/action | Merge any Reservation |
> | Action | Microsoft.Capacity/reservationorders/read | Read All Reservations |
> | Action | Microsoft.Capacity/reservationorders/reservations/action | Update any Reservation |
> | Action | Microsoft.Capacity/reservationorders/reservations/availablescopes/action | Find any Available Scope |
> | Action | Microsoft.Capacity/reservationorders/reservations/delete | Delete any Reservation |
> | Action | Microsoft.Capacity/reservationorders/reservations/read | Read All Reservations |
> | Action | Microsoft.Capacity/reservationorders/reservations/revisions/read | Read All Reservations |
> | Action | Microsoft.Capacity/reservationorders/reservations/write | Create any Reservation |
> | Action | Microsoft.Capacity/reservationorders/return/action | Return any Reservation |
> | Action | Microsoft.Capacity/reservationorders/split/action | Split any Reservation |
> | Action | Microsoft.Capacity/reservationorders/swap/action | Swap any Reservation |
> | Action | Microsoft.Capacity/reservationorders/write | Create any Reservation |
> | Action | Microsoft.Capacity/tenants/register/action | Register any Tenant |
> | Action | Microsoft.Capacity/unregister/action | Unregister any Tenant |
> | Action | Microsoft.Capacity/validatereservationorder/action | Validate any Reservation |

## Microsoft.Cdn

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/delete |  |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/read |  |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallmanagedrulesets/write |  |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/delete |  |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/read |  |
> | Action | Microsoft.Cdn/cdnwebapplicationfirewallpolicies/write |  |
> | Action | Microsoft.Cdn/CheckNameAvailability/action |  |
> | Action | Microsoft.Cdn/CheckResourceUsage/action |  |
> | Action | Microsoft.Cdn/edgenodes/delete |  |
> | Action | Microsoft.Cdn/edgenodes/read |  |
> | Action | Microsoft.Cdn/edgenodes/write |  |
> | Action | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/read |  |
> | Action | Microsoft.Cdn/operationresults/cdnwebapplicationfirewallpolicyresults/write |  |
> | Action | Microsoft.Cdn/operationresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/CheckResourceUsage/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/CheckResourceUsage/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/DisableCustomHttps/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/EnableCustomHttps/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/read |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/customdomainresults/write |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/Load/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/delete |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/read |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/originresults/write |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/Purge/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/read |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/Start/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/Stop/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/ValidateCustomDomain/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/endpointresults/write |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/GenerateSsoUri/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/GetSupportedOptimizationTypes/action |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/read |  |
> | Action | Microsoft.Cdn/operationresults/profileresults/write |  |
> | Action | Microsoft.Cdn/operationresults/read |  |
> | Action | Microsoft.Cdn/operationresults/write |  |
> | Action | Microsoft.Cdn/operations/read |  |
> | Action | Microsoft.Cdn/profiles/CheckResourceUsage/action |  |
> | Action | Microsoft.Cdn/profiles/delete |  |
> | Action | Microsoft.Cdn/profiles/endpoints/CheckResourceUsage/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/customdomains/delete |  |
> | Action | Microsoft.Cdn/profiles/endpoints/customdomains/DisableCustomHttps/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/customdomains/EnableCustomHttps/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/customdomains/read |  |
> | Action | Microsoft.Cdn/profiles/endpoints/customdomains/write |  |
> | Action | Microsoft.Cdn/profiles/endpoints/delete |  |
> | Action | Microsoft.Cdn/profiles/endpoints/Load/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/origins/delete |  |
> | Action | Microsoft.Cdn/profiles/endpoints/origins/read |  |
> | Action | Microsoft.Cdn/profiles/endpoints/origins/write |  |
> | Action | Microsoft.Cdn/profiles/endpoints/Purge/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/read |  |
> | Action | Microsoft.Cdn/profiles/endpoints/Start/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/Stop/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/ValidateCustomDomain/action |  |
> | Action | Microsoft.Cdn/profiles/endpoints/write |  |
> | Action | Microsoft.Cdn/profiles/GenerateSsoUri/action |  |
> | Action | Microsoft.Cdn/profiles/GetSupportedOptimizationTypes/action |  |
> | Action | Microsoft.Cdn/profiles/read |  |
> | Action | Microsoft.Cdn/profiles/write |  |
> | Action | Microsoft.Cdn/register/action | Registers the subscription for the CDN resource provider and enables the creation of CDN profiles. |
> | Action | Microsoft.Cdn/ValidateProbe/action |  |

## Microsoft.CertificateRegistration

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.CertificateRegistration/certificateOrders/certificates/Delete | Delete an existing certificate |
> | Action | Microsoft.CertificateRegistration/certificateOrders/certificates/Read | Get the list of certificates |
> | Action | Microsoft.CertificateRegistration/certificateOrders/certificates/Write | Add a new certificate or update an existing one |
> | Action | Microsoft.CertificateRegistration/certificateOrders/Delete | Delete an existing AppServiceCertificate |
> | Action | Microsoft.CertificateRegistration/certificateOrders/Read | Get the list of CertificateOrders |
> | Action | Microsoft.CertificateRegistration/certificateOrders/reissue/Action | Reissue an existing certificateorder |
> | Action | Microsoft.CertificateRegistration/certificateOrders/renew/Action | Renew an existing certificateorder |
> | Action | Microsoft.CertificateRegistration/certificateOrders/resendEmail/Action | Resend certificate email |
> | Action | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | Resend request emails to another email address |
> | Action | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | Retrieve site seal for an issued App Service Certificate |
> | Action | Microsoft.CertificateRegistration/certificateOrders/retrieveCertificateActions/Action | Retrieve the list of certificate actions |
> | Action | Microsoft.CertificateRegistration/certificateOrders/retrieveEmailHistory/Action | Retrieve certificate email history |
> | Action | Microsoft.CertificateRegistration/certificateOrders/verifyDomainOwnership/Action | Verify domain ownership |
> | Action | Microsoft.CertificateRegistration/certificateOrders/Write | Add a new certificateOrder or update an existing one |
> | Action | Microsoft.CertificateRegistration/operations/Read | List all operations from app service certificate registration |
> | Action | Microsoft.CertificateRegistration/provisionGlobalAppServicePrincipalInUserTenant/Action | Provision service principal for service app principal |
> | Action | Microsoft.CertificateRegistration/register/action | Register the Microsoft Certificates resource provider for the subscription |
> | Action | Microsoft.CertificateRegistration/validateCertificateRegistrationInformation/Action | Validate certificate purchase object without submitting it |

## Microsoft.ClassicCompute

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ClassicCompute/capabilities/read | Shows the capabilities |
> | Action | Microsoft.ClassicCompute/checkDomainNameAvailability/action | Checks the availability of a given domain name. |
> | Action | Microsoft.ClassicCompute/checkDomainNameAvailability/read | Gets the availability of a given domain name. |
> | Action | Microsoft.ClassicCompute/domainNames/active/write | Sets the active domain name. |
> | Action | Microsoft.ClassicCompute/domainNames/availabilitySets/read | Show the availability set for the resource. |
> | Action | Microsoft.ClassicCompute/domainNames/capabilities/read | Shows the domain name capabilities |
> | Action | Microsoft.ClassicCompute/domainNames/delete | Remove the domain names for resources. |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/read | Shows the deployment slots. |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/read | Get role on deployment slot of domain name |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/roleinstances/read | Get role instance for role on deployment slot of domain name |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/state/read | Get the deployment slot state. |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/state/write | Add the deployment slot state. |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/read | Get upgrade domain for deployment slot on domain name |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/write | Update upgrade domain for deployment slot on domain name |
> | Action | Microsoft.ClassicCompute/domainNames/deploymentslots/write | Creates or update the deployment. |
> | Action | Microsoft.ClassicCompute/domainNames/extensions/delete | Remove the domain name extensions. |
> | Action | Microsoft.ClassicCompute/domainNames/extensions/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Action | Microsoft.ClassicCompute/domainNames/extensions/read | Returns the domain name extensions. |
> | Action | Microsoft.ClassicCompute/domainNames/extensions/write | Add the domain name extensions. |
> | Action | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/delete | Remove a new internal load balance. |
> | Action | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/operationStatuses/read | Reads the operation status for the domain names internal load balancers. |
> | Action | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/read | Gets the internal load balancers. |
> | Action | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/write | Creates a new internal load balance. |
> | Action | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/operationStatuses/read | Reads the operation status for the domain names load balanced endpoint sets. |
> | Action | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/read | Get the load balanced endpoint sets. |
> | Action | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/write | Add the load balanced endpoint set. |
> | Action | Microsoft.ClassicCompute/domainNames/operationstatuses/read | Get operation status of the domain name. |
> | Action | Microsoft.ClassicCompute/domainNames/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Action | Microsoft.ClassicCompute/domainNames/read | Return the domain names for resources. |
> | Action | Microsoft.ClassicCompute/domainNames/serviceCertificates/delete | Delete the service certificates used. |
> | Action | Microsoft.ClassicCompute/domainNames/serviceCertificates/operationStatuses/read | Reads the operation status for the domain names service certificates. |
> | Action | Microsoft.ClassicCompute/domainNames/serviceCertificates/read | Returns the service certificates used. |
> | Action | Microsoft.ClassicCompute/domainNames/serviceCertificates/write | Add or modify the service certificates used. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/abortMigration/action | Aborts migration of a deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/commitMigration/action | Commits migration of a deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/delete | Deletes a given deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/operationStatuses/read | Reads the operation status for the domain names slots. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/prepareMigration/action | Prepares migration of a deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/read | Shows the deployment slots. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/delete | Remove the extension reference for the deployment slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/operationStatuses/read | Reads the operation status for the domain names slots roles extension references. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/read | Returns the extension reference for the deployment slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/write | Add or modify the extension reference for the deployment slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/metricdefinitions/read | Get the role metric definition for the domain name. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/metrics/read | Get role metric for the domain name. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/operationstatuses/read | Get the operation status for the domain names slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/read | Get the role for the deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/downloadremotedesktopconnectionfile/action | Downloads remote desktop connection file for the role instance on the domain name slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/operationStatuses/read | Gets the operation status for the role instance on domain names slot role. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/read | Get the role instance. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/rebuild/action | Rebuilds the role instance. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/reimage/action | Reimages the role instance. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/restart/action | Restarts role instances. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/skus/read | Get role sku for the deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/roles/write | Add role for the deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/start/action | Starts a deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/state/start/write | Changes the deployment slot state to stopped. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/state/stop/write | Changes the deployment slot state to started. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/stop/action | Suspends the deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/upgradeDomain/write | Walk upgrade the domain. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/validateMigration/action | Validates migration of a deployment slot. |
> | Action | Microsoft.ClassicCompute/domainNames/slots/write | Creates or update the deployment. |
> | Action | Microsoft.ClassicCompute/domainNames/swap/action | Swaps the staging slot to the production slot. |
> | Action | Microsoft.ClassicCompute/domainNames/write | Add or modify the domain names for resources. |
> | Action | Microsoft.ClassicCompute/moveSubscriptionResources/action | Move all classic resources to a different subscription. |
> | Action | Microsoft.ClassicCompute/operatingSystemFamilies/read | Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family. |
> | Action | Microsoft.ClassicCompute/operatingSystems/read | Lists the versions of the guest operating system that are currently available in Microsoft Azure. |
> | Action | Microsoft.ClassicCompute/operations/read | Gets the list of operations. |
> | Action | Microsoft.ClassicCompute/operationStatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.ClassicCompute/quotas/read | Get the quota for the subscription. |
> | Action | Microsoft.ClassicCompute/register/action | Register to Classic Compute |
> | Action | Microsoft.ClassicCompute/resourceTypes/skus/read | Gets the Sku list for supported resource types. |
> | Action | Microsoft.ClassicCompute/validateSubscriptionMoveAvailability/action | Validate the subscription's availability for classic move operation. |
> | Action | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Action | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/read | Gets the network security group associated with the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/write | Adds a network security group associated with the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/asyncOperations/read | Gets the possible async operations |
> | Action | Microsoft.ClassicCompute/virtualMachines/attachDisk/action | Attaches a data disk to a virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/capture/action | Capture a virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/delete | Removes virtual machines. |
> | Action | Microsoft.ClassicCompute/virtualMachines/detachDisk/action | Detaches a data disk from virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/diagnosticsettings/read | Get virtual machine diagnostics settings. |
> | Action | Microsoft.ClassicCompute/virtualMachines/disks/read | Retrieves list of data disks |
> | Action | Microsoft.ClassicCompute/virtualMachines/downloadRemoteDesktopConnectionFile/action | Downloads the RDP file for virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/extensions/operationStatuses/read | Reads the operation status for the virtual machines extensions. |
> | Action | Microsoft.ClassicCompute/virtualMachines/extensions/read | Gets the virtual machine extension. |
> | Action | Microsoft.ClassicCompute/virtualMachines/extensions/write | Puts the virtual machine extension. |
> | Action | Microsoft.ClassicCompute/virtualMachines/metricdefinitions/read | Get the virtual machine metric definition. |
> | Action | Microsoft.ClassicCompute/virtualMachines/metrics/read | Gets the metrics. |
> | Action | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the network interface. |
> | Action | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Action | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read | Gets the network security group associated with the network interface. |
> | Action | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write | Adds a network security group associated with the network interface. |
> | Action | Microsoft.ClassicCompute/virtualMachines/operationStatuses/read | Reads the operation status for the virtual machines. |
> | Action | Microsoft.ClassicCompute/virtualMachines/performMaintenance/action | Performs maintenance on the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicCompute/virtualMachines/read | Retrieves list of virtual machines. |
> | Action | Microsoft.ClassicCompute/virtualMachines/redeploy/action | Redeploys the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/restart/action | Restarts virtual machines. |
> | Action | Microsoft.ClassicCompute/virtualMachines/shutdown/action | Shutdown the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/start/action | Start the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/stop/action | Stops the virtual machine. |
> | Action | Microsoft.ClassicCompute/virtualMachines/write | Add or modify virtual machines. |

## Microsoft.ClassicNetwork

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/operationstatuses/read | Get an express route cross connection operation status. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/delete | Delete express route cross connection peering. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/operationstatuses/read | Get an express route cross connection peering operation status. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/read | Get express route cross connection peering. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/peerings/write | Add express route cross connection peering. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/read | Get express route cross connections. |
> | Action | Microsoft.ClassicNetwork/expressroutecrossconnections/write | Add express route cross connections. |
> | Action | Microsoft.ClassicNetwork/gatewaySupportedDevices/read | Retrieves the list of supported devices. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/delete | Deletes the network security group. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/operationStatuses/read | Reads the operation status for the network security group. |
> | Action | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the Network Security Groups Diagnostic Settings |
> | Action | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the Network Security Groups diagnostic settings, this operation is supplemented by insights resource provider. |
> | Action | Microsoft.ClassicNetwork/networksecuritygroups/providers/Microsoft.Insights/logDefinitions/read | Gets the events for network security group |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/read | Gets the network security group. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/delete | Deletes the security rule. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/operationStatuses/read | Reads the operation status for the network security group security rules. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/read | Gets the security rule. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/write | Adds or update a security rule. |
> | Action | Microsoft.ClassicNetwork/networkSecurityGroups/write | Adds a new network security group. |
> | Action | Microsoft.ClassicNetwork/operations/read | Get classic network operations. |
> | Action | Microsoft.ClassicNetwork/quotas/read | Get the quota for the subscription. |
> | Action | Microsoft.ClassicNetwork/register/action | Register to Classic Network |
> | Action | Microsoft.ClassicNetwork/reservedIps/delete | Delete a reserved Ip. |
> | Action | Microsoft.ClassicNetwork/reservedIps/join/action | Join a reserved Ip |
> | Action | Microsoft.ClassicNetwork/reservedIps/link/action | Link a reserved Ip |
> | Action | Microsoft.ClassicNetwork/reservedIps/operationStatuses/read | Reads the operation status for the reserved ips. |
> | Action | Microsoft.ClassicNetwork/reservedIps/read | Gets the reserved Ips |
> | Action | Microsoft.ClassicNetwork/reservedIps/write | Add a new reserved Ip |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/abortMigration/action | Aborts the migration of a Virtual Network |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/capabilities/read | Shows the capabilities |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/checkIPAddressAvailability/action | Checks the availability of a given IP address in a virtual network. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/commitMigration/action | Commits the migration of a Virtual Network |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/delete | Deletes the virtual network. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/delete | Unrevokes a client certificate. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/read | Read the revoked client certificates. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRevokedCertificates/write | Revokes a client certificate. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/delete | Deletes the virtual network gateway client certificate. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/download/action | Downloads certificate by thumbprint. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/listPackage/action | Lists the virtual network gateway certificate package. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/read | Find the client root certificates. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/clientRootCertificates/write | Uploads a new client root certificate. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/connect/action | Connects a site to site gateway connection. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/disconnect/action | Disconnects a site to site gateway connection. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/read | Retrieves the list of connections. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/connections/test/action | Tests a site to site gateway connection. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/delete | Deletes the virtual network gateway. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDeviceConfigurationScript/action | Downloads the device configuration script. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/downloadDiagnostics/action | Downloads the gateway diagnostics. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/listCircuitServiceKey/action | Retrieves the circuit service key. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/listPackage/action | Lists the virtual network gateway package. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/operationStatuses/read | Reads the operation status for the virtual networks gateways. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/packages/read | Gets the virtual network gateway package. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/read | Gets the virtual network gateways. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/startDiagnostics/action | Starts diagnostic for the virtual network gateway. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/stopDiagnostics/action | Stops the diagnostic for the virtual network gateway. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/gateways/write | Adds a virtual network gateway. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/join/action | Joins the virtual network. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/operationStatuses/read | Reads the operation status for the virtual networks. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/peer/action | Peers a virtual network with another virtual network. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/prepareMigration/action | Prepares the migration of a Virtual Network |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/read | Get the virtual network. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/delete | Deletes the remote virtual network peering proxy. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/read | Gets the remote virtual network peering proxy. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/remoteVirtualNetworkPeeringProxies/write | Adds or updates the remote virtual network peering proxy. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the subnet. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual network subnet associated network security group. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/read | Gets the network security group associated with the subnet. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/subnets/associatedNetworkSecurityGroups/write | Adds a network security group associated with the subnet. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/validateMigration/action | Validates the migration of a Virtual Network |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/virtualNetworkPeerings/read | Gets the virtual network peering. |
> | Action | Microsoft.ClassicNetwork/virtualNetworks/write | Add a new virtual network. |

## Microsoft.ClassicStorage

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ClassicStorage/capabilities/read | Shows the capabilities |
> | Action | Microsoft.ClassicStorage/checkStorageAccountAvailability/action | Checks for the availability of a storage account. |
> | Action | Microsoft.ClassicStorage/checkStorageAccountAvailability/read | Get the availability of a storage account. |
> | Action | Microsoft.ClassicStorage/disks/read | Returns the storage account disk. |
> | Action | Microsoft.ClassicStorage/images/operationstatuses/read | Gets Image Operation Status. |
> | Action | Microsoft.ClassicStorage/images/read | Returns the image. |
> | Action | Microsoft.ClassicStorage/operations/read | Gets classic storage operations |
> | Action | Microsoft.ClassicStorage/osImages/read | Returns the operating system image. |
> | Action | Microsoft.ClassicStorage/osPlatformImages/read | Gets the operating system platform image. |
> | Action | Microsoft.ClassicStorage/publicImages/read | Gets the public virtual machine image. |
> | Action | Microsoft.ClassicStorage/quotas/read | Get the quota for the subscription. |
> | Action | Microsoft.ClassicStorage/register/action | Register to Classic Storage |
> | Action | Microsoft.ClassicStorage/storageAccounts/abortMigration/action | Aborts migration of a storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/blobServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/commitMigration/action | Commits migration of a storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/delete | Delete the storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/disks/delete | Deletes a given storage account  disk. |
> | Action | Microsoft.ClassicStorage/storageAccounts/disks/operationStatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.ClassicStorage/storageAccounts/disks/read | Returns the storage account disk. |
> | Action | Microsoft.ClassicStorage/storageAccounts/disks/write | Adds a storage account disk. |
> | Action | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/fileServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/images/delete | Deletes a given storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Action | Microsoft.ClassicStorage/storageAccounts/images/operationstatuses/read | Returns the storage account image operation status. |
> | Action | Microsoft.ClassicStorage/storageAccounts/images/read | Returns the storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Action | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Action | Microsoft.ClassicStorage/storageAccounts/operationStatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.ClassicStorage/storageAccounts/osImages/delete | Deletes a given storage account operating system image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/osImages/read | Returns the storage account operating system image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/osImages/write | Adds a given storage account operating system image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/prepareMigration/action | Prepares migration of a storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/queueServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/regenerateKey/action | Regenerates the existing access keys for the storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/services/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/services/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/services/metrics/read | Gets the metrics. |
> | Action | Microsoft.ClassicStorage/storageAccounts/services/read | Get the available services. |
> | Action | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.ClassicStorage/storageAccounts/tableServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Action | Microsoft.ClassicStorage/storageAccounts/validateMigration/action | Validates migration of a storage account. |
> | Action | Microsoft.ClassicStorage/storageAccounts/vmImages/delete | Deletes a given virtual machine image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/vmImages/operationstatuses/read | Gets a given virtual machine image operation status. |
> | Action | Microsoft.ClassicStorage/storageAccounts/vmImages/read | Returns the virtual machine image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/vmImages/write | Adds a given virtual machine image. |
> | Action | Microsoft.ClassicStorage/storageAccounts/write | Adds a new storage account. |
> | Action | Microsoft.ClassicStorage/vmImages/read | Lists virtual machine images. |

## Microsoft.CognitiveServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | DataAction | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/entire/detect/action | This operation generates a model using an entire series, each point is detected with the same model.<br>With this method, points before and after a certain point are used to determine whether it is an anomaly.<br>The entire detection can give the user an overall status of the time series. |
> | DataAction | Microsoft.CognitiveServices/accounts/AnomalyDetector/timeseries/last/detect/action | This operation generates a model using points before the latest one. With this method, only historical points are used to determine whether the target point is an anomaly. The latest point detecting matches the scenario of real-time monitoring of business metrics. |
> | DataAction | Microsoft.CognitiveServices/accounts/Autosuggest/search/action | This operation provides suggestions for a given query or partial query. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/analyze/action | This operation extracts a rich set of visual features based on the image content.  |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/areaofinterest/action | This operation returns a bounding box around the most important area of the image. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/describe/action | This operation generates a description of an image in human readable language with complete sentences.<br> The description is based on a collection of content tags, which are also returned by the operation.<br>More than one description can be generated for each image.<br> Descriptions are ordered by their confidence score.<br>All descriptions are in English. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/detect/action | This operation Performs object detection on the specified image.  |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/generatethumbnail/action | This operation generates a thumbnail image with the user-specified width and height.<br> By default, the service analyzes the image, identifies the region of interest (ROI), and generates smart cropping coordinates based on the ROI.<br> Smart cropping helps when you specify an aspect ratio that differs from that of the input image |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/models/analyze/action | This operation recognizes content within an image by applying a domain-specific model.<br> The list of domain-specific models that are supported by the Computer Vision API can be retrieved using the /models GET request.<br> Currently, the API provides following domain-specific models: celebrities, landmarks. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/models/read | This operation returns the list of domain-specific models that are supported by the Computer Vision API.  Currently, the API supports following domain-specific models: celebrity recognizer, landmark recognizer. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/ocr/action | Optical Character Recognition (OCR) detects text in an image and extracts the recognized characters into a machine-usable character stream.    |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyze/action | Use this interface to perform a Read operation, employing the state-of-the-art Optical Character Recognition (OCR) algorithms optimized for text-heavy documents.<br>It can handle hand-written, printed or mixed documents.<br>When you use the Read interface, the response contains a header called 'Operation-Location'.<br>The 'Operation-Location' header contains the URL that you must use for your Get Read Result operation to access OCR results. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/read/analyzeresults/read | Use this interface to retrieve the status and OCR result of a Read operation.  The URL containing the 'operationId' is returned in the Read operation 'Operation-Location' response header. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/read/core/asyncbatchanalyze/action | Use this interface to get the result of a Batch Read File operation, employing the state-of-the-art Optical Character |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/read/operations/read | This interface is used for getting OCR results of Read operation. The URL to this interface should be retrieved from <b>"Operation-Location"</b> field returned from Batch Read File interface. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/recognizetext/action | Use this interface to get the result of a Recognize Text operation. When you use the Recognize Text interface, the response contains a field called “Operation-Location”. The “Operation-Location” field contains the URL that you must use for your Get Recognize Text Operation Result operation. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/tag/action | This operation generates a list of words, or tags, that are relevant to the content of the supplied image.<br>The Computer Vision API can return tags based on objects, living beings, scenery or actions found in images.<br>Unlike categories, tags are not organized according to a hierarchical classification system, but correspond to image content.<br>Tags may contain hints to avoid ambiguity or provide context, for example the tag “cello” may be accompanied by the hint “musical instrument”.<br>All tags are in English. |
> | DataAction | Microsoft.CognitiveServices/accounts/ComputerVision/textoperations/read | This interface is used for getting recognize text operation result. The URL to this interface should be retrieved from <b>“Operation-Location”</b> field returned from Recognize Text interface. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/action | Create image list. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/delete | Image Lists - Delete |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/delete | Delete an Image from your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. Delete all images from your list. The image list can be used to do fuzzy matching against other images when using Image/Match API.* |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/read | Image - Get all Image Ids |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/images/write | Add an Image to your image list. The image list can be used to do fuzzy matching against other images when using Image/Match API. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/read | Image Lists -  Get Details - Image Lists - Get All |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/refreshindex/action | Image Lists - Refresh Search Index |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/imagelists/write | Image Lists - Update Details |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/evaluate/action | Returns probabilities of the image containing racy or adult content. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/findfaces/action | Find faces in images. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/match/action | Fuzzily match an image against one of your custom Image Lists.<br>You can create and manage your custom image lists using this API.<br> |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processimage/ocr/action | Returns any text found in the image for the language specified. If no language is specified in input then the detection defaults to English. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/detectlanguage/action | This operation will detect the language of given input content.<br>Returns the ISO 639-3 code for the predominant language comprising the submitted text.<br>Over 110 languages supported. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/processtext/screen/action | The operation detects profanity in more than 100 languages and match against custom and shared blacklists. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/action | A job Id will be returned for the Image content posted on this endpoint.  |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/jobs/read | Get the Job Details for a Job Id. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/accesskey/read | Get the review content access key for your team. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/action | The reviews created would show up for Reviewers on your team. As Reviewers complete reviewing, results of the Review would be POSTED (i.e. HTTP POST) on the specified CallBackEndpoint. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/read | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/frames/write | Use this method to add frames for a video review. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/publish/action | Video reviews are initially created in an unpublished state - which means it is not available for reviewers on your team to review yet. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/read | Returns review details for the review Id passed. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcript/action | This API adds a transcript file (text version of all the words spoken in a video) to a video review. The file should be a valid WebVTT format. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/reviews/transcriptmoderationresult/action | This API adds a transcript screen text result file for a video review. Transcript screen text result file is a result of Screen Text API . In order to generate transcript screen text result file , a transcript file has to be screened for profanity using Screen Text API. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/delete | Delete a template in your team |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/read | Returns an array of review templates provisioned on this team. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/settings/templates/write | Creates or updates the specified template |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/read | Get the details of a specific Workflow on your Team. Get all the Workflows available for you Team* |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/teams/workflows/write | Create a new workflow or update an existing one. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/action | Create term list. |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/bulkupdate/action | Term Lists - Bulk Update |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/delete | Term Lists - Delete |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/read | Term Lists - Get All - Term Lists - Get Details |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/refreshindex/action | Term Lists - Refresh Search Index |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/delete | Term - Delete - Term - Delete All Terms |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/read | Term - Get All Terms |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/terms/write | Term - Add Term |
> | DataAction | Microsoft.CognitiveServices/accounts/ContentModerator/termlists/write | Term Lists - Update Details |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/action | Classify an image and saves the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/image/nostore/action | Classify an image without saving the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/action | Classify an image url and saves the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/classify/iterations/url/nostore/action | Classify an image url without saving the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/action | Detect objects in an image and saves the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/image/nostore/action | Detect objects in an image without saving the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/action | Detect objects in an image url and saves the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/detect/iterations/url/nostore/action | Detect objects in an image url without saving the result. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/domains/read | Get information about a specific domain. Get a list of the available domains.* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/action | Set pool size of Label Proposal. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/labelproposals/setting/read | Get pool size of Label Proposal for this project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/project/migrate/action | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/action | Create a project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/delete | Delete a specific project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/action | This API accepts body content as multipart/form-data and application/octet-stream. When using multipart |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/delete | Delete images from the set of training images. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/files/action | This API accepts a batch of files, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/id/read | This API will return a set of Images for the specified tags and optionally iteration. If no iteration is specified the |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/predictions/action | This API creates a batch of images from predicted images specified. There is a limit of 64 images and 20 tags. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regionproposals/action | This API will get region proposals for an image along with confidences for the region. It returns an empty array if no proposals are found. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/action | This API accepts a batch of image regions, and optionally tags, to update existing images with region information. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/regions/delete | Delete a set of image regions. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/action | This API will fetch untagged images filtered by suggested tags Ids. It returns an empty array if no images are found. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/suggested/count/action | This API takes in tagIds to get count of untagged images per suggested tags for a given threshold. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/action | Associate a set of images with a set of tags. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/tags/delete | Remove a set of tags from a set of images. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/count/read | This API returns the images which have no tags for a given project and optionally an iteration. If no iteration is specified the |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/untagged/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/images/urls/action | This API accepts a batch of urls, and optionally tags, to create images. There is a limit of 64 images and 20 tags. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/delete | Delete a specific iteration of a project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/action | Export a trained iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/export/read | Get the list of exports for a specific iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/count/read | The filtering is on an and/or relationship. For example, if the provided tag ids are for the "Dog" and |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/images/read | This API supports batching and range selection. By default it will only return first 50 images matching images. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/performance/read | Get detailed performance information about an iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/action | Publish a specific iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/publish/delete | Unpublish a specific iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/read | Get a specific iteration. Get iterations for the project.* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/iterations/write | Update a specific iteration. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/delete | Delete a set of predicted images and their associated prediction results. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/predictions/query/action | Get images that were sent to your prediction endpoint. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/image/action | Quick test an image. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/quicktest/url/action | Quick test an image url. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/read | Get a specific project. Get your projects.* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/action | Create a tag for the project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/delete | Delete a tag from the project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/read | Get information about a specific tag. Get the tags for a given project and iteration.* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tags/write | Update a tag. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/tagsandregions/suggestions/action | This API will get suggested tags and regions for an array/batch of untagged images along with confidences for the tags. It returns an empty array if no tags are found. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/train/action | Queues project for training. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/projects/write | Update a specific project. |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/action | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/delete | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/quota/refresh/write | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/prediction/user/read | Get usage for prediction resource for Oxford user |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/resource/tier/read | Get usage for training resource for Azure user |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/usage/training/user/read | Get usage for training resource for Oxford user |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/action | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/delete | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/state/write | Update user state |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/user/tier/write | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/users/read | *NotDefined* |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/delete | Deletes a whitelisted user with specific capability |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/read | Gets a list of whitelisted users with specific capability |
> | DataAction | Microsoft.CognitiveServices/accounts/CustomVision.Prediction/whitelist/write | Updates or creates a user in the whitelist with specific capability |
> | Action | Microsoft.CognitiveServices/accounts/delete | Deletes API accounts |
> | DataAction | Microsoft.CognitiveServices/accounts/EntitySearch/search/action | Get entities and places results for a given query. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/detect/action | Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/facelists/delete | Delete a specified face list. The related face images in the face list will be deleted, too. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/delete | Delete a face from a face list by specified faceListId and persisitedFaceId. The related face image will be deleted, too. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/facelists/persistedfaces/write | Add a face to a specified face list, up to 1,000 faces. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/facelists/read | Retrieve a face list's faceListId, name, userData and faces in the face list. List face lists' faceListId, name and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/facelists/write | Create an empty face list with user-specified faceListId, name and an optional userData. Up to 64 face lists are allowed Update information of a face list, including name and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/findsimilars/action | Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list. faceId |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/group/action | Divide candidate faces into groups based on face similarity. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/identify/action | 1-to-many identification to find the closest matches of the specific query person face from a person group or large person group. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/delete | Delete a specified large face list. The related face images in the large face list will be deleted, too. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/delete | Delete a face from a large face list by specified largeFaceListId and persisitedFaceId. The related face image will be deleted, too. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/read | Retrieve persisted face in large face list by largeFaceListId and persistedFaceId. List faces' persistedFaceId and userData in a specified large face list. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/persistedfaces/write | Add a face to a specified large face list, up to 1,000,000 faces. Update a specified face's userData field in a large face list by its persistedFaceId. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/read | Retrieve a large face list's largeFaceListId, name, userData. List large face lists' information of largeFaceListId, name and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/train/action | Submit a large face list training task. Training is a crucial step that only a trained large face list can use. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/training/read | To check the large face list training status completed or still ongoing. LargeFaceList Training is an asynchronous operation |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largefacelists/write | Create an empty large face list with user-specified largeFaceListId, name and an optional userData. Update information of a large face list, including name and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/delete | Delete an existing large person group with specified personGroupId. Persisted data in this large person group will be deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/action | Create a new person in a specified large person group. To add face to this person, please call |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/delete | Delete an existing person from a large person group. All stored person data, and face images in the person entry will be deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/delete | Delete a face from a person in a large person group. Face data and image related to this face entry will be also deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its largePersonGroupId, personId and persistedFaceId. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/persistedfaces/write | Add a face image to a person into a large person group for face identification or verification. To deal with the image of Update a person persisted face's userData field. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face image. List all persons' information in the specified large person group, including personId, name, userData and persistedFaceIds. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/persons/write | Update name or userData of a person. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/read | Retrieve the information of a large person group, including its name and userData. This API returns large person group information List all existing large person groups's largePesonGroupId, name, and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/train/action | Submit a large person group training task. Training is a crucial step that only a trained large person group can use. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/training/read | To check large person group training status completed or still ongoing. LargePersonGroup Training is an asynchronous operation |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/largepersongroups/write | Create a new large person group with user-specified largePersonGroupId, name, and optional userData. Update an existing large person group's name and userData. The properties keep unchanged if they are not in request body. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/delete | Delete an existing person group with specified personGroupId. Persisted data in this person group will be deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/action | Create a new person in a specified person group. To add face to this person, please call |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/delete | Delete an existing person from a person group. All stored person data, and face images in the person entry will be deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/delete | Delete a face from a person in a person group. Face data and image related to this face entry will be also deleted. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/read | Retrieve person face information. The persisted person face is specified by its personGroupId, personId and persistedFaceId. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/persistedfaces/write | Add a face image to a person into a person group for face identification or verification. To deal with the image of multiple Update a person persisted face's userData field. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/read | Retrieve a person's name and userData, and the persisted faceIds representing the registered person face image. List all persons' information in the specified person group, including personId, name, userData and persistedFaceIds of registered. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/persons/write | Update name or userData of a person. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/read | Retrieve person group name and userData. To get person information under this personGroup, use List person groups's pesonGroupId, name, and userData. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/train/action | Submit a person group training task. Training is a crucial step that only a trained person group can use. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/training/read | To check person group training status completed or still ongoing. PersonGroup Training is an asynchronous operation triggered |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/persongroups/write | Create a new person group with specified personGroupId, name, and user-provided userData. Update an existing person group's name and userData. The properties keep unchanged if they are not in request body. |
> | DataAction | Microsoft.CognitiveServices/accounts/Face/verify/action | Verify whether two faces belong to a same person or whether one face belongs to a person. |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/analyze/action | Extract key-value pairs from a given document. The input document must be of one of the supported content types - 'application/pdf', 'image/jpeg' or 'image/png'. A success response is returned in JSON. |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/delete | Delete model artifacts. |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/keys/read | Retrieve the keys for the model. |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/models/read | Get information about a model. Get information about all trained custom models* |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/custom/train/action | Create and train a custom model.<br>The train request must include a source parameter that is either an externally accessible Azure Storage blob container Uri (preferably a Shared Access Signature Uri) or valid path to a data folder in a locally mounted drive.<br>When local paths are specified, they must follow the Linux/Unix path format and be an absolute path rooted to the input mount configuration |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/asyncbatchanalyze/action | Extract field text and semantic values from a given receipt document. The input image document must be one of the supported content types - JPEG, PNG, BMP, PDF, or TIFF. A success response is a JSON containing a field called 'Operation-Location', which contains the URL for the Get Receipt Result operation to asynchronously retrieve the results. |
> | DataAction | Microsoft.CognitiveServices/accounts/FormRecognizer/prebuilt/receipt/operations/action | Query the status and retrieve the result of an Analyze Receipt operation. The URL to this interface can be obtained from the 'Operation-Location' header in the Analyze Receipt response. |
> | DataAction | Microsoft.CognitiveServices/accounts/ImageSearch/details/action | Returns insights about an image, such as webpages that include the image. |
> | DataAction | Microsoft.CognitiveServices/accounts/ImageSearch/search/action | Get relevant images for a given query. |
> | DataAction | Microsoft.CognitiveServices/accounts/ImageSearch/trending/action | Get currently trending images. |
> | DataAction | Microsoft.CognitiveServices/accounts/ImmersiveReader/getcontentmodelforreader/action | Creates an Immersive Reader session |
> | DataAction | Microsoft.CognitiveServices/accounts/InkRecognizer/recognize/action | Given a set of stroke data analyzes the content and generates a list of recognized entities including recognized text. |
> | Action | Microsoft.CognitiveServices/accounts/listKeys/action | List Keys |
> | DataAction | Microsoft.CognitiveServices/accounts/LUIS/predict/action | Gets the published endpoint prediction for the given query. |
> | DataAction | Microsoft.CognitiveServices/accounts/NewsSearch/categorysearch/action | Returns news for a provided category. |
> | DataAction | Microsoft.CognitiveServices/accounts/NewsSearch/search/action | Get news articles relevant for a given query. |
> | DataAction | Microsoft.CognitiveServices/accounts/NewsSearch/trendingtopics/action | Get trending topics identified by Bing. These are the same topics shown in the banner at the bottom of the Bing home page. |
> | Action | Microsoft.CognitiveServices/accounts/read | Reads API accounts. |
> | Action | Microsoft.CognitiveServices/accounts/regenerateKey/action | Regenerate Key |
> | Action | Microsoft.CognitiveServices/accounts/skus/read | Reads available SKUs for an existing resource. |
> | DataAction | Microsoft.CognitiveServices/accounts/SpellCheck/spellcheck/action | Get result of a spell check query through GET or POST. |
> | DataAction | Microsoft.CognitiveServices/accounts/TextAnalytics/entities/action | The API returns a list of known entities and general named entities (\"Person\", \"Location\", \"Organization\" etc) in a given document. |
> | DataAction | Microsoft.CognitiveServices/accounts/TextAnalytics/keyphrases/action | The API returns a list of strings denoting the key talking points in the input text. |
> | DataAction | Microsoft.CognitiveServices/accounts/TextAnalytics/languages/action | The API returns the detected language and a numeric score between 0 and 1. Scores close to 1 indicate 100% certainty that the identified language is true. A total of 120 languages are supported. |
> | DataAction | Microsoft.CognitiveServices/accounts/TextAnalytics/sentiment/action | The API returns a numeric score between 0 and 1.<br>Scores close to 1 indicate positive sentiment, while scores close to 0 indicate negative sentiment.<br>A score of 0.5 indicates the lack of sentiment (e.g.<br>a factoid statement). |
> | Action | Microsoft.CognitiveServices/accounts/usages/read | Get the quota usage for an existing resource. |
> | DataAction | Microsoft.CognitiveServices/accounts/VideoSearch/details/action | Get insights about a video, such as related videos. |
> | DataAction | Microsoft.CognitiveServices/accounts/VideoSearch/search/action | Get videos relevant for a given query. |
> | DataAction | Microsoft.CognitiveServices/accounts/VideoSearch/trending/action | Get currently trending videos. |
> | DataAction | Microsoft.CognitiveServices/accounts/VisualSearch/search/action | Returns a list of tags relevant to the provided image |
> | DataAction | Microsoft.CognitiveServices/accounts/WebSearch/search/action | Get web, image, news, & videos results for a given query. |
> | Action | Microsoft.CognitiveServices/accounts/write | Writes API Accounts. |
> | Action | Microsoft.CognitiveServices/checkDomainAvailability/action | Reads available SKUs for a subscription. |
> | Action | Microsoft.CognitiveServices/locations/checkSkuAvailability/action | Reads available SKUs for a subscription. |
> | Action | Microsoft.CognitiveServices/locations/checkSkuAvailability/action | Reads available SKUs for a subscription. |
> | Action | Microsoft.CognitiveServices/locations/deleteVirtualNetworkOrSubnets/action | Notification from Microsoft.Network of deleting VirtualNetworks or Subnets. |
> | Action | Microsoft.CognitiveServices/locations/operationresults/read | Read the status of an asynchronous operation. |
> | Action | Microsoft.CognitiveServices/Operations/read | List all available operations |
> | Action | Microsoft.CognitiveServices/register/action | Registers Subscription for Cognitive Services |
> | Action | Microsoft.CognitiveServices/register/action | Registers Subscription for Cognitive Services |

## Microsoft.Commerce

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Commerce/RateCard/read | Returns offer data, resource/meter metadata and rates for the given subscription. |
> | Action | Microsoft.Commerce/register/action | Register Subscription for Microsoft Commerce UsageAggregate |
> | Action | Microsoft.Commerce/unregister/action | Unregister Subscription for Microsoft Commerce UsageAggregate |
> | Action | Microsoft.Commerce/UsageAggregates/read | Retrieves Microsoft Azure’s consumption  by a subscription. The result contains aggregates usage data, subscription and resource related information, on a particular time range. |

## Microsoft.Compute

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Compute/availabilitySets/delete | Deletes the availability set |
> | Action | Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
> | Action | Microsoft.Compute/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | Action | Microsoft.Compute/availabilitySets/write | Creates a new availability set or updates an existing one |
> | Action | Microsoft.Compute/diskEncryptionSets/delete | Delete a disk encryption set |
> | Action | Microsoft.Compute/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | Action | Microsoft.Compute/diskEncryptionSets/write | Create a new disk encryption set or update an existing one |
> | Action | Microsoft.Compute/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
> | Action | Microsoft.Compute/disks/delete | Deletes the Disk |
> | Action | Microsoft.Compute/disks/endGetAccess/action | Revoke the SAS URI of the Disk |
> | Action | Microsoft.Compute/disks/read | Get the properties of a Disk |
> | Action | Microsoft.Compute/disks/write | Creates a new Disk or updates an existing one |
> | Action | Microsoft.Compute/galleries/applications/delete | Deletes the Gallery Application |
> | Action | Microsoft.Compute/galleries/applications/read | Gets the properties of Gallery Application |
> | Action | Microsoft.Compute/galleries/applications/versions/delete | Deletes the Gallery Application Version |
> | Action | Microsoft.Compute/galleries/applications/versions/read | Gets the properties of Gallery Application Version |
> | Action | Microsoft.Compute/galleries/applications/versions/write | Creates a new Gallery Application Version or updates an existing one |
> | Action | Microsoft.Compute/galleries/applications/write | Creates a new Gallery Application or updates an existing one |
> | Action | Microsoft.Compute/galleries/delete | Deletes the Gallery |
> | Action | Microsoft.Compute/galleries/images/delete | Deletes the Gallery Image |
> | Action | Microsoft.Compute/galleries/images/read | Gets the properties of Gallery Image |
> | Action | Microsoft.Compute/galleries/images/versions/delete | Deletes the Gallery Image Version |
> | Action | Microsoft.Compute/galleries/images/versions/read | Gets the properties of Gallery Image Version |
> | Action | Microsoft.Compute/galleries/images/versions/write | Creates a new Gallery Image Version or updates an existing one |
> | Action | Microsoft.Compute/galleries/images/write | Creates a new Gallery Image or updates an existing one |
> | Action | Microsoft.Compute/galleries/read | Gets the properties of Gallery |
> | Action | Microsoft.Compute/galleries/write | Creates a new Gallery or updates an existing one |
> | Action | Microsoft.Compute/hostGroups/delete | Deletes the host group |
> | Action | Microsoft.Compute/hostGroups/hosts/delete | Deletes the host |
> | Action | Microsoft.Compute/hostGroups/hosts/read | Get the properties of a host |
> | Action | Microsoft.Compute/hostGroups/hosts/write | Creates a new host or updates an existing host |
> | Action | Microsoft.Compute/hostGroups/read | Get the properties of a host group |
> | Action | Microsoft.Compute/hostGroups/write | Creates a new host group or updates an existing host group |
> | Action | Microsoft.Compute/images/delete | Deletes the image |
> | Action | Microsoft.Compute/images/read | Get the properties of the Image |
> | Action | Microsoft.Compute/images/write | Creates a new Image or updates an existing one |
> | Action | Microsoft.Compute/locations/capsOperations/read | Gets the status of an asynchronous Caps operation |
> | Action | Microsoft.Compute/locations/diskOperations/read | Gets the status of an asynchronous Disk operation |
> | Action | Microsoft.Compute/locations/logAnalytics/getRequestRateByInterval/action | Create logs to show total requests by time interval to aid throttling diagnostics. |
> | Action | Microsoft.Compute/locations/logAnalytics/getThrottledRequests/action | Create logs to show aggregates of throttled requests grouped by ResourceName, OperationName, or the applied Throttle Policy. |
> | Action | Microsoft.Compute/locations/operations/read | Gets the status of an asynchronous operation |
> | Action | Microsoft.Compute/locations/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer |
> | Action | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku |
> | Action | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version |
> | Action | Microsoft.Compute/locations/publishers/artifacttypes/types/read | Get the properties of a VMExtension Type |
> | Action | Microsoft.Compute/locations/publishers/artifacttypes/types/versions/read | Get the properties of a VMExtension Version |
> | Action | Microsoft.Compute/locations/publishers/read | Get the properties of a Publisher |
> | Action | Microsoft.Compute/locations/runCommands/read | Lists available run commands in location |
> | Action | Microsoft.Compute/locations/usages/read | Gets service limits and current usage quantities for the subscription's compute resources in a location |
> | Action | Microsoft.Compute/locations/vmSizes/read | Lists available virtual machine sizes in a location |
> | Action | Microsoft.Compute/locations/vsmOperations/read | Gets the status of an asynchronous operation for Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Action | Microsoft.Compute/operations/read | Lists operations available on Microsoft.Compute resource provider |
> | Action | Microsoft.Compute/proximityPlacementGroups/delete | Deletes the Proximity Placement Group |
> | Action | Microsoft.Compute/proximityPlacementGroups/read | Get the Properties of a Proximity Placement Group |
> | Action | Microsoft.Compute/proximityPlacementGroups/write | Creates a new Proximity Placement Group or updates an existing one |
> | Action | Microsoft.Compute/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | Action | Microsoft.Compute/restorePointCollections/delete | Deletes the restore point collection and contained restore points |
> | Action | Microsoft.Compute/restorePointCollections/read | Get the properties of a restore point collection |
> | Action | Microsoft.Compute/restorePointCollections/restorePoints/delete | Deletes the restore point |
> | Action | Microsoft.Compute/restorePointCollections/restorePoints/read | Get the properties of a restore point |
> | Action | Microsoft.Compute/restorePointCollections/restorePoints/retrieveSasUris/action | Get the properties of a restore point along with blob SAS URIs |
> | Action | Microsoft.Compute/restorePointCollections/restorePoints/write | Creates a new restore point |
> | Action | Microsoft.Compute/restorePointCollections/write | Creates a new restore point collection or updates an existing one |
> | Action | Microsoft.Compute/sharedVMImages/delete | Deletes the SharedVMImage |
> | Action | Microsoft.Compute/sharedVMImages/read | Get the properties of a SharedVMImage |
> | Action | Microsoft.Compute/sharedVMImages/versions/delete | Delete a SharedVMImageVersion |
> | Action | Microsoft.Compute/sharedVMImages/versions/read | Get the properties of a SharedVMImageVersion |
> | Action | Microsoft.Compute/sharedVMImages/versions/replicate/action | Replicate a SharedVMImageVersion to target regions |
> | Action | Microsoft.Compute/sharedVMImages/versions/write | Create a new SharedVMImageVersion or update an existing one |
> | Action | Microsoft.Compute/sharedVMImages/write | Creates a new SharedVMImage or updates an existing one |
> | Action | Microsoft.Compute/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | Action | Microsoft.Compute/snapshots/beginGetAccess/action | Get the SAS URI of the Snapshot for blob access |
> | Action | Microsoft.Compute/snapshots/delete | Delete a Snapshot |
> | Action | Microsoft.Compute/snapshots/endGetAccess/action | Revoke the SAS URI of the Snapshot |
> | Action | Microsoft.Compute/snapshots/read | Get the properties of a Snapshot |
> | Action | Microsoft.Compute/snapshots/write | Create a new Snapshot or update an existing one |
> | Action | Microsoft.Compute/unregister/action | Unregisters Subscription with Microsoft.Compute resource provider |
> | Action | Microsoft.Compute/virtualMachines/capture/action | Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines |
> | Action | Microsoft.Compute/virtualMachines/convertToManagedDisks/action | Converts the blob based disks of the virtual machine to managed disks |
> | Action | Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | Action | Microsoft.Compute/virtualMachines/delete | Deletes the virtual machine |
> | Action | Microsoft.Compute/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | Action | Microsoft.Compute/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | Action | Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
> | Action | Microsoft.Compute/virtualMachines/generalize/action | Sets the virtual machine state to Generalized and prepares the virtual machine for capture |
> | Action | Microsoft.Compute/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | DataAction | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | DataAction | Microsoft.Compute/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |
> | Action | Microsoft.Compute/virtualMachines/performMaintenance/action | Performs Maintenance Operation on the VM. |
> | Action | Microsoft.Compute/virtualMachines/powerOff/action | Powers off the virtual machine. Note that the virtual machine will continue to be billed. |
> | Action | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Action | Microsoft.Compute/virtualMachines/redeploy/action | Redeploys virtual machine |
> | Action | Microsoft.Compute/virtualMachines/reimage/action | Reimages virtual machine which is using differencing disk. |
> | Action | Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
> | Action | Microsoft.Compute/virtualMachines/runCommand/action | Executes a predefined script on the virtual machine |
> | Action | Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
> | Action | Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | Action | Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | Action | Microsoft.Compute/virtualMachineScaleSets/deallocate/action | Powers off and releases the compute resources for the instances of the Virtual Machine Scale Set  |
> | Action | Microsoft.Compute/virtualMachineScaleSets/delete | Deletes the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/delete/action | Deletes the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/extensions/delete | Deletes the Virtual Machine Scale Set Extension |
> | Action | Microsoft.Compute/virtualMachineScaleSets/extensions/read | Gets the properties of a Virtual Machine Scale Set Extension |
> | Action | Microsoft.Compute/virtualMachineScaleSets/extensions/write | Creates a new Virtual Machine Scale Set Extension or updates an existing one |
> | Action | Microsoft.Compute/virtualMachineScaleSets/forceRecoveryServiceFabricPlatformUpdateDomainWalk/action | Manually walk the platform update domains of a service fabric Virtual Machine Scale Set to finish a pending update that is stuck |
> | Action | Microsoft.Compute/virtualMachineScaleSets/instanceView/read | Gets the instance view of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/manualUpgrade/action | Manually updates instances to latest model of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read | Get properties of all network interfaces of a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/osRollingUpgrade/action | Starts a rolling upgrade to move all Virtual Machine Scale Set instances to the latest available Platform Image OS version. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read | Gets the history of OS upgrades for a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/performMaintenance/action | Performs planned maintenance on the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/powerOff/action | Powers off the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read | Get properties of all public IP addresses of a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/read | Get the properties of a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/redeploy/action | Redeploy the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/reimage/action | Reimages the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for the instances of a Virtual Machine Scale Set  |
> | Action | Microsoft.Compute/virtualMachineScaleSets/restart/action | Restarts the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/cancel/action | Cancels the rolling upgrade of a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read | Get latest Rolling Upgrade status for a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/scale/action | Verify if an existing Virtual Machine Scale Set can Scale In/Scale Out to specified instance count |
> | Action | Microsoft.Compute/virtualMachineScaleSets/skus/read | Lists the valid SKUs for an existing Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/start/action | Starts the instances of the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/deallocate/action | Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete | Delete a specific Virtual Machine in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read | Retrieves the instance view of a Virtual Machine in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read | Get properties of public IP address created using Virtual Machine Scale Set. Virtual Machine Scale Set can create at most one public IP per ipconfiguration (private IP) |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read | Get properties of one or all IP configurations of a network interface created using Virtual Machine Scale Set. IP configurations represent private IPs |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read | Get properties of one or all network interfaces of a virtual machine created using Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/performMaintenance/action | Performs planned maintenance on a Virtual Machine instance in a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/powerOff/action | Powers Off a Virtual Machine instance in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read | Retrieves the properties of a Virtual Machine in a VM Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/redeploy/action | Redeploys a Virtual Machine instance in a Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimage/action | Reimages a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for Virtual Machine instance in a Virtual Machine Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/restart/action | Restarts a Virtual Machine instance in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommand/action | Executes a predefined script on a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/start/action | Starts a Virtual Machine instance in a VM Scale Set. |
> | Action | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/write | Updates the properties of a Virtual Machine in a VM Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/vmSizes/read | List available sizes for creating or updating a virtual machine in the Virtual Machine Scale Set |
> | Action | Microsoft.Compute/virtualMachineScaleSets/write | Creates a new Virtual Machine Scale Set or updates an existing one |

## Microsoft.Consumption

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Consumption/aggregatedcost/read | List AggregatedCost for management group. |
> | Action | Microsoft.Consumption/balances/read | List the utilization summary for a billing period for a management group. |
> | Action | Microsoft.Consumption/budgets/delete | Delete the budgets by a subscription or a management group. |
> | Action | Microsoft.Consumption/budgets/read | List the budgets by a subscription or a management group. |
> | Action | Microsoft.Consumption/budgets/write | Creates and update the budgets by a subscription or a management group. |
> | Action | Microsoft.Consumption/charges/read | List charges |
> | Action | Microsoft.Consumption/credits/read | List credits |
> | Action | Microsoft.Consumption/events/read | List events |
> | Action | Microsoft.Consumption/externalBillingAccounts/tags/read | List tags for EA and subscriptions. |
> | Action | Microsoft.Consumption/externalSubscriptions/tags/read | List tags for EA and subscriptions. |
> | Action | Microsoft.Consumption/forecasts/read | List forecasts |
> | Action | Microsoft.Consumption/lots/read | List lots |
> | Action | Microsoft.Consumption/marketplaces/read | List the marketplace resource usage details for a scope for EA and WebDirect subscriptions. |
> | Action | Microsoft.Consumption/operationresults/read | List operationresults |
> | Action | Microsoft.Consumption/operations/read | List all supported operations by Microsoft.Consumption resource provider. |
> | Action | Microsoft.Consumption/operationstatus/read | List operationstatus |
> | Action | Microsoft.Consumption/pricesheets/read | List the Pricesheets data for a subscription or a management group. |
> | Action | Microsoft.Consumption/register/action | Register to Consumption RP |
> | Action | Microsoft.Consumption/reservationDetails/read | List the utilization details for reserved instances by reservation order or management groups. The details data is per instance per day level. |
> | Action | Microsoft.Consumption/reservationRecommendations/read | List single or shared recommendations for Reserved instances for a subscription. |
> | Action | Microsoft.Consumption/reservationSummaries/read | List the utilization summary for reserved instances by reservation order or management groups. The summary data is either at monthly or daily level. |
> | Action | Microsoft.Consumption/reservationTransactions/read | List the transaction history for reserved instances by management groups. |
> | Action | Microsoft.Consumption/tags/read | List tags for EA and subscriptions. |
> | Action | Microsoft.Consumption/tenants/read | List tenants |
> | Action | Microsoft.Consumption/tenants/register/action | Register action for scope of Microsoft.Consumption by a tenant. |
> | Action | Microsoft.Consumption/terms/read | List the terms for a subscription or a management group. |
> | Action | Microsoft.Consumption/usageDetails/read | List the usage details for a scope for EA and WebDirect subscriptions. |

## Microsoft.ContainerInstance

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ContainerInstance/containerGroups/containers/buildlogs/read | Get build logs for a specific container. |
> | Action | Microsoft.ContainerInstance/containerGroups/containers/exec/action | Exec into a specific container. |
> | Action | Microsoft.ContainerInstance/containerGroups/containers/logs/read | Get logs for a specific container. |
> | Action | Microsoft.ContainerInstance/containerGroups/delete | Delete the specific container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/operationResults/read | Get async operation result |
> | Action | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/read | Get all container groups. |
> | Action | Microsoft.ContainerInstance/containerGroups/restart/action | Restarts a specific container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/start/action | Starts a specific container group. |
> | Action | Microsoft.ContainerInstance/containerGroups/stop/action | Stops a specific container group. Compute resources will be deallocated and billing will stop. |
> | Action | Microsoft.ContainerInstance/containerGroups/write | Create or update a specific container group. |
> | Action | Microsoft.ContainerInstance/locations/cachedImages/read | Gets the cached images for the subscription in a region. |
> | Action | Microsoft.ContainerInstance/locations/capabilities/read | Get the capabilities for a region. |
> | Action | Microsoft.ContainerInstance/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerInstance that virtual network or subnet is being deleted. |
> | Action | Microsoft.ContainerInstance/locations/operations/read | List the operations for Azure Container Instance service. |
> | Action | Microsoft.ContainerInstance/locations/usages/read | Get the usage for a specific region. |
> | Action | Microsoft.ContainerInstance/operations/read | List the operations for Azure Container Instance service. |
> | Action | Microsoft.ContainerInstance/register/action | Registers the subscription for the container instance resource provider and enables the creation of container groups. |
> | Action | Microsoft.ContainerInstance/serviceassociationlinks/delete | Delete the service association link created by azure container instance resource provider on a subnet. |

## Microsoft.ContainerRegistry

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ContainerRegistry/checkNameAvailability/read | Checks whether the container registry name is available for use. |
> | Action | Microsoft.ContainerRegistry/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.ContainerRegistry that virtual network or subnet is being deleted |
> | Action | Microsoft.ContainerRegistry/locations/operationResults/read | Gets an async operation result |
> | Action | Microsoft.ContainerRegistry/operations/read | Lists all of the available Azure Container Registry REST API operations |
> | Action | Microsoft.ContainerRegistry/register/action | Registers the subscription for the container registry resource provider and enables the creation of container registries. |
> | Action | Microsoft.ContainerRegistry/registries/artifacts/delete | Delete artifact in a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/builds/cancel/action | Cancels an existing build. |
> | Action | Microsoft.ContainerRegistry/registries/builds/getLogLink/action | Gets a link to download the build logs. |
> | Action | Microsoft.ContainerRegistry/registries/builds/read | Gets the properties of the specified build or lists all the builds for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/builds/write | Updates a build for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/delete | Deletes a build task from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/listSourceRepositoryProperties/action | Lists the source control properties for a build task. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/read | Gets the properties of the specified build task or lists all the build tasks for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/steps/delete | Deletes a build step from a build task. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/steps/listBuildArguments/action | Lists the build arguments for a build step including the secret arguments. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/steps/read | Gets the properties of the specified build step or lists all the build steps for the specified build task. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/steps/write | Creates or updates a build step for a build task with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/buildTasks/write | Creates or updates a build task for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/delete | Deletes a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/eventGridFilters/delete | Deletes an event grid filter from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/eventGridFilters/read | Gets the properties of the specified event grid filter or lists all the event grid filters for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/eventGridFilters/write | Creates or updates an event grid filter for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/generateCredentials/action | Generate keys for a token of a specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/getBuildSourceUploadUrl/action | Gets the upload location for the user to be able to upload the source. |
> | Action | Microsoft.ContainerRegistry/registries/importImage/action | Import Image to container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/listBuildSourceUploadUrl/action | Get source upload url location for a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/listCredentials/action | Lists the login credentials for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/listPolicies/read | Lists the policies for the specified container registry |
> | Action | Microsoft.ContainerRegistry/registries/listUsages/read | Lists the quota usages for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/metadata/read | Gets the metadata of a specific repository for a container registry |
> | Action | Microsoft.ContainerRegistry/registries/metadata/write | Updates the metadata of a repository for a container registry |
> | Action | Microsoft.ContainerRegistry/registries/operationStatuses/read | Gets a registry async operation status |
> | Action | Microsoft.ContainerRegistry/registries/pull/read | Pull or Get images from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/push/write | Push or Write images to a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | Action | Microsoft.ContainerRegistry/registries/quarantine/write | Write/Modify quarantine state of quarantined images |
> | Action | Microsoft.ContainerRegistry/registries/queueBuild/action | Creates a new build based on the request parameters and add it to the build queue. |
> | Action | Microsoft.ContainerRegistry/registries/read | Gets the properties of the specified container registry or lists all the container registries under the specified resource group or subscription. |
> | Action | Microsoft.ContainerRegistry/registries/regenerateCredential/action | Regenerates one of the login credentials for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/replications/delete | Deletes a replication from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/replications/operationStatuses/read | Gets a replication async operation status |
> | Action | Microsoft.ContainerRegistry/registries/replications/read | Gets the properties of the specified replication or lists all the replications for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/replications/write | Creates or updates a replication for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/runs/cancel/action | Cancel an existing run. |
> | Action | Microsoft.ContainerRegistry/registries/runs/listLogSasUrl/action | Gets the log SAS URL for a run. |
> | Action | Microsoft.ContainerRegistry/registries/runs/read | Gets the properties of a run against a container registry or list runs. |
> | Action | Microsoft.ContainerRegistry/registries/runs/write | Updates a run. |
> | Action | Microsoft.ContainerRegistry/registries/scheduleRun/action | Schedule a run against a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/scopeMaps/delete | Deletes a scope map from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/scopeMaps/operationStatuses/read | Gets a scope map async operation status. |
> | Action | Microsoft.ContainerRegistry/registries/scopeMaps/read | Gets the properties of the specified scope map or lists all the scope maps for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/scopeMaps/write | Creates or updates a scope map for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/sign/write | Push/Pull content trust metadata for a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tasks/delete | Deletes a task for a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tasks/listDetails/action | List all details of a task for a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tasks/read | Gets a task for a container registry or list all tasks. |
> | Action | Microsoft.ContainerRegistry/registries/tasks/write | Creates or Updates a task for a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tokens/delete | Deletes a token from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tokens/operationStatuses/read | Gets a token async operation status. |
> | Action | Microsoft.ContainerRegistry/registries/tokens/read | Gets the properties of the specified token or lists all the tokens for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/tokens/write | Creates or updates a token for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/updatePolicies/write | Updates the policies for the specified container registry |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/delete | Deletes a webhook from a container registry. |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/getCallbackConfig/action | Gets the configuration of service URI and custom headers for the webhook. |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/listEvents/action | Lists recent events for the specified webhook. |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/operationStatuses/read | Gets a webhook async operation status |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/ping/action | Triggers a ping event to be sent to the webhook. |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/read | Gets the properties of the specified webhook or lists all the webhooks for the specified container registry. |
> | Action | Microsoft.ContainerRegistry/registries/webhooks/write | Creates or updates a webhook for a container registry with the specified parameters. |
> | Action | Microsoft.ContainerRegistry/registries/write | Creates or updates a container registry with the specified parameters. |

## Microsoft.ContainerService

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ContainerService/containerServices/delete | Deletes a container service |
> | Action | Microsoft.ContainerService/containerServices/read | Get a container service |
> | Action | Microsoft.ContainerService/containerServices/write | Creates a new container service or updates an existing one |
> | Action | Microsoft.ContainerService/locations/operationresults/read | Gets the status of an asynchronous operation result |
> | Action | Microsoft.ContainerService/locations/operations/read | Gets the status of an asynchronous operation |
> | Action | Microsoft.ContainerService/locations/orchestrators/read | Lists the supported orchestrators |
> | Action | Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action | Get a managed cluster access profile by role name using list credential |
> | Action | Microsoft.ContainerService/managedClusters/accessProfiles/read | Get a managed cluster access profile by role name |
> | Action | Microsoft.ContainerService/managedClusters/agentPools/delete | Deletes an agent pool |
> | Action | Microsoft.ContainerService/managedClusters/agentPools/read | Gets an agent pool |
> | Action | Microsoft.ContainerService/managedClusters/agentPools/upgradeProfiles/read | Gets the upgrade profile of the Agent Pool |
> | Action | Microsoft.ContainerService/managedClusters/agentPools/write | Creates a new agent pool or updates an existing one |
> | Action | Microsoft.ContainerService/managedClusters/availableAgentPoolVersions/read | Gets the available agent pool versions of the cluster |
> | Action | Microsoft.ContainerService/managedClusters/delete | Deletes a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/detectors/read | Get Managed Cluster Detector |
> | Action | Microsoft.ContainerService/managedClusters/diagnosticsState/read | Gets the diagnostics state of the cluster |
> | Action | Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List the clusterAdmin credential of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/listClusterMonitoringUserCredential/action | List the clusterMonitoringUser credential of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Action | Microsoft.ContainerService/managedClusters/read | Get a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/resetAADProfile/action | Reset the AAD profile of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/resetServicePrincipalProfile/action | Reset the service principal profile of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/rotateClusterCertificates/action | Rotate certificates of a managed cluster |
> | Action | Microsoft.ContainerService/managedClusters/upgradeProfiles/read | Gets the upgrade profile of the cluster |
> | Action | Microsoft.ContainerService/managedClusters/write | Creates a new managed cluster or updates an existing one |
> | Action | Microsoft.ContainerService/openShiftClusters/delete | Delete an Open Shift Cluster |
> | Action | Microsoft.ContainerService/openShiftClusters/read | Get an Open Shift Cluster |
> | Action | Microsoft.ContainerService/openShiftClusters/write | Creates a new Open Shift Cluster or updates an existing one |
> | Action | Microsoft.ContainerService/openShiftManagedClusters/delete | Delete an Open Shift Managed Cluster |
> | Action | Microsoft.ContainerService/openShiftManagedClusters/read | Get an Open Shift Managed Cluster |
> | Action | Microsoft.ContainerService/openShiftManagedClusters/write | Creates a new Open Shift Managed Cluster or updates an existing one |
> | Action | Microsoft.ContainerService/operations/read | Lists operations available on Microsoft.ContainerService resource provider |
> | Action | Microsoft.ContainerService/register/action | Registers Subscription with Microsoft.ContainerService resource provider |
> | Action | Microsoft.ContainerService/unregister/action | Unregisters Subscription with Microsoft.ContainerService resource provider |

## Microsoft.CostManagement

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.CostManagement/alerts/write | Update alerts. |
> | Action | Microsoft.CostManagement/cloudConnectors/delete | Delete the specified cloudConnector. |
> | Action | Microsoft.CostManagement/cloudConnectors/read | List the cloudConnectors for the authenticated user. |
> | Action | Microsoft.CostManagement/cloudConnectors/write | Create or update the specified cloudConnector. |
> | Action | Microsoft.CostManagement/dimensions/read | List all supported dimensions by a scope. |
> | Action | Microsoft.CostManagement/exports/action | Run the specified export. |
> | Action | Microsoft.CostManagement/exports/delete | Delete the specified export. |
> | Action | Microsoft.CostManagement/exports/read | List the exports by scope. |
> | Action | Microsoft.CostManagement/exports/run/action | Run exports. |
> | Action | Microsoft.CostManagement/exports/write | Create or update the specified export. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/dimension/read | List all supported dimensions for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/externalSubscriptions/read | List the externalSubscriptions within an externalBillingAccount for the authenticated user. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/forecast/action | Forecast usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/forecast/read | Forecast usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/query/action | Query usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/query/read | Query usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalBillingAccounts/read | List the externalBillingAccounts for the authenticated user. |
> | Action | Microsoft.CostManagement/externalSubscriptions/dimensions/read | List all supported dimensions for external subscription. |
> | Action | Microsoft.CostManagement/externalSubscriptions/forecast/action | Forecast usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalSubscriptions/forecast/read | Forecast usage data for external BillingAccounts. |
> | Action | Microsoft.CostManagement/externalSubscriptions/query/action | Query usage data for external subscription. |
> | Action | Microsoft.CostManagement/externalSubscriptions/query/read | Query usage data for external subscription. |
> | Action | Microsoft.CostManagement/externalSubscriptions/read | List the externalSubscriptions for the authenticated user. |
> | Action | Microsoft.CostManagement/externalSubscriptions/write | Update associated management group of externalSubscription |
> | Action | Microsoft.CostManagement/forecast/action | Forecast usage data by a scope. |
> | Action | Microsoft.CostManagement/forecast/read | Forecast usage data by a scope. |
> | Action | Microsoft.CostManagement/operations/read | List all supported operations by Microsoft.CostManagement resource provider. |
> | Action | Microsoft.CostManagement/query/action | Query usage data by a scope. |
> | Action | Microsoft.CostManagement/query/read | Query usage data by a scope. |
> | Action | Microsoft.CostManagement/register/action | Register action for scope of Microsoft.CostManagement by a subscription. |
> | Action | Microsoft.CostManagement/reports/action | Schedule reports on usage data by a scope. |
> | Action | Microsoft.CostManagement/reports/read | Schedule reports on usage data by a scope. |
> | Action | Microsoft.CostManagement/tenants/register/action | Register action for scope of Microsoft.CostManagement by a tenant. |
> | Action | Microsoft.CostManagement/views/action | Create view. |
> | Action | Microsoft.CostManagement/views/delete | Delete saved views. |
> | Action | Microsoft.CostManagement/views/read | List all saved views. |
> | Action | Microsoft.CostManagement/views/write | Update view. |

## Microsoft.DataBox

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataBox/jobs/bookShipmentPickUp/action | Allows to book a pick up for return shipments. |
> | Action | Microsoft.DataBox/jobs/cancel/action | Cancels an order in progress. |
> | Action | Microsoft.DataBox/jobs/delete | Delete the Orders |
> | Action | Microsoft.DataBox/jobs/listCredentials/action | Lists the unencrypted credentials related to the order. |
> | Action | Microsoft.DataBox/jobs/read | List or get the Orders |
> | Action | Microsoft.DataBox/jobs/write | Create or update the Orders |
> | Action | Microsoft.DataBox/locations/availableSkus/action | This method returns the list of available skus. |
> | Action | Microsoft.DataBox/locations/availableSkus/read | List or get the Available Skus |
> | Action | Microsoft.DataBox/locations/operationResults/read | List or get the Operation Results |
> | Action | Microsoft.DataBox/locations/regionConfiguration/action | This method returns the configurations for the region. |
> | Action | Microsoft.DataBox/locations/validateAddress/action | Validates the shipping address and provides alternate addresses if any. |
> | Action | Microsoft.DataBox/locations/validateInputs/action | This method does all type of validations. |
> | Action | Microsoft.DataBox/operations/read | List or get the Operations |
> | Action | Microsoft.DataBox/register/action | Register Provider Microsoft.Databox |
> | Action | Microsoft.DataBox/subscriptions/resourceGroups/moveResources/action | This method performs the resource move. |
> | Action | Microsoft.DataBox/subscriptions/resourceGroups/validateMoveResources/action | This method validates whether resource move is allowed or not. |
> | Action | Microsoft.DataBox/unregister/action | Un-Register Provider Microsoft.Databox |

## Microsoft.DataBoxEdge

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/alerts/read | Lists or gets the alerts |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/delete | Deletes the bandwidth schedules |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/read | Lists or gets the bandwidth schedules |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/read | Lists or gets the bandwidth schedules |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/bandwidthSchedules/write | Creates or updates the bandwidth schedules |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/delete | Deletes the Data Box Edge devices |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/downloadUpdates/action | Download Updates in device |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/getExtendedInformation/action | Retrieves resource extended information |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/installUpdates/action | Install Updates on device |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/jobs/read | Lists or gets the jobs |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/networkSettings/read | Lists or gets the Device network settings |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/nodes/read | Lists or gets the nodes |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/operationsStatus/read | Lists or gets the operation status |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/delete | Deletes the orders |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/read | Lists or gets the orders |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/read | Lists or gets the orders |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/orders/write | Creates or updates the orders |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/read | Lists or gets the Data Box Edge devices |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/delete | Deletes the roles |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/read | Lists or gets the roles |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/read | Lists or gets the roles |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/roles/write | Creates or updates the roles |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/scanForUpdates/action | Scan for updates |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/securitySettings/update/action | Update security settings |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/delete | Deletes the shares |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/read | Lists or gets the shares |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/read | Lists or gets the shares |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/refresh/action | Refresh the share metadata with the data from the cloud |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/shares/write | Creates or updates the shares |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/delete | Deletes the storage account credentials |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/read | Lists or gets the storage account credentials |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/read | Lists or gets the storage account credentials |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/storageAccountCredentials/write | Creates or updates the storage account credentials |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/delete | Deletes the triggers |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/read | Lists or gets the triggers |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/read | Lists or gets the triggers |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/triggers/write | Creates or updates the triggers |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/updateSummary/read | Lists or gets the update summary |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/uploadCertificate/action | Upload certificate for device registration |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/delete | Deletes the share users |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/operationResults/read | Lists or gets the operation result |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/read | Lists or gets the share users |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/read | Lists or gets the share users |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/users/write | Creates or updates the share users |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/write | Creates or updates the Data Box Edge devices |
> | Action | Microsoft.DataBoxEdge/dataBoxEdgeDevices/write | Creates or updates the Data Box Edge devices |

## Microsoft.Databricks

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Databricks/locations/getNetworkPolicies/action | Get Network Intent Polices for a subnet based on the location used by NRP |
> | Action | Microsoft.Databricks/locations/operationstatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.Databricks/operations/read | Gets the list of operations. |
> | Action | Microsoft.Databricks/register/action | Register to Databricks. |
> | Action | Microsoft.Databricks/workspaces/delete | Removes a Databricks workspace. |
> | Action | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Sets the available diagnostic settings for the Databricks workspace |
> | Action | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Action | Microsoft.Databricks/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available log definitions for the Databricks workspace |
> | Action | Microsoft.Databricks/workspaces/read | Retrieves a list of Databricks workspaces. |
> | Action | Microsoft.Databricks/workspaces/refreshPermissions/action | Refresh permissions for a workspace |
> | Action | Microsoft.Databricks/workspaces/updateDenyAssignment/action | Update deny assignment not actions for a managed resource group of a workspace |
> | Action | Microsoft.Databricks/workspaces/virtualNetworkPeerings/delete | Deletes a virtual network peering |
> | Action | Microsoft.Databricks/workspaces/virtualNetworkPeerings/read | Gets the virtual network peering. |
> | Action | Microsoft.Databricks/workspaces/virtualNetworkPeerings/write | Add or modify virtual network peering |
> | Action | Microsoft.Databricks/workspaces/write | Creates a Databricks workspace. |

## Microsoft.DataCatalog

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataCatalog/catalogs/delete | Delete catalogs resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/catalogs/read | Read catalogs resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/catalogs/write | Write catalogs resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/checkNameAvailability/read | Check catalog name availability for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/datacatalogs/delete | Delete DataCatalog resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/datacatalogs/read | Read DataCatalog resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/datacatalogs/write | Write DataCatalog resource for Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/operations/read | Reads all available operations in Data Catalog Resource Provider. |
> | Action | Microsoft.DataCatalog/register/action | Register the subscription for Data Catalog Resource Provider |
> | Action | Microsoft.DataCatalog/unregister/action | Unregister  the subscription for Data Catalog Resource Provider |

## Microsoft.DataFactory

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataFactory/checkazuredatafactorynameavailability/read | Checks if the Data Factory Name is available to use. |
> | Action | Microsoft.DataFactory/datafactories/activitywindows/read | Reads Activity Windows in the Data Factory with specified parameters. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/activities/activitywindows/read | Reads Activity Windows for the Pipeline Activity with specified parameters. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/activitywindows/read | Reads Activity Windows for the Pipeline with specified parameters. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/delete | Deletes any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/pause/action | Pauses any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/read | Reads any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/resume/action | Resumes any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/update/action | Updates any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datapipelines/write | Creates or Updates any Pipeline. |
> | Action | Microsoft.DataFactory/datafactories/datasets/activitywindows/read | Reads Activity Windows for the Dataset with specified parameters. |
> | Action | Microsoft.DataFactory/datafactories/datasets/delete | Deletes any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/datasets/read | Reads any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/datasets/sliceruns/read | Reads the Data Slice Run for the given dataset with the given start time. |
> | Action | Microsoft.DataFactory/datafactories/datasets/slices/read | Gets the Data Slices in the given period. |
> | Action | Microsoft.DataFactory/datafactories/datasets/slices/write | Update the Status of the Data Slice. |
> | Action | Microsoft.DataFactory/datafactories/datasets/write | Creates or Updates any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/delete | Deletes the Data Factory. |
> | Action | Microsoft.DataFactory/datafactories/gateways/connectioninfo/action | Reads the Connection Info for any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/gateways/delete | Deletes any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/gateways/listauthkeys/action | Lists the Authentication Keys for any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/gateways/read | Reads any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/gateways/regenerateauthkey/action | Regenerates the Authentication Keys for any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/gateways/write | Creates or Updates any Gateway. |
> | Action | Microsoft.DataFactory/datafactories/linkedServices/delete | Deletes any Linked Service. |
> | Action | Microsoft.DataFactory/datafactories/linkedServices/read | Reads any Linked Service. |
> | Action | Microsoft.DataFactory/datafactories/linkedServices/write | Creates or Updates any Linked Service. |
> | Action | Microsoft.DataFactory/datafactories/read | Reads the Data Factory. |
> | Action | Microsoft.DataFactory/datafactories/runs/loginfo/read | Reads a SAS URI to a blob container containing the logs. |
> | Action | Microsoft.DataFactory/datafactories/tables/delete | Deletes any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/tables/read | Reads any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/tables/write | Creates or Updates any Dataset. |
> | Action | Microsoft.DataFactory/datafactories/write | Creates or Updates the Data Factory. |
> | Action | Microsoft.DataFactory/factories/addDataFlowToDebugSession/action | Add Data Flow to debug session for preview. |
> | Action | Microsoft.DataFactory/factories/cancelpipelinerun/action | Cancels the pipeline run specified by the run ID. |
> | Action | Microsoft.DataFactory/factories/cancelSandboxPipelineRun/action | Cancels a debug run for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/createdataflowdebugsession/action | Creates a Data Flow debug session. |
> | Action | Microsoft.DataFactory/factories/dataflows/delete | Deletes Data Flow. |
> | Action | Microsoft.DataFactory/factories/dataflows/read | Reads Data Flow. |
> | Action | Microsoft.DataFactory/factories/dataflows/write | Create or update Data Flow |
> | Action | Microsoft.DataFactory/factories/datasets/delete | Deletes any Dataset. |
> | Action | Microsoft.DataFactory/factories/datasets/read | Reads any Dataset. |
> | Action | Microsoft.DataFactory/factories/datasets/write | Creates or Updates any Dataset. |
> | Action | Microsoft.DataFactory/factories/debugpipelineruns/cancel/action | Cancels a debug run for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/delete | Deletes Data Factory. |
> | Action | Microsoft.DataFactory/factories/deletedataflowdebugsession/action | Deletes a Data Flow debug session. |
> | Action | Microsoft.DataFactory/factories/executeDataFlowDebugCommand/action | Execute Data Flow debug command. |
> | Action | Microsoft.DataFactory/factories/getDataPlaneAccess/action | Gets access to ADF DataPlane service. |
> | Action | Microsoft.DataFactory/factories/getDataPlaneAccess/read | Reads access to ADF DataPlane service. |
> | Action | Microsoft.DataFactory/factories/getFeatureValue/action | Get exposure control feature value for the specific location. |
> | Action | Microsoft.DataFactory/factories/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Action | Microsoft.DataFactory/factories/getGitHubAccessToken/action | Gets GitHub access token. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/delete | Deletes any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/getconnectioninfo/read | Reads Integration Runtime Connection Info. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/getObjectMetadata/action | Get SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/getstatus/read | Reads Integration Runtime Status. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/linkedIntegrationRuntime/action | Create Linked Integration Runtime Reference on the Specified Shared Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/listauthkeys/read | Lists the Authentication Keys for any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/monitoringdata/read | Gets the Monitoring Data for any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/nodes/delete | Deletes the Node for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/nodes/ipAddress/action | Returns the IP Address for the specified node of the Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/nodes/read | Reads the Node for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/nodes/write | Updates a self-hosted Integration Runtime Node. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/read | Reads any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/refreshObjectMetadata/action | Refresh SSIS Integration Runtime metadata for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/regenerateauthkey/action | Regenerates the Authentication Keys for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/removelinks/action | Removes Linked Integration Runtime References from the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/start/action | Starts any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/stop/action | Stops any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/synccredentials/action | Syncs the Credentials for the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/upgrade/action | Upgrades the specified Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/integrationruntimes/write | Creates or Updates any Integration Runtime. |
> | Action | Microsoft.DataFactory/factories/linkedServices/delete | Deletes Linked Service. |
> | Action | Microsoft.DataFactory/factories/linkedServices/read | Reads Linked Service. |
> | Action | Microsoft.DataFactory/factories/linkedServices/write | Create or Update Linked Service |
> | Action | Microsoft.DataFactory/factories/operationResults/read | Gets operation results. |
> | Action | Microsoft.DataFactory/factories/pipelineruns/activityruns/read | Reads the activity runs for the specified pipeline run ID. |
> | Action | Microsoft.DataFactory/factories/pipelineruns/cancel/action | Cancels the pipeline run specified by the run ID. |
> | Action | Microsoft.DataFactory/factories/pipelineruns/queryactivityruns/action | Queries the activity runs for the specified pipeline run ID. |
> | Action | Microsoft.DataFactory/factories/pipelineruns/queryactivityruns/read | Reads the result of query activity runs for the specified pipeline run ID. |
> | Action | Microsoft.DataFactory/factories/pipelineruns/read | Reads the Pipeline Runs. |
> | Action | Microsoft.DataFactory/factories/pipelines/createrun/action | Creates a run for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/delete | Deletes Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/pipelineruns/activityruns/progress/read | Gets the Progress of Activity Runs. |
> | Action | Microsoft.DataFactory/factories/pipelines/pipelineruns/read | Reads the Pipeline Run. |
> | Action | Microsoft.DataFactory/factories/pipelines/read | Reads Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/sandbox/action | Creates a debug run environment for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/sandbox/create/action | Creates a debug run environment for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/sandbox/run/action | Creates a debug run for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/pipelines/write | Create or Update Pipeline |
> | Action | Microsoft.DataFactory/factories/querydataflowdebugsessions/action | Queries a Data Flow debug session. |
> | Action | Microsoft.DataFactory/factories/querydebugpipelineruns/action | Queries the Debug Pipeline Runs. |
> | Action | Microsoft.DataFactory/factories/querypipelineruns/action | Queries the Pipeline Runs. |
> | Action | Microsoft.DataFactory/factories/querypipelineruns/read | Reads the Result of Query Pipeline Runs. |
> | Action | Microsoft.DataFactory/factories/querytriggerruns/action | Queries the Trigger Runs. |
> | Action | Microsoft.DataFactory/factories/querytriggerruns/read | Reads the Result of Trigger Runs. |
> | Action | Microsoft.DataFactory/factories/read | Reads Data Factory. |
> | Action | Microsoft.DataFactory/factories/sandboxpipelineruns/action | Queries the Debug Pipeline Runs. |
> | Action | Microsoft.DataFactory/factories/sandboxpipelineruns/read | Gets the debug run info for the Pipeline. |
> | Action | Microsoft.DataFactory/factories/sandboxpipelineruns/sandboxActivityRuns/read | Gets the debug run info for the Activity. |
> | Action | Microsoft.DataFactory/factories/startdataflowdebugsession/action | Starts a Data Flow debug session. |
> | Action | Microsoft.DataFactory/factories/triggerruns/read | Reads the Trigger Runs. |
> | Action | Microsoft.DataFactory/factories/triggers/delete | Deletes any Trigger. |
> | Action | Microsoft.DataFactory/factories/triggers/geteventsubscriptionstatus/action | Event Subscription Status. |
> | Action | Microsoft.DataFactory/factories/triggers/read | Reads any Trigger. |
> | Action | Microsoft.DataFactory/factories/triggers/start/action | Starts any Trigger. |
> | Action | Microsoft.DataFactory/factories/triggers/stop/action | Stops any Trigger. |
> | Action | Microsoft.DataFactory/factories/triggers/subscribetoevents/action | Subscribe to Events. |
> | Action | Microsoft.DataFactory/factories/triggers/triggerruns/read | Reads the Trigger Runs. |
> | Action | Microsoft.DataFactory/factories/triggers/unsubscribefromevents/action | Unsubscribe from Events. |
> | Action | Microsoft.DataFactory/factories/triggers/write | Creates or Updates any Trigger. |
> | Action | Microsoft.DataFactory/factories/write | Create or Update Data Factory |
> | Action | Microsoft.DataFactory/locations/configureFactoryRepo/action | Configures the repository for the factory. |
> | Action | Microsoft.DataFactory/locations/getFeatureValue/action | Get exposure control feature value for the specific location. |
> | Action | Microsoft.DataFactory/locations/getFeatureValue/read | Reads exposure control feature value for the specific location. |
> | Action | Microsoft.DataFactory/operations/read | Reads all Operations in Microsoft Data Factory Provider. |
> | Action | Microsoft.DataFactory/register/action | Registers the subscription for the Data Factory Resource Provider. |
> | Action | Microsoft.DataFactory/unregister/action | Unregisters the subscription for the Data Factory Resource Provider. |

## Microsoft.DataLakeAnalytics

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataLakeAnalytics/accounts/computePolicies/delete | Delete a compute policy. |
> | Action | Microsoft.DataLakeAnalytics/accounts/computePolicies/read | Get information about a compute policy. |
> | Action | Microsoft.DataLakeAnalytics/accounts/computePolicies/write | Create or update a compute policy. |
> | Action | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/delete | Unlink a DataLakeStore account from a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/read | Get information about a linked DataLakeStore account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/write | Create or update a linked DataLakeStore account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/delete | Delete a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/firewallRules/delete | Delete a firewall rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/firewallRules/read | Get information about a firewall rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/firewallRules/write | Create or update a firewall rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/operationResults/read | Get result of a DataLakeAnalytics account operation. |
> | Action | Microsoft.DataLakeAnalytics/accounts/read | Get information about an existing DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/listSasTokens/action | List SAS tokens for storage containers of a linked Storage account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Containers/read | Get containers of a linked Storage account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/storageAccounts/delete | Unlink a Storage account from a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/storageAccounts/read | Get information about a linked Storage account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/storageAccounts/write | Create or update a linked Storage account of a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/accounts/TakeOwnership/action | Grant permissions to cancel jobs submitted by other users. |
> | Action | Microsoft.DataLakeAnalytics/accounts/transferAnalyticsUnits/action | Transfer SystemMaxAnalyticsUnits among DataLakeAnalytics accounts. |
> | Action | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/delete | Delete a virtual network rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/read | Get information about a virtual network rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/virtualNetworkRules/write | Create or update a virtual network rule. |
> | Action | Microsoft.DataLakeAnalytics/accounts/write | Create or update a DataLakeAnalytics account. |
> | Action | Microsoft.DataLakeAnalytics/locations/capability/read | Get capability information of a subscription regarding using DataLakeAnalytics. |
> | Action | Microsoft.DataLakeAnalytics/locations/checkNameAvailability/action | Check availability of a DataLakeAnalytics account name. |
> | Action | Microsoft.DataLakeAnalytics/locations/operationResults/read | Get result of a DataLakeAnalytics account operation. |
> | Action | Microsoft.DataLakeAnalytics/locations/usages/read | Get quota usages information of a subscription regarding using DataLakeAnalytics. |
> | Action | Microsoft.DataLakeAnalytics/operations/read | Get available operations of DataLakeAnalytics. |
> | Action | Microsoft.DataLakeAnalytics/register/action | Register subscription to DataLakeAnalytics. |

## Microsoft.DataLakeStore

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataLakeStore/accounts/delete | Delete a DataLakeStore account. |
> | Action | Microsoft.DataLakeStore/accounts/enableKeyVault/action | Enable KeyVault for a DataLakeStore account. |
> | Action | Microsoft.DataLakeStore/accounts/eventGridFilters/delete | Delete an EventGrid Filter. |
> | Action | Microsoft.DataLakeStore/accounts/eventGridFilters/read | Get an EventGrid Filter. |
> | Action | Microsoft.DataLakeStore/accounts/eventGridFilters/write | Create or update an EventGrid Filter. |
> | Action | Microsoft.DataLakeStore/accounts/firewallRules/delete | Delete a firewall rule. |
> | Action | Microsoft.DataLakeStore/accounts/firewallRules/read | Get information about a firewall rule. |
> | Action | Microsoft.DataLakeStore/accounts/firewallRules/write | Create or update a firewall rule. |
> | Action | Microsoft.DataLakeStore/accounts/operationResults/read | Get result of a DataLakeStore account operation. |
> | Action | Microsoft.DataLakeStore/accounts/read | Get information about an existing DataLakeStore account. |
> | Action | Microsoft.DataLakeStore/accounts/shares/delete | Delete a share. |
> | Action | Microsoft.DataLakeStore/accounts/shares/read | Get information about a share. |
> | Action | Microsoft.DataLakeStore/accounts/shares/write | Create or update a share. |
> | Action | Microsoft.DataLakeStore/accounts/Superuser/action | Grant Superuser on Data Lake Store when granted with Microsoft.Authorization/roleAssignments/write. |
> | Action | Microsoft.DataLakeStore/accounts/trustedIdProviders/delete | Delete a trusted identity provider. |
> | Action | Microsoft.DataLakeStore/accounts/trustedIdProviders/read | Get information about a trusted identity provider. |
> | Action | Microsoft.DataLakeStore/accounts/trustedIdProviders/write | Create or update a trusted identity provider. |
> | Action | Microsoft.DataLakeStore/accounts/virtualNetworkRules/delete | Delete a virtual network rule. |
> | Action | Microsoft.DataLakeStore/accounts/virtualNetworkRules/read | Get information about a virtual network rule. |
> | Action | Microsoft.DataLakeStore/accounts/virtualNetworkRules/write | Create or update a virtual network rule. |
> | Action | Microsoft.DataLakeStore/accounts/write | Create or update a DataLakeStore account. |
> | Action | Microsoft.DataLakeStore/locations/capability/read | Get capability information of a subscription regarding using DataLakeStore. |
> | Action | Microsoft.DataLakeStore/locations/checkNameAvailability/action | Check availability of a DataLakeStore account name. |
> | Action | Microsoft.DataLakeStore/locations/operationResults/read | Get result of a DataLakeStore account operation. |
> | Action | Microsoft.DataLakeStore/locations/usages/read | Get quota usages information of a subscription regarding using DataLakeStore. |
> | Action | Microsoft.DataLakeStore/operations/read | Get available operations of DataLakeStore. |
> | Action | Microsoft.DataLakeStore/register/action | Register subscription to DataLakeStore. |

## Microsoft.DataMigration

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DataMigration/locations/operationResults/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Action | Microsoft.DataMigration/locations/operationStatuses/read | Get the status of a long-running operation related to a 202 Accepted response |
> | Action | Microsoft.DataMigration/register/action | Registers the subscription with the Azure Database Migration Service provider |
> | Action | Microsoft.DataMigration/services/addWorker/action | Adds a DMS worker to the Service's availiable workers |
> | Action | Microsoft.DataMigration/services/checkStatus/action | Check whether the service is deployed and running |
> | Action | Microsoft.DataMigration/services/configureWorker/action | Configures a DMS worker to the Service's availiable workers |
> | Action | Microsoft.DataMigration/services/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/projects/accessArtifacts/action | Generate a URL that can be used to GET or PUT project artifacts |
> | Action | Microsoft.DataMigration/services/projects/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/projects/files/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/projects/files/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/projects/files/read/action | Obtain a URL that can be used to read the content of the file |
> | Action | Microsoft.DataMigration/services/projects/files/readWrite/action | Obtain a URL that can be used to read or write the content of the file |
> | Action | Microsoft.DataMigration/services/projects/files/write | Create or update resources and their properties |
> | Action | Microsoft.DataMigration/services/projects/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/projects/tasks/cancel/action | Cancel the task if it's currently running |
> | Action | Microsoft.DataMigration/services/projects/tasks/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/projects/tasks/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/projects/tasks/write | Run tasks Azure Database Migration Service tasks |
> | Action | Microsoft.DataMigration/services/projects/write | Run tasks Azure Database Migration Service tasks |
> | Action | Microsoft.DataMigration/services/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/removeWorker/action | Removes a DMS worker to the Service's availiable workers |
> | Action | Microsoft.DataMigration/services/serviceTasks/cancel/action | Cancel the task if it's currently running |
> | Action | Microsoft.DataMigration/services/serviceTasks/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/serviceTasks/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/serviceTasks/write | Run tasks Azure Database Migration Service tasks |
> | Action | Microsoft.DataMigration/services/slots/delete | Deletes a resource and all of its children |
> | Action | Microsoft.DataMigration/services/slots/read | Read information about resources |
> | Action | Microsoft.DataMigration/services/slots/write | Create or update resources and their properties |
> | Action | Microsoft.DataMigration/services/start/action | Start the DMS service to allow it to process migrations again |
> | Action | Microsoft.DataMigration/services/stop/action | Stop the DMS service to minimize its cost |
> | Action | Microsoft.DataMigration/services/updateAgentConfig/action | Updates DMS agent configuration with provided values. |
> | Action | Microsoft.DataMigration/services/write | Create or update resources and their properties |
> | Action | Microsoft.DataMigration/skus/read | Get a list of SKUs supported by DMS resources. |

## Microsoft.DBforMariaDB

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DBforMariaDB/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Action | Microsoft.DBforMariaDB/locations/azureAsyncOperation/read | Return MariaDB Server Operation Results |
> | Action | Microsoft.DBforMariaDB/locations/operationResults/read | Return ResourceGroup based MariaDB Server Operation Results |
> | Action | Microsoft.DBforMariaDB/locations/operationResults/read | Return MariaDB Server Operation Results |
> | Action | Microsoft.DBforMariaDB/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforMariaDB/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforMariaDB/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforMariaDB/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforMariaDB/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforMariaDB/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforMariaDB/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforMariaDB/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforMariaDB/operations/read | Return the list of MariaDB Operations. |
> | Action | Microsoft.DBforMariaDB/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforMariaDB/register/action | Register MariaDB Resource Provider |
> | Action | Microsoft.DBforMariaDB/servers/administrators/delete | Deletes an existing administrator of MariaDB server. |
> | Action | Microsoft.DBforMariaDB/servers/administrators/read | Gets a list of MariaDB server administrators. |
> | Action | Microsoft.DBforMariaDB/servers/administrators/write | Creates or updates MariaDB server administrator with the specified parameters. |
> | Action | Microsoft.DBforMariaDB/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Action | Microsoft.DBforMariaDB/servers/advisors/read | Return the list of advisors |
> | Action | Microsoft.DBforMariaDB/servers/advisors/read | Return an advisor |
> | Action | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Action | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Action | Microsoft.DBforMariaDB/servers/advisors/recommendedActions/read | Return a recommended action |
> | Action | Microsoft.DBforMariaDB/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Action | Microsoft.DBforMariaDB/servers/configurations/write | Update the value for the specified configuration |
> | Action | Microsoft.DBforMariaDB/servers/databases/delete | Deletes an existing MariaDB Database. |
> | Action | Microsoft.DBforMariaDB/servers/databases/read | Return the list of MariaDB Databases or gets the properties for the specified Database. |
> | Action | Microsoft.DBforMariaDB/servers/databases/write | Creates a MariaDB Database with the specified parameters or update the properties for the specified Database. |
> | Action | Microsoft.DBforMariaDB/servers/delete | Deletes an existing server. |
> | Action | Microsoft.DBforMariaDB/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Action | Microsoft.DBforMariaDB/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Action | Microsoft.DBforMariaDB/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Action | Microsoft.DBforMariaDB/servers/keys/delete | Deletes an existing server key. |
> | Action | Microsoft.DBforMariaDB/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Action | Microsoft.DBforMariaDB/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Action | Microsoft.DBforMariaDB/servers/logFiles/read | Return the list of MariaDB LogFiles. |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Action | Microsoft.DBforMariaDB/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Action | Microsoft.DBforMariaDB/servers/privateLinkResources/read | Get the private link resources for the corresponding MariaDB Server |
> | Action | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Action | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MariaDB servers |
> | Action | Microsoft.DBforMariaDB/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the texts for a list of queries |
> | Action | Microsoft.DBforMariaDB/servers/queryTexts/action | Return the text of a query |
> | Action | Microsoft.DBforMariaDB/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Action | Microsoft.DBforMariaDB/servers/recoverableServers/read | Return the recoverable MariaDB Server info |
> | Action | Microsoft.DBforMariaDB/servers/replicas/read | Get read replicas of a MariaDB server |
> | Action | Microsoft.DBforMariaDB/servers/restart/action | Restarts a specific server. |
> | Action | Microsoft.DBforMariaDB/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Action | Microsoft.DBforMariaDB/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Action | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Action | Microsoft.DBforMariaDB/servers/topQueryStatistics/read | Return a Query Statistic |
> | Action | Microsoft.DBforMariaDB/servers/updateConfigurations/action | Update configurations for the specified server |
> | Action | Microsoft.DBforMariaDB/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Action | Microsoft.DBforMariaDB/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Action | Microsoft.DBforMariaDB/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Action | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return wait statistics for an instance |
> | Action | Microsoft.DBforMariaDB/servers/waitStatistics/read | Return a wait statistic |
> | Action | Microsoft.DBforMariaDB/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |

## Microsoft.DBforMySQL

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DBforMySQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Action | Microsoft.DBforMySQL/locations/azureAsyncOperation/read | Return MySQL Server Operation Results |
> | Action | Microsoft.DBforMySQL/locations/operationResults/read | Return ResourceGroup based MySQL Server Operation Results |
> | Action | Microsoft.DBforMySQL/locations/operationResults/read | Return MySQL Server Operation Results |
> | Action | Microsoft.DBforMySQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforMySQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforMySQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforMySQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforMySQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforMySQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforMySQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforMySQL/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforMySQL/operations/read | Return the list of MySQL Operations. |
> | Action | Microsoft.DBforMySQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforMySQL/register/action | Register MySQL Resource Provider |
> | Action | Microsoft.DBforMySQL/servers/administrators/delete | Deletes an existing administrator of MySQL server. |
> | Action | Microsoft.DBforMySQL/servers/administrators/read | Gets a list of MySQL server administrators. |
> | Action | Microsoft.DBforMySQL/servers/administrators/write | Creates or updates MySQL server administrator with the specified parameters. |
> | Action | Microsoft.DBforMySQL/servers/advisors/createRecommendedActionSession/action | Create a new recommendation action session |
> | Action | Microsoft.DBforMySQL/servers/advisors/read | Return the list of advisors |
> | Action | Microsoft.DBforMySQL/servers/advisors/read | Return an advisor |
> | Action | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Action | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Action | Microsoft.DBforMySQL/servers/advisors/recommendedActions/read | Return a recommended action |
> | Action | Microsoft.DBforMySQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Action | Microsoft.DBforMySQL/servers/configurations/write | Update the value for the specified configuration |
> | Action | Microsoft.DBforMySQL/servers/databases/delete | Deletes an existing MySQL Database. |
> | Action | Microsoft.DBforMySQL/servers/databases/read | Return the list of MySQL Databases or gets the properties for the specified Database. |
> | Action | Microsoft.DBforMySQL/servers/databases/write | Creates a MySQL Database with the specified parameters or update the properties for the specified Database. |
> | Action | Microsoft.DBforMySQL/servers/delete | Deletes an existing server. |
> | Action | Microsoft.DBforMySQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Action | Microsoft.DBforMySQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Action | Microsoft.DBforMySQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Action | Microsoft.DBforMySQL/servers/keys/delete | Deletes an existing server key. |
> | Action | Microsoft.DBforMySQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Action | Microsoft.DBforMySQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Action | Microsoft.DBforMySQL/servers/logFiles/read | Return the list of MySQL LogFiles. |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Action | Microsoft.DBforMySQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Action | Microsoft.DBforMySQL/servers/privateLinkResources/read | Get the private link resources for the corresponding MySQL Server |
> | Action | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Action | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for MySQL servers |
> | Action | Microsoft.DBforMySQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.DBforMySQL/servers/queryTexts/action | Return the texts for a list of queries |
> | Action | Microsoft.DBforMySQL/servers/queryTexts/action | Return the text of a query |
> | Action | Microsoft.DBforMySQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Action | Microsoft.DBforMySQL/servers/recoverableServers/read | Return the recoverable MySQL Server info |
> | Action | Microsoft.DBforMySQL/servers/replicas/read | Get read replicas of a MySQL server |
> | Action | Microsoft.DBforMySQL/servers/restart/action | Restarts a specific server. |
> | Action | Microsoft.DBforMySQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Action | Microsoft.DBforMySQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Action | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Action | Microsoft.DBforMySQL/servers/topQueryStatistics/read | Return a Query Statistic |
> | Action | Microsoft.DBforMySQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Action | Microsoft.DBforMySQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Action | Microsoft.DBforMySQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Action | Microsoft.DBforMySQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Action | Microsoft.DBforMySQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Action | Microsoft.DBforMySQL/servers/waitStatistics/read | Return a wait statistic |
> | Action | Microsoft.DBforMySQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |

## Microsoft.DBforPostgreSQL

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DBforPostgreSQL/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Action | Microsoft.DBforPostgreSQL/locations/azureAsyncOperation/read | Return PostgreSQL Server Operation Results |
> | Action | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return ResourceGroup based PostgreSQL Server Operation Results |
> | Action | Microsoft.DBforPostgreSQL/locations/operationResults/read | Return PostgreSQL Server Operation Results |
> | Action | Microsoft.DBforPostgreSQL/locations/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforPostgreSQL/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesAzureAsyncOperation/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforPostgreSQL/locations/securityAlertPoliciesOperationResults/read | Return the list of Server threat detection operation result. |
> | Action | Microsoft.DBforPostgreSQL/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforPostgreSQL/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.DBforPostgreSQL/operations/read | Return the list of PostgreSQL Operations. |
> | Action | Microsoft.DBforPostgreSQL/performanceTiers/read | Returns the list of Performance Tiers available. |
> | Action | Microsoft.DBforPostgreSQL/register/action | Register PostgreSQL Resource Provider |
> | Action | Microsoft.DBforPostgreSQL/servers/administrators/delete | Deletes an existing administrator of PostgreSQL server. |
> | Action | Microsoft.DBforPostgreSQL/servers/administrators/read | Gets a list of PostgreSQL server administrators. |
> | Action | Microsoft.DBforPostgreSQL/servers/administrators/write | Creates or updates PostgreSQL server administrator with the specified parameters. |
> | Action | Microsoft.DBforPostgreSQL/servers/advisors/read | Return the list of advisors |
> | Action | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActions/read | Return the list of recommended actions |
> | Action | Microsoft.DBforPostgreSQL/servers/advisors/recommendedActionSessions/action | Make recommendations |
> | Action | Microsoft.DBforPostgreSQL/servers/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Action | Microsoft.DBforPostgreSQL/servers/configurations/write | Update the value for the specified configuration |
> | Action | Microsoft.DBforPostgreSQL/servers/databases/delete | Deletes an existing PostgreSQL Database. |
> | Action | Microsoft.DBforPostgreSQL/servers/databases/read | Return the list of PostgreSQL Databases or gets the properties for the specified Database. |
> | Action | Microsoft.DBforPostgreSQL/servers/databases/write | Creates a PostgreSQL Database with the specified parameters or update the properties for the specified Database. |
> | Action | Microsoft.DBforPostgreSQL/servers/delete | Deletes an existing server. |
> | Action | Microsoft.DBforPostgreSQL/servers/firewallRules/delete | Deletes an existing firewall rule. |
> | Action | Microsoft.DBforPostgreSQL/servers/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Action | Microsoft.DBforPostgreSQL/servers/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Action | Microsoft.DBforPostgreSQL/servers/keys/delete | Deletes an existing server key. |
> | Action | Microsoft.DBforPostgreSQL/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Action | Microsoft.DBforPostgreSQL/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Action | Microsoft.DBforPostgreSQL/servers/logFiles/read | Return the list of PostgreSQL LogFiles. |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Action | Microsoft.DBforPostgreSQL/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Action | Microsoft.DBforPostgreSQL/servers/privateLinkResources/read | Get the private link resources for the corresponding PostgreSQL Server |
> | Action | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Action | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Postgres servers |
> | Action | Microsoft.DBforPostgreSQL/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.DBforPostgreSQL/servers/queryTexts/action | Return the text of a query |
> | Action | Microsoft.DBforPostgreSQL/servers/queryTexts/read | Return the texts for a list of queries |
> | Action | Microsoft.DBforPostgreSQL/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Action | Microsoft.DBforPostgreSQL/servers/recoverableServers/read | Return the recoverable PostgreSQL Server info |
> | Action | Microsoft.DBforPostgreSQL/servers/replicas/read | Get read replicas of a PostgreSQL server |
> | Action | Microsoft.DBforPostgreSQL/servers/restart/action | Restarts a specific server. |
> | Action | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/read | Retrieve details of the server threat detection policy configured on a given server |
> | Action | Microsoft.DBforPostgreSQL/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Action | Microsoft.DBforPostgreSQL/servers/topQueryStatistics/read | Return the list of Query Statistics for the top queries. |
> | Action | Microsoft.DBforPostgreSQL/servers/updateConfigurations/action | Update configurations for the specified server |
> | Action | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Action | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Action | Microsoft.DBforPostgreSQL/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Action | Microsoft.DBforPostgreSQL/servers/waitStatistics/read | Return wait statistics for an instance |
> | Action | Microsoft.DBforPostgreSQL/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/configurations/read | Return the list of configurations for a server or gets the properties for the specified configuration. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/configurations/write | Update the value for the specified configuration |
> | Action | Microsoft.DBforPostgreSQL/serversv2/delete | Deletes an existing server. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/firewallRules/delete | Deletes an existing firewall rule. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/firewallRules/read | Return the list of firewall rules for a server or gets the properties for the specified firewall rule. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/firewallRules/write | Creates a firewall rule with the specified parameters or update an existing rule. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/read | Gets the disagnostic setting for the resource |
> | Action | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Postgres servers |
> | Action | Microsoft.DBforPostgreSQL/serversv2/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.DBforPostgreSQL/serversv2/read | Return the list of servers or gets the properties for the specified server. |
> | Action | Microsoft.DBforPostgreSQL/serversv2/updateConfigurations/action | Update configurations for the specified server |
> | Action | Microsoft.DBforPostgreSQL/serversv2/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |

## Microsoft.Devices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Devices/Account/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Devices/Account/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Devices/Account/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Action | Microsoft.Devices/Account/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Action | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Action | Microsoft.Devices/checkNameAvailability/Action | Check If IotHub name is available |
> | Action | Microsoft.Devices/checkProvisioningServiceNameAvailability/Action | Check If Provisioning service name is available |
> | Action | Microsoft.Devices/checkProvisioningServiceNameAvailability/Action | Check If Provisioning service name is available |
> | Action | Microsoft.Devices/digitalTwins/Delete | Delete an existing Digital Twins Account and all of its children |
> | Action | Microsoft.Devices/digitalTwins/operationresults/Read | Get the status of an operation against a Digital Twins Account |
> | Action | Microsoft.Devices/digitalTwins/Read | Gets a list of the Digital Twins Accounts associated to an subscription |
> | Action | Microsoft.Devices/digitalTwins/skus/Read | Get a list of the valid SKUs for Digital Twins Accounts |
> | Action | Microsoft.Devices/digitalTwins/Write | Create a new Digitial Twins Account |
> | Action | Microsoft.Devices/ElasticPools/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Devices/ElasticPools/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Devices/elasticPools/eventGridFilters/Delete | Deletes the Elastic Pool Event Grid filter |
> | Action | Microsoft.Devices/elasticPools/eventGridFilters/Read | Gets the Elastic Pool Event Grid filter |
> | Action | Microsoft.Devices/elasticPools/eventGridFilters/Write | Create new or Update existing Elastic Pool Event Grid filter |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Delete | Deletes Certificate |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/certificates/generateVerificationCode/Action | Generate Verification code |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Read | Gets the Certificate |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/certificates/verify/Action | Verify Certificate resource |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/certificates/Write | Create or Update Certificate |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/Delete | Delete the IotHub tenant resource |
> | Action | Microsoft.Devices/ElasticPools/IotHubTenants/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Devices/ElasticPools/IotHubTenants/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Delete | Delete EventHub Consumer Group |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Read | Get EventHub Consumer Group(s) |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/eventHubEndpoints/consumerGroups/Write | Create EventHub Consumer Group |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/exportDevices/Action | Export Devices |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/getStats/Read | Gets the IotHub tenant stats resource |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/importDevices/Action | Import Devices |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/iotHubKeys/listkeys/Action | Gets the IotHub tenant key |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/jobs/Read | Get Job(s) details submitted on given IotHub |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/listKeys/Action | Gets IotHub tenant keys |
> | Action | Microsoft.Devices/ElasticPools/IotHubTenants/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Action | Microsoft.Devices/ElasticPools/IotHubTenants/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/quotaMetrics/Read | Get Quota Metrics |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/Read | Gets the IotHub tenant resource |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/routing/routes/$testall/Action | Test a message against all existing Routes |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/routing/routes/$testnew/Action | Test a message against a provided test Route |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/routingEndpointsHealth/Read | Gets the health of all routing Endpoints for an IotHub |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/operationResults/Read | Get the result of the Async Put operation for Iot Tenant Hub SecuritySettings |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/Read | Get the Azure Security Center settings on Iot Tenant Hub |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/securitySettings/Write | Update the Azure Security Center settings on Iot Tenant Hub |
> | Action | Microsoft.Devices/elasticPools/iotHubTenants/Write | Create or Update the IotHub tenant resource |
> | Action | Microsoft.Devices/ElasticPools/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Action | Microsoft.Devices/iotHubs/certificates/Delete | Deletes Certificate |
> | Action | Microsoft.Devices/iotHubs/certificates/generateVerificationCode/Action | Generate Verification code |
> | Action | Microsoft.Devices/iotHubs/certificates/Read | Gets the Certificate |
> | Action | Microsoft.Devices/iotHubs/certificates/verify/Action | Verify Certificate resource |
> | Action | Microsoft.Devices/iotHubs/certificates/Write | Create or Update Certificate |
> | Action | Microsoft.Devices/iotHubs/Delete | Delete IotHub Resource |
> | Action | Microsoft.Devices/IotHubs/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Devices/IotHubs/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Devices/iotHubs/eventGridFilters/Delete | Deletes the Event Grid filter |
> | Action | Microsoft.Devices/iotHubs/eventGridFilters/Read | Gets the Event Grid filter |
> | Action | Microsoft.Devices/iotHubs/eventGridFilters/Write | Create new or Update existing Event Grid filter |
> | Action | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Delete | Delete EventHub Consumer Group |
> | Action | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Read | Get EventHub Consumer Group(s) |
> | Action | Microsoft.Devices/iotHubs/eventHubEndpoints/consumerGroups/Write | Create EventHub Consumer Group |
> | Action | Microsoft.Devices/iotHubs/exportDevices/Action | Export Devices |
> | Action | Microsoft.Devices/iotHubs/importDevices/Action | Import Devices |
> | Action | Microsoft.Devices/iotHubs/iotHubKeys/listkeys/Action | Get IotHub Key for the given name |
> | Action | Microsoft.Devices/iotHubs/iotHubStats/Read | Get IotHub Statistics |
> | Action | Microsoft.Devices/iotHubs/jobs/Read | Get Job(s) details submitted on given IotHub |
> | Action | Microsoft.Devices/iotHubs/listkeys/Action | Get all IotHub Keys |
> | Action | Microsoft.Devices/IotHubs/logDefinitions/read | Gets the available log definitions for the IotHub Service |
> | Action | Microsoft.Devices/IotHubs/metricDefinitions/read | Gets the available metrics for the IotHub service |
> | Action | Microsoft.Devices/iotHubs/operationresults/Read | Get Operation Result (Obsolete API) |
> | Action | Microsoft.Devices/iotHubs/quotaMetrics/Read | Get Quota Metrics |
> | Action | Microsoft.Devices/iotHubs/Read | Gets the IotHub resource(s) |
> | Action | Microsoft.Devices/iotHubs/routing/$testall/Action | Test a message against all existing Routes |
> | Action | Microsoft.Devices/iotHubs/routing/$testnew/Action | Test a message against a provided test Route |
> | Action | Microsoft.Devices/iotHubs/routingEndpointsHealth/Read | Gets the health of all routing Endpoints for an IotHub |
> | Action | Microsoft.Devices/iotHubs/securitySettings/operationResults/Read | Get the result of the Async Put operation for Iot Hub SecuritySettings |
> | Action | Microsoft.Devices/iotHubs/securitySettings/Read | Get the Azure Security Center settings on Iot Hub |
> | Action | Microsoft.Devices/iotHubs/securitySettings/Write | Update the Azure Security Center settings on Iot Hub |
> | Action | Microsoft.Devices/iotHubs/skus/Read | Get valid IotHub Skus |
> | Action | Microsoft.Devices/iotHubs/Write | Create or update IotHub Resource |
> | Action | Microsoft.Devices/locations/operationresults/Read | Get Location based Operation Result |
> | Action | Microsoft.Devices/operationresults/Read | Get Operation Result |
> | Action | Microsoft.Devices/operations/Read | Get All ResourceProvider Operations |
> | Action | Microsoft.Devices/provisioningServices/certificates/Delete | Deletes Certificate |
> | Action | Microsoft.Devices/provisioningServices/certificates/generateVerificationCode/Action | Generate Verification code |
> | Action | Microsoft.Devices/provisioningServices/certificates/Read | Gets the Certificate |
> | Action | Microsoft.Devices/provisioningServices/certificates/verify/Action | Verify Certificate resource |
> | Action | Microsoft.Devices/provisioningServices/certificates/Write | Create or Update Certificate |
> | Action | Microsoft.Devices/provisioningServices/Delete | Delete IotDps resource |
> | Action | Microsoft.Devices/provisioningServices/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Devices/provisioningServices/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Devices/provisioningServices/keys/listkeys/Action | Get IotDps Keys for key name |
> | Action | Microsoft.Devices/provisioningServices/listkeys/Action | Get all IotDps keys |
> | Action | Microsoft.Devices/provisioningServices/logDefinitions/read | Gets the available log definitions for the provisioning Service |
> | Action | Microsoft.Devices/provisioningServices/metricDefinitions/read | Gets the available metrics for the provisioning service |
> | Action | Microsoft.Devices/provisioningServices/operationresults/Read | Get DPS Operation Result |
> | Action | Microsoft.Devices/provisioningServices/Read | Get IotDps resource |
> | Action | Microsoft.Devices/provisioningServices/skus/Read | Get valid IotDps Skus |
> | Action | Microsoft.Devices/provisioningServices/Write | Create IotDps resource |
> | Action | Microsoft.Devices/register/action | Register the subscription for the IotHub resource provider and enables the creation of IotHub resources |
> | Action | Microsoft.Devices/usages/Read | Get subscription usage details for this provider. |

## Microsoft.DevSpaces

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DevSpaces/controllers/delete | Delete Azure Dev Spaces Controller and dataplane services |
> | Action | Microsoft.DevSpaces/controllers/listConnectionDetails/action | List connection details for the Azure Dev Spaces Controller's infrastructure |
> | Action | Microsoft.DevSpaces/controllers/read | Read Azure Dev Spaces Controller properties |
> | Action | Microsoft.DevSpaces/controllers/write | Create or Update Azure Dev Spaces Controller properties |
> | Action | Microsoft.DevSpaces/locations/checkContainerHostMapping/action | Check existing controller mapping for a container host |
> | Action | Microsoft.DevSpaces/locations/operationresults/read | Read status for an asynchronous operation |
> | Action | Microsoft.DevSpaces/register/action | Register Microsoft Dev Spaces resource provider with a subscription |

## Microsoft.DevTestLab

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DevTestLab/labCenters/delete | Delete lab centers. |
> | Action | Microsoft.DevTestLab/labCenters/read | Read lab centers. |
> | Action | Microsoft.DevTestLab/labCenters/write | Add or modify lab centers. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/armTemplates/read | Read azure resource manager templates. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/artifacts/GenerateArmTemplate/action | Generates an Azure Resource Manager template for the given artifact, uploads the required files to a storage account, and validates the generated artifact. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/artifacts/read | Read artifacts. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/delete | Delete artifact sources. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/read | Read artifact sources. |
> | Action | Microsoft.DevTestLab/labs/artifactSources/write | Add or modify artifact sources. |
> | Action | Microsoft.DevTestLab/labs/ClaimAnyVm/action | Claim a random claimable virtual machine in the lab. |
> | Action | Microsoft.DevTestLab/labs/costs/read | Read costs. |
> | Action | Microsoft.DevTestLab/labs/costs/write | Add or modify costs. |
> | Action | Microsoft.DevTestLab/labs/CreateEnvironment/action | Create virtual machines in a lab. |
> | Action | Microsoft.DevTestLab/labs/customImages/delete | Delete custom images. |
> | Action | Microsoft.DevTestLab/labs/customImages/read | Read custom images. |
> | Action | Microsoft.DevTestLab/labs/customImages/write | Add or modify custom images. |
> | Action | Microsoft.DevTestLab/labs/delete | Delete labs. |
> | Action | Microsoft.DevTestLab/labs/EnsureCurrentUserProfile/action | Ensure the current user has a valid profile in the lab. |
> | Action | Microsoft.DevTestLab/labs/ExportResourceUsage/action | Exports the lab resource usage into a storage account |
> | Action | Microsoft.DevTestLab/labs/formulas/delete | Delete formulas. |
> | Action | Microsoft.DevTestLab/labs/formulas/read | Read formulas. |
> | Action | Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas. |
> | Action | Microsoft.DevTestLab/labs/galleryImages/read | Read gallery images. |
> | Action | Microsoft.DevTestLab/labs/GenerateUploadUri/action | Generate a URI for uploading custom disk images to a Lab. |
> | Action | Microsoft.DevTestLab/labs/ImportVirtualMachine/action | Import a virtual machine into a different lab. |
> | Action | Microsoft.DevTestLab/labs/ListVhds/action | List disk images available for custom image creation. |
> | Action | Microsoft.DevTestLab/labs/notificationChannels/delete | Delete notification channels. |
> | Action | Microsoft.DevTestLab/labs/notificationChannels/Notify/action | Send notification to provided channel. |
> | Action | Microsoft.DevTestLab/labs/notificationChannels/read | Read notification channels. |
> | Action | Microsoft.DevTestLab/labs/notificationChannels/write | Add or modify notification channels. |
> | Action | Microsoft.DevTestLab/labs/policySets/EvaluatePolicies/action | Evaluates lab policy. |
> | Action | Microsoft.DevTestLab/labs/policySets/policies/delete | Delete policies. |
> | Action | Microsoft.DevTestLab/labs/policySets/policies/read | Read policies. |
> | Action | Microsoft.DevTestLab/labs/policySets/policies/write | Add or modify policies. |
> | Action | Microsoft.DevTestLab/labs/policySets/read | Read policy sets. |
> | Action | Microsoft.DevTestLab/labs/read | Read labs. |
> | Action | Microsoft.DevTestLab/labs/schedules/delete | Delete schedules. |
> | Action | Microsoft.DevTestLab/labs/schedules/Execute/action | Execute a schedule. |
> | Action | Microsoft.DevTestLab/labs/schedules/ListApplicable/action | Lists all applicable schedules |
> | Action | Microsoft.DevTestLab/labs/schedules/read | Read schedules. |
> | Action | Microsoft.DevTestLab/labs/schedules/write | Add or modify schedules. |
> | Action | Microsoft.DevTestLab/labs/serviceRunners/delete | Delete service runners. |
> | Action | Microsoft.DevTestLab/labs/serviceRunners/read | Read service runners. |
> | Action | Microsoft.DevTestLab/labs/serviceRunners/write | Add or modify service runners. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/delete | Delete shared galleries. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/read | Read shared galleries. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/delete | Delete shared images. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/read | Read shared images. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/sharedImages/write | Add or modify shared images. |
> | Action | Microsoft.DevTestLab/labs/sharedGalleries/write | Add or modify shared galleries. |
> | Action | Microsoft.DevTestLab/labs/users/delete | Delete user profiles. |
> | Action | Microsoft.DevTestLab/labs/users/disks/Attach/action | Attach and create the lease of the disk to the virtual machine. |
> | Action | Microsoft.DevTestLab/labs/users/disks/delete | Delete disks. |
> | Action | Microsoft.DevTestLab/labs/users/disks/Detach/action | Detach and break the lease of the disk attached to the virtual machine. |
> | Action | Microsoft.DevTestLab/labs/users/disks/read | Read disks. |
> | Action | Microsoft.DevTestLab/labs/users/disks/write | Add or modify disks. |
> | Action | Microsoft.DevTestLab/labs/users/environments/delete | Delete environments. |
> | Action | Microsoft.DevTestLab/labs/users/environments/read | Read environments. |
> | Action | Microsoft.DevTestLab/labs/users/environments/write | Add or modify environments. |
> | Action | Microsoft.DevTestLab/labs/users/read | Read user profiles. |
> | Action | Microsoft.DevTestLab/labs/users/secrets/delete | Delete secrets. |
> | Action | Microsoft.DevTestLab/labs/users/secrets/read | Read secrets. |
> | Action | Microsoft.DevTestLab/labs/users/secrets/write | Add or modify secrets. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/delete | Delete service fabrics. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/read | Read service fabrics. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/delete | Delete schedules. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/Execute/action | Execute a schedule. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/read | Read schedules. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/schedules/write | Add or modify schedules. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/Start/action | Start a service fabric. |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/Stop/action | Stop a service fabric |
> | Action | Microsoft.DevTestLab/labs/users/serviceFabrics/write | Add or modify service fabrics. |
> | Action | Microsoft.DevTestLab/labs/users/write | Add or modify user profiles. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/AddDataDisk/action | Attach a new or existing data disk to virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/ApplyArtifacts/action | Apply artifacts to virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Claim/action | Take ownership of an existing virtual machine |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/ClearArtifactResults/action | Clears the artifact results of the virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/delete | Delete virtual machines. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/DetachDataDisk/action | Detach the specified disk from the virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/GetRdpFileContents/action | Gets a string that represents the contents of the RDP file for the virtual machine |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/ListApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/read | Read virtual machines. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Redeploy/action | Redeploy a virtual machine |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Resize/action | Resize Virtual Machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Restart/action | Restart a virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/schedules/delete | Delete schedules. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/schedules/Execute/action | Execute a schedule. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/schedules/read | Read schedules. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/schedules/write | Add or modify schedules. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Start/action | Start a virtual machine. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/Stop/action | Stop a virtual machine |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/TransferDisks/action | Transfers all data disks attached to the virtual machine to be owned by the current user. |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/UnClaim/action | Release ownership of an existing virtual machine |
> | Action | Microsoft.DevTestLab/labs/virtualMachines/write | Add or modify virtual machines. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/delete | Delete bastionhosts. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/read | Read bastionhosts. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/bastionHosts/write | Add or modify bastionhosts. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/delete | Delete virtual networks. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/read | Read virtual networks. |
> | Action | Microsoft.DevTestLab/labs/virtualNetworks/write | Add or modify virtual networks. |
> | Action | Microsoft.DevTestLab/labs/vmPools/delete | Delete virtual machine pools. |
> | Action | Microsoft.DevTestLab/labs/vmPools/read | Read virtual machine pools. |
> | Action | Microsoft.DevTestLab/labs/vmPools/write | Add or modify virtual machine pools. |
> | Action | Microsoft.DevTestLab/labs/write | Add or modify labs. |
> | Action | Microsoft.DevTestLab/locations/operations/read | Read operations. |
> | Action | Microsoft.DevTestLab/register/action | Registers the subscription |
> | Action | Microsoft.DevTestLab/schedules/delete | Delete schedules. |
> | Action | Microsoft.DevTestLab/schedules/Execute/action | Execute a schedule. |
> | Action | Microsoft.DevTestLab/schedules/read | Read schedules. |
> | Action | Microsoft.DevTestLab/schedules/Retarget/action | Updates a schedule's target resource Id. |
> | Action | Microsoft.DevTestLab/schedules/write | Add or modify schedules. |

## Microsoft.DocumentDB

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DocumentDB/databaseAccountNames/read | Checks for name availability. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/delete | Delete a collection. Only applicable to API types: 'mongodb'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/read | Read a collection or list all the collections. Only applicable to API types: 'mongodb'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/read | Read a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/settings/write | Update a collection throughput. Only applicable to API types: 'mongodb'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/collections/write | Create or update a collection. Only applicable to API types: 'mongodb'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/delete | Delete a container. Only applicable to API types: 'sql'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'sql'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/read | Read a container or list all the containers. Only applicable to API types: 'sql'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/read | Read a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/settings/write | Update a container throughput. Only applicable to API types: 'sql'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/containers/write | Create or update a container. Only applicable to API types: 'sql'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/delete | Delete a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/delete | Delete a graph. Only applicable to API types: 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/read | Read a graph or list all the graphs. Only applicable to API types: 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/read | Read a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/settings/write | Update a graph throughput. Only applicable to API types: 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/graphs/write | Create or update a graph. Only applicable to API types: 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/read | Read a database or list all the databases. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/read | Read a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/settings/write | Update a database throughput. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/databases/write | Create a database. Only applicable to API types: 'sql', 'mongodb', 'gremlin'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/delete | Delete a keyspace. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/read | Read a keyspace or list all the keyspaces. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/read | Read a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/settings/write | Update a keyspace throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/delete | Delete a table. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/read | Read a table or list all the tables. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/read | Read a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/settings/write | Update a table throughput. Only applicable to API types: 'cassandra'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/tables/write | Create or update a table. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/keyspaces/write | Create a keyspace. Only applicable to API types: 'cassandra'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/delete | Delete a table. Only applicable to API types: 'table'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'table'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/read | Read a table or list all the tables. Only applicable to API types: 'table'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/operationResults/read | Read status of the asynchronous operation. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/read | Read a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/settings/write | Update a table throughput. Only applicable to API types: 'table'. Only applicable for setting types: 'throughput'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/apis/tables/write | Create or update a table. Only applicable to API types: 'table'. |
> | Action | Microsoft.DocumentDB/databaseAccounts/backup/action | Submit a request to configure backup |
> | Action | Microsoft.DocumentDB/databaseAccounts/changeResourceGroup/action | Change resource group of a database account |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/metricDefinitions/read | Reads the collection metric definitions. |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/metrics/read | Reads the collection metrics. |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitionKeyRangeId/metrics/read | Read database account partition key level metrics |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/metrics/read | Read database account partition level metrics |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/read | Read database account partitions in a collection |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/partitions/usages/read | Read database account partition level usages |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/collections/usages/read | Reads the collection usages. |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/metricDefinitions/read | Reads the database metric definitions |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/metrics/read | Reads the database metrics. |
> | Action | Microsoft.DocumentDB/databaseAccounts/databases/usages/read | Reads the database usages. |
> | Action | Microsoft.DocumentDB/databaseAccounts/delete | Deletes the database accounts. |
> | Action | Microsoft.DocumentDB/databaseAccounts/failoverPriorityChange/action | Change failover priorities of regions of a database account. This is used to perform manual failover operation |
> | Action | Microsoft.DocumentDB/databaseAccounts/getBackupPolicy/action | Get the backup policy of database account |
> | Action | Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/action | Get the connection strings for a database account |
> | Action | Microsoft.DocumentDB/databaseAccounts/listKeys/action | List keys of a database account |
> | Action | Microsoft.DocumentDB/databaseAccounts/metricDefinitions/read | Reads the database account metrics definitions. |
> | Action | Microsoft.DocumentDB/databaseAccounts/metrics/read | Reads the database account metrics. |
> | Action | Microsoft.DocumentDB/databaseAccounts/offlineRegion/action | Offline a region of a database account.  |
> | Action | Microsoft.DocumentDB/databaseAccounts/onlineRegion/action | Online a region of a database account. |
> | Action | Microsoft.DocumentDB/databaseAccounts/operationResults/read | Read status of the asynchronous operation |
> | Action | Microsoft.DocumentDB/databaseAccounts/percentile/metrics/read | Read latency metrics |
> | Action | Microsoft.DocumentDB/databaseAccounts/percentile/read | Read percentiles of replication latencies |
> | Action | Microsoft.DocumentDB/databaseAccounts/percentile/sourceRegion/targetRegion/metrics/read | Read latency metrics for a specific source and target region |
> | Action | Microsoft.DocumentDB/databaseAccounts/percentile/targetRegion/metrics/read | Read latency metrics for a specific target region |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/delete | Delete a private endpoint connection proxy of Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/operationResults/read | Read Status of private endpoint connection proxy asynchronous operation |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/read | Read a private endpoint connection proxy of Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/validate/action | Validate a private endpoint connection proxy of Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnectionProxies/write | Create or update a private endpoint connection proxy of Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/delete | Delete a private endpoint connection of a Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/operationResults/read | Read Status of privateEndpointConnenctions asynchronous operation |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/read | Read a private endpoint connection or list all the private endpoint connections of a Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateEndpointConnections/write | Create or update a private endpoint connection of a Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/privateLinkResources/read | Read a private link resource or list all the private link resources of a Database Account |
> | Action | Microsoft.DocumentDB/databaseAccounts/read | Reads a database account. |
> | Action | Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
> | Action | Microsoft.DocumentDB/databaseAccounts/readonlykeys/read | Reads the database account readonly keys. |
> | Action | Microsoft.DocumentDB/databaseAccounts/regenerateKey/action | Rotate keys of a database account |
> | Action | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/metrics/read | Reads the regional collection metrics. |
> | Action | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitionKeyRangeId/metrics/read | Read regional database account partition key level metrics |
> | Action | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/metrics/read | Read regional database account partition level metrics |
> | Action | Microsoft.DocumentDB/databaseAccounts/region/databases/collections/partitions/read | Read regional database account partitions in a collection |
> | Action | Microsoft.DocumentDB/databaseAccounts/region/metrics/read | Reads the region and database account metrics. |
> | Action | Microsoft.DocumentDB/databaseAccounts/restore/action | Submit a restore request |
> | Action | Microsoft.DocumentDB/databaseAccounts/usages/read | Reads the database account usages. |
> | Action | Microsoft.DocumentDB/databaseAccounts/write | Update a database accounts. |
> | Action | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.DocumentDB that VirtualNetwork or Subnet is being deleted |
> | Action | Microsoft.DocumentDB/locations/deleteVirtualNetworkOrSubnets/operationResults/read | Read Status of deleteVirtualNetworkOrSubnets asynchronous operation |
> | Action | Microsoft.DocumentDB/locations/operationsStatus/read | Reads Status of Asynchronous Operations |
> | Action | Microsoft.DocumentDB/operationResults/read | Read status of the asynchronous operation |
> | Action | Microsoft.DocumentDB/operations/read | Read operations available for the Microsoft DocumentDB  |
> | Action | Microsoft.DocumentDB/register/action |  Register the Microsoft DocumentDB resource provider for the subscription |

## Microsoft.DomainRegistration

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.DomainRegistration/checkDomainAvailability/Action | Check if a domain is available for purchase |
> | Action | Microsoft.DomainRegistration/domains/Delete | Delete an existing domain. |
> | Action | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Delete | Delete ownership identifier |
> | Action | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | List ownership identifiers |
> | Action | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | Get ownership identifier |
> | Action | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Write | Create or update identifier |
> | Action | Microsoft.DomainRegistration/domains/operationresults/Read | Get a domain operation |
> | Action | Microsoft.DomainRegistration/domains/Read | Get the list of domains |
> | Action | Microsoft.DomainRegistration/domains/Read | Get domain |
> | Action | Microsoft.DomainRegistration/domains/renew/Action | Renew an existing domain. |
> | Action | Microsoft.DomainRegistration/domains/Write | Add a new Domain or update an existing one |
> | Action | Microsoft.DomainRegistration/generateSsoRequest/Action | Generate a request for signing into domain control center. |
> | Action | Microsoft.DomainRegistration/listDomainRecommendations/Action | Retrieve the list domain recommendations based on keywords |
> | Action | Microsoft.DomainRegistration/operations/Read | List all operations from app service domain registration |
> | Action | Microsoft.DomainRegistration/register/action | Register the Microsoft Domains resource provider for the subscription |
> | Action | Microsoft.DomainRegistration/topLevelDomains/listAgreements/Action | List Agreement action |
> | Action | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domains |
> | Action | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domain |
> | Action | Microsoft.DomainRegistration/validateDomainRegistrationInformation/Action | Validate domain purchase object without submitting it |

## Microsoft.EventGrid

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.EventGrid/domains/delete | Delete a domain |
> | Action | Microsoft.EventGrid/domains/listKeys/action | List keys for a domain |
> | Action | Microsoft.EventGrid/domains/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Action | Microsoft.EventGrid/domains/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for domains |
> | Action | Microsoft.EventGrid/domains/read | Read a domain |
> | Action | Microsoft.EventGrid/domains/regenerateKey/action | Regenerate key for a domain |
> | Action | Microsoft.EventGrid/domains/topics/delete | Delete a domain topic |
> | Action | Microsoft.EventGrid/domains/topics/read | Read a domain topic |
> | Action | Microsoft.EventGrid/domains/topics/write | Create or update a domain topic |
> | Action | Microsoft.EventGrid/domains/write | Create or update a domain |
> | Action | Microsoft.EventGrid/eventSubscriptions/delete | Delete an eventSubscription |
> | Action | Microsoft.EventGrid/eventSubscriptions/getFullUrl/action | Get full url for the event subscription |
> | Action | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for event subscriptions |
> | Action | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for event subscriptions |
> | Action | Microsoft.EventGrid/eventSubscriptions/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for eventSubscriptions |
> | Action | Microsoft.EventGrid/eventSubscriptions/read | Read an eventSubscription |
> | Action | Microsoft.EventGrid/eventSubscriptions/write | Create or update an eventSubscription |
> | Action | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Action | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Action | Microsoft.EventGrid/extensionTopics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Action | Microsoft.EventGrid/extensionTopics/read | Read an extensionTopic. |
> | Action | Microsoft.EventGrid/locations/eventSubscriptions/read | List regional event subscriptions |
> | Action | Microsoft.EventGrid/locations/operationResults/read | Read the result of a regional operation |
> | Action | Microsoft.EventGrid/locations/operationsStatus/read | Read the status of a regional operation |
> | Action | Microsoft.EventGrid/locations/topictypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | Action | Microsoft.EventGrid/operationResults/read | Read the result of an operation |
> | Action | Microsoft.EventGrid/operations/read | List EventGrid operations. |
> | Action | Microsoft.EventGrid/operationsStatus/read | Read the status of an operation |
> | Action | Microsoft.EventGrid/register/action | Registers the subscription for the EventGrid resource provider. |
> | Action | Microsoft.EventGrid/topics/delete | Delete a topic |
> | Action | Microsoft.EventGrid/topics/listKeys/action | List keys for a topic |
> | Action | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for topics |
> | Action | Microsoft.EventGrid/topics/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for topics |
> | Action | Microsoft.EventGrid/topics/providers/Microsoft.Insights/logDefinitions/read | Allows access to diagnostic logs |
> | Action | Microsoft.EventGrid/topics/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for topics |
> | Action | Microsoft.EventGrid/topics/read | Read a topic |
> | Action | Microsoft.EventGrid/topics/regenerateKey/action | Regenerate key for a topic |
> | Action | Microsoft.EventGrid/topics/write | Create or update a topic |
> | Action | Microsoft.EventGrid/topictypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | Action | Microsoft.EventGrid/topictypes/eventtypes/read | Read eventtypes supported by a topictype |
> | Action | Microsoft.EventGrid/topictypes/read | Read a topictype |
> | Action | Microsoft.EventGrid/unregister/action | Unregisters the subscription for the EventGrid resource provider. |

## Microsoft.EventHub

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.EventHub/availableClusterRegions/read | Read operation to list available pre-provisioned clusters by Azure region. |
> | Action | Microsoft.EventHub/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Action | Microsoft.EventHub/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Action | Microsoft.EventHub/clusters/delete | Deletes an existing Cluster resource. |
> | Action | Microsoft.EventHub/clusters/namespaces/read | List namespace Azure Resource Manager IDs for namespaces within a cluster. |
> | Action | Microsoft.EventHub/clusters/operationresults/read | Get the status of an asynchronous cluster operation. |
> | Action | Microsoft.EventHub/clusters/providers/Microsoft.Insights/metricDefinitions/read | Get list of Cluster metrics Resource Descriptions |
> | Action | Microsoft.EventHub/clusters/read | Gets the Cluster Resource Description |
> | Action | Microsoft.EventHub/clusters/write | Creates or modifies an existing Cluster resource. |
> | Action | Microsoft.EventHub/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in EventHub Resource Provider for the specified VNet |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.EventHub/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Action | Microsoft.EventHub/namespaces/Delete | Delete Namespace Resource |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Action | Microsoft.EventHub/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.EventHub/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/action | Operation to update EventHub. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/delete | Operation to delete EventHub Authorization Rules |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/listkeys/action | Get the Connection String to EventHub |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/read |  Get the list of EventHub Authorization Rules |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.EventHub/namespaces/eventhubs/authorizationRules/write | Create EventHub Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Action | Microsoft.EventHub/namespaces/eventHubs/consumergroups/Delete | Operation to delete ConsumerGroup Resource |
> | Action | Microsoft.EventHub/namespaces/eventHubs/consumergroups/read | Get list of ConsumerGroup Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/eventHubs/consumergroups/write | Create or Update ConsumerGroup properties. |
> | Action | Microsoft.EventHub/namespaces/eventhubs/Delete | Operation to delete EventHub Resource |
> | Action | Microsoft.EventHub/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/eventhubs/write | Create or Update EventHub properties. |
> | Action | Microsoft.EventHub/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Action | Microsoft.EventHub/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Action | Microsoft.EventHub/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | DataAction | Microsoft.EventHub/namespaces/messages/receive/action | Receive messages |
> | DataAction | Microsoft.EventHub/namespaces/messages/send/action | Send messages |
> | Action | Microsoft.EventHub/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.EventHub/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.EventHub/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Action | Microsoft.EventHub/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Action | Microsoft.EventHub/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/operationresults/read | Get the status of Namespace operation |
> | Action | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Action | Microsoft.EventHub/namespaces/read | Get the list of Namespace Resource Description |
> | Action | Microsoft.EventHub/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Action | Microsoft.EventHub/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Action | Microsoft.EventHub/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Action | Microsoft.EventHub/operations/read | Get Operations |
> | Action | Microsoft.EventHub/register/action | Registers the subscription for the EventHub resource provider and enables the creation of EventHub resources |
> | Action | Microsoft.EventHub/sku/read | Get list of Sku Resource Descriptions |
> | Action | Microsoft.EventHub/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | Action | Microsoft.EventHub/unregister/action | Registers the EventHub Resource Provider |

## Microsoft.Features

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Features/features/read | Gets the features of a subscription. |
> | Action | Microsoft.Features/operations/read | Gets the list of operations. |
> | Action | Microsoft.Features/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | Action | Microsoft.Features/providers/features/register/action | Registers the feature for a subscription in a given resource provider. |
> | Action | Microsoft.Features/providers/features/unregister/action | Unregisters the feature for a subscription in a given resource provider. |
> | Action | Microsoft.Features/register/action | Registers the feature of a subscription. |

## Microsoft.GuestConfiguration

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.GuestConfiguration/guestConfigurationAssignments/delete | Delete guest configuration assignment. |
> | Action | Microsoft.GuestConfiguration/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | Action | Microsoft.GuestConfiguration/guestConfigurationAssignments/reports/read | Get guest configuration assignment report. |
> | Action | Microsoft.GuestConfiguration/guestConfigurationAssignments/write | Create new guest configuration assignment. |
> | Action | Microsoft.GuestConfiguration/operations/read | Gets the operations for the Microsoft.GuestConfiguration resource provider |
> | Action | Microsoft.GuestConfiguration/register/action | Registers the subscription for the Microsoft.GuestConfiguration resource provider. |

## Microsoft.HDInsight

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.HDInsight/clusters/applications/delete | Delete Application for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/applications/read | Get Application for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/applications/write | Create or Update Application for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/changerdpsetting/action | Change RDP setting for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/configurations/action | Update HDInsight Cluster Configuration |
> | Action | Microsoft.HDInsight/clusters/configurations/action | Get HDInsight Cluster Configurations |
> | Action | Microsoft.HDInsight/clusters/configurations/read | Get HDInsight Cluster Configurations |
> | Action | Microsoft.HDInsight/clusters/delete | Delete a HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/extensions/delete | Delete Cluster Extension for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/extensions/read | Get Cluster Extension for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/extensions/write | Create Cluster Extension for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/getGatewaySettings/action | Get gateway settings for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/read | Get details about HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/roles/resize/action | Resize a HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/updateGatewaySettings/action | Update gateway settings for HDInsight Cluster |
> | Action | Microsoft.HDInsight/clusters/write | Create or Update HDInsight Cluster |
> | Action | Microsoft.HDInsight/locations/capabilities/read | Get Subscription Capabilities |
> | Action | Microsoft.HDInsight/locations/checkNameAvailability/read | Check Name Availability |
> | Action | Microsoft.HDInsight/register/action | Register HDInsight resource provider for the subscription |
> | Action | Microsoft.HDInsight/unregister/action | Unregister HDInsight resource provider for the subscription |

## Microsoft.ImportExport

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ImportExport/jobs/delete | Deletes an existing job. |
> | Action | Microsoft.ImportExport/jobs/listBitLockerKeys/action | Gets the BitLocker keys for the specified job. |
> | Action | Microsoft.ImportExport/jobs/read | Gets the properties for the specified job or returns the list of jobs. |
> | Action | Microsoft.ImportExport/jobs/write | Creates a job with the specified parameters or update the properties or tags for the specified job. |
> | Action | Microsoft.ImportExport/locations/read | Gets the properties for the specified location or returns the list of locations. |
> | Action | Microsoft.ImportExport/operations/read | Gets the operations supported by the Resource Provider. |
> | Action | Microsoft.ImportExport/register/action | Registers the subscription for the import/export resource provider and enables the creation of import/export jobs. |

## Microsoft.Insights

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Insights/ActionGroups/Delete | Delete an action group |
> | Action | Microsoft.Insights/ActionGroups/Read | Read an action group |
> | Action | Microsoft.Insights/ActionGroups/Write | Create or update an action group |
> | Action | Microsoft.Insights/ActivityLogAlerts/Activated/Action | Activity Log Alert activated |
> | Action | Microsoft.Insights/ActivityLogAlerts/Delete | Delete an activity log alert |
> | Action | Microsoft.Insights/ActivityLogAlerts/Read | Read an activity log alert |
> | Action | Microsoft.Insights/ActivityLogAlerts/Write | Create or update an activity log alert |
> | Action | Microsoft.Insights/AlertRules/Activated/Action | Classic metric alert activated |
> | Action | Microsoft.Insights/AlertRules/Delete | Delete a classic metric alert |
> | Action | Microsoft.Insights/AlertRules/Incidents/Read | Read a classic metric alert incident |
> | Action | Microsoft.Insights/AlertRules/Read | Read a classic metric alert |
> | Action | Microsoft.Insights/AlertRules/Resolved/Action | Classic metric alert resolved |
> | Action | Microsoft.Insights/AlertRules/Throttled/Action | Classic metric alert rule throttled |
> | Action | Microsoft.Insights/AlertRules/Write | Create or update a classic metric alert |
> | Action | Microsoft.Insights/AutoscaleSettings/Delete | Delete an autoscale setting |
> | Action | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/diagnosticSettings/Read | Read a resource diagnostic setting |
> | Action | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/diagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Action | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/logDefinitions/Read | Read log definitions |
> | Action | Microsoft.Insights/AutoscaleSettings/providers/Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Action | Microsoft.Insights/AutoscaleSettings/Read | Read an autoscale setting |
> | Action | Microsoft.Insights/AutoscaleSettings/Scaledown/Action | Autoscale scale down initiated |
> | Action | Microsoft.Insights/AutoscaleSettings/ScaledownResult/Action | Autoscale scale down completed |
> | Action | Microsoft.Insights/AutoscaleSettings/Scaleup/Action | Autoscale scale up initiated |
> | Action | Microsoft.Insights/AutoscaleSettings/ScaleupResult/Action | Autoscale scale up completed |
> | Action | Microsoft.Insights/AutoscaleSettings/Write | Create or update an autoscale setting |
> | Action | Microsoft.Insights/Baseline/Read | Read a metric baseline (preview) |
> | Action | Microsoft.Insights/CalculateBaseline/Read | Calculate baseline for metric values (preview) |
> | Action | Microsoft.Insights/Components/AnalyticsItems/Delete | Deleting an Application Insights analytics item |
> | Action | Microsoft.Insights/Components/AnalyticsItems/Read | Reading an Application Insights analytics item |
> | Action | Microsoft.Insights/Components/AnalyticsItems/Write | Writing an Application Insights analytics item |
> | Action | Microsoft.Insights/Components/AnalyticsTables/Action | Application Insights analytics table action |
> | Action | Microsoft.Insights/Components/AnalyticsTables/Delete | Deleting an Application Insights analytics table schema |
> | Action | Microsoft.Insights/Components/AnalyticsTables/Read | Reading an Application Insights analytics table schema |
> | Action | Microsoft.Insights/Components/AnalyticsTables/Write | Writing an Application Insights analytics table schema |
> | Action | Microsoft.Insights/Components/Annotations/Delete | Deleting an Application Insights annotation |
> | Action | Microsoft.Insights/Components/Annotations/Read | Reading an Application Insights annotation |
> | Action | Microsoft.Insights/Components/Annotations/Write | Writing an Application Insights annotation |
> | Action | Microsoft.Insights/Components/Api/Read | Reading Application Insights component data API |
> | Action | Microsoft.Insights/Components/ApiKeys/Action | Generating an Application Insights API key |
> | Action | Microsoft.Insights/Components/ApiKeys/Delete | Deleting an Application Insights API key |
> | Action | Microsoft.Insights/Components/ApiKeys/Read | Reading an Application Insights API key |
> | Action | Microsoft.Insights/Components/BillingPlanForComponent/Read | Reading a billing plan for Application Insights component |
> | Action | Microsoft.Insights/Components/CurrentBillingFeatures/Read | Reading current billing features for Application Insights component |
> | Action | Microsoft.Insights/Components/CurrentBillingFeatures/Write | Writing current billing features for Application Insights component |
> | Action | Microsoft.Insights/Components/DailyCapReached/Action | Reached the daily cap for Application Insights component |
> | Action | Microsoft.Insights/Components/DailyCapWarningThresholdReached/Action | Reached the daily cap warning threshold for Application Insights component |
> | Action | Microsoft.Insights/Components/DefaultWorkItemConfig/Read | Reading an Application Insights default ALM integration configuration |
> | Action | Microsoft.Insights/Components/Delete | Deleting an application insights component configuration |
> | Action | Microsoft.Insights/Components/Events/Read | Get logs from Application Insights using OData query format |
> | Action | Microsoft.Insights/Components/ExportConfiguration/Action | Application Insights export settings action |
> | Action | Microsoft.Insights/Components/ExportConfiguration/Delete | Deleting Application Insights export settings |
> | Action | Microsoft.Insights/Components/ExportConfiguration/Read | Reading Application Insights export settings |
> | Action | Microsoft.Insights/Components/ExportConfiguration/Write | Writing Application Insights export settings |
> | Action | Microsoft.Insights/Components/ExtendQueries/Read | Reading Application Insights component extended query results |
> | Action | Microsoft.Insights/Components/Favorites/Delete | Deleting an Application Insights favorite |
> | Action | Microsoft.Insights/Components/Favorites/Read | Reading an Application Insights favorite |
> | Action | Microsoft.Insights/Components/Favorites/Write | Writing an Application Insights favorite |
> | Action | Microsoft.Insights/Components/FeatureCapabilities/Read | Reading Application Insights component feature capabilities |
> | Action | Microsoft.Insights/Components/GetAvailableBillingFeatures/Read | Reading Application Insights component available billing features |
> | Action | Microsoft.Insights/Components/GetToken/Read | Reading an Application Insights component token |
> | Action | Microsoft.Insights/Components/MetricDefinitions/Read | Reading Application Insights component metric definitions |
> | Action | Microsoft.Insights/Components/Metrics/Read | Reading Application Insights component metrics |
> | Action | Microsoft.Insights/Components/Move/Action | Move an Application Insights Component to another resource group or subscription |
> | Action | Microsoft.Insights/Components/MyAnalyticsItems/Delete | Deleting an Application Insights personal analytics item |
> | Action | Microsoft.Insights/Components/MyAnalyticsItems/Read | Reading an Application Insights personal analytics item |
> | Action | Microsoft.Insights/Components/MyAnalyticsItems/Write | Writing an Application Insights personal analytics item |
> | Action | Microsoft.Insights/Components/MyFavorites/Read | Reading an Application Insights personal favorite |
> | Action | Microsoft.Insights/Components/Operations/Read | Get status of long-running operations in Application Insights |
> | Action | Microsoft.Insights/Components/PricingPlans/Read | Reading an Application Insights component pricing plan |
> | Action | Microsoft.Insights/Components/PricingPlans/Write | Writing an Application Insights component pricing plan |
> | Action | Microsoft.Insights/Components/ProactiveDetectionConfigs/Read | Reading Application Insights proactive detection configuration |
> | Action | Microsoft.Insights/Components/ProactiveDetectionConfigs/Write | Writing Application Insights proactive detection configuration |
> | Action | Microsoft.Insights/Components/providers/Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Action | Microsoft.Insights/Components/Purge/Action | Purging data from Application Insights |
> | Action | Microsoft.Insights/Components/Query/Read | Run queries against Application Insights logs |
> | Action | Microsoft.Insights/Components/QuotaStatus/Read | Reading Application Insights component quota status |
> | Action | Microsoft.Insights/Components/Read | Reading an application insights component configuration |
> | Action | Microsoft.Insights/Components/SyntheticMonitorLocations/Read | Reading Application Insights webtest locations |
> | Action | Microsoft.Insights/Components/Webtests/Read | Reading a webtest configuration |
> | Action | Microsoft.Insights/Components/WorkItemConfigs/Delete | Deleting an Application Insights ALM integration configuration |
> | Action | Microsoft.Insights/Components/WorkItemConfigs/Read | Reading an Application Insights ALM integration configuration |
> | Action | Microsoft.Insights/Components/WorkItemConfigs/Write | Writing an Application Insights ALM integration configuration |
> | Action | Microsoft.Insights/Components/Write | Writing to an application insights component configuration |
> | Action | Microsoft.Insights/DataCollectionRuleAssociations/Delete | Delete a resource's association with a data collection rule |
> | Action | Microsoft.Insights/DataCollectionRuleAssociations/Read | Read a resource's association with a data collection rule |
> | Action | Microsoft.Insights/DataCollectionRuleAssociations/Write | Create or update a resource's association with a data collection rule |
> | DataAction | Microsoft.Insights/DataCollectionRules/Data/Write | Send data to a data collection rule |
> | Action | Microsoft.Insights/DataCollectionRules/Delete | Delete a data collection rule |
> | Action | Microsoft.Insights/DataCollectionRules/Read | Read a data collection rule |
> | Action | Microsoft.Insights/DataCollectionRules/Write | Create or update a data collection rule |
> | Action | Microsoft.Insights/DiagnosticSettings/Delete | Delete a resource diagnostic setting |
> | Action | Microsoft.Insights/DiagnosticSettings/Read | Read a resource diagnostic setting |
> | Action | Microsoft.Insights/DiagnosticSettings/Write | Create or update a resource diagnostic setting |
> | Action | Microsoft.Insights/EventCategories/Read | Read available Activity Log event categories |
> | Action | Microsoft.Insights/eventtypes/digestevents/Read | Read management event type digest |
> | Action | Microsoft.Insights/eventtypes/values/Read | Read Activity Log events |
> | Action | Microsoft.Insights/ExtendedDiagnosticSettings/Delete | Delete a network flow log diagnostic setting |
> | Action | Microsoft.Insights/ExtendedDiagnosticSettings/Read | Read a network flow log diagnostic setting |
> | Action | Microsoft.Insights/ExtendedDiagnosticSettings/Write | Create or update a network flow log diagnostic setting |
> | Action | Microsoft.Insights/ListMigrationDate/Action | Get back Subscription migration date |
> | Action | Microsoft.Insights/ListMigrationDate/Read | Get back subscription migration date |
> | Action | Microsoft.Insights/LogDefinitions/Read | Read log definitions |
> | Action | Microsoft.Insights/LogProfiles/Delete | Delete an Activity Log log profile |
> | Action | Microsoft.Insights/LogProfiles/Read | Read an Activity Log log profile |
> | Action | Microsoft.Insights/LogProfiles/Write | Create or update an Activity Log log profile |
> | Action | Microsoft.Insights/Logs/ADAssessmentRecommendation/Read | Read data from the ADAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/ADReplicationResult/Read | Read data from the ADReplicationResult table |
> | Action | Microsoft.Insights/Logs/ADSecurityAssessmentRecommendation/Read | Read data from the ADSecurityAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/Alert/Read | Read data from the Alert table |
> | Action | Microsoft.Insights/Logs/AlertHistory/Read | Read data from the AlertHistory table |
> | Action | Microsoft.Insights/Logs/ApplicationInsights/Read | Read data from the ApplicationInsights table |
> | Action | Microsoft.Insights/Logs/AzureActivity/Read | Read data from the AzureActivity table |
> | Action | Microsoft.Insights/Logs/AzureMetrics/Read | Read data from the AzureMetrics table |
> | Action | Microsoft.Insights/Logs/BoundPort/Read | Read data from the BoundPort table |
> | Action | Microsoft.Insights/Logs/CommonSecurityLog/Read | Read data from the CommonSecurityLog table |
> | Action | Microsoft.Insights/Logs/ComputerGroup/Read | Read data from the ComputerGroup table |
> | Action | Microsoft.Insights/Logs/ConfigurationChange/Read | Read data from the ConfigurationChange table |
> | Action | Microsoft.Insights/Logs/ConfigurationData/Read | Read data from the ConfigurationData table |
> | Action | Microsoft.Insights/Logs/ContainerImageInventory/Read | Read data from the ContainerImageInventory table |
> | Action | Microsoft.Insights/Logs/ContainerInventory/Read | Read data from the ContainerInventory table |
> | Action | Microsoft.Insights/Logs/ContainerLog/Read | Read data from the ContainerLog table |
> | Action | Microsoft.Insights/Logs/ContainerServiceLog/Read | Read data from the ContainerServiceLog table |
> | Action | Microsoft.Insights/Logs/DeviceAppCrash/Read | Read data from the DeviceAppCrash table |
> | Action | Microsoft.Insights/Logs/DeviceAppLaunch/Read | Read data from the DeviceAppLaunch table |
> | Action | Microsoft.Insights/Logs/DeviceCalendar/Read | Read data from the DeviceCalendar table |
> | Action | Microsoft.Insights/Logs/DeviceCleanup/Read | Read data from the DeviceCleanup table |
> | Action | Microsoft.Insights/Logs/DeviceConnectSession/Read | Read data from the DeviceConnectSession table |
> | Action | Microsoft.Insights/Logs/DeviceEtw/Read | Read data from the DeviceEtw table |
> | Action | Microsoft.Insights/Logs/DeviceHardwareHealth/Read | Read data from the DeviceHardwareHealth table |
> | Action | Microsoft.Insights/Logs/DeviceHealth/Read | Read data from the DeviceHealth table |
> | Action | Microsoft.Insights/Logs/DeviceHeartbeat/Read | Read data from the DeviceHeartbeat table |
> | Action | Microsoft.Insights/Logs/DeviceSkypeHeartbeat/Read | Read data from the DeviceSkypeHeartbeat table |
> | Action | Microsoft.Insights/Logs/DeviceSkypeSignIn/Read | Read data from the DeviceSkypeSignIn table |
> | Action | Microsoft.Insights/Logs/DeviceSleepState/Read | Read data from the DeviceSleepState table |
> | Action | Microsoft.Insights/Logs/DHAppFailure/Read | Read data from the DHAppFailure table |
> | Action | Microsoft.Insights/Logs/DHAppReliability/Read | Read data from the DHAppReliability table |
> | Action | Microsoft.Insights/Logs/DHDriverReliability/Read | Read data from the DHDriverReliability table |
> | Action | Microsoft.Insights/Logs/DHLogonFailures/Read | Read data from the DHLogonFailures table |
> | Action | Microsoft.Insights/Logs/DHLogonMetrics/Read | Read data from the DHLogonMetrics table |
> | Action | Microsoft.Insights/Logs/DHOSCrashData/Read | Read data from the DHOSCrashData table |
> | Action | Microsoft.Insights/Logs/DHOSReliability/Read | Read data from the DHOSReliability table |
> | Action | Microsoft.Insights/Logs/DHWipAppLearning/Read | Read data from the DHWipAppLearning table |
> | Action | Microsoft.Insights/Logs/DnsEvents/Read | Read data from the DnsEvents table |
> | Action | Microsoft.Insights/Logs/DnsInventory/Read | Read data from the DnsInventory table |
> | Action | Microsoft.Insights/Logs/ETWEvent/Read | Read data from the ETWEvent table |
> | Action | Microsoft.Insights/Logs/Event/Read | Read data from the Event table |
> | Action | Microsoft.Insights/Logs/ExchangeAssessmentRecommendation/Read | Read data from the ExchangeAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/ExchangeOnlineAssessmentRecommendation/Read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/Heartbeat/Read | Read data from the Heartbeat table |
> | Action | Microsoft.Insights/Logs/IISAssessmentRecommendation/Read | Read data from the IISAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/InboundConnection/Read | Read data from the InboundConnection table |
> | Action | Microsoft.Insights/Logs/KubeNodeInventory/Read | Read data from the KubeNodeInventory table |
> | Action | Microsoft.Insights/Logs/KubePodInventory/Read | Read data from the KubePodInventory table |
> | Action | Microsoft.Insights/Logs/LinuxAuditLog/Read | Read data from the LinuxAuditLog table |
> | Action | Microsoft.Insights/Logs/MAApplication/Read | Read data from the MAApplication table |
> | Action | Microsoft.Insights/Logs/MAApplicationHealth/Read | Read data from the MAApplicationHealth table |
> | Action | Microsoft.Insights/Logs/MAApplicationHealthAlternativeVersions/Read | Read data from the MAApplicationHealthAlternativeVersions table |
> | Action | Microsoft.Insights/Logs/MAApplicationHealthIssues/Read | Read data from the MAApplicationHealthIssues table |
> | Action | Microsoft.Insights/Logs/MAApplicationInstance/Read | Read data from the MAApplicationInstance table |
> | Action | Microsoft.Insights/Logs/MAApplicationInstanceReadiness/Read | Read data from the MAApplicationInstanceReadiness table |
> | Action | Microsoft.Insights/Logs/MAApplicationReadiness/Read | Read data from the MAApplicationReadiness table |
> | Action | Microsoft.Insights/Logs/MADeploymentPlan/Read | Read data from the MADeploymentPlan table |
> | Action | Microsoft.Insights/Logs/MADevice/Read | Read data from the MADevice table |
> | Action | Microsoft.Insights/Logs/MADevicePnPHealth/Read | Read data from the MADevicePnPHealth table |
> | Action | Microsoft.Insights/Logs/MADevicePnPHealthAlternativeVersions/Read | Read data from the MADevicePnPHealthAlternativeVersions table |
> | Action | Microsoft.Insights/Logs/MADevicePnPHealthIssues/Read | Read data from the MADevicePnPHealthIssues table |
> | Action | Microsoft.Insights/Logs/MADeviceReadiness/Read | Read data from the MADeviceReadiness table |
> | Action | Microsoft.Insights/Logs/MADriverInstanceReadiness/Read | Read data from the MADriverInstanceReadiness table |
> | Action | Microsoft.Insights/Logs/MADriverReadiness/Read | Read data from the MADriverReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddin/Read | Read data from the MAOfficeAddin table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddinHealth/Read | Read data from the MAOfficeAddinHealth table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddinHealthIssues/Read | Read data from the MAOfficeAddinHealthIssues table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddinInstance/Read | Read data from the MAOfficeAddinInstance table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddinInstanceReadiness/Read | Read data from the MAOfficeAddinInstanceReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeAddinReadiness/Read | Read data from the MAOfficeAddinReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeApp/Read | Read data from the MAOfficeApp table |
> | Action | Microsoft.Insights/Logs/MAOfficeAppHealth/Read | Read data from the MAOfficeAppHealth table |
> | Action | Microsoft.Insights/Logs/MAOfficeAppInstance/Read | Read data from the MAOfficeAppInstance table |
> | Action | Microsoft.Insights/Logs/MAOfficeAppReadiness/Read | Read data from the MAOfficeAppReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeBuildInfo/Read | Read data from the MAOfficeBuildInfo table |
> | Action | Microsoft.Insights/Logs/MAOfficeCurrencyAssessment/Read | Read data from the MAOfficeCurrencyAssessment table |
> | Action | Microsoft.Insights/Logs/MAOfficeCurrencyAssessmentDailyCounts/Read | Read data from the MAOfficeCurrencyAssessmentDailyCounts table |
> | Action | Microsoft.Insights/Logs/MAOfficeDeploymentStatus/Read | Read data from the MAOfficeDeploymentStatus table |
> | Action | Microsoft.Insights/Logs/MAOfficeMacroHealth/Read | Read data from the MAOfficeMacroHealth table |
> | Action | Microsoft.Insights/Logs/MAOfficeMacroHealthIssues/Read | Read data from the MAOfficeMacroHealthIssues table |
> | Action | Microsoft.Insights/Logs/MAOfficeMacroIssueInstanceReadiness/Read | Read data from the MAOfficeMacroIssueInstanceReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeMacroIssueReadiness/Read | Read data from the MAOfficeMacroIssueReadiness table |
> | Action | Microsoft.Insights/Logs/MAOfficeMacroSummary/Read | Read data from the MAOfficeMacroSummary table |
> | Action | Microsoft.Insights/Logs/MAOfficeSuite/Read | Read data from the MAOfficeSuite table |
> | Action | Microsoft.Insights/Logs/MAOfficeSuiteInstance/Read | Read data from the MAOfficeSuiteInstance table |
> | Action | Microsoft.Insights/Logs/MAProposedPilotDevices/Read | Read data from the MAProposedPilotDevices table |
> | Action | Microsoft.Insights/Logs/MAWindowsBuildInfo/Read | Read data from the MAWindowsBuildInfo table |
> | Action | Microsoft.Insights/Logs/MAWindowsCurrencyAssessment/Read | Read data from the MAWindowsCurrencyAssessment table |
> | Action | Microsoft.Insights/Logs/MAWindowsCurrencyAssessmentDailyCounts/Read | Read data from the MAWindowsCurrencyAssessmentDailyCounts table |
> | Action | Microsoft.Insights/Logs/MAWindowsDeploymentStatus/Read | Read data from the MAWindowsDeploymentStatus table |
> | Action | Microsoft.Insights/Logs/MAWindowsSysReqInstanceReadiness/Read | Read data from the MAWindowsSysReqInstanceReadiness table |
> | Action | Microsoft.Insights/Logs/NetworkMonitoring/Read | Read data from the NetworkMonitoring table |
> | Action | Microsoft.Insights/Logs/OfficeActivity/Read | Read data from the OfficeActivity table |
> | Action | Microsoft.Insights/Logs/Operation/Read | Read data from the Operation table |
> | Action | Microsoft.Insights/Logs/OutboundConnection/Read | Read data from the OutboundConnection table |
> | Action | Microsoft.Insights/Logs/Perf/Read | Read data from the Perf table |
> | Action | Microsoft.Insights/Logs/ProtectionStatus/Read | Read data from the ProtectionStatus table |
> | Action | Microsoft.Insights/Logs/Read | Reading data from all your logs |
> | Action | Microsoft.Insights/Logs/ReservedAzureCommonFields/Read | Read data from the ReservedAzureCommonFields table |
> | Action | Microsoft.Insights/Logs/ReservedCommonFields/Read | Read data from the ReservedCommonFields table |
> | Action | Microsoft.Insights/Logs/SCCMAssessmentRecommendation/Read | Read data from the SCCMAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SCOMAssessmentRecommendation/Read | Read data from the SCOMAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SecurityAlert/Read | Read data from the SecurityAlert table |
> | Action | Microsoft.Insights/Logs/SecurityBaseline/Read | Read data from the SecurityBaseline table |
> | Action | Microsoft.Insights/Logs/SecurityBaselineSummary/Read | Read data from the SecurityBaselineSummary table |
> | Action | Microsoft.Insights/Logs/SecurityDetection/Read | Read data from the SecurityDetection table |
> | Action | Microsoft.Insights/Logs/SecurityEvent/Read | Read data from the SecurityEvent table |
> | Action | Microsoft.Insights/Logs/ServiceFabricOperationalEvent/Read | Read data from the ServiceFabricOperationalEvent table |
> | Action | Microsoft.Insights/Logs/ServiceFabricReliableActorEvent/Read | Read data from the ServiceFabricReliableActorEvent table |
> | Action | Microsoft.Insights/Logs/ServiceFabricReliableServiceEvent/Read | Read data from the ServiceFabricReliableServiceEvent table |
> | Action | Microsoft.Insights/Logs/SfBAssessmentRecommendation/Read | Read data from the SfBAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SfBOnlineAssessmentRecommendation/Read | Read data from the SfBOnlineAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SharePointOnlineAssessmentRecommendation/Read | Read data from the SharePointOnlineAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SPAssessmentRecommendation/Read | Read data from the SPAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SQLAssessmentRecommendation/Read | Read data from the SQLAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/SQLQueryPerformance/Read | Read data from the SQLQueryPerformance table |
> | Action | Microsoft.Insights/Logs/Syslog/Read | Read data from the Syslog table |
> | Action | Microsoft.Insights/Logs/SysmonEvent/Read | Read data from the SysmonEvent table |
> | Action | Microsoft.Insights/Logs/Tables.Custom/Read | Reading data from any custom log |
> | Action | Microsoft.Insights/Logs/UAApp/Read | Read data from the UAApp table |
> | Action | Microsoft.Insights/Logs/UAComputer/Read | Read data from the UAComputer table |
> | Action | Microsoft.Insights/Logs/UAComputerRank/Read | Read data from the UAComputerRank table |
> | Action | Microsoft.Insights/Logs/UADriver/Read | Read data from the UADriver table |
> | Action | Microsoft.Insights/Logs/UADriverProblemCodes/Read | Read data from the UADriverProblemCodes table |
> | Action | Microsoft.Insights/Logs/UAFeedback/Read | Read data from the UAFeedback table |
> | Action | Microsoft.Insights/Logs/UAHardwareSecurity/Read | Read data from the UAHardwareSecurity table |
> | Action | Microsoft.Insights/Logs/UAIESiteDiscovery/Read | Read data from the UAIESiteDiscovery table |
> | Action | Microsoft.Insights/Logs/UAOfficeAddIn/Read | Read data from the UAOfficeAddIn table |
> | Action | Microsoft.Insights/Logs/UAProposedActionPlan/Read | Read data from the UAProposedActionPlan table |
> | Action | Microsoft.Insights/Logs/UASysReqIssue/Read | Read data from the UASysReqIssue table |
> | Action | Microsoft.Insights/Logs/UAUpgradedComputer/Read | Read data from the UAUpgradedComputer table |
> | Action | Microsoft.Insights/Logs/Update/Read | Read data from the Update table |
> | Action | Microsoft.Insights/Logs/UpdateRunProgress/Read | Read data from the UpdateRunProgress table |
> | Action | Microsoft.Insights/Logs/UpdateSummary/Read | Read data from the UpdateSummary table |
> | Action | Microsoft.Insights/Logs/Usage/Read | Read data from the Usage table |
> | Action | Microsoft.Insights/Logs/W3CIISLog/Read | Read data from the W3CIISLog table |
> | Action | Microsoft.Insights/Logs/WaaSDeploymentStatus/Read | Read data from the WaaSDeploymentStatus table |
> | Action | Microsoft.Insights/Logs/WaaSInsiderStatus/Read | Read data from the WaaSInsiderStatus table |
> | Action | Microsoft.Insights/Logs/WaaSUpdateStatus/Read | Read data from the WaaSUpdateStatus table |
> | Action | Microsoft.Insights/Logs/WDAVStatus/Read | Read data from the WDAVStatus table |
> | Action | Microsoft.Insights/Logs/WDAVThreat/Read | Read data from the WDAVThreat table |
> | Action | Microsoft.Insights/Logs/WindowsClientAssessmentRecommendation/Read | Read data from the WindowsClientAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/WindowsFirewall/Read | Read data from the WindowsFirewall table |
> | Action | Microsoft.Insights/Logs/WindowsServerAssessmentRecommendation/Read | Read data from the WindowsServerAssessmentRecommendation table |
> | Action | Microsoft.Insights/Logs/WireData/Read | Read data from the WireData table |
> | Action | Microsoft.Insights/Logs/WUDOAggregatedStatus/Read | Read data from the WUDOAggregatedStatus table |
> | Action | Microsoft.Insights/Logs/WUDOStatus/Read | Read data from the WUDOStatus table |
> | Action | Microsoft.Insights/MetricAlerts/Delete | Delete a metric alert |
> | Action | Microsoft.Insights/MetricAlerts/Read | Read a metric alert |
> | Action | Microsoft.Insights/MetricAlerts/Status/Read | Read metric alert status |
> | Action | Microsoft.Insights/MetricAlerts/Write | Create or update a metric alert |
> | Action | Microsoft.Insights/MetricBaselines/Read | Read metric baselines |
> | Action | Microsoft.Insights/MetricDefinitions/Microsoft.Insights/Read | Read metric definitions |
> | Action | Microsoft.Insights/MetricDefinitions/providers/Microsoft.Insights/Read | Read metric definitions |
> | Action | Microsoft.Insights/MetricDefinitions/Read | Read metric definitions |
> | Action | Microsoft.Insights/Metricnamespaces/Read | Read metric namespaces |
> | Action | Microsoft.Insights/Metrics/Action | Metric Action |
> | Action | Microsoft.Insights/Metrics/Microsoft.Insights/Read | Read metrics |
> | Action | Microsoft.Insights/Metrics/providers/Metrics/Read | Read metrics |
> | Action | Microsoft.Insights/Metrics/Read | Read metrics |
> | DataAction | Microsoft.Insights/Metrics/Write | Write metrics |
> | Action | Microsoft.Insights/MigrateToNewpricingModel/Action | Migrate subscription to new pricing model |
> | Action | Microsoft.Insights/Operations/Read | Read operations |
> | Action | Microsoft.Insights/Register/Action | Register the Microsoft Insights provider |
> | Action | Microsoft.Insights/RollbackToLegacyPricingModel/Action | Rollback subscription to legacy pricing model |
> | Action | Microsoft.Insights/ScheduledQueryRules/Delete | Deleting a scheduled query rule |
> | Action | Microsoft.Insights/ScheduledQueryRules/Read | Reading a scheduled query rule |
> | Action | Microsoft.Insights/ScheduledQueryRules/Write | Writing a scheduled query rule |
> | Action | Microsoft.Insights/Tenants/Register/Action | Initializes the Microsoft Insights provider |
> | Action | Microsoft.Insights/Unregister/Action | Register the Microsoft Insights provider |
> | Action | Microsoft.Insights/Webtests/Delete | Deleting a webtest configuration |
> | Action | Microsoft.Insights/Webtests/GetToken/Read | Reading a webtest token |
> | Action | Microsoft.Insights/Webtests/MetricDefinitions/Read | Reading a webtest metric definitions |
> | Action | Microsoft.Insights/Webtests/Metrics/Read | Reading a webtest metrics |
> | Action | Microsoft.Insights/Webtests/Read | Reading a webtest configuration |
> | Action | Microsoft.Insights/Webtests/Write | Writing to a webtest configuration |
> | Action | Microsoft.Insights/Workbooks/Delete | Delete a workbook |
> | Action | Microsoft.Insights/Workbooks/Read | Read a workbook |
> | Action | Microsoft.Insights/Workbooks/Write | Create or update a workbook |

## Microsoft.Intune

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Intune/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Action | Microsoft.Intune/diagnosticsettings/read | Reading a diagnostic setting |
> | Action | Microsoft.Intune/diagnosticsettings/write | Writing a diagnostic setting |
> | Action | Microsoft.Intune/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

## Microsoft.IoTCentral

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.IoTCentral/appTemplates/action | Gets all the available application templates on Azure IoT Central |
> | Action | Microsoft.IoTCentral/checkNameAvailability/action | Checks if an IoT Central Application name is available |
> | Action | Microsoft.IoTCentral/checkSubdomainAvailability/action | Checks if an IoT Central Application subdomain is available |
> | Action | Microsoft.IoTCentral/IoTApps/delete | Deletes an IoT Central Applications |
> | Action | Microsoft.IoTCentral/IoTApps/read | Gets a single IoT Central Application |
> | Action | Microsoft.IoTCentral/IoTApps/write | Creates or Updates an IoT Central Applications |
> | Action | Microsoft.IoTCentral/operations/read | Gets all the available operations on IoT Central Applications |
> | Action | Microsoft.IoTCentral/register/action | Register the subscription for Azure IoT Central resource provider |

## Microsoft.IoTSpaces

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.IoTSpaces/Graph/delete | Deletes Microsoft.IoTSpaces Graph resource |
> | Action | Microsoft.IoTSpaces/Graph/read | Gets the Microsoft.IoTSpaces Graph resource(s) |
> | Action | Microsoft.IoTSpaces/Graph/write | Create Microsoft.IoTSpaces Graph resource |
> | Action | Microsoft.IoTSpaces/register/action | Register subscription for Microsoft.IoTSpaces Graph resource provider to enable creating of resources |

## Microsoft.KeyVault

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.KeyVault/checkNameAvailability/read | Checks that a key vault name is valid and is not in use |
> | Action | Microsoft.KeyVault/deletedVaults/read | View the properties of soft deleted key vaults |
> | Action | Microsoft.KeyVault/hsmPools/delete | Delete an HSM pool |
> | Action | Microsoft.KeyVault/hsmPools/joinVault/action | Join a key vault to an HSM pool |
> | Action | Microsoft.KeyVault/hsmPools/read | View the properties of an HSM pool |
> | Action | Microsoft.KeyVault/hsmPools/write | Create a new HSM pool of update the properties of an existing HSM pool |
> | Action | Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
> | Action | Microsoft.KeyVault/locations/deletedVaults/read | View the properties of a soft deleted key vault |
> | Action | Microsoft.KeyVault/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.KeyVault that a virtual network or subnet is being deleted |
> | Action | Microsoft.KeyVault/locations/operationResults/read | Check the result of a long run operation |
> | Action | Microsoft.KeyVault/operations/read | Lists operations available on Microsoft.KeyVault resource provider |
> | Action | Microsoft.KeyVault/register/action | Registers a subscription |
> | Action | Microsoft.KeyVault/unregister/action | Unregisters a subscription |
> | Action | Microsoft.KeyVault/vaults/accessPolicies/write | Update an existing access policy by merging or replacing, or add a new access policy to a vault. |
> | Action | Microsoft.KeyVault/vaults/delete | Delete a key vault |
> | Action | Microsoft.KeyVault/vaults/deploy/action | Enables access to secrets in a key vault when deploying Azure resources |
> | Action | Microsoft.KeyVault/vaults/eventGridFilters/delete | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being deleted |
> | Action | Microsoft.KeyVault/vaults/eventGridFilters/read | Notifies Microsoft.KeyVault that an EventGrid Subscription for Key Vault is being viewed |
> | Action | Microsoft.KeyVault/vaults/eventGridFilters/write | Notifies Microsoft.KeyVault that a new EventGrid Subscription for Key Vault is being created |
> | Action | Microsoft.KeyVault/vaults/read | View the properties of a key vault |
> | Action | Microsoft.KeyVault/vaults/secrets/read | View the properties of a secret, but not its value. |
> | Action | Microsoft.KeyVault/vaults/secrets/write | Create a new secret or update the value of an existing secret. |
> | Action | Microsoft.KeyVault/vaults/write | Create a new key vault or update the properties of an existing key vault |

## Microsoft.Kusto

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Kusto/Clusters/Activate/action | Starts the cluster. |
> | Action | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/delete | Deletes an attached database configuration resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/read | Reads an attached database configuration resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/AttachedDatabaseConfigurations/write | Writes an attached database configuration resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/CheckNameAvailability/action | Checks the cluster name availability. |
> | Action | Microsoft.Kusto/Clusters/Databases/AddPrincipals/action | Adds database principals. |
> | Action | Microsoft.Kusto/Clusters/Databases/CheckNameAvailability/action | Checks name availability for a given type. |
> | Action | Microsoft.Kusto/Clusters/Databases/DataConnections/delete | Deletes a data connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/DataConnections/read | Reads a data connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/DataConnections/write | Writes a data connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/DataConnectionValidation/action | Validates database data connection. |
> | Action | Microsoft.Kusto/Clusters/Databases/delete | Deletes a database resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/EventHubConnections/delete | Deletes an Event Hub connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/EventHubConnections/read | Reads an Event Hub connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/EventHubConnections/write | Writes an Event Hub connections resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/EventHubConnectionValidation/action | Validates database Event Hub connection. |
> | Action | Microsoft.Kusto/Clusters/Databases/ListPrincipals/action | Lists database principals. |
> | Action | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/delete | Deletes a database principal assignments resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/read | Reads a database principal assignments resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/PrincipalAssignments/write | Writes a database principal assignments resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/read | Reads a database resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Databases/RemovePrincipals/action | Removes database principals. |
> | Action | Microsoft.Kusto/Clusters/Databases/write | Writes a database resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Deactivate/action | Stops the cluster. |
> | Action | Microsoft.Kusto/Clusters/delete | Deletes a cluster resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/DetachFollowerDatabases/action | Detaches follower's databases. |
> | Action | Microsoft.Kusto/Clusters/DiagnoseVirtualNetwork/action | Diagnoses network connectivity status for external resources on which the service is depedent on. |
> | Action | Microsoft.Kusto/Clusters/ListFollowerDatabases/action | Lists the follower's databases. |
> | Action | Microsoft.Kusto/Clusters/read | Reads a cluster resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/SKUs/read | Reads a cluster SKU resourceCopy. |
> | Action | Microsoft.Kusto/Clusters/Start/action | Starts the cluster. |
> | Action | Microsoft.Kusto/Clusters/Stop/action | Stops the cluster. |
> | Action | Microsoft.Kusto/Clusters/write | Writes a cluster resourceCopy. |
> | Action | Microsoft.Kusto/Locations/CheckNameAvailability/action | Checks resourceCopy name availability. |
> | Action | Microsoft.Kusto/Locations/GetNetworkPolicies/action | Gets Network Intent Policies |
> | Action | Microsoft.Kusto/locations/operationresults/read | Reads operations resourceCopys |
> | Action | Microsoft.Kusto/Operations/read | Reads operations resourceCopys |
> | Action | Microsoft.Kusto/register/action | Subscription Registration Action |
> | Action | Microsoft.Kusto/Register/action | Registers the subscription to the Kusto Resource Provider. |
> | Action | Microsoft.Kusto/SKUs/read | Reads a SKU resourceCopy. |
> | Action | Microsoft.Kusto/Unregister/action | Unregisters the subscription to the Kusto Resource Provider. |

## Microsoft.LabServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.LabServices/labAccounts/CreateLab/action | Create a lab in a lab account. |
> | Action | Microsoft.LabServices/labAccounts/delete | Delete lab accounts. |
> | Action | Microsoft.LabServices/labAccounts/galleryImages/delete | Delete gallery images. |
> | Action | Microsoft.LabServices/labAccounts/galleryImages/read | Read gallery images. |
> | Action | Microsoft.LabServices/labAccounts/galleryImages/write | Add or modify gallery images. |
> | Action | Microsoft.LabServices/labAccounts/GetRegionalAvailability/action | Get regional availability information for each size category configured under a lab account |
> | Action | Microsoft.LabServices/labAccounts/labs/AddUsers/action | Add users to a lab |
> | Action | Microsoft.LabServices/labAccounts/labs/delete | Delete labs. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/delete | Delete environment setting. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/delete | Delete environments. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/read | Read environments. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/ResetPassword/action | Resets the user password on an environment |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Start/action | Starts an environment by starting all resources inside the environment. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/Stop/action | Stops an environment by stopping all resources inside the environment |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/environments/write | Add or modify environments. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/Publish/action | Provisions/deprovisions required resources for an environment setting based on current state of the lab/environment setting. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/read | Read environment setting. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/ResetPassword/action | Resets password on the template virtual machine. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/SaveImage/action | Saves current template image to the shared gallery in the lab account |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/delete | Delete schedules. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/read | Read schedules. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/schedules/write | Add or modify schedules. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/Start/action | Starts a template by starting all resources inside the template. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/Stop/action | Stops a template by stopping all resources inside the template. |
> | Action | Microsoft.LabServices/labAccounts/labs/environmentSettings/write | Add or modify environment setting. |
> | Action | Microsoft.LabServices/labAccounts/labs/read | Read labs. |
> | Action | Microsoft.LabServices/labAccounts/labs/SendEmail/action | Send email with registration link to the lab |
> | Action | Microsoft.LabServices/labAccounts/labs/users/delete | Delete users. |
> | Action | Microsoft.LabServices/labAccounts/labs/users/read | Read users. |
> | Action | Microsoft.LabServices/labAccounts/labs/users/write | Add or modify users. |
> | Action | Microsoft.LabServices/labAccounts/labs/write | Add or modify labs. |
> | Action | Microsoft.LabServices/labAccounts/read | Read lab accounts. |
> | Action | Microsoft.LabServices/labAccounts/sharedGalleries/delete | Delete sharedgalleries. |
> | Action | Microsoft.LabServices/labAccounts/sharedGalleries/read | Read sharedgalleries. |
> | Action | Microsoft.LabServices/labAccounts/sharedGalleries/write | Add or modify sharedgalleries. |
> | Action | Microsoft.LabServices/labAccounts/sharedImages/delete | Delete sharedimages. |
> | Action | Microsoft.LabServices/labAccounts/sharedImages/read | Read sharedimages. |
> | Action | Microsoft.LabServices/labAccounts/sharedImages/write | Add or modify sharedimages. |
> | Action | Microsoft.LabServices/labAccounts/write | Add or modify lab accounts. |
> | Action | Microsoft.LabServices/locations/operations/read | Read operations. |
> | Action | Microsoft.LabServices/register/action | Registers the subscription |
> | Action | Microsoft.LabServices/users/ListAllEnvironments/action | List all Environments for the user |
> | Action | Microsoft.LabServices/users/Register/action | Register a user to a managed lab |
> | Action | Microsoft.LabServices/users/ResetPassword/action | Resets the user password on an environment |
> | Action | Microsoft.LabServices/users/StartEnvironment/action | Starts an environment by starting all resources inside the environment. |
> | Action | Microsoft.LabServices/users/StopEnvironment/action | Stops an environment by stopping all resources inside the environment |
> | Action | Microsoft.LabServices/users/UserSettings/action | Updates and returns personal user settings. |

## Microsoft.Logic

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Logic/integrationAccounts/agreements/delete | Deletes the agreement in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/agreements/listContentCallbackUrl/action | Gets the callback URL for agreement content in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/agreements/read | Reads the agreement in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/agreements/write | Creates or updates the agreement in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/assemblies/delete | Deletes the assembly in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/assemblies/listContentCallbackUrl/action | Gets the callback URL for assembly content in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/assemblies/read | Reads the assembly in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/assemblies/write | Creates or updates the assembly in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/batchConfigurations/delete | Deletes the batch configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/batchConfigurations/read | Reads the batch configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/batchConfigurations/write | Creates or updates the batch configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/certificates/delete | Deletes the certificate in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/certificates/read | Reads the certificate in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/certificates/write | Creates or updates the certificate in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/delete | Deletes the integration account. |
> | Action | Microsoft.Logic/integrationAccounts/join/action | Joins the Integration Account. |
> | Action | Microsoft.Logic/integrationAccounts/listCallbackUrl/action | Gets the callback URL for integration account. |
> | Action | Microsoft.Logic/integrationAccounts/listKeyVaultKeys/action | Gets the keys in the key vault. |
> | Action | Microsoft.Logic/integrationAccounts/logTrackingEvents/action | Logs the tracking events in the integration account. |
> | Action | Microsoft.Logic/integrationAccounts/maps/delete | Deletes the map in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/maps/listContentCallbackUrl/action | Gets the callback URL for map content in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/maps/read | Reads the map in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/maps/write | Creates or updates the map in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/partners/delete | Deletes the partner in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/partners/listContentCallbackUrl/action | Gets the callback URL for partner content in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/partners/read | Reads the partner in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/partners/write | Creates or updates the partner in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/providers/Microsoft.Insights/logDefinitions/read | Reads the Integration Account log definitions. |
> | Action | Microsoft.Logic/integrationAccounts/read | Reads the integration account. |
> | Action | Microsoft.Logic/integrationAccounts/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Action | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/delete | Deletes the RosettaNet process configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/read | Reads the RosettaNet process configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/rosettaNetProcessConfigurations/write | Creates or updates the  RosettaNet process configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/schemas/delete | Deletes the schema in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/schemas/listContentCallbackUrl/action | Gets the callback URL for schema content in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/schemas/read | Reads the schema in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/schemas/write | Creates or updates the schema in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/sessions/delete | Deletes the session in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/sessions/read | Reads the batch configuration in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/sessions/write | Creates or updates the session in integration account. |
> | Action | Microsoft.Logic/integrationAccounts/write | Creates or updates the integration account. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/availableManagedApis/read | Reads the integration service environment available managed APIs. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/delete | Deletes the integration service environment. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/join/action | Joins the Integration Service Environment. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/managedApis/apiOperations/read | Reads the integration service environment managed API operation. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/managedApis/join/action | Joins the Integration Service Environment Managed API. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/managedApis/operationStatuses/read | Reads the integration service environment managed API operation statuses. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/managedApis/read | Reads the integration service environment managed API. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/managedApis/write | Creates or updates the integration service environment managed API. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/operationStatuses/read | Reads the integration service environment operation statuses. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/providers/Microsoft.Insights/metricDefinitions/read | Reads the integration service environment metric definitions. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/read | Reads the integration service environment. |
> | Action | Microsoft.Logic/integrationServiceEnvironments/write | Creates or updates the integration service environment. |
> | Action | Microsoft.Logic/locations/workflows/recommendOperationGroups/action | Gets the workflow recommend operation groups. |
> | Action | Microsoft.Logic/locations/workflows/validate/action | Validates the workflow. |
> | Action | Microsoft.Logic/operations/read | Gets the operation. |
> | Action | Microsoft.Logic/register/action | Registers the Microsoft.Logic resource provider for a given subscription. |
> | Action | Microsoft.Logic/workflows/accessKeys/delete | Deletes the access key. |
> | Action | Microsoft.Logic/workflows/accessKeys/list/action | Lists the access key secrets. |
> | Action | Microsoft.Logic/workflows/accessKeys/read | Reads the access key. |
> | Action | Microsoft.Logic/workflows/accessKeys/regenerate/action | Regenerates the access key secrets. |
> | Action | Microsoft.Logic/workflows/accessKeys/write | Creates or updates the access key. |
> | Action | Microsoft.Logic/workflows/delete | Deletes the workflow. |
> | Action | Microsoft.Logic/workflows/detectors/read | Reads the workflow detector. |
> | Action | Microsoft.Logic/workflows/disable/action | Disables the workflow. |
> | Action | Microsoft.Logic/workflows/enable/action | Enables the workflow. |
> | Action | Microsoft.Logic/workflows/listCallbackUrl/action | Gets the callback URL for workflow. |
> | Action | Microsoft.Logic/workflows/listSwagger/action | Gets the workflow swagger definitions. |
> | Action | Microsoft.Logic/workflows/move/action | Moves Workflow from its existing subscription id, resource group, and/or name to a different subscription id, resource group, and/or name. |
> | Action | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/read | Reads the workflow diagnostic settings. |
> | Action | Microsoft.Logic/workflows/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the workflow diagnostic setting. |
> | Action | Microsoft.Logic/workflows/providers/Microsoft.Insights/logDefinitions/read | Reads the workflow log definitions. |
> | Action | Microsoft.Logic/workflows/providers/Microsoft.Insights/metricDefinitions/read | Reads the workflow metric definitions. |
> | Action | Microsoft.Logic/workflows/read | Reads the workflow. |
> | Action | Microsoft.Logic/workflows/regenerateAccessKey/action | Regenerates the access key secrets. |
> | Action | Microsoft.Logic/workflows/run/action | Starts a run of the workflow. |
> | Action | Microsoft.Logic/workflows/runs/actions/listExpressionTraces/action | Gets the workflow run action expression traces. |
> | Action | Microsoft.Logic/workflows/runs/actions/read | Reads the workflow run action. |
> | Action | Microsoft.Logic/workflows/runs/actions/repetitions/listExpressionTraces/action | Gets the workflow run action repetition expression traces. |
> | Action | Microsoft.Logic/workflows/runs/actions/repetitions/read | Reads the workflow run action repetition. |
> | Action | Microsoft.Logic/workflows/runs/actions/repetitions/requestHistories/read | Reads the workflow run repetition action request history. |
> | Action | Microsoft.Logic/workflows/runs/actions/requestHistories/read | Reads the workflow run action request history. |
> | Action | Microsoft.Logic/workflows/runs/actions/scoperepetitions/read | Reads the workflow run action scope repetition. |
> | Action | Microsoft.Logic/workflows/runs/cancel/action | Cancels the run of a workflow. |
> | Action | Microsoft.Logic/workflows/runs/delete | Deletes a run of a workflow. |
> | Action | Microsoft.Logic/workflows/runs/operations/read | Reads the workflow run operation status. |
> | Action | Microsoft.Logic/workflows/runs/read | Reads the workflow run. |
> | Action | Microsoft.Logic/workflows/suspend/action | Suspends the workflow. |
> | Action | Microsoft.Logic/workflows/triggers/histories/read | Reads the trigger histories. |
> | Action | Microsoft.Logic/workflows/triggers/histories/resubmit/action | Resubmits the workflow trigger. |
> | Action | Microsoft.Logic/workflows/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | Action | Microsoft.Logic/workflows/triggers/read | Reads the trigger. |
> | Action | Microsoft.Logic/workflows/triggers/reset/action | Resets the trigger. |
> | Action | Microsoft.Logic/workflows/triggers/run/action | Executes the trigger. |
> | Action | Microsoft.Logic/workflows/triggers/setState/action | Sets the trigger state. |
> | Action | Microsoft.Logic/workflows/validate/action | Validates the workflow. |
> | Action | Microsoft.Logic/workflows/versions/read | Reads the workflow version. |
> | Action | Microsoft.Logic/workflows/versions/triggers/listCallbackUrl/action | Gets the callback URL for trigger. |
> | Action | Microsoft.Logic/workflows/write | Creates or updates the workflow. |

## Microsoft.MachineLearning

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/move/action | Move any Machine Learning Commitment Plan Association |
> | Action | Microsoft.MachineLearning/commitmentPlans/commitmentAssociations/read | Read any Machine Learning Commitment Plan Association |
> | Action | Microsoft.MachineLearning/commitmentPlans/delete | Delete any Machine Learning Commitment Plan |
> | Action | Microsoft.MachineLearning/commitmentPlans/join/action | Join any Machine Learning Commitment Plan |
> | Action | Microsoft.MachineLearning/commitmentPlans/read | Read any Machine Learning Commitment Plan |
> | Action | Microsoft.MachineLearning/commitmentPlans/write | Create or Update any Machine Learning Commitment Plan |
> | Action | Microsoft.MachineLearning/locations/operationresults/read | Get result of a Machine Learning Operation |
> | Action | Microsoft.MachineLearning/locations/operationsstatus/read | Get status of an ongoing Machine Learning Operation |
> | Action | Microsoft.MachineLearning/operations/read | Get Machine Learning Operations |
> | Action | Microsoft.MachineLearning/register/action | Registers the subscription for the machine learning web service resource provider and enables the creation of web services. |
> | Action | Microsoft.MachineLearning/skus/read | Get Machine Learning Commitment Plan SKUs |
> | Action | Microsoft.MachineLearning/webServices/action | Create regional Web Service Properties for supported regions |
> | Action | Microsoft.MachineLearning/webServices/delete | Delete any Machine Learning Web Service |
> | Action | Microsoft.MachineLearning/webServices/listkeys/read | Get keys to a Machine Learning Web Service |
> | Action | Microsoft.MachineLearning/webServices/read | Read any Machine Learning Web Service |
> | Action | Microsoft.MachineLearning/webServices/write | Create or Update any Machine Learning Web Service |
> | Action | Microsoft.MachineLearning/Workspaces/delete | Delete any Machine Learning Workspace |
> | Action | Microsoft.MachineLearning/Workspaces/listworkspacekeys/action | List keys for a Machine Learning Workspace |
> | Action | Microsoft.MachineLearning/Workspaces/read | Read any Machine Learning Workspace |
> | Action | Microsoft.MachineLearning/Workspaces/resyncstoragekeys/action | Resync keys of storage account configured for a Machine Learning Workspace |
> | Action | Microsoft.MachineLearning/Workspaces/write | Create or Update any Machine Learning Workspace |

## Microsoft.MachineLearningServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.MachineLearningServices/locations/computeoperationsstatus/read | Gets the status of a particular compute operation |
> | Action | Microsoft.MachineLearningServices/locations/quotas/read | Gets the currently assigned Workspace Quotas based on VMFamily. |
> | Action | Microsoft.MachineLearningServices/locations/updateQuotas/action | Update quota for each VM family in workspace. |
> | Action | Microsoft.MachineLearningServices/locations/usages/read | Usage report for aml compute resources in a subscription |
> | Action | Microsoft.MachineLearningServices/locations/vmsizes/read | Get supported vm sizes |
> | Action | Microsoft.MachineLearningServices/locations/workspaceOperationsStatus/read | Gets the status of a particular workspace operation |
> | Action | Microsoft.MachineLearningServices/register/action | Registers the subscription for the Machine Learning Services Resource Provider |
> | Action | Microsoft.MachineLearningServices/workspaces/computes/delete | Deletes the compute resources in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/computes/listKeys/action | List secrets for compute resources in Machine Learning Services Workspace |
> | Action | Microsoft.MachineLearningServices/workspaces/computes/listNodes/action | List nodes for compute resource in Machine Learning Services Workspace |
> | Action | Microsoft.MachineLearningServices/workspaces/computes/read | Gets the compute resources in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/computes/write | Creates or updates the compute resources in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/read | Gets data drift detectors in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datadriftdetectors/write | Creates or updates data drift detectors in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/delete | Deletes registered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/preview/read | Gets dataset preview for registered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/read | Gets dataset profiles for registered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/profile/write | Creates or updates dataset profiles in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/read | Gets registered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/registered/write | Creates or updates registered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/delete | Deletes unregistered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/preview/read | Gets dataset preview for unregistered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/profile/read | Gets dataset profiles for unregistered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/read | Gets unregistered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datasets/unregistered/write | Creates or updates unregistered datasets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datastores/delete | Deletes datastores in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datastores/read | Gets datastores in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/datastores/write | Creates or updates datastores in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/delete | Deletes the Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/read | Gets published pipelines and pipeline endpoints  in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/endpoints/pipelines/write | Creates or updates published pipelines and pipeline endpoints in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/environments/build/action | Builds environments in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/environments/read | Gets environments in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/environments/readSecrets/action | Gets environments with secrets in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/environments/write | Creates or updates environments in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/eventGridFilters/read | Get an Event Grid filter for a particular workspace |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/delete | Deletes experiments in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/read | Gets experiments in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/runs/read | Gets runs in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/runs/scriptRun/submit/action | Creates or updates script runs in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/runs/write | Creates or updates runs in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/experiments/write | Creates or updates experiments in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/listKeys/action | List secrets for a Machine Learning Services Workspace |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/delete | Deletes artifacts in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/read | Gets artifacts in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/artifacts/write | Creates or updates artifacts in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/delete | Deletes snapshots in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/read | Gets snapshots in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/metadata/snapshots/write | Creates or updates snapshots in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/models/delete | Deletes models in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/models/download/action | Downloads models in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/models/package/action | Packages models in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/models/read | Gets models in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/models/write | Creates or updates models in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/modules/read | Gets modules in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/modules/write | Creates or updates module in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/delete | Deletes pipeline drafts in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/read | Gets pipeline drafts in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/pipelinedrafts/write | Creates or updates pipeline drafts in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/read | Gets the Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aci/delete | Deletes ACI services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aci/listkeys/action | Lists keys for ACI services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aci/write | Creates or updates ACI services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/devtest/delete | Deletes devtest AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/devtest/listkeys/action | Lists keys for devtest AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/devtest/score/action | Scores devtest AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/devtest/write | Creates or updates devtest AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/prod/delete | Deletes prod AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/prod/listkeys/action | Lists keys for prod AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/prod/score/action | Scores prod AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/aks/prod/write | Creates or updates prod AKS services in Machine Learning Services Workspace(s) |
> | DataAction | Microsoft.MachineLearningServices/workspaces/services/read | Gets services in Machine Learning Services Workspace(s) |
> | Action | Microsoft.MachineLearningServices/workspaces/write | Creates or updates a Machine Learning Services Workspace(s) |

## Microsoft.ManagedIdentity

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ManagedIdentity/identities/read | Gets an existing system assigned identity |
> | Action | Microsoft.ManagedIdentity/operations/read | Lists operations available on Microsoft.ManagedIdentity resource provider |
> | Action | Microsoft.ManagedIdentity/register/action | Registers the subscription for the managed identity resource provider |
> | Action | Microsoft.ManagedIdentity/userAssignedIdentities/assign/action | RBAC action for assigning an existing user assigned identity to a resource |
> | Action | Microsoft.ManagedIdentity/userAssignedIdentities/delete | Deletes an existing user assigned identity |
> | Action | Microsoft.ManagedIdentity/userAssignedIdentities/read | Gets an existing user assigned identity |
> | Action | Microsoft.ManagedIdentity/userAssignedIdentities/write | Creates a new user assigned identity or updates the tags associated with an existing user assigned identity |

## Microsoft.ManagedServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ManagedServices/marketplaceRegistrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Action | Microsoft.ManagedServices/operations/read | Retrieves a list of Managed Services operations. |
> | Action | Microsoft.ManagedServices/operationStatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.ManagedServices/register/action | Register to Managed Services. |
> | Action | Microsoft.ManagedServices/registrationAssignments/delete | Removes Managed Services registration assignment. |
> | Action | Microsoft.ManagedServices/registrationAssignments/read | Retrieves a list of Managed Services registration assignments. |
> | Action | Microsoft.ManagedServices/registrationAssignments/write | Add or modify Managed Services registration assignment. |
> | Action | Microsoft.ManagedServices/registrationDefinitions/delete | Removes Managed Services registration definition. |
> | Action | Microsoft.ManagedServices/registrationDefinitions/read | Retrieves a list of Managed Services registration definitions. |
> | Action | Microsoft.ManagedServices/registrationDefinitions/write | Add or modify Managed Services registration definition. |
> | Action | Microsoft.ManagedServices/unregister/action | Unregister from Managed Services. |

## Microsoft.Management

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Management/checkNameAvailability/action | Checks if the specified management group name is valid and unique. |
> | Action | Microsoft.Management/getEntities/action | List all entities (Management Groups, Subscriptions, etc.) for the authenticated user. |
> | Action | Microsoft.Management/managementGroups/delete | Delete management group. |
> | Action | Microsoft.Management/managementGroups/descendants/read | Gets all the descendants (Management Groups, Subscriptions) of a Management Group. |
> | Action | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Action | Microsoft.Management/managementGroups/subscriptions/delete | De-associates subscription from the management group. |
> | Action | Microsoft.Management/managementGroups/subscriptions/write | Associates existing subscription with the management group. |
> | Action | Microsoft.Management/managementGroups/write | Create or update a management group. |
> | Action | Microsoft.Management/register/action | Register the specified subscription with Microsoft.Management |

## Microsoft.Maps

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | DataAction | Microsoft.Maps/accounts/data/read | Grants data read access to a maps account. |
> | Action | Microsoft.Maps/accounts/delete | Delete a Maps Account. |
> | Action | Microsoft.Maps/accounts/eventGridFilters/delete | Delete an Event Grid filter |
> | Action | Microsoft.Maps/accounts/eventGridFilters/read | Get an Event Grid filter |
> | Action | Microsoft.Maps/accounts/eventGridFilters/write | Create or update an Event Grid filter |
> | Action | Microsoft.Maps/accounts/listKeys/action | List Maps Account keys |
> | Action | Microsoft.Maps/accounts/read | Get a Maps Account. |
> | Action | Microsoft.Maps/accounts/regenerateKey/action | Generate new Maps Account primary or secondary key |
> | Action | Microsoft.Maps/accounts/write | Create or update a Maps Account. |
> | Action | Microsoft.Maps/operations/read | Read the provider operations |
> | Action | Microsoft.Maps/register/action | Register the provider |

## Microsoft.Marketplace

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/read | Returns an Agreement. |
> | Action | Microsoft.Marketplace/offerTypes/publishers/offers/plans/agreements/write | Accepts a signed agreement. |
> | Action | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/importImage/action | Imports an image to the end user's ACR. |
> | Action | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/read | Returns a config. |
> | Action | Microsoft.Marketplace/offerTypes/publishers/offers/plans/configs/write | Saves a config. |
> | Action | Microsoft.Marketplace/register/action | Registers Microsoft.Marketplace resource provider in the subscription. |

## Microsoft.MarketplaceApps

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.MarketplaceApps/ClassicDevServices/delete | Does a DELETE operation on a classic dev service resource. |
> | Action | Microsoft.MarketplaceApps/ClassicDevServices/listSecrets/action | Gets a classic dev service resource management keys. |
> | Action | Microsoft.MarketplaceApps/ClassicDevServices/listSingleSignOnToken/action | Gets the Single Sign On URL for a classic dev service. |
> | Action | Microsoft.MarketplaceApps/ClassicDevServices/read | Does a GET operation on a classic dev service. |
> | Action | Microsoft.MarketplaceApps/ClassicDevServices/regenerateKey/action | Generates a classic dev service resource management keys. |
> | Action | Microsoft.MarketplaceApps/Operations/read | Read the operations for all resource types. |

## Microsoft.MarketplaceOrdering

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.MarketplaceOrdering/agreements/offers/plans/cancel/action | Cancel an agreement for a given marketplace item |
> | Action | Microsoft.MarketplaceOrdering/agreements/offers/plans/read | Return an agreement for a given marketplace item |
> | Action | Microsoft.MarketplaceOrdering/agreements/offers/plans/sign/action | Sign an agreement for a given marketplace item |
> | Action | Microsoft.MarketplaceOrdering/agreements/read | Return all agreements under given subscription |
> | Action | Microsoft.MarketplaceOrdering/offertypes/publishers/offers/plans/agreements/read | Get an agreement for a given marketplace virtual machine item |
> | Action | Microsoft.MarketplaceOrdering/offertypes/publishers/offers/plans/agreements/write | Sign or Cancel an agreement for a given marketplace virtual machine item |
> | Action | Microsoft.MarketplaceOrdering/operations/read | List all possible operations in the API |

## Microsoft.Media

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Media/checknameavailability/action | Checks if a Media Services account name is available |
> | Action | Microsoft.Media/mediaservices/accountfilters/delete | Delete any Account Filter |
> | Action | Microsoft.Media/mediaservices/accountfilters/read | Read any Account Filter |
> | Action | Microsoft.Media/mediaservices/accountfilters/write | Create or Update any Account Filter |
> | Action | Microsoft.Media/mediaservices/assets/assetfilters/delete | Delete any Asset Filter |
> | Action | Microsoft.Media/mediaservices/assets/assetfilters/read | Read any Asset Filter |
> | Action | Microsoft.Media/mediaservices/assets/assetfilters/write | Create or Update any Asset Filter |
> | Action | Microsoft.Media/mediaservices/assets/delete | Delete any Asset |
> | Action | Microsoft.Media/mediaservices/assets/getEncryptionKey/action | Get Asset Encryption Key |
> | Action | Microsoft.Media/mediaservices/assets/listContainerSas/action | List Asset Container SAS URLs |
> | Action | Microsoft.Media/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | Action | Microsoft.Media/mediaservices/assets/read | Read any Asset |
> | Action | Microsoft.Media/mediaservices/assets/write | Create or Update any Asset |
> | Action | Microsoft.Media/mediaservices/contentKeyPolicies/delete | Delete any Content Key Policy |
> | Action | Microsoft.Media/mediaservices/contentKeyPolicies/getPolicyPropertiesWithSecrets/action | Get Policy Properties With Secrets |
> | Action | Microsoft.Media/mediaservices/contentKeyPolicies/read | Read any Content Key Policy |
> | Action | Microsoft.Media/mediaservices/contentKeyPolicies/write | Create or Update any Content Key Policy |
> | Action | Microsoft.Media/mediaservices/delete | Delete any Media Services Account |
> | Action | Microsoft.Media/mediaservices/eventGridFilters/delete | Delete any Event Grid Filter |
> | Action | Microsoft.Media/mediaservices/eventGridFilters/read | Read any Event Grid Filter |
> | Action | Microsoft.Media/mediaservices/eventGridFilters/write | Create or Update any Event Grid Filter |
> | Action | Microsoft.Media/mediaservices/liveEventOperations/read | Read any Live Event Operation |
> | Action | Microsoft.Media/mediaservices/liveEvents/delete | Delete any Live Event |
> | Action | Microsoft.Media/mediaservices/liveEvents/liveOutputs/delete | Delete any Live Output |
> | Action | Microsoft.Media/mediaservices/liveEvents/liveOutputs/read | Read any Live Output |
> | Action | Microsoft.Media/mediaservices/liveEvents/liveOutputs/write | Create or Update any Live Output |
> | Action | Microsoft.Media/mediaservices/liveEvents/read | Read any Live Event |
> | Action | Microsoft.Media/mediaservices/liveEvents/reset/action | Reset any Live Event Operation |
> | Action | Microsoft.Media/mediaservices/liveEvents/start/action | Start any Live Event Operation |
> | Action | Microsoft.Media/mediaservices/liveEvents/stop/action | Stop any Live Event Operation |
> | Action | Microsoft.Media/mediaservices/liveEvents/write | Create or Update any Live Event |
> | Action | Microsoft.Media/mediaservices/liveOutputOperations/read | Read any Live Output Operation |
> | Action | Microsoft.Media/mediaservices/read | Read any Media Services Account |
> | Action | Microsoft.Media/mediaservices/streamingEndpointOperations/read | Read any Streaming Endpoint Operation |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/delete | Delete any Streaming Endpoint |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/read | Read any Streaming Endpoint |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/scale/action | Scale any Streaming Endpoint Operation |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/start/action | Start any Streaming Endpoint Operation |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/stop/action | Stop any Streaming Endpoint Operation |
> | Action | Microsoft.Media/mediaservices/streamingEndpoints/write | Create or Update any Streaming Endpoint |
> | Action | Microsoft.Media/mediaservices/streamingLocators/delete | Delete any Streaming Locator |
> | Action | Microsoft.Media/mediaservices/streamingLocators/listContentKeys/action | List Content Keys |
> | Action | Microsoft.Media/mediaservices/streamingLocators/listPaths/action | List Paths |
> | Action | Microsoft.Media/mediaservices/streamingLocators/read | Read any Streaming Locator |
> | Action | Microsoft.Media/mediaservices/streamingLocators/write | Create or Update any Streaming Locator |
> | Action | Microsoft.Media/mediaservices/streamingPolicies/delete | Delete any Streaming Policy |
> | Action | Microsoft.Media/mediaservices/streamingPolicies/read | Read any Streaming Policy |
> | Action | Microsoft.Media/mediaservices/streamingPolicies/write | Create or Update any Streaming Policy |
> | Action | Microsoft.Media/mediaservices/syncStorageKeys/action | Synchronize the Storage Keys for an attached Azure Storage account |
> | Action | Microsoft.Media/mediaservices/transforms/delete | Delete any Transform |
> | Action | Microsoft.Media/mediaservices/transforms/jobs/cancelJob/action | Cancel Job |
> | Action | Microsoft.Media/mediaservices/transforms/jobs/delete | Delete any Job |
> | Action | Microsoft.Media/mediaservices/transforms/jobs/read | Read any Job |
> | Action | Microsoft.Media/mediaservices/transforms/jobs/write | Create or Update any Job |
> | Action | Microsoft.Media/mediaservices/transforms/read | Read any Transform |
> | Action | Microsoft.Media/mediaservices/transforms/write | Create or Update any Transform |
> | Action | Microsoft.Media/mediaservices/write | Create or Update any Media Services Account |
> | Action | Microsoft.Media/operations/read | Get Available Operations |
> | Action | Microsoft.Media/register/action | Registers the subscription for the Media Services resource provider and enables the creation of Media Services accounts |
> | Action | Microsoft.Media/unregister/action | Unregisters the subscription for the Media Services resource provider |

## Microsoft.Migrate

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Migrate/assessmentprojects/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Action | Microsoft.Migrate/assessmentprojects/assessments/read | Lists assessments within a project |
> | Action | Microsoft.Migrate/assessmentprojects/delete | Deletes the assessment project |
> | Action | Microsoft.Migrate/assessmentprojects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Action | Microsoft.Migrate/assessmentprojects/groups/assessments/delete | Deletes an assessment |
> | Action | Microsoft.Migrate/assessmentprojects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Action | Microsoft.Migrate/assessmentprojects/groups/assessments/read | Gets the properties of an assessment |
> | Action | Microsoft.Migrate/assessmentprojects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Action | Microsoft.Migrate/assessmentprojects/groups/delete | Deletes a group |
> | Action | Microsoft.Migrate/assessmentprojects/groups/read | Get the properties of a group |
> | Action | Microsoft.Migrate/assessmentprojects/groups/updateMachines/action | Update group by adding or removing machines |
> | Action | Microsoft.Migrate/assessmentprojects/groups/write | Creates a new group or updates an existing group |
> | Action | Microsoft.Migrate/assessmentprojects/hypervcollectors/delete | Deletes the HyperV collector |
> | Action | Microsoft.Migrate/assessmentprojects/hypervcollectors/read | Gets the properties of HyperV collector |
> | Action | Microsoft.Migrate/assessmentprojects/hypervcollectors/write | Creates a new HyperV collector or updates an existing HyperV collector |
> | Action | Microsoft.Migrate/assessmentprojects/importcollectors/delete | Deletes the Import collector |
> | Action | Microsoft.Migrate/assessmentprojects/importcollectors/read | Gets the properties of Import collector |
> | Action | Microsoft.Migrate/assessmentprojects/importcollectors/write | Creates a new Import collector or updates an existing Import collector |
> | Action | Microsoft.Migrate/assessmentprojects/machines/read | Gets the properties of a machine |
> | Action | Microsoft.Migrate/assessmentprojects/read | Gets the properties of assessment project |
> | Action | Microsoft.Migrate/assessmentprojects/servercollectors/read | Gets the properties of Server collector |
> | Action | Microsoft.Migrate/assessmentprojects/servercollectors/write | Creates a new Server collector or updates an existing Server collector |
> | Action | Microsoft.Migrate/assessmentprojects/vmwarecollectors/delete | Deletes the VMware collector |
> | Action | Microsoft.Migrate/assessmentprojects/vmwarecollectors/read | Gets the properties of VMware collector |
> | Action | Microsoft.Migrate/assessmentprojects/vmwarecollectors/write | Creates a new VMware collector or updates an existing VMware collector |
> | Action | Microsoft.Migrate/assessmentprojects/write | Creates a new assessment project or updates an existing assessment project |
> | Action | Microsoft.Migrate/locations/assessmentOptions/read | Gets the assessment options which are available in the given location |
> | Action | Microsoft.Migrate/locations/checknameavailability/action | Checks availability of the resource name for the given subscription in the given location |
> | Action | Microsoft.Migrate/migrateprojects/DatabaseInstances/read | Gets the properties of a database instance |
> | Action | Microsoft.Migrate/migrateprojects/Databases/read | Gets the properties of a database |
> | Action | Microsoft.Migrate/migrateprojects/delete | Deletes a migrate project |
> | Action | Microsoft.Migrate/migrateprojects/machines/read | Gets the properties of a machine |
> | Action | Microsoft.Migrate/migrateprojects/MigrateEvents/Delete | Deletes a migrate event |
> | Action | Microsoft.Migrate/migrateprojects/MigrateEvents/read | Gets the properties of a migrate events. |
> | Action | Microsoft.Migrate/migrateprojects/read | Gets the properties of migrate project |
> | Action | Microsoft.Migrate/migrateprojects/RefreshSummary/action | Refreshes the migrate project summary |
> | Action | Microsoft.Migrate/migrateprojects/registerTool/action | Registers tool to a migrate project |
> | Action | Microsoft.Migrate/migrateprojects/solutions/cleanupData/action | Clean up the migrate project solution data |
> | Action | Microsoft.Migrate/migrateprojects/solutions/Delete | Deletes a  migrate project solution |
> | Action | Microsoft.Migrate/migrateprojects/solutions/getconfig/action | Gets the migrate project solution configuration |
> | Action | Microsoft.Migrate/migrateprojects/solutions/read | Gets the properties of migrate project solution |
> | Action | Microsoft.Migrate/migrateprojects/solutions/write | Creates a new migrate project solution or updates an existing migrate project solution |
> | Action | Microsoft.Migrate/migrateprojects/write | Creates a new migrate project or updates an existing migrate project |
> | Action | Microsoft.Migrate/Operations/read | Lists operations available on Microsoft.Migrate resource provider |
> | Action | Microsoft.Migrate/projects/assessments/read | Lists assessments within a project |
> | Action | Microsoft.Migrate/projects/delete | Deletes the project |
> | Action | Microsoft.Migrate/projects/groups/assessments/assessedmachines/read | Get the properties of an assessed machine |
> | Action | Microsoft.Migrate/projects/groups/assessments/delete | Deletes an assessment |
> | Action | Microsoft.Migrate/projects/groups/assessments/downloadurl/action | Downloads an assessment report's URL |
> | Action | Microsoft.Migrate/projects/groups/assessments/read | Gets the properties of an assessment |
> | Action | Microsoft.Migrate/projects/groups/assessments/write | Creates a new assessment or updates an existing assessment |
> | Action | Microsoft.Migrate/projects/groups/delete | Deletes a group |
> | Action | Microsoft.Migrate/projects/groups/read | Get the properties of a group |
> | Action | Microsoft.Migrate/projects/groups/write | Creates a new group or updates an existing group |
> | Action | Microsoft.Migrate/projects/keys/action | Gets shared keys for the project |
> | Action | Microsoft.Migrate/projects/machines/read | Gets the properties of a machine |
> | Action | Microsoft.Migrate/projects/read | Gets the properties of a project |
> | Action | Microsoft.Migrate/projects/write | Creates a new project or updates an existing project |
> | Action | Microsoft.Migrate/register/action | Registers Subscription with Microsoft.Migrate resource provider |

## Microsoft.MixedReality

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.MixedReality/register/action | Registers a subscription for the Mixed Reality resource provider. |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/delete | Delete spatial anchors |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Action | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Action | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for Microsoft.MixedReality/spatialAnchorsAccounts |
> | Action | Microsoft.MixedReality/spatialAnchorsAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Microsoft.MixedReality/spatialAnchorsAccounts |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | DataAction | Microsoft.MixedReality/SpatialAnchorsAccounts/write | Update spatial anchors properties |

## Microsoft.NetApp

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.NetApp/locations/checkfilepathavailability/action | Check if file path is available |
> | Action | Microsoft.NetApp/locations/checknameavailability/action | Check if resource name is available |
> | Action | Microsoft.NetApp/locations/operationresults/read | Reads an operation result resource. |
> | Action | Microsoft.NetApp/locations/read | Reads an availability check resource. |
> | Action | Microsoft.NetApp/netAppAccounts/backupPolicies/delete | Deletes a backup policy resource. |
> | Action | Microsoft.NetApp/netAppAccounts/backupPolicies/read | Reads a backup policy resource. |
> | Action | Microsoft.NetApp/netAppAccounts/backupPolicies/write | Writes a backup policy resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/delete | Deletes a pool resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/read | Reads a pool resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/delete | Deletes a backup resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/read | Reads a backup resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/backups/write | Writes a backup resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/break/action | Break volume replication relations |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/delete | Deletes a volume resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/mountTargets/read | Reads a mount target resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/read | Reads a volume resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/ReplicationStatus/action | Reads the statuses of the Volume Replication. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/revert/action | Revert volume to specific snapshot |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/delete | Deletes a snapshot resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/read | Reads a snapshot resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/snapshots/write | Writes a snapshot resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/volumes/write | Writes a volume resource. |
> | Action | Microsoft.NetApp/netAppAccounts/capacityPools/write | Writes a pool resource. |
> | Action | Microsoft.NetApp/netAppAccounts/delete | Deletes an account resource. |
> | Action | Microsoft.NetApp/netAppAccounts/read | Reads an account resource. |
> | Action | Microsoft.NetApp/netAppAccounts/vaults/read | Reads a vault resource. |
> | Action | Microsoft.NetApp/netAppAccounts/write | Writes an account resource. |
> | Action | Microsoft.NetApp/Operations/read | Reads an operation resources. |
> | Action | Microsoft.NetApp/register/action | Registers Subscription with Microsoft.NetApp resource provider |
> | Action | Microsoft.NetApp/unregister/action | Unregisters Subscription with Microsoft.NetApp resource provider |

## Microsoft.Network

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Network/applicationGatewayAvailableRequestHeaders/read | Get Application Gateway available Request Headers |
> | Action | Microsoft.Network/applicationGatewayAvailableResponseHeaders/read | Get Application Gateway available Response Header |
> | Action | Microsoft.Network/applicationGatewayAvailableServerVariables/read | Get Application Gateway available Server Variables |
> | Action | Microsoft.Network/applicationGatewayAvailableSslOptions/predefinedPolicies/read | Application Gateway Ssl Predefined Policy |
> | Action | Microsoft.Network/applicationGatewayAvailableSslOptions/read | Application Gateway available Ssl Options |
> | Action | Microsoft.Network/applicationGatewayAvailableWafRuleSets/read | Gets Application Gateway Available Waf Rule Sets |
> | Action | Microsoft.Network/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool. Not Alertable. |
> | Action | Microsoft.Network/applicationGateways/backendhealth/action | Gets an application gateway backend health |
> | Action | Microsoft.Network/applicationGateways/delete | Deletes an application gateway |
> | Action | Microsoft.Network/applicationGateways/getBackendHealthOnDemand/action | Gets an application gateway backend health on demand for given http setting and backend pool |
> | Action | Microsoft.Network/applicationGateways/read | Gets an application gateway |
> | Action | Microsoft.Network/applicationGateways/start/action | Starts an application gateway |
> | Action | Microsoft.Network/applicationGateways/stop/action | Stops an application gateway |
> | Action | Microsoft.Network/applicationGateways/write | Creates an application gateway or updates an application gateway |
> | Action | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/delete | Deletes an Application Gateway WAF policy |
> | Action | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/read | Gets an Application Gateway WAF policy |
> | Action | Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies/write | Creates an Application Gateway WAF policy or updates an Application Gateway WAF policy |
> | Action | Microsoft.Network/applicationSecurityGroups/delete | Deletes an Application Security Group |
> | Action | Microsoft.Network/applicationSecurityGroups/joinIpConfiguration/action | Joins an IP Configuration to Application Security Groups. Not alertable. |
> | Action | Microsoft.Network/applicationSecurityGroups/joinNetworkSecurityRule/action | Joins a Security Rule to Application Security Groups. Not alertable. |
> | Action | Microsoft.Network/applicationSecurityGroups/listIpConfigurations/action | Lists IP Configurations in the ApplicationSecurityGroup |
> | Action | Microsoft.Network/applicationSecurityGroups/read | Gets an Application Security Group ID. |
> | Action | Microsoft.Network/applicationSecurityGroups/write | Creates an Application Security Group, or updates an existing Application Security Group. |
> | Action | Microsoft.Network/azureFirewallFqdnTags/read | Gets Azure Firewall FQDN Tags |
> | Action | Microsoft.Network/azurefirewalls/delete | Delete Azure Firewall |
> | Action | Microsoft.Network/azurefirewalls/read | Get Azure Firewall |
> | Action | Microsoft.Network/azurefirewalls/write | Creates or updates an Azure Firewall |
> | Action | Microsoft.Network/bastionHosts/createbsl/action | Creates shareable urls for the VMs under a bastion and returns the urls |
> | Action | Microsoft.Network/bastionHosts/delete | Deletes a Bastion Host |
> | Action | Microsoft.Network/bastionHosts/deletebsl/action | Deletes shareable urls for the provided VMs under a bastion |
> | Action | Microsoft.Network/bastionHosts/disconnectactivesessions/action | Disconnect given Active Sessions in the Bastion Host |
> | Action | Microsoft.Network/bastionHosts/getactivesessions/action | Get Active Sessions in the Bastion Host |
> | Action | Microsoft.Network/bastionHosts/getbsl/action | Returns the shareable urls for the specified VMs in a Bastion subnet provided their urls are created |
> | Action | Microsoft.Network/bastionHosts/read | Gets a Bastion Host |
> | Action | Microsoft.Network/bastionHosts/write | Create or Update a Bastion Host |
> | Action | Microsoft.Network/bgpServiceCommunities/read | Get Bgp Service Communities |
> | Action | Microsoft.Network/checkFrontDoorNameAvailability/action | Checks whether a Front Door name is available |
> | Action | Microsoft.Network/checkTrafficManagerNameAvailability/action | Checks the availability of a Traffic Manager Relative DNS name. |
> | Action | Microsoft.Network/connections/delete | Deletes VirtualNetworkGatewayConnection |
> | Action | Microsoft.Network/connections/read | Gets VirtualNetworkGatewayConnection |
> | Action | Microsoft.Network/connections/revoke/action | Marks an Express Route Connection status as Revoked |
> | Action | Microsoft.Network/connections/sharedkey/action | Get VirtualNetworkGatewayConnection SharedKey |
> | Action | Microsoft.Network/connections/sharedKey/read | Gets VirtualNetworkGatewayConnection SharedKey |
> | Action | Microsoft.Network/connections/sharedKey/write | Creates or updates an existing VirtualNetworkGatewayConnection SharedKey |
> | Action | Microsoft.Network/connections/startpacketcapture/action | Starts a Virtual Network Gateway Connection Packet Capture. |
> | Action | Microsoft.Network/connections/stoppacketcapture/action | Stops a Virtual Network Gateway Connection Packet Capture. |
> | Action | Microsoft.Network/connections/vpndeviceconfigurationscript/action | Gets Vpn Device Configuration of VirtualNetworkGatewayConnection |
> | Action | Microsoft.Network/connections/write | Creates or updates an existing VirtualNetworkGatewayConnection |
> | Action | Microsoft.Network/ddosCustomPolicies/delete | Deletes a DDoS customized policy |
> | Action | Microsoft.Network/ddosCustomPolicies/read | Gets a DDoS customized policy definition Definition |
> | Action | Microsoft.Network/ddosCustomPolicies/write | Creates a DDoS customized policy or updates an existing DDoS customized policy |
> | Action | Microsoft.Network/ddosProtectionPlans/delete | Deletes a DDoS Protection Plan |
> | Action | Microsoft.Network/ddosProtectionPlans/join/action | Joins a DDoS Protection Plan. Not alertable. |
> | Action | Microsoft.Network/ddosProtectionPlans/read | Gets a DDoS Protection Plan |
> | Action | Microsoft.Network/ddosProtectionPlans/write | Creates a DDoS Protection Plan or updates a DDoS Protection Plan  |
> | Action | Microsoft.Network/dnsoperationresults/read | Gets results of a DNS operation |
> | Action | Microsoft.Network/dnsoperationstatuses/read | Gets status of a DNS operation  |
> | Action | Microsoft.Network/dnszones/A/delete | Remove the record set of a given name and type ‘A’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/A/read | Get the record set of type ‘A’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/A/write | Create or update a record set of type ‘A’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/AAAA/delete | Remove the record set of a given name and type ‘AAAA’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/AAAA/read | Get the record set of type ‘AAAA’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/AAAA/write | Create or update a record set of type ‘AAAA’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/all/read | Gets DNS record sets across types |
> | Action | Microsoft.Network/dnszones/CAA/delete | Remove the record set of a given name and type ‘CAA’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/CAA/read | Get the record set of type ‘CAA’, in JSON format. The record set contains the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/CAA/write | Create or update a record set of type ‘CAA’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/CNAME/delete | Remove the record set of a given name and type ‘CNAME’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/CNAME/read | Get the record set of type ‘CNAME’, in JSON format. The record set contains the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/CNAME/write | Create or update a record set of type ‘CNAME’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/delete | Delete the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. |
> | Action | Microsoft.Network/dnszones/MX/delete | Remove the record set of a given name and type ‘MX’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/MX/read | Get the record set of type ‘MX’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/MX/write | Create or update a record set of type ‘MX’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/NS/delete | Deletes the DNS record set of type NS |
> | Action | Microsoft.Network/dnszones/NS/read | Gets DNS record set of type NS |
> | Action | Microsoft.Network/dnszones/NS/write | Creates or updates DNS record set of type NS |
> | Action | Microsoft.Network/dnszones/PTR/delete | Remove the record set of a given name and type ‘PTR’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/PTR/read | Get the record set of type ‘PTR’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/PTR/write | Create or update a record set of type ‘PTR’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/read | Get the DNS zone, in JSON format. The zone properties include tags, etag, numberOfRecordSets, and maxNumberOfRecordSets. Note that this command does not retrieve the record sets contained within the zone. |
> | Action | Microsoft.Network/dnszones/recordsets/read | Gets DNS record sets across types |
> | Action | Microsoft.Network/dnszones/SOA/read | Gets DNS record set of type SOA |
> | Action | Microsoft.Network/dnszones/SOA/write | Creates or updates DNS record set of type SOA |
> | Action | Microsoft.Network/dnszones/SRV/delete | Remove the record set of a given name and type ‘SRV’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/SRV/read | Get the record set of type ‘SRV’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/SRV/write | Create or update record set of type SRV |
> | Action | Microsoft.Network/dnszones/TXT/delete | Remove the record set of a given name and type ‘TXT’ from a DNS zone. |
> | Action | Microsoft.Network/dnszones/TXT/read | Get the record set of type ‘TXT’, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/dnszones/TXT/write | Create or update a record set of type ‘TXT’ within a DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/dnszones/write | Create or update a DNS zone within a resource group.  Used to update the tags on a DNS zone resource. Note that this command can not be used to create or update record sets within the zone. |
> | Action | Microsoft.Network/expressRouteCircuits/authorizations/delete | Deletes an ExpressRouteCircuit Authorization |
> | Action | Microsoft.Network/expressRouteCircuits/authorizations/read | Gets an ExpressRouteCircuit Authorization |
> | Action | Microsoft.Network/expressRouteCircuits/authorizations/write | Creates or updates an existing ExpressRouteCircuit Authorization |
> | Action | Microsoft.Network/expressRouteCircuits/delete | Deletes an ExpressRouteCircuit |
> | Action | Microsoft.Network/expressRouteCircuits/join/action | Joins an Express Route Circuit. Not alertable. |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/arpTables/read | Gets an ExpressRouteCircuit Peering ArpTable |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/connections/delete | Deletes an ExpressRouteCircuit Connection |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/connections/read | Gets an ExpressRouteCircuit Connection |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/connections/write | Creates or updates an existing ExpressRouteCircuit Connection Resource |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/delete | Deletes an ExpressRouteCircuit Peering |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/peerConnections/read | Gets Peer Express Route Circuit Connection |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/read | Gets an ExpressRouteCircuit Peering |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/routeTables/read | Gets an ExpressRouteCircuit Peering RouteTable |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/routeTablesSummary/read | Gets an ExpressRouteCircuit Peering RouteTable Summary |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/stats/read | Gets an ExpressRouteCircuit Peering Stat |
> | Action | Microsoft.Network/expressRouteCircuits/peerings/write | Creates or updates an existing ExpressRouteCircuit Peering |
> | Action | Microsoft.Network/expressRouteCircuits/read | Get an ExpressRouteCircuit |
> | Action | Microsoft.Network/expressRouteCircuits/stats/read | Gets an ExpressRouteCircuit Stat |
> | Action | Microsoft.Network/expressRouteCircuits/write | Creates or updates an existing ExpressRouteCircuit |
> | Action | Microsoft.Network/expressRouteCrossConnections/join/action | Joins an Express Route Cross Connection. Not alertable. |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/arpTables/read | Gets an Express Route Cross Connection Peering Arp Table |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/delete | Deletes an Express Route Cross Connection Peering |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/read | Gets an Express Route Cross Connection Peering |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/routeTables/read | Gets an Express Route Cross Connection Peering Route Table |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/routeTableSummary/read | Gets an Express Route Cross Connection Peering Route Table Summary |
> | Action | Microsoft.Network/expressRouteCrossConnections/peerings/write | Creates an Express Route Cross Connection Peering or Updates an existing Express Route Cross Connection Peering |
> | Action | Microsoft.Network/expressRouteCrossConnections/read | Get Express Route Cross Connection |
> | Action | Microsoft.Network/expressRouteGateways/expressRouteConnections/delete | Deletes an Express Route Connection |
> | Action | Microsoft.Network/expressRouteGateways/expressRouteConnections/read | Gets an Express Route Connection |
> | Action | Microsoft.Network/expressRouteGateways/expressRouteConnections/write | Creates an Express Route Connection or Updates an existing Express Route Connection |
> | Action | Microsoft.Network/expressRouteGateways/join/action | Joins an Express Route Gateway. Not alertable. |
> | Action | Microsoft.Network/expressRouteGateways/read | Get Express Route Gateway |
> | Action | Microsoft.Network/expressRoutePorts/delete | Deletes ExpressRoutePorts |
> | Action | Microsoft.Network/expressRoutePorts/join/action | Joins Express Route ports. Not alertable. |
> | Action | Microsoft.Network/expressRoutePorts/links/read | Gets ExpressRouteLink |
> | Action | Microsoft.Network/expressRoutePorts/read | Gets ExpressRoutePorts |
> | Action | Microsoft.Network/expressRoutePorts/write | Creates or updates ExpressRoutePorts |
> | Action | Microsoft.Network/expressRoutePortsLocations/read | Get Express Route Ports Locations |
> | Action | Microsoft.Network/expressRouteServiceProviders/read | Gets Express Route Service Providers |
> | Action | Microsoft.Network/firewallPolicies/delete | Deletes a Firewall Policy |
> | Action | Microsoft.Network/firewallPolicies/join/action | Joins a Firewall Policy. Not alertable. |
> | Action | Microsoft.Network/firewallPolicies/read | Gets a Firewall Policy |
> | Action | Microsoft.Network/firewallPolicies/ruleGroups/delete | Deletes a Firewall Policy Rule Group |
> | Action | Microsoft.Network/firewallPolicies/ruleGroups/read | Gets a Firewall Policy Rule Group |
> | Action | Microsoft.Network/firewallPolicies/ruleGroups/write | Creates a Firewall Policy Rule Group or Updates an existing Firewall Policy Rule Group |
> | Action | Microsoft.Network/firewallPolicies/write | Creates a Firewall Policy or Updates an existing Firewall Policy |
> | Action | Microsoft.Network/frontDoors/backendPools/delete | Deletes a backend pool |
> | Action | Microsoft.Network/frontDoors/backendPools/read | Gets a backend pool |
> | Action | Microsoft.Network/frontDoors/backendPools/write | Creates or updates a backend pool |
> | Action | Microsoft.Network/frontDoors/delete | Deletes a Front Door |
> | Action | Microsoft.Network/frontDoors/frontendEndpoints/delete | Deletes a frontend endpoint |
> | Action | Microsoft.Network/frontDoors/frontendEndpoints/disableHttps/action | Disables HTTPS on a Frontend Endpoint |
> | Action | Microsoft.Network/frontDoors/frontendEndpoints/enableHttps/action | Enables HTTPS on a Frontend Endpoint |
> | Action | Microsoft.Network/frontDoors/frontendEndpoints/read | Gets a frontend endpoint |
> | Action | Microsoft.Network/frontDoors/frontendEndpoints/write | Creates or updates a frontend endpoint |
> | Action | Microsoft.Network/frontDoors/healthProbeSettings/delete | Deletes health probe settings |
> | Action | Microsoft.Network/frontDoors/healthProbeSettings/read | Gets health probe settings |
> | Action | Microsoft.Network/frontDoors/healthProbeSettings/write | Creates or updates health probe settings |
> | Action | Microsoft.Network/frontDoors/loadBalancingSettings/delete | Creates or updates load balancing settings |
> | Action | Microsoft.Network/frontDoors/loadBalancingSettings/read | Gets load balancing settings |
> | Action | Microsoft.Network/frontDoors/loadBalancingSettings/write | Creates or updates load balancing settings |
> | Action | Microsoft.Network/frontDoors/purge/action | Purge cached content from a Front Door |
> | Action | Microsoft.Network/frontDoors/read | Gets a Front Door |
> | Action | Microsoft.Network/frontDoors/routingRules/delete | Deletes a routing rule |
> | Action | Microsoft.Network/frontDoors/routingRules/read | Gets a routing rule |
> | Action | Microsoft.Network/frontDoors/routingRules/write | Creates or updates a routing rule |
> | Action | Microsoft.Network/frontDoors/validateCustomDomain/action | Validates a frontend endpoint for a Front Door |
> | Action | Microsoft.Network/frontDoors/write | Creates or updates a Front Door |
> | Action | Microsoft.Network/frontDoorWebApplicationFirewallManagedRuleSets/read | Gets Web Application Firewall Managed Rule Sets |
> | Action | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/delete | Deletes a Web Application Firewall Policy |
> | Action | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/join/action | Joins a Web Application Firewall Policy. Not Alertable. |
> | Action | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/read | Gets a Web Application Firewall Policy |
> | Action | Microsoft.Network/frontDoorWebApplicationFirewallPolicies/write | Creates or updates a Web Application Firewall Policy |
> | Action | Microsoft.Network/ipGroups/delete | Deletes an IpGroup |
> | Action | Microsoft.Network/ipGroups/join/action | Joins an IpGroup. Not alertable. |
> | Action | Microsoft.Network/ipGroups/read | Gets an IpGroup |
> | Action | Microsoft.Network/ipGroups/write | Creates an IpGroup or Updates An Existing IpGroups |
> | Action | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | Action | Microsoft.Network/loadBalancers/backendAddressPools/read | Gets a load balancer backend address pool definition |
> | Action | Microsoft.Network/loadBalancers/delete | Deletes a load balancer |
> | Action | Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action | Joins a Load Balancer Frontend IP Configuration. Not alertable. |
> | Action | Microsoft.Network/loadBalancers/frontendIPConfigurations/read | Gets a load balancer frontend IP configuration definition |
> | Action | Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
> | Action | Microsoft.Network/loadBalancers/inboundNatPools/read | Gets a load balancer inbound nat pool definition |
> | Action | Microsoft.Network/loadBalancers/inboundNatRules/delete | Deletes a load balancer inbound nat rule |
> | Action | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | Action | Microsoft.Network/loadBalancers/inboundNatRules/read | Gets a load balancer inbound nat rule definition |
> | Action | Microsoft.Network/loadBalancers/inboundNatRules/write | Creates a load balancer inbound nat rule or updates an existing load balancer inbound nat rule |
> | Action | Microsoft.Network/loadBalancers/loadBalancingRules/read | Gets a load balancer load balancing rule definition |
> | Action | Microsoft.Network/loadBalancers/networkInterfaces/read | Gets references to all the network interfaces under a load balancer |
> | Action | Microsoft.Network/loadBalancers/outboundRules/read | Gets a load balancer outbound rule definition |
> | Action | Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. Not alertable. |
> | Action | Microsoft.Network/loadBalancers/probes/read | Gets a load balancer probe |
> | Action | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Action | Microsoft.Network/loadBalancers/virtualMachines/read | Gets references to all the virtual machines under a load balancer |
> | Action | Microsoft.Network/loadBalancers/write | Creates a load balancer or updates an existing load balancer |
> | Action | Microsoft.Network/localnetworkgateways/delete | Deletes LocalNetworkGateway |
> | Action | Microsoft.Network/localnetworkgateways/read | Gets LocalNetworkGateway |
> | Action | Microsoft.Network/localnetworkgateways/write | Creates or updates an existing LocalNetworkGateway |
> | Action | Microsoft.Network/locations/autoApprovedPrivateLinkServices/read | Gets Auto Approved Private Link Services |
> | Action | Microsoft.Network/locations/availableDelegations/read | Gets Available Delegations |
> | Action | Microsoft.Network/locations/availablePrivateEndpointTypes/read | Gets available Private Endpoint resources |
> | Action | Microsoft.Network/locations/availableServiceAliases/read | Gets Available Service Aliases |
> | Action | Microsoft.Network/locations/bareMetalTenants/action | Allocates or validates a Bare Metal Tenant |
> | Action | Microsoft.Network/locations/checkAcceleratedNetworkingSupport/action | Checks Accelerated Networking support |
> | Action | Microsoft.Network/locations/checkDnsNameAvailability/read | Checks if dns label is available at the specified location |
> | Action | Microsoft.Network/locations/checkPrivateLinkServiceVisibility/action | Checks Private Link Service Visibility |
> | Action | Microsoft.Network/locations/operationResults/read | Gets operation result of an async POST or DELETE operation |
> | Action | Microsoft.Network/locations/operations/read | Gets operation resource that represents status of an asynchronous operation |
> | Action | Microsoft.Network/locations/serviceTags/read | Get Service Tags |
> | Action | Microsoft.Network/locations/supportedVirtualMachineSizes/read | Gets supported virtual machines sizes |
> | Action | Microsoft.Network/locations/usages/read | Gets the resources usage metrics |
> | Action | Microsoft.Network/locations/virtualNetworkAvailableEndpointServices/read | Gets a list of available Virtual Network Endpoint Services |
> | Action | Microsoft.Network/networkIntentPolicies/delete | Deletes an Network Intent Policy |
> | Action | Microsoft.Network/networkIntentPolicies/read | Gets an Network Intent Policy Description |
> | Action | Microsoft.Network/networkIntentPolicies/write | Creates an Network Intent Policy or updates an existing Network Intent Policy |
> | Action | Microsoft.Network/networkInterfaces/delete | Deletes a network interface |
> | Action | Microsoft.Network/networkInterfaces/effectiveNetworkSecurityGroups/action | Get Network Security Groups configured On Network Interface Of The Vm |
> | Action | Microsoft.Network/networkInterfaces/effectiveRouteTable/action | Get Route Table configured On Network Interface Of The Vm |
> | Action | Microsoft.Network/networkInterfaces/ipconfigurations/join/action | Joins a Network Interface IP Configuration. Not alertable. |
> | Action | Microsoft.Network/networkInterfaces/ipconfigurations/read | Gets a network interface ip configuration definition.  |
> | Action | Microsoft.Network/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | Action | Microsoft.Network/networkInterfaces/loadBalancers/read | Gets all the load balancers that the network interface is part of |
> | Action | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Action | Microsoft.Network/networkInterfaces/tapConfigurations/delete | Deletes a Network Interface Tap Configuration. |
> | Action | Microsoft.Network/networkInterfaces/tapConfigurations/read | Gets a Network Interface Tap Configuration. |
> | Action | Microsoft.Network/networkInterfaces/tapConfigurations/write | Creates a Network Interface Tap Configuration or updates an existing Network Interface Tap Configuration. |
> | Action | Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | Action | Microsoft.Network/networkProfiles/delete | Deletes a Network Profile |
> | Action | Microsoft.Network/networkProfiles/read | Gets a Network Profile |
> | Action | Microsoft.Network/networkProfiles/removeContainers/action | Removes Containers |
> | Action | Microsoft.Network/networkProfiles/setContainers/action | Sets Containers |
> | Action | Microsoft.Network/networkProfiles/setNetworkInterfaces/action | Sets Container Network Interfaces |
> | Action | Microsoft.Network/networkProfiles/write | Creates or updates a Network Profile |
> | Action | Microsoft.Network/networkSecurityGroups/defaultSecurityRules/read | Gets a default security rule definition |
> | Action | Microsoft.Network/networkSecurityGroups/delete | Deletes a network security group |
> | Action | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Action | Microsoft.Network/networkSecurityGroups/read | Gets a network security group definition |
> | Action | Microsoft.Network/networkSecurityGroups/securityRules/delete | Deletes a security rule |
> | Action | Microsoft.Network/networkSecurityGroups/securityRules/read | Gets a security rule definition |
> | Action | Microsoft.Network/networkSecurityGroups/securityRules/write | Creates a security rule or updates an existing security rule |
> | Action | Microsoft.Network/networkSecurityGroups/write | Creates a network security group or updates an existing network security group |
> | Action | Microsoft.Network/networkWatchers/availableProvidersList/action | Returns all available internet service providers for a specified Azure region. |
> | Action | Microsoft.Network/networkWatchers/azureReachabilityReport/action | Returns the relative latency score for internet service providers from a specified location to Azure regions. |
> | Action | Microsoft.Network/networkWatchers/configureFlowLog/action | Configures flow logging for a target resource. |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/delete | Deletes a Connection Monitor |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/query/action | Query monitoring connectivity between specified endpoints |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/read | Get Connection Monitor details |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/start/action | Start monitoring connectivity between specified endpoints |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/stop/action | Stop/pause monitoring connectivity between specified endpoints |
> | Action | Microsoft.Network/networkWatchers/connectionMonitors/write | Creates a Connection Monitor |
> | Action | Microsoft.Network/networkWatchers/connectivityCheck/action | Verifies the possibility of establishing a direct TCP connection from a virtual machine to a given endpoint including another VM or an arbitrary remote server. |
> | Action | Microsoft.Network/networkWatchers/delete | Deletes a network watcher |
> | Action | Microsoft.Network/networkWatchers/flowLogs/delete | Deletes a Flow Log |
> | Action | Microsoft.Network/networkWatchers/flowLogs/read | Get Flow Log details |
> | Action | Microsoft.Network/networkWatchers/flowLogs/write | Creates a Flow Log |
> | Action | Microsoft.Network/networkWatchers/ipFlowVerify/action | Returns whether the packet is allowed or denied to or from a particular destination. |
> | Action | Microsoft.Network/networkWatchers/lenses/delete | Deletes a Lens |
> | Action | Microsoft.Network/networkWatchers/lenses/query/action | Query monitoring network traffic on a specified endpoint |
> | Action | Microsoft.Network/networkWatchers/lenses/read | Get Lens details |
> | Action | Microsoft.Network/networkWatchers/lenses/start/action | Start monitoring network traffic on a specified endpoint |
> | Action | Microsoft.Network/networkWatchers/lenses/stop/action | Stop/pause monitoring network traffic on a specified endpoint |
> | Action | Microsoft.Network/networkWatchers/lenses/write | Creates a Lens |
> | Action | Microsoft.Network/networkWatchers/networkConfigurationDiagnostic/action | Diagnostic of network configuration. |
> | Action | Microsoft.Network/networkWatchers/nextHop/action | For a specified target and destination IP address, return the next hop type and next hope IP address. |
> | Action | Microsoft.Network/networkWatchers/packetCaptures/delete | Deletes a packet capture |
> | Action | Microsoft.Network/networkWatchers/packetCaptures/queryStatus/action | Gets information about properties and status of a packet capture resource. |
> | Action | Microsoft.Network/networkWatchers/packetCaptures/read | Get the packet capture definition |
> | Action | Microsoft.Network/networkWatchers/packetCaptures/stop/action | Stop the running packet capture session. |
> | Action | Microsoft.Network/networkWatchers/packetCaptures/write | Creates a packet capture |
> | Action | Microsoft.Network/networkWatchers/pingMeshes/delete | Deletes a PingMesh |
> | Action | Microsoft.Network/networkWatchers/pingMeshes/read | Get PingMesh details |
> | Action | Microsoft.Network/networkWatchers/pingMeshes/start/action | Start PingMesh between specified VMs |
> | Action | Microsoft.Network/networkWatchers/pingMeshes/stop/action | Stop PingMesh between specified VMs |
> | Action | Microsoft.Network/networkWatchers/pingMeshes/write | Creates a PingMesh |
> | Action | Microsoft.Network/networkWatchers/queryConnectionMonitors/action | Batch query monitoring connectivity between specified endpoints |
> | Action | Microsoft.Network/networkWatchers/queryFlowLogStatus/action | Gets the status of flow logging on a resource. |
> | Action | Microsoft.Network/networkWatchers/queryTroubleshootResult/action | Gets the troubleshooting result from the previously run or currently running troubleshooting operation. |
> | Action | Microsoft.Network/networkWatchers/read | Get the network watcher definition |
> | Action | Microsoft.Network/networkWatchers/securityGroupView/action | View the configured and effective network security group rules applied on a VM. |
> | Action | Microsoft.Network/networkWatchers/topology/action | Gets a network level view of resources and their relationships in a resource group. |
> | Action | Microsoft.Network/networkWatchers/troubleshoot/action | Starts troubleshooting on a Networking resource in Azure. |
> | Action | Microsoft.Network/networkWatchers/write | Creates a network watcher or updates an existing network watcher |
> | Action | Microsoft.Network/operations/read | Get Available Operations |
> | Action | Microsoft.Network/p2sVpnGateways/delete | Deletes a P2SVpnGateway. |
> | Action | Microsoft.Network/p2sVpnGateways/disconnectp2svpnconnections/action | Disconnect p2s vpn connections |
> | Action | Microsoft.Network/p2sVpnGateways/generatevpnprofile/action | Generate Vpn Profile for P2SVpnGateway |
> | Action | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealth/action | Gets a P2S Vpn Connection health for P2SVpnGateway |
> | Action | Microsoft.Network/p2sVpnGateways/getp2svpnconnectionhealthdetailed/action | Gets a P2S Vpn Connection health detailed for P2SVpnGateway |
> | Action | Microsoft.Network/p2sVpnGateways/read | Gets a P2SVpnGateway. |
> | Action | Microsoft.Network/p2sVpnGateways/write | Puts a P2SVpnGateway. |
> | Action | Microsoft.Network/privateDnsOperationResults/read | Gets results of a Private DNS operation |
> | Action | Microsoft.Network/privateDnsOperationStatuses/read | Gets status of a Private DNS operation |
> | Action | Microsoft.Network/privateDnsZones/A/delete | Remove the record set of a given name and type ‘A’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/A/read | Get the record set of type ‘A’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/A/write | Create or update a record set of type ‘A’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/AAAA/delete | Remove the record set of a given name and type ‘AAAA’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/AAAA/read | Get the record set of type ‘AAAA’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/AAAA/write | Create or update a record set of type ‘AAAA’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/ALL/read | Gets Private DNS record sets across types |
> | Action | Microsoft.Network/privateDnsZones/CNAME/delete | Remove the record set of a given name and type ‘CNAME’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/CNAME/read | Get the record set of type ‘CNAME’ within a Private DNS zone, in JSON format. |
> | Action | Microsoft.Network/privateDnsZones/CNAME/write | Create or update a record set of type ‘CNAME’ within a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/delete | Delete a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/MX/delete | Remove the record set of a given name and type ‘MX’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/MX/read | Get the record set of type ‘MX’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/MX/write | Create or update a record set of type ‘MX’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/PTR/delete | Remove the record set of a given name and type ‘PTR’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/PTR/read | Get the record set of type ‘PTR’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/PTR/write | Create or update a record set of type ‘PTR’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/read | Get the Private DNS zone properties, in JSON format. Note that this command does not retrieve the virtual networks to which the Private DNS zone is linked or the record sets contained within the zone. |
> | Action | Microsoft.Network/privateDnsZones/recordsets/read | Gets Private DNS record sets across types |
> | Action | Microsoft.Network/privateDnsZones/SOA/read | Get the record set of type ‘SOA’ within a Private DNS zone, in JSON format. |
> | Action | Microsoft.Network/privateDnsZones/SOA/write | Update a record set of type ‘SOA’ within a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/SRV/delete | Remove the record set of a given name and type ‘SRV’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/SRV/read | Get the record set of type ‘SRV’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/SRV/write | Create or update a record set of type ‘SRV’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/TXT/delete | Remove the record set of a given name and type ‘TXT’ from a Private DNS zone. |
> | Action | Microsoft.Network/privateDnsZones/TXT/read | Get the record set of type ‘TXT’ within a Private DNS zone, in JSON format. The record set contains a list of records as well as the TTL, tags, and etag. |
> | Action | Microsoft.Network/privateDnsZones/TXT/write | Create or update a record set of type ‘TXT’ within a Private DNS zone. The records specified will replace the current records in the record set. |
> | Action | Microsoft.Network/privateDnsZones/virtualNetworkLinks/delete | Delete a Private DNS zone link to virtual network. |
> | Action | Microsoft.Network/privateDnsZones/virtualNetworkLinks/read | Get the Private DNS zone link to virtual network properties, in JSON format. |
> | Action | Microsoft.Network/privateDnsZones/virtualNetworkLinks/write | Create or update a Private DNS zone link to virtual network. |
> | Action | Microsoft.Network/privateDnsZones/write | Create or update a Private DNS zone within a resource group. Note that this command cannot be used to create or update virtual network links or record sets within the zone. |
> | Action | Microsoft.Network/privateEndpointRedirectMaps/read | Gets a Private Endpoint RedirectMap |
> | Action | Microsoft.Network/privateEndpointRedirectMaps/write | Creates Private Endpoint RedirectMap Or Updates An Existing Private Endpoint RedirectMap |
> | Action | Microsoft.Network/privateEndpoints/delete | Deletes an private endpoint resource. |
> | Action | Microsoft.Network/privateEndpoints/read | Gets an private endpoint resource. |
> | Action | Microsoft.Network/privateEndpoints/write | Creates a new private endpoint, or updates an existing private endpoint. |
> | Action | Microsoft.Network/privateLinkServices/delete | Deletes an private link service resource. |
> | Action | Microsoft.Network/privateLinkServices/privateEndpointConnections/delete | Deletes an private endpoint connection. |
> | Action | Microsoft.Network/privateLinkServices/privateEndpointConnections/read | Gets an private endpoint connection definition. |
> | Action | Microsoft.Network/privateLinkServices/privateEndpointConnections/write | Creates a new private endpoint connection, or updates an existing private endpoint connection. |
> | Action | Microsoft.Network/privateLinkServices/read | Gets an private link service resource. |
> | Action | Microsoft.Network/privateLinkServices/write | Creates a new private link service, or updates an existing private link service. |
> | Action | Microsoft.Network/publicIPAddresses/delete | Deletes a public Ip address. |
> | Action | Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address. Not Alertable. |
> | Action | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Action | Microsoft.Network/publicIPAddresses/write | Creates a public Ip address or updates an existing public Ip address.  |
> | Action | Microsoft.Network/publicIPPrefixes/delete | Deletes A Public Ip Prefix |
> | Action | Microsoft.Network/publicIPPrefixes/join/action | Joins a PublicIPPrefix. Not alertable. |
> | Action | Microsoft.Network/publicIPPrefixes/read | Gets a Public Ip Prefix Definition |
> | Action | Microsoft.Network/publicIPPrefixes/write | Creates A Public Ip Prefix Or Updates An Existing Public Ip Prefix |
> | Action | Microsoft.Network/register/action | Registers the subscription |
> | Action | Microsoft.Network/routeFilters/delete | Deletes a route filter definition |
> | Action | Microsoft.Network/routeFilters/join/action | Joins a route filter. Not Alertable. |
> | Action | Microsoft.Network/routeFilters/read | Gets a route filter definition |
> | Action | Microsoft.Network/routeFilters/routeFilterRules/delete | Deletes a route filter rule definition |
> | Action | Microsoft.Network/routeFilters/routeFilterRules/read | Gets a route filter rule definition |
> | Action | Microsoft.Network/routeFilters/routeFilterRules/write | Creates a route filter rule or Updates an existing route filter rule |
> | Action | Microsoft.Network/routeFilters/write | Creates a route filter or Updates an existing route filter |
> | Action | Microsoft.Network/routeTables/delete | Deletes a route table definition |
> | Action | Microsoft.Network/routeTables/join/action | Joins a route table. Not Alertable. |
> | Action | Microsoft.Network/routeTables/read | Gets a route table definition |
> | Action | Microsoft.Network/routeTables/routes/delete | Deletes a route definition |
> | Action | Microsoft.Network/routeTables/routes/read | Gets a route definition |
> | Action | Microsoft.Network/routeTables/routes/write | Creates a route or Updates an existing route |
> | Action | Microsoft.Network/routeTables/write | Creates a route table or Updates an existing route table |
> | Action | Microsoft.Network/serviceEndpointPolicies/delete | Deletes a Service Endpoint Policy |
> | Action | Microsoft.Network/serviceEndpointPolicies/join/action | Joins a Service Endpoint Policy. Not alertable. |
> | Action | Microsoft.Network/serviceEndpointPolicies/joinSubnet/action | Joins a Subnet To Service Endpoint Policies. Not alertable. |
> | Action | Microsoft.Network/serviceEndpointPolicies/read | Gets a Service Endpoint Policy Description |
> | Action | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/delete | Deletes a Service Endpoint Policy Definition |
> | Action | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/read | Gets a Service Endpoint Policy Definition Description |
> | Action | Microsoft.Network/serviceEndpointPolicies/serviceEndpointPolicyDefinitions/write | Creates a Service Endpoint Policy Definition or updates an existing Service Endpoint Policy Definition |
> | Action | Microsoft.Network/serviceEndpointPolicies/write | Creates a Service Endpoint Policy or updates an existing Service Endpoint Policy |
> | Action | Microsoft.Network/trafficManagerGeographicHierarchies/read | Gets the Traffic Manager Geographic Hierarchy containing regions which can be used with the Geographic traffic routing method |
> | Action | Microsoft.Network/trafficManagerProfiles/azureEndpoints/delete | Deletes an Azure Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Azure Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/azureEndpoints/read | Gets an Azure Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Azure Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/azureEndpoints/write | Add a new Azure Endpoint in an existing Traffic Manager Profile or update the properties of an existing Azure Endpoint in that Traffic Manager Profile. |
> | Action | Microsoft.Network/trafficManagerProfiles/delete | Delete the Traffic Manager profile. All settings associated with the Traffic Manager profile will be lost, and the profile can no longer be used to route traffic. |
> | Action | Microsoft.Network/trafficManagerProfiles/externalEndpoints/delete | Deletes an External Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted External Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/externalEndpoints/read | Gets an External Endpoint which belongs to a Traffic Manager Profile, including all the properties of that External Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/externalEndpoints/write | Add a new External Endpoint in an existing Traffic Manager Profile or update the properties of an existing External Endpoint in that Traffic Manager Profile. |
> | Action | Microsoft.Network/trafficManagerProfiles/heatMaps/read | Gets the Traffic Manager Heat Map for the given Traffic Manager profile which contains query counts and latency data by location and source IP. |
> | Action | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/delete | Deletes an Nested Endpoint from an existing Traffic Manager Profile. Traffic Manager will stop routing traffic to the deleted Nested Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/read | Gets an Nested Endpoint which belongs to a Traffic Manager Profile, including all the properties of that Nested Endpoint. |
> | Action | Microsoft.Network/trafficManagerProfiles/nestedEndpoints/write | Add a new Nested Endpoint in an existing Traffic Manager Profile or update the properties of an existing Nested Endpoint in that Traffic Manager Profile. |
> | Action | Microsoft.Network/trafficManagerProfiles/read | Get the Traffic Manager profile configuration. This includes DNS settings, traffic routing settings, endpoint monitoring settings, and the list of endpoints routed by this Traffic Manager profile. |
> | Action | Microsoft.Network/trafficManagerProfiles/write | Create a Traffic Manager profile, or modify the configuration of an existing Traffic Manager profile.<br>This includes enabling or disabling a profile and modifying DNS settings, traffic routing settings, or endpoint monitoring settings.<br>Endpoints routed by the Traffic Manager profile can be added, removed, enabled or disabled. |
> | Action | Microsoft.Network/trafficManagerUserMetricsKeys/delete | Deletes the subscription-level key used for Realtime User Metrics collection. |
> | Action | Microsoft.Network/trafficManagerUserMetricsKeys/read | Gets the subscription-level key used for Realtime User Metrics collection. |
> | Action | Microsoft.Network/trafficManagerUserMetricsKeys/write | Creates a new subscription-level key to be used for Realtime User Metrics collection. |
> | Action | Microsoft.Network/unregister/action | Unregisters the subscription |
> | Action | Microsoft.Network/virtualHubs/delete | Deletes a Virtual Hub |
> | Action | Microsoft.Network/virtualHubs/effectiveRoutes/action | Gets effective route configured on Virtual Hub |
> | Action | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/delete | Deletes a HubVirtualNetworkConnection |
> | Action | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/read | Get a HubVirtualNetworkConnection |
> | Action | Microsoft.Network/virtualHubs/hubVirtualNetworkConnections/write | Create or update a HubVirtualNetworkConnection |
> | Action | Microsoft.Network/virtualHubs/read | Get a Virtual Hub |
> | Action | Microsoft.Network/virtualHubs/routeTables/delete | Delete a VirtualHubRouteTableV2 |
> | Action | Microsoft.Network/virtualHubs/routeTables/read | Get a VirtualHubRouteTableV2 |
> | Action | Microsoft.Network/virtualHubs/routeTables/write | Create or Update a VirtualHubRouteTableV2 |
> | Action | Microsoft.Network/virtualHubs/write | Create or update a Virtual Hub |
> | Action | microsoft.network/virtualnetworkgateways/connections/read | Get VirtualNetworkGatewayConnection |
> | Action | Microsoft.Network/virtualNetworkGateways/delete | Deletes a virtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/disconnectvirtualnetworkgatewayvpnconnections/action | Disconnect virtual network gateway vpn connections |
> | Action | microsoft.network/virtualnetworkgateways/generatevpnclientpackage/action | Generate VpnClient package for virtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/generatevpnprofile/action | Generate VpnProfile package for VirtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/getadvertisedroutes/action | Gets virtualNetworkGateway advertised routes |
> | Action | microsoft.network/virtualnetworkgateways/getbgppeerstatus/action | Gets virtualNetworkGateway bgp peer status |
> | Action | microsoft.network/virtualnetworkgateways/getlearnedroutes/action | Gets virtualnetworkgateway learned routes |
> | Action | microsoft.network/virtualnetworkgateways/getvpnclientconnectionhealth/action | Get Per Vpn Client Connection Health for VirtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/getvpnclientipsecparameters/action | Get Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | Action | microsoft.network/virtualnetworkgateways/getvpnprofilepackageurl/action | Gets the URL of a pre-generated vpn client profile package |
> | Action | Microsoft.Network/virtualNetworkGateways/read | Gets a VirtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/reset/action | Resets a virtualNetworkGateway |
> | Action | microsoft.network/virtualnetworkgateways/resetvpnclientsharedkey/action | Reset Vpnclient shared key for VirtualNetworkGateway P2S client. |
> | Action | microsoft.network/virtualnetworkgateways/setvpnclientipsecparameters/action | Set Vpnclient Ipsec parameters for VirtualNetworkGateway P2S client. |
> | Action | microsoft.network/virtualnetworkgateways/startpacketcapture/action | Starts a Virtual Network Gateway Packet Capture. |
> | Action | microsoft.network/virtualnetworkgateways/stoppacketcapture/action | Stops a Virtual Network Gateway Packet Capture. |
> | Action | Microsoft.Network/virtualnetworkgateways/supportedvpndevices/action | Lists Supported Vpn Devices |
> | Action | Microsoft.Network/virtualNetworkGateways/write | Creates or updates a VirtualNetworkGateway |
> | Action | Microsoft.Network/virtualNetworks/BastionHosts/action | Gets Bastion Host references in a Virtual Network. |
> | Action | Microsoft.Network/virtualNetworks/bastionHosts/default/action | Gets Bastion Host references in a Virtual Network. |
> | Action | Microsoft.Network/virtualNetworks/checkIpAddressAvailability/read | Check if Ip Address is available at the specified virtual network |
> | Action | Microsoft.Network/virtualNetworks/delete | Deletes a virtual network |
> | Action | Microsoft.Network/virtualNetworks/join/action | Joins a virtual network. Not Alertable. |
> | Action | Microsoft.Network/virtualNetworks/peer/action | Peers a virtual network with another virtual network |
> | Action | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Action | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/delete | Deletes A Contextual Service Endpoint Policy |
> | Action | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/read | Gets Contextual Service Endpoint Policies |
> | Action | Microsoft.Network/virtualNetworks/subnets/contextualServiceEndpointPolicies/write | Creates a Contextual Service Endpoint Policy or updates an existing Contextual Service Endpoint Policy |
> | Action | Microsoft.Network/virtualNetworks/subnets/delete | Deletes a virtual network subnet |
> | Action | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Action | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Action | Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action | Prepares a subnet by applying necessary Network Policies |
> | Action | Microsoft.Network/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | Action | Microsoft.Network/virtualNetworks/subnets/unprepareNetworkPolicies/action | Unprepare a subnet by removing the applied Network Policies |
> | Action | Microsoft.Network/virtualNetworks/subnets/virtualMachines/read | Gets references to all the virtual machines in a virtual network subnet |
> | Action | Microsoft.Network/virtualNetworks/subnets/write | Creates a virtual network subnet or updates an existing virtual network subnet |
> | Action | Microsoft.Network/virtualNetworks/usages/read | Get the IP usages for each subnet of the virtual network |
> | Action | Microsoft.Network/virtualNetworks/virtualMachines/read | Gets references to all the virtual machines in a virtual network |
> | Action | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/delete | Deletes a virtual network peering |
> | Action | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/read | Gets a virtual network peering definition |
> | Action | Microsoft.Network/virtualNetworks/virtualNetworkPeerings/write | Creates a virtual network peering or updates an existing virtual network peering |
> | Action | Microsoft.Network/virtualNetworks/write | Creates a virtual network or updates an existing virtual network |
> | Action | Microsoft.Network/virtualNetworkTaps/delete | Delete Virtual Network Tap |
> | Action | Microsoft.Network/virtualNetworkTaps/join/action | Joins a virtual network tap. Not Alertable. |
> | Action | Microsoft.Network/virtualNetworkTaps/read | Get Virtual Network Tap |
> | Action | Microsoft.Network/virtualNetworkTaps/write | Create or Update Virtual Network Tap |
> | Action | Microsoft.Network/virtualRouters/delete | Deletes A VirtualRouter |
> | Action | Microsoft.Network/virtualRouters/join/action | Joins A VirtualRouter. Not alertable. |
> | Action | Microsoft.Network/virtualRouters/peerings/delete | Deletes A VirtualRouterPeering |
> | Action | Microsoft.Network/virtualRouters/peerings/read | Gets A VirtualRouterPeering |
> | Action | Microsoft.Network/virtualRouters/peerings/write | Creates A VirtualRouterPeering or Updates An Existing VirtualRouterPeering |
> | Action | Microsoft.Network/virtualRouters/read | Gets A VirtualRouter |
> | Action | Microsoft.Network/virtualRouters/write | Creates A VirtualRouter or Updates An Existing VirtualRouter |
> | Action | Microsoft.Network/virtualWans/delete | Deletes a Virtual Wan |
> | Action | Microsoft.Network/virtualwans/generateVpnProfile/action | Generate VirtualWanVpnServerConfiguration VpnProfile |
> | Action | Microsoft.network/virtualWans/p2sVpnServerConfigurations/delete | Deletes a virtual Wan P2SVpnServerConfiguration |
> | Action | Microsoft.Network/virtualWans/p2sVpnServerConfigurations/read | Gets a virtual Wan P2SVpnServerConfiguration |
> | Action | Microsoft.network/virtualWans/p2sVpnServerConfigurations/write | Creates a virtual Wan P2SVpnServerConfiguration or updates an existing virtual Wan P2SVpnServerConfiguration |
> | Action | Microsoft.Network/virtualWans/read | Get a Virtual Wan |
> | Action | Microsoft.Network/virtualwans/supportedSecurityProviders/read | Gets supported VirtualWan Security Providers. |
> | Action | Microsoft.Network/virtualWans/virtualHubs/read | Gets all Virtual Hubs that reference a Virtual Wan. |
> | Action | Microsoft.Network/virtualwans/vpnconfiguration/action | Gets a Vpn Configuration |
> | Action | Microsoft.Network/virtualwans/vpnServerConfigurations/action | Get VirtualWanVpnServerConfigurations |
> | Action | Microsoft.Network/virtualWans/vpnSites/read | Gets all VPN Sites that reference a Virtual Wan. |
> | Action | Microsoft.Network/virtualWans/write | Create or update a Virtual Wan |
> | Action | Microsoft.Network/vpnGateways/delete | Deletes a VpnGateway. |
> | Action | microsoft.network/vpngateways/listvpnconnectionshealth/action | Gets connection health for all or a subset of connections on a VpnGateway |
> | Action | Microsoft.Network/vpnGateways/read | Gets a VpnGateway. |
> | Action | microsoft.network/vpngateways/reset/action | Resets a VpnGateway |
> | Action | microsoft.network/vpnGateways/vpnConnections/delete | Deletes a VpnConnection. |
> | Action | microsoft.network/vpnGateways/vpnConnections/read | Gets a VpnConnection. |
> | Action | microsoft.network/vpnGateways/vpnConnections/vpnLinkConnections/read | Gets a Vpn Link Connection |
> | Action | microsoft.network/vpnGateways/vpnConnections/write | Puts a VpnConnection. |
> | Action | Microsoft.Network/vpnGateways/write | Puts a VpnGateway. |
> | Action | Microsoft.Network/vpnServerConfigurations/delete | Delete VpnServerConfiguration |
> | Action | Microsoft.Network/vpnServerConfigurations/read | Get VpnServerConfiguration |
> | Action | Microsoft.Network/vpnServerConfigurations/write | Create or Update VpnServerConfiguration |
> | Action | Microsoft.Network/vpnsites/delete | Deletes a Vpn Site resource. |
> | Action | Microsoft.Network/vpnsites/read | Gets a Vpn Site resource. |
> | Action | microsoft.network/vpnSites/vpnSiteLinks/read | Gets a Vpn Site Link |
> | Action | Microsoft.Network/vpnsites/write | Creates or updates a Vpn Site resource. |

## Microsoft.NotificationHubs

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.NotificationHubs/CheckNamespaceAvailability/action | Checks whether or not a given Namespace resource name is available within the NotificationHub service. |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/action | Get the list of Namespaces Authorization Rules description. |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/regenerateKeys/action | Namespace Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Action | Microsoft.NotificationHubs/Namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Action | Microsoft.NotificationHubs/Namespaces/CheckNotificationHubAvailability/action | Checks whether or not a given NotificationHub name is available inside a Namespace. |
> | Action | Microsoft.NotificationHubs/Namespaces/Delete | Delete Namespace Resource |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/action | Get the list of Notification Hub Authorization Rules |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/delete | Delete Notification Hub Authorization Rules |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/listkeys/action | Get the Connection String to the Notification Hub |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/read | Get the list of Notification Hub Authorization Rules |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/regenerateKeys/action | Notification Hub Authorization Rule Regenerate Primary/SecondaryKey, Specify the Key that needs to be regenerated |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/authorizationRules/write | Create Notification Hub Authorization Rules and Update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/debugSend/action | Send a test push notification. |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/Delete | Delete Notification Hub Resource |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/pnsCredentials/action | Get All Notification Hub PNS Credentials. This includes, WNS, MPNS, APNS, GCM and Baidu credentials |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/read | Get list of Notification Hub Resource Descriptions |
> | Action | Microsoft.NotificationHubs/Namespaces/NotificationHubs/write | Create a Notification Hub and Update its properties. Its properties mainly include PNS Credentials. Authorization Rules and TTL |
> | Action | Microsoft.NotificationHubs/Namespaces/read | Get the list of Namespace Resource Description |
> | Action | Microsoft.NotificationHubs/Namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Action | Microsoft.NotificationHubs/operationResults/read | Returns operation results for Notification Hubs provider |
> | Action | Microsoft.NotificationHubs/operations/read | Returns a list of supported operations for Notification Hubs provider |
> | Action | Microsoft.NotificationHubs/register/action | Registers the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |
> | Action | Microsoft.NotificationHubs/unregister/action | Unregisters the subscription for the NotificationHubs resource provider and enables the creation of Namespaces and NotificationHubs |

## Microsoft.OffAzure

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.OffAzure/HyperVSites/clusters/read | Gets the properties of a Hyper-V cluster |
> | Action | Microsoft.OffAzure/HyperVSites/clusters/write | Creates or updates the Hyper-V cluster |
> | Action | Microsoft.OffAzure/HyperVSites/delete | Deletes the Hyper-V site |
> | Action | Microsoft.OffAzure/HyperVSites/healthsummary/read | Gets the health summary for Hyper-V resource |
> | Action | Microsoft.OffAzure/HyperVSites/hosts/read | Gets the properties of a Hyper-V host |
> | Action | Microsoft.OffAzure/HyperVSites/hosts/write | Creates or updates the Hyper-V host |
> | Action | Microsoft.OffAzure/HyperVSites/jobs/read | Gets the properties of a Hyper-V jobs |
> | Action | Microsoft.OffAzure/HyperVSites/machines/read | Gets the properties of a Hyper-V machines |
> | Action | Microsoft.OffAzure/HyperVSites/operationsstatus/read | Gets the properties of a Hyper-V operation status |
> | Action | Microsoft.OffAzure/HyperVSites/read | Gets the properties of a Hyper-V site |
> | Action | Microsoft.OffAzure/HyperVSites/refresh/action | Refreshes the objects within a Hyper-V site |
> | Action | Microsoft.OffAzure/HyperVSites/runasaccounts/read | Gets the properties of a Hyper-V run as accounts |
> | Action | Microsoft.OffAzure/HyperVSites/usage/read | Gets the usages of a Hyper-V site |
> | Action | Microsoft.OffAzure/HyperVSites/write | Creates or updates the Hyper-V site |
> | Action | Microsoft.OffAzure/Operations/read | Reads the exposed operations |
> | Action | Microsoft.OffAzure/register/action | Registers Subscription with Microsoft.OffAzure resource provider |
> | Action | Microsoft.OffAzure/ServerSites/jobs/read | Gets the properties of a Server jobs |
> | Action | Microsoft.OffAzure/ServerSites/machines/read | Gets the properties of a Server machines |
> | Action | Microsoft.OffAzure/ServerSites/machines/write | Write the properties of a Server machines |
> | Action | Microsoft.OffAzure/ServerSites/operationsstatus/read | Gets the properties of a Server operation status |
> | Action | Microsoft.OffAzure/ServerSites/read | Gets the properties of a Server site |
> | Action | Microsoft.OffAzure/ServerSites/refresh/action | Refreshes the objects within a Server site |
> | Action | Microsoft.OffAzure/ServerSites/runasaccounts/read | Gets the properties of a Server run as accounts |
> | Action | Microsoft.OffAzure/ServerSites/usage/read | Gets the usages of a Server site |
> | Action | Microsoft.OffAzure/ServerSites/write | Creates or updates the Server site |
> | Action | Microsoft.OffAzure/VMwareSites/delete | Deletes the VMware site |
> | Action | Microsoft.OffAzure/VMwareSites/healthsummary/read | Gets the health summary for VMware resource |
> | Action | Microsoft.OffAzure/VMwareSites/jobs/read | Gets the properties of a VMware jobs |
> | Action | Microsoft.OffAzure/VMwareSites/machines/read | Gets the properties of a VMware machines |
> | Action | Microsoft.OffAzure/VMwareSites/machines/start/action | Start VMware machines |
> | Action | Microsoft.OffAzure/VMwareSites/machines/stop/action | Stops the VMware machines |
> | Action | Microsoft.OffAzure/VMwareSites/operationsstatus/read | Gets the properties of a VMware operation status |
> | Action | Microsoft.OffAzure/VMwareSites/read | Gets the properties of a VMware site |
> | Action | Microsoft.OffAzure/VMwareSites/refresh/action | Refreshes the objects within a VMware site |
> | Action | Microsoft.OffAzure/VMwareSites/runasaccounts/read | Gets the properties of a VMware run as accounts |
> | Action | Microsoft.OffAzure/VMwareSites/usage/read | Gets the usages of a VMware site |
> | Action | Microsoft.OffAzure/VMwareSites/vcenters/read | Gets the properties of a VMware vCenter |
> | Action | Microsoft.OffAzure/VMwareSites/vcenters/write | Creates or updates the VMware vCenter |
> | Action | Microsoft.OffAzure/VMwareSites/write | Creates or updates the VMware site |

## Microsoft.OperationalInsights

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.OperationalInsights/linkTargets/read | Lists existing accounts that are not associated with an Azure subscription. To link this Azure subscription to a workspace, use a customer id returned by this operation in the customer id property of the Create Workspace operation. |
> | Action | microsoft.operationalinsights/operations/read | Lists all of the available OperationalInsights Rest API operations. |
> | Action | microsoft.operationalinsights/register/action | Rergisters the subscription. |
> | Action | Microsoft.OperationalInsights/register/action | Register a subscription to a resource provider. |
> | Action | microsoft.operationalinsights/unregister/action | Unregisters the subscription. |
> | Action | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Action | Microsoft.OperationalInsights/workspaces/analytics/query/schema/read | Get search schema V2. |
> | Action | Microsoft.OperationalInsights/workspaces/api/query/action | Search using new engine. |
> | Action | Microsoft.OperationalInsights/workspaces/api/query/schema/read | Get search schema V2. |
> | Action | Microsoft.OperationalInsights/workspaces/configurationScopes/delete | Delete Configuration Scope |
> | Action | Microsoft.OperationalInsights/workspaces/configurationScopes/read | Get Configuration Scope |
> | Action | Microsoft.OperationalInsights/workspaces/configurationScopes/write | Set Configuration Scope |
> | Action | Microsoft.OperationalInsights/workspaces/datasources/delete | Delete datasources under a workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/datasources/read | Get datasources under a workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/datasources/write | Create/Update datasources under a workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/delete | Deletes a workspace. If the workspace was linked to an existing workspace at creation time then the workspace it was linked to is not deleted. |
> | Action | Microsoft.OperationalInsights/workspaces/gateways/delete | Removes a gateway configured for the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/generateregistrationcertificate/action | Generates Registration Certificate for the workspace. This Certificate is used to connect Microsoft System Center Operation Manager to the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/intelligencepacks/disable/action | Disables an intelligence pack for a given workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/intelligencepacks/enable/action | Enables an intelligence pack for a given workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/intelligencepacks/read | Lists all intelligence packs that are visible for a given workspace and also lists whether the pack is enabled or disabled for that workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/linkedServices/delete | Delete linked services under given workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/linkedServices/read | Get linked services under given workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/linkedServices/write | Create/Update linked services under given workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/listKeys/action | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/listKeys/read | Retrieves the list keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/managementGroups/read | Gets the names and metadata for System Center Operations Manager management groups connected to this workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/metricDefinitions/read | Get Metric Definitions under workspace |
> | Action | Microsoft.OperationalInsights/workspaces/notificationSettings/delete | Delete the user's notification settings for the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/notificationSettings/read | Get the user's notification settings for the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/notificationSettings/write | Set the user's notification settings for the workspace. |
> | Action | microsoft.operationalinsights/workspaces/operations/read | Gets the status of an OperationalInsights workspace operation. |
> | Action | Microsoft.OperationalInsights/workspaces/purge/action | Delete specified data from workspace |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountLogon/read | Read data from the AADDomainServicesAccountLogon table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesAccountManagement/read | Read data from the AADDomainServicesAccountManagement table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesDirectoryServiceAccess/read | Read data from the AADDomainServicesDirectoryServiceAccess table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesLogonLogoff/read | Read data from the AADDomainServicesLogonLogoff table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPolicyChange/read | Read data from the AADDomainServicesPolicyChange table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesPrivilegeUse/read | Read data from the AADDomainServicesPrivilegeUse table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AADDomainServicesSystemSecurity/read | Read data from the AADDomainServicesSystemSecurity table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADAssessmentRecommendation/read | Read data from the ADAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupAlerts/read | Read data from the AddonAzureBackupAlerts table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupJobs/read | Read data from the AddonAzureBackupJobs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupPolicy/read | Read data from the AddonAzureBackupPolicy table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupProtectedInstance/read | Read data from the AddonAzureBackupProtectedInstance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AddonAzureBackupStorage/read | Read data from the AddonAzureBackupStorage table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADFActivityRun/read | Read data from the ADFActivityRun table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADFPipelineRun/read | Read data from the ADFPipelineRun table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADFTriggerRun/read | Read data from the ADFTriggerRun table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADReplicationResult/read | Read data from the ADReplicationResult table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ADSecurityAssessmentRecommendation/read | Read data from the ADSecurityAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AegDeliveryFailureLogs/read | Read data from the AegDeliveryFailureLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AegPublishFailureLogs/read | Read data from the AegPublishFailureLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Alert/read | Read data from the Alert table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AlertHistory/read | Read data from the AlertHistory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterEvent/read | Read data from the AmlComputeClusterEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AmlComputeClusterNodeEvent/read | Read data from the AmlComputeClusterNodeEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AmlComputeJobEvent/read | Read data from the AmlComputeJobEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ApiManagementGatewayLogs/read | Read data from the ApiManagementGatewayLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppCenterError/read | Read data from the AppCenterError table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ApplicationInsights/read | Read data from the ApplicationInsights table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppPlatformLogsforSpring/read | Read data from the AppPlatformLogsforSpring table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppPlatformSystemLogs/read | Read data from the AppPlatformSystemLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppServiceAppLogs/read | Read data from the AppServiceAppLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppServiceAuditLogs/read | Read data from the AppServiceAuditLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppServiceConsoleLogs/read | Read data from the AppServiceConsoleLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppServiceEnvironmentPlatformLogs/read | Read data from the AppServiceEnvironmentPlatformLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AppServiceHTTPLogs/read | Read data from the AppServiceHTTPLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AuditLogs/read | Read data from the AuditLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AutoscaleEvaluationsLog/read | Read data from the AutoscaleEvaluationsLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AutoscaleScaleActionsLog/read | Read data from the AutoscaleScaleActionsLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AWSCloudTrail/read | Read data from the AWSCloudTrail table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AzureActivity/read | Read data from the AzureActivity table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AzureAssessmentRecommendation/read | Read data from the AzureAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/AzureMetrics/read | Read data from the AzureMetrics table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BaiClusterEvent/read | Read data from the BaiClusterEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BaiClusterNodeEvent/read | Read data from the BaiClusterNodeEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BaiJobEvent/read | Read data from the BaiJobEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BlockchainApplicationLog/read | Read data from the BlockchainApplicationLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BlockchainProxyLog/read | Read data from the BlockchainProxyLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/BoundPort/read | Read data from the BoundPort table |
> | Action | Microsoft.OperationalInsights/workspaces/query/CommonSecurityLog/read | Read data from the CommonSecurityLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ComputerGroup/read | Read data from the ComputerGroup table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ConfigurationChange/read | Read data from the ConfigurationChange table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ConfigurationData/read | Read data from the ConfigurationData table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerImageInventory/read | Read data from the ContainerImageInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerInventory/read | Read data from the ContainerInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerLog/read | Read data from the ContainerLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerNodeInventory/read | Read data from the ContainerNodeInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryLoginEvents/read | Read data from the ContainerRegistryLoginEvents table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerRegistryRepositoryEvents/read | Read data from the ContainerRegistryRepositoryEvents table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ContainerServiceLog/read | Read data from the ContainerServiceLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/CoreAzureBackup/read | Read data from the CoreAzureBackup table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksAccounts/read | Read data from the DatabricksAccounts table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksClusters/read | Read data from the DatabricksClusters table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksDBFS/read | Read data from the DatabricksDBFS table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksInstancePools/read | Read data from the DatabricksInstancePools table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksJobs/read | Read data from the DatabricksJobs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksNotebook/read | Read data from the DatabricksNotebook table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksSecrets/read | Read data from the DatabricksSecrets table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksSQLPermissions/read | Read data from the DatabricksSQLPermissions table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksSSH/read | Read data from the DatabricksSSH table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksTables/read | Read data from the DatabricksTables table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DatabricksWorkspace/read | Read data from the DatabricksWorkspace table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceAppCrash/read | Read data from the DeviceAppCrash table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceAppLaunch/read | Read data from the DeviceAppLaunch table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceCalendar/read | Read data from the DeviceCalendar table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceCleanup/read | Read data from the DeviceCleanup table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceConnectSession/read | Read data from the DeviceConnectSession table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceEtw/read | Read data from the DeviceEtw table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceHardwareHealth/read | Read data from the DeviceHardwareHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceHealth/read | Read data from the DeviceHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceHeartbeat/read | Read data from the DeviceHeartbeat table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeHeartbeat/read | Read data from the DeviceSkypeHeartbeat table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceSkypeSignIn/read | Read data from the DeviceSkypeSignIn table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DeviceSleepState/read | Read data from the DeviceSleepState table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHAppFailure/read | Read data from the DHAppFailure table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHAppReliability/read | Read data from the DHAppReliability table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHCPActivity/read | Read data from the DHCPActivity table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHDriverReliability/read | Read data from the DHDriverReliability table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHLogonFailures/read | Read data from the DHLogonFailures table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHLogonMetrics/read | Read data from the DHLogonMetrics table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHOSCrashData/read | Read data from the DHOSCrashData table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHOSReliability/read | Read data from the DHOSReliability table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DHWipAppLearning/read | Read data from the DHWipAppLearning table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DnsEvents/read | Read data from the DnsEvents table |
> | Action | Microsoft.OperationalInsights/workspaces/query/DnsInventory/read | Read data from the DnsInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ETWEvent/read | Read data from the ETWEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Event/read | Read data from the Event table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ExchangeAssessmentRecommendation/read | Read data from the ExchangeAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ExchangeOnlineAssessmentRecommendation/read | Read data from the ExchangeOnlineAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/FailedIngestion/read | Read data from the FailedIngestion table |
> | Action | Microsoft.OperationalInsights/workspaces/query/FunctionAppLogs/read | Read data from the FunctionAppLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Heartbeat/read | Read data from the Heartbeat table |
> | Action | Microsoft.OperationalInsights/workspaces/query/HuntingBookmark/read | Read data from the HuntingBookmark table |
> | Action | Microsoft.OperationalInsights/workspaces/query/IISAssessmentRecommendation/read | Read data from the IISAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/InboundConnection/read | Read data from the InboundConnection table |
> | Action | Microsoft.OperationalInsights/workspaces/query/InsightsMetrics/read | Read data from the InsightsMetrics table |
> | Action | Microsoft.OperationalInsights/workspaces/query/IntuneAuditLogs/read | Read data from the IntuneAuditLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/IntuneDeviceComplianceOrg/read | Read data from the IntuneDeviceComplianceOrg table |
> | Action | Microsoft.OperationalInsights/workspaces/query/IntuneOperationalLogs/read | Read data from the IntuneOperationalLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubeEvents/read | Read data from the KubeEvents table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubeHealth/read | Read data from the KubeHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubeMonAgentEvents/read | Read data from the KubeMonAgentEvents table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubeNodeInventory/read | Read data from the KubeNodeInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubePodInventory/read | Read data from the KubePodInventory table |
> | Action | Microsoft.OperationalInsights/workspaces/query/KubeServices/read | Read data from the KubeServices table |
> | Action | Microsoft.OperationalInsights/workspaces/query/LinuxAuditLog/read | Read data from the LinuxAuditLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplication/read | Read data from the MAApplication table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealth/read | Read data from the MAApplicationHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealthAlternativeVersions/read | Read data from the MAApplicationHealthAlternativeVersions table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationHealthIssues/read | Read data from the MAApplicationHealthIssues table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationInstance/read | Read data from the MAApplicationInstance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationInstanceReadiness/read | Read data from the MAApplicationInstanceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAApplicationReadiness/read | Read data from the MAApplicationReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADeploymentPlan/read | Read data from the MADeploymentPlan table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADevice/read | Read data from the MADevice table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADeviceNotEnrolled/read | Read data from the MADeviceNotEnrolled table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADeviceNRT/read | Read data from the MADeviceNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealth/read | Read data from the MADevicePnPHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealthAlternativeVersions/read | Read data from the MADevicePnPHealthAlternativeVersions table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADevicePnPHealthIssues/read | Read data from the MADevicePnPHealthIssues table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADeviceReadiness/read | Read data from the MADeviceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADriverInstanceReadiness/read | Read data from the MADriverInstanceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MADriverReadiness/read | Read data from the MADriverReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddin/read | Read data from the MAOfficeAddin table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinEntityHealth/read | Read data from the MAOfficeAddinEntityHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealth/read | Read data from the MAOfficeAddinHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealthEventNRT/read | Read data from the MAOfficeAddinHealthEventNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinHealthIssues/read | Read data from the MAOfficeAddinHealthIssues table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinInstance/read | Read data from the MAOfficeAddinInstance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinInstanceReadiness/read | Read data from the MAOfficeAddinInstanceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAddinReadiness/read | Read data from the MAOfficeAddinReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeApp/read | Read data from the MAOfficeApp table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppCrashesNRT/read | Read data from the MAOfficeAppCrashesNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppHealth/read | Read data from the MAOfficeAppHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppInstance/read | Read data from the MAOfficeAppInstance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppInstanceHealth/read | Read data from the MAOfficeAppInstanceHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppReadiness/read | Read data from the MAOfficeAppReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeAppSessionsNRT/read | Read data from the MAOfficeAppSessionsNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeBuildInfo/read | Read data from the MAOfficeBuildInfo table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeCurrencyAssessment/read | Read data from the MAOfficeCurrencyAssessment table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeCurrencyAssessmentDailyCounts/read | Read data from the MAOfficeCurrencyAssessmentDailyCounts table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeDeploymentStatus/read | Read data from the MAOfficeDeploymentStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeDeploymentStatusNRT/read | Read data from the MAOfficeDeploymentStatusNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroErrorNRT/read | Read data from the MAOfficeMacroErrorNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroGlobalHealth/read | Read data from the MAOfficeMacroGlobalHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroHealth/read | Read data from the MAOfficeMacroHealth table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroHealthIssues/read | Read data from the MAOfficeMacroHealthIssues table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroIssueInstanceReadiness/read | Read data from the MAOfficeMacroIssueInstanceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroIssueReadiness/read | Read data from the MAOfficeMacroIssueReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeMacroSummary/read | Read data from the MAOfficeMacroSummary table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeSuite/read | Read data from the MAOfficeSuite table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAOfficeSuiteInstance/read | Read data from the MAOfficeSuiteInstance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAProposedPilotDevices/read | Read data from the MAProposedPilotDevices table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsBuildInfo/read | Read data from the MAWindowsBuildInfo table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessment/read | Read data from the MAWindowsCurrencyAssessment table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsCurrencyAssessmentDailyCounts/read | Read data from the MAWindowsCurrencyAssessmentDailyCounts table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatus/read | Read data from the MAWindowsDeploymentStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsDeploymentStatusNRT/read | Read data from the MAWindowsDeploymentStatusNRT table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MAWindowsSysReqInstanceReadiness/read | Read data from the MAWindowsSysReqInstanceReadiness table |
> | Action | Microsoft.OperationalInsights/workspaces/query/McasShadowItReporting/read | Read data from the McasShadowItReporting table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftAzureBastionAuditLogs/read | Read data from the MicrosoftAzureBastionAuditLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareReceivedSnapshotLog/read | Read data from the MicrosoftDataShareReceivedSnapshotLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareSentSnapshotLog/read | Read data from the MicrosoftDataShareSentSnapshotLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftDataShareShareLog/read | Read data from the MicrosoftDataShareShareLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetryPerformanceLogs/read | Read data from the MicrosoftDynamicsTelemetryPerformanceLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftDynamicsTelemetrySystemMetricsLogs/read | Read data from the MicrosoftDynamicsTelemetrySystemMetricsLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftHealthcareApisAuditLogs/read | Read data from the MicrosoftHealthcareApisAuditLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/MicrosoftInsightsAzureActivityLog/read | Read data from the MicrosoftInsightsAzureActivityLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/NetworkMonitoring/read | Read data from the NetworkMonitoring table |
> | Action | Microsoft.OperationalInsights/workspaces/query/OfficeActivity/read | Read data from the OfficeActivity table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Operation/read | Read data from the Operation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/OutboundConnection/read | Read data from the OutboundConnection table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Perf/read | Read data from the Perf table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ProtectionStatus/read | Read data from the ProtectionStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Action | Microsoft.OperationalInsights/workspaces/query/ReservedCommonFields/read | Read data from the ReservedCommonFields table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SCCMAssessmentRecommendation/read | Read data from the SCCMAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SCOMAssessmentRecommendation/read | Read data from the SCOMAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityAlert/read | Read data from the SecurityAlert table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read | Read data from the SecurityBaseline table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityBaselineSummary/read | Read data from the SecurityBaselineSummary table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityDetection/read | Read data from the SecurityDetection table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityEvent/read | Read data from the SecurityEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityIoTRawEvent/read | Read data from the SecurityIoTRawEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SecurityRecommendation/read | Read data from the SecurityRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ServiceFabricOperationalEvent/read | Read data from the ServiceFabricOperationalEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ServiceFabricReliableActorEvent/read | Read data from the ServiceFabricReliableActorEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/ServiceFabricReliableServiceEvent/read | Read data from the ServiceFabricReliableServiceEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SfBAssessmentRecommendation/read | Read data from the SfBAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SfBOnlineAssessmentRecommendation/read | Read data from the SfBOnlineAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SharePointOnlineAssessmentRecommendation/read | Read data from the SharePointOnlineAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SignalRServiceDiagnosticLogs/read | Read data from the SignalRServiceDiagnosticLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SigninLogs/read | Read data from the SigninLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SPAssessmentRecommendation/read | Read data from the SPAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SQLAssessmentRecommendation/read | Read data from the SQLAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SQLQueryPerformance/read | Read data from the SQLQueryPerformance table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SqlThreatProtectionLoginAudits/read | Read data from the SqlThreatProtectionLoginAudits table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SqlVulnerabilityAssessmentResult/read | Read data from the SqlVulnerabilityAssessmentResult table |
> | Action | Microsoft.OperationalInsights/workspaces/query/StorageBlobLogs/read | Read data from the StorageBlobLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/StorageFileLogs/read | Read data from the StorageFileLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/StorageQueueLogs/read | Read data from the StorageQueueLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/StorageTableLogs/read | Read data from the StorageTableLogs table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SucceededIngestion/read | Read data from the SucceededIngestion table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Syslog/read | Read data from the Syslog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/SysmonEvent/read | Read data from the SysmonEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read | Reading data from any custom log |
> | Action | Microsoft.OperationalInsights/workspaces/query/ThreatIntelligenceIndicator/read | Read data from the ThreatIntelligenceIndicator table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAApp/read | Read data from the UAApp table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAComputer/read | Read data from the UAComputer table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAComputerRank/read | Read data from the UAComputerRank table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UADriver/read | Read data from the UADriver table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UADriverProblemCodes/read | Read data from the UADriverProblemCodes table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAFeedback/read | Read data from the UAFeedback table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAHardwareSecurity/read | Read data from the UAHardwareSecurity table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAIESiteDiscovery/read | Read data from the UAIESiteDiscovery table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAOfficeAddIn/read | Read data from the UAOfficeAddIn table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAProposedActionPlan/read | Read data from the UAProposedActionPlan table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UASysReqIssue/read | Read data from the UASysReqIssue table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UAUpgradedComputer/read | Read data from the UAUpgradedComputer table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Update/read | Read data from the Update table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UpdateRunProgress/read | Read data from the UpdateRunProgress table |
> | Action | Microsoft.OperationalInsights/workspaces/query/UpdateSummary/read | Read data from the UpdateSummary table |
> | Action | Microsoft.OperationalInsights/workspaces/query/Usage/read | Read data from the Usage table |
> | Action | Microsoft.OperationalInsights/workspaces/query/VMBoundPort/read | Read data from the VMBoundPort table |
> | Action | Microsoft.OperationalInsights/workspaces/query/VMComputer/read | Read data from the VMComputer table |
> | Action | Microsoft.OperationalInsights/workspaces/query/VMConnection/read | Read data from the VMConnection table |
> | Action | Microsoft.OperationalInsights/workspaces/query/VMProcess/read | Read data from the VMProcess table |
> | Action | Microsoft.OperationalInsights/workspaces/query/W3CIISLog/read | Read data from the W3CIISLog table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WaaSDeploymentStatus/read | Read data from the WaaSDeploymentStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WaaSInsiderStatus/read | Read data from the WaaSInsiderStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WaaSUpdateStatus/read | Read data from the WaaSUpdateStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WDAVStatus/read | Read data from the WDAVStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WDAVThreat/read | Read data from the WDAVThreat table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WindowsClientAssessmentRecommendation/read | Read data from the WindowsClientAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WindowsEvent/read | Read data from the WindowsEvent table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WindowsFirewall/read | Read data from the WindowsFirewall table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WindowsServerAssessmentRecommendation/read | Read data from the WindowsServerAssessmentRecommendation table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WireData/read | Read data from the WireData table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WorkloadMonitoringPerf/read | Read data from the WorkloadMonitoringPerf table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WUDOAggregatedStatus/read | Read data from the WUDOAggregatedStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/query/WUDOStatus/read | Read data from the WUDOStatus table |
> | Action | Microsoft.OperationalInsights/workspaces/read | Gets an existing workspace |
> | Action | Microsoft.OperationalInsights/workspaces/regeneratesharedkey/action | Regenerates the specified workspace shared key |
> | Action | microsoft.operationalinsights/workspaces/rules/read | Get all alert rules. |
> | Action | Microsoft.OperationalInsights/workspaces/savedSearches/delete | Deletes a saved search query |
> | Action | Microsoft.OperationalInsights/workspaces/savedSearches/read | Gets a saved search query |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/results/read | Get saved searches results. Deprecated |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/delete | Delete scheduled search actions. |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/read | Get scheduled search actions. |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/actions/write | Create or update scheduled search actions. |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/delete | Delete scheduled searches. |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/read | Get scheduled searches. |
> | Action | microsoft.operationalinsights/workspaces/savedsearches/schedules/write | Create or update scheduled searches. |
> | Action | Microsoft.OperationalInsights/workspaces/savedSearches/write | Creates a saved search query |
> | Action | Microsoft.OperationalInsights/workspaces/schema/read | Gets the search schema for the workspace.  Search schema includes the exposed fields and their types. |
> | Action | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Action | microsoft.operationalinsights/workspaces/search/read | Get search results. Deprecated. |
> | Action | Microsoft.OperationalInsights/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/sharedKeys/read | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/delete | Deletes a storage configuration. This will stop Microsoft Operational Insights from reading data from the storage account. |
> | Action | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/read | Gets a storage configuration. |
> | Action | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/write | Creates a new storage configuration. These configurations are used to pull data from a location in an existing storage account. |
> | Action | Microsoft.OperationalInsights/workspaces/upgradetranslationfailures/read | Get Search Upgrade Translation Failure log for the workspace |
> | Action | Microsoft.OperationalInsights/workspaces/usages/read | Gets usage data for a workspace including the amount of data read by the workspace. |
> | Action | Microsoft.OperationalInsights/workspaces/write | Creates a new workspace or links to an existing workspace by providing the customer id from the existing workspace. |

## Microsoft.OperationsManagement

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.OperationsManagement/managementAssociations/delete | Delete existing Management Association |
> | Action | Microsoft.OperationsManagement/managementAssociations/read | Get Existing Management Association |
> | Action | Microsoft.OperationsManagement/managementAssociations/write | Create a new Management Association |
> | Action | Microsoft.OperationsManagement/managementConfigurations/delete | Delete existing Management Configuration |
> | Action | Microsoft.OperationsManagement/managementConfigurations/read | Get Existing Management Configuration |
> | Action | Microsoft.OperationsManagement/managementConfigurations/write | Create a new Management Configuration |
> | Action | Microsoft.OperationsManagement/register/action | Register a subscription to a resource provider. |
> | Action | Microsoft.OperationsManagement/solutions/delete | Delete existing OMS solution |
> | Action | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Action | Microsoft.OperationsManagement/solutions/write | Create new OMS solution |

## Microsoft.PolicyInsights

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.PolicyInsights/asyncOperationResults/read | Gets the async operation result. |
> | DataAction | Microsoft.PolicyInsights/checkDataPolicyCompliance/action | Check the compliance status of a given component against data policies. |
> | Action | Microsoft.PolicyInsights/operations/read | Gets supported operations on Microsoft.PolicyInsights namespace |
> | DataAction | Microsoft.PolicyInsights/policyEvents/logDataEvents/action | Log the resource component policy events. |
> | Action | Microsoft.PolicyInsights/policyEvents/queryResults/action | Query information about policy events. |
> | Action | Microsoft.PolicyInsights/policyEvents/queryResults/read | Query information about policy events. |
> | Action | Microsoft.PolicyInsights/policyMetadata/read | Get Policy Metadata resources. |
> | Action | Microsoft.PolicyInsights/policyStates/queryResults/action | Query information about policy states. |
> | Action | Microsoft.PolicyInsights/policyStates/queryResults/read | Query information about policy states. |
> | Action | Microsoft.PolicyInsights/policyStates/summarize/action | Query summary information about policy latest states. |
> | Action | Microsoft.PolicyInsights/policyStates/summarize/read | Query summary information about policy latest states. |
> | Action | Microsoft.PolicyInsights/policyStates/triggerEvaluation/action | Triggers a new compliance evaluation for the selected scope. |
> | Action | Microsoft.PolicyInsights/policyTrackedResources/queryResults/read | Query information about resources required by DeployIfNotExists policies. |
> | Action | Microsoft.PolicyInsights/register/action | Registers the Microsoft Policy Insights resource provider and enables actions on it. |
> | Action | Microsoft.PolicyInsights/remediations/cancel/action | Cancel in-progress Microsoft Policy remediations. |
> | Action | Microsoft.PolicyInsights/remediations/delete | Delete policy remediations. |
> | Action | Microsoft.PolicyInsights/remediations/listDeployments/read | Lists the deployments required by a policy remediation. |
> | Action | Microsoft.PolicyInsights/remediations/read | Get policy remediations. |
> | Action | Microsoft.PolicyInsights/remediations/write | Create or update Microsoft Policy remediations. |
> | Action | Microsoft.PolicyInsights/unregister/action | Unregisters the Microsoft Policy Insights resource provider. |

## Microsoft.Portal

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Portal/consoles/delete | Removes the Cloud Shell instance. |
> | Action | Microsoft.Portal/consoles/read | Reads the Cloud Shell instance. |
> | Action | Microsoft.Portal/consoles/write | Create or update a Cloud Shell instance. |
> | Action | Microsoft.Portal/dashboards/delete | Removes the dashboard from the subscription. |
> | Action | Microsoft.Portal/dashboards/read | Reads the dashboards for the subscription. |
> | Action | Microsoft.Portal/dashboards/write | Add or modify dashboard to a subscription. |
> | Action | Microsoft.Portal/register/action | Register to Portal |
> | Action | Microsoft.Portal/usersettings/delete | Removes the Cloud Shell user settings. |
> | Action | Microsoft.Portal/usersettings/read | Reads the Cloud Shell user settings. |
> | Action | Microsoft.Portal/usersettings/write | Create or update Cloud Shell user setting. |

## Microsoft.PowerBIDedicated

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.PowerBIDedicated/capacities/delete | Deletes the Power BI Dedicated Capacity. |
> | Action | Microsoft.PowerBIDedicated/capacities/read | Retrieves the information of the specified Power BI Dedicated Capacity. |
> | Action | Microsoft.PowerBIDedicated/capacities/resume/action | Resumes the Capacity. |
> | Action | Microsoft.PowerBIDedicated/capacities/skus/read | Retrieve available SKU information for the capacity |
> | Action | Microsoft.PowerBIDedicated/capacities/suspend/action | Suspends the Capacity. |
> | Action | Microsoft.PowerBIDedicated/capacities/write | Creates or updates the specified Power BI Dedicated Capacity. |
> | Action | Microsoft.PowerBIDedicated/locations/checkNameAvailability/action | Checks that given Power BI Dedicated Capacity name is valid and not in use. |
> | Action | Microsoft.PowerBIDedicated/locations/operationresults/read | Retrieves the information of the specified operation result. |
> | Action | Microsoft.PowerBIDedicated/locations/operationstatuses/read | Retrieves the information of the specified operation status. |
> | Action | Microsoft.PowerBIDedicated/operations/read | Retrieves the information of operations |
> | Action | Microsoft.PowerBIDedicated/register/action | Registers Power BI Dedicated resource provider. |
> | Action | Microsoft.PowerBIDedicated/skus/read | Retrieves the information of Skus |

## Microsoft.RecoveryServices

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Action | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Action | Microsoft.RecoveryServices/Locations/backupPreValidateProtection/action |  |
> | Action | Microsoft.RecoveryServices/Locations/backupProtectedItem/write | Create a backup Protected Item |
> | Action | Microsoft.RecoveryServices/Locations/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Action | Microsoft.RecoveryServices/Locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Action | Microsoft.RecoveryServices/Locations/backupValidateFeatures/action | Validate Features |
> | Action | Microsoft.RecoveryServices/locations/checkNameAvailability/action | Check Resource Name Availability is an API to check if resource name is available |
> | Action | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Action | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Action | Microsoft.RecoveryServices/register/action | Registers subscription for given Resource Provider |
> | Action | Microsoft.RecoveryServices/Vaults/backupconfig/read | Returns Configuration for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupconfig/write | Updates Configuration for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/read | Gets Backup Resource Encryption Configuration. |
> | Action | Microsoft.RecoveryServices/Vaults/backupEncryptionConfigs/write | Updates Backup Resource Encryption Configuration |
> | Action | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/delete | Delete a backup Protection Intent |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read | Get a backup Protection Intent |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/operationsStatus/read | Returns status of the operation |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read | Get all protectable containers |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/delete | Deletes the registered Container |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/inquire/action | Do inquiry for workloads within a container |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read | Get all items in a container |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Gets result of Operation performed on Protection Container. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationsStatus/read | Gets status of Operation performed on Protection Container. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action | Performs Backup for Protected Item. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/delete | Deletes Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action | Provision Instant Item Recovery for Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action | Restore Recovery Points for Protected Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action | Revoke Instant Item Recovery for Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/write | Creates a registered container |
> | Action | Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action | Refreshes the container list |
> | Action | Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
> | Action | Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
> | Action | Microsoft.RecoveryServices/Vaults/backupJobs/operationsStatus/read | Returns the status of Job Operation. |
> | Action | Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
> | Action | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Action | Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Returns Backup Operation Result for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupPolicies/delete | Delete a Protection Policy |
> | Action | Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
> | Action | Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read | Get Status of Policy Operation. |
> | Action | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Action | Microsoft.RecoveryServices/Vaults/backupPolicies/write | Creates Protection Policy |
> | Action | Microsoft.RecoveryServices/Vaults/backupProtectableItems/read | Returns list of all Protectable Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Action | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
> | Action | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Action | Microsoft.RecoveryServices/Vaults/backupSecurityPIN/action | Returns Security PIN Information for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupstorageconfig/read | Returns Storage Configuration for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupstorageconfig/write | Updates Storage Configuration for Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Action | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Action | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Action | Microsoft.RecoveryServices/Vaults/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
> | Action | Microsoft.RecoveryServices/Vaults/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Action | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Action | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/read | Gets the Recovery services vault notification configuration. |
> | Action | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/write | Configures e-mail notifications to Recovery services vault. |
> | Action | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Action | Microsoft.RecoveryServices/Vaults/registeredIdentities/delete | The UnRegister Container operation can be used to unregister a container. |
> | Action | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Action | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Action | Microsoft.RecoveryServices/Vaults/registeredIdentities/write | The Register Service Container operation can be used to register a container with Recovery Service. |
> | Action | Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | Action | Microsoft.RecoveryServices/vaults/replicationAlertSettings/write | Create or Update any Alerts Settings |
> | Action | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/delete | Delete any Fabrics |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/deployProcessServerImage/action | Deploy Process Server Image |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/migratetoaad/action | Migrate Fabric To AAD |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/operationresults/read | Track the results of an asynchronous operation on the resource Fabrics |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read any Fabrics |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/remove/action | Remove Fabric |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationLogicalNetworks/read | Read any Logical Networks |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/delete | Delete any Network Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/write | Create or Update any Network Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/discoverProtectableItem/action | Discover Protectable Item |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/operationresults/read | Track the results of an asynchronous operation on the resource Protection Containers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/remove/action | Remove Protection Container |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/delete | Delete any Migration Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrate/action | Migrate Item |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/migrationRecoveryPoints/read | Read any Migration Recovery Points |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/operationresults/read | Track the results of an asynchronous operation on the resource Migration Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/read | Read any Migration Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrate/action | Test Migrate |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/testMigrateCleanup/action | Test Migrate Cleanup |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationMigrationItems/write | Create or Update any Migration Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/addDisks/action | Add disks |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/delete | Delete any Protected Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/operationresults/read | Track the results of an asynchronous operation on the resource Protected Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/remove/action | Remove Protected Item |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/removeDisks/action | Remove disks |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/ResolveHealthErrors/action |  |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/submitFeedback/action | Submit Feedback |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/targetComputeSizes/read | Read any Target Compute Sizes |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/write | Create or Update any Protected Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/delete | Delete any Protection Container Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/operationresults/read | Track the results of an asynchronous operation on the resource Protection Container Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/remove/action | Remove Protection Container Mapping |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/write | Create or Update any Protection Container Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action | Switch Protection Container |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/write | Create or Update any Protection Containers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/delete | Delete any Recovery Services Providers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Services Providers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/remove/action | Remove Recovery Services Provider |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/write | Create or Update any Recovery Services Providers |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/delete | Delete any Storage Classification Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/operationresults/read | Track the results of an asynchronous operation on the resource Storage Classification Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/write | Create or Update any Storage Classification Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/delete | Delete any vCenters |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/operationresults/read | Track the results of an asynchronous operation on the resource vCenters |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/write | Create or Update any vCenters |
> | Action | Microsoft.RecoveryServices/vaults/replicationFabrics/write | Create or Update any Fabrics |
> | Action | Microsoft.RecoveryServices/vaults/replicationJobs/cancel/action | Cancel Job |
> | Action | Microsoft.RecoveryServices/vaults/replicationJobs/operationresults/read | Track the results of an asynchronous operation on the resource Jobs |
> | Action | Microsoft.RecoveryServices/vaults/replicationJobs/read | Read any Jobs |
> | Action | Microsoft.RecoveryServices/vaults/replicationJobs/restart/action | Restart job |
> | Action | Microsoft.RecoveryServices/vaults/replicationJobs/resume/action | Resume Job |
> | Action | Microsoft.RecoveryServices/vaults/replicationMigrationItems/read | Read any Migration Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationNetworkMappings/read | Read any Network Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationNetworks/read | Read any Networks |
> | Action | Microsoft.RecoveryServices/vaults/replicationOperationStatus/read | Read any Vault Replication Operation Status |
> | Action | Microsoft.RecoveryServices/vaults/replicationPolicies/delete | Delete any Policies |
> | Action | Microsoft.RecoveryServices/vaults/replicationPolicies/operationresults/read | Track the results of an asynchronous operation on the resource Policies |
> | Action | Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read any Policies |
> | Action | Microsoft.RecoveryServices/vaults/replicationPolicies/write | Create or Update any Policies |
> | Action | Microsoft.RecoveryServices/vaults/replicationProtectedItems/read | Read any Protected Items |
> | Action | Microsoft.RecoveryServices/vaults/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationProtectionContainers/read | Read any Protection Containers |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/delete | Delete any Recovery Plans |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/operationresults/read | Track the results of an asynchronous operation on the resource Recovery Plans |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/write | Create or Update any Recovery Plans |
> | Action | Microsoft.RecoveryServices/vaults/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Action | Microsoft.RecoveryServices/vaults/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Action | Microsoft.RecoveryServices/vaults/replicationStorageClassifications/read | Read any Storage Classifications |
> | Action | Microsoft.RecoveryServices/vaults/replicationSupportedOperatingSystems/read | Read any  |
> | Action | Microsoft.RecoveryServices/vaults/replicationUsages/read | Read any Vault Replication Usages |
> | Action | Microsoft.RecoveryServices/vaults/replicationVaultHealth/operationresults/read | Track the results of an asynchronous operation on the resource Vault Replication Health |
> | Action | Microsoft.RecoveryServices/vaults/replicationVaultHealth/read | Read any Vault Replication Health |
> | Action | Microsoft.RecoveryServices/vaults/replicationVaultHealth/refresh/action | Refresh Vault Health |
> | Action | Microsoft.RecoveryServices/vaults/replicationVaultSettings/read | Read any  |
> | Action | Microsoft.RecoveryServices/vaults/replicationVaultSettings/write | Create or Update any  |
> | Action | Microsoft.RecoveryServices/vaults/replicationvCenters/read | Read any vCenters |
> | Action | Microsoft.RecoveryServices/vaults/usages/read | Read any Vault Usages |
> | Action | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Action | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | Action | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |

## Microsoft.Relay

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Relay/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Action | Microsoft.Relay/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Action | Microsoft.Relay/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.Relay/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Action | Microsoft.Relay/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Action | Microsoft.Relay/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Action | Microsoft.Relay/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.Relay/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Action | Microsoft.Relay/namespaces/Delete | Delete Namespace Resource |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Action | Microsoft.Relay/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.Relay/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/action | Operation to update HybridConnection. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/delete | Operation to delete HybridConnection Authorization Rules |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/listkeys/action | Get the Connection String to HybridConnection |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/read |  Get the list of HybridConnection Authorization Rules |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.Relay/namespaces/HybridConnections/authorizationRules/write | Create HybridConnection Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Action | Microsoft.Relay/namespaces/HybridConnections/Delete | Operation to delete HybridConnection Resource |
> | Action | Microsoft.Relay/namespaces/HybridConnections/read | Get list of HybridConnection Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/HybridConnections/write | Create or Update HybridConnection properties. |
> | Action | Microsoft.Relay/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.Relay/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.Relay/namespaces/operationresults/read | Get the status of Namespace operation |
> | Action | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/read | Get the list of Namespace Resource Description |
> | Action | Microsoft.Relay/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/action | Operation to update WcfRelay. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/delete | Operation to delete WcfRelay Authorization Rules |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/listkeys/action | Get the Connection String to WcfRelay |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/read |  Get the list of WcfRelay Authorization Rules |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/regeneratekeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.Relay/namespaces/WcfRelays/authorizationRules/write | Create WcfRelay Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Action | Microsoft.Relay/namespaces/WcfRelays/Delete | Operation to delete WcfRelay Resource |
> | Action | Microsoft.Relay/namespaces/WcfRelays/read | Get list of WcfRelay Resource Descriptions |
> | Action | Microsoft.Relay/namespaces/WcfRelays/write | Create or Update WcfRelay properties. |
> | Action | Microsoft.Relay/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Action | Microsoft.Relay/operations/read | Get Operations |
> | Action | Microsoft.Relay/register/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |
> | Action | Microsoft.Relay/unregister/action | Registers the subscription for the Relay resource provider and enables the creation of Relay resources |

## Microsoft.ResourceHealth

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ResourceHealth/AvailabilityStatuses/current/read | Gets the availability status for the specified resource |
> | Action | Microsoft.ResourceHealth/AvailabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Action | Microsoft.ResourceHealth/events/read | Get Service Health Events for given subscription |
> | Action | Microsoft.Resourcehealth/healthevent/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.Resourcehealth/healthevent/Activated/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.Resourcehealth/healthevent/InProgress/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.Resourcehealth/healthevent/Pending/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.Resourcehealth/healthevent/Resolved/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.Resourcehealth/healthevent/Updated/action | Denotes the change in health state for the specified resource |
> | Action | Microsoft.ResourceHealth/impactedResources/read | Get Impacted Resources for given subscription |
> | Action | Microsoft.ResourceHealth/metadata/read | Gets Metadata |
> | Action | Microsoft.ResourceHealth/Notifications/read | Receives Azure Resource Manager notifications |
> | Action | Microsoft.ResourceHealth/Operations/read | Get the operations available for the Microsoft ResourceHealth |
> | Action | Microsoft.ResourceHealth/register/action | Registers the subscription for the Microsoft ResourceHealth |
> | Action | Microsoft.ResourceHealth/unregister/action | Unregisters the subscription for the Microsoft ResourceHealth |

## Microsoft.Resources

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Resources/calculateTemplateHash/action | Calculate the hash of provided template. |
> | Action | Microsoft.Resources/checkPolicyCompliance/read | Check the compliance status of a given resource against resource policies. |
> | Action | Microsoft.Resources/checkResourceName/action | Check the resource name for validity. |
> | Action | Microsoft.Resources/deployments/cancel/action | Cancels a deployment. |
> | Action | Microsoft.Resources/deployments/delete | Deletes a deployment. |
> | Action | Microsoft.Resources/deployments/exportTemplate/action | Export template for a deployment |
> | Action | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Action | Microsoft.Resources/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Action | Microsoft.Resources/deployments/read | Gets or lists deployments. |
> | Action | Microsoft.Resources/deployments/validate/action | Validates an deployment. |
> | Action | Microsoft.Resources/deployments/whatIf/action | Predicts template deployment changes. |
> | Action | Microsoft.Resources/deployments/write | Creates or updates an deployment. |
> | Action | Microsoft.Resources/deploymentScripts/delete | Deletes a deployment script |
> | Action | Microsoft.Resources/deploymentScripts/logs/read | Gets or lists deployment script logs |
> | Action | Microsoft.Resources/deploymentScripts/read | Gets or lists deployment scripts |
> | Action | Microsoft.Resources/deploymentScripts/write | Creates or updates a deployment script |
> | Action | Microsoft.Resources/links/delete | Deletes a resource link. |
> | Action | Microsoft.Resources/links/read | Gets or lists resource links. |
> | Action | Microsoft.Resources/links/write | Creates or updates a resource link. |
> | Action | Microsoft.Resources/marketplace/purchase/action | Purchases a resource from the marketplace. |
> | Action | Microsoft.Resources/providers/read | Get the list of providers. |
> | Action | Microsoft.Resources/resources/read | Get the list of resources based upon filters. |
> | Action | Microsoft.Resources/subscriptions/locations/read | Gets the list of locations supported. |
> | Action | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Action | Microsoft.Resources/subscriptions/providers/read | Gets or lists resource providers. |
> | Action | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Action | Microsoft.Resources/subscriptions/resourceGroups/delete | Deletes a resource group and all its resources. |
> | Action | Microsoft.Resources/subscriptions/resourcegroups/deployments/operations/read | Gets or lists deployment operations. |
> | Action | Microsoft.Resources/subscriptions/resourcegroups/deployments/operationstatuses/read | Gets or lists deployment operation statuses. |
> | Action | Microsoft.Resources/subscriptions/resourcegroups/deployments/read | Gets or lists deployments. |
> | Action | Microsoft.Resources/subscriptions/resourcegroups/deployments/write | Creates or updates an deployment. |
> | Action | Microsoft.Resources/subscriptions/resourceGroups/moveResources/action | Moves resources from one resource group to another. |
> | Action | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Action | Microsoft.Resources/subscriptions/resourcegroups/resources/read | Gets the resources for the resource group. |
> | Action | Microsoft.Resources/subscriptions/resourceGroups/validateMoveResources/action | Validate move of resources from one resource group to another. |
> | Action | Microsoft.Resources/subscriptions/resourceGroups/write | Creates or updates a resource group. |
> | Action | Microsoft.Resources/subscriptions/resources/read | Gets resources of a subscription. |
> | Action | Microsoft.Resources/subscriptions/tagNames/delete | Deletes a subscription tag. |
> | Action | Microsoft.Resources/subscriptions/tagNames/read | Gets or lists subscription tags. |
> | Action | Microsoft.Resources/subscriptions/tagNames/tagValues/delete | Deletes a subscription tag value. |
> | Action | Microsoft.Resources/subscriptions/tagNames/tagValues/read | Gets or lists subscription tag values. |
> | Action | Microsoft.Resources/subscriptions/tagNames/tagValues/write | Adds a subscription tag value. |
> | Action | Microsoft.Resources/subscriptions/tagNames/write | Adds a subscription tag. |
> | Action | Microsoft.Resources/tags/delete | Removes all the tags on a resource. |
> | Action | Microsoft.Resources/tags/read | Gets all the tags on a resource. |
> | Action | Microsoft.Resources/tags/write | Updates the tags on a resource by replacing or merging existing tags with a new set of tags, or removing existing tags. |
> | Action | Microsoft.Resources/tenants/read | Gets the list of tenants. |

## Microsoft.Scheduler

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Scheduler/jobcollections/delete | Deletes job collection. |
> | Action | Microsoft.Scheduler/jobcollections/disable/action | Disables job collection. |
> | Action | Microsoft.Scheduler/jobcollections/enable/action | Enables job collection. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/delete | Deletes job. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/generateLogicAppDefinition/action | Generates Logic App definition based on a Scheduler Job. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/jobhistories/read | Gets job history. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/read | Gets job. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/run/action | Runs job. |
> | Action | Microsoft.Scheduler/jobcollections/jobs/write | Creates or updates job. |
> | Action | Microsoft.Scheduler/jobcollections/read | Get Job Collection |
> | Action | Microsoft.Scheduler/jobcollections/write | Creates or updates job collection. |

## Microsoft.Search

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Search/checkNameAvailability/action | Checks availability of the service name. |
> | Action | Microsoft.Search/operations/read | Lists all of the available operations of the Microsoft.Search provider. |
> | Action | Microsoft.Search/register/action | Registers the subscription for the search resource provider and enables the creation of search services. |
> | Action | Microsoft.Search/searchServices/createQueryKey/action | Creates the query key. |
> | Action | Microsoft.Search/searchServices/delete | Deletes the search service. |
> | Action | Microsoft.Search/searchServices/deleteQueryKey/delete | Deletes the query key. |
> | Action | Microsoft.Search/searchServices/listAdminKeys/action | Reads the admin keys. |
> | Action | Microsoft.Search/searchServices/listQueryKeys/action | Returns the list of query API keys for the given Azure Search service. |
> | Action | Microsoft.Search/searchServices/listQueryKeys/read | Returns the list of query API keys for the given Azure Search service. |
> | Action | Microsoft.Search/searchServices/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Action | Microsoft.Search/searchServices/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy |
> | Action | Microsoft.Search/searchServices/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Action | Microsoft.Search/searchServices/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy |
> | Action | Microsoft.Search/searchServices/read | Reads the search service. |
> | Action | Microsoft.Search/searchServices/regenerateAdminKey/action | Regenerates the admin key. |
> | Action | Microsoft.Search/searchServices/start/action | Starts the search service. |
> | Action | Microsoft.Search/searchServices/stop/action | Stops the search service. |
> | Action | Microsoft.Search/searchServices/write | Creates or updates the search service. |

## Microsoft.Security

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Security/adaptiveNetworkHardenings/enforce/action | Enforces the given traffic hardening rules by creating matching security rules on the given Network Security Group(s) |
> | Action | Microsoft.Security/adaptiveNetworkHardenings/read | Gets Adaptive Network Hardening recommendations of an Azure protected resource |
> | Action | Microsoft.Security/advancedThreatProtectionSettings/read | Gets the Advanced Threat Protection Settings for the resource |
> | Action | Microsoft.Security/advancedThreatProtectionSettings/write | Updates the Advanced Threat Protection Settings for the resource |
> | Action | Microsoft.Security/alerts/read | Gets all available security alerts |
> | Action | Microsoft.Security/applicationWhitelistings/read | Gets the application whitelistings |
> | Action | Microsoft.Security/applicationWhitelistings/write | Creates a new application whitelisting or updates an existing one |
> | Action | Microsoft.Security/assessmentMetadata/read | Get available security assessment metadata on your subscription |
> | Action | Microsoft.Security/assessmentMetadata/write | Create or update a security assessment metadata |
> | Action | Microsoft.Security/assessments/read | Get security assessments on your subscription |
> | Action | Microsoft.Security/assessments/write | Create or update security assessments on your subscription |
> | Action | Microsoft.Security/complianceResults/read | Gets the compliance results for the resource |
> | Action | Microsoft.Security/informationProtectionPolicies/read | Gets the information protection policies for the resource |
> | Action | Microsoft.Security/informationProtectionPolicies/write | Updates the information protection policies for the resource |
> | Action | Microsoft.Security/locations/alerts/activate/action | Activate a security alert |
> | Action | Microsoft.Security/locations/alerts/dismiss/action | Dismiss a security alert |
> | Action | Microsoft.Security/locations/alerts/read | Gets all available security alerts |
> | Action | Microsoft.Security/locations/jitNetworkAccessPolicies/delete | Deletes the just-in-time network access policy |
> | Action | Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action | Initiates a just-in-time network access policy request |
> | Action | Microsoft.Security/locations/jitNetworkAccessPolicies/read | Gets the just-in-time network access policies |
> | Action | Microsoft.Security/locations/jitNetworkAccessPolicies/write | Creates a new just-in-time network access policy or updates an existing one |
> | Action | Microsoft.Security/locations/read | Gets the security data location |
> | Action | Microsoft.Security/locations/tasks/activate/action | Activate a security recommendation |
> | Action | Microsoft.Security/locations/tasks/dismiss/action | Dismiss a security recommendation |
> | Action | Microsoft.Security/locations/tasks/read | Gets all available security recommendations |
> | Action | Microsoft.Security/locations/tasks/resolve/action | Resolve a security recommendation |
> | Action | Microsoft.Security/locations/tasks/start/action | Start a security recommendation |
> | Action | Microsoft.Security/policies/read | Gets the security policy |
> | Action | Microsoft.Security/policies/write | Updates the security policy |
> | Action | Microsoft.Security/pricings/delete | Deletes the pricing settings for the scope |
> | Action | Microsoft.Security/pricings/read | Gets the pricing settings for the scope |
> | Action | Microsoft.Security/pricings/write | Updates the pricing settings for the scope |
> | Action | Microsoft.Security/register/action | Registers the subscription for Azure Security Center |
> | Action | Microsoft.Security/securityContacts/delete | Deletes the security contact |
> | Action | Microsoft.Security/securityContacts/read | Gets the security contact |
> | Action | Microsoft.Security/securityContacts/write | Updates the security contact |
> | Action | Microsoft.Security/securitySolutions/delete | Deletes a security solution |
> | Action | Microsoft.Security/securitySolutions/read | Gets the security solutions |
> | Action | Microsoft.Security/securitySolutions/write | Creates a new security solution or updates an existing one |
> | Action | Microsoft.Security/securitySolutionsReferenceData/read | Gets the security solutions reference data |
> | Action | Microsoft.Security/securityStatuses/read | Gets the security health statuses for Azure resources |
> | Action | Microsoft.Security/securityStatusesSummaries/read | Gets the security statuses summaries for the scope |
> | Action | Microsoft.Security/settings/read | Gets the settings for the scope |
> | Action | Microsoft.Security/settings/write | Updates the settings for the scope |
> | Action | Microsoft.Security/tasks/read | Gets all available security recommendations |
> | Action | Microsoft.Security/unregister/action | Unregisters the subscription from Azure Security Center |
> | Action | Microsoft.Security/webApplicationFirewalls/delete | Deletes a web application firewall |
> | Action | Microsoft.Security/webApplicationFirewalls/read | Gets the web application firewalls |
> | Action | Microsoft.Security/webApplicationFirewalls/write | Creates a new web application firewall or updates an existing one |
> | Action | Microsoft.Security/workspaceSettings/connect/action | Change workspace settings reconnection settings |
> | Action | Microsoft.Security/workspaceSettings/delete | Deletes the workspace settings |
> | Action | Microsoft.Security/workspaceSettings/read | Gets the workspace settings |
> | Action | Microsoft.Security/workspaceSettings/write | Updates the workspace settings |

## Microsoft.SecurityGraph

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.SecurityGraph/diagnosticsettings/delete | Deleting a diagnostic setting |
> | Action | Microsoft.SecurityGraph/diagnosticsettings/read | Reading a diagnostic setting |
> | Action | Microsoft.SecurityGraph/diagnosticsettings/write | Writing a diagnostic setting |
> | Action | Microsoft.SecurityGraph/diagnosticsettingscategories/read | Reading a diagnostic setting categories |

## Microsoft.SecurityInsights

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.SecurityInsights/Aggregations/read | Gets aggregated information |
> | Action | Microsoft.SecurityInsights/alertRules/actions/delete | Deletes the response actions of an alert rule |
> | Action | Microsoft.SecurityInsights/alertRules/actions/read | Gets the response actions of an alert rule |
> | Action | Microsoft.SecurityInsights/alertRules/actions/write | Updates the response actions of an alert rule |
> | Action | Microsoft.SecurityInsights/alertRules/delete | Deletes alert rules |
> | Action | Microsoft.SecurityInsights/alertRules/read | Gets the alert rules |
> | Action | Microsoft.SecurityInsights/alertRules/write | Updates alert rules |
> | Action | Microsoft.SecurityInsights/Bookmarks/delete | Deletes bookmarks |
> | Action | Microsoft.SecurityInsights/Bookmarks/expand/action | Gets related entities of an entity by a specific expansion |
> | Action | Microsoft.SecurityInsights/Bookmarks/read | Gets bookmarks |
> | Action | Microsoft.SecurityInsights/Bookmarks/write | Updates bookmarks |
> | Action | Microsoft.SecurityInsights/cases/comments/read | Gets the case comments |
> | Action | Microsoft.SecurityInsights/cases/comments/write | Creates the case comments |
> | Action | Microsoft.SecurityInsights/cases/delete | Deletes a case |
> | Action | Microsoft.SecurityInsights/cases/investigations/read | Gets the case investigations |
> | Action | Microsoft.SecurityInsights/cases/investigations/write | Updates the metadata of a case |
> | Action | Microsoft.SecurityInsights/cases/read | Gets a case |
> | Action | Microsoft.SecurityInsights/cases/write | Updates a case |
> | Action | Microsoft.SecurityInsights/dataConnectors/delete | Deletes a data connector |
> | Action | Microsoft.SecurityInsights/dataConnectors/read | Gets the data connectors |
> | Action | Microsoft.SecurityInsights/dataConnectors/write | Updates a data connector |
> | Action | Microsoft.SecurityInsights/register/action | Registers the subscription to Azure Sentinel |
> | Action | Microsoft.SecurityInsights/settings/read | Gets settings |
> | Action | Microsoft.SecurityInsights/settings/write | Updates settings |
> | Action | Microsoft.SecurityInsights/unregister/action | Unregisters the subscription from Azure Sentinel |

## Microsoft.ServiceBus

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ServiceBus/checkNameAvailability/action | Checks availability of namespace under given subscription. |
> | Action | Microsoft.ServiceBus/checkNamespaceAvailability/action | Checks availability of namespace under given subscription. This API is deprecated please use CheckNameAvailability instead. |
> | Action | Microsoft.ServiceBus/locations/deleteVirtualNetworkOrSubnets/action | Deletes the VNet rules in ServiceBus Resource Provider for the specified VNet |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/action | Updates Namespace Authorization Rule. This API is deprecated. Please use a PUT call to update the Namespace Authorization Rule instead.. This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/delete | Delete Namespace Authorization Rule. The Default Namespace Authorization Rule cannot be deleted.  |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/listkeys/action | Get the Connection String to the Namespace |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/read | Get the list of Namespaces Authorization Rules description. |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.ServiceBus/namespaces/authorizationRules/write | Create a Namespace level Authorization Rules and update its properties. The Authorization Rules Access Rights, the Primary and Secondary Keys can be updated. |
> | Action | Microsoft.ServiceBus/namespaces/Delete | Delete Namespace Resource |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/listkeys/action | Gets the authorization rules keys for the Disaster Recovery primary namespace |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/authorizationRules/read | Get Disaster Recovery Primary Namespace's Authorization Rules |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/breakPairing/action | Disables Disaster Recovery and stops replicating changes from primary to secondary namespaces. |
> | Action | Microsoft.ServiceBus/namespaces/disasterrecoveryconfigs/checkNameAvailability/action | Checks availability of namespace alias under given subscription. |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/delete | Deletes the Disaster Recovery configuration associated with the namespace. This operation can only be invoked via the primary namespace. |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/failover/action | Invokes a GEO DR failover and reconfigures the namespace alias to point to the secondary namespace. |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/read | Gets the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.ServiceBus/namespaces/disasterRecoveryConfigs/write | Creates or Updates the Disaster Recovery configuration associated with the namespace. |
> | Action | Microsoft.ServiceBus/namespaces/eventGridFilters/delete | Deletes the Event Grid filter associated with the namespace. |
> | Action | Microsoft.ServiceBus/namespaces/eventGridFilters/read | Gets the Event Grid filter associated with the namespace. |
> | Action | Microsoft.ServiceBus/namespaces/eventGridFilters/write | Creates or Updates the Event Grid filter associated with the namespace. |
> | Action | Microsoft.ServiceBus/namespaces/eventhubs/read | Get list of EventHub Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/ipFilterRules/delete | Delete IP Filter Resource |
> | Action | Microsoft.ServiceBus/namespaces/ipFilterRules/read | Get IP Filter Resource |
> | Action | Microsoft.ServiceBus/namespaces/ipFilterRules/write | Create IP Filter Resource |
> | DataAction | Microsoft.ServiceBus/namespaces/messages/receive/action | Receive messages |
> | DataAction | Microsoft.ServiceBus/namespaces/messages/send/action | Send messages |
> | Action | Microsoft.ServiceBus/namespaces/messagingPlan/read | Gets the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.ServiceBus/namespaces/messagingPlan/write | Updates the Messaging Plan for a namespace.<br>This API is deprecated.<br>Properties exposed via the MessagingPlan resource are moved to the (parent) Namespace resource in later API versions..<br>This operation is not supported on API version 2017-04-01. |
> | Action | Microsoft.ServiceBus/namespaces/migrate/action | Migrate namespace operation |
> | Action | Microsoft.ServiceBus/namespaces/migrationConfigurations/delete | Deletes the Migration configuration. |
> | Action | Microsoft.ServiceBus/namespaces/migrationConfigurations/read | Gets the Migration configuration which indicates the state of the migration and pending replication operations |
> | Action | Microsoft.ServiceBus/namespaces/migrationConfigurations/revert/action | Reverts the standard to premium namespace migration |
> | Action | Microsoft.ServiceBus/namespaces/migrationConfigurations/upgrade/action | Assigns the DNS associated with the standard namespace to the premium namespace which completes the migration and stops the syncing resources from standard to premium namespace |
> | Action | Microsoft.ServiceBus/namespaces/migrationConfigurations/write | Creates or Updates Migration configuration. This will start synchronizing resources from the standard to the premium namespace |
> | Action | Microsoft.ServiceBus/namespaces/networkruleset/delete | Delete VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/networkruleset/read | Gets NetworkRuleSet Resource |
> | Action | Microsoft.ServiceBus/namespaces/networkruleset/write | Create VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/networkrulesets/delete | Delete VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/networkrulesets/read | Gets NetworkRuleSet Resource |
> | Action | Microsoft.ServiceBus/namespaces/networkrulesets/write | Create VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/operationresults/read | Get the status of Namespace operation |
> | Action | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/read | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/diagnosticSettings/write | Get list of Namespace diagnostic settings Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/logDefinitions/read | Get list of Namespace logs Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/providers/Microsoft.Insights/metricDefinitions/read | Get list of Namespace metrics Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/action | Operation to update Queue. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/delete | Operation to delete Queue Authorization Rules |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/listkeys/action | Get the Connection String to Queue |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/read |  Get the list of Queue Authorization Rules |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.ServiceBus/namespaces/queues/authorizationRules/write | Create Queue Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Action | Microsoft.ServiceBus/namespaces/queues/Delete | Operation to delete Queue Resource |
> | Action | Microsoft.ServiceBus/namespaces/queues/read | Get list of Queue Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/queues/write | Create or Update Queue properties. |
> | Action | Microsoft.ServiceBus/namespaces/read | Get the list of Namespace Resource Description |
> | Action | Microsoft.ServiceBus/namespaces/removeAcsNamepsace/action | Remove ACS namespace |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/action | Operation to update Topic. This operation is not supported on API version 2017-04-01. Authorization Rules. Please use a PUT call to update Authorization Rule. |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/delete | Operation to delete Topic Authorization Rules |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/listkeys/action | Get the Connection String to Topic |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/read |  Get the list of Topic Authorization Rules |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/regenerateKeys/action | Regenerate the Primary or Secondary key to the Resource |
> | Action | Microsoft.ServiceBus/namespaces/topics/authorizationRules/write | Create Topic Authorization Rules and Update its properties. The Authorization Rules Access Rights can be updated. |
> | Action | Microsoft.ServiceBus/namespaces/topics/Delete | Operation to delete Topic Resource |
> | Action | Microsoft.ServiceBus/namespaces/topics/read | Get list of Topic Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/Delete | Operation to delete TopicSubscription Resource |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/read | Get list of TopicSubscription Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/Delete | Operation to delete Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/read | Get list of Rule Resource Descriptions |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/rules/write | Create or Update Rule properties. |
> | Action | Microsoft.ServiceBus/namespaces/topics/subscriptions/write | Create or Update TopicSubscription properties. |
> | Action | Microsoft.ServiceBus/namespaces/topics/write | Create or Update Topic properties. |
> | Action | Microsoft.ServiceBus/namespaces/virtualNetworkRules/delete | Delete VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/virtualNetworkRules/read | Gets VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/virtualNetworkRules/write | Create VNET Rule Resource |
> | Action | Microsoft.ServiceBus/namespaces/write | Create a Namespace Resource and Update its properties. Tags and Capacity of the Namespace are the properties which can be updated. |
> | Action | Microsoft.ServiceBus/operations/read | Get Operations |
> | Action | Microsoft.ServiceBus/register/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |
> | Action | Microsoft.ServiceBus/sku/read | Get list of Sku Resource Descriptions |
> | Action | Microsoft.ServiceBus/sku/regions/read | Get list of SkuRegions Resource Descriptions |
> | Action | Microsoft.ServiceBus/unregister/action | Registers the subscription for the ServiceBus resource provider and enables the creation of ServiceBus resources |

## Microsoft.ServiceFabric

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.ServiceFabric/clusters/applications/delete | Delete any Application |
> | Action | Microsoft.ServiceFabric/clusters/applications/read | Read any Application |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/delete | Delete any Service |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/partitions/read | Read any Partition |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/partitions/replicas/read | Read any Replica |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/read | Read any Service |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/statuses/read | Read any Service Status |
> | Action | Microsoft.ServiceFabric/clusters/applications/services/write | Create or Update any Service |
> | Action | Microsoft.ServiceFabric/clusters/applications/write | Create or Update any Application |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/delete | Delete any Application Type |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/read | Read any Application Type |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/versions/read | Read any Application Type Version |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Action | Microsoft.ServiceFabric/clusters/applicationTypes/write | Create or Update any Application Type |
> | Action | Microsoft.ServiceFabric/clusters/delete | Delete any Cluster |
> | Action | Microsoft.ServiceFabric/clusters/nodes/read | Read any Node |
> | Action | Microsoft.ServiceFabric/clusters/read | Read any Cluster |
> | Action | Microsoft.ServiceFabric/clusters/statuses/read | Read any Cluster Status |
> | Action | Microsoft.ServiceFabric/clusters/write | Create or Update any Cluster |
> | Action | Microsoft.ServiceFabric/locations/clusterVersions/read | Read any Cluster Version |
> | Action | Microsoft.ServiceFabric/locations/environments/clusterVersions/read | Read any Cluster Version for a specific environment |
> | Action | Microsoft.ServiceFabric/locations/operationresults/read | Read any Operation Results |
> | Action | Microsoft.ServiceFabric/locations/operations/read | Read any Operations by location |
> | Action | Microsoft.ServiceFabric/operations/read | Read any Available Operations |
> | Action | Microsoft.ServiceFabric/register/action | Register any Action |

## Microsoft.SignalRService

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.SignalRService/locations/checknameavailability/action | Checks if a name is available for use with a new SignalR service |
> | Action | Microsoft.SignalRService/locations/operationresults/signalr/read | Query the status of an asynchronous operation |
> | Action | Microsoft.SignalRService/locations/operationStatuses/operationId/read | Query the status of an asynchronous operation |
> | Action | Microsoft.SignalRService/locations/usages/read | Get the quota usages for Azure SignalR service |
> | Action | Microsoft.SignalRService/operationresults/read | Query the status of an asynchronous operation |
> | Action | Microsoft.SignalRService/operations/read | List the operations for Azure SignalR service. |
> | Action | Microsoft.SignalRService/operationstatus/read | Query the status of an asynchronous operation |
> | Action | Microsoft.SignalRService/register/action | Registers the 'Microsoft.SignalRService' resource provider with a subscription |
> | Action | Microsoft.SignalRService/SignalR/delete | Delete the entire SignalR service |
> | Action | Microsoft.SignalRService/SignalR/eventGridFilters/delete | Delete an event grid filter from a SignalR. |
> | Action | Microsoft.SignalRService/SignalR/eventGridFilters/read | Get the properties of the specified event grid filter or lists all the event grid filters for the specified SignalR. |
> | Action | Microsoft.SignalRService/SignalR/eventGridFilters/write | Create or update an event grid filter for a SignalR with the specified parameters. |
> | Action | Microsoft.SignalRService/SignalR/listkeys/action | View the value of SignalR access keys in the management portal or through API |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/read | Read a Private Endpoint Connetion Proxy |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/write | Create a Private Endpoint Connection Proxy |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnections/read | Read a Private Endpoint Connection |
> | Action | Microsoft.SignalRService/SignalR/privateEndpointConnections/write | Approve or reject a Private Endpoint Connection |
> | Action | Microsoft.SignalRService/SignalR/privateLinkResources/read | List all SignalR Private Link Resources |
> | Action | Microsoft.SignalRService/SignalR/read | View the SignalR's settings and configurations in the management portal or through API |
> | Action | Microsoft.SignalRService/SignalR/regeneratekey/action | Change the value of SignalR access keys in the management portal or through API |
> | Action | Microsoft.SignalRService/SignalR/restart/action | To restart an Azure SignalR service in the management portal or through API. There will be certain downtime. |
> | Action | Microsoft.SignalRService/SignalR/write | Modify the SignalR's settings and configurations in the management portal or through API |
> | Action | Microsoft.SignalRService/unregister/action | Unregisters the 'Microsoft.SignalRService' resource provider with a subscription |

## Microsoft.Solutions

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Solutions/applicationDefinitions/applicationArtifacts/read | Lists application artifacts of application definition. |
> | Action | Microsoft.Solutions/applicationDefinitions/delete | Removes an application definition. |
> | Action | Microsoft.Solutions/applicationDefinitions/read | Retrieves a list of application definitions. |
> | Action | Microsoft.Solutions/applicationDefinitions/write | Add or modify an application definition. |
> | Action | Microsoft.Solutions/applications/applicationArtifacts/read | Lists application artifacts. |
> | Action | Microsoft.Solutions/applications/delete | Removes an application. |
> | Action | Microsoft.Solutions/applications/read | Retrieves a list of applications. |
> | Action | Microsoft.Solutions/applications/refreshPermissions/action | Refreshes application permission(s). |
> | Action | Microsoft.Solutions/applications/updateAccess/action | Updates application access. |
> | Action | Microsoft.Solutions/applications/write | Creates an application. |
> | Action | Microsoft.Solutions/jitRequests/delete | Remove a JitRequest |
> | Action | Microsoft.Solutions/jitRequests/read | Retrieves a list of JitRequests |
> | Action | Microsoft.Solutions/jitRequests/write | Creates a JitRequest |
> | Action | Microsoft.Solutions/locations/operationStatuses/read | Reads the operation status for the resource. |
> | Action | Microsoft.Solutions/operations/read | Gets the list of operations. |
> | Action | Microsoft.Solutions/register/action | Register to Solutions. |
> | Action | Microsoft.Solutions/unregister/action | Unregisters from Solutions. |

## Microsoft.Sql

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Sql/checkNameAvailability/action | Verify whether given server name is available for provisioning worldwide for a given subscription. |
> | Action | Microsoft.Sql/instancePools/delete | Deletes an instance pool |
> | Action | Microsoft.Sql/instancePools/read | Gets an instance pool |
> | Action | Microsoft.Sql/instancePools/usages/read | Gets an instance pool's usage info |
> | Action | Microsoft.Sql/instancePools/write | Creates or updates an instance pool |
> | Action | Microsoft.Sql/locations/auditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Action | Microsoft.Sql/locations/auditingSettingsOperationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Action | Microsoft.Sql/locations/capabilities/read | Gets the capabilities for this subscription in a given location |
> | Action | Microsoft.Sql/locations/databaseAzureAsyncOperation/read | Gets the status of a database operation. |
> | Action | Microsoft.Sql/locations/databaseOperationResults/read | Gets the status of a database operation. |
> | Action | Microsoft.Sql/locations/deletedServerAsyncOperation/read | Gets in-progress operations on deleted server |
> | Action | Microsoft.Sql/locations/deletedServerOperationResults/read | Gets in-progress operations on deleted server |
> | Action | Microsoft.Sql/locations/deletedServers/read | Return the list of deleted servers or gets the properties for the specified deleted server. |
> | Action | Microsoft.Sql/locations/deletedServers/recover/action | Recover a deleted server |
> | Action | Microsoft.Sql/locations/elasticPoolAzureAsyncOperation/read | Gets the azure async operation for an elastic pool async operation |
> | Action | Microsoft.Sql/locations/elasticPoolOperationResults/read | Gets the result of an elastic pool operation. |
> | Action | Microsoft.Sql/locations/encryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Action | Microsoft.Sql/locations/encryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption encryption protector |
> | Action | Microsoft.Sql/locations/extendedAuditingSettingsAzureAsyncOperation/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Action | Microsoft.Sql/locations/extendedAuditingSettingsOperationResults/read | Retrieve result of the extended server blob auditing policy Set operation |
> | Action | Microsoft.Sql/locations/firewallRulesAzureAsyncOperation/read | Gets the status of a firewall rule operation. |
> | Action | Microsoft.Sql/locations/firewallRulesOperationResults/read | Gets the status of a firewall rule operation. |
> | Action | Microsoft.Sql/locations/instanceFailoverGroups/delete | Deletes an existing instance failover group. |
> | Action | Microsoft.Sql/locations/instanceFailoverGroups/failover/action | Executes planned failover in an existing instance failover group. |
> | Action | Microsoft.Sql/locations/instanceFailoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing instance failover group. |
> | Action | Microsoft.Sql/locations/instanceFailoverGroups/read | Returns the list of instance failover groups or gets the properties for the specified instance failover group. |
> | Action | Microsoft.Sql/locations/instanceFailoverGroups/write | Creates an instance failover group with the specified parameters or updates the properties or tags for the specified instance failover group. |
> | Action | Microsoft.Sql/locations/instancePoolAzureAsyncOperation/read | Gets the status of an instance pool operation |
> | Action | Microsoft.Sql/locations/instancePoolOperationResults/read | Gets the result for an instance pool operation |
> | Action | Microsoft.Sql/locations/interfaceEndpointProfileAzureAsyncOperation/read | Returns the details of a specific interface endpoint Azure async operation |
> | Action | Microsoft.Sql/locations/interfaceEndpointProfileOperationResults/read | Returns the details of the specified interface endpoint profile operation |
> | Action | Microsoft.Sql/locations/jobAgentAzureAsyncOperation/read | Gets the status of an job agent operation. |
> | Action | Microsoft.Sql/locations/jobAgentOperationResults/read | Gets the result of an job agent operation. |
> | Action | Microsoft.Sql/locations/longTermRetentionBackups/read | Lists the long term retention backups for every database on every server in a location |
> | Action | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionBackups/read | Lists the long term retention backups for every database on a server |
> | Action | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/delete | Deletes a long term retention backup |
> | Action | Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/read | Lists the long term retention backups for a database |
> | Action | Microsoft.Sql/locations/managedDatabaseRestoreAzureAsyncOperation/completeRestore/action | Completes managed database restore operation |
> | Action | Microsoft.Sql/locations/managedInstanceEncryptionProtectorAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Action | Microsoft.Sql/locations/managedInstanceEncryptionProtectorOperationResults/read | Gets in-progress operations on transparent data encryption managed instance encryption protector |
> | Action | Microsoft.Sql/locations/managedInstanceKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Action | Microsoft.Sql/locations/managedInstanceKeyOperationResults/read | Gets in-progress operations on transparent data encryption managed instance keys |
> | Action | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyAzureAsyncOperation/read | Gets the status of a long term retention policy operation for a managed database |
> | Action | Microsoft.Sql/locations/managedInstanceLongTermRetentionPolicyOperationResults/read | Gets the status of a long term retention policy operation for a managed database |
> | Action | Microsoft.Sql/locations/managedShortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Action | Microsoft.Sql/locations/managedTransparentDataEncryptionAzureAsyncOperation/read | Gets in-progress operations on managed database transparent data encryption |
> | Action | Microsoft.Sql/locations/managedTransparentDataEncryptionOperationResults/read | Gets in-progress operations on managed database transparent data encryption |
> | Action | Microsoft.Sql/locations/privateEndpointConnectionAzureAsyncOperation/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.Sql/locations/privateEndpointConnectionOperationResults/read | Gets the result for a private endpoint connection operation |
> | Action | Microsoft.Sql/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.Sql/locations/privateEndpointConnectionProxyOperationResults/read | Gets the result for a private endpoint connection proxy operation |
> | Action | Microsoft.Sql/locations/read | Gets the available locations for a given subscription |
> | Action | Microsoft.Sql/locations/serverKeyAzureAsyncOperation/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.Sql/locations/serverKeyOperationResults/read | Gets in-progress operations on transparent data encryption server keys |
> | Action | Microsoft.Sql/locations/shortTermRetentionPolicyOperationResults/read | Gets the status of a short term retention policy operation |
> | Action | Microsoft.Sql/locations/syncAgentOperationResults/read | Retrieve result of the sync agent resource operation |
> | Action | Microsoft.Sql/locations/syncDatabaseIds/read | Retrieve the sync database ids for a particular region and subscription |
> | Action | Microsoft.Sql/locations/syncGroupOperationResults/read | Retrieve result of the sync group resource operation |
> | Action | Microsoft.Sql/locations/syncMemberOperationResults/read | Retrieve result of the sync member resource operation |
> | Action | Microsoft.Sql/locations/usages/read | Gets a collection of usage metrics for this subscription in a location |
> | Action | Microsoft.Sql/locations/virtualNetworkRulesAzureAsyncOperation/read | Returns the details of the specified virtual network rules azure async operation  |
> | Action | Microsoft.Sql/locations/virtualNetworkRulesOperationResults/read | Returns the details of the specified virtual network rules operation  |
> | Action | Microsoft.Sql/managedInstances/administrators/delete | Deletes an existing administrator of managed instance. |
> | Action | Microsoft.Sql/managedInstances/administrators/read | Gets a list of managed instance administrators. |
> | Action | Microsoft.Sql/managedInstances/administrators/write | Creates or updates managed instance administrator with the specified parameters. |
> | Action | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/read | Gets a long term retention policy for a managed database |
> | Action | Microsoft.Sql/managedInstances/databases/backupLongTermRetentionPolicies/write | Updates a long term retention policy for a managed database |
> | Action | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a managed database |
> | Action | Microsoft.Sql/managedInstances/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a managed database |
> | Action | Microsoft.Sql/managedInstances/databases/columns/read | Return a list of columns for a managed database |
> | Action | Microsoft.Sql/managedInstances/databases/completeRestore/action | Completes managed database restore operation |
> | Action | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Action | Microsoft.Sql/managedInstances/databases/delete | Deletes an existing managed database |
> | Action | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Sql/managedInstances/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instance databases |
> | Action | Microsoft.Sql/managedInstances/databases/read | Gets existing managed database |
> | Action | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Action | Microsoft.Sql/managedInstances/databases/restoreDetails/read | Returns managed database restore details while restore is in progress. |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/read | Get a managed database schema. (schema only) |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/read | Get a managed database column (schema only) |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Action | Microsoft.Sql/managedInstances/databases/schemas/tables/read | Get a managed database table (schema only) |
> | Action | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/read | Retrieve a list of managed database threat detection policies configured for a given server |
> | Action | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/write | Change the database threat detection policy for a given managed database |
> | Action | Microsoft.Sql/managedInstances/databases/securityEvents/read | Retrieves the managed database security events |
> | Action | Microsoft.Sql/managedInstances/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/read | Retrieve details of the database Transparent Data Encryption on a given managed database |
> | Action | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/write | Change the database Transparent Data Encryption for a given managed database |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Action | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Action | Microsoft.Sql/managedInstances/databases/write | Creates a new database or updates an existing database. |
> | Action | Microsoft.Sql/managedInstances/delete | Deletes an existing  managed instance. |
> | Action | Microsoft.Sql/managedInstances/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Action | Microsoft.Sql/managedInstances/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Action | Microsoft.Sql/managedInstances/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Action | Microsoft.Sql/managedInstances/inaccessibleManagedDatabases/read | Gets a list of inaccessible managed databases in a managed instance |
> | Action | Microsoft.Sql/managedInstances/keys/delete | Deletes an existing Azure SQL Managed Instance  key. |
> | Action | Microsoft.Sql/managedInstances/keys/read | Return the list of managed instance keys or gets the properties for the specified managed instance key. |
> | Action | Microsoft.Sql/managedInstances/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified managed instance key. |
> | Action | Microsoft.Sql/managedInstances/metricDefinitions/read | Get managed instance metric definitions |
> | Action | Microsoft.Sql/managedInstances/metrics/read | Get managed instance metrics |
> | Action | Microsoft.Sql/managedInstances/operations/cancel/action | Cancels Azure SQL Managed Instance pending asynchronous operation that is not finished yet. |
> | Action | Microsoft.Sql/managedInstances/operations/read | Get managed instance operations |
> | Action | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for managed instances |
> | Action | Microsoft.Sql/managedInstances/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for managed instances |
> | Action | Microsoft.Sql/managedInstances/read | Return the list of managed instances or gets the properties for the specified managed instance. |
> | Action | Microsoft.Sql/managedInstances/recoverableDatabases/read | Returns a list of recoverable managed databases |
> | Action | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a dropped managed database |
> | Action | Microsoft.Sql/managedInstances/restorableDroppedDatabases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a dropped managed database |
> | Action | Microsoft.Sql/managedInstances/restorableDroppedDatabases/read | Returns a list of restorable dropped managed databases. |
> | Action | Microsoft.Sql/managedInstances/securityAlertPolicies/read | Retrieve a list of managed server threat detection policies configured for a given server |
> | Action | Microsoft.Sql/managedInstances/securityAlertPolicies/write | Change the managed server threat detection policy for a given managed server |
> | Action | Microsoft.Sql/managedInstances/tdeCertificates/action | Create/Update TDE certificate |
> | Action | Microsoft.Sql/managedInstances/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given managed instance |
> | Action | Microsoft.Sql/managedInstances/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given managed instance |
> | Action | Microsoft.Sql/managedInstances/vulnerabilityAssessments/write | Change the vulnerability assessment for a given managed instance |
> | Action | Microsoft.Sql/managedInstances/write | Creates a managed instance with the specified parameters or update the properties or tags for the specified managed instance. |
> | Action | Microsoft.Sql/operations/read | Gets available REST operations |
> | Action | Microsoft.Sql/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Action | Microsoft.Sql/register/action | Registers the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | Action | Microsoft.Sql/servers/administrators/delete | Deletes a specific Azure Active Directory administrator object |
> | Action | Microsoft.Sql/servers/administrators/read | Gets a specific Azure Active Directory administrator object |
> | Action | Microsoft.Sql/servers/administrators/write | Adds or updates a specific Azure Active Directory administrator object |
> | Action | Microsoft.Sql/servers/advisors/read | Returns list of advisors available for the server |
> | Action | Microsoft.Sql/servers/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the server |
> | Action | Microsoft.Sql/servers/advisors/recommendedActions/write | Apply the recommended action on the server |
> | Action | Microsoft.Sql/servers/advisors/write | Updates auto-execute status of an advisor on server level. |
> | Action | Microsoft.Sql/servers/auditingPolicies/read | Retrieve details of the default server table auditing policy configured on a given server |
> | Action | Microsoft.Sql/servers/auditingPolicies/write | Change the default server table auditing for a given server |
> | Action | Microsoft.Sql/servers/auditingSettings/operationResults/read | Retrieve result of the server blob auditing policy Set operation |
> | Action | Microsoft.Sql/servers/auditingSettings/read | Retrieve details of the server blob auditing policy configured on a given server |
> | Action | Microsoft.Sql/servers/auditingSettings/write | Change the server blob auditing for a given server |
> | Action | Microsoft.Sql/servers/automaticTuning/read | Returns automatic tuning settings for the server |
> | Action | Microsoft.Sql/servers/automaticTuning/write | Updates automatic tuning settings for the server and returns updated settings |
> | Action | Microsoft.Sql/servers/backupLongTermRetentionVaults/delete | Deletes an existing backup archival vault. |
> | Action | Microsoft.Sql/servers/backupLongTermRetentionVaults/read | This operation is used to get a backup long term retention vault. It returns information about the vault registered to this server |
> | Action | Microsoft.Sql/servers/backupLongTermRetentionVaults/write | This operation is used to register a backup long term retention vault to a server |
> | Action | Microsoft.Sql/servers/communicationLinks/delete | Deletes an existing server communication link. |
> | Action | Microsoft.Sql/servers/communicationLinks/read | Return the list of communication links of a specified server. |
> | Action | Microsoft.Sql/servers/communicationLinks/write | Create or update a server communication link. |
> | Action | Microsoft.Sql/servers/connectionPolicies/read | Return the list of server connection policies of a specified server. |
> | Action | Microsoft.Sql/servers/connectionPolicies/write | Create or update a server connection policy. |
> | Action | Microsoft.Sql/servers/databases/advisors/read | Returns list of advisors available for the database |
> | Action | Microsoft.Sql/servers/databases/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the database |
> | Action | Microsoft.Sql/servers/databases/advisors/recommendedActions/write | Apply the recommended action on the database |
> | Action | Microsoft.Sql/servers/databases/advisors/write | Update auto-execute status of an advisor on database level. |
> | Action | Microsoft.Sql/servers/databases/auditingPolicies/read | Retrieve details of the table auditing policy configured on a given database |
> | Action | Microsoft.Sql/servers/databases/auditingPolicies/write | Change the table auditing policy for a given database |
> | Action | Microsoft.Sql/servers/databases/auditingSettings/read | Retrieve details of the blob auditing policy configured on a given database |
> | Action | Microsoft.Sql/servers/databases/auditingSettings/write | Change the blob auditing policy for a given database |
> | Action | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Action | Microsoft.Sql/servers/databases/automaticTuning/read | Returns automatic tuning settings for a database |
> | Action | Microsoft.Sql/servers/databases/automaticTuning/write | Updates automatic tuning settings for a database and returns updated settings |
> | Action | Microsoft.Sql/servers/databases/azureAsyncOperation/read | Gets the status of a database operation. |
> | Action | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/read | Return the list of backup archival policies of a specified database. |
> | Action | Microsoft.Sql/servers/databases/backupLongTermRetentionPolicies/write | Create or update a database backup archival policy. |
> | Action | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/read | Gets a short term retention policy for a database |
> | Action | Microsoft.Sql/servers/databases/backupShortTermRetentionPolicies/write | Updates a short term retention policy for a database |
> | Action | Microsoft.Sql/servers/databases/columns/read | Return a list of columns for a database |
> | Action | Microsoft.Sql/servers/databases/connectionPolicies/read | Retrieve details of the connection policy configured on a given database |
> | Action | Microsoft.Sql/servers/databases/connectionPolicies/write | Change connection policy for a given database |
> | Action | Microsoft.Sql/servers/databases/currentSensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/servers/databases/currentSensitivityLabels/write | Batch update sensitivity labels |
> | Action | Microsoft.Sql/servers/databases/dataMaskingPolicies/read | Return the list of database data masking policies. |
> | Action | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/delete | Delete data masking policy rule for a given database |
> | Action | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/read | Retrieve details of the data masking policy rule configured on a given database |
> | Action | Microsoft.Sql/servers/databases/dataMaskingPolicies/rules/write | Change data masking policy rule for a given database |
> | Action | Microsoft.Sql/servers/databases/dataMaskingPolicies/write | Change data masking policy for a given database |
> | Action | Microsoft.Sql/servers/databases/dataWarehouseQueries/dataWarehouseQuerySteps/read | Returns the distributed query step information of data warehouse query for selected step ID |
> | Action | Microsoft.Sql/servers/databases/dataWarehouseQueries/read | Returns the data warehouse distribution query information for selected query ID |
> | Action | Microsoft.Sql/servers/databases/dataWarehouseUserActivities/read | Retrieves the user activities of a SQL Data Warehouse instance which includes running and suspended queries |
> | Action | Microsoft.Sql/servers/databases/delete | Deletes an existing database. |
> | Action | Microsoft.Sql/servers/databases/export/action | Export Azure SQL Database |
> | Action | Microsoft.Sql/servers/databases/extendedAuditingSettings/read | Retrieve details of the extended blob auditing policy configured on a given database |
> | Action | Microsoft.Sql/servers/databases/extendedAuditingSettings/write | Change the extended blob auditing policy for a given database |
> | Action | Microsoft.Sql/servers/databases/extensions/read | Gets a collection of extensions for the database. |
> | Action | Microsoft.Sql/servers/databases/extensions/write | Change the extension for a given database |
> | Action | Microsoft.Sql/servers/databases/failover/action | Customer initiated database failover. |
> | Action | Microsoft.Sql/servers/databases/geoBackupPolicies/read | Retrieve geo backup policies for a given database |
> | Action | Microsoft.Sql/servers/databases/geoBackupPolicies/write | Create or update a database geobackup policy |
> | Action | Microsoft.Sql/servers/databases/importExportOperationResults/read | Gets in-progress import/export operations |
> | Action | Microsoft.Sql/servers/databases/maintenanceWindowOptions/read | Gets a list of available maintenance windows for a selected database. |
> | Action | Microsoft.Sql/servers/databases/maintenanceWindows/read | Gets maintenance windows settings for a selected database. |
> | Action | Microsoft.Sql/servers/databases/maintenanceWindows/write | Sets maintenance windows settings for a selected database. |
> | Action | Microsoft.Sql/servers/databases/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.Sql/servers/databases/metrics/read | Return metrics for databases |
> | Action | Microsoft.Sql/servers/databases/move/action | Change the name of an existing database. |
> | Action | Microsoft.Sql/servers/databases/operationResults/read | Gets the status of a database operation. |
> | Action | Microsoft.Sql/servers/databases/operations/cancel/action | Cancels Azure SQL Database pending asynchronous operation that is not finished yet. |
> | Action | Microsoft.Sql/servers/databases/operations/read | Return the list of operations performed on the database |
> | Action | Microsoft.Sql/servers/databases/pause/action | Pause Azure SQL Datawarehouse Database |
> | Action | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for databases |
> | Action | Microsoft.Sql/servers/databases/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for databases |
> | Action | Microsoft.Sql/servers/databases/queryStore/queryTexts/read | Returns the collection of query texts that correspond to the specified parameters. |
> | Action | Microsoft.Sql/servers/databases/queryStore/read | Returns current values of Query Store settings for the database. |
> | Action | Microsoft.Sql/servers/databases/queryStore/write | Updates Query Store setting for the database |
> | Action | Microsoft.Sql/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
> | Action | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/write | Batch update recommended sensitivity labels |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/delete | Terminate the replication relationship forcefully and with potential data loss |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/failover/action | Failover after synchronizing all changes from the primary, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/forceFailoverAllowDataLoss/action | Failover immediately with potential data loss, making this database into the replication relationship\u0027s primary and making the remote primary into a secondary |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/unlink/action | Terminate the replication relationship forcefully or after synchronizing with the partner |
> | Action | Microsoft.Sql/servers/databases/replicationLinks/updateReplicationMode/action | Update replication mode for link to synchronous or asynchronous mode |
> | Action | Microsoft.Sql/servers/databases/restorePoints/action | Creates a new restore point |
> | Action | Microsoft.Sql/servers/databases/restorePoints/delete | Deletes a restore point for the database. |
> | Action | Microsoft.Sql/servers/databases/restorePoints/read | Returns restore points for the database. |
> | Action | Microsoft.Sql/servers/databases/resume/action | Resume Azure SQL Datawarehouse Database |
> | Action | Microsoft.Sql/servers/databases/schemas/read | Get a database schema (schema only). |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/read | Get a database column (schema only). |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/delete | Delete the sensitivity label of a given column |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/disable/action | Disable sensitivity recommendations on a given column |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/enable/action | Enable sensitivity recommendations on a given column |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/read | Get the sensitivity label of a given column |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/write | Create or update the sensitivity label of a given column |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/read | Get a database table (schema only). |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/read | Retrieve list of index recommendations on a database |
> | Action | Microsoft.Sql/servers/databases/schemas/tables/recommendedIndexes/write | Apply index recommendation |
> | Action | Microsoft.Sql/servers/databases/securityAlertPolicies/read | Retrieve a list of database threat detection policies configured for a given server |
> | Action | Microsoft.Sql/servers/databases/securityAlertPolicies/write | Change the database threat detection policy for a given database |
> | Action | Microsoft.Sql/servers/databases/securityMetrics/read | Gets a collection of database security metrics |
> | Action | Microsoft.Sql/servers/databases/sensitivityLabels/read | List sensitivity labels of a given database |
> | Action | Microsoft.Sql/servers/databases/serviceTierAdvisors/read | Return suggestion about scaling database up or down based on query execution statistics to improve performance or reduce cost |
> | Action | Microsoft.Sql/servers/databases/skus/read | Gets a collection of skus available for a database |
> | Action | Microsoft.Sql/servers/databases/syncGroups/cancelSync/action | Cancel sync group synchronization |
> | Action | Microsoft.Sql/servers/databases/syncGroups/delete | Deletes an existing sync group. |
> | Action | Microsoft.Sql/servers/databases/syncGroups/hubSchemas/read | Return the list of sync hub database schemas |
> | Action | Microsoft.Sql/servers/databases/syncGroups/logs/read | Return the list of sync group logs |
> | Action | Microsoft.Sql/servers/databases/syncGroups/read | Return the list of sync groups or gets the properties for the specified sync group. |
> | Action | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchema/action | Refresh sync hub database schema |
> | Action | Microsoft.Sql/servers/databases/syncGroups/refreshHubSchemaOperationResults/read | Retrieve result of the sync hub schema refresh operation |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/delete | Deletes an existing sync member. |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/read | Return the list of sync members or gets the properties for the specified sync member. |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchema/action | Refresh sync member schema |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/refreshSchemaOperationResults/read | Retrieve result of the sync member schema refresh operation |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/schemas/read | Return the list of sync member database schemas |
> | Action | Microsoft.Sql/servers/databases/syncGroups/syncMembers/write | Creates a sync member with the specified parameters or update the properties for the specified sync member. |
> | Action | Microsoft.Sql/servers/databases/syncGroups/triggerSync/action | Trigger sync group synchronization |
> | Action | Microsoft.Sql/servers/databases/syncGroups/write | Creates a sync group with the specified parameters or update the properties for the specified sync group. |
> | Action | Microsoft.Sql/servers/databases/topQueries/queryText/action | Returns the Transact-SQL text for selected query ID |
> | Action | Microsoft.Sql/servers/databases/topQueries/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Action | Microsoft.Sql/servers/databases/topQueries/statistics/read | Returns aggregated runtime statistics for selected query in selected time period |
> | Action | Microsoft.Sql/servers/databases/transparentDataEncryption/operationResults/read | Gets in-progress operations on transparent data encryption |
> | Action | Microsoft.Sql/servers/databases/transparentDataEncryption/read | Retrieve status and details of transparent data encryption security feature for a given database |
> | Action | Microsoft.Sql/servers/databases/transparentDataEncryption/write | Change transparent data encryption state |
> | Action | Microsoft.Sql/servers/databases/upgradeDataWarehouse/action | Upgrade Azure SQL Datawarehouse Database |
> | Action | Microsoft.Sql/servers/databases/usages/read | Gets the Azure SQL Database usages information |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a givendatabase |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/delete | Remove the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/read | Get the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/rules/baselines/write | Change the vulnerability assessment rule baseline for a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/export/action | Convert an existing scan result to a human readable format. If already exists nothing happens |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/initiateScan/action | Execute vulnerability assessment database scan. |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/scans/read | Return the list of database vulnerability assessment scan records or get the scan record for the specified scan ID. |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessments/write | Change the vulnerability assessment for a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/action | Execute vulnerability assessment database scan. |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/operationResults/read | Retrieve the result of the database vulnerability assessment scan Execute operation |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/read | Retrieve details of the vulnerability assessment configured on a given database |
> | Action | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/write | Change the vulnerability assessment for a given database |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/delete | Drops a specific workload group. |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/read | Lists the workload groups for a selected database. |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/delete | Drops a specific workload classifier. |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/read | Lists the workload classifiers for a selected database. |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/workloadClassifiers/write | Sets the properties for a specific workload classifier. |
> | Action | Microsoft.Sql/servers/databases/workloadGroups/write | Sets the properties for a specific workload group. |
> | Action | Microsoft.Sql/servers/databases/write | Creates a database with the specified parameters or update the properties or tags for the specified database. |
> | Action | Microsoft.Sql/servers/delete | Deletes an existing server. |
> | Action | Microsoft.Sql/servers/disasterRecoveryConfiguration/delete | Deletes an existing disaster recovery configurations for a given server |
> | Action | Microsoft.Sql/servers/disasterRecoveryConfiguration/failover/action | Failover a DisasterRecoveryConfiguration |
> | Action | Microsoft.Sql/servers/disasterRecoveryConfiguration/forceFailoverAllowDataLoss/action | Force Failover a DisasterRecoveryConfiguration |
> | Action | Microsoft.Sql/servers/disasterRecoveryConfiguration/read | Gets a collection of disaster recovery configurations that include this server |
> | Action | Microsoft.Sql/servers/disasterRecoveryConfiguration/write | Change server disaster recovery configuration |
> | Action | Microsoft.Sql/servers/elasticPoolEstimates/read | Returns list of elastic pool estimates already created for this server |
> | Action | Microsoft.Sql/servers/elasticPoolEstimates/write | Creates new elastic pool estimate for list of databases provided |
> | Action | Microsoft.Sql/servers/elasticPools/advisors/read | Returns list of advisors available for the elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/read | Returns list of recommended actions of specified advisor for the elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/advisors/recommendedActions/write | Apply the recommended action on the elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/advisors/write | Update auto-execute status of an advisor on elastic pool level. |
> | Action | Microsoft.Sql/servers/elasticPools/databases/read | Gets a list of databases for an elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/delete | Delete existing elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/elasticPoolActivity/read | Retrieve activities and details on a given elastic database pool |
> | Action | Microsoft.Sql/servers/elasticPools/elasticPoolDatabaseActivity/read | Retrieve activities and details on a given database that is part of elastic database pool |
> | Action | Microsoft.Sql/servers/elasticPools/failover/action | Customer initiated elastic pool failover. |
> | Action | Microsoft.Sql/servers/elasticPools/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Action | Microsoft.Sql/servers/elasticPools/metrics/read | Return metrics for elastic database pools |
> | Action | Microsoft.Sql/servers/elasticPools/operations/cancel/action | Cancels Azure SQL elastic pool pending asynchronous operation that is not finished yet. |
> | Action | Microsoft.Sql/servers/elasticPools/operations/read | Return the list of operations performed on the elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Action | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Action | Microsoft.Sql/servers/elasticPools/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for elastic database pools |
> | Action | Microsoft.Sql/servers/elasticPools/read | Retrieve details of elastic pool on a given server |
> | Action | Microsoft.Sql/servers/elasticPools/skus/read | Gets a collection of skus available for an elastic pool |
> | Action | Microsoft.Sql/servers/elasticPools/write | Create a new or change properties of existing elastic pool |
> | Action | Microsoft.Sql/servers/encryptionProtector/read | Returns a list of server encryption protectors or gets the properties for the specified server encryption protector. |
> | Action | Microsoft.Sql/servers/encryptionProtector/revalidate/action | Update the properties for the specified Server Encryption Protector. |
> | Action | Microsoft.Sql/servers/encryptionProtector/write | Update the properties for the specified Server Encryption Protector. |
> | Action | Microsoft.Sql/servers/extendedAuditingSettings/read | Retrieve details of the extended server blob auditing policy configured on a given server |
> | Action | Microsoft.Sql/servers/extendedAuditingSettings/write | Change the extended server blob auditing for a given server |
> | Action | Microsoft.Sql/servers/failoverGroups/delete | Deletes an existing failover group. |
> | Action | Microsoft.Sql/servers/failoverGroups/failover/action | Executes planned failover in an existing failover group. |
> | Action | Microsoft.Sql/servers/failoverGroups/forceFailoverAllowDataLoss/action | Executes forced failover in an existing failover group. |
> | Action | Microsoft.Sql/servers/failoverGroups/read | Returns the list of failover groups or gets the properties for the specified failover group. |
> | Action | Microsoft.Sql/servers/failoverGroups/write | Creates a failover group with the specified parameters or updates the properties or tags for the specified failover group. |
> | Action | Microsoft.Sql/servers/firewallRules/delete | Deletes an existing server firewall rule. |
> | Action | Microsoft.Sql/servers/firewallRules/read | Return the list of server firewall rules or gets the properties for the specified server firewall rule. |
> | Action | Microsoft.Sql/servers/firewallRules/write | Creates a server firewall rule with the specified parameters, update the properties for the specified rule or overwrite all existing rules with new server firewall rule(s). |
> | Action | Microsoft.Sql/servers/import/action | Create a new database on the server and deploy schema and data from a DacPac package |
> | Action | Microsoft.Sql/servers/importExportOperationResults/read | Gets in-progress import/export operations |
> | Action | Microsoft.Sql/servers/inaccessibleDatabases/read | Return a list of inaccessible database(s) in a logical server. |
> | Action | Microsoft.Sql/servers/interfaceEndpointProfiles/delete | Deletes the specified interface endpoint profile |
> | Action | Microsoft.Sql/servers/interfaceEndpointProfiles/read | Returns the properties for the specified interface endpoint profile |
> | Action | Microsoft.Sql/servers/interfaceEndpointProfiles/write | Creates a interface endpoint profile with the specified parameters or updates the properties or tags for the specified interface endpoint |
> | Action | Microsoft.Sql/servers/jobAgents/delete | Deletes an Azure SQL DB job agent |
> | Action | Microsoft.Sql/servers/jobAgents/read | Gets an Azure SQL DB job agent |
> | Action | Microsoft.Sql/servers/jobAgents/write | Creates or updates an Azure SQL DB job agent |
> | Action | Microsoft.Sql/servers/keys/delete | Deletes an existing server key. |
> | Action | Microsoft.Sql/servers/keys/read | Return the list of server keys or gets the properties for the specified server key. |
> | Action | Microsoft.Sql/servers/keys/write | Creates a key with the specified parameters or update the properties or tags for the specified server key. |
> | Action | Microsoft.Sql/servers/operationResults/read | Gets in-progress server operations |
> | Action | Microsoft.Sql/servers/operations/read | Return the list of operations performed on the server |
> | Action | Microsoft.Sql/servers/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Action | Microsoft.Sql/servers/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy. |
> | Action | Microsoft.Sql/servers/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Action | Microsoft.Sql/servers/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy. |
> | Action | Microsoft.Sql/servers/privateEndpointConnections/delete | Deletes an existing private endpoint connection |
> | Action | Microsoft.Sql/servers/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connection. |
> | Action | Microsoft.Sql/servers/privateEndpointConnections/write | Approves or rejects an existing private endpoint connection |
> | Action | Microsoft.Sql/servers/privateEndpointConnectionsApproval/action | Determines if user is allowed to approve a private endpoint connection |
> | Action | Microsoft.Sql/servers/privateLinkResources/read | Get the private link resources for the corresponding sql server |
> | Action | Microsoft.Sql/servers/providers/Microsoft.Insights/metricDefinitions/read | Return types of metrics that are available for servers |
> | Action | Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Action | Microsoft.Sql/servers/recommendedElasticPools/databases/read | Retrieve metrics for recommended elastic database pools for a given server |
> | Action | Microsoft.Sql/servers/recommendedElasticPools/read | Retrieve recommendation for elastic database pools to reduce cost or improve performance based on historical resource utilization |
> | Action | Microsoft.Sql/servers/recoverableDatabases/read | This operation is used for disaster recovery of live database to restore database to last-known good backup point. It returns information about the last good backup but it doesn\u0027t actually restore the database. |
> | Action | Microsoft.Sql/servers/replicationLinks/read | Return the list of replication links or gets the properties for the specified replication links. |
> | Action | Microsoft.Sql/servers/restorableDroppedDatabases/read | Get a list of databases that were dropped on a given server that are still within retention policy. |
> | Action | Microsoft.Sql/servers/securityAlertPolicies/operationResults/read | Retrieve results of the server threat detection policy write operation |
> | Action | Microsoft.Sql/servers/securityAlertPolicies/read | Retrieve a list of server threat detection policies configured for a given server |
> | Action | Microsoft.Sql/servers/securityAlertPolicies/write | Change the server threat detection policy for a given server |
> | Action | Microsoft.Sql/servers/serviceObjectives/read | Retrieve list of service level objectives (also known as performance tiers) available on a given server |
> | Action | Microsoft.Sql/servers/syncAgents/delete | Deletes an existing sync agent. |
> | Action | Microsoft.Sql/servers/syncAgents/generateKey/action | Generate sync agent registration key |
> | Action | Microsoft.Sql/servers/syncAgents/linkedDatabases/read | Return the list of sync agent linked databases |
> | Action | Microsoft.Sql/servers/syncAgents/read | Return the list of sync agents or gets the properties for the specified sync agent. |
> | Action | Microsoft.Sql/servers/syncAgents/write | Creates a sync agent with the specified parameters or update the properties for the specified sync agent. |
> | Action | Microsoft.Sql/servers/tdeCertificates/action | Create/Update TDE certificate |
> | Action | Microsoft.Sql/servers/usages/read | Return server DTU quota and current DTU consumption by all databases within the server |
> | Action | Microsoft.Sql/servers/virtualNetworkRules/delete | Deletes an existing Virtual Network Rule |
> | Action | Microsoft.Sql/servers/virtualNetworkRules/read | Return the list of virtual network rules or gets the properties for the specified virtual network rule. |
> | Action | Microsoft.Sql/servers/virtualNetworkRules/write | Creates a virtual network rule with the specified parameters or update the properties or tags for the specified virtual network rule. |
> | Action | Microsoft.Sql/servers/vulnerabilityAssessments/delete | Remove the vulnerability assessment for a given server |
> | Action | Microsoft.Sql/servers/vulnerabilityAssessments/read | Retrieve the vulnerability assessment policies on a given server |
> | Action | Microsoft.Sql/servers/vulnerabilityAssessments/write | Change the vulnerability assessment for a given server |
> | Action | Microsoft.Sql/servers/write | Creates a server with the specified parameters or update the properties or tags for the specified server. |
> | Action | Microsoft.Sql/unregister/action | UnRegisters the subscription for the Microsoft SQL Database resource provider and enables the creation of Microsoft SQL Databases. |
> | Action | Microsoft.Sql/virtualClusters/delete | Deletes an existing virtual cluster. |
> | Action | Microsoft.Sql/virtualClusters/read | Return the list of virtual clusters or gets the properties for the specified virtual cluster. |
> | Action | Microsoft.Sql/virtualClusters/write | Updates virtual cluster tags. |

## Microsoft.SqlVirtualMachine

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.SqlVirtualMachine/locations/availabilityGroupListenerOperationResults/read | Get result of an availability group listener operation |
> | Action | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineGroupOperationResults/read | Get result of a SQL virtual machine group operation |
> | Action | Microsoft.SqlVirtualMachine/locations/sqlVirtualMachineOperationResults/read | Get result of SQL virtual machine operation |
> | Action | Microsoft.SqlVirtualMachine/operations/read |  |
> | Action | Microsoft.SqlVirtualMachine/register/action | Register subscription with Microsoft.SqlVirtualMachine resource provider |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/delete | Delete existing availability group listener |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/read | Retrieve details of SQL availability group listener on a given SQL virtual machine group |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/availabilityGroupListeners/write | Create a new or changes properties of existing SQL availability group listener |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/delete | Delete existing SQL virtual machine group |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/read | Retrive details of SQL virtual machine group |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/sqlVirtualMachines/read | List Sql virtual machines by a particular sql virtual virtual machine group |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachineGroups/write | Create a new or change properties of existing SQL virtual machine group |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachines/delete | Delete existing SQL virtual machine |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachines/read | Retrieve details of SQL virtual machine |
> | Action | Microsoft.SqlVirtualMachine/sqlVirtualMachines/write | Create a new or change properties of existing SQL virtual machine |
> | Action | Microsoft.SqlVirtualMachine/unregister/action | Unregister subscription with Microsoft.SqlVirtualMachine resource provider |

## Microsoft.Storage

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Storage/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Action | Microsoft.Storage/locations/checknameavailability/read | Checks that account name is valid and is not in use. |
> | Action | Microsoft.Storage/locations/deleteVirtualNetworkOrSubnets/action | Notifies Microsoft.Storage that virtual network or subnet is being deleted |
> | Action | Microsoft.Storage/locations/usages/read | Returns the limit and the current usage count for resources in the specified subscription |
> | Action | Microsoft.Storage/operations/read | Polls the status of an asynchronous operation. |
> | Action | Microsoft.Storage/register/action | Registers the subscription for the storage resource provider and enables the creation of storage accounts. |
> | Action | Microsoft.Storage/skus/read | Lists the Skus supported by Microsoft.Storage. |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | Returns the result of adding blob content |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Returns the result of deleting a blob |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action | Returns the result of deleting a blob version |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action | Returns the list of blobs under an account with matching tags filter |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action | Returns the result of the blob command |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | Returns the result of reading blob tags |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | Returns the result of writing blob tags |
> | DataAction | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Returns the result of writing a blob |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/clearLegalHold/action | Clear blob container legal hold |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/delete | Returns the result of deleting a container |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/delete | Delete blob container immutability policy |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/extend/action | Extend blob container immutability policy |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/lock/action | Lock blob container immutability policy |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/read | Get blob container immutability policy |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/immutabilityPolicies/write | Put blob container immutability policy |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/lease/action | Returns the result of leasing blob container |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns a container |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns list of containers |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/setLegalHold/action | Set blob container legal hold |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of patch blob container |
> | Action | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of put blob container |
> | Action | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the blob service |
> | Action | Microsoft.Storage/storageAccounts/blobServices/read |  |
> | Action | Microsoft.Storage/storageAccounts/blobServices/read | Returns blob service properties or statistics |
> | Action | Microsoft.Storage/storageAccounts/blobServices/write | Returns the result of put blob service properties |
> | Action | Microsoft.Storage/storageAccounts/delete | Deletes an existing storage account. |
> | Action | Microsoft.Storage/storageAccounts/encryptionScopes/read |  |
> | Action | Microsoft.Storage/storageAccounts/encryptionScopes/read |  |
> | Action | Microsoft.Storage/storageAccounts/encryptionScopes/write |  |
> | Action | Microsoft.Storage/storageAccounts/encryptionScopes/write |  |
> | Action | Microsoft.Storage/storageAccounts/failover/action | Customer is able to control the failover in case of availability issues |
> | DataAction | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/actassuperuser/action | Get File Admin Privileges |
> | DataAction | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete | Returns the result of deleting a file/folder |
> | DataAction | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action | Returns the result of modifying permission on a file/folder |
> | DataAction | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders |
> | DataAction | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write | Returns the result of writing a file or creating a folder |
> | Action | Microsoft.Storage/storageAccounts/fileServices/read |  |
> | Action | Microsoft.Storage/storageAccounts/fileServices/read | Get file service properties |
> | Action | Microsoft.Storage/storageAccounts/fileServices/shares/delete |  |
> | Action | Microsoft.Storage/storageAccounts/fileServices/shares/read |  |
> | Action | Microsoft.Storage/storageAccounts/fileServices/shares/read |  |
> | Action | Microsoft.Storage/storageAccounts/fileServices/shares/write |  |
> | Action | Microsoft.Storage/storageAccounts/fileServices/write |  |
> | Action | Microsoft.Storage/storageAccounts/listAccountSas/action | Returns the Account SAS token for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/listServiceSas/action | Returns the Service SAS token for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/managementPolicies/delete | Delete storage account management policies |
> | Action | Microsoft.Storage/storageAccounts/managementPolicies/read | Get storage management account policies |
> | Action | Microsoft.Storage/storageAccounts/managementPolicies/write | Put storage account management policies |
> | Action | Microsoft.Storage/storageAccounts/objectReplicationPolicies/delete |  |
> | Action | Microsoft.Storage/storageAccounts/objectReplicationPolicies/read |  |
> | Action | Microsoft.Storage/storageAccounts/objectReplicationPolicies/write |  |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxies |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/read | Get Private Endpoint Connection Proxy |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnectionProxies/write | Put Private Endpoint Connection Proxies |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnections/read | Get Private Endpoint Connection |
> | Action | Microsoft.Storage/storageAccounts/privateEndpointConnections/write | Put Private Endpoint Connection |
> | Action | Microsoft.Storage/storageAccounts/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Action | Microsoft.Storage/storageAccounts/privateLinkResources/read | Get StorageAccount groupids |
> | Action | Microsoft.Storage/storageAccounts/queueServices/queues/delete | Returns the result of deleting a queue |
> | DataAction | Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action | Returns the result of adding a message |
> | DataAction | Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete | Returns the result of deleting a message |
> | DataAction | Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action | Returns the result of processing a message |
> | DataAction | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Returns a message |
> | DataAction | Microsoft.Storage/storageAccounts/queueServices/queues/messages/write | Returns the result of writing a message |
> | Action | Microsoft.Storage/storageAccounts/queueServices/queues/read | Returns a queue or a list of queues. |
> | Action | Microsoft.Storage/storageAccounts/queueServices/queues/write | Returns the result of writing a queue |
> | Action | Microsoft.Storage/storageAccounts/queueServices/read | Get Queue service properties |
> | Action | Microsoft.Storage/storageAccounts/queueServices/read | Returns queue service properties or statistics. |
> | Action | Microsoft.Storage/storageAccounts/queueServices/write | Returns the result of setting queue service properties |
> | Action | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/restoreBlobRanges/action | Restore blob ranges to the state of the specified time |
> | Action | Microsoft.Storage/storageAccounts/revokeUserDelegationKeys/action | Revokes all the user delegation keys for the specified storage account. |
> | Action | Microsoft.Storage/storageAccounts/services/diagnosticSettings/write | Create/Update storage account diagnostic settings. |
> | Action | Microsoft.Storage/storageAccounts/tableServices/read | Get Table service properties |
> | Action | Microsoft.Storage/storageAccounts/write | Creates a storage account with the specified parameters or update the properties or tags or adds custom domain for the specified storage account. |
> | Action | Microsoft.Storage/usages/read | Returns the limit and the current usage count for resources in the specified subscription |

## microsoft.storagesync

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | microsoft.storagesync/locations/checkNameAvailability/action | Checks that storage sync service name is valid and is not in use. |
> | Action | microsoft.storagesync/locations/workflows/operations/read | Gets the status of an asynchronous operation |
> | Action | microsoft.storagesync/operations/read | Gets a list of the Supported Operations |
> | Action | microsoft.storagesync/register/action | Registers the subscription for the Storage Sync Provider |
> | Action | microsoft.storagesync/storageSyncServices/delete | Delete any Storage Sync Services |
> | Action | microsoft.storagesync/storageSyncServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Storage Sync Services |
> | Action | microsoft.storagesync/storageSyncServices/read | Read any Storage Sync Services |
> | Action | microsoft.storagesync/storageSyncServices/registeredServers/delete | Delete any Registered Server |
> | Action | microsoft.storagesync/storageSyncServices/registeredServers/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Registered Server |
> | Action | microsoft.storagesync/storageSyncServices/registeredServers/read | Read any Registered Server |
> | Action | microsoft.storagesync/storageSyncServices/registeredServers/write | Create or Update any Registered Server |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/delete | Delete any Cloud Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/operationresults/read | Gets the status of an asynchronous backup/restore operation |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/postbackup/action | Call this action after backup |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/postrestore/action | Call this action after restore |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/prebackup/action | Call this action before backup |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/prerestore/action | Call this action before restore |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/read | Read any Cloud Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/restoreheartbeat/action | Restore heartbeat |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/triggerChangeDetection/action | Call this action to trigger detection of changes on a cloud endpoint's file share |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/cloudEndpoints/write | Create or Update any Cloud Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/delete | Delete any Sync Groups |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Sync Groups |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/read | Read any Sync Groups |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/delete | Delete any Server Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Server Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/read | Read any Server Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/recallAction/action | Call this action to recall files to a server |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/serverEndpoints/write | Create or Update any Server Endpoints |
> | Action | microsoft.storagesync/storageSyncServices/syncGroups/write | Create or Update any Sync Groups |
> | Action | microsoft.storagesync/storageSyncServices/workflows/operationresults/read | Gets the status of an asynchronous operation |
> | Action | microsoft.storagesync/storageSyncServices/workflows/operations/read | Gets the status of an asynchronous operation |
> | Action | microsoft.storagesync/storageSyncServices/workflows/read | Read Workflows |
> | Action | microsoft.storagesync/storageSyncServices/write | Create or Update any Storage Sync Services |
> | Action | microsoft.storagesync/unregister/action | Unregisters the subscription for the Storage Sync Provider |

## Microsoft.StorSimple

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.StorSimple/managers/accessControlRecords/delete | Deletes the Access Control Records |
> | Action | Microsoft.StorSimple/managers/accessControlRecords/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/accessControlRecords/read | Lists or gets the Access Control Records |
> | Action | Microsoft.StorSimple/managers/accessControlRecords/write | Create or update the Access Control Records |
> | Action | Microsoft.StorSimple/managers/alerts/read | Lists or gets the Alerts |
> | Action | Microsoft.StorSimple/managers/backups/read | Lists or gets the Backup Set |
> | Action | Microsoft.StorSimple/managers/bandwidthSettings/delete | Deletes an existing Bandwidth Settings (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/bandwidthSettings/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/bandwidthSettings/read | List the Bandwidth Settings (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/bandwidthSettings/write | Creates a new or updates Bandwidth Settings (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/certificates/write | Create or update the Certificates |
> | Action | Microsoft.StorSimple/Managers/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Action | Microsoft.StorSimple/managers/clearAlerts/action | Clear all the alerts associated with the device manager. |
> | Action | Microsoft.StorSimple/managers/cloudApplianceConfigurations/read | List the Cloud Appliance Supported Configurations |
> | Action | Microsoft.StorSimple/managers/configureDevice/action | Configures a device |
> | Action | Microsoft.StorSimple/managers/delete | Deletes the Device Managers |
> | Action | Microsoft.StorSimple/Managers/delete | The Delete Vault operation deletes the specified Azure resource of type 'vault' |
> | Action | Microsoft.StorSimple/managers/devices/alertSettings/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/alertSettings/read | Lists or gets the Alert Settings |
> | Action | Microsoft.StorSimple/managers/devices/alertSettings/write | Create or update the Alert Settings |
> | Action | Microsoft.StorSimple/managers/devices/authorizeForServiceEncryptionKeyRollover/action | Authorize for Service Encryption Key Rollover of Devices |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/backup/action | Take a manual backup to create an on-demand backup of all the volumes protected by the policy. |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/delete | Deletes an existing Backup Polices (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/read | List the Backup Polices (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/delete | Deletes an existing Schedules |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/read | List the Schedules |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/schedules/write | Creates a new or updates Schedules |
> | Action | Microsoft.StorSimple/managers/devices/backupPolicies/write | Creates a new or updates Backup Polices (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/backups/delete | Deletes the Backup Set |
> | Action | Microsoft.StorSimple/managers/devices/backups/elements/clone/action | Clone a share or volume using a backup element. |
> | Action | Microsoft.StorSimple/managers/devices/backups/elements/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/backups/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/backups/read | Lists or gets the Backup Set |
> | Action | Microsoft.StorSimple/managers/devices/backups/restore/action | Restore all the volumes from a backup set. |
> | Action | Microsoft.StorSimple/managers/devices/backupScheduleGroups/delete | Deletes the Backup Schedule Groups |
> | Action | Microsoft.StorSimple/managers/devices/backupScheduleGroups/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/backupScheduleGroups/read | Lists or gets the Backup Schedule Groups |
> | Action | Microsoft.StorSimple/managers/devices/backupScheduleGroups/write | Create or update the Backup Schedule Groups |
> | Action | Microsoft.StorSimple/managers/devices/chapSettings/delete | Deletes the Chap Settings |
> | Action | Microsoft.StorSimple/managers/devices/chapSettings/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/chapSettings/read | Lists or gets the Chap Settings |
> | Action | Microsoft.StorSimple/managers/devices/chapSettings/write | Create or update the Chap Settings |
> | Action | Microsoft.StorSimple/managers/devices/deactivate/action | Deactivates a device. |
> | Action | Microsoft.StorSimple/managers/devices/delete | Deletes the Devices |
> | Action | Microsoft.StorSimple/managers/devices/disks/read | Lists or gets the Disks |
> | Action | Microsoft.StorSimple/managers/devices/download/action | Download updates for a device. |
> | Action | Microsoft.StorSimple/managers/devices/failover/action | Failover of the device. |
> | Action | Microsoft.StorSimple/managers/devices/failover/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/failoverTargets/read | Lists or gets the Failover targets of the devices |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/backup/action | Take backup of an File Server. |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/delete | Deletes the File Servers |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/read | Lists or gets the File Servers |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/delete | Deletes the Shares |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/read | Lists or gets the Shares |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/shares/write | Create or update the Shares |
> | Action | Microsoft.StorSimple/managers/devices/fileservers/write | Create or update the File Servers |
> | Action | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/changeControllerPowerState/action | Change controller power state of hardware component groups |
> | Action | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/hardwareComponentGroups/read | List the Hardware Component Groups |
> | Action | Microsoft.StorSimple/managers/devices/install/action | Install updates on a device. |
> | Action | Microsoft.StorSimple/managers/devices/installUpdates/action | Installs updates on the devices (8000 Series Only). |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/backup/action | Take backup of an iSCSI server. |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/delete | Deletes the iSCSI Servers |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/delete | Deletes the Disks |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/read | Lists or gets the Disks |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/disks/write | Create or update the Disks |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/read | Lists or gets the iSCSI Servers |
> | Action | Microsoft.StorSimple/managers/devices/iscsiservers/write | Create or update the iSCSI Servers |
> | Action | Microsoft.StorSimple/managers/devices/jobs/cancel/action | Cancel a running job |
> | Action | Microsoft.StorSimple/managers/devices/jobs/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/jobs/read | Lists or gets the Jobs |
> | Action | Microsoft.StorSimple/managers/devices/listFailoverSets/action | List the failover sets for an existing device (8000 Series Only). |
> | Action | Microsoft.StorSimple/managers/devices/listFailoverTargets/action | List failover targets of the devices (8000 Series Only). |
> | Action | Microsoft.StorSimple/managers/devices/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/confirmMigration/action | Confirms a successful migration and commit it. |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/confirmMigrationStatus/read | List the Confirm Migration Status |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchConfirmMigrationStatus/action | Fetch the confirm status of migration. |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationEstimate/action | Fetch the status for the migration estimation job. |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/fetchMigrationStatus/action | Fetch the status for the migration. |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/import/action | Import source configurations for migration |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/migrationEstimate/read | List the Migration Estimate |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/migrationStatus/read | List the Migration Status |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigration/action | Start migration using source configurations |
> | Action | Microsoft.StorSimple/managers/devices/migrationSourceConfigurations/startMigrationEstimate/action | Start a job to estimate the duration of the migration process. |
> | Action | Microsoft.StorSimple/managers/devices/networkSettings/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/networkSettings/read | Lists or gets the Network Settings |
> | Action | Microsoft.StorSimple/managers/devices/networkSettings/write | Creates a new or updates Network Settings |
> | Action | Microsoft.StorSimple/managers/devices/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/publicEncryptionKey/action | List public encryption key of the device manager |
> | Action | Microsoft.StorSimple/managers/devices/publishSupportPackage/action | Publish the support package for an existing device. A StorSimple support package is an easy-to-use mechanism that collects all relevant logs to assist Microsoft Support with troubleshooting any StorSimple device issues. |
> | Action | Microsoft.StorSimple/managers/devices/read | Lists or gets the Devices |
> | Action | Microsoft.StorSimple/managers/devices/scanForUpdates/action | Scan for updates in a device. |
> | Action | Microsoft.StorSimple/managers/devices/securitySettings/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/securitySettings/read | List the Security Settings |
> | Action | Microsoft.StorSimple/managers/devices/securitySettings/syncRemoteManagementCertificate/action | Synchronize the remote management certificate for a device. |
> | Action | Microsoft.StorSimple/managers/devices/securitySettings/update/action | Update the security settings. |
> | Action | Microsoft.StorSimple/managers/devices/securitySettings/write | Creates a new or updates Security Settings |
> | Action | Microsoft.StorSimple/managers/devices/sendTestAlertEmail/action | Send test alert email to configured email recipients. |
> | Action | Microsoft.StorSimple/managers/devices/shares/read | Lists or gets the Shares |
> | Action | Microsoft.StorSimple/managers/devices/timeSettings/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/timeSettings/read | Lists or gets the Time Settings |
> | Action | Microsoft.StorSimple/managers/devices/timeSettings/write | Creates a new or updates Time Settings |
> | Action | Microsoft.StorSimple/managers/devices/updates/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/updateSummary/read | Lists or gets the Update Summary |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/delete | Deletes an existing Volume Containers (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/metrics/read | List the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/metricsDefinitions/read | List the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/read | List the Volume Containers (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/delete | Deletes an existing Volumes |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metrics/read | List the Metrics |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/metricsDefinitions/read | List the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/operationResults/read | List the Operation Results |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/read | List the Volumes |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/volumes/write | Creates a new or updates Volumes |
> | Action | Microsoft.StorSimple/managers/devices/volumeContainers/write | Creates a new or updates Volume Containers (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/devices/volumes/read | List the Volumes |
> | Action | Microsoft.StorSimple/managers/devices/write | Create or update the Devices |
> | Action | Microsoft.StorSimple/managers/encryptionSettings/read | Lists or gets the Encryption Settings |
> | Action | Microsoft.StorSimple/managers/extendedInformation/delete | Deletes the Extended Vault Information |
> | Action | Microsoft.StorSimple/Managers/extendedInformation/delete | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.StorSimple/managers/extendedInformation/read | Lists or gets the Extended Vault Information |
> | Action | Microsoft.StorSimple/Managers/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.StorSimple/managers/extendedInformation/write | Create or update the Extended Vault Information |
> | Action | Microsoft.StorSimple/Managers/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Action | Microsoft.StorSimple/managers/features/read | List the Features |
> | Action | Microsoft.StorSimple/managers/fileservers/read | Lists or gets the File Servers |
> | Action | Microsoft.StorSimple/managers/getEncryptionKey/action | Get encryption key for the device manager. |
> | Action | Microsoft.StorSimple/managers/iscsiservers/read | Lists or gets the iSCSI Servers |
> | Action | Microsoft.StorSimple/managers/jobs/read | Lists or gets the Jobs |
> | Action | Microsoft.StorSimple/managers/listActivationKey/action | Gets the activation key of the StorSimple Device Manager. |
> | Action | Microsoft.StorSimple/managers/listPublicEncryptionKey/action | List public encryption keys of a StorSimple Device Manager. |
> | Action | Microsoft.StorSimple/managers/metrics/read | Lists or gets the Metrics |
> | Action | Microsoft.StorSimple/managers/metricsDefinitions/read | Lists or gets the Metrics Definitions |
> | Action | Microsoft.StorSimple/managers/migrateClassicToResourceManager/action | Migrate from Classic To Resource Manager |
> | Action | Microsoft.StorSimple/managers/migrationSourceConfigurations/read | List the Migration Source Configurations (8000 Series Only) |
> | Action | Microsoft.StorSimple/managers/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/provisionCloudAppliance/action | Create a new cloud appliance. |
> | Action | Microsoft.StorSimple/managers/read | Lists or gets the Device Managers |
> | Action | Microsoft.StorSimple/Managers/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Action | Microsoft.StorSimple/managers/regenerateActivationKey/action | Regenerate the Activation key for an existing StorSimple Device Manager. |
> | Action | Microsoft.StorSimple/managers/storageAccountCredentials/delete | Deletes the Storage Account Credentials |
> | Action | Microsoft.StorSimple/managers/storageAccountCredentials/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/storageAccountCredentials/read | Lists or gets the Storage Account Credentials |
> | Action | Microsoft.StorSimple/managers/storageAccountCredentials/write | Create or update the Storage Account Credentials |
> | Action | Microsoft.StorSimple/managers/storageDomains/delete | Deletes the Storage Domains |
> | Action | Microsoft.StorSimple/managers/storageDomains/operationResults/read | Lists or gets the Operation Results |
> | Action | Microsoft.StorSimple/managers/storageDomains/read | Lists or gets the Storage Domains |
> | Action | Microsoft.StorSimple/managers/storageDomains/write | Create or update the Storage Domains |
> | Action | Microsoft.StorSimple/managers/write | Create or update the Device Managers |
> | Action | Microsoft.StorSimple/Managers/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Action | Microsoft.StorSimple/operations/read | Lists or gets the Operations |
> | Action | Microsoft.StorSimple/register/action | Register Provider Microsoft.StorSimple |

## Microsoft.StreamAnalytics

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.StreamAnalytics/locations/quotas/Read | Read Stream Analytics Subscription Quota |
> | Action | Microsoft.StreamAnalytics/operations/Read | Read Stream Analytics Operations |
> | Action | Microsoft.StreamAnalytics/Register/action | Register subscription with Stream Analytics Resource Provider |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Delete | Delete Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/Delete | Delete Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/operationresults/Read | Read operation results for Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/Read | Read Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/RetrieveDefaultDefinition/action | Retrieve Default Definition of a Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/Test/action | Test Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/functions/Write | Write Stream Analytics Job Function |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/Delete | Delete Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/operationresults/Read | Read operation results for Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/Read | Read Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/Sample/action | Sample Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/Test/action | Test Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/inputs/Write | Write Stream Analytics Job Input |
> | Action | Microsoft.StreamAnalytics/streamingjobs/metricdefinitions/Read | Read Metric Definitions |
> | Action | Microsoft.StreamAnalytics/streamingjobs/operationresults/Read | Read operation results for Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/outputs/Delete | Delete Stream Analytics Job Output |
> | Action | Microsoft.StreamAnalytics/streamingjobs/outputs/operationresults/Read | Read operation results for Stream Analytics Job Output |
> | Action | Microsoft.StreamAnalytics/streamingjobs/outputs/Read | Read Stream Analytics Job Output |
> | Action | Microsoft.StreamAnalytics/streamingjobs/outputs/Test/action | Test Stream Analytics Job Output |
> | Action | Microsoft.StreamAnalytics/streamingjobs/outputs/Write | Write Stream Analytics Job Output |
> | Action | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/read | Read diagnostic setting. |
> | Action | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/diagnosticSettings/write | Write diagnostic setting. |
> | Action | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for streamingjobs |
> | Action | Microsoft.StreamAnalytics/streamingjobs/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for streamingjobs |
> | Action | Microsoft.StreamAnalytics/streamingjobs/PublishEdgePackage/action | Publish edge package for Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Read | Read Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Scale/action | Scale Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Start/action | Start Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Stop/action | Stop Stream Analytics Job |
> | Action | Microsoft.StreamAnalytics/streamingjobs/transformations/Delete | Delete Stream Analytics Job Transformation |
> | Action | Microsoft.StreamAnalytics/streamingjobs/transformations/Read | Read Stream Analytics Job Transformation |
> | Action | Microsoft.StreamAnalytics/streamingjobs/transformations/Write | Write Stream Analytics Job Transformation |
> | Action | Microsoft.StreamAnalytics/streamingjobs/Write | Write Stream Analytics Job |

## Microsoft.Subscription

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Subscription/cancel/action | Cancels the Subscription |
> | Action | Microsoft.Subscription/CreateSubscription/action | Create an Azure subscription |
> | Action | Microsoft.Subscription/register/action | Registers Subscription with Microsoft.Subscription resource provider |
> | Action | Microsoft.Subscription/rename/action | Renames the subscription |
> | Action | Microsoft.Subscription/SubscriptionDefinitions/read | Get an Azure subscription definition within a management group. |
> | Action | Microsoft.Subscription/SubscriptionDefinitions/write | Create an Azure subscription definition |

## Microsoft.Support

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.Support/register/action | Registers to Support Resource Provider |
> | Action | Microsoft.Support/supportTickets/read | Gets Support Ticket details (including status, severity, contact details and communications) or gets the list of Support Tickets across subscriptions. |
> | Action | Microsoft.Support/supportTickets/write | Creates or Updates a Support Ticket. You can create a Support Ticket for Technical, Billing, Quotas or Subscription Management related issues. You can update severity, contact details and communications for existing support tickets. |

## Microsoft.TimeSeriesInsights

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.TimeSeriesInsights/environments/accesspolicies/delete | Deletes the access policy. |
> | Action | Microsoft.TimeSeriesInsights/environments/accesspolicies/read | Get the properties of an access policy. |
> | Action | Microsoft.TimeSeriesInsights/environments/accesspolicies/write | Creates a new access policy for an environment, or updates an existing access policy. |
> | Action | Microsoft.TimeSeriesInsights/environments/delete | Deletes the environment. |
> | Action | Microsoft.TimeSeriesInsights/environments/eventsources/delete | Deletes the event source. |
> | Action | Microsoft.TimeSeriesInsights/environments/eventsources/read | Get the properties of an event source. |
> | Action | Microsoft.TimeSeriesInsights/environments/eventsources/write | Creates a new event source for an environment, or updates an existing event source. |
> | Action | Microsoft.TimeSeriesInsights/environments/read | Get the properties of an environment. |
> | Action | Microsoft.TimeSeriesInsights/environments/referencedatasets/delete | Deletes the reference data set. |
> | Action | Microsoft.TimeSeriesInsights/environments/referencedatasets/read | Get the properties of a reference data set. |
> | Action | Microsoft.TimeSeriesInsights/environments/referencedatasets/write | Creates a new reference data set for an environment, or updates an existing reference data set. |
> | Action | Microsoft.TimeSeriesInsights/environments/status/read | Get the status of the environment, state of its associated operations like ingress. |
> | Action | Microsoft.TimeSeriesInsights/environments/write | Creates a new environment, or updates an existing environment. |
> | Action | Microsoft.TimeSeriesInsights/register/action | Registers the subscription for the Time Series Insights resource provider and enables the creation of Time Series Insights environments. |

## Microsoft.VisualStudio

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.VisualStudio/Account/Delete | Delete Account |
> | Action | Microsoft.VisualStudio/Account/Extension/Read | Read Account/Extension |
> | Action | Microsoft.VisualStudio/Account/Project/Read | Read Account/Project |
> | Action | Microsoft.VisualStudio/Account/Project/Write | Set Account/Project |
> | Action | Microsoft.VisualStudio/Account/Read | Read Account |
> | Action | Microsoft.VisualStudio/Account/Write | Set Account |
> | Action | Microsoft.VisualStudio/Extension/Delete | Delete Extension |
> | Action | Microsoft.VisualStudio/Extension/Read | Read Extension |
> | Action | Microsoft.VisualStudio/Extension/Write | Set Extension |
> | Action | Microsoft.VisualStudio/Project/Delete | Delete Project |
> | Action | Microsoft.VisualStudio/Project/Read | Read Project |
> | Action | Microsoft.VisualStudio/Project/Write | Set Project |
> | Action | Microsoft.VisualStudio/Register/Action | Register Azure Subscription with Microsoft.VisualStudio provider |

## microsoft.web

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | microsoft.web/apimanagementaccounts/apiacls/read | Get Api Management Accounts Apiacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/apiacls/delete | Delete Api Management Accounts APIs Apiacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/apiacls/read | Get Api Management Accounts APIs Apiacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/apiacls/write | Update Api Management Accounts APIs Apiacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/connectionacls/read | Get Api Management Accounts APIs Connectionacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/confirmconsentcode/action | Confirm Consent Code Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/delete | Delete Api Management Accounts APIs Connections Connectionacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/read | Get Api Management Accounts APIs Connections Connectionacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/write | Update Api Management Accounts APIs Connections Connectionacls. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/delete | Delete Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/getconsentlinks/action | Get Consent Links for Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/listconnectionkeys/action | List Connection Keys Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/listsecrets/action | List Secrets Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/read | Get Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/connections/write | Update Api Management Accounts APIs Connections. |
> | Action | microsoft.web/apimanagementaccounts/apis/delete | Delete Api Management Accounts APIs. |
> | Action | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/delete | Delete Api Management Accounts APIs Localized Definitions. |
> | Action | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/read | Get Api Management Accounts APIs Localized Definitions. |
> | Action | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/write | Update Api Management Accounts APIs Localized Definitions. |
> | Action | microsoft.web/apimanagementaccounts/apis/read | Get Api Management Accounts APIs. |
> | Action | microsoft.web/apimanagementaccounts/apis/write | Update Api Management Accounts APIs. |
> | Action | microsoft.web/apimanagementaccounts/connectionacls/read | Get Api Management Accounts Connectionacls. |
> | Action | microsoft.web/availablestacks/read | Get Available Stacks. |
> | Action | Microsoft.Web/certificates/Delete | Delete an existing certificate. |
> | Action | Microsoft.Web/certificates/Read | Get the list of certificates. |
> | Action | Microsoft.Web/certificates/Write | Add a new certificate or update an existing one. |
> | Action | microsoft.web/checknameavailability/read | Check if resource name is available. |
> | Action | microsoft.web/classicmobileservices/read | Get Classic Mobile Services. |
> | Action | Microsoft.Web/connectionGateways/Delete | Deletes a Connection Gateway. |
> | Action | Microsoft.Web/connectionGateways/Join/Action | Joins a Connection Gateway. |
> | Action | Microsoft.Web/connectionGateways/ListStatus/Action | Lists status of a Connection Gateway. |
> | Action | Microsoft.Web/connectionGateways/Move/Action | Moves a Connection Gateway. |
> | Action | Microsoft.Web/connectionGateways/Read | Get the list of Connection Gateways. |
> | Action | Microsoft.Web/connectionGateways/Write | Creates or updates a Connection Gateway. |
> | Action | microsoft.web/connections/confirmconsentcode/action | Confirm Connections Consent Code. |
> | Action | Microsoft.Web/connections/Delete | Deletes a Connection. |
> | Action | Microsoft.Web/connections/Join/Action | Joins a Connection. |
> | Action | microsoft.web/connections/listconsentlinks/action | List Consent Links for Connections. |
> | Action | Microsoft.Web/connections/Move/Action | Moves a Connection. |
> | Action | Microsoft.Web/connections/Read | Get the list of Connections. |
> | Action | Microsoft.Web/connections/Write | Creates or updates a Connection. |
> | Action | Microsoft.Web/customApis/Delete | Deletes a Custom API. |
> | Action | Microsoft.Web/customApis/extractApiDefinitionFromWsdl/Action | Extracts API definition from a WSDL. |
> | Action | Microsoft.Web/customApis/Join/Action | Joins a Custom API. |
> | Action | Microsoft.Web/customApis/listWsdlInterfaces/Action | Lists WSDL interfaces for a Custom API. |
> | Action | Microsoft.Web/customApis/Move/Action | Moves a Custom API. |
> | Action | Microsoft.Web/customApis/Read | Get the list of Custom API. |
> | Action | Microsoft.Web/customApis/Write | Creates or updates a Custom API. |
> | Action | Microsoft.Web/deletedSites/Read | Get the properties of a Deleted Web App |
> | Action | microsoft.web/deploymentlocations/read | Get Deployment Locations. |
> | Action | Microsoft.Web/geoRegions/Read | Get the list of Geo regions. |
> | Action | microsoft.web/hostingenvironments/capacities/read | Get Hosting Environments Capacities. |
> | Action | Microsoft.Web/hostingEnvironments/Delete | Delete an App Service Environment |
> | Action | microsoft.web/hostingenvironments/detectors/read | Get Hosting Environments Detectors. |
> | Action | microsoft.web/hostingenvironments/diagnostics/read | Get Hosting Environments Diagnostics. |
> | Action | microsoft.web/hostingenvironments/inboundnetworkdependenciesendpoints/read | Get the network endpoints of all inbound dependencies. |
> | Action | Microsoft.Web/hostingEnvironments/Join/Action | Joins an App Service Environment |
> | Action | microsoft.web/hostingenvironments/metricdefinitions/read | Get Hosting Environments Metric Definitions. |
> | Action | microsoft.web/hostingenvironments/multirolepools/metricdefinitions/read | Get Hosting Environments MultiRole Pools Metric Definitions. |
> | Action | microsoft.web/hostingenvironments/multirolepools/metrics/read | Get Hosting Environments MultiRole Pools Metrics. |
> | Action | Microsoft.Web/hostingEnvironments/multiRolePools/Read | Get the properties of a FrontEnd Pool in an App Service Environment |
> | Action | microsoft.web/hostingenvironments/multirolepools/skus/read | Get Hosting Environments MultiRole Pools SKUs. |
> | Action | microsoft.web/hostingenvironments/multirolepools/usages/read | Get Hosting Environments MultiRole Pools Usages. |
> | Action | Microsoft.Web/hostingEnvironments/multiRolePools/Write | Create a new FrontEnd Pool in an App Service Environment or update an existing one |
> | Action | microsoft.web/hostingenvironments/operations/read | Get Hosting Environments Operations. |
> | Action | microsoft.web/hostingenvironments/outboundnetworkdependenciesendpoints/read | Get the network endpoints of all outbound dependencies. |
> | Action | Microsoft.Web/hostingEnvironments/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Action | Microsoft.Web/hostingEnvironments/Read | Get the properties of an App Service Environment |
> | Action | Microsoft.Web/hostingEnvironments/reboot/Action | Reboot all machines in an App Service Environment |
> | Action | microsoft.web/hostingenvironments/resume/action | Resume Hosting Environments. |
> | Action | microsoft.web/hostingenvironments/serverfarms/read | Get Hosting Environments App Service Plans. |
> | Action | microsoft.web/hostingenvironments/sites/read | Get Hosting Environments Web Apps. |
> | Action | microsoft.web/hostingenvironments/suspend/action | Suspend Hosting Environments. |
> | Action | microsoft.web/hostingenvironments/usages/read | Get Hosting Environments Usages. |
> | Action | microsoft.web/hostingenvironments/workerpools/metricdefinitions/read | Get Hosting Environments Workerpools Metric Definitions. |
> | Action | microsoft.web/hostingenvironments/workerpools/metrics/read | Get Hosting Environments Workerpools Metrics. |
> | Action | Microsoft.Web/hostingEnvironments/workerPools/Read | Get the properties of a Worker Pool in an App Service Environment |
> | Action | microsoft.web/hostingenvironments/workerpools/skus/read | Get Hosting Environments Workerpools SKUs. |
> | Action | microsoft.web/hostingenvironments/workerpools/usages/read | Get Hosting Environments Workerpools Usages. |
> | Action | Microsoft.Web/hostingEnvironments/workerPools/Write | Create a new Worker Pool in an App Service Environment or update an existing one |
> | Action | Microsoft.Web/hostingEnvironments/Write | Create a new App Service Environment or update existing one |
> | Action | microsoft.web/ishostingenvironmentnameavailable/read | Get if Hosting Environment Name is available. |
> | Action | microsoft.web/ishostnameavailable/read | Check if Hostname is Available. |
> | Action | microsoft.web/isusernameavailable/read | Check if Username is available. |
> | Action | Microsoft.Web/listSitesAssignedToHostName/Read | Get names of sites assigned to hostname. |
> | Action | microsoft.web/locations/apioperations/read | Get Locations API Operations. |
> | Action | microsoft.web/locations/connectiongatewayinstallations/read | Get Locations Connection Gateway Installations. |
> | Action | microsoft.web/locations/deleteVirtualNetworkOrSubnets/action | Vnet or subnet deletion notification for Locations. |
> | Action | microsoft.web/locations/extractapidefinitionfromwsdl/action | Extract Api Definition from WSDL for Locations. |
> | Action | microsoft.web/locations/listwsdlinterfaces/action | List WSDL Interfaces for Locations. |
> | Action | microsoft.web/locations/managedapis/apioperations/read | Get Locations Managed API Operations. |
> | Action | Microsoft.Web/locations/managedapis/Join/Action | Joins a Managed API. |
> | Action | microsoft.web/locations/managedapis/read | Get Locations Managed APIs. |
> | Action | microsoft.web/locations/operationResults/read | Get Operations. |
> | Action | microsoft.web/locations/operations/read | Get Operations. |
> | Action | microsoft.web/operations/read | Get Operations. |
> | Action | microsoft.web/publishingusers/read | Get Publishing Users. |
> | Action | microsoft.web/publishingusers/write | Update Publishing Users. |
> | Action | Microsoft.Web/recommendations/Read | Get the list of recommendations for subscriptions. |
> | Action | microsoft.web/register/action | Register Microsoft.Web resource provider for the subscription. |
> | Action | microsoft.web/resourcehealthmetadata/read | Get Resource Health Metadata. |
> | Action | microsoft.web/serverfarms/capabilities/read | Get App Service Plans Capabilities. |
> | Action | Microsoft.Web/serverfarms/Delete | Delete an existing App Service Plan |
> | Action | Microsoft.Web/serverfarms/eventGridFilters/delete | Delete Event Grid Filter on server farm. |
> | Action | Microsoft.Web/serverfarms/eventGridFilters/read | Get Event Grid Filter on server farm. |
> | Action | Microsoft.Web/serverfarms/eventGridFilters/write | Put Event Grid Filter on server farm. |
> | Action | microsoft.web/serverfarms/firstpartyapps/settings/delete | Delete App Service Plans First Party Apps Settings. |
> | Action | microsoft.web/serverfarms/firstpartyapps/settings/read | Get App Service Plans First Party Apps Settings. |
> | Action | microsoft.web/serverfarms/firstpartyapps/settings/write | Update App Service Plans First Party Apps Settings. |
> | Action | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/delete | Delete App Service Plans Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/read | Get App Service Plans Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/sites/read | Get App Service Plans Hybrid Connection Namespaces Relays Web Apps. |
> | Action | microsoft.web/serverfarms/hybridconnectionplanlimits/read | Get App Service Plans Hybrid Connection Plan Limits. |
> | Action | microsoft.web/serverfarms/hybridconnectionrelays/read | Get App Service Plans Hybrid Connection Relays. |
> | Action | microsoft.web/serverfarms/metricdefinitions/read | Get App Service Plans Metric Definitions. |
> | Action | microsoft.web/serverfarms/metrics/read | Get App Service Plans Metrics. |
> | Action | microsoft.web/serverfarms/operationresults/read | Get App Service Plans Operation Results. |
> | Action | Microsoft.Web/serverfarms/Read | Get the properties on an App Service Plan |
> | Action | Microsoft.Web/serverfarms/restartSites/Action | Restart all Web Apps in an App Service Plan |
> | Action | microsoft.web/serverfarms/sites/read | Get App Service Plans Web Apps. |
> | Action | microsoft.web/serverfarms/skus/read | Get App Service Plans SKUs. |
> | Action | microsoft.web/serverfarms/usages/read | Get App Service Plans Usages. |
> | Action | microsoft.web/serverfarms/virtualnetworkconnections/gateways/write | Update App Service Plans Virtual Network Connections Gateways. |
> | Action | microsoft.web/serverfarms/virtualnetworkconnections/read | Get App Service Plans Virtual Network Connections. |
> | Action | microsoft.web/serverfarms/virtualnetworkconnections/routes/delete | Delete App Service Plans Virtual Network Connections Routes. |
> | Action | microsoft.web/serverfarms/virtualnetworkconnections/routes/read | Get App Service Plans Virtual Network Connections Routes. |
> | Action | microsoft.web/serverfarms/virtualnetworkconnections/routes/write | Update App Service Plans Virtual Network Connections Routes. |
> | Action | microsoft.web/serverfarms/workers/reboot/action | Reboot App Service Plans Workers. |
> | Action | Microsoft.Web/serverfarms/Write | Create a new App Service Plan or update an existing one |
> | Action | microsoft.web/sites/analyzecustomhostname/read | Analyze Custom Hostname. |
> | Action | Microsoft.Web/sites/applySlotConfig/Action | Apply web app slot configuration from target slot to the current web app |
> | Action | Microsoft.Web/sites/backup/Action | Create a new web app backup |
> | Action | microsoft.web/sites/backup/read | Get Web Apps Backup. |
> | Action | microsoft.web/sites/backup/write | Update Web Apps Backup. |
> | Action | microsoft.web/sites/backups/action | Discovers an existing app backup that can be restored from a blob in Azure storage. |
> | Action | microsoft.web/sites/backups/delete | Delete Web Apps Backups. |
> | Action | microsoft.web/sites/backups/list/action | List Web Apps Backups. |
> | Action | Microsoft.Web/sites/backups/Read | Get the properties of a web app's backup |
> | Action | microsoft.web/sites/backups/restore/action | Restore Web Apps Backups. |
> | Action | microsoft.web/sites/backups/write | Update Web Apps Backups. |
> | Action | microsoft.web/sites/config/delete | Delete Web Apps Config. |
> | Action | Microsoft.Web/sites/config/list/Action | List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Action | Microsoft.Web/sites/config/Read | Get Web App configuration settings |
> | Action | microsoft.web/sites/config/snapshots/read | Get Web Apps Config Snapshots. |
> | Action | Microsoft.Web/sites/config/Write | Update Web App's configuration settings |
> | Action | microsoft.web/sites/containerlogs/action | Get Zipped Container Logs for Web App. |
> | Action | microsoft.web/sites/containerlogs/download/action | Download Web Apps Container Logs. |
> | Action | microsoft.web/sites/continuouswebjobs/delete | Delete Web Apps Continuous Web Jobs. |
> | Action | microsoft.web/sites/continuouswebjobs/read | Get Web Apps Continuous Web Jobs. |
> | Action | microsoft.web/sites/continuouswebjobs/start/action | Start Web Apps Continuous Web Jobs. |
> | Action | microsoft.web/sites/continuouswebjobs/stop/action | Stop Web Apps Continuous Web Jobs. |
> | Action | Microsoft.Web/sites/Delete | Delete an existing Web App |
> | Action | microsoft.web/sites/deployments/delete | Delete Web Apps Deployments. |
> | Action | microsoft.web/sites/deployments/log/read | Get Web Apps Deployments Log. |
> | Action | microsoft.web/sites/deployments/read | Get Web Apps Deployments. |
> | Action | microsoft.web/sites/deployments/write | Update Web Apps Deployments. |
> | Action | microsoft.web/sites/detectors/read | Get Web Apps Detectors. |
> | Action | microsoft.web/sites/diagnostics/analyses/execute/Action | Run Web Apps Diagnostics Analysis. |
> | Action | microsoft.web/sites/diagnostics/analyses/read | Get Web Apps Diagnostics Analysis. |
> | Action | microsoft.web/sites/diagnostics/aspnetcore/read | Get Web Apps Diagnostics for ASP.NET Core app. |
> | Action | microsoft.web/sites/diagnostics/autoheal/read | Get Web Apps Diagnostics Autoheal. |
> | Action | microsoft.web/sites/diagnostics/deployment/read | Get Web Apps Diagnostics Deployment. |
> | Action | microsoft.web/sites/diagnostics/deployments/read | Get Web Apps Diagnostics Deployments. |
> | Action | microsoft.web/sites/diagnostics/detectors/execute/Action | Run Web Apps Diagnostics Detector. |
> | Action | microsoft.web/sites/diagnostics/detectors/read | Get Web Apps Diagnostics Detector. |
> | Action | microsoft.web/sites/diagnostics/failedrequestsperuri/read | Get Web Apps Diagnostics Failed Requests Per Uri. |
> | Action | microsoft.web/sites/diagnostics/frebanalysis/read | Get Web Apps Diagnostics FREB Analysis. |
> | Action | microsoft.web/sites/diagnostics/loganalyzer/read | Get Web Apps Diagnostics Log Analyzer. |
> | Action | microsoft.web/sites/diagnostics/read | Get Web Apps Diagnostics Categories. |
> | Action | microsoft.web/sites/diagnostics/runtimeavailability/read | Get Web Apps Diagnostics Runtime Availability. |
> | Action | microsoft.web/sites/diagnostics/servicehealth/read | Get Web Apps Diagnostics Service Health. |
> | Action | microsoft.web/sites/diagnostics/sitecpuanalysis/read | Get Web Apps Diagnostics Site CPU Analysis. |
> | Action | microsoft.web/sites/diagnostics/sitecrashes/read | Get Web Apps Diagnostics Site Crashes. |
> | Action | microsoft.web/sites/diagnostics/sitelatency/read | Get Web Apps Diagnostics Site Latency. |
> | Action | microsoft.web/sites/diagnostics/sitememoryanalysis/read | Get Web Apps Diagnostics Site Memory Analysis. |
> | Action | microsoft.web/sites/diagnostics/siterestartsettingupdate/read | Get Web Apps Diagnostics Site Restart Setting Update. |
> | Action | microsoft.web/sites/diagnostics/siterestartuserinitiated/read | Get Web Apps Diagnostics Site Restart User Initiated. |
> | Action | microsoft.web/sites/diagnostics/siteswap/read | Get Web Apps Diagnostics Site Swap. |
> | Action | microsoft.web/sites/diagnostics/threadcount/read | Get Web Apps Diagnostics Thread Count. |
> | Action | microsoft.web/sites/diagnostics/workeravailability/read | Get Web Apps Diagnostics Workeravailability. |
> | Action | microsoft.web/sites/diagnostics/workerprocessrecycle/read | Get Web Apps Diagnostics Worker Process Recycle. |
> | Action | microsoft.web/sites/domainownershipidentifiers/read | Get Web Apps Domain Ownership Identifiers. |
> | Action | microsoft.web/sites/domainownershipidentifiers/write | Update Web Apps Domain Ownership Identifiers. |
> | Action | Microsoft.Web/sites/eventGridFilters/delete | Delete Event Grid Filter on web app. |
> | Action | Microsoft.Web/sites/eventGridFilters/read | Get Event Grid Filter on web app. |
> | Action | Microsoft.Web/sites/eventGridFilters/write | Put Event Grid Filter on web app. |
> | Action | microsoft.web/sites/extensions/delete | Delete Web Apps Site Extensions. |
> | Action | microsoft.web/sites/extensions/read | Get Web Apps Site Extensions. |
> | Action | microsoft.web/sites/extensions/write | Update Web Apps Site Extensions. |
> | Action | microsoft.web/sites/functions/action | Functions Web Apps. |
> | Action | microsoft.web/sites/functions/delete | Delete Web Apps Functions. |
> | Action | microsoft.web/sites/functions/keys/delete | Delete Function keys. |
> | Action | microsoft.web/sites/functions/keys/write | Update Function keys. |
> | Action | microsoft.web/sites/functions/listkeys/action | List Function keys. |
> | Action | microsoft.web/sites/functions/listsecrets/action | List Function secrets. |
> | Action | microsoft.web/sites/functions/masterkey/read | Get Web Apps Functions Masterkey. |
> | Action | microsoft.web/sites/functions/properties/read | Read Web Apps Functions Properties. |
> | Action | microsoft.web/sites/functions/properties/write | Update Web Apps Functions Properties. |
> | Action | microsoft.web/sites/functions/read | Get Web Apps Functions. |
> | Action | microsoft.web/sites/functions/token/read | Get Web Apps Functions Token. |
> | Action | microsoft.web/sites/functions/write | Update Web Apps Functions. |
> | Action | microsoft.web/sites/host/functionkeys/delete | Delete Functions Host Function keys. |
> | Action | microsoft.web/sites/host/functionkeys/write | Update Functions Host Function keys. |
> | Action | microsoft.web/sites/host/listkeys/action | List Functions Host keys. |
> | Action | microsoft.web/sites/host/listsyncstatus/action | List Sync Function Triggers Status. |
> | Action | microsoft.web/sites/host/properties/read | Read Web Apps Functions Host Properties. |
> | Action | microsoft.web/sites/host/sync/action | Sync Function Triggers. |
> | Action | microsoft.web/sites/host/systemkeys/delete | Delete Functions Host System keys. |
> | Action | microsoft.web/sites/host/systemkeys/write | Update Functions Host System keys. |
> | Action | microsoft.web/sites/hostnamebindings/delete | Delete Web Apps Hostname Bindings. |
> | Action | microsoft.web/sites/hostnamebindings/read | Get Web Apps Hostname Bindings. |
> | Action | microsoft.web/sites/hostnamebindings/write | Update Web Apps Hostname Bindings. |
> | Action | microsoft.web/sites/hostruntime/functions/keys/read | Get Web Apps Hostruntime Functions Keys. |
> | Action | Microsoft.Web/sites/hostruntime/host/_master/read | Get Function App's master key for admin operations |
> | Action | Microsoft.Web/sites/hostruntime/host/action | Perform Function App runtime action like sync triggers, add functions, invoke functions, delete functions etc. |
> | Action | microsoft.web/sites/hostruntime/host/read | Get Web Apps Hostruntime Host. |
> | Action | microsoft.web/sites/hybridconnection/delete | Delete Web Apps Hybrid Connection. |
> | Action | microsoft.web/sites/hybridconnection/read | Get Web Apps Hybrid Connection. |
> | Action | microsoft.web/sites/hybridconnection/write | Update Web Apps Hybrid Connection. |
> | Action | microsoft.web/sites/hybridconnectionnamespaces/relays/delete | Delete Web Apps Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/hybridconnectionnamespaces/relays/listkeys/action | List Keys Web Apps Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/hybridconnectionnamespaces/relays/read | Get Web Apps Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/hybridconnectionnamespaces/relays/write | Update Web Apps Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/hybridconnectionrelays/read | Get Web Apps Hybrid Connection Relays. |
> | Action | microsoft.web/sites/instances/deployments/delete | Delete Web Apps Instances Deployments. |
> | Action | microsoft.web/sites/instances/deployments/read | Get Web Apps Instances Deployments. |
> | Action | microsoft.web/sites/instances/extensions/log/read | Get Web Apps Instances Extensions Log. |
> | Action | microsoft.web/sites/instances/extensions/processes/read | Get Web Apps Instances Extensions Processes. |
> | Action | microsoft.web/sites/instances/extensions/read | Get Web Apps Instances Extensions. |
> | Action | microsoft.web/sites/instances/processes/delete | Delete Web Apps Instances Processes. |
> | Action | microsoft.web/sites/instances/processes/modules/read | Get Web Apps Instances Processes Modules. |
> | Action | microsoft.web/sites/instances/processes/read | Get Web Apps Instances Processes. |
> | Action | microsoft.web/sites/instances/processes/threads/read | Get Web Apps Instances Processes Threads. |
> | Action | microsoft.web/sites/instances/read | Get Web Apps Instances. |
> | Action | microsoft.web/sites/listsyncfunctiontriggerstatus/action | List Sync Function Trigger Status. |
> | Action | microsoft.web/sites/metricdefinitions/read | Get Web Apps Metric Definitions. |
> | Action | microsoft.web/sites/metrics/read | Get Web Apps Metrics. |
> | Action | microsoft.web/sites/metricsdefinitions/read | Get Web Apps Metrics Definitions. |
> | Action | microsoft.web/sites/migratemysql/action | Migrate MySql Web Apps. |
> | Action | microsoft.web/sites/migratemysql/read | Get Web Apps Migrate MySql. |
> | Action | microsoft.web/sites/networktrace/action | Network Trace Web Apps. |
> | Action | microsoft.web/sites/networktraces/operationresults/read | Get Web Apps Network Trace Operation Results. |
> | Action | microsoft.web/sites/newpassword/action | Newpassword Web Apps. |
> | Action | microsoft.web/sites/operationresults/read | Get Web Apps Operation Results. |
> | Action | microsoft.web/sites/operations/read | Get Web Apps Operations. |
> | Action | microsoft.web/sites/perfcounters/read | Get Web Apps Performance Counters. |
> | Action | microsoft.web/sites/premieraddons/delete | Delete Web Apps Premier Addons. |
> | Action | microsoft.web/sites/premieraddons/read | Get Web Apps Premier Addons. |
> | Action | microsoft.web/sites/premieraddons/write | Update Web Apps Premier Addons. |
> | Action | microsoft.web/sites/privateaccess/read | Get data around private site access enablement and authorized Virtual Networks that can access the site. |
> | Action | Microsoft.Web/sites/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Action | microsoft.web/sites/processes/modules/read | Get Web Apps Processes Modules. |
> | Action | microsoft.web/sites/processes/read | Get Web Apps Processes. |
> | Action | microsoft.web/sites/processes/threads/read | Get Web Apps Processes Threads. |
> | Action | microsoft.web/sites/publiccertificates/delete | Delete Web Apps Public Certificates. |
> | Action | microsoft.web/sites/publiccertificates/read | Get Web Apps Public Certificates. |
> | Action | microsoft.web/sites/publiccertificates/write | Update Web Apps Public Certificates. |
> | Action | Microsoft.Web/sites/publish/Action | Publish a Web App |
> | Action | Microsoft.Web/sites/publishxml/Action | Get publishing profile xml for a Web App |
> | Action | microsoft.web/sites/publishxml/read | Get Web Apps Publishing XML. |
> | Action | Microsoft.Web/sites/Read | Get the properties of a Web App |
> | Action | microsoft.web/sites/recommendationhistory/read | Get Web Apps Recommendation History. |
> | Action | microsoft.web/sites/recommendations/disable/action | Disable Web Apps Recommendations. |
> | Action | Microsoft.Web/sites/recommendations/Read | Get the list of recommendations for web app. |
> | Action | microsoft.web/sites/recover/action | Recover Web Apps. |
> | Action | Microsoft.Web/sites/resetSlotConfig/Action | Reset web app configuration |
> | Action | microsoft.web/sites/resourcehealthmetadata/read | Get Web Apps Resource Health Metadata. |
> | Action | Microsoft.Web/sites/restart/Action | Restart a Web App |
> | Action | microsoft.web/sites/restore/read | Get Web Apps Restore. |
> | Action | microsoft.web/sites/restore/write | Restore Web Apps. |
> | Action | microsoft.web/sites/restorefrombackupblob/action | Restore Web App From Backup Blob. |
> | Action | microsoft.web/sites/restorefromdeletedapp/action | Restore Web Apps From Deleted App. |
> | Action | microsoft.web/sites/restoresnapshot/action | Restore Web Apps Snapshots. |
> | Action | microsoft.web/sites/siteextensions/delete | Delete Web Apps Site Extensions. |
> | Action | microsoft.web/sites/siteextensions/read | Get Web Apps Site Extensions. |
> | Action | microsoft.web/sites/siteextensions/write | Update Web Apps Site Extensions. |
> | Action | microsoft.web/sites/slots/analyzecustomhostname/read | Get Web Apps Slots Analyze Custom Hostname. |
> | Action | Microsoft.Web/sites/slots/applySlotConfig/Action | Apply web app slot configuration from target slot to the current slot. |
> | Action | Microsoft.Web/sites/slots/backup/Action | Create new Web App Slot backup. |
> | Action | microsoft.web/sites/slots/backup/read | Get Web Apps Slots Backup. |
> | Action | microsoft.web/sites/slots/backup/write | Update Web Apps Slots Backup. |
> | Action | microsoft.web/sites/slots/backups/action | Discover Web Apps Slots Backups. |
> | Action | microsoft.web/sites/slots/backups/delete | Delete Web Apps Slots Backups. |
> | Action | microsoft.web/sites/slots/backups/list/action | List Web Apps Slots Backups. |
> | Action | Microsoft.Web/sites/slots/backups/Read | Get the properties of a web app slots' backup |
> | Action | microsoft.web/sites/slots/backups/restore/action | Restore Web Apps Slots Backups. |
> | Action | microsoft.web/sites/slots/config/delete | Delete Web Apps Slots Config. |
> | Action | Microsoft.Web/sites/slots/config/list/Action | List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Action | Microsoft.Web/sites/slots/config/Read | Get Web App Slot's configuration settings |
> | Action | Microsoft.Web/sites/slots/config/Write | Update Web App Slot's configuration settings |
> | Action | microsoft.web/sites/slots/containerlogs/action | Get Zipped Container Logs for Web App Slot. |
> | Action | microsoft.web/sites/slots/containerlogs/download/action | Download Web Apps Slots Container Logs. |
> | Action | microsoft.web/sites/slots/continuouswebjobs/delete | Delete Web Apps Slots Continuous Web Jobs. |
> | Action | microsoft.web/sites/slots/continuouswebjobs/read | Get Web Apps Slots Continuous Web Jobs. |
> | Action | microsoft.web/sites/slots/continuouswebjobs/start/action | Start Web Apps Slots Continuous Web Jobs. |
> | Action | microsoft.web/sites/slots/continuouswebjobs/stop/action | Stop Web Apps Slots Continuous Web Jobs. |
> | Action | Microsoft.Web/sites/slots/Delete | Delete an existing Web App Slot |
> | Action | microsoft.web/sites/slots/deployments/delete | Delete Web Apps Slots Deployments. |
> | Action | microsoft.web/sites/slots/deployments/log/read | Get Web Apps Slots Deployments Log. |
> | Action | microsoft.web/sites/slots/deployments/read | Get Web Apps Slots Deployments. |
> | Action | microsoft.web/sites/slots/deployments/write | Update Web Apps Slots Deployments. |
> | Action | microsoft.web/sites/slots/detectors/read | Get Web Apps Slots Detectors. |
> | Action | microsoft.web/sites/slots/diagnostics/analyses/execute/Action | Run Web Apps Slots Diagnostics Analysis. |
> | Action | microsoft.web/sites/slots/diagnostics/analyses/read | Get Web Apps Slots Diagnostics Analysis. |
> | Action | microsoft.web/sites/slots/diagnostics/aspnetcore/read | Get Web Apps Slots Diagnostics for ASP.NET Core app. |
> | Action | microsoft.web/sites/slots/diagnostics/autoheal/read | Get Web Apps Slots Diagnostics Autoheal. |
> | Action | microsoft.web/sites/slots/diagnostics/deployment/read | Get Web Apps Slots Diagnostics Deployment. |
> | Action | microsoft.web/sites/slots/diagnostics/deployments/read | Get Web Apps Slots Diagnostics Deployments. |
> | Action | microsoft.web/sites/slots/diagnostics/detectors/execute/Action | Run Web Apps Slots Diagnostics Detector. |
> | Action | microsoft.web/sites/slots/diagnostics/detectors/read | Get Web Apps Slots Diagnostics Detector. |
> | Action | microsoft.web/sites/slots/diagnostics/frebanalysis/read | Get Web Apps Slots Diagnostics FREB Analysis. |
> | Action | microsoft.web/sites/slots/diagnostics/loganalyzer/read | Get Web Apps Slots Diagnostics Log Analyzer. |
> | Action | microsoft.web/sites/slots/diagnostics/read | Get Web Apps Slots Diagnostics. |
> | Action | microsoft.web/sites/slots/diagnostics/runtimeavailability/read | Get Web Apps Slots Diagnostics Runtime Availability. |
> | Action | microsoft.web/sites/slots/diagnostics/servicehealth/read | Get Web Apps Slots Diagnostics Service Health. |
> | Action | microsoft.web/sites/slots/diagnostics/sitecpuanalysis/read | Get Web Apps Slots Diagnostics Site CPU Analysis. |
> | Action | microsoft.web/sites/slots/diagnostics/sitecrashes/read | Get Web Apps Slots Diagnostics Site Crashes. |
> | Action | microsoft.web/sites/slots/diagnostics/sitelatency/read | Get Web Apps Slots Diagnostics Site Latency. |
> | Action | microsoft.web/sites/slots/diagnostics/sitememoryanalysis/read | Get Web Apps Slots Diagnostics Site Memory Analysis. |
> | Action | microsoft.web/sites/slots/diagnostics/siterestartsettingupdate/read | Get Web Apps Slots Diagnostics Site Restart Setting Update. |
> | Action | microsoft.web/sites/slots/diagnostics/siterestartuserinitiated/read | Get Web Apps Slots Diagnostics Site Restart User Initiated. |
> | Action | microsoft.web/sites/slots/diagnostics/siteswap/read | Get Web Apps Slots Diagnostics Site Swap. |
> | Action | microsoft.web/sites/slots/diagnostics/threadcount/read | Get Web Apps Slots Diagnostics Thread Count. |
> | Action | microsoft.web/sites/slots/diagnostics/workeravailability/read | Get Web Apps Slots Diagnostics Workeravailability. |
> | Action | microsoft.web/sites/slots/diagnostics/workerprocessrecycle/read | Get Web Apps Slots Diagnostics Worker Process Recycle. |
> | Action | microsoft.web/sites/slots/domainownershipidentifiers/read | Get Web Apps Slots Domain Ownership Identifiers. |
> | Action | microsoft.web/sites/slots/functions/listsecrets/action | List Secrets Web Apps Slots Functions. |
> | Action | microsoft.web/sites/slots/functions/read | Get Web Apps Slots Functions. |
> | Action | microsoft.web/sites/slots/hostnamebindings/delete | Delete Web Apps Slots Hostname Bindings. |
> | Action | microsoft.web/sites/slots/hostnamebindings/read | Get Web Apps Slots Hostname Bindings. |
> | Action | microsoft.web/sites/slots/hostnamebindings/write | Update Web Apps Slots Hostname Bindings. |
> | Action | microsoft.web/sites/slots/hybridconnection/delete | Delete Web Apps Slots Hybrid Connection. |
> | Action | microsoft.web/sites/slots/hybridconnection/read | Get Web Apps Slots Hybrid Connection. |
> | Action | microsoft.web/sites/slots/hybridconnection/write | Update Web Apps Slots Hybrid Connection. |
> | Action | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/delete | Delete Web Apps Slots Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/write | Update Web Apps Slots Hybrid Connection Namespaces Relays. |
> | Action | microsoft.web/sites/slots/hybridconnectionrelays/read | Get Web Apps Slots Hybrid Connection Relays. |
> | Action | microsoft.web/sites/slots/instances/deployments/read | Get Web Apps Slots Instances Deployments. |
> | Action | microsoft.web/sites/slots/instances/processes/delete | Delete Web Apps Slots Instances Processes. |
> | Action | microsoft.web/sites/slots/instances/processes/read | Get Web Apps Slots Instances Processes. |
> | Action | microsoft.web/sites/slots/instances/read | Get Web Apps Slots Instances. |
> | Action | microsoft.web/sites/slots/metricdefinitions/read | Get Web Apps Slots Metric Definitions. |
> | Action | microsoft.web/sites/slots/metrics/read | Get Web Apps Slots Metrics. |
> | Action | microsoft.web/sites/slots/migratemysql/read | Get Web Apps Slots Migrate MySql. |
> | Action | microsoft.web/sites/slots/networktrace/action | Network Trace Web Apps Slots. |
> | Action | microsoft.web/sites/slots/networktraces/operationresults/read | Get Web Apps Slots Network Trace Operation Results. |
> | Action | microsoft.web/sites/slots/newpassword/action | Newpassword Web Apps Slots. |
> | Action | microsoft.web/sites/slots/operationresults/read | Get Web Apps Slots Operation Results. |
> | Action | microsoft.web/sites/slots/operations/read | Get Web Apps Slots Operations. |
> | Action | microsoft.web/sites/slots/perfcounters/read | Get Web Apps Slots Performance Counters. |
> | Action | microsoft.web/sites/slots/phplogging/read | Get Web Apps Slots Phplogging. |
> | Action | microsoft.web/sites/slots/premieraddons/delete | Delete Web Apps Slots Premier Addons. |
> | Action | microsoft.web/sites/slots/premieraddons/read | Get Web Apps Slots Premier Addons. |
> | Action | microsoft.web/sites/slots/premieraddons/write | Update Web Apps Slots Premier Addons. |
> | Action | microsoft.web/sites/slots/processes/read | Get Web Apps Slots Processes. |
> | Action | microsoft.web/sites/slots/publiccertificates/delete | Delete Web Apps Slots Public Certificates. |
> | Action | microsoft.web/sites/slots/publiccertificates/read | Get Web Apps Slots Public Certificates. |
> | Action | microsoft.web/sites/slots/publiccertificates/write | Create or Update Web Apps Slots Public Certificates. |
> | Action | Microsoft.Web/sites/slots/publish/Action | Publish a Web App Slot |
> | Action | Microsoft.Web/sites/slots/publishxml/Action | Get publishing profile xml for Web App Slot |
> | Action | Microsoft.Web/sites/slots/Read | Get the properties of a Web App deployment slot |
> | Action | microsoft.web/sites/slots/recover/action | Recover Web Apps Slots. |
> | Action | Microsoft.Web/sites/slots/resetSlotConfig/Action | Reset web app slot configuration |
> | Action | microsoft.web/sites/slots/resourcehealthmetadata/read | Get Web Apps Slots Resource Health Metadata. |
> | Action | Microsoft.Web/sites/slots/restart/Action | Restart a Web App Slot |
> | Action | microsoft.web/sites/slots/restore/read | Get Web Apps Slots Restore. |
> | Action | microsoft.web/sites/slots/restore/write | Restore Web Apps Slots. |
> | Action | microsoft.web/sites/slots/restorefrombackupblob/action | Restore Web Apps Slot From Backup Blob. |
> | Action | microsoft.web/sites/slots/restorefromdeletedapp/action | Restore Web App Slots From Deleted App. |
> | Action | microsoft.web/sites/slots/restoresnapshot/action | Restore Web Apps Slots Snapshots. |
> | Action | microsoft.web/sites/slots/siteextensions/delete | Delete Web Apps Slots Site Extensions. |
> | Action | microsoft.web/sites/slots/siteextensions/read | Get Web Apps Slots Site Extensions. |
> | Action | microsoft.web/sites/slots/siteextensions/write | Update Web Apps Slots Site Extensions. |
> | Action | Microsoft.Web/sites/slots/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Action | Microsoft.Web/sites/slots/slotsswap/Action | Swap Web App deployment slots |
> | Action | microsoft.web/sites/slots/snapshots/read | Get Web Apps Slots Snapshots. |
> | Action | Microsoft.Web/sites/slots/sourcecontrols/Delete | Delete Web App Slot's source control configuration settings |
> | Action | Microsoft.Web/sites/slots/sourcecontrols/Read | Get Web App Slot's source control configuration settings |
> | Action | Microsoft.Web/sites/slots/sourcecontrols/Write | Update Web App Slot's source control configuration settings |
> | Action | Microsoft.Web/sites/slots/start/Action | Start a Web App Slot |
> | Action | Microsoft.Web/sites/slots/stop/Action | Stop a Web App Slot |
> | Action | microsoft.web/sites/slots/sync/action | Sync Web Apps Slots. |
> | Action | microsoft.web/sites/slots/triggeredwebjobs/delete | Delete Web Apps Slots Triggered WebJobs. |
> | Action | microsoft.web/sites/slots/triggeredwebjobs/read | Get Web Apps Slots Triggered WebJobs. |
> | Action | microsoft.web/sites/slots/triggeredwebjobs/run/action | Run Web Apps Slots Triggered WebJobs. |
> | Action | microsoft.web/sites/slots/usages/read | Get Web Apps Slots Usages. |
> | Action | microsoft.web/sites/slots/virtualnetworkconnections/delete | Delete Web Apps Slots Virtual Network Connections. |
> | Action | microsoft.web/sites/slots/virtualnetworkconnections/gateways/write | Update Web Apps Slots Virtual Network Connections Gateways. |
> | Action | microsoft.web/sites/slots/virtualnetworkconnections/read | Get Web Apps Slots Virtual Network Connections. |
> | Action | microsoft.web/sites/slots/virtualnetworkconnections/write | Update Web Apps Slots Virtual Network Connections. |
> | Action | microsoft.web/sites/slots/webjobs/read | Get Web Apps Slots WebJobs. |
> | Action | Microsoft.Web/sites/slots/Write | Create a new Web App Slot or update an existing one |
> | Action | Microsoft.Web/sites/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Action | Microsoft.Web/sites/slotsswap/Action | Swap Web App deployment slots |
> | Action | microsoft.web/sites/snapshots/read | Get Web Apps Snapshots. |
> | Action | Microsoft.Web/sites/sourcecontrols/Delete | Delete Web App's source control configuration settings |
> | Action | Microsoft.Web/sites/sourcecontrols/Read | Get Web App's source control configuration settings |
> | Action | Microsoft.Web/sites/sourcecontrols/Write | Update Web App's source control configuration settings |
> | Action | Microsoft.Web/sites/start/Action | Start a Web App |
> | Action | Microsoft.Web/sites/stop/Action | Stop a Web App |
> | Action | microsoft.web/sites/sync/action | Sync Web Apps. |
> | Action | microsoft.web/sites/syncfunctiontriggers/action | Sync Function Triggers. |
> | Action | microsoft.web/sites/triggeredwebjobs/delete | Delete Web Apps Triggered WebJobs. |
> | Action | microsoft.web/sites/triggeredwebjobs/history/read | Get Web Apps Triggered WebJobs History. |
> | Action | microsoft.web/sites/triggeredwebjobs/read | Get Web Apps Triggered WebJobs. |
> | Action | microsoft.web/sites/triggeredwebjobs/run/action | Run Web Apps Triggered WebJobs. |
> | Action | microsoft.web/sites/usages/read | Get Web Apps Usages. |
> | Action | microsoft.web/sites/virtualnetworkconnections/delete | Delete Web Apps Virtual Network Connections. |
> | Action | microsoft.web/sites/virtualnetworkconnections/gateways/read | Get Web Apps Virtual Network Connections Gateways. |
> | Action | microsoft.web/sites/virtualnetworkconnections/gateways/write | Update Web Apps Virtual Network Connections Gateways. |
> | Action | microsoft.web/sites/virtualnetworkconnections/read | Get Web Apps Virtual Network Connections. |
> | Action | microsoft.web/sites/virtualnetworkconnections/write | Update Web Apps Virtual Network Connections. |
> | Action | microsoft.web/sites/webjobs/read | Get Web Apps WebJobs. |
> | Action | Microsoft.Web/sites/Write | Create a new Web App or update an existing one |
> | Action | microsoft.web/skus/read | Get SKUs. |
> | Action | microsoft.web/sourcecontrols/read | Get Source Controls. |
> | Action | microsoft.web/sourcecontrols/write | Update Source Controls. |
> | Action | microsoft.web/unregister/action | Unregister Microsoft.Web resource provider for the subscription. |
> | Action | microsoft.web/validate/action | Validate . |
> | Action | microsoft.web/verifyhostingenvironmentvnet/action | Verify Hosting Environment Vnet. |

## Microsoft.WorkloadMonitor

> [!div class="mx-tdCol2BreakAll"]
> | Action Type | Operation | Description |
> | --- | --- | --- |
> | Action | Microsoft.WorkloadMonitor/components/read | Gets components for the resource |
> | Action | Microsoft.WorkloadMonitor/componentsSummary/read | Gets summary of components |
> | Action | Microsoft.WorkloadMonitor/monitorInstances/read | Gets instances of monitors for the resource |
> | Action | Microsoft.WorkloadMonitor/monitorInstancesSummary/read | Gets summary of monitor instances |
> | Action | Microsoft.WorkloadMonitor/monitors/read | Gets monitors for the resource |
> | Action | Microsoft.WorkloadMonitor/monitors/write | Configure monitor for the resource |
> | Action | Microsoft.WorkloadMonitor/notificationSettings/read | Gets notification settings for the resource |
> | Action | Microsoft.WorkloadMonitor/notificationSettings/write | Configure notification settings for the resource |
> | Action | Microsoft.WorkloadMonitor/operations/read | Gets the supported operations |

## Next steps

- [Match resource provider to service](../azure-resource-manager/azure-services-resource-providers.md)
- [Custom roles for Azure resources](custom-roles.md)
- [Built-in roles for Azure resources](built-in-roles.md)
