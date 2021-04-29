---
title: 'Quickstart: Create a management group with Python'
description: In this quickstart, you use Python to create a management group to organize your resources into a resource hierarchy.
ms.date: 01/29/2021
ms.topic: quickstart
ms.custom:
  - devx-track-python
  - mode-api
---
# Quickstart: Create a management group with Python

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

## Add the Resource Graph library

To enable Python to manage management groups, the library must be added. This library works wherever
Python can be used, including [bash on Windows 10](/windows/wsl/install-win10) or locally installed.

1. Check that the latest Python is installed (at least **3.8**). If it isn't yet installed, download
   it at [Python.org](https://www.python.org/downloads/).

1. Check that the latest Azure CLI is installed (at least **2.5.1**). If it isn't yet installed, see
   [Install the Azure CLI](/cli/azure/install-azure-cli).

   > [!NOTE]
   > Azure CLI is required to enable Python to use the **CLI-based authentication** in the following
   > examples. For information about other options, see
   > [Authenticate using the Azure management libraries for Python](/azure/developer/python/azure-sdk-authenticate).

1. Authenticate through Azure CLI.

   ```azurecli
   az login
   ```

1. In your Python environment of choice, install the required libraries for management groups:

   ```bash
   # Add the management groups library for Python
   pip install azure-mgmt-managementgroups

   # Add the Resources library for Python
   pip install azure-mgmt-resource

   # Add the CLI Core library for Python for authentication (development only!)
   pip install azure-cli-core
   ```

   > [!NOTE]
   > If Python is installed for all users, these commands must be run from an elevated console.

1. Validate that the libraries have been installed. `azure-mgmt-managementgroups` should be
   **0.2.0** or higher, `azure-mgmt-resource` should be **9.0.0** or higher, and `azure-cli-core`
   should be **2.5.0** or higher.

   ```bash
   # Check each installed library
   pip show azure-mgmt-managementgroups azure-mgmt-resource azure-cli-core
   ```

## Create the management group

1. Create the Python script and save the following source as `mgCreate.py`:

   ```python
   # Import management group classes
   from azure.mgmt.managementgroups import ManagementGroupsAPI
   
   # Import specific methods and models from other libraries
   from azure.common.credentials import get_azure_cli_credentials
   from azure.common.client_factory import get_client_from_cli_profile
   from azure.mgmt.resource import ResourceManagementClient, SubscriptionClient
   
   # Wrap all the work in a function
   def createmanagementgroup( strName ):
       # Get your credentials from Azure CLI (development only!) and get your subscription list
       subsClient = get_client_from_cli_profile(SubscriptionClient)
       subsRaw = []
       for sub in subsClient.subscriptions.list():
           subsRaw.append(sub.as_dict())
       subsList = []
       for sub in subsRaw:
           subsList.append(sub.get('subscription_id'))
       
       # Create management group client and set options
       mgClient = get_client_from_cli_profile(ManagementGroupsAPI)
       mg_request = {'name': strName, 'display_name': strName}
       
       # Create management group
       mg = mgClient.management_groups.create_or_update(group_id=strName,create_management_group_request=mg_request)
       
       # Show results
       print(mg)
   
   createmanagementgroup("MyNewMG")
   ```

1. Authenticate with Azure CLI with `az login`.

1. Enter the following command in the terminal:

   ```bash
   py mgCreate.py
   ```

The result of creating the management group is output to the console as an `LROPoller` object.

## Clean up resources

If you wish to remove the installed libraries from your Python environment, you can do so by using
the following command:

```bash
# Remove the installed libraries from the Python environment
pip uninstall azure-mgmt-managementgroups azure-mgmt-resource azure-cli-core
```

## Next steps

In this quickstart, you created a management group to organize your resource hierarchy. The
management group can hold subscriptions or other management groups.

To learn more about management groups and how to manage your resource hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with management groups](./manage.md)
