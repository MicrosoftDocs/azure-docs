## Additional Prerequisites

 - Azure CLI. [Installation guide](/cli/azure/install-azure-cli)

## Setting Up

When using Active Directory for other Azure Resources, you should be using Managed identities. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../../../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../../../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../../../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../../../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager SDKs](../../../../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)
- [App services](../../../../../app-service/overview-managed-identity.md)

## Authenticate a registered application in the development environment

If your development environment doesn't support single sign-on or login via a web browser, then you can use a registered application to authenticate from the development environment.

<a name='creating-an-azure-active-directory-registered-application'></a>

### Creating a Microsoft Entra registered Application

To create a registered application from the Azure CLI, you need to be logged in to the Azure account where you want the operations to take place. To do this, you can use the `az login` command and enter your credentials in the browser. Once you're logged in to your Azure account from the CLI, we can call the `az ad sp create-for-rbac` command to create the registered application and service principal.

The following example uses the Azure CLI to create a new registered application:

```azurecli
az ad sp create-for-rbac --name <application-name> --role Contributor --scopes /subscriptions/<subscription-id>
```

The `az ad sp create-for-rbac` command will return a list of service principal properties in JSON format. Copy these values so that you can use them to create the necessary environment variables in the next step.

```json
{
    "appId": "generated-app-ID",
    "displayName": "service-principal-name",
    "name": "http://service-principal-uri",
    "password": "generated-password",
    "tenant": "tenant-ID"
}
```
> [!IMPORTANT]
> Azure role assignments may take a few minutes to propagate.

#### Set environment variables

The Azure Identity SDK reads values from three environment variables at runtime to authenticate the application. The following table describes the value to set for each environment variable.

| Environment variable  | Value                                    |
| --------------------- | ---------------------------------------- |
| `AZURE_CLIENT_ID`     | `appId` value from the generated JSON    |
| `AZURE_TENANT_ID`     | `tenant` value from the generated JSON   |
| `AZURE_CLIENT_SECRET` | `password` value from the generated JSON |

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you're using Visual Studio or another development environment, you may need to restart it in order for it to register the new environment variables.

Once these variables have been set, you should be able to use the DefaultAzureCredential object in your code to authenticate to the service client of your choice.
