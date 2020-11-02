---
title: Tutorial for configuring N8 Identity with Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: Tutorial for configuring TheAccessHub Admin Tool with Azure Active Directory B2C to address customer accounts migration and Customer Service Requests (CSR) administration.  
services: active-directory-b2c
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 10/20/2020
ms.author: gasinh
ms.subservice: B2C
---

# Tutorial for configuring TheAccessHub Admin Tool with Azure Active Directory B2C

In this sample tutorial, we provide guidance on how to integrate Azure Active Directory (AD) B2C with [TheAccessHub Admin Tool](https://n8id.com/products/theaccesshub-admintool/) from N8 Identity. This solution addresses customer accounts migration and Customer Service Requests (CSR) administration.  

This solution is suited for you, if you have one or more of the following needs:

- You have an existing site and you want to migrate to Azure AD B2C. However, you're struggling with migration of your customer accounts including passwords

- You require a tool for your CSR to administer Azure AD B2C accounts.

- You have a requirement to use delegated administration for your CSRs.

- You want to synchronize and merge your data from many repositories into Azure AD B2C.

## Pre-requisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant). Tenant must be linked to your Azure subscription.

- A TheAccessHub Admin Tool environment: Contact [N8 Identity](https://n8id.com/contact/) to provision a new environment.

- [Optional] Connection and credential information for any databases or Lightweight Directory Access Protocols (LDAPs) you want to migrate customer data from.

- [Optional] Configured Azure AD B2C environment for using [custom policies](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started), if you wish to integrate TheAccessHub Admin Tool into your sign-up policy flow.

## Scenario description

The TheAccessHub Admin Tool runs like any other application in Azure. It can run in either N8 Identity’s Azure subscription, or the customer’s subscription. The following architecture diagram shows the implementation.

![Image showing n8identity architecture diagram](./media/partner-n8identity/n8identity-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | User arrives at a login page. Users select sign-up to create a new account and enter information into the page. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the TheAccessHub Admin Tool and passes on the user attributes
| 3. | TheAccessHub Admin Tool checks your existing database for current user information.  
| 4. | The user record is synced from the database to TheAccessHub Admin Tool.
| 5. | TheAccessHub Admin Tool shares the data with the delegated CSR/helpdesk admin.
| 6. | TheAccessHub Admin Tool syncs the user records with Azure AD B2C.
| 7. |Based on the success/failure response from the TheAccessHub Admin Tool, Azure AD B2C sends a customized welcome email to the user.

## Create a Global Admin in your Azure AD B2C tenant

The TheAccessHub Admin Tool requires permissions to act on behalf of a Global Administrator to read user information and conduct changes in your Azure AD B2C tenant. Changes to your regular administrators won; t impact TheAccessHub Admin Tool’s ability to interact with the tenant.

To create a Global Administrator, follow these steps:

1. In the Azure portal, sign into your Azure AD B2C tenant as an administrator. Navigate to **Azure Active Directory** > **Users**
2. Select **New User**
3. Choose **Create User** to create a regular directory user and not a customer
4. Complete the Identity information form

   a. Enter the username such as ‘theaccesshub’

   b. Enter the name such as ‘TheAccessHub Service Account’

5. Select **Show Password** and copy the initial password for later use
6. Assign the Global Administrator role

   a. Select the user’s current roles **User** to change it

   b. Check the record for Global Administrator

   c. **Select** > **Create**

## Connect TheAccessHub Admin Tool with your Azure AD B2C tenant

TheAccessHub Admin Tool uses Microsoft’s Graph API to read and make changes to your directory. It acts as a Global Administrator in your tenant. Additional permission is needed by TheAccessHub Admin Tool, which you can grant from within the tool.

To authorize TheAccessHub Admin Tool to access your directory, follow these steps:

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Azure AD B2C Config**

3. Select **Authorize Connection**

4. In the new window sign-in with your Global Administrator account. You may be asked to reset your password if you're signing in for the first time with the new service account.

5. Follow the prompts and select **Accept** to grant TheAccessHub Admin Tool the requested permissions.

## Configure a new CSR/Helpdesk user using your enterprise identity

Create a CSR/Helpdesk user who accesses TheAccessHub Admin Tool using their existing enterprise Azure Active Directory credentials.

To configure CSR/Helpdesk user with Single Sign-on (SSO), the following steps are recommended:

1. Log into TheAccessHub Admin Tool using credentials provided by N8 Identity.

2. Navigate to **Manager Tools** > **Manage Colleagues**

3. Select **Add Colleague**

4. Select **Colleague Type Azure Administrator**

5. Enter the colleague’s profile information

   a. Choosing a Home Organization will control who has   permission to manage this user.

   b. For Login ID/Azure AD User Name supply the User  Principal Name from the user’s Azure Active Directory account.

   c. On the TheAccessHub Roles tab, check the managed role Helpdesk. It will allow the user to access the manage colleagues view. The user will still need to be placed into a group or be made an organization owner to act on customers.

6. Select **Submit**.

## Configure a new CSR/Helpdesk user using a new identity

Create a CSR/Helpdesk user who will access TheAccessHub Admin Tool with a new local credential unique to TheAccessHub Admin Tool. This will be used mainly by organizations that don't use an Azure AD for their enterprise.

To [setup a CSR/Helpdesk](https://youtu.be/iOpOI2OpnLI) user without SSO, follow these steps:

1. Log into TheAccessHub Admin Tool using credentials provided by N8 Identity

2. Navigate to **Manager Tools** > **Manage Colleagues**

3. Select **Add Colleague**

4. Select **Colleague Type Local Administrator**

5. Enter the colleague’s profile information

   a. Choosing a Home Organization will control who has permission to manage this user.

   b. On the **TheAccessHub Roles** tab, select the managed role **Helpdesk**. It will allow the user to access the manage colleagues view. The user will still need to be placed into a group or be made an organization owner to act on customers.

6. Copy the **Login ID/Email** and **One Time Password** attributes. Provide it to the new user. They'll use these credentials to log in to TheAccessHub Admin Tool. The user will be prompted to enter a new password on their first login.

7. Select **Submit**

## Configure partitioned CSR/Helpdesk administration

Permissions to manage customer and CSR/Helpdesk users in TheAccessHub Admin Tool are managed with the use of an organization hierarchy. All colleagues and customers have a home organization where they reside. Specific colleagues or groups of colleagues can be assigned as owners of organizations.  Organization owners can manage (make changes to) colleagues and customers in organizations or suborganizations they own. To allow multiple colleagues to manage a set of users, a group can be created with many members. The group can then be assigned as an organization owner and all of the group’s members can manage colleagues and customers in the organization.

### Create a new group

1. Log into TheAccessHub Admin Tool using **credentials** provided to you by N8 Identity

2. Navigate to **Organization > Manage Groups**

3. Select > **Add Group**

4. Enter a **Group name**, **Group description**, and **Group owner**

5. Search for and check the boxes on the colleagues you want to be members of the group then select >**Add**

6. At the bottom of the page, you can see all members of the group.

7. If needed members can be removed by selecting the **x** at the end of the row

8. Select **Submit**

### Create a new organization

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to Organization > **Manage Organizations**

3. Select > **Add Organization**

4. Supply an **Organization name**, **Organization owner**, and **Parent organization**.

    a. The organization name is ideally a value that corresponds to your customer data. When loading colleague and customer data, if you supply the name of the organization in the load, the colleague can be automatically placed into the organization.

    b. The owner represents the person or group who will manage the customers and colleagues in this organization and any suborganization within.

    c. The parent organization indicates which other organization is inherently, also responsible for this organization.

5. Select **Submit**.

### Modify the hierarchy via the tree view

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **Manager Tools** > **Tree View**

3. In this representation, you can visualize which colleagues and groups can manage which organizations.

4. The hierarchies can be modified by dragging organizations overtop organizations you want them to be parented by.

5. Select **Save** when you're finished altering the hierarchy.

## Customize welcome notification

While you're using TheAccessHub to migrate users from a previous authentication solution into Azure AD B2C, you may want to customize the user welcome notification, which is sent to the user by TheAccessHub during migration. This message normally includes the link for the customer to set a new password in the Azure AD B2C directory.

To customize the notification:

1. Log into TheAccessHub using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Notifications**

3. Select the **Create Colleague template**

4. Select **Edit**

5. Alter the Message and Template fields as necessary.
   - The Template field is HTML aware and can send HTML formatted notifications to customer emails.

6. Select **Save** when finished.

## Migrate data from external data sources to Azure AD B2C

Using TheAccessHub Admin Tool, you can import data from various databases, LDAPs, and CSV files and then push that data to your Azure AD B2C tenant. It's done by loading data into the Azure AD B2C user colleague type within TheAccessHub Admin Tool.  If the source of data isn't Azure itself, the data will be placed into both TheAccessHub Admin Tool and Azure AD B2C. If the source of your external data isn't a simple .csv file on your machine, set up a data source before doing the data load. The below steps describe creating a data source and doing the data load.

### Configure a new data source

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Data Sources**

3. Select **Add Data Source**

4. Supply a **Name** and **Type** for this data source

5. Fill in the form data, depending on your data source type:

   **For Databases**

   a. **Type** – Database

   b. **Database Type** – Select a database from one of the supported database types.

   c. **Connection URL** – Enter a well-formatted JDBC connection string. Such as: ``jdbc:postgresql://myhost.com:5432/databasename``

   d. **Username** – Enter the username for accessing the database

   e. **Password** – Enter the password for accessing the database

   f. **Query** – Enter the SQL query to extract the customer details. Such as: ``SELECT * FROM mytable;``

   g. Select **Test Connection**, you'll see a sample of your data to ensure the connection is working.

   **For LDAPs**

   a. **Type** – LDAP

   b. **Host** – Enter the hostname or IP for machine in which the LDAP server is running. Such as: ``mysite.com``

   c. **Port** – Enter the port number in which the LDAP server is listening.

   d. **SSL** – Check the box if TheAccessHub Admin Tool should communicate to the LDAP securely using SSL. Using SSL is highly recommended.

   e. **Login DN** – Enter the DN of the user account to log in and do the LDAP search

   f. **Password** – Enter the password for the user

   g. **Base DN** – Enter the DN at the top of the hierarchy in which you want to do the search

   h. **Filter** – Enter the LDAP filter string, which will obtain your customer records

   i. **Attributes** – Enter a comma-separated list of attributes from your customer records to pass to TheAccessHub Admin Tool

   j. Select the **Test Connection**, you'll see a sample of your data to ensure the connection is working.

   **For OneDrive**

   a. **Type** – OneDrive for Business

   b. Select **Authorize Connection**

   c. A new window will prompt you to log in to **OneDrive**, login with a user with read access to your OneDrive account. TheAccessHub Admin Tool, will act for this user to read CSV load files.

   d. Follow the prompts and select **Accept** to grant TheAccessHub Admin Tool the requested permissions.

6. Select **Save** when finished.  

### Synchronize data from your data source into Azure AD B2C

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Data Synchronization**

3. Select **New Load**

4. Select the **Colleague Type** Azure AD B2C User

5. Select **Source**, in the pop-up dialog, select your data source. If you created a OneDrive data source, also select the file.

6. If you don’t want to create new customer accounts with this load, then change the first policy: **IF colleague not found in TheAccessHub THEN** to **Do Nothing**

7. If you don’t want to update existing customer accounts with this load, then change the second policy **IF source and TheAccessHub data mismatch THEN** to **Do Nothing**

8. Select **Next**

9. In the **Search-Mapping configuration**, we identify how to correlate load records with customers already loaded into TheAccessHub Admin Tool. Choose one or more identifying attributes in the source. Match the attributes with an attribute in TheAccessHub Admin Tool that holds the same values. If a match is found, then the existing record will be overridden; otherwise, a new customer will be created. You can sequence a number of these checks. For example, you could check email first, and then first and last name.

10. On the left-hand side, select **Data Mapping**.

11. In the Data-Mapping configuration, assign which TheAccessHub Admin Tool attributes should be populated from your source attributes. No need to map all the attributes. Unmapped attributes will remain unchanged for existing customers.

12. If you map to the attribute org_name with a value that is the name of an existing organization, then new customers created will be placed in that organization.

13. Select **Next**

14. A Daily/Weekly or Monthly schedule may be specified if this load should be reoccurring. Otherwise keep the default **Now**.

15. Select **Submit**

16. If the **Now schedule** was selected, a new record will be added to the Data Synchronizations screen immediately. Once the validation phase has reached 100%, select the **new record** to see the expected outcome for the load. For scheduled loads, these records will only appear after the scheduled time.

17. If there are no errors, select **Run** to commit the changes. Otherwise, select **Remove** from the **More** menu to remove the load. You can then correct the source data or load mappings and try again. Instead, if the number of errors is small, you can manually update the records and select **Update** on each record to make corrections. Finally, you can continue with any errors and resolve them later as **Support Interventions** in TheAccessHub Admin Tool.

18. When the **Data Synchronization** record becomes 100% on the load phase, all the changes resulting from the load will have been initiated. Customers should begin appearing or receiving changes in Azure AD B2C.

## Synchronize Azure AD B2C Customer Data into TheAccessHub Admin Tool

As a one-time or ongoing operation, TheAccessHub Admin Tool can synchronize all the customer information from Azure AD B2C into TheAccessHub Admin Tool. This ensures that CSR/Helpdesk administrators are seeing up-to-date customer information.

To synchronize data from Azure AD B2C into TheAccessHub Admin Tool:

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Data Synchronization**

3. Select **New Load**

4. Select the **Colleague Type** Azure AD B2C User

5. For the **Options** step, leave the defaults.

6. Select **Next**

7. For the **Data Mapping & Search** step, leave the defaults. Except if you map to the attribute **org_name** with a value that is the name of an existing organization, then new customers created will be placed in that organization.

8. Select **Next**

9. A Daily/Weekly or Monthly schedule may be specified if this load should be reoccurring. Otherwise keep the default: **Now**. We recommend syncing from Azure AD B2C on a regular basis.

10. Select **Submit**

11. If the **Now** schedule was selected, a new record will be added to the Data Synchronizations screen immediately. Once the validation phase has reached 100%, select the new record to see the expected outcome for the load. For scheduled loads, these records will only appear after the scheduled time.

12. If there are no errors, select **Run** to commit the changes. Otherwise, select **Remove** from the More menu to remove the load. You can then correct the source data or load mappings and try again. Instead, if the number of errors is small, you can manually update the records and select **Update** on each record to make corrections. Finally, you can continue with any errors and resolve them later as Support Interventions in TheAccessHub Admin Tool.

13. When the **Data Synchronization** record becomes 100% on the load phase, all the changes resulting from the load will have been initiated.

## Configure Azure AD B2C policies to call TheAccessHub Admin Tool

Occasionally syncing TheAccessHub Admin Tool is limited in its ability to keep its state up to date with Azure AD B2C. We can leverage TheAccessHub Admin Tool’s API and Azure AD B2C policies to inform TheAccessHub Admin Tool of changes as they happen. This solution requires technical knowledge of [Azure AD B2C custom policies](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started#:~:text=%20Get%20started%20with%20custom%20policies%20in%20Azure,Experience%20Framework%20applications.%20Azure%20AD%20B2C...%20More%20). In the next section, we'll  give you an example policy steps and a secure certificate to notify TheAccessHub Admin Tool of new accounts in your Sign-Up custom policies.

### Create a secure credential to invoke TheAccessHub Admin Tool’s API

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Admin Tools** > **API Security**

3. Select **Generate**

4. Copy the **Certificate Password**

5. Select **Download** to get the client certificate.

6. Follow this [tutorial](https://docs.microsoft.com/azure/active-directory-b2c/secure-rest-api#https-client-certificate-authentication ) to add the client certificate into Azure AD B2C.

### Retrieve your custom policy examples

1. Log into TheAccessHub Admin Tool using credentials provided to you by N8 Identity

2. Navigate to **System Admin** > **Admin Tools** > **Azure B2C Policies**

3. Supply your Azure AD B2C tenant domain and the two Identity Experience Framework IDs from your Identity Experience Framework configuration

4. Select **Save**

5. Select **Download** to get a zip file with basic policies that add customers into TheAccessHub Admin Tool as customers sign up.

6. Follow this [tutorial](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started) to get started with designing custom policies in Azure AD B2C.

## Next steps

For additional information, review the following articles:

- [Custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview)

- [Get started with custom policies in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-get-started?tabs=applications)