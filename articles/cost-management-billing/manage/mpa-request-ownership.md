---
title: Transfer Azure product billing ownership to your Microsoft Partner Agreement (MPA)
description: Learn how to request billing ownership of Azure billing products from other users for a Microsoft Partner Agreement (MPA).
author: bandersmsft
ms.reviewer: amberbhargava
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/10/2023
ms.author: banders
---

# Transfer Azure product billing ownership to your Microsoft Partner Agreement (MPA)

An Azure Expert MSP can request to transfer their customer's Enterprise subscriptions and reservations to the Microsoft Partner Agreement (MPA) that they manage. 

Supported product (subscriptions and reservations) billing ownership transfer options include:

- A direct Enterprise Agreement transfer to an Azure plan under the MPA
- An enterprise Microsoft Customer Agreement transfer to an Azure plan under the MPA

> [!NOTE]
> Indirect Enterprise Agreement transfers to an Azure plan under an MPA aren't supported.

This feature is available only for CSP Direct Bill Partners certified as [Azure Expert MSP](https://partner.microsoft.com/membership/azure-expert-msp). It's subject to Microsoft governance and policies and might require review and approval for certain customers.

This article applies to billing accounts for Microsoft Partner Agreements. These accounts are created for Cloud Solution Providers (CSPs) to manage billing for their customers in the new commerce experience. The new experience is only available for partners, who have at least one customer that has accepted a Microsoft Customer Agreement (MCA) and has an Azure Plan. [Check if you have access to a Microsoft Partner Agreement](#check-access-to-a-microsoft-partner-agreement).

When you send or accept a transfer request, you agree to terms and conditions. For more information, see [Transfer terms and conditions](subscription-transfer.md#transfer-terms-and-conditions).

There are three options to transfer products:

- Transfer only subscriptions
- Transfer only reservations
- Transfer both subscriptions and reservations

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

## Prerequisites

1. Establish [reseller relationship](/partner-center/request-a-relationship-with-a-customer) with the customer.
    1. Make sure that both the customer and Partner tenants are within the same authorized region. Check [CSP Regional Authorization Overview](/partner-center/regional-authorization-overview).
    1. [Confirm that the customer has accepted the Microsoft Customer Agreement](/partner-center/confirm-customer-agreement).
1. Set up an [Azure plan](/partner-center/purchase-azure-plan) for the customer. If the customer is purchasing through multiple resellers, you need to set up an Azure plan for each combination of a customer and a reseller.

When there's is a currency change during or after an EA enrollment transfer, reservations paid for monthly are canceled for the source enrollment. Cancellation happens at the time of the next monthly payment for an individual reservation. The cancellation is intentional and only affects monthly, not up front, reservation purchases. For more information, see [Transfer Azure Enterprise enrollment accounts and subscriptions](ea-transfers.md#prerequisites-1).

Before you begin, make sure that the people involved in the product transfer have the required permissions. 

### Required permission for the transfer requestor

To request the billing ownership, you must have **Global Admin** or **Admin Agents** role. To learn more, see [Partner Center - Assign users roles and permissions](/partner-center/permissions-overview).

### Required permission for the subscription transfer recipient 

The subscription product owner (transfer request recipient) must have one of the following permissions:

- For a Microsoft Customer Agreement, the person must have an owner or contributor role for the billing account or for the relevant billing profile or invoice section. For more information, see [Billing roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).
- For an Enterprise Agreement, the person must be an account owner or EA administrator. 

### Required permission for the reservation transfer recipient

The reservation product owner (transfer request recipient) must have one of the following permissions:

- For a Microsoft Customer Agreement, the person must have an owner or contributor role for the billing account or for the relevant billing profile or invoice section. For more information, see [Billing roles and tasks](understand-mca-roles.md#invoice-section-roles-and-tasks).
- For an Enterprise Agreement, the person must be an EA administrator.

## Request billing ownership

1. Sign in to the [Azure portal](https://portal.azure.com) using CSP Admin Agent credentials in the CSP tenant.
1. Search for **Cost Management + Billing**.  
    ![Screenshot that shows Azure portal search for cost management + billing to request billing ownership.](./media/mpa-request-ownership/search-cmb.png)
1. Select **Customers** from the left-hand side and then select a customer from the list.  
    [![Screenshot that shows selecting customers](./media/mpa-request-ownership/mpa-select-customers.png)](./media/mpa-request-ownership/mpa-select-customers.png#lightbox)
1. Select **Transfer requests** from the lower-left side and then select **Add a new request**.  
    [![Screenshot that shows selecting transfer requests](./media/mpa-request-ownership/mpa-select-transfer-requests.png)](./media/mpa-request-ownership/mpa-select-transfer-requests.png#lightbox)
1. Enter the email address of the user in the customer organization who will accept the transfer request. Select **Send transfer request**.  
    [![Screenshot that shows sending a transfer request](./media/mpa-request-ownership/mpa-send-transfer-requests.png)](./media/mpa-request-ownership/mpa-send-transfer-requests.png#lightbox)


## Review and approve transfer request

The recipient of the transfer request uses the following procedure to review and approve the transfer request. They can choose to:

- Transfer one or more subscriptions only
- Transfer one or more reservations only
- Transfer both subscriptions and reservations

1. The user gets an email with instructions to review your transfer request. Select **Review the request** to open it in the Azure portal.  
    :::image type="content" source="./media/mpa-request-ownership/mpa-review-transfer-request-email.png" alt-text="Screenshot that shows review transfer request email." lightbox="./media/mpa-request-ownership/mpa-review-transfer-request-email.png" :::  
    If the transfer recipient’s user account doesn’t have email enabled, the person that created the request can manually give the target recipient a link to accept the transfer request after the request is created. The person that created the request can navigate to Transfer status page, copy it, and then manually give it to the recipient.  
        :::image type="content" source="./media/mpa-request-ownership/transfer-status-pending-link.png" alt-text="Screenshot showing the Transfer status where you can copy the transfer link sent to the recipient." lightbox="./media/mpa-request-ownership/transfer-status-pending-link.png" :::
1. In the Azure portal, the user selects the billing account that they want to transfer Azure products from. Then they select eligible subscriptions on the **Subscriptions** tab. If the owner doesn’t want to transfer subscriptions and instead wants to transfer reservations only, make sure that no subscriptions are selected.
    :::image type="content" source="./media/mpa-request-ownership/review-transfer-request-subscriptions-select.png" alt-text="Screenshot showing the Subscriptions tab." lightbox="./media/mpa-request-ownership/review-transfer-request-subscriptions-select.png" :::  
    *Disabled subscriptions can't be transferred.*
1. If there are reservations available to transfer, select the **Reservations** tab and then select them. If reservations won’t be transferred, make sure that no reservations are selected.
If reservations are transferred, they're applied to the scope that’s set in the request. If you want to change the scope of the reservation after it’s transferred, see [Change the reservation scope](../reservations/manage-reserved-vm-instance.md#change-the-reservation-scope).
    :::image type="content" source="./media/mpa-request-ownership/review-transfer-request-reservations-select.png" alt-text="Screenshot showing the Reservations tab." lightbox="./media/mpa-request-ownership/review-transfer-request-reservations-select.png" :::
1. Select the **Review request** tab and verify the information about the products to transfer. If there are Warnings or Failed status messages, see the following information. When you're ready to continue, select **Transfer**.   
    :::image type="content" source="./media/mpa-request-ownership/review-transfer-request-complete.png" alt-text="Screenshot showing the Review request tab where you review your transfer selections." lightbox="./media/mpa-request-ownership/review-transfer-request-complete.png" :::
1. You'll briefly see a `Transfer is in progress` message. When the transfer is completed successfully, you'll see the Transfer details page with the `Transfer completed successfully` message.  
    :::image type="content" source="./media/mpa-request-ownership/transfer-completed-successfully.png" alt-text="Screenshot showing the Transfer completed successfully page." lightbox="./media/mpa-request-ownership/transfer-completed-successfully.png" :::

On the Review request tab, the following status messages might be displayed.

* **Ready to transfer** - Validation for this Azure product has passed and can be transferred.
* **Warnings** - There's a warning for the selected Azure product. While the product can still be transferred, doing so will have some consequence that the user should be aware of in case they want to take mitigating actions. For example, the Azure subscription being transferred is benefitting from a reservation. After transfer, the subscription will no longer receive that benefit. To maximize savings, ensure that the reservation is associated to another subscription that can use its benefits. Instead, the user can also choose to go back to the selection page and unselect this Azure subscription. Select **Check details** for more information.
* **Failed** - The selected Azure product can't be transferred because of an error. User will need to go back to the selection page and unselect this product to transfer the other selected Azure products.  


## Check the transfer request status

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Cost Management + Billing**.  
    ![Screenshot that shows Azure portal search for cost management + billing to request transfer status.](./media/mpa-request-ownership/billing-search-cost-management-billing.png)
1. Select **Customers** from the left-hand side.  
    [![Screenshot that shows selecting customers](./media/mpa-request-ownership/mpa-select-customers.png)](./media/mpa-request-ownership/mpa-select-customers.png#lightbox)
1. Select the customer from the list for which you sent the transfer request.
1. Select **Transfer requests** from the lower-left side. The Transfer requests page displays the following information:
    [![Screenshot that shows list of transfer requests](./media/mpa-request-ownership/mpa-select-transfer-requests-for-status.png)](./media/mpa-request-ownership/mpa-select-transfer-requests-for-status.png#lightbox)

   |Column|Definition|
   |---------|---------|
   |Request date|The date when the transfer request was sent|
   |Recipient|The email address of the user that you sent the request to transfer billing ownership|
   |Expiration date|The date when the request expires|
   |Status|The status of transfer request|

    The transfer request can have one of the following states:

   |Status|Definition|
   |---------|---------|
   |In progress|The user hasn't accepted the transfer request|
   |Processing|The user approved the transfer request. Billing for the products that the user selected is getting transferred to your account|
   |Completed| The billing for products that the user selected is transferred to your account|
   |Finished with errors|The request completed but billing for some products that the user selected couldn't be transferred|
   |Expired|The user didn't accept the request on time and it expired|
   |Canceled|Someone with access to the transfer request canceled the request|
   |Declined|The user declined the transfer request|

1. Select a transfer request to view details. The transfer details page displays the following information:
   [![Screenshot that shows list of transferred subscriptions](./media/mpa-request-ownership/mpa-transfer-completed.png)](./media/mpa-request-ownership/mpa-transfer-completed.png#lightbox)

   |Column  |Definition|
   |---------|---------|
   |Transfer request ID|The unique ID for your transfer request. If you submit a support request, share the ID with Azure support to speed up the support request|
   |Transfer requested on|The date when the transfer request was sent|
   |Transfer requested by|The email address of the user who sent the transfer request|
   |Transfer request expires on| The date when the transfer request expires|
   |Recipient's email address|The email address of the user that you sent the request to transfer billing ownership|
   |Transfer link sent to recipient|The URL that was sent to the user to review the transfer request|

## Supported subscription types

You can request billing ownership of the following subscription types.

* [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/)¹
* [Microsoft Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/)
* Azure Plan¹ [(Microsoft Customer Agreement in Enterprise Motion)](https://www.microsoft.com/Licensing/how-to-buy/microsoft-customer-agreement)

¹ You must convert an EA Dev/Test subscription to an EA Enterprise offer using a support ticket and respectively, an Azure Plan Dev/Test offer to Azure plan. A Dev/Test subscription will be billed at a pay-as-you-go rate after conversion. There's no discount currently available through the Dev/Test offer to CSP partners.

## Additional information

The following section provides additional information about transferring subscriptions.

### No service downtime

Azure services in the subscription keep running without any interruption. We only transition the billing relationship for the Azure subscriptions that the user selects to transfer.

### Disabled subscriptions

Disabled subscriptions can't be transferred. Subscriptions must be in active state to transfer their billing ownership.

### Azure resources transfer

All resources from the subscriptions like VMs, disks, and websites transfer. When transferred, subscription IDs and resource IDs are preserved. 

### Azure Marketplace products transfer

Azure Marketplace products, which are available for subscriptions that are managed by Cloud Solution Providers (CSPs) are transferred along with their respective subscriptions. Subscriptions that have Azure Marketplace products that aren't enabled for CSPs can't be transferred.

### Access to Azure services

Access for existing users, groups, or service principals that was assigned using [Azure role-based access control (Azure RBAC role)](../../role-based-access-control/overview.md) isn't affected during the transition. The partner won’t get any new Azure RBAC role access to the subscriptions.

The partners should work with the customer to get access to subscriptions. The partners need to get either Admin on Behalf Of - AOBO or [Azure Lighthouse](../../lighthouse/concepts/cloud-solution-provider.md) access open support tickets.

### Power BI connectivity

The Cost Management connector for Power BI supports Enterprise Agreements, direct Microsoft Customer Agreements and Microsoft Partner Agreements on Billing Account and Billing Profile scopes. For more information about Cost Management connector support, see [Create visuals and reports with the Cost Management connector in Power BI Desktop](/power-bi/connect-data/desktop-connect-azure-cost-management). After you transfer a subscription from one of the agreements to a Microsoft Partner Agreement, your Power BI reports stop working.

As an alternative, you can always use Exports in Cost Management to save the consumption and usage information and then use it in Power BI. For more information, see [Create and manage exported data](../costs/tutorial-export-acm-data.md).

### Azure support plan

Azure support doesn't transfer with the subscriptions. If the user transfers all Azure subscriptions, ask them to cancel their support plan. After the transfer, CSP partner is responsible for the support. The customer should work with CSP partner for any support request.  

### Charges for transferred subscription

Any charges after the time of transfer appear on the new account's invoice. Charges before the time of transfer appear on the previous account's invoice.

The original billing owner of the subscriptions is responsible for any charges that were reported up to the time that the transfer completes. Your invoice section is responsible for charges reported from the time of transfer onwards. There may be some charges that happened before the transfer but were reported afterward. The charges appear on your invoice section.

### Cancel a transfer request

You can cancel the transfer request until the request is approved or declined. To cancel the transfer request, go to the [transfer details page](#check-the-transfer-request-status) and select cancel from the bottom of the page.

### Software as a Service (SaaS) transfer

SaaS products don't transfer with the subscriptions. Ask the user to [Contact Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to transfer billing ownership of SaaS products. Along with the billing ownership, the user can also transfer resource ownership. Resource ownership lets you do management operations like deleting and viewing the details of the product. User must be a resource owner on the SaaS product to transfer resource ownership.

### Additional approval for certain customers

Some of the customer transition requests may require an additional review process with Microsoft because of the nature of the current enterprise enrollment structure of the customer. The partner will be notified of such requirements when trying to send an invitation to customers. Partners are requested to work with their Partner Development Manager and Customer’s account team to complete this review process.

### Azure subscription directory

The Microsoft Entra directory (tenant) of the Azure subscriptions that are transferred must be the same Microsoft Entra directory of the customer that was selected while establishing the CSP relationship.

If these two directories aren't the same, the subscriptions couldn't be transferred. You need to either establish a new CSP reseller relationship with the customer by selecting the directory of the Azure subscriptions or change the directory of Azure subscriptions to match with the customer CSP relationship directory. For more information, see [Associate an existing subscription to your Microsoft Entra directory](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md#to-associate-an-existing-subscription-to-your-azure-ad-directory).

### EA subscription in the non-organization directory

The EA subscriptions from non-organization directories can be transferred as long as the directory has a reseller relationship with the CSP. If the directory doesn’t have a reseller relationship, you need to make sure to have the organization user in the directory as a *Global Administrator* who can accept the partner relationship. The domain name portion of the username must either be the initial default domain name *[domain name].onmicrosoft.com* or a verified, non-federated custom domain name such as *contoso.com*.  

To add a new user to the directory, see [Quickstart: Add new users to Microsoft Entra ID to add the new user to the directory](../../active-directory/fundamentals/add-users-azure-active-directory.md).

## Check access to a Microsoft Partner Agreement

[!INCLUDE [billing-check-mpa](../../../includes/billing-check-mpa.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

* The billing ownership of the Azure products is transferred to you. Keep track of the charges for these products in the [Azure portal](https://portal.azure.com).
* Work with the customer to get access to the transferred Azure products. [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
