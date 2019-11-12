---
title: 'Tutorial: Develop an Azure API for FHIR sample application'
description: Develop a Node.js/JS app that uses Azure AD to connect to Azure API for FHIR endpoint, uploads patient data, and displays the list of patients with details.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Develop Azure API for FHIR sample application

In this tutorial, we will use Visual Studio Code to develop a Node.js/JS application that uses Azure AD to connect to Azure API for FHIR endpoint, uploads some patient data in the service, and displays the list of patients with their details.

In this tutorial you will learn how to:

* Register Application in Azure AD
* Create Azure API for FHIR endpoint
* Create application that connects to Azure AD and gets access token for the FHIR service
* Connect the application to FHIR endpoint using the Azure AD token
* View patient data
* Upload patient data

## Prerequisites

Before beginning this tutorial, you should have the following prerequisites in place:

* Azure subscription
* Azure Active Directory tenant setup with a user
* [Visual Studio Code](https://code.visualstudio.com/) installed or any other editor.
* [Node.js and npm](https://nodejs.org/) installed on computer

## Scenario architecture

In this scenario we assume that the FHIR service, Azure AD application, and Azure AD users are all in the same Azure     subscription.

If you are not using the same Azure AD tenant to secure access to Azure subscript and FHIR server, then we need to make few additional steps. Refer to FAQ at the end of the tutorial on different configuration options.

## Deploy Azure API for FHIR

First thing we will do is deploy an instance of Azure API for FHIR in our Azure subscription. We can do this using [CLI](fhir-paas-cli-quickstart.md), [PowerShell](fhir-paas-powershell-quickstart.md), or [Azure portal](fhir-paas-portal-quickstart.md).

## Register application in Azure AD

Follow the instructions in [Register a confidential client application in Azure Active Directory](register-confidential-azure-ad-client-app.md) to register Client application in your Azure AD subscription. Later in next tutorials when we develop a client application, we will use this information to connect to our Azure API for FHIR endpoint.

## Testing authentication to your endpoint using Postman

Follow the instructions in [Tutorial: Access FHIR API with Postman](access-fhir-postman-tutorial.md) to make sure you can access the Azure API for FHIR endpoint and authenticate against Azure AD to access the endpoint.

## Next steps

In this tutorial, you have setup the environment, deployed Azure API for FHIR in your subscription and registered Azure AD application. You also tested access to the endpoint using Postman.

At this point, we are ready to write our sample application that connects to Azure API endpoint and browses the list of patients.

>[!div class="nextstepaction"]
>[Write a sample application that connects to Azure PAI for FHIR endpoint](tutorial-3-connect-to-endpoint.md)