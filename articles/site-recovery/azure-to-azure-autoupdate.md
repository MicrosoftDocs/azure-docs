---
title: Automatic update of Mobility Service in Azure to Azure disaster recovery | Microsoft Docs
description: Provides an overview of automatic update of Mobility Service, when replicating Azure VMs using Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram 
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: rajanaki

---
# Automatic update of the Mobility Service in Azure to Azure replication

Azure Site Recovery has a monthly release cadence where enhancements to existing features or new ones are added, and known issues if any are fixed. This would mean that to remain current with the service, you need to plan for deployment of these patches, monthly. In order to avoid the over head associated with the upgrade, users can instead choose to allow Site Recovery to manage updates of the components. As detailed in the [architecture reference](azure-to-azure-architecture.md) for Azure to Azure disaster recovery, Mobility Service gets installed on all Azure virtual machines for which replication is enabled while replicating virtual machines from one Azure region to another. Once you enable automatic update, the Mobility service extension gets updated with every new release. This document details the following:

- How does automatic update work?
- Enable automatic updates
- Common issues & troubleshooting
 
## How does automatic update work

Once you allow Site Recovery to manage updates, a global runbook (which is used by Azure services) is deployed via an automation account, which is created in the same subscription as the vault. One automation account is used for a specific vault. The runbook checks for each VM in a vault for which auto-updates are turned ON and initiates an upgrade of the Mobility Service extension if a newer version is available. The default schedule of the runbook recurrs daily at 12:00 AM as per the time zone of the replicated virtual machine's geo. 
The runbook schedule can also be modified via the automation account by the user, if necessary. 

> [!NOTE]
> Enabling automatic updates doesn't require a reboot of your Azure VMs, and doesn't affect on-going replication.

> [!NOTE]
> Billing for jobs used by automation account is based on the number of job run time minutes used in the month and by default 500 minutes are included as free units for an automation account. The execution of the job daily amounts from a **few seconds to about a minute** and will be **covered in the free credits**.

FREE UNITS INCLUDED (PER MONTH)**	PRICE
Job run time	500 minutes	₹0.14/minute

## Enable automatic updates

You can choose to allow Site Recovery to manage updates in the following ways:-

- [As part of the enable replication step](#as-part-of-the-enable-replication-step)
- [Toggle the extension update settings inside the vault](#toggle-the-extension-update-settings-inside-the-vault)

### As part of the enable replication step:

When you enable replication for a virtual machine either starting [from the virtual machine view](azure-to-azure-quickstart.md), or [from the recovery services vault](azure-to-azure-how-to-enable-replication.md), you will get an option to choose to either allow Site Recovery to manage updates for the Site Recovery extension or to manually manage the same.

![enable-replication-auto-update](./media/azure-to-azure-autoupdate/enable-rep.png)

### Toggle the extension update settings inside the vault

1. Inside the vault, navigate to **Manage**-> **Site Recovery Infrastructure**
2. Under **For Azure virtual Machines**-> **Extension Update Settings**, click the toggle to choose whether you want to allow *ASR to manage updates* or *manage manually*. Click **Save**.

![vault-toggle-autuo-update](./media/azure-to-azure-autoupdate/vault-toggle.png)

> [!Important] 
> When you choose *Allow ASR to manage*, the setting is applied to all virtual machines in the corresponding vault.


> [!Note] 
> Both the options will notify you of the automation account that is used for managing the updates. If you are enabling this feature for the first time in a vault, a new automation account will be created. All subsequent enable replications in the same vault will use the previously created one.

## Common issues & troubleshooting

If there is an issue with the automatic updates, you'll be notified of the same under 'Configuration issues' in the vault dashboard. 

In case you tried to enable automatic updates and it failed, refer below for troubleshooting.

**Error**: You do not have permissions to create an Azure Run As account (service principal) and grant the Contributor role to the service principal. 
- Recommended Action: Ensure that the logged in account is assigned the 'Contributor' and retry the operation. Refer to [this](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal#required-permissions) document for further information on assigning the right permissions.
 
Once automatic updates are turned ON, most of the issues can be healed by the Site Recovery service and requires you to click on the '**Repair**' button.

![repair-button](./media/azure-to-azure-autoupdate/repair.png)

In case the repair button isn't available, refer to the error message displayed under extension settings pane.

 - **Error**: The Run As account does not have the permission to access the recovery services resource.

    **Recommended Action**: Delete and then [re-create the Run As account](https://docs.microsoft.com/azure/automation/automation-create-runas-account) or make sure that the Automation Run As account's Azure Active Directory Application has access to the recovery services resource.

- **Error**: Run As account is not found. Either one of these was deleted or not created - Azure Active Directory Application, Service Principal, Role, Automation Certificate asset, Automation Connection asset - or the Thumbprint is not identical between Certificate and Connection. 

    **Recommended Action**: Delete and [then re-create the Run As account](https://docs.microsoft.com/azure/automation/automation-create-runas-account).
