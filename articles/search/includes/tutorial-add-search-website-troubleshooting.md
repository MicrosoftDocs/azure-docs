---
ms.topic: include
ms.date: 07/18/2023
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
---

If the web app didn't deploy or work, use the following list to determine and fix the issue:

* **Did the deployment succeed?** 

    In order to determine if your deployment succeeded, you need to go to _your_ fork of the sample repo and review the success or failure of the GitHub action. There should be only one action and it should have static web app settings for the  `app_location`, `api_location`, and `output_location`. If the action didn't deploy successfully, dive into the action logs and look for the last failure. 

* **Does the client (front-end) application work?**
    
    You should be able to get to your web app and it should successfully display. If the deployment succeeded but the website doesn't display, this may be an issue with how the static web app is configured for rebuilding the app, once it is on Azure. 

* **Does the API (serverless back-end) application work?**

    You should be able to interact with the client app, searching for books and filtering. If the form doesn't return any values, open the browser's developer tools, and determine if the HTTP calls to the API were successful. If the calls weren't successful, the most likely reason if the static web app configurations for the API endpoint name and Search query key are incorrect.

    If the path to the Azure function code (`api_location`) isn't correct in the YML file, the application loads but won't call any of the functions that provide integration with Cognitive Search. Revisit the workaround in the deployment section for help with correcting the path.
