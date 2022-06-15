---
title: License your spacecraft
description: Learn how to license your spacecraft with Orbital.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 06/13/2022
ms.author: hrshelar
---

# License your spacecraft

This page provides an overview on how to register or license your spacecraft with Azure Orbital.

## Prerequisites 

To initiate the spacecraft licensing process, you'll need:

1. A spacecraft object that corresponds to the spacecraft in orbit or slated for launch. The links in this object must match all current and planned filings.
1. List of ground stations that you wish to use 

## Step 1 - Initiate the request

The process starts by initiating the licensing request via the Azure Portal.

1. Navigate to the spacecraft object and click on New Support Request under the Support + troubleshooting category to the left.
1. Choose the following fields:
    1. Summary: Provide a relevant ticket title.
    1. Issue type: Technical.
    1. Subscription: Choose your current subscription.
    1. Service: My Service
    1. Service Type: Azure orbital
    1. Problem type: Spacecraft Management and Setup
    1. Problem subtype: Spacecraft Registration
1. Click next to Solutions
1. Click next to Details
1. Enter the desired ground stations in the Description field
1. Enable advanced diagnostic information
1. Click next to Review + Create
1. Click Create.

## Step 2 - Provide additional details

After the request is generated our regulatory team will investigate the request and determine if additional detail is required. If so, a customer support representative will reach out to you with a regulatory intake form. You'll need to input information regarding relevant filings, call signs, orbital parameters, link details, antenna details, point of contacts, etc.

Please aim to fill out all relevant fields in this form as this helps speeds up the process. When you are done entering information, email this form back to the customer support representative.

## Step 3 - Await feedback from our regulatory team

Based on the details provided in the steps above our regulatory team will make an assessment on time and cost to onboard your spacecraft to all requested groundstations. This step will take a few weeks to execute.

Once the determination is made, we'll confirm the cost with you and ask you to authorize proceeding.

## Step 4 - Orbital requests the relevant licensing

Upon authorization, you'll be billed amounts determined in Step 3 and our regulatory team will seek the relevant licenses to enable your spacecraft with the desired ground stations. This step will take 2 to 6 months to execute.

## Step 5 - Spacecraft is authorized

Once the licenses are in place, the spacecraft object will be updated by Orbital to represent the licenses held at the specified groundstations. Refer to [Spacecraft](concepts-spacecraft.md) to understand how the authorizations are applied.

## FAQ

Q. Are third party ground stations such as KSAT included in this process
A. No, the process on this page applies to Microsoft sites only. Refer to [Integrate with third party](howto-thirdpary.md) for more details on licensing with partner sites.

## Next steps
