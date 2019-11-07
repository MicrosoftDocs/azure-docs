---
title: Troubleshooting
description: How to troubleshoot Azure FarmBeats.
author: uhabiba04
ms.topic: article
ms.date: 11/04/2019
ms.author: v-umha
---

# Troubleshooting

The following sections describe common Azure FarmBeats issues, and how to fix them.

For additional help, write to us at farmbeatssupport@microsoft.com, include deployer.log file on this email.

 Use these steps to download the deployer.log file:

1. The highlighted icon and select **Download** option from the drop-down.

    ![Project Farm Beats](./media/troubleshooting-farmbeats/download-deployer-log-1.png)

2. On the next screen, enter the path to your deployer.log file. For example, farmbeats-deployer.log.

## Sensor telemetry

### Telemetry not seen

**Symptom**: Devices/sensors are deployed, and you have linked FarmBeats with your device partner; but you are not able to get/view Telemetry data on FarmBeats.

**Corrective action**: Visit the Azure portal and follow these steps:

1. Go to your FarmBeats Data hub Resource Group.   
2. Select the **Event Hub** (DatafeedEventHubNamespace....) and check for the number of Incoming Messages.   
3. In case there are **NO Incoming messages**, contact your device partner.  
4. In case there are **Incoming messages**, contact farmbeatssupport@microsoft.com with Data hub and Accelerator logs and captured telemetry.

See [Logs section](#collect-logs-manually) of the document to understand how to download Logs.    

### Device appears offline

**Symptoms**: Devices are installed, and you have linked FarmBeats with your device partner. The devices are online and sending telemetry data, but they appear Offline.

**Corrective action**: The reporting interval is not configured for this device. Contact your device manufacturer to set the reporting interval. 

### Error deleting a resource

Following are the common error scenarios while deleting a device:  

**Message**: Device is referenced in sensors: There are one or more sensors associated with the Device. Delete the sensors and then delete the device.  

**Meaning**: The device is associated with multiple sensors deployed in the farm.   

**Corrective action**:  

1. Delete the sensors associated with the device through the accelerator.  
2. In case you want to associate the sensors to a different device, ask your device partner to do the same.  
3. Delete the device using a DELETE API call setting the force parameter as ‘true’.  

**Message**: Device is referenced in devices as ParentDeviceId: There are one or more devices that are associated with this device as child devices. Delete them, and then delete this device.  

**Meaning**: Your device has other devices associated with it  

**Corrective action**

1. Delete the devices associated with the specific device  
2. Delete the specific device  

    > [!NOTE]
    > You cannot delete a device if sensors are associated with it. See [Delete Sensors](get-sensor-data-from-sensor-partner.md) in Get Sensor Data chapter for more information on how to delete associated sensors.


## Issues with jobs

### FarmBeats internal error

**Message**: FarmBeats internal error, see troubleshooting guide for more details.

**Corrective action**:
 This could be because of a temporary failure in the data pipeline. Create the job once again. If the error persists, add the error in a post on the FarmBeats forum or contact FarmBeatsSupport@microsoft.com.

## Accelerator troubleshooting

### Access Control

**Error while adding role assignment**

**Message**:No matching users found

**Corrective action**: Check the email ID for which you are trying to do a role assignment. The email ID has to be an exact match of the one registered for that user in the Active Directory. If the error  persists, add the error in a post on the FarmBeats forum or contact FarmBeatsSupport@microsoft.com

### Unable to log in to Accelerator

**Message**: Error: You are not authorized to call the service. Contact the admin for authorization.

**Corrective action**: Ask the admin to authorize you to access the FarmBeats deployment. This can be done by doing a POST of the RoleAssignment APIs or through the Access Control in the Settings pane in the accelerator.  

If you have already been added and are facing this error, try again by refreshing the page.  If the error persists, add the error in a post on the FarmBeats forum or contact FarmBeatsSupport@microsoft.com.

![Project Farm Beats](./media/troubleshooting-farmbeats/accelerator-troubleshooting-1.png)

### Accelerator - An unknown error occurred  

**Message**: Error: An unknown error occurred

**Corrective action**: This happens if you leave the page idle for too long. Refresh the page.  

If the error still persists, add the error in a post on the FarmBeats forum or contact  FarmBeatsSupport@microsoft.com

**FarmBeats Accelerator is not showing the latest version even after upgrading the FarmBeatsDeployment**

**Corrective action**: This happens because of service worker persistence in the browser.
Close all browser tabs that have the Accelerator open and close the browser window. Start a new instance of the browser and load the Accelerator URI again. This will load the new version of the Accelerator.

## Sentinel imagery-related issues

### Sentinel wrong Username or Password

**Job failure message**;Full authentication is required to access this resource.

**Correction action**:Rerun installer for upgrading data hub with correct username and password.

**Corrective action**:Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.

### Sentinel Hub wrong URL or not accessible 

**Job failure message**:Oops, something went wrong. The page you were trying to access is (temporarily) unavailable. 

**Corrective action**:
1.	Open Sentinel URL (https://scihub.copernicus.eu/dhus/) in browser and check if website is accessible. 
2.	If website is not accessible, Check if any firewall/company network etc. is blocking the website and take necessary steps to allow above URL. 
3.	Rerun failed job or Run a satellite Indices job for a date range of 5-7 days and check if job is successful.  

### Sentinel server down for maintenance

**Job failure message**: The Copernicus Open Access Hub will be back soon! Sorry for the inconvenience, we're performing some maintenance at the moment. We'll be back online shortly! 

**Corrective action**:

1.	This issue can occur if any maintenance activities are being done on the Sentinel Server. 
2.	If any job/pipeline fails with above reason, resubmit the job after some time. 
3.	User can visit https://scihub.copernicus.eu/news/ to check information about any planned/unplanned Sentinel maintenance activities.  
4.	Rerun failed job or Run a satellite Indices job for a date range of 5-7 days and check if job is successful.

### Sentinel Maximum number of connections reached

**Job failure message**:
Maximum number of two concurrent flows achieved by the user "<username>" 

**Corrective action**
1.	If any job fails with the above reason, same sentinel account is being used in another deployment/software. 
2.	User can create new sentinel account and re-run installer for upgrading data hub with new sentinel username and password.  
3.	Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.

### Sentinel Server refused connection 

**Job failure message**:

Server refused connection at: http://172.30.175.69:8983/solr/dhus 

**Corrective action**: This issue can occur if any maintenance activities are being done on Sentinel Server. 
1.	If any job/pipeline fails with above reason, resubmit the job after some time. 
2.	User can visit https://scihub.copernicus.eu/news/ to check information about any planned/unplanned Sentinel maintenance activities.  
3.	Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.


## Collect logs manually

[Install and deploy]( https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) to Azure Storage Explorer.

### How to collect data hub ADF job logs
1. Log in to https://portal.azure.com
2. In the **Search** text box, search for FarmBeats Data hub resource group.

    > [!NOTE]
    > Select the data hub resource group that was specified at the time of FarmBeats deployment.

In the resource group dashboard, search for the (datahublogs….) storage account. For example, datahublogsmvxmq  

1.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
2.	In the (datahubblogs….) page, select **Open in Explorer** to view **Open Azure Storage Explorer** application.
3.	In the left panel, (datahubblogs…), **Blob Containers**, select **job-logs**.
4.	In the **job-logs** tab, select **Download**.
5.	Select the location to download the logs to a local folder on your machine.
6.	Email the downloaded zip file to farmbeatssupport@microsoft.com

    ![Project Farm Beats](./media/troubleshooting-farmbeats/collecting-logs-manually-1.png)

### How to collect accelerator ADF job logs

1.	Log in to https://portal.azure.com
2.	In the **Search** text box, search for FarmBeats Accelerator resource group.

    > [!NOTE]
    > Select the Accelerator resource group that was specified at the time of FarmBeats deployment.

3.	In the resource group dashboard, search for storage…. storage account. For example, storagedop4k
4.	Select the storage account in the **Name** column to view the Storage Account dashboard.
5.	In the (storage….) page, select **Open in Explorer** to view Open Azure Storage Explorer application.
6.	In the left panel, <storage….), **Blob Containers**, select **job-logs**.
7.	In the **job-logs** tab, select **Download**.
8.	Select the location to download the logs to a local folder on your machine.
9.	Email the downloaded zip file to farmbeatssupport@microsoft.com


### How to collect data hub app service logs

1.	Log in to https://portal.azure.com
2.	In the **Search** text box, search for FarmBeats Data hub resource group.

    > [!NOTE]
    > Select the data hub resource group that was specified at the time of FarmBeats deployment.

3.	In the resource group, search for (datahublogs….) storage account. For example, datahublogsmvxmq
4.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
5.	In the (datahubblogs….) page, select **Open in Explorer** to view **Open Azure Storage Explorer** application.
6.	In the left panel, (datahubblogs….), **Blob Containers**, select appinsights-logs.
7.	In the appinsights-logs tab, select **Download**.
8.	Select the path to download the logs to a local folder on your machine.
9.	Email the downloaded folder to farmbeatssupport@microsoft.com

### How to collect accelerator app service logs

1.	Log in to https://portal.azure.com
2.	In the **Search**, search for FarmBeats Accelerator resource group.

    > [!NOTE]
    > Select the Farmbeats accelerator resource group that is provided at the time of FarmBeats deployment.

3.	In the resource group, search for (storage….) storage account. For example, storagedop4k
4.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
5.	In the (storage….) page, select **Open in Explorer** to view **Open Azure Storage Explorer** application.
6.	In the left panel, (storage….), **Blob Containers**, select appinsights-logs.
7.	In the appinsights-logs tab, select **Download**.
8.	Select the location to download the logs to a local folder on your machine.
9.	Email the downloaded folder to farmbeatssupport@microsoft.com

## Known issues

## Batch-related issues

**Error**: The regional account quota of Batch Accounts for the specified subscription has been reached.

**Corrective action**: increase the quota or delete unused batch accounts and re-run the deployment.

### Azure Active Directory related issues

**Error**: Could not update required settings to Azure AD App d41axx40-xx21-4fbd-8xxf-97xxx9e2xxc0: Insufficient privileges to complete the operation. Ensure that above settings are configured properly for the Azure AD App.

**Meaning**: The Azure AD app registration configuration didn’t happen properly.  

**Corrective action**: ask the IT admin (having tenant read access) to use our [script](https://aka.ms/PPCreateAADappregistration) for generating creating the Azure AD app registration. This script will automatically take care of the configuration steps as well. as  

**Error**: Could not create new Active Directory Application “dummyname” in this tenant: Another object with the same value for property identifier URIs already exists

**Meaning**: Azure AD app registration with the same name already exists.

**Corrective action**: Delete the existing Azure AD app registration or reuse it for installation. If you are reusing the existing Azure AD pass the Application ID and client secret to the installer and redeploy.

## Input.json related issues

**Error** reading input from input.json file

**Corrective action**: This issue mostly arises due to miss in specifying the correct input json path or name to the installer. Make appropriate corrections and retry redeploying.

**Error parsing json input**

**Corrective action**: This issue mostly arises due to incorrect values within the input json file. Make appropriate corrections and retry deploying.

## High CPU usage

**Error**: You get an email alert referring to High CPU Usage Alert. 

**Corrective action**: 
1.	Go to your FarmBeats Data hub Resource Group.
2.	Select the App service.  
3.	Go to Scale up (App Service plan) and select an appropriate [pricing tier](https://azure.microsoft.com/pricing/details/app-service/windows/)

## Next steps

If you are still facing any issues, contact us at our [Support Forum](https://social.msdn.microsoft.com/Forums/home?forum=ProjectFarmBeats).
