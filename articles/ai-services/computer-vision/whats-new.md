---
title: What's new in Azure AI Vision?
titleSuffix: Azure AI services
description: Stay up to date on recent releases and updates to Azure AI Vision.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: build-2023
ms.topic: whats-new
ms.date: 12/27/2022
ms.author: pafarley
---

# What's new in Azure AI Vision

Learn what's new in the service. These items may be release notes, videos, blog posts, and other types of information. Bookmark this page to stay up to date with new features, enhancements, fixes, and documentation updates.

## September 2023

### Deprecation of outdated Computer Vision API versions

Computer Vision API versions 1.0, 2.0, 3.0, and 3.1 will be retired on September 13, 2026. Developers won’t be able to make API calls to these APIs after that date.
We recommend that all affected customers migrate their workloads to the generally available Computer Vision 3.2 API by following this [QuickStart](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library?tabs=linux%2Cvisual-studio&pivots=programming-language-rest-api) at their earliest convenience. Customers should also consider migrating to [Image Analysis 4.0 API (preview)](/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?tabs=visual-studio%2Clinux&pivots=programming-language-python), which has our latest and greatest Image Analysis capabilities. 

Visit our [Q&A](/answers/tags/127/azure-computer-vision) for any questions.

## May 2023

### Image Analysis 4.0 Product Recognition (public preview)

The Product Recognition APIs let you analyze photos of shelves in a retail store. You can detect the presence and absence of products and get their bounding box coordinates. Use it in combination with model customization to train a model to identify your specific products. You can also compare Product Recognition results to your store's planogram document. [Product Recognition](./concept-shelf-analysis.md).

## April 2023

### Face limited access tokens

Independent software vendors (ISVs) can manage the Face API usage of their clients by issuing access tokens that grant access to Face features which are normally gated. This allows client companies to use the Face API without having to go through the formal approval process. [Use limited access tokens](how-to/identity-access-token.md).

## March 2023

### Azure AI Vision Image Analysis 4.0 SDK public preview

The [Florence foundation model](https://www.microsoft.com/en-us/research/project/projectflorence/) is now integrated into Azure AI Vision. The improved Vision Services enable developers to create market-ready, responsible Azure AI Vision applications across various industries. Customers can now seamlessly digitize, analyze, and connect their data to natural language interactions, unlocking powerful insights from their image and video content to support accessibility, drive acquisition through SEO, protect users from harmful content, enhance security, and improve incident response times. For more information, see [Announcing Microsoft's Florence foundation model](https://aka.ms/florencemodel).

### Image Analysis 4.0 SDK (public preview)

Image Analysis 4.0 is now available through client library SDKs in C#, C++, and Python. This update also includes the Florence-powered image captioning and dense captioning at human parity performance.

### Image Analysis V4.0 Captioning and Dense Captioning (public preview):

"Caption" replaces "Describe" in V4.0 as the significantly improved image captioning feature rich with details and semantic understanding. Dense Captions provides more detail by generating one sentence descriptions of up to 10 regions of the image in addition to describing the whole image. Dense Captions also returns bounding box coordinates of the described image regions. There's also a new gender-neutral parameter to allow customers to choose whether to enable probabilistic gender inference for alt-text and Seeing AI applications. Automatically deliver rich captions, accessible alt-text, SEO optimization, and intelligent photo curation to support digital content. [Image captions](./concept-describe-images-40.md).

### Video summary and frame locator (public preview): 
Search and interact with video content in the same intuitive way you think and write. Locate relevant content without the need for additional metadata. Available only in [Vision Studio](https://aka.ms/VisionStudio).


### Image Analysis 4.0 model customization (public preview)

You can now create and train your own [custom image classification and object detection models](./concept-model-customization.md), using Vision Studio or the v4.0 REST APIs.

### Multi-modal embeddings APIs (public preview)

The [Multi-modal embeddings APIs](./how-to/image-retrieval.md), part of the Image Analysis 4.0 API, enable the _vectorization_ of images and text queries. They let you convert images and text to coordinates in a multi-dimensional vector space. You can now search with natural language and find relevant images using vector similarity search.

### Background removal APIs (public preview)

As part of the Image Analysis 4.0 API, the [Background removal API](./concept-background-removal.md) lets you remove the background of an image. This operation can either output an image of the detected foreground object with a transparent background, or a grayscale alpha matte image showing the opacity of the detected foreground object.

### Azure AI Vision 3.0 & 3.1 previews deprecation

The preview versions of the Azure AI Vision 3.0 and 3.1 APIs are scheduled to be retired on September 30, 2023. Customers won't be able to make any calls to these APIs past this date. Customers are encouraged to migrate their workloads to the generally available (GA) 3.2 API instead. Mind the following changes when migrating from the preview versions to the 3.2 API:
- The [Analyze Image](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) and [Read](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) API calls take an optional _model-version_ parameter that you can use to specify which AI model to use. By default, they will use the latest model.
- The [Analyze Image](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) and [Read](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) API calls also return a `model-version` field in successful API responses. This field reports which model was used.
- Azure AI Vision 3.2 API uses a different error-reporting format. See the [API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) to learn how to adjust any error-handling code.

## October 2022

### Azure AI Vision Image Analysis 4.0 (public preview)

Image Analysis 4.0 has been released in public preview. The new API includes image captioning, image tagging, object detection, smart crops, people detection, and Read OCR functionality, all available through one Analyze Image operation. The OCR is optimized for general, non-document images in a performance-enhanced synchronous API that makes it easier to embed OCR-powered experiences in your workflows.

## September 2022

### Azure AI Vision 3.0/3.1 Read previews deprecation

The preview versions of the Azure AI Vision 3.0 and 3.1 Read API are scheduled to be retired on January 31, 2023. Customers are encouraged to refer to the [How-To](./how-to/call-read-api.md) and [QuickStarts](./quickstarts-sdk/client-library.md?tabs=visual-studio&pivots=programming-language-csharp) to get started with the generally available (GA) version of the Read API instead. The latest GA versions provide the following benefits:
* 2022 latest generally available OCR model
* Significant expansion of OCR language coverage including support for handwritten text
* Significantly improved OCR quality 

## June 2022

### Vision Studio launch

Vision Studio is UI tool that lets you explore, build, and integrate features from Azure AI Vision into your applications.

Vision Studio provides you with a platform to try several service features, and see what they return in a visual manner. Using the Studio, you can get started without needing to write code, and then use the available client libraries and REST APIs in your application.

### Responsible AI for Face

#### Face transparency documentation
* The [transparency documentation](https://aka.ms/faceraidocs) provides guidance to assist our customers to improve the accuracy and fairness of their systems by incorporating meaningful human review to detect and resolve cases of misidentification or other failures, providing support to people who believe their results were incorrect, and identifying and addressing fluctuations in accuracy due to variations in operational conditions.

#### Retirement of sensitive attributes

* We have retired facial analysis capabilities that purport to infer emotional states and identity attributes, such as gender, age, smile, facial hair, hair and makeup. 
* Facial detection capabilities, (including detecting blur, exposure, glasses, headpose, landmarks, noise, occlusion, facial bounding box) will remain generally available and do not require an application.

#### Fairlearn package and Microsoft's Fairness Dashboard

* [The open-source Fairlearn package and Microsoft’s Fairness Dashboard](https://github.com/microsoft/responsible-ai-toolbox/tree/main/notebooks/cognitive-services-examples/face-verification) aims to support customers to measure the fairness of Microsoft's facial verification algorithms on their own data, allowing them to identify and address potential fairness issues that could affect different demographic groups before they deploy their technology.

#### Limited Access policy

* As a part of aligning Face to the updated Responsible AI Standard, a new [Limited Access policy](https://aka.ms/AAh91ff) has been implemented for the Face API and Azure AI Vision. Existing customers have one year to apply and receive approval for continued access to the facial recognition services based on their provided use cases. See details on Limited Access for Face [here](/legal/cognitive-services/computer-vision/limited-access-identity?context=/azure/ai-services/computer-vision/context/context) and for Azure AI Vision [here](/legal/cognitive-services/computer-vision/limited-access?context=/azure/ai-services/computer-vision/context/context).

### Azure AI Vision 3.2-preview deprecation

The preview versions of the 3.2 API are scheduled to be retired in December of 2022. Customers are encouraged to use the generally available (GA) version of the API instead. Mind the following changes when migrating from the 3.2-preview versions:
1. The [Analyze Image](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) and [Read](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) API calls now take an optional _model-version_ parameter that you can use to specify which AI model to use. By default, they will use the latest model.
1. The [Analyze Image](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) and [Read](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005) API calls also return a `model-version` field in successful API responses. This field reports which model was used.
1. Image Analysis APIs now use a different error-reporting format. See the [API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) to learn how to adjust any error-handling code.

## May 2022

### OCR (Read) API model is generally available (GA)

Azure AI Vision's [OCR (Read) API](overview-ocr.md) latest model with [164 supported languages](language-support.md) is now generally available as a cloud service and container.

* OCR support for print text expands to 164 languages including Russian, Arabic, Hindi and other languages using Cyrillic, Arabic, and Devanagari scripts.
* OCR support for handwritten text expands to 9 languages with English, Chinese Simplified, French, German, Italian, Japanese, Korean, Portuguese, and Spanish.
* Enhanced support for single characters, handwritten dates, amounts, names, other entities commonly found in receipts and invoices.
* Improved processing of digital PDF documents.
* Input file size limit increased 10x to 500 MB.
* Performance and latency improvements.
* Available as [cloud service](overview-ocr.md) and [Docker container](computer-vision-how-to-install-containers.md).

See the [OCR how-to guide](how-to/call-read-api.md#determine-how-to-process-the-data-optional) to learn how to use the GA model.

> [!div class="nextstepaction"]
> [Get Started with the Read API](./quickstarts-sdk/client-library.md)

## February 2022

### OCR (Read) API Public Preview supports 164 languages

Azure AI Vision's [OCR (Read) API](overview-ocr.md) expands [supported languages](language-support.md) to 164 with its latest preview:

* OCR support for print text expands to 42 new languages including Arabic, Hindi and other languages using Arabic and Devanagari scripts.
* OCR support for handwritten text expands to Japanese and Korean in addition to English, Chinese Simplified, French, German, Italian, Portuguese, and Spanish.
* Enhancements including better support for extracting handwritten dates, amounts, names, and single character boxes.
* General performance and AI quality improvements

See the [OCR how-to guide](how-to/call-read-api.md#determine-how-to-process-the-data-optional) to learn how to use the new preview features.

> [!div class="nextstepaction"]
> [Get Started with the Read API](./quickstarts-sdk/client-library.md)

### New Quality Attribute in Detection_01 and Detection_03
* To help system builders and their customers capture high quality images which are necessary for high quality outputs from Face API, we’re introducing a new quality attribute **QualityForRecognition** to help decide whether an image is of sufficient quality to attempt face recognition. The value is an informal rating of low, medium, or high. The new attribute is only available when using any combinations of detection models `detection_01` or `detection_03`, and recognition models `recognition_03` or `recognition_04`. Only "high" quality images are recommended for person enrollment and quality above "medium" is recommended for identification scenarios. To learn more about the new quality attribute, see [Face detection and attributes](concept-face-detection.md) and see how to use it with [QuickStart](./quickstarts-sdk/identity-client-library.md?pivots=programming-language-csharp&tabs=visual-studio).

## September 2021

### OCR (Read) API Public Preview supports 122 languages

Azure AI Vision's [OCR (Read) API](overview-ocr.md) expands [supported languages](language-support.md) to 122 with its latest preview:

* OCR support for print text in 49 new languages including Russian, Bulgarian, and other Cyrillic and more Latin languages.
* OCR support for handwritten text in 6 new languages that include English, Chinese Simplified, French, German, Italian, Portuguese, and Spanish.
* Enhancements for processing digital PDFs and Machine Readable Zone (MRZ) text in identity documents.
* General performance and AI quality improvements

See the [OCR how-to guide](how-to/call-read-api.md#determine-how-to-process-the-data-optional) to learn how to use the new preview features.

> [!div class="nextstepaction"]
> [Get Started with the Read API](./quickstarts-sdk/client-library.md)

## August 2021

### Image tagging language expansion

The [latest version (v3.2)](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f200) of the Image tagger now supports tags in 50 languages. See the [language support](language-support.md) page for more information.

## July 2021

### New HeadPose and Landmarks improvements for Detection_03

* The Detection_03 model has been updated to support facial landmarks.
* The landmarks feature in Detection_03 is much more precise, especially in the eyeball landmarks which are crucial for gaze tracking.

## May 2021

### Spatial Analysis container update

A new version of the [Spatial Analysis container](spatial-analysis-container.md) has been released with a new feature set. This Docker container lets you analyze real-time streaming video to understand spatial relationships between people and their movement through physical environments.

* [Spatial Analysis operations](spatial-analysis-operations.md) can be now configured to detect the orientation that a person is facing.
  * An orientation classifier can be enabled for the `personcrossingline` and `personcrossingpolygon` operations by configuring the `enable_orientation` parameter. It is set to off by default.

* [Spatial Analysis operations](spatial-analysis-operations.md) now also offers configuration to detect a person's speed while walking/running
  * Speed can be detected for the `personcrossingline` and `personcrossingpolygon` operations by turning on the `enable_speed` classifier, which is off by default. The output is reflected in the `speed`, `avgSpeed`, and `minSpeed` outputs.

## April 2021

### Azure AI Vision v3.2 GA

The Azure AI Vision API v3.2 is now generally available with the following updates:

* Improved image tagging model: analyzes visual content and generates relevant tags based on objects, actions, and content displayed in the image. This model is available through the [Tag Image API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f200). See the Image Analysis [how-to guide](./how-to/call-analyze-image.md) and [overview](./overview-image-analysis.md) to learn more.
* Updated content moderation model: detects presence of adult content and provides flags to filter images containing adult, racy, and gory visual content. This model is available through the [Analyze API](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b). See the Image Analysis [how-to guide](./how-to/call-analyze-image.md) and [overview](./overview-image-analysis.md) to learn more.
* [OCR (Read) available for 73 languages](./language-support.md#optical-character-recognition-ocr) including Simplified and Traditional Chinese, Japanese, Korean, and Latin languages.
* [OCR (Read)](./overview-ocr.md) also available as a [Distroless container](./computer-vision-how-to-install-containers.md?tabs=version-3-2) for on-premises deployment.

> [!div class="nextstepaction"]
> [See Azure AI Vision v3.2 GA](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005)

### PersonDirectory data structure (preview)

* In order to perform face recognition operations such as Identify and Find Similar, Face API customers need to create an assorted list of **Person** objects. The new **PersonDirectory** is a data structure that contains unique IDs, optional name strings, and optional user metadata strings for each **Person** identity added to the directory. Currently, the Face API offers the **LargePersonGroup** structure which has similar functionality but is limited to 1 million identities. The **PersonDirectory** structure can scale up to 75 million identities.
* Another major difference between **PersonDirectory** and previous data structures is that you'll no longer need to make any Train calls after adding faces to a **Person** object&mdash;the update process happens automatically. For more details see [Use the PersonDirectory structure](how-to/use-persondirectory.md).

## March 2021

### Azure AI Vision 3.2 Public Preview update

The Azure AI Vision API v3.2 public preview has been updated. The preview release has all Azure AI Vision features along with updated Read and Analyze APIs.

> [!div class="nextstepaction"]
> [See Azure AI Vision v3.2 public preview 3](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005)

## February 2021

### Read API v3.2 Public Preview with OCR support for 73 languages

The Azure AI Vision Read API v3.2 public preview, available as cloud service and Docker container, includes these updates:

* [OCR for 73 languages](./language-support.md#optical-character-recognition-ocr) including Simplified and Traditional Chinese, Japanese, Korean, and Latin languages.
* Natural reading order for the text line output (Latin languages only)
* Handwriting style classification for text lines along with a confidence score (Latin languages only).
* Extract text only for selected pages for a multi-page document.
* Available as a [Distroless container](./computer-vision-how-to-install-containers.md?tabs=version-3-2) for on-premises deployment.

See the [Read API how-to guide](how-to/call-read-api.md) to learn more.

> [!div class="nextstepaction"]
> [Use the Read API v3.2 Public Preview](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005)


### New Face API detection model
* The new Detection 03 model is the most accurate detection model currently available. If you're a new customer, we recommend using this model. Detection 03 improves both recall and precision on smaller faces found within images (64x64 pixels). Additional improvements include an overall reduction in false positives and improved detection on rotated face orientations. Combining Detection 03 with the new Recognition 04 model will provide improved recognition accuracy as well. See [Specify a face detection model](./how-to/specify-detection-model.md) for more details.
### New detectable Face attributes
* The `faceMask` attribute is available with the latest Detection 03 model, along with the additional attribute `"noseAndMouthCovered"` which detects whether the face mask is worn as intended, covering both the nose and mouth. To use the latest mask detection capability, users need to specify the detection model in the API request: assign the model version with the _detectionModel_ parameter to `detection_03`. See [Specify a face detection model](./how-to/specify-detection-model.md) for more details.
### New Face API Recognition Model
* The new Recognition 04 model is the most accurate recognition model currently available. If you're a new customer, we recommend using this model for verification and identification. It improves upon the accuracy of Recognition 03, including improved recognition for users wearing face covers (surgical masks, N95 masks, cloth masks). Note that we recommend against enrolling images of users wearing face covers as this will lower recognition quality. Now customers can build safe and seamless user experiences that detect whether a user is wearing a face cover with the latest Detection 03 model, and recognize them with the latest Recognition 04 model. See [Specify a face recognition model](./how-to/specify-recognition-model.md) for more details.

## January 2021

### Spatial Analysis container update

A new version of the [Spatial Analysis container](spatial-analysis-container.md) has been released with a new feature set. This Docker container lets you analyze real-time streaming video to understand spatial relationships between people and their movement through physical environments.

* [Spatial Analysis operations](spatial-analysis-operations.md) can be now configured to detect if a person is wearing a protective face covering such as a mask.
  * A mask classifier can be enabled for the `personcount`, `personcrossingline` and `personcrossingpolygon` operations by configuring the `ENABLE_FACE_MASK_CLASSIFIER` parameter.
  * The attributes `face_mask` and `face_noMask` will be returned as metadata with confidence score for each person detected in the video stream
* The *personcrossingpolygon* operation has been extended to allow the calculation of the dwell time a person spends in a zone. You can set the `type` parameter in the Zone configuration for the operation to `zonedwelltime` and a new event of type *personZoneDwellTimeEvent* will include the `durationMs` field populated with the number of milliseconds that the person spent in the zone.
* **Breaking change**: The *personZoneEvent* event has been renamed to *personZoneEnterExitEvent*. This event is raised by the *personcrossingpolygon* operation when a person enters or exits the zone and provides directional info with the numbered side of the zone that was crossed.
* Video URL can be provided as "Private Parameter/obfuscated" in all operations. Obfuscation is optional now and it will only work if `KEY` and `IV` are provided as environment variables.
* Calibration is enabled by default for all operations. Set the `do_calibration: false` to disable it.
* Added support for auto recalibration (by default disabled) via the `enable_recalibration` parameter, please refer to [Spatial Analysis operations](./spatial-analysis-operations.md) for details
* Camera calibration parameters to the `DETECTOR_NODE_CONFIG`. Refer to [Spatial Analysis operations](./spatial-analysis-operations.md) for details.

### Mitigate latency
* The Face team published a new article detailing potential causes of latency when using the service and possible mitigation strategies. See [Mitigate latency when using the Face service](./how-to/mitigate-latency.md).

## December 2020
### Customer configuration for Face ID storage
* While the Face Service does not store customer images, the extracted face feature(s) will be stored on server. The Face ID is an identifier of the face feature and will be used in [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a), and [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237). The stored face features will expire and be deleted 24 hours after the original detection call. Customers can now determine the length of time these Face IDs are cached. The maximum value is still up to 24 hours, but a minimum value of 60 seconds can now be set. The new time ranges for Face IDs being cached is any value between 60 seconds and 24 hours. More details can be found in the [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) API reference (the *faceIdTimeToLive* parameter).

## November 2020
### Sample Face enrollment app
* The team published a sample Face enrollment app to demonstrate best practices for establishing meaningful consent and creating high-accuracy face recognition systems through high-quality enrollments. The open-source sample can be found in the [Build an enrollment app](Tutorials/build-enrollment-app.md) guide and on [GitHub](https://github.com/Azure-Samples/cognitive-services-FaceAPIEnrollmentSample), ready for developers to deploy or customize.

## October 2020

### Azure AI Vision API v3.1 GA

The Azure AI Vision API in General Availability has been upgraded to v3.1.

## September 2020

### Spatial Analysis container preview

The [Spatial Analysis container](spatial-analysis-container.md) is now in preview. The Spatial Analysis feature of Azure AI Vision lets you analyze real-time streaming video to understand spatial relationships between people and their movement through physical environments. Spatial Analysis is a Docker container you can use on-premises.

### Read API v3.1 Public Preview adds OCR for Japanese

The Azure AI Vision Read API v3.1 public preview adds these capabilities:

* OCR for Japanese language
* For each text line, indicate whether the appearance is Handwriting or Print style, along with a confidence score (Latin languages only).
* For a multi-page document extract text only for selected pages or page range.

* This preview version of the Read API supports English, Dutch, French, German, Italian, Japanese, Portuguese, Simplified Chinese, and Spanish languages.

See the [Read API how-to guide](how-to/call-read-api.md) to learn more.

> [!div class="nextstepaction"]
> [Learn more about Read API v3.1 Public Preview 2](https://westus2.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-preview-2/operations/5d986960601faab4bf452005)

## August 2020
### Customer-managed encryption of data at rest
* The Face service automatically encrypts your data when persisting it to the cloud. The Face service encryption protects your data to help you meet your organizational security and compliance commitments. By default, your subscription uses Microsoft-managed encryption keys. There is also a new option to manage your subscription with your own keys called customer-managed keys (CMK). More details can be found at [Customer-managed keys](./identity-encrypt-data-at-rest.md).

## July 2020

### Read API v3.1 Public Preview with OCR for Simplified Chinese

The Azure AI Vision Read API v3.1 public preview adds support for Simplified Chinese.

* This preview version of the Read API supports English, Dutch, French, German, Italian, Portuguese, Simplified Chinese, and Spanish languages.

See the [Read API how-to guide](how-to/call-read-api.md) to learn more.

> [!div class="nextstepaction"]
> [Learn more about Read API v3.1 Public Preview 1](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-1-preview-1/operations/5d986960601faab4bf452005)

## May 2020

Azure AI Vision API v3.0 entered General Availability, with updates to the Read API:

* Support for English, Dutch, French, German, Italian, Portuguese, and Spanish
* Improved accuracy
* Confidence score for each extracted word
* New output format

See the [OCR overview](overview-ocr.md) to learn more.

## April 2020
### New Face API Recognition Model
* The new recognition 03 model is the most accurate model currently available. If you're a new customer, we recommend using this model. Recognition 03 will provide improved accuracy for both similarity comparisons and person-matching comparisons. More details can be found at [Specify a face recognition model](./how-to/specify-recognition-model.md).

## March 2020

* TLS 1.2 is now enforced for all HTTP requests to this service. For more information, see [Azure AI services security](../security-features.md).

## January 2020

### Read API 3.0 Public Preview

You now can use version 3.0 of the Read API to extract printed or handwritten text from images. Compared to earlier versions, 3.0 provides:

* Improved accuracy
* New output format
* Confidence score for each extracted word
* Support for both Spanish and English languages with the language parameter

Follow an [Extract text quickstart](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ComputerVision/REST/CSharp-hand-text.md?tabs=version-3) to get starting using the 3.0 API.


## June 2019

### New Face API detection model
* The new Detection 02 model features improved accuracy on small, side-view, occluded, and blurry faces. Use it through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42) by specifying the new face detection model name `detection_02` in `detectionModel` parameter. More details in [How to specify a detection model](how-to/specify-detection-model.md).

## April 2019

### Improved attribute accuracy
* Improved overall accuracy of the `age` and `headPose` attributes. The `headPose` attribute is also updated with the `pitch` value enabled now. Use these attributes by specifying them in the `returnFaceAttributes` parameter of [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.
### Improved processing speeds
* Improved speeds of [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42) operations.

## March 2019

### New Face API recognition model
* The Recognition 02 model has improved accuracy. Use it through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039524b), [LargeFaceList - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc), [PersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395244) and [LargePersonGroup - Create](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d) by specifying the new face recognition model name `recognition_02` in `recognitionModel` parameter. More details in [How to specify a recognition model](how-to/specify-recognition-model.md).

## January 2019

### Face Snapshot feature
* This feature allows the service to support data migration across subscriptions: [Snapshot](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/snapshot-get). More details in [How to Migrate your face data to a different Face subscription](how-to/migrate-face-data.md).

## October 2018

### API messages
* Refined description for `status`, `createdDateTime`, `lastActionDateTime`, and `lastSuccessfulTrainingDateTime` in [PersonGroup - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395247), [LargePersonGroup - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599ae32c6ac60f11b48b5aa5), and [LargeFaceList - Get Training Status](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a1582f8d2de3616c086f2cf).

## May 2018

### Improved attribute accuracy
* Improved `gender` attribute significantly and also improved `age`, `glasses`, `facialHair`, `hair`, `makeup` attributes. Use them through [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.
### Increased file size limit
* Increased input image file size limit from 4 MB to 6 MB in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250), [LargeFaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a158c10d2de3616c086f2d3), [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) and [LargePersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599adf2a3a7b9412a4d53f42).

## March 2018

### New data structure
* [LargeFaceList](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/5a157b68d2de3616c086f2cc) and [LargePersonGroup](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/599acdee6ac60f11b48b5a9d). More details in [How to use the large-scale feature](how-to/use-large-scale.md).
* Increased [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239) `maxNumOfCandidatesReturned` parameter from [1, 5] to [1, 100] and default to 10.

## May 2017

### New detectable Face attributes
* Added `hair`, `makeup`, `accessory`, `occlusion`, `blur`, `exposure`, and `noise` attributes in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.
* Supported 10K persons in a PersonGroup and [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).
* Supported pagination in [PersonGroup Person - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395241) with optional parameters: `start` and `top`.
* Supported concurrency in adding/deleting faces against different FaceLists and different persons in PersonGroup.

## March 2017

### New detectable Face attribute
* Added `emotion` attribute in [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) `returnFaceAttributes` parameter.
### Fixed issues
* Face could not be re-detected with rectangle returned from [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) as `targetFace` in [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).
* The detectable face size is set to ensure it is strictly between 36x36 to 4096x4096 pixels.

## November 2016
### New subscription tier
* Added Face Storage Standard subscription to store additional persisted faces when using [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b) or [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) for identification or similarity matching. The stored images are charged at $0.5 per 1000 faces and this rate is prorated on a daily basis. Free tier subscriptions continue to be limited to 1,000 total persons.

## October 2016
### API messages
* Changed the error message of more than one face in the `targetFace` from 'There are more than one face in the image' to 'There is more than one face in the image' in [FaceList - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395250) and [PersonGroup Person - Add Face](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523b).

## July 2016
### New features
* Supported Face to Person object authentication in [Face - Verify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f3039523a).
* Added optional `mode` parameter enabling selection of two working modes: `matchPerson` and `matchFace` in [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) and default is `matchPerson`.
* Added optional `confidenceThreshold` parameter for user to set the threshold of whether one face belongs to a Person object in [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239).
* Added optional `start` and `top` parameters in [PersonGroup - List](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395248) to enable user to specify the start point and the total PersonGroups number to list.

## V1.0 changes from V0

* Updated service root endpoint from ```https://westus.api.cognitive.microsoft.com/face/v0/``` to ```https://westus.api.cognitive.microsoft.com/face/v1.0/```. Changes applied to:
 [Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236), [Face - Identify](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395239), [Face - Find Similar](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395237) and [Face - Group](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395238).
* Updated the minimal detectable face size to 36x36 pixels. Faces smaller than 36x36 pixels will not be detected.
* Deprecated the PersonGroup and Person data in Face V0. Those data cannot be accessed with the Face V1.0 service.
* Deprecated the V0 endpoint of Face API on June 30, 2016.


## Azure AI services updates

[Azure update announcements for Azure AI services](https://azure.microsoft.com/updates/?product=cognitive-services)
