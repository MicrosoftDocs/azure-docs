# Overview
## [What is Site Recovery?](site-recovery-overview.md)
## [How does Site Recovery work?](site-recovery-components.md)
## [What workloads can you protect?](site-recovery-workload.md)
## [Site Recovery support matrix](site-recovery-support-matrix-to-azure.md)
## [FAQ](site-recovery-faq.md)
## [Watch an introduction](https://www.youtube.com/watch?v=eOOwMQPBKfM)

# Get Started
## [Replicate VMWare VMs to Azure](site-recovery-vmware-to-azure.md)
## [Replicate VMware VMs to Azure in a multi-tenant deployment (CSP)](site-recovery-multi-tenant-support-vmware-using-csp.md)
## [Replicate Hyper-V VMs to Azure (with VMM)](site-recovery-vmm-to-azure.md)
## [Replicate Hyper-V VMs to Azure](site-recovery-hyper-v-site-to-azure.md)
## [Replicate VMware VMs and physical servers to a secondary site](site-recovery-vmware-to-vmware.md)
## [Replicate Hyper-V VMs to a secondary site (with VMM)](site-recovery-vmm-to-vmm.md)

# How To
## Plan
### [Deployment prerequisites](site-recovery-prereq.md)
### [Network infrastructure considerations](site-recovery-network-design.md)
### [Use the Site Recovery Capacity Planner](site-recovery-capacity-planner.md)
### [Plan capacity and scale VMware replication to Azure](site-recovery-plan-capacity-vmware.md)
### [Run the Deployment Planner for VMware replication to Azure](site-recovery-deployment-planner.md)
## Configure
### [Set up the source environment](site-recovery-set-up-vmware-to-azure.md)
### [Set up the target environment](site-recovery-prepare-target-vmware-to-azure.md)
### [Configure replication settings](site-recovery-setup-replication-settings-vmware.md)
### [Deploy the Mobility service for VMware replication](site-recovery-vmware-to-azure-install-mob-svc.md)
#### [Deploy the Mobility service with System Center Configuration Manager](site-recovery-install-mobility-service-using-sccm.md)
#### [Deploy the Mobility service with Azure Automation DSC](site-recovery-automate-mobility-service-install.md)
## Failover and failback
### [Failover in Site Recovery](site-recovery-failover.md)
### [Set up recovery plans](site-recovery-create-recovery-plans.md)
#### [Add Azure runbooks to recovery plans](site-recovery-runbook-automation.md)
### [Run a test failover to Azure](site-recovery-test-failover-to-azure.md)
### [Run a test failover between two VMM sites](site-recovery-test-failover-vmm-to-vmm.md)
### [Fail back VMware VMs/physical servers from Azure](site-recovery-how-to-failback-azure-to-vmware.md)
### [Fail back Hyper-V VMs from Azure](site-recovery-failback-from-azure-to-hyper-v.md)

## Migrate
### [Migrate to Azure](site-recovery-migrate-to-azure.md)
### [Migrate between Azure regions](site-recovery-migrate-azure-to-azure.md)
### [Migrate AWS Windows instances to Azure](site-recovery-migrate-aws-to-azure.md)
## Workloads
### [Active Directory and DNS](site-recovery-active-directory.md)
### [SQL Server](site-recovery-sql.md)
### [SharePoint](site-recovery-workload.md#protect-sharepoint)
### [Dynamics AX](site-recovery-workload.md#protect-dynamics-ax)
### [RDS](site-recovery-workload.md#protect-rds)
### [Exchange](site-recovery-workload.md#protect-exchange)
### [SAP](site-recovery-workload.md#protect-sap)
### [Other workloads](site-recovery-workload.md#workload-summary)
## Automate replication
### [Automate Hyper-V replication to Azure (no VMM)](site-recovery-deploy-with-powershell-resource-manager.md)
### [Automate Hyper-V replication to Azure (with VMM)](site-recovery-vmm-to-azure-powershell-resource-manager.md)
### [Automate Hyper-V replication to a secondary site (with VMM)](site-recovery-vmm-to-vmm-powershell-resource-manager.md)
## Manage
### [Remove servers and disable protection](site-recovery-manage-registration-and-protection.md)
### [Scale out process servers](site-recovery-vmware-to-azure-manage-scaleout-process-server.md)
### [Monitor and troubleshoot](site-recovery-monitoring-and-troubleshooting.md)

# Reference
## [PowerShell](/powershell/resourcemanager/azurerm.siterecovery/v3.2.0/azurerm.siterecovery)
## [PowerShell classic](/powershell/servicemanagement/azure.siterecovery/v3.1.0/azure.siterecovery)
## [REST](https://msdn.microsoft.com/en-us/library/mt750497)

# Related
## [Azure Automation](/azure/automation/)

# Resources
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/site-recovery/)
## [Forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hypervrecovmgr)
## [Blog](http://azure.microsoft.com/blog/tag/azure-site-recovery/)
## [Pricing](https://azure.microsoft.com/pricing/details/site-recovery/)
## [Service updates](https://azure.microsoft.com/updates/?product=site-recovery)
