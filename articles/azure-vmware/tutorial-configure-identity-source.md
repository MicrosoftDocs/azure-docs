---
title: Tutorial - Configure external identity source
description:  Learn how to configure Active Directory over LDAP or LDAPS for vCenter as an external identity source.
ms.topic: tutorial 
ms.date: 07/30/2021

#Customer intent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Configure external identity source 


[!INCLUDE [vcenter-access-identity-description](includes/vcenter-access-identity-description.md)]



In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial



## Prerequisites

- Establish connectivity from your on-premises network to your private cloud.

- If you have AD with SSL, download the certificate for AD authentication and upload to an Azure storage account as a blob storage.  You must [grant access to Azure Storage resources using shared access signature (SAS)](../storage/common/storage-sas-overview.md). 

- If you use FQDN, enable DNS resolution on your on-premises AD.

 

## List external identity

You'll run the `Get-ExternalIdentitySources` cmdlet to list all external identity sources already integrated with vCenter SSO.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Get-ExternalIdentitySources**.

   :::image type="content" source="media/run-command/run-command-overview.png" alt-text="Screenshot showing " lightbox="media/run-command/run-command-overview.png":::

1. Provided the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-external-identity-sources.png" alt-text="Screenshot  ":::
   
   | Field | Value |
   | --- | --- |
   | Retain up to  | Job retention period. The cmdlet output will be stored for these many days. Default value is 60.  |
   | Specify name for execution  | A mandatory field, the job can be given a name. This can be alphanumeric.  |
   | Timeout  | The period after which a cmdlet will exit if a certain task is taking too long to finish.  |

1. Check **Notifications** to see the progress.


## Add Active Directory over LDAP

You'll run the `New-AvsLDAPIdentitySource` cmdlet to add AD over LDAP as an external identity source to use with SSO into vCenter 

1. Select **Run command** > **Packages** > **New-AvsLDAPIdentitySource**.

1. Provided the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-new-ldap-identity-sources.png" alt-text="Screenshot  ":::
   
   | Field | Value |
   | --- | --- |
   | Name  | User-friendly name of the external identity source. For example, **avslap.local**.  |
   | DomainName  | Domain name of the external identity source. For example,   |
   | DomainAlias  | Domain alias of the external identity source. For example,     |
   | PrimaryUrl  | Primary URL of the external identity source. For example, **ldap://yourserver:389**.  |
   | SecondaryURL  | Secondary fall-back URL in case of primary failure.  |
   | BaseDNUsers  |  Where to look for valid users. For example, **CN=users,DC=yourserver,DC=internal**.  Base DN is needed to use LDAP Authentication.  |
   | BaseDNGroups  | Where to look for groups. For example, **CN=group1, DC=yourserver,DC= internal**. Base DN is needed to use LDAP Authentication.  |
   | Credential  | The username and password used for authentication with the AD source (not cloudadmin).  |
   | GroupName  | Group to give cloud admin access in your external identity source.  For example, **avs-admins**.  |
   | Retain up to  | Job retention period. The cmdlet output is stored for the number of days defined. Default value is 60.  |
   | Spcify name for execution  | Name of the task to execute. For example, ***addexternalIdentity**.  |
   | Timeout  | The time in which the cmdlet exits if a certain task takes too long to finish.  |

1. Check **Notifications** to see the progress.



## Add Active Directory over LDAP with SSL

You'll run the `New-AvsLDAPIdentitySource` cmdlet to add an AD over LDAP with SSL as an external identity source to use with SSO into vCenter. 



1. Make sure you've downloaded the certificate for AD authentication and upload to storage account as a blob storage. 

   

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->





## Add existing AD group to cloudadmin group

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->





## Remove AD group from the cloudadmin role

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->





## Remove existing external identity sources

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->




<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button]()

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->