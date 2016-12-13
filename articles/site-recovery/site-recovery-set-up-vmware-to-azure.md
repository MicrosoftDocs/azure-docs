---
title: Set up the source environment (VMware to Azure)
description: This article describes how to set up your on-premises environment to start replicating virtual machines running on VMware into Azure.
services: site-recovery
documentationcenter: ''
author: AnoopVasudavan
manager: gauravd
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 12/9/2016
ms.author: anoopkv
---

# Set up the source environment (VMware to Azure)
This article describes how to set up your on-premises environment to start replicating virtual machines running on VMware into Azure.

## Prerequisites

The article assumes that you have already created
1. A Recovery Services Vault [Azure portal](http://portal.azure.com "Azure portal").
2. A dedicated account in your VMware vCenter that can be used for [automatic discovery](./site-recovery-vmware-to-azure.md#vmware-account-permissions)
3. A virtual machine to install the Configuration Server.

### Configuration Server Minimum Requirements
The Configuration Server software should be deployed on a **highly available** VMware virtual machine. The following table lists out the minimum hardware, software, and network requirements for a configuration server.
[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-server-requirements.md)]

> [!NOTE]
> HTTPS-based proxy servers are not supported by the Configuration Server.

## Choose your protection goals

1. In the Azure Portal browse to **Recovery Services** vaults blade, and select your vault.
2. In the Resource Menu of the vault click **Getting Started** > **Site Recovery** > **Step 1: Prepare Infrastructure** > **Protection goal**.

    ![Choose goals](./media/site-recovery-vmware-to-azure/choose-goals.png)
3. In **Protection goal**, select **To Azure**, and select **Yes, with VMware vSphere Hypervisor**. Then click **OK**.

    ![Choose goals](./media/site-recovery-vmware-to-azure/choose-goals2.png)

## Set up the source environment
Setting up the source environment involved two main activities

1. Installing and Registering a Configuration Server with Site Recovery Service.
2. Discovering your on-premises virtual machines by connecting Azure Site Recovery to your on-premises VMware vCenter or vSphere EXSi hosts

### Step 1: Install & Register a Configuration Server

1. Click **Step 1: Prepare Infrastructure** > **Source**. In **Prepare source**, if you don’t have a configuration server click **+Configuration server** to add one.

    ![Set up source](./media/site-recovery-vmware-to-azure/set-source1.png)
2. In the **Add Server** blade, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need the registration key when you run Unified Setup. The key is valid for **five** days after you generate it.

	![Set up source](./media/site-recovery-vmware-to-azure/set-source2.png)
6. On the machine you’re using as the configuration server, run **Azure Site Recovery Unified Setup** to install the configuration server, the process server, and the master target server.

#### Running the Azure Site Recovery Unified Setup

> [!TIP] Configuration Server registration will fail if the time on your computers **System Clock** ahead or behind **local time** by more than five minutes. Synchronize your System Clock with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service) before starting the installation.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

> [!NOTE] The Configuration Server can be installed via command line. Read more on [installing Configuration Server using Command-line tools](http://aka.ms/installconfigsrv).

#### Add the VMware account for automatic discovery

[!INCLUDE [site-recovery-add-vcenter-account](../../includes/site-recovery-add-vcenter-account.md)]

### Step 2: Discover virtual machines
To allow Azure Site Recovery to discover virtual machines running in your on-premises environment, you need to connect your VMware vCenter Server or vSphere ESXi hosts with Site Recovery

Click the +vCenter button to start connecting a VMware vCenter server or a VMware vSphere ESXi host.

[!INCLUDE [site-recovery-add-vcenter](../../includes/site-recovery-add-vcenter.md)]


## Common issues
### Installation issues
| **Sample Error Message** | **Recommended Action** |
|---------------|---------------------------|


### Registration Failures
Registration failures can be debugged by reviewing the logs in the **%ProgramData%\ASRLogs** folder

| **Sample Error Message** | **Recommended Action** |
|---------------|--------------------|
|`**09:20:06**:InnerException.Type: SrsRestApiClientLib.AcsException,InnerException.<br>Message: ACS50008: SAML token is invalid.<br>Trace ID: 1921ea5b-4723-4be7-8087-a75d3f9e1072<br>Correlation ID: 62fea7e6-2197-4be4-a2c0-71ceb7aa2d97><br>Timestamp: **2016-12-12 14:50:08Z<br>** `| Ensure that the time on your **System Clock** is not more than 15 minutes ahead/behind the **local time**. Rerun the installer to complete the registration.|
|`**09:35:27** :DRRegistrationException while trying to get all disaster recovery vault for the selected certificate: : Threw Exception.Type:Microsoft.DisasterRecovery.Registration.DRRegistrationException, Exception.Message: ACS50008: SAML token is invalid.<br>Trace ID: e5ad1af1-2d39-4970-8eef-096e325c9950<br>Correlation ID: abe9deb8-3e64-464d-8375-36db9816427a<br>Timestamp: **2016-05-19 01:35:39Z**<br>` | Ensure that the time on your **System Clock** is not more than 15 minutes ahead/behind the **local time**. Rerun the installer to complete the registration.|
|`06:28:45:Failed to create certificate<br>06:28:45:Setup cannot proceed. A certificate required to authenticate to Site Recovery cannot be created. Rerun Setup`| Ensure you are running setup as a **Local Administrator** |



## Next steps
Next step involves in [setting up your target environment](./site-recovery-vmware-to-azure.md#step-3-set-up-the-target-environment) in Azure.
