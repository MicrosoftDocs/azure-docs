
# Tutorial: Create a solar panel monitoring app with IoT Central 

This tutorial guides you through the process of creating a solar panel monitoring application that's included a simulated device with data simulation. In this tutorial, you learn:

> [!div class="checklist"]
> * Create solar panel app for free
> * Verify the app, simulated device, and data


If you don’t have a subscription, [create a free trial account](https://azure.microsoft.com/free)


## Prerequisites

- No specific pre-requisites required to deploy this app
- Recommended to have Azure subscription, but you can even try without it


## Create solar panel Monitoring App 

You can create this app template just in simple three steps, so let’s begin 

### Step 1

Open [Azure IoT Central home page](https://apps.azureiotcentral-ppe.com) and click **Build** to create a new application. 


### Step 2
Select **Energy** tab and click **Create app** under **solar panel monitoring application**

![Build App](media/tutorial-iot-central-solar-panel/solar-panel-build.png)


### Step 3

**Create app** will open **New application** form and fill up the requested details as shown in the below figure:
* **Application name**: pick a name that makes sense to your IoT Central Application
* **URL** – pick the IoT Central URL, don't worry app will verify the uniqueness.
* **7-day free trial** – default setting is recommended if you already have an Azure Subscription or else you can start with 7-day free trial. 
* **Billing Info** – We've got you covered, as this application is free. The Directory, Azure Subscription, and Region details are required to provision the resources.
* Click **Create** button at the bottom of the page and your app will be ready in a minute or so. 

![New application form](media/tutorial-iot-central-solar-panel/solar-panel-create-app.png)


Behind the scene, IoT Central platform creates the app template with the given parameters and it will open as soon as it's ready for you. 



## Verify the application and simulated data

At high level, the newly created app comes with – a pre-defined device model for solar panels, which includes data fields, properties, and a default view. It is your application and you can modify it anytime. But, let’s ensure the app template is working as expected before any modifications.

To verify the app and simulated data, you can go to the Dashboard. If you can see the tiles with some data, then it means you successfully deployed it. The data simulation may take a few minutes to generate the data, so give it 1-2 minutes.  

If you don’t see any data after 3-5 mins or any other error, then contact <> 



## Clean up resources
If you're not going to continue to use this application, delete your application with the following steps:

1. From the left-hand menu, open Administration tab
2. Select Application settings and click Delete button at the bottom of the page. 

![Delete application](media/tutorial-iot-central-solar-panel/solar-panel-delete-app.png)


## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
