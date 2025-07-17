---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
During an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

The following section describes what to expect when App Service plans are configured for zone redundancy and one or more availability zones are unavailable:

- **Detection and response:** The App Service platform automatically detects failures in an availability zone and initiates a response. No manual intervention is required to initiate a zone failover.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an App Service plan instance in the faulty availability zone are terminated. They need to be retried.

- **Traffic rerouting:** When a zone is unavailable, App Service detects the lost instances from that zone and automatically attempts to find new replacement instances.  Once it finds replacements, it then distributes traffic across the new instances as needed.

    If autoscale is configured and it determines that more instances are needed, it issues a request to App Service to add those instances. Autoscale behavior operates independently of App Service platform behavior, meaning that your instance count specification doesn't need to be a multiple of two. For more information, see [Scale up an app in App Service](/azure/app-service/manage-scale-up) and [Autoscale overview](/azure/azure-monitor/autoscale/autoscale-overview).

    > [!IMPORTANT]
    > There's no guarantee that requests for more instances in a zone-down scenario succeed. The backfilling of lost instances occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your App Service plans to account for the loss of a zone. You can achieve this by [over-provisioning the capacity of your App Service plan](#capacity-planning-and-management).

- **Nonruntime behaviors:** Applications that are deployed in a zone-redundant App Service plan continue to run and serve traffic even if an availability zone experiences an outage. However, nonruntime behaviors might be affected during an availability zone outage. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.