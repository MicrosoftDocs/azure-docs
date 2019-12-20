---
title: Getting started with Azure API for FHIR
description: Goes through initial requirements for the Azure API for FHIR
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Getting started with Azure API for FHIR

In this tutorial, we will cover some of the initial items to get started with the Azure API for FHIR.

## Prerequisites
Before beginning this set of tutorials, you should have the following in place:

* An Azure subscription
* An Azure AD tenant set up with a user
* An Azure resource group
* [Visual Studio Code](https://code.visualstudio.com/) installed, or any other editor
* [Node.js and npm](https://nodejs.org/) installed

As you walk through the next set of tutorials, you'll use Visual Studio Code to develop a Node.js/JS application. The application uses Azure Active Directory (Azure AD) to connect to an Azure API for FHIR endpoint. The application uploads some patient data in the service, and displays the list of patients with their details.

In the following pages, you will learn how to:

* Register an application in Azure AD
* Configure Azure API for FHIR settings
* Create an Azure API for FHIR endpoint
* Create an application that connects to Azure AD and gets an access token for the FHIR service.
* Connect the application to the FHIR endpoint by using the Azure AD token

For this tutorial, the FHIR service, Azure AD application, and Azure AD users are all in the same Azure subscription.

## Next steps

In this tutorial, you set up all the prerequisites for the Azure API for FHIR.

Now you're ready to learn about application registration.

>[!div class="nextstepaction"]
>[Setup application registration configuration](tutorial-1-decision-flow.md)
