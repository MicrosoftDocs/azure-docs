---
title: Add-in setup
description: 
localization_priority: Normal
---

# Add-in setup

On the Add-in setup page, you can indicate whether you want your add-in to be available in the Apple Store,provide authorization information, and add lead management details.

## Setup details

If you want your add-in to be available in the Apple Store, select the **iOS** check box.

> [!NOTE]
> To make your add-in available for iOS, you must set up your Apple ID on the [Account settings](https://partner.microsoft.com/dashboard/account/management) page. If you add your ID in Account settings, remember to refresh the **Add-in setup** page.

If your add-in requires the additional purchase of a service, either through a third-party commerce platform or Microsoft SaaS, select the **Associated service purchase** check box.

## Authorization

If your add-in requires Azure Active Directory (Azure AD), you must check the box in the Authorization section and specify your target Office 365 plan. Your add-in requires Azure AD if it targes a specific national cloud, or if it uses single sign-on (SSO) or Microsoft Graph. 

When you select the check box, you must select one of the following target plans:
- Office 365 or Office 365 Education
- Office 365 operated by 21Vianet
- Office 365 Germany
- Office 365 U.S. Government

> [!Note]
> Add-ins that require Azure AD might be subject to additional validation requirements during the certification process.

## Lead management

To get information about users who acquire your add-in, you can submit lead configuration details for your customer relationship management (CRM) system in Partner Center. 

You can use leads to follow up with customers directly to ensure that they have a successful experience with your solution. 

For customers who acquire your add-in via AppSource, the following details are sent to your lead management system:

- First Name
- Last Name
- Email Address

> [!NOTE]
> Leads are currently supported for acquisitions made via AppSource, as well as Word, Excel, and PowerPoint stores.

### Add lead management information

To add your lead management details:

1. On the **Add-in setup** page, under **Lead Management**, choose **Connect**.
2. In the **Connection details** box, choose a lead destination:
    - Azure Blob
    - Azure Table
    - Dynamics CRM Online
    - HTTPS Endpoint
    - Marketo
    - Salesforce
3. Add the connection details and select **Save**.

The steps to complete your lead submission process varies based on the CRM system provider that you choose. For details, see the following sections.

> [!NOTE]
> If your CRM system provider is not listed, we recommend that you select Azure Table. Most popular CRM services can integrate with this storage service.

#### Azure Blob

Select **Azure Blob** to output lead information in a CSV format within an Azure-hosted blob. To get started with Azure, see [Create your free Azure account](https://azure.microsoft.com/en-us/free/).

You must submit a **Connection String** value as well as a **Container Name** value to submit your lead management details. To find or generate these values:

1. In the [Azure portal](https://ms.portal.azure.com/), select the storage account the lead should be sent to. To create a new storage account, select **Storage accounts** in the left navigation, and then select **Add** in the top-left corner of the header.

2. Under **Settings**, select **Access Keys**.

3. Copy the storage account key shown under **Primary Connection String**.

4. Paste this string in the **Storage account connection string** field in Partner Center.

5. In the Blob Services section for the same storage account, select **Containers**.

6. Select the container that you want to send the CSV data to, or create a new container.

7. Copy the **Name** of the container.

8. Paste this string in the **Container Name** field in Partner Center.

#### Azure Table

Select **Azure Table** to output lead information into a Microsoft Azure-hosted storage table. To get started with Azure, see [Create your free Azure account](https://azure.microsoft.com/en-us/free/).

You must submit a **Connection String** value to submit your lead management details. To find or generate this value:

 1. In the [Azure portal](https://ms.portal.azure.com/), select the storage account the lead should be sent to. To create a new storage account, select **Storage accounts** in the left navigation, and then select **Add** in the top-left corner of the header.
 
 2. Under **Settings**, select **Access Keys**.
 
 3. Copy the storage account key shown under **Primary Connection String**.
 
 4. Paste this string into the **Storage account connection string** field in Partner Center.

#### Dynamics CRM Online

For Microsoft Dynamics CRM systems, you need to provide the following information:

- CRM URL
- Authentication:
    - Choose **Office 365**, and provide a **User name** and **Password**. You must update your username and password every 90 days.

For information about setting up a new Dynamics service for leads, see the [Appsource Dynamics documentation](https://aka.ms/leadsettingfordynamicscrm).

> [!NOTE]
> To configure Dynamics CRM for leads, some services require the user to be an admin on your Dynamics CRM instance, and a tenant admin to create a new service account.  

#### HTTPS Endpoint

Provide the **HTTPS endpoint URL**.

#### Marketo

To direct your lead information to a Marketo CRM system, you need to provide the following values:

- Server ID 
- Munchkin account ID
- Form ID

To find these values:

1. Go to **Design Studio** within Marketo.

2. Select **New Form**.

3. Fill in the fields in the New Form pop-up window.

4. Select **Finish** on the Field Details form. Approve and close the form.

5. Under **Form Actions**, select **Embed Code**.

6. Within the embed code, look for the line similar to the following:

	 `<script>MktoFormsExample.loadForm("//app-ys11.marketo.com", "123-PQR-789", 1169);</script>`

7. Extract the applicable values. 

   In this example, the following are the values to extract.

   |**Parameter name**|**Example value**|
   |:-----|:-----|
   |Server ID|1169|
   |Munchkin account ID|123-PQR-789|
   |Form ID|ys11|

8. Submit these values in Partner Center. 

#### Salesforce

To direct your lead information to a Salesforce CRM system, you need to provide an **Organization ID** value. To find this value:

 1. In your Salesforce CRM system, go to **Setup** > **Administration** > **Company** > **Company information**.
 
 2. Copy the field that starts with **00D**. This is the unique identifier for your Salesforce identity.

 3. Paste the value into the **Organization ID** field in Partner Center.


### Submit your lead management details

After you have enter the connection details in Partner Center, select **Save**. 

If you get an error message, make sure that your details are correct or try again later. 

> [!NOTE]
> If your add-in is already in AppSource, your lead management details are saved regardless of whether your submission passes validation. You don't have to resubmit lead management details unless you want to update the CRM or storage service that your leads are sent to.

To edit your lead management details, on **Add-in setup** page, choose **Edit**.

### Communication guidelines

Make sure that any correspondence you send to customers includes an option to unsubscribe from future communications. 

## See also

- [Create your AppSource listing](office-store-listing.md)
- [AppSource submission FAQ](office-store-submission-faq.md)
