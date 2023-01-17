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
   > This process is for the ground station license only. Microsoft manages the ground station licenses in our network and ensures customer satellites are added and authorized. 
   > The customer is responsible for acquiring a spacecraft license for their spacecraft. Microsoft can provide technical information needed to complete the federal regulator and ITU processes as needed.

## Prerequisites 

To initiate the spacecraft licensing process, you'll need:

- A spacecraft object that corresponds to the spacecraft in orbit or slated for launch. The links in this object must match all current and planned filings.
- A list of ground stations that you wish to use to communicate with your satellite.

## Step 1 - Initiate the request

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

## Step 2 - Provide more details

When the request is generated, our regulatory team will investigate the request and determine if more detail is required. If so, a customer support representative will reach out to you with a regulatory intake form. You'll need to input information regarding relevant filings, call signs, orbital parameters, link details, antenna details, point of contacts, etc.

Fill out all relevant fields in this form as it helps speeds up the process. When you're done entering information, email this form back to the customer support representative.

## Step 3 - Await feedback from our regulatory team

Based on the details provided in the steps above, our regulatory team will make an assessment on time and cost to onboard your spacecraft to all requested ground stations. This step will take a few weeks to execute.

Once the determination is made, we'll confirm the cost with you and ask you to authorize before proceeding.

## Step 4 - Azure Orbital requests the relevant licensing

Upon authorization, you'll be billed and our regulatory team will seek the relevant licenses to enable your spacecraft with the desired ground stations. This step will take 2 to 6 months to execute.

## Step 5 - Spacecraft is authorized

Once the licenses are in place, the spacecraft object will be updated by Azure Orbital to represent the licenses held at the specified ground stations. Refer to (to add link to spacecraft concept) to understand how the authorizations are applied.

## FAQ

**Q.** Are third party ground stations such as KSAT included in this process?
<br>
**A.** No, the process on this page applies to Microsoft ground station sites only. For more information, see [Integrate partner network ground stations](./partner-network-integration.md).
<br>
<br>
**Q.** Do public satellites requite licensing?
<br>
**A.** The Azure Orbital Ground Station service supports several public satellites that do not require licensing. These include Aqua, Suomi NPP, JPSS-1/NOAA-20, and Terra.
<br>
<br>
**Q.** How much does it cost to complete the ground station license process? How long will it take?
<br>
**A.** Refer to the tables below:
<br>

<table>
  <tr>
    <td><b>Station</b></td>
    <td><b>Quincy</b></td>
    <td><b>Chile</b></td>
    <td><b>Sweden</b></td>
    <td><b>South Africa</b></td>
    <td><b>Singapore</b></td>
  </tr>
  <tr>
      <td colspan="6"> <b> Onboarding Costs (Variable): </b> </td>
  </tr>
  <tr>
      <td>Application Fees</td>
      <td>$310</td>
      <td> - </td>
      <td> - </td>
      <td> - </td>
      <td> - </td>
  </tr>
  <tr>
      <td>Legal Fees</td>
      <td>$5,000</td>
      <td>$2,500</td>
      <td>$2,500</td>
      <td> - </td>
      <td>$3,000</td>
  </tr>
  <tr>
      <td>Engineering Fees</td>
      <td>-</td>
      <td>$1,000</td>
      <td>-</td>
      <td>-</td>
      <td>$1,000</td>
  </tr>  
  <tr>
      <td colspan="6"> <b> Ground Station Costs (Fixed): </b> </td>
  </tr>
  <tr>
      <td>License Modification</td>
      <td>$545</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
  </tr>
  <tr>
      <td>Regulator Fees</td>
      <td>$595</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
  </tr>
  <tr>
      <td>Legal Services</td>
      <td>$3,500</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
  </tr>
  <tr>
      <td><b>Total Costs (Var + Fixed):</b> </td>
      <td> <b> $9,950 </b> </td>
      <td> <b> $3,500 </b> </td>
      <td> <b> $2,500 </b> </td>
      <td>-</td>
      <td> <b> $4,000 </b> </td>
  </tr>
  <tr>
    <td colspan="6"> <b> Total Costs Per Customer: $19,950 </b> </td>
  </tr>
</table>

| **Station** | **Qunicy** | **Chile** | **Sweden** | **South Africa** | **Singapore** |
| ----------- | ---------- | --------- | ---------- | ---------------- | ------------- |
| Onboarding Timeframe | 3-6 months | 3-6 months | 3-6 months | <1 month | 3-6 months |


## Next steps
- [Integrate partner network ground stations](./partner-network-integration.md)
- [Receive real-time telemetry](receive-real-time-telemetry.md)
