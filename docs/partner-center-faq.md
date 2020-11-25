---
title: Partner Center migration FAQ
description: Microsoft is migrating to a modern management experience for the Office Store program in Partner Center. This article provides answers to frequently asked questions about the migration.
localization_priority: Normal
---

# Partner Center migration FAQ

Microsoft is rolling out a modern management experience for the Microsoft 365 App Store program in Partner Center. Microsoft 365 Add-ins (including Outlook add-ins), SharePoint add-ins, Teams apps, and Power BI visuals will be migrated to Partner Center. This article provides answers to frequently asked questions about the migration.

## Pre-migration FAQ

### When will the move to Partner Center happen for me?
The order in which a partner will be moved will depend on the type, quantity, and metadata complexity of the products in their account. We will bundle like accounts together and adjust the order as needed. A partner account might be moved on any day during the moving period.

### Are there actions I need to take before the move?
No action is required from you before migration. However, we do recommend that you use the opportunity to clean up obsolete draft products in Seller Dashboard to have a clean start in Partner Center.

### Can I still access Seller Dashboard and mange my products during the move?
For most of the process, you’ll be able to access Seller Dashboard as usual; however, during the final step of the move, there will be a brief period during which Seller Dashboard access will be locked and you will not be able to view or edit any products until the move is complete. This will take 10 – 30 minutes on average. In rare cases where migration takes longer than 2 hours, we might opt to revert you back to Seller Dashboard until the blocking issue is resolved. Note: Any changes not saved prior to the move will be lost.

### Can I still access Seller Dashboard after my products are moved to Partner Center?
After the move to Partner Center, you will start managing your products exclusively through Partner Center. Seller Dashboard will no longer be accessible.

### Will all my products on Seller Dashboard be moved to Partner Center?
We will move all the following products from Seller Dashboard to Partner Center:

- Office add-ins
- Outlook add-ins
- SharePoint add-ins
- Teams apps
- Power BI visuals

We will also move client IDs and associated secrets for which the secrets have not expired.

All other products will not be migrated. These are legacy products that are no longer supported in Seller Dashboard.

### How can I get started as a Microsoft 365 app developer?

To get started, [open a developer account](open-a-developer-account.md) in Partner Center. For details about how to build Office solutions, see the following:

- [Office Add-ins documentation](https://docs.microsoft.com/office/dev/add-ins/)
- [SharePoint development](https://docs.microsoft.com/sharepoint/dev/)
- [Microsoft Teams developer platform](https://docs.microsoft.com/microsoftteams/platform/)
- [Power BI visuals](https://docs.microsoft.com/power-bi/developer/power-bi-custom-visuals)

### What if I have additional questions?
Please contact [support](https://support.microsoft.com/supportforbusiness/productselection?sapId=48c74321-b2fa-010b-d0c2-1f8afea90a52) with your questions and they will be addressed by the appropriate team.

## Post-migration FAQ

### If my product(s) failed validation in Seller Dashboard, why isn’t this reflected in Partner Center, and where can I find the validation report?

The validation process is on a new architecture in Partner Center. All the product changes submitted for validation are preserved in Partner Center in draft form. Products that are live on Microsoft AppSource and that failed the last update submission are displayed with Live status in Partner Center, with all unpublished changes intact.  New products that failed validation are displayed with Draft status in Partner Center, with all unpublished changes intact. If you need to refer to the validation report to fix issues before resubmitting and you don’t have the original report, please contact [support](https://support.microsoft.com/supportforbusiness/productselection?sapId=48c74321-b2fa-010b-d0c2-1f8afea90a52) and we’ll resend the last validation report by email.  

### Why don’t my paid products show any pricing or trial information in Partner Center?

Partner Center does not support pricing configuration management.  The Office catalog will retain pricing and trial information from Seller Dashboard and will display it while the Office team works with you to move your solutions from paid to free. In the interim, to update pricing and trial configurations, contact [support](https://support.microsoft.com/supportforbusiness/productselection?sapId=48c74321-b2fa-010b-d0c2-1f8afea90a52). 

### If I didn’t opt out of any markets on Seller Dashboard, why are my products only available in a subset of markets in Partner Center?

Partner Center includes 16 new markets. We would like you to review these markets before you opt in to them. To see the new markets, on the **Availability** page, next to **Markets**, click **Show options**. To opt in to all the new markets, choose the **Select all** option and save. To make your products available in any new markets in the future, select the **Make my product available in any future market** option. 

### Where do I find my client IDs in Partner Center?

In Partner Center, you manage client IDs in the context of a SharePoint solution. To view the client IDs in Partner Center, click the SharePoint solution to view details, and click **Client IDs** in the product details navigation. You can manage and create client IDs and associated secrets on this page. If you configured a client ID that is not linked to any SharePoint solution in Seller Dashboard, we created a placeholder SharePoint solution, using a concatenation of the friendly name and the ID as the solution name (truncated if too long). You can change the name of the placeholder solution by reserving an additional name and [making it the display name](reserve-solution-name.md#choose-product-display-name) in Partner Center. 

### Why is the name of my product different in Partner Center?

Product names in Partner Center must be unique. During the migration, if more than one product has the same name, your product might be renamed. The new name will be a concatenation of the Seller Dashboard product ID and the product name; for example, {SellerDashboardID}{ProductName}. After your product is migrated, you can rename it. For details, see [Reserve a name for your solution](reserve-solution-name.md).

### What if I have additional questions?
Please contact [support](https://support.microsoft.com/supportforbusiness/productselection?sapId=48c74321-b2fa-010b-d0c2-1f8afea90a52) with your questions and they will be addressed by the appropriate team.


