---
title: Tutorial Decision flow on setting up the environment
description: This tutorial explains how to setup the environment based on scenarios
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Decision flow on setting up the environment

There are several configuration options in setting up Azure API for FHIR (PaaS) or FHIR Server for Azure (OSS), and they all come down to:
* Are we using or plan to use Smart on FHIR?
* Are we deploying OSS version or Managed Service (PaaS)?
* Are you using the same Azure AD tenant to secure access to Azure subscript and FHIR server?

**If you are deploying Azure API for FHIR**

<div style="text-align: center"><img src="media/tutorial-0/flow-azure-api-for-fhir.png" width="400" /></div>

**If you are deploying FHIR Server for Azure (OSS version)**

<div style="text-align: center"><img src="media/tutorial-0/flow-fhir-server-azure.png" width="300" /></div>

## Next steps

In this tutorial, you have gone through decision flow on how to setup Azure AD environment based on the version of FHIR Service you are deploying.

At this point, we are ready to setup development environment and provision FHIR Service to crate first Application.

>[!div class="nextstepaction"]
>[Setup development environment and provision service](tutorial-2-setup-environment.md)