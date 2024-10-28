---
title: Apply for 10DLC (10 digit long codes)
titleSuffix: An Azure Communication Services quickstart 
description: Learn about how to apply for  10DLC (10 digit long codes)
author: prakulka
manager: darmour
services: azure-communication-services

ms.author: prakulka
ms.date: 10/28/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: mode-other
---
# Quickstart: Apply for 10DLC (10 digit long codes)
This guide walks you through the steps required to register a brand and campaign for 10DLC (10-Digit Long Code) messaging in ACS. This process ensures compliance with carrier requirements and enables reliable, high-quality message delivery.

## Prerequisites
- [An active Communication Services resource.](../create-communication-resource.md)
- Eligible Tier Access: This quickstart assumes access to an eligible Tier, as 10DLC functionality is available only to customers with standard or above tier access.
- Company Information: Information about your business, such as your company's legal name, tax ID, and other relevant details.
- Campaign Details: A description of the use case and sample messages you plan to send through 10DLC.

## 10DLC Registration
Navigate to the **Regulatory Documents** blade in your ACS resource and select **Add** to start the 10DLC brand registration wizard.

:::image type="content" source="./media/apply-for-brand-registration/regulatory-screen-1.png" alt-text="Screenshot showing Regulatory Documents blade." lightbox="./media/apply-for-brand-registration/regulatory-screen-1.png":::

### Brand Registration
1. You first need to choose country/region and phone number type you would like to get verified. You need to apply for brand and campaign registration before acquiring 10DLC numbers for SMS. If you have acquired a 10DLC number for calling and want to enable it for SMS, then you need to first register the brand and campaign and then associate the number.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-1.png" alt-text="Screenshot showing Brand registration form." lightbox="./media/apply-for-brand-registration/brand-registration-1.png":::

3. In the brand registration form, provide details about your company:
   - **Company Name**: Your official registered business name.
   - **DBA or Brand Name**: Doing Business As (DBA) or brand name, if different.
   - **Website**: A website URL representing your business.
   - **Type of Legal Form**: Select the legal structure of your company (e.g., Private Company).
   - **EIN**: Employer Identification Number.
   - **EIN Issuing Country**: Country where your EIN was issued.
   - **Alternate ID**: Specify an alternate ID type (e.g., DUNS, GIIN, or LEI).
   - **DUNS or GIIN or LEI Number**: Enter the applicable ID number based on your alternate ID type.
   - **Company Address**: Primary address of your business.
   - **Address Line 2**: Additional address information, if needed.
   - **City**: City of the business location.
   - **State or Province**: State or province of the business location.
   - **Zip Code or Postal Code**: ZIP or postal code for the business location.
   - **Country**: Country where the business is located.
   - **Stock Symbol**: Stock symbol, if publicly listed.
   - **Stock Exchange**: Name of the stock exchange where your business is listed, if applicable.
   - **Vertical Type**: Business category (e.g., Education, Finance).
   - **Contact Email Address**: Contact email for inquiries related to the brand registration.
   - **Contact Phone Number**: Phone number for inquiries related to the brand registration.

4. Submit the form for verification. Brand verification may take up to 48 hours.

:::image type="content" source="./media/apply-for-brand-registration/brand-registration-2.png" alt-text="Screenshot showing Brand registration form." lightbox="./media/apply-for-brand-registration/brand-registration-2.png":::

> **Warning**: Providing incorrect or incomplete information may result in brand verification failure. Double-check all details before submitting to avoid delays or rejections in the registration process.

### Campaign Registration
After your brand is verified, proceed with the campaign registration:

1. Select **Add Campaign** and fill in campaign-specific details:
   - **Campaign Name**: A unique name for your campaign.
   - **Campaign Use Case**: Select a use case category (e.g., Customer Care, Alerts).
   - **Description**: Describe the purpose and target audience of your campaign.
   - **Opt-In Method**: Explain how you obtain customer consent for SMS.
   - **Sample Messages**: Provide example messages that will be sent.
2. Submit your campaign application. Campaign approval may take 2–3 business days.

   ![Screenshot showing campaign registration form.](./media/register-10dlc/campaign-registration-form.png)
