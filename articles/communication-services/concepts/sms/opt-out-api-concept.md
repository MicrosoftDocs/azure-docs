---
title: Short Message Service (SMS) Opt-Out Management API for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the SMS Opt-Out Management API
author: dbasantes
services: azure-communication-services

ms.author: dbasantes
ms.date: 12/04/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: sms
---
# Opt-Out management overview
The Opt-Out Management API enables you to manage opt-out requests for SMS messages. It provides a self-service platform for businesses to handle opt-out requests, ensuring compliance with regulations and protecting customer privacy.
Currently, opt-out handling includes configuring responses to mandatory opt-out keywords, such as STOP/START/HELP and others. The responses to these keywords are stored as part of program/campaign brief. The list of opted-out numbers is maintained in the Azure Communication Services Opt-Out database. This database management is automatic.
The Opt-Out database contains entries added when a recipient sends an opt-out keyword. An entry includes the fields: Sender, Recipient, and Country. If a recipient opts back in, the corresponding entry is deleted.
To learn more about how opt-out is handled at Azure Communication Services, read our [FAQ](./sms-faq.md#how-does-azure-communication-services-handle-opt-outs-for-short-codes) page. 

## Opt-Out management API
We're extending opt-out management by enabling you to manage the Opt-Out database via an API. This API allows adding, removing, or checking opt-out entries, overriding the automatic management.
Key features include:

- **Maintaining an Opt-Out List:** The API maintains a centralized list of opt-out requests, enabling businesses to easily add, remove, and check individuals opting out of SMS communications.
- **Enforcing Opt-Out Preferences:** The API integrates with the opt-out list to ensure that preferences are respected. No SMS messages will be delivered to individuals who opt out.

## Next steps

Let's get started with the [SMS Opt-out API quickstart](../../quickstarts/sms/opt-out-api-quickstart.md).
