---
title: Troubleshoot replication issues for disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for common replication issues during disaster recovery of VMware VMs and physical servers to Azure by using Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 01/18/2019
ms.author: ramamill

---
# Troubleshoot replication issues for VMware VMs and physical servers

You might see a specific error message when you protect your VMware virtual machines or physical servers by using Azure Site Recovery. This article describes some common issues you might encounter when you replicate on-premises VMware VMs and physical servers to Azure by using [Site Recovery](site-recovery-overview.md).

## Initial replication issues

Initial replication failures often are caused by connectivity issues between the source server and the process server or between the process server and Azure. In most cases, you can troubleshoot these issues by completing the steps in the following sections.

### Check the source machine

The following list shows ways you can check the source machine:

*  At the command line on the source server, use Telnet to ping the process server via the HTTPS port (the default HTTPS port is 9443) by running the following command. The command checks for network connectivity issues and for issues that block the firewall port.


   `telnet <process server IP address> <port>`


   > [!NOTE]
   > Use Telnet to test connectivity. Don’t use `ping`. If Telnet isn't installed, complete the steps listed in [Install Telnet Client](https://technet.microsoft.com/library/cc771275(v=WS.10).aspx).

   If you can't connect to the process server, allow inbound port 9443 on the process server. For example, you might need to allow inbound port 9443 on the process server if your network has a perimeter network or screened subnet. Then, check to see whether the problem still occurs.

*  Check the status of the **InMage Scout VX Agent – Sentinel/OutpostStart** service. If the service isn't running, start the service, and then check to see whether the problem still occurs.   

### Check the process server

The following list shows ways you can check the process server:

*  **Check whether the process server is actively pushing data to Azure**.

   1. On the process server, open Task Manager (press Ctrl+Shift+Esc).
   2. Select the **Performance** tab, and then select the **Open Resource Monitor** link. 
   3. On the **Resource Monitor** page, select the **Network** tab. Under **Processes with Network Activity**, check whether **cbengine.exe** is actively sending a large volume of data.

        ![Screenshot that shows the volumes under Processes with Network Activity](./media/vmware-azure-troubleshoot-replication/cbengine.png)

   If cbengine.exe isn't sending a large volume of data, complete the steps in the following sections.

*  **Check whether the process server can connect to Azure Blob storage**.

   Select **cbengine.exe**. Under **TCP Connections**, check to see whether there is connectivity from the process server to the Azure Blog storage URL.

   ![Screenshot that shows connectivity between cbengine.exe and the Azure Blob storage URL](./media/vmware-azure-troubleshoot-replication/rmonitor.png)

   If there's no connectivity from the process server to the Azure Blog storage URL, in Control Panel, select **Services**. Check to see whether the following services are running:

   *  cxprocessserver
   *  InMage Scout VX Agent – Sentinel/Outpost
   *  Microsoft Azure Recovery Services Agent
   *  Microsoft Azure Site Recovery Service
   *  tmansvc

   Start or restart any service that isn't running. Check to see whether the problem still occurs.

*  **Check whether the process server can connect to the Azure public IP address by using port 443**.

   In %programfiles%\Microsoft Azure Recovery Services Agent\Temp, open the latest CBEngineCurr.errlog file. In the file, search for **443** or for the string **connection attempt failed**.

   ![Screenshot that shows the error logs in the Temp folder](./media/vmware-azure-troubleshoot-replication/logdetails1.png)

   If issues are shown, at the command line in the process server, use Telnet to ping your Azure public IP address (the IP address is masked in the preceding image). You can find your Azure public IP address in the CBEngineCurr.currLog file by using port 443:

   `telnet <your Azure Public IP address as seen in CBEngineCurr.errlog>  443`

   If you can't connect, check whether the access issue is due to firewall or proxy settings as described in the next step.

*  **Check whether the IP address-based firewall on the process server blocks access**.

   If you use IP address-based firewall rules on the server, download the complete list of [Microsoft Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). Add the IP address ranges to your firewall configuration to ensure that the firewall allows communication to Azure (and to the default HTTPS port, 443). Allow IP address ranges for the Azure region of your subscription and for the Azure West US region (used for access control and identity management).

*  **Check whether a URL-based firewall on the process server blocks access**.

   If you use a URL-based firewall rule on the server, add the URLs listed in the following table to the firewall configuration:

[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]  

*  **Check whether proxy settings on the process server block access**.

   If you use a proxy server, ensure that the proxy server name is resolved by the DNS server. To check the value that you provided when you set up the configuration server, go to the registry key **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure Site Recovery\ProxySettings**.

   Next, ensure that the same settings are used by the Azure Site Recovery agent to send data: 
      
   1. Search for **Microsoft Azure Backup**. 
   2. Open **Microsoft Azure Backup**, and then select **Action** > **Change Properties**. 
   3. On the **Proxy Configuration** tab, you should see the proxy address. The proxy address should be same as the proxy address that's shown in the registry settings. If not, change it to the same address.

*  **Check whether the throttle bandwidth is constrained on the process server**.

   Increase the bandwidth, and then check whether the problem still occurs.

## Source machine isn't listed in the Azure portal

When you try to select the source machine to enable replication by using Site Recovery, the machine might not be available for one of the following reasons:

* **Two virtual machines with same instance UUID**: If two virtual machines under the vCenter have the same instance UUID, the first virtual machine discovered by the configuration server is shown in the Azure portal. To resolve this issue, ensure that no two virtual machines have the same instance UUID. This scenario is common seen in instances where a backup VM becomes active and is logged into our discovery records. Refer to [Azure Site Recovery VMware-to-Azure: How to clean up duplicate or stale entries](https://social.technet.microsoft.com/wiki/contents/articles/32026.asr-vmware-to-azure-how-to-cleanup-duplicatestale-entries.aspx) to resolve.
* **Incorrect vCenter user credentials**: Ensure that you added the correct vCenter credentials when you set up the configuration server by using the OVF template or unified setup. To verify the credentials that you added during setup, see [Modify credentials for automatic discovery](vmware-azure-manage-configuration-server.md#modify-credentials-for-automatic-discovery).
* **vCenter insufficient privileges**: If the permissions provided to access vCenter don't have the required permissions, failure to discover virtual machines might occur. Ensure that the permissions described in [Prepare an account for automatic discovery](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery) are added to the vCenter user account.
* **Azure Site Recovery management servers**: If the virtual machine is used as management server under one or more of the following roles - Configuration server /scale-out process server / Master target server, then you will not be able to choose the virtual machine from portal. Managements servers cannot be replicated.
* **Already protected/failed over through Azure Site Recovery services**: If the virtual machine is already protected or failed over through Site Recovery, the virtual machine isn't available to select for protection in the portal. Ensure that the virtual machine you're looking for in the portal isn't already protected by any other user or under a different subscription.
* **vCenter not connected**: Check if vCenter is in connected state. To verify, go to Recovery Services vault > Site Recovery Infrastructure > Configuration Servers > Click on respective configuration server > a blade opens on your right with details of associated servers. Check if vCenter is connected. If in "Not Connected" state, resolve the issue and then [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server) on the portal. After this, virtual machine will be listed on the portal.
* **ESXi powered off**: If ESXi host under which the virtual machine resides is in powered off state, then virtual machine will not be listed or will not be selectable on the Azure portal. Power on the ESXi host, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server) on the portal. After this, virtual machine will be listed on the portal.
* **Pending reboot**: If there is a pending reboot on the virtual machine, then you will not be able to select the machine on Azure portal. Ensure to complete the pending reboot activities, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server). After this, virtual machine will be listed on the portal.
* **IP not found**: If the virtual machine doesn't have a valid IP address associated with it, then you will not be able to select the machine on Azure portal. Ensure to assign a valid IP address to the virtual machine, [refresh the configuration server](vmware-azure-manage-configuration-server.md#refresh-configuration-server). After this, virtual machine will be listed on the portal.

## Protected virtual machines are greyed out in the portal

Virtual machines that are replicated under Site Recovery aren't available in the Azure portal if there are duplicate entries in the system. To learn how to delete stale entries and resolve the issue, refer to [Azure Site Recovery VMware-to-Azure: How to clean up duplicate or stale entries](https://social.technet.microsoft.com/wiki/contents/articles/32026.asr-vmware-to-azure-how-to-cleanup-duplicatestale-entries.aspx).

## Next steps

If you need more help, post your question in the [Azure Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr). We have an active community, and one of our engineers can assist you.
