---
title: 'Plan application migration to Microsoft Entra ID'
description: This article discusses the advantages of Microsoft Entra ID and provides a four-phase guide for planning and executing a migration strategy with detailed planning and exit criteria.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/31/2023
ms.author: jomondi
ms.reviewer: gasinh
ms.collection: M365-identity-device-management
---

# Plan application migration to Microsoft Entra ID

In this article, you'll learn about the benefits of Microsoft Entra ID and how to plan for migrating your application authentication. This article gives an overview of the planning and exit criteria to help you plan your migration strategy and understand how Microsoft Entra authentication can support your organizational goals.

The process is broken into four phases, each with detailed planning and exit criteria, and designed to help you plan your migration strategy and understand how Microsoft Entra authentication supports your organizational goals.

> [!VIDEO https://www.youtube.com/embed/8WmquuuuaLk]

## Introduction

Today, your organization requires numerous applications for users to get work done. You likely continue to add, develop, or retire apps every day. Users access these applications from a vast range of corporate and personal devices, and locations. They open apps in many ways, including:

- Through a company homepage or portal
- By bookmarking or adding favorites on their browsers
- Through a vendor’s URL for software as a service (SaaS) apps
- Links pushed directly to user’s desktops or mobile devices via a mobile device/application management (MDM/ MAM) solution

Your applications are likely using the following types of authentication:

- Security Assertion Markup Language (SAML) or OpenID Connect (OIDC) via an on-premises or cloud-hosted Identity and Access Management (IAM) solutions federation solution (such as Active Directory Federation Services (ADFS), Okta, or Ping)

- Kerberos or NTLM via Active Directory

- Header-based authentication via Ping Access

To ensure that the users can easily and securely access applications, your goal is to have a single set of access controls and policies across your on-premises and cloud environments.

[Microsoft Entra ID](../fundamentals/whatis.md) offers a universal identity platform that provides your employees, partners, and customers a single identity to access the applications they want and collaborate from any platform and device.

:::image type="content" source="media/migrate-adfs-apps-phases-overview/connectivity.png" alt-text="Diagram showing Microsoft Entra connectivity.":::

Microsoft Entra ID has a [full suite of identity management capabilities](../fundamentals/whatis.md#which-features-work-in-azure-ad). Standardizing your app authentication and authorization to Microsoft Entra ID gets you the benefits that these capabilities provide.

You can find more migration resources at [https://aka.ms/migrateapps](./migration-resources.md)

## Plan your migration phases and project strategy

When technology projects fail, it's often due to mismatched expectations, the right stakeholders not being involved, or a lack of communication. Ensure your success by planning the project itself.

### The phases of migration

Before we get into the tools, you should understand how to think through the migration process. Through several direct-to-customer workshops, we recommend the following four phases:

:::image type="content" source="media/migrate-adfs-apps-phases-overview/phases-of-migration.png" alt-text="Diagram showing the phases of migration.":::

### Assemble the project team

Application migration is a team effort, and you need to ensure that you've all the vital positions filled. Support from senior business leaders is important. Ensure that you involve the right set of executive sponsors, business decision-makers, and subject matter experts (SMEs.)

During the migration project, one person may fulfill multiple roles, or multiple people fulfill each role, depending on your organization’s size and structure. You may also have a dependency on other teams that play a key role in your security landscape.

The following table includes the key roles and their contributions:

| Role          | Contributions                                              |
| ------------- | ---------------------------------------------------------- |
| **Project Manager** | Project coach accountable for guiding the project, including:<br /> - gain executive support<br /> - bring in stakeholders<br /> - manage schedules, documentation, and communications |
| **Identity Architect / Microsoft Entra App Administrator** | Responsible for the following:<br /> - design the solution in cooperation with stakeholders<br /> - document the solution design and operational procedures for handoff to the operations team<br /> - manage the preproduction and production environments |
| **On premises AD operations team** | The organization that manages the different on-premises identity sources such as AD forests, LDAP directories, HR systems etc.<br /> - perform any remediation tasks needed before synchronizing<br /> - Provide the service accounts required for synchronization<br /> - provide access to configure federation to Microsoft Entra ID |
| **IT Support Manager** | A representative from the IT support organization who can provide input on the supportability of this change from a helpdesk perspective. |
| **Security Owner**  | A representative from the security team that can ensure that the plan meets the security requirements of your organization. |
| **Application technical owners** | Includes technical owners of the apps and services that integrate with Microsoft Entra ID. They provide the applications’ identity attributes that should include in the synchronization process. They usually have a relationship with CSV representatives. |
| **Application business Owners** | Representative colleagues who can provide input on the user experience and usefulness of this change from a user’s perspective and owns the overall business aspect of the application, which may include managing access. |
| **Pilot group of users** | Users who test as a part of their daily work, the pilot experience, and provide feedback to guide the rest of the deployments. |

### Plan communications

Effective business engagement and communication are the keys to success. It's important to give stakeholders and end-users an avenue to get information and keep informed of schedule updates. Educate everyone about the value of the migration, what the expected timelines are, and how to plan for any temporary business disruption. Use multiple avenues such as briefing sessions, emails, one-to-one meetings, banners, and town halls.

Based on the communication strategy that you've chosen for the app you may want to remind users of the pending downtime. You should also verify that there are no recent changes or business impacts that would require to postpone the deployment.

In the following table, you find the minimum suggested communication to keep your stakeholders informed:

## Plan phases and project strategy

| Communication      | Audience                                          |
| ------------------ | ------------------------------------------------- |
| Awareness and business / technical value of project | All except end users |
| Solicitation for pilot apps | - App business owners<br />- App technical owners<br />- Architects and Identity team |

**Phase 1- Discover and Scope**:

| Communication      | Audience                                          |
| ------------------ | ------------------------------------------------- |
| - Solicitation for application information<br />- Outcome of scoping exercise | - App technical owners<br />- App business owners |

**Phase 2- Classify apps and plan pilot**:

| Communication      | Audience                                          |
| ------------------ | ------------------------------------------------- |
| - Outcome of classifications and what that means for migration schedule<br />- Preliminary migration schedule | - App technical owners<br /> - App business owners |

**Phase 3 – Plan migration and testing**:

| Communication      | Audience                                          |
| ------------------ | ------------------------------------------------- |
| - Outcome of application migration testing | - App technical owners<br />- App business owners |
| - Notification that migration is coming and explanation of resultant <br/>end-user experiences.<br />- Downtimes coming and complete communications, including what<br/> they should now do, feedback, and how to get help | - End users (and all others) |

**Phase 4 – Manage and gain insights**:

| Communication      | Audience                                          |
| ------------------ | ------------------------------------------------- |
| Available analytics and how to access | - App technical owners<br />- App business owners |

## Migration states communication dashboard

Communicating the overall state of the migration project is crucial, as it shows progress, and helps app owners whose apps are coming up for migration to prepare for the move. You can put together a simple dashboard using Power BI or other reporting tools to provide visibility into the status of applications during the migration.

The migration states you might consider using are as follows:

| Migration states       | Action plan                                   |
| ---------------------- | --------------------------------------------- |
| **Initial Request** | Find the app and contact the owner for more information |
| **Assessment Complete** | App owner evaluates the app requirements and returns the app questionnaire</td>
| **Configuration in Progress** | Develop the changes necessary to manage authentication against Microsoft Entra ID |
| **Test Configuration Successful** | Evaluate the changes and authenticate the app against the test Microsoft Entra tenant in the test environment |
| **Production Configuration Successful** | Change the configurations to work against the production AD tenant and assess the app authentication in the test environment |
| **Complete / Sign Off** | Deploy the changes for the app to the production environment and execute against the production Microsoft Entra tenant |

This ensures app owners know what the app migration and testing schedule are when their apps are up for migration, and what the results are from other apps that have already been migrated. You might also consider providing links to your bug tracker database for owners to be able to file and view issues for apps that are being migrated.

## Best practices

The following articles are about our customer and partner’s success stories, and suggested best practices:

- [Five tips to improve the migration process to Microsoft Entra ID](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Five-tips-to-improve-the-migration-process-to-Azure-Active/ba-p/445364) by Patriot Consulting, a member of our partner network that focuses on helping customers deploy Microsoft cloud solutions securely.

- [Develop a risk management strategy for your Microsoft Entra application migration](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Develop-a-risk-management-strategy-for-your-Azure-AD-application/ba-p/566488) by Edgile, a partner that focuses on IAM and risk management solutions.

## Next steps

- [Phase 1 - Discover and Scope](migrate-adfs-discover-scope-apps.md).
