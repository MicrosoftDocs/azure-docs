---
title: Web App Tutorial - Set up Azure API for FHIR
description: This tutorial walks through an example of deploying a simple web application. This first tutorial describes the prerequisites and the deployment of the Azure API for FHIR
services: healthcare-apis
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: tutorial
ms.author: kesheth
author: expekesheth
ms.date: 09/27/2023
ms.custom: devx-track-js

---

# Deploy a JavaScript app to read data from Azure API for FHIR

[!INCLUDE[retirement banner](../includes/healthcare-apis-azure-api-fhir-retirement.md)]

In this tutorial, you deploy a small JavaScript app which reads data from a FHIR service. The steps in this tutorial are:

1. Deploy a FHIR server
1. Register a public client application
1. Create a web application that reads this FHIR data

## Prerequisites

You need the following before starting this set of tutorials.
1. An Azure subscription
1. A Microsoft Entra tenant


> [!NOTE]
> For this tutorial, the FHIR service, Microsoft Entra application, and Microsoft Entra users are all in the same Microsoft Entra tenant. If this is not the case, you can still follow along with this tutorial, but may need to dive into some of the referenced documents to do additional steps.

## Deploy Azure API for FHIR

The first step in the tutorial is to get your Azure API for FHIR setup correctly.

1. If you haven't already, deploy the [Azure API for FHIR](fhir-paas-portal-quickstart.md).
1. Once you have your Azure API for FHIR deployed, configure the [CORS](configure-cross-origin-resource-sharing.md) settings by going to your Azure API for FHIR and selecting CORS. 
    1. Set **Origins** to *
    1. Set **Headers** to *
    1. Under **Methods**, choose **Select all**
    1. Set the **Max age** to **600**

## Next Steps

Now that you have your Azure API for FHIR deployed, you're ready to register a public client application. For more information, see

>[!div class="nextstepaction"]
>[Register public client application](tutorial-web-app-public-app-reg.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]