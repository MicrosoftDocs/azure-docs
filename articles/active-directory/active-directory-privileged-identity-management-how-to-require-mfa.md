<properties
   pageTitle="Azure Privileged Identity Management: How To Require MFA"
   description="Learn how to require MFA (multi-factor authentication) for privileged identities with the Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="IHenkel"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/21/2015"
   ms.author="inhenk"/>

# Azure Privileged Identity Management: How To How To Require MFA
It is highly recommended that you require multi-factor authentication for all of your administrators.

##Requiring MFA in Azure Privileged Identity Management
When you log in as a PIM administrator, you will receive alerts that suggest that your privileged accounts should require multi-factor authentication (MFA).  Click the security alert in the PIM dashboard and a new blade will open with a list of the administrator accounts that should require MFA.  You can require MFA by selecting multiple roles and then clicking the Fix button, or you can click the ellipses next to individual roles and then click the Fix button.

Additionally, you can change the MFA requirement by role by clicking on a role in the Roles section of the dashboard, then enabling MFA for that role by clicking on Settings in the role blade and then selecting Enable under multi-factor authentication.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
