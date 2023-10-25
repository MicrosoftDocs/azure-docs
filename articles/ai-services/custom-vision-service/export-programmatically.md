---
title: "Export a model programmatically"
titleSuffix: Azure AI services
description: Use the Custom Vision client library to export a trained model.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-custom-vision
ms.topic: how-to
ms.date: 06/28/2021
ms.author: pafarley
ms.devlang: python
---

# Export a model programmatically

All of the export options available on the [Custom Vision website](https://www.customvision.ai/) can be done programmatically through the client libraries as well. You may want to do this so you can fully automate the process of retraining and updating the model iteration you use on a local device.

This guide shows you how to export your model to an ONNX file with the Python SDK.

## Create a training client

You need to have a [CustomVisionTrainingClient](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.customvisiontrainingclient) object to export a model iteration. Create variables for your Custom Vision training resources Azure endpoint and keys, and use them to create the client object.

```python
ENDPOINT = "PASTE_YOUR_CUSTOM_VISION_TRAINING_ENDPOINT_HERE"
training_key = "PASTE_YOUR_CUSTOM_VISION_TRAINING_SUBSCRIPTION_KEY_HERE"

credentials = ApiKeyCredentials(in_headers={"Training-key": training_key})
trainer = CustomVisionTrainingClient(ENDPOINT, credentials)
```

> [!IMPORTANT]
> Remember to remove the keys from your code when youre done, and never post them publicly. For production, consider using a secure way of storing and accessing your credentials. For more information, see the Azure AI services [security](../security-features.md) article.

## Call the export method

Call the **export_iteration** method.
* Provide the project ID, iteration ID of the model you want to export. 
* The *platform* parameter specifies the platform to export to: allowed values are `CoreML`, `TensorFlow`, `DockerFile`, `ONNX`, `VAIDK`, and `OpenVino`. 
* The *flavor* parameter specifies the format of the exported model: allowed values are `Linux`, `Windows`, `ONNX10`, `ONNX12`, `ARM`, `TensorFlowNormal`, and `TensorFlowLite`.
* The *raw* parameter gives you the option to retrieve the raw JSON response along with the object model response.

```python
project_id = "PASTE_YOUR_PROJECT_ID"
iteration_id = "PASTE_YOUR_ITERATION_ID"
platform = "ONNX"
flavor = "ONNX10"
export = trainer.export_iteration(project_id, iteration_id, platform, flavor, raw=False)
```

For more information, see the **[export_iteration](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin#export-iteration-project-id--iteration-id--platform--flavor-none--custom-headers-none--raw-false----operation-config-)** method.

> [!IMPORTANT]
> If you've already exported a particular iteration, you cannot call the **export_iteration** method again. Instead, skip ahead to the **get_exports** method call to get a link to your existing exported model.

## Download the exported model

Next, you'll call the **get_exports** method to check the status of the export operation. The operation runs asynchronously, so you should poll this method until the operation completes. When it completes, you can retrieve the URI where you can download the model iteration to your device.

```python
while (export.status == "Exporting"):
    print ("Waiting 10 seconds...")
    time.sleep(10)
    exports = trainer.get_exports(project_id, iteration_id)
    # Locate the export for this iteration and check its status  
    for e in exports:
        if e.platform == export.platform and e.flavor == export.flavor:
            export = e
            break
    print("Export status is: ", export.status)
```

For more information, see the **[get_exports](/python/api/azure-cognitiveservices-vision-customvision/azure.cognitiveservices.vision.customvision.training.operations.customvisiontrainingclientoperationsmixin#get-exports-project-id--iteration-id--custom-headers-none--raw-false----operation-config-)** method.

Then, you can programmatically download the exported model to a location on your device.

```python
if export.status == "Done":
    # Success, now we can download it
    export_file = requests.get(export.download_uri)
    with open("export.zip", "wb") as file:
        file.write(export_file.content)
```

## Next steps

Integrate your exported model into an application by exploring one of the following articles or samples:

* [Use your Tensorflow model with Python](export-model-python.md)
* [Use your ONNX model with Windows Machine Learning](custom-vision-onnx-windows-ml.md)
* See the sample for [CoreML model in an iOS application](https://go.microsoft.com/fwlink/?linkid=857726) for real-time image classification with Swift.
* See the sample for [Tensorflow model in an Android application](https://github.com/Azure-Samples/cognitive-services-android-customvision-sample) for real-time image classification on Android.
* See the sample for [CoreML model with Xamarin](https://github.com/xamarin/ios-samples/tree/master/ios11/CoreMLAzureModel) for real-time image classification in a Xamarin iOS app.
