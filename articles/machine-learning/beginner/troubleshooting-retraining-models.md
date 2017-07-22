---
title: Troubleshoot retraining an Azure Machine Learning Classic web service | Microsoft Docs
description: Identify and correct common issues encounted when you are retraining the model for an Azure Machine Learning Web Service.
services: machine-learning
documentationcenter: ''
author: VDonGlover
manager: raymondl
editor: ''

ms.assetid: 75cac53c-185c-437d-863a-5d66d871921e
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/19/2017
ms.author: v-donglo

---
# Troubleshooting the retraining of an Azure Machine Learning Classic Web service
## Retraining overview
When you deploy a predictive experiment as a scoring web service it is a static model. As new data becomes available or when the consumer of the API has their own data, the model needs to be retrained. 

For a complete walkthrough of the retraining process of a Classic Web service, see [Retrain Machine Learning Models Programmatically](machine-learning-retrain-models-programmatically.md).

## Retraining process
When you need to retrain the Web service, you must add some additional pieces:

* A Web service deployed from the Training Experiment. The experiment must have a **Web Service Output** module attached to the output of the **Train Model** module.  
  
    ![Attach the web service output to the train model.][image1]
* A new endpoint added to your scoring Web service.  You can add the endpoint programmatically using the sample code referenced in the Retrain Machine Learning models programmatically topic or through the Azure classic portal.

You can then use the sample C# code from the Training Web Service's API help page to retrain model. Once you have evaluated the results and are satisfied with them, you update the trained model scoring web service using the new endpoint that you added.

With all the pieces in place, the major steps you must take to retrain the model are as follows:

1. Call the Training Web Service:  The call is to the Batch Execution Service (BES), not the Request Response Service (RRS). You can use the sample C# code on the API help page to make the call. 
2. Find the values for the *BaseLocation*, *RelativeLocation*, and *SasBlobToken*: These values are returned in the output from your call to the Training Web Service. 
   ![showing the output of the retraining sample and the BaseLocation, RelativeLocation, and  SasBlobToken values.][image6]
3. Update the added endpoint from the scoring web service with the new trained model: Using the sample code provided in the Retrain Machine Learning models programmatically, update the new endpoint you added to the scoring model with the newly trained model from the Training Web Service.

## Common obstacles
### Check to see if you have the correct PATCH URL
The PATCH URL you are using must be the one associated with the new scoring endpoint you added to the scoring Web service. There are a number of ways to obtain the PATCH URL:

**Option 1: Programatically**

To get the correct PATCH URL:

1. Run the [AddEndpoint](https://github.com/raymondlaghaeian/AML_EndpointMgmt/blob/master/Program.cs) sample code.
2. From the output of AddEndpoint, find the *HelpLocation* value and copy the URL.
   
   ![HelpLocation in the output of the addEndpoint sample.][image2]
3. Paste the URL into a browser to navigate to a page that provides help links for the Web service.
4. Click the **Update Resource** link to open the patch help page.

**Option 2: Use the Azure classic portal**

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com).
2. Open the Machine Learning tab. 
   ![Machine leaning tab.][image4]
3. Click your workspace name, then **Web Services**.
4. Click the scoring Web service you are working with. (If you did not modify the default name of the web service, it will end in [Scoring Exp.].)
5. Click **Add Endpoint**.
6. After the endpoint is added, click the endpoint name. Then click **Update Resource** to open the patching help page.

> [!NOTE]
> If you have added the endpoint to the Training Web Service instead of the Predictive Web Service, you will receive the following error when you click the **Update Resource** link: Sorry, but this feature is not supported or available in this context. This Web Service has no updatable resources. We apologize for the inconvenience and are working on improving this workflow.
> 
> 

![New endpoint dashboard.][image3]

The PATCH help page contains the PATCH URL you must use and provides sample code you can use to call it.

![Patch URL.][image5]

### Check to see that you are updating the correct scoring endpoint
* Do not patch the Training Web Service: The patch operation must be performed on the scoring Web service.
* Do not patch the default endpoint on Web service: The patch operation must be performed on the new scoring Web service endpoint that you added.

You can verify which Web service the endpoint is on by visiting the Azure classic portal. 

> [!NOTE]
> Be sure you are adding the endpoint to the Predictive Web Service, not the Training Web Service. If you have correctly deployed both a Training and a Predictive Web Service, you should see two separate Web services listed. The Predictive Web Service should end with "[predictive exp.]".
> 
> 

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com).
2. Open the Machine Learning tab. 
   ![Machine learning workspace UI.][image4]
3. Select your workspace.
4. Click **Web Services**.
5. Select your Predictive Web Service.
6. Verify that your new endpoint was added to the Web service.

### Check the workspace that your web service is in to ensure it is in the correct region
1. Sign in to the [Azure classic portal](https://manage.windowsazure.com).
2. Select Machine Learning from the menu.
   ![Machine learning region UI.][image4]
3. Verify the location of your workspace.

<!-- Image Links -->

[image1]: ./media/machine-learning-troubleshooting-retraining-a-model/ml-studio-tm-connnected-to-web-service-out.png
[image2]: ./media/machine-learning-troubleshooting-retraining-a-model/addEndpoint-output.png
[image3]: ./media/machine-learning-troubleshooting-retraining-a-model/azure-portal-update-resource.png
[image4]: ./media/machine-learning-troubleshooting-retraining-a-model/azure-portal-machine-learning-tab.png
[image5]: ./media/machine-learning-troubleshooting-retraining-a-model/ml-help-page-patch-url.png
[image6]: ./media/machine-learning-troubleshooting-retraining-a-model/retraining-output.png
[image7]: ./media/machine-learning-troubleshooting-retraining-a-model/web-services-tab.png
