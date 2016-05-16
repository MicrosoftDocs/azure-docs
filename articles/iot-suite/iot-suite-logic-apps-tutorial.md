<properties
  pageTitle="Azure IoT Suite and Logic Apps | Microsoft Azure"
  description="A tutorial on how to hook up Logic Apps to Azure IoT Suite for business process."
  services=""
  suite="iot-suite"
  documentationCenter=""
  authors="aguilaaj"
  manager="timlt"
  editor=""/>

<tags
  ms.service="iot-suite"
  ms.devlang="na"
  ms.topic="article"
  ms.tgt_pltfrm="na"
  ms.workload="na"
  ms.date="05/10/2016"
  ms.author="araguila"/>
  
# Tutorial: Connect Logic App to your Azure IoT Suite Remote Monitoring preconfigured solution


The [Microsoft Azure IoT Suite][lnk-internetofyourthings] remote monitoring preconfigured solution is a great way to get started quickly with an end-to-end feature set exemplifying an IoT solution. We want to help you take your IoT solution even further by adding business processes. This article walks you through how to add Logic App to your Microsoft Azure IoT Suite remote monitoring preconfigured solution.

_If you’re looking for a walkthrough on how to provision a remote monitoring preconfigured solution, see [Tutorial: Get started with the IoT preconfigured solutions][lnk-getstarted]._

Assuming you’ve provisioned a remote monitoring preconfigured solution, navigate to the resource group for that solution in the [Azure Portal][lnk-azureportal]. The resource group will have the same name as the solution name you specified when you provisioned your solution. In your resource group, you’ll see all the pre-provisioned Azure resources for your solution (with the exception of your AAD application that can be found in the Azure Classic Portal). 

![](media/iot-suite-logic-apps-tutorial/resourcegroup.png)

To begin, you’ll set up the logic app to use.

#### Set Up the Logic App

1. Click __Add__ at the top of your resource group in the Azure Portal.
* Search for __Logic App__ and Click Create.
* Fill out the __Name__ and use the same Subscription, Resource Group, and App Service plan used and provisioned when you initially provisioned your remote monitoring preconfigured solution. Click __Create__.
  
  ![](media/iot-suite-logic-apps-tutorial/createlogicapp.png)

* Once your deployment completes, you will see a Logic App now listed under resources in your resource group.
* Click on the Logic App to navigate to the Logic App blade, then click on __Edit__ in the top menu to open the Logic Apps Designer.
  
  ![](media/iot-suite-logic-apps-tutorial/logicappsdesigner.png)

* Select __Manual – When an HTTP request is received__. This will act as the trigger.
* Paste the following into the Request Body JSON Schema:

  ```
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/",
    "properties": {
      "DeviceId": {
        "id": "DeviceId",
        "type": "string"
      },
      "measuredValue": {
        "id": "measuredValue",
        "type": "integer"
      },
      "measurementName": {
        "id": "measurementName",
        "type": "string"
      }
    },
    "required": [
      "DeviceId",
      "measurementName",
      "measuredValue"
    ],
    "type": "object"
  }
  ```

* Note: you will copy the URL for HTTP Post after saving the logic app. You must have a trigger and an action to save a logic app, so let's add our action.
* Click __(+)__ under your manual trigger. Then click **Add an action**
  
  ![](media/iot-suite-logic-apps-tutorial/logicappcode.png)

* Search for __Office 365 Outlook – Send Email__.
  
  ![](media/iot-suite-logic-apps-tutorial/logicappaction.png)

* Sign in with your Office365 account to send an email on behalf of that account.
* Enter your Subject: I used "Solution test threshold triggered on Device `[DeviceId]`" where `[DeviceId]` is dragged from Outputs from manual below.
* Enter your Body: I used “Device ```[DeviceId]``` has reported ```[measurementName]``` with value ```[measuredValue]```”
* Enter whom to send your email to.
* Click __Save__ in the top menu.
* Copy the __Http Post to this URL__ from your manual trigger.

#### Set Up Event Processor Web Job
1. Use your git client to __clone__ the latest version of the [azure-iot-remote-monitoring github repository][lnk-rmgithub].
* Open __RemoteMonitoring.sln__ in Visual Studio.
* Open up __ActionProcessor.cs__ under azure-iot-remote-monitoring\EventProcessor\EventProcessor.WebJob\Processors\
* Update the ```<URL>``` with the __HTTP Post URL__ from your Logic App:
```
private Dictionary<string,string> actionIds = new Dictionary<string, string>()
{
    { "Send Message", "<URL>" },
    { "Raise Alarm", "<URL> }
};	 
```
* Save RemoteMonitoring.sln

#### Deploy from the commandline
1. Set up your environment for deployment, following the [dev set-up][lnk-devsetup] instructions.
* To deploy locally, follow the [local deployment][lnk-localdeploy] instructions.
* To deploy to the cloud and update your existing cloud deployment, follow the [cloud deployment][lnk-clouddeploy] instructions.

#### See your logic app in action!
The remote monitoring preconfigured solution has two rules set up by default when you first provision a solution. Both rules are on SampleDevice001:
* Temperature > 38.00
* Humidity > 48.00

The Temperature rule triggers the Raise Alarm actionId while the Humidity rule triggers the SendMessage actionId. Assuming you pasted the same ```<URL>``` in ActionProcessor.cs for both, your logic app will trigger for either.

> [AZURE.NOTE] The Logic App will continue to trigger for every instance of a threshold being met, so to avoid unnecessary emails, you can either disable the rules in your solution portal or disable the Logic App in the [Azure Portal][lnk-azureportal].

[lnk-internetofyourthings]: http://www.microsoft.com/en-us/server-cloud/internet-of-things/azure-iot-suite.aspx
[lnk-getstarted]:https://azure.microsoft.com/en-us/documentation/articles/iot-suite-getstarted-preconfigured-solutions/
[lnk-azureportal]: https://portal.azure.com
[lnk-rmgithub]: https://github.com/Azure/azure-iot-remote-monitoring
[lnk-devsetup]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/dev-setup.md
[lnk-localdeploy]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/local-deployment.md
[lnk-clouddeploy]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/cloud-deployment.md
