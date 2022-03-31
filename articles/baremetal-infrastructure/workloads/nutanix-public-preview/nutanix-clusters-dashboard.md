---
title: Nutanix Clusters Dashboard
description: 
ms.topic: how-to
ms.subservice:  
ms.date: 03/31/2021
---

# Nutanix Clusters Dashboard

The Nutanix Clusters dashboard displays information about clusters, organizations, and 
customers.

This article explains all the tasks you can perform and view from this dashboard.
If you have access to both Frame and Clusters, click the drop-down icon at the top and choose 
Clusters to access the Nutanix Clusters console.

## Main Menu

The following options are displayed in the main menu at the top of the Nutanix Clusters Console.

## Navigation Menu

The navigation menu has three tabs: Clusters, Organizations, and Customers. The tab select is 
displayed in the top-left corner.

## Tasks

-  Circle icon displays ongoing actions performed in a system that takes a while to 
complete.
For example, actions like creating a cluster or changing cluster capacity.
Circle icon also displays the progress of each ongoing task, and a success message 
appears if the task is complete, or an error message appears if the task fails.
- Gear icon displays the source details of each task performed.
For example, Account, Organization, or Customer.

## Notifications

- Bell icon displays notifications if some event in the system occurs or if there is a need to 
act and resolve the existing issue.
Warning: You can choose to Dismiss notifications from the Notification Center. 
However, the dismissed notifications no longer appear to you or any other user.
- Gear icon displays source details and a tick mark to acknowledge notifications.
- Drop-down arrow to the right of each notification displays more information about the notification.

> [!NOTE]
>  If you want to receive notifications about a cluster that is not created by you, you must be an organization admin and subscribe to notifications of respective clusters in the Notification 
Center. 
The cluster creator is subscribed to notifications by default.

## User Menu

Displays username option to Edit the account details.

1. Edit option displays the following tabs.
    - General: Edit your First name, Last name, Email, and Change password from 
this screen. This screen also displays various roles assigned.
    - Preferences: Displays enable or disable slider options based on preference.
    - Advanced: Displays various assertion fields and values.
    - Notification Center: Displays the list of Tasks, Notifications, and 
Subscriptions from this view.
1. Go to Dashboard to go back to the main menu, and Logout options are displayed

## Navigation Menu

The navigation menu has three tabs on the top: Clusters, Organizations, and Customers. It has two 
tabs in the bottom: Documentation and Support.

1. Displays the Create Cluster option to create a new cluster.
1. Provides a search bar to Search Clusters.
1. Displays a list of all active clusters by default.
Displays a filter button to the right of the search bar. Click Active or Deleted to switch 
the list of currently visible active or terminated clusters, respectively.
1. Displays details of each cluster like Name, Organization, Cloud, Created On, 
Capacity, and Status.
Last created cluster is on top by default and to change the order, click cluster Name 
heading to change the value and direction by which the entries are ordered.
1. The Ellipsis icon against each cluster displays options like Audit Trail, Users, 
Notification Center, Update and Hibernate.
    - Audit Trail: Contains activity log of all actions performed by the user on a 
specific cluster.
    - Users: Contains all the screens for user management like User Invitations, Permissions, Authentication Providers.
    - Notification Center: Shows complete list of all the tasks and notifications.
    - Update: Contains screens to update the settings of clusters.
    - Hibernate: Opens a dialog box for Cluster Hibernation or a Resume option appears if the cluster is already hibernated.

## Organizations

1. Displays the Create Organization option to create a new organization.
1. Provides a search bar to Search Organizations.
1. Displays a list of active organizations by default.
Displays a filter button to the right of the search bar. Click Active or Terminated to 
switch the list of currently visible active or terminated organizations, respectively.
1. Displays the details of each organization such as Name, Customer, Description, URL 
Name, and Status.
The last created organization is on the top by default and to change the order, click on 
organization Name heading to change the value and direction by which the entries are 
ordered.
1. The Ellipsis icon against each organization displays options like Audit Trail, Users, 
Notification Center, and Update.
    - Audit Trail: Contains activity log of all actions performed on a specific organization.
    - Users: Contains all screens for user management like User Invitations, Permissions, Authentication Providers.
    - Notification Center: Shows complete list of all Tasks and Notifications.
    = Cloud Accounts: Displays status of the Cloud Account if it is active (A-Green) or inactive (I-Red).
    - Update: Contains options to update settings of organizations.

## Customers

1. Displays a search bar to Search Customers.
1. Displays a list of active clusters by default.  
Displays a filter button to the right of the search bar. 
    - Click Active or Terminated to 
switch the list of currently visible active or terminated customers, respectively.
1. Displays details of each customer like Customer Name, Description, URL Name, 
Billing and Status.  
The last created customer is on the top by default and to change the order, click on 
customer Name heading to change the value and direction by which the entries are 
ordered.
1. The ellipsis icon against each customer displays options like Audit Trail, Users, 
Notification Center, Update and Cloud Accounts.
    - Audit Trail: Contains activity log of all actions performed on a specific cluster.
    - Users: Contains all screens for user management like User Invitations, 
Permissions, Authentication Providers.
    - Notification Center: Shows complete list of all tasks and notifications.
    - Cloud Accounts: Displays status of the Cloud Account if it is active(A-Green) or inactive(I-Red).
    - Update: Contains options to update settings of customers.

## Documentation

Directs you to the documentation section of Nutanix Clusters.

## Support

Directs you to the Nutanix Support portal.


## Next steps

Learn more about Nutanix:

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
