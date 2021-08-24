---
title: Troubleshoot Azure Database for PostgreSQL Flexible Server CLI errors
description: This topic gives guidenace on troubleshooting common issues with Azure CLI when using PostgreSQL Flexible Server.
author: mksuni
ms.author: sumuth
ms.service: postgresql
ms.topic: troubleshoot
ms.date: 08/21/2021
---

# Troubleshoot Azure Database for PostgreSQL Flexible Server CLI errors

This doc will help you troubleshoot common issues with Azure CLI when using PostgreSQL Flexible Server.

## Command not found

 If you receive and error that a command **is misspelled or not recognized by the system**. This could mean that CLI version on your client machine may not be up to date. Run ```az upgrade``` to upgrade to latest version.   
 
## Debug deployment failures 
Currently, Azure CLI doesn't support turning on debug logging, but you can retrieve debug logging following the steps below.

- List the deployments in resource group to identify the PostgreSQL Server deployment 
	```azurecli

		az deployment operation group list \
		  --resource-group examplegroup \
		  --name exampledeployment
	```

- Get the request content of the PostgreSQL Server deployment 
	```azurecli

		az deployment operation group list \
		  --name exampledeployment \
		  -g examplegroup \
		  --query [].properties.request
	```
- Examine the response content 
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
|InternalServerError| This is a generic error.  Try to view the activity logs for your server to see if there is more information . Run the command ```az monitor activity-log list --correlation-id <enter correlation-id>```. You can try the same CLI command after a few minutes. If the issues persists, then reach out to [Azure CLI Github Issues](https://github.com/Azure/azure-cli/issues) or Microsoft support.|
|ResourceNotFound| Resource being reference cannot be found.  You can check resource properties , or check if resource is deleted or check if the resource is another subscription. |
|LocationNotAvailableForResourceType| -Check availability of Azure Database for Postgres Flexible Server in [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=postgresql). <br>- Check if Azure DB for PostgreSQL Resource types is registered with your subscription. |
|ResourceGroupBeingDeleted| Resource group is being deleted. Wait for deletion to complete.|
|PasswordTooLong| The provided password is too long. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|PasswordNotComplex| The provided password is not complex enough.  It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|PasswordTooShort| It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).|
|SubscriptionNotFound| The requested subscription was not found. Run ```az account list all``` to see all your current subscriptions.|
|InvalidParameterValue| An invalid value was given to a parameter.Check the [CLI reference docs](/cli/azure/postgres/flexible-server) to see what is the correct values supported for the arguments.|
|InvalidLocation - An invalid location was specified. |
|InvalidServerName| Invalid server name specified.Please check the sever name. |
|InvalidResourceIdSegment| This is usually a syntax error in your Azure resource manager template. Use an JSON formatter tool to validate the JSON to identify the syntax error.|
|InvalidUserName| Enter a valid username. The admin login name can't be azure_superuser, azure_pg_admin, admin, administrator, root, guest, or public. It can't start with pg_.|
|BlockedUserName| Enter a valid username. The admin login name can't be azure_superuser, azure_pg_admin, admin, administrator, root, guest, or public. It can't start with pg_.|

## Next steps

If you are still experiencing issues, report the issue on [Azure CLI Github Issues](https://github.com/Azure/azure-cli/issues).
