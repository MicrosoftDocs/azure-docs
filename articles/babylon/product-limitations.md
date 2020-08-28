---
title: 'Product Limitations for Project Babylon Private Preview'
titleSuffix: Project Babylon
description: This document describes current limitations of Project Babylon. 
author: hophan
ms.author: hophan
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.date: 06/18/2020
---

# Product Limitations for the Project Babylon Private Preview

Please read this document very carefully. It includes warnings that Project Babylon Private preview customers are expected to be aware of. The warnings are broken up into those that require the customer to take certain actions and into those that just require customer awareness.

## Warnings that require customer action

* Please use the feature flag when creating a Babylon account

  * **Limitation -** The existence of Project Babylon is not public
        knowledge, it is only available under NDA. Therefore, we do not
        want to expose any information about it in the Azure Portal. To
        do this when creating a catalog instance, you need to use a
        special flag. This flag is only needed when creating a catalog.
        (Note: there are limitations to how many catalogs you can create
        in the private preview) It is not needed after that. Once a
        catalog exists, you can go to portal.azure.com without any
        special flags and everything will be fine.

  * **Customer Action -** When creating a catalog instance please
        go to the **Babylon** [instance screen in the Azure portal](https://aka.ms/babylonportal).

  * **Solution -** Once we publicly announce the existence of Projet Babylon this flag will not be necessary.

* Scanning from the UI

  * **Limitation -** We released features in the UX that allow you to set up scans for many Azure data stores. One of the limitations is that the person who is setting up the scan needs to be added to the Catalog resource permissions in the Azure portal as a Contributor in order for the scans to be allowed.

  * **Solution -** Here are the steps you need to take for each person
        who needs to set up scans:

    * Go to the Azure Portal and find your Catalog and click on
            Access control (IAM)

      ![Access Control in Azure portal](./media/product-limitations/access-control.png)

    * Then click on Add a role assignment

      ![Add Role Assignment in Azure portal](./media/product-limitations/role-assignment.png)

    * Then choose Role = Contributor and add the user who is going to be setting up scanning.

      ![Add Role Assignment in Azure portal](./media/product-limitations/add-role-assignment.png)

* On-Premises SQL Server Scanning is not yet available in Babylon as of June 2020. 

* Power BI scan is only available in limited Private Preview. You will need a feature flag to enable it and send an email to BabylonDiscussion\@microsoft.com to get whitelisted. Otherwise it will start the scan but receive no asset.

## Warnings that require customer awareness

* Only five catalogs can be created per Customer subscription per
    region

  * **Limitation -** Currently Babylon has a hard limit on how
        many catalogs it can have per subscription per region.

  * **Solution -** This limitation is expected to continue until
        Public Preview.

* Catalogs can only be created in the regions available at the drop down menu when you create a Babylon account. 

  * **Limitation -** Babylon is only deployed in limited number of regions and we are planning to expand more. That means during Private Preview, your Babylon account can only be created in those regions. This limitation does not prevent the scan from happening. However, the scan process does take samples of your data for classification purposes. There will be implication on moving data across regions if you scan your production data.

  * **Solution - We plan on adding additional regions** Additional
        regions will come online based on customer feedback.

* Schemas for hierarchical files (JSON & XML) are flattened

  * **Limitation -** When scanning hierarchical data structures
        (think JSON and XML) we "flatten" them down. So if you have
        \<foo\>\<bar\>\<blah/\>\</bar\>\</foo\> it will show up as a
        column foo, another column foo/-/bar and a third column
        foo/-/bar/-/blah. So the data is there but in a tabular format.

  * **Solution -** The portal will eventually be able to represent
        these flattened schemas back in their hierarchical format.**

* The Babylon portal includes several inactive features by design
    for the current release.

  * **Limitation -** Several inactive, backlogged features can be
        found in the Babylon web portal. icons for these features are
        set to have 50% opacity so that they are visually distinguished
        from active, functional preview features. The intention is to
        solicit early feedback from customers on feature requirements,
        behaviors, and priorities.

  * **Solution -** Based on customer feedback, most of those
        backlogged features are expected to be available for subsequent
        preview releases.

* Customers will pay for scanning/classification of SQL Server On-Premises once this feature is available in late 2020.

  * **Limitation -** In the current release many aspects of the
        cost of running Babylon are being paid for by Microsoft. One of
        the exceptions is scanning/classification of **SQL Server
        On-Premises**. The reason is that until Babylon managed
        scanning is introduced for SQL Server On-Premises scanning, Babylon will need customers to create their own ADF factory instances
        in their own accounts. This means that any costs associated with
        running those factories are paid out of the customer's
        subscription. For all other Azure data stores that are
        supported, there is no additional cost to private preview
        customers.

  * **Solution -** At some point before Public Preview, Project Babylon is
        expected to support Babylon managed scanning of SQL Server
        On-Premises. That is, customers won't have to create their own
        factory instances. It is worth pointing out however that Babylon may still run these scanning/classification instances in
        the customer's subscription and not in Microsoft's.

* We do not support soft delete on Babylon Accounts
  * **Limitation** - If a customer chooses to delete their Babylon Account then all data is instantly lost without possibility of recovery.
  * **Solution** - When we go to public preview we will support "soft delete" where a deleted Babylon Account will be stored by Microsoft for period of time. Customers can then ask, before the end of the time window (typically 30 days), to have the Babylon Account restored. After the time window the account is irretrievably deleted.