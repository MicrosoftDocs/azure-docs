# Overview
## [What is Site Recovery?](site-recovery-overview.md)
## How does Site Recovery work?
### [Azure to Azure architecture](site-recovery-azure-to-azure-architecture.md)
### [VMware to Azure architecture](site-recovery-architecture-vmware-to-azure.md)
### [Hyper-V to Azure architecture](site-recovery-architecture-hyper-v-to-azure.md)
### [Replication to a secondary site architecture](site-recovery-architecture-to-secondary-site.md)
## [What workloads can you protect?](site-recovery-workload.md)
## Site Recovery support matrix
### [Azure to Azure support](site-recovery-support-matrix-azure-to-azure.md)
### [On-premises to Azure support](site-recovery-support-matrix-to-azure.md)
### [On-premises to secondary site support](site-recovery-support-matrix-to-sec-site.md)
## [FAQ](site-recovery-faq.md)
## [Watch an introduction](https://azure.microsoft.com/resources/videos/index/?services=site-recovery)

# Get Started
## [Replicate Azure VMs (preview)](site-recovery-azure-to-azure.md)
## [Replicate physical servers to Azure](site-recovery-physical-servers-to-azure.md)
## [Replicate Hyper-V VMs to Azure (with VMM)](site-recovery-vmm-to-azure.md)
## [Replicate Hyper-V VMs to Azure](site-recovery-hyper-v-site-to-azure.md)
## [Replicate Hyper-V VMs to a secondary site (with VMM)](site-recovery-vmm-to-vmm.md)
## [Replicate VMware VMs and physical servers to a secondary site](site-recovery-vmware-to-vmware.md)
## [Replicate VMware VMs to Azure in a multi-tenant deployment (CSP)](site-recovery-multi-tenant-support-vmware-using-csp.md)

# How To
## Plan
### [Prerequisites for Azure replication](site-recovery-azure-to-azure-prereq.md)
### Plan networking
#### [Plan networking for Azure to Azure replication (preview)](site-recovery-azure-to-azure-networking-guidance.md)
#### [Plan networking for on-premises machine replication](site-recovery-network-design.md)
#### [Plan network mapping for Azure VM replication](site-recovery-network-mapping-azure-to-azure.md)
#### [Plan network mapping for Hyper-V VM replication](site-recovery-network-mapping.md)
### Plan capacity and scalability
#### [Plan capacity for VMware replication to Azure](site-recovery-plan-capacity-vmware.md)
#### [Deployment Planner for VMware replication to Azure](site-recovery-deployment-planner.md)
#### [Capacity Planner for Hyper-V replication](site-recovery-capacity-planner.md)
### [Plan role-based access for VM replication](site-recovery-role-based-linked-access-control.md)
## Deploy
### [Replicate VMware VMs to Azure](vmware-walkthrough-overview.md)
#### [Step 1: Review the architecture](vmware-walkthrough-architecture.md)
#### [Step 2: Verify prerequisites and limitations](vmware-walkthrough-prerequisites.md)
#### [Step 3: Plan capacity](vmware-walkthrough-capacity.md)
#### [Step 4: Plan networking](vmware-walkthrough-network.md)
#### [Step 5: Prepare Azure](vmware-walkthrough-prepare-azure.md)
#### [Step 6: Prepare VMware](vmware-walkthrough-prepare-vmware.md)
#### [Step 7: Create a vault](vmware-walkthrough-create-vault.md)
#### [Step 8: Set up the source and target](vmware-walkthrough-source-target.md)
#### [Step 9: Set up a replication policy](vmware-walkthrough-replication.md)
#### [Step 10: Install the Mobility service](vmware-walkthrough-install-mobility.md)
#### [Step 11: Enable replication](vmware-walkthrough-enable-replication.md)
#### [Step 12: Run a test failover](vmware-walkthrough-test-failover.md)
## Configure
### Set up the source environment
#### [Source environment for VMware to Azure](site-recovery-set-up-vmware-to-azure.md)
#### [Source environment for physical to Azure](site-recovery-set-up-physical-to-azure.md)
### Set up the target environment
#### [Target environment for VMware to Azure](site-recovery-prepare-target-vmware-to-azure.md)
#### [Target environment for physical to Azure](site-recovery-prepare-target-physical-to-azure.md)
### [Configure replication settings](site-recovery-setup-replication-settings-vmware.md)
### [Deploy the Mobility service for VMware replication](site-recovery-vmware-to-azure-install-mob-svc.md)
#### [Deploy the Mobility service with System Center Configuration Manager](site-recovery-install-mobility-service-using-sccm.md)
#### [Deploy the Mobility service with Azure Automation DSC](site-recovery-automate-mobility-service-install.md)
### Enable replication
#### [Enable Azure to Azure replication](site-recovery-replicate-azure-to-azure.md)
#### [Enable VMware to Azure replication](site-recovery-replicate-vmware-to-azure.md)
## Fail over and fail back
### [Set up recovery plans](site-recovery-create-recovery-plans.md)
#### [Add Azure runbooks to recovery plans](site-recovery-runbook-automation.md)
### Run a test failover
#### [Run a test failover to Azure](site-recovery-test-failover-to-azure.md)
#### [Run a test failover between VMM clouds](site-recovery-test-failover-vmm-to-vmm.md)
### [Fail over protected machines](site-recovery-failover.md)
### Reprotect machines after failover
#### [Reprotect from an Azure secondary region to primary](site-recovery-how-to-reprotect-azure-to-azure.md)
#### [Reprotect from Azure to on-premises](site-recovery-how-to-reprotect.md)
### Fail back from Azure
#### [Fail back from Azure to VMware](site-recovery-failback-azure-to-vmware.md)
#### [Fail back from Azure to Hyper-V](site-recovery-failback-from-azure-to-hyper-v.md)
## Migrate
### [Migrate to Azure](site-recovery-migrate-to-azure.md)
### [Migrate between Azure regions](site-recovery-migrate-azure-to-azure.md)
### [Migrate AWS Windows instances to Azure](site-recovery-migrate-aws-to-azure.md)
### [Replicate migrated machines to another Azure region](site-recovery-azure-to-azure-after-migration.md)
## Workloads
### [Active Directory and DNS](site-recovery-active-directory.md)
### [Replicate SQL Server](site-recovery-sql.md)
### [SharePoint](site-recovery-sharepoint.md)
### [Dynamics AX](site-recovery-dynamicsax.md)
### [RDS](site-recovery-workload.md#protect-rds)
### [Exchange](site-recovery-workload.md#protect-exchange)
### [SAP](site-recovery-workload.md#protect-sap)
### [IIS based web applications](site-recovery-iis.md)
### [Citrix XenApp and XenDesktop](site-recovery-citrix-xenapp-and-xendesktop.md)
### [Other workloads](site-recovery-workload.md#workload-summary)
## Automate replication
### [Automate Hyper-V replication to Azure (no VMM)](site-recovery-deploy-with-powershell-resource-manager.md)
### [Automate Hyper-V replication to Azure (with VMM)](site-recovery-vmm-to-azure-powershell-resource-manager.md)
### [Automate Hyper-V replication to a secondary site (with VMM)](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
## Manage
### [Manage process servers in Azure](site-recovery-vmware-setup-azure-ps-resource-manager.md)
### [Manage the configuration server](site-recovery-vmware-to-azure-manage-configuration-server.md)
### [Manage scaled-out process servers](site-recovery-vmware-to-azure-manage-scaleout-process-server.md)
### [Manage vCenter servers](site-recovery-vmware-to-azure-manage-vCenter.md)
### [Remove servers and disable protection](site-recovery-manage-registration-and-protection.md)

## Monitor and troubleshoot
### [Azure to Azure replication issues](site-recovery-azure-to-azure-troubleshoot-errors.md)
### [On-premises to Azure replication issues](site-recovery-vmware-to-azure-protection-troubleshoot.md)
### [Collect logs and troubleshoot on-premises issues](site-recovery-monitoring-and-troubleshooting.md)

# Reference
## [PowerShell](/powershell/module/azurerm.siterecovery)
## [PowerShell classic](/powershell/module/azure/?view=azuresmps-3.7.0)
## [REST](https://msdn.microsoft.com/en-us/library/mt750497)

# Related
## [Azure Automation](/azure/automation/)

# Resources
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/site-recovery/)
## [Forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hypervrecovmgr)
## [Blog](http://azure.microsoft.com/blog/tag/azure-site-recovery/)
## [Pricing](https://azure.microsoft.com/pricing/details/site-recovery/)
## [Service updates](https://azure.microsoft.com/updates/?product=site-recovery)
