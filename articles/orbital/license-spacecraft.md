---
title: License your spacecraft - Azure Orbital
description: Learn how to license your spacecraft with Azure Orbital Ground Station.
author: hrshelar
ms.service: orbital
ms.topic: how-to
ms.custom: ga
ms.date: 07/12/2022
ms.author: hrshelar
---

# License your spacecraft

This page provides an overview on how to register or license your spacecraft with Azure Orbital.

   > [!NOTE]
   > This process is for the ground station license only. Microsoft manages the ground station licenses in our network and ensures customer satellites are added and authorized. 
   > The customer is responsible for acquiring a spacecraft license for their spacecraft. Microsoft can provide technical information needed to complete the federal regulator and ITU processes as needed.

## Prerequisites 

To initiate the spacecraft licensing process, you'll need:

- A spacecraft object that corresponds to the spacecraft in orbit or slated for launch. The links in this object must match all current and planned filings.
- A list of ground stations that you wish to use to communicate with your satellite.

## Step 1: Initiate the request

The process starts by initiating the licensing request via the Azure portal.

1. Navigate to the spacecraft object and select New Support Request under the Support + troubleshooting category to the left.
1. Complete the following fields:

 | **Field** | **Value** |
   | --- | --- |
   | Summary | Provide a relevant ticket title. |
   | Issue type | Technical |
   | Subscription | Choose your current subscription. |
   | Service |  My Service |
   | Service Type | Azure Orbital |
   | Problem type | Spacecraft Management and Setup |
   | Problem subtype | Spacecraft Registration |
   
1. Click next to Solutions.
1. Click next to Details.
1. Enter the desired ground stations in the Description field.
1. Enable advanced diagnostic information.
1. Click next to Review + Create.
1. Click Create.

## Step 2: Provide more details

When the request is generated, our regulatory team will investigate the request and determine if more detail is required. If so, a customer support representative will reach out to you with a regulatory intake form. You'll need to input information regarding relevant filings, call signs, orbital parameters, link details, antenna details, point of contacts, etc.

Fill out all relevant fields in this form as it helps speeds up the process. When you're done entering information, email this form back to the customer support representative.

## Step 3: Await feedback from our regulatory team

Based on the details provided in the steps above, our regulatory team will make an assessment on time and cost to onboard your spacecraft to all requested ground stations. This step will take a few weeks to execute.

Once the determination is made, we'll confirm the cost with you and ask you to authorize before proceeding.

## Step 4: Azure Orbital requests the relevant licensing

Upon authorization, you will be billed the fees associated with each relevant ground station. Our regulatory team will seek the relevant licenses to enable your spacecraft to communicate with the desired ground stations. Refer to the following table for an estimated timeline for execution: 

| **Station** | **Qunicy** | **Chile** | **Sweden** | **South Africa** | **Singapore** |
| ----------- | ---------- | --------- | ---------- | ---------------- | ------------- |
| Onboarding Timeframe | 3-6 months | 3-6 months | 3-6 months | <1 month | 3-6 months |

## Step 5: Spacecraft is authorized

Once the licenses are in place, the spacecraft object will be updated by Azure Orbital to represent the licenses held at the specified ground stations. To understand how the authorizations are applied, see [Spacecraft Object](./spacecraft-object.md).

## FAQ

**Q.** Are third party ground stations such as KSAT included in this process?  
**A.** No, the process on this page applies to Microsoft sites only. For more information, see [Integrate partner network ground stations](./partner-network-integration.md).  
  
**Q.** Do public satellites requite licensing?  
**A.** The Azure Orbital Ground Station service supports several public satellites that do not require licensing. These include Aqua, Suomi NPP, JPSS-1/NOAA-20, and Terra.


## Next steps
- [Integrate partner network ground stations](./partner-network-integration.md)
- [Receive real-time telemetry](receive-real-time-telemetry.md)
