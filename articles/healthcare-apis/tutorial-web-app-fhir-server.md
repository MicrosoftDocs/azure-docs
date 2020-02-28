---
title: Web App Tutorial - Set up Azure API for FHIR
description: This tutorial walks through an example of deploying a simple web application. This first tutorial describes the prerequisites and the deployment of the Azure API for FHIR
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: mihansen
ms.author: cavoeg
author: caitlinv39
ms.date: 01/03/2020
---

# Deploy javascript app to read data from FHIR service
In this tutorial, you will deploy a small javascript app, which reads data from a FHIR service. The steps in this tutorial are:
1. Deploy a FHIR server
1. Register a public client application
1. Test access to the application
1. Create a web application that reads this FHIR data

## Prerequisites
Before starting this set of tutorials, you will need the following items:
1. An Azure subscription
1. An Azure Active Directory tenant
1. [Postman](https://www.getpostman.com/) installed

> [!NOTE]
> For this tutorial, the FHIR service, Azure AD application, and Azure AD users are all in the same Azure AD tenant. If this is not the case, you can still follow along with this tutorial, but may need to dive into some of the referenced documents to do additional steps.

## Deploy Azure API for FHIR
The first step in the tutorial is to get your Azure API for FHIR setup correctly.

1. Deploy the [Azure API for FHIR](fhir-paas-portal-quickstart.md)
    1. On the Additional Settings tab, set the **Audience** to https://\<FHIR-SERVER-NAME>.azurehealthcareapis.com.
1. Once you have your Azure API for FHIR deployed, configure the [CORS](configure-cross-origin-resource-sharing.md) settings by going to your Azure API for FHIR and selecting CORS. 
    1. Set **Origins** to *
    1. Set **Headers** to *
    1. Under **Methods**, choose **Select all**
    1. Set the **Max age** to **600**

## Next Steps
Now that you have your Azure API for FHIR deployed, you are ready to register a public client application.

>[!div class="nextstepaction"]
>[Register public client application](tutorial-web-app-public-app-reg.md)
