---
title: Troubleshooting - Azure Verifiable Credentials
description: Find answers to common errors when working with Azure Verifiable Credentials
author: barclayn
manager: davba
ms.service: identity
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: barclayn
# Customer intent: As a developer I am looking for information on how to enable my users to control their own information 
---

# Troubleshooting Verifiable Credentials

Updated: June 15, 2020


Here are a few steps you can use to troubleshoot some of the common issues we see people going through:

## Error: 0 error: undefined when opening the Issuing Service preview blade

This happens if you aren't using the correct URI to access this preview page. Refer to the information you were given as part of the private preview and use the correct URI.

## The portal asks me to set up the Issuing Service again while I am 100% sure I already did this.

This happens if you aren't using the correct URI to access this preview page. Refer to the information you were given as part of the private preview and use the correct URI.

## Error in Microsoft Authenticator when scanning a QR code during verification

There can be a few reasons why this happens. If the error happens immediately after scanning, you have to make sure the website is accessible by your phone or emulator. Test that it works by navigating to the website in the browser on your phone.
If the website is reachable and the /presentation-request.jwt ```GET``` request is hit make sure the payload send back to the authenticator is correct.
If you still receive errors, navigate to the home screen of authenticator. Go the Help and choose **Send logs**. Send and share the ID shown with your Microsoft contact.

## Unauthorized access when opening the contract URL

This can happen for several reasons. First, we need to check the permissions on Azure Key Vault and BLOB Storage. 

To check if you have the correct permissions setup for Key Vault check the following settings:

- Navigate to your vault.
- Navigate to Access Policies.
- Make sure the Verifiable Credentials Issuer Service Application is visible and has 6 key permissions:  Get, list, Create, Import, Verify, Sign. Has 3 Secret permissions: Get, List Set. 

To check if you have the correct permissions set up for your storage account check the following settings:

- Navigate to your storage account.
- Navigate to Containers under Blob service.
- Click on the container that you are using for your rules and display files.
- Verify Access Level is Private (no anonymous access).
- Navigate to Access Control (IAM).
- Click on Role Assignment.
- Make sure the Verifiable Credentials Issuer Service has the Storage Blob Data Reader configured.

