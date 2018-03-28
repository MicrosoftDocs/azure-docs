---
title: Manage the configuration server for VMware disaster recovery with Azure Site Recovery | Microsoft Docs
description: This article describes how to manage an existing configuration server for VMware disaster recovery to Azure with Azure Site Recovery.
services: site-recovery
author: AnoopVasudavan
ms.service: site-recovery
ms.topic: article
ms.date: 03/05/2018
ms.author: anoopkv
---

# Manage the configuration server for VMware VMs

You set up an on-premises configuration server when you use [Azure Site Recovery](site-recovery-overview.md) for disaster recovery of VMware VMs and physical servers to Azure. The configuration server coordinates communications between on-premises VMware and Azure and manages data replication. This article summarizes common tasks for managing the configuration server after it's deployed.


## Modify VMware settings

Modify settings for the VMware server to which the configuration server connects.

1. Sign in to the machine running the configuration server.
2. Start Azure Site Recovery Configuration Manager from the desktop shortcut. Or, open [this link](https://configuration-server-name/IP:44315).
3. Select **Manage vCenter Server/vSPhere ESXi server**, and then do the following:

    * To associate a different VMware server with the configuration server, select **Add vCenter Server/vSphere ESXi server**. Enter the server details.

    * To update the credentials used to connect to the VMware server for automatic discovery of VMware VMs, select **Edit**. Enter the new credentials, and then select **OK**.

    ![Modify VMware](./media/vmware-azure-manage-configuration-server/modify-vmware-server.png)

## Modify credentials for Mobility Service installation

Modify the credentials used to automatically install Mobility Service on the VMware VMs you enable for replication.

1. Sign in to the machine running the configuration server.
2. Start Site Recovery Configuration Manager from the desktop shortcut. Or, open [this link](https://configuration-server-name/IP:44315).
3. Select **Manage virtual machine credentials**, and enter the new credentials. Then select **OK** to update the settings.

    ![Modify Mobility Service credentials](./media/vmware-azure-manage-configuration-server/modify-mobility-credentials.png)

## Modify proxy settings

Modify the proxy settings used by the configuration server machine for internet access to Azure. If you have a process server machine in addition to the default process server running on the configuration server machine, modify the settings on both machines.

1. Sign in to the machine running the configuration server.
2. Start Site Recovery Configuration Manager from the desktop shortcut. Or, open [this link](https://configuration-server-name/IP:44315).
3. Select **Manage connectivity**, and update the proxy values. Then select **Save** to update the settings.

## Add a network adapter

The Open Virtualization Format (OVF) template deploys the configuration server VM with a single network adapter. You can [add an additional adapter to the VM)](vmware-azure-deploy-configuration-server.md#add-an-additional-adapter), but you need to add it before you register the configuration server in the vault.

To add an adapter after you register the configuration server in the vault, add the adapter in the VM properties. Then reregister the server in the vault.


## Reregister a configuration server in the same vault

You can reregister the configuration server in the same vault if you need to. If you have an additional process server machine, in addition to the default process server running on the configuration server machine, reregister both machines.


  1. In the vault, open **Manage** > **Site Recovery Infrastructure** > **Configuration Servers**.
  2. In **Servers**, select **Download registration key** to download the vault credentials file.
  3. Sign in to the configuration server machine.
  4. In **%ProgramData%\ASR\home\svagent\bin**, open **cspsconfigtool.exe**.
  5. On the **Vault Registration** tab, select **Browse** and locate the vault credentials file you downloaded.
  6. If needed, provide proxy server details. Then select **Register**.
  7. Open an admin PowerShell command window, and run the following command:

      ```
      $pwd = ConvertTo-SecureString -String MyProxyUserPassword
      Set-OBMachineSetting -ProxyServer http://myproxyserver.domain.com -ProxyPort PortNumber – ProxyUserName domain\username -ProxyPassword $pwd
      net stop obengine
      net start obengine
      ```

## Upgrade the configuration server

You run update rollups to update the configuration server. Updates can be applied for up to N-4 versions. For example:

- If you run 9.7, 9.8, 9.9, or 9.10, you can upgrade directly to 9.11.
- If you run 9.6 or earlier and you want to upgrade to 9.11, you must first upgrade to version 9.7. before 9.11.

Links to update rollups for upgrading to all versions of the configuration server are available in the [wiki updates page](https://social.technet.microsoft.com/wiki/contents/articles/38544.azure-site-recovery-service-updates.aspx).

Upgrade the server as follows:

1. Download the update installer file to the configuration server.
2. Double-click to run the installer.
3. The installer detects the current version running on the machine.
4. Select **OK** to confirm, and run the upgrade. 


## Delete or unregister a configuration server

1. Disable [Disable protection](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) for all VMs under the configuration server.
2. [Disassociate](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) and [delete](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) all replication policies from the configuration server.
3. [Delete](vmware-azure-manage-vcenter.md#delete-a-vcenter-server) all vCenter servers/vSphere hosts that are associated with the configuration server.
4. In the vault, open **Site Recovery Infrastructure** > **Configuration Servers**.
5. Select the configuration server that you want to remove. Then, on the **Details** page, select **Delete**.

    ![Delete configuration server](./media/vmware-azure-manage-configuration-server/delete-configuration-server.png)
   

### Delete with PowerShell

You can optionally delete the configuration server by using PowerShell.

1. [Install](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-4.4.0) the Azure PowerShell module.
2. Sign in to your Azure account by using this command:
    
    `Login-AzureRmAccount`
3. Select the vault subscription.

     `Get-AzureRmSubscription –SubscriptionName <your subscription name> | Select-AzureRmSubscription`
3.  Set the vault context.
    
    ```
    $vault = Get-AzureRmRecoveryServicesVault -Name <name of your vault>
    Set-AzureRmSiteRecoveryVaultSettings -ARSVault $vault
    ```
4. Retrieve the configuration server.

    `$fabric = Get-AzureRmSiteRecoveryFabric -FriendlyName <name of your configuration server>`
6. Delete the configuration server.

    `Remove-AzureRmSiteRecoveryFabric -Fabric $fabric [-Force] `

> [!NOTE]
> You can use the **-Force** option in Remove-AzureRmSiteRecoveryFabric for forced deletion of the configuration server.
 


## Renew SSL certificates

The configuration server has an inbuilt web server, which orchestrates activities of the Mobility Service, process servers, and master target servers connected to it. The web server uses an SSL certificate to authenticate clients. The certificate expires after three years and can be renewed at any time.

### Check expiry

For configuration server deployments before May 2016, certificate expiry was set to one year. If you have a certificate that is going to expire, the following occurs:

- When the expiry date is two months or less, the service starts sending notifications in the portal, and by email (if you subscribed to Site Recovery notifications).
- A notification banner appears on the vault resource page. For more information, select the banner.
- If you see an **Upgrade Now** button, it indicates that some components in your environment haven't been upgraded to 9.4.xxxx.x or higher versions. Upgrade the components before you renew the certificate. You can't renew on older versions.

### Renew the certificate

1. In the vault, open **Site Recovery Infrastructure** > **Configuration Server**. Select the required configuration server.
2. The expiry date appears under **Configuration Server health**.
3. Select **Renew Certificates**. 


## Next steps

Review the tutorials for setting up disaster recovery of [VMware VMs](vmware-azure-tutorial.md) to Azure.
