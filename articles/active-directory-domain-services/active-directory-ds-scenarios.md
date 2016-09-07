<properties
	pageTitle="Azure Active Directory Domain Services preview: Deployment scenarios | Microsoft Azure"
	description="Deployment scenarios for Azure AD Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/07/2016"
	ms.author="maheshu"/>


# Deployment scenarios and use-cases
In this section, we look at a few scenarios and use-cases that benefit from Azure Active Directory (AD) Domain Services.

## Secure, easy administration of Azure virtual machines
You can use Azure Active Directory Domain Services to manage your Azure virtual machines in a streamlined manner. Azure virtual machines can be joined to the managed domain, thus enabling you to use your corporate AD credentials to log in. This approach helps avoid credential management hassles such as maintaining local administrator accounts on each of your Azure virtual machines.

Server virtual machines that are joined to the managed domain can also be managed and secured using Group Policy. You can apply required security baselines to your Azure virtual machines and lock them down in accordance with corporate security guidelines. For example, you can use group policy management capabilities to restrict the types of applications that can be launched on these virtual machines.

![Streamlined administration of Azure virtual machines](./media/active-directory-domain-services-scenarios/streamlined-vm-administration.png)

As servers and other infrastructure reaches end-of-life, Contoso is moving many applications currently hosted on premises to the cloud. Their current IT standard mandates that servers hosting corporate applications must be domain-joined and managed using Group Policy. Contoso's IT administrator prefers to domain join virtual machines deployed in Azure, to make administration easier. This enables administrators and users to log in using their corporate credentials. At the same time, machines can be configured to comply with required security baselines using Group Policy. Contoso would prefer not to have to deploy, monitor, and manage domain controllers in Azure to secure Azure virtual machines. Therefore, Azure AD Domain Services is a great fit for this use-case.

A few important points to note when considering this scenario:

- Managed domains provided by Azure AD Domain Services provide a single flat OU (Organizational Unit) structure by default. All domain-joined machines reside in a single flat OU. You may however choose to create custom OUs.
- Azure AD Domain Services supports simple Group Policy in the form of a built-in GPO each for the users and computers containers. You cannot target GP by OU/department, perform WMI filtering, or create custom GPOs.
- Azure AD Domain Services supports the base AD computer object schema. You cannot extend the computer object's schema.


## Lift-and-shift an on-premises application that uses LDAP bind authentication to Azure Infrastructure Services
Contoso has an on-premises application that was purchased from an ISV many years ago. The application is currently in maintenance mode by the ISV and requesting changes to the application is prohibitively expensive for Contoso. This application has a web-based frontend that collects user credentials using a web form and then authenticates users by performing an LDAP bind to the corporate Active Directory. Contoso would like to migrate this application to Azure Infrastructure Services. It is desirable that the application works as is, without requiring any changes. Additionally, users should be able to authenticate using their existing corporate credentials and without having to retrain users to do things differently. In other words, end users should be oblivious of where the application is running and the migration should be transparent to them.

A few important points to note when considering this scenario:

- Ensure that the application does not need to modify/write to the directory. LDAP write access to managed domains provided by Azure AD Domain Services is not supported.
- End users cannot change their password directly against the managed domain. They can change their password either using Azure AD's self-service password change mechanism or against the on-premises directory. These changes are automatically synchronized and available in the managed domain.


## Lift-and-shift an on-premises application that uses LDAP read to access the directory to Azure Infrastructure Services
Contoso has an on-premises line-of-business (LOB) application that was developed almost a decade ago. This application is directory aware and was designed to work with Windows Server AD. The application uses LDAP (Lightweight Directory Access Protocol) to read information/attributes about users from Active Directory. The application does not modify attributes or otherwise write to the directory. Contoso would like to migrate this application to Azure Infrastructure Services and retire the aging on-premises hardware currently hosting this application. The application cannot be rewritten to use modern directory APIs such as the REST-based Azure AD Graph API. Therefore, a lift-and-shift option is desired whereby the application can be migrated to run in the cloud, without modifying code or rewriting the application.

A few important points to note when considering this scenario:

- Ensure that the application does not need to modify/write to the directory. LDAP write access to managed domains provided by Azure AD Domain Services is not supported.
- Ensure that the application does not need a custom/extended Active Directory schema. Schema extensions are not supported in Azure AD Domain Services.
- Ensure that the application does not require LDAPS access. LDAPS is not supported by Azure AD Domain Services.


## Migrate an on-premises service or daemon application to Azure Infrastructure Services
Contoso has a custom-built software vault application that includes a web front end, a SQL server, and a backend FTP server. Windows-integrated authentication of service accounts is used to authenticate the web front end to the FTP server. They would like to move this application to Azure Infrastructure Services. Contoso prefers not to have to deploy a domain controller virtual machine in the cloud, in order to support the identity needs of this application. Contoso's IT administrator can deploy the servers hosting the web front end, SQL server and the FTP server to Azure virtual machines and join them to an Azure AD Domain Services domain. Then, they can use the same service account in their directory for the app’s authentication purposes.

A few important points to note when considering this scenario:

- Ensure that the application uses username/password for authentication. Certificate/Smartcard based authentication is not supported by Azure AD Domain Services.


## Azure RemoteApp
Azure RemoteApp enables Contoso's administrator to create a domain-joined collection. This feature enables remote applications served by Azure RemoteApp to run on domain-joined computers and to access other resources using Windows-integrated authentication. Contoso can use Azure AD Domain Services to provide a managed domain used by Azure RemoteApp domain-joined collections.

For more information about this deployment scenario, refer to the Remote Desktop Services Blog article titled [Lift-and-shift your workloads with Azure RemoteApp and Azure AD Domain Services](http://blogs.msdn.com/b/rds/archive/2016/01/19/lift-and-shift-your-workloads-with-azure-remoteapp-and-azure-ad-domain-services.aspx).
