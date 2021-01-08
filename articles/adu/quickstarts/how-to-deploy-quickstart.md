# Deploy Update

## Prerequisites

* Access to an IoT Hub with Azure Device Update (ADU) enabled.
* At least one update has been successfully imported for the provisioned device.
* An IoT device (or simulator) provisioned within the IoT Hub, running either Azure RTOS or Ubuntu 18.04 x64.
* A tag has been assigned to the IoT device you are trying to update, and it is part of at least one update group

## Deploy an update

1. Go to [Azure Portal](https://ms.portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_Iothub=aduprod&microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_ADUHidden&feature.devicetwin=true#home)

2. Navigate to the Device Update blade your IoT Hub.
![IoT Hub](images/adu-iot-hub.PNG)

3. Select the Groups tab at the top of the page.
![Groups Tab](images/updated-view.PNG)

4. View the update compliance chart and groups list. You should see a new update available for your device group, with a link to the update under Pending Updates (you may need to Refresh once). [Learn More](../adu-compliance.md) about update compliance.
![Available Update](images/available-update.PNG)

5. Select the available update

6. Confirm the correct group is selected as the target group. Schedule your deployment, then select Deploy update.
![Select Update](images/select-update.PNG)

7. View the compliance chart. You should see the update is now in progress. 
![Update in progress](images/update-in-progress.PNG)

8. After your device is successfully updated, you should see your compliance chart and deployment details update to reflect the same. 
![Update succeeded](images/update-succeeded.PNG)

## Monitor an update deployment

1. Select the Deployments tab at the top of the page.
![Deployments Tab](images/deployments-tab.PNG)

2. Select the deployment you created to view the deployment details.
![Deployment Details](images/deployment-details.PNG)

3. Select Refresh to view the latest status details. Continue this process until the status changes to Succeeded.


## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices. 

1. Go to the Deployments tab, and select the deployment that has failed. 
![Deployment Details](images/deployment-details.PNG)

2. Click on the "Failed" Device Status in the detailed Deployment information pane.

3. Click on "Retry failed devices" and acknowledge the confirmation pop-up. 

