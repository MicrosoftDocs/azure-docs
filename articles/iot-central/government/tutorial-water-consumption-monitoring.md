---
title: Create a water consumption monitoring app with Azure IoT Central | Microsoft Docs
description: Learn to create a water consumption monitoring application using Azure IoT Central application templates.
author: miriambrus
ms.author: miriamb
ms.date: 09/24/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: abjork
---

# Tutorial: Create a water consumption monitoring application in IoT Central

This tutorial guides you to create an Azure IoT Central water consumption monitoring application from the IoT Central Water Consumption Monitoring application template. 

The tutorial will learn how to: 

> [!div class="checklist"]
> * Use the Azure IoT Central **Water consumption monitoring** template to create your water consumption monitoring application
> * Explore and customize operator dashboard 
> * Explore device template
> * Explore simulated devices
> * Explore and configure rules
> * Configure jobs
> * Customize your application branding using whitelabeling

## Prerequisites

To complete this tutorial you need:
-  An Azure subscription is recommended. If you don't have an Azure subscription, you can create one on the [Azure sign-up page](https://aka.ms/createazuresubscription).

## Create water consumption monitoring app in IoT Central

In this section, we will use the Azure IoT Central **Water consumption monitoring template** to create your water consumption monitoring application in IoT Central.

To create a new Azure IoT Central water consumption monitoring application:  

1. Navigate to the [Azure IoT Central Home page](https://aka.ms/iotcentral) website.

    If you have an Azure subscription, sign in with the credentials you use to access it, otherwise sign in using a Microsoft account:

    ![Enter your organization account](media/tutorial-waterconsumptionmonitoring/sign-in.png)

2. Click on **Build** from the left navigation menu and select the **Government** tab. The government page displays several government application templates.

   ![Build Government App templates](./media/tutorial-waterconsumptionmonitoring/iotcentral-government-tab-overview1.png)

1. Select the **Water consumption monitoring** application template. 
This template includes sample water consumption device template, simulated device, operator dashboard, and pre-configured monitoring rules.    

2. Click **Create app**, which will open **New application** creation form with the following fields:
    * **Application name**: by default the application  uses *Water consumption monitoring* followed by a unique ID string that IoT Central generates. Optionally, choose a friendly application name. You can change the application name later too.
    * **URL**: IoT Central will autogenerate a URL for you based on the application name. You can choose to update the URL to your liking. You can change the URL later too. 
    * If you have an Azure subscription, enter your *Directory, Azure subscription, and Region*. If you don't have a subscription, you can enable **7-day free trial** and complete the required contact information.  

    For more information about directories and subscriptions, see the [create an application quickstart](../core/quick-deploy-iot-central-pnp.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json).

5. Click **Create** button at the bottom of the page. 

    ![Azure IoT Central Create Application page](./media/tutorial-waterconsumptionmonitoring/new-application-waterconsumptionmonitoring.png)

6. You now have created a water consumption monitoring app using the Azure IoT Central **Water consumption monitoring** template.

Congratulations! You have finished creating your water quality monitoring application, which comes with pre-configured:
* Sample operator dashboards
* Sample pre-defined water flow and valve device templates
* Simulated water flow and smart valve devices
* Pre-configured rules and jobs
* Sample Branding using white labeling 

It is your application and you can modify it anytime. Let’s now explore the application and make some customizations.  

## Explore and customize operator dashboard 
After creating the application you land in the sample operator dashboard called **Wide World water consumption monitoring dashboard**.

   ![Water consumption Monitoring dashboard](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-dashboardfull.png)

As a builder, you can create and customize views on the dashboard for operators. Before you try to customize, let's explore the dashboard. 

> [!NOTE]
> All data displayed in the dashboard is based on simulated device data, which we will be explored in the next section. 
  
The dashboard consists of different kinds of tiles:

* **Wide World Water utility image tile**: the first tile in the dashboard is an image tile of a fictitious Water utility "Wide World Water". You can customize the tile and put your own image or remove it. 

* **Average water flow KPI tile**: the KPI tile is configured to display as an example *the average in the last 30 minutes*. You can customize KPI tiles and set to a different type and time range.

* Then it has right in the dashboard *Device Command* tiles to **Close valve**, **Open valve**, or **Set valve position**. Clicking on the commands will take you to the simulated device device command page. In IoT Central a *Command* is a *device capability* type which we will explore later in the **device template section** of this tutorial.

*  **Water distribution area map**: the map is using Azure Maps, which you can configure directly in Azure IoT Central. The map tile is displaying device location. Try to hover over the map and try the controls over the map, like *zoom-in*, *zoom-out* or *expand*. 

    ![Water consumption Monitoring dashboard map](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-dashboard-map.png)

* **Average water flow line chart** and **Environment conditions line chart**: you can visualize one or multiple device telemetries plotted as a line chart over a desired time range.  

* **Average valve pressure heatmap chart**: you can choose heatmap visualization type of device telemetry data you are interested to look at the distribution over a time range with a color index.

* **Reset alert threshold content tile**: you can include call to action content tiles embedding the link to an action page. In this case reset alert threshold will take you to the application **Jobs** where you can run updates to devices properties, which we will explore later in the **configure jobs** section of this tutorial.

* **Property tiles**: the dashboard displays **Valve operational info**, **Flow alert thresholds**, and **Maintenance info** which are device properties.  


### Customize dashboard 

As a builder, you can customize views in dashboard for operators. You can try:
1. Click on **Edit** to customize the **Wide World water consumption monitoring dashboard**. You can customize the dashboard by clicking on the **Edit** menu. Once the dashboard is in **edit** mode, you can add new tiles, or you can configure 

     ![Edit Dashboard](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-edit-dashboard.png)

2. Click on **+ New** to create new dashboard and configure from scratch. You can have multiple dashboards and you can navigate between your dashboards from the dashboard menu. 

## Explore device template
A device template in Azure IoT Central defines the capability of a device, which can be telemetry, property, or command. As a builder, you can define one or more device templates in IoT Central that represent the capability of the devices that you will connect. 
 

The **Water consumption monitoring** application comes with two reference device templates representing a *flow meter* and a *smart valve* device. 

To view the device template:

1. Click on **Device templates** from the left navigation pane of your application in IoT Central. 
    In the Device templates list you will see two device templates **Flow meterr** and **Smart Valve**

   ![Device Template](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-devicetemplate.png)

2. Click on **Flow meter** device template and familiarize with the device capabilities 

     ![Device Template Flow meter](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-devicetemplate-flowmeter.png)

### Customizing the device template

Try to customize the following:
1. Navigate to **Customize** from the device template menu
2. Find the `Temperature` telemetry type
3. Update the **Display name** of `Temperature` to `Reported temperature`
4. Update unit of measurement, or set *Min value* and *Max value*
5. **Save** any changes 

### Add a cloud property 
1. Navigate to **Cloud property** from the device template menu
2. Add a new cloud property by clicking **+ Add Cloud Property**. 
    In IoT Central, you can add a property that is relevant to the device. As an example, a cloud property could be an alerting threshold specific to installation area, asset information, or maintenance information etc. 
3. **Save** any changes 
 
### Views 
The water consumption monitor device template comes with pre-defined views. Explore the views and you can make updates. The views define how operators will see the device data but also inputting cloud properties. 

  ![Device Template Views](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-devicetemplate-views.png)

### Publish 
If you made any changes make sure to **Publish** the device template. 

### Create a new device template 
- Select **+ New** to create a new device template and follow the creation process. 
You will be able to create a custom device template from scratch or you can choose a device template from the Azure Device Catalog. 

## Explore simulated devices
In IoT Central, you can create simulated devices to test your device template and application. The **Water consumption monitoring** application has two simulated devices mapped to the *Flow meter* and *Smart Valve* device templates. 

### To view the devices:
1. Navigate to **Device** from IoT Central left navigation pane. 

   ![Devices](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-devices.png)

2. Click on one **Smart Valve 1** 

    ![Device 1](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitor-device1.png)

3.  In the **Device Commands** you can see the three device commands *Open Valve*, *Close Valve*, and *Set Valve position* that are capabilities defined in the *Smart Valve* device template. 
4. Explore the **Device Properties** tab and **Device Dashboard** tab. 

> [!NOTE]
> Note that all the tabs have been configured from the Device template Views.

### Add new devices
* Add new devices by clicking on **+ New** on the **Devices** tab. 

## Explore and configure rules

In Azure IoT Central you can create rules to automatically monitor on device telemetry, and trigger actions when one or more conditions are met. The actions may include sending email notifications, or triggering a Microsoft Flow action or a webhook action to send data to other services.

The **Water consumption monitoring** application you have created template has three pre-configured rules.

### To view rules:
1. Navigate to **Rules** from IoT Central left navigation pane. 

   ![Rules](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-rules.png)

2. Select and click on **High pH alert** which is one of the pre-configured rules in the application.

     ![High pH Alert](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-highflowalert.png)

    The `High flow alert` rule is configured to check against the condition `Acidity (pH)` is `greater than` the `Max flow threshold`. Max flow threshold is a cloud property defined in the device *Smart Valve* device template. The value of `Max flow threshold` is set per device instance. 

Now let's create an email action.

To add an action to the rule:

1. Select **+ Email**. 
1. Enter *High pH alert* as the friendly **Display name** for the action.
    * Enter the email address associated with your IoT Central account in **To**. 
1. Optionally, enter a note to include in text of the email.
1. Select **Done** to complete the action.
1. Select **Save** to save and activate the new rule. 

Within a few minutes, you should receive email when the configured **condition** is met.

> [!NOTE]
> The application will send email each time a condition is met. **Disable** the rule to stop receiving email from the automated rule. 
  
To create a new rule: 
- Select **+New** on the **Rules** from the left navigation pane.

## Configure Jobs

In IoT Central, jobs allow you to trigger device or cloud property updates on multiple devices. In addition to properties, you can also use jobs to trigger device commands on multiple devices. IoT Central will automate the workflow for you. 

1. Go to **Jobs** from the left navigation pane. 
2. Click **+New** and configure one or more jobs. 


## Customize your application 
As a builder, you can change several settings to customize the user experience in your application.

1.  Go to **Administration > Customize your application**.
3. Use the **Change** button to choose an image to upload as the **Application logo**.
4. Use the **Change** button to choose a **Browser icon** image that will appear on browser tabs.
5. You can also replace the default **Browser colors** by adding HTML hexadecimal color codes.

   ![Azure IoT Central customize your application](./media/tutorial-waterconsumptionmonitoring/waterconsumptionmonitoring-customize-your-application.png)

1.  You can also change application images by going to the **Administration > Application settings** and **Select image** button to choose an image to upload as the application image. 
2. Finally, you can also change the **Theme** by clicking **Settings** on the masthead of the application. 

  
## Clean up resources

If you're not going to continue to use this application, delete your application with the following steps:

1. Open the Administration tab from the left navigation menu of your IoT Central application. 
2. Select Application settings and click Delete button at the bottom of the page. 


## Next steps

* Learn about more about [Water consumption monitoring concepts](./concepts-waterconsumptionmonitoring-architecture.md)
