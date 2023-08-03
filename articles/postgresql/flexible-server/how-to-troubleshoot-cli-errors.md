---
title: Troubleshoot Azure Database for PostgreSQL Flexible Server CLI errors
description: This topic gives guidance on troubleshooting common issues with Azure CLI when using PostgreSQL Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.author: sunila
author: sunilagarwal
ms.reviewer: ""
ms.topic: how-to
ms.date: 11/30/2021
---

# Troubleshoot Azure Database for PostgreSQL Flexible Server CLI errors

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This doc will help you troubleshoot common issues with Azure CLI when using PostgreSQL Flexible Server.

## Command not found

 If you receive and error that a command **is misspelled or not recognized by the system**. This could mean that CLI version on your client machine may not be up to date. Run ```az upgrade``` to upgrade to latest version. Doing an upgrade of your CLI version can help resolve issues with incompatibilities of a command due to any API changes.
 
## Debug deployment failures 
Currently, Azure CLI doesn't support turning on debug logging, but you can retrieve debug logging following the steps below.

>[!NOTE]
> - Replace ```examplegroup``` and ```exampledeployment``` with the correct resource group and deployment name for your database server. 
> - You can see the Deployment name in the deployments page in your resource group. See [how to find the deployment name](../../azure-resource-manager/templates/deployment-history.md?tabs=azure-portal)

1. List the deployments in resource group to identify the PostgreSQL Server deployment.

    ```azurecli
        az deployment operation group list \
          --resource-group examplegroup \
          --name exampledeployment
    ```

2. Get the request content of the PostgreSQL Server deployment 
    ```azurecli
        az deployment operation group list \
          --name exampledeployment \
          -g examplegroup \
          --query [].properties.request
    ```

3. Examine the response content 

    ```azurecli
    az deployment operation group list \
      --name exampledeployment \
      -g examplegroup \
      --query [].properties.response
    ```

## Error codes

| Error code | Mitigation |
| ---------- | ---------- | 
|MissingSubscriptionRegistration|Register your subscription with the resource provider. Run the command ```az provider register --namespace Microsoft.DBPostgreSQL``` to resolve the issue.|
|InternalServerError| Try to view the activity logs for your server to see if there is more information. Run the command ```az monitor activity-log list --correlation-id <enter correlation-id>```. You can try the same CLI command after a few minutes. If the issues persists, please [report it](https://github.com/Azure/azure-cli/issues) or reach out to Microsoft support.|
|ResourceNotFound| Resource being reference cannot be found.  You can check resource properties, or check if resource is deleted or check if the resource is another subscription. |
|LocationNotAvailableForResourceType| - Check availability of Azure Database for PostgreSQL Flexible Server in [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). <br>- Check if Azure Database for PostgreSQL Resource types is registered with your subscription. |
|ResourceGroupBeingDeleted| Resource group is being deleted. Wait for deletion to complete.|
|PasswordTooLong| The provided password is too long. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|PasswordNotComplex| The provided password is not complex enough.  It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|PasswordTooShort| It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|SubscriptionNotFound| The requested subscription was not found. Run ```az account list all``` to see all your current subscriptions.|
|InvalidParameterValue| An invalid value was given to a parameter.Check the [CLI reference docs](/cli/azure/postgres/flexible-server) to see what is the correct values supported for the arguments.|
|InvalidLocation| An invalid location was specified. Check availability of Azure Database for PostgreSQL Flexible Server in [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql) |
|InvalidServerName|Identified an invalid server name. Check the sever name. Run the command [az mysql flexible-server list](/cli/azure/mysql/flexible-server#az-mysql-flexible-server-list) to see all the list of Flexible servers available.|
|InvalidResourceIdSegment| A syntax error was identified in your Azure Resource Manager template. Use a JSON formatter tool to validate the JSON to identify the syntax error.|
|InvalidUserName| Enter a valid username. The admin user name can't be azure_superuser, azure_pg_admin, admin, administrator, root, guest, or public. It can't start with pg_.|
|BlockedUserName| The admin user name can't be azure_superuser, azure_pg_admin, admin, administrator, root, guest, or public. It can't start with pg_. Avoid using these patterns in the admin name.|

## Next steps

- If you are still experiencing issues, please [report the issue](https://github.com/Azure/azure-cli/issues). 
- If you have questions, visit our Stack Overflow page: https://aka.ms/azcli/questions. 
- Let us know how we are doing with this survey https://aka.ms/azureclihats. 
