---
title: Quickstart - Create and manage Email resources in Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create and manage your first Azure Email Communication Services resource.
author: bashan
manager: shanhen
services: azure-communication-services

ms.author: bashan
ms.date: 02/15/2022
ms.topic: overview
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).
# Quickstart: Create and manage Email Communication Services resources
 

Get started with Email by provisioning your first Email Communication Services resource. Communication services resources can be provisioned through the [Azure portal](https://portal.azure.com) or with the .NET management client library. The management client library and the Azure portal allow you to create, configure, update and delete your resources and interface with [Azure Resource Manager](../../azure-resource-manager/management/overview.md), Azure's deployment and management service. All functionality available in the client libraries is available in the Azure portal. 

Create the Email Communications Service Resource using Portal
--------------------------

1. Navigate to the Azure Portal. Click [here](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=Microsoft_Azure_EmailCommunicationServicesHidden&Microsoft_Azure_EmailCommunicationServices_assettypeoptions=%7B%22EmailCommunicationService%22%3A%7B%22options%22%3A%22%22%7D%7D#create/hub) to create a new resource.
2. Search for Email Communication Services and hit enter. Select **Email Communication Services** and press **Create**.
![image](https://user-images.githubusercontent.com/35741731/160208026-d8b457e1-f046-4533-8d63-c2ef70c97056.png)
![image](https://user-images.githubusercontent.com/35741731/160208041-0bd3a3fc-238d-4d0f-981a-fb4483dc0365.png)
3. Complete the required information on the basics tab:
    - Select an existing Azure subscription.
    - Select an existing resource group, or create a new one by clicking the **Create new** link.
    - Provide a valid name for the resource. 
    - Select **United States** as the data location.
    - If you would like to add tags, click  **Next: Tags**. 
    - Click **Review + create**. 
    - Add any name/value pairs. Click **Next: Review + create**.
4. Wait for the validation to pass. Click **Create**. 
5.  Wait for the Deployment to complete. Click **Go to Resource**. 

Provision the Azure subdomain
------------------------
1. Go the overview page of the Email Communications Service resource that you created earlier.
2. Create the Azure Managed Domain.   
    - (Option 1) Click the **1-click add** button under **Add a free Azure subdomain**. Move to the next step.
    - (Option 2) Click **Domains** on the left navigation panel.
    - Click **Add domain** on the upper navigation bar.
    - Select **Azure domain** from the dropdown.
3. After domain creation is completed, you will see a list view with the created domain.
4. Click the name of the provisioned domain. This will navigate you to the overview page for the domain resource type.


 

