---
title: Reliability in Azure Health Data Services de-identification service
description: Find out about reliability in the Azure Health Data Services de-identification service.
author: jovinson-ms
ms.author: jovinson
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.date: 09/27/2024
#Customer intent: As an IT admin, I want to understand reliability support for the de-identification service so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in the Azure Health Data Services de-identification service (preview)

This article describes reliability support in the de-identification service (preview). For a more detailed overview of a reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Cross-region disaster recovery

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Each de-identification service (preview) is deployed to a single Azure region. In the event of a region-wide degredation or outage:
- ARM control plane functionality will be limited to read-only for the duration of the outage. Your service metadata (such as resource properties) will be backed up outside of the region by Microsoft. Once the outage is over, you can read and write to the control plane.
- All data plane requests will fail for the duration of the outage, such as de-identification or job API requests. No customer data will be lost, but there is the potential for job progress metadata to be lost. Once the outage is over, you can read and write to the data plane.

### Disaster recovery tutorial
You can assure high availability of your workloads even during a region-wide outage or degradation by deploying two or more de-identification services in an active-active configuration.
In active-active disaster recovery architecture, de-identification services are deployed in two separate regions and Azure Front door is used to route traffic to both regions.

With this example architecture:

- Identical de-identification services are deployed in two separate regions. 
- Azure Front Door is used to route traffic to both regions.
- During a disaster, one region becomes offline, and Azure Front Door routes traffic exclusively to the other region. The recovery time objective during such a geo-failover is near-zero.
- Your application should be able to re-run jobs that were last observed as running but cannot be found. This ensures that the recovery point objective is limited to the job progress that is not available. 

####  RTO and RPO

If you adopt the active-active configuration described above, you should expect a recovery time objective (RTO) of **5 minutes**. In any configuration, you should expect a recovery point objective (RPO) of **0 minutes** (no customer data will be lost).

### Validate disaster recovery plan
#### Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

#### Create a resource group

You need two instances of a de-identification service (preview) in different Azure regions for this tutorial. The tutorial will use the [region pair](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) East US/West US as your two regions, but feel free to choose your own regions.

To make management and clean-up simpler, you use a single resource group for all resources in this tutorial. Consider using separate resource groups for each region/resource to further isolate your resources in a disaster recovery situation.

Run the following command to create your resource group.

```azurecli-interactive
az group create --name my-deid --location eastus
```

#### Create de-identification services (preview)

Follow the steps at [Quickstart: Deploy the de-identification service (preview)](/azure/healthcare-apis/deidentification/quickstart) to create two separate services, one in East US and one in West US.

Note the service URL of each de-identification service so you can define the backend addresses when you deploy the Azure Front Door in the next step.

#### Create an Azure Front Door

A multi-region deployment can use an active-active or active-passive configuration. An active-active configuration distributes requests across multiple active regions. An active-passive configuration keeps running instances in the secondary region, but doesn't send traffic there unless the primary region fails. 
Azure Front Door has a built-in feature that allows you to enable these configurations. For more information on designing apps for high availability and fault tolerance, see [Architect Azure applications for resiliency and availability](/azure/architecture/reliability/architect).

#### Create an Azure Front Door profile

You now create an [Azure Front Door Premium](../frontdoor/front-door-overview.md) to route traffic to your services. 

Run [`az afd profile create`](/cli/azure/afd/profile#az-afd-profile-create) to create an Azure Front Door profile.

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium, substitute the value of the `--sku` parameter with Standard_AzureFrontDoor. You can't deploy managed rules with WAF Policy if you choose the Standard tier. For a detailed comparison of the pricing tiers, see [Azure Front Door tier comparison](../frontdoor/standard-premium/tier-comparison.md).

```azurecli-interactive
az afd profile create --profile-name myfrontdoorprofile --resource-group my-deid --sku Premium_AzureFrontDoor
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|`profile-name`     |`myfrontdoorprofile`         |Name for the Azure Front Door profile, which is unique within the resource group.         |
|`resource-group`     |`my-deid`         |The resource group that contains the resources from this tutorial.         |
|`sku`     |`Premium_AzureFrontDoor`         |The pricing tier of the Azure Front Door profile.         |


### Add an endpoint

Run [`az afd endpoint create`](/cli/azure/afd/endpoint#az-afd-endpoint-create) to create an endpoint in your profile. You can create multiple endpoints in your profile after finishing the create experience.

```azurecli-interactive
az afd endpoint create --resource-group my-deid --endpoint-name myendpoint --profile-name myfrontdoorprofile --enabled-state Enabled
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|`endpoint-name`     |`myendpoint`         |Name of the endpoint under the profile, which is unique globally.         |
|`enabled-state`     |`Enabled`         |Whether to enable this endpoint.        |

#### Create an origin group

Run [`az afd origin-group create`](/cli/azure/afd/origin-group#az-afd-origin-group-create) to create an origin group that contains your two web apps.

```azurecli-interactive
az afd origin-group create --resource-group my-deid --origin-group-name myorigingroup --profile-name myfrontdoorprofile --probe-request-type GET --probe-protocol Https --probe-interval-in-seconds 60 --probe-path /health --sample-size 4 --successful-samples-required 3 --additional-latency-in-milliseconds 50
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|`origin-group-name`     |`myorigingroup`         |Name of the origin group.         |
|`probe-request-type`     |`GET`         |The type of health probe request that is made.        |
|`probe-protocol`    |`Http`         |Protocol to use for health probe.        |
|`probe-interval-in-seconds`     |`60`         |The number of seconds between health probes.        |
|`probe-path`    |`/`         |The path relative to the origin that is used to determine the health of the origin.       |
|`sample-size`     |`4`         |The number of samples to consider for load balancing decisions.        |
|`successful-samples-required`     |`3`         |The number of samples within the sample period that must succeed.        |
|`additional-latency-in-milliseconds`     |`50`         |The extra latency in milliseconds for probes to fall into the lowest latency bucket.        |

### Add an origin to the group

Run [`az afd origin create`](/cli/azure/afd/origin#az-afd-origin-create) to add an origin to your origin group. For the `--host-name` parameter, replace the placeholder for `<web-app-east-us>` with your app name in that region. Notice the `--priority` parameter is set to `1`, which indicates all traffic is sent to your primary app.

```azurecli-interactive
az afd origin create --resource-group my-deid --host-name <service-url-east-us> --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name primarydeid --origin-host-header <service-url-east-us> --priority 1 --weight 1000 --enabled-state Enabled --https-port 443
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|`host-name`     |`<service-url-east-us>`        |The hostname of the primary de-identification service.       |
|`origin-name`     |`primarydeid`         |Name of the origin.         |
|`origin-host-header`    |`<service-url-east-us>`         |The host header to send for requests to this origin. If you leave this blank, the request hostname determines this value. Azure CDN origins, such as Web Apps, Blob Storage, and Cloud Services require this host header value to match the origin hostname by default.         |
|`priority`     |`1`         |Set this parameter to 1 to direct all traffic to the primary de-identification service.        |
|`weight`     |`1000`         |Weight of the origin in given origin group for load balancing. Must be between 1 and 1000.         |
|`enabled-state`    |`Enabled`         |Whether to enable this origin.         |
|`https-port`    |`443`         |The port used for HTTPS requests to the origin.         |

Repeat this step to add your second origin. Pay attention to the `--priority` parameter. For this origin, it's set to `2`. This priority setting tells Azure Front Door to direct all traffic to the primary origin unless the primary goes down. If you set the priority for this origin to `1`, Azure Front Door treats both origins as active and direct traffic to both regions. Be sure to replace both instances of the placeholder for `<service-url-east-us>` with the service url.

```azurecli-interactive
az afd origin create --resource-group my-deid --host-name <service-url-west-us> --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name secondarydeid --origin-host-header <service-url-west-us> --priority 2 --weight 1000 --enabled-state Enabled --https-port 443
```

#### Add a route

Run [`az afd route create`](/cli/azure/afd/route#az-afd-route-create) to map your endpoint to the origin group. This route forwards requests from the endpoint to your origin group.

```azurecli-interactive
az afd route create --resource-group my-deid --profile-name myfrontdoorprofile --endpoint-name myendpoint --forwarding-protocol MatchRequest --route-name route --https-redirect Enabled --origin-group myorigingroup --supported-protocols Https --link-to-default-domain Enabled 
```

|Parameter  |Value  |Description  |
|---------|---------|---------|
|`endpoint-name`     |`myendpoint`       |Name of the endpoint.       |
|forwarding-protocol     |MatchRequest       |Protocol this rule uses when forwarding traffic to backends.       |
|`route-name`     |`route`       |Name of the route.       |
|https-redirect     |`Enabled`       |Whether to automatically redirect HTTP traffic to HTTPS traffic.       |
|`supported-protocols`     |`Https`       |List of supported protocols for this route.       |
|`link-to-default-domain`     |`Enabled`       |Whether this route is linked to the default endpoint domain.       |

Allow about 15 minutes for this step to complete as it takes some time for this change to propagate globally. After this period, your Azure Front Door is fully functional.

## Test the Front Door

When you create the Azure Front Door Standard/Premium profile, it takes a few minutes for the configuration to be deployed globally. Once completed, you can access the frontend host you created.

Run [`az afd endpoint show`](/cli/azure/afd/endpoint#az-afd-endpoint-show) to get the hostname of the Front Door endpoint.

```azurecli-interactive
az afd endpoint show --resource-group my-deid --profile-name myfrontdoorprofile --endpoint-name myendpoint --query "hostName"
```

In a browser, go to the endpoint hostname that the previous command returned: `<endpoint>.azurefd.net/health`. Your request should automatically get routed to the primary de-identification service in East US.

To test instant global failover:

1. Open a browser and go to the endpoint hostname: `<endpoint>.azurefd.net/health`.
1. Follow the steps at [Configure private access](/azure/healthcare-apis/deidentification/configure-private-endpoints#configure-private-access) to disable public network access for the de-identification service in East US.
1. Refresh your browser. You should see the same information page because traffic is now directed to the de-identification service in West US.

    > [!TIP]
    > You might need to refresh the page a few times for the failover to complete.

1. Now disable public network access for the de-identification service in West US.
1. Refresh your browser. This time, you should see an error message.
1. Re-enable public network access for one of the de-identification services. Refresh your browser and you should see the health status again.

You've now validated that you can access your apps through Azure Front Door and that failover functions as intended. Enable public network access on the other service if you're done with failover testing.

#### Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command:

```azurecli-interactive
az group delete --name my-deid
```

This command might take a few minutes to complete.

#### Initiate recovery
In the case of disaster, you can check the health status of your de-identification service (preview) by sending requests to `<service-url>/health`.

## Related content

- [Reliability in Azure](/azure/availability-zones/overview.md)