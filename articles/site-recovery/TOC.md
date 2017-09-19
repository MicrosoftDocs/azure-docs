# Overview
## [What is Site Recovery?](site-recovery-overview.md)

# Quickstarts
## [Replicate an Azure VM to a secondary region](azure-to-azure-quickstart.md)

# Tutorials

## Azure VMs
### [Set up disaster recovery](azure-to-azure-tutorial-enable-replication.md)
### [Run a disaster recovery drill](azure-to-azure-tutorial-dr-drill.md)
### [Run failover and failback](azure-to-azure-tutorial-failover-failback.md)
## VMware VMs
### [Prepare Azure](tutorial-prepare-azure.md)
### [Prepare on-premises VMware](tutorial-prepare-on-premises-vmware.md)
### [Set up disaster recovery](tutorial-vmware-to-azure.md)
### [Run a disaster recovery drill](tutorial-dr-drill-azure.md)
### [Run failover and failback](tutorial-vmware-to-azure-failover-failback.md)
## Migrate to Azure
### [Prepare Azure](tutorial-prepare-azure.md)
### [Migrate on-premises machines to Azure](tutorial-migrate-on-premises-to-azure.md)
### [Migrate AWS instances to Azure](tutorial-migrate-aws-to-azure.md)

# Concepts
## [Azure to Azure architecture](concepts-azure-to-azure-architecture.md)
## [VMware to Azure architecture](concepts-vmware-to-azure-architecture.md)
## [Hyper-V to Azure architecture](concepts-hyper-v-to-azure-architecture.md)
## [Physical to Azure architecture](concepts-physical-to-azure-architecture.md)
## [Hyper-V to secondary site architecture](concepts-hyper-v-to-secondary-architecture.md)
## [On-premises to Azure support matrix](site-recovery-support-matrix-to-azure.md)
## [On-premises to secondary site support matrix](site-recovery-support-matrix-to-sec-site.md)
## [Disaster recovery for workloads](site-recovery-workload.md)
## [Azure to Azure networking (preview)](site-recovery-azure-to-azure-networking-guidance.md)
## [VM connectivity after failover to Azure](concepts-on-premises-to-azure-networking.md)
## [VM connectivity after failover to a secondary site](concepts-on-premises-to-on-premises-networking.md)
## [Network mapping for Azure VM replication](site-recovery-network-mapping-azure-to-azure.md)
## [Network mapping for Hyper-V VM replication to Azure](site-recovery-network-mapping.md)
## [Role-based access permissions](site-recovery-role-based-linked-access-control.md)
## [FAQ](site-recovery-faq.md)
## [Capacity planning for VMware replication to Azure](site-recovery-plan-capacity-vmware.md)
### [Deployment Planner for VMware replication to Azure](site-recovery-deployment-planner.md)
## [Capacity Planner for Hyper-V replication](site-recovery-capacity-planner.md)

# How-To Guides

## Disaster recovery
### [To Azure for Hyper-V VMs](tutorial-hyper-v-to-azure.md)
### [To Azure for physical servers](tutorial-physical-to-azure.md)
### [To a secondary site for Hyper-V VMs](tutorial-vmm-to-vmm.md)
### [To a secondary site for VMware VMs and physical servers](tutorial-vmware-to-vmware.md)
### [Run a disaster recovery drill to Azure](tutorial-dr-drill-azure.md)
### [Run a disaster recovery drill to a secondary site](tutorial-dr-drill-secondary.md)
### [Run a failover and failback for physical servers](tutorial-vmware-to-azure-failover-failback.md)
### [Run a failover and failback for Hyper-V VMs](tutorial-hyper-v-to-azure-failover-failback.md)
### [Run a failover and failback between on-premises sites](tutorial-vmm-to-vmm-failover-failback.md)
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
## Automate
### [Set up Hyper-V replication to Azure (no VMM) using PowerShell](site-recovery-deploy-with-powershell-resource-manager.md)
### [Set up Hyper-V replication to Azure (with VMM) using PowerShell](site-recovery-vmm-to-azure-powershell-resource-manager.md)
### [Set up Hyper-V replication to a secondary VMM site using PowerShell](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
## Migrate
### [Replicate migrated machines to another Azure region](site-recovery-azure-to-azure-after-migration.md)
## Workloads
### [Active Directory and DNS](site-recovery-active-directory.md)
### [Replicate SQL Server](site-recovery-sql.md)
### [SharePoint](site-recovery-sharepoint.md)
### [Dynamics AX](site-recovery-dynamicsax.md)
### [RDS](site-recovery-workload.md#protect-rds)
### [Exchange](site-recovery-workload.md#protect-exchange)
### [SAP](site-recovery-sap.md)
### [IIS based web applications](site-recovery-iis.md)
### [Citrix XenApp and XenDesktop](site-recovery-citrix-xenapp-and-xendesktop.md)
### [Other workloads](site-recovery-workload.md#workload-summary)
## Manage
### [Upgrade your Site Recovery vault to Recovery Services vault](upgrade-site-recovery-vaults.md)
### [Manage process servers in Azure](site-recovery-vmware-setup-azure-ps-resource-manager.md)
### [Manage the configuration server](site-recovery-vmware-to-azure-manage-configuration-server.md)
### [Manage scaled-out process servers](site-recovery-vmware-to-azure-manage-scaleout-process-server.md)
### [Manage vCenter servers](site-recovery-vmware-to-azure-manage-vCenter.md)
### [Remove servers and disable protection](site-recovery-manage-registration-and-protection.md)
### [Delete Recovery Services vault](delete-vault.md)
## Troubleshoot
### [Azure to Azure replication issues](site-recovery-azure-to-azure-troubleshoot-errors.md)
### [On-premises to Azure replication issues](site-recovery-vmware-to-azure-protection-troubleshoot.md)
### [Mobility service installation issues](site-recovery-vmware-to-azure-push-install-error-codes.md)
### [Failover to Azure issues](site-recovery-failover-to-azure-troubleshoot.md)
### [Collect logs and troubleshoot on-premises issues](site-recovery-monitoring-and-troubleshooting.md)

# Reference
## [PowerShell](/powershell/module/azurerm.siterecovery)
## [PowerShell classic](/powershell/module/azure/?view=azuresmps-3.7.0)
## [REST](https://msdn.microsoft.com/en-us/library/mt750497)

# Related
## [Azure Automation](/azure/automation/)

# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [Blog](http://azure.microsoft.com/blog/tag/azure-site-recovery/)
## [Forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hypervrecovmgr)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/site-recovery/)
## [Pricing](https://azure.microsoft.com/pricing/details/site-recovery/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Service updates](https://azure.microsoft.com/updates/?product=site-recovery)
