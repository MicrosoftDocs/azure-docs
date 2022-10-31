---
ms.topic: include
ms.date: 10/26/2022
---

If the web app didn't deploy or work, use the following list to determine and fix the issue:

1. **Did the deployment succeed?** 

    In order to determine if your deployment succeeded, you need to go to _your_ fork of the sample repo and review the success or failure of the GitHub action. There should be only 1 action and it should have Static web app settings for the  `app_location`, `api_location`, and `output_location`. If the action didn't deploy successfully, dive into the action logs and look for the last failure. 

1. **Does the client (front-end) application work?**
    
    You should be able to get to your web app and it should successfully display. If the deployment succeeded but the website doesn't display, this may be an issue with how the Static web app is configured for rebuilding the app, once it is on Azure.

1. **Does the API (serverless back-end) application work?**

    You should be able to interact with the client app, searching for books and filtering. If the form doesn't return any values, open the browser's developer tools, and determine if the HTTP calls to the API were successful. If the calls weren't successful, the most likely reason if the Static web app configurations for the API endpoint name and Search query key are incorrect. 