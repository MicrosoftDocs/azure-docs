---
title: Operational excellence recommendations
description: Operational excellence recommendations
ms.topic: article
author: mabrahms
ms.author: v-mabrahms
ms.custom: ignite-2022
ms.date: 10/05/2023
---

# Operational excellence recommendations

Operational excellence recommendations in Azure Advisor can help you with: 
- Process and workflow efficiency.
- Resource manageability.
- Deployment best practices. 

You can get these recommendations on the **Operational Excellence** tab of the Advisor dashboard.

1. Sign in to the [**Azure portal**](https://portal.azure.com).

1. Search for and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page.

1. On the **Advisor** dashboard, select the **Operational Excellence** tab.


## AI + machine learning

### Upgrade to the latest version of the Immersive Reader SDK

We have identified resources under this subscription using outdated versions of the Immersive Reader SDK. The latest version of the Immersive Reader SDK provides you with updated security, performance, and an expanded set of features for customizing and enhancing your integration experience.

Learn more about [Azure AI Immersive Reader](/azure/ai-services/immersive-reader/).

### Upgrade to the latest version of the Immersive Reader SDK

We have identified resources under this subscription using outdated versions of the Immersive Reader SDK. The latest version of the Immersive Reader SDK provides you with updated security, performance and an expanded set of features for customizing and enhancing your integration experience.

Learn more about [Cognitive Service - ImmersiveReaderSDKRecommendation (Upgrade to the latest version of the Immersive Reader SDK)](https://aka.ms/ImmersiveReaderAzureAdvisorSDKLearnMore).



## Analytics

### Reduce the cache policy on your Data Explorer tables

Reduce the table cache policy to match the usage patterns (query lookback period)

Learn more about [Data explorer resource - ReduceCacheForAzureDataExplorerTablesOperationalExcellence (Reduce the cache policy on your Data Explorer tables)](https://aka.ms/adxcachepolicy).




## Compute

### Update your outdated Azure Spring Apps SDK to the latest version

We have identified API calls from an outdated Azure Spring Apps SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about the [Azure Spring Apps service](../spring-apps/index.yml).

### Update Azure Spring Apps API Version

We have identified API calls from outdated Azure Spring Apps API for resources under this subscription. We recommend switching to the latest Azure Spring Apps API version. You need to update your existing code to use the latest API version. Also, you need to upgrade your Azure SDK and Azure CLI to the latest version, which ensures you receive the latest features and performance improvements.

Learn more about the [Azure Spring Apps service](../spring-apps/index.yml).

### New HCX version is available for upgrade

Your HCX version isn't latest. New HCX version is available for upgrade. Updating a VMware HCX system installs the latest features, problem fixes, and security patches.

Learn more about [AVS Private cloud - HCXVersion (New HCX version is available for upgrade)](https://aka.ms/vmware/hcxdoc).

### Recreate your pool to get the latest node agent features and fixes

Your pool has an old node agent. Consider recreating your pool to get the latest node agent updates and bug fixes.

Learn more about [Batch account - OldPool (Recreate your pool to get the latest node agent features and fixes)](https://aka.ms/batch_oldpool_learnmore).

### Delete and recreate your pool to remove a deprecated internal component

Your pool is using a deprecated internal component. Delete and recreate your pool for improved stability and performance.

Learn more about [Batch account - RecreatePool (Delete and recreate your pool to remove a deprecated internal component)](https://aka.ms/batch_deprecatedcomponent_learnmore).

### Upgrade to the latest API version to ensure your Batch account remains operational

In the past 14 days, you have invoked a Batch management or service API version that is scheduled for deprecation. Upgrade to the latest API version to ensure your Batch account remains operational.

Learn more about [Batch account - UpgradeAPI (Upgrade to the latest API version to ensure your Batch account remains operational.)](https://aka.ms/batch_deprecatedapi_learnmore).

### Delete and recreate your pool using a different VM size

Your pool is using A8-A11 VMs, which are set to be retired in March 2021. Delete your pool and recreate it with a different VM size.

Learn more about [Batch account - RemoveA8_A11Pools (Delete and recreate your pool using a different VM size)](https://aka.ms/batch_a8_a11_retirement_learnmore).

### Recreate your pool with a new image

Your pool is using an image with an imminent expiration date. Recreate the pool with a new image to avoid potential interruptions. A list of newer images is available via the ListSupportedImages API.

Learn more about [Batch account - EolImage (Recreate your pool with a new image)](https://aka.ms/batch_expiring_image_learn_more).

### Increase the number of compute resources you can deploy by 10 vCPU

If quota limits are exceeded, new VM deployments are blocked until quota is increased. Increase your quota now to enable deployment of more resources. Learn More

Learn more about [Virtual machine - IncreaseQuotaExperiment (Increase the number of compute resources you can deploy by 10 vCPU)](https://aka.ms/SubscriptionServiceLimits).

### Add Azure Monitor to your virtual machine (VM) labeled as production

Azure Monitor for VMs monitors your Azure virtual machines (VM) and Virtual Machine Scale Sets at scale. It analyzes the performance and health of your Windows and Linux VMs,  and it monitors their processes and dependencies on other resources and external processes. It includes support for monitoring performance and application dependencies for VMs that are hosted on-premises or in another cloud provider.

Learn more about [Virtual machine - AddMonitorProdVM (Add Azure Monitor to your virtual machine (VM) labeled as production)](/azure/azure-monitor/insights/vminsights-overview).

### Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers

Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers. Frequent DNS lookups and NTP sync can be viewed as malicious traffic and blocked by the DDOS service in the Azure environment

Learn more about [Virtual machine - GetVmlistFortigateNtpIssue (Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers.)](https://docs.fortinet.com/document/fortigate/6.2.3/fortios-release-notes/236526/known-issues).

### An Azure environment update has been rolled out that might affect your Checkpoint Firewall

The image version of the Checkpoint firewall installed might have been affected by the recent Azure environment update. A kernel panic resulting in a reboot to factory defaults can occur in certain circumstances.

Learn more about [Virtual machine - NvaCheckpointNicServicing (An Azure environment update has been rolled out that might affect your Checkpoint Firewall.)](https://supportcenter.checkpoint.com/supportcenter/portal).

### The iControl REST interface has an unauthenticated remote command execution vulnerability

An unauthenticated remote command execution vulnerability allows for unauthenticated attackers with network access to the iControl REST interface, through the BIG-IP management interface and self IP addresses, to execute arbitrary system commands, create or delete files, and disable services. This vulnerability can only be exploited through the control plane and can't be exploited through the data plane. Exploitation can lead to complete system compromise. The BIG-IP system in Appliance mode is also vulnerable

Learn more about [Virtual machine - GetF5vulnK03009991 (The iControl REST interface has an unauthenticated remote command execution vulnerability.)](https://support.f5.com/csp/article/K03009991).

### NVA Accelerated Networking enabled but potentially not working

Desired state for Accelerated Networking is set to ‘true’ for one or more interfaces on your VM, but actual state for accelerated networking isn't enabled.

Learn more about [Virtual machine - GetVmListANDisabled (NVA Accelerated Networking enabled but potentially not working.)](../virtual-network/create-vm-accelerated-networking-cli.md).

### Virtual machines with Citrix Application Delivery Controller (ADC) and accelerated networking enabled might disconnect during maintenance operation

We have identified that you're running a Network virtual Appliance (NVA) called Citrix Application Delivery Controller (ADC), and the NVA has accelerated networking enabled. The Virtual machine that this NVA is deployed on might experience connectivity issues during a platform maintenance operation. It is recommended that you follow the article provided by the vendor: https://aka.ms/Citrix_CTX331516

Learn more about [Virtual machine - GetCitrixVFRevokeError (Virtual machines with Citrix Application Delivery Controller (ADC) and accelerated networking enabled might disconnect during maintenance operation)](https://aka.ms/Citrix_CTX331516).

### Update your outdated Azure Spring Cloud SDK to the latest version

We have identified API calls from an outdated Azure Spring Cloud SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [Spring Cloud Service - SpringCloudUpgradeOutdatedSDK (Update your outdated Azure Spring Cloud SDK to the latest version)](/azure/spring-cloud).

### Update Azure Spring Cloud API Version

We have identified API calls from outdated Azure Spring Cloud API for resources under this subscription. We recommend switching to the latest Spring Cloud API version. You need to update your existing code to use the latest API version. Also, you need to upgrade your Azure SDK and Azure CLI to the latest version, which ensures you receive the latest features and performance improvements.

Learn more about [Spring Cloud Service - UpgradeAzureSpringCloudAPI (Update Azure Spring Cloud API Version)](/azure/spring-cloud).





## Containers

### The api version you use for Microsoft.App is deprecated,  use latest api version

The api version you use for Microsoft.App is deprecated,  use latest api version

Learn more about [Microsoft App Container App - UseLatestApiVersion (The api version you use for Microsoft.App is deprecated,  use latest api version)](https://aka.ms/containerappsapiversion).

### Update cluster's service principal

This cluster's service principal is expired and the cluster isn't healthy until the service principal is updated

Learn more about [Kubernetes service - UpdateServicePrincipal (Update cluster's service principal)](../aks/update-credentials.md).

### Monitoring addon workspace is deleted

Monitoring addon workspace is deleted. Correct issues to set up monitoring addon.

Learn more about [Kubernetes service - MonitoringAddonWorkspaceIsDeleted (Monitoring addon workspace is deleted)](https://aka.ms/aks-disable-monitoring-addon).

### Deprecated Kubernetes API in 1.16 is found

Deprecated Kubernetes API in 1.16 is found. Avoid using deprecated API.

Learn more about [Kubernetes service - DeprecatedKubernetesAPIIn116IsFound (Deprecated Kubernetes API in 1.16 is found)](https://aka.ms/aks-deprecated-k8s-api-1.16).

### Enable the Cluster Autoscaler

This cluster has not enabled AKS Cluster Autoscaler, and it can't adapt to changing load conditions unless you have other ways to autoscale your cluster

Learn more about [Kubernetes service - EnableClusterAutoscaler (Enable the Cluster Autoscaler)](/azure/aks/cluster-autoscaler).

### The AKS node pool subnet is full

Some of the subnets for this cluster's node pools are full and can't take any more worker nodes. Using the Azure CNI plugin requires to reserve IP addresses for each node and all the pods for the node at node provisioning time. If there isn't enough IP address space in the subnet, no worker nodes can be deployed. Additionally, the AKS cluster can't be upgraded if the node subnet is full.

Learn more about [Kubernetes service - NodeSubnetIsFull (The AKS node pool subnet is full)](../aks/create-node-pools.md#add-a-node-pool-with-a-unique-subnet).

### Expired ETCD cert

Expired ETCD cert,  update.

Learn more about [Kubernetes service - ExpiredETCDCertPre03012022 (Expired ETCD cert)](https://aka.ms/AKSUpdateCredentials).

### Disable the Application Routing Addon

This cluster has Pod Security Policies enabled, which are going to be deprecated in favor of Azure Policy for AKS

Learn more about [Kubernetes service - UseAzurePolicyForKubernetes (Disable the Application Routing Addon)](/azure/aks/use-pod-security-on-azure-policy).

### Use Ephemeral OS disk

This cluster isn't using ephemeral OS disks which can provide lower read/write latency, along with faster node scaling and cluster upgrades

Learn more about [Kubernetes service - UseEphemeralOSdisk (Use Ephemeral OS disk)](../aks/concepts-storage.md#ephemeral-os-disk).

### Outdated Azure Linux (Mariner) OS SKUs Found

Found outdated Azure Linux (Mariner) OS SKUs. 'CBL-Mariner' SKU isn't supported. 'Mariner' SKU is equivalent to 'AzureLinux', but it's advisable to switch to 'AzureLinux' SKU for future updates and support, as 'AzureLinux' is the Generally Available version.

Learn more about [Kubernetes service - ClustersWithDeprecatedMarinerSKU (Outdated Azure Linux (Mariner) OS SKUs Found)](https://aka.ms/AzureLinuxOSSKU).

### Free and Standard tiers for AKS control plane management

This cluster has not enabled the Standard tier that includes the Uptime SLA by default, and is limited to an SLO of 99.5%.

Learn more about [Kubernetes service - Free and Standard Tier](../aks/free-standard-pricing-tiers.md).

### Deprecated Kubernetes API in 1.22 has been found

Deprecated Kubernetes API in 1.22 has been found. Avoid using deprecated APIs.

Learn more about [Kubernetes service - DeprecatedKubernetesAPIIn122IsFound (Deprecated Kubernetes API in 1.22 has been found)](https://aka.ms/aks-deprecated-k8s-api-1.22).



## Databases

### Azure SQL IaaS Agent must be installed in full mode

Full mode installs the SQL IaaS Agent to the VM to deliver full functionality. Use it for managing a SQL Server VM with a single instance. There is no cost associated with using the full manageability mode. System administrator permissions are required. Note that installing or upgrading to full mode is an online operation, there is no restart required.

Learn more about [SQL virtual machine - UpgradeToFullMode (SQL IaaS Agent must be installed in full mode)](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management).

### Install SQL best practices assessment on your SQL VM

SQL best practices assessment provides a mechanism to evaluate the configuration of your Azure SQL VM for best practices like indexes, deprecated features, trace flag usage, statistics, etc. Assessment results are uploaded to your Log Analytics workspace using Azure Monitoring Agent (AMA).

Learn more about [SQL virtual machine - SqlAssessmentAdvisorRec (Install SQL best practices assessment on your SQL VM)](/azure/azure-sql/virtual-machines/windows/sql-assessment-for-sql-vm).

### Migrate Azure Cosmos DB attachments to Azure Blob Storage

We noticed that your Azure Cosmos DB collection is using the legacy attachments feature. We recommend migrating attachments to Azure Blob Storage to improve the resiliency and scalability of your blob data.

Learn more about [Azure Cosmos DB account - CosmosDBAttachments (Migrate Azure Cosmos DB attachments to Azure Blob Storage)](../cosmos-db/attachments.md#migrating-attachments-to-azure-blob-storage).

### Improve resiliency by migrating your Azure Cosmos DB accounts to continuous backup

Your Azure Cosmos DB accounts are configured with periodic backup. Continuous backup with point-in-time restore is now available on these accounts. With continuous backup, you can restore your data to any point in time within the past 30 days. Continuous backup might also be more cost-effective as a single copy of your data is retained.

Learn more about [Azure Cosmos DB account - CosmosDBMigrateToContinuousBackup (Improve resiliency by migrating your Azure Cosmos DB accounts to continuous backup)](../cosmos-db/continuous-backup-restore-introduction.md).

### Enable partition merge to configure an optimal database partition layout

Your account has collections that could benefit from enabling partition merge. Minimizing the number of partitions reduces rate limiting and resolve storage fragmentation problems. Containers are likely to benefit from this if the RU/s per physical partition is < 3000 RUs and storage is < 20 GB.

Learn more about [Cosmos DB account - CosmosDBPartitionMerge (Enable partition merge to configure an optimal database partition layout)](/azure/cosmos-db/merge?tabs=azure-powershell).



### Your Azure Database for MySQL - Flexible Server is vulnerable using weak, deprecated TLSv1 or TLSv1.1 protocols

To support modern security standards, MySQL community edition discontinued the support for communication over Transport Layer Security (TLS) 1.0 and 1.1 protocols. Microsoft also stopped supporting connections over TLSv1 and TLSv1.1 to Azure Database for MySQL - Flexible server to comply with the modern security standards. We recommend you upgrade your client driver to support TLSv1.2.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMySqlTlsDeprecation (Your Azure Database for MySQL - Flexible Server is vulnerable using weak, deprecated TLSv1 or TLSv1.1 protocols)](https://aka.ms/encrypted_connection_deprecated_protocols).

### Optimize or partition tables in your database which has huge tablespace size

The maximum supported tablespace size in Azure Database for MySQL -Flexible server is 4TB. To effectively manage large tables, we recommended that you optimize the table or implement partitioning, which helps distribute the data across multiple files and prevent reaching the hard limit of 4TB in the tablespace.

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerSingleTablespace4TBLimit2bf9 (Optimize or partition tables in your database which has huge tablespace size)](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/how-to-reclaim-storage-space-with-azure-database-for-mysql/ba-p/3615876).

### Enable storage autogrow for MySQL Flexible Server

Storage auto-growth prevents a server from running out of storage and becoming read-only.

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerStorageAutogrow43b64 (Enable storage autogrow for MySQL Flexible Server)](/azure/mysql/flexible-server/concepts-service-tiers-storage#storage-auto-grow).

### Apply resource delete lock

Lock your MySQL Flexible Server to protect from accidental user deletions and modifications

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerResourceLockbe19e (Apply resource delete lock)](/azure/azure-resource-manager/management/lock-resources).

### Add firewall rules for MySQL Flexible Server

Add firewall rules to protect your server from unauthorized access

Learn more about [Azure Database for MySQL flexible server - MySqlFlexibleServerNoFirewallRule6e523 (Add firewall rules for MySQL Flexible Server)](/azure/mysql/flexible-server/how-to-manage-firewall-portal).


### Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration, which is a common source of incidents affecting customer applications

Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration. It's difficult to configure the network accurately and avoid affecting cache functionality. It's easy to break the cache accidentally while making configuration changes for other network resources, which is a common source of incidents affecting customer applications

Learn more about [Redis Cache Server - PrivateLink (Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration. This is a common source of incidents affecting customer applications)](https://aka.ms/VnetToPrivateLink).

### Support for TLS versions 1.0 and 1.1 is retiring on September 30, 2024

Support for TLS 1.0/1.1 is retiring on September 30, 2024. Configure your cache to use TLS 1.2 only and your application to use TLS 1.2 or later. See https://aka.ms/TLSVersions for more information.

Learn more about [Redis Cache Server - TLSVersion (Support for TLS versions 1.0 and 1.1 is retiring on September 30, 2024.)](https://aka.ms/TLSVersions).

### TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses

TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses. We highly recommend that you configure your cache to use TLS 1.2 only and your application to use TLS 1.2 or later. See https://aka.ms/TLSVersions for more information.

Learn more about [Redis Cache Server - TLSVersion (TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses.)](https://aka.ms/TLSVersions).

### Cloud service caches are being retired in August 2024, migrate before then to avoid any problems

This instance of Azure Cache for Redis has a dependency on Cloud Services (classic) which is being retired in August 2024. Follow the instructions found in the following link to migrate to an instance without this dependency. If you need to upgrade your cache to Redis 6  note that upgrading a cache with a dependency on cloud services isn't supported. You must migrate your cache instance to Virtual Machine Scale Set before upgrading. For more information, see the following link. Note: If you have completed your migration away from Cloud Services,  allow up to 24 hours for this recommendation to be removed

Learn more about [Redis Cache Server - MigrateFromCloudService (Cloud service caches are being retired in August 2024, migrate before then to avoid any problems)](/azure/azure-cache-for-redis/cache-faq#caches-with-a-dependency-on-cloud-services-%28classic%29).

### Redis persistence allows you to persist data stored in a cache so you can reload data from an event that caused data loss.

Redis persistence allows you to persist data stored in Redis. You can also take snapshots and back up the data. If there's a hardware failure, the persisted data is automatically loaded in your cache instance.  Data loss is possible if a failure occurs where Cache nodes are down.

Learn more about [Redis Cache Server - Persistence (Redis persistence allows you to persist data stored in a cache so you can reload data from an event that caused data loss.)](https://aka.ms/redis/persistence).

### Using persistence with soft delete enabled can increase storage costs.

Check to see if your storage account has soft delete enabled before using the data persistence feature. Using data persistence with soft delete causes very high storage costs. For more information, see the following link.

Learn more about [Redis Cache Server - PersistenceSoftEnable (Using persistence with soft delete enabled can increase storage costs.)](https://aka.ms/redis/persistence).

### You might benefit from using an Enterprise tier cache instance

This instance of Azure Cache for Redis is using one or more advanced features from the list - more than 6 shards, geo-replication, zone-redundancy or persistence. Consider switching to an Enterprise tier cache to get the most out of your Redis experience. Enterprise tier caches offer higher availability, better performance and more powerful features like active geo-replication.

Learn more about [Redis Cache Server - ConsiderUsingRedisEnterprise (You might benefit from using an Enterprise tier cache instance)](https://aka.ms/redisenterpriseupgrade).





## Integration

### Use Azure AD-based authentication for more fine-grained control and simplified management

You can use Azure AD-based authentication, instead of gateway tokens, which allows you to use standard procedures to create, assign and manage permissions and control expiry times. Additionally, you gain fine-grained control across gateway deployments and easily revoke access in case of a breach.

Learn more about [Api Management - ShgwUseAdAuth (Use Azure AD-based authentication for more fine-grained control and simplified management)](https://aka.ms/apim/shgw/how-to/use-ad-auth).

### Validate JWT policy is being used with security keys that have insecure key size for validating Json Web Token (JWT).

Validate JWT policy is being used with security keys that have insecure key size for validating Json Web Token (JWT). We recommend using longer key sizes to improve security for JWT-based authentication & authorization.

Learn more about [Api Management - validate-jwt-with-insecure-key-size (Validate JWT policy is being used with security keys that have insecure key size for validating Json Web Token (JWT).)]().

### Use self-hosted gateway v2

We have identified one or more instances of your self-hosted gateway(s) that are using a deprecated version of the self-hosted gateway (v0.x and/or v1.x).

Learn more about [Api Management - shgw-legacy-image-usage (Use self-hosted gateway v2)](https://aka.ms/apim/shgw/migration/v2).

### Use Configuration API v2 for self-hosted gateways

We have identified one or more instances of your self-hosted gateway(s) that are using the deprecated Configuration API v1.

Learn more about [Api Management - shgw-config-api-v1-usage (Use Configuration API v2 for self-hosted gateways)](https://aka.ms/apim/shgw/migration/v2).

### Only allow tracing on subscriptions intended for debugging purposes. Sharing subscription keys with tracing allowed with unauthorized users could lead to disclosure of sensitive information contained in tracing logs such as keys, access tokens, passwords, internal hostnames, and IP addresses.

Traces generated by Azure API Management service might contain sensitive information that is intended for service owner and must not be exposed to clients using the service. Using tracing enabled subscription keys in production or automated scenarios creates a risk of sensitive information exposure if client making call to the service requests a trace.

Learn more about [Api Management - heavy-tracing-usage (Only allow tracing on subscriptions intended for debugging purposes. Sharing subscription keys with tracing allowed with unauthorized users could lead to disclosure of sensitive information contained in tracing logs such as keys, access tokens, passwords, internal hostnames, and IP addresses.)](/azure/api-management/api-management-howto-api-inspector).

### Self-hosted gateway instances were identified that use gateway tokens that expire soon

At least one deployed self-hosted gateway instance was identified that uses a gateway token that expires in the next seven days. To ensure that it can connect to the control-plane, generate a new gateway token and update your deployed self-hosted gateways  (does not impact data-plane traffic).

Learn more about [Api Management - ShgwGatewayTokenNearExpiry (Self-hosted gateway instance(s) were identified that use gateway tokens that expire soon)]().


## Internet of Things

### IoT Hub Fallback Route Disabled

We have detected that the Fallback Route on your IoT Hub has been disabled. When the Fallback Route is disabled messages stop flowing to the default endpoint. If you're no longer able to ingest telemetry downstream consider re-enabling the Fallback Route.

Learn more about [IoT hub - IoTHubFallbackDisabledAdvisor (IoT Hub Fallback Route Disabled)](/azure/iot-hub/iot-hub-devguide-messages-d2c#fallback-route).




## Management and governance

### Upgrade to Start/Stop VMs v2

The new version of Start/Stop VMs v2 (preview) provides a decentralized low-cost automation option for customers who want to optimize their VM costs. It offers all of the same functionality as the original version available with Azure Automation, but it is designed to take advantage of newer technology in Azure.

Learn more about [Automation account - SSV1_Upgrade (Upgrade to Start/Stop VMs v2)](https://aka.ms/startstopv2docs).

### Repair your log alert rule

We have detected that one or more of your alert rules have invalid queries specified in their condition section. Log alert rules are created in Azure Monitor and are used to run analytics queries at specified intervals. The results of the query determine if an alert needs to be triggered. Analytics queries might become invalid overtime due to changes in referenced resources, tables, or commands. We recommend that you correct the query in the alert rule to prevent it from getting auto-disabled and ensure monitoring coverage of your resources in Azure.

Learn more about [Alert Rule - ScheduledQueryRulesLogAlert (Repair your log alert rule)](https://aka.ms/aa_logalerts_queryrepair).

### Log alert rule was disabled

The alert rule was disabled by Azure Monitor as it was causing service issues. To enable the alert rule, contact support.

Learn more about [Alert Rule - ScheduledQueryRulesRp (Log alert rule was disabled)](https://aka.ms/aa_logalerts_queryrepair).

### Update Azure Managed Grafana SDK Version

We have identified that an older SDK version has been used to manage or access your Grafana workspace. To get access to all the latest functionality, it is recommended that you switch to use the latest SDK version.

Learn more about [Grafana Dashboard - UpdateAzureManagedGrafanaSDK (Update Azure Managed Grafana SDK Version)](https://aka.ms/GrafanaPortalLearnMore).

### Switch to Azure Monitor based alerts for backup

Switch to Azure Monitor based alerts for backup to leverage various benefits, such as - standardized, at-scale alert management experiences offered by Azure, ability to route alerts to different notification channels of choice, and greater flexibility in alert configuration.

Learn more about [Recovery Services vault - SwitchToAzureMonitorAlerts (Switch to Azure Monitor based alerts for backup)](https://aka.ms/AzMonAlertsBackup).




## Networking

### Resolve Certificate Update issue for your Application Gateway

We have detected that one or more of your Application Gateways is unable to fetch the latest version certificate present in your Key Vault. If it is intended to use a particular version of the certificate,  ignore this message.

Learn more about [Application gateway - AppGwAdvisorRecommendationForCertificateUpdateErrors (Resolve Certificate Update issue for your Application Gateway)]().

### Resolve Azure Key Vault issue for your Application Gateway

We've detected that one or more of your Application Gateways is unable to obtain a certificate due to misconfigured Key Vault. You must fix this configuration immediately to avoid operational issues with your gateway.

Learn more about [Application gateway - AppGwAdvisorRecommendationForKeyVaultErrors (Resolve Azure Key Vault issue for your Application Gateway)](https://aka.ms/agkverror).

### Application Gateway does not have enough capacity to scale out

We've detected that your Application Gateway subnet does not have enough capacity for allowing scale-out during high traffic conditions, which can cause downtime.

Learn more about [Application gateway - AppgwRestrictedSubnetSpace (Application Gateway does not have enough capacity to scale out)](https://aka.ms/application-gateway-faq).

### Enable Traffic Analytics to view insights into traffic patterns across Azure resources

Traffic Analytics is a cloud-based solution that provides visibility into user and application activity in Azure. Traffic analytics analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow. With traffic analytics, you can view top talkers across Azure and non Azure deployments, investigate open ports, protocols and malicious flows in your environment and optimize your network deployment for performance. You can process flow logs at 10 mins and 60 mins processing intervals, giving you faster analytics on your traffic.

Learn more about [Network Security Group - NSGFlowLogsenableTA (Enable Traffic Analytics to view insights into traffic patterns across Azure resources)](https://aka.ms/aa_enableta_learnmore).

### Set up staging environments in Azure App Service

Deploy an app to a slot first and then swap it into production to ensure that all instances of the slot are warmed up before being swapped and eliminate downtime. The traffic redirection is seamless, no requests are dropped because of swap operations.

Learn more about [Subscription - AzureApplicationService (Set up staging environments in Azure App Service)](../app-service/deploy-staging-slots.md).

### Enforce 'Add or replace a tag on resources' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce different rules and effects over your resources. Enforce a policy that adds or replaces the specified tag and value when any resource is created or updated. Existing resources can be remediated by triggering a remediation task, which does not modify tags on resource groups.

Learn more about [Subscription - AddTagPolicy (Enforce 'Add or replace a tag on resources' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Allowed locations' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce different rules and effects over your resources. Enforce a policy that enables you to restrict the locations your organization can specify when deploying resources. Use the policy to enforce your geo-compliance requirements.

Learn more about [Subscription - AllowedLocationsPolicy (Enforce 'Allowed locations' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Audit VMs that do not use managed disks' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce different rules and effects over your resources. Enforce a policy that audits VMs that do not use managed disks.

Learn more about [Subscription - AuditForManagedDisksPolicy (Enforce 'Audit VMs that do not use managed disks' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Allowed virtual machine SKUs' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce different rules and effects over your resources. Enforce a policy that enables you to specify a set of virtual machine SKUs that your organization can deploy.

Learn more about [Subscription - AllowedVirtualMachineSkuPolicy (Enforce 'Allowed virtual machine SKUs' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Inherit a tag from the resource group' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies that enforce different rules and effects over your resources. Enforce a policy that adds or replaces the specified tag and value from the parent resource group when any resource is created or updated. Existing resources can be remediated by triggering a remediation task.

Learn more about [Subscription - InheritTagPolicy (Enforce 'Inherit a tag from the resource group' using Azure Policy)](../governance/policy/overview.md).

### Use Azure Lighthouse to simply and securely manage customer subscriptions at scale

Using Azure Lighthouse improves security and reduces unnecessary access to your customer tenants by enabling more granular permissions for your users. It also allows for greater scalability, as your users can work across multiple customer subscriptions using a single login in your tenant.

Learn more about [Subscription - OnboardCSPSubscriptionsToLighthouse (Use Azure Lighthouse to simply and securely manage customer subscriptions at scale)](../lighthouse/concepts/cloud-solution-provider.md).

### Subscription with more than 10 VNets must be managed using AVNM

Subscription with more than 10 VNets must be managed using AVNM. Azure Virtual Network Manager is a management service that enables you to group, configure, deploy, and manage virtual networks globally across subscriptions.

Learn more about [Subscription - ManageVNetsUsingAVNM (Subscription with more than 10 VNets must be managed using AVNM)](/azure/virtual-network-manager/).

### VNet with more than 5 peerings must be managed using AVNM connectivity configuration

VNet with more than 5 peerings must be managed using AVNM connectivity configuration. Azure Virtual Network Manager is a management service that enables you to group, configure, deploy, and manage virtual networks globally across subscriptions.

Learn more about [Virtual network - ManagePeeringsUsingAVNM (VNet with more than 5 peerings must be managed using AVNM connectivity configuration)]().

### Upgrade NSG flow logs to VNet flow logs

Virtual Network flow log allows you to record IP traffic flowing in a virtual network. It provides several benefits over Network Security Group flow log like simplified enablement, enhanced coverage, accuracy, performance and observability of Virtual Network Manager rules and encryption status.

Learn more about [Resource - UpgradeNSGToVnetFlowLog (Upgrade NSG flow logs to VNet flow logs)](https://aka.ms/vnetflowlogspreviewdocs).





## SAP for Azure

### Ensure the HANA DB VM type supports the HANA scenario in your SAP workload

Correct VM type needs to be selected for the specific HANA Scenario. The HANA scenarios can be 'OLAP', 'OLTP', 'OLAP: Scaleup' and 'OLTP: Scaleup'. See SAP note 1928533 for the correct VM type for your SAP workload. The correct VM type helps ensure better performance and support for your SAP systems

Learn more about [Database Instance - HanaDBSupport (Ensure the HANA DB VM type supports the HANA scenario in your SAP workload)](https://launchpad.support.sap.com/#/notes/1928533).

### Ensure the Operating system in App VM is supported in combination with DB type in your SAP workload

Operating system in the VMs in your SAP workload need to be supported for the DB type selected. See SAP note 1928533 for the correct OS-DB combinations for the ASCS, Database and Application VMs to ensure better performance and support for your SAP systems

Learn more about [App Server Instance - AppOSDBSupport (Ensure the Operating system in App VM is supported in combination with DB type in your SAP workload)](https://launchpad.support.sap.com/#/notes/1928533).

### Set the parameter net.ipv4.tcp_keepalive_time to '300' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add net.ipv4.tcp_keepalive_time = 300 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads in order.

Learn more about [App Server Instance - AppIPV4TCPKeepAlive (Set the parameter net.ipv4.tcp_keepalive_time to '300' in the Application VM OS in SAP workloads)](https://launchpad.support.sap.com/#/notes/1410736).

### Ensure the Operating system in DB VM is supported for the DB type in your SAP workload

Operating system in the VMs in your SAP workload need to be supported for the DB type selected. See SAP note 1928533 for the correct OS-DB combinations for the ASCS, Database and Application VMs to ensure better performance and support for your SAP systems

Learn more about [Database Instance - DBOSDBSupport (Ensure the Operating system in DB VM is supported for the DB type in your SAP workload)](https://launchpad.support.sap.com/#/notes/1928533).

### Set the parameter net.ipv4.tcp_retries2 to '15' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add  net.ipv4.tcp_retries2 = 15 to enable faster reconnection after an ASCS failover. This is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIpv4Retries2 (Set the parameter net.ipv4.tcp_retries2 to '15' in the Application VM OS in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019722#:~:text=To%20check%20for%20current%20values%20of%20certain%20TCP%20tuning).

### See the parameter net.ipv4.tcp_keepalive_probes to '9' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add net.ipv4.tcp_keepalive_probes = 9 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIPV4Probes (See the parameter net.ipv4.tcp_keepalive_probes to '9' in the Application VM OS in SAP workloads)](/azure/virtual-machines/workloads/sap/high-availability-guide).

### Set the parameter net.ipv4.tcp_tw_recycle to '0' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add  net.ipv4.tcp_tw_recycle = 0 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIpv4Recycle (Set the parameter net.ipv4.tcp_tw_recycle to '0' in the Application VM OS in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019722#:~:text=To%20check%20for%20current%20values%20of%20certain%20TCP%20tuning).

### Ensure the Operating system in ASCS VM is supported in combination with DB type in your SAP workload

Operating system in the VMs in your SAP workload need to be supported for the DB type selected. See SAP note 1928533 for the correct OS-DB combinations for the ASCS, Database and Application VMs. The correct OS-DB combinations help ensure better performance and support for your SAP systems

Learn more about [Central Server Instance - ASCSOSDBSupport (Ensure the Operating system in ASCS VM is supported in combination with DB type in your SAP workload)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system must be certified for SAP.

Learn more about [App Server Instance - VM_0001 (Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Set the parameter net.ipv4.tcp_retries1 to '3' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add  net.ipv4.tcp_retries1 = 3 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIpv4Retries1 (Set the parameter net.ipv4.tcp_retries1 to '3' in the Application VM OS in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019722#:~:text=To%20check%20for%20current%20values%20of%20certain%20TCP%20tuning).

### Set the parameter net.ipv4.tcp_tw_reuse to '0' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add  net.ipv4.tcp_tw_reuse = 0 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIpv4TcpReuse (Set the parameter net.ipv4.tcp_tw_reuse to '0' in the Application VM OS in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019722#:~:text=To%20check%20for%20current%20values%20of%20certain%20TCP%20tuning).

### Set the parameter net.ipv4.tcp_keepalive_intvl to '75' in the Application VM OS in SAP workloads

In the Application VM OS, edit the /etc/sysctl.conf file and add net.ipv4.tcp_keepalive_intvl = 75 to enable faster reconnection after an ASCS failover. This setting is recommended for all Application VM OS in SAP workloads.

Learn more about [App Server Instance - AppIPV4intvl (Set the parameter net.ipv4.tcp_keepalive_intvl to '75' in the Application VM OS in SAP workloads)](/azure/virtual-machines/workloads/sap/high-availability-guide).




### Ensure Accelerated Networking is enabled on all NICs for improved performance of SAP workloads

Network latency between App VMs and DB VMs for SAP workloads is required to be 0.7ms or less. If accelerated networking isn't enabled, network latency can increase beyond the threshold of 0.7ms

Learn more about [Database Instance - NIC_0001_DB (Ensure Accelerated Networking is enabled on all NICs for improved performance of SAP workloads)](https://launchpad.support.sap.com/#/notes/1928533).

### Ensure Accelerated Networking is enabled on all NICs for improved performance of SAP workloads

Network latency between App VMs and DB VMs for SAP workloads is required to be 0.7ms or less. If accelerated networking isn't enabled, network latency can increase beyond the threshold of 0.7ms

Learn more about [App Server Instance - NIC_0001 (Ensure Accelerated Networking is enabled on all NICs for improved performance of SAP workloads)](https://launchpad.support.sap.com/#/notes/1928533).




### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [Database Instance - NIC_0001_DB (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [App Server Instance - NIC_0001 (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [Central Server Instance - NIC_0001_ASCS (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system must be certified for SAP.

Learn more about [Central Server Instance - VM_0001_ASCS (Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system must be certified for SAP.

Learn more about [Database Instance - VM_0001_DB (Azure Center for SAP recommendation: All VMs in SAP system must be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads

fstrim scans the filesystem and sends 'UNMAP' commands for each unused block it finds; useful in thin-provisioned system if the system is over-provisioned. Running SAP HANA on an over-provisioned storage array isn't recommended. Active fstrim can cause XFS metadata corruption See SAP note: 2205917

Learn more about [App Server Instance - GetFsTrimForApp (Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019447).

### Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads

fstrim scans the filesystem and sends 'UNMAP' commands for each unused block it finds; useful in thin-provisioned system if the system is over-provisioned. Running SAP HANA on an over-provisioned storage array isn't recommended. Active fstrim can cause XFS metadata corruption See SAP note: 2205917

Learn more about [Central Server Instance - GetFsTrimForAscs (Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019447).

### Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads

fstrim scans the filesystem and sends 'UNMAP' commands for each unused block it finds; useful in thin-provisioned system if the system is over-provisioned. Running SAP HANA on an over-provisioned storage array isn't recommended. Active fstrim can cause XFS metadata corruption See SAP note: 2205917

Learn more about [Database Instance - GetFsTrimForDb (Disable fstrim in SLES OS to avoid XFS metadata corruption in SAP workloads)](https://www.suse.com/support/kb/doc/?id=000019447).

### For better performance and support, ensure HANA data filesystem type is supported for HANA DB

For different volumes of SAP HANA, where asynchronous I/O is used, SAP only supports filesystems validated as part of an SAP HANA appliance certification. Using an unsupported filesystem might lead to various operational issues, e.g. hanging recovery and index server crashes. See SAP note 2972496.

Learn more about [Database Instance - HanaDataFileSystemSupported (For better performance and support, ensure HANA data filesystem type is supported for HANA DB)](https://launchpad.support.sap.com/#/notes/2972496).

### For better performance and support, ensure HANA shared filesystem type is supported for HANA DB

For different volumes of SAP HANA, where asynchronous I/O is used, SAP only supports filesystems validated as part of an SAP HANA appliance certification. Using an unsupported filesystem might lead to various operational issues, e.g. hanging recovery and index server crashes. See SAP note 2972496.

Learn more about [Database Instance - HanaSharedFileSystem (For better performance and support, ensure HANA shared filesystem type is supported for HANA DB)](https://launchpad.support.sap.com/#/notes/2972496).


### For better performance and support, ensure HANA log filesystem type is supported for HANA DB

For different volumes of SAP HANA, where asynchronous I/O is used, SAP only supports filesystems validated as part of an SAP HANA appliance certification. Using an unsupported filesystem might lead to various operational issues, e.g. hanging recovery and index server crashes. See SAP note 2972496.

Learn more about [Database Instance - HanaLogFileSystemSupported (For better performance and support, ensure HANA log filesystem type is supported for HANA DB)](https://launchpad.support.sap.com/#/notes/2972496).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system must be attached to the same VNET.

Learn more about [App Server Instance - AllVmsHaveSameVnetApp (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Swap space on HANA systems must be 2GB

Azure Center for SAP solutions recommendation: Swap space on HANA systems must be 2GB.

Learn more about [Database Instance - SwapSpaceForSap (Azure Center for SAP recommendation: Swap space on HANA systems must be 2GB)](https://launchpad.support.sap.com/#/notes/1999997).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system must be attached to the same VNET.

Learn more about [Central Server Instance - AllVmsHaveSameVnetAscs (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system must be attached to the same VNET.

Learn more about [Database Instance - AllVmsHaveSameVnetDb (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Ensure network configuration is optimized for HANA and OS

Azure Center for SAP  solutions recommendation: Ensure network configuration is optimized for HANA and OS.

Learn more about [Database Instance - NetworkConfigForSap (Azure Center for SAP recommendation: Ensure network configuration is optimized for HANA and OS)](https://launchpad.support.sap.com/#/notes/2382421).



## Storage

### Create a backup of HSM

Create a periodic HSM backup to prevent data loss and have ability to recover the HSM in case of a disaster.

Learn more about [Managed HSM Service - CreateHSMBackup (Create a backup of HSM)](../key-vault/managed-hsm/best-practices.md#create-backups).

### Application Volume Group SDK Recommendation

The minimum API version for Azure NetApp Files application volume group feature must be 2022-01-01. We recommend using 2022-03-01 when possible to fully leverage the API.

Learn more about [Volume - Application Volume Group SDK version recommendation (Application Volume Group SDK Recommendation)](https://aka.ms/anf-sdkversion).

### Availability Zone Volumes SDK Recommendation

The minimum SDK version of 2022-05-01 is recommended for the Azure NetApp Files Availability zone volume placement feature, to enable deployment of new Azure NetApp Files volumes in the Azure availability zone (AZ) that you specify.

Learn more about [Volume - Azure NetApp Files AZ Volume SDK version recommendation (Availability Zone Volumes SDK Recommendation)](https://aka.ms/anf-sdkversion).

### Cross Zone Replication SDK recommendation

The minimum SDK version of 2022-05-01 is recommended for the Azure NetApp Files Cross Zone Replication feature, to enable you to replicate volumes across availability zones within the same region.

Learn more about [Volume - Azure NetApp Files Cross Zone Replication SDK recommendation (Cross Zone Replication SDK recommendation)](https://aka.ms/anf-sdkversion).

### Volume Encryption using Customer Managed Keys with Azure Key Vault SDK Recommendation

The minimum API version for Azure NetApp Files Customer Managed Keys with Azure Key Vault feature is 2022-05-01.

Learn more about [Volume - CMK with AKV SDK Recommendation (Volume Encryption using Customer Managed Keys with Azure Key Vault SDK Recommendation)]().

### Cool Access SDK Recommendation

The minimum SDK version of 2022-03-01 is recommended for Standard service level with cool access feature to enable moving inactive data to an Azure storage account (the cool tier) and free up storage that resides within Azure NetApp Files volumes, resulting in overall cost savings.

Learn more about [Capacity Pool - Azure NetApp Files Cool Access SDK version recommendation (Cool Access SDK Recommendation)](https://aka.ms/anf-sdkversion).

### Large Volumes SDK Recommendation

The minimum SDK version of 2022-xx-xx is recommended for automation of large volume creation, resizing and deletion.

Learn more about [Volume - Large Volumes SDK Recommendation (Large Volumes SDK Recommendation)](/azure/azure-netapp-files/azure-netapp-files-resource-limits).

### Prevent hitting subscription limit for maximum storage accounts

A region can support a maximum of 250 storage accounts per subscription. You have either already reached or are about to reach that limit. If you reach that limit, you're unable to create any more storage accounts in that subscription/region combination. Evaluate the recommended action below to avoid hitting the limit.

Learn more about [Storage Account - StorageAccountScaleTarget (Prevent hitting subscription limit for maximum storage accounts)](https://aka.ms/subscalelimit).

### Update to newer releases of the Storage Java v12 SDK for better reliability.

We noticed that one or more of your applications use an older version of the Azure Storage Java v12 SDK to write data to Azure Storage. Unfortunately, the version of the SDK being used has a critical issue that uploads incorrect data during retries (for example, in case of HTTP 500 errors), resulting in an invalid object being written. The issue is fixed in newer releases of the Java v12 SDK.

Learn more about [Storage Account - UpdateStorageJavaSDK (Update to newer releases of the Storage Java v12 SDK for better reliability.)](/azure/developer/java/sdk/?view=azure-java-stable&preserve-view=true).





## Virtual desktop infrastructure

### Permissions missing for start VM on connect

We have determined you enabled start VM on connect but didn't grant the Azure Virtual Desktop the rights to power manage VMs in your subscription. As a result your users connecting to host pools won't receive a remote desktop session. Review feature documentation for requirements.

Learn more about [Host Pool - AVDStartVMonConnect (Permissions missing for start VM on connect)](https://aka.ms/AVDStartVMRequirement).

### No validation environment enabled

We have determined that you do not have a validation environment enabled in current subscription. When creating your host pools, you have selected "No" for "Validation environment" in the properties tab. Having at least one host pool with a validation environment enabled ensures the business continuity through Azure Virtual Desktop service deployments with early detection of potential issues.

Learn more about [Host Pool - ValidationEnvHostPools (No validation environment enabled)](../virtual-desktop/create-validation-host-pool.md).

### Not enough production environments enabled

We have determined that too many of your host pools have Validation Environment enabled. In order for Validation Environments to best serve their purpose, you must have at least one, but never more than half of your host pools in Validation Environment. By having a healthy balance between your host pools with Validation Environment enabled and those with it disabled, you're best able to utilize the benefits of the multistage deployments that Azure Virtual Desktop offers with certain updates. To fix this issue, open your host pool's properties and select "No" next to the "Validation Environment" setting.

Learn more about [Host Pool - ProductionEnvHostPools (Not enough production environments enabled)](../virtual-desktop/create-host-pools-powershell.md).




## Web

### Set up staging environments in Azure App Service

Deploy an app to a slot first and then swap it into production to ensure that all instances of the slot are warmed up before being swapped and eliminate downtime. The traffic redirection is seamless, no requests are dropped because of swap operations.

Learn more about [App service - AzureAppService-StagingEnv (Set up staging environments in Azure App Service)](../app-service/deploy-staging-slots.md).

### Update Service Connector API Version

We have identified API calls from outdated Service Connector API for resources under this subscription. We recommend switching to the latest Service Connector API version. You need to update your existing code or tools to use the latest API version.

Learn more about [App service - UpgradeServiceConnectorAPI (Update Service Connector API Version)](/azure/service-connector).

### Update Service Connector SDK to the latest version

We have identified API calls from an outdated Service Connector SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [App service - UpgradeServiceConnectorSDK (Update Service Connector SDK to the latest version)](/azure/service-connector).






## Next steps

Learn more about [Operational Excellence - Microsoft Azure Well Architected Framework](/azure/architecture/framework/devops/overview)
