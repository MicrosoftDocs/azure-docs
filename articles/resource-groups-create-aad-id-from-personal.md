<properties
   pageTitle="Creating a Work or School identity in Azure Active Directory"
   description="Describes how to create a work or school identity from your personal identity to use with resource group templates or role-based access, among other features."
   services="virtual-machines"
   documentationCenter=""
   authors="squillace"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure"
   ms.date="05/4/2015"
   ms.author="rasquill"/>

# Creating a Work or School identity in Azure Active Directory

If you created a personal Azure account or have a personal MSDN subscription and created the Azure account to take advantage of the MSDN Azure credits -- you used a **Microsoft account** identity to create it. Many great features of Azure -- [resource group templates](resource-group-overview.md) and [role-based access](resource-group-rbac.md) are two examples -- require a work or school account (an identity managed by Azure Active Directory) to work. 

Fortunately, one of the best things about your personal Azure account is that it comes with a default Azure Active Directory domain you may not know about, but you can use it to create a new work or school account that you can use with Azure features that require it.

> [AZURE.NOTE] If you were given a username and password by an administrator, there's a good chance that you already have an work or school ID (also called an organizational ID). If so, you can immediately begin to use your Azure account to access Azure resources that require one. If you find that you cannot use those resources, you may need to return to this topic.


## Locate your default directory in the Azure Portal

Start by logging into the [Azure portal](https://manage.windowsazure.com) using your personal Microsoft account identity. Once you are logged in, scroll down the blue panel on the left side and click **ACTIVE DIRECTORY**.

![Azure Active Directory](./media/resource-groups-create-aad-id-from-personal/azureactivedirectorywidget.png)

Let's start by finding some information about your identity in Azure. You should see something like the following in the main pane, showing that you have one default directory. 
![](./media/resource-groups-create-aad-id-from-personal/defaultaadlisting.png)

Let's find out some more information. Click the default directory row, which brings you into the default directory properties.  

![](./media/resource-groups-create-aad-id-from-personal/defaultdirectorypage.png)

Great. Let's see what our "default" domain is... click **DOMAINS**.

![](./media/resource-groups-create-aad-id-from-personal/domainclicktoseeyourdefaultdomain.png)

Here you should be able to see that when the Azure account was created, Azure Active Directory created a personal default domain that is a hash of your personal id used as a subdomain of **onmicrosoft.com**. This is very useful, because that's the domain to which you will add a new user now.

## Creating a new user in the default domain

Click **USERS** and look for your single personal account there. You should see in the **SOURCED FROM** column that it is a `Microsoft account`. We want to create a user in your default **.onmicrosoft.com** Azure Active Directory. 

![](./media/resource-groups-create-aad-id-from-personal/defaultdirectoryuserslisting.png)

We're going to follow [these instructions](https://technet.microsoft.com/en-us/library/hh967632.aspx#BKMK_1) in the next few steps, but using a specific example.
At the bottom of the page, click **+ADD USER**. In the dialog that appears, type the new user name, and make the **Type of User** a **New user in your organization**.

![](./media/resource-groups-create-aad-id-from-personal/addingauserwithdirectorydropdown.png)

![](./media/resource-groups-create-aad-id-from-personal/userprofileuseradmin.png)

![](./media/resource-groups-create-aad-id-from-personal/gettemporarypasswordforuser.png)

![](./media/resource-groups-create-aad-id-from-personal/receivedtemporarypassworddialog.png)

![](./media/resource-groups-create-aad-id-from-personal/defaultdirectoryusersaftercreate.png)

![](./media/resource-groups-create-aad-id-from-personal/emailreceivedfromnewusercreation.png)

![](./media/resource-groups-create-aad-id-from-personal/addingnewuserascoadmin.png)

![](./media/resource-groups-create-aad-id-from-personal/newuseraddedascoadministrator.png)

![](./media/resource-groups-create-aad-id-from-personal/thesettingswidget.png)

![](./media/resource-groups-create-aad-id-from-personal/signinginwithnewuser.png)

![](./media/resource-groups-create-aad-id-from-personal/mustupdateyourpassword.png)

![](./media/resource-groups-create-aad-id-from-personal/successtourdialog.png)



## Logging in and changing the new user's password

Now you can go have fun. For example, you can now use your new Azure Active Directory identity to use Azure resource group templates.

     azure login
    info:    Executing command login
    warn:    Please note that currently you can login only via Microsoft organizational account or service principal. For instructions on how to set them up, please read http://aka.ms/Dhf67j.
    Username: ahmet@aztrainpass02735outlook.onmicrosoft.com
    Password: *********
    /info:    Added subscription Azure Pass                                        
    info:    Setting subscription Azure Pass as default
    +
    info:    login command OK
    ralph@local:~$ azure config mode arm
    info:    New mode is arm
    ralph@local:~$ azure group list
    info:    Executing command group list
    + Listing resource groups                                                      
    info:    No matched resource groups were found
    info:    group list command OK
    ralph@local:~$ azure group create newgroup westus
    info:    Executing command group create
    + Getting resource group newgroup                                              
    + Creating resource group newgroup                                             
    info:    Created resource group newgroup
    data:    Id:                  /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/newgroup
    data:    Name:                newgroup
    data:    Location:            westus
    data:    Provisioning State:  Succeeded
    data:    Tags: 
    data:    
    info:    group create command OK


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
