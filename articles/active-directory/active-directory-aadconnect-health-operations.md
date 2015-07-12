<properties 
	pageTitle="Azure AD Connect Health Operations." 
	description="This is the Azure AD Connect Health page that describes additional operations that can be performed once you have Azure AD Connect Health deployed.." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/12/2015" 

# Azure AD Connect Health Operations

The following topic describes the various operations that can be performed using Azure AD Connect Health.

## Email Notifications
You can configure the Azure AD Connect Health Service to send email notifications when alerts are generated indicating your Federation Service Infrastructure is not healthy. This will occur when an alert is generated, as well as when it is marked as resolved. Follow the instructions below to configure email notifications. Please note that by default email notifications are disabled. 





### To enable Azure AD Connect Health Email Notifications
<ol>
<li>Open the Alerts Blade for the farm for which you wish to receive email notification.</li>
<li>Click on the "Notification Settings" button from the action bar.</li>
<li>Turn the Email Notification switch to ON.</li>
<li>Select the checkbox to configure all the Global Tenant Admins to receive email notifications.</li>
<li>If you wish to receive email notifications on any other email addresses, you can specify them in the Additional Email Recipients boxes. To remove an email address from this list, right click on the entry and select Delete.</li>
<li>To finalize the changes click on "Save". All changs will take effects only after you select "Save".</li>






## Delete a server from Azure AD Connect Health Service

In some instances, you may wish to remove a server from being monitored. Follow the instructions below to remove a server from Azure AD Connect Health Service.

When deleting a server, be aware of the following:

- This action will STOP collecting any further data from that server. This server will be removed from the monitoring service. After this action, you will not be able to view new alerts, monitoring or usage analytics data for this server.
- This action will NOT uninstall or remove the Health Agent from your server. If you have not uninstalled the Health Agent before performing this step, you may see error events on the server related to the Health Agent.
- This action will NOT delete the data already collected from this server. That data will be deleted as per the Microsoft Azure Data Retention Policy. 
- After performing this action, if you wish to start monitoring the same server again, you will need to uninstall and reinstall the health agent on this server. 


### To delete a server from Azure AD Connect Health Service
<ol>
<li>Open the Server Blade from the Server List Blade by selecting the server name to be removed.</li> 
<li>On the Server Blade, click on the "Delete" button from the action bar.</li>
<li>Confirm the action to delete the server by typing the server name in the confirmation box.</li>
<li>Click on the "Delete" button.</li>









## Delete a service instance from Azure AD Connect Health Service

In some instances, you may wish to remove a service instance. Follow the instructions below to remove a service instance from Azure AD Connect Health Service.

When deleting a service instance, be aware of the following:

- This action will remove the current service instance from the monitoring service. 
- This action will NOT uninstall or remove the Health Agent from any of the servers that were monitored as part of this service instance. If you have not uninstalled the Health Agent before performing this step, you may see error events on the server(s) related to the Health Agent. 
- All data from this service instance will be deleted as per the Microsoft Azure Data Retention Policy. 
- After performing this action, if you wish to start monitoring the service, please uninstall and reinstall the health agent on all the servers that will be monitored. After performing this action, if you wish to start monitoring the same server again, you will need to uninstall and reinstall the health agent on this server.







### To delete a service instance from Azure AD Connect Health Service

<ol>
<li>Open the Service Blade from the Service List Blade by selecting the service identifier (farm name) that you wish to remove.</li> 
<li>On the Server Blade, click on the "Delete" button from the action bar.</li>
<li>Confirm the service name by typing it in the confirmation box. (for example: sts.contoso.com) </li>
<li>Click on the "Delete" button.</li>


