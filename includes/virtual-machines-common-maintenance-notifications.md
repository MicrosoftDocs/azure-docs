
## View VMs scheduled for maintenance in the portal

Once a planned maintenance wave is scheduled, and notifications are sent, you can observe the list of virtual machines that are impacted by the upcoming maintenance wave. 

You can use the Azure portal and look for VMs scheduled for maintenance.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the left navigation, click **Virtual Machines**.

3. In the Virtual Machines pane, click the **Columns** button to open the list of available columns.

4. Select and add the following columns:

   **Maintenance** - shows the maintenance status for the VM. The following are the potential values:
	  
      | Value | Description |
	  |-------|-------------|
	  | Start now | The VM is in the self-service maintenance window which lets you initiate the maintenance yourself. See below on how to start maintenance on your VM | 
	  | Scheduled | The VM is scheduled for maintenance with no option for you to initiate maintenance. You can learn of the maintenance window by selecting the Auto-Scheduled window in this view or by clicking on the VM | 
	  | Completed | You have successfully initiated and completed maintenance on your VM. | 
	  | Skipped| You have selected to initiate maintenance with no success. Azure has canceled the maintenance for your VM and will reschedule it in a later time | 
	  | Retry later| You have selected to initiate maintenance and Azure was not able to fulfill your request. In this case, you can try again in a later time. | 
   
   **Maintenance Pro-Active** - shows the time window when you can self-start maintenance on your VMs.
   
   **Maintenance Scheduled** - shows the time window when Azure will reboot your VM in order to complete maintenance. 




## Notification and alerts in the portal

Azure will communicate a schedule for planned maintenance by sending an email to the subscription owner and co-owners group. You can add additional recipients and channels to this communication by creating Azure activity log alerts. For more information, see [Monitor subscription activity with the Azure Activity Log] (../articles/monitoring-and-diagnostics/monitoring-overview-activity-logs.md)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the menu on the left, select **Monitor**. 
3. In the **Monitor - Activity log** pane, select **Alerts**.
4. In the **Monitor - Alerts** pane, click **+ Add activity log alert**.
5. Complete the information in the **Add activity log alert** page and make sure you set the following in **Criteria**:
	**Type**: Maintenance 
	**Status**: All (Do not set status to Active or Resolved)
	**Level**: All
	
To learn more on how to configure Activity Log Alerts, see [Create activity log alerts](../articles/monitoring-and-diagnostics/monitoring-activity-log-alerts.md)
	
	
## Start Maintenance on your VM from the portal
While you are looking at the VM details you will be able to see more maintenance related details.  
At the top of the VM details view, a new notification ribbon will be added if your VM is included in a planned maintenance wave. In addition, a new option is added to start maintenance when possible. 


Click on the maintenance notification to see the maintenance page with more details on the planned maintenance. From there you will be able to **start maintenance** on your VM.

Once you start maintenance, your virtual machine will be rebooted and the maintenance status will be updated to reflect the result within few minutes.

If you missed the window where you can start maintenance, you will still be able to see the window when your VM will be rebooted by Azure. 
