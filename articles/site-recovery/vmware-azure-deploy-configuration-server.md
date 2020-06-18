---
title: Deploy the configuration server in Azure Site Recovery 
description: This article describes how to deploy a configuration server for VMware disaster recovery with Azure Site Recovery
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 10/15/2019
ms.author: ramamill
---

# Deploy a configuration server

You deploy an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication. This article walks you through the steps needed to deploy the configuration server when you're replicating VMware VMs to Azure. If you need to set up a configuration server for physical server replication, see [Set up the configuration server for disaster recovery of physical servers to Azure](physical-azure-set-up-source.md).

> [!TIP]
> To learn about the role of a configuration server as part of Azure Site Recovery architecture, see [VMware to Azure disaster recovery architecture](vmware-azure-architecture.md).

## Deploy a configuration server through an OVA template

The configuration server must be set up as a highly available VMware VM with certain minimum hardware and sizing requirements. For convenient and easy deployment, Site Recovery provides a downloadable Open Virtualization Application (OVA) template to set up the configuration server that complies with all the mandated requirements listed here.

## Prerequisites

Minimum hardware requirements for a configuration server are summarized in the following sections.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Azure Active Directory permission requirements

You must have a user with one of the following permissions set in Azure Active Directory (Azure AD) to register the configuration server with Azure Site Recovery services.

1. The user must have an application developer role to create an application.
    - To verify, sign in to the Azure portal.</br>
    - Go to **Azure Active Directory** > **Roles and administrators**.</br>
    - Verify that the application developer role is assigned to the user. If not, use a user with this permission or contact an [administrator to enable the permission](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal#assign-roles).
    
2. If the application developer role can't be assigned, ensure that the **Users can register applications** flag is set as **true** for the user to create an identity. To enable these permissions:
    - Sign in to the Azure portal.
    - Go to **Azure Active Directory** > **User settings**.
    - Under **App registrations**, **Users can register applications**, select **Yes**.

      ![Azure AD_application_permission](media/vmware-azure-deploy-configuration-server/AAD_application_permission.png)

> [!NOTE]
> Active Directory Federation Services *isn't supported*. Use an account managed through [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis).

## Download the template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the OVA template for the configuration server.

   > [!TIP]
   >You can also download the latest version of the configuration server template directly from the [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

> [!NOTE]
> The license provided with an OVA template is an evaluation license that's valid for 180 days. After this period, you must procure a license.

## Import the template in VMware

1. Sign in to the VMware vCenter server or vSphere ESXi host by using the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the **Deploy OVF Template** wizard.

     ![Deploy OVF Template](./media/vmware-azure-deploy-configuration-server/vcenter-wizard.png)

3. On **Select source**, enter the location of the downloaded OVF.
4. On **Review details**, select **Next**.
5. On **Select name and folder** and **Select configuration**, accept the default settings.
6. On **Select storage**, for best performance select **Thick Provision Eager Zeroed** in **Select virtual disk format**. Use of the thin provisioning option might affect the performance of the configuration server.
7. On the rest of the wizard pages, accept the default settings.
8. On **Ready to complete**:

    * To set up the VM with the default settings, select **Power on after deployment** > **Finish**.
    * To add an additional network interface, clear **Power on after deployment**, and then select **Finish**. By default, the configuration server template is deployed with a single NIC. You can add additional NICs after deployment.

> [!IMPORTANT]
> Don't change resource configurations, such as memory, cores, and CPU restriction, or modify or delete installed services or files on the configuration server after deployment. These types of changes affect the registration of the configuration server with Azure services and the performance of the configuration server.

## Add an additional adapter

> [!NOTE]
> Two NICs are required if you plan to retain the IP addresses of the source machines on failover and want to fail back to on-premises later. One NIC is connected to source machines, and the other NIC is used for Azure connectivity.

If you want to add an additional NIC to the configuration server, add it before you register the server in the vault. Adding additional adapters isn't supported after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network.
4. To connect the virtual NIC when the VM is turned on, select **Connect at power-on**. Then select **Next** > **Finish** > **OK**.

## Register the configuration server with Azure Site Recovery services

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots up into a Windows Server 2016 installation experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.
4. The first time you sign in, within a few seconds the Azure Site Recovery Configuration tool starts.
5. Enter a name that's used to register the configuration server with Site Recovery. Then select **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription.</br>
    a. The credentials must have access to the vault in which you want to register the configuration server.</br>
    b. Ensure that the chosen user account has permission to create an application in Azure. To enable the required permissions, follow the guidelines in the section [Azure Active Directory permission requirements](#azure-active-directory-permission-requirements).
7. The tool performs some configuration tasks, and then reboots.
8. Sign in to the machine again. The configuration server management wizard starts automatically in a few seconds.

### Configure settings

1. In the configuration server management wizard, select **Setup connectivity**. From the drop-down boxes, first select the NIC that the in-built process server uses for discovery and push installation of mobility service on source machines. Then select the NIC that the configuration server uses for connectivity with Azure. Select **Save**. You can't change this setting after it's configured. Don't change the IP address of a configuration server. Ensure that the IP assigned to the configuration server is a static IP and not a DHCP IP.
2. On **Select Recovery Services vault**, sign in to Microsoft Azure with the credentials used in step 6 of [Register the configuration server with Azure Site Recovery services](#register-the-configuration-server-with-azure-site-recovery-services).
3. After sign-in, select your Azure subscription and the relevant resource group and vault.

    > [!NOTE]
    > After registration, there's no flexibility to change the recovery services vault.
    > Changing a recovery services vault requires disassociation of the configuration server from the current vault, and the replication of all protected virtual machines under the configuration server is stopped. To learn more, see [Manage the configuration server for VMware VM disaster recovery](vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).

4. On **Install third-party software**:

    |Scenario   |Steps to follow  |
    |---------|---------|
    |Can I download and install MySQL manually?     |  Yes. Download the MySQL application, place it in the folder **C:\Temp\ASRSetup**, and then install manually. After you accept the terms and select **Download and install**, the portal says *Already installed*. You can proceed to the next step.       |
    |Can I avoid download of MySQL online?     |   Yes. Place your MySQL installer application in the folder **C:\Temp\ASRSetup**. Accept the terms, select **Download and install**, and the portal uses the installer you added to install the application. After installation finishes, proceed to the next step.    |
    |I want to download and install MySQL through Azure Site Recovery.    |  Accept the license agreement, and select **Download and install**. After installation finishes, proceed to the next step.       |

5. On **Validate appliance configuration**, prerequisites are verified before you continue.
6. On **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, where the VMs you want to replicate are located. Enter the port on which the server is listening. Enter a friendly name to be used for the VMware server in the vault.
7. Enter credentials to be used by the configuration server to connect to the VMware server. Site Recovery uses these credentials to automatically discover VMware VMs that are available for replication. Select **Add** > **Continue**. The credentials entered here are locally saved.
8. On **Configure virtual machine credentials**, enter the user name and password of virtual machines to automatically install mobility service during replication. For **Windows** machines, the account needs local administrator privileges on the machines you want to replicate. For **Linux**, provide details for the root account.
9. Select **Finalize configuration** to complete registration.
10. After registration finishes, open the Azure portal and verify that the configuration server and VMware server are listed on **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.

## Upgrade the configuration server

To upgrade the configuration server to the latest version, see [Manage the configuration server for VMware VM disaster recovery](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server). For instructions on how to upgrade all Site Recovery components, see [Service updates in Site Recovery](service-updates-how-to.md).

## Manage the configuration server

To avoid interruptions in ongoing replication, ensure that the IP address of the configuration server doesn't change after the configuration server is registered to a vault. To learn more about common configuration server management tasks, see [Manage the configuration server for VMware VM disaster recovery](vmware-azure-manage-configuration-server.md).

## Troubleshoot deployment issues

Refer to our [troubleshooting article](vmware-azure-troubleshoot-configuration-server.md) to resolve deployment & connectivity issues.

## FAQs

* How long is the license provided on a configuration server deployed through OVF valid? What happens if I don't reactivate the license?

    The license provided with an OVA template is an evaluation license valid for 180 days. Before expiration, you need to activate the license. Otherwise, it can result in frequent shutdown of the configuration server and cause a hindrance to replication activities. For more information, see [Manage the configuration server for VMware VM disaster recovery](vmware-azure-manage-configuration-server.md#update-windows-license).

* Can I use the VM where the configuration server is installed for different purposes?

    No. Use the VM for the sole purpose of the configuration server. Ensure that you follow all the specifications mentioned in [Prerequisites](#prerequisites) for efficient management of disaster recovery.
* Can I switch the vault already registered in the configuration server with a newly created vault?

    No. After a vault is registered with the configuration server, it can't be changed.
* Can I use the same configuration server to protect both physical and virtual machines?

    Yes. The same configuration server can be used for replicating physical and virtual machines. However, the physical machine can be failed back only to a VMware VM.
* What's the purpose of a configuration server and where is it used?

    To learn more about the configuration server and its functionalities, see [VMware to Azure replication architecture](vmware-azure-architecture.md).
* Where can I find the latest version of the configuration server?

    For steps to upgrade the configuration server through the portal, see [Upgrade the configuration server](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server). For instructions on how to upgrade all Site Recovery components, see [Service updates in Site Recovery](https://aka.ms/asr_how_to_upgrade).
* Where can I download the passphrase for configuration server?

    To download the passphrase, see [Manage the configuration server for VMware VM disaster recovery](vmware-azure-manage-configuration-server.md#generate-configuration-server-passphrase).
* Can I change the passphrase?

    No. Don't change the passphrase of the configuration server. A change in the passphrase breaks replication of protected machines and leads to a critical health state.
* Where can I download vault registration keys?

    In **Recovery Services Vault**, select **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**. In **Servers**, select **Download registration key** to download the vault credentials file.
* Can I clone an existing configuration server and use it for replication orchestration?

    No. Use of a cloned configuration server component isn't supported. Cloning of a scale-out process server is also an unsupported scenario. Cloning Site Recovery components affects ongoing replications.

* Can I change the IP of a configuration server?

    No. Don't change the IP address of a configuration server. Ensure that all IPs assigned to the configuration server are static IPs and not DHCP IPs.
* Can I set up a configuration server on Azure?

    Set up a configuration server in an on-premises environment with a direct line-of-sight with v-Center and to minimize data transfer latencies. You can take scheduled backups of configuration server for [failback purposes](vmware-azure-manage-configuration-server.md#failback-requirements).

* Can I change cache driver on a configuration server or scale-out process server?

    No, Cache driver cannot be changed once set up is complete.

For more FAQs on configuration servers, see [Configuration server common questions](vmware-azure-common-questions.md#configuration-server).

## Next steps

Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
