This document describes the steps you need to perform to automatically provision and deprovision users from Azure Active Directory (Azure AD) into an LDAP directory. The document focuses on AD LDS, but you can provision into any of the supported LDAP directories mentioned below. Please note that provisioning users into Active Directory Domain Services through this solution is not supported. 
 
For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../articles/active-directory/app-provisioning/user-provisioning.md).

## Prerequisites for provisioning users into an LDAP directory

>[!IMPORTANT]
> The on-premises provisioning preview is currently in an invitation-only preview. To request access to the capability, use the [access request form](https://aka.ms/onpremprovisioningpublicpreviewaccess). We'll open the preview to more customers and connectors over the next few months as we prepare for general availability. Please note that provisioning users into Active Directory Domain Services is not supported through this preview. 


### On-premises prerequisites

 - A target system, such as a Active Directory Lightweight Services (AD LDS), in which users can be created, updated, and deleted. This AD LDS instance should not be used to provision users into Azure AD as you may create a loop with Azure AD Connect. 
 - A Windows Server 2016 or later computer with an internet-accessible TCP/IP address, connectivity to the target system, and with outbound connectivity to login.microsoftonline.com. An example is a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy. The server should have at least 3 GB of RAM.
 - A computer with .NET Framework 4.7.1.

Depending on the options you select, some of the wizard screens might not be available and the information might be slightly different. For purposes of this configuration, the user object type is used. Use the following information to guide you in your configuration. 

#### Supported systems
* OpenLDAP
* Microsoft Active Directory Lightweight Directory Services
* 389 Directory Server
* pache Directory Server
* IBM Tivoli DS
* Isode Directory
* NetIQ eDirectory
* Novell eDirectory
* Open DJ
* Open DS
* Open LDAP (openldap.org)
* Oracle (previously Sun) Directory Server Enterprise Edition
* RadiantOne Virtual Directory Server (VDS)
* Sun One Directory Server

### Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
 
    [!INCLUDE [active-directory-p1-license.md](active-directory-p1-license.md)]
 - The Hybrid Administrator role for configuring the provisioning agent and the Application Administrator or Cloud Administrator roles for configuring provisioning in the Azure portal.

## Prepare the LDAP directory
The following information is provided to help create a test AD LDS environment.  This setup uses PowerShell and the ADAMInstall.exe with an answers file.  This document does not cover in-depth information on AD LDS.  For more information see [Active Directory Lightweight Directory Services](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/hh831593(v=ws.11)). 

If you already have AD LDS setup in a test environment you can skip the following sections and move to installing the ECMA Host connector section.

### Create an SSL certificate, a test directory and install AD LDS.
The use the PowerShell script from [Appendix A](#appendix-a---install-ad-lds-powershell-script).  The script does the following:
  - Creates a self-signed certificate that will be used by the LDAP connector
  - Creates a directory for the feature install log
  - Installs the AD LDS role on our virtual machine 

On the Windows Server virtual machine you are using to test the LDAP connector run the script using Windows PowerShell with administrative priviledges.  

### Create the AddPerson.LDF file
AD LDS installs with a minimum set of schema files.  In order to support app provisioning with the ECMA Host connector and AD LDS, we need to create a specialized LDF file and import it in to the schema.  

Copy the contents of [Appendix B](#appendix-b---addpersonldf-file) in to a text file and save it as **AddPerson.LDF** in **"C:\Windows\ADAM"**.


### Create an instance of AD LDS
Now that the role has been installed, you need to create an instance of AD LDS.  To do this, you can use the answer file provided below.  This will install the instance quietly without using the UI.

Copy the contents of [Appendix C](#appendix-c---answer-file) in to notepad and save it as **answer.txt** in **"C:\Windows\ADAM"**.

Now open a cmd prompt with administrative priviledges and run the following:

```
C:\Windows\ADAM> ADAMInstall.exe /answer:answer.txt
```




## Appendix A - Install AD LDS Powershell script
Powershell script to automate the installation of Active Directory Lightweight Directory Services.



```powershell
 # Filename:    1_SetupADLDS.ps1
 # Description: Creates a certificate that will be used for SSL and installs Active Directory Lighetweight Directory Services.
 #
 # DISCLAIMER:
 # Copyright (c) Microsoft Corporation. All rights reserved. This 
 # script is made available to you without any express, implied or 
 # statutory warranty, not even the implied warranty of 
 # merchantability or fitness for a particular purpose, or the 
 # warranty of title or non-infringement. The entire risk of the 
 # use or the results from the use of this script remains with you.
 #
 #
 #
 #
 #Declare variables
 $DNSName = 'www.contoso.com'
 $CertLocation = 'cert:\LocalMachine\My'
 $logpath = "c:\" 
 $dirname = "test"
 $dirtype = "directory"
 $featureLogPath = "c:\test\featurelog.txt" 

 #Create a new self-signed certificate
 New-SelfSignedCertificate -DnsName $DNSName -CertStoreLocation $CertLocation

 #Create directory
 New-Item -Path $logpath -Name $dirname -ItemType $dirtype

 #Install AD LDS
 start-job -Name addFeature -ScriptBlock { 
 Add-WindowsFeature -Name "ADLDS" -IncludeAllSubFeature -IncludeManagementTools 
 } 
 Wait-Job -Name addFeature 
 Get-WindowsFeature | Where installed >>$featureLogPath

 ```



## Appendix B - AddPerson.ldf file

Use the following to create the AddPerson.ldf file  Copy the contents below and save the file as AddPerson.ldf to "C:\Windows\ADAM".

```
# ==================================================================
# 
#  This file should be imported with the following command:
#    ldifde -i -u -f AddPerson.ldf -s server:port -b username domain password -j . -c "cn=Configuration,dc=X" #configurationNamingContext
#  LDIFDE.EXE from AD/AM V1.0 or above must be used.
#  This LDIF file should be imported into AD or AD/AM. It may not work for other directories.
# 
# ==================================================================

# ==================================================================
#  Attributes
# ==================================================================

# Attribute: attributeCertificateAttribute
dn: cn=attributeCertificateAttribute,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 2.5.4.58
ldapDisplayName: attributeCertificateAttribute
attributeSyntax: 2.5.5.10
adminDescription:
 A digitally signed or certified identity and set of attributes. Used to bind a
 uthorization information to an identity. X.509
adminDisplayName: attributeCertificateAttribute
# schemaIDGUID: fa4693bb-7bc2-4cb9-81a8-c99c43b7905e
schemaIDGUID:: u5NG+sJ7uUyBqMmcQ7eQXg==
oMSyntax: 4
systemOnly: FALSE

# Attribute: auditingPolicy
dn: cn=Auditing-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.202
ldapDisplayName: auditingPolicy
attributeSyntax: 2.5.5.10
adminDescription: Auditing-Policy
adminDisplayName: Auditing-Policy
# schemaIDGUID: 6da8a4fe-0e52-11d0-a286-00aa003049e2
schemaIDGUID:: /qSobVIO0BGihgCqADBJ4g==
oMSyntax: 4
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: builtinCreationTime
dn: cn=Builtin-Creation-Time,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.13
ldapDisplayName: builtinCreationTime
attributeSyntax: 2.5.5.16
adminDescription: Builtin-Creation-Time
adminDisplayName: Builtin-Creation-Time
# schemaIDGUID: bf96792f-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: L3mWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: builtinModifiedCount
dn: cn=Builtin-Modified-Count,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.14
ldapDisplayName: builtinModifiedCount
attributeSyntax: 2.5.5.16
adminDescription: Builtin-Modified-Count
adminDisplayName: Builtin-Modified-Count
# schemaIDGUID: bf967930-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: MHmWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: cACertificate
dn: cn=CA-Certificate,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 2.5.4.37
ldapDisplayName: cACertificate
attributeSyntax: 2.5.5.10
adminDescription: CA-Certificate
adminDisplayName: CA-Certificate
# schemaIDGUID: bf967932-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: MnmWv+YN0BGihQCqADBJ4g==
oMSyntax: 4
isMemberOfPartialAttributeSet: TRUE
systemOnly: FALSE
rangeLower: 1
rangeUpper: 32768

# Attribute: controlAccessRights
dn: cn=Control-Access-Rights,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.200
ldapDisplayName: controlAccessRights
attributeSyntax: 2.5.5.10
adminDescription: Control-Access-Rights
adminDisplayName: Control-Access-Rights
# schemaIDGUID: 6da8a4fc-0e52-11d0-a286-00aa003049e2
schemaIDGUID:: /KSobVIO0BGihgCqADBJ4g==
oMSyntax: 4
systemOnly: FALSE
rangeLower: 16
rangeUpper: 16

# Attribute: creationTime
dn: cn=Creation-Time,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.26
ldapDisplayName: creationTime
attributeSyntax: 2.5.5.16
adminDescription: Creation-Time
adminDisplayName: Creation-Time
# schemaIDGUID: bf967946-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: RnmWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: defaultLocalPolicyObject
dn: cn=Default-Local-Policy-Object,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.57
ldapDisplayName: defaultLocalPolicyObject
attributeSyntax: 2.5.5.1
adminDescription: Default-Local-Policy-Object
adminDisplayName: Default-Local-Policy-Object
# schemaIDGUID: bf96799f-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: n3mWv+YN0BGihQCqADBJ4g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: domainPolicyObject
dn: cn=Domain-Policy-Object,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.32
ldapDisplayName: domainPolicyObject
attributeSyntax: 2.5.5.1
adminDescription: Domain-Policy-Object
adminDisplayName: Domain-Policy-Object
# schemaIDGUID: bf96795d-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: XXmWv+YN0BGihQCqADBJ4g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: domainReplica
dn: cn=Domain-Replica,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.158
ldapDisplayName: domainReplica
attributeSyntax: 2.5.5.12
adminDescription: Domain-Replica
adminDisplayName: Domain-Replica
# schemaIDGUID: bf96795e-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: XnmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 32767

# Attribute: eFSPolicy
dn: cn=EFSPolicy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.268
ldapDisplayName: eFSPolicy
attributeSyntax: 2.5.5.10
adminDescription: EFSPolicy
adminDisplayName: EFSPolicy
# schemaIDGUID: 8e4eb2ec-4712-11d0-a1a0-00c04fd930c9
schemaIDGUID:: 7LJOjhJH0BGhoADAT9kwyQ==
oMSyntax: 4
systemOnly: FALSE

# Attribute: employeeID
dn: cn=Employee-ID,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.35
ldapDisplayName: employeeID
attributeSyntax: 2.5.5.12
adminDescription: Employee-ID
adminDisplayName: Employee-ID
# schemaIDGUID: bf967962-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: YnmWv+YN0BGihQCqADBJ4g==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 16

# Attribute: forceLogoff
dn: cn=Force-Logoff,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.39
ldapDisplayName: forceLogoff
attributeSyntax: 2.5.5.16
adminDescription: Force-Logoff
adminDisplayName: Force-Logoff
# schemaIDGUID: bf967977-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: d3mWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: frsComputerReference
dn: cn=Frs-Computer-Reference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.869
ldapDisplayName: frsComputerReference
attributeSyntax: 2.5.5.1
adminDescription: Frs-Computer-Reference
adminDisplayName: Frs-Computer-Reference
# schemaIDGUID: 2a132578-9373-11d1-aebc-0000f80367c1
schemaIDGUID:: eCUTKnOT0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 102
isMemberOfPartialAttributeSet: TRUE
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: fRSMemberReference
dn: cn=FRS-Member-Reference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.875
ldapDisplayName: fRSMemberReference
attributeSyntax: 2.5.5.1
adminDescription: FRS-Member-Reference
adminDisplayName: FRS-Member-Reference
# schemaIDGUID: 2a13257e-9373-11d1-aebc-0000f80367c1
schemaIDGUID:: fiUTKnOT0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 104
isMemberOfPartialAttributeSet: TRUE
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: gPLink
dn: cn=GP-Link,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.891
ldapDisplayName: gPLink
attributeSyntax: 2.5.5.12
adminDescription: GP-Link
adminDisplayName: GP-Link
# schemaIDGUID: f30e3bbe-9ff0-11d1-b603-0000f80367c1
schemaIDGUID:: vjsO8/Cf0RG2AwAA+ANnwQ==
oMSyntax: 64
isMemberOfPartialAttributeSet: TRUE
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: gPOptions
dn: cn=GP-Options,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.892
ldapDisplayName: gPOptions
attributeSyntax: 2.5.5.9
adminDescription: GP-Options
adminDisplayName: GP-Options
# schemaIDGUID: f30e3bbf-9ff0-11d1-b603-0000f80367c1
schemaIDGUID:: vzsO8/Cf0RG2AwAA+ANnwQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: lockoutDuration
dn: cn=Lockout-Duration,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.60
ldapDisplayName: lockoutDuration
attributeSyntax: 2.5.5.16
adminDescription: Lockout-Duration
adminDisplayName: Lockout-Duration
# schemaIDGUID: bf9679a5-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: pXmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: lockOutObservationWindow
dn: cn=Lock-Out-Observation-Window,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.61
ldapDisplayName: lockOutObservationWindow
attributeSyntax: 2.5.5.16
adminDescription: Lock-Out-Observation-Window
adminDisplayName: Lock-Out-Observation-Window
# schemaIDGUID: bf9679a4-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: pHmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: lockoutThreshold
dn: cn=Lockout-Threshold,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.73
ldapDisplayName: lockoutThreshold
attributeSyntax: 2.5.5.9
adminDescription: Lockout-Threshold
adminDisplayName: Lockout-Threshold
# schemaIDGUID: bf9679a6-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: pnmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeUpper: 65535

# Attribute: lSACreationTime
dn: cn=LSA-Creation-Time,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.66
ldapDisplayName: lSACreationTime
attributeSyntax: 2.5.5.16
adminDescription: LSA-Creation-Time
adminDisplayName: LSA-Creation-Time
# schemaIDGUID: bf9679ad-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: rXmWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: lSAModifiedCount
dn: cn=LSA-Modified-Count,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.67
ldapDisplayName: lSAModifiedCount
attributeSyntax: 2.5.5.16
adminDescription: LSA-Modified-Count
adminDisplayName: LSA-Modified-Count
# schemaIDGUID: bf9679ae-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: rnmWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: manager
dn: cn=Manager,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 0.9.2342.19200300.100.1.10
ldapDisplayName: manager
attributeSyntax: 2.5.5.1
adminDescription: Manager
adminDisplayName: Manager
# schemaIDGUID: bf9679b5-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: tXmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Public Information
attributeSecurityGUID:: VAGN5Pi80RGHAgDAT7lgUA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
searchFlags: 16
linkId: 42
isMemberOfPartialAttributeSet: TRUE
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: maxPwdAge
dn: cn=Max-Pwd-Age,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.74
ldapDisplayName: maxPwdAge
attributeSyntax: 2.5.5.16
adminDescription: Max-Pwd-Age
adminDisplayName: Max-Pwd-Age
# schemaIDGUID: bf9679bb-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: u3mWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: minPwdAge
dn: cn=Min-Pwd-Age,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.78
ldapDisplayName: minPwdAge
attributeSyntax: 2.5.5.16
adminDescription: Min-Pwd-Age
adminDisplayName: Min-Pwd-Age
# schemaIDGUID: bf9679c2-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: wnmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: minPwdLength
dn: cn=Min-Pwd-Length,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.79
ldapDisplayName: minPwdLength
attributeSyntax: 2.5.5.9
adminDescription: Min-Pwd-Length
adminDisplayName: Min-Pwd-Length
# schemaIDGUID: bf9679c3-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: w3mWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: modifiedCount
dn: cn=Modified-Count,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.168
ldapDisplayName: modifiedCount
attributeSyntax: 2.5.5.16
adminDescription: Modified-Count
adminDisplayName: Modified-Count
# schemaIDGUID: bf9679c5-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: xXmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: modifiedCountAtLastProm
dn: cn=Modified-Count-At-Last-Prom,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.81
ldapDisplayName: modifiedCountAtLastProm
attributeSyntax: 2.5.5.16
adminDescription: Modified-Count-At-Last-Prom
adminDisplayName: Modified-Count-At-Last-Prom
# schemaIDGUID: bf9679c6-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: xnmWv+YN0BGihQCqADBJ4g==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msAuthz-MemberRulesInCentralAccessPolicy
dn:
 cn=ms-Authz-Member-Rules-In-Central-Access-Policy,cn=Schema,cn=Configuration,d
 c=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2155
ldapDisplayName: msAuthz-MemberRulesInCentralAccessPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 For a central access policy, this attribute identifies the central access rule
 s that comprise the policy.
adminDisplayName: ms-Authz-Member-Rules-In-Central-Access-Policy
# schemaIDGUID: 57f22f7a-377e-42c3-9872-cec6f21d2e3e
schemaIDGUID:: ei/yV343w0KYcs7G8h0uPg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2184
systemOnly: FALSE

# Attribute: msCOM-PartitionLink
dn: cn=ms-COM-PartitionLink,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1423
ldapDisplayName: msCOM-PartitionLink
attributeSyntax: 2.5.5.1
adminDescription:
 Link from a PartitionSet to a Partition. Default = adminDisplayName
adminDisplayName: ms-COM-PartitionLink
# schemaIDGUID: 09abac62-043f-4702-ac2b-6ca15eee5754
schemaIDGUID:: YqyrCT8EAkesK2yhXu5XVA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 1040
systemOnly: FALSE

# Attribute: msCOM-UserPartitionSetLink
dn: cn=ms-COM-UserPartitionSetLink,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1426
ldapDisplayName: msCOM-UserPartitionSetLink
attributeSyntax: 2.5.5.1
adminDescription:
 Link from a User to a PartitionSet. Default = adminDisplayName
adminDisplayName: ms-COM-UserPartitionSetLink
# schemaIDGUID: 8e940c8a-e477-4367-b08d-ff2ff942dcd7
schemaIDGUID:: igyUjnfkZ0Owjf8v+ULc1w==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 1048
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDFSR-ComputerReference
dn: cn=ms-DFSR-ComputerReference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.13.3.101
ldapDisplayName: msDFSR-ComputerReference
attributeSyntax: 2.5.5.1
adminDescription: Forward link to Computer object
adminDisplayName: ms-DFSR-ComputerReference
# schemaIDGUID: 6c7b5785-3d21-41bf-8a8a-627941544d5a
schemaIDGUID:: hVd7bCE9v0GKimJ5QVRNWg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2050
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDFSR-MemberReference
dn: cn=ms-DFSR-MemberReference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.13.3.100
ldapDisplayName: msDFSR-MemberReference
attributeSyntax: 2.5.5.1
adminDescription: Forward link to DFSR-Member object
adminDisplayName: ms-DFSR-MemberReference
# schemaIDGUID: 261337aa-f1c3-44b2-bbea-c88d49e6f0c7
schemaIDGUID:: qjcTJsPxskS76siNSebwxw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2052
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-AllUsersTrustQuota
dn: cn=MS-DS-All-Users-Trust-Quota,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1789
ldapDisplayName: msDS-AllUsersTrustQuota
attributeSyntax: 2.5.5.9
adminDescription:
 Used to enforce a combined users quota on the total number of Trusted-Domain o
 bjects created by using the control access right, "Create inbound Forest trust
 ".
adminDisplayName: MS-DS-All-Users-Trust-Quota
# schemaIDGUID: d3aa4a5c-4e03-4810-97aa-2b339e7a434b
schemaIDGUID:: XEqq0wNOEEiXqisznnpDSw==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-AssignedAuthNPolicy
dn: cn=ms-DS-Assigned-AuthN-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2295
ldapDisplayName: msDS-AssignedAuthNPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which AuthNPolicy should be applied to this principal
 .
adminDisplayName: Assigned Authentication Policy
# schemaIDGUID: b87a0ad8-54f7-49c1-84a0-e64d12853588
schemaIDGUID:: 2Ap6uPdUwUmEoOZNEoU1iA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2212
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-AssignedAuthNPolicySilo
dn: cn=ms-DS-Assigned-AuthN-Policy-Silo,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2285
ldapDisplayName: msDS-AssignedAuthNPolicySilo
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which AuthNPolicySilo a principal is assigned to.
adminDisplayName: Assigned Authentication Policy Silo
# schemaIDGUID: b23fc141-0df5-4aea-b33d-6cf493077b3f
schemaIDGUID:: QcE/svUN6kqzPWz0kwd7Pw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2202
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-AuthenticatedAtDC
dn: cn=ms-DS-AuthenticatedAt-DC,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1958
ldapDisplayName: msDS-AuthenticatedAtDC
attributeSyntax: 2.5.5.1
adminDescription:
 Forwardlink for ms-DS-AuthenticatedTo-Accountlist; for a User, identifies whic
 h DC a user has authenticated to
adminDisplayName: ms-DS-AuthenticatedAt-DC
# schemaIDGUID: 3e1ee99c-6604-4489-89d9-84798a89515a
schemaIDGUID:: nOkePgRmiUSJ2YR5iolRWg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2112
systemOnly: FALSE

# Attribute: msDS-AuthNPolicySiloMembers
dn: cn=ms-DS-AuthN-Policy-Silo-Members,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2287
ldapDisplayName: msDS-AuthNPolicySiloMembers
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which principals are assigned to the AuthNPolicySilo.
adminDisplayName: Authentication Policy Silo Members
# schemaIDGUID: 164d1e05-48a6-4886-a8e9-77a2006e3c77
schemaIDGUID:: BR5NFqZIhkio6XeiAG48dw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2204
systemOnly: FALSE

# Attribute: msDS-AzApplicationData
dn: cn=ms-DS-Az-Application-Data,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1819
ldapDisplayName: msDS-AzApplicationData
attributeSyntax: 2.5.5.12
adminDescription:
 A string that is used by individual applications to store whatever information
  they may need to
adminDisplayName: MS-DS-Az-Application-Data
# schemaIDGUID: 503fc3e8-1cc6-461a-99a3-9eee04f402a7
schemaIDGUID:: 6MM/UMYcGkaZo57uBPQCpw==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-AzApplicationName
dn: cn=ms-DS-Az-Application-Name,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1798
ldapDisplayName: msDS-AzApplicationName
attributeSyntax: 2.5.5.12
adminDescription: A string that uniquely identifies an application object
adminDisplayName: MS-DS-Az-Application-Name
# schemaIDGUID: db5b0728-6208-4876-83b7-95d3e5695275
schemaIDGUID:: KAdb2whidkiDt5XT5WlSdQ==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 512

# Attribute: msDS-AzApplicationVersion
dn: cn=ms-DS-Az-Application-Version,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1817
ldapDisplayName: msDS-AzApplicationVersion
attributeSyntax: 2.5.5.12
adminDescription:
 A version number to indicate that the AzApplication is updated
adminDisplayName: MS-DS-Az-Application-Version
# schemaIDGUID: 7184a120-3ac4-47ae-848f-fe0ab20784d4
schemaIDGUID:: IKGEccQ6rkeEj/4KsgeE1A==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-AzClassId
dn: cn=ms-DS-Az-Class-ID,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1816
ldapDisplayName: msDS-AzClassId
attributeSyntax: 2.5.5.12
adminDescription:
 A class ID required by the AzRoles UI on the AzApplication object
adminDisplayName: MS-DS-Az-Class-ID
# schemaIDGUID: 013a7277-5c2d-49ef-a7de-b765b36a3f6f
schemaIDGUID:: d3I6AS1c70mn3rdls2o/bw==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 40

# Attribute: msDS-AzDomainTimeout
dn: cn=ms-DS-Az-Domain-Timeout,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1795
ldapDisplayName: msDS-AzDomainTimeout
attributeSyntax: 2.5.5.9
adminDescription:
 Time (in ms) after a domain is detected to be un-reachable, and before the DC 
 is tried again
adminDisplayName: MS-DS-Az-Domain-Timeout
# schemaIDGUID: 6448f56a-ca70-4e2e-b0af-d20e4ce653d0
schemaIDGUID:: avVIZHDKLk6wr9IOTOZT0A==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-AzGenerateAudits
dn: cn=ms-DS-Az-Generate-Audits,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1805
ldapDisplayName: msDS-AzGenerateAudits
attributeSyntax: 2.5.5.8
adminDescription:
 A boolean field indicating if runtime audits need to be turned on (include aud
 its for access checks, etc.)
adminDisplayName: MS-DS-Az-Generate-Audits
# schemaIDGUID: f90abab0-186c-4418-bb85-88447c87222a
schemaIDGUID:: sLoK+WwYGES7hYhEfIciKg==
oMSyntax: 1
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-AzGenericData
dn: cn=ms-DS-Az-Generic-Data,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1950
ldapDisplayName: msDS-AzGenericData
attributeSyntax: 2.5.5.12
adminDescription: AzMan specific generic data
adminDisplayName: MS-DS-Az-Generic-Data
# schemaIDGUID: b5f7e349-7a5b-407c-a334-a31c3f538b98
schemaIDGUID:: SeP3tVt6fECjNKMcP1OLmA==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeUpper: 65536

# Attribute: msDS-AzMajorVersion
dn: cn=ms-DS-Az-Major-Version,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1824
ldapDisplayName: msDS-AzMajorVersion
attributeSyntax: 2.5.5.9
adminDescription: Major version number for AzRoles
adminDisplayName: MS-DS-Az-Major-Version
# schemaIDGUID: cfb9adb7-c4b7-4059-9568-1ed9db6b7248
schemaIDGUID:: t625z7fEWUCVaB7Z22tySA==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 1

# Attribute: msDS-AzMinorVersion
dn: cn=ms-DS-Az-Minor-Version,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1825
ldapDisplayName: msDS-AzMinorVersion
attributeSyntax: 2.5.5.9
adminDescription: Minor version number for AzRoles
adminDisplayName: MS-DS-Az-Minor-Version
# schemaIDGUID: ee85ed93-b209-4788-8165-e702f51bfbf3
schemaIDGUID:: k+2F7gmyiEeBZecC9Rv78w==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-AzObjectGuid
dn: cn=ms-DS-Az-Object-Guid,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1949
ldapDisplayName: msDS-AzObjectGuid
attributeSyntax: 2.5.5.10
adminDescription: The unique and portable identifier of AzMan objects
adminDisplayName: MS-DS-Az-Object-Guid
# schemaIDGUID: 8491e548-6c38-4365-a732-af041569b02c
schemaIDGUID:: SOWRhDhsZUOnMq8EFWmwLA==
oMSyntax: 4
searchFlags: 1
isSingleValued: TRUE
systemOnly: TRUE
rangeLower: 16
rangeUpper: 16

# Attribute: msDS-AzScopeName
dn: cn=ms-DS-Az-Scope-Name,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1799
ldapDisplayName: msDS-AzScopeName
attributeSyntax: 2.5.5.12
adminDescription: A string that uniquely identifies a scope object
adminDisplayName: MS-DS-Az-Scope-Name
# schemaIDGUID: 515a6b06-2617-4173-8099-d5605df043c6
schemaIDGUID:: BmtaURcmc0GAmdVgXfBDxg==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 65536

# Attribute: msDS-AzScriptEngineCacheMax
dn: cn=ms-DS-Az-Script-Engine-Cache-Max,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1796
ldapDisplayName: msDS-AzScriptEngineCacheMax
attributeSyntax: 2.5.5.9
adminDescription: Maximum number of scripts that are cached by the application
adminDisplayName: MS-DS-Az-Script-Engine-Cache-Max
# schemaIDGUID: 2629f66a-1f95-4bf3-a296-8e9d7b9e30c8
schemaIDGUID:: avYpJpUf80uilo6de54wyA==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-AzScriptTimeout
dn: cn=ms-DS-Az-Script-Timeout,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1797
ldapDisplayName: msDS-AzScriptTimeout
attributeSyntax: 2.5.5.9
adminDescription:
 Maximum time (in ms) to wait for a script to finish auditing a specific policy
adminDisplayName: MS-DS-Az-Script-Timeout
# schemaIDGUID: 87d0fb41-2c8b-41f6-b972-11fdfd50d6b0
schemaIDGUID:: QfvQh4ss9kG5chH9/VDWsA==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: msDS-ClaimSharesPossibleValuesWith
dn: cn=ms-DS-Claim-Shares-Possible-Values-With,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2101
ldapDisplayName: msDS-ClaimSharesPossibleValuesWith
attributeSyntax: 2.5.5.1
adminDescription:
 For a resource property object, this attribute indicates that the suggested va
 lues of the claims issued are defined on the object that this linked attribute
  points to. Overrides ms-DS-Claim-Possible-Values on itself, if populated.
adminDisplayName: ms-DS-Claim-Shares-Possible-Values-With
# schemaIDGUID: 52c8d13a-ce0b-4f57-892b-18f5a43a2400
schemaIDGUID:: OtHIUgvOV0+JKxj1pDokAA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2178
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-ComputerAuthNPolicy
dn: cn=ms-DS-Computer-AuthN-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2291
ldapDisplayName: msDS-ComputerAuthNPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which AuthNPolicy should be applied to computers assi
 gned to this silo object.
adminDisplayName: Computer Authentication Policy
# schemaIDGUID: afb863c9-bea3-440f-a9f3-6153cc668929
schemaIDGUID:: yWO4r6O+D0Sp82FTzGaJKQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2208
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-EgressClaimsTransformationPolicy
dn:
 cn=ms-DS-Egress-Claims-Transformation-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2192
ldapDisplayName: msDS-EgressClaimsTransformationPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This is a link to a Claims Transformation Policy Object for the egress claims 
 (claims leaving this forest) to the Trusted Domain. This is applicable only fo
 r an incoming or bidirectional Cross-Forest Trust. When this link is not prese
 nt, all claims are allowed to egress as-is.
adminDisplayName: ms-DS-Egress-Claims-Transformation-Policy
# schemaIDGUID: c137427e-9a73-b040-9190-1b095bb43288
schemaIDGUID:: fkI3wXOaQLCRkBsJW7QyiA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2192
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-ExpirePasswordsOnSmartCardOnlyAccounts
dn:
 cn=ms-DS-Expire-Passwords-On-Smart-Card-Only-Accounts,cn=Schema,cn=Configurati
 on,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2344
ldapDisplayName: msDS-ExpirePasswordsOnSmartCardOnlyAccounts
attributeSyntax: 2.5.5.8
adminDescription:
 This attribute controls whether the passwords on smart-card-only accounts expi
 re in accordance with the password policy.
adminDisplayName: ms-DS-Expire-Passwords-On-Smart-Card-Only-Accounts
# schemaIDGUID: 3417ab48-df24-4fb1-80b0-0fcb367e25e3
schemaIDGUID:: SKsXNCTfsU+AsA/LNn4l4w==
oMSyntax: 1
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-hasFullReplicaNCs
dn: cn=ms-DS-Has-Full-Replica-NCs,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1925
ldapDisplayName: msDS-hasFullReplicaNCs
attributeSyntax: 2.5.5.1
adminDescription:
 For a Directory instance (DSA), identifies the partitions held as full replica
 s
adminDisplayName: ms-DS-Has-Full-Replica-NCs
# schemaIDGUID: 1d3c2d18-42d0-4868-99fe-0eca1e6fa9f3
schemaIDGUID:: GC08HdBCaEiZ/g7KHm+p8w==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2104
systemOnly: TRUE

# Attribute: msDS-HostServiceAccount
dn: cn=ms-DS-Host-Service-Account,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2056
ldapDisplayName: msDS-HostServiceAccount
attributeSyntax: 2.5.5.1
adminDescription: Service Accounts configured to run on this computer.
adminDisplayName: ms-DS-Host-Service-Account
# schemaIDGUID: 80641043-15a2-40e1-92a2-8ca866f70776
schemaIDGUID:: QxBkgKIV4UCSooyoZvcHdg==
# attributeSecurityGUID: Personal Information
attributeSecurityGUID:: hri1d0qU0RGuvQAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2166
systemOnly: FALSE

# Attribute: msDS-IngressClaimsTransformationPolicy
dn:
 cn=ms-DS-Ingress-Claims-Transformation-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2191
ldapDisplayName: msDS-IngressClaimsTransformationPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This is a link to a Claims Transformation Policy Object for the ingress claims
  (claims entering this forest) from the Trusted Domain. This is applicable onl
 y for an outgoing or bidirectional Cross-Forest Trust. If this link is absent,
  all the ingress claims are dropped.
adminDisplayName: ms-DS-Ingress-Claims-Transformation-Policy
# schemaIDGUID: 86284c08-0c6e-1540-8b15-75147d23d20d
schemaIDGUID:: CEwohm4MQBWLFXUUfSPSDQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2190
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-KeyCredentialLink
dn: cn=ms-DS-Key-Credential-Link,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2328
ldapDisplayName: msDS-KeyCredentialLink
attributeSyntax: 2.5.5.7
adminDescription: Contains key material and usage.
adminDisplayName: ms-DS-Key-Credential-Link
# schemaIDGUID: 5b47d60f-6090-40b2-9f37-2a4de88f3063
schemaIDGUID:: D9ZHW5BgskCfNypN6I8wYw==
# attributeSecurityGUID: Validated write to computer attributes.
attributeSecurityGUID:: pm0CmzwNXEaL7lGZ1xZcug==
oMObjectClass:: KoZIhvcUAQEBCw==
oMSyntax: 127
linkId: 2220
systemOnly: FALSE

# Attribute: msDS-KeyPrincipal
dn: cn=ms-DS-Key-Principal,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2318
ldapDisplayName: msDS-KeyPrincipal
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies the principal that a key object applies to.
adminDisplayName: msDS-KeyPrincipal
# schemaIDGUID: bd61253b-9401-4139-a693-356fc400f3ea
schemaIDGUID:: OyVhvQGUOUGmkzVvxADz6g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2218
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-KrbTgtLink
dn: cn=ms-DS-KrbTgt-Link,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1923
ldapDisplayName: msDS-KrbTgtLink
attributeSyntax: 2.5.5.1
adminDescription:
 For a computer, Identifies the user object (krbtgt), acting as the domain or s
 econdary domain master secret. Depends on which domain or secondary domain the
  computer resides in.
adminDisplayName: ms-DS-KrbTgt-Link
# schemaIDGUID: 778ff5c9-6f4e-4b74-856a-d68383313910
schemaIDGUID:: yfWPd05vdEuFataDgzE5EA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2100
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-LogonTimeSyncInterval
dn: cn=ms-DS-Logon-Time-Sync-Interval,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1784
ldapDisplayName: msDS-LogonTimeSyncInterval
attributeSyntax: 2.5.5.9
adminDescription: ms-DS-Logon-Time-Sync-Interval
adminDisplayName: ms-DS-Logon-Time-Sync-Interval
# schemaIDGUID: ad7940f8-e43a-4a42-83bc-d688e59ea605
schemaIDGUID:: +EB5rTrkQkqDvNaI5Z6mBQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0

# Attribute: ms-DS-MachineAccountQuota
dn: cn=MS-DS-Machine-Account-Quota,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1411
ldapDisplayName: ms-DS-MachineAccountQuota
attributeSyntax: 2.5.5.9
adminDescription: MS-DS-Machine-Account-Quota
adminDisplayName: MS-DS-Machine-Account-Quota
# schemaIDGUID: d064fb68-1480-11d3-91c1-0000f87a57d4
schemaIDGUID:: aPtk0IAU0xGRwQAA+HpX1A==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-MembersOfResourcePropertyList
dn: cn=ms-DS-Members-Of-Resource-Property-List,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2103
ldapDisplayName: msDS-MembersOfResourcePropertyList
attributeSyntax: 2.5.5.1
adminDescription:
 For a resource property list object, this multi-valued link attribute points t
 o one or more resource property objects.
adminDisplayName: ms-DS-Members-Of-Resource-Property-List
# schemaIDGUID: 4d371c11-4cad-4c41-8ad2-b180ab2bd13c
schemaIDGUID:: ERw3Ta1MQUyK0rGAqyvRPA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2180
systemOnly: FALSE

# Attribute: msDS-NC-RO-Replica-Locations
dn: cn=ms-DS-NC-RO-Replica-Locations,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1967
ldapDisplayName: msDS-NC-RO-Replica-Locations
attributeSyntax: 2.5.5.1
adminDescription:
 a linked attribute on a cross ref object for a partition. This attribute lists
  the DSA instances which should host the partition in a readonly manner.
adminDisplayName: ms-DS-NC-RO-Replica-Locations
# schemaIDGUID: 3df793df-9858-4417-a701-735a1ecebf74
schemaIDGUID:: 35P3PViYF0SnAXNaHs6/dA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2114
systemOnly: FALSE

# Attribute: msDS-ObjectReference
dn: cn=ms-DS-Object-Reference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1840
ldapDisplayName: msDS-ObjectReference
attributeSyntax: 2.5.5.1
adminDescription:
 A link to the object that uses the data stored in the object that contains thi
 s attribute.
adminDisplayName: ms-DS-Object-Reference
# schemaIDGUID: 638ec2e8-22e7-409c-85d2-11b21bee72de
schemaIDGUID:: 6MKOY+cinECF0hGyG+5y3g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2038
systemOnly: FALSE

# Attribute: msDS-OIDToGroupLink
dn: cn=ms-DS-OIDToGroup-Link,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2051
ldapDisplayName: msDS-OIDToGroupLink
attributeSyntax: 2.5.5.1
adminDescription:
 For an OID, identifies the group object corresponding to the issuance policy r
 epresented by this OID.
adminDisplayName: ms-DS-OIDToGroup-Link
# schemaIDGUID: f9c9a57c-3941-438d-bebf-0edaf2aca187
schemaIDGUID:: fKXJ+UE5jUO+vw7a8qyhhw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2164
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-OperationsForAzRole
dn: cn=ms-DS-Operations-For-Az-Role,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1812
ldapDisplayName: msDS-OperationsForAzRole
attributeSyntax: 2.5.5.1
adminDescription: List of operations linked to Az-Role
adminDisplayName: MS-DS-Operations-For-Az-Role
# schemaIDGUID: 93f701be-fa4c-43b6-bc2f-4dbea718ffab
schemaIDGUID:: vgH3k0z6tkO8L02+pxj/qw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2022
systemOnly: FALSE

# Attribute: msDS-OperationsForAzTask
dn: cn=ms-DS-Operations-For-Az-Task,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1808
ldapDisplayName: msDS-OperationsForAzTask
attributeSyntax: 2.5.5.1
adminDescription: List of operations linked to Az-Task
adminDisplayName: MS-DS-Operations-For-Az-Task
# schemaIDGUID: 1aacb436-2e9d-44a9-9298-ce4debeb6ebf
schemaIDGUID:: NrSsGp0uqUSSmM5N6+tuvw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2018
systemOnly: FALSE

# Attribute: msDS-PerUserTrustQuota
dn: cn=MS-DS-Per-User-Trust-Quota,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1788
ldapDisplayName: msDS-PerUserTrustQuota
attributeSyntax: 2.5.5.9
adminDescription:
 Used to enforce a per-user quota for creating Trusted-Domain objects authorize
 d by the control access right, "Create inbound Forest trust". This attribute l
 imits the number of Trusted-Domain objects that can be created by a single non
 -admin user in the domain.
adminDisplayName: MS-DS-Per-User-Trust-Quota
# schemaIDGUID: d161adf0-ca24-4993-a3aa-8b2c981302e8
schemaIDGUID:: 8K1h0STKk0mjqossmBMC6A==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-PerUserTrustTombstonesQuota
dn: cn=MS-DS-Per-User-Trust-Tombstones-Quota,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1790
ldapDisplayName: msDS-PerUserTrustTombstonesQuota
attributeSyntax: 2.5.5.9
adminDescription:
 Used to enforce a per-user quota for deleting Trusted-Domain objects when auth
 orization is based on matching the user's SID to the value of MS-DS-Creator-SI
 D on the Trusted-Domain object.
adminDisplayName: MS-DS-Per-User-Trust-Tombstones-Quota
# schemaIDGUID: 8b70a6c6-50f9-4fa3-a71e-1ce03040449b
schemaIDGUID:: xqZwi/lQo0+nHhzgMEBEmw==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-PrimaryComputer
dn: cn=ms-DS-Primary-Computer,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2167
ldapDisplayName: msDS-PrimaryComputer
attributeSyntax: 2.5.5.1
adminDescription: For a user or group object, identifies the primary computers.
adminDisplayName: ms-DS-Primary-Computer
# schemaIDGUID: a13df4e2-dbb0-4ceb-828b-8b2e143e9e81
schemaIDGUID:: 4vQ9obDb60yCi4suFD6egQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
searchFlags: 1
linkId: 2186
isMemberOfPartialAttributeSet: TRUE
systemOnly: FALSE

# Attribute: msDS-PSOAppliesTo
dn: cn=ms-DS-PSO-Applies-To,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2020
ldapDisplayName: msDS-PSOAppliesTo
attributeSyntax: 2.5.5.1
adminDescription:
 Links to objects that this password settings object applies to
adminDisplayName: Password settings object applies to
# schemaIDGUID: 64c80f48-cdd2-4881-a86d-4e97b6f561fc
schemaIDGUID:: SA/IZNLNgUiobU6XtvVh/A==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2118
systemOnly: FALSE

# Attribute: msDS-RevealedUsers
dn: cn=ms-DS-Revealed-Users,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1924
ldapDisplayName: msDS-RevealedUsers
attributeSyntax: 2.5.5.7
adminDescription:
 For a Directory instance (DSA), Identifies the user objects whose secrets have
  been disclosed to that instance
adminDisplayName: ms-DS-Revealed-Users
# schemaIDGUID: 185c7821-3749-443a-bd6a-288899071adb
schemaIDGUID:: IXhcGEk3OkS9aiiImQca2w==
oMObjectClass:: KoZIhvcUAQEBCw==
oMSyntax: 127
linkId: 2102
systemOnly: TRUE

# Attribute: msDS-ServiceAuthNPolicy
dn: cn=ms-DS-Service-AuthN-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2293
ldapDisplayName: msDS-ServiceAuthNPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which AuthNPolicy should be applied to services assig
 ned to this silo object.
adminDisplayName: Service Authentication Policy
# schemaIDGUID: 2a6a6d95-28ce-49ee-bb24-6d1fc01e3111
schemaIDGUID:: lW1qKs4o7km7JG0fwB4xEQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2210
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-TasksForAzRole
dn: cn=ms-DS-Tasks-For-Az-Role,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1814
ldapDisplayName: msDS-TasksForAzRole
attributeSyntax: 2.5.5.1
adminDescription: List of tasks for Az-Role
adminDisplayName: MS-DS-Tasks-For-Az-Role
# schemaIDGUID: 35319082-8c4a-4646-9386-c2949d49894d
schemaIDGUID:: gpAxNUqMRkaThsKUnUmJTQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2024
systemOnly: FALSE

# Attribute: msDS-TasksForAzTask
dn: cn=ms-DS-Tasks-For-Az-Task,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1810
ldapDisplayName: msDS-TasksForAzTask
attributeSyntax: 2.5.5.1
adminDescription: List of tasks linked to Az-Task
adminDisplayName: MS-DS-Tasks-For-Az-Task
# schemaIDGUID: b11c8ee2-5fcd-46a7-95f0-f38333f096cf
schemaIDGUID:: 4o4csc1fp0aV8PODM/CWzw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2020
systemOnly: FALSE

# Attribute: msDS-UserAuthNPolicy
dn: cn=ms-DS-User-AuthN-Policy,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2289
ldapDisplayName: msDS-UserAuthNPolicy
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute specifies which AuthNPolicy should be applied to users assigned
  to this silo object.
adminDisplayName: User Authentication Policy
# schemaIDGUID: cd26b9f3-d415-442a-8f78-7c61523ee95b
schemaIDGUID:: 87kmzRXUKkSPeHxhUj7pWw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2206
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msDS-ValueTypeReference
dn: cn=ms-DS-Value-Type-Reference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2187
ldapDisplayName: msDS-ValueTypeReference
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute is used to link a resource property object to its value type.
adminDisplayName: ms-DS-Value-Type-Reference
# schemaIDGUID: 78fc5d84-c1dc-3148-8984-58f792d41d3e
schemaIDGUID:: hF38eNzBSDGJhFj3ktQdPg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2188
isSingleValued: TRUE
systemOnly: TRUE

# Attribute: msSFU30PosixMember
dn: cn=msSFU-30-Posix-Member,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.18.1.346
ldapDisplayName: msSFU30PosixMember
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute is used to store the DN display name of users which are a part 
 of the group
adminDisplayName: msSFU-30-Posix-Member
# schemaIDGUID: c875d82d-2848-4cec-bb50-3c5486d09d57
schemaIDGUID:: Ldh1yEgo7Ey7UDxUhtCdVw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2030
systemOnly: FALSE

# Attribute: msTPM-TpmInformationForComputer
dn: cn=ms-TPM-Tpm-Information-For-Computer,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2109
ldapDisplayName: msTPM-TpmInformationForComputer
attributeSyntax: 2.5.5.1
adminDescription: This attribute links a Computer object to a TPM object.
adminDisplayName: TPM-TpmInformationForComputer
# schemaIDGUID: ea1b7b93-5e48-46d5-bc6c-4df4fda78a35
schemaIDGUID:: k3sb6khe1Ua8bE30/aeKNQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
searchFlags: 16
linkId: 2182
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msTSPrimaryDesktop
dn: cn=ms-TS-Primary-Desktop,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2073
ldapDisplayName: msTSPrimaryDesktop
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute represents the forward link to user's primary desktop.
adminDisplayName: ms-TS-Primary-Desktop
# schemaIDGUID: 29259694-09e4-4237-9f72-9306ebe63ab2
schemaIDGUID:: lJYlKeQJN0KfcpMG6+Y6sg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2170
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: msTSSecondaryDesktops
dn: cn=ms-TS-Secondary-Desktops,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2075
ldapDisplayName: msTSSecondaryDesktops
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute represents the array of forward links to user's secondary deskt
 ops.
adminDisplayName: ms-TS-Secondary-Desktops
# schemaIDGUID: f63aa29a-bb31-48e1-bfab-0a6c5a1d39c2
schemaIDGUID:: mqI69jG74Ui/qwpsWh05wg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 2172
systemOnly: FALSE

# Attribute: netbootServer
dn: cn=netboot-Server,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.860
ldapDisplayName: netbootServer
attributeSyntax: 2.5.5.1
adminDescription: netboot-Server
adminDisplayName: netboot-Server
# schemaIDGUID: 07383081-91df-11d1-aebc-0000f80367c1
schemaIDGUID:: gTA4B9+R0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 100
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: nextRid
dn: cn=Next-Rid,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.88
ldapDisplayName: nextRid
attributeSyntax: 2.5.5.9
adminDescription: Next-Rid
adminDisplayName: Next-Rid
# schemaIDGUID: bf9679db-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: 23mWv+YN0BGihQCqADBJ4g==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: nonSecurityMember
dn: cn=Non-Security-Member,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.530
ldapDisplayName: nonSecurityMember
attributeSyntax: 2.5.5.1
adminDescription: Non-Security-Member
adminDisplayName: Non-Security-Member
# schemaIDGUID: 52458018-ca6a-11d0-afff-0000f80367c1
schemaIDGUID:: GIBFUmrK0BGv/wAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 50
systemOnly: FALSE

# Attribute: nTMixedDomain
dn: cn=NT-Mixed-Domain,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.357
ldapDisplayName: nTMixedDomain
attributeSyntax: 2.5.5.9
adminDescription: NT-Mixed-Domain
adminDisplayName: NT-Mixed-Domain
# schemaIDGUID: 3e97891f-8c01-11d0-afda-00c04fd930c9
schemaIDGUID:: H4mXPgGM0BGv2gDAT9kwyQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: oEMInformation
dn: cn=OEM-Information,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.151
ldapDisplayName: oEMInformation
attributeSyntax: 2.5.5.12
adminDescription: OEM-Information
adminDisplayName: OEM-Information
# schemaIDGUID: bf9679ea-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: 6nmWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 32767

# Attribute: owner
dn: cn=Owner,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 2.5.4.32
ldapDisplayName: owner
attributeSyntax: 2.5.5.1
adminDescription: Owner
adminDisplayName: Owner
# schemaIDGUID: bf9679f3-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: 83mWv+YN0BGihQCqADBJ4g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 44
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: pekKeyChangeInterval
dn: cn=Pek-Key-Change-Interval,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.866
ldapDisplayName: pekKeyChangeInterval
attributeSyntax: 2.5.5.16
adminDescription: Pek-Key-Change-Interval
adminDisplayName: Pek-Key-Change-Interval
# schemaIDGUID: 07383084-91df-11d1-aebc-0000f80367c1
schemaIDGUID:: hDA4B9+R0RGuvAAA+ANnwQ==
oMSyntax: 65
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: privateKey
dn: cn=Private-Key,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.101
ldapDisplayName: privateKey
attributeSyntax: 2.5.5.10
adminDescription: Private-Key
adminDisplayName: Private-Key
# schemaIDGUID: bf967a03-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: A3qWv+YN0BGihQCqADBJ4g==
oMSyntax: 4
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: privilegeHolder
dn: cn=Privilege-Holder,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.637
ldapDisplayName: privilegeHolder
attributeSyntax: 2.5.5.1
adminDescription: Privilege-Holder
adminDisplayName: Privilege-Holder
# schemaIDGUID: 19405b9b-3cfa-11d1-a9c0-0000f80367c1
schemaIDGUID:: m1tAGfo80RGpwAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
linkId: 70
systemOnly: FALSE

# Attribute: pwdHistoryLength
dn: cn=Pwd-History-Length,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.95
ldapDisplayName: pwdHistoryLength
attributeSyntax: 2.5.5.9
adminDescription: Pwd-History-Length
adminDisplayName: Pwd-History-Length
# schemaIDGUID: bf967a09-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: CXqWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 0
rangeUpper: 65535

# Attribute: pwdProperties
dn: cn=Pwd-Properties,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.93
ldapDisplayName: pwdProperties
attributeSyntax: 2.5.5.9
adminDescription: Pwd-Properties
adminDisplayName: Pwd-Properties
# schemaIDGUID: bf967a0b-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: C3qWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Domain Password & Lockout Policies
attributeSecurityGUID:: YHNAx78g0BGnaACqAG4FKQ==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: replicaSource
dn: cn=Replica-Source,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.109
ldapDisplayName: replicaSource
attributeSyntax: 2.5.5.12
adminDescription: Replica-Source
adminDisplayName: Replica-Source
# schemaIDGUID: bf967a18-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: GHqWv+YN0BGihQCqADBJ4g==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: TRUE

# Attribute: rIDManagerReference
dn: cn=RID-Manager-Reference,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.368
ldapDisplayName: rIDManagerReference
attributeSyntax: 2.5.5.1
adminDescription: RID-Manager-Reference
adminDisplayName: RID-Manager-Reference
# schemaIDGUID: 66171886-8f3c-11d0-afda-00c04fd930c9
schemaIDGUID:: hhgXZjyP0BGv2gDAT9kwyQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
isSingleValued: TRUE
systemOnly: TRUE

# Attribute: serialNumber
dn: cn=Serial-Number,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 2.5.4.5
ldapDisplayName: serialNumber
attributeSyntax: 2.5.5.5
adminDescription: Serial-Number
adminDisplayName: Serial-Number
# schemaIDGUID: bf967a32-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: MnqWv+YN0BGihQCqADBJ4g==
oMSyntax: 19
systemOnly: FALSE
rangeLower: 1
rangeUpper: 64

# Attribute: serverRole
dn: cn=Server-Role,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.157
ldapDisplayName: serverRole
attributeSyntax: 2.5.5.9
adminDescription: Server-Role
adminDisplayName: Server-Role
# schemaIDGUID: bf967a33-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: M3qWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: serverState
dn: cn=Server-State,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.154
ldapDisplayName: serverState
attributeSyntax: 2.5.5.9
adminDescription: Server-State
adminDisplayName: Server-State
# schemaIDGUID: bf967a34-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: NHqWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE

# Attribute: sn
dn: cn=Surname,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 2.5.4.4
ldapDisplayName: sn
attributeSyntax: 2.5.5.12
adminDescription: Surname
adminDisplayName: Surname
# schemaIDGUID: bf967a41-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: QXqWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Public Information
attributeSecurityGUID:: VAGN5Pi80RGHAgDAT7lgUA==
oMSyntax: 64
searchFlags: 5
isMemberOfPartialAttributeSet: TRUE
isSingleValued: TRUE
systemOnly: FALSE
rangeLower: 1
rangeUpper: 64

# Attribute: treeName
dn: cn=Tree-Name,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.660
ldapDisplayName: treeName
attributeSyntax: 2.5.5.12
adminDescription: Tree-Name
adminDisplayName: Tree-Name
# schemaIDGUID: 28630ebd-41d5-11d1-a9c1-0000f80367c1
schemaIDGUID:: vQ5jKNVB0RGpwQAA+ANnwQ==
oMSyntax: 64
isSingleValued: TRUE
systemOnly: TRUE

# Attribute: uASCompat
dn: cn=UAS-Compat,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.155
ldapDisplayName: uASCompat
attributeSyntax: 2.5.5.9
adminDescription: UAS-Compat
adminDisplayName: UAS-Compat
# schemaIDGUID: bf967a61-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: YXqWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Other Domain Parameters (for use by SAM)
attributeSecurityGUID:: 0J8RuPYEYkerekmGx2s/mg==
oMSyntax: 2
isSingleValued: TRUE
systemOnly: FALSE


# ==================================================================
#  Property sets
# ==================================================================

# Property set: Domain Password & Lockout Policies
dn: cn=Domain-Password,cn=Extended-Rights,cn=Configuration,dc=X
changetype: add
objectClass: controlAccessRight
displayName: Domain Password & Lockout Policies
rightsGuid: c7407360-20bf-11d0-a768-00aa006e0529
validAccesses: 48
appliesTo: 19195a5a-6da0-11d0-afd3-00c04fd930c9
appliesTo: 19195a5b-6da0-11d0-afd3-00c04fd930c9

# Property set: Other Domain Parameters (for use by SAM)
dn: cn=Domain-Other-Parameters,cn=Extended-Rights,cn=Configuration,dc=X
changetype: add
objectClass: controlAccessRight
displayName: Other Domain Parameters (for use by SAM)
rightsGuid: b8119fd0-04f6-4762-ab7a-4986c76b3f9a
validAccesses: 48
appliesTo: 19195a5b-6da0-11d0-afd3-00c04fd930c9

# Property set: Validated write to computer attributes.
dn: cn=DS-Validated-Write-Computer,cn=Extended-Rights,cn=Configuration,dc=X
changetype: add
objectClass: controlAccessRight
displayName: Validated write to computer attributes.
rightsGuid: 9b026da6-0d3c-465c-8bee-5199d7165cba
validAccesses: 8
appliesTo: bf967a86-0de6-11d0-a285-00aa003049e2


dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-


# ==================================================================
#  Backlink attributes
# ==================================================================

# Attribute: directReports
dn: cn=Reports,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.2.436
ldapDisplayName: directReports
attributeSyntax: 2.5.5.1
adminDescription: Reports
adminDisplayName: Reports
# schemaIDGUID: bf967a1c-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: HHqWv+YN0BGihQCqADBJ4g==
# attributeSecurityGUID: Public Information
attributeSecurityGUID:: VAGN5Pi80RGHAgDAT7lgUA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 43
systemOnly: TRUE

# Attribute: frsComputerReferenceBL
dn: cn=Frs-Computer-Reference-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.870
ldapDisplayName: frsComputerReferenceBL
attributeSyntax: 2.5.5.1
adminDescription: Frs-Computer-Reference-BL
adminDisplayName: Frs-Computer-Reference-BL
# schemaIDGUID: 2a132579-9373-11d1-aebc-0000f80367c1
schemaIDGUID:: eSUTKnOT0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 103
systemOnly: TRUE

# Attribute: fRSMemberReferenceBL
dn: cn=FRS-Member-Reference-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.876
ldapDisplayName: fRSMemberReferenceBL
attributeSyntax: 2.5.5.1
adminDescription: FRS-Member-Reference-BL
adminDisplayName: FRS-Member-Reference-BL
# schemaIDGUID: 2a13257f-9373-11d1-aebc-0000f80367c1
schemaIDGUID:: fyUTKnOT0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 105
systemOnly: TRUE

# Attribute: isPrivilegeHolder
dn: cn=Is-Privilege-Holder,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.638
ldapDisplayName: isPrivilegeHolder
attributeSyntax: 2.5.5.1
adminDescription: Is-Privilege-Holder
adminDisplayName: Is-Privilege-Holder
# schemaIDGUID: 19405b9c-3cfa-11d1-a9c0-0000f80367c1
schemaIDGUID:: nFtAGfo80RGpwAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 71
systemOnly: TRUE

# Attribute: msAuthz-MemberRulesInCentralAccessPolicyBL
dn:
 cn=ms-Authz-Member-Rules-In-Central-Access-Policy-BL,cn=Schema,cn=Configuratio
 n,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2156
ldapDisplayName: msAuthz-MemberRulesInCentralAccessPolicyBL
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-Authz-Member-Rules-In-Central-Access-Policy. For a central acc
 ess rule object, this attribute references one or more central access policies
  that point to it.
adminDisplayName: ms-Authz-Member-Rules-In-Central-Access-Policy-BL
# schemaIDGUID: 516e67cf-fedd-4494-bb3a-bc506a948891
schemaIDGUID:: z2duUd3+lES7OrxQapSIkQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2185
systemOnly: FALSE

# Attribute: msCOM-PartitionSetLink
dn: cn=ms-COM-PartitionSetLink,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1424
ldapDisplayName: msCOM-PartitionSetLink
attributeSyntax: 2.5.5.1
adminDescription:
 Link from a Partition to a PartitionSet. Default = adminDisplayName
adminDisplayName: ms-COM-PartitionSetLink
# schemaIDGUID: 67f121dc-7d02-4c7d-82f5-9ad4c950ac34
schemaIDGUID:: 3CHxZwJ9fUyC9ZrUyVCsNA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 1041
systemOnly: TRUE

# Attribute: msCOM-UserLink
dn: cn=ms-COM-UserLink,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1425
ldapDisplayName: msCOM-UserLink
attributeSyntax: 2.5.5.1
adminDescription:
 Link from a PartitionSet to a User. Default = adminDisplayName
adminDisplayName: ms-COM-UserLink
# schemaIDGUID: 9e6f3a4d-242c-4f37-b068-36b57f9fc852
schemaIDGUID:: TTpvniwkN0+waDa1f5/IUg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 1049
systemOnly: TRUE

# Attribute: msDFSR-ComputerReferenceBL
dn: cn=ms-DFSR-ComputerReferenceBL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.13.3.103
ldapDisplayName: msDFSR-ComputerReferenceBL
attributeSyntax: 2.5.5.1
adminDescription: Backlink attribute for ms-DFSR-ComputerReference
adminDisplayName: ms-DFSR-ComputerReferenceBL
# schemaIDGUID: 5eb526d7-d71b-44ae-8cc6-95460052e6ac
schemaIDGUID:: 1ya1XhvXrkSMxpVGAFLmrA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2051
systemOnly: FALSE

# Attribute: msDFSR-MemberReferenceBL
dn: cn=ms-DFSR-MemberReferenceBL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.13.3.102
ldapDisplayName: msDFSR-MemberReferenceBL
attributeSyntax: 2.5.5.1
adminDescription: Backlink attribute for ms-DFSR-MemberReference
adminDisplayName: ms-DFSR-MemberReferenceBL
# schemaIDGUID: adde62c6-1880-41ed-bd3c-30b7d25e14f0
schemaIDGUID:: xmLerYAY7UG9PDC30l4U8A==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2053
systemOnly: FALSE

# Attribute: msDS-AssignedAuthNPolicyBL
dn: cn=ms-DS-Assigned-AuthN-Policy-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2296
ldapDisplayName: msDS-AssignedAuthNPolicyBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute is the backlink for msDS-AssignedAuthNPolicy.
adminDisplayName: Assigned Authentication Policy Backlink
# schemaIDGUID: 2d131b3c-d39f-4aee-815e-8db4bc1ce7ac
schemaIDGUID:: PBsTLZ/T7kqBXo20vBznrA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2213
systemOnly: TRUE

# Attribute: msDS-AssignedAuthNPolicySiloBL
dn: cn=ms-DS-Assigned-AuthN-Policy-Silo-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2286
ldapDisplayName: msDS-AssignedAuthNPolicySiloBL
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute is the backlink for msDS-AssignedAuthNPolicySilo.
adminDisplayName: Assigned Authentication Policy Silo Backlink
# schemaIDGUID: 33140514-f57a-47d2-8ec4-04c4666600c7
schemaIDGUID:: FAUUM3r10keOxATEZmYAxw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2203
systemOnly: TRUE

# Attribute: msDS-AuthenticatedToAccountlist
dn: cn=ms-DS-AuthenticatedTo-Accountlist,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1957
ldapDisplayName: msDS-AuthenticatedToAccountlist
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-AuthenticatedAt-DC; for a Computer, identifies which users 
 have authenticated to this Computer
adminDisplayName: ms-DS-AuthenticatedTo-Accountlist
# schemaIDGUID: e8b2c971-a6df-47bc-8d6f-62770d527aa5
schemaIDGUID:: ccmy6N+mvEeNb2J3DVJ6pQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2113
systemOnly: TRUE

# Attribute: msDS-AuthNPolicySiloMembersBL
dn: cn=ms-DS-AuthN-Policy-Silo-Members-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2288
ldapDisplayName: msDS-AuthNPolicySiloMembersBL
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute is the backlink for msDS-AuthNPolicySiloMembers.
adminDisplayName: Authentication Policy Silo Members Backlink
# schemaIDGUID: 11fccbc7-fbe4-4951-b4b7-addf6f9efd44
schemaIDGUID:: x8v8EeT7UUm0t63fb579RA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2205
systemOnly: TRUE

# Attribute: msDS-ClaimSharesPossibleValuesWithBL
dn:
 cn=ms-DS-Claim-Shares-Possible-Values-With-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2102
ldapDisplayName: msDS-ClaimSharesPossibleValuesWithBL
attributeSyntax: 2.5.5.1
adminDescription:
 For a claim type object, this attribute indicates that the possible values des
 cribed in ms-DS-Claim-Possible-Values are being referenced by other claim type
  objects.
adminDisplayName: ms-DS-Claim-Shares-Possible-Values-With-BL
# schemaIDGUID: 54d522db-ec95-48f5-9bbd-1880ebbb2180
schemaIDGUID:: 2yLVVJXs9UibvRiA67shgA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2179
systemOnly: FALSE

# Attribute: msDS-ComputerAuthNPolicyBL
dn: cn=ms-DS-Computer-AuthN-Policy-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2292
ldapDisplayName: msDS-ComputerAuthNPolicyBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute is the backlink for msDS-ComputerAuthNPolicy.
adminDisplayName: Computer Authentication Policy Backlink
# schemaIDGUID: 2bef6232-30a1-457e-8604-7af6dbf131b8
schemaIDGUID:: MmLvK6EwfkWGBHr22/ExuA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2209
systemOnly: TRUE

# Attribute: msDS-HostServiceAccountBL
dn: cn=ms-DS-Host-Service-Account-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2057
ldapDisplayName: msDS-HostServiceAccountBL
attributeSyntax: 2.5.5.1
adminDescription:
 Service Accounts Back Link for linking machines associated with the service ac
 count.
adminDisplayName: ms-DS-Host-Service-Account-BL
# schemaIDGUID: 79abe4eb-88f3-48e7-89d6-f4bc7e98c331
schemaIDGUID:: 6+SrefOI50iJ1vS8fpjDMQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2167
systemOnly: FALSE

# Attribute: msDS-IsDomainFor
dn: cn=ms-DS-Is-Domain-For,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1933
ldapDisplayName: msDS-IsDomainFor
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-Has-Domain-NCs; for a partition root object, identifies whi
 ch Directory instances (DSA) hold that partition as their primary domain
adminDisplayName: ms-DS-Is-Domain-For
# schemaIDGUID: ff155a2a-44e5-4de0-8318-13a58988de4f
schemaIDGUID:: KloV/+VE4E2DGBOliYjeTw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2027
systemOnly: TRUE

# Attribute: msDS-IsFullReplicaFor
dn: cn=ms-DS-Is-Full-Replica-For,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1932
ldapDisplayName: msDS-IsFullReplicaFor
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-Ds-Has-Full-Replica-NCs; for a partition root object, identifi
 es which Directory instances (DSA) hold that partition as a full replica
adminDisplayName: ms-DS-Is-Full-Replica-For
# schemaIDGUID: c8bc72e0-a6b4-48f0-94a5-fd76a88c9987
schemaIDGUID:: 4HK8yLSm8EiUpf12qIyZhw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2105
systemOnly: TRUE

# Attribute: msDS-IsPartialReplicaFor
dn: cn=ms-DS-Is-Partial-Replica-For,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1934
ldapDisplayName: msDS-IsPartialReplicaFor
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for has-Partial-Replica-NCs; for a partition root object, identifies 
 which Directory instances (DSA) hold that partition as a partial replica
adminDisplayName: ms-DS-Is-Partial-Replica-For
# schemaIDGUID: 37c94ff6-c6d4-498f-b2f9-c6f7f8647809
schemaIDGUID:: 9k/JN9TGj0my+cb3+GR4CQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 75
systemOnly: TRUE

# Attribute: msDS-IsPrimaryComputerFor
dn: cn=ms-DS-Is-Primary-Computer-For,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2168
ldapDisplayName: msDS-IsPrimaryComputerFor
attributeSyntax: 2.5.5.1
adminDescription: Backlink atribute for msDS-IsPrimaryComputer.
adminDisplayName: ms-DS-Is-Primary-Computer-For
# schemaIDGUID: 998c06ac-3f87-444e-a5df-11b03dc8a50c
schemaIDGUID:: rAaMmYc/TkSl3xGwPcilDA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2187
systemOnly: FALSE

# Attribute: msDS-KeyCredentialLink-BL
dn: cn=ms-DS-Key-Credential-Link-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2329
ldapDisplayName: msDS-KeyCredentialLink-BL
attributeSyntax: 2.5.5.1
adminDisplayName: ms-DS-Key-Credential-Link-BL
# schemaIDGUID: 938ad788-225f-4eee-93b9-ad24a159e1db
schemaIDGUID:: iNeKk18i7k6Tua0koVnh2w==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2221
systemOnly: FALSE

# Attribute: msDS-KeyPrincipalBL
dn: cn=ms-DS-Key-Principal-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2319
ldapDisplayName: msDS-KeyPrincipalBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute is the backlink for msDS-KeyPrincipal.
adminDisplayName: msDS-KeyPrincipalBL
# schemaIDGUID: d1328fbc-8574-4150-881d-0b1088827878
schemaIDGUID:: vI8y0XSFUEGIHQsQiIJ4eA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2219
isMemberOfPartialAttributeSet: TRUE
systemOnly: TRUE

# Attribute: msDS-KrbTgtLinkBl
dn: cn=ms-DS-KrbTgt-Link-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1931
ldapDisplayName: msDS-KrbTgtLinkBl
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-KrbTgt-Link; for a user object (krbtgt) acting as a domain 
 or secondary domain master secret, identifies which computers are in that doma
 in or secondary domain
adminDisplayName: ms-DS-KrbTgt-Link-BL
# schemaIDGUID: 5dd68c41-bfdf-438b-9b5d-39d9618bf260
schemaIDGUID:: QYzWXd+/i0ObXTnZYYvyYA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2101
systemOnly: TRUE

# Attribute: msDS-MembersOfResourcePropertyListBL
dn:
 cn=ms-DS-Members-Of-Resource-Property-List-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2104
ldapDisplayName: msDS-MembersOfResourcePropertyListBL
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-Members-Of-Resource-Property-List. For a resource property 
 object, this attribute references the resource property list object that it is
  a member of.
adminDisplayName: ms-DS-Members-Of-Resource-Property-List-BL
# schemaIDGUID: 7469b704-edb0-4568-a5a5-59f4862c75a7
schemaIDGUID:: BLdpdLDtaEWlpVn0hix1pw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2181
systemOnly: FALSE

# Attribute: msDS-NC-RO-Replica-Locations-BL
dn: cn=ms-DS-NC-RO-Replica-Locations-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1968
ldapDisplayName: msDS-NC-RO-Replica-Locations-BL
attributeSyntax: 2.5.5.1
adminDescription: backlink attribute for ms-DS-NC-RO-Replica-Locations.
adminDisplayName: ms-DS-NC-RO-Replica-Locations-BL
# schemaIDGUID: f547511c-5b2a-44cc-8358-992a88258164
schemaIDGUID:: HFFH9SpbzESDWJkqiCWBZA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2115
systemOnly: FALSE

# Attribute: msDS-ObjectReferenceBL
dn: cn=ms-DS-Object-Reference-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1841
ldapDisplayName: msDS-ObjectReferenceBL
attributeSyntax: 2.5.5.1
adminDescription: Back link for ms-DS-Object-Reference.
adminDisplayName: ms-DS-Object-Reference-BL
# schemaIDGUID: 2b702515-c1f7-4b3b-b148-c0e4c6ceecb4
schemaIDGUID:: FSVwK/fBO0uxSMDkxs7stA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2039
systemOnly: TRUE

# Attribute: msDS-OIDToGroupLinkBl
dn: cn=ms-DS-OIDToGroup-Link-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2052
ldapDisplayName: msDS-OIDToGroupLinkBl
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-OIDToGroup-Link; identifies the issuance policy, represente
 d by an OID object, which is mapped to this group.
adminDisplayName: ms-DS-OIDToGroup-Link-BL
# schemaIDGUID: 1a3d0d20-5844-4199-ad25-0f5039a76ada
schemaIDGUID:: IA09GkRYmUGtJQ9QOadq2g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2165
systemOnly: TRUE

# Attribute: msDS-OperationsForAzRoleBL
dn: cn=ms-DS-Operations-For-Az-Role-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1813
ldapDisplayName: msDS-OperationsForAzRoleBL
attributeSyntax: 2.5.5.1
adminDescription:
 Back-link from Az-Operation to Az-Role object(s) linking to it
adminDisplayName: MS-DS-Operations-For-Az-Role-BL
# schemaIDGUID: f85b6228-3734-4525-b6b7-3f3bb220902c
schemaIDGUID:: KGJb+DQ3JUW2tz87siCQLA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2023
systemOnly: TRUE

# Attribute: msDS-OperationsForAzTaskBL
dn: cn=ms-DS-Operations-For-Az-Task-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1809
ldapDisplayName: msDS-OperationsForAzTaskBL
attributeSyntax: 2.5.5.1
adminDescription:
 Back-link from Az-Operation to Az-Task object(s) linking to it
adminDisplayName: MS-DS-Operations-For-Az-Task-BL
# schemaIDGUID: a637d211-5739-4ed1-89b2-88974548bc59
schemaIDGUID:: EdI3pjlX0U6JsoiXRUi8WQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2019
systemOnly: TRUE

# Attribute: msDS-PSOApplied
dn: cn=ms-DS-PSO-Applied,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2021
ldapDisplayName: msDS-PSOApplied
attributeSyntax: 2.5.5.1
adminDescription: Password settings object applied to this object
adminDisplayName: Password settings object applied
# schemaIDGUID: 5e6cf031-bda8-43c8-aca4-8fee4127005b
schemaIDGUID:: MfBsXqi9yEOspI/uQScAWw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2119
systemOnly: TRUE

# Attribute: msDS-RevealedDSAs
dn: cn=ms-DS-Revealed-DSAs,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1930
ldapDisplayName: msDS-RevealedDSAs
attributeSyntax: 2.5.5.1
adminDescription:
 Backlink for ms-DS-Revealed-Users; for a user, identifies which Directory inst
 ances (DSA) hold that user's secret
adminDisplayName: ms-DS-Revealed-DSAs
# schemaIDGUID: 94f6f2ac-c76d-4b5e-b71f-f332c3e93c22
schemaIDGUID:: rPL2lG3HXku3H/Myw+k8Ig==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2103
systemOnly: TRUE

# Attribute: msDS-ServiceAuthNPolicyBL
dn: cn=ms-DS-Service-AuthN-Policy-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2294
ldapDisplayName: msDS-ServiceAuthNPolicyBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute is the backlink for msDS-ServiceAuthNPolicy.
adminDisplayName: Service Authentication Policy Backlink
# schemaIDGUID: 2c1128ec-5aa2-42a3-b32d-f0979ca9fcd2
schemaIDGUID:: 7CgRLKJao0KzLfCXnKn80g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2211
systemOnly: TRUE

# Attribute: msDS-TasksForAzRoleBL
dn: cn=ms-DS-Tasks-For-Az-Role-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1815
ldapDisplayName: msDS-TasksForAzRoleBL
attributeSyntax: 2.5.5.1
adminDescription: Back-link from Az-Task to Az-Role object(s) linking to it
adminDisplayName: MS-DS-Tasks-For-Az-Role-BL
# schemaIDGUID: a0dcd536-5158-42fe-8c40-c00a7ad37959
schemaIDGUID:: NtXcoFhR/kKMQMAKetN5WQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2025
systemOnly: TRUE

# Attribute: msDS-TasksForAzTaskBL
dn: cn=ms-DS-Tasks-For-Az-Task-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.1811
ldapDisplayName: msDS-TasksForAzTaskBL
attributeSyntax: 2.5.5.1
adminDescription: Back-link from Az-Task to the Az-Task object(s) linking to it
adminDisplayName: MS-DS-Tasks-For-Az-Task-BL
# schemaIDGUID: df446e52-b5fa-4ca2-a42f-13f98a526c8f
schemaIDGUID:: Um5E3/q1okykLxP5ilJsjw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2021
systemOnly: TRUE

# Attribute: msDS-TDOEgressBL
dn: cn=ms-DS-TDO-Egress-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2194
ldapDisplayName: msDS-TDOEgressBL
attributeSyntax: 2.5.5.1
adminDescription: Backlink to TDO Egress rules link on object.
adminDisplayName: ms-DS-TDO-Egress-BL
# schemaIDGUID: d5006229-9913-2242-8b17-83761d1e0e5b
schemaIDGUID:: KWIA1ROZQiKLF4N2HR4OWw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2193
systemOnly: TRUE

# Attribute: msDS-TDOIngressBL
dn: cn=ms-DS-TDO-Ingress-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2193
ldapDisplayName: msDS-TDOIngressBL
attributeSyntax: 2.5.5.1
adminDescription: Backlink to TDO Ingress rules link on object.
adminDisplayName: ms-DS-TDO-Ingress-BL
# schemaIDGUID: 5a5661a1-97c6-544b-8056-e430fe7bc554
schemaIDGUID:: oWFWWsaXS1SAVuQw/nvFVA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2191
systemOnly: TRUE

# Attribute: msDS-UserAuthNPolicyBL
dn: cn=ms-DS-User-AuthN-Policy-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2290
ldapDisplayName: msDS-UserAuthNPolicyBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute is the backlink for msDS-UserAuthNPolicy.
adminDisplayName: User Authentication Policy Backlink
# schemaIDGUID: 2f17faa9-5d47-4b1f-977e-aa52fabe65c8
schemaIDGUID:: qfoXL0ddH0uXfqpS+r5lyA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2207
systemOnly: TRUE

# Attribute: msDS-ValueTypeReferenceBL
dn: cn=ms-DS-Value-Type-Reference-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2188
ldapDisplayName: msDS-ValueTypeReferenceBL
attributeSyntax: 2.5.5.1
adminDescription:
 This is the back link for ms-DS-Value-Type-Reference. It links a value type ob
 ject back to resource properties.
adminDisplayName: ms-DS-Value-Type-Reference-BL
# schemaIDGUID: ab5543ad-23a1-3b45-b937-9b313d5474a8
schemaIDGUID:: rUNVq6EjRTu5N5sxPVR0qA==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2189
systemOnly: TRUE

# Attribute: msSFU30PosixMemberOf
dn: cn=msSFU-30-Posix-Member-Of,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.6.18.1.347
ldapDisplayName: msSFU30PosixMemberOf
attributeSyntax: 2.5.5.1
adminDescription:
 stores the display names of groups to which this user belongs to
adminDisplayName: msSFU-30-Posix-Member-Of
# schemaIDGUID: 7bd76b92-3244-438a-ada6-24f5ea34381e
schemaIDGUID:: kmvXe0QyikOtpiT16jQ4Hg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2031
systemOnly: FALSE

# Attribute: msTPM-TpmInformationForComputerBL
dn: cn=ms-TPM-Tpm-Information-For-Computer-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2110
ldapDisplayName: msTPM-TpmInformationForComputerBL
attributeSyntax: 2.5.5.1
adminDescription:
 This attribute links a TPM object to the Computer objects associated with it.
adminDisplayName: TPM-TpmInformationForComputerBL
# schemaIDGUID: 14fa84c9-8ecd-4348-bc91-6d3ced472ab7
schemaIDGUID:: yYT6FM2OSEO8kW087Ucqtw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2183
systemOnly: TRUE

# Attribute: msTSPrimaryDesktopBL
dn: cn=ms-TS-Primary-Desktop-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2074
ldapDisplayName: msTSPrimaryDesktopBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute represents the backward link to user.
adminDisplayName: ms-TS-Primary-Desktop-BL
# schemaIDGUID: 9daadc18-40d1-4ed1-a2bf-6b9bf47d3daa
schemaIDGUID:: GNyqndFA0U6iv2ub9H09qg==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2171
systemOnly: TRUE

# Attribute: msTSSecondaryDesktopBL
dn: cn=ms-TS-Secondary-Desktop-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.2078
ldapDisplayName: msTSSecondaryDesktopBL
attributeSyntax: 2.5.5.1
adminDescription: This attribute represents the backward link to user.
adminDisplayName: ms-TS-Secondary-Desktop-BL
# schemaIDGUID: 34b107af-a00a-455a-b139-dd1a1b12d8af
schemaIDGUID:: rwexNAqgWkWxOd0aGxLYrw==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 2173
systemOnly: TRUE

# Attribute: netbootSCPBL
dn: cn=netboot-SCP-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.864
ldapDisplayName: netbootSCPBL
attributeSyntax: 2.5.5.1
adminDescription: netboot-SCP-BL
adminDisplayName: netboot-SCP-BL
# schemaIDGUID: 07383082-91df-11d1-aebc-0000f80367c1
schemaIDGUID:: gjA4B9+R0RGuvAAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 101
systemOnly: TRUE

# Attribute: nonSecurityMemberBL
dn: cn=Non-Security-Member-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.4.531
ldapDisplayName: nonSecurityMemberBL
attributeSyntax: 2.5.5.1
adminDescription: Non-Security-Member-BL
adminDisplayName: Non-Security-Member-BL
# schemaIDGUID: 52458019-ca6a-11d0-afff-0000f80367c1
schemaIDGUID:: GYBFUmrK0BGv/wAA+ANnwQ==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 51
systemOnly: TRUE

# Attribute: ownerBL
dn: cn=ms-Exch-Owner-BL,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: attributeSchema
attributeId: 1.2.840.113556.1.2.104
ldapDisplayName: ownerBL
attributeSyntax: 2.5.5.1
adminDescription: ms-Exch-Owner-BL
adminDisplayName: ms-Exch-Owner-BL
# schemaIDGUID: bf9679f4-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: 9HmWv+YN0BGihQCqADBJ4g==
oMObjectClass:: KwwCh3McAIVK
oMSyntax: 127
systemFlags: 1
linkId: 45
systemOnly: TRUE

dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-


# ==================================================================
#  Classes
# ==================================================================

# Class: msDS-AzAdminManager
dn: cn=ms-DS-Az-Admin-Manager,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 1.2.840.113556.1.5.234
ldapDisplayName: msDS-AzAdminManager
adminDisplayName: MS-DS-Az-Admin-Manager
adminDescription: Root of Authorization Policy store instance
# schemaIDGUID: cfee1051-5f28-4bae-a863-5d0cc18a8ed1
schemaIDGUID:: URDuzyhfrkuoY10MwYqO0Q==
objectClassCategory: 1
defaultSecurityDescriptor:
 D:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;DA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SY)(A;;
 LCRPLORC;;;AU)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;CO)
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMayContain: description
systemMayContain: 2.5.4.13
# systemMayContain: msDS-AzApplicationData
systemMayContain: 1.2.840.113556.1.4.1819
# systemMayContain: msDS-AzDomainTimeout
systemMayContain: 1.2.840.113556.1.4.1795
# systemMayContain: msDS-AzGenerateAudits
systemMayContain: 1.2.840.113556.1.4.1805
# systemMayContain: msDS-AzGenericData
systemMayContain: 1.2.840.113556.1.4.1950
# systemMayContain: msDS-AzMajorVersion
systemMayContain: 1.2.840.113556.1.4.1824
# systemMayContain: msDS-AzMinorVersion
systemMayContain: 1.2.840.113556.1.4.1825
# systemMayContain: msDS-AzObjectGuid
systemMayContain: 1.2.840.113556.1.4.1949
# systemMayContain: msDS-AzScriptEngineCacheMax
systemMayContain: 1.2.840.113556.1.4.1796
# systemMayContain: msDS-AzScriptTimeout
systemMayContain: 1.2.840.113556.1.4.1797
# systemPossSuperiors: container
systemPossSuperiors: 1.2.840.113556.1.3.23
# systemPossSuperiors: domainDNS
systemPossSuperiors: 1.2.840.113556.1.5.67
# systemPossSuperiors: organizationalUnit
systemPossSuperiors: 2.5.6.5
# defaultObjectCategory: msDS-AzAdminManager
defaultObjectCategory:
 cn=ms-DS-Az-Admin-Manager,cn=Schema,cn=Configuration,dc=X

# Class: person
dn: cn=Person,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 2.5.6.6
ldapDisplayName: person
adminDisplayName: Person
adminDescription: Person
# schemaIDGUID: bf967aa7-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: p3qWv+YN0BGihQCqADBJ4g==
objectClassCategory: 0
defaultSecurityDescriptor: D:S:
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMustContain: cn
systemMustContain: 2.5.4.3
# systemMayContain: seeAlso
systemMayContain: 2.5.4.34
# systemMayContain: serialNumber
systemMayContain: 2.5.4.5
# systemMayContain: sn
systemMayContain: 2.5.4.4
# systemMayContain: telephoneNumber
systemMayContain: 2.5.4.20
# systemMayContain: userPassword
systemMayContain: 2.5.4.35
# mayContain: attributeCertificateAttribute
mayContain: 2.5.4.58
# mayContain: employeeID
mayContain: 1.2.840.113556.1.4.35
# mayContain: userPrincipalName
mayContain: 1.2.840.113556.1.4.656
# systemPossSuperiors: container
systemPossSuperiors: 1.2.840.113556.1.3.23
# systemPossSuperiors: organizationalUnit
systemPossSuperiors: 2.5.6.5
# defaultObjectCategory: person
defaultObjectCategory: cn=Person,cn=Schema,cn=Configuration,dc=X

# Class: samDomainBase
dn: cn=Sam-Domain-Base,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 1.2.840.113556.1.5.2
ldapDisplayName: samDomainBase
adminDisplayName: Sam-Domain-Base
adminDescription: Sam-Domain-Base
# schemaIDGUID: bf967a91-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: kXqWv+YN0BGihQCqADBJ4g==
objectClassCategory: 3
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMayContain: creationTime
systemMayContain: 1.2.840.113556.1.4.26
# systemMayContain: domainReplica
systemMayContain: 1.2.840.113556.1.4.158
# systemMayContain: forceLogoff
systemMayContain: 1.2.840.113556.1.4.39
# systemMayContain: lockoutDuration
systemMayContain: 1.2.840.113556.1.4.60
# systemMayContain: lockOutObservationWindow
systemMayContain: 1.2.840.113556.1.4.61
# systemMayContain: lockoutThreshold
systemMayContain: 1.2.840.113556.1.4.73
# systemMayContain: maxPwdAge
systemMayContain: 1.2.840.113556.1.4.74
# systemMayContain: minPwdAge
systemMayContain: 1.2.840.113556.1.4.78
# systemMayContain: minPwdLength
systemMayContain: 1.2.840.113556.1.4.79
# systemMayContain: modifiedCount
systemMayContain: 1.2.840.113556.1.4.168
# systemMayContain: modifiedCountAtLastProm
systemMayContain: 1.2.840.113556.1.4.81
# systemMayContain: nextRid
systemMayContain: 1.2.840.113556.1.4.88
# systemMayContain: nTSecurityDescriptor
systemMayContain: 1.2.840.113556.1.2.281
# systemMayContain: objectSid
systemMayContain: 1.2.840.113556.1.4.146
# systemMayContain: oEMInformation
systemMayContain: 1.2.840.113556.1.4.151
# systemMayContain: pwdHistoryLength
systemMayContain: 1.2.840.113556.1.4.95
# systemMayContain: pwdProperties
systemMayContain: 1.2.840.113556.1.4.93
# systemMayContain: revision
systemMayContain: 1.2.840.113556.1.4.145
# systemMayContain: serverRole
systemMayContain: 1.2.840.113556.1.4.157
# systemMayContain: serverState
systemMayContain: 1.2.840.113556.1.4.154
# systemMayContain: uASCompat
systemMayContain: 1.2.840.113556.1.4.155
# defaultObjectCategory: samDomainBase
defaultObjectCategory: cn=Sam-Domain-Base,cn=Schema,cn=Configuration,dc=X

dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-

# Class: msDS-AzApplication
dn: cn=ms-DS-Az-Application,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 1.2.840.113556.1.5.235
ldapDisplayName: msDS-AzApplication
adminDisplayName: MS-DS-Az-Application
adminDescription:
 Defines an installed instance of an application bound to a particular policy s
 tore.
# schemaIDGUID: ddf8de9b-cba5-4e12-842e-28d8b66f75ec
schemaIDGUID:: m9743aXLEk6ELijYtm917A==
objectClassCategory: 1
defaultSecurityDescriptor:
 D:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;DA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SY)(A;;
 LCRPLORC;;;AU)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;CO)
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMayContain: description
systemMayContain: 2.5.4.13
# systemMayContain: msDS-AzApplicationData
systemMayContain: 1.2.840.113556.1.4.1819
# systemMayContain: msDS-AzApplicationName
systemMayContain: 1.2.840.113556.1.4.1798
# systemMayContain: msDS-AzApplicationVersion
systemMayContain: 1.2.840.113556.1.4.1817
# systemMayContain: msDS-AzClassId
systemMayContain: 1.2.840.113556.1.4.1816
# systemMayContain: msDS-AzGenerateAudits
systemMayContain: 1.2.840.113556.1.4.1805
# systemMayContain: msDS-AzGenericData
systemMayContain: 1.2.840.113556.1.4.1950
# systemMayContain: msDS-AzObjectGuid
systemMayContain: 1.2.840.113556.1.4.1949
# systemPossSuperiors: msDS-AzAdminManager
systemPossSuperiors: 1.2.840.113556.1.5.234
# defaultObjectCategory: msDS-AzApplication
defaultObjectCategory: cn=ms-DS-Az-Application,cn=Schema,cn=Configuration,dc=X

# Class: samDomain
dn: cn=Sam-Domain,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 1.2.840.113556.1.5.3
ldapDisplayName: samDomain
adminDisplayName: Sam-Domain
adminDescription: Sam-Domain
# schemaIDGUID: bf967a90-0de6-11d0-a285-00aa003049e2
schemaIDGUID:: kHqWv+YN0BGihQCqADBJ4g==
objectClassCategory: 3
defaultSecurityDescriptor:
 D:(OA;;CR;1131f6aa-9c07-11d1-f79f-00c04fc2dcd2;;S-1-5-21-3572387884-1878489582
 -1150695038-498)(A;;RP;;;WD)(OA;;CR;1131f6aa-9c07-11d1-f79f-00c04fc2dcd2;;ED)(
 OA;;CR;1131f6ab-9c07-11d1-f79f-00c04fc2dcd2;;ED)(OA;;CR;1131f6ac-9c07-11d1-f79
 f-00c04fc2dcd2;;ED)(OA;;CR;1131f6aa-9c07-11d1-f79f-00c04fc2dcd2;;BA)(OA;;CR;11
 31f6ab-9c07-11d1-f79f-00c04fc2dcd2;;BA)(OA;;CR;1131f6ac-9c07-11d1-f79f-00c04fc
 2dcd2;;BA)(A;;LCRPLORC;;;AU)(A;;CCLCSWRPWPLOCRRCWDWO;;;DA)(A;CI;CCLCSWRPWPLOCR
 SDRCWDWO;;;BA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SY)(A;CI;CCDCLCSWRPWPDTLOCRSDRC
 WDWO;;;EA)(A;CI;LC;;;RU)(OA;CIIO;RP;037088f8-0ae1-11d2-b422-00a0c968f939;bf967
 aba-0de6-11d0-a285-00aa003049e2;RU)(OA;CIIO;RP;59ba2f42-79a2-11d0-9020-00c04fc
 2d3cf;bf967aba-0de6-11d0-a285-00aa003049e2;RU)(OA;CIIO;RP;bc0ac240-79a9-11d0-9
 020-00c04fc2d4cf;bf967aba-0de6-11d0-a285-00aa003049e2;RU)(OA;CIIO;RP;4c164200-
 20c0-11d0-a768-00aa006e0529;bf967aba-0de6-11d0-a285-00aa003049e2;RU)(OA;CIIO;R
 P;5f202010-79a5-11d0-9020-00c04fc2d4cf;bf967aba-0de6-11d0-a285-00aa003049e2;RU
 )(OA;;RP;c7407360-20bf-11d0-a768-00aa006e0529;;RU)(OA;CIIO;LCRPLORC;;bf967a9c-
 0de6-11d0-a285-00aa003049e2;RU)(A;;RPRC;;;RU)(OA;CIIO;LCRPLORC;;bf967aba-0de6-
 11d0-a285-00aa003049e2;RU)(A;;LCRPLORC;;;ED)(OA;CIIO;RP;037088f8-0ae1-11d2-b42
 2-00a0c968f939;4828cc14-1437-45bc-9b07-ad6f015e5f28;RU)(OA;CIIO;RP;59ba2f42-79
 a2-11d0-9020-00c04fc2d3cf;4828cc14-1437-45bc-9b07-ad6f015e5f28;RU)(OA;CIIO;RP;
 bc0ac240-79a9-11d0-9020-00c04fc2d4cf;4828cc14-1437-45bc-9b07-ad6f015e5f28;RU)(
 OA;CIIO;RP;4c164200-20c0-11d0-a768-00aa006e0529;4828cc14-1437-45bc-9b07-ad6f01
 5e5f28;RU)(OA;CIIO;RP;5f202010-79a5-11d0-9020-00c04fc2d4cf;4828cc14-1437-45bc-
 9b07-ad6f015e5f28;RU)(OA;CIIO;LCRPLORC;;4828cc14-1437-45bc-9b07-ad6f015e5f28;R
 U)(OA;;RP;b8119fd0-04f6-4762-ab7a-4986c76b3f9a;;RU)(OA;;RP;b8119fd0-04f6-4762-
 ab7a-4986c76b3f9a;;AU)(OA;CIIO;RP;b7c69e6d-2cc7-11d2-854e-00a0c983f608;bf967ab
 a-0de6-11d0-a285-00aa003049e2;ED)(OA;CIIO;RP;b7c69e6d-2cc7-11d2-854e-00a0c983f
 608;bf967a9c-0de6-11d0-a285-00aa003049e2;ED)(OA;CIIO;RP;b7c69e6d-2cc7-11d2-854
 e-00a0c983f608;bf967a86-0de6-11d0-a285-00aa003049e2;ED)(OA;CIIO;WP;ea1b7b93-5e
 48-46d5-bc6c-4df4fda78a35;bf967a86-0de6-11d0-a285-00aa003049e2;PS)(OA;;CR;1131
 f6ad-9c07-11d1-f79f-00c04fc2dcd2;;DD)(OA;;CR;89e95b76-444d-4c62-991a-0facbeda6
 40c;;ED)(OA;;CR;1131f6ad-9c07-11d1-f79f-00c04fc2dcd2;;BA)(OA;;CR;89e95b76-444d
 -4c62-991a-0facbeda640c;;BA)(OA;;CR;e2a36dc9-ae17-47c3-b58b-be34c55ba633;;S-1-
 5-32-557)(OA;;CR;280f369c-67c7-438e-ae98-1d46f3c6f541;;AU)(OA;;CR;ccc2dc7d-a6a
 d-4a7a-8846-c04e3cc53501;;AU)(OA;;CR;05c74c5e-4deb-43b4-bd9f-86664c2a7fd5;;AU)
 (OA;;CR;1131f6ae-9c07-11d1-f79f-00c04fc2dcd2;;ED)(OA;;CR;1131f6ae-9c07-11d1-f7
 9f-00c04fc2dcd2;;BA)(OA;CIIO;RPWPCR;91e647de-d96f-4b70-9557-d63ff4f3ccd8;;PS)(
 OA;OICI;RPWP;3f78c3e5-f79a-46bd-a0b8-9d18116ddc79;;PS)S:(AU;SA;WPWDWO;;;WD)(AU
 ;SA;CR;;;BA)(AU;SA;CR;;;DU)(OU;CISA;WP;f30e3bbe-9ff0-11d1-b603-0000f80367c1;bf
 967aa5-0de6-11d0-a285-00aa003049e2;WD)(OU;CISA;WP;f30e3bbf-9ff0-11d1-b603-0000
 f80367c1;bf967aa5-0de6-11d0-a285-00aa003049e2;WD)
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMayContain: auditingPolicy
systemMayContain: 1.2.840.113556.1.4.202
# systemMayContain: builtinCreationTime
systemMayContain: 1.2.840.113556.1.4.13
# systemMayContain: builtinModifiedCount
systemMayContain: 1.2.840.113556.1.4.14
# systemMayContain: cACertificate
systemMayContain: 2.5.4.37
# systemMayContain: controlAccessRights
systemMayContain: 1.2.840.113556.1.4.200
# systemMayContain: creationTime
systemMayContain: 1.2.840.113556.1.4.26
# systemMayContain: defaultLocalPolicyObject
systemMayContain: 1.2.840.113556.1.4.57
# systemMayContain: description
systemMayContain: 2.5.4.13
# systemMayContain: desktopProfile
systemMayContain: 1.2.840.113556.1.4.346
# systemMayContain: domainPolicyObject
systemMayContain: 1.2.840.113556.1.4.32
# systemMayContain: eFSPolicy
systemMayContain: 1.2.840.113556.1.4.268
# systemMayContain: gPLink
systemMayContain: 1.2.840.113556.1.4.891
# systemMayContain: gPOptions
systemMayContain: 1.2.840.113556.1.4.892
# systemMayContain: lockoutDuration
systemMayContain: 1.2.840.113556.1.4.60
# systemMayContain: lockOutObservationWindow
systemMayContain: 1.2.840.113556.1.4.61
# systemMayContain: lockoutThreshold
systemMayContain: 1.2.840.113556.1.4.73
# systemMayContain: lSACreationTime
systemMayContain: 1.2.840.113556.1.4.66
# systemMayContain: lSAModifiedCount
systemMayContain: 1.2.840.113556.1.4.67
# systemMayContain: maxPwdAge
systemMayContain: 1.2.840.113556.1.4.74
# systemMayContain: minPwdAge
systemMayContain: 1.2.840.113556.1.4.78
# systemMayContain: minPwdLength
systemMayContain: 1.2.840.113556.1.4.79
# systemMayContain: modifiedCountAtLastProm
systemMayContain: 1.2.840.113556.1.4.81
# systemMayContain: msDS-AllUsersTrustQuota
systemMayContain: 1.2.840.113556.1.4.1789
# systemMayContain: msDS-LogonTimeSyncInterval
systemMayContain: 1.2.840.113556.1.4.1784
# systemMayContain: ms-DS-MachineAccountQuota
systemMayContain: 1.2.840.113556.1.4.1411
# systemMayContain: msDS-PerUserTrustQuota
systemMayContain: 1.2.840.113556.1.4.1788
# systemMayContain: msDS-PerUserTrustTombstonesQuota
systemMayContain: 1.2.840.113556.1.4.1790
# systemMayContain: nETBIOSName
systemMayContain: 1.2.840.113556.1.4.87
# systemMayContain: nextRid
systemMayContain: 1.2.840.113556.1.4.88
# systemMayContain: nTMixedDomain
systemMayContain: 1.2.840.113556.1.4.357
# systemMayContain: pekKeyChangeInterval
systemMayContain: 1.2.840.113556.1.4.866
# systemMayContain: pekList
systemMayContain: 1.2.840.113556.1.4.865
# systemMayContain: privateKey
systemMayContain: 1.2.840.113556.1.4.101
# systemMayContain: pwdHistoryLength
systemMayContain: 1.2.840.113556.1.4.95
# systemMayContain: pwdProperties
systemMayContain: 1.2.840.113556.1.4.93
# systemMayContain: replicaSource
systemMayContain: 1.2.840.113556.1.4.109
# systemMayContain: rIDManagerReference
systemMayContain: 1.2.840.113556.1.4.368
# systemMayContain: treeName
systemMayContain: 1.2.840.113556.1.4.660
# systemAuxiliaryClass: samDomainBase
systemAuxiliaryClass: 1.2.840.113556.1.5.2
# defaultObjectCategory: samDomain
defaultObjectCategory: cn=Sam-Domain,cn=Schema,cn=Configuration,dc=X

dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-

# Class: msDS-AzScope
dn: cn=ms-DS-Az-Scope,cn=Schema,cn=Configuration,dc=X
changetype: add
objectClass: classSchema
governsID: 1.2.840.113556.1.5.237
ldapDisplayName: msDS-AzScope
adminDisplayName: MS-DS-Az-Scope
adminDescription: Describes a set of objects managed by an application
# schemaIDGUID: 4feae054-ce55-47bb-860e-5b12063a51de
schemaIDGUID:: VODqT1XOu0eGDlsSBjpR3g==
objectClassCategory: 1
defaultSecurityDescriptor:
 D:(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;DA)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;SY)(A;;
 LCRPLORC;;;AU)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;CO)
systemOnly: FALSE
# subclassOf: top
subclassOf: 2.5.6.0
# rdnAttId: cn
rdnAttId: 2.5.4.3
# systemMustContain: msDS-AzScopeName
systemMustContain: 1.2.840.113556.1.4.1799
# systemMayContain: description
systemMayContain: 2.5.4.13
# systemMayContain: msDS-AzApplicationData
systemMayContain: 1.2.840.113556.1.4.1819
# systemMayContain: msDS-AzGenericData
systemMayContain: 1.2.840.113556.1.4.1950
# systemMayContain: msDS-AzObjectGuid
systemMayContain: 1.2.840.113556.1.4.1949
# systemPossSuperiors: msDS-AzApplication
systemPossSuperiors: 1.2.840.113556.1.5.235
# defaultObjectCategory: msDS-AzScope
defaultObjectCategory: cn=ms-DS-Az-Scope,cn=Schema,cn=Configuration,dc=X

dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-


# ==================================================================
#  Updating present elements
# ==================================================================

#  Adding backlinks to top
dn: cn=Top,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: directReports
mayContain: 1.2.840.113556.1.2.436
# mayContain: frsComputerReferenceBL
mayContain: 1.2.840.113556.1.4.870
# mayContain: fRSMemberReferenceBL
mayContain: 1.2.840.113556.1.4.876
# mayContain: isPrivilegeHolder
mayContain: 1.2.840.113556.1.4.638
# mayContain: msAuthz-MemberRulesInCentralAccessPolicyBL
mayContain: 1.2.840.113556.1.4.2156
# mayContain: msCOM-PartitionSetLink
mayContain: 1.2.840.113556.1.4.1424
# mayContain: msCOM-UserLink
mayContain: 1.2.840.113556.1.4.1425
# mayContain: msDFSR-ComputerReferenceBL
mayContain: 1.2.840.113556.1.6.13.3.103
# mayContain: msDFSR-MemberReferenceBL
mayContain: 1.2.840.113556.1.6.13.3.102
# mayContain: msDS-AssignedAuthNPolicyBL
mayContain: 1.2.840.113556.1.4.2296
# mayContain: msDS-AssignedAuthNPolicySiloBL
mayContain: 1.2.840.113556.1.4.2286
# mayContain: msDS-AuthenticatedToAccountlist
mayContain: 1.2.840.113556.1.4.1957
# mayContain: msDS-AuthNPolicySiloMembersBL
mayContain: 1.2.840.113556.1.4.2288
# mayContain: msDS-ClaimSharesPossibleValuesWithBL
mayContain: 1.2.840.113556.1.4.2102
# mayContain: msDS-ComputerAuthNPolicyBL
mayContain: 1.2.840.113556.1.4.2292
# mayContain: msDS-HostServiceAccountBL
mayContain: 1.2.840.113556.1.4.2057
# mayContain: msDS-IsDomainFor
mayContain: 1.2.840.113556.1.4.1933
# mayContain: msDS-IsFullReplicaFor
mayContain: 1.2.840.113556.1.4.1932
# mayContain: msDS-IsPartialReplicaFor
mayContain: 1.2.840.113556.1.4.1934
# mayContain: msDS-IsPrimaryComputerFor
mayContain: 1.2.840.113556.1.4.2168
# mayContain: msDS-KeyCredentialLink-BL
mayContain: 1.2.840.113556.1.4.2329
# mayContain: msDS-KeyPrincipalBL
mayContain: 1.2.840.113556.1.4.2319
# mayContain: msDS-KrbTgtLinkBl
mayContain: 1.2.840.113556.1.4.1931
# mayContain: msDS-MembersOfResourcePropertyListBL
mayContain: 1.2.840.113556.1.4.2104
# mayContain: msDS-NC-RO-Replica-Locations-BL
mayContain: 1.2.840.113556.1.4.1968
# mayContain: msDS-ObjectReferenceBL
mayContain: 1.2.840.113556.1.4.1841
# mayContain: msDS-OIDToGroupLinkBl
mayContain: 1.2.840.113556.1.4.2052
# mayContain: msDS-OperationsForAzRoleBL
mayContain: 1.2.840.113556.1.4.1813
# mayContain: msDS-OperationsForAzTaskBL
mayContain: 1.2.840.113556.1.4.1809
# mayContain: msDS-PSOApplied
mayContain: 1.2.840.113556.1.4.2021
# mayContain: msDS-RevealedDSAs
mayContain: 1.2.840.113556.1.4.1930
# mayContain: msDS-ServiceAuthNPolicyBL
mayContain: 1.2.840.113556.1.4.2294
# mayContain: msDS-TasksForAzRoleBL
mayContain: 1.2.840.113556.1.4.1815
# mayContain: msDS-TasksForAzTaskBL
mayContain: 1.2.840.113556.1.4.1811
# mayContain: msDS-TDOEgressBL
mayContain: 1.2.840.113556.1.4.2194
# mayContain: msDS-TDOIngressBL
mayContain: 1.2.840.113556.1.4.2193
# mayContain: msDS-UserAuthNPolicyBL
mayContain: 1.2.840.113556.1.4.2290
# mayContain: msDS-ValueTypeReferenceBL
mayContain: 1.2.840.113556.1.4.2188
# mayContain: msSFU30PosixMemberOf
mayContain: 1.2.840.113556.1.6.18.1.347
# mayContain: msTPM-TpmInformationForComputerBL
mayContain: 1.2.840.113556.1.4.2110
# mayContain: msTSPrimaryDesktopBL
mayContain: 1.2.840.113556.1.4.2074
# mayContain: msTSSecondaryDesktopBL
mayContain: 1.2.840.113556.1.4.2078
# mayContain: netbootSCPBL
mayContain: 1.2.840.113556.1.4.864
# mayContain: nonSecurityMemberBL
mayContain: 1.2.840.113556.1.4.531
# mayContain: ownerBL
mayContain: 1.2.840.113556.1.2.104
-

# Update element: configuration
dn: cn=Configuration,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: gPLink
mayContain: 1.2.840.113556.1.4.891
# mayContain: gPOptions
mayContain: 1.2.840.113556.1.4.892
-

# Update element: container
dn: cn=Container,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: msDS-ObjectReference
mayContain: 1.2.840.113556.1.4.1840
-
add: possSuperiors
# possSuperiors: msDS-AzAdminManager
possSuperiors: 1.2.840.113556.1.5.234
# possSuperiors: msDS-AzApplication
possSuperiors: 1.2.840.113556.1.5.235
# possSuperiors: msDS-AzScope
possSuperiors: 1.2.840.113556.1.5.237
-

# Update element: crossRef
dn: cn=Cross-Ref,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: msDS-NC-RO-Replica-Locations
mayContain: 1.2.840.113556.1.4.1967
# mayContain: nTMixedDomain
mayContain: 1.2.840.113556.1.4.357
-

# Update element: domainDNS
dn: cn=Domain-DNS,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: msDS-ExpirePasswordsOnSmartCardOnlyAccounts
mayContain: 1.2.840.113556.1.4.2344
-
add: auxiliaryClass
# auxiliaryClass: samDomain
auxiliaryClass: 1.2.840.113556.1.5.3
-

# Update element: group
dn: cn=Group,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: controlAccessRights
mayContain: 1.2.840.113556.1.4.200
# mayContain: msDS-AzApplicationData
mayContain: 1.2.840.113556.1.4.1819
# mayContain: msDS-AzGenericData
mayContain: 1.2.840.113556.1.4.1950
# mayContain: msDS-AzObjectGuid
mayContain: 1.2.840.113556.1.4.1949
# mayContain: msDS-PrimaryComputer
mayContain: 1.2.840.113556.1.4.2167
# mayContain: msSFU30PosixMember
mayContain: 1.2.840.113556.1.6.18.1.346
# mayContain: nonSecurityMember
mayContain: 1.2.840.113556.1.4.530
-
add: possSuperiors
# possSuperiors: msDS-AzAdminManager
possSuperiors: 1.2.840.113556.1.5.234
# possSuperiors: msDS-AzApplication
possSuperiors: 1.2.840.113556.1.5.235
# possSuperiors: msDS-AzScope
possSuperiors: 1.2.840.113556.1.5.237
-

# Update element: nTDSDSA
dn: cn=NTDS-DSA,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: msDS-hasFullReplicaNCs
mayContain: 1.2.840.113556.1.4.1925
# mayContain: msDS-RevealedUsers
mayContain: 1.2.840.113556.1.4.1924
-

# Update element: organizationalUnit
dn: cn=Organizational-Unit,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: gPLink
mayContain: 1.2.840.113556.1.4.891
# mayContain: gPOptions
mayContain: 1.2.840.113556.1.4.892
# mayContain: msCOM-UserPartitionSetLink
mayContain: 1.2.840.113556.1.4.1426
-

# Update element: site
dn: cn=Site,cn=Schema,cn=Configuration,dc=X
changetype: modify
add: mayContain
# mayContain: gPLink
mayContain: 1.2.840.113556.1.4.891
# mayContain: gPOptions
mayContain: 1.2.840.113556.1.4.892
-

dn: 
changetype: modify
add: schemaUpdateNow
schemaUpdateNow: 1
-


```

## Appendix C - Answer file
This file is used to automate and create an instance of AD LDS.

>[!IMPORTANT]
> This script uses the local administrator for the AD LDS service account and has its password hard-coded in the answers.  This is for **testing only** and should never be used in a production environment.

```
 [ADAMInstall]
 InstallType=Unique
 InstanceName=AD-APP-LDAP
 LocalLDAPPortToListenOn=51300
 LocalSSLPortToListenOn=51301
 NewApplicationPartitionToCreate=CN=App,DC=contoso,DC=lab
 DataFilesPath=C:\Program Files\Microsoft ADAM\AD-APP-LDAP\data
 LogFilesPath=C:\Program Files\Microsoft ADAM\AD-APP-LDAP\data
 ServiceAccount=APP3\Administrator
 ServicePassword=Pa$$Word1
 AddPermissionsToServiceAccount=Yes
 Administrator=APP3\Administrator
 ImportLDIFFiles="AddPerson.LDF"
 SourceUserName=APP3\Administrator
 SourcePassword=Pa$$Word1
 ```
