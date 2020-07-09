---
title: Manage an Azure support request
description: Describes how to view support requests, send messages, change the request severity level, share diagnostic information with Azure support, reopen a closed support request, and upload files.
author: mgblythe
tags: billing
ms.assetid: 86697fdf-3499-4cab-ab3f-10d40d3c1f70
ms.service: azure-supportability
ms.topic: how-to
ms.date: 06/30/2020
ms.author: mblythe

# To add: close and reopen, review request status, update contact info

---

# Manage an Azure support request

After you [create an Azure support request](how-to-create-azure-support-request.md), you can manage it in the [Azure portal](https://portal.azure.com), which is covered in this article. You can also create and manage requests programmatically, using the [Azure support ticket REST API](/rest/api/support).

## View support requests

View the details and status of support requests by going to **Help + support** >  **All support requests**.

:::image type="content" source="media/how-to-manage-azure-support-request/all-requests-lower.png" alt-text="All support requests":::

On this page, you can search, filter, and sort support requests. Select a support request to view details, including its severity and any messages associated with the request.

## Send a message

1. On the **All support requests** page, select the support request.

1. On the **Support Request** page, select **New message**.

1. Enter your message and select **Submit**.

## Change the severity level

> [!NOTE]
> The maximum severity level depends on your [support plan](https://azure.microsoft.com/support/plans).
>

1. On the **All support requests** page, select the support request.

1. On the **Support Request** page, select **Change**.

    :::image type="content" source="media/how-to-manage-azure-support-request/change-severity.png" alt-text="Change support request severity":::

1. The Azure portal shows one of two screens, depending on whether your request is already assigned to a support engineer:

    - If your request hasn't been assigned, you see a screen like the following. Select a new severity level, then select **Change**.

        :::image type="content" source="media/how-to-manage-azure-support-request/unassigned-can-change-severity.png" alt-text="Select a new severity level":::

    - If your request has been assigned, you see a screen like the following. Select **OK**, then create a [new message](#send-a-message) to request a change in severity level.

        :::image type="content" source="media/how-to-manage-azure-support-request/assigned-cant-change-severity.png" alt-text="Can't select a new severity level":::

## Share diagnostic information with Azure support

When you create a support request, by default the **Share diagnostic information** option is selected. This allows Azure support to gather [diagnostic information](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) from your Azure resources:

* You can't clear this option after a request is created.

* If you cleared the option when creating a request, you can select it after the request is created.

    1. On the **All support requests** page, select the support request.
    
    1. On the **Support Request** page, select **Grant permission**, then select **Yes** and **OK**.
    
        :::image type="content" source="media/how-to-manage-azure-support-request/grant-permission-manage.png" alt-text="Grant permissions for diagnostic information":::

## Upload files

You can use the file upload option to upload diagnostic files or any other files that you think are relevant to a support request.

1. On the **All support requests** page, select the support request.

1. On the **Support Request** page, browse to find your file, then select **Upload**. Repeat the process if you have multiple files.

    :::image type="content" source="media/how-to-manage-azure-support-request/file-upload.png" alt-text="Upload file":::

### File upload guidelines

Follow these guidelines when you use the file upload option:

* To protect your privacy, do not include any personal information in your upload.
* The file name must be no longer than 110 characters.
* You can't upload more than one file.
* Files can't be larger than 4 MB.
* All files must have a file name extension, such as *.docx* or *.xlsx*. The following table shows the filename extensions that are allowed for upload.

| 0-9, A-C    | D-G   | H-M         | N-P   | R-T      | U-W        | X-Z     |
|-------------|-------|-------------|-------|----------|------------|---------|
| .7z         | .dat  | .hwl        | .odx  | .rar     | .tdb       | .xlam   |
| .a          | .db   | .ics        | .oft  | .rdl     | .tdf       | .xlr    |
| .abc        | .DMP  | .ini        | .old  | .rdlc    | .text      | .xls    |
| .adm        | .do_  | .java       | .one  | .re_     | .thmx      | .xlsb   |
| .aspx       | .doc  | .jpg        | .osd  | .reg     | .tif       | .xlsm   |
| .ATF        | .docm | .LDF        | .OUT  | .remove  | .trc       | .xlsx   |
| .b          | .docx | .letterhead | .p1   | .ren     | .TTD       | .xlt    |
| .ba_        | .dotm | .lnk        | .pcap | .rename  | .tx_       | .xltx   |
| .bak        | .dotx | .lo_        | .pdb  | .rft     | .txt       | .xml    |
| .bat        | .dtsx | .log        | .pdf  | .rpt     | .uccapilog | .xmla   |
| .blg        | .eds  | .lpk        | .piz  | .rte     | .uccplog   | .xps    |
| .CA_        | .emf  | .manifest   | .pmls | .rtf     | .udcx      | .xsd    |
| .CAB        | .eml  | .master     | .png  | .run     | .vb_       | .xsn    |
| .cap        | .emz  | .mdmp       | .potx | .saz     | .vbs_      | .xxx    |
| .catx       | .err  | .mof        | .ppt  | .sql     | .vcf       | .z_     |
| .CFG        | .etl  | .mp3        | .pptm | .sqlplan | .vsd       | .z01    |
| .compressed | .evt  | .mpg        | .pptx | .stp     | .wdb       | .z02    |
| .Config     | .evtx | .ms_        | .prn  | .svclog  | .wks       | .zi     |
| .cpk        | .EX   | .msg        | .psf  |   -       | .wma       | .zi_    |
| .cpp        | .ex_  | .msi        | .pst  |  -        | .wmv       | .zip    |
| .cs         | .ex0  | .mso        | .pub  | -         | .wmz       | .zip_   |
| .CSV        | .FRD  | .msu        | -      |-          | .wps       | .zipp   |
| .cvr        | .gif  | .nfo        | -      |-          | .wpt       | .zipped |
| -            | .guid | -            | -      | -         | .wsdl      | .zippy  |
| -            | .gz   | -            | -      | -         | .wsp       | .zipx   |
| -            | -      | -            | -      | -         | .wtl       | .zit    |
| -            | -      | -            | -      | -         |     -       | .zix    |
| -            | -      | -            | -      | -         |  -          | .zzz    |

## Reopen a closed request

If you need to reopen a closed support request, create a [new message](#send-a-message), which automatically reopens the request.

## Next steps

[How to create an Azure support request](how-to-create-azure-support-request.md)

[Azure support ticket REST API](/rest/api/support)
