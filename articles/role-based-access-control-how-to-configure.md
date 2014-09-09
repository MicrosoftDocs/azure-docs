<properties title="Role Based Access Control in Azure Preview Portal" pageTitle="Role Based Access Control in Azure Preview Portal" description="Describes how role based access control works and how to set it up" metaKeywords="" services="multiple" solutions="" documentationCenter="" authors="justinha" videoId="" scriptId="" />

<tags ms.service="multiple" ms.devlang="dotnet" ms.topic="article" ms.tgt_pltfrm="Ibiza" ms.workload="infrastructure-services" ms.date="09/12/2014" ms.author="justinha;Justinha@microsoft.com" />

<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section (above): this is required in all topics. Please fill it out!-->

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Role Based Access Control In Azure Preview Portal 

<p> The first set of features for role based access control (RBAC) for Azure resources is now available for preview. This <a href="http://go.microsoft.com/fwlink/?LinkId=511576" target="_blank">blog post</a> provides a good introduction to RBAC and how to use it to manage access to Azure resources, and this topic explains it in more detail.

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

##Table of Contents##

* [What is role based access control in Azure?](#whatisrbac) 
* [Managing access in both Azure Preview Portal and the full Azure portal](#manageaccess)
* [How to add and remove access](#addremoveaccess)
* [How to provide feedback](#feedback)
* [Q&A](#q&a)
* [Next steps](#next)

> [WACOM.NOTE] This article uses the Azure Preview portal. The [Preview portal](https://portal.azure.com) provides access to new features and experiences on the Azure platform, and is required when using steps and information provided in this article. If you are not currently logged in to your Azure subscription, you will be prompted to log in when you visit the [Preview portal](https://portal.azure.com). 

<h2><a id="whatisrbac"></a>What is role based access control in Azure?</h2>

The general model for configuring role based access involves adding a user or group to a role that defines the level of access to a particular resource.

### Adding users and groups
You can assign access to users or security groups from the directory that your subscription is associated with:

+ Users 

	You can add an individual user from the directory that your subscription is associated with, or add an external user who has a Microsoft account. A Guest account gets created to represent any external user that you add. 
+ Groups

	Groups are often a better way to grant access. For example, you can add a group representing a dev team to the Owner role of a database, and the dev team manager can manage access by adding and removing group members. The groups can be created in Azure AD or synchronized from an on-premises directory. 

	The ability to add groups lets an organization extend its existing access control model from its on-premises directory to the cloud, so security groups that are already established in order to control access on-premises can be re-used to control access to similar resources in the Azure Preview Portal. For more information about different options for synchronizing users and groups from an on-premises directory, see [Directory integration](http://msdn.microsoft.com/library/azure/jj573653.aspx). 

	Azure AD Premium also offers a [self-service group management](http://msdn.microsoft.com/library/azure/dn641267.aspx) feature where the ability to create and manage groups can be delegated to individual users from Azure AD. But even if you don’t have self-service group management, you can still create groups and assign access to them using any version of Azure AD.

### Assigning roles
There is a built-in set of roles that you can use to grant access to users and groups. Each role defines a set of actions that a person who holds that role can perform on a particular resource. The set of actions can vary from read-only access to full control. This allows access to be granted in closer accordance with the [principle of least privilege](http://en.wikipedia.org/wiki/Principle_of_least_privilege), where users have access that they need but not more than that.

+ The reader role has read permissions only. A reader cannot create, update, or delete any resources. A reader also cannot read keys. But a reader can read all of the properties of a resource.
+ The contributor role has full management control over all the resources. A contributor can create, delete, and update resources. But a contributor cannot add or remove role assignments.
+ The owner role has full control over the resource that it's assigned to, including the ability to manage resource access by adding or removing role assignments.

![][1]

### Choosing which resources can be accessed

You control the scope of access by choosing the resources that a role can access. For example, you can assign a user or group to a role at the subscription level, resource group level, or on an individual resource. This lets you assign different levels of access for different scopes of a solution. 

Resources inherit access permissions from parent resources. For example, if you assign a group to the Owner role for a subscription, the group members have full control over all resource groups that are part of that subscription, and all of the resources within those resource groups. 

This gives you more flexibility to manage access based on the scope of your solution. If one team member only needs read access to a specific resource while other team members need full control, you can grant that access precisely without granting other unnecessary access rights. 

<h2><a id="manageaccess"></a>Managing access in both Azure Preview Portal and the full Azure portal</h2> 

You can start using role based access to manage resources in the Azure Preview Portal without making any changes to the way users currently access Azure resources today in the full Azure portal. The [administrators](http://msdn.microsoft.com/en-us/library/azure/hh531793.aspx#BKMK_AdminRoles) from the full Azure portal still exist and they still have the same access to the full Azure portal as always. Access between each portal will coexist this way:

+ To help you move from using the access model in the full Azure portal to the new role based access model, all admins from the subscription for the full Azure portal are automatically assigned to the Owner role of the same subscription so they can continue to have full control to resources in the Azure Preview Portal. This includes the Service Admin and co-administrators. 
+ Changes that you make to any subscription admin role in the full Azure portal are reflected in the Owner role for the subscription in the Azure Preview Portal. But changes that you make to the Owner role are not reflected in the full Azure portal. 

	So if you add a user to the co-administrator role in the full Azure portal, that user will have full control of resources in either portal. But assignment to a role in the Azure Preview Portal does not grant any access to resources in the full Azure portal.

This diagram shows how access works for each portal:

![][2]

### When to make a user a co-admin vs adding the user to an RBAC role

For production services, continue to manage access by adding co-administrators to your subscriptions while Azure Preview Portal remains in preview so those admins have access to both the full portal and preview portal. 

For testing and other non-production services, use role based access control when you can meet your test scenario requirements entirely by using resources in the Azure Preview Portal. As of September 2014, resources that can be managed by using role based access include App Insights, Cache, DocDB, VMs, Storage, Network, MySQL, Search, SQL, and Websites. Service Bus and Cloud Services are examples of resources that today cannot be managed by using role based access. 

<h2><a id="addremoveaccess"></a>How to add and remove access</h2>

Let’s take a look at how an organization can manage access. They have multiple people working on a variety of test and production projects that are built using Azure resources. They want to follow best practices for granting access. Users should have access to all resources that they need, but no additional access. They want to re-use all the investments they have made in processes and tooling to use Active Directory security groups on-premises. These sections cover how they set up access control:

+ [Add access]
+ [Remove access]
+ [Add or remove access for external user (UI only)]

### Add access
Here is a summary of access requirements for the organization and how they are set up in Azure.

User/Group  | Access requirement  | role and scope for access	
------------- | -------------  | ------------
All of Ellen Adams’ team  | Read all Azure resources  | Add the AD group that represents Ellen Adams’ team to Reader role for the Azure subscription
All of Ellen Adams’ team  | Create and manage all resources in the Test resource group  | Add the AD group that represents Ellen Adams’ team to Contributor role for the Test resource group
Tony  | Create and manage all resources in the Prod resource group  | Add Tony to Contributor role for the Prod resource group

Note: If you don’t have a resource group, you can create one when you create a new resource.

First, let’s add Read access for all resources of the subscription. Click **Browse -> Everything -> Subscriptions**.

![][3] 

Click *name of your subscription* **-> Reader -> Add** and type the name of the Active Directory group.

![][4]

Then add the same team to the Contributor role of the Test resource group. Click the resource group to open its property blade. Under **Roles**, click **Contributor -> Add** and type the name of the team.

![][5]

To add Tony to the Contributor role of the Prod resource group, click the resource group click **Contributor -> Add** and type Tony’s name. 

![][6]

Role assignments can also be managed by using the Microsoft Azure module for Windows PowerShell. Here is an example of adding Tony's account by using the New-AzureRoleAssignment cmdlet rather than the portal:

	PS C:\> New-AzureRoleAssignment -Mail tonyw@vipswapper.com -RoleDefinitionName Contributor -ResourceGroupName ProdDB

For more information about using Windows PowerShell to add and remove access, see Managing Role-Based Access Control with Windows PowerShell. 


### Remove access

You can also remove assignments easily. Let’s say you want to remove a user named Brad Adams from the Reader role for a resource group named TestDB. Open the resource group blade, click **Reader -> Brad Adams -> Remove**.

![][7]

Here is an example of how to remove Brad Adams by using the Remove-AzureRoleAssignment cmdlet:

	PS C:\> Remove-AzureRoleAssignment -Mail badams@dushyantgill.net -RoleDefinitionName Reader -ResourceGroupName TestDB


### Add or remove access for external user (UI only)

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in the UI (there is no Windows PowerShell or API method) in the full Azure portal by a directory global administrator. 

![][8]

Let’s step through the process to add access for an external user. We’ll add an external user to the same Reader ole for TestDB resource group so that user can help debug an error. Open the resource group blade, click **Reader -> Add -> Invite** and type the email address of the user you want to add. 

![][9]

The first time you add an external user, a Guest user account is created. Thereafter you can add or remove that guest account to a group, or you can  add or remove it individually from a role similarly to any other directory users.   

<h2><a id="feedback"></a>How to provide feedback</h2>

Please try Azure RBAC and send us [feedback](http://feedback.azure.com/forums/34192--general-feedback). 

<h2><a id="q&a"></a>Q&A</h2>

**Q:** How can I use organizational accounts with Azure?

**A:** If your work or school organization has signed up for Azure, you should sign in using your work or school email. Organizational accounts are preferred for sign in to Azure over Microsoft accounts because the accounts can be managed in better ways. If your organization has not yet signed up, you can sign up [here](https://account.windowsazure.com/organization).

**Q:** Are there any limits to how many users or groups I can add to a role?

**A:** There are two limits to be aware of:

+ The number of role assignments. You can add up to 100 on any resource, and up to 300 in the entire subscription. For example, you could make 100 role assignments on a database, plus another 100 assignments on the resource groups that contains the database, plus another 1000 assignments on the subscription that includes the resource group, for a total of 300 assignments.
+ The total number of groups that can be added. You can add up to 1000 security groups to all of the roles combined under a single subscription.

**Q:** What resources can be managed by using role-based access? 

**A:** As of September 2014, App Insights, Cache, DocDB, VMs, Storage, Network, MySQL, Search, SQL, and Websites can all be managed by using role-based access.

<h2><a id="next"></a>Next steps</h2>

[Cross-platform CLI configuration for role based access control]: ../xplt-cli-rbac/


Aenean sit amet leo nec purus placerat fermentum ac gravida odio. Aenean tellus lectus, faucibus in rhoncus in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque. <a href="http://msdn.microsoft.com/library/azure" target="_blank">Link text for link outside of azure.microsoft.com</a>. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris.

> [WACOM.NOTE] Indented note text.  The word 'note' will be added during publication. Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus.

1. Aenean sit amet leo nec **Purus** placerat fermentum ac gravida odio. 

2. Aenean tellus lectus, faucibus in **Rhoncus** in, faucibus sed urna. Suspendisse volutpat mi id purus ultrices iaculis nec non neque.
 
  	![][5]

3. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Sed dolor dui, condimentum et varius a, vehicula at nisl. 

  	![][6]


Suspendisse volutpat mi id purus ultrices iaculis nec non neque. Nullam dictum dolor at aliquam pharetra. Vivamus ac hendrerit mauris. Otrus informatus: [Link 1 to another azure.microsoft.com documentation topic]



Ut eu pretium lacus. Nullam purus est, iaculis sed est vel, euismod vehicula odio.   

1. Curabitur lacinia, erat tristique iaculis rutrum, erat sem sodales nisi, eu condimentum turpis nisi a purus. 

        - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:
        (NSDictionary *)launchOptions
        {
            // Register for remote notifications
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes:
            UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
            return YES;
        }   	 

2. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia. 

   	    // Because toast alerts don't work when the app is running, the app handles them.
        // This uses the userInfo in the payload to display a UIAlertView.
        - (void)application:(UIApplication *)application didReceiveRemoteNotification:
        (NSDictionary *)userInfo {
            NSLog(@"%@", userInfo);
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
            [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle:
            @"OK" otherButtonTitles:nil, nil];
            [alert show];
        }


    > [WACOM.NOTE] Duis sed diam non <i>nisl molestie</i> pharetra eget a est. [Link 2 to another azure.microsoft.com documentation topic]


Quisque commodo eros vel lectus euismod auctor eget sit amet leo. Proin faucibus suscipit tellus dignissim ultrices.


 
1. Maecenas sed condimentum nisi. Suspendisse potenti. 

  + Fusce
  + Malesuada
  + Sem

2. Nullam in massa eu tellus tempus hendrerit.

  	![][7]

3. Quisque felis enim, fermentum ut aliquam nec, pellentesque pulvinar magna.

 


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## How to provide feedback

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

## Q&A





<!--Image references-->
[1]: ./media/role-based-access-control-how-to-configure/RBACRoles.png
[2]: ./media/role-based-access-control-how-to-configure/RBACMapToSubAdmins.png
[3]: ./media/role-based-access-control-how-to-configure/RBACSubscriptionBlade.png
[4]: ./media/role-based-access-control-how-to-configure/RBACAddSubReader.png
[5]: ./media/role-based-access-control-how-to-configure/RBACAddRGContributor.png
[6]: ./media/role-based-access-control-how-to-configure/RBACAddProdContributor.png
[7]: ./media/role-based-access-control-how-to-configure/RBACRemoveRole.png
[8]: ./media/role-based-access-control-how-to-configure/RBACGuestAccessControls.png
[9]: ./media/role-based-access-control-how-to-configure/RBACInviteExtUser.png

<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
