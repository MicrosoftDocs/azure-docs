---
title: Windows Virtual Desktop configuration and upgrade specs
description: TBD.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Windows Virtual Desktop configuration and upgrade specs

>UNSURE IF NEEDED

## Goals

This article will describe how an admin can set up extra configuration and change certificates on the Windows Virtual Desktop roles, as well as how an admin can perform status checks after or during upgrade of infrastructure roles and their instances.

## Overview

Once the infrastructure is set up, the administrator will probably want to change certain settings, such as setting up a new Gateway FQDN or changing certificates. These configuration changes are typically supported by the infrastructure. Some configurations, like identity provider details or DB connection string, aren't supported by the infrastructure while it's active and taking user and management traffic. In this case, the only way to change the configuration would be to either redeploy or to stop all instances, apply changes to the web app configuration manually, then start the instances up again.

All instances that are part of the active infrastructure should have the same role package version. While performing an upgrade, an administrator should be able to query the system as to which version of the package is being used and whether the update was succesful. This will also be important when certificates are being rolled in the system; because all instances should use the same certificate, the admin should be able to see what certificates are being used by all instances of every role.

### Modifying configuration

Initial configuration, which is the minimum information needed to make sure all the instances of all the roles can start up and function,  is part of the deployment script. You can use PowerShell cmdlets to interact with the Broker and update the configuration.

#### Modifying the gateway's external FQDN

Hosts or customers setting up the infrastructure can use the **Set-RdsInfrastructure** cmdlet to modify the gateway's external FQDN to something simpler, if needed. The RDP file that will be published to the users will have more information about how to modify the external FQDN.

#### Modifying certificates

When updating a certificate, the admin must first apply the certificate on the Azure roles or virtual machines running the roles with whatever method their platform currently supports outside of Remote Desktop Services. Once the admin has made sure that the roles or virtual machines can access the new certificates, they can use the **Set-RdsInfrastructure** cmdlet to allow roles to start consuming the new certificate. **Set-RdsInfrastructure** lets the admin add a different primary or secondary certificate to the infrastructure. The two certificates this cmdlet is authorized to modify are the certificate that lets roles communicate with each other and the certificate that generates the tokens RDSHs use to join the infrastructure.

When the new certificates have been tested and all instances have the new certifications, the admin can set the CB to use only the new certification by first executing the **Set-RdsInfrastructure** cmdlet, then setting the new certificate as primary and an empty string as the secondary.

The third supported certificate is RDP file signing. More information about this will come soon.

#### Telemetry

Admins can enable or disable reporting telemetry back to Microsoft at any time. With the **Set-RdsInfrastructure** cmdlet, you can enable telemetry by setting the **EnableTelemetry** flag to **1** or disable it by setting it to **0**.

#### Logging

A new feature of Windows Virtual Desktop is the ability to collect tracelogs for reporting issues to Microsoft. The admin can allow the Windows Virtual Desktop logging services to store logs in the Azure storage account by running the  **Set-RdsInfrastructure** cmdlet and providing the mandatory *AzureStorageContainerSASToken* parameter. The admin can also modify the retention time for the logs on the account (minimum retention time is one day, default value is 30 days).

### Unmodifiable configurations

The following configurations can't be modified by cmdlets after deployment.

#### Identity provider

Both the RDWeb and RDGateway roles will use the same information, which will probably not change for the deployment's lifetime. No cmdlet for changing identity provider information currently exists due to multiple dependencies in the tenant environments. If hosters want to modify identity provider information, they will have to create a new deployment.

#### DB connection string

Any changes that need to be made to the DB connection string must be made directly in the config for web applications either on Azure or on-premises.
The following configuration is not supported for Windows Virtual Desktop V1.

#### License server configuration (not supported for V1)

* New PowerShell cmdlets:
  1. Activate the license server. Output should indicate if the license server is activated. If not, it should show the appropriate error message.
  2. Install CALs and SALs and differentiate between them.
* Diagnostic server configuration: no extra configuration needed for V1.

### Infrastructure management

Management of the infrastructure will fall into the following categories:

1. Configuration update (already discussed above).
1. Applying package updates on Azure and on-premises.

#### Applying updates

On any major Windows Virtual Desktop updates, .NET, ASP.NET, or security updates, new web deploy packages will be made available through the public repository. Side-by-side stack and agent updates will be available in the same repository.

#### App Service deployment

You can find upgrade recommendations in [Set up staging environments in Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/web-sites-staged-publishing).

CB instances are responsible for updating the DB schema if any changes are made. This should happen automatically on a CB update. Instances will take care not to update the DB multiple times and to lock down the DB during update. Updates will result in downtime, but the maximum downtime should be less than two hours.

### Failures during deployment, upgrade, and configuration

A script, provided as part of the solution, can be used specifically to determine whether all roles can communicate after an upgrade or configuration change (specifically certificates). Any failure's details can be determined with diagnostics cmdlets. Any errors that signal a faulty role should be reflected in the diagnostics activity retrieval—if CB is using an outdated DB schema and all calls are failing, this should be the error that diagnostics should display.

There may be failures in deploying packages for the different roles. On failure, logs can be queried by the admin on the failed server. During installation, the PowerShell scripts will check for prerequisites and will notify the admin if any are missing or the wrong version.

On Azure PaaS, there are standard ways of diagnosing failures. For more info, visit here. (INSERT LINK)

#### Other requirements

* All roles should check the OS and version of the VM they are installed on. Roles can run only on Server Core and the version published in the EULA.
* After deployment/upgrade, the admin should be able to test the connectivity and state of the roles with a simple runner/script.

### PowerShell cmdlets and examples

|cmdlet name|Priority|
|---|---|
|[Get-RdsInfrastructure](https://cmdletdesigner/SpecViewer/Default.aspx?ProjectId=1296&Cmdlet=Get-RdsDeployment&ServiceUri=http://localhost/CmdletDesigner/CmdletDesignerService.svc)|TP2|
|[Set-RdsInfrastructure](https://cmdletdesigner/SpecViewer/Default.aspx?ProjectId=1296&Cmdlet=Set-RdsDeployment&ServiceUri=http://localhost/CmdletDesigner/CmdletDesignerService.svc)|TP2|

#### Example 1

```PowerShell
Set-RdsInfrastructure [-Description <String>] [-PrimaryRegTokenCertThumbprint <String>] [-SecondaryRegTokenCertThumbprint <String>] [-SecondaryAuthCertThumbprint <String>] [-FriendlyName <String>] [-PrimaryAuthCertThumbprint <String>] [-ExternalGWFQDN <Uri>EnableTelemetry<Boolean>]] [ [-LogStorageAcctReadUrl <Uri>][- LogStorageAcctWriteUrl <Uri>][-LogRetention <Int32>]

C:\PS> Set-RdsInfrastructure -FriendlyName 'Deployment_Contoso_Main' -PrimaryAuthCertThumbprint 88d238134218403a9127abe9efg6a2f4 –PrimaryRegTokenCertThumbprint 82q238141756483x9127abe9wer7a2g7 -SecondaryAuthCertThumbprint '' -SecondaryRegTokenCertThumbprint '' -ExternalGWFQDN ‘https://contosogateway. Azurewebsites.net’
-EnableTelemetry 1 -LogRetention ‘30’ – LogStorageAcctReadUrl ‘https://storagesample.blob.core.windows.net/sample-container/someBlob.txt?sv=2017-12-09&sr=b&slg=39Up9JxHkxhUIhFEJEH9594DJxe7w6cIRCg0v6ICGSo%3D&se=2018-12-08&sp=r’ -LogStorageAcctWriteUrl ‘https://storagesample.blob.core.windows.net/sample-container/someBlob.txt?sv=2017-12-09&sr=b&slg=39Up9JxJkxhUIhFEJEH9594DJxe7w6bIRCg0v6IAGSo%3D&se=2018-12-08&sp=rcw’
```

* Certificate-related parameters: string should be hexadecimal—characters belong to the set {a–f, A–F, and 0–9}. Length should be 40.
* *Description*: a 256-character string that describes the <object</span>> to help administrators. Must contain only letter, digit, space, underscore, or dash characters.
* *FriendlyName*: a 128-character string that is intended for display to end users. Must contain only letter, digit, space, underscore, or dash characters.

The following table describes common error messages.

|Error text|Description|Example|
|---|---|---|
|Parameter string value is too long.|Parameter's string value exceeds maximum limit of <x</span>> characters.|FriendlyName: 128<br> Description: 256 <br>(FriendlyName string value exceeds maximum limit of 128 characters.)|
|*CertificateThumbprint* entry uses invalid characters.|Invalid parameter value. Parameters must contain only hexadecimal values (a–f, A–F, and 0–9) and have no leading or trailing spaces.|88d238134218403y9127gve9ejk6a2f4 <br>(String contains alphabetical values beyond f.)|
|*CertificateThumbprint* entry has invalid length.|Invalid parameter length. Parameters must be exactly 40 characters long.|88d2381342189ejk6a2f4 <br>(String too short.)|

#### Example 2

```PowerShell
FriendlyName : Contoso Hosting Company
Description : This is the main deployment for the Contoso Hosting company
PrimaryAuthCertThumbprint : 88d238134218403a9127abe9efg6a2f4
PrimaryRegTokenCertThumbprint : 82q238141756483x9127abe9wer7a2g7
SecondaryAuthCertThumbprint : ''
SecondaryRegTokenCertThumbprint : ''
ExternalGWFQDN : ‘https://contosogateway. Azurewebsites.net
EnableTelemetry: 1
LogRetention: 30
LogStorageAcctReadUrl : ‘https://storagesample.blob.core.windows.net/sample-container/someBlob.txt?sv=2017-12-09&sr=b&slg=39Up9JxHkxhUIhFEJEH9594DJxe7w6cIRCg0v6ICGSo%3D&se=2018-12-08&sp=r’ LogStorageAcctWriteUrl : ‘https://storagesample.blob.core.windows.net/sample-container/someBlob.txt?sv=2017-12-09&sr=b&slg=39Up9JxJkxhUIhFEJEH9594DJxe7w6bIRCg0v6IAGSo%3D&se=2018-12-08&sp=rcw’
```

* Errors: none.

### Feature dependencies

The following table lists dependencies this design has on other features.

|Title|Description|
|---|---|
|Team name|Enter text here.|
|Contacts pm/dev/test|Enter text here.|
|Mitigation/feedback|Enter text here.|

The following table lists features that depend on this design.

|Title|Description|
|---|---|
|Description of deliverable|Enter text here.|
|Feature/partner team|Enter text here.|

## Review checklist

|Area| Status |Considerations to make before completion|
|---|---|---|
|Requirements| ☐ |Are the requirements clear? <br>Are the requirements complete? <br>Are the requirements verifiable? <br>Are the requirements associated with valid scenarios?|
|Completeness| ☐ |Have all terms been defined?<br> Does the design meet all requirements? <br>Have all key design decisions been addressed and documented?|
|Accessibility (tenet)| ☐ |Features and scenarios work for users with impairments and assistive technology users. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Accessibility/_layouts/15/start.aspx) to get started.|
|Global readiness (tenet)| ☐ |A combination of GeoPolitical, World Readiness, and Crypto Disclosure, activity centers on ensuring that content poses minimal or no legal or business risk in any market as well as consideration for cultural information, keyboards, reading direction, payment options and address layouts. Visit the [GeoPol tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Geopolitical/_layouts/15/start.aspx) and [World Readiness site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/WorldReadiness/_layouts/15/start.aspx) for more information.|
|Protocols (tenet)| ☐ |Networking protocols are documented according to Microsoft and regulatory requirements. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Protocols/_layouts/15/start.aspx) to get started.|
|Privacy and online safety (tenet)| ☐ |Protects customer data from misuse, and ensures services and features are safe and secure. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Privacy/_layouts/15/start.aspx) to get started.|
|Security (tenet)| ☐ |Making Windows the most secure and privacy-protecting OS on the market. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Security/_layouts/15/start.aspx) to get started. Includes FIPS.|
|Manageability (tenet)| ☐ |Windows features must provide a complete and consistent management experience to System Administrators and IT Professionals. This is particularly important for the Enterprise and Education segments. Visit the [tenet site](http://aka.ms/wdgmanage) to get started.|
|[Application compatibility](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Compatibility/_layouts/15/start.aspx#/)| ☐ |This will become increasingly important under the continuous upgrade model. Upgrades from Windows 7 should also be supported to ensure compatibility.|
|[Performance and power usage](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Performance/_layouts/15/start.aspx#/)| ☐ |We cannot regress in areas (changes that have impact on global system wide performance/battery life in particular).|
|Health| ☐ |Are data, storage, and battery requirements discussed?|
|Functional testing| ☐ |Test Design and Approach, including what will and will not be automated, and any gaps in test coverage? <br>Any RI gating criteria? <br>Key technology decisions related to testing this feature described, include key alternatives considered? <br>Test architecture overview provided, including a discussion of Test Hooks or designed for testability where appropriate?|
|Interfaces and interactions| ☐ |Public API added/changed? <br>Internal API added/changed? <br>Format and protocol added/changed?|
|Regulatory compliance requirements for N and KN SKUs: private API usage (media-specific)| ☐ |Microsoft has a long-standing regulatory obligation to ship special editions of Windows Client for PCs in the EU and Korea. These editions of Windows (aka N and KN SKUs) must meet the following requirements: <br>1. Windows Media Player and the underlying media technologies (Media Foundation) are removed. The removed binaries can't call undocumented APIs in the OS. In addition, Korean SKUs (or KN SKU) need an edition of Windows with all inbox messenger apps removed. <br>2. OS features and Inbox apps must work as they would on a regular SKU or gracefully degrade if they have a dependency on media stack. They are expected to work after restoration of the removed media components through the user-installed Media Feature Package. <br>3. Do not promote the removed inbox media apps within the OS/by other inbox apps. Also, any modifications to the way media app defaults are handled need to be reviewed and signed off on.  <br>To comply with regulatory requirements for Windows, any Windows binary included in the Media Feature Package customers install to restore the functionalities excluded on regulatory Windows Desktop editions are required to NOT call undocumented APIs from other OS components or other Microsoft High Volume Products. The set of OS binaries in this package include Media, WPD, and Windows Media Player. For more details, visit the [OneNote page](https://microsoft.sharepoint.com/teams/osg_core_sigma/media/_layouts/OneNote.aspx?id=%2fteams%2fosg_core_sigma%2fmedia%2fShared%20Documents%2fOneNotes%2fMedia%27s%20non-Wiki&wd=target%28Common%20to%20Media%20Platform%20and%20Media%20Core.one%7c9FBE1898-6CC4-4613-A285-0A967446AAC6%2fAPI%20Usage%20Guidance%7c16122299-C9DD-4C22-8EF4-FC3F2ACC3DD1%2f%29). <br>Answer the following questions: <br>1. Is your feature adding a new Windows binary that implements audio/video playback functionality? ☐ <br>If the answer to question #1 is yes, proceed to question #3.<br> 2. Is your feature implemented in any of the binaries in the Media Feature Package file list? ☐ <br>If answer to question #2 is no, you're done and may proceed to the next section. Otherwise, proceed to question #3. <br>3. If your answer to question #1 OR question #2 is yes, does your feature design require call to any undocumented API in Windows? ☐ <br>Your response to question #3 must be "no" to comply with regulatory requirements. Otherwise, your feature is in violation of the regulatory requirements outlined above. You are required to review your feature for appropriate compliance resolution by sending a message for ***nskusup*** alias.|
|Perished data format| ☐ |If you have persisted data, do you discuss: data format, where it is stored, versioning plan, roaming strategy, Security/PII, migration strategy, backup strategy?|
|Breaking changes| ☐ |Any breaking changes, and what is done to guarantee a smooth upgrade experience (apps still work, settings preserved, and so on)?|
|Tool impact| ☐ |Any impact to tools?|
|Deployment and update| ☐ |Do you consider how your feature gets installed and configured by OEMs, as well as any implications it might have for servicing? For example, if your feature introduces a breaking change, you might need to write a migration plugin to seamlessly handle the transition when updating an existing device to a newer build. <br>Updatability? <br>Restorability?|
|Telemetry, Supportability and flighting| ☐ |Telemetry (leverage Data team and think broader in terms of what we can do with telemetry (such as more end to end scenario delight)? <br>Logging? <br>Debugging Extensions? <br>Feedback Pool—SUIF, and so on?|
|Componentization| ☐ |Packaging Decisions? <br>Binaries and binary dependencies? <br>Layering and other build concerns? <br>Product Differentiation and SKU? <br>Product-specific/OneCore concerns? <br>Processor-specific concerns? <br>Build and KIT concerns? <br>Update OS and Manufacturing OS? <br>Source code layout and depots?

## Open issues

>Guidance: Mark open issues in the body of this document using the Open Issue style.

## Cut behavior

1. Support for groups using the *ObjectId* parameter.
2. Support for non-AAD users using the *AdfsDomain* parameter. (How do we handle groups and service principles?)
3. Support for custom roles (future release if demand is high).

  The following parameter sets are for filtering the output of the **Get-RdsRoleAssignment** cmdlet by *SignInName* or *ServicePrincipalName*. This can be conisdered for future versions. Note that this can be achieved in v1 by piping the output into the **Where-Object** cmdlet. For example:

  ```PowerShell
  Get-RdsRoleAssignment -TenantName “mytenant” | Where-Object Where-Object {$_.SignInName -eq "clarkn@microsoft.com"
  ```

  **SignInName parameter sets (vFuture)**

  ```PowerShell
  Get-RdsRoleAssignment -SignInName <string> [-AadTenantId <string>]
  ```

  ```PowerShell
  Get-RdsRoleAssignment -SignInName <string> [-AadTenantId <string>] -TenantName <string>
  ```

  ```PowerShell
  Get-RdsRoleAssignment -SignInName <string> [-AadTenantId <string>] -TenantName <string> -HostPoolName <string>
  ```

  ```PowerShell
  Get-RdsRoleAssignment -SignInName <string> [-AadTenantId <string>] -TenantName <string> -HostPoolName <string> -AppGroupName <string>
  ```

  **ServicePrincipalName parameter sets (vFuture)**

  ```PowerShell
  Get-RdsRoleAssignment -ServicePrincipalName <String> [-AadTenantId <string>]
  ```

  ```PowerShell
  Get-RdsRoleAssignment -ServicePrincipalName <String> [-AadTenantId <string>] -TenantName <string>
  ```

  ```PowerShell
  Get-RdsRoleAssignment -ServicePrincipalName <String> [-AadTenantId <string>] -TenantName <string> -HostPoolName <string>
  ```

  ```PowerShell
  Get-RdsRoleAssignment -ServicePrincipalName <String> [-AadTenantId <string>] -TenantName <string> -HostPoolName <string> -AppGroupName <string>
  ```

  VFuture: The subject of the assignment may be specified to filter the output. To specify a user, use *SignInName* or *Azure AD ObjectId* parameters. To specify a security group, use the *Azure AD ObjectId* parameter. To specify an Azure AD application, use the *ServicePrincipalName* or *ObjectId* parameters.

4. RDS Creator (simplified to just RDS Tenant Creator).
5. RDS AppGroup Creator (Can be done by pre-creating an AppGroup, assigning user Owner of the AppGroup and then assigning user as Reader of HostPool).
6. Removed *AadTenantId* from these cmdlets to simplify them. This means we only support UPNs and *ServicePrincipalNames* from home AAD tenants. If we decide in the future to add *AadTenantId* back in to support non-home AAD tenants, then we’ll also need to add *AadTenantId* to the **Set-RdsContext** cmdlet.

  >[!NOTE]
  >Non-home UPNs means that the admin1@hsp1.net.com UPN could be added to say the isv1.com AAD tenant is a guest.