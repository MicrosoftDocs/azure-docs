---
author: billmath
ms.service: active-directory
ms.subservice: governance
ms.topic: include
ms.date: 10/16/2019
ms.author: billmath
# Used by articles that need hr provisioning intro
---


## Cloud HR application to Azure Active Directory user provisioning

Historically, IT staff have relied on manual methods to create, update, and delete employees. They've used methods such as uploading CSV files or custom scripts to sync employee data. These provisioning processes are error prone, insecure, and hard to manage.

To manage the identity lifecycles of employees, vendors, or contingent workers, [Azure Active Directory (Azure AD) user provisioning service](../articles/active-directory/app-provisioning/user-provisioning.md) offers integration with cloud-based human resources (HR) applications. Examples of applications include Workday or SuccessFactors.

Azure AD uses this integration to enable the following cloud HR application (app) workflows:

- **Provision users to Active Directory:** Provision selected sets of users from a cloud HR app into one or more Active Directory domains.
- **Provision cloud-only users to Azure AD:** In scenarios where Active Directory isn't used, provision users directly from the cloud HR app to Azure AD.
- **Write back to the cloud HR app:** Write the email addresses and username attributes from Azure AD back to the cloud HR app.


## Enabled HR scenarios

The Azure AD user provisioning service enables automation of the following HR-based identity lifecycle management scenarios:

- **New employee hiring:** When a new employee is added to the cloud HR app, a user account is automatically created in Active Directory and Azure AD with the option to write back the email address and username attributes to the cloud HR app.
- **Employee attribute and profile updates:** When an employee record such as name, title, or manager is updated in the cloud HR app, their user account is automatically updated in Active Directory and Azure AD.
- **Employee terminations:** When an employee is terminated in the cloud HR app, their user account is automatically disabled in Active Directory and Azure AD.
- **Employee rehires:** When an employee is rehired in the cloud HR app, their old account can be automatically reactivated or reprovisioned to Active Directory and Azure AD.

## Who is this integration best suited for?

The cloud HR app integration with Azure AD user provisioning is ideally suited for organizations that:

- Want a prebuilt, cloud-based solution for cloud HR user provisioning.
- Require direct user provisioning from the cloud HR app to Active Directory or Azure AD.
- Require users to be provisioned by using data obtained from the cloud HR app.
- Require joining, moving, and leaving users to be synced to one or more Active Directory forests, domains, and OUs based only on change information detected in the cloud HR app.
- Use Office 365 for email.


### Key benefits

This capability of HR-driven IT provisioning offers the following significant business benefits:

- **Increase productivity:** You can now automate the assignment of user accounts and Office 365 licenses and provide access to key groups. Automating assignments gives new hires immediate access to their job tools and increases productivity.
- **Manage risk:** You can increase security by automating changes based on employee status or group memberships with data flowing in from the cloud HR app. Automating changes ensures that user identities and access to key apps update automatically when users transition or leave the organization.
- **Address compliance and governance:** Azure AD supports native audit logs for user provisioning requests performed by apps of both source and target systems. With auditing, you can track who has access to the apps from a single screen.
- **Manage cost:** Automatic provisioning reduces costs by avoiding inefficiencies and human error associated with manual provisioning. It reduces the need for custom-developed user provisioning solutions built over time by using legacy and outdated platforms.
