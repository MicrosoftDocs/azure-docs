---
title: Set up the environment for Azure API
description: This tutorial explains how to set up the environment for Azure API for FHIR and FHIR Server for Azure.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Set up the environment for Azure API

You have several configuration options to choose from when you're setting up the environment for Azure API for Fast Healthcare Interoperability Resources (FHIR), or FHIR Server for Azure. You need to ask yourself the following questions:
* Are you using or planning to use SMART on FHIR?
* Are you deploying the open source software (OSS) version, or the managed service version (platform as a service)?
* Are you using the same Azure Active Directory (Azure AD) tenant to secure access to the Azure subscript and FHIR server?

## Decision flow for Azure API for FHIR and FHIR server for Azure 

If you're using Azure API for FHIR (the managed service), use the decision flow shown in the following flowchart:

![Flowchart showing the Azure API for FHIR decision flow](media/tutorial-0/flow-azure-api-for-fhir.png "Azure API for FHIR flow")

If you're deploying FHIR Server for Azure (the OSS version), use this simpler decision flow:

![Flowchart showing the FHIR Server for Azure decision flow](media/tutorial-0/flow-fhir-server-azure.png "FHIR Server for Azure")

## Next steps

In this tutorial, you've gone through the decision flow on how to set up Azure AD environment based on the version of the FHIR service you're deploying.

You can now set up the development environment, and provision the FHIR service to create the first application.

>[!div class="nextstepaction"]
>[Set up development environment and provision service](tutorial-2-setup-environment.md)