---
title: Azure SQL Data Warehouse - Using Azure Functions to automate SQL Data Warehouse compute levels  | Microsoft Docs
description: How to use Azure functions to manage the compute of your data warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: barbkess

ms.assetid: 52DFC191-E094-4B04-893F-B64D5828A901
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: hero-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: quickstart
ms.date: 11/06/2017
ms.author: elbutter

---
# Use Azure Functions to automate SQL DW compute levels

This tutorial will demonstrate how you can use Azure Functions to manage the compute levels of your Azure SQL Data Warehouse. These architectures are recommended for use with SQL Data Warehouse [Optimized for Elasticity][Performance Tiers].

In order to use Azure Function App with SQL Data Warehouse, you must create a [Service Principal Account](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal) with contributor access under the same subscription as your data warehouse instance. 

## Deploy Timer based scaler with an Azure Resource Manager Template

To deploy the template, you will need the following information:

- Name of the resource group your SQL DW instance is in
- Name of the logical server your SQL DW instance is in
- Name of your SQL DW instance
- Tenant ID (Directory ID) of your Azure Active Directory
- Subscription ID 
- Service Principal Application ID
- Service Principal Secret Key

Once you have the above information, deploy this template:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FMicrosoft%2Fsql-data-warehouse-samples%2Fmaster%2Farm-templates%2FsqlDwTimerScaler%2Fazuredeploy.json" target="_blank">
<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/>
</a>

Once you've deployed the template, you should find three new resources: a free Azure App Service Plan, a consumption based Function App plan, and a storage account which will handle the logging and the operations queue. Continue reading the other sections to see how to modify the deployed functions to fit your need.

### Change the scale up or scale down compute level

1. Navigate to your Function App service. If you deployed the template with the default values, this service should be named *DWOperations*. Once your Function App is open, you should notice there are five functions deployed to your Function App Service. 

   ![Functions that are deployed with template](media/manage-compute-with-azure-functions/five-functions.png)

2. Select either *DWScaleDownTrigger* or *DWScaleUpTrigger* depending on whether you would like to change the scale up or scale down time. In the drop down, select Integrate.

   ![Select Integrate for function](media/manage-compute-with-azure-functions/select-integrate.png)

3. Currently the value displayed should say either *%ScaleDownTime%* or *%ScaleUpTime%*. These values indicate the schedule is based on values defined in your [Application Settings][Application Settings]. For now, you can ignore this and change the schedule to your preferred time based on the next steps.

4. In the schedule area, add the time the CRON expression you would like to reflect how often you want the SQL Data Warehouse to be scaled up. 

  ![Change function schedule](media/manage-compute-with-azure-functions/change-schedule.png)

  The value of `schedule` is a [CRON expression](http://en.wikipedia.org/wiki/Cron#CRON_expression) that includes these six fields: 
  ```json
  {second} {minute} {hour} {day} {month} {day-of-week}
  ```

  For example *"0 30 9 * * 1-5"* would reflect a trigger every weekday at  9:30am. For more information, visit Azure Functions [schedule examples][schedule examples].


### Change the scale up or scale down time

1. Navigate to your Function App service. If you deployed the template with the default values, this service should be named *DWOperations*. Once your Function App is open, you should notice there are five functions deployed to your Function App Service. 

2. Select either *DWScaleDownTrigger* or *DWScaleUpTrigger* depending on whether you would like to change the scale up or scale down compute value. Upon selecting the functions, your pane should show the *index.js* file.

   ![Change function trigger compute level](media/manage-compute-with-azure-functions/index-js.png)

3. Change the value of *ServiceLevelObjective* to the level you would like and hit save. This is the compute level that your data warehouse instance will be scaled to based on the schedule defined in the Integrate section.

### Use pause or resume instead of scale 

Currently, the functions on by default are *DWScaleDownTrigger* and *DWScaleUpTrigger*. If you would like to use pause and resume functionality instead, you can enable *DWPauseTrigger* or *DWResumeTrigger*.

1. Navigate to the Functions pane.

   ![Functions pane](media/manage-compute-with-azure-functions/functions-pane.png)



2. Click on the sliding toggle for the corresponding triggers you would like to enable.

3. Navigate to the *Integrate* tabs for the respective triggers to change their schedule.

   [!NOTE]: The functional difference between the scaling triggers and the pause/resume triggers is the message that is sent to the queue. See [Add a new trigger function][Add a new trigger function] for more information.



### Add a new trigger function

Currently, there are only two scaling functions included within the template. This means that, over the course of a day, you can only scale down once and up once. For more granular control, such as scaling down multiple times per day or having different scaling behavior on the weekends, you will have to add another trigger.

1. Create a new blank function. Select the *+* button near your Functions location to bring up the function template pane.

   ![Create new function](media/manage-compute-with-azure-functions/create-new-function.png)

2. From Language, select *Javascript*, then select *TimerTrigger*.

   ![Create new function](media/manage-compute-with-azure-functions/timertrigger-js.png)

3. Name your function and set your schedule. The image shows how one may trigger their function every Saturday at midnight (late Friday evening).

   ![Scale down Saturday](media/manage-compute-with-azure-functions/scale-down-saturday.png)

4. Copy the content of *index.js* from one of the other trigger functions.

   ![Copy index js](media/manage-compute-with-azure-functions/index-js.png)

5. Set your your operation variable to the desired behavior as follows:

   ```javascript
   // Resume the data warehouse instance
   var operation = {
       "operationType": "ResumeDw"
   }

   // Pause the data warehouse instance
   var operation = {
       "operationType": "PauseDw"
   }

   // Scale the data warehouse instance to DW600
   var operation = {
       "operationType": "ScaleDw",
       "ServiceLevelObjective": "DW600"
   }
   ```


### Complex scheduling

This section will briefly demonstrate what is necessary to get more complex scheduling of pause, resume, and scaling capabilities.

#### Example 1:

Daily scale up at 8am to DW600 and scale down at 8pm to DW200.

| Function  | Schedule     | Operation                                |
| :-------- | :----------- | :--------------------------------------- |
| Function1 | 0 0 8 * * *  | `var operation = {"operationType": "ScaleDw",	"ServiceLevelObjective": "DW600"}` |
| Function2 | 0 0 20 * * * | `var operation = {"operationType": "ScaleDw", "ServiceLevelObjective": "DW200"}` |

#### Example 2: 

Daily scale up at 8am to DW1000, scale down once to DW600 at 4pm and scale down at 10pm to DW200.

| Function  | Schedule     | Operation                                |
| :-------- | :----------- | :--------------------------------------- |
| Function1 | 0 0 8 * * *  | `var operation = {"operationType": "ScaleDw",	"ServiceLevelObjective": "DW1000"}` |
| Function2 | 0 0 16 * * * | `var operation = {"operationType": "ScaleDw", "ServiceLevelObjective": "DW600"}` |
| Function3 | 0 0 22 * * * | `var operation = {"operationType": "ScaleDw", "ServiceLevelObjective": "DW200"}` |

#### Example 3: 

Scale up at 8am to DW1000 , scale down once to DW600 at 4pm on the weekdays. Pauses Friday 11pm, resumes 7am Monday morning.

| Function  | Schedule       | Operation                                |
| :-------- | :------------- | :--------------------------------------- |
| Function1 | 0 0 8 * * 1-5  | `var operation = {"operationType": "ScaleDw",	"ServiceLevelObjective": "DW1000"}` |
| Function2 | 0 0 16 * * 1-5 | `var operation = {"operationType": "ScaleDw", "ServiceLevelObjective": "DW600"}` |
| Function3 | 0 0 23 * * 5   | `var operation = {"operationType": "PauseDw"}` |
| Function4 | 0 0 7 * * 0    | `var operation = {"operationType": "ResumeDw"}` |



## Next steps

Learn more about [timer trigger](../azure-functions/functions-create-scheduled-function.md) Azure functions.

Checkout the SQL Data Warehouse [samples repository](https://github.com/Microsoft/sql-data-warehouse-samples).



[schedule examples]: ../azure-functions/functions-bindings-timer.md#example

[Application Settings]: ../azure-functions/functions-how-to-use-azure-function-app-settings.md
[Add a new trigger function]: manage-compute-with-azure-functions.md#add-a-new-trigger-function

[Performance Tiers]: performance-tiers.md
