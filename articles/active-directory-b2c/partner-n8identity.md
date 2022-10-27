---
title: Configure TheAccessHub Admin Tool by using Azure Active Directory B2C
titleSuffix: Azure AD B2C
description: In this tutorial, configure TheAccessHub Admin Tool by using Azure Active Directory B2C to address customer account migration and customer service request (CSR) administration.  
services: active-directory-b2c
author: gargi-sinha
manager: CelesteDG
ms.reviewer: kengaderdus

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 09/13/2022
ms.author: gasinh
ms.subservice: B2C
---

# Configure TheAccessHub Admin Tool by using Azure Active Directory B2C

In this tutorial, we provide guidance on how to integrate Azure Active Directory B2C (Azure AD B2C) with [TheAccessHub Admin Tool](https://n8id.com/products/theaccesshub-admintool/) from N8 Identity. This solution addresses customer account migration and customer service request (CSR) administration.  

This solution is suited for you if you have one or more of the following needs:

- You have an existing site and you want to migrate to Azure AD B2C. However, you're struggling with migration of your customer accounts, including passwords.

- You need a tool for your CSR to administer Azure AD B2C accounts.

- You have a requirement to use delegated administration for your CSRs.

- You want to synchronize and merge your data from many repositories into Azure AD B2C.

## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

- An [Azure AD B2C tenant](./tutorial-create-tenant.md). The tenant must be linked to your Azure subscription.

- A TheAccessHub Admin Tool environment. Contact [N8 Identity](https://n8id.com/contact/) to provision a new environment.

- (Optional:) Connection and credential information for any databases or Lightweight Directory Access Protocols (LDAPs) that you want to migrate customer data from.

- (Optional:) A configured Azure AD B2C environment for using [custom policies](./tutorial-create-user-flows.md?pivots=b2c-custom-policy), if you want to integrate TheAccessHub Admin Tool into your sign-up policy flow.

## Scenario description

The TheAccessHub Admin Tool runs like any other application in Azure. It can run in either N8 Identity's Azure subscription or the customer's subscription. The following architecture diagram shows the implementation.

![Diagram of the n8identity architecture.](./media/partner-n8identity/n8identity-architecture-diagram.png)

|Step | Description |
|:-----| :-----------|
| 1. | Each user arrives at a login page. The user creates a new account and enters information on the page. Azure AD B2C collects the user attributes.
| 2. | Azure AD B2C calls the TheAccessHub Admin Tool and passes on the user attributes.
| 3. | TheAccessHub Admin Tool checks your existing database for current user information.  
| 4. | User records are synced from the database to TheAccessHub Admin Tool.
| 5. | TheAccessHub Admin Tool shares the data with the delegated CSR/helpdesk admin.
| 6. | TheAccessHub Admin Tool syncs the user records with Azure AD B2C.
| 7. |Based on the success/failure response from the TheAccessHub Admin Tool, Azure AD B2C sends a customized welcome email to users.

## Create a Global Administrator in your Azure AD B2C tenant

The TheAccessHub Admin Tool requires permissions to act on behalf of a Global Administrator to read user information and conduct changes in your Azure AD B2C tenant. Changes to your regular administrators won't affect TheAccessHub Admin Tool's ability to interact with the tenant.

To create a Global Administrator:

1. In the Azure portal, sign in to your Azure AD B2C tenant as an administrator. Go to **Azure Active Directory** > **Users**.
2. Select **New User**.
3. Choose **Create User** to create a regular directory user and not a customer.
4. Complete the identity information form:

   a. Enter the username, such as **theaccesshub**.

   b. Enter the account name, such as **TheAccessHub Service Account**.

5. Select **Show Password** and copy the initial password for later use.
6. Assign the Global Administrator role:

   a. For **User**, select the user's current role to change it.

   b. Select the **Global Administrator** record.

   c. Select **Create**.

## Connect TheAccessHub Admin Tool with your Azure AD B2C tenant

TheAccessHub Admin Tool uses the Microsoft Graph API to read and make changes to your directory. It acts as a Global Administrator in your tenant. TheAccessHub Admin Tool needs additional permission, which you can grant from within the tool.

To authorize TheAccessHub Admin Tool to access your directory:

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Azure AD B2C Config**.

3. Select **Authorize Connection**.

4. In the new window, sign in with your Global Administrator account. You might be asked to reset your password if you're signing in for the first time with the new service account.

5. Follow the prompts and select **Accept** to grant TheAccessHub Admin Tool the requested permissions.

## Configure a new CSR user by using your enterprise identity

Create a CSR/Helpdesk user who accesses TheAccessHub Admin Tool by using their existing enterprise Azure Active Directory credentials.

To configure a CSR/Helpdesk user with single sign-on (SSO), we recommend the following steps:

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **Manager Tools** > **Manage Colleagues**.

3. Select **Add Colleague**.

4. For **Colleague Type**, select **Azure Administrator**.

5. Enter the colleague's profile information:

   a. Choose a home organization to control who has permission to manage this user.

   b. For **Login ID/Azure AD User Name**, supply the user principal name from the user's Azure Active Directory account.

   c. On the **TheAccessHub Roles** tab, select the managed role **Helpdesk**. It will allow the user to access the **Manage Colleagues** view. The user will still need to be placed into a group or be made an organization owner to act on customers.

6. Select **Submit**.

## Configure a new CSR user by using a new identity

Create a CSR/Helpdesk user who will access TheAccessHub Admin Tool by using a new local credential that's unique to the tool. This user will be used mainly by organizations that don't use Azure Active Directory.

To [set up a CSR/Helpdesk user](https://youtu.be/iOpOI2OpnLI) without SSO:

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **Manager Tools** > **Manage Colleagues**.

3. Select **Add Colleague**.

4. For **Colleague Type**, select **Local Administrator**.

5. Enter the colleague's profile information:

   a. Choose a home organization to control who has permission to manage this user.

   b. On the **TheAccessHub Roles** tab, select the managed role **Helpdesk**. It will allow the user to access the **Manage Colleagues** view. The user will still need to be placed into a group or be made an organization owner to act on customers.

6. Copy the **Login ID/Email** and **One Time Password** attributes. Provide them to the new user. The user will use these credentials to log in to TheAccessHub Admin Tool. The user will be prompted to enter a new password on first login.

7. Select **Submit**.

## Configure partitioned CSR administration

Permissions to manage customer and CSR/Helpdesk users in TheAccessHub Admin Tool are managed through an organization hierarchy. All colleagues and customers have a home organization where they reside. You can assign specific colleagues or groups of colleagues as owners of organizations.  

Organization owners can manage (make changes to) colleagues and customers in organizations or suborganizations that they own. To allow multiple colleagues to manage a set of users, you can create a group that has many members. You can then assign the group as an organization owner. All of the group's members can then manage colleagues and customers in the organization.

### Create a new group

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **Organization > Manage Groups**.

3. Select **Add Group**.

4. Enter values for **Group name**, **Group description**, and **Group owner**.

5. Search for and select the boxes on the colleagues you want to be members of the group, and then select **Add**.

6. At the bottom of the page, you can see all members of the group.

   If necessary, you can remove members by selecting the **x** at the end of the row.

7. Select **Submit**.

### Create a new organization

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **Organization** > **Manage Organizations**.

3. Select **Add Organization**.

4. Supply values for **Organization name**, **Organization owner**, and **Parent organization**:

    a. The organization name is ideally a value that corresponds to your customer data. When you're loading colleague and customer data, if you supply the name of the organization in the load, the colleague can be automatically placed into the organization.

    b. The owner represents the person or group that will manage the customers and colleagues in this organization and any suborganization within it.

    c. The parent organization indicates which other organization is also responsible for this organization.

5. Select **Submit**.

### Modify the hierarchy via the tree view

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **Manager Tools** > **Tree View**.

3. In this representation, you can visualize which colleagues and groups can manage which organizations. Modify the hierarchy by dragging organizations into parent organizations.

5. Select **Save** when you're finished altering the hierarchy.

## Customize the welcome notification

While you're using TheAccessHub Admin Tool to migrate users from a previous authentication solution into Azure AD B2C, you might want to customize the user welcome notification. TheAccessHub Admin Tool sends this notification to users during migration. This message normally includes a link for users to set a new password in the Azure AD B2C directory.

To customize the notification:

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Notifications**.

3. Select the **Create Colleague** template.

4. Select **Edit**.

5. Alter the **Message** and **Template** fields as necessary. The **Template** field is HTML aware and can send HTML-formatted email notifications to customers.

6. Select **Save** when you're finished.

## Migrate data from external data sources to Azure AD B2C

By using TheAccessHub Admin Tool, you can import data from various databases, LDAPs, and .csv files and then push that data to your Azure AD B2C tenant. You migrate the data by loading it into the Azure AD B2C user colleague type within TheAccessHub Admin Tool.  

If the source of data isn't Azure itself, the data will be placed into both TheAccessHub Admin Tool and Azure AD B2C. If the source of your external data isn't a simple .csv file on your machine, set up a data source before doing the data load. The following steps describe creating a data source and loading the data.

### Configure a new data source

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Data Sources**.

3. Select **Add Data Source**.

4. Supply **Name** and **Type** values for this data source.

5. Fill in the form data, depending on your data source type.

   For databases:

   a. For **Type**, enter **Database**.

   b. For **Database type**, select a database from one of the supported database types.

   c. For **Connection URL**, enter a well-formatted JDBC connection string, such as `jdbc:postgresql://myhost.com:5432/databasename`.

   d. For **Username**, enter the username for accessing the database.

   e. For **Password**, enter the password for accessing the database.

   f. For **Query**, enter the SQL query to extract the customer details, such as `SELECT * FROM mytable;`.

   g. Select **Test Connection**. You'll see a sample of your data to ensure that the connection is working.

   For LDAPs:

   a. For **Type**, enter **LDAP**.

   b. For **Host**, enter the host name or IP address for the machine in which the LDAP server is running, such as `mysite.com`.

   c. For **Port**, enter the port number in which the LDAP server is listening.

   d. For **SSL**, select the box if TheAccessHub Admin Tool should communicate to the LDAP securely by using SSL. We highly recommend using SSL.

   e. For **Login DN**, enter the distinguished name (DN) of the user account to log in and do the LDAP search.

   f. For **Password**, enter the password for the user.

   g. For **Base DN**, enter the DN at the top of the hierarchy in which you want to do the search.

   h. For **Filter**, enter the LDAP filter string, which will obtain your customer records.

   i. For **Attributes**, enter a comma-separated list of attributes from your customer records to pass to TheAccessHub Admin Tool.

   j. Select the **Test Connection**. You'll see a sample of your data to ensure that the connection is working.

   For OneDrive:

   a. For **Type**, select **OneDrive for Business**.

   b. Select **Authorize Connection**.

   c. A new window prompts you to sign in to OneDrive. Sign in with a user that has read access to your OneDrive account. TheAccessHub Admin Tool will act for this user to read .csv load files.

   d. Follow the prompts and select **Accept** to grant TheAccessHub Admin Tool the requested permissions.

6. Select **Save** when you're finished.  

### Synchronize data from your data source into Azure AD B2C

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Data Synchronization**.

3. Select **New Load**.

4. For **Colleague Type**, select **Azure AD B2C User**.

5. Select **Source**. In the pop-up dialog, select your data source. If you created a OneDrive data source, also select the file.

6. If you don't want to create new customer accounts with this load,  change the first policy (**IF colleague not found in TheAccessHub THEN**) to **Do Nothing**.

7. If you don't want to update existing customer accounts with this load, change the second policy (**IF source and TheAccessHub data mismatch THEN**) to **Do Nothing**.

8. Select **Next**.

9. In **Search-Mapping configuration**, you identify how to correlate load records with customers already loaded into TheAccessHub Admin Tool. 

   Choose one or more identifying attributes in the source. Match the attributes with an attribute in TheAccessHub Admin Tool that holds the same values. If a match is found, the existing record will be overridden. Otherwise, a new customer will be created. 
   
   You can sequence a number of these checks. For example, you could check email first, and then check first and last name.

10. On the left-side menu, select **Data Mapping**.

11. In **Data-Mapping configuration**, assign the TheAccessHub Admin Tool attributes that should be populated from your source attributes. There's no need to map all the attributes. Unmapped attributes will remain unchanged for existing customers.

12. If you map to the attribute `org_name` with a value that is the name of an existing organization, newly created customers will be placed in that organization.

13. Select **Next**.

14. If you want this load to be recurring, specify a **Daily/Weekly** or **Monthly** schedule. Otherwise, keep the default of **Now**.

15. Select **Submit**.

16. If you selected the **Now** schedule, a new record will be added to the **Data Synchronizations** screen immediately. After the validation phase has reached 100 percent, select the new record to see the expected outcome for the load. For scheduled loads, these records will appear only after the scheduled time.

17. If there are no errors, select **Run** to commit the changes. Otherwise, select **Remove** from the **More** menu to remove the load. You can then correct the source data or load mappings and try again. 

    Instead, if the number of errors is small, you can manually update the records and select **Update** on each record to make corrections. Another option is to continue with any errors and resolve them later as **Support Interventions** in TheAccessHub Admin Tool.

18. When the **Data Synchronization** record becomes 100 percent on the load phase, all the changes resulting from the load have been initiated. Customers should begin appearing or receiving changes in Azure AD B2C.

## Synchronize Azure AD B2C customer data 

As a one-time or ongoing operation, TheAccessHub Admin Tool can synchronize all the customer information from Azure AD B2C into TheAccessHub Admin Tool. This operation ensures that CSR/Helpdesk administrators see up-to-date customer information.

To synchronize data from Azure AD B2C into TheAccessHub Admin Tool:

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Data Synchronization**.

3. Select **New Load**.

4. For **Colleague Type**, select **Azure AD B2C User**.

5. For the **Options** step, leave the defaults.

6. Select **Next**.

7. For the **Data Mapping & Search** step, leave the defaults. Exception: if you map to the attribute `org_name` with a value that is the name of an existing organization, newly created customers will be placed in that organization.

8. Select **Next**.

9. If you want this load to be recurring, specify a **Daily/Weekly** or **Monthly** schedule. Otherwise, keep the default of **Now**. We recommend syncing from Azure AD B2C on a regular basis.

10. Select **Submit**.

11. If you selected the **Now** schedule, a new record will be added to the **Data Synchronizations** screen immediately. After the validation phase has reached 100 percent, select the new record to see the expected outcome for the load. For scheduled loads, these records will appear only after the scheduled time.

12. If there are no errors, select **Run** to commit the changes. Otherwise, select **Remove** from the **More** menu to remove the load. You can then correct the source data or load mappings and try again. 

    Instead, if the number of errors is small, you can manually update the records and select **Update** on each record to make corrections. Another option is to continue with any errors and resolve them later as **Support Interventions** in TheAccessHub Admin Tool.

13. When the **Data Synchronization** record becomes 100 percent on the load phase, all the changes resulting from the load have been initiated.

## Configure Azure AD B2C policies

Occasional syncing of TheAccessHub Admin Tool limits the tool's ability to keep its state up to date with Azure AD B2C. You can use TheAccessHub Admin Tool's API and Azure AD B2C policies to inform TheAccessHub Admin Tool of changes as they happen. This solution requires technical knowledge of [Azure AD B2C custom policies](./user-flow-overview.md). 

The following procedures give you example policy steps and a secure certificate to notify TheAccessHub Admin Tool of new accounts in your sign-up custom policies.

### Create a secure credential to invoke TheAccessHub Admin Tool's API

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Admin Tools** > **API Security**.

3. Select **Generate**.

4. Copy the **Certificate Password**.

5. Select **Download** to get the client certificate.

6. Follow [this tutorial](./secure-rest-api.md#https-client-certificate-authentication) to add the client certificate into Azure AD B2C.

### Retrieve your custom policy examples

1. Log in to TheAccessHub Admin Tool by using the credentials that N8 Identity has provided.

2. Go to **System Admin** > **Admin Tools** > **Azure B2C Policies**.

3. Supply your Azure AD B2C tenant domain and the two Identity Experience Framework IDs from your Identity Experience Framework configuration.

4. Select **Save**.

5. Select **Download** to get a .zip file with basic policies that add customers into TheAccessHub Admin Tool as customers sign up.

6. Follow [this tutorial](./tutorial-create-user-flows.md?pivots=b2c-custom-policy) to get started with designing custom policies in Azure AD B2C.

## Next steps

For more information, review the following articles:

- [Custom policies in Azure AD B2C](./custom-policy-overview.md)

- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)
