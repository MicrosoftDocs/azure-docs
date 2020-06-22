---
title: Common deployment scenarios for Azure AD Domain Services | Microsoft Docs
description: Learn about some of the common scenarios and use-cases for Azure Active Directory Domain Services to provide value and meet business needs.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: c5216ec9-4c4f-4b7e-830b-9d70cf176b20
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: conceptual
ms.date: 02/10/2020
ms.author: iainfou

---
# Common use-cases and scenarios for Azure Active Directory Domain Services

Azure Active Directory Domain Services (Azure AD DS) provides managed domain services such as domain join, group policy, lightweight directory access protocol (LDAP), and Kerberos / NTLM authentication. Azure AD DS integrates with your existing Azure AD tenant, which makes it possible for users to sign in using their existing credentials. You use these domain services without the need to deploy, manage, and patch domain controllers in the cloud, which provides a smoother lift-and-shift of on-premises resources to Azure.

This article outlines some common business scenarios where Azure AD DS provides value and meets those needs.

## Secure administration of Azure virtual machines

To let you use a single set of AD credentials, Azure virtual machines (VMs) can be joined to an Azure AD DS managed domain. This approach reduces credential management issues such as maintaining local administrator accounts on each VM or separate accounts and passwords between environments.

VMs that are joined to a managed domain can also be managed and secured using group policy. Required security baselines can be applied to VMs to lock them down in accordance with corporate security guidelines. For example, you can use group policy management capabilities to restrict the types of applications that can be launched on the VM.

![Streamlined administration of Azure virtual machines](./media/active-directory-domain-services-scenarios/streamlined-vm-administration.png)

Let's look at a common example scenario. As servers and other infrastructure reaches end-of-life, Contoso wants to move applications currently hosted on premises to the cloud. Their current IT standard mandates that servers hosting corporate applications must be domain-joined and managed using group policy. Contoso's IT administrator would prefer to domain join VMs deployed in Azure to make administration easier as users can then sign in using their corporate credentials. When domain-joined, VMs can also be configured to comply with required security baselines using group policy objects (GPOs). Contoso would prefer not to deploy, monitor, and manage their own domain controllers in Azure.

Azure AD DS is a great fit for this use-case. A managed domain lets you domain-join VMs, use a single set of credentials, and apply group policy. As a managed domain, you don't have to configure and maintain the domain controllers yourself.

### Deployment notes

The following deployment considerations apply to this example use case:

* Managed domains use a single, flat Organizational Unit (OU) structure by default. All domain-joined VMs are in a single OU. If desired, you can create custom OUs.
* Azure AD DS uses a built-in GPO each for the users and computers containers. For additional control, you can create custom GPOs and target them to custom OUs.
* Azure AD DS supports the base AD computer object schema. You can't extend the computer object's schema.

## Lift-and-shift on-premises applications that use LDAP bind authentication

As a sample scenario, Contoso has an on-premises application that was purchased from an ISV many years ago. The application is currently in maintenance mode by the ISV and requesting changes to the application is prohibitively expensive. This application has a web-based frontend that collects user credentials using a web form and then authenticates users by performing an LDAP bind to the on-premises AD DS environment.

![LDAP bind](./media/active-directory-domain-services-scenarios/ldap-bind.png)

Contoso would like to migrate this application to Azure. The application should continue to works as-is, with no changes needed. Additionally, users should be able to authenticate using their existing corporate credentials and without additional training. It should be transparent to end users where the application is running.

For this scenario, Azure AD DS lets applications perform LDAP binds as part of the authentication process. Legacy on-premises applications can lift-and-shift into Azure and continue to seamlessly authenticate users without any change in configuration or user experience.

### Deployment notes

The following deployment considerations apply to this example use case:

* Make sure that the application doesn't need to modify/write to the directory. LDAP write access to a managed domain isn't supported.
* You can't change passwords directly against a managed domain. End users can change their password either using Azure AD's self-service password change mechanism or against the on-premises directory. These changes are then automatically synchronized and available in the managed domain.

## Lift-and-shift on-premises applications that use LDAP read to access the directory

Like the previous example scenario, let's assume Contoso has an on-premises line-of-business (LOB) application that was developed almost a decade ago. This application is directory aware and was designed to use LDAP to read information/attributes about users from AD DS. The application doesn't modify attributes or otherwise write to the directory.

Contoso wants to migrate this application to Azure and retire the aging on-premises hardware currently hosting this application. The application can't be rewritten to use modern directory APIs such as the REST-based Microsoft Graph API. A lift-and-shift option is desired where the application can be migrated to run in the cloud, without modifying code or rewriting the application.

To help with this scenario, Azure AD DS lets applications perform LDAP reads against the managed domain to get the attribute information it needs. The application doesn't need to be rewritten, so a lift-and-shift into Azure lets users continue to use the app without realizing there's a change in where it runs.

### Deployment notes

The following deployment considerations apply to this example use case:

* Make sure that the application doesn't need to modify/write to the directory. LDAP write access to a managed domain isn't supported.
* Make sure that the application doesn't need a custom/extended Active Directory schema. Schema extensions aren't supported in Azure AD DS.

## Migrate an on-premises service or daemon application to Azure

Some applications include multiple tiers, where one of the tiers needs to perform authenticated calls to a backend tier, such as a database. AD service accounts are commonly used in these scenarios. When you lift-and-shift applications into Azure, Azure AD DS lets you continue to use service accounts in the same way. You can choose to use the same service account that is synchronized from your on-premises directory to Azure AD or create a custom OU and then create a separate service account in that OU. With either approach, applications continue to function the same way to make authenticated calls to other tiers and services.

![Service account using WIA](./media/active-directory-domain-services-scenarios/wia-service-account.png)

In this example scenario, Contoso has a custom-built software vault application that includes a web front end, a SQL server, and a backend FTP server. Windows-integrated authentication using service accounts authenticates the web front end to the FTP server. The web front end is set up to run as a service account. The backend server is configured to authorize access from the service account for the web front end. Contoso doesn't want to deploy and manage their own domain controller VMs in the cloud to move this application to Azure.

For this scenario, the servers hosting the web front end, SQL server, and the FTP server can be migrated to Azure VMs and joined to a managed domain. The VMs can then use the same service account in their on-premises directory for the app’s authentication purposes, which is synchronized through Azure AD using Azure AD Connect.

### Deployment notes

The following deployment considerations apply to this example use case:

* Make sure that the applications use a username and password for authentication. Certificate or smartcard-based authentication isn't supported by Azure AD DS.
* You can't change passwords directly against a managed domain. End users can change their password either using Azure AD's self-service password change mechanism or against the on-premises directory. These changes are then automatically synchronized and available in the managed domain.

## Windows Server remote desktop services deployments in Azure

You can use Azure AD DS to provide managed domain services to remote desktop servers deployed in Azure. For more information about this deployment scenario, see [how to integrate Azure AD Domain Services with your RDS deployment][windows-rds].

## Domain-joined HDInsight clusters

You can set up an Azure HDInsight cluster that is joined to a managed domain with Apache Ranger enabled. You can create and apply Hive policies through Apache Ranger, and allow users, such as data scientists, to connect to Hive using ODBC-based tools like Excel or Tableau. We continue to work to add other workloads, such as HBase, Spark, and Storm to domain-joined HDInsight.

For more information about this deployment scenario, see [how to configure domain-joined HDInsight clusters][hdinsight]

## Next steps

To get started, [Create and configure an Azure Active Directory Domain Services managed domain][tutorial-create-instance]

<!-- INTERNAL LINKS -->
[hdinsight]: ../hdinsight/domain-joined/apache-domain-joined-configure.md
[tutorial-create-instance]: tutorial-create-instance.md

<!-- EXTERNAL LINKS -->
[windows-rds]: /windows-server/remote/remote-desktop-services/rds-azure-adds
