---
title: Relocate Azure App Services to another region
description: Learn how to relocate Azure App Services to another region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 07/11/2024
ms.service: app-service
ms.topic: concept-article
ms.custom:
  - subject-relocation
#Customer intent: As an Azure service administrator, I want to move my App Service resources to another Azure region.
---

# Relocate Azure App Services to another region


This article describes how to move App Service resources to a different Azure region. 

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]

App Service resources are region-specific and can't be moved across regions. You must create a copy of your existing App Service resources in the target region, then relocate your content over to the new app. If your source app uses a custom domain, you can [migrate it to the new app in the target region](../app-service/manage-custom-dns-migrate-domain.md) after completion of the relocation.

To make copying your app easier, you can [backup and restore individual App Service app](../app-service/manage-backup.md?tabs=portal) into an App Service plan in another region.

## Prerequisites

- Make sure that the App Service app is in the Azure region from which you want to move.
- Make sure that the target region supports App Service and any related service, whose resources you want to move.
- Validate that sufficient permission exist to deploy App Service resources to the target subscription and region. 
- Validate if any Azure policy is assigned with a region restriction.
- Consider any operating costs, as Compute resource prices can vary from region to region. To estimate your possible costs, see [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Prepare

Identify all the App Service resources that you're currently using. For example:

- App Service apps
- [App Service plans](../app-service/overview-hosting-plans.md)
- [Deployment slots](../app-service/deploy-staging-slots.md)
- [Custom domains purchased in Azure](../app-service/manage-custom-dns-buy-domain.md)
- [TLS/SSL certificates](../app-service/configure-ssl-certificate.md)
- [Azure Virtual Network integration](../app-service/overview-vnet-integration.md)
- [Hybrid connections](../app-service/app-service-hybrid-connections.md).
- [Managed identities](../app-service/overview-managed-identity.md)
- [Backup settings](../app-service/manage-backup.md)

Certain resources, such as imported certificates or hybrid connections, contain integration with other Azure services. For information on how to move those resources across regions, see the [documentation for the respective services](overview-relocation.md).

## Plan

This section is a planning checklist in the following areas: 

- State, Storage and downstream dependencies
- Certificates
- Configuration
- VNet Connectivity / Custom Names / DNS
- Identities
- Service Endpoints

### State, storage, and downstream dependencies

 - **Determine whether your App Service App is stateful or stateless.** Although we recommend that App Service Apps are stateless and the files on the `%HOME%\site` drive should be only those that are required to run the deployed application with any temporary files, it's still possible to store runtime application state on the `%HOME%\site` virtual drive. If your application writes state on the app shared storage path, make sure to plan how you're going to manage that state during a resource move.
 
    >[!TIP]
    >You can use Kudu to, along with portal access, to provide a file access API (Virtual File System (VFS)) that can read/write files under the `%HOME%\site` directory. For more information, see [Kudu Wiki](https://github.com/projectkudu/kudu/wiki/REST-API#vfs).

- **Check for internal caching and state** in application code. 

- **Disable session affinity setting.** Where possible, we recommend that you disable the session affinity setting.  Disabling session affinity improves load balancing for a horizontal scale-out. Any internal state may impact the planning for cutting over a workload - particularly if zero down time is a requirement. Where possible, it may be beneficial to refactor out any application state to make the application stateless in preparation for the move.

- **Analyze database connection strings.** Database connection strings can be found in the App Settings. However, they may also be hard coded or managed in config files that are shipped with the application. Analyze and plan for data migration/replication as part of the higher level planning to move the workload. For chatty or Latency Critical Applications it isn't performant for the application in the target region to reach back to data sources in the source region.

- **Analyze external caching (for example Redis).**  Application caches should be deployed as close as possible to the application. Analyze how caches are populated, expiry/eviction policies and any impact a cold cache may have on the first users to access the workload after cut-over.

- **Analyze and plan for API (or application) dependencies** Cross-region communication is significantly less performant if the app in the target region reaches back to dependencies that are still in the source region. We recommend that you relocate all downstream dependencies as part of the workload relocation. However, \*on-premises* resources are the exception, in particular those resources that are geographically closer to the target region (as may be the case for repatriation scenarios).

    Azure Container Registry can be a downstream (runtime) dependency for App Service that's configured to run against Custom Container Images. It makes more sense for the Container Registry to be in the same region as the App itself. Consider uploading the required images to a new ACR in the target get region. Otherwise,  consider using the [geo-replication feature](../container-registry/container-registry-geo-replication.md) if you plan on keeping the images in the source region.

- **Analyze and plan for regional services.** Application Insights and Log Analytics data are regional services. Consider the creation of new Application Insights and Log Analytics storage in the target region. For App Insights, a new resource also impacts the connection string that must be updated as part of the change in App Configuration.

[!INCLUDE [app-service-certificates](includes/app-service-certificates.md)]

Some further points to consider:

- App Assigned Addresses, where an App Service app’s SSL connection is bound to a specific app designated IP, can be used for allow-listing calls from third party networks into App Service. For example, a network / IT admin may want to lock down outbound calls from an on-premises network or VNet to use a static, well-known address. As such, if the App Assigned Address feature is in use, upstream firewall rules - such as internal, external, or third parties -  for the callers into the app should be checked and informed of the new address. Firewall rules can be internal, external or third parties, such as partners or well-known customers.

- Consider any upstream Network Virtual Appliance (NVA) or Reverse Proxy. The NVA config may need to change if you're rewriting the host header or and/or SSL terminating.

>[!NOTE]
>App Service Environment is the only App Service offering allows downstream calls to downstream application dependencies over SSL, where the SSL relies on self-signed/PKI with built with [non-standard Root CA certificates](/azure/app-service/environment/overview-certificates#private-client-certificate). The multitenant service doesn't provide access for customers to upload to the trusted certificate store.
>
>App Service Environment today doesn't allow SSL certificate purchase, only Bring Your Own certificates. IP-SSL isn't possible (and doesn’t make sense), but SNI is. Internal App Service Environment would not be associated with a public domain and therefore the SSL certs used must be provided by the customer and are therefore transportable, for example certs for internal use generated using PKI. App Service Environment v3 in external mode shares the same features as the regular multitenant App Service.

[!INCLUDE [app-service-configuration](includes/app-service-configuration.md)]

- Make sure to check any disk file configuration, which may or may not be overridden by application settings.

### VNet Connectivity / Custom Names / DNS

- App Service Environment is a VNet-Injected single tenant service. App Service Environment networking differs from the multitenant App Service,  which requires one or both “Private Endpoints” or “Regional VNet integration”. Other options that may be in play include the legacy P2S VPN based VNet integration and Hybrid Connections (an Azure Relay service).

    >[!NOTE]
    >ASEv3 Networking is simplified - the Azure Management traffic and the App Service Environments own downstream dependencies are not visible to the customer Virtual Network, greatly simplifying the configuration required where the customer is using a force-tunnel for all traffic, or sending a subset of outbound traffic, through a Network Virtual Appliance/Firewall.
    >
    >Hybrid Connections (Azure Relay) are regional. If Hybrid Connections are used and although an Azure Relay Namespace can be moved to another region, it would be simpler to redeploy the Hybrid Connection (ensure the Hybrid connection is setup in the new region on deploy of the target resources) and re-link it to the Hybrid Connection Manager. The Hybrid Connection Manager location should be carefully considered.

- **Follow the strategy for a warm standby region.** Ensure that core networking and connectivity, Hub network, domain controllers, DNS, VPN or Express Route, etc., are present and tested prior to the resource relocation.

- **Validate any upstream or downstream network ACLs and configuration**. For example, consider an external downstream service that allowlists only your App traffic. A relocation to a new Application Plan for a multitenant App Service would then also be a change in outbound IP addresses.

- In most cases, it's best to **ensure that the target region VNets have unique address space**. A unique address space facilitates VNet connectivity if it’s required, for example, to replicate data. Therefore, in these scenarios there's an implicit requirement to change:

    - Private DNS
    - Any hard coded or external configuration that references resources by IP address (without a hostname)
    - Network ACLs including Network Security Groups and Firewall configuration (consider the impact to any on-premises NVAs here too)
    - Any routing rules, User Defined Route Tables
    
    Also, make sure to check configuration including region specific IP Ranges / Service Tags if carrying forward existing DevOps deployment resources.

- Fewer changes are required for customer-deployed private DNS that is configured to forward to Azure for Azure domains and Azure DNS Private Zones. However, as Private Endpoints are based on a resource FQDN and this is often also the resource name (which can be expected to be different in the target region), remember to **cross check configuration to ensure that FQDNs referenced in configuration are updated accordingly**. 

- **Recreate Private Endpoints, if used, in the target region**. The same applies for Regional VNet integration.


 - DNS for App Service Environment is typically managed via the customers private custom DNS solution (there is a manual settings override available on a per app basic). App Service Environment provides a load balancer for ingress/egress,  while App Service itself filters on Host headers. Therefore, multiple custom names can be pointed towards the same App Service Environment ingress endpoint. App Service Environment doesn't require domain validation. 

    >[!NOTE]
    >Kudu endpoint for App Service Environment v3 is only available at ``{resourcename}.scm.{asename}.appserviceenvironment.net``. For more information on App Service Environment v3 DNS and Networking etc see [App Service Environment networking](/azure/app-service/environment/networking#dns).


    For App Service Environment,  the customer owns the routing and therefore the resources used for the cut-over. Wherever access is enabled to the App Service Environment externally - typically via a Layer 7 NVA or Reverse Proxy -  Traffic Manager, or Azure Front Door/Other L7 Global Load Balancing Service can be used.

- For the public multitenant version of the service, a default name `{resourcename}.azurewebsites.net` is provisioned for the data plane endpoints, along with a default name for the Kudu (SCM) endpoint.  As the service provides a public endpoint by default, the binding must be verified to prove domain ownership. However, once the binding is in place, re-verification isn't required, nor is it required for public DNS records to point at the App Service endpoint.

- If you use a custom domain, [bind it preemptively to the target app](/azure/app-service/manage-custom-dns-migrate-domain#bind-the-domain-name-preemptively). Verify and [enable the domain in the target app](/azure/app-service/manage-custom-dns-migrate-domain#enable-the-domain-for-your-app).

[!INCLUDE [app-service-identities](includes/app-service-identities.md)]

- **Plan for relocating the Identity Provider (IDP) to the target region**. Although Microsoft Entra ID is a global service, some solutions rely on a local (or downstream on premises) IDP.

- **Update any resources to the App Service that may rely on Kudu FTP credentials.** 

### Service endpoints

The virtual network service endpoints for Azure App Service  restrict access to a specified virtual network. The endpoints can also restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to the Event Hubs from outside those sources is denied access. If Service endpoints were configured in the source region for the Event Hubs resource, the same would need to be done in the target one.

For a successful recreation of the Azure App Service  to the target region, the VNet and Subnet must be created beforehand. In case the move of these two resources is being carried out with the Azure Resource Mover tool, the service endpoints won’t be configured automatically. Hence, they need to be configured manually, which can be done through the [Azure portal](/azure/key-vault/general/quick-create-portal), the [Azure CLI](/azure/key-vault/general/quick-create-cli), or [Azure PowerShell](/azure/key-vault/general/quick-create-powershell).

## Relocate

To relocate App Service resources, you can use either Azure portal or Infrastructure as Code (IaC). 

### Relocate using Azure portal

The greatest advantage of using Azure portal to relocate is its simplicity. The app, plan, and contents, as well as many settings are cloned into the new App Service resource and plan.

Keep in mind that for App Service Environment (Isolated) tiers, you need to redeploy the entire App Service Environment in another region first, and then you can start redeploying the individual plans in the new App Service Environment in the new region. 

**To relocate your App Service resources to a new region using Azure portal:**


1. [Create a back up of the source app](../app-service/manage-backup.md).
1. [Create an app in a new App Service plan, in the target region](../app-service/app-service-plan-manage.md#create-an-app-service-plan).
1. [Restore the back up in the target app](../app-service/manage-backup.md)
1. If you use a custom domain, [bind it preemptively to the target app](../app-service/manage-custom-dns-migrate-domain.md#2-create-the-dns-records) with `asuid.` and [enable the domain in the target app](../app-service/manage-custom-dns-migrate-domain.md#3-enable-the-domain-for-your-app).
1. Configure everything else in your target app to be the same as the source app and verify your configuration.
1. When you're ready for the custom domain to point to the target app, [remap the domain name](../app-service/manage-custom-dns-migrate-domain.md#4-remap-the-active-dns-name).


### Relocate using IaC

Use IaC when an existing Continuous Integration and Continuous Delivery/Deployment(CI/CD) pipeline exists, or can be created. With an CI/CD pipeline in place, your App Service resource can be created in the target region by means of a deployment action or a Kudu zip deployment.

SLA requirements should determine how much additional effort is required. For example: Is this a redeploy with limited downtime, or is it a near real time cut-over required with minimal to no downtime?

The inclusion of external, global traffic routing edge services, such as Traffic Manager, or Azure Front Door help to facilitate cut-over for external users and applications.


>[!TIP]
>It's possible to use Traffic Manager (ATM) when failing over App Services behind private endpoints. Although the private endpoints are not reachable by Traffic Manager Probes - if all endpoints are degraded, then ATM allows routing. For more information, see [Controlling Azure App Service traffic with Azure Traffic Manager](../app-service/web-sites-traffic-manager.md).

## Validate


Once the relocation is completed, test and validate Azure App Service with the recommended guidelines:

- Once the Azure App Service is relocated to the target region,  run a smoke and integration test. You can manually test or run a test through a script. Make sure to validate that all configurations and dependent resources are properly linked and that all configured data are accessible.

- Validate all Azure App Service components and integration.

- Perform integration testing on the target region deployment, including all formal regression testing. Integration testing should align with the usual Rhythm of Business deployment and test processes applicable to the workload. 

- In some scenarios, particularly where the relocation includes updates, changes to the applications or Azure Resources, or a change in usage profile, use load testing to validate that the new workload is fit for purpose. Load testing is also an opportunity to validate operations and monitoring coverage. For example, use load testing to validate that the required infrastructure and application logs are being generated correctly. Load tests should be measured against established workload performance baselines.


>[!TIP]
>An App Service relocation is also an opportunity to re-assess Availability and Disaster Recovery planning. App Service and App Service Environment (App Service Environment v3) supports [availability zones](/azure/reliability/availability-zones-overview) and it's recommended that configure with an availability zone configuration.  Keep in mind the prerequisites for deployment, pricing, and limitations and factor these into the resource move planning. For more information on availability zones and App Service, see [Reliability in Azure App Service](/azure/reliability/reliability-app-service).


## Clean up

Delete the source app and App Service plan. [An App Service plan in the non-free tier carries a charge, even if no app is running in it.](../app-service/app-service-plan-manage.md#delete-an-app-service-plan)

## Next steps

[Azure App Service App Cloning Using PowerShell](../app-service/app-service-web-app-cloning.md)
