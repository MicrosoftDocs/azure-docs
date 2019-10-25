---
title: Troubleshooting
description:
author: uhabiba04
ms.topic: article
ms.date: 10/11/2019
ms.author: v-umha
ms.service: backup
---


# Troubleshooting

## Deploying Azure FarmBeats

If you are facing challenges during deployment please refer to the below list of commonly known issues/misses and their resolution to troubleshoot at your end. In case if you need further help please write to us at farmbeatssupport@microsoft.com include deployer.log file on this email.

**Downloading the deployer.log file**

1. Click the highlighted icon and click **Download** option from the drop-down.

  ![Project Farm Beats](./media/troubleshooting-farmbeats/download-deployer-log.png)

2. On the next screen enter the path to your deployer.log file. For example farmbeats-deployer.log.

### Commonly known issues

**Batch-related issues**

1. **Error**: The regional account quota of Batch Accounts for the specified subscription has been reached.
  - Kindly increase the quota or delete unused batch accounts and re-run the deployment.

2. **CorreAzure Active Directory related issues**:

**Error**: Could not update required settings to AAD App d41axx40-xx21-4fbd-8xxf-97xxx9e2xxc0: Insufficient privileges to complete the operation... Please ensure that above settings are configured properly for the AAD App.

**Meaning**: The AAD app registration configuration didn’t happen properly.  

**Corrective action**: Please ask the IT admin (having tenant read access) to use our script: https://aka.ms/PPCreateAADappregistration  for generating creating the Azure Active Directory app registration. This script will automatically take care of the configuration steps as well. as  

**Error**: Could not create new Active Directory Application “dummyname” in this tenant: Another object with the same value for property identifierURIs already exists

**Meaning**: AAD app registration with the same name already exists.

**Corrective action**: Delete the existing AAD app registration or reuse it for installation. If you are reusing the existing AAD please pass the Application ID and client secret to the installer and redeploy.

**Batch-related issues**:

**Error**: The regional account quota of Batch Accounts for the specified subscription has been reached.
Kindly increase the quota or delete unused batch accounts and re-run the deployment.

**Corrective action**: Try using a new region which has batch availability or delete unused batch accounts and then redeploy.  

**Azure permissions-related issues**:

**Error**: You do not have permission to assign Contributor role to e709bc39-3fb9-4705-93c7-1d83920a96a0 at scope: /subscriptions/da9091ec-d18f-456c-9c21-5783ee7f4645/resourceGroups/dips-test-dh1. Please ensure that you are an owner of the Data hub and Accelerator Resource Group(s).

You do not have permission to assign Contributor role to e709bc39-3fb9-4705-93c7-1d83920a96a0 at scope: /subscriptions/da9091ec-d18f-456c-9c21-5783ee7f4645/resourceGroups/dips-test-dh1. Please ensure that you are an owner of the Data hub and Accelerator Resource Group(s).

**Correction action**: The above issue arises as you do not have permission to create resource groups. You can request subscription owner to create resource groups and grant you owner access for these. Try deploying again.

**Input.json related issues**:

**Error** reading input from input.json file

**Corrective action**: This issue mostly arises due to miss in specifying the correct input json path or name to the installer. Make appropriate corrections and retry redploying.

**Error parsing json input**

**Corrective action**: This issue mostly arises due to incorrect values within the input json file. Make appropriate corrections and retry deploying.

**High CPU usage**:

**Error**: You get an email alert referring to High CPU Usage Alert. 

**Corrective Action**: 
1.	Go to your FarmBeats Data hub Resource Group.
2.	Click the App service.  
3.	Go to Scale up (App Service plan) and select an appropriate pricing tier  
(Refer: https://azure.microsoft.com/en-us/pricing/details/app-service/windows/ ) 


## Sensor telemetry

**Telemetry Not seen**
**Symptoms**: Devices/Sensors are deployed, and you have linked FarmBeats with your device
partner; but you are not able to get/view Telemetry data on FarmBeats   

**Action to be taken by user**: Visit the Azure portal and follow the steps:


1. Go to your FarmBeats Data hub Resource Group   
2. Click the **Event Hub** (DatafeedEventHubNamespace....) and check for the number of Incoming Messages.   
3. In case there are **NO Incoming messages**, contact your device partner.  
4. In case there are **Incoming messages**, contact farmbeatssupport@microsoft.com with Data hub and Accelerator logs and captured telemetry. Go to Logs section of the document to understand how to download Logs.    

**Device shows offline**   

**Symptoms**: Devices are installed, and you have linked FarmBeats with your device partner. The devices are online and sending Telemetry data, but they show as Offline

**Corrective Action**: The Reporting Interval is not configured for this device. Contact your device manufacturer to set the Reporting Interval. 

**Error Deleting a resource**

Following are the common error scenarios while deleting a device:  

**Message**: Device is referenced in Sensors: There are one or more sensors associated with the Device. Delete the sensors and then delete the device.  

**Meaning** – The device is associated with sensors deployed in the farm.   

**Corrective Action** – The following corrective actions can be taken:   

1. Delete the sensors associated with the device through the accelerator.  
2. In case you want to associate the sensors to a different device, ask your device partner to do the same.  
3. Delete the Device using a DELETE API call setting the force parameter as ‘true’  

**Message** - Device is referenced in Devices as ParentDeviceId: There are one or more devices that are associated with this device as Child devices. Delete them and then delete this device.  

**Meaning** – Your device has other devices associated with it  


1. **Corrective Action** - The following corrective actions can be taken:
2. Delete the devices associated with the specific device  
3. Delete the specific device  

> [!NOTE]
> You cannot delete a device if sensors are associated with it. Refer the section Delete Sensors in Get Sensor Data chapter **(add link)** for more information on how to delete associated sensors.


## Running Jobs

**FarmBeats Internal Error**

**Message** – FarmBeats internal error, please refer to troubleshooting guide for more details.

**Corrective Action** – This could have been caused by a temporary failure in the data pipeline. Try creating the job again. If the error still persists, please add the error in a post on the FarmBeats forum or contact **(FarmBeatsSupport@microsoft.com**)

### Accelerator Troubleshooting

**Access Control – Error while adding role assignment**

**Message** - No matching users found

**Corrective Action** – Check the email ID for which you are trying to do a role assignment. The email ID has to be an exact match of the one registered for that user in the Active Directory.  
If the error still persists, please add the error in a post on the FarmBeats forum or contact FarmBeatsSupport@microsoft.com

**Unable to log in to Accelerator**  

**Message** – Error: You are not authorized to call the service. Please contact the admin for authorization.

**Corrective Action** – Ask the admin to authorize you to access the FarmBeats deployment. This can be done by doing a POST of the RoleAssignment APIs or through the Access Control in the Settings pane in the accelerator.  

If you have already been added and are facing this error, please try again by refreshing the page.  
If the error still persists, please add the error in a post on the FarmBeats forum or contact (**FarmBeatsSupport@microsoft.com)**

![Project Farm Beats](./media/troubleshooting-farmbeats/accelerator-troubleshooting.png)

**Accelerator - An unknown error occurred**  

**Message** – Error: An unknown error occurred

**Corrective Action** – This happens if you leave the page idle for too long. Please refresh the page.  

If the error still persists, please add the error in a post on the FarmBeats forum or contact FarmBeatsSupport@microsoft.com
**FarmBeats Accelerator is not showing the latest version even after upgrading the FarmBeatsDeployment**

**Corrective Action** – This happens because of service worker persistence in the browser.
Please close all browser tabs that have the Accelerator open and close the browser window. Start a new instance of the browser and load the Accelerator URI again. This will load the new version of the Accelerator.

## Sentinel Imagery Related Issues

### Sentinel wrong Username or Password

**Job failure message**:
Full authentication is required to access this resource.

**Correction Action**
Rerun installer for upgrading data hub with correct username and password.

**Corrective Action**:  
Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.

### Sentinel Hub wrong URL or not accessible 

**Job failure message**:
   Oops, something went wrong. The page you were trying to access is (temporarily) unavailable. 

**Corrective Action**:
1.	Open Sentinel URL (https://scihub.copernicus.eu/dhus/) in browser and check if website is accessible. 
2.	If website is not accessible, Check if any firewall/company network etc. is blocking the website and take necessary steps to allow above URL. 
3.	Rerun failed job or Run a satellite Indices job for a date range of 5-7 days and check if job is successful.  

### Sentinel server down for maintenance

**Job failure message**:
The Copernicus Open Access Hub will be back soon! Sorry for the inconvenience, we're performing some maintenance at the moment. We'll be back online shortly! 

**Corrective Action**:

1.	This issue can occur if any maintenance activities are being done on the Sentinel Server. 
2.	If any job/pipeline fails with above reason, resubmit the job after some time. 
3.	User can visit https://scihub.copernicus.eu/news/ to check information about any planned/unplanned Sentinel maintenance activities.  
4.	Rerun failed job or Run a satellite Indices job for a date range of 5-7 days and check if job is successful.
Page Break

### Sentinel Maximum number of connections reached

**Job failure message**:
Maximum number of 2 concurrent flows achieved by the user "<username>" 

**Corrective Action**
1.	If any job fails with the above reason, same sentinel account is being used in another deployment/software. 
2.	User can create new sentinel account and re-run installer for upgrading data hub with new sentinel username and password.  
3.	Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.

### Sentinel Server refused connection 

**Job failure message**:

Server refused connection at: http://172.30.175.69:8983/solr/dhus 

**Corrective Action**:
This issue can occur if any maintenance activities are being done on Sentinel Server. 
1.	If any job/pipeline fails with above reason, please resubmit the job after some time. 
2.	User can visit https://scihub.copernicus.eu/news/ to check information about any planned/unplanned Sentinel maintenance activities.  
3.	Rerun failed job or run a satellite Indices job for date range of 5-7 days and check if job is successful.


## Collecting Logs manually

1.	How to connect to Azure Storage Explorer
2.	Install and connect to Azure Storage Explorer according to the instructions listed in https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows
3.	How to collect Data hub ADF Job Logs
4.	Log in to www.portal.azure.com
5.	In the **Search** text box, search for FarmBeats Data hub resource group.

> [!NOTE]
> The Data Hub resource group that was specified at the time of FarmBeats deployment.

6.	In the resource group dashboard, search for the (datahublogs….) storage account. For example – datahublogsmvxmq  
7.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
8.	In the (datahubblogs….) page, click **Open in Explorer** to view **Open Azure Storage Explorer** application.
9.	In the left panel, (datahubblogs…), **Blob Containers**, select **job-logs**.
10.	In the **job-logs** tab, click **Download**.
11.	Select the location to download the logs to a local folder on your machine.
12.	Email the downloaded zip file to farmbeatssupport@microsoft.com

![Project Farm Beats](./media/troubleshooting-farmbeats/collecting-logs-manually.png)

### How to collect Accelerator ADF Job Logs

1.	Log in to www.portal.azure.com
2.	In the **Search** text box, search for FarmBeats Accelerator resource group.

> [!NOTE]
> The Accelerator resource group that was specified at the time of FarmBeats deployment.

3.	In the resource group dashboard, search for storage…. storage account. For example – storagedop4k
4.	Select the storage account in the **Name** column to view the Storage Account dashboard.
5.	In the (storage….) page, click **Open in Explorer** to view Open Azure Storage Explorer application.
6.	In the left panel, <storage….), **Blob Containers**, select **job-logs**.
7.	In the **job-logs** tab, click **Download**.
8.	Select the location to download the logs to a local folder on your machine.
9.	Email the downloaded zip file to farmbeatssupport@microsoft.com


### How to collect Data hub App Service Logs

1.	Log in to www.portal.azure.com
2.	In the **Search** text box, search for FarmBeats Data hub resource group.

> [!NOTE]
> The Data Hub resource group that was specified at the time of FarmBeats deployment.

3.	In the resource group, search for (datahublogs….) storage account. For example – datahublogsmvxmq
4.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
5.	In the (datahubblogs….) page, click **Open in Explorer** to view **Open Azure Storage Explorer** application.
6.	In the left panel, (datahubblogs….), **Blob Containers**, select appinsights-logs.
7.	In the appinsights-logs tab, click **Download**.
8.	Select the path to download the logs to a local folder on your machine.
9.	Email the downloaded folder to farmbeatssupport@microsoft.com

### How to collect Accelerator App Service Logs

1.	Log in to www.portal.azure.com
2.	In the **Search**, search for FarmBeats Accelerator resource group.

> [!NOTE]
> The Farmbeats accelerator resource group is provided at the time of FarmBeats deployment.


3.	In the resource group, search for (storage….) storage account. For example – storagedop4k
4.	Select the storage account in the **Name** column to view the **Storage Account** dashboard.
5.	In the (storage….) page, click **Open in Explorer** to view **Open Azure Storage Explorer** application.
6.	In the left panel, (storage….), **Blob Containers**, select appinsights-logs.
7.	In the appinsights-logs tab, click **Download**.
8.	Select the location to download the logs to a local folder on your machine.
9.	Email the downloaded folder to farmbeatssupport@microsoft.com

## Next steps

If you are still facing any issues, please contact us at our [Support Forum](aka.ms/FarmBeatsMSDN)
