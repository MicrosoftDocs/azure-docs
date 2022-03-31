---
title: User Management
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# User Management

Nutanix Clusters provides access control through which you can assign roles to users that you add to your My Nutanix account. When you sign up for a My Nutanix account, you have Account Administrator permissions by default. You can add two more users with the Account Administrator role to the same account. Therefore, one account can have only three users with the Account Administrator role at any given time. To add users to your account, you can either integrate the SAML authentication solution (Active Directory, Okta, and others) of your organization with My Nutanix, or invite specific users to access the Nutanix Clusters console.

## User Roles
The following user roles are available in Nutanix Clusters.
- Account Administrator: This role has the highest level of access in My Nutanix and 
has the permissions to access and manage your complete My Nutanix undertaking. 
There can be only three account administrators at any given time.
- Admin: This role is the Nutanix Clusters administrator.

The Nutanix Clusters console has the following entities:
- Customer: This entity is the highest business entity in the Nutanix Clusters platform. 
You create multiple organizations under a customer and then create clusters within an 
organization. When you sign up for Nutanix Clusters, a customer entity is created for 
you. You then create an organization, add an Azure account to that Organization, and 
create clusters in that Organization. You cannot create a new Customer entity in your 
Nutanix Clusters platform.
- Organization: This entity allows you to set up unique environments for different 
departments within your company. You can create multiple clusters within an 
organization. You can segregate your clusters based on your specific requirements. For 
example, create an organization Finance and then create a cluster in the Finance 
organization to run only your finance-related applications.
> [!NOTE]
> One Azure cloud account can be part of only one organization. However, an 
organization can have multiple Azure cloud accounts.

The following table identifies the permissions of the user roles in the Nutanix Clusters console.

|Permissions Account |Administrator|Admin|  
|----------|-----------|------------|  
User Management in My Nutanix|Yes |Yes|  
Billing Management in My Nutanix |Yes |Yes|  
Access to Nutanix Clusters |Yes |Yes|  
Customers  
Analytics and Monitoring of Customers |Yes |Yes|  
Organizations  
Create Organizations |Yes |Yes|  
Analytics and Monitoring of Organizations |Yes |Yes|  
Clusters | | |  
Create Clusters |Yes |Yes|  
Analytics and Monitoring of Clusters |Yes |Yes|  
View and Manage Clusters |Yes |Yes|  

See the Local User Management section of the Xi Cloud Services Administration Guide to invite 
and manage local users.

> [!NOTE]
> The User role described in the Local User Management section of the Xi Cloud Services 
Administration Guide is not applicable to Nutanix Clusters.

See the SAML Authentication section of the Xi Cloud Services Administration Guide to integrate 
the SAML authentication solution (Active Directory, Okta, and others) of your organization with 
My Nutanix


## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
