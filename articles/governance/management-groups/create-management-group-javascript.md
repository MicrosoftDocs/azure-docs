---
title: 'Quickstart: Create a management group with JavaScript'
description: In this quickstart, you use JavaScript to create a management group to organize your resources into a resource hierarchy.
ms.date: 02/05/2021
ms.topic: quickstart
ms.custom:
  - devx-track-js
  - mode-api
---
# Quickstart: Create a management group with JavaScript

Management groups are containers that help you manage access, policy, and compliance across multiple
subscriptions. Create these containers to build an effective and efficient hierarchy that can be
used with [Azure Policy](../policy/overview.md) and [Azure Role Based Access
Controls](../../role-based-access-control/overview.md). For more information on management groups,
see [Organize your resources with Azure management groups](overview.md).

The first management group created in the directory could take up to 15 minutes to complete. There
are processes that run the first time to set up the management groups service within Azure for your
directory. You receive a notification when the process is complete. For more information, see
[initial setup of management groups](./overview.md#initial-setup-of-management-groups).

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- Before you start, make sure that at least version 12 of [Node.js](https://nodejs.org/) is
  installed.

- Any Azure AD user in the tenant can create a management group without the management group write
  permission assigned to that user if
  [hierarchy protection](./how-to/protect-resource-hierarchy.md#setting---require-authorization)
  isn't enabled. This new management group becomes a child of the Root Management Group or the
  [default management group](./how-to/protect-resource-hierarchy.md#setting---default-management-group)
  and the creator is given an "Owner" role assignment. Management group service allows this ability
  so that role assignments aren't needed at the root level. No users have access to the Root
  Management Group when it's created. To avoid the hurdle of finding the Azure AD Global Admins to
  start using management groups, we allow the creation of the initial management groups at the root
  level.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Application setup

To enable JavaScript to manage management groups, the environment must be set up. This setup works
wherever JavaScript can be used, including [bash on Windows 10](/windows/wsl/install-win10).

1. Set up a new Node.js project by running the following command.

   ```bash
   npm init -y
   ```

1. Add a reference to the yargs module.

   ```bash
   npm install yargs
   ```

1. Add a reference to the Azure Resource Graph module.

   ```bash
   npm install @azure/arm-managementgroups
   ```

1. Add a reference to the Azure authentication library.

   ```bash
   npm install @azure/ms-rest-nodeauth
   ```

   > [!NOTE]
   > Verify in _package.json_ `@azure/arm-managementgroups` is version **1.1.0** or higher and
   > `@azure/ms-rest-nodeauth` is version **3.0.5** or higher.

## Create the management group

1. Create a new file named _index.js_ and enter the following code.

   ```javascript
   const argv = require("yargs").argv;
   const authenticator = require("@azure/ms-rest-nodeauth");
   const managementGroups = require("@azure/arm-managementgroups");

   if (argv.groupID && argv.displayName) {
       const createMG = async () => {
          const credentials = await authenticator.interactiveLogin();
          const client = new managementGroups.ManagementGroupsAPI(credentials);
          const result = await client.managementGroups.createOrUpdate(
             groupId: argv.groupID,
             {
                 displayName: argv.displayName
             }
          );
          console.log(result);
       };

       createMG();
   }
   ```

1. Enter the following command in the terminal:

   ```bash
   node index.js --groupID "<NEW_MG_GROUP_ID>" --displayName "<NEW_MG_FRIENDLY_NAME>"
   ```

   Make sure to replace each token `<>` placeholder with your _management group ID_ and _management
   group friendly name_, respectively.

   As the script attempts to authenticate, a message similar to the following message is displayed
   in the terminal:

   > To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code FGB56WJUGK to authenticate.

   Once you authenticate in the browser, then the script continues to run.

The result of creating the management group is output to the console.

## Clean up resources

If you wish to remove the installed libraries from your application, run the following command.

```bash
npm uninstall @azure/arm-managementgroups @azure/ms-rest-nodeauth yargs
```

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
