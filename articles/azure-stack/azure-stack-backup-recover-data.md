# Recover from catastrophic data loss
<azure-stack-backup-recover-data.md>

Azure Stack runs Azure services in your datacenter. Azure Stack is designed to run on environments as small as four nodes installed in a single rack. There is a real possibility of a data loss issue that can impact parts or the entire Azure Stack Cloud. Compared to Azure, which runs in more than 40 regions in multiple datacenters and zones in each region, user resources can span many servers, racks, datacenters, and regions. With Azure Stack, you only have the choice to deploy the entire cloud to a single rack. In the worst case, the Azure Stack Cloud can suffer catastrophic data loss due to a disaster or major product bug. In this case, Azure Stack instance goes offline. All of the data is potentially unrecoverable.

Depending on the root cause of the data loss, you may need to simply heal a single infrastructure service or restore the entire Azure Stack instance. you may even need to restore to different hardware in the same location or in a different location.

| Scenario                                                           | Data Loss                            | Considerations                                                             |
|--------------------------------------------------------------------|--------------------------------------|----------------------------------------------------------------------------|
| Recover from catastrophic data loss due to disaster or product bug | All infrastructure and user and app data | User application and data are protected separately from infrastructure data |

## Workflows

The journey of protecting Azure Start starts with backing up the infrastructure and app/tenant data separately. This document covers how to protect the infrastructure. 

![Initial deployment of Azure Stack](\media\azure-stack-backup\azure-stack-backup-workflow1.png)

In worst case scenarios where all data is lost, recovering Azure Stack is the process of restoring the infrastructure data unique to that deployment of Azure Stack and all user data. 

![Redeploy Azure Stack](\media\azure-stack-backup\azure-stack-backup-workflow2.png)

## Data in backups

Azure Stack supports a type of deployment called cloud recovery mode. This mode is used only if you choose to recover Azure Stack after a disaster or product bug rendered the solution unrecoverable. This deployment mode does not recover any of the user data stored in the solution. The scope of this deployment mode is limited to restoring the following data:

 - Deployment inputs
 - Internal identity systems
 - Federated identify configuration (disconnected deployments)
 - Root certificates used by internal certificate authority
 - Azure Resource Manager configuration user data – subscriptions, plans, offers, and (storage, network, compute) quotas
 - KeyVault secrets and vaults
 - RBAC policy assignments and role assignments 

None of the user IaaS or PaaS resources are recovered – IaaS VMs, storage accounts, blobs, tables, network configuration etc. The purpose of cloud recovery is to ensure your operators and users can log back into the portal after deployment is complete. Users logging back in will not see any of their resources. Users have their subscriptions restored and along with that the original plans and offers policies defined by the administrator. Users logging back into the system will operate under the same constraints imposed by the original solution before the disaster. After cloud recovery completes, the operator can restore value-add and third-party RPs and associated data using a manual process that is published separately.

## Infrastructure Backup components

Infrastructure Backup includes the following components:

 - **Infrastructure Backup Controller**  
 The Infrastructure Backup Controller is instantiated with and resides in every Azure Stack cloud.
 - **Backup Resource Provider**  
 The Backup Resource Provider (Backup RP) is composed of the user interface and application program interfaces (API)s exposing basic backup functionality for Azure Stack infrastructure.

### Infrastructure Backup Controller

The Infrastructure Backup Controller is a Service Fabric service gets instantiated for an Azure Stack cloud. Backup resources are created at a regional level and capture region-specific service data from AD, CA, Azure Resource Manager, CRP, SRP, NRP, KeyVault, RBAC. 

## Backup Resource Provider

The Backup Resource Provider presents user interface in the Azure Stack portal for basic configuration and listing of backup resources. Operator can perform the following operations in the user interface:

 - Enable backup for the first time by providing external storage location, credentials, and encryption key
 - View completed created backup resources and status resources under creation
 - Modify the storage location where Backup Controller places backup data
 - Modify the credentials that Backup Controller uses to access external storage location
 - Modify the encryption key that Backup Controller uses to encrypt backups 

## Next steps

Learn how to prepare the system for backup. 
