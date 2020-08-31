---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 08/31/2020
---

The form requests information about you, your company, and the user scenario for which you'll use the container. After you submit the form, the Azure Cognitive Services team reviews it to make sure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> * You must use an email address associated with either a Microsoft Account (MSA) or an Azure Active Directory (Azure AD) account in the form.
> * When creating a resource, use your Azure subscription associated with the same MSA or Azure AD Account. 

If your request is approved, you receive an email with instructions that describe how to obtain your credentials and access the private container registry.

Starting September 22nd, containers for Azure Cognitive Services are hosted on the Microsoft Container Registry, which authenticate using a key and endpoint for your Azure resource. If your request for access has been approved, You'll be able to run the container after using the Docker `pull` command described later in the article. You won't be able to run the container if you have not been approved.
