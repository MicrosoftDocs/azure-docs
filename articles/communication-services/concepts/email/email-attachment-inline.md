---
title: Enhance email communication with inline attachments
titleSuffix: An Azure Communication Services concept article
description: Inline attachments enable you to embed images directly within the email body.
author: mansha
manager: koagbakp
services: azure-communication-services
ms.author: maniss
ms.date: 09/30/2024
ms.topic: conceptual
ms.service: azure-communication-services
---

# Enhance email communication with inline attachments

Email communication is more than just text. It's about creating engaging and visually appealing messages that capture the recipient's attention.

One way to engage email recipients is by using inline attachments, which enable you to embed images directly within the email body. 

Inline attachments are images or other media files that are embedded directly within the email content, rather than being sent as separate attachments.

Inline attachments let the recipient view the images as part of the email body, enhancing the overall visual appeal and engagement.

## Using inline attachments

Inline attachments are typically used for:

- Improved Engagement: Inline images can make your emails more visually appealing and engaging.
- Better Branding: Embedding your logo or other brand elements directly in the email can reinforce your brand identity.
- Enhanced User Experience: Inline images can help illustrate your message more effectively, making it easier for recipients to understand and act on your content.

Benefits of using CID for inline attachments

We use the HTML attribute content-ID (CID) to embed images directly into the email body.

Using CID for inline attachments is considered the best approach for the following reasons:

- Reliability: CID embedding references the image data using a unique identifier, rather than embedding the data directly in the email body. CID embedding ensures that the images are reliably displayed across different email clients and platforms.
- Efficiency: CID enables you to attach the image to the email and reference it within the HTML content using the unique content-ID. This method is more efficient than base64 encoding, which can significantly increase the size of the email and affect deliverability.
- Compatibility: CID supported by most email clients, ensuring that your inline images are displayed correctly for most recipients.
- Security: Using CID avoids the need to host images on external servers, which can pose security risks. Instead, the images are included as part of the email, reducing the risk of external content being blocked or flagged as suspicious.

## Related articles

- [Quickstart - Send email with attachments using Azure Communication Services](../../quickstarts/email/send-email-advanced/send-email-with-attachments.md)
- [Quickstart - Send email with inline attachments using Azure Communication Services](../../quickstarts/email/send-email-advanced/send-email-with-inline-attachments.md)