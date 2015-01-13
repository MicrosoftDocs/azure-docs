<properties title="" pageTitle="Role Based Access Control in Azure Preview Portal" description="Describes how role based access control works and how to set it up" metaKeywords="" services="" solutions="" documentationCenter="" authors="Justinha" videoId="" scriptId="" manager="terrylan" editor=""/>

<tags ms.service="multiple" ms.devlang="dotnet" ms.topic="article" ms.tgt_pltfrm="Ibiza" ms.workload="infrastructure-services" ms.date="09/12/2014" ms.author="justinha" />

<!--This is a basic template that shows you how to use mark down to create a topic that includes a TOC, sections with subheadings, links to other azure.microsoft.com topics, links to other sites, bold text, italic text, numbered and bulleted lists, code snippets, and images. For fancier markdown, find a published topic and copy the markdown or HTML you want. For more details about using markdown, see http://sharepoint/sites/azurecontentguidance/wiki/Pages/Content%20Guidance%20Wiki%20Home.aspx.-->

<!--Properties section (above): this is required in all topics. Please fill it out!-->

<!--The next line, with one pound sign at the beginning, is the page title--> 
# Role-based access control in Azure Preview portal 

<p> We’ve added support for role-based access control (RBAC) in the Azure Preview portal to help organizations meet their access management requirements simply and precisely. The <a href="http://go.microsoft.com/fwlink/?LinkId=511576" target="_blank">blog post</a> will give you a quick introduction of the feature and get you started. This topic describes the concepts in detail and covers additional use cases. 

<!--Table of contents for topic, the words in brackets must match the heading wording exactly-->

##Table of Contents##

* [RBAC in Azure](#whatisrbac) 
* [Co-existence of RBAC with subscription co-admins](#coexist)
* [Authorization for management versus data operations](#authmgmt)
* [How to add and remove access](#addremoveaccess)
* [Known issues when using role-based access control](#knownissues)
* [How to provide feedback](#feedback)
* [Next steps](#next)

<h2><a id="whatisrbac"></a>RBAC in Azure</h2>
                                                                   
Every Azure subscription is associated with an Azure Active Directory. Users and services that access resources of the subscription using Azure Management portal or Azure Resource Manager API first need to authenticate with that Azure Active Directory.

![][1] 

Azure role-based access control allows you to grant appropriate access to Azure AD users, groups, and services, by assigning roles to them on a subscription or resource group or individual resource level. The assigned role defines the level of access that the users, groups, or services have on the Azure resource. 

### Role

A role is a collection of actions that can be performed on Azure resources. A user or a service is allowed to perform an action on an Azure resource if they have been assigned a role that contains that action.

#### Built-in Roles

At the first preview, Azure role-based access control comes with three built-in roles that can be assigned to users, groups, and services.

+ **Owner**: has full control over Azure resources. Owner can perform all management operations on a resource including access management. 
+ **Contributor**: can perform all management operations except access management. So, a contributor can’t grant access to others.
+ **Reader**: can only view resources. Reader can’t view secrets associated with a resource. 

You can’t modify the definition of built-in roles. In an upcoming release of Azure RBAC, you will be able to define custom roles by composing a set of actions from a list of available ones that can be performed on Azure resources.

#### Actions and non-actions

The **actions** property of the role definition specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **not actions** property of the role definition specifies the actions that must be excluded from the allowed actions. 

**Built-In Role**  | Actions  | Not Actions	
------------- | -------------  | ------------
Owner (allow all actions)  | *  | 
Contributor (allow all actions except writing or deleting role assignments)  | *  | Microsoft.Authorization/ * /Write, Microsoft.Authorization/ * /Delete
Reader (allow all read actions)  | */Read  | 

### Role Assignment

Access is granted to Azure AD users and services by assigning the appropriate role to them on an Azure resource. 

#### Azure AD Security Principals

Roles can be assigned to the following types of Azure AD security principals:

+ **Users**: roles can be assigned to organizational users that are in the Azure AD with which the Azure subscription is associated. Roles can also be assigned to external Microsoft account users (such as joe@outlook.com) by using the Invite action to assign the user to a role in the Azure Preview portal. Assigning a role to an external Microsoft account user causes a guest account to be created in the Azure AD for it. If this guest account is disabled in the directory, the external user won’t be allowed to access any Azure resource that the user has been granted access to.
+ **Groups**: roles can be assigned to Azure AD security groups. A user is automatically granted access to a resource if the user becomes a member of a group that has access. The user also automatically loses access to the resource after getting removed from the group. Managing access via groups by assigning roles to groups and adding users to those groups is the best practice, instead of assigning roles directly to users. Azure RBAC does not allow assigning roles to distribution lists.
	The ability to assign roles to groups lets an organization extend its existing access control model from its on-premises directory to the cloud, so security groups that are already established to control access on-premises can be re-used to control access to resources in the Azure Preview portal. For more information about different options for synchronizing users and groups from an on-premises directory, see [Directory integration](http://technet.microsoft.com/library/jj573653.aspx). Azure AD Premium also offers a [delegated group management feature](http://msdn.microsoft.com/library/azure/dn641267.aspx) with which the ability to create and manage groups can be delegated to non-administrator users from Azure AD.
+ **Service principals**: service identities are represented as service principals in the directory. They authenticate with Azure AD and securely communicate with one another. Services can be granted access to Azure resources by assigning roles via the Azure module for Windows PowerShell to the Azure AD service principal representing that service. 

#### Resource scope

Access does not need to be granted to the entire subscription. Roles can also be assigned for resource groups as well as for individual resources. In Azure RBAC, a resource inherits role assignments from its parent resources. So if a user, group, or service is granted access to only a resource group within a subscription, they will be able to access only that resource group and resources within it, and not the other resources groups within the subscription. As another example, a security group can be added to the Reader role for a resource group, but be added to the Contributor role for a database within that resource group.

![][2]

<h2><a id="coexist"></a>Co-existence of RBAC with subscription co-admininistrators</h2>

Subscription administrator and co-admins will continue to have full access to the Azure portals and management APIs. In the RBAC model, they are assigned the Owner role at the subscription level.  
However, the new RBAC model is supported only by the Azure Preview portal and Azure Resource Manager APIs. Users and services that are assigned RBAC roles cannot access the Azure Management portal and the Service Management APIs. Adding a user to the Owner role of a subscription in the Azure Preview portal does not make that user a co-administrator of the subscription in the full Azure portal.

If you wish to grant access to a user to an Azure Resource that isn’t yet available to be managed via the Azure Preview portal, you should add them to the subscription co-administrators using the full Azure Management portal. Service Bus and Cloud Services are examples of resources that today cannot be managed by using RBAC.

<h2><a id="authmgmt"></a>Authorization for management versus data operations</h2>

Role-based access control is supported only for management operations of the Azure resources in Azure Preview portal and Azure Resource Manager APIs. Not all data level operations for Azure resources can be authorized via RBAC. For instance, create/read/update/delete of Storage Accounts can be controlled via RBAC, but create/read/update/delete of blobs or tables within the Storage Account cannot yet be controlled via RBAC. Similarly, create/read/update/delete of a SQL DB can be controlled via RBAC but create/read/update/delete of SQL tables within the DB cannot yet be controlled via RBAC.

<h2><a id="addremoveaccess"></a>How to add and remove access</h2>

Let’s take a look at an example of how a resource owner in an organization can manage access. In this scenario, you have multiple people working on a variety of test and production projects that are built using Azure resources. You want to follow best practices for granting access. Users should have access to all resources that they need, but no additional access. You want to re-use all the investments you have made in processes and tooling to use security groups that are mastered in an on-premises Active Directory. These sections cover how you set up access to these resources:

* [Add access](#add)
* [Remove access](#remove)
* [Add or remove access for external user](#addremoveext)

<h3><a id="add"></a>Add access</h3>

Here is a summary of the access requirements and how they are set up in Azure.

User/Group  | Access requirement  | role and scope for access	
------------- | -------------  | ------------
All of Jill Santos’ team  | Read all Azure resources  | Add the AD group that represents Jill Santos’ team to Reader role for the Azure subscription
All of Jill Santos’ team  | Create and manage all resources in the Test resource group  | Add the AD group that represents Jill Santos’ team to Contributor role for the Test resource group
Brock  | Create and manage all resources in the Prod resource group  | Add Brock to Contributor role for the Prod resource group


First, let’s add Read access for all resources of the subscription. Click **Browse > Everything > Subscriptions**.

![][3] 

Click *name of your subscription* ** > Reader > Add**. From the list of users and groups, select or type the name of the Active Directory group.

![][4]

Then add the same team to the Contributor role of the Test resource group. Click the resource group to open its property blade. Under **Roles**, click **Contributor > Add** and type the name of the team.

![][5]

To add Brock to the Contributor role of the Prod resource group, click the resource group click **Contributor > Add** and type Brock’s name. 

![][6]

Role assignments can also be managed by using the Microsoft Azure module for Windows PowerShell. Here is an example of adding Brock's account by using the New-AzureRoleAssignment cmdlet rather than the portal:

	PS C:\> New-AzureRoleAssignment -Mail brockh@contoso.com -RoleDefinitionName Contributor -ResourceGroupName ProdDB

For more information about using Windows PowerShell to add and remove access, see [Managing role-based access control with Windows PowerShell](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-powershell/). 

<h3><a id="remove"></a>Remove access</h3>

You can also remove assignments easily. Let’s say you want to remove a user named Brad Adams from the Reader role for a resource group named TestDB. Open the resource group blade, click **Reader > Brad Adams > Remove**.

![][7]

Here is an example of how to remove Brad Adams by using the Remove-AzureRoleAssignment cmdlet:

	PS C:\> Remove-AzureRoleAssignment -Mail badams@contoso.com -RoleDefinitionName Reader -ResourceGroupName TestDB

<h3><a id="addremoveext"></a>Add or remove access for external user</h3>

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in the UI (there is no Windows PowerShell or API method) in the full Azure portal by a directory global administrator. 
To open the **Configure** tab in the full Azure portal, click **Active Directory**, and then click the name of the directory.

![][10]

Then you can edit the options to control access for external users. 

![][8]

By default, guests cannot enumerate the contents of the directory, so they do not see any users or groups in the **Member List**. They can search for a user by typing the user's full email address, and then grant access. The set of default restrictions for guests are:

- They cannot enumerate users and groups in the directory.
- They can see limited details of a user if they know the user's email address.
- They can see limited details of a group when they know the group name.

The ability for guests to see limited details of a user or group allows them to invite other people and see some details of people with whom they are collaborating.  

Let’s step through the process to add access for an external user. We’ll add an external user to the same Reader role for TestDB resource group so that user can help debug an error. Open the resource group blade, click **Reader > Add > Invite** and type the email address of the user you want to add. 

![][9]

When you add an external user, a guest is created in the directory. Thereafter, that guest can be added to a group or removed from a group, or you can add or remove it individually from a role just like you would for any other directory users. 

You can also remove a guest from any role, just as you would remove any user. Removing the guest from a role on a resource does not remove the guest from the directory. 
 
<h2><a id="knownissues"></a>Known issues when using role-based access control</h2>

If you encounter a problem when you use role based access control feature while it is in preview, see [Troubleshooting role-based access control](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-troubleshooting/) for any known issues that may be related to the problem.


<h2><a id="feedback"></a>How to provide feedback</h2>

Please try Azure RBAC and send us [feedback](http://aka.ms/azurerbacfeedback). 


<h2><a id="next"></a>Next steps</h2>

Here are some additional resources to help you use role-based access control: 

+ [Managing role-based access control with Windows PowerShell](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-powershell/)
+ [Managing role-based access control with XPLAT CLI](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-xplat-cli/)
+ [Troubleshooting role-based access control](http://azure.microsoft.com/en-us/documentation/articles/role-based-access-control-troubleshooting/)
+ [Azure Active Directory](http://msdn.microsoft.com/library/azure/jj673460.aspx)
+ [Azure Active Directory Premium and Basic](http://msdn.microsoft.com/en-us/library/azure/dn532272.aspx)
+ [How Azure subscriptions are associated with Azure AD](http://msdn.microsoft.com/en-us/library/azure/dn629581.aspx)
+ For an introduction to self-service group management for security groups, see the [Active Directory Team Blog](http://blogs.technet.com/b/ad/archive/2014/02/24/more-preview-enhancements-for-windows-azure-ad-premium.aspx)



<!--Image references-->
[1]: ./media/role-based-access-control-configure/RBACSubAuthDir.png
[2]: ./media/role-based-access-control-configure/RBACAssignmentScopes.png
[3]: ./media/role-based-access-control-configure/RBACSubscriptionBlade.png
[4]: ./media/role-based-access-control-configure/RBACAddSubReader_NEW.png
[5]: ./media/role-based-access-control-configure/RBACAddRGContributor_NEW.png
[6]: ./media/role-based-access-control-configure/RBACAddProdContributor_NEW.png
[7]: ./media/role-based-access-control-configure/RBACRemoveRole.png
[8]: ./media/role-based-access-control-configure/RBACGuestAccessControls.png
[9]: ./media/role-based-access-control-configure/RBACInviteExtUser_NEW.png
[10]: ./media/role-based-access-control-configure/RBACDirConfigTab.png


