---
title: Reliability in Azure Health Data Services De-identification Service
description: Learn how to ensure healthcare data privacy with reliable de-identification services. Use active-active configurations and Azure Front Door for traffic routing.
author: jovinson-ms
ms.author: jovinson
ms.topic: reliability-article
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.date: 09/27/2024
#Customer intent: As an IT admin, I want to understand reliability support for the de-identification service so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in the Azure Health Data Services de-identification service

This article describes reliability support in the Azure Health Data Services de-identification service. For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Cross-region disaster recovery

[!INCLUDE [introduction to disaster recovery](~/reusable-content/ce-skilling/azure/includes/reliability/reliability-disaster-recovery-description-include.md)]

Each de-identification service is deployed to a single Azure region. If an entire region isn't available or performance is significantly degraded:

- The control plane functionality of Azure Resource Manager is limited to read-only during the outage. Microsoft always backs up your service metadata (such as resource properties) outside the region. After the outage is over, you can read and write to the control plane.

- All data plane requests, such as de-identification or job API requests, fail during the outage. No customer data is lost, but there's the potential for job progress metadata to be lost. After the outage is over, you can read and write to the data plane.

## Disaster recovery tutorial

If an entire Azure region isn't available, you can still assure high availability of your workloads. You can deploy two or more de-identification services in an *active-active* configuration. An active-active configuration distributes requests across multiple active regions. Use Azure Front Door to route traffic to both regions.

With this example architecture:

- Identical de-identification services are deployed in two separate regions.

- Azure Front Door routes traffic to both regions.

- During a disaster, one region becomes offline, and Azure Front Door routes traffic exclusively to the other region. The recovery time objective is the time Azure Front Door takes to detect that one service is unhealthy.

If you adopt the active-active configuration, you can expect a recovery time objective (RTO) of five minutes. In any configuration, you can expect a recovery point objective (RPO) of zero minutes (no customer data is lost).

### Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

To complete this tutorial:

[!INCLUDE [Azure-CLI-prepare-your-environment-no-header.md](~/reusable-content/Azure-CLI/Azure-CLI-prepare-your-environment-no-header.md)]

### Create a resource group

You need two instances of a de-identification service in different Azure regions for this tutorial. The tutorial uses the East US and West US 2 regions, but feel free to choose your own regions.

To make management and clean-up simpler, you use a single resource group for all resources in this tutorial. Consider using separate resource groups for each region or resource to further isolate your resources in a disaster recovery situation.

Run the following command to create your resource group.

```azurecli-interactive
az group create --name my-deid --location eastus
```

### Create de-identification services

Follow the steps at [Quickstart: Deploy the de-identification service](/azure/healthcare-apis/deidentification/quickstart) to create two separate services, one in East US and one in West US 2.

Note the service URL of each de-identification service. You need this information when you deploy Azure Front Door in the next step.

### Create a deployment

A multiregion deployment can use an active-active or active-passive configuration. An active-active configuration distributes requests across multiple active regions. An active-passive configuration keeps running instances in the secondary region, but doesn't send traffic there unless the primary region fails.

You can enable these configurations in Azure Front Door. For more information on designing apps for high availability and fault tolerance, see [Architect Azure applications for resiliency and availability](/azure/architecture/reliability/architect).

### Create a profile

You now create a profile in Azure Front Door to route traffic to your services. Run [`az afd profile create`](/cli/azure/afd/profile#az-afd-profile-create).

> [!NOTE]
> If you want to deploy Azure Front Door Standard instead of Premium, substitute the value of the `--sku` parameter with `Standard_AzureFrontDoor`. You can't deploy managed rules with a web application firewall (WAF) policy if you choose the Standard tier. For a detailed comparison of the pricing tiers, see [Azure Front Door tier comparison](/azure/frontdoor/standard-premium/tier-comparison).

```azurecli-interactive
az afd profile create --profile-name myfrontdoorprofile --resource-group my-deid --sku Premium_AzureFrontDoor
```

|Parameter         |Value                    |Description                                                                       |
|------------------|-------------------------|----------------------------------------------------------------------------------|
|`profile-name`    |`myfrontdoorprofile`     |Name for the Azure Front Door profile, which is unique within the resource group. |
|`resource-group`  |`my-deid`                |Resource group that contains the resources from this tutorial.                    |
|`sku`             |`Premium_AzureFrontDoor` |Pricing tier of the Azure Front Door profile.                                     |

### Add an endpoint

To create an endpoint in your Azure Front Door profile, run [`az afd endpoint create`](/cli/azure/afd/endpoint#az-afd-endpoint-create). This endpoint routes requests to your services. You can create multiple endpoints in your profile after you finish this tutorial.

```azurecli-interactive
az afd endpoint create --resource-group my-deid --endpoint-name myendpoint --profile-name myfrontdoorprofile --enabled-state Enabled
```

|Parameter        |Value        |Description                                                       |
|-----------------|-------------|------------------------------------------------------------------|
|`endpoint-name`  |`myendpoint` |Name of the endpoint under the profile, which is unique globally. |
|`enabled-state`  |`Enabled`    |Whether to enable this endpoint.                                  |

### Create an origin group

To create an origin group that contains your two de-identification services, run [`az afd origin-group create`](/cli/azure/afd/origin-group#az-afd-origin-group-create).

```azurecli-interactive
az afd origin-group create --resource-group my-deid --origin-group-name myorigingroup --profile-name myfrontdoorprofile --probe-request-type GET --probe-protocol Https --probe-interval-in-seconds 60 --probe-path /health --sample-size 1 --successful-samples-required 1 --additional-latency-in-milliseconds 50 --enable-health-probe
```

|Parameter                            |Value          |Description                                                                          |
|-------------------------------------|---------------|-------------------------------------------------------------------------------------|
|`origin-group-name`                  |`myorigingroup`|Name of the origin group.                                                            |
|`probe-request-type`                 |`GET`          |Type of health probe request that is made.                                           |
|`probe-protocol`                     |`Https`        |Protocol to use for health probe.                                                    |
|`probe-interval-in-seconds`          |`60`           |Number of seconds between health probes.                                             |
|`probe-path`                         |`/health`      |Path relative to the origin that is used to determine the health of the origin.      |
|`sample-size`                        |`1`            |Number of samples to consider for load balancing decisions.                          |
|`successful-samples-required`        |`1`            |Number of samples within the sample period that must succeed.                        |
|`additional-latency-in-milliseconds` |`50`           |Extra latency in milliseconds for probes to fall into the lowest latency bucket.     |
|`enable-health-probe`                |Not applicable |Switch to control the status of the health probe.                                    |

### Add origins to the origin group

To add an origin to your origin group, run [`az afd origin create`](/cli/azure/afd/origin#az-afd-origin-create). For the `--host-name` and `--origin-host-header` parameters, replace the placeholder value `<service-url-east-us>` with your East US service URL, leaving out the scheme (`https://`). You have a value like `abcdefghijk.api.eastus.deid.azure.com`.

```azurecli-interactive
az afd origin create --resource-group my-deid --host-name <service-url-east-us> --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name deid1 --origin-host-header <service-url-east-us> --priority 1 --weight 1000 --enabled-state Enabled --https-port 443
```

|Parameter              |Value                   |Description                                                                                          |
|-----------------------|------------------------|-----------------------------------------------------------------------------------------------------|
|`host-name`            |`<service-url-east-us>` |Host name of the primary de-identification service.                                                  |
|`origin-name`          |`deid1`                 |Name of the origin.                                                                                  |
|`origin-host-header`   |`<service-url-east-us>` |Host header to send for requests to this origin.                                                     |
|`priority`             |`1`                     |Priority. Set this parameter to 1 to direct all traffic to the primary de-identification service.    |
|`weight`               |`1000`                  |Weight of the origin in specified origin group for load balancing. Must be between `1` and `1000`.   |
|`enabled-state`        |`Enabled`               |Whether to enable this origin.                                                                       |
|`https-port`           |`443`                   |Port used for HTTPS requests to the origin.                                                          |

Repeat this step to add your second origin. For the `--host-name` and `--origin-host-header` parameters, replace the placeholder value `<service-url-west-us-2>` with your West US 2 service URL, leaving out the scheme (`https://`).

```azurecli-interactive
az afd origin create --resource-group my-deid --host-name <service-url-west-us-2> --profile-name myfrontdoorprofile --origin-group-name myorigingroup --origin-name deid2 --origin-host-header <service-url-west-us-2> --priority 1 --weight 1000 --enabled-state Enabled --https-port 443
```

Pay attention to the `--priority` parameters in both commands. Because both origins are set to priority `1`, Azure Front Door treats both origins as active and directs traffic to both regions. If the priority for one origin is set to `2`, Azure Front Door treats that origin as secondary. All traffic goes to the other origin unless that origin goes down.

### Add a route

To map your endpoint to the origin group, run [`az afd route create`](/cli/azure/afd/route#az-afd-route-create). This route forwards requests from the endpoint to your origin group.

```azurecli-interactive
az afd route create --resource-group my-deid --profile-name myfrontdoorprofile --endpoint-name myendpoint --forwarding-protocol MatchRequest --route-name route  --origin-group myorigingroup --supported-protocols Https --link-to-default-domain Enabled 
```

|Parameter                  |Value          |Description                                                        |
|---------------------------|---------------|-------------------------------------------------------------------|
|`endpoint-name`            |`myendpoint`   |Name of the endpoint.                                              |
|`forwarding-protocol`      |`MatchRequest` |Protocol this rule uses when forwarding traffic to back ends.      |
|`route-name`               |`route`        |Name of the route.                                                 |
|`supported-protocols`      |`Https`        |List of supported protocols for this route.                        |
|`link-to-default-domain`   |`Enabled`      |Whether this route is linked to the default endpoint domain.       |

Allow about 15 minutes for this step to finish. It takes some time for this change to propagate globally. After this period, your Azure Front Door profile is fully functional.

### Test the profile

When you create the Azure Front Door profile, it takes a few minutes for the configuration to be deployed globally. After this period, you can access the host that you created.

To get the host name of the Azure Front Door endpoint, run [`az afd endpoint show`](/cli/azure/afd/endpoint#az-afd-endpoint-show). It looks like `abddefg.azurefd.net`.

```azurecli-interactive
az afd endpoint show --resource-group my-deid --profile-name myfrontdoorprofile --endpoint-name myendpoint --query "hostName"
```

In a browser, go to the endpoint host name that the previous command returned: `<endpoint>.azurefd.net/health`. Your request automatically gets routed to the primary de-identification service in East US.

To test instant global failover:

1. Open a browser and go to the endpoint host name: `<endpoint>.azurefd.net/health`.

1. Follow the steps at [Configure private access](/azure/healthcare-apis/deidentification/configure-private-endpoints#configure-private-access) to disable public network access for the de-identification service in East US.

1. Refresh your browser. You see the same information page because traffic is now directed to the de-identification service in West US 2.

    > [!TIP]
    > You might need to refresh the page a few times for the failover to complete.

1. Now disable public network access for the de-identification service in West US 2.

1. Refresh your browser. This time, you see an error message.

1. Re-enable public network access for one of the de-identification services. Refresh your browser and you see the health status again.

You've now validated that you can access your services through Azure Front Door and that failover functions as intended. Enable public network access on the other service if you're done with failover testing.

### Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't need these resources in the future, delete the resource group by running the following command:

```azurecli-interactive
az group delete --name my-deid
```

This command might take a few minutes to finish.

### Initiate recovery

To check the recovery status of your service, you can send requests to `<service-url>/health`.

## Related content

- [Reliability in Azure](/azure/reliability/overview)
