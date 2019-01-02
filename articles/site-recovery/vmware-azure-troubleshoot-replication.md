---
title: Troubleshoot replication issues for disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery | Microsoft Docs
description: This article provides troubleshooting information for common replication issues during disaster recovery of VMware VMs and physical servers to Azure with Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 12/17/2018
ms.author: ramamill

---
# Troubleshoot replication issues for VMware VMs and physical servers

You may receive a specific error message when protecting your VMware virtual machines or physical servers using Azure Site Recovery. This article describes some common issues you might encounter when replicating on-premises VMware VMs and physical servers to Azure using [Azure Site Recovery](site-recovery-overview.md).


## Initial replication issues

In many cases, initial replication failures that we encounter at support are due to connectivity issues between source server-to-process server or process server-to-Azure. For most cases, you can troubleshoot these issues by following the steps listed below.

### Verify the source machine
* From Source Server machine command line, use Telnet to ping the Process Server with https port (default 9443) as shown below to see if there are any network connectivity issues or firewall port blocking issues.

	`telnet <PS IP address> <port>`
> [!NOTE]
	> Use Telnet, don’t use PING to test connectivity.  If Telnet is not installed, follow the steps list [here](https://technet.microsoft.com/library/cc771275(v=WS.10).aspx)

If unable to connect, allow inbound port 9443 on the Process Server and check if the problem still exits. There has been some cases where process server was behind DMZ, which was causing this problem.

* Check the status of service `InMage Scout VX Agent – Sentinel/OutpostStart` if it is not running and check if the problem still exists.   

### Verify the process server

* **Check if process server is actively pushing data to Azure**

From Process Server machine, open the Task Manager (press Ctrl-Shift-Esc). Go to the Performance tab and click ‘Open Resource Monitor’ link. From Resource Manager, go to Network tab. Check if cbengine.exe in ‘Processes with Network Activity’ is actively sending large volume (in Mbs) of data.

![Enable replication](./media/vmware-azure-troubleshoot-replication/cbengine.png)

If not, follow the steps listed below:

* **Check if Process server is able to connect Azure Blob**: Select and check cbengine.exe to view the ‘TCP Connections’ to see if there is connectivity from Process server to Azure Storage blob URL.

![Enable replication](./media/vmware-azure-troubleshoot-replication/rmonitor.png)

If not then go to Control Panel > Services, check if the following services are up and running:

     * cxprocessserver
     * InMage Scout VX Agent – Sentinel/Outpost
     * Microsoft Azure Recovery Services Agent
     * Microsoft Azure Site Recovery Service
     * tmansvc
     *
(Re)Start any service, which is not running and check if the problem still exists.

* **Check if Process server is able to connect to Azure Public IP address using port 443**

Open the latest CBEngineCurr.errlog from `%programfiles%\Microsoft Azure Recovery Services Agent\Temp` and search for: 443 and connection attempt failed.

![Enable replication](./media/vmware-azure-troubleshoot-replication/logdetails1.png)

If there are issues, then from Process Server command line, use telnet to ping your Azure Public IP address (masked in above image) found in the CBEngineCurr.currLog using port 443.

      telnet <your Azure Public IP address as seen in CBEngineCurr.errlog>  443
If you are unable to connect, then check if the access issue is due to firewall or Proxy as described in next step.


* **Check if IP address-based firewall on Process server is not blocking access**: If you are using an IP address-based firewall rules on the server, then download the complete list of Microsoft Azure Datacenter IP Ranges from [here](https://www.microsoft.com/download/details.aspx?id=41653) and add them to your firewall configuration to ensure they allow communication to Azure (and the HTTPS (443) port).  Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

* **Check if URL-based firewall on Process server is not blocking access**:  If you are using a URL-based firewall rules on the server, ensure the following URLs are added to firewall configuration.

[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]  

* **Check if Proxy Settings on Process server are not blocking access**.  If you are using a Proxy Server, ensure the proxy server name is resolving by the DNS server.
To check what you have provided at the time of Configuration Server setup. Go to registry key

	`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Azure Site Recovery\ProxySettings`

Now ensure that the same settings are being used by Azure Site Recovery agent to send data.
Search Microsoft Azure  Backup

Open it and click on Action > Change Properties. Under Proxy Configuration tab, you should see the proxy address, which should be same as shown by the registry settings. If not, please change it to the same address.


* **Check if Throttle bandwidth is not constrained on Process server**:  Increase the bandwidth  and check if the problem still exists.

## Source machine to be protected through Site Recovery is not listed on Azure portal

When trying to choose the source machine to enable replication through Azure Site Recovery, the machine might not available for you to continue because of the following reasons

* If there are two virtual machines under the vCenter with same instance UUID, then the first virtual machine discovered by configuration server are shown on the portal. To resolve, ensure that no two virtual machines have same instance UUID.
* Ensure that you have added the correct vCenter credentials during the set up of configuration through OVF template or unified set up. To verify the credentials added, refer to the guidelines shared [here](vmware-azure-manage-configuration-server.md#modify-credentials-for-automatic-discovery).
* If the permissions provided to access vCenter do not have sufficient privileges, it might lead to failure in discovering virtual machines. Ensure the permissions provided [here](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery) are added to the vCenter user account.
* If the virtual machine is already protected through Site Recovery, then it will not be available for protection. Ensure that the virtual machine you are looking for on the portal is not already protected by any other user or under other subscriptions.

## Protected virtual machines are greyed out in the portal

Virtual machines that are replicated under Site Recovery are greyed out if there duplicate entries in the system. Refer to the guidelines given [here](https://social.technet.microsoft.com/wiki/contents/articles/32026.asr-vmware-to-azure-how-to-cleanup-duplicatestale-entries.aspx) to delete the stale entries and resolve the issue.

## Next steps
If you need more help, then post your query to [Azure Site Recovery forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=hypervrecovmgr). We have an active community and one of our engineers will be able to assist you.
