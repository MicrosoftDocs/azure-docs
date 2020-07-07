---
title: Create a Metrics Monitoring instance
description: Learn how to create a Metrics Monitoring instance
ms.date: 07/07/2020
ms.topic: conceptual
ms.author: aahi
---

# Quickstart: create a Metrics Monitoring instance

This tutorial walks you through create a Project "Gualala" instance in your Azure subscription. If you've already deployed a Project "Gualala" instance in your Azure cloud and have it running locally, skip ahead to [Add Data feeds overview](../howto/datafeeds/add-data-feeds-overview.md).

In this tutorial, you will learn how to:

* Create a new instance of Project "Gualala" to Azure subscription.

If you don't have an Azure subscription, create a free account before you begin.

## Prerequisites

* A valid Azure subscription

* Permission of creating resource group(or you can use an existing empty resource group)

In the following step, you need to create a resource group and assign it for deploying all resources used in Project "Gualala". And an alternative resource group will automatically be created during deployment(?). You can also assign an existing resource group for deploying all resources used by Project "Gualala".

* Permission of registering application in Azure Active Directory

Azure Active Directory of your organization will be used as user authentication in Project "Gualala". An client application will be used in Project "Gualala". If you want to use existing applications for user authentication of Project "Gualala", your account should have owner role of this application.

* Approval for private preview 

Only approved customers can join this private preview, check out [Start my Project "Gualala" private preview](../start-preview.md) to ensure that you got approved after submitting request. 

## [Register and configure a client application](#AAD-client-id)

### Create a client application

1. In the Azure portal, on the left navigation panel, select **Azure Active Directory**.
2. In the Azure Active Directory pane, select **App Registrations** from the Azure Active Directory left-hand navigation menu.
3. Select **New Registration**.
4. Assign a name for this new Client application.
5. Leave other fields as default.
6. Select **Registration**.
7. Copy & store application(client) ID of this client application.

    ![Azure AD page-create_client_application](../media/dep_createclient.png "Azure AD page-create client application")

### Get client application id

After creating above client application, you need to write down the client id of this application. This client id should be provided in following steps.
To get client application id, go to overview page of your client application created above,and select copy button next to application(client) id to copy this id.

   ![Get client application id](../media/aad-app-clientid.png "Get Azure Active Directory client application ID")

### Get tenant id

A tenant represents an organization in Azure Active Directory. It's a dedicated Azure AD service instance that an organization receives and owns when it signs up for a Microsoft cloud service. Each Azure AD tenant is distinct and separate from other Azure AD tenants.
After creating above client application, you can retrieve tenant id in the overview page of this client application.
Select copy button next to Directory (tenant) ID to copy this id shown as below figure.

   ![Get tenant id](../media/aad-app-tenantid.png "Get Azure Active Directory tenant ID")

## Create a new Azure Project "Gualala" resource

Goto [here](https://aka.ms/newgualala) to create a new instance of Project "Gualala" resource.
Select Project "Gualala" in portal, and select **Create** in the page.

On the Create page, provide the following information:

* Name    
A descriptive name for your Project "Gualala" resource. For example, MyGualalaResource. Make sure this is unused unique name.

**Caution:** you need write down this resource name you input, since in the following step you need use this resource name to set callback url in above client application.

* Subscription    
Select one of your available Azure subscriptions.

* Location    
The location of your Project "Gualala" service instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource.

* Pricing tier    
Select **Free F0**, which is the only option here.
In this model, data and run time are hosted in Microsoft managed Azure subscription.
As a common practice, we don't charge you in private preview.

* Resource group    
The Azure resource group will contain your Project "Gualala" resource. You can create a new group or add it to a pre-existing group.

* Azure Active Directory client id
Input client application id from above step.

* Azure Active Directory tenant id
Input tenant id from above step.

After inputting all above fields, select **Create** to start creating instance. It would take about 30 min to complete creation of Project "Gualala" instance.

![Azure portal-create_AD_instance](../media/dep_createinstance1.png "Azure portal-create instance")

## Post-install configuration

### Configure the client application

* Add URL link of your Project "Gualala" to your client(Application) as a redirect URI.

1. In the Azure portal, on the left navigation panel, select **Azure Active Directory**.
2. In the Azure Active Directory panel, select **App Registrations** from the Azure Active Directory left-hand navigation menu.
3. On application list panel, select the Client application you created in previous step - **Create a Client application**.
4. Select **Authentication** in the left panel.
5. Select **Add a platform** > **Web** to add a web platform as figure below.

    ![Azure AD page-config_client_application](../media/dep_configaad1.png "Azure AD page-config client application")

6. Add a web redirect URI by pasting the wbsite URL of your Project "Gualala" to **Redirect URI** filed as below.
   The wbsite URL of your Project "Gualala" is **https://{resource-name}.azurewebsites.net**.
   This {resource-name} is the Name you set in previous step - **Create a new Azure Project "Gualala" resource**.
7. Make sure **Implicit grant** > **ID tokens** is selected.
8. Select **Save**.

    ![Azure AD page-config_client_application](../media/dep_configaad2.png "Azure AD page-config client application")

## Ready to use

Congratulations! Now it's ready to use Project "Gualala".
You can use it via web portal as well as REST API. You can check both URLs in the Cognitive service instance you've created.
If you want to access this service using REST API, authentication key is necessary, which is also provided in this page as shown below.

   ![Service URLs](../media/dep_configaad3.png "Service URLs")

## Clean up resources

If you want to clean up and remove a Project "Gualala" subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources contained in the group.
In the Azure portal, expand the menu on the left side to open the menu of services, and choose Resource Groups to display the list of your resource groups.
Locate the resource group containing the resource to be deleted
Right-click on the resource group listing. Select Delete resource group, and confirm.

## Next Steps

- [Build your first monitor on web](build-first-monitor.md)
- [Use APIs to customize a solution](use-API-to-build-solution.md)
