<properties
	pageTitle="Delete a custom domain in Azure Active Directory | Microsoft Azure"
	description="How to delete a custom domain in Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/28/2016"
	ms.author="curtand;jeffsta"/>


# Deleting a custom domain name

You can delete a custom domain name that you no longer need to use with your Azure AD; for example, a new corporate name, yous are using a different Azure AD, or similar.

To delete a domain:

1.  Sign into the Azure management portal as a global admin

2.  Open your directory, click on domains

3.  Select the domain and click delete

You can always delete an unverified domain, such as if you find you mis-typed the name after adding it, or if you did not set the value correctly as to whether the domain will be federated. You can delete a verified domain only if it has no resources associated with it. Before you can delete a verified domain, you must change or delete:

-   Any user that has the domain in their user name or email address

-   Any mail-enabled group that has the domain in its email address

-   Any application that has the domain as part of its reply URL
