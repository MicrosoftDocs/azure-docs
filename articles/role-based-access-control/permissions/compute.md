---
title: Azure permissions for Compute - Azure RBAC
description: Lists the permissions for the Azure resource providers in the Compute category.
ms.service: role-based-access-control
ms.topic: reference
author: rolyon
manager: amycolannino
ms.author: rolyon
ms.date: 04/25/2024
ms.custom: generated
---

# Azure permissions for Compute

This article lists the permissions for the Azure resource providers in the Compute category. You can use these permissions in your own [Azure custom roles](/azure/role-based-access-control/custom-roles) to provide granular access control to resources in Azure. Permission strings have the following format: `{Company}.{ProviderName}/{resourceType}/{action}`


## microsoft.app

Azure service: [Azure Container Apps](/azure/container-apps/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.app/register/action | Register microsoft.app resource provider for the subscription |
> | microsoft.app/unregister/action | Unregister microsoft.app resource provider for the subscription |
> | microsoft.app/getcustomdomainverificationid/action | Get Subscription Verification Id used for verifying custom domains |
> | microsoft.app/builders/write | Create or update a Builder |
> | microsoft.app/builders/read | Get a Builder |
> | microsoft.app/builders/delete | Delete a Builder |
> | microsoft.app/builders/patches/read | Get a Builder's Patch |
> | microsoft.app/builders/patches/delete | Delete a Builder's Patch |
> | microsoft.app/builders/patches/skip/action | Skip a Builder's Patch |
> | microsoft.app/builders/patches/apply/action | Apply a Builder's Patch |
> | microsoft.app/builds/write | Create or update a Build's build |
> | microsoft.app/builds/read | Get a Builder's Build |
> | microsoft.app/builds/delete | Delete a Managed Environment's Build |
> | microsoft.app/builds/listauthtoken/action | Gets the token used to connect to the build endpoints, such as source code upload or build log streaming. |
> | microsoft.app/connectedenvironments/join/action | Allows to create a Container App or Container Apps Job in a Connected Environment |
> | microsoft.app/containerapp/resiliencypolicies/read | Get App Resiliency Policy |
> | microsoft.app/containerapps/write | Create or update a Container App |
> | microsoft.app/containerapps/delete | Delete a Container App |
> | microsoft.app/containerapps/read | Get a Container App |
> | microsoft.app/containerapps/listsecrets/action | List secrets of a container app |
> | microsoft.app/containerapps/listcustomhostnameanalysis/action | List custom host name analysis result |
> | microsoft.app/containerapps/stop/action | Stop a Container App |
> | microsoft.app/containerapps/start/action | Start a Container App |
> | microsoft.app/containerapps/authtoken/action | Get Auth Token for Container App Dev APIs to get log stream, exec or port forward from a container. This operation will be deprecated. |
> | microsoft.app/containerapps/getauthtoken/action | Get Auth Token for Container App Dev APIs to get log stream, exec or port forward from a container. |
> | microsoft.app/containerapps/authconfigs/read | Get auth config of a container app |
> | microsoft.app/containerapps/authconfigs/write | Create or update auth config of a container app |
> | microsoft.app/containerapps/authconfigs/delete | Delete auth config of a container app |
> | microsoft.app/containerapps/detectors/read | Get detector of a container app |
> | microsoft.app/containerapps/privateendpointconnectionproxies/validate/action | Validate Container App Private Endpoint Connection Proxy |
> | microsoft.app/containerapps/privateendpointconnectionproxies/write | Create or Update Container App Private Endpoint Connection Proxy |
> | microsoft.app/containerapps/privateendpointconnectionproxies/read | Get Container App Private Endpoint Connection Proxy |
> | microsoft.app/containerapps/privateendpointconnectionproxies/delete | Delete Container App Private Endpoint Connection Proxy |
> | microsoft.app/containerapps/privateendpointconnections/write | Create or Update Container App Private Endpoint Connection |
> | microsoft.app/containerapps/privateendpointconnections/delete | Delete Container App Private Endpoint Connection |
> | microsoft.app/containerapps/privateendpointconnections/read | Get Container App Private Endpoint Connection |
> | microsoft.app/containerapps/privatelinkresources/read | Get Container App Private Link Resource |
> | microsoft.app/containerapps/resiliencypolicies/write | Create or Update App Resiliency Policy |
> | microsoft.app/containerapps/resiliencypolicies/delete | Delete App Resiliency Policy |
> | microsoft.app/containerapps/revisions/read | Get revision of a container app |
> | microsoft.app/containerapps/revisions/restart/action | Restart a container app revision |
> | microsoft.app/containerapps/revisions/activate/action | Activate a container app revision |
> | microsoft.app/containerapps/revisions/deactivate/action | Deactivate a container app revision |
> | microsoft.app/containerapps/revisions/replicas/read | Get replica of a container app revision |
> | microsoft.app/containerapps/sourcecontrols/write | Create or Update Container App Source Control Configuration |
> | microsoft.app/containerapps/sourcecontrols/read | Get Container App Source Control Configuration |
> | microsoft.app/containerapps/sourcecontrols/delete | Delete Container App Source Control Configuration |
> | microsoft.app/jobs/write | Create or update a Container Apps Job |
> | microsoft.app/jobs/delete | Delete a Container Apps Job |
> | microsoft.app/jobs/start/action | Start a Container Apps Job |
> | microsoft.app/jobs/stop/action | Stop multiple Container Apps Job executions |
> | microsoft.app/jobs/read | Get a Container Apps Job |
> | microsoft.app/jobs/listsecrets/action | List secrets of a container apps job |
> | microsoft.app/jobs/detectors/read | Get detector of a container apps job |
> | microsoft.app/jobs/execution/read | Get a single execution from a Container Apps Job |
> | microsoft.app/jobs/executions/read | Get a Container Apps Job's execution history |
> | microsoft.app/jobs/stop/execution/action | Stop a Container Apps Job's specific execution |
> | microsoft.app/jobs/stop/execution/backport/action | Stop a Container Apps Job's specific execution |
> | microsoft.app/locations/availablemanagedenvironmentsworkloadprofiletypes/read | Get Available Workload Profile Types in a Region |
> | microsoft.app/locations/billingmeters/read | Get Billing Meters in a Region |
> | microsoft.app/locations/containerappoperationresults/read | Get a Container App Long Running Operation Result |
> | microsoft.app/locations/containerappoperationstatuses/read | Get a Container App Long Running Operation Status |
> | microsoft.app/locations/containerappsjoboperationresults/read | Get a Container Apps Job Long Running Operation Result |
> | microsoft.app/locations/containerappsjoboperationstatuses/read | Get a Container Apps Job Long Running Operation Status |
> | microsoft.app/locations/managedcertificateoperationstatuses/read | Get a Managed Certificate Long Running Operation Result |
> | microsoft.app/locations/managedcertificateoperationstatuses/delete | Delete a Managed Certificate Long Running Operation Result |
> | microsoft.app/locations/managedenvironmentoperationresults/read | Get a Managed Environment Long Running Operation Result |
> | microsoft.app/locations/managedenvironmentoperationstatuses/read | Get a Managed Environment Long Running Operation Status |
> | microsoft.app/locations/operationresults/read | Get a Long Running Operation Result |
> | microsoft.app/locations/operationstatuses/read | Get a Long Running Operation Status |
> | microsoft.app/locations/sourcecontroloperationresults/read | Get Container App Source Control Long Running Operation Result |
> | microsoft.app/locations/sourcecontroloperationstatuses/read | Get a Container App Source Control Long Running Operation Status |
> | microsoft.app/locations/usages/read | Get Quota Usages in a Region |
> | microsoft.app/managedenvironments/join/action | Allows to create a Container App in a Managed Environment |
> | microsoft.app/managedenvironments/read | Get a Managed Environment |
> | microsoft.app/managedenvironments/write | Create or update a Managed Environment |
> | microsoft.app/managedenvironments/delete | Delete a Managed Environment |
> | microsoft.app/managedenvironments/getauthtoken/action | Get Auth Token for Managed Environment Dev APIs to get log stream, exec or port forward from a container |
> | microsoft.app/managedenvironments/checknameavailability/action | Check reource name availability for a Managed Environment |
> | microsoft.app/managedenvironments/certificates/write | Create or update a Managed Environment Certificate |
> | microsoft.app/managedenvironments/certificates/read | Get a Managed Environment's Certificate |
> | microsoft.app/managedenvironments/certificates/delete | Delete a Managed Environment's Certificate |
> | microsoft.app/managedenvironments/daprcomponents/write | Create or Update Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/read | Read Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/delete | Delete Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/listsecrets/action | List Secrets of a Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/daprsubscriptions/write | Create or Update Managed Environment Dapr PubSub Subscription |
> | microsoft.app/managedenvironments/daprcomponents/daprsubscriptions/read | Read Managed Environment Dapr PubSub Subscription |
> | microsoft.app/managedenvironments/daprcomponents/daprsubscriptions/delete | Delete Managed Environment Dapr PubSub Subscription |
> | microsoft.app/managedenvironments/daprcomponents/resiliencypolicies/write | Create or Update Managed Environment Dapr Component Resiliency Policy |
> | microsoft.app/managedenvironments/daprcomponents/resiliencypolicies/read | Read Managed Environment Dapr Component Resiliency Policy |
> | microsoft.app/managedenvironments/daprcomponents/resiliencypolicies/delete | Delete Managed Environment Dapr Component Resiliency Policy |
> | microsoft.app/managedenvironments/detectors/read | Get detector of a managed environment |
> | microsoft.app/managedenvironments/dotnetcomponents/read | Read Managed Environment .NET Component |
> | microsoft.app/managedenvironments/dotnetcomponents/write | Create or update Managed Environment .NET Component |
> | microsoft.app/managedenvironments/dotnetcomponents/delete | Delete Managed Environment .NET Component |
> | microsoft.app/managedenvironments/javacomponents/read | Read Managed Environment Java Component |
> | microsoft.app/managedenvironments/javacomponents/write | Create or update Managed Environment Java Component |
> | microsoft.app/managedenvironments/javacomponents/delete | Delete Managed Environment Java Component |
> | microsoft.app/managedenvironments/managedcertificates/write | Create or update a Managed Certificate in Managed Environment |
> | microsoft.app/managedenvironments/managedcertificates/read | Get a Managed Certificate in Managed Environment |
> | microsoft.app/managedenvironments/managedcertificates/delete | Delete a Managed Certificate in Managed Environment |
> | microsoft.app/managedenvironments/privateendpointconnectionproxies/validate/action | Validate Managed Environment Private Endpoint Connection Proxy |
> | microsoft.app/managedenvironments/privateendpointconnectionproxies/write | Create or Update Managed Environment Private Endpoint Connection Proxy |
> | microsoft.app/managedenvironments/privateendpointconnectionproxies/read | Get Managed Environment Private Endpoint Connection Proxy |
> | microsoft.app/managedenvironments/privateendpointconnectionproxies/delete | Delete Managed Environment Private Endpoint Connection Proxy |
> | microsoft.app/managedenvironments/privateendpointconnections/write | Create or Update Managed Environment Private Endpoint Connection |
> | microsoft.app/managedenvironments/privateendpointconnections/delete | Delete Managed Environment Private Endpoint Connection |
> | microsoft.app/managedenvironments/privateendpointconnections/read | Get Managed Environment Private Endpoint Connection |
> | microsoft.app/managedenvironments/privatelinkresources/read | Get Managed Environment Private Link Resource |
> | microsoft.app/managedenvironments/storages/read | Get storage for a Managed Environment. |
> | microsoft.app/managedenvironments/storages/write | Create or Update a storage of Managed Environment. |
> | microsoft.app/managedenvironments/storages/delete | Delete a storage of Managed Environment. |
> | microsoft.app/managedenvironments/usages/read | Get Quota Usages in a Managed Environment |
> | microsoft.app/managedenvironments/workloadprofilestates/read | Get Current Workload Profile States |
> | microsoft.app/microsoft.app/containerapps/builds/read | Get a ContainerApp's Build by Build name |
> | microsoft.app/microsoft.app/containerapps/builds/delete | Delete a Container App's Build |
> | microsoft.app/operations/read | Get a list of supported container app operations |
> | microsoft.app/sessionpools/write | Create or Update a Session Pool |
> | microsoft.app/sessionpools/read | Get a Session Pool |
> | microsoft.app/sessionpools/delete | Delete a Session Pool |
> | microsoft.app/sessionpools/sessions/generatesessions/action | Generate sessions |
> | microsoft.app/sessionpools/sessions/read | Get a Session |
> | **DataAction** | **Description** |
> | microsoft.app/sessionpools/interpreters/execute/action | Execute Code |

## Microsoft.AppPlatform

A fully managed Spring Cloud service, built and operated with Pivotal.

Azure service: [Azure Spring Apps](/azure/spring-apps/)

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
> | Microsoft.AppPlatform/Spring/enableApmGlobally/action | Enable APM globally for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/disableApmGlobally/action | Disable APM globally for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/listGloballyEnabledApms/action | List globally enabled APMs for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/read | Get the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/write | Create or update the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/delete | Delete the API portal for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/validateDomain/action | Validate the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/read | Get the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/write | Create or update the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apiPortals/domains/delete | Delete the API portal domain for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apms/read | Get the APM for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apms/write | Create or update the APM for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apms/delete | Delete the APM for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apms/listSecretKeys/action | List the secret keys for a specific Azure Spring Apps service instance APM |
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
> | Microsoft.AppPlatform/Spring/apps/validate/action | Validate the container registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/bindings/write | Create or update the binding for a specific application |
> | Microsoft.AppPlatform/Spring/apps/bindings/delete | Delete the binding for a specific application |
> | Microsoft.AppPlatform/Spring/apps/bindings/read | Get the bindings for a specific application |
> | Microsoft.AppPlatform/Spring/apps/connectorProps/read | Get the service connectors for a specific application |
> | Microsoft.AppPlatform/Spring/apps/connectorProps/write | Create or update the service connector for a specific application |
> | Microsoft.AppPlatform/Spring/apps/connectorProps/delete | Delete the service connector for a specific application |
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
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/read | Get the service connectors for a specific deployment |
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/write | Create or update the service connector for a specific deployment |
> | Microsoft.AppPlatform/Spring/apps/deployments/connectorProps/delete | Delete the service connector for a specific deployment |
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
> | Microsoft.AppPlatform/Spring/configurationServices/validateResource/action | Validate the resource for a specific Application Configuration Service |
> | Microsoft.AppPlatform/Spring/containerRegistries/read | Get the container registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/containerRegistries/write | Create or update the container registry for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/containerRegistries/delete | Delete the container registry for a specific Azure Spring Apps service instance |
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
> | Microsoft.AppPlatform/Spring/jobs/read | Get the job for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/write | Create or update the job for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/delete | Delete the job for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/start/action | Start the execution for a specific job |
> | Microsoft.AppPlatform/Spring/jobs/listEnvSecrets/action | List environment variables secret of the job for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/executions/read | Get the job execution for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/executions/cancel/action | Cancel the execution for a specific job |
> | Microsoft.AppPlatform/Spring/jobs/executions/listEnvSecrets/action | List environment variables secret of the job execution for a specific Azure Spring Apps service instance |
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
> | Microsoft.AppPlatform/Spring/supportedApmTypes/read | List the supported APM types for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/supportedServerVersions/read | List the supported server versions for a specific Azure Spring Apps service instance |
> | **DataAction** | **Description** |
> | Microsoft.AppPlatform/Spring/ApplicationConfigurationService/logstream/action | Read the streaming log of all subcomponents in Application Configuration Service from a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/ApplicationConfigurationService/read | Read the configuration content (for example, application-prod.yaml) pulled by Application Configuration Service for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/apps/deployments/remotedebugging/action | Remote debugging app instance for a specific application |
> | Microsoft.AppPlatform/Spring/apps/deployments/connect/action | Connect to an instance for a specific application |
> | Microsoft.AppPlatform/Spring/configService/read | Read the configuration content(for example, application.yaml) for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configService/write | Write config server content for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/configService/delete | Delete config server content for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/read | Read the user app(s) registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/write | Write the user app(s) registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/eurekaService/delete | Delete the user app registration information for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/executions/listInstances/action | List instances of a specific job execution for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/jobs/executions/logstream/action | Get the streaming log of job executions for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/logstreamService/read | Read the streaming log of user app for a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/managedComponents/logstream/action | Read the streaming log of all managed components (e.g. Application Configuration Service, Spring Cloud Gateway) from a specific Azure Spring Apps service instance |
> | Microsoft.AppPlatform/Spring/SpringCloudGateway/logstream/action | Read the streaming log of Spring Cloud Gateway from a specific Azure Spring Apps service instance |

## Microsoft.AVS

Azure service: [Azure VMware Solution](/azure/azure-vmware/introduction)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.AVS/register/action | Register Subscription for Microsoft.AVS resource provider. |
> | Microsoft.AVS/unregister/action | Unregister Subscription for Microsoft.AVS resource provider. |
> | Microsoft.AVS/checkNameAvailability/read | Checks if the privateCloud Name is available |
> | Microsoft.AVS/locations/checkNameAvailability/read | Checks if the privateCloud Name is available |
> | Microsoft.AVS/locations/checkQuotaAvailability/read | Checks if quota is available for the subscription |
> | Microsoft.AVS/locations/checkTrialAvailability/read | Checks if trial is available for the subscription |
> | Microsoft.AVS/operations/read | Lists operations available on Microsoft.AVS resource provider. |
> | Microsoft.AVS/privateClouds/register/action | Registers the Microsoft Microsoft.AVS resource provider and enables creation of Private Clouds. |
> | Microsoft.AVS/privateClouds/write | Creates or updates a PrivateCloud resource. |
> | Microsoft.AVS/privateClouds/read | Gets the settings for the specified PrivateCloud. |
> | Microsoft.AVS/privateClouds/delete | Delete a specific PrivateCloud. |
> | Microsoft.AVS/privateClouds/addOns/read | Read addOns. |
> | Microsoft.AVS/privateClouds/addOns/write | Write addOns. |
> | Microsoft.AVS/privateClouds/addOns/delete | Delete addOns. |
> | Microsoft.AVS/privateClouds/addOns/operationStatuses/read | Read addOns operationStatuses. |
> | Microsoft.AVS/privateClouds/authorizations/read | Gets the authorization settings for a PrivateCloud cluster. |
> | Microsoft.AVS/privateClouds/authorizations/write | Create or update a PrivateCloud authorization resource. |
> | Microsoft.AVS/privateClouds/authorizations/delete | Delete a specific PrivateCloud authorization. |
> | Microsoft.AVS/privateClouds/clusters/read | Gets the cluster settings for a PrivateCloud cluster. |
> | Microsoft.AVS/privateClouds/clusters/write | Create or update a PrivateCloud cluster resource. |
> | Microsoft.AVS/privateClouds/clusters/delete | Delete a specific PrivateCloud cluster. |
> | Microsoft.AVS/privateClouds/clusters/datastores/read | Get the datastore properties in a private cloud cluster. |
> | Microsoft.AVS/privateClouds/clusters/datastores/write | Create or update datastore in private cloud cluster. |
> | Microsoft.AVS/privateClouds/clusters/datastores/delete | Delete datastore in private cloud cluster. |
> | Microsoft.AVS/privateclouds/clusters/datastores/operationresults/read | Read privateClouds/clusters/datastores operationresults. |
> | Microsoft.AVS/privateClouds/clusters/datastores/operationstatuses/read | Read privateClouds/clusters/datastores operationstatuses. |
> | Microsoft.AVS/privateclouds/clusters/operationresults/read | Reads privateClouds/clusters operationresults. |
> | Microsoft.AVS/privateClouds/clusters/operationstatuses/read | Reads privateClouds/clusters operationstatuses. |
> | Microsoft.AVS/privateClouds/eventGridFilters/read | Notifies Microsoft.AVS that an EventGrid Subscription for AVS is being viewed |
> | Microsoft.AVS/privateClouds/eventGridFilters/write | Notifies Microsoft.AVS that a new EventGrid Subscription for AVS is being created |
> | Microsoft.AVS/privateClouds/eventGridFilters/delete | Notifies Microsoft.AVS that an EventGrid Subscription for AVS is being deleted |
> | Microsoft.AVS/privateClouds/globalReachConnections/delete | Delete globalReachConnections. |
> | Microsoft.AVS/privateClouds/globalReachConnections/write | Write globalReachConnections. |
> | Microsoft.AVS/privateClouds/globalReachConnections/read | Read globalReachConnections. |
> | Microsoft.AVS/privateClouds/globalReachConnections/operationStatuses/read | Read globalReachConnections operationStatuses. |
> | Microsoft.AVS/privateClouds/hcxEnterpriseSites/read | Gets the hcxEnterpriseSites for a PrivateCloud. |
> | Microsoft.AVS/privateClouds/hcxEnterpriseSites/write | Create or update a hcxEnterpriseSites. |
> | Microsoft.AVS/privateClouds/hcxEnterpriseSites/delete | Delete a specific hcxEnterpriseSites. |
> | Microsoft.AVS/privateClouds/hostInstances/read | Gets the hostInstances for a PrivateCloud. |
> | Microsoft.AVS/privateClouds/hostInstances/write | Create or update a hostInstances. |
> | Microsoft.AVS/privateClouds/hostInstances/delete | Delete a specific hostInstances. |
> | Microsoft.AVS/privateClouds/operationresults/read | Reads privateClouds operationresults. |
> | Microsoft.AVS/privateClouds/operationstatuses/read | Reads privateClouds operationstatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dhcpConfigurations/delete | Delete dhcpConfigurations. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dhcpConfigurations/write | Write dhcpConfigurations. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dhcpConfigurations/read | Read dhcpConfigurations. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dhcpConfigurations/operationStatuses/read | Read dhcpConfigurations operationStatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsServices/delete | Delete dnsServices. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsServices/write | Write dnsServices. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsServices/read | Read dnsServices. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsServices/operationStatuses/read | Read dnsServices operationStatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsZones/delete | Delete dnsZones. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsZones/write | Write dnsZones. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsZones/read | Read dnsZones. |
> | Microsoft.AVS/privateClouds/workloadNetworks/dnsZones/operationStatuses/read | Read dnsZones operationStatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/gateways/read | Read gateways. |
> | Microsoft.AVS/privateClouds/workloadNetworks/portMirroringProfiles/delete | Delete portMirroringProfiles. |
> | Microsoft.AVS/privateClouds/workloadNetworks/portMirroringProfiles/write | Write portMirroringProfiles. |
> | Microsoft.AVS/privateClouds/workloadNetworks/portMirroringProfiles/read | Read portMirroringProfiles. |
> | Microsoft.AVS/privateClouds/workloadNetworks/portMirroringProfiles/operationStatuses/read | Read portMirroringProfiles operationStatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/segments/delete | Delete segments. |
> | Microsoft.AVS/privateClouds/workloadNetworks/segments/write | Write segments. |
> | Microsoft.AVS/privateClouds/workloadNetworks/segments/read | Read segments. |
> | Microsoft.AVS/privateClouds/workloadNetworks/segments/operationStatuses/read | Read segments operationStatuses. |
> | Microsoft.AVS/privateClouds/workloadNetworks/virtualMachines/read | Read virtualMachines. |
> | Microsoft.AVS/privateClouds/workloadNetworks/vmGroups/delete | Delete vmGroups. |
> | Microsoft.AVS/privateClouds/workloadNetworks/vmGroups/write | Write vmGroups. |
> | Microsoft.AVS/privateClouds/workloadNetworks/vmGroups/read | Read vmGroups. |
> | Microsoft.AVS/privateClouds/workloadNetworks/vmGroups/operationStatuses/read | Read vmGroups operationStatuses. |
> | **DataAction** | **Description** |
> | Microsoft.AVS/privateClouds/listAdminCredentials/action | Lists the AdminCredentials for privateClouds. |
> | Microsoft.AVS/privateClouds/rotateVcenterPassword/action | Rotate Vcenter password for the PrivateCloud. |
> | Microsoft.AVS/privateClouds/rotateNsxtPassword/action | Rotate Nsxt CloudAdmin password for the PrivateCloud. |
> | Microsoft.AVS/privateClouds/rotateNsxtCloudAdminPassword/action | Rotate Nsxt CloudAdmin password for the PrivateCloud. |

## Microsoft.Batch

Cloud-scale job scheduling and compute management.

Azure service: [Batch](/azure/batch/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Batch/register/action | Registers the subscription for the Batch Resource Provider and enables the creation of Batch accounts |
> | Microsoft.Batch/unregister/action | Unregisters the subscription for the Batch Resource Provider preventing the creation of Batch accounts |
> | Microsoft.Batch/batchAccounts/read | Lists Batch accounts or gets the properties of a Batch account |
> | Microsoft.Batch/batchAccounts/write | Creates a new Batch account or updates an existing Batch account |
> | Microsoft.Batch/batchAccounts/delete | Deletes a Batch account |
> | Microsoft.Batch/batchAccounts/listkeys/action | Lists access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/regeneratekeys/action | Regenerates access keys for a Batch account |
> | Microsoft.Batch/batchAccounts/syncAutoStorageKeys/action | Synchronizes access keys for the auto storage account configured for a Batch account |
> | Microsoft.Batch/batchAccounts/joinPerimeter/action | Determines if the user is allowed to associate a Batch account with a Network Security Perimeter |
> | Microsoft.Batch/batchAccounts/applications/read | Lists applications or gets the properties of an application |
> | Microsoft.Batch/batchAccounts/applications/write | Creates a new application or updates an existing application |
> | Microsoft.Batch/batchAccounts/applications/delete | Deletes an application |
> | Microsoft.Batch/batchAccounts/applications/versions/read | Gets the properties of an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/write | Creates a new application package or updates an existing application package |
> | Microsoft.Batch/batchAccounts/applications/versions/delete | Deletes an application package |
> | Microsoft.Batch/batchAccounts/applications/versions/activate/action | Activates an application package |
> | Microsoft.Batch/batchAccounts/certificateOperationResults/read | Gets the results of a long running certificate operation on a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/read | Lists certificates on a Batch account or gets the properties of a certificate |
> | Microsoft.Batch/batchAccounts/certificates/write | Creates a new certificate on a Batch account or updates an existing certificate |
> | Microsoft.Batch/batchAccounts/certificates/delete | Deletes a certificate from a Batch account |
> | Microsoft.Batch/batchAccounts/certificates/cancelDelete/action | Cancels the failed deletion of a certificate on a Batch account |
> | Microsoft.Batch/batchAccounts/detectors/read | Gets AppLens Detector or Lists AppLens Detectors on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterAssociationProxies/read | Gets or lists the NSP association proxies on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterAssociationProxies/write | Creates or updates the NSP association proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterAssociationProxies/delete | Deletes the NSP association proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterConfigurationOperationResults/read | Gets the results of a long running NSP configuration operation on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterConfigurations/read | Gets or lists the NSP association configurations on a Batch account |
> | Microsoft.Batch/batchAccounts/networkSecurityPerimeterConfigurations/reconcile/action | Reconciles the NSP association on a Batch account to sync up with the latest configuration from the NSP control plane |
> | Microsoft.Batch/batchAccounts/operationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/batchAccounts/outboundNetworkDependenciesEndpoints/read | Lists the outbound network dependency endpoints for a Batch account |
> | Microsoft.Batch/batchAccounts/poolOperationResults/read | Gets the results of a long running pool operation on a Batch account |
> | Microsoft.Batch/batchAccounts/pools/read | Lists pools on a Batch account or gets the properties of a pool |
> | Microsoft.Batch/batchAccounts/pools/write | Creates a new pool on a Batch account or updates an existing pool |
> | Microsoft.Batch/batchAccounts/pools/delete | Deletes a pool from a Batch account |
> | Microsoft.Batch/batchAccounts/pools/stopResize/action | Stops an ongoing resize operation on a Batch account pool |
> | Microsoft.Batch/batchAccounts/pools/disableAutoscale/action | Disables automatic scaling for a Batch account pool |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/validate/action | Validates a Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/write | Create a new Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/read | Gets Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxies/delete | Delete a Private endpoint connection proxy on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionProxyResults/read | Gets the results of a long running Batch account private endpoint connection proxy operation |
> | Microsoft.Batch/batchAccounts/privateEndpointConnectionResults/read | Gets the results of a long running Batch account private endpoint connection operation |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/write | Update an existing Private endpoint connection on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/read | Gets Private endpoint connection or Lists Private endpoint connections on a Batch account |
> | Microsoft.Batch/batchAccounts/privateEndpointConnections/delete | Delete a Private endpoint connection on a Batch account |
> | Microsoft.Batch/batchAccounts/privateLinkResources/read | Gets the properties of a Private link resource or Lists Private link resources on a Batch account |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the resource |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the resource |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for the Batch service |
> | Microsoft.Batch/batchAccounts/providers/Microsoft.Insights/metricDefinitions/read | Gets the available metrics for the Batch service |
> | Microsoft.Batch/deployments/preflight/action | Runs Preflight validation for resources included in the request |
> | Microsoft.Batch/locations/checkNameAvailability/action | Checks that the account name is valid and not in use. |
> | Microsoft.Batch/locations/notifyNetworkSecurityPerimeterUpdatesAvailable/action | Notifies the NSP updates available at the given location |
> | Microsoft.Batch/locations/accountOperationResults/read | Gets the results of a long running Batch account operation |
> | Microsoft.Batch/locations/cloudServiceSkus/read | Lists available Batch supported Cloud Service VM sizes at the given location |
> | Microsoft.Batch/locations/quotas/read | Gets Batch quotas of the specified subscription at the specified Azure region |
> | Microsoft.Batch/locations/virtualMachineSkus/read | Lists available Batch supported Virtual Machine VM sizes at the given location |
> | Microsoft.Batch/operations/read | Lists operations available on Microsoft.Batch resource provider |
> | **DataAction** | **Description** |
> | Microsoft.Batch/batchAccounts/jobs/read | Lists jobs on a Batch account or gets the properties of a job |
> | Microsoft.Batch/batchAccounts/jobs/write | Creates a new job on a Batch account or updates an existing job |
> | Microsoft.Batch/batchAccounts/jobs/delete | Deletes a job from a Batch account |
> | Microsoft.Batch/batchAccounts/jobSchedules/read | Lists job schedules on a Batch account or gets the properties of a job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/write | Creates a new job schedule on a Batch account or updates an existing job schedule |
> | Microsoft.Batch/batchAccounts/jobSchedules/delete | Deletes a job schedule from a Batch account |

## Microsoft.ClassicCompute

Azure service: Classic deployment model virtual machine

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicCompute/register/action | Register to Classic Compute |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/action | Checks the availability of a given domain name. |
> | Microsoft.ClassicCompute/moveSubscriptionResources/action | Move all classic resources to a different subscription. |
> | Microsoft.ClassicCompute/validateSubscriptionMoveAvailability/action | Validate the subscription's availability for classic move operation. |
> | Microsoft.ClassicCompute/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/read | Gets the availability of a given domain name. |
> | Microsoft.ClassicCompute/domainNames/read | Return the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/write | Add or modify the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/delete | Remove the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/swap/action | Swaps the staging slot to the production slot. |
> | Microsoft.ClassicCompute/domainNames/active/write | Sets the active domain name. |
> | Microsoft.ClassicCompute/domainNames/availabilitySets/read | Show the availability set for the resource. |
> | Microsoft.ClassicCompute/domainNames/capabilities/read | Shows the domain name capabilities |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/read | Get role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/roleinstances/read | Get role instance for role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/read | Get the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/write | Add the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/read | Get upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/write | Update upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/extensions/read | Returns the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/write | Add the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/delete | Remove the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/read | Gets the internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/write | Creates a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/delete | Remove a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/operationStatuses/read | Reads the operation status for the domain names internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/read | Get the load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/write | Add the load balanced endpoint set. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/operationStatuses/read | Reads the operation status for the domain names load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/operationstatuses/read | Get operation status of the domain name. |
> | Microsoft.ClassicCompute/domainNames/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/read | Returns the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/write | Add or modify the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/delete | Delete the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/operationStatuses/read | Reads the operation status for the domain names service certificates. |
> | Microsoft.ClassicCompute/domainNames/slots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/slots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/slots/delete | Deletes a given deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/start/action | Starts a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/stop/action | Suspends the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/validateMigration/action | Validates migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/prepareMigration/action | Prepares migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/commitMigration/action | Commits migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/abortMigration/action | Aborts migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/operationStatuses/read | Reads the operation status for the domain names slots. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/read | Get the role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/write | Add role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/read | Returns the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/write | Add or modify the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/delete | Remove the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/operationStatuses/read | Reads the operation status for the domain names slots roles extension references. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metricdefinitions/read | Get the role metric definition for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metrics/read | Get role metric for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/operationstatuses/read | Get the operation status for the domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/downloadremotedesktopconnectionfile/action | Downloads remote desktop connection file for the role instance on the domain name slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/read | Get the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/restart/action | Restarts role instances. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/reimage/action | Reimages the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/rebuild/action | Rebuilds the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/operationStatuses/read | Gets the operation status for the role instance on domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/skus/read | Get role sku for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/state/start/write | Changes the deployment slot state to stopped. |
> | Microsoft.ClassicCompute/domainNames/slots/state/stop/write | Changes the deployment slot state to started. |
> | Microsoft.ClassicCompute/domainNames/slots/upgradeDomain/write | Walk upgrade the domain. |
> | Microsoft.ClassicCompute/operatingSystemFamilies/read | Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family. |
> | Microsoft.ClassicCompute/operatingSystems/read | Lists the versions of the guest operating system that are currently available in Microsoft Azure. |
> | Microsoft.ClassicCompute/operations/read | Gets the list of operations. |
> | Microsoft.ClassicCompute/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicCompute/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicCompute/resourceTypes/skus/read | Gets the Sku list for supported resource types. |
> | Microsoft.ClassicCompute/virtualMachines/read | Retrieves list of virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/write | Add or modify virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/delete | Removes virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/capture/action | Capture a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/start/action | Start the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/redeploy/action | Redeploys the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/performMaintenance/action | Performs maintenance on the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/restart/action | Restarts virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/stop/action | Stops the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/shutdown/action | Shutdown the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/attachDisk/action | Attaches a data disk to a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/detachDisk/action | Detaches a data disk from virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/downloadRemoteDesktopConnectionFile/action | Downloads the RDP file for virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/read | Gets the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/write | Adds a network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/asyncOperations/read | Gets the possible async operations |
> | Microsoft.ClassicCompute/virtualMachines/diagnosticsettings/read | Get virtual machine diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/disks/read | Retrieves list of data disks |
> | Microsoft.ClassicCompute/virtualMachines/extensions/read | Gets the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/write | Puts the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/operationStatuses/read | Reads the operation status for the virtual machines extensions. |
> | Microsoft.ClassicCompute/virtualMachines/metricdefinitions/read | Get the virtual machine metric definition. |
> | Microsoft.ClassicCompute/virtualMachines/metrics/read | Gets the metrics. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read | Gets the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write | Adds a network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/operationStatuses/read | Reads the operation status for the virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |

## Microsoft.Compute

Access cloud compute capacity and scale on demand (such as virtual machines) and only pay for the resources you use.

Azure service: [Virtual Machines](/azure/virtual-machines/), [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Compute/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/unregister/action | Unregisters Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
> | Microsoft.Compute/availabilitySets/write | Creates a new availability set or updates an existing one |
> | Microsoft.Compute/availabilitySets/delete | Deletes the availability set |
> | Microsoft.Compute/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | Microsoft.Compute/capacityReservationGroups/read | Get the properties of a capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/write | Creates a new capacity reservation group or updates an existing capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/delete | Deletes the capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/deploy/action | Deploy a new VM/VMSS using Capacity Reservation Group |
> | Microsoft.Compute/capacityReservationGroups/share/action | Share the Capacity Reservation Group with one or more Subscriptionss |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/read | Get the properties of a capacity reservation |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/write | Creates a new capacity reservation or updates an existing capacity reservation |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/delete | Deletes the capacity reservation |
> | Microsoft.Compute/cloudServices/read | Get the properties of a CloudService. |
> | Microsoft.Compute/cloudServices/write | Created a new CloudService or Update an existing one. |
> | Microsoft.Compute/cloudServices/delete | Deletes the CloudService. |
> | Microsoft.Compute/cloudServices/poweroff/action | Power off the CloudService. |
> | Microsoft.Compute/cloudServices/start/action | Starts the CloudService. |
> | Microsoft.Compute/cloudServices/restart/action | Restarts one or more role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/reimage/action | Rebuilds all the disks in the role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/rebuild/action | Reimage all the  role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/delete/action | Deletes role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/instanceView/read | Gets the status of a CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the CloudService metrics definition |
> | Microsoft.Compute/cloudServices/roleInstances/delete | Deletes a RoleInstance from CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/read | Gets a RoleInstance from CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/restart/action | Restart a role instance of a CloudService |
> | Microsoft.Compute/cloudServices/roleInstances/reimage/action | Reimage a role instance of a CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/rebuild/action | Rebuild all the disks in a CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/instanceView/read | Gets the status of a role instance from a CloudService. |
> | Microsoft.Compute/cloudServices/roles/read | Gets a role from a CloudService. |
> | Microsoft.Compute/cloudServices/roles/write | Scale instances in a Role |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the CloudService Roles. |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the CloudService Roles |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the CloudService Roles Metric Definitions |
> | Microsoft.Compute/cloudServices/updateDomains/read | Gets a list of all update domains in a CloudService. |
> | Microsoft.Compute/diskAccesses/read | Get the properties of DiskAccess resource |
> | Microsoft.Compute/diskAccesses/write | Create a new DiskAccess resource or update an existing one |
> | Microsoft.Compute/diskAccesses/delete | Delete a DiskAccess resource |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionsApproval/action | Auto Approve a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/read | Get the properties of a private endpoint connection proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/write | Create a new Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy object |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/read | Get a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/write | Approve or Reject a Private Endpoint Connection |
> | Microsoft.Compute/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | Microsoft.Compute/diskEncryptionSets/write | Create a new disk encryption set or update an existing one |
> | Microsoft.Compute/diskEncryptionSets/delete | Delete a disk encryption set |
> | Microsoft.Compute/disks/read | Get the properties of a Disk |
> | Microsoft.Compute/disks/write | Creates a new Disk or updates an existing one |
> | Microsoft.Compute/disks/delete | Deletes the Disk |
> | Microsoft.Compute/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
> | Microsoft.Compute/disks/endGetAccess/action | Revoke the SAS URI of the Disk |
> | Microsoft.Compute/galleries/read | Gets the properties of Gallery |
> | Microsoft.Compute/galleries/write | Creates a new Gallery or updates an existing one |
> | Microsoft.Compute/galleries/delete | Deletes the Gallery |
> | Microsoft.Compute/galleries/share/action | Shares a Gallery to different scopes |
> | Microsoft.Compute/galleries/applications/read | Gets the properties of Gallery Application |
> | Microsoft.Compute/galleries/applications/write | Creates a new Gallery Application or updates an existing one |
> | Microsoft.Compute/galleries/applications/delete | Deletes the Gallery Application |
> | Microsoft.Compute/galleries/applications/versions/read | Gets the properties of Gallery Application Version |
> | Microsoft.Compute/galleries/applications/versions/write | Creates a new Gallery Application Version or updates an existing one |
> | Microsoft.Compute/galleries/applications/versions/delete | Deletes the Gallery Application Version |
> | Microsoft.Compute/galleries/images/read | Gets the properties of Gallery Image |
> | Microsoft.Compute/galleries/images/write | Creates a new Gallery Image or updates an existing one |
> | Microsoft.Compute/galleries/images/delete | Deletes the Gallery Image |
> | Microsoft.Compute/galleries/images/versions/read | Gets the properties of Gallery Image Version |
> | Microsoft.Compute/galleries/images/versions/write | Creates a new Gallery Image Version or updates an existing one |
> | Microsoft.Compute/galleries/images/versions/delete | Deletes the Gallery Image Version |
> | Microsoft.Compute/galleries/serviceArtifacts/read | Gets the properties of Gallery Service Artifact |
> | Microsoft.Compute/galleries/serviceArtifacts/write | Creates a new Gallery Service Artifact or updates an existing one |
> | Microsoft.Compute/galleries/serviceArtifacts/delete | Deletes the Gallery Service Artifact |
> | Microsoft.Compute/hostGroups/read | Get the properties of a host group |
> | Microsoft.Compute/hostGroups/write | Creates a new host group or updates an existing host group |
> | Microsoft.Compute/hostGroups/delete | Deletes the host group |
> | Microsoft.Compute/hostGroups/hosts/read | Get the properties of a host |
> | Microsoft.Compute/hostGroups/hosts/write | Creates a new host or updates an existing host |
> | Microsoft.Compute/hostGroups/hosts/delete | Deletes the host |
> | Microsoft.Compute/hostGroups/hosts/hostSizes/read | Lists available sizes the host can be updated to. NOTE: The dedicated host sizes provided can be used to only scale up the existing dedicated host. |
> | Microsoft.Compute/images/read | Get the properties of the Image |
> | Microsoft.Compute/images/write | Creates a new Image or updates an existing one |
> | Microsoft.Compute/images/delete | Deletes the image |
> | Microsoft.Compute/locations/capsOperations/read | Gets the status of an asynchronous Caps operation |
> | Microsoft.Compute/locations/cloudServiceOsFamilies/read | Read any guest OS Family that can be specified in the XML service configuration (.cscfg) for a Cloud Service. |
> | Microsoft.Compute/locations/cloudServiceOsVersions/read | Read any guest OS Version that can be specified in the XML service configuration (.cscfg) for a Cloud Service. |
> | Microsoft.Compute/locations/communityGalleries/read | Get the properties of a Community Gallery |
> | Microsoft.Compute/locations/communityGalleries/images/read | Get the properties of a Community Gallery Image |
> | Microsoft.Compute/locations/communityGalleries/images/versions/read | Get the properties of a Community Gallery Image Version |
> | Microsoft.Compute/locations/diagnosticOperations/read | Gets status of a Compute Diagnostic operation |
> | Microsoft.Compute/locations/diagnostics/diskInspection/action | Create a request for executing DiskInspection Diagnostic |
> | Microsoft.Compute/locations/diagnostics/read | Gets the properties of all available Compute Disgnostics |
> | Microsoft.Compute/locations/diagnostics/diskInspection/read | Gets the properties of DiskInspection Diagnostic |
> | Microsoft.Compute/locations/diskOperations/read | Gets the status of an asynchronous Disk operation |
> | Microsoft.Compute/locations/edgeZones/publishers/read | Get the properties of a Publisher in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version in an edge zone |
> | Microsoft.Compute/locations/logAnalytics/getRequestRateByInterval/action | Create logs to show total requests by time interval to aid throttling diagnostics. |
> | Microsoft.Compute/locations/logAnalytics/getThrottledRequests/action | Create logs to show aggregates of throttled requests grouped by ResourceName, OperationName, or the applied Throttle Policy. |
> | Microsoft.Compute/locations/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Get the status of asynchronous Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyOperationResults/read | Get the results of Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/publishers/read | Get the properties of a Publisher |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/read | Get the properties of a VMExtension Type |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/versions/read | Get the properties of a VMExtension Version |
> | Microsoft.Compute/locations/runCommands/read | Lists available run commands in location |
> | Microsoft.Compute/locations/sharedGalleries/read | Get the properties of a Shared Gallery |
> | Microsoft.Compute/locations/sharedGalleries/images/read | Get the properties of a Shared Gallery Image |
> | Microsoft.Compute/locations/sharedGalleries/images/versions/read | Get the properties of a Shared Gallery Image Version |
> | Microsoft.Compute/locations/usages/read | Gets service limits and current usage quantities for the subscription's compute resources in a location |
> | Microsoft.Compute/locations/vmSizes/read | Lists available virtual machine sizes in a location |
> | Microsoft.Compute/locations/vsmOperations/read | Gets the status of an asynchronous operation for Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/operations/read | Lists operations available on Microsoft.Compute resource provider |
> | Microsoft.Compute/proximityPlacementGroups/read | Get the Properties of a Proximity Placement Group |
> | Microsoft.Compute/proximityPlacementGroups/write | Creates a new Proximity Placement Group or updates an existing one |
> | Microsoft.Compute/proximityPlacementGroups/delete | Deletes the Proximity Placement Group |
> | Microsoft.Compute/restorePointCollections/read | Get the properties of a restore point collection |
> | Microsoft.Compute/restorePointCollections/write | Creates a new restore point collection or updates an existing one |
> | Microsoft.Compute/restorePointCollections/delete | Deletes the restore point collection and contained restore points |
> | Microsoft.Compute/restorePointCollections/restorePoints/read | Get the properties of a restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/write | Creates a new restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/delete | Deletes the restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/retrieveSasUris/action | Get the properties of a restore point along with blob SAS URIs |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/read | Get the properties of an incremental DiskRestorePoint |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/beginGetAccess/action | Get the SAS URI of the incremental DiskRestorePoint |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/endGetAccess/action | Revoke the SAS URI of the incremental DiskRestorePoint |
> | Microsoft.Compute/sharedVMExtensions/read | Gets the properties of Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/write | Creates a new Shared VM Extension or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/delete | Deletes the Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/versions/read | Gets the properties of Shared VM Extension Version |
> | Microsoft.Compute/sharedVMExtensions/versions/write | Creates a new Shared VM Extension Version or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/versions/delete | Deletes the Shared VM Extension Version |
> | Microsoft.Compute/sharedVMImages/read | Get the properties of a SharedVMImage |
> | Microsoft.Compute/sharedVMImages/write | Creates a new SharedVMImage or updates an existing one |
> | Microsoft.Compute/sharedVMImages/delete | Deletes the SharedVMImage |
> | Microsoft.Compute/sharedVMImages/versions/read | Get the properties of a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/write | Create a new SharedVMImageVersion or update an existing one |
> | Microsoft.Compute/sharedVMImages/versions/delete | Delete a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/replicate/action | Replicate a SharedVMImageVersion to target regions |
> | Microsoft.Compute/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | Microsoft.Compute/snapshots/read | Get the properties of a Snapshot |
> | Microsoft.Compute/snapshots/write | Create a new Snapshot or update an existing one |
> | Microsoft.Compute/snapshots/delete | Delete a Snapshot |
> | Microsoft.Compute/snapshots/beginGetAccess/action | Get the SAS URI of the Snapshot for blob access |
> | Microsoft.Compute/snapshots/endGetAccess/action | Revoke the SAS URI of the Snapshot |
> | Microsoft.Compute/sshPublicKeys/read | Get the properties of an SSH public key |
> | Microsoft.Compute/sshPublicKeys/write | Creates a new SSH public key or updates an existing SSH public key |
> | Microsoft.Compute/sshPublicKeys/delete | Deletes the SSH public key |
> | Microsoft.Compute/sshPublicKeys/generateKeyPair/action | Generates a new SSH public/private key pair |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | Microsoft.Compute/virtualMachines/delete | Deletes the virtual machine |
> | Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
> | Microsoft.Compute/virtualMachines/powerOff/action | Powers off the virtual machine. Note that the virtual machine will continue to be billed. |
> | Microsoft.Compute/virtualMachines/reapply/action | Reapplies a virtual machine's current model |
> | Microsoft.Compute/virtualMachines/redeploy/action | Redeploys virtual machine |
> | Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
> | Microsoft.Compute/virtualMachines/retrieveBootDiagnosticsData/action | Retrieves boot diagnostic logs blob URIs |
> | Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | Microsoft.Compute/virtualMachines/generalize/action | Sets the virtual machine state to Generalized and prepares the virtual machine for capture |
> | Microsoft.Compute/virtualMachines/capture/action | Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines |
> | Microsoft.Compute/virtualMachines/runCommand/action | Executes a predefined script on the virtual machine |
> | Microsoft.Compute/virtualMachines/convertToManagedDisks/action | Converts the blob based disks of the virtual machine to managed disks |
> | Microsoft.Compute/virtualMachines/performMaintenance/action | Performs Maintenance Operation on the VM. |
> | Microsoft.Compute/virtualMachines/reimage/action | Reimages virtual machine which is using differencing disk. |
> | Microsoft.Compute/virtualMachines/installPatches/action | Installs available OS update patches on the virtual machine based on parameters provided by user. Assessment results containing list of available patches will also get refreshed as part of this. |
> | Microsoft.Compute/virtualMachines/assessPatches/action | Assesses the virtual machine and finds list of available OS update patches for it. |
> | Microsoft.Compute/virtualMachines/cancelPatchInstallation/action | Cancels the ongoing install OS update patch operation on the virtual machine. |
> | Microsoft.Compute/virtualMachines/simulateEviction/action | Simulates the eviction of spot Virtual Machine |
> | Microsoft.Compute/virtualMachines/osUpgradeInternal/action | Perform OS Upgrade on Virtual Machine belonging to Virtual Machine Scale Set with Flexible Orchestration Mode. |
> | Microsoft.Compute/virtualMachines/rollbackOSDisk/action | Rollback OSDisk on Virtual Machine after failed OS Upgrade invoked by Virtual Machine Scale Set with Flexible Orchestration Mode. |
> | Microsoft.Compute/virtualMachines/deletePreservedOSDisk/action | Deletes PreservedOSDisk on the Virtual Machine which belongs to Virtual Machine Scale Set with Flexible Orchestration Mode. |
> | Microsoft.Compute/virtualMachines/upgradeVMAgent/action | Upgrade version of VM Agent on Virtual Machine |
> | Microsoft.Compute/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
> | Microsoft.Compute/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | Microsoft.Compute/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/read | Retrieves the summary of the latest patch assessment operation |
> | Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/softwarePatches/read | Retrieves list of patches assessed during the last patch assessment operation |
> | Microsoft.Compute/virtualMachines/patchInstallationResults/read | Retrieves the summary of the latest patch installation operation |
> | Microsoft.Compute/virtualMachines/patchInstallationResults/softwarePatches/read | Retrieves list of patches attempted to be installed during the last patch installation operation |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine Metric Definitions |
> | Microsoft.Compute/virtualMachines/runCommands/read | Get the properties of a virtual machine run command |
> | Microsoft.Compute/virtualMachines/runCommands/write | Creates a new virtual machine run command or updates an existing one |
> | Microsoft.Compute/virtualMachines/runCommands/delete | Deletes the virtual machine run command |
> | Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | Microsoft.Compute/virtualMachineScaleSets/read | Get the properties of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/write | Creates a new Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/delete | Deletes the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/delete/action | Deletes the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/start/action | Starts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/powerOff/action | Powers off the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reapply/action | Reapply the Virtual Machine Scale Set Virtual Machine Profile to the Virtual Machine Instances |
> | Microsoft.Compute/virtualMachineScaleSets/restart/action | Restarts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/deallocate/action | Powers off and releases the compute resources for the instances of the Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/manualUpgrade/action | Manually updates instances to latest model of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimage/action | Reimages the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for the instances of a Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/approveRollingUpgrade/action | Approves deferred rolling upgrades for the instances of a Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/redeploy/action | Redeploy the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/performMaintenance/action | Performs planned maintenance on the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/scale/action | Verify if an existing Virtual Machine Scale Set can Scale In/Scale Out to specified instance count |
> | Microsoft.Compute/virtualMachineScaleSets/forceRecoveryServiceFabricPlatformUpdateDomainWalk/action | Manually walk the platform update domains of a service fabric Virtual Machine Scale Set to finish a pending update that is stuck |
> | Microsoft.Compute/virtualMachineScaleSets/osRollingUpgrade/action | Starts a rolling upgrade to move all Virtual Machine Scale Set instances to the latest available Platform Image OS version. |
> | Microsoft.Compute/virtualMachineScaleSets/setOrchestrationServiceState/action | Sets the state of an orchestration service based on the action provided in operation input. |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/action | Cancels the rolling upgrade of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/disks/beginGetAccess/action | Get the SAS URI of VirtualMachineScaleSets Disk |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/read | Gets the properties of a Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/write | Creates a new Virtual Machine Scale Set Extension or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/delete | Deletes the Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/read | Gets the properties of a Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/write | Updates the properties of an existing Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/instanceView/read | Gets the instance view of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read | Get properties of all network interfaces of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read | Gets the history of OS upgrades for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Virtual Machine Scale set. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Virtual Machine Scale Sets. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine Scale Set Metric Definitions |
> | Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read | Get properties of all public IP addresses of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read | Get latest Rolling Upgrade status for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/skus/read | Lists the valid SKUs for an existing Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read | Retrieves the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/write | Updates the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete | Delete a specific Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/start/action | Starts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/powerOff/action | Powers Off a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/restart/action | Restarts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/deallocate/action | Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimage/action | Reimages a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/approveRollingUpgrade/action | Approves deferred rolling upgrade for Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/redeploy/action | Redeploys a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/retrieveBootDiagnosticsData/action | Retrieves boot diagnostic logs blob URIs of Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/performMaintenance/action | Performs planned maintenance on a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommand/action | Executes a predefined script on a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/simulateEviction/action | Simulates the eviction of spot Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/read | Get the properties of an extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/write | Creates a new extension for Virtual Machine in Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/delete | Deletes the extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read | Retrieves the instance view of a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read | Get properties of one or all network interfaces of a virtual machine created using Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read | Get properties of one or all IP configurations of a network interface created using Virtual Machine Scale Set. IP configurations represent private IPs |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read | Get properties of public IP address created using Virtual Machine Scale Set. Virtual Machine Scale Set can create at most one public IP per ipconfiguration (private IP) |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine in Scale Set Metric Definitions |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/read | Get the properties of a run command for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/write | Creates a new run command for Virtual Machine in Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/delete | Deletes the run command for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/vmSizes/read | List available sizes for creating or updating a virtual machine in the Virtual Machine Scale Set |
> | **DataAction** | **Description** |
> | Microsoft.Compute/disks/download/action | Perform read data operations on Disk SAS Uri |
> | Microsoft.Compute/disks/upload/action | Perform write data operations on Disk SAS Uri |
> | Microsoft.Compute/snapshots/download/action | Perform read data operations on Snapshot SAS Uri |
> | Microsoft.Compute/snapshots/upload/action | Perform write data operations on Snapshot SAS Uri |
> | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | Microsoft.Compute/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |
> | Microsoft.Compute/virtualMachines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator |

## Microsoft.DesktopVirtualization

The best virtual desktop experience, delivered on Azure.

Azure service: [Azure Virtual Desktop](/azure/virtual-desktop/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.DesktopVirtualization/unregister/action | Action on unregister |
> | Microsoft.DesktopVirtualization/register/action | Register subscription |
> | Microsoft.DesktopVirtualization/appattachpackages/read | Read appattachpackages |
> | Microsoft.DesktopVirtualization/appattachpackages/write | Write appattachpackages |
> | Microsoft.DesktopVirtualization/appattachpackages/delete | Delete appattachpackages |
> | Microsoft.DesktopVirtualization/appattachpackages/move/action | Move appattachpackages to another ResourceGroup or Subscription |
> | Microsoft.DesktopVirtualization/appattachpackages/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting |
> | Microsoft.DesktopVirtualization/appattachpackages/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting |
> | Microsoft.DesktopVirtualization/appattachpackages/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs |
> | Microsoft.DesktopVirtualization/applicationgroups/read | Read applicationgroups |
> | Microsoft.DesktopVirtualization/applicationgroups/write | Write applicationgroups |
> | Microsoft.DesktopVirtualization/applicationgroups/delete | Delete applicationgroups |
> | Microsoft.DesktopVirtualization/applicationgroups/move/action | Move a applicationgroups to another resource group |
> | Microsoft.DesktopVirtualization/applicationgroups/applications/read | Read applicationgroups/applications |
> | Microsoft.DesktopVirtualization/applicationgroups/applications/write | Write applicationgroups/applications |
> | Microsoft.DesktopVirtualization/applicationgroups/applications/delete | Delete applicationgroups/applications |
> | Microsoft.DesktopVirtualization/applicationgroups/desktops/read | Read applicationgroups/desktops |
> | Microsoft.DesktopVirtualization/applicationgroups/desktops/write | Write applicationgroups/desktops |
> | Microsoft.DesktopVirtualization/applicationgroups/desktops/delete | Delete applicationgroups/desktops |
> | Microsoft.DesktopVirtualization/applicationgroups/externaluserassignments/read |  |
> | Microsoft.DesktopVirtualization/applicationgroups/externaluserassignments/write |  |
> | Microsoft.DesktopVirtualization/applicationgroups/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting |
> | Microsoft.DesktopVirtualization/applicationgroups/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting |
> | Microsoft.DesktopVirtualization/applicationgroups/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs |
> | Microsoft.DesktopVirtualization/applicationgroups/startmenuitems/read | Read start menu items |
> | Microsoft.DesktopVirtualization/connectionPolicies/read | Read the connectionPolicies. |
> | Microsoft.DesktopVirtualization/connectionPolicies/write | Update the connectionPolicies to save changes. |
> | Microsoft.DesktopVirtualization/hostpools/read | Read hostpools |
> | Microsoft.DesktopVirtualization/hostpools/write | Write hostpools |
> | Microsoft.DesktopVirtualization/hostpools/delete | Delete hostpools |
> | Microsoft.DesktopVirtualization/hostpools/controlUpdate/action |  |
> | Microsoft.DesktopVirtualization/hostpools/update/action | Action on update |
> | Microsoft.DesktopVirtualization/hostpools/retrieveRegistrationToken/action | Retrieve registration token for host pool |
> | Microsoft.DesktopVirtualization/hostpools/move/action | Move a hostpools to another resource group |
> | Microsoft.DesktopVirtualization/hostpools/expandmsiximage/action | Expand an expandmsiximage to see MSIX Packages present |
> | Microsoft.DesktopVirtualization/hostpools/doNotUseInternalAPI/action | Internal operation that is not meant to be called by customers. This will be removed in a future version. Do not use it. |
> | Microsoft.DesktopVirtualization/hostpools/activeSessionhostconfigurations/read | Read the activeSessionhostconfigurations to see configurations present. |
> | Microsoft.DesktopVirtualization/hostpools/msixpackages/read | Read hostpools/msixpackages |
> | Microsoft.DesktopVirtualization/hostpools/msixpackages/write | Write hostpools/msixpackages |
> | Microsoft.DesktopVirtualization/hostpools/msixpackages/delete | Delete hostpools/msixpackages |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnectionproxies/read | Read hostpools/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnectionproxies/write | Write hostpools/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnectionproxies/delete | Delete hostpools/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnectionproxies/validate/action | Validates the private endpoint connection proxy |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnectionproxies/operationresults/read | Gets operation result on private endpoint connection proxy |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnections/read | Read hostpools/privateendpointconnections |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnections/write | Write hostpools/privateendpointconnections |
> | Microsoft.DesktopVirtualization/hostpools/privateendpointconnections/delete | Delete hostpools/privateendpointconnections |
> | Microsoft.DesktopVirtualization/hostpools/privatelinkresources/read | Read privatelinkresources |
> | Microsoft.DesktopVirtualization/hostpools/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting |
> | Microsoft.DesktopVirtualization/hostpools/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting |
> | Microsoft.DesktopVirtualization/hostpools/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs |
> | Microsoft.DesktopVirtualization/hostpools/scalingplans/read | Read scalingplans |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostconfigurations/read | Read hostpools/sessionhostconfigurations |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostconfigurations/write | Write hostpools/sessionhostconfigurations |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostconfigurations/delete | Delete hostpools/sessionhostconfigurations |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostconfigurations/operationresults/read | Read the operationresults to see results present. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostconfigurations/operationstatuses/read | Read the operationstatuses to see statuses present. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostmanagements/controlSessionHostUpdate/action | Action on controlSessionHostUpdate. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostmanagements/initiateSessionHostUpdate/action | Action on initiateSessionHostUpdate. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostmanagements/read | Read sessionhostmanagements. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostmanagements/write | Write to sessionhostmanagements to update. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhostmanagements/operationstatuses/read | Read operationstatuses to get statuses. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/read | Read hostpools/sessionhosts |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/write | Write hostpools/sessionhosts |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/delete | Delete hostpools/sessionhosts |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/retryprovisioning/action | Action on retryprovisioning. |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read | Read hostpools/sessionhosts/usersessions |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/write | Write hostpools/sessionhosts/usersessions |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/delete | Delete hostpools/sessionhosts/usersessions |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/disconnect/action | Disconnects the user session form session host |
> | Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action | Send message to user session |
> | Microsoft.DesktopVirtualization/hostpools/updateDetails/read | Read updateDetails |
> | Microsoft.DesktopVirtualization/hostpools/updateOperationResults/read | Read updateOperationResults |
> | Microsoft.DesktopVirtualization/hostpools/usersessions/read | Read usersessions |
> | Microsoft.DesktopVirtualization/operations/read | Read operations |
> | Microsoft.DesktopVirtualization/resourceTypes/read | Read resourceTypes |
> | Microsoft.DesktopVirtualization/scalingplans/read | Read scalingplans |
> | Microsoft.DesktopVirtualization/scalingplans/write | Write scalingplans |
> | Microsoft.DesktopVirtualization/scalingplans/delete | Delete scalingplans |
> | Microsoft.DesktopVirtualization/scalingplans/move/action | Move scalingplans to another ResourceGroup or Subscription |
> | Microsoft.DesktopVirtualization/scalingplans/personalSchedules/read | Read scalingplans/personalSchedules |
> | Microsoft.DesktopVirtualization/scalingplans/personalSchedules/write | Write scalingplans/personalSchedules |
> | Microsoft.DesktopVirtualization/scalingplans/personalSchedules/delete | Delete scalingplans/personalSchedules |
> | Microsoft.DesktopVirtualization/scalingplans/pooledSchedules/read | Read scalingplans/pooledSchedules |
> | Microsoft.DesktopVirtualization/scalingplans/pooledSchedules/write | Write scalingplans/pooledSchedules |
> | Microsoft.DesktopVirtualization/scalingplans/pooledSchedules/delete | Delete scalingplans/pooledSchedules |
> | Microsoft.DesktopVirtualization/skus/read | Read skus. |
> | Microsoft.DesktopVirtualization/workspaces/read | Read workspaces |
> | Microsoft.DesktopVirtualization/workspaces/write | Write workspaces |
> | Microsoft.DesktopVirtualization/workspaces/delete | Delete workspaces |
> | Microsoft.DesktopVirtualization/workspaces/move/action | Move a workspaces to another resource group |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnectionproxies/read | Read workspaces/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnectionproxies/write | Write workspaces/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnectionproxies/delete | Delete workspaces/privateendpointconnectionproxies |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnectionproxies/validate/action | Validates the private endpoint connection proxy |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnectionproxies/operationresults/read | Gets operation result on private endpoint connection proxy |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnections/read | Read workspaces/privateendpointconnections |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnections/write | Write workspaces/privateendpointconnections |
> | Microsoft.DesktopVirtualization/workspaces/privateendpointconnections/delete | Delete workspaces/privateendpointconnections |
> | Microsoft.DesktopVirtualization/workspaces/privatelinkresources/read | Read privatelinkresources |
> | Microsoft.DesktopVirtualization/workspaces/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting |
> | Microsoft.DesktopVirtualization/workspaces/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting |
> | Microsoft.DesktopVirtualization/workspaces/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs |
> | **DataAction** | **Description** |
> | Microsoft.DesktopVirtualization/appattachpackages/useapplications/action | Allow user permissioning on app attach packages in an application group |
> | Microsoft.DesktopVirtualization/applicationgroups/useapplications/action | Use ApplicationGroup |

## Microsoft.ServiceFabric

Develop microservices and orchestrate containers on Windows or Linux.

Azure service: [Service Fabric](/azure/service-fabric/)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServiceFabric/register/action | Register any Action |
> | Microsoft.ServiceFabric/clusters/read | Read any Cluster |
> | Microsoft.ServiceFabric/clusters/write | Create or Update any Cluster |
> | Microsoft.ServiceFabric/clusters/delete | Delete any Cluster |
> | Microsoft.ServiceFabric/clusters/applications/read | Read any Application |
> | Microsoft.ServiceFabric/clusters/applications/write | Create or Update any Application |
> | Microsoft.ServiceFabric/clusters/applications/delete | Delete any Application |
> | Microsoft.ServiceFabric/clusters/applications/services/read | Read any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/write | Create or Update any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/delete | Delete any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/read | Read any Partition |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/replicas/read | Read any Replica |
> | Microsoft.ServiceFabric/clusters/applications/services/statuses/read | Read any Service Status |
> | Microsoft.ServiceFabric/clusters/applicationTypes/read | Read any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/write | Create or Update any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/delete | Delete any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/read | Read any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Microsoft.ServiceFabric/clusters/nodes/read | Read any Node |
> | Microsoft.ServiceFabric/clusters/statuses/read | Read any Cluster Status |
> | Microsoft.ServiceFabric/locations/clusterVersions/read | Read any Cluster Version |
> | Microsoft.ServiceFabric/locations/environments/clusterVersions/read | Read any Cluster Version for a specific environment |
> | Microsoft.ServiceFabric/locations/operationresults/read | Read any Operation Results |
> | Microsoft.ServiceFabric/locations/operations/read | Read any Operations by location |
> | Microsoft.ServiceFabric/managedclusters/read | Read any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/write | Create or Update any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/delete | Delete any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/applications/read | Read any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/write | Create or Update any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/delete | Delete any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/services/read | Read any Service |
> | Microsoft.ServiceFabric/managedclusters/applications/services/write | Create or Update any Service |
> | Microsoft.ServiceFabric/managedclusters/applications/services/delete | Delete any Service |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/read | Read any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/write | Create or Update any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/delete | Delete any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/read | Read any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/read | Read any Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/write | Create or Update any Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/delete | Delete Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/skus/read | Read Node Type supported SKUs |
> | Microsoft.ServiceFabric/operations/read | Read any Available Operations |

## Next steps

- [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types)