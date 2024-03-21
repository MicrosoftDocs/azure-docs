---
title: Troubleshoot Azure FarmBeats
description: This article describes how to troubleshoot Azure FarmBeats.
author: gourdsay
ms.topic: article
ms.date: 11/29/2023
ms.author: angour
---

# Troubleshoot Azure FarmBeats

This article provides solutions to common Azure FarmBeats issues. For extra help, contact our [Q&A Support Forum](/answers/topics/azure-farmbeats.html).
> [!IMPORTANT]
> Azure FarmBeats is retired. You can see the public announcement [**here**](https://azure.microsoft.com/updates/project-azure-farmbeats-will-be-retired-on-30-sep-2023-transition-to-azure-data-manager-for-agriculture/).
>
> We have built a new agriculture focused service, it's name is Azure Data Manager for Agriculture and it's now available as a preview service. For more information, see public documentation [**here**](../../data-manager-for-agri/overview-azure-data-manager-for-agriculture.md) or write to us at madma@microsoft.com. 


## Install issues
If you're restarting the install because of an error, ensure to delete the **Resource Group** or delete all resources from the Resource Group before retriggering the installation.

### Invalid Sentinel credentials

The Sentinel credentials provided during install are incorrect. Restart the installation with the correct credentials.

### The regional account quota of Batch Accounts for the specified subscription is reached

Increase the quota, or delete the unused batch accounts and restart the installation.

### Invalid resource group location

Ensure the **Resource Group** is in the same location as the **Region** specified during installation.

### Other install issues

Contact us with the following details:

- Your Subscription ID
- Resource Group name
- Follow the below steps to attach the log file for the Deployment failure:

    1. Navigate to the **Resource Group** in the Azure portal.

    2. Select **Deployments** under **Settings** section on the left hand side.

    3. For every deployment that shows **Failed**, select through to the details and download the deployment details. Attach this file to the mail.

## Sensor telemetry

### Can't view telemetry data

**Symptom**: Devices or sensors are deployed, and device partner is linked to FarmBeats, but you can't get or view telemetry data on FarmBeats.

**Corrective action**

1. Go to your FarmBeats resource group.
2. Select the **Event Hub** namespace ("sensor-partner-eh-namespace-xxxx"), select on "Event Hubs" and then check for the number of incoming messages in the event hub that is assigned to the partner
3. Do either of the following steps:

   - If there are *no incoming messages*, contact your device partner.  
   - If there are *incoming messages*, contact us with your Datahub and Accelerator logs and captured telemetry.

To understand how to download logs, go to the ["Collect logs manually"](#collect-logs-manually) section.  

### Can't view telemetry data after ingesting historical/streaming data from your sensors

**Symptom**: Devices or sensors are deployed, created on FarmBeats and ingested telemetry to the EventHub, but you can't get or view telemetry data on FarmBeats.

**Corrective action**

1. Ensure partner registration is done correctly - you can check this by going to your datahub swagger, navigate to /Partner API, Do a Get and check if the partner is registered. If not, follow these [steps](get-sensor-data-from-sensor-partner.md#enable-device-integration-with-farmbeats) to add partner.

2. Ensure that you used the correct Telemetry message format:

```json
{
"deviceid": "<id of the Device created>",
"timestamp": "<timestamp in ISO 8601 format>",
"version" : "1",
"sensors": [
    {
      "id": "<id of the sensor created>",
      "sensordata": [
        {
          "timestamp": "< timestamp in ISO 8601 format >",
          "<sensor measure name (as defined in the Sensor Model)>":<value>
        },
        {
          "timestamp": "<timestamp in ISO 8601 format>",
          "<sensor measure name (as defined in the Sensor Model)>": <value>
        }
      ]
    }
 ]
}
```

### Don't have the Azure Event Hubs connection string

**Corrective action**

1. In Datahub Swagger, go to the Partner API.
2. Select **Get** > **Try it out** > **Execute**.

> [!NOTE]
> The partner ID of the sensor partner you're interested in.

3. Go back to the Partner API, and select **Get/\<ID>**.
4. Specify the partner ID from step 3, and then select **Execute**.

   The API response should have the Event Hubs connection string.

### Device appears offline

**Symptoms**: Devices are installed, and FarmBeats is linked with your device partner. The devices are online and sending telemetry data, but they appear offline.

**Corrective action**
The reporting interval isn't configured for this device. To set the reporting interval, contact your device manufacturer. 

### Error deleting a device

While you're deleting a device, you might encounter one of the following common error scenarios:  

**Message**: "Device is referenced in sensors: There are one or more sensors associated with the device. Delete the sensors and then delete the device."  

**Meaning**: The device is associated with multiple sensors that are deployed in the farm.

**Corrective action**  

1. Delete the sensors that are associated with the device through Accelerator.  
2. If you want to associate the sensors with a different device, ask your device partner to do the same.  
3. Delete the device by using a `DELETE API` call, and set the force parameter as *true*.  

**Message**: "Device is referenced in devices as ParentDeviceId: There are one or more devices that are associated with this device as child devices. Delete them, and then delete this device."  

**Meaning**: Your device has other devices associated with it.  

**Corrective action**

1. Delete the devices that are associated with this specific device.  
2. Delete the specific device.  

    > [!NOTE]
    > You can't delete a device if sensors are associated with it. For more information about how to delete associated sensors, see the **Delete sensor** section in [Get sensor data from sensor partners](get-sensor-data-from-sensor-partner.md).
    > Partners do not have permission to delete a device or sensor. Only Admins have permission to delete.

## Issues with jobs

### FarmBeats internal error

**Message**: "FarmBeats internal error, see troubleshooting guide for more details."

**Corrective action**
This issue might result from a temporary failure in the data pipeline. Create the job again. If the error persists, contact us with the error message/logs.

## Accelerator troubleshooting

### Access control

**Issue**: You receive an error while you're adding a role assignment.

**Message**: "No matching users found."

**Corrective action**
Check the email ID for which you're trying to add a role assignment. The email ID must be an exact match of the ID, which is registered for that user in the Active Directory. If the error persists, contact us with the error message/logs.

### Unable to sign-in to Accelerator

**Message**: "Error: You aren't authorized to call the service. Contact the administrator for authorization."

**Corrective action**
Ask the administrator to authorize you to access the FarmBeats deployment by doing a POST of the RoleAssignment APIs or through the Access Control in the **Settings** pane in Accelerator.  

If you have access and facing this error, try again by refreshing the page. If the error persists, contact us with the error message/logs.

![Screenshot that shows the authorization error.](./media/troubleshoot-azure-farmbeats/accelerator-troubleshooting-1.png)

### Accelerator issues  

**Issue**: You get an Accelerator error of undetermined cause.

**Message**: "Error: An unknown error occurred."

**Corrective action**
This error occurs if you leave the page idle for too long. Refresh the page. If the error persists, contact us with the error message/logs.

**Issue**: FarmBeats Accelerator isn't showing the latest version, even after you upgraded FarmBeatsDeployment.

**Corrective action**
This error occurs because of service worker persistence in the browser. Do the following steps:

1. Close all browser tabs that have Accelerator open, and close the browser window.
2. Start a new instance of the browser, and reload the Accelerator URI. This action loads the new version of Accelerator.

## Sentinel: Imagery-related issues

### Wrong username or password

**Job failure message**: "Full authentication is required to access this resource."

**Corrective action**: Do one of the following steps:

- Update FarmBeats with the correct username/password using the below steps and retry the job.

  **Update Sentinel username**

    1. Sign in to [Azure portal](https://portal.azure.com).
    2. In the **Search** box, search for the FarmBeats Datahub resource group.
    3. Select Storage account storage***** > **Containers** > **batch-prep-files** > **to_vm** > **config.ini**
    4. Select **Edit**
    5. Update the username in the sentinel_account section

  **Update Sentinel password**

    1. Sign in to [Azure portal](https://portal.azure.com).
    2. In the **Search** box, search for the FarmBeats Datahub resource group.
    3. Select keyvault-*****
    4. Select Access Policies under Settings
    5. Select **Add Access Policy**
    6. Use **Secret management** for Configure from Template and add yourself to Principal
    7. Select **Add**, and then select **Save** on the **Access Policies** page
    8. Select **Secrets** under **Settings**
    9. Select **Sentinel-password**
    10. Create a new version of the value and enable it.

- Rerun the failed job, or run a satellite indices job for a date range of 5 to 7 days, and then check to see whether the job is successful.

### Sentinel hub: Wrong URL or site not accessible

**Job failure message**: "Oops, something went wrong. The page you were trying to access is (temporarily) unavailable."

**Corrective action**:

1. Open [Sentinel](https://scihub.copernicus.eu/dhus/) in your browser to see whether the website is accessible.
2. If the website isn't accessible, check whether any firewall, company network, or other blocking software is preventing access to the website. After checking, take the necessary steps to allow the Sentinel URL. 
3. Rerun the failed job, or run a satellite indices job for a date range of 5 to 7 days, and then check whether the job is successful.  

### Sentinel server: Down for maintenance

**Job failure message**: "The Copernicus Open Access Hub is back soon! Sorry for the inconvenience, we're performing some maintenance at the moment. We will be back online shortly!" 

**Corrective action**:

This issue can occur if any maintenance activities are being done on the Sentinel server.

1. If any job or pipeline fails because maintenance is being performed, resubmit the job after some time. 

   For information about any planned or unplanned Sentinel maintenance activities, go to the [Copernicus Open Access Hub News](https://scihub.copernicus.eu/news/) site.  

2. Rerun the failed job, or run a satellite indices job for a date range of 5 to 7 days, and then check whether the job is successful.

### Sentinel: Maximum number of connections reached

**Job failure message**: "Maximum number of two concurrent flows achieved by the user '\<username>'."

**Meaning**: If a job fails because the maximum number of connections are reached, the same Sentinel account is being used in multiple jobs.

**Corrective action**: Try either of the following options:

* Wait for the other jobs to finish before rerunning the failed job.
* Create a new Sentinel account, and then update the Sentinel username and password in FarmBeats.

### Sentinel server: Refused connection

**Job failure message**: "Server refused connection at: http://172.30.175.69:8983/solr/dhus."

**Corrective action**: This issue can occur if any maintenance activities are being done on the Sentinel server.

1. If any job or pipeline fails because maintenance is being performed, resubmit the job after some time.

   For information about any planned or unplanned Sentinel maintenance activities, go to the [Copernicus Open Access Hub News](https://scihub.copernicus.eu/news/) site.  

2. Rerun the failed job, or run a satellite indices job for a date range of 5 to 7 days, and then check whether the job is successful.

### Soil Moisture map has white areas

**Issue**: The **Soil Moisture map** was generated, but the map has mostly white areas.

**Corrective action**: This issue can occur if the satellite indices generated for the time for which the map was requested has NDVI values that are less than 0.3. For more information, visit [Technical Guide from Sentinel](https://sentinel.esa.int/web/sentinel/technical-guides/sentinel-2-msi).

1. Rerun the job for a different date range and check if the NDVI values in the satellite indices are more than 0.3.

## Collect logs manually

[Install and deploy Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows).

### Collect Azure Data Factory job logs or App Service logs in Datahub

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the **Search** box, search for the FarmBeats Datahub resource group.
3. On the **Resource Group** dashboard, search for the *datahublogs\** storage account. For example, *datahublogsmvxmq*.  
4. In the **Name** column, select the storage account to view the **Storage Account** dashboard.
5. In the **datahubblogs\*** pane, select **Open in Explorer** to view the **Open Azure Storage Explorer** application.
6. In the left pane, select **Blob Containers**, and then select **job-logs** for Azure Data Factory logs or **appinsights-logs** for App Service logs.
7. Select **Download** and download the logs to a local folder on your machine.

    ![Screenshot that shows the downloaded log files.](./media/troubleshoot-azure-farmbeats/collecting-logs-manually-1.png)

### Collect Azure Data Factory job logs or App Service logs for Accelerator

1. Sign in to the [Azure portal](https://portal.azure.com).
2. In the **Search** box, search for the FarmBeats Accelerator resource group.
3. On the **Resource Group** dashboard, search for the *storage\** storage account. For example,  *storagedop4k\**.
4. Select the storage account in the **Name** column to view the **Storage Account** dashboard.
5. In the **storage\*** pane, select **Open in Explorer** to open the Azure Storage Explorer application.
6. In the left pane, select **Blob Containers**, and then select **job-logs** for Azure Data Factory logs or **appinsights-logs** for App Service logs.
7. Select **Download** and download the logs to a local folder on your machine.

## High CPU usage

**Error**: You get an email alert that refers to a **High CPU Usage Alert**.

**Corrective action**:

1. Go to your FarmBeats Datahub resource group.
2. Select the **App service**.  
3. Go to the scale up [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/), and then select an appropriate pricing tier.

## Weather data job failures

**Error**: You run Jobs to get weather data but the job fails

### Collect logs to troubleshoot weather data job failures

1. Go to your FarmBeats resource group in the Azure portal.
2. Select on the Data Factory service that is part of the resource group. The service has a tag "sku: Datahub"

> [!NOTE]
> To view the tags of the services within the resource group, click on "Edit Columns" and add "Tags" to the resource group view

:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-1.png" alt-text="Screenshot that highlights the sku:Datahub tag.":::

3. On the Overview page of the Data factory, select on **Author and Monitor**. A new tab opens on your browser. Select on **Monitor**

:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-2.png" alt-text="Screenshot that highlights the Monitor menu option.":::

4. You see a list of pipeline runs that are part of the weather job execution. Select on the Job that you want to collect logs for
 
:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-3.png" alt-text="Screenshot that highlights the Pipeline runs menu option and the selected job.":::

5. On the pipeline overview page, you see the list of activity runs. Make a note of the Run IDs of the activities that you want to collect logs for
 
:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-4.png" alt-text="Screenshot that shows the list of activity runs.":::

6. Go back to your FarmBeats resource group in Azure portal and select on the Storage Account with the name **datahublogs-XXXX**
 
:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-5.png" alt-text="Screenshot that highlights the Storage Account with the name datahublogs-XXXX.":::

7. Select on **Containers** -> **adfjobs**. In the Search box, enter the job Run ID that you noted in step 5 above.
 
:::image type="content" source="./media/troubleshoot-Azure-farmbeats/weather-log-6.png" alt-text="Project FarmBeats":::

8. The search result contains the folder that has the logs pertaining to the job. Download the logs and send it to farmbeatssupport@microsoft.com for assistance in debugging the issue.
