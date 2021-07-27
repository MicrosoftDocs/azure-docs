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

- If you have AD with SSL, download the certificate for AD authentication and upload to storage account as a blob storage.

- If you use FQDN, enable DNS resolution on your on-premises AD.

 

## List external identity

You'll run the `Get-ExternalIdentitySources** cmdlet to list all external identity sources already integrated with vCenter SSO.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Run command** > **Packages** > **Get-ExternalIdentitySources**.

   :::image type="content" source="media/run-command/run-command-overview.png" alt-text="Screenshot showing ":::

1. Provided the required values or change the default values, and then select **Run**.

   :::image type="content" source="media/run-command/run-command-get-external-identity-sources.png" alt-text="Screenshot  ":::
   
   | Field | Value |
   | --- | --- |
   | Retain up to  | Job retention period. The cmdlet output will be stored for these many days. Default value is 60.  |
   | Specify name for execution  | A mandatory field, the job can be given a name. This can be alphanumeric.  |
   | Timeout  | The period after which a cmdlet will exit if a certain task is taking too long to finish.  |

1. Check **Notifications** to see the progress.


## Add Active Directory over LDAP

<!-- Introduction paragraph -->

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->




## Add Active Directory over LDAP with SSL

<!-- Introduction paragraph -->
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