<properties
	pageTitle="Add and verify a custom domain name | Microsoft Azure"
	description="Explains the overall process of how to add your own domain names to Azure Active Directory, and procedures for verifying DNS entries."
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


# Add and verify your custom domain name

To add a custom domain name and verify it for use with your Azure Active Directory, you need to complete four steps.

1.  Do one of the following:

	-   [Add and verify a custom domain name that will be federated with on-premises Active Directory](#add-a-custom-domain-name-that-will-be-federated)

	-   [Add and verify a custom domain name that will not be federated with on-premises Active Directory](#add-and-verify-a-custom-domain-name-that-will-not-be-federated)

2.  See the DNS entries that Azure AD will use to verify that your organization owns the custom domain name.

3.  Add those DNS entries at the domain name registrar for your domain.

4.  Verify the custom domain name.
