<properties
	pageTitle="Common errors during Classic to Azure Resource Manager migration | Microsoft Azure"
	description="This article catalogs the most common errors and mitigations during the migration of IaaS resources from Azure Service Management to the Azure Resource Manager stack."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="singhkays"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2016"
	ms.author="singhkay"/>

# Common errors during Classic to Azure Resource Manager migration

This article catalogs the most common errors and mitigations during the migration of IaaS resources from Azure classic deployment model to the Azure Resource Manager stack.

| Error string                             | Mitigation                               |
| ---------------------------------------- | ---------------------------------------- |
| Internal server error                    | In some cases, this is a transient error that goes away with a retry. If it continues to persist, [contact Azure support](../azure-supportability/how-to-create-azure-support-request/) as it needs investigation of platform logs. <br><br> **NOTE:** Once the incident is tracked by the support team, please do not attempt any self-mitigation as this might have unintended consequences on your environment.|
| Migration is not supported for Deployment {deployment-name}  in HostedService {hosted-service-name} because it is a PaaS deployment (Web/Worker). | This happens when a deployment contains a web/worker role. Since migration is only supported for Virtual Machines, please remove the web/worker role from the deployment and try migration again. |
| Template {template-name} deployment failed. CorrelationId={guid} | In the backend of migration service, we use Azure Resource Manager templates to create resources in the Azure Resource Manager stack. Since templates are idempotent, usually you can safely retry the migration operation to get past this error. If this error continues to persist, please [contact Azure support](../azure-supportability/how-to-create-azure-support-request/) and give them the CorrelationId. <br><br> **NOTE:** Once the incident is tracked by the support team, please do not attempt any self-mitigation as this might have unintended consequences on your environment. |
| The virtual network {virtual-network-name} does not exist.  | This can happen if you created the Virtual Network in the new Azure portal. The actual Virtual Network name follows the pattern "Group * <VNET name>" |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} which is not supported in Azure Resource Manager. It is recommended to uninstall it from the VM before continuing with migration. | XML extensions such as BGInfo 1.* are not supported in Azure Resource Manager. Therefore, these extensions cannot be migrated. If these extensions are left installed on the virtual machine, they are automatically uninstalled before completing the migration. |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension VMSnapshot/VMSnapshotLinux which is currently not supported for Migration. Uninstall it from the VM and add it back using Azure Resource Manager after the Migration is Complete | This is the scenario where the virtual machine is configured for Azure Backup. Since this is currently an unsupported scenario, please follow the workaround at https://aka.ms/vmbackupmigration |
| VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} whose Status is not being reported from the VM. Hence, this VM cannot be migrated. Ensure that the Extension status is being reported or uninstall the extension from the VM and retry migration. <br><br> VM {vm-name} in HostedService {hosted-service-name} contains Extension {extension-name} reporting Handler Status: {handler-status}. Hence, the VM cannot be migrated. Ensure that the Extension handler status being reported is {handler-status} or uninstall it from the VM and retry migration. <br><br> VM Agent for VM {vm-name} in HostedService {hosted-service-name} is reporting the overall agent status as Not Ready. Hence, the VM may not be migrated, if it has a migratable extension. Ensure that the VM Agent is reporting overall agent status as Ready. Refer to https://aka.ms/classiciaasmigrationfaqs. | Azure guest agent & VM Extensions need outbound internet access to the VM storage account to populate their status. Common causes of status failure include <li> a Network Security Group that blocks outbound access to the internet <li> If the VNET has on-prem DNS servers and DNS connectivity is lost <br><br> If you continue to see an unsupported status, you can uninstall the extensions to skip this check and move forward with migration. |
| Migration is not supported for Deployment {deployment-name} in HostedService {hosted-service-name} because it has multiple Availability Sets. | Currently, only hosted services that have 1 or less Availability sets can be migrated. To work around this problem, please move the additional Availability sets and Virtual machines in those Availability sets to a different hosted service. |
| Migration is not supported for Deployment {deployment-name} in HostedService {hosted-service-name because it has VMs that are not part of the Availability Set even though the HostedService contains one. | The workaround for this scenario is to either move all the virtual machines into a single Availability set or remove all Virtual machines from the Availability set in the hosted service. |
| Storage account/HostedService/Virtual Network {virtual-network-name} is in the process of being migrated and hence cannot be changed | This error happens when the "Prepare" migration operation has been completed on the resource and an operation that would make a change to the resource is triggered. Because of the lock on the management plane after "Prepare" operation, any changes to the resource are blocked. To unlock the management plane you can run the "Commit" migration operation to complete migration or the "Abort" migration operation to roll back the "Prepare" operation. |
| Migration is not allowed for HostedService {hosted-service-name} because it has VM {vm-name} in State: RoleStateUnknown. Migration is allowed only when the VM is in one of the following states - Running, Stopped, Stopped Deallocated. | The VM might be undergoing through a state transition which usually happens when during an update operation on the HostedService such as a reboot, extension installation etc. It is recommended for the update operation to complete on the HostedService before trying migration. |

## Next steps

Here's a list of migration articles that explain the process.

- [Platform-supported migration of IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-migration-classic-resource-manager.md)
- [Use PowerShell to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-windows-ps-migration-classic-resource-manager.md)
- [Use CLI to migrate IaaS resources from classic to Azure Resource Manager](virtual-machines-linux-cli-migration-classic-resource-manager.md)
