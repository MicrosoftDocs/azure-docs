---
title: Azure Government Identity
description: Microsoft Azure Government provides the same ways to build applications and manage identities as Azure Public. This article provides planning guidance for identity management in Azure Government.
ms.service: azure-government
ms.topic: article
recommendations: false
ms.date: 06/15/2022
---

# Planning identity for Azure Government applications

Microsoft Azure Government provides the same ways to build applications and manage identities as Azure Public. Azure Government customers may already have a Microsoft Entra Public tenant or may create a tenant in Microsoft Entra Government. This article provides guidance on identity decisions based on the application and location of your identity.

## Identity models

Before determining the identity approach for your application, you need to know what identity types are available to you. There are three types: On-premises identity, Cloud identity, and Hybrid identity.

|On-premises identity|Cloud identity|Hybrid identity|
|---|---|---|
|On-premises identities belong to on-premises Active Directory environments that most customers use today.|Cloud identities originate, exist only, and are managed in Microsoft Entra ID.|Hybrid identities originate as on-premises identities, but become hybrid through directory synchronization to Microsoft Entra ID. After directory synchronization, they exist both on-premises and in the cloud, hence hybrid.|
 
> [!NOTE]
> Hybrid comes with deployment options (synchronized identity, federated identity, and so on) that all rely on directory synchronization and mostly define how identities are authenticated as discussed in [What is hybrid identity with Microsoft Entra ID?](../active-directory/hybrid/whatis-hybrid-identity.md).
>

## Selecting identity for an Azure Government application

When building any Azure application, you must first decide on the authentication technology:

- **Applications using modern authentication** – Applications using OAuth, OpenID Connect, and/or other modern authentication protocols supported by Microsoft Entra such as newly developed application built using PaaS technologies, for example, Web Apps, Azure SQL Database, and so on.
- **Applications using legacy authentication protocols (Kerberos/NTLM)** – Applications typically migrated from on-premises, for example, lift-and-shift applications.

Based on this decision, there are different considerations when building and deploying on Azure Government.

### Applications using modern authentication in Azure Government

[Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md) shows how you can use Microsoft Entra ID to provide secure sign-in and authorization to your applications. This process is the same for Azure Public and Azure Government once you choose your identity authority.

#### Choosing your identity authority

Azure Government applications can use Microsoft Entra Government identities, but can you use Microsoft Entra Public identities to authenticate to an application hosted in Azure Government? Yes! Since you can use either identity authority, you need to choose which to use:

-	**Microsoft Entra Public** – Commonly used if your organization already has a Microsoft Entra Public tenant to support Office 365 (Public or GCC) or another application.
-	**Microsoft Entra Government** - Commonly used if your organization already has a Microsoft Entra Government tenant to support Office 365 (GCC High or DoD) or are creating a new tenant in Microsoft Entra Government.

Once decided, the special consideration is where you perform your app registration. If you choose Microsoft Entra Public identities for your Azure Government application, you must register the application in your Microsoft Entra Public tenant. Otherwise, if you perform the app registration in the directory the subscription trusts (Azure Government) the intended set of users can't authenticate.

> [!NOTE]
> Applications registered with Microsoft Entra-only allow sign-in from users in the Microsoft Entra tenant the application was registered in. If you have multiple Microsoft Entra Public tenants, it’s important to know which is intended to allow sign-ins from. If you intend to allow users to authenticate to the application from multiple Microsoft Entra tenants the application must be registered in each tenant.
>

The other consideration is the identity authority URL. You need the correct URL based on your chosen authority:

|Identity authority|URL|
|------------------|---|
|Microsoft Entra Public|login.microsoftonline.com|
|Microsoft Entra Government|login.microsoftonline.us|

### Applications using legacy authentication protocols (Kerberos/NTLM)

Supporting Infrastructure-as-a-Service (IaaS) cloud-based applications dependent on NTLM/Kerberos authentication requires on-premises identity. The aim is to support logins for line-of-business application and other apps that require Windows integrated authentication. Adding Active Directory domain controllers as virtual machines in Azure IaaS is the typical method to support these types of apps, shown in the following figure: 

:::image type="content" source="./media/documentation-government-plan-identity-extending-ad-to-azure-iaas.png" alt-text="Extending on-premises Active Directory footprint to Azure IaaS." border="false":::

> [!NOTE]
> The preceding figure is a simple connectivity example, using site-to-site VPN. Azure ExpressRoute is another and preferred connectivity option.
>

The type of domain controller to place in Azure is also a consideration based on application requirements for directory access. If applications require directory write access, deploy a standard domain controller with a writable copy of the Active Directory database. If applications only require directory read access, we recommend deploying a Read-Only Domain Controller (RODC) to Azure instead. Specifically, for RODCs we recommend following the guidance available at [Planning domain controller placement](/windows-server/identity/ad-ds/plan/planning-domain-controller-placement).

Documentation covering the guidelines for deploying Active Directory Domain Controllers and Active Director Federation Services (ADFS) is available from:

- [Safely virtualizing Active Directory Domain Services](/windows-server/identity/ad-ds/introduction-to-active-directory-domain-services-ad-ds-virtualization-level-100) answers questions such as
  - Is it safe to virtualize Windows Server Active Directory Domain Controllers?
  - Why deploy Active Directory to Azure Virtual Machines?
  - Can you deploy ADFS to Azure Virtual Machines?
- [Deploying Active Directory Federation Services in Azure](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs) provides guidance on how to deploy ADFS in Azure.

## Identity scenarios for subscription administration in Azure Government

First, see [Connect to Azure Government using portal](./documentation-government-get-started-connect-with-portal.md) for instructions on accessing Azure Government management portal.

There are a few important points that set the foundation of this section:

- Azure subscriptions only trust one directory, therefore subscription administration must be performed by an identity from that directory.
- Azure Public subscriptions trust directories in Microsoft Entra Public whereas Azure Government subscriptions trust directories in Microsoft Entra Government.
- If you have both Azure Public and Azure Government subscriptions, separate identities for both are required.

The currently supported identity scenarios to simultaneously manage Azure Public and Azure Government subscriptions are:

- Cloud identities - Cloud identities are used to manage both subscriptions.
- Hybrid and cloud identities - Hybrid identity for one subscription, cloud identity for the other.
- Hybrid identities - Hybrid identities are used to manage both subscriptions.

A common scenario, having both Office 365 and Azure subscriptions, is conveyed in the following sections.

### Using cloud identities for multi-cloud subscription administration

The following diagram is the simplest of the scenarios to implement.

:::image type="content" source="./media/documentation-government-plan-identity-cloud-identities-for-subscription-administration.png" alt-text="Multi-cloud subscription administration option using cloud identities for Office 365 and Azure Government." border="false":::

While using cloud identities is the simplest approach, it is also the least secure because passwords are used as an authentication factor. We recommend [Microsoft Entra multifactor authentication](../active-directory/authentication/concept-mfa-howitworks.md), Microsoft's two-step verification solution, to add a critical second layer of security to secure access to Azure subscriptions when using cloud identities.

### Using hybrid and cloud identities for multi-cloud subscription administration

In this scenario, we include administrator identities through directory synchronization to the Public tenant while cloud identities are still used in the government tenant.

:::image type="content" source="./media/documentation-government-plan-identity-hybrid-and-cloud-identities-for-subscription-administration.png" alt-text="Using hybrid and cloud identities for multi-cloud subscription administration with smartcards for access." border="false":::

Using hybrid identities for administrative accounts allows the use of smartcards (physical or virtual). Government agencies using Common Access Cards (CACs) or Personal Identity Verification (PIV) cards benefit from this approach. In this scenario, ADFS serves as the identity provider and implements the two-step verification (for example, smart card + PIN).

### Using hybrid identities for multi-cloud subscription administration

In this scenario, hybrid identities are used to administrator subscriptions in both clouds.

:::image type="content" source="./media/documentation-government-plan-identity-hybrid-identities-for-subscription-administration.png" alt-text="Using hybrid identities for multi-cloud subscription administration, requiring different credentials for each cloud service." border="false":::

## Frequently asked questions

**Why does Office 365 GCC use Microsoft Entra Public?** </br>
The first Office 365 US Government environment, Government Community Cloud (GCC), was created when Microsoft had a single cloud directory. The Office 365 GCC environment was designed to use Microsoft Entra Public while still adhering to controls and requirements outlined in FedRAMP Moderate, Criminal Justice Information Services (CJIS), Internal Revenue Service (IRS) 1075, and National Institute of Standards and Technology (NIST) Special Publication (SP) 800-171. Azure Government, with its Microsoft Entra infrastructure, was created later. By that time, GCC had already secured the necessary compliance authorizations (for example, FedRAMP Moderate and CJIS) to meet Federal, State, and Local government requirements while serving hundreds of thousands of customers. Now, many Office 365 GCC customers have two Microsoft Entra tenants: one from the Microsoft Entra subscription that supports Office 365 GCC and the other from their Azure Government subscription, with identities in both.

**How do I identify an Azure Government tenant?** </br>
Here’s a way to find out using your browser of choice:

   - Obtain your tenant name (for example, contoso.onmicrosoft.com) or a domain name registered to your Microsoft Entra tenant (for example, contoso.gov).  
   - Navigate to `https://login.microsoftonline.com/<domainname>/.well-known/openid-configuration`
     - \<domainname\> can either be the tenant name or domain name you gathered in the previous step.
     - **An example URL**: `https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration`
   - The result posts back to the page in attribute/value pairs using JavaScript Object Notation (JSON) format that resembles:

     ```json
     {
       "authorization_endpoint":"https://login.microsoftonline.com/b552ff1c-edad-4b6f-b301-5963a979bc4d/oauth2/authorize",
       "tenant_region_scope":"USG"
     }
     ```
     
   - If the **tenant_region_scope** attribute’s value is **USG** as shown or **USGov**, you have yourself an Azure Government tenant.
     - The result is a JSON file that’s natively rendered by more modern browsers such as Microsoft Edge, Mozilla Firefox, and Google Chrome. Internet Explorer doesn’t natively render the JSON format so instead prompts you to open or save the file. If you must use Internet Explorer, choose the save option and open it with another browser or plain text reader.
     - The tenant_region_scope property is exactly how it sounds, regional. If you have a tenant in Azure Public in North America, the value would be **NA**.

**If I’m an Office 365 GCC customer and want to build solutions in Azure Government do I need to have two tenants?** </br>
Yes, the Microsoft Entra Government tenant is required for your Azure Government subscription administration.

**If I’m an Office 365 GCC customer that has built workloads in Azure Government, where should I authenticate from: Public or Government?** </br>
See [Choosing your identity authority](#choosing-your-identity-authority) earlier in this article.

**I’m an Office 365 customer and have chosen hybrid identity as my identity model. I also have several Azure subscriptions. Is it possible to use the same Microsoft Entra tenant to handle sign-in for Office 365, applications built in my Azure subscriptions, and/or applications reconfigured to use Microsoft Entra ID for sign-in?** </br>
Yes, see [Associate or add an Azure subscription to your Microsoft Entra tenant](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) to learn more about the relationship between Azure subscriptions and Microsoft Entra ID. It also contains instructions on how to associate subscriptions to the common directory of your choosing.

**Can an Azure Government subscription be associated with a directory in Microsoft Entra Public?** </br>
No, the ability to manage Azure Government subscriptions requires identities sourced from a directory in Microsoft Entra Government.

## Next steps

- [Azure Government developer guide](./documentation-government-developer-guide.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Multi-tenant user management](../active-directory/fundamentals/multi-tenant-user-management-introduction.md)
- [Microsoft Entra fundamentals documentation](../active-directory/fundamentals/index.yml)
