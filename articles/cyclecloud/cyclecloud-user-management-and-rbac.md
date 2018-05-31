# User Creation and Role-Based Access Control

## Authentication

Azure CycleCloud offers three methods of authentication: a built-in database with encryption, Active Directory, or LDAP. To select and setup your authentication method, open the **Settings** page from the Admin menu (top right of your screen) and double-click on **Authentication**. Choose your preferred authentication method and follow the instructions below.

### Built-In

By default, CycleCloud uses a simple database authorization scheme. The passwords are encrypted and stored in the database, and users authenticate against their stored username and password. To select this method, click the check box for Built-In on the Authentication page.

You can test a user's credentials by entering the username and password then clicking **Test** to verify the information.

### Active Directory

> [!NOTE]
> It is possible to lock yourself out of your CycleCloud instance when changing from local to AD or LDAP authentication. Access will be granted to users that have both a local account and can authenticate to the server configured (local passwords will be ignored). The instructions below make effort to guard against lockout.

1. Click the check box to enable Active Directory
2. Enter the appropriate Active Directory settings
3. Click "Test" to ensure that CycleCloud can use the provided settings. Use an account that exists on your authentication server.
4. In a separate browser or incognito window, log in as the domain account you added in step 2.
5. If the login in step 4 is successful, you can log out of your first session. Authentication is correctly configured.

![Active Directory configuration](~/images/active-directory.png)

The example above shows a sample configuration for an Active Directory environment. Windows users
log in as EXAMPLE\\username, so "EXAMPLE" is entered as the Domain. Authentication is handled by
the server ad.example.com, so "ldaps://ad.example.com" is entered as the URL.

> [!NOTE]
> After a failed authentication attempt, the "Authentication failed" message may still display
in the **Authentication settings** window. Clicking **cancel** and starting again will clear
this message. Successful authentication will replace the "Authentication failed" message
with "Authentication succeeded".

### LDAP

1. Click the check box to enable LDAP authentication
2. Enter the appropriate LDAP settings
3. Click "Test" to ensure that CycleCloud can use the provided settings. Use an account that exists on your authentication server.
4. In a separate browser or incognito window, log in as the domain account you added in step 2.
5. If the login in step 4 is successful, you can log out of your first session. Authentication is correctly configured.

## Password Policy

Azure CycleCloud has an integrated password policy and security measures. Accounts that are created using the built-in authentication method must have passwords between 8 and 123 characters long, and meet at least 3 of the following 4 conditions:

* Contain at least one upper case letter
* Contain at least one lower case letter
* Contain at least one number
* Contain at least one special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?  ~ \" ( ) ;

This will not affect accounts that were created within CycleCloud prior to version 6.6.1. Administrators can require users to update passwords to follow the new policy by selecting the "Force Password Change on Next Login" box within the Edit Account screen.

## Security Lock Out

Any account that detects 5 authorization failures within 60 seconds of each other will automatically be locked for 5 minutes. Accounts can be unlocked by waiting the five minutes, or manually by an administrator.

## User Management

Administrators create and manage users through the User page, which is accessed through the **User Management** link in the upper-right dropdown menu. Selecting this link will bring up the Users page that lists all known users of the system, their names and their associated roles in the application.

# Role Based Access Control

Users can be assigned roles to control the level of access they have. A user can be assigned multiple roles for greater flexibility. To modify a user's roles, access the user list through the **User Management** page. Select the desired user and click **Edit**.

The default roles are:

| Role               | Permission                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| Administrator      | Permission to view and change nearly all data.                              |
| Auditor            | Read-only access to all data.                                               |
| Cluster Admin      | Permission to manage all clusters and configure cluster-related options.    |
| Cluster Creator    | Permission to create new clusters.                                          |
| cyclecloud_access  | Specific access control for the Azure CycleCloud application.               |
| Data Admin         | Permission to manage all data endpoints and configure data-related options. |
| Job Admin          | Permission to manage all jobs and configure job-related options.            |
| User               | Normal users with GUI access and permission to manage owner resources.      |

These default roles are read-only and cannot be changed. You can, however, create new roles with custom permissions to allow users to perform functions outside the predefined role.

## Creating Custom Roles

Every user in the system is assigned one or more **roles** for authorization control. These roles consist of a set of **permissions** specifying what the user can do and cannot do, with each permission being a list of discrete **operations** that the server can perform, grouped for convenience. Operations are very granular, to support precise authorization rules. For example, starting, stopping, and rebooting a virtual machine are separate operations. It is possible to create a permission that only allows the rebooting a machine.

Within the **User Management** page, click on the **Roles** tab. Click **Create** to add a new role. Give the new role a name and description, then select the site-wide permissions for the new role. If the Role is related to a Group, check the **Group Role** box to enable the role within the Groups page. You can also specify permissions on a resource level, should the need arise.

> [!NOTE]
>The predefined roles within CycleCloud provide appropriate access for the majority of users. You may not need to create custom roles at all.

## Sharing Resources

Resources can be shared directly with a user or a group. They can also be shared with multiple users/groups, with each user/group having separate associated permissions.

> [!NOTE]
> The sharing of resources is currently limited to a superuser.

To share a resource, click on the **Clusters** tab within CycleCloud. Select the resource to
share from the list on the left. In the main window, click **Share**:

![Share Resource screen](~/images/share.png)

**Change Resource Owner**: Select a new owner from the dropdown menu and click **Save**. The user will
now have access to manage the resource.

**Share Resource**: Click **Add User**. From the dropdown menu, select the user you wish to share
the resource with. Select the appropriate Permissions for the user, and click **Save**. Repeat as
needed to share the resource with additional users.

**Edit Shared Resource**: Click **Share** to see the current owner and list of users with access
to the resource. To modify or delete a user's access, click their name in the Share Cluster window.
Make the required changes and click **Save**, or click **Delete** to remove the user's access from
the selected resource.
