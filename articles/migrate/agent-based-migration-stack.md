---
title: Migrate machines as physical servers describes the instructions for new agent-based migration stack
description: This article describes how to migrate physical machines to Azure with Azure Migrate and Modernize. Learn the instructions for new agent-based migration stack
author: habibaum 
ms.author: v-uhabiba
ms.manager: vijain
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 09/26/2024
ms.custom: engagement-fy25
---


# Agent-based migration stack

This article introduces an upgraded agent-based migration stack for physical and VMware environments. Customers will benefit from the ability to migrate newer Linux distributions to Azure, use WS2019 for the replication appliance, and enjoy a unified OS support matrix. The new Linux distributions supported include:

* Oracle Linux 9.0
* Oracle Linux 9.1
* RHEL 9.0
* RHEL 9.1
* Ubuntu 22.04
* SLES 15 SP5

To try the private preview, go to [Azure Portal](/?bundlingKind=DefaultPartitioner&configHash=aQy6IDek4p1d&env=ms&feature.rcmstack=true&l=en.en-us&pageVersion=15.118.0.1016132058.250212-1352#view/Microsoft_Azure_Migrate/AmhResourceMenuBlade/~/serverGoal)

## Navigate to Azure Migrate project

Follow the steps to navigate to the Azure Migrate project

**Step 1**: Navigate to Azure Migrate project

1. Open [Azure portal](/view/Microsoft_Azure_Migrate/AmhResourceMenuBlade/~/serverGoal) 
1. Search for the **Azure Migrate** service.
1. Create a new project or select an existing one. [Learn more](/azure/migrate/)

**Step 2**: Select the required Agent-Based Migration Scenario

1. Select **Discover** from the Migration tools.
1. Select the scenario **VMware agent-based replication** or **Physical or other**.
1. If resources are not already created, select a target region for your migration and create the resources.

     :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/azure-migrate-discover.png" alt-text="Shows the azure migrate discover screen":::

1. Select **Simplified experience** from the **Experience type** dropdown.

> [!Note]
> For more detailed information on deploying the appliance, refer to the appendix section at the end of this document.

**Step 3**: : Deploy the Appliance

1. Follow the steps with OVA or PowerShell for VMware and PowerShell for the physical scenario. 
1. After deployment and completing the registration key process, wait for 30 minutes for the appliance to connect.

**Step 4**: Start the Replication
1. Select **Replicate**.
1. Select the appropriate scenario (Physical or VMware agent-based) and proceed. 
1. Select the VMs you want to replicate and configure the target settings.

**Step 5**: Test migrate and Migrate

1. Navigate to the migration overview page.
1. Select **Test Migrate**. For more details, see, [Migrate machines as physical servers to Azure with Azure Migrate and Modernize](/azure/migrate/tutorial-migrate-physical-virtual-machines#run-a-test-migration).
1. Perform the final migration. [Learn more](/azure/migrate/tutorial-migrate-physical-virtual-machines#migrate-vms)

**Step 6**: Verify the VM in Azure VM 

Verify if the VM boots up on Azure: 
* By going to the target resource group and searching for your VM. 
* Or by navigating to the Azure VM section on the Azure Portal and searching for your migrated VM.

### Set up the replication appliance using the OVA template for VMware agent-based migration

We recommend using this approach as it ensures all prerequisite configurations are handled by the template. The OVA template creates a machine with the required specifications.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/download-ova-file.png" alt-text="Shows the download option of the ova file":::

Follow the steps:

1. **Download** the OVA template to set up an appliance on your on-premises environment.
1. Power on the appliance VM to accept the Microsoft Evaluation license. 
1. Provide a password for the administrator user. 
1. Select **Finalize** the system reboots, and you can log in with the administrator user account.

Set up the appliance using PowerShell

If there are organizational restrictions, you can manually set up the replication appliance through PowerShell. 

Follow these steps:
1. Download the installers and place them on the replication appliance.
1. Unzip and extract the components.
1. Execute the **DRInstaller.ps1 PowerShell** script as an administrator.

Register Appliance

After the appliance is created, the **Microsoft Azure Appliance Configuration Manager** launches automatically. It validates prerequisites such as internet connectivity, time synchronization, system configurations, and group policies.

**CheckRegistryAccessPolicy** - Prevents access to registry editing tools
    - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System`.
    - The DisableRegistryTools value should not be equal to 0.

**CheckCommandPromptPolicy** - Prevents access to the command prompt
    - Key: `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`.
    - The DisableCMD value should be equal to 0.

**CheckTrustLogicAttachmentsPolicy** - Trust logic for file attachments.
    - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Attachments`.
    - The UseTrustedHandlers value should not be equal to 3.

**CheckPowershellExecutionPolicy** - Turn on Script Execution.
    - PowerShell execution policy should not be set to **AllSigned or Restricted**.
    - Ensure the group policy **Turn on Script Execution Attachment Manager** is not set to Disabled or **Allow only signed scripts**.

Use the following steps to register the appliance:

1. If the appliance uses a proxy for internet access, configure the proxy settings by toggling on the 'Use proxy to connect to internet' option.
    - All Azure Site Recovery services will use these settings to connect to the internet.
    
    > [!Note]
    > Only HTTP proxy is supported.
1. Ensure the [required URLs](/azure/site-recovery/replication-appliance-support-matrix#allow-urls) are allowed and reachable from the Azure Site Recovery replication appliance to maintain continuous connectivity.
1. After the prerequisites are verified, the appliance fetchs all its component information in the next step. Review the status of all components and then select **Continue**.
1. **Save** the details, and then proceed to choose the appliance connectivity method. You can select either FQDN or a NAT IP to define how communication with the appliance occurs.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/select-replication-appliance-connectivity.png" alt-text="Shows how to select replication appliance connectivity":::
1. After saving the connectivity details, select **Continue** to proceed with registration in Microsoft Azure. 
1. Ensure the [prerequisites](/azure/site-recovery/replication-appliance-support-matrix#pre-requisites) are met, and then proceed with the registration.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/registry-with-recovery-service-vault.png" alt-text="Shows registry with recovery service vault":::

1. **Friendly name of appliance**: Provide a friendly name to track this appliance in the Azure portal under Recovery Services Vault infrastructure. 
    > [!Note]
    > The name can't be changed once set.
1. **Azure Migrate replication appliance key**: Copy the key from the portal's discovery screen.
    
    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/generate-key.png" alt-text="Shows the generated key":::

1. After pasting the key, select **Login**. You're redirected to a new authentication tab. By default, an authentication code is generated on the **Appliance Configuration Manager** page. Use the following code in the authentication tab. 
1. Enter your Microsoft Azure credentials to complete the registration. 
1. After successful registration, you can close the tab and return to the **Appliance Configuration Manager** to continue the setup.
1. 
    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/microsoft-code.png" alt-text="Shows to enter the microsoft code":::

> [!Note]
> An authentication code expires within 5 minutes of generation. If there is inactivity for longer than this duration, you're prompted to re-log in to Azure.

1. After successfully signing in, the details for Subscription, Resource Group, and Recovery Services Vault are displayed. 
1. Select **Continue** to proceed.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/register-with-recovery-services.png" alt-text="Shows to register with recovery services":::

1. After successful registration, proceed to configure **vCenter** details. 

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/provide-vcenter-information.png" alt-text="Illustrates the vcenter information":::

1. Select **Add vCenter Server** to input the vCenter information. 
1. Enter the server name or IP address of the vCenter along with the port information, and then provide the username, password, and a friendly name. This information is used to fetch details of the [virtual machines managed through the vCenter](/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises#prepare-an-account-for-automatic-discovery). The user account details are encrypted and stored locally on the machine

    > [!Note]
    > If you're adding the same vCenter Server to multiple appliances, ensure that the same friendly name is used across all appliances.

1. After successfully saving the vCenter information, select **Add Virtual Machine** credentials to provide user details for the VMs discovered through the vCenter

    > [!Note]
    > - For Linux OS, ensure to provide root credentials.
    - For Windows OS, a user account with admin privileges should be added. These credentials are used to push the installation of the mobility agent onto the source VM during the enable replication operation. The credentials can be chosen per VM in the Azure portal during the enable replication workflow. 
    - Visit the **Appliance Configurator** to edit or add credentials to access your machines.
    
1. After adding the vCenter details, expand **Provide Physical Server Details** to add information about any physical servers you plan to protect.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/provide-physical-server-details.png" alt-text="Illustrates the physical server details":::

1. Select **Add Credentials** to input the credentials of the machine(s) you plan to protect. Provide all necessary details, such as the **Operating System**, a **friendly name** for the credential, **username**, and **Password**. The user account details are encrypted and stored locally on the machine. 
1. Finally, select **Add**.

     :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-credentials.png" alt-text="Show how to add physical server credentials":::

1. Select **Add Server** to add the physical server details. Provide the machine's **IP address or FQDN**. 
1. Select the **credential account**, and then select **Add**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-details.png" alt-text="Show how to add physical server details":::

1. After successfully adding the details, select **Continue** to install all Azure Site Recovery replication appliance components and register with Azure services. This process can take up to 30 minutes. Ensure you don't close the browser while the configuration is in progress.

    > [!Note]
    > Appliance cloning is not supported in modernized or simplified architecture. Attempting to clone may disrupt the recovery flow.

## Next steps

- [Agent-based migration architecture]([Learn how](/azure/migrate/tutorial-migrate-physical-virtual-machines)
- [Migrate machines as physical servers to Azure](/azure/migrate/tutorial-migrate-physical-virtual-machines)
- [Prepare for Migration](/azure/migrate/prepare-for-migration)
- 