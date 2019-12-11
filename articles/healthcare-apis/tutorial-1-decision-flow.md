---
title: Register the applications for Azure API for FHIR
description: This tutorial explains which applications need to be registered for Azure API for FHIR and FHIR Server for Azure.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Register the applications for Azure API for FHIR

You have several configuration options to choose from when you're setting up the environment for Azure API for Fast Healthcare Interoperability Resources (FHIR), or FHIR Server for Azure. You need to ask yourself the following questions:
* Are you using or planning to use SMART on FHIR?
* Are you deploying the managed service version (platform as a service), or the open source software (OSS) version?
* Are you using the same Azure Active Directory (Azure AD) tenant to secure access to the Azure subscription and FHIR server?

## Decision flow for Azure API for FHIR and FHIR server for Azure 

If you're using Azure API for FHIR (the managed service), use the decision flow shown in the following flowchart:

![Flowchart showing the Azure API for FHIR decision flow](media/tutorial-0/flow-azure-api-for-fhir.png "Azure API for FHIR flow")

If you're deploying FHIR Server for Azure (the OSS version), use this decision flow:

![Flowchart showing the FHIR Server for Azure decision flow](media/tutorial-0/flow-fhir-server-azure.png "FHIR Server for Azure")

## Next steps

In this tutorial, you've gone through the decision flow on how to register applications based on the version of the FHIR service you're deploying.

Based on the decisions you made above, please see the how-to-guides to register your applications

* [Register a resource application](register-resource-azure-ad-client-app.md)
* [Register a confidential client application](register-confidential-azure-ad-client-app.md)
* [Register a public client application](register-public-azure-ad-client-app.md)

Once this is complete, you can deploy the Azure API for FHIR.

>[!div class="nextstepaction"]
>[Deploy Azure API for FHIR](fhir-paas-powershell-quickstart.md)