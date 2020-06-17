---
title: Configure lead management in Marketo | Azure Marketplace
description: Configure lead management for Marketo for Azure marketplace customers.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 09/14/2018
ms.author: dsindona
---

# Configure lead management in Marketo

This article describes how to set up Marketo to handle Microsoft sales leads.

1. Sign in to Marketo.
2. Select **Design Studio**.
    ![Marketo Design Studio](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo1.png)

3.  Select **New Form**.
    ![Marketo new form](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo2.png)

4.  Fill the required fields in the New Form and then select **Create**.
    ![Marketo create new form](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo3.png)

4.  On Field Details, select **Finish**.
    ![Marketo finish form](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo4.png)

5.  Approve and Close.

6.  On the MarketplaceLeadBacked tab, select **Embed Code**.
    ![Marketo embed code option](./media/cloud-partner-portal-lead-management-instructions-marketo/marketo5.png)

7.  Marketo Embed Code displays code similar to the following example.

`<script src="//app-ys12.marketo.com/js/forms2/js/forms2.min.js"></script>`

    <form id="mktoForm_1179"></form>
    <script>MktoForms2.loadForm("//app-ys12.marketo.com", "123-PQR-789", 1179);</script>

1. Copy the values shown in Embed Code so you can configure the **Server Id**, **Munchkin Id**, and **Form Id** in the Marketo fields on the Cloud Partner Portal.

Use the next example as a guide for getting the Ids you need from the Marketo Embed Code example.

- Server Id = **ys12**
- Munchkin Id = **123-PQR-789**
- Form Id = **1179**
