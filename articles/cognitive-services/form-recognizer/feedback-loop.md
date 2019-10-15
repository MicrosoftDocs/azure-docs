---
title: "How to use the Feedback Loop feature - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to use custom training on your Form Recognizer custom models.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: pafarley

---

# What is Form Recognizer Feedback Loop?

Form Recognizer allows you to train a model using five filled-in forms or an empty form and two filled-in forms. The Form Recognizer Feedback Loop enables you to use manual input to improve the model accuracy and work on complex forms and forms containing values without keys. You can call Form Recognizer Feedback Loop by using a simple REST API to reduce complexity and easily integrate it into your workflow or application. To get started, you will need just 10 filled-in form documents.

> [!CAUTION]
> As this feature is still under development API, inputs and outputs are not final and might change. Preview features are available for testing and experimentation with the goal of gathering feedback and are subject to change. We strongly advise against using preview APIs in production applications.

## How it works

Form Recognizer Feedback Loop uses the new document Layout OCR to detect and extract printed and handwritten text from the forms and learns which values to extract from the forms. (and human input? TBD)

## Where do I start?

**Step 1:** Create a Form Recognizer resource in the Azure portal.

**Step 2:** [Deploy the Form Recognizer Feedback Loop contaniers](Install-Container.md)

**Step 3:** [Label forms, train and analyze forms using the Form Recognizer Sample UX](sampleUX-label-train-analyze.md)
Click here to access the Sample UX on your container [Form Recognizer Sample UX](http://localhost:3005)

**Step 4:** Follow a quickstart to use the REST API [Quickstart: Train a Form Recognizer model and extract form data by using the REST API with Python](fl-python-quickstart.md)

**Step 5:** Review the REST APIs

**Step 6:** Provide us feedback - e-mail Form Recognizer Contact Us (formrecog_contact@microsoft.com)

You use the following APIs to train and extract structured data from forms.

|||
|---|---|
| asyncTrain Model| Train a new model to analyze your forms by using the feedback loop and 10 forms of the same type. |
| asyncAnalyze Form |Analyze a single document passed in as a stream to extract key/value pairs and tables from the form with your custom model.  |

Explore the [REST API on your Form Recognizer Feedback Loop container](http://localhost:5005/swagger) to learn more. 

## Preview limits
Note that you are a very early adopter of this technology, and we are still working on it. We know there are a few known issues, and some aspects of the service that could be tuned a bit – but we promise to work with you to make things work. If something does not feel quite right, please don’t hesitate to reach out to us. At this stage it is ok to overcommunicate. 

**Please bear with us – and most importantly, provide us feedback!**

## Data privacy and security
The service is offered as a [Preview](https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fsupport%2Flegal%2Fpreview-supplemental-terms%2F&data=02%7C01%7Cnetahw%40microsoft.com%7Ca55f59d59a19431c0c6508d6a3400702%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636875892739236765&sdata=5mPQjNiafpEUHY543a2A4EeOSNEG%2BFh3fauU%2FYiHLmw%3D&reserved=0) of an Azure Service under the [Online Service Terms](https://emea01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fwww.microsoftvolumelicensing.com%2FDocumentSearch.aspx%3FMode%3D3%26DocumentTypeId%3D31&data=02%7C01%7Cnetahw%40microsoft.com%7Ca55f59d59a19431c0c6508d6a3400702%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636875892739236765&sdata=SOxjy9geYHP1KD4G1yilSidzVcHX7WLMmK1oG9rcoVM%3D&reserved=0). You will retain ownership of your data and we only use it to provide the Online Services as explained in your agreement:  

### Processing of customer data; ownership
Customer Data will be used or otherwise processed only to provide Customer the Online Services including purposes compatible with providing those services. Microsoft will not use or otherwise process Customer Data or derive information from it for any advertising or similar commercial purposes. As between the parties, Customer retains all right, title and interest in and to Customer Data. Microsoft acquires no rights in Customer Data, other than the rights Customer grants to Microsoft to provide the Online Services to Customer. 

As with all the Cognitive Services, developers using the Form Understanding service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Now that you've learned how to build a training data set, follow a quickstart to train a custom Form Recognizer model and start using it on your forms.

* [Quickstart: Train a model and extract form data by using cURL](./quickstarts/curl-train-extract.md)
* [Quickstart: Train a model and extract form data using the REST API with Python](./quickstarts/python-train-extract.md)

