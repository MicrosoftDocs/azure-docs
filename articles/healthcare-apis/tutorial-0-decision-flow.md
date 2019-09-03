---
title: Tutorial: Decision flow on setting up the environment
description: This tutorial explains how to setup the environment based on scenarios
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 08/01/2019
---

# Tutorial: Decision flow on setting up the environment

There are several configuration options in setting up Azure API for FHIR (PaaS) or FHIR Server for Azure (OSS), and they all come down to:
* Are we using or plan to use Smart on FHIR?
* Are we deploying OSS version or Managed Service (Paas)?
* Is the service deployed in the same Azure subscription as our Azure AD tenant?

**The following is the decision flow when deploying Azure API for FHIR**

<div style="text-align: center"><img src="media/tutorial-0/flow-azure-api-for-fhir.png" width="400" /></div>

**IF you are deploying FHIR Server for Azure (OSS version), then decision flow below**

<div style="text-align: center"><img src="media/tutorial-0/flow-fhir-server-azure.png" width="300" /></div>

## Next steps

IN this tutorial you have gone through decision flow on how to setup Azure AD environment based on the version of FHIR Service you are deploying (PaaS/OSS).

At this point, we are ready to setup your development environment and provision FHIR Service to crete your first Application.

>[!div class="nextstepaction"]
>[Setup development environment and provision service](tutorial-1-setup-environment.md)