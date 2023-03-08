---
title: Plan CIAM deployment
description: Learn how to plan your CIAM deployment.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know how to plan a CIAM deployment.
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/azure-active-directory-b2c-deployment-plans. For now the text  is used as a placeholder in the release branch, until further notice. -->

# CIAM deployment plans

CIAM is a customer identity and access management solution that can ease integration with your infrastructure. Use the following guidance to help understand requirements and compliance throughout a CIAM deployment.

## Plan a CIAM deployment

### Requirements

- Assess the primary reason to turn off systems
- For a new application, plan the design of the Customer Identity Access Management (CIAM) system

### Stakeholders

Technology project success depends on managing expectations, outcomes, and responsibilities. 

- Identify the application architect, technical program manager, and owner
- Create a distribution list (DL) to communicate with the Microsoft account or engineering teams
  - Ask questions, get answers, and receive notifications
- Identify a partner or resource outside your organization to support you

### Communications

Communicate proactively and regularly with your users about pending and current changes. Inform them about how the experience changes, when it changes, and provide a contact for support.

### Timelines

Help set realistic expectations and make contingency plans to meet key milestones:

- Pilot date
- Launch date
- Dates that affect delivery
- Dependencies

### Checklist for personas, permissions, delegation, and calls

* Identify the personas that access to your application 
* Define how you manage system permissions and entitlements today, and in the future

### User identity deployment checklist

* Confirm the number of users accessing applications
* Determine the IdP types needed:
  * For example, Facebook, Google.
* Determine the information to collect during sign-in and sign-up 

## Next steps
- [Overview - Customer identity access management (CIAM)](overview-customers-ciam.md)