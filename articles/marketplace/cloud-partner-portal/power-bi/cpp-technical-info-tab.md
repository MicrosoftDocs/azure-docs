---
title: Technical information for a Power BI App offer | Azure Marketplace 
description: Configure Technical info fields for a Power BI App offer for the Microsoft AppSource Marketplace. 
services: Azure, AppSource, Marketplace, Cloud Partner Portal, Power BI
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 04/24/2019
ms.author: pabutler
---

# Power BI Apps Technical Info tab

On the **New Offer** page, use the **Technical Info** tab to provide the Power BI installer package URL and other information that you need to validate the new offer.  For the initial release, all Power BI apps are free and are available for download from AppSource. Because of this, you can't define stock-keeping units (SKUs) for this offer type.

![The Technical Info tab](./media/technical-info-tab.png)


## Technical Info fields 

On the **Technical Info** tab, complete the fields described in the following table. An asterisk (*) at the end of a field label means that the field is required.

|        Field          |  Description                                                                 |
|    ---------------    |  ----------------------------------------------------------------------------|
| **Installer URL\***     | Power BI generates this URL when you publish the app and promote it to production.  For more information, see [Publish apps with dashboards and reports in Power BI](https://docs.microsoft.com/power-bi/service-create-distribute-apps).  |
|  **Validation instructions**  |  If you want, add instructions (up to 3,000 characters) to help the Microsoft validation team configure, connect, and test your app. Include typical configuration settings, accounts, parameters, or other information that can be used to test the Connect Data option. This information is visible only to the validation team, and it's used only for validation purposes.  |
| **Is this app created as a Power BI content pack?** | Currently, this field is used only internally. Leave the default setting of **No**. If you change the setting to **Yes**, you could stop the publishing process.  |  
|  |  |


## Next steps

On the [Storefront Details](./cpp-storefront-details-tab.md) tab, provide marketing and legal information for your app.

