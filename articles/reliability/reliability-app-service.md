---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service, including availability zones and multi-region deployments. 
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 05/07/2025
zone_pivot_groups: app-service-sku
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service works from a reliability perspective and plan resiliency strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service

This article describes reliability support in [Azure App Service](../app-service/overview.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. App Service integrates with Microsoft Azure to provide security, load balancing, autoscaling, and automated management for applications. To explore how App Service can bolster the reliability and resiliency of your application workload, see [App Service overview](../app-service/overview.md).

When you deploy App Service, you can provision multiple instances in an [App Service plan](/azure/app-service/overview-hosting-plans). This plan represents the compute workers that run your application code. The platform makes an effort to deploy the instances across different fault domains, but it doesn't automatically distribute the instances across availability zones.

## Production deployment recommendations

::: zone pivot="free-shared-basic"

- Use premium v3/v4 App Service plans.

- [Enable zone redundancy](#availability-zone-support). To see requirements for enabling zone -redundancy, go to [Availability zone support requirements](#requirements).

::: zone-end

::: zone pivot="premium,isolated"

[Enable zone redundancy](#availability-zone-support), which requires your App Service plan to use a minimum of two instances.

::: zone-end

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Microsoft-provided SDKs usually handle transient faults. Because you host your own applications on App Service, consider how to avoid causing transient faults:

- **Deploy multiple instances in your plan.** App Service performs automated updates and other forms of maintenance on instances in your plan. If an instance becomes unhealthy, the service can automatically replace that instance with a new healthy instance. During the replacement process, there can be a short period when the previous instance is unavailable and a new instance isn't ready to serve traffic. You can mitigate these effects by deploying multiple instances of your App Service plan.

- **Use deployment slots.** App Service [deployment slots](/azure/app-service/deploy-staging-slots) enable zero-downtime deployments of your applications. Use deployment slots to minimize the effect of deployments and configuration changes for your users. Deployment slots also reduce the likelihood that your application restarts. Restarting the application causes a transient fault.

- **Avoid scaling up or scaling down.** Instead of scaling up or scaling down, select a tier and instance size that meet your performance requirements under typical load. Only scale out instances to handle changes in traffic volume. Scaling up and scaling down can trigger an application restart.

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

App Service can be configured as *zone redundant*, which means that your resources are distributed across multiple availability zones. Distribution across multiple zones helps your production workloads achieve resiliency and reliability. When you configure zone redundancy on App Service plans, all apps that use the plan are made zone redundant.

Instance distribution in a zone-redundant deployment follows specific rules. These rules remain applicable as the app scales in and scales out. For more information, see [Considerations](#considerations).

### Region support

::: zone pivot="free-shared-basic, premium"

Zone-redundant App Service plans can be deployed in [any region that supports availability zones](./regions-list.md).

::: zone-end
 
::: zone pivot="isolated"

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

### Requirements

::: zone pivot="free-shared-basic"

You must use the [Premium v2-4 plan types](/azure/app-service/overview-hosting-plans). To view more information, ensure that you select the appropriate tier at the top of this page.


::: zone-end

::: zone pivot="premium,isolated"

- You must use the [Premium v2-4 or Isolated v2 plan types](/azure/app-service/overview-hosting-plans) and have a minimum of two instances of the plan.

- Availability zones are supported only on newer App Service scale units. Even if you use one of the supported regions, if availability zones aren't supported for the scale unit that you use, then you receive an error when you create a zone-redundant App Service plan.

    The scale unit that you're assigned to is based on the resource group that you deploy an App Service plan to. To ensure that your workloads land on a scale unit that supports availability zones, you might need to create a new resource group and create a new App Service plan and App Service app within the new resource group.

    To see if your App Service plan is on a stamp that supports availability zones, check the `maximumNumberOfZones` property for the App Service plan. If the value is greater than one, your stamp supports zones and you can enable zone redundancy on the plan. If the value is equal to one, your scale unit doesn't support availability zones and you need to deploy a new plan to enable zone redundancy.

    ```azurecli
    az appservice plan show -n <app-service-plan-name> -g <resource-group-name> --query properties.maximumNumberOfZones
    ```

- You must deploy a minimum of two instances in your plan.

::: zone-end

::: zone pivot="premium,isolated"

### Considerations

Instance distribution in a zone-redundant deployment follows specific rules. These rules remain applicable as the app scales in and scales out:

- **Minimum instances:** Your App Service plan must have a minimum of two instances for zone redundancy.

- **Maximum availability zones supported by your plan:** Azure determines the number of availability zones that your plan can use. To view the number of availability zones that your plan is able to use, see the *maximumNumberOfZones* property on the App Service plan. This is a read-only property. If this value is equal to 1, your App Service plan doesn't support zone redundancy. If the *maximumNumberOfZones* value is greater than 1, your App Service plan can be configured for zone redundancy.

    ```azurecli
    az appservice plan show -n <app-service-plan-name> -g <resource-group-name> --query properties.maximumNumberOfZones
    ```

- **Instance distribution:** When zone redundancy is enabled, plan instances are distributed across multiple availability zones automatically. The distribution is based on the following rules:

    - The instances distribute evenly if you specify a capacity (number of instances) greater than *maximumNumberOfZones* and the number of instances is divisible by *maximumNumberOfZones*.
    - Any remaining instances are distributed across the remaining zones.
    - When the App Service platform allocates instances for a zone-redundant App Service plan, it uses best-effort zone balancing that the underlying Azure virtual machine scale sets provide. An App Service plan is balanced if each zone has the same number of VMs or differs by plus one VM or minus one VM from all other zones. For more information, see [Zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).

- **Physical zone placement:** You can view the [physical availability zone](availability-zones-overview.md#physical-and-logical-availability-zones) used for each of your App Service plan instances. Use the [REST API](/rest/api/appservice/web-apps/get-instance-info), which returns the `physicalZone` value for each instance.

    ```azurecli
    az rest --method get --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/instances?api-version=2024-04-01
    ```

For App Service plans that aren't configured as zone redundant, the underlying VM instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

::: zone-end

::: zone pivot="premium"

When you use App Service Premium v2-v4 plans, there's no extra cost associated with enabling availability zones as long as you have two or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

::: zone-end

::: zone pivot="isolated"

When you use the App Service Isolated v2 plan, there's no extra cost associated with enabling availability zones as long as you have two or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

::: zone-end

### Configure availability zone support

::: zone pivot="free-shared-basic"

To deploy a new zone-redundant App Service plan, you must use either the [Premium v2-4 plan types](/azure/app-service/overview-hosting-plans). To view more information, ensure that you select the appropriate tier at the top of this page.

::: zone-end

::: zone pivot="premium"

- **Create a new App Service plan with zone redundancy.** To deploy a new zone redundant App Service plan, select the *Zone redundant* option when you deploy the plan in the Azure portal or set the App Service plan `zoneRedundant` property to `true` in the Azure CLI command, Azure PowerShell command, Bicep file, or Azure Resource Manager template:

    # [Azure CLI](#tab/azurecli)

    ```azurecli
    az appservice plan create -g MyResourceGroup -n MyPlan --zone-redundant --number-of-workers 2 --sku P1V3
    ```

    > [!NOTE]
    > If you use the Azure CLI to modify the `zone-redundant` property, you must specify the `--number-of-workers` property, which is the number of instances, and use a capacity greater than or equal to 2.

    # [Bicep](#tab/bicep)

    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
        name: appServicePlanName
        location: location
        sku: {
            name: sku
            capacity: 2
        }
        kind: 'linux'
        properties: {
            reserved: true
            zoneRedundant: true
        }
    }
    ```

    ---

- **Migrate an existing App Service plan to zone-redundancy.** If you have an existing App Service plan that supports zone redundancy (the maximum available zones is greater than 1), you can enable zone redundancy by setting the App Service plan's `zoneRedundant` property to `true` in the Azure CLI, your Bicep file, or your Resource Manager template:

    ```azurecli
    az appservice plan update -g <resource group name> -n <app service plan name> --set zoneRedundant=true sku.capacity=2
    ```

    > [!NOTE]
    > If you use the Azure CLI to modify the `zoneRedundant` property, you must specify the `sku.capacity` property, which is the number of instances, and use a capacity greater than or equal to 2.
   
    If you're on a plan or a stamp that doesn't support availability zones, you must create a new App Service plan in a new resource group so that you land on the App Service footprint that supports zones.

    > [!NOTE]
    > Changing the zone redundancy status of an App Service plan is almost instantaneous. You don't experience downtime or performance problems during the process.

- **Disable zone redundancy.** To disable zone redundancy, set the App Service plan `zoneRedundant` property to `false` or use the Azure CLI:

    ```azurecli
    az appservice plan update -g <resource group name> -n <app service plan name> --set zoneRedundant=false sku.capacity=1
    ```
    > [!NOTE]
    > If you use the Azure CLI to disable the `zoneRedundant` property, you should specify the `sku.capacity` property, otherwise the value defaults to 1.

::: zone-end

::: zone pivot="isolated"

- **Create a new App Service plan with zone redundancy.** 

    1. If you don't have a pre-existing zone-redundant App Service Environment, deploy a new zone-redundant App Service Environment. For more information on how to create an App Service Environment, see [Create an App Service Environment](/azure/app-service/environment/creation).

    1. To create the App Service plan in Azure portal, select *Zone redundant*. To create the plan using Azure CLI command, Azure PowerShell command, Bicep file, or Resource Manager template, set the App Service plan `zoneRedundant` property to `true`, as in the following sample code:

    # [Azure CLI](#tab/azurecli)

    ```azurecli
    az appservice plan create -g MyResourceGroup -n MyPlan --app-service-environment MyAse --zone-redundant --number-of-workers 2 --sku I1V2
    ```

    > [!NOTE]
    > If you use the Azure CLI to modify the `zoneRedundant` property, you must specify the `number-of-workers` property, which is the number of instances, and use a capacity greater than or equal to 2.

    # [Bicep](#tab/bicep)

    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
        name: appServicePlanName
        location: location
        hostingEnvironmentProfile: {
            id: '...'
        }
        sku: {
            name: sku
            capacity: 2
        }
        kind: 'linux'
        properties: {
            reserved: true
            zoneRedundant: true
        }
    }
    ```

    ---

- **Migrate an existing App Service plan to zone-redundancy** If you have an existing App Service Environment or Isolated v2 App Service plan that supports zone redundancy, you can enable zone redundancy at any time. To enable zone redundancy for the App Service Environment, set the `zoneRedundant` property to `true` or use the Azure CLI:

    # [Azure CLI](#tab/azurecli)

    ```azurecli
    az resource update --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} --set properties.zoneRedundant=true
    ```

    # [Bicep](#tab/bicep)

    ```bicep
    resource asev3 'Microsoft.Web/hostingEnvironments@2020-12-01' = {
        name: aseName
        location: location
        kind: 'ASEV3'
        dependsOn: [
            virtualnetwork
        ] 
        properties: {
            ...
            zoneRedundant: true
        }
    }
    ```

    ---

    > [!NOTE]
    > When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

    For Isolated v2 App Service plans, if the App Service Environment is zone redundant, the App Service plans can be made zone redundant. Each App Service plan has its own independent zone redundancy setting, which means that you can have a mix of zone redundant and non-zone redundant plans in an App Service Environment. To enable zone redundancy on an Isolated v2 App Service plan, set the App Service plan's `zoneRedundant` property to `true` or use the Azure CLI.   
    
    # [Azure CLI](#tab/azurecli)

    ```azurecli
    az appservice plan update -g <resource group name> -n <app service plan name> --set zoneRedundant=true sku.capacity=2
    ```

    > [!NOTE]
    > If you use the Azure CLI to modify the `zoneRedundant` property, you must specify the `sku.capacity` property, which is the number of instances, and use a capacity greater than or equal to 2.

    # [Bicep](#tab/bicep)

    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
        name: appServicePlanName
        location: location
        hostingEnvironmentProfile: {
            id: '...'
        }
        sku: {
            name: sku
            capacity: 2
        }
        kind: 'linux'
        properties: {
            reserved: true
            zoneRedundant: true
        }
    }
    ``` 
    
    ---

- **Disable zone redundancy.** To disable zone redundancy, you can set the App Service plan or App Service Environment `zoneRedundant` property to `false` or use the Azure CLI:

    ```azurecli
    az resource update --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} --set properties.zoneRedundant=false

    az appservice plan update -g <resource group name> -n <app service plan name> --set zoneRedundant=false sku.capacity=1
    ```

    > [!NOTE]
    > If you use the Azure CLI to disable the `zoneRedundant` property, you should specify the `sku.capacity` property, otherwise the value defaults to 1.

    > [!NOTE]
    > If you use the Azure CLI to disable the zoneRedundant property, you should specify the sku.capacity property. Otherwise, the value defaults to 1.

::: zone-end

::: zone pivot="premium,isolated"

### Capacity planning and management

To prepare for availability zone failure, consider *over-provisioning* the capacity of your App Service plan. Over-provisioning allows the solution to tolerate some degree of capacity loss and continue to function without degraded performance. For more information, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

The following section describes what to expect when App Service plans are configured for zone redundancy and all availability zones are operational:

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available App Service plan instances across all availability zones.

- **Data replication between zones:** During normal operations, any state stored in your application's file system is stored in zone-redundant storage and synchronously replicated between availability zones.

### Zone-down experience

During an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

The following section describes what to expect when App Service plans are configured for zone redundancy and one or more availability zones are unavailable:

- **Detection and response:** The App Service platform automatically detects failures in an availability zone and initiates a response. No manual intervention is required to initiate a zone failover.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an App Service plan instance in the faulty availability zone are terminated. They need to be retried.

- **Traffic rerouting:** When a zone is unavailable, App Service detects the lost instances from that zone and automatically attempts to find new replacement instances.  Once it finds replacements, it then distributes traffic across the new instances as needed.

    If autoscale is configured and it determines that more instances are needed, it issues a request to App Service to add those instances. Autoscale behavior operates independently of App Service platform behavior, meaning that your instance count specification doesn't need to be a multiple of two. For more information, see [Scale up an app in App Service](../app-service/manage-scale-up.md) and [Autoscale overview](/azure/azure-monitor/autoscale/autoscale-overview).

    > [!IMPORTANT]
    > There's no guarantee that requests for more instances in a zone-down scenario succeed. The backfilling of lost instances occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your App Service plans to account for the loss of a zone. You can achieve this by [over-provisioning the capacity of your App Service plan](#capacity-planning-and-management).

- **Nonruntime behaviors:** Applications that are deployed in a zone-redundant App Service plan continue to run and serve traffic even if an availability zone experiences an outage. However, nonruntime behaviors might be affected during an availability zone outage. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

### Failback

When the availability zone recovers, App Service automatically creates instances in the recovered availability zone, removes any temporary instances created in the other availability zones, and routes traffic between your instances as usual.

### Testing for zone failures

The App Service platform manages traffic routing, failover, and failback for zone-redundant App Service plans. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

::: zone-end

## Multi-region support

App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multi-region approaches

To reduce the risk of a single-region failure affecting your application, deploy across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the instances in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

::: zone pivot="free-shared-basic,premium"

The following resources are related to this approach: 

- [Reference architecture: Highly available multi-region web application](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)

- [Approaches to consider](/azure/architecture/web-apps/guides/multi-region-app-service/multi-region-app-service?tabs=paired-regions#approaches-to-consider)

- [Tutorial: Create a highly available multi-region app in App Service](/azure/app-service/tutorial-multi-region-app)

::: zone-end

::: zone pivot="isolated"

For an example approach that illustrates this architecture, see [High availability enterprise deployment by using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

::: zone-end

## Backups

When you use Basic tier or higher, you can back up your App Service app to a file by using the App Service backup and restore capabilities.

This feature is useful if it's hard to redeploy your code, or if you store state on disk. For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Back up and restore your app in App Service](../app-service/manage-backup.md).

## Reliability during service maintenance

Azure App Service performs regular service upgrades, as well as other forms of maintenance. To ensure that your expected capacity is available during an upgrade, the platform automatically adds extra instances of the App Service plan during the upgrade process.

**Enable zone redundancy.** When you enable zone redundancy on your App Service plan, you also improve your resiliency to updates that the App Service platform rolls out. *Update domains* consist of collections of virtual machines (VMs) that are taken offline at the time of an update. Update domains are tied to availability zones. Deploying multiple instances in your App Service plan and enabling zone redundancy for your plan adds an extra layer of resiliency during upgrades if an instance or zone becomes unhealthy.

::: zone pivot="free-shared-basic,premium"

To learn more, see [Routine planned maintenance for Azure App Service](/azure/app-service/routine-maintenance).

::: zone-end

::: zone pivot="isolated"

**Customize the upgrade cycle.** You to customize the upgrade cycle for an App Service Environment. If you need to validate the effect of upgrades on your workload, consider enabling manual upgrades so you can perform validation and testing on a nonproduction instance before the change rolls out to your production instance.

To learn more about maintenance preferences, see [Upgrade preference for App Service Environment planned maintenance](/azure/app-service/environment/how-to-upgrade-preference).

::: zone-end

## Service-level agreement (SLA)

The service-level agreement (SLA) for App Service describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant App Service plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)

