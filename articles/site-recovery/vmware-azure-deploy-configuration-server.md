---
title: Deploy the configuration server for VMware disaster recovery with Azure Site Recovery | Microsoft Docs
description: This article describes how to deploy a configuration server for VMware disaster recovery with Azure Site Recovery
services: site-recovery
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 03/06/2019
ms.author: ramamill
---

# Deploy a configuration server

You deploy an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. The configuration server coordinates communications between on-premises VMware and Azure. It also manages data replication. This article walks you through the steps needed to deploy the configuration server when you're replicating VMware VMs to Azure. [Follow this article](physical-azure-set-up-source.md) if you need to set up a configuration server for physical server replication.

> [!TIP]
> You can learn about the role of Configuration server as part of Azure Site Recovery architecture [here](vmware-azure-architecture.md).

## Deployment of configuration server through OVA template

Configuration server must be set up as a highly available VMware VM with certain minimum hardware and sizing requirements. For convenient and easy deployment, Site Recovery provides a downloadable OVA (Open Virtualization Application) template to set up the configuration server that complies with all the mandated requirements listed below.

## Prerequisites

Minimum hardware requirements for a configuration server are summarized in the following table.

[!INCLUDE [site-recovery-configuration-server-requirements](../../includes/site-recovery-configuration-and-scaleout-process-server-requirements.md)]

## Azure Active Directory permission requirements

You require a user with **one of the following** permissions set in AAD (Azure Active Directory) to register configuration server with Azure Site Recovery services.

1. User should have “Application developer” role to create application.
   1. To verify, Sign in to Azure portal</br>
   1. Navigate to Azure Active Directory > Roles and administrators</br>
   1. Verify if "Application developer" role is assigned to the user. If not, use a user with this permission or reach out to [administrator to enable the permission](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal#assign-roles).
    
1. If the "Application developer" role cannot be assigned, ensure that "User can register application” flag is set as true for user to create identity. To enable above permissions,
   1. Sign in to Azure portal
   1. Navigate to Azure Active Directory > User settings
   1. Under **App registrations", "Users can register applications" should be chosen as "Yes".

      ![AAD_application_permission](media/vmware-azure-deploy-configuration-server/AAD_application_permission.png)

> [!NOTE]
> Active Directory Federation Services(ADFS) is **not supported**. Please use an account managed through [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis).

## Capacity planning

The sizing requirements for the configuration server depend on the potential data change rate. Use this table as a guide.

| **CPU** | **Memory** | **Cache disk size** | **Data change rate** | **Protected machines** |
| --- | --- | --- | --- | --- |
| 8 vCPUs (2 sockets * 4 cores \@ 2.5 GHz) |16 GB |300 GB |500 GB or less |Replicate fewer than 100 machines. |
| 12 vCPUs (2 sockets * 6 cores \@ 2.5 GHz) |18 GB |600 GB |500 GB to 1 TB |Replicate 100-150 machines. |
| 16 vCPUs (2 sockets * 8 cores \@ 2.5 GHz) |32 GB |1 TB |1 TB to 2 TB |Replicate 150-200 machines. |

If you're replicating more than one VMware VM, read [capacity planning considerations](site-recovery-plan-capacity-vmware.md). Run the [Deployment planner tool](site-recovery-deployment-planner.md) for VMWare replication.

## Download the template

1. In the vault, go to **Prepare Infrastructure** > **Source**.
2. In **Prepare source**, select **+Configuration server**.
3. In **Add Server**, check that **Configuration server for VMware** appears in **Server type**.
4. Download the Open Virtualization Application (OVA) template for the configuration server.

   > [!TIP]
   >You can also download the latest version of the configuration server template directly from [Microsoft Download Center](https://aka.ms/asrconfigurationserver).

> [!NOTE]
> The license provided with OVA template is an evaluation license valid for 180 days. Post this period, customer needs to activate the windows with a procured license.

## Import the template in VMware

1. Sign in to the VMware vCenter server or vSphere ESXi host by using the VMWare vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the Deploy OVF Template wizard.

     ![OVF template](./media/vmware-azure-deploy-configuration-server/vcenter-wizard.png)

3. In **Select source**, enter the location of the downloaded OVF.
4. In **Review details**, select **Next**.
5. In **Select name and folder** and **Select configuration**, accept the default settings.
6. In **Select storage**, for best performance select **Thick Provision Eager Zeroed** in **Select virtual disk format**. Usage of thin provisioning option might impact the performance of configuration server.
7. In the rest of the wizard pages, accept the default settings.
8. In **Ready to complete**:

    * To set up the VM with the default settings, select **Power on after deployment** > **Finish**.

    * To add an additional network interface, clear **Power on after deployment**, and then select **Finish**. By default, the configuration server template is deployed with a single NIC. You can add additional NICs after deployment.

> [!IMPORTANT]
> Do not change resource configurations(memory/cores/CPU restriction), modify/delete installed services or files on configuration server after deployment. This will impact registration of configuration server with Azure services and performance of configuration server.

## Add an additional adapter

If you want to add an additional NIC to the configuration server, add it before you register the server in the vault. Adding additional adapters isn't supported after registration.

1. In the vSphere Client inventory, right-click the VM and select **Edit Settings**.
2. In **Hardware**, select **Add** > **Ethernet Adapter**. Then select **Next**.
3. Select an adapter type and a network.
4. To connect the virtual NIC when the VM is turned on, select **Connect at power-on**. Then select **Next** > **Finish** > **OK**.

## Register the configuration server with Azure Site Recovery services

1. From the VMWare vSphere Client console, turn on the VM.
2. The VM boots up into a Windows Server 2016 installation experience. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator.
4. The first time you sign in, within few seconds the Azure Site Recovery Configuration Tool starts.
5. Enter a name that's used to register the configuration server with Site Recovery. Then select **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription.</br>
    a. The credentials must have access to the vault in which you want to register the configuration server.</br>
    b. Ensure that chosen user account has permissions to create an application in Azure. To enable required permissions, follow guidelines given [here](#azure-active-directory-permission-requirements).
7. The tool performs some configuration tasks, and then reboots.
8. Sign in to the machine again. The configuration server management wizard starts **automatically** in few seconds.

### Configure settings

1. In the configuration server management wizard, select **Setup connectivity**. From the dropdowns, first select the NIC that the in-built process server uses for discovery and push installation of mobility service on source machines, and then select the NIC that Configuration Server uses for connectivity with Azure. Then select **Save**. You cannot change this setting after it is configured. It is strongly advised to not change the IP address of a configuration server. Ensure IP assigned to the Configuration Server is STATIC IP and not DHCP IP.
2. In **Select Recovery Services vault**, sign in to Microsoft Azure with credentials used in **step 6** of "[Register configuration server with Azure Site Recovery Services](#register-the-configuration-server-with-azure-site-recovery-services)".
3. After sign-in, Select your Azure subscription and the relevant resource group and vault.

    > [!NOTE]
    > Once registered, there is no flexibility to change the recovery services vault.
    > Changing recovery services vault would require disassociation of configuration server from current vault, and the replication of all protected virtual machines under the configuration server is stopped. Learn [more](vmware-azure-manage-configuration-server.md#register-a-configuration-server-with-a-different-vault).

4. In **Install third-party software**,

    |Scenario   |Steps to follow  |
    |---------|---------|
    |Can I download & install MySQL manually?     |  Yes. Download MySQL application & place it in the folder **C:\Temp\ASRSetup**, then install manually. Now, when you accept the terms > click on **Download and install**, the portal says *Already installed*. You can proceed to the next step.       |
    |Can I avoid download of MySQL online?     |   Yes. Place your MySQL installer application in the folder **C:\Temp\ASRSetup**. Accept the terms > click on **Download and install**, the portal will use the installer added by you and installs the application. You can proceed to the next step post installation.    |
    |I would like to download & install MySQL through Azure Site Recovery     |  Accept the license agreement & click on **Download and Install**. Then you can proceed to the next step post installation.       |

5. In **Validate appliance configuration**, prerequisites are verified before you continue.
6. In **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, where the VMs you want to replicate are located. Enter the port on which the server is listening. Enter a friendly name to be used for the VMware server in the vault.
7. Enter credentials to be used by the configuration server to connect to the VMware server. Site Recovery uses these credentials to automatically discover VMware VMs that are available for replication. Select **Add**, and then **Continue**. The credentials entered here are locally saved.
8. In **Configure virtual machine credentials**, enter the user name, and password of Virtual machines to automatically install Mobility Service during replication. For **Windows** machines, the account needs local administrator privileges on the machines you want to replicate. For **Linux**, provide details for the root account.
9. Select **Finalize configuration** to complete registration.
10. After registration finishes, open Azure portal, verify that the configuration server and VMware server are listed on **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.

## Upgrade the configuration server

To upgrade the configuration server to the latest version, follow these [steps](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server). For detailed instructions on how to upgrade all Site Recovery components, click [here](service-updates-how-to.md).

## Manage the configuration server

To avoid interruptions in ongoing replication, ensure that IP address of the configuration server does not change after the configuration server has been registered to a vault. You can learn more about common configuration server management tasks [here](vmware-azure-manage-configuration-server.md).

## FAQ

1. How long is the Licence provided on configuration server deployed through OVF is valid? What happens if I do not reactivate the License?

    The license provided with OVA template is an evaluation license valid for 180 days. Before expiry, you need to activate the license. Else, this can result in frequent shutdown of configuration server and thus cause hinderance to replication activities.

2. Can I use the VM, where the configuration server is installed, for different purposes?

    **No**, we recommend you to use the VM for sole purpose of configuration server. Ensure you follow all the specifications mentioned in [Prerequisites](#prerequisites) for efficient management of disaster recovery.
3. Can I switch the vault already registered in the configuration server with a newly created vault?

    **No**, once a vault is registered with configuration server, it cannot be changed.
4. Can I use the same configuration server for protecting both physical and virtual machines?

    **Yes**, the same configuration server can be used for replicating physical and virtual machines. However, physical machine can be failed back only to a VMware VM.
5. What is the purpose of a configuration server and where is it used?

    Refer to [VMware to Azure replication architecture](vmware-azure-architecture.md) to learn more about configuration server and its functionalities.
6. Where can I find the latest version of Configuration server?

    For steps to upgrade the configuration server through the portal, see [Upgrade the configuration server](vmware-azure-manage-configuration-server.md#upgrade-the-configuration-server). For detailed instructions on how to upgrade all Site Recovery components, refer [here](https://aka.ms/asr_how_to_upgrade).
7. Where can I download the passphrase for configuration server?

    Refer to [this article](vmware-azure-manage-configuration-server.md#generate-configuration-server-passphrase) to download the passphrase.
8. Can I change the passphrase?

    **No**, you are **strongly advised to not change the passphrase** of configuration server. Change in passphrase breaks replication of protected machines and leads to critical health state.
9. Where can I download vault registration keys?

    In the **Recovery Services Vault**, **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**. In Servers, select **Download registration key** to download the vault credentials file.
10. Can I clone an existing Configuration Server and use it for replication orchestration?

    **No**, use of a cloned Configuration Server component is not supported. Clone of scale-out process server is also an unsupported scenario. Cloning Site Recovery components impact ongoing replications.

11. Can I change the IP of configuration server?

    **No**, it is strongly recommended to not change the IP address of a configuration server. Ensure all IPs assigned to the Configuration Server are STATIC IPs and not DHCP IPs.
12. Can I set up configuration server on Azure?

    It is recommended to set up configuration server on on-premises environment with direct line-of-sight with v-Center and to minimize data transfer latencies. You can take scheduled backups of configuration server for [failback purposes](vmware-azure-manage-configuration-server.md#failback-requirements).

For more FAQ on configuration server, refer to our [documentation on configuration server common questions](vmware-azure-common-questions.md#configuration-server) .

## Troubleshoot deployment issues

[!INCLUDE [site-recovery-vmware-to-azure-install-register-issues](../../includes/site-recovery-vmware-to-azure-install-register-issues.md)]



## Next steps

Set up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
