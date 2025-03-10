---
title: Manage the configuration server for disaster recovery with Azure Site Recovery
description: Learn about the common tasks to manage an on-premises configuration server for disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery.
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: ankitadutta
ms.date: 08/03/2022
---

# Manage the configuration server for VMware VM/physical server disaster recovery

You set up an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. The configuration server coordinates communications between on-premises VMware and Azure and manages data replication. This article summarizes common tasks for managing the configuration server after it's deployed.


[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

## Update Windows license

The license provided with the OVF template is an evaluation license valid for 180 days. For uninterrupted usage, you must activate Windows with a procured license. License update can be done either through a standalone key or KMS standard key. Guidance is available at [DISM Windows command line for running OS](/windows-hardware/manufacture/desktop/dism-windows-edition-servicing-command-line-options). To obtain keys, refer to [KMS client set up](/windows-server/get-started/kmsclientkeys).

## Access configuration server

You can access the configuration server as follows:

* Sign in to the VM on which it's deployed, and Start **Azure Site Recovery Configuration Manager** from the desktop shortcut.
* Alternatively, you can access the configuration server remotely from https://*ConfigurationServerName*/:44315/. Sign in with administrator credentials.

## Modify VMware server settings

1. To associate a different VMware server with the configuration server, after [sign-in](#access-configuration-server), select **Add vCenter Server/vSphere ESXi server**.
2. Enter the details, and then select **OK**.

## Modify credentials for automatic discovery

1. To update the credentials used to connect to the VMware server for automatic discovery of VMware VMs, after [sign-in](#access-configuration-server), choose the account and click **Edit**.
2. Enter the new credentials, and then select **OK**.

    ![Modify VMware](./media/vmware-azure-manage-configuration-server/modify-vmware-server.png)

You can also modify the credentials through CSPSConfigtool.exe.

1. Log in to the configuration server and launch CSPSConfigtool.exe
2. Choose the account you wish to modify and click **Edit**.
3. Enter the modified credentials and click **Ok**

## Modify credentials for Mobility Service installation

Modify the credentials used to automatically install Mobility Service on the VMware VMs you enable for replication.

1. After [sign-in](#access-configuration-server), select **Manage virtual machine credentials**
2. Choose the account you wish to modify and click **Edit**
3. Enter the new credentials, and then select **OK**.

    ![Modify Mobility Service credentials](./media/vmware-azure-manage-configuration-server/modify-mobility-credentials.png)

You can also modify credentials through CSPSConfigtool.exe.

1. Log in to the configuration server and launch CSPSConfigtool.exe
2. Choose the account you wish to modify and click **Edit**
3. Enter the new credentials and click **Ok**.

## Add credentials for Mobility service installation

If you missed adding credentials during OVF deployment of configuration server,

1. After [sign-in](#access-configuration-server), select **Manage virtual machine credentials**.
2. Click on **Add virtual machine credentials**.
    ![Screenshot shows Manage virtual machine credentials pane with the Add virtual machine credentials link.](media/vmware-azure-manage-configuration-server/add-mobility-credentials.png)
3. Enter the new credentials and click on **Add**.

You can also add credentials through CSPSConfigtool.exe.

1. Log in to the configuration server and launch CSPSConfigtool.exe
2. Click **Add**, enter the new credentials and click **Ok**.

## Modify proxy settings

Modify the proxy settings used by the configuration server machine for internet access to Azure. If you have a process server machine in addition to the default process server running on the configuration server machine, modify the settings on both machines.

1. After [sign-in](#access-configuration-server) to the configuration server, select **Manage connectivity**.
2. Update the proxy values. Then select **Save** to update the settings.

## Add a network adapter

The Open Virtualization Format (OVF) template deploys the configuration server VM with a single network adapter.

- You can [add an additional adapter to the VM](vmware-azure-deploy-configuration-server.md#add-an-additional-adapter), but you must add it before you register the configuration server in the vault.
- To add an adapter after you register the configuration server in the vault, add the adapter in the VM properties. Then you need to [re-register](#reregister-a-configuration-server-in-the-same-vault) the server in the vault.

## How to renew SSL certificates

The configuration server has an inbuilt web server, which orchestrates activities of the Mobility agents on all protected machines, inbuilt/scale-out process servers, and master target servers connected to it. The web server uses an SSL certificate to authenticate clients. The certificate expires after three years and can be renewed at any time.

### Check expiry

The expiry date appears under **Configuration Server health**. For configuration server deployments before May 2016, certificate expiry was set to one year. If you have a certificate that is going to expire, the following occurs:

- When the expiry date is two months or less, the service starts sending notifications in the portal, and by email (if you subscribed to Site Recovery notifications).
- A notification banner appears on the vault resource page. For more information, select the banner.
- If you see an **Upgrade Now** button, it indicates that some components in your environment haven't been upgraded to 9.4.xxxx.x or higher versions. Upgrade the components before you renew the certificate. You can't renew on older versions.

### If certificates are yet to expire

1. To renew, in the vault, open **Site Recovery Infrastructure** > **Configuration Server**. Select the required configuration server.
2. Ensure all components scale-out process servers, master target servers and mobility agents on all protected machines are on latest versions and are in connected state.
3. Now, select **Renew Certificates**.
4. Carefully follow instructions on this page and click okay to renew certificates on selected configuration server and it's associated components.

### If certificates have already expired

1. Post expiry, certificates **cannot be renewed from Azure portal**. Before proceeding, ensure all components scale-out process servers, master target servers and mobility agents on all protected machines are on latest versions and are in connected state.
2. **Follow this procedure only if certificates have already expired.** Login to configuration server, navigate to *C:\ProgramData\ASR\home\svsystems\bin* and execute **RenewCerts** executor tool as administrator.
3. A PowerShell execution window pops-up and triggers renewal of certificates. This can take up to 15 minutes. Do not close the window until completion of renewal.

:::image type="content" source="media/vmware-azure-manage-configuration-server/renew-certificates.png" alt-text="RenewCertificates":::

## Reregister a configuration server in the same vault

You can reregister the configuration server in the same vault if you need to. If you have an additional process server machine, in addition to the default process server running on the configuration server machine, reregister both machines.


1. In the vault, open **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.
2. In **Servers**, select **Download registration key** to download the vault credentials file.
3. Sign in to the configuration server machine.
4. In **%ProgramData%\ASR\home\svsystems\bin**, open **cspsconfigtool.exe**.
5. On the **Vault Registration** tab, select **Browse**, and locate the vault credentials file that you downloaded.
6. If needed, provide proxy server details. Then select **Register**.
7. Open an admin PowerShell command window, and run the following command:
   ```
    $pwd = ConvertTo-SecureString -String MyProxyUserPassword
    Set-OBMachineSetting -ProxyServer http://myproxyserver.domain.com -ProxyPort PortNumber – ProxyUserName domain\username -ProxyPassword $pwd
   ```

    >[!NOTE]
    >In order to **pull latest certificates** from configuration server to scale-out process server execute the  command
    > *"\<Installation Drive\Microsoft Azure Site Recovery\agent\cdpcli.exe>"--registermt*

8. Finally, restart the obengine by executing the following command.
   ```
        net stop obengine
        net start obengine
   ```


## Register a configuration server with a different vault

> [!WARNING]
> The following step disassociates the configuration server from the current vault, and the replication of all protected virtual machines under the configuration server is stopped.

1. Log in to the configuration server.
2. Open an admin PowerShell command window, and run the following command:

    ```
    reg delete "HKLM\Software\Microsoft\Azure Site Recovery\Registration"
    net stop dra
    ```
3. Launch the configuration server appliance browser portal using the shortcut on your desktop.
4. Perform the registration steps similar to a new configuration server [registration](vmware-azure-tutorial.md#register-the-configuration-server).

## Upgrade the configuration server

You run update rollups to update the configuration server. Updates can be applied for up to N-4 versions. For example:

- If you run 9.7, 9.8, 9.9, or 9.10, you can upgrade directly to 9.11.
- If you run 9.6 or earlier and you want to upgrade to 9.11, you must first upgrade to version 9.7. before 9.11.

For detailed guidance on Azure Site Recovery components support statement refer [here](./service-updates-how-to.md#support-statement-for-azure-site-recovery).
Links to update rollups for upgrading to all versions of the configuration server are available [here](./service-updates-how-to.md#links-to-currently-supported-update-rollups).

> [!IMPORTANT]
> With every new version 'N' of an Azure Site Recovery component that is released, all versions below 'N-4' is considered out of support. It is always advisable to upgrade to the latest versions available.</br>
> For detailed guidance on Azure Site Recovery components support statement refer [here](./service-updates-how-to.md#support-statement-for-azure-site-recovery).

Upgrade the server as follows:

1. In the vault, go to **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.
2. If an update is available, a link appears in the **Agent Version** > column.
    ![Update](./media/vmware-azure-manage-configuration-server/update2.png)
3. Download the update installer file to the configuration server.

    ![Screenshot that shows where to click to download the update installer file.](./media/vmware-azure-manage-configuration-server/update1.png)

4. Double-click to run the installer.
5. The installer detects the current version running on the machine. Click **Yes** to start the upgrade.
6. When the upgrade completes the server configuration validates.

    ![Screenshot that shows the completed server validation configuration.](./media/vmware-azure-manage-configuration-server/update3.png)

7. Click **Finish** to close the installer.
8. To upgrade rest of the Site Recovery components, refer to our [upgrade guidance](./service-updates-how-to.md#vmware-vmphysical-server-disaster-recovery-to-azure).

## Upgrade configuration server/process server from the command line

Run the installation file as follows:

  ```
  UnifiedSetup.exe [/ServerMode <CS/PS>] [/InstallDrive <DriveLetter>] [/MySQLCredsFilePath <MySQL credentials file path>] [/VaultCredsFilePath <Vault credentials file path>] [/EnvType <VMWare/NonVMWare>] [/PSIP <IP address to be used for data transfer] [/CSIP <IP address of CS to be registered with>] [/PassphraseFilePath <Passphrase file path>]
  ```

### Sample usage
  ```
  MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted
  cd C:\Temp\Extracted
  UNIFIEDSETUP.EXE /AcceptThirdpartyEULA /servermode "CS" /InstallLocation "D:\" /MySQLCredsFilePath "C:\Temp\MySQLCredentialsfile.txt" /VaultCredsFilePath "C:\Temp\MyVault.vaultcredentials" /EnvType "VMWare"
  ```


### Parameters

|Parameter Name| Type | Description| Values|
|-|-|-|-|
| /ServerMode|Required|Specifies whether both the configuration and process servers should be installed, or the process server only|CS<br>PS|
|/InstallLocation|Required|The folder in which the components are installed| Any folder on the computer|
|/MySQLCredsFilePath|Required|The file path in which the MySQL server credentials are stored|The file should be the format specified below|
|/VaultCredsFilePath|Required|The path of the vault credentials file|Valid file path|
|/EnvType|Required|Type of environment that you want to protect |VMware<br>NonVMware|
|/PSIP|Required|IP address of the NIC to be used for replication data transfer| Any valid IP Address|
|/CSIP|Required|The IP address of the NIC on which the configuration server is listening on| Any valid IP Address|
|/PassphraseFilePath|Required|The full path to location of the passphrase file|Valid file path|
|/BypassProxy|Optional|Specifies that the configuration server connects to Azure without a proxy||
|/ProxySettingsFilePath|Optional|Proxy settings (The default proxy requires authentication, or a custom proxy)|The file should be in the format specified below|
|DataTransferSecurePort|Optional|Port number on the PSIP to be used for replication data| Valid Port Number (default value is 9433)|
|/SkipSpaceCheck|Optional|Skip space check for cache disk| |
|/AcceptThirdpartyEULA|Required|Flag implies acceptance of third-party EULA| |
|/ShowThirdpartyEULA|Optional|Displays third-party EULA. If provided as input all other parameters are ignored| |



### Create file input for MYSQLCredsFilePath

The MySQLCredsFilePath parameter takes a file as input. Create the file using the following format and pass it as input MySQLCredsFilePath parameter.
```ini
[MySQLCredentials]
MySQLRootPassword = "Password>"
MySQLUserPassword = "Password"
```
### Create file input for ProxySettingsFilePath
ProxySettingsFilePath parameter takes a file as input. Create the file using the following format and pass it as input ProxySettingsFilePath parameter.

```ini
[ProxySettings]
ProxyAuthentication = "Yes/No"
Proxy IP = "IP Address"
ProxyPort = "Port"
ProxyUserName="UserName"
ProxyPassword="Password"
```

## Delete or unregister a configuration server

1. [Disable protection](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) for all VMs under the configuration server.
2. [Disassociate](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) and [delete](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) all replication policies from the configuration server.
3. [Delete](vmware-azure-manage-vcenter.md#delete-a-vcenter-server) all vCenter servers/vSphere hosts that are associated with the configuration server.
4. In the vault, open **Site Recovery Infrastructure** > **Configuration Servers**.
5. Select the configuration server that you want to remove. Then, on the **Details** page, select **Delete**.

    ![Delete configuration server](./media/vmware-azure-manage-configuration-server/delete-configuration-server.png)


### Delete with PowerShell

You can optionally delete the configuration server by using PowerShell.

1. [Install](/powershell/azure/install-azure-powershell) the Azure PowerShell module.
2. Sign in to your Azure account by using this command:

    `Connect-AzAccount`
3. Select the vault subscription.

     `Get-AzSubscription –SubscriptionName <your subscription name> | Select-AzSubscription`
3.  Set the vault context.

    ```
    $vault = Get-AzRecoveryServicesVault -Name <name of your vault>
    Set-AzRecoveryServicesAsrVaultContext -Vault $vault
    ```
4. Retrieve the configuration server.

    `$fabric =  Get-AzRecoveryServicesAsrFabric -FriendlyName <name of your configuration server>`
6. Delete the configuration server.

    `Remove-AzRecoveryServicesAsrFabric -Fabric $fabric [-Force]`

> [!NOTE]
> You can use the **-Force** option in Remove-AzRecoveryServicesAsrFabric for forced deletion of the configuration server.

## Generate configuration server Passphrase

1. Sign in to your configuration server, and then open a command prompt window as an administrator.
2. To change the directory to the bin folder, execute the command **cd %ProgramData%\ASR\home\svsystems\bin**
3. To generate the passphrase file, execute **genpassphrase.exe -v > MobSvc.passphrase**.
4. Your passphrase will be stored in the file located at **%ProgramData%\ASR\home\svsystems\bin\MobSvc.passphrase**.

## Refresh Configuration server

1. In the Azure portal, navigate to **Recovery Services Vault** > **Manage** > **Site Recovery Infrastructure** > **For VMware & Physical machines** > **Configuration Servers**
2. Click on the configuration server you wish to refresh.
3. On the blade with details of chosen configuration server, click **More** > **Refresh Server**.
4. Monitor the progress of the job under **Recovery Services Vault** > **Monitoring** > **Site Recovery jobs**.

## Failback requirements

During reprotect and failback, the on-premises configuration server must be running and in a connected state. For successful failback, the virtual machine being failed back must exist in the configuration server database.

Ensure that you take regular scheduled backups of your configuration server. If a disaster occurs and the configuration server is lost, you must first restore the configuration server from a backup copy and ensure that the restored configuration server has the same IP address with which it was registered to the vault. Failback will not work if a different IP address is used for the restored configuration server.

## Next steps

Review the tutorials for setting up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
