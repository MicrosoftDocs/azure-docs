---
title: Lead Management Instructions for Marketo on Azure Marketplace  | Microsoft Docs
description: This article guides publishers step by step as to how to set up their lead management with Marketo.
services: cloud-partner-portal
documentationcenter: ''
author: Bigbrd
manager: hamidm

ms.service: cloud-partner-portal
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/24/2017
ms.author: brdi
ms.robots: NOINDEX, NOFOLLOW

---

# Lead Management Instructions for Marketo

This document provides you with instructions on how to setup your Marketo system so that Microsoft can provide you with sales leads. 

1. Go to “Design Studio” in Marketo. <br/>
![Marketo setup image](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo1.png)

2. Click on “New Form” <br/>
![Marketo new form image](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo2.png)

3. Fill the fields in the New Form pop-up <br/>
![Marketo create form image](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo3.png)

4. Click on “finish” in the next form. Don’t worry about the formatting or fields. <br/>
![Marketo finish form image](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo4.png)

5. Approve and Close.

6. On the next page, go to the Embed Code section.<br/>
![Marketo embed code image](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo5.png)

7. You will see an embed code similar to this sample below: 

   ` <script src="//app-ys12.marketo.com/js/forms2/js/forms2.min.js"></script>`

    `<form id="mktoForm_1179"></form> `

    `<script>MktoForms2.loadForm("("//app-ys12.marketo.com", "123-PQR-789", 1179);</script>`

8. Use the values available in the embed code to fill <b>Server Id, Munchkin Id, and Form Id</b> in the Marketo fields on the Cloud Partner Portal. <br\> <br/>

  The following sample will help you determine the Ids from sample data above. <br\>

  serverId = **ys12** <br\>

 munchkinId = **123-PQR-789** <br\>

 formId = **1179** <br\> <br/>
