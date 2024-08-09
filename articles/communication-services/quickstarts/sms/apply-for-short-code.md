---
title: Apply for a short code
titleSuffix: An Azure Communication Services quickstart 
description: Learn about how to apply for a short code.
author: prakulka
manager: shahen
services: azure-communication-services

ms.author: prakulka
ms.date: 08/16/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom: mode-other
---
# Quickstart: Apply for a short code
[!INCLUDE [Short code eligibility notice](../../includes/public-preview-include-short-code-eligibility.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [An active Communication Services resource.](../create-communication-resource.md)

## Get a short code
To begin provisioning a short code, go to your Communication Services resource on the [Azure portal](https://portal.azure.com).

:::image type="content" source="./media/apply-for-short-code/manage-phone-azure-portal-start1.png"alt-text="Screenshot showing a Communication Services resource's main page.":::

## Apply for a short code
Navigate to the **Short codes** panel in the resource menu and click **Get** to launch the short code program brief application wizard. For detailed guidance on how to fill out the program brief application, see the [program brief filling guidelines](../../concepts/sms/program-brief-guidelines.md). This quickstart covers the application for US short code. 

For **UK short code**, fill out [UK short code application form](https://forms.office.com/r/VtfKFenZLF).

For **CA short code**, download and fill out [CA short code application form](https://www.txt.ca/wp-content/uploads/2022/10/DownloadShortcodeApplicationPdf_100522.pdf) and email the form to [acstns@microsoft.com](mailto:acstns@microsoft.com). Include **CA Short Code application** in subject line and details on subscription ID and Azure Communication Services resource ID in the body of the email.

## Short code prerequisites
The wizard on the **Short codes** panel presents a series of questions about the program and a description of content to be shared with the carriers for them to review and approve your short code program brief. Review the prerequisites tab for a list of the program content deliverables you need to attach with your application.

:::image type="content" source="./media/apply-for-short-code/prerequisites.png" alt-text="Screenshot showing prerequisites section.":::

The short code program brief registration requires details about your messaging program, including the user experience (for example, call to action, opt-in, opt-out, and message flows) and information about your company. This information helps mobile carriers ensure that your program meets the CTIA (Cellular Telecommunications Industry Association) guidelines and regulatory requirements.

A short code program brief application consists of the following five sections:
 
### Program Details 
You first need to provide the program name and choose the country/region where you want to provision the phone number. 

:::image type="content" source="./media/apply-for-short-code/program-details.png" alt-text="Screenshot showing program details section.":::

#### Select short code type
Configuring your short code is broken down into two steps:
- Select a short code *type*
- Select the short code *features*

You can select from two short code types: *random* or *vanity*. If you select a *random* short code, you get a short code randomly selected by the U.S. Common Short Codes Association (CSCA). If you select a *vanity* short code, you're required to provide a prioritized list of vanity short codes that you want to use for your program. If the first short code in your list isn't available to lease, the CSCA chooses an alternative from the list. For example: 234567, 234578, 234589. You can search the list of available short codes in the [US Short Codes Directory](https://usshortcodedirectory.com/).

After selecting a number type, you can then choose the message type and target date. Short code registration with carriers usually takes 8-12 weeks, so select a target date based on the registration period.

> [!Note]
> Azure Communication Service supports multimedia messaging service (MMS) in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly. Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/acs-tap-invite).

## Program content details
This section requires you to provide details about your program. These details include recurrence of the program, program call to action, type and description of program, privacy policy, and terms of the program.

:::image type="content" source="./media/apply-for-short-code/program-content-01.png" alt-text="Screenshot showing program content 1 section.":::

:::image type="content" source="./media/apply-for-short-code/program-content-02.png" alt-text="Screenshot showing program content 2 section.":::

### Contact Details
This section requires you to provide information about your company and customer care in the case that end users need help or support with the program. 

:::image type="content" source="./media/apply-for-short-code/contact-details.png" alt-text="Screenshot showing contact details section.":::

### Volume Details
This section requires you to provide an estimate of the number of messages you plan to send per user per month and disclose any expected traffic spikes as part of the program.

:::image type="content" source="./media/apply-for-short-code/volume.png" alt-text="Screenshot showing volume details section.":::

### Template Information
This section captures sample messages related to opt-in, opt-out, and other message flows. This tab features a message samples view where you can review sample templates to help you create a template for your use case.  

Azure communication service offers an opt-out management service for short codes that allows customers to configure responses to mandatory keywords STOP/START/HELP. Before provisioning your short code, you need to provide your preference to manage opt-outs. If you opt-in, the opt-out management service automatically uses your responses in the program brief for Opt-in/ Opt-out/ Help keywords in response to STOP/START/HELP keyword. 

:::image type="content" source="./media/apply-for-short-code/templates-01.png" alt-text="Screenshot showing template 1 details section.":::

:::image type="content" source="./media/apply-for-short-code/templates-02.png" alt-text="Screenshot showing template 2 details section.":::

:::image type="content" source="./media/apply-for-short-code/templates-03.png" alt-text="Screenshot showing template 3 details section.":::

### Review 
Once completed, review the short code request details, fees, SMS laws and industry standards, and submit the completed application through the Azure portal. 

:::image type="content" source="./media/apply-for-short-code/review.png" alt-text="Screenshot showing template details section.":::
 
The system automatically sends the program brief to the Azure Communication Services service desk for review. The service desk makes sure that the provided information is in the right format before sending it to all US mobile carriers for approval. The carriers then review the details of the short code program, a process that typically takes 8-12 weeks. Once carriers approve the program brief, you're notified via email. You can now start sending and receiving messages on this short code for your messaging programs.

## Troubleshooting
#### Common questions and issues:
- **Purchasing short codes is supported in the US only. To purchase phone numbers, ensure that:**
  - The associated Azure subscription billing address is located in the United States. You can't move a resource to another subscription at this time.
  - Your Communication Services resource is provisioned in the United States data location. You can't move a resource to another data location at this time. 
- **Updating a short code application**
    - Once submitted, you can't edit, view, or cancel the short code application. If the Service desk team requires any updates to be made, you're notified via email and you're able to edit the application with the updates.
    - If you'd like a copy of your application or for any issues, [contact us](https://emails-ppe.azure.microsoft.com/redirect/?destination=https%3A%2F%2Fportal.azure.com%2F%23blade%2FMicrosoft_Azure_Support%2FHelpAndSupportBlade%2Foverview&p=bT0wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAmdT1hZW8tcHJldmlldyZsPXBvcnRhbC5henVyZS5jb20%3D). 
- **Cancelling a short code application**
    - Cancelling short code applications in the Azure portal isn't supported. If you'd like to cancel your application after submitting the program brief, [contact us](https://emails-ppe.azure.microsoft.com/redirect/?destination=https%3A%2F%2Fportal.azure.com%2F%23blade%2FMicrosoft_Azure_Support%2FHelpAndSupportBlade%2Foverview&p=bT0wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAmdT1hZW8tcHJldmlldyZsPXBvcnRhbC5henVyZS5jb20%3D)

## Next steps

> [!div class="nextstepaction"]
> [Check guidelines for filling a short code program brief application](../../concepts/sms/program-brief-guidelines.md)

## Related articles

- Familiarize yourself with the [SMS SDK](../../concepts/sms/sdk-features.md).
