---
title: Tutorial Connect to Azure API for FHIR endpoint with application
description: This tutorial shows how to write application that connects to Azure API for FHIR endpoint using Azure AD OAuth2 token.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 08/01/2019
---

# Tutorial: Sample application that Use Azure AD OAuth2 token to access Azure API for FHIR endpoint

After we have setup the environment, created a service endpoint and Azure AD application registration, we are ready to write our first sample application.

Building a sample application utilizing Azure API for FHIR requires two separate steps: 

* Obtaining access token for the service from Azure AD, 
* Using the token to call Azure API for FHIR and obtaining the list of patients.

## Obtaining access token for the service

This step of the process is part of normal Azure AD authentication flow. 

