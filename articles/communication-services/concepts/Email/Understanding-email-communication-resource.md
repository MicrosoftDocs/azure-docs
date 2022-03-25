---
title: Email Communication Service overview for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Email Communication Resources and Domains.
author: bashan
manager: shanhen
services: azure-communication-services

ms.author: bashan
ms.date: 02/15/2022
ms.topic: overview
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).
# Email Communication Services
Similar to Chat, VOIP and SMS modalities under the Azure Communication Services , developers will be able to send email using an Azure Communication Resource. However
sending an email requires certain preconfiguration steps that are required and they need to rely on admin developer help setting that up which includes which sender domain they will use as the P1 sender also known as MailFrom email address (is an email address that shows up on the envelope of the email [RFC 5321]) and P2 sender(email address that most email recipients will see on their email client. [RFC 5322]). The admin developer will also need to setup and verify the sender domain by addting necessary DNS record records for sender verification to succeed.

One of the key prinicipal that we are focusing here is our email platform will simplify the expereicne for both developers to ease this back and forth operations and improve the developer expirence by letting the developers focus on building the required paylod to send email and allow admin developer configure the necessary sender authentication and other compliance releated steps to send email.

1.	Creates an Email Azure Communication Services resource.
2.	Add and verify custom domains or get an azure managed domain.
3.	Connect the verified domain to Azuare Communication Resource.


