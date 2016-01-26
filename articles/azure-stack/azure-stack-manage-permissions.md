<properties
	pageTitle="Manage permissions to resources per user in Azure Stack (service administrator and tenant)"
	description="As a service administrator or tenant, learn how to manage permissions to resources per user."
	services="azure-stack"
	documentationCenter=""
	authors="erikje"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="erikje"/>

# Manage permissions to resources per user in Azure Stack (service administrator and tenant)

For each subscription, resource group, or service, you can assign any user in Microsoft Azure Stack one of three different roles: Reader, Owner, or Contributor.

-   Reader: User can view everything, but can’t make any changes.

-   Contributor: User can manage everything except access to resources.

-   Owner: User can manage everything, including access to resources.

For example, User A might have reader permissions to Subscription 1, but have owner permissions to Virtual Machine 7.

## To set access permissions for a user

1.  Sign in with an account that has owner permissions to the resource you want to manage.

2.  In the blade for the resource, click the **Access** icon ![](media/azure-stack-manage-permissions/image1.png).

3.  In the **Users** blade, click **Roles**.

4.  In the **Roles** blade, click **Add** to add permissions for the user.

## Next Steps

[Publish a custom marketplace item](azure-stack-publish-custom-marketplace-item.md)
