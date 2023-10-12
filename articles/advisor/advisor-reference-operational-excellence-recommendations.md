---
title: Operational excellence recommendations
description: Operational excellence recommendations
ms.topic: article
ms.custom: ignite-2022
ms.date: 02/02/2022
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


## Azure Spring Apps

### Update your outdated Azure Spring Apps SDK to the latest version

We have identified API calls from an outdated Azure Spring Apps SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about the [Azure Spring Apps service](../spring-apps/index.yml).

### Update Azure Spring Apps API Version

We have identified API calls from outdated Azure Spring Apps API for resources under this subscription. We recommend switching to the latest Azure Spring Apps API version. You need to update your existing code to use the latest API version. Also, you need to upgrade your Azure SDK and Azure CLI to the latest version. This ensures you receive the latest features and performance improvements.

Learn more about the [Azure Spring Apps service](../spring-apps/index.yml).

## Automation

### Upgrade to Start/Stop VMs v2

This new version of Start/Stop VMs v2 (preview) provides a decentralized low-cost automation option for customers who want to optimize their VM costs. It offers all of the same functionality as the original version available with Azure Automation, but it is designed to take advantage of newer technology in Azure.

Learn more about [Automation account - SSV1_Upgrade (Upgrade to Start/Stop VMs v2)](https://aka.ms/startstopv2docs).

## Azure VMware

### New HCX version is available for upgrade

Your HCX version is not latest. New HCX version is available for upgrade. Updating a VMware HCX system installs the latest features, problem fixes, and security patches.

Learn more about [AVS Private cloud - HCXVersion (New HCX version is available for upgrade)](https://aka.ms/vmware/hcxdoc).

## Batch

### Recreate your pool to get the latest node agent features and fixes

Your pool has an old node agent. Consider recreating your pool to get the latest node agent updates and bug fixes.

Learn more about [Batch account - OldPool (Recreate your pool to get the latest node agent features and fixes)](https://aka.ms/batch_oldpool_learnmore).

### Delete and recreate your pool to remove a deprecated internal component

Your pool is using a deprecated internal component. Please delete and recreate your pool for improved stability and performance.

Learn more about [Batch account - RecreatePool (Delete and recreate your pool to remove a deprecated internal component)](https://aka.ms/batch_deprecatedcomponent_learnmore).

### Upgrade to the latest API version to ensure your Batch account remains operational.

In the past 14 days, you have invoked a Batch management or service API version that is scheduled for deprecation. Upgrade to the latest API version to ensure your Batch account remains operational.

Learn more about [Batch account - UpgradeAPI (Upgrade to the latest API version to ensure your Batch account remains operational.)](https://aka.ms/batch_deprecatedapi_learnmore).

### Delete and recreate your pool using a VM size that will soon be retired

Your pool is using A8-A11 VMs, which are set to be retired in March 2021. Please delete your pool and recreate it with a different VM size.

Learn more about [Batch account - RemoveA8_A11Pools (Delete and recreate your pool using a VM size that will soon be retired)](https://aka.ms/batch_a8_a11_retirement_learnmore).

### Recreate your pool with a new image

Your pool is using an image with an imminent expiration date. Please recreate the pool with a new image to avoid potential interruptions. A list of newer images is available via the ListSupportedImages API.

Learn more about [Batch account - EolImage (Recreate your pool with a new image)](https://aka.ms/batch_expiring_image_learn_more).

## Cache for Redis

### Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration. This is a common source of incidents affecting customer applications

Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration. It's difficult to configure the network accurately and avoid affecting cache functionality. It's easy to break the cache accidentally while making configuration changes for other network resources. This is a common source of incidents affecting customer applications

Learn more about [Redis Cache Server - PrivateLink (Injecting a cache into a virtual network (VNet) imposes complex requirements on your network configuration. This is a common source of incidents affecting customer applications)](https://aka.ms/VnetToPrivateLink).

### TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses.

TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses. We highly recommend that you configure your cache to use TLS 1.2 only and your application should use TLS 1.2 or later. See https://aka.ms/TLSVersions for more information.

Learn more about [Redis Cache Server - TLSVersion (TLS versions 1.0 and 1.1 are known to be susceptible to security attacks, and have other Common Vulnerabilities and Exposures (CVE) weaknesses.)](https://aka.ms/TLSVersions).

## Azure AI services

### Upgrade to the latest version of the Immersive Reader SDK

We have identified resources under this subscription using outdated versions of the Immersive Reader SDK. Using the latest version of the Immersive Reader SDK provides you with updated security, performance and an expanded set of features for customizing and enhancing your integration experience.

Learn more about [Azure AI Immersive Reader](/azure/ai-services/immersive-reader/).

## Compute

### Increase the number of compute resources you can deploy by 10 vCPU

If quota limits are exceeded, new VM deployments will be blocked until quota is increased. Increase your quota now to enable deployment of more resources. Learn More

Learn more about [Virtual machine - IncreaseQuotaExperiment (Increase the number of compute resources you can deploy by 10 vCPU)](https://aka.ms/SubscriptionServiceLimits).

### Add Azure Monitor to your virtual machine (VM) labeled as production

Azure Monitor for VMs monitors your Azure virtual machines (VM) and Virtual Machine Scale Sets at scale. It analyzes the performance and health of your Windows and Linux VMs,  and it monitors their processes and dependencies on other resources and external processes. It includes support for monitoring performance and application dependencies for VMs that are hosted on-premises or in another cloud provider.

Learn more about [Virtual machine - AddMonitorProdVM (Add Azure Monitor to your virtual machine (VM) labeled as production)](/azure/azure-monitor/insights/vminsights-overview).

### Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers.

Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers. This can be viewed as malicious traffic and blocked by the DDOS service in the Azure environment

Learn more about [Virtual machine - GetVmlistFortigateNtpIssue (Excessive NTP client traffic caused by frequent DNS lookups and NTP sync for new servers, which happens often on some global NTP servers.)](https://docs.fortinet.com/document/fortigate/6.2.3/fortios-release-notes/236526/known-issues).

### An Azure environment update has been rolled out that may affect your Checkpoint Firewall.

The image version of the Checkpoint firewall installed may have been affected by the recent Azure environment update. A kernel panic resulting in a reboot to factory defaults can occur in certain circumstances.

Learn more about [Virtual machine - NvaCheckpointNicServicing (An Azure environment update has been rolled out that may affect your Checkpoint Firewall.)](https://supportcenter.checkpoint.com/supportcenter/portal).

### The iControl REST interface has an unauthenticated remote command execution vulnerability.

This vulnerability allows for unauthenticated attackers with network access to the iControl REST interface, through the BIG-IP management interface and self IP addresses, to execute arbitrary system commands, create or delete files, and disable services. This vulnerability can only be exploited through the control plane and cannot be exploited through the data plane. Exploitation can lead to complete system compromise. The BIG-IP system in Appliance mode is also vulnerable

Learn more about [Virtual machine - GetF5vulnK03009991 (The iControl REST interface has an unauthenticated remote command execution vulnerability.)](https://support.f5.com/csp/article/K03009991).

### NVA Accelerated Networking enabled but potentially not working.

Desired state for Accelerated Networking is set to ‘true’ for one or more interfaces on this VM, but actual state for accelerated networking is not enabled.

Learn more about [Virtual machine - GetVmListANDisabled (NVA Accelerated Networking enabled but potentially not working.)](../virtual-network/create-vm-accelerated-networking-cli.md).

### Virtual machines with Citrix Application Delivery Controller (ADC) and accelerated networking enabled may disconnect during maintenance operation

We have identified that you are running a Network virtual Appliance (NVA) called Citrix Application Delivery Controller (ADC), and the NVA has accelerated networking enabled. The Virtual machine that this NVA is deployed on may experience connectivity issues during a platform maintenance operation. It is recommended that you follow the article provided by the vendor: https://aka.ms/Citrix_CTX331516

Learn more about [Virtual machine - GetCitrixVFRevokeError (Virtual machines with Citrix Application Delivery Controller (ADC) and accelerated networking enabled may disconnect during maintenance operation)](https://aka.ms/Citrix_CTX331516).

## Kubernetes

### Update cluster's service principal

This cluster's service principal is expired and the cluster will not be healthy until the service principal is updated

Learn more about [Kubernetes service - UpdateServicePrincipal (Update cluster's service principal)](../aks/update-credentials.md).

### Monitoring addon workspace is deleted

Monitoring addon workspace is deleted. Correct issues to set up monitoring addon.

Learn more about [Kubernetes service - MonitoringAddonWorkspaceIsDeleted (Monitoring addon workspace is deleted)](https://aka.ms/aks-disable-monitoring-addon).

### Deprecated Kubernetes API in 1.16 is found

Deprecated Kubernetes API in 1.16 is found. Avoid using deprecated API.

Learn more about [Kubernetes service - DeprecatedKubernetesAPIIn116IsFound (Deprecated Kubernetes API in 1.16 is found)](https://aka.ms/aks-deprecated-k8s-api-1.16).

### Enable the Cluster Autoscaler

This cluster has not enabled AKS Cluster Autoscaler, and it will not adapt to changing load conditions unless you have other ways to autoscale your cluster

Learn more about [Kubernetes service - EnableClusterAutoscaler (Enable the Cluster Autoscaler)](/azure/aks/cluster-autoscaler).

### The AKS node pool subnet is full

Some of the subnets for this cluster's node pools are full and cannot take any more worker nodes. Using the Azure CNI plugin requires to reserve IP addresses for each node and all the pods for the node at node provisioning time. If there is not enough IP address space in the subnet, no worker nodes can be deployed. Additionally, the AKS cluster cannot be upgraded if the node subnet is full.

Learn more about [Kubernetes service - NodeSubnetIsFull (The AKS node pool subnet is full)](../aks/create-node-pools.md#add-a-node-pool-with-a-unique-subnet).

### Disable the Application Routing Addon

This cluster has Pod Security Policies enabled, which are going to be deprecated in favor of Azure Policy for AKS

Learn more about [Kubernetes service - UseAzurePolicyForKubernetes (Disable the Application Routing Addon)](/azure/aks/use-pod-security-on-azure-policy).

### Use Ephemeral OS disk

This cluster is not using ephemeral OS disks which can provide lower read/write latency, along with faster node scaling and cluster upgrades

Learn more about [Kubernetes service - UseEphemeralOSdisk (Use Ephemeral OS disk)](../aks/concepts-storage.md#ephemeral-os-disk).

### Free and Standard tiers for AKS control plane management

This cluster has not enabled the Standard tier which includes the Uptime SLA by default, and is limited to an SLO of 99.5%.

Learn more about [Kubernetes service - Free and Standard Tier](../aks/free-standard-pricing-tiers.md).

### Deprecated Kubernetes API in 1.22 has been found

Deprecated Kubernetes API in 1.22 has been found. Avoid using deprecated APIs.

Learn more about [Kubernetes service - DeprecatedKubernetesAPIIn122IsFound (Deprecated Kubernetes API in 1.22 has been found)](https://aka.ms/aks-deprecated-k8s-api-1.22).

## MySQL

### Your Azure Database for MySQL - Flexible Server is vulnerable using weak, deprecated TLSv1 or TLSv1.1 protocols

To support modern security standards, MySQL community edition discontinued the support for communication over Transport Layer Security (TLS) 1.0 and 1.1 protocols. Microsoft will also stop supporting connection over TLSv1 and TLSv1.1 to Azure Database for MySQL - Flexible server soon to comply with the modern security standards. We recommend you upgrade your client driver to support TLSv1.2.

Learn more about [Azure Database for MySQL flexible server - OrcasMeruMySqlTlsDeprecation (Your Azure Database for MySQL - Flexible Server is vulnerable using weak, deprecated TLSv1 or TLSv1.1 protocols)](https://aka.ms/encrypted_connection_deprecated_protocols).

## Desktop Virtualization

### Permissions missing for start VM on connect

We have determined you enabled start VM on connect but didn't grant the Azure Virtual Desktop the rights to power manage VMs in your subscription. As a result your users connecting to host pools won't receive a remote desktop session. Review feature documentation for requirements.

Learn more about [Host Pool - AVDStartVMonConnect (Permissions missing for start VM on connect)](https://aka.ms/AVDStartVMRequirement).

### No validation environment enabled

We have determined that you do not have a validation environment enabled in current subscription. When creating your host pools, you have selected "No" for "Validation environment" in the properties tab. Having at least one host pool with a validation environment enabled ensures the business continuity through Azure Virtual Desktop service deployments with early detection of potential issues.

Learn more about [Host Pool - ValidationEnvHostPools (No validation environment enabled)](../virtual-desktop/create-validation-host-pool.md).

### Not enough production environments enabled

We have determined that too many of your host pools have Validation Environment enabled. In order for Validation Environments to best serve their purpose, you should have at least one, but never more than half of your host pools in Validation Environment. By having a healthy balance between your host pools with Validation Environment enabled and those with it disabled, you will best be able to utilize the benefits of the multistage deployments that Azure Virtual Desktop offers with certain updates. To fix this issue, open your host pool's properties and select "No" next to the "Validation Environment" setting.

Learn more about [Host Pool - ProductionEnvHostPools (Not enough production environments enabled)](../virtual-desktop/create-host-pools-powershell.md).

## Azure Cosmos DB

### Migrate Azure Cosmos DB attachments to Azure Blob Storage

We noticed that your Azure Cosmos DB collection is using the legacy attachments feature. We recommend migrating attachments to Azure Blob Storage to improve the resiliency and scalability of your blob data.

Learn more about [Azure Cosmos DB account - CosmosDBAttachments (Migrate Azure Cosmos DB attachments to Azure Blob Storage)](../cosmos-db/attachments.md#migrating-attachments-to-azure-blob-storage).

### Improve resiliency by migrating your Azure Cosmos DB accounts to continuous backup

Your Azure Cosmos DB accounts are configured with periodic backup. Continuous backup with point-in-time restore is now available on these accounts. With continuous backup, you can restore your data to any point in time within the past 30 days. Continuous backup may also be more cost-effective as a single copy of your data is retained.

Learn more about [Azure Cosmos DB account - CosmosDBMigrateToContinuousBackup (Improve resiliency by migrating your Azure Cosmos DB accounts to continuous backup)](../cosmos-db/continuous-backup-restore-introduction.md).

## Monitor

### Repair your log alert rule

We have detected that one or more of your alert rules have invalid queries specified in their condition section. Log alert rules are created in Azure Monitor and are used to run analytics queries at specified intervals. The results of the query determine if an alert needs to be triggered. Analytics queries may become invalid overtime due to changes in referenced resources, tables, or commands. We recommend that you correct the query in the alert rule to prevent it from getting auto-disabled and ensure monitoring coverage of your resources in Azure.

Learn more about [Alert Rule - ScheduledQueryRulesLogAlert (Repair your log alert rule)](https://aka.ms/aa_logalerts_queryrepair).

### Log alert rule was disabled

The alert rule was disabled by Azure Monitor as it was causing service issues. To enable the alert rule, contact support.

Learn more about [Alert Rule - ScheduledQueryRulesRp (Log alert rule was disabled)](https://aka.ms/aa_logalerts_queryrepair).

## Key Vault

### Create a backup of HSM

Create a periodic HSM backup to prevent data loss and have ability to recover the HSM in case of a disaster.

Learn more about [Managed HSM Service - CreateHSMBackup (Create a backup of HSM)](../key-vault/managed-hsm/best-practices.md#create-backups).

## Data Explorer

### Reduce the cache policy on your Data Explorer tables

Reduce the table cache policy to match the usage patterns (query lookback period)

Learn more about [Data explorer resource - ReduceCacheForAzureDataExplorerTablesOperationalExcellence (Reduce the cache policy on your Data Explorer tables)](https://aka.ms/adxcachepolicy).

## Networking

### Resolve Azure Key Vault issue for your Application Gateway

We've detected that one or more of your Application Gateways is unable to obtain a certificate due to misconfigured Key Vault. You should fix this configuration immediately to avoid operational issues with your gateway.

Learn more about [Application gateway - AppGwAdvisorRecommendationForKeyVaultErrors (Resolve Azure Key Vault issue for your Application Gateway)](https://aka.ms/agkverror).

### Application Gateway does not have enough capacity to scale out

We've detected that your Application Gateway subnet does not have enough capacity for allowing scale-out during high traffic conditions, which can cause downtime.

Learn more about [Application gateway - AppgwRestrictedSubnetSpace (Application Gateway does not have enough capacity to scale out)](https://aka.ms/application-gateway-faq).

### Enable Traffic Analytics to view insights into traffic patterns across Azure resources

Traffic Analytics is a cloud-based solution that provides visibility into user and application activity in Azure. Traffic analytics analyzes Network Watcher network security group (NSG) flow logs to provide insights into traffic flow. With traffic analytics, you can view top talkers across Azure and non Azure deployments, investigate open ports, protocols and malicious flows in your environment and optimize your network deployment for performance. You can process flow logs at 10 mins and 60 mins processing intervals, giving you faster analytics on your traffic.

Learn more about [Network Security Group - NSGFlowLogsenableTA (Enable Traffic Analytics to view insights into traffic patterns across Azure resources)](https://aka.ms/aa_enableta_learnmore).

## SQL Virtual Machine

### SQL IaaS Agent should be installed in full mode

Full mode installs the SQL IaaS Agent to the VM to deliver full functionality. Use it for managing a SQL Server VM with a single instance. There is no cost associated with using the full manageability mode. System administrator permissions are required. Note that installing or upgrading to full mode is an online operation, there is no restart required.

Learn more about [SQL virtual machine - UpgradeToFullMode (SQL IaaS Agent should be installed in full mode)](/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management?tabs=azure-powershell).

## Storage

### Prevent hitting subscription limit for maximum storage accounts

A region can support a maximum of 250 storage accounts per subscription. You have either already reached or are about to reach that limit. If you reach that limit, you will be unable to create any more storage accounts in that subscription/region combination. Please evaluate the recommended action below to avoid hitting the limit.

Learn more about [Storage Account - StorageAccountScaleTarget (Prevent hitting subscription limit for maximum storage accounts)](https://aka.ms/subscalelimit).

### Update to newer releases of the Storage Java v12 SDK for better reliability.

We noticed that one or more of your applications use an older version of the Azure Storage Java v12 SDK to write data to Azure Storage. Unfortunately, the version of the SDK being used has a critical issue that uploads incorrect data during retries (for example, in case of HTTP 500 errors), resulting in an invalid object being written. The issue is fixed in newer releases of the Java v12 SDK.

Learn more about [Storage Account - UpdateStorageJavaSDK (Update to newer releases of the Storage Java v12 SDK for better reliability.)](/azure/developer/java/sdk/?view=azure-java-stable&preserve-view=true).

## Subscription

### Set up staging environments in Azure App Service

Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, no requests are dropped because of swap operations.

Learn more about [Subscription - AzureApplicationService (Set up staging environments in Azure App Service)](../app-service/deploy-staging-slots.md).

### Enforce 'Add or replace a tag on resources' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. This policy adds or replaces the specified tag and value when any resource is created or updated. Existing resources can be remediated by triggering a remediation task. Does not modify tags on resource groups.

Learn more about [Subscription - AddTagPolicy (Enforce 'Add or replace a tag on resources' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Allowed locations' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements.

Learn more about [Subscription - AllowedLocationsPolicy (Enforce 'Allowed locations' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Audit VMs that do not use managed disks' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. This policy audits VMs that do not use managed disks.

Learn more about [Subscription - AuditForManagedDisksPolicy (Enforce 'Audit VMs that do not use managed disks' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Allowed virtual machine SKUs' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. This policy enables you to specify a set of virtual machine SKUs that your organization can deploy.

Learn more about [Subscription - AllowedVirtualMachineSkuPolicy (Enforce 'Allowed virtual machine SKUs' using Azure Policy)](../governance/policy/overview.md).

### Enforce 'Inherit a tag from the resource group' using Azure Policy

Azure Policy is a service in Azure that you use to create, assign, and manage policies. These policies enforce different rules and effects over your resources. This policy adds or replaces the specified tag and value from the parent resource group when any resource is created or updated. Existing resources can be remediated by triggering a remediation task.

Learn more about [Subscription - InheritTagPolicy (Enforce 'Inherit a tag from the resource group' using Azure Policy)](../governance/policy/overview.md).

### Use Azure Lighthouse to simply and securely manage customer subscriptions at scale

Using Azure Lighthouse improves security and reduces unnecessary access to your customer tenants by enabling more granular permissions for your users. It also allows for greater scalability, as your users can work across multiple customer subscriptions using a single login in your tenant.

Learn more about [Subscription - OnboardCSPSubscriptionsToLighthouse (Use Azure Lighthouse to simply and securely manage customer subscriptions at scale)](../lighthouse/concepts/cloud-solution-provider.md).

## Web

### Set up staging environments in Azure App Service

Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, no requests are dropped because of swap operations.

Learn more about [App service - AzureAppService-StagingEnv (Set up staging environments in Azure App Service)](../app-service/deploy-staging-slots.md).

### Update Service Connector API Version

We have identified API calls from outdated Service Connector API for resources under this subscription. We recommend switching to the latest Service Connector API version. You need to update your existing code or tools to use the latest API version.

Learn more about [App service - UpgradeServiceConnectorAPI (Update Service Connector API Version)](/azure/service-connector).

### Update Service Connector SDK to the latest version

We have identified API calls from an outdated Service Connector SDK. We recommend upgrading to the latest version for the latest fixes, performance improvements, and new feature capabilities.

Learn more about [App service - UpgradeServiceConnectorSDK (Update Service Connector SDK to the latest version)](/azure/service-connector).

## Azure Center for SAP

### Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system should be certified for SAP.

Learn more about [App Server Instance - VM_0001 (Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [Database Instance - NIC_0001_DB (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [App Server Instance - NIC_0001 (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces

Azure Center for SAP solutions recommendation: Ensure Accelerated networking is enabled on all interfaces.

Learn more about [Central Server Instance - NIC_0001_ASCS (Azure Center for SAP recommendation: Ensure Accelerated networking is enabled on all interfaces)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system should be certified for SAP.

Learn more about [Central Server Instance - VM_0001_ASCS (Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP

Azure Center for SAP solutions recommendation: All VMs in SAP system should be certified for SAP.

Learn more about [Database Instance - VM_0001_DB (Azure Center for SAP recommendation: All VMs in SAP system should be certified for SAP)](https://launchpad.support.sap.com/#/notes/1928533).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system should be attached to the same VNET.

Learn more about [App Server Instance - AllVmsHaveSameVnetApp (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Swap space on HANA systems should be 2GB

Azure Center for SAP solutions recommendation: Swap space on HANA systems should be 2GB.

Learn more about [Database Instance - SwapSpaceForSap (Azure Center for SAP recommendation: Swap space on HANA systems should be 2GB)](https://launchpad.support.sap.com/#/notes/1999997).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system should be attached to the same VNET.

Learn more about [Central Server Instance - AllVmsHaveSameVnetAscs (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET

Azure Center for SAP recommendation: Ensure all NICs for a system should be attached to the same VNET.

Learn more about [Database Instance - AllVmsHaveSameVnetDb (Azure Center for SAP recommendation: Ensure all NICs for a system are attached to the same VNET)](/azure/virtual-machines/workloads/sap/sap-deployment-checklist#:~:text=this%20article.-,Networking,-.).

### Azure Center for SAP recommendation: Ensure network configuration is optimized for HANA and OS

Azure Center for SAP  solutions recommendation: Ensure network configuration is optimized for HANA and OS.

Learn more about [Database Instance - NetworkConfigForSap (Azure Center for SAP recommendation: Ensure network configuration is optimized for HANA and OS)](https://launchpad.support.sap.com/#/notes/2382421).

## Next steps

Learn more about [Operational Excellence - Microsoft Azure Well Architected Framework](/azure/architecture/framework/devops/overview)
