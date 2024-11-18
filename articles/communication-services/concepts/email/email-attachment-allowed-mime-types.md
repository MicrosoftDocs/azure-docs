---
title: Allowed attachment types for sending email in Azure Communication Services
titleSuffix: An Azure Communication Services concept article
description: Learn about how validation for attachment MIME types works in Azure Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Allowed attachment types for sending email in Azure Communication Services

The [SendMail operation](../../quickstarts/email/send-email.md) allows the option for the sender to add attachments to an outgoing email. Along with the content itself, the sender must include the file attachment type by using the Multipurpose Internet Mail Extensions (MIME) standard when making a request with an attachment. Many common file types are accepted, such as Word documents, Excel spreadsheets, image and video formats, contacts, and calendar invites.

## What is a MIME type?

MIME types are a way to identify the type of data that's being sent over the internet. When users send email requests by using Azure Communication Services, they can specify the MIME type of the email content so that the recipient's email client can properly display and interpret the message. If an email message includes an attachment, the MIME type is set to the appropriate file type (for example, `application/pdf` for a PDF document).

Developers can ensure that the recipient's email client properly formats and interprets the email message by using MIME types, irrespective of the software or platform that the system is using. This information helps ensure that the email message is delivered correctly and that the recipient can access the content as intended. Using MIME types can also help to improve the security of email communications, because they can indicate whether an email message includes executable content or other potentially harmful elements.

MIME types are a critical component of email communication. By using MIME types with Azure Communication Services, developers can help ensure that their email messages are delivered correctly and securely.

## Allowed attachment types

This table lists common supported file extensions and their corresponding MIME types for email attachments in Azure Communication Services:

| File extension | Description | MIME type |
| --- | --- | --- |
| .3gp | 3GPP multimedia file | `video/3gpp` |
| .3g2 | 3GPP2 multimedia file | `video/3gpp2` |
| .7z | 7-Zip compressed file | `application/x-7z-compressed` |
| .aac | AAC audio | `audio/aac` |
| .avi | AVI video file | `video/x-msvideo` |
| .bmp | BMP image | `image/bmp` |
| .csv | Comma-separated values | `text/csv` |
| .doc | Microsoft Word document (97-2003) | `application/msword` |
| .docm | Microsoft Word macro-enabled document | `application/vnd.ms-word.document.macroEnabled.12` |
| .docx | Microsoft Word document (2007 or later) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| .eot | Embedded OpenType font | `application/vnd.ms-fontobject` |
| .epub | EPUB e-book file | `application/epub+zip` |
| .gif | GIF image | `image/gif` |
| .gz | GZIP compressed file | `application/gzip` |
| .ico | Icon file | `image/vnd.microsoft.icon` |
| .ics | iCalendar file | `text/calendar` |
| .jpg, .jpeg | JPEG image | `image/jpeg` |
| .json | JSON data | `application/json` |
| .mid, .midi | MIDI audio file | `audio/midi` |
| .mp3 | MP3 audio file | `audio/mpeg` |
| .mp4 | MP4 video file | `video/mp4` |
| .mpeg | MPEG video file | `video/mpeg` |
| .oga | Ogg audio file | `audio/ogg` |
| .ogv | Ogg video file | `video/ogg` |
| .ogx | Ogg file | `application/ogg` |
| .one | Microsoft OneNote file | `application/onenote` |
| .opus | Opus audio file | `audio/opus` |
| .otf | OpenType font | `font/otf` |
| .pdf | PDF document | `application/pdf` |
| .png | PNG image | `image/png` |
| .ppsm | PowerPoint macro-enabled slideshow | `application/vnd.ms-powerpoint.slideshow.macroEnabled.12` |
| .ppsx | PowerPoint slideshow | `application/vnd.openxmlformats-officedocument.presentationml.slideshow` |
| .ppt | PowerPoint presentation (97-2003) | `application/vnd.ms-powerpoint` |
| .pptm | PowerPoint macro-enabled presentation | `application/vnd.ms-powerpoint.presentation.macroEnabled.12` |
| .pptx | PowerPoint presentation (2007 or later) | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| .pub | Microsoft Publisher document | `application/vnd.ms-publisher` |
| .rar | RAR compressed file | `application/x-rar-compressed` |
| .rpmsg | Outlook email message | `application/vnd.ms-outlook` |
| .rtf | Rich Text Format document | `application/rtf` |
| .svg | Scalable Vector Graphics image | `image/svg+xml` |
| .tar | Tar archive file | `application/x-tar` |
| .tif, .tiff | Tagged Image File Format | `image/tiff` |
| .ttf | TrueType font | `font/ttf` |
| .txt | Text document | `text/plain` |
| .vsd | Microsoft Visio drawing | `application/vnd.visio` |
| .wav | Waveform Audio File Format | `audio/wav` |
| .weba | WebM audio file | `audio/webm` |
| .webm | WebM video file | `video/webm` |
| .webp | WebP image file | `image/webp` |
| .wma | Windows Media Audio file | `audio/x-ms-wma` |
| .wmv | Windows Media Video file | `video/x-ms-wmv` |
| .woff | Web Open Font Format | `font/woff` |
| .woff2 | Web Open Font Format 2.0 | `font/woff2` |
| .xls | Microsoft Excel spreadsheet (97-2003) | `application/vnd.ms-excel` |
| .xlsb | Microsoft Excel binary spreadsheet | `application/vnd.ms-excel.sheet.binary.macroEnabled.12` |
| .xlsm | Microsoft Excel macro-enabled spreadsheet | `application/vnd.ms-excel.sheet.macroEnabled.12` |
| .xlsx | Microsoft Excel spreadsheet (Open XML) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| .xml | Extensible Markup Language file | `application/xml`, `text/xml` |
| .zip | ZIP archive | `application/zip` |

There are many other file extensions and MIME types that you can use for email attachments. However, this list includes accepted types for sending attachments in the SendMail operation.

Some email clients and servers might have limitations or restrictions on file size and types that could result in the failure of email delivery. Ensure that the recipient can accept the email attachment, or refer to the documentation for the recipient's email provider.

## Additional information

The Internet Assigned Numbers Authority (IANA) is a department of the Internet Corporation for Assigned Names and Numbers (ICANN). IANA is responsible for the global coordination of various internet protocols and resources, including the management and registration of MIME types.

IANA maintains a registry of standardized MIME types. The registry includes a unique identifier for each MIME type, a short description of its purpose, and the associated file extensions. For the most up-to-date information about MIME types, including the definitive list of media types, go to the [IANA website](https://www.iana.org/assignments/media-types/media-types.xhtml).

## Next steps

* [Prepare an email communication resource for Azure Communication Services](./prepare-email-communication-resource.md)
* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)
* [Send email by using Azure Communication Services](../../quickstarts/email/send-email.md)
* [Connect a verified email domain in Azure Communication Services](../../quickstarts/email/connect-email-communication-resource.md)

The following documents might be interesting to you:

* Familiarize yourself with the [email client library](../email/sdk-features.md).
* Learn how to send emails with [custom verified domains](../../quickstarts/email/add-custom-verified-domains.md).
* Learn how to send emails with [Azure-managed domains](../../quickstarts/email/add-azure-managed-domains.md).
