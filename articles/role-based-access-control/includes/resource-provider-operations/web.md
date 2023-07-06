---
title: Web resource provider operations include file
description: Web resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### Microsoft.AppPlatform

Azure service: [Azure Spring Apps](../../../spring-apps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AppPlatform/register/action | Register the subscription to the Microsoft.AppPlatform resource provider |
> | Microsoft.AppPlatform/unregister/action | Unregister the subscription from the Microsoft.AppPlatform resource provider |
> | Microsoft.AppPlatform/locations/checkNameAvailability/action | Check resource name availability |
> | Microsoft.AppPlatform/locations/operationResults/Spring/read | Read resource operation result |
> | Microsoft.AppPlatform/locations/operationStatus/operationId/read | Read resource operation status |
> | Microsoft.AppPlatform/operations/read | List available operations of Microsoft Azure Spring Apps |
> | Microsoft.AppPlatform/runtimeVersions/read | Get runtime versions of Microsoft Azure Spring Apps |
> | Microsoft.AppPlatform/skus/read | List available skus of Microsoft Azure Spring Apps |
> | Microsoft.AppPlatform/Spring/write | Create or Update a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/delete | Delete a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/read | Get Azure Spring Apps service instance(s) |
> | Microsoft.AppPlatform/Spring/listTestKeys/action | List test keys for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/regenerateTestKey/action | Regenerate test key for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/disableTestEndpoint/action | Disable test endpoint functionality for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/enableTestEndpoint/action | Enable test endpoint functionality for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/stop/action | Stop a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/start/action | Start a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configServers/action | Validate the config server settings for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/read | Get the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/write | Create or update the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/delete | Delete the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/validateDomain/action | Validate the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/read | Get the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/write | Create or update the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/delete | Delete the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/read | Get the Application Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/write | Create or update Application Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/delete | Delete Application Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/customizedAccelerators/read | Get the Customized Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/customizedAccelerators/write | Create or update Customized Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/customizedAccelerators/delete | Delete Customized Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/customizedAccelerators/validate/action | Validate Customized Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/predefinedAccelerators/read | Get the Predefined Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/predefinedAccelerators/disable/action | Disable Predefined Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationAccelerators/predefinedAccelerators/enable/action | Enable Predefined Accelerator for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationLiveViews/read | Get the Application Live View for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationLiveViews/write | Create or update Application Live View for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/applicationLiveViews/delete | Delete Application Live View for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/write | Create or update the application for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/delete | Delete the application for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/read | Get the applications for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/getResourceUploadUrl/action | Get the resource upload URL of a specific Microsoft Azure Spring Apps application |
> | Microsoft.AppPlatform/Spring/apps/validateDomain/action | Validate the custom domain for a specific application |
> | Microsoft.AppPlatform/Spring/apps/setActiveDeployments/action | Set active deployments for a specific Microsoft Azure Spring Apps application |
> | Microsoft.AppPlatform/Spring/apps/bindings/write | Create or update the binding for a specific application |
> | Microsoft.AppPlatform/Spring/apps/bindings/delete | Delete the binding for a specific application |
> | Microsoft.AppPlatform/Spring/apps/bindings/read | Get the bindings for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/write | Create or update the deployment for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/delete | Delete the deployment for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/read | Get the deployments for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/start/action | Start the deployment for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/stop/action | Stop the deployment for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/restart/action | Restart the deployment for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/getLogFileUrl/action | Get the log file URL of a specific Microsoft Azure Spring Apps application deployment |
> | Microsoft.AppPlatform/Spring/apps/deployments/generateHeapDump/action | Generate heap dump for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/generateThreadDump/action | Generate thread dump for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/startJFR/action | Start JFR for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/enableRemoteDebugging/action | Enable remote debugging for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/disableRemoteDebugging/action | Disable remote debugging for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/getRemoteDebuggingConfig/action | Get remote debugging configuration for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/read | Get the service connectors for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/write | Create or update the service connector for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/delete | Delete the service connector for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/operationResults/read | Read resource operation result |
> | Microsoft.AppPlatform/Spring/apps/deployments/operationStatuses/read | Read resource operation Status |
> | Microsoft.AppPlatform/Spring/apps/deployments/skus/read | List available skus of an application deployment |
> | Microsoft.AppPlatform/Spring/apps/domains/write | Create or update the custom domain for a specific application |
> | Microsoft.AppPlatform/Spring/apps/domains/delete | Delete the custom domain for a specific application |
> | Microsoft.AppPlatform/Spring/apps/domains/read | Get the custom domains for a specific application |
> | Microsoft.AppPlatform/Spring/apps/operationResults/read | Read resource operation result |
> | Microsoft.AppPlatform/Spring/apps/operationStatuses/read | Read resource operation Status |
> | Microsoft.AppPlatform/Spring/buildpackBindings/read | Get the BuildpackBinding for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/read | Get the Build Services for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/getResourceUploadUrl/action | Get the Upload URL of a specific Microsoft Azure Spring Apps build |
> | Microsoft.AppPlatform/Spring/buildServices/write | Create or Update the Build Services for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/agentPools/read | Get the Agent Pools for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/agentPools/write | Create or update the Agent Pools for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builders/read | Get the Builders for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builders/write | Create or update the Builders for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builders/delete | Delete the Builders for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builders/listUsingDeployments/action | List deployments using the Builders for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builders/buildpackBindings/read | Get the BuildpackBinding for a specific Azure Spring Apps service instance Builder |
> | Microsoft.AppPlatform/Spring/buildServices/builders/buildpackBindings/write | Create or update the BuildpackBinding for a specific Azure Spring Apps service instance Builder |
> | Microsoft.AppPlatform/Spring/buildServices/builders/buildpackBindings/delete | Delete the BuildpackBinding for a specific Azure Spring Apps service instance Builder |
> | Microsoft.AppPlatform/Spring/buildServices/builds/read | Get the Builds for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builds/write | Create or update the Builds for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builds/delete | Delete the Builds for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builds/results/read | Get the Build Results for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/builds/results/getLogFileUrl/action | Get the Log File URL of a specific Microsoft Azure Spring Apps build result |
> | Microsoft.AppPlatform/Spring/buildServices/supportedBuildpacks/read | Get the Supported Buildpacks for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/buildServices/supportedStacks/read | Get the Supported Stacks for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/certificates/write | Create or update the certificate for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/certificates/delete | Delete the certificate for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/certificates/read | Get the certificates for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configServers/read | Get the config server for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configServers/write | Create or update the config server for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configServers/operationResults/read | Read resource operation result |
> | Microsoft.AppPlatform/Spring/configServers/operationStatuses/read | Read resource operation Status |
> | Microsoft.AppPlatform/Spring/configurationServices/read | Get the Application Configuration Services for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configurationServices/write | Create or update the Application Configuration Service for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configurationServices/delete | Delete the Application Configuration Service for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configurationServices/validate/action | Validate the settings for a specific Application Configuration Service |
> | Microsoft.AppPlatform/Spring/containerRegistries/read | Get the Container Registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/containerRegistries/write | Create or update the Container Registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/deployments/read | Get the deployments for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/detectors/read | Get the detectors for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/devToolPortals/read | Get the Dev Tool Portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/devToolPortals/write | Create or update Dev Tool Portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/devToolPortals/delete | Delete Dev Tool Portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/read | Get the Spring Cloud Gateways for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/write | Create or update the Spring Cloud Gateway for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/delete | Delete the Spring Cloud Gateway for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/validateDomain/action | Validate the Spring Cloud Gateway domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/listEnvSecrets/action | List environment variables secret of the Spring Cloud Gateway for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/restart/action | Restart the Spring Cloud Gateway for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/domains/read | Get the Spring Cloud Gateways domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/domains/write | Create or update the Spring Cloud Gateway domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/domains/delete | Delete the Spring Cloud Gateway domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/routeConfigs/read | Get the Spring Cloud Gateway route config for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/routeConfigs/write | Create or update the Spring Cloud Gateway route config for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/gateways/routeConfigs/delete | Delete the Spring Cloud Gateway route config for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/monitoringSettings/read | Get the monitoring setting for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/monitoringSettings/write | Create or update the monitoring setting for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/operationResults/read | Read resource operation result |
> | Microsoft.AppPlatform/Spring/operationStatuses/read | Read resource operation Status |
> | Microsoft.AppPlatform/Spring/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostic settings for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/providers/Microsoft.Insights/diagnosticSettings/write | Create or update the diagnostic settings for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/providers/Microsoft.Insights/logDefinitions/read | Get definitions of logs from Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/providers/Microsoft.Insights/metricDefinitions/read | Get definitions of metrics from Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/serviceRegistries/read | Get the Service Registrys for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/serviceRegistries/write | Create or update the Service Registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/serviceRegistries/delete | Delete the Service Registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/storages/write | Create or update the storage for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/storages/delete | Delete the storage for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/storages/read | Get storage for a specific Azure Spring Apps service instance |
> | **DataAction** | **Description** |
> | Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action | Remote debugging app instance for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/connect/action | Connect to an instance for a specific application |
> | Microsoft.AppPlatform/Spring/configService/read | Read the configuration content(for example, application.yaml) for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configService/write | Write config server content for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configService/delete | Delete config server content for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/read | Read the user app(s) registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/write | Write the user app(s) registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/delete | Delete the user app registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/logstreamService/read | Read the streaming log of user app for a specific Azure Spring Apps service instance |

### Microsoft.CertificateRegistration

Azure service: [App Service Certificates](../../../app-service/configure-ssl-app-service-certificate.md)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.CertificateRegistration/provisionGlobalAppServicePrincipalInUserTenant/Action | ProvisionAKSCluster service principal for service app principal |
> | Microsoft.CertificateRegistration/validateCertificateRegistrationInformation/Action | Validate certificate purchase object without submitting it |
> | Microsoft.CertificateRegistration/register/action | Register the Microsoft Certificates resource provider for the subscription |
> | Microsoft.CertificateRegistration/certificateOrders/Write | Add a new certificateOrder or update an existing one |
> | Microsoft.CertificateRegistration/certificateOrders/Delete | Delete an existing AppServiceCertificate |
> | Microsoft.CertificateRegistration/certificateOrders/Read | Get a CertificateOrder |
> | Microsoft.CertificateRegistration/certificateOrders/reissue/Action | Reissue an existing certificateorder |
> | Microsoft.CertificateRegistration/certificateOrders/renew/Action | Renew an existing certificateorder |
> | Microsoft.CertificateRegistration/certificateOrders/retrieveCertificateActions/Action | Retrieve the list of certificate actions |
> | Microsoft.CertificateRegistration/certificateOrders/retrieveContactInfo/Action | Retrieve certificate order contact information |
> | Microsoft.CertificateRegistration/certificateOrders/retrieveEmailHistory/Action | Retrieve certificate email history |
> | Microsoft.CertificateRegistration/certificateOrders/resendEmail/Action | Resend certificate email |
> | Microsoft.CertificateRegistration/certificateOrders/verifyDomainOwnership/Action | Verify domain ownership |
> | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | Resend domain verification ownership email containing steps on how to verify a domain for a given certificate order |
> | Microsoft.CertificateRegistration/certificateOrders/resendRequestEmails/Action | This method is used to obtain the site seal information for an issued certificate.<br>A site seal is a graphic that the certificate purchaser can embed on their web site to show their visitors information about their TLS/SSL certificate.<br>If a web site visitor clicks on the site seal image, a pop-up page is displayed that contains detailed information about the TLS/SSL certificate.<br>The site seal token is used to link the site seal graphic image to the appropriate certificate details pop-up page display when a user clicks on the site seal.<br>The site seal images are expected to be static images and hosted by the reseller, to minimize delays for customer page load times. |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Write | Add a new certificate or update an existing one |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Delete | Delete an existing certificate |
> | Microsoft.CertificateRegistration/certificateOrders/certificates/Read | Get the list of certificates |
> | Microsoft.CertificateRegistration/operations/Read | List all operations from app service certificate registration |

### Microsoft.DomainRegistration

Azure service: [App Service](../../../app-service/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DomainRegistration/generateSsoRequest/Action | Generate a request for signing into domain control center. |
> | Microsoft.DomainRegistration/validateDomainRegistrationInformation/Action | Validate domain purchase object without submitting it |
> | Microsoft.DomainRegistration/checkDomainAvailability/Action | Check if a domain is available for purchase |
> | Microsoft.DomainRegistration/listDomainRecommendations/Action | Retrieve the list domain recommendations based on keywords |
> | Microsoft.DomainRegistration/register/action | Register the Microsoft Domains resource provider for the subscription |
> | Microsoft.DomainRegistration/domains/Read | Get the list of domains |
> | Microsoft.DomainRegistration/domains/Read | Get domain |
> | Microsoft.DomainRegistration/domains/Write | Add a new Domain or update an existing one |
> | Microsoft.DomainRegistration/domains/Delete | Delete an existing domain. |
> | Microsoft.DomainRegistration/domains/renew/Action | Renew an existing domain. |
> | Microsoft.DomainRegistration/domains/retrieveContactInfo/Action | Retrieve contact info for existing domain |
> | Microsoft.DomainRegistration/domains/Read | Transfer out a domain to another registrar. |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | List ownership identifiers |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Read | Get ownership identifier |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Write | Create or update identifier |
> | Microsoft.DomainRegistration/domains/domainownershipidentifiers/Delete | Delete ownership identifier |
> | Microsoft.DomainRegistration/domains/operationresults/Read | Get a domain operation |
> | Microsoft.DomainRegistration/operations/Read | List all operations from app service domain registration |
> | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domains |
> | Microsoft.DomainRegistration/topLevelDomains/Read | Get toplevel domain |
> | Microsoft.DomainRegistration/topLevelDomains/listAgreements/Action | List Agreement action |

### Microsoft.Maps

Azure service: [Azure Maps](../../../azure-maps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Maps/unregister/action | Unregister the Maps provider |
> | Microsoft.Maps/register/action | Register the provider |
> | Microsoft.Maps/accounts/write | Create or update a Maps Account. |
> | Microsoft.Maps/accounts/read | Get a Maps Account. |
> | Microsoft.Maps/accounts/delete | Delete a Maps Account. |
> | Microsoft.Maps/accounts/listKeys/action | List Maps Account keys. |
> | Microsoft.Maps/accounts/regenerateKey/action | Generate new Maps Account primary or secondary key. |
> | Microsoft.Maps/accounts/creators/write | Create or update a Creator. |
> | Microsoft.Maps/accounts/creators/read | Get a Creator. |
> | Microsoft.Maps/accounts/creators/delete | Delete a Creator. |
> | Microsoft.Maps/accounts/eventGridFilters/delete | Delete an Event Grid filter. |
> | Microsoft.Maps/accounts/eventGridFilters/read | Get an Event Grid filter |
> | Microsoft.Maps/accounts/eventGridFilters/write | Create or update an Event Grid filter. |
> | Microsoft.Maps/accounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Maps/accounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Maps/accounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for Maps Accounts |
> | Microsoft.Maps/operations/read | Read the provider operations |
> | Microsoft.Maps/resourceTypes/read | Read the provider resourceTypes |
> | **DataAction** | **Description** |
> | Microsoft.Maps/accounts/services/batch/action | Allows actions upon data for batch services. |
> | Microsoft.Maps/accounts/services/analytics/read | Allows reading of data for Analytics services. |
> | Microsoft.Maps/accounts/services/analytics/delete | Allows deleting of data for Analytic services. |
> | Microsoft.Maps/accounts/services/analytics/write | Allows writing of data for Analytic services. |
> | Microsoft.Maps/accounts/services/data/read | Allows reading of data for data upload services and Creator resource. |
> | Microsoft.Maps/accounts/services/data/delete | Allows deleting of data for data upload services and Creator resource. |
> | Microsoft.Maps/accounts/services/data/write | Allows writing or updating of data for data upload services and Creator resource. |
> | Microsoft.Maps/accounts/services/dataordering/read | Allows reading of data for DataOrdering services. |
> | Microsoft.Maps/accounts/services/dataordering/write | Allows writing of data for Data Ordering services. |
> | Microsoft.Maps/accounts/services/elevation/read | Allows reading of data for Elevation services. |
> | Microsoft.Maps/accounts/services/geolocation/read | Allows reading of data for Geolocation services. |
> | Microsoft.Maps/accounts/services/render/read | Allows reading of data for Render services. |
> | Microsoft.Maps/accounts/services/route/read | Allows reading of data for Route services. |
> | Microsoft.Maps/accounts/services/search/read | Allows reading of data for Search services. |
> | Microsoft.Maps/accounts/services/spatial/read | Allows reading of data for Spatial services. |
> | Microsoft.Maps/accounts/services/spatial/write | Allows writing of data for Spatial services, such as event publishing. |
> | Microsoft.Maps/accounts/services/timezone/read | Allows reading of data for Timezone services. |
> | Microsoft.Maps/accounts/services/traffic/read | Allows reading of data for Traffic services. |
> | Microsoft.Maps/accounts/services/turnbyturn/read | Allows reading of data for TurnByTurn services. |
> | Microsoft.Maps/accounts/services/weather/read | Allows reading of data for Weather services. |

### Microsoft.Media

Azure service: [Media Services](/azure/media-services/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Media/register/action | Registers the subscription for the Media Services resource provider and enables the creation of Media Services accounts |
> | Microsoft.Media/unregister/action | Unregisters the subscription for the Media Services resource provider |
> | Microsoft.Media/checknameavailability/action | Checks if a Media Services account name is available |
> | Microsoft.Media/locations/checkNameAvailability/action | Checks if a Media Services account name is available |
> | Microsoft.Media/locations/mediaServicesOperationResults/read | Read any Media Services Operation Result |
> | Microsoft.Media/locations/mediaServicesOperationStatuses/read | Read Any Media Service Operation Status |
> | Microsoft.Media/locations/videoAnalyzerOperationResults/read | Read any Video Analyzer Operation Result |
> | Microsoft.Media/locations/videoAnalyzerOperationStatuses/read | Read any Video Analyzer Operation Status |
> | Microsoft.Media/mediaservices/read | Read any Media Services Account |
> | Microsoft.Media/mediaservices/write | Create or Update any Media Services Account |
> | Microsoft.Media/mediaservices/delete | Delete any Media Services Account |
> | Microsoft.Media/mediaservices/regenerateKey/action | Regenerate a Media Services ACS key |
> | Microsoft.Media/mediaservices/listKeys/action | List the ACS keys for the Media Services account |
> | Microsoft.Media/mediaservices/syncStorageKeys/action | Synchronize the Storage Keys for an attached Azure Storage account |
> | Microsoft.Media/mediaservices/listEdgePolicies/action | List policies for an edge device. |
> | Microsoft.Media/mediaservices/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Media/mediaservices/accountfilters/read | Read any Account Filter |
> | Microsoft.Media/mediaservices/accountfilters/write | Create or Update any Account Filter |
> | Microsoft.Media/mediaservices/accountfilters/delete | Delete any Account Filter |
> | Microsoft.Media/mediaservices/assets/read | Read any Asset |
> | Microsoft.Media/mediaservices/assets/write | Create or Update any Asset |
> | Microsoft.Media/mediaservices/assets/delete | Delete any Asset |
> | Microsoft.Media/mediaservices/assets/listContainerSas/action | List Asset Container SAS URLs |
> | Microsoft.Media/mediaservices/assets/getEncryptionKey/action | Get Asset Encryption Key |
> | Microsoft.Media/mediaservices/assets/listStreamingLocators/action | List Streaming Locators for Asset |
> | Microsoft.Media/mediaservices/assets/assetfilters/read | Read any Asset Filter |
> | Microsoft.Media/mediaservices/assets/assetfilters/write | Create or Update any Asset Filter |
> | Microsoft.Media/mediaservices/assets/assetfilters/delete | Delete any Asset Filter |
> | Microsoft.Media/mediaservices/assets/assetTracks/read | Read any Asset Track |
> | Microsoft.Media/mediaservices/assets/assetTracks/write | Create or Update any Asset Track |
> | Microsoft.Media/mediaservices/assets/assetTracks/delete | Delete any Asset Track |
> | Microsoft.Media/mediaservices/assets/assetTracks/updateTrackData/action | Update the track data for Asset Track |
> | Microsoft.Media/mediaservices/assets/assetTracks/assetTracksOperationResults/read | Read any Asset Track Operation Result |
> | Microsoft.Media/mediaservices/assets/assetTracks/assetTracksOperationStatuses/read | Read any Asset Track Operation Result |
> | Microsoft.Media/mediaservices/contentKeyPolicies/read | Read any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/write | Create or Update any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/delete | Delete any Content Key Policy |
> | Microsoft.Media/mediaservices/contentKeyPolicies/getPolicyPropertiesWithSecrets/action | Get Policy Properties With Secrets |
> | Microsoft.Media/mediaservices/eventGridFilters/read | Read any Event Grid Filter |
> | Microsoft.Media/mediaservices/eventGridFilters/write | Create or Update any Event Grid Filter |
> | Microsoft.Media/mediaservices/eventGridFilters/delete | Delete any Event Grid Filter |
> | Microsoft.Media/mediaservices/liveEventOperations/read | Read any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/read | Read any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/write | Create or Update any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/delete | Delete any Live Event |
> | Microsoft.Media/mediaservices/liveEvents/start/action | Start any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/stop/action | Stop any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/reset/action | Reset any Live Event Operation |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/read | Read any Live Output |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/write | Create or Update any Live Output |
> | Microsoft.Media/mediaservices/liveEvents/liveOutputs/delete | Delete any Live Output |
> | Microsoft.Media/mediaservices/liveEvents/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/liveEvents/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/liveEvents/providers/Microsoft.Insights/metricDefinitions/read | Get a list of Media Services Live Event Metrics definitions. |
> | Microsoft.Media/mediaservices/liveOutputOperations/read | Read any Live Output Operation |
> | Microsoft.Media/mediaservices/privateEndpointConnectionOperations/read | Read any Private Endpoint Connection Operation |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/read | Read any Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.Media/mediaservices/privateEndpointConnections/read | Read any Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateEndpointConnections/write | Create Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Media/mediaservices/privateLinkResources/read | Read any Private Link Resource |
> | Microsoft.Media/mediaservices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for a Media Services Account |
> | Microsoft.Media/mediaservices/providers/Microsoft.Insights/metricDefinitions/read | Get list of Media Services Metric definitions. |
> | Microsoft.Media/mediaservices/streamingEndpointOperations/read | Read any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/read | Read any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/write | Create or Update any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/delete | Delete any Streaming Endpoint |
> | Microsoft.Media/mediaservices/streamingEndpoints/start/action | Start any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/stop/action | Stop any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/scale/action | Scale any Streaming Endpoint Operation |
> | Microsoft.Media/mediaservices/streamingEndpoints/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/streamingEndpoints/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource. |
> | Microsoft.Media/mediaservices/streamingEndpoints/providers/Microsoft.Insights/metricDefinitions/read | Get list of Media Services Streaming Endpoint Metrics definitions. |
> | Microsoft.Media/mediaservices/streamingLocators/read | Read any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/write | Create or Update any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/delete | Delete any Streaming Locator |
> | Microsoft.Media/mediaservices/streamingLocators/listContentKeys/action | List Content Keys |
> | Microsoft.Media/mediaservices/streamingLocators/listPaths/action | List Paths |
> | Microsoft.Media/mediaservices/streamingPolicies/read | Read any Streaming Policy |
> | Microsoft.Media/mediaservices/streamingPolicies/write | Create or Update any Streaming Policy |
> | Microsoft.Media/mediaservices/streamingPolicies/delete | Delete any Streaming Policy |
> | Microsoft.Media/mediaservices/transforms/read | Read any Transform |
> | Microsoft.Media/mediaservices/transforms/write | Create or Update any Transform |
> | Microsoft.Media/mediaservices/transforms/delete | Delete any Transform |
> | Microsoft.Media/mediaservices/transforms/jobs/read | Read any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/write | Create or Update any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/delete | Delete any Job |
> | Microsoft.Media/mediaservices/transforms/jobs/cancelJob/action | Cancel Job |
> | Microsoft.Media/operations/read | Get Available Operations |
> | Microsoft.Media/videoAnalyzers/read | Read a Video Analyzer Account |
> | Microsoft.Media/videoAnalyzers/write | Create or Update a Video Analyzer Account |
> | Microsoft.Media/videoAnalyzers/delete | Delete a Video Analyzer Account |
> | Microsoft.Media/videoAnalyzers/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | Microsoft.Media/videoAnalyzers/accessPolicies/read | Read any Access Policy |
> | Microsoft.Media/videoAnalyzers/accessPolicies/write | Create or Update any Access Policy |
> | Microsoft.Media/videoAnalyzers/accessPolicies/delete | Delete any Access Policy |
> | Microsoft.Media/videoAnalyzers/edgeModules/read | Read any Edge Module |
> | Microsoft.Media/videoAnalyzers/edgeModules/write | Create or Update any Edge Module |
> | Microsoft.Media/videoAnalyzers/edgeModules/delete | Delete any Edge Module |
> | Microsoft.Media/videoAnalyzers/edgeModules/listProvisioningToken/action | Creates a new provisioning token.<br>A provisioning token allows for a single instance of Azure Video analyzer IoT edge module to be initialized and authorized to the cloud account.<br>The provisioning token itself is short lived and it is only used for the initial handshake between IoT edge module and the cloud.<br>After the initial handshake, the IoT edge module will agree on a set of authentication keys which will be auto-rotated as long as the module is able to periodically connect to the cloud.<br>A new provisioning token can be generated for the same IoT edge module in case the module state lost or reset |
> | Microsoft.Media/videoAnalyzers/livePipelines/read | Read any Live Pipeline |
> | Microsoft.Media/videoAnalyzers/livePipelines/write | Create or Update any Live Pipeline |
> | Microsoft.Media/videoAnalyzers/livePipelines/delete | Delete any Live Pipeline |
> | Microsoft.Media/videoAnalyzers/livePipelines/activate/action | Activate any Live Pipeline |
> | Microsoft.Media/videoAnalyzers/livePipelines/deactivate/action | Deactivate any Live Pipeline |
> | Microsoft.Media/videoAnalyzers/livePipelines/operationsStatus/read | Read any Live Pipeline operation status |
> | Microsoft.Media/videoAnalyzers/pipelineJobs/read | Read any Pipeline Job |
> | Microsoft.Media/videoAnalyzers/pipelineJobs/write | Create or Update any Pipeline Job |
> | Microsoft.Media/videoAnalyzers/pipelineJobs/delete | Delete any Pipeline Job |
> | Microsoft.Media/videoAnalyzers/pipelineJobs/cancel/action | Cancel any Pipeline Job |
> | Microsoft.Media/videoAnalyzers/pipelineJobs/operationsStatus/read | Read any Pipeline Job operation status |
> | Microsoft.Media/videoAnalyzers/pipelineTopologies/read | Read any Pipeline Topology |
> | Microsoft.Media/videoAnalyzers/pipelineTopologies/write | Create or Update any Pipeline Topology |
> | Microsoft.Media/videoAnalyzers/pipelineTopologies/delete | Delete any Pipeline Topology |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnectionOperations/read | Read any Private Endpoint Connection Operation |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnectionProxies/read | Read any Private Endpoint Connection Proxy |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnectionProxies/write | Create Private Endpoint Connection Proxy |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnections/read | Read any Private Endpoint Connection |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnections/write | Create Private Endpoint Connection |
> | Microsoft.Media/videoAnalyzers/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.Media/videoAnalyzers/privateLinkResources/read | Read any Private Link Resource |
> | Microsoft.Media/videoAnalyzers/videos/read | Read any Video |
> | Microsoft.Media/videoAnalyzers/videos/write | Create or Update any Video |
> | Microsoft.Media/videoAnalyzers/videos/delete | Delete any Video |
> | Microsoft.Media/videoAnalyzers/videos/listStreamingToken/action | Generates a streaming token which can be used for video playback |
> | Microsoft.Media/videoAnalyzers/videos/listContentToken/action | Generates a content token which can be used for video playback |

### Microsoft.Search

Azure service: [Azure Search](../../../search/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Search/register/action | Registers the subscription for the search resource provider and enables the creation of search services. |
> | Microsoft.Search/checkNameAvailability/action | Checks availability of the service name. |
> | Microsoft.Search/operations/read | Lists all of the available operations of the Microsoft.Search provider. |
> | Microsoft.Search/searchServices/write | Creates or updates the search service. |
> | Microsoft.Search/searchServices/read | Reads the search service. |
> | Microsoft.Search/searchServices/delete | Deletes the search service. |
> | Microsoft.Search/searchServices/start/action | Starts the search service. |
> | Microsoft.Search/searchServices/stop/action | Stops the search service. |
> | Microsoft.Search/searchServices/listAdminKeys/action | Reads the admin keys. |
> | Microsoft.Search/searchServices/regenerateAdminKey/action | Regenerates the admin key. |
> | Microsoft.Search/searchServices/listQueryKeys/action | Returns the list of query API keys for the given Azure Search service. |
> | Microsoft.Search/searchServices/createQueryKey/action | Creates the query key. |
> | Microsoft.Search/searchServices/privateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.Search/searchServices/dataSources/read | Return a data source or a list of data sources. |
> | Microsoft.Search/searchServices/dataSources/write | Create a data source or modify its properties. |
> | Microsoft.Search/searchServices/dataSources/delete | Delete a data source. |
> | Microsoft.Search/searchServices/debugSessions/read | Return a debug session or a list of debug sessions. |
> | Microsoft.Search/searchServices/debugSessions/write | Create a debug session or modify its properties. |
> | Microsoft.Search/searchServices/debugSessions/delete | Delete a debug session. |
> | Microsoft.Search/searchServices/debugSessions/execute/action | Use a debug session, get execution data, or evaluate expressions on it. |
> | Microsoft.Search/searchServices/deleteQueryKey/delete | Deletes the query key. |
> | Microsoft.Search/searchServices/diagnosticSettings/read | Gets the diganostic setting read for the resource |
> | Microsoft.Search/searchServices/diagnosticSettings/write | Creates or updates the diganostic setting for the resource |
> | Microsoft.Search/searchServices/indexers/read | Return an indexer or its status, or return a list of indexers or their statuses. |
> | Microsoft.Search/searchServices/indexers/write | Create an indexer, modify its properties, or manage its execution. |
> | Microsoft.Search/searchServices/indexers/delete | Delete an indexer. |
> | Microsoft.Search/searchServices/indexes/read | Return an index or its statistics, return a list of indexes or their statistics, or test the lexical analysis components of an index. |
> | Microsoft.Search/searchServices/indexes/write | Create an index or modify its properties. |
> | Microsoft.Search/searchServices/indexes/delete | Delete an index. |
> | Microsoft.Search/searchServices/logDefinitions/read | Gets the available logs for the search service |
> | Microsoft.Search/searchServices/metricDefinitions/read | Gets the available metrics for the search service |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/validate/action | Validates a private endpoint connection create call from NRP side |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/write | Creates a private endpoint connection proxy with the specified parameters or updates the properties or tags for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/read | Returns the list of private endpoint connection proxies or gets the properties for the specified private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnectionProxies/delete | Deletes an existing private endpoint connection proxy |
> | Microsoft.Search/searchServices/privateEndpointConnections/write | Creates a private endpoint connections with the specified parameters or updates the properties or tags for the specified private endpoint connections |
> | Microsoft.Search/searchServices/privateEndpointConnections/read | Returns the list of private endpoint connections or gets the properties for the specified private endpoint connections |
> | Microsoft.Search/searchServices/privateEndpointConnections/delete | Deletes an existing private endpoint connections |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/write | Creates a new shared private link resource with the specified parameters or updates the properties for the specified shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/read | Returns the list of shared private link resources or gets the properties for the specified shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/delete | Deletes an existing shared private link resource |
> | Microsoft.Search/searchServices/sharedPrivateLinkResources/operationStatuses/read | Get the details of a long running shared private link resource operation |
> | Microsoft.Search/searchServices/skillsets/read | Return a skillset or a list of skillsets. |
> | Microsoft.Search/searchServices/skillsets/write | Create a skillset or modify its properties. |
> | Microsoft.Search/searchServices/skillsets/delete | Delete a skillset. |
> | Microsoft.Search/searchServices/synonymMaps/read | Return a synonym map or a list of synonym maps. |
> | Microsoft.Search/searchServices/synonymMaps/write | Create a synonym map or modify its properties. |
> | Microsoft.Search/searchServices/synonymMaps/delete | Delete a synonym map. |
> | **DataAction** | **Description** |
> | Microsoft.Search/searchServices/indexes/documents/read | Read documents or suggested query terms from an index. |
> | Microsoft.Search/searchServices/indexes/documents/write | Upload documents to an index or modify existing documents. |
> | Microsoft.Search/searchServices/indexes/documents/delete | Delete documents from an index. |

### Microsoft.SignalRService

Azure service: [Azure SignalR Service](../../../azure-signalr/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.SignalRService/register/action | Registers the 'Microsoft.SignalRService' resource provider with a subscription |
> | Microsoft.SignalRService/unregister/action | Unregisters the 'Microsoft.SignalRService' resource provider with a subscription |
> | Microsoft.SignalRService/locations/checknameavailability/action | Checks if a name is available for use with a new Microsoft.SignalRService resource. |
> | Microsoft.SignalRService/locations/operationresults/signalr/read | Query the result of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/operationresults/webpubsub/read | Query the result of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/operationStatuses/signalr/read | Query the status of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/operationStatuses/webpubsub/read | Query the status of a location-based asynchronous operation |
> | Microsoft.SignalRService/locations/usages/read | Get the quota usages for Microsoft.SignalRService resource provider. |
> | Microsoft.SignalRService/operationresults/read | Query the result of a provider-level asynchronous operation |
> | Microsoft.SignalRService/operations/read | List the operations for Microsoft.SignalRService resource provider. |
> | Microsoft.SignalRService/operationStatuses/read | Query the status of a provider-level asynchronous operation |
> | Microsoft.SignalRService/SignalR/read | View the SignalR's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/SignalR/write | Modify the SignalR's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/SignalR/delete | Delete the SignalR resource. |
> | Microsoft.SignalRService/SignalR/listkeys/action | View the value of SignalR access keys in the management portal or through API |
> | Microsoft.SignalRService/SignalR/regeneratekey/action | Change the value of SignalR access keys in the management portal or through API |
> | Microsoft.SignalRService/SignalR/restart/action | To restart a SignalR resource in the management portal or through API. There will be certain downtime. |
> | Microsoft.SignalRService/SignalR/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/detectors/read | Read Detector |
> | Microsoft.SignalRService/SignalR/eventGridFilters/read | Get the properties of the specified event grid filter or lists all the event grid filters for the specified SignalR resource. |
> | Microsoft.SignalRService/SignalR/eventGridFilters/write | Create or update an event grid filter for a SignalR resource with the specified parameters. |
> | Microsoft.SignalRService/SignalR/eventGridFilters/delete | Delete an event grid filter from a SignalR resource. |
> | Microsoft.SignalRService/SignalR/operationResults/read |  |
> | Microsoft.SignalRService/SignalR/operationStatuses/read |  |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action |  |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/write | Write Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/read | Read Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/SignalR/privateEndpointConnections/write | Write Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/privateEndpointConnections/read | Read Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.SignalRService/SignalR/privateLinkResources/read | List Private Link Resources |
> | Microsoft.SignalRService/SignalR/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.SignalRService/SignalR/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.SignalRService/SignalR/providers/Microsoft.Insights/logDefinitions/read | Get the available logs of a SignalR resource. |
> | Microsoft.SignalRService/SignalR/providers/Microsoft.Insights/metricDefinitions/read | Get the available metrics of a SignalR resource. |
> | Microsoft.SignalRService/SignalR/sharedPrivateLinkResources/write | Write Shared Private Link Resource |
> | Microsoft.SignalRService/SignalR/sharedPrivateLinkResources/read | Read Shared Private Link Resource |
> | Microsoft.SignalRService/SignalR/sharedPrivateLinkResources/delete | Delete Shared Private Link Resource |
> | Microsoft.SignalRService/SignalR/skus/read | List the valid SKUs for an existing resource. |
> | Microsoft.SignalRService/skus/read | List the valid SKUs for an existing resource. |
> | Microsoft.SignalRService/WebPubSub/read | View the WebPubSub's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/WebPubSub/write | Modify the WebPubSub's settings and configurations in the management portal or through API |
> | Microsoft.SignalRService/WebPubSub/delete | Delete the WebPubSub resource. |
> | Microsoft.SignalRService/WebPubSub/listkeys/action | View the value of WebPubSub access keys in the management portal or through API |
> | Microsoft.SignalRService/WebPubSub/regeneratekey/action | Change the value of WebPubSub access keys in the management portal or through API |
> | Microsoft.SignalRService/WebPubSub/restart/action | To restart a WebPubSub resource in the management portal or through API. There will be certain downtime. |
> | Microsoft.SignalRService/WebPubSub/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connection |
> | Microsoft.SignalRService/WebPubSub/detectors/read | Read Detector |
> | Microsoft.SignalRService/WebPubSub/hubs/write | Write hub settings |
> | Microsoft.SignalRService/WebPubSub/hubs/read | Read hub settings |
> | Microsoft.SignalRService/WebPubSub/hubs/delete | Delete hub settings |
> | Microsoft.SignalRService/WebPubSub/operationResults/read |  |
> | Microsoft.SignalRService/WebPubSub/operationStatuses/read |  |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnectionProxies/updatePrivateEndpointProperties/action |  |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnectionProxies/write | Write Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnectionProxies/read | Read Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnectionProxies/delete | Delete Private Endpoint Connection Proxy |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnections/write | Write Private Endpoint Connection |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnections/read | Read Private Endpoint Connection |
> | Microsoft.SignalRService/WebPubSub/privateEndpointConnections/delete | Delete Private Endpoint Connection |
> | Microsoft.SignalRService/WebPubSub/privateLinkResources/read | List Private Link Resources |
> | Microsoft.SignalRService/WebPubSub/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.SignalRService/WebPubSub/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.SignalRService/WebPubSub/providers/Microsoft.Insights/logDefinitions/read | Get the available logs of a WebPubSub resource. |
> | Microsoft.SignalRService/WebPubSub/providers/Microsoft.Insights/metricDefinitions/read | Get the available metrics of a WebPubSub resource. |
> | Microsoft.SignalRService/WebPubSub/sharedPrivateLinkResources/write | Write Shared Private Link Resource |
> | Microsoft.SignalRService/WebPubSub/sharedPrivateLinkResources/read | Read Shared Private Link Resource |
> | Microsoft.SignalRService/WebPubSub/sharedPrivateLinkResources/delete | Delete Shared Private Link Resource |
> | Microsoft.SignalRService/WebPubSub/skus/read | List the valid SKUs for an existing resource. |
> | **DataAction** | **Description** |
> | Microsoft.SignalRService/SignalR/auth/clientToken/action | Generate an AccessToken for client to connect to ASRS, the token will expire in 5 minutes by default. |
> | Microsoft.SignalRService/SignalR/auth/accessKey/action | Generate an AccessKey for signing AccessTokens, the key will expire in 90 minutes by default. |
> | Microsoft.SignalRService/SignalR/auth/accessToken/action | Generate an AccessToken for client to connect to ASRS, the token will expire in 5 minutes by default. |
> | Microsoft.SignalRService/SignalR/clientConnection/send/action | Send messages directly to a client connection. |
> | Microsoft.SignalRService/SignalR/clientConnection/read | Check client connection existence. |
> | Microsoft.SignalRService/SignalR/clientConnection/write | Close client connection. |
> | Microsoft.SignalRService/SignalR/group/send/action | Broadcast message to group. |
> | Microsoft.SignalRService/SignalR/group/read | Check group existence or user existence in group. |
> | Microsoft.SignalRService/SignalR/group/write | Join / Leave group. |
> | Microsoft.SignalRService/SignalR/hub/send/action | Broadcast messages to all client connections in hub. |
> | Microsoft.SignalRService/SignalR/livetrace/read | Read live trace tool results |
> | Microsoft.SignalRService/SignalR/livetrace/write | Create live trace connections |
> | Microsoft.SignalRService/SignalR/serverConnection/write | Start a server connection. |
> | Microsoft.SignalRService/SignalR/user/send/action | Send messages to user, who may consist of multiple client connections. |
> | Microsoft.SignalRService/SignalR/user/read | Check user existence. |
> | Microsoft.SignalRService/SignalR/user/write | Modify a user. |
> | Microsoft.SignalRService/WebPubSub/auth/accessKey/action | Generate an AccessKey for signing AccessTokens, the key will expire in 90 minutes by default. |
> | Microsoft.SignalRService/WebPubSub/auth/accessToken/action | Generate an AccessToken for client to connect to AWPS, the token will expire in 5 minutes by default. |
> | Microsoft.SignalRService/WebPubSub/clientConnection/generateToken/action | Generate a JWT Token for client to connect to the service. |
> | Microsoft.SignalRService/WebPubSub/clientConnection/send/action | Send messages directly to a client connection. |
> | Microsoft.SignalRService/WebPubSub/clientConnection/read | Check client connection existence. |
> | Microsoft.SignalRService/WebPubSub/clientConnection/write | Close client connection. |
> | Microsoft.SignalRService/WebPubSub/group/send/action | Broadcast message to group. |
> | Microsoft.SignalRService/WebPubSub/group/read | Check group existence or user existence in group. |
> | Microsoft.SignalRService/WebPubSub/group/write | Join / Leave group. |
> | Microsoft.SignalRService/WebPubSub/hub/send/action | Broadcast messages to all client connections in hub. |
> | Microsoft.SignalRService/WebPubSub/livetrace/read | Read live trace tool results |
> | Microsoft.SignalRService/WebPubSub/livetrace/write | Create live trace connections |
> | Microsoft.SignalRService/WebPubSub/user/send/action | Send messages to user, who may consist of multiple client connections. |
> | Microsoft.SignalRService/WebPubSub/user/read | Check user existence. |

### microsoft.web

Azure service: [App Service](../../../app-service/index.yml), [Azure Functions](../../../azure-functions/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.web/unregister/action | Unregister Microsoft.Web resource provider for the subscription. |
> | microsoft.web/validate/action | Validate . |
> | microsoft.web/register/action | Register Microsoft.Web resource provider for the subscription. |
> | microsoft.web/verifyhostingenvironmentvnet/action | Verify Hosting Environment Vnet. |
> | microsoft.web/apimanagementaccounts/apiacls/read | Get Api Management Accounts Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/read | Get Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/delete | Delete Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/write | Update Api Management Accounts APIs. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/delete | Delete Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/read | Get Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/apiacls/write | Update Api Management Accounts APIs Apiacls. |
> | microsoft.web/apimanagementaccounts/apis/connectionacls/read | Get Api Management Accounts APIs Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/read | Get Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/confirmconsentcode/action | Confirm Consent Code Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/delete | Delete Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/getconsentlinks/action | Get Consent Links for Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/write | Update Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/listconnectionkeys/action | List Connection Keys Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/listsecrets/action | List Secrets Api Management Accounts APIs Connections. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/delete | Delete Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/read | Get Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/connections/connectionacls/write | Update Api Management Accounts APIs Connections Connectionacls. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/delete | Delete Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/read | Get Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/apis/localizeddefinitions/write | Update Api Management Accounts APIs Localized Definitions. |
> | microsoft.web/apimanagementaccounts/connectionacls/read | Get Api Management Accounts Connectionacls. |
> | microsoft.web/availablestacks/read | Get Available Stacks. |
> | microsoft.web/billingmeters/read | Get list of billing meters. |
> | Microsoft.Web/certificates/Read | Get the list of certificates. |
> | Microsoft.Web/certificates/Write | Add a new certificate or update an existing one. |
> | Microsoft.Web/certificates/Delete | Delete an existing certificate. |
> | microsoft.web/certificates/operationresults/read | Get Certificates Operation Results. |
> | microsoft.web/checknameavailability/read | Check if resource name is available. |
> | microsoft.web/classicmobileservices/read | Get Classic Mobile Services. |
> | Microsoft.Web/connectionGateways/Read | Get the list of Connection Gateways. |
> | Microsoft.Web/connectionGateways/Write | Creates or updates a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Delete | Deletes a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Move/Action | Moves a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Join/Action | Joins a Connection Gateway. |
> | Microsoft.Web/connectionGateways/Associate/Action | Associates with a Connection Gateway. |
> | Microsoft.Web/connectionGateways/ListStatus/Action | Lists status of a Connection Gateway. |
> | Microsoft.Web/connections/Read | Get the list of Connections. |
> | Microsoft.Web/connections/Write | Creates or updates a Connection. |
> | Microsoft.Web/connections/Delete | Deletes a Connection. |
> | Microsoft.Web/connections/Move/Action | Moves a Connection. |
> | Microsoft.Web/connections/Join/Action | Joins a Connection. |
> | microsoft.web/connections/confirmconsentcode/action | Confirm Connections Consent Code. |
> | microsoft.web/connections/listconsentlinks/action | List Consent Links for Connections. |
> | microsoft.web/connections/listConnectionKeys/action | Lists API Connections Keys. |
> | microsoft.web/connections/revokeConnectionKeys/action | Revokes API Connections Keys. |
> | microsoft.web/connections/dynamicInvoke/action | Dynamic Invoke a Connection. |
> | Microsoft.Web/connections/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for API Connections |
> | Microsoft.Web/containerApps/read | Get the properties for a Container App |
> | Microsoft.Web/containerApps/write | Create a Container App or update an existing one |
> | Microsoft.Web/containerApps/delete | Delete a Container App |
> | Microsoft.Web/containerApps/listsecrets/action | List a Container App Secrets |
> | Microsoft.Web/containerApps/operationResults/read | Get the results of a Container App operation |
> | Microsoft.Web/containerApps/revisions/read | Get a Container App Revision |
> | Microsoft.Web/containerApps/revisions/activate/action | Activate a Container App Revision |
> | Microsoft.Web/containerApps/revisions/deactivate/action | Deactivate a Container App Revision |
> | Microsoft.Web/containerApps/revisions/deactivate/restart/action | Restart a Container App Revision |
> | Microsoft.Web/containerApps/sourcecontrols/read | Get a Container App Source Control |
> | Microsoft.Web/containerApps/sourcecontrols/write | Create or Update a Container App Source Control |
> | Microsoft.Web/containerApps/sourcecontrols/delete | Delete a Container App Source Control |
> | Microsoft.Web/customApis/Read | Get the list of Custom API. |
> | Microsoft.Web/customApis/Write | Creates or updates a Custom API. |
> | Microsoft.Web/customApis/Delete | Deletes a Custom API. |
> | Microsoft.Web/customApis/Move/Action | Moves a Custom API. |
> | Microsoft.Web/customApis/Join/Action | Joins a Custom API. |
> | Microsoft.Web/customApis/extractApiDefinitionFromWsdl/Action | Extracts API definition from a WSDL. |
> | Microsoft.Web/customApis/listWsdlInterfaces/Action | Lists WSDL interfaces for a Custom API. |
> | Microsoft.Web/customhostnameSites/Read | Get info about custom hostnames under subscription. |
> | Microsoft.Web/deletedSites/Read | Get the properties of a Deleted Web App |
> | microsoft.web/deploymentlocations/read | Get Deployment Locations. |
> | Microsoft.Web/freeTrialStaticWebApps/write | Creates or updates a free trial static web app. |
> | Microsoft.Web/freeTrialStaticWebApps/upgrade/action | Upgrades a free trial static web app. |
> | Microsoft.Web/freeTrialStaticWebApps/read | Lists free trial static web apps. |
> | Microsoft.Web/freeTrialStaticWebApps/delete | Deletes a free trial static web app. |
> | microsoft.web/functionappstacks/read | Get Function App Stacks. |
> | Microsoft.Web/geoRegions/Read | Get the list of Geo regions. |
> | Microsoft.Web/hostingEnvironments/Read | Get the properties of an App Service Environment |
> | Microsoft.Web/hostingEnvironments/Write | Create a new App Service Environment or update existing one |
> | Microsoft.Web/hostingEnvironments/Delete | Delete an App Service Environment |
> | Microsoft.Web/hostingEnvironments/Join/Action | Joins an App Service Environment |
> | Microsoft.Web/hostingEnvironments/reboot/Action | Reboot all machines in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/upgrade/Action | Upgrades an App Service Environment |
> | Microsoft.Web/hostingEnvironments/testUpgradeAvailableNotification/Action | Send test upgrade notification for an App Service Environment |
> | Microsoft.Web/hostingEnvironments/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | microsoft.web/hostingenvironments/resume/action | Resume Hosting Environments. |
> | microsoft.web/hostingenvironments/suspend/action | Suspend Hosting Environments. |
> | microsoft.web/hostingenvironments/capacities/read | Get Hosting Environments Capacities. |
> | microsoft.web/hostingenvironments/configurations/read | Get Hosting Environment Configurations. |
> | microsoft.web/hostingenvironments/configurations/write | Update  Hosting Environment Configurations. |
> | Microsoft.Web/hostingEnvironments/configurations/networking/Read | Get networking configuration of an App Service Environment |
> | Microsoft.Web/hostingEnvironments/configurations/networking/Write | Update networking configuration of an App Service Environment. |
> | microsoft.web/hostingenvironments/detectors/read | Get Hosting Environments Detectors. |
> | microsoft.web/hostingenvironments/diagnostics/read | Get Hosting Environments Diagnostics. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/delete | Delete Event Grid Filter on hosting environment. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/read | Get Event Grid Filter on hosting environment. |
> | Microsoft.Web/hostingEnvironments/eventGridFilters/write | Put Event Grid Filter on hosting environment. |
> | microsoft.web/hostingenvironments/health/read | Get the health details of an App Service Environment. |
> | microsoft.web/hostingenvironments/inboundnetworkdependenciesendpoints/read | Get the network endpoints of all inbound dependencies. |
> | microsoft.web/hostingenvironments/metricdefinitions/read | Get Hosting Environments Metric Definitions. |
> | Microsoft.Web/hostingEnvironments/multiRolePools/Read | Get the properties of a FrontEnd Pool in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/multiRolePools/Write | Create a new FrontEnd Pool in an App Service Environment or update an existing one |
> | microsoft.web/hostingenvironments/multirolepools/metricdefinitions/read | Get Hosting Environments MultiRole Pools Metric Definitions. |
> | microsoft.web/hostingenvironments/multirolepools/metrics/read | Get Hosting Environments MultiRole Pools Metrics. |
> | Microsoft.Web/hostingEnvironments/multiRolePools/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for App Service Environment MultiRole |
> | microsoft.web/hostingenvironments/multirolepools/skus/read | Get Hosting Environments MultiRole Pools SKUs. |
> | microsoft.web/hostingenvironments/multirolepools/usages/read | Get Hosting Environments MultiRole Pools Usages. |
> | microsoft.web/hostingenvironments/operations/read | Get Hosting Environments Operations. |
> | microsoft.web/hostingenvironments/outboundnetworkdependenciesendpoints/read | Get the network endpoints of all outbound dependencies. |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnectionProxies/Read | Read Private Endpoint Connection Proxies |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnectionProxies/Write | Create or Update Private Endpoint Connection Proxies |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnectionProxies/Delete | Delete Private Endpoint Connection Proxies |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxies |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnectionProxies/operations/Read | Read Private Endpoint Connection Proxy Operations |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnections/Write | Approve or Reject a private endpoint connection. |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnections/Read | Get a private endpoint connection or the list of private endpoint connections. |
> | Microsoft.Web/hostingEnvironments/privateEndpointConnections/Delete | Delete a private endpoint connection. |
> | Microsoft.Web/hostingEnvironments/privateLinkResources/Read | Get Private Link Resources. |
> | microsoft.web/hostingenvironments/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.web/hostingenvironments/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | microsoft.web/hostingenvironments/providers/Microsoft.Insights/logDefinitions/read | Read hosting environments log definitions |
> | Microsoft.Web/hostingEnvironments/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for App Service Environment |
> | microsoft.web/hostingenvironments/serverfarms/read | Get Hosting Environments App Service Plans. |
> | microsoft.web/hostingenvironments/sites/read | Get Hosting Environments Web Apps. |
> | microsoft.web/hostingenvironments/usages/read | Get Hosting Environments Usages. |
> | Microsoft.Web/hostingEnvironments/workerPools/Read | Get the properties of a Worker Pool in an App Service Environment |
> | Microsoft.Web/hostingEnvironments/workerPools/Write | Create a new Worker Pool in an App Service Environment or update an existing one |
> | microsoft.web/hostingenvironments/workerpools/metricdefinitions/read | Get Hosting Environments Workerpools Metric Definitions. |
> | microsoft.web/hostingenvironments/workerpools/metrics/read | Get Hosting Environments Workerpools Metrics. |
> | Microsoft.Web/hostingEnvironments/workerPools/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for App Service Environment WorkerPool |
> | microsoft.web/hostingenvironments/workerpools/skus/read | Get Hosting Environments Workerpools SKUs. |
> | microsoft.web/hostingenvironments/workerpools/usages/read | Get Hosting Environments Workerpools Usages. |
> | microsoft.web/ishostingenvironmentnameavailable/read | Get if Hosting Environment Name is available. |
> | microsoft.web/ishostnameavailable/read | Check if Hostname is Available. |
> | microsoft.web/isusernameavailable/read | Check if Username is available. |
> | Microsoft.Web/kubeEnvironments/read | Get the properties of a Kubernetes Environment |
> | Microsoft.Web/kubeEnvironments/write | Create a Kubernetes Environment or update an existing one |
> | Microsoft.Web/kubeEnvironments/delete | Delete a Kubernetes Environment |
> | Microsoft.Web/kubeEnvironments/join/action | Joins a Kubernetes Environment |
> | Microsoft.Web/kubeEnvironments/operations/read | Get the operations for a Kubernetes Environment |
> | Microsoft.Web/listSitesAssignedToHostName/Read | Get names of sites assigned to hostname. |
> | Microsoft.Web/locations/GetNetworkPolicies/action | Read Network Intent Policies |
> | microsoft.web/locations/extractapidefinitionfromwsdl/action | Extract Api Definition from WSDL for Locations. |
> | microsoft.web/locations/listwsdlinterfaces/action | List WSDL Interfaces for Locations. |
> | microsoft.web/locations/deleteVirtualNetworkOrSubnets/action | Vnet or subnet deletion notification for Locations. |
> | microsoft.web/locations/validateDeleteVirtualNetworkOrSubnets/action | Validates deleting Vnet or subnet for Locations |
> | Microsoft.Web/locations/previewstaticsiteworkflowfile/action | Preview Static Site Workflow File |
> | microsoft.web/locations/apioperations/read | Get Locations API Operations. |
> | microsoft.web/locations/connectiongatewayinstallations/read | Get Locations Connection Gateway Installations. |
> | Microsoft.Web/locations/deletedSites/Read | Get the properties of a Deleted Web App at location |
> | microsoft.web/locations/functionappstacks/read | Get Function App Stacks for location. |
> | microsoft.web/locations/managedapis/read | Get Locations Managed APIs. |
> | Microsoft.Web/locations/managedapis/Join/Action | Joins a Managed API. |
> | microsoft.web/locations/managedapis/apioperations/read | Get Locations Managed API Operations. |
> | microsoft.web/locations/operationResults/read | Get Operations. |
> | microsoft.web/locations/operations/read | Get Operations. |
> | microsoft.web/locations/webappstacks/read | Get Web App Stacks for location. |
> | microsoft.web/operations/read | Get Operations. |
> | microsoft.web/publishingusers/read | Get Publishing Users. |
> | microsoft.web/publishingusers/write | Update Publishing Users. |
> | Microsoft.Web/recommendations/Read | Get the list of recommendations for subscriptions. |
> | microsoft.web/resourcehealthmetadata/read | Get Resource Health Metadata. |
> | Microsoft.Web/serverfarms/Read | Get the properties on an App Service Plan |
> | Microsoft.Web/serverfarms/Write | Create a new App Service Plan or update an existing one |
> | Microsoft.Web/serverfarms/Delete | Delete an existing App Service Plan |
> | Microsoft.Web/serverfarms/Join/Action | Joins an App Service Plan |
> | Microsoft.Web/serverfarms/restartSites/Action | Restart all Web Apps in an App Service Plan |
> | microsoft.web/serverfarms/capabilities/read | Get App Service Plans Capabilities. |
> | Microsoft.Web/serverfarms/eventGridFilters/delete | Delete Event Grid Filter on server farm. |
> | Microsoft.Web/serverfarms/eventGridFilters/read | Get Event Grid Filter on server farm. |
> | Microsoft.Web/serverfarms/eventGridFilters/write | Put Event Grid Filter on server farm. |
> | microsoft.web/serverfarms/firstpartyapps/keyvaultsettings/read | Get first party Azure Key vault referenced settings for App Service Plan. |
> | microsoft.web/serverfarms/firstpartyapps/keyvaultsettings/write | Create or Update first party Azure Key vault referenced settings for App Service Plan. |
> | microsoft.web/serverfarms/firstpartyapps/settings/delete | Delete App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/firstpartyapps/settings/read | Get App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/firstpartyapps/settings/write | Update App Service Plans First Party Apps Settings. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/read | Get App Service Plans Hybrid Connection Namespaces Relays. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/delete | Delete App Service Plans Hybrid Connection Namespaces Relays. |
> | microsoft.web/serverfarms/hybridconnectionnamespaces/relays/sites/read | Get App Service Plans Hybrid Connection Namespaces Relays Web Apps. |
> | microsoft.web/serverfarms/hybridconnectionplanlimits/read | Get App Service Plans Hybrid Connection Plan Limits. |
> | microsoft.web/serverfarms/hybridconnectionrelays/read | Get App Service Plans Hybrid Connection Relays. |
> | microsoft.web/serverfarms/metricdefinitions/read | Get App Service Plans Metric Definitions. |
> | microsoft.web/serverfarms/metrics/read | Get App Service Plans Metrics. |
> | microsoft.web/serverfarms/operationresults/read | Get App Service Plans Operation Results. |
> | microsoft.web/serverfarms/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.web/serverfarms/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Web/serverfarms/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for App Service Plan |
> | Microsoft.Web/serverfarms/recommendations/Read | Get the list of recommendations for App Service Plan. |
> | microsoft.web/serverfarms/sites/read | Get App Service Plans Web Apps. |
> | microsoft.web/serverfarms/skus/read | Get App Service Plans SKUs. |
> | microsoft.web/serverfarms/usages/read | Get App Service Plans Usages. |
> | microsoft.web/serverfarms/virtualnetworkconnections/read | Get App Service Plans Virtual Network Connections. |
> | microsoft.web/serverfarms/virtualnetworkconnections/gateways/write | Update App Service Plans Virtual Network Connections Gateways. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/delete | Delete App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/read | Get App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/virtualnetworkconnections/routes/write | Update App Service Plans Virtual Network Connections Routes. |
> | microsoft.web/serverfarms/workers/reboot/action | Reboot App Service Plans Workers. |
> | Microsoft.Web/sites/Read | Get the properties of a Web App |
> | Microsoft.Web/sites/Write | Create a new Web App or update an existing one |
> | Microsoft.Web/sites/Delete | Delete an existing Web App |
> | Microsoft.Web/sites/backup/Action | Create a new web app backup |
> | Microsoft.Web/sites/publishxml/Action | Get publishing profile xml for a Web App |
> | Microsoft.Web/sites/publish/Action | Publish a Web App |
> | Microsoft.Web/sites/restart/Action | Restart a Web App |
> | Microsoft.Web/sites/start/Action | Start a Web App |
> | Microsoft.Web/sites/stop/Action | Stop a Web App |
> | Microsoft.Web/sites/slotsswap/Action | Swap Web App deployment slots |
> | Microsoft.Web/sites/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Microsoft.Web/sites/applySlotConfig/Action | Apply web app slot configuration from target slot to the current web app |
> | Microsoft.Web/sites/resetSlotConfig/Action | Reset web app configuration |
> | Microsoft.Web/sites/PrivateEndpointConnectionsApproval/action | Approve Private Endpoint Connections |
> | microsoft.web/sites/deployWorkflowArtifacts/action | Create the artifacts in a Logic App. |
> | microsoft.web/sites/functions/action | Functions Web Apps. |
> | microsoft.web/sites/listsyncfunctiontriggerstatus/action | List Sync Function Trigger Status. |
> | microsoft.web/sites/networktrace/action | Network Trace Web Apps. |
> | microsoft.web/sites/newpassword/action | Newpassword Web Apps. |
> | microsoft.web/sites/sync/action | Sync Web Apps. |
> | microsoft.web/sites/migratemysql/action | Migrate MySQL Web Apps. |
> | microsoft.web/sites/recover/action | Recover Web Apps. |
> | microsoft.web/sites/restoresnapshot/action | Restore Web Apps Snapshots. |
> | microsoft.web/sites/restorefromdeletedapp/action | Restore Web Apps From Deleted App. |
> | microsoft.web/sites/syncfunctiontriggers/action | Sync Function Triggers. |
> | microsoft.web/sites/backups/action | Discovers an existing app backup that can be restored from a blob in Azure storage. |
> | microsoft.web/sites/containerlogs/action | Get Zipped Container Logs for Web App. |
> | microsoft.web/sites/restorefrombackupblob/action | Restore Web App From Backup Blob. |
> | microsoft.web/sites/listbackups/action | List Web App backups. |
> | microsoft.web/sites/slotcopy/action | Copy content from deployment slot. |
> | microsoft.web/sites/analyzecustomhostname/read | Analyze Custom Hostname. |
> | microsoft.web/sites/backup/read | Get Web Apps Backup. |
> | microsoft.web/sites/backup/write | Update Web Apps Backup. |
> | Microsoft.Web/sites/backups/Read | Get the properties of a web app's backup |
> | microsoft.web/sites/backups/list/action | List Web Apps Backups. |
> | microsoft.web/sites/backups/restore/action | Restore Web Apps Backups. |
> | microsoft.web/sites/backups/delete | Delete Web Apps Backups. |
> | microsoft.web/sites/backups/write | Update Web Apps Backups. |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/Read | List which publishing methods are allowed for a Web App |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/Write | List which publishing methods are allowed for a Web App |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/ftp/Read | Get whether FTP publishing credentials are allowed for a Web App |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/ftp/Write | Update whether FTP publishing credentials are allowed for a Web App |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/scm/Read | Get whether SCM publishing credentials are allowed for a Web App |
> | Microsoft.Web/sites/basicPublishingCredentialsPolicies/scm/Write | Update whether SCM publishing credentials are allowed for a Web App |
> | Microsoft.Web/sites/config/Read | Get Web App configuration settings |
> | Microsoft.Web/sites/config/list/Action | List Web App's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Microsoft.Web/sites/config/Write | Update Web App's configuration settings |
> | microsoft.web/sites/config/delete | Delete Web Apps Config. |
> | microsoft.web/sites/config/appsettings/read | Get Web App settings. |
> | microsoft.web/sites/config/snapshots/read | Get Web Apps Config Snapshots. |
> | microsoft.web/sites/config/snapshots/listsecrets/action | Web Apps List Secrets From Snapshot. |
> | microsoft.web/sites/config/web/appsettings/read | Get Web App Single App setting. |
> | microsoft.web/sites/config/web/appsettings/write | Create or Update Web App Single App setting |
> | microsoft.web/sites/config/web/appsettings/delete | Delete Web Apps App Setting |
> | microsoft.web/sites/config/web/connectionstrings/read | Get Web App single connectionstring |
> | microsoft.web/sites/config/web/connectionstrings/write | Get Web App single App setting. |
> | microsoft.web/sites/config/web/connectionstrings/delete | Delete Web App single connection string |
> | microsoft.web/sites/containerlogs/download/action | Download Web Apps Container Logs. |
> | microsoft.web/sites/continuouswebjobs/delete | Delete Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/read | Get Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/start/action | Start Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/continuouswebjobs/stop/action | Stop Web Apps Continuous Web Jobs. |
> | microsoft.web/sites/deployments/delete | Delete Web Apps Deployments. |
> | microsoft.web/sites/deployments/read | Get Web Apps Deployments. |
> | microsoft.web/sites/deployments/write | Update Web Apps Deployments. |
> | microsoft.web/sites/deployments/log/read | Get Web Apps Deployments Log. |
> | microsoft.web/sites/detectors/read | Get Web Apps Detectors. |
> | microsoft.web/sites/diagnostics/read | Get Web Apps Diagnostics Categories. |
> | microsoft.web/sites/diagnostics/analyses/read | Get Web Apps Diagnostics Analysis. |
> | microsoft.web/sites/diagnostics/analyses/execute/Action | Run Web Apps Diagnostics Analysis. |
> | microsoft.web/sites/diagnostics/aspnetcore/read | Get Web Apps Diagnostics for ASP.NET Core app. |
> | microsoft.web/sites/diagnostics/autoheal/read | Get Web Apps Diagnostics Autoheal. |
> | microsoft.web/sites/diagnostics/deployment/read | Get Web Apps Diagnostics Deployment. |
> | microsoft.web/sites/diagnostics/deployments/read | Get Web Apps Diagnostics Deployments. |
> | microsoft.web/sites/diagnostics/detectors/read | Get Web Apps Diagnostics Detector. |
> | microsoft.web/sites/diagnostics/detectors/execute/Action | Run Web Apps Diagnostics Detector. |
> | microsoft.web/sites/diagnostics/failedrequestsperuri/read | Get Web Apps Diagnostics Failed Requests Per Uri. |
> | microsoft.web/sites/diagnostics/frebanalysis/read | Get Web Apps Diagnostics FREB Analysis. |
> | microsoft.web/sites/diagnostics/loganalyzer/read | Get Web Apps Diagnostics Log Analyzer. |
> | microsoft.web/sites/diagnostics/runtimeavailability/read | Get Web Apps Diagnostics Runtime Availability. |
> | microsoft.web/sites/diagnostics/servicehealth/read | Get Web Apps Diagnostics Service Health. |
> | microsoft.web/sites/diagnostics/sitecpuanalysis/read | Get Web Apps Diagnostics Site CPU Analysis. |
> | microsoft.web/sites/diagnostics/sitecrashes/read | Get Web Apps Diagnostics Site Crashes. |
> | microsoft.web/sites/diagnostics/sitelatency/read | Get Web Apps Diagnostics Site Latency. |
> | microsoft.web/sites/diagnostics/sitememoryanalysis/read | Get Web Apps Diagnostics Site Memory Analysis. |
> | microsoft.web/sites/diagnostics/siterestartsettingupdate/read | Get Web Apps Diagnostics Site Restart Setting Update. |
> | microsoft.web/sites/diagnostics/siterestartuserinitiated/read | Get Web Apps Diagnostics Site Restart User Initiated. |
> | microsoft.web/sites/diagnostics/siteswap/read | Get Web Apps Diagnostics Site Swap. |
> | microsoft.web/sites/diagnostics/threadcount/read | Get Web Apps Diagnostics Thread Count. |
> | microsoft.web/sites/diagnostics/workeravailability/read | Get Web Apps Diagnostics Workeravailability. |
> | microsoft.web/sites/diagnostics/workerprocessrecycle/read | Get Web Apps Diagnostics Worker Process Recycle. |
> | microsoft.web/sites/domainownershipidentifiers/read | Get Web Apps Domain Ownership Identifiers. |
> | microsoft.web/sites/domainownershipidentifiers/write | Update Web Apps Domain Ownership Identifiers. |
> | microsoft.web/sites/domainownershipidentifiers/delete | Delete Web Apps Domain Ownership Identifiers. |
> | Microsoft.Web/sites/eventGridFilters/delete | Delete Event Grid Filter on web app. |
> | Microsoft.Web/sites/eventGridFilters/read | Get Event Grid Filter on web app. |
> | Microsoft.Web/sites/eventGridFilters/write | Put Event Grid Filter on web app. |
> | microsoft.web/sites/extensions/delete | Delete Web Apps Site Extensions. |
> | microsoft.web/sites/extensions/read | Get Web Apps Site Extensions. |
> | microsoft.web/sites/extensions/write | Update Web Apps Site Extensions. |
> | microsoft.web/sites/extensions/api/action | Invoke App Service Extensions APIs. |
> | microsoft.web/sites/functions/delete | Delete Web Apps Functions. |
> | microsoft.web/sites/functions/listsecrets/action | List Function secrets. |
> | microsoft.web/sites/functions/listkeys/action | List Function keys. |
> | microsoft.web/sites/functions/read | Get Web Apps Functions. |
> | microsoft.web/sites/functions/write | Update Web Apps Functions. |
> | microsoft.web/sites/functions/keys/write | Update Function keys. |
> | microsoft.web/sites/functions/keys/delete | Delete Function keys. |
> | microsoft.web/sites/functions/masterkey/read | Get Web Apps Functions Masterkey. |
> | microsoft.web/sites/functions/token/read | Get Web Apps Functions Token. |
> | microsoft.web/sites/host/listkeys/action | List Functions Host keys. |
> | microsoft.web/sites/host/sync/action | Sync Function Triggers. |
> | microsoft.web/sites/host/listsyncstatus/action | List Sync Function Triggers Status. |
> | microsoft.web/sites/host/functionkeys/write | Update Functions Host Function keys. |
> | microsoft.web/sites/host/functionkeys/delete | Delete Functions Host Function keys. |
> | microsoft.web/sites/host/systemkeys/write | Update Functions Host System keys. |
> | microsoft.web/sites/host/systemkeys/delete | Delete Functions Host System keys. |
> | microsoft.web/sites/hostnamebindings/delete | Delete Web Apps Hostname Bindings. |
> | microsoft.web/sites/hostnamebindings/read | Get Web Apps Hostname Bindings. |
> | microsoft.web/sites/hostnamebindings/write | Update Web Apps Hostname Bindings. |
> | Microsoft.Web/sites/hostruntime/host/action | Perform Function App runtime action like sync triggers, add functions, invoke functions, delete functions etc. |
> | microsoft.web/sites/hostruntime/functions/keys/read | Get Web Apps Hostruntime Functions Keys. |
> | microsoft.web/sites/hostruntime/host/read | Get Web Apps Hostruntime Host. |
> | Microsoft.Web/sites/hostruntime/host/_master/read | Get Function App's master key for admin operations |
> | microsoft.web/sites/hostruntime/webhooks/api/workflows/runs/read | List Web Apps Hostruntime Workflow Runs. |
> | microsoft.web/sites/hostruntime/webhooks/api/workflows/triggers/read | List Web Apps Hostruntime Workflow Triggers. |
> | microsoft.web/sites/hostruntime/webhooks/api/workflows/triggers/listCallbackUrl/action | Get Web Apps Hostruntime Workflow Trigger Uri. |
> | microsoft.web/sites/hybridconnection/delete | Delete Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnection/read | Get Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnection/write | Update Web Apps Hybrid Connection. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/delete | Delete Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/listkeys/action | List Keys Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/write | Update Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionnamespaces/relays/read | Get Web Apps Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/hybridconnectionrelays/read | Get Web Apps Hybrid Connection Relays. |
> | microsoft.web/sites/instances/read | Get Web Apps Instances. |
> | microsoft.web/sites/instances/deployments/read | Get Web Apps Instances Deployments. |
> | microsoft.web/sites/instances/deployments/delete | Delete Web Apps Instances Deployments. |
> | microsoft.web/sites/instances/extensions/read | Get Web Apps Instances Extensions. |
> | microsoft.web/sites/instances/extensions/log/read | Get Web Apps Instances Extensions Log. |
> | microsoft.web/sites/instances/extensions/processes/read | Get Web Apps Instances Extensions Processes. |
> | microsoft.web/sites/instances/processes/delete | Delete Web Apps Instances Processes. |
> | microsoft.web/sites/instances/processes/read | Get Web Apps Instances Processes. |
> | microsoft.web/sites/instances/processes/modules/read | Get Web Apps Instances Processes Modules. |
> | microsoft.web/sites/instances/processes/threads/read | Get Web Apps Instances Processes Threads. |
> | microsoft.web/sites/metricdefinitions/read | Get Web Apps Metric Definitions. |
> | microsoft.web/sites/metrics/read | Get Web Apps Metrics. |
> | microsoft.web/sites/metricsdefinitions/read | Get Web Apps Metrics Definitions. |
> | microsoft.web/sites/migratemysql/read | Get Web Apps Migrate MySQL. |
> | microsoft.web/sites/networkConfig/read | Get App Service Network Configuration. |
> | microsoft.web/sites/networkConfig/write | Update App Service Network Configuration. |
> | microsoft.web/sites/networkConfig/delete | Delete App Service Network Configuration. |
> | microsoft.web/sites/networkfeatures/read | Get Web App Features. |
> | microsoft.web/sites/networktraces/operationresults/read | Get Web Apps Network Trace Operation Results. |
> | microsoft.web/sites/operationresults/read | Get Web Apps Operation Results. |
> | microsoft.web/sites/operations/read | Get Web Apps Operations. |
> | microsoft.web/sites/perfcounters/read | Get Web Apps Performance Counters. |
> | microsoft.web/sites/premieraddons/delete | Delete Web Apps Premier Addons. |
> | microsoft.web/sites/premieraddons/read | Get Web Apps Premier Addons. |
> | microsoft.web/sites/premieraddons/write | Update Web Apps Premier Addons. |
> | microsoft.web/sites/privateaccess/read | Get data around private site access enablement and authorized Virtual Networks that can access the site. |
> | Microsoft.Web/sites/privateEndpointConnectionProxies/Read | Read Private Endpoint Connection Proxies |
> | Microsoft.Web/sites/privateEndpointConnectionProxies/Write | Create or Update Private Endpoint Connection Proxies |
> | Microsoft.Web/sites/privateEndpointConnectionProxies/Delete | Delete Private Endpoint Connection Proxies |
> | Microsoft.Web/sites/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxies |
> | Microsoft.Web/sites/privateEndpointConnectionProxies/operations/Read | Read Private Endpoint Connection Proxy Operations |
> | Microsoft.Web/sites/privateEndpointConnections/Write | Approve or Reject a private endpoint connection. |
> | Microsoft.Web/sites/privateEndpointConnections/Read | Get a Private Endpoint Connection or the list of Private Endpoint Connections. |
> | Microsoft.Web/sites/privateEndpointConnections/Delete | Delete a Private Endpoint Connection. |
> | Microsoft.Web/sites/privateLinkResources/Read | Get Private Link Resources. |
> | microsoft.web/sites/processes/read | Get Web Apps Processes. |
> | microsoft.web/sites/processes/modules/read | Get Web Apps Processes Modules. |
> | microsoft.web/sites/processes/threads/read | Get Web Apps Processes Threads. |
> | microsoft.web/sites/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.web/sites/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | microsoft.web/sites/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Web App |
> | Microsoft.Web/sites/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for Web App |
> | microsoft.web/sites/publiccertificates/delete | Delete Web Apps Public Certificates. |
> | microsoft.web/sites/publiccertificates/read | Get Web Apps Public Certificates. |
> | microsoft.web/sites/publiccertificates/write | Update Web Apps Public Certificates. |
> | microsoft.web/sites/publishxml/read | Get Web Apps Publishing XML. |
> | microsoft.web/sites/recommendationhistory/read | Get Web Apps Recommendation History. |
> | Microsoft.Web/sites/recommendations/Read | Get the list of recommendations for web app. |
> | microsoft.web/sites/recommendations/disable/action | Disable Web Apps Recommendations. |
> | microsoft.web/sites/resourcehealthmetadata/read | Get Web Apps Resource Health Metadata. |
> | microsoft.web/sites/restore/read | Get Web Apps Restore. |
> | microsoft.web/sites/restore/write | Restore Web Apps. |
> | microsoft.web/sites/siteextensions/delete | Delete Web Apps Site Extensions. |
> | microsoft.web/sites/siteextensions/read | Get Web Apps Site Extensions. |
> | microsoft.web/sites/siteextensions/write | Update Web Apps Site Extensions. |
> | Microsoft.Web/sites/slots/Write | Create a new Web App Slot or update an existing one |
> | Microsoft.Web/sites/slots/Delete | Delete an existing Web App Slot |
> | Microsoft.Web/sites/slots/backup/Action | Create new Web App Slot backup. |
> | Microsoft.Web/sites/slots/publishxml/Action | Get publishing profile xml for Web App Slot |
> | Microsoft.Web/sites/slots/publish/Action | Publish a Web App Slot |
> | Microsoft.Web/sites/slots/restart/Action | Restart a Web App Slot |
> | Microsoft.Web/sites/slots/start/Action | Start a Web App Slot |
> | Microsoft.Web/sites/slots/stop/Action | Stop a Web App Slot |
> | Microsoft.Web/sites/slots/slotsswap/Action | Swap Web App deployment slots |
> | Microsoft.Web/sites/slots/slotsdiffs/Action | Get differences in configuration between web app and slots |
> | Microsoft.Web/sites/slots/applySlotConfig/Action | Apply web app slot configuration from target slot to the current slot. |
> | Microsoft.Web/sites/slots/resetSlotConfig/Action | Reset web app slot configuration |
> | Microsoft.Web/sites/slots/Read | Get the properties of a Web App deployment slot |
> | microsoft.web/sites/slots/deployWorkflowArtifacts/action | Create the artifacts in a deployment slot in a Logic App. |
> | microsoft.web/sites/slots/listsyncfunctiontriggerstatus/action | List Sync Function Trigger Status for deployment slot. |
> | microsoft.web/sites/slots/newpassword/action | Newpassword Web Apps Slots. |
> | microsoft.web/sites/slots/sync/action | Sync Web Apps Slots. |
> | microsoft.web/sites/slots/syncfunctiontriggers/action | Sync Function Triggers for deployment slot. |
> | microsoft.web/sites/slots/networktrace/action | Network Trace Web Apps Slots. |
> | microsoft.web/sites/slots/recover/action | Recover Web Apps Slots. |
> | microsoft.web/sites/slots/restoresnapshot/action | Restore Web Apps Slots Snapshots. |
> | microsoft.web/sites/slots/restorefromdeletedapp/action | Restore Web App Slots From Deleted App. |
> | microsoft.web/sites/slots/backups/action | Discover Web Apps Slots Backups. |
> | microsoft.web/sites/slots/containerlogs/action | Get Zipped Container Logs for Web App Slot. |
> | microsoft.web/sites/slots/restorefrombackupblob/action | Restore Web Apps Slot From Backup Blob. |
> | microsoft.web/sites/slots/listbackups/action | List Web App Slot backups. |
> | microsoft.web/sites/slots/slotcopy/action | Copy content from one deployment slot to another. |
> | microsoft.web/sites/slots/analyzecustomhostname/read | Get Web Apps Slots Analyze Custom Hostname. |
> | microsoft.web/sites/slots/backup/write | Update Web Apps Slots Backup. |
> | microsoft.web/sites/slots/backup/read | Get Web Apps Slots Backup. |
> | Microsoft.Web/sites/slots/backups/Read | Get the properties of a web app slots' backup |
> | microsoft.web/sites/slots/backups/list/action | List Web Apps Slots Backups. |
> | microsoft.web/sites/slots/backups/restore/action | Restore Web Apps Slots Backups. |
> | microsoft.web/sites/slots/backups/delete | Delete Web Apps Slots Backups. |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/Read | List which publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/Write | List which publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/ftp/Read | Get whether FTP publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/ftp/Write | Update whether FTP publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/scm/Read | Get whether SCM publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/basicPublishingCredentialsPolicies/scm/Write | Update whether SCM publishing credentials are allowed for a Web App Slot |
> | Microsoft.Web/sites/slots/config/Read | Get Web App Slot's configuration settings |
> | Microsoft.Web/sites/slots/config/list/Action | List Web App Slot's security sensitive settings, such as publishing credentials, app settings and connection strings |
> | Microsoft.Web/sites/slots/config/Write | Update Web App Slot's configuration settings |
> | microsoft.web/sites/slots/config/delete | Delete Web Apps Slots Config. |
> | microsoft.web/sites/slots/config/validateupgradepath/action | Validate upgrade path for Web App. |
> | microsoft.web/sites/slots/config/validateupgradepath/action | Validate upgrade path for Web App Slot. |
> | microsoft.web/sites/slots/config/appsettings/read | Get Web App Slot settings. |
> | microsoft.web/sites/slots/config/appsettings/read | Get Web App Slot's single App setting. |
> | microsoft.web/sites/slots/config/appsettings/write | Create or Update Web App Slot's Single App setting |
> | microsoft.web/sites/slots/config/snapshots/read | Get Web App Slots Config Snapshots. |
> | microsoft.web/sites/slots/config/snapshots/listsecrets/action | Web Apps List Slot Secrets From Snapshot. |
> | microsoft.web/sites/slots/config/web/appsettings/delete | Delete Web App Slot's App Setting |
> | microsoft.web/sites/slots/config/web/connectionstrings/read | Get Web App Slot's single connection string |
> | microsoft.web/sites/slots/config/web/connectionstrings/write | Create or Update Web App Slot's single sonnection string |
> | microsoft.web/sites/slots/config/web/connectionstrings/delete | Delete Web App slot's single connection string |
> | microsoft.web/sites/slots/containerlogs/download/action | Download Web Apps Slots Container Logs. |
> | microsoft.web/sites/slots/continuouswebjobs/delete | Delete Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/read | Get Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/start/action | Start Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/continuouswebjobs/stop/action | Stop Web Apps Slots Continuous Web Jobs. |
> | microsoft.web/sites/slots/deployments/delete | Delete Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/read | Get Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/write | Update Web Apps Slots Deployments. |
> | microsoft.web/sites/slots/deployments/log/read | Get Web Apps Slots Deployments Log. |
> | microsoft.web/sites/slots/detectors/read | Get Web Apps Slots Detectors. |
> | microsoft.web/sites/slots/diagnostics/read | Get Web Apps Slots Diagnostics. |
> | microsoft.web/sites/slots/diagnostics/analyses/read | Get Web Apps Slots Diagnostics Analysis. |
> | microsoft.web/sites/slots/diagnostics/analyses/execute/Action | Run Web Apps Slots Diagnostics Analysis. |
> | microsoft.web/sites/slots/diagnostics/aspnetcore/read | Get Web Apps Slots Diagnostics for ASP.NET Core app. |
> | microsoft.web/sites/slots/diagnostics/autoheal/read | Get Web Apps Slots Diagnostics Autoheal. |
> | microsoft.web/sites/slots/diagnostics/deployment/read | Get Web Apps Slots Diagnostics Deployment. |
> | microsoft.web/sites/slots/diagnostics/deployments/read | Get Web Apps Slots Diagnostics Deployments. |
> | microsoft.web/sites/slots/diagnostics/detectors/read | Get Web Apps Slots Diagnostics Detector. |
> | microsoft.web/sites/slots/diagnostics/detectors/execute/Action | Run Web Apps Slots Diagnostics Detector. |
> | microsoft.web/sites/slots/diagnostics/frebanalysis/read | Get Web Apps Slots Diagnostics FREB Analysis. |
> | microsoft.web/sites/slots/diagnostics/loganalyzer/read | Get Web Apps Slots Diagnostics Log Analyzer. |
> | microsoft.web/sites/slots/diagnostics/runtimeavailability/read | Get Web Apps Slots Diagnostics Runtime Availability. |
> | microsoft.web/sites/slots/diagnostics/servicehealth/read | Get Web Apps Slots Diagnostics Service Health. |
> | microsoft.web/sites/slots/diagnostics/sitecpuanalysis/read | Get Web Apps Slots Diagnostics Site CPU Analysis. |
> | microsoft.web/sites/slots/diagnostics/sitecrashes/read | Get Web Apps Slots Diagnostics Site Crashes. |
> | microsoft.web/sites/slots/diagnostics/sitelatency/read | Get Web Apps Slots Diagnostics Site Latency. |
> | microsoft.web/sites/slots/diagnostics/sitememoryanalysis/read | Get Web Apps Slots Diagnostics Site Memory Analysis. |
> | microsoft.web/sites/slots/diagnostics/siterestartsettingupdate/read | Get Web Apps Slots Diagnostics Site Restart Setting Update. |
> | microsoft.web/sites/slots/diagnostics/siterestartuserinitiated/read | Get Web Apps Slots Diagnostics Site Restart User Initiated. |
> | microsoft.web/sites/slots/diagnostics/siteswap/read | Get Web Apps Slots Diagnostics Site Swap. |
> | microsoft.web/sites/slots/diagnostics/threadcount/read | Get Web Apps Slots Diagnostics Thread Count. |
> | microsoft.web/sites/slots/diagnostics/workeravailability/read | Get Web Apps Slots Diagnostics Workeravailability. |
> | microsoft.web/sites/slots/diagnostics/workerprocessrecycle/read | Get Web Apps Slots Diagnostics Worker Process Recycle. |
> | microsoft.web/sites/slots/domainownershipidentifiers/read | Get Web Apps Slots Domain Ownership Identifiers. |
> | microsoft.web/sites/slots/domainownershipidentifiers/write | Update Web App Slots Domain Ownership Identifiers. |
> | microsoft.web/sites/slots/domainownershipidentifiers/delete | Delete Web App Slots Domain Ownership Identifiers. |
> | microsoft.web/sites/slots/extensions/read | Get Web Apps Slots Extensions. |
> | microsoft.web/sites/slots/extensions/write | Update Web Apps Slots Extensions. |
> | microsoft.web/sites/slots/extensions/api/action | Invoke App Service Slots Extensions APIs. |
> | microsoft.web/sites/slots/functions/listkeys/action | List Function keys. |
> | microsoft.web/sites/slots/functions/read | Get Web Apps Slots Functions. |
> | microsoft.web/sites/slots/functions/listsecrets/action | List Secrets Web Apps Slots Functions. |
> | microsoft.web/sites/slots/functions/keys/write | Update Function keys. |
> | microsoft.web/sites/slots/functions/keys/delete | Delete Function keys. |
> | microsoft.web/sites/slots/host/listkeys/action | List Functions Host keys. |
> | microsoft.web/sites/slots/host/sync/action | Sync Function Triggers. |
> | microsoft.web/sites/slots/host/functionkeys/write | Update Functions Host Function keys. |
> | microsoft.web/sites/slots/host/functionkeys/delete | Delete Functions Host Function keys. |
> | microsoft.web/sites/slots/host/systemkeys/write | Update Functions Host System keys. |
> | microsoft.web/sites/slots/host/systemkeys/delete | Delete Functions Host System keys. |
> | microsoft.web/sites/slots/hostnamebindings/delete | Delete Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hostnamebindings/read | Get Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hostnamebindings/write | Update Web Apps Slots Hostname Bindings. |
> | microsoft.web/sites/slots/hybridconnection/delete | Delete Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnection/read | Get Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnection/write | Update Web Apps Slots Hybrid Connection. |
> | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/delete | Delete Web Apps Slots Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/slots/hybridconnectionnamespaces/relays/write | Update Web Apps Slots Hybrid Connection Namespaces Relays. |
> | microsoft.web/sites/slots/hybridconnectionrelays/read | Get Web Apps Slots Hybrid Connection Relays. |
> | microsoft.web/sites/slots/instances/read | Get Web Apps Slots Instances. |
> | microsoft.web/sites/slots/instances/deployments/read | Get Web Apps Slots Instances Deployments. |
> | microsoft.web/sites/slots/instances/processes/read | Get Web Apps Slots Instances Processes. |
> | microsoft.web/sites/slots/instances/processes/delete | Delete Web Apps Slots Instances Processes. |
> | microsoft.web/sites/slots/metricdefinitions/read | Get Web Apps Slots Metric Definitions. |
> | microsoft.web/sites/slots/metrics/read | Get Web Apps Slots Metrics. |
> | microsoft.web/sites/slots/migratemysql/read | Get Web Apps Slots Migrate MySQL. |
> | microsoft.web/sites/slots/networkConfig/read | Get App Service Slots Network Configuration. |
> | microsoft.web/sites/slots/networkConfig/write | Update App Service Slots Network Configuration. |
> | microsoft.web/sites/slots/networkConfig/delete | Delete App Service Slots Network Configuration. |
> | microsoft.web/sites/slots/networkfeatures/read | Get Web App Slot Features. |
> | microsoft.web/sites/slots/networktraces/operationresults/read | Get Web Apps Slots Network Trace Operation Results. |
> | microsoft.web/sites/slots/operationresults/read | Get Web Apps Slots Operation Results. |
> | microsoft.web/sites/slots/operations/read | Get Web Apps Slots Operations. |
> | microsoft.web/sites/slots/perfcounters/read | Get Web Apps Slots Performance Counters. |
> | microsoft.web/sites/slots/phplogging/read | Get Web Apps Slots Phplogging. |
> | microsoft.web/sites/slots/premieraddons/delete | Delete Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/premieraddons/read | Get Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/premieraddons/write | Update Web Apps Slots Premier Addons. |
> | microsoft.web/sites/slots/privateaccess/read | Get data around private site access enablement and authorized Virtual Networks that can access the site. |
> | microsoft.web/sites/slots/processes/read | Get Web Apps Slots Processes. |
> | microsoft.web/sites/slots/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | microsoft.web/sites/slots/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | microsoft.web/sites/slots/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Web App slots |
> | Microsoft.Web/sites/slots/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for Web App Slot |
> | microsoft.web/sites/slots/publiccertificates/read | Get Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/publiccertificates/write | Create or Update Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/publiccertificates/delete | Delete Web Apps Slots Public Certificates. |
> | microsoft.web/sites/slots/resourcehealthmetadata/read | Get Web Apps Slots Resource Health Metadata. |
> | microsoft.web/sites/slots/restore/read | Get Web Apps Slots Restore. |
> | microsoft.web/sites/slots/restore/write | Restore Web Apps Slots. |
> | microsoft.web/sites/slots/siteextensions/delete | Delete Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/siteextensions/read | Get Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/siteextensions/write | Update Web Apps Slots Site Extensions. |
> | microsoft.web/sites/slots/snapshots/read | Get Web Apps Slots Snapshots. |
> | Microsoft.Web/sites/slots/sourcecontrols/Read | Get Web App Slot's source control configuration settings |
> | Microsoft.Web/sites/slots/sourcecontrols/Write | Update Web App Slot's source control configuration settings |
> | Microsoft.Web/sites/slots/sourcecontrols/Delete | Delete Web App Slot's source control configuration settings |
> | microsoft.web/sites/slots/triggeredwebjobs/delete | Delete Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/triggeredwebjobs/read | Get Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/triggeredwebjobs/run/action | Run Web Apps Slots Triggered WebJobs. |
> | microsoft.web/sites/slots/usages/read | Get Web Apps Slots Usages. |
> | microsoft.web/sites/slots/virtualnetworkconnections/delete | Delete Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/read | Get Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/write | Update Web Apps Slots Virtual Network Connections. |
> | microsoft.web/sites/slots/virtualnetworkconnections/gateways/write | Update Web Apps Slots Virtual Network Connections Gateways. |
> | microsoft.web/sites/slots/webjobs/read | Get Web Apps Slots WebJobs. |
> | microsoft.web/sites/slots/workflows/read | List the workflows in a deployment slot in a Logic App. |
> | microsoft.web/sites/slots/workflowsconfiguration/read | Get workflow app's configuration information by its ID in a deployment slot in a Logic App. |
> | microsoft.web/sites/snapshots/read | Get Web Apps Snapshots. |
> | Microsoft.Web/sites/sourcecontrols/Read | Get Web App's source control configuration settings |
> | Microsoft.Web/sites/sourcecontrols/Write | Update Web App's source control configuration settings |
> | Microsoft.Web/sites/sourcecontrols/Delete | Delete Web App's source control configuration settings |
> | microsoft.web/sites/triggeredwebjobs/delete | Delete Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/read | Get Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/run/action | Run Web Apps Triggered WebJobs. |
> | microsoft.web/sites/triggeredwebjobs/history/read | Get Web Apps Triggered WebJobs History. |
> | microsoft.web/sites/usages/read | Get Web Apps Usages. |
> | microsoft.web/sites/virtualnetworkconnections/delete | Delete Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/read | Get Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/write | Update Web Apps Virtual Network Connections. |
> | microsoft.web/sites/virtualnetworkconnections/gateways/read | Get Web Apps Virtual Network Connections Gateways. |
> | microsoft.web/sites/virtualnetworkconnections/gateways/write | Update Web Apps Virtual Network Connections Gateways. |
> | microsoft.web/sites/webjobs/read | Get Web Apps WebJobs. |
> | microsoft.web/sites/workflows/read | List the workflows in a Logic App. |
> | microsoft.web/sites/workflowsconfiguration/read | Get workflow app's configuration information by its ID in a Logic App. |
> | microsoft.web/skus/read | Get SKUs. |
> | microsoft.web/sourcecontrols/read | Get Source Controls. |
> | microsoft.web/sourcecontrols/write | Update Source Controls. |
> | Microsoft.Web/staticSites/Read | Get the properties of a Static Site |
> | Microsoft.Web/staticSites/Write | Create a new Static Site or update an existing one |
> | Microsoft.Web/staticSites/Delete | Delete an existing Static Site |
> | Microsoft.Web/staticSites/validateCustomDomainOwnership/action | Validate the custom domain ownership for a static site |
> | Microsoft.Web/staticSites/createinvitation/action | Creates invitiation link for static site user for a set of roles |
> | Microsoft.Web/staticSites/listConfiguredRoles/action | Lists the roles configured for the static site. |
> | Microsoft.Web/staticSites/listfunctionappsettings/Action | List function app settings for a Static Site |
> | Microsoft.Web/staticSites/listappsettings/Action | List app settings for a Static Site |
> | Microsoft.Web/staticSites/detach/Action | Detach a Static Site from the currently linked repository |
> | Microsoft.Web/staticSites/getuser/Action | Get a user's information for a Static Site |
> | Microsoft.Web/staticSites/listsecrets/action | List the secrets for a Static Site |
> | Microsoft.Web/staticSites/resetapikey/Action | Reset the api key for a Static Site |
> | Microsoft.Web/staticSites/zipdeploy/action | Deploy a Static Site from zipped content |
> | Microsoft.Web/staticSites/showDatabaseConnections/action | Show details for Database Connections for a Static Site |
> | Microsoft.Web/staticSites/authproviders/listusers/Action | List the users for a Static Site |
> | Microsoft.Web/staticSites/authproviders/users/Delete | Delete a user for a Static Site |
> | Microsoft.Web/staticSites/authproviders/users/Write | Update a user for a Static Site |
> | Microsoft.Web/staticSites/build/Read | Get a build for a Static Site |
> | Microsoft.Web/staticSites/build/Delete | Delete a build for a Static Site |
> | Microsoft.Web/staticSites/builds/listfunctionappsettings/Action | List function app settings for a Static Site Build |
> | Microsoft.Web/staticSites/builds/listappsettings/Action | List app settings for a Static Site Build |
> | Microsoft.Web/staticSites/builds/zipdeploy/action | Deploy a Static Site Build from zipped content |
> | Microsoft.Web/staticSites/builds/showDatabaseConnections/action | Show details for Database Connections for a Static Site Build |
> | Microsoft.Web/staticSites/builds/config/Write | Create or update app settings for a Static Site Build |
> | Microsoft.Web/staticSites/builds/databaseConnections/Delete | Delete a Database Connection from a Static Site Build |
> | Microsoft.Web/staticSites/builds/databaseConnections/Read | Get Static Site Build Database Connections |
> | Microsoft.Web/staticSites/builds/databaseConnections/Write | Create or Update a Database Connection with a Static Site Build |
> | Microsoft.Web/staticSites/builds/databaseConnections/show/action | Show details for a Database Connection for a Static Site Build |
> | Microsoft.Web/staticSites/builds/functions/Read | List the functions for a Static Site Build |
> | Microsoft.Web/staticSites/builds/linkedBackends/validate/action | Validate a Linked Backend for a Static Site Build |
> | Microsoft.Web/staticSites/builds/linkedBackends/Delete | Unlink a Backend from a Static Site Build |
> | Microsoft.Web/staticSites/builds/linkedBackends/Read | Get Static Site Build Linked Backends |
> | Microsoft.Web/staticSites/builds/linkedBackends/Write | Register a Linked Backend with a Static Site Build |
> | Microsoft.Web/staticSites/builds/userProvidedFunctionApps/Delete | Detach a User Provided Function App from a Static Site Build |
> | Microsoft.Web/staticSites/builds/userProvidedFunctionApps/Read | Get Static Site Build User Provided Function Apps |
> | Microsoft.Web/staticSites/builds/userProvidedFunctionApps/Write | Register a User Provided Function App with a Static Site Build |
> | Microsoft.Web/staticSites/config/Write | Create or update app settings for a Static Site |
> | Microsoft.Web/staticSites/customdomains/Write | Create a custom domain for a Static Site |
> | Microsoft.Web/staticSites/customdomains/Delete | Delete a custom domain for a Static Site |
> | Microsoft.Web/staticSites/customdomains/Read | List the custom domains for a Static Site |
> | Microsoft.Web/staticSites/customdomains/validate/Action | Validate a custom domain can be added to a Static Site |
> | Microsoft.Web/staticSites/databaseConnections/Delete | Delete a Database Connection from a Static Site |
> | Microsoft.Web/staticSites/databaseConnections/Read | Get Static Site Database Connection |
> | Microsoft.Web/staticSites/databaseConnections/Write | Create or Update a Database Connection with a Static Site |
> | Microsoft.Web/staticSites/databaseConnections/show/action | Show details for a Database Connection for a Static Site |
> | Microsoft.Web/staticSites/functions/Read | List the functions for a Static Site |
> | Microsoft.Web/staticSites/linkedBackends/validate/action | Validate a Linked Backend for a Static Site |
> | Microsoft.Web/staticSites/linkedBackends/Delete | Unlink a Backend from a Static Site |
> | Microsoft.Web/staticSites/linkedBackends/Read | Get Static Site Linked Backends |
> | Microsoft.Web/staticSites/linkedBackends/Write | Register a Linked Backend with a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnectionProxies/validate/action | Validate Private Endpoint Connection Proxies for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnectionProxies/Write | Create or Update Private Endpoint Connection Proxies for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnectionProxies/Delete | Delete Private Endpoint Connection Proxies for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnectionProxies/Read | Get Private Endpoint Connection Proxies for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnectionProxies/operations/Read | Read Private Endpoint Connection Proxy Operations for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnections/Write | Approve or Reject Private Endpoint Connection for a Static Site |
> | Microsoft.Web/staticSites/privateEndpointConnections/Read | Get a private endpoint connection or the list of private endpoint connections for a static site |
> | Microsoft.Web/staticSites/privateEndpointConnections/Delete | Delete a Private Endpoint Connection for a Static Site |
> | Microsoft.Web/staticSites/privateLinkResources/Read | Get Private Link Resources |
> | Microsoft.Web/staticSites/providers/Microsoft.Insights/metricDefinitions/Read | Gets the available metrics for Static Site |
> | Microsoft.Web/staticSites/userProvidedFunctionApps/Delete | Detach a User Provided Function App from a Static Site |
> | Microsoft.Web/staticSites/userProvidedFunctionApps/Read | Get Static Site User Provided Function Apps |
> | Microsoft.Web/staticSites/userProvidedFunctionApps/Write | Register a User Provided Function App with a Static Site |
> | microsoft.web/webappstacks/read | Get Web App Stacks. |
> | Microsoft.Web/workerApps/read | Get the properties for a Worker App |
> | Microsoft.Web/workerApps/write | Create a Worker App or update an existing one |
> | Microsoft.Web/workerApps/delete | Delete a Worker App |
> | Microsoft.Web/workerApps/operationResults/read | Get the results of a Worker App operation |
