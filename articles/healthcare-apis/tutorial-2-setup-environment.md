---
title: Develop an Azure API for FHIR sample application
description: Develop a Node.js/JS app that uses Azure AD to connect to an Azure API for FHIR endpoint. The app uploads patient data, and displays the list of patients with details.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Develop an Azure API for FHIR sample application

In this tutorial, we'll use Visual Studio Code to develop a Node.js/JS application. The application uses Azure Active Directory (Azure AD) to connect to an Azure API for Fast Healthcare Interoperability Resources (FHIR) endpoint. The application uploads some patient data in the service, and displays the list of patients with their details.

In this tutorial, you learn how to:

* Register an application in Azure AD.
* Create an Azure API for FHIR endpoint.
* Create an application that connects to Azure AD and gets an access token for the FHIR service.
* Connect the application to the FHIR endpoint by using the Azure AD token.
* View patient data.
* Upload patient data.

For this tutorial, the FHIR service, Azure AD application, and Azure AD users are all in the same Azure subscription.

## Prerequisites

Before beginning this tutorial, you should have the following prerequisites in place:

* An Azure subscription.
* An Azure AD tenant set up with a user.
* [Visual Studio Code](https://code.visualstudio.com/) installed, or any other editor.
* [Node.js and npm](https://nodejs.org/) installed.

## Deploy Azure API for FHIR

First, deploy an instance of Azure API for FHIR in your Azure subscription. You can do this by using [Azure CLI](fhir-paas-cli-quickstart.md), [PowerShell](fhir-paas-powershell-quickstart.md), or the [Azure portal](fhir-paas-portal-quickstart.md).

Then, register a client application in your Azure AD subscription. For more information, see [Register a confidential client application in Azure Active Directory](register-confidential-azure-ad-client-app.md). You'll need this information later, when you develop a client application and connect to your Azure API for FHIR endpoint.

## Test authentication to your endpoint by using Postman

Now, you need to make sure you can access the Azure API for FHIR endpoint, and authenticate against Azure AD to access the endpoint. For more information, see [Tutorial: Access FHIR API with Postman](access-fhir-postman-tutorial.md). 

## Next steps

In this tutorial, you set up the environment, deployed Azure API for FHIR in your subscription, and registered an Azure AD application. You also tested access to the endpoint by using Postman.

Now you're ready to learn how to write your sample application.

>[!div class="nextstepaction"]
>[Write a sample application that connects to Azure API for FHIR endpoint](tutorial-3-connect-to-endpoint.md)