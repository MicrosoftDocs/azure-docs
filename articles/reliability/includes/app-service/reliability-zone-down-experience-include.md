---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---
An availability zone outage might affect some aspects of App Service, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

Expect the following outcomes when you configure App Service plans for zone redundancy and one or more availability zones are unavailable:

- **Detection and response:** The App Service platform automatically detects failures in an availability zone and initiates a response. No manual intervention is required to initiate a zone failover.

- **Notification:** You can monitor zone failure events through Azure Service Health and Azure Resource Health. Set up alerts on these services to receive notifications about zone-level problems.

- **Active requests:** Any in-progress requests that connect to an App Service plan instance in the faulty availability zone are terminated. Retry those requests.

- **Traffic rerouting:** App Service detects the lost instances from that zone and attempts to find new replacement instances. After App Service finds replacements, it distributes traffic across the new instances as needed.

    If autoscale is configured and determines that more instances are needed, it requests instances from App Service. Autoscale behavior operates independently of App Service platform behavior. So your instance count specification doesn't need to be a multiple of two. For more information, see [Scale up an app in App Service](/azure/app-service/manage-scale-up) and [Autoscale overview](/azure/azure-monitor/autoscale/autoscale-overview).

    > [!IMPORTANT]
    > Azure doesn't guarantee that requests for more instances succeed in a zone-down scenario. The platform attempts to backfill lost instances on a best-effort basis. If you need guaranteed capacity during an availability zone failure, create and configure your App Service plans to account for zone loss by [over-provisioning the capacity](#capacity-planning-and-management).

- **Nonruntime behaviors:** Applications in a zone-redundant App Service plan continue to run and serve traffic even if an availability zone experiences an outage. However, nonruntime behaviors might be affected during an availability zone outage. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.