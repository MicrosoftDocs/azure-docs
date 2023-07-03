---
title: Disaster recovery guide
description: Learn three common disaster recovery patterns for Azure App Service. 
keywords: app service, azure app service, hadr, disaster recovery, business continuity, high availability, bcdr

ms.topic: article
ms.date: 03/07/2023
ms.reviewer: mahender
ms.custom: "UpdateFrequency3, seodec18, fasttrack-edit"
---
# Strategies for business continuity and disaster recovery in Azure App Service

Most organizations have a business continuity plan to maintain availability of their applications during downtime and the preservation of their data in a regional disaster. This article covers some common strategies for web apps deployed to App Service.

For example, when you create a web app in App Service and choose an Azure region during resource creation, it's a single-region app. When the region becomes unavailable during a disaster, your application also becomes unavailable. If you create an identical deployment in a secondary Azure region, your application becomes less susceptible to a single-region disaster, which guarantees business continuity, and any data replication across the regions lets you recover your last application state.

For IT, business continuity plans are largely driven by two metrics:
 
- Recovery Time Objective (RTO) – the time duration in which your application must come back online after an outage. 
- Recovery Point Objective (RPO) – the acceptable amount of data loss in a disaster, expressed as a unit of time (for example, 1 minute of transactional database records). 

Normally, maintaining an SLA around RTO is impractical for regional disasters, and you would typically design your disaster recovery strategy around RPO alone (i.e. focus on recovering data and not on minimizing interruption). With Azure, however, it's not only practical but could even be straightforward to deploy App Service for automatic geo-failovers. This lets you disaster-proof your applications further by taking care of both RTO and RPO.

Depending on your desired RTO and RPO metrics, three disaster recovery architectures are commonly used, as shown in the following table:
 
|.| Active-Active regions | Active-Passive regions | Passive/Cold region|
|-|-|-|-|
|RTO| Real-time or seconds| Minutes| Hours |
|RPO| Real-time or seconds| Minutes| Hours |
|Cost | $$$| $$| $|
|Scenarios| Mission-critical apps| High-priority apps| Low-priority apps|
|Ability to serve multi-region user traffic| Yes| Yes/maybe| No|
|Code deployment | CI/CD pipelines preferred| CI/CD pipelines preferred| Backup and restore |
|Creation of new App Service resources during downtime | Not required | Not required| Required |

## Active-Active architecture

In this disaster recovery approach, identical web apps are deployed in two separate regions and Azure Front door is used to route traffic to both the active regions.

:::image type="content" source="media/overview-disaster-recovery/active-active-architecture.png" alt-text="Diagram that shows an active-active deployment of App Service.":::

With this example architecture: 

- Identical App Service apps are deployed in two separate regions, including pricing tier and instance count. 
- Public traffic directly to the App Service apps is blocked. 
- Azure Front Door is used to route traffic to both the active regions.
- During a disaster, one of the regions becomes offline, and Azure Front Door routes traffic exclusively to the region that remains online. The RTO during such a geo-failover is near-zero.
- Application files should be deployed to both web apps with a CI/CD solution. This ensures that the RPO is practically zero. 
- If your application actively modifies the file system, the best way to minimize RPO is to only write to a [mounted Azure Storage share](configure-connect-to-azure-storage.md) instead of writing directly to the web app's */home* content share. Then, use the Azure Storage redundancy features ([GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage)) for your mounted share, which has an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).
- Review [important considerations](#important-considerations) for disaster recovery guidance on the rest of your architecture, such as Azure SQL Database and Azure Storage.

Steps to create an active-active architecture for your web app in App Service are summarized as follows: 

1. Create two App Service plans in two different Azure regions. Configure the two App Service plans identically.
1. Create two instances of your web app, with one in each App Service plan. 
1. Create an Azure Front Door profile with:
    - An endpoint.
    - Two origin groups, each with a priority of 1. The equal priority tells Azure Front Door to route traffic to both regions equally (thus active-active).
    - A route. 
1. [Limit network traffic to the web apps only from the Azure Front Door instance](app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance). 
1. Setup and configure all other back-end Azure service, such as databases, storage accounts, and authentication providers. 
1. Deploy code to both the web apps with [continuous deployment](deploy-continuous-deployment.md).

[Tutorial: Create a highly available multi-region app in Azure App Service](tutorial-multi-region-app.md) shows you how to set up an *active-passive* architecture. The same steps with minimal changes (setting priority to “1” for both origin groups in Azure Front Door) give you an *active-active* architecture.

## Active-passive architecture

In this disaster recovery approach, identical web apps are deployed in two separate regions and Azure Front door is used to route traffic to one region only (the *active* region).

:::image type="content" source="media/overview-disaster-recovery/active-passive-architecture.png" alt-text="A diagram showing an active-passive architecture of Azure App Service.":::

With this example architecture:

- Identical App Service apps are deployed in two separate regions.
- Public traffic directly to the App Service apps is blocked.
- Azure Front Door is used to route traffic to the primary region. 
- To save cost, the secondary App Service plan is configured to have fewer instances and/or be in a lower pricing tier. There are three possible approaches:
    - **Preferred**  The secondary App Service plan has the same pricing tier as the primary, with the same number of instances or fewer. This approach ensures parity in both feature and VM sizing for the two App Service plans. The RTO during a geo-failover only depends on the time to scale out the instances.
    - **Less preferred**  The secondary App Service plan has the same pricing tier type (such as PremiumV3) but smaller VM sizing, with lesser instances. For example, the primary region may be in P3V3 tier while the secondary region is in P1V3 tier. This approach still ensures feature parity for the two App Service plans, but the lack of size parity may require a manual scale-up when the secondary region becomes the active region. The RTO during a geo-failover depends on the time to both scale up and scale out the instances.
    - **Least-preferred**  The secondary App Service plan has a different pricing tier than the primary and lesser instances. For example, the primary region may be in P3V3 tier while the secondary region is in S1 tier. Make sure that the secondary App Service plan has all the features your application needs in order to run. Differences in features availability between the two may cause delays to your web app recovery. The RTO during a geo-failover depends on the time to both scale up and scale out the instances.
- Autoscale is configured on the secondary region in the event the active region becomes inactive. It’s advisable to have similar autoscale rules in both active and passive regions.
- During a disaster, the primary region becomes inactive, and the secondary region starts receiving traffic and becomes the active region.
- Once the secondary region becomes active, the network load triggers preconfigured autoscale rules to scale out the secondary web app.
- You may need to scale up the pricing tier for the secondary region manually, if it doesn't already have the needed features to run as the active region. For example, [autoscaling requires Standard tier or higher](https://azure.microsoft.com/pricing/details/app-service/windows/).
- When the primary region is active again, Azure Front Door automatically directs traffic back to it, and the architecture is back to active-passive as before.
- Application files should be deployed to both web apps with a CI/CD solution. This ensures that the RPO is practically zero. 
- If your application actively modifies the file system, the best way to minimize RPO is to only write to a [mounted Azure Storage share](configure-connect-to-azure-storage.md) instead of writing directly to the web app's */home* content share. Then, use the Azure Storage redundancy features ([GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage)) for your mounted share, which has an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).
- Review [important considerations](#important-considerations) for disaster recovery guidance on the rest of your architecture, such as Azure SQL Database and Azure Storage.

Steps to create an active-passive architecture for your web app in App Service are summarized as follows: 

1. Create two App Service plans in two different Azure regions. The secondary App Service plan may be provisioned using one of the approaches mentioned previously.
1. Configure autoscaling rules for the secondary App Service plan so that it scales to the same instance count as the primary when the primary region becomes inactive.
1. Create two instances of your web app, with one in each App Service plan. 
1. Create an Azure Front Door profile with:
    - An endpoint.
    - An origin group with a priority of 1 for the primary region.
    - A second origin group with a priority of 2 for the secondary region. The difference in priority tells Azure Front Door to prefer the primary region when it's online (thus active-passive).
    - A route. 
1. [Limit network traffic to the web apps only from the Azure Front Door instance](app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance). 
1. Setup and configure all other back-end Azure service, such as databases, storage accounts, and authentication providers. 
1. Deploy code to both the web apps with [continuous deployment](deploy-continuous-deployment.md).

[Tutorial: Create a highly available multi-region app in Azure App Service](tutorial-multi-region-app.md) shows you how to set up an *active-passive* architecture.

## Passive/cold region

In this disaster recovery approach, you create regular backups of your web app to an Azure Storage account.

With this example architecture:

- A single web app is deployed to a single region.
- The web app is regularly backed up to an Azure Storage account in the same region.
- The cross-region replication of your backups depends on the data redundancy configuration in the Azure storage account. You should set your Azure Storage account as [GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) if possible. GZRS offers both synchronous zone redundancy within a region and asynchronous in a secondary region. If GZRS isn't available, configure the account as [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage). Both GZRS and GRS have an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).
- To ensure that you can retrieve backups when the storage account's primary region becomes unavailable, [**enable read only access to secondary region**](../storage/common/storage-redundancy.md#read-access-to-data-in-the-secondary-region) (making the storage account **RA-GZRS** or **RA-GRS**, respectively). For more information on designing your applications to take advantage of geo-redundancy, see [Use geo-redundancy to design highly available applications](../storage/common/geo-redundant-design.md).
- During a disaster in the web app's region, you must manually deploy all required App Service dependent resources by using the backups from the Azure Storage account, most likely from the secondary region with read access. The RTO may be hours or days.
- To minimize RTO, it's highly recommended that you have a comprehensive playbook outlining all the steps required to restore your web app backup to another Azure Region. For more information, see [Important considerations](#important-considerations).
- Review [important considerations](#important-considerations) for disaster recovery guidance on the rest of your architecture, such as Azure SQL Database and Azure Storage.

Steps to create a passive-cold region for your web app in App Service are summarized as follows: 

1. Create an Azure storage account in the same region as your web app. Choose Standard performance tier and select redundancy as Geo-redundant storage (GRS) or Geo-Zone-redundant storage (GZRS).
1. Enable RA-GRS or RA-GZRS (read access for the secondary region). 
1. [Configure custom backup](manage-backup.md) for your web app. You may decide to set a schedule for your web app backups, such as hourly.
1. Verify that the web app backup files can be retrieved the secondary region of your storage account.

#### What if my web app's region doesn't have GZRS or GRS storage?

[Azure regions that don't have a regional pair](../reliability/cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair) don't have GRS nor GZRS. In this scenario, utilize zone-redundant storage (ZRS) or locally redundant storage (LRS) to create a similar architecture. For example, you can manually create a secondary region for the storage account as follows:

:::image type="content" source="media/overview-disaster-recovery/alternative-no-grs-no-gzrs.png" alt-text="Diagram that shows how to create a passive or cold region without GRS or GZRS." lightbox="media/overview-disaster-recovery/alternative-no-grs-no-gzrs.png":::

Steps to create a passive-cold region without GRS and GZRS are summarized as follows: 

1. Create an Azure storage account in the same region of your web app. Choose Standard performance tier and select redundancy as zone-redundant storage (ZRS).
1. [Configure custom backup](manage-backup.md) for your web app. You may decide to set a schedule for your web app backups, such as hourly.
1. Verify that the web app backup files can be retrieved the secondary region of your storage account.
1. Create a second Azure storage account in a different region. Choose Standard performance tier and select redundancy as locally redundant storage (LRS).
1. By using a tool like [AzCopy](../storage/common/storage-use-azcopy-v10.md#use-in-a-script), replicate your custom backup (Zip, XML and log files) from primary region to the secondary storage. For example: 

    ```
    azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>'
    ```
    You can use [Azure Automation with a PowerShell Workflow runbook](../automation/learn/automation-tutorial-runbook-textual.md) to run your replication script [on a schedule](../automation/shared-resources/schedules.md). Make sure that the replication schedule follows a similar schedule to the web app backups.

## Important considerations

- These disaster recovery strategies are applicable to both App Service multitenant and App Service Environments.
- Within the same region, an App Service app can be deployed into [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve high availability for your mission-critical workloads. For more information, see [Migrate App Service to availability zone support](../reliability/migrate-app-service.md).
- There are multiple ways to replicate your web apps content and configurations across Azure regions in an active-active or active-passive architecture, such as using [App service backup and restore](manage-backup.md). However, these options are point-in-time snapshots and eventually lead to web app versioning challenges across regions. To avoid these limitations, configure your CI/CD pipelines to deploy code to both the Azure regions. Consider using [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) or [GitHub Actions](https://docs.github.com/actions). For more information, see [Continuous deployment to Azure App Service](deploy-continuous-deployment.md).
- Use an infrastructure-as-Code (IaC) mechanism to manage your application resources in Azure. In a complex deployment across multiple regions, to manage the regions independently and to keep the configuration synchronized across regions in a reliable manner requires a predictable, testable, and repeatable process. Consider an IaC tool such as [Azure Resource Manager templates](../azure-resource-manager/management/overview.md) or [Terraform](/azure/developer/terraform/overview).
- Your application most likely depends on other data services in Azure, such as Azure SQL Database and Azure Storage accounts. You should develop disaster recovery strategies for each of these dependent Azure Services as well. For SQL Database, see [Active geo-replication for Azure SQL Database](/azure/azure-sql/database/active-geo-replication-overview). For Azure Storage, see [Azure Storage redundancy](../storage/common/storage-redundancy.md). 
- Aside from Azure Front Door, which is proposed in this article, Azure provides other load balancing options, such as Azure Traffic Manager. For a comparison of the various options, see [Load-balancing options - Azure Architecture Center](/azure/architecture/guide/technology-choices/load-balancing-overview).
- It's also recommended to set up monitoring and alerts for your web apps to for timely notifications during a disaster. For more information, see [Application Insights availability tests](../azure-monitor/app/availability-overview.md).

[!INCLUDE [backup-restore-vs-disaster-recovery](./includes/backup-restore-disaster-recovery.md)]

## Next steps

[Tutorial: Create a highly available multi-region app in Azure App Service](tutorial-multi-region-app.md)
