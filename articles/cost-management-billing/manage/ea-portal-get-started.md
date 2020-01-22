---
title: Get started with the Azure EA portal
description: This article explains how Azure EA customers use the Azure EA portal.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 01/03/2020
ms.topic: conceptual
ms.service: cost-management-billing
manager: boalcsva
---

# Get started with the Azure EA portal

This article helps direct and indirect Azure EA customers to start using the [Azure EA portal](https://ea.azure.com) with basic information about:

- How the Azure EA portal is structured.
- Roles used in the Azure EA portal.
- How to start creating subscriptions.
- Analyze costs in the Azure EA portal and the Azure portal.

Here's a video that shows a full Azure EA portal onboarding session:

[Azure EA portal onboarding video ](https://www.youtube.com/watch?v=OiZ1GdBpo-I)

>[!VIDEO https://www.youtube.com/embed/OiZ1GdBpo-I]

## Azure EA portal hierarchy

The Azure EA portal hierarchy consists of:

**Microsoft Azure EA portal** - The Azure EA portal is an online management portal that helps you manage costs for your Azure EA services. You use it to create an Azure EA hierarchy including departments, accounts, and subscriptions. You also use it to reconcile the costs of your consumed services, download usage reports, and view price lists. And, you create API keys for your enrollment.

**Departments** - You create departments to help segment costs into logical groupings and then set a budget or quota at the department level.

**Accounts** – Accounts are organizational units in the Azure EA portal and they're used to manage subscriptions. Accounts also used for reporting.

**Subscriptions** – Subscriptions are the smallest unit in the Azure EA portal. They're containers for Azure services managed by the service administrator.

The following diagram illustrates simple Azure EA hierarchies.

![Diagram of simple Azure EA hierarchies](./media/ea-portal-get-started/ea-hierarchies.png)

## Enterprise user roles

To administer the Azure services in your enrollment, there are five distinct enterprise administrative user roles:

- Enterprise administrator
- Department administrator
- Account owner
- Service administrator
- Notification contact

Roles are used to complete tasks in two different Microsoft Azure portals. The Azure EA portal (https://ea.azure.com) is used to help you to manage billing and costs. The Azure portal (https://portal.azure.com) is used to manage Azure services.

User roles are associated with a user account. To validate user authenticity, each user must have a valid Work, School, or Microsoft Account. Ensure that each account is associated with an email address that's actively monitored. Account notifications are sent to the email address.

When setting up users, you can assign multiple Work, School, or Microsoft accounts to the Enterprise Administrator role. However, you can assign only one Work, School, or Microsoft account to the Account Owner role. Additionally, a single Work, School, or Microsoft account can have both the Enterprise Administrator and Account Owner roles applied to it.

### Enterprise administrator

The enterprise administrator role has the highest level of access. Users with the role can:

- Manage accounts and account owners
- Manage other enterprise administrators
- Manage department administrators
- Manage notification contacts
- View usage across all accounts
- View unbilled charges across all accounts

You can have multiple enterprise administrators in an enterprise enrollment. You can grant read-only access to enterprise administrators. They all inherit the department administrator role.

### Department administrator

Users with the role can:

- Create and manage departments
- Create new account owners
- View usage details for the departments that they manage
- View costs, if granted necessary permissions

You can have multiple department administrators for each enterprise enrollment.

You can grant department administrators read-only access. To grant read-only access, edit or create a new department administrator and set the read-only option to **Yes**.

### Account owner

Users with the role can:

- Create and manage subscriptions
- Manage service administrators
- View usage for subscriptions

Each account requires a unique Work, School, or Microsoft Account. For more information about Azure EA Portal administrative roles, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

### Service administrator

The service administrator has permissions to manage services in the Azure portal and assign users to the coadministrator role.

### Notification contact

The notification contact receives usage notifications related to the enrollment.

## Activate your enrollment

To activate your service, the initial enterprise administrator opens the Azure EA portal at [https://ea.azure.com](https://ea.azure.com) and signs in using the email address from the invitation email.

If you’ve been set up as the EA administrator, you don’t need to receive the activation email to log on to the Azure EA portal. You can proceed to [https://ea.azure.com](https://ea.azure.com) and log on with your email address (either work, school, or live ID) and password.

If you have more than one enrollment, choose one to activate. By default, only active enrollments are shown. To view enrollment history, clear the **Active** option in the top right of the Azure EA portal.

Under Enrollment, the status shows **Active**.

![Example showing an active enrollment](./media/ea-portal-get-started/ea-enrollment-status.png)

Only existing Azure enterprise administrators can create other enterprise admins.

### Create another enterprise admin

- Sign in to [Azure EA portal](https://ea.azure.com)  and navigate to **Manage** > **Enrollment Detail** and click **+ Add Administrator** in the top-right corner of the page.

Make sure that you have the user's email addresses and preferred authentication method, such as Work or School authentication or Microsoft account. You need the information to add a user.

If you're not the EA administrator, contact an EA administrator to request that they add you to an enrollment. After you're added to an enrollment, you receive an activation email.

If your EA administrator can't assist you, create an [Azure EA portal support request](https://support.microsoft.com/supportrequestform/cf791efa-485b-95a3-6fad-3daf9cd4027c). Provide the following information:

- Enrollment number
- Email address to add and authentication type (Work, School, or Microsoft account)
- Email approval from an existing EA administrator
  - If the existing EA admin isn't available, contact your partner or software advisor to request that they change the contact details through the VLSC tool.

For more information about enterprise administrative roles, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

## Create an Azure EA department

Enterprise administrators and department administrators use departments to organize and report on enterprise Azure services and usage by department and cost center. The enterprise administrator can:

- Add or remove departments
- Associate an account to a department
- Create department administrators
- Allow department administrators to view price and costs

A department administrator can add new accounts to their departments. They can remove accounts from their departments, but not from the enrollment.

To add a department:

1. In the left navigation area, click **Manage**.
2. Click the **Department** tab, then click **+ Add Department** and then enter the required information.
3. The Department name is the only required field. It must be at least three characters.
4. When complete, click **Add**.

## Add a department admin

After a department is created, the Azure enterprise administrator can add department administrators and associate each one to a department. The department administrator can:

- Create other department administrators
- View and edit department properties like name or cost center
- Add an account for their departments
- Remove accounts from their departments
- Download usage details for their departments
- View the monthly usage and charges for their department if an enterprise administrator has granted them permission <sup>1</sup>

### To add a department admin

As an enterprise administrator:

1. In the left navigation area, click **Manage**.
2. Click the **Department** tab and then click the department.
3. Click **+ Add Administrator** and add the required information.
4. For read-only access, set the **Read-Only** option to **Yes** and then click **Add**.

![Example showing the Add Department Administrator dialog](./media/ea-portal-get-started/ea-create-add-department-admin.png)

### To set read-only access

You can grant read-only access to department administrators. When creating a new department administrator:

- Set the read-only option to **Yes**.

To edit an existing department administrator:

1. Select a department and then click the pencil symbol next to the **Department Administrator** that you want to edit.
2. Set the read-only open to **Yes**. and then click **Save**.

Users with the enterprise administrator role automatically get department administrator permissions.

<sup>1</sup> If you were given permission to view department monthly usage and charges but can't see them, contact your partner.

## Add an account

Account and subscription structure impact how they're administered and how they appear on your invoices and reports. Examples of typical organization include structuring by business divisions, functional teams, and geographic locations.

To add an account:

1. In the Azure EA portal, click **Manage** in the left navigation area.
2. Click the **Account** tab and then on the **Account** page, click **+Add Account**.
3. Select a department, or leave it as unassigned, and then select desired authentication type.
4. Type a friendly name to use to identify the account in reporting.
5. Type the **Account Owner Email** address to associate with the new account.
6. Confirm the email address and then click **Add**.

![Example showing the list of accounts and the +Add Account option](./media/ea-portal-get-started/create-ea-add-an-account.png)

You can add another account by clicking **Add Another Account**, or you can click **Add** at the bottom-right corner of the left toolbar.

To confirm account ownership:

1. Sign in to the Azure EA portal.
1. Confirm account ownership by viewing the status. The status should change from **Pending** to **Start/End date**. The Start/End date is the date the user first signed in and the agreement end date.
1. When the 'Warning' message pops up, an account owner needs to click **Continue** to activate the account the first time they sign in to the Azure EA portal.


## Change account owner

Enterprise administrators can use the Azure EA portal to transfer subscription account ownership in an enrollment. The action moves all subscriptions from a source user account a destination user account.

Important points about transferring user account information:

- Transfers from a Work or School account to another Work or School account are supported.
- Transfers from a Microsoft account to a Work or School account are supported.
- Transfers from a Work or School account to a Microsoft account are not supported.
- Transfers from a Microsoft account to another Microsoft account are supported. The target account must be a valid Azure Commerce account to be a valid target for transfers. For new accounts, you are asked to create an Azure Commerce account when signing in to the Azure EA portal. For existing accounts, you must first create a new Azure subscription before the account is eligible.
- When you complete a subscription transfer, Microsoft updates the account owner.

Role-based access control policies:

- Only Azure subscription transfers between two organizational IDs in the same tenant preserve existing Azure role-based access control (RBAC) policies, service administrator role assignments, and coadministrator role assignments. Other subscription transfers result in losing your RBAC policies and service administrator coadministrator role assignments. Policies and administrator roles don't transfer across different directories. Service administrators are updated to the owner of destination account.
- When you perform subscription transfers between two organizational IDs in the same tenant, RBAC policies and existing service administrator and coadministrator roles are preserved.

Before changing an account owner:

1. View the **Account** tab and identify the source account. The source account must be active.
2. Identify the destination account. It must be active.

To transfer account ownership for all subscriptions:

1. In the left navigation area, click **Manage**.
2. Click the **Account** tab and hover over an account.
3. Click the change account owner symbol on the right. The symbol resembles a person.
4. Select an eligible account and then click **Next**.
5. Confirm the transfer and click **Submit**.

![Image showing the Change Account Owner symbol](./media/ea-portal-get-started/create-ea-create-sub-transfer-account-ownership-of-sub.png)

To transfer account ownership for a single subscription:

1. In the left navigation area, click **Manage**.
2. Click the **Account** tab and hover over an account.
3. Click the transfer subscriptions symbol on the right. The symbol resembles a page.
4. Select an eligible subscription and then click **Next**.
5. Confirm the transfer and then click **Submit**.

![Image showing the Transfer Subscriptions symbol](./media/ea-portal-get-started/ea-transfer-subscriptions.png)

Here's a video that shows Azure EA portal user management:

[Azure EA portal user management video](https://www.youtube.com/watch?v=621jVkvmwm8)

>[!VIDEO https://www.youtube.com/embed/621jVkvmwm8]

## Create a subscription

Account owners can view and manage subscriptions. You can use subscriptions to give teams in your organization access to development environments and projects. For example test, production, development, and staging. When you create different subscriptions for each application environment, you help secure each environment. You can also assign a different service administrator account for each subscription. You can associate subscriptions with any number of services. The account owner creates subscriptions and assigns a service administrator account to each subscription in their account.

### Add a subscription

Use the following information to add a subscription.

The first time you add a subscription to your account, you're asked to accept the MOSA agreement and a rate plan. Although they aren't applicable to Enterprise Agreement customers, they're needed to create your subscription. Your Microsoft Azure Enterprise Agreement Enrollment Amendment supersedes the above items and your contractual relationship doesn't change. When prompted, select the box indicating that you accept the terms.

All new subscriptions are created with the default subscription name of _Microsoft Azure Enterprise_. You can update the subscription name to differentiate it from the other subscriptions in your enrollment. And, to ensure that it's recognizable in reports at the enterprise level.

To add a subscription:

1. In the Azure EA portal, sign in to the account.
2. Click the **Admin** tab and then click **Subscription** at the top of the page.
2. Verify that you're signed in as the account owner of the account.
3. Click **+Add Subscription** and then click **Purchase**.
  The first time you add a subscription to an account, you must provide your contact information. When adding additional subscriptions, your contact information is added for you.
4. Click **Subscriptions**, then select the subscription you created, and then click **Edit Subscription Details**.
5. Update the **Subscription Name** and **Service Administrator** then select the checkmark.
  The subscription name appears on reports and is the name of the project associated with the subscription in the development portal.

New subscriptions can take up to 24 hours to appear in the subscriptions list. After you've created a subscription, you can:

- [Edit subscription details](https://account.azure.com/Subscriptions)
- [Manage subscription services](https://portal.azure.com/#home)

## Transfer EA subscription to pay as you go subscription

To transfer an EA subscription to an individual subscription with pay-as-you-go rates, you must create a new support request in the Azure EA portal. To create a support request, click **+ New support request** in the Help and Support area.

## Associate an existing account with your pay as you go subscription

If you already have an existing Microsoft Azure account on the Microsoft Azure portal, enter the associated Microsoft account or work or school account in order to associate it with your Enterprise Agreement enrollment.

### Associate an existing account

1. From the Enterprise Portal, click **Manage**.
1. Click the **Account** tab.
1. Click **+Add an account**.
1. Enter the Microsoft account or work or school account associated with the existing account.
1. Confirm the Microsoft account or work or school account associated with the existing account.
1. Provide a name you would like to use to identify this account in reporting.
1. Click **Add**.
1. You can add an additional account by selecting the **+Add an Account** option again, or return to the homepage by selecting the **Admin** button.
1. If you click to view the **Account** page, the newly added account will appear in a **Pending** status.

### Confirm account ownership

1. Log into the email account associated to the Microsoft account or work or school account you provided.
1. Open the email notification titled _"Invitation to Activate your Account on the Microsoft Azure Service from Microsoft Volume Licensing"_.
1. Click the **Log into the Microsoft Azure Enterprise Portal** link in the invitation.
1. Click **Sign in**.
1. Enter your Microsoft account or work or school account and password to sign in and confirm account ownership.

### Azure Marketplace

Although most subscriptions convert from Pay-as-You-Go environment to Enterprise Azure, Azure Marketplace services do not. In order to have a single view of all subscriptions and charges, we recommend you add the Azure Marketplace services to the Enterprise Portal:

1. Click **Manage** on the left navigation.
1. Click the **EnrollmentTab**.
1. View the Enrollment Detail section.
1. To the right of the Azure Marketplace field, click the pencil icon to enable, and hit **Save**.

The account owner can now purchase Azure Marketplace subscriptions previously owned in pay-as-you-go.

Once new Azure Marketplace subscriptions are activated under your enrollment, cancel the Marketplace subscriptions created in the pay-as-you-go environment. This step is critical so that your Marketplace subscriptions do not fall into a bad state when your pay-as-you-go payment instrument expires.

### MSDN

MSDN subscriptions are automatically converted to MSDN Dev/Test and the EA offer will lose any existing monetary credit.

### Azure in Open

Associating an Azure in Open subscription with an EA will forfeit any unconsumed Azure in Open credits. To avoid any potential forfeiture of credit, it is recommended that customers consume all credit on an Azure in Open subscription prior to adding the account to their EA.  

### Accounts with Support Subscriptions

When adding existing accounts to the Enterprise Portal that have a support subscription (and don't already have an EA support subscription), please note that the MOSA support subscription does not automatically transfer and support will need to be repurchased in EA. A grace period for support coverage will be provided through the end of the subsequent month to allow time to reorder support.

## View usage summary and download reports

Enterprise administrators can view a summary of their usage data, monetary commitment consumed, and charges associated with additional usage in the Azure EA portal. Charges are presented at the summary level across all accounts and subscriptions.

To view detailed usage for specific accounts:

Download the Usage Detail report. Click **Reports** and then click the **Download Usage** tab. In the list of reports, click **Download** for the monthly report that want to get.

The report doesn't include any applicable taxes. There may be a latency of up to eight hours from the time when usage was incurred to when it's reflected on the report.

To view the usage summary reports and graphs:

1. In the Azure EA portal, in the left navigation area, click **Reports** and view the **Usage Summary** tab.  
  ![Create and view usage summary and download reports](./media/ea-portal-get-started/create-ea-view-usage-summary-and-download-reports.png)
2. Select a commitment term.
3. Toggle between **M** (Monthly) and **C** (Custom) on the top right of the page to view the **Usage Summary** with custom start and end dates.  
  ![Create and view usage summary and download reports in custom view](./media/ea-portal-get-started/create-ea-view-usage-summary-and-download-reports-custom-view.png)
4. Select a period or month on the graph to view additional details.
5. The graph shows month over month usage with a breakdown of utilized usage, service overcharge, charges billed separately, and marketplace charges.
6. For the selected month, filter by departments, accounts, and subscriptions below the graph.
7. Toggle between **Charge by Services** and **Charge by Hierarchy**.
8. Expand and collapse between **Azure Service**, **Charges Billed Separately**, and **Azure Marketplace** to view details.

Here's a video that shows how to view usage:

[Azure EA portal usage video](https://www.youtube.com/watch?v=Cv2IZ9QCn9E)

>[!VIDEO https://www.youtube.com/embed/Cv2IZ9QCn9E]

### Download CSV reports

Enterprise Administrators use the Monthly Report Download page to download several reports as CSV files. They include:

- Balance and Charge
- Usage Detail
- Marketplace Charges
- Price Sheet

To download reports:


1. In the Azure EA portal, click **Reports**.
2. Click **Download Usage** at the top of the page.
3. Select **Download** next to the month's report.

There may be a latency of up to five days between the incurred usage date and when usage is shown in the reports.

Users downloading CSV files with Safari to Excel may experience formatting errors. To avoid errors, open the file using a text editor.

![Example showing Download Usage page](./media/ea-portal-get-started/create-ea-download-csv-reports.png)

Here's a video that shows how to download usage information:

[Azure EA portal usage video](https://www.youtube.com/watch?v=eY797htT1qg)

>[!VIDEO https://www.youtube.com/embed/eY797htT1qg]

### Advanced report download

For reporting on specific date ranges or accounts, the advanced report download can be used. As of August 30, 2016, the format of the output file is changing from .xlsx to .csv to accommodate larger record sets.

1. Select **Advanced Report Download**.
1. Select **Appropriate Date Range**.
1. Select **Appropriate Accounts**.
1. Select **Request Usage Data**.
1. Select **Refresh** button until report status updates to **Download**.
1. Download report.

## EA term glossary

- **Account**: An organizational unit on the Azure EA Portal used to administer subscriptions and utilized for reporting.
- **Account owner**: The person identified to manage subscriptions and service administrators on Microsoft Azure. They can view usage data on this account and its associated subscriptions.
- **Amendment subscription**: A single one year or coterminous subscription under the enrollment amendment.
- **Commitment**: Commitment of an annual monetary amount for Microsoft Azure services at a discounted commitment rate for usage against this prepayment.
- **Department administrator**: The person(s) identified to manage departments, create new accounts and account owners, view usage details for the departments they manage, and view costs when granted permissions.
- **Enrollment number**: A unique identifier supplied by Microsoft to identify the specific enrollment associated with an enterprise agreement.
- **Enterprise administrator**: The person(s) identified to manage departments and department owners and accounts and account owners on Microsoft Azure. They have the ability to manage enterprise administrators as well as view usage data, billed quantities, and unbilled charges across all accounts and subscriptions associated with the enterprise enrollment.
- **Enterprise agreement**: A Microsoft licensing agreement for customers with centralized purchasing who want to standardize their entire organization on Microsoft technology and maintain an information technology infrastructure on a standard of Microsoft software.
- **Enterprise agreement enrollment**: An enrollment in the enterprise agreement program providing Microsoft products in volume at discounted rates.
- **Microsoft account**: A Web-based service that enables participating sites to authenticate a user with a single set of credentials.
- **Microsoft Azure enterprise enrollment amendment (enrollment amendment)**: An amendment signed by an enterprise, which provides them access to Microsoft Azure as part of their enterprise enrollment.
- **Azure EA Portal**: The portal used by our enterprise customers to manage their Microsoft Azure accounts and their related subscriptions.
- **Resource quantity consumed**: The quantity of an individual Microsoft Azure service that was utilized in a month.
- **Service administrator**: The person identified to access and manage subscriptions and development projects on the Azure EA Portal.
- **Subscription**: Represents an Azure EA Portal subscription and is a container of Microsoft Azure services managed by the same service administrator.
- **Work or school account**: For organizations that have set up active directory with Federation to the cloud and all accounts are on a single tenant.

### Enrollment statuses:

- **Pending**: The enrollment administrator needs to log into the Azure EA Portal. Once logged in, the enrollment will switch to an Active status.
- **Active**: The enrollment is Active and accounts and subscriptions can be created in the Azure EA Portal. The enrollment will remain active until the enterprise agreement end date.
- **Indefinite extended term**: An indefinite extended term takes place after the enterprise agreement end date has passed. It enables EA customers who are opted in to the extended term to continue to use Azure indefinitely at the end of their enterprise agreement. Before the EA enrollment reaches the enterprise agreement end date, the enrollment administrator should decide whether they will renew the enrollment by adding additional monetary commitment, transfer to a new enrollment, migrate to the Microsoft Online Subscription Program (MOSP), or confirm disablement of all services associated with the enrollment.
- **Expired**: The EA customer is opted out of the extended term and the EA enrollment has reached the enterprise agreement end date, the enrollment will expire, and all associated services will be disabled.
- **Transferred**: Enrollments where all associated accounts and services have been transferred to a new enrollment will appear with a transferred status. Please note enrollments do not automatically transfer if a new enrollment number is generated at renewal. The prior enrollment number must be included in the customer’s renewal paperwork to facilitate an automatic transfer.

## Get started on Azure EA FAQ

This document provides details on typical questions asked by customers during the onboarding process.  

### Can I associate my existing Azure Account to Enterprise Enrollment?

Yes, you can. Important point to note, all Azure subscriptions for which you’re the account owner will be converted to your enterprise agreement. This includes subscriptions that utilize monthly credit (e.g., Visual Studio, AzurePass, MPN, BizSpark, etc.), meaning you will lose monthly credit by doing so.

### I accidentally associated my existing Azure account with Enterprise enrollment. As a result, I lost my monthly credit. Is it possible to get my monthly credit back?

To recover your individual Visual Studio subscription Azure benefit after you authenticate as an EA account owner, after having used the same sign in for EA as your Visual Studio subscription, you must either:
1. Delete this account owner from the EA Portal, after removing or moving any Azure subscriptions they own, and have them sign up for their individual Visual Studio Azure benefits anew.
 OR
1. Delete the Visual Studio subscriber from the Administration site in VLSC and reassign the subscription, having them use a different sign in this time — then they can sign up for their individual Visual Studio Azure benefits anew.

### What type of subscription should I create?

EA Portal offers two types of subscriptions for enterprise customers:

- Microsoft Azure Enterprise – ideal for:
  - All production usage
  - Best prices based on infrastructure spend
  - You can find more details at https://azure.microsoft.com/pricing/enterprise-agreement/
- Enterprise Dev/Test - ideal for:
  - All team dev/test workloads
  - Medium-to-heavy individual dev/test workloads
  - Access to special MSDN images and preferential service rates
  - You can find more details at https://azure.microsoft.com/offers/ms-azr-0148p/

### Is it possible to transfer subscription ownership to another account?

Yes, it is possible to transfer subscription ownership to different account. For example, if an Account A has three subscriptions, the enterprise admin could transfer one subscription to Account B, one to Account C and one to Account D or all to Account E.

You can go to EA and click on Manage > Account, hover over **Account** (extreme right) and you will see Transfer Ownership (headshot icon) and Transfer Subscription (list icon) option.

This option will only be visible for active accounts.

### I see subscription name defaults to offer name, should I change the subscription name to something meaningful to my organization?

Any subscription created will default to the offer type you choose. We recommend that you change the subscription name to something that makes it easy for you to track the subscription.

**To change name:**
1. Sign in to [https://account.windowsazure.com](https://account.windowsazure.com).
1. Click on Subscription list.
1. Select Subscription.
1. Click on **Manage Subscription** icon.
1. Edit subscription details.

### How can I track cost incurred by Cost Center?

In order to track cost by Cost Center, you need to define Cost Center at any of the following levels:
- Department
- Account
- Subscription

Based on your need, you can use the same Cost Center to track usage and cost associated with a particular Cost Center.

For example, to track cost for a special project where multiple departments are involved, you may want to use the Cost Center at a subscription level to track the usage and cost.

You cannot define Cost Center at Service level and in case you want to track usage at service level, you can use the “Tag” feature available at the service level.

### How do I track usage and spend by different departments in my organization?

You can create as many departments as you need under your EA enrollment. In order to track the usage correctly, you need to ensure that subscriptions are not shared across departments.

Once department and subscription creation is done, you can see information flowing in the usage report that will help in tracking usage and managing cost/spend at department level.

You can also access the usage via API detailed information and sample code is available at [https://ea.azure.com/helpdocs/reportingAPI](https://ea.azure.com/helpdocs/reportingAPI).

### Can I set the spending quota and get alerts as I approach my limit?

You can set spending quota at department level and system will automatically notify you as your spending limits meet 50%, 75%, 90%, and 100% of the quota you define.

To define your spending quota, click on the department you want to add a spending limit to and click on the edit icon. Click on **Save** to save details.

### I used Resource Groups (RGs) to implement RBAC and track usage, how can I view the associated usage details?

Information like “Resource Groups” and “Tag” if used is tracked at service level and the information is available in the detailed usage download (CSV) file, which can be downloaded from the Azure EA Portal [https://ea.azure.com/report/downloadusage](https://ea.azure.com/report/downloadusage).

You can also access the usage via API, detailed information, and sample code is available at [https://ea.azure.com/helpdocs/reportingAPI](https://ea.azure.com/helpdocs/reportingAPI).

Please that you can only apply tags to resources that support Resource Manager operations. If you created a virtual machine, virtual network, or storage through the classic deployment model (such as through the classic portal), you cannot apply a tag to that resource. You must re-deploy these resources through the Resource Manager to support tagging. All other resources support tagging.

### Can I perform analyses using Power BI?

Yes. With the Microsoft Azure Enterprise content pack for Power BI, you can quickly import and analyze Azure consumption for your enterprise enrollment, find out which department, account, or subscription consumed the most usage, which service your organization used most, or track spending and usage trends.

**Navigate to the Power BI website:**

 1. Sign in with a valid work or school account.
    - The work or school account can be the same or different than what is used to access the enrollment through the Azure EA Portal.
 1. On the Dashboard of services, choose:
    - Microsoft Azure Enterprise tile.
    - Click **Connect**.
 1. On the "Connect to Azure Enterprise" screen, choose:
    - Azure Environment URL: [https://ea.azure.com](https://ea.azure.com).
    - Number of Months: choose between 1 and 36.
    - Enrollment Number: enter the enrollment number.
    - Click **Next**.
 1. Enter the API Key in the Authentication Key Box. You can get the API key in the Azure EA portal under “Download Usage” tab, click **API Access Key**.
    - Copy and paste the key into "Account Key" box.
    - The data will take approximately 5-30 minutes to load in Power BI, depending on the dataset size.

Power BI Reporting is available for EA direct, partner, and indirect customers who are able to view billing information.

## Next steps

- Azure EA portal administrators should read [Azure EA portal administration](ea-portal-administration.md) to learn about common administrative tasks.
- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](ea-portal-troubleshoot.md).
- For an Azure EA onboarding guide, see [Azure EA Onboarding Guide](https://ea.azure.com/api/v3Help/v2AzureEAOnboardingGuide).
