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
    ![image](https://user-images.githubusercontent.com/35741731/162804229-ecd84729-617d-4ada-926e-1a326bfe2a9a.png)

4. Wait for the validation to pass. Click **Create**. 
5. Wait for the Deployment to complete. Click **Go to Resource** will land on Email Communication Service Overview Page.
![image](https://user-images.githubusercontent.com/35741731/162804745-c9890aaa-f29e-47b3-bf90-c6defed9da57.png)


## Next steps

> [Configure Email Authentication for your domain in Azure Communication Services Email](../../quickstarts/Email/setup-email-authentication.md)

> [Best Practices for Sender Authentication Support in Azure Communication Services Email](./email-authentication-bestpractice.md)

> [Get started by Connecting Email Resource with a Communication Resource](../../quickstarts/Email/connect-email-communication-acs-resource.md)

The following documents may be interesting to you:

- Familiarize yourself with the [Email client library](../Email/sdk-features.md)
- How to send emails with custom verified domains?[Add custom domains](../../quickstarts/Email/add-custom-verified-domains.md)
- How to send emails with Azure Communication Service managed domains?[Add Azure Managed domains](../../quickstarts/Email/add-azure-managed-domains.md)


 

