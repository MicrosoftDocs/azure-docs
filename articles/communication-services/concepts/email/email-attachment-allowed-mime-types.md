---
title: Allowed attachment types for sending email
titleSuffix: An Azure Communication Services concept document
description: Learn about how validation for attachment MIME types works for Email Communication Services.
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 03/31/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Allowed attachment types for sending email in Azure Communication Services Email

The [Send Email operation](../../quickstarts/email/send-email.md) allows the option for the sender to add attachments to an outgoing email. Along with the content itself, the sender must include the file attachment type using the MIME standard when making a request with an attachment. Many common file types are accepted, such as Word documents, Excel spreadsheets, many image and video formats, contacts, and calendar invites. 

## What is a MIME type?

MIME (Multipurpose Internet Mail Extensions) types are a way of identifying the type of data that is being sent over the internet. When users send email requests with Azure Communication Services Email, they can specify the MIME type of the email content, which allows the recipient's email client to properly display and interpret the message. If an email message includes an attachment, the MIME type would be set to the appropriate file type (for example, "application/pdf" for a PDF document).

Developers can ensure that the recipient's email client properly formats and interprets the email message by using MIME types, irrespective of the software or platform being used. This information helps to ensure that the email message is delivered correctly and that the recipient can access the content as intended. In addition, using MIME types can also help to improve the security of email communications, as they can be used to indicate whether an email message includes executable content or other potentially harmful elements.

To sum up, MIME types are a critical component of email communication, and by using them with Azure Communication Services Email, developers can help ensure that their email messages are delivered correctly and securely.

## Allowed attachment types

Here's a table listing some of the most common supported file extensions and their corresponding MIME types for email attachments using Azure Communication Services Email:

| File Extension | Description | MIME Type |
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
| .epub | EPUB ebook file | `application/epub+zip` |
| .gif | GIF image | `image/gif` |
| .gz | Gzip compressed file | `application/gzip` |
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
| .ppsm | PowerPoint slideshow (macro-enabled) | `application/vnd.ms-powerpoint.slideshow.macroEnabled.12` |
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
| .ttf | TrueType Font | `font/ttf` |
| .txt | Text Document | `text/plain` |
| .vsd | Microsoft Visio Drawing | `application/vnd.visio` |
| .wav | Waveform Audio File Format | `audio/wav` |
| .weba | WebM Audio File | `audio/webm` |
| .webm | WebM Video File | `video/webm` |
| .webp | WebP Image File | `image/webp` |
| .wma | Windows Media Audio File | `audio/x-ms-wma` |
| .wmv | Windows Media Video File | `video/x-ms-wmv` |
| .woff | Web Open Font Format | `font/woff` |
| .woff2 | Web Open Font Format 2.0 | `font/woff2` |
| .xls | Microsoft Excel Spreadsheet (97-2003) | `application/vnd.ms-excel` |
| .xlsb | Microsoft Excel Binary Spreadsheet | `application/vnd.ms-excel.sheet.binary.macroEnabled.12` |
| .xlsm | Microsoft Excel Macro-Enabled Spreadsheet | `application/vnd.ms-excel.sheet.macroEnabled.12` |
| .xlsx | Microsoft Excel Spreadsheet (OpenXML) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| .xml | Extensible Markup Language File | `application/xml`, `text/xml` |
| .zip | ZIP Archive | `application/zip` |

There are many other file extensions and MIME types that can be used for email attachments. However, this list includes accepted types for sending attachments in our SendMail operation. Additionally, different email clients and servers may have different limitations or restrictions on file size and types that could result in the failure of email delivery. Ensure that the recipient can accept the email attachment or refer to the documentation for the recipient's email providers.

## Additional information

The Internet Assigned Numbers Authority (IANA) is a department of the Internet Corporation for Assigned Names and Numbers (ICANN) responsible for the global coordination of various Internet protocols and resources, including the management and registration of MIME types.

The IANA maintains a registry of standardized MIME types, which includes a unique identifier for each MIME type, a short description of its purpose, and the associated file extensions. For the most up-to-date information regarding MIME types, including the definitive list of media types, it's recommended to visit the [IANA Website](https://www.iana.org/assignments/media-types/media-types.xhtml) directly.

## Next steps

* [What is Email Communication Communication Service](./prepare-email-communication-resource.md)

* [Email domains and sender authentication for Azure Communication Services](./email-domain-and-sender-authentication.md)

* [Get started with sending email using Email Communication Service in Azure Communication Service](../../quickstarts/email/send-email.md)

* [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../email/sdk-features.md)
- How to send emails with custom verified domains? [Add custom domains](../../quickstarts/email/add-custom-verified-domains.md)
- How to send emails with Azure Managed Domains? [Add Azure Managed domains](../../quickstarts/email/add-azure-managed-domains.md)
